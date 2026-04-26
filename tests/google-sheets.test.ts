import test from "node:test";
import assert from "node:assert/strict";

import {
  appendSeminarLeadToGoogleSheets,
  buildGoogleSheetsLeadRow,
  buildGoogleSheetsSource,
  type GoogleSheetsConfig,
} from "../lib/google-sheets-core";
import type { LeadSyncPayload } from "../lib/lead-sync-payload";

const basePayload: LeadSyncPayload = {
  submittedAt: "2026-04-26T06:30:45.000Z",
  fullName: "Arun Kumar",
  phone: "+919876543210",
  city: "Madurai",
  seminarEvent: "Chennai - Hilton",
  sourcePath: "/seminar-2026",
  ctaVariant: "seminar-2026-hero",
  sourceQuery: {},
  clientContext: {},
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "seminar-april",
};

const config: GoogleSheetsConfig = {
  spreadsheetId: "sheet123",
  sheetName: "Seminar Leads",
  clientEmail: "sync@studentstraffic.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n",
};

test("buildGoogleSheetsLeadRow maps the seminar columns in order", () => {
  assert.deepEqual(buildGoogleSheetsLeadRow(basePayload), [
    "2026-04-26 12:00:45",
    "Arun Kumar",
    "+919876543210",
    "Chennai - Hilton",
    "Madurai",
    "Google Ad",
  ]);
});

test("buildGoogleSheetsSource identifies instagram ads", () => {
  const source = buildGoogleSheetsSource({
    ...basePayload,
    utmSource: "instagram",
    utmMedium: "paid_social",
  });

  assert.equal(source, "Instagram Ad");
});

test("buildGoogleSheetsSource falls back to organic when there is no ad signal", () => {
  const source = buildGoogleSheetsSource({
    ...basePayload,
    utmSource: undefined,
    utmMedium: undefined,
    utmCampaign: undefined,
    referrer: "https://www.instagram.com/some-post/",
  });

  assert.equal(source, "Organic");
});

test("appendSeminarLeadToGoogleSheets skips non-seminar leads", async () => {
  const result = await appendSeminarLeadToGoogleSheets(
    { ...basePayload, seminarEvent: undefined },
    config,
    {}
  );

  assert.deepEqual(result, {
    status: "skipped",
    reason: "missing_seminar_event",
  });
});

test("appendSeminarLeadToGoogleSheets appends a row through the Sheets API", async () => {
  let requestUrl = "";
  let requestInit: RequestInit | undefined;

  const result = await appendSeminarLeadToGoogleSheets(basePayload, config, {
    getAccessToken: async () => "token-123",
    fetchFn: async (input, init) => {
      requestUrl = String(input);
      requestInit = init;

      return new Response(JSON.stringify({ updates: { updatedRows: 1 } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  assert.equal(result.status, "synced");
  assert.match(requestUrl, /spreadsheets\/sheet123\/values\/Seminar%20Leads!A%3AF:append/);
  assert.equal(requestInit?.method, "POST");
  assert.equal((requestInit?.headers as Record<string, string>).authorization, "Bearer token-123");

  const body = JSON.parse(String(requestInit?.body));
  assert.deepEqual(body.values[0], [
    "2026-04-26 12:00:45",
    "Arun Kumar",
    "+919876543210",
    "Chennai - Hilton",
    "Madurai",
    "Google Ad",
  ]);
});

test("appendSeminarLeadToGoogleSheets returns a failed result when Google rejects the append", async () => {
  const result = await appendSeminarLeadToGoogleSheets(basePayload, config, {
    getAccessToken: async () => "token-123",
    fetchFn: async () => new Response("invalid range", { status: 400 }),
  });

  assert.deepEqual(result, {
    status: "failed",
    error: "invalid range",
  });
});
