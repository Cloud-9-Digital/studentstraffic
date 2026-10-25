import assert from "node:assert/strict";
import test from "node:test";

import { getUniversityDisplayName } from "@/lib/university-presentation";

test("published college names omit institutional status in public labels", () => {
  for (const [official, display] of [
    ["Stella Maris College (Autonomous), Chennai", "Stella Maris College, Chennai"],
    ["Ethiraj College for Women (Autonomous)", "Ethiraj College for Women"],
    ["M.O.P. Vaishnav College for Women (Autonomous)", "M.O.P. Vaishnav College for Women"],
    ["Guru Nanak College (Autonomous), Chennai", "Guru Nanak College, Chennai"],
    ["CHRIST (Deemed to be University)", "Christ University"],
    ["Symbiosis International (Deemed University)", "Symbiosis International University"],
    ["KIIT Deemed to be University", "KIIT University"],
  ]) {
    assert.equal(getUniversityDisplayName(official), display);
    assert.equal(getUniversityDisplayName(display), display);
  }
});

test("status cleanup preserves genuine names and campus distinctions", () => {
  for (const name of [
    "Autonomous University of Barcelona",
    "National Autonomous University of Mexico",
    "Government College of Engineering",
    "Anna University (Regional Campus)",
  ]) assert.equal(getUniversityDisplayName(name), name);
});
