"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Languages } from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import type { ChatUniversityCard } from "@/lib/chatbot/types";
import { cn } from "@/lib/utils";

/**
 * A university result.
 *
 * Deliberately small: name, where it is, what it costs, and the two facts that
 * decide a shortlist — language and intake. Recognition detail used to sit here
 * as prose of wildly varying length, which both buried the fee and made a row
 * of cards ragged; it belongs in the answer text or on the page, not on a tile
 * this size.
 *
 * Every card is `h-full` over a fixed-width carousel track, so a row is even
 * regardless of how long a university's name wraps.
 *
 * Nothing here is written by the model. Each value is read from the catalogue
 * server-side, so a card cannot disagree with the page it links to — the fee in
 * particular is the same pre-formatted string the page renders, which is why an
 * unpublished fee reads "Fee plan on request" rather than a number.
 */
export function ChatUniversityCardItem({ card }: { card: ChatUniversityCard }) {
  const hasFigure = /\d/.test(card.annualFee);

  return (
    <Link
      href={card.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border",
        // A soft brand wash rather than flat white, so a row of results reads
        // as part of the assistant instead of a table.
        "bg-[linear-gradient(160deg,color-mix(in_srgb,var(--primary)_5%,var(--background)),var(--background)_58%)]",
        "transition-all hover:border-accent/50 hover:shadow-md hover:shadow-primary/5"
      )}
    >
      {/* A thin brand bar gives each card an anchor and a hit of colour that
          does not compete with the fee. */}
      <span
        className="h-1 w-full shrink-0 bg-[linear-gradient(90deg,var(--primary),var(--accent))]"
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-[0.8rem] font-semibold leading-snug text-foreground">
            {card.name}
          </p>
          <ArrowUpRight
            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
          {card.countryCode ? (
            <CountryFlag
              countryCode={card.countryCode}
              alt=""
              width={14}
              height={10}
              className="shrink-0 rounded-[2px] ring-1 ring-black/10"
            />
          ) : null}
          <span className="truncate">
            {card.city}, {card.country}
          </span>
        </p>

        {/* mt-auto pins the price block to the bottom, so fees line up across
            a row even when one name wraps to two lines. */}
        <div className="mt-auto pt-1">
          <p
            className={cn(
              "text-sm font-bold leading-none",
              hasFigure ? "text-accent" : "text-muted-foreground"
            )}
          >
            {card.annualFee}
          </p>
          <p className="mt-1 text-[0.65rem] text-muted-foreground">
            Annual tuition{card.courses.length > 0 ? ` · ${card.courses[0]}` : ""}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {card.medium ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-1.5 py-0.5 text-[0.62rem] font-medium text-primary">
                <Languages className="size-2.5" strokeWidth={2} aria-hidden="true" />
                {card.medium}
              </span>
            ) : null}
            {card.intakes.length > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[0.62rem] font-medium text-accent-strong">
                <CalendarDays className="size-2.5" strokeWidth={2} aria-hidden="true" />
                {card.intakes.slice(0, 2).join(", ")}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
