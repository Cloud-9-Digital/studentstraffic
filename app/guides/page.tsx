import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, GraduationCap, Wallet } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { getLandingPages } from "@/lib/data/catalog";
import { Button } from "@/components/ui/button";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getLandingPageHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad Guides for Indian Students | Fees, Eligibility, Countries",
  description:
    "Read MBBS abroad guides on fees, eligibility, countries, NMC recognition, and college comparison for Indian students and parents.",
  path: "/guides",
});

const guideTypes = [
  {
    Icon: Compass,
    title: "Country Planning",
      description:
        "Evaluate destination fit, recognition context, city life, and admissions practicality.",
    href: "/countries",
    cta: "See country options",
    theme:
      "border-[#2d6b64]/15 bg-[linear-gradient(180deg,rgba(45,107,100,0.06)_0%,#ffffff_40%)] hover:border-[#2d6b64]/30",
    action: "text-[#235b55]",
  },
  {
    Icon: GraduationCap,
    title: "Course Planning",
      description:
        "Understand the route first, then decide where and how to study it abroad.",
    href: "/courses",
    cta: "See course options",
    theme:
      "border-[#355e8a]/15 bg-[linear-gradient(180deg,rgba(53,94,138,0.06)_0%,#ffffff_40%)] hover:border-[#355e8a]/30",
    action: "text-[#2f5a86]",
  },
  {
    Icon: BookOpen,
    title: "College Comparison",
      description:
        "Use side-by-side college comparisons when you are narrowing final options.",
    href: "/compare",
    cta: "Compare colleges",
    theme:
      "border-[#7b5d3d]/15 bg-[linear-gradient(180deg,rgba(123,93,61,0.06)_0%,#ffffff_40%)] hover:border-[#7b5d3d]/30",
    action: "text-[#6d5132]",
  },
  {
    Icon: Wallet,
    title: "Budget Planning",
    description:
      "Start with a yearly tuition ceiling before moving into college-level detail.",
    href: "/budget",
    cta: "Check budget fit",
    theme:
      "border-primary/15 bg-[linear-gradient(180deg,rgba(11,49,43,0.05)_0%,#ffffff_40%)] hover:border-primary/30",
    action: "text-primary",
  },
] as const;

function toPlainText(value: string) {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getConciseSummary(value: string) {
  const plain = toPlainText(value);
  const firstSentence = plain.match(/^[^.!?]+[.!?]/)?.[0]?.trim() || plain;

  if (firstSentence.length <= 150) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 147).trimEnd()}...`;
}

export default async function GuidesPage() {
  const landingPages = await getLandingPages();
  const featuredGuides = landingPages.slice(0, 6);

  const path = "/guides";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "MBBS abroad guides",
      description:
        "Planning hub for country, course, comparison, and budget decision pages.",
    }),
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(53,94,138,0.10),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Study Abroad Guides
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              Start with the right tool for your admission journey.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Use this hub to move into country planning, course planning,
              college comparisons, or budget-first decision support.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-4 md:grid-cols-2">
            {guideTypes.map(({ Icon, title, description, href, cta, theme, action }) => (
              <Link
                key={title}
                href={href}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  theme,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
                    <Icon className="size-5 text-heading" />
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                </div>

                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-heading">
                  {title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>

                <div className="mt-5 border-t border-border/70 pt-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-semibold",
                      action,
                    )}
                  >
                    {cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell">
          <div className="mb-8 rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Latest NEET Update
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                  NEET 2026 paper analysis, expected cutoff, and what students should do next.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  A practical exam-day guide for students and parents who want
                  clearer next steps, not just noise around answer keys and
                  cutoff guesses.
                </p>
              </div>
              <Button asChild>
                <Link href="/guides/neet-2026-paper-analysis-expected-cutoff">
                  Read the guide
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/guides/neet-2026-expected-cut-off"
              className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                NEET 2026 Guide
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                NEET 2026 Expected Cut Off
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Understand how students should read expected cut off talk and use it properly for counselling planning.
              </p>
            </Link>

            <Link
              href="/guides/neet-2026-marks-vs-rank"
              className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                NEET 2026 Guide
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                NEET 2026 Marks vs Rank
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Use marks vs rank in the right way after the exam and prepare realistic college buckets.
              </p>
            </Link>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Popular Admission Paths
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              Useful pages students check often.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={getLandingPageHref(guide.courseSlug, guide.countrySlug)}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {guide.kicker}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                  {guide.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {getConciseSummary(guide.summary)}
                </p>
                <div className="mt-5 border-t border-border/70 pt-4">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Check details
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
