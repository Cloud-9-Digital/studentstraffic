# World University of Design (WUD) — programme inventory, 2026-09-21

## Sources used
- Official UG programmes listing: https://www.wud.ac.in/ug-programmes.php (reachable, curl)
- Official PG programmes listing: https://www.wud.ac.in/pg-programmes.php (reachable, curl)
- Individual programme pages linked from the above (b-arch-architecture.php, bdes-*.php, mdes-*.php, mva-*.php, mba*.php, diploma-*.php, etc.) — used for titles/URLs only, not individually fetched for fee/duration detail in this pass
- Existing bundle payload: content-migrations/0102-india-world-university-of-design/payload.json (10 programmes already published)
- Checklist only: Shiksha (shiksha.com/college/world-university-of-design-sonepat-48277/courses), Collegedunia (collegedunia.com/university/58100-world-university-of-design-wud-sonepat/courses-fees), Careers360 (careers360.com/university/world-university-of-design-sonipat/admission) — via WebSearch snippets, confirmed the official-site list and surfaced two PhD Design Management rows not found on official pages

## Unreachable / not attempted
- https://www.wud.ac.in/sitemap.xml resolves to a themed 404 page, not a real sitemap — not usable for URL discovery
- Study in India portal (studyinindia.gov.in) — WebSearch did not surface a WUD-specific programme listing; not independently confirmed this pass
- AICTE facilities.aicte-india.org and NIRF nirfindia.org — not checked; WUD is UGC/COA regulated (private state university, no medical/technical AICTE-mandated programmes flagged in payload) and does not appear in NIRF per the existing payload's recognitionBadges (WUD is not listed in NIRF)
- Individual PDF prospectuses for detailed fee/intake per new-found programme not downloaded in this pass (scope was programme-existence, not fee detail)

## Counts
- Total distinct programmes found: 39 (including the 2 aggregator-only-unconfirmed PhD rows)
- By level: PG 16, UG 15, Diploma 5, Doctoral 2 (aggregator_only_unconfirmed), Certificate 1
- By intl_status: open_to_international 28, unknown 9 (2x M.Arch, MBA Executive, 5x Diploma, 1x Certificate), aggregator_only_unconfirmed 2

## Already on site vs missing
- Already on site: 10 (B.Arch; B.Des Fashion Design, Product Design, Animation & Game Design; BVA Creative Painting; M.Des Industrial Design, Fashion Design, Game Design; MVA Contemporary Art Practices; MBA Design Strategy & Management)
- Missing but open_to_international (candidates for next publish): 18 — B.Des Fashion Communication, Textile Design, UX & Digital Product Design, Film & Video, Graphic Communication Design, Interior Architecture & Design, Transportation Design; BBA Design Strategy & Management; B.Tech Computer Science & Design; BVA Digital Drawing & Illustration; M.Des Communication Design, Interior & Retail Design, Future Mobility & Transportation, International Fashion Business, UX & Interaction Design; MVA Fashion Art, Art Education, Curatorial Practices — see CSV for the definitive list
- Missing with unknown/unconfirmed intl status: 11 (2x M.Arch, MBA Executive, 5x Diploma, 1x Certificate, 2x PhD aggregator-only)

## Top GAP canonical courses (no existing taxonomy entry)
- GAP:bdes-textile-design, GAP:bdes-fashion-communication, GAP:bdes-ux-digital-product-design, GAP:bdes-graphic-communication-design, GAP:bdes-interior-architecture-design, GAP:bdes-transportation-design (a cluster of B.Des specialisations with no canonical match — WUD is unusually specialised, so these may warrant new canonical course entries if other design universities are added)
- GAP:mdes-communication-design, GAP:mdes-interior-retail-design, GAP:mdes-future-mobility-transportation, GAP:mdes-international-fashion-business, GAP:mdes-ux-interaction-design (PG mirrors of the above)
- GAP:mva-fashion-art, GAP:mva-art-education, GAP:mva-curatorial-practices (Visual Arts PG specialisations beyond the existing "mfa" canonical)
- GAP:bba-design-strategy-management, GAP:btech-computer-science-design (cross-disciplinary programmes with no clean canonical fit)

## Notes
- Several WUD programme pages market multiple "majors" under one URL (e.g. mba.php lists MBA - DA/AI & Design Thinking, Design Strategy & Innovation, Service Design as majors within one MBA; mdes-industrial-design.php also markets "Product Innovation & Intelligent Systems"). These were treated as one row each, not separate programmes, since they share one admissions page/URL.
- WUD's B.Arch is COA-approved (confirmed in existing payload's recognitionBadges); international eligibility for M.Arch programmes was not separately confirmed on the official international-admissions page during this pass and is marked unknown rather than assumed.
