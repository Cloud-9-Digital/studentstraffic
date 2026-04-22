import { ArrowRight } from "lucide-react";

import { SeminarDialogTrigger } from "./seminar-dialog-trigger";
import { SeminarLeadForm } from "./seminar-lead-form";

export function SeminarHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(150deg, #0c1a35 0%, #0f2440 55%, #0a1e3a 100%)" }}
    >
      {/* Subtle diagonal stripe texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
        }}
      />
      {/* Warm glow top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "#c17f3b" }}
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_370px] lg:items-center lg:gap-16">
          {/* Left: copy */}
          <div>
            <h1 className="text-[2.6rem] font-bold leading-[1.08] text-white sm:text-5xl md:text-[3.25rem]">
              Talk to{" "}
              <em className="not-italic text-[#d4954a]">doctors who cleared FMGE</em>,{" "}
              not sales agents
            </h1>

            <p className="mt-5 text-[15px] leading-7 text-white/55 sm:text-base">
              A free seminar across 14 cities in Tamil Nadu for students exploring MBBS abroad. Sit with FMGE-cleared doctors who studied overseas and understand the real questions around countries, universities, fees, and long-term outcomes. No scripts. No sales pitch. Just honest answers.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { value: "14", label: "Cities" },
                { value: "Free", label: "Entry" },
                { value: "May – Jul", label: "2026" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-[#d4954a]">{value}</div>
                  <div className="mt-0.5 text-xs font-medium uppercase tracking-widest text-white/35">{label}</div>
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <SeminarDialogTrigger className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c17f3b] px-6 py-4 text-[15px] font-semibold text-white shadow-lg transition hover:bg-[#a86d2f] active:scale-[0.98] lg:hidden">
              Reserve Your Free Seat
              <ArrowRight className="size-4" />
            </SeminarDialogTrigger>
          </div>

          {/* Right: lead form — desktop only */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="text-xl font-bold text-white">Reserve your free seat</p>
                <p className="mt-1 text-sm text-white/40">We'll confirm your city and venue on WhatsApp.</p>
              </div>
              <div className="bg-white p-6">
                <SeminarLeadForm
                  sourcePath="/seminar-2026"
                  ctaVariant="seminar-2026-hero"
                  submitLabel="Reserve my seat →"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
