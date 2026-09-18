
import { buildAgoraRtcToken } from "@/lib/agora";
import { env } from "@/lib/env";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { preparePeerCallToken } from "@/lib/peer-calls";

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
  const call = await preparePeerCallToken(callId, session.user.id);

  if (!call) return mobileError("not_found", "Call session not found.", 404);

  if (["missed", "declined", "ended", "expired"].includes(call.status)) {
    return mobileError("gone", "This call is no longer available.", 410);
  }

  if (call.expiresAt.getTime() <= Date.now()) {
    return mobileError("gone", "This call has expired.", 410);
  }

  // If peer is answering a ringing call, mark it active
  const uid = call.isPeerParticipant ? 2 : 1;
  const token = buildAgoraRtcToken({ channelName: call.channelName, uid });

  return mobileJson({
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
