from pydantic import BaseSettings


class SchedulerSettings(BaseSettings):
    timezone: str = "Asia/Hong_Kong"

    class Config:
        env_prefix = "APP_SCHEDULER_"
