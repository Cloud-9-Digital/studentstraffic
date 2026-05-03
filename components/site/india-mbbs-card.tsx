import { Building2, Calendar, MapPin } from "lucide-react";

import type { IndiaMbbsCard } from "@/lib/data/types";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getManagementTone(management?: string) {
  if (management === "Govt.") {
    return "border-emerald-200/80 bg-emerald-50 text-emerald-800";
  }

  return "border-amber-200/80 bg-amber-50 text-amber-900";
}

function getDisplayCollegeName(name: string, city?: string) {
  if (!city) return name;

  const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const trailingCityPattern = new RegExp(`,\\s*${escapedCity}$`, "i");
  const cleaned = name.replace(trailingCityPattern, "").trim();

  return cleaned || name;
}

export function IndiaMbbsCardView({ college }: { college: IndiaMbbsCard }) {
  const initials = getInitials(college.collegeName);
  const location = college.cityName || college.stateName;
  const displayCollegeName = getDisplayCollegeName(
    college.collegeName,
    college.cityName,
  );

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <div className="relative flex items-start gap-3 p-3 pb-2.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#fff2c7_0%,#f7d46b_100%)] ring-1 ring-black/5">
          <span className="font-display text-[0.9rem] font-bold tracking-[0.08em] text-slate-800">
            {initials}
          </span>
        </div>

        <div className="min-w-0 flex-1 pr-16">
          <h3 className="text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
            {displayCollegeName}
          </h3>
        </div>

        <span
          className={cn(
            "absolute right-3 top-3 inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.625rem] font-semibold",
            getManagementTone(college.managementType),
          )}
        >
          <Building2 className="size-2.5" />
          {college.managementType ?? "Medical"}
        </span>
      </div>

      <div className="mt-auto border-t border-border bg-muted/20 px-3 py-2.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0">
              <p className="text-[0.625rem] font-medium text-muted-foreground">City</p>
              <p className="truncate text-sm font-semibold text-foreground">{location}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <div className="text-right">
              <p className="text-[0.625rem] font-medium text-muted-foreground">Established</p>
              <p className="text-sm font-semibold text-foreground">
                {college.yearOfInception ?? "N/A"}
              </p>
            </div>
            <Calendar className="size-3.5 shrink-0 text-muted-foreground/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
