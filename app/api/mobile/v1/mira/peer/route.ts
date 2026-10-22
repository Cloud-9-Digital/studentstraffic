import { capturePeerRequest, peerRequestSchema } from "@/lib/peer-request-capture";
import { getMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, mobileValidationError, readJson } from "@/lib/mobile/http";

/**
 * Introductions to a current student, requested from Mira in the mobile app.
 *
 * The same capture as the website's form (lib/peer-request-capture.ts): a
 * counsellor brokers the introduction, so it reaches every student Mira can
 * see — including those with no app account, whom the in-app guide directory
 * cannot list. As on the web, Mira only opens the form; the student submits it.
 */
export async function POST(request: Request) {
  const parsed = peerRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) return mobileValidationError(parsed.error);

  const session = await getMobileSession(request);

  const result = await capturePeerRequest({
    ...parsed.data,
    clientContext: JSON.stringify({
      surface: "chatbot",
      channel: "mobile_app",
      ...(session ? { userId: session.user.id } : {}),
    }),
  });

  if (!result.ok) return mobileError("peer_request_rejected", result.error, 400);

  return mobileJson({ success: true, leadId: result.leadId }, { status: 201 });
}
