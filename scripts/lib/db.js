// Shared database plumbing for the local maintenance scripts
// (run-migrations.js, clear-db.js): .env loading, connection string
// resolution and SSL configuration for Supabase.
//
// Supabase signs its TLS certificates with its own root CA, which Node does
// not trust. Modern pg treats sslmode=require as verify-full, so connecting
// needs either Supabase's root certificate or libpq-compatibility mode:
//
//   1. CA certificate found (project scripts/supabase-ca.crt, or the
//      SUPABASE_CA_CERT / PGSSLROOTCERT env var pointing to the PEM file
//      downloaded from Supabase Dashboard → Database settings → SSL
//      Configuration) → the connection is fully verified.
//   2. Otherwise → uselibpqcompat=true, which restores libpq semantics for
//      sslmode=require: the connection is encrypted but the certificate chain
//      is not verified. A note is printed so this is never silent.
//
// URLs without sslmode (plain local postgres) are untouched.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const projectRoot = path.resolve(__dirname, '..', '..');

export function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, value] = match;
    let cleaned = value.trim();
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = cleaned;
  }
}

export function loadProjectEnv() {
  loadEnvFile(path.join(projectRoot, '.env.local'));
  loadEnvFile(path.join(projectRoot, '.env'));
}

export function resolveDatabaseUrl(argv = process.argv.slice(2)) {
  const explicit = argv.find((arg) => !arg.startsWith('--'));
  const candidates = [
    explicit,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
  ];
  const url = candidates.find(Boolean);
  if (!url) {
    console.error('No database URL found. Pass one as an argument or set DATABASE_URL / POSTGRES_URL_NON_POOLING in .env.local.');
    process.exit(1);
  }
  // Prisma URLs carry pooler flags pg does not understand.
  return url.replace(/\?.*$/, url.includes('sslmode') ? '?sslmode=require' : '');
}

// host/database for log lines, never the password.
export function describeUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}:${parsed.port || 5432}${parsed.pathname}`;
  } catch {
    return '(custom connection)';
  }
}

function readCaCert() {
  const candidates = [
    process.env.SUPABASE_CA_CERT,
    process.env.PGSSLROOTCERT,
    path.join(projectRoot, 'scripts', 'supabase-ca.crt'),
  ].filter(Boolean);
  for (const file of candidates) {
    if (fs.existsSync(file)) return { file, pem: fs.readFileSync(file, 'utf8') };
  }
  return null;
}

export function createClient(databaseUrl) {
  if (!/[?&]sslmode=/.test(databaseUrl)) {
    return { client: new pg.Client({ connectionString: databaseUrl }), sslMode: 'no SSL requested' };
  }

  const ca = readCaCert();
  if (ca) {
    // sslrootcert/sslmode are parsed from the URL into pg's ssl options, which
    // avoids conflicts between the string's sslmode and an explicit ssl object.
    const verified = new URL(databaseUrl);
    verified.searchParams.set('sslmode', 'verify-full');
    verified.searchParams.set('sslrootcert', ca.file);
    const client = new pg.Client({ connectionString: verified.toString() });
    return { client, sslMode: `verify-full (CA: ${path.basename(ca.file)})` };
  }

  const fallback = new URL(databaseUrl);
  fallback.searchParams.set('uselibpqcompat', 'true');
  const client = new pg.Client({ connectionString: fallback.toString() });
  console.log('Note: no Supabase CA certificate found — connecting encrypted without certificate verification.');
  console.log('      For verify-full, download the CA from Supabase Dashboard → Database settings → SSL');
  console.log('      Configuration and save it as scripts/supabase-ca.crt (or set SUPABASE_CA_CERT).\n');
  return { client, sslMode: 'require (libpq compat, chain not verified)' };
}
