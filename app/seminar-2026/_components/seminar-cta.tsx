import { ArrowRight } from "lucide-react";

import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

export function SeminarCta() {
  return (
    <section className="bg-[#0c1a35] py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4954a]">
          Free entry · No obligation
        </p>
        <h2 className="mt-4 text-3xl font-bold leading-snug text-white sm:text-4xl">
          Ready to get answers from doctors who&apos;ve been there?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-white/50">
          Reserve your seat in under a minute. We&apos;ll WhatsApp you the nearest venue, date, and what to bring.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <SeminarDialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-[#c17f3b] px-8 py-4 text-[15px] font-semibold text-white shadow-lg transition hover:bg-[#a86d2f] active:scale-[0.98]">
            Reserve My Free Seat
            <ArrowRight className="size-4" />
          </SeminarDialogTrigger>
          <p className="text-sm text-white/30">Chennai 10:00 AM · Other timings soon · 16 cities</p>
        </div>
      </div>
    </section>
  );
}
