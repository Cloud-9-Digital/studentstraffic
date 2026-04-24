import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { LeadsFilters } from "./_components/leads-filters";
import { LeadsTable } from "./_components/leads-table";

const ITEMS_PER_PAGE = 50;

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

  const seminarEventOptions = db
    ? await db
        .selectDistinct({ value: leads.seminarEvent })
        .from(leads)
        .where(sql`${leads.seminarEvent} IS NOT NULL`)
        .orderBy(leads.seminarEvent)
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
        seminarEventOptions={seminarEventOptions}
        countryOptions={countryOptions}
      />

      <LeadsTable
        rows={rows}
        hasActiveFilters={Boolean(hasActiveFilters)}
        canDelete={session.user.adminRole === "owner"}
      />

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
