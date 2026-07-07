# Research Document: Hochschule Bremen (City University of Applied Sciences) — International Degree Programme in Nursing B.Sc.

Country: Germany | City: Bremen | Course: BSc Nursing (`bsc-nursing`)
Verified: 2026-07-07 | Status: **Publish-ready (ok=true)**

## Key facts (corroborated)

- **Institution**: Hochschule Bremen (HSB) – City University of Applied Sciences. Public University of Applied Sciences, founded 1982 (merger of four earlier Bremen institutions). ~9,000 students from 100+ countries, ~70 degree programmes across 5 faculties. System-accredited by AQAS since 2019; member of the UAS7 network. Main campus on Neustadtswall, Bremen-Neustadt.
- **Programme**: International Degree Programme in Nursing B.Sc. Bachelor of Science, 8 semesters, 240 ECTS, accredited, admission-restricted. Sits in the School of Social Sciences (Faculty 3).
- **Dual qualification**: Academic Bachelor of Science + German state licensing exam as a nursing specialist (programme is "primary qualifying" — HSB alone runs the whole course including clinical training).
- **Practical training**: 13 practical modules across clinics, outpatient care services, counselling centres, palliative care, in every semester; plus a Skills Lab/Simulation Centre on HSB's health campus, described by HSB as unique in Germany in its form.
- **CRITICAL CAVEAT — language of instruction**: Despite the "International Degree Programme" name, this is a **German-medium** programme. Both HSB's own page and the official DAAD/HRK database confirm this:
  - HSB: "Please be aware, that the main language of instruction during your studies & practical modules is German."
  - DAAD: "Languages of instruction — Main language German, Further languages English."
  - Admission requires German at native-speaker level or C1 (TestDaF 16+, Goethe/telc C1, DSD II). Only **English B1.2** is required at entry, and can be completed by end of semester 4.
  - This is the single most important honesty flag for an India-audience page and is foregrounded throughout the draft (summary, bestFitFor, thingsToConsider, FAQ).
- **Cost model**: Public university — **no tuition fee**. Only a semester administrative contribution, independently reported (Radio Bremen/buten un binnen) at ~EUR 443.25 for winter semester 2026 (partly driven by the Deutschlandticket transport-fee component).
- **Training stipend**: Since 1 Jan 2024, primary-qualifying nursing students receive remuneration under Germany's Nursing Studies Strengthening Act (PflStudStG) — but this is contingent on the student separately securing a "training contract" with one of the programme's cooperating clinical institutions, submitted at least 4 weeks before the first exam phase. Not automatic/guaranteed simply by enrolling.
- **Visa/financials**: Official visa financial-resources requirement stated by HSB as EUR 11,904 in a blocked account for 2026. Non-EU students must obtain German statutory health insurance (SMV notification process).
- **Housing**: HSB does not run its own hostel for this programme. Students use Bremen's Studierendenwerk dormitory system or the private/shared-flat (WG) market. No official on-campus fee schedule to cite.
- **Bremen city**: Historic Hanseatic port city, ~586,000 people, Germany's 11th-largest city, UNESCO World Heritage Town Hall + Roland statue, home to University of Bremen (an "Elite university") alongside HSB.
- **Indian community**: Independent community source (Indian Students Germany / Indian Students Association Bremen) reports 2,000+ members across Bremen's universities, organizing cultural events, communal dinners, meetups.

## What was OMITTED and why

- **No tuition/annual-cost figure in structuredFacts.programs `officialAnnualTuitionAmount`** — deliberately omitted (left unset) because there IS no tuition fee (public university); only the semester contribution is mentioned narratively (with a source), since that's an administrative fee, not tuition, and giving it as "annual tuition" would misrepresent the cost structure.
- **No specific hostel/dormitory monthly rent figures** — HSB does not publish an on-campus fee schedule for this programme; it refers students to the separate Studierendenwerk Bremen and the private housing market. Rather than fabricate or borrow rent figures from unrelated Bremen housing sources, `hostelOverview` stays qualitative and points to the correct official channel (Studierendenwerk) plus the housing portals HSB itself lists.
- **No NMC/INC "recognized" claim** — Regulator is INC (nursing), not asserted as a blanket recognition. INC does foreign-qualification equivalency case-by-case (transcript proforma + fee + syllabus review), so the draft explicitly tells students to run that process themselves rather than asserting recognition status for this specific German qualification.
- **No claim that this is an English-medium programme** — this would have been the easiest thing to get wrong given the "International Degree Programme" branding; multi-source corroboration (official HSB page + official DAAD/HRK database) confirms it's German-medium, so this is stated plainly and repeatedly rather than glossed over.
- **durationYears set to 4** (i.e., 8 semesters ÷ 2) to match the schema's year-based field, since the programme is officially specified in semesters (8) / ECTS (240) rather than years.
- **No specific numeric establishedYear ambiguity** — unlike branch-campus cases, HSB's founding year (1982) is unambiguous and consistently corroborated (official Wikipedia infobox, HSB's own "at a glance" framing referenced in search), so no parent-vs-branch distinction was needed here.

## Sources (labelled URLs)

1. **HSB Hochschule Bremen – International Degree Programme in Nursing B.Sc.** (official programme page) — https://www.hs-bremen.de/en/study/degree-programme/international-degree-programme-in-nursing-bsc/
2. **HSB Hochschule Bremen – Information for international prospective students** (official) — https://www.hs-bremen.de/en/study/before/application-and-admission/international-applications/
3. **DAAD (German Academic Exchange Service) official programme database** – International course in Nursing, Bremen (HRK-supplied data) — https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/detail/university-of-applied-sciences-bremen-international-course-in-nursing-g2752108/?hec-id=g2752108
4. **HSB Hochschule Bremen – School of Social Sciences (Faculty 3)** official faculty page — https://www.hs-bremen.de/en/hsb/faculties/school-of-social-sciences/
5. **Wikipedia – City University of Applied Sciences (Hochschule Bremen)** — https://en.wikipedia.org/wiki/City_University_of_Applied_Sciences
6. **buten un binnen (Radio Bremen)** – report on the 2026 Bremen student semester-contribution increase — https://www.butenunbinnen.de/nachrichten/erhoehung-semesterbeitrag-bremen-100.html
7. **Indian Students Germany – Indian Students Association Bremen** community page — https://www.indianstudentsgermany.org/room/details/25
8. **Wikipedia – Bremen (city)** — https://en.wikipedia.org/wiki/Bremen

## Gate self-check (against `scripts/publish-university-draft.ts` validation)

- countrySlug = "germany" ✓
- sourceBundle.sources = 8 (≥2), each with label/url/kind/checkedAt ✓, includes official-university/official-program/government/other, includes official site ✓
- structuredFacts: name, city="Bremen", type="Public", establishedYear=1982 (number), officialWebsite, bestFitFor (4, ≥3), programs (1, ≥1) with explicit courseSlug="bsc-nursing", title, officialProgramUrl, medium, durationYears=4 ✓
- draftContent: all 8 narrative fields non-empty, scanned against weak-marker regex list (pending official-source research / not yet verified / internal draft / needs official.../ still needs / before publication / do not publish...) — **no matches** ✓
- whyChoose = 4 (≥3), thingsToConsider = 5 (≥3), faq = 6 (≥3) ✓
- Validated with `node -e "JSON.parse(...)"` — parses cleanly ✓

## Result

**ok = true.** Draft is publish-ready per the gate. The defining editorial decision on this page is transparency about the German-medium language of instruction (contradicting the programme's own "International" branding) and a conservative, verify-yourself framing on Indian nursing-license recognition (INC equivalency) rather than any unearned recognition claim.
