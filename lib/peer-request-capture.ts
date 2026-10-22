import "server-only";

import { cookies, headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  ClientContext,
  emptyToUndefined,
  getFirstQueryValue,
  getIpAddress,
  minutesAgo,
  parseJsonObject,
  QueryParamMap,
} from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { countries, leads, peerRequests, universities } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { enqueueLeadDeliveryJob } from "@/lib/background-jobs";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import { isValidLeadPhone, resolveResidenceCountry } from "@/lib/lead-residence";
import { getResidenceCountryName } from "@/lib/residence-countries";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

/**
 * Asking to be introduced to a current student: the `peer_requests` row, its
 * `leads` row and the delivery job, written once for every surface — the
 * website's university pages and chat (submitPeerRequestAction) and Mira in
 * the mobile app (/api/mobile/v1/mira/peer). Form-only guards such as the
 * honeypot stay with the form.
 */

export const peerRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .refine(isValidLeadPhone, "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email address.",
    }),
  residenceCountry: z.string().trim().optional(),
  // Required below only for students living in India.
  userState: z.string().trim().optional(),
  userCity: z.string().trim().optional(),
  universitySlug: z.string().trim().min(1),
  courseInterest: z.string().trim().optional(),
  languagePreference: z.string().trim().optional(),
  message: z.string().trim().optional(),
  sourcePath: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  sourceQuery: z.string().trim().optional(),
  pageTitle: z.string().trim().optional(),
  documentReferrer: z.string().trim().optional(),
  clientContext: z.string().trim().optional(),
});

export type PeerRequestInput = z.infer<typeof peerRequestSchema>;

export type PeerRequestResult =
  | { ok: true; leadId: number; universityName: string }
  | { ok: false; error: string };

function buildLeadNotes(input: {
  courseInterest?: string;
  languagePreference?: string;
  userCity?: string;
  message?: string;
}) {
  const parts = [
    input.courseInterest ? `Course interest: ${input.courseInterest}` : null,
    input.languagePreference ? `Language preference: ${input.languagePreference}` : null,
    input.userCity ? `District: ${input.userCity}` : null,
    input.message ? `Peer questions: ${input.message}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join("\n") : undefined;
}

export async function capturePeerRequest(
  data: PeerRequestInput
): Promise<PeerRequestResult> {
  const db = getDb();

  if (!db) {
    return {
      ok: false,
      error: "This request form is temporarily unavailable. Please try again shortly.",
    };
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const residenceCountry = resolveResidenceCountry({
    submitted: data.residenceCountry,
    headerStore,
    phone: data.phone,
  });

  if (!residenceCountry) {
    return { ok: false, error: "Please select the country you live in." };
  }

  const userState = emptyToUndefined(data.userState);

  if (residenceCountry === "IN" && (!userState || userState.length < 2)) {
    return { ok: false, error: "Please select your state." };
  }

  // peer_requests.user_state is what the peer sees as "where the student is
  // from", and is required; students outside India are located by country.
  const peerRequestLocation =
    residenceCountry === "IN"
      ? userState
      : (userState ?? getResidenceCountryName(residenceCountry));

  const submittedAt = new Date();
  const sourceQuery = parseJsonObject<QueryParamMap>(data.sourceQuery);
  const clientContext = parseJsonObject<ClientContext>(data.clientContext);
  const utmSource =
    cookieStore.get("utm_source")?.value ??
    getFirstQueryValue(sourceQuery, "utm_source");
  const utmMedium =
    cookieStore.get("utm_medium")?.value ??
    getFirstQueryValue(sourceQuery, "utm_medium");
  const utmCampaign =
    cookieStore.get("utm_campaign")?.value ??
    getFirstQueryValue(sourceQuery, "utm_campaign");
  const utmTerm =
    cookieStore.get("utm_term")?.value ??
    getFirstQueryValue(sourceQuery, "utm_term");
  const utmContent =
    cookieStore.get("utm_content")?.value ??
    getFirstQueryValue(sourceQuery, "utm_content");
  const ipAddress = getIpAddress(headerStore);
  const leadNotes = buildLeadNotes({
    courseInterest: emptyToUndefined(data.courseInterest),
    languagePreference: emptyToUndefined(data.languagePreference),
    userCity: emptyToUndefined(data.userCity),
    message: emptyToUndefined(data.message),
  });

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
    return { ok: false, error: rateLimitError };
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
    return {
      ok: false,
      error: "We could not find that university. Please refresh and try again.",
    };
  }

  let insertedLeadId: number | undefined;

  try {
    const result = await db.execute<{ leadId: number }>(sql`
      WITH recent_request AS (
        SELECT 1
        FROM ${peerRequests}
        WHERE ${peerRequests.universityId} = ${universityRecord.id}
          AND ${peerRequests.phone} = ${data.phone}
          AND ${peerRequests.createdAt} >= ${minutesAgo(30)}
        LIMIT 1
      ),
      inserted_lead AS (
        INSERT INTO ${leads} (
          ${leads.fullName},
          ${leads.phone},
          ${leads.email},
          ${leads.residenceCountry},
          ${leads.userState},
          ${leads.countrySlug},
          ${leads.universitySlug},
          ${leads.sourcePath},
          ${leads.sourceUrl},
          ${leads.sourceQuery},
          ${leads.pageTitle},
          ${leads.ctaVariant},
          ${leads.notes},
          ${leads.documentReferrer},
          ${leads.utmSource},
          ${leads.utmMedium},
          ${leads.utmCampaign},
          ${leads.utmTerm},
          ${leads.utmContent},
          ${leads.referrer},
          ${leads.userAgent},
          ${leads.ipAddress},
          ${leads.acceptLanguage},
          ${leads.clientContext},
          ${leads.crmSyncStatus},
          ${leads.pabblySyncStatus},
          ${leads.createdAt}
        )
        SELECT
          ${data.fullName},
          ${data.phone},
          ${emptyToUndefined(data.email)},
          ${residenceCountry},
          ${userState ?? null},
          ${universityRecord.countrySlug},
          ${universityRecord.slug},
          ${data.sourcePath},
          ${emptyToUndefined(data.sourceUrl)},
          ${sourceQuery},
          ${emptyToUndefined(data.pageTitle)},
          ${"peer_request"},
          ${leadNotes},
          ${emptyToUndefined(data.documentReferrer)},
          ${utmSource},
          ${utmMedium},
          ${utmCampaign},
          ${utmTerm},
          ${utmContent},
          ${headerStore.get("referer") ?? null},
          ${headerStore.get("user-agent") ?? null},
          ${ipAddress},
          ${headerStore.get("accept-language") ?? null},
          ${clientContext},
          ${env.hasCrmLeadSyncConfig ? "pending" : "skipped"},
          ${env.hasPabblyLeadWebhook ? "pending" : "skipped"},
          ${submittedAt}
        WHERE NOT EXISTS (SELECT 1 FROM recent_request)
        RETURNING ${leads.id}
      ),
      inserted_peer_request AS (
        INSERT INTO ${peerRequests} (
          ${peerRequests.universityId},
          ${peerRequests.leadId},
          ${peerRequests.fullName},
          ${peerRequests.phone},
          ${peerRequests.email},
          ${peerRequests.userState},
          ${peerRequests.userCity},
          ${peerRequests.courseInterest},
          ${peerRequests.languagePreference},
          ${peerRequests.message},
          ${peerRequests.sourcePath},
          ${peerRequests.sourceUrl},
          ${peerRequests.sourceQuery},
          ${peerRequests.pageTitle},
          ${peerRequests.documentReferrer},
          ${peerRequests.userAgent},
          ${peerRequests.ipAddress},
          ${peerRequests.acceptLanguage},
          ${peerRequests.clientContext},
          ${peerRequests.status},
          ${peerRequests.createdAt},
          ${peerRequests.updatedAt}
        )
        SELECT
          ${universityRecord.id},
          inserted_lead.id,
          ${data.fullName},
          ${data.phone},
          ${emptyToUndefined(data.email)},
          ${peerRequestLocation},
          ${emptyToUndefined(data.userCity)},
          ${emptyToUndefined(data.courseInterest)},
          ${emptyToUndefined(data.languagePreference)},
          ${emptyToUndefined(data.message)},
          ${data.sourcePath},
          ${emptyToUndefined(data.sourceUrl)},
          ${sourceQuery},
          ${emptyToUndefined(data.pageTitle)},
          ${emptyToUndefined(data.documentReferrer)},
          ${headerStore.get("user-agent") ?? null},
          ${ipAddress},
          ${headerStore.get("accept-language") ?? null},
          ${clientContext},
          ${"new"},
          ${submittedAt},
          ${submittedAt}
        FROM inserted_lead
        RETURNING ${peerRequests.leadId}
      )
      SELECT lead_id AS "leadId"
      FROM inserted_peer_request
    `);

    insertedLeadId = result.rows[0]?.leadId;

    if (!insertedLeadId) {
      return {
        ok: false,
        error: "You already sent a recent peer request here. Please wait a bit before trying again.",
      };
    }
  } catch (err) {
    console.error("[submit-peer-request] insert failed:", err);
    return {
      ok: false,
      error: "We could not save your request right now. Please try once more.",
    };
  }

  await enqueueLeadDeliveryJob({
    leadId: insertedLeadId,
    leadHandoffPayload: buildLeadHandoffPayload({
      leadKind: "peer_request",
      websiteLeadId: insertedLeadId,
      submittedAt: submittedAt.toISOString(),
      fullName: data.fullName,
      phone: data.phone,
      email: emptyToUndefined(data.email),
      residenceCountry,
      userState,
      countrySlug: universityRecord.countrySlug,
      universitySlug: universityRecord.slug,
      sourcePath: data.sourcePath,
      sourceUrl: emptyToUndefined(data.sourceUrl),
      sourceQuery,
      pageTitle: emptyToUndefined(data.pageTitle),
      ctaVariant: "peer_request",
      notes: leadNotes,
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
    }),
  });

  return { ok: true, leadId: insertedLeadId, universityName: universityRecord.name };
}
