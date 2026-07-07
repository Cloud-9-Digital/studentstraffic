# University of Medicine, Tirana (UMT) - Research Document

Country: Albania | City: Tirana | Status: Draft written, gate-passing (ok=true)
Researched: 2026-07-07

## Key facts (multi-source corroborated)

- **Full name**: University of Medicine, Tirana (Albanian: Universiteti i Mjekesise Tirane, UMT)
- **Type**: Public
- **Established**: 23 January 2013, when the Faculty of Medicine (part of the University of Tirana since 1957, itself rooted in the 1952 Higher Institute of Medicine) was promoted to independent university status. First rector: Prof. Jera Kruja.
- **Official website**: https://umed.edu.al/en/ (bilingual, but English pages are mostly translated navigation only -- body content on faculty/admissions/history pages is largely Albanian)
- **Structure**: 3 faculties, 21 academic departments
  - Faculty of Medicine (roots to 1957)
  - Faculty of Dental Medicine (independent faculty since 2013 per Council of Ministers decision VKM No. 43; roots to a 1959 Department of Stomatology)
  - Faculty of Technical Medical Sciences (nursing, midwifery, physiotherapy, lab technology, speech therapy, imaging technology)
- **Campus**: Urban, centralised, physically integrated with University Hospital Center of Tirana "Mother Teresa" (QSUT) -- Albania's largest public teaching hospital
- **Students**: ~7,500 (Wikipedia) to ~8,999 (UniPage), depending on source/year; ~300+ academic staff, 78 full professors (Wikipedia)
- **Affiliations**: WHO, Erasmus Mundus, Balkan Universities Network, IFMSA, FAIMER/WDOMS (school ID F0001900), CEEPUS, ORPHEUS, COBISS, EUA (per Wikipedia and UniPage)

## Programs

Only one program made it into the gate-passing draft, because it was the only one with enough independently corroborated detail (title, duration, medium caveat, official URL):

- **Integrated Master of Science in General Medicine** (courseSlug: `mbbs`), 6-year Bologna-style integrated degree, ~360 ECTS (duration corroborated via Wikipedia's programme listing and consistently repeated across consultancy sources). Clinical training tied to QSUT teaching hospital.

Other faculty-confirmed but NOT included as structured `programs` entries (insufficient program-level detail — duration/medium/URL specifics — to safely map to a course slug without over-claiming):
- Integrated Master of Science in Dentistry (would map to `bds`)
- Integrated Master of Science in Pharmacy (would map to `pharmacy`)
- Bachelor's in Nursing / Nursing Management (would map to `bsc-nursing`)
- Public Health, Laboratory Technician programs (no matching course slug in the allowed set)

These could be added in a follow-up research pass if program-level official pages (durations, English-medium confirmation, admission specifics) can be found.

## What was OMITTED and why

1. **Tuition fee** — OMITTED entirely (no fake number). Sources conflict sharply:
   - UniPage: "from a minimum of 1,000 USD/year" for international students (looks like it may reflect a local/floor fee, not a realistic all-in international fee)
   - MBBS Mithram (consultancy): ~EUR 4,000/year
   - Other consultancy sites reference figures in the EUR 4,000-5,000 range
   No official UMT fee schedule for international students was found on the English-language site. Draft instructs students to get the current fee in writing from admissions.

2. **English-medium instruction claim** — NOT asserted as confirmed. The official site's /en/ pages are mostly untranslated Albanian content; no official page explicitly describing an English-medium "General Medicine" track for internationals was found. Multiple consultancy sources (MBBS Mithram, Medlink Students, Moksh16, Unique Education) claim English medium, 6-year duration — used only as corroborating signal for duration, NOT for the medium-of-instruction claim, which is flagged as an open item for students to verify directly.

3. **NMC "recognition/accreditation" claim** — Explicitly NOT asserted. Many consultancy sites claim "recognized by NMC (India)" — this is a common but technically incorrect framing since NMC does not "accredit" foreign universities the way GMC/USMLE-style bodies work. The honest, correct framing used in the draft: UMT's medical school is listed in the FAIMER/WDOMS World Directory of Medical Schools (verified directly at search.wdoms.org, school ID F0001900), which is relevant background to NMC's process; Albania is NOT on India's FMGE-exemption list, so Indian graduates should expect to sit FMGE/NExT; students must verify current NMC status themselves.

4. **Student housing/hostel details** — OMITTED. No official description of UMT-run dormitories (capacity, room types, pricing) was found on the English-language site, and no independent source verified one. Flagged as an open item in `hostelOverview`, `thingsToConsider`, and FAQ.

5. **Specific clinical rotation schedule / named hospital departments** — OMITTED beyond the general QSUT campus-integration fact, since no official breakdown was found.

6. **Programs beyond General Medicine** (Dentistry, Pharmacy, Nursing, Public Health, Lab Technician) — omitted from the structured `programs` array for this pass (see above); faculty-level existence is documented in `researchNotes` but not turned into full program entries lacking sufficient corroborated detail.

## Sources (all checked 2026-07-07)

1. Official site homepage (EN): https://umed.edu.al/en/
2. Official site — History: https://umed.edu.al/en/rreth-nesh/historiku/
3. Official site — Faculty of Medicine: https://umed.edu.al/en/rreth-nesh/fakultetet/fakulteti-i-mjekesise/
4. Official site — Admissions and registrations: https://umed.edu.al/en/edukimi/pranimet-dhe-regjistrimet/
5. Official site — Faculty of Dental Medicine history: https://umed.edu.al/en/rreth-nesh/fakultetet/fakulteti-i-mjekesise-dentare-2/
6. Official site — Faculty of Technical Medical Sciences: https://umed.edu.al/en/rreth-nesh/fakultetet/fakulteti-i-shkencave-mjekesore-teknike/
7. Wikipedia — University of Medicine, Tirana: https://en.wikipedia.org/wiki/University_of_Medicine,_Tirana
8. FAIMER/WDOMS World Directory of Medical Schools listing: https://search.wdoms.org/home/SchoolDetail/F0001900
9. UniPage — Price of education at University of Medicine, Tirana: https://www.unipage.net/en/4798/university_of_medicine_tirana
10. MBBS Mithram — University of Medicine, Tirana (consultancy, cross-check only): https://mbbsmithram.com/universities/university-of-medicine-tirana/
11. Embassy of India, Tirana — bilateral relations (Mission opened Aug 2024): https://indembtirana.gov.in/bilateral-relations

Additional sources consulted for city/context grounding (Tirana cost of living, safety, Indian community) via WebSearch aggregation — not individually cited as primary facts but informing the honest, general framing in `cityProfile`, `safetyOverview`, and `indianFoodSupport`:
- Expat Exchange, Numbeo/Expatistan-style cost-of-living aggregation (via search snippets)
- General 2026 Albania expat-safety commentary (via search snippets)

## Gate validation result

Ran a local check against the exact publisher validation logic (scripts/publish-university-draft.ts):
- countrySlug: albania — OK
- sources: 11 (>=2 required) — OK
- structuredFacts.name/city/type/establishedYear/officialWebsite — all present — OK
- bestFitFor: 5 items (>=3 required) — OK
- programs: 1 (>=1 required), courseSlug=mbbs, title/url/medium/durationYears all present — OK
- draftContent: all 8 narrative fields present, no weak markers ("not verified"/"pending"/"do not publish" etc.) — OK
- whyChoose: 5 (>=3), thingsToConsider: 6 (>=3), faq: 7 (>=3) — OK

**Result: ok=true.** JSON file validated with `node -e "JSON.parse(...)"` and passes the publisher's validateDraft() gate.
