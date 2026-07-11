"use client";

import Link from "next/link";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const pagePath = "/is-mbbs-in-vietnam-good-for-indian-students";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "Total cost comparison: Vietnam MBBS costs ₹28-40 lakhs for 6 years (tuition $3,500-5,500/year + living $2,000-3,000/year) compared to Russia ₹35-50 lakhs and Indian private colleges ₹60 lakhs-₹2.5 crores. Cost savings of ₹20-210 lakhs make Vietnam financially attractive for budget-conscious families.",
  "Climate and proximity advantages: Vietnam offers year-round warm climate (25-35°C), short flight time (4-6 hours vs Russia's 8-10 hours), and easier family visits. No extreme winter adaptation (-20°C to -35°C in Russia) reduces settling-in stress significantly.",
  "University quality variation requires careful selection: Vietnam's 15+ medical universities range from established public institutions (Hanoi Medical University, Hue University) to newer private colleges. Success depends on choosing specific universities with verified clinical training and NMC guideline compliance, not selecting based on country reputation alone.",
];

const costBenefitAnalysis = {
  totalCost: {
    vietnam: "₹28-40 lakhs (6 years)",
    russia: "₹35-50 lakhs (6 years)",
    indianPrivate: "₹60 lakhs-₹2.5 crores (5.5 years)",
    savings: "₹20-210 lakhs vs Indian private",
  },
  climateComfort: {
    vietnam: "25-35°C year-round, no extreme winters",
    russia: "-20°C to -35°C winters (Oct-Mar), 4-5 months harsh cold",
    advantage: "Easier adaptation, lower winter clothing costs (₹15,000-30,000 saved)",
  },
  travelAccessibility: {
    vietnam: "4-6 hours direct flights, frequent connections",
    russia: "8-10 hours with connections, fewer direct options",
    emergencyVisits: "Same-day travel possible to Vietnam vs 1-2 day journey to Russia",
  },
  languageBarrier: {
    vietnam: "Vietnamese needed for clinical years (A2-B1 level)",
    russia: "Russian needed for clinical years (A2-B1 level)",
    difficulty: "Vietnamese generally easier for Indians (simpler grammar, familiar sounds)",
  },
};

const vietnamGoodWhen = [
  {
    scenario: "Budget-conscious families",
    details: "Family budget is ₹28-40 lakhs for full MBBS tuition and living. Vietnam offers quality medical education at 30-40% lower cost than Russia while maintaining NMC guideline compliance. Students Traffic provides free FMGE/NExT coaching for students who join through us.",
    metrics: "Total 6-year cost: ₹28-40 lakhs vs Russia ₹35-50 lakhs",
  },
  {
    scenario: "Climate-sensitive students",
    details: "Student struggles with extreme cold or prefers tropical climate. Vietnam's year-round warmth (25-35°C) eliminates winter adaptation challenges (-20°C to -35°C in Russia).",
    metrics: "No -30°C winters, ₹20,000-30,000 saved on winter clothing",
  },
  {
    scenario: "Frequent family visits needed",
    details: "Parents want ability to visit 2-3 times annually without expensive long-haul flights. Vietnam's 4-6 hour proximity makes emergency visits and family support more practical.",
    metrics: "Flight costs: ₹15,000-25,000 vs Russia ₹30,000-45,000 per trip",
  },
  {
    scenario: "Students with qualifying NEET scores",
    details: "Student has qualifying NEET (50th/40th percentile) and 50%+ PCB in Class 12. Vietnam universities prioritize academic profile over competitive NEET ranking, unlike Indian counseling.",
    metrics: "NEET 550-600 marks sufficient vs India requiring 600-720 for private colleges",
  },
];

const vietnamNotGoodWhen = [
  {
    scenario: "Seeking longest track record",
    warning: "Want maximum historical data on India-return outcomes and established alumni networks. Vietnam's India-focused MBBS programs scaled post-2015 vs Russia's 50+ years.",
    metrics: "First major cohorts graduated 2021-22 vs Russia 1970s-onwards",
  },
  {
    scenario: "Cost-only decision-making",
    warning: "Choosing lowest-fee university without verifying teaching quality, clinical training, hospital infrastructure, or FMGE preparation support.",
    metrics: "Saving $1,000/year on tuition but losing on career outcomes isn't value",
  },
  {
    scenario: "Zero language learning willingness",
    warning: "Expecting English-medium programs mean zero Vietnamese needed. Clinical rotations (Years 4-6) require A2-B1 Vietnamese for patient interaction.",
    metrics: "200-300 hours Vietnamese learning needed by Year 4",
  },
  {
    scenario: "Country-level decision without university research",
    warning: "Assuming all Vietnam medical universities offer identical quality. Public universities (Hanoi Medical, Hue University) differ significantly from newer private institutions.",
    metrics: "Quality range: 70-year-old institutions vs 6-year-old colleges",
  },
];

const decisionMatrix = [
  {
    factor: "Financial value",
    vietnamScore: "Excellent",
    details: "₹28-40 lakhs total cost, 30-40% cheaper than Russia, 50-90% cheaper than Indian private colleges",
    weight: "High",
  },
  {
    factor: "Climate comfort",
    vietnamScore: "Excellent",
    details: "Year-round 25-35°C, no extreme winters, easy adaptation, tropical familiarity for Indian students",
    weight: "Medium-High",
  },
  {
    factor: "Travel proximity",
    vietnamScore: "Excellent",
    details: "4-6 hour flights, frequent connections, emergency visits possible same-day, lower travel costs",
    weight: "Medium",
  },
  {
    factor: "Track record length",
    vietnamScore: "Developing",
    details: "Post-2015 scale-up, first cohorts graduated 2021-22, shorter outcome history than Russia/Philippines",
    weight: "Medium-High",
  },
  {
    factor: "University quality consistency",
    vietnamScore: "Variable",
    details: "Wide range from established public (Hanoi Medical 1902) to new private (2010-2018), requires careful selection",
    weight: "High",
  },
  {
    factor: "Clinical language barrier",
    vietnamScore: "Moderate",
    details: "Vietnamese needed for patient interaction (A2-B1), but easier than Russian for Indian students",
    weight: "Medium-High",
  },
];

const faqItems = [
  {
    question: "Is MBBS in Vietnam good for Indian students in 2026?",
    answer:
      "Yes, Vietnam can be an excellent choice for Indian students prioritizing lower costs (₹28-40 lakhs vs ₹35-50 lakhs in Russia), warmer climate (25-35°C year-round), and shorter travel distance (4-6 hours). However, success requires careful university selection from Vietnam's varied medical education landscape (15+ institutions ranging from 70-year-old public universities to 6-year-old private colleges). Choose specific universities with verified clinical training and NMC guideline compliance rather than selecting based solely on country reputation.",
  },
  {
    question: "Is MBBS in Vietnam better than Russia for Indian students?",
    answer:
      "Not automatically - it depends on student priorities. Vietnam advantages: 30-40% lower costs (₹28-40 lakhs vs ₹35-50 lakhs), warmer climate (no -30°C winters), shorter flights (4-6 hours vs 8-10 hours), easier language (Vietnamese vs Russian). Russia advantages: 50+ year India-facing track record vs Vietnam's post-2015 scale-up, more established alumni networks, larger public university ecosystem. Budget-conscious students preferring warm climate favor Vietnam; those prioritizing longest track record favor Russia.",
  },
  {
    question: "Is MBBS in Vietnam better than private MBBS colleges in India?",
    answer:
      "For families with budget constraints, yes. Vietnam offers 50-90% cost savings (₹28-40 lakhs vs ₹60 lakhs-₹2.5 crores for Indian private colleges) with officially verified degrees meeting NMC guidelines and international exposure. Students Traffic provides free FMGE/NExT coaching for students who join through us, removing the typical ₹1.5-2.5 lakh coaching cost from the comparison. However, India advantages include: no language barrier, higher FMGE pass rates (65-75% vs 15-25% for foreign graduates), no adaptation stress, and familiar medical practice patterns.",
  },
  {
    question: "What makes Vietnam a poor choice despite lower fees?",
    answer:
      "Selecting based on lowest cost without verifying specific university quality. Vietnam's medical universities vary widely: established public institutions (Hanoi Medical University founded 1902, Hue University 1957) vs newer private colleges (established 2010-2018) with unproven track records. Choosing a weak university charging $3,500/year over a quality institution at $4,500/year saves $6,000 total but may cost significantly more in poor clinical training, inadequate FMGE preparation, and career outcomes. Always prioritize verified quality over minimum fees.",
  },
  {
    question: "How do I know if Vietnam is right for my student profile?",
    answer:
      "Vietnam fits best if: (1) total budget is ₹28-40 lakhs for tuition and living (Students Traffic provides free FMGE/NExT coaching), (2) student has qualifying NEET (50th/40th percentile) and 50%+ PCB marks, (3) climate comfort is priority (warm weather year-round), (4) family wants frequent visit accessibility (4-6 hour flights), (5) student is willing to learn conversational Vietnamese (200-300 hours by Year 4), and (6) family can research universities individually rather than relying on country reputation. If seeking longest established track record or unwilling to learn local language, consider Russia or Caribbean alternatives.",
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
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Updated for 2026 decision-makers
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Is MBBS in Vietnam good for Indian students?
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            The honest answer: <strong className="text-foreground">Yes, when chosen for the right reasons.</strong> Vietnam offers real advantages in cost, climate, and proximity - but only works when families choose specific universities carefully rather than buying the "easy destination" story.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/medical-colleges-in-vietnam"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              See Vietnam universities
            </Link>
            <CounsellingDialog
              triggerContent={<>Get Vietnam fit assessment</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Is Vietnam right for your student?"
              description="Our team will help assess whether Vietnam matches your budget, student profile, and career goals better than Russia or Indian private colleges."
              ctaVariant="vietnam-good-hero"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Is MBBS in Vietnam good for Indian students"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-background p-8 sm:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Core advantages
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Why families consider Vietnam for MBBS
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {keyTakeaways.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-border/60 bg-background/80 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-bold text-accent">
                    {idx + 1}
                  </div>
                  <p className="text-base leading-7 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Vietnam vs Russia vs Indian private: cost-benefit comparison
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Understanding how Vietnam compares across key decision factors helps families make informed choices beyond just looking at headline tuition costs.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Factor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Vietnam
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Russia / Alternative
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      Total 6-year cost
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {costBenefitAnalysis.totalCost.vietnam}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Russia: {costBenefitAnalysis.totalCost.russia}<br />
                      Indian Private: {costBenefitAnalysis.totalCost.indianPrivate}
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      Climate
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {costBenefitAnalysis.climateComfort.vietnam}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {costBenefitAnalysis.climateComfort.russia}
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      Travel time
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {costBenefitAnalysis.travelAccessibility.vietnam}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {costBenefitAnalysis.travelAccessibility.russia}
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      Language requirement
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {costBenefitAnalysis.languageBarrier.vietnam}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {costBenefitAnalysis.languageBarrier.russia}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Vietnam is good when
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                These student profiles typically benefit most from Vietnam's combination of affordability, comfort, and accessibility.
              </p>

              <div className="mt-8 space-y-6">
                {vietnamGoodWhen.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-green-200 bg-green-50 p-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-green-900">
                      {idx + 1}. {item.scenario}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      {item.details}
                    </p>
                    <div className="mt-3 rounded-lg bg-green-100 px-3 py-2">
                      <p className="text-xs font-medium text-green-700">
                        {item.metrics}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Vietnam is not good when
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                These scenarios suggest alternative destinations may offer better fit despite Vietnam's cost and comfort advantages.
              </p>

              <div className="mt-8 space-y-6">
                {vietnamNotGoodWhen.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-red-200 bg-red-50 p-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-red-900">
                      {idx + 1}. {item.scenario}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-red-800">
                      {item.warning}
                    </p>
                    <div className="mt-3 rounded-lg bg-red-100 px-3 py-2">
                      <p className="text-xs font-medium text-red-700">
                        {item.metrics}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Decision matrix: evaluating Vietnam across key factors
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Weight these factors based on your student's specific priorities and constraints to determine whether Vietnam offers the best overall fit.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Decision Factor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Vietnam Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {decisionMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.factor}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            row.vietnamScore === "Excellent"
                              ? "bg-green-100 text-green-700"
                              : row.vietnamScore === "Developing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {row.vietnamScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.details}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            row.weight === "High"
                              ? "text-red-600"
                              : row.weight.includes("Medium-High")
                                ? "text-orange-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {row.weight}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>

          <div className="mt-10 space-y-4">
            {faqItems.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-border bg-card shadow-sm"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 p-6 font-display text-lg font-semibold text-foreground transition hover:text-accent">
                  <span className="flex-1">{item.question}</span>
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-border px-6 pb-6 pt-4">
                  <p className="text-base leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Need help deciding if Vietnam fits your student profile?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Our team can help assess whether Vietnam's combination of cost, climate, and proximity outweighs its shorter track record for your specific budget, academic profile, and career goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Get personalized Vietnam assessment</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Vietnam fit evaluation"
              description="Share your NEET score, Class 12 marks, budget, and preferences. We'll help determine whether Vietnam, Russia, or Indian private colleges offer the best value for your student's specific situation."
              ctaVariant="vietnam-good-bottom"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Is MBBS in Vietnam good for Indian students - bottom CTA"
            />
            <Link
              href="/mbbs-in-vietnam"
              className="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              Read full Vietnam guide
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
