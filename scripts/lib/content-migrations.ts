import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";

import { z } from "zod";

import {
  catalogPayloadSchema,
  legacyFreeTextMediumCatalogPayloadSchema,
  type CatalogPayload,
} from "./catalog-payload-schema";

/**
 * FROZEN grandfather list — do not add to it.
 *
 * These bundles were applied (and checksum-locked) before `programmeMediumSchema` required `medium`
 * to be a short language label. Their payloads contain sentence-style mediums and can never be
 * edited, so they are parsed with the old free-text rule (`z.string().min(2)`); every other rule is
 * unchanged and publish still stores their `medium` verbatim. Built from a full scan of
 * content-migrations/ (2026-09-15): exactly the bundles that failed only the strict medium rule.
 * Every other bundle, including reserved folders that receive a payload later, must use a language
 * label in `medium` and put delivery detail in `mediumNote`.
 */
export const LEGACY_FREE_TEXT_MEDIUM_MIGRATION_IDS: ReadonlySet<string> = new Set([
  "0003-vietnam-medicine-gold-standard",
  "0005-uzbekistan-tuit-2026",
  "0006-germany-italy-university-batch",
  "0007-uk-lsbu-computer-science",
  "0009-uk-gcu-computer-science",
  "0011-uk-robert-gordon-university-2026",
  "0015-georgia-medical-universities",
  "0051-macau-must-mbbs",
  "0056-estonia-university-of-tartu-medicine",
  "0057-bvi-phsu-md",
  "0058-universidad-catolica-del-uruguay-medicine",
  "0059-croatia-rijeka-medicine",
  "0060-portugal-university-of-lisbon-medicine",
  "0063-slovenia-maribor-general-medicine",
  "0065-botswana-university-of-botswana-mbbs",
  "0067-namibia-unam-mbchb",
  "0091-india-manipal-academy-of-higher-education",
  "0095-india-srm-institute-of-science-and-technology",
]);

const migrationIdPattern = /^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const manifestSchema = z
  .object({
    version: z.literal(1),
    id: z.string().regex(migrationIdPattern),
    description: z.string().min(10).max(300),
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    payload: z.string().regex(/^[a-z0-9][a-z0-9._-]*\.json$/),
  })
  .strict();

export type ExpiredEvidence = {
  publicField: string;
  universitySlug?: string;
  programmeSlug?: string;
  countrySlug?: string;
  reviewBy: string;
};

export type ContentMigration = {
  id: string;
  description: string;
  createdAt: string;
  directory: string;
  payloadPath: string;
  checksum: string;
  payload: CatalogPayload;
  /**
   * Evidence whose review-by date has passed. Expiry is not a structural framework failure: it is
   * reported as a warning offline and for applied (checksum-locked) bundles, and becomes a hard
   * error only for pending bundles at check/apply time — see `classifyReviewByExpiry`.
   */
  expiredEvidence: ExpiredEvidence[];
};

const bannedPublicCopy = [
  /students?\s+(?:should|must|need to)\s+verify/i,
  /check (?:the )?official fee/i,
  /world[- ]class/i,
  /modern facilities/i,
  /excellent exposure/i,
  /great opportunity/i,
  /affordable option/i,
];

function isExpiredReviewDate(value: string, context: string, now: Date) {
  const reviewBy = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(reviewBy.getTime())) {
    throw new Error(`${context} has an invalid review-by date (${value}).`);
  }
  return reviewBy.getTime() < now.getTime();
}

function assertContentFramework(payload: CatalogPayload, migrationId: string, now: Date) {
  const expiredEvidence: ExpiredEvidence[] = [];
  for (const course of payload.courses) {
    const normalizeFocus = (value: string) => value.toLowerCase().replace(/&/g, "and");
    const focusKeywords = [course.shortName, course.name].map(normalizeFocus);
    if (!focusKeywords.some((keyword) => normalizeFocus(course.metaTitle).includes(keyword))) {
      throw new Error(
        `${migrationId} course '${course.slug}' meta title must include '${course.shortName}' or '${course.name}'.`,
      );
    }
    if (!focusKeywords.some((keyword) => normalizeFocus(course.metaDescription).includes(keyword))) {
      throw new Error(
        `${migrationId} course '${course.slug}' meta description must include '${course.shortName}' or '${course.name}'.`,
      );
    }
  }

  for (const evidence of payload.evidence) {
    if (evidence.sourceGrade === "C") {
      throw new Error(`${migrationId} includes Grade C evidence for '${evidence.publicField}'. Grade C sources are discovery-only.`);
    }
    if (isExpiredReviewDate(evidence.reviewBy, `${migrationId} evidence for '${evidence.publicField}'`, now)) {
      expiredEvidence.push({
        publicField: evidence.publicField,
        universitySlug: evidence.universitySlug,
        programmeSlug: evidence.programmeSlug,
        countrySlug: evidence.countrySlug,
        reviewBy: evidence.reviewBy,
      });
    }
  }

  for (const university of payload.universities) {
    const publicCopy = [
      university.summary,
      university.campusLifestyle,
      university.cityProfile,
      university.practicalExposure,
      university.hostelOverview,
      university.dietarySupport,
      university.safetyOverview,
      university.studentSupport,
      ...university.whyChoose,
      ...university.thingsToConsider,
      ...university.bestFitFor,
      ...university.faq.flatMap((item) => [item.question, item.answer]),
      ...university.programmes.flatMap((programme) => [
        programme.admissionsContent.overview,
        programme.admissionsContent.eligibility.intro,
        ...programme.admissionsContent.eligibility.items,
        ...programme.admissionsContent.applicationSteps,
        ...programme.admissionsContent.documentsRequired.academic,
        ...programme.admissionsContent.documentsRequired.application,
        ...(programme.admissionsContent.deadlinesNote ? [programme.admissionsContent.deadlinesNote] : []),
      ]),
    ];
    for (const copy of publicCopy) {
      const banned = bannedPublicCopy.find((pattern) => pattern.test(copy));
      if (banned) {
        throw new Error(`${migrationId} contains prohibited public copy '${banned.source}' for ${university.slug}.`);
      }
    }

    for (const programme of university.programmes) {
      const evidence = payload.evidence.filter(
        (item) => item.entity === "programme" && item.universitySlug === university.slug && item.programmeSlug === programme.slug,
      );
      const hasFieldEvidence = (field: string, statuses: Array<"verified" | "indicative">) =>
        evidence.some(
          (item) =>
            item.publicField === field &&
            item.status !== "omit" &&
            statuses.includes(item.status),
        );

      if (!hasFieldEvidence("eligibility", ["verified"])) {
        throw new Error(`${migrationId} is missing verified eligibility evidence for ${programme.slug}.`);
      }
      if (!hasFieldEvidence("admissions", ["verified"]) || !hasFieldEvidence("intake", ["verified"])) {
        throw new Error(`${migrationId} is missing verified admissions or intake evidence for ${programme.slug}.`);
      }

      const feeEvidence = evidence.filter((item) => item.publicField === "fee");
      if (programme.fee.status === "confirmed") {
        if (!feeEvidence.some((item) => item.sourceGrade === "A" && item.status === "verified")) {
          throw new Error(`${migrationId} needs Grade A verified fee evidence for confirmed fee ${programme.slug}.`);
        }
      } else if (programme.fee.status === "indicative") {
        if (!feeEvidence.some((item) => (item.sourceGrade === "A" || item.sourceGrade === "B") && item.status === "indicative")) {
          throw new Error(`${migrationId} needs Grade A/B indicative fee evidence for ${programme.slug}.`);
        }
      } else if (!feeEvidence.some((item) => item.sourceGrade === "A" && item.status === "verified")) {
        throw new Error(`${migrationId} needs Grade A evidence for the on-request fee status of ${programme.slug}.`);
      }
    }
  }

  return expiredEvidence;
}

export function compareMigrationIds(left: string, right: string) {
  const leftNumber = Number(left.slice(0, 4));
  const rightNumber = Number(right.slice(0, 4));
  return leftNumber - rightNumber || left.localeCompare(right);
}

function isChildPath(root: string, candidate: string) {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot !== "" && !pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== "..";
}

export function contentMigrationChecksum(manifest: string, payload: string) {
  return createHash("sha256")
    .update(manifest)
    .update("\u0000")
    .update(payload)
    .digest("hex");
}

export async function readContentMigrations(
  rootDirectory = "content-migrations",
  options: { onlyId?: string; now?: Date } = {},
) {
  const now = options.now ?? new Date();
  const root = resolve(rootDirectory);
  let entries: Dirent[];

  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [] as ContentMigration[];
    }
    throw error;
  }

  const directories = entries
    .filter((entry) => entry.isDirectory() && migrationIdPattern.test(entry.name))
    .map((entry) => entry.name)
    .filter((directory) => !options.onlyId || directory === options.onlyId)
    .sort(compareMigrationIds);

  if (options.onlyId && directories.length === 0) {
    throw new Error(`Content migration '${options.onlyId}' does not exist.`);
  }

  const numericIds = new Set<number>();
  const migrations: ContentMigration[] = [];

  for (const directoryName of directories) {
    const numericId = Number(directoryName.slice(0, 4));
    if (numericIds.has(numericId)) {
      throw new Error(`Content migration sequence ${directoryName.slice(0, 4)} is used more than once.`);
    }
    numericIds.add(numericId);

    const directory = join(root, directoryName);
    const manifestPath = join(directory, "manifest.json");
    const manifestRaw = await readFile(manifestPath, "utf8");
    const manifest = manifestSchema.parse(JSON.parse(manifestRaw));

    if (manifest.id !== directoryName) {
      throw new Error(
        `Content migration manifest ${basename(manifestPath)} must use the directory name '${directoryName}' as its id.`,
      );
    }

    const payloadPath = resolve(directory, manifest.payload);
    if (!isChildPath(directory, payloadPath)) {
      throw new Error(`Content migration ${directoryName} has an invalid payload path.`);
    }

    let payloadRaw: string;
    try {
      payloadRaw = await readFile(payloadPath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        // A numbered directory may be reserved while research is in progress.
        // Keep the reservation visible on disk, but do not treat it as an
        // executable migration until its payload has been created.
        console.warn(`Skipping reserved content migration ${manifest.id}: payload is not present yet.`);
        continue;
      }
      throw error;
    }
    const payloadSchema = LEGACY_FREE_TEXT_MEDIUM_MIGRATION_IDS.has(manifest.id)
      ? legacyFreeTextMediumCatalogPayloadSchema
      : catalogPayloadSchema;
    const payload = payloadSchema.parse(JSON.parse(payloadRaw));
    const expiredEvidence = assertContentFramework(payload, manifest.id, now);
    migrations.push({
      id: manifest.id,
      description: manifest.description,
      createdAt: manifest.createdAt,
      directory,
      payloadPath,
      checksum: contentMigrationChecksum(manifestRaw, payloadRaw),
      payload,
      expiredEvidence,
    });
  }

  return migrations;
}

/**
 * Maps each university slug to the NEWEST local bundle (by sequence) whose payload contains it.
 * Reads every numbered bundle's payload as raw JSON, independent of `--id` scoping, so a scoped
 * validation still knows whether a later correction bundle supersedes the bundle being checked.
 * Reservations without a payload and unparseable payloads are skipped here; the unscoped
 * `readContentMigrations` run is what rejects malformed bundles.
 */
export async function readLatestMigrationIdByUniversitySlug(rootDirectory = "content-migrations") {
  const root = resolve(rootDirectory);
  const latest = new Map<string, string>();
  let entries: Dirent[];
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return latest;
    throw error;
  }

  const directories = entries
    .filter((entry) => entry.isDirectory() && migrationIdPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort(compareMigrationIds);

  for (const directoryName of directories) {
    try {
      const manifest = JSON.parse(await readFile(join(root, directoryName, "manifest.json"), "utf8")) as {
        payload?: unknown;
      };
      if (typeof manifest.payload !== "string") continue;
      const payloadPath = resolve(root, directoryName, manifest.payload);
      if (!isChildPath(join(root, directoryName), payloadPath)) continue;
      const payload = JSON.parse(await readFile(payloadPath, "utf8")) as {
        universities?: Array<{ slug?: unknown }>;
      };
      for (const university of payload.universities ?? []) {
        // Directories are visited in ascending sequence, so the last write wins as the newest.
        if (typeof university.slug === "string") latest.set(university.slug, directoryName);
      }
    } catch {
      continue;
    }
  }
  return latest;
}

/** True when every university in the bundle is also covered by a later local bundle. */
export function isFullySupersededMigration(
  migration: Pick<ContentMigration, "id" | "payload">,
  latestMigrationIdBySlug: ReadonlyMap<string, string>,
) {
  return (
    migration.payload.universities.length > 0 &&
    migration.payload.universities.every((university) => {
      const latest = latestMigrationIdBySlug.get(university.slug);
      return latest !== undefined && compareMigrationIds(latest, migration.id) > 0;
    })
  );
}

function describeExpiredEvidence(migrationId: string, evidence: ExpiredEvidence) {
  const target = evidence.programmeSlug ?? evidence.universitySlug ?? evidence.countrySlug ?? "payload";
  return `${migrationId} evidence for '${evidence.publicField}' (${target}) has an expired review-by date (${evidence.reviewBy}).`;
}

/**
 * Review-by expiry semantics.
 *
 * - Offline (`appliedIds` omitted): every expired date is a warning. Validation never fails on the
 *   passage of time alone, because applied bundles are checksum-locked and cannot be refreshed.
 * - Database-connected check/apply (`appliedIds` given): expired evidence in an APPLIED bundle is a
 *   warning (correct it with a later superseding bundle). Expired evidence in a PENDING bundle is an
 *   error, unless every university in that bundle is superseded by a later bundle that is also
 *   pending — that later bundle overwrites the same universities in the same run.
 */
export function classifyReviewByExpiry(
  migrations: ReadonlyArray<Pick<ContentMigration, "id" | "payload" | "expiredEvidence">>,
  options: {
    appliedIds?: ReadonlySet<string>;
    latestMigrationIdBySlug?: ReadonlyMap<string, string>;
  } = {},
) {
  const warnings: string[] = [];
  const errors: string[] = [];
  const { appliedIds, latestMigrationIdBySlug } = options;

  for (const migration of migrations) {
    if (migration.expiredEvidence.length === 0) continue;
    const messages = migration.expiredEvidence.map((evidence) => describeExpiredEvidence(migration.id, evidence));

    if (!appliedIds || appliedIds.has(migration.id)) {
      warnings.push(...messages);
      continue;
    }

    const supersededInSameRun =
      latestMigrationIdBySlug !== undefined &&
      isFullySupersededMigration(migration, latestMigrationIdBySlug) &&
      migration.payload.universities.every(
        (university) => !appliedIds.has(latestMigrationIdBySlug.get(university.slug)!),
      );
    if (supersededInSameRun) {
      warnings.push(...messages.map((message) => `${message} Pending bundle is superseded by a later pending bundle.`));
    } else {
      errors.push(...messages.map((message) => `${message} Pending bundles cannot be applied with expired evidence; re-verify in a new numbered bundle.`));
    }
  }

  return { warnings, errors };
}
