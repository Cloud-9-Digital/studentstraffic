import { BRAND } from "./theme";

const STEPS = [
  {
    title: "Share your NEET details",
    desc: "Score, category, home state and a phone number. Under a minute.",
  },
  {
    title: "A counsellor reviews your profile",
    desc: "We check where your score stands for your category, quota and state before we call.",
  },
  {
    title: "We call you back within 24 hours",
    desc: "A straight conversation about what is realistic and what it costs.",
  },
];

export function LpProcess() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2
          className="max-w-md font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]"
          style={{ color: BRAND.heading }}
        >
          How it works
        </h2>

        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              {/* The rule carries the sequence across the row; the last step ends it. */}
              <div className="flex items-center gap-3">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white"
                  style={{ background: BRAND.coral }}
                >
                  {i + 1}
                </span>
                {i < STEPS.length - 1 ? (
                  <span
                    aria-hidden
                    className="hidden h-px flex-1 md:block"
                    style={{ background: "rgba(194, 65, 12, 0.25)" }}
                  />
                ) : null}
              </div>

              <h3
                className="mt-5 font-display text-lg font-semibold leading-snug"
                style={{ color: BRAND.green }}
              >
                {s.title}
              </h3>
              <p className="mt-1.5 max-w-xs text-sm leading-6 text-gray-500">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
