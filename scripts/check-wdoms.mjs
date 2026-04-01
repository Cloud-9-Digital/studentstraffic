import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkWdoms() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT country_name, COUNT(*) FROM wdoms_directory_entries GROUP BY country_name ORDER BY count DESC;
    `);
    console.table(rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkWdoms();
