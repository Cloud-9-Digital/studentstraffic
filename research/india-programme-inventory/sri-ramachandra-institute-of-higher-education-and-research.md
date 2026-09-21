# Sri Ramachandra Institute of Higher Education and Research (SRIHER) — programme inventory, 2026-09-21

## Sources used
- Official programme directory: https://sriramachandra.edu/programme/ (reachable, curl) — 180 individual programme pages discovered, 2 excluded as catch-all Ph.D./D.Sc. listing pages ("offered in all the faculties"), 178 concrete programmes retained
- SRIHER Prospectus 2026-27 — Foreign Nationals Admissions (Undergraduate): https://media.sriramachandra.edu/ms/storage/2026/04/PROSPECTUS_Foreign-Nationals-Admissions-18_April_2026-compressed.pdf (already in bundle payload; used as the UG international-eligibility evidence baseline)
- SRIHER Prospectus 2026-27 — Postgraduate Admissions (NRI / Foreign National): https://media.sriramachandra.edu/ms/storage/2026/06/PG_-PROSPECTUS_NRI_FN_2026_27_Final.pdf (already in bundle payload; used as the PG international-eligibility evidence baseline for non-clinical PG programmes)
- Existing bundle payload: content-migrations/0103-india-sri-ramachandra-institute-of-higher-education-and-research/payload.json (6 programmes already published)
- sitemap_index.xml reachable but not used for programme discovery (post/page/news sitemaps, not a dedicated programme sitemap)

## Unreachable / not attempted
- The two FN/NRI prospectus PDFs were not re-downloaded and re-read page-by-page in this pass; eligibility status below is inferred from the scope statements already captured in the existing payload ("excluding Medical & Dental", "B.Pharm not on programme list") rather than re-verified per programme title. This is the single biggest source of uncertainty in this file.
- Study in India portal (studyinindia.gov.in) — not queried per-institution in this pass given the scale of the official catalogue (178 programmes); SRIHER's PG prospectus already requires Study in India SII IDs for some categories per the existing payload.
- AICTE facilities.aicte-india.org — not checked (SRIHER's B.Tech, BBA, MBA programmes are typically AICTE/UGC, not separately verified here).
- NIRF data file — not re-downloaded; rankings already captured in the existing payload's recognitionBadges (21st Medical, 13th Dental, 36th Pharmacy, 60th University, NIRF 2025).
- Checklist sites (Shiksha/Collegedunia/Careers360) — not queried for SRIHER in this pass given the very large official catalogue already found; recommend a follow-up pass specifically to sanity-check the "unknown" MD/MS/MDS/DM/M.Ch. rows against Careers360's admission pages.

## Counts
- Total distinct programmes found: 178 (excludes 2 generic "Ph.D. offered in all the faculties" / "D.Sc. offered in all the faculties" catalogue pages, per the task's instruction to exclude pure PhD rows unless trivial)
- By level: UG 53, PG 99, Doctoral (DM/M.Ch. super-specialities) 25, Integrated (Pharm.D.) 1
- By intl_status: open_to_international 116, unknown 59, not_open 3

## Already on site vs missing
- Already on site: 6 (BPT, BOT, B.Sc. Applied Psychology, MPH, M.Sc. Clinical Psychology, MBA Hospital & Health Systems Management)
- Missing AND open_to_international (highest-value gap): 110 — spans B.Optom, B.Com (Hons.), BBA (Hospital & Health Systems Management), B.Sc. Data Science/Bioinformatics/Health Information Management, the very large allied-health B.Sc. (Hons.) family (cardiac technology, radiology & imaging, radiotherapy, dialysis, respiratory therapy, perfusion, critical care, orthopaedic/neuroscience/urology/geriatric/burn-care/paediatric-surgical technology, etc.), B.Sc. Nursing (Basic and Post-Basic), the M.Sc. family (biotechnology, human genetics, clinical embryology, forensic science, etc.), M.Pharm specialisations, MPT/MOT specialisations, MBA/M.Sc. Nursing specialities, M.Optom, MSW, and more — see CSV for the full, row-by-row list
- Missing with unknown intl_status: 59 — almost entirely the MD/MS/MDS (clinical postgraduate) and DM/M.Ch. (super-speciality) rows, where India's NEET-PG/NEET-SS counselling process and a separate, more restrictive foreign-national medical quota make a blanket "open" claim unsafe without per-programme confirmation
- not_open: 3 — MBBS, BDS, B.Pharm (explicitly excluded from SRIHER's 2026-27 foreign-national prospectuses per the existing payload's "thingsToConsider")

## Top GAP canonical courses
147 of 178 rows have no canonical taxonomy match (`GAP:<slug>`). The highest-value clusters for new canonical courses, given SRIHER's scale and the open_to_international count:
- Allied-health technology cluster (14 distinct B.Sc. Hons. AHS technology programmes — cardiac, radiology & imaging, radiotherapy, dialysis, respiratory, perfusion, critical care, orthopaedic, neuroscience, urology, geriatric care, burn care/plastic reconstructive, paediatric surgical) — currently only `bsc-medical-laboratory-science` exists as a UG allied-health canonical course
- Nursing PG cluster (M.Sc. Nursing in Medical-Surgical, Community Health, Paediatric, Psychiatric, Obstetrics & Gynaecology Nursing, Nurse Practitioner in Critical Care) — no PG nursing canonical exists at all, only `bsc-nursing` at UG
- M.Pharm specialisation cluster (Pharmaceutics, Pharmacology, Pharmacognosy, Pharmaceutical Analysis, Pharmacy Practice, Regulatory Affairs, Quality Assurance) — no M.Pharm canonical exists
- Physiotherapy/Occupational Therapy PG specialisation cluster (MPT in 5 specialities, MOT in 6 specialities) — only base `bpt`/`bachelor-occupational-therapy` (UG) canonicals exist, no PG specialisation canonicals
- Optometry (B.Optom, M.Optom), Speech-Language Pathology/Audiology (B.ASLP, M.Sc. Audiology, M.Sc. Speech-Language Pathology), and Data Science/Bioinformatics (B.Sc./M.Sc.) — no canonical exists in any of these disciplines yet

## Notes on methodology
- Because of the scale (178 official programmes), individual programme pages were not fetched for duration/seat/fee detail in this pass — only the programme directory listing page was parsed for titles and URLs. Durations shown are populated only where the programme matches an existing canonical course (which carries a known duration) or is already in the published payload; all other duration cells are blank and should be confirmed from the individual programme page before drafting content.
- `intl_status` was assigned by category rule, not by opening each of the 178 pages: UG non-medical/non-dental → open_to_international (evidence: FN UG prospectus scope statement); non-clinical PG (M.Sc./M.Pharm/MPT/MOT/MSW/M.Optom/MBA etc.) → open_to_international (evidence: PG NRI/FN prospectus); MD/MS/MDS/DM/M.Ch. → unknown; MBBS/BDS/B.Pharm → not_open (both directly evidenced in the existing payload). This is a reasonable first pass but every row should be spot-checked against the actual prospectus PDF before publishing.
- Two title-spelling duplicates from the source site were kept as separate rows because the university lists them separately: `m-ch-paediatric-surgery` and `m-ch-pediatric-surgery`, and `m-ch-neuro-surgery` vs `m-ch-neuro-surgery-6-years` (3-year post-MS route vs 6-year direct-after-MBBS route).
