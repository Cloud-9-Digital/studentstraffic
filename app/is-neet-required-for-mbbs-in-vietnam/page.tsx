import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const pagePath = "/is-neet-required-for-mbbs-in-vietnam";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is NEET Required for MBBS in Vietnam? 2026 Guide for Indian Students",
  description:
    "Get the exact answer on whether NEET is required for MBBS in Vietnam, including the India-return pathway, the 'without NEET' myth, and score reality for Indian students.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "is neet required for mbbs in vietnam",
    "neet required for mbbs in vietnam",
    "mbbs in vietnam without neet",
    "how much neet score is required for mbbs in vietnam",
    "mbbs in vietnam for indian students",
    "nmc rules mbbs abroad neet",
  ],
});

const keyTakeaways = [
  "Yes, NEET is required for MBBS in Vietnam if you are an Indian student who wants to preserve the option of practising medicine in India later.",
  "Vietnam universities may not always use NEET as a competitive admission filter in the same way Indian counselling does, but the India-return pathway is the real reason NEET still matters.",
  "For many Indian students, the practical NEET question is not 'Can I get a top score for Vietnam?' but 'Have I qualified and protected my longer-term registration pathway?'",
  "Some agencies still market MBBS in Vietnam without NEET. That can be misleading if the student later wants to register or practise in India.",
];

const directAnswerBlocks = [
  {
    title: "If you want to practise in India later",
    details:
      "Treat NEET as essential. For Indian students comparing Vietnam seriously, the safer interpretation is that NEET protects the India-return pathway even if the university itself looks more flexible on admission mechanics.",
  },
  {
    title: "If a university or agency says Vietnam is possible without NEET",
    details:
      "That may refer only to the admission side, not the India-return side. This is the exact distinction families should understand before they make a payment or commit to a university.",
  },
  {
    title: "If you are asking about score rather than qualification",
    details:
      "For most Vietnam-bound Indian students, the practical issue is qualifying NEET rather than chasing a very high score cutoff. Vietnam decisions are usually driven more by eligibility, university fit, and budget than by aggressive NEET competition.",
  },
];

const mythVsReality = [
  {
    myth: "Vietnam universities do not hold NEET-based counselling, so NEET is irrelevant.",
    reality:
      "Reality: For Indian students who want the option of coming back to India and practising medicine, NEET still matters even if the university does not run Indian-style counselling.",
  },
  {
    myth: "If I can get admission in Vietnam without NEET, I can sort out the India issue later.",
    reality:
      "Reality: That is the risky shortcut families should avoid. NEET should be treated as a front-end compliance question, not a future clean-up task.",
  },
  {
    myth: "Any NEET score that is not enough for India is useless for Vietnam.",
    reality:
      "Reality: For many students, a qualifying NEET result is enough to keep Vietnam open as a realistic option. The shortlist and student fit often matter more than pushing for a high India-style score race.",
  },
];

const whatStudentsShouldVerify = [
  "Whether the student has a valid NEET result for the intended pathway.",
  "Whether the student and family are choosing Vietnam with the India-return plan in mind.",
  "Whether the university's medical degree structure and clinical path are being explained clearly.",
  "Whether the advisor is separating university admission convenience from long-term licensing reality.",
];

const faqItems = [
  {
    question: "Is NEET required for MBBS in Vietnam for Indian students?",
    answer:
      "Yes, if the student wants to preserve the India-return pathway. That is the safest way to understand the rule. Families should not confuse easier university admission with long-term India registration safety.",
  },
  {
    question: "Can I study MBBS in Vietnam without NEET?",
    answer:
      "A university may accept you, but that does not automatically make the decision safe for future practice in India. For Indian students who may want to come back, 'without NEET' should be treated very carefully.",
  },
  {
    question: "How much NEET score is required for MBBS in Vietnam?",
    answer:
      "For many students, the practical target is NEET qualification rather than a very high competitive score. Vietnam admissions are usually more about meeting eligibility and choosing the right university than about beating a steep India-style cutoff.",
  },
  {
    question: "Is NEET enough on its own for MBBS in Vietnam admission?",
    answer:
      "No. Students still need the right Class 12 science background, passport, university documents, and overall admission preparation. NEET helps protect the regulatory side, but it does not replace the full admission process.",
  },
  {
    question: "What should I read after this page?",
    answer:
      "Read the Vietnam country page, Vietnam fees page, Vietnam shortlist page, and the validity page together. That gives you a much better Vietnam decision view than a single NEET page on its own.",
  },
];

const nextReads = [
  {
    href: "/mbbs-in-vietnam",
    label: "MBBS in Vietnam for Indian students",
  },
  {
    href: "/mbbs-in-vietnam-fees",
    label: "MBBS in Vietnam fees",
  },
  {
    href: "/medical-colleges-in-vietnam",
    label: "Medical colleges in Vietnam",
  },
  {
    href: "/is-mbbs-in-vietnam-valid-in-india",
    label: "Is MBBS in Vietnam valid in India?",
  },
];

export default function VietnamNeetRequirementPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Is NEET Required for MBBS in Vietnam?",
      description:
        "A 2026 guide to whether NEET is required for MBBS in Vietnam, including the India-return pathway, the without-NEET myth, and score expectations.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Is NEET Required for MBBS in Vietnam?",
        path: pagePath,
      },
    ]),
    getFaqStructuredData(faqItems, pagePath),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            Updated on 23 May 2026
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Is NEET required for MBBS in Vietnam?
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                The short answer is yes for Indian students who want to keep the option of practising in India later. The confusing part is that some Vietnam pages talk only about university admission convenience, while families really need clarity on the longer-term India-return pathway.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/mbbs-in-vietnam"
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Read MBBS in Vietnam
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Get admission guidance
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="commercial_decision_sidebar"
                title="Need clarity on Vietnam eligibility?"
                description="Share your details and our team will help you understand the NEET rule, shortlist fit, and next admission steps for Vietnam."
                courseSlug="mbbs"
                countrySlug="vietnam"
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

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                The direct answer families actually need
              </h2>
              <div className="mt-6 grid gap-5">
                {directAnswerBlocks.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                MBBS in Vietnam without NEET: myth vs reality
              </h2>
              <div className="mt-6 grid gap-5">
                {mythVsReality.map((item) => (
                  <div
                    key={item.myth}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <p className="text-base font-semibold text-foreground">
                      Myth: {item.myth}
                    </p>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {item.reality}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                What students should verify before paying any Vietnam admission amount
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {whatStudentsShouldVerify.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                FAQs
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
                    <p className="mt-3 text-base leading-8 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Best next reads
              </h2>
              <div className="mt-5 space-y-3">
                {nextReads.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                The practical takeaway
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                For Indian students, the safer rule is simple:
                <strong className="text-foreground"> if India-return matters, treat NEET as essential before you commit to Vietnam.</strong>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
