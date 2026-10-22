// The `core` entry with explicit metadata rather than "react-phone-number-input"
// (whose root also exports React components that break in route handlers) or
// the "libphonenumber-js" root (whose bundled metadata import fails under the
// tsx test runner).
import {
  isValidPhoneNumber as isValidPhoneNumberWithMetadata,
  parsePhoneNumber as parsePhoneNumberWithMetadata,
} from "libphonenumber-js/core";
import metadata from "libphonenumber-js/min/metadata";

import {
  normalizeResidenceCountry,
  type ResidenceCountryCode,
} from "@/lib/residence-countries";

type HeaderStore = {
  get(name: string): string | null;
};

const isValidPhoneNumber = (phone: string) =>
  isValidPhoneNumberWithMetadata(phone, metadata);
const parsePhoneNumber = (phone: string) =>
  parsePhoneNumberWithMetadata(phone, metadata);

/** Vercel's IP geolocation header: an ISO 3166-1 alpha-2 code, absent locally. */
export const GEO_COUNTRY_HEADER = "x-vercel-ip-country";

/**
 * Accepts any number libphonenumber recognises as valid for its country. The
 * forms submit E.164 (`+<country code><number>`), so a number without a `+`
 * has no country to validate against and is rejected.
 */
export function isValidLeadPhone(phone: string) {
  const trimmed = phone.trim();
  return trimmed.startsWith("+") && isValidPhoneNumber(trimmed);
}

export function getPhoneCountry(phone?: string | null) {
  const trimmed = phone?.trim();
  if (!trimmed?.startsWith("+")) return undefined;

  try {
    return normalizeResidenceCountry(parsePhoneNumber(trimmed)?.country);
  } catch {
    return undefined;
  }
}

export function getGeoCountry(headerStore: HeaderStore) {
  return normalizeResidenceCountry(headerStore.get(GEO_COUNTRY_HEADER));
}

/**
 * The country the student lives in. The form's own answer wins; the fallbacks
 * only cover submissions without one (a tab opened before the field shipped,
 * WhatsApp inbound, older app builds) so those rows are not left blank: first
 * the visitor's IP country, then the phone number's country.
 */
export function resolveResidenceCountry({
  submitted,
  headerStore,
  phone,
}: {
  submitted?: string | null;
  headerStore?: HeaderStore;
  phone?: string | null;
}): ResidenceCountryCode | undefined {
  return (
    normalizeResidenceCountry(submitted) ??
    (headerStore ? getGeoCountry(headerStore) : undefined) ??
    getPhoneCountry(phone)
  );
}
