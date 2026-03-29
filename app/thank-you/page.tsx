import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildNoIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildNoIndexMetadata(
  {
    title: "Thank You",
    description: "Your Students Traffic enquiry has been received.",
  },
  {
    canonicalPath: "/thank-you",
  }
);

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <style>{`
        @keyframes ring-pop {
          0%   { transform: scale(0.55); opacity: 0; }
          70%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes check-draw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes step-in {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ty-ring  { animation: ring-pop  0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both; }
        .ty-check { stroke-dasharray: 60; stroke-dashoffset: 60;
                    animation: check-draw 0.45s ease-out 0.65s both; }
        .ty-label { animation: fade-in   0.4s ease-out 0.35s both; }
        .ty-h1    { animation: fade-up   0.65s ease-out 0.5s  both; }
        .ty-sub   { animation: fade-up   0.65s ease-out 0.7s  both; }
        .ty-btns  { animation: fade-up   0.55s ease-out 0.88s both; }
        .ty-steps { animation: fade-up   0.55s ease-out 0.15s both; }
        .ty-s1    { animation: step-in   0.45s ease-out 0.35s both; }
        .ty-s2    { animation: step-in   0.45s ease-out 0.55s both; }
        .ty-s3    { animation: step-in   0.45s ease-out 0.75s both; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface-dark">
        {/* Warm glow from top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(240,138,75,0.14) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container-shell relative z-10 py-24 text-center md:py-32 lg:py-36">
          {/* Animated ring + checkmark */}
          <div className="ty-ring mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
            <svg
              viewBox="0 0 40 40"
              className="h-10 w-10"
              fill="none"
              aria-hidden
            >
              <path
                className="ty-check"
                d="M10 20.5 L17 27.5 L30 13.5"
                stroke="#f08a4b"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Eyebrow */}
          <p className="ty-label mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent/75">
            Enquiry received
          </p>

          {/* Headline */}
          <h1 className="ty-h1 font-display mx-auto max-w-2xl text-5xl leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl">
            You&apos;re in good hands.
          </h1>

          {/* Dynamic subtitle */}
          <Suspense fallback={<DefaultSub />}>
            <DynamicSub searchParams={searchParams} />
          </Suspense>

          {/* Actions */}
          <div className="ty-btns mt-10 flex items-center justify-center">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white! transition-all duration-150 hover:scale-[1.02] hover:bg-accent-strong active:scale-[0.98]"
            >
              Explore universities
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── What happens next ──────────────────────────────────────────────── */}
      <section className="section-space bg-white">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl">
            <p className="ty-steps mb-10 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              What happens next
            </p>

            <div>
              {steps.map((step, i) => {
                const animClass = `ty-s${i + 1}` as "ty-s1" | "ty-s2" | "ty-s3";
                return (
                  <div
                    key={step.title}
                    className={`${animClass} relative flex gap-6 pb-10`}
                  >
                    {/* Connector line */}
                    {i < steps.length - 1 && (
                      <div
                        aria-hidden
                        className="absolute bottom-0 left-[19px] top-10 w-px bg-border"
                      />
                    )}

                    {/* Step number */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/8 text-sm font-semibold text-accent">
                      {i + 1}
                    </div>

                    {/* Content */}
                    <div className="pt-2">
                      <h3 className="mb-1 text-base font-semibold text-primary">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Data ──────────────────────────────────────────────────────────────────── */

const steps = [
  {
    title: "Keep an eye on your phone",
    description:
      "If we need to follow up on your request, we'll use the contact details you just shared.",
  },
  {
    title: "Save your shortlist",
    description:
      "It helps to keep your preferred universities, course goals, and questions ready for the next conversation.",
  },
  {
    title: "Keep exploring",
    description:
      "You can keep comparing universities, countries, and guides while you wait for the next update.",
  },
] as const;

/* ── Sub-components ────────────────────────────────────────────────────────── */

async function DynamicSub({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const interest = Array.isArray(params.interest)
    ? params.interest[0]
    : params.interest;

  return (
    <p className="ty-sub mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/55">
      {interest
        ? `Our team will be in touch soon about ${interest}.`
        : "Our team will be in touch shortly to walk you through your options."}
    </p>
  );
}

function DefaultSub() {
  return (
    <p className="ty-sub mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/55">
      Our team will be in touch shortly to walk you through your options.
    </p>
  );
}
