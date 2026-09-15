import { z } from "zod";

import { teachingLanguageCodes, type TeachingLanguageCode } from "@/lib/catalogue-facets";

/**
 * Single source of truth for programme teaching-language fields.
 *
 * Used by the content-migration payload schema (`catalog-payload-schema.ts`) and by the legacy
 * direct writers `scripts/add-program-offerings.mjs` and `scripts/publish-university-draft.ts`,
 * so every path that writes `program_offerings` enforces the same `medium`, `medium_note` and
 * `instruction_languages` rules.
 */

/** Values that record missing research, not a teaching language. Compared case-insensitively. */
export const programmeMediumPlaceholders = [
  "not confirmed",
  "tbc",
  "to be confirmed",
  "unknown",
  "n/a",
] as const;

export function isPlaceholderMedium(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ").toLowerCase();
  return (programmeMediumPlaceholders as readonly string[]).includes(normalized);
}

/**
 * `medium` is a short display label rendered on cards, tables and search:
 * language names only, joined with " / " (e.g. "English / Russian").
 * Delivery nuance belongs in `mediumNote` or `teachingPhases`.
 */
export const programmeMediumSchema = z
  .string()
  .trim()
  .min(2)
  .max(40, "medium must be a short language label (max 40 chars); put delivery detail in mediumNote.")
  .refine(
    (value) => !/[.;:()\r\n]/.test(value),
    "medium must be language names only, e.g. \"English / Russian\" (no . ; : ( ) or newlines); put delivery detail in mediumNote.",
  )
  .refine(
    (value) => !isPlaceholderMedium(value),
    "medium must be a verified teaching language, not a placeholder such as \"Not confirmed\" or \"TBC\"; omit the programme until the language is confirmed.",
  );

/** Optional source-backed teaching-language nuance shown on detail pages. */
export const programmeMediumNoteSchema = z.string().trim().min(10).max(300).nullable().optional();

/** Controlled language-facet codes from `lib/catalogue-facets.ts`; at least one is required. */
export const instructionLanguagesSchema = z.array(z.enum(teachingLanguageCodes)).min(1);

export type OfferingLanguageFields = {
  medium: string;
  mediumNote: string | null;
  instructionLanguages: TeachingLanguageCode[];
};

export type OfferingLanguageCheck =
  | { ok: true; value: OfferingLanguageFields }
  | { ok: false; issues: string[] };

/** Validates the teaching-language fields of one offering without throwing. */
export function checkOfferingLanguageFields(input: {
  medium?: unknown;
  mediumNote?: unknown;
  instructionLanguages?: unknown;
}): OfferingLanguageCheck {
  const issues: string[] = [];

  let medium: string | undefined;
  if (typeof input.medium !== "string" || input.medium.trim() === "") {
    issues.push("medium is missing; record the verified teaching language (no default is applied).");
  } else {
    const parsed = programmeMediumSchema.safeParse(input.medium);
    if (parsed.success) medium = parsed.data;
    else issues.push(...parsed.error.issues.map((issue) => `medium ${JSON.stringify(input.medium)}: ${issue.message}`));
  }

  let mediumNote: string | null = null;
  const noteParsed = programmeMediumNoteSchema.safeParse(input.mediumNote);
  if (noteParsed.success) mediumNote = noteParsed.data ?? null;
  else issues.push(`mediumNote: ${noteParsed.error.issues[0]?.message ?? "invalid"} (10-300 chars when present).`);

  let instructionLanguages: TeachingLanguageCode[] | undefined;
  if (!Array.isArray(input.instructionLanguages) || input.instructionLanguages.length === 0) {
    issues.push(
      `instructionLanguages is missing or empty; provide at least one code from lib/catalogue-facets.ts teachingLanguageCodes (e.g. ["english"]).`,
    );
  } else {
    const invalid = input.instructionLanguages.filter(
      (code) => !(teachingLanguageCodes as readonly unknown[]).includes(code),
    );
    if (invalid.length > 0) {
      issues.push(
        `instructionLanguages contains unknown code(s) ${invalid.map((code) => JSON.stringify(code)).join(", ")}; allowed: ${teachingLanguageCodes.join(", ")}.`,
      );
    } else {
      instructionLanguages = instructionLanguagesSchema.parse(input.instructionLanguages);
    }
  }

  if (issues.length > 0 || medium === undefined || instructionLanguages === undefined) {
    return { ok: false, issues };
  }
  return { ok: true, value: { medium, mediumNote, instructionLanguages } };
}

export const contentMigrationGuidance =
  "Prefer the content-migration path: `npm run content:reserve -- --name <scope> --description \"...\"`, " +
  "write payload.json, `npm run content:validate -- --id <migration-id>`, then `npm run content:migrate -- --apply`. " +
  "See content-migrations/README.md.";

/**
 * Validates every offering up front and throws one aggregated error naming each failing offering,
 * so callers can refuse the whole run before any database write.
 */
export function assertOfferingsLanguageFields(
  offerings: Array<{ label: string; input: Parameters<typeof checkOfferingLanguageFields>[0] }>,
  scriptName: string,
): OfferingLanguageFields[] {
  const failures: string[] = [];
  const values: OfferingLanguageFields[] = [];

  for (const { label, input } of offerings) {
    const result = checkOfferingLanguageFields(input);
    if (result.ok) values.push(result.value);
    else failures.push(`${label}:\n    - ${result.issues.join("\n    - ")}`);
  }

  if (failures.length > 0) {
    throw new Error(
      `${scriptName}: ${failures.length} programme offering(s) failed teaching-language validation; nothing was written.\n` +
        `  ${failures.join("\n  ")}\n${contentMigrationGuidance}`,
    );
  }
  return values;
}

export function warnLegacyOfferingWriter(scriptName: string) {
  console.warn(
    `[deprecated] ${scriptName} is a legacy direct database writer for program_offerings. ${contentMigrationGuidance}`,
  );
}
