"""Command-line entry point for the RetailRec pipeline.

Usage:
    retailrec --help
    retailrec info
Sub-commands are registered per phase as the pipeline grows (data, train, serve, ...).
"""

from __future__ import annotations

import typer
from rich.console import Console
from rich.table import Table

from retailrec import __version__
from retailrec.config import settings

app = typer.Typer(
    help="RetailRec MLOps platform CLI.",
    no_args_is_help=True,
    add_completion=False,
)
console = Console()


@app.callback()
def main() -> None:
    """RetailRec MLOps platform CLI. Sub-commands are added per build phase."""


@app.command()
def info() -> None:
    """Print the resolved configuration (paths, services, sampling)."""
    table = Table(title=f"RetailRec MLOps v{__version__}")
    table.add_column("Setting", style="cyan", no_wrap=True)
    table.add_column("Value", style="white")
    table.add_row("repo_root", str(settings.repo_root))
    table.add_row("raw_dir", str(settings.raw_dir))
    table.add_row("processed_dir", str(settings.processed_dir))
    table.add_row("sample_users", f"{settings.sample_users:,} (0 = all)")
    table.add_row("mlflow_tracking_uri", settings.mlflow_tracking_uri)
    table.add_row("s3_endpoint_url", settings.s3_endpoint_url)
    table.add_row("redis", settings.redis_connection_string)
    table.add_row("postgres", f"{settings.postgres_host}:{settings.postgres_port}/{settings.postgres_db}")
    table.add_row("embedding_dim", str(settings.embedding_dim))
    console.print(table)


if __name__ == "__main__":
    app()
