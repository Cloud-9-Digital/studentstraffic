"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { universities, userShortlists } from "@/lib/db/schema";

export async function addShortlistAction(universitySlug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthenticated" as const };

  const db = getDb();
  if (!db) return { error: "unavailable" as const };

  const [university] = await db
    .select({ id: universities.id })
    .from(universities)
    .where(eq(universities.slug, universitySlug))
    .limit(1);

  if (!university) return { error: "not_found" as const };

  try {
    await db
      .insert(userShortlists)
      .values({ userId: session.user.id, universityId: university.id })
      .onConflictDoNothing();
    return { success: true as const };
  } catch (err) {
    console.error("[shortlist] db error:", err);
    return { error: "db" as const };
  }
}

export async function removeShortlistAction(universitySlug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthenticated" as const };

  const db = getDb();
  if (!db) return { error: "unavailable" as const };

  const [university] = await db
    .select({ id: universities.id })
    .from(universities)
    .where(eq(universities.slug, universitySlug))
    .limit(1);

  if (!university) return { success: true as const };

  await db
    .delete(userShortlists)
    .where(
      and(
        eq(userShortlists.userId, session.user.id),
        eq(userShortlists.universityId, university.id)
      )
    );

  return { success: true as const };
}
