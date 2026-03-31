import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const RUSSIA_ID = 45;
const COURSE_MBBS_ID = 13;

const universities = [
  {
    slug: "kazan-federal-university",
    name: "Kazan Federal University",
    city: "Kazan",
    type: "Public/Federal",
    establishedYear: 1804,
    published: true,
    featured: true,
    officialWebsite: "https://kpfu.ru/eng",
    summary: "Kazan Federal University (KFU) is one of the oldest and most prestigious universities in Russia. Its Institute of Fundamental Medicine and Biology is a global leader in medical research, offering 2026 aspirants an elite, technology-integrated education in the multicultural capital of Tatarstan.",
    campusLifestyle: "A breathtaking blend of 19th-century architecture and 21st-century labs. Students study in a historic city center campus featuring the 'Wet Lab' simulation center and world-class dental clinics. Kazan is the 'Third Capital of Russia,' offering a high-quality, multicultural lifestyle.",
    cityProfile: "Kazan is a massive metropolitan hub. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $160-$200 USD. Extremely safe, vibrant, and athlete-friendly city.",
    clinicalExposure: "Unmatched clinical scale with access to 18+ affiliated teaching hospitals and its own 'University Clinic.' Features state-of-the-art robotic surgery suites and genomic research labs. High patient flow in the Republican Clinical Hospital.",
    hostelOverview: "Students reside in the 'Universiade Village,' which is one of the best student campuses in Europe. 2-3 per room, en-suite bathrooms, fiber internet, and massive sports parks. Safe, gated, and exceptionally clean.",
    indianFoodSupport: "Kazan has a huge Indian community. Multiple Indian messes operate in the Universiade Village. Local hypermarkets are well-stocked with every possible Indian spice and pulse.",
    safetyOverview: "Universiade Village is a gated zone with 24/7 security and restricted access. Kazan city itself is famously safe and welcoming to international students.",
    studentSupport: "Elite administrative support for international students. Integrated NExT/FMGE coaching modules and active participation in global medical conferences.",
    whyChoose: [
      "Elite Federal University status (Founded 1804)",
      "Residence in ‘Universiade Village’ – best campus in Russia",
      "Access to own University Clinic and 18+ clinical bases",
      "Located in Kazan, a safe and multicultural 'Third Capital'"
    ],
    thingsToConsider: [
      "Academic standards are exceptionally high and competitive",
      "Russian language is emphasized for clinical rounds in Year 4+",
      "The city is a major hub; fast-paced urban lifestyle"
    ],
    bestFitFor: ["Premium-seekers", "Academic toppers", "Students seeking elite campus life"],
    teachingHospitals: [
      "KFU University Clinic",
      "Republican Clinical Hospital (Tatarstan)",
      "Kazan City Clinical Hospital No. 7"
    ],
    recognitionBadges: ["Elite Federal Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "How safe is the campus?", answer: "Exceptionally safe; gated with 24/7 biometric security." }
    ],
    programs: [
      {
        slug: "mbbs-kazan-federal-2026",
        title: "Medical Degree / MD (Federal)",
        durationYears: 6,
        annualTuitionUsd: 7000,
        totalTuitionUsd: 42000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://kpfu.ru/eng/admission/"
      }
    ]
  },
  {
    slug: "novosibirsk-state-university",
    name: "Novosibirsk State University",
    city: "Novosibirsk",
    type: "Public/National Research",
    establishedYear: 1959,
    published: true,
    featured: true,
    officialWebsite: "https://www.nsu.ru/en/",
    summary: "Novosibirsk State University (NSU) is a world-renowned research university located in Akademgorodok, the 'Scientific Heart of Russia.' For 2026, it offers a deeply scientific medical curriculum integrated with the Russian Academy of Sciences.",
    campusLifestyle: "A unique campus situated inside a forest (Akademgorodok). Students live and study alongside thousands of world-class scientists. A peaceful, intellectual, and high-tech environment with its own beaches on the Ob Sea.",
    cityProfile: "Novosibirsk is the capital of Siberia and the 3rd largest city in Russia. 2026 Index: Modern and affordable. Milk (~76 RUB), 1kg Chicken (~330 RUB). Monthly expenses $170-$200 USD. Safe, clean, and highly organized.",
    clinicalExposure: "Primary rotation at the **Novosibirsk State Regional Clinical Hospital** (1,200+ beds) and specialized research institutes for personalized medicine. Students participate in cutting-edge clinical trials.",
    hostelOverview: "Modern research-standard hostels with high-speed fiber internet in every room. 2 per room sharing. Secure, quiet, and located within the forest-campus of Akademgorodok.",
    indianFoodSupport: "Self-cooking is primary. Local markets in Akademgorodok are excellent. Proximity to the city center allows access to many international food options.",
    safetyOverview: "Akademgorodok is one of the safest districts in Russia. It is a quiet, academic zone with 24/7 campus security and a high-trust community.",
    studentSupport: "National Research status ensures massive academic funding. Elite mentorship and support for international publishing and licensing exams.",
    whyChoose: [
      "Top-ranked global university in the 'Scientific City' of Akademgorodok",
      "Direct integration with the Russian Academy of Sciences research labs",
      "Access to a 1,200-bed State Regional Clinical Hospital",
      "Safe, forest-based campus life within a major metropolitan hub"
    ],
    thingsToConsider: [
      "Siberian winters are very cold (-30\u00b0C is common); high-spec gear required",
      "Curriculum is heavily scientific and research-focused",
      "Distance to Moscow is roughly a 4-hour flight"
    ],
    bestFitFor: ["Research-oriented students", "Academic overachievers", "Nature/Science lovers"],
    teachingHospitals: [
      "Novosibirsk State Regional Clinical Hospital",
      "Central Clinical Hospital (Akademgorodok)",
      "Meshalkin National Medical Research Center"
    ],
    recognitionBadges: ["Global Research Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." },
      { question: "Is it a research school?", answer: "Yes, it is one of Russia's top research-intensive universities." }
    ],
    programs: [
      {
        slug: "mbbs-novosibirsk-state-2026",
        title: "Medical Degree / MD (Research)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://www.nsu.ru/en/education/admission/"
      }
    ]
  },
  {
    slug: "mechnikov-north-western-medical-university",
    name: "North-Western State Medical University n.a. Mechnikov",
    city: "St. Petersburg",
    type: "Public/Specialized",
    establishedYear: 1907,
    published: true,
    featured: true,
    officialWebsite: "https://szgmu.ru/eng/",
    summary: "Mechnikov North-Western State Medical University (NWSMU) is a premier specialized medical institution in St. Petersburg. For 2026, it is a top-tier global destination, operating its own massive internal clinical base with 1,600+ beds.",
    campusLifestyle: "A historic and prestigious campus in the cultural capital of Russia. Students study in a clinical-first environment. St. Petersburg offers an unmatched European lifestyle, world-class museums, and a vibrant international community.",
    cityProfile: "St. Petersburg is the 'Venice of the North.' 2026 Index: Modern and high-quality. Milk (~82 RUB), 1kg Chicken (~360 RUB). Monthly expenses around $200-$250 USD. Safe and culturally unparalleled.",
    clinicalExposure: "Exceptional clinical stock: The university operates its own **Peter the Great Clinic** (1,000+ beds) and the **Eichwald Clinic**. Combined access to 1,600+ university-owned beds plus affiliated city hospitals.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 students. Features high-speed internet, secure entries, and centralized laundry. Some hostels are historic buildings within the city center.",
    indianFoodSupport: "St. Petersburg has many Indian restaurants and messes. Local hypermarkets are exceptionally well-stocked with international spices and grains.",
    safetyOverview: "Very safe European-style metropolis. 24/7 security in all university buildings and a dedicated international affairs office for student coordination.",
    studentSupport: "Decades of experience in training elite specialists. Integrated support for international licensing exams and global residency matching.",
    whyChoose: [
      "Specialized Medical University with its own 1,600-bed Clinical Base",
      "Located in St. Petersburg, Russia's cultural and maritime capital",
      "Elite legacy institution (Founded 1907) with high global recognition",
      "High clinical volume and own dedicated clinics minimize transit"
    ],
    thingsToConsider: [
      "St. Petersburg winters can be damp and windy; high-spec gear required",
      "Academic standards are rigid and focus heavily on clinical skills",
      "Higher living cost compared to regional Siberian hubs"
    ],
    bestFitFor: ["Premium-seekers", "Surgical enthusiasts", "Culture and city lovers"],
    teachingHospitals: [
      "Peter the Great University Clinic",
      "Eichwald University Clinic",
      "St. Petersburg City Clinical Hospital No. 1"
    ],
    recognitionBadges: ["Surgical Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Does it have its own hospitals?", answer: "Yes, it owns and operates two massive clinics internally." }
    ],
    programs: [
      {
        slug: "mbbs-mechnikov-state-2026",
        title: "Medical Degree / MD (Specialized)",
        durationYears: 6,
        annualTuitionUsd: 7500,
        totalTuitionUsd: 45000,
        livingUsd: 4000,
        medium: "English",
        officialProgramUrl: "https://szgmu.ru/eng/admission/"
      }
    ]
  },
  {
    slug: "saint-petersburg-state-university",
    name: "Saint Petersburg State University",
    city: "St. Petersburg",
    type: "Public/Federal",
    establishedYear: 1724,
    published: true,
    featured: true,
    officialWebsite: "https://spbu.ru/en",
    summary: "Saint Petersburg State University (SPbU) is Russia's oldest university (Founded by Peter the Great). Its Medical Faculty offers 2026 aspirants an elite, multi-disciplinary education within one of the world's highest-ranked comprehensive universities.",
    campusLifestyle: "Aristocratic and academic. Students study in the historic heart of St. Petersburg. Direct access to elite simulation centers and university research libraries. Unmatched cultural and networking opportunities.",
    cityProfile: "St. Petersburg. 2026 Index: Elite urban life. Milk (~82 RUB), 1kg Chicken (~365 RUB). Monthly budget $200-$250 USD. safe, modern, and beautiful.",
    clinicalExposure: "Primary rotation at the university's 80+ affiliated clinical bases, including the elite **Pirogov Clinic**. Students gain exposure to advanced cardiac and vascular surgery wards in high-volume research hospitals.",
    hostelOverview: "Dedicated international student hostels (some on Vasilevsky Island). Rooms shared by 2-3 students. Features 24/7 security and centralized laundry. High-speed fiber internet standard.",
    indianFoodSupport: "Excellent Indian food support: St. Petersburg has a long history of international student life. Local markets/restaurants are world-class.",
    safetyOverview: "St. Petersburg is safe and very well-guarded. The university provides 24/7 security and a dedicated foreign student affairs board.",
    studentSupport: "Global Tier-1 university status. Integrated FMGE/NExT practice support and active research in innovative medicine (AI/Genomics).",
    whyChoose: [
      "Russia's oldest university (1724) with global Tier-1 status",
      "Network of 80+ clinical bases in the cultural capital (St. Petersburg)",
      "High academic funding and elite research-led medical curriculum",
      "Breathtaking campus heart in a UNESCO World Heritage city"
    ],
    thingsToConsider: [
      "Academic standards are famously high; attendance is strict",
      "The city is large; requires commuting for specialized clinics",
      "Higher living cost compared to regional hubs"
    ],
    bestFitFor: ["Premium Seekers", "Future Medical Researchers", "Elite Academic Performers"],
    teachingHospitals: [
      "Pirogov Clinic of SPbU",
      "First City Clinical Hospital",
      "Mariinsky City Hospital"
    ],
    recognitionBadges: ["Global Tier-1 Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it the same as Mechnikov?", answer: "No, SPbU is a comprehensive university; Mechnikov is a specialized medical school." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-spbu-state-2026",
        title: "Medical Degree / MD (Federal)",
        durationYears: 6,
        annualTuitionUsd: 8000,
        totalTuitionUsd: 48000,
        livingUsd: 4500,
        medium: "English",
        officialProgramUrl: "https://spbu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "orel-state-university",
    name: "Orel State University",
    city: "Orel",
    type: "Public/State",
    establishedYear: 1931,
    published: true,
    featured: false,
    officialWebsite: "https://oreluniver.ru/en/",
    summary: "Orel State University (named after I.S. Turgenev) is a leading educational hub in Central Russia. Its Medical Institute offers 2026 aspirants a high-quality, practical-focused curriculum in the safe and peaceful 'Literary Capital' of Russia.",
    campusLifestyle: "A traditional academic campus in a quiet provincial setting. Orel is known for its high quality of life and safety. Students have access to modern labs and a large university library.",
    cityProfile: "Orel is a historic city 360km south of Moscow. 2026 Index: Very affordable. Milk (~72 RUB), 1kg Chicken (~315 RUB). Monthly budget $130-$160 USD. Peaceful Lifestyle.",
    clinicalExposure: "Primary clinical rotation at the Orel Regional Clinical Hospital and City Clinical Hospital n.a. Semashko. Strong focus on practical surgery and diagnostics from Year 3 onwards.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, reliable heating, and internet. Academic buildings are within easy reach.",
    indianFoodSupport: "Self-cooking is primary. Local markets are well-stocked with fresh produce and international staples.",
    safetyOverview: "Orel is one of the safest cities in Central Russia. The university provides 24/7 security and a dedicated foreign student affairs board.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT preparation and active student scientific societies.",
    whyChoose: [
      "Strategic proximity to Moscow (360km; 4-hour train ride)",
      "Highly affordable total package under \u20b922 Lakhs total",
      "Safe and family-oriented 'Literary Capital' environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is smaller and quieter; ideal for intense study",
      "Academic standards are traditional and rigorous",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Budget-conscious families", "Solo learners", "Independent students"],
    teachingHospitals: [
      "Orel Regional Clinical Hospital",
      "City Clinical Hospital n.a. Semashko",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Central Russia Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Orel safe?", answer: "Yes, it is a peaceful, historic city with a low crime rate." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-orel-state-2026",
        title: "Medical Degree / MD (Orel)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://oreluniver.ru/en/admission/"
      }
    ]
  },
  {
    slug: "belgorod-state-university",
    name: "Belgorod State National Research University",
    city: "Belgorod",
    type: "Public/National Research",
    establishedYear: 1876,
    published: true,
    featured: false,
    officialWebsite: "https://bsu.edu.ru/en/",
    summary: "Belgorod State University (BelSU) is a National Research University. Its Medical Institute is a top-tier center for medical science and clinical training in the newly modernized city of Belgorod. For 2026, it offers high-tech labs and a high academic rating.",
    campusLifestyle: "Ultra-modern campus facilities (National Research standard). Students enjoy a high-tech learning environment with advanced digital simulation labs and a large university library complex.",
    cityProfile: "Belgorod is a high-tech, modern, and very clean city. 2026 Index: Affordable and clean. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Often ranked among Russia's most comfortable cities.",
    clinicalExposure: "Primary rotation at the Belgorod State University Clinic and major city clinical hospitals. High-tech diagnostic equipment and modern surgical theaters are a standard for training.",
    hostelOverview: "Modern hostels with en-suite sections for international students. Features 24/7 security, centralized laundry, and high-speed fiber internet. Located within the secure university district.",
    indianFoodSupport: "Self-cooking and group messes are standard. Local hypermarkets stock a good variety of international produce and spices.",
    safetyOverview: "Belgorod is historically very safe. The university maintains an elite security record and a dedicated international affairs office.",
    studentSupport: "National Research status allows for high academic funding. Offers integrated FMGE/NExT support and active student research grants.",
    whyChoose: [
      "National Research University status with high academic funding",
      "Highly modernized city infrastructure (Safe and clean)",
      "High-tech clinical training with own University Clinic",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Located near the border; requires monitoring of local travel advisories",
      "Academic standards are modern and fast-paced",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Academic seekers wanting high rankings", "Technology enthusiasts", "Independent students"],
    teachingHospitals: [
      "BelSU University Clinic",
      "Belgorod Regional Clinical Hospital",
      "City Clinical Hospital No. 1"
    ],
    recognitionBadges: ["National Research Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "How safe is the city?", answer: "Historically very safe and clean, often top-ranked for quality of life." }
    ],
    programs: [
      {
        slug: "mbbs-belgorod-state-2026",
        title: "Medical Degree / MD (Research)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://bsu.edu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "baltic-federal-university",
    name: "Immanuel Kant Baltic Federal University",
    city: "Kaliningrad",
    type: "Public/Federal",
    establishedYear: 1947,
    published: true,
    featured: false,
    officialWebsite: "https://kantiana.ru/en/",
    summary: "Immanuel Kant Baltic Federal University (IKBFU) is a premier federal institution located in the European enclave of Kaliningrad. For 2026, it offers a Western-style education with modern infrastructure and a unique European lifestyle.",
    campusLifestyle: "A unique blend of Russian and European culture. Students study in a historic city with German heritage. Modern high-tech labs and a focus on innovative healthcare. Kaliningrad is an enclave, offering a high-quality, peaceful, and Europe-facing lifestyle.",
    cityProfile: "Kaliningrad is an enclave between Poland and Lithuania. 2026 Index: Modern and clean. Milk (~80 RUB), 1kg Chicken (~340 RUB). Monthly expenses around $180-$220 USD. Scenic coastal city with many historic sites.",
    clinicalExposure: "Primary rotation at the IKBFU Medical Center and major regional clinical hospitals. Clinical training begins early, focusing on specialized diagnostics and therapeutic technologies.",
    hostelOverview: "Modern hostels with en-suite sections or shared blocks. Features 24/7 security, centralized heating, and high-speed fiber internet. Hostels are within easy reach of the main medical wing.",
    indianFoodSupport: "Self-cooking is primary. Local markets stock a good variety of international produced and imported spices due to the port-city location.",
    safetyOverview: "Kaliningrad is a safe, family-oriented regional capital. The university provides 24/7 security and a dedicated office for foreign student affairs.",
    studentSupport: "Elite Federal University status ensures massive academic funding. Elite mentorship and support for international publishing and licensing exams.",
    whyChoose: [
      "Elite Federal University status in the European enclave of Kaliningrad",
      "Unique European-style city life with Russian academic rigor",
      "High-tech clinical training with IKBFU Medical Center access",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Kaliningrad is an enclave (separate from mainland Russia); requires transit knowledge",
      "Weather is coastal; rainy and windy compared to Central Russia",
      "Higher living cost compared to regional Siberian hubs"
    ],
    bestFitFor: ["Premium Seekers", "Students wanting European lifestyle", "Quality-conscious learners"],
    teachingHospitals: [
      "IKBFU Medical Center",
      "Kaliningrad Regional Clinical Hospital",
      "City Clinical Emergency Hospital"
    ],
    recognitionBadges: ["European Enclave Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Kaliningrad safe?", answer: "Yes, it is a peaceful, protected enclave with a high quality of life." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-baltic-federal-2026",
        title: "Medical Degree / MD (Federal)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://kantiana.ru/en/admission/"
      }
    ]
  },
  {
    slug: "north-eastern-federal-university",
    name: "North-Eastern Federal University",
    city: "Yakutsk",
    type: "Public/Federal",
    establishedYear: 1956,
    published: true,
    featured: false,
    officialWebsite: "https://www.s-vfu.ru/en/",
    summary: "North-Eastern Federal University (NEFU) is a premier federal hub in the Far North. For 2026, its Medical Institute specializes in high-latitude medicine and clinical practice in extreme cold environments.",
    campusLifestyle: "A unique experience in the world's coldest inhabited city. The campus is high-tech and exceptionally well-insulated. Students focus on unique Arctic health challenges and participate in northern research circles.",
    cityProfile: "Yakutsk is the capital of the Sakha Republic. 2026 Index: Modern facilities in extreme cold. Milk (~90 RUB), 1kg Chicken (~380 RUB). Monthly expenses around $180-$230 USD due to northern logistics. Historic and culturally distinct.",
    clinicalExposure: "Primary rotation at the NEFU University Clinic and the Republic Hospital No. 1 (Medical Center). Students gain unique exposure to cold-related pathologies and specialized northern surgery.",
    hostelOverview: "Hostels are exceptionally warm (Indoor 24\u00b0C+) and well-guarded. Standard sharing by 2-3 students with high-speed internet and security guards 24/7.",
    indianFoodSupport: "Self-cooking is primary. Local markets stock a good range of international produced, though prices reflect northern logistics.",
    safetyOverview: "Yakutsk is a safe, peaceful regional capital. The university provides comprehensive cold-climate adaptation and safety orientations.",
    studentSupport: "Dedicated support for northern survival and legalities. Elite Federal status ensures high funding for student scientific projects.",
    whyChoose: [
      "Unique Federal University specialization in High-Latitude Medicine",
      "Stable academic environment with heavy internal funding/grants",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)",
      "Exceptional clinical base in the Republic's largest Medical Center"
    ],
    thingsToConsider: [
      "Winters are extremely cold (-40\u00b0C to -50\u00b0C); absolute polar gear required",
      "Logistics (flights) can be affected by deep winter weather",
      "Small Indian community compared to Moscow or Southern hubs"
    ],
    bestFitFor: ["Research Pioneers", "Students seeking unique medical specializations", "Resilient learners"],
    teachingHospitals: [
      "Republic Hospital No. 1 (Medical Center)",
      "NEFU University Clinic",
      "Yakutsk City Clinical Hospital"
    ],
    recognitionBadges: ["Arctic Medicine Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it too cold for Indians?", answer: "Indoor heating is world-class; proper polar clothing makes outdoor life manageable." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-yakutsk-federal-2026",
        title: "Medical Degree / MD (Arctic)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://www.s-vfu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "tomsk-state-university",
    name: "Tomsk State University",
    city: "Tomsk",
    type: "Public/National Research",
    establishedYear: 1878,
    published: true,
    featured: true,
    officialWebsite: "https://www.tsu.ru/english/",
    summary: "Tomsk State University (TSU) is a Global Top-300 university and one of Russia's most historic elite institutions. For 2026, its Medical Faculty offers a multi-disciplinary, research-heavy education in the 'Siberian Athens' – the city of Tomsk.",
    campusLifestyle: "Traditional aristocratic campus in a city where 1 in 4 people is a student. Students study in a forest-park setting with historic wooden architecture. Tomsk is safe, clean, and has the most youthful vibe in Siberia.",
    cityProfile: "Tomsk is the 'Siberian Athens.' 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Historic wooden architecture and a 100% student-centric city life.",
    clinicalExposure: "Primary rotation at the Tomsk Regional Clinical Hospital and specialized research institutes for oncology and cardiology. High volume of specialized surgical cases ensures deep practical exposure.",
    hostelOverview: "High-standard university hostels (Dormitories 7-9). Rooms sharing by 2-3 students in a secure, quiet, and academic zone with high-speed fiber internet.",
    indianFoodSupport: "Self-cooking is primary. Local supermarkets or 'The Student Market' stock a good range of international staples and grains.",
    safetyOverview: "Tomsk is one of the safest cities in Russia. It is a quiet, academic zone with 24/7 campus security and a high-trust student community.",
    studentSupport: "Global Tier-1 academic status. Elite mentorship and support for international publishing and licensing exams. active student scientific societies.",
    whyChoose: [
      "Global Tier-1 elite university (Founded 1878; 'Siberian Athens')",
      "High academic funding and research-led medical curriculum",
      "Safe, affordable, and 100% student-centric city life",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academic standards are famously high; requires total dedication",
      "Siberian winters are snowy and cold; prepare appropriately",
      "Tomsk is a quieter city, ideal for focused study"
    ],
    bestFitFor: ["Academic Seekers", "Future Medical Researchers", "Students wanting top global rankings"],
    teachingHospitals: [
      "Tomsk Regional Clinical Hospital",
      "City Clinical Hospital No. 3",
      "Regional Cancer Center"
    ],
    recognitionBadges: ["Global Research Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Tomsk safe?", answer: "Yes, it is often called the safest student city in Russia." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-tomsk-state-2026",
        title: "Medical Degree / MD (Global Research)",
        durationYears: 6,
        annualTuitionUsd: 7000,
        totalTuitionUsd: 42000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://www.tsu.ru/english/admission/"
      }
    ]
  },
  {
    slug: "chelyabinsk-state-medical-university",
    name: "Chelyabinsk State Medical University",
    city: "Chelyabinsk",
    type: "Public/State",
    establishedYear: 1944,
    published: true,
    featured: false,
    officialWebsite: "https://chelsmu.ru/eng/",
    summary: "Chelyabinsk State Medical University (ChSMU) is a leading Ural institution known for its high clinical volume and its focus on intensive clinical rotations. For 2026, it offers high-achieving students a focused, clinical-led education.",
    campusLifestyle: "A traditional urban campus integrated into central Chelyabinsk. Known for its strong emphasis on practical hand-skills and early patient interaction in city clinics.",
    cityProfile: "Industrial capital of the South Ural region. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and well-organized city.",
    clinicalExposure: "Massive clinical base with access to 10+ teaching hospitals and 3,000+ total beds. Primary rotations at the Chelyabinsk Regional Clinical Hospital.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized heating, and internet. Academic buildings are centrally located.",
    indianFoodSupport: "Self-cooking is the primary mode. Local hypermarkets stock international staples and spices.",
    safetyOverview: "Chelyabinsk is a safe, family-oriented regional capital. University provides 24/7 security and comprehensive legal and safety orientation.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active research in regional health issues.",
    whyChoose: [
      "Access to a massive 3,000-bed clinical network in Chelyabinsk",
      "Ural region hub focusing on intensive clinical hand-skills",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Industrial city environment with a focus on peace and study",
      "Traditional academic discipline and high attendance requirements",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Budget-conscious families", "Independent students", "Serious clinical learners"],
    teachingHospitals: [
      "Chelyabinsk Regional Clinical Hospital",
      "City Clinical Hospital No. 1",
      "Regional Cardiology Center"
    ],
    recognitionBadges: ["Ural Clinical Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it close to the Urals?", answer: "Yes, it is right at the border of Europe and Asia in the Urals." }
    ],
    programs: [
      {
        slug: "mbbs-chelyabinsk-state-2026",
        title: "Medical Degree / MD (Ural)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://chelsmu.ru/eng/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 7 (Full 10) ===\n");
  const client = await pool.connect();

  try {
    for (const uni of universities) {
      console.log(`Deeply Enriching: ${uni.name}...`);

      const uniQuery = `
        INSERT INTO universities (
          country_id, slug, name, city, type, established_year, summary, 
          published, featured, official_website, campus_lifestyle, city_profile,
          clinical_exposure, hostel_overview, indian_food_support, safety_overview,
          student_support, why_choose, things_to_consider, best_fit_for,
          teaching_hospitals, recognition_badges, faq, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          type = EXCLUDED.type,
          summary = EXCLUDED.summary,
          published = EXCLUDED.published,
          featured = EXCLUDED.featured,
          official_website = EXCLUDED.official_website,
          campus_lifestyle = EXCLUDED.campus_lifestyle,
          city_profile = EXCLUDED.city_profile,
          clinical_exposure = EXCLUDED.clinical_exposure,
          hostel_overview = EXCLUDED.hostel_overview,
          indian_food_support = EXCLUDED.indian_food_support,
          safety_overview = EXCLUDED.safety_overview,
          student_support = EXCLUDED.student_support,
          why_choose = EXCLUDED.why_choose,
          things_to_consider = EXCLUDED.things_to_consider,
          best_fit_for = EXCLUDED.best_fit_for,
          teaching_hospitals = EXCLUDED.teaching_hospitals,
          recognition_badges = EXCLUDED.recognition_badges,
          faq = EXCLUDED.faq,
          updated_at = NOW()
        RETURNING id;
      `;

      const uniValues = [
        RUSSIA_ID, uni.slug, uni.name, uni.city, uni.type, uni.establishedYear, uni.summary,
        uni.published, uni.featured, uni.officialWebsite, uni.campusLifestyle, uni.cityProfile,
        uni.clinicalExposure, uni.hostelOverview, uni.indianFoodSupport, uni.safetyOverview,
        uni.studentSupport, JSON.stringify(uni.whyChoose), JSON.stringify(uni.thingsToConsider),
        JSON.stringify(uni.bestFitFor), uni.teachingHospitals, uni.recognitionBadges,
        JSON.stringify(uni.faq)
      ];

      const res = await client.query(uniQuery, uniValues);
      const universityId = res.rows[0].id;

      for (const prog of uni.programs) {
        const progQuery = `
          INSERT INTO program_offerings (
            university_id, course_id, slug, title, duration_years, 
            annual_tuition_usd, total_tuition_usd, living_usd, medium, 
            official_program_url, published, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            duration_years = EXCLUDED.duration_years,
            annual_tuition_usd = EXCLUDED.annual_tuition_usd,
            total_tuition_usd = EXCLUDED.total_tuition_usd,
            living_usd = EXCLUDED.living_usd,
            medium = EXCLUDED.medium,
            official_program_url = EXCLUDED.official_program_url,
            updated_at = NOW();
        `;

        const progValues = [
          universityId, COURSE_MBBS_ID, prog.slug, prog.title, prog.durationYears,
          prog.annualTuitionUsd, prog.totalTuitionUsd, prog.livingUsd,
          prog.medium, prog.officialProgramUrl, true
        ];

        await client.query(progQuery, progValues);
      }
      console.log(`  ✓ Authorities Created: ${uni.name}`);
    }
  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\n✅ Batch 7 Deep Enrichment Done!");
}

seed();
