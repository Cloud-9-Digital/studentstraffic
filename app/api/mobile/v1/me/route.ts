import { eq, inArray, or } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { chatbotConversations, guideConversations, peerReports, studentPeers, users } from "@/lib/db/schema";
import { requireMobileSession, toMobileUser } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";
import { mobileProfilePatchSchema } from "@/lib/mobile/schemas";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  return mobileJson({ user: toMobileUser(session.user) });
}

export async function PATCH(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const parsed = mobileProfilePatchSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const [user] = await db
    .update(users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(users.id, session.user.id))
    .returning();

  return mobileJson({ user: toMobileUser(user) });
}

// Deletes the signed-in account. Sessions, push tokens, shortlists,
// applications, conversations and calls cascade from users. Safety reports
// restrict deletion of their conversation, so they go first; a guide profile
// linked to this account is taken out of the directory rather than left
// orphaned and still bookable. Mira chats only lose their user link on
// delete, so they are removed explicitly.
export async function DELETE(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const userId = session.user.id;
  const conversationIds = db
    .select({ id: guideConversations.id })
    .from(guideConversations)
    .where(or(eq(guideConversations.studentUserId, userId), eq(guideConversations.peerUserId, userId)));

  await db.batch([
    db
      .delete(peerReports)
      .where(or(eq(peerReports.reporterUserId, userId), inArray(peerReports.conversationId, conversationIds))),
    db
      .update(studentPeers)
      .set({ status: "inactive", acceptingRequests: false, updatedAt: new Date() })
      .where(eq(studentPeers.peerUserId, userId)),
    db.delete(chatbotConversations).where(eq(chatbotConversations.userId, userId)),
    db.delete(users).where(eq(users.id, userId)),
  ]);

  return mobileJson({ success: true });
}
