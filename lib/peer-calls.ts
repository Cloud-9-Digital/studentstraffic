import "server-only";

import { and, desc, eq, gt, inArray, lt, or } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";
import type { PeerCallStatus } from "@/lib/data/types";
import { publishGuideChatUserEvent, publishPeerCallsUserEvent } from "@/lib/realtime/ably";
import { sendCallEndedPushNotification, sendCallPushNotification } from "@/lib/push-notifications";

const OPEN_CALL_STATUSES: PeerCallStatus[] = ["ringing", "active"];
export const RINGING_CALL_TTL_MS = 60 * 1000;

type CreatePeerCallInput = {
  peerId: number;
  universityId: number;
  callerUserId: string;
  recipientUserId: string;
  callerDisplayName: string;
  universityName: string;
};

/**
 * The single creation path for browser and mobile calls. A session is the
 * authority: realtime events and push only tell clients to fetch that state.
 */
export async function createOrReusePeerCallSession(input: CreatePeerCallInput) {
  const db = getDb();
  if (!db) throw new Error("Call service is unavailable.");

  const now = new Date();
  const [existing] = await db
    .select({ id: peerCallSessions.id })
    .from(peerCallSessions)
    .where(
      and(
        eq(peerCallSessions.peerId, input.peerId),
        eq(peerCallSessions.callerUserId, input.callerUserId),
        inArray(peerCallSessions.status, OPEN_CALL_STATUSES),
        gt(peerCallSessions.expiresAt, now)
      )
    )
    .limit(1);

  if (existing) return { callId: existing.id, reused: true };

  const callId = crypto.randomUUID();
  await db.insert(peerCallSessions).values({
    id: callId,
    channelName: `peer-call-${callId}`,
    universityId: input.universityId,
    peerId: input.peerId,
    peerUserId: input.recipientUserId,
    callerUserId: input.callerUserId,
    status: "ringing",
    startedAt: now,
    expiresAt: new Date(now.getTime() + RINGING_CALL_TTL_MS),
    createdAt: now,
    updatedAt: now,
  });

  notifyPeerCallParticipants([input.callerUserId, input.recipientUserId], "ringing");
  await sendCallPushNotification(input.recipientUserId, {
    callId,
    callerDisplayName: input.callerDisplayName,
    universityName: input.universityName,
  });

  return { callId, reused: false };
}

// Tells a participant's dashboard/mobile client to refetch its incoming-calls
// list, replacing 8s polling with a push-then-pull refresh.
export function notifyPeerCallParticipants(
  participants: Array<string | null | undefined>,
  reason: string
) {
  const userIds = new Set(participants.filter((id): id is string => Boolean(id)));
  for (const userId of userIds) {
    publishPeerCallsUserEvent(userId, "calls.changed", { reason }).catch(() => undefined);
    // The same participants can have the conversation open in the dashboard.
    // Refreshing its authoritative timeline keeps call outcomes in sync with chat.
    publishGuideChatUserEvent(userId, "call.updated", { reason }).catch(() => undefined);
  }
}

export type PeerCallTimelineEvent = {
  id: string;
  callId: string;
  direction: "incoming" | "outgoing";
  status: PeerCallStatus;
  createdAt: Date | null;
  answeredAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
};

/** Returns call records for one participant in one guide relationship. */
export async function listPeerCallTimelineEvents(
  peerId: number,
  userId: string
): Promise<PeerCallTimelineEvent[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: peerCallSessions.id,
      status: peerCallSessions.status,
      callerUserId: peerCallSessions.callerUserId,
      createdAt: peerCallSessions.createdAt,
      answeredAt: peerCallSessions.answeredAt,
      endedAt: peerCallSessions.endedAt,
    })
    .from(peerCallSessions)
    .where(
      and(
        eq(peerCallSessions.peerId, peerId),
        or(eq(peerCallSessions.callerUserId, userId), eq(peerCallSessions.peerUserId, userId))
      )
    )
    .orderBy(peerCallSessions.createdAt);

  return rows.map((row) => {
    const durationSeconds =
      row.answeredAt && row.endedAt
        ? Math.max(0, Math.floor((row.endedAt.getTime() - row.answeredAt.getTime()) / 1000))
        : null;
    return {
      id: `call-${row.id}`,
      callId: row.id,
      direction: row.callerUserId === userId ? "outgoing" : "incoming",
      status: row.status,
      createdAt: row.createdAt,
      answeredAt: row.answeredAt,
      endedAt: row.endedAt,
      durationSeconds,
    };
  });
}

export async function notifyPeerCallEnded(
  participants: Array<string | null | undefined>,
  callId: string
) {
  const userIds = new Set(participants.filter((id): id is string => Boolean(id)));
  await Promise.all([...userIds].map((userId) => sendCallEndedPushNotification(userId, callId)));
}

export type AuthorizedPeerCallSession = {
  id: string;
  channelName: string;
  status: PeerCallStatus;
  universityName: string;
  universitySlug: string;
  peerId: number;
  peerName: string;
  callerName: string | null;
  callerUserId: string;
  peerUserId: string;
  startedAt: Date | null;
  answeredAt: Date | null;
  endedAt: Date | null;
  expiresAt: Date;
  createdAt: Date | null;
  isPeerParticipant: boolean;
};

export type IncomingPeerCallSummary = {
  id: string;
  callerName: string;
  universityName: string;
  createdAt: string | null;
  status: PeerCallStatus;
};

export async function cleanupExpiredPeerCallSessions(userId?: string) {
  const db = getDb();
  if (!db) return 0;

  const now = new Date();

  // Expire ringing calls past their TTL
  const ringingWhere = userId
    ? and(
        eq(peerCallSessions.status, "ringing"),
        lt(peerCallSessions.expiresAt, now),
        or(
          eq(peerCallSessions.peerUserId, userId),
          eq(peerCallSessions.callerUserId, userId)
        )
      )
    : and(eq(peerCallSessions.status, "ringing"), lt(peerCallSessions.expiresAt, now));

  // Also end "active" calls that are past their TTL (e.g. caller closed browser without ending)
  const activeWhere = userId
    ? and(
        eq(peerCallSessions.status, "active"),
        lt(peerCallSessions.expiresAt, now),
        or(
          eq(peerCallSessions.peerUserId, userId),
          eq(peerCallSessions.callerUserId, userId)
        )
      )
    : and(eq(peerCallSessions.status, "active"), lt(peerCallSessions.expiresAt, now));

  const [affectedRinging, affectedActive] = await Promise.all([
    db
      .select({ id: peerCallSessions.id, peerUserId: peerCallSessions.peerUserId, callerUserId: peerCallSessions.callerUserId })
      .from(peerCallSessions)
      .where(ringingWhere),
    db
      .select({ id: peerCallSessions.id, peerUserId: peerCallSessions.peerUserId, callerUserId: peerCallSessions.callerUserId })
      .from(peerCallSessions)
      .where(activeWhere),
  ]);

  const [expiredRingingCalls, endedActiveCalls] = await Promise.all([
    db.update(peerCallSessions)
      .set({ status: "expired", endedAt: now, updatedAt: now })
      .where(ringingWhere),
    db.update(peerCallSessions)
      .set({ status: "ended", endedAt: now, updatedAt: now })
      .where(activeWhere),
  ]);

  for (const row of [...affectedRinging, ...affectedActive]) {
    notifyPeerCallParticipants([row.peerUserId, row.callerUserId], "expired");
    await notifyPeerCallEnded([row.peerUserId, row.callerUserId], row.id);
  }

  return expiredRingingCalls.rowCount + endedActiveCalls.rowCount;
}

export async function getAuthorizedPeerCallSession(
  callId: string,
  userId: string
): Promise<AuthorizedPeerCallSession | null> {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      id: peerCallSessions.id,
      channelName: peerCallSessions.channelName,
      status: peerCallSessions.status,
      peerId: peerCallSessions.peerId,
      callerUserId: peerCallSessions.callerUserId,
      peerUserId: peerCallSessions.peerUserId,
      startedAt: peerCallSessions.startedAt,
      answeredAt: peerCallSessions.answeredAt,
      endedAt: peerCallSessions.endedAt,
      expiresAt: peerCallSessions.expiresAt,
      createdAt: peerCallSessions.createdAt,
      universityName: universities.name,
      universitySlug: universities.slug,
      peerName: studentPeers.fullName,
      callerName: users.name,
    })
    .from(peerCallSessions)
    .innerJoin(studentPeers, eq(peerCallSessions.peerId, studentPeers.id))
    .innerJoin(universities, eq(peerCallSessions.universityId, universities.id))
    .leftJoin(users, eq(peerCallSessions.callerUserId, users.id))
    .where(
      and(
        eq(peerCallSessions.id, callId),
        or(
          eq(peerCallSessions.callerUserId, userId),
          eq(peerCallSessions.peerUserId, userId)
        )
      )
    )
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    isPeerParticipant: row.peerUserId === userId,
  };
}

export async function getIncomingPeerCalls(userId: string): Promise<IncomingPeerCallSummary[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: peerCallSessions.id,
      status: peerCallSessions.status,
      createdAt: peerCallSessions.createdAt,
      universityName: universities.name,
      callerName: users.name,
    })
    .from(peerCallSessions)
    .innerJoin(universities, eq(peerCallSessions.universityId, universities.id))
    .leftJoin(users, eq(peerCallSessions.callerUserId, users.id))
    .where(
      and(
        eq(peerCallSessions.peerUserId, userId),
        inArray(peerCallSessions.status, OPEN_CALL_STATUSES),
        gt(peerCallSessions.expiresAt, new Date())
      )
    )
    .orderBy(desc(peerCallSessions.createdAt))
    .limit(5);

  return rows.map((row) => ({
    id: row.id,
    callerName: row.callerName?.trim() || "A student",
    universityName: row.universityName,
    createdAt: row.createdAt?.toISOString() ?? null,
    status: row.status,
  }));
}

export type IncomingStudentCallSummary = {
  id: string;
  peerName: string;
  universityName: string;
  createdAt: string | null;
  status: PeerCallStatus;
};

export async function getIncomingStudentCalls(studentUserId: string): Promise<IncomingStudentCallSummary[]> {
  const db = getDb();
  if (!db) return [];

  // Case 1: counsellor/admin initiated the call — student is peerUserId (ringing or active)
  const counsellorInitiated = db
    .select({
      id: peerCallSessions.id,
      status: peerCallSessions.status,
      createdAt: peerCallSessions.createdAt,
      universityName: universities.name,
      displayName: users.name,
    })
    .from(peerCallSessions)
    .innerJoin(universities, eq(peerCallSessions.universityId, universities.id))
    .leftJoin(users, eq(peerCallSessions.callerUserId, users.id))
    .where(
      and(
        eq(peerCallSessions.peerUserId, studentUserId),
        inArray(peerCallSessions.status, OPEN_CALL_STATUSES),
        gt(peerCallSessions.expiresAt, new Date())
      )
    )
    .orderBy(desc(peerCallSessions.createdAt))
    .limit(5);

  // Case 2: student initiated the call — reconnect when peer has joined (active)
  const studentInitiated = db
    .select({
      id: peerCallSessions.id,
      status: peerCallSessions.status,
      createdAt: peerCallSessions.createdAt,
      universityName: universities.name,
      displayName: studentPeers.fullName,
    })
    .from(peerCallSessions)
    .innerJoin(studentPeers, eq(peerCallSessions.peerId, studentPeers.id))
    .innerJoin(universities, eq(peerCallSessions.universityId, universities.id))
    .where(
      and(
        eq(peerCallSessions.callerUserId, studentUserId),
        inArray(peerCallSessions.status, ["active" as PeerCallStatus]),
        gt(peerCallSessions.expiresAt, new Date())
      )
    )
    .orderBy(desc(peerCallSessions.createdAt))
    .limit(5);

  const [counsellorRows, studentRows] = await Promise.all([counsellorInitiated, studentInitiated]);

  const seen = new Set<string>();
  return [...counsellorRows, ...studentRows]
    .filter(row => { if (seen.has(row.id)) return false; seen.add(row.id); return true; })
    .map((row) => ({
      id: row.id,
      peerName: row.displayName?.trim() || "Your counsellor",
      universityName: row.universityName,
      createdAt: row.createdAt?.toISOString() ?? null,
      status: row.status,
    }));
}

export type ActiveCallSummary = {
  id: string;
  displayName: string;
  universityName: string;
};

export async function getActivePeerCallForUser(userId: string): Promise<ActiveCallSummary | null> {
  const db = getDb();
  if (!db) return null;

  // Join from both sides: caller OR peer participant
  const [row] = await db
    .select({
      id: peerCallSessions.id,
      status: peerCallSessions.status,
      universityName: universities.name,
      peerName: studentPeers.fullName,
      callerName: users.name,
      callerUserId: peerCallSessions.callerUserId,
      peerUserId: peerCallSessions.peerUserId,
    })
    .from(peerCallSessions)
    .innerJoin(studentPeers, eq(peerCallSessions.peerId, studentPeers.id))
    .innerJoin(universities, eq(peerCallSessions.universityId, universities.id))
    .leftJoin(users, eq(peerCallSessions.callerUserId, users.id))
    .where(
      and(
        inArray(peerCallSessions.status, OPEN_CALL_STATUSES),
        gt(peerCallSessions.expiresAt, new Date()),
        or(
          eq(peerCallSessions.callerUserId, userId),
          eq(peerCallSessions.peerUserId, userId)
        )
      )
    )
    .orderBy(desc(peerCallSessions.createdAt))
    .limit(1);

  if (!row) return null;

  const isPeer = row.peerUserId === userId;
  const displayName = isPeer
    ? (row.callerName?.trim() || "A student")
    : row.peerName;

  return { id: row.id, displayName, universityName: row.universityName };
}
