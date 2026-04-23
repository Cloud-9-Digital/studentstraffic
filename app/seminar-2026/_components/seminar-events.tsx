"use client";

import { MapPin } from "lucide-react";

import { EVENTS } from "../_data";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

export function SeminarEvents() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
          Find your city
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-snug text-[#0c1a35] sm:text-4xl">
          Upcoming seminar dates
        </h2>
        <p className="mt-3 text-sm text-[#5a6270]">
          All seminars start at <strong className="text-[#0c1a35]">5:30 PM</strong> and run for 2–3 hours. Entry is free — register and we&apos;ll WhatsApp you venue details.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map(({ date, day, city, venue, state, time }) => {
            const [dayNum, month, year] = date.split(" ");
            return (
              <div
                key={`${date}-${city}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#e8e0d5] bg-white transition hover:border-[#c17f3b]/40 hover:shadow-sm"
              >
                {/* Top: date + info */}
                <div className="flex items-stretch">
                  {/* Date sidebar */}
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-[#0c1a35] py-4 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-white/40">{month}</span>
                    <span className="text-2xl font-extrabold leading-none text-white">{dayNum}</span>
                    <span className="mt-1 text-[10px] font-semibold text-[#d4954a]">{year}</span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 px-4 py-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3 shrink-0 text-[#c17f3b]" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c17f3b]">
                        {"Tamil Nadu"}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[15px] font-bold text-[#0c1a35]">{city}</div>
                    <div className="mt-0.5 truncate text-xs text-[#5a6270]">{venue}</div>
                    <div className="mt-0.5 text-xs text-[#5a6270]/60">{day} · {time}</div>
                  </div>
                </div>

                {/* Register button */}
                <div className="border-t border-[#e8e0d5] px-4 py-2.5">
                  <SeminarDialogTrigger
                    className="w-full rounded-lg bg-[#c17f3b]/8 py-2 text-xs font-semibold text-[#c17f3b] transition hover:bg-[#c17f3b] hover:text-white active:scale-[0.98]"
                    preselectedEvent={`${city} — ${date}`}
                  >
                    Register for this event
                  </SeminarDialogTrigger>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
