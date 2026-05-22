import "dotenv/config";

import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  courses,
  programOfferings,
  universities,
  universityResearchDrafts,
  universityResearchQueue,
} from "@/lib/db/schema";

type ProgramSnapshot = {
  slug: string;
  courseSlug: string;
  title: string;
  durationYears: number;
  annualTuitionUsd: number;
  totalTuitionUsd: number;
  livingUsd: number;
  officialFeeCurrency: string | null;
  officialAnnualTuitionAmount: number | null;
  officialTotalTuitionAmount: number | null;
  officialProgramUrl: string;
  medium: string;
  teachingPhases: unknown[];
  yearlyCostBreakdown: unknown[];
  licenseExamSupport: string[];
  intakeMonths: string[];
  feeVerifiedAt: string | null;
  fxRateDate: string | null;
  fxRateSourceUrl: string | null;
  feeNotes: string | null;
  sourceUrls: string[];
  featured: boolean;
};

function asDateOrNull(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateQuality(params: {
  lastVerifiedAt: string | null;
  researchSourceCount: number;
  programs: ProgramSnapshot[];
  officialWebsite: string;
}) {
  let score = 40;

  if (params.lastVerifiedAt) {
    score += 15;
  }

  if (params.researchSourceCount >= 2) {
    score += 10;
  }

  if (params.researchSourceCount >= 4) {
    score += 5;
  }

  const verifiedPrograms = params.programs.filter((program) => program.feeVerifiedAt);
  score += Math.min(verifiedPrograms.length * 5, 15);

  const specificProgramUrls = params.programs.filter(
    (program) => program.officialProgramUrl !== params.officialWebsite,
  );
  score += Math.min(specificProgramUrls.length * 5, 15);

  return Math.min(score, 95);
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const requestedCountrySlugs = process.argv
    .slice(2)
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);

  if (requestedCountrySlugs.length === 0) {
    throw new Error("Pass at least one country slug, e.g. `pnpm exec tsx scripts/bootstrap-live-university-review-drafts.ts vietnam`.");
  }

  const courseRows = await db.select({ id: courses.id, slug: courses.slug }).from(courses);
  const courseSlugById = new Map(courseRows.map((row) => [row.id, row.slug]));

  const queueRows = await db
    .select({
      queueId: universityResearchQueue.id,
      wdomsSchoolId: universityResearchQueue.wdomsSchoolId,
      countrySlug: universityResearchQueue.countrySlug,
      schoolName: universityResearchQueue.schoolName,
      cityName: universityResearchQueue.cityName,
      matchedUniversityId: universityResearchQueue.matchedUniversityId,
      publishedUniversitySlug: universityResearchQueue.publishedUniversitySlug,
    })
    .from(universityResearchQueue)
    .where(
      and(
        inArray(universityResearchQueue.countrySlug, requestedCountrySlugs),
        inArray(
          universityResearchQueue.wdomsSchoolId,
          (
            await db
              .select({ wdomsSchoolId: universityResearchQueue.wdomsSchoolId })
              .from(universityResearchQueue)
              .where(inArray(universityResearchQueue.countrySlug, requestedCountrySlugs))
          ).map((row) => row.wdomsSchoolId).filter((value) => value.startsWith("live:")),
        ),
      ),
    );

  if (queueRows.length === 0) {
    throw new Error(
      `No live-university refresh queue rows found for ${requestedCountrySlugs.join(", ")}. Seed them first.`,
    );
  }

  const liveUniversityIds = queueRows
    .map((row) => row.matchedUniversityId)
    .filter((value): value is number => typeof value === "number");

  const universityRows = await db
    .select({
      id: universities.id,
      countrySlug: countries.slug,
      slug: universities.slug,
      name: universities.name,
      city: universities.city,
      type: universities.type,
      establishedYear: universities.establishedYear,
      summary: universities.summary,
      featured: universities.featured,
      officialWebsite: universities.officialWebsite,
      logoUrl: universities.logoUrl,
      coverImageUrl: universities.coverImageUrl,
      campusLifestyle: universities.campusLifestyle,
      cityProfile: universities.cityProfile,
      clinicalExposure: universities.clinicalExposure,
      hostelOverview: universities.hostelOverview,
      indianFoodSupport: universities.indianFoodSupport,
      safetyOverview: universities.safetyOverview,
      studentSupport: universities.studentSupport,
      whyChoose: universities.whyChoose,
      thingsToConsider: universities.thingsToConsider,
      bestFitFor: universities.bestFitFor,
      teachingHospitals: universities.teachingHospitals,
      recognitionBadges: universities.recognitionBadges,
      recognitionLinks: universities.recognitionLinks,
      faq: universities.faq,
      similarUniversitySlugs: universities.similarUniversitySlugs,
      lastVerifiedAt: universities.lastVerifiedAt,
      researchSources: universities.researchSources,
      researchNotes: universities.researchNotes,
      admissionsContent: universities.admissionsContent,
    })
    .from(universities)
    .innerJoin(countries, eq(universities.countryId, countries.id))
    .where(inArray(universities.id, liveUniversityIds));

  const programRows = await db
    .select({
      universityId: programOfferings.universityId,
      slug: programOfferings.slug,
      courseId: programOfferings.courseId,
      title: programOfferings.title,
      durationYears: programOfferings.durationYears,
      annualTuitionUsd: programOfferings.annualTuitionUsd,
      totalTuitionUsd: programOfferings.totalTuitionUsd,
      livingUsd: programOfferings.livingUsd,
      officialFeeCurrency: programOfferings.officialFeeCurrency,
      officialAnnualTuitionAmount: programOfferings.officialAnnualTuitionAmount,
      officialTotalTuitionAmount: programOfferings.officialTotalTuitionAmount,
      officialProgramUrl: programOfferings.officialProgramUrl,
      medium: programOfferings.medium,
      teachingPhases: programOfferings.teachingPhases,
      yearlyCostBreakdown: programOfferings.yearlyCostBreakdown,
      licenseExamSupport: programOfferings.licenseExamSupport,
      intakeMonths: programOfferings.intakeMonths,
      feeVerifiedAt: programOfferings.feeVerifiedAt,
      fxRateDate: programOfferings.fxRateDate,
      fxRateSourceUrl: programOfferings.fxRateSourceUrl,
      feeNotes: programOfferings.feeNotes,
      sourceUrls: programOfferings.sourceUrls,
      featured: programOfferings.featured,
    })
    .from(programOfferings)
    .where(
      and(
        inArray(programOfferings.universityId, liveUniversityIds),
        eq(programOfferings.published, true),
      ),
    );

  const programsByUniversityId = new Map<number, ProgramSnapshot[]>();

  for (const program of programRows) {
    const list = programsByUniversityId.get(program.universityId) ?? [];
    list.push({
      slug: program.slug,
      courseSlug: courseSlugById.get(program.courseId) ?? "mbbs",
      title: program.title,
      durationYears: program.durationYears,
      annualTuitionUsd: program.annualTuitionUsd,
      totalTuitionUsd: program.totalTuitionUsd,
      livingUsd: program.livingUsd,
      officialFeeCurrency: program.officialFeeCurrency,
      officialAnnualTuitionAmount: program.officialAnnualTuitionAmount,
      officialTotalTuitionAmount: program.officialTotalTuitionAmount,
      officialProgramUrl: program.officialProgramUrl,
      medium: program.medium,
      teachingPhases: Array.isArray(program.teachingPhases) ? program.teachingPhases : [],
      yearlyCostBreakdown: Array.isArray(program.yearlyCostBreakdown)
        ? program.yearlyCostBreakdown
        : [],
      licenseExamSupport: Array.isArray(program.licenseExamSupport)
        ? program.licenseExamSupport
        : [],
      intakeMonths: Array.isArray(program.intakeMonths) ? program.intakeMonths : [],
      feeVerifiedAt: program.feeVerifiedAt,
      fxRateDate: program.fxRateDate,
      fxRateSourceUrl: program.fxRateSourceUrl,
      feeNotes: program.feeNotes,
      sourceUrls: Array.isArray(program.sourceUrls) ? program.sourceUrls : [],
      featured: program.featured,
    });
    programsByUniversityId.set(program.universityId, list);
  }

  const universityById = new Map(universityRows.map((row) => [row.id, row]));
  let draftsUpserted = 0;

  for (const queueRow of queueRows) {
    if (!queueRow.matchedUniversityId) {
      continue;
    }

    const university = universityById.get(queueRow.matchedUniversityId);
    if (!university) {
      continue;
    }

    const programs = programsByUniversityId.get(university.id) ?? [];
    const qualityScore = calculateQuality({
      lastVerifiedAt: university.lastVerifiedAt,
      researchSourceCount: Array.isArray(university.researchSources)
        ? university.researchSources.length
        : 0,
      programs,
      officialWebsite: university.officialWebsite,
    });

    const sourceBundle = {
      mode: "live-catalog-refresh",
      importedFromSlug: university.slug,
      importedAt: new Date().toISOString(),
      sources: Array.isArray(university.researchSources) ? university.researchSources : [],
      currentProgramUrls: programs.map((program) => program.officialProgramUrl),
    };

    const structuredFacts = {
      slug: university.slug,
      name: university.name,
      countrySlug: university.countrySlug,
      city: university.city,
      type: university.type,
      establishedYear: university.establishedYear,
      officialWebsite: university.officialWebsite,
      logoUrl: university.logoUrl,
      coverImageUrl: university.coverImageUrl,
      featured: university.featured,
      bestFitFor: university.bestFitFor,
      teachingHospitals: university.teachingHospitals,
      recognitionBadges: university.recognitionBadges,
      recognitionLinks: university.recognitionLinks,
      similarUniversitySlugs: university.similarUniversitySlugs,
      researchNotes:
        university.researchNotes ??
        "Bootstrapped from the current live university page for verification refresh.",
      admissionsContent: university.admissionsContent ?? {},
      programs,
    };

    const draftContent = {
      summary: university.summary,
      campusLifestyle: university.campusLifestyle,
      cityProfile: university.cityProfile,
      clinicalExposure: university.clinicalExposure,
      hostelOverview: university.hostelOverview,
      indianFoodSupport: university.indianFoodSupport,
      safetyOverview: university.safetyOverview,
      studentSupport: university.studentSupport,
      whyChoose: university.whyChoose,
      thingsToConsider: university.thingsToConsider,
      faq: university.faq,
    };

    await db
      .insert(universityResearchDrafts)
      .values({
        queueId: queueRow.queueId,
        wdomsSchoolId: queueRow.wdomsSchoolId,
        officialWebsite: university.officialWebsite,
        programUrl: programs[0]?.officialProgramUrl ?? university.officialWebsite,
        feesUrl: programs.find((program) => program.feeVerifiedAt)?.officialProgramUrl ?? null,
        hostelUrl: null,
        admissionUrl: null,
        wdomsUrl: null,
        sourceBundle,
        structuredFacts,
        draftContent,
        qualityScore,
        reviewNotes:
          "Bootstrapped from current live university content. Requires official-source verification refresh before republishing claims.",
        verifiedAt: asDateOrNull(university.lastVerifiedAt),
      })
      .onConflictDoUpdate({
        target: universityResearchDrafts.queueId,
        set: {
          officialWebsite: university.officialWebsite,
          programUrl: programs[0]?.officialProgramUrl ?? university.officialWebsite,
          feesUrl:
            programs.find((program) => program.feeVerifiedAt)?.officialProgramUrl ?? null,
          sourceBundle,
          structuredFacts,
          draftContent,
          qualityScore,
          reviewNotes:
            "Bootstrapped from current live university content. Requires official-source verification refresh before republishing claims.",
          verifiedAt: asDateOrNull(university.lastVerifiedAt),
          updatedAt: new Date(),
        },
      });

    await db
      .update(universityResearchQueue)
      .set({
        status: qualityScore >= 70 ? "draft_ready" : "researching",
        lastAttemptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(universityResearchQueue.id, queueRow.queueId));

    draftsUpserted += 1;
  }

  console.log(
    `Bootstrapped live-university review drafts for ${requestedCountrySlugs.join(", ")}.`,
  );
  console.log(`Drafts inserted or updated: ${draftsUpserted}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
