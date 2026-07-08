"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { LowFeeUniversitiesShowcase } from "@/components/site/low-fee-universities-showcase";
import { getCountryHeroImage } from "@/lib/country-media";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { getCountryFlagCode } from "@/lib/university-media";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

function getCardNumber(cardTitle: string, index: number) {
  const match = cardTitle.match(/^(\d+)\.\s*(.*)$/);

  return match?.[1] ?? String(index + 1);
}

function getCardHeading(cardTitle: string) {
  const match = cardTitle.match(/^\d+\.\s*(.*)$/);

  return match?.[1] ?? cardTitle;
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
  leadSubmitLabel?: string;
  notes: string;
  /** Gates the "Scholarship Planning Hub" cross-link section — purely a page-content toggle, unrelated to the lead form. */
  guideVariant?: "mbbs" | "scholarship";
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
  leadSubmitLabel = "Request callback",
  notes,
  guideVariant = "mbbs",
  showUniversities = false,
}: StudyAbroadGuidePageProps) {
  const heroImage = countrySlug ? getCountryHeroImage(countrySlug) : null;
  const hasHeroPanel = Boolean(countrySlug);
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
      <section className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(180deg,rgba(233,123,59,0.08)_0%,rgba(255,255,255,0.96)_18%,rgba(255,255,255,1)_100%)] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle_at_top_left,rgba(233,123,59,0.18),transparent_58%),radial-gradient(circle_at_top_right,rgba(15,61,55,0.10),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-background/60" />

        <div
          className={[
            "relative mx-auto max-w-5xl",
            hasHeroPanel ? "lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-12" : "",
          ].join(" ")}
        >
          <div className="flex flex-col justify-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent/85">
              {kicker}
            </div>

            <h1 className="max-w-4xl text-balance font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold tracking-tight text-foreground lg:leading-[1.02]">
              {title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {summary}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
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
                submitLabel={leadSubmitLabel}
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

          {hasHeroPanel ? (
            <div className="mt-8 self-center lg:mt-0">
              <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/80 shadow-[0_24px_60px_-32px_rgba(15,61,55,0.35)] backdrop-blur">
                <div className="relative aspect-[4/4.9] overflow-hidden">
                  {heroImage ? (
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 360px, 100vw"
                      unoptimized={heroImage.url.startsWith("/")}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(15,61,55,0.14)_0%,rgba(233,123,59,0.12)_55%,rgba(255,255,255,0.9)_100%)]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,61,55,0.02)_0%,rgba(15,61,55,0.18)_100%)]" />
                </div>
              </div>
            </div>
          ) : null}
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

            {/* Table of Contents - Collapsed by default to keep the top of long pages tighter */}
            <details className="group mt-16 rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 list-none">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    On this page
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Jump to sections without the long scroll.
                  </p>
                </div>
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
              <nav
                aria-label="Table of contents"
                className="border-t border-border/50 px-3 py-3"
              >
                <div className="grid gap-2 sm:grid-cols-2">
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
            </details>

            {guideVariant === "scholarship" ? (
              <div className="mt-8 rounded-2xl border border-accent/20 bg-[linear-gradient(145deg,rgba(233,123,59,0.07)_0%,rgba(15,61,55,0.03)_100%)] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Scholarship Planning Hub
                </p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                      Compare more scholarship routes before you decide.
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Use our broader scholarship hub to move between Germany, Russia MBBS, and other funding-focused study abroad pages without losing the bigger planning picture.
                    </p>
                  </div>
                  <Link
                    href="/scholarships-for-indian-students-to-study-abroad"
                    className="inline-flex items-center gap-2 self-start rounded-full border border-accent/20 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Explore scholarship hub
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : null}

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
                            {getCardNumber(card.title, cardIdx)}
                          </div>

                          <h3 className="font-display text-xl font-bold text-foreground">
                            {getCardHeading(card.title)}
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
                submitLabel={leadSubmitLabel}
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
