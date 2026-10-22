import assert from "node:assert/strict";
import test from "node:test";

import {
  getPhoneCountry,
  isValidLeadPhone,
  resolveResidenceCountry,
} from "../lib/lead-residence";
import {
  getResidenceCountryName,
  normalizeResidenceCountry,
  RESIDENCE_COUNTRIES,
} from "../lib/residence-countries";

const headersFrom = (values: Record<string, string>) => ({
  get: (name: string) => values[name.toLowerCase()] ?? null,
});

test("residence list holds unique ISO alpha-2 codes only", () => {
  const codes = RESIDENCE_COUNTRIES.map(([code]) => code);
  assert.equal(new Set(codes).size, codes.length);
  assert.ok(codes.every((code) => /^[A-Z]{2}$/.test(code)));
  // libphonenumber territories that are not ISO 3166-1 countries.
  for (const code of ["AC", "TA", "XK", "XA", "XO"]) {
    assert.equal(normalizeResidenceCountry(code), undefined);
  }
  assert.equal(getResidenceCountryName(" in "), "India");
  assert.equal(getResidenceCountryName("ae"), "United Arab Emirates");
});

test("phone validation accepts international numbers and rejects bare digits", () => {
  assert.equal(isValidLeadPhone("+919876543210"), true);
  assert.equal(isValidLeadPhone("+971501234567"), true);
  assert.equal(isValidLeadPhone("+442071838750"), true);
  assert.equal(isValidLeadPhone("+12025550143"), true);
  assert.equal(isValidLeadPhone("9876543210"), false);
  assert.equal(isValidLeadPhone("+91123"), false);
  assert.equal(getPhoneCountry("+971501234567"), "AE");
});

test("submitted country wins, then IP country, then phone country", () => {
  const geoUs = headersFrom({ "x-vercel-ip-country": "US" });

  assert.equal(
    resolveResidenceCountry({ submitted: "np", headerStore: geoUs, phone: "+919876543210" }),
    "NP"
  );
  assert.equal(
    resolveResidenceCountry({ submitted: "ZZ", headerStore: geoUs, phone: "+919876543210" }),
    "US"
  );
  assert.equal(
    resolveResidenceCountry({ headerStore: headersFrom({}), phone: "+442071838750" }),
    "GB"
  );
  assert.equal(resolveResidenceCountry({ phone: "12345" }), undefined);
});
