# SASTRA research notes (2026-10-23)

Build: `node research-drafts/india/shanmugha-arts-science-technology-and-research-academy-build.mjs`
(writes the inventory CSV and `content-migrations/0151-.../payload.json`). Inventory summary:
`research/india-programme-inventory/shanmugha-arts-science-technology-and-research-academy.md`.

## Decisions

- Fee year: the fee-structure page prints no year. It is the "View Tuition Fee Structure" link on the
  "Applicant Registration 2026" portal, so it is recorded as the 2026-27 (2026 admission) schedule. Annual
  tuition = 2 semesters. Headline fees are `audience: domestic`; Thanjavur B.Tech carries the NRI-Sponsored
  USD 5,000 a year as `additionalFees` (`international`).
- Availability: `global` only for the 26 Thanjavur B.Tech programmes (NRI-Sponsored category, Academic Year 2026).
  Kumbakonam B.Tech (NRI only at Thanjavur), integrated M.Tech (NRI not applicable) and all other programmes are
  `restricted`. SASTRA publishes no foreign-national route.
- Eligibility: from the Admission 2025 FAQ, the latest published; copy labels these "SASTRA 2025 rules".
  The 2026 FAQ link 404s. NRI thresholds are from the 2026 NRI guidelines.
- Intake: B.Tech, integrated M.Tech and B.Optom. = August (2026-27 calendars: I-year B.Tech orientation
  3 Aug 2026; circulars group first-year B.Optom./M.Optom. with first-year B.Tech). Everything else = July
  (semester day 1 on 9 July 2026; Thanjavur I-year bus circular for B.Com./M.Sc. (Intg.)/M.Tech/MBA/MCA/M.Sc.).
- Durations: Kumbakonam B.Sc. CS book shows 6 semesters (153 credits); Chennai programme page states 3-year UG with
  an optional 4th Honours year; B.Optom. 8 semesters (216 credits); M.Optom. 4 semesters (90 credits).
- Medium: English for all programmes per the MoI certificate. M.A. Sanskrit is not named in it: held.
- Recognition badges: UGC (deemed, 26.04.2001) and DSIR SIRO (11/428/2003-TU-V, valid to 31-03-2027).
  SASTRA's own claims (NAAC A++ 3.76 cycle IV, NIRF ranks, IET accreditation of 12 programmes, UGC Category I,
  TCS accreditation) are not used: NAAC/NIRF/NBA were unreachable and the IET October 2026 directory does not list SASTRA.
- Taxonomy: parent mappings follow existing bundles (Robotics & AI -> robotics-automation; VLSI, Embedded, Communication
  Systems -> ECE; ICT -> IT; Bioengineering/Bioinformatics B.Tech -> biotechnology; Big Data Biology -> M.Tech biotech;
  nanotechnology -> materials; M.Tech AI&DS -> msc-data-science; M.Tech Cyber Security -> msc-cyber-security;
  electronics B.Sc./M.Sc. -> physics; biochemistry/microbiology/bioinformatics -> biological sciences).
  `be-btech-industrial-engineering-management` is in the taxonomy but no earlier bundle ships its course record,
  so this bundle writes a generic one. No new canonical courses; Defence Technology left as GAP (held).
- Practical facts: NIRF 2026 submitted data (IR-O-U-0476) read from SASTRA-hosted page images.
