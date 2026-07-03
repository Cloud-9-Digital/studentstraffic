import { X, CheckCircle2 } from "lucide-react";

import { LpDialogTrigger } from "./lp-dialog-trigger";
import type { ComparisonRow } from "./types";

type Props = {
  countryName: string;
  whyIntro: string;
  comparisonRows: ComparisonRow[];
};

export function LpWhyCountry({ countryName, whyIntro, comparisonRows }: Props) {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            Why MBBS in {countryName} makes sense
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">{whyIntro}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-3 bg-[#0f3d37] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/70">
            <span>Factor</span>
            <span className="text-center">Private MBBS India</span>
            <span className="text-center" style={{ color: "#F5A623" }}>MBBS in {countryName}</span>
          </div>
          {comparisonRows.map((row, i) => (
            <div
              key={row.aspect}
              className="grid grid-cols-3 items-start gap-3 border-b border-gray-50 px-5 py-4 text-sm last:border-0"
              style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}
            >
              <span className="font-medium text-gray-800">{row.aspect}</span>
              <div className="flex items-start justify-center gap-1.5">
                {!row.abroadWins ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" /> : <X className="mt-0.5 size-3.5 shrink-0 text-red-400" />}
                <span className="text-center text-xs leading-5 text-gray-500">{row.india}</span>
              </div>
              <div className="flex items-start justify-center gap-1.5">
                {row.abroadWins ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" /> : <X className="mt-0.5 size-3.5 shrink-0 text-red-400" />}
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
            I want to study MBBS in {countryName}. Call me.
          </LpDialogTrigger>
        </div>
      </div>
    </section>
  );
}
