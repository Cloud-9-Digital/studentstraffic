import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryFlag } from "@/components/site/country-flag";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getCountries, listFinderPrograms } from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCountryHref } from "@/lib/routes";
import { navDestinations } from "@/lib/constants";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Study Destinations",
  description:
    "Browse country guides for Indian students comparing universities, fees, cities, and teaching options abroad.",
  path: "/countries",
});

export default async function CountriesPage() {
  const [countries, programs] = await Promise.all([
    getCountries(),
    listFinderPrograms({}),
  ]);
  const programCounts = new Map<string, number>();

  for (const program of programs) {
    programCounts.set(
      program.country.slug,
      (programCounts.get(program.country.slug) ?? 0) + 1
    );
  }

  const path = "/countries";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Countries", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "Study destinations",
      description:
        "Country guides covering universities, fees, cities, and teaching context for Indian students.",
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Study Destinations"
          title="Country guides built for deeper destination research"
          description="These destination pages bring together country context, costs, city spread, and university options so students can understand each market before comparing individual campuses."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => {
            const countryCode = navDestinations.find(
              (destination) => destination.href === getCountryHref(country.slug)
            )?.countryCode;

            return (
              <Link key={country.slug} href={getCountryHref(country.slug)}>
                <Card className="h-full transition-colors hover:border-primary/30">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                      {countryCode ? (
                        <CountryFlag
                          countryCode={countryCode}
                          alt={country.name}
                          width={36}
                          height={27}
                          className="rounded-md shadow-flag"
                        />
                      ) : null}
                      <div>
                        <h2 className="text-base font-semibold text-foreground">
                          {country.name}
                        </h2>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {country.region}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {country.summary}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{programCounts.get(country.slug) ?? 0} programs</span>
                      <span>{country.currencyCode}</span>
                      <span>{country.climate}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
