import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ─── Shared IMAT admissions process ───────────────────────────────────────────
// Injected into every university's admissions_content with university-specific
// notes on competitiveness, intake size, and application nuance.

function buildAdmissionsContent(uni) {
  return {
    overview: `${uni.name} admits international students to the 6-year Medicine and Surgery (MD) program through IMAT — Italy's standardised English-medium medical admissions test administered by the Italian Ministry of University and Research (MUR). Admission is purely rank-based: your IMAT score and university preference order determine your seat. Students Traffic manages the full IMAT application cycle and post-offer process for every enrolled student.`,
    eligibility: {
      intro: "To apply for IMAT admission to an Italian public medical university, Indian students must meet:",
      items: [
        "Completed Class 12 with Physics, Chemistry, and Biology — minimum 50% aggregate (General category) or 40% (SC/ST/OBC).",
        "Valid NEET-UG qualifying score — the NMC framework requires a minimum qualifying percentile (50th for General, 40th for SC/ST/OBC). NEET score is not used for IMAT ranking but is needed for the NMC Eligibility Certificate.",
        "Valid Indian passport with at least 18 months validity at time of application.",
        "Minimum age of 17 at the time of admission.",
        "No IELTS or TOEFL required — IMAT itself is conducted in English.",
      ],
    },
    deadlinesNote: `IMAT is held in September each year. Registration opens on universitaly.it in April-May. The full cycle — IMAT registration, exam, results, NMC certificate, and Italian student visa — must be planned from April with a target arrival in ${uni.city} by October for the start of the academic year.`,
    admissionSteps: [
      "Register on universitaly.it (April–July): Create your account, upload Class 12 transcripts, NEET scorecard, and passport. List up to 4 university preferences in order. Pay the IMAT registration fee (~€30). This registration also serves as your Italian university application.",
      "Sit IMAT in September: A 100-question multiple choice test over 100 minutes. Sections cover Biology (23 Qs), Chemistry (15 Qs), Physics & Maths (8 Qs), Critical Reasoning & Problem Solving (27 Qs), and Cultural Reading & General Knowledge (27 Qs). Test centres in India are operated by British Council and IDP.",
      "IMAT results and seat allocation (October): The Italian MUR publishes the national rank list. Seats are allocated by score and preference order. If you receive an offer from your chosen university, the conditional offer letter is issued.",
      "Obtain NMC Eligibility Certificate: Apply at nmc.org.in immediately on receiving the offer letter — with your passport, NEET scorecard, Class 12 certificates, and the university offer letter. Processing takes 10–15 working days. This certificate is legally required before you board a flight to Italy.",
      `Apply for Italian Type D National Student Visa: Submit to the Italian Embassy or Consulate in India (Chennai, Mumbai, Delhi, or Kolkata) — with the university acceptance letter, proof of financial means (minimum €6,000 per year demonstrated), accommodation confirmation in ${uni.city}, health insurance, and valid passport. Visa fee: ~€116. Processing: 30–90 days. Apply immediately after the offer letter arrives.`,
      `Travel to ${uni.city} and complete university enrollment: Arrive before the October matriculation date. Obtain your Codice Fiscale (Italian tax number) from the Agenzia delle Entrate — required before any official process. Complete university enrollment, collect student ID, and register at the health system (SSN/ASL) for healthcare coverage.`,
      "Apply for Permesso di Soggiorno (Residence Permit): Within 8 working days of arrival, apply at any Italian Post Office (Poste Italiane) for the Permesso di Soggiorno — Italy's residence permit for non-EU students. Required documents: passport, visa, university enrollment confirmation, accommodation proof, and passport photographs. Fee: €70–200. Processing: 2–6 months but the application receipt (ricevuta) serves as legal residency proof while you wait.",
    ],
    licensingPathway: [
      `${uni.name}'s Medicine and Surgery degree is WHO-recognised and graduates are eligible for FMGE/NExT — the licensing examination required for NMC registration and the right to practise medicine in India.`,
      "ECFMG certification is available for graduates of WHO-listed Italian universities — opening USMLE Steps 1, 2 CK, and 3 for US medical residency.",
      "official regulatory verification enables the PLAB 1 and PLAB 2 pathway to UK GMC registration.",
      "WHO listing meets the AMC CAT and Clinical Exam eligibility for Australian medical registration.",
    ],
    documentsRequired: {
      imat: [
        "Valid Indian passport (minimum 18 months validity).",
        "Class 10 and Class 12 mark sheets and passing certificates.",
        "NEET-UG scorecard.",
        "Passport photographs (white background).",
        "universitaly.it account registration with uploaded documents.",
      ],
      visa: [
        "University conditional offer / acceptance letter from universitaly.it.",
        "Proof of financial means: bank statement or scholarship confirmation showing minimum €6,000 per year.",
        `Accommodation proof in ${uni.city} (rental agreement or university housing confirmation).`,
        "Health and travel insurance valid for Italy.",
        "Completed Italian visa application form (online + physical submission).",
        "Valid passport (minimum 6 months validity beyond intended stay).",
        "School / migration certificate.",
      ],
      onArrival: [
        "Codice Fiscale application at Agenzia delle Entrate.",
        "University enrollment package (mark sheets originals + NMC certificate originals).",
        "Permesso di Soggiorno kit from Poste Italiane.",
        "SSN/ASL health registration documents.",
      ],
    },
  };
}

// ─── University enrichment data ────────────────────────────────────────────────

const enrichments = [
  // ── 1. University of Bologna ──────────────────────────────────────────────
  {
    slug: "university-of-bologna-italy",
    why_choose: [
      "The world's oldest university (founded 1088) with over 900 years of continuous medical education — Bologna's Medicine and Surgery degree carries a global reputation matched by very few institutions.",
      "QS Medicine ranking 51–100 globally and Censis national rank #1 in Italy: every internationally comparable metric places Bologna at the top of the Italian medical education system.",
      "Sant'Orsola Malpighi Polyclinic is one of Italy's premier clinical training environments — 1,500+ beds, active across transplantation, oncology, and complex cardiovascular care.",
      "ER.GO subsidised accommodation is available for income-qualifying students — reducing living costs significantly in an otherwise higher-cost Italian city.",
      "Graduates are ECFMG-eligible for USMLE, PLAB-eligible for UK GMC registration, and AMC-eligible for Australian medical registration — the full suite of post-graduation international options.",
    ],
    best_fit_for: [
      "High-scoring IMAT candidates who have prepared seriously and are targeting Italy's most prestigious name for their medical degree.",
      "Students building toward USMLE, PLAB, or European specialist pathways where an internationally recognised university brand carries weight.",
      "Students who want Bologna's academic culture — one of Europe's most intellectually active and student-centred university cities.",
      "Families who have benchmarked IMAT intensively and want the institution whose name needs no explanation.",
    ],
    things_to_consider: [
      "Bologna is Italy's most competitive IMAT destination — scores of 90+ have historically been necessary. Underprepared IMAT candidates should assess their score realistically before listing it as first choice.",
      "Living costs in Bologna are above average for Italy — €700–1,100 per month. ER.GO subsidised housing requires income eligibility and early application.",
      "English outside the medical faculty and international student community is limited. Day-to-day life in Bologna requires some Italian or willingness to adapt.",
    ],
    recognition_badges: [
      "QS 51–100 Medicine",
      "Censis Rank #1 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
    ],
    faq: [
      { question: "Is the University of Bologna's medicine degree valid for FMGE/NExT in India?", answer: "Yes. Bologna's Medicine and Surgery degree is WHO-recognised. Graduates who hold a valid NMC Eligibility Certificate (obtained before departure) are eligible to appear for FMGE/NExT and obtain NMC registration. Students Traffic verifies NMC eligibility for every student before the application is filed." },
      { question: "What IMAT score do I need for Bologna?", answer: "Bologna is Italy's most competitive IMAT university. Historically, scores of 90+ (out of 90 maximum) have been necessary for a realistic chance, though this varies year on year based on the applicant pool. Students Traffic tracks annual IMAT cutoffs across all 16 Italian universities and provides score-based university matching to each student." },
      { question: "Is ER.GO housing available for Indian students at Bologna?", answer: "Yes, if you meet the income eligibility criteria. ER.GO (Emilia-Romagna Regional Agency) provides subsidised accommodation for qualifying international students. Applications open after enrollment confirmation. Students Traffic advises on the ER.GO process and alternative private housing options for those who don't qualify." },
      { question: "What is the IMAT registration process for Bologna?", answer: "Bologna is listed on universitaly.it — you rank it in your preference order during IMAT registration (April–July). Seat allocation is based on your IMAT score relative to other applicants who ranked Bologna. There is no separate application to Bologna directly for IMAT-admitted students." },
      { question: "Does Bologna offer ECFMG and USMLE eligibility?", answer: "Yes. Bologna's degrees are listed with ECFMG, enabling graduates to pursue ECFMG certification and subsequently USMLE Steps 1, 2 CK, and 3 for US medical residency. Students Traffic includes USMLE and licensing pathway guidance for all enrolled Italy students." },
      { question: "How is Bologna's clinical training structured?", answer: "Early clinical contact begins from Year 3 at Sant'Orsola Malpighi Polyclinic — one of Italy's largest teaching hospitals. Years 4–6 involve progressively intensive rotations across all major specialties. Year 6 includes a structured internship equivalent." },
      { question: "What is the monthly cost of living in Bologna?", answer: "Students at Bologna report monthly expenses of €700–1,100 covering accommodation, food, transport, and personal spending. ER.GO subsidised housing, if secured, significantly reduces accommodation costs. Bologna is more expensive than southern Italian university cities but offers strong quality of life." },
      { question: "Does Students Traffic help with the full Bologna IMAT process?", answer: "Yes. Students Traffic manages the complete cycle: IMAT preparation guidance, universitaly.it registration, post-offer NMC Eligibility Certificate, Italian student visa documentation, pre-departure briefing, and arrival support in Bologna. Contact us on +91 91761 62888 to begin." },
    ],
  },

  // ── 2. Sapienza University of Rome ───────────────────────────────────────
  {
    slug: "sapienza-university-of-rome",
    why_choose: [
      "Europe's largest university by student enrolment — Sapienza's scale means unmatched clinical infrastructure, research access, and academic resources across Medicine's full 6-year curriculum.",
      "QS Medicine ranking 101–150 globally and Censis national rank #2 in Italy: Sapienza is the dominant medical institution in Italy's capital and one of the most recognised Italian medical schools internationally.",
      "Policlinico Umberto I is one of Italy's largest academic medical centres — a full-service teaching hospital with exceptional clinical volume across all major specialties, providing exactly the case breadth FMGE/NExT preparation requires.",
      "Rome's position as Italy's capital means post-graduation career connectivity — international organisations, research institutions, and a health professional network that extends across Europe and beyond.",
      "One of Italy's largest Indian student communities in Rome provides strong peer support, community resources, and practical guidance from students already in the system.",
    ],
    best_fit_for: [
      "Students building toward USMLE, PLAB, or global specialist pathways who want the weight of Rome and a QS-ranked institution behind their degree.",
      "Students who thrive in large, research-active university environments and want the breadth of Rome's clinical ecosystem for six years of training.",
      "Students for whom peer community matters — Sapienza has one of Italy's strongest Indian MBBS cohorts.",
      "Families who want Italy's capital-city advantages for their child's six years of medical education.",
    ],
    things_to_consider: [
      "Sapienza's scale can feel impersonal — students who do not actively engage with faculty and peer networks may find the large-university dynamic difficult. Proactive engagement is essential.",
      "Rome is among Italy's most expensive cities for students. Monthly living costs of €700–1,100 require a realistic budget and early housing planning — competition for student accommodation is high.",
      "Housing must be arranged 4–6 months before arrival. LaDisP subsidised accommodation is competitive and limited. Students Traffic helps plan housing before departure.",
    ],
    recognition_badges: [
      "QS 101–150 Medicine",
      "Censis Rank #2 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
    ],
    faq: [
      { question: "Is Sapienza's medicine degree NMC-recognised for Indian graduates?", answer: "Yes. Sapienza's Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate (obtained before departure), graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the NMC certificate application for every enrolled student." },
      { question: "What IMAT score is needed for Sapienza?", answer: "Sapienza is one of Italy's more competitive destinations — typically requiring IMAT scores of 85–90+ for a strong probability of allocation. Score thresholds vary year on year. Students Traffic tracks annual cutoffs and guides students on realistic preference ordering." },
      { question: "How does Students Traffic help with Rome housing?", answer: "Rome housing is the single most common source of stress for new Sapienza students. Students Traffic advises on LaDisP subsidised housing eligibility, vetted private apartment networks near the Sapienza medical faculty, and the timeline for securing accommodation before departure." },
      { question: "Is Policlinico Umberto I a strong clinical training hospital?", answer: "Yes — Policlinico Umberto I is one of Italy's largest academic hospitals with high clinical volume across cardiology, oncology, neurology, and emergency medicine. The breadth of case exposure is directly relevant to FMGE/NExT preparation." },
      { question: "Does Sapienza offer ECFMG and USMLE eligibility?", answer: "Yes. Sapienza is ECFMG-listed. Graduates can pursue ECFMG certification and USMLE Steps 1, 2 CK, and 3 for US residency. Students Traffic provides USMLE pathway guidance alongside IMAT admissions support." },
      { question: "What is the Indian community like at Sapienza?", answer: "Sapienza has one of the largest Indian MBBS student cohorts in Italy. Indian restaurants, grocery stores, and cultural resources are accessible throughout Rome. The peer network at Sapienza is a genuine practical asset — especially in the first year of adaptation." },
      { question: "What is the monthly cost of living in Rome for Sapienza students?", answer: "Monthly living costs in Rome range from €700–1,100, depending on accommodation proximity to campus. Shared apartments near Sapienza's medical faculty in the Policlinico area run €350–550 per person. Food and transport add €200–350 per month." },
      { question: "How do I start the IMAT process for Sapienza with Students Traffic?", answer: "Contact Students Traffic at +91 91761 62888 or hello@studentstraffic.com. Our counsellors compare Sapienza against all 16 Italian IMAT universities for your IMAT score range, guide universitaly.it registration, and manage the NMC certificate and visa process post-offer." },
    ],
  },

  // ── 3. University of Milan ────────────────────────────────────────────────
  {
    slug: "university-of-milan-italy",
    why_choose: [
      "QS Medicine ranking 101–150 globally and Censis #3 nationally — the University of Milan is Italy's premier medical institution in its most economically powerful city, and the combination of academic standing and career geography is unique.",
      "Ca' Granda Ospedale Maggiore Policlinico has 500+ years of continuous clinical operation — the depth of its surgical and specialist case volume means Milan students build clinical competence at a pace matched by few Italian peers.",
      "Lombardy is Italy's most advanced healthcare system — training in Milan places students inside Italy's most technology-intensive, research-active clinical ecosystem from Year 3 onwards.",
      "Milan's professional network for post-graduation is the strongest in Italy: international organisations, European pharmaceutical companies, and a health professional career track unavailable in smaller Italian cities.",
      "Large South Asian community in Milan means genuine support infrastructure — Indian restaurants, grocery stores, cultural networks, and community coordination are all in place.",
    ],
    best_fit_for: [
      "Students targeting European specialist training, USMLE pathways, or international professional careers who want Italy's most connected city behind their degree.",
      "Students whose families can support a premium-city budget for six years and want the Milan professional advantage alongside a top-3 ranked Italian university.",
      "Research-oriented students interested in academic medicine or clinical specialisation — Lombardy's research ecosystem is Italy's most active.",
    ],
    things_to_consider: [
      "Milan is the most expensive Italian city for students. Monthly living costs of €900–1,400 require serious financial planning. Early housing arrangements are essential — demand is high year-round.",
      "The pace and scale of Milan can be challenging for students accustomed to quieter environments. Students who want a compact, slower academic city should consider Pavia (35 minutes by rail) for the same clinical infrastructure at lower cost.",
      "EDiSU subsidised housing is limited and competitive. Most international students arrange private shared apartments. Students Traffic helps plan accommodation 4–6 months before arrival.",
    ],
    recognition_badges: [
      "QS 101–150 Medicine",
      "Censis Rank #3 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
    ],
    faq: [
      { question: "Is the University of Milan's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree from the University of Milan is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the NMC certificate for every enrolled student." },
      { question: "What IMAT score is needed for the University of Milan?", answer: "The University of Milan is competitive — typically requiring IMAT scores of 80–88+ for a realistic allocation probability. Annual cutoffs vary with the applicant pool. Students Traffic tracks Italy-wide cutoff trends and advises on optimal preference ordering." },
      { question: "How does Ca' Granda Policlinico compare as a teaching hospital?", answer: "Ca' Granda is one of Italy's oldest (founded 1456) and most comprehensive teaching hospitals — with 1,500+ beds and high research activity across cardiology, oncology, transplantation, and neurology. Clinical training volume in Milan is among the highest in Italy." },
      { question: "Is Milan too expensive for Indian MBBS students?", answer: "Milan is Italy's most expensive university city. Monthly costs of €900–1,400 are realistic. Students who need lower costs with equivalent clinical quality should evaluate Pavia (35 minutes from Milan) or Turin — both offer strong training at significantly lower expense." },
      { question: "Does Students Traffic help with Milan housing?", answer: "Yes. Milan housing is competitive and requires planning 4–6 months before arrival. Students Traffic connects enrolled students with vetted accommodation networks near the medical faculty and helps navigate EDiSU subsidy eligibility." },
      { question: "What post-graduation options does a Milan degree open?", answer: "A WHO-recognised Medicine and Surgery degree from the University of Milan opens: FMGE/NExT for Indian practice, ECFMG/USMLE for US residency, PLAB for UK GMC registration, and AMC for Australia. Milan's professional network additionally supports European specialist pathways." },
      { question: "Is there a large Indian community in Milan?", answer: "Yes — Milan has one of Italy's largest South Asian communities. Indian restaurants, Halal grocers, and Asian supermarkets are accessible by metro from the medical faculty. Indian student societies coordinate community and practical support." },
      { question: "How does Students Traffic manage the Italy IMAT process?", answer: "Students Traffic manages the full cycle: IMAT strategy and preparation guidance, universitaly.it registration, post-offer NMC Eligibility Certificate, Italian Type D visa documentation, pre-departure Milan briefing, and arrival support. Call +91 91761 62888 to get started." },
    ],
  },

  // ── 4. University of Padova ───────────────────────────────────────────────
  {
    slug: "university-of-padova-italy",
    why_choose: [
      "Founded in 1222, the University of Padova is the birthplace of modern scientific medicine — Vesalius wrote De Humani Corporis Fabrica here, Galileo taught physics here, and the world's first permanent anatomy theatre opened here. That heritage informs the depth of its medical curriculum.",
      "QS Medicine ranking 101–150 globally and Censis #4 nationally — Padova is among Italy's top medical schools with research output and clinical training that rank with Europe's best.",
      "Azienda Ospedaliera-Università di Padova is one of Northern Italy's most active research hospitals — offering strong exposure to rare disease, transplantation, and specialist surgical training alongside standard rotations.",
      "Padova is significantly more affordable than Milan or Rome while offering equivalent academic quality — monthly living costs of €650–900 versus €900–1,400 in Milan is a meaningful six-year difference.",
      "Location 35 km from Venice gives students weekend access to one of Europe's most extraordinary cities while living in a compact, safe, university-oriented environment.",
    ],
    best_fit_for: [
      "Academically strong students who want a top-4 Italian university with deep medical heritage and research culture without paying Milan or Rome living costs.",
      "Students whose priority is medical training quality and academic tradition over city lifestyle — Padova delivers both without the premium of larger Italian cities.",
      "Students interested in research, rare disease specialisation, or academic medicine who want access to Padova's internationally active research hospital.",
    ],
    things_to_consider: [
      "Padova is a smaller university city — English is limited outside the medical faculty and international student community. Students need some Italian for daily life within the first year.",
      "Winters in the Veneto region are cold and foggy. Students from warm-climate regions of India should factor in the climate difference.",
      "The Indian student community is smaller than Rome or Milan. Students who depend on a large Indian peer network should consider Rome or Milan instead.",
    ],
    recognition_badges: [
      "QS 101–150 Medicine",
      "Censis Rank #4 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Birthplace of Modern Anatomy",
    ],
    faq: [
      { question: "Is Padova's Medicine degree valid for FMGE/NExT and NMC registration?", answer: "Yes. The University of Padova's Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and full NMC registration. Students Traffic handles the NMC certificate for every student enrolled through us." },
      { question: "What IMAT score is needed for Padova?", answer: "Padova is among Italy's top-5 IMAT destinations. Competitive allocation typically requires IMAT scores of 82–90+. Annual cutoffs vary. Students Traffic tracks Italy-wide IMAT cutoff data year on year and advises on realistic university preference ordering." },
      { question: "Why is Padova called the birthplace of modern medicine?", answer: "The world's first permanent anatomy theatre (Teatro Anatomico, 1594) opened at Padova. Andreas Vesalius wrote the foundational text of modern anatomy here. Galileo taught physics at Padova for 18 years. This medical heritage is reflected in the depth and scientific rigour of the curriculum to this day." },
      { question: "How does Padova compare to Bologna for IMAT?", answer: "Both are among Italy's top universities. Bologna holds the Censis #1 rank nationally; Padova (#4) holds a slight historical edge in medicine specifically. For Indian students, both are WHO-recognised, NMC-eligible, and ECFMG-listed. The practical difference is cost: Padova is modestly more affordable. Students Traffic can advise which better fits your IMAT score and profile." },
      { question: "Is ESU Padova housing available for international students?", answer: "ESU Padova operates university-affiliated student housing for qualifying students. Subsidised rooms are limited — early application is important. Private shared apartments in Padova run €350–550 per person, which is significantly below Milan or Rome prices." },
      { question: "What clinical training does Padova offer?", answer: "Clinical rotations use the Azienda Ospedaliera-Università di Padova — a large research-active teaching hospital strong in transplantation, oncology, rare disease, and surgical specialties. Clinical contact begins from Year 3." },
      { question: "Is Padova safe for Indian students?", answer: "Yes — Padova is one of Northern Italy's safest mid-size cities. University areas are walkable, well-lit, and well-monitored. Petty theft in tourist zones is the main urban risk; university and residential areas are considered very safe." },
      { question: "How does Students Traffic support the Padova IMAT application?", answer: "Students Traffic manages universitaly.it registration, IMAT preference strategy, post-offer NMC Eligibility Certificate application, Italian Type D visa documentation, and arrival support in Padova. Contact us at +91 91761 62888." },
    ],
  },

  // ── 5. University of Pavia ────────────────────────────────────────────────
  {
    slug: "university-of-pavia-italy",
    why_choose: [
      "QS Medicine ranking 151–200 globally and Censis #5 nationally — Pavia punches significantly above its city-size weight, ranking as one of Europe's genuinely distinguished medical institutions.",
      "IRCCS Policlinico San Matteo is a nationally certified IRCCS research-level clinical institute — one of Italy's most prestigious hospital designations, meaning clinical training occurs in an environment where cutting-edge research and patient care operate side by side.",
      "Pavia's collegiate university system (Collegi Universitari) is unique in Italy — residential colleges with centuries of tradition offer an academic environment more like Oxford or Cambridge than typical Italian medical schools.",
      "35 km from Milan and 25 minutes by train — students get a focused, affordable smaller-city study base with Milan's professional and cultural network on demand.",
      "Living costs in Pavia are significantly lower than Milan (€550–800 vs €900–1,400 monthly) while training at a clinically equivalent or superior standard.",
    ],
    best_fit_for: [
      "Students who want top-5 Italian university quality at a fraction of Milan's cost — Pavia offers the IRCCS San Matteo hospital, Censis #5, and QS 151–200 for €300–400 less per month than Milan.",
      "Students who value a focused, safe, compact academic city over urban scale — Pavia's small-city intensity suits students who study well in contained environments.",
      "Research-oriented students who want access to an IRCCS-certified hospital from early clinical years.",
    ],
    things_to_consider: [
      "Pavia is a small city with limited English outside the university and medical faculty. Day-to-day life requires Italian or willingness to adapt quickly.",
      "Social options in Pavia are more contained than Milan or Rome. Students who need a large city lifestyle will find Pavia's scale limiting — though Milan is 25 minutes away.",
      "The Indian student community in Pavia is small. Students who depend heavily on Indian peer networks should evaluate Rome or Milan instead.",
    ],
    recognition_badges: [
      "QS 151–200 Medicine",
      "Censis Rank #5 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "IRCCS Research Hospital",
    ],
    faq: [
      { question: "What makes Pavia different from other Italian MBBS universities?", answer: "Pavia combines Censis #5 national ranking, an IRCCS-certified research teaching hospital, a unique collegiate residential system, and significantly lower living costs than Milan — 25 minutes away by train. Very few Italian universities offer this value proposition at this academic level." },
      { question: "What is IRCCS Policlinico San Matteo?", answer: "IRCCS (Istituto di Ricovero e Cura a Carattere Scientifico) is Italy's highest hospital designation — awarded to institutions combining outstanding patient care with nationally significant clinical research. Policlinico San Matteo is one of the few IRCCS hospitals in Northern Italy, with particular strength in cardiology, oncology, and transplant surgery." },
      { question: "What IMAT score is needed for Pavia?", answer: "Pavia is competitive but typically slightly less so than Bologna or Padova — scores of 78–85+ are often sufficient for allocation, though this varies year on year. Students Traffic tracks Italy-wide cutoffs and advises on score-based preference ordering." },
      { question: "Is Pavia's medicine degree valid for India, US, UK, and Australia?", answer: "Yes. The University of Pavia's Medicine and Surgery degree is WHO-recognised, NMC-eligible for FMGE/NExT, ECFMG-listed for USMLE, PLAB-eligible for UK GMC registration, and AMC-eligible for Australia. Students Traffic verifies this for every student before filing any application." },
      { question: "What is the collegiate system at Pavia?", answer: "Pavia operates Collegi Universitari — residential academic colleges with centuries of tradition, selection processes, and merit-based scholarships. Historically, colleges like Collegio Ghislieri and Collegio Cairoli have produced exceptional graduates. Acceptance to a college is separate from IMAT admission and highly prestigious." },
      { question: "How does Pavia compare to Milan for Indian MBBS students?", answer: "Pavia offers Censis #5 quality (vs Milan at #3) at €350–600 less per month. The IRCCS Policlinico San Matteo is arguably clinically equivalent to Ca' Granda. Milan is 25 minutes away by train. For budget-conscious students who don't need to live in Milan, Pavia is one of Italy's strongest value propositions." },
      { question: "Is EDiSU Pavia housing accessible for Indian students?", answer: "Yes — EDiSU Pavia manages affordable university residences including the historic college system. Availability for international students is better than in larger Italian cities. Private shared apartments in Pavia cost €300–500 per person." },
      { question: "How does Students Traffic support Pavia-bound students?", answer: "Students Traffic manages the complete IMAT and post-offer process for Pavia: universitaly.it registration, IMAT preference strategy, NMC Eligibility Certificate, Italian Type D visa, pre-departure briefing, and arrival support. Call us at +91 91761 62888." },
    ],
  },

  // ── 6. University of Turin ────────────────────────────────────────────────
  {
    slug: "university-of-turin-italy",
    why_choose: [
      "Founded in 1404 and ranked QS 151–200 globally in medicine and Censis #6 nationally — the University of Turin is Italy's fourth-largest city's premier institution, with research output and clinical infrastructure that ranks comfortably in the European top tier.",
      "Città della Salute e della Scienza is one of Northern Italy's most comprehensive teaching hospital complexes — a research-active multi-specialty centre with particularly strong oncology, neuroscience, and cardiovascular clinical training.",
      "Turin's cost of living (€650–950 per month) is significantly lower than Milan while offering clinically equivalent training — a meaningful advantage for families managing a precise education budget over six years.",
      "The Italian Alps are an hour from Turin — a genuine quality-of-life differentiator for students who benefit from outdoor recreation as a stress management tool during demanding medical studies.",
      "ECFMG-eligible for USMLE, PLAB-eligible for UK GMC, and AMC-eligible for Australian registration — the full international post-graduation pathway is available.",
    ],
    best_fit_for: [
      "Research-oriented students who want a Censis top-6 university in a lower-cost northern Italian city — Turin offers Bologna/Milan academic quality at Padova-level prices.",
      "Students building toward academic medicine, specialist training in Europe, or post-graduation pathways outside India who want an internationally recognised northern Italian institution.",
      "Students who want a full Italian city experience — culture, food, architecture — without paying Rome or Milan living costs.",
    ],
    things_to_consider: [
      "Turin has less international visibility than Milan or Rome for Indian MBBS applicants — though this reflects name recognition, not clinical or academic quality.",
      "The city is less tourist-oriented than Rome or Florence — English is less prevalent outside the university campus and medical faculty.",
      "Winters in Turin can be cold with Alpine influence. Students from warm-climate regions should prepare for a genuine northern Italian winter.",
    ],
    recognition_badges: [
      "QS 151–200 Medicine",
      "Censis Rank #6 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
    ],
    faq: [
      { question: "Is the University of Turin's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the NMC certificate for every enrolled student." },
      { question: "What IMAT score is needed for Turin?", answer: "Turin is competitive but generally requires slightly lower IMAT scores than Bologna, Padova, or Milan — typically 75–84+ for realistic allocation. Students Traffic tracks annual cutoff data and advises on score-based preference ordering across all 16 Italian universities." },
      { question: "How does the Città della Salute hospital compare as a training environment?", answer: "Città della Salute e della Scienza di Torino is one of Northern Italy's largest and most research-active hospital complexes. Particularly strong in oncology, transplantation, neuroscience, and cardiovascular surgery — providing genuine breadth for the FMGE/NExT-relevant clinical rotations." },
      { question: "Is Turin more affordable than Milan for Indian MBBS students?", answer: "Yes — significantly. Monthly living costs in Turin (€650–950) are €250–450 lower than Milan (€900–1,400). For a six-year program this difference is substantial. Clinical training quality is comparable. Students Traffic models total 6-year cost across all Italian universities before making any recommendation." },
      { question: "Does the University of Turin offer ECFMG and USMLE eligibility?", answer: "Yes. The University of Turin is ECFMG-listed. Graduates can pursue ECFMG certification and USMLE Steps 1, 2 CK, and 3. Students Traffic includes licensing pathway guidance alongside IMAT admissions support." },
      { question: "What is EDISU Piemonte housing and is it available for international students?", answer: "EDISU Piemonte manages the regional student housing authority for Turin. Subsidised rooms are available for income-qualifying students. Private shared apartments in Turin cost €350–550 per person — significantly below Milan." },
      { question: "Is Turin safe for Indian MBBS students?", answer: "Yes. Turin is a well-managed Italian city with a strong university presence. University and residential areas are considered safe. Standard urban awareness applies in busier areas, but crime affecting students is very low." },
      { question: "How does Students Traffic support Turin-bound students?", answer: "Students Traffic manages the full IMAT cycle for Turin: universitaly.it registration, IMAT preference strategy, post-offer NMC certificate, Italian visa documentation, and arrival support. Call +91 91761 62888 to begin planning." },
    ],
  },

  // ── 7. University of Milan-Bicocca ────────────────────────────────────────
  {
    slug: "university-of-milan-bicocca",
    why_choose: [
      "QS Medicine ranking 201–250 globally and Censis #7 nationally — Milan-Bicocca's international medicine program in Bergamo combines a well-ranked university pedigree with ASST Papa Giovanni XXIII, one of Italy's most advanced modern hospital complexes.",
      "Problem-based learning (PBL) model distinguishes Bicocca from lecture-heavy Italian peers — smaller group sizes, case-driven learning, and active clinical reasoning from early years prepare students for modern medical practice more effectively.",
      "ASST Papa Giovanni XXIII in Bergamo gained international attention for its COVID-19 clinical response — it operates as a genuinely high-capacity, high-acuity hospital with technology infrastructure matched by few Italian institutions.",
      "Bergamo's cost of living (€600–850 per month) is significantly lower than central Milan while keeping Milan accessible by train in under 45 minutes.",
      "UNESCO World Heritage Città Alta (upper city) and the surrounding Lombardy landscape give students a study environment that combines historic Italian beauty with modern university infrastructure.",
    ],
    best_fit_for: [
      "Students who learn better through case-based and problem-based approaches than through traditional lectures — Bicocca's PBL model is the right fit for self-directed, analytically oriented learners.",
      "Students who want Milan's career proximity and Censis top-10 quality at a lower cost base, in a safer and more intimate city environment than central Milan.",
      "Students interested in technology-integrated hospital training — ASST Papa Giovanni XXIII is among Italy's most advanced acute care centres.",
    ],
    things_to_consider: [
      "The international medicine program is based in Bergamo — not on the main Bicocca Milan campus. Students whose primary goal was living in Milan itself should understand the campus arrangement before applying.",
      "Milan-Bicocca was founded in 1998 — it has a shorter institutional history than Bologna, Padova, or Pavia. The PBL program is well-structured but has a shorter alumni network.",
      "The Indian student community in Bergamo is small. Students who depend on a large Indian peer group should plan for more self-reliance in the first year.",
    ],
    recognition_badges: [
      "QS 201–250 Medicine",
      "Censis Rank #7 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Problem-Based Learning Model",
    ],
    faq: [
      { question: "Is the Milan-Bicocca medicine program in Milan or Bergamo?", answer: "The English-medium international Medicine and Surgery program is based in Bergamo — about 50 km northeast of Milan. Bicocca's main campus is in Milan but the international medicine cohort is housed in Bergamo, with clinical training at ASST Papa Giovanni XXIII." },
      { question: "What is problem-based learning and why does it matter?", answer: "PBL uses real or simulated patient cases as the starting point for learning — rather than lectures. Students identify what they need to know, research it, and return to solve the clinical problem. This approach builds clinical reasoning and self-directed learning habits that are directly valuable for FMGE/NExT and for actual medical practice." },
      { question: "What IMAT score is needed for Milan-Bicocca?", answer: "Bicocca's Bergamo program is typically less competitive than Bologna or Padova — scores of 70–80+ have historically been sufficient for allocation, though this varies. Students Traffic tracks annual cutoffs and advises on preference ordering." },
      { question: "Is ASST Papa Giovanni XXIII a good teaching hospital?", answer: "Yes — it is one of Italy's most modern and high-capacity acute care hospitals. It gained international clinical recognition during COVID-19. Strong in emergency medicine, cardiology, and critical care." },
      { question: "Is the Milan-Bicocca degree NMC-eligible?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised and NMC-eligible for FMGE/NExT. With a valid NMC Eligibility Certificate, graduates can appear for the licensing examination. Students Traffic handles the NMC certificate as part of its standard service." },
      { question: "How does Bergamo's cost of living compare to Milan?", answer: "Bergamo monthly living costs (€600–850) are €250–400 lower than central Milan. Private shared apartments in Bergamo cost €350–500 per person versus €500–700 in Milan. University residences near the Bergamo campus are more accessible than Milan-city accommodation." },
      { question: "Can students get to Milan from Bergamo for weekends?", answer: "Yes — direct trains from Bergamo to Milan Central take 45–55 minutes and run frequently. The combination of Bergamo study base with Milan weekend access is one of this program's practical advantages." },
      { question: "How does Students Traffic handle Bicocca-Bergamo admissions?", answer: "Students Traffic manages universitaly.it registration, IMAT strategy for Bicocca preference, post-offer NMC certificate, Italian visa documentation, and pre-departure briefing specific to Bergamo. Contact +91 91761 62888 or hello@studentstraffic.com." },
    ],
  },

  // ── 8. University of Bari Aldo Moro ──────────────────────────────────────
  {
    slug: "university-of-bari-aldo-moro",
    why_choose: [
      "QS Medicine ranking 201–250 globally and Censis #8 nationally — Bari is Italy's top medical university in the south, and the Bari English Medical Curriculum (BEMC) is one of the most purpose-built international programs in the Italian system.",
      "BEMC (Bari English Medical Curriculum) was designed specifically for international students — with English-medium clinical coordination, international faculty orientation, and structured support for students from non-Italian educational backgrounds.",
      "Policlinico di Bari is one of Southern Italy's largest and most active teaching hospital complexes — high patient volume across cardiology, oncology, gastroenterology, and emergency medicine delivers the clinical breadth FMGE/NExT preparation requires.",
      "Bari is among Italy's most affordable university cities — monthly living costs of €500–750 make it one of the most cost-effective routes to a Censis top-10 Italian medical degree.",
      "Warm Mediterranean climate year-round provides easier climate adaptation for students from India's tropical and subtropical regions.",
    ],
    best_fit_for: [
      "Budget-conscious students who want Censis top-10 Italian MBBS quality without paying northern-city costs — Bari delivers clinical and academic quality at €200–400 less per month than Milan or Rome.",
      "Students from southern India whose climate adaptation will be easier in a warm Adriatic city than in Milan or Turin.",
      "Students who want a purpose-built international program — BEMC was designed for students like them, not adapted from a domestic Italian structure.",
    ],
    things_to_consider: [
      "Bari is a southern Italian city — English is less prevalent in daily life outside the university and BEMC student community.",
      "Less international career network than Milan or Rome for post-graduation European pathways — though the degree itself carries full international licensing eligibility.",
      "The Indian student community in Bari is growing but smaller than Rome or Milan. Expect a tighter-knit group rather than a large diaspora network.",
    ],
    recognition_badges: [
      "QS 201–250 Medicine",
      "Censis Rank #8 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "BEMC International Program",
    ],
    faq: [
      { question: "What is the BEMC program at Bari?", answer: "BEMC (Bari English Medical Curriculum) is a purpose-designed 6-year English-medium Medicine and Surgery program at the University of Bari, structured specifically for international IMAT-admitted students. It has English-medium clinical coordination, international faculty orientation, and structured support for students from non-Italian systems — making it one of the most internationally accessible Italian medical programs." },
      { question: "Is the University of Bari's MBBS valid for India?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, BEMC graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the NMC certificate for every enrolled student." },
      { question: "What IMAT score is needed for Bari?", answer: "Bari is moderately competitive — scores of 65–78+ typically achieve allocation for the BEMC program. Annual cutoffs vary. Students Traffic tracks all-Italy cutoffs and advises on optimal preference ordering for your IMAT score." },
      { question: "How does Bari compare to northern Italian cities for cost?", answer: "Monthly living costs in Bari (€500–750) are €200–400 lower than Rome (€700–1,100) and €400–600 lower than Milan (€900–1,400). Over six years, the cumulative saving is substantial. Students Traffic models total 6-year cost across all Italian options before recommending." },
      { question: "Is Policlinico di Bari a good clinical training hospital?", answer: "Yes — Policlinico di Bari is one of Southern Italy's largest academic medical centres with high patient volume across cardiology, oncology, haematology, gastroenterology, and emergency medicine. The clinical case breadth is directly relevant to FMGE/NExT preparation." },
      { question: "Does the Bari BEMC program support students with no Italian language skills?", answer: "Yes. BEMC was specifically designed for international students — clinical coordination and academic administration operate in English throughout the program. Italian language skills help for daily life but are not required for the academic program itself." },
      { question: "Is ADISU Puglia housing available for BEMC students?", answer: "ADISU Puglia manages regional student housing. Shared apartments in Bari run €280–420 per person — among Italy's most affordable. The BEMC program team helps coordinate housing for incoming international students." },
      { question: "How does Students Traffic manage the Bari IMAT process?", answer: "Students Traffic manages universitaly.it registration, IMAT preference strategy for BEMC, post-offer NMC certificate, Italian visa documentation, and arrival support specific to Bari. Contact +91 91761 62888." },
    ],
  },

  // ── 9. University of Campania Luigi Vanvitelli ───────────────────────────
  {
    slug: "university-of-campania-luigi-vanvitelli",
    why_choose: [
      "QS Medicine ranking 201–250 globally and Censis #9 nationally — Vanvitelli's biopsychosocial model distinguishes it from the majority of Italian medical schools that follow traditional biomedical-only structures.",
      "The biopsychosocial approach integrates mental health, social medicine, and patient-centred care into clinical training from early years — preparing students for modern medical practice in a way that pure biomedical curricula do not.",
      "AOU Luigi Vanvitelli hospital provides clinical rotations with breadth across standard and specialist areas alongside the distinctive psychiatry and community medicine integration that defines this program.",
      "Living costs in the Campania region (€500–750 per month) are significantly lower than northern Italian cities — delivering Censis top-10 quality at southern Italian prices.",
      "Naples' cultural context — Pompeii, Capri, Amalfi Coast, extraordinary food — gives students six years in one of Europe's most historically and culturally extraordinary environments.",
    ],
    best_fit_for: [
      "Students interested in psychiatry, community medicine, social health, or patient communication who want a curriculum that treats these as core rather than supplementary.",
      "Budget-conscious students who want Censis top-10 quality in the affordable Campania region.",
      "Students drawn to Southern Italy's culture and warmth who want a modern, pedagogically distinctive program.",
    ],
    things_to_consider: [
      "Naples requires more situational awareness than smaller Italian cities — though the university areas and student residential zones are considered safe.",
      "The campus is spread between Caserta and Naples, which can require travel between teaching sites.",
      "Vanvitelli is a newer institution (est. 1991) compared to Bologna, Padova, or Naples Federico II — its alumni network is shorter but the program quality is well-established.",
    ],
    recognition_badges: [
      "QS 201–250 Medicine",
      "Censis Rank #9 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Biopsychosocial Medical Education",
    ],
    faq: [
      { question: "What is the biopsychosocial approach at Vanvitelli?", answer: "The biopsychosocial model integrates psychological and social determinants of health into clinical training from early years — going beyond purely biomedical education. Students develop patient communication skills, mental health awareness, and community medicine competency alongside standard clinical training. This is directly relevant to real-world medical practice and increasingly to licensing examinations." },
      { question: "Is Vanvitelli's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the NMC certificate for every enrolled student." },
      { question: "What IMAT score is needed for Vanvitelli?", answer: "Vanvitelli is moderately competitive — IMAT scores of 65–78+ typically achieve allocation. Annual cutoffs vary. Students Traffic tracks Italy-wide cutoffs and advises on preference ordering for your score." },
      { question: "Is the campus in Naples or Caserta?", answer: "Vanvitelli operates between Naples and Caserta. The medical faculty and main clinical hospital (AOU Luigi Vanvitelli) are primarily in the Naples area. Some university functions are located at the Caserta campus. Travel between sites is part of the student experience." },
      { question: "Is Naples safe for Indian MBBS students?", answer: "The university areas and student residential districts in Naples are considered safe. Standard city-awareness applies in the historic centre and tourist zones. Most Indian students at Vanvitelli report no significant safety issues once they understand the city's layout." },
      { question: "How do living costs in the Campania region compare to northern Italy?", answer: "Monthly living costs of €500–750 in the Naples/Campania area compare very favourably to Milan (€900–1,400) or Rome (€700–1,100). Shared apartments run €280–420 per person. Over six years the cost advantage is substantial." },
      { question: "Does ADISU Campania provide housing for Vanvitelli students?", answer: "ADISU Campania manages regional student housing. Availability varies — Students Traffic advises on ADISU applications and private housing alternatives near the medical faculty." },
      { question: "How does Students Traffic support Vanvitelli-bound students?", answer: "Students Traffic manages the full IMAT process for Vanvitelli: universitaly.it registration, IMAT preference strategy, NMC certificate, Italian visa documentation, and arrival support. Contact +91 91761 62888." },
    ],
  },

  // ── 10. University of Catania ─────────────────────────────────────────────
  {
    slug: "university-of-catania-italy",
    why_choose: [
      "QS Medicine ranking 201–250 globally and Censis #10 nationally — the University of Catania is Sicily's leading technology-integrated medical institution, combining a 590-year institutional history (founded 1434) with modern digital health and simulation investment.",
      "Technology-focused medical training with simulation facilities and digital health tools integrated into the curriculum — preparing students for modern clinical practice in a way that traditionally structured programs do not.",
      "Catania is among Italy's most affordable university cities — monthly living costs of €450–700 are among the lowest for any IMAT-eligible Italian university, making it an exceptional value proposition for budget-conscious families.",
      "Warm Sicilian climate year-round is a genuine practical advantage for students from India's tropical and subtropical regions — climate adaptation is faster and less demanding than in northern Italy.",
      "Own international airport with direct connections to Rome, Milan, and European hubs simplifies semester-break travel to India via transit.",
    ],
    best_fit_for: [
      "Budget-first students who want Censis top-10 Italian MBBS quality at the lowest possible living cost — Catania delivers clinical and academic quality for €250–700 less per month than northern Italian peers.",
      "Students from southern Indian climatic regions whose lifestyle adaptation will be easier in Sicily's warm Mediterranean environment.",
      "Students interested in technology-integrated medicine and digital health who want a curriculum that treats simulation as core, not supplementary.",
    ],
    things_to_consider: [
      "Sicily's geographic position means more effort for mainland Italy travel compared to Bologna, Milan, or Pavia.",
      "English is limited in daily life outside the university campus and medical faculty. Italian helps significantly for day-to-day life in Catania.",
      "The Indian student community in Catania is small. Students who depend on a large Indian peer network should evaluate Rome or Milan.",
    ],
    recognition_badges: [
      "QS 201–250 Medicine",
      "Censis Rank #10 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Digital Health & Simulation",
    ],
    faq: [
      { question: "Is the University of Catania's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the certificate for every enrolled student." },
      { question: "What IMAT score is needed for Catania?", answer: "Catania is one of Italy's more accessible IMAT destinations — scores of 60–74+ typically achieve allocation. Annual thresholds vary. Students Traffic tracks all-Italy cutoff data and advises on preference ordering for your score." },
      { question: "Why is Catania one of Italy's cheapest university cities?", answer: "Sicily's cost of living is consistently lower than mainland Italy. Shared apartments in Catania average €250–380 per person per month — lower than any major mainland Italian city. Food, transport, and utilities follow the same pattern. Over six years, the total saving versus Bologna or Milan runs into several lakhs of rupees." },
      { question: "What does technology-integrated medicine mean at Catania?", answer: "The University of Catania has invested in surgical simulation facilities, digital diagnostics tools, and health informatics integration in the curriculum — preparing students for modern clinical environments. This is part of the university's broader polytechnic-influenced culture." },
      { question: "What is Policlinico G. Rodolico–San Marco like as a teaching hospital?", answer: "It is Catania's main academic hospital complex — recently modernised and strong in emergency medicine, obstetrics, and oncology. The Mediterranean disease profile also gives students exposure to conditions seen less frequently in northern European hospitals." },
      { question: "Is Sicily safe for Indian MBBS students?", answer: "Yes. Catania is a safe city for students with very low crime in university and residential areas. Standard urban awareness applies. Sicily's communities are generally welcoming to international students." },
      { question: "How does Catania compare to other southern Italian IMAT universities?", answer: "Catania (Censis #10) and Messina (Censis #11) are Sicily's two IMAT-eligible universities. Catania has a stronger technology focus and its own international airport. Messina offers earlier clinical contact and marginally lower costs. Students Traffic advises on which better fits your profile." },
      { question: "How does Students Traffic manage the Catania IMAT process?", answer: "Students Traffic manages universitaly.it registration, IMAT preference strategy, NMC certificate, Italian visa, and arrival support for Catania. Contact +91 91761 62888." },
    ],
  },

  // ── 11. University of Messina ─────────────────────────────────────────────
  {
    slug: "university-of-messina-italy",
    why_choose: [
      "QS Medicine ranking 201–250 globally and Censis #11 nationally — the University of Messina's early clinical training model is its single most distinctive differentiator, with patient contact beginning significantly earlier than most Italian medical schools.",
      "Early clinical contact from Years 2–3 means students build practical competency, diagnostic reasoning, and patient communication skills faster than peers at lecture-intensive Italian universities.",
      "Messina is among Italy's lowest-cost university cities — monthly living costs of €450–650 make it one of the most affordable IMAT-eligible options in the entire Italian system.",
      "Smaller cohort sizes mean more direct faculty interaction, more accessible clinical supervision, and a more personal academic experience than the large-batch environments of Rome or Milan.",
      "Warm Sicilian climate year-round reduces climate adaptation stress for students from India's tropical and southern regions.",
    ],
    best_fit_for: [
      "Students who want early patient contact and practical clinical confidence from Year 2 — the early clinical model at Messina is a genuine academic advantage for students who want to build clinical reasoning from the start.",
      "Students seeking Italy's lowest-cost MBBS option with solid Censis top-12 quality — Messina delivers at €250–700 less per month than northern peers.",
      "Students who prefer smaller cohort environments with more faculty access over the anonymity of large Italian medical school classes.",
    ],
    things_to_consider: [
      "Sicily's geographic position means more effort for mainland Italy travel — mainland connections require ferry or flight.",
      "English is limited in daily life outside the university. Italian helps significantly in Messina.",
      "Indian grocery and restaurant options are limited in Messina. Self-cooking with supplies from larger Sicilian cities is the standard approach.",
    ],
    recognition_badges: [
      "QS 201–250 Medicine",
      "Censis Rank #11 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Early Clinical Training Model",
    ],
    faq: [
      { question: "How early do students at Messina start clinical training?", answer: "Messina's program introduces patient contact and supervised clinical practice from Years 2–3 — earlier than most Italian peer institutions. Hospital rotations intensify in Years 4–5, with a full internship in Year 6. This early contact model builds clinical reasoning significantly faster than lecture-first curricula." },
      { question: "Is the University of Messina's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the certificate for every enrolled student." },
      { question: "What IMAT score is needed for Messina?", answer: "Messina is one of Italy's more accessible IMAT destinations — scores of 58–72+ typically achieve allocation. Annual thresholds vary. Students Traffic tracks Italy-wide cutoffs and advises on preference ordering." },
      { question: "What is AOU G. Martino like as a teaching hospital?", answer: "AOU G. Martino is the University of Messina's main teaching hospital — strong in emergency medicine, cardiology, and neurology. The smaller overall patient environment means more per-student clinical attention in rotations than in the mega-hospitals of Rome or Milan." },
      { question: "Is Messina the most affordable Italian MBBS option?", answer: "Messina consistently ranks among Italy's lowest-cost university cities. Monthly living costs of €450–650 — accommodation, food, transport, and personal spending — are among the lowest for any IMAT-eligible Italian university. Over six years the saving versus Bologna or Milan is substantial." },
      { question: "How does Messina compare to Catania for Sicilian MBBS?", answer: "Both are Censis top-12 with warm climates and affordable living. Messina is stronger for early clinical contact; Catania has a stronger technology integration focus and its own international airport. Students Traffic compares both options for your IMAT score and priorities before recommending." },
      { question: "Is there student housing from ERSU Messina for Indian students?", answer: "ERSU Messina manages affordable student accommodation. Rooms are available for international students at €200–350 per person. Private apartments near campus are also very affordable." },
      { question: "How does Students Traffic support Messina-bound students?", answer: "Students Traffic manages universitaly.it registration, IMAT preference strategy, NMC certificate, Italian visa documentation, and arrival support for Messina. Contact +91 91761 62888." },
    ],
  },

  // ── 12. University of Rome Tor Vergata ────────────────────────────────────
  {
    slug: "university-of-rome-tor-vergata",
    why_choose: [
      "QS Medicine ranking 251–300 globally and Censis #12 nationally — Tor Vergata is Rome's modern research-focused university, purpose-built for biomedical science and technology-integrated clinical training.",
      "Policlinico Tor Vergata is a fully dedicated research-integrated teaching hospital, with particularly strong oncology, rheumatology, and transplant surgery programs — the clinical research integration gives students genuine exposure to frontier medicine.",
      "Rome's capital-city career network — international organisations, health research institutes, European pharmaceutical companies, and a large professional health community — is fully accessible to Tor Vergata students.",
      "Lower IMAT competition than Sapienza while still in Rome — students who want Rome's post-graduation advantages but find Sapienza's cutoffs challenging have a realistic pathway at Tor Vergata.",
      "Modern campus design with research centres, simulation facilities, and technology infrastructure that older Italian medical campuses cannot match.",
    ],
    best_fit_for: [
      "Research-oriented students interested in academic medicine, clinical research, or specialist training who want Rome's professional network alongside a modern research campus.",
      "Students who want Rome's career advantages but realistic IMAT competition — Tor Vergata's cutoffs are typically 5–8 points below Sapienza's.",
      "Students interested in oncology, rheumatology, or transplant medicine who want dedicated exposure from the clinical years.",
    ],
    things_to_consider: [
      "The campus is on Rome's southeastern outskirts — city centre requires a metro and bus commute of 30–45 minutes. Students who want to live close to the campus rather than central Rome should factor this in.",
      "Rome city costs remain high regardless of campus location — €700–1,050 monthly is realistic regardless of whether you live near campus or in central Rome.",
      "Tor Vergata was founded in 1982 — a shorter institutional history than Sapienza (1303) or Federico II (1224), which matters for some post-graduation recognition contexts.",
    ],
    recognition_badges: [
      "QS 251–300 Medicine",
      "Censis Rank #12 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Research-Integrated Campus",
    ],
    faq: [
      { question: "Is Tor Vergata's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the NMC certificate for every enrolled student." },
      { question: "How does Tor Vergata compare to Sapienza for Indian MBBS students?", answer: "Sapienza is larger, older (founded 1303), and nationally ranked higher (Censis #2 vs #12). Tor Vergata offers a more modern research campus, smaller cohorts, and lower IMAT competition — while still in Rome. For students who want Rome's career advantages at a more accessible IMAT threshold, Tor Vergata is the realistic Rome option." },
      { question: "What IMAT score is needed for Tor Vergata?", answer: "Tor Vergata is typically 5–8 IMAT score points below Sapienza's cutoff — making it accessible to students in the 72–82 range. Annual thresholds vary. Students Traffic tracks Rome-specific cutoffs and advises on Sapienza vs Tor Vergata preference ordering." },
      { question: "How far is the Tor Vergata campus from central Rome?", answer: "The campus is in Rome's southeastern outskirts — about 12 km from the city centre. Metro Line C and bus services connect the campus to central Rome in 30–45 minutes. Many students live near the campus to reduce commute time." },
      { question: "What are Policlinico Tor Vergata's strengths as a teaching hospital?", answer: "Policlinico Tor Vergata is a modern research-integrated hospital — particularly strong in oncology, rheumatology, and transplant surgery. The research integration means students work alongside active clinical scientists, which is distinctive among Italian medical training environments." },
      { question: "Does Tor Vergata offer ECFMG and USMLE eligibility?", answer: "Yes. The degree is ECFMG-listed. Graduates can pursue ECFMG certification and USMLE Steps 1, 2 CK, and 3 for US residency. Students Traffic includes licensing pathway guidance for all enrolled Italy students." },
      { question: "Is there housing near the Tor Vergata campus?", answer: "EDiSU Lazio manages some housing near Tor Vergata. Most students live in shared private apartments — near campus at €350–550 per person, or in central Rome with metro commute. Students Traffic advises on housing strategy before departure." },
      { question: "How does Students Traffic support Tor Vergata-bound students?", answer: "Students Traffic manages the full IMAT cycle for Tor Vergata: universitaly.it registration, preference strategy, NMC certificate, Italian visa, and Rome arrival support. Contact +91 91761 62888." },
    ],
  },

  // ── 13. University of Parma ───────────────────────────────────────────────
  {
    slug: "university-of-parma-italy",
    why_choose: [
      "QS Medicine ranking 301–350 globally and Censis #13 nationally — the University of Parma's origins traced to 962 CE make it one of Europe's oldest institutions, and its English-medium medical program admits deliberately small cohorts for personalised clinical supervision.",
      "Small English cohort size means more direct faculty interaction, more clinical supervision per student, and a more personalised academic experience than the large-batch programs of Bologna, Rome, or Milan.",
      "AOU di Parma (Ospedale Maggiore) provides strong clinical training in cardiology, gastroenterology, and oncology — with a per-student attention level that larger Italian teaching hospitals cannot match.",
      "Parma is safe, prosperous, and in Italy's food valley — one of the most genuinely liveable mid-size Italian cities for students who want quality of life alongside medical training.",
      "Bologna (45 min) and Milan (60 min) are easily accessible by rail — making Parma a base with full access to Northern Italy's career and cultural network.",
    ],
    best_fit_for: [
      "Students who perform better with direct faculty access and personalised clinical supervision than in large anonymous cohorts.",
      "Students who want northern Italian academic quality and quality of life at moderate cost — Parma (€600–850/month) costs significantly less than Bologna or Milan.",
      "Students for whom Emilia-Romagna's food culture, safety, and liveable scale are a genuine lifestyle preference.",
    ],
    things_to_consider: [
      "The English medicine program at Parma is newer — fewer alumni and a shorter established track record than Bologna, Padova, or Pavia.",
      "The Indian student community in Parma is small. Students who depend on a large Indian peer group should evaluate Rome or Milan.",
      "Censis #13 is good but lower than Italy's top-6 institutions — this matters for some internationally-oriented post-graduation contexts.",
    ],
    recognition_badges: [
      "QS 301–350 Medicine",
      "Censis Rank #13 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
    ],
    faq: [
      { question: "Is the University of Parma's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the certificate for every enrolled student." },
      { question: "What IMAT score is needed for Parma?", answer: "Parma is one of the more accessible northern Italian IMAT destinations — scores of 62–75+ typically achieve allocation. Annual thresholds vary. Students Traffic tracks Italy-wide cutoffs and advises on preference ordering." },
      { question: "Why is Parma's small cohort size an advantage?", answer: "A smaller English cohort means more direct faculty contact, more per-student clinical supervision, and more responsive administrative support than at the large-batch programs of Bologna, Rome, or Milan. For students who want genuine mentoring relationships, small cohort programs consistently produce better outcomes." },
      { question: "What does Ospedale Maggiore di Parma offer for clinical training?", answer: "AOU di Parma is Parma's main teaching hospital, with strong clinical activity in cardiology, gastroenterology, oncology, and general surgery. The smaller scale means higher per-student clinical exposure in rotations." },
      { question: "How close is Parma to Bologna and Milan?", answer: "Parma is 100 km west of Bologna (45 minutes by fast train) and 120 km from Milan (60 minutes). Both cities are accessible for day trips, interviews, and career events — making Parma an effective base for northern Italy access at lower cost." },
      { question: "Is ER.GO housing available for Parma students?", answer: "ER.GO (Emilia-Romagna Regional Agency) manages subsidised housing in Parma for qualifying students. Private apartments cost €320–500 per person. Students Traffic advises on ER.GO eligibility and alternative housing options." },
      { question: "Is Parma safe for Indian MBBS students?", answer: "Yes — Parma consistently ranks among Italy's safest and most liveable mid-size cities. Exceptionally low crime rate. Very comfortable for international students." },
      { question: "How does Students Traffic support Parma-bound students?", answer: "Students Traffic manages universitaly.it registration, IMAT preference strategy, NMC certificate, Italian visa, and Parma arrival support. Contact +91 91761 62888." },
    ],
  },

  // ── 14. University of Cagliari ────────────────────────────────────────────
  {
    slug: "university-of-cagliari-italy",
    why_choose: [
      "QS Medicine ranking 301–350 globally and Censis #14 nationally — the University of Cagliari received English-medium medicine accreditation in 2024, creating a genuine pioneer cohort opportunity in a institution with roots dating to 1620.",
      "Holistic medical education approach — prevention-oriented, community-integrated, and patient-centred models alongside clinical rotations — produces doctors trained for modern primary and preventive care in addition to specialist clinical work.",
      "Sardinia offers among Italy's lowest living costs — €450–650 per month — alongside exceptional Mediterranean quality of life and one of Italy's most beautiful natural environments.",
      "Pioneer cohort position means direct faculty access, developing institutional attention for international students, and the opportunity to be among Cagliari's first international medicine graduates.",
      "Very low competition in early years as the program establishes its cohort — students who act early in this program's development may benefit from more accessible IMAT allocation thresholds.",
    ],
    best_fit_for: [
      "Students comfortable with being in a pioneer cohort of a well-established university's new English program — the institution has roots to 1620, only the English program is new.",
      "Budget-conscious students for whom Italy's lowest living costs alongside island Mediterranean lifestyle are the right combination.",
      "Students interested in preventive, community, or social medicine who want a holistic curriculum structure.",
    ],
    things_to_consider: [
      "The English program was accredited in 2024 — limited alumni track record and less established international student infrastructure than Bologna or Padova.",
      "Sardinia's island location means more effort and cost for mainland Italy travel compared to peninsula universities.",
      "International student support infrastructure is still developing — students need more self-reliance than at Sapienza or Bologna.",
    ],
    recognition_badges: [
      "Censis Rank #14 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "2024 English Program Accreditation",
    ],
    faq: [
      { question: "Is the Cagliari English medicine program safe for Indian students to join?", answer: "The University of Cagliari has roots to 1620 — only the English-medium program is new (accredited 2024). Students Traffic evaluates NMC compliance, intake structure, and hospital access before recommending any program for a given cycle. Contact our counsellors for the current cycle assessment." },
      { question: "Is Cagliari's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised and NMC-eligible for FMGE/NExT. Students Traffic verifies current NMC eligibility for Cagliari before filing any application, given the program's recent accreditation." },
      { question: "What IMAT score is needed for Cagliari?", answer: "Cagliari is one of Italy's more accessible IMAT destinations, particularly in early cohort years — scores of 55–68+ have typically been sufficient. Annual thresholds vary. Students Traffic tracks this and advises accordingly." },
      { question: "What is the holistic approach to medical education at Cagliari?", answer: "Cagliari's approach integrates community medicine, preventive care, and patient-centred models into the curriculum alongside standard clinical rotations. This produces graduates trained not only for hospital-based specialist work but for primary care, public health, and community medicine practice." },
      { question: "What is the cost of living in Cagliari?", answer: "Cagliari and Sardinia consistently rank among Italy's lowest-cost places to live. Monthly expenses of €450–650 cover accommodation, food, transport, and personal spending — among the lowest for any IMAT-eligible Italian university city." },
      { question: "How does Sardinia's island location affect travel to mainland Italy?", answer: "Cagliari has its own international airport with flights to Rome, Milan, and European hubs. Ferry connections to mainland Italy are also available. Travel requires more planning than from Bologna or Milan — but Ryanair and similar carriers make Sardinia-mainland connections affordable." },
      { question: "Is ERSU Sardegna housing available for Cagliari students?", answer: "ERSU Sardegna manages student housing in Cagliari. Affordable rooms are available for international students. Private apartments in Cagliari cost €250–380 per person — among Italy's lowest." },
      { question: "How does Students Traffic evaluate Cagliari for each intake cycle?", answer: "Students Traffic monitors Cagliari's accreditation status, NMC compliance, hospital affiliation quality, and intake structure annually before recommending it to students. This is particularly important for newer programs. Contact +91 91761 62888 for the current cycle assessment." },
    ],
  },

  // ── 15. University of Naples Federico II ─────────────────────────────────
  {
    slug: "university-of-naples-federico-ii",
    why_choose: [
      "Founded by Emperor Frederick II in 1224 — the University of Naples Federico II is one of the world's oldest state universities and brings 800 years of academic tradition to its medicine program.",
      "QS Medicine ranking 351–400 globally and Censis #15 nationally — Federico II's clinical training benefits from Naples' extraordinary disease diversity and patient volume across one of Italy's most clinically rich urban environments.",
      "AOU Federico II provides breadth across emergency medicine, cardiology, haematology, and infectious disease — the patient diversity of Naples means students encounter a clinical case mix that narrower hospital environments cannot match.",
      "Living costs in Naples (€500–750 per month) are significantly lower than northern Italian cities while providing one of Italy's richest cultural and social student experiences.",
      "Large and established Indian student community in Naples provides strong peer support, food resources, and practical guidance from students already in the system.",
    ],
    best_fit_for: [
      "Students who want maximum clinical volume and case diversity at lower cost — Naples' hospital ecosystem is one of Italy's most clinically active.",
      "Students drawn to southern Italy's culture, food, and intensity who want 800 years of academic heritage behind their degree.",
      "Students for whom a large Indian peer community is a practical priority — Naples has one of Italy's largest Indian student presences.",
    ],
    things_to_consider: [
      "Naples requires more situational awareness than smaller Italian cities — standard urban precautions apply in the city centre and tourist zones.",
      "QS 351–400 is lower than northern Italian peers — this may affect perception in some post-graduation contexts where institutional name carries weight.",
      "English outside the university is limited. Italian helps significantly for daily life in Naples.",
    ],
    recognition_badges: [
      "QS 351–400 Medicine",
      "Censis Rank #15 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "Founded 1224 — World's Oldest State University",
    ],
    faq: [
      { question: "Is Naples Federico II's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic handles the certificate for every enrolled student." },
      { question: "What IMAT score is needed for Federico II?", answer: "Federico II is one of Italy's more accessible IMAT destinations — scores of 60–73+ typically achieve allocation. Annual thresholds vary. Students Traffic tracks Italy-wide cutoff data and advises on preference ordering." },
      { question: "How does AOU Federico II hospital compare for clinical training?", answer: "AOU Federico II is Naples' main university hospital — with high clinical volume across emergency medicine, cardiology, haematology, and infectious disease. Naples' population diversity means students encounter a clinical case mix broader than most Italian cities. This is particularly relevant for FMGE/NExT breadth preparation." },
      { question: "Is Naples Federico II different from Vanvitelli in Naples?", answer: "Yes — these are completely separate institutions. Federico II (founded 1224) is Southern Italy's oldest university, historically renowned. Vanvitelli (est. 1991) is newer and distinguished by its biopsychosocial curriculum model. Both are in the Naples/Campania area and are NMC-eligible. Students Traffic advises on which fits your profile better." },
      { question: "Is the Indian community large at Federico II?", answer: "Yes — Naples has one of the larger Indian student presences among Italian MBBS cities. Indian restaurants, grocery stores, and peer support networks are genuinely accessible. The community coordination at Federico II is well-established compared to smaller Italian cities." },
      { question: "What are living costs in Naples for Federico II students?", answer: "Monthly living costs of €500–750 cover accommodation (€280–420 per person shared), food, transport, and personal spending. Naples is significantly more affordable than Rome or Milan while offering a richer cultural and social environment." },
      { question: "Does ADISU Campania provide housing for Federico II students?", answer: "ADISU Campania manages regional student housing. Availability varies — Students Traffic advises on ADISU applications and private housing alternatives near the medical faculty." },
      { question: "How does Students Traffic manage the Federico II IMAT process?", answer: "Students Traffic manages universitaly.it registration, IMAT preference strategy, NMC certificate, Italian visa documentation, and arrival support for Naples. Contact +91 91761 62888." },
    ],
  },

  // ── 16. Marche Polytechnic University ────────────────────────────────────
  {
    slug: "marche-polytechnic-university-italy",
    why_choose: [
      "QS Medicine ranking and Censis #16 nationally — Marche Polytechnic University (Università Politecnica delle Marche) is Italy's most distinctively MedTech-integrated medical institution, combining surgical simulation, digital diagnostics, and interdisciplinary polytechnic culture in a way no purely medical university can replicate.",
      "MedTech-integrated curriculum: students work alongside engineering and science departments on digital health, surgical robotics, and medical imaging technology — preparing them for clinical environments where technology is central to practice.",
      "Ospedali Riuniti di Ancona is the region's comprehensive academic hospital — strong in surgical and emergency medicine — and the MedTech integration means clinical students use the same tools being developed in the university's research labs.",
      "Ancona's Adriatic location offers a genuinely different Italian experience: direct ferry connections to Croatia and Greece, a manageable mid-size city, and living costs (€500–700/month) well below northern Italian averages.",
      "Regional leader in Marche with less competition at the IMAT stage than Bologna, Milan, or Rome — accessible for serious students who have prepared well but may not hit top-tier cutoffs.",
    ],
    best_fit_for: [
      "Students interested in MedTech, surgical simulation, digital diagnostics, or technology-integrated medicine — Marche's polytechnic environment makes this a genuinely distinctive choice.",
      "Students seeking a mid-range IMAT threshold with a differentiated Italian university experience that isn't just a lower-ranked version of Bologna or Rome.",
      "Budget-conscious students who want northern Italian quality of life at lower cost than Milan or Bologna.",
    ],
    things_to_consider: [
      "Censis #16 is the lowest-ranked Italian university in this list — this matters for some post-graduation international recognition contexts.",
      "Ancona is less internationally connected than Rome, Milan, or Naples. Career networks and travel options are more limited.",
      "The Indian and international student community in Ancona is smaller than in any other Italian MBBS city.",
    ],
    recognition_badges: [
      "Censis Rank #16 Italy",
      "WHO Recognised",
      "NMC India Eligible (FMGE / NExT)",
      "ECFMG Eligible — USMLE Pathway",
      "PLAB Eligible — UK GMC",
      "AMC Eligible — Australia / New Zealand",
      "MedTech Integration",
    ],
    faq: [
      { question: "What is the MedTech program at Marche Polytechnic?", answer: "MedTech integration at Marche means the medicine curriculum incorporates digital diagnostics, surgical simulation technology, medical imaging, and collaboration with engineering departments on health technology — preparing students for clinical environments where technology is a primary tool rather than an add-on." },
      { question: "Is Marche Polytechnic's medicine degree valid for FMGE/NExT?", answer: "Yes. The Medicine and Surgery degree is WHO-recognised. With a valid NMC Eligibility Certificate, graduates are eligible for FMGE/NExT and NMC registration. Students Traffic verifies eligibility status before filing any application." },
      { question: "What IMAT score is needed for Marche Polytechnic?", answer: "Marche is one of Italy's more accessible IMAT destinations — scores of 55–67+ typically achieve allocation. Annual thresholds vary. Students Traffic tracks Italy-wide cutoff data and advises accordingly." },
      { question: "What is Ospedali Riuniti di Ancona like as a teaching hospital?", answer: "Ospedali Riuniti (Azienda Ospedaliero-Universitaria) is the Marche region's comprehensive academic medical centre — strong in surgery, emergency medicine, and specialties aligned with the MedTech research program." },
      { question: "What is Ancona like as a city for Indian MBBS students?", answer: "Ancona is a mid-size Adriatic port city — less glamorous than Rome or Florence but practical, safe, and affordable. Direct ferries to Croatia and Greece are a distinctive travel option. The city is manageable in scale, with a calmer pace than larger Italian cities." },
      { question: "How does living cost in Ancona compare to Bologna or Milan?", answer: "Monthly living costs in Ancona (€500–700) are significantly lower than Bologna (€700–1,100) or Milan (€900–1,400). Shared apartments run €280–430 per person. For a six-year program the savings are substantial." },
      { question: "Is ERSU Marche housing available for Marche Polytechnic students?", answer: "ERSU Marche manages student accommodation for eligible students. Private apartments in Ancona cost €280–430 per person. Students Traffic advises on accommodation options before departure." },
      { question: "How does Students Traffic evaluate Marche for each intake cycle?", answer: "Students Traffic compares all 16 Italian IMAT universities by Censis ranking, QS medicine ranking, hospital quality, living cost, and IMAT cutoff before recommending any university. For students with IMAT scores in the 55–67 range, Marche and Cagliari represent the realistic Italian options. Contact +91 91761 62888 for a profile-specific recommendation." },
    ],
  },
];

// ─── Run updates ───────────────────────────────────────────────────────────────

async function main() {
  const client = await pool.connect();
  try {
    console.log(`Enriching ${enrichments.length} Italian universities...`);
    let updated = 0;

    for (const uni of enrichments) {
      const admContent = buildAdmissionsContent({
        name: uni.name ?? uni.slug.replace(/-italy$/, "").replace(/-/g, " "),
        city: uni.city ?? "Italy",
        slug: uni.slug,
      });

      // Build the full admissions content: merge the generated base with any
      // university-specific overrides defined in the enrichment object.
      const finalAdmissions = { ...admContent, ...(uni.admissions_content ?? {}) };

      const result = await client.query(
        `UPDATE universities SET
          why_choose          = $1,
          best_fit_for        = $2,
          things_to_consider  = $3,
          recognition_badges  = $4,
          faq                 = $5,
          admissions_content  = $6,
          last_verified_at    = $7,
          updated_at          = NOW()
        WHERE slug = $8`,
        [
          JSON.stringify(uni.why_choose),
          JSON.stringify(uni.best_fit_for),
          JSON.stringify(uni.things_to_consider),
          uni.recognition_badges,
          JSON.stringify(uni.faq),
          JSON.stringify(finalAdmissions),
          "2026-06-03",
          uni.slug,
        ]
      );

      if (result.rowCount > 0) {
        updated++;
        console.log(`  ✓ ${uni.slug}`);
      } else {
        console.warn(`  ✗ NOT FOUND: ${uni.slug}`);
      }
    }

    console.log(`\nDone — ${updated}/${enrichments.length} universities updated.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
