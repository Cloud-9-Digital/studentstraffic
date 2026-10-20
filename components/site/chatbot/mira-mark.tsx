"use client";

import Image from "next/image";

import miraIcon from "@/app/icon.png";
import { cn } from "@/lib/utils";

/**
 * Mira's mark — the site icon, rendered bare.
 *
 * Imported from `app/icon.png`, the same file that serves the browser-tab
 * icon, so the assistant and the tab never drift apart: replace the favicon
 * and this follows automatically.
 *
 * It never animates. A pulsing icon next to shimmering text gave the waiting
 * state two competing rhythms, and the mark is an identity rather than a
 * status light — the text alone says that something is happening.
 *
 * No tile, ring or rounded background. The artwork already carries its own
 * silhouette, and wrapping it in a second container read as an icon stuck
 * inside a box — two competing shapes where there should be one.
 */
export function MiraMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={miraIcon}
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
      className={cn(
        "shrink-0 object-contain",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
