import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { Inbox } from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { guideConversations, peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { getDashboardViewer } from "@/lib/dashboard/nav-counts";
import { peerSafeText } from "@/lib/peer-contact-policy";
import { formatGuideDate, type GuideStudentStatus } from "@/lib/dashboard/guide-students";
import { DataPagination } from "@/components/ui/data-pagination";
import { DashboardPage, EmptyState, PageHeader, Section, SectionList } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";
import { StudentActions } from "../students/student-actions";
import { StudentAvatar, StudentStatusPill } from "../students/student-bits";
import { ExpandableText } from "./expandable-text";
import { RequestActions } from "./request-actions";

export const metadata = { title: "Call requests | Dashboard" };

const PER_PAGE = 10;

type Tab = "pending" | "accepted" | "closed";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "closed", label: "Declined & closed" },
];

const EMPTY: Record<Tab, { title: string; description: string }> = {
  pending: {
    title: "No pending requests",
    description: "When a student asks to talk to you, the request appears here for you to accept or decline.",
  },
  accepted: {
    title: "No accepted requests yet",
    description: "Students you accept appear here, ready to message or call.",
  },
  closed: {
    title: "Nothing here",
    description: "Requests you declined, that students cancelled, or that were blocked appear here.",
  },
};

function bookingStatus(status: string, blocked: boolean): GuideStudentStatus {
  if (blocked) return "blocked";
  if (status === "pending" || status === "accepted" || status === "declined" || status === "cancelled") return status;
  return "contacted";
}

export default async function PeerRequestsPage({
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
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const rawTab = first(params.tab);
  const tab: Tab = rawTab === "accepted" || rawTab === "closed" ? rawTab : "pending";
  const page = Math.max(1, parseInt(first(params.page) ?? "1", 10) || 1);

  const blocked = sql`(${peerCallBookings.studentBlockedAt} is not null or ${peerCallBookings.peerBlockedAt} is not null)`;
  const bucket: Record<Tab, SQL> = {
    pending: sql`(${peerCallBookings.status} = 'pending' and not ${blocked})`,
    accepted: sql`(${peerCallBookings.status} = 'accepted' and not ${blocked})`,
    closed: sql`(${peerCallBookings.status} not in ('pending','accepted') or ${blocked})`,
  };

  const [[counts], rows] = await db.batch([
    db
      .select({
        pending: sql<number>`count(*) filter (where ${bucket.pending})`.mapWith(Number),
        accepted: sql<number>`count(*) filter (where ${bucket.accepted})`.mapWith(Number),
        closed: sql<number>`count(*) filter (where ${bucket.closed})`.mapWith(Number),
      })
      .from(peerCallBookings)
      .where(eq(peerCallBookings.peerId, peer.id)),
    db
      .select({
        id: peerCallBookings.id,
        status: peerCallBookings.status,
        blocked: sql<boolean>`${blocked}`,
        message: peerCallBookings.message,
        createdAt: peerCallBookings.createdAt,
        updatedAt: peerCallBookings.updatedAt,
        studentName: users.name,
        conversationId: guideConversations.id,
      })
      .from(peerCallBookings)
      .innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
      .leftJoin(
        guideConversations,
        and(
          eq(guideConversations.peerId, peerCallBookings.peerId),
          eq(guideConversations.studentUserId, peerCallBookings.studentUserId),
        ),
      )
      .where(and(eq(peerCallBookings.peerId, peer.id), bucket[tab]))
      .orderBy(tab === "pending" ? desc(peerCallBookings.createdAt) : desc(peerCallBookings.updatedAt))
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE),
  ]);

  const tabCount = counts?.[tab] ?? 0;
  const totalPages = Math.max(1, Math.ceil(tabCount / PER_PAGE));
  const guideActive = peer.status === "active";
  const pendingCount = counts?.pending ?? 0;

  return (
    <DashboardPage wide>
      <PageHeader
        title="Call requests"
        description={
          pendingCount === 0
            ? "No students are waiting for a reply."
            : `${pendingCount} student${pendingCount === 1 ? " is" : "s are"} waiting for your reply.`
        }
      />

      <Section flush>
        <nav aria-label="Request status" className="flex gap-1 overflow-x-auto border-b border-[#f0f0f0] px-3 sm:px-4">
          {TABS.map((t) => {
            const active = t.id === tab;
            const n = counts?.[t.id] ?? 0;
            return (
              <Link
                key={t.id}
                href={t.id === "pending" ? "/dashboard/peer/requests" : `/dashboard/peer/requests?tab=${t.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-3 text-sm font-medium transition",
                  active ? "border-[#0f3d37] text-[#0f1f1c]" : "border-transparent text-[#6b7280] hover:text-[#0f1f1c]",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                    t.id === "pending" && n > 0 ? "bg-amber-100 text-amber-800" : "bg-[#f3f4f6] text-[#6b7280]",
                  )}
                >
                  {n}
                </span>
              </Link>
            );
          })}
        </nav>

        {rows.length === 0 ? (
          <EmptyState icon={Inbox} title={EMPTY[tab].title} description={EMPTY[tab].description} />
        ) : (
          <SectionList>
            {rows.map((req) => {
              const name = peerSafeText(req.studentName?.trim() || "Student");
              const status = bookingStatus(req.status, req.blocked);
              const open = guideActive && !req.blocked;
              const sent = formatGuideDate(req.createdAt, true);
              const responded = req.status !== "pending" ? formatGuideDate(req.updatedAt, true) : null;
              return (
                <li key={req.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:px-5">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <StudentAvatar name={name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="truncate text-sm font-semibold text-[#0f1f1c]">{name}</p>
                        {tab !== "pending" ? <StudentStatusPill status={status} /> : null}
                      </div>
                      <p className="mt-0.5 text-xs text-[#6b7280]">
                        Sent {sent ?? "—"}
                        {responded ? <> · Updated {responded}</> : null}
                      </p>
                      <div className="mt-1.5">
                        {req.message ? (
                          <ExpandableText text={peerSafeText(req.message)} />
                        ) : (
                          <p className="text-sm italic text-[#9ca3af]">No message included.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pl-12 sm:pl-0">
                    {status === "pending" && open ? (
                      <RequestActions bookingId={req.id} studentName={name} />
                    ) : status === "accepted" && open ? (
                      <StudentActions
                        studentName={name}
                        universityName={peer.universityName}
                        bookingId={req.id}
                        conversationId={req.conversationId}
                        canAccept={false}
                        canMessage
                        canCall={env.hasAgoraVoice}
                      />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </SectionList>
        )}

        {totalPages > 1 ? (
          <div className="border-t border-[#f0f0f0] px-4 py-3">
            <DataPagination
              page={page}
              totalPages={totalPages}
              buildHref={(p) => `/dashboard/peer/requests?${tab === "pending" ? "" : `tab=${tab}&`}page=${p}`}
            />
          </div>
        ) : null}
      </Section>
    </DashboardPage>
  );
}
