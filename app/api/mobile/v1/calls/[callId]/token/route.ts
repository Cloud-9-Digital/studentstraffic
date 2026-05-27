import { and, eq } from "drizzle-orm";

import { buildAgoraRtcToken } from "@/lib/agora";
import { getDb } from "@/lib/db/server";
import { peerCallSessions } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { getAuthorizedPeerCallSession } from "@/lib/peer-calls";

export async function POST(
  _request: Request,
  context: { params: Promise<{ callId: string }> }
) {
  const session = await requireMobileSession(_request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  if (!env.hasAgoraVoice || !env.agoraAppId) {
    return mobileError("unavailable", "Voice calling is not configured.", 503);
  }

  const { callId } = await context.params;
  const call = await getAuthorizedPeerCallSession(callId, session.user.id);

  if (!call) return mobileError("not_found", "Call session not found.", 404);

  if (["missed", "declined", "ended", "expired"].includes(call.status)) {
    return mobileError("gone", "This call is no longer available.", 410);
  }

  if (call.expiresAt.getTime() <= Date.now()) {
    return mobileError("gone", "This call has expired.", 410);
  }

  // If peer is answering a ringing call, mark it active
  if (call.isPeerParticipant && call.status === "ringing") {
    const db = getDb();
    if (db) {
      const answeredAt = new Date();
      await db
        .update(peerCallSessions)
        .set({ status: "active", answeredAt, updatedAt: answeredAt })
        .where(and(eq(peerCallSessions.id, call.id), eq(peerCallSessions.status, "ringing")));
    }
  }

  const uid = call.isPeerParticipant ? 2 : 1;
  const token = buildAgoraRtcToken({ channelName: call.channelName, uid });

  return mobileJson({
    appId: env.agoraAppId,
    channelName: call.channelName,
    token,
    uid,
    call: {
      id: call.id,
      status: call.isPeerParticipant && call.status === "ringing" ? "active" : call.status,
      peerName: call.peerName,
      callerName: call.callerName,
      universityName: call.universityName,
      isPeerParticipant: call.isPeerParticipant,
    },
  });
}
