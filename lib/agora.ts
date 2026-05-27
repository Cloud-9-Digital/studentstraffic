import "server-only";

import { RtcRole, RtcTokenBuilder } from "agora-token";

import { env } from "@/lib/env";

// RtcTokenBuilder2 (used by the agora-token package) expects seconds-from-now, not absolute timestamps.
const AGORA_TOKEN_TTL_SECONDS = 60 * 60;

export function assertAgoraVoiceConfig() {
  if (!env.hasAgoraVoice || !env.agoraAppId || !env.agoraAppCertificate) {
    throw new Error("Agora voice is not configured.");
  }
}

export function buildAgoraRtcToken(input: {
  channelName: string;
  uid: number;
}) {
  assertAgoraVoiceConfig();

  return RtcTokenBuilder.buildTokenWithUid(
    env.agoraAppId!,
    env.agoraAppCertificate!,
    input.channelName,
    input.uid,
    RtcRole.PUBLISHER,
    AGORA_TOKEN_TTL_SECONDS,
    AGORA_TOKEN_TTL_SECONDS
  );
}
