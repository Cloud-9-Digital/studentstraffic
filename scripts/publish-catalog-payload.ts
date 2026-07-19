import "./lib/load-script-env.mjs";

import { spawn } from "node:child_process";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import { z } from "zod";

import { countries, courses, programOfferings, universities } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import {
  isApprovedCanonicalProgramme,
  programmeLevels,
  programmeStreams,
} from "@/lib/data/program-taxonomy";
import { triggerRevalidate } from "./lib/trigger-revalidate";
import { env } from "@/lib/env";

const sourceSchema = z.object({
  label: z.string().min(2),
  url: z.string().url(),
  kind: z.enum(["official-university", "official-program", "official-fee", "government", "recognition", "other"]),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

const cloudinaryImageUrlSchema = z.string().url().refine(
  (value) => new URL(value).hostname === "res.cloudinary.com",
  "Public university images must be hosted on Cloudinary.",
);

const courseSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  shortName: z.string().min(2),
  stream: z.enum(programmeStreams),
  level: z.enum(programmeLevels),
  discipline: z.string().min(2),
  aliases: z.array(z.string().min(2)),
  displayOrder: z.number().int().nonnegative(),
  durationYears: z.number().int().positive(),
  summary: z.string().min(180).max(1000),
  metaTitle: z.string().min(20).max(70),
  metaDescription: z.string().min(80).max(170),
});

const programmeSchema = z.object({
  slug: z.string().min(2),
  canonicalCourseSlug: z.string().min(2),
  officialTitle: z.string().min(2),
  durationYears: z.number().positive(),
  officialFeeCurrency: z.string().length(3),
  officialAnnualTuitionAmount: z.number().int().nonnegative().nullable(),
  officialTotalTuitionAmount: z.number().int().nonnegative().nullable(),
  officialProgramUrl: z.string().url(),
  audienceEligibility: z.object({
    availability: z.enum(["global", "restricted", "local-only"]),
    eligibleAudiences: z.array(z.string().min(2)),
    restrictions: z.array(z.string().min(5)),
    notes: z.string().min(10).optional(),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sourceUrl: z.string().url(),
  }),
  admissionsContent: z.object({
    overview: z.string().min(40).max(420),
    eligibility: z.object({
      intro: z.string().min(30).max(320),
      items: z.array(z.string().min(8).max(220)).min(1).max(8),
    }),
    applicationSteps: z.array(z.string().min(12).max(280)).min(2).max(8),
    documentsRequired: z.object({
      academic: z.array(z.string().min(4).max(180)).min(1).max(10),
      application: z.array(z.string().min(4).max(180)).min(1).max(10),
    }),
    deadlinesNote: z.string().min(20).max(300).optional(),
    visaConsiderations: z.array(z.string().min(8).max(220)).max(5).optional(),
  }),
  medium: z.string().min(2),
  intakeMonths: z.array(z.string().min(2)).min(1),
  feeVerifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  feeNotes: z.string().min(40).max(1200),
  teachingPhases: z.array(z.object({ phase: z.string(), language: z.string(), details: z.string() })).min(1),
  sourceUrls: z.array(z.string().url()).min(2),
});

const universitySchema = z.object({
  countrySlug: z.string().min(2),
  slug: z.string().min(2),
  name: z.string().min(2),
  city: z.string().min(2),
  type: z.enum(["Public", "Private"]),
  establishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  officialWebsite: z.string().url(),
  logoUrl: cloudinaryImageUrlSchema.optional(),
  coverImageUrl: cloudinaryImageUrlSchema.optional(),
  mediaAttribution: z.object({
    logo: z.object({ sourceUrl: z.string().url(), rights: z.string().min(5), checkedAt: z.string() }).optional(),
    cover: z.object({ sourceUrl: z.string().url(), rights: z.string().min(5), checkedAt: z.string(), altText: z.string().min(10) }).optional(),
    studentLife: z.object({
      campusEnvironment: z.object({ url: cloudinaryImageUrlSchema, sourceUrl: z.string().url(), rights: z.string().min(5), checkedAt: z.string(), altText: z.string().min(10) }).optional(),
      accommodation: z.object({ url: cloudinaryImageUrlSchema, sourceUrl: z.string().url(), rights: z.string().min(5), checkedAt: z.string(), altText: z.string().min(10) }).optional(),
      dailyLiving: z.object({ url: cloudinaryImageUrlSchema, sourceUrl: z.string().url(), rights: z.string().min(5), checkedAt: z.string(), altText: z.string().min(10) }).optional(),
      safetySupport: z.object({ url: cloudinaryImageUrlSchema, sourceUrl: z.string().url(), rights: z.string().min(5), checkedAt: z.string(), altText: z.string().min(10) }).optional(),
    }).optional(),
  }).default({}),
  summary: z.string().min(180).max(500),
  campusLifestyle: z.string().min(40).max(700),
  cityProfile: z.string().min(200).max(1500),
  practicalExposure: z.string().min(250).max(1800),
  hostelOverview: z.string().min(40).max(800),
  dietarySupport: z.string().min(40).max(550),
  safetyOverview: z.string().min(40).max(450),
  studentSupport: z.string().min(40).max(450),
  whyChoose: z.array(z.string().min(20)).min(3).max(6),
  thingsToConsider: z.array(z.string().min(20)).min(3).max(6),
  bestFitFor: z.array(z.string().min(20)).min(3).max(6),
  industryPartners: z.array(z.string()),
  recognitionBadges: z.array(z.string().min(4)).min(2),
  recognitionLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).min(2),
  faq: z.array(z.object({ question: z.string().min(10), answer: z.string().min(40).max(700) })).min(6).max(13),
  researchSources: z.array(sourceSchema).min(4),
  admissionsContent: z.record(z.string(), z.unknown()),
  programmes: z.array(programmeSchema).min(1),
});

const countrySchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  region: z.string().min(2),
  summary: z.string().min(120).max(900),
  whyStudentsChooseIt: z.string().min(80).max(900),
  climate: z.string().min(20).max(300),
  currencyCode: z.string().length(3),
  metaTitle: z.string().min(20).max(70),
  metaDescription: z.string().min(80).max(170),
});

export const payloadSchema = z.object({
  countries: z.array(countrySchema).default([]),
  courses: z.array(courseSchema).min(1),
  universities: z.array(universitySchema).min(1),
});

export type CatalogPayload = z.infer<typeof payloadSchema>;

function syncTypesenseSearch() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--import", "tsx", "scripts/sync-typesense-search.ts"],
      { cwd: process.cwd(), env: process.env, stdio: "inherit" },
    );
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Typesense search sync exited with code ${code ?? "unknown"}.`));
    });
  });
}

/**
 * Apply one already-validated catalogue payload. This is intentionally only
 * exported for the content-migration runner; do not add a new direct CLI path.
 */
export async function publishCatalogPayload(payload: CatalogPayload) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {

  for (const course of payload.courses) {
    if (!isApprovedCanonicalProgramme(course.slug)) {
      throw new Error(`Unapproved canonical programme: ${course.slug}`);
    }
    const normalizeFocus = (value: string) => value.toLowerCase().replace(/&/g, "and");
    const focusKeywords = [course.shortName, course.name].map(normalizeFocus);
    if (!focusKeywords.some((keyword) => normalizeFocus(course.metaTitle).includes(keyword))) {
      throw new Error(`Meta title must include focus keyword '${course.shortName}' or '${course.name}'.`);
    }
    if (!focusKeywords.some((keyword) => normalizeFocus(course.metaDescription).includes(keyword))) {
      throw new Error(`Meta description must include focus keyword '${course.shortName}' or '${course.name}'.`);
    }
  }

  const result = await db.transaction(async (tx) => {
    const countryIds = new Map<string, number>();
    for (const country of payload.countries) {
      const [row] = await tx.insert(countries).values({
        slug: country.slug,
        name: country.name,
        region: country.region,
        summary: country.summary,
        whyStudentsChooseIt: country.whyStudentsChooseIt,
        climate: country.climate,
        currencyCode: country.currencyCode,
        metaTitle: country.metaTitle,
        metaDescription: country.metaDescription,
      }).onConflictDoUpdate({
        target: countries.slug,
        set: { ...country, updatedAt: new Date() },
      }).returning({ id: countries.id });
      if (!row) throw new Error(`Failed to publish country ${country.slug}`);
      countryIds.set(country.slug, row.id);
    }

    const courseIds = new Map<string, number>();
    for (const course of payload.courses) {
      const [row] = await tx.insert(courses).values({ ...course, active: true }).onConflictDoUpdate({
        target: courses.slug,
        set: { ...course, active: true, updatedAt: new Date() },
      }).returning({ id: courses.id });
      if (!row) throw new Error(`Failed to publish course ${course.slug}`);
      courseIds.set(course.slug, row.id);
    }

    const published: string[] = [];
    for (const university of payload.universities) {
      const country = await tx.select({ id: countries.id }).from(countries)
        .where(eq(countries.slug, university.countrySlug)).limit(1);
      const countryId = country[0]?.id ?? countryIds.get(university.countrySlug);
      if (!countryId) throw new Error(`Country does not exist: ${university.countrySlug}`);

      const { programmes, ...content } = university;
      const [saved] = await tx.insert(universities).values({
        ...content,
        countryId,
        featured: false,
        published: true,
        similarUniversitySlugs: [],
        lastVerifiedAt: "2026-07-12",
        researchNotes: "Published through validated multi-stream catalogue payload.",
      }).onConflictDoUpdate({
        target: universities.slug,
        set: { ...content, countryId, published: true, updatedAt: new Date() },
      }).returning({ id: universities.id, slug: universities.slug });
      if (!saved) throw new Error(`Failed to publish university ${university.slug}`);

      for (const programme of programmes) {
        const courseId = courseIds.get(programme.canonicalCourseSlug);
        if (!courseId) throw new Error(`Course missing from payload: ${programme.canonicalCourseSlug}`);
        const { canonicalCourseSlug: _canonicalCourseSlug, officialTitle, ...offering } = programme;
        void _canonicalCourseSlug;
        await tx.insert(programOfferings).values({
          ...offering,
          universityId: saved.id,
          courseId,
          title: officialTitle,
          annualTuitionUsd: 0,
          totalTuitionUsd: 0,
          livingUsd: 0,
          professionalExamSupport: [],
          yearlyCostBreakdown: [],
          featured: false,
          published: true,
        }).onConflictDoUpdate({
          target: programOfferings.slug,
          set: { ...offering, universityId: saved.id, courseId, title: officialTitle, published: true, updatedAt: new Date() },
        });
        published.push(programme.slug);
      }
    }
    return published;
  });

  const universitySlugs = payload.universities.map((university) => university.slug);
  const countrySlugs = [...new Set([
    ...payload.countries.map((country) => country.slug),
    ...payload.universities.map((university) => university.countrySlug),
  ])];
  const courseSlugs = [...new Set([
    ...payload.courses.map((course) => course.slug),
    ...payload.universities.flatMap((university) =>
      university.programmes.map((programme) => programme.canonicalCourseSlug),
    ),
  ])];
  const citySlugs = [...new Set(
    payload.universities.map((university) =>
      university.city.toLowerCase().normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    ),
  )];
  if (env.hasTypesenseAdmin) {
    await syncTypesenseSearch();
  }
  await triggerRevalidate(
    [
      "universities",
      ...countrySlugs.flatMap((slug) => [
        `country:${slug}`,
        `country-programs:${slug}`,
      ]),
      ...courseSlugs.map((slug) => `course-programs:${slug}`),
      ...citySlugs.map((slug) => `city-programs:${slug}`),
      ...universitySlugs.flatMap((slug) => [
        `university:${slug}`,
        `university-programs:${slug}`,
      ]),
    ],
    {
      scope: "catalog",
      slugs: result,
      paths: [
        ...countrySlugs.map((slug) => `/countries/${slug}`),
        ...universitySlugs.map((slug) => `/university/${slug}`),
      ],
    },
  );
  return { publishedProgrammes: result };
  } finally {
    await pool.end();
  }
}

// This command used to write an arbitrary JSON file directly to production.
// Content must now be committed as an immutable numbered bundle and applied by
// `npm run content:migrate -- --apply`, which records its checksum in the DB.
if (process.argv[1]?.endsWith("publish-catalog-payload.ts")) {
  throw new Error(
    "Direct catalogue publishing is disabled. Put the payload in content-migrations/<sequence>/ and run npm run content:migrate -- --apply.",
  );
}
