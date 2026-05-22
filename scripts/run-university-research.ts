import "dotenv/config";

import { and, asc, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  countries,
  universityResearchDrafts,
  universityResearchQueue,
  universities,
  wdomsDirectoryEntries,
} from "@/lib/db/schema";
import { createSlug } from "@/lib/utils";

type QueueCandidate = {
  queueId: number;
  wdomsSchoolId: string;
  countrySlug: string;
  schoolName: string;
  cityName: string | null;
  priority: "high" | "medium" | "low";
  status: "new" | "researching" | "draft_ready" | "published" | "hold" | "rejected";
  matchedUniversityId: number | null;
  publishedUniversitySlug: string | null;
  notes: string | null;
  schoolUrl: string;
  schoolWebsite: string | null;
  schoolType: string | null;
  operationalStatus: string | null;
  yearInstructionStarted: number | null;
  academicAffiliation: string | null;
  clinicalFacilities: string | null;
  clinicalTraining: string | null;
  mainAddress: string | null;
  qualificationTitle: string | null;
  curriculumDuration: string | null;
  languageOfInstruction: string | null;
  prerequisiteEducation: string | null;
  foreignStudents: string | null;
  entranceExam: string | null;
  countryName: string;
  matchedUniversitySlug: string | null;
  matchedUniversityName: string | null;
  matchedUniversityType: string | null;
  matchedUniversityEstablishedYear: number | null;
  matchedUniversityWebsite: string | null;
};

function parseArgs(argv: string[]) {
  const options: {
    queueId?: number;
    schoolId?: string;
    countrySlug?: string;
  } = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];

    if (token === "--queue-id" && value) {
      options.queueId = Number(value);
      index += 1;
      continue;
    }

    if (token === "--school-id" && value) {
      options.schoolId = value;
      index += 1;
      continue;
    }

    if (token === "--country" && value) {
      options.countrySlug = value.toLowerCase();
      index += 1;
    }
  }

  return options;
}

function inferUniversityType(input?: string | null) {
  const value = input?.toLowerCase() ?? "";

  if (value.includes("private")) {
    return "Private";
  }

  if (
    value.includes("public") ||
    value.includes("state") ||
    value.includes("government") ||
    value.includes("national")
  ) {
    return "Public";
  }

  return undefined;
}

function getResearchSources(candidate: QueueCandidate) {
  const checkedAt = new Date().toISOString();
  const sources = [
    {
      label: `WDOMS listing for ${candidate.schoolName}`,
      url: candidate.schoolUrl,
      kind: "recognition",
      checkedAt,
      notes: "Imported from WDOMS directory entry.",
    },
  ];

  if (candidate.schoolWebsite) {
    sources.push({
      label: `${candidate.schoolName} official website`,
      url: candidate.schoolWebsite,
      kind: "official-university",
      checkedAt,
      notes: "Website URL present in WDOMS school details.",
    });
  }

  if (
    candidate.matchedUniversityWebsite &&
    candidate.matchedUniversityWebsite !== candidate.schoolWebsite
  ) {
    sources.push({
      label: `${candidate.schoolName} matched university website`,
      url: candidate.matchedUniversityWebsite,
      kind: "official-university",
      checkedAt,
      notes: "Existing website from matched published university.",
    });
  }

  return sources;
}

function buildStructuredFacts(candidate: QueueCandidate) {
  const summarySource = candidate.qualificationTitle
    ? `${candidate.schoolName} appears in WDOMS with qualification title "${candidate.qualificationTitle}".`
    : `${candidate.schoolName} appears in WDOMS as a medical school listing in ${candidate.countryName}.`;

  return {
    slug: createSlug(candidate.schoolName),
    name: candidate.schoolName,
    countrySlug: candidate.countrySlug,
    countryName: candidate.countryName,
    city: candidate.cityName ?? undefined,
    type:
      inferUniversityType(candidate.matchedUniversityType) ??
      inferUniversityType(candidate.schoolType),
    establishedYear:
      candidate.matchedUniversityEstablishedYear ??
      candidate.yearInstructionStarted ??
      undefined,
    officialWebsite:
      candidate.schoolWebsite ?? candidate.matchedUniversityWebsite ?? undefined,
    summary: summarySource,
    qualificationTitle: candidate.qualificationTitle ?? undefined,
    curriculumDuration: candidate.curriculumDuration ?? undefined,
    languageOfInstruction: candidate.languageOfInstruction ?? undefined,
    schoolType: candidate.schoolType ?? undefined,
    operationalStatus: candidate.operationalStatus ?? undefined,
    academicAffiliation: candidate.academicAffiliation ?? undefined,
    clinicalFacilities: candidate.clinicalFacilities ?? undefined,
    clinicalTraining: candidate.clinicalTraining ?? undefined,
    mainAddress: candidate.mainAddress ?? undefined,
    prerequisiteEducation: candidate.prerequisiteEducation ?? undefined,
    foreignStudents: candidate.foreignStudents ?? undefined,
    entranceExam: candidate.entranceExam ?? undefined,
    matchedUniversitySlug: candidate.matchedUniversitySlug ?? undefined,
    matchedUniversityName: candidate.matchedUniversityName ?? undefined,
    wdomsSchoolId: candidate.wdomsSchoolId,
    reviewedFrom: "wdoms_seed_draft",
  };
}

function buildDraftContent(candidate: QueueCandidate) {
  const location = candidate.cityName
    ? `${candidate.cityName}, ${candidate.countryName}`
    : candidate.countryName;
  const summary = candidate.qualificationTitle
    ? `${candidate.schoolName} is a medical institution listed in WDOMS in ${location}. The current internal draft is based on WDOMS entry details and still needs official program, fee, and admissions verification before publication.`
    : `${candidate.schoolName} is listed in WDOMS in ${location}. This internal draft needs deeper official-source verification before it can become a public university page.`;

  return {
    summary,
    campusLifestyle:
      "Pending official-source research. Do not publish until campus, student-life, and infrastructure details are verified.",
    cityProfile:
      candidate.cityName
        ? `The university is listed in ${candidate.cityName}. A proper city profile still needs to be written from verified sources.`
        : "City profile pending further research.",
    clinicalExposure:
      candidate.clinicalTraining ??
      "Clinical training information is not yet strong enough for publication. Verify hospital affiliations and clinical structure from official sources.",
    hostelOverview:
      "Hostel and accommodation details are still pending official verification.",
    indianFoodSupport:
      "Indian food availability is not yet verified.",
    safetyOverview:
      "Safety overview requires city-level and university-level research before publication.",
    studentSupport:
      candidate.foreignStudents
        ? `WDOMS notes mention foreign students: ${candidate.foreignStudents}`
        : "Student support for international students is not yet verified.",
    whyChoose: [
      candidate.schoolWebsite
        ? "Official website reference is already identified."
        : "WDOMS listing confirms the institution exists in the directory.",
      candidate.languageOfInstruction
        ? `Language note captured in WDOMS: ${candidate.languageOfInstruction}`
        : "Language pathway still needs direct program-page verification.",
    ],
    thingsToConsider: [
      "Official medicine program page still needs to be verified.",
      "Fee structure and accommodation details are not yet confirmed.",
      "No public page should be published until the source bundle is stronger.",
    ],
    faq: [
      {
        question: `Is ${candidate.schoolName} ready to publish as a university page?`,
        answer:
          "Not yet. The current record is only an internal draft created from WDOMS-linked information and still needs official-source enrichment.",
      },
    ],
  };
}

function computeQualityScore(candidate: QueueCandidate) {
  let score = 0;

  if (candidate.schoolWebsite) score += 25;
  if (candidate.qualificationTitle) score += 10;
  if (candidate.curriculumDuration) score += 10;
  if (candidate.languageOfInstruction) score += 10;
  if (candidate.clinicalTraining || candidate.clinicalFacilities) score += 15;
  if (candidate.entranceExam || candidate.prerequisiteEducation) score += 10;
  if (candidate.matchedUniversitySlug) score += 10;
  if (candidate.mainAddress) score += 5;
  if (candidate.foreignStudents) score += 5;

  return score;
}

function getNextStatus(candidate: QueueCandidate, qualityScore: number) {
  if (candidate.status === "published") {
    return "published" as const;
  }

  if (qualityScore >= 60 && candidate.schoolWebsite) {
    return "draft_ready" as const;
  }

  return "researching" as const;
}

async function getQueueCandidate(options: ReturnType<typeof parseArgs>) {
  const db = getDb();

  if (!db) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env before running this script.",
    );
  }

  const baseQuery = db
    .select({
      queueId: universityResearchQueue.id,
      wdomsSchoolId: universityResearchQueue.wdomsSchoolId,
      countrySlug: universityResearchQueue.countrySlug,
      schoolName: universityResearchQueue.schoolName,
      cityName: universityResearchQueue.cityName,
      priority: universityResearchQueue.priority,
      status: universityResearchQueue.status,
      matchedUniversityId: universityResearchQueue.matchedUniversityId,
      publishedUniversitySlug: universityResearchQueue.publishedUniversitySlug,
      notes: universityResearchQueue.notes,
      schoolUrl: wdomsDirectoryEntries.schoolUrl,
      schoolWebsite: wdomsDirectoryEntries.schoolWebsite,
      schoolType: wdomsDirectoryEntries.schoolType,
      operationalStatus: wdomsDirectoryEntries.operationalStatus,
      yearInstructionStarted: wdomsDirectoryEntries.yearInstructionStarted,
      academicAffiliation: wdomsDirectoryEntries.academicAffiliation,
      clinicalFacilities: wdomsDirectoryEntries.clinicalFacilities,
      clinicalTraining: wdomsDirectoryEntries.clinicalTraining,
      mainAddress: wdomsDirectoryEntries.mainAddress,
      qualificationTitle: wdomsDirectoryEntries.qualificationTitle,
      curriculumDuration: wdomsDirectoryEntries.curriculumDuration,
      languageOfInstruction: wdomsDirectoryEntries.languageOfInstruction,
      prerequisiteEducation: wdomsDirectoryEntries.prerequisiteEducation,
      foreignStudents: wdomsDirectoryEntries.foreignStudents,
      entranceExam: wdomsDirectoryEntries.entranceExam,
      countryName: countries.name,
      matchedUniversitySlug: universities.slug,
      matchedUniversityName: universities.name,
      matchedUniversityType: universities.type,
      matchedUniversityEstablishedYear: universities.establishedYear,
      matchedUniversityWebsite: universities.officialWebsite,
    })
    .from(universityResearchQueue)
    .innerJoin(
      wdomsDirectoryEntries,
      eq(universityResearchQueue.wdomsSchoolId, wdomsDirectoryEntries.schoolId),
    )
    .innerJoin(countries, eq(universityResearchQueue.countrySlug, countries.slug))
    .leftJoin(
      universities,
      eq(universityResearchQueue.matchedUniversityId, universities.id),
    );

  if (options.queueId) {
    const rows = await baseQuery.where(eq(universityResearchQueue.id, options.queueId));
    return rows[0] ?? null;
  }

  if (options.schoolId) {
    const rows = await baseQuery.where(
      eq(universityResearchQueue.wdomsSchoolId, options.schoolId),
    );
    return rows[0] ?? null;
  }

  const filters = [
    inArray(universityResearchQueue.status, ["new", "researching", "hold"]),
    isNull(universityResearchQueue.publishedUniversitySlug),
  ];

  if (options.countrySlug) {
    filters.push(eq(universityResearchQueue.countrySlug, options.countrySlug));
  }

  const rows = await baseQuery
    .where(and(...filters))
    .orderBy(
      asc(universityResearchQueue.priority),
      asc(universityResearchQueue.id),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env before running this script.",
    );
  }

  const options = parseArgs(process.argv.slice(2));
  const candidate = await getQueueCandidate(options);

  if (!candidate) {
    console.log("No eligible university research queue item found.");
    return;
  }

  const sourceBundle = {
    wdoms: {
      schoolId: candidate.wdomsSchoolId,
      schoolUrl: candidate.schoolUrl,
      schoolWebsite: candidate.schoolWebsite,
      schoolType: candidate.schoolType,
      operationalStatus: candidate.operationalStatus,
      yearInstructionStarted: candidate.yearInstructionStarted,
      academicAffiliation: candidate.academicAffiliation,
      clinicalFacilities: candidate.clinicalFacilities,
      clinicalTraining: candidate.clinicalTraining,
      mainAddress: candidate.mainAddress,
      qualificationTitle: candidate.qualificationTitle,
      curriculumDuration: candidate.curriculumDuration,
      languageOfInstruction: candidate.languageOfInstruction,
      prerequisiteEducation: candidate.prerequisiteEducation,
      foreignStudents: candidate.foreignStudents,
      entranceExam: candidate.entranceExam,
    },
    matchedUniversity: candidate.matchedUniversitySlug
      ? {
          slug: candidate.matchedUniversitySlug,
          name: candidate.matchedUniversityName,
          officialWebsite: candidate.matchedUniversityWebsite,
          type: candidate.matchedUniversityType,
          establishedYear: candidate.matchedUniversityEstablishedYear,
        }
      : null,
    sources: getResearchSources(candidate),
  };

  const structuredFacts = buildStructuredFacts(candidate);
  const draftContent = buildDraftContent(candidate);
  const qualityScore = computeQualityScore(candidate);
  const nextStatus = getNextStatus(candidate, qualityScore);
  const now = new Date();

  await db
    .insert(universityResearchDrafts)
    .values({
      queueId: candidate.queueId,
      wdomsSchoolId: candidate.wdomsSchoolId,
      officialWebsite:
        candidate.schoolWebsite ?? candidate.matchedUniversityWebsite ?? null,
      wdomsUrl: candidate.schoolUrl,
      sourceBundle,
      structuredFacts,
      draftContent,
      qualityScore,
      reviewNotes:
        nextStatus === "draft_ready"
          ? "Initial internal draft is strong enough for review, but still needs official program and fee research before public publishing."
          : "Initial internal draft created from WDOMS data. More official-source research is required.",
      verifiedAt: now,
    })
    .onConflictDoUpdate({
      target: universityResearchDrafts.queueId,
      set: {
        officialWebsite:
          candidate.schoolWebsite ?? candidate.matchedUniversityWebsite ?? null,
        wdomsUrl: candidate.schoolUrl,
        sourceBundle,
        structuredFacts,
        draftContent,
        qualityScore,
        reviewNotes:
          nextStatus === "draft_ready"
            ? "Initial internal draft is strong enough for review, but still needs official program and fee research before public publishing."
            : "Initial internal draft created from WDOMS data. More official-source research is required.",
        verifiedAt: now,
        updatedAt: now,
      },
    });

  await db
    .update(universityResearchQueue)
    .set({
      status: nextStatus,
      lastAttemptedAt: now,
      updatedAt: now,
      notes:
        nextStatus === "draft_ready"
          ? "Initial draft created from WDOMS and queued for deeper review."
          : "Initial WDOMS-based draft created; additional official-source research still required.",
    })
    .where(eq(universityResearchQueue.id, candidate.queueId));

  console.log(`Processed queue item #${candidate.queueId}`);
  console.log(`School: ${candidate.schoolName}`);
  console.log(`Country: ${candidate.countrySlug}`);
  console.log(`Quality score: ${qualityScore}`);
  console.log(`Queue status: ${nextStatus}`);
  console.log(
    `Draft seed sources: ${sourceBundle.sources.map((item) => item.url).join(", ")}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
