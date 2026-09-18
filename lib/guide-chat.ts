import "server-only";

import { sql, and, count, desc, eq, gt, ne, or } from "drizzle-orm";

import { containsPeerContactDetails, PEER_CONTACT_POLICY_ERROR, peerSafeText } from "@/lib/peer-contact-policy";

import { peerLockQuery, sendPeerMessageQuery } from "@/lib/peer-queries";
import { schedulePeerNotification } from "@/lib/peer-notifications";
import { consumePublicFormRateLimits } from "@/lib/security/public-form-guard";

import { getDb } from "@/lib/db/server";
import { listPeerCallTimelineEvents, type PeerCallTimelineEvent } from "@/lib/peer-calls";
import {
  guideConversations,
  guideMessages,
  peerCallBookings,
  studentPeers,
  universities,
  users,
} from "@/lib/db/schema";

const CHAT_ENABLED_BOOKING_STATUSES = ["pending", "accepted"] as const;

export type GuideConversationSummary = {
  id: number;
  peerId: number;
  peerUserId: string;
  studentUserId: string;
  bookingId: number | null;
  canMessage: boolean;
  canCall: boolean;
  blockedByMe: boolean;
  connectionStatus: string;
  displayName: string;
  subtitle: string;
  universityName: string;
  universitySlug: string;
  lastMessageText: string | null;
  lastMessageAt: Date | null;
  counterpartLastReadAt: Date | null;
  unreadCount: number;
};

export type GuideChatMessage = {
  id: number;
  conversationId: number;
  senderUserId: string;
  senderName: string | null;
  messageType: "text" | "system";
  body: string;
  createdAt: Date | null;
  isMine: boolean;
};

export type AuthorizedGuideConversation = {
  id: number;
  peerId: number;
  peerUserId: string;
  studentUserId: string;
  bookingId: number | null;
  bookingStatus: string | null;
  guideStatus: string;
  studentBlockedAt: Date | null;
  peerBlockedAt: Date | null;
  studentName: string | null;
  peerName: string;
  universityName: string;
  universitySlug: string;
  lastMessageText: string | null;
  lastMessageAt: Date | null;
  studentLastReadAt: Date | null;
  peerLastReadAt: Date | null;
  isPeerParticipant: boolean;
};

type StudentConversationCandidate = {
  peerId: number;
  peerName: string;
  universityName: string;
  universitySlug: string;
  bookingStatus: string;
  conversationId: number | null;
  lastMessageAt: Date | null;
};

type GuideConversationStarter = {
  bookingId: number;
  studentUserId: string;
  studentName: string | null;
  bookingStatus: string;
  conversationId: number | null;
  lastMessageAt: Date | null;
};

export type StudentConversationStarterSummary = {
  peerId: number;
  peerName: string;
  universityName: string;
  universitySlug: string;
  bookingStatus: string;
  conversationId: number | null;
  lastMessageAt: Date | null;
};

export type GuideConversationStarterSummary = {
  bookingId: number;
  peerId: number;
  studentUserId: string;
  studentName: string | null;
  universityName: string;
  universitySlug: string;
  bookingStatus: string;
  conversationId: number | null;
  lastMessageAt: Date | null;
};

function normalizeMessageBody(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

export async function getOrCreateGuideConversationForStudent(
  studentUserId: string,
  peerId: number
) {
  const db = getDb();
  if (!db) return null;

  const [booking] = await db
    .select({
      peerId: studentPeers.id,
      peerUserId: studentPeers.peerUserId,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .where(
      and(
        eq(studentPeers.status, "active"),
        sql`${peerCallBookings.studentBlockedAt} is null and ${peerCallBookings.peerBlockedAt} is null`,
        eq(peerCallBookings.studentUserId, studentUserId),
        eq(peerCallBookings.peerId, peerId),
        or(
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[0]),
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[1])
        )
      )
    )
    .limit(1);

  if (!booking?.peerUserId) {
    return null;
  }

  const [existingConversation] = await db
    .select({ id: guideConversations.id })
    .from(guideConversations)
    .where(
      and(
        eq(guideConversations.studentUserId, studentUserId),
        eq(guideConversations.peerId, peerId)
      )
    )
    .limit(1);

  if (existingConversation) {
    return existingConversation.id;
  }

  const now = new Date();
  const [createdConversation] = await db
    .insert(guideConversations)
    .values({
      studentUserId,
      peerId,
      peerUserId: booking.peerUserId,
      studentLastReadAt: now,
      peerLastReadAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({ target: [guideConversations.studentUserId, guideConversations.peerId], set: { updatedAt: sql`${guideConversations.updatedAt}` } })
    .returning({ id: guideConversations.id });

  return createdConversation?.id ?? null;
}

export async function getOrCreateGuideConversationForGuide(
  peerUserId: string,
  bookingId: number
) {
  const db = getDb();
  if (!db) return null;

  const [booking] = await db
    .select({
      studentUserId: peerCallBookings.studentUserId,
      peerId: studentPeers.id,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .where(
      and(
        eq(peerCallBookings.id, bookingId),
        eq(studentPeers.status, "active"),
        sql`${peerCallBookings.studentBlockedAt} is null and ${peerCallBookings.peerBlockedAt} is null`,
        eq(studentPeers.peerUserId, peerUserId),
        or(
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[0]),
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[1])
        )
      )
    )
    .limit(1);

  if (!booking) {
    return null;
  }

  const [existingConversation] = await db
    .select({ id: guideConversations.id })
    .from(guideConversations)
    .where(
      and(
        eq(guideConversations.studentUserId, booking.studentUserId),
        eq(guideConversations.peerId, booking.peerId)
      )
    )
    .limit(1);

  if (existingConversation) {
    return existingConversation.id;
  }

  const now = new Date();
  const [createdConversation] = await db
    .insert(guideConversations)
    .values({
      studentUserId: booking.studentUserId,
      peerId: booking.peerId,
      peerUserId,
      studentLastReadAt: null,
      peerLastReadAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({ target: [guideConversations.studentUserId, guideConversations.peerId], set: { updatedAt: sql`${guideConversations.updatedAt}` } })
    .returning({ id: guideConversations.id });

  return createdConversation?.id ?? null;
}

export async function getAuthorizedGuideConversation(
  conversationId: number,
  userId: string
): Promise<AuthorizedGuideConversation | null> {
  const db = getDb();
  if (!db) return null;

  const [conversation] = await db
    .select({
      id: guideConversations.id,
      peerId: guideConversations.peerId,
      peerUserId: guideConversations.peerUserId,
      studentUserId: guideConversations.studentUserId,
      bookingId: peerCallBookings.id,
      bookingStatus: peerCallBookings.status,
      guideStatus: studentPeers.status,
      studentBlockedAt: peerCallBookings.studentBlockedAt,
      peerBlockedAt: peerCallBookings.peerBlockedAt,
      studentName: users.name,
      peerName: studentPeers.fullName,
      universityName: universities.name,
      universitySlug: universities.slug,
      lastMessageText: guideConversations.lastMessageText,
      lastMessageAt: guideConversations.lastMessageAt,
      studentLastReadAt: guideConversations.studentLastReadAt,
      peerLastReadAt: guideConversations.peerLastReadAt,
    })
    .from(guideConversations)
    .innerJoin(studentPeers, eq(guideConversations.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .innerJoin(users, eq(guideConversations.studentUserId, users.id))
    .leftJoin(
      peerCallBookings,
      and(
        eq(peerCallBookings.peerId, guideConversations.peerId),
        eq(peerCallBookings.studentUserId, guideConversations.studentUserId)
      )
    )
    .where(
      and(
        eq(guideConversations.id, conversationId),
        or(
          eq(guideConversations.studentUserId, userId),
          eq(guideConversations.peerUserId, userId)
        )
      )
    )
    .limit(1);

  if (!conversation) {
    return null;
  }

  return {
    ...conversation,
    bookingId: conversation.bookingId ?? null,
    isPeerParticipant: conversation.peerUserId === userId,
  };
}

async function getUnreadCount(
  conversationId: number,
  userId: string,
  lastReadAt: Date | null
) {
  const db = getDb();
  if (!db) return 0;

  const unreadWhere = lastReadAt
    ? and(
        eq(guideMessages.conversationId, conversationId),
        ne(guideMessages.senderUserId, userId),
        gt(guideMessages.createdAt, lastReadAt)
      )
    : and(
        eq(guideMessages.conversationId, conversationId),
        ne(guideMessages.senderUserId, userId)
      );

  const [result] = await db
    .select({ total: count() })
    .from(guideMessages)
    .where(unreadWhere);

  return result?.total ?? 0;
}

export async function getGuideConversationSummaryForUser(
  conversationId: number,
  userId: string
): Promise<GuideConversationSummary | null> {
  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) {
    return null;
  }

  const unreadCount = await getUnreadCount(
    conversationId,
    userId,
    conversation.isPeerParticipant
      ? conversation.peerLastReadAt
      : conversation.studentLastReadAt
  );

  return {
    id: conversation.id,
    peerId: conversation.peerId,
    peerUserId: conversation.peerUserId,
    studentUserId: conversation.studentUserId,
    bookingId: conversation.bookingId ?? null,
    ...conversationCapabilities(conversation, userId),
    displayName: conversation.isPeerParticipant
      ? conversation.studentName?.trim() || "Student"
      : conversation.peerName,
    subtitle: conversation.universityName,
    universityName: conversation.universityName,
    universitySlug: conversation.universitySlug,
    lastMessageText: conversation.lastMessageText ? peerSafeText(conversation.lastMessageText) : null,
    lastMessageAt: conversation.lastMessageAt,
    counterpartLastReadAt: conversation.isPeerParticipant
      ? conversation.studentLastReadAt
      : conversation.peerLastReadAt,
    unreadCount,
  };
}


export async function listStudentGuideConversations(userId: string) {
  return listConversationsForParticipant(userId, false);
}
export async function listGuideConversations(userId: string) {
  return listConversationsForParticipant(userId, true);
}
async function listConversationsForParticipant(userId: string, isGuide: boolean): Promise<GuideConversationSummary[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.select({
    id: guideConversations.id, peerId: guideConversations.peerId,
    studentUserId: guideConversations.studentUserId, peerUserId: guideConversations.peerUserId,
    bookingId: peerCallBookings.id, bookingStatus: peerCallBookings.status,
    guideStatus: studentPeers.status, studentBlockedAt: peerCallBookings.studentBlockedAt, peerBlockedAt: peerCallBookings.peerBlockedAt,
    peerName: studentPeers.fullName, studentName: users.name,
    universityName: universities.name, universitySlug: universities.slug,
    lastMessageText: guideConversations.lastMessageText, lastMessageAt: guideConversations.lastMessageAt,
    studentLastReadAt: guideConversations.studentLastReadAt, peerLastReadAt: guideConversations.peerLastReadAt,
    unreadCount: sql<number>`(select count(*)::integer from guide_messages m where m.conversation_id = ${guideConversations.id}
      and m.sender_user_id <> ${userId} and m.created_at > coalesce(${isGuide ? guideConversations.peerLastReadAt : guideConversations.studentLastReadAt}, '-infinity'::timestamptz))`.mapWith(Number),
  }).from(guideConversations)
    .innerJoin(studentPeers, eq(guideConversations.peerId, studentPeers.id))
    .innerJoin(users, eq(guideConversations.studentUserId, users.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(peerCallBookings, and(eq(peerCallBookings.peerId, guideConversations.peerId), eq(peerCallBookings.studentUserId, guideConversations.studentUserId)))
    .where(eq(isGuide ? guideConversations.peerUserId : guideConversations.studentUserId, userId))
    .orderBy(sql`${guideConversations.lastMessageAt} desc nulls last`, desc(guideConversations.createdAt)).limit(100);
  return rows.map(row => ({
    id: row.id, peerId: row.peerId, studentUserId: row.studentUserId, peerUserId: row.peerUserId,
    bookingId: row.bookingId, ...conversationCapabilities(row, userId),
    displayName: peerSafeText(isGuide ? row.studentName?.trim() || "Student" : row.peerName),
    subtitle: row.universityName, universityName: row.universityName, universitySlug: row.universitySlug,
    lastMessageText: row.lastMessageText ? peerSafeText(row.lastMessageText) : null, lastMessageAt: row.lastMessageAt,
    counterpartLastReadAt: isGuide ? row.studentLastReadAt : row.peerLastReadAt, unreadCount: row.unreadCount,
  }));
}
export function conversationCapabilities(conversation: Pick<AuthorizedGuideConversation, "studentBlockedAt" | "peerBlockedAt" | "guideStatus" | "bookingStatus" | "peerUserId">, userId: string) {
  const blocked = Boolean(conversation.studentBlockedAt || conversation.peerBlockedAt);
  const canMessage = !blocked && conversation.guideStatus === "active" && ["pending", "accepted"].includes(conversation.bookingStatus || "");
  return {
    canMessage,
    canCall: canMessage && conversation.bookingStatus === "accepted",
    blockedByMe: Boolean(conversation.peerUserId === userId ? conversation.peerBlockedAt : conversation.studentBlockedAt),
    connectionStatus: blocked ? "blocked" : conversation.guideStatus !== "active" ? "unavailable" : conversation.bookingStatus || "closed",
  };
}

export async function listStudentConversationCandidates(
  studentUserId: string
): Promise<StudentConversationStarterSummary[]> {
  const db = getDb();
  if (!db) return [];

  return db
    .select({
      peerId: studentPeers.id,
      peerName: studentPeers.fullName,
      universityName: universities.name,
      universitySlug: universities.slug,
      bookingStatus: peerCallBookings.status,
      conversationId: guideConversations.id,
      lastMessageAt: guideConversations.lastMessageAt,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(
      guideConversations,
      and(
        eq(guideConversations.studentUserId, peerCallBookings.studentUserId),
        eq(guideConversations.peerId, peerCallBookings.peerId)
      )
    )
    .where(
      and(
        eq(studentPeers.status, "active"),
        sql`${peerCallBookings.studentBlockedAt} is null and ${peerCallBookings.peerBlockedAt} is null`,
        eq(peerCallBookings.studentUserId, studentUserId),
        or(
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[0]),
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[1])
        )
      )
    )
    .orderBy(desc(guideConversations.lastMessageAt), desc(peerCallBookings.createdAt));
}

export async function listGuideConversationStarters(
  peerUserId: string
): Promise<GuideConversationStarterSummary[]> {
  const db = getDb();
  if (!db) return [];

  return db
    .select({
      bookingId: peerCallBookings.id,
      bookingStatus: peerCallBookings.status,
      guideStatus: studentPeers.status,
      studentBlockedAt: peerCallBookings.studentBlockedAt,
      peerBlockedAt: peerCallBookings.peerBlockedAt,
      peerId: studentPeers.id,
      studentUserId: peerCallBookings.studentUserId,
      studentName: users.name,
      universityName: universities.name,
      universitySlug: universities.slug,
      conversationId: guideConversations.id,
      lastMessageAt: guideConversations.lastMessageAt,
    })
    .from(peerCallBookings)
    .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
    .innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(
      guideConversations,
      and(
        eq(guideConversations.studentUserId, peerCallBookings.studentUserId),
        eq(guideConversations.peerId, peerCallBookings.peerId)
      )
    )
    .where(
      and(
        eq(studentPeers.status, "active"),
        sql`${peerCallBookings.studentBlockedAt} is null and ${peerCallBookings.peerBlockedAt} is null`,
        eq(studentPeers.peerUserId, peerUserId),
        or(
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[0]),
          eq(peerCallBookings.status, CHAT_ENABLED_BOOKING_STATUSES[1])
        )
      )
    )
    .orderBy(desc(guideConversations.lastMessageAt), desc(peerCallBookings.createdAt));
}

export async function listGuideConversationMessages(
  conversationId: number,
  userId: string
) {
  const db = getDb();
  if (!db) return [] as GuideChatMessage[];

  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) {
    return [];
  }

  const rows = await db
    .select({
      id: guideMessages.id,
      conversationId: guideMessages.conversationId,
      senderUserId: guideMessages.senderUserId,
      senderName: users.name,
      messageType: guideMessages.messageType,
      body: guideMessages.body,
      createdAt: guideMessages.createdAt,
    })
    .from(guideMessages)
    .leftJoin(users, eq(guideMessages.senderUserId, users.id))
    .where(eq(guideMessages.conversationId, conversationId))
    .orderBy(desc(guideMessages.id)).limit(100);

  return rows.reverse().map((row) => ({
    ...row,
    body: peerSafeText(row.body),
    messageType: row.messageType,
    isMine: row.senderUserId === userId,
  }));
}

export type GuideCallTimelineEvent = PeerCallTimelineEvent;

export async function listGuideConversationCallEvents(
  conversationId: number,
  userId: string
): Promise<GuideCallTimelineEvent[]> {
  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) return [];
  return listPeerCallTimelineEvents(conversation.peerId, userId, conversation.studentUserId);
}

export async function markGuideConversationRead(
  conversationId: number,
  userId: string
) {
  const db = getDb();
  if (!db) return;

  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) return;

  const now = new Date();
  await db
    .update(guideConversations)
    .set(
      conversation.isPeerParticipant
        ? { peerLastReadAt: now }
        : { studentLastReadAt: now }
    )
    .where(eq(guideConversations.id, conversationId));
}

export async function sendGuideConversationMessage(
  conversationId: number,
  userId: string,
  body: string,
  clientNonce?: string
) {
  if (containsPeerContactDetails(body)) {
    return { ok: false as const, error: PEER_CONTACT_POLICY_ERROR };
  }

  const db = getDb();
  if (!db) return { ok: false as const, error: "Service unavailable." };

  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) {
    return { ok: false as const, error: "Conversation not found." };
  }

  const normalizedBody = normalizeMessageBody(body);
  if (!normalizedBody) {
    return { ok: false as const, error: "Message cannot be empty." };
  }

  if (normalizedBody.length > 2000) return { ok: false as const, error: "Messages must be 2,000 characters or fewer." };
  const nonce = clientNonce || crypto.randomUUID();
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(nonce)) return { ok: false as const, error: "Invalid message identifier." };
  const rateError = await consumePublicFormRateLimits([{ scope: "peer:messages", identifier: userId, limit: 30, windowMs: 60_000 }], "messages");
  if (rateError) return { ok: false as const, error: rateError };
  const [, result] = await db.batch([
    db.execute(peerLockQuery(conversation.peerId)),
    db.execute<{ messageId: number | null; jobId: number | null; reused: boolean }>(sendPeerMessageQuery({ conversationId, userId, body: normalizedBody, nonce })),
  ]);
  const row = result.rows[0];
  if (!row?.messageId) return { ok: false as const, error: "This conversation is closed or blocked, or this message identifier was already used." };
  if (row.jobId) schedulePeerNotification(row.jobId);
  return { ok: true as const, messageId: row.messageId };
}
