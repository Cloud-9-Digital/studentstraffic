import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAuthorizedPeerCallSession } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ callId: string }> },
) {
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

  return NextResponse.json({
    status: call.status,
    expiresAt: call.expiresAt.toISOString(),
  });
}
