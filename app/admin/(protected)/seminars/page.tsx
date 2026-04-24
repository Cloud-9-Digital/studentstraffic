import Link from "next/link";
import {
  and,
  asc,
  count,
  desc,
  gte,
  isNotNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  FileText,
  MapPin,
  MessageCircle,
  RefreshCw,
  Users,
} from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";
import { formatNumber } from "@/lib/utils";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const inputDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type SearchParams = Promise<{
  from?: string;
  to?: string;
}>;

type BreakdownRow = {
  label: string;
  count: number;
};

function parseStartDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseEndDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T23:59:59.999+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatInputDate(date: Date) {
  return inputDateFmt.format(date);
}

function percentage(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function barWidth(value: number, max: number) {
  if (!max) return "0%";
  return `${Math.max(8, Math.round((value / max) * 100))}%`;
}

function buildRangeHref(days: number) {
  const now = new Date();
  const from = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  return `/admin/seminars?from=${formatInputDate(from)}&to=${formatInputDate(now)}`;
}

function BreakdownTable({
  title,
  subtitle,
  rows,
  total,
}: {
  title: string;
  subtitle: string;
  rows: BreakdownRow[];
  total: number;
}) {
  const max = rows[0]?.count ?? 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#0b312b]">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {rows.length ? (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-slate-700">{row.label}</p>
                <p className="shrink-0 text-xs font-semibold text-slate-400">
                  {formatNumber(row.count)} · {percentage(row.count, total)}
                </p>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-[#0b312b]"
                  style={{ width: barWidth(row.count, max) }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No data for this range yet.</p>
      )}
    </section>
  );
}

export default async function AdminSeminarAnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminSession();
  const db = getDb();
  const params = await searchParams;

  const now = new Date();
  const defaultFrom = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const from = parseStartDate(params.from) ?? parseStartDate(formatInputDate(defaultFrom))!;
  const to = parseEndDate(params.to) ?? parseEndDate(formatInputDate(now))!;

  const rangeConditions = [
    or(like(leads.sourcePath, "/seminar-2026%"), isNotNull(leads.seminarEvent)),
    gte(leads.createdAt, from),
    lte(leads.createdAt, to),
  ];

  const whereClause = and(...rangeConditions);

  const eventExpr = sql<string>`coalesce(${leads.seminarEvent}, 'Unspecified')`;
  const cityExpr = sql<string>`coalesce(${leads.city}, 'Unspecified')`;
  const ctaExpr = sql<string>`coalesce(${leads.ctaVariant}, 'Unknown')`;
  const sourceExpr = sql<string>`coalesce(${leads.sourcePath}, 'Unknown')`;
  const countryExpr = sql<string>`coalesce(${leads.interestedCountry}, 'Unspecified')`;
  const dayExpr = sql<string>`to_char(date(${leads.createdAt} at time zone 'Asia/Kolkata'), 'DD Mon')`;
  const dayKeyExpr = sql<string>`to_char(date(${leads.createdAt} at time zone 'Asia/Kolkata'), 'YYYY-MM-DD')`;

  const [
    summaryRows,
    eventRows,
    cityRows,
    ctaRows,
    sourceRows,
    countryRows,
    dailyRows,
    recentRows,
  ] = db
    ? await Promise.all([
        db
          .select({
            totalLeads: count(),
            distinctEvents: sql<number>`count(distinct ${leads.seminarEvent})::int`,
            distinctCities: sql<number>`count(distinct ${leads.city})::int`,
            crmSynced: sql<number>`count(*) filter (where ${leads.crmSyncStatus} = 'synced')::int`,
            watiReached: sql<number>`count(*) filter (where ${leads.watiMessageStatus} in ('sent', 'accepted', 'delivered', 'read', 'replied'))::int`,
            fmgeRequests: sql<number>`count(*) filter (where ${leads.needsFmgeSession} = true)::int`,
            docsUploaded: sql<number>`count(*) filter (where ${leads.documentUrl} is not null)::int`,
          })
          .from(leads)
          .where(whereClause),
        db
          .select({
            label: eventExpr,
            count: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(whereClause)
          .groupBy(eventExpr)
          .orderBy(desc(sql`count(*)`), asc(eventExpr))
          .limit(8),
        db
          .select({
            label: cityExpr,
            count: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(whereClause)
          .groupBy(cityExpr)
          .orderBy(desc(sql`count(*)`), asc(cityExpr))
          .limit(8),
        db
          .select({
            label: ctaExpr,
            count: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(whereClause)
          .groupBy(ctaExpr)
          .orderBy(desc(sql`count(*)`), asc(ctaExpr))
          .limit(8),
        db
          .select({
            label: sourceExpr,
            count: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(whereClause)
          .groupBy(sourceExpr)
          .orderBy(desc(sql`count(*)`), asc(sourceExpr))
          .limit(8),
        db
          .select({
            label: countryExpr,
            count: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(whereClause)
          .groupBy(countryExpr)
          .orderBy(desc(sql`count(*)`), asc(countryExpr))
          .limit(8),
        db
          .select({
            day: dayExpr,
            dayKey: dayKeyExpr,
            count: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(whereClause)
          .groupBy(dayExpr, dayKeyExpr)
          .orderBy(asc(dayKeyExpr))
          .limit(31),
        db
          .select({
            id: leads.id,
            fullName: leads.fullName,
            city: leads.city,
            seminarEvent: leads.seminarEvent,
            ctaVariant: leads.ctaVariant,
            crmSyncStatus: leads.crmSyncStatus,
            watiMessageStatus: leads.watiMessageStatus,
            createdAt: leads.createdAt,
          })
          .from(leads)
          .where(whereClause)
          .orderBy(desc(leads.createdAt))
          .limit(10),
      ])
    : [[], [], [], [], [], [], [], []];

  const summary = summaryRows[0] ?? {
    totalLeads: 0,
    distinctEvents: 0,
    distinctCities: 0,
    crmSynced: 0,
    watiReached: 0,
    fmgeRequests: 0,
    docsUploaded: 0,
  };

  const totalLeads = summary.totalLeads ?? 0;
  const dailyMax = Math.max(...dailyRows.map((row) => row.count), 0);

  const topCards = [
    {
      label: "Seminar Leads",
      value: formatNumber(totalLeads),
      meta: `${formatNumber(summary.distinctEvents ?? 0)} events in range`,
      icon: Users,
      tone: "text-[#0b312b]",
      bg: "bg-[#0b312b]/8",
    },
    {
      label: "CRM Synced",
      value: percentage(summary.crmSynced ?? 0, totalLeads),
      meta: `${formatNumber(summary.crmSynced ?? 0)} synced`,
      icon: RefreshCw,
      tone: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "WhatsApp Reached",
      value: percentage(summary.watiReached ?? 0, totalLeads),
      meta: `${formatNumber(summary.watiReached ?? 0)} reached`,
      icon: MessageCircle,
      tone: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Home Cities",
      value: formatNumber(summary.distinctCities ?? 0),
      meta: "Distinct student cities",
      icon: MapPin,
      tone: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "FMGE Requests",
      value: formatNumber(summary.fmgeRequests ?? 0),
      meta: percentage(summary.fmgeRequests ?? 0, totalLeads),
      icon: BarChart3,
      tone: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Documents Uploaded",
      value: formatNumber(summary.docsUploaded ?? 0),
      meta: percentage(summary.docsUploaded ?? 0, totalLeads),
      icon: FileText,
      tone: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0b312b] p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
              Seminar reporting
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
              Seminar Analytics
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/55">
              Event demand, capture quality, submission sources, and messaging health from the
              seminar funnel inside the website admin.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Active range
            </p>
            <p className="mt-1 font-medium text-white">
              {formatInputDate(from)} to {formatInputDate(to)}
            </p>
          </div>
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            From
          </span>
          <input
            type="date"
            name="from"
            defaultValue={formatInputDate(from)}
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0b312b]/30"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            To
          </span>
          <input
            type="date"
            name="to"
            defaultValue={formatInputDate(to)}
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#0b312b]/30"
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0b312b] px-4 text-sm font-medium text-white transition hover:bg-[#11463e]"
          >
            Apply range
          </button>
          <Link
            href="/admin/seminars"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildRangeHref(7)}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
        >
          Last 7 days
        </Link>
        <Link
          href={buildRangeHref(30)}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
        >
          Last 30 days
        </Link>
        <Link
          href={buildRangeHref(90)}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
        >
          Last 90 days
        </Link>
        <Link
          href="/admin/leads?sourcePath=%2Fseminar-2026"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
        >
          Open leads
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {topCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
              <div className={`mb-3 inline-flex size-9 items-center justify-center rounded-xl ${card.bg}`}>
                <Icon className={`size-4 ${card.tone}`} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {card.label}
              </p>
              <p className={`mt-1 font-display text-3xl font-semibold md:text-4xl ${card.tone}`}>
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{card.meta}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#0b312b]">Daily Submission Trend</h2>
            <p className="mt-1 text-sm text-slate-500">
              Seminar lead volume by day in the selected range.
            </p>
          </div>

          {dailyRows.length ? (
            <div className="space-y-3">
              {dailyRows.map((row) => (
                <div key={row.dayKey} className="grid grid-cols-[72px_1fr_52px] items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">{row.day}</span>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[#0b312b]"
                      style={{ width: barWidth(row.count, dailyMax) }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-500">
                    {formatNumber(row.count)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No submissions in this range yet.</p>
          )}
        </section>

        <BreakdownTable
          title="Top Seminar Events"
          subtitle="Which seminar dates are driving the most demand."
          rows={eventRows}
          total={totalLeads}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <BreakdownTable
          title="Home Cities"
          subtitle="Where students are registering from."
          rows={cityRows}
          total={totalLeads}
        />
        <BreakdownTable
          title="CTA Variants"
          subtitle="Which capture point generated the registration."
          rows={ctaRows}
          total={totalLeads}
        />
        <BreakdownTable
          title="Source Paths"
          subtitle="Page-level submission split for seminar traffic."
          rows={sourceRows}
          total={totalLeads}
        />
        <BreakdownTable
          title="Interested Countries"
          subtitle="Country preference captured during seminar registration."
          rows={countryRows}
          total={totalLeads}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-base font-semibold text-[#0b312b] md:text-lg">Recent Seminar Leads</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Latest captured registrations for the active date range.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <CalendarRange className="size-3.5" />
            {formatNumber(recentRows.length)} shown
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Event</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Capture</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">CRM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">WhatsApp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRows.length ? (
                recentRows.map((row) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50/40">
                    <td className="px-6 py-4">
                      <Link href={`/admin/leads/${row.id}`} className="font-medium text-[#0b312b] hover:underline">
                        {row.fullName}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">{row.city || "City not captured"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.seminarEvent || "Unspecified"}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{row.ctaVariant}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                        {row.crmSyncStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                        {row.watiMessageStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {row.createdAt ? fmtDate.format(row.createdAt) : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    No seminar leads found for this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
