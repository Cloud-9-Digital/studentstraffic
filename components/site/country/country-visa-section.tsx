import { FileCheck2, Plane } from "lucide-react";

import { ResearchSlotNote, SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";
import { CounsellingDialog } from "@/components/site/counselling-dialog";

// General, honest, non-fabricated visa/travel guidance. This section is
// intentionally kept country-neutral until country-specific visa research is
// published — see the note at the bottom of the section for what still needs
// filling in per destination.
const GENERAL_VISA_POINTS = [
  {
    title: "It usually starts after your admission letter",
    body: "Most study destinations require a formal offer or invitation letter from the university before a student visa application can be filed.",
  },
  {
    title: "Expect a standard document set",
    body: "Passport, academic records, proof of funds, medical fitness, and health insurance are commonly requested — the exact list and format vary by embassy.",
  },
  {
    title: "Timelines vary by country and season",
    body: "Processing can range from a couple of weeks to a few months. Build in buffer time before your intake, especially in peak application months.",
  },
  {
    title: "Registration doesn't stop at arrival",
    body: "Many countries require a local registration step (migration, residence permit, or similar) within days of landing — your university's international office is usually the first point of contact.",
  },
];

export function CountryVisaSection({
  countryName,
  countrySlug,
}: {
  countryName: string;
  countrySlug: string;
}) {
  return (
    <div className="deferred-render py-12 md:py-16">
      <SectionKicker icon={<Plane className="size-3.5" />} text="Visa & getting there" />
      <SectionHeading>Planning the move to {countryName}</SectionHeading>
      <SectionIntro>
        Visa rules are set by embassies and change without much notice, so we keep this section to
        the general shape of the process. Once you shortlist a university, our team walks you
        through the exact, current requirements for your case.
      </SectionIntro>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {GENERAL_VISA_POINTS.map((point) => (
          <div key={point.title} className="flex gap-3 rounded-[1.1rem] border border-border/60 bg-[#faf8f4] px-4 py-4">
            <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{point.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{point.body}</p>
            </div>
          </div>
        ))}
      </div>

      <ResearchSlotNote>
        Country-specific visa steps, fees, and document formats for {countryName} are being
        researched and will be added here. Until then, our counsellors confirm the current
        requirements directly with the university and embassy for every student.
      </ResearchSlotNote>

      <div className="mt-6">
        <CounsellingDialog
          triggerContent={`Get the current visa checklist for ${countryName}`}
          triggerVariant="outline"
          triggerSize="default"
          countrySlug={countrySlug}
          ctaVariant="country_visa_cta"
          title={`Visa guidance for ${countryName}`}
          description="Share your details and our counsellors will walk you through the current visa process for your shortlisted university."
        />
      </div>
    </div>
  );
}
