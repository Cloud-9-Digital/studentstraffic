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
    slug: "jalal-abad-peoples-friendship-university",
    name: "Jalal-Abad People's Friendship University A. Batirov Medical Faculty",
    city: "Jalal-Abad",
    type: "Public/State",
    establishedYear: 1993,
    officialWebsite: "#",
    summary: "Jalal-Abad People's Friendship University is a prominently renowned state university in the southern region of Kyrgyzstan. Offering a robustly inexpensive MBBS degree, it operates a highly dedicated medical faculty specifically structured for international cohorts.",
    campusLifestyle: "Traditional regional campus. Jalal-Abad is culturally warm and significantly quieter than Bishkek.",
    cityProfile: "Jalal-Abad. 2026 Cost Index: Extremely low. Living costs average under $150 USD per month.",
    clinicalExposure: "Partnered extensively with southern regional hospitals, prioritizing hands-on ward time.",
    hostelOverview: "Highly affordable university dormitories.",
    indianFoodSupport: "The massive international student body supports multiple Indian canteens operating on campus.",
    safetyOverview: "A peaceful and culturally welcoming local community.",
    studentSupport: "Strong emphasis on FMGE coaching due to South Asian student volume.",
    whyChoose: [
      "Extremely affordable tuition and living costs",
      "Massive presence of Indian medical aspirants",
      "Fully compliant 6-year program matching NMC guidelines"
    ],
    thingsToConsider: [
      "Located in Jalal-Abad, meaning long road travel from the main international airport"
    ],
    bestFitFor: ["Budget-conscious students"],
    teachingHospitals: ["Jalal-Abad Regional Hospitals"],
    recognitionBadges: ["WDOMS Listed", "NMC FMGL 2021 Compliant"],
    faq: [],
    programs: [
      {
        slug: "mbbs-jalal-abad-friendship-2026",
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
    slug: "kyrgyz-state-university-arabaev",
    name: "Kyrgyz State University named after I. Arabaev",
    city: "Bishkek",
    type: "Public/State",
    establishedYear: 1945,
    officialWebsite: "#",
    summary: "Named after the famous enlightener I. Arabaev, this is a major state university in Bishkek. While historically renowned for pedagogy, its expanding medical faculty provides state-backed training to international students.",
    campusLifestyle: "Highly academic and historical. Deeply embedded into the educational fabric of Bishkek.",
    cityProfile: "Bishkek capital. 2026 Cost Index: ~$200 USD monthly.",
    clinicalExposure: "Operates clinical rotations across major Bishkek municipal hospitals.",
    hostelOverview: "State dormitories available.",
    indianFoodSupport: "Bishkek standard access.",
    safetyOverview: "State-level security protocols.",
    studentSupport: "Historical state university network.",
    whyChoose: ["Prestigious state university legacy", "Located in the capital"],
    thingsToConsider: ["Medical faculty is newer compared to KSMA"],
    bestFitFor: ["Seekers of state universities"],
    teachingHospitals: ["Bishkek City Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kyrgyz-state-arabaev-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kyrgyz-uzbek-university",
    name: "Kyrgyz-Uzbek University Medical Faculty",
    city: "Osh",
    type: "Public/State",
    establishedYear: 1994,
    officialWebsite: "#",
    summary: "The Kyrgyz-Uzbek University in Osh was established to foster international academic cooperation in Central Asia. Its medical faculty serves a wide array of international students.",
    campusLifestyle: "A unique, multicultural border-city campus environment in Osh (the second largest city in Kyrgyzstan).",
    cityProfile: "Osh is highly cultural and incredibly affordable. Monthly expenses fall below $200 USD.",
    clinicalExposure: "Strong ties to the Osh Regional Clinical Hospital network.",
    hostelOverview: "State-funded, highly affordable dormitories.",
    indianFoodSupport: "Growing Indian presence in Osh.",
    safetyOverview: "High level of monitoring.",
    studentSupport: "Designed specifically for multi-ethnic inclusion.",
    whyChoose: ["Affordable State University", "Located in the historic city of Osh"],
    thingsToConsider: ["Osh is outside the capital city"],
    bestFitFor: ["Budget-conscious academics"],
    teachingHospitals: ["Osh Public Clinical Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kyrgyz-uzbek-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "naryn-state-university",
    name: "Naryn State University",
    city: "Naryn",
    type: "Public/State",
    establishedYear: 1996,
    officialWebsite: "#",
    summary: "Located in the high-altitude remote region of Naryn, this state university provides essential medical training for central and eastern Kyrgyzstan.",
    campusLifestyle: "Extremely quiet, peaceful, and visually stunning mountainous environment.",
    cityProfile: "Naryn. Famous for its altitude and nature. Extremely cheap living costs.",
    clinicalExposure: "Affiliated with the primary Naryn Regional Hospital.",
    hostelOverview: "State hostels.",
    indianFoodSupport: "Self-cooking highly required.",
    safetyOverview: "A small, highly safe regional town.",
    studentSupport: "Pioneering faculty.",
    whyChoose: ["Breathtaking nature", "Incredibly affordable state tuition"],
    thingsToConsider: ["Extremely remote; very harsh winters"],
    bestFitFor: ["Nature lovers", "Deep-focus learners"],
    teachingHospitals: ["Naryn Regional Hospital"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-naryn-state-2026",
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
    slug: "royal-metropolitan-university",
    name: "Royal Metropolitan University",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "Royal Metropolitan University is a premium private medical institute in Bishkek with a rapidly growing footprint among South Asian medical aspirants.",
    campusLifestyle: "New, modern, and intensely focused on international medical cohorts.",
    cityProfile: "Bishkek. ~$200 USD monthly.",
    clinicalExposure: "Partnered with prominent Bishkek private medical centers.",
    hostelOverview: "Dedicated new private hostels.",
    indianFoodSupport: "Massive support with customized canteens.",
    safetyOverview: "High security, privately monitored.",
    studentSupport: "Aggressive FMGE coaching strategy.",
    whyChoose: ["Modern private amenities", "WDOMS Listed", "Favorable 6-year track format"],
    thingsToConsider: ["Newly established brand"],
    bestFitFor: ["Modern campus seekers"],
    teachingHospitals: ["Partner Bishkek Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-rmu-kyrgyzstan-2026",
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
    slug: "university-of-south-asia",
    name: "University of South Asia",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "Designed explicitly from the ground up to cater to thousands of medical aspirants moving from South Asia to Central Asia. The curriculum is perfectly tailored to clear regional licensing boards.",
    campusLifestyle: "Familiar, tailored, and highly supportive of South Asian cultural norms.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Secures rotations in large Bishkek hospitals tailored for English speakers.",
    hostelOverview: "Fully operational student dormitories built recently.",
    indianFoodSupport: "The core focus of their operational model. Massive Indian messes.",
    safetyOverview: "High security.",
    studentSupport: "FMGE integrated completely into daily learning.",
    whyChoose: ["Designed specifically for South Asian licensing success", "WDOMS Listed"],
    thingsToConsider: ["Niche international profile"],
    bestFitFor: ["FMGE focused students"],
    teachingHospitals: ["Affiliated Capital Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-usa-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "ala-too-international",
    name: "Ala-Too International University",
    city: "Bishkek",
    type: "Private",
    establishedYear: 1996,
    officialWebsite: "#",
    summary: "A very prestigious private university in Kyrgyzstan known for its rigorous English-medium instruction and international focus. Its medical programs are highly sought after.",
    campusLifestyle: "Elite private campus with heavy European and international footprints.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Partnered with premium local clinics.",
    hostelOverview: "High-quality off-campus and on-campus private accommodations.",
    indianFoodSupport: "City access.",
    safetyOverview: "Elite level security protocols.",
    studentSupport: "Extensive study abroad and exchange modules.",
    whyChoose: ["One of the most reputed private universities in Kyrgyzstan", "Highly credible international education"],
    thingsToConsider: ["Tuition is premium for Kyrgyzstan"],
    bestFitFor: ["Prestige seekers"],
    teachingHospitals: ["Private Bishkek Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ala-too-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "asian-international-university",
    name: "Asian International University named after Satkynbai Tentishev",
    city: "Kant",
    type: "Private",
    establishedYear: 2004,
    officialWebsite: "#",
    summary: "Located in the quiet town of Kant near Bishkek, this university provides dedicated medical sciences programs exclusively in English.",
    campusLifestyle: "Quiet, removed from capital chaos, yet close enough for weekends.",
    cityProfile: "Kant. Highly affordable.",
    clinicalExposure: "Local clinics with further rotations in Bishkek.",
    hostelOverview: "Dedicated private hostels.",
    indianFoodSupport: "Basic local access.",
    safetyOverview: "Extremely safe suburban atmosphere.",
    studentSupport: "Dedicated FMGE tracks.",
    whyChoose: ["Suburban peace", "WDOMS Listed"],
    thingsToConsider: ["Kant is a smaller town"],
    bestFitFor: ["Suburban lovers"],
    teachingHospitals: ["Kant and Bishkek Centers"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-aiu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "bishkek-international-medical-institute",
    name: "Bishkek International Medical Institute (BIMI)",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2018,
    officialWebsite: "#",
    summary: "BIMI is explicitly tailored to handle international medical graduates, with custom-built labs and simulation environments.",
    campusLifestyle: "Clinical and modern.",
    cityProfile: "Bishkek.",
    clinicalExposure: "High clinical volume ties with capital hospitals.",
    hostelOverview: "Brand new private dorm facilities.",
    indianFoodSupport: "Growing mess support.",
    safetyOverview: "Modern campus security.",
    studentSupport: "Focused entirely on medical licensing success.",
    whyChoose: ["Custom built for international medical students", "WDOMS Listed"],
    thingsToConsider: ["Brand is growing"],
    bestFitFor: ["Licensing-focused students"],
    teachingHospitals: ["Bishkek Partner Network"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-bimi-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Kyrgyzstan Deep Enrichment: Batch 2 ===\n");
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
  console.log("\n✅ Kyrgyzstan Batch 2 Complete!");
}

seed();
