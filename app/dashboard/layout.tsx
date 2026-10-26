import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { getIncomingPeerCalls, getActivePeerCallForUser, getIncomingStudentCalls } from "@/lib/peer-calls";
import { getDashboardViewer } from "@/lib/dashboard/nav-counts";
import { EMPTY_NAV_COUNTS } from "@/lib/dashboard/nav";
import {
  DashboardSidebar,
  DashboardBottomNav,
  DashboardMobileHeader,
  type DashboardUser,
} from "@/components/dashboard/sidebar";
import { IncomingCallsFloating } from "@/components/dashboard/incoming-calls-floating";
import { IncomingStudentCallsFloating } from "@/components/dashboard/incoming-student-calls";
import { RejoinCallBanner } from "@/components/dashboard/rejoin-call-banner";

export const metadata: Metadata = {
  // Fallback for dashboard pages without their own title; the root template adds "| Students Traffic".
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // One query: real DB user (by email; session.user.id is "1" for admins),
  // guide status and nav badge counts. Shared with pages via React cache.
  const viewer = session.user.email ? await getDashboardViewer(session.user.email) : null;

  // The user card renders from server data so it never depends on the client
  // session having loaded (that is what showed "Student" / "U" before).
  const user: DashboardUser = {
    name: viewer?.name ?? session.user.name ?? null,
    email: viewer?.email ?? session.user.email ?? null,
    image: viewer?.image ?? session.user.image ?? null,
  };
  const isGuide = viewer?.isGuide ?? false;
  const counts = viewer?.counts ?? EMPTY_NAV_COUNTS;

  let initialCalls: Awaited<ReturnType<typeof getIncomingPeerCalls>> = [];
  let initialStudentCalls: Awaited<ReturnType<typeof getIncomingStudentCalls>> = [];
  let activeCall: Awaited<ReturnType<typeof getActivePeerCallForUser>> = null;
  const voiceUserId = env.hasAgoraVoice && viewer ? viewer.userId : null;

  if (voiceUserId) {
    [initialCalls, initialStudentCalls, activeCall] = await Promise.all([
      isGuide ? getIncomingPeerCalls(voiceUserId) : Promise.resolve([]),
      getIncomingStudentCalls(voiceUserId),
      getActivePeerCallForUser(voiceUserId),
    ]);
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <DashboardSidebar user={user} isGuide={isGuide} counts={counts} />
      </div>

      {/* Main content: pages centre themselves with <DashboardPage> */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardMobileHeader user={user} />
        <main className="min-w-0 flex-1 overflow-x-clip px-4 pt-6 pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pt-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardBottomNav isGuide={isGuide} counts={counts} />

      {/* Rejoin banner — shown to any user (caller or peer) with an active call after a refresh */}
      {activeCall && <RejoinCallBanner call={activeCall} />}

      {/* Floating incoming-call dialog — only for peer guides with voice enabled */}
      {isGuide && voiceUserId && <IncomingCallsFloating initialCalls={initialCalls} userId={voiceUserId} />}

      {/* Floating incoming-call dialog for students — when a guide calls them */}
      {initialStudentCalls.length > 0 && voiceUserId && (
        <IncomingStudentCallsFloating initialCalls={initialStudentCalls} userId={voiceUserId} />
      )}
    </div>
  );
}
