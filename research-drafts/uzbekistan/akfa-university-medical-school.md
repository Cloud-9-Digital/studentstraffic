# AKFA University Medical School (now Central Asian University Medical School) — Research Document

**Country:** Uzbekistan | **City:** Tashkent | **Type:** Private | **Established:** 2019
**Status:** ok = true — publish-ready draft written to `akfa-university-medical-school.json`

## Critical finding: the university renamed itself

The task named this school "AKFA University Medical School." During research it became clear that:

- The original domain `akfauniversity.uz` is **no longer a live university website** — it currently
  resolves to a registrar "redemption period" (expired domain) placeholder page. Direct curl
  confirmed `HTTP 200` with body `<title>akfauniversity.uz - Redemption period</title>`.
- The institution officially renamed itself **Central Asian University (CAU)** effective **26 June
  2023**, per the university's own official notice (still published on the live site) and
  independently corroborated by Wikipedia.
- The World Directory of Medical Schools (WDOMS / FAIMER school ID **F0006802**) lists the medical
  school under its current name — "**Central Asian University Medical School, Uzbekistan**" — with an
  explicit alternate-name field: **"Akfa University Medical School (2019 - 2023)."** This directly
  confirms continuity: same institution, same FAIMER ID, new name.
- The live official site today is **https://centralasian.uz/**.

This draft is filed under the requested name/slug ("AKFA University Medical School" /
`akfa-university-medical-school`) so it matches the research task and any existing site taxonomy, but
the `draftContent.summary` and FAQ transparently explain the rename so prospective students are not
confused when official documents, WDOMS, or the diploma itself say "Central Asian University."

## Key facts (multi-source corroborated)

- **Founded:** 2019, under Uzbekistan Cabinet of Ministers Resolution No. 130 (15 Feb 2019) and
  presidential decree #3450 (29 Dec 2017) authorizing the Medical School specifically. Founded by AKFA
  Group and AKFA Medline, in academic partnership with Gachon University Medical School (South Korea).
- **Renamed:** "Central Asian University (CAU)" effective 26 June 2023 (official notice + Wikipedia).
- **Scale (2025):** 2,200+ students, 500+ staff (215 academic staff per Wikipedia infobox); six
  schools — Medicine, Dentistry, Business, Engineering & AI, Architecture & Design, Hospitality
  Management & Tourism — plus Medical Residency and a Be Student preparatory program.
- **Rankings/recognition:** QS Stars 4-star rating (2025; only private Uzbek university to hold one
  per the official site), Round University Ranking #975 globally (2025), Times Higher Education Impact
  Rankings 1501+ band, Erasmus+ participant.
- **President:** Kamran Gulamov (since Feb 2023). **Medical School Dean:** Dr. Murodbek Ahrorov, MD.
- **WDOMS/FAIMER status:** Operational since 2019; MD degree, 6-year curriculum, English medium;
  ECFMG-eligible graduation years 2025–current; listed as acceptable to Canadian provincial/territorial
  medical regulatory authorities per WDOMS Canada note.

## Program

**M.D. Doctor of Medicine** (`courseSlug: mbbs` — the closest fixed-taxonomy fit; CAU's own degree
title is "M.D." not "MBBS," but it is the undergraduate-entry six-year physician-training degree,
functionally equivalent to what the gate's taxonomy calls "mbbs").

- Duration: 6 years, full-time, 12 semesters
- Language: English (official)
- Curriculum: 3 years pre-clinical foundation (anatomy, biochemistry, physiology, microbiology,
  pharmacology, pathology, plus AI-in-medicine and biostatistics from year 1) → systems-based clinical
  rotations from year 4 (internal medicine, surgery, OB-GYN, paediatrics, cardiology, neurology,
  oncology, family medicine) → 6 supervised clinical internships → state licensing exam.
- **Official tuition (from the MD program page directly):**
  - Local (Uzbekistan citizens): 135,000,000 UZS/year
  - International students from Central Asia: $10,000/year
  - International students from outside Central Asia (Indian applicants' tier): **$11,000/year**
- Admission: CAU's own entrance exam (Maths, Chemistry, Biology, English — 20 questions each for the
  first three, 60 for English) + a mandatory ~10-minute admissions interview. Medicine/Dentistry
  applicants can skip the English exam with IELTS 6.0+/TOEFL iBT 60+/SAT English 585+, and can skip
  Biology/Chemistry exams with a National Certificate grade C+ in both.
- Application deadline referenced on official site: August 30, 2026 (for the cycle current at time of
  research — reconfirm each year).

## Clinical training

- Primary named hospital partner: **AKFA Medline**, described by the university as a JCI-accredited
  teaching hospital, formally folded into CAU's academic/clinical structure as a "University Clinic"
  (official 2025 press announcement).
- Additional announced partnership: **Cleveland Clinic** ("Cleveland Clinic Connected") — per
  Wikipedia and the official site, this is a 2025 cooperation agreement tied to future hospital
  development in Uzbekistan. Treated in the draft as an institutional partnership under development,
  not asserted as existing US-based rotations, since the concrete current scope wasn't detailed on
  the pages checked.

## Accommodation

Official Facility/Dormitory pages (fetched directly) describe an **on-campus dormitory** (~600-student
capacity) with single or triple rooms, each including bed, fridge, private bathroom, Wi-Fi; shared
floor kitchens; free laundry (detergent only extra); 24/7 security. Official per-year pricing:

- Local students: Single 30,000,000 UZS / Triple 15,000,000 UZS
- International students: Single $3,000 / Triple $1,500

This **contradicts** several older third-party MBBS-consultancy pages (e.g. rmcedu.com, dreammedicine.in)
claiming AKFA "does not provide on-campus hostel accommodation." Those pages appear stale/outdated;
the current official information (on-campus dorm exists) is what's used in the draft.

## What was OMITTED and why

1. **NMC (India) recognition** — NOT asserted. No official CAU page and no NMC/regulator source found
   during research named this school. Third-party consultancy sites (rmcedu.com, dreammedicine.in,
   mbbsinuzbekistan.com, careermarg.com) assert "NMC/WHO/Indian Medical Council accredited" in generic
   marketing language, but independent "NMC-approved Uzbekistan colleges" lists checked (Leverage Edu,
   edufever, jfln.org Amaan Foundation) name Tashkent Medical Academy, Samarkand State Medical
   University, Bukhara State Medical Institute, Fergana Medical Institute of Public Health, and Andijan
   State Medical Institute — **not** AKFA/CAU. Per the hard rule (correct regulator ONLY if
   corroborated), this claim is withheld entirely and students are told to verify with NMC directly.
2. **NEET-only admission claim** — third-party sites assert NEET is the admission requirement; the
   official CAU admission-regulations page instead documents CAU's own entrance exam + interview
   process. The draft describes the official documented process and flags the discrepancy rather than
   asserting NEET is required (since that wasn't found on an official CAU page).
3. **"No hostel" claim** — omitted/contradicted; official current pages show an on-campus dorm exists.
   Older third-party claims of no hostel are noted internally as stale, not repeated in the draft.
4. **Indian mess / dedicated Indian food facility** — no official source found; the compulsory
   "Indian mess" claim found during research applies to a different university (Tashkent State Medical
   University), not this one, and was not carried over. The draft instead notes Tashkent city's
   general Indian-restaurant availability (Curry House and others, per travel-review sources) as an
   honest, non-university-specific fact.
5. **Cleveland Clinic rotations** — not asserted as an active, concrete clinical-rotation benefit;
   described as an announced institutional partnership under development, per available sourcing.

## Full source list (labelled URLs)

1. Official homepage — https://centralasian.uz/
2. Official MD program page — https://centralasian.uz/medical
3. Official Medical Faculty/School of Medicine page — https://centralasian.uz/medica-faculty
4. Official Facility page (dormitory, sports center, accessibility) — https://centralasian.uz/facility
5. Official International Students guide — https://centralasian.uz/internationalstudents
6. Official Admission Regulations page — https://centralasian.uz/admissionregulations
7. Official rename notice — https://centralasian.uz/tpost/r6zxlm9km1-akfa-university-is-becoming-central-asia
8. Official AKFA Medline/University Clinic announcement — https://centralasian.uz/tpost/09x5uc3kg1-akfa-medline-becomes-part-of-central-asi
9. WDOMS/FAIMER School Detail F0006802 — https://search.wdoms.org/home/SchoolDetail/F0006802
10. Wikipedia — Central Asian University — https://en.wikipedia.org/wiki/Central_Asian_University

### Additional sources consulted (context/cross-check, not cited as primary in the JSON)

- Third-party MBBS-consultancy pages reviewed for cross-checking claims (not used as sole basis for
  any fact): rmcedu.com/akfa-university-medical-school, dreammedicine.in/akfa-university-medical-school,
  careermarg.com/college/akfa-university-medical-school-, mbbsinuzbekistan.com (AKFA ranking page),
  studyinuzbekistan.com/akfa-university, free-apply.com/en/university/1086000069
- NMC-approved-Uzbekistan-colleges lists checked (used to confirm AKFA/CAU is NOT named):
  leverageedu.com/learn/list-of-nmc-approved-medical-colleges-in-uzbekistan-for-indian-students,
  edufever.com/nmc-approved-medical-colleges-in-uzbekistan, jfln.org/top-uzbekistan-nmc-approved-medical-universities
- General Tashkent city/climate/safety/food context: climatestotravel.com/climate/uzbekistan/tashkent,
  educations.com/countries/uzbekistan, tripadvisor.com Indian-restaurants-in-Tashkent listing,
  eoitashkent.gov.in (Indian Embassy Tashkent advisory page, referenced for context, not directly quoted)

## Technical note on fetching

`curl` in this environment could not resolve `akfauniversity.uz` / `www.akfauniversity.uz` via normal
DNS (`Could not resolve host`), even though external DNS (Google's 8.8.8.8) resolves the bare domain
to `91.212.89.6`. Using `--resolve akfauniversity.uz:443:91.212.89.6` connected successfully and
confirmed the domain now serves an expired-domain "redemption period" page — this is what led to
discovering the rename. `centralasian.uz` resolved normally via DNS (185.215.4.51) and was fetched
directly without needing `--resolve` overrides for most pages (a few sub-paths returned 403, likely a
bot-protection rule on specific routes; the pages that mattered for this draft — home, medical,
medica-faculty, facility, internationalstudents, admissionregulations, and the two tpost announcement
pages — all returned 200 with full content).
