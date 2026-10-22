import { HelpCircle } from "lucide-react";

import { SectionHeading, SectionKicker } from "@/components/site/country/shared";
import { FaqDisclosureList } from "@/components/shared/faq-disclosure-list";

export function CountryFaqSection({
  countryName,
  faqs,
}: {
  countryName: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  if (!faqs.length) return null;

  return (
    <div className="py-12 md:py-16">
      <SectionKicker icon={<HelpCircle className="size-3.5" />} text="Frequently asked" />
      <SectionHeading>Common questions about studying in {countryName}</SectionHeading>

      <FaqDisclosureList
        items={faqs}
        name="country-faq"
        className="mt-8 max-w-3xl"
        questionClassName="font-display text-base font-semibold text-heading"
        answerClassName="text-sm leading-7 text-muted-foreground"
      />
    </div>
  );
}
