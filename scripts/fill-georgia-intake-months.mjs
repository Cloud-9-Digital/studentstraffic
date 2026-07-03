/**
 * Fill missing intake_months on published Georgia MBBS program offerings.
 * Georgia's medical universities run two intakes each academic year — a main
 * September intake and a second January intake. This only fills offerings
 * where intake_months is currently empty; offerings with existing
 * university-specific intake data (e.g. Alte, East European University) are
 * left untouched.
 *
 * Run: node scripts/fill-georgia-intake-months.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE program_offerings po SET
        intake_months = $1,
        updated_at = NOW()
      FROM universities u, countries c
      WHERE po.university_id = u.id
        AND u.country_id = c.id
        AND c.slug = 'georgia'
        AND po.published = true
        AND u.published = true
        AND cardinality(po.intake_months) = 0
      RETURNING po.slug`,
      [["September", "January"]]
    );

    console.log(`Updated ${result.rowCount} Georgia program offerings:`);
    for (const row of result.rows) {
      console.log(`  ✓ ${row.slug}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
