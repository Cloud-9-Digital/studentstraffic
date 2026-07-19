import { z } from "zod";

import { programmeLevels, programmeStreams } from "@/lib/data/program-taxonomy";

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

export const catalogPayloadSchema = z.object({
  countries: z.array(countrySchema).default([]),
  courses: z.array(courseSchema).min(1),
  universities: z.array(universitySchema).min(1),
});

export type CatalogPayload = z.infer<typeof catalogPayloadSchema>;
