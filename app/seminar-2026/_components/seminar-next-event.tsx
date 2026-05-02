"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { EVENTS } from "../_data";
import { SeminarDialogTrigger } from "./seminar-dialog-trigger";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="my-6 flex justify-center gap-3 sm:gap-4">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#c17f3b] shadow-lg sm:h-20 sm:w-20">
            <span className="text-2xl font-bold text-white sm:text-3xl">
              {value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#5a6270]/60">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SeminarNextEvent() {
  // Get the next upcoming event (first in the array)
  const nextEvent = EVENTS[0];

  if (!nextEvent) return null;

  const { date, day, city, venue, time } = nextEvent;
  const displayTime = time ?? "Timing to be confirmed";

  // Parse event date and time
  const eventDateTime = new Date(`${date} ${time ?? "10:00 AM"}`);

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

        <Countdown targetDate={eventDateTime} />

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
