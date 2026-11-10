// Clears all application data from the database: page views, leaderboard
// scores, score transactions and users. Schema, functions and permissions are
// left untouched.
//
// Usage:
//   npm run db:clear                 # dry run: shows row counts, deletes nothing
//   npm run db:clear -- --yes        # actually truncates all tables
//   npm run db:clear -- --yes "postgres://user:pass@host:5432/postgres"   # explicit URL
//
// IMPORTANT: npm swallows flags unless they follow "--". `npm run db:clear --yes`
// runs a dry run; use the form with "--" to wipe.
//
// Connection string resolution mirrors scripts/run-migrations.js.
import path from 'node:path';
import { createClient, describeUrl, loadProjectEnv, projectRoot, resolveDatabaseUrl } from './lib/db.js';

const TABLES = ['public.users', 'public.page_views', 'public.leaderboard', 'public.score_transactions'];

loadProjectEnv();

const confirmed = process.argv.includes('--yes');
const databaseUrl = resolveDatabaseUrl();
const { client, sslMode } = createClient(databaseUrl);

try {
  await client.connect();
  const counts = [];
  for (const table of TABLES) {
    const { rows } = await client.query(`select count(*)::bigint as count from ${table}`);
    counts.push({ table, count: Number(rows[0].count) });
  }

  console.log(`Database: ${describeUrl(databaseUrl)} (${sslMode})\n`);
  for (const { table, count } of counts) console.log(`  ${table.padEnd(28)} ${count.toLocaleString()} rows`);

  if (!confirmed) {
    console.log('\nDry run — nothing was deleted. Add "-- --yes" to truncate all tables above.');
    process.exit(0);
  }

  console.log('\nTruncating…');
  await client.query(`truncate table ${TABLES.join(', ')} restart identity`);
  for (const { table } of counts) {
    const { rows } = await client.query(`select count(*)::bigint as count from ${table}`);
    if (Number(rows[0].count) !== 0) {
      console.error(`${table} still has rows after truncate — aborting.`);
      process.exit(1);
    }
  }
  console.log('Done. All application data cleared; schema and functions untouched.');
} catch (error) {
  const detail = [error.message, error.code, error.detail].filter(Boolean).join(' — ');
  console.error(`Database error: ${detail || 'unknown error'}`);
  process.exit(1);
} finally {
  await client.end();
}
