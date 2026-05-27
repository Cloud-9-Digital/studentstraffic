import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { buildAgoraRtcToken } from "@/lib/agora";

// GET /api/debug-agora
// Returns Agora config sanity check — requires auth, never exposes full secrets.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appId = env.agoraAppId ?? null;
  const certPresent = Boolean(env.agoraAppCertificate);
  const hasVoice = env.hasAgoraVoice;

  let tokenOk = false;
  let tokenError: string | null = null;
  let tokenPrefix: string | null = null;

  if (hasVoice) {
    try {
      const token = buildAgoraRtcToken({ channelName: "debug-test-channel", uid: 1 });
      tokenOk = typeof token === "string" && token.length > 10;
      tokenPrefix = token.slice(0, 10) + "…";
    } catch (err) {
      tokenError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    hasVoice,
    appIdPresent: Boolean(appId),
    appIdPrefix: appId ? appId.slice(0, 8) + "…" : null,
    certPresent,
    tokenOk,
    tokenPrefix,
    tokenError,
    nodeEnv: process.env.NODE_ENV,
  });
}
