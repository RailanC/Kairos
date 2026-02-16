#!/bin/sh
set -e

# Default APP_ENV if not provided by Railway / environment
: "${APP_ENV:=prod}"
export APP_ENV

# Default APP_DEBUG to 0 in production unless explicitly set
: "${APP_DEBUG:=0}"
export APP_DEBUG

# Warn if there is no .env — acceptable when env vars come from Railway
if [ ! -f /var/www/html/.env ]; then
  echo "NOTICE: /var/www/html/.env not found — relying on environment variables (Railway)."
fi

# Optionally run actions when container starts (db migrations, cache warmup)
# Only run these if explicitly enabled with env flags, to avoid running when secrets are missing.
if [ "${RUN_MIGRATIONS:-0}" = "1" ]; then
  echo "Running Doctrine migrations..."
  php bin/console doctrine:migrations:migrate --no-interaction || true
fi

# If you want to run composer install at container start (not recommended on Railway builds),
# ensure environment variables are available; you can enable with env var RUN_COMPOSER=1
if [ "${RUN_COMPOSER:-0}" = "1" ]; then
  composer install --no-interaction --prefer-dist
fi

# Execute the main process (php-fpm by default)
exec "$@"