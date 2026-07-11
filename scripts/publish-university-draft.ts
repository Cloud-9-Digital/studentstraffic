import "dotenv/config";

import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  courses,
  programOfferings,
  universities,
  universityResearchDrafts,
  universityResearchQueue,
} from "@/lib/db/schema";
import { env } from "@/lib/env";
import { syncTypesenseSearchIndex } from "@/lib/search/admin";
import { createSlug } from "@/lib/utils";
import { triggerRevalidate } from "./lib/trigger-revalidate";

type DraftRecord = {
  draftId: number;
  queueId: number;
  discoveryKey: string;
  officialWebsite: string | null;
  sourceBundle: Record<string, unknown>;
  structuredFacts: Record<string, unknown>;
  draftContent: Record<string, unknown>;
  qualityScore: number | null;
  reviewNotes: string | null;
  verifiedAt: Date | null;
  countrySlug: string;
  schoolName: string;
  cityName: string | null;
  priority: "high" | "medium" | "low";
  status: "new" | "researching" | "draft_ready" | "published" | "hold" | "rejected";
};

type PublishArgs = {
  queueId?: number;
  draftId?: number;
};

type SourceLike = {
  label?: string;
  url?: string;
  kind?:
    | "official-university"
    | "official-program"
    | "official-fee"
    | "government"
    | "recognition"
    | "other";
  checkedAt?: string;
  notes?: string;
};

type ProgramLike = {
  slug?: string;
  courseSlug?: string;
  title?: string;
  durationYears?: number;
  annualTuitionUsd?: number;
  totalTuitionUsd?: number;
  livingUsd?: number;
  officialFeeCurrency?: string;
  officialAnnualTuitionAmount?: number;
  officialTotalTuitionAmount?: number;
  officialProgramUrl?: string;
  medium?: string;
  teachingPhases?: Array<{ phase: string; language: string; details: string }>;
  yearlyCostBreakdown?: Array<{
    yearLabel: string;
    tuitionUsd: number;
    hostelUsd: number;
    livingUsd: number;
    totalUsd: number;
    notes?: string;
  }>;
  licenseExamSupport?: string[];
  intakeMonths?: string[];
  feeVerifiedAt?: string;
  fxRateDate?: string;
  fxRateSourceUrl?: string;
  feeNotes?: string;
  sourceUrls?: string[];
  featured?: boolean;
};

function parseArgs(argv: string[]): PublishArgs {
  const args: PublishArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];

    if (token === "--queue-id" && value) {
      args.queueId = Number(value);
      index += 1;
      continue;
    }

    if (token === "--draft-id" && value) {
      args.draftId = Number(value);
      index += 1;
    }
  }

  return args;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    : [];
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asFaqArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = asRecord(item);
      const question = asString(record.question);
      const answer = asString(record.answer);

      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter(Boolean) as Array<{ question: string; answer: string }>;
}

function asLinkItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = asRecord(item);
      const label = asString(record.label);
      const url = asString(record.url);

      if (!label || !url) {
        return null;
      }

      return { label, url };
    })
    .filter(Boolean) as Array<{ label: string; url: string }>;
}

function asResearchSources(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = asRecord(item) as SourceLike;
      const label = asString(record.label);
      const url = asString(record.url);
      const kind = asString(record.kind);
      const checkedAt = asString(record.checkedAt);

      if (!label || !url || !kind || !checkedAt) {
        return null;
      }

      return {
        label,
        url,
        kind: kind as NonNullable<SourceLike["kind"]>,
        checkedAt,
        notes: asString(record.notes) ?? undefined,
      };
    })
    .filter(Boolean);
}

function inferUniversityType(input?: string | null) {
  const value = input?.toLowerCase() ?? "";

  if (value.includes("private")) {
    return "Private" as const;
  }

  if (
    value.includes("public") ||
    value.includes("state") ||
    value.includes("government") ||
    value.includes("national")
  ) {
    return "Public" as const;
  }

  return null;
}

function inferCourseSlug(program: ProgramLike, summary?: string | null) {
  const direct = asString(program.courseSlug);
  if (direct) {
    return direct;
  }

  const title = `${asString(program.title) ?? ""} ${summary ?? ""}`.toLowerCase();

  if (
    title.includes("mbbs") ||
    title.includes("general medicine") ||
    title.includes("medicine") ||
    title.includes("doctor of medicine") ||
    title.includes("md")
  ) {
    return "mbbs";
  }

  return null;
}

function findWeakContentMarkers(value: string) {
  const patterns = [
    /pending official-source research/i,
    /not yet verified/i,
    /internal draft/i,
    /needs official(?:\s+(?:source|confirmation|verification))?/i,
    /still needs/i,
    /before publication/i,
    /do not publish(?:\s+(?:yet|until|this|without|before))/i,
  ] as const;

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[0]) {
      return match[0].toLowerCase();
    }
  }

  return null;
}

function validateDraft(record: DraftRecord) {
  const structuredFacts = asRecord(record.structuredFacts);
  const draftContent = asRecord(record.draftContent);
  const sourceBundle = asRecord(record.sourceBundle);
  const sourceBundleSources = asResearchSources(sourceBundle.sources);
  const programs = Array.isArray(structuredFacts.programs)
    ? (structuredFacts.programs as ProgramLike[])
    : [];
  const issues: string[] = [];

  const officialWebsite =
    asString(record.officialWebsite) ?? asString(structuredFacts.officialWebsite);
  const name = asString(structuredFacts.name) ?? record.schoolName;
  const city = asString(structuredFacts.city) ?? record.cityName;
  const universityType =
    inferUniversityType(asString(structuredFacts.type)) ??
    inferUniversityType(asString(structuredFacts.schoolType));
  const establishedYear = asNumber(structuredFacts.establishedYear);

  if (record.status === "published") {
    issues.push("Queue item is already marked as published.");
  }

  if (!officialWebsite) {
    issues.push("Official website is missing.");
  }

  if (!name) {
    issues.push("University name is missing.");
  }

  if (!city) {
    issues.push("City is missing.");
  }

  if (!universityType) {
    issues.push("University type is missing or unclear.");
  }

  if (!establishedYear) {
    issues.push("Established year is missing.");
  }

  if (sourceBundleSources.length < 2) {
    issues.push("At least two research sources are required.");
  }

  const requiredContentFields = [
    "summary",
    "campusLifestyle",
    "cityProfile",
    "clinicalExposure",
    "hostelOverview",
    "indianFoodSupport",
    "safetyOverview",
    "studentSupport",
  ] as const;

  for (const field of requiredContentFields) {
    const value = asString(draftContent[field]);
    if (!value) {
      issues.push(`Draft content field "${field}" is missing.`);
      continue;
    }

    const weakMarker = findWeakContentMarkers(value);
    if (weakMarker) {
      issues.push(`Draft content field "${field}" still contains weak draft marker "${weakMarker}".`);
    }
  }

  // `summary` renders as the hero paragraph — above the fold, the one field every visitor
  // actually reads regardless of scroll depth. Content passes tend to under-serve it relative to
  // the other narrative fields (see docs/university-content-spec.md, audited 2026-07-09: a batch
  // of "expanded" universities still averaged only ~970 characters here vs. a ~2,000-2,800
  // character / 300-450 word target). Gate at 1,500 chars — below the target but well above what
  // slips through unnoticed otherwise — to force a second pass on genuinely thin summaries without
  // being so strict it blocks every draft outright.
  const summaryValue = asString(draftContent.summary);
  if (summaryValue && summaryValue.length < 1500) {
    issues.push(
      `Draft content field "summary" is only ${summaryValue.length} characters — this is the hero paragraph and needs ~2,000-2,800 characters (300-450 words) per docs/university-content-spec.md, not parity with the other narrative fields.`,
    );
  }

  const whyChoose = asStringArray(draftContent.whyChoose);
  const thingsToConsider = asStringArray(draftContent.thingsToConsider);
  const bestFitFor = asStringArray(structuredFacts.bestFitFor);
  const faq = asFaqArray(draftContent.faq);

  if (whyChoose.length < 3) {
    issues.push("At least 3 'why choose' points are required.");
  }

  if (thingsToConsider.length < 3) {
    issues.push("At least 3 'things to consider' points are required.");
  }

  if (bestFitFor.length < 3) {
    issues.push("At least 3 'best fit for' points are required in structured facts.");
  }

  if (faq.length < 3) {
    issues.push("At least 3 FAQs are required.");
  }

  if (programs.length < 1) {
    issues.push("At least one program is required in structured facts before publishing.");
  }

  for (const [index, program] of programs.entries()) {
    const courseSlug = inferCourseSlug(program, asString(draftContent.summary));
    const title = asString(program.title);
    const officialProgramUrl = asString(program.officialProgramUrl);
    const medium = asString(program.medium);
    const durationYears = asNumber(program.durationYears);

    if (!courseSlug) {
      issues.push(`Program ${index + 1} is missing a recognizable course slug.`);
    }

    if (!title) {
      issues.push(`Program ${index + 1} is missing a title.`);
    }

    if (!officialProgramUrl) {
      issues.push(`Program ${index + 1} is missing an official program URL.`);
    }

    if (!medium) {
      issues.push(`Program ${index + 1} is missing medium of instruction.`);
    }

    if (!durationYears) {
      issues.push(`Program ${index + 1} is missing duration years.`);
    }
  }

  return {
    issues,
    officialWebsite,
    name,
    city,
    universityType,
    establishedYear,
    sourceBundleSources,
    draftContent,
    structuredFacts,
    programs,
    whyChoose,
    thingsToConsider,
    bestFitFor,
    faq,
  };
}

async function getDraftRecord(args: PublishArgs): Promise<DraftRecord | null> {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const baseQuery = db
    .select({
      draftId: universityResearchDrafts.id,
      queueId: universityResearchQueue.id,
      discoveryKey: universityResearchDrafts.discoveryKey,
      officialWebsite: universityResearchDrafts.officialWebsite,
      sourceBundle: universityResearchDrafts.sourceBundle,
      structuredFacts: universityResearchDrafts.structuredFacts,
      draftContent: universityResearchDrafts.draftContent,
      qualityScore: universityResearchDrafts.qualityScore,
      reviewNotes: universityResearchDrafts.reviewNotes,
      verifiedAt: universityResearchDrafts.verifiedAt,
      countrySlug: universityResearchQueue.countrySlug,
      schoolName: universityResearchQueue.schoolName,
      cityName: universityResearchQueue.cityName,
      priority: universityResearchQueue.priority,
      status: universityResearchQueue.status,
    })
    .from(universityResearchDrafts)
    .innerJoin(
      universityResearchQueue,
      eq(universityResearchDrafts.queueId, universityResearchQueue.id),
    );

  if (args.draftId) {
    const rows = await baseQuery.where(eq(universityResearchDrafts.id, args.draftId));
    return rows[0] ?? null;
  }

  if (args.queueId) {
    const rows = await baseQuery.where(eq(universityResearchQueue.id, args.queueId));
    return rows[0] ?? null;
  }

  return null;
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const args = parseArgs(process.argv.slice(2));

  if (!args.queueId && !args.draftId) {
    throw new Error("Pass either --queue-id <id> or --draft-id <id>.");
  }

  const record = await getDraftRecord(args);

  if (!record) {
    throw new Error("No matching university research draft was found.");
  }

  const validation = validateDraft(record);

  if (validation.issues.length > 0) {
    throw new Error(
      `Draft is not publishable:\n- ${validation.issues.join("\n- ")}`,
    );
  }

  const [countryRow, courseRows] = await Promise.all([
    db
      .select({ id: countries.id })
      .from(countries)
      .where(eq(countries.slug, record.countrySlug))
      .limit(1),
    db.select({ id: courses.id, slug: courses.slug }).from(courses),
  ]);

  const countryId = countryRow[0]?.id;

  if (!countryId) {
    throw new Error(`Country "${record.countrySlug}" does not exist in countries table.`);
  }

  const courseIdBySlug = new Map(courseRows.map((row) => [row.slug, row.id]));
  const now = new Date();
  const structuredFacts = validation.structuredFacts;
  const draftContent = validation.draftContent;
  const slug =
    asString(structuredFacts.slug) ?? createSlug(validation.name ?? record.schoolName);
  const lastVerifiedAt =
    record.verifiedAt?.toISOString().slice(0, 10) ?? now.toISOString().slice(0, 10);
  const recognitionLinks = asLinkItems(structuredFacts.recognitionLinks);
  const recognitionBadges = asStringArray(structuredFacts.recognitionBadges);
  const teachingHospitals = asStringArray(structuredFacts.teachingHospitals);
  const researchNotes =
    asString(structuredFacts.researchNotes) ??
    asString(record.reviewNotes) ??
    "Published from internal research draft workflow.";
  const incomingLogoUrl = asString(structuredFacts.logoUrl);
  const incomingCoverImageUrl = asString(structuredFacts.coverImageUrl);
  const existingRows = await db
    .select({
      logoUrl: universities.logoUrl,
      coverImageUrl: universities.coverImageUrl,
    })
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);
  const existingUniversity = existingRows[0];

  const [savedUniversity] = await db
    .insert(universities)
    .values({
      countryId,
      slug,
      name: validation.name,
      city: validation.city,
      type: validation.universityType!,
      establishedYear: validation.establishedYear!,
      summary: asString(draftContent.summary)!,
      featured: asBoolean(structuredFacts.featured),
      published: true,
      officialWebsite: validation.officialWebsite!,
      logoUrl: incomingLogoUrl ?? existingUniversity?.logoUrl ?? null,
      coverImageUrl:
        incomingCoverImageUrl ?? existingUniversity?.coverImageUrl ?? null,
      campusLifestyle: asString(draftContent.campusLifestyle)!,
      cityProfile: asString(draftContent.cityProfile)!,
      practicalExposure: asString(draftContent.clinicalExposure)!,
      hostelOverview: asString(draftContent.hostelOverview)!,
      dietarySupport: asString(draftContent.indianFoodSupport)!,
      safetyOverview: asString(draftContent.safetyOverview)!,
      studentSupport: asString(draftContent.studentSupport)!,
      whyChoose: validation.whyChoose,
      thingsToConsider: validation.thingsToConsider,
      bestFitFor: validation.bestFitFor,
      industryPartners: teachingHospitals,
      recognitionBadges,
      recognitionLinks,
      faq: validation.faq,
      similarUniversitySlugs: asStringArray(structuredFacts.similarUniversitySlugs),
      lastVerifiedAt,
      researchSources: validation.sourceBundleSources,
      researchNotes,
      admissionsContent: asRecord(structuredFacts.admissionsContent),
    })
    .onConflictDoUpdate({
      target: universities.slug,
      set: {
        countryId,
        name: validation.name,
        city: validation.city,
        type: validation.universityType!,
        establishedYear: validation.establishedYear!,
        summary: asString(draftContent.summary)!,
        featured: asBoolean(structuredFacts.featured),
        published: true,
        officialWebsite: validation.officialWebsite!,
        logoUrl: incomingLogoUrl ?? existingUniversity?.logoUrl ?? null,
        coverImageUrl:
          incomingCoverImageUrl ?? existingUniversity?.coverImageUrl ?? null,
        campusLifestyle: asString(draftContent.campusLifestyle)!,
        cityProfile: asString(draftContent.cityProfile)!,
        practicalExposure: asString(draftContent.clinicalExposure)!,
        hostelOverview: asString(draftContent.hostelOverview)!,
        dietarySupport: asString(draftContent.indianFoodSupport)!,
        safetyOverview: asString(draftContent.safetyOverview)!,
        studentSupport: asString(draftContent.studentSupport)!,
        whyChoose: validation.whyChoose,
        thingsToConsider: validation.thingsToConsider,
        bestFitFor: validation.bestFitFor,
        industryPartners: teachingHospitals,
        recognitionBadges,
        recognitionLinks,
        faq: validation.faq,
        similarUniversitySlugs: asStringArray(structuredFacts.similarUniversitySlugs),
        lastVerifiedAt,
        researchSources: validation.sourceBundleSources,
        researchNotes,
        admissionsContent: asRecord(structuredFacts.admissionsContent),
        updatedAt: now,
      },
    })
    .returning({ id: universities.id, slug: universities.slug });

  if (!savedUniversity) {
    throw new Error("Failed to save university row.");
  }

  let publishedPrograms = 0;

  for (const rawProgram of validation.programs) {
    const courseSlug = inferCourseSlug(rawProgram, asString(draftContent.summary));

    if (!courseSlug) {
      throw new Error(`Unable to infer course slug for program "${rawProgram.title ?? "unknown"}".`);
    }

    const courseId = courseIdBySlug.get(courseSlug);

    if (!courseId) {
      throw new Error(`Course slug "${courseSlug}" does not exist in courses table.`);
    }

    const programTitle = asString(rawProgram.title)!;
    const programSlug =
      asString(rawProgram.slug) ??
      createSlug(`${courseSlug}-in-${savedUniversity.slug}`);
    const sourceUrls = asStringArray(rawProgram.sourceUrls);
    const officialProgramUrl =
      asString(rawProgram.officialProgramUrl) ?? validation.officialWebsite!;

    if (sourceUrls.length === 0) {
      sourceUrls.push(officialProgramUrl);
    }

    const existingProgramRows = await db
      .select({
        id: programOfferings.id,
        slug: programOfferings.slug,
      })
      .from(programOfferings)
      .where(
        and(
          eq(programOfferings.universityId, savedUniversity.id),
          eq(programOfferings.courseId, courseId),
        ),
      )
      .orderBy(programOfferings.id);

    const reusableProgram =
      existingProgramRows.find((row) => row.slug === programSlug) ??
      existingProgramRows[0] ??
      null;

    const programPayload = {
      universityId: savedUniversity.id,
      courseId,
      slug: programSlug,
      title: programTitle,
      durationYears: asNumber(rawProgram.durationYears) ?? 6,
      annualTuitionUsd: asNumber(rawProgram.annualTuitionUsd) ?? 0,
      totalTuitionUsd: asNumber(rawProgram.totalTuitionUsd) ?? 0,
      livingUsd: asNumber(rawProgram.livingUsd) ?? 0,
      officialFeeCurrency: asString(rawProgram.officialFeeCurrency) ?? null,
      officialAnnualTuitionAmount: asNumber(rawProgram.officialAnnualTuitionAmount),
      officialTotalTuitionAmount: asNumber(rawProgram.officialTotalTuitionAmount),
      officialProgramUrl,
      medium: asString(rawProgram.medium) ?? "English",
      published: true,
      teachingPhases: Array.isArray(rawProgram.teachingPhases)
        ? rawProgram.teachingPhases
        : [],
      yearlyCostBreakdown: Array.isArray(rawProgram.yearlyCostBreakdown)
        ? rawProgram.yearlyCostBreakdown
        : [],
      professionalExamSupport: asStringArray(rawProgram.licenseExamSupport),
      intakeMonths: asStringArray(rawProgram.intakeMonths),
      feeVerifiedAt: asString(rawProgram.feeVerifiedAt) ?? lastVerifiedAt,
      fxRateDate: asString(rawProgram.fxRateDate) ?? null,
      fxRateSourceUrl: asString(rawProgram.fxRateSourceUrl) ?? null,
      feeNotes: asString(rawProgram.feeNotes) ?? null,
      sourceUrls,
      featured: asBoolean(rawProgram.featured),
      updatedAt: now,
    };

    if (reusableProgram) {
      await db
        .update(programOfferings)
        .set(programPayload)
        .where(eq(programOfferings.id, reusableProgram.id));
    } else {
      await db
        .insert(programOfferings)
        .values({
          ...programPayload,
          createdAt: now,
        })
        .onConflictDoUpdate({
          target: programOfferings.slug,
          set: programPayload,
        });
    }

    const duplicateProgramIds = existingProgramRows
      .filter((row) => row.id !== reusableProgram?.id)
      .map((row) => row.id);

    if (duplicateProgramIds.length > 0) {
      await db
        .update(programOfferings)
        .set({
          published: false,
          updatedAt: now,
        })
        .where(inArray(programOfferings.id, duplicateProgramIds));
    }

    publishedPrograms += 1;
  }

  await db
    .update(universityResearchQueue)
    .set({
      status: "published",
      matchedUniversityId: savedUniversity.id,
      publishedUniversitySlug: savedUniversity.slug,
      lastAttemptedAt: now,
      updatedAt: now,
      notes: `Published to /universities/${savedUniversity.slug} from research draft ${record.draftId}.`,
    })
    .where(eq(universityResearchQueue.id, record.queueId));

  console.log(`Published university: ${savedUniversity.slug}`);
  console.log(`Programs published: ${publishedPrograms}`);
  console.log(`Queue item updated: ${record.queueId}`);

  if (env.hasTypesenseAdmin) {
    const result = await syncTypesenseSearchIndex();
    console.log(`Typesense search sync complete. Indexed ${result.imported} documents.`);
  } else {
    console.warn("Skipping Typesense sync: TYPESENSE_HOST/TYPESENSE_API_KEY are not configured.");
  }

  await triggerRevalidate(["catalog", "universities", "program-offerings"]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
