# Research Document: Jalal-Abad State University named after B.Osmonov - Medical Faculty

- Country: Kyrgyzstan (countrySlug: `kyrgyzstan`)
- City: Jalal-Abad (officially renamed **Manas** in 2025 - see caveat below)
- Slug: `jalal-abad-state-university-named-after-b-osmonov-medical-faculty`
- Status: **ok = true** (publish-ready, passes the gate in `scripts/publish-university-draft.ts`)
- Research date: 2026-07-07

## Key facts (corroborated)

| Fact | Value | Source(s) |
|---|---|---|
| University founded | 2 April 1993, by presidential decree | Official "About Us", official "About Medical Faculty" |
| Medical Faculty founded | 1994; briefly closed Sept 2000 by Ministry of Education order, continued training since | Official "About Medical Faculty" |
| Type | Public | Official site; WDOMS record |
| Total university size | 5 faculties, 2 colleges, 4,300+ students | Official "About Us" |
| Medical Faculty size | ~3,300 students (100% contract-basis), 150 teachers (130 full-time) | Official "About Medical Faculty" |
| International students | 2,500+ (university-wide, per homepage counter) | Official homepage |
| Degree specialities (official) | General Medicine; Pharmacy; General Medicine (12-year track, for foreign students) | Official "About Medical Faculty" |
| Clinical bases | 27 named hospitals/family-medicine centres across Jalal-Abad region, per Ministry of Health Order No. 680 (29 Sept 2018) | Official "About Medical Faculty" |
| Hostel | Separate boys'/girls' hostel, round-the-clock security | Official "Hostel" page |
| Canteen | Food prepared "taking into account national characteristics" of students | Official "About Medical Faculty" |
| FMGE coaching | On-campus coaching for FMGE (India), PM&DC (Pakistan), BM&DC (Bangladesh), taught by faculty from those countries | Official "Academic Council/FMGE...Classes" page |
| Scholarship | Annual "Doing Good Charity Foundation" scholarship, $100,000+ awarded to 2,000+ students since inception | Official "JASU Scholarship Program" page |
| WDOMS/FAIMER listing | Yes - FAIMER School ID **F0000580**, Public, Operational, qualification "Physician", instruction started 2000, languages Russian/Kyrgyz/English, ECFMG-eligible graduation years 2000-current, most recent accreditation review dated **25 Dec 2025** ("Accredited") | WDOMS official record (search.wdoms.org/Home/SchoolDetail/F0000580) |
| Indian students & English medium | "Indian students have been studying in English since 2018" | Official "About Medical Faculty" |
| City rename | Jalal-Abad officially renamed **Manas** in 2025 | English Wikipedia "Jalal-Abad" now redirects to "Manas (city)"; corroborated by the university's own current address "...Manas City, Jalal-Abad" |
| City population | ~123,239 | Wikipedia "Manas (city)" infobox |

## Programs included in the draft

1. **General Medicine** (`courseSlug: mbbs`) - 6 years, medium noted as English/Russian mix with the 2018-Indian-English-cohort caveat, official program URL = About Medical Faculty page. FMGE coaching noted as a license-exam support feature.
2. **Pharmacy** (`courseSlug: pharmacy`) - 5 years, medium flagged as primarily Russian/Kyrgyz per the official curriculum listing (speciality code 560005), with an explicit instruction to confirm English-medium availability directly.

### Omitted: Dentistry (BDS)

Several third-party Indian MBBS-consultancy sites (e.g. SelectYourUniversity/Walnut Data Tech) advertise a Dentistry/BDS program at "Jalalabad State University." This was **not** found on the official Medical Faculty's own list of specialities/departments (General Medicine, Pharmacy, 12-year General Medicine only). Per the exhaustive-then-omit rule, BDS was **not included** as a program in this draft. If a future research pass finds an official BDS program page, it can be added then.

### Omitted: tuition/fee figures in structuredFacts

No official, university-published tuition schedule was found for international/contract-basis students. Independent third-party consultancy sources (see below) converge on a rough order of magnitude (~USD 6,000-6,500 year 1, ~USD 4,000-5,000 years 2-5, ~USD 1,200/year mess, total 6-year package roughly USD 22,500-28,500 / ~INR 25 lakh), but these are consultancy package quotes that likely bundle agent/service fees rather than the university's raw tuition. No fee figure was asserted as fact in `structuredFacts`; `feeNotes` on each program explicitly frames this as a third-party estimate pending direct confirmation.

### NMC (India) recognition - handled cautiously

Many third-party consultancy sites assert direct NMC approval. This research pass could **only directly corroborate** recognition via the WHO/FAIMER World Directory of Medical Schools (WDOMS) official record, which is a different (though related) recognition system from the Indian NMC's own approved-institution list. No official NMC-published list entry was directly retrieved and verified in this pass. Accordingly, the draft:
- Does **not** assert NMC recognition as a fact.
- Cites WDOMS/FAIMER recognition as the one directly-corroborated official recognition record.
- Tells students explicitly, in both `thingsToConsider` and the FAQ, to check the NMC's current list themselves before applying, since NMC status is what actually governs FMGE/NExT eligibility.

## Sources used (12 total, satisfies the >=2 multi-source gate)

1. Official homepage - https://jasu.kg/
2. Official "About Medical Faculty" - https://jasu.kg/about-medical-faculty/
3. Official "About Us" - https://jasu.kg/about-us/
4. Official "Hostel" - https://jasu.kg/hostel/
5. Official "Admission" - https://jasu.kg/admission/
6. Official "Academic Council FMGE/PMDC/BM&DC/NMC Classes" - https://jasu.kg/academic-council-fmge-pmdc-bmdc-nmc-classesacademic-council/
7. Official "JASU Scholarship Program" - https://jasu.kg/jasu-scholarship-program/
8. Official "Contact" - https://jasu.kg/contact/
9. WDOMS/FAIMER official school record (F0000580) - https://search.wdoms.org/Home/SchoolDetail/F0000580
10. Rus Education (India-facing consultancy) - https://www.ruseducation.in/university/jalal-abad-state-medical-university-in-kyrgyzstan/
11. SelectYourUniversity / Walnut Data Tech (India-facing consultancy) - https://www.selectyouruniversity.com/college/jalalabad-state-university-cid-300150
12. Wikipedia "Jalal-Abad" (redirects to "Manas (city)") - https://en.wikipedia.org/wiki/Jalal-Abad

Additional sources checked but not cited in the final bundle (used only for cross-checking, not uniquely load-bearing): mbbsadmissionabroad.in, tutelagestudy.com, pacificeducation.in, ensureeducation.com, edufever.com (all independent Indian MBBS-consultancy sites broadly repeating the same NMC/WDOMS/fee claims - reviewed to confirm consensus, not individually cited to keep the source bundle focused on the most substantive/official ones).

## WEB METHOD note

Official site (jasu.kg) initially returned HTTP 406 "Not Acceptable" (ModSecurity block) when fetched with a bare `curl -A "Mozilla/5.0"` and no `Accept` header. Adding a full browser-style `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8` header alongside a full Chrome UA string resolved this and all official pages fetched successfully (HTTP 200). The official 2026-27 prospectus PDF was also downloaded (`https://jasu.kg/wp-content/uploads/2026/06/JASU-Prospectus-2026-27.pdf`, ~20MB) but proved to be image-based (pdftotext returned no extractable text), so it was not used as a text source in this pass - a future pass with OCR could revisit it for any additional official fee/program detail.

## Gate validation performed locally

Re-implemented the `scripts/publish-university-draft.ts` `validateDraft` checks manually against the JSON and confirmed:
- JSON parses (`node -e "JSON.parse(...)"`) - OK
- countrySlug = "kyrgyzstan" - OK (exists in `lib/data/nav-countries.ts`)
- >= 2 sources, each with label/url/kind/checkedAt - OK (12 sources)
- structuredFacts.name, city, type ("Public"), establishedYear (1993, number), officialWebsite - all present
- bestFitFor >= 3 - OK (4)
- programs >= 1, each with courseSlug in the fixed taxonomy, title, officialProgramUrl, medium, durationYears - OK (2 programs: mbbs, pharmacy)
- All 8 narrative draftContent fields present, non-empty, and free of the validator's weak-marker regexes - OK
- whyChoose >= 3 (4), thingsToConsider >= 3 (4), faq >= 3 (6) - OK
