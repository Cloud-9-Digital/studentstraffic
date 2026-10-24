# VISTAS continuation — held, source-completion pending

Checked 2026-10-24. Canonical identity: **Vels Institute of Science, Technology & Advanced Studies
(VISTAS)**; official `velsuniv.ac.in` redirects to `vistas.ac.in`. The pre-existing owned ledger row
was corrected atomically with `mutateUniversityPublishingLedger`, under its inter-process lock,
from the typo `vals-institute-of-science-and-advanced-technologies` to
`vels-institute-of-science-technology-and-advanced-studies`. Owner remains
`codex-tn-batch3-20261024`; status **held**. No duplicate claim created.

## Captured current regular programme inventory

The CSV captures 199 campus-specific title rows from four official ERP portals marked Registrations
2026-27, deduplicated within each campus. Counts: Pallavaram 143, Adyar 16, Thiruvanmiyur 19,
Periyapalayam 21. There are 69 PhD entries excluded from this taught-programme scope. The same programme
at two campuses is intentionally a separate inventory row. These are captured admissions-list titles,
not a claim that complete programme eligibility/duration/fees have been researched.

- https://erp.vistas.ac.in/velsonline/applicationist/loginManager/applicantRegistration.jsp
- https://erp.vistas.ac.in/velsonline/applicationist/loginManager/applicantRegistrationVelsAdyar.jsp
- https://erp.vistas.ac.in/velsonline/applicationist/loginManager/applicantRegistrationVelsTvmr.jsp
- https://erp.vistas.ac.in/velsonline/applicationist/loginManager/applicantRegistrationVelsPypm.jsp

Successful direct HTML captures: `research/india-source-bundles/vistas-20261024/`.
Reproducible inventory builder:
`research-drafts/india/vels-institute-of-science-technology-and-advanced-studies-inventory.py`.
All rows remain `intl_status=unknown` until the intended programme/campus has an assessed route.
Proposed canonical matches that lack a registry family must remain `GAP:` until resolved.

## Blocking source facts

The main university homepage, admissions, fee-structure and international-admissions pages return
access-denied pages through web retrieval. Direct curl also failed with HTTP/2 INTERNAL_ERROR or
empty response; one HTTP/1.1 retry failed. The current fee pages exist but their contents were not
read, so the aggregator's amounts are discovery evidence only, not verified tuition.

- https://vistas.ac.in/admissions-2/
- https://vistas.ac.in/fee-structure/
- https://vistas.ac.in/international-admissions/
- https://vistas.ac.in/school-of-engineering-fees-structure/

One official full PDF opened successfully through web retrieval:
https://vistas.ac.in/wp-content/uploads/PG-Engineering-Regulation-2023.pdf
It confirms full-time M.Tech, four semesters, 80 credits, English instruction, phase-I/II projects
and programme-specific qualification table. It does not establish current intake/start date, current
foreign eligibility or tuition. These missing fields prevent an executable M.Tech offering.

Indexed official PDFs identify potentially useful English/July rules and programme-specific entry,
but most now return access denied when opened, so their search excerpts have not been promoted to
verified publication evidence:
- PG Arts/Science/Humanities Regulations 2024 (all regular PG and qualifying-degree matrix);
- UG B.Com Corporate Secretaryship 2023 regulations;
- LL.M 2023 branch regulations (foreign-national LL.B >=55%, English assessment and interview);
- B.Sc Physician Assistant regulation (English, August start, subject and entrance criteria).

Current fee directory/engineering fees links were rediscovered through CollegeAndFees, whose citations
help route research. Its numbers are not copied into a payload. `admission.velscollege.in` explicitly
states in its disclaimer that it is an authorised admission-partner marketing site, not the official
university; it is not used as primary evidence.

## Institution scope still requiring completion

Vels Medical College and Hospital is an explicit VISTAS unit. Its 2025-26 PG prospectus at
https://velsmedicalcollege.com/pdf/PG-Prospectus-AY-2025-26.pdf is 15.6 MB, exceeded the web tool content
limit, and direct download timed out. Current MBBS and PG clinical programme/qualification coverage
must be reconciled before calling the overall university inventory complete. A School of Agriculture
programme also appears in current official-page search discovery and needs campus/admission verification.

Sri Venkateswara Dental College & Hospital is a **VELS Group** institution but its own official about
page states affiliation to **Tamil Nadu Dr MGR Medical University**. It must not be merged into VISTAS
on shared group ownership alone:
https://www.svdentalcollege.com/aboutus.asp

## Publication status

No executable payload, no scoped validation, no media upload or database action. Existing typo-named
reservation `0157-vals-institute-of-science-and-advanced-technologies` remains manifest-only with an
explicit reservation note. A future ready payload requires a new correctly named reservation.
Resume by restoring full official or authenticated mirrored documents for eligibility, international
route, intake, fees and institutional recognition, and completing medical/agriculture scope.
