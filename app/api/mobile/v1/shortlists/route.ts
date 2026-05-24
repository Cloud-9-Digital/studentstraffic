import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { countries, universities, userShortlists } from "@/lib/db/schema";
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
      universitySlug: userShortlists.universitySlug,
      notes: userShortlists.notes,
      createdAt: userShortlists.createdAt,
      universityName: universities.name,
      universityCity: universities.city,
      universityLogoUrl: universities.logoUrl,
      universityCoverImageUrl: universities.coverImageUrl,
      countryName: countries.name,
    })
    .from(userShortlists)
    .leftJoin(universities, eq(universities.slug, userShortlists.universitySlug))
    .leftJoin(countries, eq(countries.id, universities.countryId))
    .where(eq(userShortlists.userId, session.user.id))
    .orderBy(userShortlists.createdAt);

  return mobileJson({
    shortlists: rows.map((row) => ({
      id: String(row.id),
      slug: row.universitySlug,
      name: row.universityName ?? row.universitySlug,
      city: row.universityCity,
      country: row.countryName,
      logoUrl: row.universityLogoUrl,
      coverImageUrl: row.universityCoverImageUrl,
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

  await db
    .insert(userShortlists)
    .values({
      userId: session.user.id,
      universitySlug: parsed.data.universitySlug,
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

  await db
    .delete(userShortlists)
    .where(
      and(
        eq(userShortlists.userId, session.user.id),
        eq(userShortlists.universitySlug, parsed.data.universitySlug)
      )
    );

  return mobileJson({ success: true });
}
