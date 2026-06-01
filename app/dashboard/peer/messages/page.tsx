import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ChatWorkspace, type ChatStarterItem } from "@/components/dashboard/chat/chat-workspace";
import { env } from "@/lib/env";
import {
  listGuideConversationMessages,
  listGuideConversationStarters,
  listGuideConversations,
} from "@/lib/guide-chat";
import { resolveDbUserId } from "@/lib/server-session";

export const metadata = { title: "Guide Messages | Dashboard" };

export default async function PeerMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) redirect("/login");

  const params = await searchParams;
  const rawConversation = Array.isArray(params.conversation)
    ? params.conversation[0]
    : params.conversation;

  const [conversations, starterOptions] = await Promise.all([
    listGuideConversations(userId),
    listGuideConversationStarters(userId),
  ]);

  const requestedConversationId = Number(rawConversation);
  const fallbackConversationId =
    conversations[0]?.id ||
    starterOptions.find((option) => option.conversationId)?.conversationId ||
    null;

  const selectedConversationId =
    Number.isFinite(requestedConversationId) &&
    conversations.some((conversation) => conversation.id === requestedConversationId)
      ? requestedConversationId
      : fallbackConversationId;

  const initialMessages = selectedConversationId
    ? await listGuideConversationMessages(selectedConversationId, userId)
    : [];

  const starters: ChatStarterItem[] = starterOptions.map((option) => ({
    kind: "guide",
    label: option.studentName?.trim() || option.studentEmail,
    sublabel: option.studentEmail,
    badge:
      option.bookingStatus === "pending"
        ? "Pending"
        : option.bookingStatus === "accepted"
          ? "Accepted"
          : "Open",
    conversationId: option.conversationId,
    bookingId: option.bookingId,
    studentUserId: option.studentUserId,
  }));

  return (
    <ChatWorkspace
      role="guide"
      userId={userId}
      basePath="/dashboard/peer/messages"
      title="Guide Messages"
      subtitle="Live student conversations with a mobile-first thread view and an inbox that updates instantly."
      composerPlaceholder="Reply to {name}..."
      emptyStateTitle="Say hello first"
      emptyStateDescription="Introduce yourself, offer help, and keep the student conversation moving without leaving the page."
      initialConversations={conversations}
      initialStarters={starters}
      initialSelectedConversationId={selectedConversationId}
      initialMessages={initialMessages}
      realtimeEnabled={env.hasAblyRealtime}
      voiceEnabled={env.hasAgoraVoice}
    />
  );
}
