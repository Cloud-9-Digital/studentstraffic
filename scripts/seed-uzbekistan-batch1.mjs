import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const UZBEKISTAN_ID = 49;
const COURSE_MBBS_ID = 13;

const universities = [
  {
    slug: "samarkand-state-medical-university",
    name: "Samarkand State Medical University",
    city: "Samarkand",
    type: "Public/State",
    establishedYear: 1930,
    officialWebsite: "https://www.sammu.uz/",
    summary: "Samarkand State Medical University is one of Central Asia's oldest and most prestigious state medical hubs. For 2026, it is a primary destination for Indian students due to its historic Silk Road location, massive state hospitals, and deeply rigorous European-style English-medium curriculum.",
    campusLifestyle: "Deeply historic and culturally stunning. The campus is woven into Samarkand, one of the oldest inhabited cities in the world. Academics are heavily disciplined.",
    cityProfile: "Samarkand. 2026 Cost Index: Very affordable. Living costs average under $200 USD/month. Stunning Islamic architecture and extreme safety.",
    clinicalExposure: "Unprecedented. Operates multi-disciplinary university hospitals and partners with the largest state clinics in the Samarkand region.",
    hostelOverview: "Massive state-run dormitories built to handle thousands of international students. Private apartments near Registan Square are very cheap.",
    indianFoodSupport: "Massive Indian student population supports entirely dedicated Indian messes and widespread availability of familiar spices.",
    safetyOverview: "Extremely safe tourist-centric city with heavy government protection for international students.",
    studentSupport: "Excellent teacher-to-student ratio. High emphasis on FMGE coaching due to the enormous South Asian presence.",
    whyChoose: [
      "Historic State University with 90+ years of medical legacy",
      "Stunning tourist-city location with dirt-cheap living costs",
      "Vast network of state-run university teaching hospitals",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Very competitive admission",
      "Harsh winters, typical of higher-altitude Central Asian cities"
    ],
    bestFitFor: ["Seekers of prestige", "History and culture lovers"],
    teachingHospitals: ["Samarkand State Medical University Clinic", "Regional Central Hospitals"],
    recognitionBadges: ["Oldest Central Asian Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it a public university?", answer: "Yes, it is a flagship public state university in Uzbekistan." }
    ],
    programs: [
      {
        slug: "mbbs-samarkand-state-2026",
        title: "Medical Degree / MD (State Track)",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://www.sammu.uz/"
      }
    ]
  },
  {
    slug: "fergana-medical-institute-of-public-health",
    name: "Fergana Medical Institute of Public Health",
    city: "Fergana",
    type: "Public/State",
    establishedYear: 1991,
    officialWebsite: "https://fmiph.uz/",
    summary: "Located in the incredibly fertile and vibrant Fergana Valley, this state institute specializes heavily in public health and general medicine. It has rapidly scaled its English-medium MBBS program for international applicants.",
    campusLifestyle: "Highly focused on community medicine and public health. Fergana is extremely green, peaceful, and traditionally Uzbek.",
    cityProfile: "Fergana Valley. 2026 Cost Index: Dirt cheap. Plov pricing under 30,000 UZS. Monthly expenses ~$150-$200 USD.",
    clinicalExposure: "Partners directly with the massive Fergana Regional Hospital and various polyclinics.",
    hostelOverview: "State hostels provide subsidized living specifically for international batches.",
    indianFoodSupport: "Dedicated on-campus Indian canteens available.",
    safetyOverview: "Very safe, close-knit rural/suburban valley community.",
    studentSupport: "Focus on preventative medicine and direct FMGE coaching integration.",
    whyChoose: [
      "Extremely peaceful, green location in the Fergana Valley",
      "Highly affordable state institution (~$3,500/yr)",
      "Excellent focus on preventative and public health medicine",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Located far from the capital Tashkent",
      "Fergana Valley is more traditional and quieter than major cities"
    ],
    bestFitFor: ["Budget-conscious students", "Students who prefer quiet study environments"],
    teachingHospitals: ["Fergana Regional Clinical Hospital"],
    recognitionBadges: ["State Health Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [],
    programs: [
      {
        slug: "mbbs-fergana-state-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://fmiph.uz/"
      }
    ]
  },
  {
    slug: "first-tashkent-state-medical-institute",
    name: "First Tashkent State Medical Institute",
    city: "Tashkent",
    type: "Public/State",
    establishedYear: 1919,
    officialWebsite: "#",
    summary: "Historically one of the most significant medical establishments in Tashkent. Part of the broader Tashkent Medical Academy legacy, it offers elite state-level medical sciences training in the capital.",
    campusLifestyle: "Highly regimented, historic, and incredibly academic.",
    cityProfile: "Tashkent capital. 2026 Cost Index: ~$250-$350 USD monthly.",
    clinicalExposure: "Directly tied to the massive Tashkent state hospital network.",
    hostelOverview: "State dormitories available in the capital.",
    indianFoodSupport: "Extensive access via Tashkent's massive multicultural network.",
    safetyOverview: "Capital city security protocols.",
    studentSupport: "Elite state-backed research tracks.",
    whyChoose: ["Elite legacy state institution", "Located in the capital", "NMC compliant"],
    thingsToConsider: ["Extremely competitive entrance"],
    bestFitFor: ["Top academic performers"],
    teachingHospitals: ["First Tashkent State Clinics"],
    recognitionBadges: ["Legacy Hub", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tashkent-first-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "angren-university",
    name: "Angren University Faculty of Medicine",
    city: "Angren",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "A newly formed private university operating in the industrial city of Angren, near Tashkent, providing a secluded, focused medical track.",
    campusLifestyle: "New and rapidly developing infrastructure.",
    cityProfile: "Angren. Highly affordable and industrially focused.",
    clinicalExposure: "Partnered with local Angren hospitals.",
    hostelOverview: "Assisted private accommodation.",
    indianFoodSupport: "Basic local access.",
    safetyOverview: "Very safe.",
    studentSupport: "Highly personalized for pioneer cohorts.",
    whyChoose: ["WDOMS Listed", "Affordable private option near Tashkent"],
    thingsToConsider: ["Brand is extremely new"],
    bestFitFor: ["Pioneering independent students"],
    teachingHospitals: ["Angren City Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-angren-uzbekistan-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "impuls-medical-institute",
    name: "Impuls Medical Institute",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2022,
    officialWebsite: "#",
    summary: "Impuls Medical Institute is a modern, progressive private medical school emerging in Tashkent, aggressively targeting the international student block with fully English curriculums.",
    campusLifestyle: "Startup atmosphere, highly tech-driven.",
    cityProfile: "Tashkent capital.",
    clinicalExposure: "Partnered with developing Tashkent private and public clinics.",
    hostelOverview: "Premium private dorms.",
    indianFoodSupport: "Capital city access.",
    safetyOverview: "Modern campus security.",
    studentSupport: "Direct focus on FMGE success.",
    whyChoose: ["Modern curriculum", "Listed in WDOMS"],
    thingsToConsider: ["Track record is still building"],
    bestFitFor: ["Tech-focused students"],
    teachingHospitals: ["Partner Capital Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-impuls-uzbekistan-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "karshi-state-university",
    name: "Karshi State University Faculty of Medicine",
    city: "Karshi",
    type: "Public/State",
    establishedYear: 1992,
    officialWebsite: "#",
    summary: "Karshi State University is a major institutional backbone in southern Uzbekistan. Its Medical Faculty leverages regional hospital networks to train dedicated medical professionals.",
    campusLifestyle: "Traditional state-university environment, highly respected locally.",
    cityProfile: "Karshi. Warm southern climate and extremely cheap living.",
    clinicalExposure: "Karshi Regional Hospitals.",
    hostelOverview: "State hostels.",
    indianFoodSupport: "Self-cooking required.",
    safetyOverview: "Safe southern city.",
    studentSupport: "Strong state resources.",
    whyChoose: ["State University in the south", "Very cheap living index"],
    thingsToConsider: ["Far from Tashkent"],
    bestFitFor: ["Budget state university seekers"],
    teachingHospitals: ["Karshi State Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-karshi-state-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kokand-university",
    name: "Kokand University Andijan Branch Faculty of Medicine",
    city: "Andijan",
    type: "Private",
    establishedYear: 2019,
    officialWebsite: "#",
    summary: "Operating in Andijan (Fergana Valley region), this private branch of Kokand University brings specialized private medical instruction to a highly populated region.",
    campusLifestyle: "Modern branch campus focused entirely on clinical sciences.",
    cityProfile: "Andijan. Deeply cultural and highly affordable.",
    clinicalExposure: "Andijan regional and municipal clinics.",
    hostelOverview: "Private assisted dormitories.",
    indianFoodSupport: "Growing Indian presence in Andijan.",
    safetyOverview: "Traditional and safe.",
    studentSupport: "Highly localized faculty mentorship.",
    whyChoose: ["Affordable private branch", "Fergana Valley location"],
    thingsToConsider: ["It is a branch campus, not the main Kokand hub"],
    bestFitFor: ["Quiet town seekers"],
    teachingHospitals: ["Andijan Network Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kokand-andijan-2026",
        title: "Medical Program",
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
    slug: "medical-institute-of-karakalpakstan",
    name: "Medical Institute of Karakalpakstan",
    city: "Nukus",
    type: "Public/State",
    establishedYear: 1991,
    officialWebsite: "#",
    summary: "Located in the autonomous republic of Karakalpakstan, this state institute is the sole major medical hub serving the far-western region of Uzbekistan.",
    campusLifestyle: "Remote, highly unique academic environment with completely distinct cultural roots.",
    cityProfile: "Nukus. Remote, desert climate, and incredibly affordable.",
    clinicalExposure: "The institute controls the primary health networks for the entire autonomous republic.",
    hostelOverview: "State hostels.",
    indianFoodSupport: "Very limited; requires self-cooking.",
    safetyOverview: "A remote and quiet region.",
    studentSupport: "Pioneering state support.",
    whyChoose: ["Unrivaled regional clinical dominance", "Unique location"],
    thingsToConsider: ["Nukus is extremely remote and deals with distinct ecological challenges (Aral Sea region)"],
    bestFitFor: ["Adventurous medical students"],
    teachingHospitals: ["Nukus Regional Networks"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-karakalpakstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 2800,
        totalTuitionUsd: 16800,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "profi-university",
    name: "Profi University Faculty of Medicine",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "Profi University is a modern, broad private university in Tashkent that recently incorporated a dedicated, WDOMS-listed medical faculty.",
    campusLifestyle: "Corporate, digitized, and highly modern.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Agreements with capital area polyclinics.",
    hostelOverview: "Assisted private accommodation.",
    indianFoodSupport: "Tashkent standard.",
    safetyOverview: "Modern private security.",
    studentSupport: "Strong emphasis on digital learning tools.",
    whyChoose: ["Tashkent location", "Digitally forward"],
    thingsToConsider: ["Medical faculty represents a small portion of the overall university"],
    bestFitFor: ["Tech-enabled learners"],
    teachingHospitals: ["Private Tashkent Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-profi-uzbekistan-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "tashkent-pharmaceutical-institute",
    name: "Tashkent Pharmaceutical Institute Faculty of General Medicine",
    city: "Tashkent",
    type: "Public/State",
    establishedYear: 1937,
    officialWebsite: "#",
    summary: "Historically the most elite pharmaceutical hub in Central Asia, it has expanded to provide high-quality, state-backed general medicine programs.",
    campusLifestyle: "Intensely scientific, chemistry, and research-heavy environment.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Heavy pharmacology focus integrated into state hospital rotations.",
    hostelOverview: "State dorms in Tashkent.",
    indianFoodSupport: "Standard access.",
    safetyOverview: "High security.",
    studentSupport: "Renowned pharmacological research facilities.",
    whyChoose: ["Incredible pharmacology resources", "Historic state institute in Tashkent"],
    thingsToConsider: ["Core legacy is pharmacy, not general surgery"],
    bestFitFor: ["Research and pharmacology seekers"],
    teachingHospitals: ["Tashkent Medical Networks"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tashkent-pharma-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3900,
        totalTuitionUsd: 23400,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Uzbekistan Deep Enrichment: Batch 1 (Top WDOMS Match) ===\n");
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
        UZBEKISTAN_ID, uni.slug, uni.name, uni.city, uni.type, uni.establishedYear, uni.summary,
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
  console.log("\n✅ Uzbekistan Batch 1 Complete!");
}

seed();
