import { redirect } from "next/navigation";
import { and, desc, eq, ne } from "drizzle-orm";
import { Inbox, Clock, Check, X } from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerCallBookings, studentPeers, users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";
import { RequestActions } from "./request-actions";

export const metadata = { title: "Call Requests | Dashboard" };

function statusBadge(status: string) {
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <Check className="size-3" /> Accepted
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
        <X className="size-3" /> Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
      <Clock className="size-3" /> Pending
    </span>
  );
}

export default async function PeerRequestsPage() {
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

  const [pendingRequests, respondedRequests] = await Promise.all([
    db
      .select({
        id: peerCallBookings.id,
        message: peerCallBookings.message,
        createdAt: peerCallBookings.createdAt,
        studentName: users.name,
        studentEmail: users.email,
      })
      .from(peerCallBookings)
      .innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
      .where(and(eq(peerCallBookings.peerId, peer.id), eq(peerCallBookings.status, "pending")))
      .orderBy(desc(peerCallBookings.createdAt)),

    db
      .select({
        id: peerCallBookings.id,
        status: peerCallBookings.status,
        message: peerCallBookings.message,
        createdAt: peerCallBookings.createdAt,
        studentName: users.name,
        studentEmail: users.email,
      })
      .from(peerCallBookings)
      .innerJoin(users, eq(peerCallBookings.studentUserId, users.id))
      .where(and(eq(peerCallBookings.peerId, peer.id), ne(peerCallBookings.status, "pending")))
      .orderBy(desc(peerCallBookings.createdAt))
      .limit(50),
  ]);

  return (
    <div className="space-y-10">
      {/* Pending requests */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f1c]">Call Requests</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {pendingRequests.length === 0
              ? "No pending requests."
              : `${pendingRequests.length} student${pendingRequests.length === 1 ? "" : "s"} waiting for your response.`}
          </p>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
            <Inbox className="mx-auto size-8 text-[#d1d5db] mb-3" />
            <p className="text-sm font-medium text-[#374151]">No pending requests</p>
            <p className="mt-1 text-xs text-[#9ca3af]">When students request a call with you, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const displayName = req.studentName ?? req.studentEmail.split("@")[0];
              return (
                <div key={req.id} className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div>
                        <p className="font-semibold text-sm text-[#0f1f1c]">{displayName}</p>
                        <a
                          href={`mailto:${req.studentEmail}`}
                          className="text-xs text-[#6b7280] hover:text-[#0f3d37] hover:underline"
                        >
                          {req.studentEmail}
                        </a>
                      </div>
                      {req.message && (
                        <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5">
                          <p className="text-xs font-semibold text-[#9ca3af] mb-1">Their message</p>
                          <p className="text-sm text-[#374151] leading-relaxed">{req.message}</p>
                        </div>
                      )}
                      <p className="text-xs text-[#9ca3af]">
                        Requested{" "}
                        {req.createdAt?.toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) ?? "—"}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <RequestActions bookingId={req.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History */}
      {respondedRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">History</h2>
          <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {respondedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#fafafa]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0f1f1c] whitespace-nowrap">
                        {req.studentName ?? req.studentEmail.split("@")[0]}
                      </p>
                      <p className="text-xs text-[#9ca3af]">{req.studentEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6b7280] max-w-xs">
                      <p className="line-clamp-2 text-xs">{req.message ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {statusBadge(req.status)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">
                      {req.createdAt?.toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
