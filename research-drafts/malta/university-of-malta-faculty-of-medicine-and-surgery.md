# University of Malta - Faculty of Medicine and Surgery (Msida, Malta) - Research Record

Status: DRAFT SAVED, gate criteria met (ok=true). See JSON at
`research-drafts/malta/university-of-malta-faculty-of-medicine-and-surgery.json`.

## Key facts (corroborated, multi-source)

- Public, state university faculty. Main campus at Tal-Qroqq, Msida (~2.5km from Valletta).
- Faculty of Medicine and Surgery formally instituted as the **Collegio Medico on 25 May 1771**,
  one of the original faculties of the Pubblica Universita di Studi Generali (est. 22 Nov 1769).
  The university overall traces roots to 1592 (Wikipedia/secondary).
- Programme: **Doctor of Medicine and Surgery (MD)** — 5 years, 300 ECTS. Pre-clinical + clinical
  phases. Optional intercalated year -> BSc (Hons) Medical Sciences after year 2.
- Language: English-medium coursework, BUT all students (including international) must also pass
  a **Medical Maltese** requirement (SEC pass in Maltese, or University's Medical Maltese
  Proficiency Certificate, or the Medical Maltese unit inside the Foundation course) before Year 1
  and again before Year 3, unless exempted. This is a real, non-trivial hurdle — not downplayed.
- Entry requirements as listed for international qualifications: 2 A-level passes Grade B+ in
  Biology and Chemistry, plus an Intermediate-level pass Grade B+ in another subject, one sitting.
- **India-specific admissions page does NOT confirm direct MD entry from Class XII/HSC/AISSCE.**
  It instead routes Indian applicants to the University's International School for Foundation
  Studies — specifically the one-year **Certificate in Foundation Studies in Medical and Dental
  Sciences** — with admission to that foundation year itself discretionary (interview and/or
  written test). This is the single most important structural fact for the India audience and is
  stated plainly in the draft rather than implying a direct Class-XII-to-MBBS pipeline.
- Tuition: **EUR 26,000/year** for international students, per the official course page at time of
  research (2026-7 intake page). Flagged as materially higher than several other MBBS-abroad
  destinations — not omitted, not downplayed.
- Graduates become eligible for **limited registration with the Malta Medical Council** and can
  apply for foundation doctor posts. Course holds AMSE and ASIIN quality-seal accreditation.
- Housing: University does **not** run its own halls; it recommends the privately operated
  **Campus Hub Residence** next to the Msida campus (mainly because it simplifies residence-permit
  paperwork vs. private rentals). University explicitly disclaims responsibility for the facility.
  Indicative pricing ~EUR 600/month for a shared room (independent secondary source).
- Indian food/community: modest but real — several named Indian restaurants in nearby Sliema; no
  evidence of a large, established Indian student community comparable to bigger European hubs.
- Safety: Malta generally scores low-to-moderate on independent crime indices, below the European
  average; used as general context, not a University claim.
- **Do not confuse with Queen Mary University of London (Barts and The London) MBBS/MBBCh on
  Gozo** — confirmed via a GMC (UK) visit report to be a distinct programme/degree/admissions
  process from the University of Malta's own MD. The draft explicitly disambiguates this.

## What was OMITTED and why

- **Specific teaching-hospital / clinical rotation site names**: not independently itemised in this
  research pass (official course page describes phases and teaching methods generically, not named
  partner hospitals per rotation). Draft tells students to confirm current placement sites directly
  with the Faculty rather than naming unconfirmed hospitals.
- **NMC/WDOMS "approved" status assertion**: NMC's own site was not directly queryable during this
  pass (nmc.org.in college-search tool not fetchable via curl in this environment); independent
  secondary sources (ECFMG/ WDOMS-context searches) suggest University of Malta appears in
  WDOMS/ECFMG-recognition discussions, but the draft does NOT assert blanket NMC approval — it
  instructs students to verify current NMC status directly, consistent with the "never assert if
  unconfirmed" rule.
- **Scholarship programme details** (e.g., "International Student Scholarship", "Malta Government
  Scholarship Scheme") mentioned only by third-party aggregator sites, not corroborated on an
  official University of Malta page during this pass — omitted from structured facts/programs to
  avoid single/low-quality-sourcing; not included in whyChoose/FAQ claims.
- **Exact current-year Foundation Studies fee** and **exact Campus Hub current pricing**: only an
  indicative secondary-source figure (~EUR 600/month) was found for Campus Hub; presented as
  indicative and to be reconfirmed, not stated as an official fixed price.
- **Recognition badges / teaching hospital list / similar-university links**: left as empty arrays
  — no corroborated structured data found to populate them honestly.

## Sources (labelled URLs)

1. Official — Doctor of Medicine and Surgery (UMDFT) course overview:
   https://www.um.edu.mt/courses/overview/umdft-2026-7-o/
2. Official — Faculty of Medicine & Surgery home: https://www.um.edu.mt/ms/
3. Official — Faculty history: https://www.um.edu.mt/ms/aboutus/history/
4. Official — Country-specific qualifications: India:
   https://www.um.edu.mt/study/admissionsadvice/international/country-specificqualifications/india/
5. Official — Certificate in Foundation Studies in Medical and Dental Sciences overview:
   https://www.um.edu.mt/courses/overview/ucfsmddft-2025-6-o/
6. Official — International student accommodation:
   https://www.um.edu.mt/international/students/accommodation/
7. Secondary — Wikipedia, University of Malta: https://en.wikipedia.org/wiki/University_of_Malta
8. Secondary — Beyond The States, Msida location profile:
   https://beyondthestates.com/location/malta/port-region-of-malta/msida/
9. Secondary — GMC (UK) visit report, Barts and The London / QMUL Malta MBBS programme:
   https://www.gmc-uk.org/-/media/documents/barts-and-london-school-of-medicine-and-dentistry-qmuol-malta-mbb-79999461.pdf
10. Secondary — Numbeo, Crime Index by Country (2026 mid-year):
    https://www.numbeo.com/crime/rankings_by_country.jsp

Additional searches performed (not directly cited as sources but used to cross-check / rule out
claims): general WebSearch queries on NMC/NEET/FMGE framework, WDOMS listing status, Indian
restaurants in Sliema/Valletta, Campus Hub Residence description (multiple aggregator confirmations
of the ~EUR 600/month indicative figure and on-site amenities).

## Gate check performed

- `node -e "JSON.parse(...)"` — parses cleanly.
- sourceBundle.sources: 10 (>=2 required), includes official site + multiple independent secondary
  sources — multi-source rule satisfied.
- structuredFacts: name, city, type (Public), establishedYear (1771, number), officialWebsite,
  bestFitFor (5, >=3), programs (1, >=1) with explicit courseSlug "mbbs", title,
  officialProgramUrl, medium, durationYears (5, number) — all present.
- draftContent: all 8 narrative fields non-empty, manually checked against the weak-marker regex
  list from `scripts/publish-university-draft.ts` (no matches) plus scripted verification.
- whyChoose (5), thingsToConsider (7), faq (7) — all >=3.
