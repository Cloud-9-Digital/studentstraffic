import { ArrowRight, BadgeCheck } from "lucide-react";

import { LpDialogTrigger } from "./lp-dialog-trigger";

type Country = {
  flag: string;
  name: string;
  feeRange: string;
  duration: string;
  universities: number;
  why: string;
  badge?: string;
};

const COUNTRIES: Country[] = [
  {
    flag: "🇷🇺",
    name: "Russia",
    feeRange: "₹25 to 45 Lakhs",
    duration: "6 Years",
    universities: 60,
    why: "Most popular choice. Strong hospitals, affordable fees, large Indian community.",
    badge: "Most Popular",
  },
  {
    flag: "🇻🇳",
    name: "Vietnam",
    feeRange: "₹22 to 32 Lakhs",
    duration: "6 Years",
    universities: 5,
    why: "Affordable and growing destination. Good hospitals for clinical practice.",
  },
  {
    flag: "🇬🇪",
    name: "Georgia",
    feeRange: "₹28 to 48 Lakhs",
    duration: "6 Years",
    universities: 12,
    why: "European-standard education. High FMGE pass rates. Safe for Indian students.",
    badge: "Top Rated",
  },
  {
    flag: "🇺🇿",
    name: "Uzbekistan",
    feeRange: "₹20 to 32 Lakhs",
    duration: "6 Years",
    universities: 7,
    why: "Modern campuses, low living cost, and fast-growing reputation among Indian students.",
  },
  {
    flag: "🇰🇬",
    name: "Kyrgyzstan",
    feeRange: "₹18 to 28 Lakhs",
    duration: "6 Years",
    universities: 8,
    why: "Lowest total cost among all destinations. Ideal for budget-conscious families.",
    badge: "Most Affordable",
  },
  {
    flag: "🇲🇩",
    name: "Moldova",
    feeRange: "₹22 to 35 Lakhs",
    duration: "6 Years",
    universities: 4,
    why: "European country, NMC recognized, English medium. Less competition, good quality.",
  },
];

export function LpCountries() {
  return (
    <section
      id="countries"
      className="border-t py-16 md:py-20"
      style={{ borderColor: "rgba(0,0,0,0.07)", background: "#F8F9FB" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2
            className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            style={{ color: "#0f3d37" }}
          >
            Choose your country
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            All NMC-recognized. All English medium. Seats available for 2026 intake.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((c) => (
            <div
              key={c.name}
              className="group relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              {c.badge && (
                <span
                  className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: "#FEF3C7", color: "#92400E" }}
                >
                  {c.badge}
                </span>
              )}

              <div className="flex items-center gap-3">
                <span className="text-3xl">{c.flag}</span>
                <div>
                  <h3 className="text-base font-bold" style={{ color: "#0f3d37" }}>
                    MBBS in {c.name}
                  </h3>
                  <p className="text-xs text-gray-400">{c.universities}+ universities</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl px-3 py-2" style={{ background: "#F0FDF4" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">Total Fees</p>
                  <p className="mt-0.5 text-sm font-bold text-green-900">{c.feeRange}</p>
                </div>
                <div className="rounded-xl px-3 py-2" style={{ background: "#EFF6FF" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Duration</p>
                  <p className="mt-0.5 text-sm font-bold text-blue-900">{c.duration}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <BadgeCheck className="size-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-700">NMC Recognized. English Medium.</span>
              </div>

              <p className="mt-3 flex-1 text-xs leading-5 text-gray-500">{c.why}</p>

              <LpDialogTrigger
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white transition hover:opacity-90"
                style={{ background: "#0f3d37" } as React.CSSProperties}
              >
                Get admission in {c.name}
                <ArrowRight className="size-3.5" />
              </LpDialogTrigger>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Not sure which country is right for you?</p>
          <LpDialogTrigger
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: "#0f3d37" } as React.CSSProperties}
          >
            Talk to our team. Book a free call.
            <ArrowRight className="size-4" />
          </LpDialogTrigger>
        </div>
      </div>
    </section>
  );
}
