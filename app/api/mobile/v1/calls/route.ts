import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";
import { peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { createOrReusePeerCallSession } from "@/lib/peer-calls";

// GET — list connected contacts for either the student or their approved guide profile
export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const guideMode = new URL(request.url).searchParams.get("role") === "guide";
  const bookings = await db
    .select({
      bookingId: peerCallBookings.id,
      peerId: studentPeers.id,
      guideName: studentPeers.fullName,
      studentName: users.name,
      courseName: studentPeers.courseName,
      currentYearOrBatch: studentPeers.currentYearOrBatch,
      photoUrl: studentPeers.photoUrl,
      universityName: universities.name,
      universitySlug: universities.slug,
      bookingStatus: peerCallBookings.status,
      createdAt: peerCallBookings.createdAt,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(users, eq(peerCallBookings.studentUserId, users.id))
    .where(guideMode ? eq(studentPeers.peerUserId, session.user.id) : eq(peerCallBookings.studentUserId, session.user.id))
    .orderBy(peerCallBookings.createdAt);

  return mobileJson({ bookings: bookings.map((booking) => ({ ...booking, fullName: guideMode ? booking.studentName?.trim() || "Student" : booking.guideName })) });
}

// POST — start a call by bookingId
export async function POST(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  if (!env.hasAgoraVoice) {
    return mobileError("unavailable", "Voice calling is not configured.", 503);
  }

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const body = await readJson(request);
  const bookingId = body?.bookingId;
  if (!bookingId || typeof bookingId !== "number") {
    return mobileError("validation_error", "bookingId is required.", 422);
  }

  const [booking] = await db
    .select({
      id: peerCallBookings.id,
      status: peerCallBookings.status,
      peerId: peerCallBookings.peerId,
      studentUserId: peerCallBookings.studentUserId,
      peerUserId: studentPeers.peerUserId,
      universityId: studentPeers.universityId,
      universityName: universities.name,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(peerCallBookings.id, bookingId))
    .limit(1);

  if (!booking) {
    return mobileError("not_found", "Booking not found.", 404);
  }
  if (booking.status !== "accepted") {
    return mobileError("forbidden", "This booking has not been accepted yet.", 403);
  }

  const isStudent = booking.studentUserId === session.user.id;
  const isGuide = booking.peerUserId === session.user.id;
  if (!isStudent && !isGuide) return mobileError("not_found", "Booking not found.", 404);
  if (!booking.peerUserId) return mobileError("not_found", "Guide not available.", 404);
  const [caller] = await db.select({ name: users.name }).from(users).where(eq(users.id, session.user.id)).limit(1);

  const call = await createOrReusePeerCallSession({
    peerId: booking.peerId,
    universityId: booking.universityId,
    callerUserId: session.user.id,
    recipientUserId: isStudent ? booking.peerUserId : booking.studentUserId,
    callerDisplayName: caller?.name?.trim() || (isGuide ? "Student guide" : "A student"),
    universityName: booking.universityName,
  });

  return mobileJson({ callId: call.callId });
}
