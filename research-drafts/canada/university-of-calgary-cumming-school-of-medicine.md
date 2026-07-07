# Research record: University of Calgary — Cumming School of Medicine (Calgary, Canada)

Status: **NOT PUBLISHED — held (ok=false)**

## Why this cannot be published for the India-audience MBBS/medical-pg/nursing/pharmacy/BDS funnel

The Cumming School of Medicine's undergraduate **MD Program admissions are restricted to
Canadian citizens, permanent residents of Canada, or individuals with Convention refugee
status in Canada. International students are explicitly NOT accepted.** This is stated
directly on the official admissions eligibility page:

> "The Cumming School of Medicine welcomes applications to the MD Program from Canadian
> citizens, permanent residents of Canada, or individuals with refugee status in Canada...
> [International students] are not eligible to apply."
> — https://cumming.ucalgary.ca/mdprogram/future-students/admissions/am-i-eligible

Corroborated independently by a secondary summary source (BeMo Academic Consulting) and by
the official UCalgary Calendar admissions section (5.3.1 Admission Eligibility), both of
which repeat the same Canadian-citizen/PR/refugee-only restriction.

Additionally:
- Canada does not have an undergraduate "MBBS"-style entry route at all — Canadian medical
  schools including Cumming SoM are **graduate-entry MD programs** (applicants must already
  hold, or be near completion of, an undergraduate degree). This does not map cleanly to the
  `mbbs` courseSlug used across this site's India-outbound content even if eligibility were open.
- Cumming School of Medicine does not operate BDS (dentistry), Bachelor of Pharmacy, or
  BSc Nursing degree programs — it is a medical school (MD) plus a Graduate Science
  Education (GSE) division (PhD/MSc in biomedical sciences) plus Postgraduate Medical
  Education (residency/fellowship, for licensed physicians only, largely via CaRMS/AIMG
  pathways, not a "study abroad after Class 12" pathway).
- The postgraduate/residency route for International Medical Graduates (IMGs) exists (AIMG
  Program, sponsored fellowships) but this is for **already-qualified physicians** seeking
  residency/fellowship placements, not a comparable product to the site's `medical-pg`
  content pattern (which targets students seeking a postgraduate medical *degree* abroad).
  Conflating the two would misrepresent what is actually available.

Given the hard rule "never fabricate; India-audience framing with correct regulator ONLY if
corroborated" and the courseSlug allow-list `{mbbs, medical-pg, bsc-nursing, pharmacy, bds}`,
there is no honest, non-fabricated program that can be attached to this university for this
site's funnel. Publishing a page implying Indian students can enroll in the MD program (or
any equivalent) would be factually false and could mislead prospective applicants and their
families — a direct violation of project sourcing/editorial rules.

**Decision: hold as a local draft, do not publish, do not seed to the DB.**

## Key verified facts (for the record, not published)

| Fact | Value | Source |
|---|---|---|
| Name | Cumming School of Medicine, University of Calgary | Official site; Wikipedia |
| City | Calgary, Alberta, Canada | Official site |
| Type | Public (University of Calgary is a public research university) | Official site |
| Established | 1967 (Faculty of Medicine founded; first Dean Dr. William Cochrane appointed Jan 11, 1967); first students admitted 1970; renamed "Cumming School of Medicine" in 2014 after a $100M gift from Geoffrey Cumming (matched by Alberta govt.) | cumming.ucalgary.ca/about/cumming-school-medicine/history; Wikipedia; ucalgary.ca news |
| Official website | https://cumming.ucalgary.ca/ | Direct |
| MD program admissions | Canadian citizens / permanent residents / Convention refugees ONLY — international students explicitly not eligible | https://cumming.ucalgary.ca/mdprogram/future-students/admissions/am-i-eligible (confirmed via curl fetch of live page, plus BeMo summary and UCalgary Calendar 5.3.1) |
| Graduate Science Education (GSE) | Offers ~11 thesis/course-based MSc/PhD programs in biomedical/health sciences; general entry requires 4-year undergrad degree (3.30/4.0 GPA on last 2 years); international-student eligibility for GSE not explicitly confirmed in sources reviewed — would need direct confirmation from GSE admissions office | cumming.ucalgary.ca/gse/future-students/graduate-admissions |
| Postgraduate Medical Education (PGME) | 65+ residency programs (RCPSC/CFPC-accredited); IMGs who did not graduate from an LCME-accredited school apply via the Alberta International Medical Graduate (AIMG) Program, not a standard student-visa study route; also offers sponsored international fellowships for already-licensed physicians | cumming.ucalgary.ca/pgme; cumming.ucalgary.ca/pgme/future-trainees-2018/international-medical-school-graduates |

## Omitted entirely (per "exhaustive-then-omit, never fabricate")
- Any `programs[]` entry with courseSlug in {mbbs, medical-pg, bsc-nursing, pharmacy, bds} —
  none exist that Indian students can actually enroll in as a study-abroad degree pathway.
- Tuition/fees — not researched further since there is no publishable program to attach them to.
- Hostel/accommodation, Indian food/community specifics — not researched in depth; the school
  gate fails on eligibility before these become relevant.
- Any regulator claim (NMC/NEET/FMGE, PCI, INC) — none apply; not asserted.

## Sources consulted (labelled)
1. Official — MD Program "Am I Eligible?" (eligibility/citizenship requirement) — https://cumming.ucalgary.ca/mdprogram/future-students/admissions/am-i-eligible (fetched directly via curl; confirmed live)
2. Official — UCalgary Calendar, MD 5.3.1 Admission Eligibility — https://calendar.ucalgary.ca/pages/QtA1GrhrkqzqEGtEnQO4
3. Secondary — BeMo Academic Consulting, "Cumming School of Medicine: How to Get in" (independent corroboration of citizen/PR/refugee-only policy) — https://bemoacademicconsulting.com/blog/cumming-school-medicine
4. Official — Cumming School of Medicine history page — https://cumming.ucalgary.ca/about/cumming-school-medicine/history
5. Wikipedia — Cumming School of Medicine (established year, renaming, Cumming gift) — https://en.wikipedia.org/wiki/Cumming_School_of_Medicine
6. Official — UCalgary news, "Big dreams at a little university: 60 years of the Cumming School of Medicine" — https://ucalgary.ca/news/big-dreams-little-university-60-years-cumming-school-medicine
7. Official — Graduate Science Education admissions — https://cumming.ucalgary.ca/gse/future-students/graduate-admissions
8. Official — Postgraduate Medical Education (PGME) landing page — https://cumming.ucalgary.ca/pgme
9. Official — PGME International Medical School Graduates — https://cumming.ucalgary.ca/pgme/future-trainees-2018/international-medical-school-graduates

## Recommendation
Do not re-attempt this specific school for the India-outbound MBBS/medical-pg/nursing/pharmacy/BDS
funnel unless the site's scope expands to cover Canadian graduate MD pathways for PR-track
students, or GSE/PhD content with a different courseSlug taxonomy. Any future revisit should
start by contacting GSE admissions directly to confirm international-student eligibility for
MSc/PhD biomedical programs, which is the only plausible internationally-open avenue here —
but that still would not fit the current courseSlug allow-list.
