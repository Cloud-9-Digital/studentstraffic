import { programmeLevelLabels, type ProgrammeLevel } from "@/lib/data/program-taxonomy";
import type { FinderCardProgram, FinderProgram, University } from "@/lib/data/types";
import type { ApplicationRow } from "@/lib/db/schema";
import { getProgramFeeLines, formatProgramMedium } from "@/lib/utils";

export function mapFinderCardProgram(program: FinderCardProgram) {
  return {
    slug: program.university.slug,
    name: program.university.name,
    country: program.country.name,
    countrySlug: program.country.slug,
    city: program.university.city,
    type: program.university.type,
    logoUrl: program.university.logoUrl,
    coverImageUrl: program.university.coverImageUrl,
    featured: program.university.featured || program.offering.featured,
    course: program.course.shortName,
    courseSlug: program.course.slug,
    offeringSlug: program.offering.slug,
    tuitionUsd: program.offering.annualTuitionUsd,
    officialFeeCurrency: program.offering.officialFeeCurrency,
    officialAnnualTuitionAmount: program.offering.officialAnnualTuitionAmount,
  };
}

function formatMobileFeeLabel(offering: FinderProgram["offering"], countrySlug: string) {
  const lines = getProgramFeeLines(offering, countrySlug, "Fee on request");
  if (lines.length === 1 && !offering.feeAudience) return lines[0].amount;
  return lines.map((line) => `${line.label} ${line.amount}`).join(" · ");
}

export function mapUniversityDetail(
  university: University,
  countryName: string | undefined,
  programs: FinderProgram[]
) {
  const offerings = programs.map((program) => program.offering);
  // Kept for app builds released before the full programme list; newer builds list `offerings`.
  const primaryOffering = offerings[0];
  return {
    slug: university.slug,
    programCount: offerings.length,
    name: university.name,
    countrySlug: university.countrySlug,
    country: countryName ?? university.countrySlug,
    city: university.city,
    type: university.type,
    logoUrl: university.logoUrl,
    coverImageUrl: university.coverImageUrl,
    establishedYear: university.establishedYear,
    summary: university.summary,
    officialWebsite: university.officialWebsite,
    campusLifestyle: university.campusLifestyle,
    cityProfile: university.cityProfile,
    practicalExposure: university.practicalExposure,
    hostelOverview: university.hostelOverview,
    dietarySupport: university.dietarySupport,
    safetyOverview: university.safetyOverview,
    studentSupport: university.studentSupport,
    whyChoose: university.whyChoose,
    thingsToConsider: university.thingsToConsider,
    bestFitFor: university.bestFitFor,
    recognitionBadges: university.recognitionBadges,
    recognitionLinks: university.recognitionLinks,
    industryPartners: university.industryPartners,
    faq: university.faq,
    admissionsContent: university.admissionsContent,
    lastVerifiedAt: university.lastVerifiedAt,
    primaryOffering: primaryOffering
      ? {
          slug: primaryOffering.slug,
          courseSlug: primaryOffering.courseSlug,
          title: primaryOffering.title,
          durationYears: primaryOffering.durationYears,
          annualTuitionUsd: primaryOffering.annualTuitionUsd,
          totalTuitionUsd: primaryOffering.totalTuitionUsd,
          livingUsd: primaryOffering.livingUsd,
          officialProgramUrl: primaryOffering.officialProgramUrl,
          // null for placeholder mediums; clients must hide the field, not guess.
          medium: formatProgramMedium(primaryOffering.medium, university.countrySlug),
          intakeMonths: primaryOffering.intakeMonths,
          yearlyCostBreakdown: primaryOffering.yearlyCostBreakdown,
          feeNotes: primaryOffering.feeNotes,
          professionalExamSupport: primaryOffering.professionalExamSupport,
        }
      : null,
    offerings: programs.map(({ offering, course }) => ({
      slug: offering.slug,
      level: course.level ?? null,
      levelLabel: course.level ? (programmeLevelLabels[course.level as ProgrammeLevel] ?? null) : null,
      // "₹50,000" when the fee's audience is unknown; "Indian students ₹1,95,000 · NRI & international $4,000"
      // when the record says who each fee is for.
      annualFeeLabel: formatMobileFeeLabel(offering, university.countrySlug),
      // Each fee on its own, labelled by audience, in the same order as the website card.
      feeLines: getProgramFeeLines(offering, university.countrySlug, "Fee on request"),
      courseSlug: offering.courseSlug,
      title: offering.title,
      durationYears: offering.durationYears,
      annualTuitionUsd: offering.annualTuitionUsd,
      totalTuitionUsd: offering.totalTuitionUsd,
      livingUsd: offering.livingUsd,
      officialProgramUrl: offering.officialProgramUrl,
      medium: formatProgramMedium(offering.medium, university.countrySlug),
      intakeMonths: offering.intakeMonths,
      yearlyCostBreakdown: offering.yearlyCostBreakdown,
      feeNotes: offering.feeNotes,
      professionalExamSupport: offering.professionalExamSupport,
    })),
  };
}

export function mapApplication(row: ApplicationRow & {
  universityName?: string | null;
  universityCity?: string | null;
  countryName?: string | null;
  universityLogoUrl?: string | null;
}) {
  return {
    id: String(row.id),
    universitySlug: row.universitySlug,
    universityName: row.universityName ?? row.universitySlug,
    universityCity: row.universityCity,
    countryName: row.countryName,
    universityLogoUrl: row.universityLogoUrl,
    courseSlug: row.courseSlug,
    status: row.status,
    personalInfo: row.personalInfo ?? {},
    documents: row.documents ?? {},
    applicationData: row.applicationData ?? {},
    submittedAt: row.submittedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
