import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  PackageCheck,
} from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import {
  getLeadDeliveryQueue,
  type LeadDeliveryJobStatus,
} from "@/lib/admin/lead-delivery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
  LeadDeliveryQueueActions,
  RetryLeadDeliveryJobButton,
} from "./lead-delivery-actions";

type SearchParams = Promise<{
  status?: string;
}>;

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const statusStyles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
};

const statusIcons: Record<string, typeof Clock3> = {
  pending: Clock3,
  processing: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
};

function StatusBadge({ status }: { status: LeadDeliveryJobStatus }) {
  const Icon = statusIcons[status] ?? Clock3;

  return (
    <Badge
      className={
        statusStyles[status] ??
        "border-slate-200 bg-slate-100 text-slate-600"
      }
    >
      <Icon className="size-3" />
      {status}
    </Badge>
  );
}

function formatDate(value: Date | null) {
  return value ? fmtDate.format(value) : "Not set";
}

function buildStatusHref(status?: string) {
  return status ? `/admin/lead-delivery?status=${status}` : "/admin/lead-delivery";
}

export default async function AdminLeadDeliveryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const activeStatus = params.status?.trim() || undefined;
  const { rows, stats, total } = await getLeadDeliveryQueue({
    status: activeStatus,
    limit: 50,
  });
  const statCounts = new Map(stats.map((stat) => [stat.status, stat.count]));
  const pendingCount = statCounts.get("pending") ?? 0;
  const failedCount = statCounts.get("failed") ?? 0;
  const completedCount = statCounts.get("completed") ?? 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0b312b] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
          Lead operations
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
          Lead Delivery Queue
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-white/55">
          Monitor queued CRM, Pabbly, Google Sheets, and WhatsApp delivery work
          after lead forms are submitted.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Total jobs", value: total, color: "text-[#0b312b]" },
          { label: "Pending", value: pendingCount, color: "text-amber-600" },
          { label: "Failed", value: failedCount, color: "text-red-600" },
          { label: "Completed", value: completedCount, color: "text-emerald-600" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {metric.label}
            </p>
            <p
              className={`mt-1 font-display text-4xl font-semibold ${metric.color}`}
            >
              {formatNumber(metric.value)}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Queue controls
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#0b312b]">
              Process and retry delivery jobs
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Public form submissions stay fast because delivery runs in this
              queue. Use these controls when you need to flush pending jobs or
              requeue failures.
            </p>
          </div>
          <LeadDeliveryQueueActions />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Recent jobs
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#0b312b]">
              {activeStatus ? `${activeStatus} jobs` : "All delivery jobs"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: undefined },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
              { label: "Completed", value: "completed" },
            ].map((filter) => (
              <Button
                key={filter.label}
                asChild
                size="sm"
                variant={activeStatus === filter.value ? "default" : "outline"}
              >
                <Link href={buildStatusHref(filter.value)}>{filter.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Job
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Lead
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Attempts
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Schedule
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Last Error
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((job) => (
                <tr key={job.id} className="align-top">
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={job.status} />
                      <div>
                        <p className="font-medium text-slate-800">#{job.id}</p>
                        <p className="text-xs text-slate-500">{job.kind}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {job.leadId ? (
                      <div>
                        <Link
                          href={`/admin/leads/${job.leadId}`}
                          className="font-medium text-[#0b312b] hover:underline"
                        >
                          {job.leadName ?? `Lead #${job.leadId}`}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {job.leadPhone ?? "No phone"}
                        </p>
                        {job.sourcePath ? (
                          <p className="mt-1 max-w-64 truncate text-xs text-slate-400">
                            {job.sourcePath}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">No lead ID</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {job.attempts}/{job.maxAttempts}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    <p>Run: {formatDate(job.runAfter)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Created: {formatDate(job.createdAt)}
                    </p>
                    {job.completedAt ? (
                      <p className="mt-1 text-xs text-emerald-600">
                        Completed: {formatDate(job.completedAt)}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    {job.lastError ? (
                      <p className="max-w-md whitespace-pre-wrap rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                        {job.lastError}
                      </p>
                    ) : (
                      <span className="text-sm text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <RetryLeadDeliveryJobButton
                      jobId={job.id}
                      disabled={job.status === "processing"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <PackageCheck className="size-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">No jobs found</p>
            <p className="mt-1 text-sm text-slate-500">
              New form submissions will appear here once they queue delivery.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
