# Šiauliai State University of Applied Sciences (Šiaulių valstybinė kolegija) — Research Record

Country: Lithuania | City: Šiauliai | Status: PUBLISH-READY (gate passed)
Researched: 2026-07-07

## Key facts (corroborated)

- Official name: Šiauliai State University of Applied Sciences (Šiaulių valstybinė kolegija / Higher Education Institution, "ŠVK")
- Type: Public (state) higher education institution
- Established: 2002, by order of the Lithuanian Ministry of Education and Science, merging Šiauliai Higher School of Medicine and Šiauliai Higher Technical School into "Šiauliai College". The medicine school itself traces back to a 1946 Nursing School (became a High School of Medicine in 1991). Reorganized into "Šiauliai State College" (public institution) in 2010 under Government Resolution No. 421.
- Official website: https://svako.lt/en
- Scale (official facts-and-figures page, as of Dec 2024): ~1,747 students; 22 study programmes; 546 new first-years in Sept 2024; ~60% on state-funded places; ~40% of graduates employed on graduation day; 98 teachers, 176 staff (Jan 2024); 170+ international cooperation agreements across 38 countries.
- Recognitions: Erasmus+ Charter for Higher Education 2021-2027 (max evaluation score); founding member of the NEOLAiA European University Alliance (EUR 14m+ EU funding, 2023); a Faculty of Health Care lecturer won Sweden's Queen Silvia Nursing Award (Sept 2025) for a 24-hour caregiver helpline concept.
- City: Šiauliai — one of Lithuania's largest cities in the country's north; ŠVK is the only state higher-education institution in Šiauliai county providing college-level education (per official history page). Independently described by the government-backed Study in Lithuania portal as "safe, welcoming, and affordable."

## Programs found

The Faculty of Health Care runs four programmes: **Cosmetology**, **General Practice Nursing**, **Odontological Care**, and **Physiotherapy**.

- **General Practice Nursing** — the ONLY one published here.
  - 3.5 years full-time, 210 ECTS, national code 6531GX030.
  - Language of instruction: official curriculum page says "Lithuanian, English"; the official 2026/27 international-admission fee table lists English as the instruction language for the international track.
  - Awarded qualification: Professional Bachelor of Health Sciences, General Practice Nurse.
  - Ten compulsory + three elective clinical practices (community, geriatric, therapeutic, surgical, obstetric, child health, mental health, urgent/intensive care nursing), final practice + graduation paper.
  - Official 2026/27 international tuition: **EUR 3,400/year**.
  - Department contact: Nursing and Oral Care Department, Head Dr. Jurgita Vorevičienė (j.voreviciene@svako.lt).

- **Odontological Care** (dental assistant/nurse programme) — found but OMITTED. Reason: Lithuanian-only medium (not offered in English per the curriculum page), and it is a dental-assistant/nurse qualification, not a dentist (BDS-equivalent) degree — does not map to the `bds` course slug or any Indian-audience-relevant medical/dental degree. Including it would misrepresent the level of qualification.
- **Cosmetology** — found but OMITTED. Not a match for any of the five permitted course slugs (mbbs, medical-pg, bsc-nursing, pharmacy, bds); also not confirmed English-medium for international admission.
- **Physiotherapy** — found (listed on the Health Sciences programme page) but OMITTED. Its individual programme page was not fetched/verified in this research pass (time-boxed to the requested scope), and physiotherapy has no corresponding course slug in the permitted list `{mbbs, medical-pg, bsc-nursing, pharmacy, bds}` — so it could not be published as a program even if verified.
- No MBBS, Medical PG, Pharmacy, or BDS (dentist-level) programme was found at this institution. None is fabricated or implied.

## What was omitted and why

- **INR tuition conversion**: omitted. No official INR figure is published by ŠVK; only the EUR 3,400/year official figure is used, with an explicit instruction for students to convert at a current exchange rate and reconfirm with admissions.
- **NMC/PCI/NExT/FMGE regulator framing**: not applicable/not asserted — this is a nursing (not MBBS/pharmacy) programme, so the correct Indian regulator context is the Indian Nursing Council (INC), not NMC. INC recognition is explicitly NOT asserted as automatic; the honest, sourced caveat (case-by-case equivalence under Section 11(2)(a) of the INC Act) is used instead, grounded in the official INC equivalency page.
- **Named clinical/teaching-hospital partners**: omitted/not named. The official programme page describes only the *categories* of placement sites (primary/secondary/tertiary health-care institutions, social-service/care-home institutions in the region) without naming specific hospitals. The teachingHospitals field in the JSON reflects this honestly rather than inventing hospital names.
- **Odontological Care, Cosmetology, Physiotherapy programmes**: omitted from `structuredFacts.programs` — see reasons above (language medium and/or no matching course slug, and/or not independently verified against the individual programme page in this pass).
- **Specific Indian-student community/food details**: no dedicated Indian mess, dining hall, or Indian student society was found in ŠVK's official materials (unlike, e.g., the UMCH Hamburg profile which does document a South Asian Student Society). The `indianFoodSupport` field is grounded honestly in general dormitory self-catering facilities and Šiauliai's smaller-city profile, with a clear instruction for students to verify current food-access options themselves.

## Sources (all checked 2026-07-07)

1. ŠVK Homepage — https://svako.lt/en (official-university)
2. ŠVK Study Programmes: Health Sciences — https://svako.lt/en/degree-studies/study-programmes/health-sciences (official-program)
3. ŠVK General Practice Nursing programme page — https://svako.lt/en/degree-studies/study-programmes/health-sciences/general-practice-nursing (official-program)
4. ŠVK Admission (2026/2027 international fee table) — https://svako.lt/en/degree-studies/admission (official-fee)
5. ŠVK Accommodation (Student's Guide) — https://svako.lt/en/students-guide/accommodation-en (official-university)
6. ŠVK History (About Us) — https://svako.lt/en/about-us/history (official-university)
7. ŠVK Facts and Figures (About Us) — https://svako.lt/en/about-us/facts-and-figures (official-university)
8. Study in Lithuania — ŠVK institution profile (government-backed national portal) — https://studyin.lt/institutions/siauliaistateuas/ (government)
9. Indian Nursing Council — Equivalency (foreign nursing qualifications) — https://www.indiannursingcouncil.org/equivalency (government)

Additional pages fetched/consulted for cross-checking (not cited as standalone sources in the JSON, but reviewed): svako.lt/en/degree-studies/study-programmes/health-sciences/odontological-care (confirms Lithuanian-only medium, dental-assistant level qualification); svako.lt/en/students-guide/student-life (thin, JS-driven — no material facts extracted); WebSearch results referencing beyondthestates.com, standyou.com, unirank.org, 4icu.org, old.studyin.lt (independent aggregators, used only for triangulation, not cited as primary sources since they were not individually fetched in full).

## Gate check summary

- countrySlug: "lithuania" ✓
- sourceBundle.sources: 9 (>= 2), each with label/url/kind/checkedAt ✓, includes official site ✓
- structuredFacts: name, city, type=Public, establishedYear=2002 (number), officialWebsite, bestFitFor (4 items), programs (1 item: bsc-nursing) ✓
- Program has courseSlug (bsc-nursing, valid enum), title, officialProgramUrl, medium, durationYears (3.5) ✓
- draftContent: all 8 narrative fields present, non-empty, no weak markers (verified via regex) ✓
- whyChoose: 4 (>=3) ✓; thingsToConsider: 5 (>=3) ✓; faq: 6 (>=3) ✓
- JSON parses cleanly (`node -e "JSON.parse(...)"` verified) ✓
