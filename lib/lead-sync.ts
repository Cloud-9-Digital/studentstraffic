import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";

type QueryParamValue = string | string[];
type ClientContext = Record<
  string,
  string | number | boolean | null | string[]
>;

type LeadSyncUpdate = {
  crmSyncStatus?: string;
  crmSyncedAt?: Date | null;
  crmSyncError?: string | null;
  crmExternalId?: string | null;
  pabblySyncStatus?: string;
  pabblySyncedAt?: Date | null;
  pabblySyncError?: string | null;
};

type CrmSyncResponse = {
  ok?: boolean;
  leadId?: number;
  created?: boolean;
  updated?: boolean;
  error?: string;
  message?: string;
};

export type LeadSyncPayload = {
  websiteLeadId?: number;
  submittedAt: string;
  fullName: string;
  phone: string;
  email?: string;
  userState?: string;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  sourcePath: string;
  sourceUrl?: string;
  sourceQuery: Record<string, QueryParamValue>;
  pageTitle?: string;
  ctaVariant: string;
  notes?: string;
  documentReferrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  acceptLanguage?: string;
  clientContext: ClientContext;
};

const SYNC_TIMEOUT_MS = 8_000;
const SYNC_PLACEHOLDER = "NA";

type LeadSyncTransportPayload = Omit<
  LeadSyncPayload,
  | "email"
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
  email: string;
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
    email: withPlaceholder(payload.email),
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

async function syncLeadToCrm(
  leadId: number | undefined,
  payload: LeadSyncPayload
) {
  if (!env.hasCrmLeadSyncConfig || !env.crmLeadIntakeUrl || !env.crmLeadIntakeSecret) {
    await updateLeadSyncState(leadId, {
      crmSyncStatus: "skipped",
      crmSyncedAt: null,
      crmSyncError: null,
      crmExternalId: null,
    });
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
      throw new Error(
        parsed.error ??
          parsed.message ??
          `CRM intake failed with status ${response.status}.`
      );
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
  payload: LeadSyncPayload
) {
  if (!env.hasPabblyLeadWebhook || !env.pabblyLeadWebhookUrl) {
    await updateLeadSyncState(leadId, {
      pabblySyncStatus: "skipped",
      pabblySyncedAt: null,
      pabblySyncError: null,
    });
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

export async function syncLeadDestinations(
  leadId: number | undefined,
  payload: LeadSyncPayload
) {
  await Promise.allSettled([
    syncLeadToCrm(leadId, payload),
    syncLeadToPabbly(leadId, payload),
  ]);
}
