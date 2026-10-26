import assert from "node:assert/strict";
import test from "node:test";

import type { Country, FinderOptions, FinderProgram, University } from "@/lib/data/types";
import { absoluteUrl } from "@/lib/metadata";
import {
  PUBLIC_CATALOG_LIMITS,
  PUBLIC_CATALOG_TOOLS,
  PUBLIC_CATALOG_VERSION,
  createPublicCatalog,
  type PublicCatalogSource,
} from "@/lib/public-catalog-api";
import {
  API_CATALOG_CONTENT_TYPE,
  buildApiCatalog,
  buildServerCard,
} from "@/lib/public-catalog-discovery";
import { registerPublicCatalogTools } from "@/lib/public-catalog-mcp";
import {
  apiCatalogHeadResponse,
  apiCatalogResponse,
  serverCardResponse,
} from "@/lib/public-catalog-routes";
import type { Suggestion } from "@/lib/search/suggestions";

const india = { slug: "india", name: "India", region: "Asia" } as Country;

const university = {
  slug: "example-university",
  name: "Example University",
  city: "Chennai",
  countrySlug: "india",
  type: "Private",
  establishedYear: 1990,
  summary: "Example University is a private university in Chennai.",
  officialWebsite: "https://example.edu",
  recognitionBadges: ["UGC - Listed private university"],
  recognitionLinks: [],
  whyChoose: [],
  thingsToConsider: [],
  bestFitFor: [],
  faq: [],
  researchSources: [],
  researchNotes: "INTERNAL research note",
  lastVerifiedAt: "2026-10-01",
} as unknown as University;

function makeProgram(slug: string, offering: Record<string, unknown> = {}): FinderProgram {
  return {
    country: india,
    university,
    course: { slug: "mbbs", name: "Bachelor of Medicine, Bachelor of Surgery", shortName: "MBBS" },
    offering: {
      slug,
      title: "MBBS",
      durationYears: 5.5,
      annualTuitionUsd: 0,
      totalTuitionUsd: 0,
      livingUsd: 0,
      officialFeeCurrency: "INR",
      officialAnnualTuitionAmount: 195000,
      feeStatus: "confirmed",
      feeAudience: "domestic",
      additionalFees: [{ audience: "international", annualAmount: 4000, currency: "USD" }],
      medium: "English",
      intakeMonths: [],
      intakeCodes: ["august"],
      professionalExamSupport: [],
      yearlyCostBreakdown: [],
      teachingPhases: [],
      sourceUrls: [],
      officialProgramUrl: "https://example.edu/mbbs",
      audienceEligibility: {
        availability: "global",
        eligibleAudiences: ["Indian students with NEET"],
        restrictions: [],
        verifiedAt: "2026-10-01",
        sourceUrl: "https://example.edu/eligibility",
      },
      ...offering,
    },
  } as unknown as FinderProgram;
}

const mbbs = makeProgram("example-university-mbbs");
const reported = makeProgram("example-university-bds", {
  title: "BDS",
  feeStatus: "on_request",
  feeAudience: undefined,
  additionalFees: [],
  officialAnnualTuitionAmount: undefined,
  reportedFeeQuote: {
    currency: "INR", minAmount: 45000, maxAmount: 90000, status: "indicative", period: "academic_year",
    componentBasis: "Combined compulsory course fees.", academicYear: "2026", sourceUrl: "https://example.edu/q", sourceLabel: "Fee notice", verifiedAt: "2026-10-25",
  },
});
const cheap = makeProgram("cheap-mbbs", { annualTuitionUsd: 3000, feeAudience: "international", additionalFees: [] });
const pricey = makeProgram("pricey-mbbs", { annualTuitionUsd: 9000, feeAudience: "international", additionalFees: [] });

const calls: string[] = [];
const source: PublicCatalogSource = {
  async search(query, limit) {
    calls.push(`search:${query}:${limit}`);
    const suggestions: Suggestion[] = [
      { type: "university", label: "Example University", subtitle: "Chennai, India", href: "/university/example-university" },
      { type: "india_college", label: "Example Medical College", subtitle: "Chennai, Tamil Nadu", href: "/india-mbbs-colleges?q=Example%20Medical%20College" },
      { type: "country", label: "Study in India", subtitle: "Asia", href: "/countries/india" },
      ...Array.from({ length: 10 }, (_, index) => ({
        type: "course" as const,
        label: `Course ${index}`,
        subtitle: "Course",
        href: `/courses/course-${index}`,
      })),
    ];
    return suggestions;
  },
  async getUniversityBySlug(slug) {
    return slug === university.slug ? university : null;
  },
  async getCountryBySlug(slug) {
    return slug === "india" ? india : null;
  },
  async getProgramsForUniversity(slug) {
    return slug === university.slug ? [mbbs, reported] : [];
  },
  async getProgramBySlug(slug) {
    return [mbbs, reported].find((program) => program.offering.slug === slug) ?? null;
  },
  async getFinderOptions() {
    return {
      countries: [{ slug: "india", name: "India" }],
      cities: [],
      levels: [],
      courses: [{ slug: "mbbs", shortName: "MBBS" }],
      mediums: [],
      intakes: [],
    } satisfies FinderOptions;
  },
  async listFinderPrograms(filters) {
    calls.push(`finder:${JSON.stringify(filters)}`);
    return [pricey, mbbs, cheap, ...Array.from({ length: 12 }, (_, index) => makeProgram(`extra-${index}`))];
  },
};

const catalog = createPublicCatalog(source);
const counsellingUrl = absoluteUrl("/contact");

test("search returns at most five matches with absolute URLs, slugs and counselling", async () => {
  const result = await catalog.search_catalog({ query: "  example " });
  assert.ok(result.ok);
  assert.equal(result.data.query, "example");
  assert.equal(result.data.results.length, PUBLIC_CATALOG_LIMITS.searchMax);
  assert.equal(PUBLIC_CATALOG_LIMITS.searchMax, 5);
  assert.deepEqual(result.data.results[0], {
    type: "university",
    name: "Example University",
    subtitle: "Chennai, India",
    slug: "example-university",
    url: absoluteUrl("/university/example-university"),
  });
  // A query-string page has no slug.
  assert.equal(result.data.results[1].slug, null);
  assert.equal(result.data.counselling.url, counsellingUrl);
  assert.ok(result.text.includes(counsellingUrl));
  assert.ok(calls.includes("search:example:5"));
  // The caller cannot raise the cap.
  const raised = await catalog.search_catalog({ query: "example", limit: 500 });
  assert.ok(raised.ok);
  assert.equal(raised.data.results.length, 5);
});

test("inputs are validated before any read", async () => {
  const before = calls.length;
  for (const input of [
    { query: "x" },
    { query: "" },
    { query: "   " },
    { query: "*" },
    { query: "%%" },
    { query: "med*" },
    { query: "--" },
    { query: "a".repeat(101) },
    {},
  ]) {
    const result = await catalog.search_catalog(input);
    assert.equal(result.ok, false);
    assert.equal(!result.ok && result.status, 400);
  }
  for (const slug of ["../etc/passwd", "Has Space", "UPPER", "a".repeat(201), "", "*", "mbbs-*"]) {
    const result = await catalog.get_university({ slug });
    assert.equal(!result.ok && result.status, 400, slug);
  }
  assert.equal(calls.length, before);
});

test("an unknown or unpublished slug is a 404 that points to search", async () => {
  const result = await catalog.get_programme({ slug: "no-such-programme" });
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.status, 404);
  assert.match(result.text, /search_catalog/);
});

test("university profile is the markdown view with whitelisted fields only", async () => {
  const result = await catalog.get_university({ slug: "example-university-faq" });
  assert.ok(result.ok);
  assert.equal(result.data.slug, "example-university");
  assert.equal(result.data.url, absoluteUrl("/university/example-university"));
  assert.equal(result.data.markdownUrl, absoluteUrl("/university/example-university.md"));
  assert.equal(result.data.programmeCount, 2);
  assert.match(result.text, /^# Example University\n/);
  assert.match(result.text, /## Free counselling/);
  const json = JSON.stringify(result.data);
  assert.doesNotMatch(json, /INTERNAL|researchNotes|"id"/);
});

test("every fee carries the site's label: audience, quota or Approx. fees", async () => {
  const result = await catalog.list_programmes({ universitySlug: "example-university" });
  assert.ok(result.ok);
  const [first, second] = result.data.programmes;
  assert.deepEqual(first.fees, [
    { label: "Indian students", amount: "₹1,95,000" },
    { label: "NRI & international", amount: "$4,000" },
  ]);
  assert.equal(second.fees[0].label, "Approx. fees");
  assert.equal(second.feesAreIndicative, true);
  for (const programme of result.data.programmes) {
    for (const fee of programme.fees) assert.ok(fee.label.length > 0 && fee.amount.length > 0);
  }
  assert.match(result.text, /Indian students: ₹1,95,000 · NRI & international: \$4,000/);
  assert.match(result.text, /Approx\. fees: ₹45,000–₹90,000 \/ year \(indicative\)/);
  assert.match(result.text, /http:\/\/localhost:3000\/example-university-mbbs/);
});

test("a quota name replaces the audience label", async () => {
  const quota = makeProgram("quota-mbbs", { feeCategory: "Government quota", additionalFees: [] });
  const quotaCatalog = createPublicCatalog({ ...source, getProgramBySlug: async () => quota });
  const result = await quotaCatalog.get_programme({ slug: "quota-mbbs" });
  assert.ok(result.ok);
  assert.deepEqual(result.data.fees, [{ label: "Government quota", amount: "₹1,95,000" }]);
  assert.match(result.text, /Fees: Government quota: ₹1,95,000/);
});

test("programme detail has duration, medium, intakes, eligibility, page and counselling", async () => {
  const result = await catalog.get_programme({ slug: "example-university-mbbs-fees" });
  assert.ok(result.ok);
  assert.equal(result.data.slug, "example-university-mbbs");
  assert.equal(result.data.medium, "English");
  assert.deepEqual(result.data.intakes, ["August"]);
  assert.deepEqual(result.data.eligibility.eligibleAudiences, ["Indian students with NEET"]);
  assert.equal(result.data.counselling.url, counsellingUrl);
  assert.match(result.text, /- Page: http:\/\/localhost:3000\/example-university-mbbs/);
  assert.match(result.text, /- Duration: /);
  assert.match(result.text, /Free admission counselling: /);
});

test("find_programmes needs a course and a country, queries known facets and caps at ten", async () => {
  const missing = await catalog.find_programmes({ course: "mbbs" });
  assert.equal(!missing.ok && missing.status, 400);
  const all = await catalog.find_programmes({ course: "mbbs", country: "india" });
  assert.ok(all.ok);
  assert.equal(all.data.programmes.length, 10);
  assert.equal(all.data.truncated, true);
  assert.match(all.text, /Open http:\/\/localhost:3000\/universities\?country=india&course=mbbs for the full list/);

  const unknown = await catalog.find_programmes({ course: "mbbs", country: "atlantis" });
  assert.equal(!unknown.ok && unknown.status, 400);
  assert.ok(!calls.some((call) => call.includes("atlantis")));

  const result = await catalog.find_programmes({ course: "mbbs", country: "india", maxAnnualFeeUsd: 10000 });
  assert.ok(result.ok);
  assert.deepEqual(result.data.programmes.map((item) => item.slug), ["cheap-mbbs", "pricey-mbbs"]);
  assert.equal(result.data.total, 2);
  assert.ok(calls.includes(`finder:${JSON.stringify({ course: "mbbs", country: "india" })}`));
});

test("list sizes are capped", async () => {
  const many = Array.from({ length: PUBLIC_CATALOG_LIMITS.programmesMax + 5 }, (_, index) => makeProgram(`p-${index}`));
  const big = createPublicCatalog({ ...source, getProgramsForUniversity: async () => many });
  const result = await big.list_programmes({ universitySlug: "example-university" });
  assert.ok(result.ok);
  assert.equal(result.data.programmes.length, PUBLIC_CATALOG_LIMITS.programmesMax);
  assert.equal(result.data.total, many.length);
  assert.equal(result.data.truncated, true);
  assert.equal(PUBLIC_CATALOG_LIMITS.programmesMax, 25);
  assert.match(result.text, /Showing the first 25 of 30\. Open http:\/\/localhost:3000\/university\/example-university for the full list\./);
});

test("server card names the endpoint, transport, capabilities and every tool", () => {
  const card = buildServerCard();
  const endpoint = absoluteUrl("/mcp");
  assert.equal(card.$schema, "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json");
  assert.match(card.name, /^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/);
  assert.deepEqual(card.serverInfo, { name: card.name, title: card.title, version: PUBLIC_CATALOG_VERSION });
  assert.deepEqual(card.remotes.map((remote) => [remote.type, remote.url]), [["streamable-http", endpoint]]);
  assert.deepEqual(card.transport, { type: "streamable-http", endpoint });
  assert.deepEqual(Object.keys(card.capabilities), ["tools"]);
  assert.deepEqual(card.tools.map((tool) => tool.name), PUBLIC_CATALOG_TOOLS.map((tool) => tool.name));
  for (const tool of card.tools) {
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.inputSchema.type, "object");
  }
});

test("server card is served as cacheable JSON with open CORS", async () => {
  const response = serverCardResponse();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json");
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.ok(response.headers.get("etag"));
  assert.deepEqual(await response.json(), JSON.parse(JSON.stringify(buildServerCard())));
});

test("API catalog is an RFC 9727 linkset listing only the MCP server", async () => {
  const response = apiCatalogResponse(true);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), API_CATALOG_CONTENT_TYPE);
  assert.match(response.headers.get("content-type") ?? "", /^application\/linkset\+json; profile="https:\/\/www\.rfc-editor\.org\/info\/rfc9727"$/);
  const head = apiCatalogHeadResponse(true);
  assert.equal(head.status, 200);
  assert.equal(head.body, null);
  assert.match(head.headers.get("link") ?? "", /\/\.well-known\/api-catalog>; rel="api-catalog"/);

  const { linkset } = (await response.json()) as ReturnType<typeof buildApiCatalog>;
  assert.equal(linkset.length, 1);
  const [mcp] = linkset;
  assert.equal(mcp.anchor, absoluteUrl("/mcp"));
  assert.equal(mcp["service-desc"][0].href, absoluteUrl("/.well-known/mcp/server-card.json"));
  assert.equal(mcp["service-doc"][0].href, absoluteUrl("/ai-access"));
  assert.equal(mcp.status[0].href, absoluteUrl("/mcp/health"));
  assert.doesNotMatch(JSON.stringify(linkset), /api\/public|openapi/);
});

test("the kill switch withdraws the server card and the API catalog", async () => {
  assert.equal(serverCardResponse(false).status, 404);
  assert.equal(apiCatalogResponse(false).status, 404);
  assert.equal(apiCatalogHeadResponse(false).status, 404);
});

test("MCP tools are read-only and log one line per call without arguments", async () => {
  const registered: Array<{ name: string; config: { annotations: Record<string, unknown> }; handler: (args: unknown) => Promise<{ content: Array<{ text: string }>; isError?: boolean }> }> = [];
  const fakeServer = {
    registerTool(name: string, config: never, handler: never) {
      registered.push({ name, config, handler });
    },
  };
  const logs: Array<Record<string, unknown>> = [];
  registerPublicCatalogTools(fakeServer as never, catalog, (event) => logs.push(event));
  assert.deepEqual(registered.map((tool) => tool.name), PUBLIC_CATALOG_TOOLS.map((tool) => tool.name));
  for (const tool of registered) {
    assert.equal(tool.config.annotations.readOnlyHint, true);
    assert.equal(tool.config.annotations.destructiveHint, false);
  }

  const search = registered.find((tool) => tool.name === "search_catalog")!;
  const secret = "Priya Sharma priya@example.com";
  const ok = await search.handler({ query: secret });
  assert.ok(!ok.isError);
  const bad = await search.handler({ query: "*" });
  assert.equal(bad.isError, true);
  assert.equal(logs.length, 2);
  assert.equal(logs[0].event, "mcp_tool_call");
  assert.equal(logs[0].tool, "search_catalog");
  assert.equal(logs[0].ok, true);
  assert.equal(typeof logs[0].latencyMs, "number");
  assert.equal(logs[0].resultItems, 5);
  assert.equal(logs[1].status, 400);
  assert.doesNotMatch(JSON.stringify(logs), /Priya|example\.com/);
});

test("a data-layer failure never reaches the caller", async () => {
  const failing = createPublicCatalog({
    ...source,
    getUniversityBySlug: async () => {
      throw new Error('Failed query: select "universities"."slug" from "universities" params: secret');
    },
  });
  const registered: Array<{ name: string; handler: (args: unknown) => Promise<{ content: Array<{ text: string }>; isError?: boolean }> }> = [];
  const logs: Array<Record<string, unknown>> = [];
  registerPublicCatalogTools(
    { registerTool: (name: string, _config: never, handler: never) => registered.push({ name, handler }) } as never,
    failing,
    (event) => logs.push(event),
  );
  const result = await registered.find((tool) => tool.name === "get_university")!.handler({ slug: "example-university" });
  assert.equal(result.isError, true);
  assert.doesNotMatch(result.content[0].text, /select|Failed query|secret/);
  assert.equal(logs[0].event, "mcp_tool_error");
  assert.doesNotMatch(JSON.stringify(logs), /select|secret/);
});
