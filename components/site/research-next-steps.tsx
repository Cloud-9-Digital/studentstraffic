import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ResearchStep = {
  href: string;
  label: string;
  title: string;
  description: string;
};

export function ResearchNextSteps({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ResearchStep[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label="Next research steps" className="rounded-[1.75rem] border border-border bg-card/90 p-6 shadow-sm md:p-7">
      <div className="max-w-2xl">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
          Next research steps
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading md:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="group flex h-full flex-col rounded-2xl border border-border bg-background px-5 py-5 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm"
          >
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
              {item.label}
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-heading">
              {item.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
              {item.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
              Explore
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
