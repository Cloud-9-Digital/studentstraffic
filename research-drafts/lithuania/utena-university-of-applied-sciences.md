# Research Document: Utena University of Applied Sciences (Utenos kolegija)

Country: Lithuania | City: Utena | Status: PUBLISH-READY draft (ok=true)
Researched: 2026-07-07

## Key facts (corroborated, multi-source)

- **Name**: Utenos kolegija, English name "Utena University of Applied Sciences" / "Utena College".
- **Type**: Public, non-profit university of applied sciences (kolegija).
- **Founded**: 2000 (confirmed by uniRank institution profile; matches official site's institutional framing).
- **Recognition**: Officially recognised by Lithuania's Ministry of Education, Science and Sport (Svietimo, mokslo ir sporto ministerija) since 2000 (uniRank).
- **Size**: Small institution, uniRank enrollment range 2,000-2,999 students.
- **Faculties**: Faculty of Business and Technologies; Faculty of Medicine (18 accredited programmes total across both, per official site and Study in Lithuania).
- **Address**: 7 Maironio St, Utena LT-28142, Lithuania. Tel +370 389 51662.
- **Erasmus**: Holds the Erasmus Charter for Higher Education 2021-2027.
- **Award structure**: Professional Bachelor's degree + Diploma of Higher Education + Diploma Supplement (EHEA-aligned), per official Institution page and Study in Lithuania profile.

## Programs

### Listed in structured data: General Practice Nursing -> `bsc-nursing`
- Qualification: Professional Bachelor of Health Sciences, General Nurse.
- 210 credits (ECTS), full-time, 3.5 years.
- Delivered by the Faculty of Medicine.
- Teaching model: modular-cyclical system, J. Bruner's spiral curriculum, five-step evidence-based-practice teaching model.
- Simulation-based learning in a dedicated Nursing Simulation Training Centre; assessment via objective structured clinical situations and the ESCAPE method.
- Clinical placements in healthcare institutions in Utena, Vilnius, Kaunas, Rokiskis, Anyksciai and other cities.
- Erasmus+ mobility partner countries for placements/study: Portugal, Germany, Latvia, Italy, Greece, Norway, Poland, Czech Republic, Turkey.
- **Language of instruction**: official page states "Lithuanian, English (for ERASMUS+ only)" — i.e., the degree-seeking track is Lithuanian-medium, and English is only available to incoming Erasmus+ exchange students. This is flagged prominently in the draft (summary, thingsToConsider, and a dedicated FAQ) since it materially affects India-outbound applicants.
- Full module/subject/credit breakdown for all 4 years was captured from the official page (professional language, biomedical sciences, therapeutic/geriatric/maternal-child/community nursing modules, practice blocks, graduate thesis) — used to ground the `clinicalExposure` narrative field, not reproduced verbatim in the published draft to keep length disciplined.

### NOT listed as a program (deliberately omitted / explained instead): Odontological Care
- 180 credits, 3 years, Faculty of Medicine, Professional Bachelor's in Health Sciences.
- Qualification awarded: **dental assistant**, not dentist. The programme explicitly trains students to "assist the dentist or odontology specialist" and perform limited intra-oral procedures within scope — this is a dental-assisting/dental-team qualification.
- **Decision**: Did NOT map this to the `bds` course slug, because BDS in this codebase's context implies a dental-surgery/dentist qualification for the India-outbound audience, and asserting that would misrepresent the programme. Instead, it is mentioned only as institutional context and given its own FAQ entry clarifying it is not a BDS-equivalent. This is the "exhaustive-then-omit" rule applied conservatively — better to under-claim than mis-map a course.
- No MBBS/Medicine or Pharmacy programmes were found at this institution (18 programmes span business/technology fields plus a handful of health-sciences fields — nursing, dental assisting, physiotherapy, cosmetology — none of which are MBBS or pharmacy).

## What was OMITTED and why

1. **Tuition fee figure** — The official "Tuition fees" page (`/en/international-students/admission/tuition-fees`) returned only a page header ("Tuition fees for foreign students admitted to non-government-funded place of study in 2026") with no numeric figure in the static HTML (likely JS-rendered table not captured by curl). Rather than guess or reuse another university's figure, tuition is **omitted entirely** from structured facts and programs; the draft instead tells students to request current fees directly from admissions. This follows the "no fake 0, honest feeNotes" rule.
2. **Dormitory pricing** — The accommodation page describes room types (shared 2-3 person rooms across three addresses) but does not list EUR pricing. Omitted rather than fabricated; draft flags this as a thing to confirm.
3. **BDS course mapping for Odontological Care** — Deliberately not included as a program entry (see above). This is an honest omission to avoid misrepresenting a dental-assistant qualification as a dentistry degree.
4. **Named individual staff/department contacts** — Unlike the Klaipeda draft (which had a named nursing department head), no named individual contact for Utenos kolegija's Faculty of Medicine or International Relations Department was found in the pages checked; only the general admissions email (admission@utenos-kolegija.lt) was confirmed. Draft uses this general contact rather than inventing a name.
5. **Specific teaching hospital names** — The official page lists placement *cities* (Utena, Vilnius, Kaunas, Rokiskis, Anyksciai) but not specific named partner hospitals, so `teachingHospitals` structured field is left empty rather than guessed.

## Regulator/recognition framing

- **INC (Indian Nursing Council)**: Framed honestly per project rules — recognition of any foreign nursing qualification (including this one) is via INC's case-by-case equivalence process, not automatic. Students are told to verify with INC before enrolling. This mirrors the approach used in the Klaipeda draft.
- No claim of NMC/FMGE relevance is made anywhere (no MBBS program exists here), and no PCI (pharmacy) claim is made (no pharmacy program exists here).

## Sources (full list, labelled)

1. **Utenos kolegija official site — General Practice Nursing programme page** — https://www.utenos-kolegija.lt/en/studies-program/general-practice-nursing — kind: official. Qualification, credits, duration, language of instruction, faculty, learning outcomes, module breakdown, simulation centre, placement cities, Erasmus+ countries.
2. **Utenos kolegija official site — Institution page** — https://www.utenos-kolegija.lt/en/institution — kind: official. Institutional mission, award structure, 18 accredited programmes, Erasmus Charter 2021-2027, campus facilities.
3. **Utenos kolegija official site — Accommodation (international students)** — https://www.utenos-kolegija.lt/en/international-students/accomodation — kind: official. Student house locations, room types, shared facilities, application process.
4. **Utenos kolegija official site — How to apply (international admissions)** — https://www.utenos-kolegija.lt/en/international-students/admission/how-to-apply — kind: official. Application steps, EUR 50 registration fee, required documents, SKVC recognition, English-test thresholds, application window.
5. **uniRank — Utenos kolegija institution profile** — https://www.unirank.org/lt/uni/utenos-kolegija/ — kind: secondary. Founded 2000, non-profit public control, Ministry of Education recognition, enrollment size, address confirmation.
6. **Study in Lithuania — Utenos kolegija institution profile** — https://studyin.lt/institutions/utenos-kolegija-higher-education-institution/ — kind: secondary. 18 programmes list (confirms General Practice Nursing 3.5yrs and Odontological Care 3yrs both under Faculty of Medicine), award structure, Erasmus Charter.
7. **Lithuania Travel — Utena Lakes** — https://lithuania.travel/en/where-to-visit/nature/waterside-recreation/utena-lakes — kind: secondary. City/region nature context (Dauniskis, Vyzuonaitis lakes; Aukstaitija National Park; Lake Tauragnas).
8. **Wikipedia — Utena County** — https://en.wikipedia.org/wiki/Utena_County — kind: secondary. Population (~25,600, 2023), distance from Vilnius (~95 km), historical founding (1261), regional standing.

## Also checked (not cited as they yielded no new corroborated facts beyond above)
- Utenos kolegija Odontological Care programme page (used for the omission decision, see above).
- Utenos kolegija Tuition Fees page (returned no static figure — see Omissions).
- General web search results (unirank, 4icu, edurank, mabumbe, standyou, beyondthestates, study.eu, universityfairs) — used for triangulation/discovery only; official site + uniRank + Study in Lithuania + Lithuania Travel + Wikipedia were selected as the citable source set for the published page.

## Gate check result

JSON validated with `node -e "JSON.parse(...)"` — parses cleanly.
- sourceBundle.sources: 8 (>=2 required; includes official + secondary mix)
- structuredFacts.programs: 1, courseSlug `bsc-nursing` (>=1 required)
- structuredFacts.bestFitFor: 4 (>=3 required)
- draftContent.whyChoose: 5 (>=3 required)
- draftContent.thingsToConsider: 6 (>=3 required)
- draftContent.faq: 7 (>=3 required)
- All 8 narrative fields present, non-empty, and scanned clean against the weak-marker regex list (no "not verified"/"pending"/"do not publish" style phrases).

**Result: ok = true.**
