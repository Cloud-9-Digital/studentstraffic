import { CalendarClock, Coins, Landmark, Languages, Sun, Users } from "lucide-react";
import type { ReactNode } from "react";

import { FactTile, SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";

const FACT_ICONS: Record<string, ReactNode> = {
  capital: <Landmark className="size-4" />,
  "official language": <Languages className="size-4" />,
  population: <Users className="size-4" />,
  "time zone": <CalendarClock className="size-4" />,
  currency: <Coins className="size-4" />,
};

function iconForFact(label: string): ReactNode {
  return FACT_ICONS[label.toLowerCase()] ?? <CalendarClock className="size-4" />;
}

export function CountryLifeSection({
  countryName,
  climate,
  quickFacts,
}: {
  countryName: string;
  climate: string;
  quickFacts: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="py-12 md:py-16">
      <SectionKicker icon={<Sun className="size-3.5" />} text={`Life in ${countryName}`} />
      <SectionHeading>Climate, culture &amp; the essentials</SectionHeading>
      {climate ? <SectionIntro>{climate}</SectionIntro> : null}

      {quickFacts.length ? (
        <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {quickFacts.map((fact) => (
            <FactTile
              key={fact.label}
              icon={iconForFact(fact.label)}
              label={fact.label}
              value={fact.value}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
