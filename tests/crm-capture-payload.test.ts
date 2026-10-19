import assert from "node:assert/strict";
import test from "node:test";

import { buildCrmCapturePayload } from "../lib/crm-capture-payload";
import type { LeadSyncPayload } from "../lib/lead-sync-payload";

const lead: LeadSyncPayload = {
  websiteLeadId: 42,
  submittedAt: "2026-10-19T00:00:00.000Z",
  fullName: "Test Lead",
  phone: "+919999999999",
  sourcePath: "/contact",
  sourceQuery: {},
  ctaVariant: "contact_form",
  clientContext: {},
};

test("scoped capture uses the website lead ID and retains details in notes", () => {
  const body = buildCrmCapturePayload({
    ...lead,
    fatherName: "Parent",
    city: "Hyderabad",
    needsFmgeSession: false,
    utmCampaign: "mbbs",
    notes: "Call me",
  });
  assert.equal(body.externalId, "studentstraffic:42");
  assert.equal(body.source, "Website");
  assert.equal("fields" in body, false);
  assert.match(body.notes, /Father: Parent/);
  assert.match(body.notes, /City: Hyderabad/);
  assert.match(body.notes, /FMGE session: no/);
  assert.equal(body.attribution.utmCampaign, "mbbs");
  assert.match(body.notes, /Call me/);
});

test("scoped capture preserves WATI, seminar, and campaign source labels", () => {
  assert.equal(buildCrmCapturePayload({ ...lead, sourcePath: "/wati" }).source, "WATI");
  assert.equal(buildCrmCapturePayload({ ...lead, sourcePath: "/seminar-2026/register" }).source, "Seminar 2026");
  assert.equal(buildCrmCapturePayload({ ...lead, sourcePath: "/free-mbbs-counselling-2026" }).source, "MBBS in 10 Lakhs");
});

test("scoped capture caps timeline notes at the API limit", () => {
  const body = buildCrmCapturePayload({ ...lead, notes: "x".repeat(10_000) });
  assert.equal(body.notes.length <= 5000, true);
  assert.match(body.notes, /^Notes: x/);
});
