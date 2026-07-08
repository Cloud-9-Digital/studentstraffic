"use server";

import { and, eq, gte } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";

import {
  enqueueLeadDeliveryJob,
  processPendingBackgroundJobs,
} from "@/lib/background-jobs";
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
import {
  getLeadDeliveryRoute,
  NEET_PREDICTOR_SOURCE_PATH,
} from "@/lib/lead-delivery-routes";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import { getTrackingSnapshot } from "@/lib/tracking";
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
  neetScore: z.string().trim().optional(),
  neetCategory: z.string().trim().optional(),
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
    neetScore: getFormString(formData, "neetScore"),
    neetCategory: getFormString(formData, "neetCategory"),
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
  const trimmedNeetScore = data.neetScore?.trim();
  let neetScore: number | undefined;

  const isNeetPredictorSubmission = data.sourcePath === NEET_PREDICTOR_SOURCE_PATH;

  if (isNeetPredictorSubmission) {
    if (!trimmedNeetScore) {
      return { error: "Please enter your NEET score." };
    }

    const parsedNeetScore = parseInt(trimmedNeetScore, 10);

    if (isNaN(parsedNeetScore) || parsedNeetScore < 0 || parsedNeetScore > 720) {
      return {
        error: "Please enter a valid NEET score between 0 and 720.",
      };
    }

    neetScore = parsedNeetScore;
  }

  const neetCategory = isNeetPredictorSubmission
    ? emptyToUndefined(data.neetCategory)
    : undefined;

  const combinedNotes = data.notes?.trim() ?? "";

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
  const tracking = getTrackingSnapshot(cookieStore, sourceQuery);
  const ipAddress = getIpAddress(headerStore);

  try {
    let insertedLeadId: number | undefined;

    if (db) {
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

      const [insertedLead] = await db.insert(leads).values({
        fullName: data.fullName,
        phone: data.phone,
        email: emptyToUndefined(data.email),
        userState: data.userState,
        neetScore,
        neetCategory,
        courseSlug: emptyToUndefined(data.courseSlug),
        countrySlug: emptyToUndefined(data.countrySlug),
        universitySlug: emptyToUndefined(data.universitySlug),
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
        notes: emptyToUndefined(combinedNotes),
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
      }).returning({
        id: leads.id,
      });

      insertedLeadId = insertedLead?.id;

      revalidateTag("admin-leads", "minutes");

      const handoffPayload = buildLeadHandoffPayload({
        leadKind: "general_enquiry",
        websiteLeadId: insertedLeadId,
        submittedAt: submittedAt.toISOString(),
        fullName: data.fullName,
        phone: data.phone,
        email: emptyToUndefined(data.email),
        userState: data.userState,
        neetScore,
        neetCategory,
        courseSlug: emptyToUndefined(data.courseSlug),
        countrySlug: emptyToUndefined(data.countrySlug),
        universitySlug: emptyToUndefined(data.universitySlug),
        sourcePath: data.sourcePath,
        sourceUrl: emptyToUndefined(data.sourceUrl),
        sourceQuery,
        pageTitle: emptyToUndefined(data.pageTitle),
        ctaVariant: data.ctaVariant,
        notes: emptyToUndefined(combinedNotes),
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
      });

      if (insertedLeadId) {
        const deliveryRoute = getLeadDeliveryRoute(data.sourcePath);

        await enqueueLeadDeliveryJob({
          leadId: insertedLeadId,
          leadHandoffPayload: handoffPayload,
          whatsappPayload: deliveryRoute.whatsapp
            ? {
                fullName: data.fullName,
                phone: data.phone,
                courseSlug: emptyToUndefined(data.courseSlug),
                countrySlug: emptyToUndefined(data.countrySlug),
                universitySlug: emptyToUndefined(data.universitySlug),
                sourcePath: data.sourcePath,
              }
            : undefined,
        });

        if (env.enableInlineJobProcessing) {
          after(() => processPendingBackgroundJobs({ limit: 1 }));
        }
      }
    } else {
      console.warn("Lead submission skipped DB persistence because DATABASE_URL is missing.");
    }
  } catch (error) {
    console.error("Lead submission error:", error);
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
