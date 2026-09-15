# Legacy university guide drafts

Files in this directory predate the numbered content-migration framework. They are retained only as
research leads and must not be imported or published directly.

Do not run the historical `db:import:guide-drafts` workflow. Before reusing a draft:

1. Claim the canonical university through `npm run queue:claim`.
2. Re-research time-sensitive and high-stakes facts under the current content framework.
3. Convert useful verified facts into the current catalogue payload schema with claim-level evidence,
   controlled intake/language facets and an explicit fee state.
4. Reserve a numbered migration with `npm run content:reserve`.
5. Validate offline with `npm run content:validate`.
6. Stop at `validated`; only the controlled integrator may apply pending migrations.

The existence of a legacy JSON file does not mean the university is current, complete, claimed or
published. Current authority lives in the shared publishing ledger, numbered migrations and the
target environment's `content_migrations` table.
