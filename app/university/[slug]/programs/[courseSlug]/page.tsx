import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { UniversityAcademicsSection } from "@/components/site/university/academics-section";
import { UniversityFeesDetailSection } from "@/components/site/university/fees-detail-section";
import { UniversityFaqSection } from "@/components/site/university/faq-section";
import {
  getCountryBySlug,
  getProgramsForUniversity,
  getUniversityBySlug,
} from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import {
  getUniversityHref,
  getUniversityProgramHref,
} from "@/lib/routes";

async function getProgramPageData(universitySlug: string, courseSlug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  cacheTag(`university-programs:${universitySlug}`);

  const [university, programs] = await Promise.all([
    getUniversityBySlug(universitySlug),
    getProgramsForUniversity(universitySlug),
  ]);
  if (!university) return null;

  const program = programs.find(
    (p) => p.course.slug === courseSlug && p.offering.published,
  );
  if (!program) return null;

  const country = await getCountryBySlug(university.countrySlug);

  return { university, program, country };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string }>;
}): Promise<Metadata> {
  const { slug, courseSlug } = await params;
  const data = await getProgramPageData(slug, courseSlug);

  if (!data) return { title: "Program Not Found" };

  const { university, program } = data;
  const title = `${program.course.shortName} at ${university.name} | Fees, Academics & Eligibility`;
  const description = `Detailed ${program.course.shortName} program information at ${university.name}, ${university.city} — duration, fee breakdown, medium of instruction, and academic structure for Indian students.`;

  return buildIndexableMetadata({
    title,
    description,
    path: getUniversityProgramHref(slug, courseSlug),
  });
}

export default async function UniversityProgramPage({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string }>;
}) {
  const { slug, courseSlug } = await params;
  const data = await getProgramPageData(slug, courseSlug);

  if (!data) notFound();

  const { university, program, country } = data;
  const path = getUniversityProgramHref(slug, courseSlug);

  const structuredDataItems = [
    getWebPageStructuredData({
      path,
      name: `${program.course.shortName} at ${university.name}`,
      description: university.summary,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Universities", path: "/universities" },
      { name: university.name, path: getUniversityHref(university.slug) },
      { name: program.course.shortName, path },
    ]),
    university.faq.length ? getFaqStructuredData(university.faq, path) : null,
  ];

  return (
    <>
      <section className="border-b border-border bg-surface-dark py-10 md:py-12">
        <div className="container-shell">
          <nav
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/50"
            aria-label="Breadcrumb"
          >
            <Link href="/universities" className="transition-colors hover:text-white/75">
              Universities
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link
              href={getUniversityHref(university.slug)}
              className="transition-colors hover:text-white/75"
            >
              {university.name}
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-white/70">{program.course.shortName}</span>
          </nav>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            {program.course.shortName} at {university.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
            {program.course.shortName} program details for {university.name},{" "}
            {university.city} — duration, fees, and academic structure for Indian
            students. For the full admissions process, eligibility, and NMC
            recognition pathway, see the{" "}
            <Link
              href={`${getUniversityHref(university.slug)}-admissions`}
              className="underline underline-offset-2 hover:text-white"
            >
              university admissions page
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="container-shell">
        <UniversityAcademicsSection university={university} primaryProgram={program} />
        <UniversityFeesDetailSection
          programs={[program]}
          universityName={university.name}
          university={university}
          country={country ?? undefined}
        />
        <UniversityFaqSection
          faq={university.faq}
          universityName={university.name}
          city={university.city}
          primaryProgramShortName={program.course.shortName}
        />
      </div>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
