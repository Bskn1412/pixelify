import { NextResponse } from 'next/server';
import { supabaseGet, supabaseRpc } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PlayerRow = { id: string; created_at?: string; country_code?: string | null; score?: number; rank?: number };
type LeaderboardData = { top: PlayerRow[]; position: PlayerRow | null; stats: unknown };

export async function GET(request: Request) {
  try {
    const rawVisitorId = new URL(request.url).searchParams.get('visitorId');
    const visitorId = rawVisitorId && UUID.test(rawVisitorId) ? rawVisitorId : null;
    const rawCountryCode = request.headers.get('x-vercel-ip-country')?.toUpperCase();
    const requestCountryCode = rawCountryCode && /^[A-Z]{2}$/.test(rawCountryCode) && rawCountryCode !== 'XX'
      ? rawCountryCode
      : null;
    const data = await supabaseRpc<LeaderboardData>('get_leaderboard_data', { p_visitor_id: visitorId });
    const playerIds = [...new Set([...data.top.map((player) => player.id), ...(data.position ? [data.position.id] : [])])]
      .filter((id) => UUID.test(id));

    if (playerIds.length) {
      try {
        const profileRows = await supabaseGet<Array<{ id: string; created_at: string }>>(
          `users?select=id,created_at&id=in.(${playerIds.map(encodeURIComponent).join(',')})`,
        );
        const createdAtById = new Map(profileRows.map((profile) => [profile.id, profile.created_at]));
        data.top = data.top.map((player) => ({ ...player, created_at: createdAtById.get(player.id) ?? player.created_at }));
        if (data.position) {
          data.position = { ...data.position, created_at: createdAtById.get(data.position.id) ?? data.position.created_at };
        }
      } catch {
        // The rankings remain available if profile dates cannot be fetched.
      }
    }

    // Keep visible top ranks deterministic while database migrations are rolling out.
    // Equal scores go to the account that joined earlier; UUID breaks exact timestamp ties.
    data.top = data.top
      .slice()
      .sort((a, b) =>
        (b.score ?? 0) - (a.score ?? 0) ||
        (a.created_at ?? '').localeCompare(b.created_at ?? '') ||
        a.id.localeCompare(b.id),
      )
      .map((player, index) => ({ ...player, rank: index + 1 }));

    if (visitorId && requestCountryCode) {
      data.top = data.top.map((player) => player.id === visitorId && !player.country_code
        ? { ...player, country_code: requestCountryCode }
        : player);
      if (data.position?.id === visitorId && !data.position.country_code) {
        data.position = { ...data.position, country_code: requestCountryCode };
      }
    }

    if (data.position) {
      const topPosition = data.top.find((player) => player.id === data.position?.id);
      if (topPosition) data.position = topPosition;
    }

    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Leaderboard is temporarily unavailable.' }, { status: 503 });
  }
}
