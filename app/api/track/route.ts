import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { supabaseRpc } from '@/lib/supabase-admin';
import { verifiedVisitorId } from '@/lib/visitor-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getNetworkHash(request: Request): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim().toLowerCase();
  const secret = process.env.VISITOR_IP_HASH_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_SECRET_KEY;

  if (!ip || !isIP(ip) || ip === '127.0.0.1' || ip === '::1' || !secret) return null;
  return createHmac('sha256', secret).update(ip).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visitorId = verifiedVisitorId(request);
    if (!visitorId || body.visitorId !== visitorId || typeof body.visitorId !== 'string' || !UUID.test(body.visitorId)) {
      return NextResponse.json({ error: 'Invalid visitor ID.' }, { status: 400 });
    }
    const pagePath = typeof body.path === 'string' ? body.path.slice(0, 500) : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 1000) : '';
    const countryHeader = request.headers.get('x-vercel-ip-country')?.toUpperCase() ?? null;
    const countryCode = countryHeader && /^[A-Z]{2}$/.test(countryHeader) && countryHeader !== 'XX'
      ? countryHeader
      : null;
    const trackingArgs = {
      p_visitor_id: visitorId,
      p_page_path: pagePath.startsWith('/') ? pagePath : '/',
      p_referrer: referrer,
      p_network_hash: getNetworkHash(request),
    };
    try {
      await supabaseRpc<boolean>('track_page_view', { ...trackingArgs, p_country_code: countryCode });
    } catch (error) {
      // Keep visit counting alive during the short window before the country migration is applied.
      if (!(error instanceof Error) || !error.message.includes('(404)')) throw error;
      await supabaseRpc<boolean>('track_page_view', trackingArgs);
    }
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not record visit.' }, { status: 503 });
  }
}
