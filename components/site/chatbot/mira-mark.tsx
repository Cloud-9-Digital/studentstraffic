"use client";

import { cn } from "@/lib/utils";

/**
 * Mira's mark.
 *
 * A gradient orb rather than an icon. It runs brand green into brand orange —
 * the same gradient the site header's programme row uses — so the assistant
 * reads as part of Students Traffic rather than a bolted-on widget, and it
 * avoids the sparkle glyph every other product has settled on.
 *
 * While a turn is in flight the orb breathes and throws a soft halo, which is
 * the assistant's "working" state everywhere it appears.
 */
export function MiraMark({
  size = 36,
  busy = false,
  className,
}: {
  size?: number;
  busy?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("relative grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {busy ? (
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[linear-gradient(135deg,var(--primary),var(--accent))] opacity-25"
          style={{ animationDuration: "1.8s" }}
        />
      ) : null}

      <span
        className={cn(
          "relative grid size-full place-items-center overflow-hidden rounded-full",
          "bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary)_35%,var(--accent)_100%)]",
          "shadow-sm ring-1 ring-black/5",
          busy && "animate-pulse"
        )}
      >
        {/* A light sheen across the top gives the flat gradient some depth,
            so the orb reads as a lens rather than a coloured dot. */}
        <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/20" />

        {/* Three ascending bars: a quiet nod to a signal or a response taking
            shape, legible at 20px where a detailed glyph would not be. */}
        <span className="relative flex items-end gap-[0.1em]" style={{ height: size * 0.34 }}>
          <span className="w-[0.14em] rounded-full bg-white/90" style={{ height: "55%", width: size * 0.07 }} />
          <span className="w-[0.14em] rounded-full bg-white" style={{ height: "100%", width: size * 0.07 }} />
          <span className="w-[0.14em] rounded-full bg-white/90" style={{ height: "72%", width: size * 0.07 }} />
        </span>
      </span>
    </span>
  );
}
