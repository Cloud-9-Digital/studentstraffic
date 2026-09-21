# VIT Vellore -- Programme Inventory

Research pass only. No payload/ledger/DB/docs edits were made from this file. Scope: **VIT Vellore campus only** (matching the published bundle `0090-india-vellore-institute-of-technology`, which covers Vellore). VIT also runs Chennai, AP and Bhopal campuses with overlapping but not identical specialisation lists -- those are out of scope here and were not catalogued.

## Sources used

1. **`https://vit.ac.in/sitemap.xml`** (2024-11 sitemap, reachable) -- used to discover the relevant programme-catalogue pages (`admissions/programmes-offered`, `all-courses/ug/*`, `all-courses/pg/*`, `engineering-programmes-vellore-campus`, `admissions/international/*`).
2. **`https://vit.ac.in/engineering-programmes-vellore-campus`** (reachable) -- authoritative, Vellore-specific B.Tech list: 19 specialisations across 9 schools, confirmed by the page's own FAQ ("VIT Vellore offers B.Tech specialisations across nine schools... 7 Computer Science variants... Information Technology, 3 Electronics specialisations, 2 Electrical specialisations, Mechanical, 2 Civil specialisations, Chemical, Biotechnology, and Health Sciences and Technology").
3. **`vit.ac.in/all-courses/ug/*`** pages (7 fetched: B.Des, B.Arch, B.Sc CS & BCA, B.Com & BBA, B.Sc Multimedia/Animation & Visual Comm, B.Sc Hospitality, B.Sc(Hons) Agriculture) -- all reachable, all Vellore-specific.
4. **`vit.ac.in/all-courses/pg/*`** pages (10 fetched: M.Tech programmes, MCA, M.Sc programmes, M.Des, M.Arch, Integrated M.Tech, Integrated M.Sc, MBA, LL.M, MSW) -- 8 reachable with content; **LL.M and Master of Social Work pages returned no programme content for Vellore** (likely not offered at the Vellore campus, or offered only at another VIT campus) -- both excluded from the CSV rather than guessed.
5. **`vit.ac.in/admissions/international/overview`** and related international pages (`btech-eligibilityandprocedure`, `otherugprogrammes`, `pg`, `integrated`, `research`) -- confirm VIT runs parallel NRI/Foreign-national admission routes for B.Tech, UG science/humanities, Integrated, PG and Research programmes at all four campuses, hence `intl_status = open_to_international` applied uniformly.
6. **Study in India / AICTE / NIRF**: not queried this pass (time-boxed; flagged as follow-up).
7. **Aggregators**: not separately queried; the official Vellore-specific pages were already exhaustive and internally cross-referenced (each programme's FAQ block cites the full sibling list), so no aggregator-only programmes were found or needed.
8. **Existing bundle payload** -- `content-migrations/0090-india-vellore-institute-of-technology/payload.json`, `officialTitle`/`officialProgramUrl` used to match `already_on_site`.

## Counts

- **Total programmes catalogued: 61** (UG 32 incl. 19 B.Tech + 13 other UG; PG 16; Integrated 13)
- `intl_status`: all 61 `open_to_international` (evidence: `admissions/international/overview`).
- **Already on site: 7** -- B.Tech CSE, B.Tech ECE, B.Tech Mechanical, B.Tech Civil, MBA, M.Sc Data Science, B.Com (base).
- **Missing (open-to-international, not on site): 54**
- **GAP canonical courses: 30** rows (mostly niche B.Tech/M.Tech specialisations with no canonical slug); **31** rows matched an existing canonical course.

## Top GAP canonical courses (recurring, no canonical slug yet)

- **M.Tech specialisations** (10 offered at Vellore: CAD/CAM, Construction Technology & Management, Control & Automation, Mechatronics, Power Electronics & Drives, Structural Engineering, Automotive Electronics, Smart Mobility, Biotechnology, Smart Manufacturing) -- zero canonical M.Tech slugs exist today; only undergraduate B.E./B.Tech slugs are canonicalised.
- **MCA** (Master of Computer Applications) -- no canonical slug; large national demand.
- **BCA / BBA** -- no canonical slug (only `bcom` exists on the commerce/business UG side).
- **CSE specialisation variants** (AI & Data Engineering, Bioinformatics, Cyber Security, and the TCS/Business-Systems and L&T/Civil industry-collaboration programmes) -- these sit under the existing `be-btech-computer-science-engineering` discipline conceptually but are distinct named/admitted programmes; worth a product decision on whether to add specialisation-level canonical slugs or keep mapping to the parent CSE slug.
- **Integrated M.Sc./M.Tech 5-year dual-degree tracks** (Data Science, Food Science & Technology, Physics, Chemistry, Mathematics with UG exit options; Artificial Intelligence, AI+Bioinformatics) -- the "Integrated" level itself has almost no canonical coverage across the whole catalogue.

## Unreachable / not attempted this pass

- LL.M and Master of Social Work at VIT Vellore specifically (pages returned no Vellore programme content -- likely offered at Chennai/AP/Bhopal only; not confirmed either way, excluded rather than guessed).
- Study in India portal, AICTE, NIRF data PDF: not queried.
