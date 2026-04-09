import { LeadForm } from "@/components/site/lead-form";

export function LpCta() {
  return (
    <section
      className="border-t py-16 md:py-24"
      style={{
        borderColor: "rgba(0,0,0,0.07)",
        background: "linear-gradient(140deg, #071428 0%, #0b1e3d 50%, #0d2545 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_400px] lg:items-center lg:gap-16">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-[1.1] text-white md:text-5xl">
              Ready to get your{" "}
              <span style={{ backgroundImage: "linear-gradient(90deg, #F5A623 0%, #f9c46a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                MBBS seat confirmed?
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-white/55">
              Call us or fill the form. We will call you back, understand your
              situation, and tell you exactly which university to apply to.
              Based on your NEET score and budget. No pressure.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { n: "3,000+", l: "Students Admitted" },
                { n: "10+", l: "Countries" },
                { n: "Since 2014", l: "In This Field" },
                { n: "500+", l: "Universities" },
              ].map(({ n, l }) => (
                <div key={l} className="rounded-xl border border-white/10 px-4 py-3 text-center">
                  <p className="text-xl font-black" style={{ color: "#F5A623" }}>{n}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <div className="border-b border-white/10 px-6 py-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-lg font-bold text-white">Book a Free Call</p>
              <p className="mt-1 text-xs text-white/40">
                We call you back and guide you to the right university.
              </p>
            </div>
            <div className="bg-white p-6">
              <LeadForm
                sourcePath="/mbbs-abroad"
                ctaVariant="mbbs-abroad-bottom-cta"
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
    </section>
  );
}
