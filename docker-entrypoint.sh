#!/bin/sh
set -e

# Ensure required env vars are present
: "${APP_ENV:?Need to set APP_ENV}"
: "${APP_SECRET:?Need to set APP_SECRET}"

# Run composer post-install hooks now that runtime env vars are available
composer run-script --no-dev post-install-cmd || true

# Optionally run migrations if env var is set
if [ "${RUN_MIGRATIONS:-}" = "true" ]; then
  php bin/console doctrine:migrations:migrate --no-interaction || true
fi

# Clear & warm the cache for the environment
php bin/console cache:clear --no-warmup --no-interaction --env=${APP_ENV}
php bin/console cache:warmup --no-interaction --env=${APP_ENV}

# Execute the container's main process (e.g. apache2-foreground)
exec "$@"