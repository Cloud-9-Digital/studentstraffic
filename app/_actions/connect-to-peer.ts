"use server";

import { cookies, headers } from "next/headers";
import { and, eq, gte } from "drizzle-orm";
import { z } from "zod";

import {
  type ClientContext,
  emptyToUndefined,
  getFirstQueryValue,
  getFormString,
  getIpAddress,
  minutesAgo,
  parseJsonObject,
  type QueryParamMap,
  wasSubmittedTooFast,
} from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { countries, leads, peerRequests, studentPeers, universities } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { sendPeerConnectionSentEmail } from "@/lib/email/templates/peer-connection-sent";
import { sendPeerNewRequestEmail } from "@/lib/email/templates/peer-new-request";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import { syncLeadDestinations } from "@/lib/lead-sync";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

export type ConnectToPeerState = {
  error?: string;
  success?: boolean;
};

const connectToPeerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address."),
  peerId: z.coerce.number().int().positive(),
  universitySlug: z.string().trim().min(1),
  sourcePath: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  sourceQuery: z.string().trim().optional(),
  pageTitle: z.string().trim().optional(),
  documentReferrer: z.string().trim().optional(),
  clientContext: z.string().trim().optional(),
  website: z.string().trim().optional(),
  startedAt: z.string().trim().min(1),
});

export async function connectToPeerAction(
  _prevState: ConnectToPeerState,
  formData: FormData
): Promise<ConnectToPeerState> {
  const parsed = connectToPeerSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    phone: getFormString(formData, "phone"),
    email: getFormString(formData, "email"),
    peerId: getFormString(formData, "peerId"),
    universitySlug: getFormString(formData, "universitySlug"),
    sourcePath: getFormString(formData, "sourcePath"),
    sourceUrl: getFormString(formData, "sourceUrl"),
    sourceQuery: getFormString(formData, "sourceQuery"),
    pageTitle: getFormString(formData, "pageTitle"),
    documentReferrer: getFormString(formData, "documentReferrer"),
    clientContext: getFormString(formData, "clientContext"),
    website: getFormString(formData, "website"),
    startedAt: getFormString(formData, "startedAt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const data = parsed.data;

  if (data.website) {
    return { error: "Spam detection triggered. Please try again." };
  }

  if (wasSubmittedTooFast(data.startedAt)) {
    return { error: "Please take a moment and submit again." };
  }

  const db = getDb();

  if (!db) {
    return { error: "This feature is temporarily unavailable. Please try again shortly." };
  }

  const headerStore = await headers();
  const cookieStore = await cookies();
  const ipAddress = getIpAddress(headerStore);

  const rateLimitError = await consumePublicFormRateLimits(
    [
      ipAddress
        ? {
            scope: "public:peer_request:ip",
            identifier: ipAddress,
            limit: 4,
            windowMs: 30 * 60_000,
            blockMs: 2 * 60 * 60_000,
          }
        : null,
      {
        scope: "public:peer_request:phone",
        identifier: normalizePhoneIdentifier(data.phone),
        limit: 3,
        windowMs: 6 * 60 * 60_000,
        blockMs: 12 * 60 * 60_000,
      },
    ],
    "peer requests"
  );

  if (rateLimitError) {
    return { error: rateLimitError };
  }

  // Look up peer — must be active and belong to the given university (security check)
  const [peer] = await db
    .select({
      id: studentPeers.id,
      contactPhone: studentPeers.contactPhone,
      contactEmail: studentPeers.contactEmail,
      fullName: studentPeers.fullName,
      universityId: studentPeers.universityId,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(
      and(
        eq(studentPeers.id, data.peerId),
        eq(universities.slug, data.universitySlug),
        eq(studentPeers.status, "active")
      )
    )
    .limit(1);

  if (!peer) {
    return { error: "This student peer is no longer available." };
  }

  if (!peer.contactPhone) {
    return { error: "This peer's contact is not set up yet. Try a different peer." };
  }

  const [universityRecord] = await db
    .select({
      id: universities.id,
      name: universities.name,
      slug: universities.slug,
      countrySlug: countries.slug,
    })
    .from(universities)
    .innerJoin(countries, eq(universities.countryId, countries.id))
    .where(eq(universities.slug, data.universitySlug))
    .limit(1);

  if (!universityRecord) {
    return { error: "University not found. Please refresh and try again." };
  }

  // Check for recent duplicate from the same phone to the same peer
  const [recentRequest] = await db
    .select({ id: peerRequests.id })
    .from(peerRequests)
    .where(
      and(
        eq(peerRequests.universityId, universityRecord.id),
        eq(peerRequests.phone, data.phone),
        gte(peerRequests.createdAt, minutesAgo(30))
      )
    )
    .limit(1);

  if (recentRequest) {
    return { success: true };
  }

  const submittedAt = new Date();
  const sourceQuery = parseJsonObject<QueryParamMap>(data.sourceQuery);
  const clientContext = parseJsonObject<ClientContext>(data.clientContext);
  const utmSource = cookieStore.get("utm_source")?.value ?? getFirstQueryValue(sourceQuery, "utm_source");
  const utmMedium = cookieStore.get("utm_medium")?.value ?? getFirstQueryValue(sourceQuery, "utm_medium");
  const utmCampaign = cookieStore.get("utm_campaign")?.value ?? getFirstQueryValue(sourceQuery, "utm_campaign");
  const utmTerm = cookieStore.get("utm_term")?.value ?? getFirstQueryValue(sourceQuery, "utm_term");
  const utmContent = cookieStore.get("utm_content")?.value ?? getFirstQueryValue(sourceQuery, "utm_content");

  let insertedLeadId: number | undefined;

  try {
    const [insertedLead] = await db
      .insert(leads)
      .values({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        countrySlug: universityRecord.countrySlug,
        universitySlug: universityRecord.slug,
        sourcePath: data.sourcePath,
        sourceUrl: emptyToUndefined(data.sourceUrl),
        sourceQuery,
        pageTitle: emptyToUndefined(data.pageTitle),
        ctaVariant: "peer_connect",
        documentReferrer: emptyToUndefined(data.documentReferrer),
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer: headerStore.get("referer") ?? null,
        userAgent: headerStore.get("user-agent") ?? null,
        ipAddress,
        acceptLanguage: headerStore.get("accept-language") ?? null,
        clientContext,
        crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
        pabblySyncStatus: env.hasPabblyLeadWebhook ? "pending" : "skipped",
        createdAt: submittedAt,
      })
      .returning({ id: leads.id });

    insertedLeadId = insertedLead?.id;

    await db.insert(peerRequests).values({
      universityId: universityRecord.id,
      leadId: insertedLeadId,
      matchedPeerId: peer.id,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      userState: "Not provided",
      sourcePath: data.sourcePath,
      sourceUrl: emptyToUndefined(data.sourceUrl),
      sourceQuery,
      pageTitle: emptyToUndefined(data.pageTitle),
      documentReferrer: emptyToUndefined(data.documentReferrer),
      userAgent: headerStore.get("user-agent") ?? null,
      ipAddress,
      acceptLanguage: headerStore.get("accept-language") ?? null,
      clientContext,
      status: "matched",
      createdAt: submittedAt,
      updatedAt: submittedAt,
    });
  } catch (err) {
    console.error("[connect-to-peer] insert failed:", err);
    return { error: "We could not save your request. Please try once more." };
  }

  void syncLeadDestinations(insertedLeadId, buildLeadHandoffPayload({
    leadKind: "peer_connection",
    websiteLeadId: insertedLeadId,
    submittedAt: submittedAt.toISOString(),
    fullName: data.fullName,
    phone: data.phone,
    countrySlug: universityRecord.countrySlug,
    universitySlug: universityRecord.slug,
    sourcePath: data.sourcePath,
    sourceUrl: emptyToUndefined(data.sourceUrl),
    sourceQuery,
    pageTitle: emptyToUndefined(data.pageTitle),
    ctaVariant: "peer_connect",
    documentReferrer: emptyToUndefined(data.documentReferrer),
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referrer: headerStore.get("referer") ?? undefined,
    userAgent: headerStore.get("user-agent") ?? undefined,
    ipAddress: ipAddress ?? undefined,
    acceptLanguage: headerStore.get("accept-language") ?? undefined,
    clientContext,
  }));

  // Fire-and-forget emails to both parties
  void Promise.all([
    sendPeerConnectionSentEmail({
      requesterName: data.fullName,
      requesterEmail: data.email,
      peerName: peer.fullName,
      peerPhone: peer.contactPhone,
      universityName: universityRecord.name,
    }),
    peer.contactEmail
      ? sendPeerNewRequestEmail({
          peerName: peer.fullName,
          peerEmail: peer.contactEmail,
          requesterName: data.fullName,
          requesterPhone: data.phone,
          requesterEmail: data.email,
          universityName: universityRecord.name,
        })
      : Promise.resolve(),
  ]);

  return { success: true };
}

function buildWhatsAppUrl(phone: string, peerName: string, universityName: string) {
  const digits = phone.replace(/\D/g, "");
  const firstName = peerName.split(" ")[0];
  const message = `Hi ${firstName}! I found your profile on Students Traffic and would love to hear about your experience at ${universityName}. Is this a good time to chat?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
