"use server";

import { and, eq, gte } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  ClientContext,
  emptyToUndefined,
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
import { getTrackingSnapshot } from "@/lib/tracking";
import { sendSeminarLeadWhatsAppMessage } from "@/lib/wati";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

export type SeminarLeadFormState = {
  error?: string;
};

const seminarLeadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  seminarEvent: z.string().trim().min(2, "Please select the seminar you'd like to attend."),
  city: z.string().trim().min(2, "Please select your city."),
  sourcePath: z.string().trim().min(1),
  ctaVariant: z.string().trim().min(1),
  startedAt: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  sourceQuery: z.string().trim().optional(),
  pageTitle: z.string().trim().optional(),
  documentReferrer: z.string().trim().optional(),
  clientContext: z.string().trim().optional(),
  website: z.string().trim().optional(),
});

export async function submitSeminarLeadAction(
  _prevState: SeminarLeadFormState,
  formData: FormData
): Promise<SeminarLeadFormState> {
  const parsed = seminarLeadSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    phone: getFormString(formData, "phone"),
    seminarEvent: getFormString(formData, "seminarEvent"),
    city: getFormString(formData, "city"),
    sourcePath: getFormString(formData, "sourcePath"),
    ctaVariant: getFormString(formData, "ctaVariant"),
    startedAt: getFormString(formData, "startedAt"),
    sourceUrl: getFormString(formData, "sourceUrl"),
    sourceQuery: getFormString(formData, "sourceQuery"),
    pageTitle: getFormString(formData, "pageTitle"),
    documentReferrer: getFormString(formData, "documentReferrer"),
    clientContext: getFormString(formData, "clientContext"),
    website: getFormString(formData, "website"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const data = parsed.data;

  if (data.website) {
    return { error: "Spam detection triggered. Please try again." };
  }

  if (wasSubmittedTooFast(data.startedAt)) {
    return { error: "Please take a moment and submit again." };
  }

  const db = getDb();
  const cookieStore = await cookies();
  const headerStore = await headers();
  const submittedAt = new Date();
  const sourceQuery = parseJsonObject<QueryParamMap>(data.sourceQuery);
  const clientContext = parseJsonObject<ClientContext>(data.clientContext);
  const tracking = getTrackingSnapshot(cookieStore, sourceQuery);
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

      const [insertedLead] = await db
        .insert(leads)
        .values({
          fullName: data.fullName,
          phone: data.phone,
          userState: "Tamil Nadu",
          notes: `Attending: ${data.seminarEvent} | Home city: ${data.city}`,
          sourcePath: data.sourcePath,
          sourceUrl: emptyToUndefined(data.sourceUrl),
          sourceQuery,
          visitorId: tracking.visitorId,
          initialLandingPath: tracking.initialLandingPath,
          initialLandingUrl: tracking.initialLandingUrl,
          initialReferrer: tracking.initialReferrer,
          initialUtmLandingUrl: tracking.initialUtmLandingUrl,
          pageTitle: emptyToUndefined(data.pageTitle),
          ctaVariant: data.ctaVariant,
          documentReferrer: emptyToUndefined(data.documentReferrer),
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
          crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
          pabblySyncStatus: env.hasPabblyLeadWebhook ? "pending" : "skipped",
          createdAt: submittedAt,
        })
        .returning({ id: leads.id });

      insertedLeadId = insertedLead?.id;

      await Promise.allSettled([
        syncLeadDestinations(insertedLeadId, {
          websiteLeadId: insertedLeadId,
          submittedAt: submittedAt.toISOString(),
          fullName: data.fullName,
          phone: data.phone,
          userState: "Tamil Nadu",
          notes: `Attending: ${data.seminarEvent} | Home city: ${data.city}`,
          sourcePath: data.sourcePath,
          sourceUrl: emptyToUndefined(data.sourceUrl),
          sourceQuery,
          pageTitle: emptyToUndefined(data.pageTitle),
          ctaVariant: data.ctaVariant,
          documentReferrer: emptyToUndefined(data.documentReferrer),
          utmSource: tracking.utmSource,
          utmMedium: tracking.utmMedium,
          utmCampaign: tracking.utmCampaign,
          utmTerm: tracking.utmTerm,
          utmContent: tracking.utmContent,
          referrer: headerStore.get("referer") ?? undefined,
          userAgent: headerStore.get("user-agent") ?? undefined,
          ipAddress: ipAddress ?? undefined,
          acceptLanguage: headerStore.get("accept-language") ?? undefined,
          clientContext,
        }),
        sendSeminarLeadWhatsAppMessage({
          fullName: data.fullName,
          phone: data.phone,
          seminarEvent: data.seminarEvent,
          city: data.city,
        }, insertedLeadId),
      ]);
    } else {
      console.warn(
        "Seminar lead submission skipped DB persistence because DATABASE_URL is missing."
      );
    }
  } catch {
    return {
      error: "We could not save your enquiry right now. Please try once more.",
    };
  }

  redirect(`/seminar-2026/thank-you`);
}
