import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

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

const path = "/guides/neet-2026-marks-vs-rank";
const title =
  "NEET 2026 Marks vs Rank: Score Ranges, Rank Estimates, Counselling Use";
const description =
  "NEET 2026 marks vs rank guide for students and parents, including official-status context, score-range planning, and practical use for MBBS counselling.";
const publishedAt = "2026-05-04";
const updatedAt = "2026-05-04";
const reviewedAt = "May 4, 2026, 5:59 PM IST";
const canonicalUrl = absoluteUrl(path);
const authorUrl = absoluteUrl(`/authors/${contentAuthorSlug}`);

export const metadata: Metadata = {
  title: `${title} | Students Traffic`,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title,
    description,
    type: "article",
    url: canonicalUrl,
    locale: "en_IN",
    siteName: "Students Traffic",
    publishedTime: `${publishedAt}T00:00:00.000Z`,
    modifiedTime: `${updatedAt}T00:00:00.000Z`,
    authors: [contentAuthorName],
    section: "Admissions",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const rangePoints = [
  "Marks vs rank should be read as a practical range, not a guaranteed exact rank.",
  "Any NEET 2026 rank estimate right now remains unofficial until the official process moves ahead.",
  "Even a small score swing can feel emotionally huge after the exam, but students still need broad planning discipline.",
  "Counselling decisions should be built on category, quota, domicile, and college type along with likely rank range.",
] as const;

const officialContextPoints = [
  "The official NEET site shows exam-conduct messaging for May 3, 2026, along with the earlier April 12 city intimation and April 26 admit card updates.",
  "As of our May 4, 2026, 5:59 PM IST review, we did not see an official 2026 answer key or result notice on the main NEET page or documents listing.",
  "The visible 2026 entries on the documents page were still the admit card, city-intimation, bulletin, syllabus, and earlier application notices rather than a 2026 answer key or result item.",
  "That means current marks vs rank discussion should still be used only as a planning estimate, not as a confirmed rank outcome.",
] as const;

const faqs = [
  {
    question: "Can students predict exact rank from marks after NEET 2026?",
    answer:
      "No. Students can estimate a broad range, but exact rank prediction is risky before the official process gives more clarity.",
  },
  {
    question: "Why is marks vs rank still useful then?",
    answer:
      "Because it helps students move from raw marks anxiety to counselling planning. A useful range can help them prepare safer, possible, and ambitious college buckets.",
  },
  {
    question: "Is any NEET 2026 rank estimate official right now?",
    answer:
      "No. As of Monday, May 4, 2026, 5:59 PM IST, our review of the official NEET site did not show a 2026 answer key or result notice yet. So current rank discussions should be treated as unofficial estimates for planning only.",
  },
  {
    question: "What should students do if their expected marks put them in a grey zone?",
    answer:
      "They should avoid overconfidence and avoid panic. This is the stage to shortlist government, private, and deemed possibilities realistically and prepare a proper counselling strategy.",
  },
  {
    question: "What is the safest way to use marks vs rank after the exam?",
    answer:
      "Treat it as a range, connect that range to category and quota realities, and keep updating your shortlist as official NEET updates arrive.",
  },
  {
    question: "Why should students keep checking the documents page as well as the homepage?",
    answer:
      "Because official answer-key and result material is often easiest to confirm from the document listing. In our May 4, 2026, 5:59 PM IST review, the visible 2026 entries there were still pre-result items, so marks-vs-rank estimates should remain unofficial planning tools for now.",
  },
  {
    question: "Should students change their rank estimate if an unofficial answer key goes viral?",
    answer:
      "Only carefully, and only as a planning range. Until NTA publishes an official answer-key notice, students should avoid rebuilding their entire rank expectation around one unofficial key or one social-media claim.",
  },
] as const;

const relatedGuides = [
  {
    title: "NEET 2026 latest update page",
    description:
      "Check the main NEET 2026 update page for dated official-status checks and answer-key context.",
    href: "/guides/neet-2026-paper-analysis-expected-cutoff",
  },
  {
    title: "NEET 2026 expected cut off guide",
    description:
      "Pair marks vs rank ranges with expected cut off thinking so your shortlist is grounded, not emotional.",
    href: "/guides/neet-2026-expected-cut-off",
  },
] as const;

export default function Neet2026MarksVsRankPage() {
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "NEET 2026 Marks vs Rank", path },
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
                NEET 2026 Marks vs Rank
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                After the exam, students immediately start converting marks into
                rank. That is normal, but it should be done carefully. The right
                use of marks vs rank is to build a sensible counselling range,
                not to create false certainty.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" />
                  Updated {reviewedAt}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4 text-accent" />
                  7 min read
                </span>
                <Link href={`/authors/${contentAuthorSlug}`} className="hover:text-white/82">
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
                  <Link href="/guides/neet-2026-paper-analysis-expected-cutoff">
                    Open latest update page
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <article className="py-12 md:py-16">
          <div className="container-shell">
            <div className="mx-auto max-w-4xl space-y-12">
              <section className="space-y-5">
                <ContentTrustPanel lastReviewed={updatedAt} />
                <div className="grid gap-3">
                  {rangePoints.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border bg-card px-5 py-4 text-sm leading-7 text-muted-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Official context before you estimate rank
                </h2>
                <div className="grid gap-3">
                  {officialContextPoints.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border bg-card px-5 py-4 text-sm leading-7 text-muted-foreground"
                    >
                      {item}
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
                    href="https://neet.nta.nic.in/documents/"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    documents page
                  </a>
                  . The answer-key status line above is an inference from those
                  pages.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Why students should think in ranges
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  After NEET, students often start with one question: if my
                  marks are around this range, what rank may come? That is a
                  fair question, but it should not be turned into exact-number
                  confidence too early. Marks vs rank works best when students
                  think in ranges instead of pretending there is no uncertainty.
                </p>
                <p className="text-base leading-8 text-muted-foreground">
                  A range-based approach helps students prepare better. It stops
                  them from locking themselves into one dream college too early
                  and helps them plan safer alternatives as well.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  What marks vs rank should actually help you do
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-heading">Estimate range</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Understand whether your likely outcome looks strong,
                      borderline, or uncertain for MBBS admission.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-heading">Prepare shortlist</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Build safer, possible, and ambitious college buckets
                      instead of waiting blindly for counselling.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-heading">Plan budget</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Decide early whether private or deemed options need to be
                      studied seriously by the family.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Why exact-rank thinking can mislead students
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  Exact-rank thinking sounds precise, but it often creates false
                  confidence. Students may assume one score means one final
                  rank, then build their whole college expectation around that.
                  That is not a safe way to plan.
                </p>
                <p className="text-base leading-8 text-muted-foreground">
                  The better approach is to accept uncertainty and prepare more
                  intelligently. Students who do this are usually much better
                  placed when counselling opens.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Keep the planning pages together
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

              <section className="space-y-5">
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                    Need your range?
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
                    Request your NEET college prediction.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Share your details and we&apos;ll send your predicted college
                    list on email.
                  </p>
                  <div className="mt-6">
                    <DeferredLeadForm
                      sourcePath={path}
                      ctaVariant="neet_2026_marks_vs_rank_inline"
                      title="Get your college prediction"
                      description="Enter your email, phone number, and state. Your predicted college list will be sent on email."
                      submitLabel="Get my prediction"
                      emailRequired
                      notes="NEET 2026 marks vs rank guide CTA. Promise predictor results by email; no email automation wired yet."
                    />
                  </div>
                </div>
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
            </div>
          </div>
        </article>
      </main>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
