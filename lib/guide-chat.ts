import "server-only";

import { and, count, desc, eq, gt, ne, or } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
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
  studentName: string | null;
  studentEmail: string;
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
  studentEmail: string;
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
  studentEmail: string;
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
      studentName: users.name,
      studentEmail: users.email,
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
    displayName: conversation.isPeerParticipant
      ? conversation.studentName?.trim() || "Student"
      : conversation.peerName,
    subtitle: conversation.universityName,
    universityName: conversation.universityName,
    universitySlug: conversation.universitySlug,
    lastMessageText: conversation.lastMessageText,
    lastMessageAt: conversation.lastMessageAt,
    counterpartLastReadAt: conversation.isPeerParticipant
      ? conversation.studentLastReadAt
      : conversation.peerLastReadAt,
    unreadCount,
  };
}


export async function listStudentGuideConversations(studentUserId: string) {
  const db = getDb();
  if (!db) return [] as GuideConversationSummary[];

  const rows = await db
    .select({
      id: guideConversations.id,
      peerId: guideConversations.peerId,
      peerUserId: guideConversations.peerUserId,
      studentUserId: guideConversations.studentUserId,
      peerName: studentPeers.fullName,
      universityName: universities.name,
      universitySlug: universities.slug,
      lastMessageText: guideConversations.lastMessageText,
      lastMessageAt: guideConversations.lastMessageAt,
      studentLastReadAt: guideConversations.studentLastReadAt,
      peerLastReadAt: guideConversations.peerLastReadAt,
      createdAt: guideConversations.createdAt,
    })
    .from(guideConversations)
    .innerJoin(studentPeers, eq(guideConversations.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(guideConversations.studentUserId, studentUserId))
    .orderBy(desc(guideConversations.lastMessageAt), desc(guideConversations.createdAt));

  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      peerId: row.peerId,
      peerUserId: row.peerUserId,
      studentUserId: row.studentUserId,
      bookingId: null,
      displayName: row.peerName,
      subtitle: row.universityName,
      universityName: row.universityName,
      universitySlug: row.universitySlug,
      lastMessageText: row.lastMessageText,
      lastMessageAt: row.lastMessageAt,
      counterpartLastReadAt: row.peerLastReadAt ?? null,
      unreadCount: await getUnreadCount(row.id, studentUserId, row.studentLastReadAt),
    }))
  );
}

export async function listGuideConversations(peerUserId: string) {
  const db = getDb();
  if (!db) return [] as GuideConversationSummary[];

  const rows = await db
    .select({
      id: guideConversations.id,
      peerId: guideConversations.peerId,
      peerUserId: guideConversations.peerUserId,
      studentUserId: guideConversations.studentUserId,
      bookingId: peerCallBookings.id,
      studentName: users.name,
      universityName: universities.name,
      universitySlug: universities.slug,
      lastMessageText: guideConversations.lastMessageText,
      lastMessageAt: guideConversations.lastMessageAt,
      studentLastReadAt: guideConversations.studentLastReadAt,
      peerLastReadAt: guideConversations.peerLastReadAt,
      createdAt: guideConversations.createdAt,
    })
    .from(guideConversations)
    .innerJoin(users, eq(guideConversations.studentUserId, users.id))
    .innerJoin(studentPeers, eq(guideConversations.peerId, studentPeers.id))
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(
      peerCallBookings,
      and(
        eq(peerCallBookings.peerId, guideConversations.peerId),
        eq(peerCallBookings.studentUserId, guideConversations.studentUserId)
      )
    )
    .where(eq(guideConversations.peerUserId, peerUserId))
    .orderBy(desc(guideConversations.lastMessageAt), desc(guideConversations.createdAt));

  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      peerId: row.peerId,
      peerUserId: row.peerUserId,
      studentUserId: row.studentUserId,
      bookingId: row.bookingId ?? null,
      displayName: row.studentName?.trim() || "Student",
      subtitle: row.universityName,
      universityName: row.universityName,
      universitySlug: row.universitySlug,
      lastMessageText: row.lastMessageText,
      lastMessageAt: row.lastMessageAt,
      counterpartLastReadAt: row.studentLastReadAt ?? null,
      unreadCount: await getUnreadCount(row.id, peerUserId, row.peerLastReadAt),
    }))
  );
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
      peerId: studentPeers.id,
      studentUserId: peerCallBookings.studentUserId,
      studentName: users.name,
      studentEmail: users.email,
      universityName: universities.name,
      universitySlug: universities.slug,
      bookingStatus: peerCallBookings.status,
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
    .orderBy(guideMessages.createdAt);

  return rows.map((row) => ({
    ...row,
    messageType: row.messageType,
    isMine: row.senderUserId === userId,
  }));
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
  body: string
) {
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

  const now = new Date();

  await db.insert(guideMessages).values({
    conversationId,
    senderUserId: userId,
    messageType: "text",
    body: normalizedBody,
    createdAt: now,
  });

  await db
    .update(guideConversations)
    .set(
      conversation.isPeerParticipant
        ? {
            lastMessageText: normalizedBody,
            lastMessageAt: now,
            peerLastReadAt: now,
            updatedAt: now,
          }
        : {
            lastMessageText: normalizedBody,
            lastMessageAt: now,
            studentLastReadAt: now,
            updatedAt: now,
          }
    )
    .where(eq(guideConversations.id, conversationId));

  return { ok: true as const };
}
