"use client";

import { Calendar } from "lucide-react";

import { EVENTS } from "../_data";

export function SeminarCitiesTicker() {
  // Duplicate events array multiple times for seamless infinite scroll
  const tickerEvents = [...EVENTS, ...EVENTS];

  return (
    <div className="overflow-hidden bg-gradient-to-r from-[#0c1a35] via-[#0f2440] to-[#0c1a35] py-4">
      {/* Scrolling content */}
      <div className="flex animate-scroll gap-3" style={{ width: 'max-content' }}>
        {tickerEvents.map((event, idx) => {
          const [day, month] = event.date.split(" ");
          return (
            <div
              key={`${event.city}-${event.date}-${idx}`}
              className="flex shrink-0 items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
            >
              {/* Date badge */}
              <div className="flex items-center gap-1.5 rounded bg-[#c17f3b]/15 px-2 py-1">
                <Calendar className="size-3 text-[#d4954a]" />
                <span className="text-xs font-bold text-[#d4954a]">
                  {day} {month}
                </span>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-white/10" />

              {/* City */}
              <span className="text-sm font-semibold text-white">{event.city}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
