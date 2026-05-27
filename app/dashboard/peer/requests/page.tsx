import { redirect } from "next/navigation";
import { and, count, desc, eq, ne } from "drizzle-orm";
import { Inbox, Clock, Check, X } from "lucide-react";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { env } from "@/lib/env";
import { peerCallBookings, studentPeers, universities, users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";
import { DataPagination } from "@/components/ui/data-pagination";
import { RequestActions } from "./request-actions";
import { PeerStartCallButton } from "./peer-start-call-button";

export const metadata = { title: "Call Requests | Dashboard" };

const HISTORY_PER_PAGE = 10;

const AVATAR_COLORS = [
  "bg-[#0f3d37] text-white",
  "bg-[#c2410c] text-white",
  "bg-violet-600 text-white",
  "bg-sky-600 text-white",
  "bg-emerald-600 text-white",
  "bg-pink-600 text-white",
];

function InitialsAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const dim = size === "sm" ? "size-8 text-[10px]" : "size-10 text-xs";
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-bold ${dim} ${color}`}>
      {initials}
    </div>
  );
}

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

function formatDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

  const userId = await resolveDbUserId(session.user.email);
  if (!userId) redirect("/login");

  const [peer] = await db
    .select({ id: studentPeers.id, universityName: universities.name })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(eq(studentPeers.peerUserId, userId))
    .limit(1);

  if (!peer) redirect("/join");

  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const historyPage = Math.max(1, parseInt(rawPage ?? "1", 10));
  const historyOffset = (historyPage - 1) * HISTORY_PER_PAGE;

  const [pendingRequests, respondedRequests, [{ total }]] = await Promise.all([
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
      .limit(HISTORY_PER_PAGE)
      .offset(historyOffset),

    db
      .select({ total: count() })
      .from(peerCallBookings)
      .where(and(eq(peerCallBookings.peerId, peer.id), ne(peerCallBookings.status, "pending"))),
  ]);

  const historyTotalPages = Math.max(1, Math.ceil(total / HISTORY_PER_PAGE));

  return (
    <div className="space-y-10">

      {/* ── Pending requests ── */}
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f1f1c]">Call Requests</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              {pendingRequests.length === 0
                ? "No pending requests right now."
                : `${pendingRequests.length} student${pendingRequests.length === 1 ? "" : "s"} waiting for your response.`}
            </p>
          </div>
          {pendingRequests.length > 0 && (
            <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
              {pendingRequests.length}
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-14 text-center">
            <Inbox className="mx-auto size-9 text-[#d1d5db] mb-3" />
            <p className="text-sm font-semibold text-[#374151]">All clear</p>
            <p className="mt-1 text-xs text-[#9ca3af] max-w-xs mx-auto">
              When students request a call with you, they&apos;ll appear here for you to accept or decline.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile flat list */}
            <div className="md:hidden divide-y divide-[#f3f4f6] rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
              {pendingRequests.map((req) => {
                const displayName = req.studentName ?? req.studentEmail.split("@")[0];
                return (
                  <div key={req.id} className="px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <InitialsAvatar name={displayName} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#0f1f1c]">{displayName}</p>
                        <a
                          href={`mailto:${req.studentEmail}`}
                          className="truncate block text-xs text-[#6b7280] hover:text-[#0f3d37] hover:underline"
                        >
                          {req.studentEmail}
                        </a>
                      </div>
                      <p className="shrink-0 text-[10px] text-[#9ca3af]">{formatDate(req.createdAt)}</p>
                    </div>
                    {req.message ? (
                      <div className="mb-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5">
                        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">Message</p>
                        <p className="text-sm text-[#374151] leading-relaxed">{req.message}</p>
                      </div>
                    ) : (
                      <p className="mb-3 text-xs italic text-[#9ca3af]">No message included.</p>
                    )}
                    <RequestActions bookingId={req.id} fullWidth />
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Student</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">What they want to discuss</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Requested</th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#6b7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {pendingRequests.map((req) => {
                    const displayName = req.studentName ?? req.studentEmail.split("@")[0];
                    return (
                      <tr key={req.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar name={displayName} />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#0f1f1c] whitespace-nowrap">{displayName}</p>
                              <a
                                href={`mailto:${req.studentEmail}`}
                                className="text-xs text-[#9ca3af] hover:text-[#0f3d37] hover:underline"
                              >
                                {req.studentEmail}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          {req.message ? (
                            <p className="line-clamp-2 text-xs text-[#6b7280] leading-relaxed">{req.message}</p>
                          ) : (
                            <p className="text-xs italic text-[#9ca3af]">No message</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-[#9ca3af] whitespace-nowrap">
                          {formatDate(req.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <RequestActions bookingId={req.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── History ── */}
      {(respondedRequests.length > 0 || historyPage > 1) && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">History</h2>
            <p className="mt-0.5 text-xs text-[#9ca3af]">
              {total} responded request{total === 1 ? "" : "s"}
            </p>
          </div>

          {/* Mobile flat list */}
          <div className="md:hidden divide-y divide-[#f3f4f6] rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            {respondedRequests.map((req) => {
              const displayName = req.studentName ?? req.studentEmail.split("@")[0];
              return (
                <div key={req.id} className="flex items-center gap-3 px-4 py-3.5">
                  <InitialsAvatar name={displayName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0f1f1c]">{displayName}</p>
                    <p className="text-[10px] text-[#9ca3af]">{formatDate(req.createdAt)}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {req.status === "accepted" && env.hasAgoraVoice && (
                      <PeerStartCallButton
                        bookingId={req.id}
                        studentName={displayName}
                        universityName={peer.universityName}
                      />
                    )}
                    {!env.hasAgoraVoice && statusBadge(req.status)}
                    {env.hasAgoraVoice && req.status !== "accepted" && statusBadge(req.status)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Student</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Message</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Date</th>
                  {env.hasAgoraVoice && (
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#6b7280]">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {respondedRequests.map((req) => {
                  const displayName = req.studentName ?? req.studentEmail.split("@")[0];
                  return (
                    <tr key={req.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={displayName} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-[#0f1f1c] whitespace-nowrap">{displayName}</p>
                            <p className="text-xs text-[#9ca3af]">{req.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="line-clamp-2 text-xs text-[#6b7280]">{req.message ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {statusBadge(req.status)}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#9ca3af] whitespace-nowrap">
                        {formatDate(req.createdAt)}
                      </td>
                      {env.hasAgoraVoice && (
                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            {req.status === "accepted" ? (
                              <PeerStartCallButton
                                bookingId={req.id}
                                studentName={displayName}
                                universityName={peer.universityName}
                              />
                            ) : (
                              <span className="text-xs text-[#9ca3af]">—</span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <DataPagination
            page={historyPage}
            totalPages={historyTotalPages}
            buildHref={(p) => `/dashboard/peer/requests?page=${p}`}
          />
        </div>
      )}
    </div>
  );
}
