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
    slug: "tambov-state-university-final",
    name: "Tambov State University (Deep Enrichment Final)",
    city: "Tambov",
    type: "Public/State",
    establishedYear: 1918,
    published: true,
    featured: false,
    officialWebsite: "https://www.tsutmb.ru/en/",
    summary: "Tambov State University (named after G.R. Derzhavin) is an elite institution in the heart of the Black Earth region. For 2026, it is recognized for its high academic focus on clinical surgery and cardiovascular health, offering a serene environment for high-intent medical learners.",
    campusLifestyle: "A picturesque riverside campus. Students study in a city that is essentially a living museum. Quiet, academic-focused atmosphere with modern labs and a strong sense of community. The 'Friendship City' environment is ideal for long-term clinical focus.",
    cityProfile: "Tambov is a scenic, family-oriented regional capital. 2026 Index: Extremely affordable. Milk (~72 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $130-$160 USD. Peaceful Lifestyle with high safety rankings.",
    clinicalExposure: "Primary rotation at the **Tambov Regional Clinical Hospital** (800+ beds). Students gain exposure to specialized cancer and cardiovascular centers in the region. High volume of surgical cases ensures deep practical exposure from Year 3 onwards.",
    hostelOverview: "Clean, secure dormitories shared by 2-3 international students. Features 24/7 security, reliable heating, and high-speed Wi-Fi. Hostels are centrally located within the historic university district.",
    indianFoodSupport: "Self-cooking is standard. Local markets are uniquely well-stocked with fresh organic produce and international staples for the student community.",
    safetyOverview: "Tambov is one of the safest cities in Russia. The university provides 24/7 security and a dedicated office for foreign student affairs.",
    studentSupport: "Highly accessible faculty mentors. Integrated support for NExT/FMGE and active student research societies focused on cardiovascular innovation.",
    whyChoose: [
      "Elite university with a 100-year history of medical education",
      "Highly affordable total package under \u20b924 Lakhs total",
      "Safe and family-oriented 'Friendship City' environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller urban environment with a quiet, slow-paced lifestyle",
      "Academic standards are traditional and rigorous",
      "Russian language proficiency is crucial for clinical rounds"
    ],
    bestFitFor: ["Budget-conscious families", "Solo learners", "Nature and history lovers"],
    teachingHospitals: [
      "Tambov Regional Clinical Hospital No. 1",
      "City Clinical Hospital of Tambov",
      "Regional Cardiovascular Center"
    ],
    recognitionBadges: ["Black Earth Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is Tambov safe?", answer: "Extremely. It is a peaceful provincial capital with very low crime." }
    ],
    programs: [
      {
        slug: "mbbs-tambov-state-2026-final",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://www.tsutmb.ru/en/admission/"
      }
    ]
  },
  {
    slug: "ivanovo-medical-academy-final",
    name: "Ivanovo State Medical Academy (Deep Enrichment Final)",
    city: "Ivanovo",
    type: "Academy/Public",
    establishedYear: 1930,
    published: true,
    featured: false,
    officialWebsite: "https://www.isma.ivanovo.ru/en/",
    summary: "Ivanovo State Medical Academy (ISMA) is a prestigious academy with a long history of medical excellence. For 2026, it offers high-achieving students a focused, clinical-led education in the scenic city of Ivanovo, just 300km from Moscow.",
    campusLifestyle: "A traditional academy campus. Students study in a quiet, academic-focused atmosphere with modern simulation labs. Ivanovo is known as 'The City of Brides' and offers a scenic, student-centric environment.",
    cityProfile: "Ivanovo is a quiet and affordable city 300km from Moscow. 2026 Index: Safe and student-friendly. Milk (~74 RUB), 1kg Chicken (~315 RUB). Monthly budget $140-$170 USD. Easy train access to the capital.",
    clinicalExposure: "Primary rotation at the **Ivanovo Regional Clinical Hospital** (1,000+ beds). Focus on general surgery and pediatric innovations. Students gain hands-on experience in specialized clinics from Year 3 onwards.",
    hostelOverview: "Hostels are well-maintained with 2-3 occupants per room. Features centralized heating, 24/7 security, and high-speed Wi-Fi. Located within easy reach of the main academy wings.",
    indianFoodSupport: "Self-cooking is standard. Local hypermarkets stock a good variety of international produced and seasonings for the large student community.",
    safetyOverview: "Ivanovo is very safe and student-oriented. The academy maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active student scientific societies.",
    whyChoose: [
      "Elite legacy Academy (Est. 1930) with specialized status",
      "Strategic proximity to Moscow (300km; 4 hours by train)",
      "Access to a massive 1,000-bed Regional Clinical Hospital",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academy standards are famously strict; attendance is non-negotiable",
      "The city is smaller and quieter; ideal for intense study",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Academic toppers", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Ivanovo Regional Clinical Hospital No. 1",
      "Regional Diagnostic Center",
      "Ivanovo Children's Clinical Hospital"
    ],
    recognitionBadges: ["Elite Academy Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is the degree valid?", answer: "Absolutely, recognized by WHO and NMC." }
    ],
    programs: [
      {
        slug: "mbbs-ivanovo-academy-2026-final",
        title: "Medical Degree / MD (Elite Academy)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://www.isma.ivanovo.ru/en/admission/"
      }
    ]
  },
  {
    slug: "kirov-medical-university-final",
    name: "Kirov State Medical University (Deep Enrichment Final)",
    city: "Kirov",
    type: "Public/State",
    establishedYear: 1987,
    published: true,
    featured: false,
    officialWebsite: "https://kirovgma.ru/en/",
    summary: "Kirov State Medical University is a modern institution recognized for its high-tech academic environment and its own 100-bed clinical station. For 2026, it offers high-achieving students a value-for-money, clinical-led education.",
    campusLifestyle: "A modern urban campus. Features an excellent electronic library system and advanced simulation labs. Kirov is a major student city with a peaceful and academic atmosphere.",
    cityProfile: "A historic city in Central Russia. 2026 Index: Very budget-friendly. Milk (~72 RUB), 1kg Chicken (~315 RUB). Monthly expenses around $140-$170 USD. Safe and very well-organized city environment.",
    clinicalExposure: "Primary rotation at the **Kirov SMU's Own 100-bed Clinical Station** and 20+ affiliated municipal medical establishments. High volume of surgical cases ensures deep practical exposure.",
    hostelOverview: "Hostels are well-maintained with 2-3 occupants per room. Features centralized heating, 24/7 security, and high-speed Wi-Fi. Many buildings are within a short commute to main academic and clinical sites.",
    indianFoodSupport: "Self-cooking is standard. Local markets stock a good variety of international produced and seasonings for the international student community.",
    safetyOverview: "Kirov is an extremely safe provincial capital. The university provides 24/7 security and comprehensive legal and safety orientation.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active student research societies.",
    whyChoose: [
      "Modern State University with its own 100-bed Clinical Station",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Access to 20+ regional municipal clinical hospitals",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Younger institution (Est. 1987) focused on modern methods",
      "Kirov is a quieter city, ideal for focused study",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Budget-conscious families", "Solo learners", "Independent students"],
    teachingHospitals: [
      "Kirov SMU Clinical Station",
      "Kirov Regional Clinical Hospital",
      "City Clinical Emergency Care Hospital"
    ],
    recognitionBadges: ["Quality Value Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English." },
      { question: "What are the fees?", answer: "Approx. $4,500 - $5,000 USD per year total inclusive of hostel." }
    ],
    programs: [
      {
        slug: "mbbs-kirov-state-2026-final",
        title: "Medical Degree / MD (Modern State)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://kirovgma.ru/en/admission/"
      }
    ]
  },
  {
    slug: "altai-medical-university-final",
    name: "Altai State Medical University (Deep Enrichment Final)",
    city: "Barnaul",
    type: "Public/State",
    establishedYear: 1954,
    published: true,
    featured: false,
    officialWebsite: "https://asmu.ru/en/",
    summary: "Altai State Medical University (ASMU) is a premier medical school in Western Siberia. For 2026, it is recognized for its massive hospital network (150+ internship sites) and its affordable, high-quality medical training for international students.",
    campusLifestyle: "A traditional, academic-driven campus in Barnaul. Features several research labs, a massive medical library, and a vibrant community including ~600 Indian students. Quiet and study-focused atmosphere.",
    cityProfile: "Barnaul is a historic Siberian city. 2026 Index: Very budget-friendly. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $130-$160 USD. Peaceful Lifestyle with scenic parks.",
    clinicalExposure: "Primary rotation at **Altai Regional Clinical Hospital** and partnership with 152 internship base hospitals. Students gain deep practical exposure in specialized city clinical hospitals.",
    hostelOverview: "3-4 dedicated hostels for international students. Rooms shared by 2-3 students. Features include centralized heating, 24/7 security, and internet. Easy commute to the university buildings.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local supermarkets stock basic Indian spices and grams due to the large Indian student population.",
    safetyOverview: "Barnaul is a safe, family-oriented regional capital. The university provides 24/7 security and assists with legal registrations.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active mentoring by senior faculty.",
    whyChoose: [
      "Access to a massive 152-hospital internship clinical base",
      "Highly affordable total tuition and living costs",
      "Large and established Indian student community (~600 students)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing gear is essential",
      "Academic focus on traditional medical methods is strong",
      "The city is quieter, ideal for focused students"
    ],
    bestFitFor: ["Budget-conscious families", "Independent students", "Serious clinical learners"],
    teachingHospitals: [
      "Altai Regional Clinical Hospital",
      "Barnaul City Clinical Hospital No. 1",
      "Regional Cardiology Dispensary"
    ],
    recognitionBadges: ["Siberian Powerhouse Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it close to Moscow?", answer: "No, Barnaul is in Western Siberia, approx. 4.5 hours by flight." }
    ],
    programs: [
      {
        slug: "mbbs-altai-state-2026-final",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://asmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "krasnoyarsk-medical-university-final",
    name: "Krasnoyarsk State Medical University (Deep Enrichment Final)",
    city: "Krasnoyarsk",
    type: "Public/State",
    establishedYear: 1942,
    published: true,
    featured: false,
    officialWebsite: "https://krasgmu.ru/index.php?page[en]",
    summary: "Krasnoyarsk State Medical University is an elite institution in Eastern Siberia. For 2026, it is recognized for its high academic ratings and its specialized medical faculties.",
    campusLifestyle: "A dynamic Siberian campus on the Yenisei River. Known for its 'Green Campus' and advanced medical laboratories. The city of Krasnoyarsk is a major student hub with a youthful vibe.",
    cityProfile: "Largest city in Central/Eastern Siberia. 2026 Index: Modern and affordable. Milk (~78 RUB), 1kg Chicken (~340 RUB). Monthly expenses around $160-$190 USD. Scenic environment near Stolby nature reserve.",
    clinicalExposure: "Primary rotation at major city clinical hospitals and the **Krasnoyarsk Regional Clinical Hospital**. Students rotate through specialized wards for oncology/trauma with high patient volume.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized heating, and high-speed Wi-Fi. academic buildings are centrally located.",
    indianFoodSupport: "Indian messes are available on campus due to the growing Indian student population. Local hypermarkets stock international produce and spices.",
    safetyOverview: "Krasnoyarsk is safe and student-oriented. The university maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT licensing preparation and active student research societies.",
    whyChoose: [
      "Elite Siberian university with high international academic ratings",
      "Access to the Krasnoyarsk Regional Clinical Hospital",
      "Located in a scenic riverside city with high quality of life",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are snowy and cold; prepare appropriately",
      "The city is large and busy; requires city navigation",
      "Slightly higher thresholds for academic attendance"
    ],
    bestFitFor: ["Academic seekers in Siberia", "Nature lovers", "Independent students"],
    teachingHospitals: [
      "Krasnoyarsk Regional Clinical Hospital",
      "City Clinical Hospital No. 20",
      "Regional Pediatric Hospital"
    ],
    recognitionBadges: ["Elite Siberian Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "What are the fees?", answer: "Approx. $5,500 USD per year total inclusive of hostel." }
    ],
    programs: [
      {
        slug: "mbbs-krasnoyarsk-state-2026-final",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://krasgmu.ru/eng/admission/"
      }
    ]
  },
  {
    slug: "kemerovo-medical-university-final",
    name: "Kemerovo State Medical University (Deep Enrichment Final)",
    city: "Kemerovo",
    type: "Public/State",
    establishedYear: 1955,
    published: true,
    featured: false,
    officialWebsite: "https://kemsmu.ru/eng/",
    summary: "Kemerovo State Medical University (KemSMU) is a leading institution in Western Siberia. For 2026, it is recognized for its stable clinical base with collaboration across 35 hospitals and over 1,500 beds.",
    campusLifestyle: "A traditional, academic-driven campus in Kemerovo city center on the Tom River. Students spend much of their time in the city's various clinics. Strong focus on practical hand-skills and early patient interaction.",
    cityProfile: "Industrial capital of the Kuzbass region. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and well-organized city.",
    clinicalExposure: "Primary rotation at the **Kemerovo Regional Clinical Hospital** and ~35 affiliated clinics with 1,500+ beds. Focus on trauma, surgery, and cardiology rotations.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features centralized heating, 24/7 security, and internet access. Located within the heart of the city's medical district.",
    indianFoodSupport: "Self-cooking is primary. Local supermarkets stock international produced and seasonings for the international student community.",
    safetyOverview: "Kemerovo is an extremely safe provincial regional capital. The university provides 24/7 security and a dedicated office for foreign student affairs.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active research in regional health and trauma innovaton.",
    whyChoose: [
      "Access to a clinical base of ~35 hospitals and 1,500+ beds",
      "Stable academic environment with high international ratings",
      "Safe, affordable, and academic-focused city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing gear is essential",
      "Academic discipline is notably strict (Theory and Practice)",
      "Russian language is emphasized for clinical rotations"
    ],
    bestFitFor: ["Serious Clinical Seekers", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Kemerovo Regional Clinical Hospital No. 1",
      "City Clinical Emergency Hospital",
      "Regional Cancer Center"
    ],
    recognitionBadges: ["Kuzbass Clinical Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it safe?", answer: "Yes, it is a peaceful, student-centric regional capital." }
    ],
    programs: [
      {
        slug: "mbbs-kemerovo-state-2026-final",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://kemsmu.ru/eng/admission/"
      }
    ]
  },
  {
    slug: "penza-medical-university-final",
    name: "Penza State University (Deep Enrichment Final)",
    city: "Penza",
    type: "Public/State",
    establishedYear: 1943,
    published: true,
    featured: false,
    officialWebsite: "https://pnzgu.ru/en-admission/",
    summary: "Penza State University (PSU) is a leading educational hub in Central Russia. Its Medical Institute offers high-achieving students an elite clinical education with access to a massive network of ~6,000 beds across 8 hospitals.",
    campusLifestyle: "A traditional academic campus in a high-tech city. Features modern simulation labs and a large university library. Penza is known for its peaceful learning environment and high quality of life.",
    cityProfile: "Penza is a modern, high-tech, and very safe city. 2026 Index: Affordable and clean. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly budget $140-$170 USD. Highly peaceful Lifestyle.",
    clinicalExposure: "Primary rotation at the **Penza Regional Clinical Hospital** and ~31 affiliated hospitals (~6,000 total potential beds). Focus on general surgery and pediatric innovations from Year 3 onwards.",
    hostelOverview: "Secure state hostels with 2-3 occupants per room. Features centralized heating, 24/7 security, and high-speed Wi-Fi. Academic buildings are within a short commute.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local markets provide essential grains and international produced.",
    safetyOverview: "Penza is one of the safest cities in the Russian Federation. University provides 24/7 security and a dedicated office for foreign student affairs.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active student research societies.",
    whyChoose: [
      "Access to a massive 6,000-bed clinical network across 8 Hospitals",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Safe, clean, and high-tech academic-focused city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Mid-sized city life; focus is primarily on study and sports",
      "Academic discipline is famously strict; high attendance rules",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Serious Clinical Seekers", "Safe-seeking families", "Independent students"],
    teachingHospitals: [
      "Penza Regional Clinical Hospital No. 1",
      "Regional Children's Clinical Hospital",
      "City Clinical Emergency Care Hospital"
    ],
    recognitionBadges: ["Central Russia Clinical Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English." },
      { question: "How many beds?", answer: "Access to approx. 6,000 clinical beds in the city's network." }
    ],
    programs: [
      {
        slug: "mbbs-penza-state-2026-final",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://pnzgu.ru/en-admission/"
      }
    ]
  },
  {
    slug: "ulyanovsk-university-final",
    name: "Ulyanovsk State University (Deep Enrichment Final)",
    city: "Ulyanovsk",
    type: "Public/State",
    establishedYear: 1988,
    published: true,
    featured: false,
    officialWebsite: "https://ulsu.ru/en/",
    summary: "Ulyanovsk State University (USU) is a modern, high-tech institution in the Volga region. For 2026, it offers high-achieving students an elite medical education integrated with 26 regional medical institutions.",
    campusLifestyle: "A modern urban campus. Features an excellent electronic library system and advanced simulation labs. Ulyanovsk is a scenic riverside city known for its safety and peaceful academic vibe.",
    cityProfile: "On the Volga River. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and clean city environments.",
    clinicalExposure: "Primary rotation at the **Ulyanovsk Regional Clinical Hospital** and ~26 regional medical institutions. Students gain hands-on experience in specialized clinics from Year 3 onwards.",
    hostelOverview: "Hostels are well-maintained with 2-3 occupants per room. Features high-speed fiber internet, shared kitchens, and 24/7 security. Located within a short commute to main academic and clinical sites.",
    indianFoodSupport: "Self-cooking is standard. Local hypermarkets stock a good variety of international produce and spices for the student community.",
    safetyOverview: "Ulyanovsk is very safe and student-oriented. The university maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active student research societies.",
    whyChoose: [
      "Modern Volga university with access to 26 clinical institutions",
      "Highly affordable total package under \u20b924 Lakhs total",
      "Safe, clean, and scenic riverside city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Younger institution (Est. 1988) focused on modern methods",
      "The city is mid-sized; focus is primarily on study and history",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Quality-conscious learners", "Safe-seeking families", "Independent students"],
    teachingHospitals: [
      "Ulyanovsk Regional Clinical Hospital",
      "City Clinical Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Modern Volga Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it close to Kazan?", answer: "Yes, only a few hours away by express bus/train." }
    ],
    programs: [
      {
        slug: "mbbs-ulyanovsk-state-2026-final",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://ulsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "perm-medical-university-final",
    name: "Perm State Medical University (Deep Enrichment Final)",
    city: "Perm",
    type: "Public/State",
    establishedYear: 1916,
    published: true,
    featured: true,
    officialWebsite: "https://psma.ru/en/",
    summary: "Perm State Medical University (named after E.A. Vagner) is one of the oldest and largest elite medical institutions in Russia. For 2026, it offers a prestigious, clinical-heavy education with access to 9 major affiliated hospitals.",
    campusLifestyle: "A traditional, aristocratic academic campus. Perm is a major 'Theatre and Cultural' city. Students enjoy a high cultural life blended with intensive medical rotations in federal-level clinics.",
    cityProfile: "On the Kama River (Urals/Volga border). 2026 Index: Safe and modern. Milk (~76 RUB), 1kg Chicken (~325 RUB). Monthly budget $160-$190 USD. Vibrant urban life with European infrastructure.",
    clinicalExposure: "Primary rotation at the **Perm Regional Clinical Hospital (Vagner)** and ~9 affiliated clinical hospitals in the city. Access to specialized cardiovascular and trauma centers.",
    hostelOverview: "Dedicated international student hostels (High-rise). Rooms shared by 2-3 students. Features include centralized heating, 24/7 security, and high-speed fiber internet.",
    indianFoodSupport: "Several Indian messes operate on campus due to the large Indian student community (~1,500 students). Local supermarkets stock a wide variety of spices.",
    safetyOverview: "Perm is a safe, student-centric metropolitan hub. 24/7 security in academic wings and residential blocks ensures a protected life.",
    studentSupport: "Decades of experience in English-medium education. Integrated support for NExT/FMGE and active alumni mentoring network.",
    whyChoose: [
      "Elite legacy school (Est. 1916) with Global Tier rankings",
      "Access to a 9-hospital Clinical Network in the city of Perm",
      "Massive Indian student community (~1,500) and messes",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academic standards are famously high; attendance is strict",
      "Buildings are historical; focus on traditional medical training",
      "The city is large and cultural; requires urban navigation"
    ],
    bestFitFor: ["Academic Seekers", "Surgical enthusiasts", "Quality-conscious learners"],
    teachingHospitals: [
      "Perm Regional Clinical Hospital (Vagner)",
      "Perm City Clinical Hospital No. 4",
      "Regional Cardiovascular Center"
    ],
    recognitionBadges: ["Ural Elite Legacy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is there an Indian Mess?", answer: "Yes, Perm has multiple well-established Indian messes on campus." }
    ],
    programs: [
      {
        slug: "mbbs-perm-state-2026-final",
        title: "Medical Degree / MD (Elite Legacy)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://psma.ru/en/admission/"
      }
    ]
  },
  {
    slug: "izhevsk-medical-academy-final",
    name: "Izhevsk State Medical Academy (Deep Enrichment Final)",
    city: "Izhevsk",
    type: "Academy/Public",
    establishedYear: 1933,
    published: true,
    featured: false,
    officialWebsite: "https://igma.ru/en/",
    summary: "Izhevsk State Medical Academy (ISMA) is a prestigious academy with a long history of training international specialists. For 2026, it offers high-achieving students a focused, clinical-led education with access to 28 clinical bases.",
    campusLifestyle: "A traditional academy campus in the heart of Izhevsk (the 'Armory Capital'). Quiet, academic-focused atmosphere with modern simulation labs. Located in a scenic environment with high security.",
    cityProfile: "Izhevsk is a safe and affordable industrial capital. 2026 Index: Modern and clean. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe student-centric city life.",
    clinicalExposure: "Primary rotation at major city hospitals and **28 clinical bases** across the Udmurt Republic. Clinical training starts with theory-practice integration from Year 3 onwards.",
    hostelOverview: "3-4 dedicated dormitories for international students. Features include centralized heating, 24/7 security, and high-speed Wi-Fi. Located within walking distance to main academy wings.",
    indianFoodSupport: "Self-cooking is primary. Local hypermarkets stock a good variety of international staples and seasonings for the large student community.",
    safetyOverview: "Izhevsk is very safe and student-oriented. The academy maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active student research societies.",
    whyChoose: [
      "Elite legacy Academy (Est. 1933) with specialized status",
      "Access to a clinical base of 28 Regional Hospitals",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academy standards focus heavily on clinical discipline",
      "Izhevsk is a quieter city, ideal for focused study",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Academic Seekers", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Izhevsk Regional Clinical Hospital No. 1",
      "Udmurt Regional Cardiac Center",
      "City Clinical Emergency Hospital"
    ],
    recognitionBadges: ["Armory Elite Academy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "What are the fees?", answer: "Approx. $5,000 USD per year total inclusive of hostel." }
    ],
    programs: [
      {
        slug: "mbbs-izhevsk-academy-2026-final",
        title: "Medical Degree / MD (Elite Academy)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://igma.ru/en/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 10 (FINAL) ===\n");
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
        JSON.stringify(uni.best_fit_for ?? uni.bestFitFor), uni.teachingHospitals, uni.recognitionBadges,
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
  console.log("\n✅ Batch 10 Deep Enrichment Done!");
}

seed();
