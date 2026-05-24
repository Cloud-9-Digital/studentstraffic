import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";
import { requireMobileSession, toMobileUser } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileProfilePatchSchema } from "@/lib/mobile/schemas";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  return mobileJson({ user: toMobileUser(session.user) });
}

export async function PATCH(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const parsed = mobileProfilePatchSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const [user] = await db
    .update(users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(users.id, session.user.id))
    .returning();

  return mobileJson({ user: toMobileUser(user) });
}
