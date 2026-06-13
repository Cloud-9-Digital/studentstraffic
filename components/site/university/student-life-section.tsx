import {
  BedDouble,
  ShieldCheck,
  UtensilsCrossed,
  Trees,
} from "lucide-react";

import type { Country, FinderProgram, University } from "@/lib/data/types";

import { SectionLabel } from "./shared";

type Cell = {
  icon: React.ReactNode;
  label: string;
  body: string;
};

function LifeCell({ icon, label, body }: Cell) {
  return (
    <div className="bg-card p-5 space-y-2 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="text-accent [&_svg]:size-3.5">{icon}</span>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

export function UniversityStudentLifeSection({
  university,
  country,
  primaryProgram,
}: {
  university: University;
  country?: Country;
  primaryProgram?: FinderProgram;
}) {
  const safetyBody = `${university.safetyOverview} ${university.studentSupport}`.trim();
  const course = primaryProgram?.course.shortName ?? "MBBS";
  const countryName = country?.name ?? "the country";

  return (
    <div id="living" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Student living</SectionLabel>

      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold text-heading">
          Student life at {university.name}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          Day-to-day life for Indian students pursuing {course} at{" "}
          {university.name} in {university.city}, {countryName}. This covers
          accommodation, food, campus environment, safety, and the student
          support systems available to you during your {course} years.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-border grid gap-px sm:grid-cols-2">
        <LifeCell
          icon={<Trees />}
          label="Campus environment"
          body={university.campusLifestyle}
        />
        <LifeCell
          icon={<BedDouble />}
          label="Accommodation"
          body={university.hostelOverview}
        />
        <LifeCell
          icon={<UtensilsCrossed />}
          label="Daily living support"
          body={university.indianFoodSupport}
        />
        <LifeCell
          icon={<ShieldCheck />}
          label="Safety and support"
          body={safetyBody}
        />
      </div>
    </div>
  );
}
