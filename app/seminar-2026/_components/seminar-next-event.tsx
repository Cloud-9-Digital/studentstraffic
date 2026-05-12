"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { EVENTS, getNextRegisterableEvent, parseEventDateTime } from "../_data";
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

  const colors = ["bg-red-600", "bg-yellow-500", "bg-green-600", "bg-red-600"];

  return (
    <div className="my-6 flex justify-center gap-3 sm:gap-4">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map(({ label, value }, index) => (
        <div key={label} className="flex flex-col items-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${colors[index]} shadow-lg sm:h-20 sm:w-20`}>
            <span className="text-2xl font-bold text-white sm:text-3xl">
              {value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SeminarNextEvent() {
  const nextEvent = getNextRegisterableEvent(EVENTS);

  if (!nextEvent) return null;

  const { date, day, city, venue, time } = nextEvent;
  const displayTime = time ?? "Timing to be confirmed";

  // Parse event date and time
  const eventDateTime = parseEventDateTime(nextEvent);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-10 md:py-12">
      {/* Subtle dot pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Colored accent glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full opacity-6 blur-3xl"
        style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-1/4 h-64 w-64 rounded-full opacity-6 blur-3xl"
        style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-600">
            Next Event
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
            Join us in {city}
          </h2>
        </div>

        <Countdown targetDate={eventDateTime} />

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex flex-col justify-center p-6 lg:p-8">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-yellow-500/10 px-3 py-1">
                <span className="size-1.5 animate-pulse rounded-full bg-yellow-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-600">
                  Upcoming
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold text-gray-900">{city}</h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-600/10">
                    <Calendar className="size-4 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Date</div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{day}, {date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Clock className="size-4 text-yellow-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Time</div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{displayTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-600/10">
                    <MapPin className="size-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Venue</div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{venue}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500 sm:order-2">
                  Free entry · Details via WhatsApp
                </p>
                <SeminarDialogTrigger
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-[0.98] sm:order-1"
                  preselectedEvent={`${city} — ${date}`}
                >
                  Reserve Your Seat
                </SeminarDialogTrigger>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
