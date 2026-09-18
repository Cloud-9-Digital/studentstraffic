"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { submitGuideApplication, type JoinAsPeerState } from "@/lib/guide-application";
export type { JoinAsPeerState } from "@/lib/guide-application";
export async function joinAsPeerAction(formData: FormData): Promise<JoinAsPeerState> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return { error: "Please sign in before submitting your application." };
  return submitGuideApplication(formData, { id: String(session.user.id), email: session.user.email }, await headers());
}
