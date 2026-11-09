alter table public.users
  add column if not exists country_code text
  check (country_code is null or country_code ~ '^[A-Z]{2}$');

create or replace function public.track_page_view(
  p_visitor_id uuid,
  p_page_path text,
  p_referrer text,
  p_network_hash text,
  p_country_code text
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare valid_country_code text;
begin
  valid_country_code := case
    when p_country_code ~ '^[A-Z]{2}$' and p_country_code <> 'XX' then p_country_code
    else null
  end;

  insert into public.users (id, display_name, country_code)
  values (p_visitor_id, 'Pixelify User', valid_country_code)
  on conflict (id) do update
    set country_code = coalesce(excluded.country_code, public.users.country_code);

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

revoke all on function public.track_page_view(uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.track_page_view(uuid, text, text, text, text) to service_role;

create or replace function public.get_leaderboard_data(p_visitor_id uuid default null)
returns jsonb language sql stable security definer set search_path = '' as $$
  with ranked as (
    select u.id, u.username, u.display_name, u.avatar_url, u.country_code, u.created_at, l.score,
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
