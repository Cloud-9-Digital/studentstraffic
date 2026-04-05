"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, X } from "lucide-react";
import Link from "next/link";

import { EVENTS } from "@/app/seminar-2026/_data";

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseEventDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(" ");
  return new Date(Number(year), MONTH_MAP[month]!, Number(day));
}

const SESSION_KEY = "seminar_popup_count";
const MAX_AUTO_SHOWS = 2;
const DELAY_MS = 5000;

export function SeminarPromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);

  const nextEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return EVENTS.find((e) => parseEventDate(e.date) >= today) ?? null;
  }, []);

  // Count remaining upcoming events
  const upcomingCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return EVENTS.filter((e) => parseEventDate(e.date) >= today).length;
  }, []);

  useEffect(() => {
    if (!nextEvent) return;

    // Pill appears after 1.5 s
    const pillTimer = setTimeout(() => setPillVisible(true), 1500);

    // Auto-show popup based on session count
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) ?? "0", 10);
    if (count < MAX_AUTO_SHOWS) {
      const popupTimer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(SESSION_KEY, String(count + 1));
      }, DELAY_MS);
      return () => {
        clearTimeout(pillTimer);
        clearTimeout(popupTimer);
      };
    }

    return () => clearTimeout(pillTimer);
  }, [nextEvent]);

  if (!nextEvent) return null;

  const [dayNum, month] = nextEvent.date.split(" ");

  return (
    <>
      {/* Persistent pill — always visible, hidden when popup is open */}
      <div
        className={`fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6 transition-all duration-500 ${
          pillVisible && !isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-[#0c1a35] py-2.5 pl-3.5 pr-4 shadow-[0_8px_32px_rgba(12,26,53,0.45)] ring-1 ring-white/10 transition-all hover:ring-[#c17f3b]/40 active:scale-95"
        >
          {/* Pulsing dot */}
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c17f3b] opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-[#c17f3b]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            Free MBBS Seminar
          </span>
          <ArrowRight className="size-3.5 text-[#c17f3b] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Popup card */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 md:bottom-6 md:right-6 w-[300px] animate-in slide-in-from-bottom-4 fade-in duration-300 sm:w-[320px]">
          <div className="overflow-hidden rounded-2xl bg-[#0c1a35] shadow-[0_24px_64px_rgba(12,26,53,0.6)] ring-1 ring-white/[0.08]">
            {/* Decorative glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.18] blur-3xl"
              style={{ background: "#c17f3b" }}
            />

            {/* Top bar */}
            <div className="relative flex items-center justify-between px-4 pt-4 pb-0">
              <div className="flex items-center gap-2">
                <span className="relative flex size-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c17f3b] opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[#c17f3b]" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4954a]">
                  Free · Tamil Nadu 2026
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/25 transition hover:bg-white/10 hover:text-white/60"
                aria-label="Close"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Main content */}
            <div className="relative px-4 pb-4 pt-3">
              <p className="text-[15px] font-bold leading-snug text-white">
                Your MBBS questions, answered by doctors who&apos;ve done it.
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-white/45">
                FMGE-cleared doctors from Russia, Georgia & more. Free entry — no sales pitch.
              </p>

              {/* Next event */}
              <div className="mt-3.5 flex items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2.5 ring-1 ring-white/[0.07]">
                {/* Date block */}
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#c17f3b]/15 ring-1 ring-[#c17f3b]/20">
                  <span className="text-[8px] font-extrabold uppercase tracking-wide text-[#d4954a]">
                    {month}
                  </span>
                  <span className="text-[17px] font-extrabold leading-none text-white">
                    {dayNum}
                  </span>
                </div>
                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3 shrink-0 text-[#c17f3b]" />
                    <span className="text-[13px] font-semibold text-white">{nextEvent.city}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-white/35">
                    {nextEvent.venue} · {nextEvent.time}
                  </p>
                </div>
              </div>

              {/* Divider with count */}
              <p className="mt-3 text-center text-[11px] text-white/25">
                {upcomingCount} upcoming cities · May – Jul 2026
              </p>

              {/* CTA */}
              <Link
                href="/seminar-2026"
                onClick={() => setIsOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c17f3b] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#a86d2f] active:scale-[0.98]"
              >
                See all cities & dates
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
