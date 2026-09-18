import { BRAND, HAIRLINE } from "./theme";

const COVERED = [
  {
    title: "Where your score actually stands",
    body: "Read against All India Quota and your home state, for your category.",
  },
  {
    title: "What each option really costs",
    body: "Government, private and deemed colleges, compared across the full course rather than year one.",
  },
  {
    title: "Choice filling and deadlines",
    body: "The stage where most seats are genuinely lost, and how to order your preferences.",
  },
  {
    title: "Honest alternatives",
    body: "If MBBS is out of reach this year — BDS, allied health, a repeat attempt, or a considered abroad route.",
  },
];

export function LpCovered() {
  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <h2
              className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]"
              style={{ color: BRAND.heading }}
            >
              What the call covers
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              Cut-offs move every year with paper difficulty and the seat matrix, so we work
              from the current year&rsquo;s official counselling data rather than a fixed table.
            </p>
          </div>

          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {COVERED.map((item) => (
              <div key={item.title} className="border-t pt-5" style={{ borderColor: HAIRLINE }}>
                <dt
                  className="font-display text-lg font-semibold leading-snug"
                  style={{ color: BRAND.green }}
                >
                  {item.title}
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-gray-500">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
