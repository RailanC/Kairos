#!/bin/sh
set -e

# Provide a default APP_ENV if Railway doesn't set one
: "${APP_ENV:=prod}"
export APP_ENV

# Default APP_DEBUG to 0 if not set
: "${APP_DEBUG:=0}"
export APP_DEBUG

if [ ! -f /var/www/html/.env ]; then
  echo "NOTICE: /var/www/html/.env not found — relying on environment variables (Railway)."
fi

# Warm up the Symfony cache so the app is fast on the first request
# This is safe to run here because Railway has already injected your secrets
if [ "$APP_ENV" = "prod" ]; then
    echo "Warming up cache for production..."
    php bin/console cache:clear --no-warmup --env=prod
    php bin/console cache:warmup --env=prod
fi

# Optionally run composer scripts if you explicitly enable via env var
if [ "${RUN_COMPOSER:-0}" = "1" ]; then
  composer install --no-interaction --prefer-dist
fi

# Execute main process (apache2-foreground)
exec "$@"