import { readFileSync } from "node:fs";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getCountryHeroImage } from "@/lib/country-media";
import { getLocalFlagUrl } from "@/lib/flag-media";
import flagCodes from "@/lib/generated/flag-codes.json";
import { getUniversityCoverImage } from "@/lib/university-media";
import credits from "../public/images/location-media/credits.json";

const publicFile = (path: string) => new URL(`../public${path}`, import.meta.url);
const creditsPage = readFileSync(publicFile("/images/location-media/credits.html"), "utf8");

describe("bundled catalogue media", () => {
  it("includes and credits each locally sourced university fallback photo", () => {
    for (const [location, credit] of Object.entries(credits)) {
      const [countrySlug, city] = location.split("::");
      const cover = getUniversityCoverImage({ name: "Example", slug: "example", countrySlug, city });
      assert.equal(cover?.url, credit.url);
      const image = readFileSync(publicFile(credit.url));
      assert.equal(image.toString("ascii", 0, 4), "RIFF");
      assert.equal(image.toString("ascii", 8, 12), "WEBP");
      assert.ok(creditsPage.includes(`id="${cover?.creditHref?.split("#")[1]}"`));
      if (credit.licenseName.startsWith("CC BY")) assert.ok(credit.author);
    }
  });

  it("uses a bundled country image if the city photo is unavailable", () => {
    const countrySlug = "united-arab-emirates";
    const cover = getUniversityCoverImage({ name: "Example", slug: "example", countrySlug, city: "Ajman" });
    assert.equal(cover?.url, getCountryHeroImage(countrySlug).url);
    assert.ok(cover && readFileSync(publicFile(cover.url)).length > 0);
  });

  it("serves flags from bundled files and gives unknown countries a local fallback", () => {
    for (const code of flagCodes) assert.ok(readFileSync(publicFile(getLocalFlagUrl(code)), "utf8").includes("<svg"));
    assert.equal(getLocalFlagUrl("unknown"), "/images/flags/xx.svg");
  });
});

it("allows only versioned public images on the Students Traffic R2 hostname", async () => {
  const { isR2PublicImageUrl } = await import("@/lib/public-media-url");
  const base = "https://media.studentstraffic.com";
  const object = `/images/owned/v1/${"a".repeat(64)}.webp`;
  assert.ok(isR2PublicImageUrl(base + object));
  for (const url of [
    base + object + "?signature=test",
    base + "/brochures/file.pdf",
    base + ".example.test" + object,
    base.replace("https:", "http:") + object,
  ]) assert.equal(isR2PublicImageUrl(url), false);
});
