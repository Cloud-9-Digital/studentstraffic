import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { NeetLeadsSearch } from "./_components/neet-leads-search";
import { NeetLeadsTable } from "./_components/neet-leads-table";

const ITEMS_PER_PAGE = 50;
const NEET_PREDICTOR_SOURCE_PATH = "/neet-college-predictor";

type SearchParams = Promise<{
  page?: string;
  search?: string;
}>;

export default async function NeetPredictorLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireAdminSession();
  const db = getDb();

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search?.trim() || "";

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const conditions = [eq(leads.sourcePath, NEET_PREDICTOR_SOURCE_PATH)];

  if (search) {
    conditions.push(
      or(
        ilike(leads.fullName, `%${search}%`),
        ilike(leads.phone, `%${search}%`),
        ilike(leads.email, `%${search}%`)
      )!
    );
  }

  const whereClause = and(...conditions);

  const { countResult, rows } = db
    ? await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(leads)
          .where(whereClause),
        db
          .select({
            id: leads.id,
            fullName: leads.fullName,
            phone: leads.phone,
            email: leads.email,
            userState: leads.userState,
            neetScore: leads.neetScore,
            neetCategory: leads.neetCategory,
            createdAt: leads.createdAt,
          })
          .from(leads)
          .where(whereClause)
          .orderBy(desc(leads.createdAt))
          .limit(ITEMS_PER_PAGE)
          .offset(offset),
      ]).then(([countRows, leadRows]) => ({
        countResult: countRows[0],
        rows: leadRows,
      }))
    : { countResult: { count: 0 }, rows: [] };

  const totalCount = countResult?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    const current = { page: params.page, search: params.search, ...updates };

    Object.entries(current).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    const qs = newParams.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Leads
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Data
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">
              NEET College Predictor Leads
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {totalCount.toLocaleString()} lead{totalCount !== 1 ? "s" : ""}
              {search && " (filtered)"}
            </p>
          </div>
        </div>
      </div>

      <NeetLeadsSearch />

      <NeetLeadsTable
        rows={rows}
        hasActiveFilters={Boolean(search)}
        canDelete={session.user.adminRole === "owner"}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/admin/leads/neet-predictor${buildQueryString({ page: String(page - 1) })}`}
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
                href={`/admin/leads/neet-predictor${buildQueryString({ page: String(page + 1) })}`}
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
