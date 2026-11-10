import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';

export const VISITOR_COOKIE = 'pixelify_visitor';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function secret() {
  return process.env.VISITOR_ID_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
}

export function canSignVisitorId() { return Boolean(secret()); }

function signature(id: string) {
  const key = secret();
  return key ? createHmac('sha256', key).update(id).digest('hex') : '';
}

export function verifiedVisitorId(request: NextRequest): string | null {
  const value = request.cookies.get(VISITOR_COOKIE)?.value || '';
  const [id, supplied] = value.split('.');
  const expected = signature(id || '');
  if (!UUID.test(id || '') || !supplied || !expected) return null;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? id : null;
}

export function setVisitorCookie(response: NextResponse, id: string) {
  response.cookies.set(VISITOR_COOKIE, `${id}.${signature(id)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 5,
  });
}
