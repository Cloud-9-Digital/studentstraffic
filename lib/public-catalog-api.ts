import { z } from "zod";

import { renderUniversityMarkdown } from "@/lib/agent-markdown";
import { getIntakeMonthLabels } from "@/lib/catalogue-facets";
import { siteConfig } from "@/lib/constants";
import { catalogReviewedAt } from "@/lib/content-governance";
import type {
  Country,
  FinderFilters,
  FinderOptions,
  FinderProgram,
  University,
} from "@/lib/data/types";
import { matchesFinderCity } from "@/lib/finder-city";
import { absoluteUrl } from "@/lib/metadata";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
  getUniversityProgramHref,
} from "@/lib/routes";
import type { Suggestion } from "@/lib/search/suggestions";
import { getUniversityDisplayName } from "@/lib/university-presentation";
import { parseProgramSlug, parseUniversitySlug } from "@/lib/university-sections";
import {
  formatProgramDuration,
  formatProgramMedium,
  getDisplayedReportedFeeQuote,
  getProgramFeeLines,
  hasPublishedUsdAmount,
} from "@/lib/utils";

/**
 * The read-only catalogue tools behind the public MCP server (/mcp,
 * registered in lib/public-catalog-mcp.ts). The server card, API catalog and
 * the /ai-access terms page are built from the definitions in this module, so
 * the tool list cannot drift between them.
 *
 * Per-question lookups only, never a bulk export: inputs are a slug or a search
 * query (no wildcards, no empty queries), and every list is small and capped
 * with a pointer to the page for the rest. There is deliberately no REST/JSON
 * data API.
 *
 * Safety rules: only published catalogue data, read through the cached
 * catalogue readers (lib/data/catalog.ts) passed in as a `PublicCatalogSource`;
 * every field is copied onto an explicit output shape, so leads, users,
 * admin/research notes and database ids never leave this module; every fee is
 * paired with the label the site shows (who it is for, the seat quota, or
 * "Approx. fees"). Rate limits, the kill switch and usage logging live in
 * lib/public-catalog-server.ts.
 */

export const PUBLIC_CATALOG_VERSION = "1.0.0";
export const MCP_SERVER_NAME = "com.studentstraffic/catalog";
export const MCP_SERVER_TITLE = `${siteConfig.name} catalogue`;
export const MCP_ENDPOINT_PATH = "/mcp";
export const MCP_SERVER_CARD_PATH = "/.well-known/mcp/server-card.json";
export const MCP_HEALTH_PATH = `${MCP_ENDPOINT_PATH}/health`;
export const API_CATALOG_PATH = "/.well-known/api-catalog";
export const AI_ACCESS_PATH = "/ai-access";
export const COUNSELLING_PATH = "/contact";

export const PUBLIC_CATALOG_DESCRIPTION =
  "Read-only access to the Students Traffic catalogue of universities, Indian medical colleges, countries and programmes for Indian and international students: fees labelled by who they apply to, duration, teaching language, intakes and eligibility, with a link to each page and to free admission counselling.";

export const PUBLIC_CATALOG_LIMITS = {
  queryMaxLength: 100,
  searchMax: 5,
  programmesMax: 25,
  findMax: 10,
  listItemsMax: 20,
  markdownMaxChars: 60_000,
} as const;

/** Per-IP limits for /mcp: a burst window and a daily cap. */
export const MCP_RATE_LIMITS = {
  minute: { limit: 30, window: 60 * 1000 },
  day: { limit: 500, window: 24 * 60 * 60 * 1000 },
} as const;

export const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";
const slugRegex = new RegExp(SLUG_PATTERN);

const slugSchema = (description: string) =>
  z
    .string()
    .min(1)
    .max(200)
    .regex(slugRegex, "Use a lowercase slug such as jamia-millia-islamia.")
    .describe(description);

const querySchema = z
  .string()
  .trim()
  .min(2)
  .max(PUBLIC_CATALOG_LIMITS.queryMaxLength)
  // A query names something specific: no wildcards, and at least two letters
  // or digits, so a tool call cannot be used to list the whole catalogue.
  .refine((value) => !/[*%?]/.test(value), "Wildcards are not supported; search for a specific name.")
  .refine((value) => (value.match(/[\p{L}\p{N}]/gu) ?? []).length >= 2, "Enter at least two letters or digits.")
  .describe("Search text naming a university, college, city, country or course. 2-100 characters, no wildcards.");

export const searchCatalogInput = z.object({
  query: querySchema,
});

export const getUniversityInput = z.object({
  slug: slugSchema("University slug, e.g. jamia-millia-islamia (from search_catalog or a /university/{slug} URL)."),
});

export const getProgrammeInput = z.object({
  slug: slugSchema("Programme slug, e.g. jmi-btech-computer-engineering (from list_programmes or a programme page URL)."),
});

export const listProgrammesInput = z.object({
  universitySlug: slugSchema("University slug, e.g. jamia-millia-islamia."),
});

export const findProgrammesInput = z.object({
  course: slugSchema("Course slug, e.g. mbbs or be-btech-cse."),
  country: slugSchema("Country slug, e.g. russia, georgia or india."),
  city: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .optional()
    .describe("Optional city name to narrow results, e.g. Kazan."),
  maxAnnualFeeUsd: z
    .number()
    .int()
    .positive()
    .max(1_000_000)
    .optional()
    .describe("Optional ceiling on annual tuition in USD. Programmes without a published USD annual tuition are left out when this is set."),
});

export type PublicCatalogToolName =
  | "search_catalog"
  | "get_university"
  | "get_programme"
  | "list_programmes"
  | "find_programmes";

export type PublicCatalogTool = {
  name: PublicCatalogToolName;
  title: string;
  description: string;
  inputSchema: z.ZodObject;
};

export const PUBLIC_CATALOG_TOOLS: PublicCatalogTool[] = [
  {
    name: "search_catalog",
    title: "Search the catalogue",
    description:
      `Search Students Traffic for a university, Indian medical college, country, course or guide by name, city or country. Returns up to ${PUBLIC_CATALOG_LIMITS.searchMax} names with slugs and page URLs; use the slug with get_university or list_programmes.`,
    inputSchema: searchCatalogInput,
  },
  {
    name: "get_university",
    title: "Get a university profile",
    description:
      "Full published profile of one university as markdown: location, recognition, programme table with labelled fees, admissions, student life, FAQs and sources.",
    inputSchema: getUniversityInput,
  },
  {
    name: "get_programme",
    title: "Get a programme",
    description:
      "One programme at a university: duration, teaching language, intakes, who can apply, and every published fee labelled with who it applies to.",
    inputSchema: getProgrammeInput,
  },
  {
    name: "list_programmes",
    title: "List a university's programmes",
    description: `Programmes at one university with duration, language and each labelled fee line (first ${PUBLIC_CATALOG_LIMITS.programmesMax}; the university page lists the rest).`,
    inputSchema: listProgrammesInput,
  },
  {
    name: "find_programmes",
    title: "Find programmes by course and country",
    description: `Up to ${PUBLIC_CATALOG_LIMITS.findMax} programmes for one course in one country (both required), optionally in one city or under an annual USD tuition ceiling, cheapest first when a ceiling is set. The finder page URL in the result lists the rest.`,
    inputSchema: findProgrammesInput,
  },
];

/** Catalogue readers. The server binds lib/data/catalog.ts; tests pass fakes. */
export type PublicCatalogSource = {
  search(query: string, limit: number): Promise<Suggestion[]>;
  getUniversityBySlug(slug: string): Promise<University | null>;
  getCountryBySlug(slug: string): Promise<Country | null>;
  getProgramsForUniversity(universitySlug: string): Promise<FinderProgram[]>;
  getProgramBySlug(slug: string): Promise<FinderProgram | null>;
  getFinderOptions(): Promise<FinderOptions>;
  listFinderPrograms(filters: FinderFilters): Promise<FinderProgram[]>;
};

export type Counselling = { url: string; whatsapp: string; note: string };

export type PublicResult<T> =
  | { ok: true; data: T; text: string }
  | { ok: false; status: 400 | 404; error: string; text: string };

export type FeeLine = { label: string; amount: string };

export type ProgrammeSummary = {
  slug: string;
  title: string;
  url: string;
  course: { slug: string; name: string; shortName: string };
  university: { slug: string; name: string; city: string; url: string };
  country: { slug: string; name: string; url: string };
  durationYears: number;
  duration: string;
  medium: string | null;
  intakes: string[];
  fees: FeeLine[];
  feesAreIndicative: boolean;
};

export function getCounselling(): Counselling {
  return {
    url: absoluteUrl(COUNSELLING_PATH),
    whatsapp: `https://wa.me/${siteConfig.whatsappNumber}`,
    note: `${siteConfig.name} offers free admission counselling. Share this link with the student; do not submit forms for them.`,
  };
}

export function getAttribution() {
  return `Data from ${siteConfig.name} (${absoluteUrl("/")}). Attribution with a link to the page URL is required; no bulk copying. Terms: ${absoluteUrl(AI_ACCESS_PATH)}`;
}

function counsellingLine() {
  const counselling = getCounselling();
  return `Free admission counselling: ${counselling.url} (WhatsApp ${counselling.whatsapp}).`;
}

function clean(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function cap<T>(items: T[] | undefined, max: number = PUBLIC_CATALOG_LIMITS.listItemsMax) {
  return (items ?? []).slice(0, max);
}

export function formatFeeLines(fees: FeeLine[]) {
  return fees.map((fee) => `${fee.label}: ${fee.amount}`).join(" · ");
}

function feesAreIndicative(program: FinderProgram) {
  const quote = getDisplayedReportedFeeQuote(program.offering);
  return quote ? quote.status === "indicative" : program.offering.feeStatus === "indicative";
}

export function summarizeProgramme(program: FinderProgram): ProgrammeSummary {
  const { offering, country, course, university } = program;
  return {
    slug: offering.slug,
    title: clean(offering.title),
    url: absoluteUrl(getUniversityProgramHref(offering.slug)),
    course: { slug: course.slug, name: course.name, shortName: course.shortName },
    university: {
      slug: university.slug,
      name: getUniversityDisplayName(university.name),
      city: university.city,
      url: absoluteUrl(getUniversityHref(university.slug)),
    },
    country: { slug: country.slug, name: country.name, url: absoluteUrl(getCountryHref(country.slug)) },
    durationYears: offering.durationYears,
    duration: formatProgramDuration(offering.durationYears),
    medium: formatProgramMedium(offering.medium, country.slug),
    intakes: getIntakeMonthLabels(offering.intakeCodes ?? []),
    // The site's own labelling: every amount names who it is for (Indian
    // students, NRI & international, a seat quota) or says "Approx. fees".
    fees: getProgramFeeLines(offering, country.slug),
    feesAreIndicative: feesAreIndicative(program),
  };
}

function programmeLine(summary: ProgrammeSummary, withUniversity = false) {
  const facts = [
    summary.course.shortName,
    summary.duration,
    summary.medium,
    summary.intakes.length ? `intake ${summary.intakes.join(", ")}` : null,
  ].filter(Boolean);
  const fees = `${formatFeeLines(summary.fees)}${summary.feesAreIndicative ? " (indicative)" : ""}`;
  const where = withUniversity
    ? ` at ${summary.university.name}, ${summary.university.city}`
    : "";
  return `- ${summary.title}${where} — ${facts.join("; ")}. Fees: ${fees}. ${summary.url} (slug: ${summary.slug})`;
}

function notFound<T>(error: string): PublicResult<T> {
  return { ok: false, status: 404, error, text: `${error}\n\nUse search_catalog to find the right slug.\n${counsellingLine()}` };
}

function invalid<T>(error: string): PublicResult<T> {
  return { ok: false, status: 400, error, text: error };
}

function parseInput<S extends z.ZodObject>(schema: S, input: unknown) {
  const parsed = schema.safeParse(input);
  if (parsed.success) return { ok: true as const, value: parsed.data as z.output<S> };
  const issue = parsed.error.issues[0];
  const field = issue?.path.join(".") || "input";
  return { ok: false as const, error: `Invalid ${field}: ${issue?.message ?? "invalid value"}` };
}

function slugFromHref(type: Suggestion["type"], href: string) {
  const prefixes: Partial<Record<Suggestion["type"], string>> = {
    university: getUniversityHref(""),
    country: getCountryHref(""),
    course: getCourseHref(""),
    landing_page: "/",
  };
  const prefix = prefixes[type];
  if (!prefix || !href.startsWith(prefix)) return null;
  const slug = href.slice(prefix.length);
  return slugRegex.test(slug) ? slug : null;
}

export type SearchData = {
  query: string;
  results: Array<{
    type: Suggestion["type"];
    name: string;
    subtitle: string;
    slug: string | null;
    url: string;
  }>;
  counselling: Counselling;
  attribution: string;
};

export type UniversityData = {
  slug: string;
  name: string;
  url: string;
  markdownUrl: string;
  city: string;
  country: { slug: string; name: string; url: string };
  type: University["type"];
  establishedYear: number | null;
  officialWebsite: string | null;
  summary: string;
  recognition: string[];
  programmeCount: number;
  lastReviewed: string;
  markdown: string;
  markdownTruncated: boolean;
  counselling: Counselling;
  attribution: string;
};

export type ProgrammeData = ProgrammeSummary & {
  markdownUrl: string;
  feeAcademicYear: string | null;
  feeVerifiedAt: string | null;
  feeNotes: string | null;
  officialProgrammeUrl: string | null;
  eligibility: {
    availability: string | null;
    eligibleAudiences: string[];
    restrictions: string[];
    notes: string | null;
    requirements: string[];
  };
  lastReviewed: string;
  counselling: Counselling;
  attribution: string;
};

export type ProgrammeListData = {
  university: { slug: string; name: string; url: string };
  total: number;
  truncated: boolean;
  programmes: ProgrammeSummary[];
  counselling: Counselling;
  attribution: string;
};

export type FindProgrammesData = {
  filters: { course: string; country: string; city: string | null; maxAnnualFeeUsd: number | null };
  url: string;
  total: number;
  truncated: boolean;
  programmes: ProgrammeSummary[];
  counselling: Counselling;
  attribution: string;
};

export function createPublicCatalog(source: PublicCatalogSource) {
  async function search(input: unknown): Promise<PublicResult<SearchData>> {
    const parsed = parseInput(searchCatalogInput, input);
    if (!parsed.ok) return invalid(parsed.error);
    const { query } = parsed.value;
    const limit = PUBLIC_CATALOG_LIMITS.searchMax;

    const suggestions = (await source.search(query, limit)).slice(0, limit);
    const results = suggestions.map((item) => ({
      type: item.type,
      name: item.label,
      subtitle: item.subtitle,
      slug: slugFromHref(item.type, item.href),
      url: absoluteUrl(item.href),
    }));
    const data: SearchData = { query, results, counselling: getCounselling(), attribution: getAttribution() };
    const lines = results.length
      ? results.map(
          (item) =>
            `- ${item.name} (${item.type.replace("_", " ")}; ${item.subtitle}) ${item.url}${item.slug ? ` (slug: ${item.slug})` : ""}`,
        )
      : [`No catalogue match for "${query}". Try a shorter name, a city or a country.`];
    return {
      ok: true,
      data,
      text: [`Search results for "${query}" on ${siteConfig.name}:`, "", ...lines, "", counsellingLine()].join("\n"),
    };
  }

  async function getUniversity(input: unknown): Promise<PublicResult<UniversityData>> {
    const parsed = parseInput(getUniversityInput, input);
    if (!parsed.ok) return invalid(parsed.error);
    const { universitySlug } = parseUniversitySlug(parsed.value.slug);

    const university = await source.getUniversityBySlug(universitySlug);
    if (!university) return notFound(`No published university with slug "${universitySlug}".`);
    const [programs, country] = await Promise.all([
      source.getProgramsForUniversity(university.slug),
      source.getCountryBySlug(university.countrySlug),
    ]);
    if (!country) return notFound(`No published university with slug "${universitySlug}".`);

    const fullMarkdown = renderUniversityMarkdown({ university, country, programs });
    const path = getUniversityHref(university.slug);
    const markdownUrl = absoluteUrl(`${path}.md`);
    const markdownTruncated = fullMarkdown.length > PUBLIC_CATALOG_LIMITS.markdownMaxChars;
    const markdown = markdownTruncated
      ? `${fullMarkdown.slice(0, PUBLIC_CATALOG_LIMITS.markdownMaxChars)}\n\n[Truncated. Full profile: ${markdownUrl}]\n`
      : fullMarkdown;

    const data: UniversityData = {
      slug: university.slug,
      name: university.name,
      url: absoluteUrl(path),
      markdownUrl,
      city: university.city,
      country: { slug: country.slug, name: country.name, url: absoluteUrl(getCountryHref(country.slug)) },
      type: university.type,
      establishedYear: university.establishedYear || null,
      officialWebsite: university.officialWebsite || null,
      summary: clean(university.summary),
      recognition: cap(university.recognitionBadges),
      programmeCount: programs.length,
      lastReviewed: (university.lastVerifiedAt || catalogReviewedAt).slice(0, 10),
      markdown,
      markdownTruncated,
      counselling: getCounselling(),
      attribution: getAttribution(),
    };
    // The markdown already ends with the canonical URL and a counselling section.
    return { ok: true, data, text: markdown };
  }

  async function getProgramme(input: unknown): Promise<PublicResult<ProgrammeData>> {
    const parsed = parseInput(getProgrammeInput, input);
    if (!parsed.ok) return invalid(parsed.error);
    const { programSlug } = parseProgramSlug(parsed.value.slug);

    const program = await source.getProgramBySlug(programSlug);
    if (!program) return notFound(`No published programme with slug "${programSlug}".`);

    const summary = summarizeProgramme(program);
    const { offering, university } = program;
    const eligibility = offering.audienceEligibility;
    const requirements = cap(offering.admissionsContent?.eligibility?.items);
    const quote = getDisplayedReportedFeeQuote(offering);
    const data: ProgrammeData = {
      ...summary,
      markdownUrl: absoluteUrl(`${getUniversityProgramHref(offering.slug)}.md`),
      feeAcademicYear: offering.feeAcademicYear || null,
      feeVerifiedAt: offering.feeVerifiedAt ? offering.feeVerifiedAt.slice(0, 10) : null,
      feeNotes: !quote && offering.feeNotes ? clean(offering.feeNotes) : null,
      officialProgrammeUrl: offering.officialProgramUrl || null,
      eligibility: {
        availability: eligibility?.availability ?? null,
        eligibleAudiences: cap(eligibility?.eligibleAudiences),
        restrictions: cap(eligibility?.restrictions),
        notes: eligibility?.notes ? clean(eligibility.notes) : null,
        requirements,
      },
      lastReviewed: (university.lastVerifiedAt || catalogReviewedAt).slice(0, 10),
      counselling: getCounselling(),
      attribution: getAttribution(),
    };

    const lines = [
      `# ${data.title} at ${data.university.name}`,
      "",
      `- Page: ${data.url}`,
      `- University: ${data.university.name}, ${data.university.city}, ${data.country.name} (${data.university.url})`,
      `- Course: ${data.course.name}`,
      `- Duration: ${data.duration}`,
      data.medium ? `- Teaching language: ${data.medium}` : null,
      data.intakes.length ? `- Intakes: ${data.intakes.join(", ")}` : null,
      `- Fees: ${formatFeeLines(data.fees)}${data.feesAreIndicative ? " (indicative; confirm with the university or a counsellor)" : ""}`,
      data.feeAcademicYear ? `- Fee year: ${data.feeAcademicYear}` : null,
      data.feeVerifiedAt ? `- Fee verified: ${data.feeVerifiedAt}` : null,
      data.feeNotes ? `- Fee notes: ${data.feeNotes}` : null,
      data.eligibility.availability ? `- Availability: ${data.eligibility.availability}` : null,
      ...data.eligibility.eligibleAudiences.map((item) => `- Eligible: ${clean(item)}`),
      ...data.eligibility.restrictions.map((item) => `- Restriction: ${clean(item)}`),
      ...data.eligibility.requirements.map((item) => `- Requirement: ${clean(item)}`),
      data.officialProgrammeUrl ? `- Official programme page: ${data.officialProgrammeUrl}` : null,
      `- Last reviewed: ${data.lastReviewed}`,
      `- Full details (markdown): ${data.markdownUrl}`,
      "",
      counsellingLine(),
    ].filter((line): line is string => line !== null);
    return { ok: true, data, text: lines.join("\n") };
  }

  async function listProgrammes(input: unknown): Promise<PublicResult<ProgrammeListData>> {
    const parsed = parseInput(listProgrammesInput, input);
    if (!parsed.ok) return invalid(parsed.error);
    const { universitySlug } = parseUniversitySlug(parsed.value.universitySlug);

    const university = await source.getUniversityBySlug(universitySlug);
    if (!university) return notFound(`No published university with slug "${universitySlug}".`);
    const programs = await source.getProgramsForUniversity(university.slug);
    const programmes = programs.slice(0, PUBLIC_CATALOG_LIMITS.programmesMax).map(summarizeProgramme);
    const url = absoluteUrl(getUniversityHref(university.slug));

    const data: ProgrammeListData = {
      university: { slug: university.slug, name: university.name, url },
      total: programs.length,
      truncated: programs.length > programmes.length,
      programmes,
      counselling: getCounselling(),
      attribution: getAttribution(),
    };
    const lines = [
      `Programmes at ${university.name} (${programs.length} published): ${url}`,
      "",
      ...(programmes.length ? programmes.map((item) => programmeLine(item)) : ["No published programmes yet."]),
      ...(data.truncated
        ? ["", `Showing the first ${programmes.length} of ${programs.length}. Open ${url} for the full list.`]
        : []),
      "",
      counsellingLine(),
    ];
    return { ok: true, data, text: lines.join("\n") };
  }

  async function findProgrammes(input: unknown): Promise<PublicResult<FindProgrammesData>> {
    const parsed = parseInput(findProgrammesInput, input);
    if (!parsed.ok) return invalid(parsed.error);
    const { course, country, city, maxAnnualFeeUsd } = parsed.value;

    // Only known facet values reach the cached finder read, so its cache keys
    // stay bounded to real country x course pairs.
    const options = await source.getFinderOptions();
    if (!options.courses.some((option) => option.slug === course)) {
      return invalid(`Unknown course "${course}". Use search_catalog to find course slugs.`);
    }
    if (!options.countries.some((option) => option.slug === country)) {
      return invalid(`Unknown country "${country}". Use search_catalog to find country slugs.`);
    }

    let programs = (await source.listFinderPrograms({ course, country })).filter(
      (program) => program.course.slug === course && program.country.slug === country,
    );
    if (city) programs = programs.filter((program) => matchesFinderCity(program.university.city, city));
    if (maxAnnualFeeUsd !== undefined) {
      programs = programs
        .filter(
          (program) =>
            hasPublishedUsdAmount(program.offering.annualTuitionUsd) &&
            program.offering.annualTuitionUsd <= maxAnnualFeeUsd,
        )
        .sort((left, right) => left.offering.annualTuitionUsd - right.offering.annualTuitionUsd);
    }

    const programmes = programs.slice(0, PUBLIC_CATALOG_LIMITS.findMax).map(summarizeProgramme);
    const finderParams = new URLSearchParams({ country, course });
    if (city) finderParams.set("city", city);
    const url = absoluteUrl(`/universities?${finderParams.toString()}`);
    const data: FindProgrammesData = {
      filters: { course, country, city: city ?? null, maxAnnualFeeUsd: maxAnnualFeeUsd ?? null },
      url,
      total: programs.length,
      truncated: programs.length > programmes.length,
      programmes,
      counselling: getCounselling(),
      attribution: getAttribution(),
    };
    const lines = [
      `${programs.length} programme(s) for ${course} in ${country}${city ? ` (${city})` : ""}${maxAnnualFeeUsd ? ` at or under $${maxAnnualFeeUsd} a year` : ""}: ${url}`,
      "",
      ...(programmes.length
        ? programmes.map((item) => programmeLine(item, true))
        : ["No published programme matches. Try without the city or fee ceiling."]),
      ...(data.truncated
        ? ["", `Showing the first ${programmes.length} of ${programs.length}. Open ${url} for the full list.`]
        : []),
      "",
      counsellingLine(),
    ];
    return { ok: true, data, text: lines.join("\n") };
  }

  return {
    search_catalog: search,
    get_university: getUniversity,
    get_programme: getProgramme,
    list_programmes: listProgrammes,
    find_programmes: findProgrammes,
  } satisfies Record<PublicCatalogToolName, (input: unknown) => Promise<PublicResult<unknown>>>;
}

export type PublicCatalog = ReturnType<typeof createPublicCatalog>;
