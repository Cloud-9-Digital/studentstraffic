// Build script for content-migrations/0149-india-anna-university/payload.json.
// Run: node research-drafts/india/anna-university-build.mjs
// Data-driven: campus table, branch table, fee bands and one admissions template per route
// (TNEA, CEETA-PG/CEAP, TANCET MBA/MCA, Anna University M.Sc. entrance/merit, foreign-national route).
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname;
const OUT = `${ROOT}content-migrations/0149-india-anna-university/payload.json`;
const UNI = "anna-university";
const CHECKED = "2026-10-23";
const REVIEW = "2027-04-23";

// ---------- Sources ----------
const S = {
  tneaBro: ["DoTE Tamil Nadu - TNEA 2026 Information Brochure", "https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf"],
  tneaCol: ["DoTE Tamil Nadu - TNEA 2026 Information about colleges", "https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf"],
  tneaSch: ["DoTE Tamil Nadu - TNEA 2026 Tentative Schedule", "https://static.tneaonline.org/docs/TNEA_Tentative_Schedule_2026.pdf"],
  tneaVac: ["DoTE Tamil Nadu - TNEA 2026 vacancy position after Round 1", "https://static.tneaonline.org/docs/TNEA-2026-GENERAL-ACADEMIC-VACANCY-POSITION-AFTER-ROUND-1.pdf"],
  fnUg: ["Anna University Centre for Admissions - B.E./B.Tech./B.Plan. FN/(LDC/SIDS) instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/FN_INSTRUCTION_2026.pdf"],
  nriUg: ["Anna University Centre for Admissions - B.E./B.Tech./B.Plan. NRI instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/NRI_INSTRUCTION_2026.pdf"],
  advUg: ["Anna University Centre for Admissions - Notification for B.E./B.Tech./B.Plan. under NRI/FN/(LDC/SIDS)/CIWGC 2026-27", "https://cfa.annauniv.edu/cfa/pdf/ADVT_2026_NFC.pdf"],
  ugList: ["Anna University Centre for Admissions - Undergraduate Degree Programmes (2025-26)", "https://cfa.annauniv.edu/cfa/pdf/Undergraduate_DegreeProgrammes2025-26.pdf"],
  fnPg: ["Anna University Centre for Admissions - M.E./M.Tech./M.Plan./M.Arch. FN/(LDC/SIDS) instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/ME_INSTRUCTION_FN_2026.pdf"],
  fnMba: ["Anna University Centre for Admissions - M.B.A. FN instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/MBA_FN_INSTRUCTION_2026.pdf"],
  fnMca: ["Anna University Centre for Admissions - M.C.A. FN instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/MCA_FN_INSTRUCT_2026.pdf"],
  fnMsc2: ["Anna University Centre for Admissions - M.Sc. (2 year) FN instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/FN_MSC2_INSTRUCTIONS_2026.pdf"],
  fnMsc5: ["Anna University Centre for Admissions - M.Sc. (5 year integrated) FN instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/FNMSC5_INSTRUCT_2026.pdf"],
  msc2: ["Anna University Centre for Admissions - M.Sc. (2 year) admission instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/MSC2YR_INSTRUCT_2026.pdf"],
  msc5: ["Anna University Centre for Admissions - M.Sc. (5 year integrated) admission instructions 2026-27", "https://cfa.annauniv.edu/cfa/pdf/MSC5YR_INSTRUCT_2026.pdf"],
  msc5fee: ["CEG Campus - M.Sc. (5 years) Integrated admission circular and fee structure 2026-27", "https://www.annauniv.edu/pdf/Circular%20MSc%205%20Y%20integrated.pdf"],
  ceap: ["Anna University - CEAP 2026 booklet (M.E./M.Tech./M.Arch./M.Plan. single-window counselling)", "https://cfa.annauniv.edu/cfa/pdf/CEAP_BOOKLET_INFORMATION_2026.pdf"],
  tancet: ["Anna University - TANCET / CEETA-PG 2026 Information Brochure", "https://tancet.annauniv.edu/tancet/Information%20Brochure%202026.pdf"],
  mbamca: ["DoTE Tamil Nadu - MBA/MCA Admissions 2026-27 college booklet", "https://static.tn-mbamca.com/docs/TNMBAMCA-ENGINEERING-COLLEGES-BOOKLET-2026.pdf"],
  feeCeg: ["CEG Campus - B.E./B.Tech. fee structure 2025-26", "https://www.annauniv.edu/pdf/CEG_UG_Fee_Structure.pdf"],
  feeMit: ["MIT Campus - B.E./B.Tech. fee structure 2025-26", "https://www.annauniv.edu/pdf/MIT_UG_Fee_Structure.pdf"],
  feeAct: ["ACT Campus - B.Tech. fee structure 2025-26", "https://www.annauniv.edu/pdf/ACT_UG_Fee_Structure.pdf"],
  feeSap: ["SAP Campus - UG and PG fee structure 2025-26", "https://www.annauniv.edu/pdf/SAP_UG_PG_Fee_Structure.pdf"],
  mitPg: ["MIT Campus - M.E./M.Tech. admission schedule and fee structure 2026-27", "https://www.annauniv.edu/pdf/MIT_CEETA_PG_Admission_Schedule_2026_27.pdf"],
  calUg: ["Anna University - Academic calendar, UG & PG (CEG, ACT, SAP & MIT), I semester Aug-Dec 2026", "https://cac.annauniv.edu/Annoucement/Calender/August%20-%20Dec%202026/Academic%20Calendar%20-%20UG%20%26%20PG.pdf"],
  calPg: ["Anna University - Academic calendar, PG (CEG, ACT, SAP & MIT), I semester Jul-Nov 2026", "https://cac.annauniv.edu/Annoucement/Calender/July%20-%20Nov%202026/Academic%20calendar%20-%20PG.pdf"],
  calMba: ["Anna University - Academic calendar, MBA & MCA (University Department), I semester Sep-Dec 2026", "https://cac.annauniv.edu/Annoucement/Calender/August%20-%20Dec%202026/Academic%20Calendar%20-%20MBA%20%26%20MCA.pdf"],
  constituent: ["Anna University - Constituent colleges", "https://www.annauniv.edu/constituent_colleges.php"],
  ugc: ["UGC - Consolidated list of all universities", "https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf"],
  home: ["Anna University - Official website", "https://www.annauniv.edu/"],
  cfa: ["Anna University - Centre for Admissions", "https://cfa.annauniv.edu/cfa/"],
};

// ---------- Campuses ----------
const C = {
  CEG: { name: "College of Engineering Guindy (CEG) campus, Chennai", short: "CEG, Guindy", tnea: "1", fee: "feeCeg" },
  ACT: { name: "Alagappa College of Technology (ACT) campus, Chennai", short: "ACT, Guindy", tnea: "2", fee: "feeAct" },
  SAP: { name: "School of Architecture and Planning (SAP) campus, Chennai", short: "SAP, Guindy", tnea: "3", fee: "feeSap" },
  MIT: { name: "Madras Institute of Technology (MIT) campus, Chromepet, Chennai", short: "MIT, Chromepet", tnea: "4", fee: "feeMit" },
  BIT: { name: "University College of Engineering, BIT Campus, Tiruchirappalli", short: "UCE BIT Campus, Tiruchirappalli", tnea: "3011" },
  VPM: { name: "University College of Engineering, Villupuram", short: "UCE Villupuram", tnea: "1013" },
  TVM: { name: "University College of Engineering, Tindivanam", short: "UCE Tindivanam", tnea: "1014" },
  ARN: { name: "University College of Engineering, Arni", short: "UCE Arni", tnea: "1015" },
  KPM: { name: "University College of Engineering, Kancheepuram", short: "UCE Kancheepuram", tnea: "1026" },
  CBE: { name: "Anna University Regional Campus, Coimbatore", short: "Regional Campus Coimbatore", tnea: "2025" },
  ARY: { name: "University College of Engineering, Ariyalur", short: "UCE Ariyalur", tnea: "3016" },
  TKV: { name: "University College of Engineering, Thirukkuvalai", short: "UCE Thirukkuvalai", tnea: "3018" },
  PRT: { name: "University College of Engineering, Panruti", short: "UCE Panruti", tnea: "3019" },
  PKT: { name: "University College of Engineering, Pattukkottai", short: "UCE Pattukkottai", tnea: "3021" },
  TVL: { name: "Anna University Regional Campus, Tirunelveli", short: "Regional Campus Tirunelveli", tnea: "4020" },
  NGL: { name: "University College of Engineering, Nagercoil", short: "UCE Nagercoil", tnea: "4023" },
  TUT: { name: "University V.O.C. College of Engineering, Thoothukudi", short: "University V.O.C. College of Engineering, Thoothukudi", tnea: "4024" },
  MDU: { name: "Anna University Regional Campus, Madurai", short: "Regional Campus Madurai", tnea: "5010" },
  RMD: { name: "University College of Engineering, Ramanathapuram", short: "UCE Ramanathapuram", tnea: "5017" },
  DGL: { name: "University College of Engineering, Dindigul", short: "UCE Dindigul", tnea: "5022" },
};
const CHENNAI = new Set(["CEG", "ACT", "SAP", "MIT"]);

// ---------- UG branch dictionary: code -> [official title, canonical slug, slug stub] ----------
const B = {
  BY: ["B.E. Biomedical Engineering", "be-btech-biomedical-engineering", "be-biomedical"],
  CE: ["B.E. Civil Engineering", "be-btech-civil-engineering", "be-civil"],
  CS: ["B.E. Computer Science and Engineering", "be-btech-computer-science-engineering", "be-cse"],
  EC: ["B.E. Electronics and Communication Engineering", "be-btech-electronics-communication-engineering", "be-ece"],
  EE: ["B.E. Electrical and Electronics Engineering", "be-btech-electrical-electronics-engineering", "be-eee"],
  EL: ["B.Tech. Electronics Engineering (VLSI Design and Technology)", "be-btech-electronics-communication-engineering", "btech-vlsi"],
  EV: ["B.Tech. Electronics Engineering (VLSI Design and Technology)", "be-btech-electronics-communication-engineering", "btech-vlsi"],
  GI: ["B.E. Geo-Informatics", "be-btech-geoinformatics-engineering", "be-geoinformatics"],
  IE: ["B.E. Industrial Engineering", "be-btech-industrial-production-engineering", "be-industrial"],
  IM: ["B.Tech. Information Technology", "be-btech-information-technology", "btech-it"],
  IT: ["B.Tech. Information Technology", "be-btech-information-technology", "btech-it"],
  MA: ["B.E. Materials Science and Engineering", "be-btech-materials-science-engineering", "be-materials"],
  ME: ["B.E. Mechanical Engineering", "be-btech-mechanical-engineering", "be-mechanical"],
  MI: ["B.E. Mining Engineering", "be-btech-mining-engineering", "be-mining"],
  MN: ["B.E. Manufacturing Engineering", "be-btech-industrial-production-engineering", "be-manufacturing"],
  PT: ["B.E. Printing and Packaging Technology", "be-btech-printing-packaging-technology", "be-printing-packaging"],
  AP: ["B.Tech. Apparel Technology", "be-btech-apparel-technology", "btech-apparel"],
  CH: ["B.Tech. Chemical Engineering", "be-btech-chemical-engineering", "btech-chemical"],
  CR: ["B.Tech. Ceramic Technology", "be-btech-ceramic-technology", "btech-ceramic"],
  FS: ["B.Tech. Food Technology", "bachelor-food-science-technology", "btech-food"],
  IB: ["B.Tech. Industrial Biotechnology", "be-btech-biotechnology", "btech-industrial-biotechnology"],
  LE: ["B.Tech. Leather Technology", "be-btech-leather-technology", "btech-leather"],
  PM: ["B.Tech. Pharmaceutical Technology", "be-btech-pharmaceutical-technology", "btech-pharmaceutical"],
  PH: ["B.Tech. Pharmaceutical Technology", "be-btech-pharmaceutical-technology", "btech-pharmaceutical"],
  PP: ["B.Tech. Petroleum Engineering and Technology", "be-btech-petroleum-engineering", "btech-petroleum"],
  TX: ["B.Tech. Textile Technology", "be-btech-textile-technology", "btech-textile"],
  BP: ["B.Plan. (Bachelor of Planning)", "bachelor-urban-regional-planning", "bplan"],
  AT: ["B.Tech. Artificial Intelligence and Data Science", "be-btech-data-science", "btech-ai-data-science"],
  AD: ["B.Tech. Artificial Intelligence and Data Science", "be-btech-data-science", "btech-ai-data-science"],
  AE: ["B.E. Aeronautical Engineering", "be-btech-aerospace-engineering", "be-aeronautical"],
  AU: ["B.E. Automobile Engineering", "be-btech-automobile-engineering", "be-automobile"],
  EI: ["B.E. Electronics and Instrumentation Engineering", "be-btech-instrumentation-engineering", "be-eie"],
  PR: ["B.E. Production Engineering", "be-btech-industrial-production-engineering", "be-production"],
  RA: ["B.E. Robotics and Automation", "be-btech-robotics-automation-engineering", "be-robotics-automation"],
  RP: ["B.Tech. Rubber and Plastics Technology", "be-btech-rubber-plastics-technology", "btech-rubber-plastics"],
  AM: ["B.E. Computer Science and Engineering (Artificial Intelligence and Machine Learning)", "be-btech-artificial-intelligence-machine-learning", "be-cse-ai-ml"],
  CA: ["B.E. Computer Science and Engineering (Artificial Intelligence)", "be-btech-artificial-intelligence-machine-learning", "be-cse-ai"],
  SC: ["B.E. Computer Science and Engineering (Cyber Security)", "be-btech-cyber-security", "be-cse-cyber-security"],
  CF: ["B.E. Computer Science and Engineering (Data Science)", "be-btech-data-science", "be-cse-data-science"],
  EF: ["B.E. Electrical and Computer Engineering", "be-btech-electrical-computer-engineering", "be-electrical-computer"],
  EX: ["B.E. Electronics and Computer Engineering", "be-btech-electronics-computer-engineering", "be-electronics-computer"],
  BT: ["B.Tech. Biotechnology", "be-btech-biotechnology", "btech-biotechnology"],
  PC: ["B.Tech. Petrochemical Technology", "be-btech-chemical-engineering", "btech-petrochemical"],
  MB: ["B.E. Mechanical Engineering (Automobile)", "be-btech-automobile-engineering", "be-mechanical-automobile"],
  CK: ["B.E. Civil Engineering (Environmental Engineering)", "be-btech-environmental-engineering", "be-civil-environmental"],
  MJ: ["B.E. Mechanical and Smart Manufacturing", "be-btech-mechanical-engineering", "be-mechanical-smart-manufacturing"],
};

// UG rows: [campus, code(s) joined by "+", intake text, stream: reg|ss|both, FN USD fee or null]
// Chennai intakes and SS/regular split: TNEA 2026 Information about colleges + vacancy list; FN fee: FN_INSTRUCTION_2026.
const UG = [
  ["CEG", "BY", "70 (self-supporting)", "ss", 3750],
  ["CEG", "CE", "70", "reg", 3750],
  ["CEG", "CS+CM", "70 regular and 140 self-supporting", "both", 7500],
  ["CEG", "EC+EM", "70 regular and 70 self-supporting", "both", 7500],
  ["CEG", "EE", "70", "reg", 3750],
  ["CEG", "EL", "70 (self-supporting)", "ss", 7500],
  ["CEG", "GI", "70", "reg", 3750],
  ["CEG", "IE", "70", "reg", 3750],
  ["CEG", "IM", "140 (self-supporting)", "ss", 7500],
  ["CEG", "MA", "35 (self-supporting)", "ss", 3750],
  ["CEG", "MI", "35", "reg", 3750],
  ["CEG", "MN", "70", "reg", 3750],
  ["CEG", "ME", "140", "reg", 3750],
  ["CEG", "PT", "70", "reg", 3750],
  ["ACT", "AP", "35 (self-supporting)", "ss", 3750],
  ["ACT", "CH+CL", "70 regular and 70 self-supporting", "both", 3750],
  ["ACT", "CR", "60 (self-supporting)", "ss", 3750],
  ["ACT", "FS", "45 (self-supporting)", "ss", 3750],
  ["ACT", "IB+IS", "40 regular and 30 self-supporting", "both", 3750],
  ["ACT", "LE", "60", "reg", 3750],
  ["ACT", "PM", "60 (self-supporting)", "ss", 3750],
  ["ACT", "PP", "60 (self-supporting)", "ss", 3750],
  ["ACT", "TX", "60", "reg", 3750],
  ["SAP", "BP", "40", "reg", 3750],
  ["MIT", "AT", "70 (self-supporting)", "ss", 7500],
  ["MIT", "AE", "70", "reg", 3750],
  ["MIT", "AU", "70", "reg", 3750],
  ["MIT", "CS+CM", "70 regular and 70 self-supporting", "both", 7500],
  ["MIT", "EC+EM", "70 regular and 70 self-supporting", "both", 7500],
  ["MIT", "EI", "70", "reg", 3750],
  ["MIT", "IM", "140 (self-supporting)", "ss", 7500],
  ["MIT", "PR", "70", "reg", 3750],
  ["MIT", "RA", "35 (self-supporting)", "ss", 3750],
  ["MIT", "RP", "70", "reg", 3750],
];
// Constituent colleges and regional campuses (English-medium branches; Tamil-medium XC/XM held, see inventory).
const UC = {
  BIT: "AM:60 CF:60 EV:60 BT:60 CE:60 CS:60 EC:60 EE:60 IT:60 ME:60 PC:60 PH:60 MB:60 EF:60 CK:60 MJ:60",
  VPM: "CS:60 EC:60 IT:60 ME:60 SC:60 AM:-",
  TVM: "CE:30 CS:60 EC:60 IT:60 EF:30 CA:-",
  ARN: "EC:60 EE:60 ME:30 CS:60 AM:-",
  KPM: "CS:60 EC:60 EE:60 ME:60 SC:-",
  CBE: "AD:60 CS:120 EC:60 EE:60 ME:60 EV:60",
  ARY: "CE:30 CS:60 EC:60 EE:60 ME:30",
  TKV: "CS:90 EC:60 EE:30 CE:30 ME:30 AD:30 EX:30",
  PRT: "CE:30 CS:60 EE:60 EC:60 ME:30 AM:60",
  PKT: "CE:60 CS:60 EC:60 EE:30 ME:30 AM:-",
  TVL: "CS:120 EC:60 GI:60 ME:60 AD:60",
  NGL: "CE:60 ME:60 CS:120 EC:60 EE:60 IT:60",
  TUT: "CE:60 EC:60 EE:60 ME:30 CS:30",
  MDU: "CE:60 CS:60 EE:60 EC:60 ME:60 AM:60 EV:-",
  RMD: "CE:30 ME:30 EC:60 CS:60 EF:30",
  DGL: "CE:30 CS:60 EC:60 EE:60 ME:30 IT:-",
};

// ---------- PG (CEAP 2026) ----------
// [campus, official title, canonical, stub, intake, ss?]
const PG = [
  ["CEG", "M.E. Applied Electronics", "me-mtech-electronics-communication-engineering", "me-applied-electronics", 18, false],
  ["CEG", "M.Tech. Artificial Intelligence and Data Science", "me-mtech-computer-science-engineering", "mtech-ai-data-science", 36, true],
  ["CEG", "M.E. Biomedical Engineering", "me-mtech-biomedical-engineering", "me-biomedical", 24, true],
  ["CEG", "M.Tech. Climate Change and Disaster Management", "me-mtech-civil-engineering", "mtech-climate-change-disaster-management", 12, true],
  ["CEG", "M.E. Communication Systems", "me-mtech-electronics-communication-engineering", "me-communication-systems", 24, false],
  ["CEG", "M.E. Computer Integrated Manufacturing", "me-mtech-mechanical-engineering", "me-computer-integrated-manufacturing", 18, false],
  ["CEG", "M.E. Computer Science and Engineering (Data Science and Cyber Security)", "me-mtech-computer-science-engineering", "me-cse-data-science-cyber-security", 18, false],
  ["CEG", "M.E. Computer Science and Engineering", "me-mtech-computer-science-engineering", "me-cse", 36, false],
  ["CEG", "M.E. Construction Engineering and Management", "me-mtech-civil-engineering", "me-construction-engineering-management", 18, false],
  ["CEG", "M.E. Control and Instrumentation Engineering", "me-mtech-instrumentation-control-engineering", "me-control-instrumentation", 18, false],
  ["CEG", "M.E. Embedded System Technologies", "me-mtech-electronics-communication-engineering", "me-embedded-system-technologies", 24, true],
  ["CEG", "M.E. Engineering Design", "me-mtech-mechanical-engineering", "me-engineering-design", 18, false],
  ["CEG", "M.E. Environmental Engineering", "me-mtech-environmental-engineering", "me-environmental", 36, false],
  ["CEG", "M.E. Geotechnical Engineering", "me-mtech-civil-engineering", "me-geotechnical", 18, false],
  ["CEG", "M.E. High Voltage Engineering", "me-mtech-electrical-engineering", "me-high-voltage", 18, false],
  ["CEG", "M.E. Hydrology and Water Resources Engineering", "me-mtech-civil-engineering", "me-hydrology-water-resources", 18, false],
  ["CEG", "M.E. Industrial Engineering", "me-mtech-industrial-engineering", "me-industrial", 12, false],
  ["CEG", "M.E. Irrigation Water Management", "me-mtech-civil-engineering", "me-irrigation-water-management", 18, false],
  ["CEG", "M.E. Power Electronics and Drives", "me-mtech-electrical-engineering", "me-power-electronics-drives", 24, false],
  ["CEG", "M.E. Power Systems Engineering", "me-mtech-electrical-engineering", "me-power-systems", 24, false],
  ["CEG", "M.E. Printing and Packaging Technology", "me-mtech-printing-packaging-technology", "me-printing-packaging", 12, true],
  ["CEG", "M.E. Product Design and Development", "me-mtech-mechanical-engineering", "me-product-design-development", 12, true],
  ["CEG", "M.E. Quality Engineering and Management", "me-mtech-industrial-engineering", "me-quality-engineering-management", 12, true],
  ["CEG", "M.E. Remote Sensing and Geomatics", "me-mtech-civil-engineering", "me-remote-sensing-geomatics", 18, false],
  ["CEG", "M.E. Structural Engineering", "me-mtech-civil-engineering", "me-structural", 18, false],
  ["CEG", "M.E. Thermal Engineering (Energy Systems)", "me-mtech-mechanical-engineering", "me-thermal-energy-systems", 12, false],
  ["CEG", "M.E. Thermal Engineering (Solar Energy)", "me-mtech-mechanical-engineering", "me-thermal-solar-energy", 12, false],
  ["CEG", "M.E. Thermal Engineering (Engines and Hybrid Technology)", "me-mtech-mechanical-engineering", "me-thermal-engines-hybrid", 12, true],
  ["CEG", "M.E. Thermal Engineering (Refrigeration and Air-Conditioning)", "me-mtech-mechanical-engineering", "me-thermal-refrigeration-air-conditioning", 12, false],
  ["CEG", "M.E. Transportation Engineering", "me-mtech-civil-engineering", "me-transportation", 18, false],
  ["CEG", "M.E. VLSI Design", "me-mtech-electronics-communication-engineering", "me-vlsi-design", 18, true],
  ["ACT", "M.Tech. Biotechnology", "me-mtech-biotechnology", "mtech-biotechnology", 24, false],
  ["ACT", "M.Tech. Ceramic Technology", "me-mtech-materials-engineering", "mtech-ceramic", 12, false],
  ["ACT", "M.Tech. Chemical Engineering (Pipeline Engineering)", "me-mtech-chemical-engineering", "mtech-chemical-pipeline", 12, false],
  ["ACT", "M.Tech. Chemical Engineering", "me-mtech-chemical-engineering", "mtech-chemical", 24, false],
  ["ACT", "M.Tech. Computational Biology", "me-mtech-biotechnology", "mtech-computational-biology", 18, true],
  ["ACT", "M.Tech. Environmental Science and Technology", "me-mtech-environmental-engineering", "mtech-environmental-science-technology", 18, true],
  ["ACT", "M.Tech. Food Technology", "master-food-science-technology", "mtech-food", 24, true],
  ["ACT", "M.Tech. Industrial Safety and Hazard Management", "me-mtech-industrial-safety-engineering", "mtech-industrial-safety-hazard-management", 18, true],
  ["ACT", "M.Tech. Leather and Footwear Technology", "me-mtech-leather-technology", "mtech-leather-footwear", 24, false],
  ["ACT", "M.Tech. Nano Science and Technology", "me-mtech-materials-engineering", "mtech-nano-science-technology", 24, true],
  ["ACT", "M.Tech. Petroleum Refining and Petrochemicals", "me-mtech-chemical-engineering", "mtech-petroleum-refining-petrochemicals", 18, false],
  ["ACT", "M.Tech. Textile Technology", "me-mtech-textile-technology", "mtech-textile", 12, false],
  ["SAP", "M.Arch. (General)", "march", "march-general", 20, false],
  ["SAP", "M.Arch. (Landscape)", "master-landscape-architecture", "march-landscape", 20, true],
  ["SAP", "M.Plan.", "master-urban-regional-planning", "mplan", 20, false],
  ["SAP", "M.Plan. (Transportation Planning)", "master-urban-regional-planning", "mplan-transportation-planning", 24, false],
  ["MIT", "M.E. Aeronautical Engineering", "me-mtech-aerospace-engineering", "me-aeronautical", 24, false],
  ["MIT", "M.E. Aerospace Technology", "me-mtech-aerospace-engineering", "me-aerospace-technology", 18, true],
  ["MIT", "M.E. Automobile Engineering", "me-mtech-mechanical-engineering", "me-automobile", 18, false],
  ["MIT", "M.E. Avionics", "me-mtech-aerospace-engineering", "me-avionics", 24, false],
  ["MIT", "M.E. Communication and Networking", "me-mtech-electronics-communication-engineering", "me-communication-networking", 24, false],
  ["MIT", "M.E. Computer Science and Engineering (AI and ML)", "me-mtech-computer-science-engineering", "me-cse-ai-ml", null, true],
  ["MIT", "M.Tech. Information Technology", "me-mtech-computer-science-engineering", "mtech-it", 12, true],
  ["MIT", "M.E. Instrumentation Engineering (Industrial Automation)", "me-mtech-instrumentation-control-engineering", "me-instrumentation-industrial-automation", 12, false],
  ["MIT", "M.E. Manufacturing Engineering", "me-mtech-mechanical-engineering", "me-manufacturing", 18, false],
  ["MIT", "M.E. Mechatronics", "me-mtech-mechatronics-engineering", "me-mechatronics", 24, true],
  ["MIT", "M.Tech. Rubber Technology", "me-mtech-materials-engineering", "mtech-rubber", 12, true],
  ["MIT", "M.E. VLSI Design and Embedded Systems", "me-mtech-electronics-communication-engineering", "me-vlsi-embedded-systems", 12, true],
  ["BIT", "M.Tech. Biotechnology", "me-mtech-biotechnology", "mtech-biotechnology", 12, true],
  ["BIT", "M.Tech. Chemical Engineering", "me-mtech-chemical-engineering", "mtech-chemical", 12, true],
  ["BIT", "M.E. Energy Engineering", "me-mtech-energy-engineering", "me-energy", 12, true],
  ["BIT", "M.E. Environmental Engineering", "me-mtech-environmental-engineering", "me-environmental", 12, true],
  ["BIT", "M.Tech. Pharmaceutical Biotechnology", "me-mtech-biotechnology", "mtech-pharmaceutical-biotechnology", 12, true],
];
// CEAP 2026 fee per campus: tuition (year) aided/regular and self-supporting, other charges (year).
const CEAPFEE = {
  CEG: { reg: 50400, ss: 75400, other: "INR 15,860", hostel: "INR 45,684 a year plus mess of about INR 3,000 a month" },
  ACT: { reg: 40400, ss: 65400, other: "INR 15,860", hostel: "INR 45,684 a year plus mess of about INR 3,000 a month" },
  SAP: { reg: 25700, ss: 38200, other: "INR 15,860", hostel: "no hostel listed in CEAP 2026 for SAP" },
  MIT: { reg: 26000, ss: 45000, other: "INR 40,260 (regular) or INR 46,280 (self-supporting)", hostel: "INR 77,200 a year" },
  BIT: { reg: null, ss: 26000, other: "INR 38,260", hostel: "INR 22,800 a year plus mess of about INR 2,400 a month" },
};

// ---------- Helpers ----------
const evidence = [];
const ev = (prog, field, claim, src, notes, status = "verified") => {
  const [label, url] = S[src];
  evidence.push({
    entity: prog ? "programme" : "university",
    universitySlug: UNI,
    ...(prog ? { programmeSlug: prog } : {}),
    publicField: field,
    claimText: claim,
    status,
    sourceLabel: label,
    sourceUrl: url,
    sourceGrade: "A",
    checkedAt: CHECKED,
    reviewBy: REVIEW,
    ...(notes ? { internalNotes: notes } : {}),
  });
};
const inr = (n) => "INR " + n.toLocaleString("en-IN");
const AU = "Anna University (AU)";
const clip = (s, n) => { if (s.length > n) throw new Error(`Too long (${s.length}>${n}): ${s}`); return s; };

const programmes = [];
const usedSlugs = new Set();
function pushProg(p) {
  if (usedSlugs.has(p.slug)) throw new Error("dup slug " + p.slug);
  usedSlugs.add(p.slug);
  programmes.push(p);
}

const TNEA_ITEMS = [
  "Pass in HSC (Class 11 and 12, academic stream) or equivalent with Mathematics, Physics and Chemistry",
  "Minimum average in Mathematics, Physics and Chemistry: 45 per cent (General) or 40 per cent (BC, BCM, MBC/DNC, SC/SCA/ST)",
  "TNEA nativity rules apply: Tamil Nadu schooling for Classes 8 to 12, a Tamil Nadu nativity certificate, or another listed category",
];
const FN_UG_ITEMS = [
  "Foreign nationals: pass in Class 12 or equivalent (or an 8+4 or 9+3 foreign board) with at least 45 per cent in Mathematics, Physics and Chemistry",
  "Foreign nationals must hold a valid student visa, PIO or OCI card at admission and show six months of parental bank statements or a scholarship letter",
  "NRI route: a parent or legal guardian must hold NRI status certified by the Indian embassy on or after 1 March 2026",
];
const TNEA_STEPS = (code, branch) => [
  "Indian applicants: register at tneaonline.org (fee INR 500, or INR 250 for SC/SCA/ST); TNEA 2026 registration ran 3 May to 5 June 2026",
  "Upload Class 10, 11 and 12 mark sheets and any community, nativity or first-graduate certificates for online verification",
  `Get a TNEA rank from Mathematics (100), Physics (50) and Chemistry (50), then choose college code ${code}${branch ? ` with branch ${branch}` : ""} in your counselling round`,
  "Confirm the allotment, pay the fee online and report to the campus with original certificates",
];
const FN_UG_STEPS = [
  "Foreign national, LDC/SIDS, NRI or CIWGC applicants: apply online at cfa.annauniv.edu/cfa (processing fee USD 400 plus 18 per cent GST); 2026-27 applications ran 16 March to 15 June 2026",
  "Join online choice filling in merit order (marks reduced to 200: Mathematics 100, Physics plus Chemistry 100) and pay the USD 1,000 initial deposit, adjusted against tuition",
];
const UG_ACAD = ["Class 10 mark sheet", "Class 11 and Class 12 (HSC) or equivalent mark sheets", "Transfer certificate and conduct certificate"];
const UG_APP_IN = ["TNEA allotment order", "Community, nativity and income certificates where claimed", "Medical fitness certificate and Aadhaar card"];
const UG_APP_FN = ["Passport", "Valid student visa, PIO or OCI card", "Proof of financial support (six months of bank statements or a scholarship letter)"];

// ---------- UG programmes ----------
function ugProgramme(campus, codes, intake, stream, fnUsd, uceIntake) {
  const c = C[campus];
  const first = codes.split("+")[0];
  const [title0, canonical, stub] = B[first];
  const chennai = CHENNAI.has(campus);
  const isBit = campus === "BIT";
  const global = chennai || isBit;
  const slug = `anna-university-${campus.toLowerCase()}-${stub}`;
  const title = `${title0}, ${c.name}`;
  const branchCodes = codes.replace("+", " and ");
  const dur = 4;
  const intakeText = uceIntake ?? intake;
  // Fees
  let fee, feeNotes, additionalFees;
  if (chennai) {
    const regTuition = 12000, ssTuition = 29600;
    const isSs = stream === "ss";
    const annual = isSs ? ssTuition : regTuition;
    const streamTxt = stream === "both"
      ? `The regular stream charges tuition of INR 6,000 a semester (INR 12,000 a year) and the self-supporting stream INR 14,800 a semester (INR 29,600 a year); the figure shown is the regular-stream rate.`
      : isSs ? `This is a self-supporting programme: tuition is INR 14,800 a semester (INR 29,600 a year).`
      : `This is a regular programme: tuition is INR 6,000 a semester (INR 12,000 a year).`;
    const notes = `${AU} ${c.short} 2025-26 fee structure for Tamil Nadu candidates (latest published; the 2026-27 schedule had not been posted on annauniv.edu when checked on 23 October 2026). ${streamTxt} Other semester charges (development, library, computer, laboratory and similar fees) bring the semester total to about INR 15,200 (regular) or INR 25,000 (self-supporting), plus one-time fees of INR 9,800 and refundable deposits of INR 7,000. First-graduate and SC/ST concessions apply. Foreign nationals pay USD ${fnUsd.toLocaleString("en-US")} a year (2026-27).`;
    fee = { status: "confirmed", audience: "domestic", academicYear: "2025-26", officialFeeCurrency: "INR", officialAnnualTuitionAmount: annual, officialTotalTuitionAmount: annual * dur, annualTuitionUsd: null, totalTuitionUsd: null, verifiedAt: CHECKED, notes };
    feeNotes = notes;
    additionalFees = [{ audience: "international", currency: "USD", annualAmount: fnUsd, totalAmount: fnUsd * dur, academicYear: "2026-27", verifiedAt: CHECKED, notes: `Anna University's 2026-27 FN/(LDC/SIDS) fee table lists USD ${fnUsd.toLocaleString("en-US")} a year for this ${c.short} branch; the NRI and CIWGC instructions list the same rate. A USD 1,000 initial deposit paid at counselling is adjusted against tuition.` }];
    ev(slug, "fee", `${S[c.fee][0]}: B.E./B.Tech. tuition INR 6,000 per semester (regular programme, Tamil Nadu candidates other than first graduates) and INR 14,800 per semester (self-supporting programme); semester totals INR 15,200 (regular) and INR 25,000 (self-supporting); one-time fees INR 9,800; caution deposits INR 7,000. NRI/CIWGC/FN candidates pay tuition as per CIR norms.`, c.fee, campus === "SAP" ? "SAP B.Plan. (4 years) regular programme table 2025-26: tuition fee INR 6,000 per term, term total INR 15,200." : undefined);
    ev(slug, "fee", `Anna University FN/(LDC/SIDS) instructions 2026-27, fee structure: ${c.short} ${title0} - USD ${fnUsd.toLocaleString("en-US")} per annum.`, "fnUg", "The NRI and CIWGC instructions 2026-27 list the same branch-wise USD fees.");
  } else {
    const notes = `${AU} publishes no 2026-27 tuition figure for ${c.name}: the TNEA 2026 college booklet lists only admission fees, deposits and hostel charges for code ${c.tnea}, and Anna University's published fee structures cover the Chennai campuses only. Ask the college office for the current tuition.${isBit ? " BIT Campus is included in the 2026-27 FN/NRI/CIWGC notification, but the branch-wise USD fee table lists only the Chennai campuses." : ""}`;
    fee = { status: "on_request", verifiedAt: CHECKED, notes };
    feeNotes = notes;
    ev(slug, "fee", `TNEA 2026 Information about colleges, code ${c.tnea} (${c.name}): booklet lists caution deposit, admission fee and hostel charges but no tuition figure. Anna University's annauniv.edu fee structures (CEG, ACT, MIT, SAP 2025-26) do not cover this college.`, "tneaCol", isBit ? "FN_INSTRUCTION_2026 fee table: CEG, ACT, MIT and SAP branches only, although ADVT_2026_NFC names BIT Campus." : undefined);
  }
  // Eligibility / audience
  const restrictions = global
    ? ["TNEA government seats are open only to Indian nationals and to OCI/PIO card holders who are natives of Tamil Nadu (not those born abroad after 4 March 2021)",
       "Foreign nationals enter only through Anna University's FN/(LDC/SIDS) route: 5 per cent supernumerary seats for FN and 5 per cent for LDC/SIDS citizens per branch",
       "NRI and CIWGC candidates use separate supernumerary quotas with embassy-certified NRI status"]
    : ["Admission is only through TNEA, which is open to Indian nationals and to OCI/PIO card holders who are natives of Tamil Nadu (not those born abroad after 4 March 2021)",
       "Anna University's 2026-27 FN/NRI/CIWGC notification covers the Chennai campuses and BIT Campus only, so there is no foreign-national route to this college",
       "Other-state Indian candidates qualify for TNEA only through Tamil Nadu schooling for Classes 8 to 12 or another listed nativity category"];
  const audienceEligibility = {
    availability: global ? "global" : "restricted",
    eligibleAudiences: global
      ? ["Indian nationals meeting TNEA 2026 nativity rules", "Foreign nationals and LDC/SIDS citizens (FN route)", "NRI and CIWGC candidates (supernumerary quotas)", "Tamil Nadu-native OCI/PIO card holders (TNEA)"]
      : ["Indian nationals meeting TNEA 2026 nativity rules", "Tamil Nadu-native OCI/PIO card holders (TNEA)"],
    restrictions,
    notes: `TNEA college code ${c.tnea}, branch ${branchCodes}; intake ${intakeText} seats in TNEA 2026.`,
    verifiedAt: CHECKED,
    sourceUrl: global ? S.advUg[1] : S.tneaBro[1],
  };
  const overview = clip(`The ${title0} at ${c.name} is a four-year ${AU} degree taught in English. Indian applicants are admitted through TNEA counselling on Class 12 marks, with no entrance test${global ? "; foreign, NRI and CIWGC applicants apply to Anna University's Centre for Admissions" : ""}.`, 420);
  const items = global ? [...TNEA_ITEMS, ...FN_UG_ITEMS] : [...TNEA_ITEMS, "Diploma holders may apply separately for lateral entry to the second year through Tamil Nadu's lateral-entry counselling"];
  const steps = global ? [...TNEA_STEPS(c.tnea, first), ...FN_UG_STEPS] : TNEA_STEPS(c.tnea, first);
  const deadlinesNote = global
    ? "TNEA 2026 registration closed on 5 June 2026 and general counselling ran 20 July to 30 August 2026. FN/NRI/CIWGC applications closed on 15 June 2026. First-semester classes at the Chennai campuses began on 24 August 2026."
    : "TNEA 2026 registration closed on 5 June 2026 and general counselling ran 20 July to 30 August 2026. The college has not published a separate 2026-27 first-semester start date.";
  const admissionsContent = {
    overview,
    eligibility: { intro: clip(`TNEA 2026 sets these conditions for Indian applicants${global ? ", and Anna University's 2026-27 FN and NRI instructions set the rules for international and NRI applicants" : ""}.`, 320), items },
    applicationSteps: steps,
    documentsRequired: { academic: UG_ACAD, application: global ? [...UG_APP_IN, ...UG_APP_FN] : UG_APP_IN },
    deadlinesNote: clip(deadlinesNote, 300),
    ...(global ? { visaConsiderations: ["Foreign nationals must produce a valid Indian student visa, PIO or OCI card at the time of admission"] } : {}),
  };
  // Evidence
  ev(slug, "eligibility", "TNEA 2026 eligibility: pass in HSC (+1 and +2) or equivalent with a minimum average in Mathematics, Physics and Chemistry of 45% (General) or 40% (BC, BCM, MBC & DNC, SC/SCA/ST); single-window admission for Indian nationals; OCI/PIO card holders who are natives of Tamil Nadu are eligible except those born abroad after 04.03.2021.", "tneaBro");
  if (global) ev(slug, "eligibility", `Anna University 2026-27 FN/(LDC/SIDS) instructions: applications for B.E./B.Tech./B.Plan. in CEG, MIT, ACT, SAP and UCE Tiruchirappalli; 5% supernumerary seats per branch for FN and 5% for LDC/SIDS; candidate must be a foreign national with valid student visa/PIO/OCI at admission and proof of financial support; HSC or 8+4/9+3 foreign board with minimum 45% average in Mathematics, Physics and Chemistry; processing fee USD 400 + 18% GST.`, "fnUg", "NRI instructions 2026-27: 5% supernumerary NRI seats; parent's NRI status certificate from the Indian embassy dated on/after 1 March 2026.");
  if (!global) ev(slug, "eligibility", `Anna University's 2026-27 notification for NRI/FN/(LDC/SIDS)/CIWGC admissions names only CEG, ACT, MIT, SAP and University College of Engineering (BIT Campus), Tiruchirappalli; ${c.name} is not included.`, "advUg");
  ev(slug, "admissions", `TNEA 2026 lists ${c.name} (college code ${c.tnea}) with branch ${branchCodes} (${title0.replace(/^B\.(E|Tech|Plan)\.\s*/, "")}), intake ${intakeText}.`, campus === "SAP" ? "tneaVac" : "tneaCol", "Cross-checked against the TNEA 2026 vacancy position after Round 1, which lists the same college and branch codes.");
  ev(slug, "admissions", "TNEA 2026 process: online registration (INR 500; INR 250 for SC/SCA/ST), certificate upload and online verification, rank on Mathematics 100 + Physics 50 + Chemistry 50, online choice filling, confirmation and reporting with fees.", "tneaBro");
  if (global) ev(slug, "admissions", "Anna University 2026-27 notification for B.E./B.Tech./B.Plan. under NRI/FN/(LDC/SIDS)/CIWGC: notification 16.03.2026; online application 16.03.2026 to 22.05.2026, extended to 15.06.2026; merit on marks reduced to 200; USD 1,000 initial deposit at counselling.", "advUg");
  ev(slug, "intake", chennai
    ? "TNEA 2026 registration 03.05.2026-05.06.2026, general counselling 20.07.2026-30.08.2026; Anna University academic calendar for UG & PG programmes (CEG, ACT, SAP & MIT campuses), I semester Aug-Dec 2026: commencement of classes on Monday 24 August 2026."
    : "TNEA 2026 schedule: registration 03.05.2026-05.06.2026, general counselling 20.07.2026-30.08.2026. No separate 2026-27 calendar for this constituent college was found on annauniv.edu.", chennai ? "calUg" : "tneaSch", chennai ? "TNEA schedule: https://static.tneaonline.org/docs/TNEA_Tentative_Schedule_2026.pdf" : undefined);
  ev(slug, "medium", "TNEA 2026 offers B.E. Civil and Mechanical Engineering separately in Tamil medium (branch codes XC and XM) in University Departments and constituent colleges of Anna University; all other branches, including this one, are the English-medium offerings.", "tneaBro", "TNEA brochure section 1(v): Tamil Medium B.E. Mechanical and Civil seats in University Departments and Constituent Colleges of Anna University. Anna University FN instructions list Tamil-medium Civil and Mechanical as distinct branches.");
  pushProg({
    slug, canonicalCourseSlug: canonical, officialTitle: title, durationYears: dur, fee,
    officialProgramUrl: chennai ? S.ugList[1] : S.tneaCol[1],
    audienceEligibility, admissionsContent,
    medium: "English",
    mediumNote: "Taught in English; Anna University offers only Civil and Mechanical Engineering as separate Tamil-medium B.E. branches.",
    instructionLanguages: ["english"],
    intakeMonths: [chennai ? "August - first-semester classes at the Chennai campuses began on 24 August 2026 after TNEA 2026 counselling" : "August or September - first-year entry after TNEA 2026 counselling (20 July to 30 August 2026)"],
    intakeCodes: chennai ? ["august"] : ["august", "september"],
    feeVerifiedAt: CHECKED, feeNotes,
    teachingPhases: [{ phase: "Years 1-4 (8 semesters)", language: "English", details: `${AU} curriculum and examinations at ${c.short}; the university awards the degree. Intake ${intakeText} seats (TNEA 2026).` }],
    ...(additionalFees ? { additionalFees } : {}),
  });
}
for (const [campus, codes, intake, stream, fnUsd] of UG) ugProgramme(campus, codes, intake, stream, fnUsd);
for (const [campus, list] of Object.entries(UC)) {
  for (const tok of list.split(" ")) {
    const [code, n] = tok.split(":");
    ugProgramme(campus, code, null, "reg", null, n === "-" ? "listed in the TNEA 2026 Round 1 vacancy list (approved intake not printed in the college booklet)" : n);
  }
}

// ---------- PG engineering (CEAP 2026) ----------
const PG_ITEMS_IN = [
  "Recognised bachelor's degree in the relevant discipline (B.E./B.Tech., B.Arch. or a prescribed master's) with at least 50 per cent (45 per cent for Tamil Nadu BC, BCM, MBC, SC, SCA, ST)",
  "A valid CEETA-PG 2026 score, or a GATE score for GATE-category seats",
  "The qualifying degree must match the eligible disciplines Anna University prescribes for this programme",
];
const PG_ITEMS_FN = [
  "Foreign nationals: a recognised bachelor's degree in the prescribed field with at least 50 per cent, ranked on degree marks or CGPA",
  "Foreign nationals need a valid student visa, PIO or OCI card at admission, proof of financial support and evidence of English proficiency",
];
function pgProgramme(campus, title0, canonical, stub, intake, ss) {
  const c = C[campus];
  const global = campus !== "BIT";
  const slug = `anna-university-${campus.toLowerCase()}-${stub}`;
  const title = `${title0}, ${c.name}`;
  const f = CEAPFEE[campus];
  const annual = ss ? f.ss : f.reg;
  const streamTxt = ss ? "self-supporting" : "regular (aided)";
  const notes = `CEAP 2026 lists ${c.short} M.E./M.Tech./M.Arch./M.Plan. tuition of ${inr(annual)} a year for ${streamTxt} programmes (2026-27), plus other charges of ${f.other} a year; hostel: ${f.hostel}.${campus === "MIT" ? " MIT's own 2026-27 table splits this into semester tuition of INR 13,000 (regular, CEETA-PG) or INR 22,500 (self-supporting, CEETA-PG) plus other semester fees." : ""}${global ? " Foreign nationals pay USD 2,000 a year (2026-27)." : ""}`;
  const fee = { status: "confirmed", audience: "domestic", academicYear: "2026-27", officialFeeCurrency: "INR", officialAnnualTuitionAmount: annual, officialTotalTuitionAmount: annual * 2, annualTuitionUsd: null, totalTuitionUsd: null, verifiedAt: CHECKED, notes };
  ev(slug, "fee", `CEAP 2026 booklet, college ${c.tnea} (${c.name}): Tuition Fee (Year) Rs. ${ss ? "self-supporting " : "aided "}${annual}; Other Charges (Year) ${f.other.replace("INR ", "Rs. ")}; hostel ${f.hostel}. ${title0} listed as ${ss ? "SS-FT" : "full-time"}.`, "ceap", campus === "MIT" ? "MIT M.E./M.Tech. fee structure 2026-27 (MIT_CEETA_PG_Admission_Schedule_2026_27.pdf): semester tuition INR 10,000 (regular GATE), 13,000 (regular non-GATE), 19,500 (SS GATE), 22,500 (SS non-GATE)." : undefined);
  if (global) ev(slug, "fee", "Anna University M.E./M.Tech./M.Plan./M.Arch. FN/(LDC/SIDS) instructions 2026-27, fee structure: PG degree programmes, for all branches of study US$ 2,000.", "fnPg");
  const restrictions = global
    ? ["CEETA-PG/CEAP seats are for Indian candidates; communal reservation applies only to Tamil Nadu natives", "Foreign nationals enter only through Anna University's FN route (5 per cent of sanctioned seats per branch)", "NRI and CIWGC candidates apply through separate Anna University quotas"]
    : ["Admission is only through CEETA-PG 2026 single-window counselling (CEAP), with no GATE seats at this college", "Anna University's 2026-27 FN route for M.E./M.Tech. covers CEG, MIT, ACT and SAP only, so foreign nationals cannot apply here"];
  const audienceEligibility = {
    availability: global ? "global" : "restricted",
    eligibleAudiences: global ? ["Indian graduates with a CEETA-PG 2026 or GATE score", "Foreign nationals (FN route)", "NRI and CIWGC candidates"] : ["Indian graduates with a CEETA-PG 2026 score"],
    restrictions,
    notes: `CEAP 2026 college code ${c.tnea}; ${intake ? `approved intake ${intake}` : "intake not printed in the CEAP booklet"}; ${ss ? "self-supporting" : "regular"} programme.`,
    verifiedAt: CHECKED,
    sourceUrl: global ? S.fnPg[1] : S.ceap[1],
  };
  const arch = /M\.Arch|M\.Plan/.test(title0);
  const admissionsContent = {
    overview: clip(`The ${title0} at ${c.name} is a two-year, four-semester ${AU} postgraduate degree taught in English. Indian applicants are admitted through CEETA-PG 2026 or GATE scores in Anna University's CEAP single-window counselling${global ? "; foreign nationals apply through the Centre for Admissions on degree merit" : ""}.`, 420),
    eligibility: { intro: clip(`The TANCET/CEETA-PG 2026 brochure and CEAP 2026 set these conditions${global ? ", and Anna University's 2026-27 FN instructions set the rules for foreign nationals" : ""}.`, 320), items: global ? [...PG_ITEMS_IN, ...PG_ITEMS_FN] : PG_ITEMS_IN },
    applicationSteps: [
      "Register for CEETA-PG 2026 at tancet.annauniv.edu (examination fee INR 1,000, or INR 500 for SC/SCA/ST, plus counselling fee); the test was held on 10 May 2026",
      `Apply for CEAP 2026 counselling and choose college code ${c.tnea} with this programme; GATE-category seats are allotted first${campus === "BIT" ? " where offered" : ""}`,
      "Upload or present the CEETA-PG score card, degree certificate and mark sheets, pay the fee online at auegov.ac.in and report for admission",
      ...(global ? ["Foreign nationals: apply online at cfa.annauniv.edu/cfa (USD 400 plus GST processing fee; 14 May to 10 June 2026) and pay a USD 1,000 initial deposit at counselling"] : []),
    ],
    documentsRequired: { academic: ["Class 10 and Class 12 mark sheets", "Bachelor's degree certificate or provisional certificate", "Consolidated or semester-wise degree mark sheets"], application: ["CEETA-PG 2026 or GATE score card", "Transfer certificate and community certificate where claimed", ...(global ? ["Foreign nationals: passport, student visa/PIO/OCI card, proof of financial support and English proficiency"] : [])] },
    deadlinesNote: clip(global ? "CEETA-PG 2026 was held on 10 May 2026. FN applications ran 14 May to 10 June 2026. First-semester PG classes at the Chennai campuses began on 9 July 2026." : "CEETA-PG 2026 was held on 10 May 2026, followed by CEAP 2026 counselling. BIT Campus has not published a separate first-semester date.", 300),
  };
  ev(slug, "eligibility", arch
    ? "TANCET/CEETA-PG 2026 brochure: M.Arch./M.Plan. require a recognised bachelor's degree in the prescribed discipline with at least 50% (45% for Tamil Nadu BC, BCM, MBC, SC, SCA, ST); CEETA-PG 2026 test on 10.05.2026."
    : "TANCET/CEETA-PG 2026 brochure: M.E./M.Tech. require a recognised bachelor's degree in the relevant field (B.E./B.Tech./B.Arch., B.Pharm. or prescribed master's) with at least 50% (45% for Tamil Nadu BC, BCM, MBC, SC, SCA, ST); CEETA-PG 2026 test on 10.05.2026.", "tancet");
  if (global) ev(slug, "eligibility", "Anna University FN/(LDC/SIDS) M.E./M.Tech./M.Plan./M.Arch. instructions 2026-27: offered in CEG, MIT, ACT and SAP; 5% of sanctioned seats per branch for FN; recognised bachelor's degree with at least 50% as per AICTE norms; merit on degree marks/CGPA; qualification as prescribed in Annexure III; valid student visa/PIO/OCI at admission; proof of financial support; English proficiency certificate.", "fnPg");
  ev(slug, "admissions", `CEAP 2026 booklet lists ${c.name} (code ${c.tnea}) with ${title0}${ss ? " (SS-FT)" : ""}, ${intake ? `approved intake ${intake}` : "intake as printed in the booklet"}, seats split between GATE and CEETA-PG categories.`, "ceap");
  ev(slug, "intake", campus === "BIT"
    ? "TANCET/CEETA-PG 2026 brochure: CEETA-PG on 10.05.2026 for admission to M.E./M.Tech. at University Departments, Regional Campuses and University Colleges of Engineering through single-window counselling."
    : "Anna University academic calendar, PG programmes (CEG, ACT, SAP & MIT campuses), I semester July-November 2026: commencement of classes on Thursday 9 July 2026. CEETA-PG 2026 test on 10.05.2026.", campus === "BIT" ? "tancet" : "calPg");
  ev(slug, "medium", "Anna University FN PG instructions 2026-27 require evidence of English proficiency, and Anna University offers its M.E./M.Tech./M.Arch./M.Plan. programmes in English (the only Tamil-medium offerings are the B.E. Civil and Mechanical branches listed in TNEA).", "fnPg");
  pushProg({
    slug, canonicalCourseSlug: canonical, officialTitle: title, durationYears: 2, fee,
    officialProgramUrl: S.ceap[1], audienceEligibility, admissionsContent,
    medium: "English", mediumNote: "Taught in English; foreign applicants must show English proficiency.", instructionLanguages: ["english"],
    intakeMonths: [campus === "BIT" ? "July or August 2026 - after CEAP 2026 counselling" : "July - first-semester PG classes at the Chennai campuses began on 9 July 2026"],
    intakeCodes: campus === "BIT" ? ["july", "august"] : ["july"],
    feeVerifiedAt: CHECKED, feeNotes: notes,
    teachingPhases: [{ phase: "Years 1-2 (4 semesters)", language: "English", details: `${AU} postgraduate curriculum at ${c.short}, ending in a project or thesis; ${ss ? "self-supporting" : "regular"} programme.` }],
    ...(global ? { additionalFees: [{ audience: "international", currency: "USD", annualAmount: 2000, totalAmount: 4000, academicYear: "2026-27", verifiedAt: CHECKED, notes: "Anna University's 2026-27 FN instructions list USD 2,000 a year for all M.E./M.Tech./M.Arch./M.Plan. branches; a USD 1,000 initial deposit at counselling is adjusted against tuition." }] } : {}),
  });
}
for (const row of PG) pgProgramme(...row);

// ---------- MBA / MCA ----------
const MM = [
  ["CEG", "MBA", "mba", "mba", "60 (aided)", true],
  ["CEG", "MBA (Tourism Management)", "mba", "mba-tourism-management", "30 (self-supporting)", true],
  ["CEG", "MCA", "mca", "mca", "60 (aided)", true],
  ["CEG", "MCA (Evening, self-supporting)", "mca", "mca-evening", "60 (self-supporting)", false],
  ["CBE", "MBA", "mba", "mba", "120 (self-supporting)", false],
  ["CBE", "MBA (Business Analytics)", "mba-business-analytics", "mba-business-analytics", "30 (self-supporting)", false],
  ["BIT", "MCA", "mca", "mca", "60 (self-supporting)", false],
  ["BIT", "MBA", "mba", "mba", "60 (self-supporting)", false],
  ["NGL", "MBA", "mba", "mba", "60 (self-supporting)", false],
  ["MDU", "MBA", "mba", "mba", "60 (self-supporting)", false],
];
for (const [campus, t0, canonical, stub, intake, global] of MM) {
  const c = C[campus];
  const slug = `anna-university-${campus.toLowerCase()}-${stub}`;
  const isMca = t0.startsWith("MCA");
  const title = `${t0}, ${c.name}`;
  const fee = global
    ? { status: "confirmed", audience: "international", academicYear: "2026-27", officialFeeCurrency: "USD", officialAnnualTuitionAmount: 2000, officialTotalTuitionAmount: 4000, annualTuitionUsd: 2000, totalTuitionUsd: 4000, verifiedAt: CHECKED, notes: `Anna University's 2026-27 FN instructions list USD 2,000 a year for the ${isMca ? "M.C.A." : "M.B.A."} at CEG, with a USD 1,000 initial deposit at counselling adjusted against tuition. For Indian students admitted through TANCET, the DoTE MBA/MCA 2026-27 booklet states only that tuition is collected as per Government norms; it lists CEG hostel deposit INR 6,500, room rent INR 3,600 and mess INR 35,000 a year.` }
    : { status: "on_request", verifiedAt: CHECKED, notes: `${AU} publishes no 2026-27 tuition figure for the ${t0} at ${c.name}; the DoTE Tamil Nadu MBA/MCA 2026-27 booklet states that tuition is collected as per Government norms. Ask the campus for the current fee.` };
  ev(slug, "fee", global ? `Anna University ${isMca ? "M.C.A." : "M.B.A."} FN instructions 2026-27, fee structure: PG degree programmes, for all branches of study US$ 2,000.` : `DoTE Tamil Nadu MBA/MCA Admissions 2026-27 booklet, college ${c.tnea}: ${t0} intake ${intake}; '* Tuition Fee to be collected as per Government Norms'; no tuition amount printed.`, global ? (isMca ? "fnMca" : "fnMba") : "mbamca");
  const items = isMca
    ? ["Recognised three-year bachelor's degree in BCA, B.Sc. (IT/Computer Science) or B.E./B.Tech. CSE, or any degree with Mathematics at 10+2 or degree level (bridge courses apply)", "At least 50 per cent in the qualifying degree (45 per cent for Tamil Nadu BC, BCM, MBC, SC, SCA, ST)", "A valid TANCET 2026 (MCA) score for Indian applicants"]
    : ["Recognised bachelor's degree of at least three years with at least 50 per cent (45 per cent for Tamil Nadu BC, BCM, MBC, SC, SCA, ST)", "A valid TANCET 2026 (MBA) score for Indian applicants", "Degrees through 10+2+3/4/5, 10+3-year diploma plus degree, or AMIE with two years' experience are accepted"];
  if (global) items.push("Foreign nationals: same academic qualification with at least 50 per cent, ranked on degree marks, with a valid student visa, PIO or OCI card at admission");
  const admissionsContent = {
    overview: clip(`The ${t0} at ${c.name} is a two-year, four-semester ${AU} degree taught in English. Indian applicants are admitted on TANCET 2026 scores through Tamil Nadu's MBA/MCA single-window counselling${global ? "; foreign nationals apply to Anna University's Centre for Admissions" : ""}.`, 420),
    eligibility: { intro: clip(`The TANCET 2026 brochure sets these conditions${global ? ", and Anna University's 2026-27 FN instructions cover foreign nationals" : ""}.`, 320), items },
    applicationSteps: [
      `Register for TANCET 2026 at tancet.annauniv.edu; the ${isMca ? "MCA" : "MBA"} test was held on 9 May 2026`,
      `Apply for Tamil Nadu MBA/MCA counselling at tn-mbamca.com and choose college code ${c.tnea}`,
      "Confirm the allotment, pay the fee and report to the campus with original certificates",
      ...(global ? ["Foreign nationals: apply online at cfa.annauniv.edu/cfa (USD 400 plus GST processing fee; 14 May to 10 June 2026) and pay a USD 1,000 initial deposit at counselling"] : []),
    ],
    documentsRequired: { academic: ["Class 10 and Class 12 mark sheets", "Bachelor's degree certificate and mark sheets"], application: ["TANCET 2026 score card", "Transfer certificate and community certificate where claimed", ...(global ? ["Foreign nationals: passport, student visa/PIO/OCI card and proof of financial support"] : [])] },
    deadlinesNote: clip(campus === "CEG" ? "TANCET 2026 was held on 9 May 2026. FN applications ran 14 May to 10 June 2026. First-semester MBA and MCA classes at the university department began on 2 September 2026." : "TANCET 2026 was held on 9 May 2026, followed by Tamil Nadu MBA/MCA counselling. The campus has not published a separate first-semester date.", 300),
  };
  ev(slug, "eligibility", isMca ? "TANCET 2026 brochure: MCA - recognised 3-year BCA or B.Sc. (IT/CS or equivalent), or any 3-year degree with Mathematics at 10+2 or degree level, with at least 50% (45% for Tamil Nadu BC, BCM, MBC, SC, SCA, ST)." : "TANCET 2026 brochure: MBA - recognised bachelor's degree of minimum 3 years with at least 50% (45% for Tamil Nadu BC, BCM, MBC, SC, SCA, ST); 10+2+3/4/5, 10+3-year diploma plus degree, or AMIE with 2 years' experience.", "tancet");
  if (global) ev(slug, "eligibility", `Anna University ${isMca ? "M.C.A." : "M.B.A."} FN instructions 2026-27: programme offered in the University Department at CEG, Guindy; 5% of sanctioned seats for FN; candidate must be a foreign national with valid student visa/PIO/OCI at admission; at least 50% in the qualifying degree; merit on degree marks.`, isMca ? "fnMca" : "fnMba");
  ev(slug, "admissions", `DoTE Tamil Nadu MBA/MCA Admissions 2026-27 booklet lists ${c.name} (college ${c.tnea}) with ${t0}, approved intake ${intake}. TANCET 2026 covers MBA/MCA admission to University Departments, Regional Campuses and University Colleges of Engineering.`, "mbamca");
  ev(slug, "intake", campus === "CEG" ? "Anna University academic calendar, University Department MBA & MCA, I semester Sep-Dec 2026: commencement of classes on Wednesday 2 September 2026. TANCET 2026 MBA and MCA tests on 09.05.2026." : "TANCET 2026 brochure: TANCET MCA and MBA on 09.05.2026, for admission to University Departments, Anna University Regional Campuses and University Colleges of Engineering through single-window counselling.", campus === "CEG" ? "calMba" : "tancet");
  ev(slug, "medium", "Anna University FN PG instructions 2026-27 require evidence of English proficiency; Anna University teaches its MBA and MCA programmes in English (Tamil medium is offered only for B.E. Civil and Mechanical).", "fnMba");
  pushProg({
    slug, canonicalCourseSlug: canonical, officialTitle: title, durationYears: 2, fee,
    officialProgramUrl: global ? S[isMca ? "fnMca" : "fnMba"][1] : S.mbamca[1],
    audienceEligibility: {
      availability: global ? "global" : "restricted",
      eligibleAudiences: global ? ["Indian graduates with a TANCET 2026 score", "Foreign nationals (FN route)", "NRI and CIWGC candidates"] : ["Indian graduates with a TANCET 2026 score"],
      restrictions: global ? ["TANCET single-window seats are for Indian candidates; communal reservation applies only to Tamil Nadu natives", "Foreign nationals enter only through Anna University's FN route (5 per cent of sanctioned seats)"] : ["Admission is only through TANCET 2026 and Tamil Nadu MBA/MCA single-window counselling", "Anna University's 2026-27 FN route for MBA/MCA covers only the regular programmes at CEG, Guindy"],
      notes: `Tamil Nadu MBA/MCA counselling college code ${c.tnea}; intake ${intake}.`,
      verifiedAt: CHECKED, sourceUrl: global ? S[isMca ? "fnMca" : "fnMba"][1] : S.mbamca[1],
    },
    admissionsContent, medium: "English", mediumNote: "Taught in English; foreign applicants must show English proficiency.", instructionLanguages: ["english"],
    intakeMonths: [campus === "CEG" ? "September - first-semester classes began on 2 September 2026" : "August or September 2026 - after Tamil Nadu MBA/MCA counselling"],
    intakeCodes: campus === "CEG" ? ["september"] : ["august", "september"],
    feeVerifiedAt: CHECKED, feeNotes: fee.notes,
    teachingPhases: [{ phase: "Years 1-2 (4 semesters)", language: "English", details: `${AU} ${isMca ? "MCA" : "MBA"} curriculum at ${c.short}; intake ${intake}.` }],
  });
}

// ---------- M.Sc. (CEG) ----------
const MSC2 = [
  ["Mathematics", "msc-mathematics", "msc-mathematics", "B.Sc. Mathematics or B.Sc. (Applied Science)"],
  ["Materials Science", "msc-materials-science", "msc-materials-science", "B.Sc. Physics with Mathematics as an ancillary subject, or B.Sc. Applied Science"],
  ["Medical Physics", "msc-physics", "msc-medical-physics", "B.Sc. Physics with Mathematics as an ancillary subject, or B.Sc. Applied Science"],
  ["Applied Chemistry", "msc-chemistry", "msc-applied-chemistry", "B.Sc. Chemistry or B.Sc. (Applied Science)"],
  ["Applied Geology", "msc-earth-geological-sciences", "msc-applied-geology", "B.Sc. Geology or Applied Geology"],
  ["Electronic Media", "master-media-communication", "msc-electronic-media", "B.Sc., BCA, B.E./B.Tech., or a bachelor's degree with a media component such as B.A. Journalism, B.V.A., B.F.T., B.V.C., B.M.M.C., B.M.M. or B.Des."],
];
for (const [name, canonical, stub, elig] of MSC2) {
  const slug = `anna-university-ceg-${stub}`;
  const t0 = `M.Sc. ${name} (2 years)`;
  const notes = "Anna University's 2026-27 FN instructions list USD 2,000 a year for all M.Sc. (2 year) programmes, with a USD 1,000 initial deposit at counselling adjusted against tuition. Anna University has not published the 2026-27 fee for Indian students admitted through its M.Sc. entrance examination.";
  const fee = { status: "confirmed", audience: "international", academicYear: "2026-27", officialFeeCurrency: "USD", officialAnnualTuitionAmount: 2000, officialTotalTuitionAmount: 4000, annualTuitionUsd: 2000, totalTuitionUsd: 4000, verifiedAt: CHECKED, notes };
  ev(slug, "fee", "Anna University M.Sc. (2 year) FN instructions 2026-27, fee structure: PG degree programmes, for all branches of study US$ 2,000.", "fnMsc2");
  ev(slug, "eligibility", `Anna University M.Sc. (2 year) instructions 2026-27, Table 1: M.Sc. ${name} - eligible degree: ${elig}; degree in the 10+2+3/4 pattern from a recognised university; communal reservation only for Tamil Nadu natives.`, "msc2", name === "Medical Physics" ? "FN M.Sc. instructions note: AERB requires M.Sc. Medical Physics graduates to complete a minimum 12-month internship in an AERB-recognised radiotherapy department and pass the RSO examination to work as a medical physicist." : undefined);
  ev(slug, "eligibility", "Anna University M.Sc. (2 year) FN instructions 2026-27: offered at CEG, Guindy; 5% of sanctioned seats per branch for FN; foreign national with valid student visa/PIO/OCI at admission; proof of financial support; merit on aggregate marks/CGPA in the qualifying degree.", "fnMsc2");
  ev(slug, "admissions", "Anna University M.Sc. (2 year) admissions 2026-27 (cfa.annauniv.edu): online application 30.04.2026 to 28.05.2026; entrance examination on 07.06.2026; application fee INR 1,000 + GST (INR 500 + GST for SC/SCA/ST); programmes offered in the University Departments at CEG.", "msc2");
  ev(slug, "intake", "Anna University academic calendar for UG & PG programmes (CEG, ACT, SAP & MIT campuses), I semester Aug-Dec 2026: commencement of classes on 24 August 2026. FN M.Sc. applications 30.04.2026 to 28.05.2026.", "calUg");
  ev(slug, "medium", "Anna University M.Sc. (2 year) FN instructions 2026-27 require a certificate of proficiency in English; the programmes are taught in English.", "fnMsc2");
  pushProg({
    slug, canonicalCourseSlug: canonical, officialTitle: `${t0}, ${C.CEG.name}`, durationYears: 2, fee,
    officialProgramUrl: S.msc2[1],
    audienceEligibility: { availability: "global", eligibleAudiences: ["Indian graduates (Anna University M.Sc. entrance examination)", "Foreign nationals (FN route)", "NRI and CIWGC candidates"], restrictions: ["Communal reservation applies only to Tamil Nadu natives", "Foreign nationals enter only through Anna University's FN route (5 per cent of sanctioned seats)"], ...(name === "Medical Physics" ? { notes: "Graduates who want to work as medical physicists must complete a 12-month internship in an AERB-recognised radiotherapy department and pass AERB's RSO examination." } : {}), verifiedAt: CHECKED, sourceUrl: S.fnMsc2[1] },
    admissionsContent: {
      overview: clip(`The ${t0} at CEG, Guindy is a four-semester ${AU} degree taught in English. Indian applicants sit Anna University's own M.Sc. entrance examination; foreign nationals apply to the Centre for Admissions and are ranked on degree marks.`, 420),
      eligibility: { intro: "Anna University's 2026-27 M.Sc. (2 year) instructions set these conditions for Indian and foreign applicants.", items: [`Eligible degree: ${elig}`.slice(0, 220), "A bachelor's degree in the 10+2+3 or 10+2+4 pattern from a recognised university", "Final-year students may apply if they have passed all earlier semesters", "Foreign nationals: valid student visa, PIO or OCI card at admission, proof of financial support and evidence of English proficiency"] },
      applicationSteps: ["Apply online at cfa.annauniv.edu/cfa (INR 1,000 plus GST, or INR 500 plus GST for SC/SCA/ST); 2026-27 applications ran 30 April to 28 May 2026", "Sit the Anna University M.Sc. entrance examination (7 June 2026) and check the rank list", "Attend counselling, pay the fee online and report to CEG with original certificates", "Foreign nationals: apply through the FN portal (USD 400 plus GST), join choice filling and pay a USD 1,000 initial deposit"],
      documentsRequired: { academic: ["Class 10 and Class 12 mark sheets", "Bachelor's degree certificate and all semester mark sheets"], application: ["Community and nativity certificates where claimed", "Foreign nationals: passport, student visa/PIO/OCI card, proof of financial support and English proficiency certificate"] },
      deadlinesNote: "Applications for 2026-27 closed on 28 May 2026 and the entrance examination was on 7 June 2026. First-semester classes at CEG began on 24 August 2026.",
    },
    medium: "English", mediumNote: "Taught in English; foreign applicants must show English proficiency.", instructionLanguages: ["english"],
    intakeMonths: ["August - first-semester classes at CEG began on 24 August 2026"], intakeCodes: ["august"],
    feeVerifiedAt: CHECKED, feeNotes: notes,
    teachingPhases: [{ phase: "Years 1-2 (4 semesters)", language: "English", details: `${AU} M.Sc. curriculum at CEG, Guindy.` }],
  });
}
for (const [name, canonical, stub, elig] of [
  ["Computer Science", "msc-computer-science", "msc-integrated-computer-science", "Pass in HSC (academic) with Mathematics, Physics and Chemistry, minimum average 45 per cent (40 per cent for Tamil Nadu BC, BCM, MBC/DNC, SC, SCA, ST)"],
  ["Electronic Media", "master-media-communication", "msc-integrated-electronic-media", "Pass in the Higher Secondary (10+2) examination in any group, or an equivalent examination approved by Anna University"],
]) {
  const slug = `anna-university-ceg-${stub}`;
  const t0 = `M.Sc. ${name} (5 years integrated)`;
  const notes = "CEG's 2026-27 M.Sc. (5 years) self-supporting fee structure: tuition INR 17,500 a semester (INR 35,000 a year); the semester total including other fees is INR 33,380, plus one-time fees of INR 8,860 and refundable deposits of INR 7,000 (first-semester payment INR 49,240). Foreign nationals pay USD 5,000 a year (2026-27).";
  const fee = { status: "confirmed", audience: "domestic", academicYear: "2026-27", officialFeeCurrency: "INR", officialAnnualTuitionAmount: 35000, officialTotalTuitionAmount: 175000, annualTuitionUsd: null, totalTuitionUsd: null, verifiedAt: CHECKED, notes };
  ev(slug, "fee", "CEG M.Sc. (5 Yrs) self-supporting programme fee structure for AY 2026-27: tuition fee INR 17,500 per semester; semester total INR 33,380; one-time total INR 8,860; deposits INR 7,000; grand total INR 49,240 at admission.", "msc5fee");
  ev(slug, "fee", "Anna University M.Sc. (5 year integrated) FN instructions 2026-27, fee structure: for all M.Sc. (Five years) US$ 5,000.", "fnMsc5");
  ev(slug, "eligibility", `Anna University M.Sc. (5 year integrated) instructions 2026-27: M.Sc. ${name} - ${elig}; Tamil Nadu nativity criteria apply to the general category (Classes 8-12 in Tamil Nadu or Tamil Nadu native).`, "msc5");
  ev(slug, "eligibility", "Anna University M.Sc. (5 year integrated) FN instructions 2026-27: M.Sc. Computer Science and M.Sc. Electronic Media at CEG; 5% of sanctioned seats for FN; foreign national with valid student visa/PIO/OCI at admission and proof of financial support.", "fnMsc5");
  ev(slug, "admissions", "Anna University M.Sc. (5 year integrated) admission 2026-27: online application 30.04.2026 to 28.05.2026, extended to 15.06.2026; rank list on HSC marks; CEG admission circular dated 12.08.2026 directs allotted candidates to report on 17.08.2026.", "msc5fee", "Centre for Admissions page: https://cfa.annauniv.edu/cfa/msc55.html");
  ev(slug, "intake", "CEG M.Sc. (5 years) Integrated admission 2026-27: candidates report on 17.08.2026; Anna University UG & PG academic calendar (Aug-Dec 2026): classes commence 24 August 2026.", "msc5fee");
  ev(slug, "medium", "Anna University M.Sc. (5 year) FN instructions 2026-27 cover programmes taught in English at CEG; Anna University's only Tamil-medium offerings are B.E. Civil and Mechanical.", "fnMsc5");
  pushProg({
    slug, canonicalCourseSlug: canonical, officialTitle: `${t0}, ${C.CEG.name}`, durationYears: 5, fee,
    officialProgramUrl: S.msc5[1],
    audienceEligibility: { availability: "global", eligibleAudiences: ["Indian candidates meeting Tamil Nadu nativity criteria (general category)", "Foreign nationals (FN route)", "NRI and CIWGC candidates"], restrictions: ["General-category seats require Tamil Nadu schooling for Classes 8 to 12 or Tamil Nadu nativity", "Foreign nationals enter only through Anna University's FN route (5 per cent of sanctioned seats)"], verifiedAt: CHECKED, sourceUrl: S.fnMsc5[1] },
    admissionsContent: {
      overview: clip(`The ${t0} at CEG, Guindy is a ten-semester ${AU} programme entered after Class 12 and taught in English. Indian applicants are ranked on Class 12 marks by Anna University's Centre for Admissions; foreign nationals use the FN route.`, 420),
      eligibility: { intro: "Anna University's 2026-27 M.Sc. (5 year integrated) instructions set these conditions.", items: [elig, "General-category applicants must meet Tamil Nadu nativity criteria (Classes 8 to 12 in Tamil Nadu, or Tamil Nadu native)", "Foreign nationals: equivalent Class 12 qualification, valid student visa, PIO or OCI card at admission and proof of financial support"] },
      applicationSteps: ["Apply online at cfa.annauniv.edu/cfa (INR 1,000 plus GST, or INR 500 plus GST for SC/SCA/ST); 2026-27 applications ran 30 April to 15 June 2026", "Check the rank list, attend online counselling and accept the allotment", "Pay the fee online at auegov.ac.in and report to CEG (17 August 2026 for 2026-27)", "Foreign nationals: apply through the FN portal (USD 400 plus GST) and pay a USD 1,000 initial deposit at counselling"],
      documentsRequired: { academic: ["Class 10 (SSLC) mark sheet", "Class 12 (HSC) mark sheet", "Transfer certificate"], application: ["Allotment order", "Community and nativity certificates where claimed", "Foreign nationals: passport, student visa/PIO/OCI card and proof of financial support"] },
      deadlinesNote: "Applications for 2026-27 closed on 15 June 2026. Allotted candidates reported to CEG on 17 August 2026, and classes began on 24 August 2026.",
    },
    medium: "English", mediumNote: "Taught in English at CEG, Guindy.", instructionLanguages: ["english"],
    intakeMonths: ["August - admission on 17 August 2026 and classes from 24 August 2026"], intakeCodes: ["august"],
    feeVerifiedAt: CHECKED, feeNotes: notes,
    teachingPhases: [{ phase: "Years 1-5 (10 semesters)", language: "English", details: `${AU} integrated M.Sc. curriculum at CEG, Guindy (self-supporting programme).` }],
    additionalFees: [{ audience: "international", currency: "USD", annualAmount: 5000, totalAmount: 25000, academicYear: "2026-27", verifiedAt: CHECKED, notes: "Anna University's 2026-27 FN instructions list USD 5,000 a year for all M.Sc. (five year) programmes; a USD 1,000 initial deposit at counselling is adjusted against tuition." }],
  });
}

// ---------- Courses ----------
const taxonomy = readFileSync(`${ROOT}lib/data/program-taxonomy.ts`, "utf8");
const used = [...new Set(programmes.map((p) => p.canonicalCourseSlug))];
const migDirs = (await import("node:fs")).readdirSync(`${ROOT}content-migrations`).filter((d) => /^\d{4}-/.test(d) && d !== "0149-india-anna-university").sort();
const courses = [];
for (const slug of used) {
  let rec = null;
  for (const d of migDirs) {
    try {
      const pl = JSON.parse(readFileSync(`${ROOT}content-migrations/${d}/payload.json`, "utf8"));
      const found = pl.courses?.find((c) => c.slug === slug);
      if (found) rec = found;
    } catch { /* reservation without payload */ }
  }
  if (!rec) {
    const m = taxonomy.match(new RegExp(`slug: "${slug}",\\s*name: "([^"]+)",\\s*shortName: "([^"]+)",\\s*stream: "([^"]+)",\\s*level: "([^"]+)",\\s*discipline: "([^"]+)",\\s*aliases: \\[([^\\]]*)\\]`));
    if (!m) throw new Error("not in taxonomy " + slug);
    const [, name, shortName, stream, level, discipline, al] = m;
    const subject = name.replace(/^(B\.E\.\/B\.Tech|M\.E\.\/M\.Tech|M\.Sc\.|Bachelor's|Master's) in /, "").replace(/^Master of Business Administration$/, "business administration");
    const isBach = level === "bachelors";
    rec = {
      slug, name, shortName, stream, level, discipline,
      aliases: [...al.matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      displayOrder: 0,
      durationYears: isBach ? 4 : 2,
      summary: `The ${name} is a ${isBach ? "undergraduate" : "postgraduate"} degree in ${subject.toLowerCase()}. ${isBach ? "It usually lasts four years and combines foundation courses in mathematics and science with discipline-specific theory, laboratory work, industrial training and a final-year project." : "It usually lasts two years and combines advanced coursework in the discipline with laboratory or studio work and a dissertation or project."} Compare each university's official award title, entry requirements, tuition and intake before applying, because specialisations and admission routes vary by institution.`,
      metaTitle: `${shortName} Programmes | Fees & Admissions`.slice(0, 70),
      metaDescription: `Compare ${shortName} programmes by university, eligibility, admission route, duration and tuition fees for domestic and international applicants.`,
    };
  }
  courses.push(rec);
}

// ---------- University ----------
const uniEv = (field, claim, src, notes) => ev(null, field, claim, src, notes);
uniEv("identity", "UGC consolidated list of universities: 'Anna University, Sardar Patel Road, Guindy, Chennai-600 025, Tamil Nadu. (State University)', year 1978.", "ugc");
uniEv("identity", "Anna University constituent colleges page lists Anna University Regional Campuses at Coimbatore, Madurai and Tirunelveli and University Colleges of Engineering at Arni, Ariyalur, Dindigul, Kanchipuram, Nagercoil, Panruti, Pattukkottai, Ramanathapuram, Thirukkuvalai, Tindivanam, Villupuram, BIT Campus Tiruchirappalli and VOC College of Engineering Thoothukudi.", "constituent");
uniEv("identity", "TNEA 2026 college list: University Departments of Anna University - CEG campus (code 1), ACT campus (2), School of Architecture and Planning (3), MIT campus, Chromepet (4); 'Constituent Colleges' section lists codes 1013, 1014, 1015, 1026, 2025, 3011, 3016, 3018, 3019, 3021, 4020, 4023, 4024, 5010, 5017 and 5022.", "tneaCol");
uniEv("recognition", "TANCET/CEETA-PG 2026 brochure: the Government of Tamil Nadu has authorised Anna University to conduct TANCET (MBA/MCA) and CEETA-PG (M.E./M.Tech./M.Arch./M.Plan.) for University Departments, Regional Campuses, University Colleges of Engineering, Annamalai University and government and aided colleges.", "tancet");
uniEv("international", "Anna University 2026-27 FN/(LDC/SIDS) route: UG fee USD 7,500 a year (CSE, ECE, IT, VLSI at CEG; CSE, ECE, IT, AI&DS at MIT) or USD 3,750 a year (other branches); PG USD 2,000; M.Sc. 5-year USD 5,000; processing fee USD 400 + 18% GST; initial deposit USD 1,000. Contact FNRIcfa@gmail.com, (044) 2235 8314 / 8276.", "fnUg");
uniEv("campus", "TNEA 2026 booklet: CEG hostel mess type both (veg/non-veg); MIT placement 80%, CEG 62%; MIT 18 km from district HQ and 1 km from Chromepet station; CEG 3 km from Saidapet/Guindy station. CEAP 2026: CEG/ACT hostel INR 45,684 a year with mess INR 3,000 a month; MIT hostel INR 77,200 a year; CEG started 1794, ACT 1944, SAP 1957.", "tneaCol", "CEAP booklet: https://cfa.annauniv.edu/cfa/pdf/CEAP_BOOKLET_INFORMATION_2026.pdf");
uniEv("safety", "Anna University homepage notices: calls for resident counsellors for the Flora (boys) and Lavender (girls) international hostels, and a walkathon organised by the university's POSH cell; TNEA 2026 booklet lists anti-ragging numbers 4422358491 (CEG) and 9962085868 (MIT).", "home");
uniEv("hostel", "CEG hostel fees 2025-26 (UG): admission INR 600, amenities fund INR 600, mess deposit INR 3,000, block deposit INR 1,500, annual electricity/water/room rent INR 3,675, per-semester residential service INR 10,800, block maintenance INR 4,950 and mess advance INR 17,500; total INR 42,625.", "feeCeg");

const U = {
  countrySlug: "india",
  slug: UNI,
  name: "Anna University",
  city: "Chennai",
  type: "Public",
  establishedYear: 1978,
  officialWebsite: "https://www.annauniv.edu/",
  mediaAttribution: {},
  summary: "Anna University (AU) is a Tamil Nadu state university set up in 1978 at Guindy, Chennai, listed by UGC as a state university. It teaches engineering, technology, architecture, planning, management and science at four Chennai campuses (CEG, ACT, MIT and SAP), three regional campuses and 13 University Colleges of Engineering, and awards its own degrees.",
  campusLifestyle: "Anna University (AU)'s four Chennai campuses are College of Engineering Guindy (CEG, teaching since 1794), Alagappa College of Technology (ACT, 1944) and the School of Architecture and Planning (SAP, 1957), all on Sardar Patel Road, Guindy, and the Madras Institute of Technology (MIT) at Chromepet. Three regional campuses (Coimbatore, Madurai, Tirunelveli) and 13 University Colleges of Engineering across Tamil Nadu teach Anna University B.E./B.Tech. branches, and some offer MBA, MCA or M.E./M.Tech.",
  cityProfile: "Anna University (AU) is headquartered on Sardar Patel Road, Guindy, in south Chennai (PIN 600025), where CEG, ACT and SAP share one campus about 3 km from Guindy and Saidapet railway stations. The MIT campus is at Chromepet in Tambaram taluk, Chengalpattu district, 1 km from Chromepet station. Regional campuses are at Navavoor near Coimbatore, Keelakuilkudi in Madurai and Palayamkottai in Tirunelveli. University Colleges of Engineering are spread across Tamil Nadu, including Villupuram, Tindivanam, Arni, Kancheepuram, Tiruchirappalli (BIT Campus), Ariyalur, Thirukkuvalai, Panruti, Pattukkottai, Nagercoil, Thoothukudi, Ramanathapuram and Dindigul.",
  practicalExposure: "Anna University (AU) charges every B.E./B.Tech. entrant at the Chennai campuses a one-time placement and training fee of INR 2,000 and an industrial-visit fee of INR 500 a semester, according to its 2025-26 fee structures. In TNEA 2026 college data, the MIT campus reported 80 per cent placement and CEG 62 per cent; constituent colleges reported between 38 per cent (Ariyalur) and 85 per cent (Thirukkuvalai). M.E./M.Tech. programmes end in a project or thesis, and the M.Sc. Medical Physics leads to a 12-month AERB-recognised radiotherapy internship before the RSO examination.",
  hostelOverview: "Anna University (AU)'s CEG hostels charged UG students INR 42,625 at first-year entry in 2025-26, covering semester residential and maintenance charges, a mess advance of INR 17,500 and deposits. CEAP 2026 lists CEG and ACT hostels at INR 45,684 a year with mess of about INR 3,000 a month, MIT at INR 77,200 a year, and BIT Campus at INR 22,800 a year. Anna University runs separate international hostels, Flora for men and Lavender for women; foreign nationals get hostel details from the Centre for International Relations.",
  dietarySupport: "Anna University (AU)'s Chennai campus hostels serve both vegetarian and non-vegetarian food, according to TNEA 2026 college data for CEG, ACT, SAP and MIT. Mess charges are billed separately from room rent: about INR 3,000 a month at CEG and ACT in CEAP 2026. No menu for specific religious or regional diets is published, so ask the hostel office before arrival.",
  safetyOverview: "Anna University (AU) lists an anti-ragging phone line for each campus in TNEA 2026 (CEG 044-2235 8491, MIT 99620 85868), and every Chennai entrant signs an anti-ragging declaration with a parent at admission. The university runs a POSH (prevention of sexual harassment) cell. Hostels have resident counsellors, including at the international hostels.",
  studentSupport: "Anna University (AU)'s Centre for Admissions handles foreign-national, NRI and CIWGC applications (FNRIcfa@gmail.com, 044-2235 8314), and the Centre for International Relations advises admitted international students on fees and hostels (admissions.cir@annauniv.edu). Indian entrants may claim the First Graduate tuition concession, the 7.5 per cent government-school waiver or the Post-Matric Scholarship.",
  whyChoose: [
    "Anna University (AU) is a UGC-listed state university (1978) whose Chennai campuses include CEG, teaching engineering since 1794, and MIT Chromepet, which reported 80 per cent placement in TNEA 2026 data.",
    "Anna University's Chennai campuses charge Tamil Nadu students B.E./B.Tech. tuition of INR 6,000 a semester in regular programmes (2025-26), and foreign nationals pay USD 3,750 or 7,500 a year.",
    "Anna University lists 31 B.E./B.Tech./B.Plan. programmes (2025-26) and 59 M.E./M.Tech./M.Arch./M.Plan. programmes (CEAP 2026) at its Chennai campuses, including rare fields such as Mining, Leather, Ceramic, Textile, Printing and Rubber and Plastics Technology.",
  ],
  thingsToConsider: [
    "Anna University (AU) admits Indian B.E./B.Tech. students only through TNEA, which requires Tamil Nadu schooling or nativity; foreign nationals have 5 per cent supernumerary seats per branch at the Chennai campuses and BIT Campus only.",
    "Anna University's regional campuses and most University Colleges of Engineering have no foreign-national route and publish no tuition figure, and their placement rates in TNEA 2026 ranged from 38 to 85 per cent.",
    "Anna University's B.Arch. at SAP could not be checked against the Council of Architecture's list for this page, and its B.E. Civil and Mechanical Tamil-medium branches are taught in Tamil.",
  ],
  bestFitFor: [
    "Tamil Nadu students with strong Class 12 Mathematics, Physics and Chemistry marks who want a low-fee engineering degree at CEG, ACT or MIT through TNEA.",
    "Foreign nationals and LDC/SIDS citizens seeking an Indian state-university B.E./B.Tech. at USD 3,750 to 7,500 a year, or an M.E./M.Tech./MBA/MCA at USD 2,000 a year.",
    "Engineering graduates with a CEETA-PG or GATE score looking for specialised M.E./M.Tech. programmes such as Avionics, Remote Sensing, Leather and Footwear or Industrial Safety.",
  ],
  industryPartners: [],
  recognitionBadges: [
    "UGC - State University (Anna University, Chennai, 1978), listed in UGC's consolidated list of universities",
    "Government of Tamil Nadu - authorised to conduct TANCET and CEETA-PG 2026 for state PG admissions",
    "DoTE Tamil Nadu - TNEA 2026 participating University Departments (codes 1-4) and 16 constituent colleges and regional campuses",
  ],
  recognitionLinks: [
    { label: "UGC - Consolidated list of all universities", url: S.ugc[1] },
    { label: "Anna University - TANCET / CEETA-PG 2026 Information Brochure", url: S.tancet[1] },
    { label: "DoTE Tamil Nadu - TNEA 2026 Information about colleges", url: S.tneaCol[1] },
  ],
  faq: [
    { question: "Is Anna University UGC approved?", answer: "Yes, Anna University (AU) is listed by the University Grants Commission as a state university, at Sardar Patel Road, Guindy, Chennai, with 1978 as its year. It awards its own degrees at its Chennai campuses (CEG, ACT, MIT and SAP), its regional campuses at Coimbatore, Madurai and Tirunelveli, and its University Colleges of Engineering. The Government of Tamil Nadu also authorises it to run TANCET and CEETA-PG." },
    { question: "What is the B.E. fee at Anna University?", answer: "Anna University (AU)'s Chennai campuses charged Tamil Nadu B.E./B.Tech. students tuition of INR 6,000 a semester in regular programmes and INR 14,800 in self-supporting programmes in 2025-26, the latest published schedule. Other fees bring the semester total to about INR 15,200 or INR 25,000. Foreign nationals pay USD 7,500 a year for CSE, ECE, IT, VLSI and AI and Data Science, and USD 3,750 for other branches (2026-27)." },
    { question: "Does Anna University admit international students?", answer: "Yes, Anna University (AU) admits foreign nationals and citizens of Least Developed Countries and Small Island Developing States to 5 per cent supernumerary seats each in every B.E./B.Tech./B.Plan. branch at CEG, ACT, MIT, SAP and BIT Campus, and to 5 per cent of seats in its Chennai M.E./M.Tech., MBA, MCA and M.Sc. programmes. Apply at cfa.annauniv.edu/cfa; a valid student visa, PIO or OCI card is needed at admission." },
    { question: "Which entrance exam does Anna University use?", answer: "Anna University (AU) fills Indian B.E./B.Tech. seats through TNEA on Class 12 marks, with no entrance test. M.E./M.Tech./M.Arch./M.Plan. use CEETA-PG (10 May 2026) or GATE, MBA and MCA use TANCET (9 May 2026), and the two-year M.Sc. uses Anna University's own entrance examination (7 June 2026). Foreign nationals are ranked on qualifying-exam marks." },
    { question: "What is the fee for foreign students at Anna University?", answer: "Anna University (AU)'s 2026-27 fee for foreign nationals is USD 7,500 a year for B.E./B.Tech. CSE, ECE, IT and VLSI at CEG and CSE, ECE, IT and AI and Data Science at MIT, and USD 3,750 for other UG branches. All M.E./M.Tech./M.Arch./M.Plan., MBA, MCA and two-year M.Sc. programmes cost USD 2,000 a year, and the five-year M.Sc. USD 5,000. Applicants pay a USD 400 processing fee plus GST." },
    { question: "Which colleges are part of Anna University?", answer: "Anna University (AU)'s own campuses are CEG, ACT and SAP at Guindy and MIT at Chromepet, the regional campuses at Coimbatore, Madurai and Tirunelveli, and 13 University Colleges of Engineering, including BIT Campus Tiruchirappalli and University V.O.C. College of Engineering, Thoothukudi. Hundreds of affiliated private colleges also award Anna University degrees, but they are separate institutions with their own fees." },
    { question: "Does Anna University have hostels?", answer: "Yes, Anna University (AU) has hostels at its Chennai campuses, with vegetarian and non-vegetarian messes. CEG charged UG entrants INR 42,625 at first-year entry in 2025-26, and CEAP 2026 lists INR 45,684 a year at CEG and ACT plus mess of about INR 3,000 a month, and INR 77,200 a year at MIT. Separate international hostels (Flora for men, Lavender for women) house foreign students." },
    { question: "How do I apply for M.E. or M.Tech. at Anna University?", answer: "Indian graduates apply to Anna University (AU) by taking CEETA-PG 2026 (or using GATE) and joining CEAP single-window counselling, which in 2026 listed 31 programmes at CEG, 12 at ACT, 4 at SAP, 12 at MIT and 5 at BIT Campus. CEAP 2026 lists yearly tuition of INR 50,400 (regular) or INR 75,400 (self-supporting) at CEG. Foreign nationals apply through cfa.annauniv.edu/cfa." },
  ],
  researchSources: Object.entries(S).map(([k, [label, url]]) => ({ label, url, kind: k === "ugc" ? "recognition" : /^fee|mitPg|msc5fee/.test(k) ? "official-fee" : /^tnea|mbamca/.test(k) ? "government" : /^fn|nri|adv|ugList|msc|ceap|cal/.test(k) ? "official-program" : "official-university", checkedAt: CHECKED })),
  admissionsContent: {
    contentState: "research_ready",
    scope: "This record covers Anna University's University Departments in Chennai (CEG, ACT and SAP at Guindy; MIT at Chromepet), its regional campuses at Coimbatore, Madurai and Tirunelveli, and its 13 University Colleges of Engineering. Colleges affiliated to Anna University are separate institutions and are not part of this record.",
    sectionStates: { decisionSummary: "published", eligibility: "published", fees: "published", admissions: "published", academics: "research_ready", recognition: "published", studentLiving: "published", scholarships: "published", funding: "absent", placements: "published" },
    internationalRoutes: [
      { route: "Foreign nationals and LDC/SIDS citizens", programmes: "B.E./B.Tech./B.Plan. (Chennai campuses and BIT Campus), M.E./M.Tech./M.Arch./M.Plan., MBA, MCA and M.Sc. (Chennai)", applyAt: "https://cfa.annauniv.edu/cfa/", feeSummary: "USD 3,750-7,500 a year (UG), USD 2,000 (PG), USD 5,000 (5-year M.Sc.), 2026-27" },
      { route: "NRI and CIWGC", programmes: "Same programmes, separate supernumerary quotas", applyAt: "https://cfa.annauniv.edu/cfa/" },
    ],
    ctas: [
      { trigger: "eligibility", label: "Check my Anna University eligibility", capture: ["nationality, NRI status or Tamil Nadu nativity", "Class 12 or degree marks and entrance score", "intended programme and campus"] },
      { trigger: "fees", label: "Estimate my Anna University fees", capture: ["intended programme and campus", "TNEA, CEETA-PG, TANCET or foreign-national route", "hostel needs"] },
      { trigger: "application", label: "Plan my Anna University application", capture: ["target intake year", "programme shortlist", "document readiness"] },
    ],
  },
  programmes,
};

const payload = { countries: [], courses, universities: [U], evidence };
writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
const g = programmes.filter((p) => p.audienceEligibility.availability === "global").length;
console.log(`programmes ${programmes.length} (global ${g}, restricted ${programmes.length - g}); courses ${courses.length}; evidence ${evidence.length}`);
