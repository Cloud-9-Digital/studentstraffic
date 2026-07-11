import type { ReactNode } from "react";
import { ArrowUpRight, CircleDollarSign } from "lucide-react";

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
}) {
  return (
    <section className="py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <SectionKicker icon={<CircleDollarSign className="size-3.5" />} text="Budget planning" />
          <SectionHeading>What studying in {countryName} actually costs.</SectionHeading>
          <SectionIntro>
            These are estimated country-level costs. Check the university and programme pages for exact fees, intakes and living costs.
          </SectionIntro>
        </div>

        <div>
          {(costRange || livingRange || totalRange) ? (
            <div className="border-y border-primary/20">
              {costRange ? <BudgetRow label="Tuition" detail="Typical annual range" value={costRange} /> : null}
              {livingRange ? <BudgetRow label="Living" detail="Typical annual range" value={livingRange} /> : null}
              {totalRange ? <BudgetRow label="Total planning range" detail="Tuition + living" value={totalRange} emphasis /> : null}
            </div>
          ) : null}

          {avgPublicTuition || avgPrivateTuition ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {avgPublicTuition ? <RouteRow type="Public universities" value={`${avgPublicTuition}/yr average`} /> : null}
              {avgPrivateTuition ? <RouteRow type="Private universities" value={`${avgPrivateTuition}/yr average`} /> : null}
            </div>
          ) : null}

          {(teachingMediums.length || intakeMonths.length) ? (
            <div className="mt-8 grid gap-6 border-t border-border/70 pt-6 sm:grid-cols-2">
              {teachingMediums.length ? <TagGroup label="Teaching medium" items={teachingMediums} kind="medium" /> : null}
              {intakeMonths.length ? <TagGroup label="Common intakes" items={intakeMonths} kind="intake" /> : null}
            </div>
          ) : null}
        </div>
      </div>

      {monthlyCostOfLiving ? (
        <div className="mt-12 border-t border-border/70 pt-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary/70">Monthly living costs</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{monthlyCostOfLiving.intro}</p>
            </div>
            <ArrowUpRight aria-hidden="true" className="hidden size-5 text-primary/50 sm:block" />
          </div>

          <div className="mt-6 overflow-hidden border-y border-border/70">
            {monthlyCostOfLiving.items.map((item, index) => (
              <div key={item.category} className={cn("grid gap-1 px-0 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6", index > 0 && "border-t border-border/60")}>
                <span className="text-sm font-semibold text-foreground">{item.category}</span>
                <span className="font-display text-lg font-semibold tracking-tight text-heading sm:text-right">{item.range}</span>
                <span className="text-xs leading-5 text-muted-foreground sm:text-right">{item.notes ?? ""}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function CountryCurrencySection({ countryName, addOnsSlot }: { countryName: string; addOnsSlot: ReactNode }) {
  return (
    <section className="py-10 md:py-14">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[1.75rem] border border-primary/15 bg-primary/[0.045] px-5 py-6 shadow-[0_18px_50px_-36px_hsl(var(--primary)/0.45)] sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="min-w-0">
              <SectionKicker icon={<CircleDollarSign className="size-3.5" />} text="Currency converter" />
              <SectionHeading className="mt-3 max-w-[14ch] text-2xl sm:text-3xl">Plan your budget in your currency.</SectionHeading>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">Use this converter to understand the country-level costs for {countryName}. Check the programme page for the final university fees.</p>
            </div>
            <div className="min-w-0">{addOnsSlot}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BudgetRow({ label, detail, value, emphasis }: { label: string; detail: string; value: string; emphasis?: boolean }) {
  return (
    <div className={cn("grid gap-2 px-0 py-5 sm:grid-cols-[0.8fr_1fr_auto] sm:items-center sm:gap-6", emphasis && "bg-primary/[0.04]")}>
      <div>
        <p className={cn("font-display text-xl font-semibold tracking-tight", emphasis ? "text-heading" : "text-foreground")}>{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>
      <div className="hidden h-px bg-border/70 sm:block" />
      <p className={cn("font-display text-xl font-semibold tracking-tight sm:text-right sm:text-2xl", emphasis ? "text-heading" : "text-foreground")}>{value}</p>
    </div>
  );
}

function RouteRow({ type, value }: { type: string; value: string }) {
  return (
    <div className="border-l-2 border-primary/25 pl-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{type}</p>
      <p className="mt-1 font-display text-lg font-semibold text-heading">{value}</p>
    </div>
  );
}

function TagGroup({ label, items, kind }: { label: string; items: string[]; kind: "medium" | "intake" }) {
  const normalizedItems = kind === "medium"
    ? items.flatMap((item) => item.split(/,|\band\b/i).map((part) => part.replace(/^(primarily|mainly|mostly)\s+/i, "").trim()))
    : items.map((item) => item.trim());
  const uniqueItems = Array.from(
    new Map(
      normalizedItems
        .filter((item) => item && !/official\s+notice|check\s+with/i.test(item))
        .map((item) => [item.toLowerCase(), item]),
    ).values(),
  );

  if (!uniqueItems.length) return null;

  return (
    <div>
      <p className="mb-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {uniqueItems.map((item) => <span key={item} className="text-sm font-medium text-foreground">{item}</span>)}
      </div>
    </div>
  );
}
