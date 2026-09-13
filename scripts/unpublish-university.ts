import "dotenv/config";

import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  courses,
  programOfferings,
  universities,
  universityResearchQueue,
} from "@/lib/db/schema";
import { createSlug } from "@/lib/utils";
import { triggerRevalidate } from "./lib/trigger-revalidate";

type UnpublishArgs = {
  slug?: string;
  queueId?: number;
};

function parseArgs(argv: string[]): UnpublishArgs {
  const args: UnpublishArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];

    if (token === "--slug" && value) {
      args.slug = value.trim();
      index += 1;
      continue;
    }

    if (token === "--queue-id" && value) {
      args.queueId = Number(value);
      index += 1;
    }
  }

  return args;
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const args = parseArgs(process.argv.slice(2));

  if (!args.slug) {
    throw new Error("Pass --slug <university-slug> (optionally --queue-id <id>).");
  }

  const now = new Date();

  // Find the university by slug.
  const universityRows = await db
    .select({
      id: universities.id,
      slug: universities.slug,
      published: universities.published,
      city: universities.city,
      countrySlug: countries.slug,
    })
    .from(universities)
    .leftJoin(countries, eq(universities.countryId, countries.id))
    .where(eq(universities.slug, args.slug))
    .limit(1);

  const university = universityRows[0];

  if (!university) {
    console.log(`No-op: no university found with slug "${args.slug}". Nothing to unpublish.`);
    return;
  }

  // Reset the university's published flag (idempotent).
  let universityChanged = false;

  if (university.published) {
    await db
      .update(universities)
      .set({ published: false, updatedAt: now })
      .where(eq(universities.id, university.id));
    universityChanged = true;
    console.log(`Set universities.published = false for "${university.slug}".`);
  } else {
    console.log(`University "${university.slug}" is already unpublished. Leaving as-is.`);
  }

  // Reset all of its program offerings.
  const publishedPrograms = await db
    .select({
      id: programOfferings.id,
      slug: programOfferings.slug,
      courseSlug: courses.slug,
    })
    .from(programOfferings)
    .leftJoin(courses, eq(programOfferings.courseId, courses.id))
    .where(
      and(
        eq(programOfferings.universityId, university.id),
        eq(programOfferings.published, true),
      ),
    );

  if (publishedPrograms.length > 0) {
    await db
      .update(programOfferings)
      .set({ published: false, updatedAt: now })
      .where(
        and(
          eq(programOfferings.universityId, university.id),
          eq(programOfferings.published, true),
        ),
      );
    console.log(
      `Set program_offerings.published = false for ${publishedPrograms.length} program(s).`,
    );
  } else {
    console.log("No published program offerings to reset.");
  }

  // Reset the matching research-queue row. Prefer the explicit --queue-id;
  // otherwise match on the publishedUniversitySlug / matchedUniversityId the
  // publisher set (publish-university-draft.ts lines ~712-722).
  const queueMatch = args.queueId
    ? eq(universityResearchQueue.id, args.queueId)
    : eq(universityResearchQueue.publishedUniversitySlug, university.slug);

  const queueRows = await db
    .select({
      id: universityResearchQueue.id,
      status: universityResearchQueue.status,
      matchedUniversityId: universityResearchQueue.matchedUniversityId,
      publishedUniversitySlug: universityResearchQueue.publishedUniversitySlug,
    })
    .from(universityResearchQueue)
    .where(queueMatch);

  if (queueRows.length === 0) {
    console.log(
      "No matching research_queue row found (nothing to reset). This is fine for universities that were not published via the research workflow.",
    );
  }

  for (const queueRow of queueRows) {
    const needsReset =
      queueRow.status === "published" ||
      queueRow.matchedUniversityId !== null ||
      queueRow.publishedUniversitySlug !== null;

    if (!needsReset) {
      console.log(
        `Queue row ${queueRow.id} is already reset (status "${queueRow.status}"). Leaving as-is.`,
      );
      continue;
    }

    await db
      .update(universityResearchQueue)
      .set({
        // Reverse of publish-university-draft.ts: status published -> draft_ready,
        // and clear the published pointers it set.
        status: "draft_ready",
        matchedUniversityId: null,
        publishedUniversitySlug: null,
        lastAttemptedAt: now,
        updatedAt: now,
        notes: `Unpublished /universities/${university.slug}; reset to draft_ready via unpublish-university.ts.`,
      })
      .where(eq(universityResearchQueue.id, queueRow.id));

    console.log(
      `Reset queue row ${queueRow.id}: status -> draft_ready, cleared matchedUniversityId and publishedUniversitySlug.`,
    );
  }

  if (!universityChanged && publishedPrograms.length === 0 && queueRows.length === 0) {
    console.log(`No-op: "${args.slug}" was already fully unpublished.`);
    return;
  }

  // Only this university's entities change: its page, its programme pages and
  // the country, course and city listings that included it. The shared
  // "catalog"/"universities" tags would regenerate every catalogue page against
  // Neon (2026-09-09 outage). scope "catalog" still adds the bounded discovery
  // indexes (finder, program-offerings, sitemap, search).
  const courseSlugs = [
    ...new Set(
      publishedPrograms
        .map((program) => program.courseSlug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ];
  await triggerRevalidate(
    [
      `university:${university.slug}`,
      `university-programs:${university.slug}`,
      ...(university.countrySlug
        ? [`country:${university.countrySlug}`, `country-programs:${university.countrySlug}`]
        : []),
      ...courseSlugs.map((slug) => `course-programs:${slug}`),
      `city-programs:${createSlug(university.city)}`,
    ],
    {
      scope: "catalog",
      slugs: publishedPrograms.map((program) => program.slug),
      paths: [
        `/university/${university.slug}`,
        ...(university.countrySlug ? [`/countries/${university.countrySlug}`] : []),
      ],
    },
  );

  console.log(`Done. Unpublished "${university.slug}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
