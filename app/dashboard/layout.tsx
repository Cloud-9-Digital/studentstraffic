import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { studentPeers } from "@/lib/db/schema";
import { getIncomingPeerCalls } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";
import { DashboardSidebar, DashboardBottomNav, DashboardMobileHeader } from "@/components/dashboard/sidebar";
import { IncomingCallsFloating } from "@/components/dashboard/incoming-calls-floating";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let isPeerWithVoice = false;
  let initialCalls: Awaited<ReturnType<typeof getIncomingPeerCalls>> = [];

  if (env.hasAgoraVoice && session.user.email) {
    const db = getDb();
    const userId = await resolveDbUserId(session.user.email);
    if (db && userId) {
      const [peer] = await db
        .select({ id: studentPeers.id })
        .from(studentPeers)
        .where(eq(studentPeers.peerUserId, userId))
        .limit(1);

      if (peer) {
        isPeerWithVoice = true;
        initialCalls = await getIncomingPeerCalls(userId);
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardMobileHeader />
        <main className="flex-1 p-6 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardBottomNav />

      {/* Floating incoming-call dialog — only for peer guides with voice enabled */}
      {isPeerWithVoice && (
        <IncomingCallsFloating initialCalls={initialCalls} />
      )}
    </div>
  );
}
