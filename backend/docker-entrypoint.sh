#!/bin/bash
set -e

echo "==> Aplicando migraciones..."
python manage.py migrate --noinput

echo "==> Sembrando datos base..."
python manage.py seed_usuarios 2>/dev/null || true
python manage.py seed_asignaturas 2>/dev/null || true

echo "==> Recolectando estaticos..."
python manage.py collectstatic --noinput

echo "==> Iniciando gunicorn..."
exec gunicorn core_project.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120 --access-logfile -
