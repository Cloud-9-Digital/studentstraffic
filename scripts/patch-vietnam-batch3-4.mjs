/**
 * Patch Vietnam content into the newly published batch 3 & 4 blogs.
 * Run: node scripts/patch-vietnam-batch3-4.mjs
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

// ── Vietnam content blocks ──────────────────────────────────────────────────

const VIETNAM_WITHOUT_NEET_FIX = `Many universities in Russia, Georgia, Kyrgyzstan, Vietnam, and other countries do not care about your NEET score.`;

const VIETNAM_CHEAPEST = `
---

## 4. Vietnam: The High-Value Alternative

While slightly more expensive in tuition than Kyrgyzstan, Vietnam's exceptionally low cost of living and robust safety metrics make it the strongest "value" option for the ₹35L–₹40L bracket, though stringent budgeters can sometimes keep it near the upper edge of the ₹25L–₹30L total range by minimizing personal expenses and sharing accommodation off-campus. 

**Realistic Total Cost (6 Years): ₹35 Lakhs – ₹42 Lakhs**  
*(Note: Exceeds the sheer ₹25L budget, but saves heavily on NExT coaching and living stress due to the environment).*

**Top Value Universities:**
*   **University of Medicine and Pharmacy HCMC (UMP-HCMC):** A premier government-backed institution offering English programs.
*   **Hanoi Medical University.**

**The Trade-off:** English proficiency locally is lower, and the initial tuition per year is slightly higher than Central Asia. But you get a tropical, highly safe lifestyle with zero extreme-cold gear expenses.`;

const VIETNAM_SAFETY_TABLE_ROW = `| **Vietnam** | ⭐⭐⭐⭐ | High | Very safe, welcoming to foreigners, tropical climate. |`;
const VIETNAM_SAFETY_STREET = `*   **Vietnam (Ho Chi Minh City / Hanoi):** Exceptional street safety. The atmosphere is highly welcoming and crime against international students is nearly unheard of.`;

// ── Patch functions ─────────────────────────────────────────────────────────

function insertAfter(content, anchor, insertion) {
  const idx = content.indexOf(anchor);
  if (idx === -1) {
    console.warn(`  [warn] Anchor not found: "${anchor.slice(0,40)}..."`);
    return content;
  }
  return content.slice(0, idx + anchor.length) + "\n" + insertion + content.slice(idx + anchor.length);
}

const patches = {
  // Without neet — add Vietnam to the list of countries
  "mbbs-abroad-without-neet-truth-2026": (content) => {
    return content.replace(
      "Many universities in Russia, Georgia, Kyrgyzstan, and other countries do not care about your NEET score.",
      VIETNAM_WITHOUT_NEET_FIX
    );
  },

  // Cheapest MBBS — add Vietnam section at the end of the list
  "cheapest-mbbs-abroad-options-indian-students": (content) => {
    if (content.includes("## 4. Vietnam")) return content;
    return content.replace(
      "---\n\n## Hidden Costs",
      VIETNAM_CHEAPEST.trimStart() + "\n\n---\n\n## Hidden Costs"
    ).replace( // fallback if markdown spacing differs
      "## Hidden Costs",
      VIETNAM_CHEAPEST.trimStart() + "\n\n## Hidden Costs"
    );
  },

  // Safety for female students — add to table and street section
  "is-mbbs-abroad-safe-for-female-students-2026": (content) => {
    let patched = content;
    if (!patched.includes("Vietnam (Ho Chi Minh City")) {
      patched = insertAfter(patched,
        "*   **Bangladesh:** Highly conservative society; the street environment is functionally identically to tier-2 Indian cities, but university campuses maintain extreme security.",
        VIETNAM_SAFETY_STREET + "\n"
      );
    }
    if (!patched.includes("**Vietnam** | ⭐⭐⭐⭐")) {
      patched = patched.replace(
        "| **Kyrgyzstan**| ⭐⭐⭐ | Medium | Safe on campus; petty theft in city markets requires caution. |",
        "| **Kyrgyzstan**| ⭐⭐⭐ | Medium | Safe on campus; petty theft in city markets requires caution. |\n" + VIETNAM_SAFETY_TABLE_ROW
      );
    }
    return patched;
  }
};

async function run() {
  console.log("=== Patching Vietnam into latest blogs ===\n");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const slugs = Object.keys(patches);
    const { rows } = await client.query(
      `SELECT id, slug, content FROM blog_posts WHERE slug = ANY($1)`,
      [slugs]
    );

    for (const row of rows) {
      const patchFn = patches[row.slug];
      let patched = patchFn(row.content);

      if (patched === row.content) {
        console.log(`  [skip] Already patched or anchor not found: ${row.slug}`);
        continue;
      }

      const diff = patched.length - row.content.length;
      await client.query(
        `UPDATE blog_posts SET content = $1, updated_at = NOW() WHERE id = $2`,
        [patched, row.id]
      );
      console.log(`  ✓ [${row.id}] ${row.slug} (+${diff} chars)`);
    }
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\n✅ Vietnam content patched into new blogs.\n");
}
run().catch(e => { console.error(e); process.exit(1); });
