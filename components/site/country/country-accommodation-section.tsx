import { Home } from "lucide-react";

import { CountryImagePlaceholder, SectionHeading, SectionKicker } from "@/components/site/country/shared";

export function CountryAccommodationSection({
  countryName,
  hostelInfo,
}: {
  countryName: string;
  hostelInfo: string;
}) {
  return (
    <div className="deferred-render py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <CountryImagePlaceholder label={`Accommodation in ${countryName}`} />
        <div>
          <SectionKicker icon={<Home className="size-3.5" />} text="Accommodation" />
          <SectionHeading>Choose the right accommodation.</SectionHeading>
          <p className="mt-5 text-[0.98rem] leading-7 text-muted-foreground md:text-base md:leading-8">{hostelInfo}</p>
        </div>
      </div>
    </div>
  );
}
