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
    slug: "turon-university",
    name: "Turon University Faculty of Medicine",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "Turon University is a rapidly growing private institution in Tashkent. Its newly established Medical Faculty caters primarily to international students looking for modernized English-medium curriculums.",
    campusLifestyle: "Highly modern, corporate-style learning environment.",
    cityProfile: "Tashkent capital. Premium city living with modern metro infrastructure. ~$300/month.",
    clinicalExposure: "Partnered closely with a variety of private polyclinics in Tashkent.",
    hostelOverview: "Private assisted accommodation heavily utilized.",
    indianFoodSupport: "Capital city means widespread access to Indian restaurants and groceries.",
    safetyOverview: "Very secure private campus.",
    studentSupport: "Heavy focus on technology-assisted learning and FMGE guidance.",
    whyChoose: ["Newly built, modern infrastructure in Tashkent", "Listed in WDOMS"],
    thingsToConsider: ["Brand is still relatively new in Central Asia"],
    bestFitFor: ["Seekers of modern campus living"],
    teachingHospitals: ["Private Tashkent Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-turon-uzbekistan-2026",
        title: "Medical Program / MD",
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
    slug: "urgench-state-medical-institute",
    name: "Urgench State Medical Institute",
    city: "Urgench",
    type: "Public/State",
    establishedYear: 1991,
    officialWebsite: "https://urgenchmed.uz/",
    summary: "Located in the historic Khorezm region, Urgench State Medical Institute is a major regional hub offering a highly robust, deeply traditional state-backed MBBS program.",
    campusLifestyle: "Traditional and intensely academic. Urgench provides an authentic Central Asian living experience far from massive metropolitan distractions.",
    cityProfile: "Urgench. 2026 Cost Index: Extremely cheap. Living expenses hover around $150 USD a month.",
    clinicalExposure: "The institute commands the Khorezm regional clinical networks, providing massive patient exposure.",
    hostelOverview: "State hostels.",
    indianFoodSupport: "Basic to moderate. A growing international student base has introduced dedicated canteens.",
    safetyOverview: "Exceptionally safe rural-regional town vibe.",
    studentSupport: "Dedicated state resources and a surprisingly huge campus.",
    whyChoose: ["A highly affordable, established State Institute", "Vast regional clinical exposure", "NMC FMGL 2021 Compliant"],
    thingsToConsider: ["Far removed from the capital; requires internal flights to Urgench airport"],
    bestFitFor: ["Budget-conscious students prioritizing public universities"],
    teachingHospitals: ["Urgench Regional Hospital System"],
    recognitionBadges: ["WDOMS Listed", "Regional State Hub"],
    faq: [],
    programs: [
      {
        slug: "mbbs-urgench-state-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://urgenchmed.uz/"
      }
    ]
  },
  {
    slug: "alfraganus-university",
    name: "Alfraganus University Faculty of Medicine",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "Named after the historic Persian astronomer Alfraganus, this is a newly framed private medical school heavily leaning into international English-medium modules.",
    campusLifestyle: "Tech-forward and deeply intercultural.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Private partnerships in the capital city.",
    hostelOverview: "Premium private dorms.",
    indianFoodSupport: "Capital city access.",
    safetyOverview: "High modern security.",
    studentSupport: "Pioneer cohort support focusing on rapid international accreditation.",
    whyChoose: ["Located in Tashkent", "WDOMS Listed"],
    thingsToConsider: ["Very new institution"],
    bestFitFor: ["Tech-focused students"],
    teachingHospitals: ["Partner Capital Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-alfraganus-uzbekistan-2026",
        title: "Medical Degree / MD",
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
    slug: "andizhan-state-medical-institute",
    name: "Andizhan State Medical Institute",
    city: "Andijan",
    type: "Public/State",
    establishedYear: 1955,
    officialWebsite: "https://adti.uz/",
    summary: "Andijan State Medical Institute is one of the most prominent, massively populated medical institutes in Uzbekistan. Located in the fertile Fergana Valley, it hosts hundreds of Indian medical aspirants simultaneously.",
    campusLifestyle: "A massive, thriving student city. The campus feels incredibly familiar to Indian students due to the sheer size of the subcontinent cohort.",
    cityProfile: "Andijan. 2026 Cost Index: Exceptionally affordable (~$150/month). Rich in culture and history.",
    clinicalExposure: "Unmatched in the region. ASMI manages its own clinics and is the primary healthcare node for the entire Andijan demographic.",
    hostelOverview: "Massive state hostels dedicated almost entirely to international students.",
    indianFoodSupport: "The gold standard for the region. Specialized Indian messes, local Indian restaurants, and easy access to spices.",
    safetyOverview: "Extremely secure, with the regional government heavily invested in the safety of its international scholars.",
    studentSupport: "Massive FMGE tracking and specialized coaching modules running parallel to the core 6-year degree.",
    whyChoose: [
      "One of the most established State Medical Institutes (1955)",
      "Massive, highly integrated Indian student community",
      "Dirt cheap living expenses in Andijan",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: ["Located in the Fergana Valley (long drive from Tashkent)"],
    bestFitFor: ["Students wanting a huge, familiar community", "Budget state university seekers"],
    teachingHospitals: ["ASMI Dedicated Clinic", "Andijan Central Hospital"],
    recognitionBadges: ["Massive Regional Hub", "WHO Recognized", "NMC Compliant"],
    faq: [
      { question: "Is ASMI good for Indians?", answer: "Yes, it is one of the most popular choices for Indian students in Uzbekistan." }
    ],
    programs: [
      {
        slug: "mbbs-andijan-state-2026",
        title: "Medical Degree / MD (State Track)",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://adti.uz/"
      }
    ]
  },
  {
    slug: "asia-international-university",
    name: "Asia International University Faculty of Medicine",
    city: "Bukhara",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "A private counterpart situated in the historic city of Bukhara, aimed at offering elite English-medium instruction outside the massive state systems.",
    campusLifestyle: "Highly focused, smaller class sizes embedded in a stunning historic city.",
    cityProfile: "Bukhara. Deeply historic and very affordable.",
    clinicalExposure: "Utilizing Bukhara's evolving private health networks.",
    hostelOverview: "Subsidized private models.",
    indianFoodSupport: "Growing. Bukhara is deeply touristic, meaning diverse food availability.",
    safetyOverview: "Highly secure tourist destination.",
    studentSupport: "Focused on premium mentoring.",
    whyChoose: ["Located in stunning Bukhara", "Smaller, personalized class sizes", "WDOMS Listed"],
    thingsToConsider: ["New regional private competitor"],
    bestFitFor: ["Prestige seekers in historic locations"],
    teachingHospitals: ["Bukhara Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-aiu-uzb-2026",
        title: "Medical Program",
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
    slug: "bukhara-innovative-education",
    name: "Bukhara Innovative Education and Medical University",
    city: "Bukhara",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "Also located in Bukhara, this private entity focuses strictly on a modernized, technologically integrated approach to its 6-year medical degree.",
    campusLifestyle: "Modern and quiet.",
    cityProfile: "Bukhara.",
    clinicalExposure: "Tied to regional innovative clinics.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Basic local access.",
    safetyOverview: "Extremely safe.",
    studentSupport: "High utilization of digital learning.",
    whyChoose: ["WDOMS Listed", "Modernized curriculum"],
    thingsToConsider: ["Pioneering faculty"],
    bestFitFor: ["Independent digital learners"],
    teachingHospitals: ["Bukhara City Networks"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-biemu-uzb-2026",
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
    slug: "central-asian-medical-university",
    name: "Central Asian Medical University",
    city: "Fergana",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "A private university established in the Fergana Valley specifically to handle the massive overflow of international students seeking Central Asian MBBS programs.",
    campusLifestyle: "International and developing.",
    cityProfile: "Fergana.",
    clinicalExposure: "Using Fergana regional capacity.",
    hostelOverview: "New private dorms.",
    indianFoodSupport: "Massive reliance on Indian mess systems.",
    safetyOverview: "Good, quiet valley location.",
    studentSupport: "Heavy FMGE focus.",
    whyChoose: ["Built exclusively for international needs", "WDOMS Listed"],
    thingsToConsider: ["Extremely new university brand"],
    bestFitFor: ["Budget searchers tracking FMGE coaching"],
    teachingHospitals: ["Fergana Polyclinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-camu-uzb-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3300,
        totalTuitionUsd: 19800,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "chirchik-branch-tsmu",
    name: "Chirchik Branch of Tashkent State Medical University",
    city: "Chirchik",
    type: "Public/State",
    establishedYear: 2019,
    officialWebsite: "#",
    summary: "An official regional branch of the massive Tashkent State Medical University network, situated in the industrial/suburban town of Chirchik.",
    campusLifestyle: "A focused, satellite campus environment strictly academic.",
    cityProfile: "Chirchik (Satellite of Tashkent). Very cheap.",
    clinicalExposure: "Industrial and municipal hospitals of Chirchik.",
    hostelOverview: "State network hostels.",
    indianFoodSupport: "Growing access via proximity to Tashkent.",
    safetyOverview: "Safe suburban town.",
    studentSupport: "Backed by the enormous Tashkent State system.",
    whyChoose: ["Same degree backing as Tashkent State", "Cheaper living index in Chirchik"],
    thingsToConsider: ["Not the main Tashkent campus"],
    bestFitFor: ["State legacy seekers on a budget"],
    teachingHospitals: ["Chirchik Municipal Hospital"],
    recognitionBadges: ["State Branch", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-chirchik-tsmu-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1800,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "emu-university",
    name: "EMU University Faculty of Medicine",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "European Medical University (EMU) is a deeply ambitious private project in Tashkent aimed at perfectly aligning Uzbek medical outcomes with European mobility directives.",
    campusLifestyle: "Modern, European-styled learning.",
    cityProfile: "Tashkent capital.",
    clinicalExposure: "Premium capital hospital integrations.",
    hostelOverview: "Modern apartments standard.",
    indianFoodSupport: "Tashkent network access.",
    safetyOverview: "High tier.",
    studentSupport: "Massive focus on language tracks and European placements.",
    whyChoose: ["European curriculum alignment", "Located in Tashkent", "WDOMS Listed"],
    thingsToConsider: ["High private tuition costs and new brand presence"],
    bestFitFor: ["Future European practitioners"],
    teachingHospitals: ["Partner Premium Tashkent Clinics"],
    recognitionBadges: ["European Focus", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-emu-uzbekistan-2026",
        title: "Medical Program",
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
    slug: "fergana-state-university",
    name: "Fergana State University Medical Centre",
    city: "Fergana",
    type: "Public/State",
    establishedYear: 1930,
    officialWebsite: "#",
    summary: "The medical centre of the broader Fergana State University serves as another massive state pillar in the Valley, combining deep history with public medical instruction.",
    campusLifestyle: "Enormous state university lifestyle with thousands of domestic and international students.",
    cityProfile: "Fergana. Cheap, green, and culturally rich.",
    clinicalExposure: "Massive access to broader state hospital networks.",
    hostelOverview: "State dorms.",
    indianFoodSupport: "Valley networks.",
    safetyOverview: "Excellent.",
    studentSupport: "Established, historically backed state mentorship.",
    whyChoose: ["Broad state university backing", "Cheap living", "WDOMS Listed"],
    thingsToConsider: ["Different faculty structure than the Fergana Medical Institute of Public Health"],
    bestFitFor: ["State seekers"],
    teachingHospitals: ["State Validation Clinics"],
    recognitionBadges: ["Historic State Hub", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-fergana-state-centre-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Uzbekistan Deep Enrichment: Batch 2 ===\n");
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
  console.log("\n✅ Uzbekistan Batch 2 Complete!");
}

seed();
