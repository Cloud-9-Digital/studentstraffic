import { ArrowRight, BadgeCheck } from "lucide-react";

import { LpDialogTrigger } from "./lp-dialog-trigger";
import type { CountryLpProgram } from "./types";
import { formatInrApprox } from "@/lib/data/mbbs-country-lp";

type Props = {
  countryName: string;
  universities: CountryLpProgram[];
};

export function LpUniversities({ countryName, universities }: Props) {
  return (
    <section
      id="universities"
      className="border-t py-16 md:py-20"
      style={{ borderColor: "rgba(0,0,0,0.07)", background: "#F8F9FB" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2
            className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            style={{ color: "#0f3d37" }}
          >
            Top universities in {countryName}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            NMC-aligned, English medium, live fee data from our university database.
            Seats open for the current intake.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((u) => (
            <div
              key={u.universitySlug}
              className="group relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <span
                className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ background: "#EFF6FF", color: "#1D4ED8" }}
              >
                {u.type}
              </span>

              <div>
                <h3 className="pr-16 text-base font-bold leading-snug" style={{ color: "#0f3d37" }}>
                  {u.universityName}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{u.city}, {countryName}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl px-3 py-2" style={{ background: "#F0FDF4" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">Total Fees</p>
                  <p className="mt-0.5 text-sm font-bold text-green-900">{formatInrApprox(u.totalTuitionUsd)}</p>
                  <p className="text-[10px] text-green-700/70">${u.totalTuitionUsd.toLocaleString("en-US")}</p>
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: "#EFF6FF" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Duration</p>
                  <p className="mt-0.5 text-sm font-bold text-blue-900">{u.durationYears} Years</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <BadgeCheck className="size-3.5 shrink-0 text-green-600" />
                <span className="text-xs font-medium text-green-700">NMC-aligned. {u.medium}.</span>
              </div>

              <LpDialogTrigger
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white transition hover:opacity-90"
                style={{ background: "#0f3d37" } as React.CSSProperties}
              >
                Check my admission chances
                <ArrowRight className="size-3.5" />
              </LpDialogTrigger>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Not sure which university fits your NEET score and budget?</p>
          <LpDialogTrigger
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: "#0f3d37" } as React.CSSProperties}
          >
            Talk to our team. Request counselling.
            <ArrowRight className="size-4" />
          </LpDialogTrigger>
        </div>
      </div>
    </section>
  );
}
