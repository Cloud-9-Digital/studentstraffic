import { ArrowRight } from "lucide-react";

import { EVENTS } from "../_data";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

export function SeminarCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-20">
      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Subtle colored glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{ background: "radial-gradient(circle, #059669 0%, #eab308 50%, #dc2626 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-600">
          Free entry · No obligation
        </p>
        <h2 className="mt-4 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
          Ready to get answers from doctors who&apos;ve been there?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-gray-600">
          Reserve your seat in under a minute. We&apos;ll WhatsApp you the nearest venue, date, and what to bring.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <SeminarDialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-4 text-[15px] font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.98]">
            Reserve My Free Seat
            <ArrowRight className="size-4" />
          </SeminarDialogTrigger>
          <p className="text-sm text-gray-500">Timings shared on WhatsApp · {EVENTS.length} cities across Tamil Nadu</p>
        </div>
      </div>
    </section>
  );
}
