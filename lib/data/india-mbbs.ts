import "server-only";

import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type {
  IndiaMbbsCard,
  IndiaMbbsFilters,
  IndiaMbbsOptions,
  IndiaMbbsPage,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import { indiaMedicalColleges, indiaMedicalPrograms } from "@/lib/db/schema";
import { getIndiaMbbsSort } from "@/lib/india-mbbs-filters";

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
