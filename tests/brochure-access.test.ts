import assert from "node:assert/strict";
import test from "node:test";

import {
  BROCHURE_ACCESS_MAX_AGE_SECONDS,
  brochureAccessCookieOptions,
  brochureContentDisposition,
  signBrochureAccessToken,
  verifyBrochureAccessToken,
} from "@/lib/brochure-access";
import { handleBrochureDownload, type BrochureDownloadDeps } from "@/lib/brochure-download";
import type { UniversityBrochure } from "@/lib/data/types";

const SECRET = "test-secret-for-brochure-access";
const NOW = Date.UTC(2026, 9, 26, 12, 0, 0);

test("a signed token verifies and carries the lead id", () => {
  const token = signBrochureAccessToken(4821, SECRET, NOW);
  assert.match(token, /^v1\.4821\.\d+\.[A-Za-z0-9_-]+$/);
  assert.deepEqual(verifyBrochureAccessToken(token, SECRET, NOW + 60_000), {
    leadId: 4821,
    issuedAt: Math.floor(NOW / 1000),
  });
});

test("tampered, foreign-secret, malformed and missing tokens are rejected", () => {
  const token = signBrochureAccessToken(4821, SECRET, NOW);
  const [version, , issuedAt, signature] = token.split(".");

  assert.equal(verifyBrochureAccessToken(`${version}.4822.${issuedAt}.${signature}`, SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken(`${version}.4821.${Number(issuedAt) + 1}.${signature}`, SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken(`${token}x`, SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken(token, "another-secret", NOW), null);
  assert.equal(verifyBrochureAccessToken(token, undefined, NOW), null);
  assert.equal(verifyBrochureAccessToken(undefined, SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken("", SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken("v1.0.1.abc", SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken(token.replace(/^v1/, "v2"), SECRET, NOW), null);
  assert.equal(verifyBrochureAccessToken("not-a-token", SECRET, NOW), null);
});

test("tokens expire after 180 days and cannot be issued in the future", () => {
  const token = signBrochureAccessToken(7, SECRET, NOW);
  const maxAgeMs = BROCHURE_ACCESS_MAX_AGE_SECONDS * 1000;
  assert.ok(verifyBrochureAccessToken(token, SECRET, NOW + maxAgeMs - 1000));
  assert.equal(verifyBrochureAccessToken(token, SECRET, NOW + maxAgeMs + 1000), null);
  assert.equal(verifyBrochureAccessToken(token, SECRET, NOW - 60 * 60 * 1000), null);
});

test("signing refuses invalid lead ids and an empty secret", () => {
  assert.throws(() => signBrochureAccessToken(0, SECRET));
  assert.throws(() => signBrochureAccessToken(1.5, SECRET));
  assert.throws(() => signBrochureAccessToken(1, ""));
});

test("the access cookie is httpOnly, lax, site-wide and lasts about 180 days", () => {
  assert.equal(brochureAccessCookieOptions.httpOnly, true);
  assert.equal(brochureAccessCookieOptions.sameSite, "lax");
  assert.equal(brochureAccessCookieOptions.path, "/");
  assert.equal(brochureAccessCookieOptions.maxAge, 180 * 24 * 60 * 60);
});

test("the download file name is the university name and is header-safe", () => {
  assert.equal(
    brochureContentDisposition("Anna University"),
    `attachment; filename="Anna University brochure.pdf"; filename*=UTF-8''Anna%20University%20brochure.pdf`,
  );
  const tricky = brochureContentDisposition('Évora "Uni"\r\nX-Evil: 1');
  assert.doesNotMatch(tricky, /[\r\n]/);
  assert.match(tricky, /^attachment; filename="Evora Uni X-Evil: 1 brochure\.pdf"; filename\*=UTF-8''/);
});

const brochure: UniversityBrochure = {
  publicId: "studentstraffic/brochures/anna-university/brochure.pdf",
  fileName: "prospectus.pdf",
  title: "Prospectus 2026-27",
  bytes: 9,
  sourceUrl: "https://example.edu/prospectus.pdf",
  sourceLabel: "Official website",
  checkedAt: "2026-10-26",
};

function makeDeps(overrides: Partial<BrochureDownloadDeps> = {}) {
  const calls = { fetched: 0, recorded: [] as Array<{ leadId: number; universitySlug: string }> };
  const deps: BrochureDownloadDeps = {
    secret: SECRET,
    now: () => NOW,
    getBrochure: async (slug) =>
      slug === "anna-university" ? { universityName: "Anna University", brochure } : null,
    fetchAsset: async () => {
      calls.fetched += 1;
      return new Response("%PDF-1.7", {
        status: 200,
        headers: { "content-type": "application/octet-stream", "content-length": "8" },
      });
    },
    recordDownload: (input) => {
      calls.recorded.push(input);
    },
    ...overrides,
  };
  return { deps, calls };
}

test("the download route answers 401 JSON without a valid cookie and never fetches the asset", async () => {
  for (const accessCookie of [undefined, "forged.token.value.x", signBrochureAccessToken(5, "other", NOW)]) {
    const { deps, calls } = makeDeps();
    const response = await handleBrochureDownload({ slug: "anna-university", accessCookie }, deps);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("content-type"), "application/json");
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal((await response.json()).error, "lead_required");
    assert.equal(calls.fetched, 0);
    assert.equal(calls.recorded.length, 0);
  }
});

test("the download route streams the PDF from our domain and records the lead's download", async () => {
  const { deps, calls } = makeDeps();
  const response = await handleBrochureDownload(
    { slug: "anna-university", accessCookie: signBrochureAccessToken(42, SECRET, NOW) },
    deps,
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(
    response.headers.get("content-disposition"),
    `attachment; filename="Anna University brochure.pdf"; filename*=UTF-8''Anna%20University%20brochure.pdf`,
  );
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("content-length"), "8");
  assert.equal(response.headers.get("location"), null);
  assert.equal(await response.text(), "%PDF-1.7");
  assert.deepEqual(calls.recorded, [{ leadId: 42, universitySlug: "anna-university" }]);
});

test("the download route returns 404 for unknown slugs and 502 when storage fails", async () => {
  const token = signBrochureAccessToken(42, SECRET, NOW);

  const missing = await handleBrochureDownload({ slug: "no-such-university", accessCookie: token }, makeDeps().deps);
  assert.equal(missing.status, 404);

  const badSlug = await handleBrochureDownload({ slug: "../etc/passwd", accessCookie: token }, makeDeps().deps);
  assert.equal(badSlug.status, 404);

  const { deps, calls } = makeDeps({ fetchAsset: async () => new Response("denied", { status: 401 }) });
  const failed = await handleBrochureDownload({ slug: "anna-university", accessCookie: token }, deps);
  assert.equal(failed.status, 502);
  assert.equal(calls.recorded.length, 0);
});

test("a failing download recorder does not block the student", async () => {
  const { deps } = makeDeps({
    recordDownload: async () => {
      throw new Error("db down");
    },
  });
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleBrochureDownload(
      { slug: "anna-university", accessCookie: signBrochureAccessToken(42, SECRET, NOW) },
      deps,
    );
    assert.equal(response.status, 200);
  } finally {
    console.error = originalError;
  }
});
