alter table public.page_views
  add column if not exists network_hash text;

create index if not exists page_views_network_hash_created_idx
  on public.page_views (network_hash, created_at desc)
  where network_hash is not null;

create or replace function public.track_page_view(
  p_visitor_id uuid,
  p_page_path text,
  p_referrer text,
  p_network_hash text
)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  insert into public.users (id, display_name)
  values (p_visitor_id, 'Pixelify User')
  on conflict (id) do nothing;

  insert into public.page_views (visitor_id, user_id, page_path, referrer, network_hash)
  values (
    p_visitor_id,
    p_visitor_id,
    left(coalesce(p_page_path, '/'), 500),
    left(coalesce(p_referrer, ''), 1000),
    case when p_network_hash ~ '^[a-f0-9]{64}$' then p_network_hash else null end
  );

  return true;
end;
$$;

revoke all on function public.track_page_view(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.track_page_view(uuid, text, text, text) to service_role;

create or replace function public.get_public_stats()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'uniqueVisitors', (
      select count(distinct case
        when pv.network_hash is not null then 'ip:' || pv.network_hash
        else 'browser:' || pv.visitor_id::text
      end)
      from public.page_views pv
      where pv.network_hash is not null
        or not exists (
          select 1 from public.page_views known
          where known.visitor_id = pv.visitor_id and known.network_hash is not null
        )
    ),
    'pageViews', (select count(*) from public.page_views),
    'todayVisitors', (
      select count(distinct case
        when pv.network_hash is not null then 'ip:' || pv.network_hash
        else 'browser:' || pv.visitor_id::text
      end)
      from public.page_views pv
      where pv.created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc'
        and (
          pv.network_hash is not null
          or not exists (
            select 1 from public.page_views known
            where known.visitor_id = pv.visitor_id
              and known.network_hash is not null
              and known.created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc'
          )
        )
    ),
    'participants', (select count(*) from public.leaderboard where score > 0)
  );
$$;

create or replace function public.get_leaderboard_data(p_visitor_id uuid default null)
returns jsonb language sql stable security definer set search_path = '' as $$
  with ranked as (
    select u.id, u.username, u.display_name, u.avatar_url, u.created_at, l.score,
      rank() over (order by l.score desc, u.created_at asc, u.id asc) as rank
    from public.leaderboard l join public.users u on u.id = l.user_id
    where l.score > 0
  )
  select jsonb_build_object(
    'top', coalesce((
      select jsonb_agg(to_jsonb(top_rows) order by top_rows.rank)
      from (select * from ranked order by score desc, created_at asc, id asc limit 101) top_rows
    ), '[]'::jsonb),
    'position', (select to_jsonb(r) from ranked r where r.id = p_visitor_id),
    'stats', public.get_public_stats()
  );
$$;
