import type { Metadata } from "next";
import { Suspense } from "react";

import { FinderFilterForm } from "@/components/site/finder-filter-form";
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
    title: "University Finder",
    description:
      "Filter global medical universities by country, fee, intake, hostel, and eligibility.",
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
      {/* Hero — search bar lives here, no gap below */}
      <Suspense fallback={<HeroFallback />}>
        <HeroSection searchParams={searchParams} />
      </Suspense>

      {/* Cards */}
      <section className="py-10 md:py-14">
        <div className="container-shell space-y-10">
          <Suspense fallback={<CardsFallback />}>
            <CardsSection searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

// ── Hero (async — fetches filter options) ─────────────────────────────────────

async function HeroSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFinderFilters(await searchParams);
  const options = await getFinderOptions();

  return (
    <div className="relative overflow-hidden bg-surface-dark">
      {/* Gradient depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
      <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
      <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40" aria-hidden />
      <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60" aria-hidden />

      <div className="container-shell relative py-10 pb-8 md:py-16 md:pb-10">
        {/* Text */}
        <div className="mb-7 space-y-3 text-center md:mb-9">
          <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
            Find your perfect medical university
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-6 text-white/60 md:text-base md:leading-7">
            Filter programs by country, budget, intake, and eligibility.
          </p>
        </div>

        {/* Search + filter bar — mobile only; desktop uses the sidebar */}
        <div className="lg:hidden">
          <FinderFilterForm
            countries={options.countries}
            courses={options.courses}
            mediums={options.mediums}
            intakes={options.intakes}
            filters={filters}
            heroMode
          />
        </div>
      </div>
    </div>
  );
}

function HeroFallback() {
  return (
    <div className="relative overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
      <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
      <div className="container-shell relative py-10 pb-8 md:py-16 md:pb-10">
        <div className="mb-7 space-y-3 text-center md:mb-9">
          <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
            Find your perfect medical university
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-6 text-white/60 md:text-base">
            Filter programs by country, budget, intake, and eligibility.
          </p>
        </div>
        {/* Skeleton search bar */}
        <div className="flex gap-2">
          <div className="h-12 flex-1 rounded-xl bg-white/10" />
          <div className="h-12 w-28 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ── Cards (async — fetches programs) ─────────────────────────────────────────

async function CardsSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseFinderFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [options, allPrograms] = await Promise.all([
    getFinderOptions(),
    listFinderPrograms(filters),
  ]);

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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {programs.map((program) => (
        <UniversityCard key={program.offering.slug} program={program} />
      ))}
    </div>
  ) : (
    <Card>
      <CardContent className="py-16 text-center">
        <p className="text-base font-medium text-foreground">No programs matched</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try widening the fee range or removing a filter.
        </p>
        <a
          href="/universities"
          className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-strong"
        >
          Clear all filters
        </a>
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
    <>
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
        {/* Sidebar — desktop only, sticky */}
        <aside className="hidden lg:block lg:sticky lg:top-20">
          <FinderFilterForm
            countries={options.countries}
            courses={options.courses}
            mediums={options.mediums}
            intakes={options.intakes}
            filters={filters}
            sidebarMode
          />
        </aside>

        {/* Cards column */}
        <div className="space-y-8">
          {cards}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? pageUrl(currentPage - 1) : undefined}
                    aria-disabled={currentPage <= 1}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
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
                    aria-disabled={currentPage >= totalPages}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </>
  );
}

function CardsFallback() {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
      <div className="hidden lg:block">
        <div className="h-[600px] rounded-2xl bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
