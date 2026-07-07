# Research record: Saint Camillus International University of Health and Medical Sciences (UniCamillus), Rome, Italy

Status: **ok = true** (publish-ready draft; JSON written alongside this file)

Country: Italy | City: Rome | Type: Private | Established: 2017 (recognised/accredited by the Italian Ministry of University and Research, 28 November 2017)

Official website: https://unicamillus.org/en/

## Key facts (corroborated, multi-source)

- **Founding / status**: Private Italian university, recognised by the Italian Ministry of University and Research in November 2017 (Ministerial Decree 927/2017). Confirmed by Wikipedia and the university's own tuition regulations, which cite the same decree.
- **Locations**: Main campus in Rome (Via di Sant'Alessandro 8); Wikipedia also lists Cefalù and Venice campuses (these run Italian-medium Medicine and Surgery programs, out of scope for this MBBS/Nursing-focused draft).
- **Scale**: Wikipedia cites ~5,100 students (2024). Third-party portals (medlinkstudents, italymedicalschools) give lower/older figures (455–5,000) reflecting different snapshot years — Wikipedia's more recent, dated figure was used as the headline number where cited informally, but no student-count claim was placed in the gate-required narrative fields to avoid relying on an unstable figure.
- **Orientation**: University is dedicated exclusively to medical/health sciences, with a stated humanitarian mission — curriculum and research emphasis on diseases prevalent in the Global South (malaria, HIV/AIDS, TB, neglected tropical diseases), partnerships with AMSI (Association of Doctors of Foreign Origin in Italy), Co-mai, and cooperation agreements with Haiti, Egypt and other countries (Wikipedia).
- **Recognition markers cited by third parties**: ECFMG and WDOMS listing mentioned by Medlink Students (a UK admissions consultancy) — treated as third-party color, not asserted as a regulator-grade fact for India (no NMC-specific statement found).

## Programs (in scope for this draft: English-medium, gate requires explicit courseSlug)

### 1. MSc Medicine and Surgery (LM-41) — Rome, taught in English → `courseSlug: mbbs`
- 6 years, 360 ECTS, admission via UniCamillus's own admission test (not detailed further here; test structure varies by cycle per third-party sources).
- Language of instruction: English. Language of practical/internship activities: **Italian** (stated on the official course page) — an important caveat for Indian applicants.
- Official course page marked "**Registrations closed**" for the current cycle at time of research (2026-07-07) — cycle status changes, so this is flagged as a caveat, not a hard blocker, and students are told to check the live Admission Calls page.
- **Tuition (officially confirmed, current)**: EUR 21,000/year for A.Y. 2025/2026 (Rector's Decree no. 720, issued 19 December 2024; Board approval 18 December 2024). Same fee applies to first-year and subsequent-year students, EU and non-EU alike. Plus: ~EUR 140/year regional study-right tax (2024/2025 figure, reset annually), EUR 16 stamp duty at enrollment, EUR 250 graduation fee, ~EUR 49.58 State Exam admission fee.
- Source: official course page + official tuition PDF (both fetched and read in full via the PDF tool).

### 2. BSc Nursing (L/SNT-1) — Rome, taught in English → `courseSlug: bsc-nursing`
- 3 years, 180 ECTS, admission test required. Official course page marked "**Registrations open (EU candidates)**" at time of research.
- **Tuition (officially confirmed, current)**: EUR 3,000/year for A.Y. 2025/2026 (Rector's Decree no. 723, issued 19 December 2024), for both EU and non-EU students. Same ~EUR 140 regional tax, EUR 16 stamp duty, EUR 350 graduation fee apply per the official Bachelor's-programs fee PDF.
- Source: official course page + official Bachelor's-degree tuition PDF.

### Other UniCamillus programs NOT included in this draft (no courseSlug match in the seed schema's allowed set, or Italian-medium / out of India-audience scope)
- MSc Dentistry and Dental Prosthetics (Italian-medium) — would map to `bds` but is NOT taught in English, so omitted to avoid misleading India-audience framing on a program in a language most applicants don't have.
- BSc Physiotherapy, BSc Midwifery (Italian-medium), BSc Radiology/Diagnostic Imaging/Radiotherapy Techniques, BSc Biomedical Laboratory Techniques (Italian-medium), MSc Human Nutrition Sciences — no matching courseSlug in the allowed set {mbbs, medical-pg, bsc-nursing, pharmacy, bds} and/or not India-audience relevant for this pass.
- MSc Medicine and Surgery in Italian (Rome), and the Venice/Cefalù MSc Medicine and Surgery campuses — Italian-medium, out of scope.

## What was OMITTED and why

- **Tuition for non-Medicine/non-Nursing programs** (Dentistry, Physiotherapy, Midwifery, Radiology, Biomedical Lab Techniques): fee figures exist in official PDFs but these programs are either Italian-medium or not in the gate's allowed courseSlug set, so they were left out entirely rather than partially represented.
- **Any on-campus/university-run hostel or halls-of-residence claim**: could not be corroborated from the official site. The official "International Students" page covers visa/tax-code/residence-permit/health-registration steps only, not housing. Third-party sources point to a private residence (UniCampus Apartments, Casal Monastero) and general Rome rental platforms, but no first-party UniCamillus housing office or dorm was found. Handled honestly in `hostelOverview` and `thingsToConsider` rather than asserting a dorm exists.
- **NMC/FMGE(NExT) recognition status**: no NMC-specific statement about this university was found. Per rules, this is NOT asserted; FAQ and thingsToConsider explicitly tell students to verify with NMC directly.
- **Current-cycle admission open/closed status**: the MD program's official page showed "Registrations closed" at research time; this is stated as a fact-at-time-of-research with an explicit instruction to check the live admissions page, not glossed over.
- **Student population figure**: conflicting figures across sources (455 to ~5,100 depending on source/year) — omitted from gate-required narrative content to avoid citing an unstable number as fact; only mentioned in this internal research record for transparency.
- **Fee-reduction/scholarship dollar amounts** (e.g., EUR 5,250 EU merit scholarship, ISEE-based exemptions): these appeared in search snippets tied to specific instruction years/cohorts (EU-only merit scheme) and were not confirmed as applicable to non-EU/Indian applicants, so no specific scholarship amount was asserted in the gate-required content; `studentSupport` describes the scholarship program's existence in general, verifiable terms only.

## Full source list (labelled URLs)

1. UniCamillus — Home (official): https://unicamillus.org/en/
2. UniCamillus — MSc Medicine and Surgery (LM-41), Rome, English (official program page): https://unicamillus.org/courses/magistrale/medicina-e-chirurgia-roma/
3. UniCamillus — BSc Nursing (L/SNT-1), Rome, English (official program page): https://unicamillus.org/en/courses/bsc/nursing/
4. UniCamillus — Annual tuition fees index (official): https://unicamillus.org/en/services/annual-tuition-fees/
5. UniCamillus — Tuition Fees Regulation A.Y. 2025/2026, Single-Cycle Master's (Medicine and Surgery / Dentistry), Rome Campus (official PDF, read in full): https://unicamillus.org/wp-content/uploads/regulations/146r-720-24dr-tuition-fees-and-contributions_single-cycle-2025-2026-rome-campus.pdf
6. UniCamillus — Tuition Fees Regulation A.Y. 2025/2026, Bachelor's Degree Programs in the Health Professions, Rome Campus (official PDF, read in full): https://unicamillus.org/wp-content/uploads/regulations/149r-723-24dr-tuition-fees-and-contributions_bachelors-degree-program-2025-2026.pdf
7. UniCamillus — International Students (official visa/tax-code/residence-permit guidance): https://unicamillus.org/en/services/international-students/
8. UniCamillus — Scholarships and Honours Student Loans (official): https://unicamillus.org/en/services/scholarships-and-honours-student-loans/
9. Saint Camillus International University of Health and Medical Sciences — Wikipedia: https://en.wikipedia.org/wiki/Saint_Camillus_International_University_of_Health_and_Medical_Sciences
10. Saint Camillus International University of Health Sciences — Medlink Students: https://www.medlinkstudents.com/universities/saint-camillus-international-university-medicine/
11. UniCamillus — Italy Medical Schools (third-party admissions portal, used for color/cross-check only, some figures dated/inconsistent): https://www.italymedicalschools.com/unicamillus/
12. UniCamillus–International Medical University in Rome — StudyAbroadAide: https://studyabroadaide.com/institutions/unicamillus-international-medical-university-in-rome/
13. Unicamillus Saint Camillus University, Rome Accommodation — Casita: https://www.casita.com/student-accommodation/italy/rome/universita-unicamillus-saint-camillus-international-university-of-health-sciences
14. Is Rome safe? 4 areas to avoid in Rome as a student or young professional — HousingAnywhere: https://housinganywhere.com/Rome--Italy/areas-to-avoid-in-rome
15. Indians in Italy — Wikipedia: https://en.wikipedia.org/wiki/Indians_in_Italy

## Gate check (self-verified)

- countrySlug: "italy" ✓
- sourceBundle.sources: 13 entries, each {label, url, kind, checkedAt}, includes official site ✓ (multi-source, not single-source)
- structuredFacts: name, city, type (Private), establishedYear (2017, number), officialWebsite, bestFitFor (5 items), programs (2, each with explicit courseSlug in {mbbs, bsc-nursing}, title, officialProgramUrl, medium, durationYears) ✓
- draftContent: all 8 narrative fields non-empty, checked programmatically for weak markers ("not verified", "pending", "do not publish") — none found ✓
- whyChoose (5), thingsToConsider (6), faq (8) — all ≥3 ✓
- Tuition: included (not omitted) because officially confirmed and current (A.Y. 2025/2026 Rector's Decrees) for both programs
- India-audience regulator framing: NOT asserted (no NMC-specific confirmation found) — students explicitly told to verify with NMC
