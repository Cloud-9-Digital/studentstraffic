import Image from "next/image";

import { LeadForm } from "@/components/site/lead-form";

import { LP_SOURCE_PATH } from "./constants";
import { BRAND, GREEN_SURFACE } from "./theme";

export function LpHero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ background: GREEN_SURFACE }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.13] blur-3xl"
        style={{ background: BRAND.coralLight }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-10 md:pt-14 lg:pb-0">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1.05fr_384px] lg:items-start lg:gap-12">
          {/* Copy leads on every breakpoint — on mobile the sticky bar carries the
              CTA, so the hero can earn the tap before it asks for the number. */}
          <div className="flex flex-col">
            <h1 className="max-w-[9ch] font-display text-[2.9rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-[3.6rem] lg:text-[4.1rem]">
              Free MBBS counselling
            </h1>

            <p
              className="mt-4 max-w-[26ch] font-display text-xl leading-snug sm:text-[1.6rem]"
              style={{ color: BRAND.coralLight }}
            >
              Know exactly where your NEET 2026 score can take you.
            </p>

            <p className="mt-4 max-w-sm text-[15px] leading-6 text-white/60">
              Share your score, category and state. A counsellor calls you back within 24
              hours with the options that are realistic for your profile.
            </p>

            {/* Cut-out team photo closes the empty space under the copy and puts a
                real face on the promise. It bleeds to the hero's bottom edge. */}
            <Image
              src="/images/seminar-2026/students-traffic-panel.png"
              alt="The Students Traffic counselling team"
              width={1350}
              height={858}
              priority
              sizes="(min-width: 1024px) 580px, (min-width: 640px) 70vw, 92vw"
              className="mt-8 h-auto w-full max-w-[380px] select-none self-center lg:-mb-px lg:mt-6 lg:max-w-[580px] lg:self-start"
            />
          </div>

          <div id="lead-form-hero">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
              <div className="px-6 pt-6">
                <p
                  className="font-display text-xl font-semibold"
                  style={{ color: BRAND.green }}
                >
                  Book your free counselling call
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Takes under a minute. We call you back.
                </p>
              </div>
              <div className="p-6">
                <LeadForm
                  sourcePath={LP_SOURCE_PATH}
                  ctaVariant="mbbs-counselling-2026-hero"
                  title=""
                  description=""
                  submitLabel="Request my free call"
                  showNeetCategory
                  hideEmail
                  lockPhoneToIndia
                  hidePlaceholders
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
