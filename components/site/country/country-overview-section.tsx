import ReactMarkdown from "react-markdown";
import { Compass, Globe2 } from "lucide-react";

import { SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";

export function CountryOverviewSection({
  countryName,
  overviewLead,
  whyStudentsChooseIt,
  showWhyStudentsChooseIt,
}: {
  countryName: string;
  overviewLead: string;
  whyStudentsChooseIt: string;
  showWhyStudentsChooseIt: boolean;
}) {
  return (
    <div id="country-overview" className="py-12 md:py-16">
      <SectionKicker icon={<Globe2 className="size-3.5" />} text="Country overview" />
      <SectionHeading>{countryName} as a study destination</SectionHeading>
      <SectionIntro>{overviewLead}</SectionIntro>

      {showWhyStudentsChooseIt ? (
        <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-border/60 bg-[#faf8f4] p-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Compass className="size-5" />
          </span>
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
              Why students choose {countryName}
            </p>
            <div className="prose-copy mt-3 space-y-4 text-[0.95rem] leading-7 text-muted-foreground [&_li]:mb-1 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
              <ReactMarkdown>{whyStudentsChooseIt}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
