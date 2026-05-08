import "server-only";

import { GoogleAuth } from "google-auth-library";

import { env } from "@/lib/env";
import {
  appendSeminarLeadToGoogleSheets as appendSeminarLeadToGoogleSheetsCore,
  appendWatiInboundLeadToGoogleSheets as appendWatiInboundLeadToGoogleSheetsCore,
  type GoogleSheetsConfig,
  type GoogleSheetsSyncResult,
} from "@/lib/google-sheets-core";
import type { LeadSyncPayload } from "@/lib/lead-sync-payload";

const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const WATI_GOOGLE_SHEETS_SPREADSHEET_ID = "1Cs0BfdToaSFh-Pqrhoy0234If7BgIM3PtkmgXpXehVU";
const WATI_GOOGLE_SHEETS_SHEET_NAME = "Main";

function trimOrUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function createGoogleSheetsConfig(
  spreadsheetId?: string | null,
  sheetName?: string | null
) {
  if (
    !spreadsheetId ||
    !sheetName ||
    !env.googleSheetsClientEmail ||
    !env.googleSheetsPrivateKey
  ) {
    return null;
  }

  return {
    spreadsheetId,
    sheetName,
    clientEmail: env.googleSheetsClientEmail,
    privateKey: env.googleSheetsPrivateKey.replace(/\\n/g, "\n"),
  };
}

function getGoogleSheetsConfig(): GoogleSheetsConfig | null {
  if (!env.hasGoogleSheetsSyncConfig) {
    return null;
  }

  return createGoogleSheetsConfig(
    env.googleSheetsSpreadsheetId,
    env.googleSheetsSheetName
  );
}

function getWatiGoogleSheetsConfig(): GoogleSheetsConfig | null {
  return createGoogleSheetsConfig(
    WATI_GOOGLE_SHEETS_SPREADSHEET_ID,
    WATI_GOOGLE_SHEETS_SHEET_NAME
  );
}

async function getGoogleSheetsAccessToken(config: GoogleSheetsConfig) {
  const auth = new GoogleAuth({
    credentials: {
      client_email: config.clientEmail,
      private_key: config.privateKey,
    },
    scopes: [GOOGLE_SHEETS_SCOPE],
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

export async function appendSeminarLeadToGoogleSheets(
  payload: LeadSyncPayload
): Promise<GoogleSheetsSyncResult> {
  const result = await appendSeminarLeadToGoogleSheetsCore(
    payload,
    getGoogleSheetsConfig(),
    { getAccessToken: getGoogleSheetsAccessToken }
  );

  if (result.status === "failed") {
    console.error("Google Sheets lead sync failed.", result.error);
  }

  return result;
}

export async function appendWatiInboundLeadToGoogleSheets(
  payload: LeadSyncPayload
): Promise<GoogleSheetsSyncResult> {
  const result = await appendWatiInboundLeadToGoogleSheetsCore(
    payload,
    getWatiGoogleSheetsConfig(),
    { getAccessToken: getGoogleSheetsAccessToken }
  );

  if (result.status === "failed") {
    console.error("WATI inbound Google Sheets lead sync failed.", result.error);
  }

  return result;
}
