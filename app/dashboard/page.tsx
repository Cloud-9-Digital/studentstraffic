import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, sql } from "drizzle-orm";
import {
  ArrowRight,
  BookmarkCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  MessagesSquare,
  PhoneCall,
  Settings,
  Star,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { getDashboardViewer } from "@/lib/dashboard/nav-counts";
import { getNextSteps, type NextStepKind } from "@/lib/dashboard/next-steps";
import { peerSafeText } from "@/lib/peer-contact-policy";
import {
  applications,
  guideConversations,
  peerCallBookings,
  studentPeerApplications,
  studentPeers,
  universities,
  userShortlists,
} from "@/lib/db/schema";
import {
  DashboardPage,
  PageHeader,
  Section,
  SectionList,
  StatCard,
  dashboardButton,
} from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Home | Dashboard" };

const NEXT_STEP_ICONS: Record<NextStepKind, LucideIcon> = {
  reply: MessagesSquare,
  apply: FileText,
  browse: GraduationCap,
  preferences: Settings,
  guide: PhoneCall,
};

function greeting(name: string) {
  // Most students are in India; the server runs in UTC.
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date())
  );
  const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${time}, ${name}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type Booking = { id: number; status: string; peerName: string; universityName: string };

export default async function DashboardHomePage() {
  const session = await auth();
  const viewer = session?.user?.email ? await getDashboardViewer(session.user.email) : null;
  const firstName = (viewer?.name ?? session?.user?.name)?.trim().split(/\s+/)[0] || "there";

  let shortlistCount = 0;
  let applicationCount = 0;
  let bookingCount = 0;
  let bookings: Booking[] = [];
  let latestUnread: { name: string; unread: number } | null = null;
  let peerKind: "active" | "pending" | "rejected" | "none" = viewer?.isGuide ? "active" : "none";

  const db = getDb();
  if (db && viewer) {
    const userId = viewer.userId;
    const [shortlistResult, applicationResult, bookingTotalResult, bookingRows, guideAppRows, unreadRows] =
      await Promise.all([
        db.select({ total: count() }).from(userShortlists).where(eq(userShortlists.userId, userId)),
        db.select({ total: count() }).from(applications).where(eq(applications.userId, userId)),
        db.select({ total: count() }).from(peerCallBookings).where(eq(peerCallBookings.studentUserId, userId)),
        db
          .select({
            id: peerCallBookings.id,
            status: peerCallBookings.status,
            peerName: studentPeers.fullName,
            universityName: universities.name,
          })
          .from(peerCallBookings)
          .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
          .innerJoin(universities, eq(studentPeers.universityId, universities.id))
          .where(eq(peerCallBookings.studentUserId, userId))
          .orderBy(desc(peerCallBookings.updatedAt))
          .limit(3),
        viewer.isGuide
          ? Promise.resolve([])
          : db
              .select({ status: studentPeerApplications.status })
              .from(studentPeerApplications)
              .where(eq(studentPeerApplications.peerUserId, userId))
              .limit(1),
        // Only when the nav count says there is something unread: the guide
        // whose conversation has the latest unread message, for "Reply to …".
        viewer.counts.studentUnread > 0
          ? db
              .select({
                peerName: studentPeers.fullName,
                unread: sql<number>`(select count(*)::integer from guide_messages m
                  where m.conversation_id = ${guideConversations.id}
                    and m.sender_user_id <> ${userId}
                    and m.created_at > coalesce(${guideConversations.studentLastReadAt}, '-infinity'::timestamptz))`.mapWith(Number),
              })
              .from(guideConversations)
              .innerJoin(studentPeers, eq(guideConversations.peerId, studentPeers.id))
              .where(
                and(
                  eq(guideConversations.studentUserId, userId),
                  sql`${guideConversations.lastMessageAt} > coalesce(${guideConversations.studentLastReadAt}, '-infinity'::timestamptz)`
                )
              )
              .orderBy(sql`${guideConversations.lastMessageAt} desc nulls last`)
              .limit(1)
          : Promise.resolve([]),
      ]);

    shortlistCount = shortlistResult[0]?.total ?? 0;
    applicationCount = applicationResult[0]?.total ?? 0;
    bookingCount = bookingTotalResult[0]?.total ?? 0;
    bookings = bookingRows.map((b) => ({ ...b, peerName: peerSafeText(b.peerName) }));

    const unreadRow = unreadRows[0];
    if (unreadRow && unreadRow.unread > 0) {
      latestUnread = { name: peerSafeText(unreadRow.peerName), unread: unreadRow.unread };
    }

    const guideApp = guideAppRows[0];
    if (!viewer.isGuide && guideApp) {
      peerKind = guideApp.status === "rejected" ? "rejected" : "pending";
    }
  }

  const unreadMessages = viewer?.counts.studentUnread ?? 0;
  const nextSteps = getNextSteps({
    unreadMessages,
    latestUnread,
    shortlistCount,
    applicationCount,
    bookingCount,
    preferences: viewer?.preferences ?? { neetScore: null, budgetUsd: null, preferredCountries: null },
  });

  const readyBookings = bookings.filter((b) => b.status === "accepted" || b.status === "active");

  return (
    <DashboardPage>
      <PageHeader
        title={greeting(firstName)}
        description="Here's what needs your attention."
        actions={
          <Link href="/universities" className={dashboardButton.secondary}>
            <GraduationCap className="size-4" />
            Browse universities
          </Link>
        }
      />

      {/* Guide ready for a call */}
      {readyBookings.length > 0 && (
        <Link
          href="/dashboard/calls"
          className="flex items-center gap-4 rounded-xl bg-[#0f3d37] px-5 py-4 transition hover:bg-[#184a43]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/20">
            <PhoneCall className="size-5 text-emerald-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {readyBookings.length === 1
                ? `${readyBookings[0].peerName.split(" ")[0]} is ready to talk`
                : `${readyBookings.length} guides are ready to talk`}
            </p>
            <p className="mt-0.5 text-xs text-emerald-200">Open Calls to start your call</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-emerald-300" />
        </Link>
      )}

      {/* Next steps */}
      {nextSteps.length > 0 && (
        <Section title="Next steps" flush>
          <SectionList>
            {nextSteps.map((step) => {
              const Icon = NEXT_STEP_ICONS[step.kind];
              return (
                <li key={step.kind}>
                  <Link href={step.href} className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#f9fafb]">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f5f4] text-[#0f3d37]">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0f1f1c]">{step.title}</p>
                      <p className="mt-0.5 text-xs text-[#6b7280]">{step.description}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-[#c9c9c9]" />
                  </Link>
                </li>
              );
            })}
          </SectionList>
        </Section>
      )}

      {/* At a glance */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard href="/dashboard/shortlists" label="Shortlisted" value={shortlistCount} icon={BookmarkCheck} hint="View shortlist" />
        <StatCard href="/dashboard/applications" label="Applications" value={applicationCount} icon={FileText} hint="Track progress" />
        <StatCard
          href="/dashboard/messages"
          label="Unread messages"
          value={unreadMessages}
          icon={MessagesSquare}
          hint={unreadMessages > 0 ? "Reply now" : "Open messages"}
        />
        <StatCard href="/dashboard/calls" label="Guide calls" value={bookingCount} icon={PhoneCall} hint="See your calls" />
      </div>

      {/* My guides — only when the student has booked any */}
      {bookings.length > 0 && (
        <Section
          title="Your guides"
          flush
          action={
            <Link href="/dashboard/calls" className="inline-flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          }
        >
          <SectionList>
            {bookings.map((b) => {
              const isReady = b.status === "accepted" || b.status === "active";
              const isPending = b.status === "pending";
              return (
                <li key={b.id}>
                  <Link href="/dashboard/calls" className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-[#f9fafb]">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f5f4] text-xs font-bold text-[#0f3d37]">
                      {initials(b.peerName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0f1f1c]">{b.peerName}</p>
                      <p className="truncate text-xs text-[#6b7280]">{b.universityName}</p>
                    </div>
                    {isReady ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle className="size-3" /> Ready
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <Clock className="size-3" /> Waiting for reply
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-[#6b7280]">Declined</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </SectionList>
        </Section>
      )}

      {/* Guide programme status */}
      {peerKind === "active" && (
        <Link
          href="/dashboard/peer"
          className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 transition hover:border-emerald-300"
        >
          <CheckCircle className="size-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0f1f1c]">Your guide profile is live</p>
            <p className="mt-0.5 text-xs text-emerald-700">
              {viewer && viewer.counts.pendingRequests > 0
                ? `${viewer.counts.pendingRequests} call ${viewer.counts.pendingRequests === 1 ? "request" : "requests"} waiting in Guide home`
                : "Go to Guide home to manage requests and students"}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-emerald-500" />
        </Link>
      )}

      {peerKind === "pending" && (
        <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <Clock className="size-5 shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0f1f1c]">Your guide application is under review</p>
            <p className="mt-0.5 text-xs text-amber-700">We&apos;ll email you once it&apos;s approved.</p>
          </div>
        </div>
      )}

      {peerKind === "none" && (
        <Section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0f5f4]">
                <Star className="size-5 text-[#0f3d37]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f1f1c]">Already studying abroad? Become a student guide</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">Help students from home by sharing your experience.</p>
              </div>
            </div>
            <Link href="/join" className={dashboardButton.secondary}>
              Apply to be a guide
            </Link>
          </div>
        </Section>
      )}
    </DashboardPage>
  );
}
