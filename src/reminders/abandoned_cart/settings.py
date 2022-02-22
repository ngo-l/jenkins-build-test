import os

from pydantic import BaseSettings


class AbandonedCartReminderSettings(BaseSettings):
    container_name: str
    emarsys_event_id: int
    emarsys_campaign_id: int = 0
    blast_data_path: str
    product_list_maxlength: int = 3 # from requirement
    email_subject: str
    crontab: str

    class Config:
        env_prefix = "REMINDER_ABANDONED_CART_"
        env_file = f"conf/.{os.getenv('DEPLOYMENT_ENVIRONMENT', 'development')}.env"

abandoned_cart_reminder_settings = AbandonedCartReminderSettings()
