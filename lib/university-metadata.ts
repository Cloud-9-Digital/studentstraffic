import type { CourseStream } from "@/lib/data/types";
import type { UniversitySection, ProgramSection } from "@/lib/university-sections";
import { formatProgramAnnualFee, hasRenderableProgramFee } from "@/lib/utils";

/**
 * Pure builders for university / section / programme page metadata.
 *
 * Kept free of `next` and database imports so every template can share one
 * implementation and the rules stay unit-testable (see
 * tests/university-metadata.test.ts).
 *
 * Budgets: `buildIndexableMetadata` hands the title to the root layout
 * template, which appends " | Students Traffic" (19 characters). Google
 * truncates the rendered SERP title at roughly 60-65 characters, so the
 * page-owned part of the title is budgeted to 60 characters and each builder
 * degrades to a shorter suffix instead of overflowing. Descriptions are
 * budgeted to 155 characters, the point where the SERP snippet is cut.
 */
export const TITLE_MAX_CHARS = 60;
export const DESCRIPTION_MAX_CHARS = 155;

type FeeFields = Parameters<typeof hasRenderableProgramFee>[0];

/** Structural subset of `FinderProgram` the metadata builders actually read. */
export type MetadataProgram = {
  offering: FeeFields & { slug: string; featured?: boolean };
  course: {
    shortName: string;
    stream: CourseStream;
    level?: string;
  };
};

export type MetadataUniversity = {
  name: string;
  city: string;
  faq?: { question: string; answer: string }[];
  recognitionBadges?: string[];
};

export type MetadataCountry = { name: string } | null | undefined;

export type BuiltMetadata = {
  title: string;
  description: string;
  keywords: string[];
};

/**
 * Stream vocabulary. `label` is prose used inside descriptions, `keywordNoun`
 * is the "<city> <noun>" search phrase that replaced the previously hardcoded
 * "<city> medical university" (wrong on every non-medical university).
 */
const STREAM_VOCABULARY: Record<CourseStream, { label: string; keywordNoun: string }> = {
  medicine: { label: "medicine", keywordNoun: "medical university" },
  nursing: { label: "nursing", keywordNoun: "nursing college" },
  dental: { label: "dentistry", keywordNoun: "dental college" },
  pharmacy: { label: "pharmacy", keywordNoun: "pharmacy college" },
  physiotherapy: { label: "physiotherapy", keywordNoun: "physiotherapy college" },
  engineering: { label: "engineering", keywordNoun: "engineering college" },
  business: { label: "business", keywordNoun: "business school" },
  law: { label: "law", keywordNoun: "law school" },
  hospitality: { label: "hospitality", keywordNoun: "hospitality school" },
  agriculture: { label: "agriculture", keywordNoun: "agriculture college" },
  education: { label: "education", keywordNoun: "teacher training college" },
  architecture: { label: "architecture", keywordNoun: "architecture school" },
  "arts-humanities": { label: "arts and humanities", keywordNoun: "arts college" },
  "social-sciences": { label: "social sciences", keywordNoun: "university" },
  "natural-sciences": { label: "sciences", keywordNoun: "science university" },
  "mathematics-statistics": { label: "mathematics", keywordNoun: "university" },
  "economics-commerce": { label: "commerce and economics", keywordNoun: "commerce college" },
  "design-creative-arts": { label: "design", keywordNoun: "design school" },
  psychology: { label: "psychology", keywordNoun: "university" },
  "public-health-allied-health": {
    label: "public health",
    keywordNoun: "health sciences university",
  },
  "media-communication": { label: "media and communication", keywordNoun: "university" },
  "environment-sustainability": {
    label: "environmental studies",
    keywordNoun: "university",
  },
  "aviation-maritime-logistics": {
    label: "aviation and logistics",
    keywordNoun: "university",
  },
  "public-policy-international-relations": {
    label: "public policy",
    keywordNoun: "university",
  },
  "computing-information-systems": { label: "computing", keywordNoun: "computing college" },
  veterinary: { label: "veterinary science", keywordNoun: "veterinary college" },
  vocational: { label: "vocational studies", keywordNoun: "college" },
  other: { label: "study programmes", keywordNoun: "university" },
};

/**
 * Tie-break order when two streams have the same number of offerings. Ordered
 * by Indian-outbound search demand, so a two-programme medicine + engineering
 * university resolves to medicine rather than to whichever row sorted first.
 */
const STREAM_PRIORITY: CourseStream[] = [
  "medicine",
  "engineering",
  "business",
  "dental",
  "nursing",
  "computing-information-systems",
  "pharmacy",
  "law",
  "economics-commerce",
  "natural-sciences",
];

const LEVEL_RANK: Record<string, number> = {
  bachelors: 0,
  bachelor: 0,
  undergraduate: 0,
  masters: 1,
  master: 1,
  postgraduate: 1,
  doctorate: 2,
  phd: 2,
};

function streamVocabulary(stream: CourseStream | undefined) {
  return (stream && STREAM_VOCABULARY[stream]) || STREAM_VOCABULARY.other;
}

function levelRank(level: string | undefined) {
  if (!level) return 3;
  return LEVEL_RANK[level.toLowerCase()] ?? 3;
}

function streamRank(stream: CourseStream) {
  const index = STREAM_PRIORITY.indexOf(stream);
  return index === -1 ? STREAM_PRIORITY.length : index;
}

function normalizeSpace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

/** Word-boundary truncation used only when an entity alone busts the budget. */
export function truncateToWordBoundary(value: string, max: number) {
  const clean = normalizeSpace(value);
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const kept = lastSpace > Math.floor(max * 0.5) ? slice.slice(0, lastSpace) : slice;
  return `${kept.replace(/[\s,:;–—-]+$/u, "")}…`;
}

/**
 * Picks the longest `entity + suffix` combination that fits the title budget,
 * so short university names keep the year and the richest keyword set while
 * long official names degrade gracefully instead of being cut mid-word.
 */
export function fitTitle(
  entity: string,
  suffixes: readonly (string | undefined)[],
  options: { separator?: string; max?: number } = {},
) {
  const { separator = " — ", max = TITLE_MAX_CHARS } = options;
  const base = normalizeSpace(entity);

  for (const suffix of suffixes) {
    if (!suffix) continue;
    const candidate = `${base}${separator}${suffix}`;
    if (candidate.length <= max) return candidate;
  }

  return truncateToWordBoundary(base, max);
}

/**
 * Joins description clauses while they fit the snippet budget. Each entry may
 * be a list of alternatives ordered longest-first; the first one that still
 * fits wins, and an entry that cannot fit at all is dropped rather than
 * padded — never fabricate to hit a character count.
 */
export function composeDescription(
  clauses: readonly (string | undefined | readonly (string | undefined)[])[],
  max = DESCRIPTION_MAX_CHARS,
) {
  let out = "";

  for (const clause of clauses) {
    const alternatives = Array.isArray(clause) ? clause : [clause as string | undefined];
    for (const alternative of alternatives) {
      if (!alternative) continue;
      const text = normalizeSpace(alternative);
      const candidate = out ? `${out} ${text}` : text;
      if (candidate.length <= max) {
        out = candidate;
        break;
      }
      if (!out) {
        // The lead clause must always survive, even if it needs trimming.
        out = truncateToWordBoundary(text, max);
        break;
      }
    }
  }

  return out;
}

export type UniversityStreamProfile = {
  programCount: number;
  distinctStreamCount: number;
  dominantStream: CourseStream | null;
  /** Prose list of the most-offered streams, e.g. "engineering, business". */
  streamPhrase: string;
  /** Search noun for "<city> <noun>" keywords. */
  keywordNoun: string;
  isSingleStream: boolean;
};

function pluraliseProgrammes(count: number) {
  return count === 1 ? "1 programme" : `${count} programmes`;
}

function joinWithAnd(parts: string[]) {
  if (parts.length <= 1) return parts[0] ?? "";
  // Some stream labels already contain "and" ("commerce and economics"); a
  // second conjunction reads badly, so those lists stay comma-separated.
  if (parts.some((part) => part.includes(" and "))) return parts.join(", ");
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

export function summariseUniversityStreams(
  programs: readonly MetadataProgram[],
): UniversityStreamProfile {
  const counts = new Map<CourseStream, number>();
  for (const program of programs) {
    const stream = program.course.stream;
    counts.set(stream, (counts.get(stream) ?? 0) + 1);
  }

  const ordered = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    const rank = streamRank(a[0]) - streamRank(b[0]);
    if (rank !== 0) return rank;
    return a[0].localeCompare(b[0]);
  });

  const dominantStream = ordered[0]?.[0] ?? null;
  const labels = ordered.slice(0, 3).map(([stream]) => streamVocabulary(stream).label);

  return {
    programCount: programs.length,
    distinctStreamCount: ordered.length,
    dominantStream,
    streamPhrase: joinWithAnd(labels),
    // A genuinely broad university is not a "<city> arts college"; only claim
    // a stream noun when the catalogue is actually concentrated.
    keywordNoun:
      dominantStream && ordered.length < 4
        ? streamVocabulary(dominantStream).keywordNoun
        : STREAM_VOCABULARY.other.keywordNoun,
    isSingleStream: ordered.length <= 1,
  };
}

/**
 * Deterministic flagship programme selection, replacing the previous
 * `programs.find(featured) ?? programs[0]` — which made "B.Com" the headline
 * course of an engineering university purely because of slug ordering.
 *
 * Order of preference:
 *   1. offerings explicitly flagged `featured`
 *   2. offerings in the university's dominant stream (most offerings; ties
 *      broken by STREAM_PRIORITY, then stream name)
 *   3. the lowest study level (bachelor's before master's before doctorate)
 *   4. stable tie-break on course short name, then offering slug
 */
export function selectFlagshipProgram<T extends MetadataProgram>(
  programs: readonly T[],
): T | undefined {
  if (programs.length === 0) return undefined;

  const featured = programs.filter((program) => program.offering.featured);
  const pool = featured.length > 0 ? featured : programs;
  const { dominantStream } = summariseUniversityStreams(programs);

  return [...pool].sort((a, b) => {
    const aDominant = a.course.stream === dominantStream ? 0 : 1;
    const bDominant = b.course.stream === dominantStream ? 0 : 1;
    if (aDominant !== bDominant) return aDominant - bDominant;

    const streamDelta = streamRank(a.course.stream) - streamRank(b.course.stream);
    if (streamDelta !== 0) return streamDelta;

    const levelDelta = levelRank(a.course.level) - levelRank(b.course.level);
    if (levelDelta !== 0) return levelDelta;

    const nameDelta = a.course.shortName.localeCompare(b.course.shortName);
    if (nameDelta !== 0) return nameDelta;

    return a.offering.slug.localeCompare(b.offering.slug);
  })[0];
}

function locationLabel(university: MetadataUniversity, country: MetadataCountry) {
  return country ? `${university.city}, ${country.name}` : university.city;
}

/** Sort key for "tuition from" phrasing; renderable offerings only. */
function comparableAnnualFee(program: MetadataProgram) {
  const offering = program.offering as {
    annualTuitionUsd?: number;
    indicativeAnnualTuitionMinUsd?: number;
    officialAnnualTuitionAmount?: number;
  };
  return (
    offering.annualTuitionUsd ||
    offering.indicativeAnnualTuitionMinUsd ||
    offering.officialAnnualTuitionAmount ||
    Number.POSITIVE_INFINITY
  );
}

/**
 * Cheapest published annual tuition across the catalogue. "From" in a
 * description has to mean the actual floor, not the flagship's price.
 */
export function selectLowestFeeProgram<T extends MetadataProgram>(
  programs: readonly T[],
): T | undefined {
  const renderable = programs.filter((program) => hasRenderableProgramFee(program.offering));
  if (renderable.length === 0) return undefined;
  return [...renderable].sort((a, b) => {
    const delta = comparableAnnualFee(a) - comparableAnnualFee(b);
    if (delta !== 0) return delta;
    return a.offering.slug.localeCompare(b.offering.slug);
  })[0];
}

function flagshipFeeText(program: MetadataProgram | undefined) {
  if (!program || !hasRenderableProgramFee(program.offering)) return undefined;
  return formatProgramAnnualFee(program.offering);
}

function shortRecognitionBadges(badges: readonly string[] | undefined) {
  // Published badges range from "NMC" to full accreditation sentences. Only
  // the short, name-like ones work as honest keywords.
  return (badges ?? [])
    .map((badge) => normalizeSpace(badge))
    .filter((badge) => badge.length > 0 && badge.length <= 24);
}

export function buildUniversityKeywords(input: {
  university: MetadataUniversity;
  country: MetadataCountry;
  profile: UniversityStreamProfile;
  flagship?: MetadataProgram;
}) {
  const { university, country, profile, flagship } = input;
  const keywords = [
    university.name,
    `${university.name} fees`,
    `${university.name} admission`,
    country ? `${university.name} ${country.name}` : undefined,
    `${university.city} ${profile.keywordNoun}`,
    flagship ? `${flagship.course.shortName} at ${university.name}` : undefined,
    `${university.name} for Indian students`,
    ...shortRecognitionBadges(university.recognitionBadges),
  ].filter(Boolean) as string[];

  return [...new Set(keywords)];
}

const SECTION_TITLE_SUFFIXES: Record<UniversitySection, string[]> = {
  programs: ["Courses, Fees & Duration 2026", "Courses, Fees & Duration", "Courses & Fees"],
  "student-life": ["Student Life & Campus Guide", "Student Life Guide", "Student Life"],
  hostel: ["Hostel Fees & Accommodation", "Hostel & Accommodation", "Hostel Guide"],
  faq: ["FAQs for Indian Students 2026", "FAQs for Indian Students", "FAQs"],
};

/**
 * University pages (and their sections) lead with the university, never with
 * an arbitrary course. The flagship course only appears when the university
 * genuinely teaches a single stream, where it is the search intent.
 */
export function buildUniversityMetadata(input: {
  university: MetadataUniversity;
  country: MetadataCountry;
  programs: readonly MetadataProgram[];
  section: UniversitySection | null;
}): BuiltMetadata {
  const { university, country, programs, section } = input;
  const profile = summariseUniversityStreams(programs);
  const flagship = selectFlagshipProgram(programs);
  const feeText = flagshipFeeText(flagship);
  const lowestFeeText = flagshipFeeText(selectLowestFeeProgram(programs));
  const loc = locationLabel(university, country);
  const keywords = buildUniversityKeywords({ university, country, profile, flagship });

  if (section) {
    return {
      title: fitTitle(university.name, SECTION_TITLE_SUFFIXES[section]),
      description: buildUniversitySectionDescription({
        section,
        university,
        loc,
        profile,
        feeText: lowestFeeText,
      }),
      keywords,
    };
  }

  // The flagship course only leads the title when the university teaches a
  // single stream, where it *is* the search intent. A multi-stream university
  // gets an institution-level title.
  const focusCourse =
    flagship && profile.isSingleStream ? flagship.course.shortName : null;

  if (focusCourse) {
    return {
      title: fitTitle(
        `${university.name} ${focusCourse}`,
        [
          feeText ? "Fees & Admission 2026" : "Admission & Eligibility 2026",
          feeText ? "Fees & Admission" : "Admission Guide",
          "2026 Guide",
        ],
        { separator: " " },
      ),
      description: composeDescription([
        `${focusCourse} at ${university.name}, ${loc}: fees, eligibility, intake and admission steps for Indian students.`,
        feeText ? [`Annual tuition ${feeText}.`] : undefined,
      ]),
      keywords,
    };
  }

  return {
    title: fitTitle(university.name, [
      feeText ? "Courses, Fees & Admission 2026" : "Courses & Admission 2026",
      feeText ? "Courses, Fees & Admission" : "Courses & Admission",
      "Courses & Fees",
    ]),
    description: composeDescription([
      profile.programCount > 0
        ? [
            `${university.name}, ${loc}: ${pluraliseProgrammes(profile.programCount)} across ${profile.streamPhrase}.`,
            `${university.name}, ${loc}: ${pluraliseProgrammes(profile.programCount)} across ${profile.streamPhrase.split(" and ")[0]}.`,
            `${university.name}, ${loc}: ${pluraliseProgrammes(profile.programCount)} published.`,
          ]
        : `${university.name}, ${loc}: campus, courses, admission requirements and student support for Indian students.`,
      lowestFeeText ? [`Annual tuition from ${lowestFeeText}.`] : undefined,
      [
        "Compare fees, eligibility and intake for Indian students.",
        "Fees, eligibility and intake for Indian students.",
        "Guidance for Indian students.",
      ],
    ]),
    keywords,
  };
}

function buildUniversitySectionDescription(input: {
  section: UniversitySection;
  university: MetadataUniversity;
  loc: string;
  profile: UniversityStreamProfile;
  feeText?: string;
}) {
  const { section, university, loc, profile, feeText } = input;

  switch (section) {
    case "programs":
      return composeDescription([
        profile.programCount > 0
          ? [
              `All ${pluraliseProgrammes(profile.programCount)} at ${university.name}, ${loc} — duration, medium of instruction, intake and tuition.`,
              `All ${pluraliseProgrammes(profile.programCount)} at ${university.name}, ${loc} — duration, medium and intake.`,
            ]
          : `Programmes at ${university.name}, ${loc} — duration, medium of instruction, intake and admission details.`,
        feeText ? [`Tuition from ${feeText}.`] : undefined,
        ["Verified for Indian students.", "For Indian students."],
      ]);
    case "student-life":
      return composeDescription([
        `Campus life at ${university.name}, ${university.city}: accommodation, food, safety and the support Indian students get after arrival.`,
        ["What daily student life really looks like.", "What daily life really looks like."],
      ]);
    case "hostel":
      return composeDescription([
        `Hostel and accommodation at ${university.name}, ${university.city}: room options, costs, food, campus facilities and safety.`,
        [
          "Everything Indian students ask before booking.",
          "What Indian students ask before booking.",
          "For Indian students.",
        ],
      ]);
    case "faq":
    default: {
      const faqCount = university.faq?.length ?? 0;
      return composeDescription([
        faqCount > 0
          ? [
              `${faqCount} answered questions about ${university.name}, ${loc} — admissions, fees, hostel, teaching medium and student life.`,
              `${faqCount} answered questions about ${university.name}, ${loc} — admissions, fees and hostel.`,
            ]
          : `Common questions about ${university.name}, ${loc} — admissions, fees, hostel, teaching medium and student life.`,
        ["Answered for Indian students.", "For Indian students."],
      ]);
    }
  }
}

type ProgramTitleSpec = {
  entity: (course: string, university: string) => string;
  suffixes: (feeText?: string) => (string | undefined)[];
};

const PROGRAM_TITLE_SPECS: Record<ProgramSection | "default", ProgramTitleSpec> = {
  default: {
    entity: (course, university) => `${course} at ${university}`,
    suffixes: (feeText) => [
      feeText ? "Fees, Eligibility & Intake 2026" : "Eligibility & Intake 2026",
      feeText ? "Fees, Eligibility & Intake" : "Eligibility & Intake",
      feeText ? "Fees & Eligibility" : "Course Details",
      "2026 Guide",
    ],
  },
  fees: {
    entity: (course, university) => `${course} Fees at ${university}`,
    suffixes: (feeText) => [
      feeText ? `2026: ${feeText} a Year` : "2026 Tuition & Costs",
      "2026 Tuition & Costs",
      "2026 Fee Structure",
      "Fee Structure",
    ],
  },
  eligibility: {
    entity: (course, university) => `${course} Eligibility at ${university}`,
    suffixes: () => ["2026 Entry Requirements", "Entry Requirements", "Requirements"],
  },
  admissions: {
    entity: (course, university) => `${course} Admission at ${university}`,
    suffixes: () => ["How to Apply in 2026", "How to Apply", "Apply Now"],
  },
  recognition: {
    entity: (course, university) => `${course} at ${university}`,
    suffixes: () => [
      "Recognition & Accreditation 2026",
      "Recognition & Accreditation",
      "Accreditation Status",
    ],
  },
};

/**
 * Programme pages lead with the programme *at that university* — the entity
 * the page is actually about — rather than with a bare course keyword.
 */
export function buildProgramMetadata(input: {
  program: MetadataProgram;
  university: MetadataUniversity;
  country: MetadataCountry;
  section: ProgramSection | null;
}): BuiltMetadata {
  const { program, university, country, section } = input;
  const course = program.course.shortName;
  const loc = locationLabel(university, country);
  const feeText = flagshipFeeText(program);
  const spec = PROGRAM_TITLE_SPECS[section ?? "default"];
  const title = fitTitle(spec.entity(course, university.name), spec.suffixes(feeText));

  const description = (() => {
    switch (section) {
      case "fees":
        return composeDescription([
          feeText
            ? [
                `${course} at ${university.name}, ${loc}: annual tuition ${feeText}, year-wise costs, hostel charges and total programme cost.`,
                `${course} at ${university.name}: annual tuition ${feeText}, year-wise costs and hostel charges.`,
              ]
            : `${course} fees at ${university.name}, ${loc}: year-wise tuition structure, hostel charges and total programme cost.`,
          ["Updated for Indian students.", "For Indian students."],
        ]);
      case "eligibility":
        return composeDescription([
          [
            `${course} eligibility at ${university.name}, ${loc}: academic requirements, qualifying marks, age limits and language criteria.`,
            `${course} eligibility at ${university.name}: academic requirements, qualifying marks, age limits and language criteria.`,
          ],
          ["Checked for Indian applicants.", "For Indian applicants."],
        ]);
      case "admissions":
        return composeDescription([
          [
            `How Indian students apply for ${course} at ${university.name}, ${loc}: documents, application timeline, offer letter and visa steps.`,
            `How Indian students apply for ${course} at ${university.name}: documents, application timeline, offer letter and visa steps.`,
            `Applying for ${course} at ${university.name}: documents, timeline, offer letter and visa steps for Indian students.`,
          ],
          ["Step by step.", undefined],
        ]);
      case "recognition":
        return composeDescription([
          [
            `Recognition and accreditation of ${course} at ${university.name}, ${loc} — what the listings mean for Indian students, with official links.`,
            `Recognition and accreditation of ${course} at ${university.name} — what the listings mean for Indian students, with official links.`,
            `Recognition status of ${course} at ${university.name} — what it means for Indian students, with official verification links.`,
          ],
          ["Verify before you apply.", undefined],
        ]);
      default:
        return composeDescription([
          [
            `${course} at ${university.name}, ${loc}: duration, medium of instruction, intake, eligibility and admission process.`,
            `${course} at ${university.name}: duration, medium of instruction, intake, eligibility and admission process.`,
          ],
          feeText ? [`Annual tuition ${feeText}.`] : undefined,
          ["A complete guide for Indian students.", "Guide for Indian students."],
        ]);
    }
  })();

  const keywords = [
    `${course} at ${university.name}`,
    `${course} in ${university.city}`,
    `${university.name} ${course} fees`,
    `${university.name} admission`,
    country ? `${course} in ${country.name} for Indian students` : undefined,
  ].filter(Boolean) as string[];

  return { title, description, keywords: [...new Set(keywords)] };
}

/**
 * University-vs-university comparison titles. Both entities have to survive,
 * so the names are trimmed evenly rather than letting the second one fall off
 * the end of the SERP title.
 */
export function buildComparisonTitle(
  leftName: string,
  rightName: string,
  suffixes: readonly string[] = ["Fees & Admission 2026", "Fees & Admission", "Compared"],
) {
  const left = normalizeSpace(leftName);
  const right = normalizeSpace(rightName);
  const pairLength = left.length + right.length + " vs ".length;

  if (pairLength > TITLE_MAX_CHARS) {
    const perName = Math.floor((TITLE_MAX_CHARS - " vs ".length) / 2);
    return `${truncateToWordBoundary(left, perName)} vs ${truncateToWordBoundary(right, perName)}`;
  }

  return fitTitle(`${left} vs ${right}`, suffixes);
}
