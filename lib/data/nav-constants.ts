// Plain constants shared between server data-fetching code (lib/data/nav-countries.ts)
// and client components (components/site/site-header.tsx). This file intentionally
// has no "server-only" import and no "use cache" functions, so it is safe to import
// as a value from Client Components without pulling server-only cache logic into the
// client bundle.

// The destination highlighted in the countries mega menu's promo panel.
// Mirrors the "Popular" badge shown on /countries (app/countries/page.tsx).
// Change this single constant to feature a different destination.
export const FEATURED_NAV_COUNTRY_SLUG = "vietnam";
