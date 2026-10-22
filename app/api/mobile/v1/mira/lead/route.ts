import { captureChatLead } from "@/lib/chatbot/lead-capture";
import { chatLeadSchema } from "@/lib/chatbot/lead-schema";
import { getMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";

/**
 * Callback requests from Mira's inline form in the mobile app.
 *
 * The same capture as the website's /api/chat/lead — the same `leads` row,
 * transcript notes, `chatbot` CTA variant and delivery job — so a lead raised
 * in the app goes down the existing pipeline unchanged. It is marked as coming
 * from the app, and carries the account when a student is signed in. As on the
 * web, the model can only open the form; the student's own submit lands here.
 */
export async function POST(request: Request) {
  const parsed = chatLeadSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const session = await getMobileSession(request);

  const result = await captureChatLead({
    ...parsed.data,
    channel: "mobile_app",
    userId: session?.user.id,
  });

  if (!result.ok) return mobileError("lead_rejected", result.error, 400);

  return mobileJson({ success: true, leadId: result.leadId ?? null }, { status: 201 });
}
