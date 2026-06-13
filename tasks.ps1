# Developer task runner (Windows / PowerShell equivalent of a Makefile).
#   .\tasks.ps1 <task>
#
# Dependency strategy: the heavyweight MLOps tools (MLflow, Feast, Airflow) have
# mutually-incompatible pins, so we do NOT resolve them into one universal lock.
# - The main .venv is managed imperatively with `uv pip install -e ".[group]"`.
# - Feast lives in its own .venv-feast (see Phase 2).
# - Tools are invoked with `uv run --no-sync` so uv uses the env as-is.
param([Parameter(Position = 0)][string]$Task = "help")

$ErrorActionPreference = "Stop"

switch ($Task) {
    "setup" {
        uv venv --python 3.11
        uv pip install -e ".[dev]"
        Write-Host "Base env ready. Add phase extras, e.g.: uv pip install -e '.[data]'" -ForegroundColor Green
    }
    "fmt"   { uv run --no-sync ruff format src tests }
    "lint"  { uv run --no-sync ruff check src tests }
    "test"  { uv run --no-sync pytest }
    "up"    { docker compose up -d }
    "down"  { docker compose down }
    "info"  { uv run --no-sync retailrec info }
    default {
        Write-Host "Tasks: setup | fmt | lint | test | up | down | info"
    }
}
