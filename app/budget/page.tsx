import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { getBudgetGuideSummaries } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getBudgetGuideHref } from "@/lib/routes";
import { cn, formatCurrencyUsd } from "@/lib/utils";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad Fees by Budget | Low Cost Colleges for Indian Students",
  description:
    "Check MBBS abroad fees by budget and find low cost colleges across countries for Indian students before applying.",
  path: "/budget",
});

const courseOrder = ["mbbs", "bds", "medical-pg", "nursing"] as const;

const courseThemes: Record<string, { card: string; action: string }> = {
  mbbs: {
    card: "border-primary/15 bg-[linear-gradient(180deg,rgba(11,49,43,0.05)_0%,#ffffff_40%)] hover:border-primary/30",
    action: "text-primary",
  },
  bds: {
    card: "border-[#b96f5b]/15 bg-[linear-gradient(180deg,rgba(185,111,91,0.06)_0%,#ffffff_40%)] hover:border-[#b96f5b]/30",
    action: "text-[#9f4d36]",
  },
  "medical-pg": {
    card: "border-[#355e8a]/15 bg-[linear-gradient(180deg,rgba(53,94,138,0.06)_0%,#ffffff_40%)] hover:border-[#355e8a]/30",
    action: "text-[#2f5a86]",
  },
  nursing: {
    card: "border-[#2d6b64]/15 bg-[linear-gradient(180deg,rgba(45,107,100,0.06)_0%,#ffffff_40%)] hover:border-[#2d6b64]/30",
    action: "text-[#235b55]",
  },
};

export default async function BudgetIndexPage() {
  const guides = await getBudgetGuideSummaries();

  const budgetCards = [...guides]
    .sort((left, right) => {
      const leftIndex = courseOrder.indexOf(
        left.course.slug as (typeof courseOrder)[number],
      );
      const rightIndex = courseOrder.indexOf(
        right.course.slug as (typeof courseOrder)[number],
      );

      if (leftIndex !== -1 || rightIndex !== -1) {
        if (leftIndex === -1) {
          return 1;
        }

        if (rightIndex === -1) {
          return -1;
        }

        if (leftIndex !== rightIndex) {
          return leftIndex - rightIndex;
        }
      } else if (left.course.name !== right.course.name) {
        return left.course.name.localeCompare(right.course.name);
      }

      return left.budgetUsd - right.budgetUsd;
    });

  // budgetCards is sorted by course, then budget, so groups keep that order.
  const courseGroups: Array<{
    course: (typeof budgetCards)[number]["course"];
    guides: typeof budgetCards;
  }> = [];
  for (const guide of budgetCards) {
    const group = courseGroups.at(-1);
    if (group?.course.slug === guide.course.slug) {
      group.guides.push(guide);
    } else {
      courseGroups.push({ course: guide.course, guides: [guide] });
    }
  }

  const path = "/budget";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Budget", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "Budget guides",
      description:
        "Budget-first study-abroad guides for course and tuition thresholds.",
    }),
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(45,107,100,0.10),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Budget Guides
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              Start with the budget ceiling.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Use these guides to see which course options fit under a yearly
              tuition cap before you compare full university details.
            </p>

            <div className="mt-7">
              <Button asChild size="lg" variant="accent">
                <Link href="/universities">
                  Browse colleges
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          {/* One card per course with a link per budget ceiling. A full card
              per guide (~470 of them) made this page 2.5 MB of HTML. */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courseGroups.map(({ course, guides: courseGuides }) => {
              const theme = courseThemes[course.slug] ?? {
                card: "border-border",
                action: "text-primary",
              };
              const widest = courseGuides[courseGuides.length - 1];

              return (
                <div
                  key={course.slug}
                  className={cn(
                    "flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm",
                    theme.card,
                  )}
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {course.shortName}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-heading">
                    {course.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Options in {widest.countryNames.slice(0, 3).join(", ")}
                    {widest.countryNames.length > 3 ? " and more" : ""}, at or below{" "}
                    {formatCurrencyUsd(widest.budgetUsd)} a year.
                  </p>
                  <ul className="mt-4 divide-y divide-border/70 border-t border-border/70">
                    {courseGuides.map((guide) => (
                      <li key={guide.slug}>
                        <Link
                          href={getBudgetGuideHref(guide.slug)}
                          className="flex items-center justify-between gap-3 py-2.5 text-sm"
                        >
                          <span className={cn("font-semibold", theme.action)}>
                            Under {formatCurrencyUsd(guide.budgetUsd)}
                          </span>
                          <span className="text-muted-foreground">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
