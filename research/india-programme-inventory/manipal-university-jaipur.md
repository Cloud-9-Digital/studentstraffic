# Manipal University Jaipur -- Programme Inventory

Research pass only (India batch 3, Phase B). No payload/ledger/DB/docs edits were made from this file.

## Sources used

1. **Official site -- "Programs Offered & Eligibility" (international-student route)**
   (`https://jaipur.manipal.edu/international-program-offered.php`, fetched 2026-09-21). This is a
   real **per-programme foreign-national eligibility list**, grouped by faculty and degree level, with
   a direct link to each programme's own page. Reachable. Used as the primary `intl_status` evidence
   for every row: a programme whose `<li>` entry is live (not HTML-commented-out) is
   `open_to_international`; four programmes whose `<li>` entries are present in the page's HTML source
   but wrapped in an `<!-- ... -->` comment (i.e. explicitly disabled/removed from the international
   list, confirmed by inspecting the raw HTML, not just the rendered text) were marked `not_open`:
   - B.Sc. (Hons) in Chemistry (`fosta/bcs-in-chemistry.php`) and B.Sc. (Hons) in Mathematics
     (`fosta/bsc-maths.php`) -- both superseded internationally by the combined "Chemistry / Physics /
     Mathematics" honours programme, which remains live on the eligibility list.
   - M.Tech (Computer-Aided Analysis and Design) and M.Tech (Environmental Engineering) -- both still
     resolve to live programme pages (via a 301 redirect from `foe/...` to `fosta/...`) but are commented
     out of the international list.
   Two further comments (`B.Tech (Electric Vehicle Technology)`, `B.Tech (Lateral Entry)`, `M.Tech Power
   Electronics & Drives`) point to `#nogo`/no working page and were not added as rows -- no live
   programme page could be confirmed for them in this pass.
2. **Individual programme pages** -- 94 distinct `jaipur.manipal.edu/{foa,foe,fohs,fol,fom,fomca,fosta}/*.php`
   URLs were curl-fetched (2026-09-21) from the links on source #1. Used to confirm each programme's
   official title (`<title>` tag) and that the page is live. `duration` was **not** found in the static
   HTML of the sampled pages (no "Duration" label appears in the raw markup; MUJ appears to render
   quick-facts such as duration/fee via a client-side widget not present in the curl'd HTML) -- every
   row is marked `duration = unknown (see official source)` rather than guessed from the degree name or
   URL. `fee-structure.php` and a sampled programme page's "#Program-Fee" anchor show only a General
   Category fee, confirming the batch-3 shortlist's finding that no USD/foreign fee figure is
   published in scrapeable form; this is flagged per row and does not affect `intl_status`, which is
   evidenced separately by source #1.
3. Eight of the 94 fetched URLs were **exact duplicates** of another URL already in the CSV (old
   `foa`/`fom`/`foe` faculty-prefixed pages that now 301-redirect or duplicate a `fomca`/`fosta`-prefixed
   page with an identical `<title>`) -- these were de-duplicated to one row each, keeping the
   canonical current URL. One further URL (`fosta/bsc-hons-physical-science.php`) 301-redirects to the
   MUJ homepage (dead link, commented out of source #1) and was dropped entirely rather than packaged
   as a row. `fohs/school-of-pharmaceutical-sciences.php` is a school landing page, not a programme, and
   was excluded.
4. **International student guide / fee-structure pages** (`international-student-guide.php`,
   `fee-structure.php`) -- checked, confirm the 15% supernumerary foreign/PIO/OCI + 5% NRI route and
   the absence of a scrapeable USD fee table, consistent with the batch-3 shortlist.
5. **Study in India, AICTE, NIRF data file** -- not queried in this pass (time-boxed; the official
   per-programme eligibility list already gave a complete, authoritative, per-row `intl_status` source,
   which is a stronger source than these generic registers would add for this specific field).
6. **Aggregators (Shiksha/Collegedunia/Careers360)** -- not queried in this pass; the official
   international-eligibility page already enumerates every faculty/programme MUJ offers internationally,
   so no missed-programme checklist pass was needed to reach full coverage.

## Methodology

Unlike the batch-3 shortlist's initial finding ("fee determinacy... on_request unless a USD sheet is
found"), this pass located a genuine **per-programme** international eligibility list (source #1) rather
than falling back to a university-wide policy statement -- every row's `intl_status` is evidenced by
that programme's own live/commented status on that page, not by a blanket policy. PhD programmes were
excluded per the task's PhD-exclusion rule (MUJ's international list does not include a PhD section in
the relevant scope). Level is `UG` or `PG` from the degree title, except the 5-year BBA-Integrated-MBA
dual-level award, marked `UG/PG`.

## Counts

- **Total programmes catalogued (excl. PhD): 85**
- By level: UG 50, PG 34, UG/PG (integrated) 1
- By `intl_status`: **81 `open_to_international`**, **4 `not_open`** (B.Sc. Chemistry, B.Sc.
  Mathematics, M.Tech CAAD, M.Tech Environmental Engineering -- all superseded/excluded per source #1).
  None `unknown`.
- **Already on site: 0** (new university; not yet published).
- **GAP canonical courses: 15** distinct parent slugs, covering 23 of the 85 rows:
  - `GAP:bca` (Bachelor of Computer Applications, incl. Hons variant)
  - `GAP:bba` (BBA Hons/Hons with Research, BBA Business Analytics)
  - `GAP:bba-integrated-mba` (5-year integrated BBA+MBA)
  - `GAP:be-btech-biotechnology` (B.Tech Biotechnology)
  - `GAP:be-btech-fashion-technology` (B.Tech Fashion Technology)
  - `GAP:bachelor-interior-design` / `GAP:master-interior-design` (B./M. Interior Design)
  - `GAP:bachelor-physical-education-sports` (BPES)
  - `GAP:bsc-multidisciplinary-sciences` (combined Chemistry/Physics/Mathematics honours)
  - `GAP:mba-real-estate-management` (MBA Real Estate Management)
  - `GAP:me-mtech-bioinformatics` (M.Tech Computational Biology -- **shared parent with University of
    Hyderabad's M.Tech Bioinformatics row**, see `university-of-hyderabad.csv`)
  - `GAP:me-mtech-computer-science-engineering` (M.Tech CSE, M.Tech CSE-AI/ML -- **shared parent with
    UoH's M.Tech/Integrated-M.Tech CS rows**)
  - `GAP:me-mtech-energy-science-technology` (M.Tech Energy Science & Technology)
  - `GAP:me-mtech-environmental-engineering` (M.Tech Environmental Engineering, `not_open`)
  - `GAP:march-computer-aided-architectural-design` (M.Tech CAAD, `not_open`)
  - 62 of the 85 rows matched an existing canonical course slug (several M.Tech-titled but
    Master's-equivalent programmes -- Cyber Security, Data Science -- were mapped to the existing
    `msc-cyber-security` / `msc-data-science` canonical courses rather than given new M.Tech-specific
    GAP slugs, since those canonical courses are level-generic enough to genuinely fit).

## Unreachable / not attempted this pass

- Study in India, AICTE facilities dashboard, NIRF data file: not queried (the official per-programme
  eligibility list was sufficient and more authoritative for `intl_status`).
- Duration, fee amount and detailed eligibility text were not fetched for any of the 85 rows beyond
  what the "Programs Offered & Eligibility" list and each page's `<title>` provide -- confirm before
  packaging.
- Three commented-out `#nogo`/no-URL entries (B.Tech Electric Vehicle Technology, B.Tech Lateral Entry,
  M.Tech Power Electronics & Drives) were not packaged as rows -- no live official page could be
  confirmed for them.

## Phase D packaging (2026-09-21, migration `0113-india-manipal-university-jaipur`)

Packaged **60 of 81** `open_to_international` rows at first; **61** after the M.Com fix below. Ledger row set to `validated`.

Corrections to the Phase B notes above: each live programme page *does* server-render a
"PROGRAM FEES" table with an **International ($)** column (annual tuition + USD 300 one-time
registration) and a "DURATION" block, so fees are `confirmed` in USD per programme (no year is
printed; treated as the current 2026-27-cycle schedule, reasoning in the fee evidence notes). Only
M.Tech Computational Biology publishes no fee and ships `on_request`. Eligibility comes from
`indian-program-offered-eligibility.php`, which the international page names as the source for all
programmes.

Held (20 after the M.Com fix), with reasons:

| Row(s) | Reason |
|---|---|
| B.Tech CSE (Data Science), CSE (AI & ML), Computer & Communication Engg, CSE (Cyber Security), Information Technology, CSE (IoT & Intelligent Systems) | Each page states that from 2025-26 admission is to B.Tech CSE with the specialisation chosen at the end of year two; not a separate intake (covered by the packaged B.Tech CSE row). |
| B.Tech Automobile, B.Tech Electrical & Electronics, BCA (Hons), Bachelor of Commerce, Master of Fine Arts, M.Tech Energy Science & Technology | Page banner: "applicable for students admitted till academic year 2024" (legacy programme). |
| M.Tech Structural Engineering | Conflict: page banner says details apply to students admitted till 2025, while the 2026 eligibility table and fee index still list it. Held until MUJ confirms the 2026-27 intake/fee. |
| M.Arch (Landscape Architecture) | Not on the Council of Architecture approved PG institution lists for 2026 or 2025 (ecoa.in). |
| B.Des Fashion Design, B.Des Interior Design, B.Des Communication Design, B.Des UX & Interaction Design, Master of Planning, M.Des Interior Design | No eligibility published: the eligibility page's links for these programmes lead to tables that do not list them. |

**M.Com (Financial Analysis) released (fix 2026-09-21).** The shared `mcom` course record now exists in
`research/india-batch3-canonical-courses.json`, so the programme is packaged as
`muj-mcom-financial-analysis`: USD 1,990 a year plus USD 300 registration (programme page fee table),
B.Com/BBA or equivalent with 50 per cent (MUJ eligibility table), 2 years, English.

Inventory gaps noticed (not packaged, not in this CSV): M.Sc. Biotechnology, B.Com (Hons) Fintech,
Integrated BBA LLB (Hons) and 3-year LLB appear on MUJ's Course Fee index / eligibility table and
should be checked in a follow-up inventory pass.

Regulator checks: NAAC valid list as on 14-08-2025 still lists MUJ (A+, 3.28, Cycle 1, declared
14-02-2020) - badged with the declaration date only. NBA Tier I: B.Tech CSE and IT to 30-06-2027
(CCE and MBA lapsed 30-06-2026). NIRF 2025: Overall 98, University 58, Engineering 58, Management 81,
Law 32, Architecture 21. UGC state-private list (15.09.2011). CoA UG 2026-27: B.Arch intake 40.
BCI approved list (uploaded 2026-09-18): MUJ School of Law approvals only to 2024-25 - no BCI claim
made; the lapse is stated as a caveat on the BA LLB (Hons).
