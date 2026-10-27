# Tamil Nadu fresh batch 1 — ten institutions

**Research delivery only. Zero live publications and zero apply-ready migrations.**
Draft PR: https://github.com/Cloud-9-Digital/studentstraffic/pull/3

This batch contains exactly the first ten fresh institutions. Rolling batches are excluded. Original68 institutions and the main/shared publishing ledger are unchanged. Claims recorded by the integrator remain local only; they do not reserve canonical remote identities.

## Reviewed status (2026-10-27)

| Institution | Inventory rows | Actual isolated framework reader | Remaining scope |
|---|---:|---|---|
| IIM Tiruchirappalli | 17 | 2 MBA draft offerings pass | Domestic-route crosswalk, 15 held rows, media |
| IIIT Tiruchirappalli | 15 | 4 B.Tech subset passes | 9 incomplete award candidates plus 2 secondary-only MSc leads; media |
| Great Lakes Chennai | 32 | PGPM/PGDM subset: 2 pass | 4 other awards held, PGCM taxonomy and category/cycle review, media |
| Thiagarajar College of Engineering | 38 | 12-offering subset passes | 12 incomplete award candidates, narrow applicant categories, media |
| Bannari Amman Institute of Technology | 43 | Not run on research fragments | Current approvals/admissions evidence; bounded completion underway |
| Sona College of Technology | 46 | Not run on research fragments | Primary-source access, complete doctoral discovery, programme facts |
| St Joseph's College, Tiruchirappalli | 97 | Not run on research fragments | Primary-source access and exact programme facts; JIM fee components retained |
| Bishop Heber College | 121 | 0/36 pass: genuine eligibility failures | All inventory rows held; exact subject eligibility and media |
| Holy Cross College, Tiruchirappalli | 88 | 0/47 pass: genuine required-document/schema failures | All rows held; audience unknown, required documents and current PG process |
| Lady Doak College | 75 | 26 UG fragments pass | 49 other inventory rows held, audience/cycle editorial review and media |

The **46 passing programme fragments** are not 46 publication-approved programmes. Actual reader tests use disposable isolated fixtures, no numbered migration reservation or database. Shape checks, custom inventory checks and the pre-existing 23 regression tests are separate stages. All per-row holds remain binding.

## Pull without disturbing local edits

From an existing clone, inspect your current work first. These commands create a separate worktree and refuse to overwrite an existing branch/path:

```sh
git status --short
git fetch origin refs/heads/codex/tn-fresh10-research-20261027:refs/remotes/origin/codex/tn-fresh10-research-20261027
git worktree add -b review/tn-fresh10-20261027 ../studentstraffic-tn-fresh10 origin/codex/tn-fresh10-research-20261027
```

Read each institution's README and integrator-review/validation files. Each supplied validator runs from the repository root with the documented command. Expected failures for held specimens are preserved, not suppressed. Full raw downloaded pages/PDFs and image binaries stay out of Git; public source registers, evidence provenance and source hashes/locators are retained.

## Before any local publication

1. Follow the current `docs/content-seeding-runbook.md`, architecture and content spec. Recheck main, the original68, remote ledger, aliases and live API before a new claim.
2. Resolve inventory, programme-specific admissions/eligibility, audience, cycle, exact fee interpretation, taxonomy and regulator holds. Do not apply an incomplete full draft or a DO-NOT-PUBLISH specimen merely because a subset passes.
3. Obtain approved logo/cover provenance, rights and visual review; use the documented authorized hosting workflow. No fake/placeholder hosted URLs.
4. Only the authorized local integrator may reserve a migration through the locked workflow, build and validate a complete immutable migration, inspect all pending migrations, and use the controlled apply workflow. No ad-hoc SQL.
5. Verify actual live page/API, hosted media, cache/search completion and database outcome before changing the ledger to published or giving a live URL.

This PR neither authorizes a merge nor performs production actions. Secrets are not part of this delivery.
