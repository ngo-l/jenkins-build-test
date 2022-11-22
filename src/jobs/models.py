from pydantic import BaseModel

class UpdateJobRequest(BaseModel):
    cron: str
