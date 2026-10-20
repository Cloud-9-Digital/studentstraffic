"use client";

import Link from "next/link";

/**
 * Annual tuition, compared.
 *
 * The data's job is magnitude across named universities, so this is a
 * horizontal bar chart with **one hue for every bar**. Colouring bars by their
 * own value would double-encode length as darkness and burn the only free
 * channel on information the bar length already carries.
 *
 * The hue is the brand accent, which is the one brand colour that passes the
 * palette checks as a data fill (lightness band, chroma floor and contrast
 * against the panel surface) — the deep brand green reads as near-black at
 * this size and fails the chroma floor.
 *
 * Every bar is directly labelled with its real figure, so the chart is
 * readable without the bars and never needs an axis. Only programmes with a
 * fee we are allowed to publish reach this component; anything "on request"
 * is excluded upstream rather than drawn as a zero.
 */
export type ChatFeeChartPoint = {
  label: string;
  /** Annual tuition in USD. */
  value: number;
  /** Pre-formatted by the same helper the pages use. */
  formatted: string;
  href?: string;
};

export function ChatFeeChart({
  title,
  points,
}: {
  title: string;
  points: ChatFeeChartPoint[];
}) {
  if (points.length < 3) return null;

  const max = Math.max(...points.map((point) => point.value));

  return (
    <figure className="my-1 rounded-xl border border-border bg-background p-3">
      {/* One series, so the caption names it and no legend is needed. */}
      <figcaption className="mb-2.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground/80">
        {title}
      </figcaption>

      <ul className="space-y-2.5">
        {points.map((point) => {
          const width = max > 0 ? Math.max((point.value / max) * 100, 4) : 0;

          const row = (
            <>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="truncate text-[0.72rem] leading-tight text-foreground">
                  {point.label}
                </span>
                {/* Value in text ink, never the series colour. */}
                <span className="shrink-0 text-[0.72rem] font-semibold tabular-nums text-foreground">
                  {point.formatted}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${width}%` }}
                />
              </div>
            </>
          );

          return (
            <li key={point.label}>
              {point.href ? (
                <Link
                  href={point.href}
                  title={`${point.label} — ${point.formatted} a year`}
                  className="group block rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  {row}
                </Link>
              ) : (
                <div title={`${point.label} — ${point.formatted} a year`}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
