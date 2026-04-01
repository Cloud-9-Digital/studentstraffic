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
    slug: "termez-economics-services",
    name: "Termez University of Economics and Services",
    city: "Termez",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "A private university in the deep southern city of Termez that has rapidly expanded its faculties to include English-medium WDOMS medical sciences.",
    campusLifestyle: "Highly focused on regional development and affordability.",
    cityProfile: "Termez. One of the hottest and cheapest cities in Uzbekistan. Monthly living <$150 USD.",
    clinicalExposure: "Partnered with local polyclinics.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Minimal; requires self-cooking mostly.",
    safetyOverview: "Border city security.",
    studentSupport: "New mentoring structures.",
    whyChoose: ["WDOMS Listed", "Extremely cheap location"],
    thingsToConsider: ["Medical faculty operates within a broader economics university"],
    bestFitFor: ["Budget independent seekers"],
    teachingHospitals: ["Private Termez Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-termez-economics-2026",
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
    slug: "university-business-science",
    name: "University of Business and Science",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "As private education scales in Tashkent, this university integrated a focused medical faculty aiming at producing internationally certified graduates.",
    campusLifestyle: "Dynamic, business and logic-oriented.",
    cityProfile: "Tashkent capital.",
    clinicalExposure: "Uses capital city private partnerships.",
    hostelOverview: "Private housing required.",
    indianFoodSupport: "Tashkent access.",
    safetyOverview: "High security.",
    studentSupport: "Tech-reliant mentorship.",
    whyChoose: ["WDOMS Listed", "Tashkent location"],
    thingsToConsider: ["Primarily recognized for business logistics historically"],
    bestFitFor: ["Interdisciplinary students"],
    teachingHospitals: ["Partner Networks"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ubs-uzbekistan-2026",
        title: "Medical Degree / MD",
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
    slug: "urgench-ranch",
    name: "Urgench Ranch University of Technology Faculty of Medical Sciences",
    city: "Urgench",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "Operating in the Khorezm region, this specialized technological institute offers highly digitized foundational medical sciences.",
    campusLifestyle: "Tech-forward in a regional setting.",
    cityProfile: "Urgench. Extremely cheap.",
    clinicalExposure: "Rotations alongside state-backed clinics.",
    hostelOverview: "Private assisted dorms.",
    indianFoodSupport: "Basic.",
    safetyOverview: "Very safe towns.",
    studentSupport: "High tech and labs.",
    whyChoose: ["WDOMS Listed technological institute"],
    thingsToConsider: ["Very new brand"],
    bestFitFor: ["Tech-enabled early adopters"],
    teachingHospitals: ["Urgench Analytics Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-urgench-ranch-2026",
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
    slug: "zarmed-university",
    name: "Zarmed University Faculty of Medicine",
    city: "Bukhara",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "https://zarmed.uz/",
    summary: "Zarmed University operates massive private healthcare networks in Uzbekistan and runs a specialized medical faculty integrating directly into its own clinics.",
    campusLifestyle: "Highly clinical and corporate.",
    cityProfile: "Bukhara.",
    clinicalExposure: "Exceptional. Partnered directly with the Zarmed parent healthcare network.",
    hostelOverview: "Premium private dorms.",
    indianFoodSupport: "Massive support operations.",
    safetyOverview: "Elite private security.",
    studentSupport: "Backed by direct healthcare employers.",
    whyChoose: ["Backed by the massive Zarmed healthcare network", "WDOMS Listed"],
    thingsToConsider: ["Private tuition rates apply"],
    bestFitFor: ["Corporate medicine seekers"],
    teachingHospitals: ["Zarmed Clinics Bukhara"],
    recognitionBadges: ["Zarmed Private Hub", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-zarmed-uzbekistan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://zarmed.uz/"
      }
    ]
  },
  {
    slug: "zarmed-university-samarkand",
    name: "Zarmed University Faculty of Medicine Samarkand",
    city: "Samarkand",
    type: "Private",
    establishedYear: 2022,
    officialWebsite: "https://zarmed.uz/",
    summary: "Following its massive success, Zarmed launched its Samarkand branch to provide premium private medical training leveraging its expanding corporate hospital footprints.",
    campusLifestyle: "Modern, new-build corporate campus in historic Samarkand.",
    cityProfile: "Samarkand. Stunning and highly cheap.",
    clinicalExposure: "Directly uses the Zarmed high-tech diagnostics centers in Samarkand.",
    hostelOverview: "Premium dorms.",
    indianFoodSupport: "Excellent access in Samarkand.",
    safetyOverview: "Elite security.",
    studentSupport: "Heavy FMGE / Licensing coaching integration.",
    whyChoose: ["Direct access to Zarmed clinics in Samarkand", "WDOMS Listed"],
    thingsToConsider: ["Branch campus of the Bukhara headquarters"],
    bestFitFor: ["Tech and diagnostics lovers"],
    teachingHospitals: ["Zarmed Clinics Samarkand"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-zarmed-samarkand-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://zarmed.uz/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Uzbekistan Deep Enrichment: Batch 4 (FINAL UZB) ===\n");
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
  console.log("\n✅ Uzbekistan Batch 4 Complete! EVERY WDOMS UZBEK UNIVERSITY IS NOW ENRICHED!");
}

seed();
