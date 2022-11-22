import os

from pydantic import BaseSettings, SecretStr
from src._shared.secrets_utils import get_secret

class EmarsysSettings(BaseSettings):
    api_base: str
    username: str = get_secret("emarsys_username")
    token: SecretStr = get_secret("emarsys_token")
    opt_in_field_key: str = "31"  # field ID on Emarsys
    user_id_field_key: str = "10366"  # key ID on Emarsys
    request_size_limit: int = 1000

    class Config:
        env_prefix = "EMARSYS_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"

emarsys_settings = EmarsysSettings()
