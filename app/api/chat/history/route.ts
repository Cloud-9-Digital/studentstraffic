import { cookies } from "next/headers";
import { z } from "zod";

import {
  getConversationForVisitor,
  listConversationsForVisitor,
} from "@/lib/chatbot/conversations";
import { logPublicRouteRequest } from "@/lib/route-observability";
import { getTrackingSnapshot } from "@/lib/tracking";

/**
 * Past conversations for the current visitor.
 *
 * Everything here is scoped by the visitor cookie rather than by the public
 * conversation id. The id lives in the browser, so treating it as proof of
 * ownership would make a guessed id enough to read someone else's transcript —
 * and these transcripts can contain a student's circumstances.
 *
 * With no `id`, returns the list. With one, returns that conversation's
 * messages so the dock can replay it.
 */

const querySchema = z.object({
  id: z.string().trim().min(1).max(64).optional(),
});

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin ?? referer;

  // A GET from our own page sends at least a Referer; a bare request has
  // neither and has no business reading transcripts.
  if (!source) return false;

  try {
    return new URL(source).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  logPublicRouteRequest({ route: "api/chat/history", request, sampleRate: 0.1 });

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request blocked." }, { status: 403 });
  }

  const parsed = querySchema.safeParse({
    id: new URL(request.url).searchParams.get("id") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const { visitorId } = getTrackingSnapshot(cookieStore, {});

  // No visitor cookie means nothing can be attributed to this browser. For a
  // listing that is an empty history, not an error; for a specific
  // conversation it is a miss, and it must NOT fall through to the list shape —
  // the dock would read a missing `messages` as "no messages" and blank the
  // conversation the visitor is in.
  if (!visitorId) {
    return parsed.data.id
      ? Response.json({ error: "Not found." }, { status: 404 })
      : Response.json({ conversations: [] });
  }

  if (parsed.data.id) {
    const messages = await getConversationForVisitor(parsed.data.id, visitorId);

    if (!messages) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    return Response.json({
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
        createdAt: message.createdAt?.toISOString() ?? null,
      })),
    });
  }

  const conversations = await listConversationsForVisitor(visitorId);

  return Response.json({
    conversations: conversations.map((conversation) => ({
      id: conversation.publicId,
      title: conversation.title?.slice(0, 120) ?? "New conversation",
      messageCount: conversation.messageCount,
      updatedAt: (conversation.lastMessageAt ?? conversation.createdAt).toISOString(),
    })),
  });
}
