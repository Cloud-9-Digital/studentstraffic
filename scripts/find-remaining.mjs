import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function findRemaining() {
  const client = await pool.connect();
  try {
    const { rows: wdoms } = await client.query(`SELECT school_name FROM wdoms_directory_entries WHERE country_name = 'Uzbekistan'`);
    const { rows: unis } = await client.query(`SELECT name FROM universities WHERE country_id = 49`);
    
    // Quick and dirty manual filter. The wdoms name might be slightly different than my seeded shortened name.
    // E.g. "Alte University School of Medicine" vs "Alte University".
    
    console.log("=== REMAINING WDOMS ENTRIES TO SEED ===");
    for (const w of wdoms) {
      const match = unis.find(u => w.school_name.toLowerCase().includes(u.name.toLowerCase()) || u.name.toLowerCase().includes(w.school_name.toLowerCase()));
      
      // Some special cases
      const isEEU = w.school_name.includes("East European") && unis.some(u => u.name.includes("East European"));
      const isSEU = w.school_name.includes("SEU") && unis.some(u => u.name.includes("SEU"));
      const isMetekhi = w.school_name.includes("Metekhi") && unis.some(u => u.name.includes("Metekhi"));
      const isLegia = w.school_name.includes("Legia") && unis.some(u => u.name.includes("Legia"));
      
      if (!match && !isEEU && !isSEU && !isMetekhi && !isLegia) {
        console.log(`- ${w.school_name}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

findRemaining();
