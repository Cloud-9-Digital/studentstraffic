import { FileCheck2, Plane } from "lucide-react";

import { SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import type { CountryVisaContent } from "@/lib/data/country-visa";

export function CountryVisaSection({ countryName, countrySlug, visaContent }: { countryName: string; countrySlug: string; visaContent: CountryVisaContent | null }) {
  if (!visaContent) return null;
  return (
    <div className="deferred-render py-12 md:py-16">
      <SectionKicker icon={<Plane className="size-3.5" />} text="Student visa" />
      <SectionHeading>Visa process for studying in {countryName}</SectionHeading>
      <SectionIntro>{visaContent.summary}</SectionIntro>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {visaContent.steps.map((point) => (
          <div key={point.title} className="flex gap-3 rounded-[1.1rem] border border-border/60 bg-[#faf8f4] px-4 py-4">
            <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <div><p className="text-sm font-semibold text-foreground">{point.title}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{point.body}</p></div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[1.1rem] border border-border/60 bg-[#faf8f4] p-5">
        <div className="flex items-center gap-2"><FileCheck2 className="size-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">Documents commonly requested</h3></div>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          {visaContent.documents.map((document) => <li key={document}>• {document}</li>)}
        </ul>
      </div>
      <div className="mt-6">
        <CounsellingDialog triggerContent={`Get the current visa checklist for ${countryName}`} triggerVariant="outline" triggerSize="default" countrySlug={countrySlug} ctaVariant="country_visa_cta" title={`Visa guidance for ${countryName}`} description="Share your details and our counsellors will walk you through the current visa process for your shortlisted university." />
      </div>
    </div>
  );
}
