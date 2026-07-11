# Research Scope — Constructor University, Bremen

## Selection status

**Selected as the first Engineering and MBA expansion pilot on 12 July 2026.**

Constructor University is not currently present in the database. Germany already has a published
country page, so this batch does not create a second country record. The Germany page must receive a
freshness check for admissions, costs and visa content before publication, but it should be updated
only if verified information has changed.

## Why this university was selected

- One residential campus in Bremen, avoiding multi-campus ambiguity in the current university model.
- Private, state-recognised German university with unlimited state recognition granted in 2021.
- All current bachelor's and master's programmes are stated by the university to be accredited.
- English is the university's teaching and research language.
- The official website publishes programme pages, handbooks, fees, application periods and
  international admissions information.
- The university offers both Engineering-related bachelor's programmes and two distinct on-campus
  MBA formats. The two MBA offerings map to one canonical `mba` course and therefore test the new
  slug-based programme identity correctly.

## Canonical identity

```yaml
countrySlug: germany
universitySlug: constructor-university-bremen
officialName: Constructor University Bremen gGmbH
publicName: Constructor University
city: Bremen
type: Private
officialWebsite: https://constructor.university/
researchOwner: Students Traffic content pipeline
reviewDate: 2026-07-12
```

The previous names `International University Bremen` and `Jacobs University Bremen` are historical
aliases, not separate universities.

## Initial programme scope

| Official programme | Canonical slug | Decision |
|---|---|---|
| Computer Science — Bachelor of Science | `be-btech-computer-science-engineering` | Research |
| Electrical and Computer Engineering — Bachelor of Science | `be-btech-electronics-communication-engineering` | Research |
| Robotics and Intelligent Systems — Bachelor of Science | `be-btech-robotics-automation-engineering` | Research |
| Industrial Engineering & Management — Bachelor of Science | `be-btech-industrial-engineering-management` | Research |
| Master of Business Administration — 120 ECTS / two years | `mba` | Research as a distinct offering |
| One-Year Master of Business Administration — 60 ECTS | `mba` | Research as a distinct offering |

The Indian-facing canonical labels do not replace the official Bachelor of Science or MBA award
titles. Every programme page must show the exact official title prominently.

## Discovery boundary

Research the university's complete current degree catalogue, but publish only offerings that map
accurately to the approved taxonomy. International, nationality, residency or visa restrictions must
be recorded and displayed but do not by themselves remove a legitimate programme. For every unmatched degree:

1. record the official title and URL;
2. classify it as outside the current stream scope or as a proposed taxonomy addition;
3. do not force it into the nearest approved programme;
4. do not publish certificates, minors, executive short courses, online-only programmes or
   discontinued programmes as full on-campus degrees.

Cybersecurity, data science, supply chain and business analytics specialisations inside a broader
degree are described within that offering unless Constructor publishes them as separate awards.

## Required source bundles

- University identity, history, campus and official contact details
- Bremen state recognition and German programme accreditation
- Official programme page and current handbook for each offering
- International/Indian academic entry requirements and English requirements
- 2026/27 tuition, mandatory fees, accommodation and payment terms
- Intake, application period and official application route
- Scholarships and financing, with eligibility and limitations
- Internship, practical training and industry information
- Germany visa/work rules from official government sources

Internal starting sources:

- https://constructor.university/about
- https://constructor.university/accreditation
- https://constructor.university/programs/undergraduate-education
- https://constructor.university/programs/mba-programs
- https://constructor.university/student-life/registrar-services/study-program-handbooks

## Publish gate

Publish the university and all passing in-scope programmes in one transaction. Hold the complete
payload if programme identity, international eligibility, fees, recognition or source freshness
fails validation. After publication, revalidate only Germany, Constructor University, the mapped
canonical courses and the six programme URLs.
