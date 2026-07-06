import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { RelatedContentItem } from "@/lib/data/related-content";

export function RelatedContentSection({ items }: { items: RelatedContentItem[] }) {
  if (!items.length) return null;

  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container-shell">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
          Related guides
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="group rounded-2xl border border-border bg-card px-5 py-5 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-semibold text-heading">
                  {item.title}
                </h3>
                <ArrowRight className="mt-1 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
              </div>
              {item.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
