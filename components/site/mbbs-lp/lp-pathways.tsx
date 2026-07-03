import { ArrowRight } from "lucide-react";

import { CareerPathways } from "@/components/site/career-pathways";

import { LpDialogTrigger } from "./lp-dialog-trigger";

type Props = {
  countryName: string;
};

export function LpPathways({ countryName }: Props) {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c2410c]">
            After graduation
          </p>
          <h2
            className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl"
            style={{ color: "#0f3d37" }}
          >
            Six career pathways open to you
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
            An MBBS from {countryName} is not just an India-return degree. Depending on
            where you want to practice, you can go to the USA, UK, Australia, Canada,
            New Zealand — or do your PG in {countryName} itself.
          </p>
        </div>

        <CareerPathways studyCountry={countryName} />

        <div className="mt-10 rounded-2xl p-6 text-white md:p-8" style={{ background: "#0f3d37" }}>
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-lg font-bold">Not sure which pathway fits your goals?</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Your target country determines which exam to prepare for and when to start.
                Our counsellors map the right pathway based on your budget, NEET score,
                and where you eventually want to practice.
              </p>
            </div>
            <LpDialogTrigger
              className="inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition hover:opacity-90"
              style={{ background: "#F5A623", color: "#071428" } as React.CSSProperties}
            >
              Discuss my pathway
              <ArrowRight className="size-4" />
            </LpDialogTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
