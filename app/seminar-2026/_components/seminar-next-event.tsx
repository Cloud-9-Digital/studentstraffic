"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";

import { EVENTS } from "../_data";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

export function SeminarNextEvent() {
  // Get the next upcoming event (first in the array)
  const nextEvent = EVENTS[0];

  if (!nextEvent) return null;

  const { date, day, city, venue, time } = nextEvent;
  const displayTime = time ?? "Timing to be confirmed";

  return (
    <section className="bg-gradient-to-b from-white to-[#faf8f5] py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
            Next Event
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-[#0c1a35] sm:text-3xl">
            Join us in {city}
          </h2>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-[#e8e0d5] bg-white shadow-lg">
          <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
            {/* Left: Image */}
            <div className="relative h-48 lg:h-auto">
              <Image
                src="/seminar-venue-hilton-chennai.jpg"
                alt={`${venue}, ${city}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 280px"
                priority
              />
            </div>

            {/* Right: Event Details */}
            <div className="flex flex-col justify-center p-6 lg:p-8">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#c17f3b]/10 px-3 py-1">
                <span className="size-1.5 animate-pulse rounded-full bg-[#c17f3b]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
                  Upcoming
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold text-[#0c1a35]">{city}</h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#c17f3b]/10">
                    <Calendar className="size-4 text-[#c17f3b]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wide text-[#5a6270]/60">Date</div>
                    <div className="text-sm font-semibold text-[#0c1a35] truncate">{day}, {date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#c17f3b]/10">
                    <Clock className="size-4 text-[#c17f3b]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wide text-[#5a6270]/60">Time</div>
                    <div className="text-sm font-semibold text-[#0c1a35] truncate">{displayTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#c17f3b]/10">
                    <MapPin className="size-4 text-[#c17f3b]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wide text-[#5a6270]/60">Venue</div>
                    <div className="text-sm font-semibold text-[#0c1a35] truncate">{venue}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-[#e8e0d5] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#5a6270]/60 sm:order-2">
                  Free entry · Details via WhatsApp
                </p>
                <SeminarDialogTrigger
                  className="rounded-lg bg-[#c17f3b] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#a86d2f] active:scale-[0.98] sm:order-1"
                  preselectedEvent={`${city} — ${date}`}
                >
                  Reserve Your Seat
                </SeminarDialogTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
