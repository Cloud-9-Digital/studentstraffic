"use client";

import { useSession } from "next-auth/react";

import { CHATBOT_GREETING, CHATBOT_NAME } from "@/lib/chatbot/branding";

/**
 * The opening line.
 *
 * Rendered plainly rather than typed out: an animation on a constant string is
 * a small lie about work being done, and it makes the visitor wait to read
 * something we already knew we would say. Top-aligned, in the same column the
 * answers use, so the first real reply continues the thread.
 *
 * A signed-in visitor is greeted by name. The rest of what we know about them
 * — budget, shortlist, exam score — reaches the model server-side rather than
 * being recited back at them here; being told your own budget is not a
 * welcome.
 */
export function ChatGreeting() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.trim().split(/\s+/)[0];

  return (
    <div className="px-4 py-5">
      <p className="text-[0.95rem] leading-relaxed text-foreground">
        {firstName
          ? `Hi ${firstName}, I'm ${CHATBOT_NAME}. Where would you like to pick up?`
          : CHATBOT_GREETING}
      </p>
    </div>
  );
}
