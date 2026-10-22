import { headers } from "next/headers";

import { getIpAddress } from "@/app/_actions/form-helpers";
import { shortlistUniversitiesForUser } from "@/lib/chatbot/actions";
import { isChatbotConfigured } from "@/lib/chatbot/config";
import { miraRequestSchema, runMiraTurn } from "@/lib/chatbot/respond";
import type { MiraUIMessage } from "@/lib/chatbot/ui-messages";
import { getChatViewerForUser } from "@/lib/chatbot/viewer";
import { getMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileValidationError, readJson } from "@/lib/mobile/http";

/**
 * Mira for the mobile app.
 *
 * The same turn as the website's /api/chat — same tools, prompt, transcript
 * and rate limits, from lib/chatbot/respond.ts — streamed as the same AI SDK
 * UI message stream. What differs is who is asking: a bearer token rather than
 * a browser session, and it is optional, because Mira answers anyone. A signed-in
 * student's conversation is stored against their account, she knows their
 * plans and shortlist, and saving to a shortlist works.
 */

export const maxDuration = 60;

const REFUSAL_CODES: Record<number, string> = {
  400: "invalid_message",
  429: "rate_limited",
};

export async function POST(request: Request) {
  if (!isChatbotConfigured()) {
    return mobileError(
      "unavailable",
      "Mira is not switched on yet. Please request a callback and a counsellor will help.",
      503
    );
  }

  const parsed = miraRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const [session, headerStore] = await Promise.all([
    getMobileSession(request),
    headers(),
  ]);
  const userId = session?.user.id ?? null;

  const result = await runMiraTurn({
    messages: parsed.data.messages as MiraUIMessage[],
    conversationId: parsed.data.conversationId,
    page: parsed.data.page,
    viewer: session ? await getChatViewerForUser(session.user) : null,
    visitorId: null,
    ipAddress: getIpAddress(headerStore),
    referrer: null,
    userAgent: headerStore.get("user-agent"),
    shortlist: (slugs) => shortlistUniversitiesForUser(userId, slugs),
  });

  if (!result.ok) {
    return mobileError(
      REFUSAL_CODES[result.status] ?? "chat_error",
      result.message,
      result.status
    );
  }

  return result.response;
}
