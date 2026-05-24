import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { applications, countries, universities } from "@/lib/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mapApplication } from "@/lib/mobile/mappers";
import { mobileApplicationPatchSchema } from "@/lib/mobile/schemas";

async function getApplication(userId: string, id: number) {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      id: applications.id,
      userId: applications.userId,
      universitySlug: applications.universitySlug,
      courseSlug: applications.courseSlug,
      status: applications.status,
      personalInfo: applications.personalInfo,
      documents: applications.documents,
      applicationData: applications.applicationData,
      submittedAt: applications.submittedAt,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      universityName: universities.name,
      universityCity: universities.city,
      universityLogoUrl: universities.logoUrl,
      countryName: countries.name,
    })
    .from(applications)
    .leftJoin(universities, eq(universities.slug, applications.universitySlug))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .where(and(eq(applications.userId, userId), eq(applications.id, id)))
    .limit(1);

  return row ?? null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return mobileError("invalid_id", "Invalid application id.", 400);

  const row = await getApplication(session.user.id, numericId);
  if (!row) return mobileError("not_found", "Application not found.", 404);

  return mobileJson({ application: mapApplication(row) });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return mobileError("invalid_id", "Invalid application id.", 400);

  const parsed = mobileApplicationPatchSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const submittedAt = parsed.data.status === "submitted" ? new Date() : undefined;
  await db
    .update(applications)
    .set({
      ...parsed.data,
      submittedAt,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.userId, session.user.id), eq(applications.id, numericId)));

  const row = await getApplication(session.user.id, numericId);
  if (!row) return mobileError("not_found", "Application not found.", 404);

  return mobileJson({ application: mapApplication(row) });
}
