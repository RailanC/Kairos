# Use an official PHP image
FROM php:8.1-fpm

# Provide a non-secret default for APP_ENV (can be overridden by Railway)
ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="/root/.composer/vendor/bin:${PATH}"

# Install system dependencies and PHP extensions commonly used by Symfony
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    zlib1g-dev \
    libonig-dev \
  && docker-php-ext-install pdo pdo_mysql intl mbstring zip opcache \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer (copy from official composer image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy only composer files and install dependencies (no scripts at build time)
COPY composer.json composer.lock ./
# We use --no-scripts to avoid running cache:clear etc. at build time (which may require env)
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction --optimize-autoloader

# Copy application code
COPY . .

# Ensure vendor files are present (if you used composer cache above)
# If you want vendor folder to be created at runtime instead, remove composer install above.
RUN mkdir -p /var/www/html/var \
 && chown -R www-data:www-data /var/www/html/var /var/www/html/vendor || true

# Copy entrypoint and make it executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]