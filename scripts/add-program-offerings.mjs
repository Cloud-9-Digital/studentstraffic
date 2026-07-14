/**
 * Atomic importer for programme offerings at existing published universities.
 * Input must use an active canonical course slug and retain the university's
 * exact official programme title.
 *
 * Run: node scripts/add-program-offerings.mjs --file <programmes.json>
 */
import "./lib/load-script-env.mjs";

import { readFileSync } from "node:fs";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
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

async function revalidateCatalogCache({
  programSlugs,
  universitySlugs,
  courseSlugs,
  countrySlugs,
  citySlugs,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!siteUrl || !secret) {
    console.warn(
      "Skipping cache revalidation: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not configured.",
    );
    return;
  }

  const endpoint = new URL("/api/revalidate?scope=catalog", siteUrl);
  for (const tag of universitySlugs.flatMap((slug) => [
    `university:${slug}`,
    `university-programs:${slug}`,
  ])) {
    endpoint.searchParams.append("tag", tag);
  }
  for (const slug of courseSlugs) {
    endpoint.searchParams.append("tag", `course-programs:${slug}`);
  }
  for (const slug of countrySlugs) {
    endpoint.searchParams.append("tag", `country-programs:${slug}`);
  }
  for (const slug of citySlugs) {
    endpoint.searchParams.append("tag", `city-programs:${slug}`);
  }
  for (const slug of programSlugs) endpoint.searchParams.append("slug", slug);
  for (const slug of universitySlugs) {
    endpoint.searchParams.append("path", `/university/${slug}`);
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
  const requestedUniversitySlugs = [...new Set(entries.map((entry) => entry.universitySlug))];
  const requestedCourseSlugs = [...new Set(entries.map((entry) => entry.courseSlug))];
  const requestedProgramSlugs = entries.map(
    (entry) => entry.slug ?? createSlug(`${entry.title}-${entry.universitySlug}`),
  );
  let affectedCountrySlugs = [];
  let affectedCitySlugs = [];

  try {
    await client.query("BEGIN");

    try {
      const [universityResult, courseResult, existingResult] = await Promise.all([
        client.query(
          `SELECT u.id, u.slug, u.city, c.slug AS country_slug
           FROM universities u
           INNER JOIN countries c ON c.id = u.country_id
           WHERE u.slug = ANY($1::text[]) AND u.published = true`,
          [requestedUniversitySlugs],
        ),
        client.query(
          `SELECT id, slug FROM courses WHERE slug = ANY($1::text[]) AND active = true`,
          [requestedCourseSlugs],
        ),
        client.query(
          `SELECT id, slug, university_id FROM program_offerings WHERE slug = ANY($1::text[])`,
          [requestedProgramSlugs],
        ),
      ]);
      const universityIds = new Map(universityResult.rows.map((row) => [row.slug, row.id]));
      affectedCountrySlugs = [...new Set(
        universityResult.rows.map((row) => row.country_slug),
      )];
      affectedCitySlugs = [...new Set(
        universityResult.rows.map((row) => createSlug(row.city)),
      )];
      const courseIds = new Map(courseResult.rows.map((row) => [row.slug, row.id]));
      const existingBySlug = new Map(existingResult.rows.map((row) => [row.slug, row]));

      for (const [index, entry] of entries.entries()) {
        const universityId = universityIds.get(entry.universitySlug);
        if (!universityId) {
          throw new Error(
            `Entry ${index + 1}: no published university '${entry.universitySlug}'`,
          );
        }

        const courseId = courseIds.get(entry.courseSlug);
        if (!courseId) {
          throw new Error(
            `Entry ${index + 1}: '${entry.courseSlug}' is not an active canonical programme`,
          );
        }

        const slug = entry.slug ?? createSlug(`${entry.title}-${entry.universitySlug}`);
        const existing = existingBySlug.get(slug);

        if (existing && existing.university_id !== universityId) {
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

        if (existing) {
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
            [...values, existing.id],
          );
        } else {
          const inserted = await client.query(
            `INSERT INTO program_offerings (
              university_id, course_id, slug, title, duration_years, annual_tuition_usd,
              total_tuition_usd, living_usd, official_fee_currency,
              official_annual_tuition_amount, official_total_tuition_amount,
              official_program_url, medium, intake_months, fee_verified_at, fee_notes,
              source_urls, audience_eligibility, professional_exam_support, published
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,true)
            RETURNING id`,
            values,
          );
          existingBySlug.set(slug, {
            id: inserted.rows[0].id,
            slug,
            university_id: universityId,
          });
        }
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

    await revalidateCatalogCache({
      programSlugs: requestedProgramSlugs,
      universitySlugs: requestedUniversitySlugs,
      courseSlugs: requestedCourseSlugs,
      countrySlugs: affectedCountrySlugs,
      citySlugs: affectedCitySlugs,
    });
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
