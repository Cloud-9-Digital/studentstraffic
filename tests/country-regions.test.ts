import assert from "node:assert/strict";
import test from "node:test";

import { getNavRegionId, NAV_REGIONS } from "@/lib/country-regions";

test("maps every region value currently stored in the database", () => {
  const expected: Record<string, string> = {
    Europe: "europe",
    "Southeast Europe": "europe",
    "Eastern Europe": "europe",
    Caucasus: "europe",
    "East Asia": "asia",
    "Southeast Asia": "asia",
    "Central Asia": "asia",
    "South Asia": "asia",
    Asia: "asia",
    Africa: "africa",
    "South America": "americas",
    Caribbean: "americas",
    "North America": "americas",
    "Latin America": "americas",
    "Middle East": "middle-east-oceania",
    Oceania: "middle-east-oceania",
  };

  for (const [stored, region] of Object.entries(expected)) {
    assert.equal(getNavRegionId(stored), region, stored);
  }
});

test("is tolerant of casing, spacing and punctuation", () => {
  assert.equal(getNavRegionId("  south-east asia "), "asia");
  assert.equal(getNavRegionId("SUB-SAHARAN AFRICA"), "africa");
  assert.equal(getNavRegionId("Central/Eastern Europe"), "europe");
});

test("places unseen values in the closest bucket and never drops a country", () => {
  assert.equal(getNavRegionId("West Asia / Middle East"), "middle-east-oceania");
  assert.equal(getNavRegionId("Pacific Islands"), "middle-east-oceania");
  assert.equal(getNavRegionId("The Balkans"), "europe");
  assert.equal(getNavRegionId("Central Americas"), "americas");
  assert.equal(getNavRegionId("Antarctica"), "other");
  assert.equal(getNavRegionId(""), "other");
  assert.equal(getNavRegionId(null), "other");

  const ids = new Set(NAV_REGIONS.map((region) => region.id));
  for (const value of ["Europe", "Antarctica", "Gulf states", "Nordics"]) {
    assert.ok(ids.has(getNavRegionId(value)), value);
  }
});
