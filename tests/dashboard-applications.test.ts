import assert from "node:assert/strict";
import test from "node:test";

import {
  UNDECIDED_PROGRAMME_SLUG,
  buildCounsellorWhatsappHref,
  canEditApplication,
  getApplicationNextAction,
  getApplicationStatusMeta,
  getApplicationSteps,
  getInitialsColour,
  getProgrammeLabel,
  getUniversityInitials,
  normaliseStudentNote,
  parsePositiveId,
  parseStartApplicationInput,
  planStartApplication,
} from "../lib/dashboard/application-model";

test("status labels are plain language and unknown statuses fall back to Draft", () => {
  assert.equal(getApplicationStatusMeta("under_review").label, "In review");
  assert.equal(getApplicationStatusMeta("accepted").label, "Offer received");
  assert.equal(getApplicationStatusMeta("something_else").status, "draft");
});

test("steps map real statuses onto Draft → Submitted → In review → Decision", () => {
  const states = (status: string) => getApplicationSteps(status).map((step) => `${step.label}:${step.state}`);
  assert.deepEqual(states("draft"), ["Draft:current", "Submitted:upcoming", "In review:upcoming", "Decision:upcoming"]);
  assert.deepEqual(states("submitted"), ["Draft:done", "Submitted:current", "In review:upcoming", "Decision:upcoming"]);
  assert.deepEqual(states("waitlisted"), ["Draft:done", "Submitted:done", "Waitlisted:current", "Decision:upcoming"]);
  assert.deepEqual(states("accepted"), ["Draft:done", "Submitted:done", "In review:done", "Offer:done"]);
  assert.deepEqual(states("rejected").at(-1), "Closed:done");
});

test("next action: drafts continue, everything else is view-only", () => {
  assert.deepEqual(getApplicationNextAction("draft"), { label: "Continue", emphasis: "primary" });
  assert.equal(getApplicationNextAction("submitted").label, "View");
  assert.equal(canEditApplication("draft"), true);
  assert.equal(canEditApplication("submitted"), false);
});

test("start input: valid slugs pass, empty programme means undecided, junk is rejected", () => {
  assert.deepEqual(parseStartApplicationInput({ universitySlug: "can-tho-university", programmeSlug: "mbbs-can-tho" }), {
    ok: true,
    value: { universitySlug: "can-tho-university", programmeSlug: "mbbs-can-tho" },
  });
  const undecided = parseStartApplicationInput({ universitySlug: "a-b", programmeSlug: "" });
  assert.ok(undecided.ok && undecided.value.programmeSlug === UNDECIDED_PROGRAMME_SLUG);
  assert.equal(parseStartApplicationInput({ universitySlug: "../etc", programmeSlug: "x" }).ok, false);
  assert.equal(parseStartApplicationInput({ universitySlug: null, programmeSlug: "x" }).ok, false);
  assert.equal(parseStartApplicationInput({ universitySlug: "ok", programmeSlug: "Bad Slug" }).ok, false);
});

test("ids: only positive integers", () => {
  assert.equal(parsePositiveId("42"), 42);
  assert.equal(parsePositiveId(7), 7);
  for (const bad of ["0", "-1", "1.5", "abc", "", null, "12345678901"]) assert.equal(parsePositiveId(bad), null);
});

test("duplicate rule: an existing application for the university wins over creating another", () => {
  const programmes = [{ slug: "mbbs-x", title: "MBBS" }];
  assert.deepEqual(planStartApplication({ existingApplicationId: 9, programmeSlug: "mbbs-x", programmes }), { kind: "exists", applicationId: 9 });
  assert.deepEqual(planStartApplication({ existingApplicationId: null, programmeSlug: "mbbs-x", programmes }), {
    kind: "create",
    programme: programmes[0],
  });
  assert.deepEqual(planStartApplication({ existingApplicationId: null, programmeSlug: "other", programmes }), { kind: "invalid_programme" });
  assert.deepEqual(planStartApplication({ existingApplicationId: null, programmeSlug: UNDECIDED_PROGRAMME_SLUG, programmes: [] }), {
    kind: "create",
    programme: null,
  });
});

test("note is trimmed and capped", () => {
  assert.equal(normaliseStudentNote("  hi \r\n\n\n\nthere  "), "hi\n\nthere");
  assert.equal(normaliseStudentNote(123), "");
  assert.equal(normaliseStudentNote("x".repeat(5000)).length, 1000);
});

test("programme label prefers catalogue title, then saved title, then slug", () => {
  assert.equal(getProgrammeLabel("mbbs-x", "MBBS (English)", "Old"), "MBBS (English)");
  assert.equal(getProgrammeLabel("mbbs-x", null, "Saved title"), "Saved title");
  assert.equal(getProgrammeLabel("general-medicine"), "General medicine");
  assert.equal(getProgrammeLabel(UNDECIDED_PROGRAMME_SLUG), "Programme not chosen yet");
});

test("logo fallback initials and stable colours", () => {
  assert.equal(getUniversityInitials("University of Legia and Company"), "UL");
  assert.equal(getUniversityInitials("Can Tho University of Medicine and Pharmacy"), "CT");
  assert.equal(getUniversityInitials("  "), "U");
  assert.equal(getInitialsColour("Aalto University"), getInitialsColour("Aalto University"));
});

test("WhatsApp link carries the reference, not personal data", () => {
  const href = buildCounsellorWhatsappHref({ universityName: "Dong A University", programmeLabel: "MBBS", applicationId: 12 });
  assert.match(href, /^https:\/\/wa\.me\/\d+\?text=/);
  const text = decodeURIComponent(href.split("text=")[1]);
  assert.equal(text, "Hi Students Traffic, I'd like a counsellor to review my application to Dong A University for MBBS (application #12).");
});
