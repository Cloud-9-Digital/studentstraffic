import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";
import {
  appendSeminarLeadToGoogleSheets,
  appendWebsiteLeadToGoogleSheets,
} from "@/lib/google-sheets";
import { getLeadDeliveryRoute } from "@/lib/lead-delivery-routes";
import type { LeadSyncPayload } from "@/lib/lead-sync-payload";

type LeadSyncUpdate = {
  crmSyncStatus?: string;
  crmSyncedAt?: Date | null;
  crmSyncError?: string | null;
  crmExternalId?: string | null;
  pabblySyncStatus?: string;
  pabblySyncedAt?: Date | null;
  pabblySyncError?: string | null;
};

type LeadSyncOptions = {
  /**
   * The lead row was inserted with accurate pending/skipped delivery states.
   * Avoid writing those same skipped values again when the worker runs.
   */
  skipPersistedSkipStates?: boolean;
};

type CrmSyncResponse = {
  ok?: boolean;
  leadId?: number;
  created?: boolean;
  updated?: boolean;
  error?: string;
  message?: string;
  /** Stable identifier for the failure, e.g. "duplicate_lead". */
  code?: string;
  /** False when the CRM will refuse this same payload however often it is sent. */
  retryable?: boolean;
};

/**
 * Statuses that mean a destination is finished with this lead, whether or not it took it.
 * Shared with the delivery job so the two cannot drift: a status the job does not recognise as
 * settled is one it keeps retrying.
 */
export function isSettledSyncStatus(status: string | null): boolean {
  return status === "synced" || status === "skipped" || status === "rejected";
}

const SYNC_TIMEOUT_MS = 8_000;
const SYNC_PLACEHOLDER = "NA";

type LeadSyncTransportPayload = Omit<
  LeadSyncPayload,
  | "leadKind"
  | "primaryInterestType"
  | "email"
  | "fatherName"
  | "alternatePhone"
  | "city"
  | "seminarEvent"
  | "interestedCountry"
  | "budgetRange"
  | "needsFmgeSession"
  | "documentUrl"
  | "documentType"
  | "userState"
  | "courseSlug"
  | "countrySlug"
  | "universitySlug"
  | "sourceUrl"
  | "pageTitle"
  | "notes"
  | "documentReferrer"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "utmTerm"
  | "utmContent"
  | "referrer"
  | "userAgent"
  | "ipAddress"
  | "acceptLanguage"
> & {
  handoffVersion: string;
  leadKind: string;
  sourceCategory: string;
  acquisitionChannel: string;
  primaryInterestType: string;
  primaryInterestValue: string;
  email: string;
  fatherName: string;
  alternatePhone: string;
  city: string;
  seminarEvent: string;
  interestedCountry: string;
  budgetRange: string;
  needsFmgeSession: boolean;
  documentUrl: string;
  documentType: string;
  userState: string;
  courseSlug: string;
  countrySlug: string;
  universitySlug: string;
  sourceUrl: string;
  pageTitle: string;
  notes: string;
  documentReferrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  acceptLanguage: string;
};

type PabblyLeadPayload = LeadSyncTransportPayload & {
  courseInterest: string;
  countryInterest: string;
  universityInterest: string;
};

function withPlaceholder(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : SYNC_PLACEHOLDER;
}

function buildTransportPayload(
  payload: LeadSyncPayload
): LeadSyncTransportPayload {
  return {
    ...payload,
    handoffVersion: withPlaceholder(payload.handoffVersion),
    leadKind: withPlaceholder(payload.leadKind),
    sourceCategory: withPlaceholder(payload.sourceCategory),
    acquisitionChannel: withPlaceholder(payload.acquisitionChannel),
    primaryInterestType: withPlaceholder(payload.primaryInterestType),
    primaryInterestValue: withPlaceholder(payload.primaryInterestValue),
    email: withPlaceholder(payload.email),
    fatherName: withPlaceholder(payload.fatherName),
    alternatePhone: withPlaceholder(payload.alternatePhone),
    city: withPlaceholder(payload.city),
    seminarEvent: withPlaceholder(payload.seminarEvent),
    interestedCountry: withPlaceholder(payload.interestedCountry),
    budgetRange: withPlaceholder(payload.budgetRange),
    needsFmgeSession: payload.needsFmgeSession ?? false,
    documentUrl: withPlaceholder(payload.documentUrl),
    documentType: withPlaceholder(payload.documentType),
    userState: withPlaceholder(payload.userState),
    courseSlug: withPlaceholder(payload.courseSlug),
    countrySlug: withPlaceholder(payload.countrySlug),
    universitySlug: withPlaceholder(payload.universitySlug),
    sourceUrl: withPlaceholder(payload.sourceUrl),
    pageTitle: withPlaceholder(payload.pageTitle),
    notes: withPlaceholder(payload.notes),
    documentReferrer: withPlaceholder(payload.documentReferrer),
    utmSource: withPlaceholder(payload.utmSource),
    utmMedium: withPlaceholder(payload.utmMedium),
    utmCampaign: withPlaceholder(payload.utmCampaign),
    utmTerm: withPlaceholder(payload.utmTerm),
    utmContent: withPlaceholder(payload.utmContent),
    referrer: withPlaceholder(payload.referrer),
    userAgent: withPlaceholder(payload.userAgent),
    ipAddress: withPlaceholder(payload.ipAddress),
    acceptLanguage: withPlaceholder(payload.acceptLanguage),
  };
}

function buildPabblyPayload(payload: LeadSyncPayload): PabblyLeadPayload {
  const transportPayload = buildTransportPayload(payload);

  return {
    ...transportPayload,
    courseInterest: transportPayload.courseSlug,
    countryInterest: transportPayload.countrySlug,
    universityInterest: transportPayload.universitySlug,
  };
}

function truncateErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  return String(error).slice(0, 500);
}

async function updateLeadSyncState(leadId: number | undefined, values: LeadSyncUpdate) {
  if (!leadId) {
    return;
  }

  const db = getDb();
  if (!db) {
    return;
  }

  await db.update(leads).set(values).where(eq(leads.id, leadId));
}

async function postJson(url: string, body: unknown, headers?: HeadersInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function syncLeadToCrm(
  leadId: number | undefined,
  payload: LeadSyncPayload,
  options: LeadSyncOptions = {},
) {
  if (!getLeadDeliveryRoute(payload.sourcePath).crm) {
    if (!options.skipPersistedSkipStates) {
      await updateLeadSyncState(leadId, {
        crmSyncStatus: "skipped",
        crmSyncedAt: null,
        crmSyncError: null,
        crmExternalId: null,
      });
    }
    return;
  }

  if (!env.hasCrmLeadSyncConfig || !env.crmLeadIntakeUrl || !env.crmLeadIntakeSecret) {
    if (!options.skipPersistedSkipStates) {
      await updateLeadSyncState(leadId, {
        crmSyncStatus: "skipped",
        crmSyncedAt: null,
        crmSyncError: null,
        crmExternalId: null,
      });
    }
    return;
  }

  try {
    const response = await postJson(
      env.crmLeadIntakeUrl,
      buildTransportPayload(payload),
      {
      "x-lead-intake-secret": env.crmLeadIntakeSecret,
      }
    );
    const rawText = await response.text();
    const parsed = rawText ? (JSON.parse(rawText) as CrmSyncResponse) : {};

    if (!response.ok) {
      const reason =
        parsed.error ??
        parsed.message ??
        `CRM intake failed with status ${response.status}.`;

      // The CRM distinguishes "not right now" from "not ever" — a duplicate or a payload it
      // will never accept comes back retryable:false. Recording that as a terminal state costs
      // one write; leaving it as `failed` costs five retries of a request whose answer cannot
      // change, and buries the reason under attempt counts.
      if (parsed.retryable === false) {
        await updateLeadSyncState(leadId, {
          crmSyncStatus: "rejected",
          crmSyncedAt: null,
          crmSyncError: parsed.code ? `${parsed.code}: ${reason}` : reason,
          crmExternalId: null,
        });
        console.warn("CRM permanently rejected the lead; not retrying.", {
          leadId,
          code: parsed.code,
          reason,
        });
        return;
      }

      throw new Error(reason);
    }

    await updateLeadSyncState(leadId, {
      crmSyncStatus: "synced",
      crmSyncedAt: new Date(),
      crmSyncError: null,
      crmExternalId: parsed.leadId ? String(parsed.leadId) : null,
    });
  } catch (error) {
    console.error("CRM lead sync failed.", error);
    await updateLeadSyncState(leadId, {
      crmSyncStatus: "failed",
      crmSyncedAt: null,
      crmSyncError: truncateErrorMessage(error),
    });
  }
}

async function syncLeadToPabbly(
  leadId: number | undefined,
  payload: LeadSyncPayload,
  options: LeadSyncOptions = {},
) {
  if (
    !getLeadDeliveryRoute(payload.sourcePath).pabbly ||
    !env.hasPabblyLeadWebhook ||
    !env.pabblyLeadWebhookUrl
  ) {
    if (!options.skipPersistedSkipStates) {
      await updateLeadSyncState(leadId, {
        pabblySyncStatus: "skipped",
        pabblySyncedAt: null,
        pabblySyncError: null,
      });
    }
    return;
  }

  try {
    const pabblyPayload = buildPabblyPayload(payload);
    const response = await postJson(env.pabblyLeadWebhookUrl, {
      event: "lead.created",
      sentAt: new Date().toISOString(),
      ...pabblyPayload,
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        responseText || `Pabbly webhook failed with status ${response.status}.`
      );
    }

    await updateLeadSyncState(leadId, {
      pabblySyncStatus: "synced",
      pabblySyncedAt: new Date(),
      pabblySyncError: null,
    });
  } catch (error) {
    console.error("Pabbly lead sync failed.", error);
    await updateLeadSyncState(leadId, {
      pabblySyncStatus: "failed",
      pabblySyncedAt: null,
      pabblySyncError: truncateErrorMessage(error),
    });
  }
}

async function syncLeadToGoogleSheets(payload: LeadSyncPayload) {
  const results = await Promise.all([
    appendSeminarLeadToGoogleSheets(payload),
    appendWebsiteLeadToGoogleSheets(payload),
  ]);

  const failures = results
    .filter((result) => result.status === "failed")
    .map((result) => result.error ?? "unknown Google Sheets error");

  if (failures.length > 0) {
    throw new Error(`Google Sheets delivery failed: ${failures.join("; ")}`);
  }
}

export async function syncLeadDestinations(
  leadId: number | undefined,
  payload: LeadSyncPayload,
  options: LeadSyncOptions = {},
) {
  await Promise.all([
    syncLeadToCrm(leadId, payload, options),
    syncLeadToPabbly(leadId, payload, options),
    syncLeadToGoogleSheets(payload),
  ]);
}
