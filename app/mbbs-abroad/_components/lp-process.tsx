import { LpDialogTrigger } from "./lp-dialog-trigger";

const steps = [
  { num: "01", title: "Call us or fill the form", desc: "Share your NEET score, budget, and which country you are interested in. Takes 2 minutes." },
  { num: "02", title: "We give you the right universities", desc: "Our team gives you 3 to 5 universities that match your score, budget, and preference. No confusion." },
  { num: "03", title: "We apply on your behalf", desc: "We handle the full application. Documents, follow-up with the university, admission letter. Everything." },
  { num: "04", title: "Visa done. You fly.", desc: "We help with your student visa and give you a full briefing before departure. You just show up." },
];

export function LpProcess() {
  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: "#0f3d37" }}>
            How we get you admitted
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
            Simple process. We do the work. You focus on getting ready.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="h-full rounded-2xl border p-6"
              style={{ borderColor: "rgba(0,0,0,0.07)", background: i === 0 ? "#0f3d37" : "white" }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: i === 0 ? "#F5A623" : "#c2410c" }}>
                Step {s.num}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold leading-tight" style={{ color: i === 0 ? "white" : "#0f3d37" }}>
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-6" style={{ color: i === 0 ? "rgba(255,255,255,0.55)" : "#6B7280" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <LpDialogTrigger
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: "#c2410c" } as React.CSSProperties}
          >
            Book a Free Counselling Call
          </LpDialogTrigger>
          <p className="mt-3 text-xs text-gray-400">No commitment. We will guide you step by step.</p>
        </div>
      </div>
    </section>
  );
}
