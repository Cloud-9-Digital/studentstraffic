import { ArrowRight, Award, CheckCircle2 } from "lucide-react";

import { CounsellingCtaButton } from "@/components/site/counselling-cta-button";
import { SectionHeading, SectionKicker } from "@/components/site/country/shared";

export function CountryScholarshipsSection({ countryName, countrySlug, scholarshipInfo }: { countryName: string; countrySlug: string; scholarshipInfo: string }) {
  return (
    <div className="deferred-render py-12 md:py-16">
      <div className="overflow-hidden rounded-[1.75rem] border border-primary/20 bg-primary p-6 text-white sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <SectionKicker icon={<Award className="size-3.5" />} text="Scholarships and funding" tone="white" />
            <SectionHeading className="mt-3 max-w-[18ch] text-[1.9rem] text-white sm:text-[2.3rem] lg:text-[2.7rem]">
              Scholarships in {countryName}
            </SectionHeading>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-white/75 md:text-base md:leading-8">{scholarshipInfo}</p>
            <CounsellingCtaButton
              label="Check scholarship eligibility"
              countrySlug={countrySlug}
              ctaVariant="country_scholarship_eligibility"
              title={`Check your scholarship eligibility for ${countryName}`}
              description={`Share your academic details and preferred programme. We will check the scholarship options available for studying in ${countryName}.`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            />
          </div>

          <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">What we check</p>
            <div className="mt-4 divide-y divide-white/15">
              {["Academic marks and eligibility", "Programme, university and intake", "Scholarship coverage and remaining costs"].map((item) => (
                <div key={item} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-white/80" />
                  <span className="text-sm leading-6 text-white/85">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/60">
              <span>Get a clear answer for your profile</span>
              <ArrowRight className="size-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
