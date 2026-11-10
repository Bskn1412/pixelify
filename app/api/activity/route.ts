import { NextRequest, NextResponse } from 'next/server';
import { supabaseRpc } from '@/lib/supabase-admin';
import { verifiedVisitorId } from '@/lib/visitor-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const visitorId = verifiedVisitorId(request);
  if (!visitorId) return NextResponse.json({ error: 'Visitor identity is unavailable.' }, { status: 401 });
  const params = request.nextUrl.searchParams;
  const type = ['all', 'background_removal', 'upscale'].includes(params.get('type') || '') ? params.get('type')! : 'all';
  const period = ['all', 'today', 'week', 'month'].includes(params.get('period') || '') ? params.get('period')! : 'all';
  const page = Math.max(1, Number(params.get('page')) || 1);
  try {
    const [activity, ranking] = await Promise.all([
      supabaseRpc<{ activities: Array<{ id: number; action: string; points: number; created_at: string }>; totalFiltered: number; summary: { points: number; total: number; backgrounds: number; upscales: number } }>('get_activity_data', {
        p_visitor_id: visitorId, p_type: type, p_period: period, p_limit: 12, p_offset: (page - 1) * 12,
      }),
      supabaseRpc<{ position: { rank: number; score: number } | null }>('get_leaderboard_data', { p_visitor_id: visitorId, p_period: 'all' }),
    ]);
    return NextResponse.json({ ...activity, position: ranking.position }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Activity history is temporarily unavailable.' }, { status: 503 });
  }
}
