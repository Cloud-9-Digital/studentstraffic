import "server-only";

import type { FinderProgram } from "@/lib/data/types";
import type {
  CountryLpConfig,
  CountryLpProgram,
  CountryLpStats,
} from "@/components/site/mbbs-lp/types";

/** Single, easy-to-update conversion used only for approximate ₹ display on ads landing pages. */
export const USD_TO_INR = 84;

export function formatInrApprox(usdAmount: number): string {
  const inr = usdAmount * USD_TO_INR;
  if (inr >= 1_00_00_000) {
    return `₹${(inr / 1_00_00_000).toFixed(1)}Cr`;
  }
  return `₹${Math.round(inr / 1_00_000)}L`;
}

function toCountryLpProgram(p: FinderProgram): CountryLpProgram {
  return {
    universityName: p.university.name,
    universitySlug: p.university.slug,
    city: p.university.city,
    type: p.university.type,
    durationYears: p.offering.durationYears,
    annualTuitionUsd: p.offering.annualTuitionUsd,
    totalTuitionUsd: p.offering.totalTuitionUsd,
    livingUsd: p.offering.livingUsd,
    medium: p.offering.medium,
  };
}

/**
 * Filters live catalog programs down to genuine, fee-published, English-medium
 * 6-year MBBS offerings, dedupes to the cheapest offering per university, and
 * computes the hero/CTA stat strip from the curated `featuredUniversitySlugs`
 * (so the headline range always matches the universities actually shown on
 * the page, instead of being skewed by outliers we don't feature).
 */
export function getCountryLpStats(
  programs: FinderProgram[],
  featuredUniversitySlugs: string[],
): CountryLpStats {
  const eligible = programs.filter(
    (p) =>
      p.course.slug === "mbbs" &&
      p.offering.durationYears === 6 &&
      p.offering.totalTuitionUsd > 0 &&
      p.offering.medium.startsWith("English"),
  );

  const byUniversity = new Map<string, FinderProgram>();
  for (const p of eligible) {
    const existing = byUniversity.get(p.university.slug);
    if (!existing || p.offering.totalTuitionUsd < existing.offering.totalTuitionUsd) {
      byUniversity.set(p.university.slug, p);
    }
  }

  const unique = [...byUniversity.values()];

  const featured = featuredUniversitySlugs
    .map((slug) => byUniversity.get(slug))
    .filter((p): p is FinderProgram => Boolean(p))
    .map(toCountryLpProgram)
    .sort((a, b) => a.totalTuitionUsd - b.totalTuitionUsd);

  const featuredTotals = featured.map((f) => f.totalTuitionUsd);

  return {
    universityCount: unique.length,
    minTotalUsd: featuredTotals.length ? Math.min(...featuredTotals) : 0,
    maxTotalUsd: featuredTotals.length ? Math.max(...featuredTotals) : 0,
    durationYears: unique[0]?.offering.durationYears ?? 6,
    featured,
  };
}

const defaultDocuments = [
  "Class 10 and 12 mark sheets and certificates",
  "NEET scorecard",
  "Valid passport (2+ years validity)",
  "Passport-size photos (12 copies)",
  "Medical fitness certificate",
  "Birth certificate",
];

export const RUSSIA_LP_FEATURED_SLUGS = [
  "astrakhan-state-medical-university",
  "kabardino-balkarian-state-university",
  "volgograd-state-medical-university",
  "bashkir-state-medical-university",
  "crimea-federal-university",
  "kazan-federal-university",
];

export const RUSSIA_LP_CONFIG: CountryLpConfig = {
  slug: "russia",
  countryName: "Russia",
  flag: "🇷🇺",
  heroKicker: "Trusted MBBS Admission Partner Since 2014",
  heroHeadlinePrefix: "Want to become a doctor?",
  heroHeadlineHighlight: "Study MBBS in Russia. We will get you admitted.",
  heroSubtext:
    "Trusted by 3,000+ Indian students since 2014. We help you get admitted to NMC-aligned MBBS universities across Russia — English medium, government-recognized, and home to the largest Indian student community abroad. Book a free counselling call and we will guide you.",
  whyIntro:
    "Russia has trained Indian doctors since the 1990s. With 60+ NMC-aligned universities, English-medium teaching, and total costs a fraction of private MBBS in India, it remains the most chosen MBBS destination for Indian students.",
  comparisonRows: [
    { aspect: "Total cost for 6 years", india: "₹70L to 1.5 Cr (private college)", abroad: "₹19L to ₹35L total (featured universities)", abroadWins: true },
    { aspect: "NEET score needed", india: "550+ for a government seat", abroad: "Qualifying marks enough", abroadWins: true },
    { aspect: "Seat availability", india: "20 lakh NEET candidates, ~1 lakh MBBS seats", abroad: "Seats available across 60+ NMC-aligned universities", abroadWins: true },
    { aspect: "Hostel and living cost", india: "₹3L to 6L per year", abroad: "₹1.2L to ₹2.5L per year", abroadWins: true },
    { aspect: "Language of study", india: "English", abroad: "English (all featured universities)", abroadWins: false },
    { aspect: "NMC compliance", india: "Automatic", abroad: "All featured universities meet NMC guidelines", abroadWins: false },
    { aspect: "Exam to practice in India", india: "Not required", abroad: "FMGE / NExT required after return", abroadWins: false },
  ],
  documents: [...defaultDocuments, "Invitation letter from the university (we arrange this)"],
  testimonials: [
    {
      name: "Ananya R.",
      state: "Telangana",
      detail: "Kazan Federal University, Russia · 3rd Year",
      quote:
        "My NEET score was borderline. Students Traffic did not oversell me a top-tier university I couldn't get into — they were upfront about what Kazan Federal offered and helped me plan my finances for all 6 years, not just year one.",
    },
    {
      name: "Mohammed I.",
      state: "Kerala",
      detail: "Astrakhan State Medical University, Russia · 2nd Year",
      quote:
        "I compared three consultancies before choosing Students Traffic. They were the only ones who connected me with a senior already studying at Astrakhan before I paid anything. That call decided it for me.",
    },
    {
      name: "Simran K.",
      state: "Punjab",
      detail: "Volgograd State Medical University, Russia · 4th Year",
      quote:
        "Visa paperwork was the part I was most worried about. Students Traffic handled the entire documentation and briefed me on what to expect at the airport. I landed in Volgograd with zero surprises.",
    },
  ],
  faqs: [
    {
      q: "Is MBBS in Russia valid in India?",
      a: "Yes, if the university meets NMC guidelines. All the universities we feature meet current NMC requirements. After returning, you need to clear the FMGE exam (being replaced by NExT) to get your license to practice in India.",
    },
    {
      q: "My NEET score is low. Can I still get an MBBS seat in Russia?",
      a: "Yes. Russian medical universities accept students with NEET qualifying marks — you do not need 550+ like a government seat in India. Call us with your score and we will tell you exactly which universities will admit you.",
    },
    {
      q: "How much does MBBS in Russia cost in total?",
      a: "Total cost for 6 years, including tuition and hostel, typically ranges from ₹19L to ₹35L at the universities we feature, and can go higher at premium institutions like Kazan State Medical University or Sechenov. This is a fraction of private MBBS fees in India, which can cross ₹1.5 crore. We give you a full cost breakdown on the counselling call.",
    },
    {
      q: "Is it safe for Indian students to study in Russia?",
      a: "Yes. Russia has hosted Indian medical students since the 1990s and has one of the largest Indian student communities of any MBBS destination. We connect you with current students before you decide, so you can ask them directly.",
    },
    {
      q: "Do I need to know Russian to study MBBS there?",
      a: "No. All the universities we recommend teach the MBBS programme fully in English. Many offer basic Russian language classes alongside the course, which helps during hospital rotations, but it is not required for admission or coursework.",
    },
    {
      q: "What is the FMGE / NExT exam?",
      a: "FMGE is the licensing exam every India-bound MBBS graduate from abroad must clear to register with the NMC and practice in India. NExT is set to replace FMGE. Students Traffic provides free FMGE/NExT coaching for students who join through us.",
    },
    {
      q: "When should I apply for the current intake?",
      a: "Most Russian medical universities have their main intake in September. Applications open from March onward, and popular universities fill up early. The earlier you start, the better your choice of university and hostel.",
    },
  ],
};

export const GEORGIA_LP_FEATURED_SLUGS = [
  "east-european-university",
  "caucasus-international-university",
  "david-tvildiani-medical-university",
  "university-of-georgia",
  "new-vision-university",
  "tbilisi-state-medical-university",
];

export const GEORGIA_LP_CONFIG: CountryLpConfig = {
  slug: "georgia",
  countryName: "Georgia",
  flag: "🇬🇪",
  heroKicker: "Trusted MBBS Admission Partner Since 2014",
  heroHeadlinePrefix: "Want to become a doctor?",
  heroHeadlineHighlight: "Study MBBS in Georgia. We will get you admitted.",
  heroSubtext:
    "Trusted by 3,000+ Indian students since 2014. We help you get admitted to NMC-aligned MBBS universities across Georgia — European-standard, English medium, and one of the highest FMGE pass rates among MBBS-abroad destinations. Book a free counselling call and we will guide you.",
  whyIntro:
    "Georgia offers European-standard medical education at the edge of the EU, with fully English-medium MBBS programmes, strong FMGE outcomes, and a large, settled Indian student community in Tbilisi and Batumi.",
  comparisonRows: [
    { aspect: "Total cost for 6 years", india: "₹70L to 1.5 Cr (private college)", abroad: "₹28L to ₹40L total (featured universities)", abroadWins: true },
    { aspect: "NEET score needed", india: "550+ for a government seat", abroad: "Qualifying marks enough", abroadWins: true },
    { aspect: "Seat availability", india: "20 lakh NEET candidates, ~1 lakh MBBS seats", abroad: "Seats available across 40+ NMC-aligned universities", abroadWins: true },
    { aspect: "Hostel and living cost", india: "₹3L to 6L per year", abroad: "₹2L to ₹3L per year", abroadWins: true },
    { aspect: "Language of study", india: "English", abroad: "English (all featured universities)", abroadWins: false },
    { aspect: "NMC compliance", india: "Automatic", abroad: "All featured universities meet NMC guidelines", abroadWins: false },
    { aspect: "Exam to practice in India", india: "Not required", abroad: "FMGE / NExT required after return", abroadWins: false },
  ],
  documents: [...defaultDocuments, "Notarized and apostilled document set for visa filing (we guide you through this)"],
  testimonials: [
    {
      name: "Priya K.",
      state: "Tamil Nadu",
      detail: "Tbilisi State Medical University, Georgia · 2nd Year",
      quote:
        "I called Students Traffic after my NEET result. They told me honestly which universities suited my score — no pressure, no false promises. Now I'm in Georgia and confident in the choice I made.",
    },
    {
      name: "Arjun V.",
      state: "Karnataka",
      detail: "David Tvildiani Medical University, Georgia · 3rd Year",
      quote:
        "The apostille and visa paperwork for Georgia looked intimidating online. Students Traffic's team walked me through every document, step by step, and my visa was approved without a single rejection.",
    },
    {
      name: "Fathima S.",
      state: "Kerala",
      detail: "New Vision University, Georgia · 1st Year",
      quote:
        "What stood out was that they didn't just push the cheapest option. They explained the difference between universities in Tbilisi and helped me pick one with better clinical exposure for my budget.",
    },
  ],
  faqs: [
    {
      q: "Is MBBS in Georgia valid in India?",
      a: "Yes, if the university meets NMC guidelines. All the universities we feature meet current NMC requirements. After returning, you need to clear the FMGE exam (being replaced by NExT) to get your license to practice in India.",
    },
    {
      q: "My NEET score is low. Can I still get an MBBS seat in Georgia?",
      a: "Yes. Georgian medical universities accept students with NEET qualifying marks. Call us with your score and we will tell you exactly which universities in Tbilisi or Batumi will admit you.",
    },
    {
      q: "How much does MBBS in Georgia cost in total?",
      a: "Total cost for 6 years, including tuition and hostel, typically ranges from ₹28L to ₹40L at the universities we feature. This is significantly less than private MBBS fees in India, which can cross ₹1.5 crore. We give you a full cost breakdown on the counselling call.",
    },
    {
      q: "Is it safe for Indian students to study in Georgia?",
      a: "Yes. Georgia is considered one of the safer MBBS-abroad destinations, with a large, well-established Indian student community concentrated in Tbilisi and Batumi. We connect you with current students before you decide.",
    },
    {
      q: "Do I need to know Georgian to study MBBS there?",
      a: "No. All the universities we recommend teach the MBBS programme fully in English. Basic Georgian is useful for day-to-day life, but the entire academic programme and clinical rotations are conducted in English.",
    },
    {
      q: "What visa do I need for Georgia, and how long does it take?",
      a: "Indian students need a Georgian student visa, which requires a notarized and apostilled document set along with the university's admission letter. Our team prepares and files this on your behalf, and typical processing takes a few weeks.",
    },
    {
      q: "When should I apply for the current intake?",
      a: "Georgian medical universities run two intakes — a main intake in September/October and a second intake in January. The September intake has the widest choice of universities and hostel availability, so it's preferred, but the January intake is a genuine option if you miss the first one. Applications for each intake open a few months in advance — apply early either way.",
    },
  ],
};

export const VIETNAM_LP_FEATURED_SLUGS = [
  "dai-nam-university-faculty-of-medicine",
  "dong-a-university-college-of-medicine",
  "can-tho-university-medicine-pharmacy",
  "buon-ma-thuot-medical-university",
  "hong-bang-international-university-medicine",
  "tan-tao-university-school-of-medicine",
];

export const VIETNAM_LP_CONFIG: CountryLpConfig = {
  slug: "vietnam",
  countryName: "Vietnam",
  flag: "🇻🇳",
  heroKicker: "Trusted MBBS Admission Partner Since 2014",
  heroHeadlinePrefix: "Want to become a doctor?",
  heroHeadlineHighlight: "Study MBBS in Vietnam. We will get you admitted.",
  heroSubtext:
    "Trusted by 3,000+ Indian students since 2014. We help you get admitted to NMC-aligned, English-medium MBBS programmes in Vietnam — modern campuses, growing clinical infrastructure, and a fast flight home. Book a free counselling call and we will guide you.",
  whyIntro:
    "Vietnam is a fast-growing, safe, and affordable MBBS destination close to India, with modern hospitals for clinical training and a small number of universities that run their MBBS programme fully in English for international students.",
  comparisonRows: [
    { aspect: "Total cost for 6 years", india: "₹70L to 1.5 Cr (private college)", abroad: "₹21L to ₹30L total (featured universities)", abroadWins: true },
    { aspect: "NEET score needed", india: "550+ for a government seat", abroad: "Qualifying marks enough", abroadWins: true },
    { aspect: "Seat availability", india: "20 lakh NEET candidates, ~1 lakh MBBS seats", abroad: "Limited seats — only a few universities run English-medium MBBS", abroadWins: false },
    { aspect: "Hostel and living cost", india: "₹3L to 6L per year", abroad: "₹1.5L to ₹2.5L per year", abroadWins: true },
    { aspect: "Language of study", india: "English", abroad: "English at our featured universities only — most Vietnamese medical colleges teach in Vietnamese", abroadWins: false },
    { aspect: "NMC compliance", india: "Automatic", abroad: "All featured universities meet NMC guidelines", abroadWins: false },
    { aspect: "Exam to practice in India", india: "Not required", abroad: "FMGE / NExT required after return", abroadWins: false },
  ],
  documents: [...defaultDocuments, "Vietnam student visa approval letter (we arrange this)"],
  testimonials: [
    {
      name: "Rohan D.",
      state: "Maharashtra",
      detail: "Dai Nam University, Vietnam · 2nd Year",
      quote:
        "Most agents I spoke to tried to push me toward Vietnamese-medium colleges without telling me the language would be a problem. Students Traffic only shortlisted the English-medium options, which is exactly what I needed.",
    },
    {
      name: "Neha B.",
      state: "Gujarat",
      detail: "Can Tho University of Medicine and Pharmacy, Vietnam · 1st Year",
      quote:
        "I was nervous because so few people I knew had gone to Vietnam for MBBS. Students Traffic gave me the real picture — hostel, food, weather, everything — before I committed, not after.",
    },
    {
      name: "Aditya S.",
      state: "Uttar Pradesh",
      detail: "Hong Bang International University, Vietnam · 3rd Year",
      quote:
        "The flight home is under 4 hours, which mattered a lot to my parents. Students Traffic helped us compare Vietnam against Georgia and Russia honestly and Vietnam made sense for our budget and travel needs.",
    },
  ],
  faqs: [
    {
      q: "Is MBBS in Vietnam valid in India?",
      a: "Yes, if the university meets NMC guidelines. All the universities we feature meet current NMC requirements. After returning, you need to clear the FMGE exam (being replaced by NExT) to get your license to practice in India.",
    },
    {
      q: "Do all MBBS universities in Vietnam teach in English?",
      a: "No — this is the most important thing to check. Most Vietnamese medical universities teach in Vietnamese. We only feature the universities that run a genuine English-medium MBBS programme for international students, so you are not stuck with a language barrier mid-course.",
    },
    {
      q: "My NEET score is low. Can I still get an MBBS seat in Vietnam?",
      a: "Yes, at our featured universities. NEET qualifying marks are enough — you do not need 550+ like a government seat in India. Call us with your score and we will confirm which English-medium university will admit you.",
    },
    {
      q: "How much does MBBS in Vietnam cost in total?",
      a: "Total cost for 6 years at our featured English-medium universities typically ranges from ₹21L to ₹30L, including tuition and hostel. This is a fraction of private MBBS fees in India, which can cross ₹1.5 crore. We give you a full cost breakdown on the counselling call.",
    },
    {
      q: "Is it safe for Indian students to study in Vietnam?",
      a: "Yes. Vietnam is considered one of the safer countries in the region, with a growing Indian student presence around Hanoi, Da Nang, and Can Tho. We connect you with current students before you decide.",
    },
    {
      q: "How far is Vietnam from India?",
      a: "Direct and one-stop flights between major Indian cities and Vietnam typically take 4 to 6 hours, which is shorter than most other MBBS-abroad destinations — useful for holidays and emergencies.",
    },
    {
      q: "When should I apply for the current intake?",
      a: "Vietnamese universities typically run their main intake around September, with applications opening a few months earlier. Since only a handful of universities offer English-medium MBBS, seats fill up faster than in Russia or Georgia — apply early.",
    },
  ],
};
