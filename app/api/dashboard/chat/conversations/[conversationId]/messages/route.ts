import { NextResponse } from "next/server";

import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import {
  getAuthorizedGuideConversation,
  getGuideConversationSummaryForUser,
  listGuideConversationMessages,
  sendGuideConversationMessage,
} from "@/lib/guide-chat";

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

  const result = await sendGuideConversationMessage(conversationId, userId, text, clientNonce || undefined);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 });
  const [summary, messages] = await Promise.all([
    getGuideConversationSummaryForUser(conversationId, userId),
    listGuideConversationMessages(conversationId, userId),
  ]);
  return NextResponse.json({ ok: true, conversation: summary, message: messages.find(m => m.id === result.messageId) || null, clientNonce });
}
