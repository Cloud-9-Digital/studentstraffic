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

const pagePath = "/salary-after-mbbs-in-russia";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "Fresh MBBS graduates practicing in Russia earn 40,000-70,000 RUB/month (₹46,000-₹81,000), rising to 90,000-180,000 RUB in public hospitals and 150,000-400,000 RUB in private clinics after 5-8 years of specialization and experience. Cost of living in Russian cities like Kazan or Volgograd is 25,000-35,000 RUB/month, making physician salaries comfortable but not affluent by global standards.",
  "Indian graduates returning home after clearing FMGE (30-40% pass rate) typically start at ₹4-10 LPA in government hospitals or private clinics, reaching ₹25-50+ LPA after 10-15 years with specialization and reputation building. The India-return pathway requires 2-3 years of FMGE preparation post-graduation, extending the total timeline to medical registration to 8-9 years from starting MBBS.",
  "Gulf countries offer the highest immediate earning potential: UAE/Saudi Arabia pay ₹9-15 lakh/month for general practitioners and ₹18-25 lakh/month for specialists, but require 2-3 years minimum experience plus Gulf-specific licensing (Prometric/SMLE). The pathway involves Russia MBBS (6 years) + 2-3 years clinical experience + licensing exams, totaling 8-9 years to Gulf medical practice.",
];

const salaryComparison = [
  {
    pathway: "Practice in Russia (Fresh Graduate)",
    salaryRange: "40,000-70,000 RUB/month",
    inrEquivalent: "₹46,000-₹81,000/month",
    timeline: "6 years MBBS + immediate registration",
    requirements: "Russian medical license (included in graduation process)",
    takeHome: "₹35,000-₹60,000/month after tax & living costs",
  },
  {
    pathway: "Practice in Russia (After 5-8 years)",
    salaryRange: "90,000-400,000 RUB/month",
    inrEquivalent: "₹1.0-₹4.6 lakh/month",
    timeline: "6 years MBBS + 3-5 year residency + 2-3 years practice",
    requirements: "Specialization certification, clinic affiliation",
    takeHome: "₹75,000-₹3.5 lakh/month (public-private split)",
  },
  {
    pathway: "India Return (Junior Doctor)",
    salaryRange: "₹4-10 LPA",
    inrEquivalent: "₹33,000-₹83,000/month",
    timeline: "6 years Russia + 2-3 years FMGE prep = 8-9 years total",
    requirements: "FMGE/NExT clearance (30-40% pass rate), NMC registration",
    takeHome: "₹25,000-₹65,000/month after taxes",
  },
  {
    pathway: "India Return (Specialist After 10-15 years)",
    salaryRange: "₹25-50+ LPA",
    inrEquivalent: "₹2.0-₹4.0+ lakh/month",
    timeline: "9 years to registration + 3 year MD/MS + 5-10 years practice",
    requirements: "Postgraduate degree, clinical reputation, private practice setup",
    takeHome: "₹1.5-₹3.5+ lakh/month depending on specialty",
  },
  {
    pathway: "Gulf Countries (General Practitioner)",
    salaryRange: "AED 35,000-50,000/month",
    inrEquivalent: "₹8.0-₹11.5 lakh/month",
    timeline: "6 years Russia + 2-3 years experience + licensing = 8-9 years",
    requirements: "Prometric/SMLE, 2-3 years clinical experience, dataflow verification",
    takeHome: "₹7.5-₹11 lakh/month (tax-free in UAE/Saudi)",
  },
  {
    pathway: "Gulf Countries (Specialist)",
    salaryRange: "AED 60,000-90,000/month",
    inrEquivalent: "₹14-₹21 lakh/month",
    timeline: "6 years + residency + 5 years experience = 11-14 years",
    requirements: "Board certification, 5+ years post-specialization experience",
    takeHome: "₹13-₹20 lakh/month (tax-free)",
  },
];

const careerPathways = [
  {
    pathway: "Russia Medical Career",
    pros: [
      "Immediate registration post-graduation (no separate licensing exam)",
      "Familiar work environment (trained in same system)",
      "Lower cost of living allows comfortable lifestyle on modest salary",
      "Access to European medical system standards",
    ],
    cons: [
      "Language barrier limits senior positions (fluent Russian required for advancement)",
      "Lower absolute salaries compared to India/Gulf",
      "Limited family support system for Indian doctors",
      "Cold climate (-20°C to -35°C winters) challenging for long-term settlement",
    ],
    bestFor: "Students open to permanent settlement abroad, comfortable with Russian language and culture",
  },
  {
    pathway: "India-Return Career",
    pros: [
      "Practice in home country with family support",
      "Growing private healthcare market (₹25-50+ LPA potential)",
      "Cultural familiarity and established social networks",
      "Expanding telemedicine and online consultation opportunities",
    ],
    cons: [
      "FMGE bottleneck (30-40% pass rate, 2-3 years preparation typical)",
      "8-9 years total timeline to NMC registration vs 5.5 years for NEET students",
      "Initial salary lower than Gulf alternatives (₹4-10 LPA starting)",
      "Highly competitive job market in metro cities",
    ],
    bestFor: "Students committed to India practice, willing to invest in FMGE preparation, family support available",
  },
  {
    pathway: "Gulf Medical Career",
    pros: [
      "Highest immediate salary potential (₹8-21 lakh/month)",
      "Tax-free income in UAE/Saudi Arabia",
      "Modern hospital infrastructure and clinical exposure",
      "Large Indian expat community providing social support",
    ],
    cons: [
      "Requires 2-3 years Russia/India clinical experience before Gulf eligibility",
      "Licensing exams (Prometric/SMLE) add time and cost",
      "Employment visa tied to hospital sponsor (limited job flexibility)",
      "Not a permanent settlement pathway (citizenship restrictions)",
    ],
    bestFor: "Students prioritizing earning potential, comfortable with contract-based work, financial goals over stability",
  },
  {
    pathway: "US/UK Medical Career",
    pros: [
      "Highest long-term earning (US: $200,000-$400,000/year)",
      "World-class clinical training and research opportunities",
      "Pathway to permanent residency and citizenship",
      "International recognition and career mobility",
    ],
    cons: [
      "USMLE Step 1, 2, 3 + residency match extremely competitive (5-10% for FMGs)",
      "Minimum 3-4 years preparation + 3-7 years residency (total 12-17 years)",
      "High upfront investment ($100,000-$150,000 for exams, applications, living costs)",
      "No guarantee of residency match despite clearing exams",
    ],
    bestFor: "Exceptional academic performers with strong financial backing and 12-15 year career commitment",
  },
];

const careerTimelines = [
  {
    pathway: "Russia Practice",
    year0to3: "MBBS Years 1-3 (Pre-clinical + Basic sciences in Russia)",
    year3to6: "MBBS Years 4-6 (Clinical rotations in Russian hospitals)",
    year6to9: "Medical license obtained, Junior doctor 40,000-70,000 RUB/month",
    year9to12: "Residency/Specialization + Practice, 90,000-180,000 RUB/month",
    year12plus: "Specialist with clinic affiliation, 150,000-400,000 RUB/month",
  },
  {
    pathway: "India Return",
    year0to3: "MBBS Years 1-3 in Russia (Pre-clinical studies)",
    year3to6: "MBBS Years 4-6 in Russia (Clinical rotations)",
    year6to9: "FMGE preparation + clearance (2-3 attempts typical), Internship ₹20,000-₹40,000/month",
    year9to12: "NMC registration complete, Junior doctor ₹4-10 LPA",
    year12plus: "Postgraduate (MD/MS) + Private practice setup, ₹25-50+ LPA",
  },
  {
    pathway: "Gulf Career",
    year0to3: "MBBS Years 1-3 in Russia",
    year3to6: "MBBS Years 4-6 in Russia",
    year6to9: "Russia/India clinical experience (2-3 years) + Prometric/SMLE preparation",
    year9to12: "Gulf registration obtained, GP earning ₹8-11 lakh/month",
    year12plus: "Specialist certification, Senior doctor ₹14-21 lakh/month",
  },
  {
    pathway: "US/UK Career",
    year0to3: "MBBS Years 1-3 in Russia",
    year3to6: "MBBS Years 4-6 in Russia",
    year6to9: "USMLE Step 1, 2, 3 preparation + clinical experience building",
    year9to12: "Residency match attempts (2-4 cycles typical), Observerships",
    year12plus: "US Residency (3-7 years) earning $50,000-$70,000/year, Then attending physician $200,000-$400,000/year",
  },
];

const faqItems = [
  {
    question: "What is the salary of MBBS doctor in Russia after graduation?",
    answer:
      "Fresh MBBS graduates practicing in Russia earn 40,000-70,000 RUB per month (approximately ₹46,000-₹81,000). This rises to 90,000-180,000 RUB in public hospitals after completing residency and gaining 5-8 years of experience. Private practice specialists can earn 150,000-400,000 RUB monthly depending on specialty, location, and patient volume. Cost of living in cities like Kazan, Volgograd, or Rostov-on-Don is 25,000-35,000 RUB/month, making physician incomes comfortable relative to local standards.",
  },
  {
    question: "How much do Indian doctors earn after MBBS in Russia and returning to India?",
    answer:
      "Indian doctors returning after Russia MBBS must first clear FMGE/NExT (30-40% pass rate, typically 2-3 years of preparation). After NMC registration, starting salaries range from ₹4-10 LPA (₹33,000-₹83,000/month) in government hospitals or private clinics. With 10-15 years of experience and postgraduate specialization (MD/MS), salaries grow to ₹25-50+ LPA. The India-return pathway takes 8-9 years total (6 years MBBS + 2-3 years FMGE preparation) compared to 5.5 years for NEET-cleared Indian medical college students.",
  },
  {
    question: "Which country offers the best salary after MBBS in Russia?",
    answer:
      "Gulf countries (UAE, Saudi Arabia, Qatar, Kuwait) offer the highest immediate earning potential: ₹8-11 lakh/month for general practitioners and ₹14-21 lakh/month for specialists, with tax-free income. However, this requires 2-3 years of clinical experience post-Russia MBBS plus clearing Prometric/SMLE licensing exams. The US offers highest long-term earnings ($200,000-$400,000/year for specialists) but requires extremely competitive USMLE clearance and residency match (5-10% success rate for foreign medical graduates), extending the timeline to 12-15 years.",
  },
  {
    question: "Is salary after Russia MBBS enough to recover the total investment?",
    answer:
      "Total Russia MBBS investment is ₹35-50 lakhs (tuition + living costs for 6 years). Recovery timeline varies by career path: (1) Russia practice: 8-12 years at 40,000-70,000 RUB salary; (2) India return: 5-8 years after FMGE clearance at ₹6-12 LPA; (3) Gulf career: 3-4 years at ₹8-11 lakh/month; (4) Private practice India: 4-6 years at ₹25-50 LPA. Students Traffic counselling helps families model realistic ROI timelines based on specific career pathways and financial goals rather than optimistic projections.",
  },
  {
    question: "Do Russia MBBS graduates earn the same as Indian MBBS graduates?",
    answer:
      "Not initially. Indian medical college graduates obtain NMC registration in 5.5 years (5 years MBBS + 1 year internship) and can immediately start practice. Russia MBBS graduates face an 8-9 year timeline to Indian registration due to FMGE preparation (2-3 years typical). Initial salaries are similar (₹4-10 LPA) once both groups enter the job market, but the India college graduate has a 3-4 year head start in career progression and income accumulation. However, Russia MBBS total cost (₹35-50 lakhs) is significantly lower than private Indian colleges (₹60 lakhs to ₹2.5 crores), partially offsetting the timeline disadvantage.",
  },
  {
    question: "What factors affect salary after MBBS in Russia?",
    answer:
      "Key factors include: (1) Career pathway choice: Gulf careers pay ₹8-21 lakh/month vs Russia 40,000-400,000 RUB vs India ₹4-50+ LPA; (2) FMGE/licensing exam success: 30-40% FMGE pass rate means 60-70% need multiple attempts; (3) Specialization: General practitioners earn 50-60% less than specialists across all markets; (4) Geographic location: Metro India/Moscow pay 40-60% higher than tier-2 cities; (5) Years of experience: Senior specialists earn 3-5x junior doctor salaries; (6) Practice type: Private practice potential 2-4x institutional salaries but requires 10-15 years reputation building.",
  },
  {
    question: "How does Students Traffic help with career planning after Russia MBBS?",
    answer:
      "Students Traffic provides realistic career pathway counselling based on tracked outcomes from 1,200+ Russia MBBS graduates in our network. We help families understand: (1) Actual FMGE pass rates and preparation timelines for India-return; (2) Gulf licensing requirements and realistic salary negotiations; (3) ROI modeling for different career pathways based on student's financial goals; (4) Connection to Russia graduates currently practicing in India/Gulf/Russia for first-hand career insights; (5) Free FMGE/NExT coaching for students who join through us, removing the typical ₹1.5-2.5 lakh post-graduation coaching cost. Our focus is honest expectation-setting rather than over-promising unrealistic salary outcomes.",
  },
];

export default function RussiaMbbsSalaryPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Salary After MBBS in Russia 2026: Career Pathways & Earnings",
      description:
        "Comprehensive salary guide for Russia MBBS graduates: Russia practice (40,000-400,000 RUB), India return (₹4-50+ LPA), Gulf careers (₹8-21 lakh/month), timelines, and career pathway comparison.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Salary After MBBS in Russia",
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
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Updated with 2026 salary data
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Salary after MBBS in Russia: Career pathways & realistic earnings
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            Honest salary expectations across four career pathways: Russia practice (40,000-400,000 RUB/month), India return (₹4-50+ LPA), Gulf careers (₹8-21 lakh/month), and US/UK options. Understand timelines, requirements, and ROI for each pathway.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/countries/russia"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              Read full Russia guide
            </Link>
            <CounsellingDialog
              triggerContent={<>Get career pathway counselling</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need career pathway guidance after Russia MBBS?"
              description="Our team will help you understand realistic salary expectations, career timelines, and the right pathway based on your financial goals and personal situation."
              ctaVariant="salary-russia-hero"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: Salary after MBBS in Russia - Career pathway counselling"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-background p-8 sm:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Critical career insights
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What families must understand about Russia MBBS salary outcomes
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

          <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900">
                  Students Traffic's career counselling approach
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-800">
                  At Students Traffic, we track career outcomes for 1,200+ Russia MBBS graduates across India, Gulf, Russia, and US/UK markets. Our counselling focuses on realistic salary expectations, actual FMGE pass timelines, and ROI modeling based on your financial goals rather than generic promotional content. We connect families with graduates currently practicing in their target market for first-hand career insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Salary comparison across career pathways
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Russia MBBS opens four primary career pathways, each with different salary ranges, timelines, and requirements. This table shows realistic earnings at different career stages.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Career Pathway
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Salary Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      INR Equivalent
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Timeline
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Requirements
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {salaryComparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.pathway}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {row.salaryRange}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent">
                        {row.inrEquivalent}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.timeline}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.requirements}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">
                  Take-home vs gross salary
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  The table shows gross monthly salary. Take-home income after taxes, accommodation, and living costs: Russia 70-80% of gross (modest living costs), India 65-75% (higher taxes), Gulf 90-95% (tax-free but higher rent). Students Traffic helps families model actual disposable income for accurate ROI calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Career pathway deep-dive: pros, cons, and suitability
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Each pathway has distinct advantages, challenges, and suitability factors. Understanding these helps families make informed career decisions aligned with financial goals and personal values.
          </p>

          <div className="mt-10 space-y-6">
            {careerPathways.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="bg-gradient-to-r from-accent/10 to-background px-6 py-4 sm:px-8">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {item.pathway}
                  </h3>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advantages
                    </div>
                    <ul className="space-y-2">
                      {item.pros.map((pro, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Challenges
                    </div>
                    <ul className="space-y-2">
                      {item.cons.map((con, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-border bg-muted/30 px-6 py-4 sm:px-8">
                  <p className="text-sm font-medium text-foreground">
                    <strong>Best suited for:</strong> {item.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Career timeline visualization: 0 to 15 years
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Realistic timelines from starting Russia MBBS to achieving target career milestones. Understanding these helps families plan financially and set appropriate expectations.
          </p>

          <div className="mt-10 space-y-8">
            {careerTimelines.map((timeline, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <h3 className="mb-6 font-display text-xl font-semibold text-foreground">
                  {timeline.pathway}
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent sm:left-6" />
                  <div className="space-y-6">
                    <div className="relative flex gap-4 sm:gap-6">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent sm:h-10 sm:w-10">
                        0-3
                      </div>
                      <div className="pb-2 pt-1">
                        <p className="text-sm font-medium text-muted-foreground">Years 0-3</p>
                        <p className="mt-1 text-base leading-7 text-foreground">
                          {timeline.year0to3}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4 sm:gap-6">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent sm:h-10 sm:w-10">
                        3-6
                      </div>
                      <div className="pb-2 pt-1">
                        <p className="text-sm font-medium text-muted-foreground">Years 3-6</p>
                        <p className="mt-1 text-base leading-7 text-foreground">
                          {timeline.year3to6}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4 sm:gap-6">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent sm:h-10 sm:w-10">
                        6-9
                      </div>
                      <div className="pb-2 pt-1">
                        <p className="text-sm font-medium text-muted-foreground">Years 6-9</p>
                        <p className="mt-1 text-base leading-7 text-foreground">
                          {timeline.year6to9}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4 sm:gap-6">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent sm:h-10 sm:w-10">
                        9-12
                      </div>
                      <div className="pb-2 pt-1">
                        <p className="text-sm font-medium text-muted-foreground">Years 9-12</p>
                        <p className="mt-1 text-base leading-7 text-foreground">
                          {timeline.year9to12}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-4 sm:gap-6">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-background sm:h-10 sm:w-10">
                        12+
                      </div>
                      <div className="pb-2 pt-1">
                        <p className="text-sm font-medium text-muted-foreground">Year 12+</p>
                        <p className="mt-1 text-base leading-7 text-foreground">
                          {timeline.year12plus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            Need realistic career pathway counselling?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Students Traffic connects you with Russia MBBS graduates currently practicing in India, Gulf, Russia, and US/UK markets. Get first-hand career insights, salary negotiations advice, and honest ROI modeling based on your financial goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Talk to career counsellor</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Russia MBBS career pathway consultation"
              description="Share your career goals, financial targets, and location preferences. We'll help you understand realistic salary expectations, licensing requirements, and the right pathway for your situation."
              ctaVariant="salary-russia-bottom"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: Salary after MBBS in Russia - Bottom career counselling CTA"
            />
            <Link
              href="/countries/russia"
              className="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              Read full Russia guide
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
