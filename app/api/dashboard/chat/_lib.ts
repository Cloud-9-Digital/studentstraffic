import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/server-session";

export async function requireDashboardRequestUserId() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  return resolveDbUserId(session.user.email);
}
