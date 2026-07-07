import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  GraduationCap,
  Languages,
  MapPinned,
  Target,
} from "lucide-react";

import type { Country, FinderProgram, University } from "@/lib/data/types";
import {
  formatProgramAnnualFee,
  formatProgramDuration,
  formatProgramMedium,
  getProgramAnnualFeeLabel,
} from "@/lib/utils";

import { SectionLabel } from "./shared";
import { cn } from "@/lib/utils";

export function UniversitySnapshotSection({
  primaryProgram,
  university,
  country,
}: {
  primaryProgram: FinderProgram;
  university: University;
  country: Country;
}) {
  const stats = [
    {
      icon: <CircleDollarSign className="size-3.5" />,
      label: getProgramAnnualFeeLabel(primaryProgram.offering),
      value: formatProgramAnnualFee(primaryProgram.offering),
    },
    {
      icon: <Clock className="size-3.5" />,
      label: "Duration",
      value: formatProgramDuration(primaryProgram.offering.durationYears),
    },
    {
      icon: <Languages className="size-3.5" />,
      label: "Medium",
      value: formatProgramMedium(primaryProgram.offering.medium, country.slug),
    },
    {
      icon: <CalendarDays className="size-3.5" />,
      label: "Intake",
      value: primaryProgram.offering.intakeMonths.join(", "),
    },
    {
      icon: <MapPinned className="size-3.5" />,
      label: "Location",
      value: `${university.city}, ${country.name}`,
    },
    {
      icon: <GraduationCap className="size-3.5" />,
      label: "University type",
      value: university.type,
    },
  ];

  return (
    <div id="snapshot" className="scroll-mt-24 pb-10">
      <SectionLabel>At a glance</SectionLabel>
      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 bg-card px-5 py-4">
              <div className="flex items-center gap-1.5 text-accent">
                {stat.icon}
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground leading-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UniversityOverviewSection({
  university,
  country,
}: {
  university: University;
  country: Country;
}) {
  const fitCards = [
    {
      icon: <CheckCircle2 className="size-4" />,
      title: "Why students choose it",
      items: university.whyChoose,
      colorClasses: {
        header: "text-emerald-600",
        border: "border-emerald-200/70",
        bg: "bg-emerald-50/70",
        dot: "bg-emerald-500",
        iconBg: "bg-emerald-100 text-emerald-600",
      },
    },
    {
      icon: <AlertCircle className="size-4" />,
      title: "Things to consider",
      items: university.thingsToConsider,
      colorClasses: {
        header: "text-amber-600",
        border: "border-amber-200/70",
        bg: "bg-amber-50/70",
        dot: "bg-amber-500",
        iconBg: "bg-amber-100 text-amber-600",
      },
    },
    {
      icon: <Target className="size-4" />,
      title: "Best fit for",
      items: university.bestFitFor,
      colorClasses: {
        header: "text-accent",
        border: "border-accent/25",
        bg: "bg-accent/5",
        dot: "bg-accent",
        iconBg: "bg-accent/10 text-accent",
      },
    },
  ];

  return (
    <div id="overview" className="deferred-render scroll-mt-24 space-y-8 py-10">
      <SectionLabel>University overview</SectionLabel>

      {/* Editorial prose */}
      <div className="space-y-5">
        <p className="text-base leading-8 text-foreground md:text-[1.0625rem] md:leading-9">
          {university.summary}
        </p>

        {/* Campus lifestyle — left-border callout */}
        <div className="flex gap-4 border-l-2 border-accent/40 pl-5">
          <p className="text-sm leading-7 text-muted-foreground italic">
            {university.campusLifestyle}
          </p>
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground">
            <MapPinned className="size-3 text-muted-foreground" />
            {university.city}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground">
            <CalendarDays className="size-3 text-muted-foreground" />
            Est. {university.establishedYear}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground">
            <GraduationCap className="size-3 text-muted-foreground" />
            {university.type} University
          </span>
        </div>
      </div>

      {/* Fit cards — 3-col grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {fitCards.map((card) => (
          <div
            key={card.title}
            className={cn(
              "flex flex-col gap-4 rounded-2xl border p-5",
              card.colorClasses.border,
              card.colorClasses.bg,
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", card.colorClasses.iconBg)}>
                {card.icon}
              </span>
              <h3 className={cn("text-sm font-bold", card.colorClasses.header)}>
                {card.title}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {card.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                  <span className={cn("mt-[0.45rem] size-1.5 shrink-0 rounded-full", card.colorClasses.dot)} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

