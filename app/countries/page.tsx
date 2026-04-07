import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryFlag } from "@/components/site/country-flag";
import { getCountries } from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getCountryHref } from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCountryFlagCode } from "@/lib/university-media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Country Guides for Indian Students | Fees & NMC Recognition",
  description:
    "Compare live study-abroad country guides for Indian students, covering destination fit, fee direction, recognition context, and admission planning before choosing universities.",
  path: "/countries",
});

function toPlainText(value: string) {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getConciseText(value: string, maxLength: number) {
  const plain = toPlainText(value);
  const firstSentence = plain.match(/^[^.!?]+[.!?]/)?.[0]?.trim() || plain;

  if (firstSentence.length <= maxLength) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, maxLength - 3).trimEnd()}...`;
}

function getCountryCardSummary(summary: string) {
  return getConciseText(summary, 150);
}

export default async function CountriesPage() {
  const countries = await getCountries();

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

  const countriesWithFlags = countries
    .map((country) => {
      const countryCode = getCountryFlagCode(country.slug);

      return {
        ...country,
        countryCode: countryCode.length === 2 ? countryCode : null,
      };
    })
    .sort((left, right) => {
      const leftPriority = left.slug === "vietnam" ? 0 : 1;
      const rightPriority = right.slug === "vietnam" ? 0 : 1;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return left.name.localeCompare(right.name);
    });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f8f2e7_0%,#fcfbf8_45%,#edf5f1_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(19,94,84,0.12),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Country Guides
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              Choose the country first.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Compare destination fit, fee direction, recognition context, and
              admissions practicality before you choose universities.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div
            id="country-guides"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {countriesWithFlags.map((country) => {
              const isVietnam = country.slug === "vietnam";

              return (
                <Link
                  key={country.slug}
                  href={getCountryHref(country.slug)}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    isVietnam
                      ? "border-accent/25 bg-[linear-gradient(180deg,rgba(19,94,84,0.05)_0%,#ffffff_38%)]"
                      : "border-border hover:border-primary/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {country.countryCode ? (
                        <CountryFlag
                          countryCode={country.countryCode}
                          alt={country.name}
                          width={44}
                          height={33}
                          className="rounded-md shadow-flag"
                        />
                      ) : (
                        <div className="flex size-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Globe className="size-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {country.region}
                        </p>
                        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-heading">
                          {country.name}
                        </h2>
                      </div>
                    </div>

                    {isVietnam ? (
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">
                        Popular
                      </span>
                    ) : (
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    )}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                    {getCountryCardSummary(country.summary)}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open guide
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
