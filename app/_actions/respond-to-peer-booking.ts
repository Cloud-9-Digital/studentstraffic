"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";
import { sendPeerCallAcceptedEmail } from "@/lib/email/templates/peer-call-accepted";

export type RespondToBookingResult = { success?: boolean; error?: string };

export async function acceptBookingAction(bookingId: number): Promise<RespondToBookingResult> {
  return respondToBooking(bookingId, "accepted");
}

export async function declineBookingAction(bookingId: number): Promise<RespondToBookingResult> {
  return respondToBooking(bookingId, "declined");
}

async function respondToBooking(
  bookingId: number,
  newStatus: "accepted" | "declined"
): Promise<RespondToBookingResult> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Not authenticated." };

  const db = getDb();
  if (!db) return { error: "Service temporarily unavailable." };

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return { error: "Account not found." };

  // Verify this booking belongs to this peer
  const [booking] = await db
    .select({
      id: peerCallBookings.id,
      status: peerCallBookings.status,
      studentUserId: peerCallBookings.studentUserId,
      peerUserId: studentPeers.peerUserId,
      peerName: studentPeers.fullName,
      universityName: universities.name,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(peerCallBookings.id, bookingId))
    .limit(1);

  if (!booking) return { error: "Request not found." };
  if (booking.peerUserId !== userId) return { error: "Not authorised." };

  await db
    .update(peerCallBookings)
    .set({ status: newStatus })
    .where(and(eq(peerCallBookings.id, bookingId)));

  // Email student when accepted
  if (newStatus === "accepted") {
    const [student] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, booking.studentUserId))
      .limit(1);

    if (student) {
      void sendPeerCallAcceptedEmail({
        studentName: student.name ?? student.email.split("@")[0],
        studentEmail: student.email,
        peerName: booking.peerName,
        universityName: booking.universityName,
      });
    }
  }

  return { success: true };
}
