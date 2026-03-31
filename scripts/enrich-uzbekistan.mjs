/**
 * Enrich the Uzbekistan country page in the database.
 * Run: node scripts/enrich-uzbekistan.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^['"]|['"]$/g,"")]; })
);
neonConfig.webSocketConstructor = WebSocket;

// Highly authoritative, E-E-A-T and SEO-optimized content for Uzbekistan
const uzbekistanContent = {
  summary: `Uzbekistan has rapidly emerged as one of the most secure and budget-friendly destinations for Indian students pursuing an MBBS abroad in 2026. Following extensive modernizing reforms in its medical education sector, Uzbekistan offers a curriculum that is entirely aligned with the NMC (National Medical Commission) guidelines, including a 6-year English-medium program. With a growing ecosystem of both state-run historical institutes like Samarkand State Medical University and modernized campuses in Tashkent, the country sits in a "sweet spot" of affordability—typically ranging from ₹22 Lakhs to ₹26 Lakhs in total costs for the entire degree. The presence of direct, short flights from Delhi and a highly welcoming, low-crime environment makes it particularly appealing for Indian families.`,
  
  whyStudentsChooseIt: `### 1. The Strongest Budget-to-Quality Ratio
With total 6-year costs frequently falling under ₹25 Lakhs (including tuition and hostel), Uzbekistan provides a modern alternative to Kyrgyzstan, maintaining strict academic standards without the premium price tag of top-tier Russian universities.

### 2. 100% NMC Compliance & English Medium
The 6-year MD (MBBS equivalent) curriculum strictly adheres to the NMC's Foreign Medical Graduate Licentiate Regulations. All primary universities offer clinical exposure and instruction entirely in English, paired with local language classes for hospital interactions.

### 3. Exceptional Safety for International Students
Uzbekistan ranks exceptionally high for safety, boasting very low violent crime rates. The society is culturally conservative but highly welcoming to Indians, with a heavy police presence ensuring strict public order. It is consistently rated by Indian female students as one of the most secure destinations in Central Asia.

### 4. Seamless Connectivity
Direct flights run multiple times a week between New Delhi and Tashkent, dramatically reducing travel fatigue (approx. 3-hour flight times) compared to navigating internal regional flights in larger countries like Russia.`,

  metaTitle: `MBBS in Uzbekistan 2026: Cost, Universities & Admission Guide`,
  metaDescription: `Discover the reality of studying MBBS in Uzbekistan in 2026. Compare Samarkand, Tashkent & Bukhara universities, check honest fee structures under 25 Lakhs, and verify NMC compliance.`
};

async function run() {
  console.log("=== Enriching Uzbekistan Country Page ===\n");
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const r = await client.query(
      `UPDATE countries 
       SET 
         summary = $1, 
         why_students_choose_it = $2, 
         meta_title = $3, 
         meta_description = $4,
         updated_at = NOW()
       WHERE slug = 'uzbekistan'
       RETURNING id, name`,
      [
        uzbekistanContent.summary,
        uzbekistanContent.whyStudentsChooseIt,
        uzbekistanContent.metaTitle,
        uzbekistanContent.metaDescription
      ]
    );
    
    if (r.rows.length) {
      console.log(`  ✓ Successfully updated country page: ${r.rows[0].name} (ID: ${r.rows[0].id})`);
    } else {
      console.log(`  [error] Uzbekistan not found in countries table.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
