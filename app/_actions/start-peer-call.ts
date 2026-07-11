"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { studentPeers, universities, users } from "@/lib/db/schema";
import { createOrReusePeerCallSession } from "@/lib/peer-calls";

export type StartPeerCallResult = {
  callId?: string;
  error?: string;
};

export async function startPeerCallAction(
  peerId: number,
  universitySlug: string
): Promise<StartPeerCallResult> {
  if (!env.hasAgoraVoice) {
    return { error: "Voice calling is not configured yet." };
  }

  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to start a call." };
  }

  const db = getDb();
  if (!db) {
    return { error: "This feature is temporarily unavailable. Please try again shortly." };
  }

  // Resolve real user ID by email (session.user.id is unreliable for admin sessions)
  const [callerUser] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!callerUser) {
    return { error: "Your account could not be found. Please sign in again." };
  }

  const callerUserId = callerUser.id;

  const [peer] = await db
    .select({
      id: studentPeers.id,
      peerUserId: studentPeers.peerUserId,
      universityId: studentPeers.universityId,
      universityName: universities.name,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(
      and(
        eq(studentPeers.id, peerId),
        eq(universities.slug, universitySlug),
        eq(studentPeers.status, "active")
      )
    )
    .limit(1);

  if (!peer?.peerUserId) {
    return { error: "This student is not available for in-app calls yet." };
  }

  if (peer.peerUserId === callerUserId) {
    return { error: "You cannot start a call with your own peer profile." };
  }

  const call = await createOrReusePeerCallSession({
    peerId: peer.id,
    universityId: peer.universityId,
    callerUserId,
    recipientUserId: peer.peerUserId,
    callerDisplayName: callerUser.name?.trim() || "A student",
    universityName: peer.universityName,
  });

  return { callId: call.callId };
}
