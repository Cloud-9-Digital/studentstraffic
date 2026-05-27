import { requireMobileSession } from "@/lib/mobile/auth";
import { mobileError, mobileJson } from "@/lib/mobile/http";
import { getIncomingStudentCalls } from "@/lib/peer-calls";

export async function GET(request: Request) {
  const session = await requireMobileSession(request);
  if (!session) return mobileError("unauthorized", "Please sign in again.", 401);

  const calls = await getIncomingStudentCalls(session.user.id);
  return mobileJson({ calls });
}
