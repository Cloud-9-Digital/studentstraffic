# Periyar Maniammai Institute of Science & Technology — inventory and publication scope

Checked 2026-10-24 by codex-tn-batch2-20261024. Canonical slug `periyar-maniammai-university` is the existing ledger identity. Official institution: PMIST, Vallam, Thanjavur. **Not Periyar University (Salem) and not PRIST (Ponnaiyah Ramajayam).**

## Executable result

- Migration: `0186-india-periyar-maniammai-university`.
- Payload: `content-migrations/0186-india-periyar-maniammai-university/payload.json`.
- Scoped offline validation: `npm run content:validate -- --id 0186-india-periyar-maniammai-university` passed one migration, zero expired-evidence warnings, no database connection.
- Ledger: `validated`, owner codex-tn-batch2-20261024, 13 programmes.
- Media manifest: `research/media-enrichment/pmist-20261024-reviewed-upload-manifest.json`. Official full logo and a 2732×1124 student/Periyar Knowledge Centre cover both returned HTTP 200 and image MIME types; both visually inspected, logo legible on white. Parent must upload/apply media in publication session. No media or database apply by researcher.

## Inventory coverage

The CSV has 107 rows: regular degrees and distinct Shift 2 sessions, three newly introduced TATTI work-integrated degrees, 18 named PhD disciplines in the public doctoral admission page, 22 modular-credit-banking routes and three second/dual-degree routes. The annual report mentions 20 doctoral disciplines while the admissions page names 18; this difference remains unresolved and no PhD is packaged. Programme variants chosen within a degree (MBA Finance/HR/Marketing/Operations/Business Analytics and BTech minors/honours) are not duplicated as independent admission offerings.

Exactly 13 regular programmes have explicit international-student approval in the AICTE-issued 2026-27 EOA and are packaged: BTech Aerospace, Biotechnology, Civil, CSE, ECE, EEE, Mechanical; MTech Environmental, Wireless Communications, Nanotechnology, Renewable Energy; MBA Dual Specialization; MCA. All reuse existing canonical courses. Their English instruction and July intake are verified independently. No full inventory row with established international access is silently omitted.

Other rows are `unknown` or `not_open` for the international route and remain out of this migration. `not_open` means the EOA international-approval column is No; this is not a claim that the programme does not exist or cannot admit domestic students. A later domestic-only bundle can publish supported restrictions explicitly. Unknown rows need programme-level foreign-access verification. GAP rows concern held integrated/doctoral awards, not a disguised mapping of incompatible degrees.

## Primary evidence

- https://pmu.edu/admission/engineering.aspx — BTech branches, branch-specific subjects and minimum marks; MTech degrees and qualifying disciplines.
- https://pmu.edu/admission/sciences_applications.aspx — computing BSc/BCA/MCA/MSc awards and admission requirements.
- https://pmu.edu/admission/sciences_humanities.aspx — arts/science/education degrees; section headings contain duration errors, so use the degree regulations before packaging these rows.
- https://pmu.edu/admission/Commerce.aspx — commerce portfolio and entry qualifications.
- https://pmu.edu/admission/management.aspx — BBA variants and one dual-specialisation MBA; specialties are electives.
- https://pmu.edu/admission/architecture.aspx — architecture awards; COA verification remains a future gate.
- https://pmu.edu/admission/shift-2-courses.aspx — distinct afternoon BCom CA, BSc CS and BCA.
- https://pmu.edu/admission/mphil_phd.aspx — named doctoral disciplines; no verified start date.
- https://pmu.edu/admission/modular-based-credit-banking-scheme.aspx — hybrid/modular routes with 40% online learning. These are separate admissions/delivery routes requiring individual eligibility/visa checks, not interchangeable with regular programmes.
- https://pmu.edu/admission/dual-degree.aspx — second-degree route for existing students; three award choices, not direct-entry equivalents.
- https://pmu.edu/assets-v2/pdf/about/archives/eoa-2026-27.pdf — authentic AICTE-produced EOA: permanent institution ID 1-3673702931, application 1-46216113071, dated 16 March 2026, letter printed 23 March 2026. This is a regulator-issued document on an institutional mirror, not an unsourced institutional accreditation claim. It marks international access Yes for the packaged degrees; NRI approval Yes for the seven BTech, MBA and MCA, No for four MTech. BBA/BCA and AI/data/cyber BTech variants show international No. AICTE status is programme-specific. UGC recognition is separately verified on the regulator's own register.
- https://www.ugc.gov.in/oldpdf/Consolidated%20list%20of%20All%20Universities.pdf — UGC entry 810, deemed status 17 August 2007; nearby entries confirm distinct Periyar University and PRIST identities.
- https://pmu.edu/PMIST-Admin/StatutoryBodiesPdf/pNhu.pdf — official BTech 2020 regulations list the exact seven packaged branches and English instruction.
- https://pmu.edu/assets-v2/pdf/regulations/M.A.-MBA-MCA-M.Sc.-MSW-M.Com.-M.Tech.-Regulations-2024.pdf — current posted PG framework, effective 2024-25; programme-specific entry degrees, minimum marks, two-year regular duration, English instruction, bilingual English/Tamil examinations, industrial-training credits. These regulations resolve the copied MSc Biotechnology entry requirement on the general admissions page, but foreign access for that programme remains unknown.
- https://pmu.edu/assets-v2/img/about/academic-schedule/pdf/2025-2026.jpg — **visually inspected signed image**. Although page/file heading is 2025-26, footer explicitly states “Classes will commence on 22.07.2026 for the year 2026-2027”. The first-year UG/PG table also gives 28 July 2025. July is verified; public copy retains the 2026-27 cycle and does not imply a future deadline. OCR is imperfect, so the visible image controls the reading.
- https://pmu.edu/admission/programmefees.aspx — undated table of total first-year charges, not separately classified tuition. No academic year or domestic/foreign audience specified. Admissions pages, NRI route, regulations and annual report did not resolve a current category-specific tuition quotation; therefore all packaged fees are `on_request`. No sum of total charges is mislabeled tuition.
- https://pmu.edu/admission/nri.aspx — published NRI route and sponsorship/document list. This legacy page carries a 2022 application widget and general engineering-oriented subject rules; never infer global foreign access to every programme from it.
- https://pmu.edu/iqac/pdf/UQMS_Policy_Strategies_Mechanism.pdf — International Student Cell and International Academic Advisor support; an old general policy, used only for support-service facts.
- https://pmu.edu/admission/pdf/Hostel-fees.pdf — hostel names and charge components. Undated fee figures omitted from public budgets.
- https://pmu.edu/about/grievances-and-redressal-committee.aspx — specific grievance scope and student administrative services.
- https://pmu.edu/admission/index.aspx — campus area, hospital and sports facilities; no unsupported placement or ranking claim.

## New TATTI programmes and independent corroboration

https://pmu.edu/iqac/annualreport/2025-2026.pdf (30 April 2026 report, p32) gives 22 July 2026 commencement for BCom Fintech & AI, BSc Renewable Energy and BSc Film & TV Technology. Current homepage and partner https://www.tatti.in/course-offered/work-integrated-ug-programs/pmist/ confirm continuing promotion, but Film & TV title is “Production” there. Partner describes work-integrated delivery, internships and subject themes, without duration, entry requirements, language or foreign-access rules. These facts are insufficient for executable offerings; all three are explicitly held.

Independent discovery/corroboration was checked following user clarification: Shiksha admission overview and BA/BCom pages; CollegeDekho admission page; Collegedunia BTech admission review; uniRank profile; AcademicJobs calendar; PMIST and TATTI LinkedIn coverage. They do not replace missing restrictions or official degree mechanics. Their intake claims conflict: AcademicJobs gives July, CollegeDekho gives August and Collegedunia gives tentative August/September. The signed institutional schedule resolves the regular July baseline. AcademicJobs' prose-heavy calendar and aggregator generic entrance schedules were not used as evidence. TATTI LinkedIn and PMIST social posts corroborate partner-course activity/first-year induction, but do not establish precise admission conditions.

## Remaining holds

1. Programme-specific international access for non-AICTE arts/science/commerce, architecture, doctoral, modular and dual routes. Generic institution-wide international policy is insufficient.
2. AICTE EOA international No for new AI/cyber BTech variants, BBA/BCA and two MTech branches: do not present these as open internationally. Domestic-only review may proceed separately.
3. COA/NCTE approvals for architecture and education not verified here.
4. Exact duration/eligibility/language/foreign access for new TATTI degrees and Film & TV title conflict.
5. Doctoral list discrepancy (18 admissions disciplines vs annual-report count 20), doctoral duration/teaching language/start date and taxonomy.
6. Current tuition-only classification, academic year and category-specific rate; safely represented as on_request for this migration.
7. Media must be uploaded to Students Traffic Cloudinary by the parent before publication and applied in the same session. Payload contains no external public media hotlinks.
