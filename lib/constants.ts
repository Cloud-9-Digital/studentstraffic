/**
 * Meta pixel id. Shared deliberately: the browser pixel and the server-side
 * Conversions API must post to the SAME pixel, or Meta cannot deduplicate the
 * two copies of an event. `META_PIXEL_ID` overrides this in env.
 */
export const metaPixelId = "1702517386867719";

export const siteConfig = {
  name: "Students Traffic",
  shortName: "Students Traffic",
  description:
    "Students Traffic helps students and families worldwide compare universities, programmes, destinations, and admission pathways for study abroad.",
  copyrightYear: 2026,
  email: "hello@studentstraffic.com",
  phone: "+91 91761 62888",
  whatsappNumber: "919176162888",
  // Registered company name and office address, supplied by the owner
  // (2026-10-26). Read everywhere from here: /about, /contact, the footer and
  // the Organization structured data.
  legalName: "Students Traffic",
  address: {
    streetAddress: "46, Sri Sakthi Nagar",
    addressLocality: "Tenkasi",
    addressRegion: "Tamil Nadu",
    postalCode: "627811",
    addressCountry: "IN",
    countryName: "India",
  },
  // The app is published under the Cloud 9 Digital developer account.
  operator: "Cloud 9 Digital",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.studentstraffic.app",
  // Set once the iOS app is live; the App Store badge stays hidden until then.
  appStoreUrl: null as string | null,
};

/** One-line office address, e.g. "46, Sri Sakthi Nagar, Tenkasi, Tamil Nadu 627811, India". */
export function formatSiteAddress(address = siteConfig.address) {
  return `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, ${address.countryName}`;
}

export const maxSitemapUrls = 50_000;

export const defaultSiteUrl = "http://localhost:3000";

export const finderPageSize = 12;

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/universities", label: "Universities" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const guideNav = [
  {
    href: "/guides",
    label: "All Guides",
    description:
      "Country, course, comparison, and budget guidance in one place",
  },
  {
    href: "/countries",
    label: "Country Guides",
    description: "Costs, recognition, student life, and destination context",
  },
  {
    href: "/courses",
    label: "Course Guides",
    description: "Understand courses, destinations, fees, and admissions routes",
  },
  {
    href: "/compare",
    label: "Comparison Guides",
    description: "Side-by-side university comparisons for confident admissions choices",
  },
  {
    href: "/budget",
    label: "Budget Guides",
    description: "Plan by tuition range before moving into university pages",
  },
  {
    href: "/cities",
    label: "City Guides",
    description: "Compare universities within each city — fees, community, and lifestyle",
  },
] as const;

export const navCourses = [
  {
    href: "/courses/mbbs",
    name: "MBBS",
    description: "Bachelor of Medicine & Surgery",
  },
  {
    href: "/courses/bds",
    name: "BDS",
    description: "Bachelor of Dental Surgery",
  },
  {
    href: "/courses/medical-pg",
    name: "MD / MS",
    description: "Postgraduate Medical Programs",
  },
  {
    href: "/courses/nursing",
    name: "Nursing",
    description: "BSc & MSc Nursing Abroad",
  },
] as const;

export const footerCityGuides = [
  { href: "/cities/tbilisi", name: "MBBS in Tbilisi" },
  { href: "/cities/bishkek", name: "MBBS in Bishkek" },
  { href: "/cities/tashkent", name: "MBBS in Tashkent" },
  { href: "/cities/batumi", name: "MBBS in Batumi" },
  { href: "/cities/osh", name: "MBBS in Osh" },
  { href: "/cities/bukhara", name: "MBBS in Bukhara" },
  { href: "/cities/moscow", name: "MBBS in Moscow" },
  { href: "/cities/st-petersburg", name: "MBBS in St. Petersburg" },
  { href: "/cities/hanoi", name: "MBBS in Hanoi" },
  { href: "/cities/da-nang", name: "MBBS in Da Nang" },
] as const;

export const footerPopularRoutes = [
  { label: "MBBS in Russia", href: "/mbbs-in-russia" },
  { label: "MBBS in Vietnam", href: "/mbbs-in-vietnam" },
  { label: "MBBS in Georgia", href: "/mbbs-in-georgia" },
  { label: "MBBS in Kyrgyzstan", href: "/mbbs-in-kyrgyzstan" },
  { label: "MBBS in Uzbekistan", href: "/mbbs-in-uzbekistan" },
] as const;

export const homeCourseCategories = [
  {
    name: "MBBS",
    description: "Bachelor of Medicine & Surgery",
    href: "/courses/mbbs",
  },
  {
    name: "BDS",
    description: "Bachelor of Dental Surgery",
    href: "/courses/bds",
  },
  {
    name: "MD / MS",
    description: "Postgraduate Medical Programs",
    href: "/courses/medical-pg",
  },
  {
    name: "Nursing",
    description: "BSc & MSc Nursing",
    href: "/courses/nursing",
  },
  {
    name: "B.Tech / Engineering",
    description: "Undergraduate Engineering",
    href: "/universities",
  },
  {
    name: "MBA",
    description: "Master of Business Administration",
    href: "/universities",
  },
  {
    name: "Architecture",
    description: "B.Arch & M.Arch Programs",
    href: "/universities",
  },
  {
    name: "Pharmacy",
    description: "B.Pharm & M.Pharm Abroad",
    href: "/universities",
  },
] as const;
