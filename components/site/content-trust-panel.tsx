import { CalendarDays, CheckCircle2, Shield, User } from "lucide-react";

import { contentAuthorName, contentAuthorRole, formatContentDate } from "@/lib/content-governance";
import { cn } from "@/lib/utils";

export function ContentTrustPanel({
  lastReviewed,
  className,
  inverse = false,
  variant = "default",
  showAuthor = true,
}: {
  lastReviewed: string;
  className?: string;
  inverse?: boolean;
  variant?: "default" | "compact" | "featured";
  showAuthor?: boolean;
}) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
        <MetaItem
          icon={
            <CalendarDays
              className={cn("size-4", inverse ? "text-white/45" : "text-accent")}
            />
          }
          label="Last updated"
          value={formatContentDate(lastReviewed)}
          inverse={inverse}
        />
        {showAuthor && (
          <MetaItem
            icon={
              <User
                className={cn("size-4", inverse ? "text-white/45" : "text-accent")}
              />
            }
            label="Reviewed by"
            value={contentAuthorName}
            inverse={inverse}
          />
        )}
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className={cn("mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3", className)}>
        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-4 w-4 text-accent" />
          <div className="flex items-baseline gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Last Updated
            </p>
            <p className="text-sm font-medium text-foreground">
              {formatContentDate(lastReviewed)}
            </p>
          </div>
        </div>

        {showAuthor && (
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reviewed By
              </p>
              <p className="text-sm font-medium text-foreground">
                {contentAuthorName}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant - inline, no card wrapper
  return (
    <div className={cn("mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3", className)}>
      <div className="flex items-center gap-2.5">
        <CalendarDays className="h-4 w-4 text-accent" />
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Last Updated
          </p>
          <p className="text-sm font-medium text-foreground">
            {formatContentDate(lastReviewed)}
          </p>
        </div>
      </div>

      {showAuthor && (
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <div className="flex items-baseline gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reviewed By
            </p>
            <p className="text-sm font-medium text-foreground">
              {contentAuthorName}
            </p>
          </div>
        </div>
      )}
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
