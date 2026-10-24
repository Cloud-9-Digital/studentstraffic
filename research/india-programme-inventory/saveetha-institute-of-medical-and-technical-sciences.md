# Saveetha Institute of Medical and Technical Sciences (SIMATS): programme inventory

Checked 2026-10-23 by claude-tn-simats-cloud-20261023 (batch claude-tn-universities-batch1-cloud-20261023).
Ledger status: **held**. No migration was reserved.

## Identity

- Official name: Saveetha Institute of Medical and Technical Sciences (SIMATS), also styled "Saveetha University (Deemed)" by NMC and DCI.
- UGC consolidated list of universities, deemed university entry 816: notified 18.03.2005; address No. 162, Poonamallee High Road, Velappanchavadi, Chennai 600 077. Main campus: Saveetha Nagar, Thandalam, Chennai 602 105 (Kancheepuram district).
- Merged constituent units (one page): Saveetha Medical College and Hospital (NMC code TN/055/P/3), Saveetha Dental College and Hospital, SIMATS Engineering (Saveetha School of Engineering), Saveetha School of Management, Saveetha School of Law, Saveetha College of Nursing, Saveetha College of Physiotherapy, Saveetha College of Occupational Therapy, Saveetha College of Allied Health Sciences, Saveetha College of Pharmacy, Saveetha College of Architecture and Design / School of Design, Saveetha College of Liberal Arts and Sciences, SIMATS School of Hospitality (SHIFT), Saveetha School of Physical Education.
- Excluded: Saveetha Engineering College (saveetha.ac.in), an Anna University affiliated college, and The Pupil school.

## Sources used

- SIMATS Prospectus 2026 (simats_prospectus_2026_v18.pdf, 130 pages, created 11 Nov 2025), linked as "Prospectus" from the public self-disclosure page https://www.saveetha.com/new-page-86 (Google Drive id 1A9JQoROlcJ6rKA_D2KKDUiJqmn5jyxU0). Programme lists and eligibility for every school.
- SIMATS fee page https://www.saveetha.com/admission2: per-annum fees for every programme, "Indian Students and SAARC Countries Students Fee in INR" and "NRI / Foreign Students Fee (UK, US & other Western countries) in USD". No academic year is printed on the page.
- NMC "List of College Teaching MBBS" and "List of College Teaching PG Courses" (data endpoint behind the public pages, searched "Saveetha", updated 2026-10-05): MBBS 250 seats with annual renewal for AY 2026-27; 29 PG rows (seat counts in the CSV).
- DCI Dentists Act Schedule Part I (https://dciindia.gov.in/Download/SchedulePart_I.pdf), item 79: BDS of Saveetha University (Deemed) recognised if granted on or after 16.06.2009. MDS appears only under Saveetha Dental College as Dr MGR Medical University degrees, not as Saveetha University (Deemed) degrees.
- MCC UG Counselling 2026 information bulletin (revised 20.08.2026) and schedule (14.09.2026): 100% of deemed-university MBBS/BDS seats through MCC, 15% NRI quota, OCI and foreign-national document lists; Round 2 reporting 12-18 Sept 2026, Round 3 reporting 1-9 Oct 2026.
- BCI approved-CLE list (feed attachment BCA0026X2756XE53WEM, uploaded 2026-10-21) via https://www.barcouncilofindia.org/info/recognised-universities-colleges.
- SSM admission page (http://www.ssm.saveetha.com/admission), SSM academic calendar 2024-25, AICTE EOA 2024-25 (MBA intake 120).

## Unreachable or unusable sources (from this container)

- NIRF (www.nirfindia.org, including nirfpdfcdn data PDFs): HTTP 403 on every request.
- NAAC (naac.gov.in xlsx, assessmentonline.naac.gov.in): connection reset / no response. No NAAC badge can be verified; SIMATS states A++ (2022).
- PCI (pci.nic.in) and COA (coa.gov.in): no connection after retries.
- INC suitable-institutions report (online.indiannursingcouncil.org/Reports/YearlyReportByState.aspx): the ReportViewer returns a server configuration error, so no institution list renders.
- Study in India institute search: dynamic and encrypted; SIMATS's partner status could not be confirmed.
- SMC fee/intake PDFs linked from smc.saveetha.com (Mandatory-Disclossure-of-Fee-Structure.pdf, Sanctioned-intake-updated.pdf): HTTP 404.
- naac.saveetha.com: 404. saveetha.com/admission (linked for academic calendar and programme details in the self-disclosure page): 404.

## Why the university is held

1. **Teaching language unverified for every programme.** The prospectus, fee page, college sites, AQAR 2020-21 and the DCI BDS regulations checked do not state a medium of instruction, and Study in India partner status (whose FAQ says partner institutes teach in English) could not be confirmed. The payload schema rejects an unverified `medium`.
2. **No intake month for non-NEET programmes.** SIMATS publishes no 2026-27 academic calendar; the only calendar found is SSM's 2024-25 MBA calendar (induction 25.09.2024). MBBS/BDS/MD/MS intake can be tied to MCC 2026 rounds only.
3. **Regulator gates:** law held (BCI approvals end 2020-21 and 2024-25); MDS held (not on DCI Schedule under Saveetha University); nursing, pharmacy and architecture held (INC, PCI, COA lists not reachable).
4. **Fee conflict:** MBA INR 3,50,000/yr (SIMATS fee page) vs INR 3,75,000/yr (SSM admission page).
5. **Taxonomy gaps** (if packaged later): md-physiology, md-immunohaematology-blood-transfusion, md-sports-medicine, mds specialities, pharm-d, DM/MCh, several M.Sc medical sciences, B.E. Bioinformatics, B.Tech Dental Technology.

## Row counts

175 programme rows (139 with a published NRI/foreign USD fee or an MCC NRI route, recorded as open_to_international); 0 packaged. Ph.D. (all schools, INR 25,000 / USD 580 a year) is recorded here only. Engineering specialisations, MBA specialisations, B.Sc (Hons) Allied Health branches and M.Sc Nursing specialities are major_within rows noted on the parent row.

## What unblocks packaging

A SIMATS document (regulations, academic calendar 2026-27, or Study in India listing) that states the medium of instruction and the 2026-27 start dates. With that, about 70 programmes have exact canonical matches and Grade A fee evidence (domestic INR headline plus USD `additionalFees`). MBBS, BDS and the 18 MD/MS specialities also pass the regulator gate.

## Targeted resumption — 2026-10-24 (codex-india-20261024)

- Corrects the previous blanket teaching-language hold: https://scot.saveetha.com/admissions explicitly confirms English instruction for Bachelor of Occupational Therapy (60% PCB; entrance examination and interview; age 17; four academic years plus one internship year). It does not establish the MOT medium or current intake month.
- https://www.ssm.saveetha.com/s/academic-schedule-19-20.pdf confirms English for MBA under 2015-16 regulations, but its 2019-20 calendar cannot establish a current intake. The fee conflict remains unresolved.
- https://www.scpt.saveetha.com/news-events labels an ACADEMIC CALENDAR 2026-2027, but its only iframe is a Google calendar for saveetha.scpt@gmail.com; the accessible page exposes no dated first-year commencement event. The label alone is not intake evidence.
- The MBBS/MDMS reporting forms ask the applicant for the medium of the prior qualifying examination; they are not evidence for the programme teaching language. Their displayed NEET-2024 fields also cannot establish current intake timing.
- Targeted primary-domain queries for 2026 commencement and medium of instruction did not resolve the remaining programme-level gaps. This retry did not assemble a complete publishable programme bundle. The existing 2024-25 MBA calendar may establish a historical September baseline if directly rechecked and clearly dated; absence of a 2026 commencement alone must not hold a programme with a valid recent baseline. Current programme/regulatory scope and the remaining language/portfolio gaps still require follow-up. Existing regulator and portfolio holds remain pending authoritative resolution.
- Status: held. No migration or media manifest reserved; scoped content validation not applicable because there is no executable payload. No database access or publication performed.

### Additional discovery after expanded-source instruction

- https://sites.google.com/saveetha.com/sacthe-simats/programmes/mhpepgdhpe-programmes is a Saveetha-domain Google Site for SaCTHE. It advertises MHPE/PGDHPE and an October 2026–October 2027 calendar; full award title, formal eligibility, teaching language, fees and foreign-access rules were not established. These are new discovery candidates beyond the inherited 175-row inventory and need confirmation before claiming the inventory is institution-wide complete. They were not packaged.
- Independent search also exposes Saveetha Engineering College (saveetha.ac.in) and Saveetha Amaravati calendars; these are distinct institutions and cannot supply SIMATS Tamil Nadu dates.
- The blanket old language assertion is superseded for BOT and MBA. An old MBA calendar can be a precisely dated historical intake baseline under the parent’s clarification; do not impose an arbitrary 2026-only gate. No second current regulator recognition for MBA was verified in this targeted resumption (inherited AICTE EOA was 2024-25), and no standalone SIMATS migration was reserved.

## Bounded retry — 25 October 2026

Official SCOT events page https://scot.saveetha.com/blog explicitly establishes BOT/MOT new-batch induction on 7 August 2024. BOT teaching English is explicit on https://scot.saveetha.com/admissions. However, that page specifies four academic years plus one internship year (five total), conflicting with the central prospectus/fee-table 4.5 years. No duration chosen silently. MOT language remains unverified. MBA English old regulations and historical 25 September 2024 induction are available, but current professional approval was not verified: https://www.ssm.saveetha.com/new-page-58 now links only EOA2022-23 and LOA2019-20. Tuition amounts conflict and can remain unquoted; programme duration/regulatory scope and complete inventory still held. No payload or reservation.
