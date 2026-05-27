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

async function expireStaleRingingCalls(userId?: string) {
  const db = getDb();
  if (!db) return;

  const whereClause = userId
    ? and(
        eq(peerCallSessions.status, "ringing"),
        lt(peerCallSessions.expiresAt, new Date()),
        or(
          eq(peerCallSessions.peerUserId, userId),
          eq(peerCallSessions.callerUserId, userId)
        )
      )
    : and(eq(peerCallSessions.status, "ringing"), lt(peerCallSessions.expiresAt, new Date()));

  await db
    .update(peerCallSessions)
    .set({
      status: "expired",
      endedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(whereClause);
}

export async function getAuthorizedPeerCallSession(
  callId: string,
  userId: string
): Promise<AuthorizedPeerCallSession | null> {
  await expireStaleRingingCalls(userId);

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
  await expireStaleRingingCalls(userId);

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
