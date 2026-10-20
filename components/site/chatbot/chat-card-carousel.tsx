"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ChatUniversityCardItem } from "@/components/site/chatbot/chat-university-card";
import type { ChatUniversityCard } from "@/lib/chatbot/types";
import { cn } from "@/lib/utils";

/**
 * University results, as a carousel once there are enough of them.
 *
 * In a 23rem column a stack of six cards buries the answer above it. A
 * snap-scrolling row keeps the whole result set one gesture away while the
 * prose stays on screen.
 *
 * Native scroll with snap points rather than a JS slider: it keeps keyboard
 * scrolling, trackpad and touch momentum, and screen-reader order for free.
 * The arrows are an affordance on top, hidden where the row does not overflow.
 */
export function ChatCardCarousel({ cards }: { cards: ChatUniversityCard[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function scrollByCard(direction: 1 | -1) {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.85), behavior: "smooth" });
  }

  function onScroll() {
    const node = scrollRef.current;
    if (!node) return;
    setAtStart(node.scrollLeft < 8);
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 8);
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <div key={card.slug} className="w-[13.5rem] shrink-0 snap-start">
            <ChatUniversityCardItem card={card} />
          </div>
        ))}
      </div>

      {[-1, 1].map((direction) => {
        const hidden = direction === -1 ? atStart : atEnd;

        return (
          <button
            key={direction}
            type="button"
            onClick={() => scrollByCard(direction as 1 | -1)}
            aria-label={direction === -1 ? "Previous results" : "More results"}
            tabIndex={hidden ? -1 : 0}
            className={cn(
              "absolute top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full",
              "border border-border bg-background/95 text-foreground shadow-sm backdrop-blur",
              "transition-opacity hover:bg-muted",
              direction === -1 ? "-left-1" : "-right-1",
              hidden && "pointer-events-none opacity-0"
            )}
          >
            {direction === -1 ? (
              <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
            ) : (
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
