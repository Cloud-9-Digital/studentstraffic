import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { SeminarCitiesTicker } from "./seminar-cities-ticker";
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

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-6 sm:px-6 md:pb-16 md:pt-20">
        {/* Mobile hero image */}
        <div className="relative -mx-5 mb-6 h-[200px] overflow-hidden sm:-mx-6 sm:mb-8 sm:h-[240px] lg:hidden">
          <Image
            src="/images/seminar-2026/students-traffic-panel.png"
            alt="Students Traffic seminar speakers and FMGE-cleared doctors"
            fill
            priority
            sizes="100vw"
            className="object-contain object-bottom drop-shadow-[0_24px_40px_rgba(0,0,0,0.28)]"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
            }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.92fr)] lg:items-center lg:gap-16">
          {/* Left: copy */}
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-bold leading-tight text-white sm:text-5xl sm:leading-[1.08] md:text-[3.25rem]">
              Tamil Nadu&apos;s Biggest{" "}
              <em className="not-italic text-[#d4954a]">MBBS Abroad Seminar</em>{" "}
              by FMGE Doctors
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base sm:leading-7">
              Meet FMGE-cleared doctors who studied abroad. Get honest answers about countries, universities, fees, and outcomes. Free entry across 16 cities.
            </p>

            <div className="-mx-5 sm:-mx-6 lg:mx-0">
              <SeminarCitiesTicker className="mt-6 bg-transparent py-3 lg:hidden" />
            </div>

            {/* Desktop CTA */}
            <SeminarDialogTrigger className="mt-8 hidden items-center gap-2 rounded-xl bg-[#c17f3b] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#a86d2f] active:scale-[0.98] lg:inline-flex">
              Reserve Your Free Seat
              <ArrowRight className="size-5" />
            </SeminarDialogTrigger>
          </div>

          {/* Right: hero image */}
          <div className="relative hidden lg:block">
            <div className="relative h-[400px]">
              <Image
                src="/images/seminar-2026/students-traffic-panel.png"
                alt="Students Traffic seminar speakers and FMGE-cleared doctors"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain object-top drop-shadow-[0_28px_46px_rgba(0,0,0,0.32)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
