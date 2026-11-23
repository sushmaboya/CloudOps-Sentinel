"""Application configuration module using Pydantic Settings."""

from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application runtime and security settings."""

    # Project Metadata
    PROJECT_NAME: str = "CloudOps Sentinel"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Intelligent Cloud Monitoring and Auto-Remediation Platform"
    API_V1_PREFIX: str = "/api/v1"

    # Runtime Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Settings
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Cloud Simulation Notice
    IS_SIMULATED: bool = True
    SIMULATION_REGION: str = "us-east-1"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parse comma-separated strings into a list of allowed origins."""
        if isinstance(v, str) and not v.startswith("["):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
