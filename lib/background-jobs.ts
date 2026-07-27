import "server-only";

import { and, asc, eq, inArray, lte, lt, or, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { backgroundJobs, leads } from "@/lib/db/schema";
import { env } from "@/lib/env";
import type { LeadSyncPayload } from "@/lib/lead-sync-payload";
import { syncLeadDestinations } from "@/lib/lead-sync";
import { getLeadDeliveryRoute } from "@/lib/lead-delivery-routes";
import { sendLeadWhatsAppMessage } from "@/lib/wati";

const LEAD_DELIVERY_JOB_KIND = "lead.delivery";
const DEFAULT_MAX_ATTEMPTS = 5;
const JOB_LEASE_TIMEOUT_MS = 10 * 60_000;

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
  /**
   * Newer lead submissions persist their delivery statuses while inserting
   * the lead. Older queued jobs omit this flag and retain the legacy status
   * updates when they are processed.
   */
  deliveryStateInitialized?: boolean;
};

type ProcessJobsOptions = {
  limit?: number;
  /** When set, only processes lead.delivery jobs whose lead originated from this sourcePath. */
  sourcePathFilter?: string;
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
    return undefined;
  }

  const [job] = await db
    .insert(backgroundJobs)
    .values({
      kind: LEAD_DELIVERY_JOB_KIND,
      payload,
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
    })
    .returning({ id: backgroundJobs.id });

  return job?.id;
}

async function processLeadDeliveryJob(payload: Record<string, unknown>) {
  if (!isLeadDeliveryJobPayload(payload)) {
    throw new Error("Invalid lead delivery job payload.");
  }

  await syncLeadDestinations(payload.leadId, payload.leadHandoffPayload, {
    skipPersistedSkipStates: payload.deliveryStateInitialized === true,
  });

  if (payload.whatsappPayload && !env.skipLeadWhatsapp) {
    const result = await sendLeadWhatsAppMessage(payload.whatsappPayload, payload.leadId, {
      skipInboundLeadCheck: true,
    });

    if (!result.ok && result.status !== "skipped") {
      throw new Error(result.error ?? "WhatsApp lead delivery failed.");
    }
  }

  const db = getDb();
  if (!db) {
    throw new Error("Database unavailable while checking lead delivery status.");
  }

  const [lead] = await db
    .select({
      sourcePath: leads.sourcePath,
      crmSyncStatus: leads.crmSyncStatus,
      leadSquaredSyncStatus: leads.leadSquaredSyncStatus,
      pabblySyncStatus: leads.pabblySyncStatus,
    })
    .from(leads)
    .where(eq(leads.id, payload.leadId))
    .limit(1);

  if (!lead) {
    throw new Error(`Lead ${payload.leadId} was not found after delivery.`);
  }

  const route = getLeadDeliveryRoute(lead.sourcePath);
  const failedDestinations = [
    route.crm && lead.crmSyncStatus !== "synced" && lead.crmSyncStatus !== "skipped"
      ? `crm:${lead.crmSyncStatus}`
      : null,
    route.leadSquared &&
    lead.leadSquaredSyncStatus !== "synced" &&
    lead.leadSquaredSyncStatus !== "skipped"
      ? `leadsquared:${lead.leadSquaredSyncStatus}`
      : null,
    route.pabbly && lead.pabblySyncStatus !== "synced" && lead.pabblySyncStatus !== "skipped"
      ? `pabbly:${lead.pabblySyncStatus}`
      : null,
  ].filter((value): value is string => Boolean(value));

  if (failedDestinations.length > 0) {
    throw new Error(`Lead delivery incomplete: ${failedDestinations.join(", ")}`);
  }
}

async function processJob(job: typeof backgroundJobs.$inferSelect) {
  if (job.kind !== LEAD_DELIVERY_JOB_KIND) {
    throw new Error(`Unsupported background job kind: ${job.kind}`);
  }

  await processLeadDeliveryJob(job.payload);
}

async function claimPendingJob(
  jobId: number,
  now: Date,
  staleLeaseCutoff: Date,
) {
  const db = getDb();

  if (!db) {
    return undefined;
  }

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
        eq(backgroundJobs.id, jobId),
        or(
          eq(backgroundJobs.status, "pending"),
          and(
            eq(backgroundJobs.status, "processing"),
            lt(backgroundJobs.lockedAt, staleLeaseCutoff),
          ),
        ),
      ),
    )
    .returning();

  return claimedJob;
}

async function processClaimedJob(job: typeof backgroundJobs.$inferSelect) {
  const db = getDb();

  if (!db) {
    return { processed: 0, failed: 0 };
  }

  try {
    await processJob(job);
    await db
      .update(backgroundJobs)
      .set({
        status: "completed",
        completedAt: new Date(),
        lockedAt: null,
        lastError: null,
        updatedAt: new Date(),
      })
      .where(eq(backgroundJobs.id, job.id));
    return { processed: 1, failed: 0 };
  } catch (error) {
    const attempts = job.attempts;
    const status = attempts >= job.maxAttempts ? "failed" : "pending";
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
      .where(eq(backgroundJobs.id, job.id));
    return { processed: 0, failed: 1 };
  }
}

/**
 * Handle the job just created by a lead submission. This preserves durable
 * retries, but avoids scanning the queue (and unrelated peer-call cleanup)
 * for every conversion.
 */
export async function processBackgroundJobById(jobId: number) {
  const now = new Date();
  const staleLeaseCutoff = new Date(now.getTime() - JOB_LEASE_TIMEOUT_MS);
  const claimedJob = await claimPendingJob(jobId, now, staleLeaseCutoff);

  if (!claimedJob) {
    return { processed: 0, failed: 0 };
  }

  return processClaimedJob(claimedJob);
}

export async function processPendingBackgroundJobs(options: ProcessJobsOptions = {}) {
  const db = getDb();

  if (!db) {
    return { processed: 0, failed: 0 };
  }

  const now = new Date();
  const staleLeaseCutoff = new Date(now.getTime() - JOB_LEASE_TIMEOUT_MS);
  const limit = Math.max(1, Math.min(options.limit ?? 10, 50));
  const pendingJobs = await db
    .select()
    .from(backgroundJobs)
    .where(
      and(
        or(
          and(eq(backgroundJobs.status, "pending"), lte(backgroundJobs.runAfter, now)),
          and(eq(backgroundJobs.status, "processing"), lt(backgroundJobs.lockedAt, staleLeaseCutoff))
        ),
        options.sourcePathFilter
          ? sql`${backgroundJobs.payload}->'leadHandoffPayload'->>'sourcePath' = ${options.sourcePathFilter}`
          : undefined
      )
    )
    .orderBy(asc(backgroundJobs.createdAt))
    .limit(limit);

  let processed = 0;
  let failed = 0;

  for (const pendingJob of pendingJobs) {
    const claimedJob = await claimPendingJob(
      pendingJob.id,
      now,
      staleLeaseCutoff,
    );

    if (!claimedJob) {
      continue;
    }

    const result = await processClaimedJob(claimedJob);
    processed += result.processed;
    failed += result.failed;
  }

  return { processed, failed };
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
