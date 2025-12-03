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
