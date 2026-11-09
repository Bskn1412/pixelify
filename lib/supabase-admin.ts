const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

export async function supabaseRpc<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase server environment is not configured.');
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function supabaseGet<T>(resource: string): Promise<T> {
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase server environment is not configured.');
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${resource}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

export async function supabaseUpsert(resource: string, row: Record<string, unknown>, conflictColumn: string): Promise<void> {
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase server environment is not configured.');
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${resource}?on_conflict=${encodeURIComponent(conflictColumn)}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
}
