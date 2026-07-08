/**
 * Seed Mediterranean University of Albania (MUA) BSc Nursing — Albania.
 * Source: Students Traffic MUA Albania BScN Guide, June 2026.
 * Run: node scripts/seed-mua-albania-bscn.mjs
 *
 * Albania (id=53) already exists. This script upserts the university
 * and programme offering only.
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ALBANIA_ID = 53;
const COURSE_BSC_NURSING_ID = 15;

const university = {
  slug: "mediterranean-university-of-albania",
  name: "Mediterranean University of Albania (MUA)",
  city: "Tirana",
  type: "Private",
  establishedYear: 2009,
  officialWebsite: "https://mua.edu.al",
  summary:
    "Mediterranean University of Albania (MUA), founded in 2009, is a private higher education institution in Tirana accredited by QAAHE (Quality Assurance Agency for Higher Education Albania) and ranked #21 in Albania by EduRank 2026. MUA offers a 3-year, 180 ECTS BSc Nursing programme fully in English, with free German language training (A1–B2) and Italian language courses embedded in the curriculum — creating direct pathways to nursing careers in Germany, Austria, and Italy. MUA reports an 85% placement rate for graduates in European healthcare systems. The programme is aligned with EU Directive 2013/55/EU and the Bologna Process, making credential recognition in Germany and Italy straightforward. Annual tuition is €3,500, making MUA one of the most affordable European BSc Nursing options for Indian students.",
  campusLifestyle:
    "MUA's campus is located in Tirana, Albania's vibrant capital. The university maintains dedicated nursing simulation labs with high-fidelity mannequins for clinical skills practice before students enter hospital settings. A digital library, language training centre (for free German and Italian courses), and subject-specific classrooms equipped with digital projectors support the academic programme. MUA's international student office coordinates orientation, administrative support, and part-time work placement assistance. The campus community is international in orientation; MUA's nursing cohorts include students from South Asia, the Middle East, and the Balkans. Tirana's café culture, music venues, and nightlife are easily accessible, and the Albanian Adriatic coast is reachable within 1–2 hours.",
  cityProfile:
    "Tirana is Albania's capital and largest city, population approximately 700,000–1,000,000. A fast-developing Southeast European capital, Tirana combines affordable European living with a Mediterranean climate — warm dry summers reaching 35°C and mild winters between 5–10°C. The local currency is the Albanian Lek (ALL), with 1 EUR ≈ 108–110 ALL; Euros are widely accepted in Tirana. Total monthly student costs range from €300–545 (rent €150–280 + food €100–150 + transport €15–20 + miscellaneous €50–100). Tirana's Nënë Tereza International Airport is 17 km from the city centre, with connections via Istanbul, Rome, and Vienna — approximately 7–10 hours travel time from India. Albania borders Greece, North Macedonia, Kosovo, and Montenegro. Italy is accessible by a 1.5-hour ferry from Durrës (Albania's main port, 35 km from Tirana).",
  clinicalExposure:
    "MUA BSc Nursing students follow a progressive clinical training structure across all three years. Year 1 focuses on nursing skills labs and simulation labs on campus — students work with high-fidelity mannequins and clinical skills stations before entering live hospital settings. Years 2 and 3 involve supervised placements at affiliated clinical training hospitals and healthcare centres in Tirana, covering rotations in medical, surgical, paediatric, obstetric/gynaecological, psychiatric, and emergency nursing. The Year 3 extended practicum requires a minimum of 800 clinical hours in a healthcare institution. MUA's total clinical contact hours exceed 2,300 hours, contributing to the EU Directive 2013/55/EU minimum of 4,600 total programme hours (theory + clinical combined). Clinical instruction is delivered in English.",
  hostelOverview:
    "MUA does not operate a university-owned student hostel. Students arrange private shared apartments near campus in Tirana. Shared accommodation costs approximately €150–280/month per person depending on location, room type, and proximity to campus. The MUA international student support office assists incoming students with accommodation guidance before arrival — providing contacts, neighbourhood recommendations, and average cost guidance. Students typically share apartments with 2–3 fellow nursing students to reduce costs.",
  indianFoodSupport:
    "Tirana has a small but growing Indian student community, particularly among nursing cohorts at Albanian universities. Major supermarkets (Conad, Carrefour, Spar) stock basmati rice, lentils, chickpeas, and Asian spices. Halal meat is widely available throughout Tirana — Albania is a secular majority-Muslim country. Vegetarian options exist at Tirana restaurants but are more limited than in Indian cities; most Indian students supplement by self-cooking. Monthly grocery costs are approximately €100–150. The close-knit Indian student community at MUA guides new arrivals to Indian-friendly shops and markets.",
  safetyOverview:
    "Albania is consistently rated one of the safer countries in the Balkans for international students. Tirana has a Numbeo Safety Index of approximately 96.5 for walking alone during daylight — among the highest in Southeast Europe. Violent crime against foreigners is rare; Albanian culture has a deep tradition of hospitality (Besa — protection of guests). Indian students, including female students, consistently report feeling safe in Tirana. MUA maintains a campus security presence and an international student welfare contact for any issues. Standard urban precautions apply.",
  studentSupport:
    "MUA provides an international student office that coordinates orientation on arrival, Temporary Residence Permit (TRP) assistance, academic counselling, and ongoing administrative support throughout the programme. Free German language training (A1 through B2) and Italian language courses are embedded in the nursing curriculum — included in the tuition fee at no additional charge. MUA's student welfare team provides guidance on accommodation, healthcare registration, and local services. Career pathway advisory — particularly for Germany, Austria, and Italy — is provided through the placement office, which maintains the 85% post-graduation placement rate.",
  whyChoose: [
    "3-year, 180 ECTS BSc Nursing fully in English — no IELTS, no NEET required for admission",
    "Free German language training A1 to B2 embedded in curriculum — mandatory for nurse registration and employment in Germany",
    "Free Italian language training — second European career pathway included in tuition at no extra cost",
    "85% placement rate with active partnerships placing graduates in Germany, Austria, and Italy",
    "QAAHE accredited, EU Directive 2013/55/EU aligned, Bologna Process compliant — credential recognition in Germany and Italy is well-established",
    "Annual tuition €3,500 — among the most affordable European BSc Nursing programmes for Indian students",
    "October intake with August 31 deadline — accessible timeline post-Class 12 results",
    "EduRank 2026 #21 in Albania — recognised institution with a track record since 2009",
  ],
  thingsToConsider: [
    "NOT currently recognised by the Indian Nursing Council (INC) — an MUA nursing degree does not qualify for nursing practice in India",
    "No university-owned hostel — students must arrange private apartments in Tirana independently",
    "Small Indian community in Tirana compared to Russia, Kyrgyzstan, or Georgia — less established Indian student networks",
    "EU accession expected 2027–2030 — Albania is not yet in the Schengen Area; Albanian residence permit does not allow visa-free EU travel",
    "German B2 proficiency is mandatory for clinical employment in Germany — free courses provide foundation but B2 requires consistent effort over 2–3 years alongside the nursing curriculum",
  ],
  bestFitFor: [
    "Indian PCB students targeting nursing careers in Germany, Austria, Italy, or the Middle East — not planning to return to nursing practice in India",
    "Students who did not qualify for NEET-based MBBS and want a healthcare profession with a genuine international European career pathway",
    "Students willing to commit to German B2 level and a European career over 3–5 years post-graduation",
    "Families seeking the most affordable European BSc Nursing option (€3,500/year tuition) with a proven 85% placement record",
  ],
  teachingHospitals: [
    "Affiliated Tirana Clinical Training Hospitals — supervised Year 2 placements across medical, surgical, and specialty wards",
    "Affiliated Tirana Healthcare Centres — Year 2–3 rotations in primary and community healthcare settings",
    "Extended Year 3 Practicum Institutions — minimum 800 clinical hours in accredited Tirana healthcare institutions",
  ],
  recognitionBadges: [
    "QAAHE Accredited — Quality Assurance Agency for Higher Education Albania",
    "EU Directive 2013/55/EU Aligned — European nursing qualification standards",
    "Bologna Process Compliant — 180 ECTS, EQF Level 6",
    "Albanian Ministry of Education Licensed",
    "85% Graduate Placement Rate — Germany, Austria, Italy",
    "EduRank 2026 #21 in Albania",
  ],
  recognitionLinks: [
    { label: "MUA Official Website", url: "https://mua.edu.al" },
    { label: "QAAHE — Albanian Quality Assurance Agency for Higher Education", url: "https://qaahe.edu.al" },
    { label: "Albanian Ministry of Education and Sports", url: "https://arsimi.gov.al" },
  ],
  similarUniversitySlugs: [
    "european-university-of-tirana-bscn",
    "western-balkans-university-bscn",
  ],
  lastVerifiedAt: "2026-06-16",
  researchSources: [
    {
      label: "MUA Official Website",
      url: "https://mua.edu.al",
      kind: "official-university",
      checkedAt: "2026-06-16",
    },
    {
      label: "QAAHE Accreditation — MUA",
      url: "https://qaahe.edu.al",
      kind: "recognition",
      checkedAt: "2026-06-16",
    },
    {
      label: "EduRank Albania University Rankings 2026",
      url: "https://edurank.org/geo/al/",
      kind: "ranking",
      checkedAt: "2026-06-16",
    },
  ],
  faq: [
    {
      question: "Is MUA an accredited university in Albania?",
      answer:
        "Yes. Mediterranean University of Albania (MUA) is accredited by QAAHE (Quality Assurance Agency for Higher Education Albania) and licensed by the Albanian Ministry of Education. It operates under the Bologna Process and EU Directive 2013/55/EU standards.",
    },
    {
      question: "Do I need NEET or IELTS to apply to MUA BSc Nursing?",
      answer:
        "No to both. NEET is not required for MUA BSc Nursing admission. IELTS is also not required — a Medium of Instruction (MOI) certificate from an English-medium Class 12 school is the standard route for Indian students.",
    },
    {
      question: "What is the annual tuition fee for MUA BSc Nursing?",
      answer:
        "Annual tuition is approximately €3,500/year (≈ INR 3.1–3.5 lakh/year at current rates). Total 3-year tuition is approximately €10,500. This makes MUA one of the most affordable European BSc Nursing programmes for Indian students.",
    },
    {
      question: "Can I work in Germany after graduating from MUA?",
      answer:
        "Yes — with German B2 proficiency. MUA's curriculum includes free German language training from A1 to B2. After graduation, you apply for Anerkennungsgesetz (Recognition Act) credential assessment. With recognition confirmed, you can work as a registered nurse in Germany at salaries starting from €30,000–50,000+/year.",
    },
    {
      question: "What is the placement rate for MUA nursing graduates?",
      answer:
        "MUA reports an 85% placement rate for its nursing graduates in Germany, Austria, and Italy. The free German and Italian language training embedded in the curriculum is the core enabler of this European placement record.",
    },
    {
      question: "When is the MUA BSc Nursing intake?",
      answer:
        "The primary intake is October, with an application deadline of August 31. This timing is convenient for Indian students as it follows Class 12 board result declarations.",
    },
    {
      question: "Is MUA BSc Nursing recognised by the Indian Nursing Council (INC)?",
      answer:
        "No. MUA's BSc Nursing degree is not currently recognised by the Indian Nursing Council (INC). This programme is designed for students targeting nursing careers in Europe (Germany, Austria, Italy) or the Middle East — not for returning to practice nursing in India.",
    },
    {
      question: "Does MUA provide hostel accommodation?",
      answer:
        "MUA does not operate a university-owned hostel. Students arrange private shared apartments near campus in Tirana. The international student office assists with accommodation guidance. Shared apartments cost approximately €150–280/month per person.",
    },
    {
      question: "Is Albania safe for Indian nursing students?",
      answer:
        "Yes. Tirana has a Numbeo Safety Index of approximately 96.5 for walking during daylight — among the highest in Southeast Europe. Albanian culture has a tradition of hospitality (Besa — protection of guests). Violent crime against foreigners is rare. Indian students, including female students, consistently report feeling safe in Tirana.",
    },
    {
      question: "What is the total 3-year cost for MUA BSc Nursing?",
      answer:
        "Total 3-year all-in cost is approximately €22,500–27,000 (tuition €10,500 + living €11,500–15,000 including accommodation, food, transport, insurance, and visa fees). This is approximately INR 20–25 lakh — significantly lower than Canada (INR 1.3–1.6 crore), Australia (INR 80 lakh–1 crore), or the UK (INR 60–80 lakh).",
    },
    {
      question: "What languages are taught alongside nursing at MUA?",
      answer:
        "MUA includes free German language training from A1 to B2 level and free Italian language training — both embedded in the 3-year curriculum at no additional charge. German B2 is mandatory for clinical employment in Germany; Italian enables the Italy/Austria pathway.",
    },
    {
      question: "What is MUA's ranking?",
      answer:
        "MUA is ranked #21 in Albania by EduRank 2026. It is a recognised private institution established in 2009 and QAAHE accredited.",
    },
  ],
  admissionsContent: {
    overview:
      "MUA accepts international applications for its October BSc Nursing intake, with an August 31 application deadline. The process assesses academic credentials and an admissions interview — no IELTS or NEET required. Students Traffic manages the complete application, MOI certificate guidance, interview preparation, and Albania Type D visa processing.",
    eligibility: {
      intro: "Entry requirements for Indian students applying to MUA BSc Nursing:",
      items: [
        "Class 12 (10+2) passed — science background with Biology preferred",
        "Minimum 50–60% overall in Class 12 (confirm with MUA admissions at time of application)",
        "No IELTS required — Medium of Instruction (MOI) certificate from English-medium Class 12 school is accepted",
        "No NEET required",
        "Valid Indian passport",
        "Admissions interview (English) covering motivation for nursing and academic background",
      ],
    },
    admissionSteps: [
      "Assess eligibility with Students Traffic — evaluation of Class 12 marks and nursing career goals",
      "Obtain MOI (Medium of Instruction) certificate from Class 12 school — official letterhead with seal and principal signature confirming English as language of instruction",
      "Prepare documents: Class 10 and 12 certificates and marksheets, passport copy, photographs, MOI certificate",
      "Submit MUA International Admissions application — Students Traffic manages this process",
      "Complete the MUA admissions interview (English) covering nursing motivation and academic background",
      "Receive and accept MUA Letter of Acceptance (LOA) — pay programme confirmation fee",
      "Apply for Albania Type D Long-Stay Student Visa at Albanian Embassy, New Delhi (15–30 days processing)",
      "Fly to Tirana and apply for Temporary Residence Permit (TRP) within 30 days of arrival",
    ],
    documentsRequired: {
      educational: [
        "Class 10 certificate and marksheet",
        "Class 12 certificate and marksheet (Biology and Chemistry preferred)",
        "Medium of Instruction (MOI) certificate from Class 12 school — official letterhead with seal and principal signature",
        "Passport copy — minimum 6 months validity beyond programme start date",
        "Passport-size photographs per embassy specifications",
      ],
      visa: [
        "MUA Letter of Acceptance (LOA) confirming programme, duration, and institution",
        "Completed Albania Type D visa application form",
        "Proof of accommodation in Albania",
        "Financial evidence — bank statements (last 3–6 months), parent income proof, or education loan sanction letter",
        "Medical health certificate from a registered Indian doctor",
        "Police clearance certificate from local police station",
        "Valid international health insurance",
      ],
    },
    deadlinesNote:
      "Primary intake is October. Application deadline is August 31. Apply 3–4 months in advance to allow time for admissions, documents, and Albania Type D visa processing (15–30 days).",
    scholarshipInfo:
      "Contact MUA admissions directly for current scholarship availability for international students. Students Traffic can advise on any merit-based fee reductions available at the time of application.",
    licensingPathway: [
      "Albania nursing licence: apply to the Albanian Nursing Order post-graduation — eligible for employment in Albanian healthcare institutions.",
      "Germany (primary target): achieve German B2 (free MUA courses A1–B2) → Anerkennungsgesetz credential recognition → employment in Germany at €30,000–50,000+/year. 85% of MUA graduates place in Germany, Austria, or Italy.",
      "Italy: Italian language training included free → Italian nursing recognition → employment in Italian healthcare system.",
      "Austria: German B2 + credential recognition → employment in Austrian healthcare system.",
      "UK (NMC): IELTS Academic 7.0 + CBT + OSCE → NMC international registration → NHS employment (additional preparation required post-graduation).",
    ],
  },
};

const program = {
  slug: "mua-tirana-bscn",
  title: "BSc Nursing — Mediterranean University of Albania, Tirana",
  durationYears: 3,
  annualTuitionUsd: 3850,
  totalTuitionUsd: 11550,
  livingUsd: 5040,
  officialFeeCurrency: "EUR",
  officialAnnualTuitionAmount: 3500,
  officialTotalTuitionAmount: 10500,
  officialProgramUrl: "https://mua.edu.al",
  medium: "English",
  intakeMonths: ["October"],
  feeVerifiedAt: "2026-06-16",
  fxRateDate: "2026-06-16",
  fxRateSourceUrl:
    "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
  feeNotes:
    "Annual tuition for international BSc Nursing students is €3,500/year (3-year total: €10,500). USD conversion at EUR 1 = USD 1.10 (June 2026). Living costs: €380/month average × 12 = €4,560/year ≈ USD 5,040. MUA is among the most affordable European BSc Nursing programmes. Verify exact fee with MUA admissions annually.",
  teachingPhases: [
    {
      phase: "Year 1 — Foundation Sciences + Nursing Skills Lab",
      language: "English",
      details:
        "Year 1 introduces core biological and medical sciences alongside foundational nursing theory. Subjects include Human Anatomy, Human Physiology, Biochemistry, Microbiology, and Fundamentals of Nursing. Students spend Year 1 primarily on campus in nursing simulation labs with high-fidelity mannequins — building clinical skills (vital signs, patient observation, basic procedures) before entering live hospital settings. German A1 language training begins in Year 1. Assessment is continuous (tests, practicals, assignments) alongside year-end examinations.",
    },
    {
      phase: "Year 2 — Clinical Rotations + Core Medical Nursing Subjects",
      language: "English",
      details:
        "Year 2 moves students into affiliated Tirana hospitals and healthcare centres for supervised clinical placements. Core subjects include Internal Medicine Nursing, Surgical Nursing, Paediatric Nursing, Obstetric and Gynaecological Nursing, Psychiatric and Mental Health Nursing, Pharmacology, and Pathophysiology. Clinical rotations are structured, supervised, and formally assessed. German A2–B1 language training continues. Students develop confidence in patient-facing nursing care under qualified supervision.",
    },
    {
      phase: "Year 3 — Extended Clinical Practicum + Thesis + Career Preparation",
      language: "English",
      details:
        "Year 3 includes an extended clinical practicum (minimum 800 hours) across Tirana hospitals, consolidating skills from Years 1 and 2. Advanced subjects include Emergency Nursing, Geriatrics, Community Health Nursing, Nursing Management, and Health Ethics. A Diploma Thesis is required in Year 3. German B1–B2 preparation intensifies for the Goethe Institut B2 examination required for German nursing employment. Italian language training continues. Career pathway advisory for Germany, Austria, or Italy placement begins in the second semester of Year 3.",
    },
  ],
  yearlyCostBreakdown: [
    {
      yearLabel: "Year 1",
      tuitionUsd: 3850,
      hostelUsd: 0,
      livingUsd: 5040,
      totalUsd: 8890,
      notes:
        "Year 1 includes one-time setup costs (~€200–300 for SIM card, registration, and apartment deposit). Clinical placements begin in Year 2; Year 1 is campus-based in simulation labs. hostelUsd=0 as MUA has no university hostel — students arrange private apartments.",
    },
    {
      yearLabel: "Year 2",
      tuitionUsd: 3850,
      hostelUsd: 0,
      livingUsd: 5040,
      totalUsd: 8890,
      notes:
        "Active clinical rotations at affiliated Tirana hospitals and healthcare centres begin. German and Italian language classes ongoing. Minor transport costs to clinical sites may apply.",
    },
    {
      yearLabel: "Year 3",
      tuitionUsd: 3850,
      hostelUsd: 0,
      livingUsd: 5040,
      totalUsd: 8890,
      notes:
        "Extended clinical practicum (minimum 800 hours). Diploma Thesis submission. German B2 preparation intensifies. Total 3-year tuition: €10,500 (≈ USD 11,550). Total 3-year all-in: approximately €22,500–27,000 (≈ INR 20–25 lakh).",
    },
  ],
  licenseExamSupport: [
    "Germany (primary pathway): German B2 via free MUA A1–B2 training → Anerkennungsgesetz credential recognition → employment in Germany at €30,000–50,000+/year",
    "Italy (second pathway): Italian language training included free in curriculum → Italian nursing recognition → employment in Italian healthcare system",
    "Austria: German B2 + credential recognition → employment in Austrian healthcare system",
    "UK NMC: IELTS Academic 7.0 + CBT + OSCE → NMC international registration → NHS employment",
    "Albania: Albanian Nursing Order licence on graduation — local employment option",
  ],
};

async function seed() {
  const client = await pool.connect();

  try {
    console.log(
      "Upserting university: Mediterranean University of Albania (MUA)..."
    );

    const uniResult = await client.query(
      `INSERT INTO universities (
        country_id, slug, name, city, type, established_year, summary,
        featured, published, official_website,
        campus_lifestyle, city_profile, practical_exposure,
        hostel_overview, dietary_support, safety_overview, student_support,
        why_choose, things_to_consider, best_fit_for,
        industry_partners, recognition_badges, recognition_links,
        faq, similar_university_slugs,
        last_verified_at, research_sources, research_notes,
        admissions_content,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,
        $11,$12,$13,
        $14,$15,$16,$17,
        $18,$19,$20,
        $21,$22,$23,
        $24,$25,
        $26,$27,$28,
        $29,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        country_id          = EXCLUDED.country_id,
        name                = EXCLUDED.name,
        city                = EXCLUDED.city,
        type                = EXCLUDED.type,
        established_year    = EXCLUDED.established_year,
        summary             = EXCLUDED.summary,
        featured            = EXCLUDED.featured,
        published           = EXCLUDED.published,
        official_website    = EXCLUDED.official_website,
        campus_lifestyle    = EXCLUDED.campus_lifestyle,
        city_profile        = EXCLUDED.city_profile,
        practical_exposure   = EXCLUDED.practical_exposure,
        hostel_overview     = EXCLUDED.hostel_overview,
        dietary_support = EXCLUDED.dietary_support,
        safety_overview     = EXCLUDED.safety_overview,
        student_support     = EXCLUDED.student_support,
        why_choose          = EXCLUDED.why_choose,
        things_to_consider  = EXCLUDED.things_to_consider,
        best_fit_for        = EXCLUDED.best_fit_for,
        industry_partners  = EXCLUDED.industry_partners,
        recognition_badges  = EXCLUDED.recognition_badges,
        recognition_links   = EXCLUDED.recognition_links,
        faq                 = EXCLUDED.faq,
        similar_university_slugs = EXCLUDED.similar_university_slugs,
        last_verified_at    = EXCLUDED.last_verified_at,
        research_sources    = EXCLUDED.research_sources,
        research_notes      = EXCLUDED.research_notes,
        admissions_content  = EXCLUDED.admissions_content,
        updated_at          = NOW()
      RETURNING id`,
      [
        ALBANIA_ID,
        university.slug,
        university.name,
        university.city,
        university.type,
        university.establishedYear,
        university.summary,
        false,
        true,
        university.officialWebsite,
        university.campusLifestyle,
        university.cityProfile,
        university.clinicalExposure,
        university.hostelOverview,
        university.indianFoodSupport,
        university.safetyOverview,
        university.studentSupport,
        JSON.stringify(university.whyChoose),
        JSON.stringify(university.thingsToConsider),
        JSON.stringify(university.bestFitFor),
        university.teachingHospitals,
        university.recognitionBadges,
        JSON.stringify(university.recognitionLinks),
        JSON.stringify(university.faq),
        university.similarUniversitySlugs,
        university.lastVerifiedAt,
        JSON.stringify(university.researchSources),
        null,
        JSON.stringify(university.admissionsContent),
      ]
    );

    const universityId = uniResult.rows[0].id;
    console.log(`University upserted: ${university.name} (id=${universityId})`);

    console.log("Upserting programme offering...");

    await client.query(
      `INSERT INTO program_offerings (
        university_id, course_id, slug, title,
        duration_years, annual_tuition_usd, total_tuition_usd, living_usd,
        official_fee_currency, official_annual_tuition_amount, official_total_tuition_amount,
        official_program_url, medium, published,
        teaching_phases, yearly_cost_breakdown, professional_exam_support,
        intake_months, fee_verified_at, fx_rate_date, fx_rate_source_url,
        fee_notes, featured,
        updated_at
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,
        $9,$10,$11,
        $12,$13,$14,
        $15,$16,$17,
        $18,$19,$20,$21,
        $22,$23,
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title                          = EXCLUDED.title,
        duration_years                 = EXCLUDED.duration_years,
        annual_tuition_usd             = EXCLUDED.annual_tuition_usd,
        total_tuition_usd              = EXCLUDED.total_tuition_usd,
        living_usd                     = EXCLUDED.living_usd,
        official_fee_currency          = EXCLUDED.official_fee_currency,
        official_annual_tuition_amount = EXCLUDED.official_annual_tuition_amount,
        official_total_tuition_amount  = EXCLUDED.official_total_tuition_amount,
        official_program_url           = EXCLUDED.official_program_url,
        medium                         = EXCLUDED.medium,
        published                      = EXCLUDED.published,
        teaching_phases                = EXCLUDED.teaching_phases,
        yearly_cost_breakdown          = EXCLUDED.yearly_cost_breakdown,
        professional_exam_support           = EXCLUDED.professional_exam_support,
        intake_months                  = EXCLUDED.intake_months,
        fee_verified_at                = EXCLUDED.fee_verified_at,
        fx_rate_date                   = EXCLUDED.fx_rate_date,
        fx_rate_source_url             = EXCLUDED.fx_rate_source_url,
        fee_notes                      = EXCLUDED.fee_notes,
        featured                       = EXCLUDED.featured,
        updated_at                     = NOW()`,
      [
        universityId,
        COURSE_BSC_NURSING_ID,
        program.slug,
        program.title,
        program.durationYears,
        program.annualTuitionUsd,
        program.totalTuitionUsd,
        program.livingUsd,
        program.officialFeeCurrency,
        program.officialAnnualTuitionAmount,
        program.officialTotalTuitionAmount,
        program.officialProgramUrl,
        program.medium,
        true,
        JSON.stringify(program.teachingPhases),
        JSON.stringify(program.yearlyCostBreakdown),
        JSON.stringify(program.licenseExamSupport),
        program.intakeMonths,
        program.feeVerifiedAt,
        program.fxRateDate,
        program.fxRateSourceUrl,
        program.feeNotes,
        false,
      ]
    );

    console.log(`Programme upserted: ${program.slug}`);
    console.log("\nMUA Albania BScN seeded successfully.");
    console.log(`  Country   : Albania (id=${ALBANIA_ID})`);
    console.log(`  University: ${university.name} (id=${universityId})`);
    console.log(`  Programme : ${program.slug}`);
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
