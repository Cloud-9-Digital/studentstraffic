import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ComparisonCard } from "@/components/site/comparison-card";
import { Button } from "@/components/ui/button";
import { getComparisonGuides } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS University Comparison Guides for Indian Students",
  description:
    "Side-by-side comparison guides for MBBS universities abroad — fees, city, recognition, teaching medium, and admissions fit for Indian students.",
  path: "/compare",
});

export default async function CompareIndexPage() {
  const guides = await getComparisonGuides();

  const sortedGuides = [...guides].sort((left, right) => {
    const byCourse = left.left.course.shortName.localeCompare(
      right.left.course.shortName,
    );

    if (byCourse !== 0) {
      return byCourse;
    }

    const leftCountries = `${left.left.country.name} ${left.right.country.name}`;
    const rightCountries = `${right.left.country.name} ${right.right.country.name}`;
    const byCountry = leftCountries.localeCompare(rightCountries);

    if (byCountry !== 0) {
      return byCountry;
    }

    return `${left.left.university.name} ${left.right.university.name}`.localeCompare(
      `${right.left.university.name} ${right.right.university.name}`,
    );
  });

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
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(53,94,138,0.10),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Comparison Guides
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              Compare the shortlist side by side.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Browse {sortedGuides.length} ready-made university comparisons from
              the live catalog, or start from the university finder if you want a
              custom shortlist.
            </p>

            <div className="mt-7">
              <Button asChild size="lg" variant="accent">
                <Link href="/universities">
                  Browse universities
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          {sortedGuides.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedGuides.map((guide) => (
                <ComparisonCard key={guide.slug} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-heading">
                No comparison guides yet
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Start from the university finder to build a shortlist, then come
                back once there are side-by-side comparisons available.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/universities">Go to universities</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
