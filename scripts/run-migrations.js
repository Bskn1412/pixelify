// Applies every SQL migration in supabase/migrations, in filename order.
// Safe to re-run: the migrations are idempotent (create or replace / if not exists).
//
// Usage:
//   npm run migrations
//   npm run migrations -- "postgres://user:pass@host:5432/postgres"   (explicit URL)
//
// Connection string resolution: CLI argument > DATABASE_URL > POSTGRES_URL_NON_POOLING
// (direct connection, best for DDL) > POSTGRES_URL > POSTGRES_PRISMA_URL.
import fs from 'node:fs';
import path from 'node:path';
import { createClient, describeUrl, loadProjectEnv, projectRoot, resolveDatabaseUrl } from './lib/db.js';

loadProjectEnv();

const databaseUrl = resolveDatabaseUrl();
const dir = path.join(projectRoot, 'supabase', 'migrations');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.sql')).sort();
if (!files.length) {
  console.error(`No .sql files found in ${dir}`);
  process.exit(1);
}

const { client, sslMode } = createClient(databaseUrl);

try {
  await client.connect();
  console.log(`Connected to ${describeUrl(databaseUrl)} (${sslMode}).`);
  console.log(`Applying ${files.length} migration(s) in order…\n`);
  for (const name of files) {
    const file = path.join(dir, name);
    process.stdout.write(`Applying ${name} … `);
    try {
      await client.query(fs.readFileSync(file, 'utf8'));
      console.log('ok');
    } catch (error) {
      console.log(`FAILED\n\n  File: ${file}\n  Error: ${error.message}\n`);
      process.exit(1);
    }
  }
  console.log(`\nDone. ${files.length} migration(s) applied.`);
} catch (error) {
  const detail = [error.message, error.code, error.detail].filter(Boolean).join(' — ');
  console.error(`Could not connect to the database: ${detail || 'unknown error'}`);
  process.exit(1);
} finally {
  await client.end();
}
