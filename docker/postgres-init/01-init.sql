-- Runs once on first Postgres boot (mounted into docker-entrypoint-initdb.d).
-- MLflow creates its own tables in the public schema; we isolate the A/B
-- experiment logging in its own schema to keep things tidy.
CREATE SCHEMA IF NOT EXISTS ab;
