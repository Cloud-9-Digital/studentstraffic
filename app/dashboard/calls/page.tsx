import Link from "next/link";
import { count, desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { GraduationCap, Phone, PhoneCall } from "lucide-react";

import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/server-session";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallBookings, peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";
import { deriveCallStatus, formatCallDuration } from "@/lib/calls/call-status";
import {
  CALL_HISTORY_MAX,
  CALL_HISTORY_PAGE_SIZE,
  CALL_LOG_TIME_ZONE,
  groupCallsByDay,
  parseCallHistoryLimit,
} from "@/lib/calls/call-history";
import { BookedCallsList } from "@/components/dashboard/booked-calls-list";
import { CallHistoryList, type CallHistoryDay } from "@/components/dashboard/call-history-list";
import { DashboardPage, EmptyState, PageHeader, Section, dashboardButton } from "@/components/dashboard/ui";

export const metadata = { title: "Calls | Dashboard" };

const callerUser = alias(users, "call_caller_user");
const recipientUser = alias(users, "call_recipient_user");

export default async function MyCallsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const db = getDb();
  if (!db) return null;

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) return null;

  const params = await searchParams;
  const historyLimit = parseCallHistoryLimit(params.show);
  const voiceEnabled = env.hasAgoraVoice;
  const involvesMe = or(eq(peerCallSessions.callerUserId, userId), eq(peerCallSessions.peerUserId, userId));

  const [bookedPeers, callRows, historyCountResult] = await Promise.all([
    db
      .select({
        bookingId: peerCallBookings.id,
        peerId: studentPeers.id,
        fullName: studentPeers.fullName,
        courseName: studentPeers.courseName,
        currentYearOrBatch: studentPeers.currentYearOrBatch,
        universityName: universities.name,
        universitySlug: universities.slug,
        canReceiveCalls: users.id,
        bookingStatus: peerCallBookings.status,
      })
      .from(peerCallBookings)
      .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .leftJoin(users, eq(studentPeers.peerUserId, users.id))
      .where(eq(peerCallBookings.studentUserId, userId))
      .orderBy(peerCallBookings.createdAt)
      .limit(100),

    // Past calls are a record: list them even when voice calling is switched off.
    db
          .select({
            id: peerCallSessions.id,
            status: peerCallSessions.status,
            callerUserId: peerCallSessions.callerUserId,
            peerId: peerCallSessions.peerId,
            guideUserId: studentPeers.peerUserId,
            guideName: studentPeers.fullName,
            universityName: universities.name,
            universitySlug: universities.slug,
            callerName: callerUser.name,
            recipientName: recipientUser.name,
            answeredAt: peerCallSessions.answeredAt,
            endedAt: peerCallSessions.endedAt,
            createdAt: peerCallSessions.createdAt,
          })
          .from(peerCallSessions)
          .leftJoin(studentPeers, eq(peerCallSessions.peerId, studentPeers.id))
          .leftJoin(universities, eq(peerCallSessions.universityId, universities.id))
          .leftJoin(callerUser, eq(peerCallSessions.callerUserId, callerUser.id))
          .leftJoin(recipientUser, eq(peerCallSessions.peerUserId, recipientUser.id))
          .where(involvesMe)
          .orderBy(desc(peerCallSessions.createdAt))
          // One extra row tells us whether "Show more" is needed.
          .limit(historyLimit + 1),

    db.select({ total: count() }).from(peerCallSessions).where(involvesMe),
  ]);

  const historyTotal = historyCountResult[0]?.total ?? 0;
  const hasMore = callRows.length > historyLimit && historyLimit < CALL_HISTORY_MAX;
  const shownRows = callRows.slice(0, historyLimit);

  const peers = bookedPeers.map((row) => ({
    bookingId: row.bookingId,
    peerId: row.peerId,
    fullName: row.fullName,
    courseName: row.courseName,
    currentYearOrBatch: row.currentYearOrBatch,
    universityName: row.universityName,
    universitySlug: row.universitySlug,
    canReceiveCalls: row.canReceiveCalls !== null,
    bookingStatus: row.bookingStatus,
  }));

  const timeFormat = new Intl.DateTimeFormat("en-IN", { timeZone: CALL_LOG_TIME_ZONE, hour: "2-digit", minute: "2-digit" });

  const days: CallHistoryDay[] = groupCallsByDay(shownRows, new Date()).map((group) => ({
    key: group.key,
    label: group.label,
    rows: group.rows.map((row) => {
      const direction = row.callerUserId === userId ? "outgoing" : "incoming";
      const status = deriveCallStatus({ status: row.status, direction, answeredAt: row.answeredAt, endedAt: row.endedAt });
      const iAmGuide = row.guideUserId === userId;
      // The other participant: the guide profile name when I am the student,
      // otherwise the student's account name (caller or recipient, whichever is not me).
      const otherName = iAmGuide
        ? (direction === "outgoing" ? row.recipientName : row.callerName)?.trim() || "Student"
        : row.guideName ?? "Guide";
      return {
        id: row.id,
        otherName,
        universityName: row.universityName,
        direction,
        outcome: status.outcome,
        statusLabel: status.label,
        duration: formatCallDuration(status.durationSeconds),
        time: row.createdAt ? timeFormat.format(row.createdAt) : "",
        dateTime: row.createdAt ? row.createdAt.toISOString() : null,
      };
    }),
  }));

  return (
    <DashboardPage wide>
      <PageHeader title="Calls" description="Call the student guides who accepted your request, and see your call history." />

      <Section title="Your guides" description="Guides you've asked for a call." flush>
        {peers.length === 0 ? (
          <EmptyState
            icon={PhoneCall}
            title="No guides booked yet"
            description="Open a university page and request a call with a student guide who studies there."
            action={
              <Link href="/universities" className={dashboardButton.secondary}>
                <GraduationCap className="size-4" />
                Browse universities
              </Link>
            }
          />
        ) : (
          <BookedCallsList peers={peers} voiceEnabled={voiceEnabled} />
        )}
      </Section>

      <Section
        title="Call history"
        description={historyTotal > 0 ? `${historyTotal} call${historyTotal === 1 ? "" : "s"} · times in IST` : undefined}
        flush
      >
        {historyTotal === 0 ? (
          <EmptyState icon={Phone} title="No calls yet" description="Calls you make or receive will be listed here." />
        ) : (
          <>
            <CallHistoryList days={days} />
            {hasMore ? (
              <div className="border-t border-[#f0f0f0] px-4 py-3 text-center sm:px-5">
                <Link
                  href={`/dashboard/calls?show=${historyLimit + CALL_HISTORY_PAGE_SIZE}`}
                  scroll={false}
                  className={dashboardButton.secondary}
                >
                  Show more calls
                </Link>
              </div>
            ) : historyTotal > shownRows.length ? (
              <p className="border-t border-[#f0f0f0] px-4 py-3 text-center text-xs text-[#6b7280] sm:px-5">
                Showing your {shownRows.length} most recent calls.
              </p>
            ) : null}
          </>
        )}
      </Section>
    </DashboardPage>
  );
}
