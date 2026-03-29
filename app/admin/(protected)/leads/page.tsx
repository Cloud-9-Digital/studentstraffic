import Link from "next/link";
import { desc } from "drizzle-orm";
import { ChevronRight, Download } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminLeadsPage() {
  const session = await requireAdminSession();
  const db = getDb();

  const rows = db
    ? await db
        .select({
          id: leads.id,
          fullName: leads.fullName,
          phone: leads.phone,
          userState: leads.userState,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(200)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Data</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">{rows.length} lead{rows.length !== 1 ? "s" : ""} · most recent 200</p>
        </div>
        {session.user.adminRole === "owner" ? (
          <Button asChild className="shrink-0 bg-[#0b312b] hover:bg-[#184a43]">
            <Link href="/admin/leads/export">
              <Download className="size-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Link>
          </Button>
        ) : null}
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
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((lead) => (
                <tr key={lead.id} className="group hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-medium text-[#0b312b]">{lead.fullName}</td>
                  <td className="px-6 py-3.5 text-slate-500">{lead.phone}</td>
                  <td className="px-6 py-3.5 text-slate-500">{lead.userState ?? "—"}</td>
                  <td className="px-6 py-3.5 text-slate-400">{lead.createdAt ? fmtDate.format(lead.createdAt) : "—"}</td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 opacity-0 transition-opacity group-hover:opacity-100 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                    >
                      View <ChevronRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400">No leads yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="divide-y divide-slate-100 md:hidden">
          {rows.map((lead) => (
            <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
              <div>
                <p className="font-semibold text-[#0b312b]">{lead.fullName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{lead.phone}</p>
                <p className="mt-0.5 text-xs text-slate-400">{lead.userState ?? "—"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-xs text-slate-400">{lead.createdAt ? fmtDate.format(lead.createdAt) : "—"}</p>
                <ChevronRight className="size-4 text-slate-300" />
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-slate-400">No leads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
