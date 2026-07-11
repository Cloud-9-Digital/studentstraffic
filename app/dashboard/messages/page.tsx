import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ChatWorkspace, type ChatStarterItem } from "@/components/dashboard/chat/chat-workspace";
import { env } from "@/lib/env";
import {
  listGuideConversationMessages,
  listGuideConversationCallEvents,
  listStudentConversationCandidates,
  listStudentGuideConversations,
} from "@/lib/guide-chat";
import { resolveDbUserId } from "@/lib/server-session";

export const metadata = { title: "Messages | Dashboard" };

export default async function StudentMessagesPage({
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
    listStudentGuideConversations(userId),
    listStudentConversationCandidates(userId),
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

  const [initialMessages, initialCalls] = selectedConversationId
    ? await Promise.all([
        listGuideConversationMessages(selectedConversationId, userId),
        listGuideConversationCallEvents(selectedConversationId, userId),
      ])
    : [[], []];

  const starters: ChatStarterItem[] = starterOptions.map((option) => ({
    kind: "student",
    label: option.peerName,
    sublabel: option.universityName,
    badge:
      option.bookingStatus === "pending"
        ? "Pending"
        : option.bookingStatus === "accepted"
          ? "Ready"
          : "Open",
    conversationId: option.conversationId,
    peerId: option.peerId,
  }));

  return (
    <ChatWorkspace
      role="student"
      userId={userId}
      basePath="/dashboard/messages"
      title="Messages"
      subtitle="Live conversations with your guides, designed to feel fast and natural on mobile and desktop."
      composerPlaceholder="Message {name}..."
      emptyStateTitle="Start the conversation"
      emptyStateDescription="Ask about accommodation, budget, daily life, academics, or anything you want clarity on before the next step."
      initialConversations={conversations}
      initialStarters={starters}
      initialSelectedConversationId={selectedConversationId}
      initialMessages={initialMessages}
      initialCalls={initialCalls}
      realtimeEnabled={env.hasAblyRealtime}
      voiceEnabled={env.hasAgoraVoice}
    />
  );
}
