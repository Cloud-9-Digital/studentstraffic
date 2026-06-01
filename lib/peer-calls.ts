import "server-only";

import { and, desc, eq, gt, inArray, lt, or } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";
import type { PeerCallStatus } from "@/lib/data/types";

const OPEN_CALL_STATUSES: PeerCallStatus[] = ["ringing", "active"];

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

  const [expiredRingingCalls, endedActiveCalls] = await Promise.all([
    db.update(peerCallSessions)
      .set({ status: "expired", endedAt: now, updatedAt: now })
      .where(ringingWhere),
    db.update(peerCallSessions)
      .set({ status: "ended", endedAt: now, updatedAt: now })
      .where(activeWhere),
  ]);

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
