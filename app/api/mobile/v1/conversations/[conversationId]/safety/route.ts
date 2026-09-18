import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson, readJson } from "@/lib/mobile/http";
import { handlePeerSafetyRequest } from "@/lib/peer-safety-request";
export async function POST(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in.", 401);
  const id = Number((await params).conversationId);
  if (!Number.isSafeInteger(id) || id < 1) return mobileError("invalid", "Invalid conversation.", 422);
  const result = await handlePeerSafetyRequest(id, session.user.id, await readJson(request));
  return result.error ? mobileError("invalid", result.error, 422) : mobileJson(result);
}
