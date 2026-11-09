create or replace function public.get_leaderboard_data(p_visitor_id uuid default null)
returns jsonb language sql stable security definer set search_path = '' as $$
  with ranked as (
    select u.id, u.username, u.display_name, u.avatar_url, u.created_at, l.score,
      rank() over (order by l.score desc, u.created_at asc, u.id asc) as rank
    from public.leaderboard l join public.users u on u.id = l.user_id
    where l.score > 0
  ), stats as (
    select jsonb_build_object(
      'uniqueVisitors', (select count(distinct visitor_id) from public.page_views),
      'pageViews', (select count(*) from public.page_views),
      'todayVisitors', (select count(distinct visitor_id) from public.page_views where created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc'),
      'participants', (select count(*) from public.leaderboard where score > 0)
    ) as value
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(to_jsonb(top_rows) order by top_rows.rank) from (select * from ranked order by score desc, created_at asc, id asc limit 101) top_rows), '[]'::jsonb),
    'position', (select to_jsonb(r) from ranked r where r.id = p_visitor_id),
    'stats', stats.value
  ) from stats;
$$;
