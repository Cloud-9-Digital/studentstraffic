import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

async function readProjectFile(relativePath: string) {
  return readFile(path.join(process.cwd(), relativePath), "utf8");
}

test("autocomplete uses bounded, query-scoped database reads", async () => {
  const source = await readProjectFile("app/api/suggestions/route.ts");

  assert.doesNotMatch(source, /getCatalogSnapshot|getProgramOfferings|getUniversities/);
  assert.match(source, /getSuggestionSource\(q\)/);
  assert.match(source, /\.limit\(12\)/);
  assert.match(source, /\.limit\(20\)/);
  assert.equal((source.match(/\.limit\(40\)/g) ?? []).length, 2);
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
