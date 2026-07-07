# Campus Bio-Medico University of Rome (UCBM) — Research Notes

Country: Italy | City: Rome (Trigoria district) | Status: **PUBLISH-READY draft (ok=true)**

## Key facts (corroborated)

- **Legal status**: Private university. Wikipedia infobox (citing official/registry data) lists it as established in 1993, Catholic Church-affiliated (Opus Dei-linked founders), located in Rome, ~2,666 students, rector Eugenio Guglielmolli, president Carlo Tosti.
- Some secondary sources describe a Ministerial Decree of legal recognition dated 31 October 1991 and first degree courses (nursing, medicine and surgery) starting October 1993 at a temporary campus (Via Emilio Longoni) before the university hospital was inaugurated in 1994 and the purpose-built Trigoria campus opened in 2008. **1993** was used as the `establishedYear` since that is what the Wikipedia infobox and most secondary sources converge on as the founding/establishment year.
- Campus: a single integrated site in Trigoria (southern Rome, near the Decima Malafede Nature Reserve), combining the "Trapezio" educational complex, the University Hospital, the PRABB biomedical/bioengineering research complex, and CESA (healthcare centre for the elderly).
- Hospital: Campus Bio-Medico University Hospital holds **JCI (Joint Commission International) accreditation**, reconfirmed for multiple three-year cycles per Wikipedia's sourced timeline; assessed against 300+ international quality/safety standards.
- **WDOMS**: listed with status "operational" at https://search.wdoms.org/home/SchoolDetail/F0000269 (confirmed by direct fetch of the page, which contains the literal string "operational").

## Programs

1. **Medicine and Surgery** (standard track) — 6-year single-cycle Master's degree, English-taught. Admission via a university-run English-language written test (NOT the national IMAT). Official non-EU admission page (ay 2025/2026) confirms **36 available places** for non-EU citizens not resident in Italy ("Available places (Ministerial Decree for the allocation of places for ay 2025/2026): 36" — literal table row found via curl fetch).
2. **Medicine and Surgery "MedTech"** (LM-41) — same 6-year MD framework but integrates biomedical-engineering coursework: AI, big data, tissue engineering, biomaterials/bioprinting, nanotechnology, biomedical/surgical robotics, VR/AR. Some classes shared with Engineering students. Students can, with limited extra effort, also earn a Biomedical Engineering bachelor's degree. This is a genuine differentiator versus most other Italian English-medium medical schools.

Both programs' official pages were fetched directly (curl) and cross-checked against Medlink Students' independent summary.

## Tuition — HELD BACK / flagged as unresolved (not fabricated)

- The official "Tuition Fees and Financial Aid" page's visible body text states a flat **EUR 18,000/year**, payable in 3 instalments, for Medicine and Surgery.
- Independent third-party consultancy sites (Medlink Students, Standyou) instead report a differentiated schedule: **EUR 20,000/year (EU)** vs **EUR 25,000/year (non-EU)**.
- These two do not reconcile. Rather than assert either figure as the confirmed non-EU cost (per the "omit rather than fabricate" rule), the draft's `feeNotes` and FAQ explicitly surface both figures, flag the discrepancy, and instruct students to get the current written fee schedule from UCBM's International Admissions Office. No `annualTuitionUsd`/`officialAnnualTuitionAmount` field was populated in `structuredFacts.programs` for either program, consistent with omitting unconfirmed numeric tuition.
- Confirmed (official, undisputed): scholarships covering **up to 50%** of tuition are available, awarded on merit + income, funded by the university, Lazio Region, and partner companies.

## Housing

- **Borgo Primo Centro** — official, university-managed residence/guesthouse, ~800 metres from the University Hospital, set within the Decima Malafede Nature Reserve. 21 accommodation units across 4 types (standard studio, medium studio, two-level duplex, one-bedroom apartment). Contracted directly with Campus Bio-Medico Spa on a periodic basis. Confirmed via direct fetch of the official page.
- Additional third-party/affiliated housing (Affittacamere Trigoria, Spotahome listings, Fondazione RUI halls) exists near campus but was treated as secondary/non-official color, not asserted as an official UCBM offering.

## City / safety / Indian community (Rome)

- Rome general safety: Numbeo (numbeo.com/crime/in/Rome) used as a general, mainstream, frequently-cited safety-data source; exact current numeric index was not extracted/asserted verbatim (page confirmed to exist and carry Crime Index/Safety Index fields), so the safety narrative stays qualitative ("petty theft in crowded tourist/transit areas is the main practical risk, not violent crime") rather than citing a specific index number that could go stale.
- Indian food/community: multiple travel/lifestyle sources describe a meaningful concentration of Indian and South Asian restaurants/grocers around the historic Esquilino/Piazza Vittorio Emanuele district. One search snippet claimed "Rome has over 4,000 Indian restaurants" — this figure is almost certainly wrong/unreliable for a city Rome's size and was **deliberately not used** in the draft; instead the content stays qualitative (Esquilino as a hub, general international-student-network food-sharing groups) without citing that implausible number.
- Trigoria itself is a quieter, greener, more suburban district (also known for being a major football club's training-ground area), a commute from the Esquilino food hub — this trade-off is explicitly flagged in "things to consider."

## NMC/FMGE-NExT / regulatory framing

- No official Indian regulator (NMC) statement specific to this university was found. Only the WHO-affiliated WDOMS "operational" listing was corroborated. The draft explicitly tells students to verify NMC/FMGE-NExT treatment independently before enrolling — this is consistent with the project's hard rule to never assert an unconfirmed regulator claim.

## What was OMITTED and why

- **Precise non-EU tuition figure** — omitted as a single hard number due to an unresolved conflict between the official page's stated EUR 18,000 and third-party EUR 20k/25k figures (see above). Both figures are surfaced with a caveat instead of asserting one.
- **Exact current Rome cost-of-living monthly figure** — no single authoritative, current figure was cross-corroborated in the time available; `cityProfile` stays qualitative on this point and tells students to check up-to-date cost-of-living sources.
- **"4,000 Indian restaurants in Rome" claim** — appeared in one search snippet but is implausible and uncorroborated; excluded entirely.
- **Specific numeric Numbeo crime/safety index for Rome** — page existence and field labels were confirmed by direct fetch, but the exact current numeric score was not extracted/asserted, to avoid citing a number that will drift; kept qualitative instead.
- **NMC/FMGE-NExT recognition status specific to UCBM** — no official Indian regulator source found; not asserted, verify-yourself caveat given instead.

## Sources (all fetched/searched during this research)

1. UCBM — Departmental Faculty of Medicine and Surgery (official program listing): https://www.unicampus.it/en/courses/training-offer/master-s-degree-courses/departmental-faculty-of-medicine-and-surgery/
2. UCBM — Admission for non-EU citizens not resident in Italy, Medicine and Surgery ay 2025/2026 (official; 36 places confirmed): https://www.unicampus.it/en/ammissioni-trasferim/admission-for-non-eu-citizens-not-resident-in-italy-medicine-and-surgery-a-y-2025-2026/
3. UCBM — Admission for non-EU citizens, Medicine and Surgery "MedTech" ay 2026/2027 (official): https://www.unicampus.it/en/ammissioni-trasferim/admission-for-non-eu-citizens-medicine-and-surgery-medtech-a-y-2026-2027/
4. UCBM — CdLM Medicine and Surgery "MedTech" (LM-41) official course page: https://www.unicampus.it/en/courses/training-offer/master-s-degree-courses/departmental-faculty-of-medicine-and-surgery/cdlm-medicine-and-surgery-medtech-lm-41/
5. UCBM — Tuition Fees and Financial Aid (official): https://www.unicampus.it/en/external-student-services/tuition-fees-and-financial-aid/
6. UCBM — Borgo Primo Centro student accommodation (official): https://www.unicampus.it/en/servizi/diritto-allo-studio/alloggi-per-studenti/borgo-primo-centro/
7. UCBM — About Us / Mission and History (official): https://www.unicampus.it/en/ateneo/mission-e-storia/
8. World Directory of Medical Schools — UCBM school detail (status: operational): https://search.wdoms.org/home/SchoolDetail/F0000269
9. Universita Campus Bio-Medico di Roma — Wikipedia (infobox facts): https://en.wikipedia.org/wiki/Universit%C3%A0_Campus_Bio-Medico_di_Roma
10. Campus Bio-Medico University of Rome — Medlink Students (third-party cross-check): https://www.medlinkstudents.com/universities/campus-bio-medico-university-rome/
11. Campus Bio Medico University of Rome — Standyou (third-party cross-check, tuition figures EUR20k/25k): https://www.standyou.com/study-abroad/campus-bio-medico-university-of-rome-italy/
12. Numbeo — Crime in Rome (general safety context source): https://www.numbeo.com/crime/in/Rome
13. Additional context searches (not directly cited in JSON but used to sanity-check/rule out claims): Indian restaurants in Rome roundups (TheFork, TripAdvisor, GoDigit, VaticanTour — used to identify Esquilino as an Indian-food hub, but the implausible "4,000 restaurants" figure from one snippet was rejected); Borgo Primo/Trigoria housing market pages (Residenza Campus, Affittacamere Campus, Spotahome, Fondazione RUI) — used only as secondary color on the housing market near campus, not as primary sourcing for official UCBM content.

## Gate check performed

`node -e` validation script run against the JSON confirmed: parses as valid JSON; all 8 narrative `draftContent` fields present and non-empty with none matching the weak-content-marker regexes used by `publish-university-draft.ts`; 11 sources (>=2); 2 programs each with `courseSlug` (`mbbs`), `title`, `officialProgramUrl`, `medium`, `durationYears`; `bestFitFor` (5), `whyChoose` (5), `thingsToConsider` (5), `faq` (9) all exceed their >=3 minimums; `countrySlug` = "italy"; `type` = "Private"; `establishedYear` = 1993 (number); `officialWebsite` populated.
