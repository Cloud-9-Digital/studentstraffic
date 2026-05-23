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

const pagePath = "/is-mbbs-in-russia-worth-it";
const publishedDate = "2026-05-23";

const quickAnswer = [
  "Russia MBBS costs ₹35-50 lakhs total (vs ₹60 lakhs-₹2.5 crores in Indian private colleges), making it financially worth it for budget-conscious families. However, the 15-22% FMGE pass rate (vs 65-75% for Indian graduates) and climate challenges mean it's not automatically worth it for everyone.",
  "Worth it IF: You're disciplined, adaptable, willing to learn Russian (200-300 hours needed), can handle -20°C to -35°C winters for 4-5 months, and committed to FMGE/NExT prep from Year 3 onward (budget ₹1.5-2.5 lakhs for coaching).",
  "Not worth it IF: You struggle with cold climates, need constant family support, want a frictionless path to Indian practice, or chose Russia solely because a consultant showed low fees without explaining clinical language requirements or licensing exam challenges.",
];

const worthItScenarios = [
  {
    scenario: "Budget-constrained with strong academics",
    details:
      "Total 6-year cost of ₹35-50 lakhs (including travel, living, insurance) is 40-75% cheaper than most Indian private colleges. Worth it if you have 85%+ PCB, NEET qualified, and realistic about additional FMGE coaching investment (₹1.5-2.5 lakhs).",
  },
  {
    scenario: "Self-disciplined and adaptable students",
    details:
      "Russia suits students who can manage independent living, adapt to harsh winters (October-March), learn conversational Russian (A2-B1 level by Year 3), and maintain consistent study habits without daily parental oversight.",
  },
  {
    scenario: "Long-term India practice planning",
    details:
      "Worth it if you're treating FMGE/NExT as mandatory from Day 1, planning structured exam prep from Year 3, and choosing universities with proven graduate pass rates. Budget 18-24 months for licensing exam preparation post-MBBS.",
  },
  {
    scenario: "NMC-approved university selection",
    details:
      "Choose universities with 70+ years history, WDOMS listing, strong hospital partnerships (3+ teaching hospitals), and documented English-medium programs. Examples: Kazan State Medical, Bashkir State Medical, Privolzhsky Research Medical University.",
  },
];

const notWorthItScenarios = [
  {
    scenario: "Climate-sensitive students",
    warning:
      "If you struggle with cold weather or have seasonal affective disorder, Russia's 4-5 month winters (-20°C to -35°C) with only 6-7 hours daily sunlight will significantly impact mental health and academic performance. Consider warmer alternatives like Vietnam or Philippines.",
  },
  {
    scenario: "Expecting easy India-return pathway",
    warning:
      "FMGE/NExT pass rate for Russia graduates is only 15-22% (first attempt) vs 65-75% for Indian medical college graduates. If you're not prepared for rigorous self-study, additional coaching costs, and potential multiple exam attempts, factor this into your decision.",
  },
  {
    scenario: "Chosen solely on low fee quotes",
    warning:
      "Universities advertising fees below ₹2.5 lakhs/year often have hidden issues: limited English support, weak clinical exposure, outdated facilities, or poor FMGE track records. Verify WDOMS listing, check actual student testimonials, and visit university websites directly.",
  },
  {
    scenario: "Need for constant family support",
    warning:
      "Time zone differences (2.5-5.5 hours), expensive international calls, visa complexity preventing frequent parent visits, and independent hostel living mean students handle challenges alone. Not ideal for those requiring daily emotional support or parental supervision.",
  },
];

const costBenefitAnalysis = {
  totalCost: {
    russia: "₹35-50 lakhs (6 years)",
    indianPrivate: "₹60 lakhs-₹2.5 crores (5.5 years)",
    savings: "₹25 lakhs-₹2 crores",
  },
  hiddenCosts: {
    fmgeCoaching: "₹1.5-2.5 lakhs",
    winterClothing: "₹25,000-40,000",
    travelPerTrip: "₹40,000-60,000 (3-4 trips total)",
    languageTutoring: "₹15,000-25,000",
  },
  timeInvestment: {
    russianLanguage: "200-300 hours over 3 years",
    climaticAdaptation: "6-8 months",
    fmgePreparation: "18-24 months post-MBBS",
  },
  successMetrics: {
    fmgePassRate: "15-22% (first attempt)",
    averageAttempts: "2-3 attempts for successful candidates",
    totalTimeToIndianPractice: "7-8 years (vs 5.5-6 years Indian MBBS)",
  },
};

const decisionMatrix = [
  {
    factor: "Financial value",
    worthIt: "Family budget <₹60 lakhs; significant savings vs Indian private",
    notWorthIt: "Can afford ₹60 lakhs+; prefer domestic stability",
    weight: "High",
  },
  {
    factor: "Climate tolerance",
    worthIt: "Comfortable with cold; willing to invest in winter gear",
    notWorthIt: "Tropical preference; seasonal depression history",
    weight: "Medium-High",
  },
  {
    factor: "Language commitment",
    worthIt: "Willing to learn Russian; understand clinical necessity",
    notWorthIt: "Expect English-only; no time for language classes",
    weight: "High",
  },
  {
    factor: "Licensing exam motivation",
    worthIt: "Disciplined; ready for FMGE coaching from Year 3",
    notWorthIt: "Expect automatic India practice; low self-study capacity",
    weight: "Very High",
  },
  {
    factor: "Family support needs",
    worthIt: "Independent; comfortable with remote family contact",
    notWorthIt: "Need daily supervision; struggle with isolation",
    weight: "Medium",
  },
];

const faqItems = [
  {
    question: "Is MBBS in Russia worth it for Indian students in 2026?",
    answer:
      "Worth it if you're budget-conscious (saves ₹25 lakhs-₹2 crores vs Indian private), disciplined enough for FMGE prep (15-22% pass rate requires serious commitment), adaptable to harsh winters (-20°C to -35°C for 4-5 months), and willing to learn Russian for clinical years. Not worth it if you expect an easy path, can't handle cold climates, or chose based only on low fee advertisements.",
  },
  {
    question: "How does MBBS in Russia compare cost-wise to Indian private colleges?",
    answer:
      "Russia costs ₹35-50 lakhs total for 6 years (tuition + accommodation + living + travel), while Indian private colleges charge ₹60 lakhs to ₹2.5 crores for 5.5 years. However, factor in FMGE coaching (₹1.5-2.5 lakhs), lower pass rates (15-22% vs 65-75%), and potential exam retakes when calculating true value.",
  },
  {
    question: "What is the FMGE/NExT pass rate for Russia MBBS graduates?",
    answer:
      "15-22% on first attempt as of 2026, significantly lower than 65-75% for Indian medical college graduates. Successful candidates typically attempt 2-3 times over 18-24 months with structured coaching. This extends time to Indian practice by 1.5-2 years compared to domestic MBBS.",
  },
  {
    question: "Is Russia better than Vietnam for MBBS?",
    answer:
      "Russia offers more established universities (70+ years history), lower costs (₹35-50 lakhs vs ₹50-65 lakhs), and larger Indian student community. Vietnam has warmer climate (18°C-32°C year-round), closer proximity (4-5 hours vs 8-12 hours travel), and easier adaptation. Choose based on climate tolerance, budget, and language willingness.",
  },
  {
    question: "Can I complete MBBS in Russia without learning Russian?",
    answer:
      "Theory classes are in English at most universities, but 70-80% of clinical communication (patient interactions, ward rounds, hospital discussions) happens in Russian. You need conversational fluency (A2-B1 level) by Year 3 for effective practical training. Budget 200-300 hours for language learning and consider additional tutoring (₹15,000-25,000).",
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-background px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Updated on 23 May 2026
          </div>

          <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent/80">
            Decision guide
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Is MBBS in Russia worth it for Indian students?
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            The honest answer isn't yes or no—it's "worth it for whom?" Russia saves ₹25 lakhs-₹2 crores vs Indian private colleges, but requires climate adaptation, Russian language skills, and serious FMGE preparation.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <CounsellingDialog
              triggerContent={
                <>
                  Is Russia right for you?
                  <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              }
              triggerClassName="group inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-base font-semibold text-background transition hover:opacity-90"
              plainTrigger
              title="Get personalized Russia evaluation"
              description="Share your NEET score, budget, climate preferences, and career goals. We'll help determine if Russia is worth it for your specific situation."
              submitLabel="Request evaluation"
              ctaVariant="worth-it-hero"
              countrySlug="russia"
              courseSlug="mbbs"
            />
            <Link href="/mbbs-in-russia" className="inline-flex items-center gap-2 rounded-lg border-2 border-border px-6 py-3.5 text-base font-semibold text-foreground transition hover:bg-muted">
              Read Russia overview
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
                {quickAnswer.map((item, idx) => (
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

            {/* Cost-Benefit Analysis */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Financial comparison
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Real cost-benefit analysis
              </h2>

              <div className="mt-10 overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Metric</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Russia MBBS</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Indian Private</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 font-medium text-foreground">Total Cost</td>
                      <td className="px-6 py-4 text-muted-foreground">{costBenefitAnalysis.totalCost.russia}</td>
                      <td className="px-6 py-4 text-muted-foreground">{costBenefitAnalysis.totalCost.indianPrivate}</td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="px-6 py-4 font-medium text-foreground">Potential Savings</td>
                      <td colSpan={2} className="px-6 py-4 font-semibold text-green-700 dark:text-green-400">
                        {costBenefitAnalysis.totalCost.savings}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-foreground">FMGE Pass Rate</td>
                      <td className="px-6 py-4 text-muted-foreground">{costBenefitAnalysis.successMetrics.fmgePassRate}</td>
                      <td className="px-6 py-4 text-muted-foreground">65-75%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-foreground">Time to Practice</td>
                      <td className="px-6 py-4 text-muted-foreground">{costBenefitAnalysis.successMetrics.totalTimeToIndianPractice}</td>
                      <td className="px-6 py-4 text-muted-foreground">5.5-6 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-6">
                <h3 className="font-semibold text-foreground">Hidden costs to budget:</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>FMGE coaching: {costBenefitAnalysis.hiddenCosts.fmgeCoaching}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Winter clothing: {costBenefitAnalysis.hiddenCosts.winterClothing}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Travel per trip: {costBenefitAnalysis.hiddenCosts.travelPerTrip}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Language tutoring: {costBenefitAnalysis.hiddenCosts.languageTutoring}</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Worth It Scenarios */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Worth it
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                When Russia MBBS is worth it
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {worthItScenarios.map((item, idx) => (
                  <div key={item.scenario} className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <h3 className="font-semibold text-green-900 dark:text-green-400">{item.scenario}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-green-800 dark:text-green-300/90">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Not Worth It Scenarios */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Not worth it
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                When Russia MBBS is not worth it
              </h2>

              <div className="mt-10 space-y-6">
                {notWorthItScenarios.map((item, idx) => (
                  <div key={item.scenario} className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <h3 className="font-semibold text-red-900 dark:text-red-400">{item.scenario}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-red-800 dark:text-red-300/90">
                      {item.warning}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Decision Matrix */}
            <section className="mt-20">
              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Decision matrix: Is Russia right for you?
              </h2>

              <div className="mt-10 overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Factor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-green-700 dark:text-green-400">Worth It If...</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-red-700 dark:text-red-400">Not Worth It If...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {decisionMatrix.map((row) => (
                      <tr key={row.factor}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{row.factor}</div>
                          <div className="mt-1 text-xs text-muted-foreground">Weight: {row.weight}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{row.worthIt}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{row.notWorthIt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-20">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQs
              </div>

              <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                Frequently asked questions
              </h2>

              <div className="mt-10 space-y-4">
                {faqItems.map((item) => (
                  <details key={item.question} className="group rounded-xl border border-border bg-card transition hover:border-accent/30">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 font-display text-lg font-semibold text-foreground transition group-hover:text-accent">
                      <span className="flex-1">{item.question}</span>
                      <svg className="h-5 w-5 flex-shrink-0 text-accent transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

      {/* CTA */}
      <section className="border-y border-border bg-muted/30 px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
            Get a personalized "worth it" evaluation
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Share your NEET score, budget, climate preferences, and career goals. We'll help determine if Russia is worth it for your specific situation and suggest suitable universities.
          </p>
          <div className="mt-8">
            <CounsellingDialog
              triggerContent="Request personalized evaluation"
              triggerClassName="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-base font-semibold text-background transition hover:opacity-90"
              plainTrigger
              title="Is Russia worth it for you?"
              description="Share your profile and we'll provide an honest evaluation based on your specific circumstances."
              submitLabel="Get evaluation"
              ctaVariant="worth-it-bottom"
              countrySlug="russia"
              courseSlug="mbbs"
            />
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
