/**
 * Patch Vietnam content into all cross-country/general blogs.
 * Uses targeted string insertion at section anchors.
 * Run: node scripts/patch-vietnam.mjs
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

// 1. Country overview section (for complete guide)
const VIETNAM_OVERVIEW = `
### Vietnam

Vietnam is an emerging and underrated MBBS destination for Indian students. Several universities are listed in the World Directory of Medical Schools (WDOMS/FAIMER), and a growing number have obtained NMC approval. The country offers tropical climate, low cost of living, and English-medium programs — all at fees significantly lower than Russia or Kazakhstan.

**Duration:** 6 years  
**Language:** English medium at international programs (Vietnamese language classes included)  
**Approximate tuition:** $3,000–$5,000/year  
**Total cost (6 years):** ₹30–45 lakh including living expenses  
**Key universities:** University of Medicine and Pharmacy Ho Chi Minh City (UMP-HCMC), Hanoi Medical University, Hue University of Medicine and Pharmacy  

**Pros:** Lowest cost of living among all MBBS abroad destinations, warm tropical climate year-round, safe and welcoming country, Indian food easily available in major cities, growing NMC recognition  
**Cons:** Fewer established Indian student communities compared to Russia/Kazakhstan, language barrier in clinical settings (Vietnamese-speaking patients), NMC recognition limited to specific universities — always verify current list`;

// 2. Vietnam fees section (for fees comparison)
const VIETNAM_FEES_SECTION = `
## Vietnam

Vietnam offers the most affordable MBBS education among all popular destinations for Indian students, with total all-in costs for 6 years frequently under ₹40 lakh.

### Tuition Fees (Annual, 2026)

| University | Annual Tuition (USD) | Annual Tuition (₹) |
|---|---|---|
| University of Medicine & Pharmacy HCMC (UMP-HCMC) | $3,500–$5,000 | ₹2.9–4.2L |
| Hanoi Medical University | $3,000–$4,500 | ₹2.5–3.8L |
| Hue University of Medicine and Pharmacy | $2,800–$4,000 | ₹2.4–3.4L |

### Living Costs (Annual, Ho Chi Minh City / Hanoi)

| Component | Annual |
|---|---|
| Hostel/accommodation | ₹60,000–1.0L |
| Food (self-cooking + eating out) | ₹80,000–1.4L |
| Transport (excellent public transit) | ₹15,000–30,000 |
| Personal expenses | ₹30,000–60,000 |

### Total Cost (6 Years) — UMP-HCMC

| Component | Cost |
|---|---|
| Tuition (6Y × ₹3.7L avg) | ₹22,20,000 |
| Hostel (6Y × ₹80K) | ₹4,80,000 |
| Food (6Y × ₹1.1L) | ₹6,60,000 |
| Personal (6Y × ₹45K) | ₹2,70,000 |
| Flights (6 round trips — affordable direct routes) | ₹2,40,000 |
| Visa and extensions | ₹40,000 |
| **Total** | **₹39,10,000** |

Post-graduation NExT coaching: add ₹2–4L

**Vietnam's cost advantage** is clear — at ₹39–45L all-in, it is the lowest-cost NMC-recognized MBBS abroad option available. The trade-off is a smaller established Indian student network and Vietnamese as the predominant language in clinical settings.

**Key NMC note:** Always verify each specific Vietnamese university against the current NMC approved list at nmc.org.in — only some universities in Vietnam are NMC-recognized. The number is growing, but not all institutions qualify.`;

// 3. Vietnam row for NEET country table
const VIETNAM_NEET_ROW = `| Vietnam | Yes | Some universities NMC-recognized — verify specific institution at nmc.org.in |`;

// 4. Vietnam in comparison table (fees + comparison blog)
const VIETNAM_COMPARISON_ROW = `| Vietnam (UMP-HCMC) | 6Y | ₹39–45L | English + Vietnamese | Yes (NExT) | Medium |`;

// 5. Vietnam student life content
const VIETNAM_STUDENT_LIFE = `
### Vietnam

Vietnam consistently surprises Indian students — it is arguably the easiest country to adapt to among all MBBS abroad destinations, primarily because of **food**.

**Food:**
Vietnamese cuisine is rice-based and vegetable-forward. Indian students in Ho Chi Minh City and Hanoi report substantially easier food adaptation than in Russia or Kazakhstan. Tofu, lentil-like dishes, stir-fried vegetables, and rice are daily staples — all close enough to Indian cooking that the adjustment is manageable. Indian grocery items are available in both cities. Several Indian restaurants operate in expat areas of HCMC.

**Weather:**
Ho Chi Minh City: Hot and humid year-round (28–35°C). Two seasons: dry (November–April) and monsoon (May–October). Students from South India (Tamil Nadu, Kerala, Andhra Pradesh) adapt immediately. Students from North India adapt within 2–4 weeks.
Hanoi: More variation — hot summers (35°C), cool winters (12–18°C). No extreme cold. No winter gear needed.

**Safety:**
Vietnam is one of the safest countries for international students. Low violent crime, very welcoming to foreigners, active tourist and expat infrastructure. Motorbike traffic is dense and chaotic — use caution when crossing streets, especially in HCMC.

**Language:**
English is widely spoken in universities, hospitals (in international programs), and urban areas. Vietnamese is challenging (6 tonal language) but you will not need it for daily survival — English suffices in most situations Indian students encounter.`;

// 6. Vietnam FMGE/NExT mention
const VIETNAM_FMGE = `
**Vietnam:** NMC-recognized universities are newer entrants — comprehensive FMGE outcome data is still emerging. University of Medicine and Pharmacy HCMC students who prepared actively from Year 1 report comparable outcomes to mid-tier Russia. The absence of large established Indian coaching networks at Vietnamese universities means more self-directed preparation is required.`;

// ── Patch functions ─────────────────────────────────────────────────────────

function insertAfter(content, anchor, insertion) {
  const idx = content.indexOf(anchor);
  if (idx === -1) {
    console.warn(`  [warn] Anchor not found: "${anchor.slice(0,60)}..."`);
    return content;
  }
  return content.slice(0, idx + anchor.length) + "\n" + insertion + content.slice(idx + anchor.length);
}

function insertBefore(content, anchor, insertion) {
  const idx = content.indexOf(anchor);
  if (idx === -1) {
    console.warn(`  [warn] Anchor not found: "${anchor.slice(0,60)}..."`);
    return content;
  }
  return content.slice(0, idx) + insertion + "\n\n" + content.slice(idx);
}

function appendToEnd(content, addition) {
  return content.trimEnd() + "\n\n---\n\n" + addition;
}

// ── Blog-specific patches ───────────────────────────────────────────────────

const patches = {
  // Complete guide — insert Vietnam before Kyrgyzstan section
  "mbbs-abroad-complete-guide-for-indian-students": (content) => {
    if (content.includes("### Vietnam")) return content; // already patched
    return insertBefore(content, "### Kyrgyzstan", VIETNAM_OVERVIEW.trimStart());
  },

  // Fees comparison — insert Vietnam section before the comparison table
  "mbbs-abroad-fees-country-comparison-2026": (content) => {
    if (content.includes("## Vietnam")) return content;
    return insertBefore(content, "## Side-by-Side Comparison", VIETNAM_FEES_SECTION.trimStart());
  },

  // Fees comparison — also add Vietnam row to the side-by-side table
  // We'll handle this as a second pass on the already-returned content
  // by adding the row before the last row referencing Bangladesh
  "mbbs-abroad-fees-country-comparison-2026-table": (content) => {
    if (content.includes("Vietnam (UMP-HCMC)")) return content;
    return content.replace(
      "| Bangladesh (private) | 5Y | ₹40–65L | English | No | Medium |",
      VIETNAM_COMPARISON_ROW + "\n| Bangladesh (private) | 5Y | ₹40–65L | English | No | Medium |"
    );
  },

  // NEET cutoff — add Vietnam row to country table
  "neet-cutoff-for-mbbs-abroad-2026": (content) => {
    if (content.includes("Vietnam")) return content;
    return content.replace(
      "| Bangladesh | Yes*",
      VIETNAM_NEET_ROW + "\n| Bangladesh | Yes*"
    );
  },

  // NExT prep — add Vietnam FMGE note to pass rate section
  "next-fmge-screening-test-complete-preparation-guide": (content) => {
    if (content.includes("Vietnam")) return content;
    return insertAfter(
      content,
      "- Kyrgyzstan, some Uzbekistan universities: 6–15%",
      VIETNAM_FMGE.trimStart()
    );
  },

  // FMGE prep (old slug) — same patch
  "fmge-nmc-screening-test-2026-complete-preparation-guide": (content) => {
    if (content.includes("Vietnam")) return content;
    return appendToEnd(content,
      `## Vietnam: What Foreign Graduates Should Know\n\n` +
      `Vietnam is an NMC-recognized destination with growing recognition. ` +
      `University of Medicine and Pharmacy Ho Chi Minh City (UMP-HCMC) and Hanoi Medical University ` +
      `are the primary universities Indian students attend.\n\n` +
      `**NExT preparation for Vietnam graduates:** The clinical environment in Vietnam differs significantly from India — ` +
      `tropical disease profiles, Vietnamese-language clinical interactions, and smaller Indian student peer networks. ` +
      `This makes self-directed NExT preparation from Year 1 even more critical than in Russia or Kazakhstan, ` +
      `where large Indian communities provide informal coaching networks.\n\n` +
      `Recommended approach: enroll in an online test series (Marrow, PrepLadder) from Year 2, ` +
      `and build a remote study group with other Indian students at your university.`
    );
  },

  // Comparison blog — add Vietnam to the abroad cost table
  "mbbs-abroad-vs-private-mbbs-india-2026": (content) => {
    if (content.includes("Vietnam")) return content;
    return content.replace(
      "| Kyrgyzstan | ₹33–42L |",
      "| Vietnam (UMP-HCMC) | ₹39–45L |\n| Kyrgyzstan | ₹33–42L |"
    );
  },

  // Education loan — add Vietnam to the country note
  "education-loan-for-mbbs-abroad-2026": (content) => {
    if (content.includes("Vietnam")) return content;
    return content.replace(
      "| Bangladesh | Yes* |",
      "| Vietnam | Yes | NMC-recognized universities only; verify before applying |\n| Bangladesh | Yes* |"
    );
  },

  // Student life — add Vietnam section before the Tips section
  "indian-student-life-mbbs-abroad-2026": (content) => {
    if (content.includes("### Vietnam")) return content;
    return insertBefore(content, "### Tips Applicable Everywhere", VIETNAM_STUDENT_LIFE.trimStart());
  },
};

// ── Main ────────────────────────────────────────────────────────────────────

async function run() {
  console.log("=== Patching Vietnam content into general blogs ===\n");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    // Fetch all relevant blogs
    const slugs = [
      "mbbs-abroad-complete-guide-for-indian-students",
      "mbbs-abroad-fees-country-comparison-2026",
      "neet-cutoff-for-mbbs-abroad-2026",
      "next-fmge-screening-test-complete-preparation-guide",
      "fmge-nmc-screening-test-2026-complete-preparation-guide",
      "mbbs-abroad-vs-private-mbbs-india-2026",
      "education-loan-for-mbbs-abroad-2026",
      "indian-student-life-mbbs-abroad-2026",
    ];

    const { rows } = await client.query(
      `SELECT id, slug, content FROM blog_posts WHERE slug = ANY($1)`,
      [slugs]
    );

    for (const row of rows) {
      const patchFn = patches[row.slug];
      const patchFn2 = patches[row.slug + "-table"]; // optional second pass for fees blog

      if (!patchFn) {
        console.log(`  [skip] No patch defined for: ${row.slug}`);
        continue;
      }

      let patched = patchFn(row.content);
      if (patchFn2) patched = patchFn2(patched);

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

  console.log("\n✅ Vietnam content patched into all general blogs.\n");
}

run().catch(e => { console.error(e); process.exit(1); });
