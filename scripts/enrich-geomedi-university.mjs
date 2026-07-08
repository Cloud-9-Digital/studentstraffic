/**
 * Enrich the existing University Geomedi (Tbilisi, Georgia) profile using
 * facts from Geomedi's official 2026 admissions brochure (version 17).
 * University Geomedi already exists in the DB (slug: university-geomedi,
 * id 384) with a published MD program offering — this script only enriches
 * the descriptive/recognition fields, it does not insert a new university
 * or program row.
 *
 * Source: GEOMEDI BROUCHER 17 version -.pdf, provided by the user 2026-07-02.
 * Run: node scripts/enrich-geomedi-university.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SLUG = "university-geomedi";

const summary =
  "University Geomedi (Teaching University Geomedi LLC) is a private medical university in Tbilisi, founded in 1998 by Professor Marina Pirtskhalava. It offers a specialized, focused learning environment across Medicine, Dentistry, Healthcare Economics and Management, and Physical Medicine and Rehabilitation, with strong simulation-based clinical training and a smaller student-to-teacher ratio than Georgia's larger state universities.";

const campusLifestyle =
  "A dedicated healthcare-focused campus in central Tbilisi with a smaller student-to-teacher ratio for highly personalised learning. Facilities include a renovated Anatomy Hall (3D anatomy tables, phantoms, and light microscopes), a Simulation Medicine Clinic where OSCE clinical-skills exams are conducted, Histology and Chemistry laboratories, a Dental Phantom Laboratory, a European-level Examination Center, a library with EBSCO and SCOPUS database access, a Conference Hall, a Student Service Center, and an on-campus café. The atmosphere is quiet and strictly medical.";

const clinicalExposure =
  "Geomedi runs its own University Clinic, University Dental Clinic (therapeutic, surgical, orthopedic, and pediatric dentistry departments), and University Rehabilitation Clinic, alongside further clinical training through its affiliated multi-profile German Hospital in Tbilisi, which is staffed by German and Georgian specialists and cooperates exclusively with Geomedi for graduate employment opportunities.";

const studentSupport =
  "Excellent teacher-to-student ratio with direct mentorship from practicing clinicians. The university's Student Service Center handles academic, administrative, ethical, and everyday student issues in both Georgian and English, and advises on student rights, code of ethics, and available projects or events.";

const whyChoose = [
  "Founded in 1998, Geomedi is one of Georgia's longer-running private medical universities, with an ENQA/WFME-accredited MD program and learning managed under the European Credit Transfer System (ECTS).",
  "The MD (Medicine) program is taught in Georgian and English — the only Geomedi faculty offered in English — with small class sizes for close, hands-on mentorship from clinicians.",
  "Students train in Geomedi's own Simulation Medicine Clinic, Anatomy Hall, and OSCE-equipped labs before treating real patients, with further clinical exposure through the university's affiliated German Hospital in Tbilisi.",
  "Geomedi holds recognitions and memberships with WHO, AMEE (Association for Medical Education in Europe), and FAIMER, and its program meets NMC FMGL 2021 criteria for Indian recognition.",
  "Around 80% of Geomedi graduates are employed in Georgia's private and public healthcare sector or in international companies and healthcare facilities within a short period of graduating.",
];

const thingsToConsider = [
  "Only the MD (Medicine) program is taught in English — Dentistry, Healthcare Economics & Management, and Physical Medicine & Rehabilitation are taught in Georgian only, so Indian students should apply specifically to the MD English-medium track.",
  "Smaller campus footprint compared to Georgia's larger state universities — a trade-off for the more personalised, specialised environment.",
  "Focused primarily on medicine, dentistry, and allied health sciences rather than a broad multi-faculty university.",
];

const bestFitFor = [
  "Students wanting small class sizes and close mentorship from practicing clinicians",
  "Specialized learners focused purely on a medical career path",
  "Students who want simulation-heavy, OSCE-based clinical training before working with real patients",
];

const teachingHospitals = [
  "Geomedi University Clinic",
  "Geomedi University Dental Clinic",
  "Geomedi University Rehabilitation Clinic",
  "Affiliated German Hospital, Tbilisi",
  "Partner Tbilisi Hospitals",
];

const recognitionBadges = [
  "Specialized Medical Hub",
  "WHO Recognized",
  "NMC FMGL 2021 Compliant",
  "AMEE Member",
  "FAIMER Listed",
  "ENQA/WFME Accredited Program",
  "Est. 1998",
];

const recognitionLinks = [
  { label: "Geomedi University — official website", url: "https://geomedi.edu.ge/" },
  { label: "World Health Organization (WHO)", url: "https://www.who.int/" },
  { label: "AMEE — Association for Medical Education in Europe", url: "https://amee.org/" },
  {
    label: "FAIMER — Foundation for Advancement of International Medical Education and Research",
    url: "https://www.faimer.org/",
  },
];

const faq = [
  {
    question: "Is Geomedi University recognized?",
    answer:
      "Yes. Geomedi is recognized by the World Health Organization (WHO) and is a member institution of AMEE and FAIMER. Its MD program meets the NMC's FMGL 2021 criteria for Indian recognition, so graduates can appear for the FMGE/NExT licensing exam after returning to India.",
  },
  {
    question: "Is the MD program at Geomedi taught in English?",
    answer:
      "Yes, but only the MD (Medicine) program — Geomedi's other faculties (Dentistry, Healthcare Economics & Management, Physical Medicine & Rehabilitation) are taught in Georgian only. Indian students should apply specifically to the English-medium MD track.",
  },
  {
    question: "How long is the MD program at Geomedi?",
    answer:
      "6 years, following the standard MD structure (equivalent to MBBS in India) recognized under NMC guidelines.",
  },
  {
    question: "What is the total fee for the MD program at Geomedi?",
    answer:
      "Tuition is approximately USD 5,500 per year (USD 33,000 for 6 years), plus hostel of roughly USD 3,000–3,200 per year based on the university's official fee card. Always confirm the current year's fee directly with Geomedi or Students Traffic before financial planning.",
  },
  {
    question: "When was Geomedi founded and who leads it?",
    answer:
      "Geomedi was established in 1998 by Professor Marina Pirtskhalava, who continues to serve as its founder and rector.",
  },
  {
    question: "Does Geomedi have its own clinical facilities?",
    answer:
      "Yes. Geomedi operates its own University Clinic, a University Dental Clinic, and a University Rehabilitation Clinic, and is affiliated with the multi-profile German Hospital in Tbilisi for further clinical exposure.",
  },
];

const lastVerifiedAt = "2026-07-02";

const researchSources = [
  {
    label: "Geomedi University official website",
    url: "https://geomedi.edu.ge/",
    kind: "official-university",
    checkedAt: "2026-07-02",
    notes:
      "Cross-checked against Geomedi's official 2026 admissions brochure (v17) — faculties, accreditation memberships, facilities, and fee structure.",
  },
];

const researchNotes =
  "Enriched 2026-07-02 using Geomedi's official 2026 admissions brochure (version 17): founder/history, faculty structure and language of instruction per faculty, campus facilities, affiliated clinics (University Dental Clinic, University Rehabilitation Clinic, affiliated German Hospital), and international memberships (WHO, AMEE, FAIMER). Only the MD program is confirmed English-medium; other faculties are Georgian-only per the brochure's own faculty fact sheets.";

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE universities SET
        summary             = $1,
        campus_lifestyle     = $2,
        practical_exposure    = $3,
        student_support      = $4,
        why_choose           = $5,
        things_to_consider   = $6,
        best_fit_for         = $7,
        industry_partners   = $8,
        recognition_badges   = $9,
        recognition_links    = $10,
        faq                  = $11,
        last_verified_at     = $12,
        research_sources     = $13,
        research_notes       = $14,
        updated_at           = NOW()
      WHERE slug = $15`,
      [
        summary,
        campusLifestyle,
        clinicalExposure,
        studentSupport,
        JSON.stringify(whyChoose),
        JSON.stringify(thingsToConsider),
        JSON.stringify(bestFitFor),
        teachingHospitals,
        recognitionBadges,
        JSON.stringify(recognitionLinks),
        JSON.stringify(faq),
        lastVerifiedAt,
        JSON.stringify(researchSources),
        researchNotes,
        SLUG,
      ]
    );

    if (result.rowCount > 0) {
      console.log(`✓ Enriched ${SLUG}`);
    } else {
      console.warn(`✗ NOT FOUND: ${SLUG}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
