import { NextResponse } from 'next/server';
import { supabaseRpc } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await supabaseRpc('get_public_stats');
    return NextResponse.json(stats, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Visitor totals are unavailable.' }, { status: 503 });
  }
}
