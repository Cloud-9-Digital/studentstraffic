"use server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { resolveDbUserId } from "@/lib/server-session";
import { changePeerConnection, type ConnectionOperation } from "@/lib/peer-connections";
export type RespondToBookingResult = { success?: boolean; error?: string };
async function respond(bookingId: number, operation: ConnectionOperation): Promise<RespondToBookingResult> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Please sign in again." };
  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return { error: "Account not found." };
  const result = await changePeerConnection(bookingId, userId, operation);
  revalidatePath("/dashboard", "layout");
  return result;
}
export async function acceptBookingAction(id: number) { return respond(id, "accept"); }
export async function declineBookingAction(id: number) { return respond(id, "decline"); }
export async function cancelBookingAction(id: number) { return respond(id, "cancel"); }
