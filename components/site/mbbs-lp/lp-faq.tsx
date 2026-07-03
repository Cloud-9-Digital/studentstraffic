"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { CountryLpFaq } from "./types";

type Props = {
  faqs: CountryLpFaq[];
};

export function LpFaq({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            Common questions
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            Questions every student and parent asks before deciding.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <ChevronDown
                  className="mt-0.5 size-4 shrink-0 text-gray-400 transition-transform"
                  style={{ transform: open === i ? "rotate(180deg)" : "none" }}
                />
              </button>
              {open === i && (
                <div className="border-t border-gray-50 px-5 pb-4 pt-3">
                  <p className="text-sm leading-7 text-gray-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
