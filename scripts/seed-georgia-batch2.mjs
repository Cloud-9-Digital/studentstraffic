import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const GEORGIA_ID = 47;
const COURSE_MBBS_ID = 13;

const universities = [
  {
    slug: "akaki-tsereteli-state-university",
    name: "Akaki Tsereteli State University",
    city: "Kutaisi",
    type: "Public/State",
    establishedYear: 1930,
    officialWebsite: "https://atsu.edu.ge/",
    summary: "Akaki Tsereteli State University is a major public university in Kutaisi, Georgia's ancient capital. For 2026, it offers one of the most highly sought-after, affordable public medical degrees with deep clinical exposure starting in the third year.",
    campusLifestyle: "A vast, historic campus. Kutaisi offers a very different vibe from Tbilisi—quieter, deeply cultural, and significantly cheaper. The university has a strong, disciplined academic approach typical of state institutions.",
    cityProfile: "Kutaisi is a major city in Western Georgia. 2026 Cost Index: Highly affordable. Khachapuri (~6 GEL). Monthly expenses around $200-$300 USD. It has its own international airport, making travel convenient.",
    clinicalExposure: "As a major state university, it utilizes the primary regional state hospitals in Imereti (Kutaisi). Extensive hands-on regional trauma and clinical wards.",
    hostelOverview: "State hostels are available and very affordable. Many students also rent local apartments near the city center.",
    indianFoodSupport: "Self-cooking is primary. Kutaisi has markets with fresh produce and increasing availability of imported spices.",
    safetyOverview: "Extremely safe. Kutaisi is a peaceful, traditional Georgian city where students are highly respected.",
    studentSupport: "Strong emphasis on strict academic discipline. The university provides pathways for European medical licensing alongside FMGE.",
    whyChoose: [
      "Affordable State/Public University (Est. 1930)",
      "Low cost of living in Kutaisi compared to Tbilisi",
      "Direct access to Kutaisi Regional State Hospitals",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Located in Kutaisi, 3.5 hours from Tbilisi",
      "State university regulations are much stricter regarding attendance"
    ],
    bestFitFor: ["Budget-conscious students", "Students preferring public/state universities"],
    teachingHospitals: ["Kutaisi Regional Clinical Hospital", "Imereti Diagnostic Center"],
    recognitionBadges: ["Elite State Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it a public university?", answer: "Yes, it is one of Georgia's largest and oldest public universities." }
    ],
    programs: [
      {
        slug: "mbbs-akaki-tsereteli-2026",
        title: "Medical Degree / MD (State Track)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://atsu.edu.ge/"
      }
    ]
  },
  {
    slug: "caucasus-international-university",
    name: "Caucasus International University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1995,
    officialWebsite: "https://ciu.edu.ge/",
    summary: "Caucasus International University (CIU) is a premier private medical school in Tbilisi. For 2026, it is recognized for its massive international student body and its exclusive partnerships with elite private clinics like the Caucasus Medical Centre.",
    campusLifestyle: "Dynamic, modern, and highly international. The campus boasts state-of-the-art simulation centers and a vibrant, politically and socially active student community.",
    cityProfile: "Tbilisi is a bustling European capital. 2026 Cost Index: Standard Khachapuri (~8-10 GEL). Monthly expenses around $300-$400 USD. Active nightlife and rich culture.",
    clinicalExposure: "Partnered with premium healthcare providers including the Caucasus Medical Centre and Iashvili Children's Hospital. High volume of specialized clinical exposure.",
    hostelOverview: "Students typically rent private apartments near the metro stations. CIU assists with housing placements.",
    indianFoodSupport: "Excellent. Tbilisi's growing Indian network ensures ample availability of spices, lentils, and local Indian cooks.",
    safetyOverview: "Highly secure with electronic access controls and 24/7 security presence.",
    studentSupport: "Excellent teacher-to-student ratio. Integrated FMGE/NExT licensing preparation and active student research societies.",
    whyChoose: [
      "Partnership with the elite Caucasus Medical Centre",
      "Massive and vibrant international student community",
      "Modern, high-tech campus in the heart of Tbilisi",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Tuition is generally around $6,000/year",
      "Requires renting private apartments in Tbilisi"
    ],
    bestFitFor: ["Students wanting premium infrastructure", "Extroverted learners"],
    teachingHospitals: ["Caucasus Medical Centre", "Iashvili Children's Hospital"],
    recognitionBadges: ["Premium Clinical Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the degree valid in India?", answer: "Yes, fully complies with the NMC FMGL 2021 criteria." }
    ],
    programs: [
      {
        slug: "mbbs-caucasus-international-2026",
        title: "Medical Degree / MD (European Standard)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://ciu.edu.ge/"
      }
    ]
  },
  {
    slug: "international-black-sea-university",
    name: "International Black Sea University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1995,
    officialWebsite: "https://ibsu.edu.ge/",
    summary: "The International Black Sea University (IBSU) is historically known for academic rigor. While recognized for humanities and business, its Medical Faculty has expanded, offering a uniquely interdisciplinary European educational approach in Tbilisi.",
    campusLifestyle: "A highly disciplined, very clean, and diverse campus. IBSU maintains strict academic standards. The campus is modern and well-connected to Tbilisi transit.",
    cityProfile: "Tbilisi capital. 2026 Cost Index: Monthly expenses around $300-$400 USD. Easy access via extensive public transport.",
    clinicalExposure: "Collaborative clinical training with 20+ partner clinics in Tbilisi. Focuses on a modern, evidence-based medicine approach.",
    hostelOverview: "While there are some university dorm options, most international students rent private flats nearby.",
    indianFoodSupport: "Tbilisi has an increasing number of Indian restaurants and spice shops accessible from the campus.",
    safetyOverview: "IBSU is known for a very strict, zero-tolerance policy on misconduct, ensuring a highly safe and focused environment.",
    studentSupport: "Strong international office with a focus on holistic student development.",
    whyChoose: [
      "Highly respected academic brand in Georgia",
      "Access to 20+ collaborative clinics for rotation",
      "Strict academic discipline ensuring high outcomes",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Strict attendance and examination policies",
      "The institution is globally famous for non-medical fields, though rapidly scaling its medical reputation"
    ],
    bestFitFor: ["Academic achievers", "Students valuing strict discipline"],
    teachingHospitals: ["IBSU Partner Network Clinics"],
    recognitionBadges: ["Academic Excellence Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the medium English?", answer: "Yes, instruction is completely in English." }
    ],
    programs: [
      {
        slug: "mbbs-ibsu-georgia-2026",
        title: "Medical Degree / MD (Academic Track)",
        durationYears: 6,
        annualTuitionUsd: 4900,
        totalTuitionUsd: 29400,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://ibsu.edu.ge/"
      }
    ]
  },
  {
    slug: "ken-walker-international-university",
    name: "Ken Walker International University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2019,
    officialWebsite: "https://www.kenwalker.edu.ge/",
    summary: "Ken Walker International University is a highly specialized medical institution affiliated closely with Emory University (USA) methodologies. Located in Tbilisi, it offers an elite, high-intensity US-standard curriculum.",
    campusLifestyle: "A highly focused, US-style medical campus. Students are heavily immersed in simulation labs and problem-based learning from day one.",
    cityProfile: "Tbilisi capital. Monthly expenses around $300-$400 USD. Modern European lifestyle.",
    clinicalExposure: "Affiliations with top-tier private hospitals including the Chachava Clinic and Tbilisi Central Hospital.",
    hostelOverview: "Students typically rent private flats; the university helps coordinate international student housing clusters.",
    indianFoodSupport: "Access to Tbilisi's extensive Indian food delivery network and supermarkets.",
    safetyOverview: "High-end security systems. Standard European safety protocols on campus.",
    studentSupport: "Intense USMLE preparation. Modeled heavily on American medical education standards.",
    whyChoose: [
      "Curriculum modeled on US medical standards (Emory University influence)",
      "High-end clinical affiliations (Chachava Clinic)",
      "Intense focus on problem-based learning (PBL)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Newer university (Est. 2019) but with elite backing",
      "High intensity curriculum; USMLE focus is demanding"
    ],
    bestFitFor: ["USMLE Aspirants", "High-intensity learners"],
    teachingHospitals: ["Chachava Clinic", "Tbilisi Central Hospital"],
    recognitionBadges: ["US-Standard Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Does it prepare for USMLE?", answer: "Yes, the curriculum is heavily influenced by US medical standards." }
    ],
    programs: [
      {
        slug: "mbbs-ken-walker-2026",
        title: "Medical Degree / MD (US-Model Track)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://www.kenwalker.edu.ge/"
      }
    ]
  },
  {
    slug: "university-geomedi",
    name: "University Geomedi",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1998,
    officialWebsite: "https://geomedi.edu.ge/",
    summary: "University Geomedi is a specialized medical and healthcare university. It offers a very focused learning environment with strong roots in dentistry and general medicine, utilizing specialized simulation clinics.",
    campusLifestyle: "A dedicated healthcare-focused campus. Smaller student-to-teacher ratio allows for highly personalized learning. The atmosphere is quiet and strictly medical.",
    cityProfile: "Tbilisi capital. Monthly expenses around $300-$400 USD. Vibrant city life around the campus.",
    clinicalExposure: "Geomedi has its own University Clinic and operates specialized dental and rehabilitation centers alongside general hospital affiliations.",
    hostelOverview: "Off-campus private rentals. The university has a dedicated team to help arrange safe housing for international arrivals.",
    indianFoodSupport: "Easily accessible Indian restaurants and delivery services across Tbilisi.",
    safetyOverview: "Tight-knit campus community ensures a high degree of safety and personal attention.",
    studentSupport: "Excellent teacher-to-student ratio. Offers direct mentorship from practicing clinicians.",
    whyChoose: [
      "Specialized purely in healthcare and medicine",
      "Access to the university's own specialized clinics",
      "Highly personalized learning environment (small classes)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller campus footprint compared to massive state universities",
      "Focused primarily on medicine and dentistry"
    ],
    bestFitFor: ["Students wanting small class sizes", "Specialized learners"],
    teachingHospitals: ["Geomedi University Clinic", "Partner Tbilisi Hospitals"],
    recognitionBadges: ["Specialized Medical Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it recognized?", answer: "Yes, widely recognized by WHO, FAIMER, and NMC." }
    ],
    programs: [
      {
        slug: "mbbs-geomedi-georgia-2026",
        title: "Medical Degree / MD (Clinical Track)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://geomedi.edu.ge/"
      }
    ]
  },
  {
    slug: "tbilisi-humanitarian-teaching-university",
    name: "Tbilisi Humanitarian Teaching University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1992,
    officialWebsite: "https://thu.edu.ge/",
    summary: "Tbilisi Humanitarian Teaching University has expanded its faculties to include modern medical training. For 2026, it offers an affordable path to an NMC-recognized degree in the capital city, leveraging partner clinics for clinical exposure.",
    campusLifestyle: "A smaller, highly focused campus environment in Tbilisi. It offers a very close-knit community vibe, making international students feel immediately at home.",
    cityProfile: "Tbilisi capital. Monthly expenses around $300-$400 USD.",
    clinicalExposure: "Partnered with various mid-sized clinics and hospitals in Tbilisi to meet the 54-month clinical exposure criteria.",
    hostelOverview: "Private rentals in Tbilisi. The student affairs office assists heavily in this process.",
    indianFoodSupport: "Widespread availability in Tbilisi.",
    safetyOverview: "Safe, smaller campus with personalized attention.",
    studentSupport: "Focus on affordable tuition and personalized faculty mentorship.",
    whyChoose: [
      "Affordable tuition structure in the capital city",
      "Close-knit, highly supportive academic environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller infrastructure than the massive medical universities",
      "Requires private accommodation"
    ],
    bestFitFor: ["Budget-conscious families", "Solo learners"],
    teachingHospitals: ["THU Partner Clinics"],
    recognitionBadges: ["Boutique Campus", "WHO Recognized"],
    faq: [],
    programs: [
      {
        slug: "mbbs-thu-georgia-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://thu.edu.ge/"
      }
    ]
  },
  {
    slug: "quality-control-teaching-university",
    name: "Quality Control Teaching University of Georgia",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2011,
    officialWebsite: "#",
    summary: "Quality Control Teaching University of Georgia (also known by specialized regional monikers) is a boutique private institution focusing on rigorous adherence to international medical standards.",
    campusLifestyle: "Strict, academic-focused small campus environment.",
    cityProfile: "Tbilisi capital. Monthly expenses around $300-$400 USD.",
    clinicalExposure: "Relies on outsourced partnerships with private Tbilisi clinics.",
    hostelOverview: "Private apartment rentals are standard.",
    indianFoodSupport: "Accessible via Tbilisi delivery networks.",
    safetyOverview: "Standard capital city safety protocols.",
    studentSupport: "Smaller faculty allows for direct mentorship.",
    whyChoose: [
      "Boutique learning environment",
      "Listed in WDOMS",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Limited massive hospital networks; relies on private clinic partners"
    ],
    bestFitFor: ["Niche learners", "Independent students"],
    teachingHospitals: ["Private Tbilisi Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-quality-control-georgia-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "tbilisi-university-metekhi",
    name: "Tbilisi University 'Metekhi'",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2002,
    officialWebsite: "#",
    summary: "Tbilisi University 'Metekhi' is a private Georgian higher education institution listed in WDOMS, providing medical sciences instruction within an independent teaching framework.",
    campusLifestyle: "Independent, smaller campus environment.",
    cityProfile: "Tbilisi. Standard European lifestyle.",
    clinicalExposure: "Clinical partnerships with local secondary healthcare facilities.",
    hostelOverview: "Private housing is required.",
    indianFoodSupport: "Standard Tbilisi amenities apply.",
    safetyOverview: "Safe city environment.",
    studentSupport: "Basic international student services.",
    whyChoose: ["WDOMS Listed", "European location in Tbilisi", "Compliant 6-year duration"],
    thingsToConsider: ["Brand recognition is lower than major state universities"],
    bestFitFor: ["Independent students"],
    teachingHospitals: ["Local Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tbilisi-metekhi-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "tbilisi-national-university-gaenati",
    name: "Tbilisi National University 'Gaenati'",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1995,
    officialWebsite: "#",
    summary: "Tbilisi National University 'Gaenati' is listed in the World Directory of Medical Schools. It represents a niche private option in the Georgian capital.",
    campusLifestyle: "Niche, smaller academic environment.",
    cityProfile: "Tbilisi capital.",
    clinicalExposure: "Partnered with local Tbilisi clinics.",
    hostelOverview: "Private housing is required.",
    indianFoodSupport: "Standard Tbilisi amenities.",
    safetyOverview: "Safe city environment.",
    studentSupport: "Basic international student services.",
    whyChoose: ["WDOMS Listed", "European location"],
    thingsToConsider: ["Very niche institution"],
    bestFitFor: ["Independent students"],
    teachingHospitals: ["Local Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tbilisi-gaenati-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "university-of-legia-and-company",
    name: "University of Legia and Company",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1994,
    officialWebsite: "#",
    summary: "University of Legia & Company is a historically listed private institution in WDOMS offering medical programs based in Georgia.",
    campusLifestyle: "Highly independent.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Local clinical affiliations.",
    hostelOverview: "Private housing.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "Tbilisi standard.",
    studentSupport: "Independent study focus.",
    whyChoose: ["WDOMS Listed"],
    thingsToConsider: ["Historical institution, check current NMC advisory"],
    bestFitFor: ["Independent students", "Researchers"],
    teachingHospitals: ["Local Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-legia-company-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Georgia Deep Enrichment: Batch 2 ===\n");
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
        GEORGIA_ID, uni.slug, uni.name, uni.city, uni.type, uni.establishedYear, uni.summary,
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
  console.log("\n✅ Georgia Batch 2 Complete!");
}

seed();
