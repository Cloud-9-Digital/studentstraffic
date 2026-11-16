#!/usr/bin/env bash
set -euo pipefail
sha=${1:?expected SHA}
output=${2:?expected archive path}
[[ "$sha" =~ ^[a-f0-9]{40}$ ]]
test "$(git rev-parse HEAD)" = "$sha"
test -f .next/standalone/server.js
test -f .next/standalone/.next/BUILD_ID
cp -a public .next/standalone/
cp -a .next/static .next/standalone/.next/
printf '%s\n' "$sha" > .next/standalone/RELEASE_SHA
if find .next/standalone \( -name .git -o -name .env -o -name '.env.*' \) -print -quit | grep -q .; then
  echo "Build output contains an environment or Git file" >&2
  exit 1
fi
tar -C .next/standalone -czf "$output" .
du -h "$output"
