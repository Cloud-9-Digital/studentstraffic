#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in production|rehearsal) ;; *) exit 2;; esac
if [[ "${SSH_ORIGINAL_COMMAND:-}" == catalog ]]; then
  exec sudo -n -u postgres /usr/local/lib/studentstraffic/release-catalog "$1"
fi
if ! [[ "${SSH_ORIGINAL_COMMAND:-}" =~ ^deploy\ ([0-9a-f]{40})\ ([0-9a-f]{64})$ ]]; then exit 2; fi
exec sudo -n /usr/local/lib/studentstraffic/release-activate "$1" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
