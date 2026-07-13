import { RelatedContentSection } from "@/components/site/related-content-section";
import {
  StudyAbroadGuidePage,
  type GuideSection,
  type StudyAbroadGuidePageProps,
} from "@/components/site/study-abroad-guide-page";
import { listFinderPrograms } from "@/lib/data/catalog";
import { getRelatedContent } from "@/lib/data/related-content";
import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";

// Migrated 2026-07-09 from a ~981-line bespoke "use client" page (which hardcoded a
// per-university fee array in JSX) into the DB-driven StudyAbroadGuidePage pattern.
// The narrative sections live in lib/data/study-abroad-guides.ts; the university-wise
// fee comparison table below is built at request time from live program_offerings data
// so fee figures track the DB rather than a hand-maintained array. Metadata stays in
// this route's layout.tsx. See docs/bespoke-landing-migration-checklist.md.
const guide = studyAbroadGuides["mbbs-in-russia-fees"].page;

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/**
 * Reads published Russia MBBS program offerings and splices a data-driven
 * "University-wise MBBS fees" table into the guide's sections (after the intro).
 */
async function buildRussiaFeesGuide(): Promise<StudyAbroadGuidePageProps> {
  const programs = (await listFinderPrograms({ country: "russia", course: "mbbs" }))
    .filter(
      (program) =>
        program.offering.published &&
        program.offering.annualTuitionUsd > 0,
    )
    .sort((a, b) => a.offering.annualTuitionUsd - b.offering.annualTuitionUsd);

  if (programs.length === 0) {
    return guide;
  }

  const rows = programs.map((program) => [
    program.university.name,
    program.university.city,
    `${formatUsd(program.offering.annualTuitionUsd)}/yr`,
    program.offering.totalTuitionUsd > 0 ? formatUsd(program.offering.totalTuitionUsd) : "—",
  ]);

  const feeSection: GuideSection = {
    title: "University-wise MBBS fees",
    paragraphs: [
      `Annual tuition and total program cost for ${programs.length} Russian universities offering English-medium MBBS, drawn live from our verified catalogue and sorted from lowest to highest tuition. Figures are shown in USD, the currency most Russian universities quote for international students; convert to rupees using the current exchange rate and add hostel, food, and living costs (see the scenarios below) for a full six-year budget.`,
    ],
    table: {
      headers: ["University", "City", "Annual tuition", "Total tuition (6 yrs)"],
      rows,
      note: "Tuition-only figures from our verified catalogue. Add hostel, food, travel, insurance, and one-time Year 1 expenses for an accurate all-in budget. Verify current fees with the university before making any payment.",
    },
  };

  const [intro, ...rest] = guide.sections;
  return {
    ...guide,
    sections: [intro, feeSection, ...rest],
  };
}

export default async function RussiaMbbsFeesPage() {
  const [page, related] = await Promise.all([
    buildRussiaFeesGuide(),
    getRelatedContent({
      countrySlug: guide.countrySlug,
      courseSlug: guide.courseSlug,
      excludeSlug: "mbbs-in-russia-fees",
    }),
  ]);

  return (
    <>
      <StudyAbroadGuidePage {...page} />
      <RelatedContentSection items={related} />
    </>
  );
}
