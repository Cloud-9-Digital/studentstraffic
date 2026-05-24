import Link from "next/link";
import { CheckCircle2, Database, Search, Server, XCircle } from "lucide-react";

import { requireAdminSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSearchIndexHealth, testSearchQuery } from "@/lib/search/admin";
import { formatNumber } from "@/lib/utils";
import { SearchActions } from "./search-actions";

type SearchParams = Promise<{
  q?: string;
}>;

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function StatusBadge({
  ok,
  label,
}: {
  ok: boolean;
  label: string;
}) {
  return (
    <Badge
      className={
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }
    >
      {ok ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {label}
    </Badge>
  );
}

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const [health, testResult] = await Promise.all([
    getSearchIndexHealth(),
    query ? testSearchQuery(query) : Promise.resolve(null),
  ]);
  const canManage = session.user.adminRole === "owner";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0b312b] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
          Search operations
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">
          Search Index Health
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-white/55">
          Monitor indexed documents, Typesense availability, and quick result
          quality without changing the public search UI.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-[#0b312b]/8 text-[#0b312b]">
            <Database className="size-4" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Postgres documents
          </p>
          <p className="mt-1 font-display text-4xl font-semibold text-[#0b312b]">
            {formatNumber(health.totalDocuments)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Server className="size-4" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Typesense
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge
              ok={health.typesense.configured}
              label={health.typesense.configured ? "Configured" : "Not configured"}
            />
            <StatusBadge
              ok={health.typesense.reachable}
              label={health.typesense.reachable ? "Reachable" : "Not reachable"}
            />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {health.typesense.documentCount == null
              ? "No Typesense document count available."
              : `${formatNumber(health.typesense.documentCount)} documents in collection.`}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Search className="size-4" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Last indexed
          </p>
          <p className="mt-2 text-lg font-semibold text-[#0b312b]">
            {health.latestUpdatedAt
              ? fmtDate.format(health.latestUpdatedAt)
              : "No index rows yet"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Document coverage
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#0b312b]">
                Indexed by entity type
              </h2>
            </div>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {health.documentsByType.length ? (
              health.documentsByType.map((row) => (
                <div
                  key={row.documentType}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="font-medium text-slate-700">
                    {row.documentType.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold text-[#0b312b]">
                    {formatNumber(row.count)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-slate-500">
                No indexed documents found.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Index actions
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#0b312b]">
            Rebuild and sync
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Rebuild Postgres after content changes. Sync Typesense when the
            optional search engine is configured.
          </p>
          <div className="mt-5">
            <SearchActions canManage={canManage} />
          </div>
          {health.typesense.error ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {health.typesense.error}
            </p>
          ) : null}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Query test
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#0b312b]">
              Test public search results
            </h2>
          </div>
          <form className="flex w-full gap-2 md:w-auto">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Try MBBS in Russia"
              className="md:w-72"
            />
            <Button type="submit">Test</Button>
          </form>
        </div>

        {testResult ? (
          <div className="mt-5 space-y-3">
            <p className="text-sm text-slate-500">
              {testResult.results.length} result
              {testResult.results.length === 1 ? "" : "s"} in{" "}
              {testResult.latencyMs}ms
            </p>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {testResult.results.map((result) => (
                <Link
                  key={`${result.documentType}:${result.sourceSlug}`}
                  href={result.path}
                  className="block px-4 py-3 transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#0b312b]">
                        {result.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {result.documentType.replace(/_/g, " ")} · {result.path}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {Math.round(result.score)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Recent index rows
        </p>
        <div className="mt-4 divide-y divide-slate-100">
          {health.recentDocuments.length ? (
            health.recentDocuments.map((document) => (
              <div
                key={`${document.documentType}:${document.path}`}
                className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-700">{document.title}</p>
                  <p className="text-xs text-slate-500">
                    {document.documentType.replace(/_/g, " ")} · {document.path}
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  {document.updatedAt ? fmtDate.format(document.updatedAt) : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-slate-500">No recent rows.</p>
          )}
        </div>
      </section>
    </div>
  );
}
