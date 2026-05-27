import { redirect } from "next/navigation";
import { Users, Phone, PhoneOff, PhoneMissed, Clock } from "lucide-react";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallSessions, peerRequests, studentPeers, users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";

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

export default async function PeerStudentsPage() {
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

  const [students, callHistory] = await Promise.all([
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
          .limit(50)
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-8">
      {/* Students section */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">My Students</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {students.length === 0
              ? "No students have contacted you yet."
              : `${students.length} student${students.length === 1 ? "" : "s"} have contacted you.`}
          </p>
        </div>

        {students.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
            <Users className="mx-auto size-8 text-[#d1d5db] mb-3" />
            <p className="text-sm font-medium text-[#374151]">No students yet</p>
            <p className="mt-1 text-xs text-[#9ca3af]">When students contact you, they will appear here.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Course interest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-[#fafafa]">
                    <td className="px-4 py-3 font-medium text-[#0f1f1c] whitespace-nowrap">{s.fullName}</td>
                    <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">
                      {s.userCity ? `${s.userCity}, ${s.userState}` : s.userState}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">{s.courseInterest ?? "—"}</td>
                    <td className="px-4 py-3 text-[#6b7280]">
                      {s.email
                        ? <a href={`mailto:${s.email}`} className="hover:text-[#0f3d37] hover:underline">{s.email}</a>
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#9ca3af] whitespace-nowrap">
                      {s.createdAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call activity section */}
      {env.hasAgoraVoice && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f1f1c]">Call activity</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {callHistory.length === 0 ? "No calls yet." : `${callHistory.length} call${callHistory.length === 1 ? "" : "s"} recorded.`}
            </p>
          </div>

          {callHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white p-8 text-center">
              <Phone className="mx-auto size-7 text-[#d1d5db] mb-3" />
              <p className="text-sm text-[#374151]">No calls yet</p>
              <p className="mt-1 text-xs text-[#9ca3af]">When students call you, the history appears here.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {callHistory.map((c) => (
                    <tr key={c.id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3 font-medium text-[#0f1f1c] whitespace-nowrap">
                        {c.callerName ?? "Unknown student"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          {callStatusIcon(c.status)}
                          <span className="text-[#6b7280]">{callStatusLabel(c.status)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6b7280]">
                        {callDuration(c.answeredAt, c.endedAt) ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[#9ca3af] whitespace-nowrap">
                        {c.createdAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
