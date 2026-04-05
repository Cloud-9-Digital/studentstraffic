import { FAQ } from "../_data";

export function SeminarFaq() {
  return (
    <section className="border-t border-[#e8e0d5] bg-[#faf6ef] py-14">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-[#0c1a35]">
          Common questions
        </h2>
        <div className="space-y-6">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-b border-[#e8d5b7] pb-6 last:border-0 last:pb-0">
              <h3 className="font-semibold text-[#0c1a35]">{q}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5a6270]">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
