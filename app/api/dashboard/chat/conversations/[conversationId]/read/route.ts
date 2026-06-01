import { NextResponse } from "next/server";

import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import {
  getAuthorizedGuideConversation,
  getGuideConversationSummaryForUser,
  markGuideConversationRead,
} from "@/lib/guide-chat";
import { publishGuideChatUserEvent } from "@/lib/realtime/ably";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const userId = await requireDashboardRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId: rawConversationId } = await params;
  const conversationId = Number(rawConversationId);
  if (!Number.isFinite(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 422 });
  }

  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  await markGuideConversationRead(conversationId, userId);

  const [studentView, guideView] = await Promise.all([
    getGuideConversationSummaryForUser(conversationId, conversation.studentUserId),
    getGuideConversationSummaryForUser(conversationId, conversation.peerUserId),
  ]);

  await Promise.all([
    publishGuideChatUserEvent(conversation.studentUserId, "conversation.read", {
      conversationId,
      conversation: studentView,
      readerUserId: userId,
    }),
    publishGuideChatUserEvent(conversation.peerUserId, "conversation.read", {
      conversationId,
      conversation: guideView,
      readerUserId: userId,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    conversation: userId === conversation.peerUserId ? guideView : studentView,
  });
}
