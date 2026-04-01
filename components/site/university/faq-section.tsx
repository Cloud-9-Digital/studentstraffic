import type { Faq } from "@/lib/data/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SectionLabel } from "./shared";

export function UniversityFaqSection({ faq }: { faq: Faq[] }) {
  if (faq.length === 0) {
    return null;
  }

  return (
    <div id="faq" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Frequently asked questions</SectionLabel>
      <Accordion
        type="single"
        collapsible
        defaultValue="faq-0"
        className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
      >
        {faq.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
            className="border-b-0 px-6"
          >
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-7">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
