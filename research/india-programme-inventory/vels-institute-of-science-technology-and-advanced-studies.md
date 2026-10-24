# VISTAS continuation — active source reconciliation

Checked 2026-10-24. Canonical identity: **Vels Institute of Science, Technology & Advanced Studies
(VISTAS)**; official `velsuniv.ac.in` redirects to `vistas.ac.in`. The pre-existing owned ledger row
was corrected atomically with `mutateUniversityPublishingLedger`, under its inter-process lock,
from the typo `vals-institute-of-science-and-advanced-technologies` to
`vels-institute-of-science-technology-and-advanced-studies`. Owner remains
`codex-tn-batch3-20261024`; resumed under the locked queue to **researching** on 25 October 2026. No duplicate claim created.

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


## Second continuation — 25 October 2026

Official NAAC-hosted MBA2024 regulation opens fully: https://naac.vistas.ac.in/web/MBA%20GENERAL%20SYLLABUS%20-%202024%20REGULATION%20-%2030.9.24.pdf . It establishes two years/four semesters, English instruction, three-year bachelor degree minimum50% (45%reserved), odd semester July–November, 102credits,30day internship between semesters2/3 and fourthsemester project. This materially resolves MBAacademicfacts, but does not identify the current campus-specific foreign application route or establish current class-start2026 dates; a semester range is not a reporting notice. Main fee/international pages still accessdenied. No invented current fee or international eligibility added.

Medical2025-26 prospectus search indexed thirteen MD/MS programmes at https://velsmedicalcollege.com/pdf/PG-Prospectus-AY-2025-26.pdf but full15.6MB document remains above web limit and unverified at fulltext. Need add the medical portfolio only after source retrieval and verify current NMCpermissions/intake/English. Search-index table includes GeneralMedicine,Paediatrics,Dermatology,Psychiatry,GeneralSurgery,Orthopaedics,Obstetrics&Gynaecology,ENT,Ophthalmology,Anaesthesiology,Radiodiagnosis,Pathology,CommunityMedicine. Medicalunit and Agriculture completeinventory remain gaps.

University remains held after targeted attempt; no new numbered reservation or executablepayload. Nextworker should use accessible naac.vistas.ac.in archive and retrieve current campus-specific international instructions before promoting MBA.


## Source recovery checkpoint — 25 October 2026

The earlier network-only hold is superseded by legitimate browser source retrieval. No CAPTCHA, browser warning or access control was bypassed. The website's automatic browser-verification page completes during normal navigation. Read-only official pages were saved with Chrome's native **Webpage, Single File** format; their rendered HTML, extracted text and tables are in `research/india-source-bundles/vistas-20261025/`. Original MHTML captures remain locally under `/private/tmp/vistas-mhtml-20261025/`; durable extracted HTML preserves the actual institution content and URL association. Ordinary direct HTTP often still returns an HTTP200 HTML challenge, not institution content; those responses are separately labelled under `http-challenge-samples/` and are never treated as PDF, logo or fee evidence.

- Current Students page links the actual 2026–27 calendar at `https://vistas.ac.in/wp-content/uploads/2026/07/Academic_Calendar_2026_2027.pdf`. The genuine downloaded 90.6KB, 11-page PDF is `vistas-calendar2026-official.pdf`. Printed August page/physical PDF page3 explicitly gives **3 August 2026: Commencement of Classes for all the first year UG & PG Programmes** and freshers ceremony. July2 is higher-year reopening and must not become first-entry timing. The date is historical 2026; future applicants need their next notice. Applicability must be established separately for medical, maritime teaching locations and off-campus units.
- Current 2026–27 fees explicitly isolate **Tuition Fee (Per Sem)**, **Other Fee (Per Sem)** and combined total per semester/year. Two semesters form an academic year. Domestic fee audience must remain explicit: the fee index says foreign/NRI/OCI rates differ. Compulsory Other Fee belongs in fee notes, not alternative-audience tuition. Engineering merit bands must never be presented as a universal discounted fee.
- `mba2024.pdf`, current official MBA regulations applicable from2024–25, states English for all PG programmes. `pg-engineering2023.pdf` expressly confirms English for postgraduate engineering. `bba-aviation2021.pdf`, official UG regulations2021, explicitly states English for all UG programmes excluding Tamil/Hindi/French language papers. Any reliance on that broad UG clause must retain its sourceyear2021 and must yield to programme-specific conflicting evidence.
- `ug-arts-science-regulations2024.pdf` is the current faculty regulation applicable2024–25onwards. It gives three-year bachelor exit and optional four-year honours/research. Do not silently label three-year routes honours or substitute a three-year exit for an ERP-named honours award. Individual eligibility matrices must be reconciled with current course-entry pages, especially CS specialisations and aviation.
- The current international page expressly invites overseas/NRI UG/PG applications, gives12years schooling for UG, bachelor minimum3years after12years schooling for PG, AIUequivalence, translated transcripts, passport/photo and programme assessment. It is not blanket proof of professional regulator acceptance or equivalence of every foreign prior degree.
- Main current programme directory and individual eligibility pages expose additional or legacy titles beyond the199 ERP campus rows. These are being reconciled, not discarded. Current Medical College homepage/programmes source identifies MBBS and links `pdf/MBBS-Prospectus-2026-2027.pdf` plus `pdf/pg-prospectus.pdf`; the previously indexed2025–26 prospectus lists13MD/MS. Medical award/campus recognition and first-entry evidence remain separate.

### Exact conflicts already identified

1. Current law eligibility webpage lists Corporate/Commercial and Constitutional/Administrative LL.M as **one year**, while2023LLM regulations specify **two years**. Hold those conflicting award/duration claims. Other specialisations require their own consistent current route; an old generic LL.M rule must not silently override a current changed duration.
2. Current Agriculture school narrative lists BSc(Hons)Agriculture, BSc(Hons)Horticulture, DiplomaAgriculture and DiplomaHorticulture; its course card labels BSc(Hons)Agriculture **Awarded By: Teesside University,UK**, alongside older VISTAS-issued regulations. Hold awarding-body/campus/current route until resolved; no VISTAS recognition transfer to a foreign award.
3. BScBioinformaticsAI/DS is ERP-labelled honours but current eligibility page gives3years; hold exact honours duration until the currently offered award is clear.
4. Diplomas/certificates are not automatically covered by a calendar phrase limited to UG/PG. Maritime and medical intake/physical-campus scope need separate confirmation. PharmD is a professional award, not a research doctorate.

### Recognition and media checkpoint

UGC's own consolidated register entry836 identifies Vels/VISTAS, Pallavaram, as deemed university dated **4June2008** (`research/india-source-bundles/chennai-mathematical-institute/ugc-own-register.pdf` and txt). NAAC's own valid-accreditation XLSX as14August2025, sheet1 row387/serial386, U-0491/TNUNGN11427, records cycle2 CGPA3.52 A++, declared30October2024. Current official NAAC2024–2029 certificate PDF was recovered; regulator-list provenance remains the recognition basis.

Official source media: homepage logo `https://vistas.ac.in/wp-content/uploads/2026/05/vistas_logo_2.png`; logo original `media-vistas_logo_2.png` recovered from browser source capture. Candidate crop x275,y95,width125,height135 preserves complete crest/motto while excluding accreditation graphics, portraits and campus wordmark. Facilities page links authentic DrMGRBlock campus photograph `https://vistas.ac.in/wp-content/uploads/2021/12/IMG_8394-1024x683.jpg`; direct browser image visibly1024x683, complete native **Save Image As** original `campus-complete.jpg` (200000bytes), visually checked25October2026. An earlier MHTML image part `media-IMG_8394-1024x683.jpg` is truncated/grey and **must not be used**. Ordinary HTTP image requests still return an HTML challenge; do not claim ordinary direct200image success. Parent accepts genuine browser-saved originals with checksums for next grouped media review. No upload performed.

No executable VISTAS payload or numbered reservation has been created. Existing0157 typo reservation remains manifest-only and must not be reused. Research is offline with no database access; root controls next reviewed publication group.


Inventory refresh now contains **246 rows**: original199campusERProws,28additionalofficialdirectory/agricultureroute-discoveryrows awaiting current-award/campus reconciliation, and19medicalrows (MBBS,13listedMD/MS,5expresslyawaitingNMCapproval). Medicalcurrentprospectus is genuine **2026–27**, not the old2025–26document: `medical-pg-prospectus-current.pdf` from `https://velsmedicalcollege.com/pdf/pg-prospectus.pdf`,1498094bytes. MBBS2026–27prospectus `medical-mbbs2026.pdf`,22011309bytes, is predominantly scanned; programme decisions need assessed pages rather than assuming searchable extracted content.

The official faculty-wide PG2024document has now been fully recovered: `https://vistas.ac.in/wp-content/uploads/2024/10/PG-ARTS-SCIENCE-AND-HUMANITIES-REGULATIONS-2024.pdf`, local `pg-arts-science-humanities2024.pdf`. It explicitly applies to all Arts, Science and Humanities PG programmes from2024–25, gives2years/4semesters and named programme-degree matrix. Astrology's regulation requires UGspecialisation inAstrology whereas current eligibility webpage saysanydegree: only a shared qualifying route can be described; the broad any-degree claim remains unresolved. The document does not itself contain an English-medium clause; currentMBA2024allPGEnglish remains the general-policy source.

Media candidate improved to a complete **blue crest on white** source: official homepage OpenGraph image `https://vistas.ac.in/wp-content/uploads/2026/08/vels-university-logo.webp`, complete browser-native original `logo-blue-complete.webp`,1200x630. Candidate crest-only crop x275,y195,width125,height130; visually inspect exactrectangle before manifest. This is preferable to the white-on-transparent2026headercrest. FulloriginalSHA256andURLprovenance is recorded in `media-original-integrity.json`. Campuscompleteoriginalhash also recorded; both originals remain unaltered. The earlier headerlogo is not the current selectedlogo.

## Final campus and publication reconciliation — 25 October 2026

This checkpoint supersedes earlier tentative campus assignments, candidate counts and media rectangles. The durable discovery CSV now preserves **247 rows:71 packaged and176 held**. Discovery rows comprise the original199 static ERP listings across several portal/location groupings,28 further directory/agriculture discoveries,19 current medical records and one separately labelled MicrosoftCSE discovery. These are discovery records, not247 distinct current degree awards.

**The static main ERP Courses Offered table mixes teaching locations. Its143 rows must not all be labelled Pallavaram.** A read-only audit of the actual admission registration controls selected each of19 taught schools, read offered campuses and selected Pallavaram when available. The exact export `erp-campus-selectors20261025.json` contains **115 Pallavaram programme choices**, including degrees, certificates, diplomas and variants. An earlier working count125 was an arithmetic error and is superseded. Other-campus programmes were not exhaustively selected in this audit. No personal information was entered and registration was never submitted. `supported-campus-join.json` records the exact71 distinct Pallavaram programme IDs and official option labels used in this bundle.

The complete71-route draft covers16 engineering,12 computing,13 commerce/management/economics,6 life-science,5 allied-health,3 mass-communication,3 hotel/catering,3 aviation,3LLM,2languages,2music/dance,2astrology/yoga and1chemistry routes. BBAAviation is currently selected under Management, even though its university eligibility page sits under Aviation. All programme calendars and current tuition are scoped to those exact Pallavaram choices. City is the plain canonical value Chennai. University identity is Vels Institute of Science, Technology & Advanced Studies, established2008 by UGC notification, not merely the earlier trust founding date.

### Four newly removed campus cases

- BPT and MPT: SchoolPhysiotherapy currently offers only Thalambur(Physiotherapy) and Periyapalayam. No Pallavaram choice exists. Retain BPT4academic years+1internship, currentNEETappearance condition, annual tuition59500 and the published fifth-year50%tuition exception as source research; do not transfer the Pallavaram calendar or claim the route at Pallavaram. MPT is an umbrella selector; branch lists differ across current eligibility/fees.
- MBAAviation/AirportManagement: no named choice under current Pallavaram Management or Aviation. Own2024English/two-year regulation and fee evidence are retained; campus-specific current intake is held.
- MScRadiology/Imaging: own English/two-year/August regulations exist (BScRadiology/Radiography and50%university entrance), but the current Pallavaram AlliedHealth selector omits the route. No silent campus allocation.

The six current AlliedHealth Pallavaram choices are BiomedicalSciences, CardiacCare, OT/Anesthesia, PhysicianAssistant, BScRadiology/Imaging and MScClinicalEmbryology. BiomedicalSciences remains held for exact current duration/prerequisites. The other five are packaged. MLT and Echocardiography remain held for October start/qualification conflicts; Optometry remains held for September start and MasterofOptometry vsMSc award conflict, alongside absent Pallavaram selection. The four BSc health routes explicitly retain3academic years+1internship, English, August, age17by31December and50%entrance requirement from own regulations; entrance marks are not presented as HSC marks.

### Remaining deliberate holds and fee scope

Current MicrosoftCSE eligibility/labelled tuition does not establish a separately selectable standalone admission variant; hold it. GenericCSE programme1068 remains tuition **on_request** because the generic choice does not uniquely identify TCSiON versusMicrosoft tariffs. Its notes preserve both labelled merit-band tuition and equal separate OtherFee, without assigning either as universal. MTechCIM and Construction tuition are also on_request. The other68 routes use current isolated domestic tuition per semester annualised over two semesters; no future full-course total. Merit categories and shifts remain explicit, with structured alternatives where the exact route is established. Foreign/NRI/OCI rates require separate quotations.

Hold honoursBioinformatics because ERP names honours but eligibility says3years; hold SoftwareEngineering variant and MTechAI/DataScience for precise current prerequisite/award alignment. Working-professional degrees need their own mode/employment/first-entry evidence. Law1year vs2year conflicts, exact BCI/PCI/NCTE professional permissions, pharmacyNIOS discrepancy, diploma/certificate regulation scope, off-campus timetable, Agriculture foreign-awarder conflict and medical actual first-entry scope remain in each CSV row. Five proposed MD programmes are explicitly awaiting NMC approval; the current2026–27 medical prospectus is not evidence that those five are approved. Medical campus is Manjankaranai,Tiruvallur. No broad3August transfer.

UG Arts/Science medium uses a clearly dated2021 general UG clause excluding Tamil/Hindi/French language papers. Non-engineering/non-law PG general medium uses a **GradeB indexed historical2021 institutional record**, headed Common toAllPostGraduateFullTimeProgrammes, not a successfully downloaded fullPDF. Direct404/access limits and exact applicability are recorded in `historical-pg2021-indexed-extract.md`. Current2024degree continuation and non-conflicting own regulations corroborate scope; MBA2024 alone is not claimed as evidence for every faculty. Current2024PG faculty prerequisites restrict Astrology to the shared UGspecialisation route and Biotechnology to the shared BScfield route rather than promoting conflicting broad alternatives.

### Final reviewed media

Mandatory logo and cover manifest: `research/media-enrichment/india-vistas-20261025.json`. Complete authentic browser-native originals are under `research/india-source-bundles/vistas-20261025/`. Logo source is the official homepage OpenGraph2026/08/vels-university-logo.webp,1200x630,86094bytes, SHA256fae53e17435b6191cc4ed17ff3ccb2517eb2d78779c1cb547690c1a54ac03d22. Reviewed crop **x275,y195,w530,h130** retains complete crest,motto,VELSwordmark and underline; excludes portraits/NAAC/UGCshields. Cover is complete official facilities DrMGRBlock photo1024x683,200000bytes, SHA256eec614638656f85b911bff28d3c3a27e17f6aa17c4af57b1502c498b5ae70447, uncropped. Root visually approved both and the prescribed uploader's local-original preflight verified signatures, confined realpaths and checksums. `uploadFromReviewedLocalOriginal:true` preserves sourceURLs/rights. Do not claim ordinary HTTP image retrieval succeeded; raw requests return HTML challenge. Earlier headerlogo/crest-only crop and truncated MHTML campus image are superseded and unused.

The71-route draft passes offline payload schema and the existing four taxonomy tests. No database access, upload, account registration or publication was performed by this worker. Root controls the next grouped publication window. The old0157 typo reservation remains historical manifest-only; canonical identity receives a fresh numbered reservation only after complete validation.
