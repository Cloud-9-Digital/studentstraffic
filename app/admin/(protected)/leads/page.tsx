import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { LeadsFilters } from "./_components/leads-filters";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const ITEMS_PER_PAGE = 50;

function whatsappStatusTone(status: string | null) {
  switch (status) {
    case "read":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "delivered":
    case "sent":
    case "accepted":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "replied":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
    case "failed":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    case "skipped":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

type SearchParams = Promise<{
  page?: string;
  search?: string;
  sourcePath?: string;
  seminarEvent?: string;
  interestedCountry?: string;
}>;

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdminSession();
  const db = getDb();

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search?.trim() || "";
  const sourcePath = params.sourcePath || "";
  const seminarEvent = params.seminarEvent || "";
  const interestedCountry = params.interestedCountry || "";

  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Build where conditions
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(leads.fullName, `%${search}%`),
        ilike(leads.phone, `%${search}%`),
        ilike(leads.email, `%${search}%`),
        ilike(leads.fatherName, `%${search}%`)
      )
    );
  }

  if (sourcePath) {
    conditions.push(eq(leads.sourcePath, sourcePath));
  }

  if (seminarEvent) {
    conditions.push(ilike(leads.seminarEvent, `%${seminarEvent}%`));
  }

  if (interestedCountry) {
    conditions.push(eq(leads.interestedCountry, interestedCountry));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [countResult] = db
    ? await db
        .select({ count: sql<number>`count(*)::int` })
        .from(leads)
        .where(whereClause)
    : [{ count: 0 }];

  const totalCount = countResult?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get leads for current page
  const rows = db
    ? await db
        .select({
          id: leads.id,
          fullName: leads.fullName,
          phone: leads.phone,
          userState: leads.userState,
          city: leads.city,
          seminarEvent: leads.seminarEvent,
          interestedCountry: leads.interestedCountry,
          sourcePath: leads.sourcePath,
          watiMessageStatus: leads.watiMessageStatus,
          watiTemplateName: leads.watiTemplateName,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .where(whereClause)
        .orderBy(desc(leads.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
    : [];

  // Get unique values for filters
  const sourcePathOptions = db
    ? await db
        .selectDistinct({ value: leads.sourcePath })
        .from(leads)
        .where(sql`${leads.sourcePath} IS NOT NULL`)
        .orderBy(leads.sourcePath)
    : [];

  const countryOptions = db
    ? await db
        .selectDistinct({ value: leads.interestedCountry })
        .from(leads)
        .where(sql`${leads.interestedCountry} IS NOT NULL`)
        .orderBy(leads.interestedCountry)
    : [];

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    const current = {
      page: params.page,
      search: params.search,
      sourcePath: params.sourcePath,
      seminarEvent: params.seminarEvent,
      interestedCountry: params.interestedCountry,
      ...updates,
    };

    Object.entries(current).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    const qs = newParams.toString();
    return qs ? `?${qs}` : "";
  };

  const hasActiveFilters = search || sourcePath || seminarEvent || interestedCountry;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Data</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalCount.toLocaleString()} lead{totalCount !== 1 ? "s" : ""}
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>
        {session.user.adminRole === "owner" ? (
          <Button asChild className="shrink-0 bg-primary !text-white hover:bg-surface-dark-2">
            <Link href="/admin/leads/export">
              <Download className="size-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Link>
          </Button>
        ) : null}
      </div>

      {/* Filters and Search */}
      <LeadsFilters
        sourcePathOptions={sourcePathOptions}
        countryOptions={countryOptions}
      />

      {/* Leads Table */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">City</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">WhatsApp</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-medium text-[#0b312b]">{lead.fullName}</td>
                    <td className="px-6 py-3.5 text-slate-500">{lead.phone}</td>
                    <td className="px-6 py-3.5 text-slate-500">{lead.city || lead.userState || "—"}</td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {lead.seminarEvent ? (
                        <span className="text-xs">{lead.seminarEvent.split("—")[0]?.trim()}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{lead.interestedCountry || "—"}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${whatsappStatusTone(lead.watiMessageStatus)}`}>
                          {lead.watiMessageStatus.replaceAll("_", " ")}
                        </span>
                        {lead.watiTemplateName ? (
                          <span className="text-[11px] text-slate-400">{lead.watiTemplateName}</span>
                        ) : null}
                      </div>
                    </td>
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
                  <tr><td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-400">
                    {hasActiveFilters ? "No leads match your filters." : "No leads yet."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile list */}
        <div className="divide-y divide-slate-100 md:hidden">
          {rows.map((lead) => (
            <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#0b312b]">{lead.fullName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{lead.phone}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{lead.city || lead.userState || "—"}</span>
                  {lead.interestedCountry && (
                    <>
                      <span>•</span>
                      <span>{lead.interestedCountry}</span>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${whatsappStatusTone(lead.watiMessageStatus)}`}>
                    WhatsApp: {lead.watiMessageStatus.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-xs text-slate-400">{lead.createdAt ? fmtDate.format(lead.createdAt) : "—"}</p>
                <ChevronRight className="size-4 text-slate-300" />
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-slate-400">
              {hasActiveFilters ? "No leads match your filters." : "No leads yet."}
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/admin/leads${buildQueryString({ page: String(page - 1) })}`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-300 cursor-not-allowed">
                <ChevronLeft className="size-4" />
                Previous
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={`/admin/leads${buildQueryString({ page: String(page + 1) })}`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
              >
                Next
                <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-300 cursor-not-allowed">
                Next
                <ChevronRight className="size-4" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
