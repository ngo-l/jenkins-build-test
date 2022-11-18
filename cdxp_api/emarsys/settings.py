import os
from cdxp_api._shared.secrets_utils import get_secret
from pydantic import BaseSettings, SecretStr


class EmarsysSettings(BaseSettings):
    api_base: str = "https://api.emarsys.net/api/v2"
    # FIXME: non-sense name
    user: SecretStr = get_secret("app_emarsys_user")
    token: SecretStr = get_secret("app_emarsys_token")

    opt_in_field_id: str = "31"
    vip_num_field_id: str = "10366"
    email_field_id: str = "3"
    test_event_id: int
    chunk_size: int = 1000  # Emarsys limit: The maximum number of objects per request is 1000
    audience_segment_notification_event_id: int
    failed_audience_segment_generation_event_id: int

    class Config:
        env_prefix = "APP_EMARSYS_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"


emarsys_settings = EmarsysSettings()
