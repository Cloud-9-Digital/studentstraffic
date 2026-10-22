import { z } from "zod";

import { captureChatLead } from "@/lib/chatbot/lead-capture";
import { chatLeadSchema, type ChatLeadBody } from "@/lib/chatbot/lead-schema";
import { logPublicRouteRequest } from "@/lib/route-observability";

/**
 * Callback requests submitted from the chat's inline form.
 *
 * Separate from the streaming chat route on purpose: a lead write is a single
 * atomic action with a yes/no answer, and it must not be something the model
 * can trigger by itself. The model only ever asks for the *form* to be shown
 * (request_counselling_callback); the visitor's own submit reaches this route.
 */

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

export async function POST(request: Request) {
  logPublicRouteRequest({ route: "api/chat/lead", request, sampleRate: 1 });

  if (!isTrustedBrowserRequest(request)) {
    return Response.json({ error: "Request blocked." }, { status: 403 });
  }

  let parsed: ChatLeadBody;

  try {
    parsed = chatLeadSchema.parse(await request.json());
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? (error.issues[0]?.message ?? "Please check the form and try again.")
        : "Please check the form and try again.";

    return Response.json({ error: message }, { status: 400 });
  }

  const result = await captureChatLead(parsed);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({ ok: true });
}
