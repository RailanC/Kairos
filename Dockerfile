FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev unzip git zip libicu-dev \
  && docker-php-ext-install pdo pdo_pgsql intl

RUN a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf


RUN chown -R www-data:www-data var/ vendor/ \
 && chmod -R 775 var

EXPOSE 80
CMD ["apache2-foreground"]