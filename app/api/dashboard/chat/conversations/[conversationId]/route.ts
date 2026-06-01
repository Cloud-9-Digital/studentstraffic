import { NextResponse } from "next/server";

import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import {
  getAuthorizedGuideConversation,
  getGuideConversationSummaryForUser,
  listGuideConversationMessages,
} from "@/lib/guide-chat";

export async function GET(
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

  const [summary, messages] = await Promise.all([
    getGuideConversationSummaryForUser(conversationId, userId),
    listGuideConversationMessages(conversationId, userId),
  ]);

  return NextResponse.json({
    conversation: summary,
    messages,
  });
}
