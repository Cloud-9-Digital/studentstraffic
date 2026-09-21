# India inbound — batch-3 candidate screen

Scope: next batch of six Indian universities for the inbound (international-student) catalogue, per
`docs/india-inbound-university-expansion-plan.md` Phase 2/4 and `docs/content-seeding-runbook.md`
§1b (programme inventory, full-coverage rule). This is a **discovery and evidence-screen artefact**,
not a payload. No payload, DB row or code was touched.

- Screen date: **2026-09-21**. Re-check by: **2027-03-21** (Indian foreign-national bulletins,
  fee tables and NAAC windows turn over annually).
- Agent: `claude-india-batch3-20260921`.
- Already live / excluded (18 India rows in `research/university-publishing-ledger.csv`, bundles
  `content-migrations/0089`–`0107`): MAHE, Amity Noida, VIT, Symbiosis, KIIT, Amrita, O.P. Jindal,
  SRM IST, LPU, Shiv Nadar, Ashoka, Sharda, CHRIST, FLAME, Chandigarh, World University of Design,
  Sri Ramachandra, JSS AHER. **Note:** the brief says 27 India universities are live; the ledger and
  `content-migrations/*india*` only account for 18. None of the 26 candidates below appears anywhere
  in the ledger, `content-migrations/`, `research/catalog-payloads/` or `lib/`, so the exclusion
  is unaffected, but the 27 vs 18 gap should be reconciled by the supervisor.

## Method

Each candidate was screened on the six criteria in the brief:

1. a real, current **foreign-national admissions route** with published eligibility;
2. **published international fees** (USD or stated currency) — `confirmed` beats `on_request`;
3. **regulator-verified recognition** — read from the regulator's own file, never the institution:
   - NAAC: workbook *Institutions accredited by NAAC having valid accreditation as on 14-08-2025*
     (`https://naac.gov.in/images/docs/ACCREDITATION_STATUS/Institutions_accredited_by_NAAC_having_valid_accreditation-as_on_14082025_1.xlsx`,
     sheet *Universities*; the workbook still has no newer edition on
     `https://naac.gov.in/index.php/en/2-uncategorised/32-accreditation-status`);
   - NIRF 2025: `https://www.nirfindia.org/Rankings/2025/{Overall,University,Engineering,Management,Law,Architecture,Pharmacy,Medical,Dental,Research,Agriculture}Ranking.html`
     (all ten category pages parsed; ranks below are as printed there);
   - UGC IoE list: `https://ioe.ugc.ac.in/Home/ListofIOE` (as recorded in
     `research/india-regulator-verification-2026-08-22.md` §3 — twelve notified IoEs);
   - NBA / BCI: **not re-checked in this pass** — the packaging agent must use the routes in
     `research/india-regulator-verification-2026-08-22.md` §2 and §4;
4. **discipline diversity** vs the 18 live universities (already engineering/business heavy);
5. **catalogue size and curl-reachability** (full-coverage rule: every `open_to_international`
   programme gets packaged);
6. **media likelihood** (Commons/official). Commons API was rate-limited mid-pass; counts are given
   where obtained. No asset was fetched or rights-reviewed — criterion 6 remains a packaging gate.

All pages were read with `curl -sL -A 'Mozilla/5.0 … Chrome/120'` (plus `pdftotext`) and treated as
untrusted data. Aggregators (Shiksha, Collegedunia, Careers360 …) surfaced in search only as
pointers and were not used as evidence.

### Regulator snapshot for all candidates

| Candidate | NAAC (workbook 14-08-2025) | NIRF 2025 (category: rank) | UGC IoE |
|---|---|---|---|
| Jamia Millia Islamia | A++, CGPA 3.61, cycle 2, declared 14-12-2021 | Overall 13; University 4; Engineering 24; Management 28; Law 8; Architecture 5; Dental 17; Research 20 | — |
| University of Hyderabad | A+, 3.28, cycle 4, 03-01-2023 | Overall 26; University 18; Engineering 74; Research 32 | **Notified 17.02.2020** |
| Banaras Hindu University | **not in valid-accreditation workbook** | Overall 10; University 6; Management 60; Medical 6; Dental 15; Research 16; Agriculture 4 | Notified 17.02.2020 |
| University of Delhi | A++, 3.55, cycle 2, 08-11-2024 | Overall 15; University 5; Research 12 | Notified 02.03.2020 |
| Aligarh Muslim University | A+, 3.35, cycle 2, 10-05-2022 | Overall 19; University 10; Engineering 34; Management 69; Law 9; Architecture 26; Medical 29; Dental 28; Research 28 | — |
| Pondicherry University | A+, 3.43, cycle 5, 06-06-2025 | not in the top bands of the pages parsed | — |
| Jamia Hamdard | A+, 3.41, cycle 4, 15-12-2023 | Overall 74; University 47; Management 87; **Pharmacy 1**; Medical 40 | — |
| BITS Pilani | A++, 3.68, cycle 4, 29-11-2024 | University 7 (Engineering row not matched by parser — re-read before badging) | **Notified 14.10.2020** |
| Thapar Institute (TIET) | A++, 3.68, cycle 4, 29-11-2024 | Overall 44; University 26; Engineering 29; Management 46; Research 42 | — |
| Saveetha (SIMATS) | A++, 3.66, cycle 2, 28-06-2022 | Overall 23; University 13; Engineering 45; Management 63; Law 19; Medical 11; **Dental 2**; Research 13 | — |
| Sathyabama | A++, 3.73, cycle 3, 19-05-2023 | Overall 93; University 53; Engineering 67 | — |
| Vel Tech | A++, 3.53, cycle 2, 07-02-2023 | Engineering 87 | — |
| SVKM's NMIMS | A++, 3.67, cycle 4, 28-06-2025 | Overall 95; University 52; Management 24; Pharmacy 11 | — |
| Graphic Era (Deemed) | A+, 3.29, cycle 2, 23-08-2022 | Overall 72; University 48; Engineering 52; Management 52 | — |
| Manipal University Jaipur | A+, 3.28, cycle 1, **declared 14-02-2020** (past the 5-year point) | Overall 98; University 58; Engineering 58; Management 81; Law 32; Architecture 21 | — |
| JAIN (Deemed) | A++, 3.71, cycle 2, 06-12-2021 | University 62; Engineering 84; Management 73 | — |
| Chitkara University (Punjab) | A+, 3.26, cycle 1, **declared 07-09-2021** (5-year point = now) | University 78; Engineering 89; Management 78; Architecture 38; Pharmacy 16 | — |
| Parul University | A++, 3.55, cycle 1, 20-02-2023 | Pharmacy 41 | — |
| Marwadi University | A+, 3.31, cycle 1, 09-11-2023 | not ranked on the pages parsed | — |
| UPES | A, 3.02, cycle 2, **declared 01-03-2021** | not matched | — |
| Bennett University | A+, 3.48, cycle 1, 23-01-2025 | not matched | — |
| Galgotias University | A+, 3.37, cycle 1, 16-08-2022 | Law 36; Pharmacy 55 | — |
| Alliance University | A+, 3.26, cycle 1, 08-11-2024 | Management 71; Law 20 | — |
| PES University | A+, 3.34, cycle 1, 06-10-2023 | not matched | — |
| Presidency University, Bengaluru | A, 3.09, cycle 1, 22-06-2024 | not matched | — |
| Woxsen University | **not in workbook** | not matched | — |

NAAC caveat carried over from the 2026-08-22 verification: the workbook gives a **declaration date,
not an expiry**. Badge with cycle + declaration year only; MUJ (Feb 2020), UPES (Mar 2021) and
Chitkara (Sep 2021) are at or past the five-year point with no newer SC result seen — hold their
NAAC badge unless a fresh declaration is found.

---

## Per-candidate verdicts

### GO

#### Jamia Millia Islamia — `jamia-millia-islamia` — **GO**
- Type: Central University (public), New Delhi.
- Route: FSA office page *University Admission 2026-2027 (Foreign/NRI)* —
  `https://jmi.ac.in/ACADEMICS/International-FSA/Foreign-Students-Advisor/University-Admission-2026-2027-(Foreign/NRI)`
  — 25% supernumerary foreign/NRI seats + ICCR scholars; schedule, guidelines, seat matrices, FRRO
  and PhD notes are separate PDFs under `https://jmi.ac.in/upload/menuupload/`
  (`fsa_admission_schedule_2026-2027.pdf`, `fsa_guidelines_2026-2027.pdf`,
  `fsa_seats_ug_programme.pdf`, `fsa_seats_pg_programme.pdf`, `fsa_phd_admission.pdf`,
  `fsa_list_phd_programme.pdf`).
- Fees: **confirmed**, `fsa__feestructure_fsa_nri_2026-27.pdf` — USD per semester by faculty
  **and region** (SAARC / West Asian / African & Latin American / all other), separate general-
  category and ICCR columns, NRI column (e.g. BDS USD 50,000 whole duration; engineering/law/fine
  arts/management/architecture PG groups USD 1,000–2,000 per semester by region). The PDF's layout
  columns interleave under `pdftotext -layout`; the packager must map region→amount from the rendered
  PDF, not the text dump.
- Recognition: NAAC A++ 3.61 (Dec 2021); NIRF 2025 University #4, Law #8, Architecture #5,
  Dental #17. BCI (Faculty of Law) and NBA to be checked by the packager.
- Diversity: **law, architecture & planning, fine arts / applied art / design, tourism & hospitality
  management, dentistry, social work, languages** — almost none of which the live set covers from a
  public institution.
- Size: ~69 UG + ~100 PG rows in the foreign-seat matrices (plus a separate PhD list) — **large
  (~170 excl. PhD)**, but the complete inventory sits in three curl-reachable PDFs.
- Media: Commons category *Jamia Millia Islamia* — 352 files, 7 sub-categories.
- Risks: size; BDS is NEET-gated (national rule) and needs the medical caveat treatment; language
  departments (Arabic, Persian, Urdu, Hindi, Sanskrit) may teach in the target language — record
  teaching language per programme.

#### University of Hyderabad — `university-of-hyderabad` — **GO**
- Type: Central University (public), Hyderabad; **UGC Institution of Eminence, notified 17.02.2020**.
- Route: Prospectus 2026-27 `https://acad.uohyd.ac.in/downloads/pros2026.pdf` (18.5k lines) has a
  "FEES PAYABLE BY FOREIGN STUDENTS 2026-27" table and an "Admission of Foreign Nationals" section
  (15% supernumerary; admission *in absentia* on qualifying record; IELTS 6.5 / TOEFL required;
  NRIs with Indian passports are **not** international). OIA page
  `https://oia.uohyd.ac.in/direct-admissions/` still links the 2021 prospectus — cite the 2026
  prospectus, not OIA.
- Fees: **confirmed**, USD per semester + one-time development fee, two tiers (foreign/NRI vs
  SAARC & Korean) by programme group (e.g. MCA/M.Tech group USD 1,880/sem + USD 1,100 one-time;
  SAARC USD 940 + 550).
- Recognition: IoE; NAAC A+ 3.28 (Jan 2023); NIRF 2025 University #18, Overall #26.
- Diversity: sciences, humanities, social sciences, **performing arts, fine arts, communication**,
  management, integrated 5-year M.Sc./M.A. — public research-university profile absent from the live set.
- Size: **medium-large (~130 degree programmes + PhD)**; one PDF.
- Media: Commons *University of Hyderabad* — 28 files, 9 sub-categories.
- Risks: PG/integrated/PhD heavy, few UG; long PDF; per-department eligibility must be read
  programme by programme.

#### Marwadi University — `marwadi-university` — **GO**
- Type: State private university, Rajkot, Gujarat.
- Fees: **confirmed**, per-programme USD annual fee with/without hostel —
  `https://www.marwadiuniversity.ac.in/wp-content/uploads/2026/03/Fees-USD-Flyer_2026-27-2.pdf`
  (e.g. B.Tech CSE USD 2,000 without hostel / 3,200 with; MBA USD 1,800 / 3,000; BA LLB USD
  2,000 / 3,200). The cleanest confirmed per-programme fee table of any candidate.
- Route: international admissions section on the same site (flyer is the international fee sheet);
  packager must capture the international eligibility page URL and qualification equivalence rule.
- Recognition: NAAC A+ 3.31 (Nov 2023). No NIRF 2025 rank on the pages parsed — do not badge one.
- Diversity: engineering and business plus **law, B.Sc. Agriculture, pharmacy, physiotherapy,
  nursing, GNM, microbiology**.
- Size: **medium (~75 rows on the flyer, incl. diplomas and a single "PhD (All Disciplines)" row)**.
- Media: Commons *Marwadi University* — 2 files only; official-site cover will likely be needed.
- Risks: flyer text columns misalign under `pdftotext` (fee must be mapped from the rendered PDF);
  nursing/GNM professional-registration caveats; logo rights.

#### BITS Pilani — `birla-institute-of-technology-and-science-pilani` — **GO**
- Type: Deemed University; **UGC Institution of Eminence, notified 14.10.2020**.
- Route: International Students Admission (ISA) scheme — non-Indian passport holders, **SAT-based**,
  UG only (B.E., B.Pharm., integrated M.Sc.) across Pilani, Goa and Hyderabad. Brochure:
  `https://www.bitsadmission.com/ISA/downloads/ISA_Brochure.pdf` (Academic Year 2026-27; 2026 window
  12 Dec 2025 – 5 Apr 2026, so the next cycle opens ~Dec 2026).
- Fees: **confirmed (INR stated)** —
  `https://admissions.bits-pilani.ac.in/ISA/downloads/ISA_Fee_Structure_2026-27.pdf`: non-SAARC
  tuition INR 7,42,500/semester, SAARC INR 4,37,250/semester, one-time, hostel and year-on-year
  escalation schedule printed; merit tuition waivers of 15–80% stated in the brochure.
- Recognition: IoE; NAAC A++ 3.68 (Nov 2024); NIRF 2025 University #7 (Engineering rank to be read
  directly before badging — the parser missed that row).
- Diversity: engineering + **pharmacy + integrated sciences/economics**; weak on diversity but the
  only SAT-route, top-tier, small catalogue in the pool.
- Size: **small (~20 degree titles × 3 campuses ≈ 45–55 offerings)**; PG/PhD are not in the ISA scheme
  (mark `not_open` in the inventory).
- Media: no Commons category found under the obvious name — official media likely needed.
- Risks: subject-specific PCM/PCB rules per degree; campus-specific availability must be read from
  the brochure; Dubai campus is out of scope (not India).

#### Jamia Hamdard — `jamia-hamdard` — **GO (fee recheck)**
- Type: Deemed to be University, New Delhi.
- Route: Prospectus 2026-27
  `https://www.jamiahamdard.ac.in/uploads/files/prospectus_2026-2027_@_2-July.pdf` (foreign-national
  eligibility per programme; 25% tuition discount clause for certain foreign nationals), linked from
  `https://www.jamiahamdard.ac.in/admissions-2026540`.
- Fees: **confirmed but one cycle old** — `https://ums.jamiahamdard.ac.in/Files/Fee_structure.pdf`
  ("FEE STRUCTURE 2025-26"; "Fee Structure for NRI/Industry Sponsored & Foreign Nationals in US $",
  per-programme annual USD, e.g. M.Sc. Biotechnology USD 3,000/yr; one-time USD 150+150+200+200;
  PhD foreign fees table). Packager must look for a 2026-27 edition; if none, publish as
  `indicative` with the 2025-26 year stated, not `confirmed`.
- Recognition: NAAC A+ 3.41 (Dec 2023); NIRF 2025 **Pharmacy #1**, University #47, Medical #40.
- Diversity: **pharmacy, Unani medicine (BUMS/MD Unani), nursing, allied health, life sciences,
  law, management** — health-sciences breadth outside the MBBS route.
- Size: **medium (~115 fee rows)**.
- Media: Commons *Jamia Hamdard* — 23 files.
- Risks: MBBS and other NMC/NCISM-regulated programmes need NEET/regulator caveats (hold MBBS if
  incomplete); Kannur campus programmes must be separated from the Delhi campus.

#### Manipal University Jaipur — `manipal-university-jaipur` — **GO (conditional: fee state)**
- Type: State private university, Jaipur (Manipal group; distinct from MAHE, which is live).
- Route: `https://jaipur.manipal.edu/international-program-offered.php` — 15% supernumerary seats
  for foreign/PIO/OCI + 5% NRI within intake; no MUJ entrance test for international applicants;
  NOC/visa process described; international-student guide
  `https://jaipur.manipal.edu/international-student-guide.php`, refund page
  `international-fee-refund.php`.
- Fees: **not yet located in USD.** `https://jaipur.manipal.edu/fee-structure.php` links each
  programme page's "#Program-Fee" block, and the international menu labels it "Course Fee (General
  Category)"; no USD/foreign figure appears on a sampled page (`/fol/ballb-hons.php`). Package as
  `on_request` unless an international fee sheet is found.
- Recognition: NIRF 2025 University #58, **Architecture #21, Law #32**, Engineering #58. NAAC A+ is
  dated **14-02-2020** — hold the NAAC badge.
- Diversity: **hotel management (BHM, BBA Hospitality & Tourism), architecture & planning (B.Arch,
  M.Plan), design, fashion technology, fine arts (MFA), law, journalism, psychology** — the best
  hospitality/design/architecture mix in the pool.
- Size: **medium-large (~110 programmes; ~74 have fee-anchored programme pages)**, all server-rendered.
- Media: Commons check rate-limited; official campus imagery likely.
- Risks: fee determinacy; NAAC currency; B.Arch is NATA/JEE-Paper-2 gated nationally.

### HOLD

- **Aligarh Muslim University** (`aligarh-muslim-university`) — strongest evidence of any public
  candidate: *Guide to Admissions (Supplement-FN) 2026-27*
  (`https://amucontrollerexams.com/uploads/files/3aab9a9674cb20348821ed58a7fabe09.pdf`) lists every
  open course with intake, duration, USD 100 processing charge and **per-course USD annual fee**;
  rolling foreign-national admission; NAAC A+ (2022); NIRF University #10, Law #9. Held only for
  **size (~280 courses)** — schedule it as the lone giant of batch 4.
- **Vel Tech** — confirmed USD fees by school (e.g. B.Tech SAARC USD 4,600 / non-SAARC USD 6,600;
  commerce/BBA USD 2,600 / 4,600) at `https://www.veltech.edu.in/international-students-admission/`;
  NAAC A++ (2023); NIRF Engineering #87. Held for diversity only (engineering-dominated). **First
  alternate** if MUJ's fee state cannot be resolved.
- **University of Delhi** — FSR bulletin 2026-27 (`https://fsr.du.ac.in/06052026_FSR-Brochure_compressed.pdf`)
  gives eligibility (45% UG / 50% PG) but **no fee figures** ("check the fee structure" per college);
  catalogue is college × programme and enormous. IoE, NAAC A++ (2024).
- **Banaras Hindu University** — foreign-student portal `https://bhufsradm.samarth.edu.in/2026/`
  is a JS app (programme list/prospectus not curl-readable); fees not found; **BHU is absent from the
  NAAC valid-accreditation workbook**. IoE; NIRF Agriculture #4.
- **Pondicherry University** — foreign-student portal `https://pondifsradmission.samarth.edu.in/`
  and brochure path on `admissions.pondiuni.edu.in` return a JS shell; public reporting says fees
  "announced separately". NAAC A+ (2025).
- **Parul University** — NAAC A++ (2023), faculties incl. agriculture, hotel management, design,
  ayurveda, homoeopathy; international fee page
  `https://www.paruluniversity.ac.in/international-students-fees-structure/` loads via a nonce'd
  WordPress AJAX call that returned "No matching programs" to curl; 200+ programmes. Needs browser
  rendering and is a giant.
- **Chitkara University** — "All programs are open for International Students"
  (`https://www.chitkara.edu.in/admissions/international-students/`), so full coverage = whole
  catalogue; international fee not found on site; NAAC declared Sep 2021 (at expiry). Strong
  Pharmacy #16 / Architecture #38.
- **Saveetha (SIMATS)** — NIRF Dental #2, Medical #11, Law #19; international fee figures not found
  on an official page; very large and medical-heavy (NMC/DCI caveats).
- **Galgotias University** — international route and USD 300 confirmation fee on
  `https://www.galgotiasuniversity.edu.in/p/international-admissions`; programme-fee table not located
  (PDF attachments unlabelled); overlaps Sharda (Greater Noida).
- **NMIMS** — international route is programme-specific (MBA via GMAT); only a 2018-19 USD figure is
  public; multi-campus management-heavy.
- **UPES** — route and eligibility at `https://www.upes.ac.in/international-admissions`, but
  `https://www.upes.ac.in/admissions/fee-structure/international-admissions` says 2026-27 fees
  "will be updated soon"; NAAC A (declared Mar 2021).
- **Thapar Institute** — only FN/NRI document found is a 2014 PDF
  (`https://www.thapar.edu/images/admission/Admission%20for%20FN-NRI%20CANDIDATES.pdf`); engineering-only.
- **Jain (Deemed)** — international section exists (`https://www.jainuniversity.ac.in/International`)
  but no fee figures beyond a USD 100 application charge; large catalogue.
- **Sathyabama** — international page `https://www.sathyabama.ac.in/International_Student_Admissions`
  has an application route but no international fees; engineering-heavy.
- **Bennett University** — USD figures appear only on aggregators; official international fee not
  located. **Alliance University** — foreign-national scholarship rules published
  (`https://www.alliance.edu.in/international-admissions/`), fees not; strong Law #20.

### SKIP

- **Woxsen University** — fee sheet gated behind a lead form; **not in the NAAC workbook**.
- **PES University** — no published foreign-national route or fee; admissions office contact only.
- **Graphic Era** — no official international admissions/fee page found.
- **Presidency University, Bengaluru** — no international page found. (Search results for
  "Presidency University international" resolve to **Presidency University, Kolkata**, a different
  state public university with a plain-paper foreign-student route and a USD 1,000/semester fee at
  `https://www.presiuniv.ac.in/web/internationalstudents.php` — worth a separate look later; not
  confused with the Bengaluru candidate here.)

---

## Recommended batch 3

| # | Slug | Type | Approx. programmes | Fee state | Why |
|---|---|---|---|---|---|
| 1 | `jamia-millia-islamia` | Central (public) | ~170 (+PhD) | confirmed, USD by region | Law #8, Architecture #5, fine arts, hospitality, dental — public |
| 2 | `university-of-hyderabad` | Central (public), IoE | ~130 (+PhD) | confirmed, USD/semester | IoE public research university; arts, humanities, sciences |
| 3 | `jamia-hamdard` | Deemed | ~115 | confirmed 2025-26 (recheck for 2026-27) | Pharmacy #1, Unani, nursing, allied health |
| 4 | `manipal-university-jaipur` | State private | ~110 | on_request unless a USD sheet is found | hotel management, architecture, design, fashion, law |
| 5 | `marwadi-university` | State private | ~75 | confirmed, per-programme USD | cleanest fee table; agriculture, law, pharmacy, nursing |
| 6 | `birla-institute-of-technology-and-science-pilani` | Deemed, IoE | ~45–55 (UG only) | confirmed (INR) | SAT route, top-tier, small catalogue |

Reasoning:

- **Size mix:** two large public PDFs (JMI, UoH), three mid-size (Jamia Hamdard, MUJ, Marwadi), one
  small (BITS). No 250+ giant — AMU, Parul, DU, BHU and Chitkara are deferred for that reason.
- **Public universities:** two (JMI, UoH), both with a live 2026-27 foreign-national route and
  confirmed USD fees in official PDFs.
- **Discipline gain over the live 18:** law and architecture from a public university (JMI),
  hospitality/hotel management and fashion (MUJ, JMI), pharmacy, Unani and nursing (Jamia Hamdard,
  Marwadi), agriculture (Marwadi), performing and fine arts (UoH, JMI, MUJ). Engineering exposure
  is limited to BITS's small UG list.
- **Fee determinacy:** five of six carry published figures (four confirmed for 2026-27, Jamia Hamdard
  2025-26); only MUJ is expected to ship `on_request`. If MUJ's fee cannot be resolved and the
  supervisor wants six confirmed-fee universities, swap in **Vel Tech** (alternate).
- **Reachability:** every inventory source for the six is curl-readable (server-rendered HTML or
  PDF). No candidate in the batch depends on a JS-only portal.

Packaging notes for the batch:

1. Build `research/india-programme-inventory/<slug>.csv` + `.md` first (§1b); for JMI and UoH the
   foreign-seat matrices / prospectus fee groups define `intl_status`.
2. Re-read NIRF rank rows and pull NBA/BCI status per the 2026-08-22 verification routes before
   writing any `recognitionBadges`.
3. Medical/dental/Unani/nursing programmes (JMI BDS, Jamia Hamdard MBBS/BUMS, Marwadi nursing):
   package only with complete NEET/regulator caveats, otherwise hold per programme with the reason in
   the inventory.
4. Media for Marwadi, BITS and MUJ will likely need official sources; record rights status.
