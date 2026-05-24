import "server-only";

import { count, desc, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { backgroundJobs, leads } from "@/lib/db/schema";

export type LeadDeliveryJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | string;

export type LeadDeliveryQueueRow = {
  id: number;
  kind: string;
  status: LeadDeliveryJobStatus;
  attempts: number;
  maxAttempts: number;
  runAfter: Date;
  lockedAt: Date | null;
  completedAt: Date | null;
  lastError: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  leadId: number | null;
  leadName: string | null;
  leadPhone: string | null;
  sourcePath: string | null;
};

function getPayloadLeadId(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const leadId = (payload as { leadId?: unknown }).leadId;
  return typeof leadId === "number" && Number.isFinite(leadId) ? leadId : null;
}

export async function getLeadDeliveryQueue({
  status,
  limit = 50,
}: {
  status?: string;
  limit?: number;
}) {
  const db = getDb();

  if (!db) {
    return {
      stats: [] as Array<{ status: string; count: number }>,
      rows: [] as LeadDeliveryQueueRow[],
      total: 0,
    };
  }

  const safeLimit = Math.max(1, Math.min(limit, 100));
  const whereClause = status ? eq(backgroundJobs.status, status) : undefined;

  const [totalRows, stats, jobs] = await Promise.all([
    db.select({ value: count() }).from(backgroundJobs).where(whereClause),
    db
      .select({
        status: backgroundJobs.status,
        count: sql<number>`count(*)::int`,
      })
      .from(backgroundJobs)
      .groupBy(backgroundJobs.status)
      .orderBy(backgroundJobs.status),
    db
      .select()
      .from(backgroundJobs)
      .where(whereClause)
      .orderBy(desc(backgroundJobs.createdAt))
      .limit(safeLimit),
  ]);

  const leadIds = jobs
    .map((job) => getPayloadLeadId(job.payload))
    .filter((leadId): leadId is number => leadId !== null);
  const leadRows = leadIds.length
    ? await db
        .select({
          id: leads.id,
          fullName: leads.fullName,
          phone: leads.phone,
          sourcePath: leads.sourcePath,
        })
        .from(leads)
        .where(inArray(leads.id, Array.from(new Set(leadIds))))
    : [];
  const leadsById = new Map(leadRows.map((lead) => [lead.id, lead]));

  return {
    stats,
    total: totalRows[0]?.value ?? 0,
    rows: jobs.map((job) => {
      const leadId = getPayloadLeadId(job.payload);
      const lead = leadId ? leadsById.get(leadId) : null;

      return {
        id: job.id,
        kind: job.kind,
        status: job.status,
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        runAfter: job.runAfter,
        lockedAt: job.lockedAt,
        completedAt: job.completedAt,
        lastError: job.lastError,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        leadId,
        leadName: lead?.fullName ?? null,
        leadPhone: lead?.phone ?? null,
        sourcePath: lead?.sourcePath ?? null,
      };
    }),
  };
}
