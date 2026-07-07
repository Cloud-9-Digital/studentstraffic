import type { Metadata } from "next";

import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { buildIndexableMetadata } from "@/lib/metadata";

import { CtaBanner } from "./_components/cta-banner";

export const metadata: Metadata = buildIndexableMetadata({
  title: "NEET College Predictor 2026 - MBBS/BDS College Guidance by Rank & Score",
  description:
    "Share your NEET 2026 score, category, and home state and our counselling team will help you shortlist realistic MBBS/BDS college options across All India Quota and State Quota counselling.",
  path: "/neet-college-predictor",
  keywords: [
    "NEET college predictor 2026",
    "NEET rank predictor",
    "MBBS college predictor",
    "NEET counselling predictor",
    "NEET state quota predictor",
    "All India Quota predictor",
    "predict NEET colleges by rank",
    "NEET admission predictor",
    "free NEET predictor",
    "NEET college finder",
    "BDS college predictor",
    "government medical college predictor",
    "private medical college predictor",
  ],
});

const howItWorks = [
  {
    title: "Share your NEET details",
    description: "Tell us your NEET 2026 score, category (General, OBC, SC, ST), home state, and gender.",
  },
  {
    title: "Our counsellors review your profile",
    description: "We compare your score against recent-year MCC AIQ and state quota cutoff trends to gauge where you realistically stand.",
  },
  {
    title: "Get a shortlist you can act on",
    description: "We share a realistic MBBS/BDS college shortlist for your category, quota, and state counselling path, with guidance on next steps.",
  },
];

const whatYouGet = [
  {
    title: "Government & private college options",
    description: "Government colleges, private medical colleges, deemed universities, and central institutions across MBBS and BDS.",
  },
  {
    title: "AIQ & State Quota guidance",
    description: "Separate guidance for All India Quota (15% seats via MCC) and your home State Quota (85% seats) counselling rounds.",
  },
  {
    title: "Category-aware shortlisting",
    description: "Guidance based on your category (General, EWS, OBC-NCL, SC, ST) using recent-year opening and closing rank trends.",
  },
];

const faqs = [
  {
    q: "How accurate is this NEET College Predictor?",
    a: "We use recent-year MCC AIQ and state counselling cutoff trends as a guide, reviewed by our counselling team rather than an automated algorithm. Cutoffs shift every year with exam difficulty and seat matrix changes, so treat the shortlist as realistic directional guidance, not a guaranteed admission outcome.",
  },
  {
    q: "What is the difference between AIQ and State Quota in NEET counselling?",
    a: "All India Quota (AIQ) is 15% of total MBBS/BDS seats managed by MCC, open to students from any state. State Quota is 85% of seats reserved for state domicile candidates, usually with different cutoffs. We factor in both when reviewing your profile.",
  },
  {
    q: "Can I get guidance for both MBBS and BDS colleges?",
    a: "Yes. Our team reviews options across government colleges, private medical colleges, deemed universities, and central institutions for both MBBS and BDS programs based on your NEET profile.",
  },
  {
    q: "Does this work for all categories (SC, ST, OBC)?",
    a: "Yes. We factor in category-specific cutoff trends for General, EWS, OBC-NCL, SC, ST, and PwD when reviewing your profile and shortlisting options.",
  },
  {
    q: "When will I hear back after submitting my details?",
    a: "Once you submit your details, our counselling team reviews your profile and follows up with a shortlist and guidance based on your category, quota, state, and admission chances.",
  },
  {
    q: "Is this free?",
    a: "Yes, completely free with no hidden charges. We believe every NEET aspirant deserves access to honest counselling guidance for MBBS/BDS admissions planning.",
  },
] as const;

export default function NeetCollegePredictorPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-orange-50 px-6 py-12 sm:px-8 md:py-20 lg:px-12 xl:px-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-24">
            {/* Left Column - Content */}
            <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
              <h1 className="font-display text-5xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                NEET College Predictor 2026
              </h1>

              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                Share your NEET score and our counselling team will help you shortlist realistic MBBS/BDS college options across AIQ and State Quota counselling.
              </p>
            </div>

            {/* Right Column - Form */}
            <div className="flex flex-col justify-center">
              <DeferredLeadForm
                sourcePath="/neet-college-predictor"
                ctaVariant="neet_predictor_waitlist"
                title="Get your college shortlist"
                description="Takes 30 seconds. Share your details and our team will follow up with a realistic college shortlist."
                submitLabel="Send Me My College Shortlist"
                emailRequired
                notes="NEET college predictor submission. Show confirmation that predicted colleges will be sent by email later; no email automation wired yet."
                stacked
                hidePlaceholders
                showNeetCategory
                lockPhoneToIndia
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b border-gray-200 bg-white px-6 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              How Our NEET College Predictor Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              Realistic MBBS/BDS college guidance in 3 simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 font-display text-xl font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Receive Section */}
      <section className="bg-white px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              What Your NEET Counselling Guidance Covers
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {whatYouGet.map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            NEET College Predictor 2026 - Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <h3 className="font-semibold text-gray-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Ready to See Where You Stand?
          </h2>
          <p className="mt-4 text-base text-emerald-50 sm:text-lg">
            It takes 30 seconds. Our counselling team reviews your profile and gets back to you personally.
          </p>
          <CtaBanner />
        </div>
      </section>
    </>
  );
}
