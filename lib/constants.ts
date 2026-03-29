export const siteConfig = {
  name: "Students Traffic",
  shortName: "Students Traffic",
  description:
    "Students Traffic helps Indian students research medical study-abroad options, compare universities, and get guided admissions support when they are ready to apply.",
  copyrightYear: 2026,
  email: "hello@studentstraffic.com",
  phone: "+91 91761 62888",
  whatsappNumber: "919176162888",
};

export const maxSitemapUrls = 50_000;

export const defaultSiteUrl = "http://localhost:3000";

export const finderPageSize = 12;

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/universities", label: "University Finder" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const guideNav = [
  {
    href: "/guides",
    label: "All Guides",
    description:
      "Country, course, comparison, and budget research in one place",
  },
  {
    href: "/countries",
    label: "Country Guides",
    description: "Costs, recognition, student life, and destination context",
  },
  {
    href: "/courses",
    label: "Course Guides",
    description: "Understand MBBS, BDS, nursing, and postgraduate routes",
  },
  {
    href: "/compare",
    label: "Comparison Guides",
    description: "Side-by-side university evaluations for shortlist decisions",
  },
  {
    href: "/budget",
    label: "Budget Guides",
    description: "Research by tuition range before opening university pages",
  },
] as const;

export const navDestinations = [
  {
    href: "/countries/russia",
    countryCode: "ru",
    name: "Russia",
    description: "Established NMC pathways, top public universities",
  },
  {
    href: "/countries/vietnam",
    countryCode: "vn",
    name: "Vietnam",
    description: "Affordable fees, growing English-medium options",
  },
  {
    href: "/countries/georgia",
    countryCode: "ge",
    name: "Georgia",
    description: "WHO & NMC recognised, European standard",
  },
  {
    href: "/countries/kyrgyzstan",
    countryCode: "kg",
    name: "Kyrgyzstan",
    description: "Low cost of living, NMC eligible programs",
  },
  {
    href: "/countries/philippines",
    countryCode: "ph",
    name: "Philippines",
    description: "Full English medium, USMLE & NMC pathway",
  },
  {
    href: "/countries/kazakhstan",
    countryCode: "kz",
    name: "Kazakhstan",
    description: "Quality education, modern campuses",
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

export const footerPopularRoutes = [
  { label: "MBBS in Russia", href: "/mbbs-in-russia" },
  { label: "MBBS in Vietnam", href: "/mbbs-in-vietnam" },
  { label: "MBBS in Georgia", href: "/mbbs-in-georgia" },
  { label: "MBBS in Philippines", href: "/mbbs-in-philippines" },
  { label: "MBBS in Kyrgyzstan", href: "/mbbs-in-kyrgyzstan" },
  { label: "MBBS in Kazakhstan", href: "/mbbs-in-kazakhstan" },
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
