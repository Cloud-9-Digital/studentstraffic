import { parseReportedFeeQuote, type ReportedFeeQuote } from "../../lib/reported-fee-quote";
import { z } from "zod";

import { programmeLevels, programmeStreams } from "@/lib/data/program-taxonomy";
import {
  intakeMonthCodes,
  teachingLanguageCodes,
} from "@/lib/catalogue-facets";
import {
  instructionLanguagesSchema,
  programmeMediumNoteSchema,
  programmeMediumSchema,
} from "./programme-medium";

const sourceSchema = z.object({
  label: z.string().min(2),
  url: z.string().url(),
  kind: z.enum(["official-university", "official-program", "official-fee", "government", "recognition", "other"]),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

const evidenceSchema = z.object({
  entity: z.enum(["country", "university", "programme"]),
  countrySlug: z.string().min(2).optional(),
  universitySlug: z.string().min(2).optional(),
  programmeSlug: z.string().min(2).optional(),
  publicField: z.string().min(2).max(80),
  claimText: z.string().min(12).max(1200),
  status: z.enum(["verified", "indicative", "omit"]),
  sourceLabel: z.string().min(2).max(180),
  sourceUrl: z.string().url(),
  sourceGrade: z.enum(["A", "B", "C"]),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reviewBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  internalNotes: z.string().max(1200).optional(),
}).superRefine((evidence, ctx) => {
  if (evidence.entity === "country" && !evidence.countrySlug) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Country evidence needs countrySlug." });
  }
  if (evidence.entity === "university" && !evidence.universitySlug) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "University evidence needs universitySlug." });
  }
  if (evidence.entity === "programme" && (!evidence.universitySlug || !evidence.programmeSlug)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Programme evidence needs universitySlug and programmeSlug." });
  }
});

// Who a fee applies to. Indian universities often publish an Indian-student fee and a separate
// NRI/foreign fee for the same programme; "all" means one fee for every applicant.
const feeAudienceSchema = z.enum(["domestic", "international", "all"]);

const additionalFeeSchema = z.object({
  audience: feeAudienceSchema,
  currency: z.string().length(3),
  annualAmount: z.number().int().positive(),
  totalAmount: z.number().int().positive().nullable().optional(),
  academicYear: z.string().min(4).max(40),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().min(20).max(600),
});

const feeSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("confirmed"),
    audience: feeAudienceSchema.optional(),
    academicYear: z.string().min(4).max(40),
    officialFeeCurrency: z.string().regex(/^[A-Z]{3}$/),
    // An explicit native zero means verified NIL tuition, not missing pricing.
    // USD sentinels, indicative ranges and additional fees keep their existing rules.
    officialAnnualTuitionAmount: z.number().int().nonnegative(),
    officialTotalTuitionAmount: z.number().int().nonnegative().nullable().optional(),
    annualTuitionUsd: z.number().int().positive().nullable().optional(),
    totalTuitionUsd: z.number().int().positive().nullable().optional(),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    notes: z.string().min(20).max(1200),
  }),
  z.object({
    status: z.literal("indicative"),
    audience: feeAudienceSchema.optional(),
    academicYear: z.string().min(4).max(40),
    annualTuitionMinUsd: z.number().int().positive(),
    annualTuitionMaxUsd: z.number().int().positive(),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    notes: z.string().min(20).max(1200),
  }).refine((fee) => fee.annualTuitionMinUsd <= fee.annualTuitionMaxUsd, {
    message: "Indicative fee minimum must not exceed its maximum.",
  }),
  z.object({
    status: z.literal("on_request"),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    notes: z.string().min(20).max(1200),
  }),
]);

// Teaching-language rules (medium label, placeholder rejection, mediumNote, instructionLanguages)
// live in ./programme-medium.ts so the legacy direct writers enforce the same schema.
export { programmeMediumNoteSchema, programmeMediumSchema };

/**
 * Pre-2026-09 offering `medium` rule: any free-text string of 2+ chars, stored verbatim.
 * Only for grandfathered, already-applied content-migration bundles listed in
 * `LEGACY_FREE_TEXT_MEDIUM_MIGRATION_IDS` (scripts/lib/content-migrations.ts). Never use it for new bundles.
 */
export const legacyFreeTextMediumSchema = z.string().min(2);

const optionalMediumSchema = z.union([z.literal(""), programmeMediumSchema]);
type OfferingMediumSchema = typeof optionalMediumSchema | typeof programmeMediumSchema | typeof legacyFreeTextMediumSchema;

const cloudinaryImageUrlSchema = z.string().url().refine(
  (value) => new URL(value).hostname === "res.cloudinary.com",
  "Public university images must be hosted on Cloudinary.",
);

// Match courses.duration_years numeric(4,1), preserving half-year awards without rounding.
export const courseDurationYearsSchema = z.number().positive().max(999.9).multipleOf(0.1);

const courseSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  shortName: z.string().min(2),
  stream: z.enum(programmeStreams),
  level: z.enum(programmeLevels),
  discipline: z.string().min(2),
  aliases: z.array(z.string().min(2)),
  displayOrder: z.number().int().nonnegative(),
  durationYears: courseDurationYearsSchema,
  summary: z.string().min(180).max(1000),
  metaTitle: z.string().min(20).max(70),
  metaDescription: z.string().min(80).max(170),
});

const createProgrammeSchema = (mediumSchema: OfferingMediumSchema) => z.object({
  slug: z.string().min(2),
  canonicalCourseSlug: z.string().min(2),
  officialTitle: z.string().min(2),
  durationYears: z.number().positive(),
  fee: feeSchema,
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
    reportedFeeQuote: z.custom<ReportedFeeQuote>((value) => Boolean(parseReportedFeeQuote(value)), "Invalid reported fee quote: retain native amount, basis, period, category and source provenance.").transform((value) => parseReportedFeeQuote(value)!).optional(),
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
  medium: mediumSchema,
  mediumNote: programmeMediumNoteSchema,
  instructionLanguages: mediumSchema === optionalMediumSchema ? z.array(z.enum(teachingLanguageCodes)) : instructionLanguagesSchema,
  intakeMonths: z.array(z.string().min(2)),
  intakeCodes: z.array(z.enum(intakeMonthCodes)),
  feeVerifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  feeNotes: z.string().min(40).max(1200),
  teachingPhases: z.array(z.object({ phase: z.string(), language: z.string(), details: z.string() })).min(1),
  additionalFees: z.array(additionalFeeSchema).max(3).optional(),
});

const createUniversitySchema = (mediumSchema: OfferingMediumSchema) => z.object({
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
  recognitionBadges: z.array(z.string().min(4)).min(1),
  recognitionLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
  faq: z.array(z.object({ question: z.string().min(10), answer: z.string().min(40).max(700) })).min(6).max(13),
  researchSources: z.array(sourceSchema).min(4),
  admissionsContent: z.record(z.string(), z.unknown()),
  programmes: z.array(createProgrammeSchema(mediumSchema)).min(1),
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

/**
 * Builds the catalogue payload schema. Every rule is shared; only the offering `medium` rule varies,
 * so the legacy variant cannot drift from the strict schema in any other field.
 */
function createCatalogPayloadSchema(mediumSchema: OfferingMediumSchema) {
  return z.object({
    countries: z.array(countrySchema).default([]),
    courses: z.array(courseSchema).min(1),
    universities: z.array(createUniversitySchema(mediumSchema)).min(1),
    evidence: z.array(evidenceSchema).min(1),
  });
}

/** Strict schema for every new content-migration bundle. */
export const catalogPayloadSchema = createCatalogPayloadSchema(optionalMediumSchema);

/**
 * Identical to `catalogPayloadSchema` except offering `medium` uses `legacyFreeTextMediumSchema`.
 * Only for the frozen grandfathered bundle ids in scripts/lib/content-migrations.ts.
 */
export const legacyFreeTextMediumCatalogPayloadSchema = createCatalogPayloadSchema(legacyFreeTextMediumSchema);

export type CatalogPayload = z.infer<typeof catalogPayloadSchema>;
