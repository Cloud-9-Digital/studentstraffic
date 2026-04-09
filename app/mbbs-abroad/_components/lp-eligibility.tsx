import { CheckCircle2, AlertCircle } from "lucide-react";

import { LpDialogTrigger } from "./lp-dialog-trigger";

const criteria = [
  { label: "NEET Score", value: "Minimum qualifying score (150+)", note: "You don't need a high score. Just a valid NEET qualifying mark is enough for most universities abroad." },
  { label: "Age", value: "17 years by Dec 31 of admission year", note: "You must be at least 17 years old by December 31 of the year you are applying." },
  { label: "Class 12 Marks", value: "Minimum 60% in PCB", note: "Physics, Chemistry, and Biology combined should be 60% or more." },
  { label: "Subjects in 12th", value: "Physics, Chemistry, Biology and English", note: "All four subjects are mandatory. No exceptions." },
  { label: "NEET Exam", value: "Mandatory as per NMC rules", note: "NEET is compulsory for all Indian students wanting to study MBBS abroad. No NEET means no admission." },
];

const documents = [
  "Class 10 and 12 mark sheets and certificates",
  "NEET scorecard",
  "Valid passport (2+ years validity)",
  "Passport-size photos (12 copies)",
  "Medical fitness certificate",

  "Birth certificate",
];

export function LpEligibility() {
  return (
    <section id="eligibility" className="border-t py-16 md:py-20" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#F8F9FB" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            Am I eligible?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            Most students who have passed NEET are eligible. Here is what you need.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-3">
            {criteria.map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-xl border bg-white p-4" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-green-500" />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#0f3d37" }}>
                    {c.label}: <span className="font-semibold text-gray-700">{c.value}</span>
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">{c.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
              <h3 className="font-display text-xl font-semibold" style={{ color: "#0f3d37" }}>Documents you need</h3>
              <ul className="mt-4 space-y-2">
                {documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gray-300" />
                    <span className="text-sm text-gray-600">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 text-white" style={{ background: "#0f3d37" }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#F5A623]" />
                <div>
                  <p className="font-semibold">About the FMGE / NExT Exam</p>
                  <p className="mt-2 text-xs leading-6 text-white/60">
                    After finishing MBBS abroad, you must pass the FMGE exam
                    to get your license to practice in India. NExT will replace
                    FMGE in the future. Our team helps you understand this too.
                  </p>
                </div>
              </div>
              <LpDialogTrigger
                className="mt-5 flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold transition hover:opacity-90"
                style={{ background: "#F5A623", color: "#071428" } as React.CSSProperties}
              >
                Check My Eligibility
              </LpDialogTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
