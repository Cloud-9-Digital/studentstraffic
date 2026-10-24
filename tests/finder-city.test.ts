import assert from "node:assert/strict";
import test from "node:test";
import { PgDialect, pgTable, text } from "drizzle-orm/pg-core";

import { finderCityCondition, matchesFinderCity, normalizeFinderCity } from "../lib/finder-city";

test("country and city browsing matches the normalized cache key to the stored city", () => {
  const offerings = [
    { country: "india", city: "Chennai", university: "Anna University" },
    { country: "india", city: "Coimbatore", university: "Bharathiar University" },
    { country: "other", city: "Chennai", university: "Other institution" },
  ];
  const city = normalizeFinderCity("Chennai");
  assert.equal(city, "chennai");
  assert.deepEqual(
    offerings.filter((row) => row.country === "india" && matchesFinderCity(row.city, city))
      .map((row) => row.university),
    ["Anna University"],
  );
});

test("city matching handles casing and whitespace without matching different cities", () => {
  assert.ok(matchesFinderCity("New   Delhi", " NEW DELHI "));
  assert.ok(matchesFinderCity("\tChennai\n", "chennai"));
  assert.equal(matchesFinderCity("Chennai", "Chengalpattu"), false);
  assert.equal(matchesFinderCity("Chennai", "Chennai, Tamil Nadu"), false);
});

test("database city predicate normalizes the stored display value and binds the city safely", () => {
  const universities = pgTable("universities", { city: text("city").notNull() });
  const query = new PgDialect().sqlToQuery(finderCityCondition(universities.city, " Chennai "));
  assert.equal(query.sql, 'lower(trim(regexp_replace("universities"."city", $1, $2, $3))) = $4');
  assert.deepEqual(query.params, ["[[:space:]]+", " ", "g", "chennai"]);
  const literal = new PgDialect().sqlToQuery(finderCityCondition(universities.city, "O'Fallon%"));
  assert.equal(literal.params[3], "o'fallon%");
  assert.ok(!literal.sql.includes("O'Fallon"));
});
