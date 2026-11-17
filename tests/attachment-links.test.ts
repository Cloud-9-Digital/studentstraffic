import assert from "node:assert/strict";
import test from "node:test";

import { attachmentKey, attachmentUrl, guidePhotoFromApplication } from "../lib/attachment-links";

const siteUrl = "https://example.test";
const photo = `${"a".repeat(64)}.jpg`;

test("a published application portrait keeps the same R2 object but has a different access route", () => {
  const source = attachmentUrl(siteUrl, "application-photo", photo);
  assert.equal(guidePhotoFromApplication(source, siteUrl), attachmentUrl(siteUrl, "guide-application-photo", photo));
  assert.equal(attachmentKey("guide-application-photo", photo), attachmentKey("application-photo", photo));
});

test("a guide portrait cannot be derived from a proof, an external lookalike URL, or a malformed path", () => {
  const proof = attachmentUrl(siteUrl, "application-proof", photo);
  assert.equal(guidePhotoFromApplication(proof, siteUrl), proof);
  const lookalike = attachmentUrl("https://example.test.invalid", "application-photo", photo);
  assert.equal(guidePhotoFromApplication(lookalike, siteUrl), lookalike);
  assert.equal(attachmentKey("guide-photo", `${"a".repeat(64)}.pdf`), undefined);
  assert.equal(attachmentKey("application-proof", `../${photo}`), undefined);
  assert.equal(attachmentKey("brochures", photo), undefined);
});
