/**
 * Seed Western Balkans University (WBU) BSc Nursing — Albania.
 * Source: Students Traffic WBU Albania BScN Guide, June 2026.
 * Run: node scripts/seed-wbu-albania-bscn.mjs
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
  slug: "western-balkans-university-bscn",
  name: "Western Balkans University (WBU) — BSc Nursing",
  city: "Tirana",
  type: "Private",
  establishedYear: 2021,
  officialWebsite: "https://wbu.edu.al",
  summary:
    "Western Balkans University (WBU) is a private Albanian university established in 2021 through a cooperation framework between the American Hospitals Group, International Hospital Hygeia, and Cambridge Clinical Laboratories. WBU holds ASCAL's maximum 6-year institutional accreditation (April 2024), operates under the Bologna Process, and has a Times Higher Education institutional profile. Its 3-year English-medium BSc Nursing (180 ECTS) includes a direct employment partnership with MEDIAN Clinics Germany. For Indian students targeting European nursing careers, WBU offers an affordable, clinically grounded European degree with a concrete employer bridge.",
  campusLifestyle:
    "WBU's campus sits at Highway Tiranë-Durrës, KM 7, Kashar — a modern, purpose-built setting approximately 15–25 minutes west of central Tirana. The campus includes a dedicated Nursing Lab, Physiology and Anatomy Lab, and Physiotherapy Lab. Nursing cohorts are intentionally small — professors know each student by name and clinical supervision is personalised. The student body represents 25+ countries. WBU's EPIC programme provides professional development alongside the academic curriculum. Student residences are available in Tirana (Fole Residence, 10 minutes from campus) and Durrës, with single, double, and triple rooms including air conditioning, Wi-Fi, gym, laundry, and cafeteria. WBU offers free German and Italian language courses alongside the nursing programme.",
  cityProfile:
    "Tirana is the capital of Albania, population approximately 800,000–900,000. A vibrant, fast-developing Southeast European capital, Tirana has transformed into a modern European city with a growing café culture, street art, music venues, and a young population. For Indian students, Tirana combines European quality of life with genuinely affordable living — rent, food, transport, and entertainment cost a fraction of Western European cities. The WBU campus in Kashar is easily connected to the city centre by bus, taxi, or ride-hailing. Tirana's Mediterranean climate (hot dry summers 30–35°C, mild winters 5–12°C) suits Indian students far better than northern European destinations. The Adriatic coast is 30–40 minutes away; Italy is accessible by ferry from Durrës.",
  clinicalExposure:
    "Clinical training at WBU begins in Semester 2 — earlier than most European nursing programmes — giving students patient-contact from Year 1. Three mandatory Professional Practice placements are embedded across the three years. Professional Practice I (Semester 2, Year 1): introduction to clinical settings, patient observation, and basic nursing skills under supervision. Professional Practice II (Semester 4, Year 2): active participation in patient care across internal medicine, surgery, and specialty wards. Professional Practice III (Semester 6, Year 3 — 4 ECTS): extended placement where students function as nursing team members. Primary training hospitals: American Hospitals Group (largest private hospital network in Albania/Kosovo, WBU co-founder); International Hospital Hygeia (major Southeast European private network); Cambridge Clinical Laboratories (advanced diagnostics). Students also rotate through Albanian public hospitals, polyclinics, and specialised clinics in dermatology, mental health, obstetrics/gynaecology, paediatrics, and rehabilitation. On-campus Nursing Lab and Physiology and Anatomy Lab support skills training before live placements.",
  hostelOverview:
    "WBU offers two student residences: Fole Residence in Tirana (10 minutes from campus) — single rooms €200–350/month, shared €150–250/month per person; and a residence in Durrës. Rooms include air conditioning, Wi-Fi, gym, laundry, and cafeteria access. Private apartments in Tirana cost €250–500/month for a one-bedroom; sharing with 2–3 students reduces per-person cost significantly. WBU's International Relations Office assists with accommodation guidance pre-arrival.",
  indianFoodSupport:
    "Tirana has a growing international food scene well-suited to Indian students. Major supermarkets (Conad, Carrefour) stock basmati rice, lentils, chickpeas, and Asian spices. Halal meat is widely available throughout Tirana — Albania is a secular majority-Muslim country. Vegetarian options are available in Tirana restaurants, more limited than Indian cities but sufficient. Most Indian students cook their own food; groceries cost €150–200/month. The Indian student community at WBU guides new arrivals on food sources and affordable cooking.",
  safetyOverview:
    "Tirana is considered one of the safer capitals in Southeast Europe for international students. Violent crime against foreigners is very uncommon. Albanian culture has deep traditions of hospitality (Besa — protection of guests). Indian students, including female students, report feeling safe. WBU campus has a security presence and a Dean of Students office for student welfare. Normal urban precautions apply.",
  studentSupport:
    "WBU's International Relations Office provides orientation, TRP assistance, and ongoing administrative support. The Dean of Students office coordinates student welfare. The EPIC employability programme provides career-readiness training. Faculty-to-student ratios are low — small nursing cohorts mean professors know students individually. Career Services connects students with external partners including MEDIAN Clinics Germany. Students Traffic provides end-to-end support: eligibility assessment, MOI guidance, WBU application management, Excellence Scholarship application, mock interview preparation, Albania Type D visa processing, TRP coordination, Tirana arrival checklist, and post-graduation career roadmap for Germany, UK, or other destinations.",
  whyChoose: [
    "Founded by hospital groups: WBU was established through cooperation of the American Hospitals Group and International Hospital Hygeia — clinical training is in the hospitals that built the university.",
    "ASCAL maximum 6-year accreditation (April 2024) — the highest possible Albanian quality rating, current and verifiable.",
    "Clinical training begins Semester 2 (Year 1) — earlier than most European nursing programmes. Students enter real hospital settings at American Hospitals Group and Hygeia from Year 1.",
    "MEDIAN Clinics Germany employment partnership — a delegation from one of Germany's largest rehabilitation hospital networks visited WBU and opened a direct employment project for WBU nursing graduates.",
    "Free German and Italian language courses embedded in the programme — languages Indian nurses need most for European employment.",
    "Times Higher Education institutional profile — engagement with global academic quality frameworks.",
    "MSc Nursing (5 profiles) available at WBU — direct continuation for graduates seeking advanced specialisation.",
    "Total 3-year investment of INR 31–39 lakh — significantly lower than Canada (INR 1.3–1.6 crore), Australia (INR 80 lakh–1 crore), or UK (INR 60–80 lakh).",
  ],
  thingsToConsider: [
    "WBU is a newer institution founded in 2021 — it does not yet appear in QS World Rankings or THE global ranking tables. Its strength is ASCAL maximum accreditation and hospital partnerships, not prestige rankings.",
    "The admissions interview counts for 30% of your evaluation — it is genuine and must be taken seriously. Students Traffic prepares you specifically for this.",
    "Minimum Class 12 requirement is 70% — students with marks between 50–70% should discuss alternatives with Students Traffic.",
    "Canada is not the natural target for a WBU graduate — the IEN pathway (NNAS + NCLEX-RN) takes 12+ months. If Canada is the primary goal, a Canadian nursing programme is more efficient.",
    "German language at B2 is mandatory to work clinically in Germany — the free WBU language courses are a strong start but B2 requires consistent effort over 2–3 years alongside the nursing curriculum.",
    "Albania is not in the Schengen Area — Albanian residence permit does not allow visa-free EU travel. Schengen visas are required separately.",
  ],
  bestFitFor: [
    "Indian Class 12 students with 70%+ overall who want a European nursing degree targeting Germany, UK, or Southeast European nursing careers.",
    "Students motivated by the direct MEDIAN Clinics Germany employment partnership — a named employer, not a theoretical route.",
    "Students who want clinical hospital exposure from Semester 2 of Year 1 at advanced private hospital networks.",
    "Students willing to take German or Italian language courses during the BSc — provided free by WBU.",
    "GNM diploma holders or students with prior university credits who want credit recognition and a potentially shortened European degree pathway.",
    "Families seeking an affordable European nursing degree (INR 31–39 lakh total) with a concrete post-graduation employer partnership.",
  ],
  teachingHospitals: [
    "American Hospitals Group — largest private hospital network in Albania and Kosovo (WBU founding partner)",
    "International Hospital Hygeia — major Southeast European private hospital network (WBU founding partner)",
    "Cambridge Clinical Laboratories — advanced diagnostic laboratory (WBU founding partner)",
    "Albanian public hospitals and polyclinics, Tirana",
    "Specialised clinics — dermatology, mental health, obstetrics/gynaecology, paediatrics, rehabilitation",
  ],
  recognitionBadges: [
    "ASCAL Accredited — Maximum 6-Year Rating (April 2024)",
    "Bologna Process Compliant — European Higher Education Area (EHEA)",
    "180 ECTS — European Credit Transfer System",
    "Times Higher Education (THE) Institutional Profile",
    "MEDIAN Clinics Germany — Employment Partnership",
    "ESQR Nominated — 2025 Quality Choice Prize",
  ],
  recognitionLinks: [
    { label: "WBU Official Website", url: "https://wbu.edu.al" },
    { label: "WBU International Admissions", url: "https://admissions.wbu.edu.al" },
    { label: "ASCAL — Albanian Quality Assurance Agency", url: "https://www.ascal.al" },
    { label: "MEDIAN Clinics Germany", url: "https://www.median-kliniken.de" },
  ],
  similarUniversitySlugs: ["european-university-of-tirana-bscn"],
  lastVerifiedAt: "2026-06-16",
  researchSources: [
    {
      label: "WBU Official Website",
      url: "https://wbu.edu.al",
      kind: "official-university",
      checkedAt: "2026-06-16",
    },
    {
      label: "WBU International Admissions Portal",
      url: "https://admissions.wbu.edu.al",
      kind: "official-program",
      checkedAt: "2026-06-16",
    },
    {
      label: "ASCAL Accreditation Decision No. 75, April 2024",
      url: "https://www.ascal.al",
      kind: "recognition",
      checkedAt: "2026-06-16",
    },
  ],
  faq: [
    {
      question: "Is WBU an accredited university?",
      answer:
        "Yes. WBU holds ASCAL maximum 6-year institutional accreditation (April 2024) — the highest possible rating in Albania. It operates under the Bologna Process, the same framework as universities across the EU.",
    },
    {
      question: "Do I need NEET or IELTS for WBU nursing?",
      answer:
        "No to both. NEET is not required. IELTS is not required — a Medium of Instruction (MOI) certificate from your English-medium Class 12 school is the standard route for Indian students.",
    },
    {
      question: "What is the MEDIAN Clinics Germany partnership?",
      answer:
        "MEDIAN Clinics, one of Germany's largest rehabilitation and acute care hospital networks, visited WBU and opened a direct employment project for WBU nursing and physiotherapy graduates — giving students a named employer pathway to Germany.",
    },
    {
      question: "What is the total 3-year cost?",
      answer:
        "Approximately €34,000–43,000 all-in (tuition + living + books + insurance + visa) — approximately INR 31–39 lakhs. Significantly lower than Canada (INR 1.3–1.6 crore), Australia (INR 80 lakh–1 crore), or UK (INR 60–80 lakh).",
    },
    {
      question: "When does clinical training start?",
      answer:
        "Professional Practice I begins in Semester 2 — the second half of Year 1. Students enter the American Hospitals Group and Hygeia from their first academic year.",
    },
    {
      question: "Can I work in Germany after graduating from WBU?",
      answer:
        "Yes — with German B2 proficiency and successful Anerkennungsgesetz (Recognition Act) credential assessment. WBU offers free German language courses. The MEDIAN Clinics partnership provides a direct employer pathway. German nursing salaries start at €30,000–50,000+/year.",
    },
  ],
  admissionsContent: {
    overview:
      "WBU accepts international applications through its International Admissions process. Primary intake is October. The process includes an academic interview with the Admissions Evaluation Commission (30% of ranking) alongside the academic record (70%). IELTS is not required. Students Traffic manages the complete application, MOI certificate guidance, interview preparation, and visa process.",
    eligibility: {
      intro: "Entry requirements for Indian students applying to WBU BSc Nursing:",
      items: [
        "Class 12 (10+2) passed — science background preferred (Biology and Chemistry strongly recommended)",
        "Minimum 70% overall in Class 12 (academic record = 70% of evaluation weightage)",
        "Admissions interview with WBU Evaluation Commission (30% of evaluation) — conducted in English, covers nursing motivation and academic background",
        "No IELTS required — Medium of Instruction (MOI) certificate from English-medium Class 12 school is accepted",
        "No NEET required",
        "Valid Indian passport",
      ],
    },
    admissionSteps: [
      "Assess eligibility with Students Traffic — honest evaluation of Class 12 marks and interview readiness",
      "Obtain MOI (Medium of Instruction) certificate from Class 12 school — confirming English as language of instruction on official letterhead",
      "Prepare documents: Class 10 and 12 certificates and marksheets, passport copy, photographs, MOI certificate",
      "Submit WBU International Admissions application at admissions.wbu.edu.al — Students Traffic manages this",
      "Complete the WBU Admissions Evaluation Commission interview (English, genuine — 30% of ranking)",
      "Receive and accept WBU Letter of Acceptance (LOA) — pay confirmation deposit",
      "Apply for Albania Type D Long-Stay Student Visa at Albanian Embassy, New Delhi (15–30 days processing)",
      "Fly to Tirana and apply for Temporary Residence Permit (TRP) within 30 days of arrival",
    ],
    documentsRequired: {
      educational: [
        "Class 10 certificate and marksheet",
        "Class 12 certificate and marksheet (science subjects — Biology, Chemistry preferred)",
        "Medium of Instruction (MOI) certificate from Class 12 school — official letterhead with seal and principal signature",
        "Passport copy — minimum 6 months validity",
        "Passport-size photographs per embassy specifications",
        "Any academic competition certificates or achievement records (relevant for Excellence Scholarship)",
      ],
      visa: [
        "WBU Letter of Acceptance (LOA) confirming programme, duration, and institution",
        "Completed Albania Type D visa application form",
        "Proof of accommodation in Albania",
        "Financial evidence — bank statements (last 3–6 months), parent income proof, or education loan sanction letter",
        "Medical health certificate from a registered Indian doctor",
        "Police clearance certificate from local police station",
        "No Objection Certificate (NOC) from school/college",
        "Valid international health insurance",
      ],
    },
    deadlinesNote:
      "Primary intake is October. Excellence Scholarship deadline is typically around March 31st — apply early. Apply 4–6 months in advance to allow time for interview, documents, and visa processing.",
    scholarshipInfo:
      "WBU offers Excellence Scholarships supported by the American Hospitals Group and Hygeia Hospital for students with high academic scores or national/international competition achievements. Apply specifically for the Excellence Scholarship at the time of admissions application.",
    licensingPathway: [
      "Albania nursing licence: apply to the Albanian Nursing Order post-graduation — direct employment possible at American Hospitals Group and Hygeia.",
      "Germany (MEDIAN Clinics pathway): achieve German B2 (WBU offers free German classes) → Anerkennungsgesetz credential recognition → work in Germany at €30,000–50,000+/year.",
      "UK (NMC): IELTS Academic 7.0 + CBT + OSCE → NMC registration → NHS employment.",
      "MSc Nursing at WBU: 5 specialisation profiles available for graduates wanting advanced qualification.",
    ],
  },
};

const program = {
  slug: "wbu-tirana-bscn",
  title: "BSc Nursing — Western Balkans University, Tirana",
  durationYears: 3,
  annualTuitionUsd: 5400,
  totalTuitionUsd: 16200,
  livingUsd: 7800,
  officialFeeCurrency: "EUR",
  officialAnnualTuitionAmount: 5000,
  officialTotalTuitionAmount: 15000,
  officialProgramUrl: "https://wbu.edu.al",
  medium: "English",
  intakeMonths: ["October"],
  feeVerifiedAt: "2026-06-16",
  fxRateDate: "2026-06-16",
  fxRateSourceUrl: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
  feeNotes:
    "Annual tuition for international BSc Nursing students is approximately €5,000/year. USD conversion at EUR 1 = USD 1.08 (June 2026). Living costs: €600/month × 12 = €7,200/year ≈ USD 7,800. Verify exact fee with WBU admissions annually.",
  teachingPhases: [
    {
      phase: "Year 1 — Foundation Sciences + First Clinical Placement",
      language: "English",
      details:
        "Semester 1: Histology (3 ECTS), Academic Writing (3), Human Anatomy I (6), Human Physiology I (5), Medical Biochemistry (4), Computer Science (3), Safety and Health at Work (3), Foreign Language I (3). Semester 2: Microbiology (6), Basics of Nursing I (6), Human Anatomy II (4), Human Physiology II (4), Nutrition and Dietetics (4), Foreign Language II (3), Professional Practice I (3) — first clinical placement at American Hospitals Group/Hygeia begins Semester 2.",
    },
    {
      phase: "Year 2 — Core Clinical Subjects + Second Clinical Placement",
      language: "English",
      details:
        "Semester 1: Pathological Anatomy (4), Pharmacology (5), Basics of Nursing II (6), Internal Medicine I and Nursing (5), Rational Applications of Medicines/Nursing in Operating Room (4), Dermatology and Nursing (3), General and Clinical Psychology (3). Semester 2: Obstetrics and Gynecology Nursing (5), Infectious Diseases Nursing (3), Nursing in Mental Health (5), Surgery I and Nursing (5), Internal Medicine II and Nursing (5), Stoma Care/Hemodialysis Nursing (4), Professional Practice II (3).",
    },
    {
      phase: "Year 3 — Advanced Specialisations + Final Clinical Placement + Thesis",
      language: "English",
      details:
        "Semester 1: Surgery II and Nursing (5), Health Ethics and Legislation (3), Public Health (3), Biostatistics (4), Internal Medicine III and Nursing (5), Medical Emergencies for Nurses (5), Paediatrics I and Nursing (5). Semester 2: Internal Medicine IV and Nursing (5), Paediatrics II and Nursing (5), Nursing Management (5), Geriatrics Nursing (5), Professional Practice III — 4 ECTS, Diploma Thesis/Final Exam (6 ECTS).",
    },
  ],
  yearlyCostBreakdown: [
    {
      yearLabel: "Year 1",
      tuitionUsd: 5400,
      hostelUsd: 2400,
      livingUsd: 5400,
      totalUsd: 13200,
      notes: "Year 1 includes setup costs (~€200–300 for SIM, registration). Clinical placement begins Semester 2.",
    },
    {
      yearLabel: "Year 2",
      tuitionUsd: 5400,
      hostelUsd: 2400,
      livingUsd: 5400,
      totalUsd: 13200,
      notes: "Active clinical rotations at American Hospitals Group and Hygeia. German/Italian language classes ongoing.",
    },
    {
      yearLabel: "Year 3",
      tuitionUsd: 5400,
      hostelUsd: 2400,
      livingUsd: 5400,
      totalUsd: 13200,
      notes: "Final extended clinical placement. Diploma Thesis in Semester 6. German B2 preparation intensifies.",
    },
  ],
  licenseExamSupport: [
    "German nursing recognition (Anerkennungsgesetz) — MEDIAN Clinics employment partnership for direct Germany pathway",
    "UK NMC international registration — CBT and OSCE preparation",
    "NCLEX-RN / NNAS Canada route — guidance available",
    "Albanian Nursing Order — domestic licence on graduation",
    "MSc Nursing at WBU — 5 specialisation profiles for advanced academic pathway",
  ],
};

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Upserting university: Western Balkans University...");

    const uniResult = await client.query(
      `INSERT INTO universities (
        country_id, slug, name, city, type, established_year, summary,
        featured, published, official_website,
        campus_lifestyle, city_profile, clinical_exposure,
        hostel_overview, indian_food_support, safety_overview, student_support,
        why_choose, things_to_consider, best_fit_for,
        teaching_hospitals, recognition_badges, recognition_links,
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
        clinical_exposure   = EXCLUDED.clinical_exposure,
        hostel_overview     = EXCLUDED.hostel_overview,
        indian_food_support = EXCLUDED.indian_food_support,
        safety_overview     = EXCLUDED.safety_overview,
        student_support     = EXCLUDED.student_support,
        why_choose          = EXCLUDED.why_choose,
        things_to_consider  = EXCLUDED.things_to_consider,
        best_fit_for        = EXCLUDED.best_fit_for,
        teaching_hospitals  = EXCLUDED.teaching_hospitals,
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
        true,
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
        teaching_phases, yearly_cost_breakdown, license_exam_support,
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
        license_exam_support           = EXCLUDED.license_exam_support,
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
        true,
      ]
    );

    console.log(`Programme upserted: ${program.slug}`);
    console.log("\nWBU Albania BScN seeded successfully.");
    console.log(`  Country  : Albania (id=${ALBANIA_ID})`);
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
