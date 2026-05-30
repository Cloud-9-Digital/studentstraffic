import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { UniversityCard } from "@/components/site/university-card";
import type { FinderProgram, Faq } from "@/lib/data/types";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getFaqStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { formatCurrencyUsd, formatProgramMedium, hasPublishedUsdAmount } from "@/lib/utils";

type CountryShortlistPageProps = {
  path: string;
  title: string;
  description: string;
  publishedDate: string;
  updatedDate: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  countryName: string;
  countrySlug: string;
  intro: string;
  quickTakeaways: string[];
  shortlistFramework: string[];
  faq: Faq[];
  programs: FinderProgram[];
};

export function buildCountryShortlistMetadata({
  path,
  title,
  description,
  primaryKeyword,
  secondaryKeywords,
}: Pick<
  CountryShortlistPageProps,
  "path" | "title" | "description" | "primaryKeyword" | "secondaryKeywords"
>) {
  return buildIndexableMetadata({
    title,
    description,
    path,
    openGraphType: "article",
    keywords: [primaryKeyword, ...secondaryKeywords],
  });
}

function uniquePrograms(programs: FinderProgram[]) {
  const seen = new Set<string>();
  return programs.filter((program) => {
    const key = `${program.university.slug}:${program.offering.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function CountryShortlistPage({
  path,
  title,
  description,
  publishedDate,
  updatedDate,
  primaryKeyword,
  countryName,
  countrySlug,
  intro,
  quickTakeaways,
  shortlistFramework,
  faq,
  programs,
}: CountryShortlistPageProps) {
  const shortlistPrograms = uniquePrograms(programs).filter(
    (program) => hasPublishedUsdAmount(program.offering.annualTuitionUsd),
  );

  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path,
      name: title,
      description,
      datePublished: publishedDate,
      dateModified: updatedDate,
    }),
    getCollectionPageStructuredData({
      path,
      name: title,
      description,
      datePublished: publishedDate,
      dateModified: updatedDate,
      mainEntityId: shortlistPrograms.length
        ? getItemListStructuredDataId(path)
        : undefined,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: `MBBS in ${countryName}`, path: `/mbbs-in-${countrySlug}` },
      { name: title, path },
    ]),
    shortlistPrograms.length
      ? getProgramItemListStructuredData({
          path,
          name: `${title} shortlist`,
          programs: shortlistPrograms,
        })
      : null,
    getFaqStructuredData(faq, path),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            Updated on {updatedDate}
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                {intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/mbbs-in-${countrySlug}`}
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Read MBBS in {countryName}
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Request counselling
                </Link>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {quickTakeaways.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border bg-card/90 p-4 text-base leading-7 text-foreground shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={path}
                ctaVariant="commercial_shortlist_sidebar"
                title={`Get a ${countryName} shortlist`}
                description="Share your details and our team will suggest universities based on your NEET profile, budget, and country preference."
                courseSlug="mbbs"
                countrySlug={countrySlug}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              How to use this {primaryKeyword} shortlist
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {shortlistFramework.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background p-4 text-base leading-7 text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Shortlisted universities
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Current universities worth shortlisting first
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                This is a decision-first list, not a random ranking table. We are prioritizing universities that are easier to explain honestly to Indian families across cost, city, medium, and overall fit.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {shortlistPrograms.map((program, index) => (
                <UniversityCard
                  key={program.offering.slug}
                  program={program}
                  imagePriority={index < 2}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Quick comparison table
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              Use this table to compare university-level cost bands and medium before opening each detailed profile.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      University
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      City
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Tuition / year
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Medium
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Best fit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shortlistPrograms.map((program) => (
                    <tr key={program.offering.slug} className="border-b border-border/60 align-top">
                      <td className="px-4 py-4">
                        <Link
                          href={`/university/${program.university.slug}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {program.university.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {program.university.city}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {program.university.type}
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground">
                        {formatCurrencyUsd(program.offering.annualTuitionUsd)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatProgramMedium(program.offering.medium, countrySlug)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {program.university.bestFitFor[0] ?? "Open the full profile"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Best next pages
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/mbbs-in-${countrySlug}-fees`}
                  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Compare fees
                </Link>
                <Link
                  href={`/universities?country=${countrySlug}&course=mbbs`}
                  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Browse all universities
                </Link>
                <Link
                  href="/students"
                  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Talk to students
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                FAQ
              </h2>
              <div className="mt-6 space-y-4">
                {faq.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-border/70 bg-background p-4">
                    <h3 className="text-base font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
