# Applied India receipt reconciliation —25 October2026

Independent offline pass confirms the saved Group33 totals: **86 new profiles and3,152 unique programme additions** relative to the last receipted pre0170 baseline. Reconstructed latest applied India snapshot contains **121 profiles and4,139 unique programme slugs**, versus baseline35profiles/987programmes. New profiles contribute2,852 current programmes; expansions of baseline profiles add300. There are no baseline programme removals or current cross-profile programme-slug collisions.

Used exactly290 unique IDs from `/private/tmp/tn-applied-ids.json`, not a numeric maximum or every local migration. Reserved/unapplied0310 excluded. Latest whole-profile payload per universityslug was selected only from those explicit receipts; forward snapshots replace prior snapshots, preventing repeated-forward double counting. Saved Group33 receipt/count JSON agrees exactly.

Ledger reconciliation:118 exact applied checkpoint/count/path matches; three expected future validated forwards (WCC0334, AnnaAdarsh0335, QMC0336) excluded from applied totals. **Zero unexplained applied/ledger mismatches**, zero applied India profiles missing ledger rows, zero extra published/validated ledger profiles absent receipts. Active research owners with published unchanged pointers/counts are valid, not mismatches.

Known historical0300BIHER duplicate Paediatrics slugs are recorded transparently; latest0302 correction restores49 distinct intended degrees, so these do not affect the current unique count. No novel issue detected. Current snapshot records every university’s latest applied ID, programme slug set, baseline set and additions for reproducibility.

Artifacts: `audit.json`, `latest-applied-india-snapshot.json`, read-only `reconcile.py`. No DB, API/network, sourcehunt, ledger mutation, reservation, upload or executable payload changes. Audit files only.
