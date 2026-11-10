-- score_transactions is the canonical successful-operation history. It is already
-- idempotent and is updated atomically with leaderboard by award_operation_point.
alter table public.score_transactions enable row level security;
revoke all on public.score_transactions from public, anon, authenticated;

create index if not exists score_transactions_user_created_idx
  on public.score_transactions (user_id, created_at desc);
create index if not exists score_transactions_action_created_idx
  on public.score_transactions (action, created_at desc);

create or replace function public.get_leaderboard_data(
  p_visitor_id uuid default null,
  p_period text default 'all'
)
returns jsonb language sql stable security definer set search_path = '' as $$
  with windowed as (
    select case p_period
      when 'week' then date_trunc('week', now())
      when 'month' then date_trunc('month', now())
      else '-infinity'::timestamptz
    end as starts_at
  ), scores as (
    select l.user_id, l.score::bigint as score
    from public.leaderboard l, windowed w
    where p_period = 'all' and l.score > 0
    union all
    select st.user_id, sum(st.points)::bigint as score
    from public.score_transactions st, windowed w
    where p_period in ('week', 'month') and st.created_at >= w.starts_at
    group by st.user_id
  ), ranked as (
    select u.id, u.username, u.display_name, u.avatar_url, u.country_code, u.created_at, s.score,
      rank() over (order by s.score desc) as rank
    from scores s join public.users u on u.id = s.user_id
    where s.score > 0
  ), participants as (
    select count(*)::bigint as count from public.leaderboard where score > 0
  )
  select jsonb_build_object(
    'top', coalesce((
      select jsonb_agg(to_jsonb(top_rows) order by top_rows.rank, top_rows.created_at asc, top_rows.id)
      from (select * from ranked order by score desc, created_at asc, id limit 101) top_rows
    ), '[]'::jsonb),
    'position', (select to_jsonb(r) from ranked r where r.id = p_visitor_id),
    'stats', jsonb_build_object('participants', (select count from participants))
  );
$$;

revoke all on function public.get_leaderboard_data(uuid, text) from public, anon, authenticated;
grant execute on function public.get_leaderboard_data(uuid, text) to service_role;

create or replace function public.get_activity_data(
  p_visitor_id uuid,
  p_type text default 'all',
  p_period text default 'all',
  p_limit integer default 20,
  p_offset integer default 0
)
returns jsonb language sql stable security definer set search_path = '' as $$
  with windowed as (
    select case p_period
      when 'today' then date_trunc('day', now())
      when 'week' then date_trunc('week', now())
      when 'month' then date_trunc('month', now())
      else '-infinity'::timestamptz
    end as starts_at
  ), all_activity as (
    select st.id, st.user_id as visitor_id, st.action, st.points, st.created_at
    from public.score_transactions st
    where st.user_id = p_visitor_id
  ), filtered as (
    select a.* from all_activity a, windowed w
    where a.created_at >= w.starts_at
      and (p_type = 'all' or (p_type = 'background_removal' and a.action = 'background_removal') or (p_type = 'upscale' and a.action = 'upscale'))
  ), summary as (
    select
      coalesce(sum(points), 0)::bigint as points,
      count(*)::bigint as total,
      count(*) filter (where action = 'background_removal')::bigint as backgrounds,
      count(*) filter (where action = 'upscale')::bigint as upscales
    from all_activity
  )
  select jsonb_build_object(
    'activities', coalesce((
      select jsonb_agg(to_jsonb(page_rows) order by page_rows.created_at desc, page_rows.id desc)
      from (select * from filtered order by created_at desc, id desc limit greatest(1, least(p_limit, 50)) offset greatest(0, p_offset)) page_rows
    ), '[]'::jsonb),
    'totalFiltered', (select count(*) from filtered),
    'summary', (select to_jsonb(summary) from summary)
  );
$$;

revoke all on function public.get_activity_data(uuid, text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.get_activity_data(uuid, text, text, integer, integer) to service_role;

-- Keep browser initiated rewards idempotent and cap unusually fast requests.
-- The successful processing callback remains the only client integration point;
-- point values and activity types are still selected by this trusted function.
create or replace function public.award_operation_point(p_visitor_id uuid, p_operation_id uuid, p_action text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare inserted_count integer;
begin
  if p_action not in ('background_removal', 'upscale') then raise exception 'Invalid score action'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_visitor_id::text));
  if exists (select 1 from public.score_transactions where user_id = p_visitor_id and operation_id = p_operation_id) then
    return false;
  end if;
  if (select count(*) from public.score_transactions where user_id = p_visitor_id and created_at >= now() - interval '1 hour') >= 60 then
    raise exception 'Reward rate limit exceeded';
  end if;
  insert into public.users (id, display_name) values (p_visitor_id, 'Pixelify User') on conflict (id) do nothing;
  insert into public.score_transactions (user_id, operation_id, action, points)
  values (p_visitor_id, p_operation_id, p_action, 1) on conflict (user_id, operation_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then return false; end if;
  insert into public.leaderboard (user_id, score, updated_at) values (p_visitor_id, 1, now())
  on conflict (user_id) do update set score = public.leaderboard.score + 1, updated_at = now();
  return true;
end;
$$;

revoke all on function public.award_operation_point(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.award_operation_point(uuid, uuid, text) to service_role;
