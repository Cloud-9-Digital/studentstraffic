/**
 * Seed Deggendorf Institute of Technology (DIT) — BSc Nursing (International), Germany.
 * Source: Students Traffic DIT Deggendorf Nursing Complete Guide, June 2026.
 * Run: node scripts/seed-dit-deggendorf-bscn.mjs
 *
 * Prerequisites: Germany must already exist in the countries table.
 * Run seed-germany-bscn.mjs first if it hasn't been run.
 *
 * This script:
 *   1. Looks up Germany from the countries table
 *   2. Upserts DIT Deggendorf into the universities table
 *   3. Upserts the BSc Nursing (International) programme offering (course ID 15)
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
  slug: "dit-deggendorf-bscn",
  name: "Deggendorf Institute of Technology (DIT) — BSc Nursing (International) — English Entry with Built-in German",
  city: "Deggendorf",
  type: "Public",
  establishedYear: 1994,
  officialWebsite: "https://www.th-deg.de",
  summary:
    "Deggendorf Institute of Technology (DIT) — Technische Hochschule Deggendorf — is a public Bavarian university of applied sciences founded in 1994, with ~9,000 students and 41%+ international students from 100+ countries, making it Bavaria's most international university. The BSc Nursing (International) programme — B.Sc. Pflege (International) — is delivered by the Faculty of Applied Healthcare Sciences and is one of the very few nursing degrees in Germany that admits students with English B2 and only A1 German: Semesters 1–3 are taught in English with 8 hours/week of German class built into the curriculum (A2 in Semester 1, B1 in Semester 2, B2 in Semester 3), and Semesters 4–8 transition fully to German. This makes DIT the most accessible German nursing route for Indian students who have not yet invested in 18–24 months of German preparation. The programme is 8 semesters (4 years, 240 ECTS), starts in March (Summer Semester only), and applies via DIT's own Primuss portal — NOT uni-assist. Tuition is EUR 0 (zero); non-EU students pay EUR 582/semester in service and union fees (EUR 4,656 total for 4 years). A training contract (Ausbildungsvertrag) with a DIT partner hospital or care facility is mandatory before starting. Under the Pflegestudiumstärkungsgesetz (Nursing Degree Strengthening Act 2023), students with training contracts receive a legally mandated monthly training stipend (EUR 400–800) from partner institutions — earn while you study. Graduates receive both a BSc degree AND a state nursing licence (Berufserlaubnis als Pflegefachkraft) authorising immediate nursing practice across Germany and all 27 EU member states. Total 4-year cost including all fees and living costs: approximately INR 40–51 lakh — 3–4 times cheaper than Canada nursing. APS Certificate is required for the student visa (not for the Primuss application). CRITICAL NOTE for Indian students: Indian Class 12 (12 years) is generally NOT directly equivalent to German Abitur (13 years); most Indian students must complete at least 1 year of a Bachelor's degree in India first, then apply to DIT.",
  campusLifestyle:
    "DIT's main campus is at Dieter-Görlitz-Platz 1, 94469 Deggendorf — a modern, centrally-located campus with a courtyard design and water features, described by students as relaxed and community-oriented. The campus is within walking distance of most student accommodation. DIT has three campuses (main campus Deggendorf, European Campus Rottal-Inn/ECRI in Pfarrkirchen, and Campus Cham). With 41%+ international students from 100+ countries, DIT is Bavaria's most international university — the campus reflects this with students from India, Nepal, Vietnam, Nigeria, Turkey, and across Europe. DIT facilities include a library, IT services, language centre (Sprachenzentrum — which offers additional German language support beyond the curriculum), student cafeteria (Mensa), and sports facilities. The Welcome Team run by DIT's International Office provides dedicated onboarding, orientation, accommodation assistance, and ongoing support. The weBuddy programme connects incoming international students with student buddies. Student clubs and cultural associations hold international events throughout the year. Nursing students use the non-EU service fee (EUR 500/semester) to access this full support infrastructure: onboarding, integration, career entry preparation, language support, and international student services. The DIT nursing programme applies through DIT's own Primuss portal (th-deg.de/en/apply) — not uni-assist. Contact for nursing enquiries: nursing-in@th-deg.de.",
  cityProfile:
    "Deggendorf is a historic Bavarian town of ~38,000 residents on the Danube River, surrounded by the Bavarian Forest (Bayerischer Wald) and the Alps — 150 km northeast of Munich, 30 km from the Austrian border, and close to the Czech Republic. It is a vastly cheaper place to live than Munich (EUR 1,200–1,600/month), Hamburg (EUR 1,000–1,300/month), or Berlin. Students from India consistently report total monthly expenses of EUR 650–850. The city centre and DIT campus are walkable from most student accommodation. Munich is accessible in ~2 hours by train (frequent IC/RE services) — students regularly visit Munich for weekends, shopping, and major city experiences. Regensburg (major Bavarian city) is ~1 hour by train; Salzburg, Austria ~2 hours; Prague, Czech Republic ~3 hours. The Bavarian Forest national park is 20–30 minutes from Deggendorf — popular for hiking, skiing, and outdoor activities. Indian food: Deggendorf has Indian restaurants (limited compared to major cities, but present); Asian grocery stores in Deggendorf and nearby Straubing and Regensburg stock Indian spices, rice, dal, and cooking essentials; Munich (2 hours) has extensive Indian grocery shopping. Self-cooking is strongly recommended and practical — Indian students at DIT commonly cook at home, keeping food costs at EUR 100–150/month. The nearest Hindu temple is in Munich (Chinmaya Mission Munich, Shiv Mandir Munich). Indian cultural events are organised by DIT student groups. Climate: continental Bavarian — winters are cold (snow common, −5 to +4°C December–February), summers warm (18–27°C). Budget INR 25,000–40,000 for first winter wardrobe.",
  clinicalExposure:
    "The BSc Nursing at DIT is approximately 50% practical training — Practical Training modules run across all 8 semesters, carrying increasing ECTS weight from 5 ECTS (Semester 1) to 20 ECTS (Semester 8), totalling 80 out of 240 ECTS. A training contract (Ausbildungsvertrag) with a DIT partner hospital, care facility, or outpatient service is mandatory before starting the programme. DIT actively works with partner institutions in the Deggendorf, Lower Bavaria, and wider Bavaria region — request the current partner list PDF from nursing-in@th-deg.de. Under the Pflegestudiumstärkungsgesetz (Nursing Degree Strengthening Act, effective October 2023), students with training contracts receive a legally mandated monthly training stipend (Vergütung) of typically EUR 400–800 — a legal right, not optional. Clinical settings cover all three mandated by the German Nursing Act (PflBG 2020): (1) Inpatient care (hospital — acute, surgical, geriatric, and specialised wards); (2) Long-term care (Pflegeheim — residential elderly care); (3) Outpatient care (ambulante Pflege — community nursing services). Partner institutions span hospitals, care facilities, and outpatient services across Lower Bavaria. After graduation, DIT's strong regional industry connections give graduates direct access to large hospitals in Regensburg, Passau, Landshut, Straubing, and Munich (LMU Klinikum, TU Munich Klinikum, Klinikum Schwabing). DIT reports 87% graduate employment within 2 months of graduation across all programmes.",
  hostelOverview:
    "Accommodation in Deggendorf is significantly more affordable than Hamburg, Munich, or Berlin. Options: (1) Student dormitories: DIT International Office assists with dormitory applications — rooms near campus from EUR 200–320/month, including communal utilities. Apply early via DIT International Office as places are limited. (2) Private studio apartments: confirmed local provider Wagner Wohnbau student apartments at EUR 310 + EUR 120 bills = EUR 430/month total. Other private studios EUR 300–450/month. (3) Shared apartments (WG): EUR 250–380/month per room — find via WG-Gesucht.de or DIT's accommodation board (WB-Wohnungssuche). DIT campus is in central Deggendorf — walkable from most accommodation options, so transport costs are minimal (most students walk or cycle). Note: unlike HAW Hamburg, DIT's semester contribution does NOT include a public transport pass. A local bus monthly pass costs EUR 30–60, or separately purchase the Deutschlandticket (EUR 58/month) for unlimited regional train travel. Accommodation is considerably easier and cheaper to find in Deggendorf than in any major German city — typically from EUR 310/month + bills at confirmed local providers.",
  indianFoodSupport:
    "Deggendorf has a small but functional Indian food ecosystem for a city of its size. Indian restaurants are present in Deggendorf (limited compared to Hamburg or Munich, but available). Asian grocery stores in Deggendorf, Straubing (~20 km), and Regensburg (~60 km) stock basmati rice, lentils, Indian spices, and cooking essentials. Munich (2 hours by train) has extensive Indian grocery shopping and dozens of Indian restaurants serving all regional cuisines. Self-cooking is strongly recommended by Indian students at DIT — the most affordable approach at EUR 100–150/month for groceries. The nearest Hindu temple is in Munich (Chinmaya Mission Munich, Shiv Mandir Munich). Indian cultural events including Diwali are organised by DIT student groups. The large international student community (41%+ from 100+ countries) means Indian students integrate well and find peer community from Day 1. Students Traffic connects all enrolled DIT students with the existing Indian student network before arrival.",
  safetyOverview:
    "Deggendorf is a safe Bavarian town with very low crime rates — consistent with Germany's status as one of the safest countries in the world. Lower Bavaria is a quiet, rural-urban region with minimal safety concerns. The 41% international student population at DIT means the campus is cosmopolitan and Indian students are not isolated or conspicuous. Professors are accessible and the small-city environment means DIT staff know their students personally. German constitutional protections for freedom of religion apply fully — all religions are freely practised. DIT's International Office provides student welfare support, mental health resources, and administrative guidance. Students at DIT consistently report high satisfaction with the safety and community feel of Deggendorf.",
  studentSupport:
    "DIT's International Office operates a dedicated Welcome Team for incoming international students — covering onboarding, orientation, accommodation assistance, and ongoing support throughout the programme. The weBuddy programme pairs new international students with German student buddies. DIT's Language Centre (Sprachenzentrum) provides supplementary German language support beyond the 8 hours/week built into the curriculum. The Primuss portal manages all academic administration. Career services support: DIT reports 87% graduate employment within 2 months of graduation university-wide. Nursing programme contact: nursing-in@th-deg.de (nursing-specific); welcome@th-deg.de (general international queries). Students Traffic provides end-to-end support: eligibility assessment (Class 12 bridge route, IB/A-Level, 1-year Indian university route), German A1 language preparation guidance, IELTS guidance, training contract identification and German-language application document preparation, DIT Primuss portal application submission, APS Certificate process (after DIT admission), German national visa document preparation and VFS Global appointment coordination, blocked account setup (Expatrio/Fintiba guidance), pre-departure orientation (Deggendorf life, Bavarian climate, Indian community contacts, arrival checklist), and post-arrival support (Ausländerbehörde registration, GKV health insurance, banking).",
  whyChoose: [
    "English entry with built-in German — the defining advantage for Indian students. Semesters 1–3 deliver all nursing science content in English while teaching you German A2 → B1 → B2 as 10 ECTS credited modules (8 hours/week). You do NOT need C1 German before arrival — saving 18–24 months of pre-arrival language preparation compared to HAW Hamburg. You are not learning German on top of your studies — it IS part of your studies.",
    "Zero tuition (+ lowest non-EU fees in Germany) — DIT charges EUR 0 in tuition. Non-EU students pay EUR 582/semester in service and union fees — EUR 4,656 total for the entire 4-year BSc. This is less than 1 semester at many private Indian universities. Total 4-year cost including all living expenses: approximately INR 40–51 lakh — 3–4 times cheaper than Canada for the same German nursing outcome.",
    "Earn while you study — the Pflegestudiumstärkungsgesetz (Nursing Degree Strengthening Act 2023) legally mandates a training stipend (EUR 400–800/month) from partner institutions during practical phases. Combined with student work rights of 140 full days/year (approx. 20 hrs/week at EUR 13.90/hour minimum wage), students can substantially offset Deggendorf's already-low living costs.",
    "Bavaria's most international university — 41%+ international students from 100+ countries. DIT was specifically built for international student success: dedicated Welcome Team, weBuddy programme, language centre, and a proven track record with Indian and South Asian students. The international atmosphere means Indian students integrate quickly and are never isolated.",
    "Double qualification at graduation — you receive both a BSc (B.Sc.) degree AND a state nursing licence (Berufserlaubnis als Pflegefachkraft) authorising immediate nursing practice across Germany, Austria, Switzerland, and all 27 EU member states. No Berufsanerkennung (recognition process) required — you ARE a German-licensed nurse from Day 1.",
    "Lowest living costs of any Germany nursing route — Deggendorf's EUR 650–850/month total budget (accommodation EUR 250–430, groceries EUR 100–150, health insurance EUR 110–120, transport EUR 0–60) is half what you would spend in Hamburg and a third of Munich. Small-city Germany is exceptional value without sacrificing quality of life.",
    "Strong regional career access — DIT graduates have direct connections to hospitals across Lower Bavaria (Regensburg, Passau, Landshut, Straubing) and Munich (150 km, above-average salaries). Bavaria is a high-wage German state. Austria and Switzerland (mutually recognising German nursing licence) are also accessible. DIT career service: 87% graduate employment within 2 months.",
  ],
  thingsToConsider: [
    "Indian Class 12 (12 years) is generally NOT directly equivalent to the German Abitur (13 years) — most Indian students need a bridge qualification. The most practical route: complete at least 1 year (2 semesters) of any Bachelor's degree at a recognised Indian university THEN apply to DIT. This adds one year to the timeline but is the most commonly used route for Indian students at DIT. IB Diploma and A-Levels (2+ subjects) may qualify for direct entry.",
    "Training contract mandatory before starting — you must secure an Ausbildungsvertrag with a DIT partner institution BEFORE the programme begins. The training contract interview is conducted in German (A2–B1 recommended, A1 is the absolute minimum). Without a training contract, admission to the nursing BSc is not possible. Contact DIT partner hospitals early (6–9 months before the March start) via nursing-in@th-deg.de.",
    "March intake only — the international nursing BSc at DIT starts ONCE per year in March (Summer Semester). Applications run October 1 – March 14. There is no October intake. Missing the window means waiting a full year. Apply via DIT's own Primuss portal (th-deg.de/en/apply) — NOT uni-assist.",
    "Semesters 4–8 are taught in German — by Semester 4 you will be expected to study nursing science, write examinations, and communicate clinically in German. The built-in A2→B2 curriculum is effective but demanding — arriving with A2 or higher German (not just the A1 minimum) significantly smooths the Semester 4 transition. Recommended: reach A2–B1 before arrival (5–8 months preparation).",
    "EUR 582/semester non-EU service fee is ongoing for all 8 semesters — EUR 4,656 total. This is an upfront declared cost, not tuition, but it applies every semester. No reduction or exemption applies to students who enrolled from WS 2025/26 onwards.",
    "Deggendorf is a small city of 38,000 — not Hamburg or Munich. Indian food infrastructure is limited within Deggendorf itself (Asian grocery stores and a small number of Indian restaurants). Munich is 2 hours away for a full city experience. Students who prefer a major city environment should consider HAW Hamburg instead.",
  ],
  bestFitFor: [
    "Indian students after Class 12 who have completed (or are completing) at least 1 year of any Bachelor's degree at a recognised Indian university — this is the most practical and common route to DIT. Students who are currently in Year 1 of BSc Nursing in India can use that year as the bridge qualification.",
    "Students who cannot yet commit 18–24 months to German language preparation and need to start a German nursing degree sooner. DIT's English entry (A1 minimum) with built-in German curriculum makes it the most accessible Germany nursing route for Indian students with limited German preparation time.",
    "Budget-conscious families who want the lowest possible cost for a German nursing degree — Deggendorf's EUR 650–850/month living costs plus EUR 582/semester fees result in the lowest total 4-year spend of any German public university nursing programme.",
    "Students targeting Bavaria for their nursing career — DIT's regional connections in Lower Bavaria plus proximity to Munich (the highest-paying German nursing market) create a strong post-graduation job pipeline. Bavarian hospitals, including Munich's LMU Klinikum and TU Munich Klinikum, actively recruit DIT graduates.",
    "Students who find large-city environments overwhelming and prefer a close-knit, community-oriented campus — Deggendorf's small size creates a supportive atmosphere where professors are accessible and peer networks form quickly across DIT's 41% international student community.",
  ],
  teachingHospitals: [
    "DIT partner hospitals and care facilities in Deggendorf and the Lower Bavaria region — inpatient acute hospitals, residential care facilities (Pflegeheim), and outpatient community nursing services (ambulante Pflege)",
    "Hospitals in Regensburg, Passau, Landshut, and Straubing — accessible within Lower Bavaria for career placement after graduation",
    "Munich metropolitan hospitals (150 km): Klinikum der Universität München (LMU), TU Munich Klinikum, Klinikum Schwabing — graduate career destinations, above national average salaries",
    "Contact nursing-in@th-deg.de for current cooperation partner list (Kooperationspartner PDF)",
  ],
  recognitionBadges: [
    "Bavarian State-Accredited — Public Fachhochschule, Free State of Bavaria",
    "Pflegeberufegesetz (PflBG 2020) Compliant — Federal German Nursing Act",
    "Double Qualification: BSc + Berufserlaubnis als Pflegefachkraft (State Nursing Licence)",
    "EU Directive 2005/36/EC — Automatic Professional Recognition Across 27 EU Member States",
    "Pflegestudiumstärkungsgesetz 2023 — Legally Mandated Training Stipend from Partner Institutions",
    "240 ECTS — Bologna Process Compliant",
    "Bavaria's Most International University — 41%+ International Students from 100+ Countries",
    "18-Month Post-Study Work Permit (Section 20 AufenthG)",
    "EU Blue Card Eligible — Nursing Shortage Occupation",
  ],
  recognitionLinks: [
    {
      label: "DIT Deggendorf Official Website",
      url: "https://www.th-deg.de",
    },
    {
      label: "BSc Nursing International Programme — DIT (th-deg.de/pfi-b-en)",
      url: "https://www.th-deg.de/en/faculties-and-departments/applied-healthcare-sciences/degree-programmes/bachelor/nursing-b-sc-international",
    },
    {
      label: "DIT Primuss Application Portal",
      url: "https://www.th-deg.de/en/apply",
    },
    {
      label: "DIT Nursing Enquiries — nursing-in@th-deg.de",
      url: "https://www.th-deg.de/en/faculties-and-departments/applied-healthcare-sciences",
    },
    {
      label: "APS India — German Embassy Academic Evaluation Centre",
      url: "https://www.aps.org.in",
    },
  ],
  similarUniversitySlugs: ["haw-hamburg-bscn"],
  lastVerifiedAt: "2026-06-19",
  researchSources: [
    {
      label: "DIT Deggendorf Official Website — th-deg.de",
      url: "https://www.th-deg.de",
      kind: "official-university",
      checkedAt: "2026-06-19",
    },
    {
      label: "DIT BSc Nursing International Programme Page",
      url: "https://www.th-deg.de/en/faculties-and-departments/applied-healthcare-sciences/degree-programmes/bachelor/nursing-b-sc-international",
      kind: "official-program",
      checkedAt: "2026-06-19",
    },
    {
      label: "DIT Primuss Application Portal",
      url: "https://www.th-deg.de/en/apply",
      kind: "official-university",
      checkedAt: "2026-06-19",
    },
    {
      label: "APS India — German Embassy New Delhi",
      url: "https://www.aps.org.in",
      kind: "government",
      checkedAt: "2026-06-19",
    },
    {
      label: "Students Traffic DIT Deggendorf Nursing Complete Guide — June 2026",
      url: "https://studentstraffic.com",
      kind: "other",
      checkedAt: "2026-06-19",
    },
  ],
  faq: [
    {
      question: "Is DIT Deggendorf a government university?",
      answer:
        "Yes. DIT (Technische Hochschule Deggendorf) is a public state university funded by the Free State of Bavaria. This is why tuition is EUR 0 for all students. Non-EU students pay EUR 582/semester in service and union fees (EUR 500 service fee + EUR 82 union fee) — not tuition.",
    },
    {
      question: "Can I really start the nursing programme in English without knowing German?",
      answer:
        "Yes. The international nursing programme's first three semesters deliver all nursing science content in English. German A1 is the minimum entry requirement. You will learn German A2 (Semester 1), B1 (Semester 2), and B2 (Semester 3) as credited modules (8 hours/week, 10 ECTS each) within the curriculum. From Semester 4, teaching transitions to German — but by then, the programme has taught you the language you need. DIT is one of very few German universities where you do not need C1 German before you start.",
    },
    {
      question: "I just finished Class 12 in India. Can I apply directly to DIT?",
      answer:
        "In most cases, no. Indian Class 12 represents 12 years of schooling; Germany requires 13 (Abitur). Most Indian Class 12 graduates need a bridge qualification. The most practical route: complete at least 1 year (2 semesters) of any Bachelor's degree at a recognised Indian university, then apply to DIT. Students already in Year 1 of BSc Nursing in India can use that year. IB Diploma and A-Level holders may qualify for direct entry — check the DAAD database (daad.de). Students Traffic conducts this eligibility assessment.",
    },
    {
      question: "What does the DIT international nursing programme cost in total?",
      answer:
        "Tuition: EUR 0. University fees (8 semesters): EUR 4,656 (EUR 582/semester × 8). Living costs in Deggendorf: EUR 7,800–10,200/year (EUR 650–850/month). Total 4-year all-in: approximately EUR 35,856–45,456 (approx. INR 40–51 lakh). One-time setup costs (blocked account EUR 11,904 returned monthly + visa EUR 75 + APS INR 18,000 + application fee EUR 60 + IELTS INR 16,000–18,000 + German A1 course INR 15,000–50,000 + flight INR 35,000–60,000 + winter clothing INR 25,000–40,000). Compare to Canada nursing: INR 1.3–1.6 crore. DIT is 3–4 times cheaper.",
    },
    {
      question: "How do I apply to DIT Deggendorf? Is it through uni-assist?",
      answer:
        "No. DIT uses its own Primuss portal exclusively. Do NOT apply through uni-assist — your application will not reach DIT. Register and apply at th-deg.de/en/apply. The application period for the March start is October 1 – March 14. Application fee: EUR 60 for non-EU applicants (one payment covers all DIT programmes in that phase). The APS Certificate is NOT required at application stage — it is needed after you receive a DIT admission offer, for the student visa.",
    },
    {
      question: "What English level and test does DIT require?",
      answer:
        "English B2 for the international programme. Accepted tests: IELTS Academic 5.5+ overall (note: lower than many other programmes), TOEFL iBT 72+, PTE Academic 59+, Cambridge B2 First, Duolingo English Test. If your Class 12 was in English medium, contact nursing-in@th-deg.de to ask whether a language waiver applies.",
    },
    {
      question: "What is the training contract and how do I get one?",
      answer:
        "The training contract (Ausbildungsvertrag) is a formal agreement between you and a DIT partner hospital, care facility, or outpatient service — mandatory before starting the programme. Contact DIT at nursing-in@th-deg.de to request the current cooperation partner list (PDF). Apply directly to partner institutions 6–9 months before the March start with a German-language CV, motivation letter, and certificates. Each partner conducts its own selection interview in German (A2–B1 recommended). Students Traffic helps prepare German-language application documents and interview preparation.",
    },
    {
      question: "Do I get paid during the nursing programme at DIT?",
      answer:
        "Yes. Under the Pflegestudiumstärkungsgesetz (Nursing Degree Strengthening Act 2023), students with a signed training contract receive a legally mandated training stipend (Vergütung) from partner institutions. Typical range: EUR 400–800/month during practical training phases. This is a legal right — partner institutions are obligated to pay it. Confirm the exact amount in your training contract before signing.",
    },
    {
      question: "When does the programme start — March or October?",
      answer:
        "March (Summer Semester) only. The international nursing BSc at DIT starts once per year in March. Applications run from October 1 to March 14. There is NO October or Winter Semester start for this international nursing programme.",
    },
    {
      question: "Is the APS Certificate required for the DIT application?",
      answer:
        "No — APS is NOT required for the DIT Primuss application. However, APS IS required for the German student visa. Begin the APS process immediately after receiving your DIT admission offer. Processing takes 4–8 weeks. APS India office: German Embassy compound, New Delhi. Fee: INR 18,000 (non-refundable). APS India does NOT process distance-education nursing degrees — standard in-person Class 12 is eligible.",
    },
    {
      question: "What is the difference between DIT's international nursing programme and the standard nursing BSc?",
      answer:
        "DIT offers two nursing programmes: (1) BSc Nursing (International) — Semesters 1–3 in English with built-in German A2→B1→B2; designed for international students; A1 German entry minimum; IELTS 5.5+ required; March start. (2) BSc Nursing (Standard) — entirely in German; requires C1/B2 German at entry; no built-in language modules; October start. Indian students should apply to Programme (1) — the international version.",
    },
    {
      question: "What happens after I graduate — how do I stay in Germany?",
      answer:
        "Graduates receive an 18-month Job Seeker Residence Permit (Section 20 AufenthG) with unlimited work rights. Since you hold a German nursing licence, you can start nursing work from graduation day. Once you secure a nursing job, apply for the EU Blue Card (shortage occupation threshold: EUR 45,934.20/year, 2026) or a skilled worker permit. With B1 German and 21 months of Blue Card employment, apply for permanent residency (Niederlassungserlaubnis). DIT's built-in German programme takes you to B2 by Semester 3 and B1 by Semester 2 — you may reach PR eligibility within 2 years of starting your first nursing job.",
    },
    {
      question: "Do I need NEET to apply to DIT Deggendorf?",
      answer:
        "No. NEET is an Indian entrance exam for Indian nursing and medical programmes. It has no relevance to German university admissions. DIT does not require NEET, SAT, JEE, or any other standardised entrance exam. Admission is based on your bridge qualification (1-year Indian university transcript), German A1 certificate, English B2 certificate, training contract, and academic documents.",
    },
    {
      question: "Can I work in Munich after graduating from DIT Deggendorf?",
      answer:
        "Yes. A German nursing licence authorises you to work anywhere in Germany. Munich hospitals (LMU Klinikum, TU Munich Klinikum, Klinikum Schwabing) are 150 km from Deggendorf — many DIT nursing graduates find jobs in the Munich metropolitan area. Munich nursing salaries are above the national German average. Bavaria is a high-wage German state.",
    },
    {
      question: "What is DIT's ranking?",
      answer:
        "DIT is ranked 142nd in Germany, 18th in Bavaria, and 1053rd in Europe (EduRank, March 2025). It does not appear in QS or THE rankings (which focus on research output at major universities). DIT's strength is applied, practice-oriented education with 87% graduate employment within 2 months — a metric that matters far more for nursing careers than research rankings.",
    },
  ],
  admissionsContent: {
    overview:
      "DIT Deggendorf uses its own Primuss portal (th-deg.de/en/apply) — NOT uni-assist. The international nursing BSc starts in March (Summer Semester) only; application period is October 1 – March 14. Application fee: EUR 60 (non-EU applicants). Unlike HAW Hamburg, the APS Certificate is NOT required at application stage — it is needed after admission, for the student visa. A training contract with a DIT partner institution is mandatory before starting. DIT's acceptance rate for nursing is estimated at 55–60%; applications with a confirmed training contract are significantly stronger. Students Traffic manages the complete application process: eligibility assessment (bridge qualification route), German A1 preparation, IELTS, training contract identification and German-language application documents, Primuss portal submission, APS Certificate after admission, and full German visa coordination.",
    eligibility: {
      intro:
        "Entry requirements for Indian students applying to the DIT BSc Nursing (International) programme:",
      items: [
        "Bridge qualification: at least 1 year (2 semesters) of a Bachelor's degree at a recognised Indian university — this bridges the gap between Indian Class 12 (12 years) and German Abitur (13 years). Students in Year 1 of BSc Nursing in India can use their first year. IB Diploma (full, 24+ points) may qualify for direct entry. A-Level holders (2+ subjects, grade C+) may also qualify — check the DAAD database (daad.de).",
        "German language: A1 minimum at application — Goethe A1 certificate or equivalent (TELC A1, OSD A1). A2–B1 strongly recommended for training contract interviews and clinical performance. German A2→B1→B2 built into Semesters 1–3 as 10 ECTS credited modules (8 hours/week).",
        "English language: B2 — IELTS Academic 5.5+ overall, TOEFL iBT 72+, PTE Academic 59+, Cambridge B2 First, or Duolingo English Test. If Class 12 medium was English, contact nursing-in@th-deg.de for language waiver query.",
        "Training contract (Ausbildungsvertrag): mandatory with a DIT partner hospital or care facility in Lower Bavaria. Secure this 6–9 months before the March start. Contact nursing-in@th-deg.de for current partner list.",
        "Application via DIT Primuss portal only (th-deg.de/en/apply) — NOT uni-assist. Application fee EUR 60 (non-EU). Application period: October 1 – March 14.",
        "APS Certificate: NOT required for Primuss application — required after admission for the German student visa. Apply for APS at APS India (German Embassy New Delhi) immediately after receiving DIT admission offer.",
      ],
    },
    admissionSteps: [
      "Achieve bridge qualification and begin language preparation (12–18 months before March start) — if you hold only Class 12, enrol in any Indian Bachelor's programme and complete at least 1 year. Simultaneously begin German A1 at Goethe-Institut India (3–4 months from zero). Prepare IELTS (target 5.5+ overall). Output: bridge qualification transcript + German A1 certificate + English B2/IELTS certificate.",
      "Contact DIT partner institutions and secure a training contract (6–9 months before March start) — email nursing-in@th-deg.de to request the current cooperation partner list (Kooperationspartner PDF). Apply directly to partner hospitals and care facilities with a German-language CV, motivation letter, and certificates. Attend selection interview in German (A2–B1 recommended). Output: signed Ausbildungsvertrag or binding commitment letter from a DIT partner.",
      "Apply via DIT Primuss portal (October 1 – March 14) — register at th-deg.de/en/apply, pay EUR 60 application fee. Upload: bridge qualification documents (Class 12 + first-year university transcripts), German A1 certificate, English B2/IELTS certificate, training contract or commitment letter from partner. Do NOT apply through uni-assist — this will not reach DIT. Output: submitted Primuss application with reference number.",
      "Receive DIT admission offer (Zulassungsbescheid) — DIT reviews applications and issues admission or rejection. Applications with a confirmed training contract are significantly stronger (55–60% estimated acceptance rate).",
      "Apply for APS Certificate immediately after admission offer (3–5 months before March start) — begin at APS India (German Embassy, New Delhi). Required documents: passport, Class 10 and 12 certificates + marksheets, first-year university transcripts — all in A4 colour photocopy (both sides). Pay INR 18,000 fee. Allow 4–8 weeks. Output: APS Certificate.",
      "Enrol at DIT — complete online enrolment through Primuss portal after receiving the admission offer. Pay EUR 582 semester contribution (EUR 500 service fee + EUR 82 union fee). Output: enrolment confirmation + DIT student ID.",
      "Apply for German National Visa (Type D) at German Embassy/VFS Global in India — required documents: DIT admission/enrolment confirmation, APS Certificate, German A1 certificate, English B2 certificate, training contract, blocked account confirmation (EUR 11,904 from Expatrio/Fintiba), health insurance proof, Class 10 and 12 originals + certified copies, first-year university transcript, motivation letter/CV. Processing: 6–12 weeks. WARNING: Since July 1, 2025, Germany abolished the Widerspruch (remonstration) visa rejection appeal process — you have ONE attempt. Prepare correctly the first time. Output: German National Visa (Type D).",
      "Arrive in Deggendorf and begin programme (March start) — register at Bürgeramt within 2 weeks (Meldebescheinigung); enrol in statutory health insurance (GKV: TK, AOK Bayern, Barmer, EUR 110–120/month); activate blocked account (EUR 992/month begins releasing); open German bank account (DKB, N26, Sparkasse Deggendorf); apply for student residence permit (Aufenthaltserlaubnis) at Ausländerbehörde Deggendorf (Landratsamt) within 90 days; collect DIT student ID; attend International Office Welcome Programme; begin Semester 1 German A2 classes (10 ECTS of your degree from Day 1).",
    ],
    documentsRequired: {
      educational: [
        "Class 10 marksheet and certificate — certified true copy",
        "Class 12 marksheet and certificate — certified true copy",
        "First-year university transcript (1 year / 2 semesters from a recognised Indian university) — bridge qualification",
        "German A1 language certificate — Goethe A1 or equivalent (minimum; higher is better)",
        "English B2 certificate — IELTS Academic 5.5+ / TOEFL iBT 72+ / PTE Academic 59+ / Cambridge B2 First / Duolingo",
        "Training contract (Ausbildungsvertrag) or binding commitment letter from DIT partner institution",
        "Curriculum vitae (German and English)",
        "Motivation letter",
      ],
      visa: [
        "Valid national passport (6+ months validity beyond programme end)",
        "Completed, signed German National Visa application form (from VFS Global)",
        "2 biometric passport-sized photographs",
        "APS Certificate from APS India (German Embassy New Delhi) — apply AFTER DIT admission",
        "DIT admission confirmation (Zulassungsbescheid) or enrolment letter",
        "Training contract with DIT partner institution",
        "German A1 language certificate",
        "English B2/IELTS certificate",
        "Blocked account (Sperrkonto) confirmation certificate — EUR 11,904 deposited (Expatrio/Fintiba/Deutsche Bank)",
        "Health insurance confirmation (German GKV enrolment or travel insurance valid for visa period)",
        "Class 10 and 12 originals + certified copies",
        "First-year Indian university transcript",
        "Motivation letter / CV",
        "EUR 75 visa fee",
      ],
    },
    deadlinesNote:
      "Application window: October 1 – March 14 for the March/Summer Semester start (once per year only). Apply to DIT Primuss portal early — training contract is the most time-consuming step (6–9 months before March start). APS Certificate is applied for AFTER admission (not before) — begin immediately upon receiving DIT offer, allow 4–8 weeks. Book VFS Global visa appointment as soon as blocked account confirmation, APS Certificate, and DIT admission letter are all in hand — German embassy appointments can be 6–10 weeks out. Total preparation timeline from Class 12: approximately 12–18 months (1-year Indian university bridge + A1 German + IELTS + training contract + application).",
    scholarshipInfo:
      "Deutschlandstipendium: EUR 300/month (12 months, renewable) — awarded on academic merit and social criteria; DIT participates; apply after completing at least 1–2 semesters at DIT. DAAD STIBET bursaries: available for enrolled international students at DIT; need-based; apply after arrival. DIT internal awards: DIT offers support mechanisms for international students; details via DIT International Office. Bavarian state scholarships (BayBAfoeG): available for students with German language certificates at certain thresholds. Training stipend: EUR 400–800/month from partner institution during practical phases (mandatory under Pflegestudiumstärkungsgesetz 2023 — a legal right, not optional). Part-time work: 140 full days/year (approx. 20 hours/week at EUR 13.90/hour minimum) generates EUR 800–1,100/month supplementary income. Indian education loans (SBI, HDFC Credila, Axis Bank, ICICI) available — EUR 0 tuition means total loan quantum is a fraction of what Canada or UK would require.",
    licensingPathway: [
      "Graduate from DIT BSc Nursing (International) — receive both BSc degree AND Berufserlaubnis als Pflegefachkraft (German state nursing licence) simultaneously. No Berufsanerkennung (recognition process) required — you trained and qualified IN Germany.",
      "18-month Job Seeker Residence Permit (Section 20 AufenthG) after graduation — unlimited work rights. Begin nursing employment at EUR 2,800–3,200+/month gross from graduation day. Apply before student permit expires at Deggendorf Ausländerbehörde.",
      "EU Blue Card: once employed at EUR 45,934.20+/year (shortage occupation threshold, 2026), apply for EU Blue Card. Alternative: skilled worker permit (Fachkräfteeinwanderungsgesetz) — available from first qualifying nursing job without salary threshold.",
      "Permanent residency (Niederlassungserlaubnis): 21 months with EU Blue Card + B1 German; 27 months with B2 German standard skilled worker route. DIT's built-in German curriculum takes you to B1 by Semester 2 — PR eligibility may arrive within 2 years of starting your first nursing job.",
      "Bavaria career pathway: Lower Bavaria hospitals (Regensburg, Passau, Landshut, Straubing) plus Munich metropolitan hospitals (LMU Klinikum, TU Munich Klinikum) — above-average Bavarian salaries.",
      "EU-wide practice: nursing licence recognised across all 27 EU member states under EU Directive 2005/36/EC. Austria mutual recognition; Switzerland (CHF 5,000–8,000/month) accessible. UK NMC international route. Canada/USA: CGFNS credential evaluation + NCLEX-RN.",
      "Specialisation after BSc: in-service specialist training (Fachweiterbildung) at hospital — ICU, oncology, paediatrics, anaesthesia; MSc Nursing at German universities; MBA Health Management. DIT itself offers further education programmes.",
    ],
  },
  programs: [
    {
      slug: "dit-deggendorf-bscn-2026",
      title:
        "BSc Nursing (International) — B.Sc. Pflege International, 8 Semesters, English Entry Semesters 1–3 with Built-in German A2→B2, DIT Deggendorf, Bavaria (Zero Tuition, March Start)",
      durationYears: 4,
      annualTuitionUsd: 0,
      totalTuitionUsd: 0,
      livingUsd: 9720,
      officialFeeCurrency: "EUR",
      officialAnnualTuitionAmount: 0,
      officialTotalTuitionAmount: 0,
      officialProgramUrl:
        "https://www.th-deg.de/en/faculties-and-departments/applied-healthcare-sciences/degree-programmes/bachelor/nursing-b-sc-international",
      medium: "English then German",
      published: true,
      intakeMonths: ["March"],
      feeVerifiedAt: "2026-06-19",
      fxRateDate: "2026-06-19",
      fxRateSourceUrl:
        "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/",
      feeNotes:
        "Tuition fee: EUR 0 (zero) — DIT is a public Bavarian state university. Non-EU service fee: EUR 500/semester (from WS 2025/26; covers onboarding, integration, Welcome Team, career support, language services). Student union fee: EUR 82/semester (all students). Total per semester (non-EU): EUR 582. Total per year: EUR 1,164. Total for 8 semesters (4 years): EUR 4,656 (approximately INR 5.22 lakh at EUR 1 = INR 112). Application fee: EUR 60 (non-EU, one payment per application phase). Living costs in Deggendorf: EUR 650–850/month realistic student budget (accommodation EUR 200–430/month depending on dorm vs private studio; groceries EUR 100–200/month; transport EUR 0–60; health insurance GKV EUR 110–120/month mandatory; mobile/internet EUR 15–30; personal EUR 40–80; books EUR 10–20; leisure EUR 30–60). Annual living estimate EUR 9,000 (EUR 750/month average). USD conversion at EUR 1 = USD 1.08 (June 2026 ECB rate). NOTE: DIT's semester contribution does NOT include a public transport pass (unlike Hamburg); Deutschlandticket (EUR 58/month) available separately for national regional rail travel. Training stipend from partner institution: EUR 400–800/month during practical phases (legal right under Pflegestudiumstärkungsgesetz 2023 — partially or substantially offsets living costs). One-time setup costs (not in living estimate): blocked account EUR 11,904 (YOUR money returned EUR 992/month), visa fee EUR 75, APS certificate INR 18,000, DIT application fee EUR 60, German A1 course INR 15,000–50,000, IELTS INR 16,000–18,000, Goethe A1 exam INR 4,000–8,000, flight to Munich INR 35,000–60,000, accommodation deposit EUR 600–1,000, winter clothing INR 25,000–40,000.",
      teachingPhases: [
        {
          phase: "Semester 1 — English Entry + German A2 (10 ECTS German)",
          language: "English (nursing) + German A2 (8 hrs/week)",
          details:
            "Nursing science in English: Research-Differentiated Nursing Process and Evidence-Based Nursing; Foundational Reference Sciences 1; Therapy Sciences 1: Movement and Rest; Practical Training 1 (5 ECTS clinical). German language: A2 module, 8 SWS (weekly teaching hours), 10 ECTS — intensive, structured German equivalent to a full-time language school alongside nursing studies. This is the English-entry foundation semester — nursing theory is fully accessible in English while German acquisition begins formally.",
        },
        {
          phase: "Semester 2 — English Entry + German B1 (10 ECTS German)",
          language: "English (nursing) + German B1 (8 hrs/week)",
          details:
            "Nursing science in English: Foundational Reference Sciences 2 (Social Sciences 1 — Sociology; Natural Sciences); Therapy Sciences 2: Nutrition; Foundations of Professional Pedagogy and Education; Practical Training 2 (5 ECTS clinical). German language: B1 module, 8 SWS, 10 ECTS. By end of Semester 2, students are at intermediate German — sufficient for basic clinical conversation and the PR 21-month B1 eligibility milestone.",
        },
        {
          phase: "Semester 3 — English Entry + German B2 (10 ECTS German)",
          language: "English (nursing) + German B2 (8 hrs/week)",
          details:
            "Nursing science in English: Professional Identity and Policy; Basic Module in Healing Professions; Foundational Reference Sciences 3 (Social Sciences 2 — Psychology; Natural Sciences 3); Therapy Sciences 3: Perception, Thinking, Elimination, Sexuality, Infection; Practical Training 3 (5 ECTS clinical). German language: B2 module, 8 SWS, 10 ECTS. By end of Semester 3, students have reached B2 German through the programme — ready for the full transition to German-medium instruction in Semester 4.",
        },
        {
          phase: "Semester 4 — Transition to German-Medium Instruction",
          language: "German (full transition)",
          details:
            "First fully German-medium semester: Health System and Law; Foundational Reference Sciences 5 (Social Sciences 5; Natural Sciences 4); Therapy Sciences 5: Family, Role, Well-Being, Pain; Health Promotion; Practical Training 4 (10 ECTS clinical — doubled from Semesters 1–3). By Semester 4, the built-in A2→B2 curriculum has prepared students to study nursing science in German. Clinical practical training hours increase significantly.",
        },
        {
          phase: "Semester 5 — Advanced German Nursing (Ethics and Psychology)",
          language: "German",
          details:
            "Ethics; Foundational Reference Sciences 4 (Social Sciences 3: Psychology; Social Sciences 4: Sociology 2); Therapy Sciences 4: Self, Stress Tolerance, Violence, Wound; Educational Concepts and Methods 1; Practical Training 5 (10 ECTS clinical). Students are now working fully in German in both academic and clinical settings. Advanced nursing specialisations in psychology, ethics, and complex patient care scenarios.",
        },
        {
          phase: "Semester 6 — Complex Care and Health Literacy",
          language: "German",
          details:
            "Complex Care 1; Educational Concepts and Methods 2; Applied Health Literacy; Practical Training 6 (15 ECTS clinical — the largest clinical block to date). Students manage complex patient care scenarios under supervision, applying all nursing science from previous semesters. Health literacy and patient education skills developed for clinical leadership roles.",
        },
        {
          phase: "Semester 7 — Healthcare Management and Communication",
          language: "German",
          details:
            "Healthcare Management; Complex Care 2; Applied Health Communication (Health Communication 1 and 2); Practical Training 7 (10 ECTS clinical). Nursing management, leadership, and advanced communication skills. Students begin exploring post-graduation employment options with partner institutions and regional hospitals in Bavaria.",
        },
        {
          phase: "Semester 8 — Bachelor Thesis and Final Clinical Placement",
          language: "German",
          details:
            "Bachelor Thesis (6 ECTS) and Bachelor Seminar (4 ECTS) — independently conducted nursing research supervised by a DIT professor; written in German (B2+ proficiency required); topic of student's choice. Practical Training 8 (20 ECTS — the largest clinical block in the programme). Graduation with BSc (B.Sc.) degree AND Berufserlaubnis als Pflegefachkraft (German state nursing licence). Total practical training across all 8 semesters: 80 ECTS out of 240 (33% of the degree is in clinical settings).",
        },
      ],
      yearlyCostBreakdown: [
        {
          yearLabel: "Year 1 (Semesters 1–2, March start)",
          tuitionUsd: 0,
          hostelUsd: 3456,
          livingUsd: 6264,
          totalUsd: 9720,
          notes:
            "Tuition EUR 0. Non-EU service fees EUR 1,164 (2 × EUR 582; included in living estimate below). Accommodation EUR 300/month average (dorm EUR 200–320 or shared WG EUR 250–380). Food EUR 150/month. Health insurance EUR 115/month (mandatory GKV). Transport EUR 30/month (local bus or cycling; no semester ticket). Books EUR 15/month. Personal/leisure EUR 90/month. Total monthly: ~EUR 700 (plus EUR 97 service fee allocation = EUR 797). Annual estimate EUR 9,000 ÷ 12 months = EUR 750/month average. Year 1 one-time costs (not in estimate): winter clothing INR 25,000–40,000 + blocked account EUR 11,904 (returned monthly) + visa EUR 75 + APS INR 18,000 + application fee EUR 60 + IELTS INR 16,000–18,000 + flight INR 35,000–60,000 + accommodation deposit EUR 600–1,000. Training stipend from partner institution: EUR 400–800/month during Practical Training 1 and 2 — partially offsets living costs from Day 1.",
        },
        {
          yearLabel: "Year 2 (Semesters 3–4)",
          tuitionUsd: 0,
          hostelUsd: 3456,
          livingUsd: 6264,
          totalUsd: 9720,
          notes:
            "Tuition EUR 0. Non-EU service fees EUR 1,164. Same monthly living estimate EUR 750/month. Semester 4 transitions to German-medium instruction — German B2 achieved through Semester 3 built-in module. Clinical training hours increase to 10 ECTS in Semester 4. Training stipend continues during practical phases. Part-time work (20 hours/week at EUR 13.90/hour) can generate EUR 800–1,100/month supplementary income. Residence permit renewal at Deggendorf Ausländerbehörde: EUR 50–110.",
        },
        {
          yearLabel: "Year 3 (Semesters 5–6)",
          tuitionUsd: 0,
          hostelUsd: 3456,
          livingUsd: 6264,
          totalUsd: 9720,
          notes:
            "Tuition EUR 0. Non-EU service fees EUR 1,164. Complex Care and Health Literacy semesters. Practical Training 5 (10 ECTS) and Practical Training 6 (15 ECTS) — the largest clinical block so far. Training stipend from partner institution continues. Deutschlandstipendium (EUR 300/month, 12 months) may be applied for after 1–2 semesters of strong academic performance. Residence permit renewal: EUR 50–110.",
        },
        {
          yearLabel: "Year 4 (Semesters 7–8)",
          tuitionUsd: 0,
          hostelUsd: 3456,
          livingUsd: 6264,
          totalUsd: 9720,
          notes:
            "Tuition EUR 0. Non-EU service fees EUR 1,164 (total programme fees now EUR 4,656 over 4 years). Healthcare Management and Final Clinical Placement (Practical Training 8: 20 ECTS — the heaviest clinical block). Bachelor thesis research and defence in German. Begin job applications with Bavarian and Munich hospitals toward end of Year 4. After graduation, apply immediately for 18-month Job Seeker Residence Permit (Section 20 AufenthG). Training stipend continues during practical phases. Most DIT nursing graduates have a nursing job offer within weeks of graduation.",
        },
      ],
      licenseExamSupport: [
        "German state nursing licence (Berufserlaubnis als Pflegefachkraft) — awarded as part of the DIT BSc graduation. No separate Staatsexamen or licensing exam required beyond successful programme completion. You ARE a German-licensed nurse from graduation day.",
        "EU Directive 2005/36/EC — DIT nursing licence is automatically recognised across all 27 EU member states for nursing practice.",
        "No Berufsanerkennung required — unlike Indian-trained nurses who must go through a 6–18 month German recognition process, DIT graduates trained IN Germany and hold the licence directly.",
        "UK NMC International Registration — German BSc Nursing accepted; specific recognition route for EU-qualified nurses; CBT and OSCE required.",
        "NCLEX-RN (Canada/USA) — German BSc Nursing eligible for CGFNS credential evaluation for US and Canadian nursing licensure.",
        "Austria mutual recognition — German nursing licence recognised in Austria (CHF/EUR salary significantly above German average in some Austrian cantons; Swiss nurses earn CHF 5,000–8,000/month).",
        "MSc Nursing / MBA Health Management — available at German universities after BSc; DIT itself offers further education programmes for continuing professional development.",
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
      "\n🏫 Upserting university: Deggendorf Institute of Technology (DIT)…"
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
    console.log(
      `✓ University upserted: ${university.name} (id=${universityId})`
    );

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
      "\n✅ DIT Deggendorf BSc Nursing (International) seeded successfully."
    );
    console.log(`   Country:     Germany (id=${germanyId})`);
    console.log(
      `   University:  ${university.name} (id=${universityId})`
    );
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
