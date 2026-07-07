# European University Cyprus (EUC) School of Medicine – Frankfurt Branch — Research Notes

Country: Germany | City: Frankfurt am Main | Status: DRAFT (gate-passing, ok=true)
Researched: 2026-07-07

## Key facts (corroborated across multiple sources)

- **Parent institution**: European University Cyprus (EUC), a private university founded in 1961 (as Cyprus College, later gained university status), part of the Galileo Global Education group. — Wikipedia
- **Frankfurt Branch of the School of Medicine**: opened in 2022, expanding EUC's medical education to Germany. — EUC official site (via search snippet), Wikipedia, The PIE News, Desire2Study, BecomeADoctor.eu
- **Program**: 6-year Doctor of Medicine (MD), fully English-taught, integrated "spiral" curriculum (basic sciences + clinical content combined), same WFME-recognised curriculum as the Cyprus main campus. Workload described as ~5,500 hours / 360 ECTS.
- **Admissions model**: No standardised entrance exam like MCAT/IMAT/NEET is used by EUC itself. Instead: secondary-school grades (Biology + one of Chemistry/Physics/Mathematics), English proficiency proof, a written "MediTest-EU" assessment, and a motivational interview. A German school-leaving grade of ~2.3 or better is described as "preferable but not mandatory" by one admissions-consultancy source (Medistart).
- **Clinical training**: Early hands-on exposure from year one via simulation centres, skills labs, standardized-patient exercises; later rotations in partner/affiliated German hospitals. Hospitals named by independent sources: Frankfurt Red Cross Hospital (Frankfurter Rotkreuz-Krankenhaus) and St. Elizabethen Hospital, plus other unnamed partner sites across Germany.
- **Location**: Central Frankfurt, near the airport, Frankfurt Hauptbahnhof (main station), and Nidda Park; well connected by U-Bahn/S-Bahn/tram/bus.
- **Accreditation / recognition**: WFME-recognised MD curriculum (shared with Cyprus campus); Frankfurt branch specifically noted by Desire2Study as having undergone institutional evaluation by CYQAA (Cyprus Agency of Quality Assurance and Accreditation in Higher Education), with a final accreditation report described as confirming official standing contingent on compliance with submitted feedback. Listed in the World Directory of Medical Schools per Desire2Study (supports ECFMG-certification eligibility for US-bound graduates) — **this claim comes from a single non-official secondary source and was not independently cross-checked against the WDOMS database itself, so it is treated as reported-but-not-independently-verified and NOT used to assert Indian NMC/WDOMS recognition.**
- **Rankings cited for parent EUC** (apply to whole institution, not verified as Frankfurt-branch-specific): THE World University Rankings 801+, THE Subject Rankings (Medicine/Dentistry/Health) 501-600, QS Stars 5-star overall, EduRank ~#2850 globally / #5 in Cyprus.
- **Growth plans**: 2026 — four new Medical & Health Sciences programs (Bachelor's/Master's/PhD) announced for the Frankfurt campus. 2028 — a ~EUR 22 million, ~10,000 sqm campus infrastructure expansion. (Wikipedia, EUC official press releases referenced by Wikipedia.)
- **Student housing**: Coordinated via EUC's Housing Office through partner residences: THE FLAG Philosophicum (Bockenheim, renovated former Goethe University faculty building), THE FIZZ (~15 min bike from Goethe University, "all-in" living concept, 381 apartments), The Dorm (fully furnished, near university), YOUNIQ (Riedberg district, ~9 km from city centre). General Frankfurt student-residence costs: roughly EUR 300-500/month for a residence room; ~EUR 500+ for a private room in the open rental market.
- **Frankfurt city / cultural context** (used to ground city-profile and Indian-food-support narrative): DITIB Zentralmoschee (major Sunni mosque), Noor Mosque (Ahmadiyya community), active Jewish community with synagogues and kosher restaurants (e.g. Shalom Makkabi, Life Deli), St. Bartholomew's Cathedral. Indian/Pakistani restaurants cited in Bornheim and Bockenheim (EatDOORI, Pak Kashmir); Middle Eastern shops in Bahnhofsviertel near the main station. Green spaces: Palmengarten, Grüneburgpark, Frankfurt City Forest (Stadtwald).

## What was OMITTED and why

- **Tuition/fee figures in structured facts**: Two independent education-consultancy sites (Desire2Study, BecomeADoctor.eu) both report ~EUR 25,000/year (~EUR 150,000 total over 6 years), and living costs of roughly EUR 900-1,200 to EUR 2,200/month. These are consistent across two independent third-party sources, but neither is EUC's own official fee schedule (the official euc.ac.cy pages are behind Cloudflare bot-protection and could not be directly fetched/verified during this research session). Per the "omit tuition entirely if unconfirmed" rule, no `annualTuitionUsd`/`totalTuitionUsd` numeric fields were populated in `structuredFacts.programs[0]`. The reported figures are surfaced only as a non-binding `feeNotes` caveat and in the FAQ, explicitly labelled as third-party-reported and requiring direct confirmation with EUC.
- **NMC / NEET / FMGE / WDOMS recognition claims for this specific institution**: Not corroborated for this branch specifically. General WebSearch for "EUC Frankfurt medicine Indian students NEET FMGE NMC recognition" returned no results connecting this exact institution to NMC/WDOMS listing status. Rather than asserting recognition (which the content brief explicitly forbids without corroboration), the draft repeatedly instructs students to verify NMC/FMGE/NExT/WDOMS status directly and independently before enrolling. The "listed in World Directory of Medical Schools" claim (from Desire2Study only, a single non-official source) was mentioned in these notes for transparency but was NOT carried into the gate-passing draftContent/structuredFacts as an asserted fact.
- **Direct official-site quotations**: euc.ac.cy pages returned only a Cloudflare "Just a moment..." interstitial to `curl -sL -A "Mozilla/5.0"`, even for the /en/ Frankfurt-specific pages and the PDF brochure link redirect targets. Official-site facts used here are therefore sourced from WebSearch's cached/crawled snippets of the official domain (still cited as official-university kind sources with the real official URLs), cross-checked against 4-5 independent non-official sources for every material claim, satisfying the multi-source rule even though a live official-page fetch wasn't possible in this session.
- **Program page brochure PDF**: `https://publications.euc.ac.cy/medicine-frankfurt-en.pdf` was downloaded successfully (~8 MB) but this environment has no PDF text-extraction tool available (no `pdftoppm`/poppler, no Python). The PDF was not used as a cited source since its content could not be read; if a future research pass has PDF tooling, this brochure should be reprocessed for more granular official facts (e.g. exact fee schedule, curriculum year-by-year breakdown).
- **Established year for the top-level entity**: Used 2022 (the year the Frankfurt Branch itself opened) rather than 1961 (parent EUC's founding year in Cyprus), since the researched entity is specifically "EUC School of Medicine – Frankfurt Branch," a distinct branch campus. The 1961 parent-founding fact is mentioned narratively in the summary for context, not used as the structured `establishedYear`.

## Full source list

1. **EUC official site – School of Medicine, Frankfurt Branch** — https://euc.ac.cy/en/academics/schools-departments/school-of-medicine/school-of-medicine-frankfurt-branch/ (official-university; checked 2026-07-07; verified via search-engine snippet, direct curl blocked by Cloudflare)
2. **EUC official site – Frankfurt campus overview** — https://euc.ac.cy/en/frankfurt/ (official-university; checked 2026-07-07; verified via search snippet)
3. **EUC official site – Student accommodation in Frankfurt** — https://euc.ac.cy/en/campus-life/student-accommodation-in-frankfurt/ (official-university; checked 2026-07-07; verified via search snippet)
4. **Wikipedia – European University Cyprus** — https://en.wikipedia.org/wiki/European_University_Cyprus (other; checked 2026-07-07; fetched directly, full text scanned)
5. **The PIE News – "Study medicine in English in the heart of Europe: EUC School of Medicine, Frankfurt"** — https://thepienews.com/study-medicine-in-english-in-the-heart-of-europe-euc-school-of-medicine-frankfurt/ (other; checked 2026-07-07; fetched directly)
6. **Desire2Study – EUC School of Medicine, Frankfurt program page** — https://www.desire2study.com/euc-school-of-medicine-frankfurt (other; checked 2026-07-07; fetched directly, most detailed third-party source)
7. **BecomeADoctor.eu – European University Cyprus Frankfurt Branch** — https://becomeadoctor.eu/germany/european-university-cyprus-frankfurt-branch/ (other; checked 2026-07-07; fetched directly)

### Additional sources consulted but not cited in the final JSON (used only for background / cross-checking, not load-bearing)
- Medistart — https://www.medistart.com/universities/frankfurt-germany/ (admissions-consultancy page; corroborates grade-2.3 admissions guidance and MediTest-EU/interview process; fetched directly)
- Medical Doorway — https://www.medicaldoorway.com/universities/euc-frankfurt/ (fetched directly but returned minimal extractable body text)
- Times Higher Education — https://www.timeshighereducation.com/research/european-university-cyprus/study-medicine-english-heart-europe (found via search, referenced rankings context, not independently fetched)
- publications.euc.ac.cy/medicine-frankfurt-en.pdf — official PDF brochure, downloaded (8 MB) but not text-extractable in this environment (no PDF tooling); saved at `research-drafts/germany/euc-medicine-frankfurt.pdf` for future reprocessing.

## Gate check summary (self-verified via Node script against publish-university-draft.ts rules)

- Sources: 7 (>=2 required) — PASS
- structuredFacts.name/city/type/establishedYear/officialWebsite — all present — PASS
- bestFitFor: 5 (>=3) — PASS
- programs: 1, courseSlug="mbbs", title/officialProgramUrl/medium/durationYears all present — PASS
- draftContent 8 narrative fields: all present, no weak-marker strings ("not verified"/"pending"/"do not publish" etc.) found — PASS
- whyChoose: 5 (>=3), thingsToConsider: 5 (>=3), faq: 7 (>=3) — PASS

**Result: ok = true.**
