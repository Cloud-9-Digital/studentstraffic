"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is MBBS abroad valid in India?",
    a: "Yes. If the university is NMC-recognized, your degree is valid in India. After returning, you need to pass the FMGE exam to practice here. NExT will replace FMGE in the future. All universities we recommend are NMC-recognized.",
  },
  {
    q: "My NEET score is low. Can I still get admission?",
    a: "Yes. Most MBBS universities abroad accept students with NEET qualifying marks (150+). You do not need 550+ like government colleges in India. Call us and we will tell you exactly which universities will take your score.",
  },
  {
    q: "How much does MBBS abroad cost in total?",
    a: "Total cost for 6 years including tuition, hostel, and food ranges from 18 lakhs (Kyrgyzstan) to 55 lakhs (Philippines). This is much less than private MBBS in India which can go up to 1.5 crores. Call us and we will give you a full cost breakdown.",
  },
  {
    q: "What is the FMGE exam?",
    a: "FMGE (Foreign Medical Graduate Examination) is a government exam you have to pass after returning from MBBS abroad. You need to clear this exam to get your license to practice medicine in India. NExT will replace FMGE in the future. Our team helps you understand how to prepare for it.",
  },
  {
    q: "Is it safe to study in Russia or Kyrgyzstan?",
    a: "Yes. There are large Indian student communities in both countries. Students have been going to Russia for MBBS since the 1990s. Kyrgyzstan has become a popular destination in the last 10 years. We connect you with current students so you can ask them directly.",
  },
  {
    q: "Do I need to know the local language?",
    a: "No. All the universities we recommend teach MBBS fully in English. For clinical rounds, you may need basic local language, but the full academic program is in English.",
  },
  {
    q: "Is the counselling call free?",
    a: "The counselling call is free. We are paid by universities when a student enrolls through us. This does not affect which university we recommend. We always recommend what is right for your score and budget.",
  },
  {
    q: "When should I apply for 2026 admission?",
    a: "Most universities have intake in September and October. Applications start from March onwards. The earlier you apply, the better your chance of getting your preferred university. Call us now to start.",
  },
];

export function LpFaq() {
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
          {FAQS.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
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
