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

const pagePath = "/is-mbbs-in-vietnam-valid-in-india";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is MBBS in Vietnam Valid in India? 2026 NMC Guide",
  description:
    "Get a practical answer to whether MBBS in Vietnam is valid in India, including NMC/FMGL rules, what 'valid' really means, and how Indian students should verify universities.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "is mbbs in vietnam valid in india",
    "mbbs in vietnam valid in india",
    "is mbbs in vietnam valid",
    "nmc approved universities in vietnam",
    "mbbs in vietnam for indian students",
    "vietnam mbbs validity in india",
  ],
});

const quickAnswer = [
  "Yes, MBBS in Vietnam can be valid in India for Indian students, but validity does not come from the country name alone. It depends on whether the student and the university path satisfy the relevant NMC foreign medical graduate requirements.",
  "A Vietnamese medical degree is not automatically valid just because a consultant says the university is 'recognized'. Families should evaluate the full degree structure, internship design, NEET status, and long-term India-return pathway together.",
  "The safest way to think about this query is simple: Vietnam can work, but only when the university-level pathway fits the NMC-linked rules that matter for Indian registration later.",
];

const whatValidityMeans = [
  {
    title: "Country alone does not decide validity",
    details:
      "Vietnam itself is not the guarantee. The question is whether the specific medical university and the student's foreign medical education path align with the regulatory conditions relevant to India-return registration.",
  },
  {
    title: "NEET still matters for Indian students",
    details:
      "For Indian students who want the option of practising in India later, NEET should be treated as part of the eligibility foundation rather than a separate unrelated exam.",
  },
  {
    title: "The degree path must make sense as a full medical pathway",
    details:
      "Families should verify duration, teaching structure, internship or clinical design, and whether the foreign degree supports the larger medical-registration journey instead of checking only fee and admission speed.",
  },
];

const whatStudentsShouldVerify = [
  "Whether the student has the right NEET position for the India-return pathway.",
  "Whether the university's medical degree structure is clear and documented.",
  "Whether clinical training and internship arrangement are explained in a way that fits the broader NMC-linked expectations for foreign medical graduates.",
  "Whether the university can be researched cleanly through official pages, not just consultancy claims.",
  "Whether the family understands that final India practice still depends on completing the required licensing route after graduation.",
];

const commonMistakes = [
  "Treating 'Vietnam is valid' as a country-level yes/no answer without checking the actual university.",
  "Assuming that a low fee or short flight automatically means a safer India-return pathway.",
  "Believing that WDOMS-style listing or consultant language alone is enough proof of India validity.",
  "Ignoring NEET or the longer licensing pathway because admission itself feels easy.",
];

const officialSources = [
  {
    label: "NMC FMGL 2021 FAQ PDF",
    href: "https://www.nmc.org.in/MCIRest/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2F20220222165635.pdf",
    note: "Useful explanatory FAQ for foreign medical graduates under the 2021 framework.",
  },
  {
    label: "Rules & Regulations, NMC",
    href: "https://www.nmc.org.in/rules-regulations-nmc/",
    note: "Primary official hub for checking the current foreign medical graduate regulations and related notices.",
  },
  {
    label: "NMC information desk page for students studying abroad",
    href: "https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/1000/",
    note: "Important official guidance for Indian students planning foreign medical education.",
  },
  {
    label: "Collegedunia: Is an MBBS Abroad Valid in India?",
    href: "https://collegedunia.com/study-abroad/article/is-an-mbbs-abroad-valid-in-india",
    note: "Current commercial SERP pattern showing how students are being taught to think about abroad validity in 2026.",
  },
];

const faqItems = [
  {
    question: "Is MBBS in Vietnam valid in India for Indian students?",
    answer:
      "It can be valid, but only when the student's degree path aligns with the relevant NMC foreign medical graduate expectations. Families should avoid treating Vietnam as automatically valid without checking the specific university and pathway.",
  },
  {
    question: "Does NMC approve all MBBS universities in Vietnam?",
    answer:
      "Students should be very careful with the phrase 'NMC approved'. The safer approach is to verify the university and the full degree structure against the official NMC-linked framework instead of relying on broad marketing labels.",
  },
  {
    question: "Is a WDOMS listing enough to say MBBS in Vietnam is valid in India?",
    answer:
      "No. A listing by itself is not the same thing as a complete India-return answer. Families should still verify the full degree pathway, NEET status, and licensing implications rather than reducing the decision to one directory check.",
  },
  {
    question: "What is the biggest mistake families make on Vietnam validity?",
    answer:
      "The biggest mistake is turning a university-level question into a country-only question. Vietnam can work very well, but only if the actual university choice and student pathway are right.",
  },
  {
    question: "What should I read after this page?",
    answer:
      "The best next reads are the Vietnam country page, Vietnam fees page, the Vietnam shortlist page, and the page on whether MBBS in Vietnam is good for Indian students. Together they help you move from validity anxiety to real decision-making.",
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
    href: "/is-mbbs-in-vietnam-good-for-indian-students",
    label: "Is MBBS in Vietnam good for Indian students?",
  },
];

export default function VietnamValidityPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Is MBBS in Vietnam Valid in India?",
      description:
        "A practical 2026 answer to whether MBBS in Vietnam is valid in India, including NMC-linked checks and how students should verify universities.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Is MBBS in Vietnam Valid in India?",
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
                Is MBBS in Vietnam valid in India?
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                The short answer is yes, it can be. But this is one of those MBBS-abroad queries where a simple yes is not enough. For Indian students, Vietnam validity is really a question about the full degree pathway, not just the country label or the sales language around one university.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/medical-colleges-in-vietnam"
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Shortlist Vietnam colleges
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Get Vietnam guidance
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="commercial_decision_sidebar"
                title="Need clarity on Vietnam validity?"
                description="Share your details and our team will help you check whether Vietnam fits your India-return plan, budget, and shortlist."
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

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                What validity actually means for Indian students
              </h2>
              <div className="mt-6 grid gap-5">
                {whatValidityMeans.map((item) => (
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
                What students should verify before paying any amount
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
                Common mistakes families make on Vietnam validity
              </h2>
              <div className="mt-6 grid gap-4">
                {commonMistakes.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-base leading-7 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Source-backed checks
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
                Vietnam validity should be treated as a
                <strong className="text-foreground"> university-pathway question</strong>, not a country slogan.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
