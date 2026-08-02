import Link from "next/link";
import { desc, gte, ilike, sql } from "drizzle-orm";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { notFoundEvents } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const ITEMS_PER_PAGE = 50;

const RANGE_OPTIONS = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
  all: "All time",
} as const;

type RangeKey = keyof typeof RANGE_OPTIONS;

type SearchParams = Promise<{
  page?: string;
  search?: string;
  range?: string;
}>;

export default async function AdminNotFoundLogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminSession();
  const db = getDb();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const search = params.search?.trim() || "";
  const range: RangeKey =
    params.range && params.range in RANGE_OPTIONS
      ? (params.range as RangeKey)
      : "30";
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const since =
    range === "all"
      ? undefined
      : new Date(Date.now() - Number(range) * 24 * 60 * 60 * 1000);

  const conditions = [
    search ? ilike(notFoundEvents.path, `%${search}%`) : undefined,
    since ? gte(notFoundEvents.createdAt, since) : undefined,
  ].filter((condition) => condition !== undefined);

  const whereClause =
    conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

  // One pass: overall totals for the selected range (independent of pagination).
  const [summary] = db
    ? await db
        .select({
          totalHits: sql<number>`count(*)::int`,
          distinctPaths: sql<number>`count(distinct ${notFoundEvents.path})::int`,
        })
        .from(notFoundEvents)
        .where(whereClause)
    : [{ totalHits: 0, distinctPaths: 0 }];

  const totalHits = summary?.totalHits ?? 0;
  const totalPaths = summary?.distinctPaths ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalPaths / ITEMS_PER_PAGE));

  // Grouped, paginated by path — aggregation happens in Postgres, not in app code.
  const rows = db
    ? await db
        .select({
          path: notFoundEvents.path,
          hitCount: sql<number>`count(*)::int`,
          firstSeen: sql<Date>`min(${notFoundEvents.createdAt})`,
          lastSeen: sql<Date>`max(${notFoundEvents.createdAt})`,
        })
        .from(notFoundEvents)
        .where(whereClause)
        .groupBy(notFoundEvents.path)
        .orderBy(desc(sql`count(*)`))
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
    : [];

  // Latest referrer per path, scoped to just this page's rows.
  const referrerByPath = new Map<string, string | null>();
  if (db && rows.length > 0) {
    const latestReferrers = await db
      .selectDistinctOn([notFoundEvents.path], {
        path: notFoundEvents.path,
        referrer: notFoundEvents.referrer,
      })
      .from(notFoundEvents)
      .where(
        sql`${notFoundEvents.path} IN ${rows.map((row) => row.path)}`
      )
      .orderBy(notFoundEvents.path, desc(notFoundEvents.createdAt));

    for (const entry of latestReferrers) {
      referrerByPath.set(entry.path, entry.referrer);
    }
  }

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    const current = {
      page: params.page,
      search: params.search,
      range: params.range,
      ...updates,
    };

    Object.entries(current).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    const qs = newParams.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Analytics
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">
          404 Logs
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Real visitor hits on missing pages, grouped by path. Use this to
          catch dead links worth redirecting.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total hits ({RANGE_OPTIONS[range]})
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-[#0b312b]">
            {totalHits.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Distinct paths
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-[#0b312b]">
            {totalPaths.toLocaleString()}
          </p>
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input
          type="text"
          name="search"
          placeholder="Search path"
          defaultValue={search}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-0 transition focus:border-[#0b312b]/30 md:col-span-2"
        />
        <select
          name="range"
          defaultValue={range}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-0 transition focus:border-[#0b312b]/30"
        >
          {Object.entries(RANGE_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-xl bg-[#0b312b] px-4 text-sm font-medium text-white transition hover:bg-[#11463e]"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Path</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Hits</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">First seen</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Last seen</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Latest referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.path} className="align-top hover:bg-slate-50/40">
                  <td className="px-6 py-4">
                    <a
                      href={absoluteUrl(row.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#0b312b] hover:underline"
                    >
                      {row.path}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 ring-1 ring-red-200">
                      {row.hitCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {fmtDate.format(row.firstSeen)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {fmtDate.format(row.lastSeen)}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-xs text-slate-500">
                    {referrerByPath.get(row.path) || "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400">
                    No 404s recorded for this range.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({totalPaths.toLocaleString()} paths)
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/admin/not-found-logs${buildQueryString({ page: String(page - 1) })}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                href={`/admin/not-found-logs${buildQueryString({ page: String(page + 1) })}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
