import "server-only";

import { and, eq, gte } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { after } from "next/server";

import {
  getIpAddress,
  minutesAgo,
  type ClientContext,
  type QueryParamMap,
} from "@/app/_actions/form-helpers";
import {
  enqueueLeadDeliveryJob,
  processBackgroundJobById,
} from "@/lib/background-jobs";
import {
  attachLeadToConversation,
  getConversationTranscript,
  resolveConversationId,
} from "@/lib/chatbot/conversations";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { getLeadDeliveryRoute } from "@/lib/lead-delivery-routes";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import { resolveResidenceCountry } from "@/lib/lead-residence";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";
import { getTrackingSnapshot } from "@/lib/tracking";

/**
 * Lead capture from inside the chat.
 *
 * This deliberately writes the same `leads` row, builds the same handoff
 * payload and enqueues the same delivery job as the website forms — chat leads
 * go down the existing CRM / Pabbly / WhatsApp pipeline with no special-casing
 * downstream. The only thing that marks them out is `ctaVariant`, so chat
 * conversion can be measured against the forms.
 *
 * It mirrors submit-lead.ts rather than importing it because that action ends
 * in a redirect(), which a fetch from the chat widget cannot follow.
 */

export const CHATBOT_CTA_VARIANT = "chatbot";

export type ChatLeadInput = {
  fullName: string;
  phone: string;
  residenceCountry?: string;
  userState?: string;
  email?: string;
  countrySlug?: string;
  courseSlug?: string;
  universitySlug?: string;
  conversationId?: string;
  page: { path: string; url?: string; title?: string };
  /** Set by the mobile app's endpoint; the website sends nothing. */
  channel?: "mobile_app";
  /** The signed-in account, where the surface knows it (the app's bearer token). */
  userId?: string;
};

export type ChatLeadResult =
  | { ok: true; leadId?: number }
  | { ok: false; error: string };

/**
 * The counsellor should open the call already knowing what was discussed, so
 * the transcript tail rides along in `notes` — the one field the CRM contract
 * already carries as free text.
 */
function buildNotes(
  transcript: Array<{ role: string; content: string }>,
  page: ChatLeadInput["page"]
) {
  const lines = [
    `Chat enquiry from ${page.title ? `${page.title} (${page.path})` : page.path}.`,
  ];

  if (transcript.length > 0) {
    lines.push("", "Conversation:");
    for (const message of transcript.slice(-8)) {
      const who = message.role === "user" ? "Student" : "Mira";
      lines.push(`${who}: ${message.content.replace(/\s+/g, " ").slice(0, 300)}`);
    }
  }

  // The CRM free-text field is not unbounded; keep the tail that matters.
  return lines.join("\n").slice(0, 4000);
}

/**
 * The website forms pass the landing query string through as `sourceQuery`, so
 * the chat does the same — otherwise a chat lead loses the campaign parameters
 * that a form lead on the identical page would carry.
 */
function parseSourceQuery(url?: string): QueryParamMap {
  if (!url) return {};

  try {
    const query: QueryParamMap = {};
    for (const [key, value] of new URL(url).searchParams) {
      const existing = query[key];
      if (existing === undefined) {
        query[key] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        query[key] = [existing, value];
      }
    }
    return query;
  } catch {
    return {};
  }
}

export async function captureChatLead(
  input: ChatLeadInput
): Promise<ChatLeadResult> {
  const db = getDb();

  if (!db) {
    console.warn(
      "Chat lead skipped DB persistence because DATABASE_URL is missing."
    );
    return { ok: true };
  }

  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const submittedAt = new Date();
  const ipAddress = getIpAddress(headerStore);
  const sourceQuery = parseSourceQuery(input.page.url);
  const tracking = getTrackingSnapshot(cookieStore, sourceQuery);
  const metaEventId = randomUUID();
  const residenceCountry = resolveResidenceCountry({
    submitted: input.residenceCountry,
    headerStore,
    phone: input.phone,
  });
  const userState = input.userState?.trim() || undefined;
  const clientContext: ClientContext = {
    surface: "chatbot",
    ...(input.channel ? { channel: input.channel } : {}),
    ...(input.userId ? { userId: input.userId } : {}),
  };

  if (!residenceCountry) {
    return { ok: false, error: "Please select the country you live in." };
  }

  if (residenceCountry === "IN" && (!userState || userState.length < 2)) {
    return { ok: false, error: "Please select your state." };
  }

  // Same two guards as the website forms: a repeat phone inside 15 minutes is a
  // double submit, and the per-IP / per-phone windows stop enumeration.
  const [recentLead] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.phone, input.phone), gte(leads.createdAt, minutesAgo(15))))
    .limit(1);

  if (recentLead) {
    return {
      ok: false,
      error:
        "We already have your request from a few minutes ago — a counsellor will call you shortly.",
    };
  }

  const rateLimitError = await consumePublicFormRateLimits(
    [
      ipAddress
        ? {
            scope: "public:chat-lead:ip",
            identifier: ipAddress,
            limit: 6,
            windowMs: 30 * 60_000,
            blockMs: 2 * 60 * 60_000,
          }
        : null,
      {
        scope: "public:chat-lead:phone",
        identifier: normalizePhoneIdentifier(input.phone),
        limit: 4,
        windowMs: 6 * 60 * 60_000,
        blockMs: 12 * 60 * 60_000,
      },
    ],
    "callback requests"
  );

  if (rateLimitError) {
    return { ok: false, error: rateLimitError };
  }

  const conversationRowId = input.conversationId
    ? await resolveConversationId(input.conversationId)
    : null;
  const transcript = await getConversationTranscript(conversationRowId);
  const notes = buildNotes(transcript, input.page);

  const deliveryRoute = getLeadDeliveryRoute(input.page.path);
  const shouldSyncCrm = deliveryRoute.crm && env.hasCrmLeadSyncConfig;
  const shouldSyncPabbly = deliveryRoute.pabbly && env.hasPabblyLeadWebhook;

  try {
    const [insertedLead] = await db
      .insert(leads)
      .values({
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        residenceCountry,
        userState,
        courseSlug: input.courseSlug,
        countrySlug: input.countrySlug,
        universitySlug: input.universitySlug,
        sourcePath: input.page.path,
        sourceUrl: input.page.url,
        sourceQuery,
        visitorId: tracking.visitorId,
        initialLandingPath: tracking.initialLandingPath,
        initialLandingUrl: tracking.initialLandingUrl,
        initialReferrer: tracking.initialReferrer,
        initialUtmLandingUrl: tracking.initialUtmLandingUrl,
        pageTitle: input.page.title,
        ctaVariant: CHATBOT_CTA_VARIANT,
        notes,
        utmSource: tracking.utmSource,
        utmMedium: tracking.utmMedium,
        utmCampaign: tracking.utmCampaign,
        utmTerm: tracking.utmTerm,
        utmContent: tracking.utmContent,
        gclid: tracking.gclid,
        fbclid: tracking.fbclid,
        gbraid: tracking.gbraid,
        wbraid: tracking.wbraid,
        ttclid: tracking.ttclid,
        referrer: headerStore.get("referer") ?? null,
        userAgent: headerStore.get("user-agent") ?? null,
        ipAddress,
        acceptLanguage: headerStore.get("accept-language") ?? null,
        clientContext,
        crmSyncStatus: shouldSyncCrm ? "pending" : "skipped",
        pabblySyncStatus: shouldSyncPabbly ? "pending" : "skipped",
        leadSquaredSyncStatus: "skipped",
        createdAt: submittedAt,
      })
      .returning({ id: leads.id });

    const leadId = insertedLead?.id;

    if (!leadId) {
      return {
        ok: false,
        error: "We could not save your request right now. Please try once more.",
      };
    }

    await attachLeadToConversation(conversationRowId, leadId);

    const handoffPayload = buildLeadHandoffPayload({
      leadKind: "general_enquiry",
      websiteLeadId: leadId,
      submittedAt: submittedAt.toISOString(),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      residenceCountry,
      userState,
      courseSlug: input.courseSlug,
      countrySlug: input.countrySlug,
      universitySlug: input.universitySlug,
      sourcePath: input.page.path,
      sourceUrl: input.page.url,
      sourceQuery,
      pageTitle: input.page.title,
      ctaVariant: CHATBOT_CTA_VARIANT,
      notes,
      utmSource: tracking.utmSource,
      utmMedium: tracking.utmMedium,
      utmCampaign: tracking.utmCampaign,
      utmTerm: tracking.utmTerm,
      utmContent: tracking.utmContent,
      fbc: tracking.fbc,
      fbp: tracking.fbp,
      metaEventId,
      referrer: headerStore.get("referer") ?? undefined,
      userAgent: headerStore.get("user-agent") ?? undefined,
      ipAddress: ipAddress ?? undefined,
      acceptLanguage: headerStore.get("accept-language") ?? undefined,
      clientContext,
    });

    const jobId = await enqueueLeadDeliveryJob({
      leadId,
      leadHandoffPayload: handoffPayload,
      deliveryStateInitialized: true,
      whatsappPayload: deliveryRoute.whatsapp
        ? {
            fullName: input.fullName,
            phone: input.phone,
            courseSlug: input.courseSlug,
            countrySlug: input.countrySlug,
            universitySlug: input.universitySlug,
            sourcePath: input.page.path,
          }
        : undefined,
    });

    if (env.enableInlineJobProcessing && jobId) {
      after(() => processBackgroundJobById(jobId));
    }

    return { ok: true, leadId };
  } catch (error) {
    console.error("Chat lead capture error:", error);
    return {
      ok: false,
      error: "We could not save your request right now. Please try once more.",
    };
  }
}
