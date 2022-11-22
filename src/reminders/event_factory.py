
from typing import List, Optional
from src.email.emarsys.models import EdmData, ExternalEvent


class EventFactory:
    def create(self,
               data: List[dict],
               event_id: int,
               product_list_length: Optional[int],
               email_subject: Optional[str]) -> ExternalEvent[EdmData]:
        ...
