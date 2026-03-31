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
    slug: "tula-state-university",
    name: "Tula State University",
    city: "Tula",
    type: "Public/State",
    establishedYear: 1930,
    published: true,
    featured: false,
    officialWebsite: "https://tulsu.ru/en/",
    summary: "Tula State University (TSU) is a major educational and scientific center in Central Russia. Its Medical Institute is renowned for its high-quality medical education and strong clinical training in the historic city of Tula. For 2026, it offers a stable and affordable platform for Indian medical students.",
    campusLifestyle: "A centralized campus in Tula, known for its mix of traditional Russian architecture and modern student facilities. Students have access to a massive library, sports complexes, and various cultural clubs. Proximity to Moscow (180km) makes it a strategic choice for international residents.",
    cityProfile: "Tula is famous for its Kremlin and samovars. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Excellent rail links to Moscow (2.5 hours).",
    clinicalExposure: "Primary clinical rotation at the Tula Regional Clinical Hospital and City Clinical Hospital No. 1. Students gain hands-on experience in 10+ affiliated medical institutions with a combined capacity of over 1,000 beds.",
    hostelOverview: "Hostels are functional and secure, sharing rooms by 2-3 students. Features include centralized heating, 24/7 security, and high-speed internet. Located within a short commute to the main Medical Institute buildings.",
    indianFoodSupport: "Self-cooking is standard. Local hypermarkets like 'Magnit' stock seasonal vegetables, rice, and pulses. Several cafes in the city center offer international cuisine options.",
    safetyOverview: "Tula is a safe, family-oriented regional capital. The university provides 24/7 security in dormitories and works closely with local authorities to ensure a protected environment.",
    studentSupport: "Dedicated international student office providing assistance with visa registration, health insurance, and academic orientation. Integrated support for NExT/FMGE preparation.",
    whyChoose: [
      "Strategic proximity to Moscow (180km) with excellent transport links",
      "Network of 10+ teaching hospitals providing 1,000+ beds",
      "Highly affordable total tuition and living costs",
      "Safe and historic Central Russian city environment"
    ],
    thingsToConsider: [
      "Academic standards are traditional and rigorous",
      "Tula is a quieter city compared to Moscow or St. Petersburg",
      "Russian language is emphasized for clinical rotations"
    ],
    bestFitFor: ["Budget-conscious families", "Students seeking proximity to Moscow", "Disciplined clinical learners"],
    teachingHospitals: [
      "Tula Regional Clinical Hospital",
      "Tula City Clinical Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Moscow Gateway", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Tula safe for Indians?", answer: "Yes, it is a peaceful, historic city with a long history of hosting international students." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English Medium MD program." }
    ],
    programs: [
      {
        slug: "mbbs-tula-state-2026",
        title: "Medical Doctor / MD (Tula)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://tulsu.ru/en/education/medical-institute/"
      }
    ]
  },
  {
    slug: "pskov-state-university",
    name: "Pskov State University",
    city: "Pskov",
    type: "Public/State",
    establishedYear: 1932,
    published: true,
    featured: false,
    officialWebsite: "https://pskgu.ru/en/",
    summary: "Pskov State University is a major educational hub in Western Russia, bordering the European Union. For 2026, its Medical Faculty offers a high-quality education in one of Russia's oldest and most historic cities.",
    campusLifestyle: "A picturesque riverside campus. Students study in a city that is essentially a living museum. Quiet, academic-focused atmosphere with modern labs and a strong sense of community.",
    cityProfile: "Pskov is a scenic, ancient fortress city near the border with Estonia and Latvia. 2026 Index: Very affordable. Milk (~72 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $130-$160 USD. Peaceful Lifestyle.",
    clinicalExposure: "Primary clinical rotation at the Pskov Regional Clinical Hospital (550+ beds). Students rotate through specialized regional clinics focusing on emergency care and general surgery.",
    hostelOverview: "Secure state hostels with 2-3 occupants per room. Features reliable heating, security guards, and internet. Many hostels are located in the historic city center.",
    indianFoodSupport: "Self-cooking is standard. Local markets are well-stocked with fresh produce and international staples.",
    safetyOverview: "Pskov is one of the safest cities in Russia's Northwest. The university provides 24/7 security and comprehensive legal and safety orientation.",
    studentSupport: "Accessible faculty and dedicated international department for visa and registration. Offers integrated support for medical licensing exams.",
    whyChoose: [
      "Located in one of Russia's most historic and scenic cities",
      "Highly affordable living and tuition (approx. \u20b922 Lakhs total)",
      "Safe environment bordering the European Union",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller urban environment with a quiet lifestyle",
      "Academic focus on primary care and general medicine",
      "Winters are snowy and damp due to the proximity to the Baltic"
    ],
    bestFitFor: ["Budget-conscious families", "Nature and history lovers", "Independent students"],
    teachingHospitals: [
      "Pskov Regional Clinical Hospital",
      "Pskov City Polyclinic No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Historic Border Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Pskov safe?", answer: "Extremely. It is a peaceful provincial capital with very low crime." },
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English." }
    ],
    programs: [
      {
        slug: "mbbs-pskov-state-2026",
        title: "Medical Degree / MD (Pskov)",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://pskgu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "chuvash-state-university",
    name: "Chuvash State University",
    city: "Cheboksary",
    type: "Public/State",
    establishedYear: 1967,
    published: true,
    featured: false,
    officialWebsite: "https://www.chuvsu.ru/en/",
    summary: "Chuvash State University (named after I.N. Ulyanov) is a leading educational center in the Volga region. Its Medical Faculty is famous for its high clinical volume and extensive clinical bases in the city of Cheboksary.",
    campusLifestyle: "A vibrant campus in Cheboksary, the capital of the Chuvash Republic. Known for being the 'greenest city' in Russia. Students have access to massive university libraries and modern lab facilities.",
    cityProfile: "Cheboksary is a scenic port city on the Volga. 2026 Index: Very affordable. Milk (~70 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $140-$170 USD. Clean and safe environment.",
    clinicalExposure: "Massive clinical scale with access to 2,500+ beds across affiliated government hospitals. Primary rotation at the Republican Clinical Hospital. Strong focus on mother-and-child health.",
    hostelOverview: "Dedicated international student hostels with 24/7 security, centralized heating, and in-house social rooms. Most hostels are within a 15-minute commute to the main lecture blocks.",
    indianFoodSupport: "Several Indian messes operate on campus due to the large Indian student community. Local markets are well-stocked with diverse spices and grains.",
    safetyOverview: "Cheboksary is a safe, family-oriented regional capital. The university provides 24/7 security and a dedicated foreign student affairs board.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active alumni mentoring network.",
    whyChoose: [
      "Access to a massive 2,500-bed clinical network across Cheboksary",
      "Located in the 'Greenest City' of Russia with high quality of life",
      "Large and established Indian student community with mess facilities",
      "Highly affordable tuition for an elite government medical school"
    ],
    thingsToConsider: [
      "Strict academic discipline and high attendance requirements",
      "Russian language is crucial for clinical interaction in Volga hospitals",
      "Weather is continental; snowy winters are standard"
    ],
    bestFitFor: ["Students seeking high clinical volume", "Budget-conscious families", "Quality-conscious learners"],
    teachingHospitals: [
      "Republican Clinical Hospital (Cheboksary)",
      "City Clinical Hospital No. 1",
      "Republican Children's Clinical Hospital"
    ],
    recognitionBadges: ["Volga Clinical Powerhouse", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English Medium MD program." },
      { question: "Is there an Indian Mess?", answer: "Yes, Chuvash is well-known for its active Indian messes." }
    ],
    programs: [
      {
        slug: "mbbs-chuvash-state-2026",
        title: "Medical Degree / MD (Chuvash)",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://www.chuvsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "mordovia-state-university",
    name: "Mordovia State University",
    city: "Saransk",
    type: "Public/National Research",
    establishedYear: 1931,
    published: true,
    featured: false,
    officialWebsite: "https://mrsu.ru/en/",
    summary: "Mordovia State University (named after N.P. Ogarev) is a National Research University. Its Medical Institute is a top-tier center for medical science and clinical training in the newly modernized city of Saransk.",
    campusLifestyle: "Ultra-modern campus facilities (many upgraded for the 2018 World Cup). Students enjoy a high-tech learning environment with advanced digital simulation labs and a large university library complex.",
    cityProfile: "Saransk is a high-tech, modern, and very safe city. 2026 Index: Affordable and clean. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses $150-$180 USD. Saransk is often ranked among Russia's most comfortable cities.",
    clinicalExposure: "Primary rotation at the Republican Clinical Hospital and specialized regional cancer and cardiac centers. High-tech diagnostic equipment and modern surgical theaters are a standard for training.",
    hostelOverview: "Modern, high-rise hostels with en-suite sections for international students. Features 24/7 security, centralized laundry, and high-speed fiber internet. Located within the secure university micro-district.",
    indianFoodSupport: "Self-cooking and group messes are standard. Local hypermarkets like 'Lenta' stock a good variety of international produce and spices.",
    safetyOverview: "Saransk is one of the safest cities in the Russian Federation. University security and smart-city surveillance ensure a highly protected environment.",
    studentSupport: "National Research status allows for high academic funding. Offers integrated FMGE/NExT support and active student research grants.",
    whyChoose: [
      "National Research University status with high academic funding",
      "Ultra-modern city infrastructure (Saransk is safe and clean)",
      "High-tech clinical training with digital surgery and labs",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academic standards are modern and fast-paced",
      "Saransk is a medium-sized city with a focus on peace and study",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Academic seekers wanting high rankings", "Technology enthusiasts", "Safe-seeking families"],
    teachingHospitals: [
      "Mordovian Republican Clinical Hospital",
      "Republican Perinatal Center",
      "Regional Cardiology Dispensary"
    ],
    recognitionBadges: ["National Research Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Saransk safe?", answer: "Yes, it is often cited as one of the safest and most comfortable cities in Russia." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-mordovia-state-2026",
        title: "Medical Degree / MD (Mordovia)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://mrsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "kuban-state-medical-university",
    name: "Kuban State Medical University",
    city: "Krasnodar",
    type: "Public/State",
    establishedYear: 1920,
    published: true,
    featured: false,
    officialWebsite: "https://ksmu.ru/en/",
    summary: "Kuban State Medical University is a prestigious medical hub in Southern Russia. For 2026, it is a highly favored destination for students seeking a warmer climate and a major regional referral center for clinical training.",
    campusLifestyle: "A vibrant southern campus in Krasnodar. Students enjoy a Mediterranean-style outdoor life. The university is known for its high-achieving sports culture and annual international festivals.",
    cityProfile: "Krasnodar is a large, sunny Southern city. 2026 Index: Modern and affordable. Milk (~78 RUB), 1kg Chicken (~335 RUB). Monthly budget $160-$200 USD. Pleasant climate with shorter, easier winters.",
    clinicalExposure: "Primary rotation at the Kuban Regional Clinical Hospital (1,500+ beds), which is a major federal referral center. High patient volume ensure deep exposure to surgical and emergency care.",
    hostelOverview: "Dedicated hostels for international students with 2-3 occupants per room. Features 24/7 security, centralized heating, and shared kitchens. Well-connected by city bus and tram.",
    indianFoodSupport: "Krasnodar has a significant Indian community. Multiple Indian messes operate in the student residential blocks. Local markets have an abundance of fresh fruit and Indian-friendly spices.",
    safetyOverview: "Krasnodar is a major southern hub but remains safe for students. The university maintains a strict safety record with 24/7 hostel guards.",
    studentSupport: "Powerful alumni network. BSMU provides integrated support for NExT/FMGE coaching and clinical orientation sessions specifically for foreign students.",
    whyChoose: [
      "Major regional referral center with 1,500+ clinical beds",
      "Milder Southern climate with short, easier winters",
      "Established 1920; long history of academic and clinical excellence",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is a major hub; can be busy and bustling",
      "Academic standards focus on high-volume clinical work",
      "Russian language is crucial for interacting in Southern hospitals"
    ],
    bestFitFor: ["Students preferring a milder climate", "High-volume clinical seekers", "Families looking for a proven southern brand"],
    teachingHospitals: [
      "Kuban Regional Clinical Hospital No. 1",
      "City Clinical Hospital No. **3**",
      "Republican Perinatal Center"
    ],
    recognitionBadges: ["Southern Referral Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the climate warm?", answer: "Yes, it is one of the warmest cities in Russia, with very short winters." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-kuban-state-2026",
        title: "Medical Degree / MD (Kuban)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://ksmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "dagestan-state-medical-university",
    name: "Dagestan State Medical University",
    city: "Makhachkala",
    type: "Public/State",
    establishedYear: 1932,
    published: true,
    featured: false,
    officialWebsite: "https://dgmu.ru/en/",
    summary: "Dagestan State Medical University (DSMU) is a historic medical institution on the Caspian Sea. For 2026, it is recognized for its high academic standards and its multi-ethnic clinical environment.",
    campusLifestyle: "A unique coastal campus in Makhachkala. Students enjoy a multicultural atmosphere in a city where diverse Caucasian cultures blend. High social engagement with international student societies.",
    cityProfile: "Makhachkala is a scenic coastal city on the Caspian Sea. 2026 Index: Very affordable. Milk (~72 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $130-$160 USD. Milder winters.",
    clinicalExposure: "Primary rotation at the Dagestan Regional Clinical Hospitals. Students get exposure to specialized clinical centers focusing on surgery and infectious diseases.",
    hostelOverview: "Secure dormitories sharing rooms by 2-3 international students. Features reliable heating, security guards, and internet. Academic buildings are within a short commute.",
    indianFoodSupport: "Self-cooking is standard. Local markets are well-stocked with fresh produce and international staples.",
    safetyOverview: "The university maintains a strict safety record with 24/7 security and a dedicated office for foreign student safety coordination.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active research in regional health issues.",
    whyChoose: [
      "Founded in 1932; long history of medical education in the Caucasus",
      "Scenic coastal location on the Caspian Sea with milder climate",
      "Highly affordable total package under \u20b922 Lakhs",
      "Fully compliant with NMC FMGL 2021 guidelines (6 years)"
    ],
    thingsToConsider: [
      "Unique multi-ethnic culture requires some social adaptation",
      "Academic focus on traditional medical methods is strong",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Budget-conscious learners", "Nature lovers", "Independent students"],
    teachingHospitals: [
      "Dagestan Republican Clinical Hospital",
      "City Emergency Hospital",
      "Regional Cardiology Center"
    ],
    recognitionBadges: ["Caspian Region Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." },
      { question: "What are the fees?", answer: "Approx. $4,000 - $4,500 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-dagestan-state-2026",
        title: "Medical Degree / MD (Caspian)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://dgmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "kabardino-balkarian-state-university",
    name: "Kabardino-Balkarian State University",
    city: "Nalchik",
    type: "Public/State",
    establishedYear: 1932,
    published: true,
    featured: false,
    officialWebsite: "https://kbsu.ru/en/",
    summary: "Kabardino-Balkarian State University (KBSU) is a premier medical institution in the North Caucasus region. For 2026, it is favored by Indian students for its high academic quality and its location in the 'Friendship City' of Nalchik.",
    campusLifestyle: "A peaceful and disciplined campus in Nalchik. Students enjoy a scenic life near the mountains with access to modern medical labs and research facilities.",
    cityProfile: "Nalchik is a green, family-oriented mountain resort city. 2026 Index: Very affordable. Milk (~70 RUB), 1kg Chicken (~305 RUB). Monthly budget $120-$150 USD. Very clean and safe city.",
    clinicalExposure: "Primary rotation at the Kabardino-Balkarian Republican Clinical Hospitals. Students get deep exposure to general surgery and diagnostics in high-volume regional wards.",
    hostelOverview: "Clean, secure dormitories primarily shared by 2-3 international students. Features 24/7 security and centralized heating. Extremely affordable accommodation.",
    indianFoodSupport: "Self-cooking is standard. Local markets stock fresh vegetables and grains. Growing Indian community supports group messes.",
    safetyOverview: "Nalchik is one of the safest and most hospitable cities in the region. The university provides 24/7 security and comprehensive legal orientation.",
    studentSupport: "Excellent academic mentoring and support for professional certifications. Integrated FMGE/NExT licensing preparation.",
    whyChoose: [
      "Located in a scenic and highly safe 'Mountain Resort' city",
      "One of the most affordable total packages in Russia (under \u20b920 Lakhs)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)",
      "High academic threshold focusing on strong theoretical bases"
    ],
    thingsToConsider: [
      "The city is smaller and quieter; ideal for intense study",
      "Slightly cooler winters due to altitude; prepare appropriately",
      "Academic discipline is famously traditional"
    ],
    bestFitFor: ["Budget-conscious families", "Nature lovers", "Disciplined learners"],
    teachingHospitals: [
      "Republican Clinical Hospital (Nalchik)",
      "City Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Mountain Resort Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, the full 6-year course is offered in English." },
      { question: "What is the tuition?", answer: "Approx. $3,500 - $4,000 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-kabardino-balkarian-2026",
        title: "Medical Degree / MD (Nalchik)",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://kbsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "chechen-state-university",
    name: "Chechen State University",
    city: "Grozny",
    type: "Public/State",
    establishedYear: 1938,
    published: true,
    featured: false,
    officialWebsite: "https://chesu.ru/en/",
    summary: "Chechen State University is a major educational center in Grozny. For 2026, it offers a highly modern, newly rebuilt academic infrastructure and a deeply traditional learning environment for serious medical aspirants.",
    campusLifestyle: "A highly modern urban campus (completely rebuilt). Students enjoy top-tier facilities, new laboratories, and a strict, professional academic culture. The city is clean and very well-organized.",
    cityProfile: "Grozny is a newly modernized, ultra-clean city. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Highly peaceful city life.",
    clinicalExposure: "Primary clinical rotation at the Grozny Republican Clinical Hospitals. Students get access to high-tech diagnostic wards and modern surgical theaters reconstructed recently.",
    hostelOverview: "Ultra-modern student hostels with new furniture and high-speed internet. Features strict 24/7 security and a very protected student environment.",
    indianFoodSupport: "Self-cooking is standard. Local hypermarkets stock a good variety of international produce and spices.",
    safetyOverview: "Grozny is one of the safest and most well-guarded cities in the Russian Federation. Security 24/7 is a standard.",
    studentSupport: "Excellent funding results in modern facilities. The university provides comprehensive support for international student life and legalities.",
    whyChoose: [
      "Ultra-modern, nearly new campus and laboratory infrastructure",
      "Highly affordable total package under \u20b922 Lakhs total",
      "One of the cleanest and most well-guarded cities in Russia",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Deeply traditional social culture requires respectful adaptation",
      "The city has strict local norms regarding public behavior",
      "Strategic distance from larger metropolises like Moscow"
    ],
    bestFitFor: ["Disciplined academic learners", "Students preferring safe, modern cities", "Independent students"],
    teachingHospitals: [
      "Republican Clinical Hospital (Grozny)",
      "City Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Modernized Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Grozny safe?", answer: "Yes, it is currently one of the most well-guarded and clean cities in Russia." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-chechen-state-2026",
        title: "Medical Degree / MD (Grozny)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://chesu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "ingush-state-university",
    name: "Ingush State University",
    city: "Magas",
    type: "Public/State",
    establishedYear: 1994,
    published: true,
    featured: false,
    officialWebsite: "https://inggu.ru/en/",
    summary: "Ingush State University is one of Russia's youngest federal universities. For 2026, its Medical Faculty offers a high academic standard in the modern, newly developed administrative capital of Magas.",
    campusLifestyle: "A quiet and academic campus in a newly built city center. Students enjoy a calm study environment with personalized faculty attention due to smaller student batches.",
    cityProfile: "Magas is the newly built urban capital of Ingushetia. 2026 Index: Safe and sehr affordable. Milk (~72 RUB), 1kg Chicken (~310 RUB). Monthly expenses around $130-$160 USD. Peaceful Lifestyle.",
    clinicalExposure: "Primary clinical rotation at the Ingush Republican Clinical Hospital. Focus on general practice and rural health excellence.",
    hostelOverview: "New student hostels with functional furniture and standard 24/7 security. Rooms shared by 2-3 international students.",
    indianFoodSupport: "Self-cooking is standard. Local markets are well-stocked with fresh produce.",
    safetyOverview: "Magas is a small, safe administrative capital. 24/7 security and a peaceful local environment ensure a protected student life.",
    studentSupport: "Highly accessible faculty mentors. Integrated support for academic success and legal registration.",
    whyChoose: [
      "Located in a modern, newly built administrative capital",
      "Very low tuition and living costs (Highly budget-friendly)",
      "Personalized faculty attention and smaller batch sizes",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is small and very quiet; primarily an administrative hub",
      "Strategic distance from Moscow and large metropolises",
      "Younger university (Est. 1994) with a focus on modern methods"
    ],
    bestFitFor: ["Budget-conscious families", "Serious solo learners", "Independent students"],
    teachingHospitals: [
      "Ingush Republican Clinical Hospital",
      "Magas City Polyclinic",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Modern Capital Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Magas safe?", answer: "Yes, it is the administrative capital and is very well-guarded and peaceful." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-ingush-state-2026",
        title: "Medical Degree / MD (Magas)",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://inggu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "north-ossetian-state-medical-academy",
    name: "North Ossetian State Medical Academy",
    city: "Vladikavkaz",
    type: "Academy/Public",
    establishedYear: 1939,
    published: true,
    featured: false,
    officialWebsite: "https://nosma.ru/en/",
    summary: "North Ossetian State Medical Academy (NOSMA) is a prestigious academy with a long history of medical excellence. For 2026, it offers high-achieving students a focused, clinical-led education in the scenic city of Vladikavkaz.",
    campusLifestyle: "A traditional academy campus with a strong sense of academic discipline. Students enjoy its own university clinic and a wide network of regional clinical bases.",
    cityProfile: "Vladikavkaz is the 'Caucasian Southern Beauty.' 2026 Index: Scenic and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses $150-$180 USD. Historic city with mountain views.",
    clinicalExposure: "Primary clinical rotation at NOSMA's Own University Clinic and 10+ teaching hospitals. Specialized stomp-polyclinic for dental rotations. Focus on high-volume clinical rounds.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features reliable heating, security guards, and internet. Academic buildings are easily accessible.",
    indianFoodSupport: "Self-cooking is standard. Local markets are famous for fresh produce and Caucasian/Asian spices.",
    safetyOverview: "Vladikavkaz is a safe, family-oriented regional capital. The university provides 24/7 security and comprehensive legal orientation.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT preparation and active alumni mentoring network.",
    whyChoose: [
      "Legacy academy (Est. 1939) with its own University Clinic",
      "Network of 10+ teaching hospitals providing wide clinical exposure",
      "Scenic mountain location in the safe city of Vladikavkaz",
      "Highly affordable total package under \u20b925 Lakhs"
    ],
    thingsToConsider: [
      "The city is mid-sized; focus is primarily on study and history",
      "Academic standards are famously rigid (Academy style)",
      "Russian language is emphasized for clinical interactions"
    ],
    bestFitFor: ["Academic seekers in Southern Russia", "Budget-conscious families", "Quality-conscious learners"],
    teachingHospitals: [
      "NOSMA University Clinic",
      "North Ossetian Republican Clinical Hospital",
      "City Clinical Hospital No. 1"
    ],
    recognitionBadges: ["Elite Academy Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "What is the tuition?", answer: "Approx. $4,000 - $4,500 USD per year." }
    ],
    programs: [
      {
        slug: "mbbs-north-ossetian-2026",
        title: "Medical Degree / MD (Vladikavkaz)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://nosma.ru/en/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 5 (Full 10) ===\n");
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
  console.log("\n✅ Batch 5 Deep Enrichment Done!");
}

seed();
