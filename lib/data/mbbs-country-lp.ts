import "server-only";

import type { FinderProgram } from "@/lib/data/types";
import type {
  CountryLpConfig,
  CountryLpProgram,
  CountryLpStats,
  DeepDiveSection,
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
function getEligibleProgramsByUniversity(programs: FinderProgram[]) {
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
  return byUniversity;
}

/** Raw, catalog-eligible FinderProgram entries for the curated featured universities — used to build Course/CollegeOrUniversity structured data on the landing page. */
export function getFeaturedPrograms(
  programs: FinderProgram[],
  featuredUniversitySlugs: string[],
): FinderProgram[] {
  const byUniversity = getEligibleProgramsByUniversity(programs);
  return featuredUniversitySlugs
    .map((slug) => byUniversity.get(slug))
    .filter((p): p is FinderProgram => Boolean(p));
}

export function getCountryLpStats(
  programs: FinderProgram[],
  featuredUniversitySlugs: string[],
): CountryLpStats {
  const byUniversity = getEligibleProgramsByUniversity(programs);
  const unique = [...byUniversity.values()];

  const featured = getFeaturedPrograms(programs, featuredUniversitySlugs)
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

const RUSSIA_DEEP_DIVE: DeepDiveSection[] = [
  {
    id: "safety-2026",
    eyebrow: "The Honest Answer",
    heading: "Is MBBS in Russia still safe for Indian students in 2026?",
    intro:
      "This is the first question every parent asks, and it deserves a direct, current answer instead of a one-line dismissal.",
    blocks: [
      {
        kind: "paragraph",
        text: "Russia and India maintain a longstanding strategic relationship, and that has not changed through the Russia-Ukraine conflict. As of 2026, the Indian Embassy in Moscow has issued no travel advisory against Indian students studying in Russia. Ministry of External Affairs data shows more than 27,000 Indian students currently studying medicine in Russia, and enrolment has actually grown since 2022 rather than fallen.",
      },
      {
        kind: "paragraph",
        text: "The universities we feature — in Astrakhan, Nalchik, Volgograd, Ufa, Simferopol, and Kazan — are all far from the conflict zone in western Russia and Ukraine, and daily academic life, hostel operations, and clinical rotations have continued without disruption throughout. That does not mean the situation is permanently static, which is exactly why we do not treat 'Russia is safe' as a line we say once and move on from.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "We track the Ministry of External Affairs and Indian Embassy Moscow's official advisories on an ongoing basis, and we will tell you directly — before you commit to any university — if that position changes for a specific city or region.",
      },
    ],
  },
  {
    id: "cost-breakdown",
    eyebrow: "Full Cost Picture",
    heading: "What your ₹19L–₹35L actually covers",
    intro:
      "As with every MBBS-abroad destination, the total cost we quote is tuition. Here is what living costs add, and how much they vary by city.",
    blocks: [
      {
        kind: "paragraph",
        text: "The ₹19L–₹35L 'total cost for 6 years' figure on this page is tuition only, at the government (state and federal) medical universities we feature. This is standard practice across MBBS-abroad consultancies, but it is not the full picture, so we would rather be upfront about it here than have a family discover the gap later.",
      },
      {
        kind: "paragraph",
        text: "Hostel and living costs vary more by city in Russia than in most destinations — from roughly $700–$1,500 per year in more affordable cities like Astrakhan, up to $2,000–$3,500 per year in a larger city like Kazan. Across 6 years, that typically adds somewhere between ₹3.5L and ₹18L to your total budget depending on which city you choose, on top of the tuition figure quoted above.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "We build a full year-by-year cost plan — tuition, hostel, food, flights, and visa costs, specific to your chosen city — for every student before they commit to a university, so there are no surprises in year 3 or 4.",
      },
    ],
  },
  {
    id: "neet-eligibility",
    eyebrow: "Eligibility, Explained",
    heading: "NEET eligibility for MBBS in Russia — the rules explained",
    intro:
      "The eligibility bar for MBBS in Russia is lower than for a government seat in India, but it isn't zero. Here's what the rules actually mean.",
    blocks: [
      {
        kind: "list",
        items: [
          "NEET qualifying score: you need to clear NEET's qualifying cutoff (50th percentile for General category, 40th percentile for reserved categories) — not the much higher rank needed for a government MBBS seat in India. A qualifying NEET score, even a modest one, is what matters here, not your rank.",
          "Class 12 marks: a minimum of 50-60% aggregate in Physics, Chemistry, and Biology, depending on the specific university's own admission policy.",
          "Age: at least 17 years old by December 31 of your admission year, per NMC rules.",
          "Subjects: Physics, Chemistry, Biology, and English are mandatory in Class 12 — there are no exceptions to this, regardless of which university you choose.",
        ],
      },
      {
        kind: "paragraph",
        text: "The most common misconception we hear is that a 'low' NEET score disqualifies a student from MBBS abroad entirely. It doesn't — NEET is a qualifying exam for this pathway, not a ranking exam the way it is for Indian government seats. What actually varies by university is the Class 12 percentage requirement and, at a small number of more selective universities, an internal interview or entrance assessment. We check your exact numbers against each university's real, current criteria before you apply, rather than giving you a generic 'yes you qualify' answer.",
      },
    ],
  },
  {
    id: "curriculum",
    eyebrow: "Course Structure",
    heading: "How the 6-year MBBS is structured in Russia",
    intro:
      "Every university we feature runs a curriculum built to satisfy India's NMC Foreign Medical Graduate Licentiate (FMGL) Regulations 2021 — not just Russia's own accreditation.",
    blocks: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Years 1–2: Basic sciences — anatomy, physiology, and biochemistry — plus foundational clinical skills, taught fully in English.",
          "Years 3–4: Para-clinical and early clinical subjects — pathology, pharmacology, microbiology, and forensic medicine — alongside hospital-based clinical exposure.",
          "Years 5–6: Full clinical rotations across medicine, surgery, obstetrics & gynaecology, paediatrics, and allied specialities.",
          "Final year: A compulsory 12-month clinical internship completed at the same institution — this is a specific FMGL requirement, not an optional add-on.",
        ],
      },
      {
        kind: "paragraph",
        text: "Under the FMGL Regulations 2021, a foreign MBBS degree is only eligible for NMC registration if the course runs a minimum of 54 months of coursework plus a further 12 months of internship at the same institution, is taught entirely in English, and follows a curriculum the NMC considers commensurate with India's own Graduate Medical Education Regulations. Every university we feature meets this structure — we verify it before we ever recommend a university, not after a student has already enrolled.",
      },
      {
        kind: "paragraph",
        text: "The full course, including internship, must also be completed within 10 years of joining — a rule that mainly matters if a student needs to repeat a year. We build realistic academic timelines with every student from day one rather than promising an unrealistic fast-track.",
      },
    ],
  },
  {
    id: "fmge-outcomes",
    eyebrow: "Licensing Outcomes",
    heading: "FMGE / NExT pass rates for MBBS graduates from Russia — and why you should question exact percentages",
    intro:
      "A Russian MBBS degree is only useful in India once you clear FMGE (soon NExT). Pass-rate data for Russia is cited more often online than for almost any other destination — but a lot of what circulates does not hold up.",
    blocks: [
      {
        kind: "paragraph",
        text: "According to NBEMS FMGE 2024 data widely cited across exam-prep resources, Russia's overall pass rate was approximately 29.5%, meaningfully above the destinations-wide average of roughly 25.8%. That national figure is reasonably well corroborated across independent sources.",
      },
      {
        kind: "paragraph",
        text: "Per-university figures are a different story. While researching this page, we cross-checked several sites claiming specific 2024 pass percentages for individual Russian universities and found genuine disagreement between sources for the same university and the same year — in one case, two sites cited pass rates for the same university that differed by nearly 20 percentage points. The only official per-university dataset we could locate, published by the Indian Embassy in Moscow, covers 2015-2018 and is now out of date. We would rather tell you this directly than repeat an unverifiable number as fact.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "If a consultancy or website quotes you a precise FMGE percentage for a specific Russian university, ask where the number comes from. We share the most recent verified data we can source for each university during your counselling call, and we tell you plainly when a figure cannot be confirmed against an official source instead of presenting an estimate as fact. Our own free NEET college predictor tool can also help you gauge realistic options based on your actual score.",
      },
    ],
  },
  {
    id: "choosing-your-city",
    eyebrow: "Choosing Your City",
    heading: "Kazan, Volgograd, Astrakhan, Ufa, Simferopol, or Nalchik — which city fits you?",
    intro:
      "Our featured universities span six different Russian cities. Here is a quick, honest read on each.",
    blocks: [
      {
        kind: "table",
        headers: ["City", "University", "What it's known for"],
        rows: [
          ["Kazan", "Kazan Federal University", "Large, modern city; strong academic reputation; the highest tuition among our six but also the most established Indian student community"],
          ["Volgograd", "Volgograd State Medical University", "Historic city on the Volga river; long-running, well-established medical university with decades of Indian student intake"],
          ["Astrakhan", "Astrakhan State Medical University", "Southern city near the Caspian Sea; one of the more affordable options among our six featured universities"],
          ["Ufa", "Bashkir State Medical University", "Capital of Bashkortostan; large teaching hospital network attached to the university"],
          ["Simferopol", "Crimea Federal University", "Located in Crimea; NMC- and WHO-recognized, with its own distinct administrative and travel considerations worth discussing on your call"],
          ["Nalchik", "Kabardino-Balkarian State University", "Smaller city in the North Caucasus; the most budget-friendly option among our six, with a smaller but growing Indian student base"],
        ],
      },
      {
        kind: "paragraph",
        text: "None of these cities is objectively 'best' — a student choosing Kazan is usually prioritising reputation and community size, while a student choosing Astrakhan or Nalchik is usually prioritising budget. We talk through the trade-offs specific to your situation on the counselling call rather than defaulting every student to the same one or two cities.",
      },
    ],
  },
  {
    id: "student-life",
    eyebrow: "Daily Life",
    heading: "Life as an Indian medical student in Russia — food, hostel, and daily life",
    intro:
      "Beyond the classroom, day-to-day life is often what determines whether a student settles in or struggles. Here is the practical picture.",
    blocks: [
      {
        kind: "paragraph",
        text: "Every university we feature provides on-campus or university-arranged hostel accommodation, typically shared between 2-3 students per room, with basic furnishing, heating (essential given Russian winters), and Wi-Fi. Hostel costs are already included in the living-cost figures elsewhere on this page.",
      },
      {
        kind: "paragraph",
        text: "Indian food is more available than most students expect. Every one of our featured university cities has an established Indian student community large enough to support at least one Indian mess or tiffin service, and most hostels have a shared kitchen where students cook for themselves. That said, expect to adapt — fresh vegetables and specific spices can be harder to source in smaller cities like Nalchik or Astrakhan compared to a larger city like Kazan.",
      },
      {
        kind: "paragraph",
        text: "Winters are the biggest adjustment for most Indian students, particularly in the first year. Temperatures in cities like Kazan, Ufa, and Volgograd can fall well below freezing between November and March. Universities and senior students typically help new arrivals buy appropriate winter clothing locally in the first week, rather than expecting students to carry it all from India.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "We connect every student with a current senior at their specific university before departure, so questions about food, hostel rooms, and what to pack come from someone actually living it, not a generic checklist.",
      },
    ],
  },
  {
    id: "visa-process",
    eyebrow: "Visa & Documentation",
    heading: "Russia's student visa process — the real step-by-step",
    intro:
      "Indian students apply for a Russian student visa through the embassy or VFS Global. Here is the actual sequence.",
    blocks: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Your chosen university issues an official invitation/admission letter once you accept your seat and pay the first-year deposit — the visa process cannot begin without this.",
          "You submit your passport, the invitation letter, required supporting documents, and an HIV-negative test report at the Russian Embassy or VFS Global.",
          "Processing typically takes 10–20 working days, and most students receive their visa within 3–4 weeks of applying.",
          "You travel to Russia and, shortly after arrival, complete local migration registration — a step your university's international office typically manages for you.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        text: "We prepare and file the full document set on your behalf and coordinate directly with your university's international office, so the visa timeline stays predictable instead of becoming a source of last-minute stress before your intake.",
      },
    ],
  },
  {
    id: "scholarships",
    eyebrow: "Reducing Your Cost",
    heading: "Scholarships and ways to lower your MBBS cost in Russia",
    intro:
      "Russia has more genuine scholarship pathways than most MBBS-abroad destinations — here is what's real.",
    blocks: [
      {
        kind: "list",
        items: [
          "The Russian Government Scholarship — a limited, competitive quota (around 300 seats reserved for Indian students in recent intake cycles) covering full tuition for eligible programmes, allocated through a formal application process, not something any consultancy can guarantee you.",
          "University merit scholarships — many of our featured universities offer their own tuition discounts, typically 25-50% and occasionally more, based on your Class 12 PCB percentage and NEET score.",
          "Early-application pricing — some universities hold slightly lower fees for students who confirm their seat well ahead of the September intake.",
        ],
      },
      {
        kind: "paragraph",
        text: "Government scholarship seats are limited and competitive, and university merit-scholarship bands change every intake — so treat any 'guaranteed scholarship' claim with real caution. We check what you genuinely qualify for, at which of our featured universities, before you apply.",
      },
    ],
  },
  {
    id: "evaluating-claims",
    eyebrow: "Before You Commit",
    heading: "How to evaluate a Russian medical university beyond the marketing",
    intro:
      "MBBS in Russia is one of the most heavily marketed education categories online, which makes it one of the easiest to oversell. A few honest checks before you commit.",
    blocks: [
      {
        kind: "list",
        items: [
          "Ask for the university's current NMC and official regulatory sources listing status directly, not just a screenshot — recognition status is checkable, not something to take on trust.",
          "Ask to speak to a current Indian student at that specific university, in that specific city, before you pay anything — a real conversation, not a testimonial video.",
          "Be skeptical of any FMGE pass-rate percentage quoted without a stated source. As we found while researching this page, several public claims for the same Russian university and the same year directly contradict each other.",
          "Ask what clinical and internship exposure actually looks like in practice — hands-on time varies more by university than most marketing suggests.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        text: "We connect every student with a current senior at their shortlisted university before they commit — the same standard we'd want if it were our own child choosing a university thousands of kilometres from home.",
      },
    ],
  },
  {
    id: "russia-vs-others",
    eyebrow: "Country Comparison",
    heading: "Russia vs Georgia vs Vietnam — how the three compare",
    intro:
      "All three are NMC-recognized MBBS-abroad destinations we work with. Here is how they actually differ, not how any one of them markets itself.",
    blocks: [
      {
        kind: "table",
        headers: ["", "Russia", "Georgia", "Vietnam"],
        rows: [
          ["6-year tuition (featured universities)", "₹19L–₹35L", "₹28L–₹40L", "₹21L–₹30L"],
          ["Ownership of featured universities", "Government (state / federal)", "Private", "Private"],
          ["University choice", "60+ NMC-aligned universities", "40+ private, NMC-aligned universities", "A handful of genuine English-medium options"],
          ["Language of instruction", "English at all featured universities", "English at all featured universities", "English only at our featured universities — most Vietnamese colleges teach in Vietnamese"],
          ["Climate", "Cold winters across most cities", "Continental (Tbilisi) to subtropical (Batumi)", "Tropical, warm year-round"],
          ["Flight time from India", "Approx. 6–9 hours depending on city", "Approx. 5–7 hours", "Approx. 4–6 hours — shortest of the three"],
        ],
      },
      {
        kind: "paragraph",
        text: "There is no single 'best' country — the right fit depends on your NEET score, budget, and what you and your family are comfortable with. We compare all three honestly against your specific situation on the counselling call, instead of steering every student toward whichever destination we happen to be promoting that month.",
      },
    ],
  },
];

export const RUSSIA_LP_CONFIG: CountryLpConfig = {
  slug: "russia",
  countryName: "Russia",
  flag: "🇷🇺",
  contentReviewedAt: "2026-07-10",
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
      q: "Is it safe for Indian students to study in Russia, given the Russia-Ukraine conflict?",
      a: "Yes. As of 2026, the Indian Embassy in Moscow has issued no travel advisory against Indian students studying in Russia, and Indian student enrolment in Russian medical universities has actually grown since 2022 — Ministry of External Affairs data shows more than 27,000 Indian students currently studying medicine in Russia. The universities we feature are in Astrakhan, Nalchik, Volgograd, Ufa, Simferopol, and Kazan, all far from the conflict zone, and daily academic life has continued without disruption. We track official advisories on an ongoing basis and will tell you directly if that position changes for any specific city.",
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
  deepDive: RUSSIA_DEEP_DIVE,
};

// All featured universities must be private. Georgia's Ministry of Education announced in
// December 2025 that state/government universities (Tbilisi State Medical University among
// them) will stop admitting new foreign students from the 2026-27 intake onward — see the
// "policy update" FAQ below. Do not add a state university back to this list without
// confirming current admission rules for Indian applicants first.
export const GEORGIA_LP_FEATURED_SLUGS = [
  "east-european-university",
  "caucasus-international-university",
  "david-tvildiani-medical-university",
  "university-of-georgia",
  "new-vision-university",
  "georgian-american-university",
];

const GEORGIA_DEEP_DIVE: DeepDiveSection[] = [
  {
    id: "govt-vs-private",
    eyebrow: "2026 Policy Update",
    heading: "Government vs private MBBS in Georgia — what changed for 2026",
    intro:
      "Georgia has two very different tracks for medical education, and the difference matters more than ever starting the 2026-27 academic year.",
    blocks: [
      {
        kind: "paragraph",
        text: "Until recently, Indian students could choose between Georgia's state (government) medical faculties — including the well-known Tbilisi State Medical University — and more than 30 private medical universities. From the 2026-27 intake, that has changed. In December 2025, Georgia's Ministry of Education announced that state universities will stop admitting new foreign students, except in narrow bilateral-agreement cases, as part of a funding reform that redirects public university seats and funding toward Georgian nationals. The Education Minister specifically cited Tbilisi State Medical University, where roughly 45% of students were foreign nationals, as a case the government wants to rebalance. Students already enrolled at a state university are unaffected and will complete their degree as planned.",
      },
      {
        kind: "paragraph",
        text: "This does not close the door on MBBS in Georgia. It means every new Indian applicant's pathway now runs through a private, NMC-aligned university — which is exactly where we focus. All six universities we feature on this page are private institutions with no exposure to this policy change, so nothing about your admission pathway or NMC recognition changes because of it.",
      },
      {
        kind: "table",
        headers: ["", "Government universities (from 2026-27)", "Private universities"],
        rows: [
          ["New foreign admissions", "Not available, except bilateral-agreement cases", "Fully open to Indian applicants"],
          ["Students already enrolled", "Continue and graduate normally", "Continue and graduate normally"],
          ["Typical 6-year total cost", "Was roughly ₹22L–₹30L where open", "₹28L–₹40L at our featured universities"],
          ["NMC / FMGE eligibility", "Same NMC screening applies", "Same NMC screening applies"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        text: "Because this is a live government policy and not a static fact, we recommend confirming the current admission position for any specific university on your counselling call rather than relying on any single source — including this page — for the final word.",
      },
    ],
  },
  {
    id: "cost-breakdown",
    eyebrow: "Full Cost Picture",
    heading: "What your ₹28L–₹40L actually covers",
    intro:
      "The total cost we quote for each university is tuition for the full 6 years. Living costs are additional — here is the real math.",
    blocks: [
      {
        kind: "paragraph",
        text: "The ₹28L–₹40L 'total cost for 6 years' figure quoted throughout this page refers to tuition fees only, at the private universities we feature. This is how most MBBS-abroad consultancies quote costs, but it means the number in an ad is rarely the number a family actually spends — and we would rather tell you that upfront than have you discover it in year 2.",
      },
      {
        kind: "paragraph",
        text: "On top of tuition, budget for hostel and living expenses of roughly $3,000–$3,500 per year (approx. ₹2.5L–₹3L per year) at our featured universities, covering accommodation, food, and day-to-day costs. Across all 6 years, that adds roughly ₹15L–₹18L to your budget, bringing the realistic all-in cost for MBBS in Georgia to somewhere in the ₹43L–₹58L range — still well below private MBBS in India.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "We build a full year-by-year cost plan — tuition, hostel, food, flights, and visa costs — for every student before they commit to a university, so there are no surprises in year 3 or 4.",
      },
    ],
  },
  {
    id: "curriculum",
    eyebrow: "Course Structure",
    heading: "How the 6-year MBBS is structured in Georgia",
    intro:
      "Every university we feature runs a curriculum built to satisfy India's NMC Foreign Medical Graduate Licentiate (FMGL) Regulations 2021 — not just Georgia's own accreditation.",
    blocks: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Years 1–2: Basic sciences — anatomy, physiology, and biochemistry — plus foundational clinical skills, taught fully in English.",
          "Years 3–4: Para-clinical and early clinical subjects — pathology, pharmacology, microbiology, and forensic medicine — alongside hospital-based clinical exposure.",
          "Years 5–6: Full clinical rotations across medicine, surgery, obstetrics & gynaecology, paediatrics, and allied specialities.",
          "Final year: A compulsory 12-month clinical internship completed at the same institution — this is a specific FMGL requirement, not an optional add-on.",
        ],
      },
      {
        kind: "paragraph",
        text: "Under the FMGL Regulations 2021, a foreign MBBS degree is only eligible for NMC registration if the course runs a minimum of 54 months of coursework plus a further 12 months of internship at the same institution, is taught entirely in English, and follows a curriculum the NMC considers commensurate with India's own Graduate Medical Education Regulations. Every university we feature meets this structure — we verify it before we ever recommend a university, not after a student has already enrolled.",
      },
      {
        kind: "paragraph",
        text: "The full course, including internship, must also be completed within 10 years of joining — a rule that mainly matters if a student needs to repeat a year. We build realistic academic timelines with every student from day one rather than promising an unrealistic fast-track.",
      },
    ],
  },
  {
    id: "fmge-outcomes",
    eyebrow: "Licensing Outcomes",
    heading: "FMGE / NExT pass rates for MBBS graduates from Georgia",
    intro:
      "A Georgian MBBS degree is only useful in India once you clear FMGE (soon NExT) and register with the NMC — so pass-rate data matters more than any ranking.",
    blocks: [
      {
        kind: "paragraph",
        text: "According to the National Board of Examinations in Medical Sciences (NBEMS), 4,221 Indian students who completed their MBBS in Georgia appeared for FMGE in 2024, and 1,505 cleared it — an overall pass rate of 35.65%. Individual universities perform very differently from that average, which is why the per-university number matters more than the country-wide one.",
      },
      {
        kind: "table",
        headers: ["University", "FMGE 2024 pass rate"],
        rows: [
          ["Georgian American University", "80.33%"],
          ["BAU International University", "63.29%"],
          ["Georgian National University SEU", "60.39%"],
          ["Georgia national average (all universities)", "35.65%"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        text: "FMGE pass rates change every exam cycle and depend heavily on how seriously a student prepares during their clinical years, not just which university they attend. We share each featured university's latest published numbers on the counselling call, and run free FMGE/NExT preparation support for students who join through us — treat any pass-rate figure, including the ones above, as a starting point for research rather than a guarantee.",
      },
    ],
  },
  {
    id: "tbilisi-vs-batumi",
    eyebrow: "Choosing Your City",
    heading: "Tbilisi or Batumi — where should you study?",
    intro:
      "Most of Georgia's MBBS universities are in the capital, Tbilisi, but a growing number of Indian students are choosing Batumi on the Black Sea coast. Here is the honest comparison.",
    blocks: [
      {
        kind: "table",
        headers: ["", "Tbilisi", "Batumi"],
        rows: [
          ["Cost of living", "Approx. ₹30,000–₹46,500/month", "Approx. ₹25,000–₹38,000/month — about 5% cheaper"],
          ["Climate", "Continental; can drop to -5°C to -10°C in winter", "Milder and subtropical, though wetter"],
          ["Indian student community", "Largest and most established in the country", "Smaller, but steadily growing"],
          ["University choice", "Most of our featured universities are here", "Home to Batumi-based options like BAU International University"],
          ["City character", "Busy, urban, capital-city infrastructure", "Slower-paced, coastal, considered very safe"],
        ],
      },
      {
        kind: "paragraph",
        text: "There is no universally 'better' choice. A student who wants the largest peer group and the widest choice of universities usually leans toward Tbilisi, while a student prioritising a lower monthly budget and a calmer, warmer city often prefers Batumi. We factor this into the shortlist we build for each student instead of defaulting everyone to the capital.",
      },
    ],
  },
  {
    id: "visa-process",
    eyebrow: "Visa & Documentation",
    heading: "Georgia's D3 student visa — the real step-by-step process",
    intro:
      "Indian students apply for Georgia's D3 (long-term study) visa. It is document-driven with no interview, but the sequence matters.",
    blocks: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Your university issues an official enrollment/admission order once you accept your seat — the entire visa process is built around this document.",
          "You register on Georgia's consular portal (geoconsul.gov.ge) and upload your documents: passport, admission order, proof of funds, health insurance, medical certificate, and police clearance certificate.",
          "You pay the D3 visa fee (approx. ₹1,790) plus the VFS Global service fee (approx. ₹1,500); MBBS applicants also pay a NEET-certificate validation fee (approx. ₹538).",
          "Processing typically takes 10–30 working days. With complete, correctly prepared documentation, approval rates for Indian students run above 95%.",
          "After you land in Georgia, you have 45 days to begin your Temporary Residence Card (residence permit) application — a hard deadline, not a formality.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The 45-day residence permit deadline is the single most common thing students miss when they arrange their own paperwork. We track this date for every student we place and handle the registration on your behalf so it never slips.",
      },
    ],
  },
  {
    id: "scholarships",
    eyebrow: "Reducing Your Cost",
    heading: "Scholarships and ways to lower your MBBS cost in Georgia",
    intro:
      "Georgia doesn't offer free MBBS the way some destinations claim, but genuine merit-based reductions do exist — here is what's real.",
    blocks: [
      {
        kind: "list",
        items: [
          "Merit-based tuition waivers of roughly 10-50%, tied to your Class 12 PCB percentage — most universities set a minimum around 55%, with the largest waivers reserved for students scoring 80% and above.",
          "Sibling and family discounts — some universities reduce tuition by around 20% when two or more family members enrol at the same institution.",
          "Early-application intake pricing at a few universities, which can lock in a lower fee than applying closer to the deadline.",
        ],
      },
      {
        kind: "paragraph",
        text: "None of this is guaranteed or automatic — scholarship bands, minimum marks, and available seats change every intake, and not every university offers every discount. We check what your specific Class 12 percentage qualifies you for at each of our featured universities before you apply, so you are working with real numbers instead of an advertised 'up to 50% off' headline.",
      },
    ],
  },
  {
    id: "georgia-vs-others",
    eyebrow: "Country Comparison",
    heading: "Georgia vs Russia vs Vietnam — how the three compare",
    intro:
      "All three are NMC-recognized MBBS-abroad destinations we work with. Here is how they actually differ, not how any one of them markets itself.",
    blocks: [
      {
        kind: "table",
        headers: ["", "Georgia", "Russia", "Vietnam"],
        rows: [
          ["6-year tuition (featured universities)", "₹28L–₹40L", "₹19L–₹35L", "₹21L–₹30L"],
          ["University choice", "40+ private, NMC-aligned universities", "60+ NMC-aligned universities", "A handful of genuine English-medium options"],
          ["Language of instruction", "English at all featured universities", "English at all featured universities", "English only at our featured universities — most Vietnamese colleges teach in Vietnamese"],
          ["Climate", "Continental (Tbilisi) to subtropical (Batumi)", "Cold winters across most cities", "Tropical, warm year-round"],
          ["Flight time from India", "Approx. 5–7 hours", "Approx. 6–9 hours depending on city", "Approx. 4–6 hours — shortest of the three"],
        ],
      },
      {
        kind: "paragraph",
        text: "There is no single 'best' country — the right fit depends on your NEET score, budget, and what you and your family are comfortable with. We compare all three honestly against your specific situation on the counselling call, instead of steering every student toward whichever destination we happen to be promoting that month.",
      },
    ],
  },
];

export const GEORGIA_LP_CONFIG: CountryLpConfig = {
  slug: "georgia",
  countryName: "Georgia",
  flag: "🇬🇪",
  contentReviewedAt: "2026-07-10",
  heroKicker: "Trusted MBBS Admission Partner Since 2014",
  heroHeadlinePrefix: "Want to become a doctor?",
  heroHeadlineHighlight: "Study MBBS in Georgia. We will get you admitted.",
  heroSubtext:
    "Trusted by 3,000+ Indian students since 2014. We help you get admitted to private, NMC-aligned MBBS universities across Georgia — European-standard, English medium, and one of the highest FMGE pass rates among MBBS-abroad destinations. Book a free counselling call and we will guide you.",
  whyIntro:
    "Georgia offers European-standard medical education at the edge of the EU, with fully English-medium MBBS programmes at private, NMC-aligned universities, strong FMGE outcomes, and a large, settled Indian student community in Tbilisi and Batumi.",
  comparisonRows: [
    { aspect: "Total cost for 6 years", india: "₹70L to 1.5 Cr (private college)", abroad: "₹28L to ₹40L total (featured universities)", abroadWins: true },
    { aspect: "NEET score needed", india: "550+ for a government seat", abroad: "Qualifying marks enough", abroadWins: true },
    { aspect: "Seat availability", india: "20 lakh NEET candidates, ~1 lakh MBBS seats", abroad: "Seats available across 40+ private, NMC-aligned universities", abroadWins: true },
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
      q: "Is it true that Georgia has banned foreign students from MBBS? Can I still get admission in 2026?",
      a: "Georgia has not banned MBBS for foreign students, but there is a real policy change worth understanding. In December 2025, Georgia's Ministry of Education announced that government (state) universities — including Tbilisi State Medical University — will stop admitting new foreign students from the 2026-27 academic year onward, except in limited bilateral-agreement cases. Students already enrolled at state universities are not affected and can complete their degree as planned. This does not affect Georgia's private, NMC-aligned medical universities, which remain fully open to Indian applicants — every university we feature on this page is private, so your admission pathway is unaffected. Because this is a recent government policy, we recommend confirming the latest position with us on your counselling call before you finalize a university.",
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
      q: "What is the FMGE pass rate for MBBS graduates from Georgia?",
      a: "Per the National Board of Examinations (NBEMS) FMGE 2024 results, Indian students who completed MBBS in Georgia cleared FMGE at 35.65% overall — well above the destinations-wide average — with individual universities performing considerably higher; Georgian American University, for example, is among the strongest performers. FMGE/NExT pass rates vary by exam cycle and by university, so we walk you through the latest published numbers for each university we feature during your counselling call, rather than quoting a single fixed figure here.",
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
  deepDive: GEORGIA_DEEP_DIVE,
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
