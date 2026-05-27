import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { mobileSessions } from "@/lib/db/schema";
import { getBearerToken, requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";

export async function PATCH(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const body = await readJson(request);
  const pushToken = body?.pushToken;
  if (!pushToken || typeof pushToken !== "string") {
    return mobileError("validation_error", "pushToken is required.", 422);
  }

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const token = getBearerToken(request);
  if (!token) return mobileError("unauthorized", "Please sign in again.", 401);

  const tokenHash = createHash("sha256").update(token).digest("hex");

  await db
    .update(mobileSessions)
    .set({ pushToken, updatedAt: new Date() })
    .where(eq(mobileSessions.tokenHash, tokenHash));

  return mobileJson({ success: true });
}
