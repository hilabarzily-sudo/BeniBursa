from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    worker_secret: str = "dev-shared-secret-change-me"
    whisper_model: str = "base"
    work_dir: Path = Path("/tmp/benibursa-worker")
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    anthropic_api_key: str | None = None


@lru_cache
def get_settings() -> Settings:
    s = Settings()
    s.work_dir.mkdir(parents=True, exist_ok=True)
    return s
