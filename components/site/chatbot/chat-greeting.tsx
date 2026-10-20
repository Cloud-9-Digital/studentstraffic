"use client";

import { useEffect, useRef, useState } from "react";

import { MiraMark } from "@/components/site/chatbot/mira-mark";
import { CHATBOT_GREETING } from "@/lib/chatbot/branding";

/**
 * The opening line, typed out.
 *
 * It costs nothing — the text is a constant, not a model call — but it sets the
 * register before the visitor has asked anything: the assistant is composing
 * rather than displaying. A greeting that simply appears reads as a banner;
 * one that arrives reads as someone answering.
 *
 * Anyone who prefers reduced motion gets it immediately.
 */
export function ChatGreeting() {
  const [revealed, setRevealed] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setRevealed(CHATBOT_GREETING.length);
      return;
    }

    let start: number | null = null;
    // Roughly 55 characters a second: fast enough not to make anyone wait,
    // slow enough to read as composition rather than a glitch.
    const charsPerMs = 55 / 1000;

    const step = (timestamp: number) => {
      start ??= timestamp;
      const next = Math.min(
        CHATBOT_GREETING.length,
        Math.floor((timestamp - start) * charsPerMs)
      );

      setRevealed(next);

      if (next < CHATBOT_GREETING.length) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const isTyping = revealed < CHATBOT_GREETING.length;

  return (
    <div className="flex gap-2.5">
      <MiraMark size={28} busy={isTyping} className="mt-0.5" />

      <p className="text-[0.9rem] leading-relaxed text-foreground">
        {CHATBOT_GREETING.slice(0, revealed)}
        {isTyping ? (
          <span
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-accent"
            aria-hidden="true"
          />
        ) : null}
      </p>
    </div>
  );
}
