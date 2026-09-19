import Image from "next/image";

import { BRAND, HAIRLINE } from "./theme";
import { LpDialogTrigger } from "./lp-dialog-trigger";

const REASONS = [
  {
    title: "We tell you when the answer is no",
    body: "If a government seat is out of reach at your score, or going abroad is wrong for your family, we say so on the first call.",
  },
  {
    title: "The counselling is genuinely free",
    body: "No consultation fee, no report fee, nothing to pay to talk to us. You are not signing up for anything by taking the call.",
  },
  {
    title: "Admissions is all we do",
    body: "Since 2014, and more than 3,000 students admitted. You are speaking to someone who has run this cycle before.",
  },
];

export function LpTrust() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/images/home/why-students-trust-us.jpg"
              alt="A Students Traffic counsellor talking through options with a student and their parents"
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <h2
              className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]"
              style={{ color: BRAND.heading }}
            >
              Why families take this call
            </h2>

            <ul className="mt-8 space-y-7">
              {REASONS.map((r) => (
                <li key={r.title} className="border-l-2 pl-5" style={{ borderColor: BRAND.coral }}>
                  <h3
                    className="font-display text-lg font-semibold leading-snug"
                    style={{ color: BRAND.green }}
                  >
                    {r.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-gray-500">{r.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <LpDialogTrigger
                className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: BRAND.coral } as React.CSSProperties}
              >
                Get my free counselling call
              </LpDialogTrigger>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-4 md:mt-20">
        <div className="border-t" style={{ borderColor: HAIRLINE }} />
      </div>
    </section>
  );
}
