import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { ComparisonTable } from "@/components/site/comparison-table";
import { getProgramsForUniversity } from "@/lib/data/catalog";
import { buildNoIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildNoIndexMetadata(
  {
    title: "Compare Universities",
    description: "Side-by-side university comparison.",
  },
  { canonicalPath: "/compare/live" },
);

export const unstable_instant = {
  prefetch: "static",
  samples: [
    {
      searchParams: {
        a: "can-tho-university-medicine-pharmacy",
        b: "buon-ma-thuot-medical-university",
        c: null,
        d: null,
      },
    },
  ],
};

export default function ComparisonLivePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<ComparisonLiveFallback />}>
      <ComparisonLiveContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ComparisonLiveContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // Collect up to 4 slugs from a, b, c, d params
  const slugs = (["a", "b", "c", "d"] as const)
    .map((key) => (typeof params[key] === "string" ? (params[key] as string).trim() : null))
    .filter((s): s is string => s !== null && s.length > 0);

  // Deduplicate and require at least 2
  const uniqueSlugs = [...new Set(slugs)];
  if (uniqueSlugs.length < 2) redirect("/compare");

  // Fetch all university programs in parallel (each is cached via `use cache`)
  const results = await Promise.all(
    uniqueSlugs.map((slug) => getProgramsForUniversity(slug)),
  );

  const programs = results.map((r) => r[0] ?? null).filter((p) => p !== null);

  if (programs.length < 2) redirect("/compare");

  const lowestTuition = Math.min(...programs.map((p) => p.offering.annualTuitionUsd));
  const winner = programs.find((p) => p.offering.annualTuitionUsd === lowestTuition);

  // Compute per-university remove URLs server-side (no client state needed)
  const paramKeys = ["a", "b", "c", "d"] as const;
  const removeHrefs: Record<string, string> = {};
  programs.forEach((p, i) => {
    const remaining = programs.filter((_, j) => j !== i);
    if (remaining.length < 2) {
      removeHrefs[p.university.slug] = "/universities";
    } else {
      const qs = remaining
        .map((r, ri) => `${paramKeys[ri]}=${r.university.slug}`)
        .join("&");
      removeHrefs[p.university.slug] = `/compare/live?${qs}`;
    }
  });
  const emptySlots = 4 - programs.length;

  return (
    <section className="py-10 md:py-14">
      <div className="container-shell space-y-8">
        {/* Back + header */}
        <div>
          <Link
            href="/universities"
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to universities
          </Link>

          <div className="flex flex-wrap items-start gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Live comparison · {programs.length} universities
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {programs.map((p, i) => (
                  <span key={p.university.slug}>
                    {i > 0 && (
                      <span className="mx-2 text-muted-foreground/50 font-normal">vs</span>
                    )}
                    <span className={i % 2 === 0 ? "text-heading" : "text-accent"}>
                      {p.university.name}
                    </span>
                  </span>
                ))}
              </h1>
            </div>

            {winner && programs.length > 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--status-green)] px-2.5 py-1 text-xs font-medium text-[color:var(--status-green-fg)]">
                <Check className="size-3 shrink-0" />
                {winner.university.name} has lowest tuition
              </span>
            )}
          </div>
        </div>

        {/* Table with inline slot controls */}
        <ComparisonTable
          programs={programs}
          removeHrefs={removeHrefs}
          emptySlots={emptySlots}
          addHref="/universities"
        />

      </div>
    </section>
  );
}

function ComparisonLiveFallback() {
  return (
    <section className="py-10 md:py-14">
      <div className="container-shell space-y-8">
        <div className="space-y-4">
          <div className="h-4 w-36 rounded-full bg-muted/70 animate-pulse" />
          <div className="h-10 w-full max-w-3xl rounded-2xl bg-muted animate-pulse" />
          <div className="h-7 w-56 rounded-full bg-muted/70 animate-pulse" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="grid grid-cols-3 gap-px bg-border/70 md:grid-cols-5">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="h-20 bg-background animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
