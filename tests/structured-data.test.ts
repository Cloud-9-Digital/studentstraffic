import assert from "node:assert/strict";
import test from "node:test";

import type { FinderProgram } from "@/lib/data/types";
import {
  getFaqStructuredData,
  getProgramOfferingStructuredData,
  getProgramStructuredDataId,
} from "@/lib/structured-data";

const program = {
  country: {
    slug: "vietnam",
    name: "Vietnam",
  },
  course: {
    slug: "mbbs",
    shortName: "MBBS",
  },
  university: {
    slug: "example-university",
    name: "Example University",
    city: "Hanoi",
  },
  offering: {
    slug: "example-university-mbbs",
    title: "Doctor of Medicine",
    durationYears: 6,
    annualTuitionUsd: 5000,
    medium: "English",
  },
} as unknown as FinderProgram;

test("program offering schema uses the offering URL and university provider", () => {
  const schema = getProgramOfferingStructuredData(program);

  assert.equal(schema["@type"], "Course");
  assert.equal(schema["@id"], getProgramStructuredDataId("example-university-mbbs"));
  assert.match(schema.url, /\/example-university-mbbs$/);
  assert.equal(schema.provider["@type"], "CollegeOrUniversity");
  assert.equal(schema.provider["@id"], "http://localhost:3000/university/example-university#institution");
  assert.ok(schema.offers);
  assert.equal(schema.offers.priceCurrency, "USD");
  assert.equal(schema.mainEntityOfPage["@id"], "http://localhost:3000/example-university-mbbs#webpage");
});

test("FAQ schema preserves question and accepted answer structure", () => {
  const schema = getFaqStructuredData(
    [{ question: "Is this a real question?", answer: "Yes." }],
    "/example-university-mbbs",
  );

  assert.equal(schema["@type"], "FAQPage");
  assert.equal(schema.mainEntity.length, 1);
  assert.equal(schema.mainEntity[0]["@type"], "Question");
  assert.equal(schema.mainEntity[0].acceptedAnswer["@type"], "Answer");
});
