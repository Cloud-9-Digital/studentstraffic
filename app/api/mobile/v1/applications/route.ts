import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { applications, countries, universities } from "@/lib/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mapApplication } from "@/lib/mobile/mappers";
import { mobileApplicationCreateSchema } from "@/lib/mobile/schemas";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const rows = await db
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
    .where(eq(applications.userId, session.user.id))
    .orderBy(applications.createdAt);

  return mobileJson({ applications: rows.map(mapApplication) });
}

export async function POST(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const parsed = mobileApplicationCreateSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const [row] = await db
    .insert(applications)
    .values({
      userId: session.user.id,
      universitySlug: parsed.data.universitySlug,
      courseSlug: parsed.data.courseSlug,
      personalInfo: parsed.data.personalInfo ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return mobileJson({ application: mapApplication(row) }, { status: 201 });
}
