# Canonical Programme Taxonomy

This document defines how Students Traffic names and maps the major worldwide university programme
families across health, technology, business, law, architecture, arts, sciences, social sciences,
design, education, agriculture, hospitality, public policy and professional study.
The executable registry is `lib/data/program-taxonomy.ts`. New university offerings must select a
canonical programme from that registry; agents must not invent catalogue names during research.

## Naming model

Every programme offering has two names:

- **Canonical programme name:** the consistent global catalogue label used for navigation,
  filters, related pages and programme grouping.
- **Official programme title:** the exact title published by the university, stored on the offering.

Example:

```text
Canonical programme: B.E./B.Tech in Computer Science and Engineering
Official programme: Bachelor of Engineering in Computer Science and Artificial Intelligence
Award shown by university: BEng
```

Do not rewrite an official award as B.E. or B.Tech. The university's actual title and award must be
the primary programme-page heading for the global audience. B.E./B.Tech labels may remain as
discovery aliases for readers who use that terminology.

## Matching rules

1. Select a canonical slug only after reading the official programme title and curriculum.
2. Aliases are matching suggestions, not automatic approvals.
3. Similar-sounding programmes with materially different curricula must not be merged.
4. A specialisation is a separate offering only when the university publishes it as a distinct
   programme or award. An elective, pathway or concentration inside a general MBA remains mapped to
   `mba` and is described in the programme content.
5. If no approved programme is accurate, hold the offering and propose a taxonomy addition. Do not
   use the nearest incorrect programme. Record the university, exact official programme title,
   award, level, proposed canonical name/slug, primary source and mismatch reason in
   `research/programme-taxonomy-gaps.md`, and reference that row in the university run report.
6. Adding a canonical programme requires a stable slug, globally understandable name, short name, level,
   stream, discipline, aliases, documentation review and a taxonomy test run.

## Qualification levels

The executable registry supports foundation, certificate, diploma, associate, bachelor's,
integrated-master's, postgraduate certificate, postgraduate diploma, master's, doctorate, residency
and professional qualifications. A level describes the actual award; agents must not infer it from
programme duration or entry requirements.

## Global programme-family coverage

The registry includes common UG and PG families for Architecture and Planning, Law, Arts and
Humanities, Social Sciences, Natural Sciences, Mathematics and Statistics, Economics and Commerce,
Design and Creative Arts, Psychology, Public Health and Allied Health, Media and Communication,
Environment and Sustainability, Agriculture and Forestry, Veterinary Science, Education,
Hospitality and Tourism, Aviation/Maritime/Logistics, Public Policy/International Relations and
Information Systems, alongside the existing Medicine, Engineering, Computing and Business scope.

This is broad coverage, not permission to approximate. Universities often use interdisciplinary or
regulated titles that do not fit an existing family exactly. Record those in
`research/programme-taxonomy-gaps.md` for review rather than weakening matching accuracy.

## Current medical catalogue decisions

- The parent category is **Medical PG / Residency**. Both terms are necessary: Medical PG is
  familiar to Indian students, while residency is the term used by many international universities
  and health systems.
- Every item under Medical PG / Residency must still be a named speciality, such as `MD in General
  Medicine / Internal Medicine Residency` or `MS in General Surgery / General Surgery Residency`.
  `Residency` by itself is a category, not a publishable programme.
- International undergraduate medicine awards such as MD, General Medicine and a single-cycle
  Medicine and Surgery degree may map to `mbbs` only after recognition and equivalence checks. The
  public offering must retain its actual award; it must not claim that the university awards an
  Indian MBBS.
- Medical PG offerings map to a named MD/MS speciality and its international residency equivalent.
  `Medical PG / Residency` is the approved parent category, but it is not an individual programme
  that can be published without a speciality.
- A university-level page saying only that it offers residency or postgraduate training is not an
  official programme source. Hold it until the speciality, award, eligibility and programme URL are
  verified.
- `B.Sc. Nursing` groups equivalent first-entry professional nursing bachelor's awards while keeping
  the exact official award on the offering.
- Bachelor of Pharmacy and an integrated/single-cycle Master of Pharmacy are separate canonical
  programmes. They must not continue to share one generic `pharmacy` mapping.

## Approved postgraduate scope

Postgraduate programmes are a first-class catalogue scope, not an optional extension. The registry
covers common M.Sc. computing programmes, discipline-specific M.E./M.Tech Engineering groups,
Engineering Management, non-MBA Business master's programmes, MBA specialisations, Medical PG /
Residency specialities and integrated-master Pharmacy programmes.

Research and publish both undergraduate and postgraduate programmes offered by the selected
university when each programme has an exact approved canonical match and current primary-source
evidence. Do not omit a valid master's programme merely because the university also offers a related
bachelor's degree. Equally, do not map a specialised master's programme to a broad or inaccurate
canonical label. Hold it and propose a reviewed taxonomy addition when no exact match exists.

Programme pages and metadata must use the official programme title where the page describes one
specific university offering. Catalogue and discovery pages may use the canonical programme name.
