import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  EMPTY_NAV_COUNTS,
  avatarInitial,
  formatBadgeCount,
  getBadgeCount,
  getMobileNav,
  getNavSections,
  isNavItemActive,
} from "../lib/dashboard/nav";
import { getNextSteps, missingPreferences, type NextStepsInput } from "../lib/dashboard/next-steps";

test("student-only users see one nav section with clear labels, including Calls", () => {
  const sections = getNavSections(false);
  assert.equal(sections.length, 1);
  assert.deepEqual(
    sections[0].items.map((item) => item.label),
    ["Home", "Messages", "Calls", "Shortlists", "Applications", "Settings"],
  );
});

test("guides also see a guide section with distinct labels", () => {
  const sections = getNavSections(true);
  assert.deepEqual(
    sections[1].items.map((item) => item.label),
    ["Guide home", "Guide inbox", "Call requests", "My students", "Guide profile"],
  );
  const labels = sections.flatMap((section) => section.items.map((item) => item.label));
  assert.equal(new Set(labels).size, labels.length, "no duplicate labels");
});

test("mobile bottom bar has 4 items plus More, the rest go behind More", () => {
  for (const isGuide of [false, true]) {
    const { primary, more } = getMobileNav(isGuide);
    assert.deepEqual(primary.map((item) => item.label), ["Home", "Messages", "Calls", "Shortlists"]);
    assert.ok(primary.length + 1 <= 5);
    const all = getNavSections(isGuide).flatMap((section) => section.items);
    assert.equal(primary.length + more.length, all.length);
  }
  assert.deepEqual(getMobileNav(false).more.map((item) => item.label), ["Applications", "Settings"]);
});

test("section roots are only active on their exact path", () => {
  const home = { href: "/dashboard", exact: true };
  const guideHome = { href: "/dashboard/peer", exact: true };
  const messages = { href: "/dashboard/messages" };
  assert.equal(isNavItemActive("/dashboard", home), true);
  assert.equal(isNavItemActive("/dashboard/messages", home), false);
  assert.equal(isNavItemActive("/dashboard/peer/messages", guideHome), false);
  assert.equal(isNavItemActive("/dashboard/messages/42", messages), true);
  assert.equal(isNavItemActive("/dashboard/peer/messages", messages), false);
  assert.equal(isNavItemActive("/dashboard/messagesx", messages), false);
});

test("badges read the right count and format large numbers", () => {
  const counts = { ...EMPTY_NAV_COUNTS, studentUnread: 3, pendingRequests: 120 };
  assert.equal(getBadgeCount({ badge: "studentUnread" }, counts), 3);
  assert.equal(getBadgeCount({ badge: "guideUnread" }, counts), 0);
  assert.equal(getBadgeCount({}, counts), 0);
  assert.equal(formatBadgeCount(0), null);
  assert.equal(formatBadgeCount(-1), null);
  assert.equal(formatBadgeCount(7), "7");
  assert.equal(formatBadgeCount(120), "99+");
});

test("avatar initial falls back from name to email", () => {
  assert.equal(avatarInitial("bharath v", "x@y.z"), "B");
  assert.equal(avatarInitial(null, "student@example.com"), "S");
  assert.equal(avatarInitial("  ", null), "?");
});

const base: NextStepsInput = {
  unreadMessages: 0,
  latestUnread: null,
  shortlistCount: 0,
  applicationCount: 0,
  bookingCount: 1,
  preferences: { neetScore: 520, budgetUsd: 30000, preferredCountries: ["Georgia"] },
};

test("unread messages come first and name the guide", () => {
  const steps = getNextSteps({ ...base, unreadMessages: 3, latestUnread: { name: "Bharath Kumar", unread: 2 }, shortlistCount: 2, applicationCount: 1 });
  assert.equal(steps[0].kind, "reply");
  assert.equal(steps[0].title, "Reply to Bharath (2 unread)");
  assert.match(steps[0].description, /1 more unread/);
  assert.equal(steps[0].href, "/dashboard/messages");
});

test("shortlisted without applications suggests starting one", () => {
  const steps = getNextSteps({ ...base, shortlistCount: 6 });
  assert.deepEqual(steps.map((step) => step.kind), ["apply"]);
  assert.equal(steps[0].title, "Start an application for one of your 6 shortlisted universities");
  assert.equal(steps[0].href, "/dashboard/shortlists");
});

test("no shortlist suggests browsing; incomplete preferences list what is missing", () => {
  const steps = getNextSteps({ ...base, bookingCount: 0, preferences: { neetScore: null, budgetUsd: 20000, preferredCountries: [] } });
  assert.deepEqual(steps.map((step) => step.kind), ["browse", "preferences", "guide"]);
  assert.match(steps[1].description, /NEET score and preferred countries/);
  assert.deepEqual(missingPreferences(base.preferences), []);
});

test("a student with everything done gets no steps (section is hidden)", () => {
  assert.deepEqual(getNextSteps({ ...base, shortlistCount: 3, applicationCount: 1 }), []);
});

test("nav counts use one COUNT-only query keyed by email", async () => {
  const source = await readFile(path.join(process.cwd(), "lib/dashboard/nav-counts.ts"), "utf8");
  assert.match(source, /cache\(/);
  assert.match(source, /eq\(users\.email, email\)/);
  assert.equal((source.match(/await db/g) ?? []).length, 1);
  assert.equal((source.match(/count\(\*\)::integer/g) ?? []).length, 3);
  assert.doesNotMatch(source, /m\.body|last_message_text/);
});
