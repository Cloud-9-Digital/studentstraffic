import { asc } from "drizzle-orm";
import { ShieldCheck, UserX, Clock } from "lucide-react";

import { updateAdminStatusAction } from "@/app/_actions/admin-users";
import { AdminCreateForm } from "@/components/admin/admin-create-form";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { adminUsers } from "@/lib/db/schema";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

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
            ? "border-destructive/20 bg-destructive/8 text-destructive hover:bg-destructive/15"
            : "border-status-green-border bg-status-green text-status-green-fg hover:bg-status-green/60"
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

const fmtDateTime = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
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

  const activeCount = rows.filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Access control
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-primary md:text-3xl">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage who can access the admin dashboard.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-border bg-card px-4 py-2.5 text-center">
            <p className="text-lg font-bold text-primary">{rows.length}</p>
            <p className="text-[11px] text-muted-foreground">Total</p>
          </div>
          <div className="rounded-xl border border-status-green-border bg-status-green px-4 py-2.5 text-center">
            <p className="text-lg font-bold text-status-green-fg">{activeCount}</p>
            <p className="text-[11px] text-status-green-fg/70">Active</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">

        {/* ── User list ────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">No users yet. Add your first owner or admin.</p>
            </div>
          ) : (
            rows.map((admin) => {
              const initials = getInitials(admin.fullName);
              const isOwner = admin.role === "owner";
              return (
                <div
                  key={admin.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/20"
                >
                  {/* Avatar */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isOwner
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{admin.fullName}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          isOwner
                            ? "border-primary/20 bg-primary/8 text-primary"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {admin.role}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          admin.isActive
                            ? "border-status-green-border bg-status-green text-status-green-fg"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{admin.email}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                        <Clock className="size-3" />
                        {admin.lastSignedInAt
                          ? `Last sign in ${fmtDateTime.format(admin.lastSignedInAt)}`
                          : "Never signed in"}
                      </span>
                      {admin.createdAt && (
                        <span className="text-[11px] text-muted-foreground/50">
                          Added {fmtDate.format(admin.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    <AdminStatusButton adminUserId={admin.id} isActive={admin.isActive} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <AdminCreateForm />

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Security notes</h3>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                Owners can manage users, change roles, and export all lead data.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                Keep at least one active owner account at all times.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                All user management actions are audit logged.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-destructive/15 bg-destructive/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <UserX className="size-4 text-destructive" />
              <h3 className="text-sm font-semibold text-destructive">Deactivating users</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Deactivated users cannot sign in but their data is preserved. Reactivate at any time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
