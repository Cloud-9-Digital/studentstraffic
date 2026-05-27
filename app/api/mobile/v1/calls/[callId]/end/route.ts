import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { peerCallSessions } from "@/lib/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { getAuthorizedPeerCallSession } from "@/lib/peer-calls";

export async function POST(
  request: Request,
  context: { params: Promise<{ callId: string }> }
) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const { callId } = await context.params;
  const call = await getAuthorizedPeerCallSession(callId, session.user.id);

  if (!call) return mobileError("not_found", "Call session not found.", 404);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const endedAt = new Date();
  await db
    .update(peerCallSessions)
    .set({ status: "ended", endedAt, updatedAt: endedAt })
    .where(
      and(
        eq(peerCallSessions.id, call.id),
        inArray(peerCallSessions.status, ["ringing", "active"])
      )
    );

  return mobileJson({ success: true });
}
