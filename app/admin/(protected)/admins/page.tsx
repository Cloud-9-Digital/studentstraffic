import { asc } from "drizzle-orm";

import { updateAdminStatusAction } from "@/app/_actions/admin-users";
import { AdminCreateForm } from "@/components/admin/admin-create-form";
import { Badge } from "@/components/ui/badge";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { adminUsers } from "@/lib/db/schema";

function AdminStatusButton({
  adminUserId,
  isActive,
}: {
  adminUserId: number;
  isActive: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await updateAdminStatusAction(adminUserId, !isActive);
      }}
    >
      <button
        type="submit"
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          isActive
            ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
    </form>
  );
}

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminUsersPage() {
  await requireAdminSession({ minimumRole: "owner" });

  const db = getDb();

  const rows = db
    ? await db
        .select({
          id: adminUsers.id,
          fullName: adminUsers.fullName,
          email: adminUsers.email,
          role: adminUsers.role,
          isActive: adminUsers.isActive,
          lastSignedInAt: adminUsers.lastSignedInAt,
          createdAt: adminUsers.createdAt,
        })
        .from(adminUsers)
        .orderBy(asc(adminUsers.fullName))
    : [];

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Access control
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">
          Admins
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage who can access the protected dashboard.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

        {/* ── Admin list ────────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Desktop table */}
          <div className="hidden rounded-2xl border border-slate-200 bg-white md:block">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-[#0b312b]">Database admins</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {rows.length} admin{rows.length !== 1 ? "s" : ""} in the system.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Last sign in</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-[#0b312b]">{admin.fullName}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{admin.email}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-2.5 py-0.5 text-xs ${
                            admin.role === "owner"
                              ? "border-[#0b312b]/15 bg-[#0b312b]/5 text-[#0b312b]"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {admin.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-2.5 py-0.5 text-xs ${
                            admin.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-100 text-slate-500"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {admin.lastSignedInAt ? fmtDate.format(admin.lastSignedInAt) : "Never"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {admin.createdAt ? fmtDate.format(admin.createdAt) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusButton adminUserId={admin.id} isActive={admin.isActive} />
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                        No admins yet. Add your first owner or admin here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden">
            <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <h2 className="text-base font-semibold text-[#0b312b]">Database admins</h2>
              <p className="mt-0.5 text-sm text-slate-500">{rows.length} admin{rows.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="space-y-2">
              {rows.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0b312b]">{admin.fullName}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">{admin.email}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {admin.role} · Last sign in {admin.lastSignedInAt ? fmtDate.format(admin.lastSignedInAt) : "Never"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        admin.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-500"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <AdminStatusButton adminUserId={admin.id} isActive={admin.isActive} />
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-400">
                  No database admins yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar: create form + bootstrap ──────────────────────────────── */}
        <div className="space-y-4">
          <AdminCreateForm />

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-[#0b312b]">Security notes</h3>
            <p className="mt-1 text-xs text-slate-500">
              Owner accounts can manage admins and export full lead data.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              All admin create and activation changes are now audit logged.
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Keep at least one active owner account so access-control changes and exports remain available.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
