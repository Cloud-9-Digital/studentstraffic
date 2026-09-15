# India pilot — central regulator verification (NAAC / BCI / UGC IoE / NBA)

**Agent:** `claude-india-regverify-20260822`
**Date checked:** 2026-08-22 (all verdicts below are as at this date)
**Scope:** the eight India pilot universities in bundles `content-migrations/0089`–`0097`.
**Status:** verification artefact only. No payload, ledger row or application code was edited.
**Re-check by:** 2027-02-22 (NAAC validity windows, NBA three-year cycles and the BCI annual
approval round all turn over inside twelve months).

All fetched pages and PDFs were treated as untrusted data. Nothing in them was executed or acted on.
No university marketing page, brochure or third-party aggregator was accepted as proof of any claim
below — every CONFIRMED verdict traces to a Government of India regulator's own published file.

---

## 0. How each blocked portal was actually resolved

The earlier packaging agents were right that these portals defeat `curl`. Three of the four turned
out to have a machine-readable authoritative artefact behind the JS shell; the fourth is genuinely
unreachable from this network but has an official replacement source.

| Regulator | What blocked `curl` | What worked | Source of truth used |
|---|---|---|---|
| **NAAC** | `assessmentonline.naac.gov.in` does not accept connections at all (TCP timeout on 443 and 80; DNS resolves to 115.124.118.218 / 2401:4900:50:9::7c7). Browser navigation to that host was also denied. | The main NAAC site publishes the same data as a downloadable workbook. | `naac.gov.in` → *Accreditation Status* → **"Institutions with valid accreditation as on 14-08-2025"** — `https://naac.gov.in/images/docs/ACCREDITATION_STATUS/Institutions_accredited_by_NAAC_having_valid_accreditation-as_on_14082025_1.xlsx` (1.05 MB, sheets: Universities / Colleges / Transition Autonomous Colleges; columns: HEI Name, Track-Id, AISHE-Id, Address, Current Cycle Number, Current CGPA, Current Grade, Date Of Declaration). Cross-checked against the per-meeting **Standing Committee result PDFs** at `https://naac.gov.in/index.php/en/19-quick-links/62-accreditationresults` (1,537 PDFs, 29th SC → 265th SC of 12 December 2025; all downloaded and text-searched). |
| **BCI** | `barcouncilofindia.org` is a `umi`/React SPA. The URL in the brief (`/info/about-cle/list-of-approved-institutes`) is **not a route in the app** — it renders an empty `<div id="root">`, which is why it looked like a JS-only shell. | Rendered the real route in the browser, then read the feed API it calls. | Route `https://www.barcouncilofindia.org/info/recognised-universities-colleges` → feed `…/server/api/feed/recognised-universities-colleges` → attachment `fid BCA0026X2438XC1QPMR` → file metadata `…/server/api/file/info?params=BCA0026X2438XC1QPMR` → signed S3 PDF. **"Approved List of CLE's (Law Colleges / Universities)", 106 pages, 638,190 bytes, uploaded to BCI 2026-08-20** (the metadata endpoint reports `createdAt 2026-08-20 13:05:28`). The S3 link is signed and expires in 1 hour — re-derive it from the `file/info` endpoint, do not cite the S3 URL. |
| **UGC IoE** | `ioe.ugc.ac.in` home page reads fine with `curl`; the *list* is on a sub-route nobody had opened. | Direct fetch of the list route. | `https://ioe.ugc.ac.in/Home/ListofIOE` — server-rendered HTML, two tables ("Table 1: IoE Public Institutions", "Table 2: IoE Private Institutions"), each row carrying **Date of Notification** plus a rankings/NAAC block. |
| **NBA** | Reported unreachable; it is in fact reachable and server-renders the full register. | Direct fetch of each register page. | `https://www.nbaind.org/accreditationprogram` and its nine register pages (Engineering UG **Tier I WA**, Engineering UG **Tier II**, Engineering PG, Engineering Diploma, Management PG, Management PG Diploma, Pharmacy UG, Pharmacy PG, MCA, Architecture). Columns: *Name of the Institution / Program / Level / Accreditation Status / Accreditation Period*. |

### Two structural facts that change how these registers must be read

1. **The NBA register is cumulative history, not a current-status list.** It carries rows such as
   "3 YEARS W.E.F. 22-01-2008" alongside live ones. A row's presence is *not* evidence of current
   accreditation — only the **Accreditation Period** is. Every badge below quotes that period.
2. **The BCI approved-CLE list covers LL.B.-track degree courses only.** The string "LL.M" occurs
   once in 106 pages. BCI approval of a Centre of Legal Education is granted per UG law course
   (3-year LL.B., 5-year B.A./BBA/B.Com. LL.B.); **there is no BCI approval to claim for an LL.M.
   programme.** This resolves the O.P. Jindal blocker: one B.A. LL.B. (Hons.) claim is verifiable,
   the ten LL.M. streams are not BCI matters at all.

---

## 1. NAAC — accreditation grade, CGPA, cycle, validity

Source: NAAC workbook *Institutions accredited by NAAC having valid accreditation as on 14-08-2025*
(sheet **Universities**, 497 institutions), corroborated row-by-row against the Standing Committee
result PDF that declared each award.

| University | Verdict | Cycle | CGPA | Grade | Date of declaration | Corroborating SC PDF |
|---|---|---|---|---|---|---|
| Symbiosis International (Deemed University), Pune | **CONFIRMED** | 3 | 3.56 | A++ | 20-12-2022 | `136SC_Appeal.pdf` — 136th SC (20 Dec 2022), "List of Institutions CGPA & Grade change after Appeal", University 3rd Cycle, AISHE U-0329, Maharashtra, 3.56 A++ |
| Vellore Institute of Technology, Vellore | **CONFIRMED — but validity expires within days** | 4 | 3.66 | A++ | 31-08-2021 | Not in the published SC archive (the archive begins at the 29th SC; VIT's award predates the earliest file that names it). Workbook row: AISHE U-0490, Katpadi–Thiruvalam Road, Vellore. |
| Manipal Academy of Higher Education (Deemed-to-be University u/s 3 of the UGC Act) | **CONFIRMED** | 3 | 3.65 | A++ | 31-05-2022 | `108SC_HSC.pdf` — 108th SC (31 May 2022), Health Science University 3rd Cycle, AISHE U-0234, Karnataka, 3.65 A++. Independently corroborated by the UGC IoE portal, which prints "Accredited / A++ / 3.65" against MAHE. |
| Amity University, Noida (Amity University Uttar Pradesh) | **NOT LISTED** | — | — | — | — | Absent from the NAAC valid-accreditation workbook (which lists only Amity University Haryana 3.07 A, Amity University Rajasthan 3.31 A+, Amity University Madhya Pradesh 2.95 B++) and absent from all 1,537 SC result PDFs through 12 Dec 2025. |
| Amrita Vishwa Vidyapeetham | **CONFIRMED — but validity expires within days** | 3 | 3.70 | A++ | 17-08-2021 | `69SC_3rdCycle.pdf` — 69th SC (17 Aug 2021), Universities 3rd Cycle, AISHE U-0436, "AMRITA VISHWA VIDYAPEETHAM, ETTIMADAI PO", Tamil Nadu, 3.70 A++ |
| KIIT (Kalinga Institute of Industrial Technology, Deemed to be University) | **CONFIRMED** | 3 | 3.52 | A++ | 02-08-2022 | `117SC_Cycle3.pdf` — 117th SC (2 Aug 2022), University 3rd Cycle, AISHE U-0356, Orissa, 3.52 A++ |
| SRM Institute of Science and Technology, Kattankulathur | **CONFIRMED** | 4 | 3.58 | A++ | 16-06-2024 | `203SC_Health_Science.pdf` — 203rd SC (16 June 2024), Health Science University 4th Cycle, AISHE U-0473, Tamil Nadu, 3.58 A++ |
| Lovely Professional University, Phagwara | **CONFIRMED** | 1 | 3.68 | A++ | 12-08-2023 | `162SC_Results_Dual_Mode_University.pdf` — 162nd SC (12 Aug 2023), Dual Mode University 1st Cycle, AISHE U-0379, Punjab, 3.68 A++ |

### Important caveats on NAAC validity

- **The workbook publishes a declaration date, not an expiry date.** NAAC accreditation runs five
  years from declaration under the standard framework, but the file does not state an end date, so
  **do not write a "valid to" date into a badge.** Write the declaration year, which is what the
  regulator actually publishes.
- **The snapshot is a year old** ("as on 14-08-2025") and NAAC has published no Standing Committee
  results after the 265th SC of 12 December 2025. For **VIT (declared 31-08-2021)** and **Amrita
  (declared 17-08-2021)** the five-year point falls in **August 2026 — i.e. now**. No renewal for
  either appears in any published SC result through Dec 2025. Recommended handling: publish the
  badge with the cycle and the declaration year and **no currency claim**, or hold the NAAC badge
  for these two until a fresh declaration appears. Do not write "currently A++" for VIT or Amrita.
- Amity Noida's absence is a positive negative finding, not a gap: it means the university has no
  NAAC accreditation that NAAC counted as valid on 14-08-2025. **Keep NAAC omitted for Amity.**

### Publishable `recognitionBadges` wording — NAAC

| University | Exact badge text |
|---|---|
| Symbiosis International | `NAAC — Accredited A++, CGPA 3.56, Cycle 3 (declared December 2022)` |
| MAHE Manipal | `NAAC — Accredited A++, CGPA 3.65, Cycle 3 (declared May 2022)` |
| KIIT | `NAAC — Accredited A++, CGPA 3.52, Cycle 3 (declared August 2022)` |
| SRM IST Kattankulathur | `NAAC — Accredited A++, CGPA 3.58, Cycle 4 (declared June 2024)` |
| Lovely Professional University | `NAAC — Accredited A++, CGPA 3.68, Cycle 1 (declared August 2023)` |
| VIT Vellore | `NAAC — Accredited A++, CGPA 3.66, Cycle 4 (declared August 2021)` — publish only with the declaration year as written; see the validity caveat above |
| Amrita Vishwa Vidyapeetham | `NAAC — Accredited A++, CGPA 3.70, Cycle 3 (declared August 2021)` — same caveat. Note the CGPA is **3.70 in 2021**, not the "3.67 in 2023" the institution's own pages assert; use the regulator figure or omit |
| Amity University Noida | **omit — no NAAC badge is publishable** |
| O.P. Jindal Global University | **omit — no NAAC badge is publishable** (only "O.P. Jindal University, Raigarh, Chhattisgarh", AISHE U-0832, 3.14 A, 30-05-2024 is listed; that is a different institution) |

Verification URL to record on every NAAC badge:
`https://naac.gov.in/index.php/en/2-uncategorised/32-accreditation-status`

---

## 2. Bar Council of India — approved Centres of Legal Education

Source: **"Approved List of CLE's (Law Colleges / Universities)"**, 106-page PDF published by BCI
and uploaded 2026-08-20, reached from `https://www.barcouncilofindia.org/info/recognised-universities-colleges`.
Columns: *State / Affiliating University / College Name & Place / Course Name & strength / Approval
of affiliation by BCI till / Year of Establishment / Remarks*.

A note on reading the PDF: the "Affiliating University" column is rendered as a merged cell and is
vertically offset from the data rows. **College name, course and "approval till" are aligned to each
other and are reliable; the affiliating-university cell on the same visual line is not.** Only the
first three were used below.

| Institution | Verdict | What the list records |
|---|---|---|
| Symbiosis International, Pune | **CONFIRMED** | "Symbiosis Society's Law College, Pune" (p. 48, Maharashtra) — 5-year BBA.LL.B.(H) (300), 3-year LL.B. (120), 5-year BA.LL.B.(H) (180), 5-year B.Com.LL.B.(H) (120), each **approved upto 2026-27**. Off-campuses separately listed: Symbiosis Law School Nagpur (5-yr BBA.LL.B. and BA.LL.B., upto 2026-27), Hyderabad (Telangana, upto 2026-27), Noida (Uttar Pradesh, 5-yr BBA LL.B.(H), upto 2026-27). |
| O.P. Jindal Global University, Sonipat | **CONFIRMED (UG law only)** | "Jindal Global Law School, O. P. Jindal Global University, Sonipat" (p. 18, Haryana) — 5-year B.Com. LL.B.(Hons.) (120) and 5-year BBA.LL.B.(H) (180), **approved upto 2026-27**. |
| KIIT, Bhubaneswar | **CONFIRMED** | "KIIT School of Law, KIIT University, Bhubaneshwar" (p. 52, Orissa/Odisha), **approved upto 2026-27**, year of establishment 1993. |
| Amity University, Noida | **CONFIRMED** | "Amity Law School, Noida Uttar Pradesh" (p. 68) — 5-year BA.LL.B.(H) (300), **approved upto 2026-27**; "Amity Law School Centre-II, Noida" — 5-year BBA.LL.B. (300) and 5-year B.Com. LL.B. (120) on the same approval line. |
| MAHE Manipal | **CONFIRMED, but for the Bengaluru campus, not Manipal** | "Manipal Law School, Manipal Academy of Higher Education, Bengaluru North, Karnataka" (p. 28) — 5-year BA LL.B.(Hons.) (120) **upto 2026-27**; 5-year B.Com. LL.B.(Hons.) (60) **upto 2026-28**; 3-year LL.B.(Hons.) (60) upto 2022-23 (lapsed). Do not attach this to the Manipal campus. |
| SRM IST, Kattankulathur | **CONFIRMED (one live course)** | "SRM School of Law, SRM Institute of Science and Technology (formally School of Law, SRM University), Kanchipuram, Tamil Nadu" (p. 63) — 5-year B.Com. LL.B.(H) **upto 2025-26**; 3-year LL.B. (120) upto 2024-25 (lapsed); a third row upto 2015-16 (lapsed). The newest approval ends with academic year 2025-26; treat as **lapsed/awaiting renewal** unless the bundle owner re-checks the next BCI upload. |
| Lovely Professional University | **CONFIRMED (lapsed windows only)** | "School of Law, Lovely Professional University, Phagwara, Punjab" (p. 54) — 3-year LL.B. (300) **upto 2025-26**; B.Com. LL.B.(Hons.) (120) upto 2018-19. Also "Lovely Institute of Law, Phagwara Jalandhar", 5-year BA LL.B.(Hons.), upto 2024-25. No approval window in the current list runs past 2025-26. |
| Amrita Vishwa Vidyapeetham | **LAPSED — do not badge** | "Amrita International School of Law, Amrita Vishwa Vidyapeetham (Deemed to be University), Coimbatore" (p. 63) — approval **upto 2018-19** only. |
| VIT Vellore | **NOT LISTED (for the Vellore campus)** | The only VIT law entry is "School of Law, Vellore Institute of Technology, Inavolu, Amaravati" (p. 3, Andhra Pradesh), approval **upto 2024-25**. There is no BCI-approved law course at VIT Vellore. |

### Publishable `recognitionBadges` wording — BCI

| University | Exact badge text |
|---|---|
| Symbiosis International | `Bar Council of India — Approved Centre of Legal Education, Symbiosis Law School Pune (approval to 2026-27)` |
| O.P. Jindal Global University | `Bar Council of India — Approved Centre of Legal Education, Jindal Global Law School (approval to 2026-27)` |
| KIIT | `Bar Council of India — Approved Centre of Legal Education, KIIT School of Law (approval to 2026-27)` |
| Amity University Noida | `Bar Council of India — Approved Centre of Legal Education, Amity Law School Noida (approval to 2026-27)` |
| MAHE Manipal | `Bar Council of India — Approved Centre of Legal Education, Manipal Law School, Bengaluru campus (approval to 2026-27)` — only if the bundle actually surfaces the Bengaluru law school |
| SRM IST, LPU | **omit** — newest approval window ends 2025-26; re-check on the next BCI upload |
| Amrita, VIT Vellore | **omit** — lapsed 2018-19 / not listed |

**Do not create a BCI badge on any LL.M. programme.** The ten O.P. Jindal LL.M. streams stay
unbadged: BCI does not accredit LL.M., so this is a category error rather than a missing source.

Verification URL to record: `https://www.barcouncilofindia.org/info/recognised-universities-colleges`
(the PDF itself sits behind a one-hour signed S3 link; cite the page, not the link).

---

## 3. UGC Institution of Eminence

Source: `https://ioe.ugc.ac.in/Home/ListofIOE`, rendered 2026-08-22. **This is the complete list —
twelve institutions, eight public and four private.** Every row carries a *Date of Notification*.

| Table | Institution | Date of Notification |
|---|---|---|
| Public | Indian Institute of Science, Bangalore | 11.10.2018 |
| Public | IIT Delhi | 11.10.2018 |
| Public | IIT Bombay | 11.10.2018 |
| Public | IIT Madras | 17.02.2020 |
| Public | IIT Kharagpur | 20.02.2020 |
| Public | University of Delhi | 02.03.2020 |
| Public | University of Hyderabad | 17.02.2020 |
| Public | Banaras Hindu University | 17.02.2020 |
| Private | BITS Pilani | 14.10.2020 |
| Private | **Manipal Academy of Higher Education** | **14.10.2020** |
| Private | **O P Jindal Global University** | **04.11.2020** |
| Private | Shiv Nadar (Institution of Eminence Deemed to be University) | 03.08.2022 |

| University in scope | Verdict |
|---|---|
| MAHE Manipal | **CONFIRMED — notified 14.10.2020.** The brief's "believed confirmed Oct 2020" is exactly right. |
| O.P. Jindal Global University | **CONFIRMED — notified 04.11.2020.** This overturns the working assumption. The PIB release of September 2019 recorded only a letter to the State Government; the notification followed on 4 November 2020 and JGU is on the current UGC list. The university's own 2020 assertion is correct. |
| VIT Vellore | **NOT LISTED.** VIT does not appear in either table. Its brochure claim is unsupported by the regulator — **omit, and flag the brochure claim to the bundle owner so it is not repeated in narrative copy either.** |
| Amrita Vishwa Vidyapeetham | **NOT LISTED.** A 2019 Letter of Intent is not a declaration and confers no IoE status. **Omit.** |
| KIIT | **NOT LISTED.** Same — Letter of Intent only, no notification. **Omit.** |

Note on the three-way distinction the brief asked for: the UGC portal publishes **only notified
IoEs, with their notification date**. A *Letter of Intent* is a pre-notification step, is not
published on this list, and must never be rendered as "Institution of Eminence". Anything not in the
twelve rows above has **no IoE status** for badging purposes.

### Publishable `recognitionBadges` wording — IoE

| University | Exact badge text |
|---|---|
| MAHE Manipal | `UGC Institution of Eminence — notified 14 October 2020` |
| O.P. Jindal Global University | `UGC Institution of Eminence — notified 4 November 2020` |
| VIT, Amrita, KIIT, Symbiosis, Amity, SRM, LPU | **omit — not on the UGC Institution of Eminence list** |

Verification URL to record: `https://ioe.ugc.ac.in/Home/ListofIOE`

---

## 4. NBA accreditation — tier and validity

Source: the NBA registers at `https://www.nbaind.org/accreditationprogram`, read 2026-08-22. Only
rows whose **Accreditation Period** extends beyond 2026-08-22 are listed as current. Historic rows
are called out where a bundle currently makes a claim that rests on one.

### Currently accredited (publishable)

| University | NBA-registered entity | Tier / register | Programmes | Accreditation period |
|---|---|---|---|---|
| **KIIT** | Kalinga Institute of Industrial Technology (Bhubaneswar) | **Engineering UG Tier I (Washington Accord)** | Civil, Computer Science & Engineering, Electrical, Mechanical, Electronics & Telecommunication | AY 2022-23 → 2027-28, **upto 30-06-2028** |
| KIIT | KIIT Polytechnic (Khurda) | Engineering Diploma | Civil, Electrical, Computer Science & Engineering | to 30-06-2025, **further accredited to 30-06-2028** |
| **VIT Vellore** | Vellore Institute of Technology (Vellore) | **Engineering UG Tier I (WA)** | Chemical, Electrical & Electronics, Electronics & Instrumentation, Mechanical | AY 2025-26 → 2030-31, **upto 30-06-2031** |
| VIT (Chennai off-campus) | Vellore Institute Of Technology Chennai Off Campus (Kancheepuram) | Engineering UG Tier I (WA) | Mechanical, Electrical & Electronics | **upto 30-06-2031** |
| **MAHE Manipal** | Manipal Institute of Technology (Manipal) | **Engineering UG Tier I (WA)** | Chemical, Civil, CSE, Electrical & Electronics, Electronics & Communication, Mechanical, Biotechnology (all **to 30-06-2028**); Biomedical (**to 30-06-2028**); Electronics & Instrumentation (to 30-06-2027); Aeronautical and Automobile (**1 Jan 2026 → 31 Dec 2028**); Mechatronics (**1 Jan 2026 → 31 Dec 2031**) | as listed |
| MAHE Manipal | Manipal Institute of Technology (Manipal) | Engineering PG | Digital Electronics & Communication, Industrial Automation & Robotics, Computer Science & Information Security | to 30-06-2027 |
| MAHE Manipal | Manipal College of Pharmaceutical Sciences (Udupi) | Pharmacy UG | Pharmacy | AY 2022-23 → 2027-28, **upto 30-06-2028** |
| MAHE Manipal | T A Pai Management Institute (Manipal) | Management PG | MBA (**1 Jan 2026 → 31 Dec 2031**); MBA HR and MBA Marketing (1 Jan 2026 → 31 Dec 2028); MBA Banking & Financial Services (to 30-06-2027) | as listed |
| **Amrita Vishwa Vidyapeetham** | AMRITA VISHWA VIDYAPEETHAM (Coimbatore) | **Engineering UG Tier I (WA)** | Electrical & Electronics (**1 Jan 2026 → 31 Dec 2031**); Chemical, Civil, Aerospace (1 Jan 2026 → 31 Dec 2028); CSE and Electronics & Communication (to 30-06-2027); Mechanical (to 30-06-2027) | as listed |
| Amrita | Amrita Vishwa Vidyapeetham Bengaluru campus | Engineering UG Tier I (WA) | Electrical & Electronics (to 30-06-2027); Electronics & Communication, Mechanical (to 30-06-2028) | as listed |
| Amrita | Amrita Vishwa Vidyapeetham, Amritapuri campus (Quilon) | Engineering UG Tier I (WA) | CSE (to 30-06-2028); EEE, ECE, Mechanical (to 30-06-2027) | as listed |
| **Symbiosis International** | Symbiosis Institute of Technology, Pune | **Engineering UG Tier I (WA)** | Mechanical (**upto 30-06-2030**); Civil, CSE, Electronics & Telecommunication (upto 30-06-2027) | as listed |
| Symbiosis International | SIBM Pune, SCMHRD Pune, SIBM Bengaluru, SIBM Hyderabad, SIBM Nagpur, SIOM Nashik | Management PG | MBA (various) | to 30-06-2027 |
| Symbiosis International | SIDTM Pune, SIIB Pune, SIMS Pune, SIMC Pune | Management PG | MBA / MBA (International Business) | **1 Jan 2026 → 31 Dec 2028** |
| **Lovely Professional University** | Lovely Professional University (Kapurthala) | **Engineering UG Tier I (WA)** | Civil, CSE, Electronics & Communication, Mechanical | AY 2024-25 → 2026-27, **upto 30-06-2027** |
| LPU | Lovely Professional University (Kapurthala) | Management PG | MBA | **upto 30-06-2027** |

### Not currently accredited (must stay omitted)

| University | Verdict | Evidence |
|---|---|---|
| **SRM IST, Kattankulathur** | **NOT LISTED (no current NBA accreditation)** | The only SRM IST entity in the register is "SRM Engineering College (a constituent unit of SRM Institute of Science and Technology - a Deemed to be University) (CHENNAI)" in the **Tier II** register, with periods "5 YEARS W.E.F. 21-2-98", "3 YEARS W.E.F. 1-4-2001" and "5 YEARS W.E.F. 24-4-2002" — all expired by 2007. `SRM Valliammai Engineering College` and `SRM TRP Engineering College` hold current accreditations but are **separate colleges, not SRM IST Kattankulathur**, and must not be borrowed. |
| **Amity University, Noida** | **NOT LISTED** | Across all nine registers the only Amity entities are Amity University Maharashtra (Raigad) — Biotechnology Tier I to 30-06-2028, and two MBAs to 31 Dec 2028. Nothing for Amity University Uttar Pradesh / Noida. |
| **O.P. Jindal Global University** | **NOT LISTED / not applicable** | No entry in any register. NBA accredits engineering, management, pharmacy, architecture, MCA and hospitality programmes; JGU's law and liberal-arts portfolio is outside NBA's remit. |

### Corrections to the working assumptions in the brief

- **KIIT's "Tier 1 / Washington Accord" claim is currently correct.** The lapsed 2011 records the
  brief refers to are the *Tier II* rows under the institution's older name "KIIT UNIVERSITY
  (BHUBANESWAR)" — "3 YEARS W.E.F. 27-07-2006" and "3 YEARS W.E.F. 22-01-2008". Separately, under
  "Kalinga Institute of Industrial Technology (BHUBANESWAR)", five UG programmes sit in the **Tier I
  (Washington Accord)** register with a period running to **30-06-2028**. Both facts are true; the
  Tier I one is the live one. The badge should name the five programmes and the date.
- **MAHE's MIT Manipal NBA status is not "Nil".** MIT Manipal holds one of the largest current Tier I
  blocks in the register (see table above), plus PG engineering, plus Manipal College of
  Pharmaceutical Sciences and TAPMI. Whatever the institutional disclosure says, the regulator's
  register is unambiguous.
- **Amrita's badge should not be scoped to "four Coimbatore programmes at Grade B".** NBA does not
  publish letter grades in this register at all — it publishes tier, status and period. Amrita holds
  current **Tier I (Washington Accord)** accreditation across three campuses (Coimbatore 7
  programmes, Bengaluru 3, Amritapuri 4). Re-scope the badge accordingly.
- **VIT's engineering NBA is stronger than assumed** — a fresh six-year Tier I block to 30-06-2031.

### Publishable `recognitionBadges` wording — NBA

| University | Exact badge text |
|---|---|
| KIIT | `NBA Tier I (Washington Accord) — five B.Tech programmes accredited to 30 June 2028` |
| VIT Vellore | `NBA Tier I (Washington Accord) — four B.Tech programmes accredited to 30 June 2031` |
| MAHE Manipal | `NBA Tier I (Washington Accord) — Manipal Institute of Technology B.Tech programmes accredited to 30 June 2028` |
| Amrita Vishwa Vidyapeetham | `NBA Tier I (Washington Accord) — B.Tech programmes accredited across the Coimbatore, Bengaluru and Amritapuri campuses (current to 2027-2031)` |
| Symbiosis International | `NBA Tier I (Washington Accord) — Symbiosis Institute of Technology B.Tech programmes accredited (Mechanical to 30 June 2030)` |
| Lovely Professional University | `NBA Tier I (Washington Accord) — four B.Tech programmes accredited to 30 June 2027` |
| SRM IST, Amity Noida, O.P. Jindal | **omit — no current NBA accreditation on the register** |

Verification URL to record: `https://www.nbaind.org/accreditationprogram`

---

## 5. Consolidated verdict matrix

Legend: **C** = CONFIRMED, publishable · **N** = NOT LISTED, keep omitted · **L** = lapsed/expired,
keep omitted · **–** = not applicable to this institution's portfolio.

| University | NAAC | BCI | UGC IoE | NBA |
|---|---|---|---|---|
| Symbiosis International, Pune | **C** A++ 3.56 Cy3 (2022) | **C** to 2026-27 | **N** | **C** Tier I |
| VIT Vellore | **C** A++ 3.66 Cy4 (2021) — validity caveat | **N** (Vellore) | **N** | **C** Tier I to 2031 |
| MAHE Manipal | **C** A++ 3.65 Cy3 (2022) | **C** (Bengaluru campus) to 2026-27 | **C** 14.10.2020 | **C** Tier I to 2028 |
| Amity University Noida | **N** | **C** to 2026-27 | **N** | **N** |
| Amrita Vishwa Vidyapeetham | **C** A++ 3.70 Cy3 (2021) — validity caveat | **L** (to 2018-19) | **N** (LoI only) | **C** Tier I |
| KIIT | **C** A++ 3.52 Cy3 (2022) | **C** to 2026-27 | **N** (LoI only) | **C** Tier I to 2028 |
| SRM IST Kattankulathur | **C** A++ 3.58 Cy4 (2024) | **L** (to 2025-26) | **N** | **N** |
| Lovely Professional University | **C** A++ 3.68 Cy1 (2023) | **L** (to 2025-26) | **N** | **C** Tier I to 2027 |
| O.P. Jindal Global University | **N** | **C** UG law to 2026-27 | **C** 04.11.2020 | – |

### Nothing remains "UNREACHABLE"

Every claim in the brief now has a verdict. The one portal that genuinely would not respond —
`assessmentonline.naac.gov.in` — was replaced by NAAC's own published valid-accreditation workbook
and its Standing Committee result PDFs, which carry the same grade, CGPA, cycle and declaration date
per institution. No claim below was left blocked on a rendering failure.

Two claims are **time-blocked rather than source-blocked**: VIT's and Amrita's NAAC awards reach
their five-year point this month and NAAC has published no results since 12 December 2025. Those two
badges should carry the declaration year only, or be held until NAAC publishes again.

## 6. Things bundle owners should fix, not just add

1. **VIT's Institution of Eminence claim is false against the regulator.** If it appears anywhere in
   the VIT bundle's narrative fields, `whyChoose`, or FAQ answers — not only in `recognitionBadges` —
   it must be removed, not merely left un-badged.
2. **Amrita's self-reported "A++ 3.67 (2023)"** does not match the regulator's "3.70, declared
   17-08-2021". Use the regulator figure.
3. **KIIT's and Amrita's Institution of Eminence language** must be reduced to nothing — a Letter of
   Intent is not a status and has no publishable form.
4. **SRM IST's NBA claim** (if any bundle carries one) rests on 1998–2002 records for a predecessor
   college and must be removed.
5. **MAHE's "NBA: Nil" disclosure** is contradicted by the register; the badge is safe to add.
