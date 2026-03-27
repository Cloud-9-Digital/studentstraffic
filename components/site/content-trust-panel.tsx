import { CalendarDays, PencilLine } from "lucide-react";

import { contentAuthorName, formatContentDate } from "@/lib/content-governance";
import { cn } from "@/lib/utils";

export function ContentTrustPanel({
  lastReviewed,
  className,
  inverse = false,
}: {
  lastReviewed: string;
  sourceSummary?: string;
  referenceCount?: number;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      <MetaItem
        icon={
          <CalendarDays
            className={cn("size-4", inverse ? "text-white/45" : "text-accent")}
          />
        }
        label="Updated"
        value={formatContentDate(lastReviewed)}
        inverse={inverse}
      />
      <MetaItem
        icon={
          <PencilLine
            className={cn("size-4", inverse ? "text-white/45" : "text-accent")}
          />
        }
        label="Author"
        value={contentAuthorName}
        inverse={inverse}
      />
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
  inverse,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  inverse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={cn(
            "text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
            inverse ? "text-white/50" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-medium",
            inverse ? "text-white/88" : "text-foreground"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
