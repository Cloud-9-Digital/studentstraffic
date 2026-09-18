import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";
import { requestPeerBooking } from "@/lib/peer-connections";

export async function POST(request: Request, { params }: { params: Promise<{ peerId: string }> }) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in to send a request.", 401);
  const peerId = Number((await params).peerId);
  const body = await readJson(request);
  if (!Number.isSafeInteger(peerId) || peerId < 1 || typeof body?.message !== "string") {
    return mobileError("validation_error", "Please choose a guide and describe your question.", 422);
  }
  const result = await requestPeerBooking(peerId, session.user.id, body.message);
  return result.error ? mobileError("request_unavailable", result.error, 409) : mobileJson(result);
}
