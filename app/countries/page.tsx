import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";


import { JsonLd } from "@/components/shared/json-ld";
import { CountryFlag } from "@/components/site/country-flag";
import { getCountries } from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCountryHref } from "@/lib/routes";
import { navDestinations } from "@/lib/constants";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Country Guides for Indian Students | Fees & NMC Recognition",
  description:
    "Country guides for Russia, Georgia, Kazakhstan, Vietnam, Kyrgyzstan, and more — covering MBBS fees, NMC recognition, hostel costs, and eligibility for Indian students.",
  path: "/countries",
});

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

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines pointer-events-none absolute inset-0" />
        <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40" />
        <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60" />

        <div className="container-shell relative py-12 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Country Guides
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Pick a destination.
            <br />
            <span className="italic text-accent">Research it deeply.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
            Each guide covers MBBS fees, NMC recognition, FMGE pass rates,
            hostel costs, city options, and NEET eligibility — everything you
            need to compare destinations with confidence.
          </p>

        </div>
      </div>

      {/* ── Country grid ─────────────────────────────────────────────────────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => {
              const countryCode = navDestinations.find(
                (d) => d.href === getCountryHref(country.slug)
              )?.countryCode;

              return (
                <Link
                  key={country.slug}
                  href={getCountryHref(country.slug)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-4 border-b border-border px-6 py-5">
                    <div className="shrink-0">
                      {countryCode ? (
                        <CountryFlag
                          countryCode={countryCode}
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
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl font-semibold tracking-tight text-heading">
                        {country.name}
                      </h2>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        {country.region}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col px-6 py-5">
                    <p className="flex-1 text-sm leading-7 text-muted-foreground">
                      {country.summary}
                    </p>
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
