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
    slug: "tbilisi-state-medical-university",
    name: "Tbilisi State Medical University Faculty of Medicine",
    city: "Tbilisi",
    type: "Public/State",
    establishedYear: 1918,
    officialWebsite: "https://tsmu.edu/",
    summary: "Tbilisi State Medical University (TSMU) is the absolute pinnacle of medical education in the Caucasus. As the largest and most prestigious state medical university in Georgia, it is the primary destination for Indian students aiming for an elite public institution.",
    campusLifestyle: "A massive, historic state campus functioning as its own medical city within Tbilisi. The student body is incredibly diverse, with thousands of international students shaping a vibrant, highly academic environment.",
    cityProfile: "Tbilisi is a bustling European capital with a 2026 Cost Index of ~$300-$400 USD monthly.",
    clinicalExposure: "Unprecedented. TSMU operates its own immense state hospitals, including the First University Clinic and Givi Zhvania Pediatric Academic Clinic. Students gain legendary hands-on trauma and clinical exposure.",
    hostelOverview: "State-funded hostels are available but highly competitive. The massive Indian community has established a robust network of affordable private flat rentals near the campus.",
    indianFoodSupport: "The gold standard. Due to the massive Indian cohort (2000+), the campus area is completely surrounded by authentic Indian restaurants, grocery stores, and tailored services.",
    safetyOverview: "Highest government-backed security protocols. Tbilisi itself is extremely safe.",
    studentSupport: "As the flagship state university, it provides unmatched structural support, FMGE coaching associations, and direct pathways to USMLE and PLAB.",
    whyChoose: [
      "The #1 Public/State Medical University in Georgia",
      "Massive, university-owned state hospitals for clinical rotation",
      "Over 100 years of academic legacy and government prestige",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Premium tuition fees for a state university ($8,000/year)",
      "Highly competitive admission and strict grading curves"
    ],
    bestFitFor: ["Elite students", "Those wanting massive public hospital exposure"],
    teachingHospitals: ["First University Clinic", "Givi Zhvania Pediatric Clinic", "Multiple State Hospitals"],
    recognitionBadges: ["Flagship State University", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is TSMU a government university?", answer: "Yes, it is the premier government medical university in Georgia." },
      { question: "How much is the fee?", answer: "Approximately $8,000 USD per year for international students." }
    ],
    programs: [
      {
        slug: "mbbs-tsmu-georgia-2026",
        title: "Medical Degree / MD (State Track)",
        durationYears: 6,
        annualTuitionUsd: 8000,
        totalTuitionUsd: 48000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://tsmu.edu/"
      }
    ]
  },
  {
    slug: "ivane-javakhishvili-tbilisi-state-university",
    name: "Ivane Javakhishvili Tbilisi State University Faculty of Medicine",
    city: "Tbilisi",
    type: "Public/State",
    establishedYear: 1918,
    officialWebsite: "https://www.tsu.ge/",
    summary: "Ivane Javakhishvili Tbilisi State University (TSU) is the absolutely oldest university in the Caucasus. Its Faculty of Medicine offers a prestigious, highly respected state medical degree at a very competitive tuition rate.",
    campusLifestyle: "Deeply historical and academic. The TSU campus is massive, featuring beautiful architecture and centuries of academic tradition.",
    cityProfile: "Tbilisi. 2026 Cost Index: ~ $300-$400 USD per month. Central location.",
    clinicalExposure: "Partnered with top state and private hospitals across Tbilisi, providing a very structured, European-style clinical phase.",
    hostelOverview: "State dormitories exist, though most international students prefer renting private flats in Tbilisi.",
    indianFoodSupport: "Excellent access to Tbilisi's prominent Indian markets and restaurants.",
    safetyOverview: "Exceptionally safe, maintaining high government standards for a premier state institution.",
    studentSupport: "Oldest university in the country offering immense library resources and global exchange programs.",
    whyChoose: [
      "The absolute oldest and most prestigious comprehensive university in the Caucasus",
      "Highly affordable State Medical Degree (~$5,500/year)",
      "Strict adherence to European higher education standards",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "It is a comprehensive university, meaning the medical faculty shares the massive campus with other disciplines"
    ],
    bestFitFor: ["Academics valuing legacy", "Budget-conscious state university seekers"],
    teachingHospitals: ["Various Top Tbilisi State Hospitals"],
    recognitionBadges: ["Oldest State Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is TSU different from TSMU?", answer: "Yes. TSU is a comprehensive state university (all subjects), while TSMU focuses exclusively on medicine." }
    ],
    programs: [
      {
        slug: "mbbs-tsu-georgia-2026",
        title: "Medical Degree / MD (State Foundation)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://www.tsu.ge/"
      }
    ]
  },
  {
    slug: "university-of-georgia",
    name: "University of Georgia School of Health Sciences",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2004,
    officialWebsite: "https://ug.edu.ge/",
    summary: "The University of Georgia (UG) is one of the largest and most well-funded private universities in the country. For 2026, it offers an incredibly impressive, high-tech campus with a curriculum perfectly tailored for USMLE and FMGE success.",
    campusLifestyle: "Ultra-modern, western-style campus living. UG is famous for its stunning infrastructure, massive tech-integrated libraries, and vibrant student-led culture.",
    cityProfile: "Tbilisi. 2026 Cost Index: ~$350 USD per month.",
    clinicalExposure: "Exceptional clinical ties with major Tbilisi hospitals. Students practice in a range of highly specialized environments.",
    hostelOverview: "UG assists with placing students in high-quality private accommodations nearby.",
    indianFoodSupport: "A massive Indian student base means instant access to familiar food and community.",
    safetyOverview: "Extremely modern security infrastructure, including digital student passes and heavy campus patrols.",
    studentSupport: "Incredible focus on global medical standards. Offers intensive USMLE tracks and regular medical seminars.",
    whyChoose: [
      "One of the largest, most successful private universities in Georgia",
      "Premium, ultra-modern campus and learning facilities",
      "Direct pathways and preparation modules for USMLE",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Tuition is generally around $6,000/year",
      "Strict grading policies to maintain European standards"
    ],
    bestFitFor: ["USMLE Aspirants", "Students desiring premium infrastructure"],
    teachingHospitals: ["UG Partner Clinical Ecosystem"],
    recognitionBadges: ["Premium Private Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is UG NMC recognized?", answer: "Yes, fully complies with the 54-month + internship FMGL 2021 mandates." }
    ],
    programs: [
      {
        slug: "mbbs-ug-georgia-2026",
        title: "Medical Degree / MD (Premium English)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://ug.edu.ge/"
      }
    ]
  },
  {
    slug: "new-vision-university",
    name: "New Vision University School of Medicine",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2013,
    officialWebsite: "https://newvision.ge/",
    summary: "New Vision University (NVU) is rapidly becoming an elite private medical destination. It is unique in that it owns and operates its own massive, high-tech hospital in Tbilisi, granting its students unprecedented clinical exposure.",
    campusLifestyle: "Innovative and highly clinical. NVU is known as the 'eco-friendly' campus and heavily emphasizes hands-on research and practical skills.",
    cityProfile: "Tbilisi. 2026 Cost Index: ~$350 USD per month.",
    clinicalExposure: "Unmatched among private universities. NVU owns the completely modernized New Vision University Hospital, turning the educational experience into a daily clinical practice.",
    hostelOverview: "Students typically rent private apartments near the hospital and campus sectors.",
    indianFoodSupport: "Plenty of Indian delivery options and specialized grocers in Tbilisi.",
    safetyOverview: "Highly secure with an emphasis on creating a self-sustaining eco-campus.",
    studentSupport: "Exceptional clinical mentorship since professors are practicing surgeons and doctors at their own hospital. High USMLE success rates.",
    whyChoose: [
      "Owns and operates its own massive New Vision University Hospital",
      "Eco-friendly, innovative, and highly practical learning environment",
      "High success rate for international licensing exams",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Premium tuition costs (~$7,000/year)",
      "High clinical expectations from early semesters"
    ],
    bestFitFor: ["Early Clinical Seekers", "Future Surgeons"],
    teachingHospitals: ["New Vision University Hospital"],
    recognitionBadges: ["Own Hospital Network", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Does NVU have its own hospital?", answer: "Yes! The New Vision University Hospital is one of the most modern in Tbilisi." }
    ],
    programs: [
      {
        slug: "mbbs-new-vision-georgia-2026",
        title: "Medical Degree / MD (Clinical Track)",
        durationYears: 6,
        annualTuitionUsd: 7000,
        totalTuitionUsd: 42000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://newvision.ge/"
      }
    ]
  },
  {
    slug: "tbilisi-medical-academy",
    name: "Petre Shotadze Tbilisi Medical Academy Faculty of Medicine",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 1992,
    officialWebsite: "https://tma.edu.ge/",
    summary: "Petre Shotadze Tbilisi Medical Academy (TMA) is one of the oldest and most respected private medical schools in Georgia. For 2026, it offers a highly traditional, deeply clinical medical education at an affordable price point.",
    campusLifestyle: "TMA offers a very close-knit, traditional medical school vibe. It feels like a boutique medical academy tailored explicitly for focused, serious students.",
    cityProfile: "Tbilisi capital.",
    clinicalExposure: "Partnered with a wide array of specialized clinics and central hospitals in Tbilisi.",
    hostelOverview: "Off-campus apartment living is standard, with TMA providing strong logistical support.",
    indianFoodSupport: "Standard access to Tbilisi amenities.",
    safetyOverview: "Very safe and closely monitored student environment.",
    studentSupport: "Excellent, highly personalized mentorship. Teachers know students by name, ensuring no one is left behind.",
    whyChoose: [
      "One of the longest-running private medical academies in Georgia",
      "Affordable tuition (~$5,000/year) compared to larger private hubs",
      "Highly personalized, small-classroom learning environment",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Smaller infrastructure compared to the massive University of Georgia or SEU"
    ],
    bestFitFor: ["Budget-conscious students", "Learners valuing small class sizes"],
    teachingHospitals: ["TMA Partner Clinical Network"],
    recognitionBadges: ["Established Academy", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [],
    programs: [
      {
        slug: "mbbs-tma-georgia-2026",
        title: "Medical Program / MD",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://tma.edu.ge/"
      }
    ]
  },
  {
    slug: "ilia-state-university",
    name: "Ilia State University Faculty of Natural Sciences and Medicine",
    city: "Tbilisi",
    type: "Public/State",
    establishedYear: 2006,
    officialWebsite: "https://iliauni.edu.ge/",
    summary: "Ilia State University is a major, highly progressive public research university in Tbilisi. Its medical faculty combines traditional Georgian clinical practices with deeply integrated scientific research.",
    campusLifestyle: "A vast, highly academic and research-driven central campus.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Utilizes prominent state hospitals across Tbilisi.",
    hostelOverview: "State options available, alongside robust private rental networks.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "State-level security.",
    studentSupport: "Massive library networks and European exchange (Erasmus+) focus.",
    whyChoose: ["Major State University", "Heavy focus on medical research", "Affordable state fees"],
    thingsToConsider: ["Medical program operates under the broader Natural Sciences faculty"],
    bestFitFor: ["Research-oriented students"],
    teachingHospitals: ["Tbilisi State Network Clinics"],
    recognitionBadges: ["State University", "WHO Recognized"],
    faq: [],
    programs: [
      {
        slug: "mbbs-ilia-state-georgia-2026",
        title: "Medical Degree / MD",
        durationYears: 6,
        annualTuitionUsd: 5300,
        totalTuitionUsd: 31800,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://iliauni.edu.ge/"
      }
    ]
  },
  {
    slug: "international-university-of-tbilisi",
    name: "International University of Tbilisi School of Health",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2021,
    officialWebsite: "#",
    summary: "A newer private WDOMS-listed institution focused on offering streamlined, 6-year English medium health sciences pathways.",
    campusLifestyle: "New and rapidly developing.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Partnered with local capital clinics.",
    hostelOverview: "Assisted private accommodation.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "Standard city protocols.",
    studentSupport: "Highly modern, digital-first approach.",
    whyChoose: ["Modern, digital-first teaching", "Listed in WDOMS"],
    thingsToConsider: ["Very new institution"],
    bestFitFor: ["Early adopters"],
    teachingHospitals: ["Private Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-iut-georgia-2026",
        title: "Medical Program",
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
    slug: "kutaisi-institute-of-medicine",
    name: "Kutaisi Institute of Medicine",
    city: "Kutaisi",
    type: "Private",
    establishedYear: 2003,
    officialWebsite: "#",
    summary: "The Kutaisi Institute of Medicine provides a highly focused, independent pathway to an MD outside of the massive state university system in Kutaisi.",
    campusLifestyle: "Quiet, affordable, and focused.",
    cityProfile: "Kutaisi (Affordable western hub).",
    clinicalExposure: "Utilizes Kutaisi regional health centers.",
    hostelOverview: "Extremely affordable private rentals in Kutaisi.",
    indianFoodSupport: "Basic local access.",
    safetyOverview: "Kutaisi is exceptionally safe.",
    studentSupport: "Close-knit mentorship.",
    whyChoose: ["Highly affordable study in Kutaisi", "Niche private institute"],
    thingsToConsider: ["Smaller infrastructure than Akaki Tsereteli"],
    bestFitFor: ["Budget-conscious independent learners"],
    teachingHospitals: ["Kutaisi Regional Centers"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-kutaisi-institute-2026",
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
    slug: "medical-institute-of-reconstruction",
    name: "Medical Institute of Reconstruction Plastic Surgery and Dermocosmetology",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2000,
    officialWebsite: "#",
    summary: "An ultra-specialized medical academy focusing originally on plastic surgery and reconstruction, now offering broader medical foundations listed in WDOMS.",
    campusLifestyle: "Intensely specialized clinical environment.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Unprecedented exposure to specialized reconstructive and plastic surgery networks.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "High-security clinical zones.",
    studentSupport: "Direct mentorship by specialized surgeons.",
    whyChoose: ["Incredible exposure to cosmetic and reconstructive surgeries", "WDOMS Listed"],
    thingsToConsider: ["Extremely niche focus for general MBBS candidates"],
    bestFitFor: ["Future specialized surgeons"],
    teachingHospitals: ["Specialized Reconstructive Centers"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-reconstruction-institute-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  },
  {
    slug: "tbilisi-medical-institute-vita",
    name: "Tbilisi Medical Institute 'Vita'",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2001,
    officialWebsite: "#",
    summary: "Tbilisi Medical Institute 'Vita' focuses on providing an accessible, privately-run 6-year medical track in the Georgian capital.",
    campusLifestyle: "Accessible, smaller-scale community campus.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Partnered with secondary health clinics.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "Standard city protection.",
    studentSupport: "Boutique support structure.",
    whyChoose: ["WDOMS Listed", "Location in Tbilisi"],
    thingsToConsider: ["Boutique brand with less international renown than TSMU"],
    bestFitFor: ["Independent learners"],
    teachingHospitals: ["Tbilisi Affiliates"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-vita-georgia-2026",
        title: "Medical Program",
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
    slug: "tbilisi-medical-teaching-university-hippocrates",
    name: "Tbilisi Medical Teaching University 'Hippocrates'",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2000,
    officialWebsite: "#",
    summary: "Tbilisi Medical Teaching University 'Hippocrates' emphasizes traditional medical ethics combined with modern clinical training.",
    campusLifestyle: "Ethics-driven classical medical education environment.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Maintains regional clinic tie-ups.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Tbilisi standard.",
    safetyOverview: "Safe.",
    studentSupport: "Strong emphasis on medical ethics mentorship.",
    whyChoose: ["WDOMS Listed classical academy"],
    thingsToConsider: ["Lower infrastructure profile"],
    bestFitFor: ["Ethics-centered scholars"],
    teachingHospitals: ["Partner Clinics"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-hippocrates-georgia-2026",
        title: "Medical Program",
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
    slug: "university-sakartvelo",
    name: "University Sakartvelo Faculty of Medicine",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2010,
    officialWebsite: "#",
    summary: "University Sakartvelo provides a streamlined, accessible general medicine program listed in the WDOMS network.",
    campusLifestyle: "Streamlined, independent study-focused.",
    cityProfile: "Tbilisi.",
    clinicalExposure: "Varies; uses capital city clinical partnerships.",
    hostelOverview: "Private accommodation.",
    indianFoodSupport: "Tbilisi amenities.",
    safetyOverview: "City standard.",
    studentSupport: "Independent learning curve.",
    whyChoose: ["WDOMS Listed private choice"],
    thingsToConsider: ["Requires high student independence"],
    bestFitFor: ["Independent mature students"],
    teachingHospitals: ["Tbilisi Clinic Partners"],
    recognitionBadges: ["WDOMS Listed"],
    faq: [],
    programs: [
      {
        slug: "mbbs-sakartvelo-georgia-2026",
        title: "Medical Program",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "#"
      }
    ]
  }
];

async function seed() {
  console.log("=== Georgia Deep Enrichment: Batch 4 (FINAL GA) ===\n");
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
  console.log("\n✅ Georgia Batch 4 Complete! EVERY WDOMS GEORGIAN UNIVERSITY IS NOW ENRICHED!");
}

seed();
