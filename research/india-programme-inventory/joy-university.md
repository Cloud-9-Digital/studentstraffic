# Joy University — Programme Inventory

Owner `claude-india-joy-20261022`, batch `claude-india-batch4-20261022`, checked 2026-10-22. Companion to
`joy-university.csv`. Payload: `content-migrations/0117-india-joy-university/payload.json`.

## Identity

Joy University, Raja Nagar, Alanganeri, Vadakkankulam, Radhapuram Taluk, Tirunelveli District 627116, Tamil Nadu.
State private university under the Tamil Nadu Private Universities Act, 2019 (Schedule entry 7, in force from
26.07.2022 via Act No. 12 of 2025); commenced 10 Oct 2022 (TN Gazette Ex. No. 478, G.O. Ms. No. 209). UGC Section 2(f)
inclusion by letter of 22 July 2025; UGC live HEI list shows status 2(f) (record id 1368). Sponsor: Selvam Educational
and Charitable Trust ("Rajas Group" — same group as Sardar Raja College of Engineering / Rajas Institute of Allied
Health Sciences). No aliases or former names found; no other campus.

## Sources used

1. Official site: Admissions (programme list per school), nine school pages ("Programmes Structure & Eligibility"),
   Fee-Structure (domestic INR per programme), International Admission (USD fee table, SAARC / non-SAARC),
   Ph.D. admissions page, Academic Regulations 2026-27 PDF (eligibility tables, medium of instruction, admission
   routes), UGC proforma PDF (programme list with sanctioned intake and 2024-25 / 2025-26 enrolment, academic calendar,
   student numbers), Mandatory Disclosure (April 2025), older Admission Regulations PDF, hostel / transport / scholarship pages.
2. Regulators: UGC HEI list JSON (`Getuniversity_details?unitypeID=3`) and record `Private_university_other?id=1368`;
   PCI list JSON (pci.gov.in degree / diploma lists); BCI approved-CLE list (document viewer on barcouncilofindia.org);
   INC "institutions found suitable" report 2025-26 and 2026-27 (Tamil Nadu, private, B.Sc(N), Tirunelveli and Kanyakumari).
   Bureau of Immigration study-in-India page for visa/FRRO.
3. Aggregator checklist only: Careers360 course list (no programme found that is absent from the official site).

## Unreachable / not found

- No separate international eligibility, quota, process or deadline page exists; the "Admission Guidelines for
  International Students" link in the Mandatory Disclosure points to the same fee table.
- Academic Calendar 2026-27 PDF is image-only (not OCR'd; calendar facts taken from the UGC proforma and Academic Regulations).
- AISHE certificate PDF is image-only (not used).

## intl_status rule

`open_to_international` = programme belongs to one of the 12 groups on the International Admission fee table
(B.Tech, B.Sc Agriculture, MBA, B.Sc Nursing, B.Sc AHS, B.Pharm, BPT, BBA, BCA, B.Com with ACCA, BBA LLB, BA LLB).
Partner-delivered tracks (Intel/NEC/Edulateral, CollegeDekho, NIAT, LSC) carry higher domestic fees and the table does not
say whether its single band covers them, so they are `unknown`. Every programme not in a listed group is `unknown`.

## Counts

- 126 inventory rows: 108 current official programmes / Ph.D. areas + 18 legacy rows (in UGC proforma or older
  regulations but no longer on the current programme pages).
- 44 `open_to_international`; 82 `unknown`; 0 `not_open`; 0 `aggregator_only_unconfirmed`.
- **Packaged: 68.**
  - 41 international (availability `global`, USD fee bands): 22 B.Tech, B.Sc (Hons) Agriculture, 5 MBA, 4 BBA, 2 BCA,
    5 B.Sc allied health, BPT, B.Pharm.
  - 27 domestic-only (availability `restricted`, confirmed INR fee from the Fee-Structure page, which prints no
    academic year), added 2026-10-22 on user approval: 2 B.Sc (Hons) CSE, M.Tech CSE (AI & ML), B.Design Fashion
    Design, B.Sc (Hons) Horticulture, 3 M.Sc (Agriculture), 2 M.Sc (Horticulture), B.A. English / Tamil /
    Criminology & Police Administration, B.Sc Forensic Science / Psychology / Film & TV Production / Renewable Energy /
    Biotechnology, M.Sc Psychology / Biotechnology / OTAT / Cardiac Perfusion, B.Lib.I.Sc., 4 B.Com.
- **Held: 40 current rows** (+ 18 legacy not packaged):
  - Law: B.A. LL.B (Hons), B.B.A. LL.B (Hons) and LL.B (Hons) — BCI approved list shows approval only up to 2025-26;
    LL.M Taxation and LL.M Cyber Law/Cybercrime — kept held pending BCI 2026-27 listing for the School of Law.
  - B.Sc Nursing — not on INC suitable list for 2025-26 or 2026-27.
  - D.Pharm — not on PCI's diploma lists.
  - 7 partner tracks (Intel/NEC/Edulateral x2, CollegeDekho B.Tech/BCA/MBA, NIAT, LSC BBA) — separate domestic fees
    but no programme page of their own and no stated international fee.
  - `B.Com with ACCA` — fee line on the international page only, no programme page.
  - 25 Ph.D. areas.

## Notable

- UGC proforma reports 0 foreign / NRI / PIO students (3,787 total) — the international fee table has not yet produced enrolment.
- Several programmes enrolled far above sanctioned intake per UGC proforma Appendix VIII (e.g. CSE (AI & ML): sanctioned 60,
  enrolled 392 in 2024-25 and 628 in 2025-26). Not published as public copy; flagged for the integrator.
