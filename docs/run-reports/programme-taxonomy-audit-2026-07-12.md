# Programme Taxonomy Audit — 12 July 2026

Migration `0063_programme_taxonomy_foundation` was applied successfully before this audit. The audit
was read-only and did not remap, unpublish or delete any offering.

## Result

| Legacy category | Offerings | Clear proposed mapping | Held for research |
|---|---:|---:|---:|
| Medical PG / Residency | 5 | 0 | 5 |
| Pharmacy | 7 | 5 | 2 |

All five Medical PG records use university-level umbrella descriptions rather than a named
speciality. They must be researched from official speciality/residency pages before they can map to
an approved MD/MS programme.

### Pharmacy mappings requiring verification

- `albanian-university` → `integrated-mpharm`
- `aldent-university` → `integrated-mpharm`
- `catholic-university-our-lady-of-good-counsel-unizkm` → `integrated-mpharm`
- `hanoi-university-of-pharmacy` → `bpharm`
- `van-lang-university` → `bpharm`

These are proposed from the existing titles and must still pass official-source verification before
the database relationship changes.

### Pharmacy offerings held

- `international-medical-university` — title says only “Pharmacy”.
- `jalal-abad-state-university-named-after-b-osmonov-medical-faculty` — the available title and URL
  do not establish the award level.

## Safety decision

The legacy `medical-pg` and `pharmacy` course rows remain readable for existing public pages but are
inactive for new programme writes. No published URL was changed during this foundation migration.
