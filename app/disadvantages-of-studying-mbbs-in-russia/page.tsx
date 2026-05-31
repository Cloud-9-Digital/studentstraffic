"use client";

import React from "react";
import Link from "next/link";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const pagePath = "/disadvantages-of-studying-mbbs-in-russia";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "The biggest disadvantage isn't the tuition—it's choosing a university without understanding the clinical-language reality, city environment, and India-return pathway complexity.",
  "English-medium classrooms are common, but 70-80% of clinical communication happens in Russian. Students who treat language classes casually face confidence issues during Years 4-6.",
  "Russia works well for disciplined, adaptable students. Those needing constant support or disliking harsh winters (-20°C to -30°C for 4-5 months) may struggle significantly.",
  "Most disadvantages are shortlist problems, not country problems. Better university selection reduces language gaps, hostel issues, and India-return complications.",
];

const disadvantages = [
  {
    title: "Clinical language barrier",
    severity: "High",
    impact: "Years 3-6",
    details:
      "While lectures are in English at most universities, patient interactions, ward rounds, and clinical discussions primarily occur in Russian. Students need functional conversational Russian (A2-B1 level) by Year 3 for effective clinical training. Those who skip language classes often face reduced participation and weaker practical skills.",
  },
  {
    title: "Extreme winter climate",
    severity: "Medium",
    impact: "October-March",
    details:
      "Temperatures of -20°C to -35°C for 4-5 months affect daily life significantly. Shorter daylight (6-7 hours in winter), higher heating costs, limited outdoor activities, and seasonal affective disorder are common. Students from tropical climates experience 6-8 month adaptation periods.",
  },
  {
    title: "Variable university quality",
    severity: "High",
    impact: "All years",
    details:
      "Russia has 50+ medical universities accepting international students, but quality varies dramatically. Tier-3 universities may have outdated facilities, limited English support, poor hospital partnerships, and weak administrative systems. Research beyond consultant recommendations is essential.",
  },
  {
    title: "India licensing pathway complexity",
    severity: "High",
    impact: "Post-graduation",
    details:
      "Graduates must clear FMGE/NExT to practice in India. As of 2026, the pass rate for Russia graduates is 15-22% (first attempt). Weak clinical exposure during MBBS, lack of India-specific exam prep, and curriculum differences create significant barriers.",
  },
  {
    title: "Travel and logistics friction",
    severity: "Medium",
    impact: "Throughout",
    details:
      "Indirect flights (via Dubai/Istanbul) add 8-12 hours travel time and ₹40,000-60,000 per round trip. Visa renewals require extensive documentation. Banking, SIM cards, and local registration involve bureaucratic processes that frustrate students expecting simpler systems.",
  },
  {
    title: "Limited family support",
    severity: "Medium",
    impact: "All years",
    details:
      "Time zone differences (2.5-5.5 hours), expensive international calls, and inability of parents to visit frequently (visa complexity + cost) mean students handle challenges independently. Those accustomed to strong daily family involvement struggle with isolation.",
  },
];

const whoShouldReconsider = [
  "Students who strongly dislike cold weather or have struggled with seasonal depression",
  "Those unwilling to invest 200-300 hours learning conversational Russian",
  "Students requiring constant emotional support or direct family involvement",
  "Families expecting a straightforward India-return pathway without additional exam preparation",
  "Students targeting US/UK residency (Russia MBBS recognition is limited)",
];

const mitigationStrategies = [
  {
    problem: "Language barrier",
    solution:
      "Choose universities with mandatory Russian language courses (4-6 hours/week). Practice with Russian-speaking seniors and hospital staff from Year 1. Budget ₹15,000-25,000 for additional language tutoring.",
  },
  {
    problem: "Climate adaptation",
    solution:
      "Select cities like Kazan, Volgograd, or Rostov-on-Don (slightly warmer than Moscow/St. Petersburg). Budget ₹25,000-40,000 for proper winter clothing. Vitamin D supplements and UV lamps help manage low sunlight exposure.",
  },
  {
    problem: "University quality",
    solution:
      "Verify NMC guideline compliance and WDOMS listing, review actual student testimonials (not consultant-provided), visit university websites directly, and prioritize institutions with 70+ years of medical education history.",
  },
  {
    problem: "India licensing",
    solution:
      "Enroll in FMGE/NExT coaching from Year 3 onward. Choose universities offering India-specific exam prep support. Students Traffic provides free FMGE/NExT coaching for students who join through us — the typical ₹1.5-2.5 lakh coaching cost is covered.",
  },
  {
    problem: "Travel costs",
    solution:
      "Plan visits during university breaks (December, June) when flights are 20-30% cheaper. Use student fare discounts. Budget ₹2.5-3.5 lakhs for 6-year travel expenses instead of assuming single-trip costs.",
  },
];

const faqItems = [
  {
    question:
      "What is the biggest disadvantage of studying MBBS in Russia for Indian students?",
    answer:
      "The clinical language barrier is the most significant challenge. While theory classes are in English, 70-80% of patient interactions and clinical discussions happen in Russian. Students who don't achieve conversational fluency (A2-B1 level) by Year 3 struggle with practical training, hospital rotations, and confidence during clinical years.",
  },
  {
    question: "Is the cold climate in Russia manageable for Indian students?",
    answer:
      "It's manageable but requires genuine preparation. Winters last 4-5 months with temperatures between -20°C to -35°C in most university cities. Students need proper winter clothing (₹25,000-40,000 investment), vitamin D supplements, and 6-8 months for full adaptation. Those with seasonal affective disorder or strong preference for tropical climates should carefully consider this factor.",
  },
  {
    question:
      "Do these disadvantages mean Russia is a bad choice for MBBS?",
    answer:
      "No. Russia remains a viable option for disciplined, adaptable students who research thoroughly. The disadvantages are real but manageable with proper university selection, language commitment, and realistic expectations. The key is matching student personality and capabilities with Russia's demands rather than choosing based solely on affordability.",
  },
  {
    question:
      "How can Indian students reduce risks when studying MBBS in Russia?",
    answer:
      "Focus on university selection (meeting NMC guidelines, 70+ years history, strong hospital partnerships), commit to Russian language learning from Day 1, budget realistically for all 6 years including hidden costs, choose slightly warmer cities if climate-sensitive, and enroll in FMGE/NExT prep from Year 3 onward.",
  },
  {
    question:
      "What is the FMGE/NExT pass rate for Russia graduates?",
    answer:
      "As of 2026, first-attempt pass rates for Russia MBBS graduates range from 15-22%, significantly lower than Indian medical colleges (65-75%). This is primarily due to curriculum differences, limited India-specific clinical exposure, and inadequate exam preparation during the MBBS program. Students Traffic provides free FMGE/NExT coaching for students who join through us — structured preparation from Year 3 onward is included.",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Updated on 23 May 2026
          </div>

          <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
            Honest comparison
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Disadvantages of studying MBBS in Russia for Indian students
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            If you're seriously comparing Russia, read this before a counsellor
            shows you a fee table. Russia can be a strong MBBS option, but only
            when families understand the real friction points and choose wisely.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <CounsellingDialog
              triggerContent={
                <>
                  Get a realistic shortlist
                  <svg
                    className="h-5 w-5 transition group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              }
              triggerClassName="group inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-base font-semibold text-background transition hover:opacity-90"
              plainTrigger
              title="Get a realistic Russia shortlist"
              description="Share your NEET score, budget, and preferences. We'll help you avoid common disadvantages and shortlist suitable universities."
              submitLabel="Request callback"
              ctaVariant="disadvantages-hero"
              countrySlug="russia"
              courseSlug="mbbs"
            />
            <Link
              href="/mbbs-in-russia"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-border px-6 py-3.5 text-base font-semibold text-foreground transition hover:bg-muted"
            >
              Read MBBS in Russia overview
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <article>
            {/* Quick Answer */}
            <div className="border-l-4 border-accent pl-6">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Quick answer
              </h2>
              <div className="mt-8 space-y-6">
                {keyTakeaways.map((item, idx) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="flex-1 pt-0.5 text-lg leading-relaxed text-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Disadvantages */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Key challenges
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Real disadvantages students should understand first
              </h2>

              <div className="mt-10 space-y-8">
                {disadvantages.map((item, idx) => (
                  <div
                    key={item.title}
                    className="group relative border-b border-border/30 pb-8 last:border-0"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-lg font-bold text-accent transition group-hover:bg-accent group-hover:text-white">
                          {idx + 1}
                        </span>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 font-medium ${
                            item.severity === "High"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                    </div>

                    <div className="ml-13 space-y-2">
                      <div className="text-sm font-medium text-accent">
                        Impact: {item.impact}
                      </div>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {item.details}
                      </p>
                    </div>

                    <div className="ml-13 mt-4 h-1 w-12 rounded-full bg-accent/20 transition-all group-hover:w-20 group-hover:bg-accent" />
                  </div>
                ))}
              </div>
            </section>

            {/* Who Should Reconsider */}
            <section className="mt-20">
              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Who should think twice about Russia
              </h2>

              <div className="mt-8 space-y-4">
                {whoShouldReconsider.map((item, idx) => (
                  <div
                    key={item}
                    className="flex gap-4 border-b border-border/30 pb-4 last:border-0"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {idx + 1}
                    </div>
                    <p className="flex-1 text-base leading-relaxed text-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Mitigation Strategies */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Solutions
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                How to reduce these disadvantages
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {mitigationStrategies.map((item) => (
                  <div
                    key={item.problem}
                    className="group rounded-2xl border border-border/60 bg-gradient-to-br from-card to-background p-6 transition hover:border-accent/30 hover:shadow-lg"
                  >
                    <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                      {item.problem}
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQs
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Frequently asked questions
              </h2>

              <div className="mt-10 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-border bg-card transition hover:border-accent/30"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 font-display text-lg font-semibold text-foreground transition group-hover:text-accent">
                      <span className="flex-1">{item.question}</span>
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-accent transition group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="border-t border-border/50 px-6 pb-5 pt-4">
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-border bg-muted/30 px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Ready to shortlist?
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
            Get a Russia shortlist that avoids these problems
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We'll help you identify universities with better language support,
            manageable climates, strong hospital partnerships, and proven
            India-return success rates.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent="Request personalized shortlist"
              triggerClassName="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-base font-semibold text-background transition hover:opacity-90"
              plainTrigger
              title="Get your Russia shortlist"
              description="Share your NEET score, budget, and concerns. We'll create a realistic shortlist that minimizes disadvantages."
              submitLabel="Get shortlist"
              ctaVariant="disadvantages-bottom"
              countrySlug="russia"
              courseSlug="mbbs"
            />

            <Link
              href="/best-mbbs-colleges-in-russia-for-indian-students"
              className="inline-flex items-center gap-2 text-base font-medium text-accent hover:underline"
            >
              Browse top Russia universities
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
