import type {
  CostOfLiving,
  DocumentsRequired,
  EligibilityCriteria,
} from "@/lib/data/types";

export type CountryContent = {
  quickFacts: Array<{ label: string; value: string }>;
  eligibility: EligibilityCriteria;
  admissionSteps: string[];
  verificationChecklist?: string[];
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
      { label: "Admission cycle", value: "Usually June to October; many universities begin teaching in September" },
      { label: "Main admission routes", value: "Paid seat or Russian Government quota" },
    ],
    eligibility: {
      intro:
        "Russia has 50+ medical colleges meeting NMC guidelines and accepting Indian students. Before shortlisting a medical college in Russia, confirm the Indian-side eligibility requirements and then verify the exact university-side admissions route — each institution uses its own document formats, interview processes, and enrollment timelines.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology as core subjects",
        "Minimum 50% aggregate in PCB subjects",
        "Qualified NEET-UG before taking MBBS admission abroad if you want the India-return pathway to remain open",
        "Age 17 or above by 31 December of the admission year",
        "Valid passport and school documents in the format accepted by the university",
      ],
    },
    admissionSteps: [
      "We assess your NEET score, Class 12 PCB marks, budget, and city preference, then shortlist 3–5 Russian universities that match your profile. Every university we present is WDOMS-listed, meets NMC guidelines, and confirmed open for foreign applicants in the current cycle.",
      "We prepare your complete document set in the exact format required: Class 10 and 12 marksheets with apostille, notarised Russian translations of all academic records, NEET scorecard, photographs, and medical fitness certificate. Apostille and translation are mandatory for Russia — we manage this from your city.",
      "We submit your application through the university's official international admissions route. For students eligible for the Russian Government Scholarship quota, we process through the Indian Ministry of Education pathway — a separate route we handle in parallel.",
      "We obtain the university's official invitation letter on your behalf, typically within 2–4 weeks of a complete application. We review the invitation for accuracy — institution name, course, fee terms — before presenting it to you.",
      "We guide you through the NMC Eligibility Certificate application at nmc.org.in. This is mandatory before departure; we confirm the university meets current FMGL guidelines before the application is submitted.",
      "We prepare your Russian student visa file — original invitation letter, apostilled academic records, medical certificate, and the full embassy checklist for your city. We track the application through to visa grant, typically 5–15 working days.",
      "We brief you before departure on migration registration (required within 3 days of arrival), mandatory Russian medical insurance, university health checks, and enrollment formalities. Your first week in Russia follows a clear sequence we walk you through in advance.",
    ],
    verificationChecklist: [
      "We obtain the confirmed 2026-2027 fee schedule — annual tuition, hostel charges, payment timeline, and refund terms — in writing from the university before any payment is processed.",
      "The MBBS pathway duration, year-by-year teaching language, and clinical-year language requirements are confirmed for the current intake before offer acceptance.",
      "Document attestation requirements — apostille, consular legalisation, notarised Russian translations — are confirmed per university and handled as part of the admission process.",
      "The visa invitation issuer, expected processing timeline, and contingency if the invitation is delayed are all confirmed before the application is submitted.",
      "Our fee planning covers the full cost of arrival — migration registration, medical insurance, local compliance exams, and university onboarding — not just the first tuition invoice.",
    ],
    documentsRequired: {
      educational: [
        "Passport copy",
        "Class 10 marksheet and certificate",
        "Class 12 marksheet and certificate with Physics, Chemistry, and Biology",
        "NEET-UG scorecard",
        "Passport-size photographs in the quantity requested by the university",
        "Notarized Russian translations of passport or education documents if required",
        "Legalization, apostille, or recognition paperwork if required for your document set",
      ],
      visa: [
        "Official invitation letter from the Russian university",
        "Valid passport",
        "Completed visa application form",
        "Photographs and supporting forms requested by the embassy or visa centre",
        "Insurance and medical documents if requested for your case",
        "Copies of academic and identity documents supporting the invitation",
      ],
    },
    hostelInfo:
      "Hostel arrangements vary sharply by university — room type, tariff, deposit, utility inclusion, and first-year allocation policy are all university-specific. We confirm the current hostel tariff, guaranteed availability for the intake, kitchen access, move-in date, and payment deadlines as part of the admissions package we present to every family.",
    scholarshipInfo:
      "The Russian Government allocates a limited number of fully funded seats each year to Indian students through its federal quota programme. Competition for these seats is high and the application window is fixed — we guide eligible students through the quota route as a separate, parallel process. For fee-paying seats, any university-specific discount or waiver is confirmed in writing from the admissions office before it is presented to the family as a firm offer.",
    costOfLiving: {
      intro:
        "Living costs in Russia vary heavily by city and by whether you stay in a university dormitory or private rental. Use these figures only as a first-pass planning range and rebuild your budget from the university's current hostel notice and the city you actually choose.",
      items: [
        { category: "Hostel accommodation", range: "$80 – $150/month", notes: "Planning range only; verify current university tariff" },
        { category: "Food & groceries", range: "$100 – $200/month", notes: "Depends on city, cooking access, and personal routine" },
        { category: "Local transport", range: "$15 – $30/month", notes: "Metro, bus, and student-pass costs vary by city" },
        { category: "Phone & internet", range: "$10 – $20/month", notes: "" },
        { category: "Miscellaneous", range: "$50 – $100/month", notes: "Stationery, winter clothing, recreation, local setup" },
        { category: "Monthly total estimate", range: "$255 – $500/month", notes: "Planning range excluding tuition and one-time arrival costs" },
      ],
    },
    careerOpportunities: [
      "Plan the India-return pathway from day one by checking whether your university, medium of instruction, course duration, and internship structure stay aligned with current NMC requirements",
      "Clear the applicable Indian licensing route after graduation before treating the degree as an India-practice pathway",
      "Explore postgraduate training in Russia only after understanding language, residency-eligibility, and local licensing expectations",
      "Use the degree for other international licensing pathways only after checking the target country's separate examination and registration rules",
      "Consider research, academic, or healthcare-administration roles if your long-term path is broader than direct clinical practice in India",
    ],
  },
  vietnam: {
    quickFacts: [
      { label: "Capital", value: "Hanoi" },
      { label: "Official language", value: "Vietnamese" },
      { label: "Time zone", value: "UTC+7 (Indochina Time)" },
      { label: "Population", value: "~101 million" },
      { label: "Climate", value: "Tropical monsoon — warm year-round, wet season June–November" },
      { label: "Currency", value: "Vietnamese Dong (VND)" },
      { label: "Main intake", value: "Usually September" },
    ],
    eligibility: {
      intro:
        "For Indian students, the key check is not just admission in Vietnam but whether the full course remains usable for the India-return pathway under current NMC rules.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology with a minimum 50% aggregate in PCB",
        "Qualified NEET-UG before joining a foreign medical course if you want the India-return pathway to remain open",
        "Age 17 or above by the relevant admission year cut-off",
        "Valid passport and school documents in the format requested by the university",
      ],
    },
    admissionSteps: [
      "We assess your profile and shortlist Vietnamese universities based on WDOMS listing, NMC guideline compliance, clinical training hospital quality, and 6-year budget. Vietnam's universities vary significantly — we only present institutions with a documented track record for Indian students.",
      "We prepare your complete application documents: Class 10 and 12 marksheets with apostille, NEET scorecard, passport copy, photographs, and medical fitness certificate. Where the university requires Vietnamese translation of academic records, we arrange this as part of the process.",
      "We submit your application to the university's international office. Vietnam has no government quota pathway — all admissions go through the university directly. Admission letters are typically issued within 2–4 weeks of a complete application, and we review them before presenting to you.",
      "We guide you through the NMC Eligibility Certificate application at nmc.org.in after the admission letter is received. This is mandatory before departure.",
      "We prepare your Vietnamese student visa (DL visa) file for the Vietnamese Embassy. A DL student visa is required — an e-visa is not valid for a 6-year programme. We compile the admission letter, apostilled academic records, and medical certificate for submission.",
      "We brief you before departure on residence registration (required within the first week), university enrollment, and hostel check-in. We remain your point of contact through the first semester for any documentation or administrative issues.",
    ],
    documentsRequired: {
      educational: [
        "Passport copy",
        "Class 10 marksheet and certificate",
        "Class 12 marksheet and certificate with Physics, Chemistry, and Biology",
        "NEET-UG scorecard",
        "Passport-size photographs in the quantity requested",
        "Transfer, migration, or supporting school documents if requested",
      ],
      visa: [
        "Admission letter or enrollment confirmation from the university",
        "Valid passport",
        "Completed visa forms and photographs",
        "Financial or sponsorship proof if requested for your case",
        "Medical, insurance, or translated academic documents if requested by the university or visa process",
      ],
    },
    hostelInfo:
      "Most universities offer campus housing or nearby student accommodation. Room type, deposit, meals, and first-year allocation vary by university — we confirm the current tariff, sharing policy, kitchen access, and move-in timeline as part of the admissions package we present to families.",
    scholarshipInfo:
      "Scholarships and fee waivers in Vietnam are university-specific. We obtain written confirmation of any named scheme — current discount rules, eligibility criteria, and payment schedule — before it is factored into a family's cost plan.",
    costOfLiving: {
      intro:
        "Vietnam is often a lower-cost option than many other study-abroad destinations, but Hanoi and Ho Chi Minh City usually cost more than Can Tho or Da Nang.",
      items: [
        { category: "Hostel accommodation", range: "$80 – $180/month", notes: "Varies by city and room type" },
        { category: "Food & groceries", range: "$90 – $160/month", notes: "Depends on cooking access and routine" },
        { category: "Local transport", range: "$10 – $25/month", notes: "Bus, ride-hailing, or short local commutes" },
        { category: "Phone & internet", range: "$8 – $15/month", notes: "" },
        { category: "Miscellaneous", range: "$40 – $80/month", notes: "Personal setup and daily spending" },
        { category: "Monthly total estimate", range: "$228 – $460/month", notes: "Planning range excluding tuition and one-time arrival costs" },
      ],
    },
    careerOpportunities: [
      "Plan the India-return route first by checking current NMC requirements and the applicable licensing exam pathway after graduation",
      "Explore postgraduate options in India or elsewhere only after checking each country's separate eligibility and registration rules",
      "Treat local clinical or training opportunities in Vietnam as language- and licensing-dependent",
      "Consider research, academic, or healthcare-administration paths if your long-term plan is broader than direct clinical practice in India",
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
        "Minimum 50% aggregate in PCB subjects",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "We assess your profile and shortlist Georgian universities based on NMC guideline compliance, WDOMS listing, English-medium delivery, and 6-year cost. Georgia has 36+ private medical universities in Tbilisi alone — we present only institutions with a verified track record for Indian students and documented FMGE outcomes.",
      "We prepare your application documents: Class 10 and 12 marksheets, NEET scorecard, passport copy, and photographs. Georgia does not require apostille on Indian academic documents, which simplifies preparation compared to Russia and Kyrgyzstan.",
      "We submit your application through the university's official international admissions process. Most Georgian universities issue an admission letter within 1–3 weeks. Where the university conducts an entrance interview or English proficiency check, we prepare you in advance.",
      "We guide you through the NMC Eligibility Certificate application at nmc.org.in after the admission letter is received. This is mandatory before departure.",
      "We prepare your visa documentation. Indian nationals can enter Georgia visa-free for up to 365 days, but a student residence permit is required for the full 6-year programme. We coordinate with the university's international office on the residence permit conversion process through the Public Services Hall after arrival.",
      "We brief you before departure on Public Services Hall registration, hostel check-in, health insurance (where not provided by the university), and university enrollment. We support you through the first weeks in Georgia for any administrative follow-up.",
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
      "Many Georgian universities follow NMC guidelines, supporting the India-return pathway via FMGE/NExT",
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
        "Minimum 50% aggregate in PCB subjects",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "We assess your profile and shortlist Kyrgyz universities based on WDOMS listing, NMC guideline compliance, and 6-year budget. We advise on city — Bishkek has the largest Indian student community and the most developed FMGE coaching infrastructure; Osh is cheaper but has fewer options.",
      "We prepare your complete document set: Class 10 and 12 marksheets with apostille, NEET scorecard, passport copy, and photographs. Where the university requires notarised Russian or Kyrgyz translation of academic records, we arrange this as part of the process.",
      "We submit your application to the university's international department and track the invitation letter, typically issued within 1–3 weeks. Where the university requires an entrance examination in biology and chemistry, we prepare you in advance — these can usually be taken online.",
      "We guide you through the NMC Eligibility Certificate application at nmc.org.in after the invitation letter is received. This is mandatory before departure.",
      "We prepare your Kyrgyz student visa file for the Embassy in New Delhi or Mumbai: original invitation letter, apostilled academic records, medical certificate, and HIV test. Visa processing typically takes 5–10 working days and we track it through to grant.",
      "We brief you before departure on OVIR migration registration (required within 5 days of arrival, managed by the university), hostel check-in, medical insurance registration, and enrollment. Classes in Kyrgyzstan begin in September — we ensure your arrival timing and documentation are aligned.",
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
      "Some Kyrgyzstan universities offer merit-based fee reductions or partial scholarships for Indian students. The Kyrgyz Government offers a limited number of seats under bilateral agreements. We confirm current availability with the specific university and present only written, confirmed offers to families.",
    costOfLiving: {
      intro:
        "Bishkek is among the more affordable cities for Indian medical students. The lower cost of living is one of the primary reasons students choose Kyrgyzstan.",
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
  uzbekistan: {
    quickFacts: [
      { label: "Capital", value: "Tashkent" },
      { label: "Official language", value: "Uzbek" },
      { label: "Time zone", value: "UTC+5" },
      { label: "Population", value: "~37 million" },
      { label: "Climate", value: "Continental — hot summers, cold winters" },
      { label: "Currency", value: "Uzbekistani Som (UZS)" },
      { label: "Common intake", value: "Usually September; some universities also market February intake" },
      { label: "Regulatory context", value: "NMC alert dated 1 Apr 2026 urges extreme caution" },
    ],
    eligibility: {
      intro:
        "For Indian students, Uzbekistan is now a verification-first destination. Admission alone is not enough. You need the exact university and course structure to stay aligned with NMC's FMGL Regulations, 2021 if you want the India-return pathway to remain open.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology",
        "Minimum 50% aggregate in PCB subjects",
        "Qualified NEET-UG before the foreign medical course begins",
        "Age 17 or above by 31 December of the admission year",
        "Written proof that the full course keeps at least 54 months of study and a 12-month internship in the same foreign institution",
        "Written proof that the actual medium of instruction and clinical training remain compliant with FMGL 2021",
      ],
    },
    admissionSteps: [
      "We assess your profile and shortlist Uzbek universities with extra care — we verify the exact institution and branch name against NMC guideline compliance, not just the parent university brand. Several Uzbek universities have branch campuses whose compliance status differs from the main campus; we check current NMC alerts and Indian Embassy advisories before any university is presented to you.",
      "We confirm in writing that the course is delivered in a single institution, that clinical training is not split across locations, and that the 12-month internship is completed at the same foreign university — all NMC requirements. We do not proceed with an admission until these are documented.",
      "We prepare your application documents: Class 10 and 12 marksheets, NEET scorecard, passport copy, and photographs. Where notarised translation is required by the university, we arrange this before submission.",
      "We submit your application through the university's official process and obtain the written admission letter confirming the institution name, course structure, and full fee schedule — tuition and hostel stated separately. We do not present an offer until this is in writing.",
      "We guide you through the NMC Eligibility Certificate application at nmc.org.in after the admission letter is received. This is mandatory before departure.",
      "We prepare your Uzbek student visa file for the Embassy in New Delhi: admission letter, academic records, and medical certificate. Processing typically takes 5–10 working days and we track it through to grant.",
      "We brief you before departure on migration registration (required within 3 days of arrival), hostel check-in, and enrollment. We advise you to confirm the actual course structure and teaching schedule on arrival matches what was agreed in writing before making any further payments.",
    ],
    verificationChecklist: [
      "We confirm the exact institution and branch name against NMC guidelines — not just the parent university brand — before any fee is collected.",
      "Written confirmation that teaching, exams, and bedside clinical training run in English through all six years is obtained from the university before offer acceptance.",
      "Course duration, single-institution delivery of at least 54 months, and the 12-month internship structure are verified against current NMC requirements.",
      "We assess whether patient-facing clinical training depends on local language despite English-medium marketing — and flag this clearly to families before they decide.",
      "Every admission we process is cross-referenced against current NMC alerts and Indian Embassy advisories — not agent communications or student group posts.",
      "Any offshore, transfer-style, or split-campus arrangement is treated as a disqualifying flag until NMC compliance is proven in writing.",
    ],
    documentsRequired: {
      educational: [
        "Passport copy",
        "Class 10 marksheet and certificate",
        "Class 12 marksheet and certificate with Physics, Chemistry, and Biology",
        "NEET-UG scorecard",
        "Passport-size photographs in the quantity requested by the university",
        "Any notarized, apostilled, or legalized versions requested by the university",
        "Written university confirmation on course duration, internship, and medium of instruction",
      ],
      visa: [
        "Official offer letter or invitation from the university",
        "Valid passport",
        "Completed visa form and photographs",
        "Medical and insurance documents requested for the visa process",
        "Financial proof if requested for your case",
        "Copies of academic and identity documents supporting the admission",
      ],
    },
    hostelInfo:
      "Accommodation quality varies widely by city and institution in Uzbekistan. We confirm the current hostel tariff, room-sharing policy, kitchen access, and genuine first-year allocation before presenting an offer — and we never let hostel terms distract from the more important FMGL-compliance assessment.",
    scholarshipInfo:
      "Scholarships and fee discounts in Uzbekistan are secondary to the compliance question. We assess whether the full academic and licensing pathway is FMGL-compliant first. Where a scholarship is offered, we obtain the written net payable amount and confirm that the university, branch, and course structure are acceptable for the India-return pathway before the offer is presented to a family.",
    costOfLiving: {
      intro:
        "Uzbekistan can still look affordable in tuition-led comparisons, but families should now budget for verification work, contingency travel, and possible transfer risk if a course later turns out to be non-compliant.",
      items: [
        { category: "Hostel accommodation", range: "$50 – $120/month", notes: "Varies by city, branch, and room type" },
        { category: "Food & groceries", range: "$90 – $160/month", notes: "Depends on cooking access and Indian-food availability" },
        { category: "Local transport", range: "$10 – $25/month", notes: "Capital-city costs are usually higher" },
        { category: "Phone & internet", range: "$8 – $15/month", notes: "" },
        { category: "Miscellaneous", range: "$40 – $90/month", notes: "Daily setup, local documents, personal spending" },
        { category: "Monthly total estimate", range: "$198 – $410/month", notes: "Planning range excluding tuition and one-time arrival costs" },
      ],
    },
    careerOpportunities: [
      "For India-return plans, registration depends on full FMGL 2021 compliance, not just on holding a foreign medical degree.",
      "If the university, branch, or training pathway fails the FMGL conditions, the India-return route can collapse even after graduation.",
      "Students who still choose Uzbekistan should plan NExT or FMGE preparation from year one and keep a written record of course and internship structure.",
      "Any postgraduate or international licensing plan should be evaluated only after the base medical degree pathway is verified institution by institution.",
    ],
  },
};

export function getCountryContent(slug: string): CountryContent | null {
  return countryContentMap[slug] ?? null;
}
