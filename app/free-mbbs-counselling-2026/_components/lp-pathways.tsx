import { BRAND, HAIRLINE } from "./theme";
import { LpDialogTrigger } from "./lp-dialog-trigger";

/**
 * Grouped by the only question that matters at this stage: can this NEET score
 * still be used, or does the plan have to change? The grouping is the
 * information — it is not decoration.
 */
const GROUPS = [
  {
    heading: "Still open on your NEET 2026 score",
    note: "Same scorecard, different counselling paths.",
    items: [
      {
        name: "Government MBBS",
        body: "All India Quota through MCC, and the larger state quota through your home state counselling. Different cut-offs, different rules, usually different chances.",
      },
      {
        name: "Private & deemed MBBS",
        body: "Deemed universities counsel through MCC; private colleges run through state counselling. The decision here is budget across six years, not just the opening fee.",
      },
      {
        name: "BDS",
        body: "Dentistry runs through the same NEET counselling rounds as MBBS, and usually closes at a lower rank.",
      },
      {
        name: "AYUSH — BAMS, BHMS, BUMS, BSMS",
        body: "A separate central counselling for ayurveda, homoeopathy, unani and siddha, admitted on your NEET score.",
      },
      {
        name: "Veterinary — B.V.Sc & AH",
        body: "A five-year clinical degree most students never look at, with its own All India Quota counselling on the same NEET result.",
      },
    ],
  },
  {
    heading: "If MBBS in India is out of reach",
    note: "Where the plan has to change, and the trade-offs are real.",
    items: [
      {
        name: "MBBS abroad",
        body: "Only worth it at a university that meets NMC guidelines. You still need to have qualified NEET, and you still have to clear the Indian licensing exam to practise here.",
      },
      {
        name: "Nursing & allied health",
        body: "B.Sc nursing, physiotherapy, radiology, lab sciences and similar routes admit outside NEET, through state and university processes.",
      },
      {
        name: "A planned repeat attempt",
        body: "A considered second attempt beats a rushed admission you regret. What it needs is an honest look at how much your score can realistically move.",
      },
    ],
  },
];

export function LpPathways() {
  return (
    <section className="py-16 md:py-20" style={{ background: BRAND.surface }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <h2
            className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]"
            style={{ color: BRAND.heading }}
          >
            Every pathway, not just the one we sell
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-500">
            Most students only hear about two options. Your NEET score opens more doors than
            that, and some of them close on dates nobody tells you about. This is the full map
            we walk through on the call.
          </p>
        </div>

        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-2">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <div className="border-t-2 pt-4" style={{ borderColor: BRAND.coral }}>
                <h3
                  className="font-display text-lg font-semibold"
                  style={{ color: BRAND.green }}
                >
                  {group.heading}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{group.note}</p>
              </div>

              <dl className="mt-5 space-y-5">
                {group.items.map((item) => (
                  <div key={item.name} className="border-t pt-4" style={{ borderColor: HAIRLINE }}>
                    <dt className="text-sm font-semibold" style={{ color: BRAND.green }}>
                      {item.name}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-500">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center gap-4">
          <LpDialogTrigger
            className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: BRAND.coral } as React.CSSProperties}
          >
            Find out which of these fit my score
          </LpDialogTrigger>
          <p className="text-xs text-gray-400">
            Counselling dates and seat matrices change every year — we confirm the current
            position against the official portals on the call.
          </p>
        </div>
      </div>
    </section>
  );
}
