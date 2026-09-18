import { LeadForm } from "@/components/site/lead-form";

import { LP_SOURCE_PATH } from "./constants";
import { BRAND, GREEN_SURFACE } from "./theme";

export function LpCta() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20" style={{ background: GREEN_SURFACE }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: BRAND.coralLight }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_384px] lg:items-center lg:gap-12">
          <div>
            <h2 className="max-w-lg font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-[2.75rem]">
              Stop guessing about{" "}
              <span style={{ color: BRAND.coralLight }}>your MBBS 2026 options.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/65">
              One free call gives you a clear read on your score, what each option costs, and
              what to do next. No pressure to sign anything.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
            <div className="px-6 pt-6">
              <p className="font-display text-xl font-semibold" style={{ color: BRAND.green }}>
                Book your free counselling call
              </p>
              <p className="mt-1 text-xs text-gray-500">We call you back within 24 hours.</p>
            </div>
            <div className="p-6">
              <LeadForm
                sourcePath={LP_SOURCE_PATH}
                ctaVariant="mbbs-counselling-2026-bottom-cta"
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
    </section>
  );
}
