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
    slug: "gulistan-state-university",
    name: "Gulistan State University Faculty of Medicine",
    city: "Gulistan",
    type: "Public/State",
    establishedYear: 1965,
    officialWebsite: "https://glsu.uz/",
    summary: "Gulistan State University serves the Syrdarya region of Uzbekistan. Its Faculty of Medicine brings state-level clinical instruction to a rapidly growing agrarian and industrial zone.",
    campusLifestyle: "A traditional regional state university campus. The city of Gulistan is laid-back and agrarian-focused.",
    cityProfile: "Gulistan. 2026 Cost Index: Very low. It is primarily an agricultural hub, ensuring extremely cheap living costs (~$150 USD/month).",
    clinicalExposure: "Partnered extensively with the Syrdarya Regional Hospital system.",
    hostelOverview: "State dormitories available locally on campus.",
    indianFoodSupport: "Self-cooking is primarily required, though the university attempts to cater to small international cohorts.",
    safetyOverview: "Extremely quiet and safe rural-city environment.",
    studentSupport: "Faculty provides direct, hands-on clinical mentorship.",
    whyChoose: ["State University backing", "Extremely low cost of living index"],
    thingsToConsider: ["Gulistan is less metropolitan than Tashkent or Samarkand"],
    bestFitFor: ["Budget-focused independent students"],
    teachingHospitals: ["Syrdarya Regional Network Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-gulistan-state-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://glsu.uz/"
      }
    ]
  },
  {
    slug: "institute-pharmaceutical-education-research",
    name: "Institute of Pharmaceutical Education and Research",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2020,
    officialWebsite: "#",
    summary: "A newly established specialized science institute in Tashkent that blends pharmacological training directly into general medical modules.",
    campusLifestyle: "Highly focused on labs and clinical analytics.",
    cityProfile: "Tashkent capital.",
    clinicalExposure: "Focused heavily on clinical pharmacology in partner private hospitals.",
    hostelOverview: "Must rent private accommodation in Tashkent.",
    indianFoodSupport: "Tashkent network accessible.",
    safetyOverview: "Modern lab security protocols.",
    studentSupport: "Heavy research subsidies.",
    whyChoose: ["WDOMS Listed", "Pharmacology-heavy foundation"],
    thingsToConsider: ["Specialized institute, fewer massive trauma rotations"],
    bestFitFor: ["Research and pharmacology seekers"],
    teachingHospitals: ["Partner Labs and Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-iper-uzbekistan-2026",
        title: "Medical Program / MD",
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
    slug: "kimyo-international-university",
    name: "Kimyo International University School of Medicine",
    city: "Tashkent",
    type: "Private",
    establishedYear: 2018,
    officialWebsite: "https://kiut.uz/",
    summary: "Kimyo International University in Tashkent (formerly Yeoju Technical Institute) represents a massive South Korean-Uzbek educational collaboration. Its newly minted School of Medicine boasts incredibly high-tech infrastructure.",
    campusLifestyle: "Hyper-modern, heavily influenced by South Korean educational architectures and technology standards.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Currently expanding clinical bases but heavily reliant on ultra-modern simulation centers.",
    hostelOverview: "Premium private dorms.",
    indianFoodSupport: "Easily accessible in Tashkent.",
    safetyOverview: "Elite private security.",
    studentSupport: "Korean-backed infrastructural support with huge international mobility opportunities.",
    whyChoose: ["South Korean backed technology and infrastructure", "Located in Tashkent", "WDOMS Listed"],
    thingsToConsider: ["Brand is rapidly evolving but tuition is slightly higher"],
    bestFitFor: ["Tech-enabled learners"],
    teachingHospitals: ["Partner Capital Clinics"],
    recognitionBadges: ["WDOMS Listed", "Tech Hub"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kimyo-uzbekistan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://kiut.uz/"
      }
    ]
  },
  {
    slug: "mamun-university",
    name: "Ma'mun University Faculty of Medicine",
    city: "Khiva",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "Named after the historic Khorezmian scholar, this new private university sits near the ancient city of Khiva, offering an intriguing cultural backdrop to English-medium medical studies.",
    campusLifestyle: "Deeply historic but independently operated.",
    cityProfile: "Khiva. A stunning UNESCO World Heritage town.",
    clinicalExposure: "Partnered with Urgench and Khiva regional health initiatives.",
    hostelOverview: "Subsidized private models.",
    indianFoodSupport: "Minimal; growing with tourism.",
    safetyOverview: "Extremely safe tourist city.",
    studentSupport: "Smaller cohorts enable tailored teaching.",
    whyChoose: ["Incredible historic location in Khiva", "WDOMS Listed"],
    thingsToConsider: ["Extremely quiet, non-metropolitan town"],
    bestFitFor: ["History lovers and quiet learners"],
    teachingHospitals: ["Regional Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-mamun-uzbekistan-2026",
        title: "Medical Program / MD",
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
    slug: "namangan-state-university",
    name: "Namangan State University Faculty of Medicine",
    city: "Namangan",
    type: "Public/State",
    establishedYear: 1942,
    officialWebsite: "https://namdu.uz/",
    summary: "Namangan State University is another major pillar in the Fergana Valley. Its Medical Faculty harnesses the massive demographic of Namangan to offer incredibly diverse clinical rotations at a very low cost.",
    campusLifestyle: "A bustling, massive state university campus in a culturally rich valley city.",
    cityProfile: "Namangan. 2026 Cost Index: Very low (~$150-$200 USD monthly). Warm climate.",
    clinicalExposure: "The primary medical faculty uses the massive Namangan Regional Hospital systems.",
    hostelOverview: "State hostels.",
    indianFoodSupport: "The Fergana Valley's large international community ensures good access.",
    safetyOverview: "Very safe and community-focused.",
    studentSupport: "Backed by the massive state system.',",
    whyChoose: ["Located in the bustling Fergana Valley", "Highly affordable State University", "WDOMS Listed"],
    thingsToConsider: ["Long overland travel from Tashkent"],
    bestFitFor: ["Budget state university searchers"],
    teachingHospitals: ["Namangan State Teaching Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-namangan-state-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://namdu.uz/"
      }
    ]
  },
  {
    slug: "navoi-state-university",
    name: "Navoi State University Faculty of Natural Sciences and Medicine",
    city: "Navoi",
    type: "Public/State",
    establishedYear: 1992,
    officialWebsite: "#",
    summary: "Navoi State University operates in the industrial and mining hub of Navoi. Its medical programs integrate heavily with occupational health and general medicine.",
    campusLifestyle: "Industrial city ecosystem, highly state-oriented.",
    cityProfile: "Navoi. Highly affordable industrial city.",
    clinicalExposure: "State hospitals and massive occupational health clinics.",
    hostelOverview: "State dorms.",
    indianFoodSupport: "Requires self-reliance.",
    safetyOverview: "Very secure.",
    studentSupport: "Industrial research focus.",
    whyChoose: ["State University backing", "Specialized occupational exposure"],
    thingsToConsider: ["Industrial aesthetics vs historic cities"],
    bestFitFor: ["Independent Budget learners"],
    teachingHospitals: ["Navoi State Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-navoi-state-2026",
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
    slug: "second-tashkent-state-medical-institute",
    name: "Second Tashkent State Medical Institute",
    city: "Tashkent",
    type: "Public/State",
    establishedYear: 1990,
    officialWebsite: "#",
    summary: "Historically formed by splitting the massive Tashkent medical apparatus, the Second Institute (now heavily integrated under TMA) handles intense clinical sciences in the capital.",
    campusLifestyle: "Highly regimented clinical environment in Tashkent.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Exceptional. Controls the Second State Clinical Hospital.",
    hostelOverview: "State dorms in the capital.",
    indianFoodSupport: "Capital city access.",
    safetyOverview: "High state security.",
    studentSupport: "Exceptional clinical coaching.",
    whyChoose: ["Legacy Tashkent State Hub", "WDOMS Listed"],
    thingsToConsider: ["Highly competitive screening"],
    bestFitFor: ["Clinical perfectionists"],
    teachingHospitals: ["Second Tashkent State Hospital"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tashkent-second-2026",
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
    slug: "tashkent-pediatric-medical-institute",
    name: "Tashkent Pediatric Medical Institute",
    city: "Tashkent",
    type: "Public/State",
    establishedYear: 1972,
    officialWebsite: "https://tashpmi.uz/",
    summary: "While specialized heavily in pediatrics historically, TPMI now offers exceptionally recognized generalized medical training and is highly reputed across Central Asia.",
    campusLifestyle: "A highly focused, elite medical academy sitting squarely in the capital.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Incredible exposure to maternal, pediatric, and general surgery wards.",
    hostelOverview: "State dorms highly competitive.",
    indianFoodSupport: "Tashkent standard.",
    safetyOverview: "Elite protection level.",
    studentSupport: "Incredible legacy mentorship and research frameworks.",
    whyChoose: ["One of the most reputed institutes in Tashkent (1972)", "Elite clinical networks"],
    thingsToConsider: ["General MD track available but pediatric focus remains strong institutionally"],
    bestFitFor: ["Future pediatricians and elite academics"],
    teachingHospitals: ["Tashkent Primary Centers"],
    recognitionBadges: ["WDOMS Listed", "Key Regional Hub"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tpmi-uzbekistan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4200,
        totalTuitionUsd: 25200,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://tashpmi.uz/"
      }
    ]
  },
  {
    slug: "tashkent-state-dental-institute",
    name: "Tashkent State Dental Institute Faculty of Medicine",
    city: "Tashkent",
    type: "Public/State",
    establishedYear: 2014,
    officialWebsite: "https://tsdi.uz/",
    summary: "Built as a spinoff to handle the massive demand for stomatology, TSDI also facilitates an expanding general medicine track to address capital city constraints.",
    campusLifestyle: "Streamlined, heavily reliant on highly specialized anatomical models and simulation.",
    cityProfile: "Tashkent.",
    clinicalExposure: "Partnered with both dental networks and general polyclinics.",
    hostelOverview: "Capital city state hostels.",
    indianFoodSupport: "Available through local networks.",
    safetyOverview: "High security.",
    studentSupport: "Excellent simulation centers.",
    whyChoose: ["WDOMS Listed State Platform", "Central capital location"],
    thingsToConsider: ["Institution primarily branded for dentistry"],
    bestFitFor: ["Boutique learners"],
    teachingHospitals: ["Tashkent Central Polyclinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tsdi-uzbekistan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://tsdi.uz/"
      }
    ]
  },
  {
    slug: "termez-branch-tsmu",
    name: "Termez Branch of Tashkent State Medical University",
    city: "Termez",
    type: "Public/State",
    establishedYear: 2018,
    officialWebsite: "#",
    summary: "An official branch of Tashkent Medical University located in the ancient, deeply historic southernmost city of Termez, specifically addressing regional health shortages.",
    campusLifestyle: "Remote, culturally unique, and heavily influenced by the Afghan border culture.",
    cityProfile: "Termez. One of the hottest and cheapest cities in Uzbekistan. Monthly living <$150 USD.",
    clinicalExposure: "Controls the Termez Regional Hospitals.",
    hostelOverview: "State dorms locally.",
    indianFoodSupport: "Requires self-cooking mostly.",
    safetyOverview: "Heavily secured due to border region status.",
    studentSupport: "Tashkent curriculum supplied remotely.",
    whyChoose: ["Tashkent State Degree", "Cheapest living in the deep south"],
    thingsToConsider: ["Termez is extremely hot in summer and very remote"],
    bestFitFor: ["Highly independent academics"],
    teachingHospitals: ["Termez Regional Center"],
    recognitionBadges: ["State Branch", "WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-termez-tsmu-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Uzbekistan Deep Enrichment: Batch 3 ===\n");
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
  console.log("\n✅ Uzbekistan Batch 3 Complete!");
}

seed();
