import type { Faq } from "@/lib/data/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SectionLabel } from "./shared";

export function UniversityFaqSection({
  faq,
  universityName,
  city,
  primaryProgramShortName,
}: {
  faq: Faq[];
  universityName?: string;
  city?: string;
  primaryProgramShortName?: string;
}) {
  if (faq.length === 0) {
    return null;
  }

  const course = primaryProgramShortName ?? "this program";

  return (
    <div id="faq" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Frequently asked questions</SectionLabel>

      {universityName && (
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold text-heading">
            {course} at {universityName} — {faq.length} questions answered
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            These are the most common questions Indian students and families ask
            before applying for {course} at {universityName}
            {city ? `, ${city}` : ""}. Covering admissions, fees, recognition,
            eligibility, hostel, career outcomes, and the India-return pathway —
            everything you need before making your decision.
          </p>
        </div>
      )}

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
