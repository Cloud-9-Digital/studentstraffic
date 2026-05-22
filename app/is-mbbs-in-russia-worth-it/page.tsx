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

const pagePath = "/is-mbbs-in-russia-worth-it";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is MBBS in Russia Worth It for Indian Students in 2026?",
  description:
    "Get a practical answer to whether MBBS in Russia is worth it for Indian students, including cost, climate, university fit, and the India-return decision.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "is mbbs in russia worth it",
    "is mbbs in russia worth it for indian students",
    "is mbbs in russia good for indian students",
    "mbbs in russia worth it",
    "mbbs in russia for indian students",
    "mbbs in russia fees",
  ],
});

const quickAnswer = [
  "Yes, MBBS in Russia can be worth it for Indian students who need a more affordable alternative to Indian private medical colleges and are comfortable with a tougher adaptation environment.",
  "No, it is not automatically worth it for everyone. Students who want an easier climate, lower travel friction, or weaker dependence on local-language adaptation may find other countries fit them better.",
  "The question is not whether Russia is worth it in theory. It is whether the specific university, city, and budget plan make sense for the student sitting in front of you.",
];

const worthItWhen = [
  "You are cost-sensitive and comparing Russia against very expensive private MBBS options in India.",
  "You are willing to learn functional Russian for clinical interaction instead of expecting a fully English bubble for six years.",
  "You value established public-university ecosystems and can handle a more demanding adjustment curve.",
  "You are planning your India-return pathway seriously from the start rather than assuming the degree will take care of itself.",
];

const notWorthItWhen = [
  "You want the warmest, shortest, and lowest-friction student experience possible.",
  "You are unlikely to adapt well to cold climate and long winters.",
  "You are choosing Russia only because a consultant showed a low first-year quote.",
  "You are not prepared for the language and discipline required in the clinical years.",
];

const decisionFramework = [
  {
    title: "Cost value",
    details:
      "Russia remains attractive because it can be significantly cheaper than many Indian private medical colleges. But the decision should be based on the full six-year budget, not just tuition.",
  },
  {
    title: "University depth",
    details:
      "Russia offers a larger range of established public medical universities than many newer MBBS destinations. That depth can be a real advantage if the shortlist is good.",
  },
  {
    title: "Adaptation burden",
    details:
      "The trade-off is that Russia usually asks more from the student in climate adjustment, everyday life, and language adaptation than a country like Vietnam.",
  },
  {
    title: "India-return realism",
    details:
      "For students who want to practise in India later, the university choice, study habits, and long-term licensing planning still matter. Russia is worth it when the student is thinking beyond admission day.",
  },
];

const faqItems = [
  {
    question: "Is MBBS in Russia worth it for Indian students in 2026?",
    answer:
      "It can be worth it for students who want a lower-cost alternative to Indian private colleges and are comfortable with the Russian learning environment, climate, and language adaptation. It is not a one-size-fits-all answer.",
  },
  {
    question: "Is MBBS in Russia better than a private MBBS college in India?",
    answer:
      "For some families, the cost advantage makes Russia more practical than private India. For others, the easier domestic route and familiar system still matter more. The right comparison is not emotional; it is financial, academic, and long-term.",
  },
  {
    question: "Is MBBS in Russia better than Vietnam?",
    answer:
      "Not automatically. Russia can win on depth of public-university options and long-standing student familiarity, while Vietnam can win on climate, proximity, and easier everyday adjustment. The student profile should decide the answer.",
  },
  {
    question: "What makes MBBS in Russia not worth it for some students?",
    answer:
      "Poor university choice, weak climate fit, ignoring the language issue, and choosing only on the basis of low tuition can all make Russia feel like the wrong decision later.",
  },
  {
    question: "What should I read after this page?",
    answer:
      "Read the Russia country page, Russia fees page, and the shortlist page for the best MBBS colleges in Russia. Those three pages will give you a better commercial decision view than a yes-or-no article alone.",
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

export default function IsRussiaWorthItPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Is MBBS in Russia Worth It for Indian Students?",
      description:
        "A practical 2026 answer to whether MBBS in Russia is worth it for Indian students, including cost, adaptation, and shortlist quality.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Is MBBS in Russia Worth It?",
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
                Is MBBS in Russia worth it for Indian students?
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                This is one of the most honest questions in the whole Russia cluster. The right answer is not a blanket yes or no. Russia is worth it for the right student with the right shortlist, and not worth it for students who are forcing a fit just because the fees look attractive.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/best-mbbs-colleges-in-russia-for-indian-students"
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Shortlist Russia colleges
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Get a Russia counselling call
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="commercial_decision_sidebar"
                title="Need a Russia yes-or-no answer?"
                description="Share your details and our team will tell you whether Russia fits your budget, NEET profile, and student preferences."
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
                  Russia is worth it when
                </h2>
                <ul className="mt-6 space-y-3">
                  {worthItWhen.map((item) => (
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
                  Russia is not worth it when
                </h2>
                <ul className="mt-6 space-y-3">
                  {notWorthItWhen.map((item) => (
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
                Russia is worth it when the student can handle the environment and the family chooses carefully.
                <strong className="text-foreground"> It is not worth it when low tuition is doing all the decision-making.</strong>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
