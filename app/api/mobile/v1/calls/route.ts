import { and, eq, gt, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";
import { peerCallBookings, peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";
import { sendCallPushNotification } from "@/lib/push-notifications";

const CALL_TTL_MS = 60 * 60 * 1000;

// GET — list booked guides for the student
export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const bookings = await db
    .select({
      bookingId: peerCallBookings.id,
      peerId: studentPeers.id,
      fullName: studentPeers.fullName,
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
    .where(eq(peerCallBookings.studentUserId, session.user.id))
    .orderBy(peerCallBookings.createdAt);

  return mobileJson({ bookings });
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
    })
    .from(peerCallBookings)
    .where(
      and(
        eq(peerCallBookings.id, bookingId),
        eq(peerCallBookings.studentUserId, session.user.id)
      )
    )
    .limit(1);

  if (!booking) {
    return mobileError("not_found", "Booking not found.", 404);
  }
  if (booking.status !== "accepted") {
    return mobileError("forbidden", "This booking has not been accepted yet.", 403);
  }

  const [[peer], [caller]] = await Promise.all([
    db
      .select({
        id: studentPeers.id,
        peerUserId: studentPeers.peerUserId,
        universityId: studentPeers.universityId,
        universityName: universities.name,
      })
      .from(studentPeers)
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .where(eq(studentPeers.id, booking.peerId))
      .limit(1),
    db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1),
  ]);

  if (!peer?.peerUserId) {
    return mobileError("not_found", "Guide not available.", 404);
  }

  const now = new Date();

  // Reuse any existing open session for this pair
  const [existingCall] = await db
    .select({ id: peerCallSessions.id })
    .from(peerCallSessions)
    .where(
      and(
        eq(peerCallSessions.peerId, peer.id),
        eq(peerCallSessions.callerUserId, session.user.id),
        inArray(peerCallSessions.status, ["ringing", "active"]),
        gt(peerCallSessions.expiresAt, now)
      )
    )
    .limit(1);

  if (existingCall) {
    return mobileJson({ callId: existingCall.id });
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
    callerUserId: session.user.id,
    status: "ringing",
    startedAt: now,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  // Notify the peer (guide) that a student is calling
  sendCallPushNotification(peer.peerUserId, {
    callId,
    callerDisplayName: caller?.name?.trim() || "A student",
    universityName: peer.universityName,
  }).catch(() => null);

  return mobileJson({ callId });
}
