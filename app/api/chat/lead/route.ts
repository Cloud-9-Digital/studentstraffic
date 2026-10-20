import { z } from "zod";

import { captureChatLead } from "@/lib/chatbot/lead-capture";
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

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/)
  .max(120)
  .optional();

const chatLeadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(32),
  userState: z.string().trim().min(2, "Please enter your state.").max(120),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email address.",
    }),
  conversationId: z.string().trim().min(1).max(64).optional(),
  countrySlug: slugSchema,
  courseSlug: slugSchema,
  universitySlug: slugSchema,
  page: z.object({
    path: z.string().trim().min(1).max(512),
    url: z.string().trim().max(1024).optional(),
    title: z.string().trim().max(300).optional(),
  }),
});

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

  let parsed: z.infer<typeof chatLeadSchema>;

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
