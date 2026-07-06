import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { studentPeers } from "@/lib/db/schema";
import { getIncomingPeerCalls, getActivePeerCallForUser, getIncomingStudentCalls } from "@/lib/peer-calls";
import { resolveDbUserId } from "@/lib/server-session";
import { DashboardSidebar, DashboardBottomNav, DashboardMobileHeader } from "@/components/dashboard/sidebar";
import { IncomingCallsFloating } from "@/components/dashboard/incoming-calls-floating";
import { IncomingStudentCallsFloating } from "@/components/dashboard/incoming-student-calls";
import { RejoinCallBanner } from "@/components/dashboard/rejoin-call-banner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let isPeerWithVoice = false;
  let initialCalls: Awaited<ReturnType<typeof getIncomingPeerCalls>> = [];
  let initialStudentCalls: Awaited<ReturnType<typeof getIncomingStudentCalls>> = [];
  let activeCall: Awaited<ReturnType<typeof getActivePeerCallForUser>> = null;
  let voiceUserId: string | null = null;

  if (env.hasAgoraVoice && session.user.email) {
    const db = getDb();
    const userId = await resolveDbUserId(session.user.email);
    if (db && userId) {
      voiceUserId = userId;
      const [peer] = await db
        .select({ id: studentPeers.id })
        .from(studentPeers)
        .where(eq(studentPeers.peerUserId, userId))
        .limit(1);

      const [incomingResult, studentIncomingResult, activeCallResult] = await Promise.all([
        peer ? getIncomingPeerCalls(userId) : Promise.resolve([]),
        getIncomingStudentCalls(userId),
        getActivePeerCallForUser(userId),
      ]);

      if (peer) {
        isPeerWithVoice = true;
        initialCalls = incomingResult;
      }
      initialStudentCalls = studentIncomingResult;
      activeCall = activeCallResult;
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
        <main className="flex-1 p-6 pb-nav-safe lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardBottomNav />

      {/* Rejoin banner — shown to any user (caller or peer) with an active call after a refresh */}
      {activeCall && <RejoinCallBanner call={activeCall} />}

      {/* Floating incoming-call dialog — only for peer guides with voice enabled */}
      {isPeerWithVoice && voiceUserId && (
        <IncomingCallsFloating initialCalls={initialCalls} userId={voiceUserId} />
      )}

      {/* Floating incoming-call dialog for students — when a guide calls them */}
      {env.hasAgoraVoice && initialStudentCalls.length > 0 && voiceUserId && (
        <IncomingStudentCallsFloating initialCalls={initialStudentCalls} userId={voiceUserId} />
      )}
    </div>
  );
}
