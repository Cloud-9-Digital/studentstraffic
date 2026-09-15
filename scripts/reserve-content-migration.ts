import { mkdir, open, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function argument(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireArgument(name: string) {
  const value = argument(name);
  if (!value) throw new Error(`--${name} is required.`);
  return value;
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function wait(milliseconds: number) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function acquireDirectoryLock(path: string) {
  const startedAt = Date.now();
  while (true) {
    try {
      const handle = await open(path, "wx");
      await handle.writeFile(JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
      return handle;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      try {
        const lock = JSON.parse(await readFile(path, "utf8")) as { createdAt?: string };
        const createdAt = lock.createdAt ? new Date(lock.createdAt).getTime() : Number.NaN;
        if (!Number.isNaN(createdAt) && Date.now() - createdAt > 60_000) {
          await unlink(path);
          continue;
        }
      } catch {
        // The lock may be between creation and metadata write; retry below.
      }
      if (Date.now() - startedAt > 5_000) throw new Error("Timed out waiting for the content-migration sequence lock.");
      await wait(100);
    }
  }
}

export async function reserveContentMigration(options: {
  root?: string;
  name: string;
  description: string;
  createdAt?: Date;
}) {
  const root = resolve(options.root ?? "content-migrations");
  const name = normalizeName(options.name);
  const description = options.description;
  if (!name) throw new Error("--name must contain letters or numbers.");
  if (description.length < 10 || description.length > 300) throw new Error("--description must be 10-300 characters.");

  await mkdir(root, { recursive: true });
  const lockPath = join(root, ".sequence.lock");
  const lockHandle = await acquireDirectoryLock(lockPath);
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const usedNumbers = entries
      .filter((entry) => entry.isDirectory() && /^\d{4}-/.test(entry.name))
      .map((entry) => Number(entry.name.slice(0, 4)));
    const nextNumber = Math.max(0, ...usedNumbers) + 1;
    if (nextNumber > 9_999) throw new Error("Content migration sequence is exhausted.");
    const id = `${String(nextNumber).padStart(4, "0")}-${name}`;
    const directory = join(root, id);
    await mkdir(directory);
    await writeFile(join(directory, "manifest.json"), JSON.stringify({
      version: 1,
      id,
      description,
      createdAt: (options.createdAt ?? new Date()).toISOString().slice(0, 10),
      payload: "payload.json",
    }, null, 2) + "\n", "utf8");
    return { id, directory, payload: join(directory, "payload.json") };
  } finally {
    await lockHandle.close();
    await unlink(lockPath).catch(() => undefined);
  }
}

async function main() {
  const result = await reserveContentMigration({
    root: argument("root"),
    name: requireArgument("name"),
    description: requireArgument("description"),
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/reserve-content-migration.ts")) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
