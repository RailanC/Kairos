# Dockerfile for Kairos (Symfony) using Apache + PHP 8.1
FROM php:8.1-apache

# Non-secret defaults (can and should be overridden by Railway environment variables)
ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="/root/.composer/vendor/bin:${PATH}"
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

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

# FIX: Ensure only the prefork MPM is enabled (required for mod_php) and enable rewrite
RUN a2dismod mpm_event mpm_worker || true \
 && a2enmod mpm_prefork \
 && a2enmod rewrite

# Install Composer binary from the official Composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files and install PHP dependencies (no scripts at build time)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction --optimize-autoloader

# Copy the rest of the application
COPY . .

# Make sure Apache uses the Symfony public directory as DocumentRoot
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Ensure necessary directories exist and have correct ownership/permissions
RUN mkdir -p /var/www/html/var /var/www/html/public /var/www/html/vendor \
 && chown -R www-data:www-data /var/www/html/var /var/www/html/vendor /var/www/html/public \
 && chmod -R 755 /var/www/html

# Copy entrypoint and make it executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose HTTP port for Railway (Railway should map to port 80)
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]