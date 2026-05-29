import type { ReactNode } from "react";

import {
  BedDouble,
  Info,
  ShieldCheck,
  UtensilsCrossed,
  Users,
} from "lucide-react";

import type { FinderProgram, University } from "@/lib/data/types";
import { formatUsdAmountOrTbd, hasPublishedUsdAmount } from "@/lib/utils";

import { SectionLabel } from "./shared";

export function UniversityHostelDetailSection({
  university,
  programs,
}: {
  university: University;
  programs: FinderProgram[];
}) {
  const publishedPrograms = programs.filter((p) => p.offering.published);
  const hasHostelCostData = publishedPrograms.some((p) =>
    p.offering.yearlyCostBreakdown.some((y) => hasPublishedUsdAmount(y.hostelUsd)),
  );

  return (
    <div className="space-y-6 py-10">
      <SectionLabel>Hostel &amp; student living</SectionLabel>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
        <p className="flex items-start gap-2.5 text-sm leading-6 text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
          Hostel arrangements and costs vary by room type and academic year.
          Confirm current availability and fees directly with {university.name}{" "}
          before making any payments.
        </p>
      </div>

      {university.hostelOverview && (
        <DetailCard
          icon={<BedDouble className="size-4 text-accent" />}
          title="Accommodation overview"
          body={university.hostelOverview}
        />
      )}

      {university.indianFoodSupport && (
        <DetailCard
          icon={<UtensilsCrossed className="size-4 text-accent" />}
          title="Food & daily living"
          body={university.indianFoodSupport}
        />
      )}

      {university.campusLifestyle && (
        <DetailCard
          icon={<Users className="size-4 text-accent" />}
          title="Campus & lifestyle"
          body={university.campusLifestyle}
        />
      )}

      {university.safetyOverview && (
        <DetailCard
          icon={<ShieldCheck className="size-4 text-accent" />}
          title="Safety & student support"
          body={`${university.safetyOverview}${
            university.studentSupport ? ` ${university.studentSupport}` : ""
          }`}
        />
      )}

      {hasHostelCostData && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <p className="font-display text-base font-semibold text-heading">
              Hostel cost by year
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Estimated annual hostel &amp; food costs in USD
            </p>
          </div>
          {publishedPrograms
            .filter((p) =>
              p.offering.yearlyCostBreakdown.some((y) =>
                hasPublishedUsdAmount(y.hostelUsd),
              ),
            )
            .map((program) => (
              <div key={program.offering.slug}>
                {publishedPrograms.length > 1 && (
                  <div className="border-b border-border/60 bg-muted/20 px-6 py-2.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {program.offering.title}
                    </p>
                  </div>
                )}
                <div className="border-b border-border/40">
                  <div className="grid grid-cols-3 gap-2 border-b border-border/60 bg-muted/20 px-6 py-2">
                    {["Year", "Hostel + food", "Total / yr"].map((h) => (
                      <span
                        key={h}
                        className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  <div className="divide-y divide-border/40">
                    {program.offering.yearlyCostBreakdown.map((year) => (
                      <div
                        key={year.yearLabel}
                        className="grid grid-cols-3 gap-2 px-6 py-3"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {year.yearLabel}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatUsdAmountOrTbd(year.hostelUsd, "—")}
                        </span>
                        <span className="text-sm font-bold text-accent">
                          {formatUsdAmountOrTbd(year.totalUsd)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {!university.hostelOverview &&
        !university.indianFoodSupport &&
        !university.campusLifestyle &&
        !university.safetyOverview &&
        !hasHostelCostData && (
          <p className="rounded-2xl border border-border bg-muted/30 px-6 py-5 text-sm text-muted-foreground">
            Hostel details are not yet published for this university. Contact us
            for the latest information.
          </p>
        )}
    </div>
  );
}

function DetailCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-2">
          {icon}
          <p className="font-display text-base font-semibold text-heading">
            {title}
          </p>
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-sm leading-7 text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
