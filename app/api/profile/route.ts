import { NextResponse } from 'next/server';
import { supabaseUpsert } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.visitorId !== 'string' || !UUID.test(body.visitorId) || typeof body.displayName !== 'string') {
      return NextResponse.json({ error: 'Invalid profile details.' }, { status: 400 });
    }

    const displayName = body.displayName.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
    if (displayName.length > 32) {
      return NextResponse.json({ error: 'Name must be 32 characters or fewer.' }, { status: 400 });
    }

    await supabaseUpsert('users', { id: body.visitorId, display_name: displayName || 'Pixelify User' }, 'id');
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not save your name right now.' }, { status: 503 });
  }
}
