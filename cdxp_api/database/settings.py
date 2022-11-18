import os
from cdxp_api._shared.secrets_utils import get_secret
from pydantic import BaseSettings, SecretStr


class DatabaseSettings(BaseSettings):
    """
    asyncio-compatible dialects: https://docs.databaselchemy.org/en/14/dialects/index.html
    """

    drivername: str = "postgresql+asyncpg"
    # FIXME: maintain secretstr
    username: str = get_secret("app_database_username").get_secret_value()
    password: str = get_secret("app_database_password").get_secret_value()
    host: str = get_secret("app_database_host").get_secret_value()
    port: int = 5432
    database: str
    query: dict = {}

    class Config:
        env_prefix = "APP_DATABASE_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"
