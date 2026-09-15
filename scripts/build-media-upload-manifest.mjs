import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const mediaDirectory = resolve("research/media-enrichment");
const outputPath = resolve(mediaDirectory, "reviewed-upload-manifest.json");
const batchFiles = (await readdir(mediaDirectory))
  .filter((file) => /^(?:a-|india-pilot-).*\.json$/u.test(file))
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

const entries = [];
let auditedUniversities = 0;
for (const file of batchFiles) {
  const parsed = JSON.parse(await readFile(resolve(mediaDirectory, file), "utf8"));
  const batchEntries = Array.isArray(parsed) ? parsed : parsed.entries;
  if (!Array.isArray(batchEntries)) {
    throw new Error(`${file} does not contain an entries array.`);
  }
  auditedUniversities += batchEntries.length;

  for (const entry of batchEntries) {
    if (entry.status !== "ready") continue;
    // A ready entry resolves at least one of logo/cover; the other may remain
    // outstanding (documented in `reason`) when only one asset was confidently
    // verified for a university missing both.
    const resolvedFields = ["logo", "cover"].filter((field) => entry[field]?.sourceUrl);
    if (!resolvedFields.length) {
      throw new Error(`${file}: ready entry ${entry.universitySlug} has no resolved logo or cover source.`);
    }

    entries.push({
      universitySlug: entry.universitySlug,
      universityName: entry.universityName,
      sourceBatch: file,
      assets: resolvedFields.map((kind) => ({
        kind,
        sourceUrl: entry[kind].sourceUrl,
        sourceType: entry[kind].sourceType,
        rightsBasis: entry[kind].rightsBasis,
        proposedPublicId: `studentstraffic/universities/${entry.universitySlug}/${kind}`,
      })),
    });
  }
}

entries.sort((left, right) => left.universitySlug.localeCompare(right.universitySlug));
const duplicateSlugs = entries.filter(
  (entry, index) => index > 0 && entries[index - 1].universitySlug === entry.universitySlug,
);
if (duplicateSlugs.length) {
  throw new Error(`Duplicate ready entries: ${duplicateSlugs.map(({ universitySlug }) => universitySlug).join(", ")}`);
}

const manifest = {
  manifestId: "university-media-upload-review-2026-07-25",
  status: "reviewed-offline-pending-controlled-upload",
  generatedFrom: batchFiles,
  rules: [
    "This manifest permits neither direct database writes nor automatic Cloudinary uploads.",
    "A controlled integrator must upload every asset, verify the Cloudinary response, and retain source provenance before any database update.",
    "Only a verified Cloudinary URL may be applied to the catalogue; hold entries are excluded and require a new evidence batch.",
  ],
  summary: {
    auditedUniversities,
    readyUniversities: entries.length,
    approvedAssets: entries.reduce((total, entry) => total + entry.assets.length, 0),
    heldUniversities: auditedUniversities - entries.length,
  },
  entries,
};

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${entries.length} ready universities / ${manifest.summary.approvedAssets} assets to ${outputPath}`,
);
