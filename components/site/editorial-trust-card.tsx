import Link from "next/link";
import { ArrowUpRight, BadgeCheck, FileSearch, Link2 } from "lucide-react";

import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { trustPageLinks } from "@/lib/content-governance";
import { cn } from "@/lib/utils";

type SourceLink = {
  label: string;
  url: string;
};

export function EditorialTrustCard({
  title = "How we review this page",
  description = "This page is maintained to help students compare options with clearer sourcing, review dates, and editorial context.",
  lastReviewed,
  notes,
  sources,
  className,
}: {
  title?: string;
  description?: string;
  lastReviewed: string;
  notes?: string[];
  sources?: SourceLink[];
  className?: string;
}) {
  const visibleSources = sources?.slice(0, 4) ?? [];

  return (
    <section
      className={cn(
        "rounded-[1.75rem] border border-border bg-card/90 p-6 shadow-sm md:p-7",
        className
      )}
      aria-label="Editorial trust"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
            Editorial trust
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3">
          <ContentTrustPanel lastReviewed={lastReviewed} />
        </div>
      </div>

      {notes?.length ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {notes.slice(0, 3).map((note) => (
            <div
              key={note}
              className="rounded-2xl border border-border bg-background px-4 py-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-heading">
                <BadgeCheck className="size-4 text-accent" />
                Editorial note
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-background px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-heading">
            <FileSearch className="size-4 text-accent" />
            Trust pages
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {trustPageLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/25 hover:text-primary"
              >
                {item.label}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>

        {visibleSources.length ? (
          <div className="rounded-2xl border border-border bg-background px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-heading">
              <Link2 className="size-4 text-accent" />
              Primary sources checked
            </div>
            <div className="mt-4 space-y-2.5">
              {visibleSources.map((source) => (
                <a
                  key={`${source.label}-${source.url}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 rounded-xl border border-border px-3.5 py-3 text-sm text-foreground transition-colors hover:border-primary/25 hover:bg-muted/30 hover:text-primary"
                >
                  <span className="min-w-0">{source.label}</span>
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
