import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const MBBS_COURSE_ID = 13;
const STANDARD_TITLE = "Doctor of Medicine (Equivalent to MBBS in India)";

async function run() {
  const client = await pool.connect();
  try {
    // Show before state
    const { rows: before } = await client.query(`
      SELECT po.title, COUNT(*) as count
      FROM program_offerings po
      WHERE po.course_id = $1
      GROUP BY po.title
      ORDER BY count DESC, po.title
    `, [MBBS_COURSE_ID]);

    console.log(`\nBefore: ${before.length} distinct program titles across UG medicine programs`);
    before.forEach(r => console.log(`  (x${r.count}) ${r.title}`));

    // Normalise all UG medicine program titles
    const { rowCount } = await client.query(`
      UPDATE program_offerings
      SET title = $1, updated_at = NOW()
      WHERE course_id = $2
    `, [STANDARD_TITLE, MBBS_COURSE_ID]);

    console.log(`\n✅ Updated ${rowCount} program offerings → "${STANDARD_TITLE}"`);

    // Verify
    const { rows: after } = await client.query(`
      SELECT po.title, COUNT(*) as count
      FROM program_offerings po
      WHERE po.course_id = $1
      GROUP BY po.title
    `, [MBBS_COURSE_ID]);

    console.log(`\nAfter: ${after.length} distinct title(s)`);
    after.forEach(r => console.log(`  (x${r.count}) ${r.title}`));
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);
