import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

type FaqItem = {
  question: string;
  answer: string;
};

type CountryCard = {
  name: string;
  label: string;
  strengths: string[];
  cautions: string[];
  href: string;
};

type ComparisonRow = {
  criterion: string;
  leftValue: string;
  rightValue: string;
  verdict: string;
};

type CountryComparisonPageProps = {
  path: string;
  title: string;
  description: string;
  publishedDate: string;
  updatedDate: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string;
  quickAnswer: string[];
  leftCountry: CountryCard;
  rightCountry: CountryCard;
  comparisonRows: ComparisonRow[];
  finalVerdict: string[];
  faq: FaqItem[];
  nextReads: Array<{ href: string; label: string }>;
};

export function buildCountryComparisonMetadata({
  path,
  title,
  description,
  primaryKeyword,
  secondaryKeywords,
}: Pick<
  CountryComparisonPageProps,
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

export function CountryComparisonPage({
  path,
  title,
  description,
  publishedDate,
  updatedDate,
  leftCountry,
  rightCountry,
  intro,
  quickAnswer,
  comparisonRows,
  finalVerdict,
  faq,
  nextReads,
}: CountryComparisonPageProps) {
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
                  href={leftCountry.href}
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Read {leftCountry.name}
                </Link>
                <Link
                  href={rightCountry.href}
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Read {rightCountry.name}
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Get a counselling call
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={path}
                ctaVariant="commercial_comparison_sidebar"
                title="Need help choosing the better fit?"
                description="Share your budget, NEET profile, and priorities. Our team will tell you whether Russia or Vietnam is the more practical next step."
                courseSlug="mbbs"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Quick answer
              </h2>
              <div className="mt-6 space-y-4">
                {quickAnswer.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-background p-4 text-base leading-7 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-12 grid gap-6 lg:grid-cols-2">
              {[leftCountry, rightCountry].map((country) => (
                <div
                  key={country.name}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {country.label}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                    {country.name}
                  </h2>
                  <div className="mt-6 space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Stronger when
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {country.strengths.map((item) => (
                          <li
                            key={item}
                            className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Main cautions
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {country.cautions.map((item) => (
                          <li
                            key={item}
                            className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Russia vs Vietnam comparison table
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                This table is built for Indian families comparing real admission trade-offs, not just headline marketing claims.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[940px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Criterion
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {leftCountry.name}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {rightCountry.name}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Practical verdict
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.criterion} className="border-b border-border/60 align-top">
                        <td className="px-4 py-4 font-medium text-foreground">
                          {row.criterion}
                        </td>
                        <td className="px-4 py-4 text-sm leading-7 text-muted-foreground">
                          {row.leftValue}
                        </td>
                        <td className="px-4 py-4 text-sm leading-7 text-muted-foreground">
                          {row.rightValue}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium leading-7 text-foreground">
                          {row.verdict}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Final verdict for Indian students
              </h2>
              <div className="mt-6 space-y-4">
                {finalVerdict.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-background p-4 text-base leading-7 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                FAQ
              </h2>
              <div className="mt-6 space-y-4">
                {faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-2xl border border-border/70 bg-background p-4"
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Best next pages
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {nextReads.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
