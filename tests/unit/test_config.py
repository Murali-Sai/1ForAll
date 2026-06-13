"""Smoke tests for the central configuration module."""

from pathlib import Path

from retailrec.config import Settings, settings


def test_settings_loads():
    assert isinstance(settings, Settings)


def test_paths_are_under_repo_root():
    assert settings.raw_dir == settings.repo_root / "data" / "raw"
    assert settings.processed_dir.is_relative_to(settings.repo_root)
    assert isinstance(settings.repo_root, Path)


def test_connection_strings():
    assert settings.redis_connection_string.startswith("redis://")
    assert settings.postgres_uri.startswith("postgresql://")
    assert settings.postgres_db in settings.postgres_uri


def test_env_override(monkeypatch):
    monkeypatch.setenv("RETAILREC_SAMPLE_USERS", "1234")
    s = Settings()
    assert s.sample_users == 1234
