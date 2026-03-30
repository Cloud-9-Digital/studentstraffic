import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink, FileSearch, MapPin } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { catalogReviewedAt } from "@/lib/content-governance";
import {
  getWdomsDirectoryEntryByRoute,
  getWdomsDirectoryEntries,
} from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import {
  getUniversityHref,
  getWdomsDirectoryHref,
} from "@/lib/routes";
import { getWdomsCountryConfig, wdomsCountryConfigs } from "@/lib/wdoms";

type RouteParams = {
  countrySlug: string;
  schoolSlug: string;
};

function buildDescription({
  schoolName,
  cityName,
  countryName,
  qualificationTitle,
  curriculumDuration,
  yearInstructionStarted,
}: {
  schoolName: string;
  cityName: string;
  countryName: string;
  qualificationTitle?: string;
  curriculumDuration?: string;
  yearInstructionStarted?: number;
}) {
  const parts = [
    `${schoolName} in ${cityName}, ${countryName}.`,
    qualificationTitle ? `Qualification: ${qualificationTitle}.` : undefined,
    curriculumDuration ? `Curriculum duration: ${curriculumDuration}.` : undefined,
    yearInstructionStarted
      ? `WDOMS lists instruction starting in ${yearInstructionStarted}.`
      : undefined,
    "Profile based on official WDOMS detail-page data and linked school website information.",
  ];

  return parts.filter(Boolean).join(" ");
}

export async function generateStaticParams() {
  const groups = await Promise.all(
    wdomsCountryConfigs.map(async (config) => ({
      config,
      entries: await getWdomsDirectoryEntries(config.slug),
    })),
  );

  return groups.flatMap((group) =>
    group.entries.map((entry) => ({
      countrySlug: group.config.slug,
      schoolSlug: entry.routeSlug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { countrySlug, schoolSlug } = await params;
  const entry = await getWdomsDirectoryEntryByRoute(countrySlug, schoolSlug);
  const config = getWdomsCountryConfig(countrySlug);

  if (!entry || !config) {
    return { title: "WDOMS University Profile Not Found" };
  }

  return buildIndexableMetadata({
    title: `${entry.schoolName} | WDOMS Research Profile`,
    description: buildDescription({
      schoolName: entry.schoolName,
      cityName: entry.cityName,
      countryName: config.displayName,
      qualificationTitle: entry.qualificationTitle,
      curriculumDuration: entry.curriculumDuration,
      yearInstructionStarted: entry.yearInstructionStarted,
    }),
    path: `/wdoms/${countrySlug}/${schoolSlug}`,
    keywords: [
      entry.schoolName,
      `${entry.schoolName} WDOMS`,
      `${config.displayName} medical university`,
      entry.qualificationTitle,
      entry.cityName,
    ].filter(Boolean) as string[],
  });
}

function FactCard({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-[#faf8f4] px-5 py-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

export default async function WdomsUniversityProfilePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { countrySlug, schoolSlug } = await params;
  const [entry, config] = await Promise.all([
    getWdomsDirectoryEntryByRoute(countrySlug, schoolSlug),
    Promise.resolve(getWdomsCountryConfig(countrySlug)),
  ]);

  if (!entry || !config) {
    notFound();
  }

  const path = `/wdoms/${countrySlug}/${schoolSlug}`;
  const description = buildDescription({
    schoolName: entry.schoolName,
    cityName: entry.cityName,
    countryName: config.displayName,
    qualificationTitle: entry.qualificationTitle,
    curriculumDuration: entry.curriculumDuration,
    yearInstructionStarted: entry.yearInstructionStarted,
  });

  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      {
        name: `Medical schools in ${config.displayName}`,
        path: getWdomsDirectoryHref(config.slug),
      },
      { name: entry.schoolName, path },
    ]),
    getWebPageStructuredData({
      path,
      name: entry.schoolName,
      description,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />

      <section className="bg-surface-dark py-12 md:py-16">
        <div className="container-shell">
          <nav
            className="mb-8 flex items-center gap-1.5 text-xs text-white/40"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white/65">
              Home
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href="/guides" className="transition-colors hover:text-white/65">
              Guides
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link
              href={getWdomsDirectoryHref(config.slug)}
              className="transition-colors hover:text-white/65"
            >
              {config.displayName} WDOMS
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-white/55">{entry.schoolName}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <FileSearch className="size-3.5" />
              WDOMS research profile
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {entry.schoolName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/65">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {entry.cityName}, {config.displayName}
              </span>
              {entry.operationalStatus ? <span>{entry.operationalStatus}</span> : null}
              {entry.yearInstructionStarted ? (
                <span>Instruction started {entry.yearInstructionStarted}</span>
              ) : null}
            </div>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/65">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {entry.schoolWebsite ? (
                <Button asChild size="lg">
                  <a
                    href={entry.schoolWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official website
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              ) : null}

              <Button asChild variant="outline" size="lg">
                <a
                  href={entry.schoolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WDOMS source
                  <ExternalLink className="size-4" />
                </a>
              </Button>

              {entry.matchedUniversitySlug ? (
                <Button asChild variant="outline" size="lg">
                  <Link href={getUniversityHref(entry.matchedUniversitySlug)}>
                    Students Traffic guide
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="container-shell space-y-12">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              What WDOMS currently confirms
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FactCard label="School type" value={entry.schoolType} />
              <FactCard label="Qualification" value={entry.qualificationTitle} />
              <FactCard label="Curriculum duration" value={entry.curriculumDuration} />
              <FactCard
                label="Language of instruction"
                value={entry.languageOfInstruction}
              />
              <FactCard
                label="Year instruction started"
                value={entry.yearInstructionStarted}
              />
              <FactCard label="Foreign students" value={entry.foreignStudents} />
              <FactCard label="Entrance exam" value={entry.entranceExam} />
              <FactCard
                label="Academic affiliation"
                value={entry.academicAffiliation}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl font-semibold text-heading">
                Clinical snapshot
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  {entry.clinicalFacilities ||
                    "WDOMS does not currently provide a specific clinical-facilities note for this school."}
                </p>
                <p>
                  {entry.clinicalTraining ||
                    "Clinical-training detail should be verified from the official school website or admissions office before applying."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl font-semibold text-heading">
                Admissions and contact notes
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  {entry.prerequisiteEducation ||
                    "Prerequisite-education detail was not populated on WDOMS for this school."}
                </p>
                {entry.mainAddress ? (
                  <p>
                    <span className="font-semibold text-foreground">Main address:</span>{" "}
                    {entry.mainAddress}
                  </p>
                ) : null}
                <p>
                  Always confirm current admissions cycle details, English-medium
                  availability, hostel options, and India-return pathway fit
                  directly on the official school website before making any
                  payments.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-display text-2xl font-semibold text-amber-950">
              Important context
            </h2>
            <p className="mt-4 text-sm leading-7 text-amber-950">
              This profile is based on data published in the World Directory of
              Medical Schools and the official website linked there. A WDOMS
              listing is a strong source record, but it does not by itself
              confirm current fee transparency, hostel quality, Indian
              admissions support, or NMC pathway fit for a specific intake.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
