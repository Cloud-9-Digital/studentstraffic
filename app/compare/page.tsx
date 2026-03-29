import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getComparisonGuides } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getComparisonHref } from "@/lib/routes";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS University Comparison Guides for Indian Students",
  description:
    "Side-by-side comparison guides for MBBS universities abroad — fees, city, recognition, teaching medium, and shortlist fit for Indian students.",
  path: "/compare",
});

export default async function CompareIndexPage() {
  const guides = await getComparisonGuides();
  const path = "/compare";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Compare", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "University comparisons",
      description:
        "Comparison guides for universities students often evaluate side by side.",
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Comparison Guides"
          title="Use comparison guides when your shortlist is already narrowing"
          description="These pages are research support for decision-stage students who want side-by-side thinking before choosing between institutions."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={getComparisonHref(guide.slug)}>
              <Card className="h-full transition-colors hover:border-primary/30">
                <CardContent className="space-y-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {guide.left.course.shortName}
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">
                    {guide.left.university.name} vs {guide.right.university.name}
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Compare tuition, city, medium, recognition, and shortlist
                    fit for two universities students often evaluate together.
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
