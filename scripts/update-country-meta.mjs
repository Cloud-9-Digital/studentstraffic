// Idempotent upsert of curated meta_title / meta_description for the 11
// country pages (/countries/[slug]). Re-runnable and auditable — running it
// again with the same DATA below is a no-op (same values written again).
//
// Background: countries.meta_title / countries.meta_description already
// existed in the schema but app/countries/[slug]/page.tsx's generateMetadata
// was ignoring them, instead building a title from programs[0]?.course.shortName
// (an arbitrary "first" program), which produced misleading, course-locked
// titles (e.g. "Study Medical PG in Vietnam" for a page that covers all of a
// country's streams). This script rewrites the DB rows with accurate,
// verified-against-live-data copy; app/countries/[slug]/page.tsx was updated
// separately to actually read these columns.
//
// Every fact below (university counts, fee ranges, dominant stream) was
// verified against live `program_offerings`/`universities` data — see
// scripts/query-country-meta-audit*.mjs for the queries used to derive them.
// No invented stats.
//
// Usage: node scripts/update-country-meta.mjs [--dry-run]

import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const DRY_RUN = process.argv.includes("--dry-run");

const DATA = [
  {
    slug: "russia",
    metaTitle: "MBBS in Russia — 75+ Universities & Admissions 2026",
    metaDescription:
      "Compare 75+ NMC-recognised medical universities across Russia's cities by fees, teaching medium, and intake month — with visa guidance included.",
  },
  {
    slug: "vietnam",
    metaTitle: "MBBS in Vietnam — English-Medium Universities & Admissions",
    metaDescription:
      "Compare English-medium MBBS universities in Vietnam — among the most affordable medical degrees abroad, with free counselling and admissions support.",
  },
  {
    slug: "georgia",
    metaTitle: "MBBS in Georgia — 40+ Universities in Tbilisi & Beyond",
    metaDescription:
      "Compare 40+ MBBS universities across Tbilisi, Batumi, and Kutaisi by fees and teaching language — with free counselling for 2026 admissions.",
  },
  {
    slug: "kyrgyzstan",
    metaTitle: "MBBS in Kyrgyzstan — 30+ Universities, Pharmacy & Dental",
    metaDescription:
      "Compare 30+ MBBS universities in Kyrgyzstan, plus pharmacy and dental options, by fees, city, and intake month — with free admissions counselling.",
  },
  {
    slug: "albania",
    metaTitle: "Study in Albania — Nursing, Medical & Dental Degrees",
    metaDescription:
      "Explore EU-recognised nursing, medicine, dental, and pharmacy programs in Albania, with pathways to work in Germany and Italy, plus free counselling.",
  },
  {
    slug: "uzbekistan",
    metaTitle: "MBBS in Uzbekistan — 39 Universities in Tashkent & Bukhara",
    metaDescription:
      "Compare 39 MBBS universities across Tashkent, Bukhara, and other Uzbek cities — one of the most affordable options abroad, with free counselling.",
  },
  {
    slug: "lithuania",
    metaTitle: "BSc Nursing in Lithuania — EU-Recognised Degree Abroad",
    metaDescription:
      "Study EU-recognised BSc Nursing at LSMU Kaunas and other Lithuanian universities, with visa guidance and pathways to work anywhere in the EU.",
  },
  {
    slug: "germany",
    metaTitle: "BSc Nursing in Germany — Paid Dual Study & Visa Guide",
    metaDescription:
      "Compare paid dual-study BSc Nursing programmes in Germany with hospital training, B2 German requirements, and visa guidance for the 2026 intake.",
  },
  {
    slug: "italy",
    metaTitle: "MBBS in Italy — Public Universities, IMAT Exam & Fees",
    metaDescription:
      "Compare 20 public medical universities in Italy by government-regulated fees and the IMAT entrance exam — with free counselling for applicants.",
  },
  {
    slug: "canada",
    metaTitle: "BSc Nursing in Canada — Fees, PR Pathway & Universities",
    metaDescription:
      "Compare CASN-accredited BSc Nursing universities across 30+ Canadian cities, with study permit guidance, NCLEX-RN prep, and a pathway to PR.",
  },
  {
    slug: "malta",
    metaTitle: "MBBS & BDS in Malta — English-Medium EU Universities",
    metaDescription:
      "Explore MBBS and BDS programs at Malta's English-medium, EU-recognised universities — Schengen mobility, compact island life, free counselling.",
  },
];

function validate() {
  let ok = true;
  for (const row of DATA) {
    const titleLen = row.metaTitle.length;
    const descLen = row.metaDescription.length;
    const titleOk = titleLen <= 60;
    const descOk = descLen >= 140 && descLen <= 160;
    if (!titleOk || !descOk) ok = false;
    console.log(
      `${row.slug.padEnd(12)} title=${String(titleLen).padStart(3)}${
        titleOk ? "" : " ⚠️ OVER 60"
      }  desc=${String(descLen).padStart(3)}${
        descOk ? "" : " ⚠️ OUT OF 140-160"
      }`
    );
  }
  return ok;
}

async function main() {
  console.log("=== Validating character limits ===");
  const ok = validate();
  if (!ok) {
    console.error(
      "\nOne or more rows are outside the required limits (title <= 60, description 140-160). Fix DATA before writing."
    );
    process.exit(1);
  }
  console.log("\nAll rows within limits.");

  if (DRY_RUN) {
    console.log("\n--dry-run set, not writing to DB.");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log("\n=== Writing to countries table ===");
    for (const row of DATA) {
      const { rowCount } = await client.query(
        `UPDATE countries SET meta_title = $1, meta_description = $2, updated_at = now() WHERE slug = $3`,
        [row.metaTitle, row.metaDescription, row.slug]
      );
      if (rowCount === 0) {
        console.warn(`  ⚠️  no country row matched slug "${row.slug}"`);
      } else {
        console.log(`  updated: ${row.slug}`);
      }
    }
    console.log("\nDone.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
