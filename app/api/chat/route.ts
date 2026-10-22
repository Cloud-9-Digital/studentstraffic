import { cookies, headers } from "next/headers";

import { getIpAddress } from "@/app/_actions/form-helpers";
import { shortlistUniversities } from "@/lib/chatbot/actions";
import { isChatbotConfigured } from "@/lib/chatbot/config";
import {
  miraRequestSchema,
  runMiraTurn,
  type MiraRequest,
} from "@/lib/chatbot/respond";
import type { MiraUIMessage } from "@/lib/chatbot/ui-messages";
import { getChatViewer } from "@/lib/chatbot/viewer";
import { logPublicRouteRequest } from "@/lib/route-observability";
import { getTrackingSnapshot } from "@/lib/tracking";

/**
 * The website's chat endpoint.
 *
 * Built on the AI SDK's UI message stream so the dock receives typed parts —
 * text, tool calls with their state, and our own data parts — instead of a
 * bespoke protocol. The turn itself (tools, grounding, transcript, rate limits)
 * is lib/chatbot/respond.ts, shared with the mobile app's endpoint; this route
 * only decides who is asking — a same-origin browser, its session and its
 * visitor cookie.
 */

export const maxDuration = 60;

const BOT_USER_AGENT_PATTERN =
  /bot|crawl|crawler|spider|slurp|preview|facebookexternalhit|telegram|discord|linkedinbot|google-extended|headless/i;

function isTrustedBrowserRequest(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!userAgent || BOT_USER_AGENT_PATTERN.test(userAgent)) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  logPublicRouteRequest({ route: "api/chat", request, sampleRate: 0.1 });

  // A crawler is turned away whether or not the assistant is configured, and
  // learns nothing about how it is configured.
  if (!isTrustedBrowserRequest(request)) {
    return errorResponse("Request blocked.", 403);
  }

  if (!isChatbotConfigured()) {
    return errorResponse(
      "The assistant is not switched on yet. Please use the WhatsApp or call buttons and a counsellor will help.",
      503
    );
  }

  let body: MiraRequest;

  try {
    body = miraRequestSchema.parse(await request.json());
  } catch {
    return errorResponse("I could not read that message.", 400);
  }

  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const tracking = getTrackingSnapshot(cookieStore, {});

  // Resolved before the conversation row is written so the transcript can be
  // attributed to the account rather than only to a browser cookie.
  const viewer = await getChatViewer();

  const result = await runMiraTurn({
    messages: body.messages as MiraUIMessage[],
    conversationId: body.conversationId,
    page: body.page,
    viewer,
    visitorId: tracking.visitorId ?? null,
    ipAddress: getIpAddress(headerStore),
    referrer: headerStore.get("referer"),
    userAgent: headerStore.get("user-agent"),
    shortlist: shortlistUniversities,
  });

  return result.ok ? result.response : errorResponse(result.message, result.status);
}
