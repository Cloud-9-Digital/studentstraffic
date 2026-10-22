import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

/**
 * FAQ list built on native <details>, so every answer is in the server HTML.
 * Radix Accordion renders a closed panel's children only after it opens,
 * which left all but the first answer out of the page for crawlers and answer
 * engines that do not run JavaScript, while FAQPage JSON-LD still claimed
 * them. A shared `name` makes the group exclusive, like `type="single"`.
 */
export function FaqDisclosureList({
  items,
  name,
  defaultOpenIndex,
  className,
  itemClassName,
  questionClassName,
  answerClassName,
}: {
  items: FaqItem[];
  /** Unique per list on the page; opening one item closes the others. */
  name: string;
  defaultOpenIndex?: number;
  className?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
}) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <details
          key={item.question}
          name={name}
          open={index === defaultOpenIndex}
          className={cn("group border-b last:border-b-0", itemClassName)}
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden",
              questionClassName
            )}
          >
            <h3>{item.question}</h3>
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className={cn("pt-0 pb-4 text-sm", answerClassName)}>
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
