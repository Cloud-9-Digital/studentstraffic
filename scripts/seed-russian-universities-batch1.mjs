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
    slug: "sechenov-first-moscow-state-medical-university",
    name: "Sechenov First Moscow State Medical University",
    city: "Moscow",
    type: "Public/Federal",
    establishedYear: 1758,
    published: true,
    featured: true,
    officialWebsite: "https://www.sechenov.ru/eng/",
    summary: "Sechenov University is the oldest and largest national medical higher educational institution in Russia. As a member of the World Directory of Medical Schools, it is globally recognized for its research-intensive curriculum and massive clinical infrastructure. For 2026, it remains the 'Gold Standard' for international medical education in Eastern Europe, offering a high-tech ecosystem for medical aspirants.",
    campusLifestyle: "Located in the historical heart of Moscow (Devichye Pole area), students study in a preserved academic environment. The university features 19 specialized clinics, a large scientific library with 3 million books, and over 10 sports centers. Students enjoy a multicultural atmosphere with representatives from 80+ countries. Commuting is easy via the Frunzenskaya and Sportivnaya Metro stations.",
    cityProfile: "Moscow is Russia's high-tech capital. In 2026, it offers advanced infrastructure. Indian students benefit from a massive expat community. Survival Tip: Get a 'Troika' card for the Metro. 2026 Grocery Index: Milk (~95 RUB), 1kg Chicken (~380-450 RUB), 10 Eggs (~135-160 RUB). Total monthly food budget is approx. 15,000 - 18,000 RUB.",
    clinicalExposure: "Unparalleled scale with 3,000+ hospital beds. Primary clinical bases include: University Clinical Hospital No. 1 (Multi-profile), Filatov Children's Hospital (Largest pediatric base), and the Heart & Vascular Institute. Students rotate through these high-volume centers, gaining hands-on experience with advanced robotics and MRI/CT diagnostic technologies starting from the 3rd year.",
    hostelOverview: "International students primarily reside in 'University Town' or Dormitories No. 1, 2, and 3. Rooms are furnished with beds, study desks, and wardrobes. Hostels feature 24/7 laundry, dedicated study rooms, and shared kitchens. Proximity to clinics varies from walking distance to a 15-minute metro ride.",
    indianFoodSupport: "The university area has several 'Indian Mess' facilities operated by senior students and external providers. Local supermarkets (Magnit, Perekrestok) stock Basmati rice, lentils (dal), and spices. Several authentic Indian restaurants like 'Darbar' and 'Jagannath' are popular student hangouts.",
    safetyOverview: "Strict 24/7 security with magnetic card entry. All buildings are under CCTV surveillance. Moscow has a centralized police presence, and the university provides an 'International Student Orientation' specifically focusing on local laws and urban safety.",
    studentSupport: "A dedicated 'International Admissions Office' assists with visa invitations, local police registration, and medical insurance (~$150 USD/year). The 'Student Council' organizes FMGE/NExT practice sessions and cultural events like Diwali and Holi.",
    whyChoose: [
      "Oldest and most prestigious medical school in Russia (Est. 1758)",
      "Vast clinical base with 3,000+ beds and 19 specialized hospitals",
      "Official high-tech Research Center with 24/7 library access",
      "Strategic location in Moscow, providing access to major global entities",
      "Strong alumni network of 10,000+ Indian doctors"
    ],
    thingsToConsider: [
      "Cost of living is 30-40% higher in Moscow than in regional cities",
      "High academic rigour; internal tests are frequent and mandatory",
      "Limited hostel rooms on-campus; third-party apartments are common"
    ],
    bestFitFor: ["Academic toppers", "Research-oriented minds", "Students with a flexible budget seeking global brand value"],
    teachingHospitals: [
      "Sechenov University Clinical Center (19 specialized clinics)",
      "Scientific and Practical Center for Interventional Cardioangiology",
      "Filatov University Children's Clinical Hospital"
    ],
    recognitionBadges: ["WHO Recognized", "NMC FMGL 2021 Compliant", "QS Top 500 Ranked"],
    faq: [
      { question: "Is Sechenov University NMC compliant for 2026?", answer: "Yes, the program is 6 years (5 years study + 1 year internship) in English, meeting all NHC/NMC 2021 criteria." },
      { question: "What are the entrance requirements?", answer: "NEET qualification is mandatory. University entrance exams in Chemistry and Biology are conducted online or in-person." },
      { question: "Do I need to learn Russian?", answer: "Lectures are in English, but Russian is taught for 3 years to ensure you can communicate with patients in hospitals." }
    ],
    programs: [
      {
        slug: "mbbs-sechenov-moscow-2026",
        title: "General Medicine (English Medium)",
        durationYears: 6,
        annualTuitionUsd: 10500,
        totalTuitionUsd: 63000,
        livingUsd: 4500,
        medium: "English",
        officialProgramUrl: "https://international.sechenov.ru/"
      }
    ]
  },
  {
    slug: "pirogov-russian-national-research-medical-university",
    name: "Pirogov Russian National Research Medical University",
    city: "Moscow",
    type: "Public/Research",
    establishedYear: 1906,
    published: true,
    featured: true,
    officialWebsite: "https://rsmu.ru/",
    summary: "Pirogov University (RNRMU) is the leading research medical school in Russia, famous for its clinical depth and advanced simulation centers. For 2026, it offers the most comprehensive clinical-research combined track for international students in Moscow.",
    campusLifestyle: "A centralized campus in South-west Moscow. Features a state-of-the-art 'Medical Simulation Center' where students practice on high-fidelity manikins before hospital rounds. Vibrant student life with 'International Food Festivals' and sports competitions. The campus is green and integrated with the main medical research buildings.",
    cityProfile: "Located in the 'Academic District' (Konkovo/Troparyovo-Nikulino). It's quieter than central Moscow but highly safe. 2026 Costs: Metro pass (~2,500 RUB/month). Food: Supermarkets like 'Auchan' are 10 mins away. Average meal cost at student canteen: 350-500 RUB.",
    clinicalExposure: "Enormous clinical network with 38+ city hospitals and 10,000+ total beds. Primary bases: City Clinical Hospital No. 31 (Surgical focus), Russian Children's Clinical Hospital (Federal level), and the Mother & Child Perinatal Center. Clinical exposure starts early, with a focus on emergency and acute care.",
    hostelOverview: "Features high-rise dormitories (Dorms 1-4) within walking distance (5-7 mins) from academic blocks. Standard layout includes 2-3 students per room with a common study hall on every floor. Rent is approx. 800-1200 USD per year.",
    indianFoodSupport: "International student hostels have dedicated kitchen wings for self-cooking. The 'Indian Student Council' helps coordinate bulk spice/rice purchases from wholesale markets like 'Luzhniki' or 'Food City'.",
    safetyOverview: "The campus is gated with 24/7 security guards and a biometric entry system for hostels. Moscow's South-west district is considered a low-crime area with many university student populations.",
    studentSupport: "Excellent 'Dean's Office for International Students' providing 1-on-1 counseling. Offers integrated FMGE/NExT training modules for Indian students and assists in licensing documentation for USMLE/PLAB.",
    whyChoose: [
      "Ranked #1 for Medical Research in the Russian Federation",
      "Access to a 10,000+ bed clinical network across Moscow",
      "State-of-the-art Medical Simulation Center for pre-clinical training",
      "Hostels located within walking distance of academic buildings",
      "Large and supportive community of 1,000+ Indian students"
    ],
    thingsToConsider: [
      "Academic curriculum is research-heavy with strict grading",
      "Winter weather in Moscow requires high-quality thermal gear",
      "Russian language proficiency is tested strictly from 3rd year onwards"
    ],
    bestFitFor: ["Research-minded medical aspirants", "Students who prefer centralized campus living", "Practical-first learners"],
    teachingHospitals: [
      "Russian Children's Clinical Hospital (RCCH)",
      "City Clinical Hospital No. 17",
      "Perinatal Medical Centre / Mother & Child"
    ],
    recognitionBadges: ["WHO Recognized", "NMC FMGL 2021 Compliant", "Top Research Brand"],
    faq: [
      { question: "Is RNRMU NMC compliant?", answer: "Yes, it provides the 54-month study + 12-month internship required by NMC FMGL 2021." },
      { question: "Are hostels close to university?", answer: "Yes, the main international hostels are only 5 minutes walking distance from the lectures." }
    ],
    programs: [
      {
        slug: "mbbs-pirogov-moscow-2026",
        title: "Medical Doctor (English Taught)",
        durationYears: 6,
        annualTuitionUsd: 8500,
        totalTuitionUsd: 51000,
        livingUsd: 3500,
        medium: "English",
        officialProgramUrl: "https://rsmu.ru/eng/"
      }
    ]
  },
  {
    slug: "kazan-federal-university",
    name: "Kazan Federal University",
    city: "Kazan",
    type: "Public/Federal",
    establishedYear: 1804,
    published: true,
    featured: true,
    officialWebsite: "https://kpfu.ru/",
    summary: "Known as the most 'Digital' university in Russia, KFU offers 2026 aspirants a premium, European-standard education in the safe and culturally rich city of Kazan. It is a QS-ranked Top 500 institution.",
    campusLifestyle: "Students live in the 'Universiade Village', a luxury student complex built for world sports events. The campus features an 18th-century main building combined with ultra-modern laboratories. Kazan is a 'Multiconfessional' city where Mosques and Churches coexist, making it very comfortable for Indian diverse cultures.",
    cityProfile: "Kazan is the 'Third Capital' of Russia. 2026 Index: Rent and food are 25% cheaper than Moscow. Milk (~75 RUB), 1kg Chicken (~320 RUB). Metro is fast and modern. Monthly living cost around 10,000 - 12,000 RUB.",
    clinicalExposure: "Primary base is the 'Kazan University Clinic' (700+ beds). Students also rotate at the Republic Clinical Hospital (RCH) and the City Clinical Hospital No. 7. Focus on 'Translational Medicine' and genomic research.",
    hostelOverview: "The Universiade Village is the best student accommodation in Russia. Rooms feature en-suite bathrooms, newer furniture, and high-speed fiber internet. Features gyms, laundromats, and grocery shops within the village gates.",
    indianFoodSupport: "Kazan has a thriving Indian community. Several Indian canteens operate near the university. Local supermarkets stock most Indian spices thanks to the large trade link with India.",
    safetyOverview: "Kazan is significantly safer than larger metropolises. The Universiade Village has a triple-tier security check. CCTV and security patrols are active 24/7.",
    studentSupport: "KFU provides a unique 'Advisor System' where mentors guide international students through local laws and academics. Active Indian Students Association (ISA) for festive celebrations.",
    whyChoose: [
      "Best student housing in the CIS (Universiade Village)",
      "QS World Top 500 Global Ranking",
      "Kazan is safe, affordable, and culturally welcoming",
      "Advanced 'Digital Medicine' and simulation-driven labs"
    ],
    thingsToConsider: [
      "Strict entrance exams (Biology/Chemistry) for 2026 session",
      "Distance to some clinical sites requires public transport",
      "Kazan's climate is windy; prepare with windproof gear"
    ],
    bestFitFor: ["Students seeking premium living quality", "Quality-conscious applicants", "Conservative families preferring a safe city"],
    teachingHospitals: [
      "KFU University Clinic",
      "Republic Clinical Hospital (Tatarstan)",
      "Kazan City Clinical Hospital No. 7"
    ],
    recognitionBadges: ["QS Top 500", "WHO Recognized", "NMC Compliant"],
    faq: [
      { question: "What is the Universiade Village?", answer: "It is a premium housing complex for KFU students, essentially a 'city within a city' for students." },
      { question: "Are fees paid in USD?", answer: "Fees are typically accepted in Russian Rubles, but calculated based on an exchange rate equivalent (~$6,000-7,000 USD)." }
    ],
    programs: [
      {
        slug: "mbbs-kazan-federal-2026",
        title: "Medicine (English Medium)",
        durationYears: 6,
        annualTuitionUsd: 6500,
        totalTuitionUsd: 39000,
        livingUsd: 2500,
        medium: "English",
        officialProgramUrl: "https://kpfu.ru/eng/"
      }
    ]
  },
  {
    slug: "bashkir-state-medical-university",
    name: "Bashkir State Medical University",
    city: "Ufa",
    type: "Public/State",
    establishedYear: 1932,
    published: true,
    featured: true,
    officialWebsite: "https://bashgmu.ru/en/",
    summary: "Bashkir State Medical University (BSMU) is the most popular choice for Indian students seeking a balance between high-volume clinical practice and a massive Indian community. For 2026, it remains a budget-friendly powerhouse.",
    campusLifestyle: "Ufa is a green city on the Ural mountains. BSMU is known for being 'Indian-friendly'. The university has an 'International Student Club' and a very active sports culture including cricket matches for Indian students. Campus buildings are spread across the city center.",
    cityProfile: "Ufa is affordable and peaceful. 2026 Index: Milk (~70 RUB), 1kg Chicken (~300 RUB). Monthly expenses are manageable within $150-$200 USD. Walking is the primary mode of campus commuting.",
    clinicalExposure: "Strong clinical base focused on surgery and robotics. Primary base: BSMU University Hospital (800+ beds). Students also rotate at the Republican Clinical Oncology Dispensary and the Cardiology Center.",
    hostelOverview: "Students stay in 'Hostel Block 1-5'. They are standard government-style dorms, safe and functional. Shared kitchens, common study halls, and laundry rooms. Walking distance to many classrooms.",
    indianFoodSupport: "The 'Golden Standard' for food: BSMU has several dedicated Indian Messes serving high-quality North and South Indian food (curries, dal, roti, rice). Most Indian students never need to cook.",
    safetyOverview: "Ufa is a family-oriented city. BSMU Hostels have strict 11 PM curfews for safety. Biometric entry and 24/7 security staff ensure a protected environment.",
    studentSupport: "Vast Indian alumni network. BSMU provides integrated FMGE/NExT coaching classes conducted by visiting Indian faculties and senior doctors.",
    whyChoose: [
      "Massive Indian community (over 2,000 Indian students)",
      "Best Indian Mess facilities in the Russian Federation",
      "Low tuition and living costs (highly affordable)",
      "Strong clinical grounding with 800-bed University Hospital"
    ],
    thingsToConsider: [
      "Hostels are older (Public style) compared to Federal universities",
      "High density of students in labs; requires proactiveness",
      "Continental climate with hot summers and snowy winters"
    ],
    bestFitFor: ["Budget-conscious families", "Students who want a large Indian community", "Licensing exam focused learners"],
    teachingHospitals: [
      "BSMU University Hospital",
      "Republican Clinical Oncology Dispensary",
      "Regional Cardiology Center"
    ],
    recognitionBadges: ["WHO Listed", "NMC FMGL 2021 Compliant", "Most Popular for Indians"],
    faq: [
      { question: "Is there an Indian Mess?", answer: "Yes, BSMU is famous for its multiple high-quality Indian mess options." },
      { question: "Is the degree valid in India?", answer: "Absolutely, provided you clear the NEET/NExT licensing exam after graduation." }
    ],
    programs: [
      {
        slug: "mbbs-bashkir-ufa-2026",
        title: "Medical Doctor (English Taught)",
        durationYears: 6,
        annualTuitionUsd: 5500,
        totalTuitionUsd: 33000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://bashgmu.ru/en/"
      }
    ]
  },
  {
    slug: "volgograd-state-medical-university",
    name: "Volgograd State Medical University",
    city: "Volgograd",
    type: "Public/State",
    establishedYear: 1935,
    published: true,
    featured: true,
    officialWebsite: "https://www.volgmed.ru/en/",
    summary: "Volgograd State Medical University is a historic 'Hero City' institution with decades of experience in training Indian doctors. It offers a standardized, high-quality medical education with a strong emphasis on anatomy and clinical surgery.",
    campusLifestyle: "A picturesque riverside campus on the Volga. The university has a very formal academic culture. International students participate in 'Friendship Festivals' and scientific conferences. The city is rich with WWII history and monuments.",
    cityProfile: "Volgograd is a linear city along the river. 2026 Index: Very affordable. Milk (~72 RUB), Chicken (~315 RUB). Public transport (Trams) is the main mode of travel. Peaceful lifestyle with riverfront parks.",
    clinicalExposure: "Primary clinical rotation at City Clinical Emergency Hospital No. 25 (High volume) and the Regional Cardiology Center. Known for its strong Department of Operative Surgery and Topographic Anatomy.",
    hostelOverview: "Multiple hostels (Hostel 1, 3, 4). They are well-guarded and functional. Students often praise the sense of camaraderie and shared study sessions in the dorm libraries.",
    indianFoodSupport: "International student canteens offer diverse menus. Local markets feature 'Indian Corners' with spices and lentils. Student canteens are very budget-friendly (~250-300 RUB/meal).",
    safetyOverview: "Volgograd is a quiet, safe province. The university maintains a strict safety record with 24/7 security and a dedicated office for foreign student safety coordination.",
    studentSupport: "Excellent teacher-to-student ratio. The university provides extensive Russian language support and assists in medical insurance and local legal registration.",
    whyChoose: [
      "Historic institution with decades of Indian alumni",
      "Superior teaching in Anatomy and Practical Surgery",
      "Affordable total package under \u20b928 Lakhs",
      "Peaceful, scenic riverside city environment"
    ],
    thingsToConsider: [
      "Strict attendance requirements; miss 3 classes and you face warnings",
      "Summers are very hot; ensure proper hydration",
      "Requires use of public trams to reach various clinical sites"
    ],
    bestFitFor: ["Academic and disciplined students", "History buffs", "Students seeking value-for-money elite education"],
    teachingHospitals: [
      "City Clinical Emergency Hospital No. 25",
      "Regional Cardiology Center",
      "Volgograd Regional Clinical Hospital No. 1"
    ],
    recognitionBadges: ["WHO Recognized", "NMC FMGL 2021 Compliant", "Top Clinical Status"],
    faq: [
      { question: "How safe is Volgograd?", answer: "It is an extremely safe, family-oriented city with a friendly local population." },
      { question: "Is the medium of instruction English?", answer: "Yes, the full 6-year program is conducted in English for international students." }
    ],
    programs: [
      {
        slug: "mbbs-volgograd-2026",
        title: "Medical Degree (MD/MBBS)",
        durationYears: 6,
        annualTuitionUsd: 5000,
        totalTuitionUsd: 30000,
        livingUsd: 2000,
        medium: "English",
        officialProgramUrl: "https://www.volgmed.ru/en/"
      }
    ]
  }
];

async function seed() {
  console.log("=== Russian University Deep Enrichment: Batch 1 (Top 5) ===\n");
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
  console.log("\n✅ Batch 1 Deep Enrichment Done!");
}

seed();
