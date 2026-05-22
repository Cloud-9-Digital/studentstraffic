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

const pagePath = "/is-neet-required-for-mbbs-in-russia";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is NEET Required for MBBS in Russia? 2026 Guide for Indian Students",
  description:
    "Get the exact answer on whether NEET is required for MBBS in Russia, including NMC rules, the 'without NEET' myth, qualifying score reality, and India-return implications.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "is neet required for mbbs in russia",
    "neet required for mbbs in russia",
    "mbbs in russia without neet",
    "how much neet score is required for mbbs in russia",
    "mbbs in russia for indian students",
    "nmc rules mbbs abroad neet",
  ],
});

const keyTakeaways = [
  "Yes, NEET is required for MBBS in Russia if you are an Indian citizen or OCI who wants to keep the option of medical registration in India after graduation.",
  "Russian universities themselves may not use NEET as a competitive admission ranking tool the way Indian colleges do. But the NMC eligibility rule still matters for your long-term India-return pathway.",
  "A qualifying NEET result is the key point for most Russia applicants. In practical terms, families should treat NEET as an eligibility gate, not as the main merit filter used by Russian universities.",
  "Some agencies still market MBBS in Russia without NEET. That can be dangerously misleading for Indian students who may later want to practise medicine in India.",
];

const directAnswerBlocks = [
  {
    title: "If you want to practise in India later",
    details:
      "NEET qualification is effectively non-negotiable. NMC's published material and the earlier screening-test framework make it clear that Indian citizens and OCIs taking admission in foreign medical institutions need NEET for the India-return pathway.",
  },
  {
    title: "If a university says it can admit you without NEET",
    details:
      "That does not automatically mean the degree will support medical registration in India later. This is where many families get trapped: university admission and India-return eligibility are not the same question.",
  },
  {
    title: "If you are asking about score, not just qualification",
    details:
      "Most Russian universities do not require a high competitive NEET rank in the Indian sense. For many Indian students, the practical issue is qualifying NEET and meeting the university's academic requirements in Class 12 rather than chasing an aggressive score cutoff.",
  },
];

const mythVsReality = [
  {
    myth: "Russia does not require NEET, so Indian students do not need to care about it.",
    reality:
      "Reality: Russian universities may admit students without using NEET as a selection exam, but Indian students who want the India-return pathway still need to treat NEET as essential.",
  },
  {
    myth: "Any low NEET score is useless for Russia.",
    reality:
      "Reality: For many Russia applicants, a qualifying NEET result is enough to keep the pathway open. The university choice, Class 12 profile, budget, and shortlist quality often matter more than chasing a high Indian-style cutoff for Russia admission.",
  },
  {
    myth: "If I skip NEET now, I can fix it after graduation.",
    reality:
      "Reality: That is the risky assumption families should avoid. NEET should be treated as an entry-stage compliance requirement, not something to clean up years later.",
  },
];

const whatStudentsShouldVerify = [
  "Whether the student wants the option of returning to India for licensing and practice.",
  "Whether the NEET result is already valid for the intended admission cycle.",
  "Whether the university's MBBS structure, duration, internship design, and medium still fit the broader NMC-aligned pathway.",
  "Whether the counsellor is mixing up 'university can admit you' with 'India registration path remains safe'.",
];

const officialSources = [
  {
    label: "NMC Screening Test Regulations, 2002 page",
    href: "https://www.nmc.org.in/rules-regulations/screening-test-regulations-2002/",
    note: "NMC page summarizing the public notice on the NEET requirement for Indian citizens and OCIs taking admission in foreign medical institutions from the academic year 2019-2020 onward.",
  },
  {
    label: "NMC FMGL 2021 FAQ PDF",
    href: "https://www.nmc.org.in/MCIRest/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2F20220222165635.pdf",
    note: "Useful explanatory FAQ for foreign medical graduates under the 2021 framework.",
  },
  {
    label: "NMC information desk page for students studying abroad",
    href: "https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/1000/",
    note: "Includes the point that NEET result is valid for three years for MBBS or equivalent abroad, including pre-medical or language course where applicable.",
  },
  {
    label: "Rules & Regulations, NMC",
    href: "https://www.nmc.org.in/rules-regulations-nmc/",
    note: "Primary official hub for checking the current foreign medical graduate regulations and related notices.",
  },
];

const faqItems = [
  {
    question: "Is NEET required for MBBS in Russia for Indian students?",
    answer:
      "Yes, if the student wants to preserve the option of registration and practice in India later. That is the safest way to read the NMC position. Families should not confuse Russian university admission rules with India's long-term eligibility rules.",
  },
  {
    question: "Can I study MBBS in Russia without NEET?",
    answer:
      "A university may admit you, but that does not make it a safe decision for the India-return pathway. For Indian students who may later want to practise in India, treating Russia as a 'without NEET' route is risky.",
  },
  {
    question: "How much NEET score is required for MBBS in Russia?",
    answer:
      "For many Russia applicants, the practical requirement is a qualifying NEET result rather than a high competitive score. Russian universities usually evaluate broader academic fit and documents instead of using NEET like Indian counselling does.",
  },
  {
    question: "Is NEET enough on its own for MBBS in Russia admission?",
    answer:
      "No. Students still need to satisfy the university's academic documentation, Class 12 science background, passport, and other admission formalities. NEET protects the regulatory side; it does not replace the rest of the admission process.",
  },
  {
    question: "What is the best next step after understanding the NEET rule?",
    answer:
      "Read the Russia country page, Russia fees page, and shortlist page together. Once you know the NEET rule, the real decision becomes choosing the right university and budget path, not just asking whether Russia is possible.",
  },
];

const nextReads = [
  {
    href: "/mbbs-in-russia",
    label: "MBBS in Russia for Indian students",
  },
  {
    href: "/mbbs-in-russia-fees",
    label: "MBBS in Russia fees",
  },
  {
    href: "/best-mbbs-colleges-in-russia-for-indian-students",
    label: "Best MBBS colleges in Russia",
  },
];

export default function RussiaNeetRequirementPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Is NEET Required for MBBS in Russia?",
      description:
        "A 2026 guide to whether NEET is required for MBBS in Russia, including NMC rules, the without-NEET myth, and score expectations.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Is NEET Required for MBBS in Russia?",
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
                Is NEET required for MBBS in Russia?
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                The short answer is simple: <strong className="text-foreground">yes, for Indian students who want the India-return pathway</strong>. The confusing part is that many Russia pages mix up university admission rules with NMC-linked long-term eligibility, which is exactly where families make avoidable mistakes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/mbbs-in-russia"
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Read MBBS in Russia
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
                title="Need clarity on Russia eligibility?"
                description="Share your details and our team will help you understand the NEET rule, shortlist fit, and next admission steps for Russia."
                courseSlug="mbbs"
                countrySlug="russia"
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
                MBBS in Russia without NEET: myth vs reality
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
                What students should verify before paying any Russia admission amount
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
                Official source-backed checks
              </h2>
              <div className="mt-6 grid gap-4">
                {officialSources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-accent/30 hover:bg-accent/5"
                  >
                    <div className="text-lg font-semibold text-foreground">
                      {source.label}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {source.note}
                    </p>
                  </a>
                ))}
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
                For Indian students, the safer way to think is simple:
                <strong className="text-foreground"> if India-return matters, treat NEET as essential before you commit to Russia.</strong>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
