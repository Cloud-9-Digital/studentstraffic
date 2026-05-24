import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError } from "@/lib/mobile/http";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  return mobileError("disabled", "Applications are not available in the mobile app yet.", 501);
}

export async function PATCH(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  return mobileError("disabled", "Applications are not available in the mobile app yet.", 501);
}
