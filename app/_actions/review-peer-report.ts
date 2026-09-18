"use server";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerReports } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export async function reviewPeerReportAction(form: FormData) {
  const admin = await requireAdminSession();
  const id = Number(form.get("reportId"));
  const status = String(form.get("status"));
  const notes = String(form.get("notes") || "").trim();
  if (!Number.isSafeInteger(id) || !["reviewing", "resolved", "dismissed"].includes(status) || notes.length < 5 || notes.length > 2000) throw new Error("Provide a valid status and resolution notes (5–2,000 characters).");
  await getDb()?.update(peerReports).set({ status, resolutionNotes: notes, reviewedByAdminId: admin.user.adminUserId, reviewedAt: new Date() }).where(eq(peerReports.id, id));
  revalidatePath("/admin/peer-reports");
}
