"use server";

import { and, eq, gte } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { uploadFileToCloudinary, isAllowedProofType } from "@/lib/cloudinary-upload";

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
import { sendSeminarRegistrationWhatsAppMessage } from "@/lib/wati";
import {
  consumePublicFormRateLimits,
  normalizePhoneIdentifier,
} from "@/lib/security/public-form-guard";

function getRequiredFormString(formData: FormData, key: string) {
  return getFormString(formData, key) ?? "";
}

export type SeminarRegistrationFormState = {
  error?: string;
  values?: {
    studentName?: string;
    fatherName?: string;
    studentPhone?: string;
    alternatePhone?: string;
    city?: string;
    seminarEvent?: string;
    interestedCountry?: string;
    budgetRange?: string;
    needsFmgeSession?: string;
    documentType?: string;
  };
};

const seminarRegistrationSchema = z.object({
  studentName: z.string().trim().min(2, "Please enter the student's name."),
  fatherName: z.string().trim().min(2, "Please enter the father's name."),
  studentPhone: z.string().trim().min(7, "Please enter a valid phone number."),
  alternatePhone: z.string().trim().optional(),
  city: z.string().trim().min(2, "Please select your city."),
  seminarEvent: z.string().trim().min(2, "Please select the seminar you'd like to attend."),
  interestedCountry: z.string().trim().min(2, "Please select a country."),
  budgetRange: z.string().trim().min(1, "Please select your budget range."),
  needsFmgeSession: z.string().trim().min(2, "Please select if you need a 1-on-1 session."),
  documentType: z.string().trim().min(2, "Please select document type."),
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

export async function submitSeminarRegistrationAction(
  _prevState: SeminarRegistrationFormState,
  formData: FormData
): Promise<SeminarRegistrationFormState> {
  const submittedValues = {
    studentName: getRequiredFormString(formData, "studentName"),
    fatherName: getRequiredFormString(formData, "fatherName"),
    studentPhone: getRequiredFormString(formData, "studentPhone"),
    alternatePhone: getFormString(formData, "alternatePhone"),
    city: getRequiredFormString(formData, "city"),
    seminarEvent: getRequiredFormString(formData, "seminarEvent"),
    interestedCountry: getRequiredFormString(formData, "interestedCountry"),
    budgetRange: getRequiredFormString(formData, "budgetRange"),
    needsFmgeSession: getRequiredFormString(formData, "needsFmgeSession"),
    documentType: getFormString(formData, "documentType") ?? "",
  };

  const parsed = seminarRegistrationSchema.safeParse({
    ...submittedValues,
    sourcePath: getRequiredFormString(formData, "sourcePath"),
    ctaVariant: getRequiredFormString(formData, "ctaVariant"),
    startedAt: getRequiredFormString(formData, "startedAt"),
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
      values: submittedValues,
    };
  }

  const data = parsed.data;

  if (data.website) {
    return { error: "Spam detection triggered. Please try again.", values: submittedValues };
  }

  if (wasSubmittedTooFast(data.startedAt)) {
    return { error: "Please take a moment and submit again.", values: submittedValues };
  }

  // Handle file upload (only required if they need 1-on-1 session)
  const needsSession = data.needsFmgeSession === "yes";
  let documentUrl: string | undefined;

  if (needsSession) {
    const documentFile = formData.get("document");
    if (!documentFile || !(documentFile instanceof File)) {
      return { error: "Please upload a document for the 1-on-1 session.", values: submittedValues };
    }

    if (!isAllowedProofType(documentFile.type)) {
      return { error: "Invalid file type. Please upload PDF, JPG, or PNG.", values: submittedValues };
    }

    if (documentFile.size > 5 * 1024 * 1024) {
      return { error: "File is too large. Maximum size is 5MB.", values: submittedValues };
    }

    try {
      const uploaded = await uploadFileToCloudinary(documentFile, {
        folder: "seminar-registrations",
        resourceType: "auto",
        maxBytes: 5 * 1024 * 1024,
      });
      documentUrl = uploaded.url;
    } catch (uploadError) {
      console.error("Document upload failed:", uploadError);
      return { error: "Failed to upload document. Please try again.", values: submittedValues };
    }
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
                limit: 12,
                windowMs: 30 * 60_000,
                blockMs: 60 * 60_000,
              }
            : null,
          {
            scope: "public:lead:phone",
            identifier: normalizePhoneIdentifier(data.studentPhone),
            limit: 10,
            windowMs: 6 * 60 * 60_000,
            blockMs: 2 * 60 * 60_000,
          },
        ],
        "enquiries"
      );

      if (rateLimitError) {
        return { error: rateLimitError, values: submittedValues };
      }

      const [recentLead] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(
          and(eq(leads.phone, data.studentPhone), gte(leads.createdAt, minutesAgo(15)))
        )
        .limit(1);

      if (recentLead) {
        return {
          error:
            "We already received your enquiry recently. Please wait a few minutes before submitting again.",
          values: submittedValues,
        };
      }

      const [insertedLead] = await db
        .insert(leads)
        .values({
          fullName: data.studentName,
          phone: data.studentPhone,
          fatherName: data.fatherName,
          alternatePhone: data.alternatePhone || null,
          city: data.city,
          seminarEvent: data.seminarEvent,
          interestedCountry: data.interestedCountry,
          budgetRange: data.budgetRange,
          needsFmgeSession: data.needsFmgeSession === "yes",
          documentUrl: documentUrl || null,
          documentType: documentUrl ? data.documentType : null,
          userState: "Tamil Nadu",
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
          fullName: data.studentName,
          phone: data.studentPhone,
          fatherName: data.fatherName,
          alternatePhone: data.alternatePhone || undefined,
          city: data.city,
          seminarEvent: data.seminarEvent,
          interestedCountry: data.interestedCountry,
          budgetRange: data.budgetRange,
          needsFmgeSession: data.needsFmgeSession === "yes",
          documentUrl: documentUrl || undefined,
          documentType: documentUrl ? data.documentType : undefined,
          userState: "Tamil Nadu",
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
        sendSeminarRegistrationWhatsAppMessage({
          fullName: data.studentName,
          phone: data.studentPhone,
          seminarEvent: data.seminarEvent,
          city: data.city,
        }, insertedLeadId),
      ]);
    } else {
      console.warn(
        "Seminar registration submission skipped DB persistence because DATABASE_URL is missing."
      );
    }
  } catch {
    return {
      error: "We could not save your registration right now. Please try once more.",
      values: submittedValues,
    };
  }

  redirect(`/seminar-2026/thank-you`);
}
