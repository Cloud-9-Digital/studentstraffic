import type {
  CostOfLiving,
  DocumentsRequired,
  EligibilityCriteria,
} from "@/lib/data/types";

export type CountryContent = {
  quickFacts: Array<{ label: string; value: string }>;
  eligibility: EligibilityCriteria;
  admissionSteps: string[];
  documentsRequired: DocumentsRequired;
  hostelInfo: string;
  scholarshipInfo: string;
  costOfLiving: CostOfLiving;
  careerOpportunities: string[];
};

const countryContentMap: Record<string, CountryContent> = {
  russia: {
    quickFacts: [
      { label: "Capital", value: "Moscow" },
      { label: "Official language", value: "Russian" },
      { label: "Time zone", value: "UTC+3 (Moscow); varies by region" },
      { label: "Population", value: "~144 million" },
      { label: "Climate", value: "Continental — cold winters, warm summers" },
      { label: "Currency", value: "Russian Ruble (RUB)" },
      { label: "Common intake", value: "September" },
    ],
    eligibility: {
      intro:
        "Indian students applying to Russian medical universities must meet the criteria set by the National Medical Commission (NMC) for overseas MBBS eligibility.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology as core subjects",
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC candidates)",
        "Cleared NEET-UG (mandatory since 2018)",
        "Age 17 or above at the time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and save your scorecard",
      "Research and shortlist NMC-recognised universities in Russia",
      "Submit your application with required documents to the chosen university",
      "Receive the official invitation letter from the university",
      "Apply for a Russian student visa at the Russian Embassy in India",
      "Complete pre-departure medical examination including HIV test",
      "Travel to Russia and complete university registration",
      "Attend orientation and begin classes in September",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet",
        "Class 12 marksheet (Physics, Chemistry, Biology)",
        "NEET-UG scorecard",
        "School transfer certificate",
        "10 passport-size photographs",
        "Valid passport (minimum 18 months validity)",
      ],
      visa: [
        "Official invitation letter from the Russian university",
        "Completed visa application form",
        "Medical fitness certificate including HIV test result",
        "Bank statement showing sufficient funds",
        "Travel insurance documents",
        "Notarised copies of academic certificates",
      ],
    },
    hostelInfo:
      "Most Russian medical universities provide dedicated hostel accommodation for international students, typically in separate blocks close to the campus. Indian students in cities like Kazan, Volgograd, and Orenburg are part of well-established communities with dedicated Indian mess facilities. University hostel costs range from $80–150/month including utilities. Private apartments are available in most cities for students who prefer independent arrangements after the first year.",
    scholarshipInfo:
      "The Russian Government offers a limited number of fully or partially funded seats each year through Rossotrudnichestvo (the Russian Agency for International Cooperation). Eligible students pay reduced or no tuition at designated Russian universities. Separately, some universities offer merit-based tuition reductions of 10–20% for academically strong applicants. Scholarship availability and eligibility criteria change each academic cycle — verify through the official Rossotrudnichestvo portal or the Russian Embassy in India before the September intake.",
    costOfLiving: {
      intro:
        "Living costs in Russia vary significantly by city. Moscow and Saint Petersburg are the most expensive; medical university cities like Kazan, Volgograd, Kursk, and Orenburg are considerably more affordable for students.",
      items: [
        { category: "Hostel accommodation", range: "$80 – $150/month", notes: "University hostel including utilities" },
        { category: "Food & mess", range: "$100 – $200/month", notes: "Indian mess available in most medical cities" },
        { category: "Local transport", range: "$15 – $30/month", notes: "Metro, bus, student passes" },
        { category: "Phone & internet", range: "$10 – $20/month", notes: "" },
        { category: "Miscellaneous", range: "$50 – $100/month", notes: "Stationery, clothing, recreation" },
        { category: "Monthly total estimate", range: "$255 – $500/month", notes: "Excluding tuition fees" },
      ],
    },
    careerOpportunities: [
      "Clear FMGE/NExT to obtain NMC registration and practise medicine in India after returning",
      "Apply for postgraduate MD/MS or DNB programmes in India with a valid FMGE/NExT score",
      "Continue clinical specialisation through MD residency at Russian universities",
      "Explore international licensing pathways in the UK (PLAB), Middle East, or Canada with a Russia-issued degree",
      "Join academic or clinical research roles at Indian or international medical institutions",
    ],
  },
  vietnam: {
    quickFacts: [
      { label: "Capital", value: "Hanoi" },
      { label: "Official language", value: "Vietnamese" },
      { label: "Time zone", value: "UTC+7 (Indochina Time)" },
      { label: "Population", value: "~97 million" },
      { label: "Climate", value: "Tropical monsoon — warm year-round, wet season June–November" },
      { label: "Currency", value: "Vietnamese Dong (VND)" },
      { label: "Common intake", value: "September" },
    ],
    eligibility: {
      intro:
        "Indian students applying for MBBS in Vietnam must meet the standard NMC requirements for overseas medical education, confirmed in the 2022 NMC Screening Test Regulations.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology as core subjects",
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC candidates)",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and save your scorecard",
      "Verify NMC recognition of shortlisted Vietnam universities on the official NMC portal",
      "Submit application with required documents to the university or authorised representative",
      "Receive the university's official admission offer letter",
      "Apply for a Vietnam student visa at the Vietnamese Embassy in India",
      "Complete pre-departure medical tests including HIV test",
      "Travel to Vietnam and complete registration at the university",
      "Attend orientation and begin English-medium MBBS classes in September",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet",
        "Class 12 marksheet (Physics, Chemistry, Biology)",
        "NEET-UG scorecard",
        "School transfer certificate",
        "10 passport-size photographs",
        "Valid passport (minimum 18 months validity)",
      ],
      visa: [
        "Admission offer letter from the Vietnamese university",
        "Completed visa application form",
        "Medical certificate including HIV test result",
        "Bank statement or sponsorship letter",
        "Travel insurance proof",
        "Academic documents (copies in English)",
      ],
    },
    hostelInfo:
      "Vietnam universities typically provide on-campus or adjacent hostel accommodation for international students, with monthly costs ranging from $80–180/month. Universities in Can Tho, Da Nang, Hanoi, and Ho Chi Minh City all have Indian student communities with access to Indian food in university canteens or nearby restaurants. Phan Chau Trinh University (Da Nang) and Duy Tan University maintain modern student residential facilities. Students in larger cities can supplement university accommodation with affordable private rental options after the first year.",
    scholarshipInfo:
      "Vietnam does not have a large-scale government scholarship programme specifically for Indian MBBS students comparable to some Eastern European destinations. Public universities like Can Tho University of Medicine and Pharmacy occasionally offer partial fee waivers for strong applicants on a case-by-case basis. Bilateral education agreements between India and Vietnam cover a small number of sponsored seats annually — confirm current availability with the Vietnamese Embassy in India or the international admissions team of the specific university.",
    costOfLiving: {
      intro:
        "Vietnam is one of the more affordable study destinations in Asia. Costs vary by city — Ho Chi Minh City and Hanoi are more expensive than Can Tho or Da Nang.",
      items: [
        { category: "Hostel accommodation", range: "$80 – $180/month", notes: "University hostel or nearby student housing" },
        { category: "Food & mess", range: "$80 – $150/month", notes: "Indian food available in most medical cities" },
        { category: "Local transport", range: "$10 – $25/month", notes: "Motorbike taxi, bus, rental scooter" },
        { category: "Phone & internet", range: "$8 – $15/month", notes: "Good mobile connectivity across cities" },
        { category: "Miscellaneous", range: "$40 – $80/month", notes: "Stationery, recreation, personal care" },
        { category: "Monthly total estimate", range: "$218 – $450/month", notes: "Excluding tuition fees" },
      ],
    },
    careerOpportunities: [
      "Clear FMGE/NExT to obtain NMC registration and practise in India — several Vietnam universities are NMC-recognised for this pathway",
      "Apply for postgraduate DNB or MD/MS programmes in India with a valid FMGE/NExT score",
      "Explore PG clinical specialisation in Vietnam or nearby Southeast Asian medical institutions",
      "Vietnam's location gives graduates proximity to Singapore, Malaysia, and other regional medical markets",
      "Academic or research roles at Vietnamese medical universities or WHO-affiliated health institutions",
    ],
  },
  georgia: {
    quickFacts: [
      { label: "Capital", value: "Tbilisi" },
      { label: "Official language", value: "Georgian" },
      { label: "Time zone", value: "UTC+4 (Georgia Standard Time)" },
      { label: "Population", value: "~3.7 million" },
      { label: "Climate", value: "Diverse — subtropical coast, continental highlands" },
      { label: "Currency", value: "Georgian Lari (GEL)" },
      { label: "Common intake", value: "September / February" },
    ],
    eligibility: {
      intro:
        "Indian students applying for MBBS in Georgia must meet NMC requirements for overseas medical education.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology",
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC candidates)",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and save your scorecard",
      "Shortlist NMC-recognised Georgian universities",
      "Submit application with required documents",
      "Receive admission offer letter",
      "Apply for Georgia student visa",
      "Complete pre-departure medical examination",
      "Travel to Georgia and complete registration",
      "Begin classes",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet",
        "Class 12 PCB marksheet",
        "NEET-UG scorecard",
        "School transfer certificate",
        "10 passport-size photographs",
        "Valid passport (minimum 18 months validity)",
      ],
      visa: [
        "Admission letter from Georgian university",
        "Visa application form",
        "Medical fitness certificate",
        "Bank statement",
        "Travel insurance",
        "Copies of academic certificates",
      ],
    },
    hostelInfo:
      "Georgian medical universities typically provide student accommodation close to campus. Tbilisi-based universities are well-serviced by the city's public transport system, giving students access to affordable housing and dining options across the city. Monthly hostel costs typically range from $100–200/month.",
    scholarshipInfo:
      "Some Georgian universities offer merit-based fee reductions for international students with strong academic records. The Georgian Government also operates a small scholarship programme for foreign students under bilateral agreements. Confirm availability and eligibility criteria with the specific university's international admissions team.",
    costOfLiving: {
      intro:
        "Tbilisi is one of the more affordable European capital cities for students. Food, transport, and accommodation costs are significantly lower than Western Europe.",
      items: [
        { category: "Hostel accommodation", range: "$100 – $200/month", notes: "University or private hostel" },
        { category: "Food & dining", range: "$80 – $150/month", notes: "Mix of university canteen and outside" },
        { category: "Local transport", range: "$15 – $30/month", notes: "Metro, bus, minibus" },
        { category: "Phone & internet", range: "$10 – $20/month", notes: "" },
        { category: "Miscellaneous", range: "$50 – $80/month", notes: "Personal, recreation" },
        { category: "Monthly total estimate", range: "$255 – $480/month", notes: "Excluding tuition" },
      ],
    },
    careerOpportunities: [
      "Clear FMGE/NExT to obtain NMC registration and practise medicine in India",
      "Apply for postgraduate MD/MS or DNB programmes in India after licensing",
      "Georgian universities are often NMC-recognised, supporting the India-return pathway",
      "Explore international licensing in the UK, Europe, or Middle East",
    ],
  },
  kyrgyzstan: {
    quickFacts: [
      { label: "Capital", value: "Bishkek" },
      { label: "Official language", value: "Kyrgyz and Russian" },
      { label: "Time zone", value: "UTC+6" },
      { label: "Population", value: "~7 million" },
      { label: "Climate", value: "Continental — cold winters, warm dry summers" },
      { label: "Currency", value: "Kyrgyzstani Som (KGS)" },
      { label: "Common intake", value: "September" },
    ],
    eligibility: {
      intro:
        "Indian students applying for MBBS in Kyrgyzstan must meet the standard NMC requirements for overseas medical education.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology",
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC)",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and save your scorecard",
      "Shortlist NMC-recognised universities in Kyrgyzstan",
      "Submit application with required documents",
      "Receive official admission offer letter",
      "Apply for a Kyrgyzstan student visa",
      "Complete pre-departure medical tests",
      "Travel to Bishkek and complete university registration",
      "Begin classes in September",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet",
        "Class 12 PCB marksheet",
        "NEET-UG scorecard",
        "School transfer certificate",
        "10 passport-size photographs",
        "Valid passport (minimum 18 months validity)",
      ],
      visa: [
        "Admission letter from Kyrgyz university",
        "Visa application form",
        "Medical fitness certificate",
        "Bank statement",
        "Travel insurance",
        "Copies of academic documents",
      ],
    },
    hostelInfo:
      "Kyrgyzstan universities in Bishkek provide on-campus hostel accommodation for international students. Indian student communities in Bishkek have established food options with Indian mess facilities near major university campuses. Hostel costs typically range from $60–120/month including utilities.",
    scholarshipInfo:
      "Some Kyrgyzstan universities offer merit-based fee reductions or partial scholarships for Indian students. The Kyrgyz Government offers a limited number of scholarships under bilateral agreements. Confirm current availability with the specific university before applying.",
    costOfLiving: {
      intro:
        "Bishkek is among the more affordable cities for Indian medical students. The lower cost of living is one of the primary reasons students shortlist Kyrgyzstan.",
      items: [
        { category: "Hostel accommodation", range: "$60 – $120/month", notes: "University hostel including utilities" },
        { category: "Food & mess", range: "$60 – $120/month", notes: "Indian mess options available near campuses" },
        { category: "Local transport", range: "$10 – $20/month", notes: "Bus, minibus (marshrutka)" },
        { category: "Phone & internet", range: "$8 – $15/month", notes: "" },
        { category: "Miscellaneous", range: "$30 – $60/month", notes: "Personal, recreation, stationery" },
        { category: "Monthly total estimate", range: "$168 – $335/month", notes: "Excluding tuition" },
      ],
    },
    careerOpportunities: [
      "Clear FMGE/NExT to obtain NMC registration and practise medicine in India",
      "Apply for postgraduate programmes in India after passing FMGE/NExT",
      "Explore international medical licensing pathways with a Kyrgyzstan-issued degree",
      "Continue specialisation in Kyrgyzstan or neighbouring Central Asian countries",
    ],
  },
};

export function getCountryContent(slug: string): CountryContent | null {
  return countryContentMap[slug] ?? null;
}
