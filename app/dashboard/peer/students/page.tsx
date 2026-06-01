import { redirect } from "next/navigation";
import { Users, Phone, PhoneOff, PhoneMissed, Clock } from "lucide-react";
import { count, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallSessions, peerRequests, studentPeers, users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";
import { DataPagination } from "@/components/ui/data-pagination";

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
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
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

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) redirect("/login");

  const [peer] = await db
    .select({ id: studentPeers.id })
    .from(studentPeers)
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) redirect("/join");

  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const historyPage = Math.max(1, parseInt(rawPage ?? "1", 10));
  const historyOffset = (historyPage - 1) * HISTORY_PER_PAGE;

  const [students, callHistory, historyCountResult] = await Promise.all([
    db
      .select({
        id: peerRequests.id,
        fullName: peerRequests.fullName,
        email: peerRequests.email,
        userState: peerRequests.userState,
        userCity: peerRequests.userCity,
        courseInterest: peerRequests.courseInterest,
        createdAt: peerRequests.createdAt,
      })
      .from(peerRequests)
      .where(eq(peerRequests.matchedPeerId, peer.id))
      .orderBy(desc(peerRequests.createdAt)),

    env.hasAgoraVoice
      ? db
          .select({
            id: peerCallSessions.id,
            callerName: users.name,
            status: peerCallSessions.status,
            startedAt: peerCallSessions.startedAt,
            answeredAt: peerCallSessions.answeredAt,
            endedAt: peerCallSessions.endedAt,
            createdAt: peerCallSessions.createdAt,
          })
          .from(peerCallSessions)
          .leftJoin(users, eq(peerCallSessions.callerUserId, users.id))
          .where(eq(peerCallSessions.peerId, peer.id))
          .orderBy(desc(peerCallSessions.createdAt))
          .limit(HISTORY_PER_PAGE)
          .offset(historyOffset)
      : Promise.resolve([]),

    env.hasAgoraVoice
      ? db
          .select({ total: count() })
          .from(peerCallSessions)
          .where(eq(peerCallSessions.peerId, peer.id))
      : Promise.resolve([{ total: 0 }]),
  ]);

  const historyTotal = historyCountResult[0]?.total ?? 0;
  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PER_PAGE));

  return (
    <div className="space-y-10 pb-8">

      {/* Students section */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Students</h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            {students.length === 0
              ? "No students have contacted you yet."
              : `${students.length} student${students.length === 1 ? "" : "s"} have contacted you.`}
          </p>
        </div>

        {students.length === 0 ? (
          <div className="py-14 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#f0f7f5]">
              <Users className="size-7 text-[#0f3d37]" />
            </div>
            <p className="text-sm font-semibold text-[#374151]">No students yet</p>
            <p className="mt-1 text-xs text-[#9ca3af]">When students contact you, they will appear here.</p>
          </div>
        ) : (
          <>
            {/* Mobile flat list */}
            <div className="md:hidden divide-y divide-[#eaeaea]">
              {students.map((s) => (
                <div key={s.id} className="py-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-[#0f1f1c]">{s.fullName}</p>
                    <p className="text-xs text-[#9ca3af] shrink-0">
                      {s.createdAt?.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                    </p>
                  </div>
                  {(s.userCity || s.userState) && (
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      {s.userCity ? `${s.userCity}, ${s.userState}` : s.userState}
                    </p>
                  )}
                  {s.courseInterest && (
                    <p className="mt-0.5 text-xs text-[#6b7280]">{s.courseInterest}</p>
                  )}
                  {s.email && (
                    <a href={`mailto:${s.email}`} className="mt-1 block text-xs font-medium text-[#0f3d37] hover:underline">
                      {s.email}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#eaeaea]">
                    <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Name</th>
                    <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Location</th>
                    <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Course interest</th>
                    <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Email</th>
                    <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaea]">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-4 pr-6 font-medium text-[#0f1f1c] whitespace-nowrap">{s.fullName}</td>
                      <td className="py-4 pr-6 text-[#6b7280] whitespace-nowrap">
                        {s.userCity ? `${s.userCity}, ${s.userState}` : (s.userState ?? "—")}
                      </td>
                      <td className="py-4 pr-6 text-[#6b7280]">{s.courseInterest ?? "—"}</td>
                      <td className="py-4 pr-6 text-[#6b7280]">
                        {s.email
                          ? <a href={`mailto:${s.email}`} className="hover:text-[#0f3d37] hover:underline">{s.email}</a>
                          : "—"}
                      </td>
                      <td className="py-4 text-[#9ca3af] whitespace-nowrap text-xs">
                        {s.createdAt?.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Call activity */}
      {env.hasAgoraVoice && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Call activity</p>
            {historyTotal > 0 && (
              <p className="mt-0.5 text-sm text-[#6b7280]">
                {historyTotal} call{historyTotal === 1 ? "" : "s"} recorded.
              </p>
            )}
          </div>

          {historyTotal === 0 ? (
            <div className="py-10 text-center">
              <Phone className="mx-auto size-7 text-[#d1d5db] mb-3" />
              <p className="text-sm text-[#374151]">No calls yet</p>
              <p className="mt-1 text-xs text-[#9ca3af]">When students call you, the history appears here.</p>
            </div>
          ) : (
            <>
              {/* Mobile list */}
              <div className="md:hidden divide-y divide-[#eaeaea]">
                {callHistory.map((c) => (
                  <div key={c.id} className="py-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-[#0f1f1c]">{c.callerName ?? "Unknown student"}</p>
                      <p className="text-xs text-[#9ca3af] shrink-0">
                        {c.createdAt?.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) ?? "—"}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#6b7280]">
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

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#eaeaea]">
                      <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Student</th>
                      <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Status</th>
                      <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Duration</th>
                      <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaea]">
                    {callHistory.map((c) => (
                      <tr key={c.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="py-4 pr-6 font-medium text-[#0f1f1c] whitespace-nowrap">
                          {c.callerName ?? "Unknown student"}
                        </td>
                        <td className="py-4 pr-6">
                          <span className="inline-flex items-center gap-1.5">
                            {callStatusIcon(c.status)}
                            <span className="text-[#6b7280]">{callStatusLabel(c.status)}</span>
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-[#6b7280]">
                          {callDuration(c.answeredAt, c.endedAt) ?? "—"}
                        </td>
                        <td className="py-4 text-xs text-[#9ca3af] whitespace-nowrap">
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
                buildHref={(p) => `/dashboard/peer/students?page=${p}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
