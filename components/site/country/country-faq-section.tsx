import { HelpCircle } from "lucide-react";

import { SectionHeading, SectionKicker } from "@/components/site/country/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      <Accordion type="single" collapsible className="mt-8 max-w-3xl">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-display text-base font-semibold text-heading">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-7 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
