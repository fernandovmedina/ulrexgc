# Ulrex CRM local database

This Docker stack validates the Supabase-compatible schema against plain PostgreSQL 16. The website and CRM default to the browser `localStorage` driver, so running Docker is optional for day-to-day UI work.

## Start

```bash
cd database
docker compose up -d
docker compose ps
```

PostgreSQL listens on `localhost:5432` with database/user/password `ulrex` / `ulrex` / `ulrex_dev`. SQL files run in filename order only when the named volume is first created.

## Reset

This deletes only the named development database volume and reapplies all migrations:

```bash
cd database
docker compose down -v
docker compose up -d
```

## Future Supabase deployment

Apply `001_schema.sql`, `002_rls.sql`, and optionally `003_seed.sql`. **Never apply `000_supabase_shim.sql` to Supabase**: Supabase already owns the `auth` schema, roles, and helper functions. Replace the demo auth/profile seed with a real Auth user before production use.

Before expecting the REST-backed driver to work, confirm these new public tables are exposed to the Data API for your project. That default has changed over time, so check the current Supabase documentation and your project API settings.
