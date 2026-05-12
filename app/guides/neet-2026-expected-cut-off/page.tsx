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

const path = "/guides/neet-2026-expected-cut-off";
const title =
  "NEET 2026 Expected Cut Off: Category-Wise Estimate After Provisional Answer Key";
const description =
  "NEET 2026 expected cut off guide for students and parents, updated after our May 12, 2026, 10:54 AM IST official-source check, with the official provisional answer key still live on the NEET homepage, the public notices page now showing the answer-key items, and no official result or cut off notice visible yet.";
const publishedAt = "2026-05-04";
const updatedAt = "2026-05-12";
const reviewedAt = "May 12, 2026, 10:54 AM IST";
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

const keyPoints = [
  "Expected cut off is a planning tool, not a final result.",
  "The official provisional answer key is now live, but expected cut off discussion is still unofficial planning content.",
  "The official NEET homepage is also carrying a May 10, 2026 press release, but that does not amount to an official cut off or result update.",
  "Category, quota, domicile, and seat movement matter as much as broad paper difficulty.",
  "Students should work in score ranges and college buckets, not one imaginary exact college.",
] as const;

const officialContextPoints = [
  "The official NEET website shows that NEET (UG) 2026 was conducted on May 3, 2026.",
  "The same site also shows the advance city intimation update published on April 12, 2026, the admit card update published on April 26, 2026, exam-conduct messaging for May 3, 2026, a provisional answer key notice dated May 6, 2026, and a press release dated May 10, 2026.",
  `In our ${reviewedAt} review, the NEET homepage was visibly surfacing the provisional answer key notice and a separate official provisional answer key PDF link.`,
  "The May 10 press release says reports around alleged irregularities are under investigation and says any necessary next step will be examined after agency findings.",
  "That official notice says candidates can challenge the provisional answer keys only after the scanned OMR answer sheet is uploaded, and the schedule for OMR upload plus the challenge round will be notified separately.",
  "In the same review, the NEET public-notices category page was visibly listing the provisional answer key notice and the separate provisional answer key PDF on page one, and its footer was showing Last Updated: May 06, 2026.",
  "We still treated the documents page as a secondary source because the homepage, public notices, direct PDFs, and helpdesk page gave a clearer answer-key trail.",
  "We also checked the NTA Notice Board Archive, which in this review was listing the NEET 2026 provisional answer key item as a parent-site cross-check.",
] as const;

const faqs = [
  {
    question: "Can NEET 2026 expected cut off be trusted fully?",
    answer:
      "No. Expected cut off should be used only as an early planning range. Final counselling outcomes depend on category, quota, state rules, seat matrix, and round-wise competition.",
  },
  {
    question: "Why does expected cut off discussion vary so much?",
    answer:
      "Different assumptions are used around paper difficulty, candidate performance spread, and category behaviour. That is why students should not rely on one number alone.",
  },
  {
    question: "Is there any official NEET 2026 cut off notice yet?",
    answer:
      "No. The official provisional answer key is now out, but there is still no official NEET 2026 cut off notice. Expected cut off discussion should still be treated as unofficial planning content until result and counselling data start giving more clarity.",
  },
  {
    question: "What should students do with expected cut off information?",
    answer:
      "They should use it to prepare safer, possible, and ambitious college buckets and to decide how seriously they need to evaluate private or deemed options.",
  },
  {
    question: "Should category-wise planning start before the official answer key?",
    answer:
      "Yes. The official provisional answer key is now available, which helps students estimate a better score range, but they should still keep their shortlist flexible until the OMR upload, challenge stage, final key, and result bring more clarity.",
  },
  {
    question: "What official pages should students keep checking?",
    answer:
      `Students should keep checking the official NEET homepage, the direct provisional answer key notice PDF, the provisional answer key PDF, the May 10 press release PDF, the NEET documents page, the NEET helpdesk page, the public-notices category page, and the NTA Notice Board Archive. In our ${reviewedAt} review, the homepage plus the public-notices page and direct PDFs gave the clearest official answer-key picture.`,
  },
  {
    question: "Has any official NEET 2026 answer key challenge notice appeared yet?",
    answer:
      "The May 6, 2026 official notice says candidates can challenge the provisional answer keys after the scanned OMR answer sheet is uploaded, and that the uploading schedule plus challenge round will be notified separately. So students should still treat any circulated challenge dates cautiously until NTA publishes them.",
  },
  {
    question: "Has NTA announced the NEET 2026 result date or official cut off yet?",
    answer:
      `We did not see a separate NEET 2026 result-date notice, result notice, or official cut off posting on the official NEET homepage, documents page, or NTA Notice Board Archive during our ${reviewedAt} review. Right now, expected cut off remains planning guidance, not official NTA communication.`,
  },
  {
    question: "Does the May 10, 2026 press release change the expected cut off discussion?",
    answer:
      "No. The press release is important official context because it says reports around alleged irregularities are under investigation, but it does not announce an official cut off, result date, or answer-key challenge window. Students should keep expected cut off in estimate mode.",
  },
  {
    question: "Why should students avoid calling today’s cut off estimate official?",
    answer:
      "Because even after the official provisional answer key release, NTA has still not published any official cut off. Expected cut off content is still interpretation and planning guidance, not official NTA cut off communication.",
  },
  {
    question: "Which latest official notices are visible while students wait?",
    answer:
      `In our ${reviewedAt} review, the official NEET site was visibly carrying the May 10 press release, the May 6 provisional answer key notice, the May 3 exam-conduct notice, and notices on dress code, biometric exception, admit cards, and scribe support. Those notices are official and useful, but they do not make expected cut off discussion official.`,
  },
  {
    question: "Should students use a college predictor with expected cut off ranges?",
    answer:
      "Yes. A college predictor becomes more useful when students enter a realistic score range instead of one optimistic number. That helps families compare safer, possible, and ambitious options while official NEET updates are still pending.",
  },
  {
    question: "What is the latest visible status on the NEET documents page?",
    answer:
      `In our ${reviewedAt} review, we treated the NEET documents page as a secondary cross-check rather than the fastest post-exam update surface. It was still visibly showing older 2026 items such as the exam-conduct update, dress-code advisory, biometric-exception advisory, and admit-card notice, not the May 6 answer-key notice in the visible listing we checked.`,
  },
  {
    question: "Why does the NEET homepage matter more than the documents page right now?",
    answer:
      `Because in our ${reviewedAt} review the homepage was clearly surfacing the May 10, 2026 press release, the May 6, 2026 provisional answer key notice, and the official answer key PDF link. The documents page was still not the fastest surface in its visible listing, so students should check the homepage first and then cross-check the public-notices page plus the direct PDFs.`,
  },
  {
    question: "Does the NTA homepage currently show the NEET 2026 answer-key item clearly?",
    answer:
      `The firmer parent-site cross-check in our ${reviewedAt} review was the NTA Notice Board Archive, which was listing the NEET 2026 provisional answer key item. The dedicated NEET homepage was still more useful because it kept the exam-page notice, answer-key PDF, and press release together.`,
  },
  {
    question: "What is the latest visible status on the NEET public notices page?",
    answer:
      `In our ${reviewedAt} review, the public-notices category page was visibly listing the provisional answer key notice and the separate answer key PDF on page one. Its footer was also showing Last Updated: May 06, 2026.`,
  },
] as const;

const relatedGuides = [
  {
    title: "NEET 2026 latest update page",
    description:
      "Track dated official-status checks on answer key, result visibility, and immediate next steps after the exam.",
    href: "/guides/neet-2026-paper-analysis-expected-cutoff",
  },
  {
    title: "NEET 2026 marks vs rank guide",
    description:
      "Use marks vs rank in score ranges so your expected cut off reading turns into a realistic counselling plan.",
    href: "/guides/neet-2026-marks-vs-rank",
  },
] as const;

export default function Neet2026ExpectedCutOffPage() {
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "NEET 2026 Expected Cut Off", path },
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
                NEET 2026 Expected Cut Off
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                Students keep asking the same question after the exam: what
                will be the NEET 2026 expected cut off? The right answer is not
                one fixed number. It is a planning range that should be read
                with category, quota, domicile, and college reality in mind.
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
                  {keyPoints.map((item) => (
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
                  Official context students should keep in mind
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
                  {" "}
                  and
                  {" "}
                  <a
                    href="https://www.nta.ac.in/"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    NTA homepage
                  </a>
                  . The answer-key status note here is an inference from those
                  pages.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Why expected cut off should not be treated as final
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  NEET expected cut off becomes a popular topic immediately
                  after the exam because families want direction. That is
                  natural. But expected cut off is still an estimate. It does
                  not automatically translate into final college allotment.
                </p>
                <p className="text-base leading-8 text-muted-foreground">
                  Even when paper difficulty feels similar for most students,
                  actual outcomes can still shift due to category behaviour,
                  state quota strength, number of high scorers, seat changes,
                  and round-wise counselling movement.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  How students should use expected cut off properly
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  The best use of expected cut off is not prediction theatre. It
                  is planning discipline. Students should use it to create three
                  buckets:
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-heading">Safer range</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Colleges or routes that still look realistic if the final
                      outcome is slightly weaker than expected.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-heading">Possible range</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Colleges that may become realistic depending on final
                      result, category, and quota movement.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-heading">Ambitious range</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Colleges students may keep on the list, but should not rely
                      on without strong backup planning.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Why category and quota matter so much
                </h2>
                <p className="text-base leading-8 text-muted-foreground">
                  Two students with a similar broad score range may still have
                  very different counselling outcomes because category, domicile
                  state, quota, and college type can change the practical
                  college list significantly. That is why students should avoid
                  asking only one question: what will be the cut off?
                </p>
                <p className="text-base leading-8 text-muted-foreground">
                  The better question is: what may this likely score range mean
                  for my category, my quota path, and my realistic college
                  options?
                </p>
              </section>

              <section className="space-y-5">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                  Keep the cluster open while you plan
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
                      ctaVariant="neet_2026_expected_cutoff_inline"
                      title="Get your college prediction"
                      description="Enter your email, phone number, and state. Your predicted college list will be sent on email."
                      submitLabel="Get my prediction"
                      emailRequired
                      notes="NEET 2026 expected cut off guide CTA. Promise predictor results by email; no email automation wired yet."
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
