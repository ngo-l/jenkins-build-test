from datetime import datetime
from pydantic import BaseModel


class UpdateJobRequest(BaseModel):
    cron: str


class AdHocBlastRequest(BaseModel):
    target_datetime: datetime
    # Emarsys external event ID
    event_id: str
    blast_file_path: str
