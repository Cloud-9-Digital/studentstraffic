// Plain constants shared between server data-fetching code (lib/data/nav-countries.ts)
// and client components (components/site/site-header.tsx). This file intentionally
// has no "server-only" import and no "use cache" functions, so it is safe to import
// as a value from Client Components without pulling server-only cache logic into the
// client bundle.

// The destination highlighted in the countries mega menu's promo panel.
// Mirrors the "Popular" badge shown on /countries (app/countries/page.tsx).
// Change this single constant to feature a different destination.
export const FEATURED_NAV_COUNTRY_SLUG = "vietnam";

// "Popular for MBBS" row in the countries menu, in display order. Curated
// because ranking by university count would surface the UK/US ahead of the
// destinations Indian MBBS applicants actually shortlist. The menu only shows
// a slug while that country has a published medicine programme
// (NavCountry.hasMedicine), so a stale entry disappears instead of linking to
// a country without MBBS options.
export const MBBS_NAV_COUNTRY_SLUGS = [
  "russia",
  "georgia",
  "vietnam",
  "uzbekistan",
  "kyrgyzstan",
  "kazakhstan",
] as const;
