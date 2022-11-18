import logging
import os
from typing import Optional
from pydantic import BaseSettings, SecretStr
from cdxp_api._shared.secrets_utils import get_secret


class CommonSettings(BaseSettings):
    host: str = "0.0.0.0"
    port: Optional[int] = 8000
    root_path: Optional[str] = ""
    allowed_origins_regex: Optional[str] = ""
    log_level: Optional[str] = logging.getLevelName(logging.INFO)
    azure_storage_connection_string: SecretStr = get_secret("azure_storage_connection_string")
    databricksshare_connection_string: SecretStr = get_secret("databricksshare_connection_string")
    cdp_blob_path: str
    db_should_create_all: bool = False
    cron_job_update_audience_segment_and_notification_status_freq_in_minute: float
    betta_audience_segment_url: str
    cron_enabled: bool = False

    # TODO: check if can use other libraries to help integrating static config
    class Config:
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"


common_settings = CommonSettings()
