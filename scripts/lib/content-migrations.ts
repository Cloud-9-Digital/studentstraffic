import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";

import { z } from "zod";

import { catalogPayloadSchema, type CatalogPayload } from "./catalog-payload-schema";

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

export type ContentMigration = {
  id: string;
  description: string;
  createdAt: string;
  directory: string;
  payloadPath: string;
  checksum: string;
  payload: CatalogPayload;
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

function assertFutureReviewDate(value: string, context: string) {
  const reviewBy = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(reviewBy.getTime()) || reviewBy.getTime() < Date.now()) {
    throw new Error(`${context} has an expired review-by date (${value}).`);
  }
}

function assertContentFramework(payload: CatalogPayload, migrationId: string) {
  for (const evidence of payload.evidence) {
    if (evidence.sourceGrade === "C") {
      throw new Error(`${migrationId} includes Grade C evidence for '${evidence.publicField}'. Grade C sources are discovery-only.`);
    }
    assertFutureReviewDate(evidence.reviewBy, `${migrationId} evidence for '${evidence.publicField}'`);
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
}

function compareMigrationIds(left: string, right: string) {
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

export async function readContentMigrations(rootDirectory = "content-migrations") {
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
    .sort(compareMigrationIds);

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

    const payloadRaw = await readFile(payloadPath, "utf8");
    const payload = catalogPayloadSchema.parse(JSON.parse(payloadRaw));
    assertContentFramework(payload, manifest.id);
    migrations.push({
      id: manifest.id,
      description: manifest.description,
      createdAt: manifest.createdAt,
      directory,
      payloadPath,
      checksum: contentMigrationChecksum(manifestRaw, payloadRaw),
      payload,
    });
  }

  return migrations;
}
