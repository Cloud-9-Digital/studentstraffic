"use client";

import React from "react";
import Link from "next/link";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { LowFeeUniversitiesShowcase } from "@/components/site/low-fee-universities-showcase";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export type GuideSectionCard = {
  title: string;
  body: string;
};

export type GuideSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  cards?: GuideSectionCard[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type StudyAbroadGuidePageProps = {
  path: string;
  title: string;
  updatedOn: string;
  summary: string;
  kicker: string;
  publishedDate: string;
  countrySlug?: string;
  courseSlug?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryLabel: string;
  keyTakeaways: string[];
  sections: GuideSection[];
  faqItems: GuideFaq[];
  leadTitle: string;
  leadDescription: string;
  notes: string;
  showUniversities?: boolean;
};

export function StudyAbroadGuidePage({
  path,
  title,
  updatedOn,
  summary,
  kicker,
  publishedDate,
  countrySlug,
  courseSlug = "mbbs",
  primaryHref,
  primaryLabel,
  secondaryLabel,
  keyTakeaways,
  sections,
  faqItems,
  leadTitle,
  leadDescription,
  notes,
  showUniversities = false,
}: StudyAbroadGuidePageProps) {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path,
      name: title,
      description: summary,
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: title, path },
    ]),
    getFaqStructuredData(faqItems, path),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-background px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {updatedOn}
          </div>

          <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
            {kicker}
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {summary}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <CounsellingDialog
              triggerContent={
                <>
                  {secondaryLabel}
                  <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              }
              triggerClassName="group inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-base font-semibold text-background transition hover:opacity-90"
              plainTrigger
              title={leadTitle}
              description={leadDescription}
              submitLabel="Request callback"
              ctaVariant="seo-guide-hero"
              countrySlug={countrySlug}
              courseSlug={courseSlug}
            />
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-border px-6 py-3.5 text-base font-semibold text-foreground transition hover:bg-muted"
            >
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <article>
            {/* Quick Answer - Clean, no cards */}
            <div className="border-l-4 border-accent pl-6">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Quick answer
              </h2>
              <div className="mt-8 space-y-6">
                {keyTakeaways.map((item, idx) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="flex-1 pt-0.5 text-lg leading-relaxed text-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Table of Contents - Compact, clean */}
            <nav className="mt-16" aria-label="Table of contents">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {sections.map((section, idx) => (
                  <a
                    key={section.title}
                    href={`#${slugify(section.title)}`}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                  >
                    <span className="text-xs font-medium text-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-muted-foreground group-hover:text-foreground">
                      {section.title}
                    </span>
                  </a>
                ))}
                <a
                  href="#frequently-asked-questions"
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                >
                  <span className="text-xs font-medium text-accent">
                    {String(sections.length + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-muted-foreground group-hover:text-foreground">
                    Frequently asked questions
                  </span>
                </a>
              </div>
            </nav>

            {sections.map((section, sectionIdx) => {
              const isEven = sectionIdx % 2 === 0;
              const showUniversitiesAfterThis = showUniversities && sectionIdx === 1;

              return (
                <React.Fragment key={section.title}>
                  <section
                    id={slugify(section.title)}
                    className="mt-20 scroll-mt-6"
                  >
                  {/* Section Header */}
                  <div className={isEven ? "border-l-4 border-accent pl-6" : ""}>
                    <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                      {section.title}
                    </h2>
                  </div>

                  {/* Paragraphs - Clean typography */}
                  {section.paragraphs ? (
                    <div className="prose prose-lg mt-8 max-w-none space-y-6">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {/* Bullets - Checklist style, no cards */}
                  {section.bullets?.length ? (
                    <div className="mt-8 space-y-4">
                      {section.bullets.map((bullet, idx) => (
                        <div key={bullet} className="flex gap-4 border-b border-border/30 pb-4 last:border-0">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                            {idx + 1}
                          </div>
                          <p className="flex-1 text-base leading-relaxed text-foreground">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Cards - Magazine-style grid, minimal borders */}
                  {section.cards?.length ? (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      {section.cards.map((card, cardIdx) => (
                        <div
                          key={card.title}
                          className="group relative"
                        >
                          {/* Number badge */}
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-lg font-bold text-accent transition group-hover:bg-accent group-hover:text-white">
                            {card.title.split(".")[0] || cardIdx + 1}
                          </div>

                          <h3 className="font-display text-xl font-bold text-foreground">
                            {card.title.includes(".")
                              ? card.title.split(".").slice(1).join(".").trim()
                              : card.title}
                          </h3>

                          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                            {card.body}
                          </p>

                          {/* Subtle accent line */}
                          <div className="mt-4 h-1 w-12 rounded-full bg-accent/20 transition-all group-hover:w-20 group-hover:bg-accent" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  </section>

                  {/* Show university showcase after second section */}
                  {showUniversitiesAfterThis ? (
                    <LowFeeUniversitiesShowcase className="mt-20" />
                  ) : null}
                </React.Fragment>
              );
            })}

            {/* FAQ Section - Traditional FAQ styling */}
            <section
              id="frequently-asked-questions"
              className="mt-20 scroll-mt-6"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQs
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Frequently asked questions
              </h2>

              <div className="mt-10 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-border bg-card transition hover:border-accent/30"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 font-display text-lg font-semibold text-foreground transition group-hover:text-accent">
                      <span className="flex-1">{item.question}</span>
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-accent transition group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="border-t border-border/50 px-6 pb-5 pt-4">
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </article>
        </div>
      </section>

      {/* CTA Section - Full width, embedded naturally with proper spacing */}
      <section className="border-y border-border bg-muted/30 px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ready to start?
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                {leadTitle}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {leadDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  {primaryLabel}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <DeferredLeadForm
                sourcePath={path}
                ctaVariant="seo-guide-inline"
                title="Get free counselling"
                description="Share your details and we'll call you back with a personalized shortlist."
                submitLabel="Request callback"
                countrySlug={countrySlug}
                courseSlug={courseSlug}
                notes={notes}
                embedded
                stacked
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
