"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqSection } from "@/lib/data/university-faq-sections";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./shared";

export function TabbedFaqSection({
  sections,
  universityName,
  city,
  primaryProgramShortName,
}: {
  sections: FaqSection[];
  universityName?: string;
  city?: string;
  primaryProgramShortName?: string;
}) {
  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug ?? "");

  const activeSection = sections.find((s) => s.slug === activeSlug) ?? sections[0];
  const totalCount = sections.reduce((sum, s) => sum + s.faqs.length, 0);
  const course = primaryProgramShortName ?? "this program";

  if (!sections.length) return null;

  return (
    <div id="faq" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Frequently asked questions</SectionLabel>

      {universityName && (
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold text-heading">
            {course} at {universityName} — {totalCount} questions answered
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Browse by topic using the tabs below. Every question Indian students
            and parents ask before applying
            {city ? ` for ${course} in ${city}` : ""} — covering admissions,
            fees, practical training, visa, career pathways, and more.
          </p>
        </div>
      )}

      {/* Tab pills */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [-webkit-overflow-scrolling:touch]">
          {sections.map((section) => (
            <button
              key={section.slug}
              onClick={() => setActiveSlug(section.slug)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeSlug === section.slug
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {section.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold leading-none",
                  activeSlug === section.slug
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {section.faqs.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ accordion for active section */}
      {activeSection && (
        <Accordion
          key={activeSection.slug}
          type="single"
          collapsible
          defaultValue="faq-0"
          className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
        >
          {activeSection.faqs.map((item, index) => (
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
      )}

      {/* Section counter */}
      <p className="text-xs text-muted-foreground">
        Showing {activeSection?.faqs.length ?? 0} of {totalCount} questions
        &middot; select a tab above to explore another topic
      </p>
    </div>
  );
}
