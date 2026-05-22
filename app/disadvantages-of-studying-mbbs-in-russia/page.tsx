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

const pagePath = "/disadvantages-of-studying-mbbs-in-russia";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Disadvantages of Studying MBBS in Russia for Indian Students 2026",
  description:
    "Get the honest disadvantages of studying MBBS in Russia for Indian students, including language, climate, total cost, India-return risks, and how to avoid a bad shortlist.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "disadvantages of studying mbbs in russia",
    "disadvantages of studying mbbs in russia for indian students",
    "mbbs in russia disadvantages",
    "risks of mbbs in russia",
    "is mbbs in russia worth it",
    "mbbs in russia for indian students",
  ],
});

const keyTakeaways = [
  "The biggest disadvantage of studying MBBS in Russia is not tuition. It is choosing a university without understanding the clinical-language reality, city environment, and long-term India-return pathway.",
  "Even when the classroom program is marketed as English-medium, students usually need functional Russian for patient interaction during clinical years. That gap becomes a real problem if students assume they can ignore the language entirely.",
  "Russia can still be a smart MBBS destination for Indian students, but it is not a low-effort option. Students who dislike cold weather, delayed adaptation, or self-discipline-heavy study environments may struggle more than they expect.",
  "Most Russia problems are shortlist problems, not country-only problems. A stronger university and city choice can reduce many disadvantages, while a weak choice can magnify all of them.",
];

const disadvantageCards = [
  {
    title: "Clinical language gap",
    summary:
      "This is the most common real-world problem Indian students underestimate.",
    details:
      "Many top results mention English-medium teaching, which is true for classroom delivery in many universities. But patients, ward staff, and day-to-day clinical communication often still happen in Russian. Students who treat language classes casually may enter clinical years with weaker confidence and lower practical participation.",
  },
  {
    title: "Harsh winters and adaptation stress",
    summary:
      "Russia is manageable, but not comfortable for everyone.",
    details:
      "Cold weather is not just an Instagram talking point. Long winters affect daily routines, energy levels, food habits, and emotional comfort, especially in the first year. Students who already know they dislike extreme weather should treat this as a real filter, not as a small adjustment.",
  },
  {
    title: "Wide quality spread between universities",
    summary:
      "Russia has many universities, which is both its strength and its risk.",
    details:
      "Families often assume that because Russia is popular, most universities are equally safe choices. That is not true. Hospital exposure, Indian-student support, administrative clarity, and overall campus reality vary more than many consultants admit.",
  },
  {
    title: "India-return pressure is still real",
    summary:
      "A Russian MBBS degree is not an automatic India-practice ticket.",
    details:
      "Students who want to return to India still need to think about the licensing pathway carefully. A lower-fee university is not a bargain if the student graduates with weak clinical grounding, poor exam preparation habits, or a degree structure they never properly understood.",
  },
  {
    title: "Travel, routing, and hidden friction",
    summary:
      "Russia is affordable, but not friction-free.",
    details:
      "Flights, visa work, document handling, local registration, and extra travel routing can increase both stress and cost over six years. Families comparing Russia only against tuition headlines often underestimate the real-life operating friction.",
  },
  {
    title: "Self-management matters more than many students expect",
    summary:
      "Russia suits students who can adapt, not students who need constant hand-holding.",
    details:
      "Students who need strong day-to-day family supervision, faster emotional reassurance, or a softer cultural transition can find Russia harder than brochure-style guides suggest. Discipline, attendance, and consistent academic rhythm matter a lot.",
  },
];

const whoShouldThinkTwice = [
  "Students who strongly dislike cold climates or already know they struggle in low-sun, winter-heavy environments.",
  "Students who are not willing to learn basic Russian for clinical communication.",
  "Families expecting an easy six-year ride just because the fees look manageable.",
  "Students who want the absolute shortest and lowest-friction route back to India without dealing with long-term planning.",
];

const mitigationSteps = [
  "Shortlist university plus city together, not university alone.",
  "Ask directly how patient interaction works in clinical years and what Russian-language support actually looks like.",
  "Check the total budget, not only first-year tuition.",
  "Prefer universities with a visible Indian student ecosystem, hostel clarity, and stronger communication discipline.",
  "Treat the India-return pathway and long-term licensing questions as part of admissions planning from day one.",
];

const faqItems = [
  {
    question: "What is the biggest disadvantage of studying MBBS in Russia?",
    answer:
      "For most Indian students, the biggest disadvantage is the clinical-language reality. Even if theory classes are in English, practical communication in hospitals often still requires Russian. Students who ignore that early can lose confidence in clinical years.",
  },
  {
    question: "Is the cold climate in Russia a serious problem for MBBS students?",
    answer:
      "It can be. Many students adapt well, but it is still a meaningful lifestyle factor. If a student already knows they struggle with harsh winters, that should influence the shortlist rather than be dismissed.",
  },
  {
    question: "Do these disadvantages mean MBBS in Russia is a bad idea?",
    answer:
      "No. Russia can still be a strong option, but only for the right student and the right university. The point of this page is not to scare families away; it is to stop weak shortlists from looking attractive just because the country is popular.",
  },
  {
    question: "How can Indian students reduce the risks of studying MBBS in Russia?",
    answer:
      "Choose the university more carefully, understand the city reality, plan the full budget honestly, and take Russian language adaptation seriously from the beginning. Many Russia problems become smaller when the shortlist is better.",
  },
  {
    question: "What should I read after this page?",
    answer:
      "The best next pages are MBBS in Russia fees, the Russia shortlist page, and the full Russia country page. Together, those give you a practical commercial decision view instead of a single trust page in isolation.",
  },
];

const nextReads = [
  {
    href: "/mbbs-in-russia-fees",
    label: "MBBS in Russia fees",
  },
  {
    href: "/best-mbbs-colleges-in-russia-for-indian-students",
    label: "Best MBBS colleges in Russia",
  },
  {
    href: "/mbbs-in-russia",
    label: "MBBS in Russia for Indian students",
  },
];

export default function RussiaDisadvantagesPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Disadvantages of Studying MBBS in Russia for Indian Students",
      description:
        "An honest 2026 guide to the disadvantages of studying MBBS in Russia for Indian students, including language, climate, shortlist quality, and India-return planning.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Disadvantages of Studying MBBS in Russia",
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
                Disadvantages of studying MBBS in Russia for Indian students
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                If you are seriously comparing Russia, this is the page you should read before a counsellor shows you a fee table. Russia can still be a strong MBBS option, but only when families understand the real friction points and choose a university that actually matches the student.
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
                  Get a realistic shortlist
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="commercial_decision_sidebar"
                title="Need help shortlisting Russia?"
                description="Share your details and our team will help you avoid weak Russia options based on budget, NEET profile, and city preference."
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
                The real disadvantages students should understand first
              </h2>
              <div className="mt-6 grid gap-5">
                {disadvantageCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-foreground/90">
                      {item.summary}
                    </p>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Students who should think twice before choosing Russia
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {whoShouldThinkTwice.map((item) => (
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
                How students reduce these disadvantages in practice
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <ol className="space-y-4">
                  {mitigationSteps.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                        {index + 1}
                      </div>
                      <p className="pt-0.5 text-base leading-7 text-muted-foreground">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
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
                Russia is not a bad MBBS destination. It is a destination where
                <strong className="text-foreground"> shortlist quality matters a lot more than the brochures admit</strong>.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
