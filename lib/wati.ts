import "server-only";

import { eq } from "drizzle-orm";

import { env } from "@/lib/env";
import { siteConfig } from "@/lib/constants";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

const WATI_TIMEOUT_MS = 6_000;

type WatiTemplateParameter = {
  name: string;
  value: string;
};

type SendWatiTemplateOptions = {
  leadId?: number;
  whatsappNumber: string;
  templateName: string;
  broadcastName: string;
  parameters: WatiTemplateParameter[];
};

type LeadWhatsAppPayload = {
  fullName: string;
  phone: string;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  sourcePath: string;
};

type SeminarWhatsAppPayload = {
  fullName: string;
  phone: string;
  seminarEvent: string;
  city: string;
};

type WatiTemplateKey = "standardLead" | "seminarLead" | "seminarRegistration";

type WatiTemplateConfig = {
  templateName: string;
  buildBroadcastName: (payload: LeadWhatsAppPayload | SeminarWhatsAppPayload) => string;
  buildParameters: (payload: LeadWhatsAppPayload | SeminarWhatsAppPayload) => WatiTemplateParameter[];
};

const PLACEHOLDER_TEMPLATE_NAMES = new Set(["website_lead_v1"]);

type WatiSendResult = {
  ok: boolean;
  localMessageId?: string;
  whatsappMessageId?: string;
  status?: string;
  error?: string;
};

function normalizePhoneNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

function buildTemplateParameters(values: Array<string | undefined>) {
  return values.map((value, index) => ({
    name: String(index + 1),
    value: value?.trim() || "NA",
  }));
}

function sanitizeBroadcastPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "notification";
}

function buildBroadcastName(parts: string[]) {
  return `${parts.map(sanitizeBroadcastPart).join("-")}-${Date.now()}`.slice(0, 80);
}

function getInterest(payload: LeadWhatsAppPayload) {
  return (
    payload.universitySlug?.trim() ||
    payload.countrySlug?.trim() ||
    payload.courseSlug?.trim() ||
    "study-abroad"
  );
}

const watiTemplates: Record<WatiTemplateKey, WatiTemplateConfig> = {
  standardLead: {
    // Replace with the exact approved WATI template name for standard website leads.
    templateName: "website_lead_v1",
    buildBroadcastName: (payload) =>
      buildBroadcastName([
        "lead",
        getInterest(payload as LeadWhatsAppPayload),
        (payload as LeadWhatsAppPayload).sourcePath,
      ]),
    buildParameters: (payload) => {
      const leadPayload = payload as LeadWhatsAppPayload;
      return buildTemplateParameters([
        leadPayload.fullName,
        getInterest(leadPayload),
        leadPayload.sourcePath,
      ]);
    },
  },
  seminarLead: {
    templateName: "mbbs_seminar_2026_submitted_notification",
    buildBroadcastName: (payload) =>
      buildBroadcastName([
        "seminar",
        (payload as SeminarWhatsAppPayload).city,
        (payload as SeminarWhatsAppPayload).seminarEvent,
      ]),
    buildParameters: (payload) => {
      const seminarPayload = payload as SeminarWhatsAppPayload;
      return buildTemplateParameters([
        seminarPayload.fullName,
        seminarPayload.city,
        seminarPayload.seminarEvent,
      ]);
    },
  },
  seminarRegistration: {
    templateName: "mbbs_seminar_2026_registration_confirmation",
    buildBroadcastName: (payload) =>
      buildBroadcastName([
        "seminar-registration",
        (payload as SeminarWhatsAppPayload).city,
        (payload as SeminarWhatsAppPayload).seminarEvent,
      ]),
    buildParameters: (payload) => {
      const seminarPayload = payload as SeminarWhatsAppPayload;
      return buildTemplateParameters([
        seminarPayload.fullName,
        "MBBS Abroad Seminar 2026",
        seminarPayload.city,
        seminarPayload.seminarEvent,
      ]);
    },
  },
};

function normalizeAccessToken(accessToken: string) {
  return accessToken.replace(/^Bearer\s+/i, "").trim();
}

async function updateLeadWatiState(
  leadId: number | undefined,
  values: Partial<typeof leads.$inferInsert>
) {
  if (!leadId) {
    return;
  }

  const db = getDb();
  if (!db) {
    return;
  }

  await db.update(leads).set(values).where(eq(leads.id, leadId));
}

async function sendTemplateMessage(options: SendWatiTemplateOptions) {
  if (!env.hasWati || !env.watiApiBaseUrl || !env.watiAccessToken) {
    console.warn("[wati] Missing WATI configuration — skipping WhatsApp send.");
    await updateLeadWatiState(options.leadId, {
      watiMessageStatus: "skipped",
      watiTemplateName: options.templateName,
      watiLastEvent: "config_missing",
      watiStatusUpdatedAt: new Date(),
    });
    return { ok: false, status: "skipped", error: "config_missing" } satisfies WatiSendResult;
  }

  if (PLACEHOLDER_TEMPLATE_NAMES.has(options.templateName)) {
    console.warn("[wati] Template name is still a placeholder — skipping WhatsApp send.");
    await updateLeadWatiState(options.leadId, {
      watiMessageStatus: "skipped",
      watiTemplateName: options.templateName,
      watiLastEvent: "template_placeholder",
      watiStatusUpdatedAt: new Date(),
    });
    return {
      ok: false,
      status: "skipped",
      error: "template_placeholder",
    } satisfies WatiSendResult;
  }

  const whatsappNumber = normalizePhoneNumber(options.whatsappNumber);
  if (!whatsappNumber) {
    console.warn("[wati] Missing valid WhatsApp number — skipping WhatsApp send.");
    await updateLeadWatiState(options.leadId, {
      watiMessageStatus: "failed",
      watiTemplateName: options.templateName,
      watiLastEvent: "invalid_phone",
      watiStatusUpdatedAt: new Date(),
      watiFailedAt: new Date(),
      watiMessageError: "invalid_phone",
    });
    return { ok: false, status: "failed", error: "invalid_phone" } satisfies WatiSendResult;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WATI_TIMEOUT_MS);

  try {
    const baseUrl = env.watiApiBaseUrl.replace(/\/+$/, "");
    const url = new URL(`${baseUrl}/sendTemplateMessage`);
    url.searchParams.set("whatsappNumber", whatsappNumber);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${normalizeAccessToken(env.watiAccessToken)}`,
      },
      body: JSON.stringify({
        template_name: options.templateName,
        broadcast_name: options.broadcastName,
        channel_number: env.watiChannelNumber || siteConfig.whatsappNumber,
        parameters: options.parameters,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[wati] Send failed ${response.status}:`, text);
      await updateLeadWatiState(options.leadId, {
        watiMessageStatus: "failed",
        watiTemplateName: options.templateName,
        watiLastEvent: "api_failed",
        watiStatusUpdatedAt: new Date(),
        watiFailedAt: new Date(),
        watiMessageError: text.slice(0, 1000),
      });
      return {
        ok: false,
        status: "failed",
        error: text.slice(0, 1000),
      } satisfies WatiSendResult;
    }

    const payload = (await response.json()) as {
      local_message_id?: string;
      whatsappMessageId?: string;
      result?: boolean;
      error?: string | null;
    };

    await updateLeadWatiState(options.leadId, {
      watiMessageStatus: payload.result ? "accepted" : "failed",
      watiTemplateName: options.templateName,
      watiLocalMessageId: payload.local_message_id ?? null,
      watiWhatsappMessageId: payload.whatsappMessageId ?? null,
      watiLastEvent: "send_template_accepted",
      watiStatusUpdatedAt: new Date(),
      watiAcceptedAt: payload.result ? new Date() : null,
      watiMessageError: payload.error ?? null,
    });

    return {
      ok: Boolean(payload.result),
      localMessageId: payload.local_message_id,
      whatsappMessageId: payload.whatsappMessageId,
      status: payload.result ? "accepted" : "failed",
      error: payload.error ?? undefined,
    } satisfies WatiSendResult;
  } catch (error) {
    console.error("[wati] Failed to send template message:", error);
    const message = error instanceof Error ? error.message : String(error);
    await updateLeadWatiState(options.leadId, {
      watiMessageStatus: "failed",
      watiTemplateName: options.templateName,
      watiLastEvent: "request_error",
      watiStatusUpdatedAt: new Date(),
      watiFailedAt: new Date(),
      watiMessageError: message.slice(0, 1000),
    });
    return {
      ok: false,
      status: "failed",
      error: message.slice(0, 1000),
    } satisfies WatiSendResult;
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendLeadWhatsAppMessage(
  payload: LeadWhatsAppPayload,
  leadId?: number
) {
  const template = watiTemplates.standardLead;

  return sendTemplateMessage({
    leadId,
    whatsappNumber: payload.phone,
    templateName: template.templateName,
    broadcastName: template.buildBroadcastName(payload),
    parameters: template.buildParameters(payload),
  });
}

export async function sendSeminarLeadWhatsAppMessage(
  payload: SeminarWhatsAppPayload,
  leadId?: number
) {
  const template = watiTemplates.seminarLead;

  return sendTemplateMessage({
    leadId,
    whatsappNumber: payload.phone,
    templateName: template.templateName,
    broadcastName: template.buildBroadcastName(payload),
    parameters: template.buildParameters(payload),
  });
}

export async function sendSeminarRegistrationWhatsAppMessage(
  payload: SeminarWhatsAppPayload,
  leadId?: number
) {
  const template = watiTemplates.seminarRegistration;

  return sendTemplateMessage({
    leadId,
    whatsappNumber: payload.phone,
    templateName: template.templateName,
    broadcastName: template.buildBroadcastName(payload),
    parameters: template.buildParameters(payload),
  });
}
