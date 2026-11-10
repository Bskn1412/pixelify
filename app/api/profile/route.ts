import { NextRequest, NextResponse } from 'next/server';
import { supabaseUpsert } from '@/lib/supabase-admin';
import { verifiedVisitorId } from '@/lib/visitor-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visitorId = verifiedVisitorId(request);
    if (!visitorId || body.visitorId !== visitorId || typeof body.displayName !== 'string') {
      return NextResponse.json({ error: 'Invalid profile details.' }, { status: 400 });
    }

    const displayName = body.displayName.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
    if (displayName.length > 32) {
      return NextResponse.json({ error: 'Name must be 32 characters or fewer.' }, { status: 400 });
    }

    await supabaseUpsert('users', { id: visitorId, display_name: displayName || 'Pixelify User' }, 'id');
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not save your name right now.' }, { status: 503 });
  }
}
