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

// Keep the country copy aligned with the latest NMC/MEA advisories.
const uzbekistanContent = {
  summary: `Uzbekistan can still look affordable to Indian MBBS applicants, but it is no longer a destination that should be described as low-risk by default. In its alert dated 1 April 2026, the National Medical Commission warned students to exercise extreme caution before taking admission in Uzbekistan and reiterated that any failure on course duration, English-medium delivery, clinical training, or internship structure can make the India-return pathway fail under the Foreign Medical Graduate Licentiate Regulations, 2021.`,
  
  whyStudentsChooseIt: `### 1. The India-return pathway must be checked first
Before fees, flights, or city comparisons, families should verify whether the exact university and branch can satisfy FMGL 2021 on study duration, English-medium teaching, clinical training, and internship in the same institution.

### 2. Low fees are not enough
Uzbekistan may still appear in lower-budget selections, but NMC's warning means cost should come after compliance, not before it. Cheap admission is not a useful outcome if the degree later fails the India-return test.

### 3. University-by-university verification is mandatory
The country cannot be treated as uniformly compliant. Students should use direct university documents, NMC alerts, and the Indian Embassy in Tashkent together rather than relying on agents or brochure claims.

### 4. Branch, offshore, and agent-led models need extra caution
NMC's April 2026 alert specifically references complaints involving TSMU's Termez Branch offshore model and wider Embassy concerns on standards, language, and agent malpractice. Any similar setup should be verified in writing before payment.`,

  metaTitle: `MBBS in Uzbekistan 2026: NMC Alert, Universities & FMGL Checks`,
  metaDescription: `Review MBBS in Uzbekistan with the 1 April 2026 NMC alert in mind. Compare universities only after checking FMGL 2021 compliance, English-medium training, and internship structure.`
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
