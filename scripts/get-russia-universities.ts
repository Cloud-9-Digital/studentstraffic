import { db } from "@/lib/db/transport";
import { universities, programOfferings, countries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getRussiaUniversities() {
  // Get Russia country ID
  const russia = await db
    .select()
    .from(countries)
    .where(eq(countries.slug, "russia"))
    .limit(1);

  if (!russia.length) {
    console.log("Russia not found in database");
    return;
  }

  const russiaId = russia[0].id;

  // Get all Russian universities with their MBBS programs
  const russianUniversities = await db
    .select({
      universityId: universities.id,
      universityName: universities.name,
      universitySlug: universities.slug,
      city: universities.city,
      programId: programOfferings.id,
      programTitle: programOfferings.title,
      annualTuitionUsd: programOfferings.annualTuitionUsd,
      totalTuitionUsd: programOfferings.totalTuitionUsd,
      medium: programOfferings.medium,
      durationYears: programOfferings.durationYears,
    })
    .from(universities)
    .leftJoin(programOfferings, eq(universities.id, programOfferings.universityId))
    .where(eq(universities.countryId, russiaId));

  console.log("\n=== RUSSIAN UNIVERSITIES IN DATABASE ===\n");
  console.log(JSON.stringify(russianUniversities, null, 2));
  console.log(`\nTotal: ${russianUniversities.length} records`);

  // Group by university
  const grouped = russianUniversities.reduce((acc, row) => {
    if (!acc[row.universityName]) {
      acc[row.universityName] = {
        name: row.universityName,
        slug: row.universitySlug,
        city: row.city,
        programs: [],
      };
    }
    if (row.programId) {
      acc[row.universityName].programs.push({
        title: row.programTitle,
        annualFee: row.annualTuitionUsd,
        totalFee: row.totalTuitionUsd,
        medium: row.medium,
        duration: row.durationYears,
      });
    }
    return acc;
  }, {} as any);

  console.log("\n=== GROUPED BY UNIVERSITY ===\n");
  Object.values(grouped).forEach((uni: any) => {
    console.log(`${uni.name} (${uni.city})`);
    uni.programs.forEach((prog: any) => {
      console.log(`  - ${prog.title}: $${prog.annualFee}/year (Total: $${prog.totalFee})`);
    });
    console.log("");
  });
}

getRussiaUniversities().catch(console.error);
