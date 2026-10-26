import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Inbox,
  MessageCircle,
  PauseCircle,
  PhoneCall,
  UserCog,
  Users,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { countries, studentPeerApplications, studentPeers, universities } from "@/lib/db/schema";
import { getDashboardViewer } from "@/lib/dashboard/nav-counts";
import { loadGuideStudents, toSafeGuideStudentRow } from "@/lib/dashboard/guide-students-data";
import { describeGuideStudentChannels, type GuideStudentRow } from "@/lib/dashboard/guide-students";
import {
  DashboardPage,
  EmptyState,
  PageHeader,
  Section,
  SectionList,
  StatCard,
  dashboardButton,
} from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import { RequestActions } from "./requests/request-actions";
import { StudentActions } from "./students/student-actions";
import { StudentAvatar, StudentStatusPill } from "./students/student-bits";

export const metadata = { title: "Guide home | Dashboard" };

const ATTENTION_LIMIT = 5;

export default async function PeerOverviewPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const db = getDb();
  if (!db) return <p className="text-sm text-[#6b7280]">Service temporarily unavailable.</p>;

  const viewer = await getDashboardViewer(session.user.email);
  if (!viewer) redirect("/login");
  const userId = viewer.userId;

  const [peer] = await db
    .select({
      id: studentPeers.id,
      status: studentPeers.status,
      acceptingRequests: studentPeers.acceptingRequests,
      fullName: studentPeers.fullName,
      courseName: studentPeers.courseName,
      currentYearOrBatch: studentPeers.currentYearOrBatch,
      universityName: universities.name,
      countryName: countries.name,
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .leftJoin(countries, eq(studentPeers.countryId, countries.id))
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) {
    const [pendingApp] = await db
      .select({
        id: studentPeerApplications.id,
        status: studentPeerApplications.status,
        universityName: universities.name,
        createdAt: studentPeerApplications.createdAt,
      })
      .from(studentPeerApplications)
      .innerJoin(universities, eq(studentPeerApplications.universityId, universities.id))
      .where(eq(studentPeerApplications.peerUserId, userId))
      .limit(1);

    if (pendingApp) return <PendingScreen app={pendingApp} />;
    redirect("/join");
  }

  const guideActive = peer.status === "active";
  const { students, truncated, callsThisMonth } = await loadGuideStudents(db, {
    peerId: peer.id,
    peerUserId: userId,
    guideActive,
  });
  const rows = students.map(toSafeGuideStudentRow);

  const pending = rows.filter((s) => s.status === "pending");
  const unread = rows.filter((s) => s.unreadCount > 0 && s.status !== "pending");
  const unreadTotal = rows.reduce((sum, s) => sum + s.unreadCount, 0);
  const readyToCall = rows.filter((s) => s.status === "accepted" && s.canMessage).slice(0, ATTENTION_LIMIT);
  const recent = rows.slice(0, ATTENTION_LIMIT);
  const studentTotal = `${rows.length}${truncated ? "+" : ""}`;
  const firstName = peer.fullName.split(" ")[0] || peer.fullName;
  const subtitle = [peer.universityName, peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ");

  return (
    <DashboardPage>
      <PageHeader
        title="Guide home"
        description={`Hi ${firstName}. ${subtitle}`}
        actions={
          <>
            <AvailabilityStatus active={guideActive} accepting={peer.acceptingRequests} />
            <Link href={`/students?peer=${peer.id}`} className={dashboardButton.secondary}>
              <ExternalLink className="size-4" />
              Preview public profile
            </Link>
            <Link href="/dashboard/peer/edit" className={dashboardButton.primary}>
              <UserCog className="size-4" />
              Edit profile
            </Link>
          </>
        }
      />

      <Section
        title="Needs your attention"
        description={
          pending.length + unread.length === 0
            ? undefined
            : "Reply to requests and messages so students are not left waiting."
        }
        action={
          pending.length > ATTENTION_LIMIT ? (
            <Link href="/dashboard/peer/requests" className="inline-flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline">
              All {pending.length} requests <ArrowRight className="size-3" />
            </Link>
          ) : null
        }
        flush
      >
        {pending.length + unread.length === 0 ? (
          <p className="flex items-center gap-2 px-5 py-4 text-sm text-[#6b7280]">
            <CheckCircle2 className="size-4 text-emerald-600" />
            You&apos;re all caught up. No pending requests or unread messages.
          </p>
        ) : (
          <SectionList>
            {pending.slice(0, ATTENTION_LIMIT).map((s) => (
              <AttentionRow key={s.key} student={s} kind="request">
                {s.canAccept && s.bookingId != null ? (
                  <RequestActions bookingId={s.bookingId} studentName={s.name} />
                ) : null}
              </AttentionRow>
            ))}
            {unread.slice(0, ATTENTION_LIMIT).map((s) => (
              <AttentionRow key={s.key} student={s} kind="message">
                {s.conversationId != null ? (
                  <Link
                    href={`/dashboard/peer/messages?conversation=${s.conversationId}`}
                    className={cn(dashboardButton.secondary, "px-3 py-1.5 text-xs")}
                  >
                    <MessageCircle className="size-3.5" />
                    Reply
                  </Link>
                ) : null}
              </AttentionRow>
            ))}
          </SectionList>
        )}
      </Section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard href="/dashboard/peer/students" label="My students" value={studentTotal} icon={Users} hint="View all" />
        <StatCard
          href="/dashboard/peer/requests"
          label="Pending requests"
          value={pending.length}
          icon={Inbox}
          hint={pending.length > 0 ? "Accept or decline" : "None waiting"}
        />
        <StatCard
          href="/dashboard/peer/messages"
          label="Unread messages"
          value={unreadTotal}
          icon={MessageCircle}
          hint="Open inbox"
        />
        {env.hasAgoraVoice ? (
          <StatCard
            href="/dashboard/peer/students"
            label="Calls this month"
            value={callsThisMonth}
            icon={PhoneCall}
            hint="Call history"
          />
        ) : null}
      </div>

      {readyToCall.length > 0 ? (
        <Section
          title={env.hasAgoraVoice ? "Ready to call" : "Ready to talk"}
          description="Students you accepted. Message them or start a call."
          flush
        >
          <SectionList>
            {readyToCall.map((s) => (
              <li key={s.key} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <StudentAvatar name={s.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">{s.name}</p>
                    <p className="truncate text-xs text-[#6b7280]">
                      {s.interest ? `“${s.interest}”` : describeGuideStudentChannels(s)}
                    </p>
                  </div>
                </div>
                <div className="pl-12 sm:pl-0">
                  <StudentActions
                    studentName={s.name}
                    universityName={peer.universityName}
                    bookingId={s.bookingId}
                    conversationId={s.conversationId}
                    unreadCount={s.unreadCount}
                    canAccept={false}
                    canMessage={s.canMessage}
                    canCall={env.hasAgoraVoice && s.canCall}
                  />
                </div>
              </li>
            ))}
          </SectionList>
        </Section>
      ) : null}

      <Section
        title="Recent students"
        action={
          rows.length > recent.length ? (
            <Link href="/dashboard/peer/students" className="inline-flex items-center gap-1 text-xs font-medium text-[#0f3d37] hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          ) : null
        }
        flush
      >
        {recent.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Students find you on your university page. Keep your profile complete so they know what to ask you."
            action={
              <Link href="/dashboard/peer/edit" className={dashboardButton.secondary}>
                Complete your profile
              </Link>
            }
          />
        ) : (
          <SectionList>
            {recent.map((s) => (
              <li key={s.key}>
                <Link
                  href="/dashboard/peer/students"
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#fafafa] sm:px-5"
                >
                  <StudentAvatar name={s.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="truncate text-sm font-semibold text-[#0f1f1c]">{s.name}</p>
                      <StudentStatusPill status={s.status} />
                    </div>
                    <p className="truncate text-xs text-[#6b7280]">{describeGuideStudentChannels(s)}</p>
                  </div>
                  {s.lastActivityLabel ? (
                    <p className="hidden shrink-0 text-xs text-[#9ca3af] sm:block">{s.lastActivityLabel}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </SectionList>
        )}
      </Section>
    </DashboardPage>
  );
}

function AvailabilityStatus({ active, accepting }: { active: boolean; accepting: boolean }) {
  const label = !active ? "Profile hidden" : accepting ? "Accepting requests" : "Requests paused";
  const on = active && accepting;
  return (
    <Link
      href="/dashboard/peer/edit#availability"
      title="Change in your guide profile"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition",
        on ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-800 ring-amber-200 hover:bg-amber-100",
      )}
    >
      {on ? <span className="size-2 rounded-full bg-emerald-500" aria-hidden /> : <PauseCircle className="size-3.5" />}
      {label}
    </Link>
  );
}

function AttentionRow({
  student,
  kind,
  children,
}: {
  student: GuideStudentRow;
  kind: "request" | "message";
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:px-5">
      <div className="flex min-w-0 flex-1 gap-3">
        <StudentAvatar name={student.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0f1f1c]">{student.name}</p>
          <p className="text-xs text-[#6b7280]">
            {kind === "request"
              ? "Wants to talk to you"
              : `${student.unreadCount} unread message${student.unreadCount === 1 ? "" : "s"}`}
            {student.lastActivityLabel ? <> · {student.lastActivityLabel}</> : null}
          </p>
          {kind === "request" && student.interest ? (
            <p className="mt-1 line-clamp-2 text-sm text-[#374151]">“{student.interest}”</p>
          ) : null}
        </div>
      </div>
      <div className="pl-12 sm:pl-0">{children}</div>
    </li>
  );
}

function PendingScreen({
  app,
}: {
  app: { id: number; status: string; createdAt: Date | null; universityName: string };
}) {
  const isRejected = app.status === "rejected";
  return (
    <DashboardPage>
      <PageHeader title="Guide home" description="Your guide application" />
      <div className={`rounded-xl border p-5 ${isRejected ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex items-start gap-4">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isRejected ? "bg-red-100" : "bg-amber-100"}`}>
            <Clock className={`size-5 ${isRejected ? "text-red-600" : "text-amber-600"}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-semibold ${isRejected ? "text-red-900" : "text-amber-900"}`}>
              {isRejected ? "Application not approved" : "Under review"}
            </p>
            <p className={`mt-1 text-sm ${isRejected ? "text-red-800" : "text-amber-800"}`}>
              {isRejected
                ? "Your application was not approved. Apply again with a clearer college ID."
                : "We're reviewing your application and will email you once approved."}
            </p>
            <p className={`mt-2 text-xs ${isRejected ? "text-red-700" : "text-amber-700"}`}>
              {app.universityName}
              {app.createdAt && (
                <> · Applied {app.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</>
              )}
            </p>
          </div>
        </div>
      </div>
      {isRejected && (
        <Link href="/join" className={dashboardButton.primary}>
          Apply again <ArrowRight className="size-4" />
        </Link>
      )}
    </DashboardPage>
  );
}
