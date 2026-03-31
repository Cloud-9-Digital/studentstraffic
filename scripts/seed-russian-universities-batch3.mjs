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
    slug: "samara-state-medical-university",
    name: "Samara State Medical University",
    city: "Samara",
    type: "Public/State",
    establishedYear: 1919,
    published: true,
    featured: false,
    officialWebsite: "https://samsmu.ru/en/",
    summary: "Samara State Medical University (SamSMU) is one of the largest and most prestigious medical universities in Russia. It is a major center for medical education, research, and healthcare in the Volga region. For 2026, it is recognized for its advanced 'IT-Medicine' cluster and innovative surgical technologies.",
    campusLifestyle: "A dynamic urban campus integrated into Samara's historic and modern quarters. Students have access to specialized research institutes, a vast medical library, and professional sports facilities. The university is known for its high-tech simulation centers where students practice digital surgery.",
    cityProfile: "Samara is a major industrial and cultural hub on the Volga River. 2026 Index: Affordable and safe. Milk (~72 RUB), 1kg Chicken (~320 RUB), Metro pass (~2,400 RUB/month). Monthly living budget is approx. $150-$180 USD.",
    clinicalExposure: "SamSMU operates its own multidisciplinary University Clinic with over 1,000 beds. Students rotate through specialized departments including Cardiology, Orthopedics, and the unique 'IT-Medicine' center. High patient volume ensures diverse clinical case exposure from the 3rd year onwards.",
    hostelOverview: "Multiple student hostels are available, with sections dedicated to international students. Rooms are shared by 2-3 students and feature centralized heating, high-speed internet, and shared kitchen/study areas. Security is active 24/7.",
    indianFoodSupport: "Several Indian student groups organize community messes. Local hypermarkets like 'Auchan' and 'Lenta' provide easy access to Indian lentils, spices, and Basmati rice.",
    safetyOverview: "Samara is a secure, student-friendly city. The university provides safety briefings and 24/7 security in all residential blocks. A dedicated international student affairs office handles all legal and safety coordination.",
    studentSupport: "Strong emphasis on academic adaptation. BSMU offers tutorial support for complex medical subjects and holds regular licensing exam (NExT) simulation sessions for Indian seniors.",
    whyChoose: [
      "Own multidisciplinary University Clinic with 1,000+ beds",
      "Leader in Innovative IT-Medicine and Digital Surgery in Russia",
      "Safe and affordable Volga-region lifestyle",
      "Robust academic tradition with over 100 years of history"
    ],
    thingsToConsider: [
      "Rigorous academic schedule with a focus on digital literacy",
      "Public transport is required to reach some specialized clinical sites",
      "The city is large; requires some time for initial urban navigation"
    ],
    bestFitFor: ["Technologically-inclined students", "Serious clinical learners", "Budget-conscious families seeking high clinical volume"],
    teachingHospitals: [
      "SamSMU University Clinics",
      "Samara Regional Clinical Hospital",
      "Regional Cardiology Dispensary"
    ],
    recognitionBadges: ["IT-Medicine Leader", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Does SamSMU have its own hospital?", answer: "Yes, it operates a 1,000-bed multidisciplinary clinical center." },
      { question: "Is the course in English?", answer: "Yes, the full 6-year General Medicine program is offered in English for international students." }
    ],
    programs: [
      {
        slug: "mbbs-samara-state-2026",
        title: "General Medicine / MD (English)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://samsmu.ru/en/education/international/"
      }
    ]
  },
  {
    slug: "saratov-state-medical-university",
    name: "Saratov State Medical University",
    city: "Saratov",
    type: "Public/State",
    establishedYear: 1909,
    published: true,
    featured: false,
    officialWebsite: "https://sgmu.ru/",
    summary: "Saratov State Medical University, named after V.I. Razumovsky, is one of the oldest and most respected medical schools in Russia. For 2026, it remains a top choice for Indian students due to its massive clinical base and long history of international excellence.",
    campusLifestyle: "A historic campus in the city center of Saratov. Students study in majestic 20th-century buildings equipped with modern medical labs. Vibrant student life with many international clubs and annual cultural festivals.",
    cityProfile: "Saratov is a major educational and cultural center on the Volga. 2026 Index: Very budget-friendly. Milk (~70 RUB), 1kg Chicken (~305 RUB). Monthly living cost is one of the lowest among major Russian hubs, around $130-$160 USD.",
    clinicalExposure: "Access to a huge clinical network with over 1,500 beds. Primary bases: the University Clinical Hospital No. 1 and No. 3. Students gain hands-on experience in specialized surgical clinics and emergency departments.",
    hostelOverview: "3-4 dedicated international student hostels. Rooms are functional, shared by 2-3 students. Centralized heating and secure entry via ID cards. Hostels are within easy reach of the main lecture blocks.",
    indianFoodSupport: "Indian students often form messes or cook in groups. Saratov's local markets are well-known for fresh produce and available international spices.",
    safetyOverview: "Saratov is a peaceful, student-centric city. 24/7 security patrols the campus and residential areas. International office provides regular safety and legal updates.",
    studentSupport: "Highly supportive faculty with decades of English-teaching experience. Integrated NExT/FMGE licensing supports and extensive student counseling services.",
    whyChoose: [
      "Founded in 1909; one of Russia's elite 'Old Guard' medical schools",
      "Massive 1,500-bed clinical network with diverse patient volume",
      "Exceptionally low cost of living and tuition",
      "Decades of experience in training Indian medical doctors"
    ],
    thingsToConsider: [
      "Historic buildings may have older infrastructure in some wings",
      "Saratov is 800km from Moscow (Overnight train or short flight)",
      "Russian language is emphasized for clinical years (Years 4-6)"
    ],
    bestFitFor: ["Serious academic students", "Budget-conscious applicants", "Students who appreciate historic academic settings"],
    teachingHospitals: [
      "Saratov University Clinical Hospital No. 1",
      "Razumovsky Clinical Hospital",
      "Saratov Regional Cardiology Center"
    ],
    recognitionBadges: ["Elite Legacy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "What is the tuition fee in Saratov?", answer: "Usually around $5,000 - $5,500 USD per year, inclusive of basic hostel." },
      { question: "Are they NMC compliant?", answer: "Yes, the 6-year English MD program meets all 2021 NMC criteria." }
    ],
    programs: [
      {
        slug: "mbbs-saratov-state-2026",
        title: "Medical Doctor / General Medicine",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://sgmu.ru/en/education/international-students/"
      }
    ]
  },
  {
    slug: "voronezh-state-medical-university",
    name: "Voronezh State Medical University",
    city: "Voronezh",
    type: "Public/State",
    establishedYear: 1918,
    published: true,
    featured: false,
    officialWebsite: "https://vsmaburdenko.ru/en/",
    summary: "Voronezh State Medical University (named after N.N. Burdenko) is a premier medical institution in Russia's 'Black Earth' region. For 2026, it is highly popular for its high academic standards and its proximity to Moscow.",
    campusLifestyle: "A centralized campus in the historic center of Voronezh. Features a highly specialized medical museum and advanced research labs. The city is a major student hub with a youthful and academic vibe.",
    cityProfile: "Voronezh is a large, vibrant city approx. 500km south of Moscow. 2026 Index: Modern and affordable. Milk (~75 RUB), 1kg Chicken (~325 RUB). Monthly budget $160-$190 USD. Very well-connected by high-speed trains to Moscow.",
    clinicalExposure: "Affiliated with over 10 major city hospitals including the Burdenko University Clinic. Students get intensive clinical rotations in neurosurgery (the university's namesake strength) and general trauma.",
    hostelOverview: "Dedicated hostels for international students with 2-3 occupants per room. Features kitchens on each floor, laundry rooms, and 24/7 security. Many academic buildings are within walking distance.",
    indianFoodSupport: "Voronezh has a growing Indian student community with established messes. Local grocery chains like 'Perekrestok' stock major Indian staples.",
    safetyOverview: "Voronezh is very safe and student-oriented. The university maintains a strict safety protocol with 24/7 hostel guards and CCTV monitoring.",
    studentSupport: "Excellent international student board. Provides assistance with legal registration, medical insurance, and integrated FMGE/NExT preparation modules.",
    whyChoose: [
      "Named after N.N. Burdenko, the founder of Russian neurosurgery",
      "Strategic location (500km from Moscow) with high-speed rail access",
      "High academic threshold focusing on deep theoretical and clinical skills",
      "Modern city with a large international student population"
    ],
    thingsToConsider: [
      "Rigorous attendance policies; misses result in academic penalties",
      "Russian language is crucial for the high-volume clinical rounds in Year 4",
      "Weather can be humid in summer and snowy in winter"
    ],
    bestFitFor: ["Academic toppers", "Students seeking proximity to Moscow", "Disciplined clinical learners"],
    teachingHospitals: [
      "Voronezh City Clinical Hospital No. 3 (Burdenko)",
      "Regional Children's Clinical Hospital No. 1",
      "Voronezh Emergency Medical Center"
    ],
    recognitionBadges: ["Burdenko Legacy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Voronezh safe?", answer: "Yes, it is a safe, academic city with a 50+ year history of hosting Indians." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English Medium MD program." }
    ],
    programs: [
      {
        slug: "mbbs-voronezh-state-2026",
        title: "Medical Doctor / MD (Burdenko)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://vsmaburdenko.ru/en/admission/"
      }
    ]
  },
  {
    slug: "ural-state-medical-university",
    name: "Ural State Medical University",
    city: "Yekaterinburg",
    type: "Public/State",
    establishedYear: 1930,
    published: true,
    featured: false,
    officialWebsite: "https://usma.ru/",
    summary: "Ural State Medical University (USMU) is the primary medical hub for the Ural region. Located in Yekaterinburg (Russia's 4th largest city), it offers 2026 aspirants a high-tech education on the border of Europe and Asia.",
    campusLifestyle: "A metropolitan campus in a high-tech city. Students have access to the latest robotic medical equipment and advanced genomics labs. Yekaterinburg offers a massive range of malls, cinemas, and cultural venues for leisure.",
    cityProfile: "Yekaterinburg is the hub of the Urals. 2026 Index: Metropolitan but cheaper than Moscow. Milk (~78 RUB), 1kg Chicken (~340 RUB). Monthly expenses around $180-$220 USD. Excellent public transport (Bus/Tram/Metro).",
    clinicalExposure: "Clinical training at federal-level institutions including the Ural Institute of Cardiology. Students rotate through 20+ specialized clinics across Yekaterinburg, focusing on modern surgery techniques.",
    hostelOverview: "Several student hostels located across the city. International students are placed in modern wings with basic study furniture, internet, and 24/7 security staff.",
    indianFoodSupport: "Yekaterinburg has multiple Indian restaurants and shops selling Indian spices. Students often manage through shared hostel kitchens and city supermarkets.",
    safetyOverview: "Metropolitan safety standards; 24h surveillance and police patrol in university zones. A dedicated office assists international students with city adaptation.",
    studentSupport: "Strong emphasis on medical innovation. USMU offers assistance for research publications and international medical conferences during the course.",
    whyChoose: [
      "Located in Russia's 4th largest city, the heart of the Urals",
      "High-tech clinical training with robotic surgery hubs",
      "Recognized by WHO and compliant with all NMC 2021 norms",
      "Diverse metropolitan lifestyle with high-quality infrastructure"
    ],
    thingsToConsider: [
      "The city is large; requires commuting to various clinical sites",
      "Winter is long and cold in the Urals; preparation is key",
      "Academic standards are modern and fast-paced"
    ],
    bestFitFor: ["Urban enthusiasts", "Students interested in medical technology", "Independent and mature learners"],
    teachingHospitals: [
      "Ural Institute of Cardiology",
      "Regional Clinical Hospital No. 1",
      "City Children's Hospital No. 9"
    ],
    recognitionBadges: ["Metro Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, USMU offers a full 6-year English Medium MD program." },
      { question: "Are fees high?", answer: "No, they typically range between $5,500 - $6,500 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-ural-state-2026",
        title: "Medical Doctor / MD (Ural)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://usma.ru/en/admission/"
      }
    ]
  },
  {
    slug: "tyumen-state-medical-university",
    name: "Tyumen State Medical University",
    city: "Tyumen",
    type: "Public/State",
    establishedYear: 1963,
    published: true,
    featured: false,
    officialWebsite: "https://www.tyumsmu.ru/en/",
    summary: "Tyumen State Medical University (TyumSMU) is a leading institution in Western Siberia, known for its high-quality medical education and its role as a regional healthcare leader.",
    campusLifestyle: "A peaceful and research-oriented campus. Students enjoy the clean and modern infrastructure of Tyumen, which is often ranked as one of the best cities to live in Russia.",
    cityProfile: "Tyumen is a wealthy, modern city in Siberia. 2026 Index: High quality but affordable. Milk (~74 RUB), 1kg Chicken (~315 RUB). Monthly budget $150-$180 USD. Safe and walkable city center.",
    clinicalExposure: "Clinical training across 23 regional medical facilities. Students get exposure to specialized clinical centers focusing on mother-and-child health and trauma surgery.",
    hostelOverview: "Student hostels are clean and secure, primarily shared by 2-3 international students. Features 24/7 security, high-speed Wi-Fi, and centralized heating.",
    indianFoodSupport: "International students primarily cook in groups using shared hostel kitchens. Local markets are well-stocked with seasonal vegetables and grains.",
    safetyOverview: "Tyumen is one of the safest cities in Siberia. University security and local patrols ensure a very low-crime environment for foreign residents.",
    studentSupport: "Dedicated international student office providing guidance on visa, academics, and cultural adaptation. Strong mentor-mentee system for clinical years.",
    whyChoose: [
      "Located in one of Russia's top-rated cities for quality of life",
      "Strong clinical base with access to 23 specialized medical centers",
      "Fully NMC 2021 compliant 6-year English program",
      "Clean, modern, and very safe living environment"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing is essential",
      "Tyumen is a quieter city, ideal for focused study",
      "The university is relatively young (Est. 1963) but modern"
    ],
    bestFitFor: ["Quality-conscious students", "Safe-seeking families", "Students who prefer modern academic settings"],
    teachingHospitals: [
      "Regional Clinical Hospital No. 1 (Tyumen)",
      "City Clinical Emergency Hospital No. 2",
      "Perinatal Center of Tyumen"
    ],
    recognitionBadges: ["Quality of Life", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English Medium General Medicine program." },
      { question: "What are the hostel fees?", answer: "Typically $500 - $800 USD per year depending on the block." }
    ],
    programs: [
      {
        slug: "mbbs-tyumen-state-2026",
        title: "Medical Degree / MD (Tyumen)",
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
    slug: "yaroslavl-state-medical-university",
    name: "Yaroslavl State Medical University",
    city: "Yaroslavl",
    type: "Public/State",
    establishedYear: 1944,
    published: true,
    featured: false,
    officialWebsite: "https://ysmu.ru/en/",
    summary: "Yaroslavl State Medical University is a leading medical school in the Golden Ring region of Russia. For 2026, it offers high-quality training with a focus on regional public health and specialized diagnostics.",
    campusLifestyle: "A peaceful campus in Yaroslavl, a UNESCO World Heritage city. Students enjoy a calm academic environment with access to modern dental and medical clinics. The city is famous for its historic churches and Volga riverfront parks.",
    cityProfile: "Yaroslavl is part of the Golden Ring. 2026 Index: Very affordable. Milk (~74 RUB), Chicken (~320 RUB). Monthly expenses around $140-$170 USD. Safe and culturally rich environment.",
    clinicalExposure: "Primary clinical rotation at the 650-bed Regional Clinical Hospital and the Regional Children's Hospital. Students rotate through 10+ multidisciplinary clinics, gaining hands-on experience in maternity and cardiac care.",
    hostelOverview: "Hostels are functional and safe, sharing rooms by 2-3 international students. Features 24/7 security, centralized heating, and laundry services. Academic buildings are within a 10-15 minute commute.",
    indianFoodSupport: "Self-cooking is common in shared kitchens. Local markets provide a wide variety of grains and seasonal vegetables for Indian students.",
    safetyOverview: "Yaroslavl is one of the safest cities in Central Russia. The university provides safety orientations and maintains strict entry controls in all dormitories.",
    studentSupport: "Comprehensive international student services for visa and insurance. Offers integrated FMGE/NExT practice support and annual medical scientific conferences.",
    whyChoose: [
      "Located in a UNESCO World Heritage city (Golden Ring)",
      "Strong clinical base with access to 650-bed Regional Hospital",
      "Affordable total 6-year package under \u20b925 Lakhs",
      "Peaceful and academic-focused student environment"
    ],
    thingsToConsider: [
      "Smaller urban environment compared to Moscow/Kazan",
      "Academic standards are traditional and rigorous",
      "Slightly cooler climate due to northern Volga location"
    ],
    bestFitFor: ["Budget-conscious learners", "Students seeking peaceful study zones", "History lovers"],
    teachingHospitals: [
      "Yaroslavl Regional Clinical Hospital",
      "Regional Children's Hospital",
      "City Hospital No. 9"
    ],
    recognitionBadges: ["UNESCO City Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English Medium General Medicine program." },
      { question: "Is it close to Moscow?", answer: "Yes, approx. 4 hours by train from Moscow." }
    ],
    programs: [
      {
        slug: "mbbs-yaroslavl-state-2026",
        title: "Medical Degree / MD (Yaroslavl)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://ysmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "northern-state-medical-university",
    name: "Northern State Medical University",
    city: "Arkhangelsk",
    type: "Public/State",
    establishedYear: 1932,
    published: true,
    featured: false,
    officialWebsite: "https://nsmu.ru/en/",
    summary: "Located in the Arctic North, Northern State Medical University (NSMU) is a unique institution specializing in Northern Medicine and high-latitude healthcare. For 2026, it offers a distinct research perspective in clinical medicine.",
    campusLifestyle: "A unique experience on the shores of the White Sea. The campus is compact and academic-heavy. Students participate in the 'Arctic Science' circles. The city offers a unique polar day/night experience during extreme seasons.",
    cityProfile: "Arkhangelsk is the gateway to the Arctic. 2026 Index: Affordable. Milk (~78 RUB), Chicken (~340 RUB). Monthly expenses around $150-$180 USD. Features unique wooden architecture and a cold but clear climate.",
    clinicalExposure: "Clinical training at federal-level Arctic clinics and the Arkhangelsk Regional Hospital. Students get exposure to extreme-environment medicine and specialized cardiovascular care in the North.",
    hostelOverview: "Hostels are very warm and well-insulated for the Arctic climate. Standard sharing by 2-3 students with 24/7 security and high-speed Wi-Fi. Features communal kitchens and study halls.",
    indianFoodSupport: "Common kitchens are well-used for group cooking. Local hypermarkets stock a good variety of pulses and international spices for the resilient student community.",
    safetyOverview: "Very safe and peaceful provincial capital. The student population is highly respected by the local residents. 24/7 campus security is standard.",
    studentSupport: "Dedicated support for cold-climate adaptation and local legalities. Integrated FMGE/NExT support and active student research societies.",
    whyChoose: [
      "Unique specialization in Arctic and extreme-environment medicine",
      "Stable academic environment with a 90-year history",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)",
      "High academic focus and low distractions"
    ],
    thingsToConsider: [
      "Winters are very long and extremely cold; high-spec polar gear is required",
      "Experience of polar night (limited sunlight) in deep winter",
      "Small Indian community compared to Crimea or Moscow"
    ],
    bestFitFor: ["Academic mavericks", "Research-oriented students", "Nature and winter enthusiasts"],
    teachingHospitals: [
      "Arkhangelsk Regional Clinical Hospital",
      "Regional Children's Hospital",
      "City Hospital No. 7"
    ],
    recognitionBadges: ["Arctic Medicine Leader", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it too cold for Indians?", answer: "Indoor heating is excellent (22\u00b0C+), though proper outdoor clothing is essential." },
      { question: "Is the medium English?", answer: "Yes, the full General Medicine course is offered in English." }
    ],
    programs: [
      {
        slug: "mbbs-northern-state-2026",
        title: "Medical Degree / MD (Arctic)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://nsmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "astrakhan-state-medical-university",
    name: "Astrakhan State Medical University",
    city: "Astrakhan",
    type: "Public/State",
    establishedYear: 1918,
    published: true,
    featured: false,
    officialWebsite: "https://astgmu.ru/en/",
    summary: "Astrakhan State Medical University is a historic and elite institution located on the Caspian Sea coast. For 2026, it is a key destination for students seeking a milder climate and a multi-ethnic learning environment.",
    campusLifestyle: "A scenic campus in the 'Venice of the Caspian Gateway.' Students study in a city where European and Asian architectures blend. Very multicultural atmosphere with students from over 40 countries.",
    cityProfile: "Astrakhan is fertile and coastal. 2026 Index: Very affordable. Milk (~72 RUB), Chicken (~310 RUB). Monthly expenses around $130-$160 USD. Milder winters than the rest of Russia.",
    clinicalExposure: "Primary clinical base at the 500-bed Alexander-Mariinsky Regional Hospital. Students rotate through specialized Caspian-region infectious disease and surgical clinics.",
    hostelOverview: "Dedicated international dorms with en-suite sections or shared blocks. Security is handled 24/7 with strict visitor logs. Most hostels are well-connected by city bus.",
    indianFoodSupport: "Astrakhan's local markets are among the best for fresh vegetables and spices due to its trade links with Central/Southern Asia. Self-cooking is common.",
    safetyOverview: "Astrakhan is a safe, multi-ethnic gateway city. The university provides 24/7 security and works closely with the local international affairs board for student safety.",
    studentSupport: "Excellent academic mentoring and support for professional certifications. Offers integrated FMGE/NExT licensing support and active sports clubs.",
    whyChoose: [
      "Founded in 1918; long history of academic and clinical excellence",
      "Milder climate compared to Central/Northern Russia",
      "Affordable total package under \u20b925 Lakhs for 6 years",
      "Highly multicultural and diverse student community"
    ],
    thingsToConsider: [
      "Summers can be quite hot; similar to North India",
      "Academic focus on infectious diseases and tropical medicine is strong",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Students preferring a warmer climate", "Budget-conscious learners", "Multicultural enthusiasts"],
    teachingHospitals: [
      "Alexander-Mariinsky Regional Clinical Hospital",
      "Astrakhan Children's Clinical Hospital",
      "Regional Cardiology Dispensary"
    ],
    recognitionBadges: ["Coastal Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it safe for Indian students?", answer: "Yes, it is a diverse and harmonious city with a long history of hosting Indians." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-astrakhan-state-2026",
        title: "Medical Degree / MD (Caspian)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://astgmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "omsk-state-medical-university",
    name: "Omsk State Medical University",
    city: "Omsk",
    type: "Public/State",
    establishedYear: 1920,
    published: true,
    featured: false,
    officialWebsite: "https://omsk-osmu.ru/en/",
    summary: "Omsk State Medical University is one of the oldest medical schools in Siberia (Est. 1920). For 2026, it is recognized for its high academic ratings and its massive clinical stock in Western Siberia.",
    campusLifestyle: "A sprawling campus in the historic center of Omsk. Features a centralized Simulation Center and one of the largest anatomical museums in the region. The city is a major industrial and student city with many theaters and parks.",
    cityProfile: "Omsk is a large industrial hub on the Irtysh river. 2026 Index: Modern and affordable. Milk (~74 RUB), Chicken (~320 RUB). Monthly expenses around $150-$190 USD. Very safe and well-organized city.",
    clinicalExposure: "Huge clinical base with 1,500+ beds across city and regional clinical hospitals. Students rotate through specialized ophthalmology and trauma clinics known for their innovative treatments.",
    hostelOverview: "Multiple student hostels with 24/7 security, centralized heating, and high-speed Wi-Fi. Many academic buildings are centrally located and easily accessible by public transport.",
    indianFoodSupport: "Common kitchens are the hub of social life. Indian students often group cook. Local markets are well-stocked with seasonal produce and pulses.",
    safetyOverview: "Omsk is a very safe provincial capital. The university provides 24/7 dormitory guards and a comprehensive legal and orientation support for foreign residents.",
    studentSupport: "Excellent teacher-student ratio. Integrated FMGE/NExT licensing preparation support and active student research societies.",
    whyChoose: [
      "Top-tier Siberian university with 100+ years of history",
      "Massive 1,500-bed clinical network with diverse case volume",
      "Recognized globally and fully compliant with NMC FMGL 2021",
      "Safe, modern, and affordable city of Omsk"
    ],
    thingsToConsider: [
      "Siberian winters are cold; proper clothing gear is essential",
      "Strict academic discipline and high attendance requirements",
      "The city is large; requires some commuting for specialized clinics"
    ],
    bestFitFor: ["Academically serious students", "Students seeking high clinical volume", "Independent and mature learners"],
    teachingHospitals: [
      "Omsk Regional Clinical Hospital",
      "City Clinical Hospital No. 1 (Kabanov)",
      "Omsk Children's Clinical Hospital"
    ],
    recognitionBadges: ["Siberian Leader", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English Medium General Medicine program." },
      { question: "Is the degree valid internationally?", answer: "Yes, it is recognized by WHO and ECFMG." }
    ],
    programs: [
      {
        slug: "mbbs-omsk-state-2026",
        title: "Medical Degree / MD (Omsk)",
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
    slug: "rostov-state-medical-university",
    name: "Rostov State Medical University",
    city: "Rostov-on-Don",
    type: "Public/State",
    establishedYear: 1915,
    published: true,
    featured: false,
    officialWebsite: "https://rostgmu.ru/en/",
    summary: "Rostov State Medical University (RostSMU) is the largest medical hub in Southern Russia. For 2026, it is highly favored by Indian students for its clinical excellence and milder Southern climate.",
    campusLifestyle: "A vibrant southern campus on the Don river. Features a dedicated 'International Student Cultural Center' and a very active sports life. The city is warm, friendly, and known for its high-quality food and markets.",
    cityProfile: "Rostov-on-Don is the 'Southern Capital' of Russia. 2026 Index: Affordable and vibrant. Milk (~78 RUB), Chicken (~335 RUB). Monthly expenses around $160-$190 USD. Pleasant climate with shorter winters.",
    clinicalExposure: "Primary clinical base at the 1,000-bed RostSMU University Hospital. Students rotate through 10+ multidisciplinary city clinics, gaining deep exposure to surgery and maternal health.",
    hostelOverview: "Dedicated hostels for international students with 2-3 occupants per room. Features high-speed internet, shared kitchens, and 24/7 security. Centrally located with walking access to many buildings.",
    indianFoodSupport: "Rostov has a significant Indian community. Multiple Indian messes operate in the residential block. Local markets have an abundance of fresh fruit, vegetables, and Indian-friendly spices.",
    safetyOverview: "Rostov is a major metropolitan hub but remains safe for students. The university maintains a strict safety record with 24/7 hostel guards and local police coordination.",
    studentSupport: "Powerful alumni network. BSMU provides integrated support for NExT/FMGE coaching and clinical orientation sessions specifically for foreign students.",
    whyChoose: [
      "Largest and most established medical university in Southern Russia",
      "Own 1,000-bed University Hospital for clinical training",
      "Milder Southern climate with shorter, easier winters",
      "Extensive Indian student community and food (Mess) facilities"
    ],
    thingsToConsider: [
      "The city is a major hub; can be busy and bustling",
      "Academic standards focus on high-volume clinical work",
      "Russian language is crucial for interacting in Southern hospitals"
    ],
    bestFitFor: ["Students preferring a milder climate", "Students seeking high-volume clinical practice", "Families looking for a proven southern brand"],
    teachingHospitals: [
      "RostSMU University Hospital",
      "Rostov Regional Clinical Hospital",
      "Don Clinical Center"
    ],
    recognitionBadges: ["Southern Capital Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the climate cold?", answer: "Slightly warmer than Moscow; winters are shorter but still snowy." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English Medium General Medicine program." }
    ],
    programs: [
      {
        slug: "mbbs-rostov-state-2026",
        title: "Medical Degree / MD (Rostov)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://rostgmu.ru/en/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 3 (Full 10) ===\n");
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
  console.log("\n✅ Batch 3A Deep Enrichment Done!");
}

seed();
