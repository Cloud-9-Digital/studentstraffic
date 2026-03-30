import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const sourceKindSchema = z.enum([
  "official-university",
  "official-program",
  "official-fee",
  "government",
  "recognition",
  "other",
]);

export const researchSourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  kind: sourceKindSchema,
  checkedAt: isoDateSchema,
  notes: z.string().min(1).optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const linkItemSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const galleryImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export const teachingPhaseSchema = z.object({
  phase: z.string().min(1),
  language: z.string().min(1),
  details: z.string().min(1),
});

export const yearlyCostBreakdownSchema = z.object({
  yearLabel: z.string().min(1),
  tuitionUsd: z.number().int().nonnegative(),
  hostelUsd: z.number().int().nonnegative(),
  livingUsd: z.number().int().nonnegative(),
  totalUsd: z.number().int().nonnegative(),
  notes: z.string().min(1).optional(),
});

export const programDraftSchema = z.object({
  slug: z.string().min(1),
  courseSlug: z.string().min(1),
  title: z.string().min(1),
  durationYears: z.number().int().positive(),
  officialFeeCurrency: z.string().min(1),
  officialAnnualTuitionAmount: z.number().int().nonnegative(),
  officialTotalTuitionAmount: z.number().int().nonnegative().optional(),
  annualTuitionUsd: z.number().int().nonnegative(),
  totalTuitionUsd: z.number().int().nonnegative(),
  livingUsd: z.number().int().nonnegative(),
  officialProgramUrl: z.string().url(),
  medium: z.enum(["English", "English + Local Support", "Vietnamese"]),
  teachingPhases: z.array(teachingPhaseSchema).default([]),
  yearlyCostBreakdown: z.array(yearlyCostBreakdownSchema).default([]),
  licenseExamSupport: z.array(z.string().min(1)).default([]),
  intakeMonths: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  feeVerifiedAt: isoDateSchema,
  fxRateDate: isoDateSchema.optional(),
  fxRateSourceUrl: z.string().url().optional(),
  feeNotes: z.string().min(1).optional(),
  sourceUrls: z.array(z.string().url()).min(1),
});

export const universityDraftSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  type: z.enum(["Public", "Private"]),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  galleryImages: z.array(galleryImageSchema).default([]),
  establishedYear: z.number().int().positive(),
  summary: z.string().min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  officialWebsite: z.string().url(),
  campusLifestyle: z.string().min(1),
  cityProfile: z.string().min(1),
  clinicalExposure: z.string().min(1),
  hostelOverview: z.string().min(1),
  indianFoodSupport: z.string().min(1),
  safetyOverview: z.string().min(1),
  studentSupport: z.string().min(1),
  whyChoose: z.array(z.string().min(1)).min(3),
  thingsToConsider: z.array(z.string().min(1)).min(3),
  bestFitFor: z.array(z.string().min(1)).min(3),
  teachingHospitals: z.array(z.string().min(1)).default([]),
  recognitionBadges: z.array(z.string().min(1)).default([]),
  recognitionLinks: z.array(linkItemSchema).default([]),
  faq: z.array(faqSchema).min(3),
  similarUniversitySlugs: z.array(z.string().min(1)).default([]),
  research: z.object({
    lastVerifiedAt: isoDateSchema,
    sources: z.array(researchSourceSchema).min(2),
    notes: z.string().min(1).optional(),
  }),
  programs: z.array(programDraftSchema).min(1),
});

export const universityGuideDraftBatchSchema = z.object({
  batchId: z.string().min(1),
  countrySlug: z.string().min(1),
  universities: z.array(universityDraftSchema).min(1),
  notes: z.string().min(1).optional(),
});

export type ResearchSource = z.infer<typeof researchSourceSchema>;
export type ProgramDraft = z.infer<typeof programDraftSchema>;
export type UniversityDraft = z.infer<typeof universityDraftSchema>;
export type UniversityGuideDraftBatch = z.infer<
  typeof universityGuideDraftBatchSchema
>;

async function collectDraftFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectDraftFiles(entryPath);
      }

      if (!entry.isFile()) {
        return [] as string[];
      }

      if (!entry.name.endsWith(".json") || entry.name.endsWith(".example.json")) {
        return [] as string[];
      }

      return [entryPath];
    }),
  );

  return files.flat().sort((left, right) => left.localeCompare(right));
}

export async function readUniversityGuideDraftBatches(
  baseDir = path.join(process.cwd(), "research", "university-guides"),
) {
  const files = await collectDraftFiles(baseDir);

  const batches = await Promise.all(
    files.map(async (filePath) => {
      const raw = await readFile(filePath, "utf8");
      const json = JSON.parse(raw) as unknown;

      return {
        filePath,
        batch: universityGuideDraftBatchSchema.parse(json),
      };
    }),
  );

  return batches;
}
