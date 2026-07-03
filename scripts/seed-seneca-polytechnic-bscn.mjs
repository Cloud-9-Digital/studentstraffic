/**
 * Seed Seneca Polytechnic Honours BScN nursing programme for Canada.
 * Source: Students Traffic Honours BScN guide, 6 June 2026.
 * Run: node scripts/seed-seneca-polytechnic-bscn.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const CANADA_ID = 52;
const COURSE_BSC_NURSING_ID = 15;

const university = {
  slug: "seneca-polytechnic-bscn",
  name: "Seneca Polytechnic — Honours Bachelor of Science in Nursing",
  city: "King City",
  type: "Public",
  establishedYear: 1967,
  officialWebsite: "https://www.senecapolytechnic.ca/programs/full-time/BSN.html",
  summary:
    "Seneca Polytechnic (formerly Seneca College, rebranded 2023) is one of Ontario's largest public polytechnic institutions — founded in 1967 and enrolling 30,000+ full-time students from 150+ countries. Its Honours Bachelor of Science in Nursing (BScN) is delivered through the Seneca Nanji Foundation School of Nursing at King Campus, King City, York Region — 40 minutes north of downtown Toronto in the heart of the Greater Toronto Area. All three BScN streams (standard 4-year, 3-year Fast Track, and RPN Bridge) hold preliminary CNO approval. Graduates are eligible to write the NCLEX-RN, register with the College of Nurses of Ontario, and access a 3-year Post-Graduation Work Permit. For Indian students, Seneca's location in Canada's largest healthcare market — with Ontario's healthcare-priority Express Entry draws running at CRS 462–476 and the OINP adding 600 CRS points — makes this one of the most direct study-to-PR nursing pathways available.",
  campusLifestyle:
    "King Campus sits on 282 hectares of woods, lake, and fields in King City, York Region — a focused health-sciences campus approximately 40 minutes north of downtown Toronto by car, accessible by GO Transit and local routes from the GTA. The campus environment is semi-rural and concentrated around health sciences and allied health programs, creating a cohesive community for nursing students. The Seneca Nanji Foundation School of Nursing houses state-of-the-art patient care simulation labs that bridge classroom theory and clinical practice before students enter live placements. Seneca Polytechnic is an IRCC Designated Learning Institution (DLI No. O19395536013) — the mandatory status for study permit and PGWP eligibility. The institution has a 275,000+ alumni network and deep partnerships with GTA healthcare employers across hospital networks, long-term care, community health, and public health agencies.",
  cityProfile:
    "King City, York Region is in the Greater Toronto Area — safe, semi-rural, and about 40 minutes north of downtown Toronto. York Region is consistently rated one of the safest areas in the GTA, with low crime rates and a welcoming multicultural community. Students can live near King Campus in York Region (shared housing CAD 800–1,300/month, meaningfully cheaper than downtown Toronto) or commute from Brampton, Vaughan, or other GTA suburbs via transit. The GTA is home to over 1.2 million people of Indian origin — the largest Indian diaspora in Canada — across Brampton (Punjabi capital of Canada), Mississauga, Markham, and Toronto. Indian grocery stores, restaurants, temples, Gurdwaras, and cultural organisations are all easily accessible within the GTA. Four-season climate: cold winters (−10°C to −25°C, December–March) and warm summers — budget CAD 300–500 for winter clothing in Year 1.",
  clinicalExposure:
    "Clinical placements extend across the GTA's extensive hospital and healthcare network — one of the most diverse and resource-rich clinical environments in Canada. Placement settings cover major teaching hospitals (Mackenzie Health, Humber River Hospital, Sunnybrook, UHN, North York General, William Osler Health System, Trillium Health Partners), community health centres, long-term care and rehabilitation facilities, mental health and addictions services, public health units, and specialty environments (paediatric, maternal-child, oncology, cardiac, emergency). Clinical placement hours expand substantially from Year 2 onward, with specialty rotations introduced in Year 3. Year 4 centres on an extended consolidated clinical practicum where students function at near-autonomous RN level under supervision. Before entering any placement, students must complete the Clinical Preparedness Permit: BLS certification (in-person, renewed annually), standard first aid, immunisation records, TB test or chest X-ray, mask fit test, and annual Criminal Record Check with Vulnerable Sector Screening from a Canadian police service.",
  hostelOverview:
    "Seneca does not operate large residential colleges — most King Campus students live in off-campus shared housing in York Region communities (King City, Aurora, Newmarket, Schomberg) or commute from GTA suburbs. Shared off-campus rooms in York Region typically cost CAD 800–1,300/month. Some students choose to live in Brampton, Vaughan, or Toronto and commute via GO Transit + local routes — more expensive housing but better access to Indian community support. Students Traffic advises enrolled students on accommodation options near King Campus before departure from India, including comparison of York Region vs GTA suburb costs.",
  indianFoodSupport:
    "The Greater Toronto Area has Canada's most extensive Indian food ecosystem. Brampton (Punjabi capital of Canada), Mississauga, Markham, and Toronto all have large concentrations of Indian grocery stores, restaurants covering North Indian, South Indian, Gujarati, Punjabi, and Bengali cuisines, Hindu Mandirs, Sikh Gurdwaras, and active Indian cultural associations. Nations Fresh Foods, Oceans Fresh Food Market, and several Indian grocery chains carry complete Indian pantry staples at accessible prices. Students commuting from or visiting Brampton or Vaughan (both close to King Campus) will find Indian dining and grocery options comparable to major Indian cities in their variety.",
  safetyOverview:
    "York Region and King City are among the safest areas in the Greater Toronto Area, with consistently low crime rates. The King Campus environment is focused and structured — most students are on campus or at clinical placement sites as a function of the demanding nursing schedule. Seneca's international student services provide emergency support and on-campus resources. The GTA has robust legal protections for international students. Standard urban precautions apply when visiting downtown Toronto. York Region's suburban character means students are typically in low-risk residential and campus environments.",
  studentSupport:
    "Seneca Polytechnic's International Student Services team supports visa and immigration queries, pre-arrival orientation, on-campus resources, and emergency financial assistance. The Seneca Nanji Foundation School of Nursing provides academic advising, peer support, and simulation lab access for independent practice. Seneca draws 80% of its tuition revenue from international students — the institution has genuine, tested experience supporting Indian students and their families. Seneca's entrance scholarship of up to CAD 5,000 for 2026 intakes, a renewable degree scholarship of up to CAD 1,000/year for students maintaining required GPA, and a range of academic excellence and financial hardship awards provide some financial offset. Students Traffic remains in contact with families throughout all four years — application, study permit, arrival, CNO registration, NCLEX-RN, PGWP, and PR milestones.",
  whyChoose: [
    "Seneca Nanji Foundation School of Nursing — purpose-built, state-of-the-art patient care simulation labs that prepare students for clinical practice before live patient contact, in a dedicated health-sciences campus environment.",
    "GTA clinical placement network — placements at Mackenzie Health, Humber River Hospital, Sunnybrook, UHN, North York General, William Osler, Trillium Health Partners, and dozens of community and specialty settings across one of Canada's largest healthcare markets.",
    "Two intakes per year (September AND January) — a genuine flexibility advantage over single-intake nursing programmes; students who miss September can target January without a full year's delay.",
    "Three BScN delivery streams — standard 4-year, 3-year Fast Track (consecutive semesters), and RPN Bridge — giving students genuine pathway flexibility.",
    "Canadian-educated nurse advantage — graduates apply directly to the CNO for RN registration with no NNAS credential assessment, no competency gap review, and no bridging programme; substantially higher NCLEX-RN first-time pass rates than internationally educated nurses.",
    "3-year PGWP (bachelor's degree, field-exempt) → direct CNO registration → Ontario RN → Express Entry healthcare draws at CRS 462–476 (well below the general 500+ threshold) — one of the most documented study-to-PR pipelines in Canadian nursing.",
    "GTA Indian community — 1.2 million+ people of Indian origin in Brampton, Mississauga, Markham, and Toronto; cultural, religious, and food support infrastructure is the strongest in Canada for Indian students.",
    "CAD 5,000 entrance scholarship (2026 intakes) and renewable CAD 1,000/year degree scholarship for students maintaining GPA — meaningful financial offset in a competitive programme.",
  ],
  thingsToConsider: [
    "CNO preliminary approval (not yet full approval) — full approval follows after a comprehensive review in the year after the first graduating class completes the programme; this is a standard status for newer Ontario nursing degrees and does not prevent graduates from registering as RNs.",
    "Highly competitive, limited-enrollment programme — Seneca draws 80% of its tuition from international students and the BScN is in high demand; meeting the 75% minimum across four subjects does not guarantee a seat; aim for 80%+ in the sciences.",
    "Hard 75% minimum in ALL four subjects (English, Mathematics, Biology, Chemistry) — a mark below 75% in any single subject disqualifies the BScN application outright; the overall average alone is insufficient.",
    "Clinical Preparedness Permit requirements must be completed before placements — annual Criminal Record Check with Vulnerable Sector Screening, BLS (in-person, not online), immunisation records, TB test, mask fit test; individuals with criminal charges not yet pardoned may be prohibited from placement and unable to complete the programme.",
    "GTA cost of living is higher than Atlantic Canada or smaller Ontario cities — total 4-year cost including GTA living is approximately CAD 175,000–235,000; weigh this against the Ontario RN salary of CAD 103,274/year average.",
    "King Campus in York Region: students seeking frequent downtown Toronto access need to budget for transit (GO + local routes) or accommodation in GTA suburbs closer to Toronto.",
  ],
  bestFitFor: [
    "Indian Class 12 students with 75%+ in English, Mathematics, Biology, and Chemistry — all four subjects at or above threshold — who want a direct path to Ontario RN registration via a public polytechnic in the Greater Toronto Area.",
    "Students who want the Canadian-educated nurse advantage with no NNAS credential assessment, no bridging programme, and direct CNO registration after graduation.",
    "Families targeting the 3-year PGWP and Ontario's healthcare-priority Express Entry and OINP permanent residency pathways after nursing registration.",
    "Students who value being in the GTA — Canada's largest healthcare employment market and most established Indian diaspora community — for both clinical placements and cultural support.",
    "Applicants who want intake flexibility: September AND January intakes rather than a single annual window.",
  ],
  teachingHospitals: [
    "Mackenzie Health, Vaughan (major acute care, surgical, specialty — primary GTA placement site)",
    "Humber River Hospital, Toronto (fully digital hospital; emergency, medical/surgical rotations)",
    "Sunnybrook Health Sciences Centre (trauma, oncology, cardiac, veterans care)",
    "University Health Network (UHN) — Toronto General, Toronto Western, Princess Margaret",
    "North York General Hospital (community teaching hospital; maternal-child, mental health)",
    "William Osler Health System (Brampton Civic, Etobicoke General)",
    "Trillium Health Partners (Credit Valley, Mississauga Hospital)",
    "Community health centres, long-term care facilities, and mental health services across the GTA",
  ],
  recognitionBadges: [
    "CNO Preliminary Approval — College of Nurses of Ontario",
    "NCLEX-RN Licensing Pathway",
    "3-Year PGWP — Honours Bachelor's Degree",
    "Designated Learning Institution — DLI O19395536013",
    "Fast Track 3-Year Stream Available",
    "Express Entry Healthcare Category — NOC 31301",
    "Eligible Across Canada — Ontario RN Registration",
  ],
  recognitionLinks: [
    {
      label: "Seneca Polytechnic — Honours BScN programme page",
      url: "https://www.senecapolytechnic.ca/programs/full-time/BSN.html",
    },
    {
      label: "Seneca Nanji Foundation School of Nursing",
      url: "https://www.senecapolytechnic.ca/school/nursing.html",
    },
    {
      label: "College of Nurses of Ontario (CNO)",
      url: "https://www.cno.org/",
    },
    {
      label: "IRCC — Study Permits and PGWP",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
    },
  ],
  faq: [
    {
      question: "Where is Seneca Polytechnic's nursing programme located?",
      answer:
        "At King Campus in King City, York Region — approximately 40 minutes north of downtown Toronto in the Greater Toronto Area. The campus is Seneca's health-sciences home, housing nursing and allied health programs, with clinical placements across the GTA hospital and community healthcare network.",
    },
    {
      question: "What is the Seneca Nanji Foundation School of Nursing?",
      answer:
        "The dedicated nursing school within Seneca Polytechnic, named after a philanthropic gift from the Nanji family. It delivers the Honours BScN (standard, Fast Track, and Bridge streams) and the Practical Nursing diploma, with state-of-the-art patient care simulation labs at King Campus.",
    },
    {
      question: "Is Seneca Polytechnic a recognised institution for study permit and PGWP?",
      answer:
        "Yes. Seneca Polytechnic is an IRCC-designated Designated Learning Institution (DLI No. O19395536013) — the mandatory status for a valid study permit and Post-Graduation Work Permit eligibility. Without DLI status, a PGWP cannot be issued.",
    },
    {
      question: "What is CNO preliminary approval and does it affect my ability to register as an RN?",
      answer:
        "CNO preliminary approval means the College of Nurses of Ontario has confirmed that Seneca's BScN graduates will be eligible to apply for RN registration. Full approval follows after a comprehensive review in the year after the first graduating class completes the programme. This is a standard status for newer Ontario nursing degrees — it does not prevent graduates from applying for CNO registration or writing the NCLEX-RN.",
    },
    {
      question: "What Class 12 subjects and marks do I need for the BScN?",
      answer:
        "English, Mathematics, Biology, and Chemistry — all four, at a minimum of 75% each. This is a hard requirement: a mark below 75% in any single subject disqualifies the application outright, regardless of overall average. In practice, competitive applicants typically present 80%+ in the sciences. The minimum overall average is 75% across six Grade 12 U/M equivalent courses.",
    },
    {
      question: "Do I need NEET, SAT, or ACT to apply to Seneca's BScN?",
      answer:
        "No. NEET is an Indian entrance exam with no role in Canadian nursing programme admission. SAT and ACT are not required by Seneca for Indian undergraduate applicants. Admission is based entirely on your Class 12 marks (English, Mathematics, Biology, Chemistry at 75%+) and an accepted English proficiency test.",
    },
    {
      question: "What English test do I need?",
      answer:
        "An accepted English test: IELTS Academic, TOEFL iBT, PTE Academic, Duolingo, or CAEL. IELTS Academic is the most common choice for Indian students. Check Seneca's current nursing-specific minimum score — degree programmes typically require IELTS 6.5 overall with no band below 6.0, but confirm the exact nursing requirement before applying.",
    },
    {
      question: "How competitive is the BScN at Seneca?",
      answer:
        "Very competitive. It is a limited-enrollment programme in one of Canada's most internationally-attended polytechnics (80% of tuition from international students). Meeting the 75% minimum does not guarantee a seat — applicants typically need above-minimum marks in the four core subjects. Apply early in each intake cycle and do not rely on any agent who claims to 'guarantee' a nursing seat.",
    },
    {
      question: "When are the intake windows for the BScN?",
      answer:
        "September and January — Seneca's BScN has two intakes per year, which is a genuine flexibility advantage over programmes with a single annual intake. Students who miss September can target January without waiting a full year.",
    },
    {
      question: "What is the difference between the standard BScN, Fast Track, and Bridge streams?",
      answer:
        "Standard BScN: 4 years, 8 semesters with summer breaks — the primary pathway for Indian Class 12 students. Fast Track: 3 years, 8 consecutive semesters with no summer breaks — same curriculum and CNO eligibility, compressed calendar. Bridge: designed for CNO-registered Registered Practical Nurses (RPNs) completing a bridge into Years 3–4 — not applicable to Indian students arriving from Class 12. All three streams have CNO preliminary approval and 3-year PGWP eligibility.",
    },
    {
      question: "What are the clinical requirements I must complete before placements?",
      answer:
        "Before entering clinical placements, students must complete Seneca's Clinical Preparedness Permit: current BLS certificate (in-person course, renewed annually — online not accepted), standard first aid (in-person, valid 4 years), immunisation records per the Canadian Immunization Guide for healthcare workers (including Hepatitis B series, varicella, MMR bloodwork for immune status), TB test or chest X-ray, mask fit test (every 2 years), and an annual Criminal Record Check with Vulnerable Sector Screening from a Canadian police service. Individuals with unresolved criminal charges or convictions may be prohibited from placement — review this requirement carefully before applying.",
    },
    {
      question: "What is the annual tuition for international students in the BScN?",
      answer:
        "Approximately CAD 23,944–25,068 per year for international students in the BScN. Seneca updates fees each academic year — always confirm the current figure directly from Seneca's official fee schedule before making financial commitments.",
    },
    {
      question: "What is the total 4-year cost for Indian students?",
      answer:
        "Including tuition, ancillary fees, health insurance, clinical requirements, and GTA living costs, roughly CAD 175,000–235,000 (approximately INR 1.07–1.48 crore). An Ontario RN earns an average of CAD 103,274/year — the investment is typically recoverable within two to three years of CNO registration.",
    },
    {
      question: "Are scholarships available at Seneca for international nursing students?",
      answer:
        "Yes. Seneca offers up to CAD 5,000 entrance scholarships for new students starting in 2026 intakes (January, May, or September), and a renewable degree scholarship of up to CAD 1,000 per year for students in full-time bachelor's degree programmes who maintain the required GPA. Additional academic excellence and financial hardship awards are available.",
    },
    {
      question: "What happened to the SDS (Student Direct Stream) fast-track process?",
      answer:
        "The Student Direct Stream was permanently discontinued on November 8, 2024. All Indian study permit applications now go through the standard stream — 8–14 weeks processing, Provincial Attestation Letter (PAL) required, full documentation upfront including an upfront Immigration Medical Examination. Outdated articles describing SDS are no longer accurate.",
    },
    {
      question: "How do I become a Registered Nurse in Ontario after graduating from Seneca?",
      answer:
        "Graduate from Seneca's Honours BScN → apply to the College of Nurses of Ontario (CNO) for RN registration → pass the NCLEX-RN → pass the Ontario Jurisprudence Examination → receive your CNO Certificate of Registration as an RN. As a Canadian-educated graduate, you take the direct route — no NNAS internationally-educated-nurse credential assessment, no competency gap review, and no bridging programme. Canadian-educated graduates have substantially higher first-time NCLEX-RN pass rates than internationally educated nurses.",
    },
    {
      question: "What is the Post-Graduation Work Permit (PGWP) for Seneca BScN graduates?",
      answer:
        "A 4-year Honours BScN from Seneca earns the maximum 3-year PGWP. As a bachelor's degree graduate, you are automatically exempt from the PGWP field-of-study requirement — no nursing-specific field exemption needed. The PGWP is an open work permit: any employer, anywhere in Canada, no job offer or LMIA required. Apply within 180 days of graduation, before your study permit expires.",
    },
    {
      question: "What are my PR pathways after graduating from Seneca?",
      answer:
        "Two primary routes: (1) Express Entry category-based healthcare draws — Canada runs draws specifically for healthcare occupations (NOC 31301 Registered Nurse) at CRS scores of approximately 462–476 in 2026, well below the general 500+ threshold; (2) Ontario Immigrant Nominee Program (OINP) — Ontario nominates healthcare workers; an OINP nomination adds 600 CRS points, effectively guaranteeing an Invitation to Apply for permanent residence. Your Canadian BScN, Ontario RN registration, and Canadian work experience on the PGWP all build your CRS score. Students Traffic monitors these pathways and advises enrolled students as they approach graduation.",
    },
  ],
  admissionsContent: {
    overview:
      "Seneca Polytechnic offers the Honours BScN with two intakes per year: September and January — an advantage over single-intake programmes. Apply through Seneca's online application portal (not OUAC). Nursing is a limited-enrollment programme; apply as early as possible in each intake cycle — seats fill before the deadline. Three entry routes: (1) Standard 4-year BScN from Class 12 — the primary pathway for Indian students; (2) Fast Track 3-year BScN — same curriculum, consecutive semesters, no summer breaks; (3) RPN Bridge BScN — for Ontario-registered RPNs entering at Year 3, not applicable for Indian Class 12 students. Required documents: Class 10 & 12 transcripts, accepted English test result (IELTS Academic or equivalent), passport copy, and a Statement of Purpose. If you have any post-secondary study beyond Class 12, a WES credential evaluation may be required — start early as it involves your institution sending transcripts directly to WES.",
    eligibility: {
      intro:
        "To apply to the Seneca Polytechnic BScN as an Indian student:",
      items: [
        "Class 10+2 (CBSE, CISCE, or recognised State Board) equivalent to Ontario Secondary School Diploma.",
        "Required subjects: English, Mathematics, Biology, and Chemistry — all four at the Class 12 level.",
        "Minimum 75% in each of the four core subjects — this is a hard requirement; one subject below 75% disqualifies the BScN application. Aim for 80%+ in the sciences.",
        "Minimum 75% overall average across six Grade 12 U/M equivalent courses.",
        "IELTS Academic — check Seneca's nursing-specific minimum (typically 6.5 overall, no band below 6.0 for degree programmes). TOEFL iBT, PTE Academic, Duolingo, or CAEL also accepted.",
        "No SAT, ACT, or NEET required.",
        "Full disclosure of any prior post-secondary coursework — WES evaluation required for international post-secondary transcripts.",
      ],
    },
    immigrationPathway: [
      "Accept Seneca nursing offer → pay required deposit → trigger Ontario Provincial Attestation Letter (PAL). PAL is issued by Seneca after enrollment confirmation — the slowest step in the timeline; accept your offer immediately.",
      "Purchase GIC (CAD 22,895) from a participating Canadian bank — ICICI Bank Canada, SBI Canada, Scotiabank, or others. Opens online from India in 1–3 business days.",
      "Complete upfront Immigration Medical Examination (IME) with an IRCC-approved Panel Physician in India before submitting the study permit application — recommended for clinical programme applicants to speed processing.",
      "Submit study permit application through the IRCC portal at canada.ca with: valid passport, Seneca Letter of Acceptance (LOA), Ontario PAL, GIC confirmation, first-year tuition receipt, complete financial proof package, English test result, upfront IME confirmation, and a strong Statement of Purpose explaining why nursing at Seneca and your career goal as an Ontario RN.",
      "Pay study permit fee (CAD 150) and biometrics fee (CAD 85). Give biometrics at the nearest VFS Global Visa Application Centre in India (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Chandigarh, and others). Book immediately on receiving the Biometric Instruction Letter.",
      "Standard stream processing: 8–14 weeks. Receive Port of Entry Letter of Introduction and Temporary Resident Visa stamp on passport — fly to Toronto Pearson International Airport (YYZ); King Campus is approximately 40–60 minutes from YYZ.",
      "First week: activate GIC at Canadian bank, apply for SIN at Service Canada, open Canadian chequing account, get Canadian SIM, confirm accommodation near King Campus in York Region. Begin completing Clinical Preparedness Permit requirements — some (Hepatitis B series, immunisation records) can be started in India before travel.",
    ],
    licensingPathway: [
      "Graduate from Seneca's Honours BScN — CNO preliminary approval means graduates are eligible to apply directly to CNO for Registered Nurse registration; no NNAS internationally-educated-nurse credential assessment required.",
      "Apply to the College of Nurses of Ontario (CNO) for RN registration.",
      "Pass NCLEX-RN — Seneca's curriculum is built around CNO Entry to Practice Competencies; Canadian-educated graduates have substantially higher first-time pass rates than internationally educated nurses.",
      "Pass the Ontario Jurisprudence Examination — online open-book exam on Ontario nursing law, regulations, and professional practice standards; completed before or after the NCLEX-RN.",
      "Receive CNO Certificate of Registration as a Registered Nurse in Ontario — a temporary class certificate may allow you to begin working while final requirements are completed.",
      "Ontario RN registration provides eligibility to practise across all of Canada through labour-mobility agreements — your credential is not limited to Ontario.",
      "Apply for 3-year PGWP within 180 days of graduation → work as Ontario RN → build CRS score through Canadian education and work experience → apply via Express Entry healthcare draws (CRS ~462–476) or OINP nomination (+600 CRS) → permanent residence.",
    ],
  },
  lastVerifiedAt: "2026-06-11",
  programs: [
    {
      slug: "seneca-polytechnic-bscn-2026",
      title: "Honours Bachelor of Science – Nursing (BScN) — 4 Years / 8 Semesters",
      durationYears: 4,
      annualTuitionUsd: 18500,
      totalTuitionUsd: 74000,
      livingUsd: 16000,
      medium: "English",
      officialProgramUrl: "https://www.senecapolytechnic.ca/programs/full-time/BSN.html",
      intakeMonths: ["September", "January"],
      teachingPhases: [
        {
          phase: "Year 1 — Foundations of Nursing Practice (Semesters 1–2)",
          language: "English",
          details:
            "Foundations of Nursing Theory and Practice, Human Anatomy and Physiology I & II, Introduction to Nursing Informatics, English Communication for Nursing, Psychology and Human Development, Introduction to Pathophysiology, Concepts in Health and Illness, Introduction to Evidence-Based Practice. Simulation lab sessions begin in Year 1, giving students early exposure to clinical skills and professional identity before live patient placement.",
        },
        {
          phase: "Year 2 — Health Across the Lifespan (Semesters 3–4)",
          language: "English",
          details:
            "Medical-Surgical Nursing I, Pharmacology for Nursing Practice, Mental Health Nursing, Maternal-Child Nursing, Community and Public Health Nursing, Pathophysiology II, Cultural and Ethical Dimensions of Nursing, Research and Evidence in Nursing. Pharmacology becomes central. Clinical placements in hospital and community settings expand significantly — students begin rotations across GTA hospital networks.",
        },
        {
          phase: "Year 3 — Complex Care and Expanding Clinical Practice (Semesters 5–6)",
          language: "English",
          details:
            "Medical-Surgical Nursing II (Complex Care), Care of Older Adults and Gerontology, Nursing Leadership and Healthcare Systems, Paediatric Nursing, Emergency and Critical Care Concepts, Inter-professional Collaboration, Population Health, Nursing Research Application. Year 3 introduces complex patient care — critical conditions, older adults, paediatrics, and emergency concepts. Clinical hours expand substantially; specialty rotations across the GTA hospital network.",
        },
        {
          phase: "Year 4 — Advanced Practice, Leadership, and Consolidation (Semesters 7–8)",
          language: "English",
          details:
            "Advanced Clinical Practice and Consolidation, Nursing Practice in Complex Environments, Professional Transition and Leadership, Healthcare Policy and Advocacy, Nursing Ethics and Law, NCLEX-RN Preparation, Capstone / Integrated Practicum, Elective (Specialty Focus). Year 4 centres on the extended consolidated clinical practicum — extensive supervised practice in real GTA clinical settings at near-autonomous RN level. NCLEX-RN preparation is integrated throughout the final year.",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 18500,
          hostelUsd: 10000,
          livingUsd: 6000,
          totalUsd: 34500,
          notes:
            "Tuition ~CAD 24,000–25,000 + shared accommodation near King Campus, York Region (~CAD 800–1,300/month, ~CAD 10,000–15,000/year) + food, transit, phone, supplies. One-time Year 1 costs: winter clothing (~CAD 300–500), GIC purchase (CAD 22,895 — returned to you in instalments after arrival), clinical pre-clearance fees (BLS, immunisations, CRC, ~CAD 500–900). USD calculated at CAD 1 = USD 0.74.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 18500,
          hostelUsd: 10000,
          livingUsd: 6000,
          totalUsd: 34500,
          notes:
            "Same tuition structure. Clinical placements expand — budget for transit to GTA hospital placement sites. Pharmacology and expanding clinical workload increase study materials costs.",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 18500,
          hostelUsd: 10000,
          livingUsd: 6000,
          totalUsd: 34500,
          notes:
            "Year 3 includes the most intensive clinical rotations, including specialty placements. Transportation to GTA sites and possible accommodation near placement hospitals.",
        },
        {
          yearLabel: "Year 4",
          tuitionUsd: 18500,
          hostelUsd: 10000,
          livingUsd: 6000,
          totalUsd: 34500,
          notes:
            "Final year includes NCLEX-RN registration fee (USD ~200), CNO application fee, and PGWP application fee (~CAD 255) payable at or around graduation. Capstone practicum may require extended placement hours.",
        },
      ],
      licenseExamSupport: [
        "NCLEX-RN (National Council Licensure Examination for Registered Nurses) — written after BScN graduation to register with the College of Nurses of Ontario. Seneca's curriculum is built around CNO Entry to Practice Competencies. Canadian-educated graduates have substantially higher first-time pass rates than internationally educated nurses.",
        "Ontario Jurisprudence Examination — mandatory CNO-required online open-book exam on Ontario nursing law, regulations, and professional practice standards. Completed in addition to the NCLEX-RN before full CNO registration.",
      ],
      feeVerifiedAt: "2026-06-11",
      feeNotes:
        "Annual tuition ~CAD 23,944–25,068 for international Honours BScN students per Students Traffic guide June 2026. USD calculated at CAD 1 = USD 0.74. Living cost estimated at CAD 21,600/year (mid-range GTA/York Region shared housing, food, transit, phone, and supplies). Total 4-year cost including GTA living approximately CAD 175,000–235,000. Fees revised annually — always confirm current tuition directly with Seneca before financial planning.",
    },
  ],
};

async function seed() {
  console.log("=== Seed: Seneca Polytechnic Honours BScN (Canada) ===\n");
  const client = await pool.connect();

  try {
    const uniResult = await client.query(
      `
      INSERT INTO universities (
        country_id, slug, name, city, type, established_year, summary,
        published, featured, official_website,
        campus_lifestyle, city_profile, clinical_exposure,
        hostel_overview, indian_food_support, safety_overview, student_support,
        why_choose, things_to_consider, best_fit_for,
        teaching_hospitals, recognition_badges, recognition_links, faq,
        admissions_content, last_verified_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23, $24,
        $25, $26,
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name                = EXCLUDED.name,
        city                = EXCLUDED.city,
        type                = EXCLUDED.type,
        established_year    = EXCLUDED.established_year,
        summary             = EXCLUDED.summary,
        published           = EXCLUDED.published,
        featured            = EXCLUDED.featured,
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
        admissions_content  = EXCLUDED.admissions_content,
        last_verified_at    = EXCLUDED.last_verified_at,
        updated_at          = NOW()
      RETURNING id;
      `,
      [
        CANADA_ID,
        university.slug,
        university.name,
        university.city,
        university.type,
        university.establishedYear,
        university.summary,
        true,
        false,
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
        JSON.stringify(university.admissionsContent),
        university.lastVerifiedAt,
      ]
    );

    const universityId = uniResult.rows[0].id;
    console.log(`✓ University upserted: ${university.name} (id=${universityId})`);

    const prog = university.programs[0];
    await client.query(
      `
      INSERT INTO program_offerings (
        university_id, course_id, slug, title,
        duration_years, annual_tuition_usd, total_tuition_usd, living_usd,
        medium, official_program_url, published,
        teaching_phases, yearly_cost_breakdown, license_exam_support,
        intake_months, fee_verified_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14,
        $15, $16,
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title                 = EXCLUDED.title,
        duration_years        = EXCLUDED.duration_years,
        annual_tuition_usd    = EXCLUDED.annual_tuition_usd,
        total_tuition_usd     = EXCLUDED.total_tuition_usd,
        living_usd            = EXCLUDED.living_usd,
        medium                = EXCLUDED.medium,
        official_program_url  = EXCLUDED.official_program_url,
        published             = EXCLUDED.published,
        teaching_phases       = EXCLUDED.teaching_phases,
        yearly_cost_breakdown = EXCLUDED.yearly_cost_breakdown,
        license_exam_support  = EXCLUDED.license_exam_support,
        intake_months         = EXCLUDED.intake_months,
        fee_verified_at       = EXCLUDED.fee_verified_at,
        updated_at            = NOW();
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
        prog.medium,
        prog.officialProgramUrl,
        true,
        JSON.stringify(prog.teachingPhases),
        JSON.stringify(prog.yearlyCostBreakdown),
        JSON.stringify(prog.licenseExamSupport),
        prog.intakeMonths,
        prog.feeVerifiedAt,
      ]
    );

    console.log(`✓ Programme upserted: ${prog.slug}`);
    console.log("\n✅ Seneca Polytechnic BScN seeded successfully.");
    console.log(`   University ID: ${universityId}`);
    console.log(`   Slug: ${university.slug}`);
    console.log(`   Country: Canada (id=${CANADA_ID})`);
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
