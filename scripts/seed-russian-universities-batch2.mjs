import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const RUSSIA_ID = 45;
const COURSE_MBBS_ID = 13;

const universities = [
  {
    slug: "kursk-state-medical-university",
    name: "Kursk State Medical University",
    city: "Kursk",
    type: "Public/State",
    establishedYear: 1935,
    published: true,
    featured: true,
    officialWebsite: "https://ksmu.online/",
    summary: "Kursk State Medical University (KSMU) is a historic pioneer, being the first Russian university to offer a complete 6-year English-medium MBBS program. For 2026, it remains the most experienced institution in managing Indian medical students, with a highly evolved international department and stable academic environment.",
    campusLifestyle: "The university is a centralized academic hub. Students benefit from the 'University Town' concept where hostels and main lecture halls are within a 5-10 minute walk. Features a massive central library, digital learning labs, and a dedicated 'International Student Center' that acts as a social and administrative support pillar.",
    cityProfile: "Kursk is a peaceful, historic city in Western Russia. 2026 Index: Milk (~75 RUB), 1kg Chicken (~340 RUB). Monthly expenses are highly optimized for students, typically range from $150-$200 USD. The city is walkable and has a reliable bus/tram network.",
    clinicalExposure: "Affiliated with 28+ clinical bases in the Kursk region. Primary training occurs at the Kursk Regional Clinical Hospital and the City Emergency Care Hospital. Students gain significant hands-on experience in diagnostic procedures using CT, MRI, and high-tech lab equipment starting from the 3rd year.",
    hostelOverview: "Features 6 well-maintained hostels. Hostel No. 1 and No. 6 are dedicated to international students. Rooms are shared by 2-3 students and include central heating, study furniture, and high-speed Wi-Fi. Security is 24/7 with strict visitor policies.",
    indianFoodSupport: "KSMU is the leader in Indian food support. Multiple Indian messes operate on campus, offering authentic North and South Indian meals. Local stores stock a wide variety of Indian tea, lentils (Dals), and spices catering to the 1,500+ Indian student population.",
    safetyOverview: "Kursk is considered one of the safest regional cities in Russia. The university has a dedicated security unit and works closely with local authorities to ensure a safe environment for international residents.",
    studentSupport: "Comprehensive support for visa, registration, and health insurance. KSMU provides structured FMGE/NExT coaching assistance through its network of senior students and visiting tutors.",
    whyChoose: [
      "First Russian university to launch full English-medium MBBS",
      "Most established Indian student support and food (Mess) system",
      "Highly affordable 6-year total package with stable fees",
      "All academic and residential facilities located within walking distance"
    ],
    thingsToConsider: [
      "Kursk is quieter than Moscow, ideal for focused study over nightlife",
      "Academic standards are rigid; regular attendance is mandatory",
      "Winters are snowy and require proper thermal preparation"
    ],
    bestFitFor: ["Serious, career-focused students", "Budget-conscious families", "Students preferring a complete Indian student support ecosystem"],
    teachingHospitals: [
      "Kursk Regional Clinical Hospital",
      "City Clinical Emergency Care Hospital",
      "Kursk Regional Perinatal Center"
    ],
    recognitionBadges: ["Pioneer Status", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Kursk safe for Indians?", answer: "Yes, it is a peaceful city with a 30-year history of hosting Indian medical students." },
      { question: "What is the tuition fee?", answer: "Approx. $5,500 - $6,000 USD per year depending on the current exchange rate." }
    ],
    programs: [
      {
        slug: "mbbs-kursk-state-2026",
        title: "General Medicine / MBBS (English)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://ksmu.online/admission/"
      }
    ]
  },
  {
    slug: "orenburg-state-medical-university",
    name: "Orenburg State Medical University",
    city: "Orenburg",
    type: "Public/State",
    establishedYear: 1944,
    published: true,
    featured: true,
    officialWebsite: "https://orgma.ru/",
    summary: "Orenburg State Medical University is renowned for being an 'Academy of Excellence,' consistently producing top results in Indian licensing exams (FMGE/NExT). For 2026, it is the top choice for students who prioritize academic rigor and clinical hand-skills.",
    campusLifestyle: "A disciplined academic environment. The university focuses on early integration into clinical roles. Students participate in 'Scientific Circles' where they contribute to real medical research. Orenburg city offers a unique blend of Asian and European cultures.",
    cityProfile: "Located on the Ural river. 2026 Index: Very affordable. Milk (~70 RUB), 1kg Chicken (~310 RUB). Living costs are manageable within $120-$160 USD per month. The city is peaceful with beautiful riverside walkways.",
    clinicalExposure: "18+ regional clinical hospitals serve as training grounds. Strong reputation in Operative Surgery and Anatomy. Students rotate through specialized federal-level centers for cardiology and infectious diseases.",
    hostelOverview: "3 dedicated international hostels. Rooms are clean, sharing by 2-3 students. Hostels are centrally located within the city, with easy bus access to main academic blocks.",
    indianFoodSupport: "Common kitchens in hostels are well-equipped. Indian students often group together for meals. Local businesses stock Indian groceries specifically for the medical student community.",
    safetyOverview: "Orenburg is a safe, family-oriented provincial capital. The university provides 24/7 security in dorms and assists with all local legal registrations and orientations.",
    studentSupport: "Direct focus on licensing results. BSMU provides internal platforms for mock NExT exams and senior-to-junior mentoring for clinical skill checks.",
    whyChoose: [
      "Consistent high performance in FMGE/NExT licensing exams",
      "Deep focus on clinical hand-skills and hands-on anatomy",
      "Affordable total package (approx. \u20b925-28 Lakhs for 6 years)",
      "Safe and peaceful city environment away from metro distractions"
    ],
    thingsToConsider: [
      "Very strict academic environment; exams are frequent and challenging",
      "Distance from Moscow is significant (approx. 1,500 km)",
      "Russian language is essential for patient interaction in local hospitals"
    ],
    bestFitFor: ["Academically driven students", "Students focused on returning to India for practice", "Practical and surgical skill enthusiasts"],
    teachingHospitals: [
      "Orenburg Regional Clinical Hospital",
      "Regional Cardiology Center",
      "Orenburg Clinical Hospital No. 1"
    ],
    recognitionBadges: ["Result Oriented", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the degree valid in the USA?", answer: "Yes, OrSMU is ECFMG certified, allowing you to appear for USMLE." },
      { question: "Is food expensive?", answer: "No, Orenburg is one of the most affordable cities in Russia for groceries." }
    ],
    programs: [
      {
        slug: "mbbs-orenburg-state-2026",
        title: "Doctor of Medicine (English Taught)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://orgma.ru/en/"
      }
    ]
  },
  {
    slug: "pavlov-first-saint-petersburg-state-medical-university",
    name: "Pavlov First Saint Petersburg State Medical University",
    city: "Saint Petersburg",
    type: "Public/Federal",
    establishedYear: 1897,
    published: true,
    featured: true,
    officialWebsite: "https://www.1spbgmu.ru/en/",
    summary: "Named after Nobel Laureate Ivan Pavlov, this is one of the most elite and historic medical institutions globally. For 2026, it offers high-achieving students a prestigious platform in Russia's most beautiful city, Saint Petersburg.",
    campusLifestyle: "Studying here is a life experience beyond just academics. Located in central St. Petersburg, students are surrounded by canals, museums, and historic architecture. The university has its own elite clinical center and world-class research labs.",
    cityProfile: "Saint Petersburg is Russia's 'Cultural Capital.' 2026 Index: Living costs are higher, similar to Moscow. Milk (~90 RUB), Chicken (~360 RUB). Monthly budget $350-$450 USD. Students enjoy advanced public transport and a vibrant European lifestyle.",
    clinicalExposure: "Elite federal-level clinical bases including the university's own Clinic and the Almazov National Medical Research Centre. Students gain exposure to rare cases, advanced neurosurgery, and cardiovascular robotics.",
    hostelOverview: "Hostels are located in the Petrogradsky District. They are well-equipped with modern facilities, study rooms, and security. Proximity to the medical clinics is Excellent.",
    indianFoodSupport: "St. Petersburg has the most diverse food scene after Moscow. Several Indian restaurants (e.g., 'Tandoor', 'Namaste') are available. Large supermarkets carry a vast range of international products.",
    safetyOverview: "St. Petersburg is a safe, tourism-heavy city. The university campus is in a prestigious district with 24/7 security and a strong student safety policy.",
    studentSupport: "Global orientation. Assistance with internships in Europe and the USA. Dedicated office for international academic exchange and high-level medical research.",
    whyChoose: [
      "Global brand value and elite institutional history",
      "Located in Saint Petersburg, providing a premium lifestyle",
      "Superior clinical infrastructure with federal-level research centers",
      "Wide recognition of degrees in the EU, USA, and UK"
    ],
    thingsToConsider: [
      "Competitive entry; requires high academic scores and NEET rank",
      "Living costs are higher than in regional Russian cities",
      "Winters are dark and long, known for the 'White Nights' in summer"
    ],
    bestFitFor: ["High-achieving students", "Elite medical aspirants", "Students who value research and global networking"],
    teachingHospitals: [
      "Pavlov University Clinical Center",
      "Almazov National Medical Research Centre",
      "City Clinical Hospital No. 2"
    ],
    recognitionBadges: ["Global Elite", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the fee higher?", answer: "Yes, tuition is approx. $7,000 - $8,000 USD, reflecting its elite status." },
      { question: "What is the medium?", answer: "The General Medicine program is offered in full English Medium for international students." }
    ],
    programs: [
      {
        slug: "mbbs-pavlov-st-petersburg-2026",
        title: "MD / General Medicine (English)",
        durationYears: 6,
        annualTuitionUsd: 8000,
        totalTuitionUsd: 48000,
        livingUsd: 4500,
        medium: "English",
        officialProgramUrl: "https://www.1spbgmu.ru/en/education/international-students"
      }
    ]
  },
  {
    slug: "siberian-state-medical-university",
    name: "Siberian State Medical University",
    city: "Tomsk",
    type: "Public/State",
    establishedYear: 1888,
    published: true,
    featured: true,
    officialWebsite: "https://ssmu.ru/en/",
    summary: "Siberian State Medical University (SSMU) is ranked among the Top 3 medical universities in Russia. Located in Tomsk, the 'Student Capital' of Russia, it offers a world-class, research-driven curriculum for the 2026 intake.",
    campusLifestyle: "A unique academic atmosphere where 20% of the city's population is students. Tomsk is safe, young, and vibrant. SSMU features the Siberian Simulation Center, one of the best in Europe for surgical training.",
    cityProfile: "Tomsk is peaceful and very affordable. 2026 Index: Milk (~72 RUB), Chicken (~315 RUB). Monthly budget $120-$160 USD. The city is famous for its wooden architecture and its 'Intellectual' vibe.",
    clinicalExposure: "The university operates its own clinical hospitals, which are federal centers of excellence for Siberia. Specialization strengths in Molecular Medicine, Immunology, and Surgical Innovation.",
    hostelOverview: "Clean, modern student dormitories. SSMU has recently upgraded its international student hostels with en-suite bathrooms and high-speed fiber internet.",
    indianFoodSupport: "Dedicated kitchens for self-cooking. Tomsk has a growing international community with specialized stores selling Indian spices and pulses (Dal).",
    safetyOverview: "Tomsk is one of the safest cities in the Russian Federation. High community respect for students and a low-crime provincial environment.",
    studentSupport: "Innovative teaching methods including VR anatomy and tele-medicine rotations. Active support for international research grants and publications.",
    whyChoose: [
      "Top-3 ranked medical university in the Russian Federation",
      "Located in the dedicated Student City of Tomsk",
      "Highly affordable tuition with elite academic quality",
      "Federal-level clinical hospitals owned and operated by the university"
    ],
    thingsToConsider: [
      "Siberian winters are cold (-25\u00b0C to -35\u00b0C); high-thermal clothing is mandatory",
      "Distance from Moscow (4-hour flight) means less frequent travel",
      "Quiet city lifestyle focused on intense academic study"
    ],
    bestFitFor: ["Academic toppers wanting high rankings", "Research-oriented medical aspirants", "Budget-conscious families seeking elite quality"],
    teachingHospitals: [
      "Clinics of Siberian State Medical University",
      "Tomsk Regional Clinical Hospital",
      "Research Institute of Cardiology"
    ],
    recognitionBadges: ["Top-3 Ranked", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is the degree valid and recognized?", answer: "Yes, SSMU is globally recognized and fully NMC compliant." },
      { question: "How cold is Siberia?", answer: "It is cold, but indoor heating is excellent (centralized 24\u00b0C everywhere)." }
    ],
    programs: [
      {
        slug: "mbbs-siberian-state-2026",
        title: "Medical Degree (MD/MBBS)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://ssmu.ru/en/admission/"
      }
    ]
  },
  {
    slug: "crimea-federal-university",
    name: "Crimea Federal University",
    city: "Simferopol",
    type: "Public/Federal",
    establishedYear: 1918,
    published: true,
    featured: true,
    officialWebsite: "https://cfuv.ru/en/",
    summary: "Crimea Federal University is a massive educational complex and the most popular choice for Indian students due to its milder climate and the largest Indian student community in Russia. For 2026, it is the 'home away from home' for medical aspirants.",
    campusLifestyle: "A warm, coastal vibe. The university has a specific 'Indian Block' with dedicated hostels, messes, and senior student councils. High social engagement with cricket tournaments and large-scale Diwali celebrations.",
    cityProfile: "Simferopol is the sunny capital of Crimea. 2026 Index: Affordable. Milk (~78 RUB), Chicken (~330 RUB). Milder winters compared to Moscow/Siberia. Monthly budget $150-$200 USD.",
    clinicalExposure: "15+ city hospitals and specialized regional clinics. High patient volume due to being the primary medical hub for the Entire Crimean peninsula. Hands-on clinical practice from Year 3.",
    hostelOverview: "Dedicated hostels for international students. Due to the high number of Indian students, the hostel atmosphere is familiar and supportive. Shared kitchens and common study areas are standard.",
    indianFoodSupport: "The best in Russia: Multiple high-quality Indian mess options. Indian spices and grains are widely available in local markets due to high demand from the student population.",
    safetyOverview: "Strict security protocols within the campus. The city is peaceful, and the university provides 24/7 assistance for its 3,000+ international student body.",
    studentSupport: "Powerful alumni network in India. Crimea provides integrated support for NExT/FMGE licensing exam preparation through senior-led study groups.",
    whyChoose: [
      "Largest Indian student community in the Russian Federation",
      "Milder, scenic Mediterranean-style climate",
      "Easiest adaptation due to extensive Indian food and support",
      "Affordable total 6-year package with stable fees"
    ],
    thingsToConsider: [
      "Check current travel accessibility routes which can fluctuate",
      "High student volume means you must be proactive in clinical rotations",
      "Academic rigor is standard; requires self-discipline for licensing exams"
    ],
    bestFitFor: ["Students preferring milder winters", "Students who want a strong Indian support network", "Value-conscious families"],
    teachingHospitals: [
      "Crimean Republican Clinical Hospital",
      "Simferopol City Clinical Hospital No. 6",
      "Republican Perinatal Center"
    ],
    recognitionBadges: ["Largest Indian Base", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Are fees paid annually?", answer: "Yes, fees are generally paid per year directly to the university." },
      { question: "Is Indian food available?", answer: "Crimea is considered the easiest place in Russia for Indian food and groceries." }
    ],
    programs: [
      {
        slug: "mbbs-crimea-federal-2026",
        title: "Doctor of Medicine (English Taught)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://ma.cfuv.ru/en/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 2 (Next 5) ===\n");
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
        RUSSIA_ID, uni.slug, uni.name, uni.city, uni.type, uni.establishedYear, uni.summary,
        uni.published, uni.featured, uni.officialWebsite, uni.campusLifestyle, uni.cityProfile,
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
            updated_at = NOW();
        `;

        const progValues = [
          universityId, COURSE_MBBS_ID, prog.slug, prog.title, prog.durationYears,
          prog.annualTuitionUsd, prog.totalTuitionUsd, prog.livingUsd,
          prog.medium, prog.officialProgramUrl, true
        ];

        await client.query(progQuery, progValues);
      }
      console.log(`  ✓ Authorities Created: ${uni.name}`);
    }
  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\n✅ Batch 2 Deep Enrichment Done!");
}

seed();
