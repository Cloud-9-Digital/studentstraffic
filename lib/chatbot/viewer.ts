import "server-only";

import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { universities, users, userShortlists } from "@/lib/db/schema";

/**
 * What Mira is allowed to know about a signed-in visitor.
 *
 * Deliberately narrow: a first name and what they have already told us about
 * their plans. **No email and no phone number.** Those are the one class of
 * data the assistant never needs — it cannot send anything, and the callback
 * form collects them directly — so putting them in the model's context would
 * add risk and buy nothing. The same reasoning as the lead form, applied to
 * the profile.
 */
export type ChatViewer = {
  firstName: string | null;
  neetScore: number | null;
  budgetUsd: number | null;
  preferredCountries: string[] | null;
  shortlist: Array<{ name: string; slug: string }>;
};

export async function getChatViewer(): Promise<ChatViewer | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const db = getDb();
  if (!db) return null;

  try {
    const [profile] = await db
      .select({
        name: users.name,
        neetScore: users.neetScore,
        budgetUsd: users.budgetUsd,
        preferredCountries: users.preferredCountries,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!profile) return null;

    const shortlist = await db
      .select({ name: universities.name, slug: universities.slug })
      .from(userShortlists)
      .innerJoin(universities, eq(universities.id, userShortlists.universityId))
      .where(eq(userShortlists.userId, userId))
      .orderBy(desc(userShortlists.id))
      .limit(12);

    return {
      firstName: profile.name?.trim().split(/\s+/)[0] ?? null,
      neetScore: profile.neetScore,
      budgetUsd: profile.budgetUsd,
      preferredCountries: profile.preferredCountries,
      shortlist,
    };
  } catch (error) {
    // Personalisation is a nicety; an unknown visitor still gets every answer.
    console.error("[chat] viewer lookup failed", error);
    return null;
  }
}

/**
 * The viewer as a line of context for the model.
 *
 * Returned separately from the system prompt and appended after the history,
 * so it never invalidates the cached prefix — and so a profile that changes
 * mid-session does not silently cost a cache miss on every later turn.
 */
export function buildViewerNote(viewer: ChatViewer | null) {
  if (!viewer) return null;

  const facts: string[] = [];

  if (viewer.firstName) facts.push(`first name ${viewer.firstName}`);
  if (typeof viewer.neetScore === "number") {
    facts.push(`NEET score ${viewer.neetScore}`);
  }
  if (typeof viewer.budgetUsd === "number") {
    facts.push(`budget about $${viewer.budgetUsd.toLocaleString("en-US")} a year`);
  }
  if (viewer.preferredCountries?.length) {
    facts.push(`interested in ${viewer.preferredCountries.join(", ")}`);
  }
  if (viewer.shortlist.length > 0) {
    facts.push(
      `has shortlisted ${viewer.shortlist.map((item) => item.name).join(", ")}`
    );
  }

  if (facts.length === 0) {
    return "[The visitor is signed in. We hold nothing about their plans yet, so ask as you normally would.]";
  }

  return `[The visitor is signed in: ${facts.join("; ")}. Use this instead of asking for it again, and use their first name once early on, not in every message. If something looks out of date, confirm it rather than assuming. Saving to their shortlist will work.]`;
}
