import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronRight,
  CircleDollarSign,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Thermometer,
  Users,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { Button } from "@/components/ui/button";
import { catalogReviewedAt } from "@/lib/content-governance";
import {
  getProgramsForCity,
  getUniqueCities,
} from "@/lib/data/catalog";
import { getCityGuide } from "@/lib/data/city-guide";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getCitiesIndexHref,
  getCityHref,
  getCountryHref,
  getUniversityHref,
} from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getFaqStructuredData,
  getProgramItemListStructuredData,
  getItemListStructuredDataId,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";
import { formatCurrencyUsd, hasPublishedUsdAmount } from "@/lib/utils";
import { isValidRecognitionBadge } from "@/lib/data/recognition-bodies";

export async function generateStaticParams() {
  const cities = await getUniqueCities();
  const filteredCities = cities.filter((c) => c.universityCount >= 2);
  return ensureNonEmptyStaticParams(
    filteredCities.map((c) => ({ slug: c.slug })),
    { slug: "__city-fallback__" },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const programs = await getProgramsForCity(slug);

  if (!programs.length) {
    return { title: "City Not Found" };
  }

  const cityName = programs[0].university.city;
  const countryName = programs[0].country.name;
  const guide = getCityGuide(slug);

  const uniCount = new Set(programs.map((p) => p.university.slug)).size;
  const pricedPrograms = programs.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd),
  );
  const minTuition = pricedPrograms.length
    ? Math.min(...pricedPrograms.map((p) => p.offering.annualTuitionUsd))
    : null;
  const feeHint = minTuition ? ` from ${formatCurrencyUsd(minTuition)}/year` : "";

  const title = `MBBS in ${cityName}, ${countryName} 2026 | ${uniCount} Universities, Fees & Comparison`;
  const description =
    guide?.summary.slice(0, 155) ??
    `Compare ${uniCount} medical universities in ${cityName}, ${countryName} for MBBS${feeHint}. English-medium programs, fees, NMC recognition, and Indian student context.`;

  return buildIndexableMetadata({
    title,
    description,
    path: getCityHref(slug),
    keywords: [
      `MBBS in ${cityName}`,
      `MBBS in ${cityName} ${countryName}`,
      `medical university ${cityName}`,
      `MBBS ${cityName} fees`,
      `study medicine in ${cityName}`,
      `${cityName} medical college for Indian students`,
    ],
  });
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ icon, text }: { icon?: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
      {icon}
      {text}
    </div>
  );
}

function FactTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-border/60 bg-[#faf8f4] px-5 py-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatUsdRange(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  if (min === max || max === null) return min ? formatCurrencyUsd(min) : null;
  if (min === null) return max ? formatCurrencyUsd(max) : null;
  return `${formatCurrencyUsd(min)} – ${formatCurrencyUsd(max)}`;
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const programs = await getProgramsForCity(slug);

  if (!programs.length) {
    notFound();
  }

  const cityName = programs[0].university.city;
  const country = programs[0].country;
  const guide = getCityGuide(slug);

  const uniqueUniversityMap = new Map(
    programs.map((p) => [p.university.slug, p.university]),
  );
  const uniqueUniversities = Array.from(uniqueUniversityMap.values());
  const uniCount = uniqueUniversities.length;
  const publicCount = uniqueUniversities.filter((u) => u.type === "Public").length;
  const privateCount = uniqueUniversities.filter((u) => u.type === "Private").length;

  const pricedPrograms = programs.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd),
  );
  const tuitions = pricedPrograms.map((p) => p.offering.annualTuitionUsd);
  const minTuition = tuitions.length ? Math.min(...tuitions) : null;
  const maxTuition = tuitions.length ? Math.max(...tuitions) : null;
  const feeRange = formatUsdRange(minTuition, maxTuition);

  const uniqueCourses = [...new Set(programs.map((p) => p.course.shortName))];
  const allRecognitionBadges = [
    ...new Set(
      programs
        .flatMap((p) => p.university.recognitionBadges)
        .filter(isValidRecognitionBadge),
    ),
  ];
  const allMediums = [...new Set(programs.map((p) => p.offering.medium))];
  const allIntakeMonths = [...new Set(programs.flatMap((p) => p.offering.intakeMonths))].sort();

  const allCities = await getUniqueCities();
  const relatedCities = allCities
    .filter(
      (c) =>
        c.countrySlug === country.slug &&
        c.slug !== slug &&
        c.universityCount >= 2,
    )
    .slice(0, 6);

  const path = getCityHref(slug);

  const structuredData = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Cities", path: getCitiesIndexHref() },
      { name: `${cityName}, ${country.name}`, path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: `MBBS in ${cityName}`,
      description:
        guide?.summary ??
        `Compare ${uniCount} medical universities in ${cityName}, ${country.name} for MBBS.`,
      mainEntityId: programs.length ? getItemListStructuredDataId(path) : undefined,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    programs.length
      ? getProgramItemListStructuredData({
          path,
          name: `${cityName} medical university programs`,
          programs,
        })
      : null,
    guide?.faq.length
      ? getFaqStructuredData(
          guide.faq.map((f) => ({ question: f.question, answer: f.answer })),
          path,
        )
      : null,
  ];

  // Deduplicated programs for the comparison table
  const tablePrograms = programs
    .filter(
      (p, i, self) =>
        self.findIndex(
          (q) => q.university.slug === p.university.slug && q.course.slug === p.course.slug,
        ) === i,
    )
    .sort((a, b) => {
      const aFee = hasPublishedUsdAmount(a.offering.annualTuitionUsd)
        ? a.offering.annualTuitionUsd
        : Number.POSITIVE_INFINITY;
      const bFee = hasPublishedUsdAmount(b.offering.annualTuitionUsd)
        ? b.offering.annualTuitionUsd
        : Number.POSITIVE_INFINITY;
      return aFee - bFee;
    });

  return (
    <>
      <JsonLd data={getStructuredDataGraph(structuredData)} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0d1f1d]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(240,138,68,0.18),transparent),radial-gradient(ellipse_40%_50%_at_0%_60%,rgba(255,255,255,0.04),transparent)]"
        />
        <div aria-hidden className="hero-grid-lines absolute inset-0 opacity-20 pointer-events-none" />

        <div className="container-shell relative py-12 md:py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1.5 text-xs text-white/36">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href={getCitiesIndexHref()} className="hover:text-white/70 transition-colors">Cities</Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href={getCountryHref(country.slug)} className="hover:text-white/70 transition-colors">{country.name}</Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-white/60">{cityName}</span>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent/80">
              City Guide · {country.name}
            </p>

            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.9] tracking-tight text-white">
              MBBS in <em className="not-italic text-accent">{cityName}</em>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg md:leading-9">
              {guide?.summary ??
                `${uniCount} medical ${uniCount === 1 ? "university" : "universities"} in ${cityName}, ${country.name}. Compare fees, recognition, and programs to decide if this city is the right base for your MBBS.`}
            </p>

            {/* Stat pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-white/80">
                <Building2 className="size-3.5 text-white/40" />
                {uniCount} {uniCount === 1 ? "university" : "universities"}
              </span>
              {feeRange && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-white/80">
                  <CircleDollarSign className="size-3.5 text-white/40" />
                  {feeRange}/yr
                </span>
              )}
              {uniqueCourses.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-white/80"
                >
                  <GraduationCap className="size-3.5 text-white/40" />
                  {c}
                </span>
              ))}
              {allRecognitionBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300"
                >
                  <ShieldCheck className="size-3.5" />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <CounsellingDialog
                triggerContent={
                  <>
                    Book my free call
                    <ArrowRight className="size-4" />
                  </>
                }
                triggerVariant="accent"
                triggerSize="lg"
                countrySlug={country.slug}
                ctaVariant="city_hero"
                title={`Study MBBS in ${cityName}`}
                description={`Leave your number — we'll call you and tell you exactly which university in ${cityName} fits your NEET score and budget.`}
              />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/8 hover:text-white"
              >
                <Link href={getCountryHref(country.slug)}>
                  {country.name} guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      <div className="container-shell space-y-0 divide-y divide-border/60 pb-24">

        {/* ── OVERVIEW ───────────────────────────────────────────────── */}
        <div className="py-14 md:py-18">
          <SectionLabel icon={<MapPin className="size-3.5" />} text="City Overview" />

          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            {cityName} as an MBBS destination
          </h2>

          {guide ? (
            <div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-muted-foreground">
              <p>{guide.whyStudentsChoose}</p>
            </div>
          ) : (
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              {cityName} has {uniCount} published medical {uniCount === 1 ? "university" : "universities"} in {country.name}. Use the comparison table below to evaluate fees, recognition, and program medium before applying.
            </p>
          )}

          {/* Key fact tiles */}
          {guide && (
            <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {guide.keyFacts.map((fact) => (
                <FactTile key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </div>
          )}
        </div>

        {/* ── UNIVERSITY COMPARISON TABLE ────────────────────────────── */}
        <div className="py-14 md:py-18">
          <SectionLabel icon={<Building2 className="size-3.5" />} text="University Comparison" />

          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Medical universities in {cityName}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
            {uniCount} {uniCount === 1 ? "institution" : "institutions"} —
            {publicCount > 0 && ` ${publicCount} public`}
            {publicCount > 0 && privateCount > 0 && ","}
            {privateCount > 0 && ` ${privateCount} private`}.
            {feeRange && ` Annual tuition ranges from ${feeRange}.`}
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    University
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Type
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Annual tuition
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Medium
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recognition
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sr-only">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tablePrograms.map((program) => {
                  const badges = program.university.recognitionBadges.filter(isValidRecognitionBadge);
                  return (
                    <tr
                      key={`${program.university.slug}-${program.course.slug}`}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={getUniversityHref(program.university.slug)}
                          className="font-medium text-foreground transition-colors group-hover:text-accent"
                        >
                          {program.university.name}
                        </Link>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {program.course.shortName}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {program.university.type}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {hasPublishedUsdAmount(program.offering.annualTuitionUsd)
                          ? formatCurrencyUsd(program.offering.annualTuitionUsd)
                          : (
                            <span className="text-xs font-normal text-muted-foreground">
                              Check official fee
                            </span>
                          )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {program.offering.medium}
                      </td>
                      <td className="px-5 py-4">
                        {badges.length > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <ShieldCheck className="size-3 shrink-0" />
                            {badges.join(", ")}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Verify</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={getUniversityHref(program.university.slug)}
                          className="whitespace-nowrap text-xs font-medium text-accent hover:underline"
                        >
                          View details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Annual tuition in USD from published sources. Verify current fees directly with each university before submitting an application.
          </p>
        </div>

        {/* ── COST BREAKDOWN ─────────────────────────────────────────── */}
        {guide && (
          <div className="py-14 md:py-18">
            <SectionLabel icon={<CircleDollarSign className="size-3.5" />} text="Full Cost Breakdown" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              What MBBS in {cityName} actually costs
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
              A realistic picture of every expense — tuition, accommodation, food, personal costs, and the 6-year total. Use this before comparing options.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Expense
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Amount (USD)
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {guide.costBreakdown.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i === guide.costBreakdown.length - 1 ? "bg-muted/30 font-semibold" : "hover:bg-muted/20"}
                    >
                      <td className="px-5 py-4 text-sm text-foreground">{row.label}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground whitespace-nowrap">{row.amount}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground hidden sm:table-cell">{row.notes ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              All figures are estimates based on published rates and student-reported costs. Verify current fee schedules directly with each university before making any payment.
            </p>
          </div>
        )}

        {/* ── STUDENT LIFE ───────────────────────────────────────────── */}
        {guide && (
          <div className="py-14 md:py-18">
            <SectionLabel icon={<Users className="size-3.5" />} text="Student Life" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              Living in {cityName} as an Indian student
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Indian community */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="size-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Indian community
                  </p>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {guide.indianCommunity}
                </p>
              </div>

              {/* Monthly cost */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <CircleDollarSign className="size-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Monthly living cost
                  </p>
                </div>
                <p className="mb-2 text-2xl font-semibold text-foreground">
                  {guide.monthlyCostRange}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Excluding tuition and hostel. Budget separately for one-time arrival costs — visa, winter gear if applicable, and initial setup.
                </p>
              </div>

              {/* Climate */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Thermometer className="size-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Climate
                  </p>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {guide.climateContext}
                </p>
              </div>
            </div>

            {/* Safety — full width */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Safety
                </p>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                {guide.safetyContext}
              </p>
            </div>
          </div>
        )}

        {/* ── ADMISSION PROCESS ──────────────────────────────────────── */}
        {guide && (
          <div className="py-14 md:py-18">
            <SectionLabel icon={<BookOpen className="size-3.5" />} text="How to Get Admitted" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              Step-by-step admission process for {cityName}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
              What actually happens between deciding on {cityName} and sitting in your first lecture. Follow these steps in order.
            </p>

            <div className="mt-8 space-y-4">
              {guide.admissionSteps.map((step, i) => (
                <div key={step.title} className="flex gap-5 rounded-2xl border border-border bg-card px-6 py-5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-base font-semibold text-heading">{step.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {(allIntakeMonths.length > 0 || allMediums.length > 0) && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {allIntakeMonths.length > 0 && (
                  <div>
                    <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Intake months across {cityName} universities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allIntakeMonths.map((month) => (
                        <span
                          key={month}
                          className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-foreground"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Confirm the current cycle with your specific university before applying.
                    </p>
                  </div>
                )}
                {allMediums.length > 0 && (
                  <div>
                    <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Teaching mediums
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allMediums.map((medium) => (
                        <span
                          key={medium}
                          className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-foreground"
                        >
                          {medium}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CLINICAL TRAINING ──────────────────────────────────────── */}
        {guide && (
          <div className="py-14 md:py-18">
            <SectionLabel icon={<GraduationCap className="size-3.5" />} text="Clinical Training" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              What clinical years look like in {cityName}
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              {guide.clinicalTraining}
            </p>
          </div>
        )}

        {/* ── MID-PAGE CTA ───────────────────────────────────────────── */}
        <div className="py-14 md:py-18">
          <div className="rounded-2xl bg-primary px-8 py-10 md:px-12 md:py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Ready to apply?
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-heading-contrast md:text-3xl">
                  Know which {cityName} university fits your NEET score.
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-7 text-white/65">
                  Our counsellors have placed Indian students in universities across {country.name} this cycle. Book a free call — we call you with a direct recommendation.
                </p>
              </div>
              <div className="shrink-0">
                <CounsellingDialog
                  triggerContent={
                    <>
                      Book my free call
                      <ArrowRight className="size-4" />
                    </>
                  }
                  triggerVariant="accent"
                  triggerSize="lg"
                  triggerClassName="whitespace-nowrap"
                  countrySlug={country.slug}
                  ctaVariant="city_mid"
                  title={`Apply — ${cityName}`}
                  description={`Leave your number and we'll call you. Our experts know every university in ${cityName} and will match you to the right one based on your NEET score and budget.`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        {guide && guide.faq.length > 0 && (
          <div className="py-14 md:py-18">
            <SectionLabel text="FAQ" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              Questions about MBBS in {cityName}
            </h2>

            <div className="mt-8 space-y-4">
              {guide.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-border bg-card px-6 py-5"
                >
                  <h3 className="mb-2 text-base font-semibold text-heading">
                    {item.question}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── OTHER CITIES ───────────────────────────────────────────── */}
        {relatedCities.length > 0 && (
          <div className="py-14 md:py-18">
            <SectionLabel icon={<MapPin className="size-3.5" />} text={`Other cities in ${country.name}`} />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              Compare other {country.name} cities
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCities.map((city) => (
                <Link
                  key={city.slug}
                  href={getCityHref(city.slug)}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-all hover:border-accent/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                        {city.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {city.universityCount} {city.universityCount === 1 ? "university" : "universities"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href={getCountryHref(country.slug)}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                Full {country.name} guide
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM CTA BAND ──────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40">
        <div className="container-shell py-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            We handle the full process
          </p>
          <h2 className="font-display text-2xl font-semibold text-heading md:text-3xl">
            Application, documents, and visa — all done for you.
          </h2>
          <p className="mx-auto mt-3 mb-7 max-w-lg text-sm leading-7 text-muted-foreground">
            Our counsellors work with Indian students every admission cycle and know exactly which university in {cityName} fits your NEET score, budget, and NExT pathway. Book a free call and get a direct answer today.
          </p>
          <CounsellingDialog
            triggerContent={
              <>
                Book my free call
                <ArrowRight className="size-4" />
              </>
            }
            triggerVariant="accent"
            triggerSize="lg"
            countrySlug={country.slug}
            ctaVariant="city_bottom"
          />
        </div>
      </section>
    </>
  );
}
