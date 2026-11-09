import { NextResponse } from 'next/server';
import { supabaseRpc } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.visitorId !== 'string' || !UUID.test(body.visitorId)) {
      return NextResponse.json({ error: 'Invalid visitor ID.' }, { status: 400 });
    }
    const pagePath = typeof body.path === 'string' ? body.path.slice(0, 500) : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 1000) : '';
    await supabaseRpc<boolean>('track_page_view', {
      p_visitor_id: body.visitorId,
      p_page_path: pagePath.startsWith('/') ? pagePath : '/',
      p_referrer: referrer,
    });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not record visit.' }, { status: 503 });
  }
}
