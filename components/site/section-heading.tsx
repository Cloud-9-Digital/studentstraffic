import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  aside,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  aside?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "mx-auto max-w-3xl text-center md:flex-col md:items-center"
      )}
    >
      <div className={cn("space-y-4", align === "center" && "md:items-center")}>
        <div className="space-y-3">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-heading text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {aside ? <div>{aside}</div> : null}
    </div>
  );
}
