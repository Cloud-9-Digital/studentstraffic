/**
 * Seed SMK College of Applied Sciences — Professional Bachelor in Nursing, Lithuania.
 * Source: Students Traffic SMK Lithuania Nursing Guide, June 2026.
 * Run: node scripts/seed-smk-lithuania-bscn.mjs
 *
 * Prerequisites: Lithuania must already exist in the countries table.
 * Run seed-lsmu-lithuania-bscn.mjs first if it hasn't been run.
 *
 * This script:
 *   1. Looks up Lithuania from the countries table
 *   2. Upserts SMK College into the universities table
 *   3. Upserts the Professional Bachelor in Nursing programme offering (course ID 15)
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const COURSE_BSC_NURSING_ID = 15;

// ---------------------------------------------------------------------------
// University
// ---------------------------------------------------------------------------

const university = {
  slug: "smk-college-applied-sciences-bscn",
  name: "SMK College of Applied Sciences — Professional Bachelor in Health Sciences (General Practice Nurse)",
  city: "Vilnius",
  type: "Private",
  establishedYear: 1994,
  officialWebsite: "https://smk.lt",
  summary:
    "SMK College of Applied Sciences is Lithuania's largest private higher education institution, founded in Klaipeda in 1994 and now operating campuses in Vilnius, Kaunas, and Klaipeda. It educates approximately 4,500 students including 1,000+ international students from 50+ countries. The 3.5-year Professional Bachelor in Health Sciences (General Practice Nurse) is a 210 ECTS, fully English-taught programme accredited at EQF Level 6 — the same framework level as a university bachelor's degree — and designed to meet EU Directive 2005/36/EC minimum training requirements, enabling graduates to apply for nursing registration across all 27 EU member states. Annual tuition is EUR 4,400, with a 40% Talent Scholarship available in Year 1 for students with a Class 12 average of 85%+ and a B2 English certificate. Unlike LSMU, SMK has no Biology or Chemistry entrance test — admission is based on a motivation interview and document review. Two intakes per year (September and February), three campus choices (Vilnius, Kaunas, Klaipeda), and accessible entry requirements make SMK a compelling route to an EU nursing qualification for Indian students who want flexibility and affordability.",
  campusLifestyle:
    "SMK College of Applied Sciences operates three campuses across Lithuania — Vilnius (Kalvariuju g. 137E, the main campus), Kaunas, and Klaipeda — giving Indian nursing students a genuine choice of study city. Each campus features modern classrooms, multimedia lecture halls, libraries, student cafeterias, and recreation spaces including dance studios. The Moodle LMS and Classter digital management platforms support all coursework, grades, and academic management, with an e-library accessible to all enrolled students. SMK's 'Hey Ready' dedicated career centre connects students with Lithuanian and international employers during and after studies. A Psychological Counselling Service is available for all students — particularly valuable for international students adjusting to a new country and academic system. Academic counsellors are assigned to each student for programme navigation. The structured first-week induction programme for international students includes city tours, campus orientation, social events, and Lithuanian cultural briefings. Erasmus+ agreements with 100+ partners in 25 countries create funded semester-abroad opportunities across the programme. With 1,000+ international students from 50+ countries, SMK campuses are genuinely multicultural — English is the common language of the international student body. The Indian student community is largest at the Vilnius campus, where Indian restaurants, grocery stores, and cultural spaces are most accessible.",
  cityProfile:
    "SMK gives nursing students a choice of three distinctly different Lithuanian cities — all three campuses deliver the same curriculum and the same Professional Bachelor qualification. Vilnius (population ~590,000) is Lithuania's capital — a UNESCO World Heritage Old Town city with a booming tech startup scene, the country's best job market for part-time work, the largest Indian community in Lithuania (Indian restaurants, grocery stores, Sikh and Hindu communities), and Vilnius International Airport with Ryanair and Wizz Air connections across Europe. Monthly costs: EUR 550–850. Kaunas (population ~290,000) is Lithuania's second-largest city and a university hub, ranked #142 in QS Best Student Cities 2026 — the most affordable of the three SMK cities with a strong student-city culture. Monthly costs: EUR 450–700. Klaipeda (population ~155,000) is Lithuania's only Baltic seaport — the quietest, smallest, and most affordable city, offering a distinctive coastal study environment close to the Curonian Spit (UNESCO World Heritage). Monthly costs: EUR 400–650. All three cities are Schengen Area locations: the Lithuanian TRP allows free travel across 26 European countries, with budget flights from Vilnius and Kaunas airports to London, Berlin, Barcelona, Dublin, Oslo, and beyond at EUR 15–50.",
  clinicalExposure:
    "SMK's General Practice Nursing programme requires 22 weeks (approximately 5.5 months) of supervised clinical training in real Lithuanian healthcare institutions — distributed across all 7 semesters rather than concentrated at the end. Clinical placement settings progress through the programme: primary healthcare (outpatient clinics, family medicine practices, community health centres); secondary hospitals (medical and surgical wards, emergency departments, specialist outpatients); tertiary care (oncology, neurology, intensive care, cardiology — depending on campus city and placement programme); nursing homes and long-term care (geriatric and palliative nursing); mental health institutions (psychiatric nursing, inpatient and community settings); rehabilitation centres (physical and occupational therapy, post-surgical); children's healthcare (paediatric wards, development centres, school health); and social service organisations (home nursing, community care). Before entering live clinical environments, SMK nursing students build procedural skills in simulation and anatomy labs — anatomical models, clinical scenario training, and procedural practice — so students enter hospital placements already prepared. The three-campus structure means students at different cities access different hospital systems and healthcare environments, providing geographic breadth to clinical experience.",
  hostelOverview:
    "SMK does not operate dedicated university dormitories for nursing students — accommodation is the student's responsibility, with SMK providing guidance and assistance for those who need help. Shared room rental costs by city: Vilnius EUR 200–400/month per person; Kaunas EUR 150–300/month; Klaipeda EUR 130–250/month — all among the most affordable private rental markets in the EU. Most Indian students share 2–3 person apartments to keep costs down. SMK assists incoming international students with accommodation search guidance, neighbourhood recommendations, and contacts. Students Traffic provides city-specific accommodation guides and connects new SMK students with existing Indian students at their chosen campus before arrival.",
  indianFoodSupport:
    "The Indian food and grocery situation varies by campus city. Vilnius: the best Indian infrastructure in Lithuania — dedicated Indian restaurants, grocery stores stocking basmati rice, lentils, chickpeas, spices, and cooking essentials, with Hindu and Sikh communities present. Kaunas: Indian grocery basics (rice, lentils, spices) in major supermarkets and growing Asian stores; Vilnius is 1 hour by train for more variety and Indian restaurants. Klaipeda: Indian staples available in supermarkets; Kaunas reachable in 1.5–2 hours by bus, Vilnius accessible for larger shopping trips. Most Indian students at all three campuses cook at home in shared apartments — the most budget-friendly approach at EUR 120–200/month for groceries. Students Traffic connects all enrolled SMK students with the Indian student community at their chosen campus before arrival.",
  safetyOverview:
    "Lithuania is an EU and NATO member state with stable democratic governance and a very low violent crime rate — consistent with European safety standards. All three SMK campus cities are safe for international students. Vilnius is a modern, well-lit European capital with excellent public transport and a large international population. Kaunas is a university city with an established and active international student community. Klaipeda is a smaller, quiet Baltic port city. Indian students — including female students — at all three SMK campuses consistently report feeling safe and welcomed. The 1,000+ international student presence (from 50+ countries) creates a normalised, inclusive environment. Standard urban precautions apply (stay aware late at night, use reputable transport), but no exceptional safety concerns have been reported.",
  studentSupport:
    "SMK provides comprehensive international student support including a structured first-week induction programme, assigned academic counsellors for each student, a Psychological Counselling Service, and the 'Hey Ready' career centre for employment connections. TRP and immigration guidance is provided upon admission — SMK issues the mediation number required to book VFS Global appointments for Indian students, and provides enrolled students with TRP renewal guidance annually. SMK's Moodle LMS, e-library, and Classter digital management platform support academic progress throughout the programme. Students Traffic provides end-to-end support: eligibility and scholarship assessment (40% talent scholarship eligibility check), motivation interview coaching with SMK-specific mock sessions, complete application management through apply.smk.lt, campus city selection guidance (Vilnius vs Kaunas vs Klaipeda), MIGRIS registration and VFS Global appointment coordination, accommodation search assistance for all three cities, pre-departure briefing (winter clothing list, arrival checklist, Indian community contacts), and annual TRP renewal reminders.",
  whyChoose: [
    "No Biology or Chemistry entrance test — admission is based entirely on a motivation interview and document review. Any Indian Class 12 graduate with 50%+ overall and IELTS 5.5+ (or equivalent) is eligible, regardless of science subject grades or NEET history. This makes SMK accessible to the full range of Indian students — arts, commerce, or science backgrounds — without an academic subject barrier.",
    "40% Talent Scholarship in Year 1 — for students with a Class 12 average of 85%+ and a B2 English certificate, SMK offers a genuine 40% reduction in first-year tuition (EUR 4,400 → approximately EUR 2,640), with further performance-based scholarships of up to 50% available in Years 2 and 3 for outstanding students.",
    "Three campus cities — Vilnius (capital, best job market, largest Indian community), Kaunas (most affordable, QS-ranked student city), Klaipeda (Baltic coast, quietest environment). All three deliver the identical curriculum and the same EQF Level 6 Professional Bachelor qualification. The choice is lifestyle and budget, not academic quality.",
    "Two intakes per year — Fall (September 1) and Spring (February 1). Students who miss the July 1 Fall deadline can plan for the February intake (December 1 deadline) without waiting a full academic year. This flexibility is rare in Lithuanian nursing education.",
    "3.5-year duration — 6 months shorter than LSMU's 4-year BSc, and EUR 1,800 less in total tuition. Earlier graduation means earlier EU nursing registration, earlier entry into the European workforce, and earlier financial return on the educational investment.",
    "EQF Level 6 Professional Bachelor — the same European Qualifications Framework level as a university bachelor's degree. Accepted for Master's programme admission across Lithuania (including LSMU's MSc programmes) and across the EU. Eligible for EU Directive 2005/36/EC professional recognition as a General Nurse across all 27 EU member states.",
    "22 weeks of clinical training in real Lithuanian healthcare institutions — distributed across all 7 semesters, covering primary care, hospitals, mental health, geriatric, paediatric, rehabilitation, and community settings in the campus city. Not a simulation-only programme.",
    "Strong international student community — 1,000+ international students from 50+ countries create a genuinely multicultural study environment, with English as the working language and Erasmus+ opportunities at 100+ partner universities in 25 countries.",
  ],
  thingsToConsider: [
    "Professional Bachelor vs BSc distinction: Both are EQF Level 6 and both qualify graduates as General Practice Nurses under EU Directive 2005/36/EC. However, some individual hospitals in Germany or the Netherlands have historically had preferences for university-issued BSc degrees over college-issued Professional Bachelor degrees when selecting between otherwise comparable candidates. This is changing as EU recognition standardises — but students targeting highly competitive healthcare institutions in Germany should factor this into their decision between SMK and LSMU.",
    "No WHO Collaborating Centre status: LSMU's Faculty of Nursing is one of only 5 WHO Collaborating Centres for Nursing in Europe — a designation that carries weight with Indian education lenders and the INC. SMK does not hold this designation. For families where WHO status matters for the loan file or INC application, LSMU's WHO designation is a meaningful differentiator.",
    "No dedicated university dormitory: SMK does not operate university hostel accommodation — students must arrange private shared apartments in the campus city. This adds an accommodation search step and means housing is not guaranteed on application. SMK provides guidance, but the responsibility is the student's. Budget Kaunas EUR 150–300/month, Vilnius EUR 200–400/month, Klaipeda EUR 130–250/month.",
    "German language is the primary career preparation item: The EU Professional Bachelor qualification opens the pathway to Germany, but B2 German proficiency is the non-negotiable practical requirement for clinical nursing employment. Begin German from Semester 1 of the programme — 3.5 years is enough time to reach B2 with consistent effort. The degree alone does not guarantee a German nursing position.",
    "40% scholarship criteria are strict: The 85% Class 12 average, B2 English certificate, scholarship assignment, and August 20 deadline (Fall) or January 20 (Spring) are all hard requirements. Late document submissions are not reviewed. Confirm eligibility with Students Traffic before applying, not after.",
    "Private college, not a public university: SMK is Lithuania's largest private college of applied sciences — not a public university. For Indian families, some education lenders and INC assessments may apply additional scrutiny to private institution credentials vs a public university like LSMU. Students Traffic advises families on this distinction as part of the programme selection.",
    "Cold Baltic winters in all three cities: -5 to -15°C from November through March. Klaipeda is marginally milder (Baltic Sea proximity) but still requires full winter preparation. Budget INR 10,000–20,000 for quality winter clothing in Year 1 — this is not optional.",
  ],
  bestFitFor: [
    "Indian Class 12 students with 50%+ overall who want an EU nursing qualification without sitting a Biology or Chemistry entrance test — the motivation interview is the gateway, not academic subject scores or NEET history.",
    "Students with a Class 12 average of 85%+ and an IELTS 6.0 (or B2 equivalent) certificate who want to combine the 40% Year 1 scholarship with a 3.5-year EU nursing degree — making SMK competitively priced even against LSMU in the first year.",
    "Students who value campus city flexibility — choosing Vilnius for the Indian community and job market, Kaunas for the most affordable student lifestyle, or Klaipeda for a quieter Baltic coast environment — rather than being fixed to a single location.",
    "Students who need the Spring (February) intake option — missed the Fall deadline, took a gap year, completed IELTS preparation after results, or are finishing a vocational qualification. SMK's February start is one of very few such opportunities in Lithuanian nursing education.",
    "Students targeting a 3.5-year programme to enter the European nursing workforce 6 months earlier than a 4-year BSc — earlier graduation, earlier EU nursing registration, earlier start on the German B2 → Anerkennung → employment pathway.",
    "Families seeking a cost-effective EU nursing pathway at INR 26–47 lakhs all-in over 3.5 years — significantly lower than Canada (INR 80–130 lakhs) or the UK (INR 60–80 lakhs) — without compromising on EU recognition or European career pathway quality.",
  ],
  teachingHospitals: [
    "Partner hospitals in Vilnius — secondary and tertiary level hospitals in Lithuania's capital, including specialist departments in oncology, neurology, intensive care, and cardiology",
    "Partner hospitals in Kaunas — secondary hospitals and medical centres in Lithuania's second-largest city and university hub",
    "Partner hospitals in Klaipeda — hospitals and clinics in Lithuania's original SMK campus city and Baltic seaport",
    "Primary healthcare institutions across all three campus cities — outpatient clinics, family medicine practices, community health centres",
    "Mental health institutions — psychiatric nursing, inpatient and community mental health settings",
    "Rehabilitation centres — physical rehabilitation, occupational therapy, post-surgical rehabilitation",
    "Nursing homes and long-term care — geriatric nursing and palliative care settings",
    "Children's healthcare — paediatric wards, children's development centres, school health settings",
  ],
  recognitionBadges: [
    "Lithuania's Ministry of Education Licensed — Authorised Private Higher Education Institution",
    "EQF Level 6 — European Qualifications Framework, equivalent to a university bachelor's degree",
    "EU Directive 2005/36/EC — Professional Qualifications Recognition across 27 EU member states",
    "210 ECTS — Bologna Process Compliant (EU standard for 3.5-year professional bachelor)",
    "Erasmus+ Partner — 100+ International University Agreements in 25 Countries",
    "CGFNS Eligible — USA/Canada NCLEX-RN pathway via credential evaluation",
    "VASPVT Licensed — Lithuania's State Health Care Accreditation Agency",
    "Master's Eligible — Professional Bachelor accepted for MSc admission at LSMU and across the EU",
  ],
  recognitionLinks: [
    {
      label: "SMK College Official Website",
      url: "https://smk.lt",
    },
    {
      label: "SMK Admissions Portal",
      url: "https://apply.smk.lt",
    },
    {
      label: "MIGRIS — Lithuanian Migration Information System",
      url: "https://migris.lt",
    },
    {
      label: "VASPVT — State Health Care Accreditation Agency Lithuania",
      url: "https://www.vaspvt.gov.lt",
    },
  ],
  similarUniversitySlugs: [
    "lithuanian-university-of-health-sciences-bscn",
    "european-university-of-tirana-bscn",
  ],
  lastVerifiedAt: "2026-06-17",
  researchSources: [
    {
      label: "SMK College Official Website — smk.lt",
      url: "https://smk.lt",
      kind: "official-university",
      checkedAt: "2026-06-17",
    },
    {
      label: "SMK Admissions Portal — apply.smk.lt",
      url: "https://apply.smk.lt",
      kind: "official-program",
      checkedAt: "2026-06-17",
    },
    {
      label: "MIGRIS — Lithuanian Migration Department",
      url: "https://migris.lt",
      kind: "government",
      checkedAt: "2026-06-17",
    },
    {
      label: "Students Traffic SMK Lithuania Nursing Guide — June 2026",
      url: "https://studentstraffic.com",
      kind: "other",
      checkedAt: "2026-06-17",
    },
  ],
  faq: [
    {
      question: "Is the SMK Professional Bachelor in Nursing recognised across the EU?",
      answer:
        "Yes. SMK's Professional Bachelor in Health Sciences is placed at EQF Level 6 and the programme is designed to meet EU Directive 2005/36/EC minimum training requirements for General Nurses (minimum 4,600 hours). This means graduates can apply for nursing registration in all 27 EU member states without re-sitting their nursing examinations — you register with the nursing regulatory body of your target country, but the qualification itself is recognised across the EU.",
    },
    {
      question: "Is there an entrance test for SMK nursing?",
      answer:
        "No — this is one of SMK's most significant advantages for Indian students. There is no Biology, Chemistry, or any other academic entrance examination. Admission is based entirely on a motivation interview (conducted online via Google Meet, approximately 20–30 minutes) after document review. A student who did not take Biology at Class 12 or did not sit NEET is equally eligible as a student with 90% science marks.",
    },
    {
      question: "What is the 40% Talent Scholarship at SMK?",
      answer:
        "SMK's 40% Talent Scholarship reduces first-year tuition from EUR 4,400 to approximately EUR 2,640 — a saving of EUR 1,760 (approximately INR 1.6 lakhs). The criteria: Class 12 average of 8.5/10 (85% or above), B2 level English with a certificate (IELTS, TOEFL, PTE, or similar), completion of a scholarship assignment specified by SMK, and submission of all documents by August 20 (Fall intake) or January 20 (Spring intake). Late applications are not reviewed. If your Class 12 average is 85%+ and you have an IELTS 6.0 or B2 equivalent, Students Traffic strongly recommends pursuing this scholarship.",
    },
    {
      question: "How does SMK compare to LSMU for Indian students?",
      answer:
        "Both are Lithuanian EU nursing programmes leading to an EQF Level 6 qualification recognised under EU Directive 2005/36/EC. Key differences: SMK has NO entrance test (LSMU requires Biology/Chemistry test unless NEET 650+); SMK is 3.5 years (LSMU 4 years); SMK offers three campus cities (LSMU is Kaunas only); SMK has a 40% scholarship available (LSMU has limited institutional awards); LSMU is a public university with WHO Collaborating Centre status (SMK is private, no WHO designation); LSMU has 240 ECTS vs SMK's 210 ECTS. Neither is categorically 'better' — the right choice depends on your entrance test readiness, preferred location, scholarship eligibility, and how important WHO and public university status are for your loan file or career target.",
    },
    {
      question: "Which city should I choose — Vilnius, Kaunas, or Klaipeda?",
      answer:
        "The curriculum and qualification are identical across all three SMK campuses. Choose Vilnius if you want the largest Indian community in Lithuania, the best job market for part-time work, and the most cosmopolitan city environment (monthly cost EUR 550–850). Choose Kaunas if budget is the priority — it is the most affordable of the three cities with a strong university-city culture (EUR 450–700/month). Choose Klaipeda if you prefer a quieter, smaller Baltic port city with coastal character and the lowest living costs (EUR 400–650/month). Students Traffic provides city-specific guidance on accommodation, Indian communities, and part-time work opportunities for each campus.",
    },
    {
      question: "What is the total cost for Indian students over 3.5 years at SMK?",
      answer:
        "Total tuition: EUR 15,400 (EUR 4,400 × 3 full years + EUR 2,200 final semester) — or EUR 13,640 with the 40% Year 1 scholarship. Living costs: EUR 14,490–28,770 in Kaunas/Klaipeda, or EUR 19,530–36,330 in Vilnius over 3.5 years. One-time application fee: EUR 50. Visa/TRP costs: EUR 480–700. Grand total all-in: approximately EUR 28,600–43,110 for Kaunas/Klaipeda with scholarship (INR 26–39 lakhs), or EUR 35,460–52,530 for Vilnius without scholarship (INR 32–47 lakhs). Part-time work (20 hours/week) can generate EUR 450–490/month, offsetting a significant portion of living costs.",
    },
    {
      question: "What visa process do Indian students follow for SMK?",
      answer:
        "Indian students need a National Visa (D) and a Temporary Residence Permit (TRP) — both applied for before arriving in Lithuania. Step 1: Receive SMK Acceptance Letter and request the SMK VFS Global mediation number from admission@smk.lt. Step 2: Register on MIGRIS (migris.lt) and submit the online TRP application to get a MIGRIS number. Step 3: Book a VFS Global appointment in India using both your MIGRIS number and SMK's mediation number. Step 4: Submit physical documents and biometrics at VFS Global, pay EUR 120 visa fee. TRP processing: up to 2 months (standard) or 45 days (fast-tracked). Bank statement showing EUR 304/month (EUR 3,648/year) minimum is required. SMK advises Indian students to begin the visa process at least 3–4 months before the semester start date.",
    },
    {
      question: "Can I work as a nurse in Germany after graduating from SMK?",
      answer:
        "Yes — with two preparations completed: (1) German B2 language proficiency, which is mandatory for clinical nursing practice in Germany and non-negotiable for patient safety reasons. Begin German language training from Semester 1 of the SMK programme, targeting B2 by graduation. (2) Anerkennung — submit your EU Professional Bachelor diploma to the relevant German state nursing authority for credential recognition. EU-issued EQF Level 6 nursing qualifications are generally recognisable under Germany's Anerkennungsgesetz. Entry-level German nursing salary: EUR 2,500–3,800/month gross (approximately INR 2.25–3.4 lakhs/month).",
    },
  ],
  admissionsContent: {
    overview:
      "SMK College accepts applications via apply.smk.lt with two intakes per year — Fall (September 1, deadline July 1) and Spring (February 1, deadline December 1). There is NO Biology/Chemistry entrance test; admission is based on a motivation interview after document review. Students Traffic manages the complete SMK application process including document preparation, motivation interview coaching, scholarship assessment, enrollment confirmation, MIGRIS registration, and Lithuania National Visa D and TRP application.",
    eligibility: {
      intro:
        "Entry requirements for Indian students applying to the SMK Professional Bachelor in Health Sciences (General Practice Nurse):",
      items: [
        "Completed 12 years of formal secondary education — Class 10+2 (CBSE, CISCE, or any recognised State Board) is accepted",
        "Minimum 50% overall score on the Class 12 school leaving certificate — no minimum in specific subjects",
        "No NEET required, no Biology/Chemistry entrance test — all applicants go through the motivation interview regardless of science subject history",
        "English proficiency: IELTS 5.5+ / TOEFL iBT 69+ / PTE Academic 59+ / Duolingo 110+ / FCE / LanguageCert IESOL B2+ — or SMK's internal English test (EUR 50) if no certificate is available",
        "For 40% Talent Scholarship: Class 12 average of 8.5/10 (85%+), B2 English certificate, completed scholarship assignment, and submission by August 20 (Fall) or January 20 (Spring)",
        "Valid Indian passport with at least 2 years validity",
        "All documents not originally in English must be accompanied by authorised English translations",
      ],
    },
    admissionSteps: [
      "Assess eligibility with Students Traffic — Class 12 average check for 40% scholarship, English proficiency status, campus city preference (Vilnius/Kaunas/Klaipeda), and Spring vs Fall intake planning",
      "Prepare documents: Class 10 and 12 certificates and transcripts (English translations if in Hindi or regional language), valid passport copy (2+ years validity), English proficiency certificate (IELTS, TOEFL, PTE, etc.), and scholarship assignment if applying for the 40% talent scholarship",
      "Submit online application at apply.smk.lt — create account, select General Practice Nursing and preferred campus, upload all documents, pay the EUR 50 application fee. Proceed to interview only after fee payment is confirmed.",
      "Attend the SMK motivation interview — individual online session via Google Meet, approximately 20–30 minutes. SMK evaluates motivation for nursing, communication in English, and career goals. Admission decision issued within a few days.",
      "Receive SMK Acceptance Letter — confirm enrollment by paying first tuition instalment (EUR 2,200 for first semester or as specified by SMK). Request SMK's VFS Global mediation number from admission@smk.lt for TRP processing.",
      "Register on MIGRIS (migris.lt) to obtain a MIGRIS application number; book VFS Global appointment in India using the MIGRIS number and SMK mediation number; submit physical documents and biometrics; pay EUR 120 visa fee",
      "Arrange health insurance (EUR 6,000 minimum Schengen-wide coverage), confirm accommodation in the chosen campus city, and complete pre-departure briefing for arrival in Vilnius, Kaunas, or Klaipeda",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet and certificate",
        "Class 12 marksheet and certificate — all subjects listed with grades",
        "Authorised English translations of all documents not in English",
        "English proficiency certificate (IELTS 5.5+ / TOEFL iBT 69+ / PTE 59+ / Duolingo 110+ / or prepare for SMK internal test)",
        "Passport copy — minimum 2 years validity",
        "Passport-size photographs",
        "Scholarship assignment (if applying for 40% Talent Scholarship)",
      ],
      visa: [
        "SMK Letter of Acceptance / Enrollment Confirmation",
        "Proof of first tuition fee payment",
        "SMK-issued mediation number for VFS Global appointment booking",
        "MIGRIS application number (from online TRP registration at migris.lt)",
        "Bank statement showing minimum EUR 3,648 (EUR 304/month × 12 months) for living costs",
        "Confirmed accommodation address in Lithuania (private rental agreement or SMK-assisted accommodation confirmation)",
        "Valid health insurance covering all Schengen countries — minimum EUR 6,000 sum insured",
        "Passport photographs (1 passport-type, 3×4 cm)",
        "Police Clearance Certificate from India",
        "National Visa D / TRP fee: EUR 120 (regular) or EUR 240 (urgent)",
      ],
    },
    deadlinesNote:
      "Fall intake (September 1 start): application deadline July 1 for Indian students requiring visa. Spring intake (February 1 start): deadline December 1. SMK strongly advises visa-required applicants to apply significantly earlier — TRP processing can take up to 2 months. For Fall 2026, Indian students should ideally have their admission confirmed and TRP process started by April/May 2026. For the 40% Talent Scholarship: scholarship documents must be submitted by August 20 (Fall) or January 20 (Spring) — strict, non-negotiable deadlines.",
    scholarshipInfo:
      "SMK's 40% Talent Scholarship reduces Year 1 tuition from EUR 4,400 to approximately EUR 2,640 (saving EUR 1,760 ≈ INR 1.6 lakhs) for students meeting all criteria: Class 12 average of 85%+, B2 English certificate, completed scholarship assignment, and timely submission. A sibling/alumni discount of 10% is available for students with family ties to SMK. From Year 2, performance-based scholarships of up to 50% are available for the best and most active students. Part-time work rights (20 hours/week, EUR 5.65/hour minimum) generate EUR 450–490/month — the most reliable ongoing financial supplement. Education loans from Indian banks and NBFCs are available for accredited international institutions; SMK's Ministry of Education licensing and EQF Level 6 status support the loan file.",
    licensingPathway: [
      "Upon graduation, apply to VASPVT (State Health Care Accreditation Agency) for a Lithuanian nursing practice licence to work as a General Practice Nurse in Lithuanian healthcare.",
      "EU-wide: Your SMK Professional Bachelor in Health Sciences is EQF Level 6 and designed to meet EU Directive 2005/36/EC minimum training requirements — apply to the nursing regulatory body of your target EU country for professional recognition.",
      "Germany (primary pathway): Complete German B2 language training during the 3.5-year programme. After graduation, submit the EU Professional Bachelor for Anerkennung (credential recognition) with the relevant German state nursing authority. Apply for a skilled worker visa under Germany's Fachkräfteeinwanderungsgesetz. Entry-level salary: EUR 2,500–3,800/month gross.",
      "Netherlands, Sweden, Ireland, or other EU countries: Achieve the relevant national language at B2 level. Apply for nursing credential recognition with the target country's nursing regulatory body under EU Directive 2005/36/EC.",
      "UK (NMC): Apply to the UK Nursing and Midwifery Council under the international route. Pass the NMC Computer-Based Test (CBT) and Objective Structured Clinical Examination (OSCE). Work under the NHS Health and Care Worker Visa. NHS Band 5 salary: GBP 29,970–36,483/year.",
      "USA/Canada (NCLEX-RN): Apply through CGFNS (Commission on Graduates of Foreign Nursing Schools) for credential evaluation. The EU Professional Bachelor in Nursing is accepted for CGFNS assessment. Pass the NCLEX-RN examination for US nursing licensure.",
      "India (return pathway): Submit the SMK EU Professional Bachelor to the Indian Nursing Council (INC) for verification of the foreign degree. Confirm current INC procedures at the time of graduation — European nursing clinical training and EU-standard education are valued by premium Indian private hospitals.",
    ],
  },
  programs: [
    {
      slug: "smk-bscn",
      title: "Professional Bachelor in Health Sciences (General Practice Nurse) — SMK College of Applied Sciences, Lithuania (3.5 Years, 210 ECTS)",
      durationYears: 4,
      annualTuitionUsd: 4752,
      totalTuitionUsd: 16632,
      livingUsd: 7100,
      officialFeeCurrency: "EUR",
      officialAnnualTuitionAmount: 4400,
      officialTotalTuitionAmount: 15400,
      officialProgramUrl: "https://smk.lt",
      medium: "English",
      published: true,
      intakeMonths: ["September", "February"],
      feeVerifiedAt: "2026-06-17",
      fxRateDate: "2026-06-17",
      fxRateSourceUrl:
        "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
      feeNotes:
        "Annual tuition for non-EU international students is EUR 4,400/year. Programme duration is 3.5 years (7 semesters, 210 ECTS): 3 full academic years + 1 final semester (6 months). Total tuition: EUR 4,400 × 3 + EUR 2,200 (half-year) = EUR 15,400. One-time application fee: EUR 50 (non-refundable). 40% Talent Scholarship available in Year 1 for students with 85%+ Class 12 average, B2 English certificate, and scholarship assignment — reduces Year 1 tuition to approximately EUR 2,640 (total with scholarship: EUR 13,640). USD conversion at EUR 1 = USD 1.08 (June 2026 ECB rate). Annual living cost estimate of EUR 6,600 used for USD conversion ($7,128 ≈ $7,100), based on mid-range Kaunas costs (EUR 550/month). No separate registration fee. Part-time work rights (20 hours/week, EUR 5.65/hour minimum) generate EUR 450–490/month during term — potential EUR 12,000–18,000 earnings over 3.5 years.",
      teachingPhases: [
        {
          phase: "Year 1 — Foundations (Semesters 1–2, ~60 ECTS)",
          language: "English",
          details:
            "Anatomy and Physiology, Microbiology, Virology, Immunology, General Nursing principles, Introduction to Healthcare, Professional Ethics, Communication in Healthcare, Medical Terminology, Pharmacology basics, Health Assessment, Nursing Techniques. Simulation lab orientation and first clinical observation hours in Semester 1. Introduction to clinical placements with basic nursing skills practised in healthcare settings from Semester 2.",
        },
        {
          phase: "Year 2 — Clinical Entry (Semesters 3–4, ~60 ECTS)",
          language: "English",
          details:
            "Clinical Nursing (Adult), Community Nursing, Geriatric Nursing, Mental Health Nursing, Child Nursing, Obstetrical Nursing (Midwifery), Health Promotion and Prevention. Students rotate through medical wards, community health settings, paediatric units, mental health, and maternal care departments under faculty supervision. Clinical placement hours increase significantly, with students taking on progressively greater responsibility.",
        },
        {
          phase: "Year 3 — Specialisation (Semesters 5–6, ~60 ECTS)",
          language: "English",
          details:
            "Surgical Care, Physical and Rehabilitative Medicine, Intensive Care Nursing, Advanced Clinical Nursing, Nursing Management and Leadership, Evidence-Based Practice, Research Methods. Clinical placements in surgical, rehabilitation, and ICU settings. Extended supervised placement with increasing independent nursing practice under preceptor guidance. Research methodology and nursing thesis preparation begins.",
        },
        {
          phase: "Final Semester — Advanced Practice (Semester 7, ~30 ECTS)",
          language: "English",
          details:
            "Final Clinical Practice — extended placement working as a General Practice Nurse under preceptor supervision in real clinical environments. Final Professional Thesis preparation and defence. Graduation with Professional Bachelor of Health Sciences and Professional Qualification: General Nurse Practitioner (Bendrosios praktikos slaugytojas).",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 4752,
          hostelUsd: 2592,
          livingUsd: 5184,
          totalUsd: 12528,
          notes:
            "Year 1 setup costs (winter clothing, SIM, arrival essentials) add approximately $300–500. If eligible for 40% Talent Scholarship, Year 1 tuition reduces to EUR 2,640 (~$2,851). SMK does not operate university dormitories — budget for private shared room accommodation (EUR 150–300/month in Kaunas, EUR 200–400/month in Vilnius). Living estimate includes food EUR 150/month, transport EUR 20/month, health insurance EUR 35/month, phone EUR 25/month, and personal expenses EUR 50/month at mid-budget. Exchange rate EUR 1 = USD 1.08.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 4752,
          hostelUsd: 2592,
          livingUsd: 5184,
          totalUsd: 12528,
          notes:
            "Clinical placements increase significantly in Year 2. Part-time work (20 hours/week, EUR 5.65/hour minimum) can generate EUR 450–490/month toward living costs. Performance-based scholarships (up to 50%) become available for outstanding students from Year 2. TRP renewal required — budget EUR 120 for the renewal fee.",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 4752,
          hostelUsd: 2592,
          livingUsd: 5184,
          totalUsd: 12528,
          notes:
            "Advanced clinical rotations in surgical, ICU, and rehabilitation settings. German language classes recommended from Year 1 (community classes or online); budget EUR 50–100/month if separately enrolled. TRP renewal required — budget EUR 120. Erasmus+ exchange semester may be available for eligible students at partner institutions.",
        },
        {
          yearLabel: "Final Semester (6 months)",
          tuitionUsd: 2376,
          hostelUsd: 1296,
          livingUsd: 2592,
          totalUsd: 6264,
          notes:
            "Final Clinical Practice and Professional Thesis in Semester 7 (6 months only). Tuition for the final semester is half the annual rate: EUR 2,200 (~$2,376). Begin post-graduation TRP extension application or employment applications toward the end of this period. Average Lithuanian nursing salary on registration: EUR 1,292/month gross.",
        },
      ],
      licenseExamSupport: [
        "VASPVT Lithuania — nursing practice licence on graduation to practise as a General Practice Nurse in Lithuania",
        "EU Directive 2005/36/EC — professional recognition across 27 EU member states (EQF Level 6)",
        "Germany Anerkennung — recognition process for EU-educated nurses; B2 German proficiency required for clinical nursing practice",
        "UK NMC international registration — CBT (Computer-Based Test) and OSCE (practical examination) required; EU Professional Bachelor assessable",
        "NCLEX-RN (USA/Canada) — EU Professional Bachelor eligible for CGFNS credential evaluation; NCLEX-RN examination required",
        "INC India verification — EU Professional Bachelor can be submitted to the Indian Nursing Council for return to nursing practice in India",
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
    // Lithuania must already exist — seeded by seed-lsmu-lithuania-bscn.mjs
    console.log("🌍 Looking up country: Lithuania…");
    const countryResult = await client.query(
      `SELECT id FROM countries WHERE slug = $1`,
      ["lithuania"]
    );
    if (!countryResult.rows[0]) {
      throw new Error(
        "Lithuania not found in the countries table. Run seed-lsmu-lithuania-bscn.mjs first."
      );
    }
    const lithuaniaId = countryResult.rows[0].id;
    console.log(`✓ Lithuania found (id=${lithuaniaId})`);

    console.log("\n🏫 Upserting university: SMK College of Applied Sciences…");

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
        lithuaniaId,
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
        updated_at                     = NOW()
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
    console.log("\n✅ SMK Lithuania Professional Bachelor Nursing seeded successfully.");
    console.log(`   Country:     Lithuania (id=${lithuaniaId})`);
    console.log(`   University:  ${university.name} (id=${universityId})`);
    console.log(`   Programme:   ${prog.slug}`);
    console.log(`   Course:      BSc Nursing (id=${COURSE_BSC_NURSING_ID})`);
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
