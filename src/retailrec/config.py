"""Central configuration for the RetailRec MLOps platform.

All paths, service endpoints, and key hyperparameters are defined here and loaded
from environment variables (with sensible local-dev defaults). Every other module
imports `settings` from here so there is a single source of truth and no
training/serving skew in feature or path definitions.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Repo root = two levels up from this file (src/retailrec/config.py -> repo root)
REPO_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Runtime configuration, overridable via environment variables / .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="RETAILREC_",
        extra="ignore",
    )

    # ---- Paths ----
    repo_root: Path = REPO_ROOT
    data_dir: Path = REPO_ROOT / "data"
    raw_dir: Path = REPO_ROOT / "data" / "raw"
    interim_dir: Path = REPO_ROOT / "data" / "interim"
    processed_dir: Path = REPO_ROOT / "data" / "processed"
    artifacts_dir: Path = REPO_ROOT / "artifacts"

    # ---- Sampling (keeps the build laptop-runnable; set sample_users=0 for full data) ----
    sample_users: int = Field(default=50_000, description="Number of customers to sample; 0 = all")
    sample_min_transactions: int = Field(
        default=5, description="Drop users with fewer than this many transactions"
    )
    random_seed: int = 42

    # ---- MLflow ----
    mlflow_tracking_uri: str = "http://localhost:5000"
    mlflow_experiment: str = "retailrec"

    # ---- Object storage (MinIO, S3-compatible) ----
    s3_endpoint_url: str = "http://localhost:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: str = "minioadmin"
    s3_bucket: str = "retailrec"
    aws_region: str = "us-east-1"

    # ---- Redis (Feast online store + serving cache) ----
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0

    # ---- Postgres (MLflow backend + A/B experiment log) ----
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "retailrec"
    postgres_password: str = "retailrec"
    postgres_db: str = "retailrec"

    # ---- Model hyperparameters ----
    embedding_dim: int = 64
    retrieval_top_k: int = 200
    rank_top_k: int = 12

    @property
    def postgres_uri(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def redis_connection_string(self) -> str:
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}"

    def ensure_dirs(self) -> None:
        """Create the local data/artifact directories if they don't exist."""
        for d in (self.raw_dir, self.interim_dir, self.processed_dir, self.artifacts_dir):
            d.mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
