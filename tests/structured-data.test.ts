import assert from "node:assert/strict";
import test from "node:test";

import type { FinderProgram, University } from "@/lib/data/types";
import {
  getArticleStructuredData,
  getFaqStructuredData,
  getProgramOfferingStructuredData,
  getProgramStructuredDataId,
  getUniversityStructuredData,
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
    instructionLanguages: ["english"],
  },
} as unknown as FinderProgram;

test("program offering schema uses the offering URL and university provider", () => {
  const schema = getProgramOfferingStructuredData(program);

  assert.deepEqual(schema["@type"], ["Course", "EducationalOccupationalProgram"]);
  assert.equal(schema.inLanguage, "en");
  assert.equal(schema.timeToComplete, "P6Y");
  assert.equal(schema["@id"], getProgramStructuredDataId("example-university-mbbs"));
  assert.match(schema.url, /\/example-university-mbbs$/);
  assert.equal(schema.provider["@type"], "CollegeOrUniversity");
  assert.equal(schema.provider["@id"], "http://localhost:3000/university/example-university#institution");
  assert.ok(schema.offers);
  assert.equal(schema.offers.priceCurrency, "USD");
  assert.equal(schema.mainEntityOfPage["@id"], "http://localhost:3000/example-university-mbbs#webpage");
});

test("program offering schema uses the official currency and omits unconfirmed facts", () => {
  const schema = getProgramOfferingStructuredData({
    ...program,
    offering: {
      ...program.offering,
      officialFeeCurrency: "INR",
      officialAnnualTuitionAmount: 250000,
      instructionLanguages: [],
    },
  } as FinderProgram);

  assert.equal(schema.offers?.priceCurrency, "INR");
  assert.equal(schema.offers?.price, 250000);
  assert.equal(schema.offers?.priceSpecification.referenceQuantity.unitCode, "ANN");
  assert.equal(schema.inLanguage, undefined);

  const indicative = getProgramOfferingStructuredData({
    ...program,
    offering: { ...program.offering, feeStatus: "indicative" },
  } as FinderProgram);
  assert.equal(indicative.offers, undefined);
});

test("university schema references offerings by @id instead of repeating them", () => {
  const schema = getUniversityStructuredData({
    university: {
      slug: "example-university",
      name: "Example University",
      city: "Hanoi",
      summary: "",
      officialWebsite: "https://example.edu",
      establishedYear: 1990,
    } as University,
    country: program.country,
    programs: [program],
  });

  assert.deepEqual(schema.hasCourse, [
    { "@id": getProgramStructuredDataId("example-university-mbbs") },
  ]);
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

test("article schema makes a relative image URL absolute", () => {
  const schema = getArticleStructuredData({
    path: "/mbbs-in-russia-fees",
    headline: "MBBS in Russia fees",
    description: "Fees",
    datePublished: "2026-05-23",
    dateModified: "2026-05-23",
    image: "/images/countries/russia-hero.jpg",
  });

  assert.equal(schema.image.url, "http://localhost:3000/images/countries/russia-hero.jpg");
});
