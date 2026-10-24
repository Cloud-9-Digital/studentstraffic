import assert from "node:assert/strict";
import test from "node:test";
import { universityVerificationDate } from "../scripts/lib/catalog-verification-date";

test("review dates come from the target university's checked claims, excluding omitted claims", () => {
  assert.equal(universityVerificationDate("target", [
    { universitySlug: "other", status: "verified", checkedAt: "2027-01-01" },
    { universitySlug: "target", status: "verified", checkedAt: "2026-10-20" },
    { universitySlug: "target", status: "indicative", checkedAt: "2026-10-24" },
    { universitySlug: "target", status: "omit", checkedAt: "2026-12-01" },
  ], [{ checkedAt: "2026-11-01" }]), "2026-10-24");
});

test("legacy source checks provide the date when there are no usable scoped claims", () => {
  assert.equal(universityVerificationDate("target", [], [
    { checkedAt: "2026-07-12" }, { checkedAt: "2026-10-23" },
  ]), "2026-10-23");
});

test("missing verification dates never silently become the publication date", () => {
  assert.throws(() => universityVerificationDate("target", [], []), /No verification date/);
});
