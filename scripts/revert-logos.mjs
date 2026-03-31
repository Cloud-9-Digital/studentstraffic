import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function revert() {
  const client = await pool.connect();
  try {
    console.log("Reverting logos for Russian Universities...");
    const res = await client.query(`
      UPDATE universities
      SET logo_url = NULL
      WHERE country_id = 45;
    `);
    console.log(`Successfully reverted logos for ${res.rowCount} universities.`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

revert();
