
import os

from pydantic import BaseSettings, SecretStr
from src._shared.secrets_utils import get_secret

class SecuritySettings(BaseSettings):
    basic_username: str = get_secret('auth_basic_username')
    basic_password: SecretStr = get_secret('auth_basic_password')

    # TODO: check if can use other libraries to help integrating static config
    class Config:
        env_prefix = "AUTH_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"


security_settings = SecuritySettings()
