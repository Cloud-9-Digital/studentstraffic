import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ChevronRight, Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeers, universities } from "@/lib/db/schema";
import { togglePeerStatusAction } from "@/app/_actions/manage-peer";

const statusTone: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-slate-200 bg-slate-100 text-slate-500",
};

function ToggleStatusButton({
  peerId,
  status,
}: {
  peerId: number;
  status: "active" | "inactive";
}) {
  return (
    <form
      action={async () => {
        "use server";
        await togglePeerStatusAction(peerId, status);
      }}
    >
      <button
        type="submit"
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          status === "active"
            ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {status === "active" ? "Deactivate" : "Activate"}
      </button>
    </form>
  );
}

async function PeersList() {
  await connection();

  const db = getDb();

  const rows = db
    ? await db
        .select({
          id: studentPeers.id,
          fullName: studentPeers.fullName,
          courseName: studentPeers.courseName,
          currentYearOrBatch: studentPeers.currentYearOrBatch,
          contactPhone: studentPeers.contactPhone,
          status: studentPeers.status,
          universityName: universities.name,
          universitySlug: universities.slug,
        })
        .from(studentPeers)
        .innerJoin(universities, eq(studentPeers.universityId, universities.id))
        .orderBy(asc(universities.name), asc(studentPeers.fullName))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Peer profiles
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length} student{rows.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link
          href="/admin/peers/new"
          className="flex items-center gap-1.5 rounded-xl bg-[#0b312b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f3d37]"
        >
          <Plus className="size-4" />
          Add student
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">University</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Course / Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">WhatsApp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((peer) => (
                <tr key={peer.id} className="group hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-medium text-[#0b312b]">{peer.fullName}</td>
                  <td className="px-6 py-3.5 text-slate-500">{peer.universityName}</td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {[peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {peer.contactPhone ? (
                      <span className="text-emerald-600">✓ Set</span>
                    ) : (
                      <span className="text-slate-300">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusTone[peer.status] ?? ""}`}
                    >
                      {peer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <ToggleStatusButton peerId={peer.id} status={peer.status} />
                      <Link
                        href={`/admin/peers/${peer.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                      >
                        Edit <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    No students added yet.{" "}
                    <Link href="/admin/peers/new" className="text-[#0b312b] underline underline-offset-2">
                      Add your first student.
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="divide-y divide-slate-100 md:hidden">
          {rows.map((peer) => (
            <div key={peer.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-semibold text-[#0b312b]">{peer.fullName}</p>
                <p className="mt-0.5 truncate text-sm text-slate-500">{peer.universityName}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {[peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ") || "No course info"}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${statusTone[peer.status] ?? ""}`}
                  >
                    {peer.status}
                  </Badge>
                  {peer.contactPhone && (
                    <span className="text-[10px] font-medium text-emerald-600">WhatsApp ✓</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <ToggleStatusButton peerId={peer.id} status={peer.status} />
                <Link
                  href={`/admin/peers/${peer.id}`}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#0b312b]"
                >
                  Edit <ChevronRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-slate-400">No students added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function PeersPage() {
  await requireAdminSession();

  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading…</div>}>
      <PeersList />
    </Suspense>
  );
}
