import { LeadForm } from "@/components/site/lead-form";

import { LpAvatar } from "./lp-avatar";

type Props = {
  sourcePath: string;
  flag: string;
  countryName: string;
  heroKicker: string;
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroSubtext: string;
  universityCount: number;
  minTotalInrLabel: string;
  maxTotalInrLabel: string;
  durationYears: number;
};

export function LpHero({
  sourcePath,
  flag,
  countryName,
  heroKicker,
  heroHeadlinePrefix,
  heroHeadlineHighlight,
  heroSubtext,
  universityCount,
  minTotalInrLabel,
  maxTotalInrLabel,
  durationYears,
}: Props) {
  const stats = [
    { value: `${universityCount}+`, label: "NMC-Aligned Universities" },
    { value: `${minTotalInrLabel} to ${maxTotalInrLabel}`, label: "Approx. Total Cost (6 yrs)" },
    { value: `${durationYears} Years`, label: "Course Duration" },
    { value: "3,000+", label: "Students Admitted" },
  ];

  return (
    <section
      className="relative w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(140deg, #071428 0%, #0b1e3d 50%, #0d2545 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "#F5A623" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-10 md:pt-14 lg:pb-18">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_400px] lg:items-start lg:gap-14">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white/60">
              <span className="text-base leading-none">{flag}</span>
              {heroKicker}
            </p>

            <h1 className="text-[2.2rem] font-extrabold leading-[1.1] text-white sm:text-5xl md:text-[3rem]">
              {heroHeadlinePrefix}{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(90deg, #F5A623 0%, #f9c46a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {heroHeadlineHighlight}
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/60">{heroSubtext}</p>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <LpAvatar name="Counsellor One" size={36} className="border-2 border-[#071428]" />
                <LpAvatar name="Counsellor Two" size={36} className="border-2 border-[#071428]" />
                <LpAvatar name="Counsellor Three" size={36} className="border-2 border-[#071428]" />
              </div>
              <p className="text-xs text-white/45">
                Our counselling team calls you back within 24 hours
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-7 sm:flex sm:flex-wrap">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-lg font-black text-[#F5A623] sm:text-xl">{value}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="lead-form-hero">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <div
                className="border-b border-white/10 px-6 py-4"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p className="text-lg font-bold text-white">Book a Free Counselling Call</p>
                <p className="mt-1 text-xs text-white/40">
                  We call you back and help you compare universities in {countryName}.
                </p>
              </div>
              <div className="bg-white p-6">
                <LeadForm
                  sourcePath={sourcePath}
                  ctaVariant="country-lp-hero"
                  title=""
                  description=""
                  submitLabel="Request Free Counselling"
                  stacked
                  embedded
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
