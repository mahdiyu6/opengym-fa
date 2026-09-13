#!/bin/sh
set -eu

WEB_PORT="${PORT:-8080}"

export PORT=3000
export DATA_DIR="${DATA_DIR:-/data}"
export WEB_PORT

mkdir -p "$DATA_DIR"
mkdir -p /etc/nginx/http.d
mkdir -p /run/nginx
mkdir -p /var/log/nginx
mkdir -p /var/cache/nginx

cat > /etc/nginx/http.d/default.conf <<NGINX_CONF
server {
    listen ${WEB_PORT};

    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|json|html)$ {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location ~* \.(png|jpg|jpeg|gif|ico|svg|woff|woff2|webp|avif)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_vary on;
    gzip_min_length 1024;
}
NGINX_CONF

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
