import type { FinderCardProgram, ProgramOffering, University } from "@/lib/data/types";
import type { ApplicationRow } from "@/lib/db/schema";

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

export function mapUniversityDetail(
  university: University,
  countryName: string | undefined,
  offerings: ProgramOffering[],
  isShortlisted = false
) {
  const primaryOffering = offerings[0];
  return {
    slug: university.slug,
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
    clinicalExposure: university.clinicalExposure,
    hostelOverview: university.hostelOverview,
    indianFoodSupport: university.indianFoodSupport,
    safetyOverview: university.safetyOverview,
    studentSupport: university.studentSupport,
    whyChoose: university.whyChoose,
    thingsToConsider: university.thingsToConsider,
    bestFitFor: university.bestFitFor,
    recognitionBadges: university.recognitionBadges,
    teachingHospitals: university.teachingHospitals,
    lastVerifiedAt: university.lastVerifiedAt,
    isShortlisted,
    primaryOffering: primaryOffering
      ? {
          slug: primaryOffering.slug,
          courseSlug: primaryOffering.courseSlug,
          title: primaryOffering.title,
          durationYears: primaryOffering.durationYears,
          annualTuitionUsd: primaryOffering.annualTuitionUsd,
          totalTuitionUsd: primaryOffering.totalTuitionUsd,
          livingUsd: primaryOffering.livingUsd,
          medium: primaryOffering.medium,
          intakeMonths: primaryOffering.intakeMonths,
        }
      : null,
    offerings: offerings.map((offering) => ({
      slug: offering.slug,
      courseSlug: offering.courseSlug,
      title: offering.title,
      durationYears: offering.durationYears,
      annualTuitionUsd: offering.annualTuitionUsd,
      totalTuitionUsd: offering.totalTuitionUsd,
      livingUsd: offering.livingUsd,
      medium: offering.medium,
      intakeMonths: offering.intakeMonths,
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
