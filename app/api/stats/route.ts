import { NextResponse } from 'next/server';
import { supabaseRpc } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const HISTORICAL_UNIQUE_VISITORS = 77;
const HISTORICAL_PAGE_VIEWS = 77;

type PublicStats = {
  uniqueVisitors?: number;
  pageViews?: number;
  todayVisitors?: number;
  participants?: number;
};

export async function GET() {
  try {
    const stats = await supabaseRpc<PublicStats>('get_public_stats');
    return NextResponse.json(
      {
        ...stats,
        uniqueVisitors: (stats?.uniqueVisitors ?? 0) + HISTORICAL_UNIQUE_VISITORS,
        pageViews: (stats?.pageViews ?? 0) + HISTORICAL_PAGE_VIEWS,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ error: 'Visitor totals are unavailable.' }, { status: 503 });
  }
}
