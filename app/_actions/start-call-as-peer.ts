"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { createOrReusePeerCallSession } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";

export type StartCallAsPeerResult = {
  callId?: string;
  error?: string;
};

export async function startCallAsPeerAction(bookingId: number): Promise<StartCallAsPeerResult> {
  if (!env.hasAgoraVoice) {
    return { error: "Voice calling is not configured yet." };
  }

  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to start a call." };
  }

  const db = getDb();
  if (!db) {
    return { error: "Service temporarily unavailable." };
  }

  const peerUserId = await resolveDbUserId(session.user.email);
  if (!peerUserId) {
    return { error: "Your account could not be found. Please sign in again." };
  }

  // Fetch the booking and verify it belongs to this peer
  const [booking] = await db
    .select({
      id: peerCallBookings.id,
      status: peerCallBookings.status,
      studentUserId: peerCallBookings.studentUserId,
      peerId: peerCallBookings.peerId,
    })
    .from(peerCallBookings)
    .where(eq(peerCallBookings.id, bookingId))
    .limit(1);

  if (!booking) {
    return { error: "Booking not found." };
  }

  if (booking.status !== "accepted") {
    return { error: "This call request has not been accepted yet." };
  }

  // Verify this peer owns the booking
  const [peer] = await db
    .select({
      id: studentPeers.id,
      peerUserId: studentPeers.peerUserId,
      universityId: studentPeers.universityId,
      universityName: universities.name,
      fullName: studentPeers.fullName,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(
      and(
        eq(studentPeers.id, booking.peerId),
        eq(studentPeers.peerUserId, peerUserId)
      )
    )
    .limit(1);

  if (!peer) {
    return { error: "You are not authorised to start this call." };
  }

  // Verify the student exists and get their name for the push notification
  const [studentUser] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.id, booking.studentUserId))
    .limit(1);

  if (!studentUser) {
    return { error: "Student account not found." };
  }

  const call = await createOrReusePeerCallSession({
    peerId: peer.id,
    universityId: peer.universityId,
    callerUserId: peerUserId,
    recipientUserId: booking.studentUserId,
    callerDisplayName: peer.fullName?.trim() || "Your guide",
    universityName: peer.universityName,
  });

  return { callId: call.callId };
}
