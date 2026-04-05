import { SeminarLeadForm } from "./seminar-lead-form";

export function SeminarRegister() {
  return (
    <section id="register" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-md px-4">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
            It&apos;s free
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-snug text-[#0c1a35]">
            Reserve your seat now
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-[#5a6270]">
            Tell us your city and we&apos;ll WhatsApp you the nearest venue, timing, and what to expect.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e8e0d5] bg-[#faf6ef] p-6 sm:p-8">
          <SeminarLeadForm
            sourcePath="/seminar-2026"
            ctaVariant="seminar-2026-bottom"
            submitLabel="Book my free seat →"
          />
        </div>
      </div>
    </section>
  );
}
