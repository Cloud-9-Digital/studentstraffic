"use client";

import Image from "next/image";
import { useState } from "react";

import { getInitialsColour, getUniversityInitials } from "@/lib/dashboard/application-model";
import { cn } from "@/lib/utils";

/**
 * University logo on a white tile, or the university's initials in a coloured
 * circle when there is no logo or the image fails to load. Before this, a
 * missing or failed logo left a grey tile with a faint cap icon, which read
 * as an empty box.
 */
export function UniversityLogo({ name, logoUrl, size = 48 }: { name: string; logoUrl: string | null; size?: 40 | 48 }) {
  const [failed, setFailed] = useState(false);
  const box = size === 40 ? "size-10" : "size-12";

  if (!logoUrl || failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-wide",
          box,
          getInitialsColour(name),
        )}
      >
        {getUniversityInitials(name)}
      </span>
    );
  }

  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#eaeaea] bg-white", box)}>
      <Image
        src={logoUrl}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        onError={() => setFailed(true)}
        className="size-full object-contain p-1.5"
      />
    </span>
  );
}
