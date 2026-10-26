# Rajas Institute of Allied Health Sciences (RIAHS): programme inventory, 2026-10-22

Owner: `claude-india-srcahs-20261022`, batch `claude-india-batch4-20261022`. Ledger status: `validated` (migration `0116-india-rajas-institute-of-allied-health-sciences`).

## Identity resolution

- The batch requested "Sardar Raja College of Allied Health Sciences". No institution of that name
  exists on any official source checked (institute group site, TNMGRMU affiliated-college lists,
  TN DME prospectus). The allied-health college of the Sardar Dr. S.A. Raja / Rajas Medical
  Institutions group is officially named **Rajas Institute of Allied Health Sciences (RIAHS)**. The
  ledger row uses this official name and the slug `rajas-institute-of-allied-health-sciences`.
- Location: Raja Nagar, Vadakkankulam (also spelt Vadakkangulam), Tirunelveli District, Tamil Nadu
  627 116. This is the Raja Nagar campus, not the Rajas group's Kavalkinaru Junction campus (dental,
  nursing).
- Sponsoring trust: Selvam Educational & Charitable Trust (TNMGRMU list). Parent group: Rajas Medical
  Institutions (founded 1987 by Sardar Dr. S.A. Raja, per https://rmi.net.in/).
- Status: **affiliated college, not a university.** Degrees are awarded by The Tamil Nadu Dr. M.G.R.
  Medical University (TNMGRMU), Chennai. TNMGRMU institution code 898, listed under "Self Financing
  Colleges" in the AHS affiliated-college lists for 2024-25 (PA 2020-21, CCPA 2022-23) and 2025-26
  (published 07-09-2026).
- Course approval (institute's own statement only): G.O.(Ms.) No.552, Health and Family Welfare
  (PME-2) Department, dated 15-12-2020; TNMGRMU affiliation Proc. No. Affln V(4)/38868/2020 dated
  28-01-2022. The G.O. could not be located on a Government of Tamil Nadu source.
- Joy University check: Joy University (Raja Nagar, Vadakkankulam; a Tamil Nadu state private
  university sponsored by the same group) does not mention RIAHS or any absorbed college on its
  homepage, and TNMGRMU still lists RIAHS as its own affiliated institution for 2025-26. The site
  shows a 2026 freshers' orientation (gallery, 09-09-2026). RIAHS therefore still operates as a
  separate TNMGRMU-affiliated college. Do not merge it into the Joy University record.

## Sources used (primary)

| Source | Use |
|---|---|
| https://riahs.rmi.net.in/ (home, /college, /affiliations, /cardiac_course, /anaesthesia_course, /hospital_tie_up, /facilities, /online-application, /leadership, /contact_us) | Course list, eligibility, approval references, hospital tie-ups, application form fields |
| https://www.tnmgrmu.ac.in/wp-content/uploads/2026/09/Allied-health-sciences-sep72026.pdf | TNMGRMU AHS affiliated colleges 2025-26: code 898, both courses, intake 10 each |
| https://www.tnmgrmu.ac.in/wp-content/uploads/2025/12/Allied-Health-Science-Courses-2024.pdf | TNMGRMU AHS affiliated colleges 2024-25: PA year 2020-21, CCPA 2022-23 |
| https://www.tnmgrmu.ac.in/wp-content/uploads/2026/07/B.Sc-Allied-Health-Science-regulation.pdf | TNMGRMU B.Sc AHS regulations: eligibility (10+2 PCB, 35% per subject incl. English), age 17 by 31 Dec, eligibility certificate for non-TN-board qualifications, 1 August start, English medium, 4 years incl. 1-year internship, 75% theory / 100% practical attendance, 30 September admission cut-off |
| https://www.tnmgrmu.ac.in/wp-content/uploads/2026/07/bsccardtech2021.pdf | B.Sc Cardiac Technology syllabus (2020-21): year-wise papers, internship postings (cath lab and blood bank, echo, ICCU, Holter, 3 months each) |
| https://www.tnmgrmu.ac.in/wp-content/uploads/2026/07/syllab-otat-08122020.pdf | B.Sc OTAT syllabus: year-wise subjects, internship postings (sterilisation, recovery, surgical ICU, OTs) |
| https://tnmedicalselection.net/archives/22052026023111432.pdf | TN DME Paramedical Degree prospectus 2025-26: Cardiac Technology and OTAT are NOT offered under government quota in self-financing colleges, so RIAHS seats are filled directly by the institute; government-quota rules (Indian citizenship, TN nativity) therefore do not govern RIAHS seats |
| https://rmi.net.in/ | Group identity, founding year of group |
| https://joyuniversity.edu.in/ | Absorption check (negative) |

Aggregator checklist only (not evidence): Collegedunia (college 63399), CollegeBatch (19226).
These list a third course, B.Sc Medical Record Science, and fees of about INR 1 lakh a year.
Neither is confirmed by an official source.

## Unreachable / not found

- https://riahs.rajas.edu (ECONNRESET); the live site is riahs.rmi.net.in.
- TNMGRMU eligibility-certificate rules and fees for foreign or NRI candidates. No page or form was
  found on tnmgrmu.ac.in (services/fees, services/application-forms, eligibility verification page).
- A TN DME paramedical prospectus for the 2026-27 session was not found on tnmedicalselection.net.
  Its notifications page lists other 2026-27 courses, but no linked paramedical degree PDF was found.
- Government of Tamil Nadu copy of G.O.(Ms.) No.552 H&FW (PME-2) dated 15-12-2020.

## Counts

- Official programmes found: 2 (both UG B.Sc, allied health). There are no diploma, PG,
  physiotherapy, nursing or pharmacy programmes at RIAHS. Those belong to sister institutions: Sardar
  Rajas College of Nursing, S.A. Raja Pharmacy College, Rajas Dental College and Rajas Institute of
  Laboratory Science.
- Aggregator-only, unconfirmed: 1 (B.Sc Medical Record Science).
- intl_status: open_to_international 0, unknown 2, not_open 0.
- Already on site: 0.
- GAP rows: 0. Both official programmes map to the existing `bsc-allied-health-sciences`
  canonical course, whose aliases already cover anaesthesia/OT technology and cardiac care
  technology.

## Packaging decision

**Update 2026-10-22:** the user approved a domestic-only listing (relayed by the coordinator). Both
programmes were packaged in `content-migrations/0116-india-rajas-institute-of-allied-health-sciences/`
with `audienceEligibility.availability: local-only`, `fee.status: on_request` and the restriction
stated explicitly. Scoped `content:validate` passed. Media is held: the logo's rights are undocumented
and there is no rights-safe cover. The original hold analysis is kept below for the record.

### Original hold analysis (0 of 2 packaged at first pass)

Both programmes are `intl_status=unknown`. Runbook §1b requires per-programme verification before an
`unknown` programme is packaged. The programme-level floor in `university-content-spec.md` also
requires verified eligibility for international applicants. The exact blocking facts:

1. Neither RIAHS nor TNMGRMU publishes an admission route for foreign nationals, NRIs or OCI
   holders: no category, quota, document list, equivalence rule or visa step. The only signal is
   the "Nationality: Indian / Non Indian" field on the RIAHS online form, which is not a route.
2. RIAHS publishes no tuition or other fee. A status of `on_request` would be allowed, but there is
   no official figure.
3. RIAHS publishes no application steps beyond the online form: no documents, deadline, selection
   method or seat categories. Programme `admissionsContent` would rest only on the TNMGRMU
   regulation and the form fields.

The institution can be represented: `type: Private`, with TNMGRMU affiliation in the narrative,
FAQ and recognition, following the Bangladesh affiliated-college precedent in
`content-migrations/0012`. To unblock, obtain an official statement from RIAHS (riahs@rajas.edu,
04637-213788) or TNMGRMU on admission of foreign-national or NRI candidates to these B.Sc AHS
courses, plus the current fee schedule. Alternatively, the supervisor could decide that a
domestic-route listing with `availability: restricted` and an explicit "no published
foreign-national route" restriction meets the global-catalogue rule. That would be a policy call;
this worker has not made it.

## Media candidates (not uploaded, since nothing is packaged)

- Logo: https://riahs.rmi.net.in/public/user_assets/images/rp-logo.png (official site). Rights
  basis not documented. Check legibility on a white tile before use.
- Cover: none rights-safe. The official site's admissions image (admission2.webp) appears
  AI-generated and is not a campus photograph. The gallery images are event photos with no reuse
  terms.

## Fee pass 2026-10-26

Bundle 0394-india-rajas-institute-of-allied-health-sciences-fees supersedes 0116; it changes fees, fee notes, `reportedFeeQuote`, fee evidence and (validation-required) intake labels only.

- B.Sc Cardiac Technology and B.Sc OTAT: indicative Grade C `reportedFeeQuote` INR 1,00,000 per `academic_year` from CollegeBatch (https://www.collegebatch.com/19226-rajas-institute-of-allied-health-sciences-fees-structure-courses-tirunelveli; "Rs. 1,00,000/- per year", "Rs. 3 Lakh Total Fees", 2026 page). Corroborated by Collegedunia college 63399 (Rs 1,00,000 first year; page 401, search listing only). The Rs 3 lakh total was not used because the page shows 3 years and the official course is 4 years including internship.
- Official sources rechecked: riahs.rmi.net.in course pages (no fee, no prospectus link). The TN DME paramedical prospectus does not cover these courses in self-financing colleges, so no government-fixed fee applies. No TNMGRMU fee notification covers institute-filled seats.
- `intakeMonths` changed from "August - course commences 1 August; admissions close 30 September" to "August": validation rejects non-label values for bundles numbered 154 and above. The caveat is already in `deadlinesNote`.
