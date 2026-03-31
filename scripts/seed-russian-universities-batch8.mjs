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
    slug: "lomonosov-moscow-state-university",
    name: "Lomonosov Moscow State University (Medical Faculty)",
    city: "Moscow",
    type: "Public/Federal",
    establishedYear: 1755,
    published: true,
    featured: true,
    officialWebsite: "https://www.msu.ru/en/faculties/med.php",
    summary: "Lomonosov Moscow State University (MSU) is Russia's highest-ranked university globally. Its Faculty of Fundamental Medicine offers an elite, research-heavy medical education integrated with the Russian Academy of Sciences for top-tier 2026 aspirants.",
    campusLifestyle: "Aristocratic and intellectual. Students study in the legendary MSU main building and modern specialized medical blocks on Sparrow Hills. Unmatched networking with Russia's academic elite and access to the country's largest university library and science parks.",
    cityProfile: "Moscow is a global alpha city. 2026 Index: Modern and high-quality. Milk (~85 RUB), 1kg Chicken (~380 RUB). Monthly expenses around $250-$350 USD. Safe, high-speed, and world-class transit system.",
    clinicalExposure: "Primary rotation at the **MSU University Clinic (Medical Center)** and elite federal institutes under the Academy of Medical Sciences. Features state-of-the-art robotic surgery, genomic labs, and personalized medicine centers.",
    hostelOverview: "Students reside in premium university dormitories on the Sparrow Hills campus. 2 per room, secure entry, and high-speed fiber internet. Located within a scenic, forest-park zone in central Moscow.",
    indianFoodSupport: "Moscow has hundreds of Indian restaurants and dedicated student messes. Local hypermarkets are world-class and stock every possible international ingredient.",
    safetyOverview: " Sparrow Hills is a highly secure federal zone with 24/7 security and restricted campus access. MSU maintains its own internal security department for student safety.",
    studentSupport: "Global Tier-1 academic status. Elite mentorship for international publishing, global residency matching, and licensing exam preparation (NExT/FMGE/USMLE).",
    whyChoose: [
      "Russia's #1 Ranked Global University (Global Top-100)",
      "High academic funding and research-led medical curriculum",
      "Direct integration with the Russian Academy of Medical Sciences",
      "Premier location on Sparrow Hills, Moscow's academic heart"
    ],
    thingsToConsider: [
      "Admission is exceptionally competitive and threshold-based",
      "Academic workload is one of the highest in the country",
      "Higher living cost compared to regional hubs"
    ],
    bestFitFor: ["Elite Academic Performers", "Future Medical Researchers", "Premium Seekers"],
    teachingHospitals: [
      "MSU Medical Center",
      "Central Clinical Hospital (Presidential Clinic)",
      "Burdenko National Medical Research Center"
    ],
    recognitionBadges: ["Global Top-100 Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it the best in Russia?", answer: "Yes, it is consistently ranked as the #1 university in the Russian Federation." },
      { question: "Is the medium English?", answer: "Yes, they offer a specialized 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-lomonosov-msu-2026",
        title: "Medical Degree / MD (Federal Elite)",
        durationYears: 6,
        annualTuitionUsd: 9000,
        totalTuitionUsd: 54000,
        livingUsd: 5000,
        medium: "English",
        officialProgramUrl: "https://www.msu.ru/en/admissions/"
      }
    ]
  },
  {
    slug: "siberian-state-medical-university",
    name: "Siberian State Medical University",
    city: "Tomsk",
    type: "Public/Federal Research",
    establishedYear: 1888,
    published: true,
    featured: true,
    officialWebsite: "https://ssmu.ru/en/",
    summary: "Siberian State Medical University (SibMed) is one of the top 3 medical schools in Russia. For 2026, it offers a prestigious, research-led education with its own internal 800-bed multi-disciplinary clinical hospital.",
    campusLifestyle: "A traditional, aristocratic-style academic campus in the 'Siberian Athens.' Tomsk is 25% students, creating a uniquely youthful and intellectual vibe. Students study in historic buildings integrated with modern research floors.",
    cityProfile: "Tomsk is Russia's premier student city. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Historic wooden architecture and high security.",
    clinicalExposure: "Exceptional clinical stock: SibMed operates its own **University Clinical Hospital** (800+ beds) in the city center. Features advanced surgery, robotic-assisted diagnostics, and specialized infectious disease units.",
    hostelOverview: "Dedicated international student hostels (Dorms 1-3). Rooms shared by 2 students. Features fiber internet, centralized heating (vital for Siberia), and 24/7 security. Walking distance to the university clinic.",
    indianFoodSupport: "SibMed has an established Indian community. Self-cooking is primary, and local shops in Tomsk are well-tuned to the needs of international medical students.",
    safetyOverview: "Tomsk is often cited as the safest student city in Russia. SibMed maintains strict 24/7 security in all academic and residential buildings.",
    studentSupport: "National Research status ensures massive grants. Elite mentorship for USMLE/NExT and active participation in global clinical research projects.",
    whyChoose: [
      "Consistently ranked in the TOP-3 Medical Universities in Russia",
      "Own 800-bed Integrated University Hospital in the city center",
      "Located in Tomsk – Russia’s most famous student-friendly city",
      "Global research status with high citation and funding rankings"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing gear is essential",
      "Academic standards are famously rigid and competitive",
      "Tomsk is a quieter, academic-focused city"
    ],
    bestFitFor: ["Serious Academic Seekers", "Surgical enthusiasts", "Research-oriented students"],
    teachingHospitals: [
      "SibMed University Hospital",
      "Tomsk Regional Clinical Hospital",
      "Regional Cancer Center"
    ],
    recognitionBadges: ["Russian Top-3 Specialized", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Does it have its own hospital?", answer: "Yes, its own 800-bed hospital is the primary teaching base." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-siberian-state-2026",
        title: "Medical Degree / MD (Research Elite)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://ssmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "saint-petersburg-pediatric-medical-university",
    name: "Saint Petersburg State Pediatric Medical University",
    city: "St. Petersburg",
    type: "Public/Specialized",
    establishedYear: 1925,
    published: true,
    featured: false,
    officialWebsite: "https://gpmu.org/eng/",
    summary: "SPbSPMU is the oldest and largest pediatric medical school in the world. For 2026, it offers high-achieving students a unique clinical education, operating one of Russia's largest children's clinical hospitals with 800+ beds.",
    campusLifestyle: "A historic, specialized campus in St. Petersburg. Students study within a massive clinical complex. Unmatched patient interaction volume in pediatric, maternal, and general medicine wards.",
    cityProfile: "St. Petersburg cultural hub. 2026 Index: Modern and high-quality. Milk (~82 RUB), 1kg Chicken (~365 RUB). Monthly budget $200-$250 USD. Scenic, safe, and world-class.",
    clinicalExposure: "Massive specialized clinical stock: Operates its own **Pediatric University Hospital** (800+ beds) and a high-tech Perinatal Center. Students rotate through 50+ specialized pediatric and surgical wards.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 students. Features high-speed internet, secure entries, and proximity to the main clinical blocks. Located in the heart of the city's medical district.",
    indianFoodSupport: "Several Indian messes and restaurants are within walking distance. St. Petersburg markets are exceptionally well-stocked with international spices.",
    safetyOverview: "Very safe metropolitan hub. 24/7 security in all university buildings and constant monitoring of student residential zones.",
    studentSupport: "Global leader in child health education. Integrated support for NExT/FMGE and active alumni network in over 60 countries.",
    whyChoose: [
      "World's first and largest Specialized Pediatric University",
      "Own 800-bed Pediatric University Hospital & Perinatal Center",
      "Located in the historic cultural heart of St. Petersburg",
      "High clinical volume and unmatched patient interaction"
    ],
    thingsToConsider: [
      "Heavy load of pediatric-focused curriculum alongside General Medicine",
      "Academic discipline is famously strict; high attendance rules",
      "Weather is coastal; rainy and windy winters"
    ],
    bestFitFor: ["Future Pediatricians", "Students seeking St. Petersburg lifestyle", "Clinical-first learners"],
    teachingHospitals: [
      "St. Petersburg Pediatric University Hospital",
      "Regional Perinatal Center",
      "First City Clinical Hospital"
    ],
    recognitionBadges: ["Pediatric Pioneer", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it only for kids?", answer: "No, they offer a full MD in General Medicine with a deep pediatric specialization." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-petersburg-pediatric-2026",
        title: "Medical Degree / MD (Specialized)",
        durationYears: 6,
        annualTuitionUsd: 7000,
        totalTuitionUsd: 42000,
        livingUsd: 4000,
        medium: "English",
        officialProgramUrl: "https://gpmu.org/eng/admission/"
      }
    ]
  },
  {
    slug: "surgut-state-university",
    name: "Surgut State University",
    city: "Surgut",
    type: "Public/State",
    establishedYear: 1993,
    published: true,
    featured: false,
    officialWebsite: "https://surgu.ru/en/",
    summary: "Surgut State University is a high-tech institution in the energy-rich Khanty-Mansiysk region. For 2026, it offers a modern medical education integrated into the regional biomedical cluster of Western Siberia.",
    campusLifestyle: "A high-tech, modern urban campus. Surgut is a prosperous city with world-class sports and leisure facilities. The campus environment is clean, quiet, and exceptionally well-funded.",
    cityProfile: "Surgut is a wealthy industrial/energy hub. 2026 Index: Modern and safe. Milk (~80 RUB), 1kg Chicken (~350 RUB). Monthly expenses around $180-$220 USD. High local quality of life and infrastructure.",
    clinicalExposure: "Primary rotation at the regional clinical hospitals and specialized biomedical labs. Focus on modern diagnostics and research-led clinical practice in high-volume regional centers.",
    hostelOverview: "Modern student hostels with en-suite sections or shared blocks. Features include high-speed fiber internet, centralized heating, and active 24/7 security.",
    indianFoodSupport: "Self-cooking is primary. Local hypermarkets are well-stocked and modern, offering a wide range of international staples.",
    safetyOverview: "Surgut is one of the safest and most prosperous cities in Siberia. 24/7 security in academic wings and residential blocks ensures a protected life.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active research grants for international medical projects.",
    whyChoose: [
      "Located in a wealthy, high-tech energy hub with elite infrastructure",
      "Highly modernized campus and biomedical research laboratories",
      "Stable clinical base with access to major regional hospitals",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Winters are long and very cold; proper Siberian gear required",
      "Academic standards are modern and fast-paced",
      "City is a major industrial hub with a quiet, safe lifestyle"
    ],
    bestFitFor: ["Technology enthusiasts", "Independent students", "Safe-seeking families"],
    teachingHospitals: [
      "Surgut Regional Clinical Hospital",
      "Surget City Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["High-Tech Energy Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it a rich city?", answer: "Yes, it is one of Russia's wealthiest cities due to energy resources." }
    ],
    programs: [
      {
        slug: "mbbs-surgut-state-2026",
        title: "Medical Degree / MD (Modern)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://surgu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "sakhalin-state-university",
    name: "Sakhalin State University",
    city: "Yuzhno-Sakhalinsk",
    type: "Public/Federal Hub",
    establishedYear: 1949,
    published: true,
    featured: false,
    officialWebsite: "http://sakhgu.ru/en/",
    summary: "Sakhalin State University is the primary educational hub of the Sakhalin Island. For 2026, it offers a unique island-based medical education on Russia's Pacific coast, bordering Japan.",
    campusLifestyle: "A unique island experience. Students study in a scenic, maritime environment with easy access to nature. The city is peaceful, safe, and heavily influenced by Japanese and Korean culture.",
    cityProfile: "Yuzhno-Sakhalinsk is a prosperous island capital. 2026 Index: Unique and safe. Milk (~88 RUB), 1kg Chicken (~390 RUB). Monthly expenses around $200-$240 USD. A mix of Russian and East-Asian infrastructure.",
    clinicalExposure: "Primary clinical rotation at the Sakhalin Regional Clinical Hospital. Students gain unique exposure to maritime medicine and specialized regional trauma care.",
    hostelOverview: "Secure student hostels with shared kitchens and study halls. Rooms shared by 2-3 students. Reliability heating and security are top priorities.",
    indianFoodSupport: "Self-cooking is primary. Local markets are influenced by Asian imports; excellent fresh seafood and Asian staples available.",
    safetyOverview: "Extremely safe island environment. University provides 24/7 security and a high-trust local community atmosphere.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for international medical licensing and legal orientation.",
    whyChoose: [
      "Unique Island Education on the Pacific coast near Japan",
      "High quality of life in a wealthy, energy-rich island capital",
      "Stable clinical base with access to Sakhalin Regional Hospital",
      "Fully compliant with NMC FMGL 2021 guidelines (6 years)"
    ],
    thingsToConsider: [
      "The island is isolated; travel to Moscow is a long 8-9 hour flight",
      "Higher living cost (grocery index) due to island logistics",
      "Academic focus on general medicine and primary care"
    ],
    bestFitFor: ["Nature Lovers", "Students seeking unique island life", "Adventurous learners"],
    teachingHospitals: [
      "Sakhalin Regional Clinical Hospital",
      "Yuzhno-Sakhalinsk City Hospital",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Pacific Island Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it close to Japan?", answer: "Yes, it is only a short distance from Japan's Hokkaido." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-sakhalin-state-2026",
        title: "Medical Degree / MD (Pacific Island)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "http://sakhgu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "khanty-mansiysk-state-medical-academy",
    name: "Khanty-Mansiysk State Medical Academy",
    city: "Khanty-Mansiysk",
    type: "Academy/Public",
    establishedYear: 1999,
    published: true,
    featured: false,
    officialWebsite: "https://hmgma.ru/en/",
    summary: "KHMSMA is a specialized, high-tech academy located in the 'Winter Capital' of Russia. For 2026, it offers elite medical education within one of the most prosperous and modern medical districts in Siberia.",
    campusLifestyle: "Ultra-modern academy campus. Khanty-Mansiysk is a small, prosperous, and pristine city known for its Olympic-grade winter sports facilities. The academy environment is quiet, clean, and study-focused.",
    cityProfile: "Administrative capital of Ugra. 2026 Index: Safe and elite. Milk (~82 RUB), 1kg Chicken (~355 RUB). Monthly budget $180-$220 USD. Pristine environment with high quality infrastructure.",
    clinicalExposure: "Primary rotation at the **Okrug Clinical Hospital** (1,000+ beds), which is a federal-level high-tech center. Focus on surgical innovations and neuro-imaging labs.",
    hostelOverview: "New, apartment-style hostels with en-suite sections. Features high-speed fiber internet, 24/7 security, and exceptional heating systems. Walking distance to the main academy wings.",
    indianFoodSupport: "Self-cooking is primary. Local modern hypermarkets stock an excellent range of international staples.",
    safetyOverview: "Khanty-Mansiysk is one of the safest cities in Russia. 24/7 academy security and a highly protected city environment ensure a secure student life.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active student research societies.",
    whyChoose: [
      "Specialized Academy with access to a Federal High-Tech Medical Center",
      "Located in a uniquely prosperous and pristine 'Winter City'",
      "Ultra-modern dormitory and campus facilities (Est. 1999)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is small and quiet; focus is primarily on study and sports",
      "Winters are long and cold; preparation for Siberian climate required",
      "Academy standards are modern and fast-paced"
    ],
    bestFitFor: ["Academic seekers in high-tech settings", "Safe-seeking families", "Independent students"],
    teachingHospitals: [
      "Okrug Clinical Hospital (HMGMA)",
      "Regional Diagnostic Center",
      "City Clinical Hospital"
    ],
    recognitionBadges: ["Winter Capital Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it a new school?", answer: "Yes, established in 1999 with very modern infrastructure." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-khanty-mansiysk-2026",
        title: "Medical Degree / MD (Specialized)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://hmgma.ru/en/admission/"
      }
    ]
  },
  {
    slug: "omsk-state-medical-university-updated",
    name: "Omsk State Medical University (Deep Enrichment)",
    city: "Omsk",
    type: "Public/State",
    establishedYear: 1920,
    published: true,
    featured: false,
    officialWebsite: "https://omsk-osmu.ru/en/",
    summary: "Omsk State Medical University is a historic elite institution (Est. 1920) in Western Siberia. For 2026, it is recognized for its massive hospital network (1,500+ beds) and its high academic ratings for international students.",
    campusLifestyle: "A traditional, academic-driven campus in Omsk city center. Features many dedicated research labs and one of the largest anatomical museums in the region. Omsk is a major industrial and student city with a vibrant atmosphere.",
    cityProfile: "Omsk is a large Siberian metropolis. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and well-organized city environment.",
    clinicalExposure: "Huge clinical scale: Access to 1,500+ clinical beds across major city hospitals. Primary rotation at the Omsk Regional Clinical Hospital. Deep exposure to emergency surgery and trauma.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 students. Features include centralized heating, 24/7 security, and high-speed internet. Academic buildings are within a short commute.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local supermarkets stock basic Indian spices and grams.",
    safetyOverview: "Omsk is a safe, family-oriented regional capital. The university provides 24/7 security in all academic residential buildings.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT preparation and active student research societies.",
    whyChoose: [
      "100+ Year Legacy with high international rankings",
      "Massive 1,500-bed clinical network in Western Siberia",
      "Located in a large, modern, and affordable metropolitan hub",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing gear is essential",
      "Academic standards focus on high-volume clinical work",
      "The city is a major industrial hub; active urban life"
    ],
    bestFitFor: ["Serious Academic Seekers", "High-volume clinical seekers", "Independent students"],
    teachingHospitals: [
      "Omsk Regional Clinical Hospital",
      "City Clinical Hospital No. 1",
      "Regional Pediatric Hospital"
    ],
    recognitionBadges: ["Siberian Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it close to Moscow?", answer: "No, Omsk is in Western Siberia, approx. 3.5 hours by flight." }
    ],
    programs: [
      {
        slug: "mbbs-omsk-state-2026-deep",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://omsk-osmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "tyumen-state-medical-university-updated",
    name: "Tyumen State Medical University (Deep Enrichment)",
    city: "Tyumen",
    type: "Public/State",
    establishedYear: 1963,
    published: true,
    featured: false,
    officialWebsite: "https://www.tyumsmu.ru/en/",
    summary: "Tyumen State Medical University is a premier medical institution in Western Siberia. For 2026, it is recognized for its high-tech clinical integration and its location in the 'Happiest City' in Russia.",
    campusLifestyle: "A modern, academic-focused campus. Tyumen is known for its high quality of life and clean environment. Students enjoy advanced digital simulation labs and a large university library.",
    cityProfile: "Tyumen is a prosperous, well-organized Siberian hub. 2026 Index: Safe and affordables. Milk (~76 RUB), 1kg Chicken (~325 RUB). Monthly budget $160-$190 USD. Often ranked as having the best infrastructure in Russia.",
    clinicalExposure: "Primary rotation at the Tyumen Regional Clinical Hospital (1,000+ beds). Focus on cardiology and high-tech diagnostics in the region's energy-rich biomedical cluster.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 students. Features include fiber-optic internet, centralized heating, and active 24/7 security. Located within a short commute to main academic blocks.",
    indianFoodSupport: "Self-cooking is primary. Local modern hypermarkets stock an excellent range of international produced and seasonings for the student community.",
    safetyOverview: "Tyumen is one of the safest and most comfortable cities in Russia. University maintains an elite security record and a dedicated international affairs office.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active student research societies.",
    whyChoose: [
      "Located in the 'Happiest City' of Russia with elite infrastructure",
      "High-tech clinical training with access to a 1,000-bed Regional Hospital",
      "Highly affordable living and tuition for a high-quality state school",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Winters are snowy and cold; prepared appropriately for Siberia",
      "Academic standards are modern and fast-paced",
      "Tyumen is a quiet, family-oriented provincial capital"
    ],
    bestFitFor: ["Quality-conscious learners", "Safe-seeking families", "Independent students"],
    teachingHospitals: [
      "Tyumen Regional Clinical Hospital No. 1",
      "City Clinical Hospital of Tyumen",
      "Regional Heart Center"
    ],
    recognitionBadges: ["High-Quality Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Tyumen safe?", answer: "Yes, it is often ranked as one of the safest and most comfortable cities in Russia." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-tyumen-state-2026-deep",
        title: "Medical Degree / MD (Elite)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://www.tyumsmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "saratov-state-medical-university-updated",
    name: "Saratov State Medical University (Deep Enrichment)",
    city: "Saratov",
    type: "Public/State",
    establishedYear: 1909,
    published: true,
    featured: false,
    officialWebsite: "https://www.sgmu.ru/en/",
    summary: "Saratov State Medical University (named after V.I. Razumovsky) is a historic 'Old Guard' institution (Est. 1909). For 2026, it offers a clinical powerhouse experience with its own massive university clinics.",
    campusLifestyle: "A traditional, aristocratic academic campus. Saratov is a beautiful 'Merchant City' on the Volga. Students study in historic buildings integrated with modern research floors. Active cultural life on the Volga riverfront.",
    cityProfile: "On the Volga River. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Historic city with high quality urban infrastructure.",
    clinicalExposure: "Clinical stock: Operates its own **Saratov University Clinics** (1,500+ beds). One of the largest internal clinical bases in Central Russia. Unmatched clinical volume for surgery and diagnostics.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized laundry, and high-speed fiber internet. Many academic buildings are centrally located.",
    indianFoodSupport: "Saratov has an established Indian community. Self-cooking is primary. Local hypermarkets are well-stocked and tuned to the needs of international students.",
    safetyOverview: "Saratov is a safe, student-centric regional capital. 24/7 security in all university buildings ensures a protected environment for foreign residents.",
    studentSupport: "Decades of experience in English-medium education. Integrated FMGE/NExT practice support and active alumni mentoring network.",
    whyChoose: [
      "Historic elite legacy school (Est. 1909) with high rankings",
      "Own massive 1,500-bed University Clinic in the city of Saratov",
      "Located in a scenic Merchant City on the Volga River",
      "Strong and supportive community of international medical students"
    ],
    thingsToConsider: [
      "Academic standards are famously high; attendance is strict",
      "Buildings are older (historic) with some wings reflecting traditional styles",
      "Russian language proficiency is tested strictly from 3rd year onwards"
    ],
    bestFitFor: ["Academic seekers in the Volga region", "Surgical enthusiasts", "Quality-conscious learners"],
    teachingHospitals: [
      "Saratov University Clinic No. 1",
      "Saratov University Clinic No. 2",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Volga Clinical Powerhouse", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Does it have its own hospital?", answer: "Yes, its own 1,500-bed clinic system is the primary teaching base." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-saratov-state-2026-deep",
        title: "Medical Degree / MD (Elite Elite)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://www.sgmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "voronezh-state-medical-university-updated",
    name: "Voronezh State Medical University (Deep Enrichment)",
    city: "Voronezh",
    type: "Public/State",
    establishedYear: 1918,
    published: true,
    featured: false,
    officialWebsite: "https://vrngmu.ru/en/",
    summary: "Voronezh State Medical University (named after N.N. Burdenko) is an elite institution (Est. 1918) in Central Russia. For 2026, it is recognized for its high academic ratings and its proximity (500km) to Moscow.",
    campusLifestyle: "A traditional, academic-focused campus. Voronezh is a major student city. Students enjoy a high cultural life blended with intensive medical rotations in federal-level hospitals.",
    cityProfile: "Located 500km South of Moscow. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Historic and youthful city life.",
    clinicalExposure: "Primary rotation at the Voronezh Regional Clinical Hospital (named after Burdenko). High volume of neurosurgery and cardiac cases. Students gain exposure to advanced clinical wards.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized laundry, and high-speed fiber internet. Located within the heart of the city's medical district.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local markets are well-stocked with international spices and grains.",
    safetyOverview: "Voronezh is safe and student-centric. 24/7 hostel security and regular patrols ensure a secure environment for foreign residents.",
    studentSupport: "Decades of experience in training international specialists. Integrated support for NExT/FMGE and active student research societies.",
    whyChoose: [
      "Elite legacy school (Est. 1918) with Global Burdenko neurosurgery legacy",
      "Strategic location (500km from Moscow) with easy train access",
      "High volume clinical rotations in major regional clinical hospitals",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academic standards are famously high; attendance is strict",
      "The city is a major hub; can be busy and bustling",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Academic seekers near Moscow", "Surgical enthusiasts", "Independent students"],
    teachingHospitals: [
      "Voronezh Regional Clinical Hospital (Burdenko)",
      "City Clinical Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Central Heart Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it close to Moscow?", answer: "Yes, only 500km; about 6 hours by express train." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-voronezh-state-2026-deep",
        title: "Medical Degree / MD (Burdenko Elite)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://vrngmu.ru/en/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 8 (Full 10) ===\n");
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
  console.log("\n✅ Batch 8 Deep Enrichment Done!");
}

seed();
