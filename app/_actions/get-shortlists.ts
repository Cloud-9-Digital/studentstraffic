"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { universities, userShortlists } from "@/lib/db/schema";

export async function getUserShortlistSlugs(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({ slug: universities.slug })
    .from(userShortlists)
    .innerJoin(universities, eq(universities.id, userShortlists.universityId))
    .where(eq(userShortlists.userId, session.user.id));

  return rows.map((r) => r.slug);
}
