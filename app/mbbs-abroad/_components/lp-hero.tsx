import { LeadForm } from "@/components/site/lead-form";

const FOCUS_COUNTRIES = [
  { flag: "🇷🇺", name: "Russia", fee: "From ₹25L" },
  { flag: "🇻🇳", name: "Vietnam", fee: "From ₹22L" },
  { flag: "🇬🇪", name: "Georgia", fee: "From ₹28L" },
  { flag: "🇺🇿", name: "Uzbekistan", fee: "From ₹20L" },
  { flag: "🇰🇬", name: "Kyrgyzstan", fee: "From ₹18L" },
  { flag: "🇲🇩", name: "Moldova", fee: "From ₹22L" },
];

function CountryPill({ flag, name, fee }: { flag: string; name: string; fee: string }) {
  return (
    <a
      href="#countries"
      className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 transition hover:border-white/25 hover:bg-white/10"
    >
      <span className="text-base leading-none">{flag}</span>
      <span className="text-xs font-semibold text-white/80">{name}</span>
      <span className="text-[10px] text-white/35">{fee}</span>
    </a>
  );
}

export function LpHero() {
  return (
    <section
      className="relative w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(140deg, #071428 0%, #0b1e3d 50%, #0d2545 100%)",
      }}
    >
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 18s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

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
            <h1 className="text-[2.2rem] font-extrabold leading-[1.1] text-white sm:text-5xl md:text-[3rem]">
              Want to become a doctor?{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(90deg, #F5A623 0%, #f9c46a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Study MBBS abroad. We will get you admitted.
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/60">
              Trusted by 3,000+ Indian students since 2014. We help you get
              admitted to NMC-recognized MBBS universities across 6 countries.
              Book a free counselling call and we will guide you.
            </p>

            <div className="mt-7">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                Top destinations we admit to
              </p>

              <div className="relative -mx-4 overflow-hidden md:hidden">
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#071428] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#071428] to-transparent" />
                <div className="marquee-track flex gap-2 px-4">
                  {[...FOCUS_COUNTRIES, ...FOCUS_COUNTRIES].map((c, i) => (
                    <CountryPill key={`${c.name}-${i}`} {...c} />
                  ))}
                </div>
              </div>

              <div className="hidden flex-wrap gap-2 md:flex">
                {FOCUS_COUNTRIES.map((c) => (
                  <CountryPill key={c.name} {...c} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-7">
              {[
                { value: "3,000+", label: "Students Admitted" },
                { value: "6 Countries", label: "We Specialise In" },
                { value: "Since 2014", label: "Trusted Platform" },
                { value: "500+", label: "Universities" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-black text-[#F5A623]">{value}</div>
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
                  We call you back and tell you exactly where to apply.
                </p>
              </div>
              <div className="bg-white p-6">
                <LeadForm
                  sourcePath="/mbbs-abroad"
                  ctaVariant="mbbs-abroad-hero"
                  title=""
                  description=""
                  submitLabel="Book My Free Call"
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
