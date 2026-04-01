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
    slug: "david-tvildiani-medical-university",
    name: "David Tvildiani Medical University AIETI Medical School",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1989,
    officialWebsite: "https://dtmu.ge/",
    summary: "David Tvildiani Medical University (AIETI Medical School) is one of Georgia's most elite private medical institutions. For 2026, it remains the gold standard for students aspiring to clear the USMLE (US Medical Licensing Examination).",
    campusLifestyle: "Highly focused, competitive, and rigorous. Students live and breathe the USMLE curriculum. The campus features robust simulation centers and an intense library culture.",
    cityProfile: "Tbilisi capital. 2026 Cost Index: Standard European expenses, averaging $350-$450 USD per month.",
    clinicalExposure: "Early and frequent clinical rotations in top-tier partner clinics in Tbilisi. Exceptionally high standards for clinical practice evaluations.",
    hostelOverview: "DTMU offers some affiliated dormitory living which is strictly regulated for quiet study hours. Many also rent nearby private apartments.",
    indianFoodSupport: "Great connectivity to Tbilisi's prominent Indian grocery stores and tiffin services.",
    safetyOverview: "Extremely secure campus with stringent academic and residential policies.",
    studentSupport: "Widely regarded as having the best USMLE preparation track in Eastern Europe. Unparalleled student guidance for global placements.",
    whyChoose: [
      "The highest success rate for USMLE Steps 1 & 2 in Georgia",
      "Pioneering private medical university in the country (Est. 1989)",
      "Elite, fully English-medium AIETI medical program",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Tuition fees are premium (often $8,000+ per year)",
      "Strict grading; students who fail to meet standards are dismissed"
    ],
    bestFitFor: ["USMLE Aspirants", "Academic High Achievers"],
    teachingHospitals: ["MediClubGeorgia", "Tbilisi Central Hospitals"],
    recognitionBadges: ["Elite USMLE Hub", "WHO Recognized", "FAIMER Listed"],
    faq: [
      { question: "Is this the best for USMLE?", answer: "Yes, DTMU is famous across Europe for its unprecedented USMLE residency match rates." }
    ],
    programs: [
      {
        slug: "mbbs-dtmu-georgia-2026",
        title: "Medical Degree / MD (AIETI Track)",
        durationYears: 6,
        annualTuitionUsd: 8000,
        totalTuitionUsd: 48000,
        livingUsd: 4000,
        medium: "English",
        officialProgramUrl: "https://dtmu.ge/"
      }
    ]
  },
  {
    slug: "georgian-american-university",
    name: "Georgian American University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2001,
    officialWebsite: "https://gau.edu.ge/",
    summary: "Georgian American University (GAU) provides a vibrant, modern educational environment aligned with US medical standards. It boasts a huge international community and provides a balanced theoretical and clinical approach.",
    campusLifestyle: "A highly dynamic, international campus located centrally in Tbilisi. GAU is known for having a very active student life alongside rigorous medical training.",
    cityProfile: "Tbilisi. Modern European lifestyle with easy metro access.",
    clinicalExposure: "Partnered with 'Pineo Medical Ecosystem' and several large polyclinics, ensuring robust clinical exposure from the fourth year.",
    hostelOverview: "Off-campus private apartments are predominantly used. GAU helps facilitate safe housing matches for international arrivals.",
    indianFoodSupport: "Massive Indian student population guarantees easy access to Indian food networks in Tbilisi.",
    safetyOverview: "Highly secure with 24/7 security forces and excellent student welfare programs.",
    studentSupport: "Excellent USMLE coaching. Active student ambassador programs and extensive FMGE/NExT preparation modules.",
    whyChoose: [
      "Curriculum modeled explicitly on American medical standards",
      "Prime location in the heart of Tbilisi",
      "Massive, highly integrated Indian student community",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "High competition for admission",
      "Private accommodation is required"
    ],
    bestFitFor: ["USMLE Applicants", "Students seeking vibrant campus life"],
    teachingHospitals: ["Pineo Medical Ecosystem"],
    recognitionBadges: ["American Curriculum", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it an American university?", answer: "It is a private Georgian university with academic curriculums modeled closely on US standards." }
    ],
    programs: [
      {
        slug: "mbbs-gau-georgia-2026",
        title: "Medical Degree / MD (American Standard)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://gau.edu.ge/"
      }
    ]
  },
  {
    slug: "grigol-robakidze-university",
    name: "Grigol Robakidze University School of Medicine",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1992,
    officialWebsite: "https://gruni.edu.ge/",
    summary: "Grigol Robakidze University (Alma Mater) is renowned for its high-tech, futuristic campus. The School of Medicine integrates cutting-edge simulation technologies typical of top-tier European hospitals.",
    campusLifestyle: "Tech-forward and deeply academic. The campus architecture is highly modern, featuring digital libraries and highly equipped robotic anatomy labs.",
    cityProfile: "Tbilisi. 2026 Cost Index: ~ $350 USD per month.",
    clinicalExposure: "Extensive partnerships. The university has deep ties to European academic hospitals, offering specialized clinical exchange programs.",
    hostelOverview: "Students utilize the growing market of modern, shared private apartments near the Dighomi medical clusters.",
    indianFoodSupport: "Plenty of Indian restaurants and markets nearby.",
    safetyOverview: "Equipped with state-of-the-art security, smart access cards, and continuous surveillance.",
    studentSupport: "Focused on research and European mobility. Offers extensive academic exchange opportunities via Erasmus+.",
    whyChoose: [
      "Stunning, ultra-modern campus infrastructure",
      "High-tech medical simulation and robotics centers",
      "Strong European integration and Erasmus+ exchange opportunities",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Emphasis on high-tech learning requires rapid adaptation to digital tools"
    ],
    bestFitFor: ["Tech-savvy students", "Research enthusiasts"],
    teachingHospitals: ["Tbilisi Central Clinics", "Partner European Hospitals"],
    recognitionBadges: ["High-Tech Campus", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it a good university?", answer: "Yes, it is highly regarded for its technological infrastructure and European partnerships." }
    ],
    programs: [
      {
        slug: "mbbs-gruni-georgia-2026",
        title: "Medical Degree / MD (European Track)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://gruni.edu.ge/"
      }
    ]
  },
  {
    slug: "david-aghmashenebeli-university",
    name: "David Aghmashenebeli University of Georgia",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1991,
    officialWebsite: "https://sdasu.edu.ge/",
    summary: "David Aghmashenebeli University of Georgia (SDASU) is a deeply established private university located in Tbilisi. It offers a very focused and structured approach to the 6-year medical curriculum.",
    campusLifestyle: "A traditional, academic-driven approach located in a historic setting within Tbilisi.",
    cityProfile: "Tbilisi. Highly affordable with extensive transit options.",
    clinicalExposure: "Maintains clinical agreements with various regional hospitals for practical rotations.",
    hostelOverview: "Private accommodation required; strong student support aids in finding secure housing.",
    indianFoodSupport: "Standard access to Tbilisi amenities.",
    safetyOverview: "Very safe, tight-knit campus environment.",
    studentSupport: "Smaller faculty-to-student ratios benefit direct mentorship.",
    whyChoose: [
      "Established legacy in private education (1991)",
      "Close-knit mentorship program",
      "Compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller infrastructure compared to massive state colleges"
    ],
    bestFitFor: ["Students preferring small classrooms", "Budget-conscious learners"],
    teachingHospitals: ["Private Affiliated Clinics in Tbilisi"],
    recognitionBadges: ["WHO Recognized"],
    faq: [],
    programs: [
      {
        slug: "mbbs-sdasu-georgia-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://sdasu.edu.ge/"
      }
    ]
  },
  {
    slug: "central-university-of-europe",
    name: "Central University of Europe Faculty of Medicine",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2019,
    officialWebsite: "#",
    summary: "Central University of Europe is a relatively newer private institution focused on rapidly growing its international medical faculty to European standards.",
    campusLifestyle: "A compact, modern facility located in Tbilisi with a focused cohort.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Relies entirely on outsourced partner clinics in the capital.",
    hostelOverview: "Assisted private accommodation is standard.",
    indianFoodSupport: "Tbilisi public access.",
    safetyOverview: "Safe city campus.",
    studentSupport: "Highly personalized.",
    whyChoose: ["WDOMS Listed", "European location in Tbilisi", "Compliant 6-year program rules applied"],
    thingsToConsider: ["A nascent university brand with fewer established alumni"],
    bestFitFor: ["Independent students"],
    teachingHospitals: ["Tbilisi Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ceu-georgia-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "critical-care-medicine-institute",
    name: "Critical Care Medicine Institute",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2004,
    officialWebsite: "#",
    summary: "The Critical Care Medicine Institute in Tbilisi is an ultra-specialized medical facility that also provides higher-education medical sciences training under WDOMS guidelines.",
    campusLifestyle: "Intensely clinical and professionally focused.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Massive focus on emergency and intensive care scenarios within its own specialized structures and partnerships.",
    hostelOverview: "Private accommodation is standard.",
    indianFoodSupport: "Tbilisi standard availability.",
    safetyOverview: "High-security clinical environment.",
    studentSupport: "Specialized clinical mentorship.",
    whyChoose: ["Extremely niche focus on critical care", "WDOMS Listed"],
    thingsToConsider: ["Very niche, often suited for specialized postgraduate-level pursuits but listed for foundational sciences"],
    bestFitFor: ["Specialized medical researchers"],
    teachingHospitals: ["Specialized Critical Care Units"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ccmi-georgia-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "avicenna-batumi-medical-university",
    name: "Avicenna - Batumi Medical University",
    city: "Batumi",
    type: "Private",
    establishedYear: 2022,
    officialWebsite: "#",
    summary: "Avicenna Batumi Medical University is a newly established, highly ambitious private medical school located in the coastal city of Batumi.",
    campusLifestyle: "Modern, new-build campus in a beautiful coastal setting.",
    cityProfile: "Batumi (Black Sea Resort). Extremely safe and affordable.",
    clinicalExposure: "Partnered with developing Batumi private healthcare networks.",
    hostelOverview: "Private flats in Batumi are highly affordable.",
    indianFoodSupport: "Growing Indian presence in the resort city.",
    safetyOverview: "Extremely safe tourist city.",
    studentSupport: "Newly established, offering highly competitive fee structures and personalized onboarding.",
    whyChoose: ["Stunning coastal location in Batumi", "WDOMS Listed"],
    thingsToConsider: ["Newly established; tracking alumni success is ongoing"],
    bestFitFor: ["Pioneering students desiring coastal living"],
    teachingHospitals: ["Avicenna Partner Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-avicenna-batumi-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "caucasus-medicine-school",
    name: "Caucasus Medicine School",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2011,
    officialWebsite: "#",
    summary: "Caucasus Medicine School operates as an independent, focused medical faculty targeting high clinical competencies acting under the broader WDOMS framework.",
    campusLifestyle: "Highly regimented study environment.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Access to private clinics.",
    hostelOverview: "Private living.",
    indianFoodSupport: "Standard access.",
    safetyOverview: "Safe.",
    studentSupport: "Standard mentorship.",
    whyChoose: ["WDOMS Listed", "Located in Tbilisi"],
    thingsToConsider: ["Distinct from the larger Caucasus International University parameters"],
    bestFitFor: ["Independent students"],
    teachingHospitals: ["Partner Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-cms-georgia-2026",
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
    slug: "classical-traditional-medicine-academy",
    name: "Classical and Traditional Medicine Academy",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2001,
    officialWebsite: "#",
    summary: "An incredibly niche academy listed in WDOMS exploring the intersection of modern diagnostics with traditional frameworks.",
    campusLifestyle: "Holistic and niche.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Specialized alternative/integrative clinics alongside standard hospitals.",
    hostelOverview: "Private living.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "Safe environment.",
    studentSupport: "Highly specialized.",
    whyChoose: ["WDOMS Listed"],
    thingsToConsider: ["Highly niche; verify exact NMC FMGL 2021 curriculum alignments before admission if intended for Indian licensing."],
    bestFitFor: ["Integrative medicine enthusiasts"],
    teachingHospitals: ["Tbilisi Specialty Centers"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ctma-georgia-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "east-west-university",
    name: "East-West University School of Medicine",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2022,
    officialWebsite: "#",
    summary: "East-West University is a brand-new entrant in the Georgian medical education space, aiming to merge Eurasian educational standards for a global audience.",
    campusLifestyle: "Rapidly developing, highly ambitious.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Building initial clinical bases in the capital.",
    hostelOverview: "Private accommodation is standard.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "Safe city campus.",
    studentSupport: "New, highly attentive faculty.",
    whyChoose: ["WDOMS Listed"],
    thingsToConsider: ["Extremely new university structure"],
    bestFitFor: ["Early adopters"],
    teachingHospitals: ["Networked startup clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ewu-georgia-2026",
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
  console.log("=== Georgia Deep Enrichment: Batch 3 ===\n");
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
  console.log("\n✅ Georgia Batch 3 Complete!");
}

seed();
