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

const pagePath = "/is-mbbs-in-vietnam-good-for-indian-students";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is MBBS in Vietnam Good for Indian Students in 2026?",
  description:
    "Get a practical answer to whether MBBS in Vietnam is good for Indian students, including cost, climate, university fit, and India-return decision factors.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "is mbbs in vietnam good for indian students",
    "is mbbs in vietnam worth it",
    "mbbs in vietnam good option for indian students",
    "mbbs in vietnam for indian students",
    "medical colleges in vietnam",
    "mbbs in vietnam fees",
  ],
});

const quickAnswer = [
  "Yes, MBBS in Vietnam can be a good option for Indian students who want a lower-cost, warmer, closer-to-home alternative to many traditional MBBS abroad destinations.",
  "No, it is not automatically good for everyone. Vietnam works best when the university choice is strong and the family understands that a friendly country image is not the same as a perfect university fit.",
  "The real question is not whether Vietnam is good in theory. It is whether the specific university, city, and long-term India-return plan make Vietnam the right match for the student.",
];

const goodWhen = [
  "You want a more affordable route than Indian private MBBS colleges and are comparing total six-year cost honestly.",
  "You prefer a country that is geographically closer to India and easier for parents to understand from a travel and lifestyle point of view.",
  "You want a warmer climate and lower everyday adaptation burden than colder destinations like Russia.",
  "You are ready to shortlist universities carefully instead of assuming the whole country is equally strong.",
];

const notGoodWhen = [
  "You want the most established India-facing MBBS destination with the longest public track record.",
  "You are choosing only on low fees and ignoring university-specific differences.",
  "You assume English-medium marketing means zero local-language adaptation in clinical years.",
  "You want a decision that can be made only at country level, without comparing universities properly.",
];

const decisionFramework = [
  {
    title: "Cost value",
    details:
      "Vietnam is attractive because it can stay meaningfully cheaper than many private MBBS routes in India and also remain competitive against several abroad options once travel and living costs are included.",
  },
  {
    title: "Lifestyle and travel fit",
    details:
      "Vietnam often feels easier for Indian families because flights are shorter, weather is friendlier, and the everyday transition can be smoother than in colder countries.",
  },
  {
    title: "University-level variation",
    details:
      "This is where students need discipline. Public and private universities do not feel identical, and a weaker shortlist can make Vietnam look less impressive than it should.",
  },
  {
    title: "India-return realism",
    details:
      "Vietnam is good when the student is thinking beyond admission. The right university, the right structure, and the student's seriousness about the licensing path matter much more than destination hype.",
  },
];

const faqItems = [
  {
    question: "Is MBBS in Vietnam good for Indian students in 2026?",
    answer:
      "Yes, it can be good for Indian students who want a lower-cost, warmer, and easier-to-reach option, provided they shortlist universities carefully and keep the India-return pathway in focus.",
  },
  {
    question: "Is MBBS in Vietnam better than Russia?",
    answer:
      "Not automatically. Vietnam can feel better for students who want easier climate and proximity to India, while Russia can feel stronger for students who prefer a larger and more established public-university ecosystem. The student profile should decide the answer.",
  },
  {
    question: "Is MBBS in Vietnam better than a private MBBS college in India?",
    answer:
      "For some families, yes, mainly on cost and international exposure. For others, the familiar Indian system still matters more. The right comparison is practical, not emotional: fees, student fit, university quality, and long-term licensing planning.",
  },
  {
    question: "What makes MBBS in Vietnam not a good fit for some students?",
    answer:
      "Weak university selection, over-reliance on low cost, and assuming the destination is automatically easy can all turn Vietnam into the wrong choice for a student who needed a more careful shortlist.",
  },
  {
    question: "What should I read after this page?",
    answer:
      "Read the Vietnam country page, Vietnam fees page, the Vietnam shortlist page, and the disadvantages page together. That gives you a much more complete decision view than a yes-or-no page by itself.",
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
    href: "/disadvantages-of-studying-mbbs-in-vietnam",
    label: "Disadvantages of studying MBBS in Vietnam",
  },
];

export default function IsVietnamGoodPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Is MBBS in Vietnam Good for Indian Students?",
      description:
        "A practical 2026 answer to whether MBBS in Vietnam is good for Indian students, including cost, adaptation, and shortlist quality.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Is MBBS in Vietnam Good for Indian Students?",
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
                Is MBBS in Vietnam good for Indian students?
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                This is one of the most practical questions in the Vietnam cluster. The honest answer is that Vietnam can be very good for the right student, especially when cost, climate, and proximity to India matter. But it becomes a weaker decision when families stop at the country story and never pressure-test the university shortlist.
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
                  Get a Vietnam counselling call
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="commercial_decision_sidebar"
                title="Need a Vietnam yes-or-no answer?"
                description="Share your details and our team will help you decide whether Vietnam fits your budget, NEET profile, and student preferences."
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

            <section className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Vietnam is good when
                </h2>
                <ul className="mt-6 space-y-3">
                  {goodWhen.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Vietnam is not good when
                </h2>
                <ul className="mt-6 space-y-3">
                  {notGoodWhen.map((item) => (
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
                The practical decision framework
              </h2>
              <div className="mt-6 grid gap-5">
                {decisionFramework.map((item) => (
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
                Vietnam is good when the family likes the combination of
                <strong className="text-foreground"> affordability, climate, and proximity</strong> and still respects the need for a strong university shortlist.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
