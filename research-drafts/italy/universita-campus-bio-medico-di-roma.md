# Research draft: Università Campus Bio-Medico di Roma (Rome, Italy)

Status: **ok = true** (gate-passing draft written to `universita-campus-bio-medico-di-roma.json` in this folder)

## Key facts (corroborated)

- **Name**: Università Campus Bio-Medico di Roma (UCBM)
- **City**: Rome (main campus in Trigoria, southern Rome, on the edge of the Decima-Malafede regional park)
- **Type**: Private (Catholic-affiliated; promoted by Opus Dei per Wikipedia; legally recognized by Ministerial Decree of 31 October 1991)
- **Established**: 1991 (legal recognition) / first degree courses (medicine, nursing) began October 1993 — both dates corroborated across the official Wikipedia article and third-party profiles.
- **Official website**: https://www.unicampus.it/en/
- **Structure**: Three departmental faculties — Medicine, Surgery and Dentistry; Engineering; Science and Biotechnology — built around its own teaching hospital, the Policlinico Universitario Campus Bio-Medico (agreement with Italy's National Health Service).
- **Campus**: Current Trigoria campus inaugurated 2008, on land partly donated by actor Alberto Sordi; includes the Advanced Research Center in Biomedicine and Bioengineering (PRABB, 2007) and the Center for Elderly Health (CESA, 2001).
- **Enrollment**: ~2,600–2,700 students total (Wikipedia infobox, "Students 2,666").
- **Rankings** (context only, not used as gating facts): THE World University Rankings ~501-600 band globally (2025 Italian universities list places it 18th nationally per THE-derived summaries); QS subject band ~651-700; ARWU (Shanghai) 801-900 band (2024). Cited from University Guru / THE / QS aggregator pages, used only as descriptive color, not embedded as a hard claim in the publish draft.

## Programs

### Medicine and Surgery (LM-41) — English-medium, 6-year MD (courseSlug: `mbbs`)
- Official program page: https://www.unicampus.it/en/courses/training-offer/master-s-degree-courses/departmental-faculty-of-medicine-and-surgery/cdlm-medicine-and-surgery-lm-41/
- Medium: English (explicitly stated: "conducted in English")
- Duration: 6 years / 12 semesters, 360 ECTS
- Curriculum: Years 1–2 pre-clinical (anatomy, physiology, biochem, genetics, humanities); clinical practice starts year 3 (pharmacology, imaging, pathology integrated with clinical subjects); year 6 = full clinical immersion (emergency medicine, general surgery, general medicine).
- Admission (per official "How to Apply" page, though the cached snapshot reflects the 2023/24 cycle): a dedicated English-language written admission test — 80 MCQs (Logic 50, Biology 10, Chemistry 10, Maths/Physics 10), ~1h40–1h50 duration. Non-EU applicants not resident in Italy: historically ~30 seats for Medicine and Surgery + 20 seats for the parallel "MedTech" track, tested via a remote-monitored exam. **Seat counts are year-specific — always verify against the current year's official Call for Admission.**
- Tuition (official, corroborated): **EUR 18,000/year**, payable in 3 installments (UCBM official Tuition Fees and Financial Aid page). Scholarships up to 50% of tuition based on merit/income; 20% discount on 3rd installment for large families (4+ siblings under 26). Independent third-party consultancy summaries (e.g., Medlink-adjacent aggregator results returned by search) cite the same EUR 18,000 figure, giving a second corroborating source beyond the official page itself.

### NOT included as a separate program row (but worth noting for context)
- **Medicine and Surgery – "MedTech"**: a parallel English-medium 6-year MD track mentioned on the official "How to Apply" page (40 EU + 20 non-EU seats in the cached cycle). Not enough distinct official-page detail was gathered in this pass to build a second fully-fleshed program entry without risking thin/duplicate content, so it was **omitted** rather than fabricated. Could be added later as a second `mbbs`-slugged program if a dedicated page is found and researched.
- **Medicine and Surgery (Italian-medium)**: confirmed via the official AY2025/2026 admissions page (https://www.unicampus.it/en/transfer-admissions/medicine-and-surgery-ay-2025-2026/) — this is a **separate, Italian-taught** cohort (154 EU seats + 6 non-EU seats, Italian-language test required for non-EU residents abroad). This is **not** the right program for an English-speaking Indian-student audience and was deliberately excluded from `structuredFacts.programs` to avoid misleading readers into applying to the wrong track.

## What was OMITTED and why

1. **NMC/FMGE recognition status** — Could not find an official National Medical Commission (India) registry listing or an official UCBM statement directly confirming NMC recognition or FMGE/NExT eligibility for this specific university. General web results assert that "Italian medical universities" as a class are broadly recognized and graduates sit FMGE/NExT, but this is not the same as a corroborated, university-specific confirmation. Per the sourcing rules, this was **not asserted** — the draft explicitly tells students to verify with NMC directly (see `thingsToConsider` and the dedicated FAQ entry).
2. **Indian food / vegetarian catering specifics** — No official page or independent source confirmed Indian-specific or dedicated vegetarian catering on campus. Framed honestly around Rome's general food landscape and advised students to confirm with the international office directly, rather than inventing specifics.
3. **Current-year (AY2026/2027) exact non-EU seat counts and admission test dates for the English-medium LM-41 program** — The only cached admission-detail page available via curl reflected the 2023/2024 cycle. Rather than presenting stale numbers as current fact, the draft frames these as "historic/illustrative" and repeatedly instructs applicants to check the live, year-specific Call for Admission.
4. **A discrete second program entry for "MedTech"** — Omitted rather than thinly duplicated (see above).
5. **Detailed tuition for non-Medicine programs (Engineering, Science and Biotechnology)** — Out of scope; only Medicine and Surgery (the `mbbs`-relevant, India-audience-relevant program) was researched in depth.
6. **Exact numeric world ranking claims as hard facts** — Rankings vary by source/year and are not the kind of fact the publish gate requires; mentioned only as descriptive/contextual color in this markdown, not embedded as a load-bearing claim inside the JSON draft content.

## Sources (all checked 2026-07-07)

1. UCBM Official Site (English) — https://www.unicampus.it/en/ — [official-university]
2. UCBM – Medicine and Surgery (LM-41) program page — https://www.unicampus.it/en/courses/training-offer/master-s-degree-courses/departmental-faculty-of-medicine-and-surgery/cdlm-medicine-and-surgery-lm-41/ — [official-program]
3. UCBM – How to Apply (admission requirements / test structure) — https://www.unicampus.it/en/corsi/how-to-apply/ — [official-program] (cached to AY2023/24 cycle figures; used for structure/format only)
4. UCBM – Tuition Fees and Financial Aid — https://www.unicampus.it/en/external-student-services/tuition-fees-and-financial-aid/ — [official-fee] (EUR 18,000/year confirmed)
5. UCBM – Student Accommodation (Right to Study Office) — https://www.unicampus.it/en/services/right-to-study/student-accommodation/ — [official-program]
6. Università Campus Bio-Medico di Roma — Wikipedia — https://en.wikipedia.org/wiki/Universit%C3%A0_Campus_Bio-Medico — [other] (establishment year, history, Opus Dei affiliation, campus/hospital details)
7. TopUniversities profile — https://www.topuniversities.com/universities/universita-campus-bio-medico-di-roma — [other]
8. MedlinkStudents profile — https://www.medlinkstudents.com/universities/campus-bio-medico-university-rome/ — [other] (independent consultancy corroboration of program/fee framing)

Additional pages fetched for cross-checking but not cited as primary facts in the JSON (used only to identify the separate Italian-medium cohort and rankings context):
- UCBM Medicine and Surgery AY2025/2026 (Italian-medium) admissions page — https://www.unicampus.it/en/transfer-admissions/medicine-and-surgery-ay-2025-2026/
- University Guru rankings aggregator — https://www.universityguru.com/university/campus-bio--medico-university-of-rome-rome
- Times Higher Education profile — https://www.timeshighereducation.com/world-university-rankings/campus-bio-medico-university-rome

## Gate self-check (matches scripts/publish-university-draft.ts validateDraft logic)

- countrySlug: `italy` ✓
- sourceBundle.sources: 8 entries, each with label/url/kind/checkedAt ✓ (>= 2 required)
- structuredFacts.name / city / type (`Private`) / establishedYear (1991, number) / officialWebsite ✓
- structuredFacts.bestFitFor: 4 items (>= 3 required) ✓
- structuredFacts.programs: 1 entry with explicit `courseSlug: "mbbs"`, title, officialProgramUrl, medium (`English`), durationYears (6) ✓ (>= 1 required)
- draftContent: all 8 narrative fields present, non-empty, and scanned clean of weak-marker regexes (`pending official-source research`, `not yet verified`, `internal draft`, `needs official...`, `still needs`, `before publication`, `do not publish...`) ✓
- draftContent.whyChoose: 4 (>= 3) ✓; thingsToConsider: 4 (>= 3) ✓; faq: 6 (>= 3) ✓

JSON parses cleanly via `node -e "JSON.parse(...)"`. This draft should pass `scripts/publish-university-draft.ts` validation once seeded via `scripts/seed-university-draft.ts --file <path>`.
