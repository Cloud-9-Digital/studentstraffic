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
    wdomsNameMatches: "Alte University",
    slug: "alte-university-georgia",
    name: "Alte University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2002,
    officialWebsite: "https://alte.edu.ge/",
    summary: "Alte University is a modern, student-centric private university in Tbilisi. For 2026 admissions, it stands out for its deep integration with the EVEX Medical Corporation (Georgia's largest healthcare network), providing Indian students with unparalleled early clinical exposure.",
    campusLifestyle: "A highly international campus environment. The campus is known for its modern aesthetics, high-tech simulation labs, and diverse student body featuring hundreds of Indian MBBS aspirants.",
    cityProfile: "Tbilisi is the vibrant capital of Georgia. 2026 Cost Index: Highly European lifestyle. Standard Khachapuri (~8-10 GEL), Metro pass (~1 GEL). Monthly expenses around $300-$400 USD. Very safe for international students.",
    clinicalExposure: "Uniquely partnered with the EVEX Medical Corporation, owning over 80 clinics and hospitals across Georgia. Guarantees massive clinical volume and hands-on practice from the 3rd year.",
    hostelOverview: "Private hostel accommodations near the campus are available. Many international students prefer shared apartments in central Tbilisi. Secure, high-speed Wi-Fi and modern amenities are standard.",
    indianFoodSupport: "Tbilisi has a thriving Indian community. Numerous authentic Indian restaurants and dedicated Indian-spice supermarkets are a short commute away.",
    safetyOverview: "Georgia is ranked among the safest countries in the world. Alte University provides excellent orientation and 24/7 security for its international cohort.",
    studentSupport: "Provides integrated USMLE and FMGE/NExT preparation tracks starting from year 2. Dedicated support offices for Indian student affairs.",
    whyChoose: [
      "Exclusive clinical partnership with the EVEX Medical Corporation (80+ clinics)",
      "Modern, student-centric European campus with high-tech simulation labs",
      "Integrated USMLE and NExT licensing preparation modules",
      "Fully compliant with NMC FMGL 2021 criteria (6 years, 360 ECTS)"
    ],
    thingsToConsider: [
      "Tuition fees ($5,500/year) are slightly higher than post-soviet alternatives",
      "Tbilisi living expenses are rising due to its European popularity",
      "Hostels are mostly private/off-campus arrangements"
    ],
    bestFitFor: ["Students wanting European-style clinical networks", "USMLE Aspirants"],
    teachingHospitals: ["EVEX Corporation Clinics", "Ivane Bokeria University Hospital"],
    recognitionBadges: ["EVEX Clinical Partner", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is it NMC recognized?", answer: "Yes, it fully adheres to the 54-month + internship FMGL 2021 mandate." },
      { question: "Do they offer Indian food?", answer: "There is no official on-campus Indian mess, but Tbilisi is full of Indian restaurants." }
    ],
    programs: [
      {
        slug: "mbbs-alte-university-2026",
        title: "Medical Degree / MD (European Standard)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://alte.edu.ge/"
      }
    ]
  },
  {
    wdomsNameMatches: "Batumi Shota Rustaveli",
    slug: "batumi-shota-rustaveli-state-university",
    name: "Batumi Shota Rustaveli State University",
    city: "Batumi",
    type: "Public/State",
    establishedYear: 1923,
    officialWebsite: "https://bsu.edu.ge/",
    summary: "Batumi Shota Rustaveli State University (BSU) is an elite public institution on the Black Sea coast. For 2026, it offers Indian students one of the most affordable state-funded medical degrees in Georgia, combined with a stunning resort-city lifestyle.",
    campusLifestyle: "A traditional, historic state campus mixed with modern coastal living. Located in the beautiful resort city of Batumi. Students enjoy a mild, semi-tropical climate and a very relaxed, safe environment.",
    cityProfile: "Batumi is a Black Sea resort city. 2026 Cost Index: Very affordable. Standard Khachapuri (~7 GEL), Bus pass (~0.80 GEL). Monthly expenses around $250-$350 USD. Extremely scenic and safe.",
    clinicalExposure: "Utilizes major state-funded municipal hospitals in the Adjara region. High volume of diverse clinical cases due to Batumi's status as a major regional hub.",
    hostelOverview: "Offers university-managed state hostels which are highly affordable. Rooms are shared by 2-3 students. Private apartment rentals near the beach are also very popular.",
    indianFoodSupport: "Self-cooking is highly encouraged. Local hypermarkets stock a good variety of international produce. A growing Indian student community supports local spice import shops.",
    safetyOverview: "Batumi is famously safe and tourist-friendly. The state university provides excellent campus security and support.",
    studentSupport: "As a State University, it has highly structured academic disciplines and strong international student support desks.",
    whyChoose: [
      "Elite Public/State University (Highly trusted and established in 1923)",
      "High affordability ($4,000 - $4,500/year) compared to Tbilisi private schools",
      "Stunning coastal resort-city lifestyle (Black Sea)",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Located in Batumi, not the capital city of Tbilisi",
      "State university regulations are much stricter regarding attendance",
      "Fewer private clinical network partnerships compared to Tbilisi"
    ],
    bestFitFor: ["Budget-conscious families", "Students preferring public/state universities"],
    teachingHospitals: ["Batumi Republican Clinical Hospital", "Medcenter Batumi"],
    recognitionBadges: ["Elite State Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is Batumi Shota a public university?", answer: "Yes, it is a highly respected Georgian State University." },
      { question: "How far is Batumi from Tbilisi?", answer: "About 5 hours by a very comfortable express train." }
    ],
    programs: [
      {
        slug: "mbbs-batumi-state-2026",
        title: "Medical Degree / MD (State Track)",
        durationYears: 6,
        annualTuitionUsd: 4500,
        totalTuitionUsd: 27000,
        livingUsd: 3000,
        medium: "English",
        officialProgramUrl: "https://bsu.edu.ge/"
      }
    ]
  },
  {
    wdomsNameMatches: "BAU International",
    slug: "bau-international-university-batumi",
    name: "BAU International University",
    city: "Batumi",
    type: "Private",
    establishedYear: 2015,
    officialWebsite: "https://bauinternational.edu.ge/",
    summary: "BAU International University, Batumi, is part of a massive global educational network. For 2026, it is highly sought after by Indian students desiring a high-tech, American-style curriculum specifically tied to the modern Medina Hospital complex.",
    campusLifestyle: "Ultra-modern, high-tech campus. The university is geographically integrated with a major clinical hospital. Excellent digital infrastructure, dissection labs, and a premium student experience.",
    cityProfile: "Batumi is a Black Sea resort city. 2026 Cost Index: Affordable resort living. Monthly expenses around $250-$350 USD. Highly peaceful and visually stunning city.",
    clinicalExposure: "Exceptional. The university is physically connected to the 'Medina' Hospital, allowing immediate translation from theory to practice. Provides extensive hands-on surgical and clinical rotations.",
    hostelOverview: "Students typically rent private apartments in Batumi, which are modern and affordable. The university assists with housing placements.",
    indianFoodSupport: "Self-cooking is the primary option. Local supermarkets are modern and well-stocked.",
    safetyOverview: "Extremely high safety standards. The university is part of a major international network with strict compliance protocols.",
    studentSupport: "Global network advantages. Exceptional USMLE coaching and opportunities to participate in international student exchange programs.",
    whyChoose: [
      "Physically integrated with the modern Medina Hospital (Immediate clinical access)",
      "Part of the elite BAU Global Network (Washington, Berlin, Istanbul)",
      "High-tech, American-style USMLE-focused curriculum",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Tuition fees are slightly higher due to premium international facilities",
      "Requires independent housing (apartment living) in Batumi"
    ],
    bestFitFor: ["Global-minded students", "USMLE Aspirants", "Students desiring high-tech labs"],
    teachingHospitals: ["Medina Hospital Network"],
    recognitionBadges: ["Global Network University", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is this connected to BAU Global?", answer: "Yes, it is part of the prestigious BAU Global Education Network." }
    ],
    programs: [
      {
        slug: "mbbs-bau-batumi-2026",
        title: "Medical Degree / MD (Global Track)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://bauinternational.edu.ge/"
      }
    ]
  },
  {
    wdomsNameMatches: "Georgian National University SEU",
    slug: "seu-georgian-national-university",
    name: "Georgian National University SEU",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2001,
    officialWebsite: "https://www.seu.edu.ge/",
    summary: "Georgian National University SEU boasts one of the most advanced, ultra-modern campuses in Eastern Europe. For 2026, it is a top-tier choice for Indian students seeking premium infrastructure, UK-aligned curriculums, and a massive international student community.",
    campusLifestyle: "A stunning, futuristic campus in Tbilisi. Features robotic simulation centers, enormous modern libraries, and high-end recreational facilities. The student vibe is extremely international and socially active.",
    cityProfile: "Tbilisi is a major European capital. 2026 Cost Index: Standard Khachapuri (~8-10 GEL). Monthly expenses around $300-$400 USD. Vibrant, historic, and modern.",
    clinicalExposure: "Partnered with leading private and public hospitals in Tbilisi. Extensive practical training starting heavily in the 4th year.",
    hostelOverview: "SEU offers assistance with premium private accommodations. Most students rent shared European-style flats near the metro stations.",
    indianFoodSupport: "Massive Indian student population means high accessibility to Indian restaurants, tiffin services, and imported grocery stores.",
    safetyOverview: "Tbilisi is highly secure. SEU's campus operates with absolute modern security standards and digital pass systems.",
    studentSupport: "Elite support infrastructure. Direct alignment with UK and US medical curricula (USMLE/PLAB focus) and dedicated FMGE training.",
    whyChoose: [
      "One of the largest and most technologically advanced campuses in Georgia",
      "Curriculum heavily aligned with USMLE and PLAB (UK) standards",
      "Massive, vibrant Indian and international student community",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Tuition fees are premium (~$6,000/year)",
      "High competition for admission due to campus popularity",
      "Strict academic progression rules"
    ],
    bestFitFor: ["Students wanting premium infrastructure", "PLAB/USMLE Aspirants", "Extroverted learners"],
    teachingHospitals: ["Pineo Medical Ecosystem", "Tbilisi Central Hospitals"],
    recognitionBadges: ["Premium Infrastructure Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is SEU Campus good?", answer: "It is widely considered one of the most beautiful and modern campuses in Eastern Europe." }
    ],
    programs: [
      {
        slug: "mbbs-seu-georgia-2026",
        title: "Medical Degree / MD (Premium English)",
        durationYears: 6,
        annualTuitionUsd: 6000,
        totalTuitionUsd: 36000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://www.seu.edu.ge/"
      }
    ]
  },
  {
    wdomsNameMatches: "East European University",
    slug: "east-european-university-eeu",
    name: "East European University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2012,
    officialWebsite: "https://eeu.edu.ge/",
    summary: "East European University (EEU) is a rapidly growing private institution known for its high-tech medical faculty. For 2026, it offers Indian students access to impressive on-campus clinics, including a 500-bed Central Hospital network.",
    campusLifestyle: "Modern, business-academic vibe. EEU focuses heavily on employing modern European educational standards. Very welcoming to international students with dedicated clubs.",
    cityProfile: "Tbilisi is a beautiful European capital. 2026 Cost Index: Monthly expenses around $300-$400 USD. Easy Metro access across the city.",
    clinicalExposure: "Excellent. EEU utilizes a wide network including a Central Hospital (500 beds) and a Pediatric Hospital (600+ beds). Strong emphasis on early practical exposure.",
    hostelOverview: "Students typically stay in private flats. EEU helps arrange excellent shared accommodations with European-standard heating and internet.",
    indianFoodSupport: "Plenty of Indian dining options and grocery stores in Tbilisi.",
    safetyOverview: "Very safe. The university features 24/7 security and comprehensive support cells for international students.",
    studentSupport: "Strong focus on international integration. Offers FMGE coaching and extensive modern digital libraries.",
    whyChoose: [
      "Access to a vast clinical network (500-bed Central, 600-bed Pediatric)",
      "Modern European educational standards and high-tech campus",
      "Highly affordable tuition compared to other premium Tbilisi colleges",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Relatively newer university (Est. 2012)",
      "Requires renting private apartments in Tbilisi"
    ],
    bestFitFor: ["Budget-conscious students preferring Tbilisi", "Clinical enthusiasts"],
    teachingHospitals: ["EEU Partner Central Hospital", "Tbilisi Pediatric Hospital"],
    recognitionBadges: ["Modern European Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "Is EEU NMC approved?", answer: "Yes, it fully adheres to the 6-year NMC FMGL 2021 regulations." }
    ],
    programs: [
      {
        slug: "mbbs-eeu-georgia-2026",
        title: "Medical Degree / MD (European Track)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://eeu.edu.ge/"
      }
    ]
  },
  {
    wdomsNameMatches: "European University",
    slug: "european-university-georgia",
    name: "European University",
    city: "Tbilisi",
    type: "Private",
    establishedYear: 2012,
    officialWebsite: "https://eu.edu.ge/",
    summary: "European University in Tbilisi is highly regarded for its massive clinical partnerships. For 2026, it offers Indian students an elite curriculum with agreements spanning approximately 60 clinics and hospitals across Georgia.",
    campusLifestyle: "Academic excellence driven. High-tech simulation centers and a very structured medical curriculum. The campus is vibrant with a large Indian demographic.",
    cityProfile: "Tbilisi. 2026 Cost Index: Monthly expenses around $300-$400 USD. Rich history and safe environment.",
    clinicalExposure: "Massive. Signed agreements with ~60 regional clinics and hospitals. Offers unprecedented variety in clinical cases during the senior years.",
    hostelOverview: "The university assists with safe, premium private apartment rentals around the academic district.",
    indianFoodSupport: "Excellent. Tbilisi's growing Indian network ensures ample availability of spices, lentils, and local Indian cooks.",
    safetyOverview: "Extremely safe with a highly responsive international student office.",
    studentSupport: "Top-tier FMGE/NExT support. Active promotion of international medical conferences for its students.",
    whyChoose: [
      "Unprecedented clinical network (Agreements with ~60 hospitals/clinics)",
      "High international ranking for privately funded Georgian universities",
      "Large, established community of Indian medical students",
      "Fully compliant with NMC FMGL 2021 criteria (6 years)"
    ],
    thingsToConsider: [
      "Tuition is generally $5,000 - $5,500/year",
      "Academic rigor is high; strict exam protocols"
    ],
    bestFitFor: ["Serious Clinical Seekers", "Students wanting large hospital networks"],
    teachingHospitals: ["Jo Ann University Hospital", "National Center of Surgery"],
    recognitionBadges: ["Massive Clinical Hub", "WHO Recognized", "NMC FMGL 2021 Compliant"],
    faq: [
      { question: "How many hospitals are affiliated?", answer: "Over 60 hospitals and clinics in the region." }
    ],
    programs: [
      {
        slug: "mbbs-european-university-2026",
        title: "Medical Degree / MD (European Standard)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://eu.edu.ge/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Georgia Deep Enrichment: Batch 1 (Top WDOMS Match) ===\n");
  const client = await pool.connect();

  try {
    for (const uni of universities) {
      console.log(`Deeply Enriching: ${uni.name}...`);

      // Find the university ID from wdoms entries or universities table by name matching
      // Since they are currently in wdoms_directory_entries AND imported by user maybe to universities?
      // "already all these universities are imported to the website, they are not published."
      // Let's UPDATE the existing university if it exists, otherwise INSERT.
      
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
  console.log("\n✅ Georgia Batch 1 Complete!");
}

seed();
