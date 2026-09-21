# KIIT Deemed to be University -- Programme Inventory

Research pass only. No payload/ledger/DB/docs edits were made from this file. Single campus (Bhubaneswar, Odisha).

## Sources used

1. **Official structured catalogue API** -- `https://kiit.ac.in/wp-json/kiit-programmes/v1/catalogue` (discovered via a script tag on `kiit.ac.in/academics/courses/`: `kiit-programmes-catalogue-v1.6.js`). This is a first-party JSON feed KIIT itself publishes to power its "Academic Programmes 2026-27" search widget, explicitly labelled `"source": "KIIT Programmes Master Google Sheet"` and `"synced from... the KIITEE Prospectus 2026-27"`. Returned **216 programmes** across **29 schools/institutes**, each with title, school, level (`Undergraduate`/`Postgraduate`/`Integrated`/`Diploma`/`Certificate`/`Fellowship`/`Short-Term`/`Executive`/`Doctoral`/`Lateral Entry`), duration and a school URL. Reachable, and the most complete and structurally reliable source found across all three universities in this task.
2. **`https://kiit.ac.in/international-admission/`** (reachable) -- confirms a single institution-wide international-applicant route covering "undergraduate, postgraduate, and doctoral programs"; no per-programme international allow/deny list was published on this page, so `intl_status = open_to_international` was applied uniformly, with a note flagging that MBBS/BDS/Nursing/MD/MS rows remain subject to NMC/DCI/INC foreign-national-quota and NEET/DGHS process on top of the general route.
3. **Study in India / AICTE / NIRF**: not queried this pass (time-boxed; flagged as follow-up).
4. **Aggregators**: not separately queried -- the official catalogue API is already a complete, machine-readable, single-source list, so a Shiksha/Collegedunia/Careers360 checklist pass was judged low-value for this university and was not run in this time-boxed pass. No aggregator-only rows were added.
5. **Existing bundle payload** -- `content-migrations/0096-india-kiit-deemed-to-be-university/payload.json`, `officialTitle` used (normalised) to match `already_on_site` against the 8 published offerings.

## Exclusions applied

- **28 Doctoral (PhD) rows** excluded per the task's PhD-exclusion rule.
- **13 "Lateral Entry" rows** excluded -- these are an alternate (year-2, diploma-holder) admission route into an *already-listed* B.Tech programme, not a distinct programme, so including them would double-count the same degree.

## Counts

- **Total programmes catalogued (excl. PhD, excl. lateral entry): 175**
- By level: PG 92 (incl. 5 ex-Fellowship + Short-Term/Executive folded into "Certificate" where noted below), UG 61, Certificate 15 (incl. 5 Fellowship + 3 Short-Term + 1 Executive, reclassified to the closest spec level), Diploma 1, Integrated 6.
- `intl_status`: all 175 `open_to_international` (see Sources #2).
- **Already on site: 11** rows, covering **8 distinct published offerings** -- B.Tech CSE (core), B.Tech Civil, B.Tech Mechanical, MBA (Full Time), LL.M, MPH, and the combined B.A./B.B.A./B.Sc. LL.B (Hons) integrated law programme (3 catalogue rows) and the combined M.Sc. Biotechnology / Applied Microbiology offering (2 catalogue rows).
- **Missing (open-to-international, not on site): 164**
- **GAP canonical courses: 94** rows; **81** rows matched an existing canonical course slug.

## Top GAP canonical courses (recurring, no canonical slug yet)

- **M.Tech specialisations** (Water Resources, VLSI Design & Embedded Systems, Transportation, Structural, Power & Energy Systems, Power Electronics & Drives, Geotechnical, Environmental, Cyber Security, Construction Engineering & Management, Automotive Electronics & Software, Biotechnology) -- as with VIT and MAHE, the canonical catalogue has no M.Tech-level slugs at all.
- **MS (Master of Surgery) and MD specialisations** at Kalinga Institute of Medical Sciences (Orthopedics, Ophthalmology, ObGyn, General Surgery, and more) and **MDS** (Dental Surgery specialisations) at KIDS -- large cluster, no canonical coverage.
- **MCA, BCA, BBA** -- same nationally-common gap seen at VIT.
- **Humanities/social-science masters** (Master of Sociology, Master of English, Master of Library & Information Science, MPES) and **short-term/certificate craft programmes** (Textile Dyeing & Printing, Indian Traditional Painting, Embroidery, Film & TV Production certificates) at the School of Fashion Technology / Film & Media Sciences -- niche but numerous.

## Unreachable / not attempted this pass

- Study in India portal, AICTE facilities dashboard, NIRF data PDF for KIIT: not queried.
- Per-programme duration/eligibility beyond what the catalogue API itself returns (several rows carry `"Duration not specified in prospectus"` verbatim from KIIT's own feed -- not a gap in this research, KIIT's own data omits it).
