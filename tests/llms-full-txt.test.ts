import assert from "node:assert/strict";
import test from "node:test";

import { renderLlmsFullTxt } from "@/lib/llms-full-txt";
import { absoluteUrl } from "@/lib/metadata";

const body = renderLlmsFullTxt({
  countries: [{ slug: "india", name: "India", region: "Asia", summary: "Indian colleges." }],
  courses: [{ slug: "mbbs", name: "Bachelor of Medicine", shortName: "MBBS", durationYears: 5.5, summary: "Medicine." }],
  universities: [
    {
      slug: "example-university",
      name: "Example University",
      countrySlug: "india",
      city: "Chennai",
      type: "Private",
      recognitionBadges: ["NMC - Approved medical college", "UGC - Listed"],
      programmeCount: 12,
    },
    {
      slug: "solo-college",
      name: "Solo College",
      countrySlug: "india",
      city: "Madurai",
      type: "Public",
      recognitionBadges: [],
      programmeCount: 1,
    },
  ],
  posts: [],
});

test("keeps the header, explanation and counselling contacts", () => {
  assert.match(body, /^# Students Traffic — Full Content Index\n/);
  assert.match(body, /markdown view at its URL plus `\.md`/);
  assert.match(body, /## Evergreen Pages/);
  assert.match(body, /## Free counselling/);
  assert.ok(body.includes(`- Contact: ${absoluteUrl("/contact")}`));
  assert.match(body, /- WhatsApp: https:\/\/wa\.me\/\d+/);
});

test("lists each university on one line with page and markdown URLs", () => {
  const line = body.split("\n").find((entry) => entry.startsWith("- Example University:"));
  assert.equal(
    line,
    `- Example University: Chennai, India; Private; NMC - Approved medical college; 12 programmes. ${absoluteUrl("/university/example-university")} (markdown: ${absoluteUrl("/university/example-university.md")})`,
  );
  assert.ok(body.includes("- Solo College: Madurai, India; Public; 1 programme. "));
});

test("does not export programme lists or fees", () => {
  assert.doesNotMatch(body, /- Programs:/);
  assert.doesNotMatch(body, /\/year|₹|\$\d/);
  assert.doesNotMatch(body, /UGC - Listed/);
});
