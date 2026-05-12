"use client";

import { MapPin } from "lucide-react";

import { EVENTS, getEventsForDisplay, isEventCompleted } from "../_data";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

export function SeminarEvents() {
  const displayEvents = getEventsForDisplay(EVENTS);

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* Cross-hatch pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #000 1px, transparent 1px),
            linear-gradient(-45deg, #000 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Subtle gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-20 h-80 w-80 rounded-full opacity-4 blur-3xl"
        style={{ background: "radial-gradient(circle, #eab308 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-20 h-80 w-80 rounded-full opacity-4 blur-3xl"
        style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">
          Find your city
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">
          Seminar cities across Tamil Nadu
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          We will conduct seminars across all these cities. Register now to receive date updates for your city.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {displayEvents.map((event, index) => {
            const { city, venue } = event;
            const colors = ["border-red-700", "border-amber-600", "border-green-700"];
            const colorIndex = index % 3;

            return (
              <div
                key={`${city}-${venue}`}
                className={`group flex flex-col overflow-hidden rounded-xl border-2 ${colors[colorIndex]} bg-white transition hover:shadow-md`}
              >
                {/* City Info */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3 shrink-0 text-green-700" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700">
                      Tamil Nadu
                    </span>
                  </div>
                  <div className="mt-2 text-lg font-bold text-gray-900">{city}</div>
                  <div className="mt-1 text-xs text-gray-600">{venue}</div>
                </div>

                {/* Register button */}
                <div className="border-t border-gray-200 px-4 py-2.5">
                  <SeminarDialogTrigger
                    className="w-full rounded-lg bg-green-700/8 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-700 hover:text-white active:scale-[0.98]"
                    preselectedEvent={city}
                  >
                    Register for {city}
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
