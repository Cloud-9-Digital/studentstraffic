import assert from "node:assert/strict";
import test from "node:test";
import { mapMobileGuide } from "../lib/mobile/guide-directory";
const row = { id: 1, fullName: "Guide", photoUrl: null, courseName: "MBBS", currentYearOrBatch: "Year 3", languages: ["English"], universityName: "University", universitySlug: "university", countryName: "Country", acceptingRequests: true, bookingStatus: null, bookingUpdatedAt: null };
test("directory payload is an allowlist without contact or account fields", () => {
  const result = mapMobileGuide({ ...row, contactPhone: "1234567890", contactEmail: "private@example.com", peerUserId: "private" } as typeof row);
  assert.equal("contactPhone" in result, false);
  assert.equal("contactEmail" in result, false);
  assert.equal("peerUserId" in result, false);
  assert.equal(result.requestState, "available");
});
test("profile narrative fields redact contact details", () => {
  const result = mapMobileGuide({ ...row, courseName: "Contact me at private@example.com", languages: ["@myhandle"] });
  assert.ok(!result.courseName?.includes("private@example.com"));
  assert.ok(!result.languages.join().includes("@myhandle"));
});
test("pause does not hide an existing connection or pending request", () => {
  for (const status of ["pending", "accepted"]) assert.equal(mapMobileGuide({ ...row, acceptingRequests: false, bookingStatus: status }).requestState, status);
  assert.equal(mapMobileGuide({ ...row, acceptingRequests: false }).requestState, "paused");
});
test("declined requests observe seven days before another request", () => {
  const now = Date.parse("2026-09-09T00:00:00Z");
  assert.equal(mapMobileGuide({ ...row, bookingStatus: "declined", bookingUpdatedAt: new Date(now - 86400000) }, now).requestState, "cooldown");
  assert.equal(mapMobileGuide({ ...row, bookingStatus: "declined", bookingUpdatedAt: new Date(now - 8 * 86400000) }, now).requestState, "available");
});
test("missing optional profile details remain absent", () => {
  const result = mapMobileGuide({ ...row, courseName: null, currentYearOrBatch: null, languages: null });
  assert.equal(result.courseName, null);
  assert.equal(result.currentYearOrBatch, null);
  assert.deepEqual(result.languages, []);
});
