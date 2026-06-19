/**
 * Seed HAW Hamburg — BSc Nursing (Cooperative/Dual Degree), Germany.
 * Source: Students Traffic HAW Hamburg Nursing Complete Guide, June 2026.
 * Run: node scripts/seed-haw-hamburg-bscn.mjs
 *
 * Prerequisites: Germany must already exist in the countries table.
 * Run seed-germany-bscn.mjs first if it hasn't been run.
 *
 * This script:
 *   1. Looks up Germany from the countries table
 *   2. Upserts HAW Hamburg into the universities table
 *   3. Upserts the BSc Nursing (Cooperative) programme offering (course ID 15)
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
  slug: "haw-hamburg-bscn",
  name: "Hamburg University of Applied Sciences (HAW Hamburg) — BSc Nursing (Cooperative/Dual Degree)",
  city: "Hamburg",
  type: "Public",
  establishedYear: 1970,
  officialWebsite: "https://www.haw-hamburg.de",
  summary:
    "Hamburg University of Applied Sciences (HAW Hamburg) — Hochschule für Angewandte Wissenschaften Hamburg — is a public Fachhochschule (university of applied sciences) founded in 1970, with over 16,000 students across 9 faculties and 4 campuses in Hamburg. The BSc Nursing (Cooperative/Dual Degree) is the flagship programme of the Department of Nursing and Management (Faculty of Business and Social Sciences), delivered at the Berliner Tor Campus in central Hamburg. It is a 7-semester (3.5-year) cooperative (kooperativer Studiengang) programme: students simultaneously hold a university enrolment at HAW Hamburg AND a training contract (Ausbildungsvertrag) with one of 7 partner hospitals or care institutions. The result is two qualifications at graduation — a Bachelor of Science (B.Sc.) AND a state nursing licence (Berufserlaubnis als Pflegefachkraft) — authorising direct practice as a registered nurse across Germany, Austria, Switzerland, and all 27 EU member states without any further recognition process. Annual tuition is EUR 0 (zero) under German public university policy; students pay only the EUR 397/semester contribution that includes the HVV Hamburg public transport pass. Germany requires 150,000+ additional nurses by 2028 (shortage projected to reach 500,000 by 2030), and over 16,600 Indian nurses are already employed in Germany — making this the highest-ROI nursing degree for Indian families: a 3.5-year total cost of approximately INR 47–61 lakh (living costs only) versus INR 1.3–1.6 crore for an equivalent degree in Canada. HAW Hamburg is accredited under the German Nursing Act (Pflegeberufegesetz, PflBG 2020) and its nursing licence is state-regulated and legally recognised across Germany and the EU. Prerequisite: German language at C1 level (Goethe C1 or TestDaF TDN 4) plus APS Certificate and VPD from uni-assist.",
  campusLifestyle:
    "The Department of Nursing and Management is based at the Berliner Tor Campus (Alexanderstrasse 1, 20099 Hamburg) — a central city campus directly connected by U-Bahn, S-Bahn, and bus. From campus, Hamburg Hauptbahnhof (main station) is 5–10 minutes by U-Bahn. HAW Hamburg enrolls over 16,000 students including 2,500+ international students from 100+ countries; the nursing and management department has 400+ students, creating a small-cohort environment with close professor and clinical supervisor contact. The campus operates a dedicated nursing Skills Lab where students practise patient-care procedures — basic nursing techniques, medication administration, wound care, patient positioning, and clinical communication with simulated patients — before entering real hospital settings. HAW Hamburg's weBuddy programme pairs incoming international students with German student buddies for integration support. The university library, Moodle learning management system, student union (AStA), counselling services, career centre, and sports facilities are all available. The EUR 397/semester contribution includes the HVV semester ticket — unlimited Hamburg public transport on U-Bahn, S-Bahn, bus, and ferry across the Hamburg Metropolitan Area plus Germany-wide regional rail (Deutschlandticket) for the entire semester.",
  cityProfile:
    "Hamburg is Germany's second-largest city (population 1.9 million) and Europe's second-largest port — a cosmopolitan metropolis with over 50,000 Indian residents as of 2025. For Indian nursing students, Hamburg is one of the most welcoming German cities: Indian restaurants (predominantly North Indian, South Indian, and Indo-Chinese) in Altona, St. Georg, Wandsbek, and the city centre; South Asian grocery stores stocking basmati rice, dal, paneer, spices, and Indian cooking essentials in Wandsbek and Altona Markt; a functioning Hindu temple and Sikh gurdwara; and active Indian student associations at HAW Hamburg and the University of Hamburg (45,000+ students). The HAW Hamburg Mensa offers vegetarian options at EUR 2.50–5 per meal. Hamburg's healthcare sector employs over 100,000 professionals — graduates enter one of Germany's most dynamic nursing job markets immediately after the 18-month post-study work permit begins. Clinical placement partners include Universitätsklinikum Hamburg-Eppendorf (UKE), one of Germany's top 5 university hospitals (14,000 employees, 1,500 beds), which also starts nurse salaries at EUR 3,200+/month. Monthly student living costs: EUR 1,000–1,300 depending on accommodation. Hamburg climate: oceanic, similar to coastal UK. Winters are cold (−2 to 7°C December–February) with frequent rain and occasional snow — budget INR 30,000–50,000 for initial winter wardrobe. Summers are pleasant (15–23°C). Daylight hours vary dramatically: 17+ hours in June, 7 hours in December — adjust expectations accordingly.",
  clinicalExposure:
    "The HAW Hamburg cooperative nursing programme currently partners with 7 healthcare institutions in Hamburg for clinical training — among the most respected hospitals and care organisations in northern Germany. Clinical partners include: Universitätsklinikum Hamburg-Eppendorf (UKE, one of Germany's top 5 university hospitals, 14,000 employees, 1,500 beds, world-class research); Albertinen-Diakoniewerk eV Hamburg (major faith-based healthcare network with hospitals, elderly care, and social services — a large employer of nursing graduates); Altonaer Kinderkrankenhaus Hamburg (children's hospital, paediatric nursing specialisation, one of northern Germany's leading paediatric facilities); and 4 additional Hamburg hospital and care partners. The 7-semester programme is structured under the German Nursing Act (PflBG 2020) to cover all three mandated clinical settings: (1) Inpatient care (stationäre Pflege) — hospitals including medical, surgical, emergency, ICU, and specialised wards; (2) Long-term care (stationäre Altenpflege) — nursing homes and residential care for elderly patients; (3) Outpatient care (ambulante Pflege) — community nursing services, home care, and day care centres. This three-setting structure ensures HAW Hamburg graduates are qualified and licensed to work across ALL nursing contexts in Germany — not just hospital nursing. At several partner hospitals, students receive a training stipend (Ausbildungsvergütung) of EUR 400–800/month during practical phases — partially offsetting living costs. The Skills Lab at Berliner Tor campus provides pre-clinical simulation and practise before hospital entry.",
  hostelOverview:
    "Hamburg has a competitive housing market — begin searching immediately upon receiving an admission confirmation, ideally 3–4 months before the October start. Accommodation options: (1) Studierendenwerk Hamburg dormitories (Studentenwohnheim): EUR 250–400/month — best value, includes communal utilities, but limited availability. Apply online at studierendenwerk-hamburg.de as early as possible — dorm places fill months before semester start. (2) Wohngemeinschaft (WG — shared apartment): EUR 400–650/month per room — the most popular student option. Find via WG-Gesucht.de, Immoscout24.de, or university notice boards. Hamburg WG culture is well-established; Indian students regularly find shared apartments in Wandsbek, Altona, Barmbek, and Eimsbüttel. (3) Private studio apartments: EUR 700–1,100/month — most expensive, typically not necessary for students. The HAW Hamburg Berliner Tor campus is centrally located with U-Bahn, S-Bahn, and bus access — transport to any part of Hamburg is fully covered by the semester ticket included in the EUR 397 contribution. Students Traffic provides Hamburg accommodation guidance and pre-arrival connection with existing Indian students.",
  indianFoodSupport:
    "Hamburg has one of the most established Indian communities of any German city — 50,000+ Indian residents and growing. Indian restaurants serving North Indian, South Indian, and Indo-Chinese cuisine are located across Altona, St. Georg, Wandsbek, and the city centre. South Asian grocery stores in Wandsbek and Altona Markt area carry basmati rice, dal, paneer, Indian spices, frozen Indian vegetables, ready-made curries, and Indian snacks. A Hindu temple and Sikh gurdwara serve the Indian and South Asian community. Indian festivals including Diwali, Holi, and cultural events are celebrated by the Indian and South Asian community in Hamburg. Many Indian students cook at home — pressure cookers, Indian cookware, and essential spices are all available in Hamburg. The HAW Hamburg Mensa (student cafeteria) offers vegetarian options at EUR 2.50–5 per meal. Active Indian student associations at HAW Hamburg and the broader Hamburg university network provide peer support, shared knowledge of where to shop, and a welcoming community from day one.",
  safetyOverview:
    "Germany is consistently ranked among the safest countries in the world, and Hamburg is a major European city with low violent crime rates. Indian students — including female students — have lived and studied in Hamburg for decades without major safety incidents. The Hamburg police maintain a visible presence. Standard urban precautions apply (stay aware in crowded public areas, use reputable transport at night), but no exceptional safety concerns have been reported for international nursing students. HAW Hamburg provides dedicated international student support services, mental health and counselling, and academic advising. The large international student community (2,500+ at HAW Hamburg, 45,000+ at the University of Hamburg) means Indian students are not isolated. Germany has full constitutional protection of freedom of religion — all religions are freely practised with mosques, temples, gurdwaras, churches, and synagogues across Hamburg.",
  studentSupport:
    "HAW Hamburg provides: International Office (visa guidance, accommodation, administrative registration), weBuddy programme (German student buddy for incoming international students), student union AStA (events, clubs, cultural activities), mental health and counselling services, career centre, and academic advising. The myHAW portal (myhaw.haw-hamburg.de) manages all applications and enrolment communications. HAW Hamburg's Department of Nursing and Management maintains small class sizes (relative to the 60-seat intake), enabling direct student-professor contact. Students Traffic provides end-to-end support: eligibility assessment across all 6 entry pathways, German language preparation guidance and partner network, APS Certificate application management, uni-assist VPD application and document preparation, HAW Hamburg partner hospital application strategy and interview preparation (in German), myHAW online application submission and document verification, blocked account (Sperrkonto) setup guidance, German national visa document preparation and VFS Global appointment coordination, pre-departure orientation (Hamburg life, climate, Indian community, arrival checklist), and post-arrival support (Ausländerbehörde, health insurance, banking).",
  whyChoose: [
    "Zero tuition fees — HAW Hamburg charges EUR 0 in tuition as a Hamburg public university. Indian students pay only the EUR 397/semester contribution (includes unlimited Hamburg public transport). Total 3.5-year cost: INR 47–61 lakh (living costs only) — compared to INR 1.3–1.6 crore for an equivalent Canadian nursing degree. The saving is over INR 80 lakh.",
    "Double qualification at graduation — you receive BOTH a Bachelor of Science (B.Sc.) AND a state nursing licence (Berufserlaubnis als Pflegefachkraft) that authorises immediate employment as a registered nurse across Germany, Austria, Switzerland, and all 27 EU member states. No further Berufsanerkennung (recognition process) required — you ARE a German-qualified nurse from Day 1.",
    "Earn while you study — the cooperative structure means at several HAW Hamburg partner hospitals, students receive a training stipend (Ausbildungsvergütung) of EUR 400–800/month during practical phases. Combined with student work rights of 140 full days/year (approx. 20 hrs/week at EUR 13.90/hour minimum wage), students can generate EUR 800–1,100/month supplementary income.",
    "Clinical training at Germany's top hospitals — partner institutions include UKE (Universitätsklinikum Hamburg-Eppendorf, one of Germany's top 5 university hospitals with 14,000 employees and 1,500 beds), Albertinen-Diakoniewerk, and Altonaer Kinderkrankenhaus. Graduates enter the Hamburg healthcare job market — 100,000+ healthcare professionals employed — with direct experience at the country's most respected institutions.",
    "18-month post-study work permit — among the most generous globally. Unlimited work rights for 18 months after graduation. Since you hold a German nursing licence, you can start nursing work immediately after graduation. Most HAW Hamburg nursing graduates have a job offer within weeks of graduation due to Germany's acute nursing shortage.",
    "Permanent residency in 21–27 months — as a shortage occupation, nursing qualifies for the EU Blue Card pathway. With B1 German and 21 months of qualifying employment, graduates become eligible for the Niederlassungserlaubnis (permanent residence permit). Germany's PR timeline is among the fastest in the developed world for healthcare professionals.",
    "Germany's structural nursing shortage creates guaranteed career security — 150,000+ additional nurses needed by 2028, 500,000 by 2030. Entry-level nurse salary: EUR 2,800–3,800/month gross (INR 3.14–4.26 lakh/month) — 10–15x higher than Indian hospital salaries. Hamburg hospitals (especially UKE) pay EUR 300–500/month above the national average.",
  ],
  thingsToConsider: [
    "German language at C1 is the most critical prerequisite — and the most time-consuming. Starting from zero German, the typical timeline to C1 is 24–30 months of structured study. Begin German language classes at the Goethe-Institut India at least 18–24 months before your target October intake. Without C1, admission is impossible — hospital interviews, university lectures, clinical documentation, and patient communication are all in German.",
    "TWO-TRACK application — you must secure a training contract (Ausbildungsvertrag) with one of HAW Hamburg's partner hospitals BEFORE applying to the university. The hospital conducts its own selection process (interview in German). Students who apply to the university first without a training contract will not be admitted. This is the step most Indian students miss.",
    "Only 60 seats per year — highly competitive for a city of Hamburg's size. Selection uses a points system evaluating GPA, completed internships/clinical experience, additional language skills, and prior university studies. Combined with the training contract barrier, competitive applicants need strong academic records and genuine nursing motivation.",
    "October intake only (Winter Semester) — there is NO spring or summer intake. Applications are accepted June 1 – July 31 only. Missing the application window means waiting a full year. Begin the 18-month German language preparation, APS Certificate, and hospital contact process well in advance.",
    "APS Certificate is mandatory for all Indian students — required for German university admission AND for the student visa. Apply at least 6–8 months before the application deadline. APS India does NOT process nursing degrees obtained by distance education in India. Standard in-person Class 12 (from a recognised board) is eligible.",
    "Hamburg is Germany's 7th most expensive city — realistic student budget is EUR 1,000–1,300/month. The blocked account (Sperrkonto) of EUR 11,904 must be deposited before the student visa appointment (this is your own money, returned at EUR 992/month after arrival — not a cost). Factor this into Year 1 financial planning.",
  ],
  bestFitFor: [
    "Indian Class 12 students (CBSE, ICSE, or recognised State Board) with Physics, Chemistry, Biology, and English who are willing to commit 18–24 months to German language preparation (A1 to C1) before their target October intake — and who are genuinely motivated by a nursing career in Germany.",
    "Students and families seeking zero-tuition European nursing education — the most financially efficient pathway to German nursing registration. HAW Hamburg is the only top nursing destination where Indian students pay zero tuition, and Hamburg's career infrastructure ensures fast post-graduation employment.",
    "Students targeting permanent residency in Germany within 4–5 years of arriving — the HAW Hamburg BSc (3.5 years) plus 21–27 months of qualified employment as a nurse gives the fastest possible PR timeline under the EU Blue Card shortage occupation route.",
    "Indian BSc Nursing graduates (4-year programme from a recognised university) with at least one year of professional experience who want an EU-recognised Master's degree — the MSc Nursing at HAW Hamburg (4 semesters, 2 years, EUR 0 tuition, German C1 required) is the direct upgrade pathway.",
    "Indian GNM nursing professionals and healthcare workers (ANM, paramedics) with 3+ years of work experience who are eligible for the Section 38 Hamburg Higher Education Act (Berufstätigen-Route) — allowing university entry without a standard Abitur/Fachhochschulreife.",
  ],
  teachingHospitals: [
    "Universitätsklinikum Hamburg-Eppendorf (UKE) — one of Germany's top 5 university hospitals, 14,000 employees, 1,500 beds, world-class research and clinical care. Nursing salaries start at EUR 3,200+/month.",
    "Albertinen-Diakoniewerk eV Hamburg — major faith-based healthcare network, hospitals, elderly care, and social services across Hamburg. Large employer of HAW Hamburg nursing graduates.",
    "Altonaer Kinderkrankenhaus Hamburg — children's hospital, paediatric nursing specialisation, one of northern Germany's leading paediatric care facilities.",
    "Additional HAW Hamburg partner hospitals and care institutions (7 partners total) — inpatient, long-term, and outpatient settings across Hamburg.",
  ],
  recognitionBadges: [
    "German State-Accredited — Fachhochschule, Freie und Hansestadt Hamburg",
    "Pflegeberufegesetz (PflBG 2020) Compliant — Federal German Nursing Act",
    "Double Qualification: BSc + Berufserlaubnis als Pflegefachkraft (State Nursing Licence)",
    "EU Directive 2005/36/EC — Automatic Professional Recognition Across 27 EU Member States",
    "EU Blue Card Eligible — Nursing Shortage Occupation (lower salary threshold applies)",
    "18-Month Post-Study Work Permit — Job Seeker Residence Permit (Section 20 AufenthG)",
    "TVöD-P Collective Bargaining — Structured Annual Salary Increases in Public Hospitals",
  ],
  recognitionLinks: [
    {
      label: "HAW Hamburg Official Website",
      url: "https://www.haw-hamburg.de",
    },
    {
      label: "myHAW Application Portal",
      url: "https://myhaw.haw-hamburg.de",
    },
    {
      label: "Department of Nursing and Management — HAW Hamburg",
      url: "https://www.haw-hamburg.de/en/faculties-and-departments/business-and-social-sciences/about-us/departments/nursing-and-management/",
    },
    {
      label: "uni-assist — VPD Application for HAW Hamburg",
      url: "https://www.uni-assist.de",
    },
    {
      label: "APS India — Academic Evaluation Centre (German Embassy New Delhi)",
      url: "https://www.aps.org.in",
    },
  ],
  similarUniversitySlugs: [
    "vilnius-university-bscn",
    "lithuanian-university-of-health-sciences-bscn",
  ],
  lastVerifiedAt: "2026-06-19",
  researchSources: [
    {
      label: "HAW Hamburg Official Website — haw-hamburg.de",
      url: "https://www.haw-hamburg.de",
      kind: "official-university",
      checkedAt: "2026-06-19",
    },
    {
      label: "myHAW Application Portal — myhaw.haw-hamburg.de",
      url: "https://myhaw.haw-hamburg.de",
      kind: "official-program",
      checkedAt: "2026-06-19",
    },
    {
      label: "uni-assist — Preliminary Review Documentation (VPD)",
      url: "https://www.uni-assist.de",
      kind: "government",
      checkedAt: "2026-06-19",
    },
    {
      label: "APS India — German Embassy Academic Evaluation Centre",
      url: "https://www.aps.org.in",
      kind: "government",
      checkedAt: "2026-06-19",
    },
    {
      label: "Students Traffic HAW Hamburg Nursing Complete Guide — June 2026",
      url: "https://studentstraffic.com",
      kind: "other",
      checkedAt: "2026-06-19",
    },
  ],
  faq: [
    {
      question: "Is HAW Hamburg a government university?",
      answer:
        "Yes. Hamburg University of Applied Sciences (HAW Hamburg) is a public state university of applied sciences (Fachhochschule) funded by the Hamburg city-state (Freie und Hansestadt Hamburg). This is why tuition fees are EUR 0 for all students including international students from India. Students pay only the EUR 397/semester contribution (includes unlimited Hamburg public transport).",
    },
    {
      question: "What does 'cooperative degree' mean in the HAW Hamburg nursing programme?",
      answer:
        "The HAW Hamburg BSc Nursing is a kooperativer Studiengang (cooperative degree) — you simultaneously hold TWO contracts: a university enrolment at HAW Hamburg AND a training contract (Ausbildungsvertrag) with a partner hospital. You study academic nursing theory at HAW Hamburg AND complete vocational nursing training at the hospital. At graduation you receive BOTH a BSc degree AND a state nursing licence (Berufserlaubnis als Pflegefachkraft) — not just one or the other.",
    },
    {
      question: "How many seats are available in the nursing programme?",
      answer:
        "60 seats per year in the BSc Nursing cooperative programme. This is a small, competitive intake. Securing a training contract with a partner hospital is the critical first gate — without it, admission is not possible regardless of academic grades.",
    },
    {
      question: "Is there a summer intake for nursing at HAW Hamburg?",
      answer:
        "No. The BSc Nursing cooperative programme has ONLY a Winter Semester intake (October 1 start). Applications are accepted June 1 – July 31 only. There is no spring or summer intake.",
    },
    {
      question: "Why is C1 German required rather than a lower level?",
      answer:
        "C1 is required because: (1) University lectures, textbooks, nursing research, and assessments are at academic German level; (2) Patient communication in hospitals requires nuanced language; (3) Clinical documentation — nursing notes, patient records, ward handover reports — is produced in formal German; (4) The hospital selection interview is conducted in German. B2 is the minimum for clinical practice, but C1 is mandatory for university admission and academic success.",
    },
    {
      question: "How long does it take to learn German to C1 from zero?",
      answer:
        "Typically 24–30 months of structured study at a regular pace (3–5 hours/week of classes plus daily independent practice). Intensive study (4–5 hours/day) can achieve C1 in 18 months. The Goethe-Institut India offers a clear structured pathway from A1 through C1 with branches in New Delhi, Mumbai, Chennai, Kolkata, Pune, and Bangalore. Begin at least 18–24 months before your target October intake.",
    },
    {
      question: "What is the APS Certificate and why is it required?",
      answer:
        "The APS Certificate (Akademische Prüfstelle — Academic Evaluation Centre) is a mandatory document for ALL Indian students applying to German universities and for the German student visa. It is issued by the APS India office at the German Embassy in New Delhi. APS verifies that your Indian academic documents are genuine and meet German university standards. Fee: INR 18,000 (non-refundable). Processing time: 4–8 weeks. Validity: permanent (no expiry).",
    },
    {
      question: "What is the VPD from uni-assist?",
      answer:
        "The VPD (Vorprüfungsdokumentation — Preliminary Review Documentation) is issued by uni-assist and confirms that your academic qualifications are equivalent to the German Fachhochschulreife, converting your GPA to the German grade scale. It is a mandatory component of the HAW Hamburg application. Fee: EUR 75 for the first programme + EUR 15 per additional programme at the same university. Processing time: 4–6 weeks. Submit your APS Certificate + school documents to uni-assist at least 4–6 weeks before the July 31 application deadline.",
    },
    {
      question: "How do I contact HAW Hamburg's partner hospitals for a training place?",
      answer:
        "Contact the three main partners directly: (1) Albertinen-Schule, Albertinen-Diakoniewerk eV Hamburg — training department (Ausbildungsabteilung); (2) Universitäre Bildungsakademie, Universitätsklinikum Hamburg-Eppendorf (UKE); (3) Altonaer Kinderkrankenhaus Hamburg — nursing training department. Additional partners also accept applications. The hospital interview is conducted in German — C1 (or minimum strong B2) proficiency is essential. Students Traffic guides applicants on approach, German-language application materials, and interview preparation.",
    },
    {
      question: "Do I get paid by the hospital during practical training?",
      answer:
        "At several (not all) HAW Hamburg partner hospitals, students receive a training stipend (Ausbildungsvergütung) during practical semesters. The amount is typically EUR 400–800/month depending on the partner hospital and semester — a useful supplement to living costs. Confirm the specific amount with the partner hospital during the application process.",
    },
    {
      question: "What is the blocked account (Sperrkonto) and is it a cost?",
      answer:
        "The blocked account is NOT a cost — it is your own money, held temporarily by a financial institution to prove to German authorities that you can support yourself for one year. You deposit EUR 11,904 (= EUR 992 × 12) before your visa appointment. After arriving in Germany and activating the account, EUR 992 is released to you every month automatically. Recommended providers: Expatrio (most popular, 1–3 business days to open online), Fintiba, Deutsche Bank, Commerzbank. Provider setup fee: EUR 49–99 one-time.",
    },
    {
      question: "What happens after graduating — how do I stay and work in Germany?",
      answer:
        "After completing the BSc Nursing, Indian graduates receive an 18-month Job Seeker Residence Permit (Section 20 AufenthG) with unlimited work rights. Since you hold a German nursing licence, you can begin nursing work immediately after graduation. Once you secure a nursing job offer with a salary of EUR 45,934.20+/year, apply for the EU Blue Card — the primary long-term work permit for shortage occupations. With B1 German and 21 months of qualifying employment, apply for permanent residency (Niederlassungserlaubnis). Most HAW Hamburg nursing graduates have a job offer within weeks of graduation.",
    },
    {
      question: "Is NEET required to study nursing at HAW Hamburg?",
      answer:
        "No. NEET is an Indian entrance examination for Indian medical and nursing programmes. It has no relevance to German university admissions. HAW Hamburg does not require NEET, SAT, ACT, or any other standardised entrance exam. Admission is based on Class 12 academic record, German C1 certificate, APS Certificate, VPD from uni-assist, and training contract with a partner hospital.",
    },
    {
      question: "Can I work part-time during my studies?",
      answer:
        "Yes. As a student in Germany, you are permitted to work up to 140 full days or 280 half-days per year (approximately 20 hours/week during semester, full-time during holidays). At Germany's minimum wage of EUR 13.90/hour (2026), 15–20 hours/week provides EUR 800–1,100/month supplementary income — enough to cover a significant portion of living costs in Hamburg.",
    },
    {
      question: "What is the salary of a nurse in Germany after graduating from HAW Hamburg?",
      answer:
        "Entry-level registered nurse (0–2 years): EUR 2,800–3,200/month gross (approx. INR 3.14–3.58 lakh/month). Hamburg hospitals — especially UKE — typically pay EUR 300–500/month above the national average, so entry-level at UKE starts at EUR 3,200+/month. Mid-career (3–7 years): EUR 3,200–4,000/month. Senior specialist (7+ years): EUR 4,000–5,000/month. ICU/intensive care: EUR 3,800–5,500/month. German nurses are covered by the TVöD-P collective bargaining agreement guaranteeing structured annual pay increases. Net take-home after taxes: approximately EUR 1,900–2,800/month.",
    },
    {
      question: "Can HAW Hamburg nursing graduates work in other countries (UK, Canada, Australia)?",
      answer:
        "Yes. A German BSc Nursing degree plus EU nursing licence is a strong international credential. For the UK: the NMC has a specific recognition route for EU-qualified nurses. For Canada: credential evaluation plus provincial nursing licensing (NCLEX-RN) is required. For Australia: AHPRA has an international nurses pathway. For all EU countries: EU Directive 2005/36/EC automatic recognition. A German nursing degree provides a stronger foundation than most other international qualifications.",
    },
  ],
  admissionsContent: {
    overview:
      "HAW Hamburg BSc Nursing has a TWO-TRACK application process — unlike Canadian or UK nursing applications, you MUST secure a training contract with a HAW Hamburg partner hospital BEFORE applying to the university. The hospital selection and university application happen in parallel; neither can be completed without the other. The application window is June 1 – July 31 (Winter Semester intake, October 1 start). HAW Hamburg uses a points system for selection: GPA, completed internships/clinical experience, additional language skills, and prior university studies. The application portal is myHAW (myhaw.haw-hamburg.de). No paper documents are accepted — all documents go online via the portal. Students Traffic manages the complete application process including hospital contact strategy, German-language application materials, hospital interview preparation, myHAW portal submission, and German student visa coordination.",
    eligibility: {
      intro:
        "Entry requirements for Indian students applying to the HAW Hamburg BSc Nursing cooperative programme:",
      items: [
        "Class 10+2 (CBSE, CISCE, or recognised State Board) with Physics, Chemistry, Biology, and English — equivalent to German Fachhochschulreife. No fixed national minimum percentage; HAW Hamburg uses a points system (higher marks = more points = better chance).",
        "APS Certificate from APS India (German Embassy New Delhi) — mandatory for all Indian applicants. Fee: INR 18,000. Apply at least 6–8 months before the July 31 application deadline.",
        "VPD (Vorprüfungsdokumentation) from uni-assist — confirms your Class 12 is equivalent to German Fachhochschulreife. Submit application to uni-assist at least 4–6 weeks before July 31 deadline. Fee: EUR 75.",
        "German language certificate at C1 level — accepted tests: Goethe-Zertifikat C1, TestDaF TDN 4 (all 4 sections), TELC Deutsch C1 Hochschule, DSH (completed in Germany). IELTS/TOEFL are NOT required or relevant.",
        "Training contract (Ausbildungsvertrag) or binding commitment letter from one of HAW Hamburg's partner hospitals — this is STEP 1, not an afterthought. Contact partner hospitals directly from January/February onwards.",
        "All documents uploaded online via myHAW portal — no paper submissions accepted.",
      ],
    },
    admissionSteps: [
      "Begin German language preparation (18–24 months before target intake) — enrol at Goethe-Institut India at A1 level. This step MUST begin before all other application steps. Without C1, admission is impossible.",
      "Apply for APS Certificate (at least 6–8 months before July 31 application deadline) — register at APS India portal (German Embassy New Delhi), prepare Class 10 and 12 documents in A4 colour photocopy format (both sides), pay INR 18,000, attend APS interview if required. Allow 4–8 weeks.",
      "Obtain VPD from uni-assist (at least 4–6 weeks before July 31) — register at uni-assist.de, search 'Hochschule für Angewandte Wissenschaften Hamburg', upload APS Certificate and school documents with certified translations. Fee EUR 75. Aim for June 1 submission to allow processing time.",
      "Achieve C1 German certificate (before application period) — sit Goethe C1 or TestDaF at a test centre in India (Goethe C1 available across multiple cities; TestDaF in Mumbai, New Delhi, Chennai, Hyderabad, Kolkata, Pune). Aim to have C1 certificate in hand before June 1.",
      "Contact HAW Hamburg partner hospitals and apply for a training place (from January/February onwards) — apply DIRECTLY to Albertinen-Schule (Albertinen-Diakoniewerk), Universitäre Bildungsakademie (UKE), Altonaer Kinderkrankenhaus, and other partners. Each hospital has its own selection process and German-language interview. Obtain a written training contract or binding commitment letter.",
      "Apply via myHAW portal (June 1 – July 31) — upload APS Certificate, VPD, German C1 certificate, training contract or commitment letter, and Class 10 and 12 documents (certified copies). Receive application reference number.",
      "Admission decision (typically August) — HAW Hamburg selection committee evaluates using points system. Conditional and final admission offers issued after the application window closes.",
      "Enrol at HAW Hamburg — pay EUR 397 semester contribution after receiving admission offer. Both training contract AND enrolment must be completed for the programme to proceed.",
      "Apply for German National Visa (Type D) — apply at the German Embassy/Consulate in India via VFS Global with: admission confirmation, training contract, APS Certificate, VPD, German C1 certificate, blocked account confirmation (EUR 11,904), health insurance proof, Class 10 and 12 originals. Processing: 6–12 weeks. WARNING: Since July 1, 2025, India has abolished the Widerspruch (remonstration) process for visa rejections — you have ONE attempt. A well-prepared first application is critical.",
      "Arrive in Hamburg and begin programme (October 1) — register at Bürgeramt within 2 weeks, enrol in statutory health insurance (GKV: TK, AOK, Barmer — EUR 110–120/month), activate blocked account (EUR 992/month begins releasing), apply for student residence permit (Aufenthaltserlaubnis) at Ausländerbehörde Hamburg within 90 days, open German bank account (DKB, N26, Sparkasse, Deutsche Bank).",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet and certificate — certified true copy + authorised translation if not in English/German",
        "Class 12 marksheet and certificate with PCB and English — certified true copy",
        "APS Certificate from APS India (German Embassy New Delhi) — original or certified copy",
        "VPD (Vorprüfungsdokumentation) from uni-assist — uploaded to myHAW portal",
        "German C1 language certificate — Goethe-Zertifikat C1 or TestDaF TDN 4 (all 4 sections)",
        "Training contract (Ausbildungsvertrag) or binding commitment letter from HAW Hamburg partner hospital",
        "Curriculum vitae in German and English",
      ],
      visa: [
        "Valid national passport (validity well beyond programme end + 6 months)",
        "Completed German national visa application form (from VFS Global)",
        "2 recent biometric passport photographs",
        "HAW Hamburg admission confirmation (Zulassungsbescheid) or enrolment letter",
        "Training contract with HAW Hamburg partner hospital",
        "APS Certificate (original or certified copy)",
        "VPD from uni-assist",
        "German C1 language certificate",
        "Blocked account (Sperrkonto) confirmation certificate — EUR 11,904 deposited at Expatrio, Fintiba, Deutsche Bank, or Commerzbank",
        "Proof of health insurance for duration of stay (German GKV or recognised private insurer)",
        "Class 10 and 12 originals and certified copies",
        "Cover letter explaining study plans",
        "Proof of accommodation in Hamburg (if available at time of application)",
        "EUR 75 visa fee (approximately INR 8,400)",
      ],
    },
    deadlinesNote:
      "Application window: June 1 – July 31 for the Winter Semester (October 1 start) — one intake per year only. The VPD from uni-assist should be submitted by June 1 to allow 4–6 weeks processing before the July 31 deadline. Book your VFS Global visa appointment as soon as the blocked account confirmation, APS Certificate, C1 certificate, and HAW Hamburg admission letter are all in hand — German embassy appointments in India can be 6–10 weeks out. Do NOT wait to collect all documents before booking.",
    scholarshipInfo:
      "HAW Hamburg participates in the national Deutschlandstipendium programme (EUR 300/month for 12 months, renewable) — awarded on academic merit and social criteria; apply after enrolment. DAAD Scholarships (Deutscher Akademischer Austauschdienst) offer several programmes relevant to Indian students at various study stages. HAW Hamburg internal merit and need-based support is available via the university's funding portal. At several cooperation hospital partners, students receive a training stipend of EUR 400–800/month during practical semesters — partially offsetting living costs. Student work rights (140 full days/year, approx. 20 hours/week at EUR 13.90/hour minimum) generate EUR 800–1,100/month supplementary income. Indian education loans (SBI, HDFC Credila, Axis Bank, ICICI Bank) are available — because tuition is EUR 0, total loan quantum for HAW Hamburg is significantly lower than for Canada, UK, or Australia.",
    licensingPathway: [
      "Graduate from HAW Hamburg BSc Nursing cooperative programme — receive BOTH BSc degree AND Berufserlaubnis als Pflegefachkraft (state nursing licence, equivalent to registered nurse status) simultaneously.",
      "The German nursing licence authorises immediate practise as a registered nurse across Germany, Austria, Switzerland, and all 27 EU member states under EU Directive 2005/36/EC. No Berufsanerkennung (recognition process) required — you trained and qualified IN Germany.",
      "Apply for the 18-month Job Seeker Residence Permit (Aufenthaltserlaubnis zur Arbeitsplatzsuche, Section 20 AufenthG) at the Ausländerbehörde Hamburg before your student permit expires. Begin nursing employment immediately — unlimited work rights during the 18 months.",
      "Once employed with salary EUR 45,934.20+/year: apply for EU Blue Card (lower threshold applies for nursing as a shortage occupation vs EUR 50,700 for standard occupations). EU Blue Card is the primary long-term work permit for skilled workers.",
      "After 21 months of qualifying employment + B1 German: apply for Niederlassungserlaubnis (permanent residency) under Section 18c AufenthG — the accelerated skilled worker route. After 27 months + A1 German: standard skilled worker route. After 5 years (any employment): standard route.",
      "Career growth: ICU/critical care specialisation (EUR 3,800–5,000/month); HAW Hamburg MSc Nursing (2 years, EUR 0 tuition) for research and advanced practice roles; HAW Hamburg MBA Social and Health Management for hospital/care facility management; Germany to Austria/Switzerland mobility (CHF 5,000–8,000/month).",
      "UK NMC: specific recognition route for EU-qualified nurses without NCLEX requirement. Canada: credential evaluation + NCLEX-RN + provincial registration. Australia: AHPRA international nurses pathway.",
    ],
  },
  programs: [
    {
      slug: "haw-hamburg-bscn-2026",
      title:
        "BSc Nursing — Cooperative/Dual Degree (B.Sc. Pflege, 7 Semesters) + State Nursing Licence — HAW Hamburg, Germany (Zero Tuition, October Start)",
      durationYears: 4,
      annualTuitionUsd: 0,
      totalTuitionUsd: 0,
      livingUsd: 14256,
      officialFeeCurrency: "EUR",
      officialAnnualTuitionAmount: 0,
      officialTotalTuitionAmount: 0,
      officialProgramUrl:
        "https://www.haw-hamburg.de/en/faculties-and-departments/business-and-social-sciences/about-us/departments/nursing-and-management/",
      medium: "German",
      published: true,
      intakeMonths: ["October"],
      feeVerifiedAt: "2026-06-19",
      fxRateDate: "2026-06-19",
      fxRateSourceUrl:
        "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
      feeNotes:
        "Tuition fee: EUR 0 (zero) — HAW Hamburg is a Hamburg public university; German state policy charges no tuition for most programmes regardless of nationality. Semester contribution (WS 2026/27): EUR 397/semester × 2 = EUR 794/year (× 3.5 years = EUR 2,779 total) — includes HVV Hamburg public transport semester ticket (unlimited U-Bahn, S-Bahn, bus, ferry across Hamburg + Germany-wide regional rail). Health insurance: EUR 110–120/month (mandatory GKV for all students). Living costs: EUR 1,000–1,300/month realistic student budget in Hamburg (accommodation EUR 250–650/month depending on dormitory vs shared apartment; groceries EUR 150–250/month; transport EUR 0 included in semester ticket; health insurance EUR 110–120/month; phone EUR 15–30/month; clothing/personal EUR 50–100/month; books EUR 20–40/month; leisure EUR 50–100/month). Annual living estimate EUR 13,200 (EUR 1,100/month average). USD conversion at EUR 1 = USD 1.08 (June 2026 ECB rate). One-time setup costs (not included in annual living): blocked account EUR 11,904 (YOUR money returned at EUR 992/month after arrival), visa fee EUR 75, APS fee INR 18,000, uni-assist VPD fee EUR 75, German language course INR 60,000–1,50,000, Goethe/TestDaF exam INR 12,000–18,000, flight INR 35,000–65,000, accommodation deposit EUR 600–1,000, winter clothing INR 30,000–50,000.",
      teachingPhases: [
        {
          phase: "Semester 1 — Foundations of Nursing Science",
          language: "German",
          details:
            "Foundations of nursing science; anatomy and physiology; nursing as a profession; patient communication. Practical: inpatient care — hospital ward introduction; basic patient care procedures; clinical observations. Skills Lab on-campus simulation before real patient contact. Introduction to German healthcare system (GKV, hospital structures, care legislation).",
        },
        {
          phase: "Semester 2 — Pathophysiology and Nursing Process",
          language: "German",
          details:
            "Pathophysiology; psychology and sociology for nursing; nursing process and documentation. Practical: long-term care settings (Pflegeheim); geriatric nursing fundamentals. Deepening of patient assessment and care planning skills in a residential care environment.",
        },
        {
          phase: "Semester 3 — Acute Clinical Care",
          language: "German",
          details:
            "Clinical nursing (acute care); pharmacology basics; wound care; infection prevention. Practical: acute hospital care; surgical and medical wards; clinical skills lab practice at HAW Hamburg. Students begin managing patient care procedures independently under supervision.",
        },
        {
          phase: "Semester 4 — Specialised Patient Groups",
          language: "German",
          details:
            "Nursing in specific patient groups — paediatrics, psychiatry, rehabilitation; evidence-based nursing. Practical: specialised settings including paediatrics (Altonaer Kinderkrankenhaus), psychiatry, and outpatient care services. Exposure to diverse nursing specialities.",
        },
        {
          phase: "Semester 5 — Research Methods and Health Policy",
          language: "German",
          details:
            "Nursing research methods; health policy and German healthcare system; legal and ethical frameworks. Practical: advanced clinical placements; leading patient care under supervision at HAW Hamburg partner hospitals including UKE. Students begin taking clinical leadership roles.",
        },
        {
          phase: "Semester 6 — Nursing Management and Leadership",
          language: "German",
          details:
            "Nursing management; quality assurance; nursing leadership; interdisciplinary teamwork; quality management (ISO standards, patient safety). Practical: complex care scenarios; management and leadership experience in clinical settings. Preparation for autonomous nursing practice.",
        },
        {
          phase: "Semester 7 — Advanced Research and State Examination",
          language: "German",
          details:
            "Advanced research seminar; nursing in specialised contexts; Bachelor thesis preparation and submission. Practical: final extended clinical placement; state nursing examination (Staatsexamen) preparation and completion. Graduation with BSc degree AND Berufserlaubnis als Pflegefachkraft (state nursing licence).",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1 (Semesters 1–2)",
          tuitionUsd: 0,
          hostelUsd: 3888,
          livingUsd: 10368,
          totalUsd: 14256,
          notes:
            "Tuition EUR 0. Semester contribution EUR 794 (2 × EUR 397, includes HVV transport pass — counted within living estimate). Accommodation EUR 300/month average (Studierendenwerk dorm EUR 250–400 or WG EUR 400–650; Year 1 dorm strongly recommended — apply immediately on admission). Food EUR 200/month (Aldi/Lidl/Netto + Mensa EUR 2.50–5/meal). Health insurance EUR 115/month (mandatory GKV). Phone EUR 20/month. Books EUR 30/month. Leisure EUR 75/month. Total monthly: ~EUR 1,100. Year 1 one-time setup costs (not in USD estimate above): winter clothing INR 30,000–50,000 + blocked account EUR 11,904 (YOUR money returned at EUR 992/month) + visa EUR 75 + APS INR 18,000 + VPD EUR 75 + language course INR 60,000–1,50,000 + flight INR 35,000–65,000 + accommodation deposit EUR 600–1,000.",
        },
        {
          yearLabel: "Year 2 (Semesters 3–4)",
          tuitionUsd: 0,
          hostelUsd: 3888,
          livingUsd: 10368,
          totalUsd: 14256,
          notes:
            "Tuition EUR 0. Semester contribution EUR 794. Same monthly living estimate EUR 1,100/month. Acute hospital placements begin — transport fully covered by semester ticket. Part-time work (20 hrs/week at EUR 13.90/hour minimum) generates EUR 800–1,100/month supplementary income from Year 1 onwards. Hospital training stipend (EUR 400–800/month) may apply at several partner hospitals during practical phases. Residence permit renewal: EUR 50–110 at Ausländerbehörde Hamburg.",
        },
        {
          yearLabel: "Year 3 (Semesters 5–6)",
          tuitionUsd: 0,
          hostelUsd: 3888,
          livingUsd: 10368,
          totalUsd: 14256,
          notes:
            "Tuition EUR 0. Semester contribution EUR 794. Advanced clinical placements at UKE and partner hospitals. Part-time work income continues. Deutschlandstipendium (EUR 300/month, 12 months, renewable) may be applied for after enrolment based on academic merit. Begin exploring job offers for post-graduation employment with partner hospitals.",
        },
        {
          yearLabel: "Semester 7 — Final Semester (6 months)",
          tuitionUsd: 0,
          hostelUsd: 1944,
          livingUsd: 5184,
          totalUsd: 7128,
          notes:
            "Tuition EUR 0. Semester contribution EUR 397 (1 semester). Final clinical placement, Bachelor thesis, and state nursing examination (Staatsexamen). Living estimate EUR 1,100 × 6 months = EUR 6,600 (USD 7,128 approx). After graduation, apply immediately for 18-month Job Seeker Residence Permit (Section 20 AufenthG). Most graduates have a nursing job offer within weeks — begin nursing employment at EUR 2,800–3,200+/month gross immediately.",
        },
      ],
      licenseExamSupport: [
        "Staatsexamen (State Nursing Examination) — completed in Semester 7 at HAW Hamburg. Successfully completing this mandatory state examination grants the Berufserlaubnis als Pflegefachkraft (professional nursing licence) recognised across Germany and all 27 EU member states. No separate NCLEX or NMC exam required to practise in Germany.",
        "EU Directive 2005/36/EC — HAW Hamburg nursing licence is automatically recognised across all 27 EU member states for nursing practice. Applies to all EU/EEA countries including Netherlands, Sweden, Denmark, Ireland, France, and others.",
        "UK NMC International Registration — German BSc Nursing is well-received by the UK Nursing and Midwifery Council. Specific recognition route for EU-qualified nurses; CBT and OSCE required.",
        "NCLEX-RN (Canada/USA) — German BSc Nursing eligible for CGFNS credential evaluation for US and Canadian nursing licensure.",
        "HAW Hamburg MSc Nursing — direct progression for BSc Nursing graduates seeking research, education, and advanced practice roles (4 semesters, 2 years, EUR 0 tuition, German C1 required).",
        "HAW Hamburg MBA Social and Health Management — progression to healthcare management leadership roles (hospital management, care facility director, health insurance management).",
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
    console.log("🌍 Looking up country: Germany…");
    const countryResult = await client.query(
      `SELECT id FROM countries WHERE slug = $1`,
      ["germany"]
    );
    if (!countryResult.rows[0]) {
      throw new Error(
        "Germany not found in the countries table. Run seed-germany-bscn.mjs first."
      );
    }
    const germanyId = countryResult.rows[0].id;
    console.log(`✓ Germany found (id=${germanyId})`);

    console.log(
      "\n🏫 Upserting university: Hamburg University of Applied Sciences (HAW Hamburg)…"
    );

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
        germanyId,
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
    console.log(
      "\n✅ HAW Hamburg BSc Nursing (Cooperative/Dual Degree) seeded successfully."
    );
    console.log(`   Country:     Germany (id=${germanyId})`);
    console.log(`   University:  ${university.name} (id=${universityId})`);
    console.log(`   Programme:   ${prog.slug}`);
    console.log(`   Course:      BSc Nursing (id=${COURSE_BSC_NURSING_ID})`);
    console.log(`   Slug:        ${university.slug}`);
    console.log(
      `   URL:         /work-abroad/germany/${university.slug} (check routing)`
    );
  } catch (err) {
    console.error("FATAL:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
