import Link from "next/link";
import { count, desc, eq, ne } from "drizzle-orm";
import {
  AlertCircle,
  ArrowRight,
  Download,
  FileText,
  Star,
  Users,
} from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db/server";
import {
  adminAuditLogs,
  leads,
  peerRequests,
  universities,
  universityReviews,
} from "@/lib/db/schema";
import { formatNumber } from "@/lib/utils";

const fmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const db = getDb();

  let totalLeads = 0;
  let totalPeerRequests = 0;
  let totalReviews = 0;
  let moderatedReviews = 0;
  let recentReviews: Array<{
    id: number;
    universityName: string;
    visibilityStatus: string;
    reviewerName: string;
    createdAt: Date | null;
  }> = [];
  let recentLeads: Array<{
    id: number;
    fullName: string;
    phone: string;
    email: string | null;
    sourcePath: string;
    ctaVariant: string;
    createdAt: Date | null;
  }> = [];
  let recentActivity: Array<{
    id: number;
    actorEmail: string | null;
    action: string;
    targetDisplay: string | null;
    createdAt: Date | null;
  }> = [];

  if (db) {
    const [
      [leadsRow],
      [peerRow],
      [reviewsRow],
      [modRow],
      reviewRows,
      leadRows,
      activityRows,
    ] = await Promise.all([
      db.select({ v: count() }).from(leads),
      db.select({ v: count() }).from(peerRequests),
      db.select({ v: count() }).from(universityReviews),
      db
        .select({ v: count() })
        .from(universityReviews)
        .where(ne(universityReviews.visibilityStatus, "live")),
      db
        .select({
          id: universityReviews.id,
          universityName: universities.name,
          visibilityStatus: universityReviews.visibilityStatus,
          reviewerName: universityReviews.reviewerName,
          createdAt: universityReviews.createdAt,
        })
        .from(universityReviews)
        .innerJoin(universities, eq(universityReviews.universityId, universities.id))
        .orderBy(desc(universityReviews.createdAt))
        .limit(6),
      db
        .select({
          id: leads.id,
          fullName: leads.fullName,
          phone: leads.phone,
          email: leads.email,
          sourcePath: leads.sourcePath,
          ctaVariant: leads.ctaVariant,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(8),
      db
        .select({
          id: adminAuditLogs.id,
          actorEmail: adminAuditLogs.actorEmail,
          action: adminAuditLogs.action,
          targetDisplay: adminAuditLogs.targetDisplay,
          createdAt: adminAuditLogs.createdAt,
        })
        .from(adminAuditLogs)
        .orderBy(desc(adminAuditLogs.createdAt))
        .limit(6),
    ]);

    totalLeads = leadsRow.v;
    totalPeerRequests = peerRow.v;
    totalReviews = reviewsRow.v;
    moderatedReviews = modRow.v;
    recentReviews = reviewRows;
    recentLeads = leadRows;
    recentActivity = activityRows;
  }

  const metrics = [
    {
      label: "Total leads",
      value: formatNumber(totalLeads),
      icon: FileText,
      color: "text-[#0b312b]",
      bg: "bg-[#0b312b]/8",
    },
    {
      label: "Peer requests",
      value: formatNumber(totalPeerRequests),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Reviews",
      value: formatNumber(totalReviews),
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Needs moderation",
      value: formatNumber(moderatedReviews),
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  const statusTone: Record<string, string> = {
    live: "border-emerald-200 bg-emerald-50 text-emerald-700",
    hidden: "border-amber-200 bg-amber-50 text-amber-700",
    archived: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0b312b] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
          Operations overview
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-white/55">
          Incoming demand, moderation, and admin activity at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5"
            >
              <div
                className={`mb-3 inline-flex size-9 items-center justify-center rounded-xl ${metric.bg}`}
              >
                <Icon className={`size-4 ${metric.color}`} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {metric.label}
              </p>
              <p
                className={`mt-1 font-display text-3xl font-semibold md:text-4xl ${metric.color}`}
              >
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-base font-semibold text-[#0b312b] md:text-lg">
              Recent leads
            </h2>
            <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
              Latest submissions from across the site.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {session.user.adminRole === "owner" ? (
              <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                <Link href="/admin/leads/export">
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </Link>
              </Button>
            ) : null}
            <Button
              asChild
              size="sm"
              className="h-8 bg-primary !text-white text-xs hover:bg-surface-dark-2"
            >
              <Link href="/admin/leads">
                <span className="hidden sm:inline">View all</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  CTA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5">
                    <p className="font-medium text-[#0b312b]">{lead.fullName}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{lead.phone}</p>
                    {lead.email ? (
                      <p className="mt-0.5 text-xs text-slate-400">{lead.email}</p>
                    ) : null}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">
                    {lead.ctaVariant}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="max-w-[200px] truncate text-sm text-slate-500">
                      {lead.sourcePath}
                    </p>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-400">
                    {lead.createdAt ? fmt.format(lead.createdAt) : "—"}
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No leads yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[#0b312b]">{lead.fullName}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{lead.phone}</p>
                  {lead.email ? (
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  ) : null}
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 rounded-full border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
                >
                  {lead.ctaVariant}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="max-w-[200px] truncate text-xs text-slate-400">
                  {lead.sourcePath}
                </p>
                <p className="text-xs text-slate-400">
                  {lead.createdAt ? fmtDate.format(lead.createdAt) : "—"}
                </p>
              </div>
            </div>
          ))}
          {recentLeads.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-400">
              No leads yet.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4 md:px-6">
          <h2 className="text-base font-semibold text-[#0b312b] md:text-lg">
            Recent admin activity
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Security-relevant changes across the dashboard.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 px-5 py-4 md:px-6"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0b312b]">
                  {item.action.replaceAll(".", " ")}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {item.actorEmail ?? "Unknown admin"}
                  {item.targetDisplay ? ` · ${item.targetDisplay}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-xs text-slate-400">
                {item.createdAt ? fmt.format(item.createdAt) : "—"}
              </p>
            </div>
          ))}
          {recentActivity.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-400">
              No admin activity recorded yet.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-base font-semibold text-[#0b312b] md:text-lg">
              Recent reviews
            </h2>
            <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
              Latest community reviews in the queue.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 bg-primary !text-white text-xs hover:bg-surface-dark-2"
          >
            <Link href="/admin/reviews">
              <span className="hidden sm:inline">Review queue</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentReviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-medium text-[#0b312b]">
                    {review.universityName}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">
                    {review.reviewerName}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${statusTone[review.visibilityStatus] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}
                    >
                      {review.visibilityStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-400">
                    {review.createdAt ? fmtDate.format(review.createdAt) : "—"}
                  </td>
                </tr>
              ))}
              {recentReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No reviews yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="flex items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#0b312b]">
                  {review.universityName}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {review.reviewerName}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Badge
                  variant="outline"
                  className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${statusTone[review.visibilityStatus] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}
                >
                  {review.visibilityStatus}
                </Badge>
                <p className="text-xs text-slate-400">
                  {review.createdAt ? fmtDate.format(review.createdAt) : "—"}
                </p>
              </div>
            </div>
          ))}
          {recentReviews.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-400">
              No reviews yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
