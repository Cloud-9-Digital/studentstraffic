"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

const INTEREST_POINTS = [
  {
    id: "understand-mbbs-abroad",
    label: "Understand everything about MBBS abroad",
    detail: "Countries, fees, NMC recognition, duration — the full picture",
  },
  {
    id: "fmge-difficulty",
    label: "Know how hard FMGE really is and how to clear it",
    detail: "Pass rates, what to study from Year 1, which coaching works",
  },
  {
    id: "clinical-exposure",
    label: "Find out if you'll get real clinical exposure abroad",
    detail: "Hospital training, patient interaction, how it compares to Indian MBBS",
  },
  {
    id: "nmc-registration",
    label: "Learn how NMC registration works after you return",
    detail: "Eligibility, screening test, internship, documentation — step by step",
  },
  {
    id: "costs-loans",
    label: "Get clarity on total costs, loans, and scholarships",
    detail: "Country-wise fee breakdown, education loan options, hidden expenses",
  },
  {
    id: "right-university",
    label: "Pick the right university — not just any NMC-approved one",
    detail: "Infrastructure, faculty, FMGE coaching support on campus",
  },
] as const;

type InterestId = (typeof INTEREST_POINTS)[number]["id"];

export function SeminarInterest() {
  const [selected, setSelected] = useState<Set<InterestId>>(new Set());

  const toggle = (id: InterestId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const count = selected.size;
  const ctaLabel =
    count === 0
      ? "I want answers to all of these"
      : count === 1
        ? "I want an answer to this"
        : `I want answers to these ${count}`;

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-700">
          Is this you?
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
          Tick what you want to walk away knowing
        </h2>
        <p className="mt-3 text-[15px] text-gray-600">
          Select everything that applies — our doctors will cover it all at the seminar.
        </p>

        <div className="mt-8 space-y-2.5">
          {INTEREST_POINTS.map(({ id, label, detail }) => {
            const isChecked = selected.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={[
                  "group w-full rounded-xl border px-5 py-4 text-left transition-all",
                  isChecked
                    ? "border-green-700 bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-green-700/50",
                ].join(" ")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={[
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-all",
                      isChecked
                        ? "border-green-700 bg-green-700"
                        : "border-gray-300 bg-white",
                    ].join(" ")}
                  >
                    {isChecked && (
                      <svg viewBox="0 0 12 12" fill="none" className="size-3" aria-hidden>
                        <path
                          d="M2 6.5 L5 9.5 L10 3"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={["text-[15px] font-semibold leading-snug", isChecked ? "text-gray-900" : "text-gray-700"].join(" ")}>
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-600">{detail}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <SeminarDialogTrigger className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.98]">
            {ctaLabel}
            <ArrowRight className="size-4" />
          </SeminarDialogTrigger>
          <p className="mt-3 text-center text-xs text-gray-500">
            Free entry · No commitment · Honest answers from practising doctors
          </p>
        </div>
      </div>
    </section>
  );
}
