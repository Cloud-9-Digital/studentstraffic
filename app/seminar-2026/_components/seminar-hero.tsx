import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { SeminarCitiesTicker } from "./seminar-cities-ticker";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";
import { SeminarLeadForm } from "./seminar-lead-form";

export function SeminarHero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
    >
      {/* Dot pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Colored gradient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 h-80 w-80 rounded-full opacity-8 blur-3xl"
        style={{ background: "radial-gradient(circle, #eab308 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)" }}
      />

      {/* Mobile hero image - full width, auto height */}
      <div className="mb-6 w-full sm:mb-8 lg:hidden">
        <Image
          src="/images/seminar-2026/seminar-hero-2026.png"
          alt="Tamil Nadu's Biggest MBBS Abroad Seminar 2026 - Students Traffic with KRM Educational Consultants"
          width={1254}
          height={1254}
          priority
          sizes="100vw"
          quality={85}
          className="h-auto w-full"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-10 pt-4 sm:px-6 md:pb-16 md:pt-12">

        {/* Mobile cities ticker - directly after image */}
        <div className="lg:hidden">
          <SeminarCitiesTicker className="bg-transparent py-3" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.92fr)] lg:items-center lg:gap-16">
          {/* Left: copy - desktop only */}
          <div className="hidden min-w-0 lg:block">
            <h1 className="break-words text-3xl font-bold leading-tight text-gray-900 lg:text-4xl xl:text-5xl xl:leading-[1.08]">
              <span className="text-red-700">Tamil Nadu&apos;s Biggest</span>{" "}
              <em className="not-italic text-amber-600">MBBS Abroad Seminar</em>{" "}
              <span className="text-green-700">by FMGE Doctors</span>
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-gray-600 lg:text-base lg:leading-7">
              Meet FMGE-cleared doctors who studied abroad. Get honest answers about countries, universities, fees, and outcomes. Free entry across 16 cities.
            </p>

            {/* Desktop CTA */}
            <SeminarDialogTrigger className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-green-800 active:scale-[0.98]">
              Reserve Your Free Seat
              <ArrowRight className="size-5" />
            </SeminarDialogTrigger>
          </div>

          {/* Right: hero image with rounded corners (desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/seminar-2026/seminar-hero-2026.png"
                alt="Tamil Nadu's Biggest MBBS Abroad Seminar 2026 - Students Traffic with KRM Educational Consultants"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                quality={85}
                className="rounded-3xl object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
