"use server";

import { and, eq, gt, inArray } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";

const REUSABLE_CALL_STATUSES = ["ringing", "active"] as const;
const CALL_TTL_MS = 60 * 60 * 1000;

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
    .select({ id: users.id })
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

  const now = new Date();
  const [existingCall] = await db
    .select({ id: peerCallSessions.id })
    .from(peerCallSessions)
    .where(
      and(
        eq(peerCallSessions.peerId, peer.id),
        eq(peerCallSessions.callerUserId, callerUserId),
        inArray(peerCallSessions.status, [...REUSABLE_CALL_STATUSES]),
        gt(peerCallSessions.expiresAt, now)
      )
    )
    .limit(1);

  if (existingCall) {
    return { callId: existingCall.id };
  }

  const callId = crypto.randomUUID();
  const channelName = `peer-call-${callId}`;
  const expiresAt = new Date(now.getTime() + CALL_TTL_MS);

  await db.insert(peerCallSessions).values({
    id: callId,
    channelName,
    universityId: peer.universityId,
    peerId: peer.id,
    peerUserId: peer.peerUserId,
    callerUserId,
    status: "ringing",
    startedAt: now,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return { callId };
}
