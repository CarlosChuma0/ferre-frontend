#!/usr/bin/env sh
set -eu

# Render de template con variables de entorno
envsubst '${BACKEND_HOST} ${BACKEND_PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "=== NGINX CONF GENERADA ==="
cat /etc/nginx/conf.d/default.conf
echo "============================"

exec "$@"