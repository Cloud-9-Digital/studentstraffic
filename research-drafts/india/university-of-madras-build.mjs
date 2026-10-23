// Build script for University of Madras (content migration 0150-india-university-of-madras).
// Writes the programme inventory (research/india-programme-inventory/university-of-madras.csv)
// and the migration payload from compact, source-backed data. Run from the repo root:
//   node research-drafts/india/university-of-madras-build.mjs
// Research notes: research-drafts/india/university-of-madras.md
import { readFileSync, writeFileSync } from "node:fs";

const SLUG = "university-of-madras";
const MIGRATION = "0150-india-university-of-madras";
const CHECKED = "2026-10-23";
const REVIEW = "2027-04-23";
const AY = "2026-27";

const SRC = {
  site: "https://www.unom.ac.in/",
  prospectus: "https://egovernance.unom.ac.in/CBCS2627/download/Prospectus.pdf",
  bsc: "https://egovernance.unom.ac.in/CBCS2627/download/BScBlendedProspectus.pdf",
  portal: "https://egovernance.unom.ac.in/CBCS2627/",
  entrance: "https://egovernance.unom.ac.in/CBCS2627/AdmissionPGMPHIL/FrmsyllabNew.aspx",
  icom: "https://egovernance.unom.ac.in/ICOM2627/FrmInsructUCIR.aspx",
  nirf: "https://egovernance.unom.ac.in/nirf/upload/2026/NIRF_2026.pdf",
  ugc: "https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf",
  mbamca: "https://static.tn-mbamca.com/docs/TNMBAMCA-ENGINEERING-COLLEGES-BOOKLET-2026.pdf",
};
const NAME = "University of Madras";
const SHORT = "University of Madras (Madras University)";

// ---------------------------------------------------------------------------
// Inventory: every University Department programme in the 2026-27 prospectus.
// campus by department (prospectus pp. 17-18, schools table)
const campusOf = (dept) => {
  const marina = ["Islamic Studies", "Tamil Language", "Tamil Literature", "Telugu", "Malayalam", "Kannada", "Sanskrit", "Hindi", "Arabic, Persian and Urdu", "Saiva Siddhanta"];
  const guindy = ["Computer Science", "Network Systems and Information Technology", "Geography", "Geology", "Applied Geology", "Analytical Chemistry", "Inorganic Chemistry", "Organic Chemistry", "Physical Chemistry", "Energy", "Polymer Science", "CAS in Crystallography and Biophysics", "Nuclear Physics", "Theoretical Physics", "Materials Science", "CAS in Botany", "Zoology", "Biochemistry", "Biotechnology", "National Centre for Nanoscience and Nanotechnology"];
  const taramani = ["Anatomy", "Medical Biochemistry", "Genetics", "Microbiology", "Physiology", "Pathology", "National Centre for Ultrafast Processes"];
  if (dept === "Physical Education and Sports") return "Chetpet";
  if (marina.includes(dept)) return "Marina";
  if (guindy.includes(dept)) return "Guindy";
  if (taramani.includes(dept)) return "Taramani";
  return "Chepauk";
};
// Saiva Siddhanta sits in the School of Philosophy and Religious Thought; the prospectus places
// Islamic Studies at Marina and lists the rest of that school at Chepauk.
const campusFix = { "Saiva Siddhanta": "Chepauk" };

const MEDIUM_HOLD = "Held: teaching language not published in any official source reachable on 2026-10-23 (www.unom.ac.in timed out; the 2026-27 prospectus and admission portal do not state a medium of instruction).";
// [title, department, years, canonical, extra note]
const masters = [
  ["M.A. Ancient History and Archaeology (Regular and Self-Supportive)", "Ancient History and Archaeology", 2, "ma-history", ""],
  ["M.A. Historical Studies", "Indian History", 2, "ma-history", ""],
  ["M.A. Anthropology", "Anthropology", 2, "ma-anthropology", ""],
  ["M.Sc. Criminology and Criminal Justice Science", "Criminology", 2, "GAP:master-criminology", ""],
  ["M.Sc. Cyber Forensics and Information Security (Regular and Self-Supportive)", "Centre for Cyber Forensics and Information Security", 2, "msc-cyber-security", ""],
  ["M.Ed. (Two Year) (Regular and Self-Supportive)", "Education", 2, "med-education", "Also held: NCTE recognition not verified (ncte.gov.in unreachable 2026-10-23)."],
  ["M.A. Lifelong Learning", "Adult and Continuing Education", 2, "GAP:master-adult-continuing-education", ""],
  ["M.A. Human Resource Management (Regular and Self-Supportive)", "Adult and Continuing Education", 2, "GAP:master-human-resource-management", ""],
  ["M.A. Sociology", "Sociology", 2, "ma-sociology", ""],
  ["M.A. Women's Studies", "Women Studies", 2, "GAP:master-gender-studies", ""],
  ["M.S.W. Social Work (Self-Supportive)", "Social Work", 2, "master-social-work", ""],
  ["M.A. Defence and Strategic Studies (Regular and Self-Supportive)", "Defence and Strategic Studies", 2, "GAP:master-defence-strategic-studies", ""],
  ["M.A. Public Administration (English medium)", "Politics and Public Administration", 2, "master-public-administration", "PACKAGED"],
  ["M.A. Political Science", "Politics and Public Administration", 2, "master-political-science", ""],
  ["M.A. International Relations", "Politics and Public Administration", 2, "master-international-relations", ""],
  ["M.A. Public Administration (Tamil medium)", "Politics and Public Administration", 2, "master-public-administration", "Held: taught in Tamil (prospectus 'TM'; entrance list 'TAMIL MEDIUM') and lib/catalogue-facets.ts has no 'tamil' instruction-language code."],
  ["M.A. Public Policy", "Anna Centre for Public Affairs", 2, "master-public-policy", ""],
  ["M.A. Development Administration", "Anna Centre for Public Affairs", 2, "master-public-administration", ""],
  ["M.A. Economics", "Economics", 2, "master-economics", ""],
  ["M.A. Econometrics", "Econometrics", 2, "master-economics", ""],
  ["M.A. Indian Philosophy", "Philosophy", 2, "ma-philosophy", ""],
  ["M.A. Buddhism", "Philosophy", 2, "ma-religious-studies", ""],
  ["M.A. Yoga: Theory and Practice (Self-Supportive)", "Philosophy", 2, "GAP:master-yoga-studies", ""],
  ["M.A. Journalism and Mass Communication", "Journalism and Communication", 2, "master-journalism", ""],
  ["M.A. Comparative Religion and Philosophy with Specialization in Saiva Siddhanta Studies", "Saiva Siddhanta", 2, "ma-religious-studies", ""],
  ["M.A. Saiva Siddhanta - Philosophy and Practices", "Saiva Siddhanta", 2, "ma-religious-studies", ""],
  ["M.A. Vaishnavism", "Vaishnavism", 2, "ma-religious-studies", ""],
  ["M.A. Comparative Religion and Philosophy with Specialization in Christian Studies", "Christian Studies", 2, "ma-religious-studies", ""],
  ["M.A. Christian Scriptures", "Christian Studies", 2, "ma-religious-studies", ""],
  ["M.A. Jaina Studies", "Jainology", 2, "ma-religious-studies", ""],
  ["M.A. Islamic Studies", "Islamic Studies", 2, "ma-religious-studies", ""],
  ["M.A. English (Regular and Self-Supportive)", "English", 2, "ma-english-literature", ""],
  ["M.A. French", "French and other Foreign Languages", 2, "ma-languages-linguistics", ""],
  ["M.A. Hindi", "Hindi", 2, "ma-languages-linguistics", ""],
  ["M.A. Kannada", "Kannada", 2, "ma-languages-linguistics", "Also: no 'kannada' instruction-language code in lib/catalogue-facets.ts."],
  ["M.A. Malayalam", "Malayalam", 2, "ma-languages-linguistics", "Also: no 'malayalam' instruction-language code in lib/catalogue-facets.ts."],
  ["M.A. Tamil Literature and Culture", "Tamil Literature", 2, "ma-languages-linguistics", "Also: no 'tamil' instruction-language code in lib/catalogue-facets.ts."],
  ["M.A. Tamil Studies", "Tamil Language", 2, "ma-languages-linguistics", "Also: no 'tamil' instruction-language code in lib/catalogue-facets.ts."],
  ["M.A. Telugu", "Telugu", 2, "ma-languages-linguistics", ""],
  ["M.A. Arabic", "Arabic, Persian and Urdu", 2, "ma-languages-linguistics", ""],
  ["M.A. Urdu", "Arabic, Persian and Urdu", 2, "ma-languages-linguistics", ""],
  ["M.A. Indian Music", "Indian Music", 2, "GAP:master-music", ""],
  ["M.A. Bharathanatyam (Self-Supportive)", "Indian Music", 2, "GAP:master-dance", ""],
  ["M.A. Sanskrit", "Sanskrit", 2, "ma-languages-linguistics", ""],
  ["LL.M. Constitutional Law and Legal Order (Regular and Self-Supportive)", "Legal Studies", 2, "llm", "Also held: BCI recognised-universities list not retrievable (barcouncilofindia.org list is a JavaScript application whose data could not be read on 2026-10-23)."],
  ["M.Com. International Business and Finance", "Commerce", 2, "mcom", ""],
  ["M.Com. Business Data Science (Self-Supportive)", "Commerce", 2, "mcom", ""],
  ["M.B.A. (Regular and Self-Supportive)", "Management Studies", 2, "mba", "Admission through TANCET and DoTE single-window counselling (college code 710: MBA 45 aided + 50 self-supporting seats, TN MBA/MCA 2026-27 booklet)."],
  ["Executive M.B.A. (Self-Supportive, weekend)", "Management Studies", 2, "mba", "For executives with 2 years' work experience; weekend classes."],
  ["M.Lib.I.Sc. Library and Information Science", "Library and Information Science", 2, "master-library-information-science", ""],
  ["M.Sc. HRD Psychology (Regular and Self-Supportive)", "Psychology", 2, "master-psychology", ""],
  ["M.Sc. Counselling Psychology (Regular and Self-Supportive)", "Counselling Psychology", 2, "master-psychology", ""],
  ["M.Sc. Mathematics (Regular and Self-Supportive)", "RIAS in Mathematics", 2, "msc-mathematics", ""],
  ["M.Sc. Statistics", "Statistics", 2, "msc-statistics", ""],
  ["M.Sc. Actuarial Science (Self-Supportive)", "Statistics", 2, "msc-actuarial-science", ""],
  ["M.C.A. (Two years)", "Computer Science", 2, "mca", "Admission through TANCET and DoTE single-window counselling (college code 710: 30 aided seats, TN MBA/MCA 2026-27 booklet)."],
  ["M.Sc. Computer Science (Self-Supportive)", "Computer Science", 2, "msc-computer-science", ""],
  ["M.Sc. Applied Geography", "Geography", 2, "master-geography", ""],
  ["M.Tech. Geoinformatics", "Geography", 2, "GAP:me-mtech-geoinformatics", ""],
  ["M.Sc. Geology (Regular and Self-Supportive)", "Geology", 2, "msc-earth-geological-sciences", ""],
  ["M.Sc. Applied Geology (Regular and Self-Supportive)", "Applied Geology", 2, "msc-earth-geological-sciences", ""],
  ["M.Sc. Analytical Chemistry", "Analytical Chemistry", 2, "msc-chemistry", ""],
  ["M.Sc. Inorganic Chemistry", "Inorganic Chemistry", 2, "msc-chemistry", ""],
  ["M.Sc. Organic Chemistry", "Organic Chemistry", 2, "msc-chemistry", ""],
  ["M.Sc. Physical Chemistry", "Physical Chemistry", 2, "msc-chemistry", ""],
  ["M.Sc. Chemistry (Polymer Chemistry)", "Polymer Science", 2, "msc-chemistry", ""],
  ["M.Sc. Materials Science", "Materials Science", 2, "GAP:msc-materials-science", ""],
  ["M.Sc. Information Technology (Self-Supportive)", "Network Systems and Information Technology", 2, "msc-computer-science", ""],
  ["M.Sc. Energy and Materials Science", "Energy", 2, "GAP:msc-materials-science", ""],
  ["M.Sc. Biophysics", "CAS in Crystallography and Biophysics", 2, "msc-biological-sciences", ""],
  ["M.Sc. Molecular and Structural Biology", "CAS in Crystallography and Biophysics", 2, "msc-biological-sciences", ""],
  ["M.Sc. Physics (Nuclear Physics)", "Nuclear Physics", 2, "msc-physics", ""],
  ["M.Sc. Physics (Theoretical Physics)", "Theoretical Physics", 2, "msc-physics", ""],
  ["M.Sc. Biochemistry (Regular and Self-Supportive)", "Biochemistry", 2, "msc-biological-sciences", ""],
  ["M.Sc. Biotechnology (Regular and Self-Supportive)", "Biotechnology", 2, "msc-biotechnology", ""],
  ["M.Sc. Botany", "CAS in Botany", 2, "msc-biological-sciences", ""],
  ["M.Sc. Zoology", "Zoology", 2, "msc-biological-sciences", ""],
  ["M.Sc. Medical Biochemistry (Regular and Self-Supportive)", "Medical Biochemistry", 2, "msc-biological-sciences", ""],
  ["M.Sc. Biomedical Genetics", "Genetics", 2, "msc-biological-sciences", ""],
  ["M.Sc. Medical Microbiology (Three years) (Regular and Self-Supportive)", "Microbiology", 3, "msc-biological-sciences", ""],
  ["M.Sc. Anatomy (Three years)", "Anatomy", 3, "msc-biological-sciences", ""],
  ["M.Sc. Neuroscience (Self-Supportive)", "Anatomy", 2, "msc-biological-sciences", ""],
  ["M.Sc. Physiology (Three years)", "Physiology", 3, "msc-biological-sciences", ""],
  ["M.Sc. Photonics and Bio-Photonics", "National Centre for Ultrafast Processes", 2, "msc-physics", ""],
  ["M.Sc. Nanoscience and Nanotechnology (Regular and Self-Supportive)", "National Centre for Nanoscience and Nanotechnology", 2, "GAP:msc-materials-science", ""],
  ["M.Sc. Yoga", "Physical Education and Sports", 2, "GAP:master-yoga-studies", ""],
];
const pgDiplomas = [
  ["Parent Counselling (for School Principals and Teachers)", "Education"], ["Technical Writing", "English"],
  ["Christian Spirituality and Counselling", "Christian Studies"], ["Biblical Languages and Interpretation", "Christian Studies"],
  ["Ethics and Human Resource Management (Self-Supportive)", "Philosophy"], ["Saiva Siddhanta", "Saiva Siddhanta"],
  ["Periya Puranam Studies", "Saiva Siddhanta"], ["Manuscriptology and Editing", "Tamil Literature"],
  ["Folkloristics and Mass Media", "Tamil Literature"], ["Inscription and Culture", "Tamil Literature"],
  ["Linguistics", "Tamil Literature"], ["Developmental Disabilities (Self-Supportive)", "Counselling Psychology"],
  ["Taxonomy of Algae", "CAS in Botany"], ["Taxonomy of Fungi", "CAS in Botany"],
  ["Molecular Cell Biology and Stem Cell Technology", "Zoology"], ["Immunotechnology", "Zoology"],
  ["Clinical Embryology (Self-Supportive)", "Zoology"], ["Functional Hindi and Translation (Part-time, 2 years)", "Hindi"],
  ["Digital Library Management", "Library and Information Science"], ["Yoga Theory, Practice and Therapy", "Philosophy"],
  ["Peace and Communal Harmony", "Philosophy"], ["Extension and Development Administration", "Adult and Continuing Education"],
  ["Banking and Finance (Self-Supportive)", "Commerce"], ["Yogic Education", "Physical Education and Sports"],
  ["Geospatial Data Analytics (Self-Supportive)", "Geography"], ["Archaeology (1 year)", "Ancient History and Archaeology"],
  ["Christian Approaches to Family Care and Counselling (Self-Supportive, Part-time)", "Christian Studies"],
  ["Divyaprabandam", "Vaishnavism"], ["Archives Management (1 year)", "Ancient History and Archaeology"],
];
const diplomas = [
  ["Telugu", "Telugu"], ["Kannada", "Kannada"], ["French (Self-Supportive)", "French and other Foreign Languages"],
  ["German (Self-Supportive)", "French and other Foreign Languages"], ["Italian (Self-Supportive)", "French and other Foreign Languages"],
  ["Spanish (Self-Supportive)", "French and other Foreign Languages"], ["Cybercrime and Information Security", "Criminology"],
  ["Malayalam", "Malayalam"], ["Arabic", "Arabic, Persian and Urdu"], ["Urdu", "Arabic, Persian and Urdu"],
  ["Travel and Tourism Management (Self-Supportive)", "Adult and Continuing Education"], ["Buddhist Studies", "Jainology"],
  ["Jaina Temple Management", "Jainology"], ["Internal Audit", "Commerce"], ["Business Research Analytics", "Commerce"],
  ["Teaching Methodology - Abhinaya and Nattuvangam (Self-Supportive)", "Indian Music"],
  ["Teaching Methodology in Music (Self-Supportive)", "Indian Music"], ["Learning Disabilities (Self-Supportive)", "Counselling Psychology"],
  ["Autism Spectrum Disorder (Self-Supportive)", "Counselling Psychology"], ["Advanced Diploma in Cellular and Molecular Pathology Techniques", "Pathology"],
  ["Saiva Siddhanta", "Saiva Siddhanta"], ["Digital Accounting and GST Filing", "Commerce"], ["Global Trade Management", "Commerce"],
  ["Bible and Christian Doctrines (Self-Supportive, Part-time)", "Christian Studies"],
  ["Geoscientific Methods for Sustainable Resource Planning and Management (Self-Supportive)", "Geology"],
];
const certificates = [
  ["French (Self-Supportive)", "French and other Foreign Languages"], ["German (Self-Supportive)", "French and other Foreign Languages"],
  ["Italian (Self-Supportive)", "French and other Foreign Languages"], ["Spanish (Self-Supportive)", "French and other Foreign Languages"],
  ["Malayalam", "Malayalam"], ["Arabic", "Arabic, Persian and Urdu"], ["Urdu", "Arabic, Persian and Urdu"],
  ["Yoga (Part-time)", "Sanskrit"], ["Kannada", "Kannada"], ["Telugu", "Telugu"],
  ["Blogging (Self-Supportive)", "Adult and Continuing Education"], ["Pre-Primary Education (Self-Supportive)", "Adult and Continuing Education"],
  ["NGO Management (Self-Supportive)", "Adult and Continuing Education"], ["Hospitality Management (Self-Supportive)", "Adult and Continuing Education"],
  ["Buddhist Studies", "Jainology"], ["Jainology", "Jainology"], ["Christian Scriptures and Interpretation", "Christian Studies"],
  ["Christian Communication and Media Education (Self-Supportive)", "Christian Studies"],
  ["Christian Scriptures, Spiritual Practices and Ethics (Self-Supportive)", "Christian Studies"],
  ["Classical Analysis and Basic Analytical Instrumentation Techniques", "Analytical Chemistry"],
  ["Karnatic Music (Self-Supportive)", "Indian Music"], ["Voice Training (Self-Supportive)", "Indian Music"],
  ["Saiva Siddhanta", "Saiva Siddhanta"], ["Council - Vatican II Studies (Self-Supportive, Part-time)", "Christian Studies"],
];

function inventoryRows() {
  const rows = [];
  const intlUrl = SRC.prospectus;
  const base = (title, level, discipline, duration, campus, intl, canonical, notes, official = SRC.prospectus, other = `${SRC.entrance} ; ${SRC.icom}`) =>
    rows.push({ university_slug: SLUG, programme_official_title: title, level, discipline, duration, campus, delivery_mode: "on-campus full-time", intl_status: intl, intl_evidence_url: intl === "unknown" ? "" : intlUrl, official_source_url: official, other_sources: other, already_on_site: "no", existing_offering_slug: "", canonical_course_match: canonical, notes });
  // UG
  base("B.Sc. (Blended) Science Programme - Physics / Chemistry / Mathematics, offered jointly with the University of Melbourne", "bachelors", "general-sciences", "3 years", "Guindy", "open_to_international", "bsc-general-sciences",
    "Packaged as unom-bsc-blended-science. Prospectus item 6: foreign nationals including NRIs considered via ICOM and exempt from the entrance test. English stated ('Core international curriculum delivered in English').", SRC.bsc, SRC.portal);
  for (const major of ["Physics", "Chemistry", "Mathematics"]) {
    base(`B.Sc. (Blended) ${major} - third-year major`, "bachelors", major.toLowerCase(), "year 3 of 3", "Guindy", "major_within", "bsc-general-sciences",
      "major_within: chosen in the third year inside the packaged B.Sc. (Blended) Science programme.", SRC.bsc, SRC.portal);
  }
  for (const [title, dept, years, canonical, extra] of masters) {
    const campus = campusFix[dept] ?? campusOf(dept);
    const packaged = extra === "PACKAGED";
    const notes = packaged
      ? "Packaged as unom-ma-public-administration. English medium identified by the prospectus fee list 'Public Administration (TM & EM)' and the separate 'M.A. - Public Administration (TAMIL MEDIUM)' entrance row. 15% supernumerary seats for foreign nationals including NRIs (prospectus item 11)."
      : [`Department of ${dept}.`, MEDIUM_HOLD, extra, canonical.startsWith("GAP:") ? "Taxonomy GAP left unresolved because the programme is held for teaching language." : ""].filter(Boolean).join(" ");
    base(title, "masters", dept.toLowerCase().replace(/[^a-z]+/g, "-"), `${years} years`, campus, "open_to_international", canonical, notes);
  }
  base("LL.M. International Law and Organisation", "masters", "legal-studies", "2 years", "Chepauk", "unknown", "llm",
    "Held: appears only in the 2026-27 tuition fee lists, not in the list of Master's courses or the 2026 entrance schedule; current admission not confirmed. BCI list also not verified.");
  const scopeNote = "Not packaged: the University Department inventory exceeds 150 offerings, so per the Tamil Nadu brief only UG and PG degrees are packaged. Prospectus publishes Indian and foreign-national fees for this level.";
  for (const [t, d] of pgDiplomas) base(`P.G. Diploma in ${t}`, "postgraduate-diploma", d.toLowerCase().replace(/[^a-z]+/g, "-"), "1 year", campusFix[d] ?? campusOf(d), "open_to_international", "", `Department of ${d}. ${scopeNote}`);
  for (const [t, d] of diplomas) base(t.startsWith("Advanced") ? t : `Diploma in ${t}`, "diploma", d.toLowerCase().replace(/[^a-z]+/g, "-"), "1 year", campusFix[d] ?? campusOf(d), "open_to_international", "", `Department of ${d}. ${scopeNote}`);
  for (const [t, d] of certificates) base(`Certificate in ${t}`, "certificate", d.toLowerCase().replace(/[^a-z]+/g, "-"), "6 months", campusFix[d] ?? campusOf(d), "open_to_international", "", `Department of ${d}. ${scopeNote}`);
  base("Ph.D. (University Departments and approved research institutions)", "doctorate", "research", "3-6 years", "All campuses", "unknown", "",
    "Inventory only (Ph.D. areas are never packaged). NIRF 2026 data: 1,653 full-time and 646 part-time Ph.D. scholars to 2024-25.", SRC.nirf, "https://egovernance.unom.ac.in/phd/FrmIndex.aspx");
  base("Distance and online programmes (Institute of Distance Education / Centre for Distance and Online Education)", "various", "distance-education", "varies", "Chepauk (IDE)", "unknown", "",
    "Out of scope: distance/online delivery; only regular on-campus programmes are packaged. Prospectus confirms the Institute of Distance Education exists; its catalogue (ideunom.ac.in) was unreachable on 2026-10-23.", SRC.prospectus, "");
  base("University of Madras Arts and Science College (University Constituent College)", "bachelors", "arts-science", "3 years", "not confirmed", "unknown", "",
    "Excluded: constituent status not confirmed on an official source. unom.ac.in, tndce.tn.gov.in and tn.gov.in were unreachable on 2026-10-23; the 2026-27 prospectus lists only University Departments and NIRF 2026 data reports PG intake only (no UG). Scope note asks to confirm it was not transferred to Government (Tamil Nadu converted university constituent colleges to Government Arts and Science Colleges from 2019-20).", SRC.prospectus, SRC.nirf);
  base("University of Madras Engineering and Medical College (University Constituent College)", "bachelors", "engineering-medicine", "unknown", "not confirmed", "unknown", "",
    "Excluded: no official source found for this institution; the 2026-27 prospectus, the egovernance portal and NIRF 2026 data list no engineering or medical college of the University. unom.ac.in unreachable on 2026-10-23.", SRC.prospectus, SRC.nirf);
  return rows;
}

const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
function writeInventory() {
  const rows = inventoryRows();
  const cols = ["university_slug", "programme_official_title", "level", "discipline", "duration", "campus", "delivery_mode", "intl_status", "intl_evidence_url", "official_source_url", "other_sources", "already_on_site", "existing_offering_slug", "canonical_course_match", "notes"];
  const out = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n";
  writeFileSync(`research/india-programme-inventory/${SLUG}.csv`, out);
  const count = (f) => rows.filter(f).length;
  console.log(`inventory rows ${rows.length}; packaged ${count((r) => r.notes.startsWith("Packaged"))}; masters ${count((r) => r.level === "masters")}; pgdip ${count((r) => r.level === "postgraduate-diploma")}; diploma ${count((r) => r.level === "diploma")}; cert ${count((r) => r.level === "certificate")}; major_within ${count((r) => r.intl_status === "major_within")}`);
}

// ---------------------------------------------------------------------------
// Payload
const ev = (entity, publicField, claimText, sourceLabel, sourceUrl, extra = {}) => ({
  entity, ...(entity === "university" ? { universitySlug: SLUG } : {}), ...extra,
  publicField, claimText, status: "verified", sourceLabel, sourceUrl, sourceGrade: "A", checkedAt: CHECKED, reviewBy: REVIEW,
});
const uev = (field, claim, label, url, notes) => ev("university", field, claim, label, url, notes ? { internalNotes: notes } : {});
const pev = (prog, field, claim, label, url, notes) => ev("programme", field, claim, label, url, { universitySlug: SLUG, programmeSlug: prog, ...(notes ? { internalNotes: notes } : {}) });
const L = {
  prospectus: "University of Madras - Prospectus 2026-2027, Admissions for University Departments under CBCS",
  bsc: "University of Madras - Prospectus 2026-2027, U.G. B.Sc. (Blended) Science Programme with the University of Melbourne",
  entrance: "University of Madras - Entrance, Interview and Syllabus Details 2026-27 (admission portal)",
  icom: "University of Madras - ICOM application for foreign nationals and NRIs 2026-27",
  portal: "University of Madras - University Departments Admissions 2026-2027 portal (important dates)",
  nirf: "University of Madras - NIRF 2026 data submitted (Overall, IR-O-U-0462)",
  ugc: "UGC - Consolidated list of universities (as on 25.01.2023)",
  mbamca: "DoTE Tamil Nadu - MBA/MCA Admissions 2026-27 college booklet",
};

const PA = "unom-ma-public-administration";
const BSC = "unom-bsc-blended-science";

const programmes = [
  {
    slug: PA,
    canonicalCourseSlug: "master-public-administration",
    officialTitle: "M.A. Public Administration (English medium), Department of Politics and Public Administration, University of Madras",
    durationYears: 2,
    fee: {
      status: "confirmed", audience: "domestic", academicYear: AY, officialFeeCurrency: "INR",
      officialAnnualTuitionAmount: 1650, officialTotalTuitionAmount: 3300, verifiedAt: CHECKED,
      notes: "University of Madras 2026-27 prospectus, regular Humanities and Social Sciences fee table (Public Administration TM and EM): tuition INR 1,650 a year for Indian students. With registration, library, soft skills, computer laboratory, internet, insurance and other charges the total is INR 6,101 in year 1 (including a refundable INR 770 caution deposit) and INR 4,761 in year 2. Examination fees are extra (INR 100 per theory paper).",
    },
    additionalFees: [{
      audience: "international", currency: "INR", annualAmount: 40000, totalAmount: 80000, academicYear: AY, verifiedAt: CHECKED,
      notes: "Foreign nationals (including NRIs and PIO card holders) pay tuition of INR 40,000 a year; the prospectus totals are INR 87,500 in year 1 (including a refundable INR 7,000 deposit and an INR 12,500 eligibility fee for applicants with a foreign first degree) and INR 58,500 in year 2. SAARC nationals get 40% off tuition; Sri Lankan Tamil and Tibetan refugee students pay Indian fees. Add US$200 repatriation deposit and medical insurance.",
    }],
    officialProgramUrl: SRC.prospectus,
    audienceEligibility: {
      availability: "global",
      eligibleAudiences: [
        "Indian graduates admitted on merit and an entrance test through the University Departments' online application",
        "Foreign nationals, NRIs and refugees through the International Centre of Madras University (ICOM) on supernumerary seats",
      ],
      restrictions: [
        "Foreign nationals and NRIs need a valid passport and an Indian student visa, and admission is subject to Government of India conditions; they are exempt from the entrance test.",
        "Indian candidates from states other than Tamil Nadu (except SC/ST) are considered under General Turn only; seats follow Tamil Nadu reservation rules.",
      ],
      notes: "The prospectus sets 15% supernumerary seats in every PG programme for foreign nationals including NRIs, plus two seats for students from Jammu and Kashmir.",
      verifiedAt: CHECKED,
      sourceUrl: SRC.prospectus,
    },
    admissionsContent: {
      overview: "The M.A. Public Administration at the University of Madras (Madras University) is a two-year, four-semester English-medium degree of 91 credits taught by the Department of Politics and Public Administration at the Chepauk campus in Chennai. Admission for 2026-27 combined the qualifying degree mark and a department entrance test; a separate Tamil-medium M.A. Public Administration is also offered.",
      eligibility: {
        intro: "The University of Madras 2026-27 prospectus sets this qualification for the M.A. Public Administration.",
        items: [
          "A pass in B.A. Public Administration or B.A. Political Science, or any other degree recognised by the University of Madras",
          "Graduates of other universities obtain a University of Madras eligibility certificate before admission",
          "Foreign nationals and NRIs apply through ICOM and are exempt from the entrance test",
        ],
      },
      applicationSteps: [
        "Pay the INR 354 application cost (including INR 54 GST) online through SBI Collect; Tamil Nadu SC/ST/SCA/SCC candidates get one free application",
        "Fill in the online application on the University Departments admission portal; the 2026-27 window ran from 25 April to 1 June 2026",
        "Email the printed application and self-attested certificates to the Department of Politics and Public Administration and post the hard copy to the Head of the Department at Chepauk",
        "Sit the department entrance test and interview; the 2026 test was held on 16 June 2026 at 10:15 am",
        "If listed provisionally, pay the fees online within 7 days and produce original certificates at the department before classes start",
      ],
      documentsRequired: {
        academic: ["SSLC (Class 10) and HSC (Class 12) certificates", "Degree or provisional certificate and statement of marks", "Transfer certificate", "University of Madras eligibility certificate for graduates of other universities"],
        application: ["Printed online application form", "SBI Collect receipt for the application cost", "Aadhaar card", "Community certificate and proof of any concession claimed, where applicable"],
      },
      deadlinesNote: "For 2026-27 the online application closed on 1 June 2026 and the entrance test was held on 16 June 2026. The University has not announced 2027-28 dates.",
      visaConsiderations: ["Foreign applicants send the printed application to the Director, ICOM, University of Madras, Chepauk, Chennai 600 005, and are admitted subject to Government of India clearance and a student visa."],
    },
    medium: "English",
    mediumNote: "The 2026-27 prospectus fee list names Public Administration in two media, TM (Tamil) and EM (English); this offering is the English-medium M.A., listed separately from the Tamil-medium one.",
    instructionLanguages: ["english"],
    intakeMonths: ["July - odd semester normally runs July to November; 2026-27 applications closed on 1 June 2026"],
    intakeCodes: ["july"],
    feeVerifiedAt: CHECKED,
    feeNotes: "University of Madras 2026-27 prospectus: Indian students pay tuition of INR 1,650 a year; total fees are INR 6,101 in year 1 and INR 4,761 in year 2. Foreign nationals pay tuition of INR 40,000 a year, with totals of INR 87,500 and INR 58,500. Tamil Nadu SC/ST/SCA/SCC students in government universities are exempt from tuition; one admitted student per programme with family income below INR 3,00,000 receives a full fee waiver under the Madras University Free Education Scheme.",
    teachingPhases: [{ phase: "Years 1-2 (4 semesters, 91 credits)", language: "English", details: "Choice Based Credit System at the Chepauk campus: core and elective courses, 8 compulsory soft-skills credits, and a 4-8 week internship after the first year arranged through the department." }],
  },
  {
    slug: BSC,
    canonicalCourseSlug: "bsc-general-sciences",
    officialTitle: "U.G. B.Sc. (Blended) Physics / Chemistry / Mathematics Science Programme, offered jointly with the University of Melbourne, University of Madras",
    durationYears: 3,
    fee: {
      status: "confirmed", audience: "all", academicYear: AY, officialFeeCurrency: "INR",
      officialAnnualTuitionAmount: 20000, officialTotalTuitionAmount: 60000, verifiedAt: CHECKED,
      notes: "University of Madras B.Sc. (Blended) 2026-27 prospectus, single fee table for all admitted students: tuition INR 20,000 a year. With laboratory (INR 17,500), special laboratory and computer (INR 4,000 each), soft skills, internet and other charges the total is INR 49,531 in year 1 (including a refundable INR 700 caution deposit) and INR 48,326 in each of years 2 and 3. Foreign students also pay a US$200 repatriation deposit and take medical insurance.",
    },
    officialProgramUrl: SRC.bsc,
    audienceEligibility: {
      availability: "global",
      eligibleAudiences: [
        "Class 12 (State Board or CBSE) graduates with Physics, Chemistry and Mathematics",
        "Foreign nationals, NRIs and refugees through the International Centre of Madras University (ICOM)",
      ],
      restrictions: [
        "Foreign nationals and NRIs need a valid passport and an Indian student visa, and admission is subject to Government of India conditions; they are exempt from the entrance test.",
        "Candidates must have cleared Class 11 and 12 with no arrears; selection follows Tamil Nadu reservation rules, and candidates from other states (except SC/ST) compete under General Turn only.",
      ],
      notes: "Seats are limited; the prospectus does not publish the number.",
      verifiedAt: CHECKED,
      sourceUrl: SRC.bsc,
    },
    admissionsContent: {
      overview: "The B.Sc. (Blended) Science Programme at the University of Madras (Madras University) is a three-year, 143-credit degree run with the University of Melbourne at the Guindy campus. Years 1 and 2 integrate mathematics, physics, chemistry and biology; in year 3 students major in Physics, Chemistry or Mathematics. Selection weighs the Class 12 mark and an entrance test equally.",
      eligibility: {
        intro: "The 2026-27 B.Sc. (Blended) prospectus sets these entry conditions.",
        items: [
          "A pass in Class 12 (State Board or CBSE) with Physics, Chemistry and Mathematics",
          "All Class 11 and Class 12 papers cleared, with no arrears",
          "Candidates who studied in other states obtain a University of Madras eligibility certificate",
          "Foreign nationals and NRIs apply through ICOM and are exempt from the entrance test",
        ],
      },
      applicationSteps: [
        "Pay the INR 354 application cost (including INR 54 GST) online through SBI Collect",
        "Apply online on the University Departments admission portal; the 2026-27 window ran from 4 May to 19 June 2026",
        "Email the printed application to blendedunom@gmail.com and post it with self-attested certificates to the Course Co-ordinator, Department of Theoretical Physics, Guindy Campus, Chennai 600 025",
        "Sit the entrance test at the Department of Theoretical Physics; ranking is 50% Class 12 marks and 50% entrance score",
        "If selected, pay the fees online within 7 days and submit original certificates before classes start",
      ],
      documentsRequired: {
        academic: ["Class 10 and Class 12 mark statements", "SSLC and HSC certificates", "Transfer certificate", "Migration certificate"],
        application: ["Printed online application form", "SBI Collect receipt for the application cost", "Community certificate where claimed"],
      },
      deadlinesNote: "For 2026-27 applications closed on 19 June 2026 and the entrance test ran from 29 June to 3 July 2026. The University has not announced 2027-28 dates.",
      visaConsiderations: ["Foreign applicants send the application to the Director, ICOM, University of Madras, Chepauk, Chennai 600 005, and pay a US$200 repatriation deposit and take medical insurance after admission."],
    },
    medium: "English",
    mediumNote: "The prospectus states that the core international curriculum is delivered in English; University of Madras faculty teach and University of Melbourne faculty give invited lectures online.",
    instructionLanguages: ["english"],
    intakeMonths: ["July - odd semester normally runs July to November; 2026-27 entrance test 29 June to 3 July 2026"],
    intakeCodes: ["july"],
    feeVerifiedAt: CHECKED,
    feeNotes: "University of Madras B.Sc. (Blended) 2026-27 prospectus: tuition INR 20,000 a year; total fees INR 49,531 in year 1 and INR 48,326 in each of years 2 and 3, about INR 1,46,183 over three years. The prospectus prints one fee table for all students and no separate foreign-national rate; foreign students add a US$200 repatriation deposit and medical insurance. Examination fees are INR 350 per theory and INR 500 per practical paper.",
    teachingPhases: [
      { phase: "Years 1-2", language: "English", details: "Common integrated curriculum in mathematics, physics, chemistry and biology with six practical classes in each of physics, chemistry and biology, a computation subject each year and an IELTS-based English subject." },
      { phase: "Year 3", language: "English", details: "Major in Physics, Chemistry or Mathematics, with a two-semester research project and an ePortfolio; final exams count 50% and are benchmarked against University of Melbourne students." },
    ],
  },
];

function programmeEvidence() {
  const e = [];
  // M.A. Public Administration
  e.push(pev(PA, "eligibility", "Prospectus 2026-27, List of Masters Degree Courses, item 13: M.A. Public Administration (Politics and Public Administration) - a pass in the B.A. Public Administration / Political Science or any other degree recognized by the University of Madras. Item 14 of the instructions: graduates of other universities obtain an Eligibility Certificate.", L.prospectus, SRC.prospectus));
  e.push(pev(PA, "eligibility", "Prospectus 2026-27 instructions 9-11: foreign nationals including NRIs with valid passports and visas, and refugees, are considered subject to Government conditions; they are exempt from the entrance examination; 15 percent supernumerary seats in all PG programmes for foreign nationals including NRIs. Item 18: candidates from other states (except SC/ST) are considered under General Turn only.", L.prospectus, SRC.prospectus));
  e.push(pev(PA, "admissions", "Prospectus 2026-27: online application at INR 354 (incl. INR 54 GST) via SB Collect; printed form emailed and posted to the Head of Department with certificates by 01.06.2026; admission on qualifying-exam marks and, for multi-stream programmes, 50% entrance; provisional list; fees within 7 days. Entrance list 2026-27: 'M.A. - Public Administration' entrance 16/06/2026 10:15-11:15 AM, interview from 11:30 AM; separate row 'M.A. - Public Administration (TAMIL MEDIUM)'.", L.entrance, SRC.entrance, `Prospectus: ${SRC.prospectus}`));
  e.push(pev(PA, "intake", "Prospectus 2026-27: online registration 25.04.2026 to 01.06.2026 for P.G. courses; CBCS odd semester (I and III) normally between July and November, even semester December to April; P.G. course (2 years) 91 credits.", L.prospectus, SRC.prospectus, `Portal important dates: ${SRC.portal}`));
  e.push(pev(PA, "fee", "Prospectus 2026-27, Humanities, Social Sciences, Languages (Regular) fee table covering Public Administration (TM & EM): Indian students tuition 1650 per annum, total 6101 (I year) and 4761 (II year); foreign nationals tuition 40,000 per annum, total 87,500 (I year) and 58,500 (II year), including eligibility fee 12,500 for foreign UG degrees and caution deposit 7,000. SAARC 40% tuition concession; Sri Lankan Tamil and Tibetan refugee students pay Indian fees; US$200 repatriation fee.", L.prospectus, SRC.prospectus));
  e.push(pev(PA, "medium", "Prospectus 2026-27 fee table lists 'Public Administration (TM & EM)' and the masters list has separate entries 'M.A. Public Administration' (item 13) and 'M.A. Public Administration (TM)' (item 16); the 2026-27 entrance list names the latter 'M.A. - Public Administration (TAMIL MEDIUM)'. EM read as English medium.", L.prospectus, SRC.prospectus, `Entrance list: ${SRC.entrance}`));
  e.push(pev(PA, "teachingPhases", "Prospectus 2026-27: CBCS since 2001-02; P.G. course (2 years) 91 credits; soft skills 8 credits mandatory for two-year master's; internship of 4-6 weeks (2 credits) or 6-8 weeks (3 credits) in the summer after year 1. Department of Politics and Public Administration in the School of Political and International Studies, Chepauk.", L.prospectus, SRC.prospectus));
  // B.Sc. Blended
  e.push(pev(BSC, "eligibility", "B.Sc. (Blended) prospectus 2026-27: candidates who passed Plus Two (State Board or CBSE) with Physics, Chemistry and Mathematics; no arrears in Plus One and Plus Two; other-state candidates obtain an eligibility certificate; foreign nationals including NRIs considered subject to Government conditions and exempt from the entrance examination.", L.bsc, SRC.bsc));
  e.push(pev(BSC, "admissions", "B.Sc. (Blended) prospectus 2026-27: online application INR 354 via SB Collect; printed form emailed to blendedunom@gmail.com and posted to the Overall Course Co-ordinator, Department of Theoretical Physics, Guindy Campus, by 19.06.2026; selection 50% Plus Two marks and 50% entrance examination; provisional list on the website; fees within 7 days; regular mode at Guindy Campus; jointly offered with the University of Melbourne.", L.bsc, SRC.bsc));
  e.push(pev(BSC, "intake", "B.Sc. (Blended) prospectus 2026-27: application 04.05.2026 to 19.06.2026; entrance examination 29.06.2026 to 03.07.2026; odd semesters (I, III, V) normally July to November; 143 credits over 3 years.", L.bsc, SRC.bsc, `Portal important dates: ${SRC.portal}`));
  e.push(pev(BSC, "fee", "B.Sc. (Blended) prospectus 2026-27 tuition fee structure (Rupees): tuition 20,000 per annum; laboratory 17,500; special laboratory chemicals 4,000; special computer laboratory 4,000; total 49,531 (I year), 48,326 (II and III year). Foreign students: medical insurance and US$200 repatriation fee.", L.bsc, SRC.bsc, "Single table with no Indian/foreign split, so fee.audience = all."));
  e.push(pev(BSC, "medium", "B.Sc. (Blended) prospectus 2026-27, Benefit to Students: 'Core international curriculum delivered in English'; Professors of the University of Madras handle the classes and University of Melbourne professors deliver invited lectures virtually.", L.bsc, SRC.bsc));
  e.push(pev(BSC, "teachingPhases", "B.Sc. (Blended) prospectus 2026-27: years 1 and 2 common curriculum in Maths, Physics, Chemistry and Biology with six practical classes in each of Physics, Chemistry and Biology, one computation subject each year and one IELTS-based English subject; year 3 major (Physics, Chemistry or Mathematics) with a two-semester research project; final exams 150 minutes counting 50%; benchmarked against University of Melbourne students.", L.bsc, SRC.bsc));
  return e;
}

const university = {
  countrySlug: "india",
  slug: SLUG,
  name: NAME,
  city: "Chennai",
  type: "Public",
  establishedYear: 1857,
  officialWebsite: SRC.site,
  mediaAttribution: {},
  summary: "The University of Madras (Madras University) is a Tamil Nadu state university founded on 5 September 1857 by an Act of the Legislative Council of India. Its main campus is at Chepauk, Chennai, with five more campuses in the city. It awards its own degrees and teaches master's, diploma and doctoral programmes in 87 departments grouped into 18 schools, plus a B.Sc. with the University of Melbourne.",
  campusLifestyle: "The University of Madras (Madras University) has six Chennai campuses: Chepauk (Senate House, the main library and most humanities departments), Marina (oriental and Indian languages), Guindy (most science departments), Taramani (Institute of Basic Medical Sciences), Chetpet (Madras University Union sports ground with athletic track and tennis courts) and Maduravoyal (botanical garden). The Chepauk library opens 8 am to 8 pm daily and every campus has an internet centre.",
  cityProfile: "The University of Madras (Madras University) is in Chennai, the capital of Tamil Nadu. Its main campus and Senate House are at Chepauk (PIN 600 005), on Kamarajar Salai facing the Marina; DoTE lists Chennai Central railway station 2 km away. The Marina campus is also at Chepauk, the Guindy campus is at Guindy (600 025), the Taramani campus at Taramani (600 113) and the Chetpet campus on Spur Tank Road (600 031). Applications for foreign students go to the International Centre of Madras University (ICOM) at Chepauk.",
  practicalExposure: "The University of Madras (Madras University) requires a 4-6 week (2 credits) or 6-8 week (3 credits) internship in an organisation recommended by the department, in the summer after the first year of a master's degree, and 8 soft-skills credits for a two-year master's. The University Students' Advisory Bureau runs placement services, the INFORMEX careers exhibition and coaching for UPSC, TNPSC, SSC and UGC NET. In the University's NIRF 2026 data, 516 of 1,359 two-year PG graduates of 2024-25 were placed at a median salary of INR 5,95,000 and 318 went on to higher studies. An 'Earn While You Learn' scheme employs PG students as part-time laboratory and library assistants.",
  hostelOverview: "The University of Madras (Madras University) offers limited hostel places to needy and deserving students: Mother Theresa Hostel for Women (Chepauk), Thiruvalluvar Hostel for Men (Marina), Bharathiar Hostel for Men and Avvai Hostel for Women (Guindy), and Bharathidasan Hostel for Men and Dr. Muthulakshmi Reddy Hostel for Women (Taramani). The Tamil Nadu MBA/MCA 2026-27 booklet lists room rent of INR 2,460 a year, mess charges of INR 30,000 a year and a deposit of INR 7,000.",
  dietarySupport: "The University of Madras (Madras University) hostels run messes at INR 30,000 a year, according to the Tamil Nadu MBA/MCA 2026-27 booklet. The University publishes no menu or provision for specific regional or religious diets, so ask the hostel warden before joining.",
  safetyOverview: "The University of Madras (Madras University) prohibits ragging on all campuses and deals with offenders through the University authorities. A Sexual Harassment Complaints and Redressal Committee receives complaints from women students and staff, and all University Department students are covered by a compulsory student safety insurance scheme.",
  studentSupport: "The University of Madras (Madras University) runs the University Students' Advisory Bureau for counselling and careers, an SC/ST cell, NSS and NCC, and ICOM for international students. Fee concessions include full waivers for students with disabilities and one waiver per PG programme for a student with family income below INR 3,00,000.",
  whyChoose: [
    "The University of Madras (Madras University), founded in 1857, teaches in 87 departments across 18 schools on six Chennai campuses and awards its own degrees.",
    "Regular University of Madras fees are low: the M.A. Public Administration charges Indian students INR 1,650 tuition a year, with total fees of INR 6,101 in year 1 (2026-27).",
    "The University of Madras B.Sc. (Blended) Science programme, run with the University of Melbourne at Guindy, is taught in English and benchmarked against Melbourne assessments.",
  ],
  thingsToConsider: [
    "University of Madras PG applications for 2026-27 closed on 1 June 2026, and each application must also be emailed and posted to the department with certificates.",
    "Foreign nationals and NRIs at the University of Madras pay separate INR fees: M.A. tuition is INR 40,000 a year against INR 1,650 for Indian students, plus an INR 12,500 eligibility fee for a foreign first degree and a US$200 repatriation deposit.",
    "University of Madras hostel places are limited to needy and deserving students, and admission for foreign students also depends on Government of India clearance and a student visa.",
  ],
  bestFitFor: [
    "Indian graduates in Political Science or Public Administration who want a low-fee, English-medium M.A. at the University of Madras Chepauk campus.",
    "Class 12 Physics, Chemistry and Mathematics students who want an English-taught science degree designed with the University of Melbourne.",
    "Foreign nationals and NRIs seeking a University of Madras PG seat without an entrance test, through ICOM's 15% supernumerary seats.",
  ],
  industryPartners: [],
  recognitionBadges: [
    "UGC - State University listed in the UGC consolidated list of universities (University of Madras, Chepauk, Chennai, established 1857)",
    "DoTE Tamil Nadu - MBA/MCA Admissions 2026-27 participating University Department, counselling code 710",
  ],
  recognitionLinks: [
    { label: "UGC - Consolidated list of all universities", url: SRC.ugc },
    { label: "DoTE Tamil Nadu - MBA/MCA Admissions 2026-27 information about the colleges", url: SRC.mbamca },
  ],
  faq: [
    { question: "Is the University of Madras UGC approved?", answer: "Yes, the University of Madras (Madras University) is a state university on the University Grants Commission's consolidated list of universities, listed at Chepauk, Chennai with 1857 as its year of establishment. It was incorporated on 5 September 1857 by an Act of the Legislative Council of India and is governed by the Madras University Act of 1923." },
    { question: "Does the University of Madras admit international students?", answer: "Yes, the University of Madras (Madras University) admits foreign nationals, NRIs and refugees through its International Centre of Madras University (ICOM). Every PG programme has 15% supernumerary seats for foreign nationals including NRIs, and they are exempt from the entrance test. Admission needs a valid passport and an Indian student visa and is subject to Government of India clearance." },
    { question: "What is the fee for M.A. at the University of Madras?", answer: "At the University of Madras (Madras University), regular M.A. programmes in humanities and social sciences charge Indian students INR 1,650 tuition a year in 2026-27, with total fees of INR 6,101 in year 1 and INR 4,761 in year 2. Foreign nationals pay INR 40,000 tuition a year, with totals of INR 87,500 and INR 58,500. Self-supportive programmes cost more." },
    { question: "How do I apply for PG admission at the University of Madras?", answer: "Apply online on the University of Madras (Madras University) admission portal, paying INR 354 per programme through SBI Collect, then email and post the printed form with certificates to the department. For 2026-27 the window ran from 25 April to 1 June 2026. Foreign applicants send their application to the Director, ICOM, Chepauk, Chennai 600 005." },
    { question: "Which entrance exam does the University of Madras use?", answer: "The University of Madras (Madras University) ranks most PG applicants on their qualifying degree marks; programmes open to several degree streams weigh the degree 50% and a department entrance test 50%. In 2026 these tests ran between 8 and 18 June. MBA and MCA seats are filled through TANCET and the Tamil Nadu DoTE single-window counselling, college code 710." },
    { question: "What is the University of Madras B.Sc. Blended programme with the University of Melbourne?", answer: "The B.Sc. (Blended) at the University of Madras (Madras University) is a three-year, English-taught science degree run with the University of Melbourne at the Guindy campus. Students study mathematics, physics, chemistry and biology together for two years and major in Physics, Chemistry or Mathematics in year 3. Fees in 2026-27 are INR 49,531 in year 1 and INR 48,326 a year after that." },
    { question: "Does the University of Madras have hostels?", answer: "Yes, the University of Madras (Madras University) runs six hostels on its Chepauk, Marina, Guindy and Taramani campuses, but places are limited to needy and deserving students. The Tamil Nadu MBA/MCA 2026-27 booklet lists room rent of INR 2,460 a year, mess charges of INR 30,000 a year and a deposit of INR 7,000." },
    { question: "How many campuses does the University of Madras have?", answer: "The University of Madras (Madras University) has six campuses in Chennai: Chepauk (main campus and Senate House), Marina, Guindy, Taramani, Chetpet and Maduravoyal. Most humanities and social science departments are at Chepauk, language departments at Marina, science departments at Guindy and basic medical sciences at Taramani." },
  ],
  researchSources: [
    { label: L.prospectus, url: SRC.prospectus, kind: "official-program", checkedAt: CHECKED },
    { label: L.bsc, url: SRC.bsc, kind: "official-program", checkedAt: CHECKED },
    { label: L.portal, url: SRC.portal, kind: "official-university", checkedAt: CHECKED },
    { label: L.entrance, url: SRC.entrance, kind: "official-program", checkedAt: CHECKED },
    { label: L.icom, url: SRC.icom, kind: "official-university", checkedAt: CHECKED },
    { label: L.nirf, url: SRC.nirf, kind: "official-university", checkedAt: CHECKED },
    { label: L.ugc, url: SRC.ugc, kind: "recognition", checkedAt: CHECKED },
    { label: L.mbamca, url: SRC.mbamca, kind: "government", checkedAt: CHECKED },
    { label: "University of Madras - Official website", url: SRC.site, kind: "official-university", checkedAt: CHECKED, notes: "Timed out from the research environment on 2026-10-23 (web.unom.ac.in, 218.248.44.203); all University documents were taken from egovernance.unom.ac.in." },
  ],
  admissionsContent: {
    contentState: "research_ready",
    scope: "This record covers the University of Madras University Departments on its Chepauk, Marina, Guindy, Taramani, Chetpet and Maduravoyal campuses, including the Department of Legal Studies. Affiliated colleges, the Institute of Distance Education and Ph.D. study are outside this record. The two University Constituent College rows in the UGC sheet could not be confirmed on an official source and are excluded.",
    sectionStates: {
      decisionSummary: "published", eligibility: "published", fees: "published", admissions: "published", academics: "research_ready",
      recognition: "published", studentLiving: "published", scholarships: "published", funding: "absent", placements: "published",
    },
    ctas: [
      { trigger: "eligibility", label: "Check my University of Madras eligibility", capture: ["nationality, NRI or refugee status", "qualifying degree or Class 12 subjects and marks", "community category", "intended programme"] },
      { trigger: "fees", label: "Estimate my University of Madras fees", capture: ["intended programme and regular or self-supportive stream", "Indian, SAARC or other foreign-national fee category", "hostel needs"] },
      { trigger: "application", label: "Plan my University of Madras application", capture: ["intended programmes", "entrance-test readiness", "document readiness"] },
    ],
  },
  programmes,
};

function universityEvidence() {
  return [
    uev("identity", "UGC consolidated list (as on 25.01.2023), Tamil Nadu, entry 834: 'University of Madras, Chepauk, Chennai-600 005, Tamil Nadu. 1857 (State University).'", L.ugc, SRC.ugc),
    uev("establishedYear", "Prospectus 2026-27 profile: incorporated on 5th September 1857 by an Act of the Legislative Council of India; governed by the Madras University Act of 1923; entering its 169th year in 2026-27.", L.prospectus, SRC.prospectus),
    uev("summary", "Prospectus 2026-27: 18 Schools and 87 Departments of post-graduate teaching and research; six campuses (Chepauk, Marina, Guindy, Taramani, Chetpet, Maduravoyal), main campus at Chepauk; programmes are Master's, PG Diploma, Diploma and Certificate plus Ph.D.; B.Sc. (Blended) prospectus: UG programme jointly offered with the University of Melbourne at Guindy.", L.prospectus, SRC.prospectus, `B.Sc. prospectus: ${SRC.bsc}`),
    uev("recognitionBadges", "UGC consolidated list (as on 25.01.2023) lists University of Madras, Chepauk, Chennai, 1857, State University.", L.ugc, SRC.ugc),
    uev("recognitionBadges", "TN MBA/MCA Admissions 2026-27 college booklet (DoTE and DCE): code 710, University of Madras, Chepauk, Chennai 600005; category University Department; MBA 45 (Aided, 1955), MBA 50 (Self-Supporting, 2004), MCA 30 (Aided, 1987).", L.mbamca, SRC.mbamca, "NAAC A++ (CGPA 3.59, valid 21-08-2023 to 20-08-2030) is stated in the prospectus and NIRF 2026 data but could not be checked on naac.gov.in (unreachable 2026-10-23), so no NAAC badge. NIRF 2025 University rank 38 / Overall 68 is stated in the prospectus; nirfindia.org returned 403, so no NIRF badge."),
    uev("campusLifestyle", "Prospectus 2026-27: Senate House, Library with Clock Tower at Chepauk; most science departments at Guindy; Taramani houses the Dr. A. Lakshmanaswamy Mudaliar PG Institute of Basic Medical Sciences; oriental and Indian languages departments at Marina; University Union sports pavilion at Chetpet (pavilion, athletic track, volleyball, basketball, badminton, two tennis courts); Botanical Garden at Maduravoyal; Chepauk library 8 am to 8 pm on all days; internet centres in all campuses.", L.prospectus, SRC.prospectus),
    uev("cityProfile", "Prospectus 2026-27 department addresses: Chepauk 600 005, Marina (Chepauk) 600 005, Guindy 600 025, Taramani 600 113, Chetpet 600 031; ICOM at Chepauk. TN MBA/MCA 2026-27 booklet: nearest railway station Chennai Central, 2 km.", L.prospectus, SRC.prospectus, `MBA/MCA booklet: ${SRC.mbamca}`),
    uev("practicalExposure", "Prospectus 2026-27: internship 4-6 weeks (2 credits) or 6-8 weeks (3 credits) in the summer after year 1; soft skills 8 credits for two-year master's; USAB placement services, INFORMEX, coaching for UPSC, TNPSC, SSC, UGC NET; Earn While You Learn scheme.", L.prospectus, SRC.prospectus),
    uev("practicalExposure", "NIRF 2026 data submitted by the University: PG 2-year, 2023-24 intake 1771, admitted 1602; 1359 graduating in 2024-25; 516 placed; median salary 595000; 318 selected for higher studies.", L.nirf, SRC.nirf),
    uev("hostelOverview", "Prospectus 2026-27 hostels: Mother Theresa Hostel for Women (Chepauk), Thiruvalluvar Hostel for Men (Marina), Bharathiar Hostel for Men and Avvai Hostel for Women (Guindy), Bharathidasan Hostel for Men and Dr. Muthulakshmi Reddy Hostel for Women (Taramani); limited accommodation for needy and deserving students.", L.prospectus, SRC.prospectus),
    uev("hostelOverview", "TN MBA/MCA 2026-27 booklet, code 710 University of Madras: hostel facility yes (boys and girls), deposit 7000 per annum, room rent 2460 per annum, electricity 0, mess charges 30000 per annum.", L.mbamca, SRC.mbamca),
    uev("dietarySupport", "TN MBA/MCA 2026-27 booklet, code 710: mess charges INR 30,000 per annum. No menu or diet policy found in the prospectus.", L.mbamca, SRC.mbamca),
    uev("safetyOverview", "Prospectus 2026-27: ragging strictly prohibited; Sexual Harassment Complaints and Redressal Committee formed per Supreme Court direction; compulsory Students Safety Insurance Scheme for University Department students.", L.prospectus, SRC.prospectus),
    uev("studentSupport", "Prospectus 2026-27: student support services include USAB, SC/ST Cell, NSS and NCC, scholarships; ICOM processes foreign students' applications; full fee concession for differently abled PG students; MUFES full fee waiver for one student per PG programme with parental income below Rs.3,00,000.", L.prospectus, SRC.prospectus),
    uev("whyChoose", "Prospectus 2026-27: 87 departments, 18 schools, six campuses; Humanities regular fee table: tuition 1650, total 6101 (I year) for Indian students; B.Sc. (Blended) prospectus: jointly offered with the University of Melbourne, delivered in English, benchmarked against University of Melbourne students.", L.prospectus, SRC.prospectus),
    uev("thingsToConsider", "Prospectus 2026-27: last date 01.06.2026; printed application emailed and posted; foreign-national tuition 40,000 vs Indian 1,650; eligibility fee 12,500 for foreign UG degrees; US$200 repatriation fee; hostels limited to needy and deserving students; PG admission of foreign students subject to clearance by the Ministry and production of a student visa.", L.prospectus, SRC.prospectus),
    uev("bestFitFor", "Prospectus 2026-27: M.A. Public Administration eligibility B.A. Public Administration / Political Science; 15% supernumerary seats for foreign nationals including NRIs, entrance exempt. B.Sc. (Blended) prospectus: Plus Two with Physics, Chemistry and Mathematics.", L.prospectus, SRC.prospectus),
    uev("faq", "Prospectus 2026-27 and B.Sc. (Blended) prospectus 2026-27: application cost INR 354; PG window 25.04.2026-01.06.2026; 50% degree + 50% entrance for multi-stream programmes; MBA/MCA via DoTE single window; ICOM address; fee tables. Entrance list 2026-27: entrance tests dated 08/06/2026 to 18/06/2026.", L.prospectus, SRC.prospectus, `Entrance list: ${SRC.entrance}; B.Sc.: ${SRC.bsc}`),
  ];
}

// course records: copy existing records byte-identical where a bundle ships them
function courseRecords() {
  const p0141 = JSON.parse(readFileSync("content-migrations/0141-india-manipal-university-jaipur-fee-audience/payload.json", "utf8"));
  const bsc = p0141.courses.find((c) => c.slug === "bsc-general-sciences");
  if (!bsc) throw new Error("bsc-general-sciences record not found in 0141");
  const mpa = {
    slug: "master-public-administration",
    name: "Master of Public Administration",
    shortName: "MPA",
    stream: "public-policy-international-relations",
    level: "masters",
    discipline: "public-administration",
    aliases: ["M.P.A.", "Master in Public Administration", "M.A. Public Administration"],
    displayOrder: 1,
    durationYears: 2,
    summary: "Master of Public Administration is the Students Traffic catalogue category for postgraduate degrees in the management of government and public institutions, awarded as an MPA or as an M.A. in Public Administration. Programmes usually cover administrative theory, public policy, public finance and budgeting, comparative and local government, human resource management in the public sector and research methods, often with an internship or dissertation. Most run one to two years and lead to careers in civil services, local government, international organisations and non-profit management.",
    metaTitle: "Master of Public Administration (MPA) Programmes",
    metaDescription: "Compare Master of Public Administration (MPA) and M.A. Public Administration programmes by duration, curriculum, teaching language, tuition and admission route.",
  };
  return [bsc, mpa];
}

writeInventory();
const payload = {
  countries: [],
  courses: courseRecords(),
  universities: [university],
  evidence: [...universityEvidence(), ...programmeEvidence()],
};
writeFileSync(`content-migrations/${MIGRATION}/payload.json`, JSON.stringify(payload, null, 2) + "\n");
console.log(`payload: ${programmes.length} programmes, ${payload.evidence.length} evidence records`);
