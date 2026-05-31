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

const pagePath = "/disadvantages-of-studying-mbbs-in-vietnam";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "Limited track record: Vietnam MBBS programs for Indian students began scaling only post-2015, compared to Russia's 50+ year history. First major cohorts graduated around 2021-2022, providing less long-term outcome data for families evaluating India-return success rates and career trajectories.",
  "University quality variation: Vietnam's 15+ medical universities accepting international students range from established public institutions (Hanoi Medical University founded 1902) to newer private colleges (established 2010-2018). Teaching quality, hospital partnerships, and English-medium delivery consistency vary significantly between institutions.",
  "Clinical language barrier: Despite English-medium marketing, clinical rotations (Years 4-6) involve Vietnamese-speaking patients, local medical staff, and hospital documentation. Students need conversational Vietnamese (A2-B1 level) by Year 4 to participate effectively in ward rounds, patient histories, and doctor-nurse communication.",
];

const disadvantages = [
  {
    title: "Shorter India-facing track record",
    severity: "Medium",
    impact: "Career planning",
    details:
      "Vietnam medical education for Indian students scaled significantly only after 2015. The first major cohorts graduated around 2021-2022, meaning families have limited long-term data on FMGE pass rates, residency placements, or career outcomes compared to Russia (50+ years) or Philippines (40+ years). This shorter track record doesn't make Vietnam inherently risky, but it requires more direct verification of university quality rather than relying on established reputation.",
    mitigation:
      "Focus on specific universities with verifiable hospital partnerships, published FMGE preparation programs, and transparent graduate outcome data rather than choosing based solely on country reputation.",
  },
  {
    title: "Significant university quality variation",
    severity: "High",
    impact: "Academic outcomes",
    details:
      "Vietnam's medical education landscape includes both world-class public institutions and newer private colleges with varying quality standards. Public universities like Hanoi Medical University (founded 1902) and Hue University of Medicine and Pharmacy (founded 1957) have established teaching standards, while some private institutions established 2010-2018 may lack mature clinical training infrastructure. Teaching quality, hospital partnerships, English-medium consistency, and student support vary widely across institutions.",
    mitigation:
      "Research each university individually: check establishment year, hospital affiliations, faculty credentials, actual student reviews (not consultant testimonials), and whether clinical training occurs at the university's own teaching hospital or external facilities.",
  },
  {
    title: "Clinical language barrier reality",
    severity: "High",
    impact: "Years 4-6 clinical training",
    details:
      "English-medium programs deliver lectures and exams in English, but clinical rotations involve Vietnamese-speaking patients, local medical staff, and hospital documentation in Vietnamese. Unlike classroom learning, clinical medicine requires understanding patient complaints, participating in Vietnamese-language ward rounds, and communicating with nurses and technicians. Students typically need A2-B1 conversational Vietnamese by Year 4 to function effectively in hospitals. This language requirement is often understated in marketing materials.",
    mitigation:
      "Start Vietnamese language learning from Year 1 (most universities offer optional/mandatory Vietnamese classes). Budget for language tutoring (₹5,000-10,000/month). Choose universities with dedicated English-speaking clinical coordinators who can facilitate patient interactions during early clinical exposure.",
  },
  {
    title: "Over-marketing as the 'easy' option",
    severity: "Medium",
    impact: "Decision quality",
    details:
      "Vietnam is often marketed as easier than Russia because of warmer climate (25-35°C year-round vs Russia's -20°C to -35°C winters), closer proximity to India (4-6 hour flights vs 8-10 hours), and lower fees ($3,500-5,500/year vs $4,000-7,000/year). This comfort-focused marketing can lead families to underestimate the need for rigorous university verification, clinical training quality assessment, and FMGE preparation planning. 'Easy' geography doesn't guarantee easy medical education or India-return success.",
    mitigation:
      "Evaluate Vietnam universities using the same rigor as Russia: verify NMC guideline compliance, check clinical training hospital quality, understand actual FMGE coaching availability, and assess whether the specific university (not just the country) fits your student's academic profile.",
  },
  {
    title: "Thinner public information landscape",
    severity: "Medium",
    impact: "Decision-making process",
    details:
      "Compared to Russia (extensive student forums, detailed university comparisons, transparent fee structures), Vietnam MBBS information is dominated by consultant-driven content with limited independent student reviews or university-comparison resources. Distinguishing between genuine university quality signals and promotional claims requires more effort. Families often struggle to find detailed information on specific aspects like clinical rotation scheduling, hospital infrastructure, or FMGE preparation programs.",
    mitigation:
      "Demand university-specific documentation: official fee breakdowns (all 6 years), clinical rotation hospital lists with photo evidence, sample timetables, and contact details of current Indian students (not consultant-selected testimonials). Use multiple information sources rather than relying on a single consultant's claims.",
  },
  {
    title: "Low fees can distract from fit assessment",
    severity: "Medium",
    impact: "Long-term satisfaction",
    details:
      "Vietnam's total 6-year costs ($28,000-40,000 including accommodation) are 30-40% lower than Russia ($35,000-55,000), making it attractive for budget-conscious families. However, choosing primarily based on lowest cost can lead to poor university fit: inadequate clinical training facilities, weak English-medium delivery, uncomfortable hostel conditions, or limited FMGE preparation support. A university charging $3,000/year less but offering inferior clinical exposure ultimately costs more in opportunity and career outcomes.",
    mitigation:
      "Establish budget parameters first, then shortlist 3-4 universities within that range based on teaching quality, clinical training, city fit, and student support rather than selecting the single cheapest option. Compare total value (education quality + India-return support) rather than tuition alone.",
  },
];

const mitigationStrategies = [
  {
    strategy: "University-specific verification",
    action:
      "Research each university individually rather than treating 'Vietnam' as a uniform option. Check establishment date, hospital partnerships, faculty qualifications, and whether clinical training occurs at dedicated teaching hospitals.",
  },
  {
    strategy: "Language preparation planning",
    action:
      "Start Vietnamese language classes from Year 1. Budget ₹5,000-10,000/month for language tutoring. Choose universities offering structured Vietnamese courses for international students.",
  },
  {
    strategy: "FMGE outcome validation",
    action:
      "We assess cohort-specific NExT/FMGE outcomes for Indian graduates from that institution — not aggregate Vietnam data — as part of our university shortlisting process. NExT coaching availability and India-return counselling infrastructure are assessed alongside recognition status.",
  },
  {
    strategy: "Independent information sourcing",
    action:
      "Contact current Indian students directly (request contact details from university, not consultant). Join Vietnam MBBS student Facebook groups. Cross-check consultant claims with multiple sources.",
  },
];

const whoShouldReconsider = [
  {
    profile: "Students seeking longest established track record",
    reason:
      "If you prioritize 50+ years of proven India-return outcomes and extensive alumni networks, Russia or Philippines offer more historical data than Vietnam's recent (post-2015) scale-up.",
  },
  {
    profile: "Families uncomfortable with limited public information",
    reason:
      "Vietnam requires more direct verification effort due to thinner independent information landscape. If you prefer destinations with extensive student forums and transparent comparison data, Russia may be easier to research.",
  },
  {
    profile: "Students expecting zero local language learning",
    reason:
      "Clinical medicine in Vietnam requires conversational Vietnamese for patient interaction (Years 4-6). If completely unwilling to learn local language, consider Caribbean English-medium programs despite higher costs.",
  },
  {
    profile: "Budget-first choosers without quality assessment",
    reason:
      "Selecting Vietnam solely because fees are 30-40% lower than Russia without evaluating specific university quality, clinical training, and FMGE preparation can lead to poor long-term outcomes.",
  },
];

const faqItems = [
  {
    question: "What is the biggest disadvantage of studying MBBS in Vietnam?",
    answer:
      "For Indian students, the primary challenge is significant quality variation between universities combined with a shorter India-facing track record (major scaling post-2015 vs Russia's 50+ years). Vietnam offers both excellent public universities and weaker private institutions - choosing requires more university-specific verification rather than relying on country reputation. This isn't inherently negative, but demands sharper due diligence.",
  },
  {
    question: "Does Vietnam have language problems in MBBS like Russia?",
    answer:
      "Yes, but differently. While lectures occur in English, clinical rotations (Years 4-6) involve Vietnamese-speaking patients, local staff, and hospital documentation in Vietnamese. Students need A2-B1 conversational Vietnamese by Year 4 for effective clinical participation. However, Vietnamese is generally considered easier for Indians to learn than Russian (simpler grammar, familiar sounds), and Vietnam's warmer climate makes daily language immersion less challenging than Russia's harsh winters.",
  },
  {
    question: "Do these disadvantages mean MBBS in Vietnam is a bad idea?",
    answer:
      "No. Vietnam can be an excellent choice for Indian students when shortlisted through specific high-quality universities rather than chosen solely for comfort (warm climate, proximity) or lowest cost. Top Vietnamese public universities offer quality medical education at significantly lower cost ($28,000-40,000 for 6 years vs $35,000-55,000 in Russia), shorter travel time (4-6 hours vs 8-10 hours), and easier climate adaptation. Success depends on choosing the right university, not the country.",
  },
  {
    question: "How can students reduce the risks of studying MBBS in Vietnam?",
    answer:
      "Research universities individually (establishment date, hospital partnerships, faculty credentials), verify NMC guideline compliance status, contact current Indian students directly (not consultant-selected testimonials), start Vietnamese language learning from Year 1, validate FMGE preparation programs, and choose based on total education quality rather than lowest fees alone. Demand written documentation for all claims before payment.",
  },
  {
    question:
      "Is Vietnam safer than Russia for Indian MBBS students?",
    answer:
      "Vietnam offers easier climate (25-35°C year-round vs -20°C to -35°C Russian winters), shorter travel distance, and lower crime rates in major cities. However, 'safer' doesn't mean 'easier academics' or 'guaranteed India-return success.' Medical education quality, clinical training rigor, and FMGE outcomes depend on specific university selection rather than country choice. Vietnam requires equal academic seriousness as Russia despite more comfortable living conditions.",
  },
];

export default function VietnamDisadvantagesPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Disadvantages of Studying MBBS in Vietnam for Indian Students",
      description:
        "An honest 2026 guide to the disadvantages of studying MBBS in Vietnam for Indian students, including university variation, clinical-language reality, and shortlist quality.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Disadvantages of Studying MBBS in Vietnam",
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Honest assessment for 2026
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Disadvantages of studying MBBS in Vietnam for Indian students
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            Vietnam offers real advantages: warmer climate, closer proximity, and lower costs. But marketing it as universally "easier" than Russia can obscure critical challenges around university quality variation, clinical language barriers, and the need for sharper shortlist verification.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/mbbs-in-vietnam"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              Read full Vietnam guide
            </Link>
            <CounsellingDialog
              triggerContent={<>Get honest Vietnam assessment</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need realistic Vietnam university guidance?"
              description="Our team will help you identify which Vietnam universities offer genuine quality and which ones to avoid, based on clinical training, FMGE support, and actual student outcomes."
              ctaVariant="vietnam-disadvantages-hero"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Disadvantages of studying MBBS in Vietnam"
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
              Key challenges
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What families actually need to know about Vietnam MBBS
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
            Real disadvantages Indian students should understand
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            These aren't reasons to avoid Vietnam entirely - they're verification checkpoints to ensure you choose the right university within Vietnam rather than selecting based on country comfort alone.
          </p>

          <div className="mt-10 space-y-8">
            {disadvantages.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="border-b border-border bg-muted/30 px-6 py-4 sm:px-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                      {idx + 1}. {item.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.severity} Severity
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      Impact: {item.impact}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 p-6 sm:p-8">
                  <p className="text-base leading-7 text-foreground">
                    {item.details}
                  </p>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-green-900">
                          How to mitigate
                        </p>
                        <p className="mt-1 text-sm leading-6 text-green-800">
                          {item.mitigation}
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
            Practical mitigation strategies
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Students who succeed in Vietnam MBBS programs take proactive steps to address these disadvantages rather than hoping they won't matter.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {mitigationStrategies.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-display text-sm font-bold text-accent">
                    {idx + 1}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.strategy}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Student profiles that should reconsider Vietnam
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Vietnam can be excellent for many students, but certain profiles may find better fit with alternative destinations based on their specific priorities and constraints.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {whoShouldReconsider.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-orange-200 bg-orange-50 p-6"
              >
                <h3 className="font-display text-lg font-semibold text-orange-900">
                  {item.profile}
                </h3>
                <p className="mt-3 text-sm leading-6 text-orange-800">
                  {item.reason}
                </p>
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
            Need help building a quality-focused Vietnam shortlist?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Our team can help you identify which Vietnam universities offer genuine quality medical education with proper clinical training, FMGE preparation, and India-return support - and which ones to avoid despite lower fees or aggressive marketing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Get expert Vietnam shortlist</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Vietnam university quality assessment"
              description="Share your budget, academic profile, and priorities. We'll help you shortlist Vietnam universities based on verified teaching quality, clinical training facilities, and actual FMGE outcomes rather than marketing claims."
              ctaVariant="vietnam-disadvantages-bottom"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Disadvantages of studying MBBS in Vietnam - bottom CTA"
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
