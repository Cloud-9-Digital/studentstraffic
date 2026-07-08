/**
 * Seed University of Windsor BScN nursing programme for Canada.
 * Source: Students Traffic BScN guide, 9 June 2026.
 * Run: node scripts/seed-university-of-windsor-bscn.mjs
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
  slug: "university-of-windsor-bscn",
  name: "University of Windsor — Bachelor of Science in Nursing",
  city: "Windsor",
  type: "Public",
  establishedYear: 1857,
  officialWebsite: "https://www.uwindsor.ca/nursing/",
  summary:
    "The University of Windsor (UWindsor) is a public research university founded in 1857 — Canada's southernmost university, located in Windsor, Ontario on the Detroit River. Its Faculty of Nursing delivers a CASN-accredited Honours Bachelor of Science in Nursing (BScN) over 4 years, with 250+ clinical partner agencies across southwestern Ontario and primary placements at Windsor Regional Hospital and Hôtel-Dieu Grace Healthcare. The programme leads to CNO RN registration via NCLEX-RN, a 3-year Post-Graduation Work Permit, and Ontario's healthcare-priority Express Entry and OINP permanent residency pathways. Windsor's cost of living is approximately 20% below Toronto — a meaningful financial advantage for Indian families over four years.",
  campusLifestyle:
    "UWindsor's main campus is at 401 Sunset Avenue, Windsor — a mid-size, walkable university campus on the banks of the Detroit River. The campus has a cosmopolitan feel: directly across the river from Detroit, Michigan, with the Ambassador Bridge visible from campus. A new 440-room student residence opened in Fall 2025 with dining and amenities. Class sizes in the nursing program are small given the limited-enrolment clinical model. The Faculty of Nursing has a dedicated Clinical Therapist (Laura Little, MSW, RSW) working exclusively with nursing and medical students — an unusual and valued support structure. Ranked QS #546 globally (2026), #7 in Canada among non-medical universities, and #4 in Ontario.",
  cityProfile:
    "Windsor, Ontario is Canada's southernmost city — on the Detroit River, directly across from Detroit, Michigan. It is consistently ranked among Ontario's safer mid-size cities. Windsor's cost of living is approximately 20% below Toronto — shared off-campus rooms can be as low as CAD 600–800/month. Indian students report Windsor's mildest winters in Canada (−5°C to −15°C, versus −15°C to −30°C in northern Ontario cities) as a genuine quality-of-life advantage. Indian grocery stores, South Asian supermarkets, Indian restaurants, Hindu temples, and Sikh Gurdwaras are established in Windsor-Essex. The Detroit border adds a unique dimension — students cross for concerts, US-price shopping, and experiences in minutes. Windsor is approximately 370 km (3.5 hours) from Toronto by car.",
  clinicalExposure:
    "250+ clinical partner agencies across southwestern Ontario — hospitals, community health centres, long-term care facilities, mental health agencies, and specialty services. Clinical placements begin in Year 1, not Year 3 or 4, building professional confidence progressively. Primary placement hospitals: Windsor Regional Hospital (Metropolitan & Ouellette campuses — over 350,000 patient visits/year; major medical/surgical, ICU, ER and specialty rotations) and Hôtel-Dieu Grace Healthcare (specialist in post-acute, mental health, rehabilitation, palliative care, and complex care — areas heavily tested in NCLEX-RN). Year 3 includes NURS 3632 Consolidation — a full-time block placement running days, evenings, and weekends to replicate real nursing shift patterns. The Clinical Learning Centre provides high-fidelity simulation, OSCE assessments, and skills labs before live patient contact.",
  hostelOverview:
    "UWindsor opened a new 440-room student residence in Fall 2025 with dining, social spaces, and study facilities — on-campus accommodation is available and strongly recommended for first-year nursing students. Off-campus options (apartments and shared houses near campus) are popular among Indian nursing students — shared rooms typically cost CAD 600–1,000/month, lower than Toronto or Ottawa. The campus area is walkable and well-served by Windsor Transit. Students Traffic briefs enrolled students on accommodation options before departure from India.",
  indianFoodSupport:
    "Windsor has a well-established Indian food ecosystem. Indian grocery stores and South Asian supermarkets stock spices, lentils, rice, frozen Indian foods, and packaged goods. Indian restaurants serve a range of regional cuisines. Most students cook at home and report ingredients are affordable relative to Toronto. The UWindsor Indian Students Association (ISA) — over 2,000 members — organises Diwali, Holi, Bollywood nights, and cultural festivals. The Tamil Students' Association (TSA) is separately active. Hindu temples, Sikh Gurdwaras, and South Asian religious organisations are present in Windsor. Hindi-speaking community members and shopkeepers are present in the South Asian areas of Windsor.",
  safetyOverview:
    "Windsor is consistently considered one of Ontario's safer mid-size cities. The campus is urban, walkable, and well-lit. The UWindsor campus security team and the International Student Centre provide support and emergency resources. The city has a diverse and welcoming community. Travelling to Detroit requires a passport — standard cross-border precautions apply. As with any city, standard safety awareness (well-lit routes, not walking alone late at night) is recommended. The nursing program's demanding schedule means students are primarily on campus or at clinical placement sites — a structured daily routine that naturally limits exposure to risk.",
  studentSupport:
    "UWindsor's International Student Centre (ISC) offers visa workshops, pre-departure orientations, airport pickup, homestay options, mental health resources, and emergency financial support. The Faculty of Nursing has a Peer Mentor program (senior nursing students mentoring Year 1 students through clinical transitions), UWNS (UWindsor Welcomes Nursing Students club), and a dedicated Nursing Society for professional development. Unique to Windsor nursing: a dedicated Clinical Therapist (Laura Little, MSW, RSW) working exclusively with nursing and medical students — providing confidential counselling at no additional cost. International Student Entrance Awards are awarded automatically at admission based on Class 12 marks. The UWinAward Entrance Application Profile (deadline April 30) opens access to a wide range of bursaries.",
  whyChoose: [
    "CASN-accredited Honours BScN — the gold standard credential for CNO registration in Ontario; UWindsor nursing graduates have the same regulatory standing as any university BScN.",
    "250+ clinical partner agencies across southwestern Ontario — the most extensive clinical network in the region, with placements beginning from Year 1 across hospitals, community health, LTC, mental health, and specialty settings.",
    "Windsor is in Ontario — the OINP (Ontario Immigrant Nominee Program) adds 600 CRS points, effectively guaranteeing Express Entry PR invitation for healthcare workers (NOC 31301).",
    "20% lower cost of living than Toronto — one of the lowest in Ontario for a university city, with shared off-campus rooms from CAD 600/month and affordable Indian groceries.",
    "Canada's southernmost city with its mildest winters — Indian students consistently rate Windsor's weather the most manageable in Canada.",
    "NCLEX-RN valid for both Canadian and US nursing boards — Windsor's location on the US border makes cross-border nursing careers uniquely accessible for UWindsor graduates.",
    "Dedicated Clinical Therapist for nursing students, new 440-room campus residence (2025), and a structured peer mentoring program — a student support infrastructure built specifically for nursing.",
    "QS #546 globally (2026) and top-improving Canadian university — one of 7 Canadian universities that improved their QS ranking this year.",
  ],
  thingsToConsider: [
    "Nursing tuition for international students is reported in a wide range across third-party sites (CAD 35,000–60,000+). Always verify the exact current fee directly on UWindsor's official website or through Students Traffic before financial planning.",
    "The BScN is a highly competitive, limited-enrolment program — the university's overall acceptance rate is ~65% but nursing is significantly more competitive. Aim for 85%+ in Biology, Chemistry, and English.",
    "Clinical placements begin from Year 1 — clinical pre-clearance requirements (CPR, criminal record check, immunisations including Hepatitis B series, N95 fit test, WHMIS, Vulnerable Sector check) must all be completed before Semester 1 placement. Start Hepatitis B series in India before travelling.",
    "Windsor is approximately 370 km from Toronto — students looking for regular Toronto access will need to budget for intercity travel.",
    "The Collaborative route via St. Clair College leads to the same UWindsor degree but may have different study permit and PGWP implications — confirm with Students Traffic before choosing.",
    "NURS 3632 Consolidation in Year 3 is a full-time block placement running days, evenings, and weekends — plan personal commitments around this semester accordingly.",
  ],
  bestFitFor: [
    "Indian Class 12 students with 85%+ in English, Biology, and Chemistry seeking a CASN-accredited Ontario nursing degree with the strongest OINP PR pathway.",
    "Families who want the full Canadian-educated nurse advantage at a meaningful cost saving versus Toronto-based programs — Windsor's 20% lower living costs add up significantly over 4 years.",
    "Students interested in a cross-border career option — Windsor graduates have geography-based access to both the Ontario and US nursing markets through the NCLEX-RN.",
    "Students who want clinical immersion from Year 1 rather than delayed clinical exposure in later years.",
    "Applicants who value a smaller, more manageable city environment over the intensity of Toronto — Indian students report the Windsor transition from India as smoother than larger Canadian cities.",
  ],
  teachingHospitals: [
    "Windsor Regional Hospital — Metropolitan Campus (major acute care, ICU, ER, surgical)",
    "Windsor Regional Hospital — Ouellette Campus",
    "Hôtel-Dieu Grace Healthcare (mental health, rehabilitation, palliative care, complex care)",
    "Erie Shores HealthCare, Leamington (regional acute care)",
    "Community health centres — southwestern Ontario",
    "Long-term care facilities — gerontological nursing rotations",
    "Mental health and addictions agencies — specialist placements",
    "Children's Mental Health Services — paediatric mental health",
  ],
  recognitionBadges: [
    "CASN Accredited — Canadian Association of Schools of Nursing",
    "CNO Approved — College of Nurses of Ontario",
    "3-Year PGWP Eligible — Honours Bachelor's degree",
    "QS #546 Globally (2026) — #7 in Canada (Non-Medical)",
    "Express Entry Healthcare Category — NOC 31301",
    "Ontario OINP Eligible",
    "NCLEX-RN valid for US licensing",
  ],
  recognitionLinks: [
    {
      label: "UWindsor Faculty of Nursing official page",
      url: "https://www.uwindsor.ca/nursing/",
    },
    {
      label: "CASN — Canadian Association of Schools of Nursing",
      url: "https://www.casn.ca/",
    },
    {
      label: "CNO — College of Nurses of Ontario",
      url: "https://www.cno.org/",
    },
    {
      label: "UWindsor International Admissions",
      url: "https://www.uwindsor.ca/registrar/international-students",
    },
  ],
  faq: [
    {
      question: "Is the University of Windsor's BScN a recognised, accredited degree?",
      answer:
        "Yes. UWindsor is a public Ontario university founded in 1857. Its Faculty of Nursing holds CASN accreditation — the national standard for Canadian nursing education that CNO requires for RN registration. The Honours BScN is PGWP-eligible and treated identically to any university nursing degree for CNO, immigration, and career purposes.",
    },
    {
      question: "Is NEET required for the UWindsor BScN?",
      answer:
        "No. NEET is an Indian entrance exam with no role in Canadian university nursing admission. Admission is based solely on Class 12 marks (English, Biology, Chemistry — competitive average 85%+) and an accepted English test.",
    },
    {
      question: "What is the Collaborative model with St. Clair College?",
      answer:
        "Students admitted via St. Clair College (Windsor or Chatham) complete Years 1–2 at the college, then Years 3–4 at University of Windsor. The curriculum is identical and the degree is awarded by the University of Windsor. International students should verify study permit and PGWP implications of this route before applying — Students Traffic advises on this.",
    },
    {
      question: "Is the Lambton College route still available?",
      answer:
        "No. Lambton College (Sarnia) is no longer admitting new students to the BScN collaborative pathway. Apply directly to University of Windsor or St. Clair College only.",
    },
    {
      question: "What Class 12 subjects and marks do I need?",
      answer:
        "Required subjects: English, Biology, and Chemistry at Class 12 level. Mathematics is beneficial. The university minimum is 70% overall, but nursing is competitive and limited-enrolment — aim for 85%+ in your science subjects. Students Traffic will assess your specific profile honestly.",
    },
    {
      question: "What is the total 4-year cost for Indian students at Windsor?",
      answer:
        "Approximately CAD 176,000–232,000 (INR 1.09–1.44 crore) over 4 years including tuition, living costs, health insurance, and clinical extras. Windsor's 20% lower cost of living compared to Toronto is a meaningful saving. Exact tuition varies annually — always verify directly with UWindsor before financial planning.",
    },
    {
      question: "Why do different websites show such different tuition figures for Windsor nursing?",
      answer:
        "Third-party education sites have reported figures from CAD 35,000 to CAD 60,000+ per year — the range reflects different data years and fee inclusions. Always verify the current year's exact international nursing tuition directly on UWindsor's official website or through Students Traffic before committing.",
    },
    {
      question: "Are scholarships available for international nursing students at Windsor?",
      answer:
        "Yes. International Student Entrance Awards are awarded automatically at admission based on academic achievement — no separate application required. The UWinAward Entrance Application Profile (submit by April 30 each year) opens access to additional bursaries. An International Student Support Bursary of CAD 10,000 is also available (10 awarded per year).",
    },
    {
      question: "When do clinical placements start at UWindsor?",
      answer:
        "Clinical placements begin in Year 1 — unlike programs that delay hands-on training to Year 3 or 4. This early integration builds skills and professional confidence progressively across all four years.",
    },
    {
      question: "What is NURS 3632 Consolidation?",
      answer:
        "A full-time block clinical placement in Year 3 that can include day shifts, evenings, and weekends — designed to replicate real nursing shift patterns. It is one of the most intensive clinical experiences in the programme and prepares students for the autonomous demands of RN practice.",
    },
    {
      question: "Is SDS (Student Direct Stream) still available?",
      answer:
        "No. The SDS was permanently discontinued on November 8, 2024. All Indian study permit applications now go through the standard stream (8–14 weeks processing) and require a Provincial Attestation Letter (PAL). Outdated information about SDS from older online articles is no longer accurate.",
    },
    {
      question: "What is the PAL and how do I get it for UWindsor?",
      answer:
        "The Provincial Attestation Letter (PAL) is a document from Ontario confirming your application counts within the province's allocation under Canada's national study permit cap. UWindsor issues the PAL after you accept your offer and pay your deposit. It is mandatory for most undergraduate applicants and the slowest step in the study permit timeline — accept your offer and trigger the PAL process immediately.",
    },
    {
      question: "How long is the PGWP for a UWindsor BScN graduate?",
      answer:
        "3 years — the maximum PGWP duration, for a 4-year bachelor's degree programme. The PGWP is an open work permit: any employer, any province, no job offer or LMIA required. Apply within 180 days of graduation.",
    },
    {
      question: "How do I become a Registered Nurse in Ontario after graduating?",
      answer:
        "Graduate from UWindsor Honours BScN → apply to CNO → satisfy Transition to Practice (automatic as recent Canadian graduate) → pass NCLEX-RN → pass Ontario Jurisprudence Examination → receive CNO Certificate of Registration. Typically 3–6 months post-graduation. No NNAS assessment or bridging programme required as a Canadian-educated nurse.",
    },
    {
      question: "Is the NCLEX-RN valid for nursing in the USA?",
      answer:
        "Yes. The NCLEX-RN is accepted by all US state nursing boards. Windsor's geographic location directly on the US border makes cross-border nursing careers uniquely accessible — a genuine advantage over programmes in inland Canadian cities.",
    },
    {
      question: "What are the PR pathways for Windsor BScN graduates?",
      answer:
        "Express Entry category-based healthcare draws (recent CRS cutoffs ~462–476 for NOC 31301 RN — well below the general pool cutoff of 500+) and the Ontario Immigrant Nominee Program (OINP), which adds 600 CRS points and effectively guarantees an ITA. Being in Ontario is a PR advantage. Students Traffic advises on the current best pathway as you approach graduation.",
    },
    {
      question: "How does Windsor compare to Toronto-area nursing programmes?",
      answer:
        "Same CASN accreditation and CNO registration outcome. Windsor's advantages: 20% lower cost of living, 250+ clinical partners, mildest winters in Canada, NCLEX-RN valid in the adjacent US market, and the same OINP/Express Entry PR pathway. The main trade-off is distance from Toronto (370 km) and a smaller city environment — which many Indian students report preferring in their first year in Canada.",
    },
    {
      question: "Is there dedicated mental health support for nursing students at Windsor?",
      answer:
        "Yes — the Faculty of Nursing has a dedicated Clinical Therapist (Laura Little, MSW, RSW) working exclusively with nursing and medical students, providing confidential short-term counselling at no additional cost. This support structure is unusually specific to nursing and is a meaningful differentiator.",
    },
  ],
  admissionsContent: {
    overview:
      "UWindsor accepts international nursing applicants for Fall (September) intake. Apply directly through the UWindsor international application portal or via OUAC. For nursing (a limited-enrolment, competitive programme), apply as early as possible — ideally by January–February for the following September. Three entry routes: (1) Direct 4-year BScN from Class 12 — standard route for Indian students; (2) Collaborative via St. Clair College — identical curriculum, starts at college, verify PGWP implications; (3) RPN to BScN Bridge — for CNO-registered RPNs with 2,000+ hours, entering at Year 3. Required documents: Class 10 & 12 transcripts, English test results (IELTS 6.5+), passport, Statement of Purpose, and Applicant Profile (required for transfer/collaborative applicants by March 1). International credentials require WES or equivalent evaluation for post-secondary study.",
    eligibility: {
      intro: "To apply to the UWindsor BScN as an Indian student:",
      items: [
        "Class 10+2 (CBSE, CISCE, or recognised State Board) with English, Biology, and Chemistry.",
        "Competitive average of 85%+ in Class 12 science subjects for nursing; 70% is the general university minimum but insufficient for the competitive nursing programme.",
        "IELTS Academic 6.5 overall with no band below 6.0; TOEFL iBT 83+, PTE Academic, or Duolingo 115+ also accepted.",
        "No SAT, ACT, NEET, or other entrance exam required.",
        "Full disclosure of any prior post-secondary coursework — WES evaluation required for international post-secondary transcripts.",
      ],
    },
    immigrationPathway: [
      "Accept UWindsor nursing offer + pay tuition deposit → trigger Ontario PAL (4–8 weeks). PAL is the slowest step — accept your offer immediately upon receiving it.",
      "Purchase GIC (CAD 22,895) from ICICI Bank Canada, SBI Canada, Scotiabank, or other participating institution.",
      "Complete upfront Immigration Medical Examination (IME) with IRCC-approved Panel Physician in India before submitting study permit application.",
      "Submit study permit application through IRCC portal with: LOA, PAL, GIC confirmation, tuition receipt, financial proof package, IELTS/TOEFL result, IME confirmation, strong Statement of Purpose, passport.",
      "Give biometrics at nearest VFS Global VAC in India.",
      "Receive Port of Entry Letter of Introduction → fly to Windsor via Toronto Pearson (YYZ, ~3.5 hrs drive) or Detroit Metro (DTW, 30 min) → collect physical study permit at border.",
      "Arrival week: activate GIC, apply for SIN at Service Canada, open Canadian bank account, get Canadian SIM, complete clinical pre-clearance requirements.",
    ],
    licensingPathway: [
      "Graduate from CASN-accredited UWindsor Honours BScN — meets CNO baccalaureate education requirement directly, no NNAS assessment required.",
      "Apply to College of Nurses of Ontario (CNO) for RN registration.",
      "Transition to Practice (TTP) automatically satisfied as a recent Canadian nursing graduate (within 3 years).",
      "Pass NCLEX-RN — UWindsor's curriculum is built to the Next Generation NCLEX (NGN) competency framework. Also valid for US state nursing board registration.",
      "Pass Ontario Jurisprudence Examination — online open-book exam on Ontario nursing laws and professional standards.",
      "Receive CNO Certificate of Registration — authorised to practise as RN in Ontario.",
      "Apply for 3-year PGWP within 180 days of graduation → work as Ontario RN at CAD 80,000–115,000+/year → build Canadian experience for Express Entry healthcare draw (CRS ~462–476) or OINP nomination (+600 CRS) → permanent residence.",
    ],
  },
  lastVerifiedAt: "2026-06-11",
  programs: [
    {
      slug: "university-of-windsor-bscn-2026",
      title: "Bachelor of Science in Nursing — Honours BScN (108 credit hours)",
      durationYears: 4,
      annualTuitionUsd: 26000,
      totalTuitionUsd: 104000,
      livingUsd: 9000,
      medium: "English",
      officialProgramUrl: "https://www.uwindsor.ca/nursing/",
      intakeMonths: ["September"],
      teachingPhases: [
        {
          phase: "Year 1 — Foundations of Nursing (Semesters 1–2)",
          language: "English",
          details:
            "Anatomy & physiology, biology, health assessment, introduction to professional nursing, sociology of health, communication. Skills lab from Semester 1. Introductory clinical placements in hospital and community settings begin in Year 1 — not delayed to later years.",
        },
        {
          phase: "Year 2 — Health, Illness & Populations (Semesters 3–4)",
          language: "English",
          details:
            "Pathophysiology, pharmacology, mental health nursing, health across the lifespan, family nursing, maternal and child health. Expanded clinical placements in medical/surgical and specialty settings at Windsor Regional Hospital and Hôtel-Dieu Grace Healthcare.",
        },
        {
          phase: "Year 3 — Complex Care & Community (Semesters 5–6)",
          language: "English",
          details:
            "Medical-surgical complex care, gerontological nursing, community health, oncology, evidence-based practice, nursing research. Critical care placements. NURS 3632 Consolidation — full-time block placement running days, evenings, and weekends to simulate real nursing shift patterns.",
        },
        {
          phase: "Year 4 — Leadership, Advanced Practice & Integration (Semesters 7–8)",
          language: "English",
          details:
            "Nursing leadership, healthcare policy, professional transition, advanced clinical placements, and a major capstone practicum. Direct NCLEX-RN preparation integrated. Students function near the autonomous RN level under reduced supervision in final placements.",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1",
          tuitionUsd: 26000,
          hostelUsd: 8000,
          livingUsd: 3000,
          totalUsd: 37000,
          notes:
            "Tuition ~CAD 35,000–38,000 + on-campus or shared off-campus accommodation in Windsor (~CAD 8,000–11,000/year) + food, transit, phone, supplies. Also includes one-time Year 1 costs: winter clothing, GIC (CAD 22,895 — returned to you in instalments), clinical pre-clearance fees ~CAD 800.",
        },
        {
          yearLabel: "Year 2",
          tuitionUsd: 26000,
          hostelUsd: 8000,
          livingUsd: 3000,
          totalUsd: 37000,
          notes:
            "Same cost structure. Clinical placements expand — budget for transportation to Windsor Regional Hospital and HDGH placement sites.",
        },
        {
          yearLabel: "Year 3",
          tuitionUsd: 26000,
          hostelUsd: 8000,
          livingUsd: 3000,
          totalUsd: 37000,
          notes:
            "NURS 3632 Consolidation full-time block placement — schedule is demanding. Transportation and possible evening/weekend placement travel costs apply.",
        },
        {
          yearLabel: "Year 4",
          tuitionUsd: 26000,
          hostelUsd: 8000,
          livingUsd: 3000,
          totalUsd: 37000,
          notes:
            "NCLEX-RN registration fee (USD 200 ~CAD 270) and CNO application costs payable upon graduation. PGWP application fee ~CAD 255.",
        },
      ],
      licenseExamSupport: [
        "NCLEX-RN (National Council Licensure Examination for Registered Nurses) — taken after graduation for CNO registration. UWindsor's curriculum is built to the Next Generation NCLEX (NGN) competency framework. Also valid for US state nursing board registration.",
        "Ontario Jurisprudence Examination — mandatory online open-book exam on Ontario nursing laws and professional regulations. Required alongside NCLEX-RN for CNO registration.",
      ],
      feeVerifiedAt: "2026-06-11",
      feeNotes:
        "Annual tuition ~CAD 35,000–38,000 for international BScN students per Students Traffic guide June 2026. Note: third-party sources have reported figures up to CAD 60,000+ — always verify the exact current year fee directly with UWindsor before financial planning. USD calculated at CAD 1 = USD 0.74. Living cost estimated at CAD 12,000/year (mid-range Windsor, off-campus shared). Windsor cost of living is approximately 20% below Toronto.",
    },
  ],
};

async function seed() {
  console.log("=== Seed: University of Windsor BScN (Canada) ===\n");
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
    console.log("\n✅ University of Windsor BScN seeded successfully.");
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
