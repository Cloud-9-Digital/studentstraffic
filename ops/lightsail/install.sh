#!/usr/bin/env bash
# Run as the server operator, from a directory containing the matching public key.
set -euo pipefail
test "$(id -u)" = 0
scope=${1:?scope required}
case "$scope" in
  rehearsal) user=studentstraffic; active=3917; p1=3943; p2=3944; gateway=3945;;
  production) user=st_prod_web; active=3937; p1=3941; p2=3942; gateway=3940;;
  *) exit 2;;
esac
login="st_ci_$scope"
id "$login" >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash "$login"
home=$(getent passwd "$login" | cut -d: -f6)
dir=/usr/local/lib/studentstraffic
install -d -m 755 "$dir" /srv/studentstraffic/releases "$home/.ssh"
chown "$login:$login" "$home/.ssh"
chmod 700 "$home/.ssh"
install -m 755 activate.sh "$dir/release-activate"
install -m 755 ssh-gate.sh "$dir/release-gate"
install -m 644 extract.py "$dir/release-extract.py"
install -m 755 retire.sh "$dir/release-retire"
ssh-keygen -l -f "$scope.pub" >/dev/null
test "$(wc -l < "$scope.pub")" -eq 1
printf 'restrict,command="%s/release-gate %s" %s\n' "$dir" "$scope" "$(cat "$scope.pub")" > "$home/.ssh/authorized_keys"
chown "$login:$login" "$home/.ssh/authorized_keys"
chmod 600 "$home/.ssh/authorized_keys"
sudo_temp=$(mktemp)
printf '%s ALL=(root) NOPASSWD: %s/release-activate %s *\n' "$login" "$dir" "$scope" > "$sudo_temp"
visudo -c -f "$sudo_temp"
install -m 440 "$sudo_temp" "/etc/sudoers.d/studentstraffic-ci-$scope"
unlink "$sudo_temp"
install -d -m 755 "/srv/studentstraffic/releases/$scope/versions"
config="/etc/nginx/conf.d/studentstraffic-$scope-active.conf"
if [ ! -e "$config" ]; then
  printf 'map $host $st_%s_backend { default 127.0.0.1:%s; }\n' "$scope" "$active" > "$config"
fi
cat > "/etc/nginx/conf.d/studentstraffic-$scope-gateway.conf" <<EOF
server {
    listen 127.0.0.1:$gateway;
    server_name _;
    location / {
        proxy_pass http://\$st_${scope}_backend;
        proxy_set_header Host www.studentstraffic.com;
        proxy_set_header X-Forwarded-Host www.studentstraffic.com;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-ST-Release-Gateway 1;
        add_header X-ST-Release-Port \$upstream_addr always;
    }
}
EOF
for slot in a b; do
  port=$p1; if [[ "$slot" == b ]]; then port=$p2; fi
  file="/etc/studentstraffic/ci-$scope-$slot.env"
  install -m 600 /dev/null "$file"
  printf 'HOSTNAME=127.0.0.1\nPORT=%s\n' "$port" > "$file"
  if [[ "$scope" == rehearsal ]]; then printf 'ANTHROPIC_API_KEY=build-time-placeholder\n' >> "$file"; fi
done
runtime_env=/etc/studentstraffic/rehearsal.env
if [[ "$scope" == production ]]; then runtime_env=/etc/studentstraffic/production.env; fi
unit="/etc/systemd/system/studentstraffic-ci-$scope@.service"
cat > "$unit" <<EOF
[Unit]
Description=Students Traffic $scope release slot %i
Wants=network-online.target
After=network-online.target postgresql.service
[Service]
User=$user
WorkingDirectory=/srv/studentstraffic/releases/$scope/%i
EnvironmentFile=$runtime_env
EOF
if [[ "$scope" == production ]]; then
  printf 'EnvironmentFile=/etc/studentstraffic/database-local.env\n' >> "$unit"
fi
cat >> "$unit" <<EOF
EnvironmentFile=/etc/studentstraffic/ci-$scope-%i.env
ExecStart=/opt/studentstraffic-node/bin/node server.js
NoNewPrivileges=true
PrivateTmp=true
Restart=on-failure
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
if [[ "$scope" == production ]]; then
  site=/etc/nginx/sites-available/studentstraffic-production
  install -d -m 755 /srv/studentstraffic/release-static
  rsync -a --no-links --ignore-existing --chmod=D755,F644 /srv/studentstraffic/production/.next/static/ /srv/studentstraffic/release-static/
  if ! grep -q 'http://\$st_production_backend' "$site"; then
    cp -p "$site" "$site.before-ci-routing"
    sed -i 's|proxy_pass http://127.0.0.1:3937;|proxy_pass http://$st_production_backend;|' "$site"
    python3 - "$site" <<'PY'
import pathlib,sys
p=pathlib.Path(sys.argv[1]); s=p.read_text()
key='    location = /_next/image {'
assert s.count(key)==1
p.write_text(s.replace(key,'''    location ^~ /_next/static/ {
        alias /srv/studentstraffic/release-static/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
'''+key))
PY
  fi
  jobs="$dir/process-jobs.cjs"
  if grep -Fq '127.0.0.1:3937' "$jobs"; then
    cp -p "$jobs" "$jobs.before-ci-routing"
    sed -i 's/127\.0\.0\.1:3937/127.0.0.1:3940/' "$jobs"
  fi
fi
systemctl daemon-reload
if ! nginx -t || ! systemctl reload nginx; then
  if [[ "$scope" == production && -f "$site.before-ci-routing" ]]; then
    cp -p "$site.before-ci-routing" "$site"
    cp -p "$jobs.before-ci-routing" "$jobs"
  fi
  nginx -t && systemctl reload nginx
  exit 1
fi
