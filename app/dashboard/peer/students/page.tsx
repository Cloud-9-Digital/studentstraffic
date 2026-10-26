import { redirect } from "next/navigation";
import { Clock, Phone, PhoneMissed, PhoneOff, Users } from "lucide-react";
import { count, desc, eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";
import { getDashboardViewer } from "@/lib/dashboard/nav-counts";
import { DataPagination } from "@/components/ui/data-pagination";
import { DashboardPage, EmptyState, PageHeader, Section, SectionList } from "@/components/dashboard/ui";
import { loadGuideStudents, toSafeGuideStudentRow } from "@/lib/dashboard/guide-students-data";
import { formatGuideDate } from "@/lib/dashboard/guide-students";
import { peerSafeText } from "@/lib/peer-contact-policy";
import { StudentsList } from "./students-list";

export const metadata = { title: "My students | Dashboard" };

const HISTORY_PER_PAGE = 10;

function callStatusIcon(status: string) {
  if (status === "ended" || status === "active") return <Phone className="size-3.5 text-emerald-500" />;
  if (status === "missed" || status === "expired") return <PhoneMissed className="size-3.5 text-amber-500" />;
  if (status === "declined") return <PhoneOff className="size-3.5 text-red-400" />;
  return <Clock className="size-3.5 text-[#9ca3af]" />;
}

function callStatusLabel(status: string) {
  if (status === "ended") return "Completed";
  if (status === "active") return "In progress";
  if (status === "missed" || status === "expired") return "Missed";
  if (status === "declined") return "Declined";
  if (status === "ringing") return "Ringing";
  return status;
}

function callDuration(start: Date | null, end: Date | null): string | null {
  if (!start || !end) return null;
  const secs = Math.round((end.getTime() - start.getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

export default async function PeerStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const db = getDb();
  if (!db) return <p className="text-sm text-[#6b7280]">Service temporarily unavailable.</p>;

  const viewer = await getDashboardViewer(session.user.email);
  if (!viewer) redirect("/login");
  const userId = viewer.userId;

  const [peer] = await db
    .select({ id: studentPeers.id, status: studentPeers.status, universityName: universities.name })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) redirect("/join");

  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const historyPage = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const historyOffset = (historyPage - 1) * HISTORY_PER_PAGE;

  const [{ students, truncated }, callHistory, historyCountResult] = await Promise.all([
    loadGuideStudents(db, { peerId: peer.id, peerUserId: userId, guideActive: peer.status === "active" }),
    env.hasAgoraVoice
      ? db
          .select({
            id: peerCallSessions.id,
            callerUserId: peerCallSessions.callerUserId,
            studentName: users.name,
            status: peerCallSessions.status,
            answeredAt: peerCallSessions.answeredAt,
            endedAt: peerCallSessions.endedAt,
            createdAt: peerCallSessions.createdAt,
          })
          .from(peerCallSessions)
          .leftJoin(
            users,
            sql`${users.id} = case when ${peerCallSessions.callerUserId} = ${userId} then ${peerCallSessions.peerUserId} else ${peerCallSessions.callerUserId} end`,
          )
          .where(eq(peerCallSessions.peerId, peer.id))
          .orderBy(desc(peerCallSessions.createdAt))
          .limit(HISTORY_PER_PAGE)
          .offset(historyOffset)
      : Promise.resolve([]),
    env.hasAgoraVoice
      ? db.select({ total: count() }).from(peerCallSessions).where(eq(peerCallSessions.peerId, peer.id))
      : Promise.resolve([{ total: 0 }]),
  ]);

  const rows = students.map(toSafeGuideStudentRow);
  const historyTotal = historyCountResult[0]?.total ?? 0;
  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PER_PAGE));
  const total = `${rows.length}${truncated ? "+" : ""}`;

  return (
    <DashboardPage wide>
      <PageHeader
        title="My students"
        description={
          rows.length === 0
            ? "Students who request a call, message or call you will appear here."
            : `${total} student${rows.length === 1 ? "" : "s"} have requested a call, messaged or called you.`
        }
      />

      <Section flush>
        {rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students yet"
            description="When students find you on your university page and send a request or message, they show up here."
          />
        ) : (
          <StudentsList students={rows} universityName={peer.universityName} voiceEnabled={env.hasAgoraVoice} />
        )}
      </Section>

      {env.hasAgoraVoice && historyTotal > 0 ? (
        <Section
          title="Call history"
          description={`${historyTotal} call${historyTotal === 1 ? "" : "s"} recorded`}
          flush
        >
          <SectionList>
            {callHistory.map((c) => {
              const youCalled = c.callerUserId === userId;
              const name = peerSafeText(c.studentName?.trim() || "Student");
              const duration = callDuration(c.answeredAt, c.endedAt);
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0f1f1c]">
                      {name}
                      <span className="ml-1.5 text-xs font-normal text-[#9ca3af]">{youCalled ? "You called" : "Called you"}</span>
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#6b7280]">
                      {callStatusIcon(c.status)}
                      {callStatusLabel(c.status)}
                      {duration ? <span>· {duration}</span> : null}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-[#9ca3af]">{formatGuideDate(c.createdAt, true) ?? "—"}</p>
                </li>
              );
            })}
          </SectionList>
          {historyTotalPages > 1 ? (
            <div className="border-t border-[#f0f0f0] px-4 py-3">
              <DataPagination
                page={historyPage}
                totalPages={historyTotalPages}
                buildHref={(p) => `/dashboard/peer/students?page=${p}`}
              />
            </div>
          ) : null}
        </Section>
      ) : null}
    </DashboardPage>
  );
}
