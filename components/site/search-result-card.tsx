import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

export function SearchResultCard({ result }: { result: SearchResult }) {
  const metaItems = getMetaItems(result);
  const highlights = result.highlights.filter(Boolean).slice(0, 2);

  return (
    <Link
      href={result.path}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {result.subtitle ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {result.subtitle}
            </p>
          ) : null}
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-heading transition-colors group-hover:text-primary">
            {result.title}
          </h2>
        </div>

        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">{result.summary}</p>

      {metaItems.length ? (
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {metaItems.join(" · ")}
        </p>
      ) : null}

      {highlights.length ? (
        <div className="mt-4 space-y-1.5">
          {highlights.map((highlight) => (
            <p key={highlight} className="text-sm text-foreground/75">
              {highlight}
            </p>
          ))}
        </div>
      ) : null}

      <div className="mt-5 border-t border-border/70 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {getActionLabel(result.documentType)}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
