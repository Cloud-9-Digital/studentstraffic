# UMCH – University Targu Mures Medical Campus Hamburg (Research Notes)

Country: Germany | City: Hamburg | Status: publish-ready draft (gate passed)
Research date: 2026-07-07

## Key facts (corroborated)

- **Identity**: UMCH is the Hamburg branch campus (opened September 2019, Hamburg-Bahrenfeld) of the George Emil Palade University of Medicine, Pharmacy, Science and Technology of Târgu Mureș (UMFST), a Romanian **state** medical university founded in 1948. UMCH is operated by CPE Europe GmbH as a privately run campus of the state university (public/private hybrid — coded as "Public" in structuredFacts because the awarding institution, UMFST Târgu Mureș, is a Romanian state university).
- **Program**: 6-year (12-semester) Medicine degree, 360 ECTS. Pre-clinical (years 1-2) fully taught in English on the Hamburg campus. Clinical phase (years 3-6) delivered via 30+ partner teaching hospitals in Germany (plus a few in Spain); bedside teaching there is in German/English.
- **Language**: English for all Hamburg-based theory. German B2 expected by start of year 3 (clinical placements); C1 recommended for German licensure after graduation. Free German-language course built into the program.
- **Admissions**: No minimum grade average for EU-recognised diplomas (IB, Abitur, A-Levels, American HS Diploma). Online application → 15-20 min motivation interview + 90-min, 75-question MCQ evaluation (biology/chemistry/general knowledge, equal weight) → results within 48 hours. Applications run until end of July for the following intake (intake starts late Sept/early Oct).
- **Tuition** (confirmed on official site, checked 2026-07-07):
  - EU/EEA/UK/Switzerland/Andorra/Monaco/San Marino/Vatican citizens: EUR 14,900/semester, years 1-6, Hamburg.
  - All other nationalities (including India): EUR 17,400/semester, years 1-6, Hamburg.
  - One-time application fee: EUR 595. One-time enrollment fee: EUR 4,500.
  - Alternative: complete years 1-2 in Hamburg, then transfer to Târgu Mureș campus in Romania for years 3-6 at EUR 3,000/semester (still taught in English there).
- **Accreditation/recognition**: Romanian ARACIS accreditation (ENQA full member); IAAR accreditation since 2023 for the Hamburg Medicine program (WFME-recognised, prerequisite for WDOMS listing); listed in World Directory of Medical Schools (WDOMS/FAIMER school ID F0000226) — enables USMLE eligibility; anabin (German foreign-qualification database) "H+" status, the highest tier, meaning it counts as a higher-education institution in Germany. Independent source (Medlink Students) additionally notes GMC (UK) recognition and ~20 UMCH graduates registered with the GMC.
- **Campus**: 6,000+ sqm in Hamburg-Bahrenfeld ("Science City", next to University of Hamburg and DESY). Anatomage virtual dissection table, modern labs, small-group teaching. Awarded the "German Medical Award 2025" (Silver Medal, Health Communication category) per official news.
- **Clinical network**: 30+ teaching hospitals + 100+ teaching practices in Germany, plus hospitals in Spain (Elche, Madrid, Murcia). Placements chosen by student preference in year 2, ranked by year-1 academic performance where oversubscribed. Clinical exposure: 8 weeks (year 3) rising to 12-16 weeks/year (years 4-6).
- **Housing**: No university-run hostel. Private partner residences — Uninest (Navale, 328 studios), THE FIZZ (Altona-Nord), Urban Living (Ottensen) — plus HousingAnywhere (UMCH students get "VIP" priority status). Independent source describes similar studio-apartment housing in Hamburg-Wandsbek, 20-45 min from campus.
- **Food**: On-campus cafeteria has 2 daily dishes (always 1 veg/vegan) + sandwiches/salads/soup; cashless payment. No dedicated Indian catering identified — Hamburg is a large diverse city with halal/vegetarian dining and South Asian grocery access, per independent source, but this is city-level infrastructure, not university-provided.
- **India connection**: Official news confirms UMCH actively runs India-focused outreach — visit of Indian Consul General Soumya Gupta (Nov 2024), school-partnership tours to American Embassy School New Delhi, Indus International School Hyderabad, DSB International School Mumbai, and Chennai-based counselling partners, plus recurring "Med Insights" info sessions "for Indian students & their parents." UMCH's own India-outreach copy references alignment with "the framework of the National Medical Commission" but this is marketing language, not a confirmed NMC listing.
- **Safety**: Independent source (Medlink) describes Hamburg/Bahrenfeld as one of the safer, greener parts of the city. No specific incident reports found tied to the campus.

## What was OMITTED and why

- **NMC / FMGE / NEET recognition status**: NOT asserted as confirmed. Could not find UMCH Hamburg (or its graduates) on an official NMC recognized/approved list, nor an authoritative third-party confirmation of FMGE eligibility specific to this branch campus. UMCH's own India-outreach news page references "the framework of the National Medical Commission" in passing but this is promotional copy from the university, not independent regulatory confirmation. Per project rules (assert regulator status only if corroborated), the FAQ and thingsToConsider explicitly instruct students to verify NMC/FMGE eligibility directly before applying, and the summary flags this open item. This is the single biggest honesty gap in this draft and the most important thing for a human reviewer to double check before wide promotion to Indian audiences.
- **Exact current living-cost figures (rent/utilities/food/transport in EUR)**: Medlink's page had a living-cost table but the actual numeric values did not render in the scraped text (likely JS-injected/currency-toggle widget), so no living-cost numbers are included in the draft rather than guessing.
- **Establishment year ambiguity**: Two distinct "founding" facts exist — UMFST Târgu Mureș (parent, Romanian state university) was founded in 1948; UMCH's Hamburg branch campus opened in September 2019. `establishedYear` is set to 2019 (the Hamburg campus this profile is actually about), with the 1948 parent-university history mentioned narratively in the summary for context. Flagging this choice explicitly in case editorial preference differs.
- **"Type" field (Public vs Private)**: Set to "Public" because the awarding/enrolling institution is Romania's state university (UMFST Târgu Mureș) and UMCH markets itself as "the benefits of a public university – with the feel of a private campus." Note the Hamburg campus itself is operated by a private company (CPE Europe GmbH). This nuance is described in the notes above for reviewer awareness; if the internal taxonomy prefers "Private" for branch campuses operated by private companies, this should be reconsidered before publish.
- **Graduate-entry / 4-year MD route**: Explicitly does NOT exist at UMCH per Medlink ("No" graduate entry, "Fast track medicine is not possible"). Omitted from programs array since only the standard 6-year program is offered.
- **Program page 404s**: Several guessed URL slugs (e.g., /en/study-programme, /en/admission, /en/medical-program) 404'd; the correct slugs were discovered via link extraction from the homepage (/en/the-medicine-degree-program, /en/the-campus, /en/tuition-fees, /en/accreditation-and-recognition, /en/teaching-hospitals-and-practices). All URLs cited in the JSON were verified with HTTP 200.

## Full source list

1. UMCH official site — University & facts: https://edu.umch.de/en/university
2. UMCH official site — The Medicine Degree Program (curriculum, admissions, FAQ): https://edu.umch.de/en/the-medicine-degree-program
3. UMCH official site — Tuition Fees & Financing: https://edu.umch.de/en/tuition-fees
4. UMCH official site — The Campus (housing, sports, student life): https://edu.umch.de/en/the-campus
5. UMCH official site — Teaching Hospitals and Practices: https://edu.umch.de/en/teaching-hospitals-and-practices
6. UMCH official news — Visit of Indian Consul General Soumya Gupta: https://edu.umch.de/en/news/indian-consul-general-soumya-gupta-en
7. UMCH official news — UMFST-UMCH strengthens school partnerships in India: https://edu.umch.de/en/news/umfst-umch-strengthens-school-partnerships-in-india-en
8. Medlink Students — University of Targu Mures Medical Campus Hamburg (UMCH) profile: https://www.medlinkstudents.com/universities/university-targu-mures-medical-campus-hamburg/
9. Wikipedia — George Emil Palade University of Medicine, Pharmacy, Science and Technology of Târgu Mureș: https://en.wikipedia.org/wiki/George_Emil_Palade_University_of_Medicine,_Pharmacy,_Science_and_Technology_of_T%C3%A2rgu_Mure%C8%99

Additional sources reviewed but not cited (used only for search-result overview context, not for specific facts in the draft): TopUniversities.com, medhead.eu (fetch failed), dreamstudiesabroad.com, medicmind.co.uk, desire2study.com, educatly.com, findcourse.com.

## Gate validation

- JSON parses cleanly (verified with `node -e "JSON.parse(...)"`).
- countrySlug = "germany" ✓
- sourceBundle.sources = 9 (≥2), each with label/url/kind/checkedAt ✓, includes official site ✓
- structuredFacts: name/city/type/establishedYear/officialWebsite present; bestFitFor = 5 (≥3); programs = 1, courseSlug "mbbs" (valid enum), title, officialProgramUrl, medium, durationYears=6 all present ✓
- draftContent: all 8 narrative fields present and non-empty, scanned against weak-marker regex list from `scripts/publish-university-draft.ts` — no matches ✓
- whyChoose = 6 (≥3), thingsToConsider = 6 (≥3), faq = 7 (≥3) ✓
