import "dotenv/config";

import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { countries, universities, universityResearchQueue } from "@/lib/db/schema";

const HIGH_PRIORITY_COUNTRIES = new Set([
  "georgia",
  "kyrgyzstan",
  "russia",
  "uzbekistan",
  "vietnam",
]);

function getPriority(countrySlug: string) {
  return HIGH_PRIORITY_COUNTRIES.has(countrySlug) ? "high" : "medium";
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
    throw new Error("Pass at least one country slug, e.g. `pnpm exec tsx scripts/seed-live-university-refresh-queue.ts vietnam`.");
  }

  const countryRows = await db
    .select({
      id: countries.id,
      slug: countries.slug,
    })
    .from(countries)
    .where(inArray(countries.slug, requestedCountrySlugs));

  const foundSlugs = new Set(countryRows.map((row) => row.slug));
  const missingSlugs = requestedCountrySlugs.filter((slug) => !foundSlugs.has(slug));

  if (missingSlugs.length > 0) {
    throw new Error(`Unknown country slug(s): ${missingSlugs.join(", ")}`);
  }

  const liveUniversityRows = await db
    .select({
      id: universities.id,
      slug: universities.slug,
      name: universities.name,
      city: universities.city,
      countrySlug: countries.slug,
    })
    .from(universities)
    .innerJoin(countries, eq(universities.countryId, countries.id))
    .where(
      and(
        inArray(countries.slug, requestedCountrySlugs),
        eq(universities.published, true),
      ),
    );

  let insertedOrUpdated = 0;

  for (const row of liveUniversityRows) {
    const syntheticSchoolId = `live:${row.countrySlug}:${row.slug}`;
    const note =
      `Seeded from live university catalog for verification refresh on ${new Date()
        .toISOString()
        .slice(0, 10)}.`;

    await db
      .insert(universityResearchQueue)
      .values({
        discoveryKey: syntheticSchoolId,
        countrySlug: row.countrySlug,
        schoolName: row.name,
        cityName: row.city,
        priority: getPriority(row.countrySlug),
        status: "new",
        matchedUniversityId: row.id,
        publishedUniversitySlug: row.slug,
        notes: note,
      })
      .onConflictDoUpdate({
        target: universityResearchQueue.discoveryKey,
        set: {
          countrySlug: row.countrySlug,
          schoolName: row.name,
          cityName: row.city,
          priority: getPriority(row.countrySlug),
          matchedUniversityId: row.id,
          publishedUniversitySlug: row.slug,
          notes: note,
          updatedAt: new Date(),
        },
      });

    insertedOrUpdated += 1;
  }

  console.log(
    `Seeded live-university refresh queue for ${requestedCountrySlugs.join(", ")}.`,
  );
  console.log(`Published universities queued: ${liveUniversityRows.length}`);
  console.log(`Queue rows inserted or updated: ${insertedOrUpdated}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
