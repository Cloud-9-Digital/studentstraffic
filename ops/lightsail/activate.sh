#!/usr/bin/env bash
set -euo pipefail
scope=${1:?scope required}
sha=${2:?SHA required}
digest=${3:?archive digest required}
if ! [[ "$sha" =~ ^[0-9a-f]{40}$ && "$digest" =~ ^[0-9a-f]{64}$ ]]; then exit 2; fi
case "$scope" in
  production) user=st_prod_web; a=3941; b=3942; gateway=3940;;
  rehearsal) user=studentstraffic; a=3943; b=3944; gateway=3945;;
  *) exit 2;;
esac
base="/srv/studentstraffic/releases/$scope"
config="/etc/nginx/conf.d/studentstraffic-$scope-active.conf"
unit="studentstraffic-ci-$scope"
cd /
exec 9>/run/lock/studentstraffic-release.lock
flock -w 120 9
upload=$(mktemp "/run/studentstraffic-upload.XXXXXX")
previous=$(mktemp "/run/studentstraffic-upstream.XXXXXX")
cp -- "$config" "$previous"
current=$(sed -n 's/.*default 127\.0\.0\.1:\([0-9]*\);.*/\1/p' "$previous")
case "$current" in
  "$a") slot=b; port="$b";;
  "$b"|3937|3917) slot=a; port="$a";;
  *) echo "Unknown active upstream: $current" >&2; exit 1;;
esac
candidate="$unit@$slot.service"
release_path="$base/versions/$sha"
work=
switched=0
started=0
committed=0
finish() {
  rc=$?
  trap - EXIT
  if (( committed == 0 )); then
    if (( switched )); then
      install -m 644 -- "$previous" "$config"
      nginx -t && systemctl reload nginx
      echo 'Restored the previously working upstream.' >&2
    fi
    if (( started )); then
      systemctl disable "$candidate" >/dev/null 2>&1 || true
      systemctl stop "$candidate" || true
    fi
  fi
  unlink "$upload"
  unlink "$previous"
  if [[ -n "$work" && -d "$work" ]]; then
    runuser -u "$user" -- find "$work" -mindepth 1 -delete || true
    rmdir "$work" || true
  fi
  exit "$rc"
}
trap finish EXIT
trap 'exit 130' INT HUP TERM

# The stream has a hard size limit; a truncated stream cannot match the supplied digest.
timeout 180 head -c 450000001 > "$upload"
[[ "$(stat -c %s "$upload")" -le 450000000 ]]
printf '%s  %s\n' "$digest" "$upload" | sha256sum --check --status
if [ -d "$release_path" ]; then
  test "$(cat "$base/versions/$sha.digest")" = "$digest"
else
  work=$(mktemp -d "$base/versions/.incoming.XXXXXX")
  chown "$user:$user" "$work"
  runuser -u "$user" -- python3 /usr/local/lib/studentstraffic/release-extract.py /dev/stdin "$work" < "$upload"
  test "$(runuser -u "$user" -- cat "$work/RELEASE_SHA")" = "$sha"
  mv -- "$work" "$release_path"
  work=
  printf '%s\n' "$digest" > "$base/versions/$sha.digest"
fi

if [[ "$(readlink "$base/a" || true)" == "$release_path" && "$current" == "$a" ]] ||
   [[ "$(readlink "$base/b" || true)" == "$release_path" && "$current" == "$b" ]]; then
  committed=1
  echo "Release $sha is already active."
  exit 0
fi
systemctl stop "$candidate"
ln -sfn -- "$release_path" "$base/$slot"
started=1
systemctl start "$candidate"

healthy() {
  curl --silent --show-error --fail --max-time 4 -H 'Host: www.studentstraffic.com' \
    "http://127.0.0.1:$1/api/mobile/v1/universities?country=georgia&pageSize=2" |
    python3 -c 'import json,sys; x=json.load(sys.stdin); assert x["universities"]'
}
ready=0
for _ in $(seq 1 20); do
  if healthy "$port" 2>/dev/null; then ready=1; break; fi
  sleep 2
done
if (( ready == 0 )); then
  echo 'Candidate never passed the private catalogue check. Existing traffic was not switched.' >&2
  exit 1
fi
systemctl enable "$candidate" >/dev/null
if [[ "$scope" == production ]]; then
  # Reuse immutable chunks from old releases for browsers that still have their HTML open.
  rsync -a --no-links --ignore-existing --chmod=D755,F644 "$release_path/.next/static/" /srv/studentstraffic/release-static/
fi
printf 'map $host $st_%s_backend { default 127.0.0.1:%s; }\n' "$scope" "$port" > "$config.next"
chmod 644 "$config.next"
mv -f -- "$config.next" "$config"
switched=1
nginx -t
systemctl reload nginx
gateway_ok=0
for _ in $(seq 1 12); do
    if curl -sS --fail --max-time 4 -D - -o /dev/null "http://127.0.0.1:$gateway/api/mobile/v1/universities?country=georgia&pageSize=2" 2>/dev/null | grep -iFq "X-ST-Release-Port: 127.0.0.1:$port" &&
       healthy "$gateway" 2>/dev/null; then gateway_ok=1; break; fi
    sleep 1
done
if (( gateway_ok == 0 )); then
    echo "Proxy smoke check failed; rolling back." >&2
    exit 1
fi
if [[ "$scope" == production ]]; then
  curl -fsS --retry 2 --max-time 7 https://www.studentstraffic.com/ -o /dev/null
  curl -fsS --retry 2 --max-time 7 'https://www.studentstraffic.com/api/mobile/v1/universities?country=georgia&pageSize=2' |
    python3 -c 'import json,sys; assert json.load(sys.stdin)["universities"]'
fi
committed=1
echo "Activated $scope release $sha on 127.0.0.1:$port."
if [[ "$current" == "$a" || "$current" == "$b" ]]; then
  old=a; if [[ "$current" == "$b" ]]; then old=b; fi
  systemctl disable "$unit@$old.service" >/dev/null || true
  systemd-run --quiet --collect --unit="st-retire-$scope-$old-$(date +%s)" --on-active=30s \
    /usr/local/lib/studentstraffic/release-retire "$scope" "$current" "$unit@$old.service" || true
fi
