# Jamia Hamdard — programme inventory (India batch 3, Phase B)

## Sources used
1. **Admissions 2026-27 entry page** — `https://www.jamiahamdard.ac.in/admissions-2026540`.
2. **Prospectus 2026-27 (PDF, 45 pages)** — `https://www.jamiahamdard.ac.in/uploads/files/prospectus_2026-2027_@_2-July.pdf` — used as a secondary/cross-reference source for programme names and eligibility framing; not the primary evidence for `intl_status` (see below).
3. **Fee structure PDF — the primary source for this inventory** — `https://ums.jamiahamdard.ac.in/Files/Fee_structure.pdf` ("Guide to Admissions, Jamia Hamdard — FEE STRUCTURE 2025-26"). This single 17-page document contains **three parallel per-programme fee tables**, school by school: (a) Indian students in INR, (b) Foreign Nationals/NRI/Industry-Sponsored in USD, (c) SAARC-countries nationals in USD. Every CSV row's `intl_status` was decided by checking whether the programme's title appears as a line item in table (b); presence in table (a) alone does **not** make a programme `open_to_international`.
4. **Study in India, AICTE, NIRF data files** — not queried in this pass; flagged as a follow-up before packaging.
5. **Aggregators (Shiksha, Collegedunia, Careers360)** — not queried as a missed-programme checklist in this pass; flagged as a follow-up.
6. PhD fee tables (Indian and Foreign, pages ~14-17 of the fee PDF) were read but excluded from the inventory per instructions.

## Coverage and method — the fee-year is one cycle old
The fee PDF is explicitly titled **"FEE STRUCTURE 2025-26"**, not 2026-27. No 2026-27 edition was found on `ums.jamiahamdard.ac.in` or linked from the admissions page in this pass. Every `open_to_international` row in this CSV should be treated as **confirmed for 2025-26 pricing, indicative for 2026-27** — the packaging agent must look again for a refreshed 2026-27 fee document before publishing `admissionsContent`, per the batch-3 shortlist note ("GO (fee recheck)").

## Method notes — per-programme cross-match (the quality-bar requirement)
This is the key finding of this pass: **the Foreign Nationals fee table does not simply mirror the Indian-fee table's programme list.** Several programmes priced for Indian students have **no corresponding line in the Foreign Nationals table**, and were therefore marked `not_open` or `unknown` rather than assumed open:
- **B.Tech (CSE), B.Tech (ECE), B.Tech (CSE) Artificial Intelligence, BCA** — all four priced in INR for Indian students, none present in the Foreign Nationals USD table, even though the same school's `Bachelor of Science (Hons.) Computer Science` and several of its M.Tech/MCA programmes *are* present. Marked `not_open`.
- **M.Sc. (Pharmacovigilance)** — priced in INR, absent from the Foreign Nationals table while every other Chemical & Life Sciences programme is present. Marked `not_open`.
- **B.Sc. (Forestry), B.Sc. (Material Science & Nano Tech), Pre-Tib, B.A. Public Policy, M.A. (Federal Studies), B.A.(Hons) Hindustani Music** — each priced only in the Indian-fee table with no line in the Foreign Nationals table found in this pass. Marked `unknown`, not `not_open`, because their absence could reflect an incomplete extraction of a densely-formatted PDF rather than a genuine policy exclusion — these need a second read of the rendered PDF (not just `pdftotext`) before a packaging decision.
- **B.Sc. Medical Laboratory Technology (BMLT)** — present in the **SAARC-countries** fee table but not in the general Foreign Nationals table, suggesting a SAARC-only intake; flagged `open_to_international` with a note rather than silently treated as universal.

Where the Foreign Nationals table combines multiple named specialisations or admission tracks (Regular/SFS, multiple M.Pharm specialisations, MPT/MOT "all disciplines", MD Unani "all disciplines") under one fee line, that is kept as **one CSV row**, matching the source's own level of granularity, with the specialisation list preserved in `notes`.

`canonical_course_match` was checked against the full canonical list in `lib/data/program-taxonomy.ts`. Genuine matches were used where the level and field align (e.g. `bpharm`, `bpt`, `bsc-nursing`, `mba`, `llm`, `bachelor-occupational-therapy`/`master-occupational-therapy` — both of which exist as exact canonical slugs). Where no canonical slug exists for the field — almost the entire allied-health/paramedical department (Optometry, Medical Imaging, Anesthesia & OT Techniques, Cardiology Lab, Dialysis, Emergency & Trauma Care), Unani medicine (BUMS, MD Unani, Diploma in Unani Pharmacy), and several niche PG programmes — a `GAP:<parent-slug>` was used at the parent level, not per specialisation.

Duration was read from each fee table's year-column count (four fee-year columns = 4 years, two = 2 years, five = 5 years for BUMS with the 5th year at half-rate consistent with an internship year), not guessed from the title.

Campus is recorded as New Delhi for every row; a possible Kannur satellite campus was flagged as a risk in the batch-3 shortlist screen but no campus-specific programme split was found in the fee PDF in this pass — needs confirmation before packaging.

MBBS is not offered directly by Jamia Hamdard's own admission route in any source read in this pass (the university's medical college, HIMSR, was not found in the fee PDF) and is correctly absent from this inventory.

## Counts
- **Total programmes (excl. PhD): 83**
- By level: UG 41, PG 40, Diploma 2
- `intl_status`: `open_to_international` 72, `not_open` 5, `unknown` 6
- Already on our site: 0 (new university)
- GAP rows: majority of the 83 (mostly the allied-health/paramedical department and Unani medicine, which have no taxonomy equivalents at all), spanning **45 distinct GAP parent courses** (listed below)

## Distinct GAP parent courses (45)
`ba-hindustani-music`, `ba-islamic-studies`, `ba-llb-integrated`, `bachelor-healthcare-management`, `bachelor-optometry`, `bachelor-public-policy`, `bba`, `bca`, `bsc-anesthesia-ot-techniques`, `bsc-biochemistry`, `bsc-biomedical-science`, `bsc-cardiology-laboratory-techniques`, `bsc-clinical-research`, `bsc-computer-science`, `bsc-dialysis-techniques`, `bsc-emergency-trauma-care-techniques`, `bsc-material-science-nanotechnology`, `bsc-medical-imaging-techniques`, `bsc-toxicology`, `bums`, `diploma-general-nursing-midwifery`, `diploma-pharmacy`, `diploma-unani-pharmacy`, `ma-federal-studies`, `ma-human-rights`, `ma-islamic-studies`, `master-optometry`, `mca`, `md-unani`, `mpharm`, `msc-anesthesia-ot-techniques`, `msc-biochemistry`, `msc-bioinformatics`, `msc-biomedical-science`, `msc-clinical-research`, `msc-dialysis-techniques`, `msc-forensic-science`, `msc-medical-laboratory-science`, `msc-medical-radiology-imaging-techniques`, `msc-nursing`, `msc-pharmacovigilance`, `msc-toxicology`, `msc-virology`, `mtech-biotechnology`, `mtech-computer-science-engineering`, `mtech-cyber-forensics-information-security`.

Note: `ba-islamic-studies` and `ma-islamic-studies` are shared with the Jamia Millia Islamia inventory in this same batch — resolving them once benefits both universities.

## Follow-ups before packaging
- Locate a 2026-27 fee edition; if none exists, publish fee facts as `indicative` with the 2025-26 year explicitly stated, per the batch-3 shortlist's own "fee recheck" flag.
- Re-render (not just `pdftotext`) the fee PDF for the six `unknown` rows to confirm whether they are genuinely absent from the Foreign Nationals table or lost to column-interleaving in the text extraction.
- Confirm BUMS admission mechanics for foreign nationals (NCISM regulation, NEET applicability) before packaging.
- Confirm whether BMLT is genuinely SAARC-only or just missing from the general Foreign Nationals table by parsing error.
- Cross-check the full catalogue against Study in India / AICTE / NIRF and the Shiksha/Collegedunia/Careers360 checklist per runbook §1b.
- Resolve the 45 GAP parents (many concentrated in allied health and Unani medicine, a discipline gap not yet represented in the taxonomy at all) against taxonomy review before packaging affected rows.

## Phase D packaging (2026-09-21, claude-india-batch3-20260921)
Bundle: `content-migrations/0108-india-jamia-hamdard/payload.json` — **72 offerings** (77 after the 2026-09-21 fix below), ledger `validated`.

**Fee source replaced.** The 2026-27 prospectus (`prospectus_2026-2027_@_2-July.pdf`, pp. 147-156, image tables rendered and read visually) contains a *Fee Structure 2026-27* with a per-semester **Foreign Nationals (USD)** column (inclusive of one-time, e-governance, exam and course fees; USD 200 refundable library deposit extra) plus SAARC and NRI columns. All packaged fees are `confirmed` for 2026-27 from that table; the 2025-26 `ums` PDF is no longer used.

**Unknown rows resolved:** B.Sc. Forestry, B.Sc. Material Science & Nanotechnology, B.A. Public Policy and M.A. Federal Studies → `open_to_international` (FN fee listed) and packaged. B.A. Hindustani Music → open but **held** (teaching language not established). Pre-Tib → `not_open` (Indian fee only).

**Row split:** the combined FN row "M.A. (Politics, Governance and Public Policy)" is listed separately in 2026-27 and is packaged as two offerings: M.A. Public Policy (`master-public-policy`) and M.A. Politics and Governance (`master-political-science`).

**Held (with reasons):**
- Diploma in Unani Pharmacy, BUMS, MD (Unani) — 2026-27 table has no Foreign Nationals fee (NRI/SAARC only); BUMS/MD admission is council-controlled; NCISM not verified.
- B.A. (Hons) Islamic Studies, M.A. Islamic Studies — teaching language not established (CUET Urdu paper; Arabic in curriculum).
- B.A. Hindustani Music — teaching language not established.

**Former not_open rows, now packaged (fix 2026-09-21):** B.Tech CSE, B.Tech ECE, B.Tech CSE (AI), BCA and M.Sc. Pharmacovigilance carry Foreign Nationals fees in the 2026-27 table (USD 1,250 / 1,250 / 1,250 / 750 / 500 per semester; SAARC 1,200 / 1,200 / 1,200 / 683 / 400; pp. 151, 153, 154, re-read visually), and the programme page for B.Tech CSE-AI says "additional seats are available for Foreign Nationals". They are reclassified `open_to_international` in the CSV and packaged in 0108 (bundle total **77**): programme pages p. 32 (B.Tech x3: 180 / 60 / 60 seats, JEE Main or qualifying-exam merit, Class 12 with Mathematics and Physics, 50%), p. 33 (BCA: 3 years, 120 seats, 50% with a listed mathematics/commerce/computing subject) and p. 53 (M.Sc. Pharmacovigilance: 2 years, 10 seats, bachelor's in Clinical Research/Pharmacy/Medical Science or related field, 50%). Canonicals: `be-btech-computer-science-engineering`, `be-btech-electronics-communication-engineering`, `be-btech-artificial-intelligence-machine-learning`, `bca`, `msc-allied-health-sciences`.

**Evidence caveats:** eligibility for pharmacy, nursing, M.Tech CSE (3), MBA, M.Sc. Toxicology and M.Sc. Environmental Science comes from the 2025-26 Guide to Admissions because the 2026-27 prospectus omits the text. Teaching language (English) is inferred from the FSA English-foundation course rule, English-medium entrance tests and BHM's explicit statement — no programme-level medium line exists. Duration conflicts (fee table 4 yrs vs programme page): DGNM (3), BPT and BOT (4 + 1-yr internship = 5), Optometry (5) — programme page used, total tuition omitted.

**Not in inventory but in the 2026-27 prospectus (follow-up):** B.Sc. Physics, B.Sc. Computational Mathematics, B.A. English, B.A. Applied Psychology, B.A. Film Making, B.Sc. Nutrition & Dietetics, MBA (Healthcare & Hospital Mgmt), MBA (Pharmaceutical Mgmt), M.Sc. Microbiology, five School of Skills B.Sc./B.Voc programmes — all with FN fees.

**Regulator checks:** UGC deemed list (10.05.1989) ✔; NAAC A+ 3.41 Cycle 4, declared 15-12-2023 ✔; NIRF 2025 Pharmacy 1, University 47, Overall 74, Management 87, Medical 40 ✔; BCI approved CLE (HILSR, 5-yr BA LLB 180, to 2026-27; list uploaded 2026-09-18) ✔; NBA — no entries; PCI — live API unreachable, static list stale (B.Pharm to 2023-24) → no PCI claim; INC/NCISM not claimed.
