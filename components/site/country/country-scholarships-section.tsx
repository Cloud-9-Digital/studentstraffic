import { Award } from "lucide-react";

import { SectionHeading, SectionKicker } from "@/components/site/country/shared";

export function CountryScholarshipsSection({
  countryName,
  scholarshipInfo,
}: {
  countryName: string;
  scholarshipInfo: string;
}) {
  return (
    <div className="deferred-render py-12 md:py-16">
      <div className="overflow-hidden rounded-[1.75rem] border border-accent/20 bg-gradient-to-br from-[#fff8f2] to-[#fff3e8] p-6 sm:p-8">
        <SectionKicker icon={<Award className="size-3.5" />} text="Scholarships & funding" />
        <SectionHeading className="text-[1.7rem] sm:text-[2rem] lg:text-[2.2rem]">
          Making {countryName} affordable
        </SectionHeading>
        <p className="mt-4 max-w-3xl text-[0.95rem] leading-7 text-muted-foreground md:text-base md:leading-8">
          {scholarshipInfo}
        </p>
      </div>
    </div>
  );
}
