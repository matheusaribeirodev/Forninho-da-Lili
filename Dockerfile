# Mesmo Dockerfile do projeto lojaFS: serve o HTML hoje e o PHP + SQLite depois.
FROM php:8.2-apache

RUN apt-get update && apt-get install -y libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_sqlite

COPY . /var/www/html/

# Página 404 própria e bloqueio do acesso direto à pasta do banco
RUN echo 'ErrorDocument 404 /404.html' > /etc/apache2/conf-enabled/forninho.conf \
    && echo '<Directory /var/www/html/banco>\n  Require all denied\n</Directory>' >> /etc/apache2/conf-enabled/forninho.conf \
    && chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

EXPOSE 80
