import { and, asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { countries, programOfferings, universities, userShortlists } from "@/lib/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileShortlistSchema } from "@/lib/mobile/schemas";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const rows = await db
    .select({
      id: userShortlists.id,
      universitySlug: universities.slug,
      notes: userShortlists.notes,
      createdAt: userShortlists.createdAt,
      universityName: universities.name,
      universityCity: universities.city,
      universityLogoUrl: universities.logoUrl,
      universityCoverImageUrl: universities.coverImageUrl,
      countryName: countries.name,
      annualTuitionUsd: programOfferings.annualTuitionUsd,
      offeringSlug: programOfferings.slug,
    })
    .from(userShortlists)
    .innerJoin(universities, eq(universities.id, userShortlists.universityId))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .leftJoin(programOfferings, eq(programOfferings.universityId, universities.id))
    .where(eq(userShortlists.userId, session.user.id))
    .orderBy(userShortlists.createdAt, asc(programOfferings.annualTuitionUsd));

  // Dedup: multiple offerings per university → keep the first (lowest tuition)
  const seen = new Set<string>();
  const unique = rows.filter(row => {
    if (seen.has(row.universitySlug)) return false;
    seen.add(row.universitySlug);
    return true;
  });

  return mobileJson({
    shortlists: unique.map((row) => ({
      id: String(row.id),
      slug: row.universitySlug,
      name: row.universityName ?? row.universitySlug,
      city: row.universityCity,
      country: row.countryName,
      logoUrl: row.universityLogoUrl,
      coverImageUrl: row.universityCoverImageUrl,
      tuitionUsd: row.annualTuitionUsd ?? 0,
      offeringSlug: row.offeringSlug,
      notes: row.notes,
      createdAt: row.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const parsed = mobileShortlistSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const [university] = await db
    .select({ id: universities.id })
    .from(universities)
    .where(eq(universities.slug, parsed.data.universitySlug))
    .limit(1);

  if (!university) return mobileError("not_found", "University not found.", 404);

  await db
    .insert(userShortlists)
    .values({
      userId: session.user.id,
      universityId: university.id,
      notes: parsed.data.notes,
    })
    .onConflictDoNothing();

  return mobileJson({ success: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const parsed = mobileShortlistSchema.pick({ universitySlug: true }).safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const [university] = await db
    .select({ id: universities.id })
    .from(universities)
    .where(eq(universities.slug, parsed.data.universitySlug))
    .limit(1);

  if (university) {
    await db
      .delete(userShortlists)
      .where(
        and(
          eq(userShortlists.userId, session.user.id),
          eq(userShortlists.universityId, university.id)
        )
      );
  }

  return mobileJson({ success: true });
}
