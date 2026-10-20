"use client";

import { cn } from "@/lib/utils";

/**
 * Mira's mark.
 *
 * A solid brand-green squircle with a crisp white signal glyph. An earlier
 * version used a green-to-orange gradient, which at 32px muddied into a dark
 * blob — gradients need room to read, and a chat header does not have it. Flat
 * fill plus high-contrast glyph stays legible at every size it appears at.
 *
 * The accent bar is the one hit of brand orange, and it is the element that
 * animates while a turn is in flight.
 */
export function MiraMark({
  size = 32,
  busy = false,
  className,
}: {
  size?: number;
  busy?: boolean;
  className?: string;
}) {
  const bar = Math.max(2, Math.round(size * 0.085));
  const gap = Math.max(2, Math.round(size * 0.07));

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center bg-primary",
        className
      )}
      style={{ width: size, height: size, borderRadius: size * 0.32 }}
      aria-hidden="true"
    >
      <span
        className="flex items-end"
        style={{ gap, height: size * 0.4 }}
      >
        <span
          className={cn(
            "rounded-full bg-white/70",
            busy && "animate-[pulse_1.1s_ease-in-out_infinite]"
          )}
          style={{ width: bar, height: "52%" }}
        />
        <span
          className={cn(
            "rounded-full bg-accent",
            busy && "animate-[pulse_1.1s_ease-in-out_infinite_150ms]"
          )}
          style={{ width: bar, height: "100%" }}
        />
        <span
          className={cn(
            "rounded-full bg-white/70",
            busy && "animate-[pulse_1.1s_ease-in-out_infinite_300ms]"
          )}
          style={{ width: bar, height: "72%" }}
        />
      </span>
    </span>
  );
}
