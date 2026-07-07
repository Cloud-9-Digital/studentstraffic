# Research Document: Università Cattolica del Sacro Cuore - Faculty of Medicine and Surgery (Rome campus / Gemelli)

Country: Italy | City: Rome (Monte Mario) | Status: PUBLISH-READY DRAFT (ok=true)
Researched: 2026-07-07
Draft JSON: `research-drafts/italy/universita-cattolica-del-sacro-cuore-faculty-of-medicine-and-surgery-rome-campus-gemelli.json`

## Method note

WebFetch is blocked in this environment. Direct `curl -sL -A "Mozilla/5.0"` fetches of the
key official pages (unicatt.it, international.unicatt.it, search.wdoms.org) returned only
JavaScript-rendered shells (page `<title>` resolved but body text did not render — confirmed
by inspecting saved HTML, which contained no readable article text after stripping tags).
Because of this, all facts attributed to unicatt.it / international.unicatt.it below come from
WebSearch's page-summary excerpts of those exact URLs (WebSearch fetches and reads live pages
server-side), cross-checked against independent third-party sources wherever possible. This is
flagged explicitly rather than treated as a raw first-party fetch.

## Key facts (corroborated)

- **Parent university**: Università Cattolica del Sacro Cuore (UCSC), founded 7 December 1921 in
  Milan by Fr. Agostino Gemelli and a group of Catholic academics (Ludovico Necchi, Francesco
  Olgiati, Armida Barelli, Ernesto Lombardo). Widely described as the largest private, non-profit
  university in Europe, with campuses in Milan, Rome, Brescia, Piacenza, Cremona, and Bolzano.
  (Wikipedia; multiple aggregator sources.)
- **Rome campus / Faculty of Medicine**: the property at Monte Mario was made available to the
  Giuseppe Toniolo Institute by Pope Pius XI in 1934; the Faculty opened to students on
  5 November 1961 (official `roma.unicatt.it` campus-history page, via WebSearch summary).
  Because this draft specifically targets the Rome Faculty of Medicine and Surgery (not the
  wider 1921 university), `structuredFacts.establishedYear` is set to **1961**.
- **Teaching hospital**: Fondazione Policlinico Universitario Agostino Gemelli — construction
  from 1959/1962, inaugurated 10 July 1964; widely cited at ~1,575 beds, the second-largest
  hospital in Italy and the largest in Rome; recognised as an IRCCS (scientific-research
  hospital institute) in 2018. Named after founder Agostino Gemelli. (Policlinico Gemelli
  official history page; Wikipedia.)
- **Programme**: Medicine and Surgery, 6-year single-cycle MD, taught entirely in English.
  University states the programme is curriculum-aligned with European/US standards and
  references USMLE-relevant preparation. Students reportedly begin clinical/hospital exposure
  from the early years of the course because the Faculty sits alongside the Gemelli complex.
  International students reportedly come from 15+ countries per intake year.
- **Admission**: university-run English-language written test (NOT the national IMAT) — 65
  multiple-choice questions across biology, chemistry, physics, maths, critical thinking/problem
  solving, plus (per one third-party source, AcadIMAT) a small number of Catholic-tradition-
  related questions, consistent with the university's Catholic character. Minimum passing score
  reported as 20/65. Non-EU citizens residing abroad have a separate ranking list.
- **Non-EU seats**: sources disagree by cycle — Medlink Students (older data) cites 30 EU + 50
  non-EU seats; a more recent consultancy source (via WebSearch) cites 40 EU + 70 non-EU seats
  for AY 2025/26 and 70 non-EU seats for AY 2026/27. Both are reported in the draft with explicit
  cycle framing; no single current figure is asserted. Seats are set annually by Italian
  Ministerial Decree.
- **Tuition**: EUR 18,150/year, described as flat regardless of nationality, corroborated by two
  independent third-party sources (TopUniversities/Bachelorsportal listing; Medlink Students),
  both apparently referencing the official fee schedule. Could not be directly confirmed via a
  raw fetch of the official fees page (JS-rendered, no static text). Reported as
  reliable-but-not-firsthand-confirmed in the draft, with an explicit "reconfirm before
  budgeting" caveat.
- **Scholarships**: not reconciled across sources. One source (via WebSearch, referencing the
  official fees/scholarships page as of ~March 2026) states no scholarships/fee waivers
  currently apply to this specific programme. Other sources describe a general Cattolica
  merit-based scholarship (up to 30% of tuition, renewed annually) and a separate "UCSC
  International Scholarship" (37% of tuition) for international students, without specifying
  whether Medicine and Surgery is eligible. Draft content flags this explicitly and tells
  students to verify directly.
- **Accommodation**: coordinated via Cattolica International's Rome accommodation page and the
  university-wide EDUCatt housing service — mix of on-campus/off-campus options, partner
  housing-search platforms (Dotstay, Roomtastic, Gromia), and partner residence providers
  (In-Domus, Camplus colleges).
- **City / campus setting**: Monte Mario, Rome's highest hill, in the Balduina/Monte Mario area —
  described by local-area guides (Wanted in Rome, An American in Rome) as a quiet, established,
  largely residential district with long-term professional/diplomatic residents, adjacent to the
  Monte Mario Nature Reserve; roughly 15 minutes by bus to Vatican City, ~30 minutes to Rome's
  historic centre.
- **Recognition**: third-party sources (Medlink Students, edu-mentor) describe the medical degree
  as WHO/World Directory of Medical Schools (WDOMS)-recognised and UK GMC-recognised. Could NOT
  independently confirm a specific WDOMS school-record ID via curl — one candidate ID
  (F0000743) returned a client-side-rendered shell with no readable school name, and another
  guessed ID (F0001033) resolved to an unrelated Rome university (Tor Vergata), confirming
  search.wdoms.org's school-detail pages are JS/API-driven and not scrapable via plain curl in
  this environment. The draft therefore cites the general wdoms.org homepage rather than
  asserting an unverified specific school-record URL, and frames WDOMS/GMC recognition as a
  third-party claim, not directly verified.

## What was OMITTED and why

- **A specific WDOMS school-detail URL/ID** — omitted because it could not be verified
  (see above); general wdoms.org homepage cited instead, and recognition is framed as a
  third-party claim rather than a confirmed regulator record.
- **A single definitive non-EU seat count for the current (2026/27-facing) cycle** — omitted in
  favor of reporting the range/discrepancy across sources with cycle labels, per the
  exhaustive-then-omit / never-fabricate rule.
- **A single definitive scholarship eligibility statement for Medicine and Surgery specifically**
  — omitted because sources conflict (one says none apply, others describe general scholarships
  without confirming programme eligibility); both are reported, framed as unreconciled, with a
  verify-directly instruction.
- **NMC/FMGE-NExT university-specific regulatory statement** — omitted; only the general NMC
  framework (2021 minimum-standards regulations: ≥54 months training, 12-month internship,
  English medium) is mentioned per India-audience content rules, with an explicit
  verify-yourself caveat, since no official Indian regulator source naming this specific
  university could be found.
- **Exact current monthly cost-of-living figures for Rome** — omitted; general "Rome is more
  expensive than smaller Italian university towns" framing used instead, with a caveat to check
  current cost-of-living sources.
- **A specific residence-hall name/address for Cattolica Rome medicine students** — no single
  authoritative source named one; the draft instead describes the EDUCatt housing-service
  structure and named partner platforms/providers that were corroborated.

## Sources (all checked 2026-07-07)

1. Università Cattolica - Medicine and Surgery (Rome), official programme page —
   https://international.unicatt.it/ucscinternational-undergraduate-programs-medicine-and-surgery
2. Università Cattolica - Admission and tuition, Medicine and Surgery Rome, official —
   https://international.unicatt.it/ucscinternational-medicine-and-surgery-application-procedures
3. Università Cattolica - Tuition fees and scholarships, official —
   https://international.unicatt.it/ucscinternational-applications-tuitions-tuition-fees-and-scholarships-3074
4. Università Cattolica - Accommodation in Rome, official —
   https://international.unicatt.it/ucscinternational-roma-accommodation
5. Università Cattolica - Medicine and Surgery, Rome, official corso page —
   https://www.unicatt.it/corsi/triennale/medicine-and-surgery-roma.html
6. Università Cattolica - Policlinico Gemelli University Hospital sub-page, official —
   https://www.unicatt.it/corsi/triennale/medicine-and-surgery-roma/cattolica-md-international-programme/policlinico-gemelli-university-hospital.html
7. Roma Unicatt - Il Campus di Roma (official campus history) —
   https://roma.unicatt.it/il-campus-storia-del-campus
8. Policlinico Universitario Agostino Gemelli IRCCS - History and Future, official —
   https://www.policlinicogemelli.it/en/information/history-future/
9. Gemelli University Hospital - Wikipedia —
   https://en.wikipedia.org/wiki/Gemelli_University_Hospital
10. Università Cattolica del Sacro Cuore - Wikipedia —
    https://en.wikipedia.org/wiki/Universit%C3%A0_Cattolica_del_Sacro_Cuore
11. Università Cattolica del Sacro Cuore Rome Campus - Medlink Students (third-party) —
    https://www.medlinkstudents.com/universities/catholic-university-sacred-heart-medicine/
12. Medicine and Surgery (Rome campus) - TopUniversities listing (third-party) —
    https://www.topuniversities.com/universities/universita-cattolica-del-sacro-cuore/undergrad/medicine-surgery-rome-campus
13. Wanted in Rome - Balduina and Monte Mario area guide (third-party) —
    https://www.wantedinrome.com/area/balduina-monte-mario
14. An American in Rome - Best Rome Neighborhoods for Students (third-party) —
    https://anamericaninrome.com/2017/09/best-rome-neighborhoods-students/
15. Numbeo - Crime in Rome (independent city safety index) —
    https://www.numbeo.com/crime/in/Rome

Additional sources consulted for cross-checking but not cited in the final sourceBundle
(context/triangulation only): AcadIMAT interview/blog pages on Cattolica admissions and IMAT
exam structure; edu-mentor.com India-facing MBBS/NMC pages; Bachelorsportal programme listing;
Standyou Italy study-abroad page; policlinicogemelli.it academic-education page (thin content on
direct fetch, superseded by the History and Future page above).

## Gate check (self-verified against scripts/publish-university-draft.ts validateDraft)

- sourceBundle.sources: 15 (>=2 required) — pass
- structuredFacts.name/city/type/establishedYear/officialWebsite: all present — pass
- structuredFacts.bestFitFor: 5 items (>=3 required) — pass
- structuredFacts.programs: 1 program, courseSlug "mbbs", title, officialProgramUrl, medium,
  durationYears all present — pass
- draftContent 8 narrative fields: all present, non-empty, scanned for weak markers
  ("pending official-source research", "not yet verified", "internal draft", "needs official",
  "still needs", "before publication", "do not publish") — none found — pass
- draftContent.whyChoose: 5 (>=3) — pass
- draftContent.thingsToConsider: 5 (>=3) — pass
- draftContent.faq: 9 (>=3) — pass
- JSON parses via `node -e "JSON.parse(...)"` — confirmed pass
