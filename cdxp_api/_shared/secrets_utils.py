from pydantic import BaseSettings, SecretStr


class SecretSettings(BaseSettings):
    azure_storage_connection_string: SecretStr
    databricksshare_connection_string: SecretStr
    app_database_host: SecretStr
    app_database_username: SecretStr
    app_database_password: SecretStr
    app_jwt_secret_key: SecretStr
    app_databricks_token: SecretStr
    app_emarsys_user: SecretStr
    app_emarsys_token: SecretStr

    # TODO: check if can use other libraries to help integrating static config
    class Config:
        env_file = "conf/secrets/secrets.env"


secret_settings = SecretSettings()


def get_secret(name):
    return getattr(secret_settings, name)
