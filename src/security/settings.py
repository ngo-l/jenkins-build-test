
import os
from typing import Optional

from pydantic import BaseSettings

class SecuritySettings(BaseSettings):
    basic_username: str
    basic_password: str

    # TODO: check if can use other libraries to help integrating static config
    class Config:
        env_prefix = "AUTH_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"

security_settings = SecuritySettings()
