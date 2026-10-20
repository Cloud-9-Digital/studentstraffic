"use client";

import { CHATBOT_GREETING } from "@/lib/chatbot/branding";

/**
 * The opening line.
 *
 * Rendered plainly rather than typed out: an animation on a constant string is
 * a small lie about work being done, and it makes the visitor wait to read
 * something we already knew we would say. It is also top-aligned, in the same
 * column the answers use, so the first real reply continues the thread instead
 * of displacing something that was floating in the middle of the panel.
 */
export function ChatGreeting() {
  return (
    <div className="px-4 py-5">
      <p className="text-[0.95rem] leading-relaxed text-foreground">
        {CHATBOT_GREETING}
      </p>
    </div>
  );
}
