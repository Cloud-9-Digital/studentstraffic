import "dotenv/config";

import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import { z } from "zod";

import { countries, courses, programOfferings, universities } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import { isApprovedCanonicalProgramme } from "@/lib/data/program-taxonomy";
import { triggerRevalidate } from "./lib/trigger-revalidate";

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
  stream: z.enum(["engineering", "business"]),
  level: z.enum(["bachelors", "masters"]),
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
  }).default({}),
  summary: z.string().min(180).max(500),
  campusLifestyle: z.string().min(250).max(1800),
  cityProfile: z.string().min(200).max(1500),
  practicalExposure: z.string().min(250).max(1800),
  hostelOverview: z.string().min(200).max(1500),
  dietarySupport: z.string().min(120).max(1000),
  safetyOverview: z.string().min(150).max(1200),
  studentSupport: z.string().min(200).max(1500),
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

const payloadSchema = z.object({
  courses: z.array(courseSchema).min(1),
  universities: z.array(universitySchema).min(1),
});

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const file = argument("--file");
  if (!file) throw new Error("Usage: tsx scripts/publish-catalog-payload.ts --file <payload.json>");

  const payload = payloadSchema.parse(JSON.parse(await readFile(file, "utf8")));
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

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
      if (!country[0]) throw new Error(`Country does not exist: ${university.countrySlug}`);

      const { programmes, ...content } = university;
      const [saved] = await tx.insert(universities).values({
        ...content,
        countryId: country[0].id,
        featured: false,
        published: true,
        similarUniversitySlugs: [],
        lastVerifiedAt: "2026-07-12",
        researchNotes: "Published through validated multi-stream catalogue payload.",
      }).onConflictDoUpdate({
        target: universities.slug,
        set: { ...content, countryId: country[0].id, published: true, updatedAt: new Date() },
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

  await pool.end();
  await triggerRevalidate([], { scope: "catalog", slugs: result });
  console.log(JSON.stringify({ publishedProgrammes: result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
