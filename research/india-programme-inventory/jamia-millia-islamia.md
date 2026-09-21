# Jamia Millia Islamia — programme inventory (India batch 3, Phase B)

## Sources used
1. **Official FSA (Foreign Students Advisor) admission page** — `https://jmi.ac.in/ACADEMICS/International-FSA/Foreign-Students-Advisor/University-Admission-2026-2027-(Foreign/NRI)` — entry point listing all FSA circulars/PDFs for the 2026-27 cycle.
2. **UG foreign/NRI seat matrix (PDF)** — `https://jmi.ac.in/upload/menuupload/fsa_seats_ug_programme.pdf` — per-programme seat counts under 25% supernumerary Foreign-National, 5% ICCR scholar and 5% NRI-ward quotas, by faculty. Primary evidence for every UG row's `intl_status`.
3. **PG foreign/NRI seat matrix (PDF)** — `https://jmi.ac.in/upload/menuupload/fsa_seats_pg_programme.pdf` — same structure for postgraduate programmes across faculties and research centres. Primary evidence for every PG row's `intl_status`.
4. **Fee structure for foreign students and NRI wards (PDF)** — `https://jmi.ac.in/upload/menuupload/fsa__feestructure_fsa_nri_2026-27.pdf` — USD fee bands by faculty group and applicant region (SAARC / West Asian / African & Latin American / all other), plus the BDS flat fee and NRI-ward at-par-with-Indian-students rule. This table is faculty-group-level, not per-programme, so it is cited as `intl_evidence_url` alongside the seat matrices rather than replacing them.
5. **Study in India, AICTE, NIRF data files** — not queried in this pass (time-boxed to the FSA PDFs, which are JMI's own authoritative and current foreign-seat register); flagged as a follow-up before packaging.
6. **Aggregators (Shiksha, Collegedunia, Careers360)** — not queried as a missed-programme checklist in this pass; flagged as a follow-up. The FSA PDFs already enumerate JMI's full UG+PG catalogue by faculty/centre, which is a stronger primary source than an aggregator cross-check would add for this university.
7. A separate **PhD seat/admission PDF and list** exist (`fsa_phd_admission.pdf`, `fsa_list_phd_programme.pdf`) but were not fetched — PhD is excluded from this inventory per instructions.

## Coverage and method notes
- Every row's `intl_status` and `intl_evidence_url` come directly from the FSA UG/PG seat matrices, which list a real numeric seat allocation (or an explicit exclusion) for every currently-run JMI UG and PG programme. This is a genuinely per-programme evidence base, not a whole-university inference.
- **B.Arch./B.Arch.(SFS)** is marked `not_open`: the seat matrix states verbatim "No seat is given to FS/NRI Wards".
- **B.D.S.** is marked `open_to_international` but flagged for hold review: only 2 seats are allotted to the combined FS/NRI quota, strictly by NEET score, at a flat non-refundable USD 50,000 fee for the whole course — the packaging agent must confirm NEET eligibility/registration is realistic for foreign nationals before publishing.
- Several PDF rows bundle multiple named specialisations under one seat/intake number (e.g. M.Sc. Chemistry's four tracks, M.Arch.'s four tracks, M.P.T.'s four tracks, LL.M.'s three tracks, MBA Pharmaceutical Management's three admission tracks). These are kept as **one CSV row each**, with the specialisation list preserved in `notes`, rather than split into unevidenced separate seat counts.
- `canonical_course_match` was produced by manually checking every title against the full canonical list in `lib/data/program-taxonomy.ts` (185 entries). Genuine parent-level matches were used wherever the field/level fit (e.g. all language B.A./M.A. programmes → `ba-languages-linguistics`/`ma-languages-linguistics`; Civil Engineering specialisations → `be-btech-civil-engineering`/`me-mtech-civil-engineering`). Where no canonical slug exists for the field (Islamic Studies, Social Work, Library & Information Science, diploma-level engineering, most niche area-studies/vocational centres), a `GAP:<parent-slug>` was used at the parent level, not per specialisation.
- Duration was read from each seat-matrix row's semester/year count (8 Semesters = 4 years, 4 Semester = 2 years, 10 Semesters = 5 years, 6 Semesters = 3 years), not guessed from the programme title.
- Campus is New Delhi (JMI's single main campus) for all rows; no satellite-campus programmes were found in the FSA matrices.
- PhD excluded per instructions.

## Counts
- **Total programmes (excl. PhD): 176**
- By level: UG 68, PG 102, Diploma 6
- `intl_status`: `open_to_international` 175, `not_open` 1 (B.Arch./B.Arch.(SFS))
- Already on our site: 0 (new university)
- GAP rows: 52 of 176, spanning **48 distinct GAP parent courses** (listed below)

## Distinct GAP parent courses (48)
`ba-islamic-studies`, `ba-llb-integrated`, `bachelor-human-resource-management`, `bachelor-library-information-science`, `bachelor-social-work`, `bba`, `bed-nursery-education`, `bed-special-education`, `bsc-computer-science`, `bsc-general`, `bvoc-medical-electrophysiology`, `bvoc-solar-energy`, `diploma-civil-engineering`, `diploma-computer-engineering`, `diploma-electrical-engineering`, `diploma-electronics-engineering`, `diploma-leather-footwear-technology`, `diploma-mechanical-engineering`, `ma-comparative-religion`, `ma-development-communication`, `ma-development-studies`, `ma-early-childhood-development`, `ma-education`, `ma-educational-planning-administration`, `ma-gender-studies`, `ma-human-resource-management`, `ma-human-rights-education`, `ma-islamic-studies`, `ma-social-work`, `master-library-information-science`, `mba-pharmaceutical-management`, `mca`, `med-special-education`, `msc-biochemistry`, `msc-bioinformatics`, `msc-biophysics`, `msc-disaster-management-climate-sustainability`, `msc-electronics`, `msc-renewable-energy`, `msc-virology`, `mtech-computational-mathematics`, `mtech-computer-engineering-ai-ml`, `mtech-energy-science-technology`, `mtech-environmental-engineering`, `mtech-environmental-health-safety-management`, `mtech-material-science-technology`, `mtech-nanotechnology`, `mtech-solid-state-technology`.

## Follow-ups before packaging
- Cross-check the full catalogue against Study in India / AICTE / NIRF and the Shiksha/Collegedunia/Careers360 checklist for any missed programme, per runbook §1b.
- Map the USD fee bands (region × faculty group) in `fsa__feestructure_fsa_nri_2026-27.pdf` onto each programme row before drafting `admissionsContent`; the PDF's layout columns interleave under `pdftotext -layout` and must be read from the rendered PDF.
- Confirm B.D.S. NEET-for-foreign-nationals mechanics before deciding whether to package it.
- Resolve the 48 GAP parents against taxonomy review before packaging affected rows, per runbook §1b/§2.

## Phase D packaging (2026-09-21, claude-india-batch3-20260921)

- Migration: `content-migrations/0112-india-jamia-millia-islamia/` (payload validated offline; not applied).
- Open-to-international rows in inventory: 175 (B.Arch. is `not_open` and excluded). **Packaged: 94. Held: 81.**
- Fees: confirmed US$ per-semester supernumerary rates from `fsa__feestructure_fsa_nri_2026-27.pdf` (read from the rendered PDF), headline = 'all other countries' rate; SAARC, West Asian and African/Latin American rates are in each programme's fee notes. Band per faculty/centre; B.Des. has no published band (fee `on_request`).
- Eligibility: per programme from the University Prospectus 2026-27, Annexure I (FSA guidelines: foreign-student minimum eligibility equals the Indian-student eligibility in the prospectus; supernumerary merit is on qualifying-exam marks, no entrance test; B.P.T. requires NEET-UG for foreign nationals).
- Teaching language: JMI Ordinance 11 makes Urdu the default medium with English/Hindi only as approved, and English mandatory for 'sciences, technical and professional courses'. Packaged programmes are science/technical/professional courses (sciences, engineering, polytechnic, B.Voc., law, management, hospitality, physiotherapy, architecture/planning/design, library science) or programmes where the prospectus states English (B.A./M.A. Social Work, B.A./M.A. HRM). Humanities, languages, social-science, commerce, fine-arts, education and centre-run M.A. programmes have no programme-level medium statement and are held.
- Inventory corrections: the FSA PG seat matrix prints 01/02 in the duration column for centre-run programmes; the prospectus lists them as 4 semesters. BPT duration 4.5 years confirmed by the CPRS department page.

### Held rows (reason)

- row 2 `B.A. (Hons) Arabic` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 3 `B.A. (Hons) English` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 4 `B.A. (Hons) Islamic Studies` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 5 `B.A. (Hons) Korean Language` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 6 `B.A. (Hons) Persian` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 7 `B.A. (Hons) Turkish Language & Literature` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 8 `B.A. (Hons) Urdu` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 9 `B.A. (Hons.) French & Francophone Studies` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 10 `B.A. (Hons.) Hindi` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 11 `B.A. (Hons.) History` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 12 `B.A. (Hons.) Mass Media Hindi` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 13 `B.A. (Hons.) Sanskrit` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 14 `B.A. (Hons.) Spanish & Latin American Studies` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 15 `B.A. (Hons.) Japanese Studies` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 16 `B.A. (Hons.) German Studies` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 17 `B.A. (Hons.) Uzbek Language, Literature & Culture` - Teaching language not established. JMI Ordinance 11 makes Urdu the default medium, with English or Hindi only where the Academic Council approves; no JMI source states the medium for this humanities/languages programme.
- row 18 `Four Year B.A. (Multidisciplinary)` - Teaching language not established (social-science/humanities programme; Ordinance 11 default is Urdu with English/Hindi only as approved; no programme-level statement found).
- row 19 `B.A. (Hons) Economics` - Teaching language not established (social-science programme; no programme-level medium statement in the prospectus or ordinances).
- row 20 `B.A. (Hons) Political Science` - Teaching language not established (social-science programme; no programme-level medium statement).
- row 21 `B.A. (Hons) Sociology` - Teaching language not established (social-science programme; no programme-level medium statement).
- row 24 `B.A. (Hons) Psychology` - Teaching language not established (social-science programme; no programme-level medium statement).
- row 26 `B.Com. (Hons)` - Teaching language not established (commerce is not clearly a science, technical or professional course under Ordinance 11; no programme-level medium statement).
- row 27 `B.Com. (Hons) (Self Financed)` - Teaching language not established (commerce; no programme-level medium statement).
- row 38 `B.F.A. (Applied Art)` - Teaching language not established. Fine arts is not named as a science, technical or professional course in Ordinance 11 and Urdu-medium sections exist in BFA (Art Education); no programme-level medium statement.
- row 39 `B.F.A. (Painting)` - Teaching language not established. Fine arts is not named as a science, technical or professional course in Ordinance 11 and Urdu-medium sections exist in BFA (Art Education); no programme-level medium statement.
- row 40 `B.F.A. (Sculpture)` - Teaching language not established. Fine arts is not named as a science, technical or professional course in Ordinance 11 and Urdu-medium sections exist in BFA (Art Education); no programme-level medium statement.
- row 41 `B.F.A. (Art Education)` - Teaching language not established. Fine arts is not named as a science, technical or professional course in Ordinance 11 and Urdu-medium sections exist in BFA (Art Education); no programme-level medium statement.
- row 57 `Diploma in Leather Goods & Footwear Technology` - Weak taxonomy fit: the only mapping is diploma-mechanical-engineering, which would present a leather goods and footwear manufacturing diploma as a mechanical engineering diploma. Held rather than mislead.
- row 62 `Bachelor of Library & Information Science` - Duration conflict between JMI sources: FSA UG seat matrix prints 8 semesters, the Prospectus 2026-27 lists B.Lib.I.Sc. as 2 semesters with a bachelor's degree as entry. Hold until FSA confirms.
- row 67 `B.Ed.` - Duration conflict between JMI sources (FSA UG seat matrix prints 8 semesters; Prospectus 2026-27 lists 4 semesters with a bachelor's degree as entry) and the Faculty of Education runs Hindi/English/Urdu-medium sections, so the medium for foreign students is not established. Hold until FSA confirms.
- row 68 `B.Ed. Special Education (Visual Impairment)` - Duration conflict between JMI sources (FSA UG seat matrix prints 8 semesters; Prospectus 2026-27 lists 4 semesters with a bachelor's degree as entry) and the Faculty of Education runs Hindi/English/Urdu-medium sections, so the medium for foreign students is not established. Hold until FSA confirms.
- row 69 `B.Ed. Special Education (Learning Disability)` - Duration conflict between JMI sources (FSA UG seat matrix prints 8 semesters; Prospectus 2026-27 lists 4 semesters with a bachelor's degree as entry) and the Faculty of Education runs Hindi/English/Urdu-medium sections, so the medium for foreign students is not established. Hold until FSA confirms.
- row 70 `B.Ed. Nursery Education` - Duration conflict between JMI sources (FSA UG seat matrix prints 8 semesters; Prospectus 2026-27 lists 4 semesters with a bachelor's degree as entry) and the Faculty of Education runs Hindi/English/Urdu-medium sections, so the medium for foreign students is not established. Hold until FSA confirms.
- row 75 `B.D.S.` - Only 2 seats for the combined foreign-national/NRI quota, allotted strictly on NEET score, at USD 50,000 for the whole course. JMI does not document how foreign nationals apply for these seats (MCC counselling vs FSA portal), so eligibility and route are not clearly documented. Held.
- row 76 `M.A. Arabic` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 77 `M.A. English` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 78 `M.A. Hindi` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 79 `M.A. History` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 80 `M.A. Islamic Studies` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 81 `M.A. Korean Language & Literature` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 82 `M.A Persian` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 83 `M.A. Sanskrit` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 84 `M.A. Urdu` - Teaching language not established (humanities/languages PG; Ordinance 11 default Urdu with English/Hindi only as approved; no programme-level statement).
- row 85 `M.A./M.Sc.(Development Extension)` - Teaching language not established (Department of Adult and Continuing Education, social sciences; no programme-level medium statement).
- row 86 `M.A. Economics` - Teaching language not established (social-science PG; no programme-level medium statement).
- row 87 `M.Sc. (Banking and Financial Analytics) (Self-Financed)` - Teaching language not established (M.Sc. offered by the Department of Economics, Faculty of Social Sciences; no programme-level medium statement).
- row 88 `M.A. Political Science` - Teaching language not established (social-science PG; no programme-level medium statement).
- row 89 `M. A. Human Rights & Duties Education` - Teaching language not established (social-science PG; no programme-level medium statement).
- row 90 `M.A. Public Administration` - Teaching language not established (social-science PG; no programme-level medium statement).
- row 91 `M.A. Sociology` - Teaching language not established (social-science PG; no programme-level medium statement).
- row 94 `M.A. Psychology` - Teaching language not established (social-science PG; no programme-level medium statement).
- row 95 `M.Com. (Business Management)` - Teaching language not established (commerce PG; no programme-level medium statement) and the canonical course mcom has no live course record yet.
- row 99 `M. Tech (Solid State Technology) (S/F, Evening)` - Not in the Prospectus 2026-27 (no programme code, eligibility or duration there); listed only in the FSA PG seat matrix. Eligibility unverifiable.
- row 113 `M.F.A. (Painting)` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 114 `M.F.A. (Art Education)` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 115 `M.F.A. (Sculpture)` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 116 `M.F.A. (Applied Art)` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 117 `M.F.A. (Graphic Art) (Print Making)` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 118 `M.F.A. (Art History & Art Appreciation)` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 119 `M.F.A. (Curatorial Practices) S/F` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 120 `M.F.A. (Art Management) S/F` - Teaching language not established (fine arts PG; no programme-level medium statement).
- row 145 `M.Ed.` - Faculty of Education programme: teaching language for foreign students not established (the faculty runs Hindi, English and Urdu medium sections in B.Ed.; no programme-level statement for this programme).
- row 146 `M.A. (Education)` - Faculty of Education programme: teaching language for foreign students not established (the faculty runs Hindi, English and Urdu medium sections in B.Ed.; no programme-level statement for this programme).
- row 147 `M.A. (Educational Planning and Administration)` - Faculty of Education programme: teaching language for foreign students not established (the faculty runs Hindi, English and Urdu medium sections in B.Ed.; no programme-level statement for this programme).
- row 148 `M.Ed. (Special Education) (Visual Impairment)` - Faculty of Education programme: teaching language for foreign students not established (the faculty runs Hindi, English and Urdu medium sections in B.Ed.; no programme-level statement for this programme).
- row 149 `M.Ed. (Special Education) (Learning Disability)` - Faculty of Education programme: teaching language for foreign students not established (the faculty runs Hindi, English and Urdu medium sections in B.Ed.; no programme-level statement for this programme).
- row 150 `M.A. (Early Childhood Development)` - Faculty of Education programme: teaching language for foreign students not established (the faculty runs Hindi, English and Urdu medium sections in B.Ed.; no programme-level statement for this programme).
- row 160 `M.A. (Media Governance)` - Teaching language not established (centre-run M.A.; no programme-level medium statement). Also a duration conflict: FSA PG seat matrix prints 02, prospectus 4 semesters.
- row 161 `M.A. (Conflict Analysis and Peace Building)` - Teaching language not established (centre-run M.A.; prospectus only asks for working knowledge of English). Duration conflict: seat matrix 02 vs prospectus 4 semesters.
- row 162 `M.Sc. Virology (S/F)` - Duration conflict: FSA PG seat matrix prints 01 for M.Sc. Virology, the Prospectus 2026-27 lists 4 semesters. Hold until FSA confirms.
- row 163 `M.A. (Mass Communication)` - Teaching language not established (AJK MCRC M.A.; no programme-level medium statement found, ajkmcrc.org is a parked domain). Duration conflict: seat matrix 01 vs prospectus 4 semesters.
- row 164 `M.A. (Convergent Journalism) (S/F)` - Teaching language not established (AJK MCRC M.A.; no programme-level medium statement found, ajkmcrc.org is a parked domain). Duration conflict: seat matrix 01 vs prospectus 4 semesters.
- row 165 `M.A. Development Communication (S/F)` - Teaching language not established (AJK MCRC M.A.; no programme-level medium statement found, ajkmcrc.org is a parked domain). Duration conflict: seat matrix 01 vs prospectus 4 semesters.
- row 166 `M.A. (Visual Effects and Animation) (S/F)` - Teaching language not established (AJK MCRC M.A.; no programme-level medium statement found, ajkmcrc.org is a parked domain). Duration conflict: seat matrix 01 vs prospectus 4 semesters.
- row 168 `M.A. (Gender Studies)` - Teaching language not established (centre-run M.A.; no programme-level medium statement).
- row 169 `MA (Politics: International & Area Studies)` - Teaching language not established (centre-run M.A.; no programme-level medium statement).
- row 170 `M.A. (Social Exclusion & Inclusive Policy)` - Teaching language not established (centre-run M.A.; no programme-level medium statement).
- row 171 `M.A. International Relations: Arab-Islamic Culture` - Teaching language not established (centre-run M.A.; no programme-level medium statement).
- row 174 `M.A. International Relations: West Asian Studies` - Teaching language not established (centre-run M.A.; no programme-level medium statement).
- row 175 `Master of Library & Information Science` - Not in the Prospectus 2026-27: the only Master of Library & Information Science there (M71) is the 2-semester programme packaged from row 94; this 4-semester, 35-seat row appears only in the FSA PG seat matrix. Eligibility and duration unverifiable.
- row 176 `M.A. Comparative Religion` - Teaching language not established (centre-run M.A.; no programme-level medium statement).
