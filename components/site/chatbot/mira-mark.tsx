"use client";

import { cn } from "@/lib/utils";

/**
 * Mira's mark.
 *
 * A monogram in the brand green, set in the site's display serif. Earlier
 * attempts were pictorial — a gradient orb that muddied into a dark blob at
 * 32px, then three bars that simply read as a chart icon — and both failed the
 * only test that matters here: the mark appears at 18px beside a line of text
 * far more often than it appears large.
 *
 * A letterform survives that. It also stays correct however the product's
 * scope changes, where a compass or a book quietly commits to a meaning.
 *
 * The accent underline is the one hit of brand orange and the element that
 * animates while a turn is in flight — it reads as a progress cue without the
 * mark itself moving.
 */
export function MiraMark({
  size = 30,
  busy = false,
  className,
}: {
  size?: number;
  busy?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden bg-primary",
        className
      )}
      style={{ width: size, height: size, borderRadius: size * 0.32 }}
      aria-hidden="true"
    >
      <span
        className="font-display leading-none text-white"
        style={{
          fontSize: size * 0.56,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          // Optical centring: the serif M sits slightly high in its box.
          transform: `translateY(${size * 0.02}px)`,
        }}
      >
        M
      </span>

      <span
        className={cn(
          "absolute bg-accent",
          busy && "animate-[pulse_1.1s_ease-in-out_infinite]"
        )}
        style={{
          height: Math.max(1.5, size * 0.055),
          width: size * 0.42,
          bottom: size * 0.15,
          borderRadius: 99,
        }}
      />
    </span>
  );
}
