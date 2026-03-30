import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ClipboardList } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeerApplications, universities } from "@/lib/db/schema";

export default async function PeerApplicationsPage() {
  await requireAdminSession();

  const db = getDb();
  const applications = db
    ? await db
        .select({
          id: studentPeerApplications.id,
          fullName: studentPeerApplications.fullName,
          email: studentPeerApplications.email,
          phone: studentPeerApplications.phone,
          courseName: studentPeerApplications.courseName,
          currentYearOrBatch: studentPeerApplications.currentYearOrBatch,
          enrollmentStatus: studentPeerApplications.enrollmentStatus,
          status: studentPeerApplications.status,
          createdAt: studentPeerApplications.createdAt,
          universityName: universities.name,
        })
        .from(studentPeerApplications)
        .innerJoin(
          universities,
          eq(studentPeerApplications.universityId, universities.id)
        )
        .orderBy(desc(studentPeerApplications.createdAt))
    : [];

  const pending = applications.filter((a) => a.status === "pending");
  const reviewed = applications.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Community
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b]">
          Student applications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review applications from students who want to be peer guides.
        </p>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Pending review ({pending.length})
          </h2>
          <ApplicationTable applications={pending} />
        </section>
      )}

      {pending.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 py-12 text-center">
          <ClipboardList className="size-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            No pending applications
          </p>
        </div>
      )}

      {reviewed.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Reviewed ({reviewed.length})
          </h2>
          <ApplicationTable applications={reviewed} />
        </section>
      )}
    </div>
  );
}

type ApplicationRow = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  courseName: string | null;
  currentYearOrBatch: string | null;
  enrollmentStatus: string;
  status: string;
  createdAt: Date | null;
  universityName: string;
};

function ApplicationTable({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3">Name</th>
            <th className="hidden px-4 py-3 md:table-cell">University</th>
            <th className="hidden px-4 py-3 lg:table-cell">Status</th>
            <th className="hidden px-4 py-3 lg:table-cell">Applied</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{app.fullName}</p>
                <p className="text-xs text-slate-500">{app.email}</p>
              </td>
              <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                <p>{app.universityName}</p>
                {(app.courseName || app.currentYearOrBatch) && (
                  <p className="text-xs text-slate-400">
                    {[app.courseName, app.currentYearOrBatch]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <StatusBadge status={app.status} />
              </td>
              <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/peer-applications/${app.id}`}
                  className="text-xs font-medium text-[#155e53] hover:underline"
                >
                  Review →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Pending
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      Rejected
    </span>
  );
}
