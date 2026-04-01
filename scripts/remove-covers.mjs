import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function removeCovers() {
  console.log("=== Removing Cover Images from ALL Universities ===");
  const client = await pool.connect();
  try {
    const res = await client.query('UPDATE universities SET cover_image_url = NULL, updated_at = NOW() RETURNING id');
    console.log(`Successfully removed cover images from ${res.rowCount} universities.`);
  } catch (error) {
    console.error("Error removing covers:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

removeCovers();
