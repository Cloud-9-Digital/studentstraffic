#!/usr/bin/env bash
set -euo pipefail
command=${1:?expected SHA or catalog}
archive=${2:?expected archive path}
if ! [[ "$RELEASE_SSH_HOST" =~ ^[a-zA-Z0-9.-]+$ ]]; then exit 2; fi
case "$RELEASE_SSH_USER" in st_ci_rehearsal|st_ci_production) ;; *) exit 2;; esac
test -n "$RELEASE_SSH_KEY"
test -n "$RELEASE_KNOWN_HOSTS"
umask 077
dir=$(mktemp -d)
trap 'if [ -f "$dir/key" ]; then unlink "$dir/key"; fi; if [ -f "$dir/hosts" ]; then unlink "$dir/hosts"; fi; rmdir "$dir"' EXIT
printf '%s\n' "$RELEASE_SSH_KEY" > "$dir/key"
printf '%s\n' "$RELEASE_KNOWN_HOSTS" > "$dir/hosts"
unset RELEASE_SSH_KEY
ssh_cmd=(ssh -T -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
  -o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 \
  -i "$dir/key" -o "UserKnownHostsFile=$dir/hosts" \
  -- "$RELEASE_SSH_USER@$RELEASE_SSH_HOST")
if [[ "$command" == catalog ]]; then
  timeout 90 "${ssh_cmd[@]}" catalog < /dev/null > "$archive"
elif [[ "$command" =~ ^[a-f0-9]{40}$ ]]; then
  digest=$(sha256sum "$archive" | cut -d' ' -f1)
  "${ssh_cmd[@]}" "deploy $command $digest" < "$archive"
else
  exit 2
fi
