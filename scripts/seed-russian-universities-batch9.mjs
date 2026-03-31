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
    slug: "petrozavodsk-state-university",
    name: "Petrozavodsk State University",
    city: "Petrozavodsk",
    type: "Public/State",
    establishedYear: 1940,
    published: true,
    featured: false,
    officialWebsite: "https://petrsu.ru/en",
    summary: "Petrozavodsk State University (PetrSU) is a leading institution in Northern Russia. Its Medical Institute is recognized for its elite simulation centers and its proximity to the Finnish border, offering 2026 aspirants a unique Nordic/Russian educational environment.",
    campusLifestyle: "A quiet, scenic campus in the lake-rich Karelia region. Students study in a peaceful atmosphere with access to the Finnish border (Nordic lifestyle influence). Features high-tech simulation centers and a strong focus on ecological and northern health.",
    cityProfile: "Petrozavodsk is the capital of Karelia. 2026 Index: Safe and affordable. Milk (~78 RUB), 1kg Chicken (~330 RUB). Monthly expenses around $150-$180 USD. Scenic lakeside city with a high quality of life.",
    clinicalExposure: "Primary rotation at the Republic Hospital of Karelia and specialized medical centers in Petrozavodsk. Features an advanced Accreditation and Simulation Center for pre-clinical training.",
    hostelOverview: "Secure student hostels with rooms shared by 2-3 students. Features include centralized heating, 24/7 security, and high-speed Wi-Fi. Located within easy reach of the medical institute buildings.",
    indianFoodSupport: "Self-cooking is primary. Local supermarkets stock an excellent range of fresh produce and international staples for the student community.",
    safetyOverview: "Petrozavodsk is a very safe, peaceful provincial capital. The university maintains a strict safety record with 24/7 security in academic residential blocks.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active student scientific research societies focused on northern medicine.",
    whyChoose: [
      "Leading Northern University with elite Nordic-standard facilities",
      "Access to an advanced Accreditation and Simulation Center",
      "Safe, clean, and scenic lakeside environment (Karelia region)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Winters are snowy and cold; prepare appropriately for Northern Russia",
      "Proximity to Finland (Nordic influence) but remains within Russian system",
      "Russian language is emphasized for clinical rounds in Year 4+"
    ],
    bestFitFor: ["Nature Lovers", "Students seeking safe environments", "Independent students"],
    teachingHospitals: [
      "Republic Hospital of Karelia",
      "Petrozavodsk City Clinical Hospital",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Northern Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it close to Finland?", answer: "Yes, it is very close to the border; Karelia has a strong Nordic vibe." },
      { question: "Is the medium English?", answer: "Yes, they offer a 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-petrozavodsk-state-2026",
        title: "Medical Degree / MD (State)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://petrsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "novgorod-state-university",
    name: "Novgorod State University",
    city: "Veliky Novgorod",
    type: "Public/State",
    establishedYear: 1993,
    published: true,
    featured: false,
    officialWebsite: "https://www.novsu.ru/en/",
    summary: "Novgorod State University (named after Yaroslav the Wise) is a modern institution in one of Russia's oldest cities. For 2026, it offers high-achieving students a focused medical education integrated with the historic cultural heart of Russia.",
    campusLifestyle: "A traditional academic campus in Veliky Novgorod (the birthplace of Russia). Quiet, academic-focused atmosphere with modern labs and a strong sense of community. Strategically located between Moscow and St. Petersburg.",
    cityProfile: "Veliky Novgorod is a scenic and historic regional capital. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~325 RUB). Monthly budget $140-$170 USD. UNESCO World Heritage environment.",
    clinicalExposure: "Primary rotation at the Novgorod Regional Clinical Hospital and specialized cancer/cardiac centers. High volume of surgical cases ensures deep practical exposure from Year 3 onwards.",
    hostelOverview: "Clean, secure dormitories shared by 2-3 international students. Features 24/7 security, reliable heating, and internet. Hostels are centrally located within the university district.",
    indianFoodSupport: "Self-cooking is primary. Local hypermarkets stock a good range of international staples and seasonings for the student community.",
    safetyOverview: "Veliky Novgorod is one of the safest cities in Russia. The university provides 24/7 security and a dedicated office for foreign student affairs.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active student research societies.",
    whyChoose: [
      "Located in a safe, historic UNESCO World Heritage city",
      "Strategic location between Moscow and St. Petersburg (Express trains)",
      "Highly affordable living and tuition (Excellent value-for-money)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is a historic center; focused primarily on study and history",
      "Academic standards are modern and fast-paced",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["History lovers", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Novgorod Regional Clinical Hospital",
      "City Clinical Hospital of Veliky Novgorod",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Historic Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it Veliky Novgorod or Nizhny?", answer: "Veliky Novgorod (near St. Petersburg), the historic birthplace of Russia." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-novgorod-state-2026",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://www.novsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "tula-state-university-deep",
    name: "Tula State University (Deep Enrichment Update)",
    city: "Tula",
    type: "Public/State",
    establishedYear: 1930,
    published: true,
    featured: false,
    officialWebsite: "https://tulsu.ru/en/",
    summary: "Tula State University (TSU) is a leading educational hub in Central Russia. Its Medical Institute is a top-tier center for medical science and clinical training, strategically located just 180km from Moscow.",
    campusLifestyle: "A traditional, academic-driven campus in Tula city center. Students spend much of their time in the city's various clinics. Strong focus on practical hand-skills and early patient interaction.",
    cityProfile: "Tula is a historic industrial and cultural hub near Moscow. 2026 Index: Modern and affordable. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly expenses around $150-$180 USD. Safe and well-organized.",
    clinicalExposure: "Primary rotation at the Tula Regional Clinical Hospital (1,000+ beds) and City Hospital No. 1. High volume of surgical cases ensures deep practical exposure from Year 3 onwards.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized laundry, and high-speed fiber internet. Located within the secure university district.",
    indianFoodSupport: "Several Indian student canteens operate near the hostels. Local markets are well-stocked with international staples and spices.",
    safetyOverview: "Tula is very safe and student-oriented. The university maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT practice support and active research in innovative medical tech.",
    whyChoose: [
      "Strategic proximity to Moscow (180km; 2 hours by express train)",
      "Large clinical base with access to 1,000-bed Regional Clinical Hospital",
      "Safe, affordable, and academic-focused city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Academic standards are traditional and rigorous",
      "Russian language is emphasized for clinical rounds",
      "Industrial city environment with a focus on peace and study"
    ],
    bestFitFor: ["Students wanting Moscow proximity", "Budget-conscious families", "Independent students"],
    teachingHospitals: [
      "Tula Regional Clinical Hospital",
      "City Clinical Hospital No. 1",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Central Russia Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it close to Moscow?", answer: "Yes, 180km; about 2 hours by express train." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-tula-state-2026-deep",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://tulsu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "pskov-state-university-deep",
    name: "Pskov State University (Deep Enrichment Update)",
    city: "Pskov",
    type: "Public/State",
    establishedYear: 1932,
    published: true,
    featured: false,
    officialWebsite: "https://pskgu.ru/en/",
    summary: "Pskov State University (PskovSU) is an elite institution located on the EU border. Its Medical Faculty offers a high-achieving student body an elite clinical education in the historic heart of Northwest Russia.",
    campusLifestyle: "A traditional academic campus in a UNESCO World Heritage city. Students study in a peaceful atmosphere with access to Europe-standard diagnostics. Scenic environment with high quality of life.",
    cityProfile: "Pskov is a historic regional capital near the EU borders. 2026 Index: Safe and affordable. Milk (~74 RUB), 1kg Chicken (~325 RUB). Monthly budget $140-$170 USD. Historic city life.",
    clinicalExposure: "Primary rotation at the Pskov Regional Clinical Hospital and the Pskov Perinatal Center. High volume of specialized surgical cases ensures deep practical exposure.",
    hostelOverview: "Secure dormitories shared by 2-3 international students. Features include 24/7 security, reliable heating, and high-speed Wi-Fi. Academic buildings are within easy reach.",
    indianFoodSupport: "Self-cooking is primary. Local supermarkets stock an excellent range of international produce and spices.",
    safetyOverview: "Pskov is extremely safe and student-oriented. The university maintains a strict safety record with 24/7 security guards.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE licensing preparation and active international department.",
    whyChoose: [
      "Access to Pskov Regional Clinical Hospital and Perinatal Center",
      "Located on the EU border (strategic Northwest Russia location)",
      "Safe, affordable, and historic UNESCO city environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is mid-sized; focus is primarily on study and history",
      "Academic standards are traditional and rigorous",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["History lovers", "Safe-seeking families", "Independent students"],
    teachingHospitals: [
      "Pskov Regional Clinical Hospital",
      "Pskov Perinatal Center",
      "City Clinical Emergency Hospital"
    ],
    recognitionBadges: ["Northwest Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Pskov safe?", answer: "Yes, it is one of Russia's safest and most historic cities." },
      { question: "Is it close to the EU?", answer: "Yes, it sits right at the border with Estonia and Latvia." }
    ],
    programs: [
      {
        slug: "mbbs-pskov-state-2026-deep",
        title: "Medical Degree / MD (Elite State)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://pskgu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "orel-state-university-deep",
    name: "Orel State University (Deep Enrichment Update)",
    city: "Orel",
    type: "Public/State",
    establishedYear: 1931,
    published: true,
    featured: false,
    officialWebsite: "https://oreluniver.ru/en/",
    summary: "Orel State University (named after I.S. Turgenev) is an elite institution in Central Russia. Its Medical Institute offers 2026 aspirants a high-quality, clinical-led education in the safe and peaceful 'Literary Capital' of Russia.",
    campusLifestyle: "A traditional academic campus in a quiet provincial setting. Orel is known for its high quality of life and safety. Students have access to modern labs and a massive university library complex.",
    cityProfile: "Orel is a historic city 360km south of Moscow. 2026 Index: Very affordable. Milk (~72 RUB), 1kg Chicken (~315 RUB). Monthly budget $130-$160 USD. Peaceful Lifestyle.",
    clinicalExposure: "Primary rotation at the Orel Regional Clinical Hospital and City Clinical Hospital No. 1. Focus on practical surgery and diagnostics from Year 3 onwards.",
    hostelOverview: "Dedicated hostels sharing rooms by 2-3 international students. Features 24/7 security, centralized laundry, and high-speed Wi-Fi. Located within easy reach of the medical institute buildings.",
    indianFoodSupport: "Self-cooking is primary. Local markets are well-stocked with international produced and seasonings for the student community.",
    safetyOverview: "Orel is one of the safest cities in Central Russia. The university provides 24/7 security and a dedicated office for foreign student affairs.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated support for NExT/FMGE and active student research societies.",
    whyChoose: [
      "Strategic proximity to Moscow (360km; 4 hours by train)",
      "Highly affordable total package under \u20b922 Lakhs total",
      "Safe and family-oriented 'Literary Capital' environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "The city is smaller and quieter; primarily academic",
      "Academic standards are traditional and rigorous",
      "Russian language is emphasized for clinical rounds"
    ],
    bestFitFor: ["Budget-conscious families", "Solo learners", "Independent students"],
    teachingHospitals: [
      "Orel Regional Clinical Hospital",
      "City Clinical Hospital n.a. Semashko",
      "Regional Diagnostic Center"
    ],
    recognitionBadges: ["Central Heart Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Orel safe?", answer: "Yes, it is a peaceful, historic provincial capital." },
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." }
    ],
    programs: [
      {
        slug: "mbbs-orel-state-2026-update",
        title: "Medical Degree / MD (Elite Update)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://oreluniver.ru/en/admission/"
      }
    ]
  },
  {
    slug: "belgorod-state-university-deep",
    name: "Belgorod State Research University (Deep Enrichment Update)",
    city: "Belgorod",
    type: "Public/National Research",
    establishedYear: 1876,
    published: true,
    featured: false,
    officialWebsite: "https://bsu.edu.ru/en/",
    summary: "Belgorod State University (BelSU) is a National Research University. Its Medical Institute is a top-tier center for medical science and clinical training in the newly modernized city of Belgorod. For 2026, it offers high-tech labs and a high academic rating.",
    campusLifestyle: "Ultra-modern campus facilities (National Research standard). Students enjoy a high-tech learning environment with advanced digital simulation labs and a massive university library complex.",
    cityProfile: "Belgorod is a high-tech, modern, and very clean city. 2026 Index: Affordable and clean. Milk (~74 RUB), 1kg Chicken (~320 RUB). Monthly budget $150-$180 USD. Often ranked among Russia's most comfortable cities.",
    clinicalExposure: "Primary rotation at the Belgorod State University Clinic and major city clinical hospitals. High-tech diagnostics and modern surgical theaters are a standard for training.",
    hostelOverview: "Modern hostels with en-suite sections for international students. Features 24/7 security, centralized laundry, and high-speed fiber internet. Located within the secure university district.",
    indianFoodSupport: "Self-cooking is primary. Local hypermarkets stock an excellent range of international staples and spices for the student community.",
    safetyOverview: "Belgorod is historically very safe. The university maintains an elite security record and a dedicated international affairs office.",
    studentSupport: "National Research status allows for high academic funding. Offers integrated FMGE/NExT support and active student research societies.",
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
    bestFitFor: ["Academic seekers in high-tech settings", "Safe-seeking families", "Independent students"],
    teachingHospitals: [
      "BelSU University Clinic",
      "Belgorod Regional Clinical Hospital",
      "City Clinical Hospital No. 1"
    ],
    recognitionBadges: ["National Research Elite Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, they offer a full 6-year English MD program." },
      { question: "Is it a research school?", answer: "Yes, BelSU has a National Research status with high academic funding." }
    ],
    programs: [
      {
        slug: "mbbs-belgorod-state-2026-update",
        title: "Medical Degree / MD (Research Elite)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://bsu.edu.ru/en/admission/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 9 (Full 10) ===\n");
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
  console.log("\n✅ Batch 9 Deep Enrichment Done!");
}

seed();
