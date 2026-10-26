"use server";

import { refresh } from "next/cache";

import { auth } from "@/lib/auth";
import { parsePositiveId } from "@/lib/dashboard/application-model";
import { removeShortlistForUser } from "@/lib/dashboard/applications";
import { resolveDbUserId } from "@/lib/server-session";

/**
 * Removes a shortlist row by id for the signed-in student. Uses the real DB
 * user id (resolved by email), unlike app/_actions/shortlist.ts which keys on
 * session.user.id and so misses rows for admin sessions.
 */
export async function removeShortlistItemAction(shortlistId: number): Promise<{ error: string | null }> {
  const session = await auth();
  const email = session?.user?.email;
  const userId = email ? await resolveDbUserId(email) : null;
  if (!userId) return { error: "Your session has expired. Sign in again and retry." };

  const id = parsePositiveId(shortlistId);
  if (!id) return { error: "Shortlist item not found." };

  await removeShortlistForUser(userId, id);
  refresh();
  return { error: null };
}
