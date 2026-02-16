#!/bin/sh
set -e

# Provide a default APP_ENV if Railway doesn't set one (can be overridden)
: "${APP_ENV:=prod}"
export APP_ENV

# Default APP_DEBUG to 0 if not set
: "${APP_DEBUG:=0}"
export APP_DEBUG

if [ ! -f /var/www/html/.env ]; then
  echo "NOTICE: /var/www/html/.env not found — relying on environment variables (Railway)."
fi

# Optionally run composer scripts or cache warmup if you explicitly enable via env var
if [ "${RUN_COMPOSER:-0}" = "1" ]; then
  composer install --no-interaction --prefer-dist
fi

# Execute main process (apache2-foreground)
exec "$@"