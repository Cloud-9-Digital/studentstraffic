/**
 * Seed European University of Tirana (UET) Bachelor of Nursing for Albania.
 * Source: Students Traffic UET Albania BScN Guide, June 2026.
 * Run: node scripts/seed-uet-albania-bscn.mjs
 *
 * This script:
 *   1. Upserts Albania into the countries table
 *   2. Upserts UET into the universities table
 *   3. Upserts the BN program offering (course ID 15 = BSc Nursing)
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const COURSE_BSC_NURSING_ID = 15;

// ---------------------------------------------------------------------------
// Country
// ---------------------------------------------------------------------------

const ALBANIA_COUNTRY = {
  slug: "albania",
  name: "Albania",
  region: "Europe",
  summary:
    "Albania is a rapidly modernising European country with a higher education system built on Bologna Process standards and EU-aligned quality frameworks. For Indian nursing students, Albania — specifically Tirana — offers an affordable European capital city with English-medium nursing programmes that are QAA-accredited and EQF Level 6, creating a direct pathway to nursing careers in Germany, Italy, and across Europe. Albania is an EU candidate country, not yet in the Schengen Area, and one of the most cost-effective destinations in Europe for international students.",
  whyStudentsChooseIt:
    "Indian students choose Albania primarily for the European nursing career pathway it unlocks. A nursing degree from an Albanian university is aligned with EU educational standards (EQF Level 6, 180 ECTS, Bologna compliant), making credential recognition in Germany and Italy significantly more streamlined than the IEN route followed by Indian-educated nurses. Tirana is one of Europe's cheapest capital cities — monthly living costs of €300–500 — making the total 3-year investment of INR 20–35 lakh substantially lower than comparable nursing programmes in Canada, the UK, or Australia. QAA (UK) institutional accreditation of leading Albanian universities gives families confidence in quality standards.",
  climate:
    "Mediterranean; hot dry summers (30–36°C), mild winters (5–15°C). Albania's Adriatic and Ionian coasts are reachable within 30–60 minutes from Tirana. Significantly more comfortable than Canadian or North European winters for Indian students.",
  currencyCode: "EUR",
  metaTitle:
    "BSc Nursing in Albania for Indian Students 2026 | UET Tirana, Fees & Career Pathways",
  metaDescription:
    "Complete guide to studying nursing in Albania for Indian students — UET Tirana, fees from €3,000/year, EQF Level 6 European degree, pathways to Germany and Italy, Albania student visa process.",
};

// ---------------------------------------------------------------------------
// University
// ---------------------------------------------------------------------------

const university = {
  slug: "european-university-of-tirana-bscn",
  name: "European University of Tirana (UET) — Bachelor of Nursing",
  city: "Tirana",
  type: "Private",
  establishedYear: 2006,
  officialWebsite: "https://uet.edu.al",
  summary:
    "The European University of Tirana (UET) is Albania's most internationally recognised private university, founded in 2006 and holding a prestigious five-year institutional accreditation from the UK's Quality Assurance Agency (QAA — reviewed June 2025). UET's 3-year Bachelor of Nursing (BN) is a 180 ECTS, EQF Level 6 programme delivered in English through the Faculty of Technical Medical Sciences. It is fully Bologna Process compliant and uses the University Medical Centre 'Mother Teresa' — Albania's national referral hospital — for clinical placements. For Indian students, the primary value is a European nursing degree at a fraction of Canadian or UK programme costs, creating a well-established pathway to nursing careers in Germany and Italy.",
  campusLifestyle:
    "UET's campus spans three modern urban buildings in the Xhura Complex, St. Xhanfize Keko, Tirana — a well-connected location within the Albanian capital. The university enrolls approximately 25,000 students across bachelor, master, and doctoral programmes, with 3,000–4,000 on the main campus. Nursing, Physiotherapy, and Medical Imaging Technology are offered through the Faculty of Technical Medical Sciences. The campus culture is young, diverse, and European in orientation — students from Italy, Kosovo, North Macedonia, the Middle East, and increasingly South Asia create a genuinely international environment. UET has 125+ global partner universities under Erasmus+, and career advising boards for each department include professionals from leading public and private institutions. The motto 'Maiora Premunt' — 'Greater Things Await' — reflects the university's ambition for its graduates.",
  cityProfile:
    "Tirana is Albania's capital and largest city (population ~800,000 metro), transformed over the last two decades from a grey post-communist city into a vibrant European capital with a growing café culture, modern university buildings, and an expanding international student community. It sits in a wide plain surrounded by mountains, with the Adriatic and Ionian seas reachable within 30–60 minutes by car. Cost of living is one of Europe's lowest — shared accommodation €100–200/month, groceries and food €160–260/month, city transport €10–20/month, total monthly budget €300–500. Tirana's Blloku neighbourhood is ideal for students — full of affordable cafes, restaurants, gyms, and bookshops. Italy is accessible by a 1.5-hour ferry ride from Durrës (Albania's main port, 35km from Tirana) — useful for travel and career networking. Direct flights from India via Dubai, Istanbul, or Rome, approximately 7–10 hours travel time.",
  clinicalExposure:
    "UET nursing students undertake supervised clinical placements primarily at the University Medical Centre 'Mother Teresa' (QSUT) — Albania's national referral hospital and largest healthcare complex, with 1,612 beds, nine hospital facilities, and approximately 200,000 emergency patients per year. Clinical training is distributed across Years 2 and 3 and totals over 30 ECTS: Clinical Practice 1 and 2 (8 ECTS, Year 2 — basic ward and healthcare settings with patient contact under supervision), Clinical Practice 3 and 4 (8 ECTS, Year 3 — advanced placements across medical, surgical, obstetric/gynaecological, paediatric, psychiatric, and emergency settings), and Clinical Practice I and III (14 ECTS combined, Year 3 — extended consolidation placements). Students also rotate through regional hospitals, polyclinics, and public health institutes in Tirana. Clinical attendance at 75% is mandatory and strictly enforced. Clinical instruction is in English; basic Albanian language exposure helps with patient interaction.",
  hostelOverview:
    "UET does not operate its own residential halls; students typically rent in Tirana's well-connected residential areas near the campus. Shared apartments in Tirana near the UET campus area cost €100–200 per person per month — among the cheapest student accommodation in any European capital. Popular neighbourhoods include Blloku, Myslym Shyri, and the areas near the Mother Teresa hospital complex. The university's international office provides pre-arrival accommodation guidance and connects new students with existing tenants. Students Traffic provides an arrival accommodation guide and shortlist for the campus area.",
  indianFoodSupport:
    "Tirana has supermarkets (Conad, Carrefour) that stock basmati rice, lentils, chickpeas, and spices familiar to Indian cooking. Several Indian restaurants and Asian food shops operate in central Tirana. Mediterranean cuisine — olive oil, vegetables, legumes, fresh produce — is broadly compatible with vegetarian Indian diets and readily available at local markets. The Indian student community in Albania, while small (estimated 150–300 across universities as of 2025–26), is active on WhatsApp groups and helps new arrivals source Indian groceries and cooking essentials. Diwali celebrations are organised by the Indian student community. Albanian locals are known for extraordinary hospitality and warmth toward international students.",
  safetyOverview:
    "Albania has a very low violent crime rate and is considered one of the safest countries in the Balkans. Tirana is a modern, busy, well-lit European capital. The concept of 'Besa' — sacred hospitality and protection of guests — is a genuine cultural value, and Indian students, including female students, report feeling safe in Tirana. The university area is accessible and well-served by city transport. Standard urban precautions apply (stay aware late at night, use reputable transport). No exceptional safety concerns have been reported by Indian nursing students in Tirana.",
  studentSupport:
    "UET's international office provides orientation, immigration guidance for the residence permit process, and academic advising. Erasmus+ student networks are active on campus and support international student integration. UET peer mentoring from senior international students is available informally. Students Traffic provides end-to-end support: eligibility assessment, complete UET application management, MEA apostille coordination for Indian documents, Albania Type D student visa application, Tirana accommodation guide, pre-departure briefing, language training pathway planning (German/Italian for European career goals), and post-graduation credential recognition roadmap for Germany, Italy, or the UK.",
  whyChoose: [
    "EQF Level 6 European nursing degree (180 ECTS, Bologna compliant) — the most important credential for accessing the German and Italian nursing registration pathways, which are far more streamlined for EU-system graduates than for Indian-educated IENs.",
    "QAA (UK) five-year institutional accreditation — the most rigorous independent quality review available to a non-UK university, with the most recent review conducted in June 2025. Recognised by Indian banks and loan officers as a key quality credential for education loan files.",
    "University Medical Centre 'Mother Teresa' (QSUT) for clinical placements — Albania's national referral hospital with 1,612 beds and 200,000+ emergency patients per year. Real supervised patient care, not simulation only.",
    "3-year programme duration — a year shorter than the 4-year Canadian BScN, reducing total investment and accelerating time to European nursing employment.",
    "Total 3-year investment of INR 20–35 lakh — 60–70% lower than comparable Canadian or UK nursing programmes (INR 80–130 lakh), comparable to better Indian private nursing colleges but with a European degree and European career access.",
    "Erasmus+ partner with 125+ global university agreements — creates genuine opportunities for semester exchange, European networking, and access to partner university resources during the programme.",
    "Well-established pathway to Germany and Italy — Albanian nursing graduates working in German and Italian hospitals is a documented reality, not a theoretical possibility. The credential recognition process for EU-system graduates is significantly faster than for IENs.",
  ],
  thingsToConsider: [
    "Language requirement for European work: Germany requires German B2 proficiency for clinical nursing roles; Italy requires Italian B2. These language skills must be built during or after the programme — they are non-negotiable for patient safety reasons. Start German or Italian from Year 1 in Tirana, where language classes are affordable.",
    "Albania is not in the Schengen Area. Your Albanian student visa and residence permit do not grant automatic access to Schengen countries. A separate Schengen visa is needed for travel to France, Germany, Italy, etc. Italy is accessible by ferry, but EU travel requires additional planning.",
    "UET is a private, for-profit university and is not in the QS or THE global top-500 rankings. Its value is in QAA accreditation, Bologna compliance, and the European career pathway — not research prestige. Evaluate on those terms.",
    "Canada is not the natural target destination for a UET graduate. The NNAS internationally educated nurse pathway for Canada has a 51.6% first-time NCLEX pass rate and takes 12+ months. If Canada is the primary goal, a Canadian nursing programme gives a faster and more certain route.",
    "INC recognition in India: UET graduates who want to practise nursing in India must apply to the Indian Nursing Council for recognition of the foreign degree. The EQF Level 6 degree should be eligible, but verify current INC procedures before committing if India-return practice is the plan.",
    "Part-time work: Indian students on an Albanian Type D student visa are generally not permitted to work during studies. The total cost is low enough that this is manageable, but plan your finances accordingly.",
  ],
  bestFitFor: [
    "Indian Class 12 students (Physics, Chemistry, Biology, English — 50%+ overall) who want a European nursing degree and are targeting nursing careers in Germany, Italy, or other EU countries.",
    "Students and families who want the European nursing career pathway but cannot fund a Canadian or UK programme (INR 80–130 lakh) and are looking for a quality European option at INR 20–35 lakh total.",
    "Students willing to learn German or Italian alongside their nursing studies — the language training is the core investment that converts the UET degree into a German or Italian nursing career.",
    "GNM diploma holders or students with prior university credits in health sciences who may qualify for advanced standing or credit recognition, potentially shortening the programme.",
    "Families who want a genuinely European city and cultural experience — Tirana is a safe, affordable, Mediterranean capital with proximity to Italy, Greece, and the broader European travel network.",
  ],
  teachingHospitals: [
    "University Medical Centre 'Mother Teresa' (QSUT) — National Referral Hospital, Tirana (1,612 beds)",
    "Regional Hospitals and Polyclinics, Tirana",
    "Institute of Public Health, Albania",
    "Specialist wards — neurology, psychiatry, surgery, orthopaedics, obstetrics, paediatrics, ICU/emergency",
  ],
  recognitionBadges: [
    "ASCAL Accredited — Albanian Agency for Quality Assurance in Higher Education",
    "QAA (UK) — Five-Year Institutional Accreditation (reviewed June 2025)",
    "EQF Level 6 — European Qualifications Framework",
    "180 ECTS — Bologna Process Compliant",
    "Erasmus+ Partner — 125+ Global University Agreements",
    "EU Candidate Country — nursing aligned with Directive 2005/36/EC",
  ],
  recognitionLinks: [
    {
      label: "UET Official Website",
      url: "https://uet.edu.al",
    },
    {
      label: "UET International Admissions",
      url: "https://international.uet.edu.al",
    },
    {
      label: "QAA — UK Quality Assurance Agency",
      url: "https://www.qaa.ac.uk",
    },
    {
      label: "ASCAL — Albanian Quality Assurance Agency",
      url: "https://www.ascal.al",
    },
  ],
  similarUniversitySlugs: [],
  lastVerifiedAt: "2026-06-15",
  researchSources: [
    {
      label: "Students Traffic UET Albania BScN Guide — June 2026",
      url: "https://uet.edu.al",
      kind: "official-university",
      checkedAt: "2026-06-15",
    },
    {
      label: "UET International Admissions Portal",
      url: "https://international.uet.edu.al",
      kind: "official-program",
      checkedAt: "2026-06-15",
    },
    {
      label: "QAA Institutional Review — UET",
      url: "https://www.qaa.ac.uk",
      kind: "recognition",
      checkedAt: "2026-06-15",
    },
  ],
  faq: [
    {
      question: "Is UET Albania a recognised university?",
      answer:
        "Yes. UET is fully accredited by ASCAL (Albania's national quality assurance agency) and holds a five-year institutional accreditation from the UK's QAA (Quality Assurance Agency), with the most recent review conducted in June 2025. Its Bachelor of Nursing is EQF Level 6 and fully Bologna compliant.",
    },
    {
      question: "Is the UET nursing degree valid in Germany and Italy?",
      answer:
        "The UET Bachelor of Nursing (EQF Level 6, Bologna compliant) is eligible for credential recognition in Germany and Italy through the respective nursing regulatory bodies. Germany requires German B2 language proficiency and a deficiency assessment by the relevant state authority. Italy requires Italian B2 and application through FNOPI — typically taking approximately 90 days. Many Albanian nursing graduates work in German and Italian hospitals. This is a well-established pathway, not a theoretical one.",
    },
    {
      question: "Do I need NEET for the UET nursing programme?",
      answer:
        "No. UET does not require NEET. NEET is an Indian examination for Indian domestic medical and nursing college admission. European universities set their own entry requirements, which for UET nursing means Class 12 with Physics, Chemistry, Biology, and English at 50%+ overall.",
    },
    {
      question: "What is the total cost of studying nursing at UET for 3 years?",
      answer:
        "The total 3-year investment is approximately €22,000–38,000 (INR 20–35 lakh at June 2026 rates), covering tuition of €9,000–15,000 plus living costs of €13,000–23,000 over three years. Monthly living costs in Tirana are €300–500 — one of Europe's lowest. This is 60–70% less than comparable Canadian or UK nursing programmes.",
    },
    {
      question: "Can I work in Canada after graduating from UET?",
      answer:
        "Possible, but it is not the natural target destination for a UET graduate. You would need to go through NNAS (National Nursing Assessment Service) as an internationally educated nurse — a process that takes 12+ months with a 51.6% first-time NCLEX pass rate. If Canada is your primary career goal, a Canadian nursing programme gives a significantly faster and more certain route. Germany and Italy are the natural target destinations for UET Albania graduates.",
    },
    {
      question: "Is Albania safe for Indian students?",
      answer:
        "Albania has a very low violent crime rate and is considered one of the safest countries in the Balkans. Tirana is a modern, well-lit European capital. Albanian culture places extraordinary value on hospitality (the concept of 'Besa'), and Indian students — including female students — report feeling safe and welcomed. Standard urban precautions apply, but no exceptional safety concerns have been reported by Indian nursing students in Tirana.",
    },
    {
      question: "What visa do I need to study at UET?",
      answer:
        "A Type D Long-Stay Student Visa from the Albanian Embassy in New Delhi. Required for the full 3-year programme. Processing typically takes 4–8 weeks; apply 2–3 months before your intake. After arrival, you must apply for an Albanian Residence Permit within 30 days — UET's international office assists with this. Your Albanian documents do not give Schengen access; travel to EU countries requires a separate Schengen visa.",
    },
    {
      question: "How is the BN programme structured at UET?",
      answer:
        "The Bachelor in Nursing is a 3-year, 180 ECTS programme (60 ECTS per year). It covers foundation sciences (31 ECTS — human biology, psychology, sociology, statistics), core nursing (96 ECTS — anatomy, physiology, pharmacology, internal medicine, surgical nursing, obstetrics, paediatrics, psychiatric nursing, emergency care), interdisciplinary courses (23 ECTS — laboratory medicine, ethics, public health, biochemistry), clinical practice across Years 2 and 3 (over 30 ECTS in total at QSUT and affiliated hospitals), and a final diploma thesis or comprehensive examination (7 ECTS).",
    },
  ],
  admissionsContent: {
    overview:
      "UET accepts direct applications from Indian students after Class 12 (10+2). No NEET, SAT, or IELTS is required. Applications are submitted online via international.uet.edu.al. The primary intake is October; a February intake is available for some programmes. Students Traffic manages the complete application process including document preparation, MEA apostille coordination, and embassy visa application.",
    eligibility: {
      intro:
        "Entry requirements for Indian students applying to the UET Bachelor of Nursing:",
      items: [
        "Class 12 (10+2) passed with Physics, Chemistry, Biology, and English as core subjects",
        "Minimum 50% overall in Class 12 (competitive applicants typically have 60%+)",
        "IELTS not mandatory — English-medium Class 12 marksheets are generally accepted as proof of proficiency",
        "NEET not required — UET sets its own entry criteria",
        "Valid Indian passport with at least 6 months validity beyond entry",
      ],
    },
    admissionSteps: [
      "Assess eligibility with Students Traffic — free and no commitment",
      "Prepare documents: Class 12 marksheets and certificates notarised and apostilled by MEA India",
      "Submit online application at international.uet.edu.al",
      "Receive UET Admission Letter",
      "Apply for Albania Type D Long-Stay Student Visa at Albanian Embassy, New Delhi (4–8 weeks processing)",
      "Fly to Tirana (via Dubai, Istanbul, or Rome); October intake",
      "Register at UET and apply for Residence Permit within 30 days of arrival",
    ],
    documentsRequired: {
      educational: [
        "Class 12 marksheet — notarised and apostilled by MEA India",
        "Class 12 passing certificate — notarised and apostilled by MEA India",
        "Passport copy — minimum 6 months validity",
        "Passport-size photographs",
        "Medical certificate confirming freedom from contagious diseases",
      ],
      visa: [
        "UET Admission Letter confirming programme name, duration, and institutional recognition",
        "Proof of accommodation (UET letter or signed lease)",
        "Proof of financial means — bank statements or education loan sanction letter (approx. €4,800–7,200 for 12 months living + tuition)",
        "Valid international health insurance for duration of stay",
        "Albania Type D visa application form",
        "Visa fee (~€30–50 — confirm with Albanian Embassy)",
      ],
    },
    deadlinesNote:
      "Primary intake is October. Apply 4–6 months in advance (April–June for October entry) to allow time for document apostille (4–6 weeks), visa processing (4–8 weeks), and pre-departure preparation.",
    scholarshipInfo:
      "UET offers merit-based scholarships to international students. Students with strong Class 12 marks (80%+) should specifically request scholarship eligibility and partial fee waivers at the time of application. Erasmus+ funding may be available for eligible mobility programmes during the degree.",
    licensingPathway: [
      "Upon graduation, apply for Albanian nursing licence from Albania's Order of Nurses and Midwives to practise in Albanian healthcare settings.",
      "For Germany: achieve German B2 proficiency (begin from Year 1 in Tirana), then apply for nursing credential recognition through the relevant German state authority — typically 6–18 months post-graduation.",
      "For Italy: achieve Italian B2 proficiency, apply through FNOPI (Italian National Federation of Nursing Professions) — typically ~90 days once documents are submitted.",
      "For UK NMC: international registration route — English proficiency (OET/IELTS), Computer-Based Test (CBT), and Objective Structured Clinical Examination (OSCE) required.",
      "For Canada/USA (NCLEX-RN): NNAS or CGFNS internationally educated nurse pathway — longer process, not the primary recommended route for UET graduates.",
    ],
  },
  programs: [
    {
      slug: "uet-tirana-bscn",
      title: "Bachelor of Nursing (BN) — European University of Tirana",
      durationYears: 3,
      annualTuitionUsd: 4300,
      totalTuitionUsd: 12900,
      livingUsd: 6500,
      officialFeeCurrency: "EUR",
      officialAnnualTuitionAmount: 4000,
      officialTotalTuitionAmount: 12000,
      officialProgramUrl:
        "https://uet.edu.al/programet/bachelor-i-shkencave-ne-infermieri/",
      medium: "English",
      published: true,
      intakeMonths: ["October", "February"],
      feeVerifiedAt: "2026-06-15",
      fxRateDate: "2026-06-15",
      fxRateSourceUrl:
        "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
      feeNotes:
        "Annual tuition for international students is approximately €3,000–5,000/year. Midpoint of €4,000 used for USD conversion at EUR 1 = USD 1.08 (June 2026). Exact nursing-specific fee should be confirmed with UET admissions annually. Monthly living costs in Tirana: €300–500 all-in; USD 6,500/year used as conservative annual living estimate.",
      teachingPhases: [
        {
          phase: "Year 1 — Foundation Sciences and Core Nursing Basics",
          language: "English",
          details:
            "Foundation courses (31 ECTS): Human Biology, Introduction to Psychology, Academic Writing and Research Methods, Introduction to Sociology, Statistics. Core nursing introduction: Anatomy 1+2, Basics of Nursing, Histology and Anatomic Pathology, Medical Biochemistry. Medical Terminology and Academic English. Laboratory and simulation-based learning for foundational nursing skills.",
        },
        {
          phase: "Years 2–3 — Clinical Sciences and Supervised Hospital Practice",
          language: "English",
          details:
            "Core clinical nursing courses: Physiology, Pathologic Physiology, Principles of Internal Medicine, Pharmacology, Infectious Disease and Nursing. Clinical Practice 1 and 2 (8 ECTS, Year 2) at QSUT and affiliated hospitals — supervised patient care in basic ward settings. Year 3: Obstetrics/Gynaecology, Paediatrics, Surgery/Orthopaedics/Traumatology, Neurology/Psychiatry, Emergency Care and Anaesthesia-Resuscitation. Clinical Practice 3 and 4 (8 ECTS) plus Clinical Practice I and III (14 ECTS) — advanced specialty rotations. Final Diploma Thesis (9,000–10,000 words) or Comprehensive Examination (7 ECTS).",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 4300,
          hostelUsd: 2100,
          livingUsd: 4200,
          totalUsd: 10600,
          notes:
            "Setup costs (winter clothing, SIM, arrival essentials) add ~$300–500 in Year 1. Accommodation in shared Tirana apartment ~€150–180/month.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 4300,
          hostelUsd: 2100,
          livingUsd: 4200,
          totalUsd: 10600,
          notes:
            "Clinical practice begins in Year 2. City transport to QSUT included in living estimate.",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 4300,
          hostelUsd: 2100,
          livingUsd: 4200,
          totalUsd: 10600,
          notes:
            "Advanced clinical rotations. Language classes (German/Italian) for European career pathway are an additional €500–1,000/year if enrolled in Tirana.",
        },
      ],
      licenseExamSupport: [
        "German nursing credential recognition (Anerkennungsberatung) — pathway briefing from Year 1",
        "Italian FNOPI registration pathway guidance",
        "UK NMC international registration — CBT and OSCE preparation",
        "NCLEX-RN / NNAS Canada route — guidance available, not primary pathway",
        "Albanian Order of Nurses and Midwives — domestic licence on graduation",
      ],
      featured: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  const client = await pool.connect();

  try {
    console.log("🌍 Upserting country: Albania…");

    const countryResult = await client.query(
      `
      INSERT INTO countries (
        slug, name, region, summary, why_students_choose_it,
        climate, currency_code, meta_title, meta_description,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name                  = EXCLUDED.name,
        region                = EXCLUDED.region,
        summary               = EXCLUDED.summary,
        why_students_choose_it = EXCLUDED.why_students_choose_it,
        climate               = EXCLUDED.climate,
        currency_code         = EXCLUDED.currency_code,
        meta_title            = EXCLUDED.meta_title,
        meta_description      = EXCLUDED.meta_description,
        updated_at            = NOW()
      RETURNING id
      `,
      [
        ALBANIA_COUNTRY.slug,
        ALBANIA_COUNTRY.name,
        ALBANIA_COUNTRY.region,
        ALBANIA_COUNTRY.summary,
        ALBANIA_COUNTRY.whyStudentsChooseIt,
        ALBANIA_COUNTRY.climate,
        ALBANIA_COUNTRY.currencyCode,
        ALBANIA_COUNTRY.metaTitle,
        ALBANIA_COUNTRY.metaDescription,
      ]
    );

    const albaniaId = countryResult.rows[0].id;
    console.log(`✓ Albania upserted (id=${albaniaId})`);

    console.log("\n🏫 Upserting university: European University of Tirana…");

    const uniResult = await client.query(
      `
      INSERT INTO universities (
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
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23,
        $24, $25,
        $26, $27, $28,
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
      RETURNING id
      `,
      [
        albaniaId,
        university.slug,
        university.name,
        university.city,
        university.type,
        university.establishedYear,
        university.summary,
        true,  // featured
        true,  // published
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
    console.log(`✓ University upserted: ${university.name} (id=${universityId})`);

    console.log("\n📚 Upserting programme offering…");

    const prog = university.programs[0];
    await client.query(
      `
      INSERT INTO program_offerings (
        university_id, course_id, slug, title,
        duration_years, annual_tuition_usd, total_tuition_usd, living_usd,
        official_fee_currency, official_annual_tuition_amount, official_total_tuition_amount,
        official_program_url, medium, published,
        teaching_phases, yearly_cost_breakdown, license_exam_support,
        intake_months, fee_verified_at, fx_rate_date, fx_rate_source_url,
        fee_notes, featured,
        updated_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14,
        $15, $16, $17,
        $18, $19, $20, $21,
        $22, $23,
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title                         = EXCLUDED.title,
        duration_years                = EXCLUDED.duration_years,
        annual_tuition_usd            = EXCLUDED.annual_tuition_usd,
        total_tuition_usd             = EXCLUDED.total_tuition_usd,
        living_usd                    = EXCLUDED.living_usd,
        official_fee_currency         = EXCLUDED.official_fee_currency,
        official_annual_tuition_amount = EXCLUDED.official_annual_tuition_amount,
        official_total_tuition_amount = EXCLUDED.official_total_tuition_amount,
        official_program_url          = EXCLUDED.official_program_url,
        medium                        = EXCLUDED.medium,
        published                     = EXCLUDED.published,
        teaching_phases               = EXCLUDED.teaching_phases,
        yearly_cost_breakdown         = EXCLUDED.yearly_cost_breakdown,
        license_exam_support          = EXCLUDED.license_exam_support,
        intake_months                 = EXCLUDED.intake_months,
        fee_verified_at               = EXCLUDED.fee_verified_at,
        fx_rate_date                  = EXCLUDED.fx_rate_date,
        fx_rate_source_url            = EXCLUDED.fx_rate_source_url,
        fee_notes                     = EXCLUDED.fee_notes,
        featured                      = EXCLUDED.featured,
        updated_at                    = NOW()
      `,
      [
        universityId,
        COURSE_BSC_NURSING_ID,
        prog.slug,
        prog.title,
        prog.durationYears,
        prog.annualTuitionUsd,
        prog.totalTuitionUsd,
        prog.livingUsd,
        prog.officialFeeCurrency,
        prog.officialAnnualTuitionAmount,
        prog.officialTotalTuitionAmount,
        prog.officialProgramUrl,
        prog.medium,
        true,
        JSON.stringify(prog.teachingPhases),
        JSON.stringify(prog.yearlyCostBreakdown),
        JSON.stringify(prog.licenseExamSupport),
        prog.intakeMonths,
        prog.feeVerifiedAt,
        prog.fxRateDate,
        prog.fxRateSourceUrl,
        prog.feeNotes,
        true,
      ]
    );

    console.log(`✓ Programme upserted: ${prog.slug}`);
    console.log("\n✅ UET Albania BScN seeded successfully.");
    console.log(`   Country: Albania (id=${albaniaId})`);
    console.log(`   University: ${university.name} (id=${universityId})`);
    console.log(`   Programme: ${prog.slug}`);
    console.log(`   Course: BSc Nursing (id=${COURSE_BSC_NURSING_ID})`);
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
