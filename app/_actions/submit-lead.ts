"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

export type LeadFormState = {
  error?: string;
};

type QueryParamValue = string | string[];
type QueryParamMap = Record<string, QueryParamValue>;
type ClientContext = Record<
  string,
  string | number | boolean | null | string[]
>;

function emptyToUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseJsonObject<T extends Record<string, unknown>>(
  value?: string | null
): T {
  if (!value) {
    return {} as T;
  }

  try {
    const parsed = JSON.parse(value);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {}

  return {} as T;
}

function getFirstQueryValue(
  query: QueryParamMap,
  key: string
): string | undefined {
  const value = query[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" && value ? value : undefined;
}

function getIpAddress(headerStore: Awaited<ReturnType<typeof headers>>) {
  const forwardedFor = headerStore.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return (
    headerStore.get("x-real-ip") ??
    headerStore.get("cf-connecting-ip") ??
    null
  );
}

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
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    userState: formData.get("userState"),
    courseSlug: formData.get("courseSlug"),
    countrySlug: formData.get("countrySlug"),
    universitySlug: formData.get("universitySlug"),
    sourcePath: formData.get("sourcePath"),
    sourceUrl: formData.get("sourceUrl"),
    sourceQuery: formData.get("sourceQuery"),
    pageTitle: formData.get("pageTitle"),
    ctaVariant: formData.get("ctaVariant"),
    notes: formData.get("notes"),
    documentReferrer: formData.get("documentReferrer"),
    clientContext: formData.get("clientContext"),
    website: formData.get("website"),
    startedAt: formData.get("startedAt"),
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

  if (Date.now() - Number(data.startedAt) < 1200) {
    return {
      error: "Please take a moment and submit again.",
    };
  }

  const db = getDb();
  const cookieStore = await cookies();
  const headerStore = await headers();
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

  try {
    if (db) {
      await db.insert(leads).values({
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
        ipAddress: getIpAddress(headerStore),
        acceptLanguage: headerStore.get("accept-language") ?? null,
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
