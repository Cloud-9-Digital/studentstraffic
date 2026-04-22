"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CardCarousel({
  heading,
  autoScroll = false,
  children,
}: {
  heading: string;
  autoScroll?: boolean;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = 16;
    const amount = card ? card.offsetWidth + gap : el.clientWidth / 2;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
    const atStart = el.scrollLeft <= 4;

    if (dir === "right" && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === "left" && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!autoScroll) {
      return;
    }

    const el = scrollRef.current;
    if (!el || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    if (!mediaQuery.matches) {
      return;
    }

    const interval = window.setInterval(() => {
      scroll("right");
    }, 2800);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoScroll]);

  return (
    <div className="space-y-3">
      {/* Heading row with arrows */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {heading}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </div>
  );
}

export function CarouselItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-[calc(50%-8px)] shrink-0 flex-col sm:w-[calc(33.333%-11px)]"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex flex-1 flex-col [&>*]:flex [&>*]:flex-1 [&>*]:flex-col">
        {children}
      </div>
    </div>
  );
}
