import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { studentPeers } from "@/lib/db/schema";
import {
  getGuideConversationSummaryForUser,
  getOrCreateGuideConversationForGuide,
  listGuideConversationStarters,
  listGuideConversations,
  getOrCreateGuideConversationForStudent,
  listStudentConversationCandidates,
  listStudentGuideConversations,
} from "@/lib/guide-chat";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);
  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);
  const [guideProfile] = await db.select({ id: studentPeers.id }).from(studentPeers).where(and(eq(studentPeers.peerUserId, session.user.id), eq(studentPeers.status, "active"))).limit(1);
  const requestedRole = new URL(request.url).searchParams.get("role");
  const role = requestedRole === "guide" && guideProfile ? "guide" : "student";

  if (role === "guide") {
    const [conversations, rawStarters] = await Promise.all([listGuideConversations(session.user.id), listGuideConversationStarters(session.user.id)]);
    const starters = rawStarters.map((starter) => ({ peerId: starter.peerId, bookingId: starter.bookingId, peerName: starter.studentName?.trim() || "Student", universityName: starter.universityName, universitySlug: starter.universitySlug, bookingStatus: starter.bookingStatus, conversationId: starter.conversationId, lastMessageAt: starter.lastMessageAt }));
    return mobileJson({ role, capabilities: { guide: true }, conversations, starters });
  }

  const [conversations, starters] = await Promise.all([listStudentGuideConversations(session.user.id), listStudentConversationCandidates(session.user.id)]);
  return mobileJson({ role, capabilities: { guide: Boolean(guideProfile) }, conversations, starters });
}

export async function POST(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const body = await readJson(request);
  const role = body?.role === "guide" ? "guide" : "student";
  const value = Number(role === "guide" ? body?.bookingId : body?.peerId);
  if (!Number.isFinite(value)) return mobileError("validation_error", role === "guide" ? "bookingId is required." : "peerId is required.", 422);
  const conversationId = role === "guide" ? await getOrCreateGuideConversationForGuide(session.user.id, value) : await getOrCreateGuideConversationForStudent(session.user.id, value);
  if (!conversationId) return mobileError("not_found", "This conversation is unavailable.", 404);
  const conversation = await getGuideConversationSummaryForUser(conversationId, session.user.id);
  return mobileJson({ conversationId, conversation });
}
