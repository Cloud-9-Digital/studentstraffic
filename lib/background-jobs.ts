import "server-only";

import { and, asc, eq, inArray, lte, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { backgroundJobs } from "@/lib/db/schema";
import type { LeadSyncPayload } from "@/lib/lead-sync-payload";
import { syncLeadDestinations } from "@/lib/lead-sync";
import { cleanupExpiredPeerCallSessions } from "@/lib/peer-calls";
import { sendLeadWhatsAppMessage } from "@/lib/wati";

const LEAD_DELIVERY_JOB_KIND = "lead.delivery";
const DEFAULT_MAX_ATTEMPTS = 5;

type LeadWhatsAppJobPayload = {
  fullName: string;
  phone: string;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  sourcePath: string;
};

type LeadDeliveryJobPayload = {
  leadId: number;
  leadHandoffPayload: LeadSyncPayload;
  whatsappPayload?: LeadWhatsAppJobPayload;
};

type ProcessJobsOptions = {
  limit?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLeadDeliveryJobPayload(
  payload: Record<string, unknown>
): payload is LeadDeliveryJobPayload {
  return (
    typeof payload.leadId === "number" &&
    isRecord(payload.leadHandoffPayload) &&
    (
      payload.whatsappPayload === undefined ||
      (
        isRecord(payload.whatsappPayload) &&
        typeof payload.whatsappPayload.fullName === "string" &&
        typeof payload.whatsappPayload.phone === "string" &&
        typeof payload.whatsappPayload.sourcePath === "string"
      )
    )
  );
}

function truncateError(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 1000);
  }

  return String(error).slice(0, 1000);
}

function getRetryDelayMs(attempts: number) {
  const minutes = Math.min(60, Math.max(1, 2 ** attempts));

  return minutes * 60_000;
}

export async function enqueueLeadDeliveryJob(payload: LeadDeliveryJobPayload) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.insert(backgroundJobs).values({
    kind: LEAD_DELIVERY_JOB_KIND,
    payload,
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
  });
}

async function processLeadDeliveryJob(payload: Record<string, unknown>) {
  if (!isLeadDeliveryJobPayload(payload)) {
    throw new Error("Invalid lead delivery job payload.");
  }

  const deliveries: Array<Promise<unknown>> = [
    syncLeadDestinations(payload.leadId, payload.leadHandoffPayload),
  ];

  if (payload.whatsappPayload) {
    deliveries.push(
      sendLeadWhatsAppMessage(payload.whatsappPayload, payload.leadId, {
        skipInboundLeadCheck: true,
      }),
    );
  }

  await Promise.allSettled(deliveries);
}

async function processJob(job: typeof backgroundJobs.$inferSelect) {
  if (job.kind !== LEAD_DELIVERY_JOB_KIND) {
    throw new Error(`Unsupported background job kind: ${job.kind}`);
  }

  await processLeadDeliveryJob(job.payload);
}

export async function processPendingBackgroundJobs(options: ProcessJobsOptions = {}) {
  const db = getDb();

  if (!db) {
    return { processed: 0, failed: 0, expiredCallsCleaned: 0 };
  }

  const now = new Date();
  const limit = Math.max(1, Math.min(options.limit ?? 10, 50));
  const expiredCallsCleaned = await cleanupExpiredPeerCallSessions();
  const pendingJobs = await db
    .select()
    .from(backgroundJobs)
    .where(
      and(
        eq(backgroundJobs.status, "pending"),
        lte(backgroundJobs.runAfter, now)
      )
    )
    .orderBy(asc(backgroundJobs.createdAt))
    .limit(limit);

  let processed = 0;
  let failed = 0;

  for (const pendingJob of pendingJobs) {
    const [claimedJob] = await db
      .update(backgroundJobs)
      .set({
        status: "processing",
        attempts: sql`${backgroundJobs.attempts} + 1`,
        lockedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(backgroundJobs.id, pendingJob.id),
          eq(backgroundJobs.status, "pending")
        )
      )
      .returning();

    if (!claimedJob) {
      continue;
    }

    try {
      await processJob(claimedJob);
      await db
        .update(backgroundJobs)
        .set({
          status: "completed",
          completedAt: new Date(),
          lastError: null,
          updatedAt: new Date(),
        })
        .where(eq(backgroundJobs.id, claimedJob.id));
      processed += 1;
    } catch (error) {
      const attempts = claimedJob.attempts;
      const status = attempts >= claimedJob.maxAttempts ? "failed" : "pending";
      const runAfter = new Date(Date.now() + getRetryDelayMs(attempts));

      await db
        .update(backgroundJobs)
        .set({
          status,
          runAfter,
          lockedAt: null,
          lastError: truncateError(error),
          updatedAt: new Date(),
        })
        .where(eq(backgroundJobs.id, claimedJob.id));
      failed += 1;
    }
  }

  return { processed, failed, expiredCallsCleaned };
}

export async function retryBackgroundJobs(jobIds: number[]) {
  const db = getDb();

  if (!db || jobIds.length === 0) {
    return { queued: 0 };
  }

  const uniqueJobIds = Array.from(new Set(jobIds));
  const updatedJobs = await db
    .update(backgroundJobs)
    .set({
      status: "pending",
      runAfter: new Date(),
      lockedAt: null,
      completedAt: null,
      lastError: null,
      updatedAt: new Date(),
    })
    .where(inArray(backgroundJobs.id, uniqueJobIds))
    .returning({ id: backgroundJobs.id });

  return { queued: updatedJobs.length };
}

export async function retryFailedBackgroundJobs(limit = 25) {
  const db = getDb();

  if (!db) {
    return { queued: 0 };
  }

  const failedJobs = await db
    .select({ id: backgroundJobs.id })
    .from(backgroundJobs)
    .where(eq(backgroundJobs.status, "failed"))
    .orderBy(asc(backgroundJobs.updatedAt))
    .limit(Math.max(1, Math.min(limit, 100)));

  return retryBackgroundJobs(failedJobs.map((job) => job.id));
}
