# Canonical Programme Taxonomy

This document defines how Students Traffic names and maps Medicine, Nursing, Pharmacy, Engineering
and Business/MBA programmes.
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
   use the nearest incorrect programme.
6. Adding a canonical programme requires a stable slug, Indian-facing name, short name, level,
   stream, discipline, aliases, documentation review and a taxonomy test run.

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

## Initial approved scope

The first registry intentionally covers undergraduate medicine, common MD/MS specialities, B.Sc.
Nursing, bachelor and integrated-master Pharmacy programmes, common Engineering bachelor's
programmes and MBA specialisations. It does not yet include super-speciality medicine, every
Engineering master's degree or non-MBA business master's degree. Add those only when a selected
university requires them.

Programme pages and metadata must use the official programme title where the page describes one
specific university offering. Catalogue and discovery pages may use the canonical programme name.
