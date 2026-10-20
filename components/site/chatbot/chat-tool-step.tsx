"use client";

import { Check, Loader2, TriangleAlert } from "lucide-react";

import { getToolLabel } from "@/lib/chatbot/tool-names";
import { cn } from "@/lib/utils";

/**
 * One visible lookup.
 *
 * Instead of a generic "thinking…" spinner, the dock shows what the assistant
 * is actually doing — "Shortlisting programmes", "Reading the university
 * profile" — because that is both true and reassuring: it tells the visitor the
 * answer is coming from our catalogue rather than being improvised. It is also
 * the honest failure surface: a lookup that found nothing says so.
 */
export function ChatToolStep({
  toolName,
  state,
  detail,
}: {
  toolName: string;
  /** AI SDK tool part states. */
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  /** Short outcome line, e.g. "3 of 201 matches" or "no match". */
  detail?: string;
}) {
  const isRunning = state === "input-streaming" || state === "input-available";
  const isError = state === "output-error";
  const label = getToolLabel(toolName, isRunning);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs",
        isError ? "text-destructive" : "text-muted-foreground"
      )}
    >
      <span className="grid size-4 shrink-0 place-items-center">
        {isRunning ? (
          <Loader2 className="size-3.5 animate-spin" strokeWidth={2} aria-hidden="true" />
        ) : isError ? (
          <TriangleAlert className="size-3.5" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Check className="size-3.5 text-accent" strokeWidth={2.5} aria-hidden="true" />
        )}
      </span>

      <span className={cn("truncate", isRunning && "animate-pulse")}>
        {label}
        {detail ? <span className="text-muted-foreground/70"> · {detail}</span> : null}
      </span>
    </div>
  );
}

/**
 * Groups one answer's steps.
 *
 * A bordered card here competed with the answer it belonged to. A single
 * hairline rule and muted type keep the lookups available to anyone who wants
 * to check them, without making the plumbing the loudest thing in the panel.
 */
export function ChatToolSteps({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 space-y-1.5">{children}</div>;
}
