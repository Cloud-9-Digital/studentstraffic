import { X, CheckCircle2 } from "lucide-react";

import { LpDialogTrigger } from "./lp-dialog-trigger";

const comparison = [
  { aspect: "Total cost for 6 years", india: "₹70L to 1.5 Cr (private college)", abroad: "₹18L to 55L total", abroad_wins: true },
  { aspect: "NEET score needed", india: "550+ for govt seat", abroad: "Qualifying marks enough", abroad_wins: true },
  { aspect: "Seat availability", india: "Very limited. 20 lakh students, 1 lakh seats", abroad: "Seats available across multiple universities", abroad_wins: true },
  { aspect: "Hostel and living cost", india: "₹3L to 6L per year", abroad: "₹1.5L to 3L per year", abroad_wins: true },
  { aspect: "Language of study", india: "English", abroad: "English (all listed universities)", abroad_wins: false },
  { aspect: "NMC recognition", india: "Automatic", abroad: "All our listed universities are NMC recognized", abroad_wins: false },
  { aspect: "Exam to practice in India", india: "Not required", abroad: "FMGE / NExT exam required after return", abroad_wins: false },
];

export function LpWhyAbroad() {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            Why MBBS abroad makes sense
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            For most students who did not get a government seat, MBBS abroad is
            the smarter choice. Lower cost, good quality, and NMC recognized.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-3 bg-[#0f3d37] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/70">
            <span>Factor</span>
            <span className="text-center">Private MBBS India</span>
            <span className="text-center" style={{ color: "#F5A623" }}>MBBS Abroad</span>
          </div>
          {comparison.map((row, i) => (
            <div
              key={row.aspect}
              className="grid grid-cols-3 items-start gap-3 border-b border-gray-50 px-5 py-4 text-sm last:border-0"
              style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}
            >
              <span className="font-medium text-gray-800">{row.aspect}</span>
              <div className="flex items-start justify-center gap-1.5">
                {!row.abroad_wins ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" /> : <X className="mt-0.5 size-3.5 shrink-0 text-red-400" />}
                <span className="text-center text-xs leading-5 text-gray-500">{row.india}</span>
              </div>
              <div className="flex items-start justify-center gap-1.5">
                {row.abroad_wins ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" /> : <X className="mt-0.5 size-3.5 shrink-0 text-red-400" />}
                <span className="text-center text-xs leading-5 font-medium text-gray-700">{row.abroad}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <LpDialogTrigger
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: "#c2410c" } as React.CSSProperties}
          >
            I want to study MBBS abroad. Call me.
          </LpDialogTrigger>
        </div>
      </div>
    </section>
  );
}
