"use server";

import { cookies, headers } from "next/headers";
import { and, eq, gte } from "drizzle-orm";

import {
  type ClientContext,
  getFirstQueryValue,
  getIpAddress,
  minutesAgo,
  type QueryParamMap,
} from "@/app/_actions/form-helpers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import {
  countries,
  leads,
  peerRequests,
  studentPeers,
  universities,
  users,
} from "@/lib/db/schema";
import { env } from "@/lib/env";
import { sendPeerConnectionSentEmail } from "@/lib/email/templates/peer-connection-sent";
import { sendPeerNewRequestEmail } from "@/lib/email/templates/peer-new-request";
import { enqueueLeadDeliveryJob } from "@/lib/background-jobs";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

export type QuickConnectState = {
  error?: string;
  success?: boolean;
  missingPhone?: boolean;
};

export async function quickConnectToPeerAction(
  peerId: number,
  universitySlug: string
): Promise<QuickConnectState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to connect with a peer." };
  }

  const db = getDb();
  if (!db) {
    return { error: "This feature is temporarily unavailable. Please try again shortly." };
  }

  // Fetch the requester's stored profile
  const [requester] = await db
    .select({ name: users.name, email: users.email, phone: users.phone })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!requester) {
    return { error: "Your account could not be found. Please sign in again." };
  }

  if (!requester.phone) {
    return { missingPhone: true };
  }

  const fullName = requester.name ?? requester.email.split("@")[0];
  const phone = requester.phone;
  const email = requester.email;

  // Validate the peer
  const [peer] = await db
    .select({
      id: studentPeers.id,
      contactPhone: studentPeers.contactPhone,
      contactEmail: studentPeers.contactEmail,
      fullName: studentPeers.fullName,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(
      and(
        eq(studentPeers.id, peerId),
        eq(universities.slug, universitySlug),
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
    .where(eq(universities.slug, universitySlug))
    .limit(1);

  if (!universityRecord) {
    return { error: "University not found. Please refresh and try again." };
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
        identifier: normalizePhoneIdentifier(phone),
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

  const sourceQuery: QueryParamMap = {};
  const clientContext: ClientContext = {};
  const submittedAt = new Date();

  const utmSource = cookieStore.get("utm_source")?.value ?? getFirstQueryValue(sourceQuery, "utm_source");
  const utmMedium = cookieStore.get("utm_medium")?.value ?? getFirstQueryValue(sourceQuery, "utm_medium");
  const utmCampaign = cookieStore.get("utm_campaign")?.value ?? getFirstQueryValue(sourceQuery, "utm_campaign");
  const utmTerm = cookieStore.get("utm_term")?.value ?? getFirstQueryValue(sourceQuery, "utm_term");
  const utmContent = cookieStore.get("utm_content")?.value ?? getFirstQueryValue(sourceQuery, "utm_content");

  // Deduplicate: if this phone already has a request for this university in the last 30 min, silently succeed
  const [recent] = await db
    .select({ id: peerRequests.id })
    .from(peerRequests)
    .where(
      and(
        eq(peerRequests.universityId, universityRecord.id),
        eq(peerRequests.phone, phone),
        gte(peerRequests.createdAt, minutesAgo(30))
      )
    )
    .limit(1);

  if (recent) {
    return { success: true };
  }

  let insertedLeadId: number | undefined;

  try {
    const result = await db.transaction(async (tx) => {
      const [insertedLead] = await tx
        .insert(leads)
        .values({
          fullName,
          phone,
          email,
          countrySlug: universityRecord.countrySlug,
          universitySlug: universityRecord.slug,
          sourcePath: "/students",
          sourceQuery,
          ctaVariant: "peer_connect",
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
          crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
          pabblySyncStatus: env.hasPabblyLeadWebhook ? "pending" : "skipped",
          createdAt: submittedAt,
        })
        .returning({ id: leads.id });

      if (!insertedLead) return undefined;

      await tx.insert(peerRequests).values({
        universityId: universityRecord.id,
        leadId: insertedLead.id,
        matchedPeerId: peer.id,
        fullName,
        phone,
        email,
        userState: "Not provided",
        sourcePath: "/students",
        sourceQuery,
        userAgent: headerStore.get("user-agent") ?? undefined,
        ipAddress: ipAddress ?? undefined,
        acceptLanguage: headerStore.get("accept-language") ?? undefined,
        clientContext,
        status: "matched",
        createdAt: submittedAt,
        updatedAt: submittedAt,
      });

      return insertedLead.id;
    });

    insertedLeadId = result ?? undefined;

    if (!insertedLeadId) {
      return { success: true };
    }
  } catch (err) {
    console.error("[quick-connect-to-peer] transaction failed:", err);
    return { error: "We could not save your request. Please try once more." };
  }

  await enqueueLeadDeliveryJob({
    leadId: insertedLeadId,
    leadHandoffPayload: buildLeadHandoffPayload({
      leadKind: "peer_connection",
      websiteLeadId: insertedLeadId,
      submittedAt: submittedAt.toISOString(),
      fullName,
      phone,
      countrySlug: universityRecord.countrySlug,
      universitySlug: universityRecord.slug,
      sourcePath: "/students",
      sourceQuery,
      ctaVariant: "peer_connect",
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

  void Promise.all([
    sendPeerConnectionSentEmail({
      requesterName: fullName,
      requesterEmail: email,
      peerName: peer.fullName,
      peerPhone: peer.contactPhone,
      universityName: universityRecord.name,
    }),
    peer.contactEmail
      ? sendPeerNewRequestEmail({
          peerName: peer.fullName,
          peerEmail: peer.contactEmail,
          requesterName: fullName,
          requesterPhone: phone,
          requesterEmail: email,
          universityName: universityRecord.name,
        })
      : Promise.resolve(),
  ]);

  return { success: true };
}
