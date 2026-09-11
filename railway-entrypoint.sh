#!/bin/sh
set -eu

WEB_PORT="${PORT:-8080}"

export PORT=3000
export DATA_DIR="${DATA_DIR:-/data}"
export WEB_PORT

mkdir -p "$DATA_DIR"

envsubst '${WEB_PORT}' \
  < /etc/nginx/http.d/default.conf.template \
  > /etc/nginx/http.d/default.conf

rm -f /etc/nginx/http.d/default.conf.template

node /app/api/server.js &
API_PID=$!

nginx -g 'daemon off;' &
NGINX_PID=$!

term() {
  kill -TERM "$API_PID" "$NGINX_PID" 2>/dev/null || true
}

trap term INT TERM EXIT

while kill -0 "$API_PID" 2>/dev/null \
   && kill -0 "$NGINX_PID" 2>/dev/null
do
  sleep 2
done

exit 1
