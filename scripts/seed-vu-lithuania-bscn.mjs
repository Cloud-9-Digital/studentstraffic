/**
 * Seed Vilnius University — Bachelor of Health Sciences (General Practice Nurse), Lithuania.
 * Source: Students Traffic Vilnius University Nursing Guide, June 2026.
 * Run: node scripts/seed-vu-lithuania-bscn.mjs
 *
 * Prerequisites: Lithuania must already exist in the countries table.
 * Run seed-lsmu-lithuania-bscn.mjs first if it hasn't been run.
 *
 * This script:
 *   1. Looks up Lithuania from the countries table
 *   2. Upserts Vilnius University into the universities table
 *   3. Upserts the BSc Nursing programme offering (course ID 15)
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
  slug: "vilnius-university-bscn",
  name: "Vilnius University — Bachelor of Health Sciences (General Practice Nurse)",
  city: "Vilnius",
  type: "Public",
  establishedYear: 1579,
  officialWebsite: "https://vu.lt",
  summary:
    "Vilnius University (VU) is Lithuania's oldest and highest-ranked public university — founded in 1579, ranked QS #446 globally (2026), and #1 in Lithuania. The 4-year Bachelor of Health Sciences (General Practice Nurse) is a 240 ECTS, fully English-taught programme housed in the Faculty of Medicine's Department of Midwifery and Nursing. Clinical training is delivered at Vilnius University Hospital Santaros Klinikos — VU's own teaching hospital, with 1,409 doctors, 1,978 nurses, and 35 specialised medical centres. The programme uses a classical teaching model building a rigorous biomedical foundation before intensive clinical training. The EU university BSc is automatically recognised across all 27 EU member states under Directive 2005/36/EC, and VU's QS ranking strengthens Anerkennung recognition in Germany and NMC assessment in the UK. Annual tuition is EUR 6,000. For Indian students, VU offers six entry pathways including standard Class 12 entry, second-degree entry (for Indian BSc Nursing graduates), and a unique Supplementary Studies pathway enabling Professional Bachelor holders to access VU's MSc in Advanced Practice Nursing.",
  campusLifestyle:
    "Vilnius University's Faculty of Medicine is located at M. K. Ciurlionio str. 21, Vilnius — a modern medical campus integrated with the clinical environment of Santaros Klinikos teaching hospital. VU is a comprehensive research university with 12 faculties across Vilnius and a branch campus in Kaunas, enrolling approximately 15,000–20,000 students including 750+ new international students annually from 90+ countries. VU is a member of the Arqus European University Alliance — a network of elite European research universities — and the European University Association (EUA), reflecting its standing as a genuine research institution, not merely a teaching college. Nursing students benefit from the full VU student services ecosystem: the VU International Office (visa guidance, accommodation, administrative support), Erasmus+ access at 750+ partner institutions globally, VU dormitories at EUR 70–180/month, psychological counselling, academic mentoring, and career services. VU's research output of 34,000+ indexed publications places it among the leading research institutions of Central and Eastern Europe. The nursing programme launched its English-taught bachelor's in September 2019, with the Department of Nursing subsequently expanding in September 2025 with the launch of a Midwifery programme. The department actively participates in national and international nursing research — VU nursing graduates can contribute to nursing policy development and academic work in ways not possible with college-level nursing qualifications.",
  cityProfile:
    "Vilnius is Lithuania's capital and largest city (population approximately 590,000) — a modern European capital with a UNESCO World Heritage Old Town, a booming tech and startup scene, the country's best part-time job market, and the most developed Indian community infrastructure in Lithuania. For Indian students, Vilnius offers Indian restaurants, grocery stores with cooking staples and spices, and a growing Indian student network across multiple universities. Vilnius Airport (Ryanair, Wizz Air, Air Baltic) connects to London, Berlin, Dublin, Barcelona, Oslo, and across Europe at EUR 15–50. The city is a Schengen hub — the Lithuanian TRP allows travel across 26 European countries during holidays. Monthly living costs: EUR 535–1,135, depending on accommodation (VU dormitory EUR 70–180/month vs private shared room EUR 200–450/month). Vilnius ranks in the QS Best Student Cities, recognised globally as a positive student environment. Lithuania is an EU and NATO member state — Vilnius is consistently rated one of the safest European capitals. Climate: cold Baltic winters (-5 to -15°C, November–March) and pleasant summers (18–26°C with long daylight hours). Budget INR 10,000–20,000 for winter clothing in Year 1.",
  clinicalExposure:
    "Vilnius University BSc Nursing students train at Vilnius University Hospital Santaros Klinikos — VU's own jointly operated teaching hospital (with Lithuania's Ministry of Health) and one of the leading clinical institutions in the Baltic region. Santaros Klinikos has 1,409 doctors, 1,978 nurses, 5,372 total employees, and 370+ professors and doctorates providing patient care, ensuring academic and clinical roles are fully integrated. The hospital operates across 7 clinical groups (Surgery, Therapy, Diagnostics, Heart and Vascular, Mother and Child, Outpatient, and Clinical Services) and 35 specialised medical centres including neurology, cardiology, oncology, nephrology, haematology, and paediatrics. Affiliated divisions include the National Cancer Centre and Zalgirio Klinikos (odontology). Clinical training progresses year by year: Year 1 — introductory observation, simulation labs, ward orientation; Year 2 — supervised direct patient care in medical and surgical wards, outpatient settings, community health; Year 3 — specialty rotations across mental health, maternal and obstetric, paediatric, geriatric, and rehabilitation departments; Year 4 — advanced clinical practice in critical care, intensive care, and anaesthesiology units, with an extended consolidated preceptorship placement. A dedicated advanced module 'Formation of Practical Skills in Critical Care Medicine, Anaesthesiology, and Intensive Care Nursing' in Year 4 is a distinguishing feature of VU's programme. Clinical research integration means students at Santaros Klinikos are exposed to the latest evidence-based practice, not just routine clinical procedures.",
  hostelOverview:
    "VU dormitories are available to international students at EUR 70–180/month — located near academic campuses, with communal utilities typically included. This is significantly below private market rates in Vilnius (EUR 200–450/month for a shared room). Dormitory places are competitive — apply immediately after receiving your admission offer. VU's International Office provides guidance on dormitory applications and alternative private accommodation. For students not accommodated in VU dormitories, shared apartments near the Faculty of Medicine campus or in central Vilnius typically cost EUR 200–350/month per person. Students Traffic provides Vilnius accommodation guidance and connects incoming VU students with existing Indian students before arrival.",
  indianFoodSupport:
    "Vilnius has the most developed Indian food infrastructure of any Lithuanian city. Indian restaurants, Asian grocery stores, and supermarkets stocking basmati rice, lentils, chickpeas, spices, and cooking essentials are all established in the capital. A growing Indian student and professional community (across VU and other Vilnius universities) provides a social network and shared knowledge of where to shop and how to settle in. Halal meat is available at specialised butchers and some supermarkets. Most Indian students cook at home — the most budget-friendly approach at EUR 150–200/month for groceries. Students Traffic connects all enrolled VU students with the existing Indian student network in Vilnius before arrival.",
  safetyOverview:
    "Vilnius is consistently rated one of the safest European capitals. Lithuania is an EU and NATO member state with stable democratic governance, a low violent crime rate, and European standards for civil safety, emergency services, and rule of law. The large international student community (750+ new international students annually from 90+ countries) at VU means Indian students are not isolated or conspicuous. Indian students — including female students — at Vilnius universities consistently report feeling safe and welcomed. Standard urban precautions apply (stay aware late at night, use reputable transport), but no exceptional safety concerns have been reported.",
  studentSupport:
    "VU's International Office assists international students with visa/TRP guidance, accommodation, and administrative registration. VU runs dedicated welcome and orientation programmes for international students. Erasmus+ ambassador networks, psychological counselling, academic mentoring, and career services are all available. VU provides enrolled students with a mediation number for VFS Global appointment booking and TRP renewal guidance annually. The VU library, Moodle LMS, and digital academic resources are accessible to all enrolled students. Students Traffic provides end-to-end support: pathway eligibility assessment (5-year gap rule check, subject verification, IELTS planning), motivation letter coaching (all 7 required VU questions), motivational interview preparation, complete application management at apply.vu.lt, MEA Apostille coordination, tuition payment deadline monitoring (15-day window after Pre-Acceptance Letter), MIGRIS registration, VFS Global appointment coordination, Vilnius dormitory application guidance, pre-departure briefing (winter clothing, arrival checklist, Indian community contacts), and annual TRP renewal reminders.",
  whyChoose: [
    "Lithuania's highest-ranked university — QS #446 globally (2026), #1 in Lithuania, #19 in QS EECA. A Vilnius University BSc Nursing is the most prestigious nursing qualification from Lithuania, carrying significantly more international weight than college-level professional bachelor degrees, particularly in German Anerkennung recognition and UK NMC assessment.",
    "Founded in 1579 — one of the oldest universities in Eastern Europe (446+ years of academic heritage). Arqus European University Alliance member, EUA member. VU's research university standing means graduates have access to PhD programmes in nursing and biomedical sciences — a pathway not available from college-level nursing qualifications.",
    "Santaros Klinikos teaching hospital — VU's own jointly operated hospital with 1,409 doctors, 1,978 nurses, 35 specialised medical centres, and direct research integration. Clinical training is at the highest level of healthcare in the Lithuanian capital, across all major specialities including critical care, anaesthesiology, oncology, neurology, and paediatrics.",
    "Six entry pathways for Indian students — standard Class 12 entry, A-Level/IB entry, second-degree entry (for Indian BSc Nursing graduates bypassing the 5-year gap rule), Professional Bachelor upgrade entry, Foundation Year pathway, and the unique Supplementary Studies route enabling college nursing graduates to access VU's MSc. More ways to get in than any other Lithuanian nursing programme.",
    "Unique Supplementary Studies pathway — Professional Bachelor holders (from SMK, LSMU college, or other Lithuanian colleges) can complete VU's Supplementary Studies to reach university BSc competency level, then enrol in VU's MSc Advanced Practice Nursing. The strategic combination SMK (3.5yr) + VU Supplementary Studies + VU MSc achieves master-level qualification from Lithuania's top university at a lower total cost than doing VU's BSc directly.",
    "Vilnius location with the best Indian community in Lithuania — Indian restaurants, grocery stores, the country's best part-time job market, Vilnius Airport budget flights across Europe, and a large international student community (90+ nationalities). The capital city location translates to better clinical connections, better employment opportunities after graduation, and better quality of life during studies.",
    "EU university BSc — 240 ECTS, fully Bologna-compliant, automatically recognised across 27 EU member states under Directive 2005/36/EC. Unlike Professional Bachelor degrees, the VU university BSc also opens PhD pathways and carries the university research prestige that matters for advanced nursing careers, teaching positions, and academic work.",
  ],
  thingsToConsider: [
    "IELTS 6.5 requirement — significantly higher than LSMU (5.5) and SMK (5.5). This is the most common eligibility barrier for Indian students. Students with IELTS 5.5–6.0 should pursue the Foundation Year pathway (spending one year bringing English to 6.5 standard) rather than applying to VU prematurely.",
    "5-year gap rule for non-EU applicants — students who completed Class 12 before 2021 cannot apply via the standard Class 12 route in 2026. They must use an alternate pathway: a subsequent bachelor's degree, A-Level/IB, or Foundation Year. This rule catches many Indian students off-guard — verify your gap year status before spending EUR 100 on the application fee.",
    "Biology + English + Chemistry/Physics/Maths required at Class 12 — students who did not study Biology are ineligible. Students who did not take Chemistry, Physics, or Mathematics alongside Biology and English are also ineligible. Arts or commerce backgrounds without these science subjects cannot apply.",
    "Higher tuition at EUR 6,000/year — EUR 1,700/year more than LSMU (EUR 4,300) and EUR 1,600/year more than SMK (EUR 4,400). Over 4 years, this adds up to EUR 6,800–7,200 more in tuition alone. The premium is justified by the higher QS ranking, capital city location, and teaching hospital quality — but families should budget carefully.",
    "May 1 application deadline for Indian students — two months earlier than LSMU (July 6). Combine this with the 15-day tuition payment requirement after Pre-Acceptance Letter and 2-month TRP processing time, and Indian students must begin the VU application process in February or March for a September 1 start. Late starters miss the window.",
    "EUR 6,000 first-year tuition must be paid within 15 calendar days of Pre-Acceptance Letter — this is a hard deadline. Only after payment does VU issue the full Acceptance Letter needed for the TRP application. Students and families must have the funds readily available before receiving the Pre-Acceptance Letter.",
    "Not accepted from Bangladesh, Nepal, Pakistan — VU's application portal explicitly states applications from these citizenships are not accepted for the nursing programme. Indian citizens are fully accepted. Students Traffic confirms current status for each intake.",
  ],
  bestFitFor: [
    "Indian Class 12 students (within 5 years of graduation) with Biology + English + Chemistry/Physics/Maths, IELTS 6.5+, and strong academic marks who want Lithuania's most prestigious nursing degree from a QS-ranked public research university.",
    "Indian BSc Nursing graduates who want an EU-recognised university degree — using the second-degree entry pathway (Pathway 3) that bypasses the 5-year Class 12 gap rule and may allow credit transfer from the Indian nursing degree.",
    "Students who currently have IELTS 5.5–6.0 and are willing to invest one year in a Foundation Year programme to reach IELTS 6.5 and then apply to VU — targeting the most prestigious Lithuanian option rather than settling for a less competitive alternative.",
    "SMK Professional Bachelor nursing graduates (or those planning to study at SMK) who want to access VU's MSc Advanced Practice Nursing via the Supplementary Studies bridge programme — a cost-efficient multi-year strategy to achieve master-level qualification from Lithuania's top university.",
    "Students targeting research careers, academic nursing, or PhD-level study — VU's research university foundation, 34,000+ indexed publications, and direct research integration at Santaros Klinikos uniquely prepare graduates for these career tracks.",
    "Families willing to invest EUR 6,000/year for the additional prestige, clinical training quality (Santaros Klinikos), Vilnius capital location, and QS-ranked university BSc that carries maximum recognition weight in Germany, the UK, and beyond.",
  ],
  teachingHospitals: [
    "Vilnius University Hospital Santaros Klinikos — VU's own jointly operated teaching hospital (1,409 doctors, 1,978 nurses, 35 specialised centres, 5,372 total staff)",
    "Santaros Klinikos clinical groups: Surgery, Therapy, Diagnostics, Heart and Vascular, Mother and Child, Outpatient, and Clinical Services",
    "National Cancer Centre — oncology nursing placements (affiliated with Santaros Klinikos)",
    "Zalgirio Klinikos — odontology and oral surgery (VU Faculty affiliate)",
    "Community health centres and primary care outpatient clinics across Vilnius for community nursing placements",
    "Mental health institutions in Vilnius — psychiatric nursing rotations",
    "Specialist outpatient departments — neurology, cardiology, nephrology, haematology, paediatric clinics",
  ],
  recognitionBadges: [
    "QS World Ranking #446 (2026) — #1 in Lithuania, #19 in EECA",
    "THE World Ranking #801 (2026)",
    "ARWU Shanghai #501 (2025)",
    "SKVC Accredited — Lithuanian Higher Education Quality Assurance Agency",
    "EU Directive 2005/36/EC — Automatic Professional Qualifications Recognition across 27 EU member states",
    "240 ECTS — Bologna Process Compliant (EU standard for 4-year university BSc)",
    "Arqus European University Alliance Member",
    "EUA Member — European University Association",
    "CGFNS Eligible — USA/Canada NCLEX-RN pathway via credential evaluation",
  ],
  recognitionLinks: [
    {
      label: "Vilnius University Official Website",
      url: "https://vu.lt",
    },
    {
      label: "VU Admissions Portal",
      url: "https://apply.vu.lt",
    },
    {
      label: "VU Faculty of Medicine — Department of Nursing",
      url: "https://admissions.vu.lt",
    },
    {
      label: "Vilnius University Hospital Santaros Klinikos",
      url: "https://www.santa.lt",
    },
    {
      label: "MIGRIS — Lithuanian Migration Information System",
      url: "https://migris.lt",
    },
  ],
  similarUniversitySlugs: [
    "lithuanian-university-of-health-sciences-bscn",
    "smk-college-applied-sciences-bscn",
  ],
  lastVerifiedAt: "2026-06-17",
  researchSources: [
    {
      label: "Vilnius University Official Website — vu.lt",
      url: "https://vu.lt",
      kind: "official-university",
      checkedAt: "2026-06-17",
    },
    {
      label: "VU Admissions — admissions.vu.lt",
      url: "https://admissions.vu.lt",
      kind: "official-program",
      checkedAt: "2026-06-17",
    },
    {
      label: "Vilnius University Hospital Santaros Klinikos — santa.lt",
      url: "https://www.santa.lt",
      kind: "official-university",
      checkedAt: "2026-06-17",
    },
    {
      label: "MIGRIS — Lithuanian Migration Department",
      url: "https://migris.lt",
      kind: "government",
      checkedAt: "2026-06-17",
    },
    {
      label: "Students Traffic Vilnius University Nursing Guide — June 2026",
      url: "https://studentstraffic.com",
      kind: "other",
      checkedAt: "2026-06-17",
    },
  ],
  faq: [
    {
      question: "Is the Vilnius University BSc Nursing the most prestigious nursing degree in Lithuania?",
      answer:
        "Yes. Vilnius University is Lithuania's oldest (founded 1579) and highest-ranked public university (QS #446, 2026 — #1 in Lithuania). The BSc Nursing is a full university bachelor's degree (not a college professional bachelor), taught at the Faculty of Medicine, with clinical training at Santaros Klinikos — VU's own teaching hospital with 1,409 doctors and 35 specialised medical centres. For Indian students who meet the requirements, VU is the aspirational choice in Lithuanian nursing education.",
    },
    {
      question: "What subjects do I need at Class 12 for VU Nursing?",
      answer:
        "Biology (mandatory) + English + ONE of: Chemistry, Physics, or Mathematics. All three subject groups must be present in your Class 12 record. Students without Biology are not eligible. Additionally, for non-EU applicants including Indians, the gap since completing secondary school must not exceed 5 years at the time of application — students who passed Class 12 before 2021 need to apply via an alternate pathway (prior degree, foundation year, etc.).",
    },
    {
      question: "What IELTS score does VU Nursing require?",
      answer:
        "IELTS Academic 6.5 or above. This is significantly higher than LSMU (IELTS 5.5+) and SMK (IELTS 5.5+) and reflects VU's research university standard. Equivalents: TOEFL iBT 81+, PTE Academic 59+, Duolingo 120+, Cambridge 176+. Students with IELTS below 6.5 should consider a Foundation Year programme to reach the required standard before applying to VU.",
    },
    {
      question: "What are the 6 entry pathways for Indian students at Vilnius University?",
      answer:
        "Pathway 1 — Standard Class 12 entry (within 5-year gap rule, with Biology+English+Science). Pathway 2 — A-Level/IB Diploma or international pre-university qualification. Pathway 3 — Second degree entry for Indian graduates (any bachelor's degree bypasses the 5-year Class 12 gap rule). Pathway 4 — Entry after a Professional Bachelor from SMK or other Lithuanian college. Pathway 5 — Foundation Year at SMK or similar, then apply to VU with IELTS 6.5+. Pathway 6 — Supplementary Studies at VU for Professional Bachelor holders wanting to access VU's MSc in Advanced Practice Nursing.",
    },
    {
      question: "What is the total 4-year cost at Vilnius University?",
      answer:
        "Total tuition: EUR 24,000 (EUR 6,000 x 4 years). Application fee: EUR 100 (non-refundable, paid via Flywire). Living costs in Vilnius: EUR 535–1,135/month — approximately EUR 25,680–54,480 over 4 years, depending on VU dormitory (EUR 70–180/month) vs private accommodation (EUR 200–450/month). Visa/TRP costs: EUR 480–700. Grand total all-in: approximately EUR 50,260–79,280 (INR 45–71 lakhs). Part-time work (20 hours/week at EUR 5.65/hour minimum) generates EUR 450–490/month — partially offsetting Vilnius living costs.",
    },
    {
      question: "What makes Santaros Klinikos special as VU's teaching hospital?",
      answer:
        "Santaros Klinikos is Vilnius University's own teaching hospital, jointly operated with Lithuania's Ministry of Health. It has 1,409 doctors, 1,978 nurses, 5,372 total staff, and 370+ professors providing direct patient care — meaning academic and clinical roles are fully integrated. The hospital operates 35 specialised medical centres including neurology, cardiology, oncology, nephrology, haematology, and paediatrics, plus a Level III emergency centre. This is not a partnership with an external hospital — it is VU's own clinical infrastructure, making it directly embedded in the nursing programme.",
    },
    {
      question: "What is VU's application deadline for Indian students?",
      answer:
        "1 May 2026 for non-EU/Indian applicants — significantly earlier than LSMU (6 July) or SMK (1 July). After admission, the first-year tuition (EUR 6,000) must be paid within 15 calendar days of the Pre-Acceptance Letter to trigger the full Acceptance Letter needed for the TRP application. Indian students should submit their VU application in February or March 2026 at the latest to allow adequate time for the full admission and visa process before the September 1 start.",
    },
    {
      question: "Can I work in Germany after graduating from Vilnius University?",
      answer:
        "Yes. VU's QS-ranked university BSc Nursing is well-received in German Anerkennung (recognition) processes — a stronger credential than a college Professional Bachelor. German B2 language proficiency is additionally required for clinical nursing practice (mandatory, non-negotiable). Entry-level German nursing salary: EUR 2,800–3,800/month gross (approximately INR 2.52–3.42 lakhs/month). Germany needs 150,000+ additional nurses by 2027, with active international recruitment. Begin German language preparation from Year 1 of the VU programme if Germany is your career target.",
    },
  ],
  admissionsContent: {
    overview:
      "VU accepts applications via apply.vu.lt with one intake per year — Fall (September 1). The application deadline for non-EU/Indian applicants is 1 May 2026. The EUR 100 application fee (paid via Flywire only — no other payment method accepted) must be received before the application is reviewed. After shortlisting, VU conducts an individual motivational interview. Admitted students must pay the first-year tuition (EUR 6,000) within 15 calendar days of the Pre-Acceptance Letter — only after payment does VU issue the full Acceptance Letter required for the TRP visa application. Students Traffic manages the complete VU application process: eligibility assessment, pathway identification, document Apostille, motivation letter coaching (all 7 required VU questions), interview preparation, fee payment coordination, and full Lithuania TRP application.",
    eligibility: {
      intro:
        "Entry requirements for Indian students applying to the VU Bachelor of Health Sciences (General Practice Nurse) via the standard Class 12 pathway:",
      items: [
        "Class 10+2 (CBSE, CISCE, or any recognised State Board) with Biology (mandatory) + English + one of Chemistry / Physics / Mathematics",
        "5-year gap rule: for non-EU applicants, the gap since completing secondary school must NOT exceed 5 years at the time of application — students who completed Class 12 before 2021 must apply via alternate pathway (prior degree, foundation year)",
        "English proficiency: IELTS Academic 6.5+ / TOEFL iBT 81+ / PTE Academic 59+ / Duolingo 120+ / Cambridge English 176+",
        "Motivation letter answering VU's 7 specified questions — mandatory, described by VU as having 'tremendous value' in the assessment",
        "Motivational interview (individual, typically online) — after shortlisting by VU",
        "All documents in English or with authorised English translations + MEA Apostille from Indian Ministry of External Affairs",
        "Applications NOT accepted from Bangladesh, Nepal, or Pakistan citizens. Indian citizens are fully accepted.",
        "EUR 100 non-refundable application fee paid via Flywire only — application not reviewed until fee is received",
      ],
    },
    admissionSteps: [
      "Verify eligibility with Students Traffic — 5-year gap rule check, Class 12 subject verification (Biology + English + Chemistry/Physics/Maths), IELTS 6.5 status, and correct pathway identification before spending EUR 100 on the application fee",
      "Prepare documents: Class 10 and 12 certificates and marksheets — certified true copies + authorised English translations (if in Hindi or regional language) + MEA Apostille. Valid passport copy. IELTS Academic 6.5+ certificate. Passport-type photograph. Prior degree documents if applying via Pathway 3.",
      "Write the motivation letter answering VU's 7 required questions: (1) Why have I chosen this programme? (2) What do I expect to gain? (3) Why does my background make me suitable? (4) How will the programme help me achieve my goals? (5) What are my strengths? (6) What are my weaknesses? (7) How do I plan to finance my studies? Students Traffic coaches this letter — it is a critical determinant of shortlisting.",
      "Submit application at apply.vu.lt, select nursing (Course Code 6121GX019), upload all documents and motivation letter, pay EUR 100 application fee via Flywire. Deadline: 1 May 2026 for Indian/non-EU applicants.",
      "Attend motivational interview — individual online session after shortlisting by VU. Assesses academic suitability, nursing motivation, and English communication. Decision issued shortly after.",
      "Receive Pre-Acceptance Letter — pay EUR 6,000 first-year tuition within 15 calendar days. Only after payment does VU issue the full Acceptance Letter (LOA) required for the TRP application. Do not miss this 15-day window.",
      "Begin TRP process with full Acceptance Letter: register on MIGRIS (migris.lt) to get a MIGRIS number; request VU mediation number from the Faculty of Medicine admissions office; book VFS Global appointment in India; submit physical documents + biometrics; pay EUR 120 visa fee",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet and certificate — certified true copy + MEA Apostille",
        "Class 12 marksheet and certificate with Biology + English + Chemistry/Physics/Maths — certified true copy + MEA Apostille",
        "Authorised English translations of all documents not originally in English",
        "IELTS Academic 6.5+ certificate (or TOEFL iBT 81+ / PTE 59+ / Duolingo 120+ / Cambridge 176+)",
        "Valid passport copy (validity well beyond programme end date)",
        "Passport-size photograph",
        "Motivation letter (7 required VU questions answered — prepared carefully)",
        "Prior university degree and transcripts (if applying via Pathway 3 — second degree entry)",
      ],
      visa: [
        "VU Full Acceptance Letter (issued only after first-year tuition payment of EUR 6,000)",
        "Proof of first-year tuition payment (EUR 6,000 via Flywire)",
        "VU mediation number for VFS Global appointment (request from VU Faculty of Medicine after admission)",
        "MIGRIS application number (from online TRP registration at migris.lt)",
        "Bank statement showing minimum EUR 3,648 (EUR 304/month x 12) for living costs",
        "Accommodation confirmation — VU dormitory booking or private rental address in Vilnius",
        "Valid health insurance covering all Schengen countries — minimum EUR 6,000 sum insured",
        "Passport photograph (3x4 cm)",
        "Police Clearance Certificate from India",
        "National Visa D / TRP fee: EUR 120 (regular) or EUR 240 (urgent)",
      ],
    },
    deadlinesNote:
      "Non-EU/Indian applicant deadline is 1 May 2026 — two months earlier than LSMU (July 6) or SMK (July 1). After admission, the EUR 6,000 first-year tuition must be paid within 15 calendar days (hard deadline — no extensions). TRP processing takes up to 2 months. The full timeline from application to TRP approval requires approximately 4–5 months. Indian students must begin the VU application process in February or March 2026 to safely reach September 1. Students Traffic strongly recommends submitting by 15 March 2026 for the Fall 2026 intake.",
    scholarshipInfo:
      "VU does not advertise automatic merit scholarships exclusively for non-EU nursing bachelor's students. VU Talent Scholarships based on academic merit are available — check vu.lt/en/students/services-for-students/finance for current criteria. Lithuanian Government scholarships (via studyin.lt) offer funding for some eligible non-EU students in specific fields. Erasmus+ exchange semesters provide EUR 350–700/month living stipends. VU dormitories at EUR 70–180/month substantially reduce living costs vs private accommodation (EUR 200–450/month) — apply for dormitory immediately after admission. Part-time work (20 hours/week, EUR 5.65/hour minimum) generates EUR 450–490/month in Vilnius — the city has the best part-time job market in Lithuania. Indian education loans (SBI, HDFC Credila, Axis, Avanse) are available for QS-ranked public university programmes — VU's QS #446 ranking makes it one of the strongest international loan files available.",
    licensingPathway: [
      "Upon graduation, register with VASPVT (State Health Care Accreditation Agency) for a Lithuanian nursing practice licence to work as a General Practice Nurse in Lithuanian healthcare. VU's clinical network at Santaros Klinikos provides strong post-graduation employment connections in Vilnius.",
      "EU-wide: VU's BSc Nursing is automatically recognised across all 27 EU member states under EU Directive 2005/36/EC — apply directly to the nursing regulatory body of your target country.",
      "Germany (primary pathway): Begin German B2 language training from Year 1. After graduation, submit the university BSc for Anerkennung (credential recognition) with the German state nursing authority. VU's QS-ranked university BSc is well-received in German recognition processes. Apply for a skilled worker visa under Germany's Fachkräfteeinwanderungsgesetz. Entry-level salary: EUR 2,800–3,800/month gross.",
      "Netherlands, Sweden, Ireland, or other EU countries: Achieve the relevant national language at B2 level. Apply for nursing credential recognition under EU Directive 2005/36/EC with the target country's regulatory body.",
      "UK (NMC): Apply to the Nursing and Midwifery Council under the international route. VU's QS-ranked university BSc is well-received by NMC assessors. Pass NMC Computer-Based Test (CBT) and Objective Structured Clinical Examination (OSCE). NHS Band 5 salary: GBP 29,970–36,483/year.",
      "USA/Canada (NCLEX-RN): VU BSc Nursing accepted for CGFNS credential evaluation for US nursing licensure. Pass NCLEX-RN. US entry-level RN salary: USD 4,000–7,000/month.",
      "Academic/Research pathway: VU BSc Nursing graduates can proceed to VU's MSc in Advanced Practice Nursing and then to PhD in nursing or biomedical sciences — a pathway unique to research university graduates.",
      "India (return pathway): Submit the VU EU university degree to the Indian Nursing Council (INC) for verification. VU's QS ranking and EU university status make it among the strongest international nursing credentials for Indian premium private hospital employment.",
    ],
  },
  programs: [
    {
      slug: "vu-bscn",
      title: "Bachelor of Health Sciences (General Practice Nurse) — Vilnius University, Lithuania (QS #446, 4 Years, 240 ECTS)",
      durationYears: 4,
      annualTuitionUsd: 6480,
      totalTuitionUsd: 25920,
      livingUsd: 8600,
      officialFeeCurrency: "EUR",
      officialAnnualTuitionAmount: 6000,
      officialTotalTuitionAmount: 24000,
      officialProgramUrl: "https://admissions.vu.lt",
      medium: "English",
      published: true,
      intakeMonths: ["September"],
      feeVerifiedAt: "2026-06-17",
      fxRateDate: "2026-06-17",
      fxRateSourceUrl:
        "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
      feeNotes:
        "Annual tuition for non-EU international students is EUR 6,000/year (fixed for all 4 years). One-time application fee: EUR 100 (non-refundable, paid via Flywire only). First-year tuition must be paid within 15 calendar days of the Pre-Acceptance Letter — only after payment is the full Acceptance Letter issued for TRP/visa. Total tuition: EUR 24,000. USD conversion at EUR 1 = USD 1.08 (June 2026 ECB rate). Monthly living costs in Vilnius: EUR 535–1,135 (VU dormitory EUR 70–180/month; private shared room EUR 200–450/month; food EUR 150–280; transport EUR 20–30; health insurance EUR 25–55; phone EUR 20–40; miscellaneous EUR 50–100). Annual living estimate of EUR 7,960 used for USD conversion ($8,597 approx $8,600). Part-time work rights (20 hours/week, EUR 5.65/hour minimum) generate EUR 450–490/month in Vilnius — the best part-time job market in Lithuania.",
      teachingPhases: [
        {
          phase: "Year 1 — Biomedical Foundations (60 ECTS)",
          language: "English",
          details:
            "Anatomy and Physiology, Histology, Microbiology, Biochemistry, Biophysics, Introduction to Nursing Science, Professional Nursing Ethics, Health Psychology, Medical Terminology. Classical teaching model — rigorous biomedical foundation built before clinical nursing training. Introductory clinical observation at Santaros Klinikos hospital: ward orientation, interaction with patients, nursing procedure observation. Simulation lab skills training. VU research university approach means theory and science are understood as the foundation of evidence-based nursing, not just a precursor to clinical training.",
        },
        {
          phase: "Year 2 — Pathophysiology and Core Nursing (60 ECTS)",
          language: "English",
          details:
            "Pathophysiology, Pharmacology, Health Assessment, General Nursing Theory and Practice, Nursing Procedures and Techniques, Community Health Nursing foundations, Nursing Communication. Supervised direct patient care begins — applying Year 1 biomedical knowledge to real patients in Santaros Klinikos medical and surgical wards under faculty supervision. Outpatient clinic rotations and community health centre placements. Students develop clinical reasoning and begin the integration of science and practice.",
        },
        {
          phase: "Year 3 — Specialised Clinical Nursing (60 ECTS)",
          language: "English",
          details:
            "Adult Nursing (Medical and Surgical), Mental Health Nursing, Maternal and Obstetric Nursing, Paediatric and Child Nursing, Geriatric Nursing, Rehabilitation Nursing, Research Methods, Evidence-Based Nursing Practice. Clinical placements intensify significantly — specialty rotations across mental health wards, maternal/child health units, paediatric departments, geriatric care, and rehabilitation at Santaros Klinikos and affiliated hospitals. Research methodology introduced for bachelor's thesis preparation.",
        },
        {
          phase: "Year 4 — Advanced Practice and Thesis (60 ECTS)",
          language: "English",
          details:
            "Critical Care and Intensive Care Nursing, Anaesthesiology Nursing (including the dedicated advanced module: Formation of Practical Skills in Critical Care Medicine, Anaesthesiology, and Intensive Care Nursing), Nursing Leadership and Management, Nursing Ethics and Law. Extended Final Clinical Placement under preceptor supervision — working as a near-graduate nurse with increasing independence. Bachelor's Thesis preparation and defence (nursing research under faculty supervision). Graduation with Bachelor of Health Sciences and Professional Qualification: General Practice Nurse.",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 6480,
          hostelUsd: 1620,
          livingUsd: 6480,
          totalUsd: 14580,
          notes:
            "Year 1 setup costs (winter clothing, SIM, arrival essentials) add approximately $400–600. VU dormitory (EUR 70–180/month, avg EUR 125) strongly recommended for Year 1 — apply immediately after admission as places are competitive. Living estimate: food EUR 200/month + transport EUR 25 + health insurance EUR 40 + phone EUR 30 + miscellaneous EUR 100 = EUR 395/month. Exchange rate EUR 1 = USD 1.08. Apply to VU by February/March 2026 and pay EUR 100 application fee (Flywire). Budget EUR 6,000 first-year tuition payable within 15 days of Pre-Acceptance Letter.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 6480,
          hostelUsd: 1620,
          livingUsd: 6480,
          totalUsd: 14580,
          notes:
            "Supervised clinical placements begin in Year 2 at Santaros Klinikos. Part-time work (20 hours/week) in Vilnius generates EUR 450–490/month — the best part-time job market in Lithuania. TRP renewal required — budget EUR 120. German language classes recommended from Year 1 onwards for students targeting Germany (EUR 50–100/month if separately enrolled).",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 6480,
          hostelUsd: 1620,
          livingUsd: 6480,
          totalUsd: 14580,
          notes:
            "Specialty clinical rotations across mental health, maternal/child, paediatric, geriatric, and rehabilitation departments. Erasmus+ exchange semester may be available for eligible students at partner nursing schools (includes EUR 350–700/month Erasmus+ living stipend). TRP renewal required — budget EUR 120. Bachelor's thesis research begins in preparation for Year 4 defence.",
        },
        {
          yearLabel: "Year 4",
          tuitionUsd: 6480,
          hostelUsd: 1620,
          livingUsd: 6480,
          totalUsd: 14580,
          notes:
            "Advanced clinical rotations in critical care, ICU, and anaesthesiology — unique dedicated advanced module at Santaros Klinikos. Extended preceptorship placement with near-independent nursing practice. Bachelor's Thesis defence. Begin post-graduation TRP extension or employment applications at Santaros Klinikos or other Vilnius hospitals toward end of Year 4. TRP renewal required — budget EUR 120.",
        },
      ],
      licenseExamSupport: [
        "VASPVT Lithuania — nursing practice licence on graduation to practise as General Practice Nurse in Lithuania",
        "EU Directive 2005/36/EC — automatic professional recognition across all 27 EU member states",
        "Germany Anerkennung — QS-ranked university BSc well-received; B2 German proficiency required for clinical practice",
        "UK NMC international registration — QS-ranked university BSc well-received by NMC; CBT and OSCE required",
        "NCLEX-RN (USA/Canada) — VU EU university BSc eligible for CGFNS credential evaluation",
        "VU MSc Advanced Practice Nursing — direct progression for BSc Nursing graduates",
        "PhD in Nursing/Biomedical Sciences — research university route unique to VU graduates",
        "INC India verification — EU university degree from QS-ranked institution for return to nursing practice in India",
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

    console.log("\n🏫 Upserting university: Vilnius University…");

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
    console.log("\n✅ Vilnius University BSc Nursing seeded successfully.");
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
