// Build script for Shanmugha Arts, Science, Technology & Research Academy (SASTRA)
// (content migration 0151-india-shanmugha-arts-science-technology-and-research-academy).
// Writes the programme inventory CSV and the migration payload from compact, source-backed data.
// Run from the repo root:
//   node research-drafts/india/shanmugha-arts-science-technology-and-research-academy-build.mjs
// Research notes: research-drafts/india/shanmugha-arts-science-technology-and-research-academy.md
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SLUG = "shanmugha-arts-science-technology-and-research-academy";
const MIGRATION = "0151-india-shanmugha-arts-science-technology-and-research-academy";
const CHECKED = "2026-10-23";
const REVIEW_ADM = "2027-03-01"; // 2027 admissions open in March (2026 NRI registration opened 27 March 2026)
const REVIEW_LONG = "2027-10-23";
const AY = "2026-27";
const NAME = "Shanmugha Arts, Science, Technology & Research Academy";
const FULL = `${NAME} (SASTRA)`;

const SRC = {
  site: "https://www.sastra.edu/",
  ugpg: "https://www.sastra.edu/admissions/ug-pg.html",
  fee: "https://www.sastra.edu/admissions/fee-structure.html",
  hostelFee: "https://www.sastra.edu/admissions/hostel-fees.html",
  nri: "https://www.sastra.edu/18-admissions/4537-nri-guidelines.html",
  faq: "https://www.sastra.edu/18-admissions/4320-admission-2025-faq.html",
  portal: "https://webstream.sastra.edu/sastraonline/application/loginManager/applicantInitialPage.jsp",
  mtechPortal: "https://apps.sastra.edu/saschori/",
  calT: "https://www.sastra.edu/downloads/menu/Academics/2026-27/T_Calendar-2627U1.pdf",
  calK: "https://www.sastra.edu/downloads/menu/Academics/2026-27/K_Calendar-2627U1.pdf",
  calC: "https://sastra.edu/downloads/menu/Academics/2026-27/C_Calendar-2627U.pdf",
  bus: "https://www.sastra.edu/headlines-archives/4626-bus-registration-circular-for-i-year-b-com-ca-b-com-bfsi-m-sc-intg-,-intg-b-ed-m-tech-m-b-a-m-c-a-m-sc-thanjavur-campus-01-july,-2026.html",
  optCirc: "https://www.sastra.edu/headlines-archives/4502-first-year-b-tech-b-optom-m-optom-programmes-lack-of-attendance-circular-05-dec-2025.html",
  moi: "https://www.sastra.edu/images/sastra/Medium_of_Instructio/MoI.pdf",
  about: "https://www.sastra.edu/about-us/sastra.html",
  compliance: "https://www.sastra.edu/mhrd-ugc-compliance.html",
  hostel: "https://www.sastra.edu/infrastructure/amenities/hostel.html",
  library: "https://www.sastra.edu/infrastructure/library.html",
  hospital: "https://www.sastra.edu/infrastructure/amenities/hospital.html",
  schools: "https://www.sastra.edu/academics/schools.html",
  chennaiProg: "https://chennaicampus.sastra.edu/programme.php",
  chennaiAdm: "https://chennaicampus.sastra.edu/admission.php",
  chennaiAbout: "https://chennaicampus.sastra.edu/about.php",
  src: "https://src.sastra.edu/index.php/academics/programmes.html",
  nirf: "https://www.sastra.edu/sunatinsranfr/files/2026/OVERALL/index.html",
  ugc: "https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf",
  dsir: "https://www.dsir.gov.in/static/uploads/2026/05/5a8c19109c0ff84860c0e4aa8b3b793a.pdf",
};
const L = {
  ugpg: "SASTRA - UG / PG Programmes 2026 (Thanjavur, Kumbakonam and Chennai campus lists)",
  fee: "SASTRA - Fee Structure for 2026 admissions (tuition per semester by campus)",
  hostelFee: "SASTRA - Hostel lodging fee table (Thanjavur campus)",
  nri: "SASTRA - NRI Guidelines: B.Tech and Integrated Law NRI-Sponsored admissions, Academic Year 2026",
  faq: "SASTRA - Admission 2025 FAQ (latest published admission rules and eligibility)",
  portal: "SASTRA - Applicant Registration 2026 portal (help desks, NRI admissions contact)",
  calT: "SASTRA - Academic calendar 2026-27, Thanjavur campus",
  calK: "SASTRA - Academic calendar 2026-27, Kumbakonam campus",
  calC: "SASTRA - Academic calendar 2026-27, Chennai campus",
  bus: "SASTRA - Bus registration circular for I-year students, Thanjavur campus (30 June 2026)",
  optCirc: "SASTRA - First Year B.Tech / B.Optom / M.Optom attendance circular (5 December 2025)",
  moi: "SASTRA - Medium of Instruction certificate (Registrar and Controller of Examinations)",
  about: "SASTRA - About SASTRA (founding, deemed status, off-campus)",
  compliance: "SASTRA - MHRD/UGC compliance disclosure",
  hostel: "SASTRA - Hostel (Thanjavur campus)",
  library: "SASTRA - Central Library (Saraswathi Sadan)",
  hospital: "SASTRA - Hospital (Vaidyanatha Arogyasala)",
  chennaiProg: "SASTRA Chennai campus - Programmes",
  chennaiAdm: "SASTRA Chennai campus - Admissions (MBA)",
  src: "SASTRA Srinivasa Ramanujan Centre, Kumbakonam - Programmes",
  nirf: "SASTRA - NIRF 2026 data submitted, Overall (IR-O-U-0476)",
  ugc: "UGC - Consolidated list of all universities (deemed university entry no. 817)",
  dsir: "DSIR (Ministry of Science & Technology) - Directory of Recognised SIROs 2026",
};

// ---------------------------------------------------------------------------
// Indian digit grouping: 170000 -> "1,70,000"
const inrDigits = (n) => {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
};
const INR = (n) => `INR ${inrDigits(n)}`;

const CAMPUS = {
  T: { name: "Thanjavur campus", place: "Thanjavur (Tirumalaisamudram)", short: "Thanjavur" },
  K: { name: "Srinivasa Ramanujan Centre, Kumbakonam", place: "Kumbakonam", short: "Kumbakonam" },
  C: { name: "Chennai campus at Vadapalani", place: "Chennai (Vadapalani)", short: "Chennai" },
};

// Fee bands from the 2026 fee-structure page. sem = tuition per semester (INR).
const FEES = {
  btech: { sem: 85000, inc: true, sports: 1000, dev: 10000, special: 6000, label: "B.Tech / M.Tech (Integrated)" },
  btechK: { sem: 85000, inc: true, sports: 1000, dev: 10000, special: 6000, label: "Kumbakonam B.Tech (CSE & ECE)" },
  mtech: { sem: 70000, sports: 1000, dev: 10000, special: 6000, label: "M.Tech", extra: "The fee page adds a monthly stipend of INR 12,400 for eligible GATE-qualified candidates." },
  mba: { sem: 70000, sports: 1000, dev: 10000, special: 6000, label: "M.B.A." },
  mca: { sem: 50000, sports: 1000, dev: 10000, special: 6000, label: "M.C.A." },
  boptom: { sem: 55000, inc: true, sports: 1000, dev: 10000, special: 6000, label: "B.Optom" },
  bcomT: { sem: 40000, sports: 1000, special: 6000, label: "B.Com. (CA) / B.Com. (BFSI)" },
  mscT: { sem: 20000, special: 4750, label: "M.Sc. / M.Sc. (5 Year Integrated)" },
  bcomK: { sem: 40000, sports: 1000, special: 6000, label: "Kumbakonam B.Com." },
  ugK: { sem: 30000, special: 4750, label: "Kumbakonam B.Sc., B.B.A., B.C.A." },
  pgK: { sem: 20000, special: 4750, label: "Kumbakonam M.Com. / M.Sc." },
  ugC: { sem: 40000, sports: 1000, dev: 10000, special: 6000, label: "Chennai BA, BBA, BCA, B.Com. & B.Sc." },
  mbaC: { sem: 70000, sports: 1000, dev: 10000, special: 6000, label: "Chennai M.B.A." },
  mscC: { sem: 30000, sports: 1000, dev: 10000, special: 6000, label: "Chennai M.Sc." },
};
const NRI_USD = { btech: 5000 };

// ---------------------------------------------------------------------------
// Programmes. [key, campus, officialTitle, canonical, years, school, progPath|null, feeKey|null, route, opts]
// route: btech | imtech | mtech | msc | imsc | mba | mca | ug | mcom | boptom
const P = [];
const add = (key, campus, title, canonical, years, school, path, feeKey, route, opts = {}) =>
  P.push({ key, campus, title, canonical, years, school, path, feeKey, route, ...opts });

const SOC = "School of Computing", SEEE = "School of Electrical & Electronics Engineering", SOME = "School of Mechanical Engineering";
const SCBT = "School of Chemical & Biotechnology", SOCE = "School of Civil Engineering", SOM = "School of Management";
const SASHE = "School of Arts, Sciences, Humanities & Education", SRCN = "Srinivasa Ramanujan Centre";
const BIO = { noMaths: true };
// Thanjavur B.Tech (NRI-Sponsored route available)
add("btech-aerospace-engineering", "T", "B.Tech. Aerospace Engineering", "be-btech-aerospace-engineering", 4, SOME, "SoME/2025/BAERO", "btech", "btech");
add("btech-bioengineering", "T", "B.Tech. Bioengineering", "be-btech-biotechnology", 4, SCBT, "SCBT/2025/BBIOENG", "btech", "btech", BIO);
add("btech-bioinformatics", "T", "B.Tech. Bioinformatics", "be-btech-biotechnology", 4, SCBT, "SCBT/2025/BBIOINFO", "btech", "btech", BIO);
add("btech-biotechnology", "T", "B.Tech. Biotechnology", "be-btech-biotechnology", 4, SCBT, "SCBT/2025/BBIOTECH", "btech", "btech", BIO);
add("btech-chemical-engineering", "T", "B.Tech. Chemical Engineering", "be-btech-chemical-engineering", 4, SCBT, "SCBT/2025/BCHEENG", "btech", "btech");
add("btech-civil-engineering", "T", "B.Tech. Civil Engineering", "be-btech-civil-engineering", 4, SOCE, "SoCE/2025/BCIV2324", "btech", "btech");
add("btech-computer-science-business-systems", "T", "B.Tech. Computer Science & Business Systems", "be-btech-computer-science-engineering", 4, SOC, "SoC/2025/CSBS", "btech", "btech");
add("btech-computer-science-engineering", "T", "B.Tech. Computer Science & Engineering", "be-btech-computer-science-engineering", 4, SOC, "SoC/2025/CSE", "btech", "btech");
add("btech-cse-artificial-intelligence-data-science", "T", "B.Tech. Computer Science & Engineering (Artificial Intelligence & Data Science)", "be-btech-data-science", 4, SOC, "SoC/2025/CSEAIDS", "btech", "btech");
add("btech-cse-cyber-security-blockchain", "T", "B.Tech. Computer Science & Engineering (Cyber Security & Block Chain Technology)", "be-btech-cyber-security", 4, SOC, "SoC/2025/CSECSBT", "btech", "btech");
add("btech-cse-iot-automation", "T", "B.Tech. Computer Science & Engineering (IoT & Automation)", "be-btech-computer-science-engineering", 4, SOC, "SoC/2025/CSEIOTA", "btech", "btech");
add("btech-cse-networks", "T", "B.Tech. Computer Science & Engineering (Networks)", "be-btech-computer-science-engineering", 4, SOC, "SoC/2025/CSENETWORKS", "btech", "btech");
add("btech-electrical-electronics-engineering", "T", "B.Tech. Electrical and Electronics Engineering", "be-btech-electrical-electronics-engineering", 4, SEEE, "SEEE/2025/BEEE", "btech", "btech");
add("btech-eee-smart-grid-electric-vehicles", "T", "B.Tech. Electrical and Electronics Engineering (Smart Grid and Electric Vehicles)", "be-btech-electrical-electronics-engineering", 4, SEEE, "SEEE/2025/BEEESGEV", "btech", "btech");
add("btech-electronics-communication-engineering", "T", "B.Tech. Electronics & Communication Engineering", "be-btech-electronics-communication-engineering", 4, SEEE, "SEEE/2025/BECE", "btech", "btech");
add("btech-ece-cyber-physical-systems", "T", "B.Tech. Electronics & Communication Engineering (Cyber Physical Systems)", "be-btech-electronics-communication-engineering", 4, SEEE, "SEEE/2025/BECECPS", "btech", "btech");
add("btech-electronics-computer-engineering", "T", "B.Tech. Electronics and Computer Engineering", "be-btech-electronics-computer-engineering", 4, SEEE, "SEEE/2026/BTELECOMP", "btech", "btech");
add("btech-electronics-instrumentation-engineering", "T", "B.Tech. Electronics & Instrumentation Engineering", "be-btech-instrumentation-engineering", 4, SEEE, "SEEE/2025/BEIE", "btech", "btech");
add("btech-robotics-artificial-intelligence", "T", "B.Tech. Robotics & Artificial Intelligence", "be-btech-robotics-automation-engineering", 4, SEEE, "SEEE/2025/BRAI", "btech", "btech");
add("btech-electronics-engineering-vlsi", "T", "B.Tech. Electronics Engineering (VLSI Design & Technology)", "be-btech-electronics-communication-engineering", 4, SEEE, "SEEE/2025/BEEVLSI", "btech", "btech");
add("btech-information-communication-technology", "T", "B.Tech. Information and Communication Technology", "be-btech-information-technology", 4, SOC, "SoC/2025/ICT", "btech", "btech");
add("btech-information-technology", "T", "B.Tech. Information Technology", "be-btech-information-technology", 4, SOC, "SoC/2025/IT", "btech", "btech");
add("btech-industrial-engineering-management", "T", "B.Tech. Industrial Engineering and Management", "be-btech-industrial-engineering-management", 4, SOME, "SoME/2026/BIEM", "btech", "btech");
add("btech-mechanical-engineering", "T", "B.Tech. Mechanical Engineering", "be-btech-mechanical-engineering", 4, SOME, "SoME/2025/BMECH", "btech", "btech");
add("btech-mechanical-digital-manufacturing", "T", "B.Tech. Mechanical Engineering (Digital Manufacturing)", "be-btech-mechanical-engineering", 4, SOME, "SoME/2025/BMECHDM", "btech", "btech");
add("btech-mechatronics", "T", "B.Tech. Mechatronics", "be-btech-mechatronics-engineering", 4, SOME, "SoME/2025/BMECHAT", "btech", "btech");
// Thanjavur 5-year integrated M.Tech (NRI-Sponsored category not applicable)
add("mtech-integrated-biotechnology", "T", "M.Tech. Integrated Biotechnology (5 years)", "me-mtech-biotechnology", 5, SCBT, "SCBT/2025/MBOTINT", "btech", "imtech", BIO);
add("mtech-integrated-medical-nanotechnology", "T", "M.Tech. Integrated Medical Nanotechnology (5 years)", "me-mtech-materials-engineering", 5, SCBT, "SCBT/2025/MMNTINT", "btech", "imtech", BIO);
// Thanjavur M.Tech
add("mtech-aerospace-engineering", "T", "M.Tech. Aerospace Engineering", "me-mtech-aerospace-engineering", 2, SOME, "SoME/2025/MAERO", "mtech", "mtech");
add("mtech-artificial-intelligence-data-science", "T", "M.Tech. Artificial Intelligence and Data Science", "msc-data-science", 2, SOC, "SoC/2025/MAIDS", "mtech", "mtech");
add("mtech-artificial-intelligence-robotics", "T", "M.Tech. Artificial Intelligence & Robotics", "me-mtech-robotics-automation-engineering", 2, SEEE, "SEEE/2025/MAIR", "mtech", "mtech");
add("mtech-big-data-biology", "T", "M.Tech. Big Data Biology", "me-mtech-biotechnology", 2, SCBT, "SCBT/2025/MBDB", "mtech", "mtech");
add("mtech-computer-science-engineering", "T", "M.Tech. Computer Science & Engineering", "me-mtech-computer-science-engineering", 2, SOC, "SoC/2025/MCSE", "mtech", "mtech");
add("mtech-communication-systems", "T", "M.Tech. Communication Systems", "me-mtech-electronics-communication-engineering", 2, SEEE, null, "mtech", "mtech");
add("mtech-cyber-security", "T", "M.Tech. Cyber Security", "msc-cyber-security", 2, SOC, "SoC/2025/MCYBER", "mtech", "mtech");
add("mtech-digital-manufacturing", "T", "M.Tech. Digital Manufacturing", "me-mtech-mechanical-engineering", 2, SOME, "SoME/2025/MECHMDM", "mtech", "mtech");
add("mtech-embedded-systems", "T", "M.Tech. Embedded Systems", "me-mtech-electronics-communication-engineering", 2, SOC, null, "mtech", "mtech");
add("mtech-iot-automation", "T", "M.Tech. IoT and Automation", "me-mtech-computer-science-engineering", 2, SOC, null, "mtech", "mtech");
add("mtech-industrial-biotechnology", "T", "M.Tech. Industrial Biotechnology", "me-mtech-biotechnology", 2, SCBT, "SCBT/2025/MINDBIO", "mtech", "mtech");
add("mtech-medical-nanotechnology", "T", "M.Tech. Medical Nanotechnology", "me-mtech-materials-engineering", 2, SCBT, "SCBT/2025/MMNT", "mtech", "mtech");
add("mtech-power-energy-systems", "T", "M.Tech. Power & Energy Systems", "me-mtech-electrical-engineering", 2, SEEE, "SEEE/2025/MPES", "mtech", "mtech");
add("mtech-structural-engineering", "T", "M.Tech. Structural Engineering", "me-mtech-civil-engineering", 2, SOCE, "SoCE/2025/MCIVSE1819", "mtech", "mtech");
add("mtech-wireless-smart-communications", "T", "M.Tech. Wireless Smart Communications", "me-mtech-electronics-communication-engineering", 2, SEEE, "SEEE/2025/MWSC", "mtech", "mtech");
add("mtech-vlsi", "T", "M.Tech. VLSI", "me-mtech-electronics-communication-engineering", 2, SOC, "SoC/2025/MVLSI", "mtech", "mtech");
// Thanjavur other
add("b-optom", "T", "B.Optom. (Bachelor of Optometry), in collaboration with Dr. Agarwal's Institute of Optometry", "bachelor-optometry", 4, SCBT, "SCBT/2025/BOptom", "boptom", "boptom");
add("bcom-computer-applications", "T", "B.Com. (Computer Applications)", "bcom", 3, SOM, "SoM/2025/BCOMCA2425", "bcomT", "ug", { subj: "commerce" });
add("bcom-bfsi", "T", "B.Com. (Banking, Financial Services and Insurance)", "bcom", 3, SOM, "SoM/2025/BCOMBFSI2425", "bcomT", "ug", { subj: "commerce" });
add("bsc-electronics-manufacturing", "T", "B.Sc. Electronics Manufacturing", "bsc-physics", 3, SEEE, "SEEE/2026/BSCELE", null, "ug", { subj: "science", partner: "Tata Electronics" });
add("msc-biotechnology", "T", "M.Sc. Biotechnology", "msc-biotechnology", 2, SCBT, "SCBT/2025/MSCBIOTECH", "mscT", "msc");
add("msc-bioinformatics", "T", "M.Sc. Bioinformatics", "msc-biological-sciences", 2, SCBT, "SCBT/2025/MSCBIOINFO", "mscT", "msc");
add("msc-chemistry", "T", "M.Sc. Chemistry", "msc-chemistry", 2, SASHE, "SASH/2025/MSCCHE", "mscT", "msc");
add("msc-electronics", "T", "M.Sc. Electronics", "msc-physics", 2, SEEE, "SEEE/2026/MSCELE", "mscT", "msc");
add("msc-physics", "T", "M.Sc. Physics", "msc-physics", 2, SASHE, "SASH/2025/MSCPHY", "mscT", "msc");
add("msc-data-science", "T", "M.Sc. Data Science", "msc-data-science", 2, SASHE, "SASH/2025/MSCDS", "mscT", "msc");
add("msc-integrated-biotechnology", "T", "M.Sc. Integrated Biotechnology (5 years)", "msc-biotechnology", 5, SCBT, "SCBT/2025/MSCBIOTECHINTG", "mscT", "imsc", { subj: "science" });
add("msc-integrated-physics", "T", "M.Sc. Integrated Physics (5 years)", "msc-physics", 5, SASHE, "SASH/2025/MSCPHYINT", "mscT", "imsc", { subj: "science" });
add("msc-integrated-chemistry", "T", "M.Sc. Integrated Chemistry (5 years)", "msc-chemistry", 5, SASHE, "SASH/2025/MSCCHEINT", "mscT", "imsc", { subj: "science" });
add("msc-integrated-mathematics-computing", "T", "M.Sc. Integrated Mathematics and Computing (5 years)", "msc-mathematics", 5, SASHE, "SASH/2025/MSCMC", "mscT", "imsc", { subj: "science" });
add("msc-integrated-data-science", "T", "M.Sc. Integrated Data Science (5 years)", "msc-data-science", 5, SASHE, "SASH/2025/MSCDSINT", "mscT", "imsc", { subj: "science" });
add("mba", "T", "M.B.A. (Master of Business Administration)", "mba", 2, SOM, "SoM/2025/MBA2526", "mba", "mba");
add("mca", "T", "M.C.A. (Master of Computer Applications)", "mca", 2, SOC, "SoC/2025/MCA", "mca", "mca");
// Kumbakonam (Srinivasa Ramanujan Centre)
add("kumbakonam-btech-computer-science-engineering", "K", "B.Tech. Computer Science & Engineering (Kumbakonam)", "be-btech-computer-science-engineering", 4, SRCN, "SoC/2025/CSE", "btechK", "btech");
add("kumbakonam-btech-electronics-communication-engineering", "K", "B.Tech. Electronics & Communication Engineering (Kumbakonam)", "be-btech-electronics-communication-engineering", 4, SRCN, "SEEE/2025/BECE", "btechK", "btech");
add("kumbakonam-bba", "K", "B.B.A. (Kumbakonam)", "bba", 3, SRCN, "SRC/2025/BBA2526", "ugK", "ug", { subj: "any" });
add("kumbakonam-bca", "K", "B.C.A. (Kumbakonam)", "bca", 3, SRCN, "SRC/2025/BCA", "ugK", "ug", { subj: "any" });
add("kumbakonam-bcom", "K", "B.Com. (Kumbakonam)", "bcom", 3, SRCN, "SRC/2025/BCOM", "bcomK", "ug", { subj: "commerce" });
add("kumbakonam-bsc-biochemistry", "K", "B.Sc. Biochemistry (Kumbakonam)", "bsc-biological-sciences", 3, SRCN, "SRC/2025/BSCBIOCHE", "ugK", "ug", { subj: "science" });
add("kumbakonam-bsc-computer-science", "K", "B.Sc. Computer Science (Kumbakonam)", "bsc-computer-science", 3, SRCN, "SRC/2025/BSCCOMP", "ugK", "ug", { subj: "science" });
add("kumbakonam-bsc-electronics-communication-systems", "K", "B.Sc. Electronics and Communication Systems (Kumbakonam)", "bsc-physics", 3, SRCN, "SRC/2025/BSCECS", "ugK", "ug", { subj: "science" });
add("kumbakonam-bsc-mathematics-computer-applications", "K", "B.Sc. Mathematics with Computer Applications (Kumbakonam)", "bsc-mathematics", 3, SRCN, "SRC/2025/BSCMATCOMP2526", "ugK", "ug", { subj: "science" });
add("kumbakonam-bsc-microbiology", "K", "B.Sc. Microbiology (Kumbakonam)", "bsc-biological-sciences", 3, SRCN, "SRC/2025/BSCMICRO", "ugK", "ug", { subj: "science" });
add("kumbakonam-bsc-physics", "K", "B.Sc. Physics (Kumbakonam)", "bsc-physics", 3, SRCN, "SRC/2025/BSCPHY", "ugK", "ug", { subj: "science" });
add("kumbakonam-mcom", "K", "M.Com. (Kumbakonam)", "mcom", 2, SRCN, "SRC/2025/MCOM2526", "pgK", "mcom");
add("kumbakonam-msc-biochemistry", "K", "M.Sc. Biochemistry (Kumbakonam)", "msc-biological-sciences", 2, SRCN, "SRC/2025/MSCBIOCHE", "pgK", "msc");
add("kumbakonam-msc-computer-science", "K", "M.Sc. Computer Science (Kumbakonam)", "msc-computer-science", 2, SRCN, "SRC/2025/MSCCOMP", "pgK", "msc");
add("kumbakonam-msc-mathematics", "K", "M.Sc. Mathematics (Kumbakonam)", "msc-mathematics", 2, SRCN, "SRC/2025/MSCMATHS2526", "pgK", "msc");
add("kumbakonam-msc-microbiology", "K", "M.Sc. Microbiology (Kumbakonam)", "msc-biological-sciences", 2, SRCN, "SRC/2025/MSCMICROBIO", "pgK", "msc");
// Chennai (Vadapalani)
add("chennai-ba-economics-public-policy", "C", "B.A. Economics & Public Policy (Chennai)", "bachelor-economics", 3, "Chennai campus", null, "ugC", "ug", { subj: "any", chennaiUg: true });
add("chennai-bcom", "C", "B.Com. (Chennai)", "bcom", 3, "Chennai campus", null, "ugC", "ug", { subj: "commerce", chennaiUg: true });
add("chennai-mba", "C", "M.B.A. (Chennai)", "mba", 2, "Chennai campus", null, "mbaC", "mba");
add("chennai-msc-data-science", "C", "M.Sc. Data Science (AI Specialization with Zoho Corp) (Chennai)", "msc-data-science", 2, "Chennai campus", null, "mscC", "msc", { partner: "Zoho Corporation" });

const progSlug = (p) => `sastra-${p.key}`;
const progUrl = (p) => (p.path ? `https://www.sastra.edu/prog/${p.path}/` : p.campus === "C" ? SRC.chennaiProg : SRC.ugpg);

// ---------------------------------------------------------------------------
// Held and inventory-only rows: [title, level, campus, duration, canonical, path, notes]
const HELD = [
  ["M.Optom. (Master of Optometry), in collaboration with Dr. Agarwal's Institute of Optometry", "masters", "Thanjavur", "2 years", "master-optometry", "SCBT/2025/MOptom",
    "Held: no published eligibility. The Admission 2025 FAQ lists eligibility for B.Optom. but not M.Optom.; the 2026-27 programme book (90 credits, 4 semesters, practice school at ESO/SN) gives none. Fee INR 75,000 per semester is on the fee page."],
  ["M.Tech. Defence Technology", "masters", "Thanjavur", "2 years", "GAP:me-mtech-defence-technology", null,
    "Held: on the 2026 programme list but its programme page (/prog/SoME/MTDT) returns 404, and no canonical defence-technology course exists; taxonomy GAP left for review rather than forcing a parent mapping."],
  ["B.A., LL.B. (Hons.) (5-year integrated)", "bachelors", "Thanjavur (SASTRA School of Law)", "5 years", "llb", "SoL/BALLB/2429",
    "Held (BCI gate): Bar Council of India approved-universities list could not be read on 2026-10-23 (barcouncilofindia.org is a JavaScript app whose data API is encrypted). Published route: NRI-Sponsored USD 4,000 a year (management discretion, CLAT score requested); domestic CLAT 2025 + Class XII 50:50; tuition INR 75,000 per semester."],
  ["B.B.A., LL.B. (Hons.) (5-year integrated)", "bachelors", "Thanjavur (SASTRA School of Law)", "5 years", "llb", "SoL/BBALLB/2429",
    "Held (BCI gate): BCI list unreadable on 2026-10-23 (see B.A., LL.B.). NRI-Sponsored USD 4,000 a year; INR 75,000 per semester."],
  ["B.Com., LL.B. (Hons.) (5-year integrated)", "bachelors", "Thanjavur (SASTRA School of Law)", "5 years", "llb", "SoL/BCOMLLB/2429",
    "Held (BCI gate): BCI list unreadable on 2026-10-23 (see B.A., LL.B.). NRI-Sponsored USD 4,000 a year; INR 75,000 per semester."],
  ["B.Sc., B.Ed. Physics (4-year integrated)", "bachelors", "Thanjavur", "4 years", "bed", "SASHE/2025/BSCBEDPHY",
    "Held (NCTE gate): ncte.gov.in failed TLS verification through the egress proxy on 2026-10-23, so NCTE recognition could not be checked on the regulator's own list; sastra.edu/ncte.html is only the institution's disclosure. Programme page also returns 404. Fee INR 25,000 per semester."],
  ["B.Sc., B.Ed. Mathematics (4-year integrated)", "bachelors", "Thanjavur", "4 years", "bed", "SASHE/2025/BSCBEDMATHS",
    "Held (NCTE gate): NCTE list unreachable on 2026-10-23 (see B.Sc., B.Ed. Physics). Programme page returns 404."],
  ["B.Com., B.Ed. (4-year integrated)", "bachelors", "Thanjavur", "4 years", "bed", null,
    "Held (NCTE gate): NCTE list unreachable on 2026-10-23; the 2026 programme list links this title to '#' (no programme page)."],
  ["M.A. Sanskrit (5-year integrated)", "masters", "Thanjavur", "5 years", "ma-languages-linguistics", "SASH/MASANINT",
    "Held: teaching language not confirmed. The Medium of Instruction certificate lists the programmes taught in English and does not name M.A.; lib/catalogue-facets.ts has no 'sanskrit' code. Fee INR 20,000 per semester."],
  ["B.B.A. (Chennai)", "bachelors", "Chennai", "3 years (4-year Honours option)", "bba", null,
    "Held: on the 2026 programme list and Chennai fee table (INR 40,000 per semester) but absent from the 2026-27 Chennai academic calendar (columns M.Sc., M.B.A., B.Com./B.A.), so a 2026-27 intake is not confirmed."],
  ["B.C.A. (Chennai)", "bachelors", "Chennai", "3 years (4-year Honours option)", "bca", null,
    "Held: on the 2026 programme list and Chennai fee table but absent from the 2026-27 Chennai academic calendar; intake not confirmed."],
  ["B.Sc. Visual Communications with Minor Specialisation in Electronic Media (Chennai)", "bachelors", "Chennai", "3 years (4-year Honours option)", "bachelor-media-communication", null,
    "Held: listed on chennaicampus.sastra.edu/programme.php and in the Admission 2025 FAQ but not on the 2026 UG/PG programme list or the 2026-27 Chennai calendar; current admission not confirmed."],
];

// ---------------------------------------------------------------------------
// Text builders
const campusIntake = (p) => {
  if (p.route === "btech" || p.route === "imtech" || p.route === "boptom") return { month: "August", code: "august" };
  return { month: "July", code: "july" };
};
const calFor = (p) => (p.campus === "T" ? ["calT", SRC.calT] : p.campus === "K" ? ["calK", SRC.calK] : ["calC", SRC.calC]);
const isGlobal = (p) => p.route === "btech" && p.campus === "T";

const E = {
  btechMerit: "Class XII pass with Mathematics and Physics plus Chemistry, Biotechnology, Computer Science or Biology, with at least 60% aggregate in a single sitting (SASTRA 2025 rules)",
  noMathsYes: "Applicants who did not study Mathematics in Class XII are eligible for this programme",
  noMathsNo: "Mathematics in Class XII is required for this branch; non-Mathematics applicants may apply only to Biotechnology, Bioinformatics and Bioengineering",
  rank: "Half the merit seats are ranked on Class XII plus JEE Main (equal weight) and half on Class XII alone; JEE Main is optional",
  nri: "NRI-Sponsored category (2026): at least 75% overall in Class XII or equivalent and at least 60% aggregate in Mathematics, Physics and Chemistry",
  sponsor: "The NRI sponsor must be a parent or blood relative living abroad who undertakes to pay the full tuition fee",
  aiu: "Curricula other than Indian state boards, CBSE/ICSE, Cambridge/Singapore, IB or a US high-school diploma need an AIU equivalence certificate",
  age: "In the 2025 cycle, undergraduate applicants could not have completed 19 years on 1 August 2025",
  ugPass: "Class XII (10+2) pass from a recognised board with subjects relevant to the programme",
  cuet: "Admission is on Class XII marks, plus CUET scores where results arrive in time (SASTRA 2025 rules)",
  pgDegree: "A valid undergraduate degree in a related discipline from a recognised university",
  gate: "GATE-qualified M.Tech candidates are preferred and receive a 50% tuition fee waiver and a stipend (SASTRA 2025 rules)",
  mbaDeg: "First-class bachelor's degree of at least three years from a recognised university",
  mbaTests: "Preference for good CAT, XAT, AIMAT, CMAT or AIMCAT scores; selection also uses an entrance exam and an interview",
  mcaDeg: "Any recognised bachelor's degree of at least three years, with Mathematics studied in Class XII or in the degree",
  mcaTest: "Selection uses qualifying-degree marks and an entrance exam conducted by SASTRA",
  mcomDeg: "A B.Com., B.A. (Corporate Secretaryship) or B.B.A. degree from a recognised university",
  optom1: "Class XII pass in a single sitting in Physics, Chemistry, Biology and Mathematics, or Physics, Chemistry, Botany and Zoology",
  optom2: "At least 60% aggregate in all Class XII subjects",
};

function eligibility(p) {
  switch (p.route) {
    case "btech": {
      const items = [E.btechMerit, p.noMaths ? E.noMathsYes : E.noMathsNo, E.rank];
      if (isGlobal(p)) items.push(E.nri, E.sponsor, E.aiu);
      items.push(E.age);
      return {
        intro: isGlobal(p)
          ? "SASTRA admits to this B.Tech through merit admission on Class XII marks (JEE Main optional) and through a separate NRI-Sponsored category with its own academic thresholds."
          : "SASTRA admits to this Kumbakonam B.Tech only through merit admission on Class XII marks, with JEE Main optional.",
        items,
      };
    }
    case "imtech":
      return { intro: "The 5-year integrated M.Tech uses SASTRA's B.Tech eligibility rule and merit ranking; the NRI-Sponsored category does not apply.", items: [E.btechMerit, E.noMathsYes, E.rank, E.age] };
    case "mtech":
      return { intro: "SASTRA admits M.Tech students on qualifying-degree marks, with preference for GATE scores.", items: [E.pgDegree, E.gate] };
    case "msc":
      return { intro: "SASTRA admits M.Sc. students on the marks of their qualifying undergraduate degree.", items: [E.pgDegree] };
    case "imsc":
      return { intro: "SASTRA admits students to the 5-year integrated M.Sc. straight after Class XII.", items: [E.ugPass, E.cuet, E.age] };
    case "ug":
      return { intro: "SASTRA admits students to this undergraduate programme straight after Class XII.", items: [E.ugPass, E.cuet, E.age] };
    case "mcom":
      return { intro: "SASTRA admits M.Com. students on the marks of their qualifying commerce or business degree.", items: [E.mcomDeg] };
    case "mba":
      return p.campus === "C"
        ? { intro: "SASTRA's Chennai campus admits MBA students on merit across several published parameters.", items: [E.mbaDeg, E.mbaTests, "The Chennai campus also weighs Class X and XII scores, degree scores and achievements in sports, music or arts, and may hold an interview"] }
        : { intro: "SASTRA admits MBA students on qualifying-degree scores, an entrance exam and an interview.", items: [E.mbaDeg, E.mbaTests] };
    case "mca":
      return { intro: "SASTRA admits MCA students on qualifying-degree marks and its own entrance exam.", items: [E.mcaDeg, E.mcaTest] };
    case "boptom":
      return { intro: "SASTRA sets a science-subject and 60% aggregate rule for the B.Optom.", items: [E.optom1, E.optom2, E.age] };
    default:
      throw new Error(`no eligibility for ${p.route}`);
  }
}

const STEP_PORTAL = "Register on SASTRA's online admissions portal (webstream.sastra.edu), directly or through DigiLocker, and apply separately for each campus";
const STEP_FORM = "Complete the online application, upload your marksheets and pay the application fee online";
const STEP_LETTER = "SASTRA admits on rolling merit and emails a provisional admission letter to selected applicants";
const STEP_PAY = "Pay the tuition fee online to confirm the seat; application, admission, fee payment and enrolment are all online";

function steps(p) {
  if (p.route === "btech" && isGlobal(p)) {
    return [
      "Register on SASTRA's admissions portal (webstream.sastra.edu) with an email ID and an Indian mobile number; NRI-Sponsored applicants select the category 'NRI'",
      "Complete the application, upload the documents and pay the online application fee (INR 650 for the NRI-Sponsored category in 2026)",
      "Merit applicants are ranked in Stream 1 (Class XII with JEE Main) and Stream 2 (Class XII only) and called to counselling; NRI-Sponsored seats are allotted first come, first served with no entrance test",
      "NRI-Sponsored applicants remit the first-year tuition by SWIFT transfer using details sent by SASTRA's NRI Admissions team (+91 4362 350016)",
    ];
  }
  if (p.route === "btech" || p.route === "imtech") {
    return [
      STEP_PORTAL,
      "Enter Class XII marks and, if taken, JEE Main scores; one application covers both merit streams",
      "SASTRA ranks applicants in Stream 1 (Class XII with JEE Main) and Stream 2 (Class XII only) and calls them to counselling",
      STEP_PAY,
    ];
  }
  if (p.route === "mtech") {
    return [
      "Apply online through SASTRA's admissions portal (webstream.sastra.edu); M.Tech admissions are also linked at apps.sastra.edu/saschori",
      "Upload your degree marksheets and any GATE score card",
      STEP_LETTER,
      STEP_PAY,
    ];
  }
  if (p.route === "mba" && p.campus === "C") {
    return [STEP_PORTAL, "Upload your degree marksheets and any CAT, XAT, AIMAT or ATMA score", "Attend the interview if called; SASTRA emails a provisional admission letter to selected applicants", STEP_PAY];
  }
  if (p.route === "mba") {
    return [STEP_PORTAL, "Upload your degree marksheets and any CAT, XAT, AIMAT, CMAT or AIMCAT score", "Take the entrance exam and interview if called; SASTRA emails a provisional admission letter to selected applicants", STEP_PAY];
  }
  if (p.route === "mca") {
    return [STEP_PORTAL, "Upload your degree and Class XII marksheets", "Take SASTRA's MCA entrance exam; selected applicants receive a provisional admission letter by email", STEP_PAY];
  }
  return [STEP_PORTAL, STEP_FORM, STEP_LETTER, STEP_PAY];
}

function documents(p) {
  if (p.route === "btech" && isGlobal(p)) {
    return {
      academic: ["Class XII (or equivalent) marksheet, when available", "JEE Main score, if taken (merit route)", "AIU equivalence certificate, where the curriculum requires one"],
      application: ["Photocopy of the sponsor's passport (NRI-Sponsored)", "Sponsorship letter to the Registrar undertaking to pay the full tuition fee (NRI-Sponsored)", "Sponsor's address proof abroad, such as a recent utility bill (NRI-Sponsored)", "Sponsor's employment proof: employer certificate, salary slip or contract (NRI-Sponsored)"],
    };
  }
  const academicBy = {
    btech: ["Class XII (10+2) marksheet", "JEE Main score, if taken"],
    imtech: ["Class XII (10+2) marksheet", "JEE Main score, if taken"],
    boptom: ["Class XII (10+2) marksheet showing Physics, Chemistry and Biology or Botany and Zoology"],
    ug: ["Class XII (10+2) marksheet", "CUET score, if taken"],
    imsc: ["Class XII (10+2) marksheet", "CUET score, if taken"],
    mtech: ["Undergraduate degree marksheets", "GATE score card, if qualified"],
    msc: ["Undergraduate degree marksheets"],
    mcom: ["B.Com., B.A. (Corporate Secretaryship) or B.B.A. marksheets"],
    mba: ["Undergraduate degree marksheets", "CAT, XAT, AIMAT, CMAT, AIMCAT or ATMA score, if taken"],
    mca: ["Undergraduate degree marksheets", "Class XII marksheet showing Mathematics, where the degree has none"],
  };
  return {
    academic: academicBy[p.route],
    application: ["Online application on SASTRA's admissions portal, registered with an email ID and mobile number", "Online application fee payment"],
  };
}

function deadlines(p) {
  const c = CAMPUS[p.campus].short;
  if (p.route === "btech" && isGlobal(p)) return "SASTRA opened NRI-Sponsored B.Tech registration for 2026 on 27 March 2026. First-year B.Tech orientation for 2026-27 began on 3 August 2026 at Thanjavur; 2027 dates are not yet published.";
  if (p.route === "btech" || p.route === "imtech") return `First-year ${p.route === "imtech" ? "integrated M.Tech" : "B.Tech"} orientation for 2026-27 began on 3 August 2026 at ${c}. SASTRA has not yet published its 2027 application dates.`;
  if (p.route === "boptom") return "First-year B.Optom. students follow the first-year engineering schedule, which began with orientation on 3 August 2026. SASTRA has not yet published its 2027 application dates.";
  return `The 2026-27 odd semester began on 9 July 2026 at the ${c} campus. SASTRA admits to this programme on a rolling basis and has not yet published its 2027 dates.`;
}

function overview(p) {
  const where = CAMPUS[p.campus].name;
  const base = `${FULL} teaches the ${p.years}-year ${p.title.replace(/ \((Kumbakonam|Chennai)\)$/, "")} in English at its ${where}.`;
  if (isGlobal(p)) return `${base} Indian applicants are admitted on Class XII marks with optional JEE Main; NRI-sponsored applicants can apply in a separate category at USD 5,000 a year.`;
  if (p.route === "btech") return `${base} SASTRA's NRI-Sponsored category is open only at Thanjavur, so this campus admits through merit admission on Class XII marks and optional JEE Main.`;
  if (p.route === "imtech") return `${base} SASTRA's NRI guidelines state that the NRI-Sponsored category does not apply to the integrated M.Tech.`;
  return `${base} SASTRA publishes no NRI or foreign-national route or fee for this programme.`;
}

function feeFor(p) {
  if (!p.feeKey) {
    return {
      fee: { status: "on_request", verifiedAt: CHECKED, notes: "SASTRA's 2026 fee-structure page lists no tuition row for the B.Sc. Electronics Manufacturing, a new 2026 programme at the Thanjavur campus; the published Thanjavur rows cover B.Com., B.Sc. B.Ed., M.Sc. and professional programmes only. The fee must be obtained from SASTRA's Office of Admissions." },
      feeNotes: "SASTRA has not published a tuition fee for the B.Sc. Electronics Manufacturing in its 2026 fee structure. Hostel lodging at Thanjavur ranges from INR 16,000 to INR 90,000 by room type, and food is charged separately.",
    };
  }
  const f = FEES[p.feeKey];
  const annual = f.sem * 2;
  const parts = [`SASTRA's fee structure for 2026 admissions lists ${p.campus === "T" ? "Thanjavur " : ""}${f.label} tuition of ${INR(f.sem)} per semester (${INR(annual)} a year)`];
  if (f.inc) parts[0] += ", with a 5% annual increase from the second year";
  const extras = [];
  if (f.sports) extras.push(`${INR(f.sports)} a year for sports and unit tests`);
  if (f.dev) extras.push(`a one-time development fee of ${INR(f.dev)}`);
  if (f.special) extras.push(`one-time special, registration and medical-exam fees of ${INR(f.special)} at admission`);
  const joined = extras.length > 1 ? `${extras.slice(0, -1).join(", ")} and ${extras[extras.length - 1]}` : extras[0];
  let notes = `${parts[0]}, plus ${joined}.`;
  if (f.extra) notes += ` ${f.extra}`;
  if (isGlobal(p)) notes += " NRI-Sponsored students pay USD 5,000 a year in tuition (Academic Year 2026 NRI guidelines).";
  notes += " Accommodation and food are charged separately.";
  const fee = {
    status: "confirmed",
    academicYear: AY,
    officialFeeCurrency: "INR",
    officialAnnualTuitionAmount: annual,
    officialTotalTuitionAmount: null,
    annualTuitionUsd: null,
    totalTuitionUsd: null,
    verifiedAt: CHECKED,
    notes,
    audience: "domestic",
  };
  const feeNotes = isGlobal(p)
    ? `The headline fee is SASTRA's 2026 merit-admission tuition of ${INR(annual)} a year (${INR(f.sem)} per semester, rising 5% a year from year two). NRI-Sponsored students pay USD 5,000 a year in tuition.`
    : `The headline fee is SASTRA's 2026 tuition of ${INR(annual)} a year (${INR(f.sem)} per semester)${f.inc ? ", rising 5% a year from year two" : ""}. SASTRA publishes no NRI or foreign-national fee for this programme.`;
  const out = { fee, feeNotes };
  if (isGlobal(p)) {
    out.additionalFees = [{
      audience: "international",
      currency: "USD",
      annualAmount: NRI_USD.btech,
      academicYear: AY,
      verifiedAt: CHECKED,
      notes: "SASTRA's NRI-Sponsored category tuition for B.Tech, Academic Year 2026: USD 5,000 per annum, payable by SWIFT transfer. NRI-Sponsored seats are at the Thanjavur campus only.",
    }];
  }
  return out;
}

function audience(p) {
  if (isGlobal(p)) {
    return {
      availability: "global",
      eligibleAudiences: [
        "Indian applicants through SASTRA's merit admission (Class XII, optional JEE Main)",
        "NRI-Sponsored applicants whose parent or blood relative abroad sponsors the full tuition fee",
      ],
      restrictions: [
        "SASTRA publishes no separate route or fee for foreign nationals; its international route is the NRI-Sponsored category",
        "NRI-Sponsored seats are at the Thanjavur campus only and are allotted first come, first served, subject to seat availability",
      ],
      notes: "The NRI-Sponsored category needs no SASTRA entrance test and requires 75% overall and 60% in Mathematics, Physics and Chemistry in Class XII.",
      verifiedAt: CHECKED,
      sourceUrl: SRC.nri,
    };
  }
  const restrictions = [];
  if (p.route === "btech") restrictions.push("SASTRA's NRI guidelines state that NRI-Sponsored admission is available only at the Thanjavur campus, not at Kumbakonam");
  else if (p.route === "imtech") restrictions.push("SASTRA's NRI guidelines state that the NRI-Sponsored category is not applicable to the 5-year integrated M.Tech");
  else restrictions.push("SASTRA's NRI-Sponsored category covers only B.Tech and integrated law at Thanjavur; it publishes no NRI or foreign-national route or fee for this programme");
  return {
    availability: "restricted",
    eligibleAudiences: ["Indian applicants through SASTRA's merit admission"],
    restrictions,
    notes: "Non-Indian applicants would need SASTRA's Office of Admissions to confirm whether, and on what fee, it admits them to this programme.",
    verifiedAt: CHECKED,
    sourceUrl: SRC.nri,
  };
}

function teaching(p) {
  const where = CAMPUS[p.campus].name;
  const extra = {
    "b-optom": " Eight semesters and 216 credits; semesters 7 and 8 are a project and two internships, with practice school at ESO/SN.",
    "bsc-electronics-manufacturing": " 135-credit programme offered with Tata Electronics.",
    "chennai-msc-data-science": " AI specialisation offered with Zoho Corp.",
    "chennai-ba-economics-public-policy": " 120 credits over 3 years; an optional fourth Honours year adds 40 credits, and SASTRA lists a 2+1 industry-partnership option.",
    "chennai-bcom": " 3-year programme with an optional fourth Honours year.",
  }[p.key] ?? "";
  const label = p.years === 5 && (p.route === "imtech" || p.route === "imsc") ? `${p.years}-year integrated programme` : `${p.years}-year programme`;
  return [{ phase: label, language: "English", details: `Full-time study at SASTRA's ${where} (${p.school}).${extra}` }];
}

// ---------------------------------------------------------------------------
const programmes = P.map((p) => {
  const { month, code } = campusIntake(p);
  const f = feeFor(p);
  const o = {
    slug: progSlug(p),
    canonicalCourseSlug: p.canonical,
    officialTitle: p.title,
    durationYears: p.years,
    fee: f.fee,
    officialProgramUrl: progUrl(p),
    audienceEligibility: audience(p),
    admissionsContent: {
      overview: overview(p),
      eligibility: eligibility(p),
      applicationSteps: steps(p),
      documentsRequired: documents(p),
      deadlinesNote: deadlines(p),
    },
    medium: "English",
    mediumNote: "SASTRA's Registrar and Controller of Examinations certify English as the medium of instruction for all its degree programmes.",
    instructionLanguages: ["english"],
    intakeMonths: [month],
    intakeCodes: [code],
    feeVerifiedAt: CHECKED,
    feeNotes: f.feeNotes,
    teachingPhases: teaching(p),
  };
  if (f.additionalFees) o.additionalFees = f.additionalFees;
  return o;
});

// ---------------------------------------------------------------------------
// Evidence
const ev = (entity, publicField, claimText, sourceLabel, sourceUrl, extra = {}) => ({
  entity,
  publicField,
  claimText,
  status: "verified",
  sourceLabel,
  sourceUrl,
  sourceGrade: "A",
  checkedAt: CHECKED,
  reviewBy: extra.reviewBy ?? REVIEW_LONG,
  universitySlug: SLUG,
  ...(extra.programmeSlug ? { programmeSlug: extra.programmeSlug } : {}),
  ...(extra.internalNotes ? { internalNotes: extra.internalNotes } : {}),
});
const uev = (field, claim, key, extra = {}) => ev("university", field, claim, L[key], SRC[key], extra);

const FAQ_NOTE = "Latest published admission FAQ; the portal's 'Admissions - FAQ' link (sastra.edu/admissions.html) returned 404 on 2026-10-23 and no 2026 FAQ article exists in the site search.";

function programmeEvidence() {
  const out = [];
  for (const p of P) {
    const slug = progSlug(p);
    const pe = (field, claim, key, extra = {}) => out.push(ev("programme", field, claim, L[key], SRC[key], { programmeSlug: slug, ...extra }));
    const listed = p.campus === "C" ? "Chennai campus programme list (UG: BBA, BCA, B.A. Economics & Public Policy, B.Com.; PG: MBA, M.Sc. Data Science (AI Specialization with Zoho Corp))" : `${CAMPUS[p.campus].short} campus programme list`;
    // eligibility
    const eligClaim = {
      btech: "Admission 2025 FAQ: B.Tech / 5-Year Integrated M.Tech eligibility - a pass in +2 with Mathematics & Physics compulsory and Chemistry / Biotechnology / Computer Science / Biology, minimum +2 aggregate of 60% in a single sitting; applicants without Mathematics eligible for B.Tech Biotechnology, Bioinformatics & Bioengineering and M.Tech (5 Yr Intg.) Biotechnology and Medical Nanotechnology; UG applicants should not have completed 19 years as on 01.08.2025. Stream 1: 50% of seats on Class XII and JEE Main (50% weight each); Stream 2: 50% on Class XII; JEE is not mandatory.",
      imtech: "Admission 2025 FAQ: B.Tech / 5-Year Integrated M.Tech eligibility - +2 pass with Mathematics & Physics compulsory and Chemistry / Biotechnology / Computer Science / Biology, 60% aggregate in a single sitting; applicants without Mathematics eligible for M.Tech (5 Yr Intg.) Biotechnology and Medical Nanotechnology; age limit 19 years as on 01.08.2025; Stream 1 / Stream 2 ranking.",
      mtech: "Admission 2025 FAQ: M.Tech eligibility - a valid UG degree in related discipline from a recognized university; admissions on qualifying-degree scores; 50% tuition fee waiver and stipend for GATE-qualified candidates.",
      msc: "Admission 2025 FAQ: M.Sc. programmes - a valid UG degree in related discipline from a recognized university; admissions on qualifying UG degree scores.",
      imsc: "Admission 2025 FAQ: M.Sc. (5 Year Integrated) and other UG programmes - a pass in +2 examinations from a recognized board with relevant subjects; admissions on qualifying exam marks and CUET 2025 if results are available on time; UG age limit 19 years as on 01.08.2025.",
      ug: "Admission 2025 FAQ: B.Com. (CA / BFSI) / B.Sc / B.B.A / B.C.A / B.A. programmes - a pass in +2 examinations from a recognized board with relevant subjects; admissions on qualifying exam marks and CUET 2025 if results are available on time; UG age limit 19 years as on 01.08.2025.",
      mcom: "Admission 2025 FAQ: Master of Commerce (M.Com) - a valid B.Com. / B.A. (Corp. Sec) / B.B.A. degree from a recognized university.",
      mba: "Admission 2025 FAQ: MBA - First Class recognized bachelor's degree of minimum three years duration; preference to CAT / XAT / AIMAT / CMAT / AIMCAT scores; admissions on qualifying degree scores, entrance exam and interview.",
      mca: "Admission 2025 FAQ: MCA - any recognized bachelor's degree of minimum three years with Mathematics as a subject in +2 or the qualifying degree; admissions on qualifying degree scores and an entrance exam conducted by SASTRA.",
      boptom: "Admission 2025 FAQ: B.Optom. - a pass in +2 in a single sitting in Physics, Chemistry, Biology, Mathematics or Physics, Chemistry, Botany, Zoology from a recognised board, with a minimum aggregate of 60% in all subjects; UG age limit 19 years as on 01.08.2025.",
    }[p.route];
    pe("eligibility", `${p.title}: ${eligClaim}`, "faq", { reviewBy: REVIEW_ADM, internalNotes: FAQ_NOTE });
    if (isGlobal(p)) {
      pe("eligibility", "NRI Guidelines, Academic Year 2026: B.Tech NRI-Sponsored category requires 75% overall aggregate in the qualifying examination (12th / equivalent) and 60% aggregate in Mathematics, Physics and Chemistry; candidates without Mathematics may apply only for B.Tech Biotechnology, Bioengineering and Bioinformatics; only parents or blood relatives may sponsor; AIU equivalence certificate for curricula not covered by Indian State Boards, CBSE/ICSE, Cambridge/Singapore, IB or American High School Diploma.", "nri", { reviewBy: REVIEW_ADM });
    }
    if (p.chennaiUg) pe("eligibility", "Chennai campus programmes page: the Chennai campus offers 3-year UG programmes with a 4-year Honours option (exit at the end of the third year); B.A. Economics & Public Policy is 120 credits for 3 years and 160 credits with Honours.", "chennaiProg");
    if (p.route === "mba" && p.campus === "C") pe("eligibility", "Chennai campus admissions page: MBA admission is merit-based using CAT, AIMAT, XAT, ATMA scores, Class X and XII scores, UG/PG degree scores, an interview if necessary and latent skills such as sports, music and arts; two-year 108-credit programme.", "chennaiAdm");
    // admissions
    pe("admissions", `${p.title} is on SASTRA's 2026 ${listed}${p.path ? `; programme book at ${progUrl(p)} returned HTTP 200 on 2026-10-23` : ""}.`, "ugpg", { reviewBy: REVIEW_ADM });
    if (isGlobal(p)) {
      pe("admissions", "NRI Guidelines, Academic Year 2026: NRI-Sponsored B.Tech admissions commenced 27 March 2026; register with email and Indian mobile number selecting category 'NRI'; upload sponsor's passport, sponsorship letter to the Registrar, sponsor's address proof abroad, sponsor's employment proof, 12th marksheet and AIU certificate if applicable; application fee INR 650; SWIFT details shared for first-year tuition; first-come, first-served; no SASTRA entrance examination; Thanjavur campus only; not applicable to M.Tech (5-Year Integrated).", "nri", { reviewBy: REVIEW_ADM });
    } else {
      pe("admissions", "Admission 2025 FAQ: the entire process (application, admission, tuition fee payment, enrolment, withdrawal) is online; applications must be submitted separately for each campus and transfer between campuses is not possible; rolling admissions to PG and other programmes with provisional admission letters sent by e-mail. The NRI Guidelines (Academic Year 2026) restrict the NRI-Sponsored category to B.Tech and Integrated Law at the Thanjavur campus.", "faq", { reviewBy: REVIEW_ADM, internalNotes: FAQ_NOTE });
    }
    // intake
    const [calKey] = calFor(p);
    const { month } = campusIntake(p);
    let intakeClaim;
    if (p.route === "btech" || p.route === "imtech") intakeClaim = `${CAMPUS[p.campus].short} 2026-27 calendar: the B.Tech.${p.campus === "T" ? " / M.Tech. (Intg.)" : ""} (I Year) column starts with orientation on 03-08-2026 (Monday) and 04-08-2026; senior classes start 09-07-2026.`;
    else if (p.route === "boptom") intakeClaim = "Thanjavur 2026-27 calendar: B.Tech./M.Tech. (Intg.) (I Year) orientation on 03-08-2026. SASTRA circulars group first-year B.Optom. with first-year B.Tech. and M.Optom. (attendance circular, 5 December 2025) and run 'I Year Engineering & Optometry' examinations separately from other programmes.";
    else intakeClaim = `${CAMPUS[p.campus].short} 2026-27 calendar: the column covering this programme starts with semester day 1 on 09-07-2026 (Thursday).`;
    pe("intake", `${intakeClaim} Intake month recorded: ${month}.`, calKey, { reviewBy: REVIEW_ADM });
    if (p.campus === "T" && ["mtech", "msc", "imsc", "mba", "mca"].includes(p.route) || p.key.startsWith("bcom-")) {
      pe("intake", "Bus registration circular dated 30-Jun-2026 for I Year B.Com. (CA) / B.Com. (BFSI) / M.Sc. (Intg.), Integrated B.Ed. / M.Tech. / M.B.A. / M.C.A. / M.Sc. (Thanjavur Campus): bus transport for I-year students commences 9 July 2026.", "bus", { reviewBy: REVIEW_ADM });
    }
    if (p.route === "boptom") pe("intake", "Circular 'First Year B.Tech. / B.Optom / M.Optom Programmes Lack of Attendance Circular | 05 Dec 2025' groups first-year B.Optom. with first-year B.Tech.", "optCirc", { reviewBy: REVIEW_ADM });
    // fee
    if (p.feeKey) {
      const f = FEES[p.feeKey];
      pe("fee", `Fee Structure (2026 admissions), ${CAMPUS[p.campus].short} campus, row '${f.label}': tuition fee per semester Rs. ${inrDigits(f.sem)}${f.inc ? " (5% annual increase from II year)" : ""}${f.sports ? `; sports and unit test fee per annum Rs. ${inrDigits(f.sports)}` : ""}${f.dev ? `; development fee (one-time) Rs. ${inrDigits(f.dev)}` : ""}; special, registration and medical exam fees at admission (one time) Rs. ${inrDigits(f.special)}.${f.extra ? " Monthly stipend of Rs 12,400 for eligible GATE-qualified candidates." : ""}`, "fee", {
        reviewBy: REVIEW_ADM,
        internalNotes: "The fee page prints no academic year; it is the 'View Tuition Fee Structure' link on SASTRA's 'Applicant Registration 2026' portal, so it is recorded as the 2026-27 (2026 admission) schedule. Annual amount = 2 semesters.",
      });
      if (isGlobal(p)) pe("fee", "NRI Guidelines, Academic Year 2026: Tuition Fee (Per Annum) - B.Tech Programme: USD 5,000; Integrated Law Programme: USD 4,000. SWIFT details are shared after application.", "nri", { reviewBy: REVIEW_ADM });
    } else {
      pe("fee", "Fee Structure (2026 admissions), Thanjavur campus: rows cover B.Tech / M.Tech (Integrated), M.Tech, Law, M.B.A., M.C.A., B.Optom, M.Optom, B.Com. (CA) / (BFSI), B.Sc B.Ed / B.Com B.Ed, M.Sc. / M.Sc. (5 Year Integrated) and M.A. Sanskrit; there is no row for B.Sc. Electronics Manufacturing, so the fee is on request.", "fee", { reviewBy: REVIEW_ADM });
    }
    // medium
    pe("medium", "Certificate signed by the Controller of Examinations and the Registrar: the medium of instruction for all programmes (B.Tech., M.Tech., M.Tech. (5-Year Integrated), M.Sc., MBA, MCA, M.Sc (5 Year Integrated), Law (5 Year Integrated), B.Ed. (Integrated), B.Com, BA, BBA, BCA, B.Sc, M.Sc, M.Com, B.Optom, M.Optom, Ph.D) at SASTRA Deemed University is English.", "moi", { internalNotes: "Scanned PDF (created 16 Aug 2024) linked as 'Medium of Instruction' from the Academics menu; read visually on 2026-10-23." });
  }
  return out;
}

function universityEvidence() {
  return [
    uev("identity", "UGC consolidated list of universities (as on 25.01.2023), entry 817: Shanmugha Arts, Science, Technology and Research Academy (SASTRA), Thirumalaisamudram, Thanjavur-613 401, Tamil Nadu (Deemed University), date 26.04.2001.", "ugc"),
    uev("summary", "About SASTRA: humble beginning in 1984; conferred Deemed-to-be-University status in 2001 by the UGC under Section 3 of the UGC Act 1956; offers undergraduate, postgraduate and doctoral programmes in Engineering, Management, Law, Sciences, Humanities and Education; MHRD-notified off-campus Srinivasa Ramanujan Centre (SRC) at Kumbakonam.", "about"),
    uev("summary", "UG / PG Programmes 2026 lists programmes offered at the Thanjavur campus, the Kumbakonam campus and the Chennai campus (AVM Road, Vadapalani, behind AVM Theatre, close to Vadapalani bus stand and Metro).", "ugpg", { reviewBy: REVIEW_ADM }),
    uev("type", "MHRD/UGC compliance disclosure: SASTRA Deemed University is not under the Grant-in-aid scheme of the Central / State Government.", "compliance"),
    uev("recognitionBadges", "DSIR Directory of Recognised SIROs 2026, entry 351: 11/428/2003-TU-V, Shanmugha Arts, Science, Technology & Research Academy (SASTRA), Tirumalaisamudram, Thanjavur-613402, Tamil Nadu, recognition valid up to 31-03-2027.", "dsir", { reviewBy: "2027-03-31" }),
    uev("medium", "Medium of Instruction certificate: English for all programmes (B.Tech., M.Tech., integrated M.Tech., M.Sc., MBA, MCA, integrated M.Sc., integrated Law, integrated B.Ed., B.Com, BA, BBA, BCA, B.Sc, M.Sc, M.Com, B.Optom, M.Optom, Ph.D).", "moi"),
    uev("campusLifestyle", "Central Library Saraswathi Sadan: about 4,340 sq. m; 1,56,400 print books and over 1,85,757 e-books; full-text access to around 22,950 journals; Web of Science; e-ShodhSindhu associate member; Knimbus off-campus access.", "library"),
    uev("campusLifestyle", "NIRF 2026 submitted data (IR-O-U-0476), total actual student strength (all programmes, all years): UG 3-year 539, UG 4-year 9,095, UG 5-year 725, PG 2-year 844, PG-Integrated 556 (total 11,759); students from outside the country 1 + 10 + 0 + 0 + 2 = 13.", "nirf", { internalNotes: "Read visually from the flipbook page image files/mobile/1.jpg on 2026-10-23; nirfindia.org returned 403 and nirfpdfcdn 403/404 through the proxy." }),
    uev("practicalExposure", "NIRF 2026 submitted data: UG 4-year programmes - 2024-25 graduates in minimum time 1,726, placed 1,499, median salary INR 8,00,000, higher studies 162. PG 2-year - 2024-25 graduates 417, placed 304, median INR 4,00,000, higher studies 44. PG-Integrated 5-year - 2024-25 graduates 75, placed 47, median INR 5,50,000.", "nirf"),
    uev("practicalExposure", "UG / PG Programmes 2026: B.Optom and M.Optom in collaboration with Dr. Agarwal's Institute of Optometry; Chennai M.Sc. Data Science (AI Specialization with Zoho Corp); Chennai B.A. Economics & Public Policy - 2+1 Year with Industry Partnership (optional).", "ugpg", { reviewBy: REVIEW_ADM }),
    uev("practicalExposure", "Admission 2025 FAQ: students in non-CS B.Tech programmes can graduate with a minor specialisation such as AI/ML, Cybersecurity & IoT or Robotics & Automation, and CSE/IT students with minors such as Innovation & Entrepreneurship, at no separate fee.", "faq", { internalNotes: FAQ_NOTE }),
    uev("hostelOverview", "Hostel page: 9 boys' hostels and 6 girls' hostels accommodating over 4,000 boys and 2,400 girls; room types single to 6-in-1 with or without attached bath; 1 Gbps Wi-Fi for all hostel inmates; each resident gets a bed, wardrobe, desk and chair.", "hostel"),
    uev("hostelOverview", "Hostel lodging fee table: AC - single Rs. 80,000, 2-in-1 Rs. 60,000, 3-in-1 Rs. 55,000, single bath-attached Rs. 90,000, 2-in-1 bath-attached Rs. 65,000, 4-in-1 bath-attached Rs. 55,000; non-AC - single Rs. 25,000, 2-in-1 Rs. 20,000, 3-in-1 Rs. 16,000, single bath-attached Rs. 30,000, 2-in-1 bath-attached Rs. 26,000, 3-in-1 and 4-in-1 bath-attached Rs. 22,000.", "hostelFee", { reviewBy: REVIEW_ADM, internalNotes: "The table header reads 'HOSTEL LODGING FEE' with no period; an older hidden table on the same page labelled the non-AC figures 'Annual Hostel Lodging Fee'." }),
    uev("hostelOverview", "Admission 2025 FAQ: separate hostels for boys and girls at Thanjavur; first-year students get shared accommodation; food charged at actuals on a dividing system, about Rs 4,000 a month for roughly 10 months a year; single to four-in-one rooms from the second year; private accommodation at the Kumbakonam and Chennai campuses.", "faq", { internalNotes: FAQ_NOTE }),
    uev("dietarySupport", "Hostel page: a completely balanced vegetarian diet is served in all hostels with steam-cooking facilities, with North Indian cuisine in addition to South Indian; food served is purely vegetarian.", "hostel"),
    uev("safetyOverview", "Hostel page: the Public Safety Office in the Student Center is staffed 24 hours a day, 365 days a year; residences have one public entrance and other exits are locked and alarmed; students carry photo ID cards, also needed for meals.", "hostel"),
    uev("studentSupport", "Hospital page: Vaidyanatha Arogyasala, the in-house hospital with 10 beds, two full-time doctors and one resident doctor, prepared for emergencies round the clock; on-campus medical consultation is free to students.", "hospital"),
    uev("studentSupport", "Applicant Registration 2026 portal: general admissions 04362-350010 to 350015 (admissions@sastra.ac.in); NRI admissions 04362-350016 (nriadmissions@sastra.ac.in); help desk open all days except Sundays and public holidays, 08:45 a.m. to 05:15 p.m.", "portal", { reviewBy: REVIEW_ADM }),
    uev("cityProfile", "Admission 2025 FAQ: university transport is available on a chargeable basis from Thanjavur, Trichy, Kumbakonam and Pattukottai. Contacts: SASTRA Thanjavur 613 401; Kumbakonam 612 001 (+91 435 2426823); Chennai 600 083 (+91 44 23650027).", "faq", { internalNotes: FAQ_NOTE }),
    uev("cityProfile", "Chennai campus: No. 21, A V Meiyappan Salai, Arcot Road, Vadapalani, Chennai 600 026 (behind AVM Theatre / next to AVM Studio); programmes offered from the academic year 2023-24.", "chennaiProg"),
    uev("cityProfile", "UG / PG Programmes 2026, Chennai: the campus is at AVM Road, Vadapalani, close to the Vadapalani bus stand and Metro; paid accommodation is available within a commutable radius for out-station students, with documentation support from the university.", "ugpg", { reviewBy: REVIEW_ADM }),
    uev("internationalRoutes", "NRI Guidelines, Academic Year 2026: NRI-Sponsored admissions for B.Tech (USD 5,000 a year) and Integrated Law (USD 4,000 a year) at the Thanjavur campus only; law NRI admission at management discretion.", "nri", { reviewBy: REVIEW_ADM }),
  ];
}

// ---------------------------------------------------------------------------
const university = {
  countrySlug: "india",
  slug: SLUG,
  name: NAME,
  city: "Thanjavur",
  type: "Private",
  establishedYear: 2001,
  officialWebsite: SRC.site,
  mediaAttribution: {},
  summary: `${FULL} is a private deemed-to-be university under Section 3 of the UGC Act 1956, conferred deemed status in 2001, at Tirumalaisamudram, Thanjavur, Tamil Nadu, with campuses at Kumbakonam and Chennai. It teaches engineering, management, law, sciences, humanities and education in English and awards its own degrees.`,
  campusLifestyle: `${FULL} reported 11,759 students across all programmes and years in its NIRF 2026 data, 13 of them from outside India. The Thanjavur central library, Saraswathi Sadan, covers about 4,340 sq m and holds 1,56,400 print books and over 1,85,757 e-books, with full-text access to about 22,950 journals. The campus has an in-house 10-bed hospital, Vaidyanatha Arogyasala.`,
  cityProfile: `${FULL} has its main campus at Tirumalaisamudram, Thanjavur (PIN 613 401), in the Cauvery delta of Tamil Nadu. Its off-campus Srinivasa Ramanujan Centre is in Kumbakonam (PIN 612 001), and its Chennai campus is at No. 21, A V Meiyappan Salai, Arcot Road, Vadapalani (behind AVM Theatre), close to the Vadapalani bus stand and Metro. SASTRA runs chargeable university buses from Thanjavur, Trichy, Kumbakonam and Pattukottai. SASTRA's admission guidance says students at Kumbakonam and Chennai use private accommodation; the Chennai campus provides documentation support for paid housing nearby.`,
  practicalExposure: `${FULL}'s NIRF 2026 data reports that 1,499 of the 1,726 students who completed its four-year undergraduate programmes in 2024-25 were placed, at a median salary of INR 8,00,000 a year, and 162 went on to higher studies. On two-year postgraduate programmes, 304 of 417 graduates in 2024-25 were placed at a median of INR 4,00,000 a year. B.Tech students outside computing can add a minor such as AI/ML, Cybersecurity & IoT or Robotics & Automation at no extra fee. The B.Optom. and M.Optom. run in collaboration with Dr. Agarwal's Institute of Optometry, the Chennai M.Sc. Data Science carries an AI specialisation with Zoho Corp, and the B.Sc. Electronics Manufacturing is offered with Tata Electronics.`,
  hostelOverview: `${FULL} has 9 boys' and 6 girls' hostels at Thanjavur for over 4,000 men and 2,400 women. The published lodging fee runs from INR 16,000 for a non-AC 3-in-1 room to INR 90,000 for an AC single room with attached bath; first-year students get shared rooms, and single to 4-in-1 rooms open from the second year. Food is charged at actual cost, about INR 4,000 a month in SASTRA's 2025 guidance. Hostel rooms have 1 Gbps Wi-Fi.`,
  dietarySupport: `${FULL} serves only vegetarian food in its Thanjavur hostels, cooked with steam-cooking facilities. Menus include North Indian dishes as well as South Indian meals. Meals are charged at actual cost, about INR 4,000 a month in SASTRA's 2025 admission guidance, and a photo ID card is needed to obtain meals.`,
  safetyOverview: `${FULL}'s Public Safety Office in the Thanjavur Student Center is staffed 24 hours a day, 365 days a year. Hostel residences have a single public entrance, and other exits are locked from inside and alarmed. Every student carries a photo ID card at all times.`,
  studentSupport: `${FULL}'s 10-bed hospital, Vaidyanatha Arogyasala, has two full-time doctors and a resident doctor, and campus consultations are free for students. NRI applicants have a dedicated admissions line (+91 4362 350016, nriadmissions@sastra.ac.in), open 08:45 a.m. to 05:15 p.m. except Sundays and public holidays.`,
  whyChoose: [
    "NRI-sponsored applicants can enter 26 Thanjavur B.Tech programmes at USD 5,000 a year in tuition, with no SASTRA entrance test and seats allotted first come, first served (2026 rules).",
    "JEE Main is optional for SASTRA's B.Tech: half the merit seats are ranked on Class XII marks alone and half on Class XII plus JEE Main (2025 rules).",
    "SASTRA's NIRF 2026 data reports 1,499 of 1,726 four-year undergraduate graduates of 2024-25 placed, at a median salary of INR 8,00,000 a year.",
  ],
  thingsToConsider: [
    "SASTRA's only published international route is the NRI-Sponsored category for Thanjavur B.Tech and integrated law; it publishes no route or fee for foreign nationals or for its other programmes.",
    "Tuition for B.Tech, integrated M.Tech and B.Optom. rises 5% a year from the second year, on top of one-time development and admission fees of up to INR 16,000.",
    "Applications are made separately for each campus and SASTRA does not allow transfers between campuses; students at Kumbakonam and Chennai use private accommodation.",
  ],
  bestFitFor: [
    "Children or relatives of Indians working abroad who want a Thanjavur B.Tech through the NRI-Sponsored category, sponsored by a parent or blood relative.",
    "Indian Class XII students without a strong JEE Main score, since half of SASTRA's B.Tech merit seats are ranked on Class XII marks alone.",
    "GATE-qualified engineering graduates, who receive a 50% M.Tech tuition waiver and a stipend listed at INR 12,400 a month.",
  ],
  industryPartners: ["Tata Electronics", "Zoho Corporation", "Dr. Agarwal's Institute of Optometry"],
  recognitionBadges: [
    "UGC (India) - Deemed-to-be University under Section 3 of the UGC Act 1956, notified 26 April 2001",
    "DSIR, Government of India - Recognised Scientific and Industrial Research Organisation (SIRO) No. 11/428/2003-TU-V, valid to 31 March 2027",
  ],
  recognitionLinks: [
    { label: "UGC - Consolidated list of universities (deemed universities)", url: SRC.ugc },
    { label: "DSIR - Directory of Recognised SIROs 2026", url: SRC.dsir },
  ],
  faq: [
    { question: "Is SASTRA University UGC approved?", answer: `Yes. ${FULL} is a deemed-to-be university under Section 3 of the UGC Act 1956, and the UGC's list of universities records it with the date 26 April 2001. It awards its own degrees at its Thanjavur, Kumbakonam and Chennai campuses.` },
    { question: "Is SASTRA private or government?", answer: `${FULL} is a private deemed-to-be university. Its public disclosure states that it is not under the grant-in-aid scheme of the central or state government. It began in 1984 as an engineering college at Thanjavur.` },
    { question: "What is the B.Tech fee at SASTRA?", answer: `For 2026 admissions, ${FULL} charges B.Tech tuition of INR 85,000 per semester (INR 1,70,000 a year), rising 5% a year from the second year, plus INR 1,000 a year for sports and tests and one-time fees of INR 16,000. NRI-Sponsored students pay USD 5,000 a year in tuition. Hostel and food are extra.` },
    { question: "Does SASTRA admit NRI and international students?", answer: `${FULL} admits NRI-sponsored students to its Thanjavur B.Tech and five-year law programmes. For 2026 the sponsor had to be a parent or blood relative abroad, B.Tech applicants needed 75% in Class XII and 60% in Mathematics, Physics and Chemistry, and there was no entrance test. SASTRA publishes no separate route for foreign nationals.` },
    { question: "Which entrance exam does SASTRA use?", answer: `${FULL} does not require JEE Main for B.Tech: under its 2025 rules, half the merit seats are ranked on Class XII plus JEE Main and half on Class XII alone. It prefers GATE for M.Tech, uses CAT, XAT, CMAT and similar scores for the MBA, runs its own MCA entrance exam, and uses CUET where available for other undergraduate programmes.` },
    { question: "What is the medium of instruction at SASTRA?", answer: `${FULL} teaches in English. Its Registrar and Controller of Examinations certify English as the medium of instruction for all its degree programmes, from B.Tech and B.Com. to M.Sc., MBA, M.Optom. and Ph.D.` },
    { question: "What campuses does SASTRA have?", answer: `${FULL} has its main campus at Tirumalaisamudram, Thanjavur, an off-campus Srinivasa Ramanujan Centre at Kumbakonam that teaches B.Tech (CSE and ECE), commerce, science and management, and a Chennai campus at Vadapalani that teaches commerce, economics, MBA and data science. Each campus needs a separate application.` },
    { question: "How much is the hostel fee at SASTRA?", answer: `${FULL}'s Thanjavur hostel lodging fee ranges from INR 16,000 for a non-AC 3-in-1 room to INR 90,000 for an AC single room with attached bath. Food is extra, about INR 4,000 a month in SASTRA's 2025 guidance, and all hostel meals are vegetarian. Kumbakonam and Chennai students use private accommodation.` },
    { question: "Is SASTRA a recognised research organisation?", answer: `Yes. ${FULL} is listed by India's Department of Scientific and Industrial Research as a recognised Scientific and Industrial Research Organisation (SIRO), registration 11/428/2003-TU-V, with recognition valid to 31 March 2027.` },
  ],
  researchSources: [
    { label: L.ugpg, url: SRC.ugpg, kind: "official-program", checkedAt: CHECKED },
    { label: L.fee, url: SRC.fee, kind: "official-fee", checkedAt: CHECKED },
    { label: L.nri, url: SRC.nri, kind: "official-fee", checkedAt: CHECKED },
    { label: L.faq, url: SRC.faq, kind: "official-university", checkedAt: CHECKED, notes: "Latest published admission FAQ; no 2026 FAQ is published." },
    { label: L.hostelFee, url: SRC.hostelFee, kind: "official-fee", checkedAt: CHECKED },
    { label: L.calT, url: SRC.calT, kind: "official-university", checkedAt: CHECKED },
    { label: L.calK, url: SRC.calK, kind: "official-university", checkedAt: CHECKED },
    { label: L.calC, url: SRC.calC, kind: "official-university", checkedAt: CHECKED },
    { label: L.moi, url: SRC.moi, kind: "official-university", checkedAt: CHECKED },
    { label: L.nirf, url: SRC.nirf, kind: "official-university", checkedAt: CHECKED },
    { label: L.ugc, url: SRC.ugc, kind: "government", checkedAt: CHECKED },
    { label: L.dsir, url: SRC.dsir, kind: "government", checkedAt: CHECKED },
  ],
  admissionsContent: {
    contentState: "research_ready",
    scope: "This record covers SASTRA's Thanjavur (Tirumalaisamudram) campus including the SASTRA School of Law, the Srinivasa Ramanujan Centre at Kumbakonam, and the Chennai campus at Vadapalani. Online and distance programmes, Ph.D. admissions and SASTRA-linked schools or training centres are outside this record. Law, integrated B.Ed., M.Optom., M.Tech. Defence Technology, integrated M.A. Sanskrit and three Chennai UG programmes are held from this record.",
    sectionStates: {
      decisionSummary: "published",
      eligibility: "published",
      fees: "published",
      admissions: "published",
      academics: "research_ready",
      recognition: "published",
      studentLiving: "published",
      scholarships: "absent",
      funding: "absent",
      placements: "published",
    },
    internationalRoutes: [
      "NRI-Sponsored category (SASTRA admissions portal, category 'NRI'): Thanjavur B.Tech at USD 5,000 a year; sponsor must be a parent or blood relative abroad",
      "SASTRA merit admission (webstream.sastra.edu): Indian applicants, Class XII marks with optional JEE Main for B.Tech",
    ],
    ctas: [
      { trigger: "eligibility", label: "Check my SASTRA eligibility", capture: ["NRI-sponsored or Indian merit route", "qualifying examination and board", "Class XII marks in Mathematics, Physics and Chemistry", "intended programme and campus"] },
      { trigger: "fees", label: "Work out my SASTRA tuition and hostel cost", capture: ["fee category (merit or NRI-Sponsored)", "intended programme and campus", "hostel room preference"] },
      { trigger: "application", label: "Start my SASTRA application review", capture: ["campus choice", "JEE Main, CUET, GATE or CAT score status", "sponsor document readiness for the NRI category"] },
    ],
  },
  programmes,
};

// ---------------------------------------------------------------------------
// Course records: copy the newest bundle's record byte-identical; write the one missing record.
function courseRecords() {
  const need = [...new Set(P.map((p) => p.canonical))];
  const latest = new Map();
  const dirs = readdirSync("content-migrations").filter((d) => /^\d{4}-/.test(d) && d !== MIGRATION).sort();
  for (const d of dirs) {
    let payload;
    try {
      payload = JSON.parse(readFileSync(`content-migrations/${d}/payload.json`, "utf8"));
    } catch {
      continue;
    }
    for (const c of payload.courses ?? []) if (need.includes(c.slug)) latest.set(c.slug, c);
  }
  latest.set("be-btech-industrial-engineering-management", latest.get("be-btech-industrial-engineering-management") ?? {
    slug: "be-btech-industrial-engineering-management",
    name: "B.E./B.Tech in Industrial Engineering and Management",
    shortName: "B.E./B.Tech Industrial Engineering",
    stream: "engineering",
    level: "bachelors",
    discipline: "industrial-engineering-management",
    aliases: ["Bachelor of Industrial Engineering and Management", "BSc Industrial Engineering and Management", "Industrial Engineering and Management"],
    displayOrder: 181,
    durationYears: 4,
    summary: "An approved Engineering catalogue category for undergraduate industrial engineering and management degrees covering operations research, production planning, quality and reliability engineering, supply chains, ergonomics and the economics and management of engineering systems.",
    metaTitle: "B.E./B.Tech Industrial Engineering and Management",
    metaDescription: "Compare B.E./B.Tech Industrial Engineering and Management programmes by official title, curriculum, fees and admissions.",
  });
  const missing = need.filter((s) => !latest.has(s));
  if (missing.length) throw new Error(`missing course records: ${missing.join(", ")}`);
  return need.map((s) => latest.get(s));
}

// ---------------------------------------------------------------------------
// Inventory CSV
function writeInventory() {
  const cols = ["university_slug", "programme_official_title", "level", "discipline", "duration", "campus", "delivery_mode", "intl_status", "intl_evidence_url", "official_source_url", "other_sources", "already_on_site", "existing_offering_slug", "canonical_course_match", "notes"];
  const levelOf = (p) => (["btech", "ug", "boptom"].includes(p.route) ? "bachelors" : ["imtech", "imsc"].includes(p.route) ? "integrated-masters" : "masters");
  const rows = P.map((p) => ({
    university_slug: SLUG,
    programme_official_title: p.title,
    level: levelOf(p),
    discipline: p.canonical.replace(/^(be-btech|me-mtech|msc|bsc|ma|ba|bachelor|master)-/, ""),
    duration: `${p.years} years`,
    campus: CAMPUS[p.campus].place,
    delivery_mode: "on-campus full-time",
    intl_status: isGlobal(p) ? "open_to_international" : "not_open",
    intl_evidence_url: SRC.nri,
    official_source_url: progUrl(p),
    other_sources: `${SRC.ugpg} ; ${SRC.fee}`,
    already_on_site: "no",
    existing_offering_slug: "",
    canonical_course_match: p.canonical,
    notes: `Packaged as ${progSlug(p)} (${isGlobal(p) ? "global: NRI-Sponsored USD 5,000 a year" : "restricted: no NRI or foreign route published"}).${p.feeKey ? "" : " Fee on request (no row on the 2026 fee page)."}${p.path ? "" : " No programme page; official URL is the programme list."}`,
  }));
  for (const [title, level, campus, duration, canonical, path, notes] of HELD) {
    rows.push({ university_slug: SLUG, programme_official_title: title, level, discipline: canonical.replace(/^GAP:/, ""), duration, campus, delivery_mode: "on-campus full-time", intl_status: title.includes("LL.B.") ? "open_to_international" : "not_open", intl_evidence_url: SRC.nri, official_source_url: path ? `https://www.sastra.edu/prog/${path}/` : campus.startsWith("Chennai") ? SRC.chennaiProg : SRC.ugpg, other_sources: `${SRC.ugpg} ; ${SRC.fee}`, already_on_site: "no", existing_offering_slug: "", canonical_course_match: canonical, notes });
  }
  rows.push({ university_slug: SLUG, programme_official_title: "Ph.D. (full-time and part-time, all schools)", level: "doctorate", discipline: "research", duration: "3-6 years", campus: "Thanjavur, Kumbakonam, Chennai", delivery_mode: "on-campus", intl_status: "unknown", intl_evidence_url: "", official_source_url: "https://www.sastra.edu/admissions/ph-d-programmes.html", other_sources: "", already_on_site: "no", existing_offering_slug: "", canonical_course_match: "", notes: "Inventory only: Ph.D. areas are not packaged." });
  rows.push({ university_slug: SLUG, programme_official_title: "Online and distance programmes (Directorate of Online & Distance Education)", level: "various", discipline: "distance-education", duration: "varies", campus: "Online", delivery_mode: "online / distance", intl_status: "unknown", intl_evidence_url: "", official_source_url: "https://online.sastra.edu/", other_sources: "", already_on_site: "no", existing_offering_slug: "", canonical_course_match: "", notes: "Out of scope: not on-campus programmes; not packaged." });
  const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c] ?? "")).join(","))].join("\n") + "\n";
  writeFileSync(`research/india-programme-inventory/${SLUG}.csv`, csv);
  return rows.length;
}

const invRows = writeInventory();
const payload = {
  countries: [],
  courses: courseRecords(),
  universities: [university],
  evidence: [...universityEvidence(), ...programmeEvidence()],
};
writeFileSync(`content-migrations/${MIGRATION}/payload.json`, JSON.stringify(payload, null, 2) + "\n");
console.log(`inventory rows: ${invRows}; payload: ${programmes.length} programmes (${programmes.filter((p) => p.audienceEligibility.availability === "global").length} global), ${payload.courses.length} courses, ${payload.evidence.length} evidence records`);
