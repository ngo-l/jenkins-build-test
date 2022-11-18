import os
from pydantic import BaseModel, BaseSettings, SecretStr

from .._shared.secrets_utils import get_secret


class Jobs(BaseModel):
    estimate_audience_size: int
    estimate_version_size: int
    campaign_launch: int


class DatabricksSettings(BaseSettings):
    host: str
    token: SecretStr = get_secret("app_databricks_token")
    jobs: Jobs
    cdxp_workflow_config_path: str

    class Config:
        env_prefix = "APP_DATABRICKS_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"
