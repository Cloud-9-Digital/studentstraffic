import { CalendarClock, Coins, Landmark, Languages, Sun, Users } from "lucide-react";
import type { ReactNode } from "react";

import { CountryImagePlaceholder, FactTile, SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";

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
    <section className="py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <div>
          <SectionKicker icon={<Sun className="size-3.5" />} text={`Life in ${countryName}`} />
          <SectionHeading>Understand daily life in {countryName}.</SectionHeading>
          {climate ? <SectionIntro>{climate}</SectionIntro> : null}
          <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
            Language, weather, daily routines and local rules affect your study experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
          <CountryImagePlaceholder label={`A day in ${countryName}`} aspect="portrait" />
          {quickFacts.length ? (
            <div className="border-t border-border/60 sm:border-t-0 sm:border-l sm:pl-6">
              {quickFacts.map((fact) => (
                <FactTile key={fact.label} icon={iconForFact(fact.label)} label={fact.label} value={fact.value} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
