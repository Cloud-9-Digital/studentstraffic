import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { FinderFilterForm } from "@/components/site/finder-filter-form";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityCard } from "@/components/site/university-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildNoIndexMetadata } from "@/lib/metadata";
import { hasFinderFilters, parseFinderFilters } from "@/lib/filters";
import { getFinderOptions, listFinderPrograms } from "@/lib/data/catalog";

const PAGE_SIZE = 12;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const filters = parseFinderFilters(await searchParams);
  const base: Metadata = {
    title: "MBBS Abroad Universities — Compare Fees, Recognition & Eligibility",
    description:
      "Browse 500+ MBBS and medical universities across Russia, Georgia, Vietnam, Kyrgyzstan, Kazakhstan, and more. Filter by country, total fees, intake, teaching medium, and NMC recognition.",
  };
  const raw = await searchParams;
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseInt(pageParam ?? "1", 10) || 1;
  if (hasFinderFilters(filters) || page > 1) {
    return buildNoIndexMetadata(base, { canonicalPath: "/universities" });
  }
  return base;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      {/* Hero — heading is static, only mobile filters are async */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
        <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40" aria-hidden />
        <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60" aria-hidden />

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

          {/* Mobile filters only — async */}
          <div className="lg:hidden">
            <Suspense fallback={<div className="flex gap-2"><div className="h-12 flex-1 rounded-xl bg-white/10" /><div className="h-12 w-28 rounded-xl bg-white/10" /></div>}>
              <MobileFilters searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Cards */}
      <section className="py-10 md:py-14">
        <div className="container-shell space-y-10">
          {/* Sidebar and cards in separate Suspense boundaries so the sidebar
              doesn't flash when paginating — filter options are cache-hit */}
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            <Suspense fallback={<SidebarFallback />}>
              <SidebarSection searchParams={searchParams} />
            </Suspense>
            <Suspense fallback={<CardGridFallback />}>
              <CardsSection searchParams={searchParams} />
            </Suspense>
          </div>

          <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Free Counselling
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Need help building the right shortlist?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                Share your NEET score, budget, and destination preference and
                our counsellors will help you narrow down to the universities
                that actually match — comparing total fees, recognition status,
                and admission requirements, all free.
              </p>
            </div>

            <LeadForm
              sourcePath="/universities"
              ctaVariant="finder_cta"
              title="Talk through your shortlist"
              description="Share your details and our counsellors will help you compare universities, destinations, fees, and next steps."
            />
          </div>
        </div>
      </section>
    </>
  );
}

// ── Mobile filters only (async — fetches filter options) ──────────────────────

async function MobileFilters({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFinderFilters(await searchParams);
  const options = await getFinderOptions();

  return (
    <FinderFilterForm
      key={JSON.stringify(filters)}
      countries={options.countries}
      courses={options.courses}
      mediums={options.mediums}
      intakes={options.intakes}
      filters={filters}
      heroMode
    />
  );
}

// ── Sidebar (async — fetches filter options only, cached) ─────────────────────

async function SidebarSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFinderFilters(await searchParams);
  const options = await getFinderOptions();
  return (
    <aside className="hidden lg:block lg:sticky lg:top-20">
      <FinderFilterForm
        key={JSON.stringify(filters)}
        countries={options.countries}
        courses={options.courses}
        mediums={options.mediums}
        intakes={options.intakes}
        filters={filters}
        sidebarMode
      />
    </aside>
  );
}

function SidebarFallback() {
  return (
    <div className="hidden lg:block">
      <div className="h-[500px] rounded-2xl bg-muted animate-pulse" />
    </div>
  );
}

// ── Cards (async — fetches programs only) ─────────────────────────────────────

async function CardsSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseFinderFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const allPrograms = await listFinderPrograms(filters);

  const totalPages = Math.ceil(allPrograms.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const programs = allPrograms.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Build a URL for a given page, preserving all other params
  const pageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.country) params.set("country", filters.country);
    if (filters.course) params.set("course", filters.course);
    if (filters.medium) params.set("medium", filters.medium);
    if (filters.intake) params.set("intake", filters.intake);
    if (filters.feeMin) params.set("fee_min", String(filters.feeMin));
    if (filters.feeMax) params.set("fee_max", String(filters.feeMax));
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/universities${qs ? `?${qs}` : ""}`;
  };

  const cards = programs.length ? (
    <>
      <h2 className="sr-only">University results</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {programs.map((program, index) => (
          <UniversityCard
            key={program.offering.slug}
            program={program}
            imagePriority={index < 2}
          />
        ))}
      </div>
    </>
  ) : (
    <Card>
      <CardContent className="py-16 text-center">
        <p className="text-base font-medium text-foreground">No programs matched</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try widening the fee range or removing a filter.
        </p>
        <Link
          href="/universities"
          className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-strong"
        >
          Clear all filters
        </Link>
      </CardContent>
    </Card>
  );

  // Generate page numbers to show: always first, last, current ± 1, with ellipsis
  const pageNumbers: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    const near = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(n => n >= 1 && n <= totalPages));
    let prev = 0;
    for (const n of [...near].sort((a, b) => a - b)) {
      if (prev && n - prev > 1) pageNumbers.push("ellipsis");
      pageNumbers.push(n);
      prev = n;
    }
  }

  return (
    <div className="space-y-8">
      {cards}

      {totalPages > 1 && (
        <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? pageUrl(currentPage - 1) : undefined}
                    disabled={currentPage <= 1}
                  />
                </PaginationItem>

                {pageNumbers.map((n, i) =>
                  n === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={n}>
                      <PaginationLink href={pageUrl(n)} isActive={n === currentPage}>
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href={currentPage < totalPages ? pageUrl(currentPage + 1) : undefined}
                    disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
      )}
    </div>
  );
}

function CardGridFallback() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}
