import { CountryFlag } from "@/components/site/country-flag";
import { SPEAKER_COUNTRIES } from "../_data";

export function SeminarSpeakers() {
  return (
    <section className="bg-[#faf6ef] py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
              At the event
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-snug text-[#0c1a35] sm:text-4xl">
              Doctors who studied exactly where you&apos;re considering
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#5a6270]">
              FMGE-cleared graduates from Russia and Georgia who are now registered with NMC and practising in India. They know every question you have — because they had them too.
            </p>

            {/* FMGE callout */}
            <div className="mt-8 rounded-xl bg-[#0c1a35] px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4954a]">
                Key insight
              </p>
              <p className="mt-2 text-lg font-bold leading-snug text-white">
                FMGE pass rate matters more than the brochure
              </p>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Our doctors will walk you through real FMGE pass rates, how to prepare from Year 1, and which universities gave them the strongest foundation.
              </p>
            </div>
          </div>

          {/* Country cards */}
          <div className="flex flex-col gap-3">
            {SPEAKER_COUNTRIES.map(({ country, countryCode, detail, hasFmgeGraduates }) => (
              <div
                key={country}
                className="flex items-start gap-4 rounded-xl border border-[#e8d5b7] bg-white p-4"
              >
                <CountryFlag
                  countryCode={countryCode}
                  alt={country}
                  width={36}
                  height={27}
                  className="mt-0.5 shrink-0 rounded-sm shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#0c1a35]">{country}</span>
                    {!hasFmgeGraduates && (
                      <span className="rounded-full border border-[#c17f3b]/30 bg-[#c17f3b]/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c17f3b]">
                        Representatives
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm leading-5 text-[#5a6270]">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
