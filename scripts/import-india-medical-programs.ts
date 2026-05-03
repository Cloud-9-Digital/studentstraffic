import "dotenv/config";

import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  indiaMedicalColleges,
  indiaMedicalPrograms,
} from "@/lib/db/schema";
import { createSlug } from "@/lib/utils";

type ParsedArgs = {
  filePath: string;
  importBatch: string;
  sourceUrl?: string;
  delimiter: "," | "\t";
};

type ParsedRow = Record<string, string>;

type NormalizedProgramRow = {
  collegeCode?: string;
  collegeName?: string;
  stateName?: string;
  cityName?: string;
  managementType?: string;
  universityName?: string;
  courseName?: string;
  yearOfInception?: number;
  annualIntakeSeats?: number;
};

const headerAliases: Record<string, keyof NormalizedProgramRow> = {
  [normalizeHeader("College Code")]: "collegeCode",
  [normalizeHeader("College Name")]: "collegeName",
  [normalizeHeader("State Name")]: "stateName",
  [normalizeHeader("City Name")]: "cityName",
  [normalizeHeader("Management Type")]: "managementType",
  [normalizeHeader("University Name")]: "universityName",
  [normalizeHeader("Course Name")]: "courseName",
  [normalizeHeader("Year of Inception of College")]: "yearOfInception",
  [normalizeHeader("Annual Intake (Seats)")]: "annualIntakeSeats",
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function parseArgs(argv: string[]): ParsedArgs {
  let filePath = "";
  let importBatch = `manual-${new Date().toISOString().slice(0, 10)}`;
  let sourceUrl: string | undefined;
  let delimiter: "," | "\t" = "\t";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--file" && next) {
      filePath = next;
      index += 1;
      continue;
    }

    if (arg === "--batch" && next) {
      importBatch = next;
      index += 1;
      continue;
    }

    if (arg === "--source-url" && next) {
      sourceUrl = next;
      index += 1;
      continue;
    }

    if (arg === "--delimiter" && next) {
      delimiter = next === "comma" ? "," : "\t";
      index += 1;
    }
  }

  if (!filePath) {
    throw new Error(
      "Missing --file. Example: npm run db:import:india-medical-programs -- --file ./data/nmc-other-programs.tsv",
    );
  }

  return {
    filePath: resolve(filePath),
    importBatch,
    sourceUrl,
    delimiter,
  };
}

function parseDelimited(text: string, delimiter: "," | "\t") {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (insideQuotes && next === "\"") {
        currentCell += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (!insideQuotes && char === delimiter) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (!insideQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      currentRow.push(currentCell);
      if (currentRow.some((cell) => cell.trim() !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  if (currentRow.some((cell) => cell.trim() !== "")) {
    rows.push(currentRow);
  }

  return rows;
}

function parseRows(text: string, delimiter: "," | "\t"): ParsedRow[] {
  const rows = parseDelimited(text, delimiter);
  if (rows.length === 0) {
    return [];
  }

  const [headerRow, ...bodyRows] = rows;
  const headers = headerRow.map((header) => header.trim());

  return bodyRows.map((row) => {
    const parsed: ParsedRow = {};
    headers.forEach((header, index) => {
      parsed[header] = row[index]?.trim() ?? "";
    });
    return parsed;
  });
}

function parseInteger(value?: string) {
  if (!value) return undefined;
  const cleaned = value.replace(/[^0-9]/g, "");
  if (!cleaned) return undefined;
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeManagementType(value?: string) {
  if (!value) return undefined;
  const match = value.match(
    /(Govt-Society|Govt\.|Trust|Society|Private|Autonomous|Statutory)/i,
  );
  if (!match) return value.trim() || undefined;
  const normalized = match[1];
  if (normalized.toLowerCase() === "govt-society") return "Govt-Society";
  if (normalized.toLowerCase() === "govt.") return "Govt.";
  return normalized[0].toUpperCase() + normalized.slice(1);
}

function normalizeCourseName(value?: string) {
  if (!value) return undefined;

  const cleaned = value
    .replace(/\bPrint\b.*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || undefined;
}

function normalizeProgramRow(row: ParsedRow): NormalizedProgramRow {
  const normalized: NormalizedProgramRow = {};

  for (const [header, value] of Object.entries(row)) {
    const alias = headerAliases[normalizeHeader(header)];
    if (!alias) continue;

    if (alias === "yearOfInception" || alias === "annualIntakeSeats") {
      normalized[alias] = parseInteger(value);
      continue;
    }

    normalized[alias] = value || undefined;
  }

  normalized.managementType = normalizeManagementType(normalized.managementType);
  normalized.courseName = normalizeCourseName(normalized.courseName);

  return normalized;
}

function buildCollegeSlug(input: {
  collegeCode?: string;
  collegeName: string;
  stateName: string;
}) {
  if (input.collegeCode) {
    return createSlug(`${input.collegeCode}-india-medical-college`);
  }

  return createSlug(`${input.collegeName}-${input.stateName}-india-medical-college`);
}

function buildProgramSlug(input: {
  collegeCode?: string;
  collegeName: string;
  stateName: string;
  courseName: string;
}) {
  const base = input.collegeCode
    ? `${input.collegeCode}-${input.courseName}`
    : `${input.collegeName}-${input.stateName}-${input.courseName}`;

  return createSlug(`${base}-india-medical-program`);
}

function sanitizeCityName(cityName?: string, collegeName?: string) {
  const fallback = collegeName?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
  const cleaned = (cityName || fallback || "")
    .replace(/\bOF HEALTH SCIENCES\b/gi, "")
    .replace(/©\s*2020-.*/i, "")
    .replace(/Follow\s*@NMC_bharat.*/i, "")
    .replace(/\bDisclaimer\b.*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^,\s*/, "");

  return cleaned || fallback || undefined;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const db = getDb();

  if (!db) {
    throw new Error("Database connection not available. Check DATABASE_URL.");
  }

  const raw = readFileSync(args.filePath, "utf8");
  const parsedRows = parseRows(raw, args.delimiter);

  if (parsedRows.length === 0) {
    throw new Error("No rows found in the source file.");
  }

  const requestedCodes = [
    ...new Set(
      parsedRows
        .map((row) => normalizeProgramRow(row).collegeCode)
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  const medicalMasterRows = requestedCodes.length
    ? await db
        .select({
          collegeCode: indiaMedicalColleges.collegeCode,
          collegeName: indiaMedicalColleges.collegeName,
          stateName: indiaMedicalColleges.stateName,
          cityName: indiaMedicalColleges.cityName,
          managementType: indiaMedicalColleges.managementType,
          universityName: indiaMedicalColleges.universityName,
        })
        .from(indiaMedicalColleges)
        .where(inArray(indiaMedicalColleges.collegeCode, requestedCodes))
    : [];

  const medicalMasterByCode = new Map(
    medicalMasterRows
      .filter((row) => row.collegeCode)
      .map((row) => [row.collegeCode as string, row]),
  );

  let importedPrograms = 0;
  let skipped = 0;
  let skippedForMissingCode = 0;

  for (let index = 0; index < parsedRows.length; index += 1) {
    const row = parsedRows[index];
    const normalized = normalizeProgramRow(row);
    const masterCollege = normalized.collegeCode
      ? medicalMasterByCode.get(normalized.collegeCode)
      : undefined;

    if (
      !normalized.collegeCode ||
      !masterCollege ||
      !normalized.courseName
    ) {
      skipped += 1;
      skippedForMissingCode += 1;
      continue;
    }

    const collegeName = masterCollege.collegeName;
    const stateName = masterCollege.stateName;
    const cityName = sanitizeCityName(
      masterCollege.cityName ?? normalized.cityName,
      collegeName,
    );
    const managementType =
      normalizeManagementType(masterCollege.managementType ?? undefined) ??
      normalizeManagementType(normalized.managementType);
    const universityName =
      masterCollege.universityName ?? normalized.universityName;

    const collegeSlug = buildCollegeSlug({
      collegeCode: normalized.collegeCode,
      collegeName,
      stateName,
    });

    await db
      .insert(indiaMedicalColleges)
      .values({
        slug: collegeSlug,
        collegeCode: normalized.collegeCode,
        collegeName,
        stateName,
        cityName,
        managementType,
        universityName,
        sourceAuthority: "NMC",
        sourceFileName: basename(args.filePath),
        importBatch: args.importBatch,
        sourceUrl: args.sourceUrl,
        rawRow: row,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: indiaMedicalColleges.slug,
        set: {
          collegeCode: normalized.collegeCode,
          collegeName,
          stateName,
          cityName,
          managementType,
          universityName,
          sourceAuthority: "NMC",
          sourceFileName: basename(args.filePath),
          importBatch: args.importBatch,
          sourceUrl: args.sourceUrl,
          rawRow: row,
          updatedAt: sql`now()`,
        },
      });

    const college = await db
      .select({
        id: indiaMedicalColleges.id,
      })
      .from(indiaMedicalColleges)
      .where(eq(indiaMedicalColleges.slug, collegeSlug))
      .limit(1);

    const collegeId = college[0]?.id;
    if (!collegeId) {
      skipped += 1;
      continue;
    }

    const programSlug = buildProgramSlug({
      collegeCode: normalized.collegeCode,
      collegeName,
      stateName,
      courseName: normalized.courseName,
    });

    await db
      .insert(indiaMedicalPrograms)
      .values({
        collegeId,
        slug: programSlug,
        courseName: normalized.courseName,
        yearOfInception: normalized.yearOfInception,
        annualIntakeSeats: normalized.annualIntakeSeats,
        sourceAuthority: "NMC",
        sourceFileName: basename(args.filePath),
        sourceRowNumber: index + 2,
        importBatch: args.importBatch,
        sourceUrl: args.sourceUrl,
        rawRow: row,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: indiaMedicalPrograms.slug,
        set: {
          collegeId,
          courseName: normalized.courseName,
          yearOfInception: normalized.yearOfInception,
          annualIntakeSeats: normalized.annualIntakeSeats,
          sourceAuthority: "NMC",
          sourceFileName: basename(args.filePath),
          sourceRowNumber: index + 2,
          importBatch: args.importBatch,
          sourceUrl: args.sourceUrl,
          rawRow: row,
          updatedAt: sql`now()`,
        },
      });

    importedPrograms += 1;
  }

  console.log(
    `Imported ${importedPrograms} India medical program rows into india_medical_programs. Skipped ${skipped} rows (${skippedForMissingCode} without a validated NMC college code).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
