#!/usr/bin/env bash
set -euo pipefail
archive=${1:?catalogue archive required}
export PSQLRC=/dev/null
umask 077
dir=$(mktemp -d)
trap 'rm -rf -- "$dir"' EXIT
cd "$dir"
mapfile -t members < <(cut -f1 "$GITHUB_WORKSPACE/ops/lightsail/catalog-data.tsv" | sed -e 's|^|./|' -e 's|$|.csv|')
for name in "${members[@]}"; do
  # Write the exact expected file ourselves; never let tar extract links or directories.
  tar -xOzf "$archive" -- "$name" > "$name"
done
{
  printf 'BEGIN;\n'
  while IFS=$'\t' read -r table columns _; do
    printf '%s\n' "\\copy public.$table ($columns) FROM '$table.csv' WITH CSV"
  done < "$GITHUB_WORKSPACE/ops/lightsail/catalog-data.tsv"
  printf 'COMMIT;\n'
} | psql -X "$DATABASE_URL" -v ON_ERROR_STOP=1 -q
