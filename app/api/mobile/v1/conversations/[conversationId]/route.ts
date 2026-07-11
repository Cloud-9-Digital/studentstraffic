import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { getAuthorizedGuideConversation, getGuideConversationSummaryForUser, listGuideConversationCallEvents, listGuideConversationMessages } from "@/lib/guide-chat";

export async function GET(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);
  const conversationId = Number((await params).conversationId);
  if (!Number.isFinite(conversationId)) return mobileError("validation_error", "Invalid conversation.", 422);
  const conversation = await getAuthorizedGuideConversation(conversationId, session.user.id);
  if (!conversation) return mobileError("not_found", "Conversation not found.", 404);
  const [summary, messages, calls] = await Promise.all([
    getGuideConversationSummaryForUser(conversationId, session.user.id),
    listGuideConversationMessages(conversationId, session.user.id),
    listGuideConversationCallEvents(conversationId, session.user.id),
  ]);
  return mobileJson({ conversation: summary, messages, calls });
}
