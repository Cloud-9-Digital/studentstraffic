"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import {
  getOrCreateGuideConversationForGuide,
  getOrCreateGuideConversationForStudent,
  sendGuideConversationMessage,
} from "@/lib/guide-chat";
import { resolveDbUserId } from "@/lib/server-session";

async function requireDashboardUserId() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  return resolveDbUserId(session.user.email);
}

export async function openStudentGuideConversationAction(formData: FormData) {
  const userId = await requireDashboardUserId();
  if (!userId) {
    redirect("/login");
  }

  const peerId = Number(formData.get("peerId"));
  const redirectPath = String(formData.get("redirectPath") || "/dashboard/messages");

  if (!Number.isFinite(peerId)) {
    redirect(redirectPath);
  }

  const conversationId = await getOrCreateGuideConversationForStudent(userId, peerId);
  if (!conversationId) {
    redirect(redirectPath);
  }

  revalidatePath("/dashboard/messages");
  redirect(`/dashboard/messages?conversation=${conversationId}`);
}

export async function openGuideConversationFromBookingAction(formData: FormData) {
  const userId = await requireDashboardUserId();
  if (!userId) {
    redirect("/login");
  }

  const bookingId = Number(formData.get("bookingId"));
  const redirectPath = String(formData.get("redirectPath") || "/dashboard/peer/messages");

  if (!Number.isFinite(bookingId)) {
    redirect(redirectPath);
  }

  const conversationId = await getOrCreateGuideConversationForGuide(userId, bookingId);
  if (!conversationId) {
    redirect(redirectPath);
  }

  revalidatePath("/dashboard/peer/messages");
  redirect(`/dashboard/peer/messages?conversation=${conversationId}`);
}

export async function sendGuideMessageAction(formData: FormData) {
  const userId = await requireDashboardUserId();
  if (!userId) {
    redirect("/login");
  }

  const conversationId = Number(formData.get("conversationId"));
  const body = String(formData.get("body") || "");
  const redirectPath = String(formData.get("redirectPath") || "/dashboard/messages");

  if (!Number.isFinite(conversationId)) {
    redirect(redirectPath);
  }

  await sendGuideConversationMessage(conversationId, userId, body);

  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard/peer/messages");
  redirect(`${redirectPath}?conversation=${conversationId}`);
}
