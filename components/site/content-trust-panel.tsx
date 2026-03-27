import Link from "next/link";
import { CalendarDays, FileCheck2, Files, ShieldCheck } from "lucide-react";

import {
  editorialDeskName,
  formatContentDate,
} from "@/lib/content-governance";
import { cn } from "@/lib/utils";

export function ContentTrustPanel({
  lastReviewed,
  sourceSummary,
  referenceCount,
  className,
}: {
  lastReviewed: string;
  sourceSummary: string;
  referenceCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-4", className)}>
      <TrustCard
        icon={<CalendarDays className="size-4 text-accent" />}
        label="Last reviewed"
        value={formatContentDate(lastReviewed)}
      />
      <TrustCard
        icon={<ShieldCheck className="size-4 text-accent" />}
        label="Reviewed by"
        value={editorialDeskName}
      />
      <TrustCard
        icon={<Files className="size-4 text-accent" />}
        label="Source basis"
        value={
          referenceCount
            ? `${referenceCount} linked source${referenceCount === 1 ? "" : "s"}`
            : sourceSummary
        }
        description={sourceSummary}
      />
      <TrustCard
        icon={<FileCheck2 className="size-4 text-accent" />}
        label="Standards"
        value="Editorial policy & methodology"
        description={
          <>
            <Link href="/editorial-policy" className="font-medium text-primary hover:underline">
              Editorial policy
            </Link>
            {" · "}
            <Link href="/methodology" className="font-medium text-primary hover:underline">
              Methodology
            </Link>
          </>
        }
      />
    </div>
  );
}

function TrustCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{value}</p>
      {description ? (
        <div className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      ) : null}
    </div>
  );
}
