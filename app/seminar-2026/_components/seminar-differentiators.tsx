import { DIFFERENTIATORS } from "../_data";

export function SeminarDifferentiators() {
  const numberColors = ["text-red-200", "text-yellow-200", "text-green-200"];
  const hoverColors = ["hover:bg-red-50", "hover:bg-yellow-50", "hover:bg-green-50"];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700">
          Why this seminar is different
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
          Peer guidance, not a sales pitch
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
          {DIFFERENTIATORS.map(({ number, title, body }, index) => (
            <div key={number} className={`group bg-white p-7 transition ${hoverColors[index]}`}>
              <div className={`mb-4 text-5xl font-bold ${numberColors[index]}`}>{number}</div>
              <h3 className="text-[15px] font-semibold leading-snug text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
