FROM php:8.3-apache

WORKDIR /var/www/html

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
        /etc/apache2/sites-available/*.conf \
        /etc/apache2/apache2.conf \
        /etc/apache2/conf-available/*.conf

COPY . /var/www/html

RUN a2enmod headers rewrite \
    && chown -R www-data:www-data /var/www/html/storage

EXPOSE 80
