import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { canSignVisitorId, setVisitorCookie, verifiedVisitorId } from '@/lib/visitor-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!canSignVisitorId()) return NextResponse.json({ error: 'Visitor identity signing is unavailable.' }, { status: 503 });
  const existing = verifiedVisitorId(request);
  const id = existing || randomUUID();
  const response = NextResponse.json({ visitorId: id }, { headers: { 'Cache-Control': 'no-store' } });
  if (!existing) setVisitorCookie(response, id);
  return response;
}
