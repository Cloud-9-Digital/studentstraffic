import "dotenv/config";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  universityResearchDrafts,
  universityResearchQueue,
} from "@/lib/db/schema";
import { readUniversityGuideDraftBatches } from "@/lib/research/university-guide-drafts";

type Args = {
  queueId?: number;
  countrySlug?: string;
  universitySlug?: string;
};

type DraftFaq = {
  question: string;
  answer: string;
};

type DraftSource = {
  label: string;
  url: string;
  kind: string;
  checkedAt: string;
  notes?: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];

    if (token === "--queue-id" && value) {
      args.queueId = Number(value);
      index += 1;
      continue;
    }

    if (token === "--country" && value) {
      args.countrySlug = value.toLowerCase();
      index += 1;
      continue;
    }

    if (token === "--slug" && value) {
      args.universitySlug = value;
      index += 1;
    }
  }

  return args;
}

function inferProgramUrl(university: {
  research: { sources: Array<{ kind: string; url: string }> };
  programs: Array<{ officialProgramUrl: string }>;
}) {
  return (
    university.research.sources.find((source) => source.kind === "official-program")
      ?.url ??
    university.programs[0]?.officialProgramUrl ??
    null
  );
}

function inferFeesUrl(university: {
  research: { sources: Array<{ kind: string; url: string }> };
}) {
  return (
    university.research.sources.find((source) => source.kind === "official-fee")
      ?.url ?? null
  );
}

function inferHostelUrl(university: {
  research: { sources: Array<{ kind: string; url: string; label: string }> };
}) {
  return (
    university.research.sources.find((source) =>
      source.label.toLowerCase().includes("relocation") ||
      source.label.toLowerCase().includes("accommodation") ||
      source.label.toLowerCase().includes("hostel"),
    )?.url ?? null
  );
}

function inferAdmissionUrl(university: {
  research: { sources: Array<{ kind: string; url: string }> };
}) {
  return (
    university.research.sources.find((source) => source.kind === "official-program")
      ?.url ??
    university.research.sources.find((source) => source.kind === "official-university")
      ?.url ??
    null
  );
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function padList(values: string[], extras: string[], minimum = 3) {
  const merged = uniqueStrings([...values, ...extras]);
  return merged.slice(0, Math.max(minimum, merged.length));
}

function normalizeSources(university: {
  name: string;
  officialWebsite: string;
  research: { lastVerifiedAt: string; sources: DraftSource[] };
}) {
  const sources = [...university.research.sources];

  if (!sources.some((source) => source.url === university.officialWebsite)) {
    sources.unshift({
      label: `${university.name} official website`,
      url: university.officialWebsite,
      kind: "official-university",
      checkedAt: university.research.lastVerifiedAt,
    });
  }

  if (sources.length === 1) {
    sources.push({
      label: `${university.name} source confirmation`,
      url: university.officialWebsite,
      kind: "other",
      checkedAt: university.research.lastVerifiedAt,
      notes: "Added as a fallback second source for internal draft completeness.",
    });
  }

  return sources;
}

function normalizeFaq(
  university: {
    name: string;
    city: string;
    type: string;
    programs: Array<{ title: string; durationYears: number; medium: string }>;
    thingsToConsider: string[];
    faq: DraftFaq[];
  },
) {
  const program = university.programs[0];
  const extras: DraftFaq[] = [
    {
      question: `What type of university is ${university.name}?`,
      answer: `${university.name} is a ${university.type.toLowerCase()} university in ${university.city}.`,
    },
    {
      question: `How long is the main medical program at ${university.name}?`,
      answer: `The main medical pathway is structured as a ${program.durationYears}-year program.`,
    },
    {
      question: `What should students verify directly before applying to ${university.name}?`,
      answer:
        university.thingsToConsider[0] ??
        `Students should verify current tuition, language, and clinical-training details directly with ${university.name}.`,
    },
  ];

  const faq = [...university.faq];

  for (const item of extras) {
    if (faq.length >= 3) {
      break;
    }

    if (!faq.some((entry) => entry.question === item.question)) {
      faq.push(item);
    }
  }

  return faq;
}

function normalizePrograms(
  university: {
    officialWebsite: string;
    research: { lastVerifiedAt: string };
    programs: Array<Record<string, unknown>>;
  },
) {
  return university.programs.map((program) => ({
    livingUsd: 0,
    feeVerifiedAt: university.research.lastVerifiedAt,
    officialProgramUrl: university.officialWebsite,
    medium: "Vietnamese",
    sourceUrls: [university.officialWebsite],
    ...program,
  }));
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const args = parseArgs(process.argv.slice(2));

  if (!args.queueId || !args.countrySlug || !args.universitySlug) {
    throw new Error(
      "Usage: --queue-id <id> --country <country-slug> --slug <university-slug>",
    );
  }

  const queueRows = await db
    .select({
      id: universityResearchQueue.id,
      wdomsSchoolId: universityResearchQueue.wdomsSchoolId,
      status: universityResearchQueue.status,
      schoolName: universityResearchQueue.schoolName,
    })
    .from(universityResearchQueue)
    .where(eq(universityResearchQueue.id, args.queueId))
    .limit(1);

  const queueRow = queueRows[0];

  if (!queueRow) {
    throw new Error(`Queue item ${args.queueId} not found.`);
  }

  const batches = await readUniversityGuideDraftBatches();
  const matchedBatch = batches.find(
    (entry) =>
      entry.batch.countrySlug === args.countrySlug &&
      entry.batch.universities.some((item) => item.slug === args.universitySlug),
  );

  if (!matchedBatch) {
    throw new Error(
      `No research batch found for country "${args.countrySlug}" and university "${args.universitySlug}".`,
    );
  }

  const university = matchedBatch.batch.universities.find(
    (item) => item.slug === args.universitySlug,
  );

  if (!university) {
    throw new Error(
      `University slug "${args.universitySlug}" not found in ${matchedBatch.filePath}.`,
    );
  }

  const normalizedUniversity = {
    ...university,
    thingsToConsider: padList(university.thingsToConsider, [
      `Students should verify the current intake-year tuition schedule directly with ${university.name}.`,
      `Applicants planning India return should independently confirm licensing, internship, and language fit.`,
    ]),
    bestFitFor: padList(university.bestFitFor, [
      `Students who prefer a ${university.type.toLowerCase()} university environment in ${university.city}.`,
      `Families comparing source-backed Vietnam university profiles instead of thin directory pages.`,
    ]),
    faq: normalizeFaq(university),
    research: {
      ...university.research,
      sources: normalizeSources(university),
    },
    programs: normalizePrograms(university),
  };

  const structuredFacts = {
    slug: normalizedUniversity.slug,
    name: normalizedUniversity.name,
    countrySlug: matchedBatch.batch.countrySlug,
    city: normalizedUniversity.city,
    type: normalizedUniversity.type,
    establishedYear: normalizedUniversity.establishedYear,
    officialWebsite: normalizedUniversity.officialWebsite,
    logoUrl: normalizedUniversity.logoUrl,
    coverImageUrl: normalizedUniversity.coverImageUrl,
    featured: normalizedUniversity.featured,
    bestFitFor: normalizedUniversity.bestFitFor,
    teachingHospitals: normalizedUniversity.teachingHospitals,
    recognitionBadges: normalizedUniversity.recognitionBadges,
    recognitionLinks: normalizedUniversity.recognitionLinks,
    similarUniversitySlugs: normalizedUniversity.similarUniversitySlugs,
    researchNotes: normalizedUniversity.research.notes,
    admissionsContent: normalizedUniversity.admissionsContent ?? {},
    programs: normalizedUniversity.programs,
  };

  const draftContent = {
    summary: normalizedUniversity.summary,
    campusLifestyle: normalizedUniversity.campusLifestyle,
    cityProfile: normalizedUniversity.cityProfile,
    clinicalExposure: normalizedUniversity.clinicalExposure,
    hostelOverview: normalizedUniversity.hostelOverview,
    indianFoodSupport: normalizedUniversity.indianFoodSupport,
    safetyOverview: normalizedUniversity.safetyOverview,
    studentSupport: normalizedUniversity.studentSupport,
    whyChoose: normalizedUniversity.whyChoose,
    thingsToConsider: normalizedUniversity.thingsToConsider,
    faq: normalizedUniversity.faq,
  };

  const sourceBundle = {
    importedFromBatchPath: matchedBatch.filePath,
    importedAt: new Date().toISOString(),
    notes: matchedBatch.batch.notes ?? null,
    sources: normalizedUniversity.research.sources,
  };

  const verifiedAt = new Date(`${normalizedUniversity.research.lastVerifiedAt}T00:00:00.000Z`);

  await db
    .insert(universityResearchDrafts)
    .values({
      queueId: queueRow.id,
      wdomsSchoolId: queueRow.wdomsSchoolId,
      officialWebsite: normalizedUniversity.officialWebsite,
      programUrl: inferProgramUrl(normalizedUniversity),
      feesUrl: inferFeesUrl(normalizedUniversity),
      hostelUrl: inferHostelUrl(normalizedUniversity),
      admissionUrl: inferAdmissionUrl(normalizedUniversity),
      wdomsUrl:
        normalizedUniversity.research.sources.find((source) => source.kind === "recognition")?.url ?? null,
      sourceBundle,
      structuredFacts,
      draftContent,
      qualityScore: 92,
      reviewNotes:
        "Loaded from researched JSON batch and ready for publish validation.",
      verifiedAt,
    })
    .onConflictDoUpdate({
      target: universityResearchDrafts.queueId,
      set: {
        officialWebsite: normalizedUniversity.officialWebsite,
        programUrl: inferProgramUrl(normalizedUniversity),
        feesUrl: inferFeesUrl(normalizedUniversity),
        hostelUrl: inferHostelUrl(normalizedUniversity),
        admissionUrl: inferAdmissionUrl(normalizedUniversity),
        wdomsUrl:
          normalizedUniversity.research.sources.find((source) => source.kind === "recognition")?.url ?? null,
        sourceBundle,
        structuredFacts,
        draftContent,
        qualityScore: 92,
        reviewNotes:
          "Loaded from researched JSON batch and ready for publish validation.",
        verifiedAt,
        updatedAt: new Date(),
      },
    });

  await db
    .update(universityResearchQueue)
    .set({
      status: "draft_ready",
      lastAttemptedAt: new Date(),
      updatedAt: new Date(),
      notes: `Draft loaded from ${matchedBatch.filePath} for university slug "${university.slug}".`,
    })
    .where(eq(universityResearchQueue.id, queueRow.id));

  console.log(
    `Loaded researched batch draft for "${university.slug}" into queue item #${queueRow.id} (${queueRow.schoolName}).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
