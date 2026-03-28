export function getCountryHref(countrySlug: string) {
  return `/countries/${countrySlug}`;
}

export function getGuidesIndexHref() {
  return "/guides";
}

export function getCourseHref(courseSlug: string) {
  return `/courses/${courseSlug}`;
}

export function getUniversityHref(universitySlug: string) {
  return `/universities/${universitySlug}`;
}

export function getLandingPageHref(courseSlug: string, countrySlug: string) {
  return `/${courseSlug}-in-${countrySlug}`;
}

export function getCountriesIndexHref() {
  return "/countries";
}

export function getCoursesIndexHref() {
  return "/courses";
}

export function getComparisonHref(slug: string) {
  return `/compare/${slug}`;
}

export function getBudgetGuideHref(slug: string) {
  return `/budget/${slug}`;
}

export function getBudgetIndexHref() {
  return "/budget";
}

export function getCompareIndexHref() {
  return "/compare";
}
