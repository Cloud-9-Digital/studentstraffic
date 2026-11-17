/** Upload a prepared public image without changing content rows or triggering a release. */
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { parse } from "dotenv";
import { uploadPublicCoverToR2 } from "../lib/r2-storage";

const source = process.argv[2];
const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".gif": "image/gif",
};

async function main() {
  if (!source || !mimeByExt[extname(source).toLowerCase()]) {
    throw new Error("Pass a JPG, PNG, WebP or GIF public image.");
  }
  const local = await readFile(".env.local", "utf8").catch(() => "");
  for (const [key, value] of Object.entries(parse(local))) {
    if (key.startsWith("R2_")) process.env[key] ??= value;
  }
  const bytes = await readFile(source);
  const url = await uploadPublicCoverToR2(new File([new Uint8Array(bytes)], "public-image", {
    type: mimeByExt[extname(source).toLowerCase()],
  }));
  if (!url) throw new Error("Public R2 credentials are not configured.");
  const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15_000) });
  if (!response.ok || response.headers.get("Content-Type")?.split(";")[0] !== "image/webp") {
    throw new Error("The public R2 image did not pass verification.");
  }
  console.log(url);
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Public upload failed");
  process.exitCode = 1;
});
