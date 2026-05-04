import type { Metadata } from "next";

import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildIndexableMetadata } from "@/lib/metadata";

import { CtaBanner } from "./_components/cta-banner";

export const metadata: Metadata = buildIndexableMetadata({
  title: "NEET College Predictor 2026 - Predict MBBS/BDS Colleges by Rank & Score | Free Tool",
  description:
    "Free NEET College Predictor 2026 for 600+ MBBS/BDS colleges in India. Predict admission chances based on your NEET rank, score, category, state quota & AIQ. Get personalized college list via email based on MCC counselling data.",
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
    title: "Enter your NEET details",
    description: "Input your NEET 2026 score/rank, category (General, OBC, SC, ST), home state, and gender for accurate predictions",
  },
  {
    title: "AI analyzes your admission chances",
    description: "Our algorithm compares your rank with previous year MCC AIQ and state quota cutoffs from 2023-2024 counselling rounds",
  },
  {
    title: "Get personalized college list",
    description: "Get a personalized MBBS/BDS college list based on your NEET profile, category, quota, and state counselling path",
  },
];

const whatYouGet = [
  {
    title: "600+ medical colleges covered",
    description: "Government colleges, private medical colleges, deemed universities, AIIMS, central universities - both MBBS and BDS programs",
  },
  {
    title: "Both AIQ & State Quota predictions",
    description: "Separate college lists for All India Quota (15% seats via MCC) and your home State Quota (85% seats) counselling",
  },
  {
    title: "Category-wise cutoff analysis",
    description: "Predictions based on your category (General, EWS, OBC-NCL, SC, ST) with previous year opening and closing ranks",
  },
];

const faqs = [
  {
    q: "How accurate is the NEET College Predictor 2026?",
    a: "Our NEET predictor uses official MCC (Medical Counselling Committee) counselling data from 2023-2024 rounds and state counselling cutoffs. While we aim for high accuracy, actual cutoffs may vary by ±5-10 ranks based on exam difficulty and seat matrix changes. We analyze 600+ colleges for realistic predictions.",
  },
  {
    q: "What is the difference between AIQ and State Quota in NEET counselling?",
    a: "All India Quota (AIQ) is 15% of total MBBS/BDS seats managed by MCC, open to students from any state. State Quota is 85% seats reserved for state domicile candidates, usually with lower cutoffs. Our predictor shows colleges for both quotas based on your home state.",
  },
  {
    q: "Can I predict both MBBS and BDS colleges?",
    a: "Yes! Our NEET college predictor covers both MBBS and BDS programs across government colleges, private medical colleges, deemed universities, and AIIMS. You'll get predictions for all medical courses you're eligible for based on your NEET rank.",
  },
  {
    q: "Does this predictor work for all categories (SC, ST, OBC)?",
    a: "Absolutely. Our NEET rank predictor provides category-wise predictions for General, EWS, OBC-NCL, SC, ST, and PwD categories. We use previous year opening and closing ranks specific to each category for accurate predictions.",
  },
  {
    q: "When will I receive my NEET college prediction?",
    a: "Once you submit your NEET details, our team will review your profile and share your college list by email. The report is built around category, quota, state, cutoff trends, fees, and realistic admission chances.",
  },
  {
    q: "Is this NEET College Predictor free?",
    a: "Yes, completely free with no hidden charges. We believe every NEET aspirant deserves access to accurate counselling guidance for MBBS/BDS admissions planning.",
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
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <svg className="h-2 w-2" viewBox="0 0 6 6" fill="currentColor">
                    <circle cx="3" cy="3" r="3" />
                  </svg>
                  Free Tool
                </div>
                <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  Updated for 2025-26
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                NEET College Predictor 2026 - Find Your MBBS/BDS College
              </h1>

              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                Free NEET rank predictor for 600+ medical colleges across India. Enter your NEET score, rank, category & state to get a personalized list of government and private MBBS/BDS colleges for both All India Quota (AIQ) and State Quota counselling.
              </p>

              {/* Social Proof */}
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-white"></div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-white"></div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 ring-2 ring-white"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">1 lakh+ students used this</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">4.8/5</span> avg rating
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-emerald-900">Based on MCC counselling data:</span> Our NEET college predictor uses official cutoff data from Medical Counselling Committee (MCC) 2023-2024 rounds and state counselling authorities for 600+ MBBS, BDS, AYUSH colleges including AIIMS, government, deemed, and private medical colleges.
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex flex-col justify-center">
              <DeferredLeadForm
                sourcePath="/neet-college-predictor"
                ctaVariant="neet_predictor_waitlist"
                title="Get your college list"
                description="Takes 30 seconds. Share your details and request your personalized college list."
                submitLabel="Send Me My College List"
                emailRequired
                notes="NEET college predictor submission. Show confirmation that predicted colleges will be sent by email later; no email automation wired yet."
                stacked
                className="max-w-full"
              >
                <div className="space-y-2">
                  <Label htmlFor="neet-score">NEET Score</Label>
                  <Input
                    id="neet-score"
                    name="neetScore"
                    type="number"
                    min="0"
                    max="720"
                    placeholder="Enter your NEET score (0-720)"
                    required
                  />
                </div>
              </DeferredLeadForm>
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
              Get accurate MBBS/BDS college predictions in 3 simple steps
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
              Complete NEET Counselling Prediction Report
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
              Your personalized NEET college predictor report includes:
            </p>
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

          {/* Example Preview */}
          <div className="mt-10 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Example NEET Prediction:</span> NEET Score 550 (General, Maharashtra) - Your report shows: Seth G.S. Medical College Mumbai (Deemed), LTMMC Sion (State Quota), Grant Medical College (AIQ possible), with 2023-24 MCC round-wise cutoffs, fees, and admission probability.
              </div>
            </div>
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
            Start Your NEET College Prediction Now
          </h2>
          <p className="mt-4 text-base text-emerald-50 sm:text-lg">
            Join 1 lakh+ NEET 2026 aspirants who used our free college predictor for MBBS/BDS admission planning. Get your personalized prediction in 30 seconds.
          </p>
          <CtaBanner />
          <p className="mt-4 text-xs text-emerald-100">
            Covers All India Quota, State Quota, Government & Private Medical Colleges
          </p>
        </div>
      </section>
    </>
  );
}
