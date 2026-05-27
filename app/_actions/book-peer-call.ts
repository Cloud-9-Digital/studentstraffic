"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { sendPeerCallRequestEmail } from "@/lib/email/templates/peer-call-request";

export type BookPeerCallResult = {
  success?: boolean;
  alreadyBooked?: boolean;
  error?: string;
};

export async function bookPeerCallAction(peerId: number, message: string): Promise<BookPeerCallResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to request a call." };
  }

  const db = getDb();
  if (!db) {
    return { error: "This feature is temporarily unavailable." };
  }

  const [callerUser] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!callerUser) {
    return { error: "Your account could not be found. Please sign in again." };
  }

  const [peer] = await db
    .select({
      id: studentPeers.id,
      peerUserId: studentPeers.peerUserId,
      fullName: studentPeers.fullName,
      contactEmail: studentPeers.contactEmail,
      universityName: universities.name,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(studentPeers.id, peerId))
    .limit(1);

  if (!peer) {
    return { error: "Guide not found." };
  }

  if (peer.peerUserId === callerUser.id) {
    return { error: "You cannot request a call with your own guide profile." };
  }

  const [existingBooking] = await db
    .select({ id: peerCallBookings.id })
    .from(peerCallBookings)
    .where(
      and(
        eq(peerCallBookings.studentUserId, callerUser.id),
        eq(peerCallBookings.peerId, peerId)
      )
    )
    .limit(1);

  if (existingBooking) {
    return { alreadyBooked: true };
  }

  const trimmedMessage = message.trim().slice(0, 1000);

  await db.insert(peerCallBookings).values({
    studentUserId: callerUser.id,
    peerId,
    status: "pending",
    message: trimmedMessage || null,
  });

  // Fire-and-forget: notify peer by email
  if (peer.contactEmail) {
    void sendPeerCallRequestEmail({
      peerName: peer.fullName,
      peerEmail: peer.contactEmail,
      studentName: callerUser.name ?? callerUser.email.split("@")[0],
      studentEmail: callerUser.email,
      message: trimmedMessage,
      universityName: peer.universityName,
    });
  }

  return { success: true };
}
