import Link from "next/link";
import { ArrowUpRight, MapPin, DollarSign, Calendar } from "lucide-react";

import type { SearchDocumentType, SearchResult } from "@/lib/data/types";
import { formatCurrencyUsd, hasPublishedUsdAmount } from "@/lib/utils";

function getActionLabel(documentType: SearchDocumentType) {
  switch (documentType) {
    case "country":
      return "Open country guide";
    case "course":
      return "Open course guide";
    case "landing_page":
      return "Open guide";
    case "blog_post":
      return "Open article";
    case "program":
    case "university":
      return "Open university";
    default:
      return "Open result";
  }
}

function humanizeSlug(slug: string) {
  const specialLabels: Record<string, string> = {
    mbbs: "MBBS",
    bds: "BDS",
    nursing: "Nursing",
    "medical-pg": "Medical PG",
  };

  if (specialLabels[slug]) {
    return specialLabels[slug];
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getMetaItems(result: SearchResult) {
  const items: string[] = [];

  if (result.countrySlug && result.documentType !== "country") {
    items.push(humanizeSlug(result.countrySlug));
  }

  if (result.courseSlug && result.documentType !== "course") {
    items.push(humanizeSlug(result.courseSlug));
  }

  if (result.city) {
    items.push(result.city);
  }

  if (hasPublishedUsdAmount(result.annualTuitionUsd)) {
    items.push(`${formatCurrencyUsd(result.annualTuitionUsd)} / yr`);
  }

  if (result.medium) {
    items.push(result.medium);
  }

  if (result.intakeMonths.length) {
    items.push(`Intake ${result.intakeMonths.slice(0, 2).join(", ")}`);
  }

  return items.slice(0, 4);
}

function MetaBadge({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground/80">
      <Icon className="size-3.5" />
      <span>{children}</span>
    </div>
  );
}

export function SearchResultCard({ result }: { result: SearchResult }) {
  const metaItems = getMetaItems(result);
  const highlights = result.highlights.filter(Boolean).slice(0, 2);

  const hasFee = hasPublishedUsdAmount(result.annualTuitionUsd);
  const hasLocation = result.city || result.countrySlug;
  const hasIntake = result.intakeMonths.length > 0;

  return (
    <Link
      href={result.path}
      className="group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg active:translate-y-0"
    >
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {result.subtitle ? (
              <div className="mb-2 inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {result.subtitle}
              </div>
            ) : null}
            <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-heading transition-colors group-hover:text-primary md:text-2xl">
              {result.title}
            </h3>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground md:size-10">
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-5" />
          </div>
        </div>

        {/* Summary */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          {result.summary}
        </p>

        {/* Meta Badges */}
        {(hasLocation || hasFee || hasIntake) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hasLocation && (
              <MetaBadge icon={MapPin}>
                {result.city || humanizeSlug(result.countrySlug || "")}
              </MetaBadge>
            )}
            {hasFee && (
              <MetaBadge icon={DollarSign}>
                {formatCurrencyUsd(result.annualTuitionUsd!)}/yr
              </MetaBadge>
            )}
            {hasIntake && (
              <MetaBadge icon={Calendar}>
                {result.intakeMonths.slice(0, 2).join(", ")}
              </MetaBadge>
            )}
          </div>
        )}

        {/* Additional Meta Items (non-badge format) */}
        {metaItems.length > 0 && !hasLocation && !hasFee && !hasIntake && (
          <div className="mt-4 flex flex-wrap gap-2">
            {metaItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-lg bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground/80"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mt-4 space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3">
            {highlights.map((highlight) => (
              <p key={highlight} className="text-xs leading-relaxed text-foreground/75 md:text-sm">
                &quot;{highlight}&quot;
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="border-t border-border/40 bg-muted/20 px-5 py-3.5 transition-colors group-hover:bg-primary/5 md:px-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary md:text-base">
          {getActionLabel(result.documentType)}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
