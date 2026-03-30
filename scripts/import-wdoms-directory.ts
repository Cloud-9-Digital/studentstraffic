import "dotenv/config";

import { and, eq, notInArray } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { wdomsDirectoryEntries } from "@/lib/db/schema";
import {
  scrapeWdomsSchoolDetails,
  scrapeWdomsSchools,
  wdomsCountryConfigs,
} from "@/lib/wdoms";

function resolveRequestedConfigs(requestedSlugs: string[]) {
  if (requestedSlugs.length === 0) {
    return [...wdomsCountryConfigs];
  }

  const requestedSlugSet = new Set(requestedSlugs.map((slug) => slug.toLowerCase()));
  const selected = wdomsCountryConfigs.filter((config) =>
    requestedSlugSet.has(config.slug),
  );

  const missing = requestedSlugs.filter(
    (slug) => !selected.some((config) => config.slug === slug.toLowerCase()),
  );

  if (missing.length > 0) {
    throw new Error(
      `Unknown WDOMS country slug(s): ${missing.join(", ")}. Available: ${wdomsCountryConfigs
        .map((config) => config.slug)
        .join(", ")}`,
    );
  }

  return selected;
}

async function importCountry(slug: string) {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const config = wdomsCountryConfigs.find((candidate) => candidate.slug === slug);

  if (!config) {
    throw new Error(`Could not find WDOMS config for "${slug}".`);
  }

  const schools = await scrapeWdomsSchools(config.wdomsCountryCode);

  for (const school of schools) {
    const details = await scrapeWdomsSchoolDetails(school.schoolId);

    await db
      .insert(wdomsDirectoryEntries)
      .values({
        countrySlug: config.slug,
        countryName: config.wdomsCountryName,
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        cityName: school.cityName,
        schoolUrl: school.schoolUrl,
        schoolType: details.schoolType,
        operationalStatus: details.operationalStatus,
        yearInstructionStarted: details.yearInstructionStarted,
        academicAffiliation: details.academicAffiliation,
        clinicalFacilities: details.clinicalFacilities,
        clinicalTraining: details.clinicalTraining,
        schoolWebsite: details.schoolWebsite,
        mainAddress: details.mainAddress,
        qualificationTitle: details.qualificationTitle,
        curriculumDuration: details.curriculumDuration,
        languageOfInstruction: details.languageOfInstruction,
        prerequisiteEducation: details.prerequisiteEducation,
        foreignStudents: details.foreignStudents,
        entranceExam: details.entranceExam,
      })
      .onConflictDoUpdate({
        target: wdomsDirectoryEntries.schoolId,
        set: {
          countrySlug: config.slug,
          countryName: config.wdomsCountryName,
          schoolName: school.schoolName,
          cityName: school.cityName,
          schoolUrl: school.schoolUrl,
          schoolType: details.schoolType,
          operationalStatus: details.operationalStatus,
          yearInstructionStarted: details.yearInstructionStarted,
          academicAffiliation: details.academicAffiliation,
          clinicalFacilities: details.clinicalFacilities,
          clinicalTraining: details.clinicalTraining,
          schoolWebsite: details.schoolWebsite,
          mainAddress: details.mainAddress,
          qualificationTitle: details.qualificationTitle,
          curriculumDuration: details.curriculumDuration,
          languageOfInstruction: details.languageOfInstruction,
          prerequisiteEducation: details.prerequisiteEducation,
          foreignStudents: details.foreignStudents,
          entranceExam: details.entranceExam,
          updatedAt: new Date(),
        },
      });
  }

  if (schools.length > 0) {
    await db
      .delete(wdomsDirectoryEntries)
      .where(
        and(
          eq(wdomsDirectoryEntries.countrySlug, config.slug),
          notInArray(
            wdomsDirectoryEntries.schoolId,
            schools.map((school) => school.schoolId),
          ),
        ),
      );
  }

  const imported = await db
    .select({
      schoolId: wdomsDirectoryEntries.schoolId,
    })
    .from(wdomsDirectoryEntries)
    .where(eq(wdomsDirectoryEntries.countrySlug, config.slug));

  console.log(
    `Imported ${schools.length} WDOMS schools for ${config.displayName}. Database now has ${imported.length} entries for ${config.slug}.`,
  );
}

async function main() {
  const requestedSlugs = process.argv.slice(2);
  const configs = resolveRequestedConfigs(requestedSlugs);

  for (const config of configs) {
    await importCountry(config.slug);
  }

  console.log(
    `Finished WDOMS import for ${configs.map((config) => config.displayName).join(", ")}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
