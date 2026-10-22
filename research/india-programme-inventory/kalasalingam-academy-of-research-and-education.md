# Kalasalingam Academy of Research and Education (KARE) - programme inventory

- University slug: `kalasalingam-academy-of-research-and-education`
- Campus in scope: Krishnankoil (Anand Nagar, Virudhunagar district, Tamil Nadu 626126)
- Out of scope: KARE Chennai campus (OMR, Kazhipattur), KARE Centre for Distance and Online Education
  (online BBA/BCA/B.Com/MBA/MCA/M.Sc/MA), and the separately run Kalasalingam Medical College and
  Hospital, Arulmigu Kalasalingam College of Pharmacy, Arulmigu Kalasalingam College of Arts and
  Science and Arulmigu Kalasalingam College of Education.
- Owner: `claude-india-kare-20261022`, batch `claude-india-batch4-20261022`
- Checked: 2026-10-22
- Migration: `content-migrations/0118-india-kalasalingam-academy-of-research-and-education`

## Row counts

| intl_status | rows |
|---|---:|
| open_to_international (packaged) | 45 |
| unknown (held, reason in notes) | 52 |
| major_within (specialisations inside a packaged degree) | 17 |
| not_open (page 404, treated as discontinued) | 2 |
| **Total** | **116** |

## How international status was decided

KARE publishes one international route: "International students can apply for admission to KARE
through the Study in India Portal" (International Relations page). It publishes no separate
international eligibility rule. The decisive programme-level evidence is the 2026-27 "NRI (Non
Resident Indians) / Foreign Student Fees Structure" on the admissions page, which has these rows:
B.Tech CSE/AI&DS/IT USD 4,000; B.Tech ECE/Biotech USD 2,500; B.Tech Others USD 2,000; B.Sc
Agriculture and Horticulture USD 3,000; B.A/B.Com LLB USD 2,000; PG - All Programmes USD 2,000; U.G -
Arts & Science USD 1,200 (marked NO SCHOLARSHIP; NRI/foreign application fee USD 50).

A programme is `open_to_international` when it is (a) in KARE's Brochure 2026 (created 6 Dec 2025),
(b) has a live programme page (HTTP 200 on 2026-10-22) and (c) falls in one of those NRI/Foreign
fee rows. "U.G - Arts & Science" was read as the programmes KARE charges the Arts and Science
miscellaneous fee (INR 5,000) in the resident-Indian table.

Rows are `unknown` and held when the programme has no NRI/Foreign fee row (B.Arch, B.Sc Nursing,
BPT, allied health, B.Sc Forensic Science, LLB 3-year, B.Ed), has no programme page (B.Tech AI&DS,
aviation programmes), or is on the website list but missing from Brochure 2026 and the 2026-27 fee
tables (B.Tech Automobile, Chemical, Agricultural; several M.Tech; B.Sc Fashion Design, Fire and
Safety; legacy B.Com specialisations). Ph.D. rows are held: the only NRI fee is a stale 2024-25 table.

## Taxonomy decisions (GAP resolution)

- `bsc-horticulture` added to `lib/data/program-taxonomy.ts` (B.Sc. (Hons.) Horticulture is a
  separate ICAR degree from B.Sc. Agriculture). Generic record in
  `research/india-batch4-kare-canonical-courses.json`.
- Specialisation-to-parent mappings: M.Tech VLSI Design -> `me-mtech-electronics-communication-engineering`;
  M.Tech Renewable Energy Technologies -> `me-mtech-energy-engineering`; M.Tech Automotive Systems
  Engineering and M.Tech Industrial Safety Engineering -> `me-mtech-mechanical-engineering` (both run
  by KARE's School of Mechanical, Aero, Auto and Civil Engineering); M.Tech Structural Engineering ->
  `me-mtech-civil-engineering`; M.Arch Habitat Design -> `march`; B.Tech Aeronautical ->
  `be-btech-aerospace-engineering`; B.Tech Food Technology -> `bachelor-food-science-technology`;
  B.Sc IT -> `bachelor-information-systems`; B.Sc Visual Communication -> `bachelor-media-communication`;
  B.Sc Catering Science and Hotel Management -> `bachelor-hospitality-management`; BA/B.Com LL.B. -> `llb`.
- Unresolved, held: `GAP:be-btech-artificial-intelligence-data-science` (also no programme page),
  `GAP:bsc-forensic-science`, `GAP:bsc-aeronautical-science`, `GAP:bsc-fire-safety`,
  `GAP:me-mtech-defence-technology`. Each is also held for a non-taxonomy reason.

## Sources used (all checked 2026-10-22)

Official (KARE): admissions page (eligibility, 2026-27 fee tables, application fee, FAQ),
international-relations page, program-offer page, programs/* and course/* pages, Brochure2026.pdf,
Kalasalingam-StudyInIndia.pdf (2021; used only for distances), hostel-mess page (2026-27 tariff),
campus-life, about-us, academic calendar 2025-26 gist PDF.

Regulator/government: UGC consolidated list of all universities (entry 802, notified 20.10.2006);
NAAC valid-accreditation list as on 14-08-2025 (A++, CGPA 3.51, cycle 3, 14-02-2024); NBA
accredited-programme register (Engineering UG Tier I and PG); NIRF 2025 University, Engineering and
Overall ranking pages and KARE's NIRF 2025 data file IR-O-U-0458; Study in India FAQ and Onboarding &
FRRO pages; Ministry of Education D.O. 13-23/2018-ICC dated 17-10-2024.

Aggregator (checklist only, not cited): Careers360 KARE course listing. It surfaced the online/distance
programmes (out of scope); no on-campus programme was found that is not already in this inventory.

## Unreachable or unusable sources

- `sitemap.xml` and `sitemap_index.xml` return HTTP 500; the WordPress search API ignores the query.
- Study in India institute pages (old `Explore/ViewDetails?instituteid=SII-I-317`) return 404 after the
  portal redesign, so per-course SII listings and SII fees could not be read.
- `apply.kalasalingam.ac.in/uploads/kare_ssi_application.pdf` returns 404.
- The 2021 Study in India brochure carries a SAARC/non-SAARC USD fee table; it is superseded by the
  2026-27 NRI/Foreign table and was not used for fees.
- ABET accreditation (claimed by KARE for 11 B.Tech programmes) could not be checked on ABET's own
  register (JavaScript-only app), so it is not claimed.
- The KARE site hosts injected third-party gambling pages under its WordPress domain; ignored.
