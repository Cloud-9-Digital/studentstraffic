"use client";

import { ArrowRight, Clock, MapPin } from "lucide-react";

import { EVENTS, getEventsForDisplay, isEventCompleted, parseEventDate } from "../_data";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

const ACCENTS = [
  { bg: "bg-red-700",   light: "bg-red-50",   text: "text-red-700"   },
  { bg: "bg-amber-600", light: "bg-amber-50",  text: "text-amber-600" },
  { bg: "bg-green-700", light: "bg-green-50",  text: "text-green-700" },
] as const;

function daysFromNow(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseEventDate(dateStr).getTime() - today.getTime()) / 86_400_000);
}

function daysLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

export function SeminarEvents() {
  const displayEvents = getEventsForDisplay(EVENTS);

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">
          Find your city
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
          Seminar cities across Tamil Nadu
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          14 cities · Jun – Aug 2026 · Free entry
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {displayEvents.map((event, index) => {
            const { city, venue, date, day, time } = event;
            const completed = isEventCompleted(event);
            const accent = ACCENTS[index % 3];
            const [dayNum, month] = date.split(" ");
            const days = daysFromNow(date);

            return (
              <div
                key={`${city}-${date}`}
                className={`flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  completed ? "opacity-45 grayscale" : ""
                }`}
              >
                {/* Coloured header */}
                <div className={`${accent.bg} px-3.5 py-3`}>
                  <div className="flex items-start justify-between gap-2">
                    {/* Date */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black leading-none text-white">{dayNum}</span>
                      <span className="text-[11px] font-semibold text-white/70">{month}</span>
                    </div>
                    {/* Countdown pill */}
                    {!completed && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white whitespace-nowrap">
                        {daysLabel(days)}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <div className="text-[13px] font-bold leading-tight text-white">{city}</div>
                    <div className="text-[10px] text-white/60">{day}</div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-1.5 px-3.5 py-3">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 size-3 shrink-0 text-gray-400" />
                    <span className="text-[11px] leading-snug text-gray-500">{venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3 shrink-0 text-gray-400" />
                    <span className="text-[11px] font-medium text-gray-700">{time ?? "Timing TBC"}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-3.5 pb-3.5">
                  {completed ? (
                    <div className="rounded-lg border border-gray-100 py-2 text-center text-[11px] font-medium text-gray-400">
                      Completed
                    </div>
                  ) : (
                    <SeminarDialogTrigger
                      className={`flex w-full items-center justify-center gap-1 rounded-lg ${accent.light} py-2 text-[11px] font-semibold ${accent.text} transition hover:opacity-80 active:scale-[0.98]`}
                      preselectedEvent={`${city} — ${date}`}
                    >
                      Register <ArrowRight className="size-3" />
                    </SeminarDialogTrigger>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
