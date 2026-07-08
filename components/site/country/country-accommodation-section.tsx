import { Home } from "lucide-react";

import { SectionHeading, SectionKicker } from "@/components/site/country/shared";

export function CountryAccommodationSection({
  countryName,
  hostelInfo,
}: {
  countryName: string;
  hostelInfo: string;
}) {
  return (
    <div className="deferred-render py-12 md:py-16">
      <SectionKicker icon={<Home className="size-3.5" />} text="Accommodation" />
      <SectionHeading>Where students actually live in {countryName}</SectionHeading>
      <p className="mt-5 max-w-3xl text-[0.95rem] leading-7 text-muted-foreground md:text-base md:leading-8">
        {hostelInfo}
      </p>
    </div>
  );
}
