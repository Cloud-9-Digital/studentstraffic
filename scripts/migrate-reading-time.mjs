/**
 * One-shot migration: adds reading_time_minutes column and backfills all rows.
 * Safe to re-run — uses IF NOT EXISTS and skips already-filled rows.
 * Run: node scripts/migrate-reading-time.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from "reading-time";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, "")]; })
);

neonConfig.webSocketConstructor = WebSocket;
const pool = new Pool({ connectionString: env.DATABASE_URL });
const client = await pool.connect();

try {
  // 1. Add column (idempotent)
  await client.query(`
    ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS reading_time_minutes integer;
  `);
  console.log("✓ Column reading_time_minutes ensured");

  // 2. Fetch only rows that need backfilling
  const { rows } = await client.query(
    `SELECT slug, content FROM blog_posts WHERE reading_time_minutes IS NULL`
  );
  console.log(`Backfilling ${rows.length} posts...`);

  for (const row of rows) {
    const mins = Math.ceil(readingTime(row.content).minutes);
    await client.query(
      `UPDATE blog_posts SET reading_time_minutes = $1 WHERE slug = $2`,
      [mins, row.slug]
    );
    console.log(`  ✓ ${row.slug} → ${mins} min`);
  }

  console.log("\nDone. All posts have reading_time_minutes populated.");
} finally {
  client.release();
  await pool.end();
}
