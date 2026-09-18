/** Run without --apply to inspect. Apply backs up affected tables before a transactional write. */
import { loadEnvConfig } from '@next/env';
import { neon } from '@neondatabase/serverless';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { normalizeProgramMedium } from '../lib/program-medium';
loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
async function main() {
  const db = neon(process.env.DATABASE_URL!); const connection = new URL(process.env.DATABASE_URL!);
  const rows = await db`select id,slug,medium,instruction_languages from program_offerings order by id`;
  const changes = rows.map(r => ({ ...r, normalized: normalizeProgramMedium(r.medium, r.instruction_languages) })).filter(r => r.medium !== r.normalized.medium || JSON.stringify(r.instruction_languages) !== JSON.stringify(r.normalized.instructionLanguages));
  console.log(JSON.stringify({ target: connection.hostname, total: rows.length, changes: changes.length, unconfirmed: rows.filter(r => normalizeProgramMedium(r.medium,r.instruction_languages).medium === 'Not confirmed').length }));
  if (!process.argv.includes('--apply')) return;
  const dir = path.join(os.homedir(), '.codex/backups/studentstraffic'); fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const backup = path.join(dir, `medium-${Date.now()}.dump`);
  execFileSync('pg_dump', ['--format=custom','--no-owner','--no-acl','--table=public.program_offerings','--table=public.search_documents',`--file=${backup}`], { env: { ...process.env, PGHOST: connection.hostname, PGPORT: connection.port || '5432', PGDATABASE: connection.pathname.slice(1), PGUSER: decodeURIComponent(connection.username), PGPASSWORD: decodeURIComponent(connection.password), PGSSLMODE: 'require' }, stdio: 'pipe', timeout: 120000 });
  fs.chmodSync(backup, 0o600); if (fs.statSync(backup).size < 100) throw new Error('Backup incomplete'); console.log(`Backup: ${backup}`);
  const migration = fs.readFileSync('drizzle/0073_normalize_program_medium.sql','utf8');
  const search = await db`select id,medium from search_documents where medium is not null`;
  const queries = migration.split('--> statement-breakpoint').map(s => db.query(s));
  // Lock both tables so the audited snapshot cannot be overwritten by concurrent content edits.
  queries.unshift(db.query('LOCK TABLE program_offerings, search_documents IN SHARE ROW EXCLUSIVE MODE'));
  for (const r of changes) queries.push(db.query(`update program_offerings set medium=$1, instruction_languages=$2::text[], medium_details=concat_ws(E'\n\n',nullif(medium_details,''),$3::text) where id=$4 and medium=$5 and instruction_languages=$6::text[] returning id`, [r.normalized.medium,r.normalized.instructionLanguages,r.normalized.mediumDetails,r.id,r.medium,r.instruction_languages]));
  for (const r of search) { const value=normalizeProgramMedium(r.medium).medium; if(value!==r.medium) queries.push(db.query(`update search_documents set medium=$1, highlights=(select coalesce(jsonb_agg(case when item #>> '{}'=$2 then to_jsonb($1::text) else item end),'[]'::jsonb) from jsonb_array_elements(highlights) item) where id=$3 and medium=$2`,[value,r.medium,r.id])); }
  const journal=JSON.parse(fs.readFileSync('drizzle/meta/_journal.json','utf8')).entries.find((e: {tag:string})=>e.tag==='0073_normalize_program_medium');
  queries.push(db.query('insert into drizzle.__drizzle_migrations(hash,created_at) select $1,$2 where not exists(select 1 from drizzle.__drizzle_migrations where created_at=$2)',[crypto.createHash('sha256').update(migration).digest('hex'),journal.when]));
  await db.transaction(queries);
  const after=await db`select id,medium,instruction_languages,medium_details from program_offerings order by id`;
  if(after.length!==rows.length) throw new Error('Row count changed');
  for(const r of after) { const before=rows.find(old=>old.id===r.id)!; if(r.medium!==normalizeProgramMedium(r.medium,r.instruction_languages).medium) throw new Error(`Noncanonical row ${r.id}`); if(before.medium!==r.medium && !r.medium_details?.includes(before.medium)) throw new Error(`Missing original note ${r.id}`); }
  console.log(JSON.stringify({ verified: true, rows: after.length, notesPreserved: true, akfa: after.find(r=>rows.find(old=>old.id===r.id)?.slug.includes('akfa'))?.medium }));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
