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

const pagePath = "/is-mbbs-in-vietnam-valid-in-india";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "Yes, MBBS degrees from Vietnamese universities meeting NMC guidelines are valid in India for medical practice - but 'valid' requires meeting three criteria: (1) University meets NMC's FMGL guidelines, (2) NEET qualification at admission (mandatory from 2019-20), and (3) passing FMGE/NExT screening exam (15-25% pass rate for foreign graduates vs 65-75% for Indian MBBS).",
  "Key Vietnamese medical universities with NMC guideline compliance include Hanoi Medical University (established 1902), Hue University of Medicine and Pharmacy (1957), Pham Ngoc Thach University of Medicine (1947), and University of Medicine and Pharmacy at Ho Chi Minh City (1947). Always verify current listing at nmc.org.in before admission as recognition status can change.",
  "India practice timeline: 6 years Vietnam MBBS + 1 year internship + 6-12 months FMGE preparation + 2-3 attempts average = 8-9 years total to Indian medical registration vs 5.5-6 years for Indian MBBS graduates. Students who join through Students Traffic receive free FMGE/NExT coaching — the typical ₹1.5-2.5 lakh coaching cost is covered.",
];

const whatValidityActuallyMeans = [
  {
    component: "University recognition",
    requirement: "Must meet NMC's FMGL guidelines for graduate NExT eligibility",
    verification: "Verify through the NMC Eligibility Certificate process at nmc.org.in — NMC will only issue the certificate for universities meeting current guidelines.",
    critical: true,
  },
  {
    component: "NEET compliance",
    requirement: "Student must have valid NEET qualification (within 3 years of admission)",
    verification: "Qualifying percentile: 50th for General, 40th for SC/ST/OBC. NEET must be valid at time of Vietnam admission, cannot be added retrospectively.",
    critical: true,
  },
  {
    component: "Degree duration & structure",
    requirement: "Minimum 54 months (4.5 years) of structured medical education + internship",
    verification: "Confirm degree includes adequate clinical rotations in Years 4-6. Some newer Vietnamese programs may lack sufficient hospital partnerships.",
    critical: true,
  },
  {
    component: "FMGE/NExT screening exam",
    requirement: "Pass Foreign Medical Graduate Examination or National Exit Test to obtain practice license",
    verification: "15-25% pass rate for foreign graduates (first attempt). Budget 6-12 months dedicated preparation. Students Traffic provides free FMGE/NExT coaching for students who join through us.",
    critical: true,
  },
  {
    component: "Internship completion",
    requirement: "Complete 1-year rotating internship as per university and NMC requirements",
    verification: "Confirm whether Vietnam internship counts fully toward NMC requirements or if additional India internship needed (varies by university).",
    critical: false,
  },
];

const validityVsRecognition = {
  recognition: {
    what: "University appears on NMC/WDOMS lists",
    means: "Degree is recognized as legitimate medical qualification",
    doesNotMean: "Automatic license to practice in India without screening exam",
  },
  validity: {
    what: "Complete pathway from admission to India medical registration",
    means: "NEET compliance + meeting NMC guidelines university + FMGE pass + internship = India practice permission",
    doesNotMean: "Just having a degree certificate is sufficient for medical practice",
  },
};

const verificationChecklist = [
  {
    step: "NMC guideline compliance confirmed",
    action: "We verify the exact institution meets NMC's FMGL guidelines — not assuming country-level approval or relying on a consultant's claim.",
    why: "NMC guideline compliance is institution-specific. A university not on the list produces a degree that cannot be used for India medical registration.",
  },
  {
    step: "NEET compliance confirmed",
    action: "We confirm a valid NEET scorecard exists before processing any admission. NEET compliance must be in place before enrolment — it cannot be added retroactively.",
    why: "Without valid NEET qualification at the time of admission, NExT eligibility and NMC registration are both blocked regardless of the degree's other merits.",
  },
  {
    step: "Degree structure verified",
    action: "We obtain the official curriculum confirming the 6-year programme structure and verify that clinical rotations run at the university's own teaching hospitals — not external facilities.",
    why: "Some newer Vietnamese private universities lack adequate clinical infrastructure. This directly affects NExT preparation and actual clinical competence.",
  },
  {
    step: "NExT outcomes assessed",
    action: "We assess cohort-level NExT/FMGE outcomes for Vietnamese graduates from that institution — not aggregate foreign graduate statistics — as part of university shortlisting.",
    why: "Pass rates are the practical test of a degree's utility for India practice. We factor this into every recommendation we make.",
  },
  {
    step: "Full timeline modelled",
    action: "We present families with a realistic 8–9 year timeline to India registration (6 years MBBS + 1 year internship + NExT preparation and attempts) — not just the headline 6-year tuition figure.",
    why: "Families who compare only tuition costs routinely underestimate the total commitment. We model the full picture before admission is confirmed.",
  },
];

const commonMisconceptions = [
  {
    myth: "'Vietnam is NMC-approved' means all universities are valid",
    reality: "NMC guideline compliance is institution-specific, not country-wide. Verify each institution individually through the NMC Eligibility Certificate process.",
    risk: "High",
  },
  {
    myth: "WDOMS listing is sufficient proof of validity",
    reality: "WDOMS (World Directory of Medical Schools) is a WHO database of existing medical schools. Listing indicates the school exists, not that graduates can practice in India without screening exams.",
    risk: "Medium",
  },
  {
    myth: "Newer universities offer easier admission and equivalent validity",
    reality: "Established universities (Hanoi Medical 1902, Hue 1957) typically have better clinical infrastructure and FMGE preparation than institutions founded 2010-2018, despite equivalent 'NMC guideline compliance' status.",
    risk: "High",
  },
  {
    myth: "FMGE is a formality after 6-year MBBS",
    reality: "FMGE has 15-25% pass rate for foreign graduates. It's a rigorous exam requiring 6-12 months dedicated preparation and often 2-3 attempts. Students Traffic provides free FMGE/NExT coaching for students who join through us.",
    risk: "Critical",
  },
];

const faqItems = [
  {
    question: "Is MBBS in Vietnam valid in India for Indian students in 2026?",
    answer:
      "Yes, when three conditions are met: (1) University meets NMC's FMGL guidelines (verified through the Eligibility Certificate process at nmc.org.in), (2) Student had valid NEET qualification at admission time (within 3 years of result date), and (3) Graduate passes FMGE/NExT screening exam (15-25% pass rate). 'Valid' means recognized degree pathway, not automatic practice permission. Budget 8-9 years total (6 years MBBS + 1 year internship + 1-2 years FMGE preparation/attempts) vs 5.5-6 years for Indian MBBS.",
  },
  {
    question: "Which Vietnamese universities are NMC-approved for Indian students?",
    answer:
      "Key Vietnamese medical universities meeting NMC guidelines include Hanoi Medical University (est. 1902), Hue University of Medicine and Pharmacy (1957), Pham Ngoc Thach University of Medicine (1947), and University of Medicine and Pharmacy at Ho Chi Minh City (1947). Verify each institution through the NMC Eligibility Certificate process at nmc.org.in — compliance is institution-specific.",
  },
  {
    question: "Does WDOMS listing mean MBBS in Vietnam is valid in India?",
    answer:
      "No. WDOMS (World Directory of Medical Schools) is a WHO database confirming the medical school exists globally. WDOMS listing does NOT mean: (1) graduates can practice in India without FMGE, (2) the university meets NMC's FMGL guidelines, or (3) the degree pathway satisfies India medical council requirements. WDOMS is a necessary baseline but not sufficient — NMC guideline compliance is verified separately through the Eligibility Certificate process.",
  },
  {
    question: "What is the complete India practice pathway for Vietnam MBBS graduates?",
    answer:
      "Complete pathway: (1) Obtain NEET qualification before Vietnam admission, (2) Complete 6-year MBBS from a Vietnamese university meeting NMC guidelines, (3) Finish 1-year rotating internship, (4) Prepare for FMGE (6-12 months — free for Students Traffic students), (5) Pass FMGE exam (typically 2-3 attempts, 15-25% pass rate), (6) Complete medical registration with State Medical Council, (7) Eligible for residency or practice. Total timeline: 8-9 years vs 5.5-6 years for Indian MBBS graduates.",
  },
  {
    question: "Can I make my Vietnam MBBS 'valid' by taking NEET after graduation?",
    answer:
      "No. NEET qualification is required at the time of Vietnam admission (from 2019-20 academic year onwards). Taking NEET after completing MBBS does not retroactively satisfy NMC's foreign medical graduate eligibility requirements. Students who took admission without valid NEET face permanent India practice barriers regardless of later NEET attempts. NEET must be within 3 years validity from admission date - plan Vietnam admission within your NEET qualification window.",
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
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Updated for 2026 NMC regulations
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Is MBBS in Vietnam valid in India?
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            The direct answer: <strong className="text-foreground">Yes, from meeting NMC guidelines universities with NEET compliance.</strong> But "validity" requires understanding the full pathway - not just degree recognition, but FMGE clearance and India medical registration.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/medical-colleges-in-vietnam"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              See meeting NMC guidelines universities
            </Link>
            <CounsellingDialog
              triggerContent={<>Get validity verification help</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need Vietnam validity verification?"
              description="Our team will help verify specific university NMC guideline compliance, check NEET compliance, and explain the complete India practice pathway."
              ctaVariant="vietnam-validity-hero"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Is MBBS in Vietnam valid in India"
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
              Critical requirements
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What "valid in India" actually requires
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
            Understanding validity vs recognition
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Many families confuse "university recognition" with "automatic practice permission." Here's what each actually means for India medical practice.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Recognition
              </h3>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">What it is:</p>
                  <p className="mt-1 text-base leading-7 text-foreground">
                    {validityVsRecognition.recognition.what}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">What it means:</p>
                  <p className="mt-1 text-base leading-7 text-foreground">
                    {validityVsRecognition.recognition.means}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">What it does NOT mean:</p>
                  <p className="mt-1 text-base leading-7 text-red-600">
                    {validityVsRecognition.recognition.doesNotMean}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
              <h3 className="font-display text-2xl font-semibold text-green-900">
                Full Validity
              </h3>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-green-700">What it is:</p>
                  <p className="mt-1 text-base leading-7 text-green-900">
                    {validityVsRecognition.validity.what}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">What it means:</p>
                  <p className="mt-1 text-base leading-7 text-green-900">
                    {validityVsRecognition.validity.means}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">What it does NOT mean:</p>
                  <p className="mt-1 text-base leading-7 text-green-800">
                    {validityVsRecognition.validity.doesNotMean}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Five components of India validity
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Verify each component before admission to ensure the complete pathway to India medical practice remains open.
          </p>

          <div className="mt-10 space-y-6">
            {whatValidityActuallyMeans.map((item, idx) => (
              <div
                key={idx}
                className={`overflow-hidden rounded-2xl border ${
                  item.critical
                    ? "border-red-200 bg-red-50"
                    : "border-border bg-card"
                } shadow-sm`}
              >
                <div className={`px-6 py-4 sm:px-8 ${item.critical ? "bg-red-100" : "bg-muted/30"} border-b ${item.critical ? "border-red-200" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.critical ? "bg-red-200 text-red-700" : "bg-accent/10 text-accent"} font-display text-sm font-bold`}>
                      {idx + 1}
                    </div>
                    <h3 className={`font-display text-xl font-semibold ${item.critical ? "text-red-900" : "text-foreground"} sm:text-2xl`}>
                      {item.component}
                    </h3>
                    {item.critical && (
                      <span className="ml-auto rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                        Critical
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="space-y-4">
                    <div>
                      <p className={`text-sm font-semibold ${item.critical ? "text-red-700" : "text-muted-foreground"}`}>
                        Requirement:
                      </p>
                      <p className={`mt-1 text-base leading-7 ${item.critical ? "text-red-900" : "text-foreground"}`}>
                        {item.requirement}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${item.critical ? "text-red-700" : "text-muted-foreground"}`}>
                        How to verify:
                      </p>
                      <p className={`mt-1 text-sm leading-6 ${item.critical ? "text-red-800" : "text-muted-foreground"}`}>
                        {item.verification}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Pre-admission verification checklist
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Complete these verification steps before paying any fees to ensure the Vietnam pathway maintains full India validity.
          </p>

          <div className="mt-10 space-y-6">
            {verificationChecklist.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 font-display text-lg font-bold text-accent">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.step}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      <strong>Action:</strong> {item.action}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      <strong>Why it matters:</strong> {item.why}
                    </p>
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
            Common misconceptions about Vietnam validity
          </h2>

          <div className="mt-10 space-y-6">
            {commonMisconceptions.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-start gap-6 p-6 sm:p-8">
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        item.risk === "Critical"
                          ? "bg-red-100 text-red-600"
                          : item.risk === "High"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.risk === "Critical"
                            ? "bg-red-100 text-red-700"
                            : item.risk === "High"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.risk} Risk
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                      Myth: {item.myth}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      <strong className="text-foreground">Reality:</strong> {item.reality}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
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
            Need help verifying Vietnam university validity?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Our team can help verify specific university NMC guideline compliance, check your NEET compliance status, and explain the complete India practice pathway with realistic timelines and costs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Get validity verification</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Vietnam validity consultation"
              description="Share your shortlisted universities, NEET score, and timeline. We'll verify NMC guideline compliance, assess FMGE preparation requirements, and clarify the complete India registration pathway."
              ctaVariant="vietnam-validity-bottom"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Is MBBS in Vietnam valid in India - bottom CTA"
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
