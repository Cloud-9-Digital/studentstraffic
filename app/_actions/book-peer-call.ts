"use server";
import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/server-session";
import { requestPeerBooking } from "@/lib/peer-connections";
export type BookPeerCallResult = { success?: boolean; alreadyBooked?: boolean; error?: string };
export async function bookPeerCallAction(peerId: number, message: string): Promise<BookPeerCallResult> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Please sign in to request a conversation." };
  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return { error: "Please sign in again." };
  return requestPeerBooking(peerId, userId, message);
}
