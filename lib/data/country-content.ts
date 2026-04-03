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
        "Indian students planning MBBS in Russia should first clear the Indian-side eligibility checks and then verify the exact university-side admissions route, because Russian universities can use their own internal tests, interviews, and document formats for foreign applicants.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology as core subjects",
        "Minimum 50% aggregate in PCB (45% for eligible reserved-category candidates under the current Indian rule set)",
        "Qualified NEET-UG before taking MBBS admission abroad if you want the India-return pathway to remain open",
        "Age 17 or above by 31 December of the admission year",
        "Valid passport and school documents in the format accepted by the university",
      ],
    },
    admissionSteps: [
      "Shortlist Russian universities by official program page, current teaching medium, course duration, and whether the university is still accepting foreign applicants for your cycle.",
      "Check your NEET status, PCB marks, passport validity, and whether the university uses an internal exam or interview for foreign applicants.",
      "Prepare your passport and education documents, then confirm whether your marksheets need apostille or legalization and notarized Russian translation.",
      "Submit the application through the university admissions system or other official route accepted by that university.",
      "Take the university's entrance test or interview if required. If you are applying for the Russian Government quota, follow the Rossotrudnichestvo or Education in Russia process instead of the paid-seat route.",
      "Wait for the university's written admission decision, contract terms if applicable, and the official invitation needed for the study visa.",
      "Apply for the Russian student visa using the invitation and the embassy or visa-centre checklist for your city.",
      "After arrival, complete migration registration, local medical-insurance and medical-compliance formalities, and university enrollment steps before classes begin.",
    ],
    verificationChecklist: [
      "Ask for the exact 2026-2027 annual tuition, hostel charge, payment schedule, and refund rules in writing before paying any advance.",
      "Confirm whether the current MBBS pathway remains six years, what the teaching language is year by year, and whether clinical years require Russian communication.",
      "Check whether your Class 12 documents need apostille or consular legalization, and whether the university wants notarized Russian translations before or after arrival.",
      "Verify who issues the visa invitation, how long it usually takes, and what happens if the invitation arrives late in the cycle.",
      "Budget for post-arrival compliance too, not just tuition: migration registration, medical insurance, local medical exams, and other university onboarding costs can sit outside the first tuition invoice.",
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
      "Many Russian universities publish dormitory options for foreign students, but room type, tariff, deposit, and first-year allocation policy vary sharply by university. For admissions planning, ask for the current hostel tariff, whether utilities are included, whether a place is guaranteed for your intake, the kitchen and cooking setup, the move-in date, and the payment deadline linked to your admission letter.",
    scholarshipInfo:
      "The official Study in Russia portal says foreign students can apply under the quota of the Government of the Russian Federation, with competitive selection run through Rossotrudnichestvo or the Education in Russia system. Students admitted under the quota are entitled to a dormitory place and receive a state academic scholarship during full-time study funded from the federal budget. Outside the quota route, treat fee waivers or discounts as university-specific and request the written terms directly from the admissions office.",
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
        "Passed Class 12 with Physics, Chemistry, and Biology; check the university's own marks threshold before applying",
        "Qualified NEET-UG before joining a foreign medical course if you want the India-return pathway to remain open",
        "Age 17 or above by the relevant admission year cut-off",
        "Valid passport and school documents in the format requested by the university",
      ],
    },
    admissionSteps: [
      "Shortlist universities by teaching language, city, total cost, and whether the full course structure fits your India-return plans",
      "Check NEET status, passport validity, and the exact admissions checklist used by your chosen university",
      "Submit the application with academic documents and any university-specific forms",
      "Wait for the official offer letter and visa-support paperwork from the university",
      "Apply for the student visa using the latest embassy or university guidance for your intake",
      "After arrival, complete local registration, hostel formalities, and university enrollment before classes begin",
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
      "Most universities offer either campus housing or nearby student accommodation, but room type, deposit, meals, and first-year allocation vary by university. Ask for the current hostel tariff, sharing policy, kitchen access, and move-in timeline in writing before paying.",
    scholarshipInfo:
      "Treat scholarships and fee waivers in Vietnam as university-specific unless you have written confirmation of a named scheme. Ask the admissions office for the current discount rules, eligibility criteria, and payment schedule before treating a scholarship as part of your budget.",
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
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC candidates)",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and save your scorecard",
      "Evaluate Georgian universities that follow NMC guidelines",
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
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC)",
        "Cleared NEET-UG (mandatory)",
        "Age 17 or above at time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and save your scorecard",
      "Evaluate universities in Kyrgyzstan that follow NMC guidelines",
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
        "Minimum 50% aggregate in PCB (45% where the current Indian rule set allows it)",
        "Qualified NEET-UG before the foreign medical course begins",
        "Age 17 or above by 31 December of the admission year",
        "Written proof that the full course keeps at least 54 months of study and a 12-month internship in the same foreign institution",
        "Written proof that the actual medium of instruction and clinical training remain compliant with FMGL 2021",
      ],
    },
    admissionSteps: [
      "Read the latest NMC alert and FMGL 2021 requirements before shortlisting any Uzbekistan university or branch campus.",
      "Avoid agent-only recommendations. Contact the university directly and ask for the current English-medium curriculum, clinical training plan, and internship structure in writing.",
      "Check whether the exact institution or branch has been named in any NMC alert, Embassy communication, or other regulatory warning before paying any registration amount.",
      "Verify that the course is run in one institution, that clinical training is not split informally across locations, and that the internship is completed at the same foreign university.",
      "Prepare passport, Class 10 and 12 records, NEET scorecard, photographs, and any legalization or notarization required by the university.",
      "Apply only through the university's official process and wait for the written offer or invitation before making transfer plans.",
      "Cross-check the final admission letter, institution name, and course structure one more time with NMC and the Indian Embassy if anything looks unclear.",
      "Proceed to visa, travel, and post-arrival registration only after the FMGL pathway is documented clearly enough for your family to accept the risk.",
    ],
    verificationChecklist: [
      "Confirm the exact institution and branch name, not just the parent university brand, before paying any fee.",
      "Ask for written confirmation that teaching, exams, and bedside clinical training actually run in English, not only the brochure or first-year classes.",
      "Verify that the course runs for at least 54 months in one institution and includes a 12-month internship in the same foreign university.",
      "Check whether the university's actual patient-facing training depends heavily on Uzbek or Russian communication despite English-medium marketing.",
      "Use NMC alerts, the Indian Embassy in Tashkent, and direct university documents together; do not rely on agents or informal student groups alone.",
      "Treat any offshore, transfer-style, or split-campus arrangement as a red-flag item until NMC compliance is proven in writing.",
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
      "Accommodation quality varies widely by city and institution. Ask for the current hostel tariff, room-sharing pattern, kitchen access, and whether first-year housing is genuinely guaranteed. For Uzbekistan specifically, do not let hostel promises distract from the larger FMGL-compliance questions.",
    scholarshipInfo:
      "Treat scholarships and fee discounts as secondary. The higher-value question is whether the full academic and licensing pathway is compliant. If a scholarship is offered, ask for the written net payable amount and confirm that the university, branch, and course structure remain acceptable for your India-return plan.",
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
