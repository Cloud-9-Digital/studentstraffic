import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  PencilLine,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { LeadForm } from "@/components/site/lead-form";
import { ComparisonTable } from "@/components/site/comparison-table";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  contentAuthorName,
  formatContentDate,
} from "@/lib/content-governance";
import { getCountryContent } from "@/lib/data/country-content";
import type { CountryContent } from "@/lib/data/country-content";
import type { FinderProgram } from "@/lib/data/types";
import {
  getAllComparisonPages,
  getComparisonGuidesForUniversity,
  getComparisonPageBySlug,
  type BudgetComparisonGuide,
  type ComparisonGuide,
  type ComparisonPage,
  type CountryComparisonGuide,
} from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCountryStructuredData,
  getCourseStructuredData,
  getStructuredDataGraph,
  getUniversityStructuredData,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { getComparisonHref, getUniversityHref } from "@/lib/routes";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";
import {
  formatCurrencyUsd,
  formatProgramAnnualFee,
  hasPublishedUsdAmount,
} from "@/lib/utils";

type DetailRow = {
  label: string;
  left: string;
  right: string;
  winner?: "left" | "right";
};

function getUniqueProgramsByUniversity(programs: FinderProgram[]) {
  const byUniversity = new Map<string, FinderProgram>();

  for (const program of programs) {
    if (!byUniversity.has(program.university.slug)) {
      byUniversity.set(program.university.slug, program);
    }
  }

  return [...byUniversity.values()];
}

function getTopPrograms(programs: FinderProgram[], limit = 4) {
  return getUniqueProgramsByUniversity(programs)
    .sort((left, right) => {
      const leftFee = hasPublishedUsdAmount(left.offering.annualTuitionUsd)
        ? left.offering.annualTuitionUsd
        : Number.MAX_SAFE_INTEGER;
      const rightFee = hasPublishedUsdAmount(right.offering.annualTuitionUsd)
        ? right.offering.annualTuitionUsd
        : Number.MAX_SAFE_INTEGER;

      if (leftFee !== rightFee) {
        return leftFee - rightFee;
      }

      return left.university.name.localeCompare(right.university.name);
    })
    .slice(0, limit);
}

function getFeeRange(programs: FinderProgram[]) {
  const fees = programs
    .map((program) => program.offering.annualTuitionUsd)
    .filter(hasPublishedUsdAmount);

  if (!fees.length) {
    return "Check fee details";
  }

  return `${formatCurrencyUsd(Math.min(...fees))} - ${formatCurrencyUsd(
    Math.max(...fees)
  )}`;
}

function getStartingFee(programs: FinderProgram[]) {
  const fees = programs
    .map((program) => program.offering.annualTuitionUsd)
    .filter(hasPublishedUsdAmount);

  if (!fees.length) {
    return null;
  }

  return Math.min(...fees);
}

function getWinnerByStartingFee(
  leftPrograms: FinderProgram[],
  rightPrograms: FinderProgram[]
): "left" | "right" | undefined {
  const leftFee = getStartingFee(leftPrograms);
  const rightFee = getStartingFee(rightPrograms);

  if (leftFee == null || rightFee == null || leftFee === rightFee) {
    return undefined;
  }

  return leftFee < rightFee ? "left" : "right";
}

function getTeachingMediumSummary(programs: FinderProgram[]) {
  const mediums = [...new Set(programs.map((program) => program.offering.medium))];

  if (!mediums.length) {
    return "Check program details";
  }

  return mediums.join(", ");
}

function getIntakeSummary(programs: FinderProgram[]) {
  const months = [...new Set(programs.flatMap((program) => program.offering.intakeMonths))];

  if (!months.length) {
    return "Check with university";
  }

  return months.slice(0, 4).join(", ");
}

function getCitySummary(programs: FinderProgram[]) {
  const cities = [...new Set(programs.map((program) => program.university.city))];
  return `${cities.length} cit${cities.length === 1 ? "y" : "ies"}`;
}

function getMonthlyLivingRange(countryContent: CountryContent | null | undefined) {
  const totalItem = countryContent?.costOfLiving.items.find((item) =>
    item.category.toLowerCase().includes("monthly total")
  );

  return totalItem?.range ?? "Check city-wise living cost";
}

function getQuickFactValue(
  countryContent: CountryContent | null | undefined,
  label: string
) {
  return (
    countryContent?.quickFacts.find(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    )?.value ?? "Check official details"
  );
}

function getCountryComparisonRows(
  guide: CountryComparisonGuide
): DetailRow[] {
  const leftContent = getCountryContent(guide.leftCountry.slug);
  const rightContent = getCountryContent(guide.rightCountry.slug);

  return [
    {
      label: "Listed universities",
      left: String(getUniqueProgramsByUniversity(guide.leftPrograms).length),
      right: String(getUniqueProgramsByUniversity(guide.rightPrograms).length),
    },
    {
      label: "Listed programs",
      left: String(guide.leftPrograms.length),
      right: String(guide.rightPrograms.length),
    },
    {
      label: "Annual fee range",
      left: getFeeRange(guide.leftPrograms),
      right: getFeeRange(guide.rightPrograms),
      winner: getWinnerByStartingFee(guide.leftPrograms, guide.rightPrograms),
    },
    {
      label: "Teaching medium",
      left: getTeachingMediumSummary(guide.leftPrograms),
      right: getTeachingMediumSummary(guide.rightPrograms),
    },
    {
      label: "Main intake months",
      left: getIntakeSummary(guide.leftPrograms),
      right: getIntakeSummary(guide.rightPrograms),
    },
    {
      label: "Climate",
      left: guide.leftCountry.climate,
      right: guide.rightCountry.climate,
    },
    {
      label: "Living cost estimate",
      left: getMonthlyLivingRange(leftContent),
      right: getMonthlyLivingRange(rightContent),
    },
    {
      label: "Admission cycle",
      left: getQuickFactValue(leftContent, "Admission cycle"),
      right:
        getQuickFactValue(rightContent, "Admission cycle") ===
        "Check official details"
          ? getQuickFactValue(rightContent, "Common intake")
          : getQuickFactValue(rightContent, "Admission cycle"),
    },
  ];
}

function getBudgetComparisonRows(
  guide: BudgetComparisonGuide
): DetailRow[] {
  const leftContent = getCountryContent(guide.leftCountry.slug);
  const rightContent = getCountryContent(guide.rightCountry.slug);

  return [
    {
      label: `Options under ${formatCurrencyUsd(guide.budgetUsd)}`,
      left: String(guide.leftPrograms.length),
      right: String(guide.rightPrograms.length),
      winner:
        guide.leftPrograms.length === guide.rightPrograms.length
          ? undefined
          : guide.leftPrograms.length > guide.rightPrograms.length
            ? "left"
            : "right",
    },
    {
      label: "Annual fee range",
      left: getFeeRange(guide.leftPrograms),
      right: getFeeRange(guide.rightPrograms),
      winner: getWinnerByStartingFee(guide.leftPrograms, guide.rightPrograms),
    },
    {
      label: "Listed universities",
      left: String(getUniqueProgramsByUniversity(guide.leftPrograms).length),
      right: String(getUniqueProgramsByUniversity(guide.rightPrograms).length),
    },
    {
      label: "City spread",
      left: getCitySummary(guide.leftPrograms),
      right: getCitySummary(guide.rightPrograms),
    },
    {
      label: "Teaching medium",
      left: getTeachingMediumSummary(guide.leftPrograms),
      right: getTeachingMediumSummary(guide.rightPrograms),
    },
    {
      label: "Living cost estimate",
      left: getMonthlyLivingRange(leftContent),
      right: getMonthlyLivingRange(rightContent),
    },
  ];
}

function getUniversityDecisionPoints(program: FinderProgram) {
  const points: string[] = [];

  if (program.university.whyChoose[0]) {
    points.push(program.university.whyChoose[0]);
  }

  if (program.university.thingsToConsider[0]) {
    points.push(program.university.thingsToConsider[0]);
  }

  points.push(`Teaching medium: ${program.offering.medium}`);

  if (program.offering.intakeMonths.length) {
    points.push(`Main intake: ${program.offering.intakeMonths.join(", ")}`);
  }

  return points.slice(0, 4);
}

function getCountryDecisionPoints(
  guide: CountryComparisonGuide | BudgetComparisonGuide,
  side: "left" | "right"
) {
  const country = side === "left" ? guide.leftCountry : guide.rightCountry;
  const programs = side === "left" ? guide.leftPrograms : guide.rightPrograms;
  const content = getCountryContent(country.slug);
  const points: string[] = [];
  const startingFee = getStartingFee(programs);

  if (startingFee != null) {
    points.push(
      `Published annual fees in the current list start from ${formatCurrencyUsd(
        startingFee
      )}.`
    );
  }

  points.push(
    `${getUniqueProgramsByUniversity(programs).length} university option${
      getUniqueProgramsByUniversity(programs).length === 1 ? "" : "s"
    } are currently listed.`
  );

  if (content?.eligibility.items[0]) {
    points.push(content.eligibility.items[0]);
  }

  if (content?.careerOpportunities[0]) {
    points.push(content.careerOpportunities[0]);
  }

  return points.slice(0, 4);
}

function getPageTitle(page: ComparisonPage) {
  switch (page.kind) {
    case "university":
      return `${page.left.university.name} vs ${page.right.university.name}`;
    case "country":
      return `${page.course.shortName} in ${page.leftCountry.name} vs ${page.rightCountry.name}`;
    case "budget":
      return `${page.course.shortName} under ${formatCurrencyUsd(
        page.budgetUsd
      )}: ${page.leftCountry.name} vs ${page.rightCountry.name}`;
    default:
      return "Comparison";
  }
}

function getPageDescription(page: ComparisonPage) {
  switch (page.kind) {
    case "university":
      return `Compare ${page.left.university.name} and ${page.right.university.name} by fees, teaching medium, city, recognition, and admission details for Indian students.`;
    case "country":
      return `Compare ${page.course.shortName} in ${page.leftCountry.name} and ${page.rightCountry.name} by fees, eligibility, climate, living cost, and university options for Indian students.`;
    case "budget":
      return `Compare ${page.course.shortName} options under ${formatCurrencyUsd(
        page.budgetUsd
      )} in ${page.leftCountry.name} and ${page.rightCountry.name} by fees, number of options, and student living costs.`;
    default:
      return "Comparison page";
  }
}

function getRelatedComparisonPages(
  currentPage: ComparisonPage,
  allPages: ComparisonPage[]
) {
  return allPages
    .filter((page) => page.slug !== currentPage.slug)
    .filter((page) => {
      if (currentPage.kind === "university") {
        return (
          page.kind === "university" &&
          (page.left.course.slug === currentPage.left.course.slug ||
            page.right.course.slug === currentPage.left.course.slug)
        );
      }

      if (currentPage.kind === "country") {
        return (
          page.kind === "country" &&
          page.course.slug === currentPage.course.slug &&
          (page.leftCountry.slug === currentPage.leftCountry.slug ||
            page.leftCountry.slug === currentPage.rightCountry.slug ||
            page.rightCountry.slug === currentPage.leftCountry.slug ||
            page.rightCountry.slug === currentPage.rightCountry.slug)
        );
      }

      return (
        page.kind === "budget" &&
        page.course.slug === currentPage.course.slug &&
        page.budgetUsd === currentPage.budgetUsd
      );
    })
    .slice(0, 4);
}

function ComparisonHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
      <div className="hero-grid-lines pointer-events-none absolute inset-0" />
      <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-24 -top-20 size-96 opacity-25" aria-hidden />
      <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-16 left-0 size-80 opacity-40" aria-hidden />

      <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))] py-12 md:py-16">
        <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
          <Link href="/guides" className="transition-colors hover:text-white/70">
            Guides
          </Link>
          <span>/</span>
          <Link href="/compare" className="transition-colors hover:text-white/70">
            Compare
          </Link>
        </nav>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          {kicker}
        </p>

        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 md:text-base md:leading-8">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <PencilLine className="size-3 shrink-0" />
            <span>
              By <span className="font-medium text-white/60">{contentAuthorName}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <CalendarDays className="size-3 shrink-0" />
            <span>
              Updated{" "}
              <span className="font-medium text-white/60">
                {formatContentDate(catalogReviewedAt)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailComparisonTable({
  leftLabel,
  rightLabel,
  rows,
}: {
  leftLabel: string;
  rightLabel: string;
  rows: DetailRow[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: "720px" }}>
          <thead>
            <tr className="border-b border-border">
              <th className="w-[160px] bg-muted/50 px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Metric
              </th>
              <th className="border-l border-border bg-primary/[0.03] px-4 py-3 text-left text-sm font-semibold text-foreground">
                {leftLabel}
              </th>
              <th className="border-l border-border bg-accent/[0.03] px-4 py-3 text-left text-sm font-semibold text-foreground">
                {rightLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.label}
                className={[
                  "border-b border-border",
                  index % 2 === 1 ? "bg-muted/20" : "",
                ].join(" ")}
              >
                <td className="bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  {row.label}
                </td>
                <td
                  className={[
                    "border-l border-border px-4 py-3 text-sm text-foreground",
                    row.winner === "left" ? "bg-[color:var(--status-green)]" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    {row.winner === "left" ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--status-green-fg)]" />
                    ) : null}
                    <span>{row.left}</span>
                  </div>
                </td>
                <td
                  className={[
                    "border-l border-border px-4 py-3 text-sm text-foreground",
                    row.winner === "right" ? "bg-[color:var(--status-green)]" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    {row.winner === "right" ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--status-green-fg)]" />
                    ) : null}
                    <span>{row.right}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComparePointsCard({
  title,
  items,
  href,
  actionLabel,
}: {
  title: string;
  items: string[];
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-heading">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
              <Check className="size-2.5 text-muted-foreground" />
            </span>
            <span className="text-sm leading-6 text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      {href && actionLabel ? (
        <Button asChild variant="ghost" size="sm" className="mt-5 -ml-2 px-2">
          <Link href={href}>
            {actionLabel}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

function LeadSection({
  sourcePath,
  title,
  description,
  courseSlug,
  countrySlug,
}: {
  sourcePath: string;
  title: string;
  description: string;
  courseSlug?: string;
  countrySlug?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)] p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Need help choosing?
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <LeadForm
          embedded
          className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
          sourcePath={sourcePath}
          ctaVariant="compare-page"
          title="Submit your details"
          description="Share your number and our team will contact you with the right options based on your budget, NEET profile, and country preference."
          submitLabel="Submit your details"
          courseSlug={courseSlug}
          countrySlug={countrySlug}
          stacked
        />
      </div>
    </section>
  );
}

function RelatedComparisonLinks({
  pages,
}: {
  pages: ComparisonPage[];
}) {
  if (!pages.length) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight text-heading">
        More comparison pages
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={getComparisonHref(page.slug)}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
              {page.kind === "university"
                ? page.left.course.shortName
                : page.course.shortName}
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-heading">
              {getPageTitle(page)}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {getPageDescription(page)}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open comparison
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UniversityComparisonDetail({
  guide,
  relatedPages,
}: {
  guide: ComparisonGuide;
  relatedPages: ComparisonPage[];
}) {
  const finderHref = `/universities?course=${guide.left.course.slug}`;
  const leftPoints = getUniversityDecisionPoints(guide.left);
  const rightPoints = getUniversityDecisionPoints(guide.right);

  return (
    <>
      <ComparisonHero
        kicker={`${guide.left.course.shortName} university comparison`}
        title={`${guide.left.university.name} vs ${guide.right.university.name}`}
        description={`Compare fees, teaching medium, city, hostel, recognition, and admission details to understand which university may suit you better.`}
      />

      <section className="py-10 md:py-14">
        <div className="container-shell space-y-12">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-heading">
                Compare key details
              </h2>
            </div>
            <ComparisonTable programs={[guide.left, guide.right]} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Fees and admission
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Course details in one place
              </h2>
              <div className="mt-5 grid gap-4">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-sm font-semibold text-heading">{guide.left.university.name}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Annual fee: {formatProgramAnnualFee(guide.left.offering)}. Teaching medium:{" "}
                    {guide.left.offering.medium}. Intake months:{" "}
                    {guide.left.offering.intakeMonths.join(", ") || "Check with university"}.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-sm font-semibold text-heading">{guide.right.university.name}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Annual fee: {formatProgramAnnualFee(guide.right.offering)}. Teaching medium:{" "}
                    {guide.right.offering.medium}. Intake months:{" "}
                    {guide.right.offering.intakeMonths.join(", ") || "Check with university"}.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Student life and support
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                What students usually check next
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-sm font-semibold text-heading">{guide.left.university.name}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {guide.left.university.hostelOverview}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {guide.left.university.studentSupport}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-sm font-semibold text-heading">{guide.right.university.name}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {guide.right.university.hostelOverview}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {guide.right.university.studentSupport}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-heading">
              Which option may suit whom?
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <ComparePointsCard
                title={guide.left.university.name}
                items={leftPoints}
                href={getUniversityHref(guide.left.university.slug)}
                actionLabel="Check full details"
              />
              <ComparePointsCard
                title={guide.right.university.name}
                items={rightPoints}
                href={getUniversityHref(guide.right.university.slug)}
                actionLabel="Check full details"
              />
            </div>
          </div>

          <LeadSection
            sourcePath={getComparisonHref(guide.slug)}
            title="Get help choosing between these universities"
            description="If you want help based on your budget, NEET score, or country preference, submit your details and our team will contact you."
            courseSlug={guide.left.course.slug}
            countrySlug={guide.left.country.slug}
          />

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="accent">
              <Link href={finderHref}>Compare more universities</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={guide.left.university.officialWebsite} target="_blank" rel="noreferrer">
                {guide.left.university.name} website
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={guide.right.university.officialWebsite} target="_blank" rel="noreferrer">
                {guide.right.university.name} website
              </Link>
            </Button>
          </div>

          <RelatedComparisonLinks pages={relatedPages} />
        </div>
      </section>
    </>
  );
}

function CountryComparisonDetail({
  guide,
  relatedPages,
}: {
  guide: CountryComparisonGuide;
  relatedPages: ComparisonPage[];
}) {
  const leftContent = getCountryContent(guide.leftCountry.slug);
  const rightContent = getCountryContent(guide.rightCountry.slug);
  const leftPrograms = getTopPrograms(guide.leftPrograms);
  const rightPrograms = getTopPrograms(guide.rightPrograms);

  return (
    <>
      <ComparisonHero
        kicker={`${guide.course.shortName} country comparison`}
        title={`${guide.course.shortName} in ${guide.leftCountry.name} vs ${guide.rightCountry.name}`}
        description={`This page compares fees, climate, eligibility, living cost, and current university options for Indian students considering ${guide.course.shortName} in these two countries.`}
      />

      <section className="py-10 md:py-14">
        <div className="container-shell space-y-12">
          <div>
            <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-heading">
              Compare key details
            </h2>
            <DetailComparisonTable
              leftLabel={guide.leftCountry.name}
              rightLabel={guide.rightCountry.name}
              rows={getCountryComparisonRows(guide)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {guide.leftCountry.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Eligibility and admission
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {leftContent?.eligibility.intro ?? guide.leftCountry.summary}
              </p>
              <ul className="mt-4 space-y-3">
                {(leftContent?.eligibility.items ?? []).slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm font-semibold text-heading">Admission process</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {(leftContent?.admissionSteps ?? []).slice(0, 2).join(" ")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {guide.rightCountry.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Eligibility and admission
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {rightContent?.eligibility.intro ?? guide.rightCountry.summary}
              </p>
              <ul className="mt-4 space-y-3">
                {(rightContent?.eligibility.items ?? []).slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm font-semibold text-heading">Admission process</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {(rightContent?.admissionSteps ?? []).slice(0, 2).join(" ")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-heading">
              Which option may suit whom?
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <ComparePointsCard
                title={guide.leftCountry.name}
                items={getCountryDecisionPoints(guide, "left")}
              />
              <ComparePointsCard
                title={guide.rightCountry.name}
                items={getCountryDecisionPoints(guide, "right")}
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {guide.leftCountry.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Universities to check
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {guide.leftCountry.whyStudentsChooseIt}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {leftPrograms.map((program, index) => (
                  <UniversityCard
                    key={program.offering.slug}
                    program={program}
                    imagePriority={index < 2}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {guide.rightCountry.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Universities to check
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {guide.rightCountry.whyStudentsChooseIt}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {rightPrograms.map((program, index) => (
                  <UniversityCard
                    key={program.offering.slug}
                    program={program}
                    imagePriority={index < 2}
                  />
                ))}
              </div>
            </div>
          </div>

          <LeadSection
            sourcePath={getComparisonHref(guide.slug)}
            title={`Get help choosing between ${guide.leftCountry.name} and ${guide.rightCountry.name}`}
            description={`If you want help based on your budget, NEET profile, or preferred country, submit your details and our team will contact you.`}
            courseSlug={guide.course.slug}
          />

          <RelatedComparisonLinks pages={relatedPages} />
        </div>
      </section>
    </>
  );
}

function BudgetComparisonDetail({
  guide,
  relatedPages,
}: {
  guide: BudgetComparisonGuide;
  relatedPages: ComparisonPage[];
}) {
  const leftContent = getCountryContent(guide.leftCountry.slug);
  const rightContent = getCountryContent(guide.rightCountry.slug);
  const leftPrograms = getTopPrograms(guide.leftPrograms);
  const rightPrograms = getTopPrograms(guide.rightPrograms);

  return (
    <>
      <ComparisonHero
        kicker={`${guide.course.shortName} under ${formatCurrencyUsd(guide.budgetUsd)}`}
        title={`${guide.leftCountry.name} vs ${guide.rightCountry.name} under ${formatCurrencyUsd(guide.budgetUsd)}`}
        description={`This page compares which country currently has more ${guide.course.shortName} options inside this annual fee range, along with teaching medium, living cost, and student planning points.`}
      />

      <section className="py-10 md:py-14">
        <div className="container-shell space-y-12">
          <div>
            <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-heading">
              Compare key details
            </h2>
            <DetailComparisonTable
              leftLabel={guide.leftCountry.name}
              rightLabel={guide.rightCountry.name}
              rows={getBudgetComparisonRows(guide)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                What this budget means
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                {guide.leftCountry.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                This budget currently covers {guide.leftPrograms.length} listed{" "}
                {guide.course.shortName} option{guide.leftPrograms.length === 1 ? "" : "s"} in{" "}
                {guide.leftCountry.name}. The published fee range in the current
                list is {getFeeRange(guide.leftPrograms)}.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {leftContent?.hostelInfo ?? guide.leftCountry.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                What this budget means
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                {guide.rightCountry.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                This budget currently covers {guide.rightPrograms.length} listed{" "}
                {guide.course.shortName} option{guide.rightPrograms.length === 1 ? "" : "s"} in{" "}
                {guide.rightCountry.name}. The published fee range in the current
                list is {getFeeRange(guide.rightPrograms)}.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {rightContent?.hostelInfo ?? guide.rightCountry.summary}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-heading">
              Which option may suit whom?
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <ComparePointsCard
                title={guide.leftCountry.name}
                items={getCountryDecisionPoints(guide, "left")}
              />
              <ComparePointsCard
                title={guide.rightCountry.name}
                items={getCountryDecisionPoints(guide, "right")}
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {guide.leftCountry.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Universities inside this budget
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {leftPrograms.map((program, index) => (
                  <UniversityCard
                    key={program.offering.slug}
                    program={program}
                    imagePriority={index < 2}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {guide.rightCountry.name}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                Universities inside this budget
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {rightPrograms.map((program, index) => (
                  <UniversityCard
                    key={program.offering.slug}
                    program={program}
                    imagePriority={index < 2}
                  />
                ))}
              </div>
            </div>
          </div>

          <LeadSection
            sourcePath={getComparisonHref(guide.slug)}
            title={`Get help choosing the right option under ${formatCurrencyUsd(guide.budgetUsd)}`}
            description={`If you want help finding the right ${guide.course.shortName} option in your budget, submit your details and our team will contact you.`}
            courseSlug={guide.course.slug}
          />

          <RelatedComparisonLinks pages={relatedPages} />
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const pages = await getAllComparisonPages();
  return ensureNonEmptyStaticParams(
    pages.map((page) => ({ slug: page.slug })),
    { slug: "__comparison-fallback__" }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getComparisonPageBySlug(slug);

  if (!page) {
    return { title: "Comparison Not Found" };
  }

  const path = getComparisonHref(page.slug);

  switch (page.kind) {
    case "university":
      return buildIndexableMetadata({
        title: `${page.left.university.name} vs ${page.right.university.name} | Fees, Eligibility and Admission Details`,
        description: getPageDescription(page),
        path,
        keywords: [
          `${page.left.university.name} vs ${page.right.university.name}`,
          `${page.left.course.shortName} in ${page.left.country.name}`,
          `${page.right.course.shortName} in ${page.right.country.name}`,
          `${page.left.university.name} fees`,
          `${page.right.university.name} fees`,
        ],
      });
    case "country":
      return buildIndexableMetadata({
        title: `${page.course.shortName} in ${page.leftCountry.name} vs ${page.rightCountry.name} | Fees, Eligibility and Cost Comparison`,
        description: getPageDescription(page),
        path,
        keywords: [
          `${page.course.shortName} in ${page.leftCountry.name} vs ${page.rightCountry.name}`,
          `${page.leftCountry.name} vs ${page.rightCountry.name} for ${page.course.shortName}`,
          `${page.course.shortName} abroad country comparison`,
        ],
      });
    case "budget":
      return buildIndexableMetadata({
        title: `${page.course.shortName} under ${formatCurrencyUsd(page.budgetUsd)} | ${page.leftCountry.name} vs ${page.rightCountry.name}`,
        description: getPageDescription(page),
        path,
        keywords: [
          `${page.course.shortName} under ${formatCurrencyUsd(page.budgetUsd)}`,
          `${page.leftCountry.name} vs ${page.rightCountry.name} under ${formatCurrencyUsd(
            page.budgetUsd
          )}`,
          `low cost ${page.course.shortName} abroad`,
        ],
      });
    default:
      return { title: "Comparison" };
  }
}

export default async function ComparisonGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getComparisonPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const path = getComparisonHref(page.slug);
  const courseStructuredData =
    page.kind === "university"
      ? getCourseStructuredData(page.left.course)
      : getCourseStructuredData(page.course);

  const structuredDataItems: unknown[] = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Compare", path: "/compare" },
      { name: getPageTitle(page), path },
    ]),
    courseStructuredData,
    getWebPageStructuredData({
      path,
      name: getPageTitle(page),
      description: getPageDescription(page),
      aboutIds: [courseStructuredData["@id"]],
      dateModified: catalogReviewedAt,
      datePublished: catalogReviewedAt,
    }),
  ];

  if (page.kind === "university") {
    const leftUniversityStructuredData = getUniversityStructuredData({
      university: page.left.university,
      country: page.left.country,
      programs: [page.left],
      sameAs: page.left.university.recognitionLinks.map((item) => item.url),
    });
    const rightUniversityStructuredData = getUniversityStructuredData({
      university: page.right.university,
      country: page.right.country,
      programs: [page.right],
      sameAs: page.right.university.recognitionLinks.map((item) => item.url),
    });
    structuredDataItems.push(
      getCountryStructuredData(page.left.country),
      getCountryStructuredData(page.right.country),
      leftUniversityStructuredData,
      rightUniversityStructuredData
    );
  }

  if (page.kind === "country" || page.kind === "budget") {
    structuredDataItems.push(
      getCountryStructuredData(page.leftCountry),
      getCountryStructuredData(page.rightCountry)
    );
  }

  const allPages = await getAllComparisonPages();
  const relatedPages = getRelatedComparisonPages(page, allPages);

  if (page.kind === "university") {
    const universityRelated = await Promise.all([
      getComparisonGuidesForUniversity(page.left.university.slug, 4),
      getComparisonGuidesForUniversity(page.right.university.slug, 4),
    ]);
    const relatedUniversityGuides = [...universityRelated[0], ...universityRelated[1]]
      .filter((guide) => guide.slug !== page.slug)
      .filter(
        (guide, index, guides) =>
          guides.findIndex((entry) => entry.slug === guide.slug) === index
      );
    const mergedRelatedPages = [
      ...relatedUniversityGuides,
      ...relatedPages.filter((entry) => entry.kind === "university"),
    ].filter(
      (entry, index, entries) =>
        entries.findIndex((item) => item.slug === entry.slug) === index
    );

    return (
      <>
        <UniversityComparisonDetail
          guide={page}
          relatedPages={mergedRelatedPages.slice(0, 4)}
        />
        <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
      </>
    );
  }

  if (page.kind === "country") {
    return (
      <>
        <CountryComparisonDetail guide={page} relatedPages={relatedPages} />
        <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
      </>
    );
  }

  return (
    <>
      <BudgetComparisonDetail guide={page} relatedPages={relatedPages} />
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
