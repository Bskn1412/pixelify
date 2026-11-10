import { NextRequest, NextResponse } from 'next/server';
import { supabaseRpc } from '@/lib/supabase-admin';
import { verifiedVisitorId } from '@/lib/visitor-auth';

export const dynamic = 'force-dynamic';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ACTIONS = new Set(['background_removal', 'upscale']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visitorId = verifiedVisitorId(request);
    if (!visitorId || body.visitorId !== visitorId || !UUID.test(body.operationId || '') || !ACTIONS.has(body.action)) {
      return NextResponse.json({ error: 'Invalid reward request.' }, { status: 400 });
    }
    const awarded = await supabaseRpc<boolean>('award_operation_point', {
      p_visitor_id: visitorId,
      p_operation_id: body.operationId,
      p_action: body.action,
    });
    return NextResponse.json({ awarded: Boolean(awarded) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not record reward.' }, { status: 503 });
  }
}
