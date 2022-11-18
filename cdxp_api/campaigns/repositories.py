from uuid import UUID
from sqlalchemy.orm import Session


class CampaignRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    # async def get_campaign(id: UUID):
    #     campaign = await self.db_session.execute()
