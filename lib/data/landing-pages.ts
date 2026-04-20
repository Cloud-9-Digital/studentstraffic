import type { LandingPage } from "@/lib/data/types";

export const landingPages: LandingPage[] = [
  {
    slug: "mbbs-in-russia",
    courseSlug: "mbbs",
    countrySlug: "russia",
    title: "MBBS in Russia",
    kicker: "Established public medical universities",
    summary:
      "Compare public Russian medical universities, hostel-backed campuses, and fee bands to plan a confident MBBS pathway.",
    heroHighlights: [
      "Public university options",
      "Strong university legacy",
      "NMC-focused planning",
      "Hostel-backed campus planning",
    ],
    reasonsToChoose: [
      "Broad range of public universities for different budgets",
      "Long-standing Indian student familiarity and medical brand recognition",
      "Useful when families want structured, legacy-heavy options",
    ],
    featuredUniversitySlugs: [
      "altai-state-medical-university",
      "astrakhan-state-medical-university",
      "bashkir-state-medical-university",
      "kazan-state-medical-university",
      "privolzhsky-research-medical-university",
    ],
    faq: [
      {
        question: "Is MBBS in Russia valid in India?",
        answer:
          "Yes — graduates from NMC-compliant Russian universities can sit the FMGE/NExT screening exam to obtain an NMC licence and practise medicine in India. Recognition is university-specific, not country-wide, so always verify your chosen university's status on the official NMC website before enrolling.",
      },
      {
        question: "Is MBBS in Russia affordable for Indian students?",
        answer:
          "Russia offers one of the widest fee spreads among MBBS destinations — annual tuition ranges from $3,500 to $9,000 depending on the university and city. When you add hostel ($80–150/month) and living costs ($200–400/month), the total 6-year budget typically falls between ₹30 lakh and ₹65 lakh, making it significantly cheaper than Indian private medical colleges.",
      },
      {
        question: "Is NEET required for MBBS in Russia?",
        answer:
          "Yes — NEET-UG is mandatory for Indian students who plan to practise medicine in India after graduating abroad. You must have a valid NEET-UG scorecard before your MBBS program begins. Russian universities do not conduct their own entrance exams for Indian applicants.",
      },
      {
        question: "How long is the MBBS program in Russia?",
        answer:
          "The standard program is 6 years including a clinical internship year. The first two years cover pre-clinical subjects, years three and four move into para-clinical work, and years five and six are primarily clinical rotations in affiliated hospitals.",
      },
      {
        question: "What language is MBBS taught in at Russian universities?",
        answer:
          "Classroom instruction and theory exams are conducted in English at all major universities that enrol Indian students. Russian language is taught as a compulsory subject in years one through three because it is needed for patient interaction during clinical postings. Most Indian students reach basic conversational Russian by year three.",
      },
      {
        question: "How cold is Russia — can Indian students manage the winters?",
        answer:
          "Temperatures in cities like Kazan, Orenburg, and Volgograd can drop to -20°C or below in January and February. However, university buildings, hostels, and public transport are centrally heated. Most Indian students adapt within the first winter once they invest in proper thermal gear. Summer months (May–August) are mild and pleasant.",
      },
      {
        question: "Are there Indian food options in Russian cities?",
        answer:
          "Yes — cities with large Indian student populations like Kazan, Volgograd, Orenburg, and Astrakhan have established Indian mess facilities, either run by university hostels or by student cooperatives. Most Indian students cook at home using Indian groceries available at local markets and Indian stores.",
      },
      {
        question: "What is FMGE and when must Russian MBBS graduates clear it?",
        answer:
          "FMGE (Foreign Medical Graduates Examination), now being replaced by NExT, is the screening test Indian students must pass after completing MBBS abroad to obtain an NMC licence. You must clear it before you can practise medicine, pursue postgraduate studies, or register with any State Medical Council in India. Preparation should start from year one — strong clinical grounding in Russia significantly helps pass rates.",
      },
      {
        question: "Should students choose a Russian university only by rankings?",
        answer:
          "No — rankings are a poor filter for MBBS decisions. What matters more is NMC compliance, English-medium delivery quality, hospital affiliation for clinical training, Indian student support infrastructure, hostel availability, city livability, and total cost over 6 years. Evaluate these factors with your specific budget and NExT preparation strategy in mind.",
      },
    ],
    metaTitle: "MBBS in Russia 2026 | Fees, Universities, Eligibility",
    metaDescription:
      "Explore MBBS in Russia with admission-ready university data, fee bands, hostel filters, and a lead capture flow built for Indian applicants.",
    atAGlance: [
      { label: "Program", value: "MBBS (6-year MD-equivalent)" },
      { label: "Annual tuition", value: "$3,500 – $9,000" },
      { label: "Living costs", value: "$2,400 – $4,800/year" },
      { label: "Total 6-year cost", value: "$35,000 – $80,000 approx." },
      { label: "Intake", value: "September" },
      { label: "Medium", value: "English (with Russian language classes)" },
      { label: "NEET required", value: "Yes" },
      { label: "Recognition", value: "NMC, WHO, WFME, FAIMER (university-specific)" },
    ],
    eligibility: {
      intro:
        "Indian students applying for MBBS in Russia must meet the criteria set by the National Medical Commission (NMC) for overseas medical education.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology as core subjects",
        "Minimum 50% aggregate in PCB (45% for SC/ST/OBC candidates)",
        "Cleared NEET-UG (mandatory since 2018)",
        "Age 17 or above at the time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Clear NEET-UG and obtain your scorecard",
      "Research and evaluate universities in Russia that follow NMC guidelines",
      "Submit your application online with required documents",
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
        "Completed Russian visa application form",
        "Medical fitness certificate including HIV test result",
        "Bank statement showing sufficient funds",
        "Travel insurance documents",
        "Notarised copies of academic certificates",
      ],
    },
    syllabusPhases: [
      {
        phase: "Pre-clinical (Years 1–2)",
        years: "Year 1 – Year 2",
        highlights: [
          "Anatomy",
          "Physiology",
          "Biochemistry",
          "Medical Physics",
          "Medical Chemistry",
          "Russian language",
        ],
      },
      {
        phase: "Para-clinical (Years 3–4)",
        years: "Year 3 – Year 4",
        highlights: [
          "Pathology",
          "Pharmacology",
          "Microbiology",
          "Internal Medicine",
          "Surgery",
          "Obstetrics & Gynaecology (intro)",
        ],
      },
      {
        phase: "Clinical (Years 5–6)",
        years: "Year 5 – Year 6",
        highlights: [
          "Paediatrics",
          "ENT",
          "Ophthalmology",
          "Psychiatry",
          "Community Medicine",
          "Hospital internship",
        ],
      },
    ],
    indiaComparison: [
      { criterion: "Annual tuition", india: "₹10–25 lakh (private colleges)", abroad: "$3,500–$9,000" },
      { criterion: "NEET requirement", india: "Yes — mandatory", abroad: "Yes — mandatory" },
      { criterion: "Program duration", india: "5.5 years + 1 year internship", abroad: "6 years (incl. internship)" },
      { criterion: "Medium", india: "English", abroad: "English (with Russian support)" },
      { criterion: "Seat availability", india: "Very limited — high cutoffs", abroad: "No seat cap for international students" },
      { criterion: "Recognition", india: "NMC direct", abroad: "NMC — requires FMGE/NExT to practise in India" },
      { criterion: "Return pathway", india: "Direct MCI/NMC licence", abroad: "Must clear FMGE/NExT first" },
    ],
    hostelInfo:
      "Most Russian medical universities provide dedicated hostel accommodation for international students in separate blocks close to campus. Indian student communities in cities like Kazan, Volgograd, and Orenburg have established Indian mess facilities. Monthly hostel costs range from $80–150/month including utilities. Private housing is available in most cities for students who prefer independent arrangements after the first year.",
    scholarshipInfo:
      "The Russian Government offers limited fully or partially funded seats each year through Rossotrudnichestvo (the Russian Agency for International Cooperation). Some universities also offer merit-based tuition reductions of 10–20% for academically strong students. Scholarship availability changes each academic cycle — verify through the official Rossotrudnichestvo portal or the Russian Embassy in India well before the September intake deadline.",
    careerOpportunities: [
      "Clear FMGE/NExT to obtain NMC registration and practise medicine in India",
      "Apply for postgraduate MD/MS or DNB programmes in India with a valid FMGE/NExT score",
      "Continue clinical specialisation through MD residency programmes at Russian universities",
      "Explore international licensing pathways in the UK (PLAB), Middle East, or Canada with a Russia-issued degree",
      "Join academic or clinical research roles at Indian or international medical institutions",
    ],
    intakeTimeline: [
      { milestone: "Application Opens", timeline: "June 1st", details: "Initial documents (10th/12th marksheets) submitted for review." },
      { milestone: "Admission Letter", timeline: "Late June – Mid July", details: "University issues the official acceptance letter." },
      { milestone: "Invitation & Visa", timeline: "August", details: "Ministry issues the official invitation; visa stamping takes 2 weeks." },
      { milestone: "Departure & Classes", timeline: "September – October", details: "Pre-departure briefings and flights to Russia for registration." },
    ],
    livingCostBreakdown: [
      { item: "Accommodation (Hostel)", cost: "$30 – $80 / month" },
      { item: "Food & Groceries", cost: "$100 – $150 / month" },
      { item: "Transport", cost: "$10 – $20 / month" },
      { item: "Miscellaneous", cost: "$30 – $50 / month" },
    ],
    challenges: [
      {
        title: "Harsh Winter Climate",
        realityCheck: "Temperatures can drop well below -20°C. However, universities, hostels, and public transport are centrally heated, so students only face the cold during brief transit.",
      },
      {
        title: "Language Barrier outside Campus",
        realityCheck: "While academics are in English, interacting with local patients or shopping requires basic Russian. Universities make Russian language classes mandatory in the first three years.",
      },
    ],
  },
  {
    slug: "mbbs-in-vietnam",
    courseSlug: "mbbs",
    countrySlug: "vietnam",
    title: "MBBS in Vietnam",
    kicker: "Follows NMC guidelines · English-medium · Affordable fees",
    summary:
      "MBBS in Vietnam is a strong option for Indian students who want a lower-cost, English-medium, closer-to-home alternative to private MBBS in India or colder destinations like Russia. The right university can offer workable fees, growing Indian student support, and a credible India-return pathway, and our team helps you choose and secure the right option instead of leaving you to figure it out alone.",
    heroHighlights: [
      "Fees from $2,833/year",
      "Follows NMC guidelines",
      "English-medium programs",
      "3–5 hour flight from India",
      "Hostel and Indian food support",
      "September intake",
    ],
    reasonsToChoose: [
      "Significantly lower fees than Indian private medical colleges — total 6-year costs can be ₹15–45 lakh all-in, well below comparable programs in Russia or Eastern Europe.",
      "Multiple universities follow NMC guidelines — graduates can sit FMGE/NExT to practise medicine in India.",
      "Vietnam is geographically close to India (3–5 hour flights), making semester breaks, emergency travel, and family visits far easier than European or Central Asian destinations.",
      "English is the primary teaching language in international MBBS programs, eliminating the language barrier that affects clinical years in Russia, China, or Kazakhstan.",
      "A rapidly growing Indian student community across Can Tho, Da Nang, Hanoi, and Ho Chi Minh City means established Indian food, cultural support, and peer networks from day one.",
      "Diverse city choices — from the coastal lifestyle of Da Nang to the Mekong Delta calm of Can Tho — let students match their personality and lifestyle preferences.",
    ],
    featuredUniversitySlugs: [
      "dong-a-university-college-of-medicine",
      "can-tho-university-medicine-pharmacy",
      "dai-nam-university-faculty-of-medicine",
      "nam-can-tho-university-faculty-of-medicine",
      "phan-chau-trinh-university",
      "buon-ma-thuot-medical-university",
      "vo-truong-toan-university",
      "hong-bang-international-university-medicine",
    ],
    faq: [
      {
        question: "Is MBBS in Vietnam valid in India?",
        answer:
          "NMC does not approve or recognise universities — it publishes guidelines under the 2022 NMC Screening Test Regulations. If a student studies at a university that follows these guidelines, their degree is valid in India and they can sit the FMGE/NExT screening test to obtain a licence to practise. Compliance is specific to each university, not the country. Always check the individual university's status on the official NMC website before enrolling.",
      },
      {
        question: "What are the total fees for MBBS in Vietnam?",
        answer:
          "Annual tuition ranges from approximately $2,833/year at public universities like Thai Binh University to around $8,000/year at premium private institutions like Duy Tan, while Hong Bang is $6,000/year. Adding hostel ($1,000–$2,000/year) and living costs ($1,600–$3,000/year), the total 6-year cost typically falls between ₹15 lakh and ₹45 lakh — significantly below Indian private medical college fees.",
      },
      {
        question: "Is NEET required for MBBS in Vietnam?",
        answer:
          "Vietnam universities do not require NEET for admission. However, if you plan to practise medicine in India after graduation, you must have a valid NEET-UG scorecard before your MBBS program begins — this is an NMC requirement, not a university one. Students who skipped NEET and later want to return to India are disqualified from the FMGE/NExT pathway.",
      },
      {
        question: "Is the medium of instruction English in Vietnam MBBS?",
        answer:
          "Yes — all international MBBS programs in Vietnam are taught in English for classroom and theory components. In clinical years (typically years 3–6), basic Vietnamese language exposure becomes helpful for patient interaction. Universities provide language support, and most Indian students adapt within the first year.",
      },
      {
        question: "How does Vietnam compare to Russia for MBBS?",
        answer:
          "Vietnam offers closer geography (3–5 hour flights vs. 8–10 hours to Russia), warmer climate, English-medium teaching without a mandatory Russian language requirement, and comparable or lower fees. The trade-off is that Vietnam's track record for India-return FMGE/NExT outcomes is shorter than Russia's — making university-level due diligence more critical. For families where proximity and climate matter, Vietnam is often the stronger choice.",
      },
      {
        question: "Which are the best Vietnam universities for Indian students?",
        answer:
          "Can Tho University of Medicine and Pharmacy (public, WHO and FAIMER listed), Hue University of Medicine and Pharmacy, and Duy Tan University are among the well-established options. Thai Binh University and Nam Can Tho University are more affordable alternatives. Always verify the specific university's NMC compliance status before enrolling — do not rely on general country-level claims.",
      },
      {
        question: "What intake months are available for MBBS in Vietnam?",
        answer:
          "All Vietnam universities offering MBBS to international students admit students in September. Applications typically open January–June for the September intake. Students should apply at least 3–4 months before intake to allow time for documentation, visa processing, and accommodation.",
      },
      {
        question: "Is Vietnam safe for Indian students — especially female students?",
        answer:
          "Vietnam is consistently rated among the safer countries in Southeast Asia. Cities like Can Tho, Da Nang, and Hue have established Indian student communities with hostel facilities. Female Indian students at universities like Can Tho University, Phan Chau Trinh, and Duy Tan report feeling safe on and around campus. Standard precautions — travelling in groups at night, staying in university hostels initially — apply as they would anywhere abroad.",
      },
      {
        question: "Can I visit home during semester breaks from Vietnam?",
        answer:
          "Yes — Vietnam's proximity to India (3–5 hour direct flights to major Indian cities) makes it one of the most home-accessible MBBS destinations. Return tickets during semester breaks typically cost ₹15,000–₹30,000, which is significantly cheaper than flying back from Russia, Kazakhstan, or Eastern Europe.",
      },
    ],
    metaTitle: "MBBS in Vietnam 2026 | Universities, Fees & Admissions for Indian Students",
    metaDescription:
      "Compare MBBS in Vietnam for Indian students with updated fees, top universities, eligibility, hostel details, English-medium options, and the India-return pathway.",
    atAGlance: [
      { label: "Program", value: "MBBS (6-year international MD program)" },
      { label: "Annual tuition", value: "$2,833 – $8,000" },
      { label: "Living costs", value: "$2,400 – $4,800 per year" },
      { label: "Total 6-year cost", value: "Roughly ₹15 lakh – ₹45 lakh all-in" },
      { label: "Intake", value: "September" },
      { label: "Medium", value: "English (with Vietnamese clinical orientation)" },
      { label: "NEET required", value: "Not for admission — required before program start if practising in India" },
      { label: "Recognition", value: "WDOMS / WHO listing and India-return fit are university-specific" },
    ],
    eligibility: {
      intro:
        "Indian students applying for MBBS in Vietnam must meet the standard NMC requirements for overseas medical education, as confirmed in the 2022 NMC Screening Test Regulations.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology as core subjects",
        "Usually 50% to 60% aggregate in PCB depending on the university; stronger options may expect better academic consistency",
        "NEET-UG not required for admission — but must have qualified NEET-UG before the program starts if you intend to practise medicine in India after graduation",
        "Age 17 or above at the time of admission",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "If you plan to practise in India, ensure you have a valid NEET-UG score before your MBBS program begins",
      "Check that your chosen Vietnam university fits current NMC expectations for the India-return pathway before you pay any fees",
      "Submit your application with required documents to the university or an authorised representative",
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
        "Completed Vietnam visa application form",
        "Medical certificate including HIV test result",
        "Bank statement or sponsorship letter",
        "Travel insurance proof",
        "Academic documents (copies in English)",
      ],
    },
    syllabusPhases: [
      {
        phase: "Pre-clinical (Years 1–2)",
        years: "Year 1 – Year 2",
        highlights: [
          "Anatomy",
          "Physiology",
          "Biochemistry",
          "Medical Biochemistry",
          "Vietnamese language orientation",
          "Biophysics",
        ],
      },
      {
        phase: "Para-clinical (Years 3–4)",
        years: "Year 3 – Year 4",
        highlights: [
          "Pathology",
          "Pharmacology",
          "Microbiology",
          "Internal Medicine",
          "Surgery",
          "Obstetrics & Gynaecology",
        ],
      },
      {
        phase: "Clinical (Years 5–6)",
        years: "Year 5 – Year 6",
        highlights: [
          "Paediatrics",
          "ENT",
          "Ophthalmology",
          "Community Medicine",
          "Psychiatry",
          "Hospital internship",
        ],
      },
    ],
    indiaComparison: [
      { criterion: "Annual tuition", india: "₹10–25 lakh (private colleges)", abroad: "$2,833–$8,000" },
      { criterion: "NEET requirement", india: "Yes — mandatory", abroad: "Yes — mandatory" },
      { criterion: "Program duration", india: "5.5 years (incl. 1 year internship)", abroad: "6 years (incl. internship)" },
      { criterion: "Medium", india: "English", abroad: "English (with Vietnamese clinical orientation)" },
      { criterion: "Distance from India", india: "—", abroad: "3–5 hour flight" },
      { criterion: "Seat availability", india: "Very limited — high cutoffs", abroad: "No seat cap for international students" },
      { criterion: "Return pathway", india: "Direct NMC licence", abroad: "Must clear FMGE/NExT to practise in India" },
    ],
    hostelInfo:
      "Vietnam universities typically provide on-campus or adjacent hostel accommodation for international students with monthly costs from $80–180/month. Universities in Can Tho, Da Nang, Hanoi, and Ho Chi Minh City have Indian student communities with dedicated Indian food options. Phan Chau Trinh University and Duy Tan University both offer modern student residential facilities. Private housing in larger cities is affordable and gives students more independence after the first year.",
    scholarshipInfo:
      "Vietnam does not have a large-scale government scholarship programme specifically for Indian MBBS students. Public universities like Can Tho University of Medicine and Pharmacy occasionally offer partial fee waivers on a case-by-case basis for strong applicants. Bilateral education agreements between India and Vietnam cover a small number of sponsored seats annually — verify current availability with the Vietnamese Embassy in India or the university's international admissions team before applying.",
    careerOpportunities: [
      "Clear FMGE/NExT to obtain NMC registration and practise in India — several Vietnam universities are NMC-recognised for this pathway",
      "Apply for postgraduate DNB or MD/MS programmes in India with a valid FMGE/NExT score",
      "Explore PG clinical specialisation in Vietnam or nearby Southeast Asian medical institutions",
      "Vietnam's location gives graduates proximity to Singapore, Malaysia, and other regional medical markets",
      "Academic or research roles at Vietnamese medical universities or WHO-affiliated health institutions",
    ],
  },
  {
    slug: "medical-pg-in-vietnam",
    courseSlug: "medical-pg",
    countrySlug: "vietnam",
    title: "Medical PG / Residency in Vietnam",
    kicker: "Clinical postgraduate pathways for qualified doctors",
    summary:
      "Vietnam now offers a small but meaningful set of medical PG pathways for qualified doctors, ranging from VNU-UMP's English-language master's launch for foreign doctors to Vietnamese-medium residency, specialist, and master's routes at long-established public medical universities.",
    heroHighlights: [
      "English master's option at VNU-UMP",
      "Residency and specialist doctor tracks",
      "Public-university hospital ecosystems",
      "Best suited to already-qualified doctors",
    ],
    reasonsToChoose: [
      "VNU-UMP now provides the clearest officially announced English-language clinical master's entry point in Vietnam for foreign doctors, including Indian applicants.",
      "Established public universities in Hanoi, Hue, Thai Nguyen, and Ho Chi Minh City continue to run master's, specialist, and residency-style clinical training with real hospital depth.",
      "Vietnam's major referral-hospital ecosystems make this route attractive for doctors prioritizing specialist exposure over generic study-abroad branding.",
    ],
    featuredUniversitySlugs: [
      "vnu-university-of-medicine-and-pharmacy-hanoi",
      "hanoi-medical-university",
      "hue-university-medicine-pharmacy",
      "thai-nguyen-university-medicine-pharmacy",
      "pham-ngoc-thach-university-medicine",
    ],
    faq: [
      {
        question: "Is medical PG in Vietnam meant for MBBS applicants?",
        answer:
          "No. This route is for already-qualified doctors comparing master's, specialist, or residency-style clinical training after their primary medical degree.",
      },
      {
        question: "Which Vietnam university currently has the clearest English-language option for Indian doctors?",
        answer:
          "The clearest officially announced English-language clinical PG option currently visible is VNU-UMP's master's pathway for foreign doctors. Other strong Vietnam PG options exist, but many remain primarily Vietnamese-medium at the clinical level.",
      },
      {
        question: "Are all Vietnam medical PG programs taught in English?",
        answer:
          "No. The strongest English-language signal currently comes from VNU-UMP's international master's announcement. Many other PG pathways in Vietnam are still best approached as Vietnamese-medium clinical training.",
      },
      {
        question: "What should doctors verify before choosing a Vietnam PG pathway?",
        answer:
          "Verify the exact specialty, admissions cycle, hospital training language, current fee notice, and whether the program matches your long-term specialist registration or licensing plans in your target country.",
      },
    ],
    metaTitle: "Medical PG / Residency in Vietnam 2026 | Universities, Language & Admissions",
    metaDescription:
      "Explore medical PG and residency-style pathways in Vietnam for qualified doctors, including VNU-UMP's English master's route and public-university specialist training options.",
  },
  {
    slug: "mbbs-in-georgia",
    courseSlug: "mbbs",
    countrySlug: "georgia",
    title: "MBBS in Georgia",
    kicker: "English-medium urban medical programs",
    summary:
      "Evaluate English-medium MBBS options in Georgia with city-based campuses, cleaner admissions comparisons, and modern student support.",
    heroHighlights: [
      "English-medium programs",
      "Urban campus lifestyle",
      "Compact admissions planning",
      "International student orientation",
    ],
    reasonsToChoose: [
      "Strong option for students who want English-medium delivery from day one",
      "Useful for families who value city safety and daily convenience",
      "Often chosen by students prioritizing urban living over ultra-low fees",
    ],
    featuredUniversitySlugs: [
      "alte-university",
      "bau-international-university-batumi",
      "caucasus-international-university",
      "east-european-university",
      "georgian-national-university-seu",
    ],
    faq: [
      {
        question: "Is MBBS in Georgia valid in India?",
        answer:
          "Yes — graduates from NMC-compliant Georgian universities can sit FMGE/NExT to practise medicine in India. Georgia has several universities that follow NMC guidelines, but compliance is university-specific. Always verify the exact university on the official NMC portal before paying any fees.",
      },
      {
        question: "Is Georgia a good MBBS destination for English-medium study?",
        answer:
          "Yes — Georgia is one of the few destinations where English is the actual medium of instruction from year one, not just a marketing claim. Tbilisi-based universities in particular have well-established English-medium MBBS programs with international faculty and structured clinical rotations.",
      },
      {
        question: "What is the fee range for MBBS in Georgia?",
        answer:
          "Annual tuition at Georgian medical universities typically ranges from $4,000 to $8,000 depending on the institution. Living costs in Tbilisi run $300–500/month including accommodation, food, and transport. The total 6-year cost is generally ₹35–60 lakh — higher than Kyrgyzstan or Uzbekistan but lower than Indian private medical colleges.",
      },
      {
        question: "Is NEET required for MBBS in Georgia?",
        answer:
          "Georgian universities do not require NEET for admission. However, Indian students who intend to practise in India must have a valid NEET-UG scorecard before their MBBS program begins — an NMC rule that applies regardless of where you study. Skipping NEET blocks the FMGE/NExT pathway to Indian registration.",
      },
      {
        question: "How long does the Georgia student visa take?",
        answer:
          "The Georgian E-Visa for Indian students is typically processed in 5–10 working days. However, the Ministry of Education's EQE accreditation process (required before the visa) takes 3–4 weeks. Students should begin the application process by May to comfortably meet the September intake.",
      },
      {
        question: "Is Tbilisi safe for Indian students?",
        answer:
          "Tbilisi is generally considered safe for international students. The city has a growing Indian student community, active student associations, and Indian restaurants. Female students report feeling safe in the main university areas. Standard precautions apply — travel in groups at night, stay in university-recommended accommodation initially.",
      },
      {
        question: "What matters most when choosing an MBBS university in Georgia?",
        answer:
          "NMC compliance, actual medium of instruction (not just stated), hospital affiliation quality for clinical years, hostel availability, the size of the Indian student community, and fee transparency matter more than brochure rankings or marketing claims. Georgia's smaller universities vary significantly in quality, so choosing two or three carefully evaluated options is better than applying broadly.",
      },
    ],
    metaTitle: "MBBS in Georgia 2026 | Fees, Universities, English Medium",
    metaDescription:
      "Compare MBBS in Georgia options by university, fee, hostel, and support quality with a high-intent landing page built for Indian students.",
    intakeTimeline: [
      { milestone: "Application Opens", timeline: "May - June", details: "Submit academic documents and passport." },
      { milestone: "Interview & Offer", timeline: "July", details: "Skype interview (basic English check) followed by offer letter." },
      { milestone: "EQE Accreditation", timeline: "August", details: "Ministry of Education (EQE) approval process (takes 3-4 weeks)." },
      { milestone: "Visa & Departure", timeline: "September", details: "E-Visa processing and flights to Tbilisi or Batumi." },
    ],
    livingCostBreakdown: [
      { item: "Accommodation (Private/Hostel)", cost: "$150 – $250 / month" },
      { item: "Food & Groceries", cost: "$120 – $180 / month" },
      { item: "Transport & Utilities", cost: "$20 – $40 / month" },
      { item: "Miscellaneous", cost: "$50 – $80 / month" },
    ],
    challenges: [
      {
        title: "Higher Living Costs",
        realityCheck: "Georgia is significantly more expensive to live in compared to Russia or Kyrgyzstan, particularly in Tbilisi where private accommodation is standard.",
      },
      {
        title: "Stringent Visa Process",
        realityCheck: "The EQE approval and Visa process can be strict and time-consuming. Documentation must be impeccable.",
      },
    ],
  },
  {
    slug: "mbbs-in-kyrgyzstan",
    courseSlug: "mbbs",
    countrySlug: "kyrgyzstan",
    title: "MBBS in Kyrgyzstan",
    kicker: "Budget-led medical admissions",
    summary:
      "Explore affordable MBBS options in Kyrgyzstan with fee-sensitive comparisons, hostel filters, and fast admissions discovery.",
    heroHighlights: [
      "Lower annual fee bands",
      "Hostel-backed affordability",
      "Strong budget comparison use case",
      "Fast admissions planning",
    ],
    reasonsToChoose: [
      "One of the clearest destinations for affordability-driven MBBS planning",
      "Helps students compare lower-fee options without losing hostel visibility",
      "Best for families where total cost is the main decision driver",
    ],
    featuredUniversitySlugs: [
      "adam-university",
      "asian-medical-institute",
      "international-higher-school-of-medicine",
      "international-school-of-medicine",
      "osh-state-university",
    ],
    faq: [
      {
        question: "Is MBBS in Kyrgyzstan valid in India?",
        answer:
          "Yes — graduates from NMC-compliant Kyrgyzstan universities can sit FMGE/NExT to practise in India. Recognition is university-specific, not country-wide. Some low-fee universities in Kyrgyzstan do not meet NMC guidelines — always verify on the NMC portal before enrolling.",
      },
      {
        question: "Why is Kyrgyzstan often chosen for MBBS?",
        answer:
          "Kyrgyzstan offers some of the lowest fee bands among NMC-compliant MBBS destinations. Annual tuition at established universities like Osh State University or International School of Medicine starts from $2,500–$3,500, with hostel costs as low as $30–50/month. For families where total cost is the primary constraint, Kyrgyzstan is a serious option when paired with careful university selection.",
      },
      {
        question: "What is the total cost of MBBS in Kyrgyzstan?",
        answer:
          "Annual tuition ranges from $2,500 to $4,500 depending on the university. Hostel costs are $30–50/month and living expenses $100–150/month. Total 6-year all-in cost typically falls between ₹20–35 lakh — making it one of the most affordable full-degree MBBS pathways for Indian students.",
      },
      {
        question: "Is NEET required for MBBS in Kyrgyzstan?",
        answer:
          "Kyrgyzstan universities do not require NEET for admission. However, Indian students who plan to practise in India must have a valid NEET-UG scorecard before the MBBS program begins — this is an NMC requirement regardless of destination. Students who skip NEET cannot sit FMGE/NExT later.",
      },
      {
        question: "What language is MBBS taught in at Kyrgyzstan universities?",
        answer:
          "The established universities that enrol Indian students — such as ISM, IHSM, and Asian Medical Institute — deliver theory classes in English. Russian or Kyrgyz language classes are added in early years for patient interaction during hospital rotations. Students generally reach functional communication in Russian by year three.",
      },
      {
        question: "What are FMGE pass rates like for Kyrgyzstan graduates?",
        answer:
          "Pass rates vary significantly by university. Top-tier institutions like International School of Medicine (ISM) and Osh State University have better outcomes than lower-ranked, lower-cost alternatives. Choosing purely on fees without checking historical FMGE performance is one of the most common and costly mistakes Indian families make when considering Kyrgyzstan.",
      },
      {
        question: "Should students choose only by the lowest fee?",
        answer:
          "No. The better choice balances affordability with NMC recognition, hospital affiliation quality for clinical years, hostel infrastructure, city support, and documented FMGE pass rates. A university that costs $500/year less but has poor clinical training and low pass rates is a worse investment than one that costs slightly more with strong outcomes.",
      },
    ],
    metaTitle: "MBBS in Kyrgyzstan 2026 | Affordable Universities & Fees",
    metaDescription:
      "Find affordable MBBS in Kyrgyzstan with country-level content, filter-ready university data, and strong lead capture support.",
    intakeTimeline: [
      { milestone: "Application Opens", timeline: "June", details: "Submit 10th and 12th marksheets." },
      { milestone: "Admission Letter", timeline: "July", details: "University issues the official admission letter." },
      { milestone: "Invitation & Visa", timeline: "August", details: "E-Visa processing is generally very fast." },
      { milestone: "Departure & Classes", timeline: "September / October", details: "Flights to Bishkek." },
    ],
    livingCostBreakdown: [
      { item: "Accommodation (Hostel)", cost: "$30 – $50 / month" },
      { item: "Food & Groceries", cost: "$80 – $120 / month" },
      { item: "Transport", cost: "$10 – $15 / month" },
      { item: "Miscellaneous", cost: "$20 – $40 / month" },
    ],
    challenges: [
      {
        title: "MCI/FMGE Passing Rates",
        realityCheck: "Certain low-budget universities have historically lower FMGE pass rates. It's critical to select the top-tier institutions.",
      },
      {
        title: "Infrastructure",
        realityCheck: "While improving rapidly, the infrastructure in some budget colleges may not match the massive state universities of Russia.",
      },
    ],
  },
  {
    slug: "mbbs-in-uzbekistan",
    courseSlug: "mbbs",
    countrySlug: "uzbekistan",
    title: "MBBS in Uzbekistan",
    kicker: "High-caution destination after NMC alert",
    summary:
      "Uzbekistan may look affordable, but NMC's 1 April 2026 alert says Indian students should exercise extreme caution and verify FMGL 2021 compliance university by university before paying any fee.",
    heroHighlights: [
      "NMC alert dated 1 Apr 2026",
      "FMGL 2021 compliance must be verified",
      "Agent-led admissions carry added risk",
      "Institution quality varies sharply",
    ],
    reasonsToChoose: [
      "Published fee bands can still be lower than many older MBBS destinations.",
      "Some universities market English-medium pathways and shorter travel from India.",
      "Families still considering Uzbekistan should treat affordability as secondary to compliance and clinical-training verification.",
    ],
    featuredUniversitySlugs: [
      "andijan-state-medical-institute",
      "bukhara-state-medical-institute-abu-ali-ibn-sino",
      "central-asian-university-medical-school",
    ],
    faq: [
      {
        question: "Is MBBS in Uzbekistan valid in India?",
        answer:
          "Not automatically. NMC's alert dated 1 April 2026 tells Indian students to exercise extreme caution before taking MBBS-equivalent admission in Uzbekistan. The India-return pathway depends on FMGL 2021 compliance at the exact university and branch level, including course duration, English-medium instruction, clinical training, and internship at the same institution.",
      },
      {
        question: "What is the fee range for MBBS in Uzbekistan?",
        answer:
          "Published tuition figures often fall in the $3,000 to $4,500 annual range, which is why Uzbekistan keeps appearing in low-budget fee comparisons. But NMC's warning means students should not choose this destination on fee alone. The first filter now is regulatory compliance, not price.",
      },
      {
        question: "Is NEET required for MBBS in Uzbekistan?",
        answer:
          "Uzbekistani universities do not require NEET for admission. However, if you plan to practise in India, you must have a valid NEET-UG scorecard before your MBBS program begins — an NMC requirement regardless of country. Students who skip NEET cannot sit FMGE/NExT later and are barred from Indian medical registration.",
      },
      {
        question: "What language is MBBS taught in at Uzbekistan universities?",
        answer:
          "Brochure-level English-medium claims are not enough. In its 1 April 2026 alert, NMC says students must verify the actual medium of instruction and bedside clinical training carefully. If patient-facing training depends heavily on non-English communication without adequate support, the India-return pathway can become risky.",
      },
      {
        question: "Is Uzbekistan safe for Indian students?",
        answer:
          "Personal safety and academic-regulatory safety are two different questions. MEA's Uzbekistan advisory asks students to verify institute reputation and degree validity in India before admission, and NMC's April 2026 alert raises separate concerns about standards, language, training quality, and agents. Families should evaluate both dimensions together.",
      },
      {
        question: "How does Uzbekistan compare to Kazakhstan or Kyrgyzstan for MBBS?",
        answer:
          "The old comparison used to focus on cost and city comfort. After the April 2026 NMC alert, the more important comparison is regulatory risk. If you are also considering Kazakhstan, Kyrgyzstan, or Russia, compare each university on FMGL compliance, English-medium clinical training, and internship structure before comparing tuition.",
      },
      {
        question: "What intake months are available in Uzbekistan?",
        answer:
          "September is the most common intake marketed for Indian students, and some universities also advertise February admission. Because the compliance question is now central, students should verify intake, branch, and curriculum directly with the university before treating any mid-year option as safe to join.",
      },
    ],
    metaTitle: "MBBS in Uzbekistan 2026 | NMC Alert, Fees & FMGL Checks",
    metaDescription:
      "Review MBBS in Uzbekistan with the 1 April 2026 NMC alert in mind. Compare fees only after checking FMGL 2021 compliance, English-medium training, and internship structure.",
    atAGlance: [
      { label: "Program", value: "MBBS (6-year MD-equivalent)" },
      { label: "Annual tuition", value: "$3,000 – $4,500 published by some universities" },
      { label: "Living costs", value: "$1,500 – $2,500/year" },
      { label: "Total 6-year cost", value: "$27,000 – $40,000 approx." },
      { label: "Intake", value: "September usually; verify February directly" },
      { label: "Medium", value: "Must be verified in classroom and clinical years" },
      { label: "NEET required", value: "Yes (mandatory for Indian practice)" },
      { label: "Recognition", value: "Must be verified institution by institution under FMGL 2021" },
    ],
    eligibility: {
      intro:
        "For Uzbekistan, Indian students should treat admission eligibility and India-return eligibility as two separate checks. Both need to work before you commit.",
      items: [
        "Passed Class 12 with Physics, Chemistry, and Biology",
        "Minimum 50% aggregate in PCB",
        "Cleared NEET-UG",
        "Age 17 or above during the admission year",
        "Valid Indian passport",
        "Written proof that the chosen university, branch, and course structure satisfy FMGL 2021",
      ],
    },
    admissionSteps: [
      "Qualify NEET-UG and save the scorecard before the course begins",
      "Read the current NMC alert and FMGL 2021 requirements before choosing any Uzbekistan institution",
      "Ask the university for written confirmation on course duration, English-medium delivery, clinical training, and internship structure",
      "Cross-check the exact institution or branch with NMC and the Indian Embassy if there is any doubt",
      "Apply only through the official university route with scanned academic and passport documents",
      "Receive the offer or invitation letter and verify the institution name again before transferring money",
      "Proceed with visa and medical formalities only after the India-return pathway is documented clearly enough for your family",
      "Travel and register after all core compliance questions are settled, not before",
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
        "Official invitation letter from the university",
        "Completed visa application form",
        "Medical fitness certificate including HIV test result",
        "Bank statement showing sufficient funds",
        "Travel insurance documents",
        "Notarised copies of academic certificates",
      ],
    },
    syllabusPhases: [
      {
        phase: "Pre-clinical (Years 1–2)",
        years: "Year 1 – Year 2",
        highlights: [
          "Anatomy",
          "Physiology",
          "Biochemistry",
          "Medical Physics",
          "Histology",
          "Local language orientation",
        ],
      },
      {
        phase: "Para-clinical (Years 3–4)",
        years: "Year 3 – Year 4",
        highlights: [
          "Pathology",
          "Pharmacology",
          "Microbiology",
          "Internal Medicine",
          "General Surgery",
          "Medical Genetics",
        ],
      },
      {
        phase: "Clinical (Years 5–6)",
        years: "Year 5 – Year 6",
        highlights: [
          "Paediatrics",
          "Gynaecology & Obstetrics",
          "Ophthalmology",
          "Psychiatry",
          "Community Medicine",
          "Hospital internship",
        ],
      },
    ],
    indiaComparison: [
      { criterion: "Annual tuition", india: "₹10–25 lakh (private colleges)", abroad: "$3,000–$4,500" },
      { criterion: "NEET requirement", india: "Yes — mandatory", abroad: "Yes — mandatory" },
      { criterion: "Program duration", india: "5.5 years + 1 year internship", abroad: "6 years (incl. internship)" },
      { criterion: "Medium", india: "English", abroad: "English" },
      { criterion: "Seat availability", india: "Highly competitive", abroad: "Easily accessible for qualified students" },
      { criterion: "Return pathway", india: "Direct NMC licence", abroad: "Must clear FMGE/NExT to practise in India" },
    ],
    hostelInfo:
      "Hostel availability varies sharply by university and city. Ask for room-sharing, kitchen access, deposit, and move-in details in writing. For Uzbekistan specifically, do not let hostel comfort override the larger FMGL-compliance questions.",
    scholarshipInfo:
      "Any scholarship or fee discount should be treated as secondary to compliance. If a university offers a concession, ask for the written net payable amount and verify that the exact institution and branch still remain acceptable for your India-return plan.",
    careerOpportunities: [
      "Return to India only if the full FMGL 2021 pathway remains compliant and you later clear FMGE or NExT as applicable",
      "Pursue postgraduate studies in India only after the base foreign degree remains valid for Indian registration",
      "Evaluate global residency or licensing plans only after the university, branch, and internship pathway are verified properly",
      "Keep written records of curriculum and internship structure throughout the course in case future verification is needed",
    ],
    intakeTimeline: [
      { milestone: "Application Opens", timeline: "June", details: "Submit academic documents." },
      { milestone: "Admission Letter", timeline: "July", details: "University issues acceptance." },
      { milestone: "Visa Processing", timeline: "August", details: "Visa stamping process." },
      { milestone: "Departure & Classes", timeline: "September", details: "Flights to Tashkent or Samarkand." },
    ],
    livingCostBreakdown: [
      { item: "Accommodation (Hostel)", cost: "$40 – $80 / month" },
      { item: "Food & Groceries", cost: "$90 – $130 / month" },
      { item: "Transport", cost: "$10 – $15 / month" },
      { item: "Miscellaneous", cost: "$20 – $40 / month" },
    ],
    challenges: [
      {
        title: "NMC alert and Embassy concerns",
        realityCheck: "NMC's 1 April 2026 alert says students should exercise extreme caution in Uzbekistan because Embassy-reported issues include weak hands-on training, non-English teaching realities, intake beyond capacity, and agent malpractice.",
      },
      {
        title: "English-medium claims need proof",
        realityCheck: "If the real classroom or bedside language shifts away from English during clinical years, the FMGL pathway can become risky. Ask for written clarification before admission.",
      },
      {
        title: "Branch and offshore models need extra caution",
        realityCheck: "NMC says complaints were received around the TSMU Termez Branch offshore model linked to TIT Institute of Medical Sciences, Bangalore. Treat any branch, transfer, or split-campus setup as a red-flag item until verified directly.",
      },
    ],
  },
];
