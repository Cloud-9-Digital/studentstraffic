import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkCountries() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT c.id, c.name, COUNT(u.id) as university_count
      FROM countries c
      LEFT JOIN universities u ON c.id = u.country_id
      GROUP BY c.id, c.name
      ORDER BY university_count DESC;
    `);
    console.table(rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkCountries();
