# Kauno Kolegija (Kaunas University of Applied Sciences) — Faculty of Medicine, General Practice Nursing

Research date: 2026-07-07
Country: Lithuania | City: Kaunas
Status: PUBLISH-READY draft (ok=true) — see `kauno-kolegija-kaunas-university-of-applied-sciences.json`

## Key facts (corroborated, multi-source)

- **Institution type:** Public (state) multi-profile university of applied sciences (Lithuanian: *kolegija*).
- **Established:** 2000, as part of Lithuania's binary higher-education reform (colleges vs. universities). Some constituent schools have earlier roots — e.g., nursing-education courses tracing to short-term midwifery courses started in 1920 and the 1941 Kaunas School of Nursing lineage (per secondary sources; not independently re-verified from a primary Kauno Kolegija history page, so this detail was **omitted** from the published narrative to stay conservative — only the "established 2000" fact, which is stated directly on the official About Us page, is used).
- **Scale:** ~4,900–5,500 students (official "Main facts" page says 4,900+; Study in Lithuania says ~5,500), 40+ study programmes (11 in English), ~552–650 academic staff (two sources, slightly different because collected at different times), 17 academic buildings, 70 workshops/labs, 5 dormitories, 200+ foreign partner institutions in 38 countries.
- **Campuses:** Kaunas main campus, plus regional departments in Alytus and Tauragė.
- **Faculty of Medicine:** Runs Health Sciences programmes. (Note: `hesdia.kaunokolegija.lt/faculty-of-medicine/` is NOT the actual faculty homepage — it is a conference microsite ("HESDIA" conference) that happens to live on a subdomain containing "faculty-of-medicine" in its slug. This was identified during research and NOT used as a source for faculty facts; the "About us" and "Why Kauno kolegija" pages on the main `kaunokolegija.lt` domain were used instead.)
- **Only clinically relevant programme for India-outbound students:** General Practice Nursing (Professional Bachelor of Health Sciences). No MBBS, pharmacy, or BDS at this institution.

## Programme: General Practice Nursing

| Field | Value | Source |
|---|---|---|
| Duration | 3.5 years, 7 semesters, 210 ECTS | Official apply portal + Study in Lithuania |
| Language of instruction | English | Official apply portal + Study in Lithuania |
| Qualification | Professional Bachelor of Health Sciences | Official apply portal |
| Tuition | EUR 3,100/year (same for EU and non-EU) | Official apply portal + Study in Lithuania (independent corroboration) |
| Application fee | EUR 120 one-time, non-refundable, invoiced only after document pre-approval | Official apply portal |
| Intake | 2026/27 cohort starts 1 Sept 2026 (application period for that cohort had already closed at time of research) | Official apply portal |
| English requirement | IELTS ≥5.5 / TOEFL ≥75 / PTE ≥59 / EnglishScore 400-499 / CEFR ≥B2; university's own paid English test (EUR 45) available if no certificate; MOI letter explicitly NOT accepted | Official apply portal |
| Other admission requirements | Notarized secondary/university documents (≥50% GPA), passport copy, motivation letter/interview, ≥1 reference, key-competence test | Official apply portal |
| Curriculum structure | Semester-by-semester breakdown (Anatomy/Physiology/Pathology, Pharmacology, Microbiology, General/Therapeutic/Surgical/Geriatric/Maternity/Children's/Community/Mental Health Nursing, Emergency & Intensive Care, Applied Research) with a nearly continuous internship sequence from semester 1 through 7 | Study in Lithuania (detailed semester list) |
| Clinical placement levels | First-level practice centres, second-level hospitals, third-level (tertiary) hospital departments | Study in Lithuania + official apply portal (career/description text) |
| Career/further study | Graduates can seek employment in healthcare service departments (Lithuania/international); can progress to first/second-cycle university studies in Nursing, Ecology, Public Health, Environmental Health | Study in Lithuania |

## Dormitories (official site, `kaunokolegija.lt/en/dormitories-2/`)

Five dormitories total:
- No. 1 — Taikos Ave. 121, Kaunas (up to 300 students)
- No. 2 — V. Krėvės Ave. 92, Kaunas (~320 students)
- No. 3 — V. Krėvės Ave. 90, Kaunas (280 students)
- No. 4 — Kalniečių St. 126, Kaunas (~200 students, partially renovated)
- No. 5 — Studentų St. 14, Alytus (~150 students, serves the Alytus department only)

Pricing (per room type, monthly): triple rooms ~EUR 75-90; double rooms ~EUR 80-140 (varies by dormitory); block-type rooms with private facilities ~EUR 135-155; single rooms (where available) EUR 180. Plus: refundable EUR 200 security deposit, EUR 20 key/access-card fee, optional paid extras (laundry ~EUR 3-5/wash+dry, bedding rental EUR 20/month, small appliance rentals). Reservation via the university's "eDormitory" online system (`ebendrabutis.kaunokolegija.lt`), available to matriculated students and Erasmus+ exchange students; non-Kauno-Kolegija guests contact accommodation services directly.

## City: Kaunas

- Second-largest city in Lithuania (pop. 304,198 as of 2024, per Wikipedia/official statistics), fourth-largest in the Baltic states.
- Located at the confluence of the Nemunas and Neris rivers.
- Served as Lithuania's temporary capital 1920–1939 (while Vilnius was under Polish control), leaving a large stock of interwar Art Deco / National Revival architecture.
- UNESCO World Heritage Site since 2023: "Modernist Kaunas: Architecture of Optimism, 1919–1939."
- Joint European Capital of Culture, 2022.
- Home to several major Lithuanian universities (Vytautas Magnus University, Kaunas University of Technology, LSMU, and others), giving it a large resident student population.

## What was OMITTED (and why)

- **Detailed institutional history / merger lineage of individual faculties** (e.g., "nursing courses since 1920," "Faculty of Technologies from a 1945 Pulp and Paper School," etc.) — found repeatedly across secondary aggregator sites (e.g., Wikipedia-style summaries reproduced by hetdynamic.com, educationeureka.com) but not independently confirmed on a primary Kauno Kolegija history page during this research pass. Only the "established 2000" fact — which IS stated directly on the official About Us page — was retained. This is a conservative omission, not a fabrication risk, since the core facts used are official-source-backed.
- **Tuition fee for 2027/28 or later intakes** — not published yet; the JSON explicitly flags that the EUR 3,100/year figure is "at time of research" and should be reconfirmed.
- **Named teaching-hospital partnerships** — the official sources describe placement *levels* (primary/secondary/tertiary) but do not name specific partner hospitals for the nursing programme, so `teachingHospitals` was left empty in structuredFacts rather than invented.
- **INC (Indian Nursing Council) recognition status** — deliberately NOT asserted as automatic or guaranteed anywhere in the content. Every mention frames it as a case-by-case equivalence process that students must verify directly with INC, consistent with the sourcing rule for nursing programmes.
- **Specific Indian student community size/data in Kaunas** — no hard numbers found; described qualitatively and conservatively ("smaller than major European study hubs") rather than invented statistics.
- **"Faculty of Medicine" as its own branded webpage** — could not find a real, distinct Faculty of Medicine landing page on `kaunokolegija.lt` during this pass (the Health Sciences / Faculty of Medicine content is folded into the general "About us," "Why Kauno kolegija," and programme-specific pages, plus the `studiju-programos` programme listing). The `hesdia.kaunokolegija.lt/faculty-of-medicine/` URL that surfaced in search results is a conference microsite, not the faculty's real homepage, and was excluded as a source for faculty facts (noted above).

## Full source list (8 sources, ≥2 required, multiple independent origins: official application portal, official institutional site, Lithuanian government-affiliated national portal, and Wikipedia for city facts)

1. Kauno kolegija official application portal — General Practice Nursing course page — https://apply.kaunokolegija.lt/courses/course/25-general-practice-nursing (official-program)
2. Kauno kolegija official site — About us — https://www.kaunokolegija.lt/en/about-us/ (official-university)
3. Kauno kolegija official site — Main facts — https://www.kaunokolegija.lt/en/main-facts/ (official-university)
4. Kauno kolegija official site — Dormitories — https://www.kaunokolegija.lt/en/dormitories-2/ (official-university)
5. Kauno kolegija official site — Why Kauno kolegija? — https://kaunokolegija.lt/english/why-kauno-kolegija/ (official-university)
6. Study in Lithuania — General Practice Nursing programme profile — https://studyin.lt/programs/general-practice-nursing/ (government/national portal)
7. Study in Lithuania — Kauno kolegija institution profile — https://studyin.lt/institutions/kauno-kolegija-higher-education-institution/ (government/national portal)
8. Wikipedia — Kaunas (city) — https://en.wikipedia.org/wiki/Kaunas (secondary, city-context facts only)

## Gate self-check (against `scripts/publish-university-draft.ts` validation logic)

- countrySlug = "lithuania" — OK
- sourceBundle.sources: 8 (>=2 required) — OK
- structuredFacts.name, city, type (Public), establishedYear (2000, number), officialWebsite — all present — OK
- bestFitFor: 4 entries (>=3) — OK
- programs: 1 entry with explicit courseSlug "bsc-nursing" (valid enum value), title, officialProgramUrl, medium ("English"), durationYears (3.5) — OK
- draftContent: all 8 narrative fields present, non-empty, checked against the weak-marker regex list (pending official-source research / not yet verified / internal draft / needs official.../ still needs / before publication / do not publish...) — none matched — OK
- whyChoose: 5 (>=3) — OK
- thingsToConsider: 6 (>=3) — OK
- faq: 7 (>=3) — OK

Verified programmatically with `node -e "JSON.parse(...)"` plus a small script re-implementing the gate checks against the saved JSON — all checks passed.
