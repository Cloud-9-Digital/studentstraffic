# Purdue University enrichment report — 2026-07-13

## Scope

Existing `purdue-university` only. No university identity, canonical course slug, programme slug, application code, pipeline code, XLSX, git state, or unrelated university was changed.

## Audit findings and corrections

- Purdue university row: id 793, slug `purdue-university`, already published.
- Existing offering count: 12; all 12 retained with the same slugs.
- Before enrichment, all 12 `program_offerings.admissions_content` values were `{}`.
- Added programme-specific `admissionsContent` to every offering, with overview, eligibility, 4 ordered application steps, academic documents, application documents, deadline note and visa considerations.
- Removed generic fallback risk by using distinct undergraduate, CS graduate, Daniels graduate, MBA and engineering-doctoral wording.
- Corrected contaminated shared course copy that named Georgia Tech in aerospace, mechanical engineering and engineering-management metadata; Purdue-safe taxonomy descriptions now remain generic to the discipline and preserve the existing canonical slugs.
- Existing Cloudinary logo and cover URLs were retained after rights/provenance review; both are already Cloudinary-hosted and have official Purdue source attribution. No new media upload was needed.

## Official-source basis

- Undergraduate criteria, high-school preparation, English evidence and deadlines: Purdue Undergraduate Admissions — https://www.admissions.purdue.edu/apply/criteriafreshmen.php, https://www.admissions.purdue.edu/apply/highschoolcourses.php, https://www.admissions.purdue.edu/apply/engprof-tests.php, https://www.admissions.purdue.edu/apply/deadlines.php
- Aeronautical and Astronautical Engineering: https://engineering.purdue.edu/AAE/academics/undergraduate
- Mechanical Engineering: https://engineering.purdue.edu/ME/academics/undergraduate
- Computer Science undergraduate: https://www.cs.purdue.edu/undergraduate/degree-programs/index.html
- Nursing: https://nursing.purdue.edu/undergraduate/
- CS MS/PhD requirements, steps and deadlines: https://www.cs.purdue.edu/graduate/programs/mscs.html, https://www.cs.purdue.edu/graduate/programs/phd.html, https://www.cs.purdue.edu/graduate/admission/steps.html, https://www.cs.purdue.edu/graduate/admission/faq-application.html, https://www.cs.purdue.edu/graduate/admission/english.html
- Daniels MSBAIM checklist: https://business.purdue.edu/masters/programs/ms-business-analytics-and-information-management/app-checklist-baim.pdf
- Daniels MS Finance fact sheet: https://business.purdue.edu/masters/programs/ms-finance/fact-sheet-msf.pdf
- Daniels MBA formats: https://business.purdue.edu/mba/, https://business.purdue.edu/mba/one-year-mba/home.php
- Purdue Graduate School / engineering graduate mechanics: https://www.purdue.edu/gradschool/, https://engineering.purdue.edu/Engr/Academics/Graduate

## Verification

- Canonical publisher validation passed and reported 12 programme slugs, 3 cache tags and 1 path revalidated.
- Live DB: university published = true; 12/12 offerings published; 12/12 have non-empty admissions content with all required structural fields.
- Production: `https://www.studentstraffic.com/university/purdue-university` returned HTTP 200 with 1,250,674 bytes; `https://www.studentstraffic.com/bs-computer-science-purdue` returned HTTP 200 with 644,372 bytes. Both contained Purdue body content.
- Regression route: report-only. The prior programme title-shell regression remains outside this scoped content-only task; no app/lib/scripts changes were made.
