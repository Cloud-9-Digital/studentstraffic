#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in production|rehearsal) ;; *) exit 2;; esac
[[ "$2" =~ ^394[1-4]$ ]]
[[ "$3" =~ ^studentstraffic-ci-(production|rehearsal)@[ab]\.service$ ]]
exec 9>/run/lock/studentstraffic-release.lock
flock -w 60 9
if ! grep -Fq "default 127.0.0.1:$2;" "/etc/nginx/conf.d/studentstraffic-$1-active.conf"; then
  systemctl stop "$3"
fi
