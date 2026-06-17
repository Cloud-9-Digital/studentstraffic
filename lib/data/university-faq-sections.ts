export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  label: string;
  slug: string;
  faqs: FaqItem[];
};

const uetAlbaniaFaqSections: FaqSection[] = [
  {
    label: "About UET",
    slug: "about",
    faqs: [
      {
        question: "Where is the European University of Tirana located?",
        answer:
          "UET is located at Xhura Complex, St. Xhanfize Keko, Tirana, Albania — in the heart of the Albanian capital. The campus spans three modern urban buildings well-connected by city bus.",
      },
      {
        question: "Is UET a recognised university?",
        answer:
          "Yes. UET is fully accredited by ASCAL (Albania's national quality assurance agency) and holds a prestigious five-year institutional accreditation from the UK's QAA (Quality Assurance Agency), with the most recent review conducted in June 2025.",
      },
      {
        question: "Who offers the nursing programme at UET?",
        answer:
          "The Bachelor in Nursing is offered by UET's Faculty of Technical Medical Sciences, which also offers Physiotherapy and Medical Imaging Technology.",
      },
      {
        question: "Is the programme taught in English?",
        answer:
          "Yes. The Bachelor in Nursing at UET is conducted entirely in English, making it fully accessible to Indian students without needing to learn Albanian before enrolment.",
      },
      {
        question: "How long is the BN programme?",
        answer:
          "3 academic years (180 ECTS, 60 credits per year), following the European Bologna Process standard. This is one year shorter than a 4-year Canadian BScN.",
      },
      {
        question: "What EQF level is the degree?",
        answer:
          "Level 6 of the European Qualifications Framework — equivalent to a bachelor's degree in any EU or Bologna-signatory country. This is the standard level for nursing registration across Europe.",
      },
      {
        question: "What are UET's global rankings?",
        answer:
          "EduRank 2025: #7th in Albania, #6,816 globally. uniRank 2026: #3 in Albania, #7,698 globally. UET is a private, for-profit university — not in QS or THE global top-500. Its value lies in QAA accreditation, Bologna compliance, and the European nursing career pathway, not research prestige.",
      },
      {
        question: "Is UET affiliated with any European university networks?",
        answer:
          "Yes. UET is an active Erasmus+ partner with 125+ international university agreements for student and faculty exchange across Europe and beyond.",
      },
    ],
  },
  {
    label: "Admission & Eligibility",
    slug: "admission",
    faqs: [
      {
        question: "What Class 12 subjects do I need?",
        answer:
          "Physics, Chemistry, Biology, and English at the 10+2 level. These four subjects are mandatory for the nursing programme.",
      },
      {
        question: "What percentage do I need in Class 12?",
        answer:
          "Minimum 50% overall in Class 12. Competitive applicants tend to have 60%+. UET's nursing admission is not as competitive as Canadian nursing programmes, but stronger marks improve your chances of merit scholarships.",
      },
      {
        question: "Do I need NEET for UET nursing?",
        answer:
          "No. NEET is an Indian examination required for Indian medical/nursing college admission. European universities set their own entry criteria — UET does not require NEET for its nursing programme.",
      },
      {
        question: "Do I need SAT or GMAT?",
        answer:
          "No. UET does not require SAT, ACT, or GMAT from Indian undergraduate applicants.",
      },
      {
        question: "Do I need IELTS?",
        answer:
          "IELTS is typically not mandatory if you have studied in an English-medium school and can provide your marksheets as proof of English-medium education. Confirm with UET admissions for the current requirement before applying.",
      },
      {
        question: "When can I apply?",
        answer:
          "Applications are accepted on a rolling basis. The primary intake is October. Apply 4–6 months in advance to allow time for document apostille (4–6 weeks) and visa processing (4–8 weeks). February intake is also available for some programmes.",
      },
      {
        question: "How do I apply to UET?",
        answer:
          "Online via international.uet.edu.al. You submit scanned copies of required documents. Students Traffic manages the complete application process — eligibility check, document preparation, apostille, and submission.",
      },
      {
        question: "Can I transfer credits from an Indian university?",
        answer:
          "Possibly. UET has a credit recognition process. Bring your transcripts and course syllabus for a formal assessment. Students Traffic will coordinate this with UET on your behalf — you may qualify for a shorter programme if prior credits are recognised.",
      },
      {
        question: "Can GNM diploma holders apply?",
        answer:
          "Yes. Indian students who have completed a GNM (General Nursing and Midwifery) diploma may be eligible for advanced standing or recognition of prior learning at UET. Contact UET admissions with your marksheets and course syllabus for case-by-case assessment.",
      },
      {
        question: "Are there other entry pathways besides Class 12?",
        answer:
          "Yes. Pathway 2: Transfer entry with existing university credits. Pathway 3: GNM/diploma holders with prior nursing qualifications. Pathway 4: Post-graduate nursing options for Indian BSc Nursing graduates targeting UET's master-level programmes. Contact Students Traffic to find which pathway fits your profile.",
      },
    ],
  },
  {
    label: "Fees & Finances",
    slug: "fees",
    faqs: [
      {
        question: "What is the annual tuition at UET for nursing?",
        answer:
          "Approximately €3,000–5,000 per year for international students. Confirm the exact current nursing fee directly with UET admissions before applying, as fees are reviewed annually.",
      },
      {
        question: "What is the total 3-year cost?",
        answer:
          "Approximately €22,000–38,000 (INR 20–35 lakh) including tuition (~€9,000–15,000) and living costs (~€13,000–23,000) over 3 years. One of Europe's most affordable nursing degree pathways.",
      },
      {
        question: "What is the monthly living cost in Tirana?",
        answer:
          "€300–500/month covers accommodation, food, transport, and personal expenses comfortably. Tirana is one of the cheapest European capitals — comparable to many Indian metro cities in cost.",
      },
      {
        question: "Are there scholarships?",
        answer:
          "Yes. UET offers merit-based scholarships and partial fee waivers to international students. Students with strong Class 12 marks (80%+) should specifically request scholarship eligibility at the time of application. Erasmus+ funding may also be available for mobility programmes.",
      },
      {
        question: "Can I get an education loan from Indian banks?",
        answer:
          "Yes. Education loans for European programmes are available from Indian banks and NBFCs. UET's QAA accreditation and EQF Level 6 status are the key documents for the loan file. Students Traffic provides a loan documentation package to families for this purpose.",
      },
      {
        question: "Is it cheaper than studying nursing in Canada?",
        answer:
          "Significantly. A 4-year Canadian BScN costs INR 80–130 lakh total. UET's 3-year BN costs INR 20–35 lakh — 60–70% less. However, the career pathways and immigration outcomes differ. Canada is better if Canadian PR is the primary goal; Albania is better if European nursing (Germany/Italy) is the goal.",
      },
      {
        question: "Can I work while studying in Albania?",
        answer:
          "Indian students on an Albanian Type D student visa are generally not permitted to work during studies. However, the overall cost of Tirana is low enough that a family education loan comfortably covers 3 years without requiring part-time income.",
      },
      {
        question: "What additional costs should Indian families budget for?",
        answer:
          "Document apostille in India: INR 3,000–8,000. One-way flight to Tirana: INR 25,000–55,000. Annual return travel: INR 45,000–80,000 per trip. Health insurance: €30–50/month. Visa fee: ~€30–50. Year 1 setup costs (winter clothing, SIM): ~€100–200. Language classes (German/Italian): €40–80/month.",
      },
    ],
  },
  {
    label: "Clinical Training",
    slug: "clinical",
    faqs: [
      {
        question: "How much clinical training does the programme include?",
        answer:
          "Over 30 ECTS of clinical practice — including Clinical Practice 1 and 2 (8 ECTS, Year 2), Clinical Practice 3 and 4 (8 ECTS, Year 3), and Clinical Practice I and III (14 ECTS, Year 3). Clinical attendance at 75% is strictly mandatory.",
      },
      {
        question: "Where do students do clinical placements?",
        answer:
          "Primarily at the University Medical Centre 'Mother Teresa' (QSUT) in Tirana — Albania's largest national referral hospital with 1,612 beds and ~200,000 emergency patients per year. Students also rotate through regional hospitals, polyclinics, and public health institutes in Tirana.",
      },
      {
        question: "Is the clinical training real patient contact?",
        answer:
          "Yes. Students rotate through actual hospital wards under the supervision of registered nursing staff. This is not only simulation — it is genuine clinical training with real patients across medical, surgical, obstetric, paediatric, psychiatric, and emergency settings.",
      },
      {
        question: "How many students are in the nursing cohort?",
        answer:
          "UET's nursing programme typically has cohorts of 20–40 students per year. Exact class sizes vary — confirm with UET at the time of application.",
      },
      {
        question: "Is attendance mandatory?",
        answer:
          "Yes. Lecture attendance is 50% minimum; seminars and laboratory/clinical sessions require 75% attendance. Clinical hours are non-negotiable — they cannot be skipped and will determine your eligibility for the final examination.",
      },
      {
        question: "What specialist clinical areas are covered?",
        answer:
          "Rotations include neurology, psychiatry, surgery, orthopaedics, obstetrics/gynaecology, paediatrics, ICU and emergency care, public health, and primary care polyclinics — across Years 2 and 3. Year 3 has an extended consolidation placement before graduation.",
      },
      {
        question: "Is clinical instruction in English or Albanian?",
        answer:
          "Clinical instruction is in English. Clinical supervisors typically speak Albanian and often English. Basic Albanian language exposure during the programme helps with patient interaction — the university provides support for this.",
      },
    ],
  },
  {
    label: "Visa & Arriving",
    slug: "visa",
    faqs: [
      {
        question: "What type of visa do I need?",
        answer:
          "A Type D Long-Stay Student Visa — required for stays over 90 days (i.e., the full 3-year nursing programme). Applied for at the Albanian Embassy in New Delhi.",
      },
      {
        question: "How long does the Albanian student visa take?",
        answer:
          "Typical processing time is 4–8 weeks. Apply 2–3 months before your intended arrival date to avoid any delays affecting your October intake.",
      },
      {
        question: "Do I need an apostille on my Indian documents?",
        answer:
          "Yes. Your Class 12 certificate and marksheet must be notarised and apostilled by the Ministry of External Affairs (MEA) in India. This is mandatory — neither UET nor the Albanian Embassy will accept unapostilled documents. Allow 4–6 weeks for this process.",
      },
      {
        question: "Do I need a residence permit after arriving?",
        answer:
          "Yes. After arriving in Albania, you must apply for a Residence Permit within 30 days of arrival. UET's international office assists with this process. The permit is renewable annually for the duration of your studies.",
      },
      {
        question: "Can I travel to Schengen countries on an Albanian residence permit?",
        answer:
          "No. Albania is not in the Schengen Area. Your Albanian residence permit does not grant automatic access to Schengen countries (France, Germany, Italy, etc.). You need a separate Schengen visa for EU travel. However, Italy is accessible by a 1.5-hour ferry from Durrës (35km from Tirana).",
      },
      {
        question: "Which airport do I fly to?",
        answer:
          "Mother Teresa International Airport (TIA) in Rinas, about 17km from central Tirana. Flights from India typically connect via Dubai, Istanbul, Frankfurt, or Rome. Total travel time from India: approximately 7–10 hours with one connection.",
      },
      {
        question: "What documents are required for the Albanian Type D student visa?",
        answer:
          "Valid Indian passport (6+ months validity), UET Admission Letter, apostilled Class 12 documents, proof of accommodation in Tirana, proof of financial means (bank statements or education loan sanction letter covering ~€4,800–7,200), valid international health insurance, medical certificate, and the visa application form.",
      },
      {
        question: "Do I need IELTS for the visa application?",
        answer:
          "No. The Albanian student visa process does not mandatorily require IELTS. Language proof is typically satisfied by your Class 12 English-medium education marksheets.",
      },
    ],
  },
  {
    label: "Career After Graduation",
    slug: "career",
    faqs: [
      {
        question: "What career can I have after graduating from UET?",
        answer:
          "Immediately after graduation: nursing roles in Albanian hospitals, polyclinics, and public health institutions. With German B2 language training: nursing in Germany. With Italian B2: nursing in Italy. With additional exams: UK NMC registration or NCLEX-RN (Canada/USA). With INC application: nursing in India.",
      },
      {
        question: "Do I need German to work in Germany?",
        answer:
          "Yes — German language proficiency at B2 level is mandatory to work clinically in Germany. This is non-negotiable for patient safety reasons. Start learning German from Year 1 in Tirana, where language courses are affordable (€40–80/month).",
      },
      {
        question: "How long does it take to get German nursing recognition?",
        answer:
          "Typically 6–18 months after graduation, including the credential assessment by the state nursing board (deficiency notice), any required adaptation measures (3–12 months of bridge training), and the final registration. UET's EU-system degree makes this significantly faster than for Indian-educated nurses.",
      },
      {
        question: "Is the UET nursing degree recognised in Italy?",
        answer:
          "Italy has a well-established recognition pathway for Albanian nursing degrees. UET is specifically noted in Italian nursing recognition literature. With Italian B2 proficiency, application through FNOPI (Italian National Federation of Nursing Professions) typically takes approximately 90 days once documents are submitted.",
      },
      {
        question: "Can I do NCLEX-RN after UET?",
        answer:
          "Potentially, through the internationally educated nurse (IEN) pathway — NNAS for Canada or CGFNS for the USA. This is a longer process (12+ months, 51.6% IEN first-time NCLEX pass rate) and not the natural first career destination for a UET graduate. Germany and Italy are the primary recommended routes.",
      },
      {
        question: "Can I do a master's degree in Europe after UET?",
        answer:
          "Yes. UET's EQF Level 6 degree qualifies you for master's-level admission at most European universities. UET itself offers professional master and master of science programmes in health sciences.",
      },
      {
        question: "What is the salary for nurses in Germany?",
        answer:
          "Starting at approximately €2,200–2,800/month gross (~INR 2–2.5 lakh/month) for newly registered nurses, rising to €3,000–4,000+ with experience. Germany also offers a permanent residency pathway after 5 years of legal residence.",
      },
      {
        question: "What is the salary for nurses in Italy?",
        answer:
          "Approximately €1,400–1,900/month gross for registered nurses in Italy. Lower than Germany but Italy offers exceptional quality of life and cultural environment. Albania's ferry proximity to Italy creates natural networking opportunities.",
      },
      {
        question: "What is the salary for nurses in Albania after graduation?",
        answer:
          "Approximately €600–900/month gross for nurses in Albanian hospitals and health centres. Lower than Western Europe, but Albanian clinical experience is valuable for your European career pathway and can support your registration applications.",
      },
      {
        question: "How many Indian students are at UET currently?",
        answer:
          "The Indian student community at UET is growing but remains small — estimated at fewer than 100 students across all programmes as of 2025–26. Albania as a whole has an estimated 150–300 Indian students, with numbers increasing as awareness of the European nursing pathway grows.",
      },
      {
        question: "Can I return to India to practise nursing after UET?",
        answer:
          "Yes, but you need INC (Indian Nursing Council) recognition of your foreign degree. A European EQF Level 6 nursing degree should be eligible — verify current INC procedures before committing if India-return practice is the primary goal.",
      },
      {
        question: "What happens if I want to work in the UK after UET?",
        answer:
          "UK NMC registration requires English proficiency (OET or IELTS), a Computer-Based Test (CBT), and an Objective Structured Clinical Examination (OSCE). This route is possible but more complex than the German or Italian routes. UET's EQF Level 6 degree is assessed through NMC's international registration process.",
      },
    ],
  },
  {
    label: "Albania vs Canada",
    slug: "comparison",
    faqs: [
      {
        question: "Should I choose UET Albania or a Canadian nursing programme?",
        answer:
          "It depends on your goal. Choose Canada if: you want to live and work in Canada permanently; the PGWP and Express Entry pathways are your target; and you can fund INR 80–130 lakh total. Choose Albania if: you want to work in Germany or Italy; you are budget-conscious (INR 20–35 lakh total); you prefer a 3-year programme; and European clinical experience appeals to you. Students Traffic helps you compare based on your specific situation.",
      },
      {
        question: "Is an Albanian nursing degree valid in Canada?",
        answer:
          "A UET nursing degree is not directly equivalent to a CASN-accredited Canadian BScN. You would need to go through NNAS (National Nursing Assessment Service) as an internationally educated nurse — a process taking 12+ months with a 51.6% first-time NCLEX pass rate. Canada is not the natural target destination for a UET graduate.",
      },
      {
        question: "Is UET better than studying nursing in India?",
        answer:
          "For international career goals, UET is substantially better positioned than an Indian nursing degree. The cost is broadly similar to Indian private nursing colleges, but UET gives you a European degree (EQF Level 6, Bologna compliant) with direct pathways to nursing careers in Germany, Italy, and across Europe.",
      },
      {
        question: "What does UET offer that Indian nursing programmes don't?",
        answer:
          "A European degree (EQF Level 6) recognised across the EU and eligible for credential recognition in Germany, Italy, and the UK. Direct entry into the streamlined EU-system credential recognition pathway — significantly faster than the IEN route for Indian-educated nurses. Erasmus+ access to 125+ European universities. European clinical experience at QSUT — Albania's national referral hospital.",
      },
      {
        question: "Is the Germany nursing pathway from Albania realistic?",
        answer:
          "Yes. This is a well-established, documented route — not a theoretical possibility. Many South Asian and Albanian nurses work in German hospitals today. The pathway requires German B2 proficiency and credential assessment by the relevant state authority. With proper language preparation starting in Year 1, the average timeline is 6–18 months post-graduation to full German RN registration.",
      },
    ],
  },
  {
    label: "Parent Questions",
    slug: "parents",
    faqs: [
      {
        question: "Albania is a small country — is this degree really worth anything internationally?",
        answer:
          "The degree is worth something specific: it is a European degree (EQF Level 6, Bologna compliant, 180 ECTS) recognised in the EU and, through credential assessment processes, in the UK, Canada, and beyond. Its primary value is as a European pathway to nursing employment in Germany, Italy, or other EU countries — where demand is high and the recognition pathway is well-established. If your child's goal is specifically to work and settle in Germany or Italy, this degree is strong. If the goal is Canada from day one, we recommend a Canadian programme.",
      },
      {
        question: "Is it safe for an Indian student — especially a daughter — in Tirana?",
        answer:
          "Albania has a very low violent crime rate and is considered one of the safest countries in the Balkans. Tirana is a modern, well-lit European capital. Albanian culture deeply values hospitality — the concept of 'Besa' (sacred protection of guests) is genuine, not marketing. Indian students, including female students, report feeling safe in Tirana. Standard urban precautions apply, but no exceptional safety concerns have been reported by Indian nursing students there.",
      },
      {
        question: "How will my child manage food and daily life in Tirana?",
        answer:
          "Tirana has large supermarkets (Conad, Carrefour) that stock basmati rice, lentils, chickpeas, spices, and other Indian cooking staples. There are Indian restaurants and Asian food shops in central Tirana. Mediterranean cuisine is broadly compatible with vegetarian Indian diets. Most students cook for themselves in shared apartments. The first month is the biggest adjustment; after that, students settle into routines. Students Traffic alumni in Tirana are connected with new students to help with the initial setup.",
      },
      {
        question: "What if my child wants to come back to India after graduating?",
        answer:
          "Returning to India and practising as a nurse requires INC (Indian Nursing Council) recognition of the foreign degree. A European EQF Level 6 nursing degree should be eligible for INC assessment — verify current INC procedures before committing if India-return practice is the primary goal. Most families investing in a European nursing degree are targeting European employment, where the salary differential makes careers significantly more rewarding financially.",
      },
      {
        question: "Is the total cost really just INR 20–35 lakh for 3 years?",
        answer:
          "Yes — that is the honest range for tuition plus living in Tirana. It does not include flights (INR 1–2 lakh over 3 years), setup costs, language classes if separately enrolled, and incidentals. The realistic all-in budget for 3 years is INR 22–40 lakh — significantly lower than comparable programmes in Canada, UK, or Australia. It is broadly comparable to better Indian private nursing colleges but with a European degree at the end.",
      },
      {
        question: "Can you guarantee placement in Germany or Italy?",
        answer:
          "No — and be very wary of any consultant who makes this guarantee. What we can tell you honestly is that the credential recognition pathway to Germany and Italy is well-documented, has been used successfully by many Albanian nursing graduates, and is genuinely achievable with the right language preparation and post-graduation planning. Students Traffic guides you through this pathway with honesty, not false promises.",
      },
    ],
  },
];

const wbuAlbaniaFaqSections: FaqSection[] = [
  {
    label: "About WBU",
    slug: "about",
    faqs: [
      {
        question: "Where is Western Balkans University located?",
        answer:
          "Highway Tiranë-Durrës, KM 7, Kashar, Tirana, Albania — a modern, purpose-built campus approximately 15–25 minutes from central Tirana.",
      },
      {
        question: "Is WBU an accredited university?",
        answer:
          "Yes. WBU holds ASCAL (Albanian Agency for Quality Assurance) maximum 6-year institutional accreditation as of April 2024 — the highest possible rating in Albania.",
      },
      {
        question: "Is WBU ranked in QS or THE rankings?",
        answer:
          "WBU has a Times Higher Education institutional profile but does not yet appear in QS or THE global ranking tables — it is a newer university (founded 2021). Its strength is ASCAL's maximum accreditation and hospital partnerships, not prestige rankings.",
      },
      {
        question: "What is the Bologna Process and why does it matter?",
        answer:
          "The Bologna Process aligns higher education across 49 European countries. WBU's degree structure (Bachelor/Master/Doctorate, ECTS credits) is Bologna-compatible — consistent with universities in Germany, France, Italy, and across the EU, which matters for post-graduation credential recognition.",
      },
      {
        question: "What languages are programmes offered in?",
        answer:
          "The BSc Nursing is available in English and Albanian. For Indian students, the English-medium track is the relevant one. WBU also offers free German and Italian language courses alongside the main programme.",
      },
      {
        question: "Who founded WBU and what is the hospital connection?",
        answer:
          "WBU was established through a cooperation framework between the American Hospitals Group (largest private hospital network in Albania/Kosovo), International Hospital Hygeia, and Cambridge Clinical Laboratories. These founding hospital partners provide clinical training placements — the connection is structural, not just an agreement on paper.",
      },
      {
        question: "How many students study at WBU?",
        answer:
          "WBU has a growing international student body representing 25+ countries. Nursing cohort sizes are intentionally small — enabling close faculty-student interaction and personalised clinical supervision.",
      },
      {
        question: "Does WBU offer an MSc Nursing as well?",
        answer:
          "Yes. WBU offers a Master of Science in Nursing (MSc) in 5 specialisation profiles — a direct continuation for BSc Nursing graduates who want advanced qualifications.",
      },
    ],
  },
  {
    label: "Admission & Eligibility",
    slug: "admission",
    faqs: [
      {
        question: "What Class 12 percentage do I need for WBU nursing?",
        answer:
          "Minimum 70% overall in higher secondary education. Science subjects (Biology, Chemistry) are preferred. Evaluation formula: 70% academic record + 30% admissions interview.",
      },
      {
        question: "Do I need IELTS for WBU nursing?",
        answer:
          "No. IELTS is NOT required. A Medium of Instruction (MOI) certificate from your Class 12 English-medium school is the standard route for Indian students.",
      },
      {
        question: "Do I need NEET for WBU nursing?",
        answer:
          "No. NEET is an Indian medical entrance exam and is not required for WBU's nursing programme.",
      },
      {
        question: "Do I need SAT, GRE, or any other standardised test?",
        answer:
          "No. WBU does not require any standardised international test for undergraduate nursing admission.",
      },
      {
        question: "What is the admissions interview like?",
        answer:
          "The WBU Admissions Evaluation Commission conducts a short academic interview in English, counting for 30% of your ranking. It covers nursing motivation, academic background, and career plans. It is genuine — not a formality. Students Traffic conducts mock interview preparation specific to WBU.",
      },
      {
        question: "Can I apply if I have already started a nursing programme in India?",
        answer:
          "Transfer students can apply to WBU. Credits from your previous programme will be individually assessed for recognition. Contact WBU International Admissions and Students Traffic for a specific evaluation.",
      },
      {
        question: "Can a student with a GNM diploma apply?",
        answer:
          "Potentially yes — WBU's Transfer pathway allows individual assessment of prior qualifications. Bring your GNM marksheets and course syllabus for a formal credit evaluation.",
      },
      {
        question: "What documents are required for application?",
        answer:
          "Passport copy, Class 10 and 12 certificates and marksheets, passport photographs, MOI certificate or English language proof, and any scholarship supporting documents.",
      },
    ],
  },
  {
    label: "Fees & Scholarships",
    slug: "fees",
    faqs: [
      {
        question: "What is the annual tuition for BSc Nursing at WBU?",
        answer:
          "Approximately €5,000 per year (standard rate). Verify the current rate with WBU admissions at admissions.wbu.edu.al — fees can be reviewed annually.",
      },
      {
        question: "What is the total 3-year cost for an Indian student?",
        answer:
          "Approximately €34,000–43,000 all-in (tuition + living + books + insurance + visa) — approximately INR 31–39 lakhs. Significantly lower than Canada (INR 1.3–1.6 crore), Australia (INR 80 lakh–1 crore), or UK (INR 60–80 lakh).",
      },
      {
        question: "Are scholarships available for Indian students?",
        answer:
          "Yes. WBU Excellence Scholarships are supported by the American Hospitals Group and Hygeia Hospital for students with high academic scores or national/international competition achievements. Deadline is typically around March 31st — apply early.",
      },
      {
        question: "What is the cost of living in Tirana per month?",
        answer:
          "€500–700/month covers accommodation, food, transport, SIM card, and personal expenses comfortably. Students who share apartments and cook at home can manage on €450–500/month.",
      },
      {
        question: "Does WBU have student accommodation?",
        answer:
          "Yes. WBU has two student residences — Fole Residence in Tirana (10 minutes from campus) and a residence in Durrës — with single, double, and triple rooms including air conditioning, Wi-Fi, gym, laundry, and cafeteria. Single rooms: ~€200–350/month; shared: ~€150–250/month per person.",
      },
      {
        question: "Can I take an education loan for WBU?",
        answer:
          "Yes. Indian banks and NBFCs offer education loans for accredited international institutions. WBU's ASCAL accreditation and lower total cost (INR 31–39 lakhs vs INR 1+ crore for Canada) make it highly loan-viable.",
      },
    ],
  },
  {
    label: "Visa & Immigration",
    slug: "visa",
    faqs: [
      {
        question: "What visa do I need to study at WBU?",
        answer:
          "A Type D Long-Stay Student Visa from the Embassy of Albania in New Delhi, followed by a Temporary Residence Permit (TRP) within 30 days of arriving in Albania.",
      },
      {
        question: "Where is the Albanian Embassy in India?",
        answer:
          "Embassy of the Republic of Albania, New Delhi. Appointment booking is mandatory for Type D visa applications.",
      },
      {
        question: "How long does the Albania student visa take?",
        answer:
          "15–30 days processing time after application submission. Apply as early as possible after receiving your WBU Letter of Acceptance — ideally 2–3 months before the programme start date.",
      },
      {
        question: "Can I get an eVisa to study in Albania?",
        answer:
          "The Albania eVisa is for short-stay tourism (up to 90 days). For a 3-year nursing programme you need the full Type D Long-Stay Student Visa from the embassy.",
      },
      {
        question: "What is the Temporary Residence Permit (TRP)?",
        answer:
          "The TRP is your official permit to reside in Albania as a student. Apply within 30 days of arrival at the Immigration Office (Drejtoria e Shërbimit të Migracionit) in Tirana. WBU's International Relations Office assists enrolled students. The TRP is renewed annually.",
      },
      {
        question: "Can I work part-time while studying in Albania?",
        answer:
          "International students typically need a separate work permit to work legally in Albania. WBU's EPIC programme provides study-linked professional activities. Check current Albanian immigration rules at the time of your application.",
      },
      {
        question: "Is Albania in the Schengen Area?",
        answer:
          "No. Your Albania Type D visa does not allow free travel in Schengen countries. However, Italy is accessible by ferry from Durrës (35km from Tirana), and Albania allows easy travel to several Balkan neighbours.",
      },
      {
        question: "What documents do I need for the Albania Type D student visa?",
        answer:
          "Valid passport (6+ months validity), WBU Letter of Acceptance, Class 10 and 12 certificates, MOI/English proficiency evidence, proof of financial means, proof of accommodation in Albania, medical health certificate, police clearance certificate, No Objection Certificate from school, and valid health insurance.",
      },
    ],
  },
  {
    label: "Clinical Training",
    slug: "clinical",
    faqs: [
      {
        question: "Where do WBU nursing students do their clinical placements?",
        answer:
          "Primary placements are at the American Hospitals Group and International Hospital Hygeia — WBU's founding hospital partners. Students also rotate through Albanian public hospitals, Cambridge Clinical Laboratories, and specialised clinics in dermatology, mental health, obstetrics/gynaecology, paediatrics, and rehabilitation.",
      },
      {
        question: "When does clinical training start?",
        answer:
          "Professional Practice I begins in Semester 2 — the second half of Year 1. This is earlier than most European nursing programmes, meaning students enter real hospital settings at American Hospitals Group and Hygeia from Year 1 itself.",
      },
      {
        question: "Are there simulation labs at WBU before clinical placement?",
        answer:
          "Yes. WBU has a dedicated Nursing Lab and Physiology and Anatomy Lab on campus for skills training and simulation before live patient-care settings.",
      },
      {
        question: "What is the class size for BSc Nursing?",
        answer:
          "Nursing cohorts at WBU are intentionally small — professors know students individually, clinical supervision is personalised, and the learning environment is collaborative.",
      },
      {
        question: "Is there a Diploma Thesis required?",
        answer:
          "Yes. Semester 6 includes a Diploma Thesis / Final Exam (6 ECTS) — a research and academic writing component standard in European bachelor's programmes.",
      },
      {
        question: "Are faculty qualified and internationally trained?",
        answer:
          "The Department of Nursing and Physiotherapy is headed by Dr. Ana Uka and includes qualified professors and assistant lecturers with both Albanian and international training.",
      },
    ],
  },
  {
    label: "Career After Graduation",
    slug: "career",
    faqs: [
      {
        question: "What jobs can I get after completing the WBU BSc Nursing?",
        answer:
          "Licensed nurse in Albania's public and private sectors, including at American Hospitals Group and Hygeia. With German B2: the MEDIAN Clinics Germany pathway. With IELTS 7.0: UK NHS registration (NMC). Gulf countries (UAE, Saudi Arabia, Qatar) also actively recruit European-trained nurses.",
      },
      {
        question: "What is the MEDIAN Clinics Germany partnership?",
        answer:
          "MEDIAN Clinics, one of Germany's largest rehabilitation and acute care hospital networks, visited WBU, reviewed the Nursing and Physiotherapy facilities, and opened a direct employment project for WBU graduates to join German clinical teams. This is a named employer pathway — not a theoretical route.",
      },
      {
        question: "Can I work in Germany after WBU?",
        answer:
          "Yes — with German B2 language proficiency and the Anerkennungsgesetz (Recognition Act) credential assessment. WBU offers free German language courses during the BSc. Nursing salaries in Germany start at €30,000–50,000+/year.",
      },
      {
        question: "Can I work in the UK after WBU?",
        answer:
          "Yes — through the NMC overseas applicant route: IELTS Academic 7.0 + Computer-Based Test (CBT) + OSCE + NMC registration. NHS starting salaries: £28,000–35,000 (Band 5). Plan 12–18 months post-graduation for full registration.",
      },
      {
        question: "Can I work in Canada after WBU?",
        answer:
          "Through the Internationally Educated Nurse (IEN) pathway: NNAS assessment + NCLEX-RN + provincial registration. This is possible but requires more steps than graduating from a Canadian BScN. If Canada is the primary goal, a Canadian programme is the more efficient route.",
      },
      {
        question: "Can I do an MSc Nursing after the WBU BSc?",
        answer:
          "Yes. WBU offers MSc Nursing in 5 specialisation profiles, directly continuing from the BSc. Provides advanced specialisation and opens senior clinical career and academic tracks.",
      },
    ],
  },
  {
    label: "Student Life",
    slug: "student-life",
    faqs: [
      {
        question: "Is there Indian food available in Tirana?",
        answer:
          "Tirana has a growing international food scene. Indian staples (basmati rice, lentils, chickpeas, spices) are available in major supermarkets (Conad, Carrefour) and specialty stores. Halal meat is widely available. Most Indian students cook at home — groceries cost around €150–200/month.",
      },
      {
        question: "Is Tirana safe for Indian female students?",
        answer:
          "Tirana is considered safe for international female students. Albania has strong cultural traditions of hospitality (Besa — protection of guests). WBU has a security presence and a Dean of Students office. Normal urban precautions apply.",
      },
      {
        question: "How do I send money from India to Albania?",
        answer:
          "Bank wire transfers (SWIFT) are the standard method. Wise (formerly TransferWise) offers cheaper rates for international transfers. ATMs are widely available in Tirana.",
      },
      {
        question: "Can I visit home during academic breaks?",
        answer:
          "Yes. Albania is connected via Istanbul, Dubai, and other hubs. Round-trip flights from Tirana to India typically cost €400–800 depending on season. Academic breaks (Christmas, summer) allow travel home.",
      },
      {
        question: "Are there other Indian students at WBU?",
        answer:
          "Yes. WBU's 25+ country student community includes Indian students. The Indian community at WBU is growing and forms supportive networks. Students Traffic connects new students with existing WBU Indian students before arrival.",
      },
      {
        question: "Does WBU have religious facilities?",
        answer:
          "Tirana city has mosques, churches, and diverse places of worship for different faiths — Albania is officially secular but historically diverse. There is no dedicated Hindu temple in Tirana currently.",
      },
      {
        question: "What happens if I fall sick in Albania?",
        answer:
          "WBU students have access to health services on or near campus. Tirana has private hospitals (including the American Hospital where clinical training takes place) and public hospitals. International student health insurance is required for the residence permit.",
      },
    ],
  },
  {
    label: "Parent Questions",
    slug: "parents",
    faqs: [
      {
        question: "Is WBU a real, recognised university? Can I trust this degree?",
        answer:
          "WBU is fully accredited by ASCAL with the maximum 6-year rating as of April 2024. It operates under Albania's university law and the European Bologna Process. It has a Times Higher Education institutional profile. The degree is real and the accreditation is current. It is a newer university (founded 2021) and does not yet appear in QS global rankings — we tell you this honestly.",
      },
      {
        question: "Why Albania? It seems unknown to us.",
        answer:
          "Albania is an EU candidate country positioned within the European Higher Education Area. It has a Mediterranean climate, affordable living, and genuine European-standard accreditation. WBU's European-aligned degree, English-medium instruction, no IELTS requirement, clinical training at founding hospital partners, and the MEDIAN Clinics Germany employment partnership make it one of the most cost-effective pathways to a European nursing career for Indian students.",
      },
      {
        question: "Is my child safe in Tirana?",
        answer:
          "Tirana is considered one of the safer capitals in Southeast Europe. Albanian cultural tradition includes strong hospitality towards foreigners. Violent crime against international students is very uncommon. WBU has a Dean of Students office that monitors student welfare.",
      },
      {
        question: "What happens after graduation? Will my child get a job?",
        answer:
          "WBU has an active MEDIAN Clinics Germany employment partnership — one of the most concrete post-graduation employment bridges in European nursing education. Graduates who complete German B2 (which WBU offers free) are in a strong position for Germany. The UK NHS route (NMC registration) is an established pathway. Albania itself (American Hospitals Group and Hygeia) offers post-graduation employment.",
      },
      {
        question: "The total cost is much lower than Canada or the UK. Is there a catch?",
        answer:
          "The lower cost reflects Albania's genuine affordability, not a compromise in degree quality. The ASCAL maximum accreditation is rigorous and current. Clinical training is at the most advanced private hospital networks in Albania. The honest caveat: WBU is newer (not yet in QS/THE tables), and the Canada pathway requires additional IEN assessment steps. For students targeting Europe — Germany, UK, or Southeast Europe — WBU is a strong option.",
      },
      {
        question: "Can you guarantee placement in Germany or Italy?",
        answer:
          "No — and be very wary of any consultant who does. The MEDIAN Clinics partnership is a real, documented employer relationship. The Anerkennungsgesetz pathway to Germany is well-established. German B2 is achievable during the programme with WBU's free language courses. Students Traffic guides you through this with honest planning, not false promises.",
      },
    ],
  },
];

const muaAlbaniaFaqSections: FaqSection[] = [
  {
    label: "About MUA",
    slug: "about",
    faqs: [
      {
        question: "What is the Mediterranean University of Albania (MUA)?",
        answer:
          "MUA is a private Albanian university established in 2009, accredited by QAAHE (Quality Assurance Agency for Higher Education Albania) and ranked #21 in Albania by EduRank 2026. It offers a 3-year, 180 ECTS BSc Nursing programme fully in English, with free German (A1–B2) and Italian language training embedded in the curriculum. MUA reports an 85% placement rate for nursing graduates in European healthcare systems — primarily Germany, Austria, and Italy.",
      },
      {
        question: "Is MUA accredited?",
        answer:
          "Yes. MUA is accredited by QAAHE (Quality Assurance Agency for Higher Education Albania) and licensed by the Albanian Ministry of Education and Sports. Its nursing programme operates under the Bologna Process and is aligned with EU Directive 2013/55/EU on the recognition of professional qualifications.",
      },
      {
        question: "Is MUA's nursing degree recognised across the EU?",
        answer:
          "MUA's BSc Nursing is aligned with EU Directive 2013/55/EU and the Bologna Process (180 ECTS, EQF Level 6). Because Albania is an EU candidate country — not yet a full EU member — the degree is not subject to the same automatic recognition as degrees from EU member state universities. However, the credential recognition pathway to Germany, Austria, and Italy via Anerkennungsgesetz (Germany) and equivalent processes is well-established and actively used by MUA graduates.",
      },
      {
        question: "What are MUA's rankings?",
        answer:
          "EduRank 2026: #21 in Albania. MUA is a private institution established in 2009 and is not in QS or THE global ranking tables. Its value lies in QAAHE accreditation, Bologna compliance, the 85% European placement rate, and the free German and Italian language training programme — not research prestige.",
      },
      {
        question: "Is MUA a private or public university?",
        answer:
          "MUA is a private university, established in 2009. It is accredited by the same QAAHE body that accredits all Albanian universities (public and private). The programme fee of €3,500/year makes it one of the most affordable private European nursing universities accessible to Indian students.",
      },
      {
        question: "What degree does MUA award and how does it compare to a 4-year BSc Nursing?",
        answer:
          "MUA awards a Bachelor of Science in Nursing — 3 years, 180 ECTS, aligned with EU Directive 2013/55/EU. This is one year shorter than a 4-year Canadian BScN (240 ECTS) but meets the EU minimum for nursing qualification recognition across European countries. The difference matters mainly for students targeting Canada directly — for Germany, Italy, Austria, or the UK, the 180 ECTS EU-aligned degree is the standard.",
      },
    ],
  },
  {
    label: "Admission & Eligibility",
    slug: "admission",
    faqs: [
      {
        question: "What Class 12 subjects do I need for MUA BSc Nursing?",
        answer:
          "Science background with Biology is preferred. The programme is healthcare-focused, and Biology is strongly recommended. Confirm current subject requirements with MUA admissions at the time of application.",
      },
      {
        question: "What percentage do I need in Class 12?",
        answer:
          "Minimum 50–60% overall in Class 12 (confirm current threshold with MUA admissions before applying). Competitive applicants typically have 60%+. MUA admission is more accessible than Canadian programmes but still requires a genuine academic record.",
      },
      {
        question: "Do I need NEET to apply to MUA?",
        answer:
          "No. NEET is an Indian entrance exam for Indian medical and nursing colleges. MUA sets its own entry criteria for international applicants and does not require NEET.",
      },
      {
        question: "Do I need IELTS for MUA?",
        answer:
          "No. IELTS is not required. A Medium of Instruction (MOI) certificate from your English-medium Class 12 school is the standard route for Indian students — it confirms your schooling was in English without requiring a formal English test.",
      },
      {
        question: "When is the MUA BSc Nursing intake?",
        answer:
          "The primary intake is October, with an application deadline of August 31. This is well-timed for Indian students — Class 12 board results are declared by May/June, leaving 2–3 months for application, visa, and travel preparation.",
      },
      {
        question: "What is the MUA admissions interview?",
        answer:
          "MUA conducts an admissions interview in English covering your motivation for nursing and academic background. It is a genuine assessment — not a formality. Students Traffic prepares applicants for the interview with mock sessions specific to MUA's format.",
      },
      {
        question: "How do I apply to MUA?",
        answer:
          "Applications are submitted through MUA's international admissions process. Documents required include Class 10 and 12 certificates and marksheets, passport copy, passport photographs, and MOI certificate. Students Traffic manages the complete application process — eligibility check, document preparation, interview preparation, and submission.",
      },
      {
        question: "Can GNM diploma holders apply to MUA?",
        answer:
          "Potentially yes. Prior nursing qualifications may be assessed for credit recognition on a case-by-case basis. Bring your GNM marksheets and course syllabus to Students Traffic for a pre-application eligibility assessment.",
      },
    ],
  },
  {
    label: "Fees & Finances",
    slug: "fees",
    faqs: [
      {
        question: "What is MUA's annual tuition for BSc Nursing?",
        answer:
          "Annual tuition is €3,500/year (approximately INR 3.1–3.5 lakh/year at mid-2026 exchange rates). This makes MUA one of the most affordable English-medium European BSc Nursing programmes available to Indian students.",
      },
      {
        question: "What is the total 3-year cost for Indian students?",
        answer:
          "Approximately €22,500–27,000 all-in — covering tuition (€10,500), living costs (€11,500–15,000 over 3 years including accommodation, food, transport, insurance, and visa fees). At mid-2026 rates, this is approximately INR 20–25 lakh — significantly lower than Canada (INR 1.3–1.6 crore), the UK (INR 60–80 lakh), or Australia (INR 80 lakh–1 crore).",
      },
      {
        question: "What are monthly living costs in Tirana?",
        answer:
          "€300–545/month covers private apartment (€150–280, shared), food and groceries (€100–150), local transport (€15–20), phone/SIM (€8–15), and miscellaneous personal expenses (€50–100). Students who cook at home and share apartments manage on €300–400/month. Tirana is one of Europe's lowest-cost capitals for students.",
      },
      {
        question: "Are scholarships available at MUA?",
        answer:
          "Contact MUA admissions directly for current scholarship availability for international students. Students Traffic advises on any merit-based fee reductions available at the time of application. Confirm current scholarship terms before factoring any discount into your cost plan.",
      },
      {
        question: "Can I get an Indian education loan for MUA?",
        answer:
          "Yes. Indian banks and NBFCs offer education loans for accredited international institutions. MUA's QAAHE accreditation, EU Directive alignment, and low total cost (INR 20–25 lakh vs INR 1 crore+ for Canada) make it highly loan-viable. Students Traffic provides a documentation package to support the education loan file.",
      },
      {
        question: "Is MUA cheaper than studying nursing in Canada or the UK?",
        answer:
          "Significantly. A 4-year Canadian BScN costs INR 1.3–1.6 crore total; a 3-year UK nursing degree costs INR 60–80 lakh. MUA's 3-year programme costs INR 20–25 lakh — 60–80% lower. The career pathway also differs: MUA is optimised for Germany, Italy, and Austria; Canada is better if Canadian PR is the primary objective.",
      },
    ],
  },
  {
    label: "Clinical Training",
    slug: "clinical",
    faqs: [
      {
        question: "Where do MUA students do clinical placements?",
        answer:
          "MUA nursing students complete clinical rotations at affiliated Tirana hospitals and healthcare centres. Year 1 focuses on nursing simulation labs on campus (high-fidelity mannequins, clinical skills stations). Years 2 and 3 involve supervised hospital placements covering medical, surgical, paediatric, obstetric, psychiatric, and emergency nursing departments.",
      },
      {
        question: "How many clinical hours are required in the MUA programme?",
        answer:
          "MUA's total clinical contact hours exceed 2,300 hours across the 3-year programme, contributing to the EU Directive 2013/55/EU minimum of 4,600 total programme hours (theory plus clinical combined). The Year 3 extended practicum requires a minimum of 800 clinical hours in a healthcare institution.",
      },
      {
        question: "When do MUA students start hospital placements?",
        answer:
          "Year 1 is campus-based — students develop core skills in nursing simulation labs before entering live hospital environments. Hospital rotations begin in Year 2 with supervised patient care. Year 3 includes the extended clinical practicum (minimum 800 hours) across Tirana hospital affiliates.",
      },
      {
        question: "What specialties are covered in MUA clinical rotations?",
        answer:
          "Rotations in Years 2 and 3 cover Internal Medicine, Surgical Nursing, Paediatric Nursing, Obstetric and Gynaecological Nursing, Psychiatric and Mental Health Nursing, Emergency Nursing, Geriatric Nursing, Community Health Nursing, and Nursing Management. Clinical instruction is delivered in English.",
      },
      {
        question: "What are MUA's nursing simulation lab facilities like?",
        answer:
          "MUA operates dedicated nursing simulation labs equipped with high-fidelity mannequins — allowing students to practise clinical procedures (vital signs, IV access, patient observation, basic emergency response) in a controlled environment before entering live hospital settings. The digital library and subject-specific digitally equipped classrooms support the academic side of training.",
      },
    ],
  },
  {
    label: "Career Pathways",
    slug: "career",
    faqs: [
      {
        question: "Can I work as a nurse in Germany after graduating from MUA?",
        answer:
          "Yes — with German B2 proficiency. MUA's curriculum includes free German language training from A1 to B2 level. After graduation, you apply for Anerkennungsgesetz (Germany's Recognition Act) credential assessment. Once recognition is confirmed, you can work as a registered nurse in Germany at salaries starting from €30,000–50,000+/year (approximately INR 2.7–4.5 lakh/month).",
      },
      {
        question: "Can I work in Italy after MUA?",
        answer:
          "Yes. MUA includes free Italian language training alongside the nursing curriculum. With Italian language proficiency and Italian nursing registration (FNOPI), graduates can work in the Italian healthcare system. Italy is one of three primary European destination pathways alongside Germany and Austria.",
      },
      {
        question: "What is MUA's graduate placement rate?",
        answer:
          "MUA reports an 85% placement rate for nursing graduates in European healthcare systems — primarily Germany, Austria, and Italy. The free German and Italian language training embedded in the 3-year curriculum is the core enabler of this European placement record.",
      },
      {
        question: "Is MUA BSc Nursing recognised by the Indian Nursing Council (INC)?",
        answer:
          "No. MUA's BSc Nursing degree is not currently recognised by the Indian Nursing Council (INC). This programme is designed for students targeting nursing careers in Europe or the Middle East — not for returning to practice nursing in India. If India-return nursing practice is the primary goal, confirm INC procedures before committing.",
      },
      {
        question: "Can I work in the UK after graduating from MUA?",
        answer:
          "Potentially. UK Nursing and Midwifery Council (NMC) registration for internationally educated nurses requires additional steps: IELTS Academic 7.0 overall, NMC Computer-Based Test (CBT), and Objective Structured Clinical Examination (OSCE). Achieving NMC registration from an Albanian nursing degree is possible but requires significant additional preparation compared to the Germany/Italy pathway.",
      },
      {
        question: "Can I work in the UAE or Middle East after MUA?",
        answer:
          "The Middle East recognises nursing degrees from accredited European programmes, subject to the licensing requirements of each country (DHA for Dubai, HAAD for Abu Dhabi, SCFHS for Saudi Arabia). An EU Directive-aligned BSc Nursing with QAAHE accreditation typically meets the academic baseline for Middle East licensing assessment. Confirm with the specific regulatory authority at the time of graduation.",
      },
      {
        question: "German B2 in 3 years — is it realistic?",
        answer:
          "MUA provides free German language training from A1 to B2 level across the 3-year nursing curriculum — starting in Year 1 and intensifying through Year 3. Achieving Goethe Institut B2 during or immediately after the programme is realistic for motivated students who attend consistently and practise outside class. Students Traffic recommends starting a German practice routine from Day 1 of Year 1 — language is the primary preparation item, not the degree itself.",
      },
    ],
  },
  {
    label: "Languages",
    slug: "languages",
    faqs: [
      {
        question: "What languages are taught alongside nursing at MUA?",
        answer:
          "MUA includes free German language training from A1 to B2 level and free Italian language training — both embedded in the 3-year nursing curriculum at no additional charge beyond tuition. This is MUA's most significant differentiator: no other European nursing programme at this price point includes two European language pathways as part of the degree.",
      },
      {
        question: "Do I need to know Albanian to study at MUA?",
        answer:
          "No. The BSc Nursing programme is conducted entirely in English — no Albanian is required for coursework or clinical placements. Albanian language basics (greetings, shopping, navigation) are helpful for daily life in Tirana but are not assessed or required.",
      },
      {
        question: "Is German B2 mandatory for the nursing degree?",
        answer:
          "German B2 is not required to graduate from MUA — the degree is completed in English. However, German B2 is mandatory for clinical nursing employment in Germany, and it is the most critical preparation item for the Germany career pathway. MUA's free A1–B2 training gives you the structure; consistent effort alongside the degree is what gets you there.",
      },
      {
        question: "Which language should I prioritise — German or Italian?",
        answer:
          "Germany is the primary target for most MUA nursing graduates because of higher salaries (€30,000–50,000+/year vs Italy's lower starting range) and the largest demand for qualified nurses in Europe. Prioritise German. Italian remains a valuable secondary pathway — particularly for students from Italian-speaking backgrounds or those targeting Italy specifically.",
      },
    ],
  },
  {
    label: "Accommodation & Tirana",
    slug: "life",
    faqs: [
      {
        question: "Does MUA have student hostels or university accommodation?",
        answer:
          "MUA does not operate a university-owned hostel. Students arrange private shared apartments near campus in Tirana. The MUA International Student Support Office provides accommodation guidance — neighbourhood recommendations, average costs, and contacts — before arrival. Students Traffic provides a Tirana accommodation guide and connects new students with existing MUA students.",
      },
      {
        question: "What does private accommodation in Tirana cost?",
        answer:
          "Shared apartments near MUA cost approximately €150–280/month per person depending on location, room type, and number of flatmates. Most Indian nursing students share 2–3 person apartments to reduce costs. Tirana's Blloku and central areas are popular with international students.",
      },
      {
        question: "Is Tirana safe for Indian students?",
        answer:
          "Albania consistently rates among the safer countries in the Balkans. Tirana has a Numbeo Safety Index of approximately 96.5 for walking alone during daylight — among the highest in Southeast Europe. Albanian culture has a deep tradition of hospitality (Besa — protection of guests). Violent crime against foreigners is rare. Indian students, including female students, consistently report feeling safe and welcomed in Tirana.",
      },
      {
        question: "What is the climate like in Tirana?",
        answer:
          "Mediterranean — hot dry summers reaching 35°C (June–August) and mild winters between 5–10°C (December–February). No snow or extreme cold. Climate adjustment for Indian students is minimal compared to Baltic or Eastern European destinations.",
      },
      {
        question: "Are Indian groceries available in Tirana?",
        answer:
          "Yes. Major supermarkets (Conad, Carrefour, Spar) stock basmati rice, lentils, chickpeas, and Asian spices. Halal meat is widely available — Albania is a secular majority-Muslim country. Vegetarian options are available. Most Indian students cook at home, with monthly grocery costs of approximately €100–150. Indian students in Tirana's nursing community guide new arrivals to the best shops.",
      },
    ],
  },
  {
    label: "Parents' Questions",
    slug: "parents",
    faqs: [
      {
        question: "Why Albania? It's not a country we hear about for education.",
        answer:
          "Albania is an EU candidate country in Southeast Europe with a Mediterranean climate, affordable cost of living, and EU-aligned higher education under the Bologna Process. MUA's specific value is not \"Albania\" as a destination — it's the combination of an English-medium European nursing degree, free German and Italian language training, an 85% European placement rate, and tuition of €3,500/year. For students targeting nursing careers in Germany or Italy, this is a considered, affordable pathway — not a backup option.",
      },
      {
        question: "Is my child safe in Tirana?",
        answer:
          "Tirana is one of the safer Southeast European capitals for international students. Albanian cultural tradition includes strong hospitality toward foreigners (the concept of Besa — sacred protection of guests is genuine, not a marketing phrase). Violent crime against international students is very uncommon. Standard urban precautions apply, and MUA's international student office monitors student welfare.",
      },
      {
        question: "How will my child manage food and daily life in Albania?",
        answer:
          "Tirana's large supermarkets (Carrefour, Conad, Spar) stock Indian cooking staples — basmati rice, lentils, chickpeas, and spices. Halal meat is widely available. Most Indian students cook for themselves in shared apartments — the most budget-friendly and diet-appropriate approach. The Indian nursing student community in Tirana is close-knit and actively guides newcomers. Students Traffic connects all enrolled students with the existing MUA Indian student community before they fly.",
      },
      {
        question: "What happens after graduation? Will my child get a job in Germany?",
        answer:
          "MUA's 85% European placement rate (Germany, Austria, Italy) is the strongest documented outcome metric. The key variable is German B2 proficiency — achievable during the 3-year programme with MUA's free language training. The credential recognition pathway (Anerkennungsgesetz for Germany) is well-established. Students Traffic guides families through post-graduation career planning from the first year of the programme — not as an afterthought.",
      },
      {
        question: "The total cost is much lower than Canada. Is there a catch?",
        answer:
          "The lower cost reflects Albania's genuine affordability, not a compromise in programme quality. MUA is QAAHE accredited, EU Directive 2013/55/EU aligned, and has a documented European placement record. The honest caveats: MUA's degree is not INC-recognised (India return to nursing practice is not straightforward), and Albania is not yet in the Schengen Area (the Albanian residence permit does not give free EU travel). For students targeting Germany or Italy — the cost differential is a genuine advantage, not a red flag.",
      },
      {
        question: "Can you guarantee a job in Germany after graduation?",
        answer:
          "No — and be cautious of any consultant who does. MUA's 85% placement rate is a real, documented outcome, not a guarantee. The pathway to Germany is well-established but requires: completing the nursing degree, achieving German B2, and completing the Anerkennungsgesetz credential recognition process. Students Traffic provides honest, step-by-step guidance through all three stages — not false assurances.",
      },
    ],
  },
];

const lsmuLithuaniaFaqSections: FaqSection[] = [
  {
    label: "About LSMU",
    slug: "about",
    faqs: [
      {
        question: "What is the Lithuanian University of Health Sciences (LSMU)?",
        answer:
          "LSMU is Lithuania's largest public biomedical university, with over a century of medical heritage (founded 1922). It is one of only 5 WHO Collaborating Centres for Nursing and Midwifery in all of Europe. The 4-year BSc in Health Sciences (General Practice Nurse) is a 240 ECTS, fully English-taught programme. Clinical placements are at the Hospital of LSMU Kauno Klinikos — the largest clinical hospital in the Baltic States. Annual tuition is EUR 4,300.",
      },
      {
        question: "Is LSMU a public or private university?",
        answer:
          "LSMU is a public university — Lithuania's largest public biomedical university. Public status means institutional stability, government oversight, and a degree that carries the same weight as other EU public universities for purposes of credential recognition across Europe.",
      },
      {
        question: "What is the WHO Collaborating Centre status?",
        answer:
          "LSMU's Faculty of Nursing is one of only 5 WHO Collaborating Centres for Nursing and Midwifery in all of Europe. This is the highest international quality benchmark a nursing school can hold — recognised by the Indian Nursing Council, Indian banks processing education loan files, and nursing regulatory bodies worldwide. It signals that LSMU's nursing education is assessed by the World Health Organization as meeting its standards for nursing excellence.",
      },
      {
        question: "Is the LSMU BSc Nursing degree recognised across the EU?",
        answer:
          "Yes. LSMU's BSc in Health Sciences (Nursing) is automatically recognised across all 27 EU member states under EU Directive 2005/36/EC on Professional Qualifications. This means you can apply directly to work as a nurse in Germany, the Netherlands, Sweden, Ireland, or any EU country without re-sitting your nursing examinations. You register with the nursing regulatory body of the target country, but the degree itself is automatically recognised.",
      },
      {
        question: "What are LSMU's rankings?",
        answer:
          "QS World Ranking #601–650 (QS WUR By Subject 2026). Member of the European University Association (EUA). SKVC accredited (Lithuanian Higher Education Quality Assurance Agency, last evaluated June 2022). Erasmus+ partner with 323 global partner universities. LSMU is a genuine ranked European research university — a different category from private nursing schools.",
      },
      {
        question: "How many students are at LSMU and where are they from?",
        answer:
          "LSMU enrolls approximately 6,283 students, with 28% international students from 88+ countries. The Faculty of Nursing teaches in small clinical groups of up to 10 students — a dramatically different environment from large-cohort Indian nursing colleges. The multicultural environment means Indian students are welcomed and integrated, not isolated.",
      },
      {
        question: "What is the LSMU programme name and its ECTS credit count?",
        answer:
          "The official programme name is BSc in Health Sciences (General Practice Nurse). It is 240 ECTS over 4 years — the EU standard for a full bachelor's degree in nursing and the format required for automatic recognition under EU Directive 2005/36/EC. This 240 ECTS is directly comparable to nursing qualifications across all 27 EU member states.",
      },
    ],
  },
  {
    label: "Admission & Eligibility",
    slug: "admission",
    faqs: [
      {
        question: "What Class 12 subjects do I need for LSMU nursing?",
        answer:
          "Biology and Chemistry are both mandatory — both must appear as core subjects in your Class 12 (10+2). LSMU evaluates results competitively, so strong marks in both subjects improve your admission prospects. There is no published minimum percentage, but competitive applicants typically have above-average Biology and Chemistry scores.",
      },
      {
        question: "Do I need NEET to apply to LSMU?",
        answer:
          "NEET is not required by LSMU for admission. However, NEET has a specific strategic value: a NEET score of 650 or above exempts Indian students from LSMU's Biology and Chemistry entrance test — bypassing one of the key application steps. Students Traffic verifies NEET exemption eligibility as the first step in the application assessment.",
      },
      {
        question: "What is LSMU's entrance test and who needs to sit it?",
        answer:
          "The entrance test is a 90-minute online multiple-choice exam: 30 Biology questions + 30 Chemistry questions. It is preceded by a mandatory interview conducted a few days before the written test — missing the interview automatically cancels your test. Exemptions from the written test: NEET 650+, IB Diploma with score 5 (HL) in Biology and Chemistry, A-Level C and C grades in Biology/Chemistry, UCAT 2100+, MCAT 511+, or IMAT 57+. Even exempt students should confirm their status with LSMU admissions.",
      },
      {
        question: "Do I need IELTS for LSMU?",
        answer:
          "Yes — LSMU requires English proficiency documentation. Accepted certificates: IELTS above 5.5 overall, TOEFL iBT minimum 4.0, PTE Academic 55–67, Duolingo minimum 95, LanguageCert IESOL B1, or LSMU's own English test (available if you have no certificate). Students without an IELTS certificate should plan to take LSMU's English test — Students Traffic confirms the current English test process with LSMU admissions for each cycle.",
      },
      {
        question: "When is the LSMU BSc Nursing application deadline?",
        answer:
          "For the September 2026 intake: portal closes 6 July 2026 (00:00 EET), with the entrance test deadline on 16 July 2026. Apply as early as possible — applications submitted from November receive earlier review, and early submission maximises time for Apostille processing (4–6 weeks), MIGRIS/TRP processing (up to 2 months), and VFS appointment scheduling.",
      },
      {
        question: "Must my Class 10 and 12 documents be apostilled?",
        answer:
          "Yes — Apostille by the Ministry of External Affairs (MEA) India is mandatory, not optional. Both Class 10 and Class 12 certificates and marksheets must be Apostilled. If any documents are in a regional Indian language, authorised English translations are also required. The Apostille process takes 4–6 weeks — start this immediately once you decide to apply. Students Traffic manages the MEA Apostille coordination from your city.",
      },
      {
        question: "Is there a non-refundable application fee?",
        answer:
          "Yes. There are two non-refundable fees: EUR 150 application fee (paid at the time of DreamApply submission) and EUR 250 registration fee (paid after receiving the LSMU Letter of Acceptance to confirm your place). Total: EUR 400 non-refundable. Do not apply until your eligibility is confirmed — Students Traffic's first step is always an honest eligibility assessment before any money is committed.",
      },
    ],
  },
  {
    label: "Fees & Finances",
    slug: "fees",
    faqs: [
      {
        question: "What is LSMU's annual tuition for BSc Nursing?",
        answer:
          "EUR 4,300/year for international students. This is one of the lowest annual tuition fees for a public EU university nursing degree. The 4-year total tuition is EUR 17,200 — significantly lower than equivalent programmes at German, Irish, or Scandinavian public universities.",
      },
      {
        question: "What are the one-time non-refundable admission fees?",
        answer:
          "EUR 150 application fee (on DreamApply submission) and EUR 250 registration fee (after admission offer acceptance) — total EUR 400 non-refundable. These are in addition to the annual tuition. Do not pay until your eligibility is confirmed.",
      },
      {
        question: "What is the total 4-year cost for an Indian student?",
        answer:
          "Total 4-year investment: tuition EUR 17,200 + admission fees EUR 400 + living costs EUR 13,500–27,000 (accommodation, food, transport, insurance, miscellaneous) + visa and immigration costs EUR 500–800. Grand total approximately EUR 31,600–45,400 — approximately INR 28.5–41 lakh at mid-2026 exchange rates. This is 60–80% lower than equivalent Canadian or UK nursing programmes (INR 70–130 lakh).",
      },
      {
        question: "What are monthly living costs in Kaunas?",
        answer:
          "EUR 450–700/month on a budget (including LSMU dormitory at EUR 70–200 + food EUR 120–180 + transport EUR 15–20 + phone/internet EUR 15–25 + health insurance EUR 20–40 + books/personal EUR 50–80). EUR 700–1,000/month for a comfortable private apartment lifestyle. Kaunas is consistently ranked among the most affordable cities in the EU.",
      },
      {
        question: "Can I earn income during the programme?",
        answer:
          "Yes. International students in Lithuania are permitted to work up to 20 hours per week during the academic term and full-time during holidays. At Lithuania's minimum wage (EUR 5.65/hour in 2026), working 20 hours/week during term can generate EUR 400–600/month — a meaningful contribution toward living costs. No separate work permit is required.",
      },
      {
        question: "Can I get an Indian education loan for LSMU?",
        answer:
          "Yes. Indian banks and NBFCs offer education loans for accredited international institutions. LSMU's WHO Collaborating Centre status, EU recognition under Directive 2005/36/EC, QS ranking, and low total cost (INR 28–41 lakh over 4 years) make it strongly loan-viable. The loan file is significantly easier to process for LSMU than for less-credentialled universities. Students Traffic provides a documentation package to support the education loan application.",
      },
    ],
  },
  {
    label: "Visa & Immigration",
    slug: "visa",
    faqs: [
      {
        question: "What visa do I need to study at LSMU in Lithuania?",
        answer:
          "A National Visa (D) plus a Temporary Residence Permit (TRP). Both are applied for in India BEFORE travel — you arrive in Lithuania with valid residency already confirmed. The TRP is not applied for after arrival.",
      },
      {
        question: "How does the Lithuanian MIGRIS and TRP process work?",
        answer:
          "Step 1: Register on MIGRIS (migris.lt) online and submit your TRP application to get a MIGRIS application number. Step 2: Contact LSMU to receive their mediation number. Step 3: Book a VFS Global appointment in India using your MIGRIS number and LSMU's mediation number. Step 4: Submit physical documents and biometrics at VFS. TRP processing: up to 2 months (standard) or 45 calendar days (fast-track). The TRP card can be sent to your Indian address. Apply at least 2 months before the September intake.",
      },
      {
        question: "What financial proof is required for the Lithuanian TRP?",
        answer:
          "Bank statements showing a minimum of EUR 304/month (EUR 3,648/year) for living costs. In practice, LSMU's admission offer, dormitory booking, and proof of tuition payment together provide the financial evidence package. Students Traffic prepares the complete financial document set for TRP submission.",
      },
      {
        question: "What health insurance is required?",
        answer:
          "Valid health insurance covering all Schengen countries with a minimum sum insured of EUR 6,000, valid until TRP expiry. This is a hard requirement — TRP applications will not proceed without it. Annual cost: approximately EUR 20–40/month (EUR 240–480/year). Students Traffic recommends specific Lithuanian-TRP-compliant health insurance products for Indian students.",
      },
      {
        question: "Can I travel across Europe on a Lithuanian TRP?",
        answer:
          "Yes. Lithuania is a Schengen Area member, and a Lithuanian National Visa D or TRP gives access to all 26 Schengen countries without a separate visa. This means you can travel to Germany, France, Italy, Poland, the Netherlands, Austria, and 20+ other European countries during weekends, holidays, and Erasmus+ exchange semesters.",
      },
      {
        question: "How often does the TRP need to be renewed?",
        answer:
          "The TRP is typically valid for 1 year initially and renewed annually for the duration of the 4-year programme. Renewal requires: valid health insurance, proof of bank balance (EUR 304/month minimum), continued enrollment at LSMU, and submission to the Kaunas Migration Department. LSMU's international office guides enrolled students through each renewal cycle. Students Traffic provides TRP renewal reminders and guidance.",
      },
    ],
  },
  {
    label: "Clinical Training",
    slug: "clinical",
    faqs: [
      {
        question: "Where do LSMU nursing students do clinical placements?",
        answer:
          "LSMU's primary clinical facility is the Hospital of LSMU Kauno Klinikos — the largest clinical hospital in the entire Baltic States (Estonia, Latvia, and Lithuania combined), with 1,200+ doctors, 2,400 nursing staff, and 78,000 patients treated annually. Additional placements include Kaunas Red Cross Nursing and Palliative Care Hospital, Kaunas Child Development Hospital, and community health centres across Kaunas.",
      },
      {
        question: "How are clinical groups structured at LSMU?",
        answer:
          "Clinical courses run in groups of up to 10 students — a dramatically better supervision ratio than large Indian nursing colleges. This small group structure means faculty know each student's clinical progress, and clinical supervision is personalised and direct.",
      },
      {
        question: "How does clinical training progress year by year?",
        answer:
          "Year 1: simulation labs and ward observation — skills built before patients. Year 2: supervised patient care in adult medical/surgical wards. Year 3: specialty rotations across mental health, maternal/child health, community, oncology, and neurology. Year 4: advanced consolidated placement with preceptor-supervised independent nursing practice and final clinical practice examination. Clinical attendance of 75% is typically mandatory.",
      },
      {
        question: "What specialties are covered in LSMU clinical rotations?",
        answer:
          "Medical and surgical nursing, oncology, neurology, interventional radiology, paediatrics, geriatrics, rehabilitation, intensive care, mental health, obstetrics, and community/primary health nursing. The variety and volume of patient exposure at Kauno Klinikos — the Baltic region's largest hospital — is a core strength of LSMU's programme.",
      },
      {
        question: "What is LSMU's teaching methodology?",
        answer:
          "LSMU's Faculty of Nursing uses problem-based learning (PBL) methodology — students work through real clinical cases, conduct research, and apply theory to patient scenarios, rather than passively attending lectures. This approach builds clinical reasoning and independent nursing judgment from Year 1, which is particularly valuable for students targeting European and international nursing registration.",
      },
    ],
  },
  {
    label: "Career Pathways",
    slug: "career",
    faqs: [
      {
        question: "Can I work in Germany after graduating from LSMU?",
        answer:
          "Yes. LSMU's EU-recognised BSc Nursing (EU Directive 2005/36/EC) makes the German Anerkennung (credential recognition) process more streamlined than for non-EU internationally educated nurses. German B2 proficiency is mandatory — begin from Year 1 of your LSMU programme if Germany is the career goal. Entry-level German nursing salary: EUR 2,800–3,800/month gross (approximately INR 2.5–3.4 lakh/month). Germany's Skilled Immigration Act provides a structured visa pathway for qualified nurses.",
      },
      {
        question: "Can I work across all 27 EU countries with an LSMU degree?",
        answer:
          "Yes. EU Directive 2005/36/EC provides automatic recognition of the LSMU nursing degree across all 27 EU member states. The practical requirement is language proficiency at the appropriate level for each country — German B2 for Germany and Austria, Dutch B2 for the Netherlands, Swedish for Scandinavia, French B2 for Belgium and France. The degree itself is accepted; language is what opens the door to employment.",
      },
      {
        question: "Can I register with the UK NMC after LSMU?",
        answer:
          "Yes. The NMC (Nursing and Midwifery Council) accepts applications from internationally educated nurses with recognised degrees. Required steps: IELTS Academic 7.0 overall (or OET Grade B in all four bands), NMC Computer-Based Test (CBT), and Objective Structured Clinical Examination (OSCE). NHS Band 5 entry salary: GBP 29,970–36,483/year. UK NMC registration is an established route available to LSMU graduates.",
      },
      {
        question: "Can I pursue NCLEX for the USA or Canada?",
        answer:
          "Yes. The LSMU EU BSc in Nursing is accepted for assessment by CGFNS (Commission on Graduates of Foreign Nursing Schools) for the US, and NNAS (National Nursing Assessment Service) for Canada. After credential evaluation, you sit the NCLEX-RN examination. Entry-level RN salary in the USA: USD 65,000–95,000/year.",
      },
      {
        question: "Can I practise nursing in India after LSMU?",
        answer:
          "Yes — the LSMU BSc in Health Sciences (Nursing) can be verified by the Indian Nursing Council (INC). An EU nursing degree from a public university with WHO Collaborating Centre status is among the most internationally respected qualifications available. However, confirm the current INC verification procedure directly before committing if India-return practice is the primary goal, as INC processes may evolve. Most Indian students at LSMU are targeting European careers, but the India-return route is available.",
      },
      {
        question: "What is Lithuania's own nursing salary?",
        answer:
          "Lithuania's average nursing salary is approximately EUR 1,292/month gross — meaningful in a low-cost city like Kaunas, but significantly lower than Germany (EUR 2,800–3,800/month) or the Netherlands. Lithuania functions as the staging ground for a European nursing career: the degree is earned in Lithuania, but the salary destination for most Indian students is Germany, the Netherlands, or another high-wage EU country. The Schengen TRP gives freedom to move within Europe after graduation.",
      },
      {
        question: "Can I pursue a Master's degree after LSMU?",
        answer:
          "Yes. LSMU offers MSc programmes directly for BSc Nursing graduates — including Advanced Nursing Practice and Nursing Leadership. Through LSMU's 323 Erasmus+ partner universities, MSc pathways are available across the EU. An MSc in a nursing specialty strengthens the Anerkennung application for Germany and opens senior clinical and nursing leadership roles at higher salary bands.",
      },
    ],
  },
  {
    label: "Accommodation & Kaunas",
    slug: "life",
    faqs: [
      {
        question: "Does LSMU have student dormitories?",
        answer:
          "Yes. LSMU operates university dormitories close to the main campus in Kaunas at EUR 70–200/month per person — the most affordable accommodation option and strongly recommended for first-year students. Dormitories are renovated and equipped with kitchens, common areas, laundry, and necessary furniture. Public transport stops and shops are nearby.",
      },
      {
        question: "What are private apartments like in Kaunas?",
        answer:
          "Private shared apartments in Kaunas range from EUR 150–300/month per person — popular from Year 2 onwards for students who want more independence. Kaunas is significantly cheaper than Vilnius (Lithuania's capital, 1 hour away) and much cheaper than Western European cities. Students Traffic provides a Kaunas accommodation guide before arrival.",
      },
      {
        question: "What is the climate like in Kaunas?",
        answer:
          "Baltic climate — warm summers (18–26°C, June–August) and cold winters (-5 to -15°C, heavy snow from November through March). The winter requires a genuine investment in warm clothing — budget INR 10,000–20,000 for winter outerwear. This is the biggest climate adjustment for Indian students and should be planned from Year 1. LSMU's student union organises events and activities throughout the winter semester.",
      },
      {
        question: "Is Kaunas safe for Indian students?",
        answer:
          "Lithuania is an EU and NATO member state with stable democratic governance and a very low violent crime rate. Kaunas is a modern, well-lit university city with a large international student community. Indian students — including female students — consistently report feeling safe and welcomed. The 28% international student body from 88 countries at LSMU creates a normalised, inclusive environment.",
      },
      {
        question: "Are Indian groceries available in Kaunas?",
        answer:
          "Yes. Indian groceries — spices, lentils, basmati rice, chickpeas, and cooking essentials — are available at major Kaunas supermarkets and Asian grocery stores. Most Indian students cook at home in dormitory kitchens (monthly grocery cost: EUR 120–180). For a broader Indian food scene including restaurants, Vilnius is 1 hour away by train or bus. The Indian student community at LSMU guides new arrivals to the best shops before they arrive.",
      },
      {
        question: "Can I travel to other EU countries on weekends?",
        answer:
          "Yes — this is one of LSMU's most popular lifestyle benefits. Lithuania is a Schengen Area member, so your Lithuanian TRP allows free travel across 26 European countries without a separate visa. Budget airlines from Kaunas Airport (Ryanair) connect to London, Berlin, Dublin, Barcelona, Oslo, and other European hubs for EUR 15–50. Warsaw is 5 hours by Lux Express bus, Riga 4 hours, Tallinn 6 hours — weekend travel across the Baltics and Poland is genuinely affordable.",
      },
    ],
  },
];

const smkLithuaniaFaqSections: FaqSection[] = [
  {
    label: "About SMK",
    slug: "about",
    faqs: [
      {
        question: "What is SMK College of Applied Sciences?",
        answer:
          "SMK College of Applied Sciences (Aukštoji Mokykla 'SMK') is Lithuania's largest private higher education institution, founded in Klaipeda in 1994 and now operating campuses in Vilnius, Kaunas, and Klaipeda. It educates approximately 4,500 students, including 1,000+ international students from 50+ countries. SMK operates under Lithuania's Ministry of Education, Science and Sport, and is authorised to conduct academic recognition of foreign qualifications. The General Practice Nursing programme is offered in English at all three campuses.",
      },
      {
        question: "Is SMK an accredited institution?",
        answer:
          "Yes. SMK is a licensed higher education institution under Lithuania's Ministry of Education, Science and Sport — the national authority that oversees all Lithuanian higher education institutions, both public and private. The nursing programme is accredited for delivery at all three campuses. SMK is authorised to award Professional Bachelor degrees at EQF Level 6 and to conduct academic recognition of foreign qualifications for admission purposes.",
      },
      {
        question: "What degree does SMK award for the nursing programme?",
        answer:
          "The Professional Bachelor of Health Sciences with the professional qualification of General Nurse Practitioner (Bendrosios praktikos slaugytojas). This is a first-cycle EQF Level 6 qualification — the same European Qualifications Framework level as a university bachelor's degree — awarded after 3.5 years and 210 ECTS of study.",
      },
      {
        question: "Is SMK ranked in QS or global university rankings?",
        answer:
          "SMK does not appear in QS or THE global university ranking tables. It is #1 or top-ranked among private colleges in Lithuania by national metrics. SMK's value for Indian nursing students lies in its Ministry of Education accreditation, EQF Level 6 qualification, EU Directive 2005/36/EC alignment, three-campus flexibility, and accessible admission process — not global research prestige. Students Traffic advises honestly on what SMK's institutional status means for German Anerkennung, UK NMC, and other specific recognition targets.",
      },
      {
        question: "How many international students are at SMK?",
        answer:
          "SMK has 1,000+ international students from 50+ countries — approximately 22% of the total student body of 4,500. The Vilnius campus has the largest international student community. English is the working language among international students. SMK's international student networks and dedicated support services make it a genuinely multicultural environment rather than one where Indian students are isolated.",
      },
      {
        question: "Does SMK have Erasmus+ partnerships?",
        answer:
          "Yes. SMK has 100+ international partners in 25 countries through Erasmus+ and bilateral agreements. Nursing students may be eligible for Erasmus+ exchange semesters at partner nursing schools or healthcare institutions across the EU, with a monthly living stipend (typically EUR 350–700 depending on destination). This adds international clinical experience and a European professional network to the CV.",
      },
      {
        question: "What support does SMK provide for international students?",
        answer:
          "SMK provides: a structured first-week induction programme (city tours, campus orientation, cultural briefings), academic counsellors assigned to each student, a Psychological Counselling Service, the 'Hey Ready' career centre for employment support, Moodle LMS and Classter digital academic management platforms, e-library access, and TRP renewal guidance for continuing students. These services are available at all three campuses.",
      },
      {
        question: "What is SMK's 'Hey Ready' career centre?",
        answer:
          "Hey Ready is SMK's dedicated career centre — a service connecting current students and graduates with employment opportunities in Lithuania and internationally. For nursing students, this means connections with Lithuanian healthcare employers, post-graduation employment support, and guidance on the post-study TRP extension for job-seeking. SMK's 13,000+ alumni network and 100+ industry partnerships underpin the career support.",
      },
    ],
  },
  {
    label: "Professional Bachelor vs BSc",
    slug: "qualification",
    faqs: [
      {
        question: "What is a Professional Bachelor and how is it different from a BSc?",
        answer:
          "In Lithuania, there are two types of first-cycle bachelor-level qualifications. A Professional Bachelor (Profesinis Bakalauras) is awarded by colleges of applied sciences — typically 3–3.5 years, 180–210 ECTS, focused on applied professional skills. A Bachelor (Bakalauras) is awarded by universities — typically 4 years, 240 ECTS, with more academic and research-based content. Both are placed at EQF Level 6 — the same level of the European Qualifications Framework. Both qualify you to apply for Master's degree programmes. Both qualify as General Practice Nurse degrees under EU Directive 2005/36/EC, provided the programme meets the required minimum training hours.",
      },
      {
        question: "Does the Professional Bachelor give access to Master's degrees?",
        answer:
          "Yes. The SMK Professional Bachelor is explicitly accepted for admission to second-cycle (Master's) degree programmes across Lithuania — including LSMU's MSc programmes in Nursing. Across the EU, EQF Level 6 is the standard entry level for Master's degree study. The Professional Bachelor is not a dead-end qualification.",
      },
      {
        question: "Is the EU nursing recognition the same for a Professional Bachelor as for a BSc?",
        answer:
          "Under EU Directive 2005/36/EC, both university bachelor's and professional bachelor's nursing degrees are covered — provided the programme meets the minimum 4,600 hours of training requirement. SMK's programme is designed to meet these EU nursing education standards. In practice, both qualifications qualify you to apply for nursing registration across all 27 EU member states. The qualification type matters less than whether the specific programme meets the training hour requirements.",
      },
      {
        question: "Are there any practical differences in recognition between SMK and LSMU degrees?",
        answer:
          "Both are EQF Level 6 and both are eligible for EU Directive 2005/36/EC recognition across the EU. In practice, some individual German or Dutch hospital HR departments have historically had informal preferences for university-issued BSc degrees when choosing between otherwise comparable candidates. This is becoming less common as EU nursing recognition standardises across member states. For students targeting competitive tertiary care hospitals in Germany specifically, this nuance is worth discussing. Students Traffic advises on the most current recognition landscape before enrollment.",
      },
      {
        question: "Why does SMK's programme take 3.5 years instead of 4?",
        answer:
          "The Professional Bachelor at SMK is 210 ECTS — the EU minimum qualification threshold for a General Practice Nurse. A university BSc like LSMU's is 240 ECTS (the full university bachelor's standard). Both are EQF Level 6. SMK's 3.5-year, 210 ECTS programme is the standard structure for a professional bachelor's nursing degree across Lithuanian colleges of applied sciences. The shorter duration is a feature, not a shortcut — it means earlier graduation, earlier EU nursing registration, and earlier career entry.",
      },
    ],
  },
  {
    label: "Admission & Eligibility",
    slug: "admission",
    faqs: [
      {
        question: "What are the minimum requirements for SMK nursing admission?",
        answer:
          "Completion of 12 years of formal secondary education (Class 10+2 from any recognised board) with at least 50% overall score on the school leaving certificate. No specific subject minimum is stated — general secondary education completion is the base. No NEET, no Biology/Chemistry entrance test, no SAT or GRE.",
      },
      {
        question: "Do I need to have studied Biology or Chemistry at Class 12?",
        answer:
          "No. SMK does not state any specific subject requirements for nursing admission. The 50% overall score on your Class 12 certificate is the academic threshold. Students from arts, commerce, or science backgrounds are all eligible. This is one of SMK's most significant access advantages compared to LSMU, which requires Biology and Chemistry at Class 12.",
      },
      {
        question: "Is there an entrance test for SMK nursing?",
        answer:
          "No. There is no Biology, Chemistry, or any other academic entrance examination — for any applicant, regardless of background. Admission is based on document review and a motivation interview. This makes SMK accessible to Indian students who did not sit NEET, have weaker science grades, or want to avoid an additional Biology/Chemistry examination.",
      },
      {
        question: "What is the motivation interview like?",
        answer:
          "An individual online interview via Google Meet, approximately 20–30 minutes, conducted by the SMK admissions team. It evaluates your reasoning, motivation for nursing, communication skills in English, and career goals. Prepare to explain: why you want to become a nurse; why you chose SMK and Lithuania; what your post-graduation career plans are; how you plan to handle the practical and academic challenges of the programme. An admission decision is issued within a few days. Students Traffic provides mock interview preparation specific to SMK's format and questions.",
      },
      {
        question: "What English score do I need for SMK nursing?",
        answer:
          "IELTS 5.5 or above; TOEFL iBT 69+; PTE Academic 59+; Duolingo 110+; FCE (Cambridge); or LanguageCert IESOL B2+. If you have no certificate, SMK offers an internal English test for EUR 50. For the 40% Talent Scholarship, a B2 level certificate is required — so achieving IELTS 6.0 or above is strongly recommended if you want to combine admission with scholarship eligibility.",
      },
      {
        question: "When are the application deadlines?",
        answer:
          "Fall semester (September 1 start): July 1 for Indian/non-EU students requiring visa — but SMK strongly recommends applying 3–4 months earlier. Spring semester (February 1 start): December 1. For Indian students, begin the process at least 4–5 months before the intended semester start to allow time for TRP processing (up to 2 months), VFS Global appointments, and document preparation.",
      },
      {
        question: "Does SMK have two intakes per year?",
        answer:
          "Yes — Fall (September 1) and Spring (February 1). This is a significant advantage: students who miss the July 1 Fall deadline, need time to complete IELTS preparation, or want to join mid-year can apply for the Spring intake without waiting a full academic year. Most Lithuanian nursing programmes (including LSMU) offer only a Fall intake.",
      },
      {
        question: "Can students with a GNM diploma apply to SMK?",
        answer:
          "Potentially yes. SMK processes academic recognition of foreign qualifications as part of the admission process. Students with prior nursing qualifications (including GNM) may have some credits recognised, potentially shortening the programme. Contact SMK admissions at admission@smk.lt with your GNM marksheets and course syllabus for a case-by-case assessment.",
      },
      {
        question: "What documents are needed for the SMK application?",
        answer:
          "Class 10 and Class 12 certificates and transcripts (with authorised English translations if not originally in English), valid passport copy (minimum 2 years validity), English proficiency certificate (IELTS, TOEFL, PTE, etc.), and consent for qualification evaluation. For the 40% scholarship: the scholarship assignment submitted separately. Check country-specific requirements at apply.smk.lt before submitting.",
      },
      {
        question: "Is the EUR 50 application fee refundable?",
        answer:
          "The EUR 50 application fee is a processing fee required to complete your application submission and proceed to the motivation interview. As a general practice, application fees at Lithuanian institutions are non-refundable. Confirm the current refund policy directly with SMK at admission@smk.lt before paying — do not apply until your eligibility is confirmed.",
      },
    ],
  },
  {
    label: "Fees & Scholarships",
    slug: "fees",
    faqs: [
      {
        question: "What is the annual tuition at SMK for Indian students?",
        answer:
          "EUR 4,400 per year for non-EU international students (including Indian students). This rate applies to all 3.5 years of the programme — the final semester (Semester 7, 6 months) is billed at half the annual rate: EUR 2,200.",
      },
      {
        question: "What is the total 3.5-year tuition at SMK?",
        answer:
          "EUR 4,400 × 3 full years + EUR 2,200 (final semester) = EUR 15,400 total tuition. With the 40% Year 1 scholarship (if eligible): EUR 2,640 + EUR 4,400 × 2.5 = EUR 13,640. Compare with LSMU: EUR 4,300 × 4 = EUR 17,200. SMK costs approximately EUR 1,800 less in tuition than LSMU and finishes 6 months earlier.",
      },
      {
        question: "What are all the fees at SMK — are there any hidden charges?",
        answer:
          "Stated fees: EUR 50 application fee (non-refundable), EUR 4,400 annual tuition, EUR 50 internal English test (only if no IELTS/TOEFL certificate). There is no separate registration fee at SMK — unlike LSMU's EUR 250 registration fee. Verify the current complete fee schedule directly at smk.lt or admission@smk.lt before submitting.",
      },
      {
        question: "What is the 40% Talent Scholarship and how do I qualify?",
        answer:
          "The 40% Talent Scholarship reduces Year 1 tuition from EUR 4,400 to approximately EUR 2,640 — a saving of EUR 1,760 (approximately INR 1.6 lakhs). Qualification criteria: (1) Class 12 average grade of 8.5/10 — that is, 85% or above; (2) B2 level English certificate (IELTS, TOEFL, PTE, or equivalent — not the SMK internal test); (3) completed scholarship assignment (request the task from admission@smk.lt); (4) submission of all scholarship documents by August 20 for the Fall semester or January 20 for the Spring semester. All four criteria are mandatory — partial compliance does not qualify.",
      },
      {
        question: "Are there scholarships available in Year 2 and Year 3?",
        answer:
          "Yes. From Year 2, SMK's performance-based scholarship offers up to 50% tuition reduction for students who demonstrate outstanding academic and extracurricular performance — the 'best and most active students' award. A 10% sibling/alumni discount is also available for the entire programme if a student has a sibling or parent who studied at SMK. A 30% discount is available for students pursuing a second SMK bachelor's degree.",
      },
      {
        question: "What is the total all-in cost for 3.5 years in Kaunas?",
        answer:
          "Approximately EUR 28,600–43,110 all-in — covering tuition (with Year 1 scholarship: EUR 13,640), living costs in Kaunas (EUR 345–685/month × 42 months = approximately EUR 14,490–28,770), and visa/TRP costs (EUR 480–700 over 3.5 years). At EUR 1 = INR 90–92 (mid-2026 rates), this is approximately INR 26–39 lakhs. This is among the most cost-effective routes to an EU nursing qualification in Europe.",
      },
      {
        question: "Can I get an education loan for SMK from Indian banks?",
        answer:
          "Yes. Indian banks and NBFCs offer education loans for accredited international institutions. SMK's Ministry of Education licensing, EQF Level 6 status, and EU Directive alignment are the key documents for the loan file. The lower total cost (INR 26–47 lakhs vs INR 80–130 lakhs for Canada) makes SMK highly loan-serviceable. Students Traffic provides a documentation package to support the education loan file.",
      },
    ],
  },
  {
    label: "Visa & Immigration",
    slug: "visa",
    faqs: [
      {
        question: "What visa do Indian students need for SMK?",
        answer:
          "A National Visa (D) and a Temporary Residence Permit (TRP) — both applied for before arriving in Lithuania. This is the same process as for all Lithuanian institutions including LSMU. The key SMK-specific step: you need SMK's mediation number (provided by SMK after admission) to book your VFS Global appointment.",
      },
      {
        question: "What is the SMK mediation number and why do I need it?",
        answer:
          "The SMK mediation number is issued by SMK after your admission is confirmed. It is required to book your VFS Global appointment for the Lithuanian TRP — you cannot schedule the VFS appointment without it. Request it from admission@smk.lt immediately upon receiving your Acceptance Letter.",
      },
      {
        question: "How does the Lithuanian TRP process work for SMK students?",
        answer:
          "Step 1: Receive SMK Acceptance Letter and request the SMK mediation number. Step 2: Register on MIGRIS (migris.lt) and complete the online TRP application — you get a MIGRIS application number. Step 3: Book your VFS Global appointment in India using both your MIGRIS number and SMK's mediation number. Step 4: Attend the VFS appointment with your full document package, provide biometrics, and pay EUR 120 (standard) or EUR 240 (urgent). TRP processing: up to 2 months standard; 45 days fast-tracked. The TRP card can be sent to your Indian address — you arrive in Lithuania already holding valid residency.",
      },
      {
        question: "What financial evidence is required for the Lithuanian TRP?",
        answer:
          "Bank statement showing a minimum of EUR 304/month (EUR 3,648/year) for living costs. In practice, your SMK Acceptance Letter, proof of first tuition fee payment, and accommodation confirmation together form the core document package. Students Traffic assembles the complete TRP financial document set for VFS submission.",
      },
      {
        question: "Can I travel across Europe on a Lithuanian TRP?",
        answer:
          "Yes. Lithuania is a Schengen Area member. A valid Lithuanian National Visa D or TRP allows free travel across all 26 Schengen countries without a separate visa. Budget flights from Vilnius Airport (Ryanair, Wizz Air) and Kaunas Airport connect to London, Berlin, Barcelona, Dublin, Oslo, and across Europe from EUR 15–50. Bus connections to Riga, Warsaw, and Tallinn from EUR 10–20.",
      },
      {
        question: "How often does the TRP need to be renewed?",
        answer:
          "The TRP is typically valid for up to 2 years and renewed for subsequent study periods. Submit a renewal application at least 2 months before expiry (and no earlier than 4 months before) through the Lithuanian Migration Department (MIGRIS). SMK provides enrolled students with TRP renewal guidance. Budget EUR 120 per renewal. Students Traffic sends TRP renewal reminders to all SMK students.",
      },
    ],
  },
  {
    label: "Career After Graduation",
    slug: "career",
    faqs: [
      {
        question: "Can I work as a nurse in Germany after graduating from SMK?",
        answer:
          "Yes — with two preparations: (1) German B2 proficiency, which is mandatory for clinical nursing practice in Germany and non-negotiable for patient-facing work. Start German from Semester 1 of your SMK programme, targeting B2 by graduation. (2) Anerkennung — submit your EU Professional Bachelor to the relevant German state nursing authority for credential recognition. EU EQF Level 6 nursing qualifications can be recognised under Germany's Anerkennungsgesetz. Entry-level German nursing salary: EUR 2,500–3,800/month gross (~INR 2.25–3.4 lakhs/month). Germany has 150,000+ additional nurses needed by 2027.",
      },
      {
        question: "Is German B2 really mandatory for nursing in Germany?",
        answer:
          "Yes — it is a hard requirement, not a preference. German state nursing registration authorities require B2 proficiency as a patient safety standard before granting nursing practice rights. This is true regardless of your degree origin — whether you graduated from SMK, LSMU, or any other EU nursing school. Begin German from Day 1 of Semester 1. SMK's 3.5 years gives you enough time to reach B2 with consistent effort.",
      },
      {
        question: "Can I work as a nurse in the UK after SMK?",
        answer:
          "Yes. Apply to the UK Nursing and Midwifery Council (NMC) under the international nurse applicant route. The EU Professional Bachelor from SMK is assessable by the NMC. Steps: IELTS Academic 7.0 overall (or OET Grade B in all four bands), NMC Computer-Based Test (CBT), and Objective Structured Clinical Examination (OSCE). NHS Band 5 entry salary: GBP 29,970–36,483/year. UK settlement (Indefinite Leave to Remain) after 5 years on the Health and Care Worker Visa.",
      },
      {
        question: "Can I practise nursing in Lithuania immediately after graduation?",
        answer:
          "Yes. Apply to VASPVT (State Health Care Accreditation Agency under Lithuania's Ministry of Health) for a nursing practice licence — this is the Lithuanian nursing registration required to work. Average Lithuanian nursing salary: approximately EUR 1,292/month gross — comfortable in Kaunas or Klaipeda, manageable in Vilnius. You can also apply for a post-study TRP (up to 12 months) to job-search in Lithuania after graduation. After 5 years of total legal residence, you may be eligible for Lithuanian permanent residency.",
      },
      {
        question: "Can I return to India and practise nursing with an SMK degree?",
        answer:
          "Yes. The SMK EU Professional Bachelor in Health Sciences (Nursing) can be submitted to the Indian Nursing Council (INC) for verification for return to nursing practice in India. European nursing education and clinical training experience is valued by premium Indian private hospitals and international health organisations operating in India. Confirm the current INC verification procedure at the time of graduation — INC processes may evolve.",
      },
      {
        question: "Can I pursue NCLEX-RN for the USA or Canada after SMK?",
        answer:
          "Yes. The EU Professional Bachelor in Nursing from SMK is accepted for credential evaluation by CGFNS (Commission on Graduates of Foreign Nursing Schools) for the US pathway, and NNAS (National Nursing Assessment Service) for Canada. After credential evaluation, you sit the NCLEX-RN examination. Entry-level RN salary in the USA: USD 65,000–95,000/year. This route involves more steps than the Germany/EU pathway and is not the primary recommendation for SMK graduates, but it is available.",
      },
      {
        question: "Can I pursue a Master's degree after SMK?",
        answer:
          "Yes. The SMK Professional Bachelor is accepted for admission to MSc and Master's programmes across Lithuania — including LSMU's Advanced Nursing Practice and Nursing Leadership MSc programmes. Through Erasmus+ partnerships and the EU's Bologna Process alignment, MSc pathways are available at partner institutions across Europe. An MSc strengthens the Anerkennung application for Germany and opens senior nursing and clinical leadership roles.",
      },
    ],
  },
  {
    label: "Campus & Student Life",
    slug: "life",
    faqs: [
      {
        question: "Which SMK campus is best for Indian students?",
        answer:
          "Vilnius is best for Indian community, job market, and city life — established Indian restaurants, grocery stores, and the largest Indian student population in Lithuania. Monthly living cost: EUR 550–850. Kaunas is best for budget — most affordable of the three cities, strong student-city atmosphere, QS Best Student Cities ranked (#142, 2026). Monthly cost: EUR 450–700. Klaipeda is best for students who prefer a quieter, smaller coastal city with the lowest living costs. Monthly cost: EUR 400–650. All three campuses deliver the identical nursing curriculum and qualification.",
      },
      {
        question: "Does SMK have university dormitories?",
        answer:
          "No. SMK does not operate dedicated university dormitories for nursing students — accommodation is the student's responsibility. SMK provides guidance and assistance for students who need help finding accommodation. Shared room rental costs: Vilnius EUR 200–400/month; Kaunas EUR 150–300/month; Klaipeda EUR 130–250/month. Most Indian students share 2–3 person apartments. Students Traffic provides city-specific accommodation guides and connects incoming students with existing SMK Indian students before arrival.",
      },
      {
        question: "Is Indian food available near SMK campuses?",
        answer:
          "Vilnius: best Indian food infrastructure — dedicated Indian restaurants and grocery stores stocking basmati rice, lentils, chickpeas, and spices. Kaunas: Indian basics in major supermarkets; Vilnius reachable in 1 hour by train for more variety. Klaipeda: Indian staples available in supermarkets; Kaunas accessible by bus in 1.5–2 hours. Most Indian students cook at home in shared apartments — keeping monthly food costs at EUR 120–200.",
      },
      {
        question: "What is the climate like at SMK campus cities?",
        answer:
          "Baltic climate in all three cities: warm summers (18–26°C, June–August with long daylight) and cold winters (-5 to -15°C, heavy snow from November through March). Klaipeda is marginally milder due to Baltic Sea proximity, but all three cities require a genuine first-year investment in winter clothing. Budget INR 10,000–20,000 for quality winter outerwear before departure. Summer is very pleasant and European travel is easiest during academic breaks.",
      },
      {
        question: "Can I travel in Europe during semester breaks?",
        answer:
          "Yes — this is one of the practical highlights of studying in Lithuania. Your Lithuanian TRP gives access to 26 Schengen countries without a separate visa. Budget airlines from Vilnius (Ryanair, Wizz Air, Air Baltic) and Kaunas airports connect to London, Berlin, Barcelona, Dublin, Oslo, and across Europe from EUR 15–50. Bus connections from Vilnius to Warsaw (6–7 hours, EUR 15–25), Riga (4 hours), and Tallinn (7–8 hours) are affordable. Erasmus+ exchange semesters add a funded study-abroad semester to the experience.",
      },
      {
        question: "Is Lithuania safe for Indian students?",
        answer:
          "Lithuania is an EU and NATO member state with stable democratic governance and a very low violent crime rate. All three SMK campus cities — Vilnius, Kaunas, and Klaipeda — are safe for international students including female students. Standard urban precautions apply (stay aware late at night, use reputable transport), but no exceptional safety concerns have been reported by Indian students at any of the three campuses.",
      },
    ],
  },
  {
    label: "SMK vs LSMU",
    slug: "comparison",
    faqs: [
      {
        question: "What are the main differences between SMK and LSMU for Indian nursing students?",
        answer:
          "SMK: 3.5 years, 210 ECTS, Professional Bachelor (college), EUR 4,400/year, NO entrance test, three campus choices, 40% scholarship available, Spring and Fall intakes. LSMU: 4 years, 240 ECTS, BSc (public university), EUR 4,300/year, Biology/Chemistry entrance test (exempt with NEET 650+), one campus (Kaunas only), limited institutional scholarships, Fall only. LSMU has WHO Collaborating Centre status and is a public university — significant for loan files and INC. SMK is faster, more flexible, and has no entrance test barrier. Both lead to an EQF Level 6 EU nursing qualification recognised under EU Directive 2005/36/EC.",
      },
      {
        question: "Which should I choose — SMK or LSMU?",
        answer:
          "Choose SMK if: you want to avoid the Biology/Chemistry entrance test; you didn't study science at Class 12; you want a campus in Vilnius or Klaipeda; you want the Spring intake option; you want to potentially benefit from the 40% scholarship; or you prefer a 3.5-year duration. Choose LSMU if: you want a public university degree; WHO Collaborating Centre status matters for your education loan or INC pathway; you want the Baltic States' largest teaching hospital (Kauno Klinikos) as your primary clinical facility; or research-depth academic training is important to you. Students Traffic assesses your specific profile — marks, NEET status, scholarship eligibility, campus preference — and gives you an honest recommendation.",
      },
      {
        question: "Is the EU nursing recognition identical for SMK and LSMU graduates?",
        answer:
          "Both degrees are eligible for EU Directive 2005/36/EC recognition. In theory, the automatic recognition framework applies to both. In practice, some European hospitals and state nursing authorities have historically shown preferences for 240 ECTS university degrees over 210 ECTS professional bachelor degrees when assessing individual recognition applications. This gap is narrowing as EU recognition standardises. For most career pathways — Germany, Netherlands, UK, Ireland — both qualifications open the same door. Students Traffic advises on the current recognition status in specific target countries before enrollment.",
      },
      {
        question: "Does SMK's 3.5 years vs LSMU's 4 years actually matter?",
        answer:
          "Yes — in two practical ways. (1) Cost: SMK's 3.5 years means approximately EUR 1,800 less in total tuition and 6 months less of living costs — a saving of EUR 4,500–6,000 compared to LSMU over the full programme. (2) Career timing: graduating 6 months earlier means entering the EU nursing workforce sooner, starting German B2 job applications sooner, and beginning the Anerkennung process sooner. For students on a tight budget or with a specific target graduation date, the difference is meaningful.",
      },
    ],
  },
  {
    label: "Parent Questions",
    slug: "parents",
    faqs: [
      {
        question: "SMK is a private college — is this degree worth anything internationally?",
        answer:
          "The SMK Professional Bachelor in Health Sciences is an EQF Level 6 qualification from a Ministry of Education-licensed Lithuanian college, designed to meet EU Directive 2005/36/EC nursing standards. For working as a nurse in Germany, the UK, Ireland, or other EU countries, the EQF level and directive compliance matter — not whether the issuing institution is public or private. The qualification is internationally meaningful for the specific career pathways it targets: EU nursing, UK NMC, and CGFNS-pathway USA/Canada. It is not the right choice for parents whose primary goal is Canada PR via nursing — a Canadian BScN is better for that pathway.",
      },
      {
        question: "Is Lithuania safe for my daughter as an Indian student?",
        answer:
          "Lithuania is an EU and NATO member state with stable governance and a very low violent crime rate. All three SMK cities — Vilnius, Kaunas, and Klaipeda — are modern, well-connected cities where Indian female students consistently report feeling safe and welcomed. The international student community at SMK (1,000+ from 50+ countries) means Indian students are not isolated. Standard urban precautions apply, but Lithuania's safety environment is comparable to Western European countries.",
      },
      {
        question: "The 40% scholarship — is it real and can my child get it?",
        answer:
          "It is real. The criteria are specific and enforced: Class 12 average of 85%+, B2 English certificate (not the internal SMK test), completed scholarship assignment, and documents submitted by August 20 (Fall) or January 20 (Spring). If your child's Class 12 average is 85%+ and they have IELTS 6.0 or equivalent, Students Traffic strongly recommends applying for this scholarship. It saves EUR 1,760 (~INR 1.6 lakhs) on Year 1 tuition — a genuine, meaningful reduction.",
      },
      {
        question: "How will my child manage food and daily life in Lithuania?",
        answer:
          "In Vilnius: Indian restaurants and grocery stores with all cooking staples available. In Kaunas: Indian basics in major supermarkets; Vilnius 1 hour by train for more variety. In Klaipeda: basics available; Kaunas accessible by bus. Most Indian students cook at home in shared apartments — the most budget-friendly and diet-appropriate approach at EUR 120–200/month for groceries. Students Traffic connects all enrolled SMK students with existing Indian students at their chosen campus city before they fly, so new students arrive knowing where to shop and who to reach out to.",
      },
      {
        question: "What will my child do after graduating — will they actually get a nursing job?",
        answer:
          "The career pathway is concrete, not theoretical. Graduates who complete German B2 during the 3.5-year programme and submit their EU Professional Bachelor for Anerkennung (German credential recognition) after graduation are in a strong position for nursing employment in Germany at EUR 2,500–3,800/month gross. UK NMC registration is a separate, achievable route requiring IELTS 7.0, CBT, and OSCE. Lithuania itself offers immediate post-graduation nursing employment at EUR 1,292/month gross with a post-study TRP for job-seeking. Students Traffic guides the career pathway from Year 1, not as an afterthought after graduation.",
      },
      {
        question: "Can you guarantee a nursing job in Germany after graduation?",
        answer:
          "No — and be cautious of any consultant who does. What we can tell you honestly: Germany's nursing shortage (150,000+ additional nurses needed by 2027) is real and documented. The Anerkennung pathway for EU-educated nurses is well-established and actively used by Lithuanian nursing graduates. German B2 is achievable during a 3.5-year programme with consistent effort. Students Traffic guides your child through language preparation, recognition application, and job search — with honest planning, not false promises.",
      },
    ],
  },
];

const vuLithuaniaFaqSections: FaqSection[] = [
  {
    label: "About VU",
    slug: "about",
    faqs: [
      {
        question: "What is Vilnius University and why is it significant for nursing education?",
        answer:
          "Vilnius University (VU) is Lithuania's oldest university, founded in 1579 — making it over 446 years old and one of the oldest academic institutions in Eastern Europe. It is Lithuania's highest-ranked public research university: QS World University Rankings #446 (2026), #1 in Lithuania, and #19 in the QS Emerging Europe and Central Asia (EECA) region. VU is a comprehensive research university with 12 faculties in Vilnius and a branch campus in Kaunas, enrolling approximately 15,000–20,000 students including 750+ new international students annually from 90+ nationalities. It is a member of the Arqus European University Alliance (a network of elite European research universities) and the European University Association (EUA). The Bachelor of Health Sciences (General Practice Nurse) is offered by VU's Faculty of Medicine, Department of Midwifery and Nursing — launched in September 2019 with English-taught instruction. Clinical training is conducted at Vilnius University Hospital Santaros Klinikos, VU's own teaching hospital. For Indian students, VU offers the most prestigious nursing qualification available from Lithuania.",
      },
      {
        question: "What university ranking does VU hold and why does it matter for Indian students?",
        answer:
          "Vilnius University ranks QS #446 globally (2026) — #1 in Lithuania, #19 in QS EECA. THE World Ranking: #801 (2026). ARWU Shanghai: #501 (2025). These rankings matter significantly for Indian students for two concrete reasons. First, Indian education loan approval: banks like SBI, HDFC Credila, Axis, and Avanse prioritise loans for QS-ranked public universities — VU's QS #446 ranking makes it one of the strongest international nursing loan files available. Second, German Anerkennung (credential recognition): Germany's nursing regulatory bodies assess the standing of the awarding institution when evaluating foreign nursing qualifications — VU's QS ranking and public research university status carry more recognition weight than college-level Professional Bachelor qualifications from unranked institutions.",
      },
      {
        question: "What is Santaros Klinikos and what makes it a superior clinical training environment?",
        answer:
          "Vilnius University Hospital Santaros Klinikos is VU's own teaching hospital, jointly operated with Lithuania's Ministry of Health. It is the leading clinical institution in the Baltic region: 1,409 doctors, 1,978 nurses, 5,372 total employees, 370+ professors and doctorates providing direct patient care, and 35 specialised medical centres. The hospital operates across 7 clinical groups: Surgery, Therapy, Diagnostics, Heart and Vascular, Mother and Child, Outpatient, and Clinical Services. Affiliated divisions include the National Cancer Centre (oncology) and Zalgirio Klinikos (odontology). The critical distinction: Santaros Klinikos is not an external partner hospital — it is VU's own clinical infrastructure. Academic and clinical roles are fully integrated: the same professors who teach your nursing theory also conduct rounds and publish clinical research. VU nursing students at Santaros Klinikos are exposed to the latest evidence-based practice rather than routine clinical procedures alone.",
      },
      {
        question: "Is VU's nursing degree a university BSc or a college Professional Bachelor — and does the distinction matter?",
        answer:
          "VU's degree is a full university Bachelor of Health Sciences (BSc), a 240 ECTS university-level qualification at EQF Level 6 awarded by Lithuania's oldest and highest-ranked public research university. This is distinct from the Professional Bachelor in Health Sciences (also EQF Level 6) awarded by nursing colleges like SMK or LSMU college. Both meet EU Directive 2005/36/EC nursing standards for EU-wide practice recognition. However, the distinction matters in three specific contexts: (1) German Anerkennung — Germany's nursing authorities assess the institutional standing of the awarding university; a QS-ranked research university BSc carries more weight. (2) PhD pathway — a university BSc directly opens VU's MSc in Advanced Practice Nursing and PhD in nursing and biomedical sciences; Professional Bachelor holders must complete supplementary studies first. (3) Academic and policy careers — research and academic positions in nursing typically require a university BSc foundation. For direct clinical nursing practice in Europe, both qualifications work. For career tracks involving research, teaching, or policy, the VU university BSc is significantly stronger.",
      },
      {
        question: "What is the Arqus European University Alliance and why does VU's membership matter?",
        answer:
          "Arqus is a European University Alliance of seven elite research-intensive universities: Vilnius University (Lithuania), University of Granada (Spain), Leipzig University (Germany), University of Graz (Austria), University of Lyon (France), Ghent University (Belgium), and University of Bergen (Norway). Membership reflects that VU is peer-recognised by major Western European universities as a genuine research institution. For VU nursing students, this means: (1) Erasmus+ exchanges at Arqus partner universities in Germany, Spain, France, Belgium, Austria, and Norway — invaluable clinical and language exposure. (2) Joint research and academic programmes. (3) A network of European university peers that strengthens the VU credential's standing during recognition processes in Western Europe. VU is the only Lithuanian university in an alliance with German, French, Belgian, and Norwegian research universities.",
      },
      {
        question: "When was VU's English-taught nursing programme established, and how mature is it now?",
        answer:
          "VU launched its English-taught Bachelor of Health Sciences (General Practice Nurse) in September 2019 — now entering its 8th intake cycle. The Department of Nursing subsequently expanded in September 2025 with the launch of an English-taught Bachelor of Midwifery — reflecting the programme's successful growth. By 2026, VU has full cohorts across all four year groups, an established curriculum, experienced faculty in English-medium instruction, and a trackable first-cohort graduation record. Students entering in September 2026 will graduate alongside VU Nursing's established international alumni network — the programme is no longer new, it is proven.",
      },
    ],
  },
  {
    label: "Programme & Qualification",
    slug: "qualification",
    faqs: [
      {
        question: "What is the full name and duration of the VU nursing programme?",
        answer:
          "Bachelor of Health Sciences (General Practice Nurse). Duration: 4 years full-time (8 semesters). Total: 240 ECTS credits (European Credit Transfer and Accumulation System). This is a full EQF Level 6 university bachelor's degree, fully Bologna Process compliant. Programme code: 6121GX019. The professional qualification conferred on graduation: General Practice Nurse (registered with VASPVT, Lithuania). Language of instruction: English (100% English-taught). Annual tuition for non-EU students: EUR 6,000. One intake per year: September 1.",
      },
      {
        question: "What subjects are taught across the 4 years of the VU nursing programme?",
        answer:
          "Year 1 — Biomedical Foundations (60 ECTS): Anatomy and Physiology, Histology, Microbiology, Biochemistry, Biophysics, Introduction to Nursing Science, Professional Ethics, Health Psychology, Medical Terminology. Introductory clinical observation at Santaros Klinikos. Year 2 — Pathophysiology and Core Nursing (60 ECTS): Pathophysiology, Pharmacology, Health Assessment, General Nursing Theory and Practice, Nursing Procedures and Techniques, Community Health foundations. Supervised direct patient care begins at Santaros Klinikos medical and surgical wards. Year 3 — Specialised Clinical Nursing (60 ECTS): Adult (Medical and Surgical), Mental Health, Maternal and Obstetric, Paediatric, Geriatric, Rehabilitation Nursing, Research Methods. Intensive specialty clinical rotations. Year 4 — Advanced Practice and Thesis (60 ECTS): Critical Care and ICU Nursing, Anaesthesiology Nursing (dedicated advanced module at Santaros Klinikos), Nursing Leadership and Management. Extended preceptorship placement. Bachelor's Thesis defence.",
      },
      {
        question: "What professional qualification does a VU nursing graduate receive and where can they work?",
        answer:
          "Graduates receive: (1) Academic title — Bachelor of Health Sciences. (2) Professional qualification — General Practice Nurse, registered with VASPVT (State Health Care Accreditation Agency), Lithuania. This enables immediate nursing practice in Lithuania. (3) EU-wide recognition — under EU Directive 2005/36/EC, the qualification is automatically recognised across all 27 EU member states for nursing practice. (4) Further pathway — the VU university BSc enables direct entry to VU's MSc in Advanced Practice Nursing, and then to PhD programmes in nursing and biomedical sciences. Compared to college Professional Bachelor holders, VU BSc graduates skip the Supplementary Studies bridge step entirely when pursuing postgraduate nursing education.",
      },
      {
        question: "How does the VU BSc Nursing compare to a college Professional Bachelor — what is the practical difference for Indian students?",
        answer:
          "For clinical nursing practice in EU countries: both are equally valid under Directive 2005/36/EC — the directive accepts all EQF Level 6 nursing qualifications meeting its content requirements. For German Anerkennung: the VU university BSc from a QS #446 institution carries more recognition weight than a Professional Bachelor from an unranked college. For UK NMC: VU's ranking is better received. For Indian education loans: VU's QS rank gives stronger loan approval prospects. For academic and research careers: VU BSc opens the MSc and PhD directly. For cost: VU is EUR 1,600–1,700/year more expensive than SMK or LSMU. The practical summary: if you meet VU's requirements (IELTS 6.5+, Biology+English+Science Class 12, within 5-year gap), VU is the stronger choice for career ambition and prestige. If IELTS is below 6.5 or the gap rule applies, SMK or LSMU are excellent alternatives.",
      },
      {
        question: "What is the Supplementary Studies pathway and who is it for?",
        answer:
          "VU's Supplementary Studies pathway (Pathway 6) is a bridge programme for holders of a Professional Bachelor in nursing (EQF Level 6 college qualification — e.g., from SMK, LSMU college, or equivalent). Completing VU's Supplementary Studies brings Professional Bachelor holders to full university BSc competency standards. After Supplementary Studies, they can enrol in VU's MSc in Advanced Practice Nursing and then PhD — achieving master-level qualification from Lithuania's top university. The strategic implication for Indian students: it is possible to complete SMK's 3.5-year Professional Bachelor programme (lower IELTS threshold, lower tuition) and then transition to VU's Supplementary Studies + MSc pathway — achieving a VU master's degree at a lower total cost than doing VU's 4-year BSc + MSc directly. Students Traffic can model this multi-year strategy for families interested in the most cost-efficient route to a VU postgraduate qualification.",
      },
    ],
  },
  {
    label: "Entry Pathways",
    slug: "pathways",
    faqs: [
      {
        question: "What are the 6 entry pathways for Indian students at Vilnius University?",
        answer:
          "Pathway 1 — Standard Class 12 Entry: Indian Class 12 (CBSE/CISCE/State Board) with Biology + English + Chemistry/Physics/Maths within the 5-year gap rule + IELTS 6.5+. This is the direct route for recent Indian school leavers meeting all requirements. Pathway 2 — A-Level or IB Diploma: International A-Level or International Baccalaureate Diploma with Biology, English, and one science/maths subject. Pathway 3 — Second Degree Entry: An existing bachelor's degree (any discipline) bypasses the 5-year Class 12 gap rule. Indian BSc Nursing, BScN, or any bachelor's graduates apply using their degree, not Class 12. Pathway 4 — Professional Bachelor Entry: Holders of a Lithuanian Professional Bachelor in nursing (from SMK, LSMU college, etc.) can apply to VU directly. Pathway 5 — Foundation Year Entry: Complete a Foundation Year programme (SMK or equivalent, available with IELTS 5.5) and apply to VU with the resulting IELTS 6.5 and foundation certificate. Pathway 6 — Supplementary Studies: Specifically for Professional Bachelor holders wanting access to VU's MSc in Advanced Practice Nursing, bypassing the VU BSc entirely.",
      },
      {
        question: "What is the 5-year gap rule and which Indian students does it affect?",
        answer:
          "VU applies a 5-year gap rule for non-EU applicants applying via the standard Class 12 pathway: the gap between completing secondary school (Class 12) and the intended year of enrolment must not exceed 5 years. For September 2026 intake, this means students who completed Class 12 in 2021 or later are eligible via the standard pathway. Students who completed Class 12 in 2020 or earlier have exceeded the 5-year gap and must use an alternate pathway — either Pathway 3 (existing bachelor's degree), Pathway 4 (Professional Bachelor from a Lithuanian college), or Pathway 5 (Foundation Year). The gap rule catches many Indian students by surprise — it is different from LSMU (no stated gap limit for the standard pathway) and SMK (no stated gap rule). Verify your gap year status with Students Traffic before paying the EUR 100 application fee.",
      },
      {
        question: "I completed my Class 12 in 2018 — can I still apply to VU Nursing?",
        answer:
          "Not via the standard Class 12 pathway. Your 2018 Class 12 is now 8 years old — well beyond VU's 5-year gap rule for non-EU applicants. However, you have options. Pathway 3 (Second Degree Entry): if you have subsequently completed or are near completing any bachelor's degree (BSc Nursing, B.Com, BBA, BA, Engineering — any discipline), you can apply to VU using your bachelor's degree as your primary qualification, bypassing the Class 12 gap entirely. Pathway 5 (Foundation Year): complete a 1-year Foundation Year at SMK or equivalent with IELTS 5.5 — this resets the academic entry requirement and allows you to apply to VU with foundation qualifications + IELTS 6.5. Pathway 6 (SMK route + VU Supplementary Studies): study the SMK Professional Bachelor (3.5 years, IELTS 5.5) then transition to VU's Supplementary Studies and MSc. Each pathway has different time horizons and costs — contact Students Traffic for a personalised gap-year pathway map.",
      },
      {
        question: "I am an Indian BSc Nursing graduate. Can I get direct admission to VU and skip Year 1?",
        answer:
          "You can apply to VU via Pathway 3 (second degree entry) using your Indian BSc Nursing degree. This bypasses the 5-year Class 12 gap rule. Credit transfer for any part of your Indian BSc Nursing towards the VU programme is at VU's discretion — you should directly request credit assessment from VU's Faculty of Medicine during the application process. VU may grant partial credit for equivalent foundational nursing subjects already completed, potentially reducing the total duration from 4 years. Students Traffic can help you frame this credit transfer request appropriately. Note: IELTS 6.5+ and the motivation letter + interview requirements still apply regardless of pathway.",
      },
      {
        question: "My IELTS is 5.5 — should I wait for 6.5 or go to SMK now and switch to VU later?",
        answer:
          "This depends on your gap year situation and timeline. Option A — Wait: Invest 6–12 months improving IELTS from 5.5 to 6.5 and then apply to VU directly. Best if you are within the 5-year gap window and willing to delay one year. Option B — SMK + VU Supplementary Studies: Start SMK immediately (IELTS 5.5 accepted, lower tuition at EUR 4,400/year vs EUR 6,000/year). After completing SMK's Professional Bachelor (3.5 years), use VU's Supplementary Studies pathway to access the VU MSc in Advanced Practice Nursing. You reach master level at VU without ever getting IELTS 6.5 for direct VU BSc entry. Option C — Foundation Year: Complete a 1-year Foundation Year at SMK (IELTS 5.5), bring IELTS to 6.5 during the year, and apply to VU BSc for Year 1 the following September. Students Traffic models all three pathways with exact timelines and costs — request a free pathway assessment.",
      },
    ],
  },
  {
    label: "Admission & Eligibility",
    slug: "admission",
    faqs: [
      {
        question: "What are the exact eligibility requirements for Indian students applying to VU Nursing?",
        answer:
          "For the standard Class 12 pathway: (1) Class 10+2 passed with Biology (mandatory subject — non-negotiable), English, and ONE of: Chemistry, Physics, or Mathematics. (2) 5-year gap rule: time since completing Class 12 must not exceed 5 years for non-EU applicants — students who passed Class 12 before 2021 must use an alternate pathway. (3) English proficiency: IELTS Academic 6.5+ / TOEFL iBT 81+ / PTE Academic 59+ / Duolingo 120+ / Cambridge English 176+. (4) Motivation letter (7 required questions — VU states this carries tremendous value in the shortlisting assessment). (5) Motivational interview (individual, typically online, after shortlisting). (6) All documents in English or with authorised translations + MEA Apostille. (7) Applications not accepted from Bangladesh, Nepal, or Pakistan citizens. (8) EUR 100 non-refundable application fee paid via Flywire only before the application is reviewed.",
      },
      {
        question: "What is the deadline for Indian students applying to VU Nursing?",
        answer:
          "1 May 2026 for non-EU/Indian applicants applying for the September 2026 intake. This is significantly earlier than LSMU (6 July) or SMK (1 July). The timeline compounds: after applying and being shortlisted, VU conducts a motivational interview and then issues a Pre-Acceptance Letter. After receiving the Pre-Acceptance Letter, you have only 15 calendar days to pay EUR 6,000 first-year tuition. Only after tuition payment does VU issue the full Acceptance Letter needed for the TRP application. TRP processing takes up to 2 months. Working backwards, Indian students applying for September 2026 should submit their completed application by 15 March 2026 at the latest to safely complete every step before the September 1 start date. Students Traffic recommends beginning the process in January or February 2026.",
      },
      {
        question: "What is the motivation letter for VU Nursing and what are the 7 required questions?",
        answer:
          "VU's motivation letter is a mandatory application document that VU describes as having tremendous value in the shortlisting and selection process. It is not a generic personal statement — VU specifies exactly 7 questions that must be answered: (1) Why have I chosen this programme? (2) What do I expect to gain from studying here? (3) Why does my personal and academic background make me suitable for this programme? (4) How will the programme help me achieve my goals? (5) What are my strengths? (6) What are my weaknesses? (7) How do I plan to finance my studies? Answers should be genuine, specific, and demonstrate nursing motivation beyond vague statements like wanting to help people. Students Traffic coaches VU motivation letters — the coaching focuses on answering each question with concrete, differentiated content that reflects the student's specific background and goals.",
      },
      {
        question: "What documents need to be Apostilled and how does MEA Apostille work for Indian students?",
        answer:
          "All Indian academic documents require MEA (Ministry of External Affairs) Apostille to be valid for European university admission. Required documents: Class 10 marksheet and certificate, Class 12 marksheet and certificate, degree certificates if applying via Pathway 3. The Apostille process: (1) Get original documents attested by the State Education Board. (2) Submit to MEA for Apostille via RPOD (Regional Passport Office) or via private Apostille service providers. Processing time: 7–15 business days via regular channel, 2–4 business days via tatkal. Documents not originally in English also require authorised English translation before Apostille. Students Traffic connects students with established Apostille coordination services to manage this process efficiently — do not leave Apostille to the last week before the application deadline.",
      },
      {
        question: "What happens after I submit my VU application?",
        answer:
          "Step 1: VU receives your application at apply.vu.lt and confirms receipt of the EUR 100 Flywire fee. Step 2: VU assesses all documents and the motivation letter for shortlisting (typically 1–3 weeks). Step 3: Shortlisted applicants are invited to a motivational interview — individual, online, in English. The interview assesses academic suitability, nursing motivation, and English communication ability. Step 4: VU issues an admission decision (typically within 1–2 weeks of the interview). Step 5: On admission, VU issues a Pre-Acceptance Letter. You have 15 calendar days from this letter to pay EUR 6,000 first-year tuition via Flywire. Step 6: After tuition payment, VU issues the full Acceptance Letter (Letter of Acceptance — LOA) — the document you need to initiate the TRP application. Step 7: Begin TRP process with VU's LOA. Students Traffic monitors every step and keeps your timeline on track.",
      },
      {
        question: "My class 12 had Biology and English but not Chemistry, Physics, or Mathematics. Am I eligible?",
        answer:
          "No. VU's stated requirement is Biology + English + one of Chemistry, Physics, or Mathematics. If your Class 12 record does not include at least one of Chemistry, Physics, or Mathematics alongside Biology and English, you do not meet the standard Class 12 pathway requirement. This typically affects students from arts or commerce streams and some students from boards where these three sciences are not compulsory for Biology students. Options: (1) A-Level route (Pathway 2) — complete an A-Level in Chemistry or Physics and apply using A-Level qualifications. (2) Second degree route (Pathway 3) — a subsequent bachelor's degree in any scientific discipline may bypass this requirement — check with VU directly. (3) Apply to LSMU or SMK instead, which have different subject prerequisites. Students Traffic can review your Class 12 subjects and recommend the correct pathway.",
      },
    ],
  },
  {
    label: "Fees & Costs",
    slug: "fees",
    faqs: [
      {
        question: "What is the total cost of studying nursing at Vilnius University for an Indian student?",
        answer:
          "Total tuition over 4 years: EUR 24,000 (EUR 6,000 x 4). Application fee: EUR 100 (non-refundable, paid via Flywire — one time). Living costs in Vilnius: EUR 535–1,135/month, approximately EUR 25,680–54,480 over 4 years depending on accommodation (VU dormitory EUR 70–180/month vs private shared room EUR 200–450/month). Visa/TRP costs: EUR 120/year (regular) for 4 years = EUR 480, plus MIGRIS and VFS service fees totalling approximately EUR 200. Health insurance: EUR 25–55/month = EUR 1,200–2,640 over 4 years. Grand total all-in: approximately EUR 51,460–81,500 (approximately INR 46–73 lakhs, using EUR 1 = INR 90). Monthly budget breakdown: VU dormitory EUR 70–180 + food EUR 150–280 + transport EUR 20–30 + health insurance EUR 25–55 + phone EUR 20–40 + miscellaneous EUR 50–100 = EUR 335–685/month living (ex-tuition).",
      },
      {
        question: "How must the EUR 6,000 first-year tuition be paid and when is the deadline?",
        answer:
          "First-year tuition of EUR 6,000 must be paid via Flywire only — VU does not accept direct bank transfers or other payment services for tuition. The payment must be completed within 15 calendar days of receiving the Pre-Acceptance Letter. This is a hard deadline — VU will not extend it. Only after tuition payment does VU issue the full Acceptance Letter (LOA) required to initiate the TRP application. The practical implication: you and your family must have EUR 6,000 readily accessible at the moment the Pre-Acceptance Letter arrives — there is no time to arrange funds after it arrives. Students Traffic monitors this deadline and alerts families before the Pre-Acceptance Letter is expected so funds are prepared in advance.",
      },
      {
        question: "Are scholarships available at Vilnius University for Indian nursing students?",
        answer:
          "VU does not offer automatic, widely publicised merit scholarships exclusively for non-EU nursing bachelor's students. However, several paths exist: (1) VU Talent Scholarships based on academic merit — criteria and availability change each year, check vu.lt/en/students/services-for-students/finance for current terms. (2) Lithuanian Government scholarships via studyin.lt — available to some eligible non-EU students in specified fields and nationalities. (3) Erasmus+ exchange semesters — available to enrolled VU students at 750+ partner institutions, including a EUR 350–700/month living stipend during the exchange semester. (4) VU Dormitory access — at EUR 70–180/month, dormitory accommodation saves EUR 1,440–3,240/year vs private accommodation. (5) Part-time work in Vilnius — 20 hours/week at EUR 5.65/hour minimum generates EUR 450–490/month gross. Vilnius has the best part-time job market in Lithuania. (6) Indian education loans — SBI, HDFC Credila, Axis, Avanse accept QS-ranked public universities like VU.",
      },
      {
        question: "How does VU's tuition compare to LSMU and SMK?",
        answer:
          "Annual tuition: LSMU EUR 4,300/year | SMK EUR 4,400/year | VU EUR 6,000/year. Over 4 years: LSMU EUR 17,200 | SMK EUR 15,400 | VU EUR 24,000. VU's 4-year tuition is EUR 6,800–8,600 more than the alternatives. In return, VU offers: Lithuania's #1 QS-ranked public research university (QS #446 globally), Santaros Klinikos teaching hospital with 1,409 doctors and 35 specialised centres, capital city location (Vilnius — better part-time work, Indian community, career connections), direct MSc/PhD pathway without supplementary studies, and stronger credentials for German Anerkennung and UK NMC. The EUR 6,800–8,600 premium over 4 years is approximately EUR 1,700–2,150/year — equivalent to 3–4 months of part-time work income. For families who can budget for it, the prestige premium is well-justified. For families who cannot, LSMU Kaunas or SMK are academically strong alternatives with the same EU Directive recognition.",
      },
      {
        question: "Can I take an education loan for VU Nursing and which banks accept VU?",
        answer:
          "Yes. VU's QS #446 global ranking and public university status make it a strong file for Indian bank education loans. Banks that accept QS-ranked public universities for international nursing programmes include: State Bank of India (SBI) — check Study Abroad loan schemes; HDFC Credila — education loan specialist with international programme coverage; Axis Bank Education Loan; Avanse Financial Services — education loan NBFC with wide international programme acceptance. The loan typically covers tuition and can partially cover living costs. Interest rates typically range from 9–12% per annum (floating). Students Traffic provides a VU university confirmation letter and fee structure documentation to support loan applications. Begin the loan process at least 3 months before the application deadline — bank processing times are long and must not delay your EUR 100 application fee or the 15-day tuition payment window.",
      },
    ],
  },
  {
    label: "Visa & Immigration",
    slug: "visa",
    faqs: [
      {
        question: "What visa or residence permit do I need to study nursing at VU in Lithuania?",
        answer:
          "Indian students need a Lithuanian National Visa D (long-stay student visa) followed by a Temporary Residence Permit (TRP) for study purposes, issued under the Lithuanian Law on the Legal Status of Aliens. The TRP is processed through Lithuania's Migration Department (MIGRIS) and the application is submitted via VFS Global in India. The TRP is valid for up to 1 year and must be renewed annually for the duration of your studies. Critically: you receive your TRP only after arriving in Lithuania, not before. You enter Lithuania on the National Visa D, then convert to TRP. As a Lithuanian TRP holder, you can travel visa-free within all 26 Schengen Area countries during semester breaks — giving you access to travel across Europe.",
      },
      {
        question: "What is MIGRIS and how does it work for the VU student TRP application?",
        answer:
          "MIGRIS (migris.lt) is Lithuania's Migration Information System — the online portal where all TRP applications are initiated. The TRP application process for Indian VU students: (1) Receive the full VU Acceptance Letter (LOA) — issued only after EUR 6,000 tuition payment. (2) Register on MIGRIS at migris.lt, complete the student residence permit application form, and receive your MIGRIS application number. (3) Request a VU mediation number from the VU Faculty of Medicine admissions office — this number is required for booking your VFS Global appointment in India. (4) Book VFS Global appointment in India (Bangalore, Chennai, Delhi, Hyderabad, Kolkata, Mumbai, or Pune — check vfsglobal.com for Lithuania Visa Centres). (5) Attend VFS appointment: submit physical documents, biometrics (fingerprints, photo). (6) Pay visa fee: EUR 120 (regular) or EUR 240 (urgent processing). Processing time: up to 2 months. Collect visa/notification and travel to Lithuania.",
      },
      {
        question: "What documents do I need for the Lithuania student TRP application?",
        answer:
          "Core documents required for the TRP application: (1) VU full Acceptance Letter (LOA) — issued only after tuition payment. (2) Proof of first-year tuition payment (EUR 6,000 via Flywire). (3) MIGRIS application number (from online registration). (4) VU mediation number (from VU Faculty admissions office). (5) Bank statement showing minimum EUR 3,648 for Year 1 living costs (EUR 304/month x 12 months — official Lithuanian financial sufficiency requirement). (6) Accommodation confirmation — VU dormitory booking or private accommodation address in Vilnius. (7) Valid health insurance covering all Schengen countries — minimum EUR 6,000 sum insured. (8) Passport photograph (3x4 cm). (9) Police Clearance Certificate (PCC) from India. (10) Valid passport (validity extending well beyond programme end date). (11) Visa fee payment receipt: EUR 120 regular or EUR 240 urgent. Students Traffic prepares and verifies the complete document package.",
      },
      {
        question: "How long does the Lithuania student TRP take to be approved?",
        answer:
          "The Lithuanian Migration Department processes student TRP applications in up to 2 months (60 days) from the date of complete submission. Urgent processing (EUR 240 fee instead of EUR 120) reduces this to approximately 30 days but is not guaranteed. Given VU's May 1 application deadline, the 15-day tuition payment window after Pre-Acceptance Letter, and the 2-month TRP processing time, you must submit your TRP application by late June at the very latest for a September 1 start — ideally by mid-June. This is why Students Traffic recommends Indian students begin the VU application process in February or March 2026. Working backwards: submit TRP by June 15 → means submit tuition by June 1 → means receive Pre-Acceptance Letter by mid-May → means VU processing completed by late April → means VU application submitted by March 2026.",
      },
      {
        question: "Can I work part-time in Lithuania while studying at VU?",
        answer:
          "Yes. Non-EU international students enrolled at Lithuanian universities are permitted to work up to 20 hours per week during term time (and full-time during official study breaks such as summer vacations). Lithuania's minimum wage: EUR 1,038/month gross (2026), translating to approximately EUR 5.65/hour minimum. At 20 hours/week, you earn EUR 450–490/month gross part-time. In Vilnius (Lithuania's capital), the part-time job market is the most developed in the country — hospitality, retail, warehouse, and international BPO companies regularly employ multilingual students. EUR 450–490/month covers a significant portion of monthly living costs (EUR 535–1,135/month total), particularly if accommodated in a VU dormitory at EUR 70–180/month. Students Traffic provides Vilnius job market guidance and student job application tips during pre-departure briefings.",
      },
      {
        question: "Do I need health insurance in Lithuania and what kind?",
        answer:
          "Yes. Health insurance is mandatory for the Lithuania student TRP application. Requirements: coverage across all Schengen Area countries, minimum EUR 6,000 sum insured, minimum 3-month validity (recommended: 12 months). After the first year, you become eligible for Lithuania's state health insurance system as an enrolled student — registration is done through the State Social Insurance Fund Board (SODRA) — which may reduce or eliminate private insurance costs in subsequent years. Check with VU's International Office on SODRA registration timing. In the first year, purchase an international student health insurance plan — Students Traffic recommends cost-effective plans from international student health insurance providers covering Schengen requirements at EUR 25–55/month.",
      },
    ],
  },
  {
    label: "Career After Graduation",
    slug: "career",
    faqs: [
      {
        question: "What career options does a VU BSc Nursing graduate have?",
        answer:
          "A VU Bachelor of Health Sciences (General Practice Nurse) opens multiple structured career tracks: (1) Lithuania: Register with VASPVT, work immediately as a General Practice Nurse at Santaros Klinikos or any Lithuanian hospital or clinic. Entry salary EUR 1,292/month gross (public hospital, growing with experience). (2) EU-wide clinical practice: Directive 2005/36/EC recognition across all 27 EU member states — apply to nursing regulatory body in target country + meet language requirement. (3) Germany: Anerkennung (credential recognition) + German B2 language = strongest near-term EU destination salary-wise at EUR 2,800–3,800/month gross. (4) UK NMC registration: IELTS 7.0 + CBT + OSCE = Band 5 NHS salary GBP 29,970–36,483/year. (5) USA/Canada: CGFNS credential evaluation + NCLEX-RN = USD 4,000–7,000/month entry salary. (6) VU MSc in Advanced Practice Nursing — direct entry for VU BSc graduates, upgrading to specialist/advanced practice level. (7) PhD in nursing or biomedical sciences — research and academic careers.",
      },
      {
        question: "Is Germany a realistic destination for VU nursing graduates and what does the process involve?",
        answer:
          "Germany is the most widely pursued career destination for Lithuanian nursing graduates. The path from VU graduation to German employment: (1) German language: Begin German B2 from Year 1 of the VU programme. There are 4 years to achieve B2 — fully achievable with consistent effort (3–5 hours/week). Goethe-Institut and online platforms (Duolingo, Babbel, Chatterbug) provide structured learning. VU also offers German language courses on campus. (2) After graduation: Submit the VU BSc Nursing certificate + transcripts + VASPVT licence + German B2 certificate to the German state nursing authority (Landesamt fur Gesundheit und Soziales or equivalent) for Anerkennung (credential recognition). (3) VU's QS-ranked research university BSc is well-received in Anerkennung processes — significantly better than college Professional Bachelor qualifications from unranked institutions. (4) With Anerkennung complete, apply to German hospitals and nursing agencies actively recruiting internationally (Diakonie, Caritas, Deutsche Bahn Healthcare, large university hospital systems). German nursing demand: 150,000+ additional nurses needed by 2027. (5) Obtain an Anerkennungsberatung Blue Card or skilled worker visa and relocate. Entry salary: EUR 2,800–3,800/month gross = approximately INR 2.52–3.42 lakhs/month.",
      },
      {
        question: "What is the UK NMC registration process for VU graduates?",
        answer:
          "Nursing and Midwifery Council (NMC) UK registration for VU graduates: (1) IELTS 7.0 Academic (mandatory — 7.0 overall with no band below 7.0 — note: higher than VU's admission requirement of 6.5). Alternatively: OET 350 across all four components. (2) Submit qualification to NMC for assessment via the international registration route. VU's QS-ranked university BSc is well-received by NMC assessors. (3) NMC Computer-Based Test (CBT) — theoretical nursing knowledge assessment (passmark 67%). (4) Objective Structured Clinical Examination (OSCE) — practical nursing skills assessment at an NMC-approved OSCE centre (held in the UK). (5) On passing both, NMC registration is issued. NHS Band 5 salary: GBP 29,970–36,483/year (approximately INR 31–38 lakhs/year). Band progression to Band 6 with experience. Recommendation: begin IELTS 7.0 preparation from Year 3 if the UK is your target. Students Traffic provides an NMC assessment pathway timeline for VU graduates.",
      },
      {
        question: "Can a VU nursing graduate work in the USA or Canada?",
        answer:
          "USA: VU BSc Nursing is eligible for CGFNS (Commission on Graduates of Foreign Nursing Schools) credential evaluation — the required first step for US nursing licensure. After CGFNS certification, pass the NCLEX-RN examination. Then apply for a US nursing work visa (typically H-1B or sponsored EB-3 through a US hospital employer). Entry-level US RN salary: USD 4,000–7,000/month (state dependent — California and New York are highest; Texas and Florida are more accessible for international nurses). Canada: CGFNS credential evaluation + NCLEX-RN (required in most Canadian provinces since 2024) + IELTS 7.0 = provincial nursing registration. Canadian RN salary: CAD 3,500–5,500/month. Important: Canada Express Entry for skilled workers (including nurses) is a PR pathway. However, it is a long, competitive process. Students Traffic recommends against choosing Lithuania nursing solely to target Canada PR via nursing — this is a high-uncertainty multi-year proposition. Germany is a more reliable career-entry strategy from Lithuania.",
      },
      {
        question: "Can I pursue a Master's degree after the VU BSc Nursing?",
        answer:
          "Yes. VU BSc Nursing graduates can directly enrol in VU's Master of Advanced Practice Nursing — no supplementary studies required (that bridge step is only for Professional Bachelor holders from colleges). VU's MSc is research-active, aligned with the Arqus Alliance, and produces graduates who practise at the nurse specialist/advanced practitioner level. After the MSc, PhD programmes in nursing and biomedical sciences are open — research careers at Lithuanian hospitals, EU policy organisations, or academic positions at VU and partner universities become accessible. This full academic trajectory from BSc to MSc to PhD is only possible for VU university BSc holders — it is one of the defining advantages of choosing VU over college-level nursing programmes in Lithuania.",
      },
    ],
  },
  {
    label: "VU vs LSMU vs SMK",
    slug: "comparison",
    faqs: [
      {
        question: "How do Vilnius University, LSMU, and SMK compare for Indian nursing students?",
        answer:
          "VU: QS #446, public research university, founded 1579, Santaros Klinikos teaching hospital, 240 ECTS BSc, EUR 6,000/year, IELTS 6.5+, Vilnius. LSMU: Lithuania's specialist health sciences university, AUN-QA accredited, Kaunas Clinical Hospital (950+ beds), 240 ECTS BSc, EUR 4,300/year, IELTS 5.5+, Kaunas. SMK: European-network private college, QAA-accredited from the UK, modern clinical skills centres, 210 ECTS Professional Bachelor, EUR 4,400/year (with 40% scholarship option), IELTS 5.5+, Vilnius/Kaunas/Klaipeda (3 campuses). Career outcomes for EU nursing are substantially the same — all three qualify under Directive 2005/36/EC. The key differences: VU gives Lithuania's most prestigious academic credential and the strongest QS ranking, but costs EUR 1,600–1,700/year more and requires IELTS 6.5. LSMU gives a dedicated health sciences university experience and the lowest tuition. SMK gives a 3.5-year programme (finishing 6 months before VU/LSMU), a scholarship option, and 3-campus flexibility.",
      },
      {
        question: "If I get into all three — VU, LSMU, and SMK — which should I choose?",
        answer:
          "This depends entirely on your goals, academic background, and financial situation. Choose VU if: you meet all requirements (IELTS 6.5+, Biology+English+Science Class 12, within 5-year gap), your family can budget EUR 6,000/year, and you want Lithuania's most prestigious degree with the strongest QS ranking for German Anerkennung, UK NMC, and future MSc/PhD. Choose LSMU if: your IELTS is 5.5+ but below 6.5, or your tuition budget caps at EUR 4,300/year, and you want the clinical depth of a dedicated health sciences university in the city where Lithuanian nursing education was built. Choose SMK if: you want the fastest route to EU nursing registration (3.5 years, 6 months faster than VU/LSMU), your IELTS is 5.5+, you want the 40% scholarship (if you qualify), or you want Klaipeda or Kaunas campus. Students Traffic can help you model the exact career outcome of each pathway for your specific profile — request a free comparison.",
      },
      {
        question: "Is VU's teaching hospital Santaros Klinikos better than LSMU's Kaunas Clinical Hospital?",
        answer:
          "Both are excellent clinical training environments. Santaros Klinikos (VU): 1,409 doctors, 1,978 nurses, 35 specialised centres, 5,372 staff, 370+ professors providing patient care, research-intensive. The largest and most specialised teaching hospital in the Baltic region. VU's own institution — academic and clinical roles are fully integrated. LSMU Kaunas Clinical Hospital (LSMU): 950+ beds, major Kaunas teaching hospital, strong in surgery, internal medicine, maternal health. LSMU specialises entirely in health sciences — every faculty member, every professor is in the health field, creating a more focused medical culture. In pure size and specialisation breadth, Santaros Klinikos is larger. In terms of specialised health sciences culture and cohesion, LSMU's clinical environment is arguably more medically focused. For most clinical nursing training purposes, both are more than adequate. The hospital-as-differentiation argument slightly favours VU purely on scale; the medical culture argument slightly favours LSMU.",
      },
      {
        question: "I want to work in Germany after graduation — is VU better than LSMU or SMK for German Anerkennung?",
        answer:
          "VU has a marginal advantage in German Anerkennung recognition processes due to its QS #446 public research university status. German state nursing authorities are generally more familiar with established research universities than with specialist health science universities or private colleges, and QS ranking is a positive signal in the assessment. However, LSMU's AUN-QA accreditation, professional health sciences focus, and strong clinical curriculum have also been recognised successfully in German Anerkennung by Lithuanian nursing graduates. SMK Professional Bachelor holders have also successfully obtained German Anerkennung — the process is more documentation-intensive for college-level qualifications but not blocked. For practical purposes: all three Lithuanian nursing qualifications can lead to German employment. The German B2 language requirement is the same for all three. VU's advantage is real but not absolute — LSMU and SMK graduates are not disadvantaged in Germany, they just face slightly more administrative effort in the recognition process.",
      },
      {
        question: "Can a SMK or LSMU nursing graduate later upgrade to a VU Master's degree?",
        answer:
          "Yes — this is Pathway 6 (VU Supplementary Studies) and Pathway 4 (Professional Bachelor to VU BSc entry). SMK Professional Bachelor graduates can access VU's Supplementary Studies programme, which brings their Professional Bachelor competencies to university BSc standard, enabling enrolment in VU's MSc in Advanced Practice Nursing. LSMU BSc graduates can directly apply to VU's MSc — their university BSc is equivalent to VU's BSc at postgraduate entry level. The strategic combination of SMK (3.5 years, EUR 4,400/year, IELTS 5.5) + VU Supplementary Studies + VU MSc achieves a master-level qualification from Lithuania's #1 ranked university at total lower cost than doing VU BSc + VU MSc directly. Students Traffic can model the complete timeline and cost comparison for families evaluating this multi-step strategy.",
      },
    ],
  },
  {
    label: "Parent Questions",
    slug: "parents",
    faqs: [
      {
        question: "As a parent, how confident should I be about sending my child to Vilnius University for nursing?",
        answer:
          "Highly confident — with proper preparation. Vilnius University is Lithuania's oldest (1579) and highest-ranked (QS #446, 2026) public university and a member of the Arqus European University Alliance. It is not a commercial recruitment-driven institution — it is a 446-year-old academic institution with the same standing in Europe as established public universities in Eastern and Central Europe. The nursing programme is housed in the Faculty of Medicine, delivered by full-time academic faculty, with clinical training at VU's own teaching hospital Santaros Klinikos. Lithuania is an EU and NATO member state with stable governance, a very low crime rate, and European safety standards. The currency is the Euro. Indian students studying at Vilnius University — including female students — consistently report feeling safe and well-supported. Students Traffic has student and parent contacts in Vilnius for direct reference conversations before enrolment.",
      },
      {
        question: "My child has never lived abroad. Will they cope with studying in English in Lithuania?",
        answer:
          "VU's nursing programme is 100% English-taught — your child will not need to learn Lithuanian to study or complete clinical placements (nursing instructions, patient communication, and examinations are all in English). IELTS 6.5+ at admission ensures a solid English baseline. The international student community (750+ new students from 90+ countries annually at VU) means your child will always have English-speaking peers, classmates, and support around them. VU's International Office runs orientation programmes, academic support services, and peer mentoring for international students. The Faculty of Medicine has dedicated staff supporting international nursing students. Students Traffic provides pre-departure briefings and connects all enrolled students with Indian students already at VU who can guide them on the first weeks of life in Vilnius. First-year adjustment is normal and expected — it is not unique to Lithuania or VU.",
      },
      {
        question: "Is the VU nursing degree really recognised in Germany and the UK — or is this just marketing?",
        answer:
          "It is factually verified, not marketing. EU Directive 2005/36/EC mandates that all EU member states automatically recognise professional nursing qualifications that meet the directive's standards — including those from Lithuanian universities like VU. This is enforceable EU law. German healthcare associations (Bundesagentur fur Arbeit, Diakonie, DKG) actively recruit nurses from Lithuania, Poland, Czech Republic, and other EU member states using this directive as the legal basis. The NMC (UK's nursing regulator) has an established international route for EU-educated nurses — VU graduates have used this route. These are not promises — they are documented, established regulatory pathways with published requirements. What Students Traffic will always tell you honestly: the pathway is real and accessible, but it requires individual action from your child (German B2 language, UK IELTS 7.0, active job applications) — it is not automatic just by graduating.",
      },
      {
        question: "How will my child manage money in Lithuania and is EUR 6,000/year tuition the only expense?",
        answer:
          "No — tuition is one of several costs. Full year cost breakdown: Tuition EUR 6,000 + Dormitory EUR 840–2,160 + Food EUR 1,800–3,360 + Transport EUR 240–360 + Health insurance EUR 300–660 + Phone EUR 240–480 + Miscellaneous EUR 600–1,200 = Total approximately EUR 10,020–14,220/year (INR 9–12.8 lakhs/year). One-time first year setup: Winter clothing EUR 300–500. Visa/TRP: EUR 120/year. The good news: your child can work part-time (20 hours/week) in Vilnius generating EUR 450–490/month gross — covering EUR 5,400–5,880/year toward living costs. Over 4 years, consistent part-time work can offset EUR 20,000+ of total costs. Students Traffic provides families with a year-by-year budget model and connects students with part-time job guidance in Vilnius during pre-departure briefing. Students Traffic recommends that families prepare year-by-year rather than trying to fund all 4 years upfront.",
      },
      {
        question: "What happens if my child wants to return to India after graduation — is the VU nursing degree valid in India?",
        answer:
          "Yes. Indian students who return to India after graduating from VU can practise nursing in India by submitting the VU EU university degree to the Indian Nursing Council (INC) for verification and endorsement. The INC process for foreign-educated nurses typically involves submitting original degree certificates, transcripts, and a statement of equivalency request. VU's QS #446 ranking, EU university status, and 240 ECTS BSc makes it one of the strongest international nursing credentials for return applicants. Indian private hospitals (Fortis, Apollo, Narayana Health, Max Healthcare) actively recruit internationally educated nurses with EU degrees for specialty nursing positions. However, the primary value proposition of studying at VU is the EU, German, and UK career pathways — returning to India to work in nursing typically means starting at government hospital salaries, which are lower than Lithuanian nursing salaries. Students Traffic is transparent about this: VU is primarily a gateway to European nursing careers, not an Indian nursing career upgrade.",
      },
    ],
  },
];

const universityFaqSectionsMap: Record<string, FaqSection[]> = {
  "european-university-of-tirana-bscn": uetAlbaniaFaqSections,
  "western-balkans-university-bscn": wbuAlbaniaFaqSections,
  "mediterranean-university-of-albania": muaAlbaniaFaqSections,
  "lithuanian-university-of-health-sciences-bscn": lsmuLithuaniaFaqSections,
  "smk-college-applied-sciences-bscn": smkLithuaniaFaqSections,
  "vilnius-university-bscn": vuLithuaniaFaqSections,
};

export function getUniversityFaqSections(universitySlug: string): FaqSection[] | null {
  return universityFaqSectionsMap[universitySlug] ?? null;
}
