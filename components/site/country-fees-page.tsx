import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import type { FinderProgram, Faq } from "@/lib/data/types";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import {
  formatCurrencyUsd,
  formatProgramMedium,
  hasPublishedUsdAmount,
} from "@/lib/utils";

type CountryFeesPageProps = {
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
  feeExplainer: string[];
  faq: Faq[];
  programs: FinderProgram[];
};

export function buildCountryFeesMetadata({
  path,
  title,
  description,
  primaryKeyword,
  secondaryKeywords,
}: Pick<
  CountryFeesPageProps,
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

export function CountryFeesPage({
  path,
  title,
  description,
  publishedDate,
  updatedDate,
  primaryKeyword,
  countryName,
  countrySlug,
  intro,
  feeExplainer,
  faq,
  programs,
}: CountryFeesPageProps) {
  const normalizedPrograms = uniquePrograms(programs)
    .filter((program) => hasPublishedUsdAmount(program.offering.annualTuitionUsd))
    .sort((left, right) => left.offering.annualTuitionUsd - right.offering.annualTuitionUsd);

  const annualFees = normalizedPrograms.map((program) => program.offering.annualTuitionUsd);
  const hostelFees = normalizedPrograms
    .map((program) => program.offering.livingUsd)
    .filter(hasPublishedUsdAmount);
  const lowestAnnualFee = annualFees.length ? Math.min(...annualFees) : null;
  const highestAnnualFee = annualFees.length ? Math.max(...annualFees) : null;
  const lowestHostelEstimate = hostelFees.length ? Math.min(...hostelFees) : null;
  const quickAnswer = [
    lowestAnnualFee ? `annual tuition currently starts around ${formatCurrencyUsd(lowestAnnualFee)}` : null,
    highestAnnualFee ? `the upper published band reaches about ${formatCurrencyUsd(highestAnnualFee)}` : null,
    lowestHostelEstimate
      ? `hostel plus food estimates start near ${formatCurrencyUsd(lowestHostelEstimate)}`
      : "hostel and food should be verified per university",
  ]
    .filter(Boolean)
    .join(", ");

  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path,
      name: title,
      description,
      datePublished: publishedDate,
      dateModified: updatedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: `MBBS in ${countryName}`, path: `/mbbs-in-${countrySlug}` },
      { name: title, path },
    ]),
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
          <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {intro}
          </p>
          <div className="mt-8 max-w-4xl rounded-3xl border border-border bg-card/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Quick answer
            </p>
            <p className="mt-3 text-base leading-7 text-foreground">
              Across the published Students Traffic catalog, {primaryKeyword} means {quickAnswer}. Shortlist by total tuition, city, medium, and India-return planning instead of reacting only to a first-year quote.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Lowest annual tuition
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {lowestAnnualFee ? formatCurrencyUsd(lowestAnnualFee) : "Check universities"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Highest annual tuition
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {highestAnnualFee ? formatCurrencyUsd(highestAnnualFee) : "Check universities"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Lowest hostel + food estimate
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {lowestHostelEstimate ? formatCurrencyUsd(lowestHostelEstimate) : "Verify per university"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              How to read these {primaryKeyword} numbers
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {feeExplainer.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background p-4 text-base leading-7 text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Current fee snapshot
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              These figures come from the currently published university catalog on Students Traffic. They are best used for shortlisting and comparison. Students should still confirm the final official fee notice, hostel terms, and any one-time charges directly with the university before payment.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      University
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      City
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Tuition / year
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Hostel + food estimate
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Total tuition
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Medium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedPrograms.map((program) => (
                    <tr key={program.offering.slug} className="border-b border-border/60 align-top">
                      <td className="px-4 py-4">
                        <Link
                          href={`/universities/${program.university.slug}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {program.university.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {program.university.city}
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground">
                        {formatCurrencyUsd(program.offering.annualTuitionUsd)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {hasPublishedUsdAmount(program.offering.livingUsd)
                          ? formatCurrencyUsd(program.offering.livingUsd)
                          : "Verify with university"}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {hasPublishedUsdAmount(program.offering.totalTuitionUsd)
                          ? formatCurrencyUsd(program.offering.totalTuitionUsd)
                          : "Check yearly structure"}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatProgramMedium(program.offering.medium, countrySlug)}
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
                Next step after fee comparison
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Fees help you shortlist, but families usually convert better when they pair cost with the broader country decision page and then move into a real university shortlist.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/mbbs-in-${countrySlug}`}
                  className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
                >
                  Read MBBS in {countryName}
                </Link>
                <Link
                  href={`/universities?country=${countrySlug}&course=mbbs`}
                  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Browse universities
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Request counselling
                </Link>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                If you already know your budget, NEET profile, or preferred city, our team can help you cut this list down faster.
              </p>
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
