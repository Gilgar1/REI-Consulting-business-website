# Django backend for REI Consulting

This backend provides REST APIs for the React frontend in `Client/`. It uses Django, Django REST Framework, and PostgreSQL. JWT auth is available via Simple JWT.

Quick start (development):

1. Copy `.env.example` to `.env` and update values.

2. Build & run with Docker Compose:

```powershell
docker-compose up --build
```

3. Run migrations and create a superuser (in another terminal):

```powershell
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

4. Frontend dev server runs separately with `npm start` in `Client/`.

API endpoints (examples):

- `GET /api/properties/`
- `GET /api/services/`
- `GET /api/articles/`
- `GET /api/who-we-are/`
- `GET /api/why-choose/`

Authentication:

- Obtain JWT: `POST /api/token/` with `username` and `password`
- Refresh JWT: `POST /api/token/refresh/`

Production notes:

- Ensure you set `SECRET_KEY`, `DATABASE_URL`, and `ALLOWED_HOSTS` in the environment or `.env` for production.
- Example `DATABASE_URL` for Postgres: `postgres://user:password@hostname:5432/dbname`
- Run `python manage.py collectstatic --noinput` before starting Gunicorn in production.
- To enable Sentry, set `SENTRY_DSN` in the environment.

Backups:

- A management command `python manage.py create_backup --output-dir /tmp/backups` is available to dump the database and optionally upload media to S3 when `BACKUP_S3_BUCKET` and AWS credentials are configured.
