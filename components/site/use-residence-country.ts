"use client";

import { useCallback, useRef, useState } from "react";

import {
  normalizeResidenceCountry,
  type ResidenceCountryCode,
} from "@/lib/residence-countries";

const STORAGE_KEY = "st_geo_country";

let geoCountryRequest: Promise<ResidenceCountryCode | undefined> | null = null;

function readStoredGeoCountry() {
  try {
    return normalizeResidenceCountry(window.sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return undefined;
  }
}

/** One /api/geo call per tab, shared by every form on the page. */
function fetchGeoCountry() {
  geoCountryRequest ??= fetch("/api/geo", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : null))
    .then((payload: { country?: string | null } | null) => {
      const country = normalizeResidenceCountry(payload?.country);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, country ?? "");
      } catch {}
      return country;
    })
    .catch(() => undefined);

  return geoCountryRequest;
}

/**
 * "Country of residence" state for a lead form. It starts empty; `prime()`
 * (called on the first interaction with the form) looks up the visitor's IP
 * country and preselects it unless the visitor has already picked one.
 */
export function useResidenceCountry(initial?: ResidenceCountryCode) {
  const [country, setCountryState] = useState<string>(initial ?? "");
  const userChoseRef = useRef(Boolean(initial));
  const primedRef = useRef(Boolean(initial));

  const setCountry = useCallback((code: ResidenceCountryCode) => {
    userChoseRef.current = true;
    setCountryState(code);
  }, []);

  /** Fill in a country the visitor did not pick (geo or phone), without overriding a choice. */
  const suggestCountry = useCallback((code?: string) => {
    const normalized = normalizeResidenceCountry(code);
    if (!normalized || userChoseRef.current) return;
    setCountryState((current) => current || normalized);
  }, []);

  const prime = useCallback(() => {
    if (primedRef.current) return;
    primedRef.current = true;

    const stored = readStoredGeoCountry();
    if (stored) {
      suggestCountry(stored);
      return;
    }

    void fetchGeoCountry().then(suggestCountry);
  }, [suggestCountry]);

  return { country, setCountry, suggestCountry, prime };
}
