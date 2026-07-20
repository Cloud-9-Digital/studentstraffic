import type { Metadata } from "next";
import Image from "next/image";

import { JsonLd } from "@/components/shared/json-ld";
import { HeroCountryStrip } from "@/components/site/hero-country-strip";
import { HeroSearch } from "@/components/site/hero-search";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Study Abroad Consultants for Indian Students | Students Traffic",
  description:
    "Search universities, compare fees and eligibility, and get trusted study-abroad guidance from Students Traffic—built for Indian students and parents.",
  path: "/",
  keywords: [
    "study abroad for Indian students",
    "study abroad consultants India",
    "universities abroad for Indian students",
    "study abroad courses",
    "study abroad budget planning",
    "study abroad counselling India",
  ],
});

export default function HomePage() {
  const path = "/";
  const structuredDataItems = [
    getBreadcrumbStructuredData([{ name: "Home", path }]),
    getCollectionPageStructuredData({
      path,
      name: "Students Traffic Home",
      description:
        "Students Traffic helps Indian students and parents explore universities, compare study-abroad options, and get admissions guidance.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <>
      <section className="home-hero relative overflow-hidden bg-background">
        <HeroCountryStrip />
        <div className="container-shell relative mt-auto grid items-center gap-8 py-8 lg:mt-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)] lg:gap-12 lg:py-0 xl:gap-16">
          <div className="max-w-2xl text-left">
            <h1 className="max-w-[11ch] font-display text-[3.15rem] font-semibold leading-[0.94] tracking-[-0.055em] text-heading sm:text-6xl lg:text-[4.5rem]">
              Find the right university abroad.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Search universities, courses, fees and intake dates. Then talk to students who are already studying there.
            </p>
            <div className="mt-7 max-w-2xl">
              <HeroSearch />
            </div>
          </div>
          <div className="mx-auto hidden w-full max-w-[24rem] lg:flex lg:h-full lg:min-h-0 lg:max-w-none lg:items-center lg:justify-center">
            <Image
              src="/images/home/study-abroad-hero-illustration-v3.png"
              alt="An arriving student being welcomed by a peer on an international university campus"
              width={864}
              height={1821}
              priority
              sizes="(max-width: 1279px) 32vw, 31rem"
              style={{ height: "100%", maxHeight: "42rem", width: "auto" }}
              className="max-w-full object-contain"
            />
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
