import { FAQ } from "../_data";

export function SeminarFaq() {
  return (
    <section className="border-t border-gray-200 bg-gray-50 py-14">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          Common questions
        </h2>
        <div className="space-y-6">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              <h3 className="font-semibold text-gray-900">{q}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
