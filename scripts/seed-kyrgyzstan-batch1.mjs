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
    slug: "adam-university",
    name: "Adam University School of Medicine",
    city: "Bishkek",
    type: "Private",
    establishedYear: 1994,
    officialWebsite: "https://adam.edu.kg/",
    summary: "Adam University (formerly BAFE) is a prominent private institution in Bishkek. For 2026, its School of Medicine stands out for an intensely student-focused, English-medium curriculum recently upgraded to meet exact NMC FMGL 2021 requirements.",
    campusLifestyle: "A highly personalized, modern campus in the capital, Bishkek. Known for high European integration and continuous academic mobility programs under Erasmus+.",
    cityProfile: "Bishkek is the capital and largest city. 2026 Cost Index: Extremely affordable. Local Samsa (~100 KGS), public marshrutka (~20 KGS). Monthly living expenses are a mere ~$150-$250 USD.",
    clinicalExposure: "Maintains strong agreements with several leading state hospitals and polyclinics in Bishkek, ensuring rigorous hands-on clinical rotations from the 4th year onward.",
    hostelOverview: "The university provides extremely affordable, fully furnished hostels with strict, continuous security monitoring specifically optimized for international students.",
    indianFoodSupport: "Massive! Bishkek has a thriving Indian community with dedicated Indian messes operating within the hostels, plus numerous authentic restaurants in the city center.",
    safetyOverview: "Bishkek is a peaceful, student-friendly city. The university ensures 24/7 campus and hostel security with a dedicated international student ombudsman.",
    studentSupport: "Excellent teacher-to-student ratio. Provides integrated FMGE/NExT preparation modules and strong European transfer partnerships.",
    whyChoose: [
      "Highly personalized private medical education in the capital",
      "Recently updated 5.5-6 year curriculum strictly for NMC compliance",
      "Incredibly low living costs (~$200/month)",
      "Strong European academic mobility footprint (Erasmus+)"
    ],
    thingsToConsider: [
      "Private university, meaning slightly higher tuition than state hubs like KSMA",
      "Winter temperatures in Bishkek drop below freezing"
    ],
    bestFitFor: ["Budget-conscious families", "Students preferring personalized attention"],
    teachingHospitals: ["Partner State Polyclinics in Bishkek", "National Hospital"],
    recognitionBadges: ["NMC Compliant curriculum", "WHO Recognized", "FAIMER Listed"],
    faq: [
      { question: "Is Adam University recognized in India?", answer: "Yes, it is WDOMS listed and its extended degree complies with NMC dictates." },
      { question: "What is the cost of living?", answer: "Living in Bishkek is highly affordable, usually under $250 USD a month." }
    ],
    programs: [
      {
        slug: "mbbs-adam-kyrgyzstan-2026",
        title: "Medical Degree / MD Program",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://adam.edu.kg/"
      }
    ]
  },
  {
    slug: "kyrgyz-state-medical-academy-ksma",
    name: "I.K. Akhunbaev Kyrgyz State Medical Academy",
    city: "Bishkek",
    type: "Public/State",
    establishedYear: 1939,
    officialWebsite: "https://kgma.kg/",
    summary: "The I.K. Akhunbaev Kyrgyz State Medical Academy (KSMA) is the absolute highest-ranked, premier public medical university in Kyrgyzstan. With a legacy dating back to 1939, it attracts massive volumes of top-tier Indian talent.",
    campusLifestyle: "A massive, authoritative state campus pulsing with thousands of international students. Highly academic, disciplined, and historically rich. KSMA feels like a medical city.",
    cityProfile: "Bishkek. 2026 Cost Index: Highly affordable. Monthly expenses around $200-$250 USD.",
    clinicalExposure: "Unprecedented. As the flagship state academy, it commands its own massive clinical hospitals and partners with almost every major state medical facility in the Kyrgyz Republic.",
    hostelOverview: "Massive state-run dormitory blocks strictly segregated and highly affordable. Private apartment rentals near the campus are also exceptionally popular.",
    indianFoodSupport: "The gold standard. The huge Indian cohort at KSMA sustains an entire ecosystem of Indian restaurants, grocery stores, and tailored tiffin delivery services around the campus.",
    safetyOverview: "State-level security. The highest priority is given to international student welfare, backed by the Kyrgyz Ministry of Health.",
    studentSupport: "As the #1 medical school, it provides unparalleled FMGE and USMLE coaching pathways, massive libraries, and highly credentialed professors.",
    whyChoose: [
      "The #1 Ranked Government Medical University in Kyrgyzstan",
      "Unmatched clinical exposure in massive state hospitals",
      "A massive, established Indian student community",
      "100% compliant with NMC FMGL 2021 criteria (Updated 6-year course)"
    ],
    thingsToConsider: [
      "Admission is highly competitive compared to private institutions",
      "Strict grading policies typical of Soviet-legacy academies"
    ],
    bestFitFor: ["Academic achievers", "Students desiring maximum hospital exposure"],
    teachingHospitals: ["KSMA Medical Center", "National Surgical Center", "City Clinical Hospitals"],
    recognitionBadges: ["Flagship State Academy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is KSMA a government university?", answer: "Yes, it is the premier government medical academy in the country." },
      { question: "Did they update the duration for NMC?", answer: "Yes, KSMA officially extended their MBBS track to comply with the 54-month + internship rule." }
    ],
    programs: [
      {
        slug: "mbbs-ksma-kyrgyzstan-2026",
        title: "Medical Degree / MBBS (State Track)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://kgma.kg/"
      }
    ]
  },
  {
    slug: "jalal-abad-peoples-friendship-university",
    name: "Jalal-Abad State University Medical Faculty",
    city: "Jalal-Abad",
    type: "Public/State",
    establishedYear: 1993,
    officialWebsite: "https://jasu.edu.kg/",
    summary: "Jalal-Abad State University (JASU) serves as the primary academic hub in southern Kyrgyzstan. Its Medical Faculty offers incredibly affordable, state-funded MBBS tracks combined with an authentic, peaceful Central Asian lifestyle.",
    campusLifestyle: "Traditional and relaxed. Jalal-Abad offers a stunning mountainous backdrop, far removed from the capital's bustle. The campus is deeply integrated into the local community.",
    cityProfile: "Jalal-Abad is a major city in the south. 2026 Cost Index: Extremely cheap. Plov (~120 KGS). Monthly expenses can easily fall below $150 USD. Warmer climate than Bishkek.",
    clinicalExposure: "Primary affiliation with Jalal-Abad Regional Hospital, granting students exceptional access to a high volume of local medical and trauma cases.",
    hostelOverview: "Provides very affordable on-campus dormitories. The cost of renting private housing in Jalal-Abad is remarkably low compared to Bishkek.",
    indianFoodSupport: "The university manages dedicated Indian canteens directly within the hostel blocks to cater to the prominent Indian student body.",
    safetyOverview: "A highly serene, safe, and culturally warm city environment. Strong community ties ensure a secure experience.",
    studentSupport: "Dedicated foreign student office. High emphasis on FMGE preparation due to the high volume of South Asian candidates.",
    whyChoose: [
      "Incredibly low tuition fees for a State University (~$3,500/year)",
      "Vastly lower living expenses compared to Bishkek (~$150/month)",
      "Warmer, milder climate in southern Kyrgyzstan",
      "Fully compliant with NMC FMGL 2021 criteria (Updated 6-year course)"
    ],
    thingsToConsider: [
      "Located in Jalal-Abad, which requires a domestic flight or scenic drive from Bishkek",
      "Quieter city life than the massive capital"
    ],
    bestFitFor: ["Budget-conscious students", "Seekers of peaceful study environments"],
    teachingHospitals: ["Jalal-Abad Regional Clinical Hospital"],
    recognitionBadges: ["Major Regional State Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Where is Jalal-Abad?", answer: "It is a major city in southwestern Kyrgyzstan, famous for its walnut forests and mineral springs." }
    ],
    programs: [
      {
        slug: "mbbs-jasu-kyrgyzstan-2026",
        title: "Medical Degree / MBBS (Regional State Track)",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "https://jasu.edu.kg/"
      }
    ]
  },
  {
    slug: "altamimi-international-university",
    name: "Altamimi International University",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2011,
    officialWebsite: "#",
    summary: "Altamimi International University offers private medical sciences pathways in Bishkek with a focus on affordable global education standards.",
    campusLifestyle: "Smaller, focused international student environment.",
    cityProfile: "Bishkek capital. Highly affordable living (~$200/month).",
    clinicalExposure: "Engages through affiliated private and secondary clinics in Bishkek.",
    hostelOverview: "Private accommodation and assisted hostel living.",
    indianFoodSupport: "Excellent access to Bishkek's Indian community resources.",
    safetyOverview: "Extremely safe.",
    studentSupport: "Smaller cohorts guarantee high faculty interaction.",
    whyChoose: ["WDOMS Listed", "Bishkek Location", "Highly Affordable"],
    thingsToConsider: ["Brand recognition is developing compared to state flagships."],
    bestFitFor: ["Budget-conscious private school seekers"],
    teachingHospitals: ["Partner Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-altamimi-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3000,
        totalTuitionUsd: 18000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "avicenna-international-medical-university",
    name: "Avicenna International Medical University",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2018,
    officialWebsite: "#",
    summary: "Avicenna International Medical University is a rapidly growing private institution in Bishkek named after the legendary Persian polymath.",
    campusLifestyle: "Highly modern, ambitious, and deeply focused on international cohorts.",
    cityProfile: "Bishkek. Very affordable.",
    clinicalExposure: "Partnered with developing Bishkek medical centers.",
    hostelOverview: "New, modern private hostel affiliations.",
    indianFoodSupport: "Growing Indian mess network.",
    safetyOverview: "High campus security.",
    studentSupport: "Very competitive support structures to attract global students.",
    whyChoose: ["Modern private infrastructure", "WDOMS Listed"],
    thingsToConsider: ["Brand is relatively new (Est. 2018)"],
    bestFitFor: ["Early adopters"],
    teachingHospitals: ["Capital Clinical Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-avicenna-kyrgyzstan-2026",
        title: "Medical Degree / MD",
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
    slug: "international-european-university",
    name: "International European University Faculty of Medicine",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "A very newly established private faculty in Bishkek aiming to align Central Asian medical training strictly with Western European educational paradigms.",
    campusLifestyle: "Dynamic, startup-like academic energy.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Forming partnerships across capital clinics.",
    hostelOverview: "Private accommodation required.",
    indianFoodSupport: "Bishkek standard.",
    safetyOverview: "Safe city environment.",
    studentSupport: "High attention to detail for pioneer classes.",
    whyChoose: ["WDOMS Listed", "European alignment focus"],
    thingsToConsider: ["Extremely new institution; track record is nascent"],
    bestFitFor: ["Pioneering independent students"],
    teachingHospitals: ["Private Bishkek Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ieu-kyrgyzstan-2026",
        title: "Medical Program",
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
    slug: "international-medical-institute",
    name: "International Medical Institute, International University of Science & Business",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2002,
    officialWebsite: "#",
    summary: "The International Medical Institute operates dynamically under a broader science and business university framework, emphasizing healthcare administration alongside clinical skills.",
    campusLifestyle: "Interdisciplinary and highly professional.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Rotations structured through major Bishkek public hospitals.",
    hostelOverview: "Provides dedicated dormitories.",
    indianFoodSupport: "Standard Bishkek amenities.",
    safetyOverview: "Excellent.",
    studentSupport: "Highly versatile mentoring.",
    whyChoose: ["WDOMS Listed interdisciplinary hub"],
    thingsToConsider: ["Medical faculty is part of a broader business institute"],
    bestFitFor: ["Students interested in healthcare administration"],
    teachingHospitals: ["Partner State Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-imi-kyrgyzstan-2026",
        title: "Medical Degree / MD",
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
    slug: "international-university-science-medicine",
    name: "International University of Science and Medicine (IUSM)",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2016,
    officialWebsite: "#",
    summary: "IUSM is a focused private medical and scientific institution specifically catering to the massive influx of South Asian students seeking English-medium MBBS programs.",
    campusLifestyle: "Extremely diverse, focused intensely on medical licensing exams.",
    cityProfile: "Bishkek. Lively and extremely affordable.",
    clinicalExposure: "Partnered strategically with Bishkek city hospitals.",
    hostelOverview: "Dedicated newly-constructed international hostels.",
    indianFoodSupport: "Massive support; multiple dedicated Indian messes.",
    safetyOverview: "High security, strictly monitored.",
    studentSupport: "Exceptional FMGE coaching networks built into the curriculum.",
    whyChoose: ["WDOMS Listed", "Massive South-Asian student focused infrastructure"],
    thingsToConsider: ["Newer university"],
    bestFitFor: ["FMGE focused students"],
    teachingHospitals: ["Bishkek Network Hospitals"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-iusm-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3300,
        totalTuitionUsd: 19800,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "kasym-tynystanov-issyk-kul-state-university",
    name: "Kasym Tynystanov Issyk Kul State University",
    city: "Karakol",
    type: "Public/State",
    establishedYear: 1940,
    officialWebsite: "http://iksu.kg/",
    summary: "Issyk Kul State University is a major state institution located in Karakol near the stunning Issyk Kul Lake. It provides an authentic regional state medical track in a breathtaking natural environment.",
    campusLifestyle: "A massive, historical regional state campus located in a famous high-altitude resort region. Extreme natural beauty and tranquility.",
    cityProfile: "Karakol. 2026 Cost Index: Unbelievably low. Excellent focus town for serious study.",
    clinicalExposure: "Primary affiliation with Karakol Regional Clinical Hospital and Issyk Kul medical centers.",
    hostelOverview: "Very cheap state dormitories.",
    indianFoodSupport: "Requires self-cooking or utilization of local regional markets.",
    safetyOverview: "An incredibly peaceful and safe tourist-friendly region.",
    studentSupport: "Highly classical state university support structure.",
    whyChoose: [
      "Extremely affordable State university (Est. 1940)",
      "Breathtaking location near Issyk Kul lake",
      "Low distraction, focused environment"
    ],
    thingsToConsider: [
      "Remote location (6-hour stunning drive from Bishkek)",
      "Winter weather is harsh; fewer massive city amenities"
    ],
    bestFitFor: ["Budget-conscious students", "Nature lovers"],
    teachingHospitals: ["Karakol Regional Clinical Hospital"],
    recognitionBadges: ["WDOMS Listed", "Major Regional Hub"],
    faq: [],
    programs: [
      {
        slug: "mbbs-iksu-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 2800,
        totalTuitionUsd: 16800,
        livingUsd: 1500,
        medium: "English",
        officialProgramUrl: "http://iksu.kg/"
      }
    ]
  },
  {
    slug: "kyrgyz-medical-dental-institute",
    name: "Kyrgyz Medical and Dental Institute",
    city: "Bishkek",
    type: "Private",
    establishedYear: 2013,
    officialWebsite: "#",
    summary: "A highly specialized institute in Bishkek initially founded around stomatology but expanded heavily into general medicine.",
    campusLifestyle: "Focused and specialized.",
    cityProfile: "Bishkek.",
    clinicalExposure: "Access to private specialized clinics.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Bishkek standard.",
    safetyOverview: "Safe city protocols.",
    studentSupport: "High teacher engagement due to specialization.",
    whyChoose: ["WDOMS Listed", "Small class sizes"],
    thingsToConsider: ["Significant focus remains on dental sciences"],
    bestFitFor: ["Independent students"],
    teachingHospitals: ["Partner Specialty Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kmdi-kyrgyzstan-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Kyrgyzstan Deep Enrichment: Batch 1 (Top WDOMS Match) ===\n");
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
  console.log("\n✅ Kyrgyzstan Batch 1 Complete!");
}

seed();
