import { NextResponse } from "next/server";

import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import {
  getAuthorizedGuideConversation,
  getGuideConversationSummaryForUser,
  listGuideConversationMessages,
  sendGuideConversationMessage,
} from "@/lib/guide-chat";
import { publishGuideChatUserEvent } from "@/lib/realtime/ably";
import { sendGuideMessagePushNotification } from "@/lib/push-notifications";

export async function POST(
  request: Request,
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

  const body = await request.json().catch(() => null);
  const text = typeof body?.body === "string" ? body.body : "";
  const clientNonce = typeof body?.clientNonce === "string" ? body.clientNonce : null;

  const conversation = await getAuthorizedGuideConversation(conversationId, userId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const result = await sendGuideConversationMessage(conversationId, userId, text);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  const [
    studentView,
    guideView,
    studentMessages,
    guideMessages,
  ] = await Promise.all([
    getGuideConversationSummaryForUser(conversationId, conversation.studentUserId),
    getGuideConversationSummaryForUser(conversationId, conversation.peerUserId),
    listGuideConversationMessages(conversationId, conversation.studentUserId),
    listGuideConversationMessages(conversationId, conversation.peerUserId),
  ]);

  const studentMessage = studentMessages[studentMessages.length - 1] ?? null;
  const guideMessage = guideMessages[guideMessages.length - 1] ?? null;

  await Promise.all([
    publishGuideChatUserEvent(conversation.studentUserId, "message.created", {
      conversationId,
      conversation: studentView,
      message: studentMessage,
      clientNonce,
    }),
    publishGuideChatUserEvent(conversation.peerUserId, "message.created", {
      conversationId,
      conversation: guideView,
      message: guideMessage,
      clientNonce,
    }),
    sendGuideMessagePushNotification(
      userId === conversation.peerUserId ? conversation.studentUserId : conversation.peerUserId,
      { conversationId, senderName: userId === conversation.peerUserId ? guideView?.displayName ?? "Student guide" : studentView?.displayName ?? "Student", body: text }
    ),
  ]);

  return NextResponse.json({
    ok: true,
    conversation: userId === conversation.peerUserId ? guideView : studentView,
    message: userId === conversation.peerUserId ? guideMessage : studentMessage,
    clientNonce,
  });
}
