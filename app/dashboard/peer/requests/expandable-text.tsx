"use client";

import { useState } from "react";

/** Two-line preview of a request message with a "Show more" toggle for long text. */
export function ExpandableText({ text, threshold = 140 }: { text: string; threshold?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > threshold;
  return (
    <div className="text-sm leading-relaxed text-[#374151]">
      <p className={!open && long ? "line-clamp-2" : undefined}>{text}</p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-0.5 text-xs font-medium text-[#0f3d37] hover:underline"
        >
          {open ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}
