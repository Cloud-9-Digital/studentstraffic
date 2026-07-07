/**
 * Generic program-offering inserter for universities that already exist and are
 * published, but are missing one or more program_offerings rows.
 *
 * Exists so research agents write plain JSON instead of a bespoke one-off .mjs
 * script per university (see docs/university-pipeline-architecture.md).
 *
 * Input JSON is an array of program entries:
 * [
 *   {
 *     "universitySlug": "kalmyk-state-university",   // must already exist + be published
 *     "courseSlug": "mbbs",                           // must exist in `courses`
 *     "title": "General Medicine (MD)",
 *     "durationYears": 6,
 *     "medium": "English",
 *     "officialProgramUrl": "https://...",
 *     "annualTuitionUsd": 4500,                       // optional, omit if unverified
 *     "totalTuitionUsd": 27000,                       // optional
 *     "livingUsd": 2000,                              // optional
 *     "officialFeeCurrency": "RUB",                   // optional
 *     "officialAnnualTuitionAmount": 350000,          // optional, native currency
 *     "officialTotalTuitionAmount": 2100000,          // optional
 *     "intakeMonths": ["September"],                  // optional
 *     "feeNotes": "...",                              // optional
 *     "feeVerifiedAt": "2026-07-08",                  // optional ISO date
 *     "sourceUrls": ["https://...", "https://..."]    // required, >= 2 independent sources
 *   },
 *   ...
 * ]
 *
 * Required per entry: universitySlug, courseSlug, title, medium, durationYears,
 * officialProgramUrl, sourceUrls (>= 2). Missing/invalid entries are skipped with
 * a printed reason — nothing is silently dropped.
 *
 * Re-running with the same universitySlug+courseSlug pair updates that row instead
 * of duplicating it (upsert on the natural key, not just the generated slug).
 *
 * Run: node scripts/add-program-offerings.mjs --file <path-to-programs.json>
 */
import { readFileSync } from "node:fs";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--file" && argv[i + 1]) {
      options.file = argv[i + 1];
      i += 1;
    }
  }
  return options;
}

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateEntry(entry, index) {
  const issues = [];
  if (!entry.universitySlug) issues.push("missing universitySlug");
  if (!entry.courseSlug) issues.push("missing courseSlug");
  if (!entry.title) issues.push("missing title");
  if (!entry.medium) issues.push("missing medium");
  if (!entry.durationYears || typeof entry.durationYears !== "number") {
    issues.push("missing/invalid durationYears");
  }
  if (!entry.officialProgramUrl) issues.push("missing officialProgramUrl");
  if (!Array.isArray(entry.sourceUrls) || entry.sourceUrls.length < 2) {
    issues.push("needs at least 2 sourceUrls (multi-source verification)");
  }
  if (issues.length) {
    console.warn(`✗ Entry ${index + 1} (${entry.universitySlug ?? "?"}/${entry.courseSlug ?? "?"}) skipped: ${issues.join(", ")}`);
    return false;
  }
  return true;
}

async function main() {
  const { file } = parseArgs(process.argv.slice(2));
  if (!file) {
    console.error("Usage: node scripts/add-program-offerings.mjs --file <path-to-programs.json>");
    process.exit(1);
  }

  const entries = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(entries) || entries.length === 0) {
    console.error("Input file must contain a non-empty JSON array.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    let published = 0;
    let skipped = 0;

    for (const [index, entry] of entries.entries()) {
      if (!validateEntry(entry, index)) {
        skipped += 1;
        continue;
      }

      const uniResult = await client.query(
        `SELECT id, slug FROM universities WHERE slug = $1 AND published = true`,
        [entry.universitySlug]
      );
      if (uniResult.rowCount === 0) {
        console.warn(`✗ Entry ${index + 1}: no published university with slug '${entry.universitySlug}'`);
        skipped += 1;
        continue;
      }

      const courseResult = await client.query(
        `SELECT id FROM courses WHERE slug = $1`,
        [entry.courseSlug]
      );
      if (courseResult.rowCount === 0) {
        console.warn(`✗ Entry ${index + 1}: no course with slug '${entry.courseSlug}'`);
        skipped += 1;
        continue;
      }

      const universityId = uniResult.rows[0].id;
      const courseId = courseResult.rows[0].id;
      const slug = entry.slug ?? createSlug(`${entry.courseSlug}-in-${entry.universitySlug}`);

      const existing = await client.query(
        `SELECT id FROM program_offerings WHERE university_id = $1 AND course_id = $2`,
        [universityId, courseId]
      );

      const values = [
        universityId,
        courseId,
        slug,
        entry.title,
        entry.durationYears,
        entry.annualTuitionUsd ?? 0,
        entry.totalTuitionUsd ?? 0,
        entry.livingUsd ?? 0,
        entry.officialFeeCurrency ?? null,
        entry.officialAnnualTuitionAmount ?? null,
        entry.officialTotalTuitionAmount ?? null,
        entry.officialProgramUrl,
        entry.medium,
        entry.intakeMonths ?? [],
        entry.feeVerifiedAt ?? null,
        entry.feeNotes ?? null,
        entry.sourceUrls,
      ];

      if (existing.rowCount > 0) {
        await client.query(
          `UPDATE program_offerings SET
            slug = $3, title = $4, duration_years = $5, annual_tuition_usd = $6,
            total_tuition_usd = $7, living_usd = $8, official_fee_currency = $9,
            official_annual_tuition_amount = $10, official_total_tuition_amount = $11,
            official_program_url = $12, medium = $13, intake_months = $14,
            fee_verified_at = $15, fee_notes = $16, source_urls = $17,
            published = true, updated_at = NOW()
          WHERE university_id = $1 AND course_id = $2`,
          values
        );
        console.log(`↻ Updated program: ${entry.universitySlug} / ${entry.courseSlug} (${slug})`);
      } else {
        await client.query(
          `INSERT INTO program_offerings (
            university_id, course_id, slug, title, duration_years, annual_tuition_usd,
            total_tuition_usd, living_usd, official_fee_currency,
            official_annual_tuition_amount, official_total_tuition_amount,
            official_program_url, medium, intake_months, fee_verified_at, fee_notes,
            source_urls, published
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, true
          )`,
          values
        );
        console.log(`✓ Published program: ${entry.universitySlug} / ${entry.courseSlug} (${slug})`);
      }
      published += 1;
    }

    console.log(`\nDone. Published/updated: ${published}. Skipped: ${skipped}.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
