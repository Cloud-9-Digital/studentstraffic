"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { BRAND, HAIRLINE } from "./theme";

const FAQS = [
  {
    q: "Is the counselling really free?",
    a: "Yes. No consultation fee, no report fee, and nothing to pay to speak with a counsellor.",
  },
  {
    q: "My NEET score is low. Is it still worth talking to you?",
    a: "That is when the call is worth most. A strong score mostly needs good choice filling; a borderline score needs someone to lay out the real trade-offs between private and deemed colleges, BDS and allied courses, a repeat attempt, and studying abroad — before you spend money on the wrong one.",
  },
  {
    q: "Will you just push me towards studying abroad?",
    a: "No. Abroad is one option we cover, not the default. If an Indian seat is realistic for your score and budget, we will tell you that plainly.",
  },
  {
    q: "Can my parents join the call?",
    a: "Please bring them. The fees, the distance and the six-year commitment are family decisions, and it is far more useful when everyone hears the same answers at once.",
  },
  {
    q: "What should I keep ready?",
    a: "Your NEET scorecard, your category and domicile details, and a rough sense of the budget your family is comfortable with. That is enough for a productive first call.",
  },
];

export function LpFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-20" style={{ background: BRAND.surface }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2
              className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]"
              style={{ color: BRAND.heading }}
            >
              Questions we get asked first
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              If yours is not here, ask it on the call. There is no charge and no obligation
              either way.
            </p>
          </div>

          <div className="divide-y">
            {FAQS.map((faq, i) => (
              <div key={faq.q} style={{ borderColor: HAIRLINE }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-start justify-between gap-4 py-4 text-left"
                >
                  <span
                    className="font-display text-base font-semibold leading-snug"
                    style={{ color: BRAND.green }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="mt-0.5 size-4 shrink-0 transition-transform"
                    style={{
                      color: BRAND.coral,
                      transform: open === i ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>
                {open === i && (
                  <p className="pb-5 pr-8 text-sm leading-6 text-gray-500">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
