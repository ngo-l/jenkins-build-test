import os
from cdxp_api._shared.secrets_utils import get_secret
from pydantic import BaseSettings, SecretStr


class JwtSettings(BaseSettings):
    secret_key: SecretStr = get_secret("app_jwt_secret_key")
    algorithm: str = "HS256"
    access_token_expires: int = 3600 * 24

    class Config:
        env_prefix = "APP_JWT_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"
