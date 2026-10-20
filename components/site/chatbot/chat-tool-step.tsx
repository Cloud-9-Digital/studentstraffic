"use client";

import { Check, Loader2, Search, TriangleAlert } from "lucide-react";

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
 * Groups the steps for one answer behind a single quiet line, so a long
 * lookup chain does not crowd out the answer itself.
 */
export function ChatToolSteps({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 space-y-1 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground/70">
        <Search className="size-3" strokeWidth={2} aria-hidden="true" />
        Checked our catalogue
      </div>
      {children}
    </div>
  );
}
