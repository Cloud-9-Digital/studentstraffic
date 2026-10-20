import "server-only";

import { NARRATIVE_CLIP_CHARS } from "@/lib/chatbot/config";
import type { ChatLink, ChatUniversityCard } from "@/lib/chatbot/types";
import {
  getCountries,
  getCountryBySlug,
  getCourses,
  getProgramsForUniversity,
  getUniversityBySlug,
  listFinderPrograms,
} from "@/lib/data/catalog";
import type { FinderFilters, FinderProgram } from "@/lib/data/types";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
} from "@/lib/routes";
import { getCountryFlagCode } from "@/lib/university-media";
import { searchCatalog } from "@/lib/search/search";
import { getActivePeersForUniversity } from "@/lib/university-community";
import {
  formatCurrencyUsd,
  formatProgramAnnualFee,
  formatProgramDuration,
  formatProgramLivingFee,
} from "@/lib/utils";

/**
 * The catalogue read layer the chatbot is allowed to see.
 *
 * Every number, fee and recognition claim the bot can state comes from one of
 * these functions, and fees in particular are formatted with the *same*
 * helpers the pages use — so "on request" and "indicative range" stay "on
 * request" and "indicative range" instead of being rounded into a figure the
 * university never published. Nothing here reads unpublished rows.
 *
 * Each lookup returns three things: `result` (compact JSON for the model),
 * optional `cards` / `links` (real UI the widget renders under the answer), and
 * `outcome` (one line for the stored transcript, so a bad answer can be traced
 * to the lookup that produced it).
 */
export type KnowledgeResult = {
  result: unknown;
  cards?: ChatUniversityCard[];
  links?: ChatLink[];
  outcome: string;
};

function clip(value: string | null | undefined, max = NARRATIVE_CLIP_CHARS) {
  const text = value?.trim();
  if (!text) return undefined;
  if (text.length <= max) return text;
  // Cut on a sentence boundary where there is one close to the limit, so the
  // model never quotes half a clause back to the visitor.
  const head = text.slice(0, max);
  const lastStop = head.lastIndexOf(". ");
  return `${lastStop > max * 0.6 ? head.slice(0, lastStop + 1) : head.trimEnd()}…`;
}

/**
 * Sentinel used to ask `formatProgramAnnualFee` whether a programme has a fee
 * it is allowed to show at all.
 */
const NO_PUBLISHED_FEE = "\u0000no-fee";

function hasPublishableAnnualFee(program: FinderProgram) {
  return formatProgramAnnualFee(program.offering, NO_PUBLISHED_FEE) !== NO_PUBLISHED_FEE;
}

/**
 * The numeric fee a chart may plot, or undefined.
 *
 * Set only when the figure we *display* is the USD one. A programme can have a
 * stored USD amount while its card shows the official currency ("A$44,200") or
 * an indicative range, and plotting USD bar lengths under non-USD labels would
 * put two different currencies on one axis — the reader would compare lengths
 * that do not mean the same thing. Anything that is not plainly USD is left
 * off the chart and still shows its real figure on the card.
 */
function getChartableUsdFee(program: FinderProgram) {
  const fee = program.offering.annualTuitionUsd;

  if (typeof fee !== "number" || fee <= 0) return undefined;

  return formatProgramAnnualFee(program.offering, NO_PUBLISHED_FEE) ===
    formatCurrencyUsd(fee)
    ? fee
    : undefined;
}

function toCard(program: FinderProgram): ChatUniversityCard {
  return {
    slug: program.university.slug,
    name: program.university.name,
    city: program.university.city,
    country: program.country.name,
    countryCode: getCountryFlagCode(program.country.slug),
    href: getUniversityHref(program.university.slug),
    annualFee: formatProgramAnnualFee(program.offering),
    annualFeeUsd: getChartableUsdFee(program),
    courses: [program.course.shortName],
    medium: program.offering.medium,
    intakes: program.offering.intakeMonths ?? [],
  };
}

/**
 * One card per university even when several of its programmes matched, with the
 * matched course names merged. A list of eight cards for the same university is
 * not a shortlist.
 */
function toCards(programs: FinderProgram[], limit: number) {
  const bySlug = new Map<string, ChatUniversityCard>();

  for (const program of programs) {
    const existing = bySlug.get(program.university.slug);

    if (existing) {
      if (!existing.courses.includes(program.course.shortName)) {
        existing.courses.push(program.course.shortName);
      }
      continue;
    }

    if (bySlug.size >= limit) continue;
    bySlug.set(program.university.slug, toCard(program));
  }

  return [...bySlug.values()];
}

function describeProgram(program: FinderProgram) {
  return {
    university: program.university.name,
    universitySlug: program.university.slug,
    city: program.university.city,
    country: program.country.name,
    countrySlug: program.country.slug,
    universityType: program.university.type,
    course: program.course.shortName,
    courseSlug: program.course.slug,
    programme: program.offering.title,
    duration: formatProgramDuration(program.offering.durationYears),
    annualTuition: formatProgramAnnualFee(program.offering),
    annualLivingCost: formatProgramLivingFee(program.offering),
    feeStatus: program.offering.feeStatus ?? "unspecified",
    feeAcademicYear: program.offering.feeAcademicYear,
    teachingMedium: program.offering.medium,
    intakes: program.offering.intakeMonths,
    page: getUniversityHref(program.university.slug),
  };
}

/**
 * Free-text lookup across everything indexed for site search — universities,
 * programmes, countries, courses, guides and posts. This is the bot's "I don't
 * know where to start" tool.
 */
export async function searchSite(input: {
  query: string;
  limit?: number;
}): Promise<KnowledgeResult> {
  const limit = Math.min(Math.max(input.limit ?? 8, 1), 12);
  const results = await searchCatalog({ q: input.query }, limit);

  if (results.length === 0) {
    return {
      result: {
        matches: [],
        note: "Nothing in the Students Traffic catalogue matches that. Do not guess — say we do not cover it yet and offer counselling.",
      },
      outcome: "no match",
    };
  }

  return {
    result: {
      matches: results.map((result) => ({
        type: result.documentType,
        title: result.title,
        subtitle: result.subtitle,
        summary: clip(result.summary, 300),
        page: result.path,
        country: result.countrySlug,
        course: result.courseSlug,
        city: result.city,
        annualTuitionUsd: result.annualTuitionUsd,
        teachingMedium: result.medium,
        intakes: result.intakeMonths,
      })),
    },
    links: results.slice(0, 4).map((result) => ({
      label: result.title,
      href: result.path,
    })),
    outcome: `${results.length} matches`,
  };
}

/**
 * Filtered shortlisting — the thing a static page cannot do for a visitor whose
 * constraints are "Germany, engineering, under $12,000, English, September".
 */
export async function findPrograms(input: {
  countrySlug?: string;
  courseSlug?: string;
  city?: string;
  level?: string;
  maxAnnualTuitionUsd?: number;
  minAnnualTuitionUsd?: number;
  teachingLanguage?: string;
  intakeMonth?: string;
  universityType?: "Public" | "Private";
  limit?: number;
}): Promise<KnowledgeResult> {
  const limit = Math.min(Math.max(input.limit ?? 6, 1), 10);

  const filters: FinderFilters = {
    country: input.countrySlug,
    course: input.courseSlug,
    city: input.city,
    level: input.level,
    feeMin: input.minAnnualTuitionUsd,
    feeMax: input.maxAnnualTuitionUsd,
    medium: input.teachingLanguage,
    intake: input.intakeMonth,
    universityType: input.universityType,
    sort: "tuition_asc",
  };

  const allMatches = await listFinderPrograms(filters);

  /**
   * The finder's fee bounds compare the stored USD figure, which exists even
   * for programmes whose fee the university has not authorised us to publish
   * (`feeStatus: "on_request"`). Those are real matches on the number but their
   * fee renders as "Fee plan on request" — so answering "under $6,000" with
   * them would put a budget claim next to a fee we are not showing.
   *
   * When the visitor set a budget, keep only programmes with a fee we can
   * actually state, and tell the model how many were held back so it can offer
   * them as "fee on request" rather than silently dropping them.
   */
  const hasBudgetFilter =
    input.maxAnnualTuitionUsd !== undefined ||
    input.minAnnualTuitionUsd !== undefined;

  const programs = hasBudgetFilter
    ? allMatches.filter(hasPublishableAnnualFee)
    : allMatches;
  const withheldForUnpublishedFee = allMatches.length - programs.length;

  if (programs.length === 0) {
    return {
      result: {
        matches: [],
        withheldForUnpublishedFee,
        note:
          withheldForUnpublishedFee > 0
            ? `No programme has a published fee inside that budget, but ${withheldForUnpublishedFee} match the other filters with their fee on request. Say that, and offer to get those fees through counselling.`
            : "No published programme matches every filter. Say so plainly, then suggest relaxing the tightest one (usually budget or intake month) — do not invent a match.",
      },
      outcome: `0 programmes (${withheldForUnpublishedFee} fee-on-request)`,
    };
  }

  const cards = toCards(programs, limit);

  return {
    result: {
      totalMatches: programs.length,
      showing: Math.min(programs.length, limit),
      matches: programs.slice(0, limit).map(describeProgram),
      ...(withheldForUnpublishedFee > 0
        ? {
            alsoMatchingWithFeeOnRequest: withheldForUnpublishedFee,
            note: `${withheldForUnpublishedFee} further programmes match the other filters but their fee is on request, so they are not listed under a budget. Mention they exist if it is relevant.`,
          }
        : {}),
    },
    cards,
    outcome: `${programs.length} programmes, ${cards.length} shown${withheldForUnpublishedFee > 0 ? `, ${withheldForUnpublishedFee} fee-on-request withheld` : ""}`,
  };
}

/**
 * Everything the bot may say about one university. Narrative fields are clipped
 * to a lede and the page link carries the rest — a chat answer should send the
 * reader to the page, not replace it.
 */
export async function getUniversityDossier(input: {
  slug: string;
}): Promise<KnowledgeResult> {
  const [university, programs] = await Promise.all([
    getUniversityBySlug(input.slug),
    getProgramsForUniversity(input.slug),
  ]);

  if (!university) {
    return {
      result: {
        found: false,
        note: "No published university with that slug. Use search_site to find the right slug instead of guessing one.",
      },
      outcome: "not found",
    };
  }

  const country = await getCountryBySlug(university.countrySlug);
  const href = getUniversityHref(university.slug);

  return {
    result: {
      found: true,
      name: university.name,
      slug: university.slug,
      city: university.city,
      country: country?.name ?? university.countrySlug,
      type: university.type,
      establishedYear: university.establishedYear,
      summary: clip(university.summary),
      recognitionBadges: university.recognitionBadges,
      whyChoose: university.whyChoose,
      thingsToConsider: university.thingsToConsider,
      bestFitFor: university.bestFitFor,
      hostelOverview: clip(university.hostelOverview),
      dietarySupport: clip(university.dietarySupport),
      safetyOverview: clip(university.safetyOverview),
      cityProfile: clip(university.cityProfile),
      campusLifestyle: clip(university.campusLifestyle),
      studentSupport: clip(university.studentSupport),
      practicalExposure: clip(university.practicalExposure),
      officialWebsite: university.officialWebsite,
      lastVerifiedAt: university.lastVerifiedAt,
      faq: university.faq?.slice(0, 6).map((entry) => ({
        question: entry.question,
        answer: clip(entry.answer, 400),
      })),
      programmes: programs.map(describeProgram),
      page: href,
    },
    cards: programs.length > 0 ? toCards(programs, 1) : undefined,
    links: [{ label: `${university.name} — full profile`, href }],
    outcome: `${university.name}, ${programs.length} programmes`,
  };
}

/**
 * Side-by-side on the fields students actually decide on. Two to four slugs;
 * more than that is a directory page, not a comparison.
 */
export async function compareUniversities(input: {
  slugs: string[];
}): Promise<KnowledgeResult> {
  const slugs = [...new Set(input.slugs)].slice(0, 4);

  if (slugs.length < 2) {
    return {
      result: {
        note: "Comparison needs at least two different university slugs.",
      },
      outcome: "too few slugs",
    };
  }

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const [university, programs] = await Promise.all([
        getUniversityBySlug(slug),
        getProgramsForUniversity(slug),
      ]);
      return { slug, university, programs };
    })
  );

  const found = entries.filter((entry) => entry.university !== null);

  if (found.length < 2) {
    return {
      result: {
        note: "Fewer than two of those slugs are published. Use search_site to resolve the names first.",
        missing: entries
          .filter((entry) => !entry.university)
          .map((entry) => entry.slug),
      },
      outcome: "unresolved slugs",
    };
  }

  const allPrograms = found.flatMap((entry) => entry.programs);

  return {
    result: {
      comparison: found.map((entry) => {
        const university = entry.university!;
        // getProgramsForUniversity does not order by price, so pick the
        // lowest fee we are allowed to state rather than the first row.
        const lowestFee = entry.programs
          .filter(hasPublishableAnnualFee)
          .map((program) => program.offering.annualTuitionUsd)
          .filter((fee): fee is number => typeof fee === "number" && fee > 0)
          .sort((left, right) => left - right)
          .at(0);

        return {
          name: university.name,
          slug: university.slug,
          city: university.city,
          type: university.type,
          establishedYear: university.establishedYear,
          recognitionBadges: university.recognitionBadges,
          lowestPublishedAnnualTuition:
            lowestFee === undefined
              ? "Fee plan on request"
              : formatCurrencyUsd(lowestFee),
          programmes: entry.programs.map((program) => ({
            course: program.course.shortName,
            duration: formatProgramDuration(program.offering.durationYears),
            annualTuition: formatProgramAnnualFee(program.offering),
            teachingMedium: program.offering.medium,
            intakes: program.offering.intakeMonths,
          })),
          thingsToConsider: university.thingsToConsider,
          lastVerifiedAt: university.lastVerifiedAt,
          page: getUniversityHref(university.slug),
        };
      }),
    },
    cards: toCards(allPrograms, found.length),
    outcome: `compared ${found.length}`,
  };
}

/**
 * Destination-level orientation: what the country page says, plus what the
 * catalogue actually holds for it (count and real fee range), so the bot never
 * claims coverage we do not have.
 */
export async function getCountryBrief(input: {
  slug: string;
}): Promise<KnowledgeResult> {
  const country = await getCountryBySlug(input.slug);

  if (!country) {
    return {
      result: {
        found: false,
        note: "No such destination. Use list_destinations to see what is covered.",
      },
      outcome: "not found",
    };
  }

  const programs = await listFinderPrograms({ country: country.slug });
  const universitySlugs = new Set(
    programs.map((program) => program.university.slug)
  );
  // Only fees we are allowed to publish may form a quoted range — the stored
  // figure also exists for programmes whose fee is "on request".
  const fees = programs
    .filter(hasPublishableAnnualFee)
    .map((program) => program.offering.annualTuitionUsd)
    .filter((fee): fee is number => typeof fee === "number" && fee > 0)
    .sort((left, right) => left - right);
  const courses = [
    ...new Set(programs.map((program) => program.course.shortName)),
  ];

  return {
    result: {
      found: true,
      name: country.name,
      slug: country.slug,
      region: country.region,
      summary: clip(country.summary),
      whyStudentsChooseIt: clip(country.whyStudentsChooseIt),
      climate: country.climate,
      currencyCode: country.currencyCode,
      publishedUniversities: universitySlugs.size,
      publishedProgrammes: programs.length,
      coursesOffered: courses,
      annualTuitionRangeUsd:
        fees.length > 0 ? { min: fees[0], max: fees[fees.length - 1] } : null,
      page: getCountryHref(country.slug),
    },
    links: [
      { label: `Study in ${country.name}`, href: getCountryHref(country.slug) },
    ],
    outcome: `${country.name}, ${universitySlugs.size} universities`,
  };
}

/** What we cover at all — the honest answer to "do you do X?". */
export async function listDestinations(): Promise<KnowledgeResult> {
  const [countries, courses] = await Promise.all([getCountries(), getCourses()]);

  return {
    result: {
      destinations: countries.map((country) => ({
        name: country.name,
        slug: country.slug,
        region: country.region,
        page: getCountryHref(country.slug),
      })),
      courses: courses.map((course) => ({
        name: course.shortName,
        fullName: course.name,
        slug: course.slug,
        level: course.level,
        stream: course.stream,
        page: getCourseHref(course.slug),
      })),
      note: "This is the complete published coverage. Anything not listed here is not covered yet — say so instead of improvising.",
    },
    outcome: `${countries.length} destinations, ${courses.length} courses`,
  };
}

/**
 * Students currently at a university who have agreed to talk to applicants.
 *
 * This is the one thing no competitor's assistant can offer, so it is worth
 * surfacing by name rather than hiding behind "we can connect you". Only
 * active peers who are accepting requests are returned, and never their
 * contact details — a connection is brokered, not handed over.
 */
export async function findStudentPeers(input: {
  universitySlug: string;
}): Promise<KnowledgeResult> {
  const [university, peers] = await Promise.all([
    getUniversityBySlug(input.universitySlug),
    getActivePeersForUniversity(input.universitySlug),
  ]);

  if (!university) {
    return {
      result: {
        found: false,
        note: "No published university with that slug. Resolve the name with search_site first.",
      },
      outcome: "university not found",
    };
  }

  const available = peers.filter((peer) => peer.acceptingRequests);

  if (available.length === 0) {
    return {
      result: {
        university: university.name,
        peers: [],
        note: `No students at ${university.name} are taking requests right now. Say so plainly and offer counselling instead — do not imply someone is available.`,
      },
      outcome: "no peers",
    };
  }

  return {
    result: {
      university: university.name,
      universitySlug: university.slug,
      peerCount: available.length,
      peers: available.slice(0, 6).map((peer) => ({
        firstName: peer.fullName.split(" ")[0],
        course: peer.courseName,
        year: peer.currentYearOrBatch,
        homeState: peer.homeState,
        languages: peer.languages,
      })),
      note: "These are real students at that university. Describe who is available in general terms — a first name, course and year is plenty — and offer to arrange an introduction with request_peer_connection. Never promise a specific person will respond.",
    },
    links: [
      {
        label: `Students at ${university.name}`,
        href: `${getUniversityHref(university.slug)}#community`,
      },
    ],
    outcome: `${available.length} peers`,
  };
}
