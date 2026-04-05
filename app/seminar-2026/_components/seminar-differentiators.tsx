import { DIFFERENTIATORS } from "../_data";

export function SeminarDifferentiators() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
          Why this seminar is different
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-snug text-[#0c1a35] sm:text-4xl">
          Peer guidance, not a sales pitch
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#e8e0d5] bg-[#e8e0d5] sm:grid-cols-3">
          {DIFFERENTIATORS.map(({ number, title, body }) => (
            <div key={number} className="group bg-white p-7 transition hover:bg-[#faf6ef]">
              <div className="mb-4 text-5xl font-bold text-[#e8d5b7]">{number}</div>
              <h3 className="text-[15px] font-semibold leading-snug text-[#0c1a35]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5a6270]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
