/**
 * Narrow, audited fee-field updater for already-published program offerings.
 *
 * Unlike add-program-offerings.mjs (which upserts the FULL row and would
 * clobber title/medium/eligibility/admissions if not re-supplied), this
 * script touches ONLY fee-related columns on an existing row: fee_status,
 * annual_tuition_usd, total_tuition_usd, official_fee_currency,
 * official_annual_tuition_amount, official_total_tuition_amount,
 * fee_academic_year, fee_verified_at, fx_rate_date, fx_rate_source_url,
 * fee_notes, source_urls (appended, not replaced). Everything else on the
 * row is left exactly as-is.
 *
 * Every entry requires >= 2 sourceUrls, matching this codebase's standing
 * "never trust one official site alone" rule. Every applied update is
 * appended to research/fee-update-ledger.csv as an audit trail, since this
 * path is intentionally lighter than the full content-migration framework
 * and still needs a durable record of what changed and from what sources.
 *
 * Run: node scripts/update-program-fees.mjs --file <fee-updates.json>
 */
import "./lib/load-script-env.mjs";

import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
neonConfig.webSocketConstructor = WebSocket;

const VALID_FEE_STATUSES = new Set(["confirmed", "indicative", "on_request"]);
const LEDGER_PATH = "research/fee-update-ledger.csv";
const LEDGER_HEADER =
  "timestamp,program_slug,university_slug,old_fee_status,new_fee_status,old_annual_tuition_usd,new_annual_tuition_usd,source_urls\n";

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
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateEntry(entry, index) {
  const issues = [];
  if (!entry.programSlug) issues.push("missing programSlug");
  if (!VALID_FEE_STATUSES.has(entry.feeStatus)) {
    issues.push(`feeStatus must be one of ${[...VALID_FEE_STATUSES].join(", ")}`);
  }
  if (!Array.isArray(entry.sourceUrls) || entry.sourceUrls.length < 2) {
    issues.push("needs at least 2 sourceUrls");
  }
  if (!entry.feeVerifiedAt || !/^\d{4}-\d{2}-\d{2}$/.test(entry.feeVerifiedAt)) {
    issues.push("missing/invalid feeVerifiedAt (YYYY-MM-DD)");
  } else if (new Date(`${entry.feeVerifiedAt}T00:00:00.000Z`).getTime() > Date.now()) {
    issues.push("feeVerifiedAt is in the future");
  }

  if (entry.feeStatus === "confirmed" || entry.feeStatus === "indicative") {
    if (typeof entry.annualTuitionUsd !== "number" || entry.annualTuitionUsd < 0) {
      issues.push("confirmed/indicative fee needs a non-negative annualTuitionUsd");
    }
    if (typeof entry.officialAnnualTuitionAmount !== "number" || entry.officialAnnualTuitionAmount < 0) {
      issues.push("confirmed/indicative fee needs a non-negative officialAnnualTuitionAmount");
    }
    if (!entry.officialFeeCurrency) {
      issues.push("confirmed/indicative fee needs officialFeeCurrency");
    }
    if (entry.officialFeeCurrency && entry.officialFeeCurrency !== "USD" && !entry.fxRateSourceUrl) {
      issues.push("non-USD fee needs fxRateSourceUrl for the USD conversion");
    }
  }

  if (issues.length > 0) {
    throw new Error(`Entry ${index + 1} (${entry.programSlug ?? "?"}) is invalid: ${issues.join(", ")}`);
  }
}

async function revalidateCatalogCache({ programSlugs, universitySlugs, courseSlugs, countrySlugs, citySlugs }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!siteUrl || !secret) {
    console.warn("Skipping cache revalidation: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not configured.");
    return;
  }

  const endpoint = new URL("/api/revalidate?scope=catalog", siteUrl);
  for (const tag of universitySlugs.flatMap((slug) => [`university:${slug}`, `university-programs:${slug}`])) {
    endpoint.searchParams.append("tag", tag);
  }
  for (const slug of courseSlugs) endpoint.searchParams.append("tag", `course-programs:${slug}`);
  for (const slug of countrySlugs) endpoint.searchParams.append("tag", `country-programs:${slug}`);
  for (const slug of citySlugs) endpoint.searchParams.append("tag", `city-programs:${slug}`);
  for (const slug of programSlugs) endpoint.searchParams.append("slug", slug);
  for (const slug of universitySlugs) endpoint.searchParams.append("path", `/university/${slug}`);

  const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${secret}` } });
  if (!response.ok) {
    throw new Error(`Catalog cache revalidation failed: ${response.status} ${await response.text()}`);
  }
}

function appendLedgerRows(rows) {
  if (!existsSync(LEDGER_PATH)) writeFileSync(LEDGER_PATH, LEDGER_HEADER);
  const csvLines = rows
    .map((row) =>
      [
        row.timestamp,
        row.programSlug,
        row.universitySlug,
        row.oldFeeStatus ?? "",
        row.newFeeStatus,
        row.oldAnnualTuitionUsd ?? "",
        row.newAnnualTuitionUsd ?? "",
        `"${row.sourceUrls.join(" | ")}"`,
      ].join(","),
    )
    .join("\n");
  appendFileSync(LEDGER_PATH, csvLines + "\n");
}

async function main() {
  const { file } = parseArgs(process.argv.slice(2));
  if (!file) {
    throw new Error("Usage: node scripts/update-program-fees.mjs --file <fee-updates.json>");
  }

  const entries = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Input file must contain a non-empty JSON array.");
  }
  entries.forEach(validateEntry);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  const requestedProgramSlugs = entries.map((entry) => entry.programSlug);
  const ledgerRows = [];
  let affectedUniversitySlugs = [];
  let affectedCourseSlugs = [];
  let affectedCountrySlugs = [];
  let affectedCitySlugs = [];

  try {
    await client.query("BEGIN");

    try {
      const existingResult = await client.query(
        `SELECT
           po.id, po.slug, po.fee_status, po.annual_tuition_usd, po.source_urls,
           u.slug AS university_slug, c.slug AS course_slug, co.slug AS country_slug, u.city
         FROM program_offerings po
         INNER JOIN universities u ON u.id = po.university_id
         INNER JOIN courses c ON c.id = po.course_id
         INNER JOIN countries co ON co.id = u.country_id
         WHERE po.slug = ANY($1::text[]) AND po.published = true AND u.published = true`,
        [requestedProgramSlugs],
      );
      const existingBySlug = new Map(existingResult.rows.map((row) => [row.slug, row]));

      for (const [index, entry] of entries.entries()) {
        const existing = existingBySlug.get(entry.programSlug);
        if (!existing) {
          throw new Error(
            `Entry ${index + 1}: no published program offering with slug '${entry.programSlug}'. This script only updates existing rows.`,
          );
        }

        const mergedSourceUrls = [...new Set([...(existing.source_urls ?? []), ...entry.sourceUrls])];
        const isNoFee = entry.feeStatus === "on_request";

        await client.query(
          `UPDATE program_offerings SET
             fee_status = $1,
             annual_tuition_usd = $2,
             total_tuition_usd = $3,
             official_fee_currency = $4,
             official_annual_tuition_amount = $5,
             fee_academic_year = $6,
             fee_verified_at = $7,
             fx_rate_date = $8,
             fx_rate_source_url = $9,
             fee_notes = $10,
             source_urls = $11,
             updated_at = NOW()
           WHERE id = $12`,
          [
            entry.feeStatus,
            isNoFee ? existing.annual_tuition_usd : entry.annualTuitionUsd,
            isNoFee ? existing.annual_tuition_usd : (entry.totalTuitionUsd ?? entry.annualTuitionUsd),
            isNoFee ? null : entry.officialFeeCurrency,
            isNoFee ? null : entry.officialAnnualTuitionAmount,
            entry.feeAcademicYear ?? null,
            entry.feeVerifiedAt,
            entry.fxRateDate ?? null,
            entry.fxRateSourceUrl ?? null,
            entry.feeNotes ?? null,
            mergedSourceUrls,
            existing.id,
          ],
        );

        affectedUniversitySlugs.push(existing.university_slug);
        affectedCourseSlugs.push(existing.course_slug);
        affectedCountrySlugs.push(existing.country_slug);
        affectedCitySlugs.push(createSlug(existing.city));
        ledgerRows.push({
          timestamp: new Date().toISOString(),
          programSlug: entry.programSlug,
          universitySlug: existing.university_slug,
          oldFeeStatus: existing.fee_status,
          newFeeStatus: entry.feeStatus,
          oldAnnualTuitionUsd: existing.annual_tuition_usd,
          newAnnualTuitionUsd: isNoFee ? existing.annual_tuition_usd : entry.annualTuitionUsd,
          sourceUrls: entry.sourceUrls,
        });
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

    affectedUniversitySlugs = [...new Set(affectedUniversitySlugs)];
    affectedCourseSlugs = [...new Set(affectedCourseSlugs)];
    affectedCountrySlugs = [...new Set(affectedCountrySlugs)];
    affectedCitySlugs = [...new Set(affectedCitySlugs)];

    await revalidateCatalogCache({
      programSlugs: requestedProgramSlugs,
      universitySlugs: affectedUniversitySlugs,
      courseSlugs: affectedCourseSlugs,
      countrySlugs: affectedCountrySlugs,
      citySlugs: affectedCitySlugs,
    });

    appendLedgerRows(ledgerRows);
    console.log(`Updated fee data for ${entries.length} program offerings. Logged to ${LEDGER_PATH}.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
