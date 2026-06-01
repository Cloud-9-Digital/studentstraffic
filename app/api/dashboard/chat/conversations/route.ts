import { NextResponse } from "next/server";

import { requireDashboardRequestUserId } from "@/app/api/dashboard/chat/_lib";
import {
  getGuideConversationSummaryForUser,
  getOrCreateGuideConversationForGuide,
  getOrCreateGuideConversationForStudent,
  listGuideConversationStarters,
  listGuideConversations,
  listStudentConversationCandidates,
  listStudentGuideConversations,
} from "@/lib/guide-chat";
import { publishGuideChatUserEvent } from "@/lib/realtime/ably";

function getRole(request: Request) {
  const role = new URL(request.url).searchParams.get("role");
  return role === "guide" ? "guide" : "student";
}

export async function GET(request: Request) {
  const userId = await requireDashboardRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = getRole(request);
  if (role === "guide") {
    const [conversations, starters] = await Promise.all([
      listGuideConversations(userId),
      listGuideConversationStarters(userId),
    ]);
    return NextResponse.json({ conversations, starters });
  }

  const [conversations, starters] = await Promise.all([
    listStudentGuideConversations(userId),
    listStudentConversationCandidates(userId),
  ]);
  return NextResponse.json({ conversations, starters });
}

export async function POST(request: Request) {
  const userId = await requireDashboardRequestUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const role = body?.role === "guide" ? "guide" : "student";

  let conversationId: number | null = null;
  if (role === "guide") {
    const bookingId = Number(body?.bookingId);
    if (!Number.isFinite(bookingId)) {
      return NextResponse.json({ error: "bookingId is required." }, { status: 422 });
    }
    conversationId = await getOrCreateGuideConversationForGuide(userId, bookingId);
  } else {
    const peerId = Number(body?.peerId);
    if (!Number.isFinite(peerId)) {
      return NextResponse.json({ error: "peerId is required." }, { status: 422 });
    }
    conversationId = await getOrCreateGuideConversationForStudent(userId, peerId);
  }

  if (!conversationId) {
    return NextResponse.json({ error: "Conversation unavailable." }, { status: 404 });
  }

  const currentUserConversation = await getGuideConversationSummaryForUser(conversationId, userId);
  if (!currentUserConversation) {
    return NextResponse.json({ error: "Conversation unavailable." }, { status: 404 });
  }

  const [studentView, guideView] = await Promise.all([
    getGuideConversationSummaryForUser(conversationId, currentUserConversation.studentUserId),
    getGuideConversationSummaryForUser(conversationId, currentUserConversation.peerUserId),
  ]);

  await Promise.all([
    publishGuideChatUserEvent(currentUserConversation.studentUserId, "conversation.opened", {
      conversationId,
      conversation: studentView,
    }),
    publishGuideChatUserEvent(currentUserConversation.peerUserId, "conversation.opened", {
      conversationId,
      conversation: guideView,
    }),
  ]);

  return NextResponse.json({
    conversationId,
    conversation: currentUserConversation,
  });
}
