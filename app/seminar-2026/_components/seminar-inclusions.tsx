import { FREE_INCLUSIONS } from "../_data";

export function SeminarInclusions() {
  return (
    <section className="bg-[#0c1a35] py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4954a]">
            Completely free — always
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-snug text-white sm:text-4xl">
            What&apos;s included if you study through us
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-white/50">
            Every student who enrolls through Students Traffic gets lifetime access to these — no hidden fees, no upsells.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_INCLUSIONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-white/8 bg-white/5 p-5 transition hover:bg-white/8"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[#c17f3b]/15">
                <Icon className="size-4 text-[#d4954a]" />
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-5 text-white/45">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
