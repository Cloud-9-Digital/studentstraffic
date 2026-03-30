import type { Metadata } from "next";
import { Suspense } from "react";

import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { UniversitiesExplorer } from "@/components/site/universities-explorer";
import { finderPageSize } from "@/lib/constants";
import {
  getFinderOptions,
  queryFinderCardProgramsPage,
} from "@/lib/data/catalog";
import { buildNoIndexMetadata } from "@/lib/metadata";
import {
  hasFinderFilters,
  parseFinderFilters,
  parseFinderPage,
} from "@/lib/filters";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const filters = parseFinderFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseFinderPage(pageParam);

  const base: Metadata = {
    title: "MBBS Abroad Universities | Fees, NMC Recognition & Eligibility",
    description:
      "Browse 500+ MBBS universities across Russia, Georgia, Vietnam, Kyrgyzstan, and Kazakhstan. Filter by country, fees, intake, teaching medium, and NMC recognition status.",
  };

  if (hasFinderFilters(filters) || page > 1) {
    return buildNoIndexMetadata(base, { canonicalPath: "/universities" });
  }

  return base;
}

export default function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <Suspense fallback={<UniversitiesExplorerFallback />}>
        <UniversitiesExplorerSection searchParams={searchParams} />
      </Suspense>

      <section className="pb-10 md:pb-14">
        <div className="container-shell">
          <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Free Counselling
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Need help planning the right path?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                Share your NEET score, budget, and destination preference and
                our counsellors will help you narrow down to the universities
                that actually match — comparing total fees, recognition status,
                and admission requirements, all free.
              </p>
            </div>

            <DeferredLeadForm
              sourcePath="/universities"
              ctaVariant="finder_cta"
              title="Talk through your options"
              description="Share your details and our counsellors will help you compare universities, destinations, fees, and next steps."
            />
          </div>
        </div>
      </section>
    </>
  );
}

async function UniversitiesExplorerSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseFinderFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseFinderPage(pageParam);
  const [options, initialResults] = await Promise.all([
    getFinderOptions(),
    queryFinderCardProgramsPage(filters, page, finderPageSize),
  ]);

  return (
    <UniversitiesExplorer
      options={options}
      initialFilters={filters}
      initialResults={initialResults}
    />
  );
}

function UniversitiesExplorerFallback() {
  return (
    <>
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
        <div
          className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40"
          aria-hidden
        />
        <div
          className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60"
          aria-hidden
        />

        <div className="container-shell relative py-10 pb-8 md:py-16 md:pb-10">
          <div className="mb-7 space-y-3 text-center md:mb-9">
            <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
              Browse 500+ universities abroad
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-6 text-white/60 md:text-base md:leading-7">
              Filter by country, fees, intake, teaching medium, and NMC
              recognition across Russia, Georgia, Vietnam, Kyrgyzstan,
              Kazakhstan, and more.
            </p>
          </div>

          <div className="flex gap-2 lg:hidden">
            <div className="h-12 flex-1 rounded-xl bg-white/10" />
            <div className="h-12 w-28 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            <div className="hidden lg:block">
              <div className="h-[500px] rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-44 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-36 rounded-full bg-muted/70 animate-pulse" />
                </div>
                <div className="h-7 w-28 rounded-full bg-muted animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-64 rounded-2xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
