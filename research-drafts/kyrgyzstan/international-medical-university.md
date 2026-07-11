# International Medical University (IMU) - Bishkek, Kyrgyzstan

Research date: 2026-07-07
Country slug: `kyrgyzstan`
University slug: `international-medical-university`
Status: **Publish-ready** (ok=true) - draft JSON meets the publisher gate.

## Key facts (corroborated)

- **Type:** Private university
- **Founded:** 18 July 2016 (general meeting of founders); first teaching license and first intake (General Medicine) in 2017; first graduating class in 2019
  - Corroborated by: official "About us / History" page, IMU's own "10 years" anniversary news post (28 May 2026, attended by the Consul of India in Kyrgyzstan), and WDOMS's "Year Instruction Started: 2017"
- **Location:** 32/2 Isakeev Street, Bishkek, Kyrgyzstan (address matches on both the official site and the WDOMS record)
- **Faculties:** General Medicine, Dentistry, Pharmacy, plus a Medical College and residency/postgraduate/PhD programs
- **Student body:** ~1,500 students, a significant proportion international
- **Own clinical infrastructure:** University Clinic established 2017, licensed by the Kyrgyz Ministry of Health, ~225 beds, 2,300+ sq. m, cited equipment includes Olympus video gastroscopes and Carl Storz laparoscopic towers
- **Recognition/registration claimed by official site:** WDOMS, ECFMG/FAIMER, EUA (European University Association)
- **WDOMS direct record (FAIMER School ID F0005118):** confirms Private school type, instruction started 2017, and lists three medical program tracks:
  1. "Medical program for international students" - 5 years, started 2017
  2. "Medical program for students of CIS countries" - 6 years, started 2017
  3. "Doctor of Medicine (With Clinical Rotation)" - 5.5 years, English medium, started 2023, explicitly noted as a track for **Indian students**, entrance exam required
  - AAEPO (Kyrgyzstan accreditation agency, recognized by WFME) status: Accredited as of 10 June 2022
  - ECFMG-Certification-eligible graduation years: 2021-current

## Programs published

| Course slug | Title | Medium | Duration | Notes |
|---|---|---|---|---|
| `mbbs` | Doctor of Medicine / General Medicine | English | 5.5 years | Mapped to WDOMS's Indian-student-oriented "Doctor of Medicine (With Clinical Rotation)" track; 5-year and 6-year alternative tracks also exist per WDOMS/official site - applicants must confirm which applies to them |
| `bds` | Dentistry | English | 5 years | Official faculty page lists Russian-group and English-group curricula |
| `pharmacy` | Pharmacy | English | 5 years | Official faculty page lists full-time and evening curricula |

## What was OMITTED and why

- **Tuition/fees:** Omitted entirely. IMU's official website does not publish a readable, current tuition or living-cost figure. Numerous third-party MBBS-abroad agent/consultancy sites quote figures (e.g. total fee estimates), but per project sourcing rules these single-source commercial claims were not treated as reliable enough to publish as fact. `feeNotes` on each program instead tells students to confirm current tuition directly with IMU admissions.
- **NMC (India) recognition:** NOT asserted as a blanket claim. Many agent portals state "NMC recognized," but no NMC-branded, regulator-issued confirmation naming this specific university was found. WDOMS (a legitimate, sponsor-backed global directory) does confirm the school's listing and an Indian-student-specific program track, which is reported, but the FAQ and "things to consider" explicitly tell Indian applicants to verify current NMC/NEET/FMGE-NExT eligibility themselves before enrolling.
- **Hostel/mess specifics (room types, current charges, "Indian mess" details):** IMU's official FAQ confirms dormitory accommodation exists for out-of-region/international students, but does not publish structured details. Agent-portal claims of an on-campus "Indian mess" at ~USD 100/month were found but are single-source/commercial and were not published as verified fact - the draft instead directs students to confirm with admissions.
- **Founding-year discrepancy:** Several agent sites state IMU was founded in 2003 or 2013. This appears to be conflation with other, differently named Bishkek medical schools (International School of Medicine / International Higher School of Medicine, both actually founded 2003). The official site + WDOMS + IMU's own "10 years" 2026 anniversary post all corroborate 2016 founding / 2017 first license, which is what was published.
- **No standalone Wikipedia article** exists for this specific "International Medical University" (Wikipedia search results returned an unrelated "International University of Kyrgyzstan" instead) - so Wikipedia was not used as a source for this draft.

## Full source list

1. **International Medical University - About us / History of the University (official)**
   https://imu.edu.kg/en/about-us
   Kind: official-university. Checked 2026-07-07.
   Founding date, first license/intake, first graduation, faculties, student count, University Clinic (225 beds), claimed registrations (WDOMS/ECFMG/FAIMER/EUA), graduate outcomes (PLAB UK, FMGE India).

2. **International Medical University Kyrgyzstan - WDOMS school detail record**
   https://search.wdoms.org/home/SchoolDetail/F0005118
   Kind: recognition. Checked 2026-07-07.
   Direct, sponsor-backed global directory record: school type, year instruction started, address, three program tracks with durations/media/start years, AAEPO accreditation status, ECFMG-eligible graduation years.

3. **International Medical University - Faculty pages: General Medicine, Dentistry, Pharmacy (official)**
   https://imu.edu.kg/en/education/faculties-of-the-university/general-medicine (+ /dentistry, /pharmacy)
   Kind: official-program. Checked 2026-07-07.
   Curriculum tracks (5-year/6-year General Medicine; Russian/English-group Dentistry; full-time/evening Pharmacy).

4. **International Medical University - Welcome to IMU (official, applicant-facing)**
   https://imu.edu.kg/en/to-the-applicant/welcome-to-imu
   Kind: official-university. Checked 2026-07-07.
   Direct official statement that graduates practise in India, Pakistan, UK, CIS countries.

5. **IMU homepage (official)**
   https://imu.edu.kg/en
   Kind: official-university. Checked 2026-07-07.
   Dormitory availability, language of instruction options, address, "10 years" anniversary news item (28 May 2026) attended by the Consul of India in Kyrgyzstan.

### Secondary/triangulation sources consulted (not cited as standalone facts in the published draft)

- Multiple Indian MBBS-abroad consultancy/agent sites (flyfuture.in, globaledugateway.in, eaziline.com, brightfutureas.com, mbbsstudyinrussia.com, gmfadmission.in, ensureeducation.com, careermarg.com, afroasianeducation.com, selectyouruniversity.com, collegedunia.com) - used only to sanity-check general claims (e.g. hostel/mess existence, rough recognition narrative) and to confirm founding-year discrepancies were an agent-side conflation, not to source any published fact directly.

## Recommended next step

Seed and publish with:
```
tsx scripts/seed-university-draft.ts --file research-drafts/kyrgyzstan/international-medical-university.json
tsx scripts/publish-university-draft.ts --queue-id <id-from-above>
```
