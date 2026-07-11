import ReactMarkdown from "react-markdown";
import { ArrowUpRight, Compass, Globe2 } from "lucide-react";

import { SectionHeading, SectionKicker } from "@/components/site/country/shared";

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
    <section id="country-overview" className="py-10 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(250px,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
        <div>
          <SectionKicker icon={<Globe2 aria-hidden="true" className="size-3.5" />} text="Country overview" />
          <SectionHeading className="max-w-[13ch] text-[2.2rem] sm:text-5xl lg:text-[3.35rem]">
            Is {countryName} right for you?
          </SectionHeading>
          <a
            href="#study-fields"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
          >
            See the study options
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div className="min-w-0">
          <p className="max-w-3xl text-[1.05rem] leading-7 text-foreground sm:text-[1.35rem] sm:leading-9">
            {overviewLead}
          </p>

          {showWhyStudentsChooseIt ? (
            <div className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-primary/10 bg-primary p-5 text-white sm:mt-10 sm:p-8 lg:p-10">
              <div aria-hidden="true" className="hero-grid-lines pointer-events-none absolute inset-0 opacity-25" />
              <div className="relative">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <Compass aria-hidden="true" className="size-5" />
                    </span>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                      Why students choose this country
                    </p>
                  </div>
                  <span aria-hidden="true" className="font-display text-4xl leading-none text-white/20">01</span>
                </div>

                <div className="mt-6 max-w-2xl text-[0.94rem] leading-6 text-white/76 sm:mt-7 sm:text-base sm:leading-8 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-accent [&_ol]:space-y-3 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:space-y-3"
                >
                  <ReactMarkdown>{whyStudentsChooseIt}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
