import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";

/**
 * Resolves the canonical DB user ID from an email address.
 * session.user.id is unreliable for admin sessions (returns numeric "1").
 * Always use this when you need the user's UUID for DB queries.
 */
export async function resolveDbUserId(email: string): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  return user?.id ?? null;
}
