// Inventory builder for Sathyabama Institute of Science and Technology (ledger status: held).
// The university is held before packaging (no published 2026-27 intake/class-start date and no
// public tuition fee), so this script writes only the programme inventory:
//   research/india-programme-inventory/sathyabama-institute-of-science-and-technology.csv
// Run from the repo root: node research-drafts/india/sathyabama-institute-of-science-and-technology-build.mjs
// Research notes: research/india-programme-inventory/sathyabama-institute-of-science-and-technology.md
import { writeFileSync } from "node:fs";

const SLUG = "sathyabama-institute-of-science-and-technology";
const SRC = {
  ug: "https://www.sathyabama.ac.in/admissions/under-graduate",
  pg: "https://www.sathyabama.ac.in/admissions/post-graduate",
  spdUg: "https://www.sathyabama.ac.in/campuses/admissions/under-graduate",
  spdPg: "https://www.sathyabama.ac.in/campuses/admissions/post-graduate",
  intl: "https://www.sathyabama.ac.in/International_Student_Admissions",
  prospectus: "https://sist.sathyabama.ac.in/website/download/2026%20-%20PROSPECTUS%20-%20SATHYABAMA%20-%2011.02.2026.pdf",
};
const CHN = "Chennai (Jeppiaar Nagar, Sholinganallur)";
const SPD = "Sriperumbudur (Vadamangalam) off-campus";

const UNIVERSITY_HOLD =
  "University held 2026-10-23: no published 2026-27 class-start/intake date (academic calendar page reads 'Will be updated soon'; regulations give exam windows only) and no public tuition fee (fees only inside the fee-portal login).";

// [title, level, discipline, years, canonical, regulatorHold]
const chennaiUg = [
  ["B.E. Computer Science and Engineering", "bachelor", "Engineering", 4, "be-btech-computer-science-engineering"],
  ["B.E. Computer Science and Engineering with specialization in Artificial Intelligence", "bachelor", "Engineering", 4, "be-btech-computer-science-engineering"],
  ["B.E. Computer Science and Engineering with specialization in Data Science", "bachelor", "Engineering", 4, "be-btech-data-science"],
  ["B.E. Computer Science and Engineering with specialization in Internet of Things", "bachelor", "Engineering", 4, "be-btech-computer-science-engineering"],
  ["B.E. Computer Science and Engineering with specialization in Artificial Intelligence and Robotics", "bachelor", "Engineering", 4, "be-btech-computer-science-engineering"],
  ["B.E. Computer Science and Engineering with specialization in Artificial Intelligence and Machine Learning", "bachelor", "Engineering", 4, "be-btech-artificial-intelligence-machine-learning"],
  ["B.E. Computer Science and Engineering with specialization in Cyber Security", "bachelor", "Engineering", 4, "be-btech-cyber-security"],
  ["B.Tech. Artificial Intelligence and Data Science", "bachelor", "Engineering", 4, "be-btech-data-science"],
  ["B.E. Computer Science and Business Systems", "bachelor", "Engineering", 4, "GAP:be-btech-computer-science-business-systems"],
  ["B.E. Electrical and Electronics Engineering", "bachelor", "Engineering", 4, "be-btech-electrical-electronics-engineering"],
  ["B.E. Electronics and Communication Engineering", "bachelor", "Engineering", 4, "be-btech-electronics-communication-engineering"],
  ["B.E. Electronics and Communication Engineering with Specialization in Data Science", "bachelor", "Engineering", 4, "be-btech-electronics-communication-engineering"],
  ["B.E. Mechanical Engineering", "bachelor", "Engineering", 4, "be-btech-mechanical-engineering"],
  ["B.E. Aeronautical Engineering", "bachelor", "Engineering", 4, "be-btech-aerospace-engineering"],
  ["B.E. Mechatronics", "bachelor", "Engineering", 4, "be-btech-mechatronics-engineering"],
  ["B.E. Civil Engineering", "bachelor", "Engineering", 4, "be-btech-civil-engineering"],
  ["B.Tech. Information Technology", "bachelor", "Engineering", 4, "be-btech-information-technology"],
  ["B.Tech. Chemical Engineering", "bachelor", "Engineering", 4, "be-btech-chemical-engineering"],
  ["B.Tech. Biotechnology", "bachelor", "Engineering", 4, "be-btech-biotechnology"],
  ["B.Tech. Biomedical Engineering", "bachelor", "Engineering", 4, "be-btech-biomedical-engineering"],
  ["B.Des. Design (Interior Design)", "bachelor", "Design", 4, "bdes"],
  ["B.Arch. Bachelor of Architecture", "bachelor", "Architecture", 5, "barch", "COA list not verifiable: coa.gov.in failed TLS at the egress proxy on 2026-10-23 (two attempts). University page states 'Approved by Council of Architecture'."],
  ["B.Pharm. Bachelor of Pharmacy", "bachelor", "Pharmacy", 4, "bpharm", "PCI list not verifiable: pci.gov.in failed TLS and pci.nic.in reset the connection on 2026-10-23 (two attempts each)."],
  ["B.Sc. Nursing", "bachelor", "Nursing", 4, "bsc-nursing"],
  ["B.P.T. Bachelor of Physiotherapy", "bachelor", "Allied Health", 5, "bpt"],
  ["Bachelor of Nutrition and Dietetics (Honours)", "bachelor", "Allied Health", 4, "bachelor-nutrition-dietetics"],
  ["B.MLS Bachelor of Medical Laboratory Science", "bachelor", "Allied Health", 4, "bsc-medical-laboratory-science"],
  ["B.Psy Bachelor of Psychology", "bachelor", "Psychology", 4, "bachelor-psychology"],
  ["B.D.S. Bachelor of Dental Surgery (Sathyabama Dental College and Hospital)", "bachelor", "Dentistry", 5, "bds"],
  ["B.A. LL.B. (Hons.)", "bachelor", "Law", 5, "llb"],
  ["B.B.A. LL.B. (Hons.)", "bachelor", "Law", 5, "llb"],
  ["B.Com. LL.B. (Hons.)", "bachelor", "Law", 5, "llb"],
  ["LL.B.", "bachelor", "Law", 3, "llb"],
  ["B.B.A. Bachelor of Business Administration", "bachelor", "Management", 3, "bba"],
  ["B.Com. Bachelor of Commerce", "bachelor", "Commerce", 3, "bcom"],
  ["B.Com. Financial Accounting", "bachelor", "Commerce", 3, "bcom"],
  ["B.Sc. Visual Communication", "bachelor", "Media", 3, "bachelor-media-communication"],
  ["B.Sc. Physics", "bachelor", "Science", 3, "bsc-physics"],
  ["B.Sc. Chemistry", "bachelor", "Science", 3, "bsc-chemistry"],
  ["B.Sc. Computer Science", "bachelor", "Computing", 3, "bsc-computer-science"],
  ["B.Sc. Mathematics", "bachelor", "Science", 3, "bsc-mathematics"],
  ["B.Sc. Biochemistry", "bachelor", "Science", 3, "GAP:bsc-biochemistry"],
  ["B.Sc. Fashion Design", "bachelor", "Design", 3, "bachelor-fashion-design"],
  ["B.Sc. Biotechnology", "bachelor", "Science", 3, "bsc-biotechnology"],
  ["B.Sc. Microbiology", "bachelor", "Science", 3, "GAP:bsc-microbiology"],
  ["B.A. English", "bachelor", "Humanities", 3, "ba-english-literature"],
  ["B.Sc. Bioinformatics and Data Science", "bachelor", "Science", 3, "GAP:bsc-bioinformatics"],
  ["B.Sc. Computer Science with specialization in Artificial Intelligence", "bachelor", "Computing", 3, "bsc-computer-science"],
  ["B.Sc. Data Science", "bachelor", "Computing", 3, "GAP:bsc-data-science"],
  ["B.Sc. Information Technology", "bachelor", "Computing", 3, "GAP:bsc-information-technology"],
  ["B.C.A. Bachelor of Computer Applications", "bachelor", "Computing", 3, "bca"],
  ["M.Sc. Computer Science (Integrated)", "master", "Computing", 5, "msc-computer-science"],
  ["B.S.W. Bachelor of Social Work", "bachelor", "Social Work", 3, "bachelor-social-work"],
  ["B.Sc. Forensic Science", "bachelor", "Science", 3, "bsc-forensic-science"],
  ["B.Sc. B.Ed.", "bachelor", "Education", 4, "bed", "NCTE recognition not verifiable: ncte.gov.in failed TLS at the egress proxy on 2026-10-23."],
  ["B.A. B.Ed.", "bachelor", "Education", 4, "bed", "NCTE recognition not verifiable: ncte.gov.in failed TLS at the egress proxy on 2026-10-23."],
];

const chennaiPg = [
  ["M.E. Computer Science and Engineering", "master", "Engineering", 2, "me-mtech-computer-science-engineering"],
  ["M.E. Applied Electronics", "master", "Engineering", 2, "me-mtech-electronics-communication-engineering"],
  ["M.E. Computer Aided Design", "master", "Engineering", 2, "me-mtech-mechanical-engineering"],
  ["M.E. Structural Engineering", "master", "Engineering", 2, "me-mtech-civil-engineering"],
  ["M.E. Power Electronics and Industrial Drives", "master", "Engineering", 2, "me-mtech-electrical-engineering"],
  ["M.Tech. Biotechnology", "master", "Engineering", 2, "me-mtech-biotechnology"],
  ["M.Tech. Medical Instrumentation", "master", "Engineering", 2, "me-mtech-biomedical-engineering"],
  ["M.E. Embedded Systems and IoT", "master", "Engineering", 2, "me-mtech-electronics-communication-engineering"],
  ["M.Arch. Sustainable Architecture", "master", "Architecture", 2, "march", "COA list not verifiable (coa.gov.in TLS failure at egress, 2026-10-23)."],
  ["M.Arch. Building Management", "master", "Architecture", 2, "march", "COA list not verifiable (coa.gov.in TLS failure at egress, 2026-10-23)."],
  ["M.B.A. Master of Business Administration", "master", "Management", 2, "mba"],
  ["M.Pharm. Pharmaceutics", "master", "Pharmacy", 2, "mpharm", "PCI list not verifiable (pci.gov.in TLS failure; pci.nic.in connection reset, 2026-10-23)."],
  ["Pharm.D. Doctor of Pharmacy", "doctorate", "Pharmacy", 6, "GAP:pharmd", "PCI list not verifiable (pci.gov.in TLS failure; pci.nic.in connection reset, 2026-10-23)."],
  ["M.D.S. Paedodontics and Preventive Dentistry", "master", "Dentistry", 3, "GAP:mds-paediatric-preventive-dentistry", "DCI Schedule Part I (dciindia.gov.in/Download/SchedulePart_I.pdf, entry 116) lists only BDS for Sathyabama University Dental College and Hospital; no MDS qualification is listed. MDS is open only to Indian nationals, PIO and OCI holders via NEET-MDS."],
  ["M.D.S. Conservative Dentistry and Endodontics", "master", "Dentistry", 3, "GAP:mds-conservative-dentistry-endodontics", "DCI Schedule Part I entry 116 lists only BDS; no MDS qualification is listed."],
  ["M.D.S. Orthodontics and Dentofacial Orthopaedics", "master", "Dentistry", 3, "GAP:mds-orthodontics", "DCI Schedule Part I entry 116 lists only BDS; no MDS qualification is listed."],
  ["M.A. English", "master", "Humanities", 2, "ma-english-literature"],
  ["M.Sc. Visual Communication", "master", "Media", 2, "master-media-communication"],
  ["M.Sc. Physics", "master", "Science", 2, "msc-physics"],
  ["M.Sc. Mathematics", "master", "Science", 2, "msc-mathematics"],
  ["M.Sc. Chemistry", "master", "Science", 2, "msc-chemistry"],
  ["M.Sc. Bioinformatics and Data Science", "master", "Science", 2, "GAP:msc-bioinformatics"],
  ["M.Sc. Computer Science", "master", "Computing", 2, "msc-computer-science"],
  ["M.Sc. Medical Biotechnology and Clinical Research", "master", "Science", 2, "msc-biotechnology"],
  ["M.Com. Master of Commerce", "master", "Commerce", 2, "mcom"],
  ["M.C.A. Master of Computer Applications", "master", "Computing", 2, "mca"],
  ["M.S.W. Master of Social Work", "master", "Social Work", 2, "master-social-work"],
  ["M.Sc. Psychology", "master", "Psychology", 2, "master-psychology"],
  ["M.Sc. Software Engineering", "master", "Computing", 2, "msc-software-engineering"],
  ["M.Sc. Marine Biology", "master", "Science", 2, "GAP:msc-marine-biology", "Listed on the 2026-27 PG admissions table but absent from the PG eligibility page; eligibility unconfirmed."],
  ["LL.M. Constitutional Law and Legal Order", "master", "Law", 2, "llm"],
  ["LL.M. Intellectual Property Laws", "master", "Law", 2, "llm"],
  ["LL.M. Criminal Law", "master", "Law", 2, "llm"],
];

const spdUg = [
  ["B.E. Computer Science and Engineering", "bachelor", "Engineering", 4, "be-btech-computer-science-engineering"],
  ["B.E. Computer Science and Engineering with Specialization in Artificial Intelligence and Machine Learning", "bachelor", "Engineering", 4, "be-btech-artificial-intelligence-machine-learning"],
  ["B.E. Electronics and Communication Engineering", "bachelor", "Engineering", 4, "be-btech-electronics-communication-engineering"],
  ["B.Tech. Information Technology", "bachelor", "Engineering", 4, "be-btech-information-technology"],
  ["B.Sc. Computer Science", "bachelor", "Computing", 3, "bsc-computer-science"],
  ["B.Sc. Computer Science with Specialization in Artificial Intelligence", "bachelor", "Computing", 3, "bsc-computer-science"],
  ["B.Sc. Mathematics", "bachelor", "Science", 3, "bsc-mathematics"],
  ["B.Sc. Physics", "bachelor", "Science", 3, "bsc-physics"],
  ["B.Sc. Chemistry", "bachelor", "Science", 3, "bsc-chemistry"],
  ["B.Sc. Visual Communication", "bachelor", "Media", 3, "bachelor-media-communication"],
  ["B.Sc. Biotechnology", "bachelor", "Science", 3, "bsc-biotechnology"],
  ["B.Sc. Microbiology", "bachelor", "Science", 3, "GAP:bsc-microbiology"],
  ["B.Sc. Biochemistry", "bachelor", "Science", 3, "GAP:bsc-biochemistry"],
  ["B.Sc. Hotel Management", "bachelor", "Hospitality", 3, "bachelor-hospitality-management"],
  ["B.Sc. Information Technology", "bachelor", "Computing", 3, "GAP:bsc-information-technology"],
  ["B.Sc. Psychology", "bachelor", "Psychology", 3, "bachelor-psychology"],
  ["B.Sc. Fashion Design", "bachelor", "Design", 3, "bachelor-fashion-design"],
  ["B.A. English", "bachelor", "Humanities", 3, "ba-english-literature"],
  ["B.B.A. Bachelor of Business Administration", "bachelor", "Management", 3, "bba"],
  ["B.C.A. Bachelor of Computer Applications", "bachelor", "Computing", 3, "bca"],
  ["B.Com. General", "bachelor", "Commerce", 3, "bcom"],
  ["Bachelor of Nutrition and Dietetics (Honours)", "bachelor", "Allied Health", 4, "bachelor-nutrition-dietetics"],
  ["B.MLS Bachelor of Medical Laboratory Science", "bachelor", "Allied Health", 4, "bsc-medical-laboratory-science"],
];

const spdPg = [
  ["M.B.A. Master of Business Administration", "master", "Management", 2, "mba"],
  ["M.A. English", "master", "Humanities", 2, "ma-english-literature"],
  ["M.Sc. Visual Communication", "master", "Media", 2, "master-media-communication"],
  ["M.Sc. Physics", "master", "Science", 2, "msc-physics"],
  ["M.Sc. Mathematics", "master", "Science", 2, "msc-mathematics"],
  ["M.Sc. Chemistry", "master", "Science", 2, "msc-chemistry"],
  ["M.Com. Master of Commerce", "master", "Commerce", 2, "mcom"],
  ["M.Sc. Computer Science", "master", "Computing", 2, "msc-computer-science"],
];

const csv = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const header = [
  "university_slug", "programme_official_title", "level", "discipline", "duration", "campus", "delivery_mode",
  "intl_status", "intl_evidence_url", "official_source_url", "other_sources", "already_on_site",
  "existing_offering_slug", "canonical_course_match", "notes",
];
const rows = [];
const add = (list, campus, src) => {
  for (const [title, level, discipline, years, canonical, regulatorHold] of list) {
    const intl = title.startsWith("M.D.S.") ? "not_open" : "open_to_international";
    const notes = [regulatorHold ? `Regulator hold: ${regulatorHold}` : "", UNIVERSITY_HOLD].filter(Boolean).join(" ");
    rows.push([SLUG, title, level, discipline, `${years} years`, campus, "on-campus, full-time", intl,
      intl === "open_to_international" ? SRC.intl : "", src, SRC.prospectus, "no", "", canonical, notes]);
  }
};
add(chennaiUg, CHN, SRC.ug);
add(chennaiPg, CHN, SRC.pg);
add(spdUg, SPD, SRC.spdUg);
add(spdPg, SPD, SRC.spdPg);

const out = [header, ...rows].map((r) => r.map(csv).join(",")).join("\n") + "\n";
writeFileSync(`research/india-programme-inventory/${SLUG}.csv`, out);
console.log(`Wrote ${rows.length} inventory rows.`);
