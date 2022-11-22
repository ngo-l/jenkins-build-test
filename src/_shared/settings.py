import logging
import os
from typing import Optional
from pydantic import BaseSettings, SecretStr
from src._shared.secrets_utils import get_secret

class CommonSettings(BaseSettings):
    host: str = "0.0.0.0"
    port: Optional[int] = 8080
    root_path: Optional[str] = ""
    log_level: Optional[str] = logging.getLevelName(logging.INFO)
    enable_cron: Optional[bool] = True
    azure_storage_connection_string: SecretStr = get_secret('azure_storage_connection_string')

    # TODO: check if can use other libraries to help integrating static config
    class Config:
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"


common_settings = CommonSettings()
