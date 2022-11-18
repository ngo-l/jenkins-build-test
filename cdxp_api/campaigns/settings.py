from pydantic import BaseSettings


class CampaignSettings(BaseSettings):
    schedule_minutes_in_advance: int = 5

    class Config:
        env_prefix = "APP_CAMPAIGN_"


campaign_settings = CampaignSettings()
