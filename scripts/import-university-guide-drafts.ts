import "dotenv/config";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  courses,
  programOfferings,
  universities,
} from "@/lib/db/schema";
import { readUniversityGuideDraftBatches } from "@/lib/research/university-guide-drafts";

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const [countryRows, courseRows, draftFiles] = await Promise.all([
    db.select().from(countries),
    db.select().from(courses),
    readUniversityGuideDraftBatches(),
  ]);

  const countryIdBySlug = new Map(countryRows.map((row) => [row.slug, row.id]));
  const courseIdBySlug = new Map(courseRows.map((row) => [row.slug, row.id]));

  let importedUniversities = 0;
  let importedPrograms = 0;

  for (const { filePath, batch } of draftFiles) {
    const countryId = countryIdBySlug.get(batch.countrySlug);

    if (!countryId) {
      console.warn(
        `Skipping ${filePath}: country "${batch.countrySlug}" is not in the countries table yet.`,
      );
      continue;
    }

    for (const university of batch.universities) {
      const [existingUniversity] = await db
        .select({
          id: universities.id,
          slug: universities.slug,
          published: universities.published,
        })
        .from(universities)
        .where(eq(universities.slug, university.slug))
        .limit(1);

      if (existingUniversity?.published) {
        console.warn(
          `Skipping published university "${university.slug}" from ${filePath}. Use a dedicated update workflow for live guides.`,
        );
        continue;
      }

      const [savedUniversity] = await db
        .insert(universities)
        .values({
          countryId,
          slug: university.slug,
          name: university.name,
          city: university.city,
          type: university.type,
          establishedYear: university.establishedYear,
          summary: university.summary,
          featured: university.featured,
          published: university.published,
          officialWebsite: university.officialWebsite,
          logoUrl: university.logoUrl,
          coverImageUrl: university.coverImageUrl,
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
          teachingHospitals: university.teachingHospitals,
          recognitionBadges: university.recognitionBadges,
          recognitionLinks: university.recognitionLinks,
          faq: university.faq,
          similarUniversitySlugs: university.similarUniversitySlugs,
          lastVerifiedAt: university.research.lastVerifiedAt,
          researchSources: university.research.sources,
          researchNotes: university.research.notes,
          admissionsContent: university.admissionsContent ?? {},
        })
        .onConflictDoUpdate({
          target: universities.slug,
          set: {
            countryId,
            name: university.name,
            city: university.city,
            type: university.type,
            establishedYear: university.establishedYear,
            summary: university.summary,
            featured: university.featured,
            published: university.published,
            officialWebsite: university.officialWebsite,
            logoUrl: university.logoUrl,
            coverImageUrl: university.coverImageUrl,
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
            teachingHospitals: university.teachingHospitals,
            recognitionBadges: university.recognitionBadges,
            recognitionLinks: university.recognitionLinks,
            faq: university.faq,
            similarUniversitySlugs: university.similarUniversitySlugs,
            lastVerifiedAt: university.research.lastVerifiedAt,
            researchSources: university.research.sources,
            researchNotes: university.research.notes,
            admissionsContent: university.admissionsContent ?? {},
            updatedAt: new Date(),
          },
        })
        .returning({
          id: universities.id,
        });

      if (!savedUniversity) {
        throw new Error(`Failed to save university "${university.slug}".`);
      }

      importedUniversities += 1;

      for (const program of university.programs) {
        const courseId = courseIdBySlug.get(program.courseSlug);

        if (!courseId) {
          console.warn(
            `Skipping program "${program.slug}" from ${filePath}: course "${program.courseSlug}" does not exist.`,
          );
          continue;
        }

        const [existingProgram] = await db
          .select({
            id: programOfferings.id,
            slug: programOfferings.slug,
            published: programOfferings.published,
          })
          .from(programOfferings)
          .where(eq(programOfferings.slug, program.slug))
          .limit(1);

        if (existingProgram?.published) {
          console.warn(
            `Skipping published program "${program.slug}" from ${filePath}. Use a dedicated update workflow for live programs.`,
          );
          continue;
        }

        await db
          .insert(programOfferings)
          .values({
            universityId: savedUniversity.id,
            courseId,
            slug: program.slug,
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
            published: program.published,
            teachingPhases: program.teachingPhases,
            yearlyCostBreakdown: program.yearlyCostBreakdown,
            licenseExamSupport: program.licenseExamSupport,
            intakeMonths: program.intakeMonths,
            feeVerifiedAt: program.feeVerifiedAt,
            fxRateDate: program.fxRateDate,
            fxRateSourceUrl: program.fxRateSourceUrl,
            feeNotes: program.feeNotes,
            sourceUrls: program.sourceUrls,
            featured: program.featured,
          })
          .onConflictDoUpdate({
            target: programOfferings.slug,
            set: {
              universityId: savedUniversity.id,
              courseId,
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
              published: program.published,
              teachingPhases: program.teachingPhases,
              yearlyCostBreakdown: program.yearlyCostBreakdown,
              licenseExamSupport: program.licenseExamSupport,
              intakeMonths: program.intakeMonths,
              feeVerifiedAt: program.feeVerifiedAt,
              fxRateDate: program.fxRateDate,
              fxRateSourceUrl: program.fxRateSourceUrl,
              feeNotes: program.feeNotes,
              sourceUrls: program.sourceUrls,
              featured: program.featured,
              updatedAt: new Date(),
            },
          });

        importedPrograms += 1;
      }
    }
  }

  console.log(
    `Imported ${importedUniversities} university drafts and ${importedPrograms} program drafts from ${draftFiles.length} research files.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
