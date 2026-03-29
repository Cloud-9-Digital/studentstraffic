import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db/server";
import { peerRequests, universities } from "@/lib/db/schema";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});

const statusTone: Record<string, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  contacted: "border-amber-200 bg-amber-50 text-amber-700",
  matched: "border-emerald-200 bg-emerald-50 text-emerald-700",
  closed: "border-slate-200 bg-slate-100 text-slate-600",
};

async function PeerRequestsList() {
  await connection();

  const db = getDb();

  const rows = db
    ? await db
        .select({
          id: peerRequests.id,
          fullName: peerRequests.fullName,
          phone: peerRequests.phone,
          userState: peerRequests.userState,
          universityName: universities.name,
          status: peerRequests.status,
          createdAt: peerRequests.createdAt,
        })
        .from(peerRequests)
        .innerJoin(universities, eq(peerRequests.universityId, universities.id))
        .orderBy(desc(peerRequests.createdAt))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Requests</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">Peer Requests</h1>
        <p className="mt-1 text-sm text-slate-500">{rows.length} request{rows.length !== 1 ? "s" : ""} total</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">State</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">University</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((req) => (
                <tr key={req.id} className="group hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-medium text-[#0b312b]">{req.fullName}</td>
                  <td className="px-6 py-3.5 text-slate-500">{req.phone}</td>
                  <td className="px-6 py-3.5 text-slate-500">{req.userState}</td>
                  <td className="px-6 py-3.5 text-slate-500">{req.universityName}</td>
                  <td className="px-6 py-3.5">
                    <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusTone[req.status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">{req.createdAt ? fmtDate.format(req.createdAt) : "—"}</td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/admin/peer-requests/${req.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 opacity-0 transition-opacity group-hover:opacity-100 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                    >
                      View <ChevronRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">No peer requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="divide-y divide-slate-100 md:hidden">
          {rows.map((req) => (
            <Link key={req.id} href={`/admin/peer-requests/${req.id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
              <div className="min-w-0">
                <p className="font-semibold text-[#0b312b]">{req.fullName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{req.phone} · {req.userState}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{req.universityName}</p>
                <div className="mt-1.5">
                  <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${statusTone[req.status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    {req.status}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-xs text-slate-400">{req.createdAt ? fmtDate.format(req.createdAt) : "—"}</p>
                <ChevronRight className="size-4 text-slate-300" />
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-slate-400">No peer requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PeerRequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading…</div>}>
      <PeerRequestsList />
    </Suspense>
  );
}
