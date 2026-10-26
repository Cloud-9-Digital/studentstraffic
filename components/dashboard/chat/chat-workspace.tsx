"use client";

import { containsPeerContactDetails, PEER_CONTACT_POLICY_ERROR } from "@/lib/peer-contact-policy";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  Loader2,
  MessageSquare,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Plus,
  Search,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import type { GuideCallTimelineEvent, GuideChatMessage, GuideConversationSummary } from "@/lib/guide-chat";
import { getGuideChatRealtimeClient } from "@/lib/realtime/ably-browser";
import { cn } from "@/lib/utils";
import { deriveCallStatus, describeCallForThread } from "@/lib/calls/call-status";
import {
  buildThreadTimeline,
  formatCallTimeRange,
  groupHasMissedCall,
  summarizeCallGroup,
} from "@/lib/chat/call-events";
import { DashboardPage, EmptyState, PageHeader } from "@/components/dashboard/ui";
import { startPeerCallAction } from "@/app/_actions/start-peer-call";
import { startCallAsPeerAction } from "@/app/_actions/start-call-as-peer";
import { ConversationSafety } from "./conversation-safety";
import { CallOverlay } from "@/components/site/call-overlay";

type ViewerRole = "student" | "guide";

export type ChatStarterItem = {
  kind: ViewerRole;
  label: string;
  sublabel: string;
  badge: string;
  conversationId: number | null;
  peerId?: number;
  bookingId?: number;
  studentUserId?: string;
};

type DateValue = Date | string | null;

type LiveMessage = GuideChatMessage & {
  pending?: boolean;
  failed?: boolean;
  clientNonce?: string;
};

type ConversationResponse = {
  conversation: GuideConversationSummary | null;
  messages: GuideChatMessage[];
  calls: GuideCallTimelineEvent[];
};

type ConversationListResponse = {
  conversations: GuideConversationSummary[];
  starters: unknown[];
};

type RealtimePayload = {
  conversationId?: number;
  conversation?: GuideConversationSummary | null;
  message?: GuideChatMessage | null;
  readerUserId?: string;
  clientNonce?: string | null;
};

type ChatWorkspaceProps = {
  role: ViewerRole;
  userId: string;
  basePath: string;
  title: string;
  subtitle: string;
  composerPlaceholder: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  initialConversations: GuideConversationSummary[];
  initialStarters: ChatStarterItem[];
  initialSelectedConversationId: number | null;
  /** True when the URL asked for this conversation (?conversation=…). Only then does mobile open the
   * thread straight away; otherwise mobile lands on the inbox, while desktop still previews the first chat. */
  openThreadInitially?: boolean;
  initialMessages: GuideChatMessage[];
  initialCalls: GuideCallTimelineEvent[];
  realtimeEnabled: boolean;
  voiceEnabled?: boolean;
};

function formatConversationTime(date: DateValue) {
  if (!date) return "";
  const value = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - value.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return value.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (diffDays < 7) return value.toLocaleString("en-IN", { weekday: "short" });
  return value.toLocaleString("en-IN", { day: "numeric", month: "short" });
}

function formatMessageTime(date: DateValue) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function CallIcon({ call, className }: { call: GuideCallTimelineEvent; className?: string }) {
  const { outcome } = deriveCallStatus(call);
  if (outcome === "declined") return <PhoneOff className={className} aria-hidden />;
  if (outcome === "missed" || outcome === "no_answer" || outcome === "cancelled") {
    return <PhoneMissed className={className} aria-hidden />;
  }
  if (outcome === "completed") {
    return call.direction === "outgoing"
      ? <PhoneOutgoing className={className} aria-hidden />
      : <PhoneIncoming className={className} aria-hidden />;
  }
  return <PhoneCall className={className} aria-hidden />;
}

function DateSeparator({ date }: { date: DateValue }) {
  return (
    <div className="my-3 flex items-center gap-2" role="separator">
      <div className="h-px flex-1 bg-[#e5eeeb]" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9aada8]">{formatDateSeparator(date)}</span>
      <div className="h-px flex-1 bg-[#e5eeeb]" />
    </div>
  );
}

function formatDateSeparator(date: DateValue) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function isFirstInGroup(messages: LiveMessage[], index: number) {
  if (index === 0) return true;
  const cur = messages[index];
  const prev = messages[index - 1];
  if (cur.isMine !== prev.isMine) return true;
  if (!cur.createdAt || !prev.createdAt) return true;
  return new Date(cur.createdAt).getTime() - new Date(prev.createdAt).getTime() > 5 * 60 * 1000;
}

function isLastInGroup(messages: LiveMessage[], index: number) {
  if (index === messages.length - 1) return true;
  const cur = messages[index];
  const next = messages[index + 1];
  if (cur.isMine !== next.isMine) return true;
  if (!cur.createdAt || !next.createdAt) return true;
  return new Date(next.createdAt).getTime() - new Date(cur.createdAt).getTime() > 5 * 60 * 1000;
}

function getInitials(label: string) {
  return label
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function sortConversations(conversations: GuideConversationSummary[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0;
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

function upsertConversation(
  current: GuideConversationSummary[],
  nextConversation: GuideConversationSummary
) {
  const remaining = current.filter((c) => c.id !== nextConversation.id);
  return sortConversations([nextConversation, ...remaining]);
}

function getOutgoingMessageReceipt(
  message: Pick<LiveMessage, "pending" | "failed" | "createdAt" | "isMine">,
  counterpartLastReadAt: DateValue
) {
  if (!message.isMine) return null;
  if (message.failed) return { label: "Failed", icon: null };
  if (message.pending) return { label: "Sending", icon: Loader2 };
  const messageTime = message.createdAt ? new Date(message.createdAt).getTime() : null;
  const readTime = counterpartLastReadAt ? new Date(counterpartLastReadAt).getTime() : null;
  if (messageTime && readTime && readTime >= messageTime) return { label: "Read", icon: CheckCheck };
  return { label: "Sent", icon: Check };
}

export function ChatWorkspace({
  role,
  userId,
  basePath,
  title,
  subtitle,
  composerPlaceholder,
  emptyStateTitle,
  emptyStateDescription,
  initialConversations,
  initialStarters,
  initialSelectedConversationId,
  openThreadInitially = false,
  initialMessages,
  initialCalls,
  realtimeEnabled,
  voiceEnabled = false,
}: ChatWorkspaceProps) {
  const router = useRouter();
  const mobileMessageListRef = useRef<HTMLDivElement | null>(null);
  const desktopMessageListRef = useRef<HTMLDivElement | null>(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [starters, setStarters] = useState(initialStarters);
  const [selectedConversationId, setSelectedConversationId] = useState(initialSelectedConversationId);
  const [messages, setMessages] = useState<LiveMessage[]>(initialMessages);
  const [calls, setCalls] = useState<GuideCallTimelineEvent[]>(initialCalls);
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!initialSelectedConversationId || !openThreadInitially);
  const isSidebarVisibleRef = useRef(isSidebarVisible);
  useEffect(() => {
    isSidebarVisibleRef.current = isSidebarVisible;
  }, [isSidebarVisible]);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "offline">(
    realtimeEnabled ? "connecting" : "offline"
  );
  const [activeCall, setActiveCall] = useState<{ callId: string; displayName: string; universityName: string } | null>(null);
  const [callingPending, setCallingPending] = useState(false);
  const [expandedCallGroups, setExpandedCallGroups] = useState<Set<string>>(() => new Set());
  const [inboxQuery, setInboxQuery] = useState("");
  const [, startTransition] = useTransition();
  const lastMarkedConversationIdRef = useRef<number | null>(null);
  const selectedConversationIdRef = useRef<number | null>(initialSelectedConversationId);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? null;

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Lock body scroll when mobile thread overlay is open to prevent background scroll leak
  useEffect(() => {
    const overlayOpen =
      !!selectedConversation &&
      !isSidebarVisible &&
      window.matchMedia("(max-width: 1023px)").matches;
    if (overlayOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [selectedConversation, isSidebarVisible]);

  const replaceUrl = useCallback((conversationId: number | null) => {
    startTransition(() => {
      router.replace(
        conversationId ? `${basePath}?conversation=${conversationId}` : basePath,
        { scroll: false }
      );
    });
  }, [router, basePath]);

  const markAsRead = useCallback(async (conversationId: number) => {
    if (lastMarkedConversationIdRef.current === conversationId) return;
    const response = await fetch(
      `/api/dashboard/chat/conversations/${conversationId}/read`,
      { method: "POST", credentials: "same-origin" }
    ).catch(() => null);
    if (!response?.ok) return;
    lastMarkedConversationIdRef.current = conversationId;
    const data = (await response.json()) as { conversation: GuideConversationSummary | null };
    if (data.conversation) {
      setConversations((current) => upsertConversation(current, data.conversation!));
    }
  }, []);

  const loadConversation = useCallback(
    async (conversationId: number, options?: { syncUrl?: boolean; openThread?: boolean }) => {
      setLoadingConversation(true);
      try {
        const response = await fetch(
          `/api/dashboard/chat/conversations/${conversationId}`,
          { credentials: "same-origin", cache: "no-store" }
        );
        if (!response.ok) return;
        const data = (await response.json()) as ConversationResponse;
        if (data.conversation) {
          setConversations((current) => upsertConversation(current, data.conversation!));
        }
        setMessages(data.messages);
        setCalls(data.calls);
        setSelectedConversationId(conversationId);
        lastMarkedConversationIdRef.current = null;
        if (options?.syncUrl !== false) replaceUrl(conversationId);
        if (options?.openThread !== false) setIsSidebarVisible(false);
        await markAsRead(conversationId);
      } finally {
        setLoadingConversation(false);
      }
    }, [replaceUrl, markAsRead]
  );

  const refreshSidebar = useEffectEvent(async () => {
    const response = await fetch(`/api/dashboard/chat/conversations?role=${role}`, {
      credentials: "same-origin",
      cache: "no-store",
    }).catch(() => null);
    if (!response?.ok) return;
    const data = (await response.json()) as ConversationListResponse;
    setConversations(sortConversations(data.conversations));
  });

  const handleRealtimeEvent = useEffectEvent(
    (eventName: string, payload: RealtimePayload) => {
      if (payload.conversation) {
        setConversations((current) => upsertConversation(current, payload.conversation!));
        setStarters((current) =>
          current.map((starter) => {
            const starterMatchesConversation =
              (role === "student" && starter.peerId && starter.peerId === payload.conversation?.peerId) ||
              (starter.studentUserId &&
                starter.studentUserId === payload.conversation?.studentUserId);
            if (!starterMatchesConversation && starter.conversationId !== payload.conversationId) {
              return starter;
            }
            return { ...starter, conversationId: payload.conversationId ?? starter.conversationId };
          })
        );
      }

      if (
        payload.message &&
        payload.conversationId === selectedConversationId &&
        eventName === "message.created"
      ) {
        setMessages((current) => {
          if (payload.clientNonce) {
            const optimisticIndex = current.findIndex(
              (message) =>
                message.pending &&
                message.clientNonce === payload.clientNonce &&
                message.senderUserId === payload.message?.senderUserId
            );
            if (optimisticIndex >= 0) {
              return current.map((message, index) =>
                index === optimisticIndex ? payload.message! : message
              );
            }
          }
          if (current.some((message) => message.id === payload.message?.id)) return current;
          return [...current, payload.message!];
        });
        // On mobile the thread is only on screen when it is open; don't mark it read from the inbox.
        const threadOnScreen = !isSidebarVisibleRef.current || window.matchMedia("(min-width: 1024px)").matches;
        if (!payload.message.isMine && document.visibilityState === "visible" && threadOnScreen) {
          lastMarkedConversationIdRef.current = null;
          void markAsRead(payload.conversationId);
        }
      }

      if (eventName === "call.updated" && selectedConversationIdRef.current) {
        void loadConversation(selectedConversationIdRef.current, { syncUrl: false, openThread: false });
      }

      if (
        eventName === "conversation.read" &&
        payload.conversation &&
        payload.conversationId === selectedConversationId
      ) {
        setConversations((current) => upsertConversation(current, payload.conversation!));
      }
    }
  );

  useEffect(() => {
    if (mobileMessageListRef.current) {
      mobileMessageListRef.current.scrollTop = mobileMessageListRef.current.scrollHeight;
    }
    if (desktopMessageListRef.current) {
      desktopMessageListRef.current.scrollTop = desktopMessageListRef.current.scrollHeight;
    }
  }, [messages, calls]);

  useEffect(() => {
    if (!realtimeEnabled) return;
    const client = getGuideChatRealtimeClient(userId);
    if (!client) return;
    setConnectionState(client.connection.state === "connected" ? "connected" : "connecting");
    const onConnected = () => setConnectionState("connected");
    const onDisconnected = () => setConnectionState("offline");
    const onConnecting = () => setConnectionState("connecting");
    client.connection.on("connected", onConnected);
    client.connection.on("disconnected", onDisconnected);
    client.connection.on("suspended", onDisconnected);
    client.connection.on("failed", onDisconnected);
    client.connection.on("connecting", onConnecting);
    const channel = client.channels.get(`guide-chat:user:${userId}`);
    const onMessage = (message: { name: string; data: RealtimePayload }) => {
      handleRealtimeEvent(message.name, message.data);
    };
    channel.subscribe(onMessage).catch(() => setConnectionState("offline"));
    return () => {
      client.connection.off("connected", onConnected);
      client.connection.off("disconnected", onDisconnected);
      client.connection.off("suspended", onDisconnected);
      client.connection.off("failed", onDisconnected);
      client.connection.off("connecting", onConnecting);
      void channel.unsubscribe(onMessage);
    };
  }, [handleRealtimeEvent, realtimeEnabled, userId]);

  useEffect(() => {
    function syncFromServer() {
      void refreshSidebar();
      const currentConversationId = selectedConversationIdRef.current;
      if (currentConversationId) {
        lastMarkedConversationIdRef.current = null;
        void loadConversation(currentConversationId, { syncUrl: false, openThread: false });
      }
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") syncFromServer();
    }
    window.addEventListener("focus", syncFromServer);
    window.addEventListener("online", syncFromServer);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", syncFromServer);
      window.removeEventListener("online", syncFromServer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadConversation]);

  async function handleOpenStarter(starter: ChatStarterItem) {
    if (starter.conversationId) {
      await loadConversation(starter.conversationId);
      return;
    }
    const payload =
      starter.kind === "student"
        ? { role: "student", peerId: starter.peerId }
        : { role: "guide", bookingId: starter.bookingId };
    const response = await fetch("/api/dashboard/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!response?.ok) return;
    const data = (await response.json()) as {
      conversationId: number;
      conversation: GuideConversationSummary | null;
    };
    if (data.conversation) {
      setConversations((current) => upsertConversation(current, data.conversation!));
    }
    setStarters((current) =>
      current.map((item) =>
        item === starter ? { ...item, conversationId: data.conversationId } : item
      )
    );
    await loadConversation(data.conversationId);
  }

  async function handleSendMessage() {
    const body = draft.trim();
    if (!body || !selectedConversationId || !selectedConversation?.canMessage || sending) return;
    if (containsPeerContactDetails(body)) {
      setSendError(PEER_CONTACT_POLICY_ERROR);
      return;
    }
    setSendError(null);
    const optimisticId = Date.now();
    const clientNonce = `${selectedConversationId}-${optimisticId}`;
    const optimisticMessage: LiveMessage = {
      id: optimisticId,
      conversationId: selectedConversationId,
      senderUserId: userId,
      senderName: null,
      messageType: "text",
      body,
      createdAt: new Date(),
      isMine: true,
      pending: true,
      clientNonce,
    };
    setDraft("");
    setSending(true);
    setMessages((current) => [...current, optimisticMessage]);
    try {
      const response = await fetch(
        `/api/dashboard/chat/conversations/${selectedConversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ body, clientNonce }),
        }
      );
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(failure?.error || "Unable to send message");
      }
      const data = (await response.json()) as {
        conversation: GuideConversationSummary | null;
        message: GuideChatMessage | null;
        clientNonce?: string | null;
      };
      if (data.conversation) {
        setConversations((current) => upsertConversation(current, data.conversation!));
      }
      if (data.message) {
        setMessages((current) =>
          current
            .map((message) =>
              message.clientNonce === clientNonce ? data.message! : message
            )
            .filter(
              (message, index, allMessages) =>
                allMessages.findIndex((candidate) => candidate.id === message.id) === index
            )
        );
      }
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Unable to send message");
      setMessages((current) =>
        current.map((message) =>
          message.id === optimisticId
            ? { ...message, pending: false, failed: true }
            : message
        )
      );
    } finally {
      setSending(false);
    }
  }

  const availableStarters = starters.filter((starter) => starter.conversationId == null);

  async function handleStartCall() {
    if (!selectedConversation?.canCall || !voiceEnabled || callingPending) return;
    setCallingPending(true);
    try {
      let result: { callId?: string; error?: string };
      if (role === "student") {
        result = await startPeerCallAction(selectedConversation.peerId, selectedConversation.universitySlug);
      } else {
        if (!selectedConversation.bookingId) {
          result = { error: "No active booking found for this student." };
        } else {
          result = await startCallAsPeerAction(selectedConversation.bookingId);
        }
      }
      if (result.error) setSendError(result.error);
      if (result.callId) {
        setActiveCall({
          callId: result.callId,
          displayName: selectedConversation.displayName,
          universityName: selectedConversation.universityName,
        });
      }
    } finally {
      setCallingPending(false);
    }
  }

  // ─── Shared sub-renders ───────────────────────────────────────────────────

  function toggleCallGroup(key: string) {
    setExpandedCallGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function MessageBubbles({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) {
    const timeline = buildThreadTimeline(messages, calls);

    return (
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white">
        {timeline.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <EmptyState icon={MessageSquare} title={emptyStateTitle} description={emptyStateDescription} />
          </div>
        ) : (
          <div className="px-3 py-4 sm:px-5">
            {timeline.map((item, index) => {
              const previous = timeline[index - 1];
              const showDateSep = !previous ||
                Boolean(item.createdAt && previous.createdAt && new Date(item.createdAt).toDateString() !== new Date(previous.createdAt).toDateString());

              if (item.kind === "call") {
                const missed = deriveCallStatus(item.call).outcome === "missed";
                return (
                  <div key={item.key}>
                    {showDateSep && <DateSeparator date={item.createdAt} />}
                    <div className="my-2 flex justify-center">
                      <div
                        className={cn(
                          "inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-2xl px-3 py-1.5 text-center text-xs font-medium",
                          missed ? "bg-amber-50 text-amber-800" : "bg-[#edf5f2] text-[#35665e]"
                        )}
                      >
                        <CallIcon call={item.call} className="size-3.5 shrink-0" />
                        <span>{describeCallForThread(item.call)}</span>
                        <span className="text-[10px] text-[#7b938d]">{formatMessageTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.kind === "call-group") {
                const expanded = expandedCallGroups.has(item.key);
                const missed = groupHasMissedCall(item.calls);
                const listId = `${item.key}-calls`;
                return (
                  <div key={item.key}>
                    {showDateSep && <DateSeparator date={item.createdAt} />}
                    <div className="my-2 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => toggleCallGroup(item.key)}
                        aria-expanded={expanded}
                        aria-controls={listId}
                        className={cn(
                          "inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-2xl px-3 py-1.5 text-center text-xs font-medium transition",
                          missed
                            ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                            : "bg-[#edf5f2] text-[#35665e] hover:bg-[#e2efea]"
                        )}
                      >
                        {missed ? <PhoneMissed className="size-3.5 shrink-0" aria-hidden /> : <PhoneCall className="size-3.5 shrink-0" aria-hidden />}
                        <span>{summarizeCallGroup(item.calls)}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#7b938d]">
                          {formatCallTimeRange(item.calls[0].createdAt, item.calls[item.calls.length - 1].createdAt)}
                          <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} aria-hidden />
                        </span>
                      </button>
                      {expanded && (
                        <ul id={listId} className="mt-1.5 w-full max-w-xs space-y-1 rounded-xl border border-[#edf2f1] bg-[#fafcfb] px-3 py-2">
                          {item.calls.map((call) => (
                            <li key={call.id} className="flex items-center gap-2 text-xs text-[#4b5f59]">
                              <CallIcon call={call} className="size-3.5 shrink-0 text-[#7b938d]" />
                              <span className="min-w-0 flex-1">{describeCallForThread(call)}</span>
                              <span className="shrink-0 text-[10px] text-[#9aada8]">{formatMessageTime(call.createdAt)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              }

              const message = item.message;
              const messageIndex = messages.findIndex((candidate) => candidate.id === message.id);
              const first = isFirstInGroup(messages, messageIndex);
              const last = isLastInGroup(messages, messageIndex);
              const showMessageDateSep = showDateSep;
              const receipt = last
                ? getOutgoingMessageReceipt(message, selectedConversation!.counterpartLastReadAt)
                : null;

              return (
                <div key={item.key}>
                  {showMessageDateSep && <DateSeparator date={message.createdAt} />}

                  <div
                    className={cn(
                      "flex",
                      message.isMine ? "justify-end" : "justify-start",
                      first && !showMessageDateSep ? "mt-3" : "mt-0.5"
                    )}
                  >
                    <div className="max-w-[82%] sm:max-w-[72%]">
                      <div
                        className={cn(
                          "px-3.5 py-2.5 text-sm leading-relaxed",
                          message.isMine
                            ? cn(
                                "bg-[#0f3d37] text-white",
                                last ? "rounded-2xl rounded-br-sm" : "rounded-2xl"
                              )
                            : cn(
                                "bg-[#f3f4f6] text-[#0f1f1c]",
                                last ? "rounded-2xl rounded-bl-sm" : "rounded-2xl"
                              ),
                          message.failed && "opacity-60"
                        )}
                      >
                        <p className="whitespace-pre-wrap [overflow-wrap:anywhere]" title={message.createdAt ? new Date(message.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : undefined}>{message.body}</p>
                      </div>

                      {last && (
                        <div
                          className={cn(
                            "mt-1 flex items-center gap-1 text-[10px] text-[#9aada8]",
                            message.isMine ? "justify-end pr-1" : "justify-start pl-1"
                          )}
                        >
                          <span>{formatMessageTime(message.createdAt)}</span>
                          {receipt && (
                            <>
                              {receipt.icon && (
                                <receipt.icon
                                  className={cn(
                                    "size-3",
                                    receipt.label === "Read" && "text-emerald-500",
                                    receipt.label === "Sending" && "animate-spin",
                                    receipt.label === "Failed" && "text-red-400"
                                  )}
                                />
                              )}
                              {receipt.label === "Failed" && (
                                <span className="text-red-400">Failed to send</span>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function Composer({ paddingBottom }: { paddingBottom?: string }) {
    return (
      <div
        className="border-t border-[#edf2f1] bg-white px-3 py-3 sm:px-4"
        style={paddingBottom ? { paddingBottom } : undefined}
      >
        {sendError && <p role="alert" className="mb-2 text-sm text-red-600">{sendError}</p>}
        <div className="flex items-end gap-2 rounded-3xl border border-[#d9e6e2] bg-[#f4f9f7] py-1 pl-4 pr-1 transition focus-within:border-[#0f3d37]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0f3d37]/10">
          <textarea
            name="body"
            aria-label="Message"
            maxLength={2000}
            disabled={!selectedConversation?.canMessage}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setSendError(null); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSendMessage();
              }
            }}
            rows={1}
            placeholder={
              selectedConversation
                ? composerPlaceholder.replace("{name}", selectedConversation.displayName)
                : ""
            }
            className="flex-1 resize-none bg-transparent py-2.5 text-sm text-[#0f1f1c] outline-none placeholder:text-[#9aada8] [field-sizing:content] min-h-[36px] max-h-[120px]"
          />
          <button
            type="button"
            onClick={() => void handleSendMessage()}
            disabled={!draft.trim() || sending || !selectedConversation?.canMessage}
            aria-label="Send message"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-white shadow-sm transition-all duration-150 hover:bg-[#184a43] hover:shadow active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f3d37]/30 disabled:cursor-not-allowed disabled:bg-[#dfe8e5] disabled:text-[#9aada8] disabled:shadow-none disabled:hover:bg-[#dfe8e5] disabled:active:scale-100"
          >
            {sending ? (
              <Loader2 className="size-[18px] animate-spin" />
            ) : (
              <SendHorizontal className="size-[18px] translate-x-px" />
            )}
          </button>
        </div>
        {selectedConversation?.canMessage ? (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#7b8f89]">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
            Keep chats and calls on Students Traffic. Never share contact details or send money.
          </p>
        ) : (
          <p className="mt-2 text-center text-xs text-[#5d726b]">This conversation is closed, blocked or unavailable.</p>
        )}
      </div>
    );
  }

  function ConversationList() {
    const query = inboxQuery.trim().toLowerCase();
    const visibleConversations = query
      ? conversations.filter((conversation) =>
          `${conversation.displayName} ${conversation.universityName}`.toLowerCase().includes(query)
        )
      : conversations;
    const unreadTotal = conversations.reduce((sum, conversation) => sum + (conversation.unreadCount > 0 ? 1 : 0), 0);

    return (
      <>
        <div className="space-y-2.5 border-b border-[#eaeaea] px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0f1f1c]">Chats</p>
            {unreadTotal > 0 && (
              <span className="text-[11px] font-semibold text-emerald-700">{unreadTotal} unread</span>
            )}
          </div>
          {conversations.length > 4 && (
            <label className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-2.5 py-1.5 focus-within:border-[#0f3d37]">
              <Search className="size-3.5 shrink-0 text-[#9ca3af]" aria-hidden />
              <span className="sr-only">Search chats</span>
              <input
                type="search"
                value={inboxQuery}
                onChange={(event) => setInboxQuery(event.target.value)}
                placeholder="Search by name or university"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#0f1f1c] outline-none placeholder:text-[#9ca3af]"
              />
            </label>
          )}
        </div>

        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No chats yet"
            description={availableStarters.length > 0 ? "Start a chat with someone from the list below." : "Chats appear here once a call request is accepted."}
          />
        ) : visibleConversations.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#6b7280]">No chats match “{inboxQuery.trim()}”.</p>
        ) : (
          <div className="divide-y divide-[#eaeaea]">
            {visibleConversations.map((conversation) => {
              const isActive = conversation.id === selectedConversationId;
              const unread = conversation.unreadCount > 0;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => void loadConversation(conversation.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition",
                    isActive ? "bg-[#f0f7f5]" : "hover:bg-[#fafafa] active:bg-[#f0f7f5]"
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
                    {getInitials(conversation.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={cn("truncate text-sm text-[#0f1f1c]", unread ? "font-bold" : "font-semibold")}>
                        {conversation.displayName}
                      </p>
                      <span className={cn("shrink-0 text-[11px]", unread ? "font-semibold text-emerald-700" : "text-[#9ca3af]")}>
                        {formatConversationTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className={cn("min-w-0 flex-1 truncate text-xs", unread ? "font-semibold text-[#0f1f1c]" : "text-[#6b7280]")}>
                        {conversation.lastMessageText ?? conversation.subtitle}
                      </p>
                      {unread && (
                        <span
                          className="flex min-w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-px text-[10px] font-bold text-white"
                          aria-label={`${conversation.unreadCount} unread`}
                        >
                          {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {availableStarters.length > 0 && (
          <>
            <div className="border-t border-[#eaeaea] px-4 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">Start a chat</p>
            </div>
            <div className="divide-y divide-[#eaeaea]">
              {availableStarters.map((starter) => (
                <div
                  key={`${starter.kind}-${starter.peerId ?? starter.bookingId ?? starter.label}`}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-bold text-[#374151]">
                    {getInitials(starter.label)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">{starter.label}</p>
                    <p className="truncate text-xs text-[#6b7280]">{starter.sublabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleOpenStarter(starter)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#e5e7eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
                  >
                    <Plus className="size-3" />
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  /** Why calling is off in this chat, in words the user can act on; null when calling is available. */
  function callUnavailableReason(conversation: GuideConversationSummary): string | null {
    if (!voiceEnabled) return "Voice calls are switched off right now";
    if (conversation.canCall) return null;
    const viewerIsGuide = conversation.peerUserId === userId;
    if (conversation.connectionStatus === "blocked") return "Calls are off because this conversation is blocked";
    if (conversation.connectionStatus === "pending") {
      return viewerIsGuide
        ? `Accept ${conversation.displayName}'s request to call them`
        : `You can call once ${conversation.displayName} accepts your request`;
    }
    return "Calls are not available in this conversation";
  }

  function renderCallButton(size: "md" | "sm" = "md") {
    if (!selectedConversation) return null;
    const unavailableReason = callUnavailableReason(selectedConversation);
    return (
      <button
        type="button"
        onClick={() => {
          // Calling stays tappable when unavailable so people learn why, instead of a dead grey button.
          if (unavailableReason) {
            toast(unavailableReason);
            return;
          }
          void handleStartCall();
        }}
        disabled={callingPending || loadingConversation}
        aria-disabled={Boolean(unavailableReason)}
        aria-label={`Call ${selectedConversation.displayName}`}
        title={unavailableReason ?? "Start a voice call"}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full text-[#0f3d37] transition hover:bg-[#f0f5f4] active:bg-[#e5efec] disabled:opacity-40 aria-disabled:text-[#9aada8] aria-disabled:hover:bg-transparent",
          size === "sm" ? "size-9" : "size-9 border border-[#e5e7eb]"
        )}
      >
        {callingPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-[18px]" />}
      </button>
    );
  }

  return (
    <>
      {/* ── Mobile: full-screen thread ── */}
      {selectedConversation && !isSidebarVisible && (
        <div
          className="fixed inset-0 z-[60] flex h-dvh flex-col bg-white lg:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex shrink-0 items-center gap-2 border-b border-[#edf2f1] bg-white px-2 py-2 shadow-sm">
            <button
              type="button"
              aria-label="Back to chats"
              onClick={() => {
                setIsSidebarVisible(true);
                setSelectedConversationId(null);
                setMessages([]);
                setCalls([]);
                replaceUrl(null);
              }}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#5d726b] transition active:bg-[#f0f5f4]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
              {getInitials(selectedConversation.displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0f1f1c]">{selectedConversation.displayName}</p>
              {selectedConversation.universityName && (
                <p className="truncate text-xs text-[#6b7d77]">{selectedConversation.universityName}</p>
              )}
            </div>
            {renderCallButton("sm")}
            <ConversationSafety compact conversationId={selectedConversation.id} displayName={selectedConversation.displayName} blockedByMe={selectedConversation.blockedByMe} onChanged={() => void loadConversation(selectedConversation.id, { syncUrl: false })} />
          </div>

          {MessageBubbles({ listRef: mobileMessageListRef })}

          <div className="shrink-0" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {Composer({})}
          </div>
        </div>
      )}

      <DashboardPage wide>
        <PageHeader title={title} description={subtitle} />

        {/* ── Mobile: inbox ── */}
        <div className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white lg:hidden">
          {ConversationList()}
        </div>

        {/* ── Desktop: inbox left, thread right ── */}
        <div
          className="hidden overflow-hidden rounded-xl border border-[#eaeaea] bg-white lg:grid lg:grid-cols-[300px_minmax(0,1fr)]"
          style={{ height: "74vh", minHeight: "560px" }}
        >
          <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-[#eaeaea]" aria-label="Chats">
            {ConversationList()}
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden" aria-label="Conversation">
            {selectedConversation ? (
              <>
                <div className="flex shrink-0 items-center gap-3 border-b border-[#eaeaea] px-5 py-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
                    {getInitials(selectedConversation.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">{selectedConversation.displayName}</p>
                    {selectedConversation.universityName && (
                      <p className="truncate text-xs text-[#6b7280]">{selectedConversation.universityName}</p>
                    )}
                  </div>
                  {loadingConversation && <Loader2 className="size-4 shrink-0 animate-spin text-[#9ca3af]" aria-label="Loading" />}
                  {renderCallButton()}
                  <ConversationSafety conversationId={selectedConversation.id} displayName={selectedConversation.displayName} blockedByMe={selectedConversation.blockedByMe} onChanged={() => void loadConversation(selectedConversation.id, { syncUrl: false })} />
                </div>
                {MessageBubbles({ listRef: desktopMessageListRef })}
                <div className="shrink-0">{Composer({})}</div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={MessageSquare}
                  title="Select a chat"
                  description="Pick a chat on the left, or start a new one."
                />
              </div>
            )}
          </section>
        </div>
      </DashboardPage>

      {activeCall && (
        <CallOverlay
          callId={activeCall.callId}
          displayName={activeCall.displayName}
          universityName={activeCall.universityName}
          onClose={() => setActiveCall(null)}
        />
      )}
    </>
  );
}
