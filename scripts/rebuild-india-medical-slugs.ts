import "dotenv/config";

import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  indiaMedicalColleges,
  indiaMedicalPrograms,
} from "@/lib/db/schema";
import {
  buildIndiaCollegeSlug,
  buildIndiaProgramSlug,
} from "@/lib/india-mbbs-slugs";

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("Database connection not available. Check DATABASE_URL.");
  }

  const colleges = await db
    .select({
      id: indiaMedicalColleges.id,
      collegeCode: indiaMedicalColleges.collegeCode,
      collegeName: indiaMedicalColleges.collegeName,
      cityName: indiaMedicalColleges.cityName,
      stateName: indiaMedicalColleges.stateName,
    })
    .from(indiaMedicalColleges)
    .orderBy(
      asc(indiaMedicalColleges.collegeName),
      asc(indiaMedicalColleges.stateName),
      asc(indiaMedicalColleges.id),
    );

  const programs = await db
    .select({
      id: indiaMedicalPrograms.id,
      collegeId: indiaMedicalPrograms.collegeId,
      courseName: indiaMedicalPrograms.courseName,
    })
    .from(indiaMedicalPrograms)
    .orderBy(
      asc(indiaMedicalPrograms.collegeId),
      asc(indiaMedicalPrograms.courseName),
      asc(indiaMedicalPrograms.id),
    );

  const usedCollegeSlugs = new Set<string>();
  const collegeSlugById = new Map<number, string>();

  for (const college of colleges) {
    const nextSlug = buildIndiaCollegeSlug({
      collegeCode: college.collegeCode ?? undefined,
      collegeName: college.collegeName,
      cityName: college.cityName ?? undefined,
      stateName: college.stateName,
      existingSlugs: usedCollegeSlugs,
    });

    usedCollegeSlugs.add(nextSlug);
    collegeSlugById.set(college.id, nextSlug);

    await db
      .update(indiaMedicalColleges)
      .set({
        slug: nextSlug,
        updatedAt: new Date(),
      })
      .where(eq(indiaMedicalColleges.id, college.id));
  }

  const usedProgramSlugs = new Set<string>();

  for (const program of programs) {
    const collegeSlug = collegeSlugById.get(program.collegeId);

    if (!collegeSlug) {
      continue;
    }

    const nextSlug = buildIndiaProgramSlug(
      collegeSlug,
      program.courseName,
      usedProgramSlugs,
    );

    usedProgramSlugs.add(nextSlug);

    await db
      .update(indiaMedicalPrograms)
      .set({
        slug: nextSlug,
        updatedAt: new Date(),
      })
      .where(eq(indiaMedicalPrograms.id, program.id));
  }

  console.log(
    `Rebuilt ${colleges.length} college slugs and ${programs.length} program slugs.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
