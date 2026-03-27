export const siteConfig = {
  name: "Students Traffic",
  shortName: "Students Traffic",
  description:
    "Students Traffic helps Indian students shortlist global universities, compare courses and fees, and capture expert guidance for study-abroad admissions, starting with medical.",
  copyrightYear: 2026,
  email: "hello@studentstraffic.com",
  phone: "+91 91716 12888",
  whatsappNumber: "919171612888",
};

export const maxSitemapUrls = 50_000;

export const defaultSiteUrl = "http://localhost:3000";

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/universities", label: "University Finder" },
  { href: "/search", label: "Search" },
  { href: "/courses/mbbs", label: "MBBS" },
  { href: "/countries/vietnam", label: "Vietnam" },
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
    href: "/courses/md-ms",
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
  { name: "MBBS", description: "Bachelor of Medicine & Surgery", href: "/courses/mbbs" },
  { name: "BDS", description: "Bachelor of Dental Surgery", href: "/courses/bds" },
  { name: "MD / MS", description: "Postgraduate Medical Programs", href: "/courses/md-ms" },
  { name: "Nursing", description: "BSc & MSc Nursing", href: "/courses/nursing" },
  { name: "B.Tech / Engineering", description: "Undergraduate Engineering", href: "/universities" },
  { name: "MBA", description: "Master of Business Administration", href: "/universities" },
  { name: "Architecture", description: "B.Arch & M.Arch Programs", href: "/universities" },
  { name: "Pharmacy", description: "B.Pharm & M.Pharm Abroad", href: "/universities" },
] as const;
