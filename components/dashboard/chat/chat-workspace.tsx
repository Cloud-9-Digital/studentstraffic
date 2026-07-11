"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  Loader2,
  MessageSquare,
  PhoneCall,
  Plus,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { GuideCallTimelineEvent, GuideChatMessage, GuideConversationSummary } from "@/lib/guide-chat";
import { getGuideChatRealtimeClient } from "@/lib/realtime/ably-browser";
import { cn } from "@/lib/utils";
import { startPeerCallAction } from "@/app/_actions/start-peer-call";
import { startCallAsPeerAction } from "@/app/_actions/start-call-as-peer";
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

function formatCallDuration(seconds: number | null) {
  if (seconds == null) return null;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function getCallLabel(call: GuideCallTimelineEvent) {
  const duration = formatCallDuration(call.durationSeconds);
  if (call.answeredAt) return `${call.direction === "outgoing" ? "Outgoing" : "Incoming"} voice call${duration ? ` · ${duration}` : ""}`;
  if (call.status === "expired" || call.status === "missed") {
    return call.direction === "incoming" ? "Missed voice call" : "No answer";
  }
  if (call.status === "ringing") return `${call.direction === "outgoing" ? "Calling" : "Incoming"} voice call`;
  return call.direction === "outgoing" ? "Outgoing call cancelled" : "Missed voice call";
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

function needsDateSeparator(message: LiveMessage, prevMessage?: LiveMessage) {
  if (!prevMessage) return true;
  const a = message.createdAt ? new Date(message.createdAt) : null;
  const b = prevMessage.createdAt ? new Date(prevMessage.createdAt) : null;
  if (!a || !b) return false;
  return a.toDateString() !== b.toDateString();
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
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!initialSelectedConversationId);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "offline">(
    realtimeEnabled ? "connecting" : "offline"
  );
  const [activeCall, setActiveCall] = useState<{ callId: string; displayName: string; universityName: string } | null>(null);
  const [callingPending, setCallingPending] = useState(false);
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
    const overlayOpen = !!selectedConversation && !isSidebarVisible;
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

  const replaceUrl = useEffectEvent((conversationId: number | null) => {
    startTransition(() => {
      router.replace(
        conversationId ? `${basePath}?conversation=${conversationId}` : basePath,
        { scroll: false }
      );
    });
  });

  const markAsRead = useEffectEvent(async (conversationId: number) => {
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
  });

  const loadConversation = useEffectEvent(
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
    }
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
              (starter.peerId && starter.peerId === payload.conversation?.peerId) ||
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
        if (!payload.message.isMine && document.visibilityState === "visible") {
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
  }, [loadConversation, refreshSidebar]);

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
    if (!body || !selectedConversationId || sending) return;
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
      if (!response.ok) throw new Error("Unable to send message");
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
    } catch {
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
    if (!selectedConversation || callingPending) return;
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

  function MessageBubbles({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) {
    const timeline = [
      ...messages.map((message) => ({ kind: "message" as const, createdAt: message.createdAt, message })),
      ...calls.map((call) => ({ kind: "call" as const, createdAt: call.createdAt, call })),
    ].sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return leftTime - rightTime;
    });

    return (
      <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain bg-white">
        {timeline.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center px-6">
            <div className="max-w-xs text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[#edf2f1]">
                <MessageSquare className="size-7 text-[#94a9a4]" />
              </div>
              <p className="text-sm font-semibold text-[#33403d]">{emptyStateTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#90a19c]">{emptyStateDescription}</p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 sm:px-5">
            {timeline.map((item, index) => {
              const previous = timeline[index - 1];
              const showDateSep = !previous ||
                (item.createdAt && previous.createdAt && new Date(item.createdAt).toDateString() !== new Date(previous.createdAt).toDateString());

              if (item.kind === "call") {
                return (
                  <div key={item.call.id}>
                    {showDateSep && (
                      <div className="my-3 flex items-center gap-2">
                        <div className="h-px flex-1 bg-[#e5eeeb]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9aada8]">{formatDateSeparator(item.createdAt)}</span>
                        <div className="h-px flex-1 bg-[#e5eeeb]" />
                      </div>
                    )}
                    <div className="my-3 flex justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-[#edf5f2] px-3 py-1.5 text-xs font-medium text-[#35665e]">
                        <PhoneCall className="size-3.5" />
                        <span>{getCallLabel(item.call)}</span>
                        <span className="text-[10px] text-[#7b938d]">{formatMessageTime(item.createdAt)}</span>
                      </div>
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
                <div key={String(message.id)}>
                  {showMessageDateSep && (
                    <div className="my-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#e5eeeb]" />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9aada8]">
                        {formatDateSeparator(message.createdAt)}
                      </span>
                      <div className="h-px flex-1 bg-[#e5eeeb]" />
                    </div>
                  )}

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
                        <p className="whitespace-pre-wrap">{message.body}</p>
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
        <div className="flex items-end gap-2 rounded-[20px] border border-[#d9e6e2] bg-[#f4f9f7] px-3 py-1.5">
          <textarea
            name="body"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
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
            className="flex-1 resize-none bg-transparent py-2 text-sm text-[#0f1f1c] outline-none placeholder:text-[#9aada8] [field-sizing:content] min-h-[36px] max-h-[120px]"
          />
          <button
            type="button"
            onClick={() => void handleSendMessage()}
            disabled={!draft.trim() || sending}
            className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#0f3d37] text-white shadow-sm transition active:bg-[#184a43] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  function ConversationList() {
    return (
      <>
        <div className="flex items-center justify-between border-b border-[#eaeaea] px-4 py-3">
          <p className="text-sm font-semibold text-[#0f1f1c]">Inbox</p>
          {conversations.length > 0 && (
            <span className="text-[11px] font-semibold text-[#9ca3af]">
              {conversations.length}
            </span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <MessageSquare className="mx-auto size-8 text-[#d1d5db]" />
            <p className="mt-3 text-sm font-semibold text-[#374151]">No chats yet</p>
            <p className="mt-1 text-xs text-[#9ca3af]">Start a new chat from the list below.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eaeaea]">
            {conversations.map((conversation) => {
              const isActive = conversation.id === selectedConversationId;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => void loadConversation(conversation.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition",
                    isActive ? "bg-[#f0f7f5]" : "hover:bg-[#fafafa] active:bg-[#f0f7f5]"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
                      {getInitials(conversation.displayName)}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-emerald-500 px-1 py-px text-[9px] font-bold text-white">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={cn(
                          "truncate text-sm text-[#0f1f1c]",
                          conversation.unreadCount > 0 ? "font-bold" : "font-semibold"
                        )}
                      >
                        {conversation.displayName}
                      </p>
                      <span className="shrink-0 text-[10px] text-[#9ca3af]">
                        {formatConversationTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 truncate text-xs",
                        conversation.unreadCount > 0
                          ? "font-semibold text-[#0f1f1c]"
                          : "text-[#6b7280]"
                      )}
                    >
                      {conversation.lastMessageText ?? conversation.subtitle}
                    </p>
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

  return (
    <>
      {/* ── Mobile: full-screen thread overlay ── */}
      {selectedConversation && !isSidebarVisible && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-white xl:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#edf2f1] bg-white px-3 py-2.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setIsSidebarVisible(true);
                setSelectedConversationId(null);
                setMessages([]);
                replaceUrl(null);
              }}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#5d726b] transition active:bg-[#f0f5f4]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
              {getInitials(selectedConversation.displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0f1f1c]">
                {selectedConversation.displayName}
              </p>
              {selectedConversation.universityName && (
                <p className="truncate text-xs text-[#6b7d77]">
                  {selectedConversation.universityName}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => void handleStartCall()}
              disabled={callingPending}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#0f3d37] transition active:bg-[#f0f5f4] disabled:opacity-40"
            >
              {callingPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-5" />}
            </button>
          </div>

          {/* Messages */}
          {MessageBubbles({ listRef: mobileMessageListRef })}

          {/* Composer with safe-area bottom padding */}
          <div style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {Composer({})}
          </div>
        </div>
      )}

      {/* ── Main page content ── */}
      <div className="space-y-5">
        {/* Page header */}
        <h1 className="text-2xl font-bold text-[#0f1f1c]">{title}</h1>

        {/* ── Mobile: conversation list ── */}
        <div className="overflow-hidden rounded-xl border border-[#eaeaea] xl:hidden">
          {ConversationList()}
        </div>

        {/* ── Desktop: single flat two-panel container ── */}
        <div
          className="hidden xl:grid xl:grid-cols-[280px_minmax(0,1fr)] overflow-hidden rounded-xl border border-[#eaeaea]"
          style={{ height: "74vh", minHeight: "560px" }}
        >
          {/* Left sidebar */}
          <aside className="flex flex-col overflow-y-auto border-r border-[#eaeaea]">
            {ConversationList()}
          </aside>

          {/* Right thread */}
          <section className="flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Thread header */}
                <div className="flex shrink-0 items-center gap-3 border-b border-[#eaeaea] px-5 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f3d37] text-xs font-bold text-white">
                    {getInitials(selectedConversation.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">
                      {selectedConversation.displayName}
                    </p>
                    {selectedConversation.universityName && (
                      <p className="truncate text-xs text-[#6b7280]">
                        {selectedConversation.universityName}
                      </p>
                    )}
                  </div>
                  {loadingConversation && (
                    <Loader2 className="size-4 shrink-0 animate-spin text-[#9ca3af]" />
                  )}
                  {!loadingConversation && (
                    <button
                      type="button"
                      onClick={() => void handleStartCall()}
                      disabled={callingPending}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#374151] transition hover:bg-[#f3f4f6] disabled:opacity-40"
                    >
                      {callingPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-5" />}
                    </button>
                  )}
                </div>
                {MessageBubbles({ listRef: desktopMessageListRef })}
                {Composer({})}
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-6">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#f3f4f6]">
                    <MessageSquare className="size-7 text-[#9ca3af]" />
                  </div>
                  <p className="text-sm font-semibold text-[#374151]">Select a conversation</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">
                    Pick a thread or start a new one from the sidebar.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

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
