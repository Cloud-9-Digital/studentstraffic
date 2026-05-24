"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import {
  processPendingBackgroundJobs,
  retryBackgroundJobs,
  retryFailedBackgroundJobs,
} from "@/lib/background-jobs";

export type LeadDeliveryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const jobSchema = z.object({
  jobId: z.coerce.number().int().positive(),
});

const initialState: LeadDeliveryActionState = {
  status: "idle",
};

export async function processLeadDeliveryQueueAction(
  prevState: LeadDeliveryActionState = initialState,
): Promise<LeadDeliveryActionState> {
  void prevState;
  await requireAdminSession();

  try {
    const result = await processPendingBackgroundJobs({ limit: 10 });
    revalidatePath("/admin/lead-delivery");

    return {
      status: "success",
      message: `Processed ${result.processed} job${result.processed === 1 ? "" : "s"}; ${result.failed} failed.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not process the queue.",
    };
  }
}

export async function retryFailedLeadDeliveryJobsAction(
  prevState: LeadDeliveryActionState = initialState,
): Promise<LeadDeliveryActionState> {
  void prevState;
  await requireAdminSession();

  try {
    const result = await retryFailedBackgroundJobs(25);
    revalidatePath("/admin/lead-delivery");

    return {
      status: "success",
      message: `Queued ${result.queued} failed job${result.queued === 1 ? "" : "s"} for retry.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not retry failed jobs.",
    };
  }
}

export async function retryLeadDeliveryJobAction(
  prevState: LeadDeliveryActionState = initialState,
  formData: FormData,
): Promise<LeadDeliveryActionState> {
  void prevState;
  await requireAdminSession();

  const parsed = jobSchema.safeParse({
    jobId: formData.get("jobId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid job selection.",
    };
  }

  try {
    const result = await retryBackgroundJobs([parsed.data.jobId]);
    revalidatePath("/admin/lead-delivery");

    return {
      status: "success",
      message:
        result.queued === 1
          ? `Queued job #${parsed.data.jobId} for retry.`
          : "No matching job was queued.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not retry job.",
    };
  }
}
