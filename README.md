# Pisunpa Project

Repositorio monorepo del proyecto **pisunpa.com**.

## Estructura

```
├── frontend/    # Angular (SPA)
├── backend/     # Python (API)
└── database/    # PostgreSQL (init + seed)
```

## Arranque rápido

```bash
docker-compose up --build
```

Esto levantará:

- **Frontend** en `http://localhost:4200`
- **Backend** en `http://localhost:8000`
- **PostgreSQL** en `http://localhost:5432`
