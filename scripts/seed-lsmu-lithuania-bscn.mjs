/**
 * Seed Lithuanian University of Health Sciences (LSMU) BSc Nursing for Lithuania.
 * Source: Students Traffic LSMU Lithuania BSc Nursing Guide, June 2026.
 * Run: node scripts/seed-lsmu-lithuania-bscn.mjs
 *
 * This script:
 *   1. Upserts Lithuania into the countries table
 *   2. Upserts LSMU into the universities table
 *   3. Upserts the BSc Nursing programme offering (course ID 15 = BSc Nursing)
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

const LITHUANIA_COUNTRY = {
  slug: "lithuania",
  name: "Lithuania",
  region: "Europe",
  summary:
    "Lithuania is an EU and NATO member state in the Baltic region of Northern Europe, with a modern EU-integrated higher education system and one of the most cost-effective study environments in the European Union. For Indian nursing students, Lithuania — specifically Kaunas — offers a compelling combination: a fully EU-recognised nursing degree from a WHO Collaborating Centre (LSMU), tuition of EUR 4,300/year, and a direct pathway to nursing careers across all 27 EU member states. As a Schengen Area member, a Lithuanian residence permit allows travel across 26 European countries. Indian students can work up to 20 hours per week during studies. Kaunas is Lithuania's second-largest city and cultural capital, consistently ranked among the most affordable student cities in the EU, with monthly living costs of EUR 450–700.",
  whyStudentsChooseIt:
    "Indian students choose Lithuania for nursing primarily because of LSMU's unique position: it is one of only 5 WHO Collaborating Centres for Nursing in all of Europe, and its BSc degree is automatically recognised across all 27 EU member states under EU Directive 2005/36/EC. The total 4-year cost of approximately EUR 31,000–45,000 (INR 28–41 lakhs) is dramatically lower than equivalent nursing programmes in Canada or the UK. Lithuania's Schengen membership is a key practical advantage — students can travel across 26 European countries on their residence permit, and a Lithuanian TRP is the foundation for building a European nursing career. Germany's nursing shortage (150,000+ additional nurses needed by 2027) creates documented long-term demand at EUR 2,800–3,800/month gross — a salary multiple of 10–15x what Indian hospitals pay. Part-time work rights (20 hours/week during term) allow students to offset living costs. Kaunas is an affordable, safe, student-friendly Baltic city with budget airline connections to all major European hubs.",
  climate:
    "Baltic — warm summers (18–26°C, up to 18 hours daylight in June), cold winters (-5 to -15°C, heavy snow from November through March). Spring and autumn are mild at 5–15°C with beautiful seasonal landscapes. Kaunas is located in central Lithuania at the confluence of the Nemunas and Neris rivers. The Baltic winter is the biggest climate adjustment for Indian students — proper thermal clothing, waterproof boots, gloves, and a quality winter jacket are essential from the first year.",
  currencyCode: "EUR",
  metaTitle:
    "BSc Nursing in Lithuania for Indian Students 2026 | LSMU Kaunas, EU Degree & Career Pathways",
  metaDescription:
    "Complete guide to studying nursing in Lithuania for Indian students — LSMU Kaunas, EUR 4,300/year tuition, WHO Collaborating Centre, EU-recognised degree, pathways to work in Germany, Netherlands, and all 27 EU countries.",
};

// ---------------------------------------------------------------------------
// University
// ---------------------------------------------------------------------------

const university = {
  slug: "lithuanian-university-of-health-sciences-bscn",
  name: "Lithuanian University of Health Sciences (LSMU) — Bachelor of Science in Nursing",
  city: "Kaunas",
  type: "Public",
  establishedYear: 2010,
  officialWebsite: "https://lsmu.lt",
  summary:
    "The Lithuanian University of Health Sciences (LSMU) is Lithuania's largest public biomedical university, with over a century of medical heritage dating to the Medical Academy founded in 1922 and the modern university formally established in 2010. LSMU's Faculty of Nursing is one of only 5 WHO Collaborating Centres for Nursing and Midwifery in all of Europe — a recognition shared by very few institutions on the continent. The 4-year BSc in Health Sciences (General Practice Nurse) is a 240 ECTS, fully English-taught programme. Clinical placements take place at the Hospital of LSMU Kauno Klinikos — the largest clinical hospital in the Baltic States, with over 1,200 doctors, 2,400 nursing staff, and 78,000 patients annually. The EU-accredited BSc degree is automatically recognised across all 27 EU member states under Directive 2005/36/EC. Annual tuition is EUR 4,300 — making LSMU one of the most affordable routes to a fully EU-recognised nursing qualification available to Indian students today.",
  campusLifestyle:
    "LSMU operates an urban campus in central Kaunas at A. Mickevičiaus g. 9, LT-44307 Kaunas — fully equipped for biomedical education with modern classrooms, renovated simulation laboratories, and dedicated clinical skills training facilities. The university enrolls approximately 6,283 students, with 28% international students from 88+ countries, creating a genuinely multicultural environment. The Faculty of Nursing teaches in small groups — up to 10 students in clinical courses — ensuring personalised supervision and faculty attention far beyond what large Indian nursing colleges provide. LSMU has 323 global partner universities under Erasmus+ with 400 exchange students per year, offering funded semester or year-abroad opportunities. The LSMU Student Union (KIMSU) organises cultural events, international student nights, and community activities throughout the year. Academic staff total over 900, with 1,107 administrative staff. The university holds QS World Ranking #601–650 (QS WUR By Subject 2026) and is a member of the European University Association (EUA). The Faculty of Nursing uses problem-based learning methodology — students work through real clinical cases, conduct research, and apply theory to patient scenarios, rather than passively attending lectures.",
  cityProfile:
    "Kaunas is Lithuania's second-largest city (population approximately 280,000) and the country's cultural and academic capital, situated at the confluence of the Nemunas and Neris rivers in central Lithuania. It is a vibrant student city — consistently ranked among the most affordable cities in the European Union — with Ryanair and other budget carriers connecting Kaunas Airport to London, Berlin, Dublin, Barcelona, Oslo, and other European hubs from EUR 15–50. Monthly living costs for Indian students range from EUR 450–700 on a budget to EUR 700–1,000 for a comfortable lifestyle. The Schengen residency benefit is significant: a Lithuanian TRP or National Visa D gives access to all 26 Schengen countries without a separate visa, making weekend travel to Warsaw (5 hours by Lux Express bus), Riga (4 hours), Tallinn (6 hours), and beyond accessible and affordable. Indian groceries, spices, lentils, and basics are available in Kaunas supermarkets and Asian stores. Most Indian students cook at home using dormitory kitchens (the most budget-friendly approach at EUR 120–180/month for food). Vilnius — Lithuania's capital — is 1 hour away by train or bus, offering a broader Indian restaurant and cultural scene. Kaunas is safe for international students: Lithuania is an EU and NATO member with stable governance and a low violent crime rate, and Indian students consistently report feeling welcomed in the city.",
  clinicalExposure:
    "LSMU's BSc Nursing programme has one of the most significant clinical training advantages of any nursing school accessible to Indian students in Europe: direct supervised access to the Hospital of LSMU Kauno Klinikos — the largest clinical hospital in the entire Baltic States region (Estonia, Latvia, Lithuania combined). Kauno Klinikos was formed in September 2020 (merger of Kaunas Clinical Hospital and Republican Hospital of Kaunas), with over 1,200 highly qualified doctors, 2,400 nurses and nursing personnel, and over 78,000 patients treated annually. Clinical rotations span medical, surgical, oncology, neurology, interventional radiology, paediatrics, geriatrics, rehabilitation, intensive care, mental health, and community health departments. Additional placement sites include the Kaunas Red Cross Nursing and Palliative Care Hospital (palliative and long-term care), Kaunas Child Development Hospital (paediatric nursing), and community health centres across Kaunas for primary care and community nursing placements. Clinical placements progress year by year: Year 1 — simulation labs and ward observation; Year 2 — supervised patient care in adult medical/surgical wards; Year 3 — specialty rotations across mental health, maternal/child health, community, oncology, and neurology; Year 4 — advanced consolidated placement with preceptor-supervised independent nursing practice and final clinical practice examination. Clinical courses run in groups of up to 10 students — a dramatically better ratio than large Indian nursing colleges. Clinical attendance of 75% is typically mandatory.",
  hostelOverview:
    "LSMU operates university dormitories close to the main campus, with monthly costs of EUR 70–200 per person — the most affordable accommodation option in Kaunas and among the cheapest in any EU capital region. Dormitories are renovated and equipped with necessary furniture; bus and trolleybus stops, shops, and daily facilities are nearby. For students preferring private accommodation, shared apartments in Kaunas range from EUR 150–300 per person per month. LSMU's international office and student support services provide accommodation guidance for incoming students. Students Traffic provides a pre-arrival Kaunas accommodation guide and connects new students with existing Indian students at LSMU before departure.",
  indianFoodSupport:
    "Indian groceries — spices, lentils, basmati rice, chickpeas, and cooking essentials — are available at major Kaunas supermarkets and Asian grocery stores, with the selection growing as the international student population has increased. Most Indian students cook at home in dormitory kitchens, which is both the most budget-friendly approach (EUR 120–180/month for groceries) and the easiest way to maintain Indian dietary habits. Vegetarian food is manageable in Kaunas — supermarkets stock plenty of vegetables, legumes, dairy, and eggs. For Indian restaurants and a broader South Asian food scene, Vilnius (1 hour by train or bus) offers more choices. Diwali, Holi, and other Indian festivals are celebrated by the Indian student community at LSMU through student organisations. Students Traffic connects all enrolled students with the existing Indian student network in Kaunas before arrival, so new students arrive knowing where to shop and who to reach out to.",
  safetyOverview:
    "Lithuania is an EU and NATO member state with stable democratic governance and a low violent crime rate. Kaunas is a well-lit, well-policed university city with a large international student community. Indian students at LSMU — including female students — consistently report feeling safe and welcomed in Kaunas. The concept of Lithuanian hospitality toward guests is genuine, and the multicultural environment at LSMU (28% international students from 88 countries) creates a normalised, inclusive study environment. Standard urban precautions apply (stay aware late at night, use reputable transport), but no exceptional safety concerns have been reported by Indian nursing students in Kaunas. The Schengen Area membership and EU governance framework ensure Lithuania meets European standards for civil safety, rule of law, and emergency services.",
  studentSupport:
    "LSMU provides dedicated international student support: orientation programmes, academic tutoring, and psychological counselling services. The LSMU International Affairs Office (study@lsmu.lt) handles admissions queries, TRP guidance, and enrolled-student support. Erasmus+ student networks on campus support international student integration. LSMU provides enrolled students with guidance on TRP renewal processes each year. Students Traffic provides end-to-end support: eligibility assessment (Class 12 Biology/Chemistry marks, IELTS score, NEET exemption verification), complete DreamApply application management, MEA Apostille coordination for Indian Class 10 and 12 documents, MIGRIS registration and TRP application guidance, VFS Global appointment coordination, pre-departure Kaunas briefing (winter clothing list, dormitory guide, Indian grocery locations), LSMU campus orientation, Indian student network introduction in Kaunas, and post-graduation German Anerkennung and UK NMC pathway guidance.",
  whyChoose: [
    "WHO Collaborating Centre status — LSMU's Faculty of Nursing is one of only 5 WHO Collaborating Centres for Nursing in all of Europe. This is the highest international quality benchmark a nursing school can hold, recognised by the Indian Nursing Council, Indian banks processing education loan files, and nursing regulatory bodies across the world.",
    "EU Directive 2005/36/EC automatic recognition — the BSc Nursing degree is automatically recognised across all 27 EU member states, enabling nursing practice in any EU country without re-examination. This is the single most important credential advantage of the LSMU degree over an Indian BSc Nursing.",
    "Hospital of LSMU Kauno Klinikos for clinical placements — the largest clinical hospital in the Baltic States, with 1,200+ doctors, 2,400 nursing staff, and 78,000 patients per year. Students are placed in real wards across the full spectrum of medical, surgical, and specialty departments under faculty supervision — not simulation-only environments.",
    "4-year, 240 ECTS programme — the EU standard for a nursing bachelor's degree, directly comparable to nursing qualifications across Europe. 240 ECTS from a public Lithuanian university gives maximum portability across EU nursing regulatory bodies.",
    "Total 4-year investment of INR 28–41 lakhs — approximately 60–80% lower than equivalent Canadian or UK nursing programmes (INR 70–130 lakhs), and competitive with Indian private nursing colleges that carry no international recognition.",
    "Part-time work rights of up to 20 hours/week during the academic term and full-time during holidays — generating EUR 400–600/month potential income toward living costs without requiring a separate work permit.",
    "Small clinical groups of up to 10 students — personalised faculty supervision and direct clinical learning that large-cohort nursing programmes in India cannot offer. Problem-based learning methodology from Year 1 builds clinical reasoning alongside technical nursing skills.",
    "Erasmus+ with 323 partner universities globally — funded semester or year-abroad opportunities in partner EU universities, adding international depth to the nursing degree.",
  ],
  thingsToConsider: [
    "Language requirement for European career destinations: Germany requires German B2 proficiency for clinical nursing practice; Netherlands requires Dutch B2; Scandinavia requires the local language. Begin German language training from Year 1 in Kaunas if Germany is the career goal — language is the primary preparation item, not just the degree.",
    "Lithuania's own nursing salary (EUR 1,292/month average gross) is significantly lower than Germany (EUR 2,800–3,800/month) or the Netherlands. Lithuania is the staging ground for a European nursing career, not the final salary destination for most Indian students.",
    "Entrance test required for most applicants: 90-minute online Biology and Chemistry exam (30 questions each) plus a mandatory interview a few days beforehand. Skipping the interview automatically cancels the test. NEET 650+ holders are exempt from the written test but should confirm their exemption with LSMU admissions.",
    "One-time non-refundable fees: EUR 150 application fee (on application) and EUR 250 registration fee (after admission offer) — total EUR 400 — are explicitly non-refundable. Do not apply until eligibility is confirmed.",
    "INC verification required for India-return nursing practice: LSMU's EU BSc degree is internationally respected and can be verified by the Indian Nursing Council, but the current INC procedure should be confirmed before committing if India-return clinical practice is the primary goal.",
    "Cold Baltic winters of -5 to -15°C from November through March require a genuine first-year investment in winter clothing (INR 10,000–20,000). This is the biggest climate adjustment for Indian students and should be budgeted from Year 1.",
    "TRP renewal every 1–2 years is required for a 4-year programme. Renewal is processed through the Kaunas Migration Department, requires bank balance evidence (EUR 304/month minimum) and valid health insurance — plan ahead for each renewal cycle.",
  ],
  bestFitFor: [
    "Indian Class 12 students with Biology and Chemistry who want a fully EU-recognised nursing degree from a WHO Collaborating Centre and are targeting nursing careers in Germany, Netherlands, Sweden, or other EU countries.",
    "Students with a NEET score of 650 or above who can bypass LSMU's entrance test and gain direct admission — converting a strong NEET performance into a fast-track European nursing qualification.",
    "Families who want a public university EU nursing degree at INR 28–41 lakhs total (tuition + living over 4 years) — a fraction of Canadian or UK nursing programme costs — without compromising on degree quality or international recognition.",
    "Students who are committed to learning German or Dutch alongside their nursing studies — the language investment during the 4-year programme is what converts the LSMU EU degree into a high-salary German or Dutch nursing career.",
    "Students who value small clinical group sizes (up to 10), problem-based learning, and direct supervised access to the Baltic States' largest teaching hospital — where clinical training is a genuine priority, not an afterthought.",
    "Indian students interested in the full Schengen European experience during their studies — travel across 26 EU countries on the Lithuanian TRP, Erasmus+ exchange semester opportunities, and budget airline access to major European cities.",
  ],
  teachingHospitals: [
    "Hospital of LSMU Kauno Klinikos — Largest Clinical Hospital in the Baltic States (1,200+ doctors, 2,400 nursing staff, 78,000 patients/year)",
    "Kaunas Red Cross Nursing and Palliative Care Hospital — Palliative and long-term care placements",
    "Kaunas Clinical Hospital — Secondary and tertiary level clinical exposure",
    "Kaunas Child Development Hospital and Child Mental Retardation Centre — Paediatric and developmental nursing",
    "Community Health Centres across Kaunas — Primary care and community nursing placements",
    "Specialty departments: oncology, neurology, interventional radiology, intensive care, psychiatry, obstetrics, geriatrics",
  ],
  recognitionBadges: [
    "WHO Collaborating Centre — One of Only 5 for Nursing in Europe",
    "SKVC Accredited — Lithuanian Higher Education Quality Assurance Agency (last evaluated June 2022; next 2028)",
    "EU Directive 2005/36/EC — Automatic Professional Qualifications Recognition across 27 EU countries",
    "240 ECTS — Bologna Process Compliant (EU standard for 4-year nursing bachelor's)",
    "Erasmus+ Partner — 323 Global University Agreements",
    "QS World Ranking #601–650 (QS WUR By Subject 2026)",
    "CGFNS Eligible — USA/Canada NCLEX-RN pathway",
    "EUA Member — European University Association",
  ],
  recognitionLinks: [
    {
      label: "LSMU Official Website",
      url: "https://lsmu.lt",
    },
    {
      label: "LSMU DreamApply Admissions Portal",
      url: "https://apply.lsmuni.lt",
    },
    {
      label: "LSMU Faculty of Nursing — WHO Collaborating Centre",
      url: "https://lsmu.lt/faculty-of-nursing/",
    },
    {
      label: "MIGRIS — Lithuanian Migration Information System",
      url: "https://migris.lt",
    },
    {
      label: "SKVC — Centre for Quality Assessment in Higher Education",
      url: "https://www.skvc.lt",
    },
  ],
  similarUniversitySlugs: [
    "european-university-of-tirana-bscn",
    "humber-polytechnic-bscn",
  ],
  lastVerifiedAt: "2026-06-16",
  researchSources: [
    {
      label: "LSMU Official Website — lsmu.lt",
      url: "https://lsmu.lt",
      kind: "official-university",
      checkedAt: "2026-06-16",
    },
    {
      label: "LSMU BSc Nursing Programme — Faculty of Nursing",
      url: "https://lsmu.lt/study/bachelor-of-science-health-sciences/",
      kind: "official-program",
      checkedAt: "2026-06-16",
    },
    {
      label: "LSMU DreamApply Admissions — apply.lsmuni.lt",
      url: "https://apply.lsmuni.lt",
      kind: "official-program",
      checkedAt: "2026-06-16",
    },
    {
      label: "MIGRIS — Lithuanian Migration Department TRP Process",
      url: "https://migris.lt",
      kind: "government",
      checkedAt: "2026-06-16",
    },
    {
      label: "Students Traffic LSMU Lithuania BSc Nursing Guide — June 2026",
      url: "https://studentstraffic.com",
      kind: "other",
      checkedAt: "2026-06-16",
    },
  ],
  faq: [
    {
      question: "Is the LSMU BSc Nursing degree recognised across the EU?",
      answer:
        "Yes. The LSMU BSc in Health Sciences (Nursing) is automatically recognised across all 27 EU member states under EU Directive 2005/36/EC on Professional Qualifications. This means you can apply to work as a nurse in Germany, the Netherlands, Sweden, Ireland, or any other EU country without re-sitting your nursing exams. You need to register with the nursing regulatory body of the target country, but the degree itself is recognised automatically.",
    },
    {
      question: "Do I need NEET for LSMU's BSc Nursing programme?",
      answer:
        "NEET is not required by LSMU for admission. However, if you have a NEET score of 650 or above, you are exempt from LSMU's entrance test in Biology and Chemistry — bypassing one of the key application steps. This is a significant advantage for NEET-takers, even those who did not qualify for an Indian government seat. Students Traffic verifies your NEET exemption eligibility as the first step in the application assessment.",
    },
    {
      question: "What is LSMU's entrance test and who is exempt?",
      answer:
        "The entrance test is a 90-minute online multiple-choice exam: 30 Biology questions + 30 Chemistry questions. It is preceded by a mandatory interview conducted a few days before the written test — missing the interview cancels your test automatically. Exemptions apply to: NEET score of 650+, IB Diploma with score 5 (Higher Level) in Biology and Chemistry, A-Level C and C grades in Biology and Chemistry, UCAT score 2100+, MCAT score 511+, or IMAT score 57+. Even exempt students should confirm their status with LSMU admissions, as the university may request a test in cases of high competition.",
    },
    {
      question: "What is the total cost of studying at LSMU for 4 years?",
      answer:
        "Total 4-year investment: LSMU tuition EUR 17,200 (EUR 4,300 × 4 years) + one-time admission fees EUR 400 (EUR 150 application + EUR 250 registration) + living costs EUR 13,500–27,000 (accommodation, food, transport, insurance, miscellaneous over 4 years) + visa and immigration costs EUR 500–800. Grand total approximately EUR 31,600–45,400 — in INR approximately INR 28.5–41 lakhs (at EUR 1 = INR 90–92, mid-2026). Part-time work earnings of up to 20 hours/week can recover EUR 8,000–12,000 over the 4 years toward living costs.",
    },
    {
      question: "What visa do I need and how does the Lithuanian TRP process work?",
      answer:
        "Indian students require a National Visa (D) for entry and a Temporary Residence Permit (TRP) for the duration of studies — both must be applied for BEFORE arriving in Lithuania. Step 1: Register on MIGRIS (migris.lt) online and submit your TRP application to get a MIGRIS application number. Step 2: Book a VFS Global appointment in India using your MIGRIS number and LSMU's mediation number. Step 3: Submit physical documents and biometrics at VFS. TRP processing takes up to 2 months (standard) or 45 calendar days (fast-tracked). Bank statement showing minimum EUR 304/month (EUR 3,648/year) is required. The TRP card can be sent to your Indian address, so you arrive already holding valid residency. Apply early — do not leave the visa process until 2 months before the September intake.",
    },
    {
      question: "Can I work as a nurse in Germany after graduating from LSMU?",
      answer:
        "Yes, but you need to complete two steps: (1) Anerkennung (credential recognition) — apply to the relevant German state nursing authority for recognition of your EU nursing diploma. As an EU-educated nurse, this process is more streamlined than for non-EU internationally educated nurses. (2) German B2 language proficiency — mandatory for patient-facing nursing practice in Germany. Begin German from Year 1 of your LSMU programme if Germany is your career goal. Entry-level German nursing salary: EUR 2,800–3,800/month gross (approximately INR 2.5–3.4 lakhs/month). Germany's Skilled Immigration Act provides a structured visa pathway for qualified nurses.",
    },
    {
      question: "Is Lithuania safe for Indian students, including female students?",
      answer:
        "Lithuania is an EU and NATO member state with stable governance and a low violent crime rate. Kaunas is a modern, well-lit university city. Indian students — including female students — consistently report feeling safe and welcomed. Standard urban precautions apply (stay aware late at night, use reputable transport), but no exceptional safety concerns have been reported by Indian nursing students in Kaunas. LSMU's 28% international student body from 88 countries creates a normalised, inclusive environment.",
    },
    {
      question: "What is accommodation like at LSMU and how much does it cost?",
      answer:
        "LSMU operates university dormitories close to campus at EUR 70–200 per person per month — the most affordable option and strongly recommended for first-year students. Dormitories are renovated, equipped with kitchens, and well-connected by public transport. Private shared apartments in Kaunas cost EUR 150–300 per person per month. Total monthly living budget for Indian students: EUR 450–700 on a budget, EUR 700–1,000 for a comfortable lifestyle. This is significantly lower than Western European cities and even cheaper than Vilnius.",
    },
    {
      question: "Can I return to nursing practice in India after graduating from LSMU?",
      answer:
        "Yes — the LSMU BSc in Health Sciences (Nursing) can be verified by the Indian Nursing Council (INC) for return to nursing practice in India. An EU nursing degree from a public university with WHO Collaborating Centre status is among the most internationally respected qualifications available. However, you should confirm the current INC verification procedure directly before committing, as INC processes may evolve. The LSMU degree primarily targets EU career pathways (Germany, Netherlands, UK), but the India-return route is available.",
    },
    {
      question: "Can I pursue a Master's degree after LSMU BSc Nursing?",
      answer:
        "Yes. LSMU offers MSc programmes directly accessible to BSc Nursing graduates, including Advanced Nursing Practice and Nursing Leadership. Through LSMU's 323 Erasmus+ partner universities, MSc pathways are also available at partner institutions across the EU. For students targeting Germany: an MSc in a nursing specialty significantly strengthens the Anerkennung application and opens senior nursing and nursing leadership roles at higher salary bands.",
    },
  ],
  admissionsContent: {
    overview:
      "LSMU accepts applications via the DreamApply portal at apply.lsmuni.lt. The application portal opens in November; the final deadline for the September 2026 intake is 6 July 2026 (00:00 EET), with the entrance test deadline on 16 July 2026. No NEET is required by LSMU, but Indian students with NEET 650+ are exempt from the Biology and Chemistry entrance test. Students Traffic manages the complete LSMU application process including document preparation, MEA Apostille coordination, entrance test registration, admission letter management, and Lithuania National Visa D and TRP application.",
    eligibility: {
      intro:
        "Entry requirements for Indian students applying to the LSMU BSc in Health Sciences (General Practice Nurse):",
      items: [
        "Class 12 (10+2) passed with Biology and Chemistry as core subjects — both are mandatory for nursing admission",
        "Good academic results in Biology and Chemistry (competitive applicants have strong marks in both; LSMU evaluates results without a stated minimum percentage)",
        "English proficiency: IELTS above 5.5 overall, TOEFL iBT minimum 4.0, PTE Academic 55–67, Duolingo minimum 95, LanguageCert IESOL B1, or LSMU's own English test if no certificate is available",
        "NEET score of 650+ grants exemption from LSMU's entrance test in Biology and Chemistry — a key advantage for NEET-takers",
        "For applicants without NEET 650+: 90-minute online entrance test (30 Biology + 30 Chemistry questions) plus mandatory pre-test interview",
        "All Indian education documents must be Apostilled by the Ministry of External Affairs (MEA) of India — mandatory, not optional",
        "Valid Indian passport with at least 6 months validity",
        "Pakistani citizens: LSMU does not accept applications from Pakistani nationality holders (current territory restriction)",
      ],
    },
    admissionSteps: [
      "Assess eligibility with Students Traffic — NEET score check for entrance test exemption, Class 12 Biology and Chemistry review, IELTS/English status, and honest competitiveness assessment before any fees are paid",
      "Prepare documents: Class 10 and 12 certificates and marksheets — Apostilled by MEA India. Arrange authorised English translations if any documents are in a regional language. Prepare IELTS/English proficiency certificate, valid passport copy, passport photograph (3×4 cm), and motivation letter",
      "Register on DreamApply at apply.lsmuni.lt, select the BSc Nursing programme, upload all documents, and pay the EUR 150 non-refundable application fee",
      "Sit the LSMU entrance test if required: after application review LSMU sends a registration link for the online Biology and Chemistry test (90 minutes, 30 questions each) preceded by a mandatory interview a few days before",
      "Receive LSMU Letter of Acceptance, then pay the EUR 250 non-refundable registration fee to confirm your place and trigger the visa documentation process",
      "Register on MIGRIS (migris.lt) to obtain your MIGRIS application number, then book and attend your VFS Global appointment in India with your complete document package and biometrics",
      "Arrange health insurance (EUR 6,000 minimum coverage in Schengen Area), confirm LSMU dormitory booking or accommodation, and complete pre-departure briefing for Kaunas arrival in September",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet and certificate — Apostilled by MEA India",
        "Class 12 marksheet and certificate with Biology and Chemistry — Apostilled by MEA India",
        "English translations of all documents not originally in English (authorised translations)",
        "IELTS / English proficiency certificate (or prepare for LSMU English test)",
        "NEET scorecard — if claiming entrance test exemption (NEET 650+ required)",
        "Passport copy — minimum 6 months validity beyond programme end",
        "Passport-size photographs (3×4 cm)",
        "Motivation letter",
      ],
      visa: [
        "LSMU Letter of Acceptance / Enrollment Confirmation",
        "Proof of payment of EUR 250 registration fee and EUR 4,300 first-year tuition (or ability to pay)",
        "LSMU-issued mediation number for VFS Global appointment booking",
        "Bank statement showing minimum EUR 3,648 (EUR 304/month × 12 months) for living costs",
        "Accommodation confirmation — LSMU dormitory booking letter or signed lease",
        "Valid health insurance covering all Schengen countries — minimum EUR 6,000 sum insured",
        "Passport photographs (1 passport-type, 3×4 cm)",
        "MIGRIS application number (from online TRP registration at migris.lt)",
        "National Visa D / TRP fee: EUR 120 (regular) or EUR 240 (urgent)",
      ],
    },
    deadlinesNote:
      "The September 2026 intake deadline is 6 July 2026 (portal closes at 00:00 EET); entrance test deadline 16 July 2026. Apply as early as possible — applications submitted from November receive earlier review, and early submission allows maximum time for Apostille processing (4–6 weeks), MIGRIS/TRP processing (up to 2 months), and VFS appointment scheduling. Do not start the application process less than 4 months before September.",
    scholarshipInfo:
      "LSMU does not widely advertise automatic merit scholarships for non-EU nursing students, but institutional awards exist for outstanding academic performance — enrolled students should contact the LSMU International Affairs Office (study@lsmu.lt) directly. Lithuanian Government scholarships for international students in specific fields are available via studyin.lt. Erasmus+ exchange semesters provide monthly living stipends of EUR 350–700 depending on destination. Part-time work rights of 20 hours/week during term (EUR 400–600/month potential income) are the most reliable financial supplement available. Most Indian families finance the LSMU investment through Indian bank education loans — the low total cost (EUR 31–45K over 4 years) makes it loan-serviceable even on a Lithuanian nursing salary.",
    licensingPathway: [
      "Upon graduation, apply for nursing registration from Lithuania's State Health Care Accreditation Agency (VASPVT) to practise as a General Practice Nurse in Lithuanian healthcare settings.",
      "For the EU: Your LSMU BSc Nursing degree is automatically recognised under EU Directive 2005/36/EC — apply directly to the nursing regulatory body of your target EU country.",
      "For Germany (primary pathway): Begin German B2 language preparation from Year 1 in Kaunas. After graduation, apply for Anerkennung (credential recognition) with the relevant German state nursing authority — typically a streamlined process for EU-educated nurses. Apply for a skilled worker visa under Germany's Fachkräfteeinwanderungsgesetz.",
      "For the Netherlands, Sweden, or other EU countries: Achieve the relevant national language at B2 level. Apply for nursing credential recognition with the target country's nursing regulatory body.",
      "For the UK (NMC): Apply to the Nursing and Midwifery Council under the international route. Pass the NMC Computer-Based Test (CBT) and Objective Structured Clinical Examination (OSCE). Work under the NHS Health and Care Worker Visa.",
      "For the USA/Canada (NCLEX-RN): Apply through CGFNS (Commission on Graduates of Foreign Nursing Schools) for credential evaluation — the EU BSc in Nursing is accepted for assessment. Pass the NCLEX-RN examination for US nursing licensure.",
      "For India (return pathway): Apply to the Indian Nursing Council (INC) for verification of the LSMU EU nursing degree. Confirm current INC procedures at the time of graduation.",
    ],
  },
  programs: [
    {
      slug: "lsmu-bscn",
      title: "Bachelor of Science in Health Sciences (General Practice Nurse) — LSMU Kaunas",
      durationYears: 4,
      annualTuitionUsd: 4644,
      totalTuitionUsd: 18576,
      livingUsd: 7100,
      officialFeeCurrency: "EUR",
      officialAnnualTuitionAmount: 4300,
      officialTotalTuitionAmount: 17200,
      officialProgramUrl: "https://lsmu.lt/study/bachelor-of-science-health-sciences/",
      medium: "English",
      published: true,
      intakeMonths: ["September"],
      feeVerifiedAt: "2026-06-16",
      fxRateDate: "2026-06-16",
      fxRateSourceUrl:
        "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
      feeNotes:
        "Annual tuition for international students is EUR 4,300/year (fixed for all 4 years). One-time fees: EUR 150 application + EUR 250 registration = EUR 400. USD conversion at EUR 1 = USD 1.08 (June 2026 ECB rate). Monthly living costs in Kaunas: EUR 450–700 budget (EUR 700–1,000 comfortable); USD 7,100/year used as conservative annual living estimate. Part-time work (20 hours/week, EUR 5.65/hour minimum) can generate EUR 400–600/month toward living costs.",
      teachingPhases: [
        {
          phase: "Year 1 — Foundations (60 ECTS)",
          language: "English",
          details:
            "Humanitarian and Social Sciences, Biomedical Sciences, Health Care, Nursing Techniques. Foundation scientific knowledge: anatomy (1 and 2), physiology, microbiology, biochemistry, histology. Core professional nursing theory and introduction to nursing techniques. Medical terminology and academic English. Simulation lab training for fundamental nursing skills. First observation in clinical settings.",
        },
        {
          phase: "Year 2 — Clinical Entry (60 ECTS)",
          language: "English",
          details:
            "Environment and Health Sciences, Nursing Theory and Practice, Basics of Clinical Subjects. Pathophysiology, pharmacology, health assessment across the lifespan, adult and community nursing foundations. First supervised clinical placements in healthcare settings — students apply Year 1 theory to real patient care under faculty supervision at Kauno Klinikos medical and surgical wards.",
        },
        {
          phase: "Year 3 — Specialisation (60 ECTS)",
          language: "English",
          details:
            "Adult Nursing (in-depth), Pedagogic Module, Nursing Administration and Research. Specialty rotations: mental health nursing, maternal and child health, community nursing, oncology, neurology. Research methodology and evidence-based nursing practice. Clinical placement hours increase significantly across specialty departments at Kauno Klinikos and affiliated hospitals.",
        },
        {
          phase: "Year 4 — Advanced Practice (60 ECTS)",
          language: "English",
          details:
            "Special Nursing, Geriatric Nursing, Final Clinical Practice Examination, Bachelor's Thesis. Advanced clinical rotations in oncology, neurology, paediatrics, interventional radiology, intensive care, and geriatrics. Extended consolidation clinical placement with preceptor-supervised independent nursing practice. Final clinical practice examination and defence of Bachelor's thesis (research under faculty supervision).",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 4644,
          hostelUsd: 1944,
          livingUsd: 5184,
          totalUsd: 11772,
          notes:
            "Setup costs in Year 1 (winter clothing, SIM, arrival essentials) add approximately $300–500. LSMU university dormitory EUR 125–200/month recommended for Year 1. Living estimate includes food, transport, health insurance, phone, and miscellaneous at mid-budget EUR 400/month. Exchange rate EUR 1 = USD 1.08.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 4644,
          hostelUsd: 1944,
          livingUsd: 5184,
          totalUsd: 11772,
          notes:
            "Clinical placements begin in Year 2. Part-time work earnings (20 hours/week) can offset EUR 400–600/month of living costs. TRP renewal due approximately this year — budget EUR 120 renewal fee.",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 4644,
          hostelUsd: 1944,
          livingUsd: 5184,
          totalUsd: 11772,
          notes:
            "Specialty clinical rotations in Year 3. German language classes (if enrolled in Kaunas for the Germany career pathway) add approximately EUR 500–800/year.",
        },
        {
          yearLabel: "Year 4",
          tuitionUsd: 4644,
          hostelUsd: 1944,
          livingUsd: 5184,
          totalUsd: 11772,
          notes:
            "Advanced clinical rotations and Bachelor's thesis in Year 4. Final clinical practice examination. Begin post-graduation TRP or job application process toward end of Year 4. TRP renewal due — budget EUR 120 fee.",
        },
      ],
      licenseExamSupport: [
        "Lithuanian VASPVT registration — domestic nursing licence on graduation to practise in Lithuania",
        "EU Directive 2005/36/EC — automatic recognition to work in any of 27 EU countries",
        "Germany Anerkennung (credential recognition) — streamlined process for EU-educated nurses; B2 German required",
        "UK NMC international registration — CBT (Computer-Based Test) and OSCE (practical examination) required",
        "NCLEX-RN (USA/Canada) — EU BSc Nursing eligible for CGFNS credential evaluation",
        "INC India verification — EU degree can be verified by Indian Nursing Council for India-return practice",
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
    console.log("🌍 Upserting country: Lithuania…");

    const countryResult = await client.query(
      `
      INSERT INTO countries (
        slug, name, region, summary, why_students_choose_it,
        climate, currency_code, meta_title, meta_description,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name                   = EXCLUDED.name,
        region                 = EXCLUDED.region,
        summary                = EXCLUDED.summary,
        why_students_choose_it = EXCLUDED.why_students_choose_it,
        climate                = EXCLUDED.climate,
        currency_code          = EXCLUDED.currency_code,
        meta_title             = EXCLUDED.meta_title,
        meta_description       = EXCLUDED.meta_description,
        updated_at             = NOW()
      RETURNING id
      `,
      [
        LITHUANIA_COUNTRY.slug,
        LITHUANIA_COUNTRY.name,
        LITHUANIA_COUNTRY.region,
        LITHUANIA_COUNTRY.summary,
        LITHUANIA_COUNTRY.whyStudentsChooseIt,
        LITHUANIA_COUNTRY.climate,
        LITHUANIA_COUNTRY.currencyCode,
        LITHUANIA_COUNTRY.metaTitle,
        LITHUANIA_COUNTRY.metaDescription,
      ]
    );

    const lithuaniaId = countryResult.rows[0].id;
    console.log(`✓ Lithuania upserted (id=${lithuaniaId})`);

    console.log("\n🏫 Upserting university: Lithuanian University of Health Sciences…");

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
    console.log("\n✅ LSMU Lithuania BSc Nursing seeded successfully.");
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
