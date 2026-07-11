import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { peerCallSessions } from "@/lib/db/schema";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { getAuthorizedPeerCallSession, notifyPeerCallEnded, notifyPeerCallParticipants } from "@/lib/peer-calls";
import { verifyCallActionToken } from "@/lib/call-action-token";

export async function POST(
  request: Request,
  context: { params: Promise<{ callId: string }> }
) {
  const { callId } = await context.params;
  const session = await requireMobileSession(request);
  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);
  const actionToken = request.headers.get("x-call-action-token");
  const [unscopedCall] = actionToken
    ? await db.select().from(peerCallSessions).where(eq(peerCallSessions.id, callId)).limit(1)
    : [null];
  const nativeDeclineAuthorized = Boolean(
    unscopedCall && verifyCallActionToken(actionToken, callId, unscopedCall.peerUserId)
  );
  if (!session && !nativeDeclineAuthorized) return mobileError("unauthorized", "Please sign in again.", 401);
  const call = nativeDeclineAuthorized
    ? unscopedCall
    : await getAuthorizedPeerCallSession(callId, session!.user.id);

  if (!call) return mobileError("not_found", "Call session not found.", 404);

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

  notifyPeerCallParticipants([call.peerUserId, call.callerUserId], "ended");
  await notifyPeerCallEnded([call.peerUserId, call.callerUserId], call.id);

  return mobileJson({ success: true });
}
