import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

type GuideSectionCard = {
  title: string;
  body: string;
};

type GuideSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  cards?: GuideSectionCard[];
};

type GuideFaq = {
  question: string;
  answer: string;
};

type GuideSource = {
  label: string;
  href: string;
  note: string;
};

type CommercialSeoGuidePageProps = {
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
  secondaryHref: string;
  secondaryLabel: string;
  keyTakeaways: string[];
  sections: GuideSection[];
  faqItems: GuideFaq[];
  officialSources: GuideSource[];
  leadTitle: string;
  leadDescription: string;
  notes: string;
};

export function CommercialSeoGuidePage({
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
  secondaryHref,
  secondaryLabel,
  keyTakeaways,
  sections,
  faqItems,
  officialSources,
  leadTitle,
  leadDescription,
  notes,
}: CommercialSeoGuidePageProps) {
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
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-5 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            {updatedOn}
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            {kicker}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href={primaryHref}
              className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
            >
              {secondaryLabel}
            </Link>
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
                {keyTakeaways.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-background p-4 text-base leading-7 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {sections.map((section) => (
              <section key={section.title} className="mt-12">
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  {section.title}
                </h2>
                {section.paragraphs ? (
                  <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                {section.bullets?.length ? (
                  <div className="mt-6 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl border border-border bg-card px-5 py-4 text-base leading-7 text-foreground shadow-sm"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
                {section.cards?.length ? (
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {section.cards.map((card) => (
                      <div
                        key={card.title}
                        className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                      >
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-muted-foreground">
                          {card.body}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Frequently asked questions
              </h2>
              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Official sources to verify before you apply
              </h2>
              <div className="mt-6 grid gap-4">
                {officialSources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {source.label}
                    </h3>
                    <p className="mt-2 text-sm text-accent">{source.href}</p>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {source.note}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                Need a shortlist?
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                {leadTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {leadDescription}
              </p>
            </div>

            <DeferredLeadForm
              sourcePath={path}
              ctaVariant="seo-guide-sidebar"
              title="Talk to an admissions counsellor"
              description="Share your budget, NEET status, and timeline. We will call you with Russia options that actually fit your profile."
              submitLabel="Request free counselling"
              countrySlug={countrySlug}
              courseSlug={courseSlug}
              notes={notes}
              embedded
              stacked
            />
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
