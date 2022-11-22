
from pydantic import BaseSettings, SecretStr


class SecretSettings(BaseSettings):
    azure_storage_connection_string: SecretStr
    emarsys_username: str
    emarsys_token: SecretStr
    auth_basic_username: str
    auth_basic_password: SecretStr

    # TODO: check if can use other libraries to help integrating static config
    class Config:
        env_file = "conf/secrets/secrets.env"
        # secrets_dir="conf/secrets"


secret_settings = SecretSettings()


def get_secret(name):
    return getattr(secret_settings, name)
