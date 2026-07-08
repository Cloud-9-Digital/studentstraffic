import type { ReactNode } from "react";
import { CircleDollarSign } from "lucide-react";

import { SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";
import { cn } from "@/lib/utils";

export function CountryCostSection({
  countryName,
  costRange,
  livingRange,
  totalRange,
  publicCount,
  privateCount,
  avgPublicTuition,
  avgPrivateTuition,
  teachingMediums,
  intakeMonths,
  monthlyCostOfLiving,
  addOnsSlot,
}: {
  countryName: string;
  costRange: string | null;
  livingRange: string | null;
  totalRange: string | null;
  publicCount: number;
  privateCount: number;
  avgPublicTuition: string | null;
  avgPrivateTuition: string | null;
  teachingMediums: string[];
  intakeMonths: string[];
  monthlyCostOfLiving: { intro: string; items: Array<{ category: string; range: string; notes?: string }> } | null;
  addOnsSlot?: ReactNode;
}) {
  return (
    <div className="py-12 md:py-16">
      <SectionKicker icon={<CircleDollarSign className="size-3.5" />} text="Cost picture" />
      <SectionHeading>What studying in {countryName} actually costs</SectionHeading>
      <SectionIntro>
        Country-level ranges show where the market starts. The exact number depends on the city,
        hostel setup, and the specific university you shortlist — our counsellors help you turn
        this range into a real budget.
      </SectionIntro>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <CostStat label="Tuition / year" value={costRange ?? "Check notices"} />
        <CostStat label="Living / year" value={livingRange ?? "Varies by city"} />
        <CostStat label="All-in estimate" value={totalRange ?? "Build totals"} highlight />
      </div>

      {avgPublicTuition || avgPrivateTuition ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {avgPublicTuition ? (
            <RouteCard type="Public" count={publicCount} avg={avgPublicTuition} tone="green" />
          ) : null}
          {avgPrivateTuition ? (
            <RouteCard type="Private" count={privateCount} avg={avgPrivateTuition} tone="amber" />
          ) : null}
        </div>
      ) : null}

      {(teachingMediums.length || intakeMonths.length) ? (
        <div className="mt-6 flex flex-wrap gap-6">
          {teachingMediums.length ? <TagGroup label="Teaching medium" items={teachingMediums} /> : null}
          {intakeMonths.length ? <TagGroup label="Intake months" items={intakeMonths} /> : null}
        </div>
      ) : null}

      {addOnsSlot}

      {monthlyCostOfLiving ? (
        <div className="mt-10">
          <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Monthly living costs
          </p>
          <p className="mb-5 text-sm leading-7 text-muted-foreground">{monthlyCostOfLiving.intro}</p>
          <div className="overflow-hidden rounded-[1.6rem] border border-border/70">
            <div className="grid grid-cols-3 border-b border-border/60 bg-[#f7f5f0] px-5 py-3">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Category
              </span>
              <span className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Monthly range
              </span>
              <span className="text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Notes
              </span>
            </div>
            {monthlyCostOfLiving.items.map((item, i) => (
              <CostRow
                key={item.category}
                label={item.category}
                value={item.range}
                note={item.notes ?? ""}
                border={i > 0}
                highlight={i === monthlyCostOfLiving.items.length - 1}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CostStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[1.4rem] border px-5 py-4",
        highlight ? "border-primary/25 bg-primary/[0.06]" : "border-border/60 bg-[#faf8f4]"
      )}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-display text-xl font-semibold tracking-tight sm:text-2xl",
          highlight ? "text-heading" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function CostRow({
  label,
  value,
  note,
  border,
  highlight,
}: {
  label: string;
  value: string;
  note: string;
  border?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-center px-5 py-4",
        border && "border-t border-border/60",
        highlight && "bg-[#f7f5f0]"
      )}
    >
      <span className={cn("text-sm", highlight ? "font-semibold text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span
        className={cn(
          "text-center font-display text-lg font-semibold tracking-tight",
          highlight ? "text-heading" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-right text-xs text-muted-foreground">{note}</span>
    </div>
  );
}

function RouteCard({
  type,
  count,
  avg,
  tone,
}: {
  type: string;
  count: number;
  avg: string;
  tone: "green" | "amber";
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border px-4 py-4",
        tone === "green" ? "border-emerald-200/70 bg-emerald-50" : "border-amber-200/70 bg-amber-50"
      )}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {type} route · {count} options
      </p>
      <p className="mt-2 font-display text-xl font-semibold text-heading">
        {avg}
        <span className="text-sm font-normal text-muted-foreground">/yr avg</span>
      </p>
    </div>
  );
}

function TagGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
