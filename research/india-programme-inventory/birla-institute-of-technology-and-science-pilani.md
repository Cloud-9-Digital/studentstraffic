# BITS Pilani -- Programme Inventory

Research pass only (India batch 3, Phase B). No payload/ledger/DB/docs edits were made from this file.

## Sources used

1. **ISA Information Brochure (primary)** --
   `https://www.bitsadmission.com/ISA/downloads/ISA_Brochure.pdf` ("International Students Admission
   (ISA) Scheme, Integrated First Degree Programmes of BITS Pilani at Pilani, K. K. Birla Goa &
   Hyderabad Campuses, Academic Year 2026-27", 23 pages, fetched 2026-09-21). Reachable. This is the
   single official document describing the entire foreign-national undergraduate/integrated-first-degree
   admission route: eligibility (non-Indian passport holders only; SAT-based; PCM or PCB subject
   combinations depending on programme), the full B.E./B.Pharm./M.Sc. programme list with per-campus
   footnotes (`*`, `**`, `#`), fee structure, scholarship policy and visa notes. Used as
   `official_source_url` and `intl_evidence_url` for every `open_to_international` row: the brochure
   itself is the per-programme, per-scheme eligibility evidence (a named programme appears in the ISA
   programme table only if it is open to the ISA international route).
2. **ISA Fee Structure 2026-27** --
   `https://admissions.bits-pilani.ac.in/ISA/downloads/ISA_Fee_Structure_2026-27.pdf` (fetched
   2026-09-21). Reachable. Confirms tuition is **scheme-wide, not per-programme**: one non-SAARC and one
   SAARC tuition figure applies to every ISA-admitted student regardless of which B.E./B.Pharm./M.Sc.
   programme they join (INR 7,42,500/semester non-SAARC, INR 4,37,250/semester SAARC for AY 2026-27, plus
   one-time/annual fees and a merit tuition-waiver scale of 15-80%). Recorded as `other_sources` on every
   `open_to_international` row. Per runbook §1b, this is the "university-wide (here: scheme-wide) policy"
   fallback -- the *fee* is scheme-wide, but *programme eligibility* is still evidenced per-programme from
   the brochure's programme table and campus footnotes, which is the stronger of the two signals and is
   what drives `intl_status` here.
3. **"Programmes Offered" page (international-student site)** --
   `https://www.bits-pilani.ac.in/programmes-offered/` (fetched 2026-09-21). Reachable. Lists only two
   international-admission routes: the PhD programme (excluded from this inventory per task scope) and,
   by cross-reference, the ISA undergraduate/integrated-first-degree scheme. No on-campus M.E./M.Tech or
   MBA coursework programme is listed as open to international applicants anywhere on this page or the
   ISA brochure. Used as evidence for the single `not_open` summary row for on-campus PG coursework
   programmes.
4. **bits-pilani.ac.in sitemaps** (`sitemap.xml`, `page-sitemap.xml`, `post-sitemap*.xml`) -- indexed but
   not further crawled once the "Programmes Offered" page confirmed no additional international PG route;
   the general (non-ISA) programmes-offered listing for Indian students was out of scope for this
   inbound-international inventory.
5. **Study in India / AICTE / NIRF** -- not queried in this pass. The batch-3 shortlist screen recorded
   NAAC A++ (cycle 4, 29-11-2024) and NIRF 2025 University rank #7, with the Engineering-category row
   **not confirmed** by the parser ("re-read before badging") -- flagged again here for the packaging
   pass.
6. **Aggregators (Shiksha/Collegedunia/Careers360)** -- not queried; the ISA brochure's own programme
   table is a complete, authoritative, dated catalogue for the international route, so no missed-programme
   checklist pass was needed.
7. **Canonical taxonomy** -- `docs/programme-taxonomy.md` and `lib/data/program-taxonomy.ts` (all
   canonical slugs read and diffed against every CSV row).

## Campus coverage

BITS Pilani's ISA scheme spans three campuses: **Pilani (Rajasthan)**, **K. K. Birla Goa Campus
(Goa)**, and **Hyderabad Campus (Telangana)**. The Dubai and Mumbai campuses referenced on the fee-sheet
letterhead are **not** part of the ISA scheme and are out of scope.

The ISA brochure's programme table only explicitly footnotes **3 of 11 B.E. titles** as campus-restricted:

- **Civil Engineering** -- Pilani & Hyderabad only (not Goa).
- **Manufacturing Engineering** -- Pilani only.
- **Electronics and Computer Engineering** -- K. K. Birla Goa Campus only.

Every other B.E. title, B.Pharm. (explicitly stated as Pilani & Hyderabad only in prose, separate from
the footnote convention) and all 6 M.Sc. integrated-first-degree titles carry **no campus footnote** in
the source table. Rows for those programmes are recorded at all three campuses under the assumption that
"no footnote = offered everywhere," consistent with how the three footnoted exceptions are marked. This
assumption is **not independently confirmed** against a per-campus admissions page and is flagged in the
`notes` column of every such row for the packaging agent to verify (e.g. against each campus's own
academic-department page) before publishing.

## Counts

- **Total programme x campus rows catalogued (excl. PhD): 49.**
- By level: UG 30 (11 B.E. titles + B.Pharm., multiplied across applicable campuses), Integrated 18 (6
  M.Sc. integrated-first-degree titles x 3 campuses), PG 1 (the `not_open` summary row).
- By `intl_status`: **48 rows `open_to_international`** (every ISA-listed programme x campus
  combination); **1 row `not_open`** (on-campus M.E./M.Tech/MBA coursework, summarised as a single row
  rather than enumerated per specialisation -- see Sources #3).
- **Already on site:** 0 (new university, batch 3).
- **Distinct GAP parent canonical courses: 10** --
  `be-btech-electronics-computer-engineering`, `be-btech-electronics-instrumentation-engineering`,
  `be-btech-environmental-sustainability-engineering`, `be-btech-mathematics-and-computing`,
  `integrated-msc-biological-sciences`, `integrated-msc-chemistry`, `integrated-msc-economics`,
  `integrated-msc-mathematics`, `integrated-msc-physics`, `integrated-msc-semiconductor-nanoscience`.

## Notable mapping decisions / flags for the packaging pass

- **M.Sc. integrated-first-degree programmes** (Biological Sciences, Chemistry, Economics, Mathematics,
  Physics, Semiconductor and Nanoscience) admit students directly from Grade 12 with **no intermediate
  bachelor's degree** -- the taxonomy's `integrated-masters` level currently has only one member
  (`integrated-mpharm`); no integrated-M.Sc.-science family exists. All 6 are held as parent-level GAPs
  rather than merged into the existing `masters`-level `msc-*` canonicals, which assume a prior
  bachelor's degree and would misrepresent the award structure.
  `Semiconductor and Nanoscience` in particular has no equivalent at any level in the current taxonomy.
- **Manufacturing Engineering** was mapped to the existing `be-btech-industrial-production-engineering`
  canonical as the closest curriculum fit rather than held as a GAP -- confirm this against BITS's own
  Manufacturing Engineering curriculum page before publishing, since Manufacturing and
  Industrial/Production Engineering are related but not identical fields.
- **Mathematics and Computing** and **Environmental and Sustainability Engineering** are BITS's own named
  B.E. titles with no equivalent canonical family (the former is a distinctive interdisciplinary
  math+CS engineering degree, not a science bachelor's; the latter is an engineering degree, not the
  existing science-only `bsc-environmental-science`). Both held as GAPs.
- **Electronics & Instrumentation Engineering** and **Electronics and Computer Engineering** were held as
  GAPs rather than merged into `be-btech-electronics-communication-engineering` or
  `be-btech-computer-science-engineering`, since BITS publishes them as materially distinct named degrees
  (per taxonomy rule 3, similar-sounding programmes with different curricula must not be merged).
- **Environmental and Sustainability Engineering and B.Pharm. share the PCB-eligible admission track**
  (Biology accepted in place of Mathematics/Chemistry per the brochure's eligibility section) --
  flagged in each row's notes for the medical/regulator-caveat review, alongside B.Pharm.'s PCI
  registration status.
- **The single `not_open` PG row** intentionally does not enumerate BITS's dozens of on-campus M.E./M.Tech
  specialisations (Pilani/Goa/Hyderabad) or its off-campus WILP (Work Integrated Learning Programmes)
  catalogue, since none of them has a documented international-admission route and WILP specifically
  targets working professionals already employed in India. If a future international PG route is
  published, this row should be split into the actual affected programmes at that time.

## Unreachable / not attempted this pass

- Individual campus academic-department pages (to confirm the "no footnote = all 3 campuses" assumption
  for 8 of 11 B.E. titles and all 6 M.Sc. titles): not crawled this pass.
- Study in India, AICTE facilities dashboard, NIRF 2025 Engineering-category rank (page-parser miss
  flagged in the batch-3 shortlist): not re-checked here.
- Aggregator missed-programme checklist pass: not run (ISA brochure is a complete, dated, authoritative
  programme table for the international route).

## Phase D packaging (2026-09-21, claude-india-batch3-20260921)

Migration `0110-india-birla-institute-of-technology-and-science-pilani` packages **46 of 48**
`open_to_international` rows (one offering per programme x campus). **Held: 2** (both B.Pharm.
offerings, see below). The `not_open` PG row stays excluded.

- **Campus coverage confirmed, not assumed.** The BITSAT-2026 brochure (section 1,
  `https://admissions.bits-pilani.ac.in/FD/downloads/BITSAT-2026_Brochure.pdf`) lists the programmes
  per campus, and each programme page under `bits-pilani.ac.in/academics/integrated-first-degree/`
  states its campuses. Both agree with the ISA footnotes: Civil = Pilani + Hyderabad, Manufacturing =
  Pilani only, Electronics and Computer = Goa only, B.Pharm. = Pilani + Hyderabad, all other B.E. and
  all six M.Sc. titles = all three campuses. The BITSAT list also has B.E. Pharmaceutical Engineering
  and M.Sc. General Studies, which are **not** in the ISA programme table and so are not packaged.
- **Duration.** ISA brochure: every M.Sc. is a four-year integrated degree with no intermediate
  bachelor's. Some programme pages show "05 Years"; the M.Sc. Biological Sciences page explains this
  as the optional dual-degree route. Recorded as 4 years, and the dual-degree option is described.
- **Fees.** `confirmed`, INR, "2026-27 ISA intake". The fee is scheme-wide: non-SAARC INR 7,42,500 per
  semester (INR 14,85,000 in year 1; INR 64,00,000 over 8 semesters on the published escalation
  schedule) and SAARC INR 4,37,250 per semester. USD appears only as an indicative note (ECB
  reference rate, 21-09-2026: USD 1 = INR 95.82), and `annualTuitionUsd` is left null. Fees for the
  2027-28 intake are not published yet. Cycle-dependent evidence has `reviewBy` 2027-01-31.
- **Eligibility.** The year rules are specific to the 2026 cycle (Grade 12 in 2026 or 2025; SAT from
  1 Feb 2024 or later). The copy states them as the 2026-cycle rule. Recheck them when the ISA-2027
  brochure is published.
- **Badges** are all verified on regulator lists: UGC deemed-university list (serial 75,
  Rajasthan), UGC IoE Table 2 (private, notified 14.10.2020), NAAC workbook as on 14-08-2025 (A++,
  3.68, cycle 4, declared 29-11-2024), NIRF 2025 (University 7, Engineering 11 re-read directly,
  Pharmacy 2). No NBA or PCI badge.
- **B.Pharm. held (fix 2026-09-21).** Both B.Pharm. offerings (Pilani and Hyderabad) were removed
  from the bundle before publishing. PCI's section 12 approved-institutions list
  (`https://www.pci.nic.in/approved_degree_institutes_us__12.html`) shows the Pilani B.Pharm.
  approved only up to 2023-24 and has no Hyderabad B.Pharm. entry, so current PCI approval cannot be
  shown for either campus. Hold until PCI publishes a current approval for each campus. The
  university-level copy no longer mentions B.Pharm.; the NIRF Pharmacy rank badge stays because it
  is an institution-level ranking. The `bpharm` course record was dropped from this bundle.
- **Shared course records.** `be-btech-environmental-engineering` is copied verbatim from
  `research/india-batch3-canonical-courses.json`. The 13 existing courses are copied verbatim from
  the live `courses` rows (SELECT only, 2026-09-21). The one exception is the aliases of
  `be-btech-computer-science-engineering`, which follow the registry: "BSc Computer Science" was
  removed per the batch-3 taxonomy decision.
