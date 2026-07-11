import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";
import { getAuthorizedGuideConversation, getGuideConversationSummaryForUser, sendGuideConversationMessage } from "@/lib/guide-chat";
import { sendGuideMessagePushNotification } from "@/lib/push-notifications";

export async function POST(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);
  const conversationId = Number((await params).conversationId);
  if (!Number.isFinite(conversationId)) return mobileError("validation_error", "Invalid conversation.", 422);
  const body = await readJson(request);
  const text = typeof body?.body === "string" ? body.body : "";
  const conversation = await getAuthorizedGuideConversation(conversationId, session.user.id);
  if (!conversation) return mobileError("not_found", "Conversation not found.", 404);
  const result = await sendGuideConversationMessage(conversationId, session.user.id, text);
  if (!result.ok) return mobileError("validation_error", result.error, 422);
  const summary = await getGuideConversationSummaryForUser(conversationId, session.user.id);
  await sendGuideMessagePushNotification(
    session.user.id === conversation.peerUserId ? conversation.studentUserId : conversation.peerUserId,
    { conversationId, senderName: summary?.displayName ?? "Students Traffic", body: text }
  );
  return mobileJson({ ok: true, conversation: summary });
}
