"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  parsePositiveId,
  parseStartApplicationInput,
} from "@/lib/dashboard/application-model";
import {
  startApplicationForUser,
  submitApplicationForUser,
  withdrawDraftForUser,
} from "@/lib/dashboard/applications";
import {
  getLeadPhoneForUser,
  handOffSubmittedApplication,
  normaliseLeadPhone,
  saveLeadPhoneForUser,
} from "@/lib/dashboard/application-lead";
import { resolveDbUserId } from "@/lib/server-session";

export type ApplicationActionState = { error: string | null };

/** The signed-in student's users.id, resolved by email (session.user.id is "1" for admin sessions). */
async function requireStudentId(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return resolveDbUserId(email);
}

const SIGNED_OUT = "Your session has expired. Sign in again and retry.";

export async function startApplicationAction(
  _previous: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const userId = await requireStudentId();
  if (!userId) return { error: SIGNED_OUT };

  const parsed = parseStartApplicationInput({
    universitySlug: formData.get("universitySlug"),
    programmeSlug: formData.get("programmeSlug"),
  });
  if (!parsed.ok) return { error: parsed.error };

  const result = await startApplicationForUser(userId, parsed.value);
  if (!result.ok) {
    return {
      error:
        result.error === "university_not_found"
          ? "This university is no longer listed. Remove it from your shortlist."
          : result.error === "invalid_programme"
            ? "That programme is not offered by this university. Pick another one."
            : "We could not start the application. Please try again.",
    };
  }

  redirect(`/dashboard/applications/${result.applicationId}`);
}

export async function submitApplicationAction(
  _previous: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const userId = await requireStudentId();
  if (!userId) return { error: SIGNED_OUT };

  const applicationId = parsePositiveId(formData.get("applicationId"));
  if (!applicationId) return { error: "Application not found." };

  // The counselling team follows up by phone, so a submitted application needs one.
  if (!(await getLeadPhoneForUser(userId))) {
    const phone = normaliseLeadPhone(formData.get("phone"));
    if (!phone) return { error: "Enter your phone number with country code, e.g. +91 98765 43210." };
    await saveLeadPhoneForUser(userId, phone);
  }

  const submitted = await submitApplicationForUser(userId, applicationId, formData.get("note"));
  if (!submitted) return { error: "This application was already submitted or no longer exists. Refresh the page." };

  try {
    await handOffSubmittedApplication(userId, applicationId);
  } catch (error) {
    // The application is saved either way; the lead can be resent from the applications table.
    console.error("[applications] lead handoff failed", { applicationId, error: error instanceof Error ? error.name : "unknown" });
  }

  refresh();
  return { error: null };
}

export async function withdrawDraftAction(applicationId: number): Promise<ApplicationActionState> {
  const userId = await requireStudentId();
  if (!userId) return { error: SIGNED_OUT };

  const id = parsePositiveId(applicationId);
  if (!id) return { error: "Application not found." };

  const withdrawn = await withdrawDraftForUser(userId, id);
  if (!withdrawn) return { error: "Only drafts can be withdrawn. Refresh the page." };

  redirect("/dashboard/applications");
}
