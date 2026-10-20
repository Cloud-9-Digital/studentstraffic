"use client";

import { useChatDock } from "@/components/site/chatbot/chat-dock-context";
import { MiraMark } from "@/components/site/chatbot/mira-mark";
import { CHATBOT_NAME } from "@/lib/chatbot/branding";
import { cn } from "@/lib/utils";

/**
 * The entry point.
 *
 * A labelled pill on desktop rather than a bare icon: a lone bubble asks the
 * visitor to guess what it opens, and "Ask Mira" tells them — which matters
 * here because most people do not expect a study-abroad site to answer
 * questions from its own catalogue. On a phone it collapses to the orb, where
 * a label would crowd the sticky counselling bar and bottom navigation.
 *
 * It fades and scales out rather than disappearing, so opening the dock reads
 * as one movement with the panel sliding in.
 */
export function ChatTrigger() {
  const { isOpen, open } = useChatDock();

  return (
    <button
      type="button"
      onClick={() => open()}
      aria-label={`Ask ${CHATBOT_NAME}`}
      aria-expanded={isOpen}
      tabIndex={isOpen ? -1 : 0}
      className={cn(
        "group fixed right-4 z-50 flex items-center overflow-hidden rounded-full md:right-6",
        "bg-[linear-gradient(120deg,var(--primary)_0%,var(--primary)_38%,var(--accent)_100%)]",
        "text-white shadow-lg shadow-primary/20 ring-1 ring-white/15",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-primary/25 hover:brightness-110 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        // Clear of the mobile sticky bar and bottom navigation.
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6",
        // Orb only on a phone; orb plus label from md up.
        "gap-0 p-1.5 md:gap-2.5 md:py-2 md:pl-2 md:pr-5",
        isOpen && "pointer-events-none translate-y-1 scale-90 opacity-0"
      )}
    >
      {/* Colour fields drifting and merging behind the label — see
          .mira-orb-cloud. The content is lifted above it so the text stays
          crisp over the movement. */}
      <span className="mira-orb-cloud" aria-hidden="true" />

      <span className="relative z-10 grid size-9 shrink-0 place-items-center md:size-8">
        <MiraMark size={26} />
      </span>

      <span className="relative z-10 hidden whitespace-nowrap text-sm font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] md:inline">
        Ask {CHATBOT_NAME}
      </span>
    </button>
  );
}
