import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getBudgetGuides } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getBudgetGuideHref } from "@/lib/routes";
import { formatCurrencyUsd } from "@/lib/utils";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad Budget Guides — Compare Universities by Tuition Band",
  description:
    "Research MBBS universities by annual tuition range before admissions planning. Explore affordable options across countries for Indian students.",
  path: "/budget",
});

export default async function BudgetIndexPage() {
  const guides = await getBudgetGuides();
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
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Budget Guides"
          title="Use budget guides when cost is shaping the options first"
          description="These pages are planning tools for students who want to understand the market by tuition band before opening university detail pages."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={getBudgetGuideHref(guide.slug)}>
              <Card className="h-full transition-colors hover:border-primary/30">
                <CardContent className="space-y-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {guide.course.shortName}
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">
                    Under {formatCurrencyUsd(guide.budgetUsd)}
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {guide.programs.length} current program
                    {guide.programs.length === 1 ? "" : "s"} within this budget
                    threshold.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
