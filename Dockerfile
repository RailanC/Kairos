FROM php:8.1-apache

# Provide a non-secret default for APP_ENV (can be overridden by Railway)
ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="/root/.composer/vendor/bin:${PATH}"

# Apache document root (used by the sed replacement below)
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

# FIX: Disable conflicting MPMs and ensure rewrite is enabled
# This prevents the "More than one MPM loaded" error
RUN a2dismod mpm_event mpm_worker || true \
 && a2enmod mpm_prefork \
 && a2enmod rewrite

# Install Composer binary from official composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy only composer files and install PHP dependencies (no scripts at build time)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction --optimize-autoloader

# Copy application code
COPY . .

# Ensure Apache uses the Symfony public directory
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Ensure necessary directories exist and are writable by www-data
RUN mkdir -p /var/www/html/var /var/www/html/public /var/www/html/vendor \
 && chown -R www-data:www-data /var/www/html/var /var/www/html/vendor /var/www/html/public \
 && chmod -R 755 /var/www/html

# Copy entrypoint and make it executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Apache listens on 80
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]