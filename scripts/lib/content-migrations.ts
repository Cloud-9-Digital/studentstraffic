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
    migrations.push({
      id: manifest.id,
      description: manifest.description,
      createdAt: manifest.createdAt,
      directory,
      payloadPath,
      checksum: contentMigrationChecksum(manifestRaw, payloadRaw),
      payload: catalogPayloadSchema.parse(JSON.parse(payloadRaw)),
    });
  }

  return migrations;
}
