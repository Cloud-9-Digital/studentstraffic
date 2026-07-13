"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  BudgetComparisonGuideSummary,
  ComparisonGuideSummary,
  CountryComparisonGuideSummary,
} from "@/lib/discovery-pages";
import { getComparisonHref } from "@/lib/routes";
import { formatCurrencyUsd } from "@/lib/utils";

type ComparisonType = "university" | "country" | "budget";
type Guide =
  | ComparisonGuideSummary
  | CountryComparisonGuideSummary
  | BudgetComparisonGuideSummary;

function CompareEntryCard({
  title,
  description,
  href,
  footer,
  kicker,
}: {
  title: string;
  description: string;
  href: string;
  footer: string;
  kicker: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
        {title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{description}</p>
      <div className="mt-5 border-t border-border/70 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {footer}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function renderGuide(guide: Guide) {
  if (guide.kind === "university") {
    return (
      <CompareEntryCard
        key={guide.slug}
        kicker={guide.left.course.shortName}
        title={`${guide.left.university.name} vs ${guide.right.university.name}`}
        description="Compare annual fees, teaching medium, city, recognition, and admission details for Indian students."
        href={getComparisonHref(guide.slug)}
        footer="Open comparison"
      />
    );
  }

  if (guide.kind === "country") {
    return (
      <CompareEntryCard
        key={guide.slug}
        kicker={`${guide.course.shortName} country comparison`}
        title={`${guide.leftCountry.name} vs ${guide.rightCountry.name}`}
        description={`Compare ${guide.course.shortName} in ${guide.leftCountry.name} and ${guide.rightCountry.name} by fees, climate, eligibility, and student living costs.`}
        href={getComparisonHref(guide.slug)}
        footer="Open comparison"
      />
    );
  }

  const leftRange = `${formatCurrencyUsd(guide.leftStats.minimumAnnualTuitionUsd)} - ${formatCurrencyUsd(guide.leftStats.maximumAnnualTuitionUsd)}`;
  const rightRange = `${formatCurrencyUsd(guide.rightStats.minimumAnnualTuitionUsd)} - ${formatCurrencyUsd(guide.rightStats.maximumAnnualTuitionUsd)}`;
  return (
    <CompareEntryCard
      key={guide.slug}
      kicker={`${guide.course.shortName} under ${formatCurrencyUsd(guide.budgetUsd)}`}
      title={`${guide.leftCountry.name} vs ${guide.rightCountry.name}`}
      description={`${guide.leftStats.programCount} options in ${guide.leftCountry.name} and ${guide.rightStats.programCount} options in ${guide.rightCountry.name}. Fee range: ${leftRange} and ${rightRange}.`}
      href={getComparisonHref(guide.slug)}
      footer="Open comparison"
    />
  );
}

export function ComparisonDirectorySection({
  type,
  initialGuides,
  total,
  eyebrow,
  title,
  description,
  bordered = false,
}: {
  type: ComparisonType;
  initialGuides: Guide[];
  total: number;
  eyebrow: string;
  title: string;
  description: string;
  bordered?: boolean;
}) {
  const [guides, setGuides] = useState(initialGuides);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const response = await fetch(`/api/comparisons?type=${type}&offset=${guides.length}`);
      if (!response.ok) throw new Error("Unable to load comparisons.");
      const payload = (await response.json()) as { guides: Guide[] };
      setGuides((current) => [...current, ...payload.guides]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={bordered ? "border-t border-border py-16 md:py-20" : "section-space"}>
      <div className="container-shell">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{guides.map(renderGuide)}</div>
        {guides.length < total ? (
          <div className="mt-8 flex justify-center">
            <Button type="button" variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Show more comparisons
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
