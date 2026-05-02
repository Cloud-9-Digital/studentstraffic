import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { getUniqueCities } from "@/lib/data/catalog";
import { getCityGuide } from "@/lib/data/city-guide";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getCitiesIndexHref, getCityHref, getCountryHref } from "@/lib/routes";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad by City | Compare Colleges, Fees and Student Life",
  description:
    "Compare MBBS abroad cities like Tbilisi, Bishkek, Tashkent, Hanoi, and more by colleges, fees, and student life before applying.",
  path: getCitiesIndexHref(),
  keywords: [
    "MBBS abroad cities",
    "MBBS in Tbilisi",
    "MBBS in Bishkek",
    "MBBS in Tashkent",
    "medical university by city",
    "MBBS city comparison",
    "study medicine abroad cities",
  ],
});

export default async function CitiesIndexPage() {
  const cities = await getUniqueCities();
  const citiesWithMultipleUnis = cities.filter((c) => c.universityCount >= 2);

  // Group by country
  const byCountry = new Map<
    string,
    { countryName: string; countrySlug: string; cities: typeof citiesWithMultipleUnis }
  >();

  for (const city of citiesWithMultipleUnis) {
    if (!byCountry.has(city.countrySlug)) {
      byCountry.set(city.countrySlug, {
        countryName: city.countryName,
        countrySlug: city.countrySlug,
        cities: [],
      });
    }
    byCountry.get(city.countrySlug)!.cities.push(city);
  }

  // Sort countries by total university count descending
  const sortedCountries = Array.from(byCountry.values()).sort(
    (a, b) =>
      b.cities.reduce((sum, c) => sum + c.universityCount, 0) -
      a.cities.reduce((sum, c) => sum + c.universityCount, 0),
  );

  const totalCities = citiesWithMultipleUnis.length;
  const totalUniversities = citiesWithMultipleUnis.reduce(
    (sum, c) => sum + c.universityCount,
    0,
  );

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-[#0d1f1d]">
        <div className="container-shell py-10 md:py-14">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/36">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-white/60">Cities</span>
          </nav>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.92] tracking-tight text-white">
            MBBS abroad<br />
            <em className="not-italic text-accent">by city</em>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
            {totalUniversities}+ medical universities across {totalCities} cities. Compare programs, fees, and student life within each city — because where you live for 6 years matters as much as the degree.
          </p>
        </div>
      </section>

      {/* ── CITY GRID BY COUNTRY ──────────────────────────────────── */}
      <div className="container-shell py-10 md:py-14">
        <div className="space-y-14">
          {sortedCountries.map(({ countryName, countrySlug, cities: countryCities }) => (
            <section key={countrySlug}>
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                  {countryName}
                </h2>
                <Link
                  href={getCountryHref(countrySlug)}
                  className="shrink-0 text-sm text-accent hover:underline"
                >
                  {countryName} guide →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {countryCities.map((city) => {
                  const guide = getCityGuide(city.slug);
                  return (
                    <Link
                      key={city.slug}
                      href={getCityHref(city.slug)}
                      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/40 hover:shadow-sm"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 shrink-0 text-accent" />
                          <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {city.name}
                          </span>
                        </div>
                        <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {city.universityCount} {city.universityCount === 1 ? "university" : "universities"}
                        </span>
                      </div>

                      {guide ? (
                        <p className="mb-4 text-sm leading-6 text-muted-foreground line-clamp-3">
                          {guide.summary}
                        </p>
                      ) : (
                        <p className="mb-4 text-sm leading-6 text-muted-foreground">
                          Compare {city.universityCount} medical {city.universityCount === 1 ? "university" : "universities"} in {city.name}, {countryName} — fees, recognition, and programs.
                        </p>
                      )}

                      <div className="mt-auto flex items-center gap-1 text-xs font-medium text-accent">
                        View universities
                        <ArrowRight className="size-3" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40">
        <div className="container-shell py-10 text-center">
          <h2 className="mb-3 font-display text-2xl font-semibold md:text-3xl">
            Not sure which city is right for you?
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground leading-7">
            Climate, cost, Indian community presence, and FMGE coaching availability vary significantly city by city. Our counsellors can help you compare these options based on your budget and priorities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Request counselling
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
