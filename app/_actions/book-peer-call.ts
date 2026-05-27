"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerCallBookings, studentPeers, users } from "@/lib/db/schema";

export type BookPeerCallResult = {
  success?: boolean;
  alreadyBooked?: boolean;
  error?: string;
};

export async function bookPeerCallAction(peerId: number): Promise<BookPeerCallResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "You must be signed in to book a call." };
  }

  const db = getDb();
  if (!db) {
    return { error: "This feature is temporarily unavailable." };
  }

  const [callerUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!callerUser) {
    return { error: "Your account could not be found. Please sign in again." };
  }

  const [peer] = await db
    .select({ id: studentPeers.id, peerUserId: studentPeers.peerUserId })
    .from(studentPeers)
    .where(eq(studentPeers.id, peerId))
    .limit(1);

  if (!peer) {
    return { error: "Guide not found." };
  }

  if (peer.peerUserId === callerUser.id) {
    return { error: "You cannot book a call with your own guide profile." };
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

  await db.insert(peerCallBookings).values({
    studentUserId: callerUser.id,
    peerId,
    status: "active",
  });

  return { success: true };
}
