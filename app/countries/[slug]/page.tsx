import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  GraduationCap,
  Globe2,
  MapPin,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { DeferredCurrencyConverter } from "@/components/site/deferred-currency-converter";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { RegulatoryAdvisoryPanel } from "@/components/site/regulatory-advisory-panel";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import { catalogReviewedAt } from "@/lib/content-governance";
import {
  getCountries,
  getCountryBySlug,
  getLandingPageBySlug,
  getProgramsForCountry,
} from "@/lib/data/catalog";
import { and, eq, ilike } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { getRecommendedBudgetGuideForCourse } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCountryStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCountryHeroImage } from "@/lib/country-media";
import { isValidRecognitionBadge } from "@/lib/data/recognition-bodies";
import { getInrExchangeRate } from "@/lib/exchange-rate";
import { getLandingPageHref } from "@/lib/routes";
import { getCountryContent } from "@/lib/data/country-content";
import { getCountryRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import {
  cn,
  formatCurrencyUsd,
  formatProgramDuration,
  hasPublishedUsdAmount,
} from "@/lib/utils";


export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    return { title: "Country Not Found" };
  }

  const programs = await getProgramsForCountry(country.slug);
  const primaryCourse = programs[0]?.course.shortName;
  const title = primaryCourse
    ? `Study ${primaryCourse} in ${country.name} | Universities, Fees, Cities & Teaching`
    : `Study in ${country.name} | Universities, Fees, Cities & Teaching`;
  const description = primaryCourse
    ? `Compare ${primaryCourse} universities in ${country.name} by fees, city, teaching medium, and NMC recognition. Intake details and student support context for Indian students.`
    : `Compare universities in ${country.name} by fees, city, and teaching medium. Intake details and student support context for Indian students.`;

  return buildIndexableMetadata({
    title,
    description,
    path: `/countries/${country.slug}`,
    keywords: [
      `study in ${country.name}`,
      primaryCourse ? `${primaryCourse} in ${country.name}` : undefined,
      primaryCourse ? `${primaryCourse} ${country.name} fees` : undefined,
      `${country.name} universities`,
      `${country.name} medical university`,
    ].filter(Boolean) as string[],
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const programs = await getProgramsForCountry(country.slug);
  const primaryProgram = programs[0];
  const curatedLandingPageHref = primaryProgram
    ? getLandingPageHref(primaryProgram.course.slug, country.slug)
    : null;
  const previewPrograms = programs.slice(0, 3);

  const path = `/countries/${country.slug}`;
  const countryPageDescription = primaryProgram
    ? `Explore ${country.name} as a study destination for ${primaryProgram.course.shortName} with universities, fee range, city spread, teaching language, and intake context.`
    : `Explore ${country.name} as a study destination with universities, fee range, city spread, teaching language, and intake context.`;
  const countryStructuredData = getCountryStructuredData(country);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Countries", path: "/countries" },
      { name: country.name, path },
    ]),
    countryStructuredData,
    getCollectionPageStructuredData({
      path,
      name: `Study in ${country.name}`,
      description: countryPageDescription,
      aboutIds: [countryStructuredData["@id"]],
      mainEntityId: programs.length ? getItemListStructuredDataId(path) : undefined,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    programs.length
      ? getProgramItemListStructuredData({
          path,
          name: `${country.name} university options`,
          programs,
        })
      : null,
  ];

  const publicPrograms = programs.filter((p) => p.university.type === "Public");
  const privatePrograms = programs.filter((p) => p.university.type === "Private");
  const publicCount = publicPrograms.length;
  const privateCount = privatePrograms.length;

  const pricedPrograms = programs.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd)
  );
  const tuitions = pricedPrograms.map((p) => p.offering.annualTuitionUsd);
  const livings = pricedPrograms
    .map((p) => p.offering.livingUsd)
    .filter((v) => hasPublishedUsdAmount(v));
  const totals = pricedPrograms
    .filter((p) => hasPublishedUsdAmount(p.offering.livingUsd))
    .map((p) => p.offering.annualTuitionUsd + p.offering.livingUsd);
  const minTuition = tuitions.length ? Math.min(...tuitions) : null;
  const maxTuition = tuitions.length ? Math.max(...tuitions) : null;
  const minLiving = livings.length ? Math.min(...livings) : null;
  const maxLiving = livings.length ? Math.max(...livings) : null;
  const minTotal = totals.length ? Math.min(...totals) : null;
  const maxTotal = totals.length ? Math.max(...totals) : null;

  const avgPublicTuition = publicPrograms.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd)
  ).length
    ? Math.round(
        publicPrograms
          .filter((p) => hasPublishedUsdAmount(p.offering.annualTuitionUsd))
          .reduce((sum, p) => sum + p.offering.annualTuitionUsd, 0) /
          publicPrograms.filter((p) =>
            hasPublishedUsdAmount(p.offering.annualTuitionUsd)
          ).length
      )
    : null;
  const avgPrivateTuition = privatePrograms.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd)
  ).length
    ? Math.round(
        privatePrograms
          .filter((p) => hasPublishedUsdAmount(p.offering.annualTuitionUsd))
          .reduce((sum, p) => sum + p.offering.annualTuitionUsd, 0) /
          privatePrograms.filter((p) =>
            hasPublishedUsdAmount(p.offering.annualTuitionUsd)
          ).length
      )
    : null;

  const uniqueCourses = [...new Set(programs.map((p) => p.course.shortName))];
  const uniqueCities = [...new Set(programs.map((p) => p.university.city))];
  const uniqueMediums = [...new Set(programs.map((p) => p.offering.medium))];
  const intakeMonths = [...new Set(programs.flatMap((p) => p.offering.intakeMonths))];
  const licenseExams = [...new Set(programs.flatMap((p) => p.offering.licenseExamSupport))];
  const allRecognitionBadges = [
    ...new Set(
      programs
        .flatMap((p) => p.university.recognitionBadges)
        .filter(isValidRecognitionBadge)
    ),
  ];
  const uniqueDurations = [...new Set(programs.map((p) => p.offering.durationYears))].sort(
    (a, b) => a - b
  );


  const costRange = formatUsdRange(minTuition, maxTuition);
  const livingRange = formatUsdRange(minLiving, maxLiving);
  const totalRange = formatUsdRange(minTotal, maxTotal);
  const heroPrimaryHref = primaryProgram
    ? `/universities?country=${country.slug}&course=${primaryProgram.course.slug}`
    : `/universities?country=${country.slug}`;
  const heroImage = getCountryHeroImage(country.slug);
  const editorialCopy = getCountryEditorialCopy({
    slug: country.slug,
    name: country.name,
    summary: country.summary,
    whyStudentsChooseIt: country.whyStudentsChooseIt,
    programCount: programs.length,
    cityCount: uniqueCities.length,
    courseCount: uniqueCourses.length,
  });
  const countryContent = getCountryContent(country.slug);
  const countryAdvisory = getCountryRegulatoryAdvisory(country.slug);
  const db = getDb();
  const landingPagePromise = curatedLandingPageHref
    ? getLandingPageBySlug(curatedLandingPageHref.slice(1))
    : Promise.resolve(null);
  const relatedBlogPostPromise = db
    ? db
        .select({ title: blogPosts.title, slug: blogPosts.slug, excerpt: blogPosts.excerpt })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.status, "published"),
            ilike(blogPosts.slug, `%${country.slug}%`)
          )
        )
        .limit(1)
        .then((rows) => rows[0] ?? null)
    : Promise.resolve(null);

  const relatedBlogPost = await relatedBlogPostPromise;

  return (
    <>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section>
        <div className="relative overflow-hidden bg-[#0d1f1d]">
          {/* Subtle texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(240,138,68,0.18),transparent),radial-gradient(ellipse_40%_50%_at_0%_60%,rgba(255,255,255,0.04),transparent)]"
          />
          <div aria-hidden className="hero-grid-lines absolute inset-0 opacity-20 pointer-events-none" />

          <div className="container-shell relative py-10 md:py-14 lg:py-20">
            <div className={cn(
              "grid gap-10 lg:items-center",
              heroImage ? "lg:grid-cols-[1fr_420px]" : ""
            )}>
              <div>
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/36">
                  <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
                  <ChevronRight className="size-3 shrink-0" />
                  <Link href="/guides" className="hover:text-white/70 transition-colors">Guides</Link>
                  <ChevronRight className="size-3 shrink-0" />
                  <Link href="/countries" className="hover:text-white/70 transition-colors">Countries</Link>
                  <ChevronRight className="size-3 shrink-0" />
                  <span className="text-white/60">{country.name}</span>
                </nav>

                {/* Headline */}
                <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.88] tracking-tight text-white">
                  Study in<br />
                  <em className="not-italic text-accent">{country.name}</em>
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 md:text-lg md:leading-9">
                  {editorialCopy.heroLead}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="!bg-white !text-[#0d1f1d] hover:!bg-white/90 hover:!text-[#0d1f1d] shadow-none"
                  >
                    <Link href={heroPrimaryHref}>
                      Browse universities
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  {primaryProgram && curatedLandingPageHref ? (
                    <Suspense
                      fallback={
                        <div
                          aria-hidden="true"
                          className="h-12 w-44 rounded-xl border border-white/20 bg-white/5"
                        />
                      }
                    >
                      <CountryHeroGuideLink
                        landingPagePromise={landingPagePromise}
                        href={curatedLandingPageHref}
                        courseLabel={primaryProgram.course.shortName}
                      />
                    </Suspense>
                  ) : null}
                </div>
              </div>

              {heroImage ? (
                <div className="relative hidden lg:block">
                  <div className="relative h-[480px] overflow-hidden rounded-[2rem]">
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt}
                      fill
                      className="object-cover"
                      sizes="420px"
                      priority
                    />
                  </div>
                  <p className="mt-2.5 text-right text-[0.65rem] text-white/28">
                    {heroImage.alt}
                  </p>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {countryAdvisory ? (
        <section className="border-b border-border/60 bg-[#fff8f2] py-8 md:py-10">
          <div className="container-shell">
            <RegulatoryAdvisoryPanel advisory={countryAdvisory} />
          </div>
        </section>
      ) : null}

      {/* ── BODY ────────────────────────────────────────────────── */}
      <div className="container-shell space-y-0 divide-y divide-border/60 pb-24">

        {/* ── ABOUT ───────────────────────────────────────────── */}
        <div id="country-overview" className="py-14 md:py-18">
          <SectionLabel icon={<Globe2 className="size-3.5" />} text="Country Overview" />

          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl lg:text-5xl">
            {country.name} as a study destination
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-8 text-muted-foreground md:text-[1.04rem] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-foreground">
            <p>{editorialCopy.overviewLead}</p>
            {!countryAdvisory &&
            country.whyStudentsChooseIt &&
            editorialCopy.overviewLead !== country.whyStudentsChooseIt && (
              <ReactMarkdown>{country.whyStudentsChooseIt}</ReactMarkdown>
            )}
          </div>

          {/* Fact tiles */}
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <FactRow label="Region" value={country.region} />
            <FactRow label="Currency" value={country.currencyCode} />
            <FactRow label="Climate" value={country.climate} />
            <FactRow
              label="Program lengths"
              value={
                uniqueDurations.length
                  ? uniqueDurations.map((d) => formatProgramDuration(d)).join(" · ")
                  : "Verify by institution"
              }
            />
            <FactRow
              label="Available tracks"
              value={uniqueCourses.length ? uniqueCourses.join(", ") : "Verify by institution"}
            />
            {countryContent?.quickFacts
              .filter(
                (f) =>
                  !["region", "currency", "climate"].includes(f.label.toLowerCase())
              )
              .map((f) => (
                <FactRow key={f.label} label={f.label} value={f.value} />
              ))}
          </div>

          {allRecognitionBadges.length ? (
            <div className="mt-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Recognition
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {allRecognitionBadges.map((badge) => (
                  <RecognitionBadge key={badge} badge={badge} />
                ))}
              </div>
            </div>
          ) : null}

          {licenseExams.length ? (
            <div className="mt-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                License exam support
              </p>
              <ul className="space-y-2">
                {licenseExams.map((exam) => (
                  <li key={exam} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                    {exam}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* ── COSTS ───────────────────────────────────────────── */}
        <div className="py-14 md:py-18">
          <SectionLabel icon={<CircleDollarSign className="size-3.5" />} text="Cost Picture" />

          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Understand the fee and living-cost spread
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Country-level cost ranges show where the market starts. The final number depends
            on city, hostel setup, and the specific university you choose.
          </p>

          {/* Main cost table */}
          <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-border/70">
            <div className="grid grid-cols-3 border-b border-border/60 bg-[#f7f5f0] px-5 py-3">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</span>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-center">Annual range</span>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-right">Notes</span>
            </div>
            <CostRow label="Tuition" value={costRange ?? "Check notices"} note="Published annual" />
            <CostRow label="Living costs" value={livingRange ?? "Varies by city"} note="Accom. + daily" border />
            <CostRow label="All-in estimate" value={totalRange ?? "Build totals"} note="Tuition + living" border highlight />
          </div>

          {/* Public vs private route cards */}
          {(avgPublicTuition || avgPrivateTuition) ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {avgPublicTuition ? (
                <RouteCard type="Public" count={publicCount} avg={formatCurrencyUsd(avgPublicTuition)} tone="green" />
              ) : null}
              {avgPrivateTuition ? (
                <RouteCard type="Private" count={privateCount} avg={formatCurrencyUsd(avgPrivateTuition)} tone="amber" />
              ) : null}
            </div>
          ) : null}

          {/* Academic snapshot */}
          <div className="mt-10">
            <SectionLabel icon={<BookOpen className="size-3.5" />} text="Academic Snapshot" />
            <div className="mt-5 flex flex-wrap gap-8">
              {uniqueMediums.length ? (
                <TagGroup label="Teaching medium" items={uniqueMediums} />
              ) : null}
              {intakeMonths.length ? (
                <TagGroup label="Intake months" items={intakeMonths} />
              ) : null}
              {uniqueCourses.length ? (
                <TagGroup label="Study tracks" items={uniqueCourses} />
              ) : null}
            </div>
          </div>

          <Suspense fallback={null}>
            <CountryCostAddOns
              currencyCode={country.currencyCode}
              courseSlug={primaryProgram?.course.slug}
            />
          </Suspense>

          {/* Monthly living cost breakdown */}
          {countryContent?.costOfLiving ? (
            <div className="mt-10">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Monthly living costs
              </p>
              <p className="text-sm leading-7 text-muted-foreground mb-5">
                {countryContent.costOfLiving.intro}
              </p>
              <div className="overflow-hidden rounded-[1.6rem] border border-border/70">
                <div className="grid grid-cols-3 border-b border-border/60 bg-[#f7f5f0] px-5 py-3">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Category</span>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-center">Monthly range</span>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-right">Notes</span>
                </div>
                {countryContent.costOfLiving.items.map((item, i) => (
                  <CostRow
                    key={item.category}
                    label={item.category}
                    value={item.range}
                    note={item.notes ?? ""}
                    border={i > 0}
                    highlight={i === countryContent.costOfLiving.items.length - 1}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* ── UNIVERSITY DIRECTORY ────────────────────────────── */}
        {programs.length ? (
          <div className="deferred-render py-14 md:py-18">
            <SectionLabel icon={<GraduationCap className="size-3.5" />} text="Finder Preview" />

            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              Browse universities in {country.name}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              If you want to browse all currently listed universities in
              {` ${country.name}, `}this section gives you a quick preview before
              you open the full university list.
            </p>

            {/* Snapshot row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <DirectoryChip label="Total" value={`${programs.length} listed`} />
              <DirectoryChip label="Public" value={`${publicCount}`} />
              <DirectoryChip label="Private" value={`${privateCount}`} />
              {costRange ? <DirectoryChip label="Fee band" value={costRange} /> : null}
              {uniqueCities.length ? <DirectoryChip label="Cities" value={`${uniqueCities.length}`} /> : null}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previewPrograms.map((program, index) => (
                <UniversityCard
                  key={program.offering.slug}
                  program={program}
                  imagePriority={index === 0}
                />
              ))}
            </div>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href={heroPrimaryHref}>
                  See all {country.name} universities
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

          </div>
        ) : null}

        {/* ── COUNTRY CONTENT SECTIONS ────────────────────────── */}
        {countryContent && (
          <>
            {/* Eligibility */}
            <div className="deferred-render py-14 md:py-18">
              <SectionLabel icon={<GraduationCap className="size-3.5" />} text="Eligibility" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Eligibility for Indian students
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                {countryContent.eligibility.intro}
              </p>
              <div className="mt-8 space-y-3">
                {countryContent.eligibility.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admission Process */}
            <div className="deferred-render py-14 md:py-18">
              <SectionLabel icon={<BookOpen className="size-3.5" />} text="Admission Process" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                How to apply — step by step
              </h2>
              <div className="mt-8 space-y-3">
                {countryContent.admissionSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-7 text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Required */}
            <div className="deferred-render py-14 md:py-18">
              <SectionLabel icon={<Building2 className="size-3.5" />} text="Documents Required" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Documents required
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    Educational documents
                  </p>
                  <ul className="space-y-3">
                    {countryContent.documentsRequired.educational.map((doc) => (
                      <li key={doc} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm leading-6 text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    Visa documents
                  </p>
                  <ul className="space-y-3">
                    {countryContent.documentsRequired.visa.map((doc) => (
                      <li key={doc} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm leading-6 text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {countryContent.verificationChecklist?.length ? (
              <div className="deferred-render py-14 md:py-18">
                <SectionLabel icon={<CheckCircle2 className="size-3.5" />} text="Admissions Checks" />
                <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                  What to verify before you pay
                </h2>
                <ul className="mt-8 space-y-3">
                  {countryContent.verificationChecklist.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm leading-7 text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Hostel & Accommodation */}
            <div className="deferred-render py-14 md:py-18">
              <SectionLabel icon={<MapPin className="size-3.5" />} text="Hostel & Accommodation" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Hostel &amp; accommodation
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
                {countryContent.hostelInfo}
              </p>
            </div>

            {/* Scholarships */}
            <div className="deferred-render py-14 md:py-18">
              <SectionLabel icon={<CircleDollarSign className="size-3.5" />} text="Scholarships" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Scholarships &amp; financial support
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
                {countryContent.scholarshipInfo}
              </p>
            </div>

            {/* Career Opportunities */}
            <div className="deferred-render py-14 md:py-18">
              <SectionLabel icon={<GraduationCap className="size-3.5" />} text="Career Opportunities" />
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                Career opportunities after studying in {country.name}
              </h2>
              <ul className="mt-8 space-y-3">
                {countryContent.careerOpportunities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-sm leading-7 text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ── RELATED BLOG POST ───────────────────────────────── */}
        {relatedBlogPost && (
          <div className="py-8 border-t border-border">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              From the blog
            </p>
            <Link
              href={`/blog/${relatedBlogPost.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted transition-colors"
            >
              <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-snug">
                  {relatedBlogPost.title}
                </p>
                {relatedBlogPost.excerpt && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {relatedBlogPost.excerpt}
                  </p>
                )}
              </div>
              <ChevronRight className="ml-auto mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        )}

        {/* ── NEXT STEP ───────────────────────────────────────── */}
        <div className="deferred-render py-14 md:py-18">
          <SectionLabel text="Next Step" />
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Need help after you have explored {country.name}?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Share your details if you want help understanding the differences
            between universities, expected costs, or the next admissions step
            for studying in {country.name}.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <GuidancePoint label="University differences" text="How to compare options beyond the headline fee" />
            <GuidancePoint label="City context" text={`What changes between university cities in ${country.name}`} />
            <GuidancePoint label="Cost estimates" text="Realistic yearly and total cost modelling" />
            <GuidancePoint label="Next steps" text="What to verify before sending an application" />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={heroPrimaryHref}>Explore universities</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to the team</Link>
              </Button>
            </div>

            <DeferredLeadForm
              sourcePath={`/countries/${country.slug}`}
              ctaVariant="country_sidebar"
              title={`Talk through studying in ${country.name}`}
              description="Tell us what you are comparing and our counsellors will help you evaluate your options more clearly."
              countrySlug={country.slug}
              courseSlug={primaryProgram?.course.slug}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

const RECOGNITION_LOGOS: Record<string, { src: string; width: number; height: number }> = {
  NMC: { src: "/images/recognition/nmc.png", width: 40, height: 40 },
  WHO: { src: "/images/recognition/who.png", width: 40, height: 40 },
  WFME: { src: "/images/recognition/wfme.png", width: 40, height: 40 },
  FAIMER: { src: "/images/recognition/faimer.svg", width: 80, height: 40 },
};

function RecognitionBadge({ badge }: { badge: string }) {
  const key = Object.keys(RECOGNITION_LOGOS).find((k) =>
    badge.toUpperCase().startsWith(k)
  );
  const logo = key ? RECOGNITION_LOGOS[key] : null;

  if (logo) {
    return (
      <div className="flex items-center gap-2 rounded-[1rem] border border-border/70 bg-white px-3 py-2">
        <Image
          src={logo.src}
          alt={key!}
          width={logo.width}
          height={logo.height}
          className="size-7 object-contain"
        />
        <span className="text-xs font-medium text-foreground">{badge}</span>
      </div>
    );
  }

  return (
    <span className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-foreground">
      {badge}
    </span>
  );
}

function SectionLabel({
  icon,
  text,
}: {
  icon?: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
      {icon}
      {text}
    </div>
  );
}



function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-border/60 bg-[#faf8f4] px-5 py-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function CostRow({
  label,
  value,
  note,
  border,
  highlight,
}: {
  label: string;
  value: string;
  note: string;
  border?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-center px-5 py-4",
        border && "border-t border-border/60",
        highlight && "bg-[#f7f5f0]"
      )}
    >
      <span className={cn("text-sm", highlight ? "font-semibold text-foreground" : "text-muted-foreground")}>{label}</span>
      <span className={cn("text-center font-display text-lg font-semibold tracking-tight", highlight ? "text-heading" : "text-foreground")}>{value}</span>
      <span className="text-right text-xs text-muted-foreground">{note}</span>
    </div>
  );
}

function RouteCard({
  type,
  count,
  avg,
  tone,
}: {
  type: string;
  count: number;
  avg: string;
  tone: "green" | "amber";
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border px-4 py-4",
        tone === "green"
          ? "border-emerald-200/70 bg-emerald-50"
          : "border-amber-200/70 bg-amber-50"
      )}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {type} route · {count} options
      </p>
      <p className="mt-2 font-display text-xl font-semibold text-heading">{avg}<span className="text-sm font-normal text-muted-foreground">/yr avg</span></p>
    </div>
  );
}

function TagGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-medium text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}


function DirectoryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-[#f7f5f0] px-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function GuidancePoint({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-[1.15rem] border border-border/70 bg-[#faf8f4] px-4 py-3.5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary/70 mb-1">{label}</p>
      <p className="text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

async function CountryHeroGuideLink({
  landingPagePromise,
  href,
  courseLabel,
}: {
  landingPagePromise: Promise<Awaited<ReturnType<typeof getLandingPageBySlug>>>;
  href: string;
  courseLabel: string;
}) {
  const landingPage = await landingPagePromise;

  if (!landingPage) {
    return null;
  }

  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="!bg-transparent !text-white !border-white/30 hover:!bg-white/20 hover:!text-white hover:!border-white/50"
    >
      <Link href={href}>Open {courseLabel} guide</Link>
    </Button>
  );
}

async function CountryCostAddOns({
  currencyCode,
  courseSlug,
}: {
  currencyCode: string;
  courseSlug?: string;
}) {
  const [exchangeRate, recommendedBudgetGuide] = await Promise.all([
    getInrExchangeRate(currencyCode),
    courseSlug ? getRecommendedBudgetGuideForCourse(courseSlug) : Promise.resolve(null),
  ]);

  if (!exchangeRate && !recommendedBudgetGuide) {
    return null;
  }

  return (
    <>
      {exchangeRate ? (
        <div className="mt-10 max-w-sm">
          <DeferredCurrencyConverter
            rate={exchangeRate.rate}
            localCurrency={currencyCode}
            date={exchangeRate.date}
          />
        </div>
      ) : null}

      {recommendedBudgetGuide ? (
        <div className="mt-6 max-w-sm rounded-[1.4rem] border border-border/70 bg-[#fff9f2] p-5">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#a06030]">
            Budget guide available
          </p>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            A detailed breakdown of what to budget for across all years of study.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full justify-between">
            <Link href={`/budget/${recommendedBudgetGuide.slug}`}>
              Explore budget guide
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </>
  );
}


function formatUsdRange(minValue: number | null, maxValue: number | null) {
  if (minValue === null || maxValue === null) return null;
  return minValue === maxValue
    ? formatCurrencyUsd(minValue)
    : `${formatCurrencyUsd(minValue)} – ${formatCurrencyUsd(maxValue)}`;
}

function getCountryEditorialCopy({
  slug,
  name,
  summary,
  whyStudentsChooseIt,
  programCount,
  cityCount,
  courseCount,
}: {
  slug: string;
  name: string;
  summary: string;
  whyStudentsChooseIt: string;
  programCount: number;
  cityCount: number;
  courseCount: number;
}) {
  const overrides: Record<string, { heroLead: string; overviewLead: string }> = {
    russia: {
      heroLead:
        "Russia remains one of the most established destinations for Indian students looking for large public medical universities, long-running MBBS infrastructure, and multiple cities with mature study ecosystems.",
      overviewLead:
        "The country-level story is about scale: more institutions, more city variation, and clearer differences between legacy public universities and smaller private options.",
    },
    vietnam: {
      heroLead:
        "Vietnam is a closer-to-home option for students comparing a smaller set of urban medical universities and shorter travel from India.",
      overviewLead:
        "The most useful comparison points are city, teaching language support, and whether the full course structure fits your India-return plans.",
    },
    georgia: {
      heroLead:
        "Georgia attracts students who prioritise English-medium delivery, compact urban study environments, and universities that can feel easier to navigate for first-time international families.",
      overviewLead:
        "The country view matters here because teaching language, city experience, and student support can differ noticeably even when headline fees look similar.",
    },
    kyrgyzstan: {
      heroLead:
        "Kyrgyzstan is usually evaluated for affordability first, but the real differences appear in hostel access, city infrastructure, academic support, and how each university handles international students.",
      overviewLead:
        "This destination makes the most sense when you compare beyond the lowest fee and look at whether the city, campus setup, and support model suit the student.",
    },
    uzbekistan: {
      heroLead:
        "Uzbekistan may still look affordable on paper, but Indian students now need much tighter due diligence after the 1 April 2026 NMC alert and Embassy-reported concerns on standards, training, and agent-led admissions.",
      overviewLead:
        "The real question is no longer just fees. It is whether the exact university, branch, teaching medium, clinical training, and internship pathway stay aligned with FMGL 2021 and the India-return licensing route.",
    },
  };

  const override = overrides[slug];

  return {
    heroLead: override?.heroLead ?? summary,
    overviewLead:
      override?.overviewLead ??
      `${whyStudentsChooseIt} Country-level research is most useful when it helps you understand the structure of the destination before you move into university-level differences.`,
    directoryLead:
      courseCount > 1
        ? `Compare the ${programCount} listed options across ${cityCount} cities and ${courseCount} study tracks.`
        : `Compare the ${programCount} listed options across ${cityCount} cities.`,
    guidanceLead: `If you want a second opinion after reading this page, we can help you interpret the differences between universities in ${name}, estimate realistic costs, and identify the next questions to ask before applying.`,
  };
}
