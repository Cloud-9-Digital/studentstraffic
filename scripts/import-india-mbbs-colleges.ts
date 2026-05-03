import "dotenv/config";

import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { indiaMedicalColleges, indiaMedicalPrograms } from "@/lib/db/schema";
import { createSlug } from "@/lib/utils";

type ParsedArgs = {
  filePath: string;
  importBatch: string;
  sourceUrl?: string;
  delimiter: "," | "\t";
};

type ParsedRow = Record<string, string>;

const ignoredHeaders = new Set([
  normalizeHeader("Status of NMC Recognition"),
  normalizeHeader("Date of LOP"),
]);

const headerAliases: Record<string, keyof NormalizedCollegeRow> = {
  [normalizeHeader("College Code")]: "collegeCode",
  [normalizeHeader("College Name")]: "collegeName",
  [normalizeHeader("Medical College Name")]: "collegeName",
  [normalizeHeader("Name of Medical College")]: "collegeName",
  [normalizeHeader("State")]: "stateName",
  [normalizeHeader("State Name")]: "stateName",
  [normalizeHeader("Management Type")]: "managementType",
  [normalizeHeader("Management")]: "managementType",
  [normalizeHeader("University Name")]: "universityName",
  [normalizeHeader("Name of University")]: "universityName",
  [normalizeHeader("Course")]: "courseName",
  [normalizeHeader("Course Name")]: "courseName",
  [normalizeHeader("Year of Inception of College")]: "yearOfInception",
  [normalizeHeader("Year of Inception")]: "yearOfInception",
  [normalizeHeader("Annual Intake")]: "annualIntakeSeats",
  [normalizeHeader("Annual Intake (Seats)")]: "annualIntakeSeats",
  [normalizeHeader("Intake")]: "annualIntakeSeats",
  [normalizeHeader("Hospital Name")]: "teachingHospital",
  [normalizeHeader("Teaching Hospital")]: "teachingHospital",
  [normalizeHeader("Address")]: "address",
  [normalizeHeader("College Address")]: "address",
  [normalizeHeader("City")]: "cityName",
  [normalizeHeader("City Name")]: "cityName",
};

type NormalizedCollegeRow = {
  collegeCode?: string;
  collegeName?: string;
  stateName?: string;
  cityName?: string;
  managementType?: string;
  universityName?: string;
  courseName?: string;
  yearOfInception?: number;
  annualIntakeSeats?: number;
  teachingHospital?: string;
  address?: string;
};

function normalizeManagementType(value?: string) {
  if (!value) {
    return undefined;
  }

  const match = value.match(
    /(Govt-Society|Govt\.|Trust|Society|Private|Autonomous|Statutory)/i,
  );

  if (!match) {
    return value.trim() || undefined;
  }

  const normalized = match[1];
  if (normalized.toLowerCase() === "govt-society") {
    return "Govt-Society";
  }
  if (normalized.toLowerCase() === "govt.") {
    return "Govt.";
  }
  return normalized[0].toUpperCase() + normalized.slice(1);
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function parseArgs(argv: string[]): ParsedArgs {
  let filePath = "";
  let importBatch = `manual-${new Date().toISOString().slice(0, 10)}`;
  let sourceUrl: string | undefined;
  let delimiter: "," | "\t" = ",";

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
      delimiter = next === "tab" ? "\t" : ",";
      index += 1;
    }
  }

  if (!filePath) {
    throw new Error(
      "Missing --file. Example: npm run db:import:india-mbbs -- --file ./data/nmc-india-mbbs.csv",
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

function normalizeCollegeRow(row: ParsedRow): NormalizedCollegeRow {
  const normalized: NormalizedCollegeRow = {};

  for (const [header, value] of Object.entries(row)) {
    const key = normalizeHeader(header);

    if (ignoredHeaders.has(key)) {
      continue;
    }

    const alias = headerAliases[key];
    if (!alias) {
      continue;
    }

    if (alias === "annualIntakeSeats" || alias === "yearOfInception") {
      normalized[alias] = parseInteger(value);
      continue;
    }

    normalized[alias] = value || undefined;
  }

  if (!normalized.courseName) {
    normalized.courseName = "MBBS";
  }

  return normalized;
}

function inferCityName(collegeName?: string) {
  if (!collegeName) {
    return undefined;
  }

  const parts = collegeName
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return undefined;
  }

  return parts.at(-1);
}

function sanitizeCityName(cityName?: string, collegeName?: string) {
  const base = cityName?.trim() || inferCityName(collegeName) || "";
  const cleaned = base
    .replace(/\bOF HEALTH SCIENCES\b/gi, "")
    .replace(/©\s*2020-.*/i, "")
    .replace(/Follow\s*@NMC_bharat.*/i, "")
    .replace(/\bDisclaimer\b.*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^,\s*/, "");

  return cleaned || inferCityName(collegeName) || undefined;
}

function buildCollegeSlug(input: {
  collegeCode?: string;
  collegeName: string;
  stateName: string;
}) {
  if (input.collegeCode) {
    return createSlug(`${input.collegeCode}-india-medical-college`);
  }

  return createSlug(
    `${input.collegeName}-${input.stateName}-india-medical-college`,
  );
}

function buildProgramSlug(input: {
  collegeCode?: string;
  collegeName: string;
  stateName: string;
}) {
  const base = input.collegeCode
    ? `${input.collegeCode}-MBBS`
    : `${input.collegeName}-${input.stateName}-MBBS`;

  return createSlug(`${base}-india-medical-program`);
}

function normalizeCourseName(courseName?: string) {
  const cleaned = courseName?.replace(/[^a-z]/gi, "").toUpperCase();

  if (cleaned === "MBBS") {
    return "MBBS";
  }

  return courseName?.trim() || "MBBS";
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

  let imported = 0;
  let skipped = 0;

  for (let index = 0; index < parsedRows.length; index += 1) {
    const row = parsedRows[index];
    const normalized = normalizeCollegeRow(row);

    if (!normalized.collegeName || !normalized.stateName) {
      skipped += 1;
      continue;
    }

    const courseName = normalizeCourseName(normalized.courseName);
    if (courseName !== "MBBS") {
      skipped += 1;
      continue;
    }

    const collegeSlug = buildCollegeSlug({
      collegeCode: normalized.collegeCode,
      collegeName: normalized.collegeName,
      stateName: normalized.stateName,
    });
    const cityName = sanitizeCityName(
      normalized.cityName,
      normalized.collegeName,
    );
    const managementType = normalizeManagementType(normalized.managementType);

    await db
      .insert(indiaMedicalColleges)
      .values({
        slug: collegeSlug,
        collegeCode: normalized.collegeCode,
        collegeName: normalized.collegeName,
        stateName: normalized.stateName,
        cityName,
        managementType,
        universityName: normalized.universityName,
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
          collegeName: normalized.collegeName,
          stateName: normalized.stateName,
          cityName,
          managementType,
          universityName: normalized.universityName,
          sourceAuthority: "NMC",
          sourceFileName: basename(args.filePath),
          importBatch: args.importBatch,
          sourceUrl: args.sourceUrl,
          rawRow: row,
          updatedAt: sql`now()`,
        },
      });

    const college = await db
      .select({ id: indiaMedicalColleges.id })
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
      collegeName: normalized.collegeName,
      stateName: normalized.stateName,
    });

    await db
      .insert(indiaMedicalPrograms)
      .values({
        collegeId,
        slug: programSlug,
        courseName,
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
          courseName,
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

    imported += 1;
  }

  console.log(
    `Imported ${imported} India MBBS college rows into india_medical_colleges and india_medical_programs. Skipped ${skipped} rows.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
