import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { readReviewedMediaOriginal } from "../scripts/lib/reviewed-media-original";

function withOriginal(run: (root: string, path: string, bytes: Buffer, checksum: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "reviewed-media-"));
  try {
    const folder = join(root, "research/india-source-bundles/institution");
    mkdirSync(folder, { recursive: true });
    const path = join(folder, "logo.png");
    const bytes = Buffer.concat([
      Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jM1sAAAAASUVORK5CYII=", "base64"),
      Buffer.alloc(600),
    ]);
    writeFileSync(path, bytes);
    run(root, path, bytes, createHash("sha256").update(bytes).digest("hex"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const sourceUrl = "https://university.example/official-logo.png";

test("reviewed local media returns the exact original bytes", () => {
  withOriginal((root, localPath, bytes, sha256) => {
    assert.deepEqual(readReviewedMediaOriginal(root, { localPath, sha256, sourceUrl }), bytes);
  });
});

test("changed original fails its reviewed checksum", () => {
  withOriginal((root, localPath, bytes, sha256) => {
    writeFileSync(localPath, Buffer.concat([bytes, Buffer.from("changed")]));
    assert.throws(() => readReviewedMediaOriginal(root, { localPath, sha256, sourceUrl }), /checksum/);
  });
});

test("a saved challenge page is rejected even with a matching checksum", () => {
  withOriginal((root, localPath) => {
    const html = Buffer.from("<html>Challenge page</html>".repeat(40));
    writeFileSync(localPath, html);
    const sha256 = createHash("sha256").update(html).digest("hex");
    assert.throws(() => readReviewedMediaOriginal(root, { localPath, sha256, sourceUrl }), /not a supported/);
  });
});

test("a symlink cannot escape the reviewed source directory", () => {
  withOriginal((root, localPath, bytes, sha256) => {
    const outside = join(root, "outside.png");
    writeFileSync(outside, bytes);
    rmSync(localPath);
    symlinkSync(outside, localPath);
    assert.throws(() => readReviewedMediaOriginal(root, { localPath, sha256, sourceUrl }), /inside research/);
  });
});

test("local input requires both source attribution and a reviewed checksum", () => {
  withOriginal((root, localPath, _bytes, sha256) => {
    assert.throws(() => readReviewedMediaOriginal(root, { localPath, sourceUrl }), /checksum/);
    assert.throws(() => readReviewedMediaOriginal(root, { localPath, sha256, sourceUrl: "file:///logo.png" }), /HTTPS/);
  });
});
