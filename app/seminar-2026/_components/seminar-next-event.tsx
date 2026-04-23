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

  return (
    <section className="bg-gradient-to-b from-white to-[#faf8f5] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
            Next Event
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-snug text-[#0c1a35] sm:text-4xl">
            Join us in {city}
          </h2>
          <p className="mt-3 text-sm text-[#5a6270]">
            Don&apos;t miss our upcoming seminar — meet FMGE-cleared doctors and get your questions answered.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#e8e0d5] bg-white shadow-xl">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left: Image */}
            <div className="relative h-64 lg:h-auto">
              <Image
                src="/seminar-venue-hilton-chennai.jpg"
                alt={`${venue}, ${city}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Right: Event Details */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#c17f3b]/10 px-4 py-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-[#c17f3b]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
                  Upcoming Event
                </span>
              </div>

              <h3 className="mt-6 text-3xl font-bold text-[#0c1a35]">{city}</h3>
              <p className="mt-2 text-lg text-[#5a6270]">{venue}</p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#c17f3b]/10">
                    <Calendar className="size-5 text-[#c17f3b]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-[#5a6270]/60">Date</div>
                    <div className="text-sm font-semibold text-[#0c1a35]">{day}, {date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#c17f3b]/10">
                    <Clock className="size-5 text-[#c17f3b]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-[#5a6270]/60">Time</div>
                    <div className="text-sm font-semibold text-[#0c1a35]">{time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#c17f3b]/10">
                    <MapPin className="size-5 text-[#c17f3b]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-[#5a6270]/60">Venue</div>
                    <div className="text-sm font-semibold text-[#0c1a35]">{venue}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e8e0d5]">
                <SeminarDialogTrigger
                  className="w-full rounded-xl bg-[#c17f3b] px-8 py-4 text-[15px] font-semibold text-white shadow-lg transition hover:bg-[#a86d2f] active:scale-[0.98]"
                  preselectedEvent={`${city} — ${date}`}
                >
                  Reserve Your Free Seat
                </SeminarDialogTrigger>
                <p className="mt-3 text-center text-xs text-[#5a6270]/60">
                  Entry is completely free · Venue details sent via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
