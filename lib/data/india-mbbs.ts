import "server-only";

import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type {
  IndiaMbbsCard,
  IndiaMbbsCollegeDetail,
  IndiaMbbsFilters,
  IndiaMbbsOptions,
  IndiaMbbsPage,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import { indiaMedicalColleges, indiaMedicalPrograms } from "@/lib/db/schema";
import { getIndiaMbbsSort } from "@/lib/india-mbbs-filters";

type IndiaMbbsCollegeDetailRow = {
  id: number;
  slug: string;
  collegeCode: string | null;
  collegeName: string;
  stateName: string;
  cityName: string | null;
  managementType: string | null;
  universityName: string | null;
  sourceAuthority: string;
  sourceFileName: string | null;
  sourceUrl: string | null;
  rawRow: Record<string, unknown> | null;
  editorialContent?: IndiaMbbsCollegeDetail["editorialContent"] | null;
  updatedAt: Date | null;
  programSlug: string | null;
  courseName: string | null;
  yearOfInception: number | null;
  annualIntakeSeats: number | null;
  programSourceUrl: string | null;
};

function mapIndiaMbbsCollegeDetail(
  rows: IndiaMbbsCollegeDetailRow[],
): IndiaMbbsCollegeDetail | null {
  const firstRow = rows[0];

  if (!firstRow) {
    return null;
  }

  return {
    id: firstRow.id,
    slug: firstRow.slug,
    collegeCode: firstRow.collegeCode ?? undefined,
    collegeName: firstRow.collegeName,
    stateName: firstRow.stateName,
    cityName: firstRow.cityName ?? undefined,
    managementType: firstRow.managementType ?? undefined,
    universityName: firstRow.universityName ?? undefined,
    sourceAuthority: firstRow.sourceAuthority,
    sourceFileName: firstRow.sourceFileName ?? undefined,
    sourceUrl: firstRow.sourceUrl ?? undefined,
    rawRow: firstRow.rawRow ?? {},
    editorialContent: firstRow.editorialContent ?? {},
    updatedAt: firstRow.updatedAt?.toISOString(),
    programs: rows
      .filter((row) => row.programSlug && row.courseName)
      .map((row) => ({
        slug: row.programSlug as string,
        courseName: row.courseName as string,
        yearOfInception: row.yearOfInception ?? undefined,
        annualIntakeSeats: row.annualIntakeSeats ?? undefined,
        sourceUrl: row.programSourceUrl ?? undefined,
      })),
  };
}

function isMissingEditorialContentColumn(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  const cause =
    "cause" in error && error.cause && typeof error.cause === "object"
      ? error.cause
      : undefined;
  const causeCode = cause && "code" in cause ? cause.code : undefined;
  const message = "message" in error ? String(error.message) : "";

  return (
    code === "42703" ||
    causeCode === "42703" ||
    message.includes("editorial_content")
  );
}

function buildConditions(filters: IndiaMbbsFilters) {
  const conditions = [];

  if (filters.course) {
    conditions.push(eq(indiaMedicalPrograms.courseName, filters.course));
  } else {
    conditions.push(eq(indiaMedicalPrograms.courseName, "MBBS"));
  }

  if (filters.state) {
    conditions.push(eq(indiaMedicalColleges.stateName, filters.state));
  }

  if (filters.management) {
    conditions.push(eq(indiaMedicalColleges.managementType, filters.management));
  }

  if (filters.q) {
    const query = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(indiaMedicalColleges.collegeName, query),
        ilike(indiaMedicalColleges.universityName, query),
        ilike(indiaMedicalColleges.cityName, query),
        ilike(indiaMedicalColleges.stateName, query),
      ),
    );
  }

  return conditions;
}

function applySort(sort?: IndiaMbbsFilters["sort"]) {
  switch (getIndiaMbbsSort(sort)) {
    case "name_asc":
      return [asc(indiaMedicalColleges.collegeName)];
    case "seats_desc":
      return [
        desc(indiaMedicalPrograms.annualIntakeSeats),
        asc(indiaMedicalColleges.collegeName),
      ];
    case "year_desc":
      return [
        desc(indiaMedicalPrograms.yearOfInception),
        asc(indiaMedicalColleges.collegeName),
      ];
    default:
      return [
        asc(indiaMedicalColleges.stateName),
        desc(indiaMedicalPrograms.annualIntakeSeats),
        asc(indiaMedicalColleges.collegeName),
      ];
  }
}

export async function getIndiaMbbsFilterOptions(): Promise<
  IndiaMbbsOptions & { totalColleges: number }
> {
  "use cache";

  cacheLife("hours");
  cacheTag("india-medical-colleges");
  cacheTag("india-medical-programs");
  cacheTag("india-mbbs-finder");

  const db = getDb();

  if (!db) {
    return {
      courses: [],
      states: [],
      managementTypes: [],
      totalColleges: 0,
    };
  }

  const [courseRows, stateRows, managementRows, totalRow] = await Promise.all([
    db
      .selectDistinct({ value: indiaMedicalPrograms.courseName })
      .from(indiaMedicalPrograms)
      .orderBy(asc(indiaMedicalPrograms.courseName)),
    db
      .selectDistinct({ value: indiaMedicalColleges.stateName })
      .from(indiaMedicalColleges)
      .innerJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(eq(indiaMedicalPrograms.courseName, "MBBS"))
      .orderBy(asc(indiaMedicalColleges.stateName)),
    db
      .selectDistinct({ value: indiaMedicalColleges.managementType })
      .from(indiaMedicalColleges)
      .innerJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(eq(indiaMedicalPrograms.courseName, "MBBS"))
      .orderBy(asc(indiaMedicalColleges.managementType)),
    db
      .select({ value: count() })
      .from(indiaMedicalColleges)
      .innerJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(eq(indiaMedicalPrograms.courseName, "MBBS")),
  ]);

  return {
    courses: courseRows.map((row) => row.value).filter(Boolean) as string[],
    states: stateRows.map((row) => row.value).filter(Boolean),
    managementTypes: managementRows
      .map((row) => row.value)
      .filter(Boolean) as string[],
    totalColleges: totalRow[0]?.value ?? 0,
  };
}

export async function queryIndiaMbbsCollegesPage(
  filters: IndiaMbbsFilters = {},
  page = 1,
  pageSize = 12,
): Promise<IndiaMbbsPage> {
  "use cache";

  cacheLife("hours");
  cacheTag("india-medical-colleges");
  cacheTag("india-medical-programs");
  cacheTag("india-mbbs-finder");

  const db = getDb();

  if (!db) {
    return {
      colleges: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  const conditions = buildConditions(filters);
  const whereClause = conditions.length ? and(...conditions) : undefined;
  const currentPage = Math.max(page, 1);
  const offset = (currentPage - 1) * pageSize;

  const [rows, totalRows] = await Promise.all([
    db
      .select({
        slug: indiaMedicalColleges.slug,
        collegeName: indiaMedicalColleges.collegeName,
        programName: indiaMedicalPrograms.courseName,
        stateName: indiaMedicalColleges.stateName,
        cityName: indiaMedicalColleges.cityName,
        managementType: indiaMedicalColleges.managementType,
        universityName: indiaMedicalColleges.universityName,
        yearOfInception: indiaMedicalPrograms.yearOfInception,
        annualIntakeSeats: indiaMedicalPrograms.annualIntakeSeats,
      })
      .from(indiaMedicalColleges)
      .innerJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(whereClause)
      .orderBy(...applySort(filters.sort))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ value: count() })
      .from(indiaMedicalColleges)
      .innerJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(whereClause),
  ]);

  const totalItems = totalRows[0]?.value ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    colleges: rows as IndiaMbbsCard[],
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

export async function getIndiaMbbsCollegeSlugs(limit = 24) {
  "use cache";

  cacheLife("hours");
  cacheTag("india-medical-colleges");

  const db = getDb();

  if (!db) {
    return [];
  }

  return db
    .select({ slug: indiaMedicalColleges.slug })
    .from(indiaMedicalColleges)
    .orderBy(asc(indiaMedicalColleges.collegeName))
    .limit(limit);
}

export async function getAllIndiaMbbsCollegeEntries() {
  "use cache";

  cacheLife("hours");
  cacheTag("india-medical-colleges");

  const db = getDb();

  if (!db) {
    return [];
  }

  const rows = await db
    .select({
      slug: indiaMedicalColleges.slug,
      updatedAt: indiaMedicalColleges.updatedAt,
    })
    .from(indiaMedicalColleges)
    .orderBy(asc(indiaMedicalColleges.collegeName));

  return rows.map((row) => ({
    slug: row.slug,
    updatedAt: row.updatedAt?.toISOString(),
  }));
}

export async function getIndiaMbbsCollegeBySlug(
  slug: string,
): Promise<IndiaMbbsCollegeDetail | null> {
  "use cache";

  cacheLife("hours");
  cacheTag("india-medical-colleges");
  cacheTag("india-medical-programs");
  cacheTag("india-mbbs-finder");

  const db = getDb();

  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .select({
        id: indiaMedicalColleges.id,
        slug: indiaMedicalColleges.slug,
        collegeCode: indiaMedicalColleges.collegeCode,
        collegeName: indiaMedicalColleges.collegeName,
        stateName: indiaMedicalColleges.stateName,
        cityName: indiaMedicalColleges.cityName,
        managementType: indiaMedicalColleges.managementType,
        universityName: indiaMedicalColleges.universityName,
        sourceAuthority: indiaMedicalColleges.sourceAuthority,
        sourceFileName: indiaMedicalColleges.sourceFileName,
        sourceUrl: indiaMedicalColleges.sourceUrl,
        rawRow: indiaMedicalColleges.rawRow,
        editorialContent: indiaMedicalColleges.editorialContent,
        updatedAt: indiaMedicalColleges.updatedAt,
        programSlug: indiaMedicalPrograms.slug,
        courseName: indiaMedicalPrograms.courseName,
        yearOfInception: indiaMedicalPrograms.yearOfInception,
        annualIntakeSeats: indiaMedicalPrograms.annualIntakeSeats,
        programSourceUrl: indiaMedicalPrograms.sourceUrl,
      })
      .from(indiaMedicalColleges)
      .leftJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(eq(indiaMedicalColleges.slug, slug))
      .orderBy(
        asc(indiaMedicalPrograms.courseName),
        desc(indiaMedicalPrograms.annualIntakeSeats),
      );

    return mapIndiaMbbsCollegeDetail(rows);
  } catch (error) {
    if (!isMissingEditorialContentColumn(error)) {
      throw error;
    }

    const rows = await db
      .select({
        id: indiaMedicalColleges.id,
        slug: indiaMedicalColleges.slug,
        collegeCode: indiaMedicalColleges.collegeCode,
        collegeName: indiaMedicalColleges.collegeName,
        stateName: indiaMedicalColleges.stateName,
        cityName: indiaMedicalColleges.cityName,
        managementType: indiaMedicalColleges.managementType,
        universityName: indiaMedicalColleges.universityName,
        sourceAuthority: indiaMedicalColleges.sourceAuthority,
        sourceFileName: indiaMedicalColleges.sourceFileName,
        sourceUrl: indiaMedicalColleges.sourceUrl,
        rawRow: indiaMedicalColleges.rawRow,
        updatedAt: indiaMedicalColleges.updatedAt,
        programSlug: indiaMedicalPrograms.slug,
        courseName: indiaMedicalPrograms.courseName,
        yearOfInception: indiaMedicalPrograms.yearOfInception,
        annualIntakeSeats: indiaMedicalPrograms.annualIntakeSeats,
        programSourceUrl: indiaMedicalPrograms.sourceUrl,
      })
      .from(indiaMedicalColleges)
      .leftJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(eq(indiaMedicalColleges.slug, slug))
      .orderBy(
        asc(indiaMedicalPrograms.courseName),
        desc(indiaMedicalPrograms.annualIntakeSeats),
      );

    return mapIndiaMbbsCollegeDetail(rows);
  }
}
