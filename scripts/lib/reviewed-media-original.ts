import { createHash } from "node:crypto";
import { readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

export function readReviewedMediaOriginal(
  root: string,
  asset: { localPath?: string; sha256?: string; sourceUrl: string },
) {
  if (!asset.localPath || !/^[a-f0-9]{64}$/i.test(asset.sha256 ?? "")) {
    throw new Error("Reviewed local media requires a localPath and SHA-256 checksum.");
  }
  if (new URL(asset.sourceUrl).protocol !== "https:") {
    throw new Error("Reviewed local media requires its original HTTPS source URL.");
  }
  const sourceRoot = realpathSync(resolve(root, "research/india-source-bundles"));
  const path = realpathSync(resolve(root, asset.localPath));
  const fromSourceRoot = relative(sourceRoot, path);
  if (!fromSourceRoot || fromSourceRoot === ".." || fromSourceRoot.startsWith("../") || isAbsolute(fromSourceRoot)) {
    throw new Error("Reviewed local media must be inside research/india-source-bundles.");
  }
  const stat = statSync(path);
  if (!stat.isFile() || stat.size < 500 || stat.size > 30 * 1024 * 1024) {
    throw new Error("Reviewed local media must be an image file between 500 bytes and 30 MiB.");
  }
  const bytes = readFileSync(path);
  const isImage = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    || bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
    || ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))
    || (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");
  if (!isImage) throw new Error("Reviewed local media is not a supported PNG, JPEG, GIF or WebP image.");
  if (createHash("sha256").update(bytes).digest("hex") !== asset.sha256!.toLowerCase()) {
    throw new Error("Reviewed local media checksum does not match the reviewed original.");
  }
  return bytes;
}
