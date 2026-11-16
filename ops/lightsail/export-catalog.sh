#!/usr/bin/env bash
set -euo pipefail
# This is a fixed read-only export of public CMS and catalogue content only.
# No private brochures, drafts, lead records, user records, or research notes.
case "${1:-}" in
  rehearsal) db=st_rehearsal;;
  production) db=st_production;;
  *) exit 2;;
esac
umask 077
dir=$(mktemp -d /tmp/st-public-catalog.XXXXXXXX)
trap 'rm -rf -- "$dir"' EXIT
cd "$dir"
{
  printf 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;\n'
  while IFS=$'\t' read -r table columns filter; do
    select_columns=$columns
    if [[ "$table" == universities ]]; then
      select_columns="${columns/%,brochure/,CASE WHEN brochure IS NOT NULL THEN jsonb_build_object() ELSE NULL END}"
    elif [[ "$table" == program_offerings ]]; then
      # The sitemap uses only the presence of two or more research sources.
      # Preserve that signal without sending the private URLs to the runner.
      select_columns="${columns/%,source_urls/,array_fill(chr(32), ARRAY[least(cardinality(source_urls), 2)])}"
    fi
    printf '%s\n' "\\copy (SELECT $select_columns FROM public.$table WHERE $filter) TO '$table.csv' WITH CSV"
  done < /usr/local/lib/studentstraffic/release-catalog.tsv
  printf 'COMMIT;\n'
} > export.sql
psql -X -v ON_ERROR_STOP=1 -d "$db" -q -f export.sql >&2
tar -czf - -- ./*.csv
