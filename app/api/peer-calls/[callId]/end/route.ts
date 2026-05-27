import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerCallSessions } from "@/lib/db/schema";
import { getAuthorizedPeerCallSession } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";

export async function POST(
  _request: Request,
  context: { params: Promise<{ callId: string }> }
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

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const endedAt = new Date();

  await db
    .update(peerCallSessions)
    .set({
      status: "ended",
      endedAt,
      updatedAt: endedAt,
    })
    .where(
      and(
        eq(peerCallSessions.id, call.id),
        inArray(peerCallSessions.status, ["ringing", "active"])
      )
    );

  return NextResponse.json({ success: true });
}
