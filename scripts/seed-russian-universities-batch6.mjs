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
    slug: "altai-state-medical-university",
    name: "Altai State Medical University",
    city: "Barnaul",
    type: "Public/State",
    establishedYear: 1954,
    published: true,
    featured: false,
    officialWebsite: "https://asmu.ru/en/",
    summary: "Altai State Medical University (ASMU) is a premier medical school in Western Siberia. For 2026, it is recognized for its massive hospital network (150+ internship sites) and its affordable, high-quality medical training for international students.",
    campusLifestyle: "A traditional, academic-driven campus in Barnaul. The university features several dedicated research labs, a large medical library, and a vibrant student community including ~600 Indian students. Barnaul is a medium-sized Siberia city with a quiet and study-focused atmosphere.",
    cityProfile: "Barnaul is a historic Siberian city. 2026 Index: Very budget-friendly. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly living expenses around $130-$160 USD. Peaceful Lifestyle with scenic parks.",
    clinicalExposure: "Unmatched clinical scale with partnership with 150+ internship hospitals. Students gain hands-on experience in high-volume regional clinical hospitals, focusing on primary care and general surgery.",
    hostelOverview: "3-4 dedicated hostels for international students. Rooms are shared by 2-3 students and feature centralized heating, security guards, and high-speed internet. Hostels are within easy commute to the main campus wings.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local supermarkets stock basic Indian spices and grams due to the established Indian community.",
    safetyOverview: "Barnaul is a safe, family-oriented regional capital. The university provides 24/7 security in dorms and assists with all local registrations and safety orientations.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active academic mentoring by senior faculty.",
    whyChoose: [
      "Vast clinical network with 152 affiliated internship hospitals",
      "Highly affordable total tuition and living costs",
      "Large and established Indian student community (~600 students)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper polar gear is required",
      "Academic focus on traditional medical methods is strong",
      "Barnaul is a quieter city, ideal for focused study"
    ],
    bestFitFor: ["Budget-conscious families", "Independent students", "Disciplined clinical learners"],
    teachingHospitals: [
      "Altai Regional Clinical Hospital",
      "Barnaul City Clinical Hospital No. 1",
      "Regional Cardiology Dispensary"
    ],
    recognitionBadges: ["Clinical Powerhouse", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English Medium MD program." },
      { question: "Is it close to Moscow?", answer: "No, Barnaul is in Western Siberia, several hours by flight from Moscow." }
    ],
    programs: [
      {
        slug: "mbbs-altai-state-2026",
        title: "Medical Degree / MD (Altai)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://asmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "krasnoyarsk-state-medical-university",
    name: "Krasnoyarsk State Medical University",
    city: "Krasnoyarsk",
    type: "Public/State",
    establishedYear: 1942,
    published: true,
    featured: false,
    officialWebsite: "https://krasgmu.ru/index.php?page[en]",
    summary: "Krasnoyarsk State Medical University (named after Prof. V.F. Voyno-Yasenetsky) is an elite institution in Eastern Siberia. For 2026, it is recognized for its high academic ratings and its specialized medical faculties.",
    campusLifestyle: "A dynamic Siberian campus on the Yenisei River. Known for its 'Green Campus' and advanced medical laboratories. The city of Krasnoyarsk is a major student hub with a youthful and academic vibe.",
    cityProfile: "Largest city in Central/Eastern Siberia. 2026 Index: Modern and affordable. Milk (~78 RUB), 1kg Chicken (~340 RUB). Monthly expenses around $160-$190 USD. Very scenic with nearby nature reserves (Stolby).",
    clinicalExposure: "Primary rotations at major city clinical hospitals and the university's the Regional Clinical Hospital. Students get intensive clinical rotations in general surgery and trauma.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized heating, and high-speed Wi-Fi. Many academic buildings are centrally located.",
    indianFoodSupport: "Indian messes are available on campus due to the growing Indian student population. Local markets stock major international staples.",
    safetyOverview: "Krasnoyarsk is safe and student-oriented. The university maintains a strict safety protocol with 24/7 hostel guards.",
    studentSupport: "Excellent teacher-student ratio. Integrated FMGE/NExT licensing preparation support and active student research societies.",
    whyChoose: [
      "Elite Siberian university with high international academic ratings",
      "Located in a scenic riverside city with high quality of life",
      "Established Indian student community with mess facilities",
      "Fully compliant with NMC FMGL 2021 guidelines (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are snowy and cold; prepare appropriately",
      "Strategic distance from Moscow (approx. 5-hour flight)",
      "High academic thresholds; attendance and tests are strict"
    ],
    bestFitFor: ["Academic seekers in Siberia", "Nature lovers", "Quality-conscious learners"],
    teachingHospitals: [
      "Krasnoyarsk Regional Clinical Hospital",
      "City Clinical Hospital No. 20",
      "Regional Pediatric Hospital"
    ],
    recognitionBadges: ["Siberian Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it close to nature?", answer: "Yes, the Stolby nature reserve is a very popular weekend spot." }
    ],
    programs: [
      {
        slug: "mbbs-krasnoyarsk-state-2026",
        title: "Medical Degree / MD (Krasnoyarsk)",
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
    slug: "kirov-state-medical-university",
    name: "Kirov State Medical University",
    city: "Kirov",
    type: "Public/State",
    establishedYear: 1987,
    published: true,
    featured: false,
    officialWebsite: "https://kirovgma.ru/en/",
    summary: "Kirov State Medical Academy (now University) is a modern institution. For 2026, it is recognized for its high-tech academic environment and its own 100-bed clinical station in the peaceful city of Kirov.",
    campusLifestyle: "A modern urban campus. Features an excellent electronic library system and advanced simulation labs. Kirov is a major student city with a peaceful and academic atmosphere.",
    cityProfile: "A historic city in Central Russia. 2026 Index: Very budget-friendly. Milk (~72 RUB), 1kg Chicken (~315 RUB). Monthly expenses around $140-$170 USD. Safe and very well-organized.",
    clinicalExposure: "Primary rotation at Kirov SMU's Own 100-bed Clinical Station and major city hospitals. High volume of surgical cases ensures deep practical exposure from Year 3 onwards.",
    hostelOverview: "Hostels are well-maintained with 2-3 occupants per room. Features centralized heating, 24/7 security, and high-speed Wi-Fi. many academy buildings are within a 15-minute commute.",
    indianFoodSupport: "Self-cooking is standard. Local markets stock a good variety of international staples and seasonings.",
    safetyOverview: "Kirov is an extremely safe provincial capital. University provides 24/7 security and comprehensive legal and safety orientation.",
    studentSupport: "Excellent teacher-to-student ratio due to being a specialized academy. Integrated support for NExT/FMGE licensing preparation.",
    whyChoose: [
      "Modern academy featuring its own 100-bed Clinical Station",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)",
      "Safe, affordable, and academic-focused city environment"
    ],
    thingsToConsider: [
      "Younger university (Est. 1987) focused on modern methods",
      "Kirov is a quieter city, ideal for focused study",
      "Continental climate with snowy winters"
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
      { question: "What are the fees?", answer: "Approx. $5,000 USD per year total inclusive of hostel." }
    ],
    programs: [
      {
        slug: "mbbs-kirov-state-2026",
        title: "Medical Degree / MD (Kirov)",
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
    slug: "perm-state-medical-university",
    name: "Perm State Medical University",
    city: "Perm",
    type: "Public/State",
    establishedYear: 1916,
    published: true,
    featured: true,
    officialWebsite: "https://psma.ru/en/",
    summary: "Perm State Medical University (named after E.A. Vagner) is one of the oldest and largest elite medical institutions in Russia. For 2026, it offers a prestigious, clinical-heavy education with access to 9 major affiliated hospitals.",
    campusLifestyle: "A traditional, aristocratic-style academic campus. Perm is a major 'Theatre and Cultural' city. Students enjoy a high cultural life blended with intensive medical rotations in federal-level clinics.",
    cityProfile: "On the Kama River (Urals/Volga border). 2026 Index: Safe and modern. Milk (~76 RUB), 1kg Chicken (~325 RUB). Monthly budget $160-$190 USD. Vibrant urban life with European infrastructure.",
    clinicalExposure: "Primary rotation at the university's 9 affiliated clinical hospitals. High volume of specialized surgical cases. Students gain exposure to advanced cardiac and vascular surgery wards.",
    hostelOverview: "Dedicated international student hostels (High-rise). Rooms shared by 2-3 students. Features 24/7 security, centralized laundry, and high-speed fiber internet.",
    indianFoodSupport: "Several Indian messes operate on campus due to the large Indian student community. Local supermarkets have a long history of stocking major Indian spices.",
    safetyOverview: "Perm is a safe, student-centric metropolitan hub. 24/7 hostel security and regular patrols ensure a secure environment for foreign residents.",
    studentSupport: "Decades of experience in English-medium education. Integrated FMGE/NExT preparation and active alumni mentoring network.",
    whyChoose: [
      "Founded in 1916; elite legacy school with high rankings",
      "Access to a 9-hospital Clinical Network in the city of Perm",
      "Vibrant cultural life in a safe, European-standard city",
      "Strong and supportive community of 1,500+ Indian students"
    ],
    thingsToConsider: [
      "Academic standards are famously high; requires total dedication",
      "Buildings are historic; some wings reflect traditional styles",
      "Weather is continental; snowy winters are standard"
    ],
    bestFitFor: ["Academic seekers in the Urals", "Quality-conscious learners", "Students seeking high clinical volume"],
    teachingHospitals: [
      "Perm Regional Clinical Hospital (Vagner)",
      "Perm City Clinical Hospital No. 4",
      "Regional Cardiovascular Center"
    ],
    recognitionBadges: ["Elite Legacy Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is there an Indian Mess?", answer: "Yes, Perm has multiple well-established Indian messes on campus." }
    ],
    programs: [
      {
        slug: "mbbs-perm-state-2026",
        title: "Medical Degree / MD (Perm)",
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
    slug: "stavropol-state-medical-university",
    name: "Stavropol State Medical University",
    city: "Stavropol",
    type: "Public/State",
    establishedYear: 1938,
    published: true,
    featured: false,
    officialWebsite: "https://stgmu.ru/en/",
    summary: "Stavropol State Medical University (StSMU) is a premier medical institution in Southern Russia. For 2026, it is highly favored for its massive international student body and its picturesque southern climate.",
    campusLifestyle: "A vibrant southern campus in Stavropol. Students enjoy a milder climate and a very active sports culture including outdoor stadiums. The city is clean, green, and safe.",
    cityProfile: "South Russian city near the Caucasus mountains. 2026 Index: Modern and affordable. Milk (~78 RUB), 1kg Chicken (~330 RUB). Monthly expenses around $150-$180 USD. Sunny and student-friendly environment.",
    clinicalExposure: "Primary rotation at the Stavropol Regional Clinical Hospital and City Hospital No. 1. Students rotate through specialized wards for oncology and cardiology with high patient inflow.",
    hostelOverview: "Dedicated hostels for international students with 2-3 occupants per room. Features 24/7 security, centralized heating, and in-house social rooms. Most academic buildings are within walking distance.",
    indianFoodSupport: "Excellent Indian food support: Stavropol has multiple Indian messes and students cook in groups. Local markets have an abundance of fresh produce and Indian spices.",
    safetyOverview: "Stavropol is very safe and student-oriented. The university maintains a strict safety record with 24/7 hostel guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT licensing preparation and active alumni mentoring network.",
    whyChoose: [
      "Highly established Indian student community and food support",
      "Milder Southern climate with easier winters (South Russia)",
      "High quality clinical exposure in a safe, green city hub",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is mid-sized; focus is primarily on study and history",
      "Academic focus on theoretical and clinical surgery is strong",
      "Russian language is crucial for interacted clinical rounds in Year 4"
    ],
    bestFitFor: ["Students preferring a milder climate", "Budget-conscious learners", "Multicultural enthusiasts"],
    teachingHospitals: [
      "Stavropol Regional Clinical Hospital No. 1",
      "City Clinical Emergency Hospital",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Southern Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the climate warm?", answer: "Yes, compared to Northern Russia; winters are shorter and easier." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-stavropol-state-2026",
        title: "Medical Degree / MD (Stavropol)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://stgmu.ru/eng/admission/"
      }
    ]
  },
  {
    slug: "ulyanovsk-state-university",
    name: "Ulyanovsk State University",
    city: "Ulyanovsk",
    type: "Public/State",
    establishedYear: 1988,
    published: true,
    featured: false,
    officialWebsite: "https://ulsu.ru/en/",
    summary: "Ulyanovsk State University (USU) is a modern, high-tech institution in the Volga region. For 2026, it is recognized for its elite 'IT-Integrated' medical education and its scenic location on the Volga River.",
    campusLifestyle: "A modern urban campus. Features an excellent electronic library system and advanced simulation labs. Ulyanovsk is a scenic riverside city with many parks and museums.",
    cityProfile: "On the Volga River. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and clean city environments.",
    clinicalExposure: "Primary rotation at the Ulyanovsk Regional Clinical Hospital and City Hospital No. 1. Students rotate through specialized wards for oncology and cardiology.",
    hostelOverview: "Hostels are well-maintained with 2-3 occupants per room. Features high-speed internet, shared kitchens, and 24/7 security. Located within easy commute to main academic and clinical sites.",
    indianFoodSupport: "Self-cooking is standard. Local hypermarkets stock a good variety of international produce and spices.",
    safetyOverview: "Ulyanovsk is very safe and student-oriented. The university maintains a strict safety record with 24/7 hostel guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active student research societies.",
    whyChoose: [
      "Modern Volga university with high-tech clinical integration",
      "Highly affordable total package under \u20b924 Lakhs total",
      "Safe, clean, and scenic riverside city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Younger university (Est. 1988) focused on modern methods",
      "Ulyanovsk is a mid-sized city with a focus on peace and study",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Safe-seeking families", "Technology enthusiasts", "Independent students"],
    teachingHospitals: [
      "Ulyanovsk Regional Clinical Hospital",
      "City Clinical Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Modern Volga Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." },
      { question: "Is it close to Kazan?", answer: "Yes, Kazan is only a few hours away by bus/train." }
    ],
    programs: [
      {
        slug: "mbbs-ulyanovsk-state-2026",
        title: "Medical Degree / MD (Ulyanovsk)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://ulsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "penza-state-university",
    name: "Penza State University",
    city: "Penza",
    type: "Public/State",
    establishedYear: 1943,
    published: true,
    featured: false,
    officialWebsite: "https://pnzgu.ru/en-admission/",
    summary: "Penza State University (PSU) is a leading educational hub in Central Russia. Its Medical Institute is a top-tier center for medical science and clinical training for international students in the peaceful city of Penza.",
    campusLifestyle: "A traditional academic campus in a high-tech city. Students enjoy a peaceful learning environment with advanced digital simulation labs and a large university library complex.",
    cityProfile: "Penza is a modern, high-tech, and very safe city. 2026 Index: Affordable and clean. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly budget $140-$170 USD. Highly peaceful Lifestyle.",
    clinicalExposure: "Primary rotation at the Penza Regional Clinical Hospital and specialized cancer and cardiac centers. High volume of surgical cases ensures deep practical exposure from Year 3 onwards.",
    hostelOverview: "Secure state hostels with 2-3 occupants per room. Features centralized heating, 24/7 security, and internet. Academic buildings are within a short commute.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local markets provide essential grains and seasonings.",
    safetyOverview: "Penza is one of the safest cities in the Russian Federation. University provides 24/7 security and comprehensive legal and safety orientation.",
    studentSupport: "Accessible faculty and dedicated international department for visa and registration. Offers integrated support for medical licensing exams.",
    whyChoose: [
      "Access to a high-volume 1,500-bed clinical network in Penza",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Safe, clean, and academic-focused city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is mid-sized; focus is primarily on study and history",
      "Academic standards are traditional and rigorous",
      "Russian language is emphasized for clinical rotations"
    ],
    bestFitFor: ["Budget-conscious families", "Independent students", "Disciplined clinical learners"],
    teachingHospitals: [
      "Penza Regional Clinical Hospital No. 1",
      "Regional Children's Clinical Hospital",
      "City Clinical Emergency Care Hospital"
    ],
    recognitionBadges: ["Central Russia Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English." },
      { question: "What are the fees?", answer: "Approx. $4,500 - $5,000 USD per year total inclusive of hostel." }
    ],
    programs: [
      {
        slug: "mbbs-penza-state-2026",
        title: "Medical Degree / MD (Penza)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://pnzgu.ru/en-admission/"
      }
    ]
  },
  {
    slug: "tambov-state-university",
    name: "Tambov State University",
    city: "Tambov",
    type: "Public/State",
    establishedYear: 1918,
    published: true,
    featured: false,
    officialWebsite: "https://www.tsutmb.ru/en/",
    summary: "Tambov State University (named after G.R. Derzhavin) is an elite institution in the heart of the Black Earth region. For 2026, it is recognized for its high academic focus on clinical surgery and cardiovascular health.",
    campusLifestyle: "A picturesque riverside campus. Students study in a city that is essentially a living museum. Quiet, academic-focused atmosphere with modern labs and a strong sense of community.",
    cityProfile: "Tambov is a scenic, family-oriented regional capital. 2026 Index: Very affordable. Milk (~72 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $130-$160 USD. Peaceful Lifestyle.",
    clinicalExposure: "Primary rotation at the Tambov Regional Clinical Hospital (800+ beds). Students gain exposure to specialized cancer and cardiovascular centers in the region.",
    hostelOverview: "Clean, secure dormitories shared by 2-3 international students. Features 24/7 security, reliable heating, and internet. Hostels are centrally located.",
    indianFoodSupport: "Self-cooking is standard. Local markets are well-stocked with fresh produce and international staples for the student community.",
    safetyOverview: "Tambov is one of the safest cities in Russia. The university provides 24/7 security and works closely with local authorities to ensure a protected environment.",
    studentSupport: "Highly accessible faculty mentors. Integrated support for NExT/FMGE and active student research societies.",
    whyChoose: [
      "Elite university with a 100-year history of education",
      "Highly affordable total package under \u20b922 Lakhs",
      "Safe and family-oriented 'Friendship City' environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller urban environment with a quiet lifestyle",
      "Academic standards are traditional and rigorous",
      "Tambov is a quieter city, ideal for focused study"
    ],
    bestFitFor: ["Budget-conscious families", "Solo learners", "Nature and history lovers"],
    teachingHospitals: [
      "Tambov Regional Clinical Hospital No. 1",
      "City Clinical Hospital of Tambov",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Black Earth Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Tambov safe?", answer: "Extremely. It is a peaceful provincial capital with very low crime." },
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English." }
    ],
    programs: [
      {
        slug: "mbbs-tambov-state-2026",
        title: "Medical Degree / MD (Tambov)",
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
    slug: "ivanovo-state-medical-academy",
    name: "Ivanovo State Medical Academy",
    city: "Ivanovo",
    type: "Academy/Public",
    establishedYear: 1930,
    published: true,
    featured: false,
    officialWebsite: "https://www.isma.ivanovo.ru/en/",
    summary: "Ivanovo State Medical Academy (ISMA) is a prestigious academy with a long history of medical excellence. For 2026, it offers high-achieving students a focused, clinical-led education in the scenic city of Ivanovo.",
    campusLifestyle: "A traditional academy campus in the heart of Ivanovo ('The City of Brides'). Quiet, academic-focused atmosphere with modern labs and a strong sense of community.",
    cityProfile: "Ivanovo is a quiet and affordable city just 300km from Moscow. 2026 Index: Safe and student-friendly. Milk (~74 RUB), 1kg Chicken (~315 RUB). Monthly budget $140-$170 USD. Scenic environment.",
    clinicalExposure: "Primary rotation at the Ivanovo Regional Clinical Hospital (1,000+ beds). Focus on general surgery and pediatric innovations. Students gain hands-on experience in specialized clinics.",
    hostelOverview: "Hostels are well-maintained with 2-3 occupants per room. Features centralized heating, 24/7 security, and high-speed Wi-Fi. Academic buildings are within easy reach.",
    indianFoodSupport: "Self-cooking is standard. Local hypermarkets stock a good variety of international staples and seasonings for the student community.",
    safetyOverview: "Ivanovo is very safe and student-oriented. The academy maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio due to being a specialized academy. Integrated support for NExT/FMGE licensing preparation.",
    whyChoose: [
      "Elite legacy Academy (Est. 1930) with specialized status",
      "Strategic proximity to Moscow (300km) with easy train access",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is smaller and quieter; primarily academic",
      "Academic discipline is famously strict (Academy style)",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Academic toppers", "Budget-conscious families", "Solo learners"],
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
        slug: "mbbs-ivanovo-academy-2026",
        title: "Medical Degree / MD (Ivanovo)",
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
    slug: "kemerovo-state-medical-university",
    name: "Kemerovo State Medical University",
    city: "Kemerovo",
    type: "Public/State",
    establishedYear: 1955,
    published: true,
    featured: false,
    officialWebsite: "https://kemsmu.ru/eng/",
    summary: "Kemerovo State Medical University (KemSMU) is a leading institution in Western Siberia. For 2026, it is recognized for its high academic ratings and its specialized medical research center.",
    campusLifestyle: "A traditional, academic-driven campus in Kemerovo city center on the Tom River. Students spend much of their time in the city's various clinics. Strong focus on practical hand-skills and early patient interaction.",
    cityProfile: "Industrial capital of the Kuzbass region. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and well-organized city.",
    clinicalExposure: "Primary rotation at the Kemerovo Regional Clinical Hospital and City Hospital No. 1. Students rotate through specialized wards for oncology/trauma with high patient volume.",
    hostelOverview: "Dedicated hostels for international students with 2-3 occupants per room. Features centralized heating, 24/7 security, and internet. Hostels are centrally located.",
    indianFoodSupport: "Common kitchens are well-used for group cooking. Local supermarkets stock international staples and spices.",
    safetyOverview: "Kemerovo is an extremely safe provincial regional capital. University provides 24/7 security and comprehensive legal and safety orientation.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active research in regional health issues.",
    whyChoose: [
      "Leading Western Siberian medical university with high ratings",
      "Stable clinical base with access to major regional hospitals",
      "Safe, affordable, and academic-focused city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing gear is essential",
      "Strict academic discipline and high attendance requirements",
      "Distance from Moscow is significant"
    ],
    bestFitFor: ["Academic focused learners", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Kemerovo Regional Clinical Hospital No. 1",
      "City Clinical Emergency Hospital",
      "Regional Cancer Center"
    ],
    recognitionBadges: ["Kuzbass Region Leader", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it safe?", answer: "Yes, it is a peaceful, student-centric regional capital." }
    ],
    programs: [
      {
        slug: "mbbs-kemerovo-state-2026",
        title: "Medical Degree / MD (Kemerovo)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://kemsmu.ru/eng/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 6 (Full 10) ===\n");
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
  console.log("\n✅ Batch 6 Deep Enrichment Done!");
}

seed();
