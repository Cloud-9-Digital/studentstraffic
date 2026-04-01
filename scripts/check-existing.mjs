import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkUniversities() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT u.id, u.name, u.published, c.name as country 
      FROM universities u
      JOIN countries c ON u.country_id = c.id
      WHERE c.name IN ('Georgia', 'Kyrgyzstan', 'Uzbekistan')
      ORDER BY country, u.name;
    `);
    console.table(rows);
    console.log(`Total universities found: ${rows.length}`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUniversities();
