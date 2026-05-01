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

export function getWdomsDirectoryHref(countrySlug: string) {
  return `/wdoms/${countrySlug}`;
}

export function getWdomsSchoolHref(countrySlug: string, schoolSlug: string) {
  return `/wdoms/${countrySlug}/${schoolSlug}`;
}

export function getCitiesIndexHref() {
  return "/cities";
}

export function getCityHref(citySlug: string) {
  return `/cities/${citySlug}`;
}

export function getTamilNaduHubHref() {
  return "/tamil-nadu";
}

export function getTamilNaduCityHref(citySlug: string) {
  return `/tamil-nadu/${citySlug}`;
}
