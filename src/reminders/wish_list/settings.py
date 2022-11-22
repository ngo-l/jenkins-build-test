import os

from pydantic import BaseSettings


class WishListReminderSettings(BaseSettings):
    container_name: str
    emarsys_event_id: int
    blast_data_path: str
    product_list_maxlength: int = 3 # from requirement
    email_subject: str
    crontab: str

    class Config:
        env_prefix = "REMINDER_WISH_LIST_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"

wish_list_reminder_settings = WishListReminderSettings()
