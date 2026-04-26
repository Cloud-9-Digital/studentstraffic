#!/usr/bin/env tsx

import "dotenv/config";

import fs from "node:fs";

import { neon } from "@neondatabase/serverless";
import { GoogleAuth } from "google-auth-library";

import { buildGoogleSheetsLeadRow, type GoogleSheetsConfig } from "@/lib/google-sheets-core";
import type { LeadSyncPayload } from "@/lib/lead-sync-payload";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const SHEET_RANGE = "A:F";
const EXISTING_ROWS_RANGE = "A:F";

type Args = {
  dryRun: boolean;
  limit?: number;
  date?: string;
  credentialsPath?: string;
  force: boolean;
};

type DbLeadRow = {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  father_name: string | null;
  alternate_phone: string | null;
  city: string | null;
  seminar_event: string | null;
  interested_country: string | null;
  budget_range: string | null;
  needs_fmge_session: boolean | null;
  document_url: string | null;
  document_type: string | null;
  user_state: string | null;
  course_slug: string | null;
  country_slug: string | null;
  university_slug: string | null;
  source_path: string;
  source_url: string | null;
  source_query: Record<string, string | string[]> | null;
  page_title: string | null;
  cta_variant: string;
  notes: string | null;
  document_referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  ttclid: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_address: string | null;
  accept_language: string | null;
  client_context: Record<string, string | number | boolean | null | string[]> | null;
  created_at: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    dryRun: false,
    force: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--force") {
      args.force = true;
      continue;
    }

    if (arg === "--limit") {
      const value = Number(argv[index + 1]);
      args.limit = Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
      index += 1;
      continue;
    }

    if (arg === "--date") {
      args.date = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--credentials") {
      args.credentialsPath = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var ${name}.`);
  }

  return value;
}

function loadGoogleSheetsConfig(credentialsPath?: string): GoogleSheetsConfig {
  const spreadsheetId = requireEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const sheetName = requireEnv("GOOGLE_SHEETS_SHEET_NAME");

  if (credentialsPath) {
    const raw = fs.readFileSync(credentialsPath, "utf8");
    const parsed = JSON.parse(raw) as {
      client_email?: string;
      private_key?: string;
    };

    if (!parsed.client_email || !parsed.private_key) {
      throw new Error(`Credentials file ${credentialsPath} is missing client_email or private_key.`);
    }

    return {
      spreadsheetId,
      sheetName,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  }

  return {
    spreadsheetId,
    sheetName,
    clientEmail: requireEnv("GOOGLE_SHEETS_CLIENT_EMAIL"),
    privateKey: requireEnv("GOOGLE_SHEETS_PRIVATE_KEY").replace(/\\n/g, "\n"),
  };
}

async function getAccessToken(config: GoogleSheetsConfig) {
  const auth = new GoogleAuth({
    credentials: {
      client_email: config.clientEmail,
      private_key: config.privateKey,
    },
    scopes: [SHEETS_SCOPE],
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  const accessToken =
    typeof accessTokenResponse === "string"
      ? accessTokenResponse
      : accessTokenResponse.token ?? null;

  if (!accessToken) {
    throw new Error("Google Sheets access token was empty.");
  }

  return accessToken;
}

function buildValuesUrl(config: GoogleSheetsConfig, range: string) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(`${config.sheetName}!${range}`)}`;
}

function buildAppendUrl(config: GoogleSheetsConfig) {
  const params = new URLSearchParams({
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
  });

  return `${buildValuesUrl(config, SHEET_RANGE)}:append?${params.toString()}`;
}

function buildLeadPayload(lead: DbLeadRow): LeadSyncPayload {
  return {
    websiteLeadId: lead.id,
    submittedAt: lead.created_at,
    fullName: lead.full_name,
    phone: lead.phone,
    email: lead.email ?? undefined,
    fatherName: lead.father_name ?? undefined,
    alternatePhone: lead.alternate_phone ?? undefined,
    city: lead.city ?? undefined,
    seminarEvent: lead.seminar_event ?? undefined,
    interestedCountry: lead.interested_country ?? undefined,
    budgetRange: lead.budget_range ?? undefined,
    needsFmgeSession: lead.needs_fmge_session ?? undefined,
    documentUrl: lead.document_url ?? undefined,
    documentType: lead.document_type ?? undefined,
    userState: lead.user_state ?? undefined,
    courseSlug: lead.course_slug ?? undefined,
    countrySlug: lead.country_slug ?? undefined,
    universitySlug: lead.university_slug ?? undefined,
    sourcePath: lead.source_path,
    sourceUrl: lead.source_url ?? undefined,
    sourceQuery: lead.source_query ?? {},
    pageTitle: lead.page_title ?? undefined,
    ctaVariant: lead.cta_variant,
    notes: lead.notes ?? undefined,
    documentReferrer: lead.document_referrer ?? undefined,
    utmSource: lead.utm_source ?? undefined,
    utmMedium: lead.utm_medium ?? undefined,
    utmCampaign: lead.utm_campaign ?? undefined,
    utmTerm: lead.utm_term ?? undefined,
    utmContent: lead.utm_content ?? undefined,
    gclid: lead.gclid ?? undefined,
    fbclid: lead.fbclid ?? undefined,
    gbraid: lead.gbraid ?? undefined,
    wbraid: lead.wbraid ?? undefined,
    ttclid: lead.ttclid ?? undefined,
    referrer: lead.referrer ?? undefined,
    userAgent: lead.user_agent ?? undefined,
    ipAddress: lead.ip_address ?? undefined,
    acceptLanguage: lead.accept_language ?? undefined,
    clientContext: lead.client_context ?? {},
  };
}

function normalizeCell(value: unknown) {
  return String(value ?? "").trim();
}

function makeRowKey(row: unknown[]) {
  return row.map(normalizeCell).join("\u241f");
}

async function fetchExistingRowKeys(config: GoogleSheetsConfig, accessToken: string) {
  const response = await fetch(buildValuesUrl(config, EXISTING_ROWS_RANGE), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to read existing sheet rows (${response.status}).`);
  }

  const data = (await response.json()) as { values?: string[][] };
  const rows = data.values ?? [];
  const dataRows = rows.slice(1);

  return new Set(dataRows.map((row) => makeRowKey(row)));
}

function buildQuery(args: Args) {
  const conditions = [
    "(seminar_event is not null or source_path like '/seminar-2026%')",
  ];
  const params: Array<string | number> = [];

  if (args.date) {
    conditions.push(`date(created_at at time zone 'Asia/Kolkata') = $${params.length + 1}`);
    params.push(args.date);
  }

  let limitClause = "";
  if (args.limit) {
    limitClause = `limit $${params.length + 1}`;
    params.push(args.limit);
  }

  const query = `
    select
      id,
      full_name,
      phone,
      email,
      father_name,
      alternate_phone,
      city,
      seminar_event,
      interested_country,
      budget_range,
      needs_fmge_session,
      document_url,
      document_type,
      user_state,
      course_slug,
      country_slug,
      university_slug,
      source_path,
      source_url,
      source_query,
      page_title,
      cta_variant,
      notes,
      document_referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      gclid,
      fbclid,
      gbraid,
      wbraid,
      ttclid,
      referrer,
      user_agent,
      ip_address,
      accept_language,
      client_context,
      created_at
    from leads
    where ${conditions.join(" and ")}
    order by created_at asc, id asc
    ${limitClause}
  `;

  return { query, params };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error(`Invalid --date value "${args.date}". Use YYYY-MM-DD.`);
  }

  const databaseUrl = requireEnv("DATABASE_URL");
  const config = loadGoogleSheetsConfig(args.credentialsPath);
  const accessToken = await getAccessToken(config);
  const sql = neon(databaseUrl);
  const existingRowKeys = args.force ? new Set<string>() : await fetchExistingRowKeys(config, accessToken);

  const { query, params } = buildQuery(args);
  const leads = (await sql.query(query, params)) as DbLeadRow[];

  console.log(args.dryRun ? "DRY RUN - no sheet rows will be appended.\n" : "Appending seminar leads to Google Sheets.\n");
  console.log(`Spreadsheet: ${config.spreadsheetId}`);
  console.log(`Sheet tab: ${config.sheetName}`);
  console.log(`Date filter: ${args.date ?? "all seminar leads"}`);
  console.log(`Limit: ${args.limit ?? "none"}`);
  console.log(`Skip existing rows: ${args.force ? "no" : "yes"}\n`);

  if (!leads.length) {
    console.log("No seminar leads found.");
    return;
  }

  const rowsToAppend: string[][] = [];
  let skippedExisting = 0;

  for (const lead of leads) {
    const row = buildGoogleSheetsLeadRow(buildLeadPayload(lead));
    const rowKey = makeRowKey(row);

    if (existingRowKeys.has(rowKey)) {
      skippedExisting += 1;
      continue;
    }

    rowsToAppend.push(row);
  }

  console.log(`Website seminar leads scanned: ${leads.length}`);
  console.log(`Already present in sheet: ${skippedExisting}`);
  console.log(`Rows ready to append: ${rowsToAppend.length}\n`);

  if (rowsToAppend.length > 0) {
    const preview = rowsToAppend.slice(0, 5);
    console.log("Preview:");
    for (const row of preview) {
      console.log(`- ${row.join(" | ")}`);
    }
    console.log("");
  }

  if (args.dryRun || rowsToAppend.length === 0) {
    return;
  }

  const response = await fetch(buildAppendUrl(config), {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      majorDimension: "ROWS",
      values: rowsToAppend,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Google Sheets append failed (${response.status}).`);
  }

  const result = (await response.json()) as {
    updates?: { updatedRows?: number };
    tableRange?: string;
  };

  console.log(`Appended rows: ${result.updates?.updatedRows ?? rowsToAppend.length}`);
  console.log(`Updated range: ${result.tableRange ?? "unknown"}`);
}

main().catch((error) => {
  console.error("\nBackfill failed:", error);
  process.exit(1);
});
