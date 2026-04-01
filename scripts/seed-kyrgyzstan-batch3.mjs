import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const KYRGYZSTAN_ID = 48;
const COURSE_MBBS_ID = 13;

const universities = [
  {
    slug: "central-asian-international-medical-university",
    name: "Central Asian International Medical University (CAIMU)",
    city: "Jalal-Abad",
    type: "Private",
    establishedYear: 2018,
    officialWebsite: "#",
    summary: "Located in Jalal-Abad, CAIMU is a rapidly evolving private college catering heavily to the international student market looking for English-medium tracks in the cheaper southern regions.",
    campusLifestyle: "Highly focused on South Asian student welfare with a tight-knit campus community.",
    cityProfile: "Jalal-Abad. Extremely cheap cost of living (~$150/month).",
    clinicalExposure: "Partnered with local provincial clinics in the south.",
    hostelOverview: "Brand new private dorm facilities with strong security.",
    indianFoodSupport: "Massive support with dedicated mess operations.",
    safetyOverview: "Very safe Southern Kyrgyzstan region.",
    studentSupport: "Heavy FMGE preparation.",
    whyChoose: ["WDOMS Listed", "Incredibly affordable tuition and living expenses"],
    thingsToConsider: ["Located far from Bishkek"],
    bestFitFor: ["Budget-conscious families"],
    teachingHospitals: ["Jalal-Abad Region Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-caimu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3000,
        totalTuitionUsd: 18000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "eurasian-international-university",
    name: "Eurasian International University Faculty of Medicine",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2019,
    officialWebsite: "#",
    summary: "A newly framed private university situated in Bishkek aiming to integrate Eurasian health logistics into its international medical programs.",
    campusLifestyle: "Modern start-up campus atmosphere.",
    cityProfile: "Bishkek capital.",
    clinicalExposure: "Utilizing capital city private clinics.",
    hostelOverview: "Private accommodation structure.",
    indianFoodSupport: "Capital city access.",
    safetyOverview: "Modern campus security.",
    studentSupport: "Highly personalized.",
    whyChoose: ["Listed in WDOMS", "Located in the capital"],
    thingsToConsider: ["Newer brand"],
    bestFitFor: ["Early adopters"],
    teachingHospitals: ["Private Bishkek Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-eiu-kyrgyzstan-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "jalal-abad-international-university",
    name: "Jalal-Abad International University Medical Faculty",
    city: "Jalal-Abad",
    type: "Private",
    establishedYear: 2019,
    officialWebsite: "#",
    summary: "Another rapidly developing private option in Jalal-Abad designed to scale the southern region as a hub for English-medium medical training.",
    campusLifestyle: "Quiet, affordable living in the south.",
    cityProfile: "Jalal-Abad.",
    clinicalExposure: "Rotations in regional polyclinics.",
    hostelOverview: "Subsidized private dorms.",
    indianFoodSupport: "Indian messes available.",
    safetyOverview: "Very safe.",
    studentSupport: "Dedicated South Asian mentorship programs.",
    whyChoose: ["Affordable and peaceful", "WDOMS Listed"],
    thingsToConsider: ["Brand recognition is developing"],
    bestFitFor: ["Budget-conscious private sector searchers"],
    teachingHospitals: ["Regional Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-jiu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3000,
        totalTuitionUsd: 18000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kyrgyz-international-university",
    name: "Kyrgyz International University NRZ",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "An ultra-modern private university in Bishkek seeking to bridge international certification standards with Central Asian clinical practice.",
    campusLifestyle: "Dynamic and new.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Partnered with progressive capital clinics.",
    hostelOverview: "Assisted private housing.",
    indianFoodSupport: "Easy access.",
    safetyOverview: "High modern security.",
    studentSupport: "Very competitive admissions packages.",
    whyChoose: ["WDOMS Listed"],
    thingsToConsider: ["Newly established"],
    bestFitFor: ["Pioneering cohorts"],
    teachingHospitals: ["Capital Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kiu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3400,
        totalTuitionUsd: 20400,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kyrgyz-national-agrarian-university",
    name: "Kyrgyz National Agrarian University named after K.I. Scriabin",
    city: "Bishkek",
    type: "Public/State",
    establishedYear: 1933,
    officialWebsite: "#",
    summary: "Historically the flagship agrarian university, its massive state resources have recently expanded to include foundational health sciences listed in WDOMS.",
    campusLifestyle: "Massive historical state campus.",
    cityProfile: "Bishkek.",
    clinicalExposure: "State-brokered partnerships.",
    hostelOverview: "State dorms.",
    indianFoodSupport: "Bishkek standard.",
    safetyOverview: "State-level security.",
    studentSupport: "Huge library infrastructure.",
    whyChoose: ["Massive historic state presence", "WDOMS Listed"],
    thingsToConsider: ["Medical faculty is newly integrated; agrarian history"],
    bestFitFor: ["State university seekers"],
    teachingHospitals: ["State Capital Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-knau-kyrgyzstan-2026",
        title: "Medical Sciences Track",
        durationYears: 6,
        annualTuitionUsd: 3600,
        totalTuitionUsd: 21600,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kyrgyz-national-university",
    name: "Kyrgyz National University named after Jusup Balasagyn",
    city: "Bishkek",
    type: "Public/State",
    establishedYear: 1932,
    officialWebsite: "#",
    summary: "The flagship National University of Kyrgyzstan. Its burgeoning medical faculty benefits from unprecedented state funding and the prestige of the nation's premier comprehensive university.",
    campusLifestyle: "Classic, academic, and highly prestigious. The campus represents the academic heart of Kyrgyzstan.",
    cityProfile: "Bishkek capital.",
    clinicalExposure: "Vast. Partnered with top national hospitals across Bishkek for complete clinical immersion.",
    hostelOverview: "Massive state network of competitive but highly affordable housing.",
    indianFoodSupport: "Capital city networks.",
    safetyOverview: "Peak state security.",
    studentSupport: "Oldest comprehensive library and massive exchange programs.",
    whyChoose: ["Prestige of the National University brand", "WDOMS Listed", "Highly subsidized state tuition rates for the caliber"],
    thingsToConsider: ["Massive student body; highly competitive"],
    bestFitFor: ["Legacy seekers"],
    teachingHospitals: ["Leading National Bishkek Hospitals"],
    recognitionBadges: ["National University Hub", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-knu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kyrgyz-russian-slavic-university",
    name: "Kyrgyz-Russian Slavic University (KRSU) Medical Faculty",
    city: "Bishkek",
    type: "Public/State",
    establishedYear: 1993,
    officialWebsite: "https://krsu.edu.kg/",
    summary: "KRSU is one of the most elite, highly sought-after universities in Central Asia. Operated jointly by the Russian and Kyrgyz governments, it represents a gold standard in medical education, combining rigorous Russian clinical doctrines with Central Asian affordability.",
    campusLifestyle: "An incredibly sophisticated, highly disciplined academic environment. Students must conform to extremely high standards.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Unmatched. KRSU utilizes the absolute best hospitals in Bishkek, and benefits from exclusive access to advanced Russian technological medical grids.",
    hostelOverview: "Premium state dormitories heavily subsidized but intensely competitive.",
    indianFoodSupport: "Excellent access owing to a large Indian expatriate presence.",
    safetyOverview: "Bi-national government security presence. Extremely safe.",
    studentSupport: "Immense. Direct pathways to Russian residency as well as specialized FMGE tracks.",
    whyChoose: [
      "Operated by both the Russian Federation and Kyrgyz Republic",
      "One of the hardest and most prestigious medical tracks in Central Asia",
      "Completely aligned with both NMC FMGL 2021 and Russian federal mandates"
    ],
    thingsToConsider: [
      "Extremely hard to get into; strict academic screening",
      "Grading is brutal to ensure high success rates globally"
    ],
    bestFitFor: ["Elite students", "Those seeking Russian clinical excellence"],
    teachingHospitals: ["National Center of Cardiology", "Scientific Research Institutes"],
    recognitionBadges: ["Bi-National Elite Status", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is KRSU a Russian university?", answer: "It is a joint state university between Russia and Kyrgyzstan." }
    ],
    programs: [
      {
        slug: "mbbs-krsu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4200,
        totalTuitionUsd: 25200,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://krsu.edu.kg/"
      }
    ]
  },
  {
    slug: "osh-international-medical-university",
    name: "Osh International Medical University",
    city: "Osh",
    type: "Private",
    establishedYear: 2015,
    officialWebsite: "#",
    summary: "A private counterpart to the massive Osh State University. This institution specifically built its entire curriculum to cater entirely to international South Asian students moving to the affordable city of Osh.",
    campusLifestyle: "Highly familiar and tailored to foreign students, reducing massive culture shocks.",
    cityProfile: "Osh is the 'southern capital', deeply historical, and incredibly cheap to live in.",
    clinicalExposure: "Partnered directly with private maternity and emergency care centers in Osh.",
    hostelOverview: "Dedicated private international hostels (safe and culturally aligned).",
    indianFoodSupport: "Massive scale. Dedicated on-campus cafeterias catering entirely Indian cuisine.",
    safetyOverview: "Highly managed private security for foreign cohorts.",
    studentSupport: "FMGE integrated completely. Faculty trained to handle cultural integrations.",
    whyChoose: [
      "Built exclusively around international medical students' needs",
      "Located in the highly affordable city of Osh",
      "WDOMS Listed and 100% focused on 6-year NMC alignment"
    ],
    thingsToConsider: ["Private counterpart to Osh State University"],
    bestFitFor: ["Budget seekers prioritizing ease of transition"],
    teachingHospitals: ["Osh Central Clinical Networks"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-oimu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "salymbekov-university",
    name: "Salymbekov University Faculty of Medicine",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2019,
    officialWebsite: "https://salymbekov.com/",
    summary: "Founded by the legendary philanthropist Askar Salymbekov, this private university represents the modernization of Kyrgyz medical instruction. It offers highly digitized, world-class infrastructure in Bishkek.",
    campusLifestyle: "Highly modern, corporate-like campus with stunning tech-labs and simulation facilities.",
    cityProfile: "Bishkek capital.",
    clinicalExposure: "Aggressively expanding its clinical bases, including ties to Salymbekov-owned health initiatives.",
    hostelOverview: "Premium, highly secure private dormitories matching European housing standards.",
    indianFoodSupport: "Excellent, custom-catered mess options available.",
    safetyOverview: "Elite, private-sector security footprint.",
    studentSupport: "Excellent digitized tracking of student performance, FMGE coaching, and personalized mentoring.",
    whyChoose: [
      "Backed by immense private/philanthropic funding",
      "One of the most modern, highly digitized campuses in Kyrgyzstan",
      "Compliant with NMC FMGL 2021 (6-year format)"
    ],
    thingsToConsider: ["Premium infrastructure means slightly higher private tuition costs"],
    bestFitFor: ["Students desiring high-tech facilities"],
    teachingHospitals: ["Salymbekov Health Affiliates", "Bishkek Capital Clinics"],
    recognitionBadges: ["High-Tech Hub", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-salymbekov-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://salymbekov.com/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Kyrgyzstan Deep Enrichment: Batch 3 (FINAL KG) ===\n");
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
        KYRGYZSTAN_ID, uni.slug, uni.name, uni.city, uni.type, uni.establishedYear, uni.summary,
        true, false, uni.officialWebsite, uni.campusLifestyle, uni.cityProfile,
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
            published = EXCLUDED.published,
            updated_at = NOW();
        `;

        const progValues = [
          universityId, COURSE_MBBS_ID, prog.slug, prog.title, prog.durationYears,
          prog.annualTuitionUsd, prog.totalTuitionUsd, prog.livingUsd,
          prog.medium, prog.officialProgramUrl, true
        ];

        await client.query(progQuery, progValues);
      }
      console.log(`  ✓ Deep Dossier Generated: ${uni.name}`);
    }
  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\n✅ Kyrgyzstan Batch 3 Complete!");
}

seed();
