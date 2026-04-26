import type { LeadSyncPayload } from "@/lib/lead-sync-payload";

const GOOGLE_SHEETS_RANGE = "A:F";
const GOOGLE_SHEETS_TIMEOUT_MS = 8_000;
const GOOGLE_SHEETS_TIME_ZONE = "Asia/Kolkata";
const DEFAULT_VALUE = "NA";

export type GoogleSheetsConfig = {
  spreadsheetId: string;
  sheetName: string;
  clientEmail: string;
  privateKey: string;
};

type GoogleSheetsSyncDeps = {
  fetchFn?: typeof fetch;
  getAccessToken?: (config: GoogleSheetsConfig) => Promise<string>;
};

export type GoogleSheetsSyncResult =
  | { status: "skipped"; reason: string }
  | { status: "synced"; row: string[] }
  | { status: "failed"; error: string };

function trimOrUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function withDefault(value?: string | null) {
  return trimOrUndefined(value) ?? DEFAULT_VALUE;
}

function getReferrerHost(value?: string) {
  const referrer = trimOrUndefined(value);
  if (!referrer) {
    return undefined;
  }

  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
}

function includesAny(value: string | undefined, patterns: string[]) {
  if (!value) {
    return false;
  }

  return patterns.some((pattern) => value.includes(pattern));
}

function formatDateForSheet(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: GOOGLE_SHEETS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

export function buildGoogleSheetsSource(payload: LeadSyncPayload) {
  const utmSource = trimOrUndefined(payload.utmSource)?.toLowerCase();
  const utmMedium = trimOrUndefined(payload.utmMedium)?.toLowerCase();
  const referrerHost = getReferrerHost(payload.referrer)?.toLowerCase();

  const looksPaid =
    includesAny(utmMedium, ["cpc", "ppc", "paid", "ads", "ad"]) ||
    Boolean(payload.gclid || payload.fbclid || payload.gbraid || payload.wbraid || payload.ttclid);

  if (
    includesAny(utmSource, ["instagram", "ig"]) ||
    includesAny(referrerHost, ["instagram.com"])
  ) {
    return looksPaid ? "Instagram Ad" : "Organic";
  }

  if (
    includesAny(utmSource, ["facebook", "fb", "meta"]) ||
    includesAny(referrerHost, ["facebook.com", "m.facebook.com"])
  ) {
    return looksPaid ? "Facebook Ad" : "Organic";
  }

  if (
    includesAny(utmSource, ["google"]) ||
    includesAny(referrerHost, ["google."]) ||
    Boolean(payload.gclid || payload.gbraid || payload.wbraid)
  ) {
    return looksPaid ? "Google Ad" : "Organic";
  }

  if (looksPaid) {
    return "Ad";
  }

  return "Organic";
}

export function buildGoogleSheetsLeadRow(payload: LeadSyncPayload) {
  return [
    formatDateForSheet(payload.submittedAt),
    withDefault(payload.fullName),
    withDefault(payload.phone),
    withDefault(payload.seminarEvent),
    withDefault(payload.city ?? payload.userState),
    buildGoogleSheetsSource(payload),
  ];
}

function getAppendUrl(config: GoogleSheetsConfig) {
  const range = encodeURIComponent(`${config.sheetName}!${GOOGLE_SHEETS_RANGE}`);
  const params = new URLSearchParams({
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
  });

  return `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?${params.toString()}`;
}

export async function appendSeminarLeadToGoogleSheets(
  payload: LeadSyncPayload,
  config: GoogleSheetsConfig | null,
  deps: GoogleSheetsSyncDeps
): Promise<GoogleSheetsSyncResult> {
  if (!trimOrUndefined(payload.seminarEvent)) {
    return { status: "skipped", reason: "missing_seminar_event" };
  }

  if (!config) {
    return { status: "skipped", reason: "missing_google_sheets_config" };
  }

  const row = buildGoogleSheetsLeadRow(payload);
  const fetchFn = deps.fetchFn ?? fetch;
  const getAccessToken = deps.getAccessToken;

  if (!getAccessToken) {
    return { status: "failed", error: "missing_access_token_provider" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GOOGLE_SHEETS_TIMEOUT_MS);

  try {
    const accessToken = await getAccessToken(config);
    const response = await fetchFn(getAppendUrl(config), {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        majorDimension: "ROWS",
        values: [row],
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        responseText || `Google Sheets append failed with status ${response.status}.`
      );
    }

    return { status: "synced", row };
  } catch (error) {
    const message =
      error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500);
    return { status: "failed", error: message };
  } finally {
    clearTimeout(timeout);
  }
}
