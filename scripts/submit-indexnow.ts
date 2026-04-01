import "dotenv/config";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { eq } from "drizzle-orm";

import { landingPages } from "@/lib/data/landing-pages";
import { getLatestDate, isDateOnOrAfter, toDateValue } from "@/lib/content-dates";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import type {
  Country,
  Course,
  FinderProgram,
  ProgramOffering,
  University,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/core";
import {
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
} from "@/lib/db/schema";
import { buildIndexNowPayload } from "@/lib/indexnow";
import { absoluteUrl } from "@/lib/metadata";
import {
  getBudgetGuideHref,
  getComparisonHref,
  getCountryHref,
  getCourseHref,
  getLandingPageHref,
  getUniversityHref,
} from "@/lib/routes";
import { getSortableUsdValue, hasPublishedUsdAmount } from "@/lib/utils";

type CatalogSnapshot = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
};

type ComparisonGuide = {
  slug: string;
  left: FinderProgram;
  right: FinderProgram;
};

type BudgetGuide = {
  slug: string;
  budgetUsd: number;
  course: Course;
  programs: FinderProgram[];
};

type UrlEntry = {
  url: string;
  lastModified?: Date;
};

type IndexNowState = {
  lastSuccessfulSubmissionAt: string;
};

type CliOptions = {
  all: boolean;
  dryRun: boolean;
  help: boolean;
  since?: Date;
  urlInputs: string[];
  filePath?: string;
  stateFile: string;
};

function uniqueValues<T>(items: T[]) {
  return [...new Set(items)];
}

function parseDateFlag(value: string) {
  const date = toDateValue(value);

  if (!date) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return date;
}

function readFlagValue(args: string[], index: number, flag: string) {
  const value = args[index + 1];

  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

function parseCliOptions(args: string[]): CliOptions {
  const options: CliOptions = {
    all: false,
    dryRun: false,
    help: false,
    urlInputs: [],
    stateFile: path.join(process.cwd(), ".indexnow", "state.json"),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--all") {
      options.all = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--since") {
      options.since = parseDateFlag(readFlagValue(args, index, "--since"));
      index += 1;
      continue;
    }

    if (arg.startsWith("--since=")) {
      options.since = parseDateFlag(arg.slice("--since=".length));
      continue;
    }

    if (arg === "--url") {
      options.urlInputs.push(readFlagValue(args, index, "--url"));
      index += 1;
      continue;
    }

    if (arg.startsWith("--url=")) {
      options.urlInputs.push(arg.slice("--url=".length));
      continue;
    }

    if (arg === "--file") {
      options.filePath = readFlagValue(args, index, "--file");
      index += 1;
      continue;
    }

    if (arg.startsWith("--file=")) {
      options.filePath = arg.slice("--file=".length);
      continue;
    }

    if (arg === "--state-file") {
      options.stateFile = path.resolve(
        process.cwd(),
        readFlagValue(args, index, "--state-file")
      );
      index += 1;
      continue;
    }

    if (arg.startsWith("--state-file=")) {
      options.stateFile = path.resolve(
        process.cwd(),
        arg.slice("--state-file=".length)
      );
      continue;
    }

    throw new Error(`Unknown flag: ${arg}`);
  }

  if (options.all && options.since) {
    throw new Error("Use either --all or --since, not both.");
  }

  if ((options.all || options.since) && (options.urlInputs.length || options.filePath)) {
    throw new Error("Use manual URL inputs separately from --all or --since.");
  }

  return options;
}

function printUsage() {
  console.log(`Usage:
  npm run seo:indexnow -- --all
  npm run seo:indexnow -- --since=2026-03-27
  npm run seo:indexnow -- --url=/mbbs-in-vietnam --url=/universities/can-tho-university-medicine-pharmacy
  npm run seo:indexnow -- --file=.indexnow/changed-urls.txt

Notes:
  - With no flags, the script submits URLs changed since the last successful run.
  - Use --all for an intentional full-site submission.
  - Manual URL inputs accept absolute URLs or site-relative paths.`);
}

async function readState(stateFile: string) {
  try {
    const raw = await readFile(stateFile, "utf8");
    return JSON.parse(raw) as IndexNowState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeState(stateFile: string, state: IndexNowState) {
  await mkdir(path.dirname(stateFile), { recursive: true });
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function normalizeUrlInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return absoluteUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
}

async function readManualUrls(filePath?: string) {
  const fileUrls = filePath
    ? (await readFile(path.resolve(process.cwd(), filePath), "utf8"))
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  return fileUrls;
}

async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is required. Add it to .env before running this script.");
  }

  const [countryRows, courseRows, universityRows, programRows] = await Promise.all([
    db.select().from(countriesTable),
    db.select().from(coursesTable),
    db
      .select({
        id: universitiesTable.id,
        countryId: universitiesTable.countryId,
        slug: universitiesTable.slug,
        name: universitiesTable.name,
        city: universitiesTable.city,
        type: universitiesTable.type,
        establishedYear: universitiesTable.establishedYear,
        summary: universitiesTable.summary,
        featured: universitiesTable.featured,
        published: universitiesTable.published,
        officialWebsite: universitiesTable.officialWebsite,
        logoUrl: universitiesTable.logoUrl,
        coverImageUrl: universitiesTable.coverImageUrl,
        campusLifestyle: universitiesTable.campusLifestyle,
        cityProfile: universitiesTable.cityProfile,
        clinicalExposure: universitiesTable.clinicalExposure,
        hostelOverview: universitiesTable.hostelOverview,
        indianFoodSupport: universitiesTable.indianFoodSupport,
        safetyOverview: universitiesTable.safetyOverview,
        studentSupport: universitiesTable.studentSupport,
        whyChoose: universitiesTable.whyChoose,
        thingsToConsider: universitiesTable.thingsToConsider,
        bestFitFor: universitiesTable.bestFitFor,
        teachingHospitals: universitiesTable.teachingHospitals,
        recognitionBadges: universitiesTable.recognitionBadges,
        recognitionLinks: universitiesTable.recognitionLinks,
        faq: universitiesTable.faq,
        similarUniversitySlugs: universitiesTable.similarUniversitySlugs,
        lastVerifiedAt: universitiesTable.lastVerifiedAt,
        researchSources: universitiesTable.researchSources,
        researchNotes: universitiesTable.researchNotes,
        updatedAt: universitiesTable.updatedAt,
      })
      .from(universitiesTable)
      .where(eq(universitiesTable.published, true)),
    db
      .select()
      .from(programOfferingsTable)
      .where(eq(programOfferingsTable.published, true)),
  ]);

  const countries: Country[] = countryRows.map((country) => ({
    slug: country.slug,
    name: country.name,
    region: country.region,
    summary: country.summary,
    whyStudentsChooseIt: country.whyStudentsChooseIt,
    climate: country.climate,
    currencyCode: country.currencyCode,
    metaTitle: country.metaTitle,
    metaDescription: country.metaDescription,
    updatedAt: country.updatedAt?.toISOString(),
  }));

  const courses: Course[] = courseRows.map((course) => ({
    slug: course.slug,
    name: course.name,
    shortName: course.shortName,
    durationYears: course.durationYears,
    summary: course.summary,
    metaTitle: course.metaTitle,
    metaDescription: course.metaDescription,
    updatedAt: course.updatedAt?.toISOString(),
  }));

  const countrySlugsById = new Map(
    countryRows.map((country) => [country.id, country.slug])
  );
  const courseSlugsById = new Map(
    courseRows.map((course) => [course.id, course.slug])
  );

  const universities: University[] = universityRows.map((university) => ({
    slug: university.slug,
    countrySlug: countrySlugsById.get(university.countryId) ?? "",
    name: university.name,
    city: university.city,
    type: university.type as University["type"],
    establishedYear: university.establishedYear,
    summary: university.summary,
    featured: university.featured,
    published: university.published,
    officialWebsite: university.officialWebsite,
    logoUrl: university.logoUrl ?? undefined,
    coverImageUrl: university.coverImageUrl ?? undefined,
    campusLifestyle: university.campusLifestyle,
    cityProfile: university.cityProfile,
    clinicalExposure: university.clinicalExposure,
    hostelOverview: university.hostelOverview,
    indianFoodSupport: university.indianFoodSupport,
    safetyOverview: university.safetyOverview,
    studentSupport: university.studentSupport,
    whyChoose: university.whyChoose as University["whyChoose"],
    thingsToConsider:
      university.thingsToConsider as University["thingsToConsider"],
    bestFitFor: university.bestFitFor as University["bestFitFor"],
    teachingHospitals: university.teachingHospitals,
    recognitionBadges: university.recognitionBadges,
    recognitionLinks:
      university.recognitionLinks as University["recognitionLinks"],
    faq: university.faq as University["faq"],
    similarUniversitySlugs: university.similarUniversitySlugs,
    lastVerifiedAt: university.lastVerifiedAt ?? undefined,
    researchSources: university.researchSources as University["researchSources"],
    researchNotes: university.researchNotes ?? undefined,
    updatedAt: university.updatedAt?.toISOString(),
  }));

  const universitySlugsById = new Map(
    universityRows.map((university) => [university.id, university.slug])
  );

  const programOfferings: ProgramOffering[] = programRows.flatMap((program) => {
    const universitySlug = universitySlugsById.get(program.universityId);
    const courseSlug = courseSlugsById.get(program.courseId);

    if (!universitySlug || !courseSlug) {
      return [];
    }

    return [{
      slug: program.slug,
      universitySlug,
      courseSlug,
      title: program.title,
      durationYears: program.durationYears,
      annualTuitionUsd: program.annualTuitionUsd,
      totalTuitionUsd: program.totalTuitionUsd,
      livingUsd: program.livingUsd,
      officialFeeCurrency: program.officialFeeCurrency ?? undefined,
      officialAnnualTuitionAmount:
        program.officialAnnualTuitionAmount ?? undefined,
      officialTotalTuitionAmount:
        program.officialTotalTuitionAmount ?? undefined,
      officialProgramUrl: program.officialProgramUrl,
      medium: program.medium as ProgramOffering["medium"],
      published: program.published,
      teachingPhases:
        program.teachingPhases as ProgramOffering["teachingPhases"],
      yearlyCostBreakdown:
        program.yearlyCostBreakdown as ProgramOffering["yearlyCostBreakdown"],
      licenseExamSupport:
        program.licenseExamSupport as ProgramOffering["licenseExamSupport"],
      intakeMonths: program.intakeMonths,
      feeVerifiedAt: program.feeVerifiedAt ?? undefined,
      fxRateDate: program.fxRateDate ?? undefined,
      fxRateSourceUrl: program.fxRateSourceUrl ?? undefined,
      feeNotes: program.feeNotes ?? undefined,
      sourceUrls: program.sourceUrls,
      featured: program.featured,
      updatedAt: program.updatedAt?.toISOString(),
    }];
  });

  return { countries, courses, universities, programOfferings };
}

function buildFinderPrograms(snapshot: CatalogSnapshot) {
  const universityBySlug = new Map(
    snapshot.universities.map((university) => [university.slug, university])
  );
  const countryBySlug = new Map(
    snapshot.countries.map((country) => [country.slug, country])
  );
  const courseBySlug = new Map(
    snapshot.courses.map((course) => [course.slug, course])
  );

  return snapshot.programOfferings
    .map((offering): FinderProgram | null => {
      const university = universityBySlug.get(offering.universitySlug);
      const course = courseBySlug.get(offering.courseSlug);
      const country = university
        ? countryBySlug.get(university.countrySlug)
        : undefined;

      if (!university || !course || !country) {
        return null;
      }

      return { country, course, university, offering };
    })
    .filter((program): program is FinderProgram => Boolean(program))
    .sort((a, b) => {
      if (a.offering.featured !== b.offering.featured) {
        return Number(b.offering.featured) - Number(a.offering.featured);
      }

      return (
        getSortableUsdValue(a.offering.annualTuitionUsd) -
        getSortableUsdValue(b.offering.annualTuitionUsd)
      );
    });
}

function sortPair(left: string, right: string) {
  return [left, right].sort((a, b) => a.localeCompare(b));
}

function getComparisonGuideSlug(leftUniversitySlug: string, rightUniversitySlug: string) {
  return sortPair(leftUniversitySlug, rightUniversitySlug).join("-vs-");
}

function getBudgetGuideSlug(courseSlug: string, budgetUsd: number) {
  return `${courseSlug}-under-${budgetUsd}-usd`;
}

function buildComparisonGuides(programs: FinderProgram[]) {
  const primaryPrograms = new Map<string, FinderProgram>();
  const seenPairs = new Set<string>();
  const guides: ComparisonGuide[] = [];

  for (const program of programs) {
    if (!primaryPrograms.has(program.university.slug)) {
      primaryPrograms.set(program.university.slug, program);
    }
  }

  for (const program of primaryPrograms.values()) {
    for (const similarSlug of program.university.similarUniversitySlugs) {
      const similarProgram = primaryPrograms.get(similarSlug);

      if (!similarProgram) {
        continue;
      }

      const pairKey = sortPair(
        program.university.slug,
        similarProgram.university.slug
      ).join("::");

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);

      guides.push({
        slug: getComparisonGuideSlug(
          program.university.slug,
          similarProgram.university.slug
        ),
        left:
          program.university.slug.localeCompare(similarProgram.university.slug) <= 0
            ? program
            : similarProgram,
        right:
          program.university.slug.localeCompare(similarProgram.university.slug) <= 0
            ? similarProgram
            : program,
      });
    }
  }

  return guides.sort((a, b) => a.slug.localeCompare(b.slug));
}

function buildBudgetGuides(programs: FinderProgram[], courses: Course[]) {
  const budgetThresholds = [4000, 5000, 6000, 8000, 10000];
  const guides: BudgetGuide[] = [];

  for (const course of courses) {
    const coursePrograms = programs.filter(
      (program) => program.course.slug === course.slug
    );

    for (const budgetUsd of budgetThresholds) {
      const matchingPrograms = coursePrograms.filter(
        (program) =>
          hasPublishedUsdAmount(program.offering.annualTuitionUsd) &&
          program.offering.annualTuitionUsd <= budgetUsd
      );

      if (matchingPrograms.length < 2) {
        continue;
      }

      guides.push({
        slug: getBudgetGuideSlug(course.slug, budgetUsd),
        budgetUsd,
        course,
        programs: matchingPrograms,
      });
    }
  }

  return guides.sort((a, b) => {
    if (a.course.slug !== b.course.slug) {
      return a.course.slug.localeCompare(b.course.slug);
    }

    return a.budgetUsd - b.budgetUsd;
  });
}

function dedupeUrlEntries(entries: UrlEntry[]) {
  const latestByUrl = new Map<string, Date | undefined>();

  for (const entry of entries) {
    const existing = latestByUrl.get(entry.url);

    if (!existing) {
      latestByUrl.set(entry.url, entry.lastModified);
      continue;
    }

    const replacement = getLatestDate([existing, entry.lastModified]);
    latestByUrl.set(entry.url, replacement);
  }

  return [...latestByUrl.entries()].map(([url, lastModified]) => ({
    url,
    lastModified,
  }));
}

function buildUrlEntries(
  snapshot: CatalogSnapshot,
  comparisonGuides: ComparisonGuide[],
  budgetGuides: BudgetGuide[]
) {
  const { countries, courses, universities, programOfferings } = snapshot;
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));
  const universityBySlug = new Map(
    universities.map((university) => [university.slug, university])
  );
  const programsByUniversity = new Map<string, ProgramOffering[]>();
  const programsByCountryCourse = new Map<string, ProgramOffering[]>();
  const catalogLastModified = getLatestDate([
    governancePublishedAt,
    catalogReviewedAt,
    ...countries.map((country) => country.updatedAt),
    ...courses.map((course) => course.updatedAt),
    ...universities.map((university) => university.updatedAt),
    ...programOfferings.map((offering) => offering.updatedAt),
  ]);
  const governanceLastModified = getLatestDate([
    governancePublishedAt,
    catalogReviewedAt,
  ]);

  for (const offering of programOfferings) {
    const universityPrograms =
      programsByUniversity.get(offering.universitySlug) ?? [];
    universityPrograms.push(offering);
    programsByUniversity.set(offering.universitySlug, universityPrograms);

    const university = universityBySlug.get(offering.universitySlug);

    if (!university) {
      continue;
    }

    const countryCourseKey = `${university.countrySlug}::${offering.courseSlug}`;
    const countryCoursePrograms =
      programsByCountryCourse.get(countryCourseKey) ?? [];
    countryCoursePrograms.push(offering);
    programsByCountryCourse.set(countryCourseKey, countryCoursePrograms);
  }

  function getUniversityLastModified(universitySlug: string) {
    return getLatestDate([
      catalogReviewedAt,
      universityBySlug.get(universitySlug)?.updatedAt,
      ...(programsByUniversity.get(universitySlug) ?? []).map(
        (offering) => offering.updatedAt
      ),
    ]);
  }

  function getLandingPageLastModified(courseSlug: string, countrySlug: string) {
    const relatedPrograms =
      programsByCountryCourse.get(`${countrySlug}::${courseSlug}`) ?? [];

    return getLatestDate([
      catalogReviewedAt,
      countryBySlug.get(countrySlug)?.updatedAt,
      courseBySlug.get(courseSlug)?.updatedAt,
      ...relatedPrograms.map((offering) => offering.updatedAt),
      ...relatedPrograms.map(
        (offering) => universityBySlug.get(offering.universitySlug)?.updatedAt
      ),
    ]);
  }

  return dedupeUrlEntries([
    { url: absoluteUrl("/"), lastModified: catalogLastModified },
    { url: absoluteUrl("/about"), lastModified: governanceLastModified },
    { url: absoluteUrl("/contact"), lastModified: governanceLastModified },
    {
      url: absoluteUrl("/editorial-policy"),
      lastModified: governanceLastModified,
    },
    { url: absoluteUrl("/methodology"), lastModified: governanceLastModified },
    { url: absoluteUrl("/privacy"), lastModified: governanceLastModified },
    { url: absoluteUrl("/terms"), lastModified: governanceLastModified },
    { url: absoluteUrl("/countries"), lastModified: catalogLastModified },
    { url: absoluteUrl("/courses"), lastModified: catalogLastModified },
    { url: absoluteUrl("/universities"), lastModified: catalogLastModified },
    { url: absoluteUrl("/compare"), lastModified: catalogLastModified },
    { url: absoluteUrl("/budget"), lastModified: catalogLastModified },
    ...landingPages.map((page) => ({
      url: absoluteUrl(getLandingPageHref(page.courseSlug, page.countrySlug)),
      lastModified: getLandingPageLastModified(
        page.courseSlug,
        page.countrySlug
      ),
    })),
    ...countries.map((country) => ({
      url: absoluteUrl(getCountryHref(country.slug)),
      lastModified: getLatestDate([catalogReviewedAt, country.updatedAt]),
    })),
    ...courses.map((course) => ({
      url: absoluteUrl(getCourseHref(course.slug)),
      lastModified: getLatestDate([catalogReviewedAt, course.updatedAt]),
    })),
    ...universities.map((university) => ({
      url: absoluteUrl(getUniversityHref(university.slug)),
      lastModified: getUniversityLastModified(university.slug),
    })),
    ...comparisonGuides.map((guide) => ({
      url: absoluteUrl(getComparisonHref(guide.slug)),
      lastModified: getLatestDate([
        catalogReviewedAt,
        guide.left.course.updatedAt,
        guide.right.course.updatedAt,
        guide.left.university.updatedAt,
        guide.right.university.updatedAt,
        guide.left.offering.updatedAt,
        guide.right.offering.updatedAt,
      ]),
    })),
    ...budgetGuides.map((guide) => ({
      url: absoluteUrl(getBudgetGuideHref(guide.slug)),
      lastModified: getLatestDate([
        catalogReviewedAt,
        guide.course.updatedAt,
        ...guide.programs.flatMap((program) => [
          program.university.updatedAt,
          program.offering.updatedAt,
        ]),
      ]),
    })),
  ]);
}

async function resolveTargetUrls(options: CliOptions) {
  const manualInputs = [
    ...options.urlInputs,
    ...(await readManualUrls(options.filePath)),
  ];
  const manualUrls = uniqueValues(
    manualInputs
      .map((value) => normalizeUrlInput(value))
      .filter((value): value is string => Boolean(value))
  );

  if (manualUrls.length) {
    return {
      label: `manual URL list (${manualUrls.length} URL${manualUrls.length === 1 ? "" : "s"})`,
      shouldPersistState: false,
      urls: manualUrls,
    };
  }

  const snapshot = await getCatalogSnapshot();
  const finderPrograms = buildFinderPrograms(snapshot);
  const comparisonGuides = buildComparisonGuides(finderPrograms);
  const budgetGuides = buildBudgetGuides(finderPrograms, snapshot.courses);
  const allEntries = buildUrlEntries(snapshot, comparisonGuides, budgetGuides);

  if (options.all) {
    return {
      label: "full site",
      shouldPersistState: true,
      urls: allEntries.map((entry) => entry.url),
    };
  }

  const storedState = await readState(options.stateFile);
  const since =
    options.since ??
    (storedState?.lastSuccessfulSubmissionAt
      ? parseDateFlag(storedState.lastSuccessfulSubmissionAt)
      : undefined);

  if (!since) {
    throw new Error(
      "No previous IndexNow state found. Run with --all once, or pass --since / --url."
    );
  }

  return {
    label: `changes since ${since.toISOString()}`,
    shouldPersistState: true,
    urls: allEntries
      .filter(
        (entry) =>
          entry.lastModified && isDateOnOrAfter(entry.lastModified, since)
      )
      .map((entry) => entry.url),
  };
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));

  if (options.help) {
    printUsage();
    return;
  }

  const target = await resolveTargetUrls(options);
  const payload = buildIndexNowPayload(target.urls);

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          mode: target.label,
          count: payload.urlList.length,
          payload,
        },
        null,
        2
      )
    );
    return;
  }

  if (!payload.urlList.length) {
    console.log(`No URLs to submit for ${target.label}.`);

    if (target.shouldPersistState) {
      await writeState(options.stateFile, {
        lastSuccessfulSubmissionAt: new Date().toISOString(),
      });
    }

    return;
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `IndexNow submission failed with ${response.status} ${response.statusText}`
    );
  }

  if (target.shouldPersistState) {
    await writeState(options.stateFile, {
      lastSuccessfulSubmissionAt: new Date().toISOString(),
    });
  }

  console.log(`Submitted ${payload.urlList.length} URLs to IndexNow for ${target.label}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
