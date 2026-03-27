import type {
  Country,
  Course,
  Faq,
  LandingPage,
  LinkItem,
  ProgramOffering,
  TeachingPhase,
  University,
  UniversityGalleryImage,
  YearlyCostBreakdown,
} from "@/lib/data/types";
import { applyUniversityContentOverride } from "@/lib/data/university-content-overrides";
import { getUniversityGalleryImages } from "@/lib/university-media";

type UniversitySeed = Omit<University, "galleryImages"> & {
  galleryImages?: UniversityGalleryImage[];
};

function buildRecognitionLinks(officialWebsite: string): LinkItem[] {
  return [
    { label: "Official university website", url: officialWebsite },
    { label: "World Directory of Medical Schools", url: "https://www.wdoms.org/" },
    { label: "National Medical Commission", url: "https://www.nmc.org.in/" },
  ];
}

function buildReferences(
  officialWebsite: string,
  officialProgramUrl: string
): LinkItem[] {
  return [
    { label: "Official university website", url: officialWebsite },
    { label: "Official admissions or program page", url: officialProgramUrl },
    { label: "WDOMS directory", url: "https://www.wdoms.org/" },
  ];
}

function buildFaq(
  universityName: string,
  countryName: string,
  medium: string
): Faq[] {
  return [
    {
      question: `Is ${universityName} a practical choice for Indian students?`,
      answer: `${universityName} works best when the student is comfortable with a full international move, is ready for local-language clinical adaptation, and wants a structured university-led medical degree instead of only a low-fee shortcut.`,
    },
    {
      question: `What is the usual medium of instruction at ${universityName}?`,
      answer: `The current program positioning for this seed dataset is ${medium}. Families should still verify the latest year-wise language pattern on the official university page before admission.`,
    },
    {
      question: `What should students verify before choosing ${universityName} in ${countryName}?`,
      answer: `Verify the current teaching language, WDOMS listing, India-return licensing fit, total six-year cost, and the real level of student support in the city before paying any admission amount.`,
    },
  ];
}

function buildYearlyCostBreakdown(
  durationYears: number,
  annualTuitionUsd: number,
  livingUsd: number
): YearlyCostBreakdown[] {
  return Array.from({ length: durationYears }, (_, index) => ({
    yearLabel: `Year ${index + 1}`,
    tuitionUsd: annualTuitionUsd,
    hostelUsd: 0,
    livingUsd,
    totalUsd: annualTuitionUsd + livingUsd,
  }));
}

function buildTeachingPhases(
  phases: Array<[phase: string, language: string, details: string]>
): TeachingPhase[] {
  return phases.map(([phase, language, details]) => ({
    phase,
    language,
    details,
  }));
}

export const countries: Country[] = [
  {
    slug: "russia",
    name: "Russia",
    region: "Eastern Europe",
    summary:
      "Russia remains one of the most established MBBS destinations for Indian students who want large public universities, long-running medical programs, and familiar exam pathways.",
    whyStudentsChooseIt:
      "Students choose Russia for scale, clinical exposure, established university brands, and clear MBBS affordability compared with many private options.",
    climate: "Cold winters, moderate summers",
    currencyCode: "RUB",
    metaTitle: "Study in Russia",
    metaDescription:
      "Explore MBBS and other study-abroad options in Russia with university comparisons, fees, intake timelines, and lead capture support.",
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    region: "Southeast Asia",
    summary:
      "Vietnam is a fast-moving destination for Indian students who want a closer geography, partner-driven support, and growing English-medium medical options.",
    whyStudentsChooseIt:
      "Students choose Vietnam for geography, value, approachable campus life, and hands-on support models around admission and settlement.",
    climate: "Tropical and humid with regional variation",
    currencyCode: "VND",
    metaTitle: "Study in Vietnam",
    metaDescription:
      "Compare medical universities in Vietnam, fees, hostel options, and admissions support built for Indian students.",
  },
  {
    slug: "georgia",
    name: "Georgia",
    region: "Eastern Europe",
    summary:
      "Georgia offers English-medium medical programs, compact cities, and a straightforward student experience for applicants prioritizing international exposure.",
    whyStudentsChooseIt:
      "Students choose Georgia for English-medium delivery, urban safety, and institutions that feel accessible for first-time international families.",
    climate: "Four seasons with mild winters in Tbilisi",
    currencyCode: "GEL",
    metaTitle: "Study in Georgia",
    metaDescription:
      "Plan MBBS in Georgia with course, fee, and university-level detail built for high-intent students.",
  },
  {
    slug: "kyrgyzstan",
    name: "Kyrgyzstan",
    region: "Central Asia",
    summary:
      "Kyrgyzstan is often shortlisted for cost-conscious MBBS planning, especially for students comparing hostel-backed universities and entry affordability.",
    whyStudentsChooseIt:
      "Students choose Kyrgyzstan for lower fee bands, simple city ecosystems, and a strong place in affordability-driven comparisons.",
    climate: "Continental climate with cold winters",
    currencyCode: "KGS",
    metaTitle: "Study in Kyrgyzstan",
    metaDescription:
      "Find affordable MBBS options in Kyrgyzstan with filters for fees, hostel, medium, and eligibility.",
  },
];

export const courses: Course[] = [
  {
    slug: "mbbs",
    name: "Bachelor of Medicine, Bachelor of Surgery",
    shortName: "MBBS",
    durationYears: 6,
    summary:
      "A medical degree track for Indian students seeking an international undergraduate route into medicine with later licensing pathways.",
    metaTitle: "Study MBBS Abroad",
    metaDescription:
      "Compare global MBBS destinations, universities, fees, and student support to shortlist the right path.",
  },
];

function withUniversityMediaDefaults(university: UniversitySeed): University {
  const galleryImages = getUniversityGalleryImages(university);

  return applyUniversityContentOverride({
    ...university,
    coverImageUrl: university.coverImageUrl ?? galleryImages[0]?.url,
    galleryImages,
  });
}

const universitySeeds: UniversitySeed[] = [
  {
    slug: "kazan-state-medical-university",
    countrySlug: "russia",
    name: "Kazan State Medical University",
    city: "Kazan",
    type: "Public",
    establishedYear: 1814,
    summary:
      "A long-standing public medical university known for established MBBS delivery and strong international student recognition.",
    featured: true,
    officialWebsite: "https://kazangmu.ru/en/",
    campusLifestyle:
      "A large city environment with established Indian student communities and hospital-linked learning exposure.",
    cityProfile:
      "Kazan gives students a larger city experience, stronger public transport, broader student housing choices, and a more established international ecosystem than many lower-cost Russian destinations.",
    clinicalExposure:
      "Students usually benefit from a university with mature hospital linkages, simulation exposure, and a city where clinical environments feel more developed than small-town alternatives.",
    hostelOverview:
      "Hostel planning is usually manageable, but students should verify room type, walking distance, and whether first-year placement differs from later years.",
    indianFoodSupport:
      "Indian mess options, Indian groceries, and peer-led support are easier to find in Kazan than in smaller Russian cities, which matters for long-stay comfort.",
    safetyOverview:
      "The city is generally easier for international students to navigate than remote locations, but winter preparation, documentation discipline, and local-language basics still matter.",
    studentSupport:
      "This profile suits students who want a university with stronger brand recall, visible Indian student presence, and more predictable city infrastructure.",
    whyChoose: [
      "Historic public medical university with strong recall among Indian families.",
      "Large city ecosystem with better transport, student services, and peer networks.",
      "Fits students who value university reputation more than lowest-possible fees.",
    ],
    thingsToConsider: [
      "Usually costs more than lower-tier Russian budget options.",
      "Clinical communication still requires local-language adjustment in later years.",
      "A bigger city can feel less hand-held than smaller consultancy-managed campuses.",
    ],
    bestFitFor: [
      "Students wanting an established public university brand in Russia.",
      "Families prioritizing city infrastructure and stronger student networks.",
      "Applicants comfortable with a moderate-to-premium Russian budget band.",
    ],
    teachingHospitals: [
      "University-linked clinical departments",
      "Municipal hospitals in Kazan",
      "Simulation and skills training labs",
    ],
    recognitionBadges: ["NMC", "WHO", "English Medium"],
    recognitionLinks: buildRecognitionLinks("https://kazangmu.ru/en/"),
    faq: buildFaq(
      "Kazan State Medical University",
      "Russia",
      "English with local-language support during clinical years"
    ),
    references: buildReferences(
      "https://kazangmu.ru/en/",
      "https://kazangmu.ru/en/"
    ),
    similarUniversitySlugs: [
      "altai-state-medical-university",
      "georgian-national-university-seu",
    ],
  },
  {
    slug: "altai-state-medical-university",
    countrySlug: "russia",
    name: "Altai State Medical University",
    city: "Barnaul",
    type: "Public",
    establishedYear: 1954,
    summary:
      "A cost-aware Russian option for students evaluating public university value and consistent hostel-backed MBBS intake.",
    featured: false,
    officialWebsite: "https://asmu.ru/",
    campusLifestyle:
      "A quieter student city with an affordability profile that appeals to budget-driven families.",
    cityProfile:
      "Barnaul is a smaller and quieter student city, which can work well for families who prefer a simpler living environment over a major metro experience.",
    clinicalExposure:
      "The clinical environment is better assessed as a practical public-university pathway rather than a prestige-led city-hospital route, so hospital access should be verified carefully.",
    hostelOverview:
      "Hostel availability is one of the clearer advantages here, especially for budget planning and first-time international families.",
    indianFoodSupport:
      "Indian food support may be more limited than in Russia’s biggest cities, so mess arrangements and self-cooking options should be checked in advance.",
    safetyOverview:
      "A smaller city often brings calmer day-to-day life, but it can also mean fewer backup services for students who need heavy external support.",
    studentSupport:
      "This profile is suited to students who care more about affordability and public-university structure than premium city branding.",
    whyChoose: [
      "More budget-aware than premium Russian university options.",
      "Public university positioning with a manageable cost profile.",
      "Often shortlisted by families who want hostel-backed planning.",
    ],
    thingsToConsider: [
      "Smaller city with fewer lifestyle conveniences than Kazan or Moscow.",
      "Students may need more self-management around food and adjustment.",
      "Less suitable if brand prestige is a core family requirement.",
    ],
    bestFitFor: [
      "Cost-conscious students still wanting a public Russian university.",
      "Families preferring a quieter student city over a major metro.",
      "Applicants comfortable with a practical rather than prestige-led shortlist.",
    ],
    teachingHospitals: [
      "Regional teaching hospitals",
      "Public clinical training departments",
      "University practical skills centers",
    ],
    recognitionBadges: ["NMC", "WHO", "Hostel"],
    recognitionLinks: buildRecognitionLinks("https://asmu.ru/"),
    faq: buildFaq(
      "Altai State Medical University",
      "Russia",
      "English with additional local-language support in clinical settings"
    ),
    references: buildReferences("https://asmu.ru/", "https://asmu.ru/"),
    similarUniversitySlugs: [
      "kazan-state-medical-university",
      "international-school-of-medicine",
    ],
  },
  {
    slug: "nam-can-tho-university-faculty-of-medicine",
    countrySlug: "vietnam",
    name: "Nam Can Tho University Faculty of Medicine",
    city: "Can Tho",
    type: "Private",
    establishedYear: 2013,
    summary:
      "A young private university in Can Tho that has actively partnered with Indian education organisations for MBBS recruitment; NMC compliance is claimed but WDOMS listing requires independent verification at search.wdoms.org before enrollment.",
    featured: false,
    officialWebsite: "https://en.nctu.edu.vn",
    campusLifestyle:
      "A support-heavy environment with structured Indian student onboarding and a relaxed Mekong Delta city setting.",
    cityProfile:
      "Can Tho is Vietnam's fourth-largest city and Mekong Delta regional capital — affordable, calm, and well-connected by road and air to Ho Chi Minh City.",
    clinicalExposure:
      "Clinical training through affiliated partner hospitals; students should independently confirm hospital depth and patient exposure scope before enrolling.",
    hostelOverview:
      "Separate male/female hostel with Indian food facilities; hostel-backed planning is one of the institution's key selling points for first-year international students.",
    indianFoodSupport:
      "Indian food is arranged through the hostel mess; Indian student community exists but is smaller than at Can Tho University of Medicine and Pharmacy.",
    safetyOverview:
      "Can Tho is consistently rated safe; the city's smaller scale makes daily navigation manageable for international students.",
    studentSupport:
      "VMED and similar Indian partner organisations support the admission and onboarding process; institutional English-language support is structured.",
    whyChoose: [
      "Affordable fees (~$4,300/year) relative to private Vietnam options.",
      "Structured Indian student support with hostel and Indian food from day one.",
      "Can Tho location offers a calmer study environment than major Vietnamese metros.",
    ],
    thingsToConsider: [
      "WDOMS listing is claimed but not independently confirmed through the official WDOMS portal — verify at search.wdoms.org before paying any fees.",
      "Institution is newer (est. 2013) with a shorter track record than public universities.",
      "NMC recognition should be confirmed directly with NMC India and not relied on solely through agent claims.",
    ],
    bestFitFor: [
      "Students wanting a structured, support-heavy entry into Vietnam MBBS with Indian food and hostel from day one.",
      "Applicants who have independently verified the WDOMS and NMC status and are comfortable with a newer institution.",
      "Families comparing Can Tho options at a lower price point than Can Tho UMP.",
    ],
    teachingHospitals: [
      "Nam Can Tho University affiliated teaching hospitals",
      "Partner clinical institutions in Can Tho region",
    ],
    recognitionBadges: ["NMC (claimed)", "WHO (claimed)", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://en.nctu.edu.vn"),
    faq: buildFaq(
      "Nam Can Tho University Faculty of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences(
      "https://en.nctu.edu.vn",
      "https://en.nctu.edu.vn"
    ),
    similarUniversitySlugs: [
      "can-tho-university-medicine-pharmacy",
      "phan-chau-trinh-university",
    ],
  },
  {
    slug: "phan-chau-trinh-university",
    countrySlug: "vietnam",
    name: "Phan Chau Trinh University",
    city: "Da Nang",
    type: "Private",
    establishedYear: 2007,
    summary:
      "Phan Chau Trinh University (PCTU) is one of Vietnam's most distinct private medical schools — it holds WDOMS ID F0008367 (independently verifiable at search.wdoms.org) and ECFMG certification from the 2024 graduation year. Only 60 international seats are available per year, and admissions typically close by May. PCTU is the only university in Vietnam with a simulation hospital, a medical museum, and a stem cell research centre. Its 9 university-owned hospitals provide 1,500+ beds for clinical training from Year 1. The curriculum integrates USMLE preparation with American faculty from partner institutions. Fees run approximately $5,500/year; total 6-year cost including hostel is approximately ₹43–45 lakhs. Located in Da Nang — Vietnam's most liveable coastal city.",
    featured: false,
    officialWebsite: "https://pctu.edu.vn/en",
    campusLifestyle:
      "PCTU's Da Nang campus is purpose-built for medical education — it houses a simulation hospital (the only one at any Vietnam medical university), a medical museum, anatomy labs, a stem cell research centre, and an on-campus library with international medical databases. The university's 9 owned hospitals across Vietnam give students hands-on exposure from Year 1, which is significantly earlier than most competing institutions. The campus is 15 minutes from Da Nang's famous My Khe Beach; cycling, beach runs, and outdoor student life are part of the daily routine.",
    cityProfile:
      "Da Nang is Vietnam's most liveable city — a coastal metro of 1.3 million people ranked #1 for liveability in Vietnam six years running. The city has Da Nang International Airport with direct flights to India (Ho Chi Minh City connection: 1 hour; Chennai: ~3.5 hours direct; Hanoi: 1.5 hours). Living costs are approximately ₹14,000–₹20,000/month — lower than Hanoi or HCMC. Da Nang is famous for its beaches (My Khe, Non Nuoc), safety record (lowest crime rate of any major Vietnam city), and modern infrastructure including a ring expressway and fast rail connections.",
    clinicalExposure:
      "PCTU operates 9 university-owned hospitals across Vietnam providing 1,500+ beds — clinical training begins from Year 1 in PCTU's simulation hospital before progressing to live patient rotations. The Tam Tri hospital chain (PCTU's owned hospital network) spans Da Nang, Quang Nam, Nha Trang, Ho Chi Minh City, Dong Thap, and other locations, exposing students to varied patient populations and case mixes. PCTU's USMLE-integrated curriculum means clinical training is structured around international medical education standards rather than purely Vietnamese domestic protocols. ECFMG certification from the 2024 graduation year confirms USMLE eligibility for graduates.",
    hostelOverview:
      "Separate AC hostels for male and female students with 2-sharing, 3-sharing, and 4-sharing options. Hostel fees include 3–4 daily Indian meals (breakfast, lunch, dinner), Wi-Fi, utilities, CCTV, and laundry. Annual hostel cost: approximately ₹1,90,000 (4-sharing) to ₹2,50,000 (2-sharing). The 60-student annual international intake means hostel availability is guaranteed for all enrolled students without waitlisting.",
    indianFoodSupport:
      "PCTU provides dedicated Indian mess catering for its international students — vegetarian, non-vegetarian, and Jain meal options are available. Da Nang's growing expat community (including a significant Indian business and student presence) has added multiple Indian restaurants and grocery suppliers in the city. The small, close-knit 60-student per-year international cohort creates a tight community that self-organises Indian cultural events including Diwali and Eid celebrations.",
    safetyOverview:
      "Da Nang consistently records Vietnam's lowest major crime rates — it ranks as the safest large city in Vietnam in multiple annual surveys. PCTU's campus has 24-hour CCTV and security personnel. The city's coastal geography, wide boulevards, and absence of the congestion found in Hanoi or HCMC make it particularly well-suited to female international students. Students should maintain standard document discipline and register with the Indian Consulate General in Ho Chi Minh City upon arrival.",
    studentSupport:
      "PCTU's limited annual intake (60 seats) means the international admissions team can provide personalised pre-departure and on-arrival support rather than bulk-processing large cohorts. An English-speaking international student coordinator handles visa renewals, academic queries, and hospital placement logistics. The university offers integrated Vietnamese language training from semester one, a structured USMLE/FMGE preparation curriculum with American faculty involvement, and formal alumni mentoring connecting current students with PCTU graduates who have returned to India.",
    whyChoose: [
      "WDOMS ID F0008367 independently confirmed + ECFMG-certified from 2024 graduates — only 60 seats/year means focused, non-crowded clinical training across 9 university-owned hospitals.",
      "The only Vietnam medical university with a simulation hospital, medical museum, and stem cell research centre — infrastructure that puts PCTU ahead of most private universities in the region.",
      "USMLE-integrated curriculum with American faculty: PCTU graduates have both India NExT/FMGE and USMLE pathways open, unlike most Vietnam universities that focus solely on the India-return route.",
    ],
    thingsToConsider: [
      "Admissions close by May each year due to the 60-seat cap — students targeting PCTU must apply and commit early; seats fill faster than most India agents communicate.",
      "Private medical faculty established in 2017: strong infrastructure and recognition, but India-return alumni track record is shorter than Can Tho (1979), Hue (1957), or Hanoi Medical (1902).",
      "At $5,500/year (total ₹43–45 lakhs over 6 years including hostel), PCTU is mid-to-high range for Vietnam — justified by unique facilities, 9 hospitals, and dual FMGE/USMLE pathway.",
    ],
    bestFitFor: [
      "Students who want independently verified WDOMS/ECFMG recognition, a coastal Da Nang lifestyle, and clinical training starting from Year 1 — not just Year 3.",
      "Applicants who want dual FMGE/NExT and USMLE pathway optionality through PCTU's American faculty and ECFMG-certified curriculum.",
      "Families who prefer a smaller, focused international cohort (60 students/year) over a large 600+ student batch — PCTU's structure means more faculty attention per student.",
    ],
    teachingHospitals: [
      "PCTU Simulation Hospital (on-campus — unique in Vietnam for medical universities)",
      "Tam Tri Da Nang General Hospital (primary clinical training)",
      "Tam Tri Quang Nam General Hospital",
      "Tam Tri Nha Trang General Hospital",
      "Tam Tri Saigon General Hospital (Ho Chi Minh City)",
      "Tam Tri Dong Thap General Hospital",
      "Tam Tri Quy Nhon General Hospital",
      "Tam Tri Me Linh Hospital (Hanoi region)",
      "9 university-owned hospitals total — 1,500+ beds across Vietnam",
    ],
    recognitionBadges: ["NMC", "WDOMS (F0008367)", "ECFMG (from 2024 graduates)", "WHO", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://pctu.edu.vn/en"),
    faq: buildFaq(
      "Phan Chau Trinh University",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences(
      "https://pctu.edu.vn/en",
      "https://pctu.edu.vn/en"
    ),
    similarUniversitySlugs: [
      "duy-tan-university-faculty-of-medicine",
      "can-tho-university-medicine-pharmacy",
    ],
  },
  {
    slug: "georgian-national-university-seu",
    countrySlug: "georgia",
    name: "Georgian National University SEU",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2001,
    summary:
      "A Tbilisi-based English-medium option for students who want city living and a compact international environment.",
    featured: true,
    officialWebsite: "https://seu.edu.ge/en/",
    campusLifestyle:
      "City-centric student life with strong accessibility for families evaluating safety and convenience.",
    cityProfile:
      "Tbilisi gives students a more urban European-style environment with broader food, housing, and transport choices than smaller medical destinations.",
    clinicalExposure:
      "Students usually shortlist SEU for its English-medium pathway and city environment, but hospital exposure quality should still be checked in the current admissions cycle.",
    hostelOverview:
      "Accommodation and private housing options are part of the appeal here, especially for students who want more flexibility beyond a basic hostel-only route.",
    indianFoodSupport:
      "Tbilisi is generally more workable for Indian food, groceries, and social adjustment than smaller cities, which can reduce first-year friction.",
    safetyOverview:
      "The city is widely perceived as student-friendly, but families should still budget for city living and verify support after arrival.",
    studentSupport:
      "This is a strong shortlist candidate for students who want English-medium teaching and a more cosmopolitan setting from the start.",
    whyChoose: [
      "English-medium city-based medical study environment.",
      "Tbilisi offers better day-to-day convenience for many international students.",
      "Useful for families who want a modern, urban student experience.",
    ],
    thingsToConsider: [
      "Private-university due diligence is still essential.",
      "Living costs can feel higher than budget destinations like Kyrgyzstan.",
      "Students should verify clinical access and licensing fit carefully.",
    ],
    bestFitFor: [
      "Students who want Tbilisi city life with English-medium learning.",
      "Families preferring convenience and accessibility over lowest cost.",
      "Applicants comfortable with a private-university route.",
    ],
    teachingHospitals: [
      "Affiliated teaching hospitals in Tbilisi",
      "Clinical rotation partners",
      "Skills and simulation centers",
    ],
    recognitionBadges: ["NMC", "English Medium", "Urban Campus"],
    recognitionLinks: buildRecognitionLinks("https://seu.edu.ge/en/"),
    faq: buildFaq(
      "Georgian National University SEU",
      "Georgia",
      "English-medium teaching with clinical adaptation in later years"
    ),
    references: buildReferences(
      "https://seu.edu.ge/en/",
      "https://seu.edu.ge/en/"
    ),
    similarUniversitySlugs: [
      "east-european-university",
      "kazan-state-medical-university",
    ],
  },
  {
    slug: "east-european-university",
    countrySlug: "georgia",
    name: "East European University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2012,
    summary:
      "A younger Georgian institution often shortlisted for English-medium delivery and straightforward admissions.",
    featured: false,
    officialWebsite: "https://eeu.edu.ge/en/",
    campusLifestyle:
      "An international-student focused environment with a lighter-feel campus footprint.",
    cityProfile:
      "Like other Tbilisi options, EEU benefits from a city that feels relatively accessible for international students and parents visiting from India.",
    clinicalExposure:
      "Students usually consider EEU for its international focus and English-medium delivery, but practical hospital depth should be verified against current batches.",
    hostelOverview:
      "Housing planning is part of the decision because some students compare hostel convenience against private rentals in Tbilisi.",
    indianFoodSupport:
      "Tbilisi’s broader city ecosystem makes food adjustment easier than in smaller destinations even when the university itself is not heavily India-focused.",
    safetyOverview:
      "The city environment generally supports a comfortable student transition, though cost discipline and proper housing choice remain important.",
    studentSupport:
      "EEU tends to appeal when students want a simpler admissions path and a lighter-feel international environment in Tbilisi.",
    whyChoose: [
      "English-medium positioning in Tbilisi.",
      "International-student focused environment.",
      "Often seen as a more approachable private option within Georgia.",
    ],
    thingsToConsider: [
      "Younger institution compared with older legacy universities.",
      "City living costs still need careful budgeting.",
      "Recognition and hospital exposure should be cross-checked directly.",
    ],
    bestFitFor: [
      "Students wanting an English-medium Georgia option with city access.",
      "Families prioritizing Tbilisi over a small-town study destination.",
      "Applicants comfortable validating quality and outcomes carefully.",
    ],
    teachingHospitals: [
      "Affiliated Tbilisi clinical sites",
      "Practical skills labs",
      "Partner hospital departments",
    ],
    recognitionBadges: ["English Medium", "Hostel", "International Focus"],
    recognitionLinks: buildRecognitionLinks("https://eeu.edu.ge/en/"),
    faq: buildFaq(
      "East European University",
      "Georgia",
      "English-medium teaching with clinical communication support"
    ),
    references: buildReferences(
      "https://eeu.edu.ge/en/",
      "https://eeu.edu.ge/en/"
    ),
    similarUniversitySlugs: [
      "georgian-national-university-seu",
      "phan-chau-trinh-university",
    ],
  },
  {
    slug: "international-school-of-medicine",
    countrySlug: "kyrgyzstan",
    name: "International School of Medicine",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2003,
    summary:
      "A well-known Kyrgyzstan option in affordability-focused MBBS comparisons with a familiar international intake.",
    featured: true,
    officialWebsite: "https://ism.iuk.kg/en/",
    campusLifestyle:
      "A practical student setup with predictable hostel-backed planning for first-time families.",
    cityProfile:
      "Bishkek is often chosen because it balances affordability with enough city infrastructure to support international students without the cost of premium destinations.",
    clinicalExposure:
      "Clinical training is a major decision point in Kyrgyzstan, so students should verify hospital access, patient exposure, and local-language readiness carefully.",
    hostelOverview:
      "Hostel-backed affordability is one of the core reasons this university appears in shortlists, especially for students coming abroad for the first time.",
    indianFoodSupport:
      "Indian food support and peer communities are usually stronger here than in many other low-cost destinations, which helps with first-year adjustment.",
    safetyOverview:
      "Bishkek is often seen as manageable for student life, but families should still check hostel supervision, commute patterns, and health insurance logistics.",
    studentSupport:
      "This option is usually shortlisted by families trying to balance affordability, city infrastructure, and a familiar international intake.",
    whyChoose: [
      "One of the more familiar names in Kyrgyzstan MBBS comparisons.",
      "Affordability with a workable city ecosystem.",
      "Useful for students who want hostel-backed planning and peer networks.",
    ],
    thingsToConsider: [
      "Students must verify India-return licensing fit very carefully.",
      "Clinical quality can vary significantly by institution and batch experience.",
      "Budget-led decisions can backfire if due diligence is weak.",
    ],
    bestFitFor: [
      "Students prioritizing affordability but still wanting a capital-city setup.",
      "Families comparing Kyrgyzstan against higher-cost Georgia or Russia options.",
      "Applicants who will independently verify recognition and clinical standards.",
    ],
    teachingHospitals: [
      "Affiliated city hospitals in Bishkek",
      "Clinical partner departments",
      "Simulation-based practical labs",
    ],
    recognitionBadges: ["NMC", "WHO", "Affordable"],
    recognitionLinks: buildRecognitionLinks("https://ism.iuk.kg/en/"),
    faq: buildFaq(
      "International School of Medicine",
      "Kyrgyzstan",
      "English-medium teaching with local-language clinical adaptation"
    ),
    references: buildReferences(
      "https://ism.iuk.kg/en/",
      "https://ism.iuk.kg/en/"
    ),
    similarUniversitySlugs: [
      "asian-medical-institute",
      "altai-state-medical-university",
    ],
  },
  {
    slug: "asian-medical-institute",
    countrySlug: "kyrgyzstan",
    name: "Asian Medical Institute",
    city: "Kant",
    type: "Private",
    establishedYear: 2004,
    summary:
      "A fee-sensitive MBBS destination for applicants who are prioritizing affordability and intake accessibility.",
    featured: false,
    officialWebsite: "https://asianmedicalinstitute.com/",
    campusLifestyle:
      "A straightforward, budget-led environment with familiar international student positioning.",
    cityProfile:
      "Kant is chosen mostly for cost efficiency rather than city lifestyle, so students should expect a more practical and less premium student experience.",
    clinicalExposure:
      "Clinical exposure needs careful validation because low-fee institutions can look attractive on price but differ meaningfully in hospital depth and training quality.",
    hostelOverview:
      "Hostel affordability is a major draw, but students should check room conditions, supervision, and actual distance from study locations.",
    indianFoodSupport:
      "Indian food and peer support can be available, but students should verify how much is university-led versus consultancy-arranged.",
    safetyOverview:
      "The day-to-day environment is usually assessed through affordability and simplicity rather than metropolitan convenience, so support planning matters more.",
    studentSupport:
      "This is best treated as a highly budget-led option that demands stronger due diligence on academics, outcomes, and student support.",
    whyChoose: [
      "Very cost-sensitive MBBS shortlist option.",
      "Accessible for families starting from an affordability-first filter.",
      "Hostel-backed planning can reduce early housing stress.",
    ],
    thingsToConsider: [
      "Low cost should not replace quality checks.",
      "Students must verify clinical exposure and recognition very carefully.",
      "A smaller-city setting may feel limited for some families.",
    ],
    bestFitFor: [
      "Applicants with a strict affordability ceiling.",
      "Families comparing the lowest fee bands in Kyrgyzstan.",
      "Students prepared to do strong academic and licensing due diligence.",
    ],
    teachingHospitals: [
      "Affiliated partner hospitals",
      "Clinical training sites",
      "Basic skills and lab training spaces",
    ],
    recognitionBadges: ["WHO", "Affordable", "Hostel"],
    recognitionLinks: buildRecognitionLinks("https://asianmedicalinstitute.com/"),
    faq: buildFaq(
      "Asian Medical Institute",
      "Kyrgyzstan",
      "English-medium with local-language support in applied settings"
    ),
    references: buildReferences(
      "https://asianmedicalinstitute.com/",
      "https://asianmedicalinstitute.com/"
    ),
    similarUniversitySlugs: [
      "international-school-of-medicine",
      "east-european-university",
    ],
  },
  {
    slug: "buon-ma-thuot-medical-university",
    countrySlug: "vietnam",
    name: "Buon Ma Thuot Medical University",
    city: "Buon Ma Thuot",
    type: "Private",
    establishedYear: 2014,
    summary:
      "The first and largest private medical university in Vietnam's Central Highlands, established in 2014 and beginning international student intake in 2024, with a 500-bed on-campus hospital and 12 affiliated regional hospitals.",
    featured: false,
    officialWebsite: "https://www.bmtu.edu.vn",
    campusLifestyle:
      "A newly internationalised campus in Vietnam's highland region with modern facilities and an on-campus hospital; international student intake began in 2024.",
    cityProfile:
      "Buon Ma Thuot is the capital of Dak Lak Province in Vietnam's Central Highlands — a quieter, lower-cost city with cooler temperatures than coastal Vietnam.",
    clinicalExposure:
      "On-campus 500-bed multi-specialty hospital with 33,000+ monthly outpatients provides early practical exposure; 12 affiliated hospitals extend regional clinical reach.",
    hostelOverview:
      "Separate boys' and girls' hostels with Indian food (4-meal daily service) provided; well-prepared for Indian student intake from the 2024 international cohort.",
    indianFoodSupport:
      "Indian food is provided through the hostel mess specifically for international students; off-campus Indian options are limited in this highland city — hostel food is the primary arrangement.",
    safetyOverview:
      "Buon Ma Thuot is a generally safe and quiet highland city; international students should be prepared for a more rural setting than Vietnam's coastal cities.",
    studentSupport:
      "University began structured Indian student intake in 2024; support infrastructure is developing; prospective students should directly verify current capacity and recognition status.",
    whyChoose: [
      "On-campus 500-bed hospital with 33,000+ monthly outpatients provides strong early clinical access.",
      "First and largest private medical university in the Central Highlands — less crowded intake cohorts than established urban institutions.",
      "Indian food hostel arrangement included from day one.",
    ],
    thingsToConsider: [
      "WDOMS listing is claimed but not independently confirmed through the official portal — verify at search.wdoms.org before enrolling.",
      "International student intake only began in 2024 — very limited track record for India-return outcomes.",
      "Buon Ma Thuot is a remote highland city; metro conveniences and Indian community are significantly more limited than in coastal Vietnam.",
    ],
    bestFitFor: [
      "Students comfortable with a newer institution in exchange for a well-resourced on-campus hospital.",
      "Applicants who have verified WDOMS and NMC status independently and want Central Highlands pricing.",
      "Families who can tolerate limited city amenities in exchange for a quieter study focus.",
    ],
    teachingHospitals: [
      "BMTU on-campus multi-specialty hospital (500+ beds)",
      "12 affiliated government and private hospitals in the Central Highlands region",
    ],
    recognitionBadges: ["NMC (claimed)", "WHO (claimed)", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://www.bmtu.edu.vn"),
    faq: buildFaq("Buon Ma Thuot Medical University", "Vietnam", "English"),
    references: buildReferences(
      "https://www.bmtu.edu.vn",
      "https://www.bmtu.edu.vn"
    ),
    similarUniversitySlugs: [
      "tay-nguyen-university-medicine-pharmacy",
      "can-tho-university-medicine-pharmacy",
    ],
  },
  {
    slug: "can-tho-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Can Tho University of Medicine and Pharmacy Faculty of Medicine",
    city: "Can Tho",
    type: "Public",
    establishedYear: 1979,
    summary:
      "Vietnam's most recommended public medical university for Indian students — Can Tho University of Medicine and Pharmacy holds confirmed NMC, WDOMS, ECFMG, FAIMER, and WHO recognition, with 600+ Indian students currently enrolled. Established in 1979, the 83-acre campus hosts an on-campus 500-bed teaching hospital and affiliations with 32+ regional hospitals. Fees run approximately $4,300–$5,000/year (rising annually); two intakes per year (September and February) give scheduling flexibility unavailable at most Vietnam universities. FMGE pass rate data from tracking sources consistently places Can Tho graduates among Vietnam's stronger performers. One of the few Vietnam universities where all four major international recognition bodies — NMC, WDOMS, ECFMG, and FAIMER — are independently confirmed.",
    featured: true,
    officialWebsite: "https://ctump.edu.vn",
    campusLifestyle:
      "The 83-acre main campus in Can Tho city includes a 500-bed teaching hospital, dedicated international student dormitories with Indian mess, library, laboratories, and simulation facilities. With 600+ Indian students enrolled, campus life is well-adapted to Indian cultural needs — Diwali, Holi, and Indian cultural events are regularly organised by the Indian Students Association. The Mekong Delta setting means a calmer, less congested environment than Hanoi or Ho Chi Minh City.",
    cityProfile:
      "Can Tho is Vietnam's fourth-largest city and the administrative capital of the Mekong Delta — a regional hub of 1.2 million people with modern infrastructure, affordable living costs (₹15,000–₹20,000/month all-in), and direct domestic flights to Ho Chi Minh City (45 minutes) and Hanoi. The city sits on the Hau River and is known for its famous floating markets, calm pace, and welcoming attitude toward international students. Ho Chi Minh City is 170 km away — a comfortable 3-hour drive for weekend visits, medical emergencies, or India-return flights.",
    clinicalExposure:
      "Clinical training begins from Year 2 at Can Tho General Hospital — a major regional hospital serving the entire Mekong Delta. Students rotate across 32+ affiliated hospitals covering internal medicine, surgery, obstetrics and gynaecology, paediatrics, emergency medicine, and community health. The university's on-campus 500-bed hospital provides early supervised exposure before major hospital rotations. ECFMG certification from graduation year enables USMLE eligibility for graduates who pursue that pathway.",
    hostelOverview:
      "Separate AC hostels for male and female students on or adjacent to the campus perimeter. Hostel fees cover a 4-meal-per-day Indian mess (breakfast, lunch, dinner, evening snack), utilities, Wi-Fi, CCTV security, and laundry facilities. Sharing options: 2-sharing (~₹20,000/month), 4-sharing (~₹15,000/month). First-year international students are guaranteed hostel placement — no off-campus accommodation hunting on arrival.",
    indianFoodSupport:
      "Can Tho has one of the most established Indian student ecosystems in Vietnam. The university-run Indian mess serves vegetarian, non-vegetarian, and Halal options daily. Indian grocery stores stocking atta, dal, rice, spices, and packaged goods operate within 2–3 km of campus. A 600+ student Indian cohort means cultural events, peer support, and social life are well-organised from day one.",
    safetyOverview:
      "Can Tho consistently registers as one of Vietnam's safest cities for international students — low crime, friendly local population, and a manageable city scale. The university maintains CCTV on campus and in hostels. Students should maintain standard document discipline (passport, visa, university ID) and keep NMC's study-abroad documentation checklist current throughout the program.",
    studentSupport:
      "CTUMP's International Affairs Office provides dedicated English-speaking support for visa renewals, academic queries, and arrival orientation. VMED-approved admission partnerships mean structured pre-departure guidance is available from India. The 600+ Indian student community provides peer-to-peer FMGE and NExT coaching networks; external structured coaching from Year 3 onward is strongly recommended. Student-teacher ratio of approximately 5:1 in clinical years.",
    whyChoose: [
      "All four major international recognitions confirmed — NMC, WDOMS (independently verifiable at search.wdoms.org), ECFMG, and FAIMER — the strongest recognition stack among Vietnam public universities.",
      "Two intakes per year (September and February): one of very few Vietnam universities offering mid-year admission for students who missed the September round.",
      "600+ Indian students currently enrolled — India's largest established Vietnam university community with organised Indian food, cultural events, and FMGE peer networks.",
    ],
    thingsToConsider: [
      "Fees increase annually — confirm current year pricing directly with CTUMP's international admissions office before signing any agreement; do not rely on fee data from third-party agents.",
      "Clinical years (Year 3 onward) require functional Vietnamese language for ward patient interaction — structured Vietnamese language classes run alongside the MBBS curriculum from Year 1.",
      "Can Tho is a Mekong Delta city, not a metro — students who want Ho Chi Minh City's urban scale or shopping options should factor in the 3-hour travel time for city visits.",
    ],
    bestFitFor: [
      "Students who want the strongest possible recognition credentials (NMC + WDOMS + ECFMG + FAIMER) at a government public university in Vietnam.",
      "Families who want two intake options (September or February) and a campus where Indian food, cultural support, and a 600+ peer community are already in place.",
      "Cost-conscious applicants comparing Vietnam public universities — CTUMP delivers superior recognition per rupee relative to higher-priced private alternatives.",
    ],
    teachingHospitals: [
      "Can Tho General Hospital (primary clinical training hospital, Mekong Delta's largest)",
      "Can Tho University Hospital (on-campus 500-bed facility)",
      "Can Tho Children's Hospital",
      "Can Tho Obstetrics and Gynaecology Hospital",
      "Can Tho Oncology Hospital",
      "32+ affiliated hospitals across Mekong Delta provinces",
    ],
    recognitionBadges: ["NMC", "WDOMS", "ECFMG", "FAIMER", "WHO", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://ctump.edu.vn"),
    faq: buildFaq(
      "Can Tho University of Medicine and Pharmacy Faculty of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences("https://ctump.edu.vn", "https://ctump.edu.vn"),
    similarUniversitySlugs: [
      "hue-university-medicine-pharmacy",
      "thai-nguyen-university-medicine-pharmacy",
    ],
  },
  {
    slug: "da-nang-university-medical-technology-pharmacy",
    countrySlug: "vietnam",
    name: "Da Nang University of Medical Technology and Pharmacy",
    city: "Da Nang",
    type: "Public",
    establishedYear: 2013,
    summary:
      "A Ministry of Health public institution in Da Nang established in 2013 and specialising in medical technology and pharmacy; English-medium MBBS programs for international students are NOT confirmed and the university primarily serves domestic Vietnamese students.",
    featured: false,
    officialWebsite: "https://dhktyduocdn.edu.vn",
    campusLifestyle:
      "A Ministry of Health public institution with a focus on medical technology, pharmacy, and nursing for domestic Vietnamese students; limited international student facilities.",
    cityProfile:
      "Da Nang is Vietnam's most liveable city but this institution operates primarily for domestic students; the city's lifestyle advantages are accessible for students who do enroll.",
    clinicalExposure:
      "Da Nang Hospital affiliation for practical training in medical technology and related fields; MBBS-equivalent clinical exposure for international students is not confirmed.",
    hostelOverview:
      "Student accommodation may be available; specific international student hostel provisions are unconfirmed.",
    indianFoodSupport:
      "Da Nang city has Indian food options; however, the university's domestic focus means no established Indian student support infrastructure is in place.",
    safetyOverview:
      "Da Nang is Vietnam's safest city; the university environment is safe though facilities for international MBBS students are limited.",
    studentSupport:
      "Primarily a domestic-facing institution; international student support for MBBS programs is not established and requires direct institutional confirmation.",
    whyChoose: [
      "Da Nang city location with excellent liveability, safety, and coastal environment.",
      "Ministry of Health affiliation confirms governmental standards in medical technology and pharmacy training.",
      "Lower costs than private Da Nang institutions.",
    ],
    thingsToConsider: [
      "International MBBS program availability is NOT confirmed — this university specialises in medical technology and pharmacy, NOT the Doctor of Medicine degree.",
      "NMC recognition and WDOMS listing are NOT independently verified.",
      "Students seeking an MBBS/MD program should prioritise Duy Tan University or Phan Chau Trinh University in Da Nang instead.",
    ],
    bestFitFor: [
      "Students pursuing medical technology or pharmacy programs in Da Nang — NOT international MBBS.",
      "Applicants who have directly confirmed program availability and recognition with the university.",
      "Families who have thoroughly vetted the institution's international student capacity before commitment.",
    ],
    teachingHospitals: [
      "Da Nang Hospital (affiliated)",
      "Central-highland region hospitals",
    ],
    recognitionBadges: ["Ministry of Health Vietnam", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://dhktyduocdn.edu.vn"),
    faq: buildFaq(
      "Da Nang University of Medical Technology and Pharmacy",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences(
      "https://dhktyduocdn.edu.vn",
      "https://dhktyduocdn.edu.vn"
    ),
    similarUniversitySlugs: [
      "duy-tan-university-faculty-of-medicine",
      "phan-chau-trinh-university",
    ],
  },
  {
    slug: "dai-nam-university-faculty-of-medicine",
    countrySlug: "vietnam",
    name: "Dai Nam University Faculty of Medicine",
    city: "Hanoi",
    type: "Private",
    establishedYear: 2007,
    logoUrl: "/images/universities/dai-nam-university-logo.png",
    coverImageUrl: "/images/universities/dai-nam-university-campus.jpg",
    summary:
      "Dai Nam University Faculty of Medicine is the most affordable NMC-confirmed and WDOMS-listed private MBBS option in Hanoi — with a unique 3-semester academic year structure that makes the fee-per-year figure among the lowest of any recognised Hanoi university. Annual tuition: Year 1 approximately $2,700 (3 × $900 semesters); Years 2–6 approximately $3,450 (3 × $1,150 semesters); total 6-year tuition approximately $20,050. Total cost including hostel and living over 6 years: approximately ₹31–36 lakhs — Vietnam's most affordable confirmed-NMC option in a capital city. The university features 2 university-operated teaching hospitals, 16+ Hanoi hospital affiliations, a 2560-slice CT scanner, and an integrated NExT/FMGE coaching curriculum with Indian faculty from Year 3. Strategic academic partnership with Hanoi Medical University (Vietnam's #1 ranked medical institution) underpins clinical training quality.",
    featured: false,
    officialWebsite: "https://dainam.edu.vn/en",
    campusLifestyle:
      "Dai Nam University occupies a modern private campus in Hanoi's Ha Dong district — well-connected to the city centre by metro and road. The campus includes advanced medical teaching facilities such as a 2560-slice CT scanner, digital anatomy systems, high-fidelity simulation labs, and a dedicated international student building. A strategic academic partnership with Hanoi Medical University (Vietnam's oldest and top-ranked medical institution) means Dai Nam students access some of HMU's clinical training infrastructure, which significantly elevates the academic quality beyond what Dai Nam's private status might suggest.",
    cityProfile:
      "Hanoi is Vietnam's capital — 8 million people, Noi Bai International Airport with direct India flights (Delhi: ~5 hours), and a large Indian business and student community in the Ba Dinh, Hoan Kiem, and Cau Giay districts. The Ha Dong district where Dai Nam is located is one of Hanoi's fastest-developing areas with new metro lines, modern shopping, and good residential infrastructure. Living costs in Hanoi run ₹18,000–₹28,000/month — higher than provincial cities but with significantly more infrastructure and amenities.",
    clinicalExposure:
      "Dai Nam operates 2 university-owned teaching hospitals in Hanoi, with 16+ affiliated hospitals across the capital and northern Vietnam providing clinical rotations from Year 3. The strategic HMU partnership means some clinical training occurs within HMU's national hospital affiliations (including Bach Mai and Viet Duc). Advanced diagnostic equipment on campus — including a 2560-slice CT scanner — provides hands-on imaging exposure uncommon at other private Vietnam universities. Clinical breadth across Hanoi's healthcare ecosystem covers internal medicine, surgery, obstetrics, paediatrics, emergency, and specialist rotations.",
    hostelOverview:
      "2-sharing, 4-sharing, 6-sharing, and 8-sharing hostel room options with Indian food included as standard. Room-type pricing ranges from ₹1,26,000/year (8-sharing) to ₹2,06,000/year (2-sharing). All options include utilities, Wi-Fi, CCTV, and laundry. Separate male/female hostel wings. Indian mess serves 3–4 daily meals (vegetarian and non-vegetarian). The hostel package is the most flexible room-pricing structure among Vietnam universities — families can match room type to budget.",
    indianFoodSupport:
      "Dai Nam's hostel includes Indian food as standard across all room types — vegetarian, non-vegetarian, and specific regional Indian cuisine options are managed through a dedicated Indian mess operator. Hanoi's large Indian business community has established Indian grocery stores and restaurants accessible within 15–20 minutes of campus, particularly in the Cau Giay and Hoan Kiem districts.",
    safetyOverview:
      "Hanoi is a safe capital city for international students with well-established consular infrastructure (Indian Embassy Hanoi is 20 minutes from the Ha Dong campus). The Ha Dong district is a rapidly modernising area with good street lighting, CCTV coverage, and an increasing international student population. Standard documentation discipline applies — keep passport, university ID, and Indian Embassy emergency contacts accessible at all times.",
    studentSupport:
      "Dai Nam is one of the most India-focused private universities in Hanoi — the admissions, onboarding, and support processes are specifically designed for Indian student needs. Critically, Dai Nam has integrated an Indian faculty-led NExT/FMGE coaching program from Year 3 into its curriculum — unlike universities where exam preparation is entirely self-organised. This built-in licensing exam preparation support is a significant differentiator for students planning to return to India for medical practice.",
    whyChoose: [
      "Vietnam's most affordable confirmed-NMC private MBBS in a capital city: Year 1 at $2,700 (3 semesters × $900) and Years 2–6 at $3,450/year, total 6-year cost ₹31–36 lakhs all-in.",
      "Integrated Indian faculty NExT/FMGE coaching from Year 3 built into the curriculum — one of the only Vietnam universities with structured India-return licensing exam support as part of the degree program.",
      "Strategic HMU partnership and 2 university-owned Hanoi hospitals with 16+ affiliations — clinical infrastructure that punches above the typical private university offering.",
    ],
    thingsToConsider: [
      "Dai Nam's Faculty of Medicine is newer than Vietnam's public universities — India-return FMGE data is limited given fewer years of graduates; the NExT-coaching integration partially addresses this but confirm directly with recent graduates.",
      "Hanoi living costs (₹18,000–₹28,000/month) are Vietnam's highest after HCMC — the tuition affordability advantage is partially offset by higher city costs vs provincial options like Thai Binh or Thai Nguyen.",
      "Vietnamese is required for ward patient interaction from Year 3 — the 3-semester-per-year schedule is intensive; time management for Vietnamese language study alongside MBBS coursework requires planning.",
    ],
    bestFitFor: [
      "Students who want confirmed NMC/WDOMS recognition in Hanoi at the lowest private university price point — Dai Nam delivers capital city access, Indian faculty FMGE coaching, and metro conveniences at provincial price levels.",
      "Applicants who want built-in NExT/FMGE preparation from Year 3 as part of their degree, not as a separately arranged external course.",
      "Families comparing northern Vietnam private options: Dai Nam outperforms Phenikaa on recognition and cost; the HMU partnership gives clinical depth above typical private university standards.",
    ],
    teachingHospitals: [
      "Dai Nam University Hospital No. 1 (Hanoi, primary teaching hospital)",
      "Dai Nam University Hospital No. 2 (Hanoi)",
      "Hanoi Medical University-affiliated hospitals (through strategic partnership)",
      "16+ affiliated hospitals across Hanoi and northern Vietnam",
    ],
    recognitionBadges: ["NMC", "WDOMS", "WHO", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://dainam.edu.vn/en"),
    faq: buildFaq(
      "Dai Nam University Faculty of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences("https://dainam.edu.vn/en", "https://dainam.edu.vn/en"),
    similarUniversitySlugs: [
      "hanoi-medical-university",
      "thai-nguyen-university-medicine-pharmacy",
    ],
  },
  {
    slug: "dong-a-university-college-of-medicine",
    countrySlug: "vietnam",
    name: "Dong A University College of Medicine",
    city: "Da Nang",
    type: "Private",
    establishedYear: 2002,
    summary:
      "A private Da Nang university with a Faculty of Medicine offering an English-medium NMC-aligned program backed by a major affiliated hospital complex and Da Nang's strong international student lifestyle appeal.",
    featured: false,
    officialWebsite: "https://donga.edu.vn",
    campusLifestyle:
      "A private campus in Da Nang with coastal city lifestyle benefits — beaches, safety, and modern urban infrastructure alongside medical study.",
    cityProfile:
      "Da Nang is consistently rated Vietnam's most liveable city — coastal metro with beaches, excellent transport links, and a growing expat and student community.",
    clinicalExposure:
      "Access to an affiliated hospital complex with 31 departments, 100+ clinical units, and 5,000+ beds provides unusually broad clinical exposure for a smaller private institution.",
    hostelOverview:
      "Accommodation assistance provided; on-campus and off-campus options available; Indian food arrangements should be confirmed directly with the admissions office.",
    indianFoodSupport:
      "Da Nang's growing international community makes off-campus Indian food increasingly accessible; on-campus Indian food arrangements should be confirmed with the university.",
    safetyOverview:
      "Da Nang is Vietnam's safest major city; the beach city environment and well-patrolled areas make it consistently student-friendly.",
    studentSupport:
      "English-medium program with dedicated international student support; Da Nang's international community provides good off-campus peer networks.",
    whyChoose: [
      "Access to a 5,000+ bed affiliated hospital complex — stronger clinical infrastructure than many comparable private institutions.",
      "Da Nang's safety, beaches, and liveability make it one of the best cities for study in Vietnam.",
      "Mid-range fees (~$4,500/year) with Da Nang lifestyle advantages.",
    ],
    thingsToConsider: [
      "WDOMS and NMC recognition are claimed but should be independently verified at search.wdoms.org before enrollment.",
      "Faculty of Medicine is smaller and less established than Duy Tan University in the same city.",
      "Indian food on-campus should be confirmed; off-campus options exist but require city navigation.",
    ],
    bestFitFor: [
      "Students who want Da Nang's coastal lifestyle at a lower price than Duy Tan.",
      "Applicants drawn to strong hospital clinical access in a private Da Nang setting.",
      "Families who value city liveability and have independently verified the recognition credentials.",
    ],
    teachingHospitals: [
      "Affiliated major hospital complex (31 departments, 100+ clinical units, 5,000+ beds)",
      "Vinmec Da Nang",
      "Partner hospitals across Da Nang region",
    ],
    recognitionBadges: ["NMC (claimed)", "WDOMS (claimed)", "WHO (claimed)", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://donga.edu.vn"),
    faq: buildFaq(
      "Dong A University College of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences("https://donga.edu.vn", "https://donga.edu.vn"),
    similarUniversitySlugs: [
      "duy-tan-university-faculty-of-medicine",
      "phan-chau-trinh-university",
    ],
  },
  {
    slug: "duy-tan-university-faculty-of-medicine",
    countrySlug: "vietnam",
    name: "Duy Tan University Faculty of Medicine",
    city: "Da Nang",
    type: "Private",
    establishedYear: 2013,
    summary:
      "Duy Tan University is the first and largest private university in Central Vietnam — its Faculty of Medicine opened in 2013 and carries NMC, WDOMS, ECFMG, and FAIMER recognition alongside QS World University Rankings positioning (Top 601–800 globally), making it the only Vietnam medical university to appear in QS rankings. The on-campus Duy Tan University Hospital provides clinical access from early years. Da Nang — Vietnam's #1 ranked liveable city — is the campus location: beaches, safety, modern infrastructure, and domestic flights to India. Fees run approximately $8,000/year — among the highest in Vietnam but offset by the strength of recognitions, rankings, and campus infrastructure. For students where total academic branding matters alongside clinical credentials, Duy Tan is the premium private option in Vietnam.",
    featured: true,
    officialWebsite: "https://duytan.edu.vn/the-faculty-of-medicine/",
    campusLifestyle:
      "Duy Tan University's main campus spans Da Nang city with multiple modern facilities — medical laboratories, clinical simulation centres, international standard lecture theatres, and the on-campus Duy Tan University Hospital. The university has a strong technology and research pedigree (QS-ranked across multiple departments) that feeds into the medical faculty's infrastructure. Campus life in Da Nang means beach access (My Khe Beach is 20 minutes from campus), a growing international student community, and a well-developed city with restaurants, shopping, and modern transport.",
    cityProfile:
      "Da Nang is Vietnam's most liveable city — a coastal metropolis of 1.3 million on the South China Sea with white sand beaches, Vietnam's lowest crime rate, and direct international connections. Da Nang International Airport has direct flights to key Indian cities (Chennai: ~3.5 hours direct; Mumbai and Delhi via Hanoi/HCMC: ~5 hours). Living costs run approximately ₹14,000–₹22,000/month. The city is positioned between Hue (90 min north) and Hoi An (30 min south) — one of Vietnam's most popular tourism corridors that doubles as an excellent student lifestyle environment.",
    clinicalExposure:
      "Duy Tan University Hospital (on-campus) provides supervised clinical access from Year 2, earlier than most public universities where clinical training doesn't begin until Year 3. Students progress to rotations at affiliated Da Nang regional hospitals covering all major specialties. ECFMG certification and FAIMER listing confirm that the program meets international quality standards for medical education. QS rankings positioning reflects the university's academic research standards that feed into the clinical curriculum.",
    hostelOverview:
      "On-campus hostel blocks with separate male/female accommodation, AC rooms, Wi-Fi, CCTV, and dedicated Indian food mess. Sharing options: 2-sharing, 4-sharing. Annual hostel cost: approximately ₹1,90,000–₹2,40,000. Da Nang's extensive private accommodation market also provides good off-campus options for upper-year students; studio apartments near campus are available from ₹12,000–₹20,000/month.",
    indianFoodSupport:
      "Duy Tan's campus provides an Indian mess with vegetarian and non-vegetarian options. Da Nang has a growing Indian community (both business and student) with established Indian restaurants near the university precinct. Indian groceries are available at several stores within 5 km of campus. Da Nang's status as a major international tourism and business city means Indian food supply continues to expand year on year.",
    safetyOverview:
      "Da Nang records Vietnam's lowest major crime rate among large cities — multiple annual safety surveys consistently rank it #1 in the country. Duy Tan's campus has CCTV coverage, security personnel at entry points, and a well-lit campus layout. The city's walk-friendly design means students rarely need late-night transport. Female international students specifically cite Da Nang's safety as a major reason for choosing it over Hanoi or HCMC.",
    studentSupport:
      "Duy Tan's dedicated international student office manages English-medium admissions, visa renewals, arrival orientation, and ongoing student welfare. Regular FMGE/NExT-focused coaching is available in partnership with external preparation centres in Da Nang. The growing Indian student cohort means peer-based study groups and FMGE networks are well-established across all six years. QS rankings support letters from the university assist graduates with licensing applications in India and abroad.",
    whyChoose: [
      "The only Vietnam medical university appearing in QS World University Rankings (Top 601–800 globally) — NMC + WDOMS + ECFMG + FAIMER recognition combined with international ranking visibility is unique to Duy Tan in Vietnam.",
      "On-campus Duy Tan University Hospital provides clinical exposure from Year 2 — earlier clinical immersion than most public Vietnam universities that begin rotations in Year 3.",
      "Da Nang's combination of coastal lifestyle, Vietnam's lowest crime rate, and direct India flights makes it the best city-lifestyle option for MBBS study in Vietnam.",
    ],
    thingsToConsider: [
      "At $8,000/year, Duy Tan is among the most expensive Vietnam options — total 6-year cost including hostel and living is approximately ₹55–60 lakhs; ensure family budget planning accounts for annual fee increases.",
      "Faculty of Medicine opened in 2013: while recognition is strong, the India-return alumni track record across 10+ years is shorter than public universities like Hue (1957), Can Tho (1979), or Hanoi Medical (1902).",
      "Vietnamese language training is mandatory from Year 1 and required for meaningful ward patient interaction from Year 3 — plan dedicated study time for Vietnamese alongside the MBBS curriculum.",
    ],
    bestFitFor: [
      "Students where QS rankings visibility, combined international recognitions, and Da Nang coastal city lifestyle are all important decision factors — Duy Tan is the only Vietnam university that delivers all three.",
      "Families with a budget above ₹55 lakhs total for 6 years who want the strongest private university credentials in Vietnam for global licensing flexibility.",
      "Applicants considering a USMLE pathway alongside FMGE/NExT — Duy Tan's ECFMG certification opens both routes from the same degree.",
    ],
    teachingHospitals: [
      "Duy Tan University Hospital (on-campus, multi-specialty teaching facility)",
      "Da Nang General Hospital (major regional clinical rotation)",
      "C Hospital Da Nang (multi-specialty)",
      "Da Nang Obstetrics and Gynaecology Hospital",
      "Da Nang Oncology Hospital",
      "Affiliated regional hospitals across Central Vietnam",
    ],
    recognitionBadges: ["NMC", "WDOMS", "ECFMG", "FAIMER", "WHO", "QS World Rankings Top 601–800"],
    recognitionLinks: buildRecognitionLinks("https://duytan.edu.vn/the-faculty-of-medicine/"),
    faq: buildFaq(
      "Duy Tan University Faculty of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences("https://duytan.edu.vn/the-faculty-of-medicine/", "https://duytan.edu.vn/the-faculty-of-medicine/"),
    similarUniversitySlugs: [
      "phan-chau-trinh-university",
      "hong-bang-international-university-medicine",
    ],
  },
  {
    slug: "hai-phong-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Hai Phong University of Medicine and Pharmacy",
    city: "Hai Phong",
    type: "Public",
    establishedYear: 1979,
    summary:
      "A 1979 public medical university in Vietnam's third-largest city with hospital affiliations covering 5,000 beds across three northern provinces; NMC recognition is widely claimed but should be independently verified.",
    featured: false,
    officialWebsite: "https://www.hpmu.edu.vn",
    campusLifestyle:
      "A public university environment in Vietnam's major northern port city with a practical, cost-effective student life and accessible Hanoi day-trips.",
    cityProfile:
      "Hai Phong is Vietnam's third-largest city — a major port and industrial centre with lower costs than Hanoi, direct domestic flights, and a rapidly developing urban infrastructure.",
    clinicalExposure:
      "Hai Phong General Hospital's 5,000-bed capacity across three provinces provides solid regional clinical breadth in general medicine, surgery, and allied specialties.",
    hostelOverview:
      "On-campus accommodation confirmed available; specific Indian food arrangements should be verified directly with the university.",
    indianFoodSupport:
      "Hai Phong has a smaller Indian community than Hanoi or Ho Chi Minh City; students should plan for self-arranged food and cultural adaptation in the first year.",
    safetyOverview:
      "Hai Phong is a well-established port city with a generally safe environment for students; the city's northern location means cooler winter temperatures.",
    studentSupport:
      "Public university student support services; English-medium program for international students; WDOMS and NMC status should be confirmed directly before applying.",
    whyChoose: [
      "5,000-bed hospital network across three provinces — strong regional clinical exposure at an affordable northern Vietnam public university.",
      "Hai Phong's port city location with lower costs than Hanoi and good transport connectivity.",
      "Established 1979 institution with a clear medical education history.",
    ],
    thingsToConsider: [
      "WDOMS and NMC recognition should be independently verified — not yet confirmed through the official WDOMS portal.",
      "Smaller Indian student community than in Can Tho or Ho Chi Minh City.",
      "Vietnamese language is needed for clinical patient communication in later years.",
    ],
    bestFitFor: [
      "Students comfortable with public university settings in a northern Vietnam port city.",
      "Applicants who have verified recognition status independently and prefer a more affordable option.",
      "Families who want the clinical breadth of a large hospital network without metro Hanoi costs.",
    ],
    teachingHospitals: [
      "Hai Phong General Hospital (~5,000 beds across Haiphong, Quang Ninh, and Hai Duong provinces)",
    ],
    recognitionBadges: ["WHO", "Ministry of Health Vietnam", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://www.hpmu.edu.vn"),
    faq: buildFaq(
      "Hai Phong University of Medicine and Pharmacy",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://www.hpmu.edu.vn", "https://www.hpmu.edu.vn"),
    similarUniversitySlugs: [
      "hanoi-medical-university",
      "thai-binh-university-medicine-pharmacy",
    ],
  },
  {
    slug: "hanoi-medical-university",
    countrySlug: "vietnam",
    name: "Hanoi Medical University",
    city: "Hanoi",
    type: "Public",
    coverImageUrl: "/images/universities/hanoi-medical-university.webp",
    logoUrl: "/images/universities/hanoi-medical-university-logo.png",
    establishedYear: 1902,
    summary:
      "Vietnam's oldest and most prestigious medical university, founded in 1902 under French colonial administration and now consistently ranked as Vietnam's #1 medical institution. Hanoi Medical University (HMU) is NMC and WDOMS recognised with a direct affiliation to Bach Mai Hospital — Vietnam's largest teaching hospital with 3,000+ beds and all major specialties on one campus. FMGE tracking data places HMU graduates at a 76.2% average pass rate — the highest among all Vietnam universities. Fees for the English-medium international program run approximately $4,400–$4,600/year. Important caveat: international English-medium MBBS seats are limited and competitive; prospective students must confirm availability directly with HMU's international office before applying.",
    featured: true,
    officialWebsite: "https://hmu.edu.vn",
    campusLifestyle:
      "HMU's central Hanoi campus sits adjacent to Bach Mai Hospital and Viet Duc Hospital — two of Vietnam's top medical centres — creating a clinical learning environment unmatched by any other Vietnam university. The campus includes modern lecture theatres, simulation laboratories, a university library with international medical journals, and dedicated international student dormitories. Hanoi's capital city infrastructure means strong internet connectivity, metro development, and a rapidly growing international academic community.",
    cityProfile:
      "Hanoi is Vietnam's capital city and political-cultural centre — a metropolis of 8 million with Noi Bai International Airport offering direct flights to India (Delhi: ~5 hours, Mumbai: ~5.5 hours, Chennai: ~4 hours). The city has a large Indian business and student community, with Indian restaurants, grocery stores, and cultural organisations accessible in the Ba Dinh, Hoan Kiem, and Cau Giay districts. Living costs for students run approximately ₹18,000–₹28,000/month (hostel + food + transport), higher than provincial Vietnam cities but justified by the city's infrastructure and clinical access.",
    clinicalExposure:
      "HMU's clinical training network is Vietnam's most prestigious and comprehensive. From Year 3, students rotate through eight national-level hospitals: Bach Mai (3,000+ beds, all specialties), Viet Duc (specialist surgery), National Hospital of Pediatrics, National Hospital of Obstetrics and Gynecology, National Cancer Hospital, National Hospital for Tropical Diseases, E Hospital, and HMU's own practice hospital. This clinical breadth — national specialty hospitals rather than regional general hospitals — gives HMU graduates measurably stronger FMGE preparation than universities using only affiliated provincial hospitals.",
    hostelOverview:
      "HMU maintains dedicated international student dormitories near the main campus in central Hanoi. Rooms are available in 2-sharing and 4-sharing configurations with AC, Wi-Fi, and security. Many students in later years rent private apartments in central Hanoi (₹12,000–₹25,000/month for a shared flat near campus) to benefit from the city's extensive residential options. Indian food is accessible through the university mess and nearby off-campus Indian restaurants.",
    indianFoodSupport:
      "Hanoi's growing Indian community (business, diplomatic, and student populations) has established a reliable network of Indian restaurants and grocery suppliers across the city. The Ba Dinh and Cau Giay districts have Indian-owned grocery shops stocking dal, atta, spices, and packaged goods. Indian mess facilities at the HMU international dormitory provide regular Indian meals for enrolled students.",
    safetyOverview:
      "Hanoi is a well-policed capital city consistently rated safe for international students. The HMU campus area is in central Hanoi near major national hospitals — a heavily staffed and surveilled area. Students should maintain standard documentation discipline (passport, visa, university ID) and keep emergency contacts — both university and Indian Embassy Hanoi (+84 24 3823 4066) — readily accessible.",
    studentSupport:
      "HMU's International Cooperation Department provides English-speaking admissions, visa support, and academic coordination for international students. English-medium track seats are limited — the international cohort is significantly smaller than at private Vietnam universities — meaning faculty attention and clinical supervision ratios are more favourable. FMGE/NExT preparation: HMU's clinical exposure at national specialty hospitals is regarded as the strongest foundation for licensing exam preparation in Vietnam; structured external coaching from Year 3 is still recommended.",
    whyChoose: [
      "Vietnam's oldest university (est. 1902) with 120+ years of medical education — the highest institutional pedigree in the country, backed by confirmed NMC and WDOMS recognition.",
      "Adjacent to Bach Mai Hospital (Vietnam's largest, 3,000+ beds) and 7 other national specialty hospitals — the strongest clinical training network in Vietnam by any objective measure.",
      "FMGE tracking data shows HMU graduates averaging 76.2% pass rate — the highest of any Vietnam university, reflecting the depth of national hospital clinical training.",
    ],
    thingsToConsider: [
      "English-medium international MBBS seats are limited and competitive — confirm current availability and intake capacity directly with HMU's international office; do not rely on agent confirmations.",
      "Clinical years require significant Vietnamese language proficiency for patient interaction at national hospitals — HMU's Vietnamese language curriculum is intensive and non-negotiable.",
      "Hanoi living costs (₹18,000–₹28,000/month) are Vietnam's highest after Ho Chi Minh City — factor total monthly spend carefully against the $4,400–$4,600/year tuition.",
    ],
    bestFitFor: [
      "Students who prioritise institutional prestige, clinical depth, and the highest FMGE pass rate data in Vietnam above all other factors.",
      "Applicants with strong academic profiles (competitive NEET scores, 60%+ PCB) who are prepared for a rigorous admission process and Vietnamese language requirements.",
      "Families where long-term India-return licensing success is the primary goal and who understand that HMU's limited international seats require early, direct application.",
    ],
    teachingHospitals: [
      "Bach Mai Hospital (Vietnam's largest teaching hospital, 3,000+ beds, directly adjacent to campus)",
      "Viet Duc Hospital (specialist surgical hospital)",
      "National Hospital of Pediatrics",
      "National Hospital of Obstetrics and Gynecology",
      "National Cancer Hospital (K Hospital)",
      "National Hospital for Tropical Diseases",
      "E Hospital (multi-specialty)",
      "HMU Practice Hospital (on-campus clinical training facility)",
    ],
    recognitionBadges: ["NMC", "WDOMS", "WHO", "FAIMER", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://hmu.edu.vn"),
    faq: buildFaq("Hanoi Medical University", "Vietnam", "English + Local Support"),
    references: buildReferences("https://hmu.edu.vn", "https://hmu.edu.vn"),
    similarUniversitySlugs: [
      "hue-university-medicine-pharmacy",
      "can-tho-university-medicine-pharmacy",
    ],
  },
  {
    slug: "hong-bang-international-university-medicine",
    countrySlug: "vietnam",
    name: "Hong Bang International University Faculty of Medicine",
    city: "Ho Chi Minh City",
    type: "Private",
    establishedYear: 1997,
    summary:
      "Hong Bang International University (HIU) Faculty of Medicine is Vietnam's most clinically resourced private medical school — with a 1,000-bed on-campus HIU Hospital plus 10 major Ho Chi Minh City hospital affiliations including Cho Ray Hospital (Vietnam's largest general hospital, 1,800+ beds), Tu Du Hospital (Vietnam's leading obstetrics centre), and Vinmec International Hospital. NMC and WDOMS recognition confirmed. Established in 1997 — among the older private Vietnam institutions. At $9,000/year, HIU is Vietnam's premium-priced option, justified by HCMC's Indian community depth, clinical breadth, and metro infrastructure. Total 6-year cost approximately ₹62–68 lakhs including hostel and living. For families prioritising clinical hospital depth and Ho Chi Minh City's unmatched Indian community, HIU delivers the strongest private-sector clinical ecosystem in Vietnam.",
    featured: false,
    officialWebsite: "https://hiu.vn/en/home/",
    campusLifestyle:
      "HIU's campus in Ho Chi Minh City's District 11 includes the on-campus HIU Hospital (1,000 beds), modern lecture facilities, clinical simulation labs, digital anatomy systems, and a dedicated international student centre. The university has been operating since 1997 and its campus infrastructure reflects that maturity — well-established student services, functional hostels, and organised Indian student support. Ho Chi Minh City's energy and scale mean campus life is complemented by Vietnam's most cosmopolitan urban environment immediately outside the campus gates.",
    cityProfile:
      "Ho Chi Minh City is Vietnam's largest city — 9 million people, Tan Son Nhat International Airport with direct India flights (Mumbai: ~5 hours; Delhi: ~5.5 hours; Chennai: ~3.5 hours direct), and the largest and most established Indian community in Vietnam. The Indian business and residential presence in Districts 1, 3, and 10 has created a full-service Indian ecosystem: Indian restaurants, temple, groceries, cultural associations, and MBBS student networks. Living costs are Vietnam's highest at ₹22,000–₹35,000/month; this is the trade-off for metro-scale Indian community support and clinical access.",
    clinicalExposure:
      "HIU's clinical training network is among Vietnam's three strongest for any private institution. The on-campus HIU Hospital (1,000 beds, 20+ specialties) provides supervised clinical exposure from Year 2. Major HCMC hospital affiliations add exposure to Vietnam's highest-volume medical centres: Cho Ray Hospital (1,800+ beds, trauma and general surgery), Tu Du Hospital (Vietnam's leading obstetrics and gynaecology hospital, 1,500+ deliveries/month), Vinmec International Hospital (JCI-accredited international standard), Children's Hospital 1, Thong Nhat Hospital, An Binh Hospital, and 30-4 Hospital. Total affiliated bed capacity across all hospitals exceeds 4,000 beds — the highest bed count access of any Vietnam private medical university.",
    hostelOverview:
      "Separate male/female hostels near the HIU campus with AC, Wi-Fi, CCTV, and dedicated Indian mess. Room options: 2-sharing, 4-sharing. Annual hostel cost approximately ₹2,00,000–₹2,60,000 (including Indian food). Ho Chi Minh City's large residential market also provides extensive private accommodation options for upper-year students; shared apartments in the Districts 10–11 area run ₹8,000–₹18,000/month per person.",
    indianFoodSupport:
      "Ho Chi Minh City has Vietnam's largest and most established Indian community — Indian restaurants, vegetarian-specific outlets, Indian temple canteens, halal food, and Indian grocery stores are accessible throughout Districts 1, 3, 5, 10, and 11. HIU's campus Indian mess provides daily meals. The Indian community is active enough that Diwali, Holi, Eid, and other Indian cultural events are officially celebrated in Ho Chi Minh City with large attendance — the social and cultural integration for Indian students is unmatched in Vietnam.",
    safetyOverview:
      "Ho Chi Minh City is a busy, dense metropolis — standard urban safety awareness applies (traffic, document security, city navigation). The university's campus and surrounding Districts 10–11 are well-established residential and commercial areas with manageable safety profiles for international students. HIU's campus has 24/7 CCTV and security. Indian students should register with the Indian Consulate General in Ho Chi Minh City upon arrival (+84 28 3822 4404) and maintain standard document discipline.",
    studentSupport:
      "HIU's Faculty of Medicine has a dedicated international admissions team with full English-medium support. The university's 1997 founding means institutional processes for international students are well-established compared to newer private entrants. Ho Chi Minh City's Indian community provides an exceptionally strong off-campus peer and professional network — Indian student associations organise FMGE study groups, alumni mentoring, and cultural events throughout the academic year.",
    whyChoose: [
      "Vietnam's strongest private MBBS clinical network: 1,000-bed HIU on-campus hospital + Cho Ray (Vietnam's largest general hospital) + Tu Du (leading obstetrics) + Vinmec (JCI-accredited) + 7 more HCMC affiliations — 4,000+ total beds.",
      "Ho Chi Minh City's Indian community is Vietnam's largest and most established — Indian food, cultural events, grocery supply, and MBBS peer networks are better developed here than anywhere else in the country.",
      "NMC and WDOMS confirmed recognition from a 1997-established institution — HIU has more institutional history than most private Vietnam medical faculties.",
    ],
    thingsToConsider: [
      "At $9,000/year, HIU is Vietnam's highest-priced option — total 6-year cost including HCMC living (₹22,000–₹35,000/month) can reach ₹62–70 lakhs; budget carefully and factor annual fee increases.",
      "Ho Chi Minh City's cost of living is Vietnam's highest — the $9,000/year tuition premium is compounded by metro living costs; families should run a realistic total cost calculation before comparing against lower-cost provincial options.",
      "HCMC is a dense, fast-moving metropolis; students who prefer quieter study environments (like Can Tho or Hue) may find HCMC's energy disruptive to focused academic work.",
    ],
    bestFitFor: [
      "Students who specifically want Ho Chi Minh City's Indian community, metro infrastructure, and direct India flight access — HIU is the only confirmed NMC/WDOMS private university in HCMC with a 1,000-bed on-campus hospital.",
      "Families comfortable with Vietnam's premium pricing (₹62–70 lakhs over 6 years) in exchange for the strongest private clinical training network and HCMC's Indian ecosystem.",
      "Applicants where clinical hospital breadth is the primary decision factor — 4,000+ accessible beds across HCMC's top hospitals is not replicated by any other Vietnam private university.",
    ],
    teachingHospitals: [
      "HIU Hospital (on-campus, 1,000 beds, 20+ specialties)",
      "Cho Ray Hospital (Vietnam's largest general hospital, 1,800+ beds)",
      "Tu Du Hospital (Vietnam's leading obstetrics and gynaecology hospital)",
      "Vinmec International Hospital HCMC (JCI-accredited international standard)",
      "Children's Hospital 1 (Ho Chi Minh City)",
      "Thong Nhat Hospital",
      "An Binh Hospital",
      "30-4 Hospital",
      "Trung Vuong Hospital",
      "Nguyen Tri Phuong Hospital",
      "11 affiliated hospitals total — approximately 4,000+ beds across HCMC",
    ],
    recognitionBadges: ["NMC", "WDOMS", "WHO", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://hiu.vn/en/home/"),
    faq: buildFaq(
      "Hong Bang International University Faculty of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences("https://hiu.vn/en/home/", "https://hiu.vn/en/home/"),
    similarUniversitySlugs: [
      "duy-tan-university-faculty-of-medicine",
      "phan-chau-trinh-university",
    ],
  },
  {
    slug: "hue-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Hue University of Medicine and Pharmacy",
    city: "Hue",
    type: "Public",
    establishedYear: 1957,
    summary:
      "Hue University of Medicine and Pharmacy, founded in 1957, is one of Vietnam's three oldest and most academically respected public medical universities. It holds NMC, WDOMS, FAIMER, and ECFMG recognition — a full four-body stack comparable to Can Tho. FMGE tracking data places Hue graduates at a 75.9% pass rate (2023) — one of the highest in Vietnam. Fees run approximately $3,500–$4,200/year, making it among the most affordable fully-recognised options in Vietnam. Located in Hue — a UNESCO World Heritage city and Vietnam's ancient imperial capital — students benefit from one of Vietnam's safest, most affordable, and culturally rich living environments. Primary teaching hospital is Hue Central Hospital, one of Central Vietnam's largest medical centres.",
    featured: true,
    officialWebsite: "https://huemed-univ.edu.vn",
    campusLifestyle:
      "Hue University Hospital and the medical faculty campus are set within the scenic Hue city landscape — historic citadel, Perfume River, and a cultural environment unlike any other Vietnam student city. The campus facilities include modern lecture theatres, medical simulation labs, anatomy facilities, and an extensive university library. The student population is predominantly Vietnamese with a growing international cohort — the smaller international batch (relative to Can Tho) means more direct faculty contact and less crowded clinical rotation scheduling.",
    cityProfile:
      "Hue is Vietnam's former imperial capital and a UNESCO World Heritage city — a compact city of 350,000 people known for its royal citadel, pagodas, imperial tombs, and Perfume River. Living costs are among the lowest for any Vietnamese city: total monthly expenses for students run ₹12,000–₹18,000 (hostel + food + transport), significantly below Hanoi or HCMC. Da Nang International Airport is 90 minutes away by car, with direct flights to India available. Hue has a calm, academic atmosphere that suits focused medical study — quieter than Da Nang but less isolated than Thai Binh or Thai Nguyen.",
    clinicalExposure:
      "Clinical training at Hue Central Hospital — Central Vietnam's largest and most comprehensive government hospital — begins from Year 3. Hue Central Hospital serves a catchment of 4+ million people across Thua Thien-Hue, Quang Tri, and Quang Binh provinces, providing high patient volumes across internal medicine, surgery, obstetrics, paediatrics, dermatology, and emergency medicine. Additional rotations at Hue University Hospital and regional Central Vietnam affiliates. ECFMG certification confirms USMLE eligibility for graduates.",
    hostelOverview:
      "On-campus international student accommodation in dedicated dormitory blocks with AC, Wi-Fi, and separate male/female wings. Hostel fees are among the most affordable in Vietnam: approximately ₹1,20,000–₹1,80,000 per year (4-sharing with meals). Indian mess facilities serve vegetarian, non-vegetarian, and Jain options. The quieter pace of Hue means students can typically arrange private accommodation easily at ₹6,000–₹10,000/month if preferred.",
    indianFoodSupport:
      "Hue has a smaller but well-established Indian student community. The university mess provides Indian meals daily; Hue city has a small number of Indian restaurants and grocery points near the university. Students typically supplement with self-cooking in the second year once familiar with the local market; Hue's markets stock many Indian-compatible ingredients (rice, lentils, fresh vegetables, spices). The cultural adaptation is generally smoother than in northern cities due to Hue's historically cosmopolitan atmosphere.",
    safetyOverview:
      "Hue is widely regarded as one of Vietnam's two or three safest cities for international students. The city's small scale, historic character, and strong local pride in its cultural heritage create an exceptionally welcoming environment. Crime directed at international students is extremely rare. The Indian Consulate General in Da Nang provides consular support; Indian Embassy in Hanoi is the main point of contact for document emergencies.",
    studentSupport:
      "Hue University's international student office handles visa, registration, and academic support in English. The university has hosted international students from Laos, Cambodia, and South Asian countries for decades; established institutional processes are in place for international cohort management. FMGE/NExT preparation: the 75.9% (2023) FMGE pass rate reflects the strength of Hue Central Hospital clinical training; structured external coaching from Year 3 is recommended to supplement.",
    whyChoose: [
      "Full four-body recognition (NMC + WDOMS + FAIMER + ECFMG) from Vietnam's second-oldest medical university (est. 1957) — credentials equivalent to Can Tho at approximately $500–$1,000/year lower fees.",
      "75.9% FMGE pass rate (2023) — one of Vietnam's two highest tracked rates, reflecting the quality of Hue Central Hospital's broad clinical training across a 4-million-person catchment area.",
      "UNESCO heritage city lifestyle at Vietnam's most affordable cost of living — Hue delivers academic quality without the metro living costs of Hanoi or HCMC.",
    ],
    thingsToConsider: [
      "Smaller Indian student community than Can Tho or Ho Chi Minh City universities — students should factor in that social and cultural support networks will be self-built rather than inherited.",
      "Vietnamese language training is required from Year 1 and becomes essential for ward patient interaction from Year 3 — the smaller city means fewer English-language social outlets than Hanoi.",
      "Hue is a smaller city: metro shopping, Indian restaurants, and entertainment options are limited compared to Da Nang or HCMC — occasional day trips to Da Nang (90 minutes) are practical.",
    ],
    bestFitFor: [
      "Students who want full four-body recognition (NMC + WDOMS + FAIMER + ECFMG) at the most affordable total cost — Hue is the strongest value-for-recognition university in Vietnam.",
      "Applicants who are drawn to a UNESCO heritage city environment and prefer a focused, academic atmosphere over urban metro energy.",
      "Families who want ECFMG certification (USMLE pathway open) plus strong FMGE data at a public university — Hue delivers both at lower cost than Can Tho or Duy Tan.",
    ],
    teachingHospitals: [
      "Hue Central Hospital (Central Vietnam's largest hospital, 4+ million patient catchment area)",
      "Hue University Hospital (affiliated teaching hospital)",
      "Hue National Cancer Hospital",
      "Hue Obstetrics and Gynaecology Hospital",
      "Regional hospitals across Thua Thien-Hue, Quang Tri, and Quang Binh provinces",
    ],
    recognitionBadges: ["NMC", "WDOMS", "ECFMG", "FAIMER", "WHO", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://huemed-univ.edu.vn"),
    faq: buildFaq(
      "Hue University of Medicine and Pharmacy",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences(
      "https://huemed-univ.edu.vn",
      "https://huemed-univ.edu.vn"
    ),
    similarUniversitySlugs: [
      "can-tho-university-medicine-pharmacy",
      "thai-binh-university-medicine-pharmacy",
    ],
  },
  {
    slug: "nguyen-tat-thanh-university-medicine",
    countrySlug: "vietnam",
    name: "Nguyen Tat Thanh University Faculty of Medicine",
    city: "Ho Chi Minh City",
    type: "Private",
    establishedYear: 2011,
    summary:
      "A private Ho Chi Minh City university with a Faculty of Medicine established in 2011; primarily serving domestic Vietnamese students with insufficient independent confirmation of English-medium MBBS programs, NMC recognition, or WDOMS listing for international students.",
    featured: false,
    officialWebsite: "https://ntt.edu.vn/en/",
    campusLifestyle:
      "A large private multidisciplinary university campus in Ho Chi Minh City with 200+ international academic partnerships; the Faculty of Medicine serves primarily domestic students.",
    cityProfile:
      "Ho Chi Minh City is Vietnam's largest and most cosmopolitan metro — full urban amenities, the largest Indian community in Vietnam, and direct flights to India.",
    clinicalExposure:
      "Limited confirmed hospital affiliations for MBBS clinical training; students should directly verify the scope and depth of clinical access for international MBBS students.",
    hostelOverview:
      "University accommodation exists; specific provisions for international MBBS students are unconfirmed.",
    indianFoodSupport:
      "Ho Chi Minh City has Vietnam's largest Indian community and extensive Indian food options; however, these are city-level conveniences, not university-provided.",
    safetyOverview:
      "Ho Chi Minh City is a well-established major city; standard urban safety awareness applies for students.",
    studentSupport:
      "Primarily domestic-facing Faculty of Medicine; international MBBS English-medium program and support infrastructure are unconfirmed.",
    whyChoose: [
      "Ho Chi Minh City location with Vietnam's best Indian community and metro facilities.",
      "Large private university with 200+ international academic partnerships.",
      "City-level lifestyle and connectivity advantages.",
    ],
    thingsToConsider: [
      "NMC recognition and WDOMS listing are NOT confirmed through independent sources — do NOT enroll without direct verification.",
      "English-medium MBBS program for international students is NOT confirmed; primarily a domestic Vietnamese institution for medicine.",
      "Students seeking confirmed Ho Chi Minh City MBBS should prioritise Hong Bang International University instead.",
    ],
    bestFitFor: [
      "Students who have directly confirmed program availability, NMC status, and WDOMS listing with the university.",
      "Applicants where Ho Chi Minh City lifestyle is a priority and recognition has been independently verified.",
      "Families who have thoroughly vetted this option against Hong Bang and other confirmed HCMC alternatives.",
    ],
    teachingHospitals: [
      "Ho Chi Minh City Mental Health Hospital (cooperation agreement)",
      "Other Ho Chi Minh City hospital affiliations (unspecified)",
    ],
    recognitionBadges: ["Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://ntt.edu.vn/en/"),
    faq: buildFaq(
      "Nguyen Tat Thanh University Faculty of Medicine",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://ntt.edu.vn/en/", "https://ntt.edu.vn/en/"),
    similarUniversitySlugs: [
      "hong-bang-international-university-medicine",
      "phan-chau-trinh-university",
    ],
  },
  {
    slug: "phenikaa-university-faculty-of-medicine",
    countrySlug: "vietnam",
    name: "Phenikaa University Faculty of Medicine",
    city: "Hanoi",
    type: "Private",
    establishedYear: 2017,
    summary:
      "A fast-growing Hanoi private university elevated to national university status, with a recently established Faculty of Medicine targeting international students through an English-medium curriculum at competitive fees — WDOMS and NMC status require direct verification.",
    featured: false,
    officialWebsite: "https://phenikaa-uni.edu.vn/en",
    campusLifestyle:
      "A modern private campus in Hanoi with strong science and technology heritage; the Medical faculty is actively developing its international student infrastructure.",
    cityProfile:
      "Hanoi is Vietnam's capital — a major metropolitan city with excellent transport, culture, food diversity, and a growing international student community.",
    clinicalExposure:
      "Clinical partnerships with Hanoi-area hospitals from Year 3; specific hospital names and clinical depth should be confirmed directly with the Faculty of Medicine.",
    hostelOverview:
      "On-campus and Hanoi-area accommodation available; Indian food arrangements should be confirmed with the university as the medical faculty's international cohort is new.",
    indianFoodSupport:
      "Hanoi's size means Indian restaurants and groceries are available off-campus; on-campus Indian food provisions for the medical cohort should be confirmed.",
    safetyOverview:
      "Phenikaa's Hanoi campus is in a well-developed area; standard capital city safety awareness applies for all students.",
    studentSupport:
      "Active international recruitment with English-speaking admissions team; the Faculty of Medicine is developing its Indian student support infrastructure.",
    whyChoose: [
      "Affordable Hanoi private option (~$3,800/year) with English-medium teaching and strong technology university backing.",
      "Phenikaa has been elevated to national university status — one of only 10 in Vietnam.",
      "Hanoi capital city location with all metro conveniences.",
    ],
    thingsToConsider: [
      "Faculty of Medicine is very new — verify WDOMS listing and NMC recognition independently at search.wdoms.org before committing.",
      "Limited track record for India-return outcomes given the faculty's recent establishment.",
      "Clinical hospital partnerships should be confirmed in detail before enrollment.",
    ],
    bestFitFor: [
      "Students comfortable with a newer faculty at an established technology university in Hanoi.",
      "Applicants who have verified recognition status and want Hanoi at lower fees than Dai Nam.",
      "Families who value Phenikaa's growing national university status and science pedigree.",
    ],
    teachingHospitals: [
      "Top-tier Hanoi hospital partnerships for clinical training from Year 3 (specific institutions to be confirmed with university)",
    ],
    recognitionBadges: ["Ministry of Education Vietnam", "NMC (claimed)", "WDOMS (claimed)"],
    recognitionLinks: buildRecognitionLinks("https://phenikaa-uni.edu.vn/en"),
    faq: buildFaq(
      "Phenikaa University Faculty of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences(
      "https://phenikaa-uni.edu.vn/en",
      "https://phenikaa-uni.edu.vn/en"
    ),
    similarUniversitySlugs: [
      "dai-nam-university-faculty-of-medicine",
      "hanoi-medical-university",
    ],
  },
  {
    slug: "tan-tao-university-school-of-medicine",
    countrySlug: "vietnam",
    name: "Tan Tao University School of Medicine",
    city: "Duc Hoa Ha",
    type: "Private",
    establishedYear: 2010,
    summary:
      "Vietnam's first US-style private non-profit university with an English-medium MD program and confirmed ECFMG certification from 2019, making it more suited to students targeting USMLE than India's NMC/NExT pathway.",
    featured: false,
    officialWebsite: "https://ttu.edu.vn/?lang=en",
    campusLifestyle:
      "A large 503-acre campus in Long An Province's Tan Duc E.City development, 40 km from Ho Chi Minh City — self-contained but remote from urban amenities.",
    cityProfile:
      "Duc Hoa Ha is in Long An Province — approximately 40 km from Ho Chi Minh City. The campus is within a planned industrial-educational township; students need regular transport to Ho Chi Minh City for city amenities.",
    clinicalExposure:
      "On-campus Tan Tao Hospital for initial clinical exposure; US-curriculum-aligned training with historical participation in US hospital clerkships for senior students.",
    hostelOverview:
      "On-campus accommodation within the Tan Duc E.City campus; self-contained housing available; Indian food arrangements should be confirmed as the campus is isolated.",
    indianFoodSupport:
      "The remote campus location means Indian food is largely self-arranged; Ho Chi Minh City's extensive Indian community requires a 40+ km trip.",
    safetyOverview:
      "The campus is a self-contained development; the surrounding Long An Province environment is rural and safe but removed from city infrastructure.",
    studentSupport:
      "US-curriculum-aligned programme support; better suited to students with USMLE ambitions than India-return NMC candidates.",
    whyChoose: [
      "ECFMG-certified from 2019 — confirmed USMLE pathway available for graduates.",
      "US-style medical curriculum in an English-medium environment.",
      "Large self-contained 503-acre campus with on-campus hospital.",
    ],
    thingsToConsider: [
      "NMC recognition for India's NExT/FMGE pathway is NOT confirmed — not suitable for students planning India-return medical practice via NMC.",
      "Remote location 40 km from Ho Chi Minh City requires planning for city access.",
      "Higher fees (~$6,000/year) for a remote campus without confirmed NMC recognition.",
    ],
    bestFitFor: [
      "Students specifically targeting USMLE Steps and a US-style MD program.",
      "Applicants who want an English-only medical education with ECFMG-confirmed international recognition.",
      "Families where India-return NMC licensing is NOT the primary goal.",
    ],
    teachingHospitals: [
      "Tan Tao Hospital (on-campus affiliated facility)",
      "Clinical rotations at US hospital partners",
    ],
    recognitionBadges: ["ECFMG (confirmed 2019)", "Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://ttu.edu.vn/?lang=en"),
    faq: buildFaq(
      "Tan Tao University School of Medicine",
      "Vietnam",
      "English"
    ),
    references: buildReferences("https://ttu.edu.vn/?lang=en", "https://ttu.edu.vn/?lang=en"),
    similarUniversitySlugs: [
      "hong-bang-international-university-medicine",
      "duy-tan-university-faculty-of-medicine",
    ],
  },
  {
    slug: "tay-nguyen-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Tay Nguyen University Faculty of Medicine and Pharmacy",
    city: "Buon Ma Thuot",
    type: "Public",
    establishedYear: 1977,
    summary:
      "A long-established 1977 public multidisciplinary university in Vietnam's Central Highlands with a Faculty of Medicine and Pharmacy; primarily serving domestic Vietnamese students with limited confirmed international MBBS infrastructure.",
    featured: false,
    officialWebsite: "https://www.ttn.edu.vn/index.php/en/",
    campusLifestyle:
      "A public university in Vietnam's highland region, primarily academic with a domestic student focus; international student infrastructure is limited and developing.",
    cityProfile:
      "Buon Ma Thuot is the provincial capital of Dak Lak in Vietnam's Central Highlands — a quieter city with lower costs, cooler climate, and significantly fewer urban conveniences than coastal Vietnam.",
    clinicalExposure:
      "On-campus Tay Nguyen University Hospital and affiliated highland region hospitals; clinical depth for international MBBS students requires direct confirmation with the faculty.",
    hostelOverview:
      "University student accommodation exists; specific international student hostel arrangements and Indian food provision are unconfirmed and must be verified directly.",
    indianFoodSupport:
      "Buon Ma Thuot has a very limited Indian community; students should expect to fully self-arrange food and cultural adaptation without established Indian peer support.",
    safetyOverview:
      "Buon Ma Thuot is a generally safe provincial highland city; the remoteness from major cities requires good advance planning for medical, transport, and social needs.",
    studentSupport:
      "Primarily a domestic Vietnamese institution; English-medium international MBBS programme availability and student support infrastructure should be confirmed before applying.",
    whyChoose: [
      "1977-founded public institution in Vietnam's Central Highlands with an on-campus teaching hospital.",
      "Lower cost of living in highland Buon Ma Thuot than coastal or capital cities.",
      "Part of Vietnam's public medical education system with Ministry of Health affiliation.",
    ],
    thingsToConsider: [
      "NMC recognition and WDOMS listing are NOT confirmed through independent sources — verify directly before enrollment.",
      "International MBBS English-medium programme details are unconfirmed; primarily a domestic Vietnamese university.",
      "Very limited Indian community, food options, and urban amenities in Buon Ma Thuot.",
    ],
    bestFitFor: [
      "Students who have directly confirmed English-medium MBBS availability and recognition status with the university.",
      "Applicants comfortable with a remote highland setting and self-sufficient daily life.",
      "Families who have verified the programme independently and want the lowest-cost highland Vietnam option.",
    ],
    teachingHospitals: [
      "Tay Nguyen University Hospital (on-campus)",
      "Affiliated hospitals in Dak Lak and Central Highlands region",
    ],
    recognitionBadges: ["Ministry of Education Vietnam", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://www.ttn.edu.vn/index.php/en/"),
    faq: buildFaq(
      "Tay Nguyen University Faculty of Medicine and Pharmacy",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://www.ttn.edu.vn/index.php/en/", "https://www.ttn.edu.vn/index.php/en/"),
    similarUniversitySlugs: [
      "buon-ma-thuot-medical-university",
      "can-tho-university-medicine-pharmacy",
    ],
  },
  {
    slug: "thai-binh-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Thai Binh University of Medicine and Pharmacy",
    city: "Thai Binh",
    type: "Public",
    establishedYear: 1968,
    summary:
      "A well-established 1968 public medical university in northern Vietnam with independently confirmed WDOMS ID (F0000425) and ECFMG eligibility, offering some of the lowest total tuition costs for international MBBS in Vietnam.",
    featured: false,
    officialWebsite: "https://tbump.edu.vn",
    campusLifestyle:
      "A focused academic environment in a quieter northern Vietnamese city known for its provincial calm, lower costs, and dedicated medical study culture.",
    cityProfile:
      "Thai Binh is a compact provincial city in northern Vietnam's Red River Delta — affordable, safe, and within 2–3 hours of Hanoi by road.",
    clinicalExposure:
      "Clinical rotations at Thai Binh General Hospital and affiliated facilities across five northern provinces provide solid breadth in general medicine, surgery, and primary care.",
    hostelOverview:
      "On-campus accommodation is available; international students from Laos, Cambodia, and other nations have been hosted previously; Indian-specific food arrangements should be confirmed.",
    indianFoodSupport:
      "Thai Binh has a smaller Indian community than Ho Chi Minh City or Can Tho; students typically self-arrange food and should plan for adaptation in the first semester.",
    safetyOverview:
      "Thai Binh is a safe, low-crime provincial city; the quieter pace can suit students who prefer a distraction-free academic focus.",
    studentSupport:
      "The university has hosted international students from multiple countries; English support for international students is developing alongside the university's growing international intake.",
    whyChoose: [
      "Independently confirmed WDOMS ID (F0000425) — verifiable directly at search.wdoms.org.",
      "Total 6-year tuition of approximately $17,000 is among the lowest for WDOMS-listed Vietnam universities.",
      "Established 1968 public institution with ECFMG eligibility from inception.",
    ],
    thingsToConsider: [
      "Smaller Indian student community than at Can Tho or Ho Chi Minh City universities — factor into social and food planning.",
      "Thai Binh is a smaller provincial city; students who need metro conveniences may find it limiting.",
      "Vietnamese language is needed for clinical ward interaction in later years.",
    ],
    bestFitFor: [
      "Budget-conscious students who prioritise confirmed WDOMS and ECFMG recognition at the lowest cost.",
      "Applicants comfortable with a quieter provincial environment over city life.",
      "Families who want a long-established public university with an independently verifiable recognition record.",
    ],
    teachingHospitals: [
      "Thai Binh General Hospital",
      "Affiliated hospitals across Thai Binh, Nam Dinh, Hai Duong, Ninh Binh, and Ha Nam provinces",
    ],
    recognitionBadges: ["WDOMS (F0000425)", "ECFMG", "WHO", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://tbump.edu.vn"),
    faq: buildFaq(
      "Thai Binh University of Medicine and Pharmacy",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://tbump.edu.vn", "https://tbump.edu.vn"),
    similarUniversitySlugs: [
      "thai-nguyen-university-medicine-pharmacy",
      "hue-university-medicine-pharmacy",
    ],
  },
  {
    slug: "thai-nguyen-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Thai Nguyen University of Medicine and Pharmacy Faculty of Medicine",
    city: "Thai Nguyen",
    type: "Public",
    establishedYear: 1968,
    summary:
      "A well-established public medical university in northern Vietnam with confirmed NMC recognition, WDOMS listing, and 500+ international students enrolled, offering affordable total costs from a 1968-founded institution.",
    featured: false,
    officialWebsite: "https://en.tump.edu.vn",
    campusLifestyle:
      "A well-established university environment with a significant international student presence and dedicated student services in Thai Nguyen's highland city setting.",
    cityProfile:
      "Thai Nguyen is a mid-sized city in Vietnam's northern highlands, approximately 80 km from Hanoi — accessible, affordable, and with a calm academic atmosphere.",
    clinicalExposure:
      "Clinical training at Thai Nguyen Central Hospital and affiliated provincial hospitals covering medicine, surgery, obstetrics, and paediatrics from the clinical years.",
    hostelOverview:
      "Dedicated hostel facilities with over 500 international students; Indian food and cultural accommodation is increasingly available given the growing Indian student cohort.",
    indianFoodSupport:
      "A growing Indian student community of 500+ makes food, social, and cultural support more accessible than at smaller northern Vietnam universities.",
    safetyOverview:
      "Thai Nguyen is a safe, manageable mid-sized city; the large international student presence has built established safety and orientation frameworks.",
    studentSupport:
      "English-speaking international student office with structured onboarding; 500+ international students ensure strong peer support from day one.",
    whyChoose: [
      "Confirmed NMC and WDOMS recognition with 500+ international students — one of the more established northern Vietnam options.",
      "Affordable at ~$3,800/year, significantly below private university pricing.",
      "1968-founded public institution with a long medical education track record.",
    ],
    thingsToConsider: [
      "Basic Vietnamese language is needed for clinical patient interaction in later years.",
      "Thai Nguyen is 80 km from Hanoi — plan for occasional city trips for logistics and recreation.",
      "English-medium program availability and curriculum specifics should be confirmed directly with the university.",
    ],
    bestFitFor: [
      "Students prioritising confirmed NMC/WDOMS recognition at affordable public university fees.",
      "Applicants who want an established Indian student community in northern Vietnam.",
      "Families comparing northern Vietnam options who want a public institution with a strong track record.",
    ],
    teachingHospitals: [
      "Thai Nguyen Central Hospital",
      "Affiliated hospitals in Thai Nguyen and surrounding northern provinces",
    ],
    recognitionBadges: ["NMC", "WDOMS", "WHO", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://en.tump.edu.vn"),
    faq: buildFaq(
      "Thai Nguyen University of Medicine and Pharmacy Faculty of Medicine",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://en.tump.edu.vn", "https://en.tump.edu.vn"),
    similarUniversitySlugs: [
      "thai-binh-university-medicine-pharmacy",
      "hanoi-medical-university",
    ],
  },
  {
    slug: "tra-vinh-university-medicine-pharmacy",
    countrySlug: "vietnam",
    name: "Tra Vinh University School of Medicine and Pharmacy",
    city: "Tra Vinh",
    type: "Public",
    establishedYear: 2006,
    summary:
      "A young public university in the Mekong Delta established in 2006 with a School of Medicine and Pharmacy; international MBBS program details, NMC recognition, and English-medium capacity require direct confirmation from the university.",
    featured: false,
    officialWebsite: "https://en.tvu.edu.vn",
    campusLifestyle:
      "A public multidisciplinary university in the Mekong Delta with limited international student infrastructure; primarily serving the domestic Vietnamese student population.",
    cityProfile:
      "Tra Vinh is a small provincial city in southern Vietnam's Mekong Delta — affordable, quiet, and remote from major metros; approximately 4–5 hours from Ho Chi Minh City.",
    clinicalExposure:
      "TVU Hospital and regional Mekong Delta hospital affiliations provide clinical training; specific capacity and depth for international MBBS students is unconfirmed.",
    hostelOverview:
      "University student accommodation exists; specific provisions for international students, including Indian food, are unconfirmed and must be verified directly.",
    indianFoodSupport:
      "Tra Vinh has a very limited Indian community; self-arrangement of food and social support will be necessary with no established Indian peer network.",
    safetyOverview:
      "Tra Vinh is a small, generally safe Mekong Delta city; the remote location requires good advance preparation for medical, transport, and social needs.",
    studentSupport:
      "Primarily a domestic Vietnamese institution; international MBBS student support is not established; direct contact with the university is essential before applying.",
    whyChoose: [
      "Public university with government institutional backing and a TVU Hospital affiliation.",
      "Very low cost of living in Tra Vinh relative to all other Vietnam options.",
      "Mekong Delta location offers a quiet, focused study environment.",
    ],
    thingsToConsider: [
      "NMC recognition and WDOMS listing are NOT confirmed through independent sources — verify directly at search.wdoms.org.",
      "International MBBS English-medium programme details are unconfirmed; primarily domestic-focused.",
      "Tra Vinh's extreme remoteness from major cities limits access to Indian food, culture, and medical services.",
    ],
    bestFitFor: [
      "Students who have directly verified all program and recognition details with the university.",
      "Applicants seeking the most affordable Mekong Delta option and comfortable with very limited city amenities.",
      "Families who have thoroughly investigated the institution's international MBBS track record.",
    ],
    teachingHospitals: [
      "TVU Hospital (affiliated)",
      "Mekong Delta regional hospitals",
    ],
    recognitionBadges: ["Ministry of Education Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://en.tvu.edu.vn"),
    faq: buildFaq(
      "Tra Vinh University School of Medicine and Pharmacy",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://en.tvu.edu.vn", "https://en.tvu.edu.vn"),
    similarUniversitySlugs: [
      "can-tho-university-medicine-pharmacy",
      "nam-can-tho-university-faculty-of-medicine",
    ],
  },
  {
    slug: "pham-ngoc-thach-university-medicine",
    countrySlug: "vietnam",
    name: "Pham Ngoc Thach University of Medicine Faculty of Medicine",
    city: "Ho Chi Minh City",
    type: "Public",
    establishedYear: 1989,
    summary:
      "A well-established public medical university in Ho Chi Minh City founded in 1989, with confirmed NMC and WDOMS recognition and one of the largest Indian student communities among southern Vietnam institutions.",
    featured: false,
    officialWebsite: "https://pnt.edu.vn",
    campusLifestyle:
      "A public medical university in the heart of Ho Chi Minh City with an active international student community and strong hospital network access in Vietnam's largest metro.",
    cityProfile:
      "Ho Chi Minh City is Vietnam's largest and most cosmopolitan city — excellent transport, diverse food options including established Indian restaurants, and a large international community.",
    clinicalExposure:
      "Clinical training at Pham Ngoc Thach Hospital and affiliated Ho Chi Minh City hospitals providing broad exposure across all major specialties in one of Vietnam's busiest clinical environments.",
    hostelOverview:
      "University hostel facilities available for international students; Indian food options accessible both on and off campus given Ho Chi Minh City's large Indian community.",
    indianFoodSupport:
      "Ho Chi Minh City has one of Vietnam's largest Indian communities with established Indian restaurants and grocery options; campus food support varies — confirm current arrangements with the university.",
    safetyOverview:
      "A large urban environment requiring standard city safety awareness; the university's established international student office provides orientation and ongoing support.",
    studentSupport:
      "Dedicated international student office with English-speaking support; established Indian student network in Ho Chi Minh City helps new arrivals settle quickly.",
    whyChoose: [
      "Confirmed NMC and WDOMS recognition from a 1989-founded public institution.",
      "Ho Chi Minh City location gives access to Vietnam's best urban infrastructure, Indian food, and transport links.",
      "Strong clinical exposure through busy HCMC hospital affiliations.",
    ],
    thingsToConsider: [
      "Ho Chi Minh City living costs are higher than smaller Vietnamese cities — budget accordingly.",
      "Basic Vietnamese is needed for ward-level patient interaction in clinical years.",
      "Confirm current annual fees and hostel arrangements directly with the university.",
    ],
    bestFitFor: [
      "Students wanting a confirmed NMC/WDOMS public university in Vietnam's largest city.",
      "Applicants who prefer urban metro life with strong Indian food and community support.",
      "Families comparing southern Vietnam public options with a strong clinical training record.",
    ],
    teachingHospitals: [
      "Pham Ngoc Thach Hospital (university-affiliated)",
      "Affiliated hospitals across Ho Chi Minh City",
    ],
    recognitionBadges: ["NMC", "WDOMS", "WHO", "Ministry of Health Vietnam"],
    recognitionLinks: buildRecognitionLinks("https://pnt.edu.vn"),
    faq: buildFaq(
      "Pham Ngoc Thach University of Medicine Faculty of Medicine",
      "Vietnam",
      "English + Local Support"
    ),
    references: buildReferences("https://pnt.edu.vn", "https://pnt.edu.vn"),
    similarUniversitySlugs: [
      "hong-bang-international-university-medicine",
      "nguyen-tat-thanh-university-medicine",
    ],
  },
];

export const universities: University[] = universitySeeds.map(
  withUniversityMediaDefaults
);

export const programOfferings: ProgramOffering[] = [
  {
    slug: "kazan-state-medical-university-mbbs",
    universitySlug: "kazan-state-medical-university",
    courseSlug: "mbbs",
    title: "MBBS in English",
    durationYears: 6,
    annualTuitionUsd: 6500,
    totalTuitionUsd: 39000,
    livingUsd: 2400,
    officialProgramUrl: "https://kazangmu.ru/en/",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English",
        "Pre-clinical sciences are primarily delivered in English while students begin adapting to local academic systems.",
      ],
      [
        "Years 3-4",
        "English + Russian patient communication support",
        "Clinical transition usually requires gradual Russian-language comfort for ward interaction and patient handling.",
      ],
      [
        "Years 5-6",
        "English-led academics with local-language clinical use",
        "Senior clinical years depend more heavily on practical patient communication even when theory support remains international-student friendly.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 6500, 2400),
    licenseExamSupport: [
      "Works best for students who plan exam preparation alongside the degree rather than expecting the university alone to cover FMGE, NExT, or USMLE strategy.",
      "The English-medium route helps theory comfort, but clinical communication and self-study discipline remain decisive for licensing outcomes.",
    ],
    intakeMonths: ["September"],
    featured: true,
  },
  {
    slug: "altai-state-medical-university-mbbs",
    universitySlug: "altai-state-medical-university",
    courseSlug: "mbbs",
    title: "MBBS with Clinical Track",
    durationYears: 6,
    annualTuitionUsd: 4700,
    totalTuitionUsd: 28200,
    livingUsd: 2000,
    officialProgramUrl: "https://asmu.ru/",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English with local-language support",
        "Foundational learning is usually presented in an English-support environment with early adaptation to local academic terminology.",
      ],
      [
        "Years 3-4",
        "Bilingual clinical transition",
        "Students typically need more active Russian communication during practical exposure than premium English-track universities advertise.",
      ],
      [
        "Years 5-6",
        "Clinical work with local-language dependence",
        "Later years are better suited to students willing to actively build patient-facing language confidence.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4700, 2000),
    licenseExamSupport: [
      "Better positioned for cost-aware India-return planning than for heavy USMLE-focused positioning.",
      "Students should plan independent exam preparation and not depend only on university marketing claims.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "nam-can-tho-university-mbbs",
    universitySlug: "nam-can-tho-university-faculty-of-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 4300,
    totalTuitionUsd: 25800,
    livingUsd: 2000,
    officialProgramUrl: "https://en.nctu.edu.vn",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-led classroom instruction",
        "Pre-clinical sciences delivered in English with structured Vietnamese language orientation alongside.",
      ],
      [
        "Years 3-4",
        "English-led academics with local clinical adaptation",
        "Students should independently confirm hospital depth and language support as clinical rotation expands.",
      ],
      [
        "Years 5-6",
        "Clinical training with local hospital immersion",
        "Advanced clinical years require Vietnamese language basics for ward patient interaction.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4300, 2000),
    licenseExamSupport: [
      "NMC compliance is claimed — verify current recognition status directly with NMC India before committing.",
      "Students should plan independent FMGE and NExT exam preparation alongside the degree.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "phan-chau-trinh-university-mbbs",
    universitySlug: "phan-chau-trinh-university",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 5500,
    totalTuitionUsd: 33000,
    livingUsd: 2000,
    officialProgramUrl: "https://pctu.edu.vn/en",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-led pre-clinical instruction",
        "Pre-clinical sciences delivered in English with Vietnamese language orientation integrated from semester one.",
      ],
      [
        "Years 3-4",
        "English-led with local clinical adaptation",
        "Clinical rotations across 9 university-owned hospitals require growing Vietnamese communication for ward participation.",
      ],
      [
        "Years 5-6",
        "Advanced clinical immersion across hospital network",
        "Senior clinical years in the university's hospital network provide broad specialist exposure; Vietnamese language is essential.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 5500, 2000),
    licenseExamSupport: [
      "WDOMS ID F0008367 independently confirmed; ECFMG certification from 2024 graduates — supports USMLE pathway for eligible graduates.",
      "NMC eligibility confirmed through WDOMS listing; independent FMGE and NExT exam coaching is still recommended.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "georgian-national-university-seu-mbbs",
    universitySlug: "georgian-national-university-seu",
    courseSlug: "mbbs",
    title: "Medical Doctor Program",
    durationYears: 6,
    annualTuitionUsd: 7000,
    totalTuitionUsd: 42000,
    livingUsd: 3200,
    officialProgramUrl: "https://seu.edu.ge/en/",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English",
        "Foundational sciences are typically one of the biggest reasons students shortlist Georgia over more language-heavy destinations.",
      ],
      [
        "Years 3-4",
        "English with clinical-context adaptation",
        "Practical phases still require students to understand the hospital environment beyond classroom English comfort.",
      ],
      [
        "Years 5-6",
        "Clinical training with local system exposure",
        "Students should verify internship-style practical depth and how international batches are integrated into clinical training.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 7000, 3200),
    licenseExamSupport: [
      "Strong fit for students who want an English-medium environment while building long-term licensing options carefully.",
      "Still requires independent due diligence on exam outcomes, hospital exposure, and country-specific recognition use cases.",
    ],
    intakeMonths: ["October", "March"],
    featured: true,
  },
  {
    slug: "east-european-university-mbbs",
    universitySlug: "east-european-university",
    courseSlug: "mbbs",
    title: "MD Program",
    durationYears: 6,
    annualTuitionUsd: 5400,
    totalTuitionUsd: 32400,
    livingUsd: 3000,
    officialProgramUrl: "https://eeu.edu.ge/en/",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English",
        "The international-student appeal is strongest in the early academic years when classroom adjustment matters most.",
      ],
      [
        "Years 3-4",
        "English with applied clinical adaptation",
        "Students should clarify how hospital training is arranged and how much hands-on exposure is realistically available.",
      ],
      [
        "Years 5-6",
        "Clinical years with local system integration",
        "Later-year experience should be validated directly with current students and official documentation.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 5400, 3000),
    licenseExamSupport: [
      "Better for students who value English-medium delivery and will independently validate recognition requirements.",
      "Licensing outcomes depend heavily on self-study, clinical depth, and strong due diligence before enrollment.",
    ],
    intakeMonths: ["October"],
    featured: false,
  },
  {
    slug: "international-school-of-medicine-mbbs",
    universitySlug: "international-school-of-medicine",
    courseSlug: "mbbs",
    title: "MBBS for International Students",
    durationYears: 6,
    annualTuitionUsd: 4200,
    totalTuitionUsd: 25200,
    livingUsd: 1900,
    officialProgramUrl: "https://ism.iuk.kg/en/",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English",
        "Early years are structured to feel accessible for international students comparing Kyrgyzstan with costlier destinations.",
      ],
      [
        "Years 3-4",
        "English with local-language clinical adjustment",
        "Students should expect more local patient communication needs as practical training expands.",
      ],
      [
        "Years 5-6",
        "Clinical immersion with local hospital work",
        "Later years should be judged by actual hospital exposure and India-return planning, not just affordability.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4200, 1900),
    licenseExamSupport: [
      "Popular for affordability-focused India-return planning, but students must verify current NMC-aligned suitability on their own.",
      "External FMGE or NExT preparation remains important because affordability alone does not determine exam success.",
    ],
    intakeMonths: ["September", "February"],
    featured: true,
  },
  {
    slug: "asian-medical-institute-mbbs",
    universitySlug: "asian-medical-institute",
    courseSlug: "mbbs",
    title: "General Medicine Program",
    durationYears: 6,
    annualTuitionUsd: 3500,
    totalTuitionUsd: 21000,
    livingUsd: 1800,
    officialProgramUrl: "https://asianmedicalinstitute.com/",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English with local support",
        "The main selling point is low entry cost rather than a premium international academic environment.",
      ],
      [
        "Years 3-4",
        "Bilingual clinical transition",
        "Practical training requires stronger local adaptation than a simple English-medium label may suggest.",
      ],
      [
        "Years 5-6",
        "Clinical training with local-language dependence",
        "Students need to treat patient-facing language and hospital quality as serious decision criteria before enrolling.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 3500, 1800),
    licenseExamSupport: [
      "Best seen as a cost-first option that demands extra caution on recognition, hospital training, and long-term licensing planning.",
      "Families should not assume that low cost or consultant popularity guarantees strong academic outcomes.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "buon-ma-thuot-medical-university-mbbs",
    universitySlug: "buon-ma-thuot-medical-university",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 5000,
    totalTuitionUsd: 30000,
    livingUsd: 1800,
    officialProgramUrl: "https://www.bmtu.edu.vn",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium instruction",
        "Pre-clinical sciences delivered in English; Vietnamese language orientation integrated from year one given hospital communication needs.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical adaptation",
        "Clinical rotation at on-campus 500-bed hospital begins; Vietnamese communication grows in importance for ward participation.",
      ],
      [
        "Years 5-6",
        "Clinical immersion across 12 affiliated hospitals",
        "Advanced clinical years across highland regional hospitals; Vietnamese language essential for patient-facing interaction.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 5000, 1800),
    licenseExamSupport: [
      "NMC compliance is claimed — independently verify with NMC India before enrolling; WDOMS listing also requires direct verification.",
      "Students should plan independent FMGE and NExT preparation alongside the degree; international intake only began in 2024.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "can-tho-university-medicine-pharmacy-mbbs",
    universitySlug: "can-tho-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 5000,
    totalTuitionUsd: 30000,
    livingUsd: 2000,
    officialProgramUrl: "https://ctump.edu.vn",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium pre-clinical instruction",
        "Foundational sciences delivered in English; Vietnamese language orientation runs parallel given clinical communication needs.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Clinical training at Can Tho General Hospital and affiliates requires growing Vietnamese communication from year three.",
      ],
      [
        "Years 5-6",
        "Advanced clinical immersion across 32+ hospitals",
        "Senior years in 32+ affiliated regional hospitals require practical Vietnamese language use for full clinical participation.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 5000, 2000),
    licenseExamSupport: [
      "Confirmed NMC, WDOMS, ECFMG, and FAIMER recognition supports both India-return FMGE/NExT and USMLE pathways.",
      "600+ Indian students provide strong peer exam preparation networks; dedicated external coaching still recommended.",
    ],
    intakeMonths: ["September"],
    featured: true,
  },
  {
    slug: "da-nang-university-medical-technology-pharmacy-mbbs",
    universitySlug: "da-nang-university-medical-technology-pharmacy",
    courseSlug: "mbbs",
    title: "Medical Technology / Pharmacy Program",
    durationYears: 6,
    annualTuitionUsd: 2400,
    totalTuitionUsd: 14400,
    livingUsd: 2000,
    officialProgramUrl: "https://dhktyduocdn.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "Vietnamese-medium with English support materials",
        "This institution primarily serves domestic Vietnamese students; international MBBS program availability is unconfirmed.",
      ],
      [
        "Years 3-4",
        "Primarily Vietnamese-medium clinical training",
        "Clinical practical training in medical technology and pharmacy fields; MBBS clinical rotation structure unconfirmed for international students.",
      ],
      [
        "Years 5-6",
        "Applied practical training",
        "Final years focus on medical technology and pharmacy applied training; confirm program details directly before enrolling.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 2400, 2000),
    licenseExamSupport: [
      "This institution specialises in medical technology and pharmacy — NOT the MBBS Doctor of Medicine degree required for NMC licensing.",
      "Students seeking NMC-eligible MBBS in Da Nang should apply to Duy Tan University or Phan Chau Trinh University instead.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "dai-nam-university-faculty-of-medicine-mbbs",
    universitySlug: "dai-nam-university-faculty-of-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 4100,
    totalTuitionUsd: 24600,
    livingUsd: 2200,
    officialProgramUrl: "https://dainam.edu.vn/en",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium pre-clinical instruction",
        "Early years delivered in English with structured Vietnamese language orientation for clinical preparation.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Hospital rotations through 16+ Hanoi affiliates require growing Vietnamese communication alongside English academics.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training in Hanoi hospitals",
        "Senior clinical years at 2 university-operated hospitals and major Hanoi affiliates; Vietnamese language essential for patient interaction.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4100, 2200),
    licenseExamSupport: [
      "NMC and WDOMS confirmed recognition supports FMGE and NExT eligibility; independent exam coaching still recommended.",
      "Hanoi location provides access to good exam preparation centres; structured external coaching from year three is advisable.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "dong-a-university-college-of-medicine-mbbs",
    universitySlug: "dong-a-university-college-of-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 4500,
    totalTuitionUsd: 27000,
    livingUsd: 2000,
    officialProgramUrl: "https://donga.edu.vn",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium foundation years",
        "Pre-clinical subjects taught in English with Vietnamese language orientation for clinical preparation.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical adaptation",
        "Clinical rotations at 5,000+ bed affiliated hospital complex require growing Vietnamese communication for ward participation.",
      ],
      [
        "Years 5-6",
        "Advanced clinical immersion",
        "Senior years across Da Nang's clinical network; Vietnamese language essential for meaningful patient-facing participation.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4500, 2000),
    licenseExamSupport: [
      "NMC and WDOMS recognition claimed — verify independently at search.wdoms.org before committing; FMGE/NExT preparation should be planned separately.",
      "Da Nang's established international student community supports peer-based exam preparation alongside the degree.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "duy-tan-university-faculty-of-medicine-mbbs",
    universitySlug: "duy-tan-university-faculty-of-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 8000,
    totalTuitionUsd: 48000,
    livingUsd: 2500,
    officialProgramUrl: "https://duytan.edu.vn/the-faculty-of-medicine/",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium pre-clinical study",
        "Full English-medium instruction in a modern private university environment with QS rankings visibility.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Clinical rotations at Duy Tan University Hospital and regional affiliates require growing Vietnamese communication from year three.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training in Da Nang hospitals",
        "Senior years across Da Nang's clinical network; Vietnamese basics required for patient-facing ward interaction.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 8000, 2500),
    licenseExamSupport: [
      "Confirmed NMC, WDOMS, ECFMG, and FAIMER recognition supports both India-return FMGE/NExT and USMLE pathways.",
      "QS World University Rankings positioning provides strong university branding for international licensing applications.",
    ],
    intakeMonths: ["September"],
    featured: true,
  },
  {
    slug: "hai-phong-university-medicine-pharmacy-mbbs",
    universitySlug: "hai-phong-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 4333,
    totalTuitionUsd: 25998,
    livingUsd: 2000,
    officialProgramUrl: "https://www.hpmu.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English with Vietnamese language support",
        "Foundation sciences delivered in English while students build Vietnamese readiness for clinical ward communication.",
      ],
      [
        "Years 3-4",
        "Bilingual clinical transition",
        "Clinical training at Hai Phong General Hospital's 5,000-bed network requires Vietnamese communication from year three.",
      ],
      [
        "Years 5-6",
        "Clinical immersion across three-province hospital network",
        "Advanced clinical years across Haiphong, Quang Ninh, and Hai Duong provinces; Vietnamese essential for patient interaction.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4333, 2000),
    licenseExamSupport: [
      "NMC recognition is widely claimed — independently verify with NMC India and at search.wdoms.org before enrolling.",
      "Independent FMGE and NExT exam coaching is essential; begin structured preparation from year three.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "hanoi-medical-university-mbbs",
    universitySlug: "hanoi-medical-university",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 4000,
    totalTuitionUsd: 24000,
    livingUsd: 2500,
    officialProgramUrl: "https://hmu.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-supported pre-clinical foundation",
        "Pre-clinical sciences delivered with English medium support; Vietnamese language orientation integrated from year one.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Clinical rotations at Bach Mai, Viet Duc, and six other national hospitals require significant Vietnamese proficiency from year three.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training at national-level hospitals",
        "Senior clinical years at Vietnam's top national hospitals; strong Vietnamese language essential for full clinical participation.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4000, 2500),
    licenseExamSupport: [
      "NMC and WDOMS confirmed recognition with a long international graduate track record — one of the strongest FMGE/NExT foundations in Vietnam.",
      "Clinical training at Bach Mai and national-level hospitals provides the highest quality exposure for India-return licensing exam preparation.",
    ],
    intakeMonths: ["September"],
    featured: true,
  },
  {
    slug: "hong-bang-international-university-medicine-mbbs",
    universitySlug: "hong-bang-international-university-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 9000,
    totalTuitionUsd: 54000,
    livingUsd: 3000,
    officialProgramUrl: "https://hiu.vn/en/home/",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium pre-clinical instruction",
        "Full English-medium delivery at the on-campus HIU Hospital environment; Vietnamese orientation integrated for clinical preparation.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical adaptation",
        "Clinical rotations at HIU Hospital and major HCMC affiliates require growing Vietnamese for ward-level patient communication.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training across 11 HCMC hospitals",
        "Senior years at Cho Ray, Tu Du, Vinmec, and 8 other affiliates; Vietnamese language essential for full clinical participation.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 9000, 3000),
    licenseExamSupport: [
      "Confirmed NMC and WDOMS recognition supports FMGE and NExT eligibility; on-campus 1,000-bed hospital provides strong clinical exam preparation foundations.",
      "Ho Chi Minh City's large Indian community offers excellent peer exam preparation networks alongside the degree.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "hue-university-medicine-pharmacy-mbbs",
    universitySlug: "hue-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 4500,
    totalTuitionUsd: 27000,
    livingUsd: 1800,
    officialProgramUrl: "https://huemed-univ.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-supported foundation sciences",
        "Pre-clinical subjects delivered with English support; Vietnamese language orientation integrated for clinical preparation.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Clinical rotations at Hue Central Hospital and affiliated hospitals require growing Vietnamese communication from year three.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training at Hue Central Hospital",
        "Senior clinical years at Hue Central Hospital; Vietnamese essential for full patient participation; strong specialist exposure.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 4500, 1800),
    licenseExamSupport: [
      "Full recognition stack — NMC, WDOMS, ECFMG, and FAIMER — provides strong India-return FMGE/NExT and USMLE pathway foundations.",
      "Hue Central Hospital's clinical training quality makes this one of the stronger NExT exam preparation environments among Vietnam public universities.",
    ],
    intakeMonths: ["September"],
    featured: true,
  },
  {
    slug: "nguyen-tat-thanh-university-medicine-mbbs",
    universitySlug: "nguyen-tat-thanh-university-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 6000,
    totalTuitionUsd: 36000,
    livingUsd: 3000,
    officialProgramUrl: "https://ntt.edu.vn/en/",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "Primarily Vietnamese-medium with English support",
        "This institution primarily serves domestic Vietnamese students; English-medium MBBS delivery for international students is not confirmed.",
      ],
      [
        "Years 3-4",
        "Clinical training — program details unconfirmed",
        "Hospital affiliations for international MBBS clinical training should be directly confirmed with the Faculty of Medicine before enrolling.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training — verify directly",
        "Program structure and clinical hospital access for international students must be confirmed with the university before commitment.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 6000, 3000),
    licenseExamSupport: [
      "NMC recognition and WDOMS listing are NOT independently confirmed — do not enroll without direct verification from NMC India and WDOMS.",
      "Students seeking confirmed HCMC MBBS should prioritise Hong Bang International University which has verified recognition.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "phenikaa-university-faculty-of-medicine-mbbs",
    universitySlug: "phenikaa-university-faculty-of-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 3800,
    totalTuitionUsd: 22800,
    livingUsd: 2200,
    officialProgramUrl: "https://phenikaa-uni.edu.vn/en",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium technology-integrated instruction",
        "Modern English-medium delivery at a national university with strong science and technology heritage; Vietnamese language orientation alongside.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Clinical partnerships with Hanoi-area hospitals from Year 3; Vietnamese communication needed for ward participation.",
      ],
      [
        "Years 5-6",
        "Advanced clinical immersion in Hanoi",
        "Senior years at Hanoi hospital partners; Vietnamese language essential; specific hospital names should be confirmed with the faculty.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 3800, 2200),
    licenseExamSupport: [
      "NMC and WDOMS status claimed but require independent verification — confirm at search.wdoms.org and directly with NMC India before enrolling.",
      "Independent FMGE and NExT coaching is essential given the faculty's recent establishment and limited alumni track record.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "tan-tao-university-school-of-medicine-mbbs",
    universitySlug: "tan-tao-university-school-of-medicine",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MD)",
    durationYears: 6,
    annualTuitionUsd: 6000,
    totalTuitionUsd: 36000,
    livingUsd: 1800,
    officialProgramUrl: "https://ttu.edu.vn/?lang=en",
    medium: "English",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-medium US-modeled pre-clinical instruction",
        "Full English-medium US-style curriculum on a 503-acre self-contained campus; Vietnamese language basics recommended for clinical preparation.",
      ],
      [
        "Years 3-4",
        "English-medium clinical training",
        "On-campus Tan Tao Hospital rotations and US hospital partnership clerkships; US-curriculum aligned clinical methodology.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training with US-pathway focus",
        "Senior clinical years structured for USMLE pathway; NMC India-return pathway is NOT confirmed for this program.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 6000, 1800),
    licenseExamSupport: [
      "ECFMG-certified from 2019 — USMLE Steps pathway confirmed for graduates; NMC India-return licensing pathway is NOT confirmed.",
      "Students targeting India-return NMC/NExT practice should NOT choose Tan Tao; this program is designed for USMLE and international pathways.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "tay-nguyen-university-medicine-pharmacy-mbbs",
    universitySlug: "tay-nguyen-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 3500,
    totalTuitionUsd: 21000,
    livingUsd: 1600,
    officialProgramUrl: "https://www.ttn.edu.vn/index.php/en/",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "Primarily Vietnamese-medium with some English support",
        "Primarily a domestic Vietnamese institution; English-medium MBBS delivery for international students is unconfirmed — verify directly.",
      ],
      [
        "Years 3-4",
        "Clinical training — program details unconfirmed for international students",
        "On-campus Tay Nguyen University Hospital rotations; clinical program structure for international MBBS students requires direct confirmation.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training in highland region",
        "Senior clinical years in Central Highlands hospitals; international MBBS availability must be verified before enrolling.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 3500, 1600),
    licenseExamSupport: [
      "NMC recognition and WDOMS listing are NOT independently confirmed — verify directly at search.wdoms.org and with NMC India before committing.",
      "International MBBS English-medium programme details are unconfirmed; this is primarily a domestic Vietnamese public university.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "thai-binh-university-medicine-pharmacy-mbbs",
    universitySlug: "thai-binh-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 2833,
    totalTuitionUsd: 16998,
    livingUsd: 1800,
    officialProgramUrl: "https://tbump.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English-supported pre-clinical foundation",
        "Foundation sciences delivered with English support; Vietnamese language orientation required given clinical ward communication needs.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical bridge",
        "Clinical rotations at Thai Binh General Hospital across five-province network require Vietnamese communication from year three.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training across five northern provinces",
        "Senior years in Red River Delta provincial hospitals; Vietnamese language essential for full patient-facing clinical participation.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 2833, 1800),
    licenseExamSupport: [
      "Independently confirmed WDOMS ID (F0000425) and ECFMG eligibility — among the most verifiable recognition credentials of any Vietnam public university.",
      "Total 6-year tuition of ~$17,000 is among Vietnam's lowest for a WDOMS-confirmed institution; independent NExT/FMGE coaching still required.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "thai-nguyen-university-medicine-pharmacy-mbbs",
    universitySlug: "thai-nguyen-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 3800,
    totalTuitionUsd: 22800,
    livingUsd: 1800,
    officialProgramUrl: "https://en.tump.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "English with Vietnamese language support",
        "Pre-clinical instruction uses English support alongside Vietnamese language orientation; 500+ international student cohort provides peer support.",
      ],
      [
        "Years 3-4",
        "English + Vietnamese clinical transition",
        "Clinical rotations at Thai Nguyen Central Hospital and affiliates require progressive Vietnamese communication for ward participation.",
      ],
      [
        "Years 5-6",
        "Clinical immersion in northern regional hospitals",
        "Advanced clinical years in provincial northern Vietnam hospitals; Vietnamese essential for patient interaction; strong peer support network.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 3800, 1800),
    licenseExamSupport: [
      "Confirmed NMC and WDOMS recognition — supports FMGE, NExT, and USMLE pathways for eligible graduates.",
      "500+ international student cohort provides strong peer-based exam preparation networks; external coaching still strongly recommended.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
  {
    slug: "tra-vinh-university-medicine-pharmacy-mbbs",
    universitySlug: "tra-vinh-university-medicine-pharmacy",
    courseSlug: "mbbs",
    title: "Doctor of Medicine (MBBS equivalent)",
    durationYears: 6,
    annualTuitionUsd: 3000,
    totalTuitionUsd: 18000,
    livingUsd: 1600,
    officialProgramUrl: "https://en.tvu.edu.vn",
    medium: "English + Local Support",
    teachingPhases: buildTeachingPhases([
      [
        "Years 1-2",
        "Primarily Vietnamese-medium with some English support",
        "Primarily a domestic Vietnamese institution; English-medium MBBS delivery for international students is unconfirmed — verify directly.",
      ],
      [
        "Years 3-4",
        "Clinical training — program details unconfirmed",
        "TVU Hospital rotations and Mekong Delta affiliates; international MBBS clinical program structure must be confirmed before enrolling.",
      ],
      [
        "Years 5-6",
        "Advanced clinical training — verify directly",
        "Program structure and hospital access for international students must be confirmed with the university before any commitment.",
      ],
    ]),
    yearlyCostBreakdown: buildYearlyCostBreakdown(6, 3000, 1600),
    licenseExamSupport: [
      "NMC recognition and WDOMS listing are NOT confirmed — verify directly at search.wdoms.org and with NMC India before committing.",
      "International MBBS English-medium program details unconfirmed; students should verify all program specifics directly with the university.",
    ],
    intakeMonths: ["September"],
    featured: false,
  },
];

export const landingPages: LandingPage[] = [
  {
    slug: "mbbs-in-russia",
    courseSlug: "mbbs",
    countrySlug: "russia",
    title: "MBBS in Russia",
    kicker: "Established public medical universities",
    summary:
      "Compare public Russian medical universities, hostel-backed campuses, and fee bands to shortlist a confident MBBS pathway.",
    heroHighlights: [
      "Public university options",
      "Strong university legacy",
      "NMC-focused shortlisting",
      "Hostel-backed campus planning",
    ],
    reasonsToChoose: [
      "Broad range of public universities for different budgets",
      "Long-standing Indian student familiarity and medical brand recognition",
      "Useful when families want structured, legacy-heavy options",
    ],
    editorialNotes: [
      "Best for families who value institutional history over trendiness.",
      "Strong shortlist destination when you want multiple public MBBS options in one market.",
      "Important to compare city, language support, and winter lifestyle before final selection.",
    ],
    featuredUniversitySlugs: [
      "kazan-state-medical-university",
      "altai-state-medical-university",
    ],
    faq: [
      {
        question: "Is MBBS in Russia affordable for Indian students?",
        answer:
          "Russia usually offers a wide fee spread, so students can compare public options by tuition, hostel cost, and city lifestyle instead of relying on one sticker price.",
      },
      {
        question: "Should students choose Russia only by rankings?",
        answer:
          "No. The better approach is to evaluate recognition, student support, budget fit, city environment, and how the program aligns with future licensing plans.",
      },
    ],
    metaTitle: "MBBS in Russia 2026 | Fees, Universities, Eligibility",
    metaDescription:
      "Explore MBBS in Russia with shortlist-ready university data, fee bands, hostel filters, and a lead capture flow built for Indian applicants.",
  },
  {
    slug: "mbbs-in-vietnam",
    courseSlug: "mbbs",
    countrySlug: "vietnam",
    title: "MBBS in Vietnam",
    kicker: "NMC-recognised · English-medium · Affordable fees",
    summary:
      "Vietnam has emerged as one of the most credible and affordable MBBS destinations for Indian students — with NMC-recognised universities, English-medium programs, and fees starting from $2,833/year. Closer to home, easier to settle in, and with a fast-growing Indian student community.",
    heroHighlights: [
      "Fees from $2,833/year",
      "NMC & WDOMS recognised",
      "English-medium programs",
      "Hostel with Indian food",
      "Closer to India",
    ],
    reasonsToChoose: [
      "Significantly lower fees than Indian private medical colleges — total 6-year costs can be ₹15–45 lakh all-in, well below comparable programs in Russia or Eastern Europe.",
      "Multiple universities hold confirmed NMC, WDOMS, and ECFMG recognition — graduates can sit FMGE/NExT to practice medicine in India.",
      "Vietnam is geographically close to India (3–5 hour flights), making semester breaks, emergency travel, and family visits far easier than European or Central Asian destinations.",
      "English is the primary teaching language in international MBBS programs, eliminating the language barrier that affects clinical years in Russia, China, or Kazakhstan.",
      "A rapidly growing Indian student community across Can Tho, Da Nang, Hanoi, and Ho Chi Minh City means established Indian food, cultural support, and peer networks from day one.",
      "Diverse city choices — from the coastal lifestyle of Da Nang to the Mekong Delta calm of Can Tho — let students match their personality and lifestyle preferences.",
    ],
    editorialNotes: [
      "Always verify the specific university's WDOMS listing at search.wdoms.org before paying any fees — not all universities marketed to Indian students are confirmed.",
      "Can Tho University of Medicine and Pharmacy is the most consistently recognised public university with NMC, WDOMS, ECFMG, and FAIMER confirmation.",
      "Duy Tan and Phan Chau Trinh are the strongest private options with independently verified WDOMS IDs and ECFMG certification.",
    ],
    featuredUniversitySlugs: [
      "can-tho-university-medicine-pharmacy",
      "hue-university-medicine-pharmacy",
      "duy-tan-university-faculty-of-medicine",
      "phan-chau-trinh-university",
      "thai-binh-university-medicine-pharmacy",
      "thai-nguyen-university-medicine-pharmacy",
    ],
    faq: [
      {
        question: "Is MBBS in Vietnam recognised by the NMC (India)?",
        answer:
          "Yes — several Vietnam universities are NMC-recognised, meaning Indian graduates can sit the FMGE/NExT screening test to obtain a licence to practice in India. However, NMC recognition is specific to each university, not the country as a whole. Always verify the individual university's status on the official NMC website or WDOMS (search.wdoms.org) before enrolling.",
      },
      {
        question: "What are the total fees for MBBS in Vietnam?",
        answer:
          "Annual tuition ranges from approximately $2,833/year at public universities like Thai Binh University to $8,000–$9,000/year at premium private institutions like Duy Tan or Hong Bang. Adding hostel ($1,000–$2,000/year) and living costs ($1,600–$3,000/year), the total 6-year cost typically falls between ₹15 lakh and ₹45 lakh — significantly below Indian private medical college fees.",
      },
      {
        question: "Is the medium of instruction English in Vietnam MBBS?",
        answer:
          "Yes — all international MBBS programs in Vietnam are taught in English for classroom and theory components. In clinical years (typically years 3–6), basic Vietnamese language exposure becomes helpful for patient interaction. Universities provide language support, and most Indian students adapt within the first year.",
      },
      {
        question: "How does Vietnam compare to Russia or Ukraine for MBBS?",
        answer:
          "Vietnam offers closer geography (3–5 hour flights vs. 7–10+ hours), warmer climate, English-medium teaching without a Russian language requirement, comparable or lower fees, and a growing Indian student ecosystem. The main trade-off is that Vietnam's medical education track record for India-return outcomes is shorter than Russia's decades-long history — making university-level due diligence more important.",
      },
      {
        question: "Which are the best Vietnam universities for Indian students?",
        answer:
          "The most consistently recognised universities are Can Tho University of Medicine and Pharmacy (NMC + WDOMS + ECFMG + FAIMER confirmed), Hue University of Medicine and Pharmacy (same recognition stack), and Duy Tan University (WDOMS confirmed with QS World Rankings recognition). Thai Binh University (WDOMS F0000425) is the most affordable confirmed option. Phan Chau Trinh University (WDOMS F0008367, ECFMG from 2024) is a well-resourced private option in Da Nang.",
      },
      {
        question: "What intake months are available for MBBS in Vietnam?",
        answer:
          "All Vietnam universities offering MBBS to international students admit students in September. Applications typically open January–June for the September intake. Students should apply at least 3–4 months before the intake to allow time for documentation, visa processing, and accommodation arrangements.",
      },
    ],
    metaTitle: "MBBS in Vietnam 2026 | NMC-Recognised Universities, Fees & Admissions",
    metaDescription:
      "Complete guide to MBBS in Vietnam for Indian students — NMC and WDOMS recognised universities, fees from $2,833/year, English-medium programs, hostel details, and free expert counselling.",
  },
  {
    slug: "mbbs-in-georgia",
    courseSlug: "mbbs",
    countrySlug: "georgia",
    title: "MBBS in Georgia",
    kicker: "English-medium urban medical programs",
    summary:
      "Evaluate English-medium MBBS options in Georgia with city-based campuses, cleaner shortlist comparisons, and modern student support.",
    heroHighlights: [
      "English-medium programs",
      "Urban campus lifestyle",
      "Compact shortlist planning",
      "International student orientation",
    ],
    reasonsToChoose: [
      "Strong option for students who want English-medium delivery from day one",
      "Useful for families who value city safety and daily convenience",
      "Often shortlisted by students prioritizing urban living over ultra-low fees",
    ],
    editorialNotes: [
      "Georgia is best evaluated through city fit, medium, and academic support quality.",
      "Do not compare only by tuition; lifestyle and long-term academic fit matter more here.",
      "A smaller, better Georgia shortlist usually converts better than a wide one.",
    ],
    featuredUniversitySlugs: [
      "georgian-national-university-seu",
      "east-european-university",
    ],
    faq: [
      {
        question: "Is Georgia a good MBBS destination for English-medium study?",
        answer:
          "Georgia is often chosen by students who want English-medium delivery and a more urban campus environment, especially in Tbilisi-based programs.",
      },
      {
        question: "What matters most when choosing an MBBS university in Georgia?",
        answer:
          "Medium, recognition, city life, fee stack, hostel, and real support after admission matter more than generic marketing claims.",
      },
    ],
    metaTitle: "MBBS in Georgia 2026 | Fees, Universities, English Medium",
    metaDescription:
      "Compare MBBS in Georgia options by university, fee, hostel, and support quality with a high-intent landing page built for Indian students.",
  },
  {
    slug: "mbbs-in-kyrgyzstan",
    courseSlug: "mbbs",
    countrySlug: "kyrgyzstan",
    title: "MBBS in Kyrgyzstan",
    kicker: "Budget-led medical shortlisting",
    summary:
      "Explore affordable MBBS options in Kyrgyzstan with fee-sensitive comparisons, hostel filters, and fast shortlist discovery.",
    heroHighlights: [
      "Lower annual fee bands",
      "Hostel-backed affordability",
      "Strong budget comparison use case",
      "Fast shortlist generation",
    ],
    reasonsToChoose: [
      "One of the clearest destinations for affordability-driven MBBS planning",
      "Helps students compare lower-fee options without losing hostel visibility",
      "Best for families where total cost is the main decision driver",
    ],
    editorialNotes: [
      "Kyrgyzstan shortlists should be quality-checked carefully, not decided only by low fees.",
      "Support, recognition, and student environment still matter even in budget-led planning.",
      "This destination performs best when paired with structured eligibility and hostel filters.",
    ],
    featuredUniversitySlugs: [
      "international-school-of-medicine",
      "asian-medical-institute",
    ],
    faq: [
      {
        question: "Why is Kyrgyzstan often shortlisted for MBBS?",
        answer:
          "Kyrgyzstan is often shortlisted because it sits in the lower fee band for international MBBS planning while still offering hostel-backed options.",
      },
      {
        question: "Should students choose only by the lowest fee?",
        answer:
          "No. The better shortlist balances affordability with recognition, hostel quality, city support, and future licensing fit.",
      },
    ],
    metaTitle: "MBBS in Kyrgyzstan 2026 | Affordable Universities & Fees",
    metaDescription:
      "Find affordable MBBS in Kyrgyzstan with country-level content, filter-ready university data, and strong lead capture support.",
  },
];
