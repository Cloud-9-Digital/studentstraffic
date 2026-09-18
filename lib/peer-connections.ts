import "server-only";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { guideConversations, peerCallBookings, peerReports, studentPeers } from "@/lib/db/schema";
import { peerLockQuery, requestPeerBookingQuery, changePeerConnectionQuery } from "@/lib/peer-queries";
import { containsPeerContactDetails, PEER_CONTACT_POLICY_ERROR } from "@/lib/peer-contact-policy";
import { consumePublicFormRateLimits } from "@/lib/security/public-form-guard";
import { schedulePeerNotification } from "@/lib/peer-notifications";
import { getAuthorizedGuideConversation } from "@/lib/guide-chat";
import { notifyPeerCallEnded, notifyPeerCallParticipants } from "@/lib/peer-calls";

export async function requestPeerBooking(peerId: number, userId: string, message: string) {
  const text = message.trim();
  if (!Number.isSafeInteger(peerId) || peerId < 1) return { error: "Invalid guide." };
  if (!text || text.length > 1000) return { error: "Please describe your question in 1–1,000 characters." };
  if (containsPeerContactDetails(text)) return { error: PEER_CONTACT_POLICY_ERROR };
  const db = getDb();
  if (!db) return { error: "Service unavailable." };
  const rateError = await consumePublicFormRateLimits([{ scope: "peer:bookings", identifier: userId, limit: 5, windowMs: 60 * 60_000 }], "connection requests");
  if (rateError) return { error: rateError };
  const [, result] = await db.batch([
    db.execute(peerLockQuery(peerId)),
    db.execute<{ bookingId: number | null; jobId: number | null }>(requestPeerBookingQuery(peerId, userId, text)),
  ]);
  if (result.rows[0]?.bookingId) {
    if (result.rows[0].jobId) schedulePeerNotification(result.rows[0].jobId);
    return { success: true };
  }
  const [existing] = await db.select().from(peerCallBookings).where(sql`${peerCallBookings.peerId} = ${peerId} and ${peerCallBookings.studentUserId} = ${userId}`).limit(1);
  if (existing && !existing.studentBlockedAt && !existing.peerBlockedAt && ["pending","accepted"].includes(existing.status)) return { alreadyBooked: true };
  return { error: "This guide is unavailable, the connection is blocked, or a declined request is still in its 7-day waiting period." };
}

export const connectionOperations = ["accept", "decline", "cancel", "block", "unblock"] as const;
export type ConnectionOperation = typeof connectionOperations[number];

export async function changePeerConnection(bookingId: number, userId: string, operation: ConnectionOperation) {
  const db = getDb();
  if (!db) return { error: "Service unavailable." };
  const [booking] = await db.select({ peerId: peerCallBookings.peerId }).from(peerCallBookings).where(eq(peerCallBookings.id, bookingId)).limit(1);
  if (!booking) return { error: "Connection not found." };
  const [, result] = await db.batch([
    db.execute(peerLockQuery(booking.peerId)),
    db.execute<{ id: number; studentUserId: string; peerUserId: string; jobId: number | null; endedCalls: string[] }>(changePeerConnectionQuery(bookingId, userId, operation)),
  ]);
  const row = result.rows[0];
  if (!row) return { error: "This connection changed or you cannot perform that action. Please refresh." };
  if (row.jobId) schedulePeerNotification(row.jobId);
  notifyPeerCallParticipants([row.studentUserId, row.peerUserId], "connection.changed");
  await Promise.allSettled(row.endedCalls.map(id => notifyPeerCallEnded([row.studentUserId, row.peerUserId], id)));
  return { success: true };
}

export async function reportPeerConversation(conversationId: number, userId: string, reason: string, details: string) {
  const allowed = ["harassment", "contact_sharing", "misleading_information", "other"];
  if (!allowed.includes(reason) || details.trim().length < 10 || details.length > 2000) return { error: "Choose a reason and describe what happened in 10–2,000 characters." };
  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) return { error: "Conversation not found." };
  const rateError = await consumePublicFormRateLimits([{ scope: "peer:reports", identifier: userId, limit: 5, windowMs: 24 * 60 * 60_000 }], "reports");
  if (rateError) return { error: rateError };
  const db = getDb();
  if (!db) return { error: "Service unavailable." };
  await db.insert(peerReports).values({ conversationId, reporterUserId: userId, reason, details: details.trim() });
  return { success: true };
}
