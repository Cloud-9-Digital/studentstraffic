"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, History, Mic, PenSquare, Square, X } from "lucide-react";

import { useChatDock } from "@/components/site/chatbot/chat-dock-context";
import { useSpeechInput } from "@/components/site/chatbot/use-speech-input";
import {
  ChatMessage,
  ChatThinking,
} from "@/components/site/chatbot/chat-message";
import { ChatGreeting } from "@/components/site/chatbot/chat-greeting";
import { ChatHistory } from "@/components/site/chatbot/chat-history";
import { MiraMark } from "@/components/site/chatbot/mira-mark";
import { CHATBOT_NAME } from "@/lib/chatbot/branding";
import type { MiraUIMessage } from "@/lib/chatbot/ui-messages";
import { cn } from "@/lib/utils";

const MAX_INPUT_CHARS = 1500;
const CONVERSATION_STORAGE_KEY = "st:chat:conversation";

function readStoredConversationId() {
  try {
    return window.sessionStorage.getItem(CONVERSATION_STORAGE_KEY) ?? undefined;
  } catch {
    // Private mode or blocked storage: a fresh conversation is fine.
    return undefined;
  }
}

/**
 * The docked assistant.
 *
 * Transport, streaming and message state come from `useChat`; everything this
 * component owns is presentation and the two things the SDK cannot know — the
 * stored conversation id, and when to stop pestering the visitor.
 */
/**
 * What the composer should invite, given where the visitor is and what has
 * happened so far.
 *
 * A single frozen "Ask about fees, intakes, eligibility" is wasted space: it
 * says the same thing on a course page, mid-conversation and while the
 * microphone is open. Derived from the path rather than rotated at random, so
 * it is stable across renders and never flickers.
 */
function getComposerPlaceholder({
  isListening,
  hasMessages,
  pathname,
}: {
  isListening: boolean;
  hasMessages: boolean;
  pathname: string;
}) {
  if (isListening) return "Listening…";
  if (hasMessages) return "Ask a follow-up…";

  if (/^\/(universities|university)\/[^/]+/.test(pathname)) {
    return "Ask about this university — fees, intakes, hostel…";
  }
  if (/^\/countries\/[^/]+/.test(pathname)) {
    return "Ask about studying here — costs, entry, universities…";
  }
  if (/^\/courses\/[^/]+/.test(pathname)) {
    return "Ask about this course — where to study it, what it costs…";
  }
  if (/^\/compare\//.test(pathname)) {
    return "Ask me to compare any two of these…";
  }
  if (/^\/(blog|news|guides)\//.test(pathname)) {
    return "Ask me anything about this…";
  }

  return "Ask about a course, a country, or your budget…";
}

export function ChatDock({ isOpen }: { isOpen: boolean }) {
  const { close, seedPrompt, clearSeedPrompt } = useChatDock();

  /**
   * The stored id from a previous page view, read once. Not a ref: it is needed
   * during render to pass to the lead form, and reading a ref there is both a
   * lint error and genuinely unsafe under concurrent rendering.
   */
  const [storedConversationId, setStoredConversationId] = useState<
    string | undefined
  >(() => (typeof window === "undefined" ? undefined : readStoredConversationId()));

  const [draft, setDraft] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  /**
   * Whether the view is following the stream.
   *
   * A ref, not state: it is read by the autoscroll effect and must not cause a
   * render of its own. Once the visitor scrolls up to read something, the
   * answer must stop dragging them back to the bottom — an assistant that
   * yanks the viewport mid-sentence is unreadable on a long answer.
   */
  const followRef = useRef(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  function handleBodyScroll() {
    const node = scrollRef.current;
    if (!node) return;

    const distanceFromBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight;
    const isFollowing = distanceFromBottom < 80;

    followRef.current = isFollowing;
    setShowJumpToLatest(!isFollowing);
  }

  function jumpToLatest() {
    const node = scrollRef.current;
    if (!node) return;
    followRef.current = true;
    setShowJumpToLatest(false);
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }

  // Dictation rewrites the tail of the draft as the transcript firms up, so
  // the text before the visitor started speaking is kept and only the spoken
  // part is replaced.
  const dictationBaseRef = useRef("");

  const speech = useSpeechInput({
    onTranscript: (text) => {
      const base = dictationBaseRef.current;
      setDraft(`${base}${base && !base.endsWith(" ") ? " " : ""}${text}`.slice(0, MAX_INPUT_CHARS));
    },
  });

  function toggleDictation() {
    if (speech.isListening) {
      speech.stop();
      return;
    }
    dictationBaseRef.current = draft;
    speech.start();
  }
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seededRef = useRef(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<MiraUIMessage>({
        api: "/api/chat",
        // Sent with every turn: the conversation to append to, and where the
        // visitor is reading so answers can be page-aware.
        //
        // The conversation id is resolved here, at send time, rather than
        // closed over: the streamed metadata carries it once a turn has
        // completed, and session storage carries it across page views. That
        // keeps the transport free of component state, so it never has to be
        // re-created mid-conversation.
        prepareSendMessagesRequest: ({ messages, id }) => ({
          body: {
            id,
            messages,
            conversationId:
              messages.findLast((message) => message.metadata?.conversationId)
                ?.metadata?.conversationId ?? readStoredConversationId(),
            page: {
              path: window.location.pathname,
              url: window.location.href,
              title: document.title,
            },
          },
        }),
      }),
    []
  );

  const { messages, sendMessage, status, stop, error, setMessages } =
    useChat<MiraUIMessage>({ transport });

  // The server returns the conversation id as message metadata. Derived rather
  // than stored, so there is no setState cascade when a turn completes.
  const conversationId =
    messages.findLast((message) => message.metadata?.conversationId)?.metadata
      ?.conversationId ?? storedConversationId;

  // Persisting is an effect, not render work. The transport reads this back at
  // send time, so a reopened dock continues the same stored transcript.
  useEffect(() => {
    if (!conversationId) return;

    try {
      window.sessionStorage.setItem(CONVERSATION_STORAGE_KEY, conversationId);
    } catch {
      // Non-fatal — the id stays in memory for this page view.
    }
  }, [conversationId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // A CTA elsewhere on the site can open the dock with a question already in
  // flight. Guarded so it fires once per seed.
  useEffect(() => {
    if (!seedPrompt || seededRef.current) return;
    seededRef.current = true;
    void sendMessage({ text: seedPrompt });
    clearSeedPrompt();
  }, [seedPrompt, sendMessage, clearSeedPrompt]);

  // Follow the stream only while the visitor is already at the bottom.
  useEffect(() => {
    if (!followRef.current) return;

    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const isBusy = status === "submitted" || status === "streaming";

  function submitDraft() {
    const text = draft.trim();
    if (!text || isBusy) return;
    followRef.current = true;
    setShowJumpToLatest(false);
    setDraft("");
    void sendMessage({ text });
  }

  /**
   * Replays a stored conversation. Text only: cards and charts come from live
   * catalogue lookups, so freezing them would show fees that may since have
   * changed. Asking again re-runs the lookups.
   */
  async function loadConversation(id: string) {
    setShowHistory(false);
    stop();

    try {
      const response = await fetch(`/api/chat/history?id=${encodeURIComponent(id)}`);
      if (!response.ok) return;

      const payload = (await response.json()) as {
        messages?: Array<{ role: "user" | "assistant"; content: string }>;
      };

      // Belt and braces: never let a malformed reply blank the conversation
      // the visitor is currently in.
      if (!Array.isArray(payload.messages)) return;

      setMessages(
        payload.messages
          .filter((message) => message.content.trim().length > 0)
          .map((message, index) => ({
            id: `${id}-${index}`,
            role: message.role,
            parts: [{ type: "text" as const, text: message.content }],
          }))
      );
      setStoredConversationId(id);
      try {
        window.sessionStorage.setItem(CONVERSATION_STORAGE_KEY, id);
      } catch {
        // Non-fatal.
      }
    } catch {
      // A failed replay leaves the current conversation untouched.
    }
  }

  function startOver() {
    setShowHistory(false);
    stop();
    setMessages([]);
    setStoredConversationId(undefined);
    try {
      window.sessionStorage.removeItem(CONVERSATION_STORAGE_KEY);
    } catch {
      // Non-fatal.
    }
  }

  const lastMessage = messages.at(-1);
  const awaitingFirstPart =
    isBusy &&
    (lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && lastMessage.parts.length === 0));

  return (
    <aside
      aria-label={`${CHATBOT_NAME} — study-abroad assistant`}
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
      className={cn(
        "fixed z-50 flex flex-col border-border bg-background",
        // Matches the page-push transition in chat-dock-context.tsx, so the
        // panel arriving and the content moving aside read as one movement.
        "transition-transform duration-300 ease-out motion-reduce:transition-none",
        isOpen ? "translate-x-0 translate-y-0" : "translate-y-full md:translate-x-full md:translate-y-0",
        // Phone: a sheet that leaves the header reachable.
        "inset-x-0 bottom-0 top-14 border-t",
        // Desktop: a true dock, flush to the edge. Above 1648px the page is
        // padded to sit beside it (see chat-dock-context.tsx); below that it
        // overlays, hence the shadow. This width MUST stay in step with that
        // padding.
        "md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[23rem] md:border-l md:border-t-0 md:shadow-2xl md:shadow-black/10"
      )}
    >
      <header className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border bg-background px-3.5">
        <MiraMark size={30} busy={isBusy} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9rem] font-semibold leading-tight tracking-tight text-foreground">
            {CHATBOT_NAME}
          </p>
          {/* Only the working state earns a second line. A standing "verified
              data" badge is a claim the answers should make for themselves. */}
          {isBusy ? (
            <p className="flex items-center gap-1.5 text-[0.7rem] leading-tight text-muted-foreground">
              <span
                className="size-1.5 shrink-0 animate-pulse rounded-full bg-accent"
                aria-hidden="true"
              />
              Checking our catalogue…
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => setShowHistory((current) => !current)}
            title={showHistory ? "Back to the conversation" : "Earlier chats"}
            aria-label={showHistory ? "Back to the conversation" : "Earlier chats"}
            aria-pressed={showHistory}
            className={cn(
              "grid size-9 place-items-center rounded-lg transition-colors hover:bg-muted hover:text-foreground",
              showHistory ? "bg-muted text-foreground" : "text-muted-foreground"
            )}
          >
            <History className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={startOver}
              title="Start a new conversation"
              aria-label="Start a new conversation"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <PenSquare className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={close}
            title="Close assistant"
            aria-label="Close assistant"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </header>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <ChatHistory activeId={conversationId} onSelect={loadConversation} />
        </div>
      ) : (
      <div
        ref={scrollRef}
        onScroll={handleBodyScroll}
        className={cn(
          "flex-1 overflow-y-auto overscroll-contain",
          messages.length > 0 && "space-y-6 px-4 py-5"
        )}
      >
        {messages.length === 0 ? <ChatGreeting /> : null}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            conversationId={conversationId}
            onLeadSubmitted={() => {
              /* The form swaps itself for a confirmation; nothing to do here. */
            }}
          />
        ))}

        {awaitingFirstPart ? <ChatThinking /> : null}

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-[0.85rem] text-foreground">
            Something went wrong on my side. Please try again, or use the
            WhatsApp button and a counsellor will pick it up.
          </div>
        ) : null}
      </div>
      )}

      {showJumpToLatest && !showHistory ? (
        <div className="relative">
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute -top-11 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[0.7rem] font-medium text-foreground shadow-md transition-colors hover:bg-muted"
          >
            <ArrowDown className="size-3" strokeWidth={2.5} aria-hidden="true" />
            Jump to latest
          </button>
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitDraft();
        }}
        className="shrink-0 border-t border-border bg-background px-3 pb-3 pt-3"
      >
        {/* .mira-composer paints the border from a gradient and animates it
            while a turn is in flight — see globals.css. */}
        <div
          data-busy={isBusy}
          className="mira-composer flex items-end gap-2 py-2 pl-4 pr-2"
        >
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(event) =>
              setDraft(event.target.value.slice(0, MAX_INPUT_CHARS))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitDraft();
              }
            }}
            rows={1}
            placeholder={getComposerPlaceholder({
              isListening: speech.isListening,
              hasMessages: messages.length > 0,
              pathname: typeof window === "undefined" ? "" : window.location.pathname,
            })}
            aria-label="Your question"
            // field-sizing grows the box with its content, so a long question
            // is readable without a scrollbar inside a one-line input.
            className="max-h-32 min-h-8 flex-1 resize-none self-center bg-transparent py-1 text-[0.9rem] leading-relaxed text-foreground outline-none [field-sizing:content] placeholder:text-muted-foreground"
          />

          {speech.isSupported && !isBusy ? (
            <button
              type="button"
              onClick={toggleDictation}
              title={speech.isListening ? "Stop dictation" : "Dictate your question"}
              aria-label={speech.isListening ? "Stop dictation" : "Dictate your question"}
              aria-pressed={speech.isListening}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full transition-colors",
                speech.isListening
                  ? "bg-accent/12 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Mic
                className={cn("size-4.5", speech.isListening && "animate-pulse")}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          ) : null}

          {isBusy ? (
            <button
              type="button"
              onClick={() => stop()}
              title="Stop generating"
              aria-label="Stop generating"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground/90 text-background transition-transform hover:bg-foreground active:scale-95"
            >
              <Square className="size-3" strokeWidth={3} fill="currentColor" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!draft.trim()}
              title="Send message"
              aria-label="Send message"
              // Always a filled shape so it reads as a button; when there is
              // nothing to send it mutes rather than turning into an outline,
              // which looked like an empty checkbox.
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full transition-all active:scale-95",
                draft.trim()
                  ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                  : "cursor-not-allowed bg-foreground/10 text-foreground/35"
              )}
            >
              <ArrowUp className="size-4.5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>

        <p className="mt-2 px-1 text-center text-[0.62rem] leading-none text-muted-foreground/60">
          Verify time-sensitive details with a counsellor.
        </p>
      </form>
    </aside>
  );
}
