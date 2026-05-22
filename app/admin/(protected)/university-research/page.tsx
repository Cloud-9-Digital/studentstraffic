import Link from "next/link";
import { asc, count, eq, sql } from "drizzle-orm";
import { ExternalLink, Eye, FileSearch, Globe2, GraduationCap, Link2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import {
  universityResearchDrafts,
  universityResearchQueue,
  universities,
} from "@/lib/db/schema";
import { formatNumber } from "@/lib/utils";

const fmtDateTime = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function toneForStatus(status: string) {
  switch (status) {
    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "draft_ready":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "researching":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "hold":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function toneForPriority(priority: string) {
  switch (priority) {
    case "high":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

export default async function AdminUniversityResearchPage() {
  await requireAdminSession();
  const db = getDb();

  let metrics = {
    total: 0,
    draftReady: 0,
    researching: 0,
    published: 0,
  };
  let rows: Array<{
    id: number;
    countrySlug: string;
    schoolName: string;
    cityName: string | null;
    priority: string;
    status: string;
    wdomsSchoolId: string;
    publishedUniversitySlug: string | null;
    matchedUniversitySlug: string | null;
    draftId: number | null;
    officialWebsite: string | null;
    qualityScore: number | null;
    verifiedAt: Date | null;
    lastAttemptedAt: Date | null;
    updatedAt: Date | null;
  }> = [];

  if (db) {
    const [[totalRow], [draftReadyRow], [researchingRow], [publishedRow], resultRows] =
      await Promise.all([
        db.select({ value: count() }).from(universityResearchQueue),
        db
          .select({ value: count() })
          .from(universityResearchQueue)
          .where(eq(universityResearchQueue.status, "draft_ready")),
        db
          .select({ value: count() })
          .from(universityResearchQueue)
          .where(eq(universityResearchQueue.status, "researching")),
        db
          .select({ value: count() })
          .from(universityResearchQueue)
          .where(eq(universityResearchQueue.status, "published")),
        db
          .select({
            id: universityResearchQueue.id,
            countrySlug: universityResearchQueue.countrySlug,
            schoolName: universityResearchQueue.schoolName,
            cityName: universityResearchQueue.cityName,
            priority: universityResearchQueue.priority,
            status: universityResearchQueue.status,
            wdomsSchoolId: universityResearchQueue.wdomsSchoolId,
            publishedUniversitySlug: universityResearchQueue.publishedUniversitySlug,
            matchedUniversitySlug: universities.slug,
            draftId: universityResearchDrafts.id,
            officialWebsite: universityResearchDrafts.officialWebsite,
            qualityScore: universityResearchDrafts.qualityScore,
            verifiedAt: universityResearchDrafts.verifiedAt,
            lastAttemptedAt: universityResearchQueue.lastAttemptedAt,
            updatedAt: universityResearchQueue.updatedAt,
          })
          .from(universityResearchQueue)
          .leftJoin(
            universityResearchDrafts,
            eq(universityResearchDrafts.queueId, universityResearchQueue.id),
          )
          .leftJoin(
            universities,
            eq(universityResearchQueue.matchedUniversityId, universities.id),
          )
          .orderBy(
            sql`case ${universityResearchQueue.priority}
                  when 'high' then 0
                  when 'medium' then 1
                  else 2
                end`,
            sql`case ${universityResearchQueue.status}
                  when 'draft_ready' then 0
                  when 'researching' then 1
                  when 'new' then 2
                  when 'hold' then 3
                  when 'published' then 4
                  else 5
                end`,
            asc(universityResearchQueue.countrySlug),
            asc(universityResearchQueue.schoolName),
          ),
      ]);

    metrics = {
      total: totalRow.value,
      draftReady: draftReadyRow.value,
      researching: researchingRow.value,
      published: publishedRow.value,
    };
    rows = resultRows;
  }

  const metricCards = [
    {
      label: "Queue size",
      value: formatNumber(metrics.total),
      icon: FileSearch,
      tone: "text-[#0b312b] bg-[#0b312b]/8",
    },
    {
      label: "Draft ready",
      value: formatNumber(metrics.draftReady),
      icon: Link2,
      tone: "text-sky-700 bg-sky-50",
    },
    {
      label: "Researching",
      value: formatNumber(metrics.researching),
      icon: GraduationCap,
      tone: "text-amber-700 bg-amber-50",
    },
    {
      label: "Published",
      value: formatNumber(metrics.published),
      icon: Globe2,
      tone: "text-emerald-700 bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0b312b] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
          University publishing pipeline
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
          University Research Queue
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-white/55">
          Internal WDOMS-backed backlog for research, draft creation, and publishing into live university pages.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5"
            >
              <div
                className={`mb-3 inline-flex size-9 items-center justify-center rounded-xl ${metric.tone}`}
              >
                <Icon className="size-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {metric.label}
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-[#0b312b] md:text-4xl">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 md:px-6">
          <h2 className="text-base font-semibold text-[#0b312b] md:text-lg">
            Queue
          </h2>
          <p className="text-sm text-slate-500">
            Review what is still in queue, what already has a draft, and what has been published to live university pages.
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No research queue items found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-4 px-5 py-4 md:px-6 xl:flex-row xl:items-start xl:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-900">{row.schoolName}</p>
                    <Badge className={toneForPriority(row.priority)}>
                      {row.priority}
                    </Badge>
                    <Badge className={toneForStatus(row.status)}>
                      {row.status.replace("_", " ")}
                    </Badge>
                    {row.draftId ? (
                      <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                        draft #{row.draftId}
                      </Badge>
                    ) : null}
                    {row.publishedUniversitySlug ? (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        live
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{row.countrySlug}</span>
                    {row.cityName ? <span>{row.cityName}</span> : null}
                    <span className="font-mono">{row.wdomsSchoolId}</span>
                    {row.qualityScore !== null ? (
                      <span>Quality {row.qualityScore}</span>
                    ) : (
                      <span>No quality score yet</span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p>
                      Official website:{" "}
                      {row.officialWebsite ? (
                        <a
                          href={row.officialWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-700 hover:text-[#0b312b]"
                        >
                          {row.officialWebsite}
                        </a>
                      ) : (
                        "Not captured yet"
                      )}
                    </p>
                    <p>
                      Last draft verification:{" "}
                      {row.verifiedAt ? fmtDateTime.format(row.verifiedAt) : "No draft yet"}
                    </p>
                    <p>
                      Last queue update:{" "}
                      {row.updatedAt ? fmtDateTime.format(row.updatedAt) : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {row.publishedUniversitySlug ? (
                    <>
                      <a
                        href={`/universities/${row.publishedUniversitySlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                      >
                        <Eye className="size-3.5" />
                        View live
                      </a>
                      <Link
                        href={`/admin/university-research?published=${row.publishedUniversitySlug}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                      >
                        {row.publishedUniversitySlug}
                      </Link>
                    </>
                  ) : null}

                  {row.officialWebsite ? (
                    <a
                      href={row.officialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                    >
                      <ExternalLink className="size-3.5" />
                      Website
                    </a>
                  ) : null}

                  {row.matchedUniversitySlug ? (
                    <a
                      href={`/universities/${row.matchedUniversitySlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                    >
                      <Link2 className="size-3.5" />
                      Matched
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
