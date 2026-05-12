"use client";

import { cn } from "@/lib/utils";

import { EVENTS } from "../_data";

export function SeminarCitiesTicker({ className }: { className?: string }) {
  // Duplicate events array multiple times for seamless infinite scroll
  const tickerEvents = [...EVENTS, ...EVENTS];

  return (
    <div
      className={cn(
        "overflow-hidden py-4",
        className,
      )}
    >
      {/* Scrolling content */}
      <div className="flex animate-scroll gap-3" style={{ width: 'max-content' }}>
        {tickerEvents.map((event, idx) => {
          const colors = ['bg-red-50 border-red-200', 'bg-yellow-50 border-yellow-200', 'bg-green-50 border-green-200'];
          const colorIndex = idx % 3;

          return (
            <div
              key={`${event.city}-${event.date}-${idx}`}
              className={`flex shrink-0 items-center rounded-lg border ${colors[colorIndex]} px-4 py-2.5`}
            >
              {/* City */}
              <span className="text-sm font-semibold text-gray-900">{event.city}</span>
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
