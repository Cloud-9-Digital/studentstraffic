import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";

import type { getDb } from "@/lib/db/server";
import {
  guideConversations,
  peerCallBookings,
  peerCallSessions,
  peerRequests,
  users,
} from "@/lib/db/schema";
import {
  mergeGuideStudents,
  toGuideStudentRow,
  type GuideStudent,
  type GuideStudentRow,
} from "@/lib/dashboard/guide-students";
import { peerSafeText } from "@/lib/peer-contact-policy";

type Db = NonNullable<ReturnType<typeof getDb>>;

/** Per-source cap; a guide with more than this many rows in one source sees "200+". */
export const GUIDE_STUDENT_SOURCE_LIMIT = 200;

export type GuideStudentsResult = {
  students: GuideStudent[];
  /** True when a source hit its cap, so counts are a lower bound. */
  truncated: boolean;
  callsThisMonth: number;
};

/**
 * Load every student connected to a guide in one database round trip
 * (a single neon-http batch of four bounded, projected queries) and merge
 * them into one row per student.
 */
export async function loadGuideStudents(
  db: Db,
  guide: { peerId: number; peerUserId: string; guideActive?: boolean },
): Promise<GuideStudentsResult> {
  const { peerId, peerUserId } = guide;
  const limit = GUIDE_STUDENT_SOURCE_LIMIT;
  const callStudentId = sql<string>`case when ${peerCallSessions.callerUserId} = ${peerUserId} then ${peerCallSessions.peerUserId} else ${peerCallSessions.callerUserId} end`;

  const [bookings, conversations, calls, introductions] = await db.batch([
    db
      .select({
        bookingId: peerCallBookings.id,
        studentUserId: peerCallBookings.studentUserId,
        studentName: users.name,
        status: peerCallBookings.status,
        message: peerCallBookings.message,
        blocked: sql<boolean>`(${peerCallBookings.studentBlockedAt} is not null or ${peerCallBookings.peerBlockedAt} is not null)`,
        createdAt: peerCallBookings.createdAt,
        updatedAt: peerCallBookings.updatedAt,
        neetScore: users.neetScore,
        preferredCountries: users.preferredCountries,
      })
      .from(peerCallBookings)
      .innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
      .where(eq(peerCallBookings.peerId, peerId))
      .orderBy(desc(peerCallBookings.updatedAt))
      .limit(limit),
    db
      .select({
        conversationId: guideConversations.id,
        studentUserId: guideConversations.studentUserId,
        studentName: users.name,
        lastMessageAt: guideConversations.lastMessageAt,
        createdAt: guideConversations.createdAt,
        // Name the outer table explicitly: drizzle may render these as bare columns, which
        // inside the subquery would resolve to guide_messages' own "id".
        unreadCount: sql<number>`(select count(*)::integer from guide_messages m where m.conversation_id = ${sql.raw(`"guide_conversations"."id"`)}
          and m.sender_user_id <> ${peerUserId} and m.created_at > coalesce(${sql.raw(`"guide_conversations"."peer_last_read_at"`)}, '-infinity'::timestamptz))`.mapWith(Number),
        neetScore: users.neetScore,
        preferredCountries: users.preferredCountries,
      })
      .from(guideConversations)
      .innerJoin(users, eq(guideConversations.studentUserId, users.id))
      .where(eq(guideConversations.peerId, peerId))
      .orderBy(sql`${guideConversations.lastMessageAt} desc nulls last`)
      .limit(limit),
    db
      .select({
        studentUserId: users.id,
        studentName: users.name,
        callCount: sql<number>`count(*)::integer`.mapWith(Number),
        callsThisMonth: sql<number>`(count(*) filter (where ${peerCallSessions.createdAt} >= date_trunc('month', now())))::integer`.mapWith(Number),
        lastCallAt: sql<Date | null>`max(${peerCallSessions.createdAt})`.mapWith((value) => (value ? new Date(value) : null)),
        neetScore: users.neetScore,
        preferredCountries: users.preferredCountries,
      })
      .from(peerCallSessions)
      .innerJoin(users, eq(users.id, callStudentId))
      .where(eq(peerCallSessions.peerId, peerId))
      .groupBy(users.id)
      .orderBy(sql`max(${peerCallSessions.createdAt}) desc`)
      .limit(limit),
    db
      .select({
        requestId: peerRequests.id,
        matchedUserId: users.id,
        fullName: peerRequests.fullName,
        email: peerRequests.email,
        phone: peerRequests.phone,
        userState: peerRequests.userState,
        userCity: peerRequests.userCity,
        courseInterest: peerRequests.courseInterest,
        message: peerRequests.message,
        createdAt: peerRequests.createdAt,
        neetScore: users.neetScore,
        preferredCountries: users.preferredCountries,
      })
      .from(peerRequests)
      .leftJoin(users, and(sql`${peerRequests.email} is not null`, eq(users.email, peerRequests.email)))
      .where(eq(peerRequests.matchedPeerId, peerId))
      .orderBy(desc(peerRequests.createdAt))
      .limit(limit),
  ]);

  const students = mergeGuideStudents(
    { bookings, conversations, calls, introductions },
    { guideActive: guide.guideActive },
  );

  return {
    students,
    truncated: [bookings, conversations, calls, introductions].some((rows) => rows.length >= limit),
    callsThisMonth: calls.reduce((sum, row) => sum + row.callsThisMonth, 0),
  };
}

/** Client-safe row: contact details masked in free text, dates pre-formatted. */
export function toSafeGuideStudentRow(student: GuideStudent): GuideStudentRow {
  return toGuideStudentRow({
    ...student,
    name: peerSafeText(student.name),
    interest: student.interest ? peerSafeText(student.interest) : null,
  });
}
