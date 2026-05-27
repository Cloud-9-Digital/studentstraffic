import { eq, desc, count } from "drizzle-orm";
import { Phone, PhoneCall, PhoneOff, PhoneMissed, Clock } from "lucide-react";

import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/server-session";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallBookings, peerCallSessions, studentPeers, universities, users } from "@/lib/db/schema";
import { BookedCallsList } from "@/components/dashboard/booked-calls-list";
import { DataPagination } from "@/components/ui/data-pagination";

const HISTORY_PER_PAGE = 10;

export const metadata = { title: "My Calls | Dashboard" };

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
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

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
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const historyPage = Math.max(1, parseInt(rawPage ?? "1", 10));
  const historyOffset = (historyPage - 1) * HISTORY_PER_PAGE;

  const [bookedPeers, callHistory, historyCountResult] = await Promise.all([
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
        bookedAt: peerCallBookings.createdAt,
      })
      .from(peerCallBookings)
      .innerJoin(studentPeers, eq(peerCallBookings.peerId, studentPeers.id))
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .leftJoin(users, eq(studentPeers.peerUserId, users.id))
      .where(eq(peerCallBookings.studentUserId, userId))
      .orderBy(peerCallBookings.createdAt),

    env.hasAgoraVoice
      ? db
          .select({
            id: peerCallSessions.id,
            peerName: studentPeers.fullName,
            status: peerCallSessions.status,
            answeredAt: peerCallSessions.answeredAt,
            endedAt: peerCallSessions.endedAt,
            createdAt: peerCallSessions.createdAt,
          })
          .from(peerCallSessions)
          .leftJoin(studentPeers, eq(peerCallSessions.peerId, studentPeers.id))
          .where(eq(peerCallSessions.callerUserId, userId))
          .orderBy(desc(peerCallSessions.createdAt))
          .limit(HISTORY_PER_PAGE)
          .offset(historyOffset)
      : Promise.resolve([]),

    env.hasAgoraVoice
      ? db
          .select({ total: count() })
          .from(peerCallSessions)
          .where(eq(peerCallSessions.callerUserId, userId))
      : Promise.resolve([{ total: 0 }]),
  ]);

  const historyTotal = historyCountResult[0]?.total ?? 0;
  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PER_PAGE));

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

  const voiceEnabled = env.hasAgoraVoice;

  return (
    <div className="space-y-10">
      {/* Booked guides */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Calls</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Guides you&apos;ve booked a call with. Start a call when you&apos;re ready to connect.
          </p>
        </div>

        {peers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#e5e7eb] bg-white px-6 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#f0f7f5]">
              <PhoneCall className="size-5 text-[#0f3d37]" />
            </div>
            <p className="text-sm font-semibold text-[#374151]">No calls booked yet</p>
            <p className="text-xs text-[#9ca3af]">
              Browse student guides and book a call to chat with someone who has been through it.
            </p>
          </div>
        ) : (
          <BookedCallsList peers={peers} voiceEnabled={voiceEnabled} />
        )}
      </div>

      {/* Call history */}
      {env.hasAgoraVoice && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f1f1c]">Call history</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {historyTotal === 0
                ? "No calls yet."
                : `${historyTotal} call${historyTotal === 1 ? "" : "s"} recorded.`}
            </p>
          </div>

          {historyTotal === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-8 text-center">
              <Phone className="mx-auto size-7 text-[#d1d5db] mb-3" />
              <p className="text-sm text-[#374151]">No calls yet</p>
              <p className="mt-1 text-xs text-[#9ca3af]">Your call history will appear here.</p>
            </div>
          ) : (
            <>
              <div className="md:hidden divide-y divide-[#f3f4f6] rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden">
                {callHistory.map((c) => (
                  <div key={c.id} className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-[#0f1f1c]">{c.peerName ?? "Unknown guide"}</p>
                      <p className="text-xs text-[#9ca3af] shrink-0">
                        {c.createdAt?.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) ?? "—"}
                      </p>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-[#6b7280]">
                      <span className="inline-flex items-center gap-1">
                        {callStatusIcon(c.status)}
                        {callStatusLabel(c.status)}
                      </span>
                      {callDuration(c.answeredAt, c.endedAt) && (
                        <span>· {callDuration(c.answeredAt, c.endedAt)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block rounded-2xl border border-[#e5e7eb] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Guide</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Status</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Duration</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Date &amp; time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    {callHistory.map((c) => (
                      <tr key={c.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-5 py-4 font-semibold text-[#0f1f1c] whitespace-nowrap">
                          {c.peerName ?? "Unknown guide"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5">
                            {callStatusIcon(c.status)}
                            <span className="text-[#6b7280]">{callStatusLabel(c.status)}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#6b7280]">
                          {callDuration(c.answeredAt, c.endedAt) ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-xs text-[#9ca3af] whitespace-nowrap">
                          {c.createdAt?.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <DataPagination
                page={historyPage}
                totalPages={historyTotalPages}
                buildHref={(p) => `/dashboard/calls?page=${p}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
