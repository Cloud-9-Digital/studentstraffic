import "server-only";

import { and, eq } from "drizzle-orm";

import { enqueueLeadDeliveryJob } from "@/lib/background-jobs";
import { getDb } from "@/lib/db/server";
import { applications, countries, leads, universities, users } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { buildLeadHandoffPayload } from "@/lib/lead-handoff";
import { getPhoneCountry, isValidLeadPhone } from "@/lib/lead-residence";

export const APPLICATION_LEAD_CTA = "dashboard_application";

/** E.164 phone from a stored or typed value ("+91 88853 33635" → "+918885333635"), or null if invalid. */
export function normaliseLeadPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.replace(/[\s()-]/g, "");
  return isValidLeadPhone(compact) ? compact : null;
}

/** The student's stored phone if it is valid for a lead, else null (the submit form then asks for one). */
export async function getLeadPhoneForUser(userId: string): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db.select({ phone: users.phone }).from(users).where(eq(users.id, userId)).limit(1);
  return normaliseLeadPhone(row?.phone);
}

/** Saves a phone typed on the submit form to the student's profile, so Settings shows it too. */
export async function saveLeadPhoneForUser(userId: string, phone: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.update(users).set({ phone }).where(eq(users.id, userId));
}

/**
 * A submitted dashboard application goes to the counselling team the same way
 * every other enquiry does: a `leads` row plus the lead delivery job (CRM,
 * Pabbly, Meta). Without this, nobody on the team would see the application.
 * Returns false when the student has no valid phone, which the caller asks for
 * before submitting.
 */
export async function handOffSubmittedApplication(userId: string, applicationId: number): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const [row] = await db
    .select({
      universitySlug: applications.universitySlug,
      courseSlug: applications.courseSlug,
      applicationData: applications.applicationData,
      name: users.name,
      email: users.email,
      phone: users.phone,
      neetScore: users.neetScore,
      universityName: universities.name,
      countrySlug: countries.slug,
    })
    .from(applications)
    .innerJoin(users, eq(users.id, applications.userId))
    .leftJoin(universities, eq(universities.slug, applications.universitySlug))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .limit(1);
  if (!row) return false;

  const phone = normaliseLeadPhone(row.phone);
  if (!phone) return false;

  const data = (row.applicationData ?? {}) as { programmeTitle?: string; studentNote?: string };
  const fullName = row.name?.trim() || row.email;
  const programme = data.programmeTitle ?? (row.courseSlug === "undecided" ? "Programme not chosen yet" : row.courseSlug);
  const notes = [
    `Dashboard application #${applicationId} submitted for review.`,
    `University: ${row.universityName ?? row.universitySlug}`,
    `Programme: ${programme}`,
    data.studentNote ? `Student note: ${data.studentNote}` : null,
  ].filter(Boolean).join("\n");
  const sourcePath = `/dashboard/applications/${applicationId}`;
  const submittedAt = new Date();
  const residenceCountry = getPhoneCountry(phone) ?? undefined;

  const [lead] = await db
    .insert(leads)
    .values({
      fullName,
      phone,
      email: row.email,
      residenceCountry,
      countrySlug: row.countrySlug ?? undefined,
      universitySlug: row.universitySlug,
      courseSlug: row.courseSlug === "undecided" ? undefined : row.courseSlug,
      sourcePath,
      sourceQuery: {},
      ctaVariant: APPLICATION_LEAD_CTA,
      notes,
      crmSyncStatus: env.hasCrmLeadSyncConfig ? "pending" : "skipped",
      pabblySyncStatus: env.hasPabblyLeadWebhook ? "pending" : "skipped",
      createdAt: submittedAt,
    })
    .returning({ id: leads.id });

  await enqueueLeadDeliveryJob({
    leadId: lead.id,
    leadHandoffPayload: buildLeadHandoffPayload({
      leadKind: "general_enquiry",
      websiteLeadId: lead.id,
      submittedAt: submittedAt.toISOString(),
      fullName,
      phone,
      email: row.email,
      residenceCountry,
      neetScore: row.neetScore ?? undefined,
      countrySlug: row.countrySlug ?? undefined,
      universitySlug: row.universitySlug,
      courseSlug: row.courseSlug === "undecided" ? undefined : row.courseSlug,
      sourcePath,
      sourceQuery: {},
      ctaVariant: APPLICATION_LEAD_CTA,
      notes,
    }),
  });
  return true;
}
