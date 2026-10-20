"use client";

import Image from "next/image";

import miraIcon from "@/components/site/chatbot/mira-mark.png";
import { cn } from "@/lib/utils";

/**
 * Mira's mark, rendered bare.
 *
 * Her own artwork, deliberately separate from the site favicon. The
 * favicon is the traffic light from the wordmark and speaks for the whole
 * site; this speech bubble carries the same three lamps but reads as a
 * reply, which suits the assistant and would not suit a site about all of
 * education. Change one without the other. The vector source is
 * docs/brand/mira-mark.svg.
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
