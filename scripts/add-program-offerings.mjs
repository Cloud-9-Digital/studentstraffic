/**
 * Atomic importer for programme offerings at existing published universities.
 * Input must use an active canonical course slug and retain the university's
 * exact official programme title.
 *
 * Run: node scripts/add-program-offerings.mjs --file <programmes.json>
 */
import { readFileSync } from "node:fs";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--file" && argv[index + 1]) {
      options.file = argv[index + 1];
      index += 1;
    }
  }
  return options;
}

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateEntry(entry, index) {
  const issues = [];
  if (!entry.universitySlug) issues.push("missing universitySlug");
  if (!entry.courseSlug) issues.push("missing courseSlug");
  if (!entry.title) issues.push("missing official programme title");
  if (!entry.medium) issues.push("missing medium");
  if (typeof entry.durationYears !== "number" || entry.durationYears <= 0) {
    issues.push("missing/invalid durationYears");
  }
  if (!entry.officialProgramUrl) issues.push("missing officialProgramUrl");
  if (!Array.isArray(entry.sourceUrls) || entry.sourceUrls.length < 2) {
    issues.push("needs at least 2 sourceUrls");
  }

  if (issues.length > 0) {
    throw new Error(`Entry ${index + 1} is invalid: ${issues.join(", ")}`);
  }
}

async function revalidateCatalogCache() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!siteUrl || !secret) {
    console.warn(
      "Skipping cache revalidation: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not configured.",
    );
    return;
  }

  const endpoint = new URL("/api/revalidate?scope=catalog", siteUrl);
  for (const tag of ["catalog", "universities", "program-offerings", "courses"]) {
    endpoint.searchParams.append("tag", tag);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });

  if (!response.ok) {
    throw new Error(
      `Catalog cache revalidation failed: ${response.status} ${await response.text()}`,
    );
  }
}

async function main() {
  const { file } = parseArgs(process.argv.slice(2));
  if (!file) {
    throw new Error("Usage: node scripts/add-program-offerings.mjs --file <programmes.json>");
  }

  const entries = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Input file must contain a non-empty JSON array.");
  }

  entries.forEach(validateEntry);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    try {
      for (const [index, entry] of entries.entries()) {
        const universityResult = await client.query(
          `SELECT id FROM universities WHERE slug = $1 AND published = true`,
          [entry.universitySlug],
        );
        if (universityResult.rowCount === 0) {
          throw new Error(
            `Entry ${index + 1}: no published university '${entry.universitySlug}'`,
          );
        }

        const courseResult = await client.query(
          `SELECT id FROM courses WHERE slug = $1 AND active = true`,
          [entry.courseSlug],
        );
        if (courseResult.rowCount === 0) {
          throw new Error(
            `Entry ${index + 1}: '${entry.courseSlug}' is not an active canonical programme`,
          );
        }

        const universityId = universityResult.rows[0].id;
        const courseId = courseResult.rows[0].id;
        const slug = entry.slug ?? createSlug(`${entry.title}-${entry.universitySlug}`);
        const existing = await client.query(
          `SELECT id, university_id FROM program_offerings WHERE slug = $1`,
          [slug],
        );

        if (existing.rowCount > 0 && existing.rows[0].university_id !== universityId) {
          throw new Error(`Entry ${index + 1}: slug '${slug}' belongs to another university`);
        }

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
          entry.audienceEligibility ?? null,
          entry.professionalExamSupport ?? [],
        ];

        if (existing.rowCount > 0) {
          await client.query(
            `UPDATE program_offerings SET
              university_id=$1, course_id=$2, slug=$3, title=$4, duration_years=$5,
              annual_tuition_usd=$6, total_tuition_usd=$7, living_usd=$8,
              official_fee_currency=$9, official_annual_tuition_amount=$10,
              official_total_tuition_amount=$11, official_program_url=$12, medium=$13,
              intake_months=$14, fee_verified_at=$15, fee_notes=$16, source_urls=$17,
              audience_eligibility=$18, professional_exam_support=$19,
              published=true, updated_at=NOW()
            WHERE id=$20`,
            [...values, existing.rows[0].id],
          );
        } else {
          await client.query(
            `INSERT INTO program_offerings (
              university_id, course_id, slug, title, duration_years, annual_tuition_usd,
              total_tuition_usd, living_usd, official_fee_currency,
              official_annual_tuition_amount, official_total_tuition_amount,
              official_program_url, medium, intake_months, fee_verified_at, fee_notes,
              source_urls, audience_eligibility, professional_exam_support, published
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,true)`,
            values,
          );
        }
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

    await revalidateCatalogCache();
    console.log(`Published/updated ${entries.length} programme offerings atomically.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
