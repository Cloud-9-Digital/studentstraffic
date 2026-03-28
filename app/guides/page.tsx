import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, GraduationCap, Wallet } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { getLandingPages } from "@/lib/data/catalog";
import { getBudgetGuides, getComparisonGuides } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import {
  getBudgetGuideHref,
  getComparisonHref,
  getLandingPageHref,
} from "@/lib/routes";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Study Abroad Guides",
  description:
    "Browse country guides, course guides, comparison pages, budget planning guides, and editorial routes that support your university shortlist.",
  path: "/guides",
});

const guideTypes = [
  {
    Icon: Compass,
    label: "Destinations",
    title: "Country Guides",
    description: "Costs, recognition, student life, and destination context before you compare universities.",
    href: "/countries",
    cta: "Explore countries",
  },
  {
    Icon: GraduationCap,
    label: "Programmes",
    title: "Course Guides",
    description: "Understand MBBS, BDS, nursing, and postgraduate routes before judging institutions.",
    href: "/courses",
    cta: "Explore courses",
  },
  {
    Icon: BookOpen,
    label: "Shortlisting",
    title: "Comparison Guides",
    description: "Side-by-side university evaluations for when your shortlist is narrowing.",
    href: "/compare",
    cta: "Browse comparisons",
  },
  {
    Icon: Wallet,
    label: "Affordability",
    title: "Budget Guides",
    description: "Research by tuition range before opening individual university pages.",
    href: "/budget",
    cta: "Browse by budget",
  },
] as const;

export default async function GuidesPage() {
  const [landingPages, comparisonGuides, budgetGuides] = await Promise.all([
    getLandingPages(),
    getComparisonGuides(),
    getBudgetGuides(),
  ]);

  const featuredEditorialGuides = landingPages.slice(0, 6);
  const featuredComparisonGuides = comparisonGuides.slice(0, 5);
  const featuredBudgetGuides = budgetGuides.slice(0, 5);

  const path = "/guides";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "Study abroad guides",
      description:
        "Guide hub for country, course, comparison, budget, and editorial research pages.",
    }),
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines pointer-events-none absolute inset-0" />
        <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40" />
        <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60" />

        <div className="container-shell relative py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Research guides
              </p>
              <h1 className="font-display text-5xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Everything you need
                <br />
                <span className="italic text-accent">before you decide.</span>
              </h1>
              <p className="max-w-lg text-base leading-8 text-white/70">
                Country guides, course overviews, university comparisons, and
                budget planning — all in one place.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg" variant="accent">
                  <Link href="/universities">
                    Browse universities
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 !text-white hover:bg-white/18"
                >
                  <Link href="/contact">Talk to a counsellor</Link>
                </Button>
              </div>
            </div>

            {/* Guide type quick-links — desktop */}
            <div className="hidden space-y-2 lg:block">
              {guideTypes.map(({ Icon, title, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="hero-glass group flex items-center gap-3 rounded-2xl px-4 py-3 transition-opacity hover:opacity-90"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/12 text-white">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-semibold text-white">{title}</span>
                  <ArrowRight className="ml-auto size-3.5 text-white/30 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Guide categories ─────────────────────────────────────────────────── */}
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Guide types
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
              Choose where to start
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
            {guideTypes.map(({ Icon, label, title, description, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col gap-5 bg-background p-8 transition-colors hover:bg-muted/30 md:p-10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {label}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-heading">
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  {cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial guides ─────────────────────────────────────────────────── */}
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Editorial
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
                In-depth guides
              </h2>
            </div>
            <Button asChild variant="outline" className="hidden shrink-0 sm:flex">
              <Link href="/countries">
                All country guides
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredEditorialGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={getLandingPageHref(guide.courseSlug, guide.countrySlug)}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {guide.kicker}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-heading">
                  {guide.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {guide.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  Read guide
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison + Budget ───────────────────────────────────────────────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Comparison guides */}
            <div>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Comparisons
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
                    University vs University
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link href="/compare">
                    View all
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {featuredComparisonGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={getComparisonHref(guide.slug)}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Comparison guide
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {guide.left.university.name} vs {guide.right.university.name}
                      </p>
                    </div>
                    <ArrowRight className="ml-3 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Budget guides */}
            <div>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Affordability
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
                    Research by budget
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link href="/budget">
                    View all
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {featuredBudgetGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={getBudgetGuideHref(guide.slug)}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {guide.course.shortName}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        Under ${guide.budgetUsd.toLocaleString("en-US")} —{" "}
                        <span className="font-normal text-muted-foreground">
                          {guide.programs.length} programs
                        </span>
                      </p>
                    </div>
                    <ArrowRight className="ml-3 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
