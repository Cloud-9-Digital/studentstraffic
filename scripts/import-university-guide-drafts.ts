import "dotenv/config";

import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  courses,
  programOfferings,
  universities,
} from "@/lib/db/schema";
import { env } from "@/lib/env";
import { resolveProgramImportAction } from "@/lib/research/program-import-decision";
import { readUniversityGuideDraftBatches } from "@/lib/research/university-guide-drafts";
import { syncTypesenseSearchIndex } from "@/lib/search/admin";
import { triggerRevalidate } from "./lib/trigger-revalidate";

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

      let universityId: number;

      if (existingUniversity?.published) {
        // Never overwrite an already-published university's own fields — but still
        // allow adding brand-new programs to it below (e.g. a second course at an
        // existing university). See the per-program courseId check further down.
        universityId = existingUniversity.id;
        console.log(
          `University "${university.slug}" from ${filePath} is already published — leaving its fields untouched, only checking for new programs to add.`,
        );
      } else {
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

        universityId = savedUniversity.id;
        importedUniversities += 1;
      }

      for (const program of university.programs) {
        const courseId = courseIdBySlug.get(program.courseSlug);

        if (!courseId) {
          console.warn(
            `Skipping program "${program.slug}" from ${filePath}: course "${program.courseSlug}" does not exist.`,
          );
          continue;
        }

        const [existingProgramForCourse] = existingUniversity?.published
          ? await db
              .select({ id: programOfferings.id })
              .from(programOfferings)
              .where(
                and(
                  eq(programOfferings.universityId, universityId),
                  eq(programOfferings.courseId, courseId),
                ),
              )
              .limit(1)
          : [];

        const [existingProgram] = await db
          .select({
            id: programOfferings.id,
            slug: programOfferings.slug,
            published: programOfferings.published,
          })
          .from(programOfferings)
          .where(eq(programOfferings.slug, program.slug))
          .limit(1);

        const decision = resolveProgramImportAction({
          universityAlreadyPublished: Boolean(existingUniversity?.published),
          courseAlreadyOfferedByUniversity: Boolean(existingProgramForCourse),
          existingProgramPublished: Boolean(existingProgram?.published),
        });

        if (decision.action === "skip") {
          const message =
            decision.reason === "course-already-offered"
              ? `Skipping program "${program.slug}" from ${filePath}: "${university.slug}" already offers course "${program.courseSlug}" — never overwriting an existing published program.`
              : `Skipping published program "${program.slug}" from ${filePath}. Use a dedicated update workflow for live programs.`;
          console.warn(message);
          continue;
        }

        await db
          .insert(programOfferings)
          .values({
            universityId,
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
              universityId,
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

  if (importedUniversities > 0 || importedPrograms > 0) {
    if (env.hasTypesenseAdmin) {
      const result = await syncTypesenseSearchIndex();
      console.log(`Typesense search sync complete. Indexed ${result.imported} documents.`);
    } else {
      console.warn("Skipping Typesense sync: TYPESENSE_HOST/TYPESENSE_API_KEY are not configured.");
    }

    await triggerRevalidate(["catalog", "universities", "program-offerings"]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
