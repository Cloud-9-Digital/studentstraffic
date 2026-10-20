import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { universities, userShortlists } from "@/lib/db/schema";

/**
 * Actions Mira can take on the visitor's behalf, as opposed to things it can
 * read. Kept apart from knowledge.ts because the rules differ: a lookup is
 * always safe to run, an action changes the visitor's data and has to answer
 * for who is asking.
 */

export type ShortlistResult = {
  added: string[];
  alreadyThere: string[];
  unknown: string[];
  requiresSignIn: boolean;
};

/**
 * Saves universities to the signed-in visitor's shortlist.
 *
 * Shortlists belong to an account — `userShortlists` is keyed by user id — so
 * there is nothing to write for an anonymous visitor. Rather than failing
 * silently or inventing a guest shortlist, this reports `requiresSignIn` so
 * Mira can say plainly that saving needs an account, and the visitor is never
 * told something was saved when it was not.
 */
export async function shortlistUniversities(
  slugs: string[]
): Promise<ShortlistResult> {
  const empty: ShortlistResult = {
    added: [],
    alreadyThere: [],
    unknown: [],
    requiresSignIn: false,
  };

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ...empty, requiresSignIn: true };
  }

  const db = getDb();
  if (!db) return empty;

  const wanted = [...new Set(slugs)].slice(0, 8);
  if (wanted.length === 0) return empty;

  const rows = await db
    .select({ id: universities.id, slug: universities.slug })
    .from(universities)
    .where(
      and(inArray(universities.slug, wanted), eq(universities.published, true))
    );

  const foundSlugs = new Set(rows.map((row) => row.slug));
  const unknown = wanted.filter((slug) => !foundSlugs.has(slug));

  if (rows.length === 0) {
    return { ...empty, unknown };
  }

  const existing = await db
    .select({ universityId: userShortlists.universityId })
    .from(userShortlists)
    .where(
      and(
        eq(userShortlists.userId, userId),
        inArray(
          userShortlists.universityId,
          rows.map((row) => row.id)
        )
      )
    );

  const existingIds = new Set(existing.map((row) => row.universityId));
  const toAdd = rows.filter((row) => !existingIds.has(row.id));

  if (toAdd.length > 0) {
    await db
      .insert(userShortlists)
      .values(toAdd.map((row) => ({ userId, universityId: row.id })))
      .onConflictDoNothing();
  }

  return {
    added: toAdd.map((row) => row.slug),
    alreadyThere: rows
      .filter((row) => existingIds.has(row.id))
      .map((row) => row.slug),
    unknown,
    requiresSignIn: false,
  };
}
