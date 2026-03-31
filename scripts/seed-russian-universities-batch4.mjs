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
    slug: "far-eastern-federal-university",
    name: "Far Eastern Federal University",
    city: "Vladivostok",
    type: "Public/Federal",
    establishedYear: 1899,
    published: true,
    featured: true,
    officialWebsite: "https://www.dvfu.ru/en/",
    summary: "Far Eastern Federal University (FEFU) is the premier educational hub of the Russian Far East. Located on the high-tech Russky Island campus, it offers 2026 medical aspirants a unique, island-based education with its own ultra-modern Medical Center.",
    campusLifestyle: "Unlike any other Russian campus, FEFU is situated on Russky Island. It is a 'smart campus' featuring seafront walkways, high-tech lecture halls, and Olympic-grade sports facilities. The campus hosted the APEC summit and offers a resort-like study environment with private beaches and parks.",
    cityProfile: "Vladivostok is Russia's 'San Francisco,' a major port city on the Pacific. 2026 Index: Modern and affordable. Milk (~82 RUB), 1kg Chicken (~360 RUB), Metro/Bus (~35-40 RUB). Monthly expenses approx. $180-$220 USD. High-speed internet is excellent.",
    clinicalExposure: "Primary rotation at the **FEFU Medical Center**, which is one of the most advanced digital hospitals in Russia (Robotic surgery, 200+ beds). Students also rotate at the Primorsky Regional Clinical Hospital (1,000+ beds) for diverse trauma and surgical cases.",
    hostelOverview: "Campus hostels are essentially 3-star hotels. Rooms are modern, shared by 2 students, with en-suite bathrooms and fiber-optic Wi-Fi. Located within walking distance of the Medical Center and academic blocks.",
    indianFoodSupport: "FEFU has several international canteens and cafes. Indian students often cook together in dormitory kitchens. Vladivostok markets offer high-quality fresh seafood and imported Asian spices.",
    safetyOverview: "The Russky Island campus is 100% gated with facial recognition entry for residents. It is arguably the safest university environment in the entire Russian Federation.",
    studentSupport: "Elite administrative support. The International Department assists with high-level academic networking and internships. Integrated FMGE/NExT preparation modules through senior mentoring rounds.",
    whyChoose: [
      "Russia's most modern 'Smart Campus' on Russky Island",
      "Own ultra-modern FEFU Medical Center (Robotic & Digital Surgery)",
      "Breathtaking coastal environment with private beaches",
      "Elite federal status with high global recognition"
    ],
    thingsToConsider: [
      "Weather can be windy and foggy due to the coastal location",
      "Vladivostok is a 9-hour flight from Moscow",
      "Campus is secluded on an island (though well-connected by bridge)"
    ],
    bestFitFor: ["Premium-seekers", "Technology enthusiasts", "Students seeking the safest possible campus"],
    teachingHospitals: [
      "FEFU Medical Center",
      "Primorsky Regional Clinical Hospital No. 1",
      "Vladivostok City Clinical Hospital No. 2"
    ],
    recognitionBadges: ["Smart Campus", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it safe on Russky Island?", answer: "Extremely. It is a gated federal zone with 24/7 security and restricted access." },
      { question: "Is the degree valid in India?", answer: "Yes, it is 100% NMC compliant for the 2026-27 intake." }
    ],
    programs: [
      {
        slug: "mbbs-far-eastern-federal-2026",
        title: "Medical Degree / MD (Federal)",
        durationYears: 6,
        annualTuitionUsd: 7500,
        totalTuitionUsd: 45000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://www.dvfu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "pacific-state-medical-university",
    name: "Pacific State Medical University",
    city: "Vladivostok",
    type: "Public/State",
    establishedYear: 1958,
    published: true,
    featured: false,
    officialWebsite: "http://tgmu.ru/",
    summary: "Pacific State Medical University (PSMU) is a specialized medical institution located in the heart of Vladivostok. It offers a standardized, practical-focused curriculum with deep roots in the regional healthcare system of Primorsky Krai.",
    campusLifestyle: "A traditional urban campus integrated into central Vladivostok. Students spend much of their time in the city's various clinics. Strong focus on practical hand-skills and early patient interaction.",
    cityProfile: "Central Vladivostok location. 2026 Index: Very active urban life. Milk (~80 RUB), 1kg Chicken (~350 RUB). Monthly expenses $170-$200 USD. Walking distance to many historic sites and the seafront.",
    clinicalExposure: "Broad clinical network including the Primorsky Regional Clinical Hospital (1,000 beds) and Vladivostok City Hospital No. 1. Specialized rotations in Emergency Medicine and Infectious diseases.",
    hostelOverview: "Standard state-style hostels (Dormitories 1-3). Rooms shared by 2-3 students. Safe, functional, and centrally located within the city transit network.",
    indianFoodSupport: "Self-cooking is the primary mode. Students have easy access to the local 'Central Market' for fresh items and imported Asian pulses and grains.",
    safetyOverview: "Urban safety is high with 24/7 dormitory guards and regular city police patrols in the academic district. The university provides full legal and medical orientation.",
    studentSupport: "Very accessible faculty. PSMU holds regular student scientific conferences and provides support for licensing exam preparation for Indian students.",
    whyChoose: [
      "In-depth clinical practice in major regional city hospitals",
      "Located in central Vladivostok with easy beach and city access",
      "Affordable tuition for a 6-year English MD program",
      "Fully compliant with NMC FMGL 2021 criteria"
    ],
    thingsToConsider: [
      "Buildings are spread across the city requiring commuting",
      "Traditional academic style with high emphasis on memorization",
      "Humid coastal climate with cold, snowy winters"
    ],
    bestFitFor: ["Budget-conscious students", "Urban city lovers", "Practical-first learners"],
    teachingHospitals: [
      "Primorsky Regional Clinical Hospital No. 1",
      "Vladivostok City Clinical Hospital No. 1",
      "Regional Cardiology Center"
    ],
    recognitionBadges: ["Coastal Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English for international students." },
      { question: "What are the hostel fees?", answer: "Roughly $500 - $800 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-pacific-state-2026",
        title: "Medical Degree / MD (Pacific)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "http://tgmu.ru/admission/"
      }
    ]
  },
  {
    slug: "irkutsk-state-medical-university",
    name: "Irkutsk State Medical University",
    city: "Irkutsk",
    type: "Public/State",
    establishedYear: 1919,
    published: true,
    featured: false,
    officialWebsite: "https://ismu.baikal.ru/",
    summary: "Irkutsk State Medical University (ISMU) is one of the oldest and most respected medical schools in Siberia, located near the world-famous Lake Baikal. For 2026, it offers a high academic standard in a scenic and peaceful Siberian hub.",
    campusLifestyle: "A traditional academic atmosphere. Students enjoy the historic charm of Irkutsk ('The Paris of Siberia'). The campus is famous for its intensive study culture and close proximity to the Angara River.",
    cityProfile: "Gateway to Lake Baikal. 2026 Index: Very affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses $140-$170 USD. A safe, authentic Siberian city with a rich cultural history.",
    clinicalExposure: "Primary base at the **Irkutsk Regional Clinical Hospital** (1,200+ beds). Students gain deep exposure to surgery, internal medicine, and pediatrics in this high-volume regional center.",
    hostelOverview: "Standard university dormitories with 2-3 students per room. Centralized heating is highly reliable for Siberian winters. Hostels are secure and integrated with student study rooms.",
    indianFoodSupport: "Common kitchens are well-used. Local markets stock a good range of seasonal vegetables and international rice. Growing Indian student community supports local messes.",
    safetyOverview: "Irkutsk is a peaceful, family-oriented regional capital. The university provides 24/7 dormitory security and assists with all local registrations and safety orientations.",
    studentSupport: "Strong emphasis on theoretical foundations. ISMU provides integrated NExT/FMGE licensing supports and active student research societies.",
    whyChoose: [
      "Historic elite university (Est. 1919) with high academic ratings",
      "Primary clinical rotation at a 1,200-bed Regional Hospital",
      "Located near Lake Baikal, the world's largest freshwater lake",
      "Very affordable 6-year total package for Indian families"
    ],
    thingsToConsider: [
      "Siberian winters are long and very cold; high-spec thermals are a must",
      "Academic grading is strict; requires consistent self-study",
      "City is about a 6-hour flight from Moscow"
    ],
    bestFitFor: ["Serious academic learners", "Budget-conscious families", "Nature and Baikal enthusiasts"],
    teachingHospitals: [
      "Irkutsk Regional Clinical Hospital",
      "Irkutsk City Clinical Hospital No. 1",
      "Regional Pediatric Hospital"
    ],
    recognitionBadges: ["Baikal Gateway", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English Medium General Medicine program." },
      { question: "How far is Lake Baikal?", answer: "Only about 60-70 km; an easy weekend trip for students." }
    ],
    programs: [
      {
        slug: "mbbs-irkutsk-state-2026",
        title: "Medical Degree / MD (Siberian)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://ismu.baikal.ru/en/admission/"
      }
    ]
  },
  {
    slug: "smolensk-state-medical-university",
    name: "Smolensk State Medical University",
    city: "Smolensk",
    type: "Public/State",
    establishedYear: 1920,
    published: true,
    featured: true,
    officialWebsite: "https://smolgmu.ru/en/",
    summary: "Smolensk State Medical University (SSMU) is a highly experienced 'Old Guard' institution with one of the largest clinical networks in Central Russia. For 2026, it is a top-tier choice for Indian students due to its proximity to Moscow and massive 6,000-bed hospital network.",
    campusLifestyle: "A traditional, academic-focused campus. Featuring 8 hostels and many lecture halls within a compact urban setting. Smolensk is a peaceful, historic 'Hero City' with a large and active Indian student community.",
    cityProfile: "Located 400km West of Moscow. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses $150-$180 USD. Historic city with fortress walls and beautiful cathedrals.",
    clinicalExposure: "Massive clinical scale with 31 affiliated hospitals and 6,000+ total beds. Primary bases include the Smolensk Regional Clinical Hospital and the City Emergency Hospital. Deep exposure to emergency surgery and trauma.",
    hostelOverview: "8 hostels in total; international students reside in recently renovated blocks with 2-3 per room. Features 24/7 security, centralized laundry, and shared kitchens. Walking distance to main lecture centers.",
    indianFoodSupport: "Smolensk is very 'Indian-friendly'. Multiple canteens serve Indian food. Local shops stock Indian staples due to the 1,000+ Indian student population.",
    safetyOverview: "Smolensk is very safe and student-centric. The university has a dedicated Security Department and strict hostel entry protocols (magnetic IDs).",
    studentSupport: "Decades of experience in managing international students. Integrated FMGE/NExT practice support and active academic mentoring by senior faculty.",
    whyChoose: [
      "Vast clinical network of 6,000+ beds across 31 hospitals",
      "Strategic location (400km from Moscow) with easy train access",
      "Large and established Indian student community (1,000+)",
      "High academic rating and decades of experience in English teaching"
    ],
    thingsToConsider: [
      "Buildings are older (historic) with some wings reflecting traditional styles",
      "Academic threshold is high; attendance and tests are strict",
      "Weather is continental; snowy winters and humid summers"
    ],
    bestFitFor: ["Academic seekers", "Students seeking high clinical volume", "Disciplined learners"],
    teachingHospitals: [
      "Smolensk Regional Clinical Hospital",
      "City Clinical Emergency Hospital",
      "Regional Cardiology Center"
    ],
    recognitionBadges: ["Clinical Powerhouse", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English Medium MD program." },
      { question: "Is there an Indian mess?", answer: "Yes, Smolensk has multiple well-established Indian messes on/near campus." }
    ],
    programs: [
      {
        slug: "mbbs-smolensk-state-2026",
        title: "Medical Degree / MD (Smolensk)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://smolgmu.ru/address-to-international-students/"
      }
    ]
  },
  {
    slug: "ryazan-state-medical-university",
    name: "Ryazan State Medical University",
    city: "Ryazan",
    type: "Public/State",
    establishedYear: 1943,
    published: true,
    featured: false,
    officialWebsite: "https://www.rzgmu.ru/en/",
    summary: "Ryazan State Medical University (named after Pavlov) is a highly modern medical institution located just 200km from Moscow. For 2026, it offers a high-tech academic environment and excellent clinical rotations in a high-volume regional hub.",
    campusLifestyle: "A modern urban campus. Features an excellent electronic library system and advanced simulation labs. Ryazan is a major industrial and student city with many theaters, malls, and a youthful vibe.",
    cityProfile: "Strategic proximity to Moscow (3 hours by train). 2026 Index: Modern yet affordable. Milk (~76 RUB), 1kg Chicken (~330 RUB). Monthly expenses $170-$200 USD. Safe and very well-connected city.",
    clinicalExposure: "Affiliated with over 30 clinical bases. Primary rotation at the **Ryazan Regional Clinical Hospital** (1,240 beds). High volume of surgical and cardiac cases ensures deep practical exposure.",
    hostelOverview: "Hostels are well-maintained with 2-3 students per room. Features high-speed internet, shared kitchens, and 24/7 security. Located within easy commute to main academic and clinical sites.",
    indianFoodSupport: "International student canteens are available. Local markets stock a good range of international staples and Indian-friendly spices.",
    safetyOverview: "Ryazan is a safe, modern city. The university maintains a strict safety record with 24/7 hostel guards and local police coordination.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT licensing preparation support and active student research societies.",
    whyChoose: [
      "Strategic proximity to Moscow (200km; 3-hour train ride)",
      "High clinical volume with a 1,240-bed Regional Clinical Hospital",
      "Modern, IT-integrated academic delivery and simulation labs",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Ryazan is a big industrial city with high-paced life",
      "Academic standards focus on high-volume clinical work",
      "Russian language is crucial for interacting in Ryazan hospitals"
    ],
    bestFitFor: ["Students wanting to stay near Moscow", "Students seeking high-volume clinical practice", "Quality-conscious learners"],
    teachingHospitals: [
      "Ryazan Regional Clinical Hospital",
      "Regional Pediatric Clinical Hospital",
      "Ryazan City Hospital No. 8"
    ],
    recognitionBadges: ["Moscow Gateway Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English Medium General Medicine program." },
      { question: "Is it close to Moscow?", answer: "Yes, only 200km; many students visit Moscow for weekends." }
    ],
    programs: [
      {
        slug: "mbbs-ryazan-state-2026",
        title: "Medical Degree / MD (Ryazan)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://www.rzgmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "tver-state-medical-university",
    name: "Tver State Medical University",
    city: "Tver",
    type: "Public/State",
    establishedYear: 1936,
    published: true,
    featured: true,
    officialWebsite: "https://tvgmu.ru/en/",
    summary: "Tver State Medical University (TSMU) is one of the most established medical schools in Central Russia, with a 60-year history of training international students. For 2026, it offers a prestigious, clinical-heavy education halfway between Moscow and St. Petersburg.",
    campusLifestyle: "A highly disciplined academic campus. Tver is a peaceful historical city. The university is famous for its intensive clinical rounds and its own Dental Clinic. Large international community with active cultural societies.",
    cityProfile: "Halfway between Moscow and St. Petersburg (180km to Moscow). 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~325 RUB). Monthly budget $160-$190 USD. Scenic location on the Volga River.",
    clinicalExposure: "10 major city hospitals provided access to 6,000+ beds. Primary base: the Tver Regional Clinical Hospital. Renowned for its excellence in Dental and Surgical training.",
    hostelOverview: "Dedicated hostels for international students (Dorms 1-4). Rooms shared by 2-3 students. Features 24/7 security, centralized heating, and in-house canteens. Very close to major clinical sites.",
    indianFoodSupport: "Excellent Indian food support: Tver is well-known for its various Indian canteens. Local markets have a long history of stocking major Indian spices and dals.",
    safetyOverview: "Tver is a quiet, academic city. 24/7 hostel security and regular patrols ensure a secure environment for foreign residents.",
    studentSupport: "Decades of experience in English-medium education. Integrated FMGE/NExT preparation and active alumni mentoring network.",
    whyChoose: [
      "Historic elite status with over 60 years of English-medium expertise",
      "Massive 6,000-bed clinical network and own Dental Clinic",
      "Strategic location halfway between Moscow and St. Petersburg",
      "One of the best Indian food/mess support systems in Russia"
    ],
    thingsToConsider: [
      "Academic standards are famously high; requires total dedication",
      "Russian language proficiency is tested strictly from 3rd year onwards",
      "Historic city life is quiet; ideal for study but less nightlife"
    ],
    bestFitFor: ["Academic toppers", "Surgical and Dental enthusiasts", "Students seeking proximity to major hubs"],
    teachingHospitals: [
      "Tver Regional Clinical Hospital",
      "Tver City Clinical Hospital No. 1",
      "University Dental Clinic"
    ],
    recognitionBadges: ["Elite Legacy Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it close to Moscow?", answer: "Yes, about 2-3 hours by express train." }
    ],
    programs: [
      {
        slug: "mbbs-tver-state-2026",
        title: "Medical Degree / MD (Tver)",
        durationYears: 6,
        annualTuitionUsd: 7000,
        totalTuitionUsd: 42000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://tvgmu.ru/eng/education/international-students/"
      }
    ]
  },
  {
    slug: "far-eastern-state-medical-university",
    name: "Far Eastern State Medical University",
    city: "Khabarovsk",
    type: "Public/State",
    establishedYear: 1930,
    published: true,
    featured: false,
    officialWebsite: "https://fesmu.ru/",
    summary: "Far Eastern State Medical University (FESMU) is a specialized medical institution in the Amur River region. For 2026, it offers a high clinical volume and elite training in public health and infectious diseases.",
    campusLifestyle: "Traditional educational campus in the scenic Khabarovsk city center. Students enjoy the riverfront views and a peaceful Siberian academic culture.",
    cityProfile: "On the Amur River, near the China border. 2026 Index: Affordable and unique. Milk (~78 RUB), 1kg Chicken (~340 RUB). Monthly expenses $160-$190 USD. Safe and clean city.",
    clinicalExposure: "Primary rotation at the Khabarovsk Regional Clinical Hospital (1,000+ beds) and specialized children's clinics. Focus on regional epidemiological cases.",
    hostelOverview: "Standard state hostels with 2-3 students per room. Features reliable heating, secure entry, and central laundry facilities.",
    indianFoodSupport: "Self-cooking is primary. Local markets stock fresh river fish, vegetables, and imported Asian spices.",
    safetyOverview: "Khabarovsk is a safe, family-oriented regional capital. The university provides 24/7 security and comprehensive legal orientation.",
    studentSupport: "Access to regional research grants and active student scientific labs. Integrated support for international medical licensing preparation.",
    whyChoose: [
      "Leading medical school in the Far East (Khabarovsk region)",
      "High clinical volume with a 1,000-bed regional hospital",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)",
      "Scenic, peaceful, and clean riverside city environment"
    ],
    thingsToConsider: [
      "Very cold winters (-25\u00b0C to -35\u00b0C); polar gear required",
      "Khabarovsk is far from Moscow (8-hour flight)",
      "Academic focus on traditional medical methods is strong"
    ],
    bestFitFor: ["Academic seekers in the Far East", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Khabarovsk Regional Clinical Hospital No. 1",
      "City Clinical Hospital No. **10**",
      "Regional Pediatric Center"
    ],
    recognitionBadges: ["Amur Region Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English Medium MD program." },
      { question: "Is it close to China?", answer: "Yes, Khabarovsk is right on the China border." }
    ],
    programs: [
      {
        slug: "mbbs-habarovsk-state-2026",
        title: "Medical Degree / MD (Far East)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://fesmu.ru/eng/admission/"
      }
    ]
  },
  {
    slug: "amur-state-medical-academy",
    name: "Amur State Medical Academy",
    city: "Blagoveshchensk",
    type: "Academy/Public",
    establishedYear: 1952,
    published: true,
    featured: false,
    officialWebsite: "https://www.amursma.ru/",
    summary: "Amur State Medical Academy is an elite 'specialized' medical school on the China border. For 2026, it is recognized for its high academic focus on clinical surgery and cardiovascular health.",
    campusLifestyle: "Silent and academic-focused. Students enjoy a unique view of China across the river. The city is peaceful, safe, and very walkable.",
    cityProfile: "On the Amur river. 2026 Index: Very affordable. Milk (~74 RUB), 1kg Chicken (~315 RUB). Monthly budget $130-$160 USD. Very quiet provincial life.",
    clinicalExposure: "Primary rotation at the Amur Regional Clinical Hospital. Known for its strong cardiovascular surgical wing and dedicated student practical labs.",
    hostelOverview: "Clean, well-guarded dormitories. International students share rooms by 2-3. Reliable heating and security are top priorities.",
    indianFoodSupport: "Self-cooking is standard. Local markets carry a good range of fresh produce and Asian groceries.",
    safetyOverview: "Extremely safe border city with low crime rates. University security is active 24/7.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active research in regional health issues.",
    whyChoose: [
      "Specialized Academy status following elite surgical standards",
      "Unique location on the China border with a serene academic vibe",
      "Highly affordable total package under \u20b922 Lakhs",
      "Fully compliant with NMC FMGL 2021 guidelines (6 years)"
    ],
    thingsToConsider: [
      "The city is small and quiet; less urban entertainment",
      "Cold winters; preparation for Siberian climate required",
      "Distance to Moscow is extensive"
    ],
    bestFitFor: ["Academic-first students", "Budget-conscious families", "Nature lovers"],
    teachingHospitals: [
      "Amur Regional Clinical Hospital",
      "City Clinical Hospital of Blagoveshchensk",
      "Regional Cardiovascular Center"
    ],
    recognitionBadges: ["Border Academy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "What are the fees?", answer: "Usually between $4,500 - $5,000 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-amur-academy-2026",
        title: "Medical Degree / MD (Amur)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://www.amursma.ru/en/admission/"
      }
    ]
  },
  {
    slug: "chita-state-medical-academy",
    name: "Chita State Medical Academy",
    city: "Chita",
    type: "Academy/Public",
    establishedYear: 1953,
    published: true,
    featured: false,
    officialWebsite: "https://chitgma.ru/",
    summary: "Chita State Medical Academy is a specialized medical institution in the Transbaikal region. For 2026, it offers a focused, research-intensive medical education with a strong emphasis on dental and surgical excellence.",
    campusLifestyle: "Quiet, academic environment in the heart of Chita. Students focus heavily on theory and pre-clinical practice in the academy's modern labs.",
    cityProfile: "Transbaikal capital. 2026 Index: Very affordable. Milk (~75 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $140-$170 USD. Sunny but cold winters.",
    clinicalExposure: "Affiliated with the Transbaikal Regional Clinical Hospital and specialized dental clinics. Focus on regional public health and surgical innovations.",
    hostelOverview: "Secure state hostels with shared kitchens and study halls. Rooms shared by 2-3 students. Centralized heating and security are standard.",
    indianFoodSupport: "Self-cooking is the primary mode. Local markets provide essential grains and seasonal produce.",
    safetyOverview: "Safe provincial city with a friendly local population. University provides 24/7 security and orientation.",
    studentSupport: "Excellent mentoring and assistance for licensing exam preparation. Active student research societies and sports clubs.",
    whyChoose: [
      "Specialized Academy focusing on surgical and dental excellence",
      "Affordable total package in the peaceful Transbaikal region",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)",
      "High academic focus with specialized regional clinical bases"
    ],
    thingsToConsider: [
      "Chita is a smaller provincial capital with quiet lifestyle",
      "Winters are dry and cold; skin-care and warm gear required",
      "Strategic distance from major metropolises like Moscow"
    ],
    bestFitFor: ["Academic focused learners", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Transbaikal Regional Clinical Hospital",
      "Chita City Clinical Hospital No. 1",
      "Academy Dental Clinic"
    ],
    recognitionBadges: ["Transbaikal Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." },
      { question: "Is the academy recognized?", answer: "Yes, by WHO and NMC." }
    ],
    programs: [
      {
        slug: "mbbs-chita-academy-2026",
        title: "Medical Degree / MD (Chita)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://chitgma.ru/en/admission/"
      }
    ]
  },
  {
    slug: "izhevsk-state-medical-academy",
    name: "Izhevsk State Medical Academy",
    city: "Izhevsk",
    type: "Academy/Public",
    establishedYear: 1933,
    published: true,
    featured: false,
    officialWebsite: "https://igma.ru/en/",
    summary: "Izhevsk State Medical Academy (ISMA) is a prestigious academy in the Udmurt Republic. For 2026, it is recognized for its high academic standards and its focus on intensive clinical rotations in regional hospitals.",
    campusLifestyle: "A traditional and academic campus in the city center of Izhevsk ('The Armory Capital'). Students enjoy a peaceful, study-intensive atmosphere with access to modern medical labs.",
    cityProfile: "Capital of Udmurtia. 2026 Index: Safe and affordable. Milk (~72 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $140-$170 USD. Clean, green city with many parks and museums.",
    clinicalExposure: "Primary clinical rotation at the Udmurtia Regional Clinical Hospital and specialized cardiac centers. Focus on surgical and orthopedic innovations.",
    hostelOverview: "Standard university hostels with 2-3 students per room. Features 24/7 security, centralized heating, and shared kitchens. Academic buildings are easily accessible.",
    indianFoodSupport: "Self-cooking is the primary mode. Local hypermarkets stock international staples and Indian-friendly spices for the student community.",
    safetyOverview: "Izhevsk is one of the safest cities in the Volga-Ural region. University security and regular patrols ensure a secure environment for foreign residents.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active student scientific labs.",
    whyChoose: [
      "Academy status reflecting elite academic standards",
      "Highly affordable total package under \u20b925 Lakhs for 6 years",
      "Stable clinical base with access to major regional hospitals",
      "Safe, affordable, and academic-focused city environment"
    ],
    thingsToConsider: [
      "Izhevsk is a quiet, industrial-academic city; less nightlife",
      "Academic discipline is famously strict; requires total focus",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Academic seekers", "Budget-conscious families", "Serious clinical learners"],
    teachingHospitals: [
      "Udmurtia Regional Clinical Hospital No. 1",
      "City Clinical Hospital No. 2",
      "Regional Cardiology Center"
    ],
    recognitionBadges: ["Academy Status", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "What are the fees?", answer: "Usually between $5,500 - $6,000 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-izhevsk-academy-2026",
        title: "Medical Degree / MD (Izhevsk)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://igma.ru/en/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 4 (Full 10) ===\n");
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
  console.log("\n✅ Batch 4 Deep Enrichment Done!");
}

seed();
