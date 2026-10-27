# IIM Tiruchirappalli pilot — RESUMABLE HOLD

**GitHub research delivery only. Not live-published. No live URL exists to verify. No numbered migration has been reserved.**

Latest user direction: deliver reviewed research to a dedicated GitHub branch/draft PR; the user will pull locally and own live publication. Database/media credentials are not required for this GitHub delivery and will not be requested by the research workers. The following live-publication gates are retained for the user’s local continuation, not as blockers to saving this packet.

## Deliverables

- `payload.draft.json`: two residential MBA offerings with programme-specific admissions, exact 2026–28 combined fee quotes, private evidence and current approved shared course definitions. It is deliberately not in `content-migrations/` and contains no fake Cloudinary URL.
- `research/india-programme-inventory/indian-institute-of-management-tiruchirappalli.csv` plus `.md`: complete 17-row inventory, 15 explicit audience-verification holds. Five institutional degree-route labels are distinguished from 17 prospective area-level offerings.
- `research/india-source-bundles/iim-tiruchirappalli-20261027/`: downloaded official pages, two overseas policy PDFs, extracted text and original media candidates with source hashes.
- `media-review.json`: source/visual findings and unresolved permissions/hosting, not an upload-ready manifest.
- `validation-report.json`: actual draft validation results, separate from the 23/23 existing pipeline regression tests.

## Exact production blocker

The approved cloud workspace has none of the required publication variables: DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, NEXT_PUBLIC_SITE_URL and REVALIDATE_SECRET. The connected Vercel project metadata is readable, but the request to list environment metadata with decryption disabled returned HTTP403: “You don't have permission to list the project environment variable.” No credential values were retrieved. No CLI credential fallback exists here. Do not repeat that denied action or retrieve secrets through another channel to defeat the permission boundary.

Needed: an explicitly authorised cloud publishing environment with the project’s supported credential injection, or an authorised operator performing the established migration/media workflow. Never ask for secrets in chat. The connected Mac was not authorised and was not accessed.

## Other hard gates

The two MBA drafts describe the overseas route in depth. Their separate CAT/JAP domestic route is retained in audience metadata so overseas residence conditions are not incorrectly applied to every MBA applicant. Complete the domestic qualification/document crosswalk before a global public-page migration; no requirement is borrowed from another IIM or assumed from CAT coaching sites.

1. Media: reviewed official logo and aerial cover are local only. Logo is legible; cover is dark and watermarked. Official origin alone does not establish a reusable photograph licence. Obtain a rights-cleared cover (or an approved original), record rights and final visual review, then use the required Cloudinary workflow in the same publish session. No uploads occurred.
2. Programme scope: overseas eligibility is verified only for the two residential MBAs’ closed 2026–28 policies. PGPBM and 14 doctoral-area routes remain explicit holds for unverified audience rules, not presumed global/local-only.
3. The 2026–28 MBA cycle is closed; no 2027 residential-MBA dates, intake or fee guarantee is invented. Unknown language/intake are omitted with evidence. ReviewBy is 2026-11-27 and must be refreshed if packaging later.
4. Research draft is not a numbered executable migration and is not published/validated in the ledger. Machine schema success cannot remove the media/editorial/permission holds.

## Fee/taxonomy decisions

The overseas package USD32000 covers two years and includes hostel alongside tuition and institutional services; it is stored as an exact full-course reportedFeeQuote, not annual tuition. USD16000 is an annual combined package, also not tuition. Qualifying overseas candidates include Indian nationals, so the quote uses an exact category and does not falsely label all applicants as foreign. Separate domestic combined fee INR1950000 is scoped in fee notes. No currency conversion or tuition allocation is inferred. Current shared canonical MBA definitions were retained from the latest existing migration records; facts and admissions are independently researched.

## User-owned local publication — safe resume order

1. Fetch remote; compare all ten local claims against current shared ledger, migrations and live canonical/alias routes. Resolve collisions before synchronising. Local claims are not remote reservations. Original68 must remain unchanged.
2. Re-review stale admissions/fee sources and held rows. Package every verified supported offering; leave any unresolved row explicitly held.
3. Clear rights/media source review; prepare the approved media manifest.
4. In the user’s authorised local publishing environment, use locked content:reserve, write the complete payload, perform scoped offline validation, and use queue commands for the local/remote coordinated state. Commit the complete immutable migration before applying. Do not choose a migration ID manually.
5. Controlled integrator only: inspect all pending migration bundles (apply is not scoped), run full offline validation, then the supported content:migrate -- --apply and media workflow in the authorised publishing window. No direct SQL.
6. Verify committed content count, Cloudinary HTTP200, search/cache completion, public university page and API. Only then record published and supply the verified live URL. If transaction state is uncertain, inspect supported status before retrying.

## Evidence conflicts retained

- `/overseas_pgpm` landing link points to PGPM-HR; the distinct titled PGPM PDF was independently obtained and used.
- Doctoral admission pages have contradictory one/two-area instructions and stale/mixed deadlines. Do not silently choose one.
- No current teaching-language declaration was found; English is not inferred from English-language webpages/tests.
- Exact campus acreage/distance is omitted because sources differ. No salary, placement guarantee, visa or post-study-work claim is inserted.

## Repeat the draft checks

From the repository root after installing its locked dependencies:

```bash
node --import tsx research-drafts/india/tn-fresh10-20261027/indian-institute-of-management-tiruchirappalli/validate-draft.mjs
node --import tsx scripts/university-queue.ts validate
```

The first command tests this generated draft only and rewrites its validation report. It does not run `content:validate`, connect to production or clear editorial/media holds.

## Actual framework reader verification

The final two-offering draft also passes the real `readContentMigrations` reader in an isolated disposable research fixture, with zero expired evidence. Run `node --import tsx research-drafts/india/tn-fresh10-20261027/indian-institute-of-management-tiruchirappalli/validate-framework.cjs` from the repository root. This is distinct from the existing 23 regression tests and the selected checks in `validate-draft.mjs`. It does not clear domestic-route editorial completion, the 15 held inventory rows, media rights/hosting or local publication gates. User-owned live publication is outside this GitHub research delivery.
