import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { buildAgoraRtcToken } from "@/lib/agora";
import { env } from "@/lib/env";
import { preparePeerCallToken } from "@/lib/peer-calls";
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
  const call = await preparePeerCallToken(callId, userId);

  if (!call) {
    return NextResponse.json({ error: "Call session not found." }, { status: 404 });
  }

  if (["missed", "declined", "ended", "expired"].includes(call.status)) {
    return NextResponse.json({ error: "This call is no longer available." }, { status: 410 });
  }

  if (call.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "This call has expired." }, { status: 410 });
  }

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
      status: call.status,
      peerName: call.peerName,
      callerName: call.callerName,
      universityName: call.universityName,
      isPeerParticipant: call.isPeerParticipant,
    },
  });
}
