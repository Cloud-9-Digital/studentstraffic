import {
  BedDouble,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";

import type { University } from "@/lib/data/types";

import { InfoCard, SectionLabel } from "./shared";

export function UniversityStudentLifeSection({
  university,
}: {
  university: University;
}) {
  return (
    <div id="living" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Student living</SectionLabel>
      <div className="space-y-3">
        <InfoCard
          icon={<BedDouble className="size-4 text-accent" />}
          title="Campus environment"
          body={university.campusLifestyle}
        />
        <InfoCard
          icon={<BedDouble className="size-4 text-accent" />}
          title="Accommodation"
          body={university.hostelOverview}
        />
        <InfoCard
          icon={<UtensilsCrossed className="size-4 text-accent" />}
          title="Daily living support"
          body={university.indianFoodSupport}
        />
        <InfoCard
          icon={<ShieldCheck className="size-4 text-accent" />}
          title="Safety and support"
          body={`${university.safetyOverview} ${university.studentSupport}`.trim()}
        />
      </div>
    </div>
  );
}
