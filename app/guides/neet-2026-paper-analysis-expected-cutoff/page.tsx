import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import {
  contentAuthorName,
  contentAuthorSlug,
} from "@/lib/content-governance";

const path = "/guides/neet-2026-paper-analysis-expected-cutoff";
const title =
  "NEET 2026 Answer Key, Paper Analysis, Expected Cut Off: Latest Update and Next Steps";
const description =
  "NEET 2026 latest update on answer key status, paper analysis, expected cut off, marks vs rank planning, and what students should do next for MBBS admission in India.";
const publishedAt = "2026-05-03";
const updatedAt = "2026-05-04";
const coverPath = "/guides/raster/neet-2026-paper-analysis-cover.svg.png";
const coverUrl = absoluteUrl(coverPath);
const canonicalUrl = absoluteUrl(path);
const authorUrl = absoluteUrl(`/authors/${contentAuthorSlug}`);

export const metadata: Metadata = {
  title: `${title} | Students Traffic`,
  description,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title,
    description,
    type: "article",
    url: canonicalUrl,
    locale: "en_IN",
    siteName: "Students Traffic",
    images: [
      {
        url: coverUrl,
        width: 1600,
        height: 900,
        alt: title,
      },
    ],
    publishedTime: `${publishedAt}T00:00:00.000Z`,
    modifiedTime: `${updatedAt}T00:00:00.000Z`,
    authors: [contentAuthorName],
    section: "Admissions",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [coverUrl],
  },
};

const quickTakeaways = [
  "As of Monday, May 4, 2026, students should still verify any answer key update directly from official NEET and NTA communication.",
  "Unofficial coaching answer keys may help students estimate a range, but they are not the same as the official answer key or final result.",
  "The biggest mistake after the exam is taking one unofficial score estimate and making a final admission decision on that basis.",
] as const;

const nextSteps = [
  "Compare your expected score against last-year cutoff bands only as a planning range, not as a final prediction.",
  "Prepare category, domicile, and quota details early because your counselling path matters as much as raw marks.",
  "If government MBBS looks uncertain, assess private, deemed, and backup options before families lose time in false hope.",
  "Use a college predictor and counselling shortlist together. One gives range; the other gives decision quality.",
] as const;

const updateLog = [
  {
    timestamp: "May 4, 2026, 9:15 AM IST",
    title: "Official-source check completed",
    body:
      "We checked the official NEET and NTA pages again. Students should still verify all answer key movement from official communication before treating any unofficial key as final.",
  },
  {
    timestamp: "May 4, 2026, 9:05 AM IST",
    title: "Expected cut off talk remains speculative",
    body:
      "Expected cut off discussion is still useful only for planning ranges. It should not be treated as a confirmed signal for final MBBS seat chances.",
  },
  {
    timestamp: "May 4, 2026, 8:55 AM IST",
    title: "Marks vs rank planning remains important",
    body:
      "Students who are estimating their score should start preparing a realistic counselling list based on category, quota, domicile, and fee affordability.",
  },
] as const;

const liveUpdateRows = [
  {
    label: "Official answer key status",
    value:
      "Students should still verify directly on the official NEET site before treating any key as final.",
  },
  {
    label: "Core update themes right now",
    value:
      "Answer key, question paper analysis, expected cut off, marks vs rank, and NEET 2026 latest updates are the main search themes right now.",
  },
  {
    label: "Best use of exam-day content",
    value:
      "Use it to build a planning range for counselling, not to make a final admission decision.",
  },
] as const;

const parentMistakes = [
  "Treating one coaching answer key as a confirmed result",
  "Waiting too long to evaluate private-fee affordability",
  "Ignoring state-quota rules until counselling opens",
  "Deciding between repeat and alternate routes without a realistic college list",
] as const;

const faqs = [
  {
    question: "Has the official NEET 2026 answer key been released?",
    answer:
      "As of May 4, 2026, students should still verify official NEET and NTA communication directly before treating any answer key as final. Coaching keys should be treated as provisional.",
  },
  {
    question: "Should students trust expected cutoff discussions on exam day?",
    answer:
      "Expected cut off discussion is useful only as a planning signal. Actual counselling decisions depend on final result behaviour, category, quota, domicile, seat matrix changes, and round-wise competition.",
  },
  {
    question: "What should students do right after the NEET 2026 exam?",
    answer:
      "They should estimate a broad score range, gather category and state-quota details, review realistic college buckets, and avoid making final admission decisions from one unofficial answer key.",
  },
  {
    question: "When can students expect more clarity on NEET 2026 result and counselling planning?",
    answer:
      "Students usually get useful clarity in stages, not all at once. First comes unofficial discussion, then official answer-key communication when issued, then final result, and after that the real counselling picture becomes clearer through category, quota, and seat-matrix behaviour.",
  },
  {
    question: "Should students start checking private and deemed college options now?",
    answer:
      "Yes, especially if they expect a borderline score range for government MBBS. Students should not wait till the last minute to understand fee level, category impact, state quota rules, and practical backup options.",
  },
] as const;

const relatedGuides = [
  {
    title: "NEET 2026 Expected Cut Off",
    description:
      "A practical guide to how students should read expected cut off movement by category and what it may mean for counselling planning.",
    href: "/guides/neet-2026-expected-cut-off",
  },
  {
    title: "NEET 2026 Marks vs Rank",
    description:
      "Understand how marks vs rank discussion should be used after the exam and why students should work in ranges instead of false precision.",
    href: "/guides/neet-2026-marks-vs-rank",
  },
] as const;

export default function Neet2026PaperAnalysisPage() {
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "NEET 2026 Paper Analysis", path },
    ]),
    getWebPageStructuredData({
      path,
      name: title,
      description,
      datePublished: publishedAt,
      dateModified: updatedAt,
    }),
    {
      "@type": "BlogPosting",
      "@id": canonicalUrl,
      url: canonicalUrl,
      headline: title,
      description,
      image: {
        "@type": "ImageObject",
        url: coverUrl,
        width: 1600,
        height: 900,
      },
      datePublished: `${publishedAt}T00:00:00.000Z`,
      dateModified: `${updatedAt}T00:00:00.000Z`,
      inLanguage: "en-IN",
      articleSection: "Admissions",
      author: {
        "@type": "Person",
        name: contentAuthorName,
        url: authorUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Students Traffic",
        url: absoluteUrl("/"),
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-surface-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
          <div className="hero-grid-lines absolute inset-0 pointer-events-none" />

          <div className="container-shell relative py-12 md:py-16 lg:py-18">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                NEET 2026 Latest Update
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                Students do not need more confusion after the exam. They need a
                practical plan. This page covers the latest NEET 2026 update on
                answer key status, paper analysis, expected cut off thinking,
                and what students should do next if they want a realistic MBBS
                college list.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" />
                  Published May 3, 2026
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" />
                  Updated May 4, 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4 text-accent" />
                  8 min read
                </span>
                <Link
                  href={`/authors/${contentAuthorSlug}`}
                  className="hover:text-white/82"
                >
                  By {contentAuthorName}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="accent">
                  <Link href="/neet-college-predictor">
                    Get my college prediction
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/18 bg-white/6 text-white hover:bg-white/12 hover:text-white"
                >
                  <Link href="#next-steps">See what to do next</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <article className="py-12 md:py-16">
          <div className="container-shell">
            <div className="mx-auto max-w-4xl space-y-12">
                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    Latest updates
                  </h2>
                  <div className="space-y-4">
                    {updateLog.map((entry) => (
                      <div
                        key={entry.timestamp}
                        className="rounded-3xl border border-border bg-card p-6"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                          {entry.timestamp}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold text-heading">
                          {entry.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {entry.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-5">
                  <ContentTrustPanel lastReviewed={updatedAt} />
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                      Short Answer First
                    </p>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                      The exam may be over, but most students still do not know
                      what their result is likely to mean. Immediately after the
                      exam, families start hearing three things: one coaching
                      key says the paper was manageable, another says the cut
                      off will go up, and a third says government MBBS will be
                      very difficult unless the score is extremely high. That
                      combination creates more panic than clarity.
                    </p>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                      The better approach is to separate what is official from
                      what is still speculative. Then students can prepare a
                      realistic next-step plan around college range, category,
                      quota, and fee affordability before counselling starts
                      moving quickly.
                    </p>
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    Live update snapshot
                  </h2>
                  <div className="overflow-hidden rounded-3xl border border-border bg-card">
                    {liveUpdateRows.map((row, index) => (
                      <div
                        key={row.label}
                        className={`grid gap-2 px-6 py-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 ${
                          index < liveUpdateRows.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <p className="text-sm font-semibold text-heading">
                          {row.label}
                        </p>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    What the official situation looks like on May 4, 2026
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    As of Monday, May 4, 2026, the safest approach is still to
                    separate official communication from unofficial exam-day
                    discussion. Students should not confuse coaching-key
                    discussion with confirmed answer-key publication or final
                    result outcome.
                  </p>
                  <div className="grid gap-3">
                    {quickTakeaways.map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-2xl border border-border bg-card px-5 py-4"
                      >
                        <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent" />
                        <p className="text-sm leading-7 text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Source checks:
                    {" "}
                    <a
                      href="https://neet.nta.nic.in/"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      official NEET website
                    </a>
                    {" "}
                    and
                    {" "}
                    <a
                      href="https://www.nta.ac.in/"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      NTA
                    </a>
                    .
                  </p>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    Expected cut off talk is useful, but only if you use it correctly
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    Expected cut off content gets a lot of traffic because
                    families want quick direction. That is understandable. The
                    mistake is treating one expected cut off number as a final
                    decision signal. Cut offs are shaped by much more than paper
                    difficulty. They also move with candidate behaviour, score
                    spread, category mix, seat availability, and counselling
                    round movement.
                  </p>
                  <p className="text-base leading-8 text-muted-foreground">
                    In practice, students should use expected cut off discussion
                    only for planning in ranges:
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                      <h3 className="font-semibold text-heading">Strong government range</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Families in this band should focus on AIQ versus state
                        strategy, realistic college preference order, and
                        whether category or domicile meaningfully expands the list.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card p-6">
                      <h3 className="font-semibold text-heading">Borderline range</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Students here need a wider plan: government possibilities,
                        private affordability, deemed-college risk, and repeat-year
                        thinking should all be evaluated together.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-border bg-card p-6">
                      <h3 className="font-semibold text-heading">Low-confidence range</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        The priority is speed and honesty. Families should stop
                        waiting for miracle assumptions and start checking what is
                        financially and academically practical.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    Question paper analysis and marks vs rank talk need context
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    Students are not looking for only one thing after the exam.
                    They are trying to connect unofficial keys, question paper
                    difficulty, marks vs rank assumptions, and cut off anxiety
                    into one practical decision path. That is why this page has
                    to work as an update page, not just as a one-paragraph
                    reaction.
                  </p>
                  <p className="text-base leading-8 text-muted-foreground">
                    For our audience, the useful interpretation is this:
                    marks vs rank content is not a verdict. It is a bridge
                    between exam-day uncertainty and counselling planning. The
                    real value is knowing which college buckets you should start
                    checking while you wait for official clarity.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedGuides.map((guide) => (
                      <Link
                        key={guide.href}
                        href={guide.href}
                        className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/25"
                      >
                        <p className="text-sm font-semibold text-heading">
                          {guide.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {guide.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          Open guide
                          <ArrowRight className="size-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    When should students expect better clarity?
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    After the exam, most families want one clean answer: what
                    score, what rank, what college. In reality, NEET clarity
                    arrives in stages. First there is paper discussion. Then
                    there may be unofficial answer-key comparison. After that,
                    official answer-key communication and result process matter
                    much more. Only then does the counselling picture start
                    becoming clearer.
                  </p>
                  <p className="text-base leading-8 text-muted-foreground">
                    That is why students should use this period to prepare
                    category documents, domicile thinking, realistic fee
                    planning, and a college shortlist. Students who do this
                    early usually make calmer and stronger decisions once the
                    official process moves ahead.
                  </p>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    Government, private, and deemed options should all be viewed early
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    One common mistake after NEET is thinking only in two
                    extremes: either guaranteed government MBBS or full repeat.
                    That is not how many real families should plan. Depending on
                    the likely score range, category, state quota strength, and
                    fee comfort, students may need to evaluate government,
                    private, deemed, and backup routes together.
                  </p>
                  <p className="text-base leading-8 text-muted-foreground">
                    This does not mean rushing into a costly decision. It means
                    being better prepared. Students should know in advance what
                    their realistic college bucket may look like, what fee range
                    the family can actually manage, and whether repeating is a
                    stronger option than taking a weak-fit admission.
                  </p>
                </section>

                <section id="next-steps" className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    What students should do in the next few days
                  </h2>
                  <div className="space-y-3">
                    {nextSteps.map((step) => (
                      <div
                        key={step}
                        className="flex gap-3 rounded-2xl border border-border bg-card px-5 py-4"
                      >
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                        <p className="text-sm leading-7 text-muted-foreground">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl border border-primary/15 bg-[linear-gradient(180deg,rgba(11,49,43,0.04),rgba(11,49,43,0.02))] p-6 md:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                      Better Decision Flow
                    </p>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                      Students do not need one number alone. They need a proper
                      shortlist with buckets. A useful NEET predictor should
                      show safer, possible, and ambitious college ranges. That
                      is what helps a family move from panic to planning.
                    </p>
                    <div className="mt-5">
                      <Button asChild>
                        <Link href="/neet-college-predictor">
                          Open the NEET college predictor
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                      Get your list
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
                      Request your NEET college prediction.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Share your details and we&apos;ll send your predicted
                      college list on email.
                    </p>
                    <div className="mt-6">
                      <DeferredLeadForm
                        sourcePath={path}
                        ctaVariant="neet_2026_article_inline"
                        title="Get your college prediction"
                        description="Enter your email, phone number, and state. Your predicted college list will be sent on email."
                        submitLabel="Get my prediction"
                        emailRequired
                        notes="NEET 2026 editorial article CTA. Promise predictor results by email; no email automation wired yet."
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    The parent mistakes that cost time later
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    A lot of post-exam regret does not come from the score
                    itself. It comes from delay, poor filtering, and emotionally
                    expensive assumptions. These are the patterns students and families
                    should avoid immediately:
                  </p>
                  <ul className="grid gap-3">
                    {parentMistakes.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-border bg-card px-5 py-4 text-sm leading-7 text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    Final view
                  </h2>
                  <p className="text-base leading-8 text-muted-foreground">
                    NEET 2026 exam-day discussion will keep changing. What
                    matters more is whether the student enters counselling with
                    a realistic list, honest backup options, and a clear
                    understanding of what the likely score range means. That is
                    where better decisions begin.
                  </p>
                </section>

                <section id="faq" className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    FAQs
                  </h2>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div
                        key={faq.question}
                        className="rounded-3xl border border-border bg-card p-6"
                      >
                        <h3 className="text-lg font-semibold text-heading">
                          {faq.question}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    More NEET 2026 guides
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedGuides.map((guide) => (
                      <Link
                        key={guide.href}
                        href={guide.href}
                        className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/25"
                      >
                        <h3 className="text-lg font-semibold text-heading">
                          {guide.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {guide.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
            </div>
          </div>
        </article>
      </main>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
