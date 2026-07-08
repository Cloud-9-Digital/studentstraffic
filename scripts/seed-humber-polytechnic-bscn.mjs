/**
 * Seed Humber Polytechnic BScN nursing programme for Canada.
 * Source: Students Traffic BScN guide, June 2026.
 * Run: node scripts/seed-humber-polytechnic-bscn.mjs
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
  slug: "humber-polytechnic-bscn",
  name: "Humber Polytechnic — Bachelor of Science in Nursing",
  city: "Toronto",
  type: "Public",
  establishedYear: 1967,
  officialWebsite: "https://humber.ca/programs/bachelor-of-science-nursing/",
  summary:
    "Humber Polytechnic (formerly Humber College) in Toronto, Ontario offers a 4-year Honours Bachelor of Science in Nursing (BScN) — the only English-speaking college in Ontario with an on-campus cadaver lab for nursing students. Accredited by the Canadian Association of Schools of Nursing (CASN) and approved by the College of Nurses of Ontario (CNO), the programme leads directly to RN registration through the NCLEX-RN licensing pathway. Graduates receive a 3-year Post-Graduation Work Permit (PGWP) — the strongest immigration bridge available for Indian students targeting permanent residency in Canada through Express Entry healthcare draws.",
  campusLifestyle:
    "The BScN is delivered at Humber's North Campus in Etobicoke, northwest Toronto (205 Humber College Blvd). The campus is a large, fully-equipped polytechnic campus with nursing-specific infrastructure: state-of-the-art Clinical Simulation Learning Centre, human cadaver lab (unique in Ontario college nursing education), and high-fidelity simulation labs. Small class sizes (35–40 in theory courses) give individual attention. Humber enrolls over 86,000 learners including 9,300+ international students from 138+ countries. The institution holds Gold certification for internationalisation excellence. On-campus student residence is available at North Campus and strongly recommended for first-year nursing students.",
  cityProfile:
    "Toronto is Canada's largest city and home to its largest South Asian community — over 700,000 people of Indian origin in the Greater Toronto Area. For Indian nursing students, this means immediate cultural familiarity: Little India (Gerrard Street East), Brampton's Punjabi community, Mississauga, and Scarborough are all within reach. Indian grocery stores (Patel Brothers, Nations Fresh Foods), Indian restaurants serving every regional cuisine, and Indian temples are easily accessible from North Campus. Post-graduation, Toronto and the GTA represent Canada's highest-demand nursing job market — Hennick Humber Hospital, William Osler Health System, Trillium Health Partners, Sunnybrook, SickKids, and UHN all recruit RN graduates. Monthly student living cost: CAD 1,700–3,200 (approximately INR 1.17L–2.2L). Etobicoke is safe, multicultural, and more affordable than downtown Toronto.",
  clinicalExposure:
    "Approximately 1,500 hours of unpaid supervised professional practicums beginning in Semester 3 (Year 2), placed across the Greater Toronto Area healthcare ecosystem — one of Canada's richest clinical training environments. Placement settings include acute care hospitals, ICUs, community health clinics, long-term care facilities, mental health hospitals, maternal child units, public health agencies, and school nursing. Semester 8 involves a preceptorship — one-on-one supervised work with a practising RN on real clinical shifts, including evenings and weekends. Brampton and Peel Region placements expose students to South Asian patient populations, where cultural background and Indian language skills are genuine clinical assets. Interprofessional Education (IPE) modules are embedded across all years.",
  hostelOverview:
    "On-campus student residence is available at Humber North Campus and is strongly recommended for first-year nursing students to simplify the arrival transition. Off-campus shared apartments in Etobicoke, Brampton, and Mississauga are the most popular choice among Indian nursing students — shared 2 or 3-bedroom apartments typically cost CAD 800–1,300 per person per month. On-campus residence including a meal plan costs CAD 1,100–1,600/month. Both options are within TTC transit reach of the campus and clinical placement sites. Woodbine Mall, Walmart, Costco, and Indian grocery stores are accessible from the campus area.",
  indianFoodSupport:
    "Toronto has one of the world's most accessible Indian food ecosystems for a study-abroad destination. Indian restaurants serving Punjabi, South Indian, Gujarati, and Bengali cuisine are abundant across Toronto and Brampton. Indian grocery stores (Patel Brothers, Nations Fresh Foods) carry regional Indian staples. Diwali, Navratri, Holi, Eid, and other South Asian cultural events are celebrated widely across the city. WhatsApp and Facebook groups of Indian nursing students at Humber are active and welcoming to new arrivals. Hindi, Punjabi, Gujarati, Telugu, and Tamil are all spoken by large Toronto communities. Indian students at Humber report strong community belonging from day one.",
  safetyOverview:
    "Etobicoke and the North Campus area are safe, multicultural suburban Toronto neighbourhoods. Canada has a formal safety infrastructure for international students — Humber provides dedicated international student services, mental health and counselling, and academic advising. The campus is well-monitored with campus security. Toronto's broader safety record for international students is strong. The main practical safety consideration is road safety (as in any major North American city) and awareness of common international student financial scams (fake agents offering 'guaranteed admissions' — these are fraudulent and should be reported).",
  studentSupport:
    "Humber's International Centre provides comprehensive support: academic advising, immigration guidance, settlement support, and financial aid information. IGNITE (Humber's student union) supports Indian student associations and cultural clubs. Peer mentoring from senior Indian nursing students is informal but widely available. Formal orientation programmes run before the first semester. Mental health and counselling services are included at no additional cost. Students Traffic provides end-to-end support: eligibility assessment, IELTS guidance, ICAS/WES credential evaluation, complete Humber Web Application management, PAL coordination, GIC setup, study permit documentation, SOP writing, biometrics support, arrival preparation, and Year 1 ongoing support.",
  whyChoose: [
    "Only English-speaking college in Ontario with an on-campus cadaver lab for nursing students — giving a depth of anatomical understanding unavailable at almost any other Ontario nursing programme.",
    "CASN-accredited, CNO-approved Honours BScN — treated identically to a university BScN for CNO registration, 3-year PGWP eligibility, and Express Entry PR pathways.",
    "Canadian-educated nurse advantage: Humber graduates skip the NNAS credential assessment, competency gap review, and bridging programmes that internationally educated nurses (IENs) face — a process that takes 12+ months with only a 51.6% NCLEX first-time pass rate for IENs.",
    "3-year Post-Graduation Work Permit (PGWP) automatic upon graduation — the strongest immigration bridge available, allowing full RN work in Canada at CAD 82,000–115,000/year while building Express Entry CRS points.",
    "Express Entry healthcare draws in 2026 are clearing at CRS 462–476 — well below the general pool cutoff of 500+ — meaning nurses have a structurally easier permanent residency pathway than most other professions.",
    "Toronto GTA clinical placements across one of North America's largest hospital networks, with South Asian patient populations in Brampton and Peel Region where Indian language skills are genuine clinical assets.",
    "Humber offers postgraduate RN advanced-skills programmes (Maternal Child, Critical Care, Perioperative, Mental Health, Emergency) allowing specialisation within 1–2 years of RN registration.",
  ],
  thingsToConsider: [
    "Total 4-year cost is approximately CAD 1,95,000–2,10,000 (~INR 1.33–1.42 Crores) — a significant investment, though an Ontario RN earning CAD 95,000/year typically recovers the full cost within 2 years of working.",
    "The BScN is a high-demand, limited-enrolment programme. As of June 2026 the September 2026 international intake is listed as Closed — early application (November–January for the following September) is essential.",
    "75% in Class 12 is the minimum — not a guarantee. Competitive applicants have 80%+ in English, Chemistry, and Biology. Grade 12 Mathematics at U level is also required.",
    "The SDS (Student Direct Stream) fast-track study permit was permanently discontinued on November 8, 2024. All Indian applications now go through the standard stream (8–14 weeks processing) with a PAL requirement.",
    "Non-Academic Requirements (NARs) — CPR, police check, immunisations (including Hepatitis B series requiring 3 doses over 6 months), mask fit testing — must be completed before Semester 3 at cost of ~CAD 800. Start Hepatitis B in India before travelling.",
    "Clinical placements are unpaid — budget for GTA transportation costs to placement sites across the region.",
  ],
  bestFitFor: [
    "Indian students after Class 12 (CBSE, ICSE, or State Board) with 75%+ in English, Mathematics, Chemistry, and Biology who are committed to a nursing career and Canadian permanent residency.",
    "Indian degree holders (BSc, B.Pharma, or relevant science background) exploring the Second Entry pathway, which can shorten the programme to 2–3 years.",
    "Families who want the clearest, most structured study-to-PR pathway in a major Western country, with strong financial return after graduation.",
    "Students who want the Canadian-educated nurse advantage over the uncertain IEN migration route — avoiding the NNAS assessment, bridging programmes, and the 51.6% IEN first-time NCLEX pass rate.",
    "Students targeting Toronto specifically — Canada's most diverse healthcare job market, with the largest South Asian community in the country.",
  ],
  teachingHospitals: [
    "Hennick Humber River Hospital, Toronto",
    "William Osler Health System (Brampton Civic & Etobicoke General)",
    "Trillium Health Partners (Mississauga & Credit Valley)",
    "Sunnybrook Health Sciences Centre",
    "The Hospital for Sick Children (SickKids)",
    "University Health Network (UHN)",
    "GTA community health centres and long-term care facilities",
  ],
  recognitionBadges: [
    "CASN Accredited — Canadian Association of Schools of Nursing",
    "CNO Approved — College of Nurses of Ontario (BScN + PN)",
    "3-Year PGWP Eligible — Honours Bachelor's degree",
    "Express Entry Healthcare Category",
    "Only Ontario college with on-campus cadaver lab for nursing",
    "DLI: O19395164223",
  ],
  recognitionLinks: [
    {
      label: "Humber BScN programme page",
      url: "https://humber.ca/programs/bachelor-of-science-nursing/",
    },
    {
      label: "CASN accreditation — Canadian Association of Schools of Nursing",
      url: "https://www.casn.ca/",
    },
    {
      label: "CNO — College of Nurses of Ontario",
      url: "https://www.cno.org/",
    },
    {
      label: "Humber International Student Application Portal",
      url: "https://humber.my.site.com/",
    },
  ],
  faq: [
    {
      question: "Is the Humber BScN a university degree or a college degree?",
      answer:
        "It is an Honours Bachelor's degree — a full university-level degree in academic standing. While Humber is classified as a college (now polytechnic), its degree programmes hold the same regulatory standing as university degrees. For CNO registration, 3-year PGWP, and Express Entry immigration, the Humber BScN is treated identically to a university BScN.",
    },
    {
      question: "Is NEET required for the Humber BScN?",
      answer:
        "No. NEET is an Indian entrance exam for medical/nursing programmes in India. It has no relevance to Canadian nursing programme admissions. No SAT, ACT, JEE, or NEET is required.",
    },
    {
      question: "What is the difference between Humber College and Humber Polytechnic?",
      answer:
        "They are the same institution. Humber College rebranded as Humber Polytechnic in August 2024 to reflect its applied learning model. The legal name remains Humber College Institute of Technology and Advanced Learning. All official documents — degree parchments, CNO applications, IRCC documents — use either name interchangeably.",
    },
    {
      question: "Can I complete the BScN in less than 4 years?",
      answer:
        "The direct BScN stream is 4 years. If you hold a 3- or 4-year university degree in a relevant science field, the Second Entry pathway may allow entry at Year 2 or 3 after a preparatory semester — effectively completing the BScN in 2–3 years. Confirm your eligibility with Students Traffic.",
    },
    {
      question: "What are the minimum academic requirements for Indian students?",
      answer:
        "Grade 12 English, Mathematics, Chemistry, and Biology — all at U level — with minimum 75% in each subject and 75% overall GPA. Meeting the minimum does not guarantee admission; the programme is competitive and limited-enrolment. Competitive applicants typically have 80–85%+ in core science subjects.",
    },
    {
      question: "What English test score does Humber nursing require?",
      answer:
        "Minimum IELTS 6.5 overall with no band below 6.0 (recommended). TOEFL iBT 80+, PTE Academic 58+, Duolingo 140+, and CAEL 60+ are also accepted. Students Traffic recommends targeting 7.0+ for both competitiveness and genuine preparation for the academic and clinical demands of the programme.",
    },
    {
      question: "What is the total cost of the Humber BScN for Indian students?",
      answer:
        "Approximately CAD 1,95,000–2,10,000 over 4 years (~INR 1.33–1.42 Crores), including tuition (~CAD 97,000), Toronto living costs (~CAD 86,000), health insurance (~CAD 1,672), and other costs. The GIC (CAD 22,895) is a living-fund deposit returned to you in instalments — not a sunk cost. An Ontario RN earning CAD 95,000/year typically recovers the entire 4-year investment within 2 years of working.",
    },
    {
      question: "What is the GIC and do I get the money back?",
      answer:
        "The GIC (Guaranteed Investment Certificate, CAD 22,895) is a deposit at a Canadian bank that proves sufficient living funds for your study permit application. After arrival and activation, the bank releases it in instalments — typically CAD 3,000–5,000 initial lump sum plus monthly payments. You receive the full CAD 22,895 back over your first year in Canada. It is not a cost.",
    },
    {
      question: "Is the Student Direct Stream (SDS) available for 2026?",
      answer:
        "No. The SDS was permanently discontinued on November 8, 2024. All Indian applications now go through the standard stream, which takes 8–14 weeks and requires a Provincial Attestation Letter (PAL). Any information about SDS from older articles or agents is outdated.",
    },
    {
      question: "What is the Provincial Attestation Letter (PAL) and how do I get it?",
      answer:
        "The PAL is a document from Ontario confirming your application counts within the provincial allocation under the national study permit cap. Humber provides PAL guidance to accepted students after they accept their offer and pay the CAD 3,000 deposit. Ontario PAL turnaround is typically 4–8 weeks. You cannot submit your study permit application without the PAL.",
    },
    {
      question: "What is the PGWP and how long is it for Humber BScN graduates?",
      answer:
        "The Post-Graduation Work Permit (PGWP) is an open work permit allowing graduates to work for any Canadian employer in any province without a job offer or LMIA. Humber BScN graduates receive the full 3-year PGWP (maximum duration, for 4-year Honours degree holders). Apply within 180 days of graduation. This is a one-lifetime permit — use it strategically.",
    },
    {
      question: "How do Humber BScN graduates become Registered Nurses in Canada?",
      answer:
        "Graduate from the CASN-accredited Humber BScN → apply to the College of Nurses of Ontario (CNO) → satisfy the Transition to Practice (TTP) requirement (automatically met as a recent Canadian graduate) → pass the NCLEX-RN examination → pass the Ontario Jurisprudence Examination → receive CNO Certificate of Registration. No NNAS credential assessment or bridging programme required — the direct domestic route.",
    },
    {
      question: "What is the Canadian-educated nurse advantage over studying nursing in India first?",
      answer:
        "Studying nursing in India and migrating later classifies you as an Internationally Educated Nurse (IEN). The IEN route requires NNAS credential assessment (months), a CNO competency gap review (common for Indian graduates), often a mandatory bridging programme (months or years), and faces a 51.6% first-time NCLEX pass rate. Total timeline: 12+ months, uncertain outcome, no PGWP. The Humber BScN skips all of this — you graduate as a Canadian-educated nurse, take the direct CNO route, and receive the full 3-year PGWP.",
    },
    {
      question: "What Express Entry CRS score do nurses need for permanent residency?",
      answer:
        "Healthcare-targeted Express Entry draws in 2026 are issuing invitations at CRS scores of approximately 462–476 — well below the general pool cutoff of 500+. Nurses have a structurally easier permanent residency pathway than most other applicants. A provincial nomination from OINP adds 600 CRS points, effectively guaranteeing an ITA regardless of base CRS score.",
    },
    {
      question: "Can I work as a nurse in Canada immediately after graduation?",
      answer:
        "You cannot practise as an RN until CNO registration is granted. However, you can begin working as a 'Graduate Nurse' at some Ontario hospitals before CNO registration is finalised. The gap between graduation and CNO registration is typically 4–8 weeks for well-prepared graduates. You can apply for the PGWP and job positions simultaneously.",
    },
    {
      question: "I studied in a State Board (e.g., Maharashtra, Tamil Nadu). Am I eligible?",
      answer:
        "Yes. All major Indian state boards — CBSE, ICSE, and all recognised State Boards — are accepted. Humber requires an ICAS (International Credential Assessment Service) evaluation for Indian secondary school credentials. Students Traffic manages the ICAS evaluation as part of the application process.",
    },
    {
      question: "My agent offered me a guaranteed seat in the Humber BScN. Is this legitimate?",
      answer:
        "No. No genuine counsellor or agent can guarantee admission to the Humber BScN. Admissions are made exclusively by Humber Polytechnic based on merit and timing. Anyone offering 'guaranteed admission' to Humber Nursing is misleading you and potentially engaging in fraud. Students Traffic never makes guarantees — only honest assessment and genuine support.",
    },
    {
      question: "What are the Non-Academic Requirements (NARs) and when are they due?",
      answer:
        "NARs are mandatory pre-placement requirements including: immunisations (Hepatitis B — 3 doses over 6 months, MMR, Varicella, TB screen, Tdap, influenza), CPR/BLS-HCP certification, ASIST training, Vulnerable Sector police check, and mask fit testing. All must be completed before Semester 3. Total cost ~CAD 800. Critical note: Start the Hepatitis B series in India before travelling — it takes 6 months.",
    },
  ],
  admissionsContent: {
    overview:
      "Humber Polytechnic offers three distinct routes into the Honours BScN. Stream 1 (Direct BScN) is the primary pathway for Indian Class 12 graduates — 4 years, September-only intake, applied through the Humber Web Application (not ontariocolleges.ca). Stream 2 (Second Entry) is for degree holders (BSc, B.Pharma, etc.) — a preparatory semester qualifies entry into Year 2 or 3, reducing total time to 2–3 years. Stream 3 (RPN-to-BScN Bridging) is for Registered Practical Nurses already in Canada — 2 bridging semesters then Year 3–4. All three streams lead to the same Honours BScN, 3-year PGWP, and CNO pathway. Minimum academic requirement: 75% in Grade 12 English, Mathematics, Chemistry, and Biology (all U level). English: IELTS 6.5+ (no band below 6.0). Application fee: CAD 100. Tuition deposit on offer acceptance: CAD 3,000 (applied to first semester). International credentials require ICAS evaluation (secondary) or WES evaluation (postsecondary). Students Traffic manages the complete application process.",
    eligibility: {
      intro: "To apply to the Humber BScN (Direct Stream) as an Indian student:",
      items: [
        "Completed Grade 12 (CBSE, ICSE, or recognised State Board) with English, Mathematics, Chemistry, and Biology — all at U level equivalent.",
        "Minimum 75% in each required subject and 75% overall GPA. Competitive applicants have 80%+ in core subjects.",
        "IELTS 6.5 overall (no band below 6.0 recommended), or TOEFL iBT 80+, PTE 58+, Duolingo 140+.",
        "ICAS credential evaluation for Indian Class 12 credentials (mandatory for international applicants).",
        "Full disclosure: all postsecondary transcripts — including incomplete or failed courses — must be disclosed.",
      ],
    },
    immigrationPathway: [
      "Accept Humber offer + pay CAD 3,000 deposit → trigger PAL (Provincial Attestation Letter, 4–8 weeks from Ontario).",
      "Purchase GIC (CAD 22,895) from ICICI Bank Canada, SBI Canada, Scotiabank, or other participating institution.",
      "Complete upfront Immigration Medical Examination (IME) with IRCC-approved Panel Physician in India.",
      "Submit study permit application through IRCC portal (canada.ca) with: LOA, PAL, GIC, tuition receipt, financial proof, IELTS, IME, SOP, passport.",
      "Give biometrics at nearest VFS Global VAC in India.",
      "Receive Port of Entry Letter of Introduction → fly to Toronto Pearson (YYZ) → collect physical study permit at border.",
      "Arrival week: activate GIC, apply for SIN at Service Canada, open Canadian bank account, get Canadian SIM.",
    ],
    licensingPathway: [
      "Graduate from CASN-accredited Humber Honours BScN — meets CNO baccalaureate education requirement directly.",
      "Apply to College of Nurses of Ontario (CNO) for RN registration.",
      "Transition to Practice (TTP) automatically satisfied — recent Canadian graduation within 3 years is one of the five recognised TTP pathways.",
      "Write and pass NCLEX-RN (National Council Licensure Examination for Registered Nurses) — Humber's NGN-aligned curriculum prepares students specifically for the Next Generation NCLEX format.",
      "Pass Ontario Jurisprudence Examination — mandatory test of Ontario nursing laws, regulations, and ethics.",
      "Receive CNO Certificate of Registration — authorised to practise as a Registered Nurse in Ontario.",
      "Apply for 3-year PGWP within 180 days of graduation → work as Ontario RN at CAD 82K–115K+/year.",
      "Build 1 year Canadian work experience → qualify for Express Entry healthcare draw (CRS ~462–476 in 2026) or OINP nomination (+600 CRS points) → permanent residence.",
    ],
  },
  lastVerifiedAt: "2026-06-11",
  programs: [
    {
      slug: "humber-polytechnic-bscn-2026",
      title: "Bachelor of Science in Nursing — Honours BScN (NR411)",
      durationYears: 4,
      annualTuitionUsd: 17800,
      totalTuitionUsd: 71200,
      livingUsd: 15800,
      medium: "English",
      officialProgramUrl: "https://humber.ca/programs/bachelor-of-science-nursing/",
      intakeMonths: ["September"],
      teachingPhases: [
        {
          phase: "Year 1 — Foundations (Semesters 1 & 2)",
          language: "English",
          details:
            "Anatomy & Physiology 1 & 2 (with cadaver lab access), Clinical Microbiology, Introduction to Nursing Profession, Therapeutic Communication and Writing in Nursing, Academic Writing and Critical Thinking, Psychology, Ethics, Lifespan Development, Interprofessional Education (IPE). No clinical placement yet; this year builds the biological and professional foundations.",
        },
        {
          phase: "Year 2 — Clinical Entry (Semesters 3 & 4)",
          language: "English",
          details:
            "Pathophysiology 1 & 2, Health Assessment, Pharmacotherapeutics for Nursing, Nursing Theory, Nursing Concepts Across the Lifespan 1 & 2. Clinical placements begin in Semester 3 — supervised practicums in real GTA healthcare settings. Students work with real patients under Humber clinical educators.",
        },
        {
          phase: "Year 3 — Applied Clinical (Semesters 5 & 6)",
          language: "English",
          details:
            "Nursing Concepts Across the Lifespan 3 & 4, Biostatistics, Mental Health Nursing, Community Health Nursing, Indigenous Health in Canada. Semester 6 includes a Work Experience (SEM 6C) placement — zero academic fee semester, full-time placement in a healthcare setting. Clinical hours accumulate toward the 1,500-hour requirement.",
        },
        {
          phase: "Year 4 — Leadership and Preceptorship (Semesters 7 & 8)",
          language: "English",
          details:
            "Nursing Concepts Across the Lifespan 5, Canadian Health Policy, Nursing Leadership and Management, NCLEX-RN preparation integrated into curriculum. Semester 8 involves a preceptorship — one-on-one with a practising RN on real clinical shifts including evenings and weekends. This is the closest preparation to independent RN practice.",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 17800,
          hostelUsd: 10800,
          livingUsd: 5000,
          totalUsd: 33600,
          notes:
            "Tuition ~CAD 24,435 (2 semesters) + Toronto accommodation ~CAD 14,400/year (shared off-campus) + food, transit, phone, supplies. Also includes one-time Year 1 costs: winter clothing ~CAD 600, GIC ~CAD 22,895 (deposit, returned in instalments), laptop ~CAD 1,200.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 17800,
          hostelUsd: 10800,
          livingUsd: 5000,
          totalUsd: 33600,
          notes:
            "Same tuition. NARs (Non-Academic Requirements: immunisations, CPR, police check) ~CAD 800 due before Semester 3 placements begin. Transportation to GTA placement sites is an additional variable cost.",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 17800,
          hostelUsd: 10800,
          livingUsd: 5000,
          totalUsd: 33600,
          notes:
            "Semester 6C (Work Experience) is a zero-tuition-fee semester — living costs only. Effective tuition in Year 3 is lower than the other years as a result.",
        },
        {
          yearLabel: "Year 4",
          tuitionUsd: 17800,
          hostelUsd: 10800,
          livingUsd: 5000,
          totalUsd: 33600,
          notes:
            "NCLEX-RN registration fee (USD 200 ~CAD 270) due in final year. CNO registration application costs also payable upon graduation.",
        },
      ],
      licenseExamSupport: [
        "NCLEX-RN (National Council Licensure Examination for Registered Nurses) — Canadian and US standard RN licensing exam. Humber's curriculum is aligned to the Next Generation NCLEX (NGN) format introduced in Canada in 2023.",
        "Ontario Jurisprudence Examination — mandatory CNO examination on Ontario nursing laws, regulations, and professional ethics.",
      ],
      feeVerifiedAt: "2026-06-11",
      feeNotes:
        "Annual tuition ~CAD 24,435 (2 semesters × ~CAD 12,200) for 2026/27. Total tuition over 8 semesters ~CAD 97,260 per Students Traffic BScN guide June 2026. USD calculated at CAD 1 = USD 0.73. Living cost estimated at CAD 1,800/month (mid-range shared off-campus Toronto). SEM 6C is a zero-fee semester — effective tuition per year may be slightly lower. Verify current semester fees directly with Humber at time of application.",
    },
  ],
};

async function seed() {
  console.log("=== Seed: Humber Polytechnic BScN (Canada) ===\n");
  const client = await pool.connect();

  try {
    const uniResult = await client.query(
      `
      INSERT INTO universities (
        country_id, slug, name, city, type, established_year, summary,
        published, featured, official_website,
        campus_lifestyle, city_profile, practical_exposure,
        hostel_overview, dietary_support, safety_overview, student_support,
        why_choose, things_to_consider, best_fit_for,
        industry_partners, recognition_badges, recognition_links, faq,
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
        teaching_phases, yearly_cost_breakdown, professional_exam_support,
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
        professional_exam_support  = EXCLUDED.professional_exam_support,
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
    console.log("\n✅ Humber Polytechnic BScN seeded successfully.");
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
