import os

from pydantic import BaseSettings


class EmarsysSettings(BaseSettings):
    api_base: str
    username: str
    token: str
    opt_in_field_key: str = "31"  # field ID on Emarsys
    user_id_field_key: str = "10366"  # key ID on Emarsys
    request_size_limit: int = 1000

    class Config:
        env_prefix = "EMARSYS_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"

emarsys_settings = EmarsysSettings()
