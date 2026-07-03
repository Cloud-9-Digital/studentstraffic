import { LpAvatar } from "./lp-avatar";
import { LpDialogTrigger } from "./lp-dialog-trigger";
import type { CountryLpTestimonial } from "./types";

type Props = {
  countryName: string;
  testimonials: CountryLpTestimonial[];
};

export function LpTrust({ countryName, testimonials }: Props) {
  return (
    <section className="border-t py-16 md:py-20" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#F8F9FB" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            Students in {countryName} who trusted us
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
              <div className="mt-5 flex items-center gap-3 border-t border-gray-50 pt-4">
                <LpAvatar name={t.name} photoUrl={t.photoUrl} />
                <div>
                  <p className="font-semibold text-gray-900">{t.name} · {t.state}</p>
                  <p className="mt-0.5 text-xs font-medium" style={{ color: "#0f3d37" }}>{t.detail}</p>
                </div>
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
