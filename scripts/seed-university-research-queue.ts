import "dotenv/config";

import { eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  universities,
  universityResearchQueue,
  wdomsDirectoryEntries,
} from "@/lib/db/schema";
import {
  buildWdomsUniversityLookup,
  matchWdomsSchoolToUniversity,
  wdomsCountryConfigs,
} from "@/lib/wdoms";

const HIGH_PRIORITY_COUNTRIES = new Set([
  "georgia",
  "kyrgyzstan",
  "russia",
  "uzbekistan",
  "vietnam",
]);

function resolveRequestedConfigs(requestedSlugs: string[]) {
  if (requestedSlugs.length === 0) {
    return [...wdomsCountryConfigs];
  }

  const requestedSlugSet = new Set(
    requestedSlugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean),
  );
  const selected = wdomsCountryConfigs.filter((config) =>
    requestedSlugSet.has(config.slug),
  );

  const missing = [...requestedSlugSet].filter(
    (slug) => !selected.some((config) => config.slug === slug),
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

function getPriority(countrySlug: string) {
  return HIGH_PRIORITY_COUNTRIES.has(countrySlug) ? "high" : "medium";
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env before running this script.",
    );
  }

  const requestedSlugs = process.argv.slice(2);
  const configs = resolveRequestedConfigs(requestedSlugs);
  const countrySlugs = configs.map((config) => config.slug);

  const [wdomsRows, countryRows, universityRows, existingQueueRows] =
    await Promise.all([
      db
        .select({
          schoolId: wdomsDirectoryEntries.schoolId,
          countrySlug: wdomsDirectoryEntries.countrySlug,
          schoolName: wdomsDirectoryEntries.schoolName,
          cityName: wdomsDirectoryEntries.cityName,
          schoolUrl: wdomsDirectoryEntries.schoolUrl,
          schoolWebsite: wdomsDirectoryEntries.schoolWebsite,
        })
        .from(wdomsDirectoryEntries)
        .where(inArray(wdomsDirectoryEntries.countrySlug, countrySlugs)),
      db
        .select({
          id: countries.id,
          slug: countries.slug,
        })
        .from(countries)
        .where(inArray(countries.slug, countrySlugs)),
      db
        .select({
          id: universities.id,
          slug: universities.slug,
          name: universities.name,
          city: universities.city,
          published: universities.published,
          countrySlug: countries.slug,
        })
        .from(universities)
        .innerJoin(countries, eq(universities.countryId, countries.id))
        .where(inArray(countries.slug, countrySlugs)),
      db
        .select({
          id: universityResearchQueue.id,
          wdomsSchoolId: universityResearchQueue.wdomsSchoolId,
          status: universityResearchQueue.status,
          notes: universityResearchQueue.notes,
          publishedUniversitySlug: universityResearchQueue.publishedUniversitySlug,
        })
        .from(universityResearchQueue)
        .where(inArray(universityResearchQueue.countrySlug, countrySlugs)),
    ]);

  const existingQueueBySchoolId = new Map(
    existingQueueRows.map((row) => [row.wdomsSchoolId, row]),
  );

  const lookupByCountrySlug = new Map(
    countrySlugs.map((slug) => [
      slug,
      buildWdomsUniversityLookup(
        universityRows
          .filter((row) => row.countrySlug === slug)
          .map((row) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            city: row.city,
            published: row.published,
          })),
      ),
    ]),
  );

  let insertedOrUpdated = 0;
  let markedPublished = 0;
  let queuedNew = 0;

  for (const entry of wdomsRows) {
    const existing = existingQueueBySchoolId.get(entry.schoolId);
    const lookup = lookupByCountrySlug.get(entry.countrySlug);
    const matchedUniversity = lookup
      ? matchWdomsSchoolToUniversity(entry, lookup)
      : null;

    const matchedPublished = Boolean(matchedUniversity?.published);
    const status =
      existing?.status === "published" || matchedPublished
        ? "published"
        : existing?.status && existing.status !== "new"
          ? existing.status
          : "new";
    const publishedUniversitySlug = matchedPublished
      ? matchedUniversity?.slug ?? null
      : existing?.publishedUniversitySlug ?? null;
    const notes =
      existing?.notes ??
      (matchedUniversity
        ? `Auto-matched to existing university slug "${matchedUniversity.slug}".`
        : null);

    await db
      .insert(universityResearchQueue)
      .values({
        wdomsSchoolId: entry.schoolId,
        countrySlug: entry.countrySlug,
        schoolName: entry.schoolName,
        cityName: entry.cityName,
        priority: getPriority(entry.countrySlug),
        status,
        matchedUniversityId: matchedUniversity?.id ?? null,
        publishedUniversitySlug,
        notes,
      })
      .onConflictDoUpdate({
        target: universityResearchQueue.wdomsSchoolId,
        set: {
          countrySlug: entry.countrySlug,
          schoolName: entry.schoolName,
          cityName: entry.cityName,
          priority: getPriority(entry.countrySlug),
          status,
          matchedUniversityId: matchedUniversity?.id ?? null,
          publishedUniversitySlug,
          notes,
          updatedAt: new Date(),
        },
      });

    insertedOrUpdated += 1;

    if (status === "published") {
      markedPublished += 1;
    } else if (!existing) {
      queuedNew += 1;
    }
  }

  console.log(
    `Seeded university research queue for ${configs
      .map((config) => config.displayName)
      .join(", ")}.`,
  );
  console.log(`WDOMS schools processed: ${wdomsRows.length}`);
  console.log(`Queue rows inserted or updated: ${insertedOrUpdated}`);
  console.log(`Auto-marked published: ${markedPublished}`);
  console.log(`Net new queue items: ${queuedNew}`);
  console.log(
    `Countries present in catalog: ${countryRows.map((row) => row.slug).join(", ")}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
