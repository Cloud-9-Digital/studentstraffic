import { LpDialogTrigger } from "./lp-dialog-trigger";

const testimonials = [
  {
    name: "Priya K.",
    state: "Tamil Nadu",
    detail: "Tbilisi State Medical University, Georgia. 2nd Year",
    quote: "I called Students Traffic after my NEET result. They told me honestly which universities will suit my score. No pressure, no false promises. Now I am in Georgia and happy with my choice.",
  },
  {
    name: "Rahul S.",
    state: "Uttar Pradesh",
    detail: "Kazan Federal University, Russia. 3rd Year",
    quote: "My score was 280. Everyone said I cannot do anything. Students Traffic shortlisted Kazan for me. It is NMC recognized, English medium, and total cost under 35 lakhs. They handled everything.",
  },
  {
    name: "Sneha P.",
    state: "Gujarat",
    detail: "Osh State University, Kyrgyzstan. 4th Year",
    quote: "I was worried about Kyrgyzstan. But Students Traffic connected me to a student already studying there. After talking to her, I was confident. Total cost 22 lakhs for 6 years. Best decision.",
  },
];

export function LpTrust() {
  return (
    <section className="border-t py-16 md:py-20" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#F8F9FB" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            Students who trusted us
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            Real students. Real results. 3,000+ admissions since 2014.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-[#F5A623]">★</span>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-5 border-t border-gray-50 pt-4">
                <p className="font-semibold text-gray-900">{t.name} · {t.state}</p>
                <p className="mt-0.5 text-xs font-medium" style={{ color: "#0f3d37" }}>{t.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <LpDialogTrigger
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: "#0f3d37" } as React.CSSProperties}
          >
            I want admission too. Call me.
          </LpDialogTrigger>
        </div>
      </div>
    </section>
  );
}
