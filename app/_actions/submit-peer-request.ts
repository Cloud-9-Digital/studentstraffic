"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gte } from "drizzle-orm";
import { z } from "zod";

import {
  ClientContext,
  emptyToUndefined,
  getFirstQueryValue,
  getFormString,
  getIpAddress,
  minutesAgo,
  parseJsonObject,
  QueryParamMap,
  wasSubmittedTooFast,
} from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { countries, leads, peerRequests, universities } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { syncLeadDestinations } from "@/lib/lead-sync";

export type PeerRequestFormState = {
  error?: string;
};

const peerRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email address.",
    }),
  userState: z.string().trim().min(2, "Please enter your state."),
  universitySlug: z.string().trim().min(1),
  courseInterest: z.string().trim().optional(),
  preferredContactMode: z.enum(["Call", "WhatsApp", "Either"]).optional(),
  message: z.string().trim().optional(),
  sourcePath: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  sourceQuery: z.string().trim().optional(),
  pageTitle: z.string().trim().optional(),
  documentReferrer: z.string().trim().optional(),
  clientContext: z.string().trim().optional(),
  website: z.string().trim().optional(),
  startedAt: z.string().trim().min(1),
});

function buildLeadNotes(input: {
  courseInterest?: string;
  preferredContactMode?: string;
  message?: string;
}) {
  const parts = [
    input.courseInterest ? `Course interest: ${input.courseInterest}` : null,
    input.preferredContactMode
      ? `Preferred contact mode: ${input.preferredContactMode}`
      : null,
    input.message ? `Peer questions: ${input.message}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join("\n") : undefined;
}

export async function submitPeerRequestAction(
  _prevState: PeerRequestFormState,
  formData: FormData
): Promise<PeerRequestFormState> {
  const parsed = peerRequestSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    phone: getFormString(formData, "phone"),
    email: getFormString(formData, "email"),
    userState: getFormString(formData, "userState"),
    universitySlug: getFormString(formData, "universitySlug"),
    courseInterest: getFormString(formData, "courseInterest"),
    preferredContactMode: getFormString(formData, "preferredContactMode"),
    message: getFormString(formData, "message"),
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
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please check the form and try again.",
    };
  }

  const data = parsed.data;

  if (data.website) {
    return {
      error: "Spam detection triggered. Please try again.",
    };
  }

  if (wasSubmittedTooFast(data.startedAt)) {
    return {
      error: "Please take a moment and submit again.",
    };
  }

  const db = getDb();

  if (!db) {
    return {
      error: "This request form is temporarily unavailable. Please try again shortly.",
    };
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
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
    preferredContactMode: emptyToUndefined(data.preferredContactMode),
    message: emptyToUndefined(data.message),
  });

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
      error: "We could not find that university. Please refresh and try again.",
    };
  }

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
    return {
      error: "You already sent a recent peer request here. Please wait a bit before trying again.",
    };
  }

  let insertedLeadId: number | undefined;

  try {
    await db.transaction(async (tx) => {
      const [insertedLead] = await tx
        .insert(leads)
        .values({
          fullName: data.fullName,
          phone: data.phone,
          email: emptyToUndefined(data.email),
          userState: data.userState,
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
          referrer: headerStore.get("referer") ?? null,
          userAgent: headerStore.get("user-agent") ?? null,
          ipAddress,
          acceptLanguage: headerStore.get("accept-language") ?? null,
          clientContext,
          crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
          pabblySyncStatus: env.hasPabblyLeadWebhook ? "pending" : "skipped",
          createdAt: submittedAt,
        })
        .returning({
          id: leads.id,
        });

      insertedLeadId = insertedLead?.id;

      await tx.insert(peerRequests).values({
        universityId: universityRecord.id,
        leadId: insertedLeadId,
        fullName: data.fullName,
        phone: data.phone,
        email: emptyToUndefined(data.email),
        userState: data.userState,
        courseInterest: emptyToUndefined(data.courseInterest),
        preferredContactMode: data.preferredContactMode,
        message: emptyToUndefined(data.message),
        sourcePath: data.sourcePath,
        sourceUrl: emptyToUndefined(data.sourceUrl),
        sourceQuery,
        pageTitle: emptyToUndefined(data.pageTitle),
        documentReferrer: emptyToUndefined(data.documentReferrer),
        userAgent: headerStore.get("user-agent") ?? null,
        ipAddress,
        acceptLanguage: headerStore.get("accept-language") ?? null,
        clientContext,
        status: "new",
        createdAt: submittedAt,
        updatedAt: submittedAt,
      });
    });
  } catch {
    return {
      error: "We could not save your request right now. Please try once more.",
    };
  }

  await syncLeadDestinations(insertedLeadId, {
    websiteLeadId: insertedLeadId,
    submittedAt: submittedAt.toISOString(),
    fullName: data.fullName,
    phone: data.phone,
    email: emptyToUndefined(data.email),
    userState: data.userState,
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
  });

  redirect(
    `/thank-you?source=${encodeURIComponent(data.sourcePath)}&interest=${encodeURIComponent(universityRecord.name)}`
  );
}
