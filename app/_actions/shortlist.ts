"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { userShortlists } from "@/lib/db/schema";

export async function addShortlistAction(universitySlug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthenticated" as const };

  const db = getDb();
  if (!db) return { error: "unavailable" as const };

  try {
    await db
      .insert(userShortlists)
      .values({ userId: session.user.id, universitySlug })
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

  await db
    .delete(userShortlists)
    .where(
      and(
        eq(userShortlists.userId, session.user.id),
        eq(userShortlists.universitySlug, universitySlug)
      )
    );

  return { success: true as const };
}
