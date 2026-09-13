import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

async function readProjectFile(relativePath: string) {
  return readFile(path.join(process.cwd(), relativePath), "utf8");
}

async function listProjectSourceFiles(relativeDir: string) {
  const entries = await readdir(path.join(process.cwd(), relativeDir), {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && /\.(?:[cm]?[jt]sx?)$/.test(entry.name))
    .map((entry) =>
      path.relative(process.cwd(), path.join(entry.parentPath, entry.name)),
    );
}

test("autocomplete uses one cached index and bounded in-memory matches", async () => {
  const source = await readProjectFile("app/api/suggestions/route.ts");

  assert.doesNotMatch(source, /getCatalogSnapshot|getProgramOfferings|getUniversities/);
  assert.match(source, /getSuggestionSource\(q\)/);
  assert.match(source, /getSuggestionIndex\(\)/);
  assert.match(source, /takeMatching\(index\.countries, 12/);
  assert.match(source, /takeMatching\(index\.courses, 20/);
  assert.equal((source.match(/takeMatching\(index\.(?:universities|indiaColleges), 40/g) ?? []).length, 2);
});

test("public sitemap and search fallbacks do not load the full catalog snapshot", async () => {
  const [sitemapSource, searchSource] = await Promise.all([
    readProjectFile("app/sitemap.ts"),
    readProjectFile("lib/search/search.ts"),
  ]);

  assert.doesNotMatch(sitemapSource, /getCatalogSnapshot/);
  assert.match(sitemapSource, /getSitemapCatalogData/);
  assert.doesNotMatch(searchSource, /getCatalogSnapshot/);
});

test("large sitemap collections use count and paginated slice queries", async () => {
  const [programSource, universitySource] = await Promise.all([
    readProjectFile("app/programs/sitemap.ts"),
    readProjectFile("app/universities/sitemap.ts"),
  ]);

  assert.match(programSource, /getPublishedProgramCount/);
  assert.match(programSource, /getProgramSitemapSlice/);
  assert.doesNotMatch(programSource, /getPublishedProgramSlugs/);
  assert.match(universitySource, /getPublishedUniversityCount/);
  assert.match(universitySource, /getUniversitySitemapSlice/);
  assert.doesNotMatch(universitySource, /getUniversities/);
});

test("university related comparisons do not scan the full program catalog", async () => {
  const source = await readProjectFile("lib/discovery-pages.ts");
  const start = source.indexOf(
    "export async function getComparisonGuidesForUniversity",
  );
  const end = source.indexOf(
    "async function buildCountryComparisonGuides",
    start,
  );
  const universityComparisonSource = source.slice(start, end);

  assert.match(
    universityComparisonSource,
    /getCachedComparisonGuidesForUniversity/,
  );
  assert.doesNotMatch(universityComparisonSource, /getCachedComparisonGuides\(\)/);
  assert.match(source, /getProgramsForUniversity\(universitySlug\)/);
});

test("comparison indexes and detail lookup avoid full-catalog program reads", async () => {
  const [discoverySource, comparePage, budgetPage] = await Promise.all([
    readProjectFile("lib/discovery-pages.ts"),
    readProjectFile("app/compare/page.tsx"),
    readProjectFile("app/budget/page.tsx"),
  ]);

  assert.doesNotMatch(discoverySource, /listFinderPrograms\(\{\}\)/);
  assert.doesNotMatch(discoverySource, /getCachedAllComparisonPages/);
  assert.match(discoverySource, /count\(\$\{programOfferingsTable\.id\}\)/);
  assert.doesNotMatch(comparePage, /connection\(\)/);
  assert.doesNotMatch(budgetPage, /connection\(\)/);
});

test("search rebuilds use projected reads and single-university publishing is incremental", async () => {
  const [searchAdmin, universitySearch, universityPublisher, catalogPublisher] =
    await Promise.all([
      readProjectFile("lib/search/admin.ts"),
      readProjectFile("lib/search/university-search-documents.ts"),
      readProjectFile("scripts/publish-university-draft.ts"),
      readProjectFile("scripts/publish-catalog-payload.ts"),
    ]);

  assert.doesNotMatch(searchAdmin, /getCatalogSnapshot/);
  // Publish scripts run outside Next.js and must stay slug-bounded.
  assert.doesNotMatch(universitySearch, /server-only|next\/cache|getCatalogSnapshot/);
  assert.match(universitySearch, /inArray\(universities\.slug, slugs\)/);
  assert.match(universitySearch, /onConflictDoUpdate/);

  for (const publisher of [universityPublisher, catalogPublisher]) {
    assert.match(publisher, /refreshSearchDocumentsForUniversities\(db, /);
    assert.doesNotMatch(publisher, /rebuildPostgresSearchIndex|buildCurrentSearchDocuments/);
  }
});

test("runtime code no longer references the removed Typesense integration", async () => {
  const directories = [
    "lib/search",
    "scripts",
    "app/_actions",
    "app/admin/(protected)/search",
  ];
  const files = [
    "lib/env.ts",
    "app/api/revalidate/route.ts",
    "package.json",
    ...(await Promise.all(directories.map(listProjectSourceFiles))).flat(),
  ];
  const sources = await Promise.all(
    files.map(async (file) => [file, await readProjectFile(file)] as const),
  );

  for (const [file, source] of sources) {
    assert.doesNotMatch(source, /typesense/i, file);
  }
});

test("program importer batches relationship lookups and uses scoped revalidation", async () => {
  const source = await readProjectFile("scripts/add-program-offerings.mjs");

  assert.match(source, /slug = ANY\(\$1::text\[\]\)/);
  assert.doesNotMatch(source, /for \(const \[index, entry\][\s\S]*SELECT id FROM universities/);
  assert.doesNotMatch(source, /\["catalog", "universities", "program-offerings", "courses"\]/);
  assert.match(source, /programSlugs: requestedProgramSlugs/);
});

test("country and course pages use narrow summaries plus bounded previews", async () => {
  const [catalogSource, countryPage, coursePage, universityPage] = await Promise.all([
    readProjectFile("lib/data/catalog.ts"),
    readProjectFile("app/countries/[slug]/page.tsx"),
    readProjectFile("app/courses/[slug]/page.tsx"),
    readProjectFile("app/university/[slug]/page.tsx"),
  ]);

  assert.doesNotMatch(catalogSource, /export async function getProgramsForCountry/);
  assert.doesNotMatch(catalogSource, /export async function getProgramsForCourse/);
  assert.match(countryPage, /getCountryProgramDirectoryRows/);
  assert.match(countryPage, /getProgramPreviewForCountry\(country\.slug, 8\)/);
  assert.match(coursePage, /getCourseProgramDirectorySummary/);
  assert.match(coursePage, /getProgramPreviewForCourse\(course\.slug, 3\)/);
  assert.match(universityPage, /queryFinderCardProgramsPage\(\{ country: countrySlug \}, 1, 13\)/);
});

test("rich catalogue caches survive unrelated publication batches", async () => {
  const [catalogSource, universityPublisher, catalogPublisher, programImporter] =
    await Promise.all([
      readProjectFile("lib/data/catalog.ts"),
      readProjectFile("scripts/publish-university-draft.ts"),
      readProjectFile("scripts/publish-catalog-payload.ts"),
      readProjectFile("scripts/add-program-offerings.mjs"),
    ]);

  const richListStart = catalogSource.indexOf(
    "export async function listFinderPrograms",
  );
  const richListEnd = catalogSource.indexOf(
    "function toFinderCardProgram",
    richListStart,
  );
  const richListSource = catalogSource.slice(richListStart, richListEnd);

  assert.doesNotMatch(richListSource, /cacheTag\("finder"\)/);
  assert.match(richListSource, /country-programs:/);
  assert.match(richListSource, /course-programs:/);
  for (const publisher of [universityPublisher, catalogPublisher, programImporter]) {
    assert.match(publisher, /country-programs:/);
    assert.match(publisher, /course-programs:/);
  }
});

test("blog index metadata does not download every article body", async () => {
  const source = await readProjectFile("lib/data/catalog.ts");
  const start = source.indexOf(
    "export async function getAllPublishedBlogPostsMetadata",
  );
  const end = source.indexOf(
    "export async function getPublishedBlogPostBySlug",
    start,
  );
  const metadataReader = source.slice(start, end);

  assert.doesNotMatch(metadataReader, /content: blogPosts\.content/);
});

test("catalogue detail pages resolve slugs at request time behind cached data reads", async () => {
  // Catalogue entities are published between deployments and only partly
  // enumerated at build. Without a request boundary, unlisted slugs inherit
  // the build fallback shell and render "not found" (2026-09-09 outage).
  const pages = await Promise.all([
    readProjectFile("app/countries/[slug]/page.tsx"),
    readProjectFile("app/courses/[slug]/page.tsx"),
    readProjectFile("app/university/[slug]/page.tsx"),
    readProjectFile("app/[slug]/page.tsx"),
    readProjectFile("app/cities/[slug]/page.tsx"),
    readProjectFile("app/blog/[slug]/page.tsx"),
  ]);

  for (const source of pages) {
    assert.match(source, /import \{ connection \} from "next\/server"/);
    assert.match(source, /await connection\(\)/);
  }

  // The boundary must not push database reads to per-request: every
  // catalogue detail page keeps its data behind "use cache".
  for (const source of pages.slice(0, 4)) {
    assert.match(source, /"use cache/);
  }
});

test("catalogue publishes never flush the whole catalogue", async () => {
  const [publisher, route, config, catalog] = await Promise.all([
    readProjectFile("scripts/publish-catalog-payload.ts"),
    readProjectFile("app/api/revalidate/route.ts"),
    readProjectFile("next.config.ts"),
    readProjectFile("lib/data/catalog.ts"),
  ]);

  assert.doesNotMatch(publisher, /\n\s*"universities",\n/);
  assert.doesNotMatch(route, /tags\.add\("countries"\)/);
  assert.doesNotMatch(route, /dynamicPagePaths\.add\("\/\[slug\]"\)/);
  // No timer-based expiry on catalogue entries: only tags refresh them.
  assert.match(config, /revalidate: 60 \* 60 \* 24 \* 365/);
  assert.doesNotMatch(
    config.slice(config.indexOf("catalog: {"), config.indexOf("},", config.indexOf("catalog: {"))),
    /expire:/,
  );
  // Sitemaps refresh on catalogue publishes.
  assert.match(route, /tags\.add\("sitemap"\)/);
  // Programme slug lookups are not on the shared program-offerings tag.
  const programReader = catalog.slice(
    catalog.indexOf("export async function getProgramBySlug"),
    catalog.indexOf("export async function getProgramsForCity"),
  );
  assert.doesNotMatch(programReader, /cacheTag\("program-offerings"\)/);
  // Slug readers cache misses only briefly.
  assert.equal(
    (catalog.match(/cacheLife\(CATALOG_MISS_CACHE_LIFE\)/g) ?? []).length,
    3,
  );
});

test("country budget add-ons use narrow summaries instead of wide program rows", async () => {
  const source = await readProjectFile("app/countries/[slug]/page.tsx");

  assert.match(source, /getBudgetGuideSummaries/);
  assert.doesNotMatch(source, /getRecommendedBudgetGuideForCourse/);
});

test("detail lookups use remotely invalidated caches", async () => {
  const source = await readProjectFile("lib/data/catalog.ts");

  const universityStart = source.indexOf("async function getCachedUniversityBySlug");
  const universityEnd = source.indexOf("export async function getCatalogLinkOptions", universityStart);
  const programStart = source.indexOf("export async function getProgramBySlug");
  const programEnd = source.indexOf("export async function getProgramsForCity", programStart);

  assert.match(source.slice(universityStart, universityEnd), /"use cache: remote"/);
  assert.match(source.slice(universityStart, universityEnd), /university:\$\{slug\}/);
  assert.match(source.slice(programStart, programEnd), /"use cache: remote"/);
  assert.match(source.slice(programStart, programEnd), /program:\$\{programSlug\}/);
});

test("sitemap does not opt into request-time rendering with a bare current date", async () => {
  const source = await readProjectFile("app/sitemap.ts");
  assert.doesNotMatch(source, /new Date\(\)/);
});

test("attribution cookies are bounded and absent campaign keys are expired", async () => {
  const source = await readProjectFile("components/site/attribution-tracking.tsx");

  assert.match(source, /MAX_URL_LENGTH = 1024/);
  assert.match(source, /MAX_CAMPAIGN_VALUE_LENGTH = 256/);
  assert.match(source, /function deleteCookie/);
  assert.doesNotMatch(source, /setCookie\(key, searchParams\.get\(key\) \?\? ""/);
});

test("section shells keep rich models server-side and send only the active section", async () => {
  const [universityShell, universityClient, programShell, programClient] =
    await Promise.all([
      readProjectFile("components/site/university/section-shell.tsx"),
      readProjectFile("components/site/university/section-shell-client.tsx"),
      readProjectFile("components/site/university/program-section-shell.tsx"),
      readProjectFile("components/site/university/program-section-shell-client.tsx"),
    ]);

  assert.doesNotMatch(universityShell, /^"use client"/);
  assert.match(universityClient, /^"use client"/);
  assert.doesNotMatch(universityClient, /FinderProgram|\bUniversity\b|\bCountry\b/);
  assert.match(universityShell, /content=\{content\}/);
  assert.doesNotMatch(universityClient, /programsContent|studentLifeContent|hostelContent|faqContent/);

  assert.doesNotMatch(programShell, /^"use client"/);
  assert.match(programClient, /^"use client"/);
  assert.doesNotMatch(programClient, /FinderProgram|CountryContent|RegulatoryAdvisory/);
  assert.match(programShell, /content=\{content\}/);
  assert.doesNotMatch(programClient, /academicsContent|admissionsContent|eligibilityContent|feesContent|recognitionContent/);
});

test("public client payloads exclude unused global and worldwide datasets", async () => {
  const [layout, indiaCities, categoryPage, mobileUniversities] = await Promise.all([
    readProjectFile("app/layout.tsx"),
    readProjectFile("lib/data/india-cities.ts"),
    readProjectFile("app/blog/category/[slug]/page.tsx"),
    readProjectFile("app/api/mobile/v1/universities/route.ts"),
  ]);

  assert.doesNotMatch(layout, /NavUniversitiesClientProvider|getNavUniversitiesByCountry/);
  assert.doesNotMatch(indiaCities, /from ["']country-state-city["']|require\(["']country-state-city["']\)/);
  assert.match(indiaCities, /CITIES_BY_STATE/);
  assert.doesNotMatch(categoryPage, /blogPosts\.content|readingTime\(/);
  assert.match(categoryPage, /blogPosts\.readingTimeMinutes/);
  assert.match(mobileUniversities, /Math\.trunc\(requestedPageSize\)/);
  assert.match(mobileUniversities, /Math\.max\([^,]+, 1\)/);
});

test("social cards use a static CDN asset instead of dynamic ImageResponse routes", async () => {
  const source = await readProjectFile("lib/metadata.ts");

  assert.match(source, /return "\/images\/home\/apply-confidence\.jpg"/);
  assert.doesNotMatch(source, /return `\$\{path\}\/opengraph-image`/);
});

test("background-job fallback cron does not force a fifteen-minute database wake-up", async () => {
  const config = await readProjectFile("vercel.json");
  assert.match(config, /"schedule": "\*\/30 \* \* \* \*"/);
  assert.doesNotMatch(config, /"schedule": "\*\/15 \* \* \* \*"/);
});

test("high-cardinality directories progressively load bounded batches", async () => {
  const [comparePage, coursePage, compareApi, courseApi] = await Promise.all([
    readProjectFile("app/compare/page.tsx"),
    readProjectFile("app/courses/page.tsx"),
    readProjectFile("app/api/comparisons/route.ts"),
    readProjectFile("app/api/courses-directory/route.ts"),
  ]);

  assert.match(comparePage, /slice\(0, initialComparisonCount\)/);
  assert.match(coursePage, /courseCards\.slice\(0, 24\)/);
  assert.match(compareApi, /const PAGE_SIZE = 24/);
  assert.match(courseApi, /const pageSize = 24/);
});

test("finder query limits are finite and centrally bounded", async () => {
  const source = await readProjectFile("lib/data/catalog.ts");
  const start = source.indexOf("async function executeFinderCardProgramsPage");
  const end = source.indexOf("export async function getFinderOptions", start);
  const finderPageSource = source.slice(start, end);

  assert.match(finderPageSource, /Number\.isFinite\(pageSize\)/);
  assert.match(finderPageSource, /Math\.min\(Math\.max\(Math\.floor\(pageSize\), 1\), 100\)/);
  assert.match(finderPageSource, /pageSize: safePageSize/);
});

// Tags that expire a whole dataset. The first four regenerate the entire
// catalogue against Neon (2026-09-09 outage).
const SHARED_CATALOGUE_TAGS = ["catalog", "universities", "countries", "courses"];
const DATASET_WIDE_TAGS = [
  ...SHARED_CATALOGUE_TAGS,
  "study-abroad-guides",
  "india-medical-colleges",
  "india-medical-programs",
  "india-mbbs-finder",
];

// Scripts allowed to expire dataset-wide tags. Every entry also needs a
// "// Global refresh:" comment in the script saying why entity tags are not
// enough. No script is allow-listed for the shared catalogue tags.
const GLOBAL_REFRESH_ALLOW_LIST: Record<string, string[]> = {
  // A bulk India MBBS import rewrites rows across the whole India dataset.
  "scripts/import-india-mbbs-colleges.ts": [
    "india-medical-colleges",
    "india-medical-programs",
    "india-mbbs-finder",
  ],
  "scripts/import-india-medical-programs.ts": [
    "india-medical-colleges",
    "india-medical-programs",
    "india-mbbs-finder",
  ],
  // Seeding more than GUIDE_TAG_LIMIT guides expires the small guide table's tag.
  "scripts/migrate-study-abroad-guides-to-db.ts": ["study-abroad-guides"],
};

const REVALIDATE_SCOPES = /^(?:blog|catalog|guide|exact)$/;

function extractCallArguments(source: string, callee: string) {
  const calls: string[] = [];
  let start = source.indexOf(`${callee}(`);
  while (start !== -1) {
    const open = start + callee.length;
    let depth = 0;
    let end = open;
    for (; end < source.length; end += 1) {
      if (source[end] === "(") depth += 1;
      if (source[end] === ")") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    calls.push(source.slice(open + 1, end));
    start = source.indexOf(`${callee}(`, end);
  }
  return calls;
}

function plainStringLiterals(text: string) {
  // Double, single or backtick strings without interpolation, on one line.
  return [...text.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`$\n]*)`/g)].map(
    (match) => match[1] ?? match[2] ?? match[3],
  );
}

test("scripts never send shared catalogue cache tags outside allow-listed global refreshes", async () => {
  const helper = await readProjectFile("scripts/lib/trigger-revalidate.ts");
  // No implicit scope: the old default silently added catalogue-wide work.
  assert.doesNotMatch(helper, /options\.scope \?\?/);
  assert.match(helper, /scope: "blog" \| "catalog" \| "guide" \| "exact";/);
  assert.match(helper, /Refusing to expire shared cache tag/);

  const files = (await listProjectSourceFiles("scripts"))
    .map((file) => file.split(path.sep).join("/"))
    .filter((file) => file !== "scripts/lib/trigger-revalidate.ts");
  const sentByFile = new Map<string, string[]>();

  for (const file of files) {
    const source = await readProjectFile(file);
    const calls = extractCallArguments(source, "triggerRevalidate");
    const sendsDirectly = source.includes("/api/revalidate");
    if (calls.length === 0 && !sendsDirectly) continue;

    const sentTags: string[] = [];
    for (const call of calls) {
      const scope = call.match(/scope: "([^"]+)"/)?.[1];
      assert.ok(scope && REVALIDATE_SCOPES.test(scope), `${file}: triggerRevalidate needs an explicit scope`);
      if (scope === "catalog") {
        // Without a target the route expires every catalogue route pattern.
        assert.match(call, /\b(?:slugs|paths):/, `${file}: scope "catalog" must target slugs or paths`);
      }
      sentTags.push(...plainStringLiterals(call.replace(/scope: "[^"]*"/g, "")));
    }

    if (sendsDirectly) {
      for (const match of source.matchAll(/\/api\/revalidate([^"'`]*)/g)) {
        const scope = match[1].match(/[?&]scope=([\w-]+)/)?.[1];
        assert.ok(scope && REVALIDATE_SCOPES.test(scope), `${file}: /api/revalidate needs an explicit scope`);
        if (scope === "catalog") {
          assert.match(source, /append\(\s*"(?:path|slug)"/, `${file}: scope=catalog must target slugs or paths`);
        }
      }
      for (const match of source.matchAll(/append\(\s*"tag",\s*(["'`])([^"'`$]*)\1\s*\)/g)) {
        sentTags.push(match[2]);
      }
      for (const match of source.matchAll(/[?&]tag=([\w:-]+)/g)) sentTags.push(match[1]);
    }

    sentByFile.set(file, sentTags);
    const allowed = GLOBAL_REFRESH_ALLOW_LIST[file] ?? [];
    for (const tag of sentTags.filter((tag) => DATASET_WIDE_TAGS.includes(tag))) {
      assert.ok(allowed.includes(tag), `${file} sends dataset-wide cache tag "${tag}" without an allow-list entry`);
    }
  }

  // The scan must actually see the revalidating scripts.
  assert.ok(sentByFile.size >= 8, `only ${sentByFile.size} revalidating scripts found`);

  for (const [file, tags] of Object.entries(GLOBAL_REFRESH_ALLOW_LIST)) {
    const source = await readProjectFile(file);
    assert.match(source, /\/\/ Global refresh: \S/, `${file}: allow-listed refresh needs a justification comment`);
    for (const tag of tags) {
      assert.ok(sentByFile.get(file)?.includes(tag), `${file}: stale allow-list entry "${tag}"`);
    }
  }
});

test("guide syncs expire only the guides they change", async () => {
  const [route, reader, sync] = await Promise.all([
    readProjectFile("app/api/revalidate/route.ts"),
    readProjectFile("lib/data/study-abroad-guides-db.ts"),
    readProjectFile("scripts/migrate-study-abroad-guides-to-db.ts"),
  ]);

  const guideReader = reader.slice(reader.indexOf("export async function getStudyAbroadGuideBySlug"));
  assert.match(guideReader, /cacheTag\(`guide:\$\{slug\}`\)/);

  const guideBranch = route.slice(
    route.indexOf('if (scope === "guide")'),
    route.indexOf('if (scope === "catalog")'),
  );
  assert.match(guideBranch, /tags\.add\(`guide:\$\{slug\}`\)/);
  assert.doesNotMatch(guideBranch, /dynamicPagePaths|tags\.add\("/);

  const syncCalls = extractCallArguments(sync, "triggerRevalidate");
  assert.equal(syncCalls.length, 1);
  assert.match(syncCalls[0], /scope: "guide"/);
  assert.doesNotMatch(syncCalls[0], /"catalog"/);
});
