"use server";

import { and, eq, gte } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
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
import { leads } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { syncLeadDestinations } from "@/lib/lead-sync";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

export type LeadFormState = {
  error?: string;
};

const leadSchema = z.object({
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
  courseSlug: z.string().trim().optional(),
  countrySlug: z.string().trim().optional(),
  universitySlug: z.string().trim().optional(),
  sourcePath: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  sourceQuery: z.string().trim().optional(),
  pageTitle: z.string().trim().optional(),
  ctaVariant: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  documentReferrer: z.string().trim().optional(),
  clientContext: z.string().trim().optional(),
  website: z.string().trim().optional(),
  startedAt: z.string().trim().min(1),
});

export async function submitLeadAction(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    phone: getFormString(formData, "phone"),
    email: getFormString(formData, "email"),
    userState: getFormString(formData, "userState"),
    courseSlug: getFormString(formData, "courseSlug"),
    countrySlug: getFormString(formData, "countrySlug"),
    universitySlug: getFormString(formData, "universitySlug"),
    sourcePath: getFormString(formData, "sourcePath"),
    sourceUrl: getFormString(formData, "sourceUrl"),
    sourceQuery: getFormString(formData, "sourceQuery"),
    pageTitle: getFormString(formData, "pageTitle"),
    ctaVariant: getFormString(formData, "ctaVariant"),
    notes: getFormString(formData, "notes"),
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

  try {
    let insertedLeadId: number | undefined;

    if (db) {
      const rateLimitError = await consumePublicFormRateLimits(
        [
          ipAddress
            ? {
                scope: "public:lead:ip",
                identifier: ipAddress,
                limit: 6,
                windowMs: 30 * 60_000,
                blockMs: 2 * 60 * 60_000,
              }
            : null,
          {
            scope: "public:lead:phone",
            identifier: normalizePhoneIdentifier(data.phone),
            limit: 4,
            windowMs: 6 * 60 * 60_000,
            blockMs: 12 * 60 * 60_000,
          },
        ],
        "enquiries"
      );

      if (rateLimitError) {
        return { error: rateLimitError };
      }

      const [recentLead] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(
          and(eq(leads.phone, data.phone), gte(leads.createdAt, minutesAgo(15)))
        )
        .limit(1);

      if (recentLead) {
        return {
          error:
            "We already received your enquiry recently. Please wait a few minutes before submitting again.",
        };
      }

      const [insertedLead] = await db.insert(leads).values({
        fullName: data.fullName,
        phone: data.phone,
        email: emptyToUndefined(data.email),
        userState: data.userState,
        courseSlug: emptyToUndefined(data.courseSlug),
        countrySlug: emptyToUndefined(data.countrySlug),
        universitySlug: emptyToUndefined(data.universitySlug),
        sourcePath: data.sourcePath,
        sourceUrl: emptyToUndefined(data.sourceUrl),
        sourceQuery,
        pageTitle: emptyToUndefined(data.pageTitle),
        ctaVariant: data.ctaVariant,
        notes: emptyToUndefined(data.notes),
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
      }).returning({
        id: leads.id,
      });

      insertedLeadId = insertedLead?.id;

      await syncLeadDestinations(insertedLeadId, {
        websiteLeadId: insertedLeadId,
        submittedAt: submittedAt.toISOString(),
        fullName: data.fullName,
        phone: data.phone,
        email: emptyToUndefined(data.email),
        userState: data.userState,
        courseSlug: emptyToUndefined(data.courseSlug),
        countrySlug: emptyToUndefined(data.countrySlug),
        universitySlug: emptyToUndefined(data.universitySlug),
        sourcePath: data.sourcePath,
        sourceUrl: emptyToUndefined(data.sourceUrl),
        sourceQuery,
        pageTitle: emptyToUndefined(data.pageTitle),
        ctaVariant: data.ctaVariant,
        notes: emptyToUndefined(data.notes),
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
    } else {
      console.warn("Lead submission skipped DB persistence because DATABASE_URL is missing.");
    }
  } catch {
    return {
      error: "We could not save your enquiry right now. Please try once more.",
    };
  }

  const interest =
    data.universitySlug ?? data.countrySlug ?? data.courseSlug ?? "study-abroad";

  redirect(
    `/thank-you?source=${encodeURIComponent(data.sourcePath)}&interest=${encodeURIComponent(interest)}`
  );
}
