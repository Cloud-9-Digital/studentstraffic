import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { buildAgoraRtcToken } from "@/lib/agora";
import { getDb } from "@/lib/db/server";
import { peerCallSessions } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { getAuthorizedPeerCallSession, notifyPeerCallParticipants } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";

export async function POST(
  _request: Request,
  context: { params: Promise<{ callId: string }> }
) {
  if (!env.hasAgoraVoice || !env.agoraAppId) {
    return NextResponse.json({ error: "Voice calling is unavailable." }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { callId } = await context.params;
  const call = await getAuthorizedPeerCallSession(callId, userId);

  if (!call) {
    return NextResponse.json({ error: "Call session not found." }, { status: 404 });
  }

  if (["missed", "declined", "ended", "expired"].includes(call.status)) {
    return NextResponse.json({ error: "This call is no longer available." }, { status: 410 });
  }

  if (call.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "This call has expired." }, { status: 410 });
  }

  if (call.isPeerParticipant && call.status === "ringing") {
    const db = getDb();
    if (db) {
      const answeredAt = new Date();
      await db
        .update(peerCallSessions)
        .set({
          status: "active",
          answeredAt,
          updatedAt: answeredAt,
        })
        .where(
          and(
            eq(peerCallSessions.id, call.id),
            eq(peerCallSessions.status, "ringing")
          )
        );
      notifyPeerCallParticipants([call.peerUserId, call.callerUserId], "active");
    }
  }

  const responseStatus = call.isPeerParticipant && call.status === "ringing" ? "active" : call.status;

  // Use fixed numeric UIDs per role — safe because every call has a unique channelName.
  // String user accounts require registerLocalUserAccount() first, which can cause silent hangs.
  const uid = call.isPeerParticipant ? 2 : 1;
  const token = buildAgoraRtcToken({
    channelName: call.channelName,
    uid,
  });

  return NextResponse.json({
    appId: env.agoraAppId,
    channelName: call.channelName,
    token,
    uid,
    call: {
      id: call.id,
      status: responseStatus,
      peerName: call.peerName,
      callerName: call.callerName,
      universityName: call.universityName,
      isPeerParticipant: call.isPeerParticipant,
    },
  });
}
