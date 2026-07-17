import Link from "next/link";
import { sql } from "drizzle-orm";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  MousePointerClick,
  Target,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

const INDIA_TIME_ZONE = "Asia/Kolkata";
const NEET_PREDICTOR_SOURCE_PATH = "/neet-college-predictor";
const ANALYTICS_START_DATE = "2026-07-17";
const DAY_IN_MS = 86_400_000;
const CATEGORY_GROUPS = [
  { key: "General", label: "General", shortLabel: "Gen", color: "bg-[#2f6fed]" },
  { key: "OBC", label: "OBC", shortLabel: "OBC", color: "bg-[#d97706]" },
  { key: "SC", label: "SC", shortLabel: "SC", color: "bg-[#db5a8b]" },
  { key: "ST", label: "ST", shortLabel: "ST", color: "bg-[#738b28]" },
  { key: "Other", label: "Other", shortLabel: "Other", color: "bg-slate-500" },
] as const;

type SearchParams = Promise<{ from?: string; to?: string; date?: string }>;

type SummaryRow = {
  submissions: number;
  uniquePhones: number;
  minScore: number | null;
  maxScore: number | null;
  qualified: number;
  notQualified: number;
  incomplete: number;
  metaAttributed: number;
  unattributed: number;
  firstAt: Date | string | null;
  latestAt: Date | string | null;
};

type ScoreBandRow = {
  label: string;
  sortOrder: number;
  submissions: number;
};

type CategoryRow = {
  category: string;
  cutoff: number;
  submissions: number;
  qualified: number;
  notQualified: number;
  minScore: number | null;
  maxScore: number | null;
};

type CampaignRow = {
  source: string;
  medium: string;
  campaign: string;
  submissions: number;
};

type HourRow = {
  hour: number;
  submissions: number;
};

type RegionSummaryRow = {
  region: string;
  submissions: number;
  qualified: number;
  notQualified: number;
  minScore: number | null;
  maxScore: number | null;
};

type RegionScoreBandRow = {
  region: string;
  category: string;
  label: string;
  sortOrder: number;
  submissions: number;
};

function getIndiaDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isValidDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function getIndiaDayBounds(value: string) {
  const start = new Date(`${value}T00:00:00+05:30`);
  return { start, end: new Date(start.getTime() + DAY_IN_MS) };
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatIndiaTime(value: Date | string | null) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: INDIA_TIME_ZONE,
  }).format(date);
}

function number(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function percentage(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Users;
  tone?: "neutral" | "positive" | "warning";
}) {
  const toneClasses = {
    neutral: "bg-[#0b312b]/8 text-[#0b312b]",
    positive: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className={`rounded-xl p-2.5 ${toneClasses[tone]}`}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

export default async function NeetPredictorAnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminSession();

  const params = await searchParams;
  const today = getIndiaDate();
  const requestedFrom = isValidDate(params.from) ? params.from! : ANALYTICS_START_DATE;
  const requestedTo = isValidDate(params.to)
    ? params.to!
    : isValidDate(params.date)
      ? params.date!
      : today;
  const clampedFrom = requestedFrom < ANALYTICS_START_DATE
    ? ANALYTICS_START_DATE
    : requestedFrom > today
      ? today
      : requestedFrom;
  const clampedTo = requestedTo < ANALYTICS_START_DATE
    ? ANALYTICS_START_DATE
    : requestedTo > today
      ? today
      : requestedTo;
  const selectedFrom = clampedFrom <= clampedTo ? clampedFrom : clampedTo;
  const selectedTo = clampedFrom <= clampedTo ? clampedTo : clampedFrom;
  const { start } = getIndiaDayBounds(selectedFrom);
  const { end } = getIndiaDayBounds(selectedTo);
  const db = getDb();

  const emptySummary: SummaryRow = {
    submissions: 0,
    uniquePhones: 0,
    minScore: null,
    maxScore: null,
    qualified: 0,
    notQualified: 0,
    incomplete: 0,
    metaAttributed: 0,
    unattributed: 0,
    firstAt: null,
    latestAt: null,
  };

  const [
    summaryResult,
    scoreBandResult,
    categoryResult,
    campaignResult,
    hourResult,
    regionSummaryResult,
    regionScoreBandResult,
  ] = db
    ? await Promise.all([
        db.execute<SummaryRow>(sql`
          WITH classified AS (
            SELECT
              *,
              CASE
                WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) = 'GENERAL'
                THEN 213
                ELSE 177
              END AS cutoff
            FROM ${leads}
            WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
              AND ${leads.createdAt} >= ${start}
              AND ${leads.createdAt} < ${end}
          )
          SELECT
            count(*)::int AS "submissions",
            count(DISTINCT phone)::int AS "uniquePhones",
            min(neet_score)::int AS "minScore",
            max(neet_score)::int AS "maxScore",
            count(*) FILTER (
              WHERE neet_score IS NOT NULL
                AND neet_category IS NOT NULL
                AND btrim(neet_category) <> ''
                AND neet_score >= cutoff
            )::int AS "qualified",
            count(*) FILTER (
              WHERE neet_score IS NOT NULL
                AND neet_category IS NOT NULL
                AND btrim(neet_category) <> ''
                AND neet_score < cutoff
            )::int AS "notQualified",
            count(*) FILTER (
              WHERE neet_score IS NULL OR neet_category IS NULL OR btrim(neet_category) = ''
            )::int AS "incomplete",
            count(*) FILTER (
              WHERE lower(coalesce(utm_source, '')) IN ('facebook', 'fb', 'meta')
                OR lower(coalesce(utm_medium, '')) IN ('paid_social', 'facebook_mobile_reels')
                OR fbclid IS NOT NULL
            )::int AS "metaAttributed",
            count(*) FILTER (
              WHERE coalesce(utm_source, '') = ''
                AND coalesce(utm_medium, '') = ''
                AND gclid IS NULL
                AND fbclid IS NULL
                AND gbraid IS NULL
                AND wbraid IS NULL
            )::int AS "unattributed",
            min(created_at) AS "firstAt",
            max(created_at) AS "latestAt"
          FROM classified
        `),
        db.execute<ScoreBandRow>(sql`
          SELECT
            CASE
              WHEN ${leads.neetScore} IS NULL THEN 'Missing score'
              WHEN ${leads.neetScore} < 177 THEN '0–176'
              WHEN ${leads.neetScore} < 213 THEN '177–212'
              WHEN ${leads.neetScore} < 300 THEN '213–299'
              WHEN ${leads.neetScore} < 400 THEN '300–399'
              WHEN ${leads.neetScore} < 500 THEN '400–499'
              WHEN ${leads.neetScore} < 600 THEN '500–599'
              ELSE '600–720'
            END AS "label",
            CASE
              WHEN ${leads.neetScore} IS NULL THEN 8
              WHEN ${leads.neetScore} < 177 THEN 1
              WHEN ${leads.neetScore} < 213 THEN 2
              WHEN ${leads.neetScore} < 300 THEN 3
              WHEN ${leads.neetScore} < 400 THEN 4
              WHEN ${leads.neetScore} < 500 THEN 5
              WHEN ${leads.neetScore} < 600 THEN 6
              ELSE 7
            END::int AS "sortOrder",
            count(*)::int AS "submissions"
          FROM ${leads}
          WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
            AND ${leads.createdAt} >= ${start}
            AND ${leads.createdAt} < ${end}
          GROUP BY 1, 2
          ORDER BY 2
        `),
        db.execute<CategoryRow>(sql`
          WITH classified AS (
            SELECT
              coalesce(nullif(btrim(${leads.neetCategory}), ''), 'Unknown') AS category,
              ${leads.neetScore} AS score,
              CASE
                WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) = 'GENERAL'
                THEN 213
                ELSE 177
              END AS cutoff
            FROM ${leads}
            WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
              AND ${leads.createdAt} >= ${start}
              AND ${leads.createdAt} < ${end}
          )
          SELECT
            category AS "category",
            cutoff::int AS "cutoff",
            count(*)::int AS "submissions",
            count(*) FILTER (WHERE score >= cutoff)::int AS "qualified",
            count(*) FILTER (WHERE score < cutoff)::int AS "notQualified",
            min(score)::int AS "minScore",
            max(score)::int AS "maxScore"
          FROM classified
          GROUP BY category, cutoff
          ORDER BY count(*) DESC, category
        `),
        db.execute<CampaignRow>(sql`
          SELECT
            coalesce(nullif(btrim(${leads.utmSource}), ''), 'Unattributed') AS "source",
            coalesce(nullif(btrim(${leads.utmMedium}), ''), '—') AS "medium",
            coalesce(nullif(btrim(${leads.utmCampaign}), ''), 'No campaign') AS "campaign",
            count(*)::int AS "submissions"
          FROM ${leads}
          WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
            AND ${leads.createdAt} >= ${start}
            AND ${leads.createdAt} < ${end}
          GROUP BY 1, 2, 3
          ORDER BY 4 DESC, 3
          LIMIT 8
        `),
        db.execute<HourRow>(sql`
          SELECT
            extract(hour FROM ${leads.createdAt} AT TIME ZONE ${INDIA_TIME_ZONE})::int AS "hour",
            count(*)::int AS "submissions"
          FROM ${leads}
          WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
            AND ${leads.createdAt} >= ${start}
            AND ${leads.createdAt} < ${end}
          GROUP BY 1
          ORDER BY 1
        `),
        db.execute<RegionSummaryRow>(sql`
          WITH classified AS (
            SELECT
              CASE
                WHEN lower(btrim(coalesce(${leads.userState}, ''))) = 'tamil nadu'
                THEN 'Tamil Nadu'
                ELSE 'Other states'
              END AS region,
              ${leads.neetScore} AS score,
              CASE
                WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) = 'GENERAL'
                THEN 213
                ELSE 177
              END AS cutoff
            FROM ${leads}
            WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
              AND ${leads.createdAt} >= ${start}
              AND ${leads.createdAt} < ${end}
          )
          SELECT
            region AS "region",
            count(*)::int AS "submissions",
            count(*) FILTER (WHERE score >= cutoff)::int AS "qualified",
            count(*) FILTER (WHERE score < cutoff)::int AS "notQualified",
            min(score)::int AS "minScore",
            max(score)::int AS "maxScore"
          FROM classified
          GROUP BY region
          ORDER BY CASE WHEN region = 'Tamil Nadu' THEN 0 ELSE 1 END
        `),
        db.execute<RegionScoreBandRow>(sql`
          SELECT
            CASE
              WHEN lower(btrim(coalesce(${leads.userState}, ''))) = 'tamil nadu'
              THEN 'Tamil Nadu'
              ELSE 'Other states'
            END AS "region",
            CASE
              WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) = 'GENERAL' THEN 'General'
              WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) LIKE 'OBC%' THEN 'OBC'
              WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) = 'SC' THEN 'SC'
              WHEN upper(btrim(coalesce(${leads.neetCategory}, ''))) = 'ST' THEN 'ST'
              ELSE 'Other'
            END AS "category",
            CASE
              WHEN ${leads.neetScore} IS NULL THEN 'Missing score'
              WHEN ${leads.neetScore} < 177 THEN '0–176'
              WHEN ${leads.neetScore} < 213 THEN '177–212'
              WHEN ${leads.neetScore} < 300 THEN '213–299'
              WHEN ${leads.neetScore} < 400 THEN '300–399'
              WHEN ${leads.neetScore} < 500 THEN '400–499'
              WHEN ${leads.neetScore} < 600 THEN '500–599'
              ELSE '600–720'
            END AS "label",
            CASE
              WHEN ${leads.neetScore} IS NULL THEN 8
              WHEN ${leads.neetScore} < 177 THEN 1
              WHEN ${leads.neetScore} < 213 THEN 2
              WHEN ${leads.neetScore} < 300 THEN 3
              WHEN ${leads.neetScore} < 400 THEN 4
              WHEN ${leads.neetScore} < 500 THEN 5
              WHEN ${leads.neetScore} < 600 THEN 6
              ELSE 7
            END::int AS "sortOrder",
            count(*)::int AS "submissions"
          FROM ${leads}
          WHERE ${leads.sourcePath} = ${NEET_PREDICTOR_SOURCE_PATH}
            AND ${leads.createdAt} >= ${start}
            AND ${leads.createdAt} < ${end}
          GROUP BY 1, 2, 3, 4
          ORDER BY 4, 1, 2
        `),
      ])
    : [
        { rows: [emptySummary] },
        { rows: [] as ScoreBandRow[] },
        { rows: [] as CategoryRow[] },
        { rows: [] as CampaignRow[] },
        { rows: [] as HourRow[] },
        { rows: [] as RegionSummaryRow[] },
        { rows: [] as RegionScoreBandRow[] },
      ];

  const rawSummary = summaryResult.rows[0] ?? emptySummary;
  const summary: SummaryRow = {
    ...rawSummary,
    submissions: number(rawSummary.submissions),
    uniquePhones: number(rawSummary.uniquePhones),
    qualified: number(rawSummary.qualified),
    notQualified: number(rawSummary.notQualified),
    incomplete: number(rawSummary.incomplete),
    metaAttributed: number(rawSummary.metaAttributed),
    unattributed: number(rawSummary.unattributed),
    minScore: rawSummary.minScore === null ? null : number(rawSummary.minScore),
    maxScore: rawSummary.maxScore === null ? null : number(rawSummary.maxScore),
  };
  const scoreBands = scoreBandResult.rows.map((row) => ({
    ...row,
    submissions: number(row.submissions),
  }));
  const categories = categoryResult.rows.map((row) => ({
    ...row,
    cutoff: number(row.cutoff),
    submissions: number(row.submissions),
    qualified: number(row.qualified),
    notQualified: number(row.notQualified),
  }));
  const campaigns = campaignResult.rows.map((row) => ({
    ...row,
    submissions: number(row.submissions),
  }));
  const hourlyMap = new Map(hourResult.rows.map((row) => [number(row.hour), number(row.submissions)]));
  const hours = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    submissions: hourlyMap.get(hour) ?? 0,
  }));
  const regionNames = ["Tamil Nadu", "Other states"] as const;
  const regionSummaries = regionNames.map((region) => {
    const row = regionSummaryResult.rows.find((candidate) => candidate.region === region);
    return {
      region,
      submissions: number(row?.submissions),
      qualified: number(row?.qualified),
      notQualified: number(row?.notQualified),
      minScore: row?.minScore === null || row?.minScore === undefined ? null : number(row.minScore),
      maxScore: row?.maxScore === null || row?.maxScore === undefined ? null : number(row.maxScore),
    };
  });
  const regionScoreBands = regionScoreBandResult.rows.map((row) => ({
    ...row,
    submissions: number(row.submissions),
  }));

  const qualifiedRate = percentage(summary.qualified, summary.qualified + summary.notQualified);
  const maxHour = Math.max(...hours.map((row) => row.submissions), 1);
  const rangeDayCount =
    Math.round(
      (new Date(`${selectedTo}T00:00:00Z`).getTime() -
        new Date(`${selectedFrom}T00:00:00Z`).getTime()) /
        DAY_IN_MS,
    ) + 1;
  const isSingleDay = selectedFrom === selectedTo;

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/leads/neet-predictor"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="size-4" /> Back to submissions
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/leads/neet-predictor">
              View lead list <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Performance
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">
              NEET Predictor Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {formatDisplayDate(selectedFrom)}–{formatDisplayDate(selectedTo)} · India time
              {summary.latestAt ? ` · Latest submission ${formatIndiaTime(summary.latestAt)}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <form className="flex flex-wrap items-end gap-2" method="get">
              <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400" htmlFor="analytics-from">
                From
                <input
                  id="analytics-from"
                  name="from"
                  type="date"
                  min={ANALYTICS_START_DATE}
                  max={today}
                  defaultValue={selectedFrom}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-700 shadow-xs outline-none focus:border-[#0b312b]/40 focus:ring-2 focus:ring-[#0b312b]/10"
                />
              </label>
              <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400" htmlFor="analytics-to">
                To
                <input
                  id="analytics-to"
                  name="to"
                  type="date"
                  min={ANALYTICS_START_DATE}
                  max={today}
                  defaultValue={selectedTo}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-700 shadow-xs outline-none focus:border-[#0b312b]/40 focus:ring-2 focus:ring-[#0b312b]/10"
                />
              </label>
              <Button type="submit" variant="outline" size="sm">
                Apply range
              </Button>
            </form>
            <Button asChild variant="outline" size="sm">
              <Link href={`?from=${today}&to=${today}`}>Today</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="?">Since 17 Jul</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Submissions"
          value={summary.submissions.toLocaleString("en-IN")}
          detail={`${summary.uniquePhones.toLocaleString("en-IN")} unique phone numbers`}
          icon={Users}
        />
        <MetricCard
          label="Qualified"
          value={summary.qualified.toLocaleString("en-IN")}
          detail={`${qualifiedRate.toFixed(1)}% of classified submissions`}
          icon={CheckCircle2}
          tone="positive"
        />
        <MetricCard
          label="Not qualified"
          value={summary.notQualified.toLocaleString("en-IN")}
          detail="Below the category-specific qualifying mark"
          icon={CircleAlert}
          tone="warning"
        />
        <MetricCard
          label="Score range"
          value={summary.minScore === null ? "—" : `${summary.minScore}–${summary.maxScore}`}
          detail={summary.incomplete ? `${summary.incomplete} incomplete submission(s)` : "All submissions include score and category"}
          icon={Target}
        />
        <MetricCard
          label="Meta attributed"
          value={summary.metaAttributed.toLocaleString("en-IN")}
          detail={`${summary.unattributed.toLocaleString("en-IN")} unattributed submission${summary.unattributed === 1 ? "" : "s"}`}
          icon={MousePointerClick}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">Qualification result</h2>
              <p className="mt-1 text-sm text-slate-500">
                General: 213 · All other categories: 177
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-600">
              {qualifiedRate.toFixed(1)}% qualified
            </span>
          </div>

          <div className="mt-7 h-5 overflow-hidden rounded-full bg-amber-100" aria-label={`${summary.qualified} qualified and ${summary.notQualified} not qualified`}>
            <div
              className="h-full rounded-full bg-[#176b5b]"
              style={{ width: `${qualifiedRate}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Qualified</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-emerald-900">{summary.qualified.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Not qualified</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-amber-900">{summary.notQualified.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            OBC-NCL, SC, ST, EWS, PwD, unknown, and future category values use the 177 cutoff.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">Submissions by hour</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isSingleDay
                ? `Hourly volume on ${formatDisplayDate(selectedFrom)}`
                : `Combined hour-of-day pattern across ${rangeDayCount} selected days`} · IST
            </p>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1" aria-label="Hourly submissions chart">
            {hours.map((row) => (
              <div key={row.hour} className="group relative flex h-full min-w-0 flex-1 items-end">
                <div
                  className="w-full rounded-t bg-[#0b312b]/75 transition-colors group-hover:bg-[#0b312b]"
                  style={{ height: `${(row.submissions / maxHour) * 100}%` }}
                  title={`${String(row.hour).padStart(2, "0")}:00 — ${row.submissions} submissions`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-400">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">Score distribution</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tamil Nadu versus other states · n={summary.submissions.toLocaleString("en-IN")}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Two separate regional distributions
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {regionSummaries.map((region) => {
              const isTamilNadu = region.region === "Tamil Nadu";
              const regionColor = isTamilNadu ? "bg-[#176b5b]" : "bg-[#d69b2d]";
              const regionText = isTamilNadu ? "text-[#176b5b]" : "text-[#9a6814]";
              const qualifiedRateForRegion = percentage(
                region.qualified,
                region.qualified + region.notQualified,
              );

              return (
                <div
                  key={region.region}
                  className={`overflow-hidden rounded-2xl border bg-white ${
                    isTamilNadu ? "border-[#176b5b]/25" : "border-[#d69b2d]/35"
                  }`}
                >
                  <div className={`h-1.5 ${regionColor}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-[0.14em] ${regionText}`}>
                          {region.region}
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-mono text-3xl font-semibold text-slate-900">
                            {region.submissions.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-slate-400">submissions</span>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-mono text-lg font-semibold text-slate-700">
                          {percentage(region.submissions, summary.submissions).toFixed(1)}%
                        </p>
                        <p className="text-slate-400">of all leads</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                      <span>
                        Score range <strong className="font-mono text-slate-700">
                          {region.minScore === null ? "—" : `${region.minScore}–${region.maxScore}`}
                        </strong>
                      </span>
                      <span>
                        Qualified <strong className="font-mono text-slate-700">
                          {qualifiedRateForRegion.toFixed(1)}%
                        </strong>
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 border-y border-slate-100 py-3">
                      {CATEGORY_GROUPS.map((category) => {
                        const categoryCount = regionScoreBands
                          .filter(
                            (row) =>
                              row.region === region.region && row.category === category.key,
                          )
                          .reduce((total, row) => total + row.submissions, 0);

                        return (
                          <span
                            key={category.key}
                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500"
                          >
                            <span className={`size-2.5 rounded-sm ${category.color}`} />
                            {category.label}
                            <strong className="font-mono text-slate-700">{categoryCount}</strong>
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-5 space-y-3">
                      {scoreBands.map((band) => {
                        const categoryCounts = CATEGORY_GROUPS.map((category) => ({
                          ...category,
                          count:
                            regionScoreBands.find(
                              (row) =>
                                row.region === region.region &&
                                row.label === band.label &&
                                row.category === category.key,
                            )?.submissions ?? 0,
                        }));
                        const count = categoryCounts.reduce(
                          (total, category) => total + category.count,
                          0,
                        );
                        const share = percentage(count, region.submissions);

                        return (
                          <div key={band.label}>
                            <div className="grid grid-cols-[62px_minmax(0,1fr)] items-center gap-3">
                              <span className="font-mono text-xs text-slate-500">{band.label}</span>
                              <div className="relative h-6 overflow-hidden rounded-md bg-slate-100">
                                <div
                                  className="flex h-full overflow-hidden rounded-md"
                                  style={{ width: `${share}%` }}
                                >
                                  {categoryCounts.map((category) => (
                                    <div
                                      key={category.key}
                                      className={`h-full ${category.color}`}
                                      style={{
                                        width: `${percentage(category.count, count)}%`,
                                      }}
                                      title={`${category.label}: ${category.count}`}
                                    />
                                  ))}
                                </div>
                                <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[11px] font-semibold text-slate-700">
                                  {count}
                                </span>
                              </div>
                            </div>
                            <div className="ml-[74px] mt-1 flex flex-wrap gap-x-2.5 gap-y-1">
                              {categoryCounts
                                .filter((category) => category.count > 0)
                                .map((category) => (
                                  <span
                                    key={category.key}
                                    className="inline-flex items-center gap-1 text-[9px] text-slate-400"
                                  >
                                    <span className={`size-1.5 rounded-sm ${category.color}`} />
                                    {category.shortLabel} {category.count}
                                  </span>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[11px] leading-5 text-slate-400">
            Each panel is normalized to its own regional total. Blank or unrecognized states are included in Other states.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5">
            <h2 className="font-display text-lg font-semibold text-slate-900">Category breakdown</h2>
            <p className="mt-1 text-sm text-slate-500">Cutoff, qualification result, and observed score range</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 text-right font-semibold">Cutoff</th>
                  <th className="px-3 py-3 text-right font-semibold">Qualified</th>
                  <th className="px-3 py-3 text-right font-semibold">Not</th>
                  <th className="px-5 py-3 text-right font-semibold">Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((row) => (
                  <tr key={row.category}>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {row.category}
                      <span className="ml-2 font-mono text-xs text-slate-400">{row.submissions}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-600">{row.cutoff}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-semibold text-emerald-700">{row.qualified}</td>
                    <td className="px-3 py-3.5 text-right font-mono font-semibold text-amber-700">{row.notQualified}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-600">
                      {row.minScore === null ? "—" : `${row.minScore}–${row.maxScore}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 p-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">Campaign attribution</h2>
            <p className="mt-1 text-sm text-slate-500">UTM attribution recorded on NEET predictor submissions</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {summary.metaAttributed.toLocaleString("en-IN")} Meta attributed
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Medium</th>
                <th className="px-5 py-3 font-semibold">Campaign</th>
                <th className="px-5 py-3 text-right font-semibold">Submissions</th>
                <th className="px-5 py-3 text-right font-semibold">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((row) => (
                <tr key={`${row.source}-${row.medium}-${row.campaign}`}>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{row.source}</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.medium}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.campaign}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-800">{row.submissions}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-500">
                    {percentage(row.submissions, summary.submissions).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" /> Source: website leads · `/neet-college-predictor`
        </span>
        <span>
          Reporting window: {formatDisplayDate(selectedFrom)} through {formatDisplayDate(selectedTo)} · Latest submission {formatIndiaTime(summary.latestAt)} IST
        </span>
      </footer>
    </div>
  );
}
