#!/usr/bin/env node

/**
 * Backfill seminar-related CRM fields from the website database.
 *
 * This script reads seminar leads from the studentstraffic database and
 * repairs missing `city` / `seminar_event` values on the corresponding CRM
 * lead using `crm_external_id`.
 *
 * Usage:
 *   node scripts/backfill-crm-seminar-fields.mjs --dry-run
 *   node scripts/backfill-crm-seminar-fields.mjs --date 2026-04-24 --dry-run
 *   node scripts/backfill-crm-seminar-fields.mjs --date 2026-04-24
 *   node scripts/backfill-crm-seminar-fields.mjs --overwrite
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const crmRepoRoot = path.resolve(repoRoot, "..", "students-traffic-crm");

const WEBSITE_ENV_PATH = path.join(repoRoot, ".env");
const CRM_ENV_PATH = path.join(crmRepoRoot, ".env");

function parseArgs(argv) {
  const args = {
    dryRun: false,
    overwrite: false,
    date: undefined,
    limit: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--overwrite") {
      args.overwrite = true;
      continue;
    }

    if (arg === "--date") {
      args.date = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--limit") {
      const value = Number(argv[index + 1]);
      args.limit = Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
      index += 1;
      continue;
    }
  }

  return args;
}

function readEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing env file: ${envPath}`);
  }

  return dotenv.parse(fs.readFileSync(envPath));
}

function isBlankish(value) {
  if (value === null || value === undefined) return true;

  const normalized = String(value).trim();
  if (!normalized) return true;

  return ["NA", "N/A", "-"].includes(normalized.toUpperCase());
}

function normalizeDisplay(value) {
  return isBlankish(value) ? "(blank)" : String(value);
}

function buildWebsiteLeadQuery({ hasDateFilter, hasLimitFilter }) {
  return `
    select *
    from (
      select distinct on (crm_external_id)
        id,
        crm_external_id,
        full_name,
        phone,
        city,
        seminar_event,
        source_path,
        cta_variant,
        created_at at time zone 'Asia/Kolkata' as created_at_ist
      from leads
      where crm_external_id is not null
        and source_path like '/seminar-2026%'
        and (city is not null or seminar_event is not null)
        ${hasDateFilter ? "and date(created_at at time zone 'Asia/Kolkata') = $1" : ""}
      order by crm_external_id, created_at desc, id desc
    ) latest
    order by created_at_ist desc
    ${hasLimitFilter ? `limit $${hasDateFilter ? 2 : 1}` : ""}
  `;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error(`Invalid --date value "${args.date}". Use YYYY-MM-DD.`);
  }

  const websiteEnv = readEnvFile(WEBSITE_ENV_PATH);
  const crmEnv = readEnvFile(CRM_ENV_PATH);

  if (!websiteEnv.DATABASE_URL) {
    throw new Error(`DATABASE_URL missing in ${WEBSITE_ENV_PATH}`);
  }

  if (!crmEnv.DATABASE_URL) {
    throw new Error(`DATABASE_URL missing in ${CRM_ENV_PATH}`);
  }

  const websiteSql = neon(websiteEnv.DATABASE_URL);
  const crmSql = neon(crmEnv.DATABASE_URL);

  console.log(args.dryRun ? "DRY RUN - no CRM rows will be updated.\n" : "Applying CRM backfill.\n");
  console.log(`Website env: ${WEBSITE_ENV_PATH}`);
  console.log(`CRM env: ${CRM_ENV_PATH}`);
  console.log(`Date filter: ${args.date ?? "all seminar leads"}`);
  console.log(`Overwrite existing CRM values: ${args.overwrite ? "yes" : "no"}`);
  console.log(`Limit: ${args.limit ?? "none"}\n`);

  const query = buildWebsiteLeadQuery({
    hasDateFilter: Boolean(args.date),
    hasLimitFilter: Boolean(args.limit),
  });

  const queryParams = [];
  if (args.date) queryParams.push(args.date);
  if (args.limit) queryParams.push(args.limit);

  const websiteLeads = await websiteSql.query(query, queryParams);

  if (!websiteLeads.length) {
    console.log("No matching website leads found.");
    return;
  }

  const crmIds = websiteLeads
    .map((lead) => Number(lead.crm_external_id))
    .filter((value) => Number.isFinite(value));

  const crmLeads = await crmSql.query(
    `
      select
        id,
        name,
        phone,
        city,
        seminar_event,
        created_at at time zone 'Asia/Kolkata' as created_at_ist
      from leads
      where id = any($1::int[])
      order by created_at desc
    `,
    [crmIds]
  );

  const crmById = new Map(crmLeads.map((lead) => [String(lead.id), lead]));

  let candidates = 0;
  let updated = 0;
  let skipped = 0;
  let missingCrmRows = 0;

  for (const websiteLead of websiteLeads) {
    const crmLead = crmById.get(String(websiteLead.crm_external_id));

    if (!crmLead) {
      missingCrmRows += 1;
      console.log(`CRM lead ${websiteLead.crm_external_id} not found for website lead ${websiteLead.id}.`);
      continue;
    }

    const nextCity = !isBlankish(websiteLead.city) ? String(websiteLead.city).trim() : undefined;
    const nextSeminarEvent = !isBlankish(websiteLead.seminar_event)
      ? String(websiteLead.seminar_event).trim()
      : undefined;

    const shouldUpdateCity = Boolean(
      nextCity && (args.overwrite ? crmLead.city !== nextCity : isBlankish(crmLead.city))
    );
    const shouldUpdateSeminarEvent = Boolean(
      nextSeminarEvent &&
        (args.overwrite
          ? crmLead.seminar_event !== nextSeminarEvent
          : isBlankish(crmLead.seminar_event))
    );

    if (!shouldUpdateCity && !shouldUpdateSeminarEvent) {
      skipped += 1;
      continue;
    }

    candidates += 1;

    console.log(`CRM #${crmLead.id} <- Website #${websiteLead.id}`);
    console.log(`  Name: ${websiteLead.full_name}`);
    console.log(`  Phone: ${websiteLead.phone}`);
    console.log(`  Source path: ${websiteLead.source_path}`);
    console.log(`  CTA variant: ${websiteLead.cta_variant}`);
    console.log(`  Website city: ${normalizeDisplay(nextCity)}`);
    console.log(`  CRM city: ${normalizeDisplay(crmLead.city)}`);
    console.log(`  Website seminar: ${normalizeDisplay(nextSeminarEvent)}`);
    console.log(`  CRM seminar: ${normalizeDisplay(crmLead.seminar_event)}`);

    if (args.dryRun) {
      console.log("  Result: would update\n");
      updated += 1;
      continue;
    }

    const sets = [];
    const params = [];
    let paramIndex = 1;

    if (shouldUpdateCity) {
      sets.push(`city = $${paramIndex}`);
      params.push(nextCity);
      paramIndex += 1;
    }

    if (shouldUpdateSeminarEvent) {
      sets.push(`seminar_event = $${paramIndex}`);
      params.push(nextSeminarEvent);
      paramIndex += 1;
    }

    params.push(crmLead.id);

    await crmSql.query(
      `
        update leads
        set ${sets.join(", ")}
        where id = $${paramIndex}
      `,
      params
    );

    console.log("  Result: updated\n");
    updated += 1;
  }

  console.log("Summary");
  console.log(`  Website leads checked: ${websiteLeads.length}`);
  console.log(`  CRM rows missing: ${missingCrmRows}`);
  console.log(`  Update candidates: ${candidates}`);
  console.log(`  ${args.dryRun ? "Would update" : "Updated"}: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
}

main().catch((error) => {
  console.error("Backfill failed.");
  console.error(error);
  process.exit(1);
});
