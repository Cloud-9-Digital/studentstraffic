"use client";

import { useEffect, useState } from "react";
import { History, Loader2, MessageSquare } from "lucide-react";

export type ChatHistoryEntry = {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
};

/**
 * Past conversations.
 *
 * The transcripts were already being stored; this is the visitor's own way back
 * into them. Scoped server-side by the visitor cookie, so the list is only ever
 * this browser's conversations.
 *
 * Replaying one restores the text of the exchange, not the cards and charts —
 * those are produced by live catalogue lookups and would be stale if frozen, so
 * a restored conversation is a record of what was said rather than a snapshot
 * of fees that may since have changed. Asking again re-runs the lookups.
 */
function formatWhen(iso: string) {
  const date = new Date(iso);
  const elapsedMinutes = Math.round((Date.now() - date.getTime()) / 60_000);

  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedMinutes < 60 * 24) return `${Math.round(elapsedMinutes / 60)}h ago`;
  if (elapsedMinutes < 60 * 24 * 7)
    return `${Math.round(elapsedMinutes / (60 * 24))}d ago`;

  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function ChatHistory({
  activeId,
  onSelect,
}: {
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  const [entries, setEntries] = useState<ChatHistoryEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/chat/history", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { conversations?: ChatHistoryEntry[] }) =>
        setEntries(payload.conversations ?? [])
      )
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });

    return () => controller.abort();
  }, []);

  if (failed) {
    return (
      <p className="px-4 py-6 text-center text-[0.8rem] text-muted-foreground">
        Could not load your earlier chats.
      </p>
    );
  }

  if (entries === null) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-8 text-[0.8rem] text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        Loading your chats
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <History
          className="mx-auto mb-2 size-5 text-muted-foreground/50"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Your earlier conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-1 p-2">
      {entries.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            onClick={() => onSelect(entry.id)}
            aria-current={entry.id === activeId ? "true" : undefined}
            className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted ${
              entry.id === activeId ? "bg-muted" : ""
            }`}
          >
            <MessageSquare
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 text-[0.8rem] leading-snug text-foreground">
                {entry.title}
              </span>
              <span className="mt-0.5 block text-[0.65rem] text-muted-foreground">
                {formatWhen(entry.updatedAt)} · {Math.ceil(entry.messageCount / 2)}{" "}
                {Math.ceil(entry.messageCount / 2) === 1 ? "question" : "questions"}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
