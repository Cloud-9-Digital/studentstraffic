import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const COURSE_MBBS_ID = 13;

const ITALY_COUNTRY = {
  slug: "italy",
  name: "Italy",
  region: "Europe",
  summary:
    "Italy is one of Europe's most respected destinations for English-medium MBBS/MD education. Indian students choose Italy for its globally ranked public universities, WHO and NMC-recognised 6-year medicine programs, affordable tuition compared to Western Europe, and the IMAT-based admission pathway that rewards academic preparation over connections.",
  whyStudentsChooseIt:
    "Italian public medical universities offer degrees recognised by WHO, NMC, and ECFMG — giving Indian graduates eligibility for FMGE/NExT licensing and international practice. Tuition fees are significantly lower than the UK or Australia. IMAT is an objective, entrance-exam-based pathway with test centres in India. Italy's medical education traces back to the world's first university (Bologna, 1088) and Padova (1222), giving Indian students an academic heritage unmatched in European medicine.",
  climate: "Mediterranean; warm dry summers and mild winters in central-south Italy; cooler and alpine in the north.",
  currencyCode: "EUR",
  metaTitle: "MBBS in Italy for Indian Students 2026 | Universities, IMAT, Fees",
  metaDescription:
    "Complete guide to MBBS in Italy for Indian students: 16 top public universities, IMAT exam, fees, NMC recognition, and how Students Traffic can help with admissions.",
};

const universities = [
  {
    slug: "university-of-bologna-italy",
    name: "University of Bologna",
    city: "Bologna",
    type: "Public/State",
    establishedYear: 1088,
    officialWebsite: "https://www.unibo.it/en",
    summary:
      "The University of Bologna is the world's oldest university, founded in 1088, and ranks QS 51–100 globally in medicine. It holds Censis national rank #1 for Italian universities and offers an English-medium Medicine and Surgery program through IMAT. For Indian students, it is the most prestigious Italian public university for MBBS-equivalent education.",
    campusLifestyle:
      "Bologna is Italy's student capital — compact, walkable, and deeply academic. Expect a strong peer community, rich social life, and a city built around university culture. The university has multiple faculties, large libraries, well-equipped simulation labs, and integrated clinical spaces.",
    cityProfile:
      "Bologna sits in Emilia-Romagna in northern Italy. Excellent rail connections to Milan, Florence, and Rome. 2026 Cost Index: Moderate-to-high by Italian standards. Monthly living expenses: €700–1,100. Known for Italian cuisine (it is the food capital of Italy), excellent public transport, and a strong Indian student network.",
    clinicalExposure:
      "Clinical training uses the Sant'Orsola Malpighi Polyclinic, one of Italy's largest and most respected teaching hospital complexes with over 1,500 beds and strong research volume. Early clinical contact begins from Year 3.",
    hostelOverview:
      "ER.GO (Emilia-Romagna Regional Agency for the Right to Higher Education) manages subsidised accommodation for eligible students. Shared residences near the medical faculty are available for qualifying international students. Private shared apartments in Bologna city centre cost €400–600/month per person.",
    indianFoodSupport:
      "Bologna has an established Indian student community and several Asian and Indian grocery stores. Self-cooking is easy with access to Indian spices, lentils, and basmati rice. No official Indian mess, but student groups share resources.",
    safetyOverview:
      "Bologna is one of Italy's safest cities. The university area is well-lit, walkable, and has strong public transport. Crime affecting students is typically limited to petty theft in tourist zones.",
    studentSupport:
      "The university has an International Student Office, dedicated orientation weeks, and buddy programs for incoming IMAT students. English-language academic support and clinical mentoring are available.",
    whyChoose: [
      "World's oldest university (est. 1088) with 900+ years of medical tradition",
      "QS Medicine ranking 51–100; Censis national rank #1",
      "WHO, NMC, and ECFMG-recognised Medicine and Surgery degree",
      "Sant'Orsola Malpighi Polyclinic: Italy's premier teaching hospital",
      "ER.GO subsidised housing for qualifying students",
    ],
    thingsToConsider: [
      "Competitive IMAT score required — typically 90+ for Bologna admission",
      "Bologna city living costs are above average by Italian standards",
      "Limited English outside the university campus and medical faculty",
    ],
    bestFitFor: [
      "High-scoring IMAT candidates",
      "Students wanting the strongest Italian brand for USMLE / global career",
    ],
    teachingHospitals: ["Sant'Orsola Malpighi Polyclinic", "Maggiore Hospital Bologna"],
    recognitionBadges: [
      "QS 51–100 Medicine",
      "Censis Rank #1 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "ECFMG Listed",
    ],
    faq: [
      {
        question: "Is the University of Bologna degree valid in India?",
        answer:
          "Yes. Bologna's Medicine and Surgery degree is recognised by WHO, and graduates are eligible to appear for FMGE/NExT screening in India after meeting NMC criteria.",
      },
      {
        question: "What IMAT score do I need for Bologna?",
        answer:
          "Bologna is the most competitive Italian public medical university. Historically, scores of 90+ on IMAT have been competitive, but this varies year by year with applicant pool changes.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-bologna-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 4000,
        totalTuitionUsd: 24000,
        livingUsd: 10000,
        medium: "English",
        officialProgramUrl: "https://www.unibo.it/en/study/international-students/coming-to-bologna/imat",
      },
    ],
  },
  {
    slug: "sapienza-university-of-rome",
    name: "Sapienza University of Rome",
    city: "Rome",
    type: "Public/State",
    establishedYear: 1303,
    officialWebsite: "https://www.uniroma1.it/en",
    summary:
      "Sapienza is Europe's largest university by student enrolment and ranks QS 101–150 in medicine globally, Censis #2 nationally. Founded in 1303, its medical faculty is among the most research-active in Southern Europe. The English-medium program is IMAT-accessible and widely recognised for quality clinical training in Rome.",
    campusLifestyle:
      "Two main campuses — Città Universitaria (historic) and San Lorenzo area. The scale and diversity of Sapienza is hard to match: vast libraries, research centres, simulation labs, and one of the most vibrant student communities in European medical education. Rome's IMAT cohort is large, creating strong peer learning networks.",
    cityProfile:
      "Rome is Italy's capital. International, culturally rich, and with excellent transport links to all of Italy and Europe. 2026 Cost Index: Moderate-to-high. Monthly living: €700–1,100 depending on neighbourhood proximity to campus. Largest Indian student community among Italian medical cities.",
    clinicalExposure:
      "Policlinico Umberto I is Sapienza's flagship teaching hospital — one of Italy's largest academic medical centres. Additional affiliations include multiple Rome-area hospitals offering broad specialty exposure. Early patient contact from Year 3.",
    hostelOverview:
      "LaDisP (regional housing agency) manages university-linked accommodation. Competition for subsidised housing is high. Most students in Rome share private apartments (€350–550 per person in shared flats near campus). Students Traffic can assist with housing planning before departure.",
    indianFoodSupport:
      "Rome has a well-established Indian diaspora, multiple Indian restaurants, and Indian/Asian grocery stores within reach of the university area. Indian student groups at Sapienza coordinate food and community resources.",
    safetyOverview:
      "Rome is a large city. The university district and campus areas are generally safe. Standard city-awareness precautions apply. University security services are active on campus.",
    studentSupport:
      "Sapienza has a large International Student Office and a dedicated IMAT intake coordination team. English-language academic advisors are available, and the faculty supports international licensing exam preparation.",
    whyChoose: [
      "Europe's largest university by enrolment — vast academic and clinical infrastructure",
      "QS 101–150 Medicine; Censis national rank #2 in Italy",
      "Policlinico Umberto I: world-class clinical training environment",
      "Rome location — Italy's capital, international career connections",
      "Strong Indian peer network — one of the largest Indian MBBS cohorts in Italy",
    ],
    thingsToConsider: [
      "Large university can feel impersonal without proactive engagement",
      "Rome city living costs are among the highest in Italy",
      "Housing is competitive — start planning 6 months before intake",
    ],
    bestFitFor: [
      "Students who want the Rome advantage for international career pathways",
      "Students with USMLE, PLAB, or ECFMG aspirations post-graduation",
    ],
    teachingHospitals: ["Policlinico Umberto I", "Sant'Andrea Hospital Rome", "San Camillo-Forlanini Hospital"],
    recognitionBadges: [
      "QS 101–150 Medicine",
      "Censis Rank #2 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "ECFMG Listed",
    ],
    faq: [
      {
        question: "Is Sapienza's MBBS-equivalent degree recognised in India?",
        answer:
          "Yes. Sapienza's Medicine and Surgery degree is WHO-listed and graduates are eligible for FMGE/NExT. Students Traffic verifies NMC eligibility as part of the admission process.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-sapienza-rome",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3800,
        totalTuitionUsd: 22800,
        livingUsd: 10500,
        medium: "English",
        officialProgramUrl: "https://www.uniroma1.it/en/pagina/international-admissions",
      },
    ],
  },
  {
    slug: "university-of-milan-italy",
    name: "University of Milan",
    city: "Milan",
    type: "Public/State",
    establishedYear: 1923,
    officialWebsite: "https://www.unimi.it/en",
    summary:
      "The University of Milan ranks QS 101–150 globally in medicine and Censis #3 nationally in Italy. It is the dominant medical education institution in Lombardy — Italy's economic and healthcare powerhouse. Strong research output, excellent hospital partnerships, and proximity to Milan's international professional network make it a top-three choice for IMAT applicants.",
    campusLifestyle:
      "Modern urban campus integrated into central Milan. Students access excellent library infrastructure, a well-developed student union, and a well-connected city lifestyle. Milan's pace is faster and more professional than other Italian university cities.",
    cityProfile:
      "Milan is Italy's commercial and fashion capital with a strong international workforce. 2026 Cost Index: High. Monthly living: €900–1,400. Metro and tram network is excellent. Large Indian business and student community. Proximity to Malpensa International Airport for easy India travel.",
    clinicalExposure:
      "Training at the Ca' Granda Ospedale Maggiore Policlinico — one of Italy's oldest and most prestigious teaching hospitals — and affiliated Milanese hospitals. Milan's hospital ecosystem offers breadth across cardiology, oncology, neurology, and transplant surgery.",
    hostelOverview:
      "EDiSU (regional housing board) provides subsidised residence for income-qualifying students. Most international students in Milan share private apartments (€500–700 per person). Students Traffic helps plan housing before departure.",
    indianFoodSupport:
      "Milan has a large South Asian community. Indian restaurants, Halal shops, and Asian grocery stores are accessible by metro. Indian student societies at the university coordinate community support.",
    safetyOverview:
      "Milan is a large metropolitan city. Standard urban precautions apply. University areas and the medical campus are considered safe with good lighting and public transport access.",
    studentSupport:
      "International Student Services office, English-language academic orientation, and faculty-level IMAT intake advisors. Milan's international environment means strong English communication throughout the degree.",
    whyChoose: [
      "QS 101–150 Medicine; top ranked in Italy's economic capital",
      "Ca' Granda Policlinico: 500+ years of clinical excellence",
      "Milan career network for post-graduation international practice",
      "Lombardy's healthcare ecosystem is Italy's most advanced",
      "Strong research output and specialisation options",
    ],
    thingsToConsider: [
      "Milan is the most expensive Italian city for students",
      "Housing demand is high — early planning is critical",
      "City lifestyle requires budget discipline",
    ],
    bestFitFor: [
      "Students targeting post-graduation careers in Europe or UK",
      "Students who can handle a premium-city budget",
    ],
    teachingHospitals: ["Ca' Granda Ospedale Maggiore Policlinico", "Niguarda Hospital", "San Paolo Hospital Milan"],
    recognitionBadges: [
      "QS 101–150 Medicine",
      "Censis Rank #3 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "ECFMG Listed",
    ],
    faq: [
      {
        question: "How does the University of Milan compare to Bologna for MBBS?",
        answer:
          "Bologna is nationally ranked #1 and has the longest history, but Milan is Lombardy's top university with arguably better career connections. The right choice depends on whether you prioritise academic heritage or professional network proximity.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-university-milan",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 4200,
        totalTuitionUsd: 25200,
        livingUsd: 12000,
        medium: "English",
        officialProgramUrl: "https://www.unimi.it/en/education/medicine-and-surgery",
      },
    ],
  },
  {
    slug: "university-of-padova-italy",
    name: "University of Padova",
    city: "Padova",
    type: "Public/State",
    establishedYear: 1222,
    officialWebsite: "https://www.unipd.it/en",
    summary:
      "Founded in 1222, the University of Padova is one of Europe's oldest universities and ranks QS 101–150 globally in medicine, Censis #4 nationally. Padova is historically the birthplace of modern medicine — Galileo and Vesalius both taught here. Its English-medium MBBS-equivalent program combines deep academic tradition with strong clinical training in Veneto.",
    campusLifestyle:
      "The city and university are intimately connected — Padova is a university town in the best sense. Historic lecture halls sit alongside modern research centres. The medical faculty benefits from the ancient Botanical Garden (world's oldest academic garden) and an outstanding anatomy tradition dating to the 16th century.",
    cityProfile:
      "Padova sits 35 km west of Venice. Affordable relative to Milan or Rome, with strong rail connections to Venice, Verona, and the Veneto region. 2026 Cost Index: Moderate. Monthly living: €650–900. Safe, compact, and student-friendly city.",
    clinicalExposure:
      "Azienda Ospedaliera-Università di Padova is one of Northern Italy's largest teaching hospitals. Padova's clinical training is research-active and offers strong exposure across surgery, internal medicine, and rare disease specialisations.",
    hostelOverview:
      "ESU Padova manages university-affiliated student housing. Subsidised rooms are available for qualifying students. Private shared apartments cost €350–550 per person. Padova is significantly more affordable for housing than Milan or Venice.",
    indianFoodSupport:
      "Smaller Indian student community than Rome or Milan but growing. Supermarkets in Padova carry a reasonable range of South Asian produce. Verona and Padova Indian grocers are a short train ride apart.",
    safetyOverview:
      "Padova is one of the safest mid-size cities in Northern Italy. University areas are walkable and well-monitored. Very few serious safety incidents affecting students.",
    studentSupport:
      "International student office, English-medium orientation, and strong academic mentoring traditions. The medical faculty has an established reputation for supporting IMAT-admitted international cohorts.",
    whyChoose: [
      "One of Europe's oldest and most respected universities (est. 1222)",
      "QS 101–150 Medicine globally — Censis #4 nationally",
      "Birthplace of modern anatomy and scientific medicine",
      "Affordable living compared to Milan or Rome",
      "Excellent rail access to Venice and northern Italy",
    ],
    thingsToConsider: [
      "Smaller city with fewer English-language services outside campus",
      "Indian student community is smaller than Rome or Milan",
      "Winters in the Veneto region are cold and foggy",
    ],
    bestFitFor: [
      "Students who value academic heritage and research culture",
      "Budget-conscious students who still want a top-5 Italian university",
    ],
    teachingHospitals: ["Azienda Ospedaliera-Università di Padova", "Ospedale di Padova"],
    recognitionBadges: [
      "QS 101–150 Medicine",
      "Censis Rank #4 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "ECFMG Listed",
    ],
    faq: [
      {
        question: "Is Padova better than Bologna for MBBS?",
        answer:
          "Both are historic and top-ranked. Bologna is ranked #1 nationally, but Padova (est. 1222) has a slight historical edge in medicine — it is the birthplace of modern anatomy. For Indian students, both offer equivalent quality and NMC eligibility.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-padova-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3600,
        totalTuitionUsd: 21600,
        livingUsd: 9000,
        medium: "English",
        officialProgramUrl: "https://www.unipd.it/en/medicine-surgery",
      },
    ],
  },
  {
    slug: "university-of-pavia-italy",
    name: "University of Pavia",
    city: "Pavia",
    type: "Public/State",
    establishedYear: 1361,
    officialWebsite: "https://www.unipv.eu/en",
    summary:
      "The University of Pavia ranks QS 151–200 globally in medicine and Censis #5 nationally, with particular recognition for international relations. Located 35 km south of Milan, Pavia is one of Europe's best-known collegiate university cities. The medical faculty offers a structured English-medium 6-year program with strong clinical training at the IRCCS Policlinico San Matteo.",
    campusLifestyle:
      "Pavia is Italy's quintessential college town. The University runs a collegiate house system (Collegi Universitari) with centuries of tradition. The medical faculty is tightly integrated with the city's historic Policlinico, allowing early hospital familiarity. Small city, walkable, and internationally connected.",
    cityProfile:
      "Pavia is 35 km from Milan — commutable by train (25 min). Smaller and more affordable than Milan with a focused academic atmosphere. 2026 Cost Index: Moderate. Monthly living: €550–800. Very safe and student-oriented.",
    clinicalExposure:
      "Training centred at IRCCS Policlinico San Matteo — one of Northern Italy's most prestigious university hospital IRCCS (research-level clinical institute) centres. Cardiology, oncology, and transplant surgery volume is high. Practical exposure begins from Year 3.",
    hostelOverview:
      "EDiSU Pavia operates affordable university residences, including the historic college system (Collegi di Merito). Sharing a college residence is one of Pavia's unique academic experiences. Private apartments are also affordable at €300–500 per person.",
    indianFoodSupport:
      "Pavia's Indian student community is smaller but linked to the broader Milan-area network. Indian grocery stores are accessible in Milan (25 min by train). Self-cooking is common and well-supported.",
    safetyOverview:
      "Pavia is among Italy's safest small cities. University areas are well-monitored and the compact nature of the city makes navigation easy and safe at all hours.",
    studentSupport:
      "Strong international student services. Pavia is historically experienced with international students through its college system. IMAT intake orientation and English-medium academic support are well established.",
    whyChoose: [
      "QS 151–200 Medicine globally; top-ranked for international relations (Censis #5)",
      "IRCCS Policlinico San Matteo: nationally certified research-level teaching hospital",
      "Historic collegiate system — unique European university experience",
      "Affordable living with direct Milan rail access",
      "Compact, safe city ideal for focused medical study",
    ],
    thingsToConsider: [
      "Small city with limited English-language services outside campus",
      "Less cosmopolitan than Milan — social options are more contained",
      "Indian community is smaller; requires self-initiative for food sourcing",
    ],
    bestFitFor: [
      "Students who value focused study in a compact, safe city",
      "Students who want Milan access with lower cost of living",
    ],
    teachingHospitals: ["IRCCS Policlinico San Matteo", "Ospedale Civile di Pavia"],
    recognitionBadges: [
      "QS 151–200 Medicine",
      "Censis Rank #5 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "IRCCS Research Hospital",
    ],
    faq: [
      {
        question: "What is special about studying MBBS in Pavia versus Milan?",
        answer:
          "Pavia offers a more focused academic environment with a unique college system, lower costs, and the strong IRCCS Policlinico San Matteo hospital — with easy rail access to Milan when needed.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-pavia-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 8500,
        medium: "English",
        officialProgramUrl: "https://www.unipv.eu/en/courses/medicine-surgery",
      },
    ],
  },
  {
    slug: "university-of-turin-italy",
    name: "University of Turin",
    city: "Turin",
    type: "Public/State",
    establishedYear: 1404,
    officialWebsite: "https://en.unito.it",
    summary:
      "Founded in 1404, the University of Turin ranks QS 151–200 globally in medicine and Censis #6 nationally. Turin is Italy's fourth-largest city and a research-driven academic environment. The English-medium Medicine and Surgery program is IMAT-accessible and benefits from strong clinical partnerships with major Piedmont-region hospitals.",
    campusLifestyle:
      "Turin has a strong industrial and research legacy — home to FIAT and Italy's film archive. The university campus is urban and modern, integrated into a city with excellent museums, cafes, and a large student population. Medical faculty buildings are contemporary and well-equipped.",
    cityProfile:
      "Turin (Torino) is northwest Italy's major city, near the French and Swiss borders. 2026 Cost Index: Moderate. Monthly living: €650–950. Excellent metro and tram system. Known for good food, a strong aperitivo culture, and Italian Alps proximity for weekend activities.",
    clinicalExposure:
      "Training at Città della Salute e della Scienza — Turin's large hospital complex and one of the most comprehensive teaching hospital systems in Northern Italy. Strong oncology, neuroscience, and cardiology research environments.",
    hostelOverview:
      "EDISU Piemonte operates student housing. Rooms are available in university residences and some private partnerships. Shared private apartments in Turin cost €350–550 per person — affordable relative to Milan.",
    indianFoodSupport:
      "Turin has a growing South Asian community, several Indian restaurants, and accessible Asian grocery stores. The Indian student network at the university is expanding year on year.",
    safetyOverview:
      "Turin is a safe city with a well-managed urban transport network. University and residential areas are generally quiet and secure. Standard big-city awareness is sufficient.",
    studentSupport:
      "University of Turin has an active International Office, IMAT intake orientation programme, and English-medium academic coordination. Turin's research-drive culture benefits students interested in specialisation from early years.",
    whyChoose: [
      "QS 151–200 Medicine; research-strong Piedmont region university",
      "Città della Salute e della Scienza: comprehensive clinical teaching complex",
      "Strong research culture — suited to students with academic ambitions",
      "Lower cost of living than Milan with equivalent clinical quality",
      "Alps proximity for student wellbeing and recreation",
    ],
    thingsToConsider: [
      "Turin has less international visibility than Milan or Rome",
      "City is less tourist-oriented — English less prevalent outside campus",
      "Winters can be cold with Alpine influence",
    ],
    bestFitFor: [
      "Research-oriented students aiming for academic medicine",
      "Students seeking a mid-cost northern Italian city experience",
    ],
    teachingHospitals: ["Città della Salute e della Scienza di Torino", "Mauriziano Umberto I Hospital"],
    recognitionBadges: [
      "QS 151–200 Medicine",
      "Censis Rank #6 Italy",
      "WHO Recognised",
      "NMC Eligible",
    ],
    faq: [
      {
        question: "Is the University of Turin good for Indian MBBS students?",
        answer:
          "Yes. Turin is a serious academic city with strong hospital infrastructure. For Indian students looking for a mid-cost, research-active northern Italian university with a solid IMAT-accessible English program, it is a compelling choice.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-turin-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3500,
        totalTuitionUsd: 21000,
        livingUsd: 9000,
        medium: "English",
        officialProgramUrl: "https://en.unito.it/studying-unito/international-students",
      },
    ],
  },
  {
    slug: "university-of-milan-bicocca",
    name: "University of Milan-Bicocca",
    city: "Milan",
    type: "Public/State",
    establishedYear: 1998,
    officialWebsite: "https://www.unimib.it/en",
    summary:
      "University of Milan-Bicocca ranks QS 201–250 globally in medicine and Censis #7 nationally. It is recognised for innovative problem-based learning and hosts its international MBBS cohort at a dedicated campus in Bergamo, giving students a smaller-city study experience with Milan accessibility. The program blends Italian clinical training with modern pedagogical methods.",
    campusLifestyle:
      "Bicocca's main Milan campus is modern, urban, and research-focused. For the international medicine program, students are based in Bergamo — a beautiful, historic hill city about 50 km northeast of Milan. The Bergamo campus environment is more intimate and focused than a large city medical faculty.",
    cityProfile:
      "Bergamo (international medicine campus) is a UNESCO World Heritage city with a historic upper town (Città Alta) and a modern lower town. 2026 Cost Index: Moderate. Monthly living: €600–850. Direct rail and bus links to Milan (45 min). Very safe, compact, and well-serviced.",
    clinicalExposure:
      "Clinical training at ASST Papa Giovanni XXIII Bergamo — one of Italy's most advanced modern hospital complexes. Bergamo's healthcare system gained international recognition during the COVID-19 pandemic for its clinical response capabilities.",
    hostelOverview:
      "University-linked student residences in Bergamo are available and typically more accessible than Milan-city housing. Private shared apartments in Bergamo cost €350–500 per person — significantly cheaper than Milan.",
    indianFoodSupport:
      "Bergamo has a small but growing Indian and South Asian student presence. Milan's larger Indian community and grocery stores are accessible in under an hour by train.",
    safetyOverview:
      "Bergamo is one of Northern Italy's safest cities. Small, compact, and well-monitored. Students find the environment reassuring and the local community welcoming.",
    studentSupport:
      "Bicocca's problem-based learning model means smaller group sizes and closer faculty interaction than larger Italian medical schools. International student coordination for the Bergamo cohort is dedicated.",
    whyChoose: [
      "Innovative problem-based learning model for medicine — modern pedagogy",
      "Bergamo campus: UNESCO heritage city with modern hospital infrastructure",
      "ASST Papa Giovanni XXIII: Italy's most advanced contemporary hospital",
      "Lower cost than Milan with full rail access to the city",
      "Smaller cohort sizes — more personal academic experience",
    ],
    thingsToConsider: [
      "Newer university (est. 1998) with a shorter institutional track record than Bologna or Padova",
      "Bergamo campus is separate from Bicocca's main Milan facilities",
      "Indian student network in Bergamo is smaller",
    ],
    bestFitFor: [
      "Students who prefer problem-based learning over lecture-heavy approaches",
      "Students who want a smaller city experience with Milan proximity",
    ],
    teachingHospitals: ["ASST Papa Giovanni XXIII Bergamo", "ASST Monza Brianza"],
    recognitionBadges: [
      "QS 201–250 Medicine",
      "Censis Rank #7 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "Problem-Based Learning Model",
    ],
    faq: [
      {
        question: "Is the MBBS program at Milan-Bicocca in Milan or Bergamo?",
        answer:
          "The international English-medium Medicine and Surgery program is based at the Bergamo campus. Milan's main Bicocca campus is used for some facilities and events.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-milan-bicocca",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3600,
        totalTuitionUsd: 21600,
        livingUsd: 8800,
        medium: "English",
        officialProgramUrl: "https://www.unimib.it/en/medicine-surgery",
      },
    ],
  },
  {
    slug: "university-of-bari-aldo-moro",
    name: "University of Bari Aldo Moro",
    city: "Bari",
    type: "Public/State",
    establishedYear: 1925,
    officialWebsite: "https://www.uniba.it/it/internazionali/studenti-internazionali",
    summary:
      "University of Bari Aldo Moro ranks QS 201–250 in medicine globally and Censis #8 nationally. It is the top medical university in Southern Italy and offers the Bari English Medical Curriculum (BEMC) — a purpose-built 6-year program designed specifically for international students. For Indian students seeking strong clinical training at significantly lower cost than northern Italian cities, Bari stands out.",
    campusLifestyle:
      "Bari has a large, energetic university community. The medical faculty sits near the city centre with direct access to the major teaching hospitals. The city is lively, Mediterranean, and genuinely welcoming to international students.",
    cityProfile:
      "Bari is the capital of Puglia on Italy's Adriatic coast. 2026 Cost Index: Low-to-moderate — one of Italy's most affordable university cities. Monthly living: €500–750. Excellent food, warm climate, direct flights to multiple Indian cities via transit. Strong sea presence and southern Italian hospitality.",
    clinicalExposure:
      "Policlinico di Bari is one of Southern Italy's largest and most active teaching hospital complexes. High patient volume and diverse case mix including cardiology, oncology, gastroenterology, and emergency medicine.",
    hostelOverview:
      "ADISU Puglia manages student housing. Shared apartments in Bari are among Italy's most affordable at €280–420 per person. The BEMC program team helps international students with housing coordination.",
    indianFoodSupport:
      "Bari has an established community of international students and a growing Indian presence. Several spice shops and Asian grocers operate in Bari. Self-cooking is straightforward and economical.",
    safetyOverview:
      "Bari is a safe Mediterranean city with a welcoming culture. University areas are well-patrolled. Students from India adapt well to the warm climate and community orientation of southern Italy.",
    studentSupport:
      "The BEMC program includes dedicated international student services, English-medium clinical training, and faculty who understand the specific needs of foreign-trained students. One of the more internationally structured IMAT programs in Italy.",
    whyChoose: [
      "Purpose-built BEMC (Bari English Medical Curriculum) for international students",
      "Top-ranked in Southern Italy with strong clinical hospital access",
      "One of Italy's most affordable university cities",
      "Warm Mediterranean climate — easier climate adaptation for Indian students",
      "Direct international flight connections from major Indian hubs",
    ],
    thingsToConsider: [
      "Southern Italian city — fewer English speakers than northern cities",
      "Less international prestige compared to Bologna, Milan, or Rome",
      "Limited internationalised career network for post-Italy transitions",
    ],
    bestFitFor: [
      "Budget-conscious Indian students seeking quality without premium-city costs",
      "Students who prioritise clinical exposure and warm climate",
    ],
    teachingHospitals: ["Policlinico di Bari", "Ospedale Generale Regionale F. Miulli"],
    recognitionBadges: [
      "QS 201–250 Medicine",
      "Censis Rank #8 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "BEMC International Program",
    ],
    faq: [
      {
        question: "What is the BEMC program at Bari?",
        answer:
          "BEMC stands for Bari English Medical Curriculum — a purpose-designed English-medium 6-year Medicine and Surgery program at the University of Bari, structured specifically for international IMAT-admitted students.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-bari-italy",
        title: "Medicine and Surgery — BEMC (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3000,
        totalTuitionUsd: 18000,
        livingUsd: 7500,
        medium: "English",
        officialProgramUrl: "https://www.uniba.it/it/internazionali/studenti-internazionali",
      },
    ],
  },
  {
    slug: "university-of-campania-luigi-vanvitelli",
    name: "University of Campania Luigi Vanvitelli",
    city: "Naples",
    type: "Public/State",
    establishedYear: 1991,
    officialWebsite: "https://international.unicampania.it",
    summary:
      "University of Campania Luigi Vanvitelli ranks QS 201–250 globally in medicine and Censis #9 nationally. Based in the Campania region near Naples, it is known for a biopsychosocial approach to medical education — integrating mental health, social medicine, and patient-centred care into clinical training from early years. A strong option for students who want modern medical pedagogy in a culturally rich southern Italian setting.",
    campusLifestyle:
      "Spread across Caserta and Naples area campuses. The medical faculty integrates traditional Italian academic culture with modern interdisciplinary teaching. The surrounding Campania region offers extraordinary cultural heritage (Pompeii, Capri, Amalfi Coast).",
    cityProfile:
      "Naples is southern Italy's cultural capital — intense, vibrant, and historically extraordinary. 2026 Cost Index: Low-to-moderate. Monthly living: €500–750. Known globally for cuisine, music, and the Bay of Naples. Excellent air connections to international hubs.",
    clinicalExposure:
      "AOU Luigi Vanvitelli (Università degli Studi della Campania) hospital provides clinical training. The biopsychosocial model means broader exposure to psychiatry, community medicine, and integrated care pathways beyond standard clinical rotations.",
    hostelOverview:
      "ADISU Campania manages student housing. Shared apartments in the Campania-Naples region are among Italy's most affordable at €280–420 per person. Student housing cooperatives also operate near the medical faculty.",
    indianFoodSupport:
      "Naples has an international community and several Asian grocery stores in the city centre. Self-cooking is strongly feasible. Indian students find the local community orientation of southern Italy welcoming.",
    safetyOverview:
      "Naples requires more situational awareness than smaller Italian cities. The university areas and student residential zones are considered safe. Students are advised to follow standard guidance for large Mediterranean cities.",
    studentSupport:
      "Strong English-medium international student support. The biopsychosocial model means students receive wellbeing-integrated guidance alongside academic support — an unusual and useful feature for students managing adaptation stress.",
    whyChoose: [
      "Biopsychosocial medical education model — holistic clinical training",
      "Strong integration of psychiatry, social medicine, and patient care",
      "QS 201–250 Medicine; Censis #9 nationally",
      "Affordable living in Campania with rich southern Italian culture",
      "Naples location — one of Europe's most culturally vibrant cities",
    ],
    thingsToConsider: [
      "Naples requires city-awareness for safety — larger urban environment",
      "Campus spread across Caserta and Naples can require travel",
      "University is relatively newer (est. 1991) compared to historic Italian institutions",
    ],
    bestFitFor: [
      "Students interested in community medicine, psychiatry, or social health approaches",
      "Budget-conscious students who want Censis top-10 quality in a southern Italian city",
    ],
    teachingHospitals: ["AOU Luigi Vanvitelli", "AORN Ospedali dei Colli"],
    recognitionBadges: [
      "QS 201–250 Medicine",
      "Censis Rank #9 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "Biopsychosocial Model",
    ],
    faq: [
      {
        question: "What is the biopsychosocial approach at Vanvitelli?",
        answer:
          "The biopsychosocial model integrates psychological and social factors into clinical training from early years — going beyond purely biomedical education. This is particularly useful for students who want to develop patient communication, mental health awareness, and community medicine skills.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-vanvitelli-naples",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3000,
        totalTuitionUsd: 18000,
        livingUsd: 7500,
        medium: "English",
        officialProgramUrl: "https://international.unicampania.it",
      },
    ],
  },
  {
    slug: "university-of-catania-italy",
    name: "University of Catania",
    city: "Catania",
    type: "Public/State",
    establishedYear: 1434,
    officialWebsite: "https://www.unict.it/en",
    summary:
      "University of Catania ranks QS 201–250 globally in medicine and Censis #10 nationally. It is Sicily's leading technology-focused medical university, founded in 1434. The English-medium program integrates digital health tools and simulation technology into medical training. Catania's low cost of living and warm Sicilian climate make it increasingly attractive to Indian IMAT applicants.",
    campusLifestyle:
      "Catania has a compact urban university campus set against the backdrop of Mount Etna. The faculty has invested in modern simulation facilities and digital learning infrastructure. Sicily's outdoor lifestyle, food culture, and warmth create a distinctive study environment.",
    cityProfile:
      "Catania is Sicily's second city on the east coast, with its own international airport. 2026 Cost Index: Low — one of Italy's most affordable cities for students. Monthly living: €450–700. Warm Mediterranean climate year-round. Good air connections to Rome, Milan, and via transit to India.",
    clinicalExposure:
      "Policlinico G. Rodolico–San Marco is Catania's main teaching hospital. Strong in emergency medicine, obstetrics, and oncology. The Mediterranean disease profile offers a unique clinical experience with tropical disease exposure.",
    hostelOverview:
      "ERSU Catania manages student accommodation. University residences are affordable and available for international students. Private rooms in Catania average €250–380 per person — among Italy's cheapest university city housing.",
    indianFoodSupport:
      "Catania has a small Indian student community but strong Asian grocery presence due to the city's diverse migrant population. Self-cooking is very affordable in Catania.",
    safetyOverview:
      "Catania is a safe city for students. University areas are well-managed. Standard big-city precautions apply.",
    studentSupport:
      "International student services include English-medium orientation and dedicated IMAT intake coordination. The university's technology focus means good digital learning resources.",
    whyChoose: [
      "Technology-focused medical training with simulation and digital health integration",
      "One of Italy's most affordable university cities for students",
      "Warm Sicilian climate — ideal for students from India's southern states",
      "QS 201–250 Medicine; Censis #10 nationally",
      "Own international airport for easy Italy and European travel",
    ],
    thingsToConsider: [
      "Sicily is geographically distant from northern Italy's career networks",
      "English language use in daily life is limited outside campus",
      "Smaller Indian student community",
    ],
    bestFitFor: [
      "Budget-first students who want quality without northern city costs",
      "Students comfortable with a warm Mediterranean lifestyle",
    ],
    teachingHospitals: ["Policlinico G. Rodolico–San Marco", "Ospedale Garibaldi Catania"],
    recognitionBadges: [
      "QS 201–250 Medicine",
      "Censis Rank #10 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "Digital Health Focus",
    ],
    faq: [
      {
        question: "Is Catania affordable for Indian MBBS students?",
        answer:
          "Yes — Catania is consistently among Italy's cheapest university cities. Combined with a warm climate, students from tropical and southern Indian regions often find adaptation easier than in northern Italy.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-catania-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 2800,
        totalTuitionUsd: 16800,
        livingUsd: 7000,
        medium: "English",
        officialProgramUrl: "https://www.unict.it/en",
      },
    ],
  },
  {
    slug: "university-of-messina-italy",
    name: "University of Messina",
    city: "Messina",
    type: "Public/State",
    establishedYear: 1548,
    officialWebsite: "https://www.unime.it/en",
    summary:
      "University of Messina ranks QS 201–250 globally in medicine and Censis #11 nationally. It is notable for its early clinical training model — students begin patient contact and practical hospital work significantly earlier than many Italian medical schools. Located at Sicily's gateway to mainland Italy, Messina offers a compact, student-focused environment with strong internationalisation focus.",
    campusLifestyle:
      "Messina is a mid-size Sicilian city with a well-defined university district. The medical faculty is close to the main teaching hospitals, enabling genuine early clinical integration. The city has a slower, warmer pace than northern Italy — many Indian students find the Mediterranean rhythm easier to adapt to.",
    cityProfile:
      "Messina sits on the northeastern tip of Sicily, directly across from Calabria on mainland Italy. 2026 Cost Index: Low. Monthly living: €450–650. The Strait of Messina is one of Europe's most visually distinctive university settings.",
    clinicalExposure:
      "AOU G. Martino is the university's main teaching hospital, with strong activity across emergency medicine, cardiology, and neurology. The early clinical training model means students build practical skills faster than many peer institutions.",
    hostelOverview:
      "ERSU Messina manages student accommodation. Affordable rooms at €200–350 per person. Private apartments near campus are available and very affordable.",
    indianFoodSupport:
      "Small Indian student community growing year on year. Basic South Asian produce is available in city supermarkets. Self-cooking is feasible at very low cost.",
    safetyOverview:
      "Messina is a calm, safe city with strong community orientation. Very few safety issues reported by international students.",
    studentSupport:
      "Internationalisation is a strategic priority for the University of Messina. The English-medium medicine program is supported by dedicated faculty and growing English-language support infrastructure.",
    whyChoose: [
      "Early clinical training model — patient contact from Year 2–3",
      "Strong internationalisation commitment and growing English support",
      "Very affordable living — one of Italy's cheapest student cities",
      "Warm Sicilian climate year-round",
      "Smaller cohort allows more direct faculty interaction",
    ],
    thingsToConsider: [
      "Smaller city with limited English in daily life",
      "Sicily's geographic position means more effort for mainland Italy travel",
      "Indian grocery options are limited — self-sourcing required",
    ],
    bestFitFor: [
      "Students who want early patient contact and clinical confidence",
      "Students seeking lowest-cost Italian MBBS option with good quality",
    ],
    teachingHospitals: ["AOU G. Martino Messina", "Ospedale Papardo"],
    recognitionBadges: [
      "QS 201–250 Medicine",
      "Censis Rank #11 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "Early Clinical Training Model",
    ],
    faq: [
      {
        question: "How early do students at Messina start clinical training?",
        answer:
          "Messina's program is structured for early hospital exposure, with patient contact and supervised clinical practice beginning from Years 2–3 — earlier than many Italian peer institutions.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-messina-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 2700,
        totalTuitionUsd: 16200,
        livingUsd: 7000,
        medium: "English",
        officialProgramUrl: "https://www.unime.it/en",
      },
    ],
  },
  {
    slug: "university-of-rome-tor-vergata",
    name: "University of Rome Tor Vergata",
    city: "Rome",
    type: "Public/State",
    establishedYear: 1982,
    officialWebsite: "https://web.uniroma2.it/en",
    summary:
      "University of Rome Tor Vergata ranks QS 251–300 globally in medicine and Censis #12 nationally. As one of Rome's three public universities, Tor Vergata specialises in biomedical research and technology-integrated teaching. Its modern campus and research-oriented clinical facilities offer a different Rome experience compared to the historic Sapienza campus.",
    campusLifestyle:
      "Tor Vergata's campus is Rome's most modern university environment — purpose-built in the 1980s on the city's southeast outskirts. Research institutes, modern simulation labs, and technology centres sit alongside clinical facilities. Less traditional than Sapienza but more cutting-edge in infrastructure.",
    cityProfile:
      "Rome — all the benefits of living in Italy's capital, but the Tor Vergata campus is at the city's edge (accessible by metro and bus). 2026 Cost Index: Moderate-to-high, similar to central Rome. Monthly living: €700–1,050 depending on proximity to campus vs. city centre.",
    clinicalExposure:
      "Policlinico Tor Vergata is the university's dedicated hospital — a modern facility with strong emphasis on research-integrated clinical training. Excellent in oncology, rheumatology, and transplant surgery.",
    hostelOverview:
      "EDiSU Lazio manages some housing near Tor Vergata. Most students in the area live in shared private apartments at €350–550 per person. Metro access makes central Rome housing viable.",
    indianFoodSupport:
      "Rome's large Indian community means Indian restaurants, grocery stores, and cultural support are accessible throughout the city. Tor Vergata students typically connect with the broader Rome Indian student network.",
    safetyOverview:
      "The Tor Vergata campus is quieter and safer than central Rome. Modern campus design and security measures provide a well-monitored environment.",
    studentSupport:
      "English-medium academic program with dedicated international student services. Research collaboration opportunities are strong, and students interested in academic medicine find Tor Vergata particularly supportive.",
    whyChoose: [
      "Modern research-oriented medical campus in Rome",
      "Policlinico Tor Vergata: technology-integrated clinical training",
      "Rome capital city advantages — career network, international exposure",
      "Strong biomedical research integration from Year 3 onwards",
      "Lower competition than Sapienza while still in Rome",
    ],
    thingsToConsider: [
      "Campus is on Rome's outskirts — city centre requires metro/bus commute",
      "Rome city costs remain high regardless of campus location",
      "Newer institution (est. 1982) than Rome's other universities",
    ],
    bestFitFor: [
      "Research-oriented students interested in academic medicine or specialisation",
      "Students who want Rome's career advantages in a more modern campus environment",
    ],
    teachingHospitals: ["Policlinico Tor Vergata", "Istituto Nazionale Tumori Regina Elena"],
    recognitionBadges: [
      "QS 251–300 Medicine",
      "Censis Rank #12 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "Research-Oriented Campus",
    ],
    faq: [
      {
        question: "How does Tor Vergata compare to Sapienza for MBBS in Rome?",
        answer:
          "Sapienza is older, larger, and higher in the national rankings. Tor Vergata offers a more modern, research-focused campus with smaller cohorts and a technology-integrated clinical environment. Both are WHO-recognised and NMC-eligible.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-tor-vergata-rome",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3400,
        totalTuitionUsd: 20400,
        livingUsd: 9500,
        medium: "English",
        officialProgramUrl: "https://web.uniroma2.it/en/medicine",
      },
    ],
  },
  {
    slug: "university-of-parma-italy",
    name: "University of Parma",
    city: "Parma",
    type: "Public/State",
    establishedYear: 962,
    officialWebsite: "https://www.unipr.it/en",
    summary:
      "University of Parma is among Europe's oldest institutions, with origins traced to 962 CE. It ranks QS 301–350 globally in medicine and Censis #13 nationally. The English-medium program is relatively new and designed for small, high-quality international cohorts. Parma's location in Emilia-Romagna — Italy's food valley — means excellent quality of life at moderate cost.",
    campusLifestyle:
      "Parma is a gracious, prosperous city synonymous with Parma ham and Parmesan cheese. The university campus is compact and modern, with medical facilities integrated into the university hospital district. A quieter, more relaxed academic environment than Milan or Bologna.",
    cityProfile:
      "Parma is 100 km west of Bologna on the Via Emilia. 2026 Cost Index: Moderate. Monthly living: €600–850. Excellent food scene, manageable size, good rail links to Milan and Bologna. Known for opera and the arts alongside academic life.",
    clinicalExposure:
      "AOU di Parma (Ospedale Maggiore) is the main teaching hospital. Strong in cardiology, gastroenterology, and oncology. The newer English program means smaller cohorts and more per-student clinical attention.",
    hostelOverview:
      "ER.GO manages student housing in Parma. Rooms in university residences are available and affordable. Private apartments cost €320–500 per person.",
    indianFoodSupport:
      "Parma has a smaller Indian community. South Asian produce is available in supermarkets. Bologna is 45 minutes by train with more Indian-specific resources.",
    safetyOverview:
      "Parma is among Italy's safest and most liveable mid-size cities. Exceptionally low crime rate. Very comfortable environment for international students.",
    studentSupport:
      "The newer English-medium program means direct faculty attention and smaller cohort sizes. International office is responsive and oriented toward IMAT-admitted international students.",
    whyChoose: [
      "One of Europe's oldest universities (origins 962 CE) — strong academic heritage",
      "Small English cohort — more direct faculty contact and clinical supervision",
      "Safe, prosperous city with excellent quality of life",
      "Bologna and Milan within easy rail distance",
      "Affordable relative to premium northern Italian cities",
    ],
    thingsToConsider: [
      "English program is newer — fewer alumni and reduced established track record",
      "Small Indian student community",
      "Less internationally visible than top-5 Italian universities",
    ],
    bestFitFor: [
      "Students who prefer smaller cohort sizes and direct faculty interaction",
      "Students who want northern Italian quality of life at moderate cost",
    ],
    teachingHospitals: ["AOU di Parma", "Ospedale Maggiore di Parma"],
    recognitionBadges: [
      "QS 301–350 Medicine",
      "Censis Rank #13 Italy",
      "WHO Recognised",
      "NMC Eligible",
    ],
    faq: [
      {
        question: "Is the English program at Parma well established?",
        answer:
          "The English-medium program is newer than Bologna or Padova's programs. This means smaller cohort sizes and more personal faculty attention, but a shorter alumni network. Students Traffic evaluates each year's intake structure before recommending this option.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-parma-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3200,
        totalTuitionUsd: 19200,
        livingUsd: 8500,
        medium: "English",
        officialProgramUrl: "https://www.unipr.it/en/international-students",
      },
    ],
  },
  {
    slug: "university-of-cagliari-italy",
    name: "University of Cagliari",
    city: "Cagliari",
    type: "Public/State",
    establishedYear: 1620,
    officialWebsite: "https://www.unica.it/unica/en/",
    summary:
      "University of Cagliari received accreditation for its English-medium Medicine program in 2024, making it one of Italy's newest IMAT-accessible pathways. Censis ranks it #14 nationally with a notably holistic approach. Located in Sardinia, it offers a unique Mediterranean island experience with affordable living and emerging clinical infrastructure.",
    campusLifestyle:
      "Cagliari is Sardinia's capital — a compact, manageable city with a Mediterranean coastal character. The university campus is integrated into the city, and the medical faculty is building its international infrastructure following the 2024 accreditation. Students are among the first cohorts in this program.",
    cityProfile:
      "Cagliari sits on Sardinia's southern coast. 2026 Cost Index: Low. Monthly living: €450–650. Beautiful coastline, warm climate, direct flights to mainland Italy and major European hubs. Sardinia's lifestyle is significantly more relaxed than mainland Italian cities.",
    clinicalExposure:
      "ASSL Cagliari and the university hospital complex provide clinical training. The program's holistic approach integrates community medicine, preventive care, and patient-centred models alongside standard clinical rotations.",
    hostelOverview:
      "ERSU Sardegna manages student housing. Affordable rooms available. Private apartments in Cagliari cost €250–380 per person — among Italy's lowest.",
    indianFoodSupport:
      "Cagliari has a smaller international student community. Basic international produce is available in city supermarkets. Students adapt to the local Mediterranean diet, which many find manageable.",
    safetyOverview:
      "Sardinia is one of Italy's safest regions. Cagliari is a calm, well-managed city with very low crime affecting students.",
    studentSupport:
      "Being a 2024-accredited program, the university is in active development of its international student support infrastructure. Students Traffic monitors this program's development and advises families based on latest available information.",
    whyChoose: [
      "Newly accredited 2024 English MBBS program — pioneer cohort opportunity",
      "Holistic medical education approach — prevention, community, and clinical integration",
      "Sardinia: among Italy's safest and most beautiful island environments",
      "Very affordable living with excellent Mediterranean quality of life",
      "Low competition in early years as program develops",
    ],
    thingsToConsider: [
      "Newly accredited program — limited track record and alumni network",
      "Sardinia's island location means more effort for mainland Italy travel",
      "International student support infrastructure is still developing",
    ],
    bestFitFor: [
      "Students comfortable with being in an early cohort of a growing program",
      "Budget-conscious students with a preference for island and outdoor lifestyle",
    ],
    teachingHospitals: ["ASSL Cagliari", "Ospedale Duilio Casula"],
    recognitionBadges: [
      "QS 301–350 Medicine",
      "Censis Rank #14 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "2024 English Program Accreditation",
    ],
    faq: [
      {
        question: "Is Cagliari's new English MBBS program safe to join as an Indian student?",
        answer:
          "The university (est. 1620) has a long history; the English medicine program is newly accredited in 2024. Students Traffic evaluates intake structure, NMC compliance, and hospital access before recommending it for a given admission cycle.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-cagliari-italy",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 2800,
        totalTuitionUsd: 16800,
        livingUsd: 7000,
        medium: "English",
        officialProgramUrl: "https://www.unica.it/unica/en/",
      },
    ],
  },
  {
    slug: "university-of-naples-federico-ii",
    name: "University of Naples Federico II",
    city: "Naples",
    type: "Public/State",
    establishedYear: 1224,
    officialWebsite: "https://www.unina.it/home;jsessionid=B18BBA6FC4B20D41D56F7EC47FD7B5DE.node_unina_web_prod_2",
    summary:
      "Founded by Emperor Frederick II in 1224, the University of Naples Federico II is one of the world's oldest state universities. It ranks QS 351–400 globally in medicine and Censis #15 nationally. The English-medium medicine program benefits from Naples' exceptionally rich clinical caseload and historic medical tradition.",
    campusLifestyle:
      "Naples is one of Europe's most intense and culturally extraordinary cities. The Federico II campus is spread across several historic and modern buildings in central Naples. Medical students have deep access to one of Italy's most clinically diverse hospital ecosystems.",
    cityProfile:
      "Naples is Southern Italy's cultural capital. 2026 Cost Index: Low-to-moderate. Monthly living: €500–750. World-class food, extraordinary historical heritage, proximity to Pompeii and the Amalfi Coast. Large Indian and international student presence.",
    clinicalExposure:
      "AOU Federico II is the main teaching hospital. Naples' population and disease diversity means high clinical volume across emergency medicine, cardiology, haematology, and infectious disease — providing broad clinical exposure.",
    hostelOverview:
      "ADISU Campania manages student housing. Shared apartments in Naples average €280–420 per person. Historical city centre accommodation is available at reasonable rates for a European capital-level city.",
    indianFoodSupport:
      "Naples has a significant South Asian community. Indian restaurants, Halal food outlets, and grocery stores with Indian produce are accessible in the city. Self-cooking is economical.",
    safetyOverview:
      "Naples requires street-awareness in tourist-heavy zones. University areas and residential districts used by international students are generally safe with standard urban precautions.",
    studentSupport:
      "Federico II has an international student office, English-medium academic coordination, and growing infrastructure for IMAT-admitted students. The university's size means strong peer community.",
    whyChoose: [
      "One of the world's oldest state universities (est. 1224 by Emperor Frederick II)",
      "High clinical volume — Naples' diverse population offers wide case exposure",
      "Low cost of living relative to northern Italian cities",
      "Rich cultural heritage and extraordinary quality of life",
      "Large Indian student community provides strong peer support",
    ],
    thingsToConsider: [
      "Naples requires city-awareness — larger urban environment with busy streets",
      "QS ranking 351–400 is lower than northern Italian peers",
      "English outside the university is limited",
    ],
    bestFitFor: [
      "Students who want maximum clinical exposure at lower cost",
      "Students drawn to the intensity and culture of southern Italy",
    ],
    teachingHospitals: ["AOU Federico II Naples", "AORN Ospedale dei Colli"],
    recognitionBadges: [
      "QS 351–400 Medicine",
      "Censis Rank #15 Italy",
      "WHO Recognised",
      "NMC Eligible",
      "Founded 1224 — World's Oldest State Universities",
    ],
    faq: [
      {
        question: "Is Naples Federico II's medicine degree valid for FMGE/NExT in India?",
        answer:
          "Yes. Federico II's Medicine and Surgery degree is WHO-recognised and graduates from Italian public university medicine programs are eligible for FMGE/NExT in India after meeting NMC criteria.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-naples-federico-ii",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 3000,
        totalTuitionUsd: 18000,
        livingUsd: 7500,
        medium: "English",
        officialProgramUrl: "https://www.unina.it",
      },
    ],
  },
  {
    slug: "marche-polytechnic-university-italy",
    name: "Marche Polytechnic University",
    city: "Ancona",
    type: "Public/State",
    establishedYear: 1969,
    officialWebsite: "https://www.univpm.it/Entra/Univpm_International_Gateway",
    summary:
      "Marche Polytechnic University (Università Politecnica delle Marche) is the regional leader in the Marche area and is distinguished by its innovative MedTech-integrated medicine program. Censis ranks it #16 nationally for the English-medium program. Located in Ancona on Italy's Adriatic coast, it combines technical innovation with clinical training in a smaller, more manageable city.",
    campusLifestyle:
      "Ancona is a port city on the Adriatic — more industrial and port-oriented than tourist destinations. The Marche Polytechnic campus is well-funded by the region and benefits from technology partnership with the broader polytechnic engineering culture. Medical students work alongside engineering and science students in interdisciplinary environments.",
    cityProfile:
      "Ancona is Marche's regional capital. 2026 Cost Index: Low-to-moderate. Monthly living: €500–700. Direct ferry connections to Croatia and Greece. Rail access to Bologna and Rome. Warm Adriatic climate.",
    clinicalExposure:
      "Ospedali Riuniti di Ancona is the university's main teaching hospital — a large regional academic hospital with strong surgical and emergency medicine departments. The MedTech program integrates digital diagnostics and surgical simulation.",
    hostelOverview:
      "ERSU Marche manages student accommodation. Rooms available in university residences at affordable rates. Private apartments in Ancona cost €280–430 per person.",
    indianFoodSupport:
      "Small international student community in Ancona. Basic international produce available in city supermarkets. Self-cooking is affordable and feasible.",
    safetyOverview:
      "Ancona is a safe mid-size Italian city with a calm port character. Very low crime affecting students.",
    studentSupport:
      "International student office, English-medium academic coordination, and technology-focused learning support. The polytechnic culture means strong digital and simulation resources.",
    whyChoose: [
      "MedTech-integrated medical education — surgical simulation and digital diagnostics",
      "Innovative interdisciplinary polytechnic environment",
      "Adriatic coastal city with direct connections to Greece and Croatia",
      "Affordable living with good quality of life",
      "Regional leader in Marche — manageable, less competitive environment",
    ],
    thingsToConsider: [
      "Lower overall university ranking than Italian powerhouses",
      "Ancona is less internationally connected than Rome, Milan, or Naples",
      "Smaller Indian and international student community",
    ],
    bestFitFor: [
      "Students interested in MedTech, surgical simulation, and technology-integrated medicine",
      "Students seeking affordable Italian MBBS with manageable competition",
    ],
    teachingHospitals: ["Ospedali Riuniti di Ancona", "Azienda Ospedaliero-Universitaria Ospedali Riuniti"],
    recognitionBadges: [
      "WHO Recognised",
      "NMC Eligible",
      "MedTech Program Innovation",
      "Censis Rank #16 Italy",
    ],
    faq: [
      {
        question: "What is the MedTech program at Marche Polytechnic?",
        answer:
          "MedTech integration means the medicine program incorporates digital diagnostics, surgical simulation technology, and interdisciplinary collaboration with engineering departments — preparing students for technology-integrated modern clinical practice.",
      },
    ],
    programs: [
      {
        slug: "medicine-surgery-marche-polytechnic",
        title: "Medicine and Surgery — Single Cycle Master's Degree (6 Years)",
        durationYears: 6,
        annualTuitionUsd: 2900,
        totalTuitionUsd: 17400,
        livingUsd: 7500,
        medium: "English",
        officialProgramUrl: "https://www.univpm.it/Entra/Univpm_International_Gateway",
      },
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Seeding Italy country and universities...\n");

    // Insert Italy country
    const countryRes = await client.query(
      `INSERT INTO countries (
        slug, name, region, summary, why_students_choose_it, climate,
        currency_code, meta_title, meta_description, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        region = EXCLUDED.region,
        summary = EXCLUDED.summary,
        why_students_choose_it = EXCLUDED.why_students_choose_it,
        climate = EXCLUDED.climate,
        currency_code = EXCLUDED.currency_code,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        updated_at = NOW()
      RETURNING id`,
      [
        ITALY_COUNTRY.slug,
        ITALY_COUNTRY.name,
        ITALY_COUNTRY.region,
        ITALY_COUNTRY.summary,
        ITALY_COUNTRY.whyStudentsChooseIt,
        ITALY_COUNTRY.climate,
        ITALY_COUNTRY.currencyCode,
        ITALY_COUNTRY.metaTitle,
        ITALY_COUNTRY.metaDescription,
      ]
    );
    const ITALY_ID = countryRes.rows[0].id;
    console.log(`✓ Italy country inserted/updated with ID: ${ITALY_ID}\n`);

    for (const uni of universities) {
      console.log(`Seeding: ${uni.name}...`);

      const uniRes = await client.query(
        `INSERT INTO universities (
          country_id, slug, name, city, type, established_year, summary,
          published, featured, official_website, campus_lifestyle, city_profile,
          practical_exposure, hostel_overview, dietary_support, safety_overview,
          student_support, why_choose, things_to_consider, best_fit_for,
          industry_partners, recognition_badges, faq, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          type = EXCLUDED.type,
          summary = EXCLUDED.summary,
          published = EXCLUDED.published,
          featured = EXCLUDED.featured,
          official_website = EXCLUDED.official_website,
          campus_lifestyle = EXCLUDED.campus_lifestyle,
          city_profile = EXCLUDED.city_profile,
          practical_exposure = EXCLUDED.practical_exposure,
          hostel_overview = EXCLUDED.hostel_overview,
          dietary_support = EXCLUDED.dietary_support,
          safety_overview = EXCLUDED.safety_overview,
          student_support = EXCLUDED.student_support,
          why_choose = EXCLUDED.why_choose,
          things_to_consider = EXCLUDED.things_to_consider,
          best_fit_for = EXCLUDED.best_fit_for,
          industry_partners = EXCLUDED.industry_partners,
          recognition_badges = EXCLUDED.recognition_badges,
          faq = EXCLUDED.faq,
          updated_at = NOW()
        RETURNING id`,
        [
          ITALY_ID, uni.slug, uni.name, uni.city, uni.type, uni.establishedYear, uni.summary,
          true, false, uni.officialWebsite, uni.campusLifestyle, uni.cityProfile,
          uni.clinicalExposure, uni.hostelOverview, uni.indianFoodSupport, uni.safetyOverview,
          uni.studentSupport, JSON.stringify(uni.whyChoose), JSON.stringify(uni.thingsToConsider),
          JSON.stringify(uni.bestFitFor), uni.teachingHospitals, uni.recognitionBadges,
          JSON.stringify(uni.faq),
        ]
      );
      const universityId = uniRes.rows[0].id;

      for (const prog of uni.programs) {
        await client.query(
          `INSERT INTO program_offerings (
            university_id, course_id, slug, title, duration_years,
            annual_tuition_usd, total_tuition_usd, living_usd, medium,
            official_program_url, published, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            duration_years = EXCLUDED.duration_years,
            annual_tuition_usd = EXCLUDED.annual_tuition_usd,
            total_tuition_usd = EXCLUDED.total_tuition_usd,
            living_usd = EXCLUDED.living_usd,
            medium = EXCLUDED.medium,
            official_program_url = EXCLUDED.official_program_url,
            published = EXCLUDED.published,
            updated_at = NOW()`,
          [
            universityId, COURSE_MBBS_ID, prog.slug, prog.title, prog.durationYears,
            prog.annualTuitionUsd, prog.totalTuitionUsd, prog.livingUsd,
            prog.medium, prog.officialProgramUrl, true,
          ]
        );
      }
      console.log(`  ✓ ${uni.name}`);
    }

    console.log(`\n✅ Italy Batch 1 Complete! ${universities.length} universities seeded.`);
  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
