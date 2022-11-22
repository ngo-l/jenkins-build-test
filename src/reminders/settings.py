import os

from pydantic import BaseSettings


class ReminderCommonSettings(BaseSettings):
    product_feed_data_path: str

    class Config:
        env_prefix = "REMINDER_COMMON_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"

reminder_common_settings = ReminderCommonSettings()
