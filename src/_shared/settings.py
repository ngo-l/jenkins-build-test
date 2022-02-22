import logging
import os
from typing import Literal, Optional
from pydantic import BaseSettings

Environment = Literal["development", "staging", "production"]


class CommonSettings(BaseSettings):
    host: str = "0.0.0.0"
    port: Optional[int] = 8080
    root_path: Optional[str] = ""
    environment: Environment = "production"
    log_level: Optional[str] = logging.getLevelName(logging.INFO)
    azure_storage_connection_string: str

    # TODO: check if can use other libraries to help integrating static config
    class Config:

        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"


common_settings = CommonSettings()
