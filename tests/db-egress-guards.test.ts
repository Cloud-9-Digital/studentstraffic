import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

async function readProjectFile(relativePath: string) {
  return readFile(path.join(process.cwd(), relativePath), "utf8");
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
  const [searchAdmin, universityPublisher, catalogPublisher] = await Promise.all([
    readProjectFile("lib/search/admin.ts"),
    readProjectFile("scripts/publish-university-draft.ts"),
    readProjectFile("scripts/publish-catalog-payload.ts"),
  ]);

  assert.doesNotMatch(searchAdmin, /getCatalogSnapshot/);
  assert.match(searchAdmin, /syncTypesenseSearchForUniversities/);
  assert.doesNotMatch(universityPublisher, /syncTypesenseSearchIndex/);
  assert.match(universityPublisher, /syncTypesenseSearchForUniversities/);
  assert.match(catalogPublisher, /syncTypesenseSearch\(\)/);
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

test("complete catalog pages stay cacheable while capped catalogs resolve at request time", async () => {
  const [countryPage, coursePage, universityPage, ...cappedPages] = await Promise.all([
    readProjectFile("app/countries/[slug]/page.tsx"),
    readProjectFile("app/courses/[slug]/page.tsx"),
    readProjectFile("app/university/[slug]/page.tsx"),
    readProjectFile("app/cities/[slug]/page.tsx"),
    readProjectFile("app/blog/[slug]/page.tsx"),
  ]);

  for (const source of [countryPage, coursePage, universityPage]) {
    assert.doesNotMatch(source, /from "next\/server"/);
    assert.doesNotMatch(source, /await connection\(\)/);
  }

  for (const source of cappedPages) {
    assert.match(source, /from "next\/server"/);
    assert.match(source, /await connection\(\)/);
  }
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
