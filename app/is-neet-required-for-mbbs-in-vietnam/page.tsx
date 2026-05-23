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

const pagePath = "/is-neet-required-for-mbbs-in-vietnam";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "Yes, NEET is mandatory for Indian students pursuing MBBS in Vietnam who want medical registration in India. The National Medical Commission (NMC) mandates NEET qualification for all Indian citizens and OCIs studying medicine abroad from the 2019-20 academic year onwards, regardless of destination country.",
  "Vietnamese universities accept qualifying NEET scores (50th percentile for General category, 40th percentile for SC/ST/OBC). Unlike Indian medical colleges requiring 600+ NEET scores, Vietnam primarily evaluates Class 12 marks (minimum 50% PCB aggregate) and doesn't use NEET for competitive merit ranking.",
  "The 'MBBS in Vietnam without NEET' marketing is technically possible for university admission but creates India-return complications. Without valid NEET qualification, graduates cannot appear for FMGE/NExT screening or obtain NMC medical registration, making the degree unusable for Indian practice despite costing ₹28-40 lakhs over 6 years.",
];

const neetRequirementScenarios = [
  {
    scenario: "Indian citizen wanting to practice in India",
    neetRequired: "Yes (Mandatory)",
    minimumScore: "50th percentile (General), 40th percentile (Reserved)",
    validity: "3 years from result date",
    consequences: "Without NEET: Cannot register with NMC, cannot practice in India",
  },
  {
    scenario: "OCI (Overseas Citizen of India)",
    neetRequired: "Yes (Mandatory)",
    minimumScore: "Same as Indian citizens",
    validity: "3 years from result date",
    consequences: "Same restrictions as Indian citizens without NEET",
  },
  {
    scenario: "Foreign national (non-Indian passport)",
    neetRequired: "No",
    minimumScore: "Not applicable",
    validity: "N/A",
    consequences: "Can practice abroad; India practice requires FMGE/screening regardless",
  },
  {
    scenario: "Indian student planning to settle abroad permanently",
    neetRequired: "Technically no, but highly recommended",
    minimumScore: "50th percentile (safest approach)",
    validity: "3 years",
    consequences: "Closes India career option permanently if skipped",
  },
];

const mythVsReality = [
  {
    myth: "Vietnam doesn't require NEET, so Indian students don't need it",
    reality: "Vietnamese universities may admit without NEET, but NMC mandates NEET for India-return medical registration. University admission ≠ India practice permission.",
    riskLevel: "Critical",
  },
  {
    myth: "I can skip NEET now and take it after Vietnam graduation",
    reality: "NEET must be valid at admission time. Post-graduation NEET qualification doesn't retroactively enable NMC registration for degrees obtained without initial NEET compliance.",
    riskLevel: "Critical",
  },
  {
    myth: "Any low NEET score is useless for Vietnam",
    reality: "Qualifying NEET score (50th/40th percentile) is sufficient. Vietnam evaluates Class 12 marks primarily; NEET serves regulatory compliance, not admission competition.",
    riskLevel: "Low",
  },
  {
    myth: "Vietnamese MBBS degree is valid in India regardless of NEET",
    reality: "Degree recognition (NMC-approved university) and practice permission (NEET + FMGE clearance) are separate requirements. Both are mandatory for India medical registration.",
    riskLevel: "High",
  },
];

const verificationChecklist = [
  {
    item: "NEET validity period",
    whatToCheck: "Ensure NEET result is less than 3 years old from intended admission date. Result dated June 2024 valid until June 2027 admission cycles.",
  },
  {
    item: "NMC eligibility criteria",
    whatToCheck: "Verify university appears on NMC's approved foreign medical institutions list. Check current regulations at nmc.org.in before payment.",
  },
  {
    item: "Consultant misleading claims",
    whatToCheck: "If told 'NEET not required', ask specifically: 'Will I be able to register with NMC and practice in India without NEET?' Demand written clarification.",
  },
  {
    item: "Class 12 requirements",
    whatToCheck: "Minimum 50% aggregate in Physics, Chemistry, Biology (40% for SC/ST in some universities). Vietnamese admission primarily depends on this, not NEET score.",
  },
  {
    item: "Long-term career plans",
    whatToCheck: "Decide now if India practice is a possibility. Keeping options open requires NEET compliance upfront; cannot be added retroactively.",
  },
];

const faqItems = [
  {
    question: "Is NEET required for MBBS in Vietnam for Indian students?",
    answer:
      "Yes, if the student wants to preserve the option of registration and practice in India later. NMC mandates NEET qualification for all Indian citizens and OCIs pursuing medicine abroad from 2019-20 onwards. Vietnamese universities may admit without using NEET for selection, but this doesn't override NMC's India-return eligibility requirements.",
  },
  {
    question: "Can I study MBBS in Vietnam without NEET?",
    answer:
      "A Vietnamese university may technically admit you without NEET, but this creates critical India-return complications. Without valid NEET qualification at the time of admission, you cannot appear for FMGE/NExT screening exams or obtain NMC medical registration to practice in India, effectively making the ₹28-40 lakh degree investment unusable for Indian medical practice despite being a valid WHO-recognized qualification.",
  },
  {
    question: "How much NEET score is required for MBBS in Vietnam?",
    answer:
      "Qualifying NEET score is sufficient: 50th percentile for General category (typically 600-650 marks), 40th percentile for SC/ST/OBC categories (typically 550-600 marks). Unlike Indian medical colleges requiring 600+ scores for competitive admission, Vietnamese universities primarily evaluate Class 12 PCB marks (minimum 50% aggregate) and don't use NEET for merit ranking. NEET serves as regulatory compliance for India-return pathway, not admission competition.",
  },
  {
    question: "Is NEET enough on its own for MBBS in Vietnam admission?",
    answer:
      "No. NEET qualification protects your India-return pathway but doesn't guarantee Vietnamese university admission. Students must also satisfy: Class 12 science background with 50% PCB minimum, valid passport, academic transcripts, medical fitness certificates, visa documentation, and university-specific admission requirements. NEET is a mandatory eligibility criterion for India-return, not a sufficient admission guarantee.",
  },
  {
    question: "What happens if my NEET score is low but above the qualifying percentile?",
    answer:
      "Low qualifying NEET scores (just above 50th/40th percentile) are perfectly acceptable for Vietnam. Families often worry unnecessarily because they compare with Indian MBBS cutoffs (600-720). Vietnamese universities focus on Class 12 academic profile, English proficiency, and overall fit rather than NEET ranking. A 550-mark NEET score with 75% Class 12 marks is often better positioned for quality Vietnamese universities than a 650-mark NEET score with 55% Class 12 marks.",
  },
];

export default function VietnamNeetRequirementPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Is NEET Required for MBBS in Vietnam?",
      description:
        "A 2026 guide to whether NEET is required for MBBS in Vietnam, including the India-return pathway, the without-NEET myth, and score expectations.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Is NEET Required for MBBS in Vietnam?",
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
            Updated for 2026 NMC regulations
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Is NEET required for MBBS in Vietnam?
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            The direct answer: <strong className="text-foreground">Yes, for Indian students who want medical registration in India.</strong> Vietnamese universities may admit without using NEET for merit ranking, but NMC mandates NEET qualification for the India-return pathway.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/mbbs-in-vietnam"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              Read full Vietnam guide
            </Link>
            <CounsellingDialog
              triggerContent={<>Get NEET eligibility clarity</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need clarity on Vietnam NEET requirements?"
              description="Our team will help you understand NEET compliance, score requirements, and India-return implications for Vietnam MBBS."
              ctaVariant="neet-vietnam-hero"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Is NEET required for MBBS in Vietnam"
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
              Key facts
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What Indian families must know about NEET and Vietnam
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
            NEET requirements by student profile
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Whether NEET is required depends on your citizenship status and career plans. This table shows exactly what applies to different student profiles.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Student Profile
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      NEET Required?
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Minimum Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Validity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Without NEET
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {neetRequirementScenarios.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.scenario}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            row.neetRequired.includes("Yes")
                              ? "bg-red-100 text-red-700"
                              : row.neetRequired.includes("recommended")
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {row.neetRequired}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.minimumScore}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.validity}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.consequences}
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
                  Critical for Indian students
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  If there's any possibility you might want to practice medicine in India in the future, treat NEET as mandatory. The decision to skip NEET is irreversible and permanently closes the India-return pathway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            MBBS in Vietnam without NEET: separating myth from reality
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Many consultants market Vietnam as a "without NEET" destination. Here's what families need to understand about each common myth and its India-return implications.
          </p>

          <div className="mt-10 space-y-6">
            {mythVsReality.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-start gap-6 p-6 sm:p-8">
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        item.riskLevel === "Critical"
                          ? "bg-red-100 text-red-600"
                          : item.riskLevel === "High"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.riskLevel === "Critical" ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : item.riskLevel === "Low" ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.riskLevel === "Critical"
                            ? "bg-red-100 text-red-700"
                            : item.riskLevel === "High"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.riskLevel} Risk
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
            Pre-admission verification checklist
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Before paying any Vietnam admission fees, verify these critical points to avoid costly mistakes that close your India-return pathway.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {verificationChecklist.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 font-display text-sm font-bold text-accent">
                    {idx + 1}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.item}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.whatToCheck}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-accent/5 to-background p-8">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Ask your consultant directly
            </h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              If a consultant claims you can study MBBS in Vietnam without NEET, ask them to put this in writing:{" "}
              <strong className="text-foreground">
                "Will I be able to register with the National Medical Commission and practice medicine in India after graduation if I don't have valid NEET qualification at the time of admission?"
              </strong>
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              If they cannot provide a clear written guarantee backed by NMC regulations, that's your answer.
            </p>
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
            Need clarity on Vietnam NEET requirements for your profile?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Our team can help you understand NEET compliance, score adequacy, NMC eligibility verification, and the right Vietnam university shortlist based on your actual profile.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Get personalized NEET guidance</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Vietnam NEET eligibility consultation"
              description="Share your NEET score, Class 12 marks, and career plans. We'll help you understand whether Vietnam remains viable and which universities match your profile."
              ctaVariant="neet-vietnam-bottom"
              courseSlug="mbbs"
              countrySlug="vietnam"
              notes="Interest: Is NEET required for MBBS in Vietnam - bottom CTA"
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
