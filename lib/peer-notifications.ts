import "server-only";
import { after } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { guideMessages, peerCallSessions, peerCallBookings, studentPeers, users, universities } from "@/lib/db/schema";
import { processBackgroundJobById } from "@/lib/background-jobs";
import { getAuthorizedGuideConversation, getGuideConversationSummaryForUser, listGuideConversationMessages } from "@/lib/guide-chat";
import { publishGuideChatUserEvent, publishPeerCallsUserEvent } from "@/lib/realtime/ably";
import { sendCallPushNotification, sendGuideMessagePushNotification } from "@/lib/push-notifications";
import { sendPeerCallRequestEmail } from "@/lib/email/templates/peer-call-request";
import { sendPeerCallAcceptedEmail } from "@/lib/email/templates/peer-call-accepted";
import { peerSafeText } from "@/lib/peer-contact-policy";

export function schedulePeerNotification(jobId: number) {
  after(() => processBackgroundJobById(jobId));
}

// Queue payloads contain IDs, never contact details or message bodies.
export async function deliverPeerNotification(payload: Record<string, unknown>) {
  const db = getDb();
  if (!db) throw new Error("Notification database unavailable");
  if (payload.type === "message") {
    const [message] = await db.select().from(guideMessages).where(eq(guideMessages.id, Number(payload.messageId))).limit(1);
    if (!message) return;
    const conversation = await getAuthorizedGuideConversation(message.conversationId, message.senderUserId);
    if (!conversation || conversation.studentBlockedAt || conversation.peerBlockedAt) return;
    const recipient = conversation.peerUserId === message.senderUserId ? conversation.studentUserId : conversation.peerUserId;
    await Promise.all([conversation.studentUserId, conversation.peerUserId].map(async (userId) => {
      const summary = await getGuideConversationSummaryForUser(conversation.id, userId);
      await publishGuideChatUserEvent(userId, "message.created", {
        conversationId: conversation.id, conversation: summary,
        message: { ...message, body: peerSafeText(message.body), isMine: userId === message.senderUserId }, clientNonce: message.clientNonce,
      });
    }));
    await sendGuideMessagePushNotification(recipient, {
      conversationId: conversation.id,
      senderName: message.senderUserId === conversation.peerUserId ? conversation.peerName : conversation.studentName || "Student",
      body: "You have a new message. Open Students Traffic to read it.",
    });
    return;
  }
  if (payload.type === "call") {
    const [call] = await db.select({ id: peerCallSessions.id, recipient: peerCallSessions.peerUserId, caller: peerCallSessions.callerUserId, name: users.name, university: universities.name, status: peerCallSessions.status, expiresAt: peerCallSessions.expiresAt })
      .from(peerCallSessions).innerJoin(users, eq(peerCallSessions.callerUserId, users.id))
      .innerJoin(universities, eq(peerCallSessions.universityId, universities.id)).where(eq(peerCallSessions.id, String(payload.callId))).limit(1);
    if (!call || call.status !== "ringing" || call.expiresAt <= new Date()) return;
    await publishPeerCallsUserEvent(call.recipient, "calls.changed", { reason: "ringing" });
    await sendCallPushNotification(call.recipient, { callId: call.id, callerDisplayName: call.name || "Student", universityName: call.university });
    return;
  }
  if (payload.type === "booking" || payload.type === "accepted") {
    const [row] = await db.select({ studentName: users.name, studentEmail: users.email, peerName: studentPeers.fullName, peerEmail: studentPeers.contactEmail, peerUserId: studentPeers.peerUserId, studentUserId: peerCallBookings.studentUserId, universityName: universities.name, status: peerCallBookings.status, message: peerCallBookings.message, studentBlocked: peerCallBookings.studentBlockedAt, peerBlocked: peerCallBookings.peerBlockedAt })
      .from(peerCallBookings).innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
      .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id)).innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .where(eq(peerCallBookings.id, Number(payload.bookingId))).limit(1);
    if (!row || row.studentBlocked || row.peerBlocked) return;
    if (payload.type === "booking" && row.status === "pending" && row.peerEmail) {
      const sent = await sendPeerCallRequestEmail({ peerName: row.peerName, peerEmail: row.peerEmail, studentName: row.studentName || "Student", message: peerSafeText(row.message || ""), universityName: row.universityName });
      if (!sent) throw new Error("Guide request email delivery failed");
    }
    if (payload.type === "accepted" && row.status === "accepted") {
      const sent = await sendPeerCallAcceptedEmail({ studentName: row.studentName || "Student", studentEmail: row.studentEmail, peerName: row.peerName, universityName: row.universityName });
      if (!sent) throw new Error("Request acceptance email delivery failed");
    }
    return;
  }
  throw new Error("Unknown peer notification type");
}
