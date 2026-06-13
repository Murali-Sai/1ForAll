# ADR 0001: Per-service dependency isolation instead of one monolithic env

**Status:** Accepted · **Date:** 2026-06-12

## Context

The platform uses MLflow, Feast, Airflow, PySpark, PyTorch, XGBoost, FAISS, and a
FastAPI serving stack. Resolving all of these into a single Python environment is
**not satisfiable**:

- Feast (≤0.58) pins `redis>=4.2.2,<5`; the serving API needs `redis>=5`.
- Feast (≥0.59) pins `pyarrow>=21`; MLflow (<3) pins `pyarrow<20`.
- Airflow pins a large, version-sensitive constraint set of its own.

A universal lockfile (`uv sync` / `uv run`) therefore fails to resolve.

## Decision

Mirror how these tools are deployed in production — **separate dependency
closures per service** — rather than one shared environment:

1. **Main app venv** (`.venv`): core + `dev` + `data` + `ml` + `tracking` (MLflow
   client) + `serving` + `monitoring`. Managed imperatively with
   `uv pip install -e ".[group]"` per phase (no universal lock).
2. **Feast venv** (`.venv-feast`): Feast + its pinned deps, isolated. Used for
   `feast apply` / `feast materialize` and the Feast feature server. The serving
   API reads the online store over the feature server / Redis, so it never needs
   the Feast SDK in-process.
3. **MLflow / Airflow / infra** run as their own **Docker containers** with their
   own images (see `docker/` and `docker-compose.yml`).

Tools are invoked with `uv run --no-sync` so uv uses the env as-is.

## Consequences

- ✅ Each service has a clean, resolvable dependency set — the real-world pattern.
- ✅ Demonstrates production MLOps judgment (decoupled deployables) for the portfolio.
- ⚠️ Contributors install per-phase extras rather than one `pip install`. Documented
  in the README quickstart and `tasks.ps1`.
- ⚠️ Cross-env contracts (e.g. Feast online key schema) must stay stable; covered by
  integration tests in Phase 7.
